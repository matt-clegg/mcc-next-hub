import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { useHash } from "../../../shared/utils/hash";
import users from "./users";

export const roles = sqliteTable("roles", {
  id: text("id").primaryKey().$defaultFn(() => useHash()),
  name: text("name").notNull(),
  description: text("description"),
  alias: text("alias").notNull().unique(),
  type: text("type", { enum: ["public", "administrative"] }).notNull(),
  visibility: text("visibility", { enum: ["public", "internal"] }).notNull()
});

export const userRoles = sqliteTable("user_roles", {
  user: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" })
}, userRoles => [
  primaryKey({ columns: [userRoles.user, userRoles.role] })
]);

export const roleRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles)
}));

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.user],
    references: [users.id]
  }),
  role: one(roles, {
    fields: [userRoles.role],
    references: [roles.id]
  })
}));
