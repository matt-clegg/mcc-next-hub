import type { SQLiteSelect, SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { asc, count, desc, like, or, getTableColumns } from "drizzle-orm";
import type { H3Event } from "h3";
import { z } from "zod";

export type ColumnMap = Record<string, SQLiteColumn>;

export function withPagination<T extends SQLiteSelect>(db: T, page: number = 1, limit: number = 10) {
  return db.limit(limit).offset(getOffset(page, limit));
}

export function withSort<T extends SQLiteSelect>(db: T, sort: string, columns: ColumnMap) {
  const dir = sort.startsWith("-") ? "desc" : "asc";
  sort = sort.replace("-", "");

  const column = columns[sort];

  if (!column) {
    return db;
  }

  if (dir === "desc") {
    return db.orderBy(desc(column));
  }
  else {
    return db.orderBy(asc(column));
  }
}

export function withTextQuery<T extends SQLiteSelect>(db: T, query: string, ...columns: SQLiteColumn[]) {
  const pattern = `%${query}%`;
  const conditions = columns.map(column => like(column, pattern));
  return db.where(or(...conditions));
}

export function withColumns(
  db: ReturnType<typeof useDrizzle>,
  source: SQLiteTable,
  fields?: string[],
  relations?: Record<string, { table: SQLiteTable; on: any }>) {
  const tableColumns = getTableColumns(source);

  let selectedColumns: Record<string, SQLiteColumn<any, any>> = {};
  const relationFields: Record<string, string[]> = {};

  if (fields && fields.length) {
    for (const field of fields) {
      if (field.includes(".")) {
        const [relationName, fieldName] = field.split(".");
        if (!relations || !relations[relationName]) {
          continue;
        }

        if (!relationFields[relationName]) {
          relationFields[relationName] = [];
        }

        relationFields[relationName].push(fieldName);
      }
      else if (field in tableColumns) {
        selectedColumns[field] = tableColumns[field];
      }
    }
  }
  else {
    selectedColumns = tableColumns;
  }

  if (Object.keys(selectedColumns).length === 0) {
    selectedColumns = tableColumns;
  }

  const relatedSelectedColumns: Record<string, any> = {};

  for (const relationName in relationFields) {
    const relation = relations![relationName];
    if (!relation) {
      continue;
    }

    const relatedTableColumns = getTableColumns(relation.table);
    const fieldsToSelect = relationFields[relationName];

    for (const fieldName of fieldsToSelect) {
      if (fieldName in relatedTableColumns) {
        const alias = `${relationName}__${fieldName}`;
        relatedSelectedColumns[alias] = relatedTableColumns[fieldName];
      }
    }
  }

  const allSelectedColumns = {
    ...selectedColumns,
    ...relatedSelectedColumns
  };

  let query = db.select(allSelectedColumns).from(source).$dynamic();

  for (const relationName in relationFields) {
    const relation = relations![relationName];
    if (!relation) {
      continue;
    }

    query = query.leftJoin(relation.table, relation.on);
  }

  return query;
}

export function mapRelations(data: { [p: string]: any }[]) {
  return data.map((item) => {
    const result: any = {};
    for (const key in item) {
      if (key.includes("__")) {
        const [relationName, fieldName] = key.split("__");
        if (!result[relationName]) result[relationName] = {};
        result[relationName][fieldName] = item[key];
      }
      else {
        result[key] = item[key];
      }
    }
    return result;
  });
}

export async function getQueryData<T>(
  event: H3Event,
  source: SQLiteTable,
  queryColumns: SQLiteColumn[] = [],
  sortColumns: ColumnMap = {},
  relations: Record<string, { table: SQLiteTable; on: any }> = {}) {
  const { page, limit } = await getPaginationQuery(event);

  const { sort, q, fields } = await getValidatedQuery(event, z.object({
    sort: z.string().optional(),
    q: z.string().optional(),
    fields: z.array(z.string()).optional()
  }).parse);

  let baseQuery = withColumns(useDrizzle(), source, fields, relations);

  let countQuery = useDrizzle()
    .select({ count: count() })
    .from(source)
    .$dynamic();

  // The order of queries matter
  // WHERE (text query) -> ORDER BY (sorting) -> LIMIT + OFFSET (pagination)

  if (q && queryColumns?.length) {
    baseQuery = withTextQuery(baseQuery, q, ...queryColumns);

    // We need to count the WHERE query to return the correct number of items for pagination
    countQuery = withTextQuery(countQuery, q, ...queryColumns);
  }

  if (sort && sortColumns && Object.keys(sortColumns).length) {
    baseQuery = withSort(baseQuery, sort, sortColumns);
  }

  baseQuery = withPagination(baseQuery, page, limit);

  const [data, [{ count: countValue }]] = await Promise.all([
    baseQuery.execute(),
    countQuery.execute()
  ]);

  const mappedData = mapRelations(data);

  return {
    data: mappedData,
    count: countValue
  } as Paginated<T>;
}
