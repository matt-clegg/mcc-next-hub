import { z } from "zod";

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.string(),
    password: z.string()
  }).parse);

  const user = await useDrizzle()
    .select({ id: tables.users.id, email: tables.users.email })
    .from(tables.users)
    .where(eq(tables.users.email, body.email))
    .get();

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials"
    });
  }

  const credentials = await useDrizzle()
    .select()
    .from(tables.credentials)
    .where(eq(tables.credentials.user, user.id))
    .get();

  if (!credentials) {
    console.error("No credentials found for user", user.id);
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials"
    });
  }

  const passwordsMatch = await verifyPassword(credentials.passwordHash, body.password);

  if (!passwordsMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials"
    });
  }

  const loggedInUser = await updateUser(user.id, {
    lastAccess: new Date().toISOString()
  });

  await setUserSession(event, { user: loggedInUser });

  return loggedInUser;
});
