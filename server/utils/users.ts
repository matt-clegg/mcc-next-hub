import type { UserInsert, UserSelect } from "~~/server/database/schema/users";

export async function getUser(id: string): Promise<UserSelect | undefined> {
  return useDrizzle()
    .query
    .users
    .findFirst({
      where: eq(tables.users.id, id)
    });
}

export async function updateUser(id: string, user: Partial<UserInsert>) {
  await useDrizzle()
    .update(tables.users)
    .set(user)
    .where(eq(tables.users.id, id));

  return getUser(id);
}
