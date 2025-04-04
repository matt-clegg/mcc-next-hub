import { z } from "zod";

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    title: z.string(),
    content: z.string(),
    parent: z.string().optional().transform(value => value?.trim() || undefined),
    status: z.enum(["draft", "published"])
  }).parse);

  console.log("creating page", body);

  const newSlug = slugify(body.title);

  let parentUrl = "";
  if (body.parent) {
    const parent = await useDrizzle()
      .select()
      .from(tables.pages)
      .where(eq(tables.pages.id, body.parent))
      .get();

    parentUrl = parent?.url ?? "";
  }

  const newUrl = parentUrl
    ? `${parentUrl}/${newSlug}`
    : `/${newSlug}`;

  const existing = await useDrizzle()
    .select({ id: tables.pages.id, url: tables.pages.url })
    .from(tables.pages)
    .where(eq(tables.pages.url, newUrl))
    .get();

  if (existing) {
    throw createError({
      statusCode: 400,
      statusMessage: "Page with that url already exists"
    });
  }

  const newPage = {
    title: body.title.trim(),
    content: body.content.trim(),
    url: newUrl,
    slug: newSlug,
    parent: body.parent,
    status: body.status
  };

  console.log("creating page", newPage);

  const page = await useDrizzle()
    .insert(tables.pages)
    .values(newPage)
    .returning()
    .get();

  console.log("NEW PAGE", page);

  return page;
});
