import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { timestampColumns } from "../../utils/database";
import { credentials } from "./credentials";

export const users = sqliteTable("users", {
  id: text().primaryKey().$defaultFn(() => useHash()),
  email: text().notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  lastAccess: text("last_access").notNull().$defaultFn(() => new Date().toISOString()),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  parent: text("parent_id").references((): AnySQLiteColumn => users.id, { onDelete: "set null" }),
  ...timestampColumns
});

export const usersRelations = relations(users, ({ one }) => ({
  credentials: one(credentials),
  parent: one(users, {
    fields: [users.parent],
    references: [users.id]
  })
}));

export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export default users;
