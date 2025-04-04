import { z } from "zod";

export default eventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  return useDrizzle()
    .query
    .pages
    .findFirst({
      where: eq(tables.pages.id, id),
      with: {
        parent: true
      }
    });
  // .select()
  // .from(tables.pages)
  // .where(eq(tables.pages.id, id))
  // .get();
});
