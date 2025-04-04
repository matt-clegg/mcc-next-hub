import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { timestampColumns } from "../../utils/database";

export const redirects = sqliteTable("redirects", {
  to: text().notNull(),
  from: text().notNull(),
  responseCode: integer("response_code").notNull(),
  ...timestampColumns
}, redirects => [
  primaryKey({ columns: [redirects.to, redirects.from] })
]);

export default redirects;
