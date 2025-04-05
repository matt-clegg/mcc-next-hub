import { z } from "zod";

export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  const result = useDrizzle()
    .query
    .pages
    .findFirst({
      where: eq(tables.pages.id, id),
      with: {
        parent: true
      }
    });

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found"
    });
  }

  return result;
});
