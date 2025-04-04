import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { timestampColumns } from "../../utils/database";

export const pages = sqliteTable("pages", {
  id: text().primaryKey().$defaultFn(() => useHash()),
  title: text().notNull(),
  content: text().notNull(),
  slug: text().notNull(),
  parent: text("parent_id").references((): AnySQLiteColumn => pages.id, { onDelete: "set null" }),
  url: text().notNull().unique(),
  status: text({ enum: ["published", "draft"] }),
  ...timestampColumns
});

export const pageRelations = relations(pages, ({ one }) => ({
  parent: one(pages, {
    fields: [pages.parent],
    references: [pages.id]
  })
}));

export type PageSelect = typeof pages.$inferSelect;
export type PageInsert = typeof pages.$inferInsert;

export default pages;
