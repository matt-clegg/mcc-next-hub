import type { H3Event } from "h3";
import { z } from "zod";

export default eventHandler(async (event) => {
  const { path } = await getValidatedQuery(event, z.object({
    path: z.string()
  }).parse);

  const page = await cachedPage(event, path);

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found"
    });
  }

  return page;
});

const cachedPage = defineCachedFunction(async (event: H3Event, path: string) => {
  return useDrizzle()
    .select()
    .from(tables.pages)
    .where(and(eq(tables.pages.url, path), eq(tables.pages.status, "published")))
    .get();
}, {
  maxAge: 60 * 60 * 24 * 30 * 365, // one year
  name: "page",
  getKey: (event: H3Event, path: string) => path
});
