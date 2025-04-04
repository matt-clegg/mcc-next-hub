import { z } from "zod";

export default eventHandler(async (event) => {
  const { url } = await getValidatedQuery(event, z.object({
    url: z.string()
  }).parse);

  const existing = await useDrizzle()
    .select({ url: tables.pages.url })
    .from(tables.pages)
    .where(eq(tables.pages.url, url));

  return !existing || existing.length === 0;
});
