export async function getParentPageUrl(parentId: string | null | undefined) {
  let parentUrl = "";
  if (parentId) {
    const parent = await useDrizzle()
      .select()
      .from(tables.pages)
      .where(eq(tables.pages.id, parentId))
      .get();

    parentUrl = parent?.url ?? "";
  }

  return parentUrl;
}

export async function updateChildPageUrls(parentId: string, parentUrl: string) {
  const childPages = await useDrizzle()
    .select({ id: tables.pages.id, url: tables.pages.url, slug: tables.pages.slug })
    .from(tables.pages)
    .where(eq(tables.pages.parent, parentId));

  for (const child of childPages) {
    const childUrl = `${parentUrl}/${child.slug}`;

    await useDrizzle()
      .update(tables.pages)
      .set({ url: childUrl })
      .where(eq(tables.pages.id, child.id));

    await removePageCacheItem(child.url); // TODO: might not be the right url
    await updateChildPageUrls(child.id, childUrl);
  }
}

export async function getPageDescendants(pageId: string): Promise<Page[]> {
  const directChildren = await useDrizzle()
    .select()
    .from(tables.pages)
    .where(eq(tables.pages.parent, pageId));

  const descendants = [...directChildren];
  for (const child of directChildren) {
    const childDescendants = await getPageDescendants(child.id);
    descendants.push(...childDescendants);
  }

  return descendants;
}

export async function removePageCacheItem(url: string) {
  await useStorage("cache").removeItem(`nitro:functions:page:${url}.json`);
}
