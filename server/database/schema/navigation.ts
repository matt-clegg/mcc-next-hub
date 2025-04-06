import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { timestampColumns } from "../../utils/database";
import { pages } from "./pages";

export const navigation = sqliteTable("navigation", {
  id: text().primaryKey().$defaultFn(() => useHash()),
  name: text().notNull(),
  parent: text("parent_id").references((): AnySQLiteColumn => navigation.id, { onDelete: "set null" }),
  page: text("page_id").references(() => pages.id, { onDelete: "cascade" }),
  url: text("url"),
  order: integer("order").notNull(),
  ...timestampColumns
});

export const navigationRelations = relations(navigation, ({ one }) => ({
  parent: one(navigation, {
    fields: [navigation.parent],
    references: [navigation.id]
  })
}));

export default navigation;
