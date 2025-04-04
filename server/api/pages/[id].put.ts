import { z } from "zod";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing page id"
    });
  }

  const body = await readValidatedBody(event, z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    status: z.enum(["draft", "published"])
  }).parse);

  const existing = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(eq(tables.pages.id, id))
    .get();

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found"
    });
  }

  await removePageCacheItem(existing.url);

  let newSlug = existing.slug;
  let newUrl = existing.url;

  const existingUrlPage = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(eq(tables.pages.url, newUrl))
    .get();

  if (existingUrlPage && existingUrlPage.id !== id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Page with that url already exists"
    });
  }

  const titleChanged = !!body.title && body.title.trim() !== existing.title;
  if (titleChanged) {
    newSlug = slugify(body.title!);

    const parentUrl = await getParentPageUrl(existing.parent);

    newUrl = parentUrl
      ? `${parentUrl}/${newSlug}`
      : `/${newSlug}`;
  }

  const page = await useDrizzle()
    .update(tables.pages)
    .set({
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.content !== undefined ? { content: body.content.trim() } : {}),
      status: body.status,
      slug: newSlug,
      url: newUrl
    })
    .where(eq(tables.pages.id, id))
    .returning()
    .get();

  if (titleChanged) {
    await updateChildPageUrls(id, newUrl);
  }

  return page;
});
