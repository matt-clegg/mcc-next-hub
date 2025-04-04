export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing page id"
    });
  }

  const deletedPage = await useDrizzle()
    .delete(tables.pages)
    .where(eq(tables.pages.id, id))
    .returning({ url: tables.pages.url })
    .get();

  if (deletedPage?.url) {
    await removePageCacheItem(deletedPage.url);
  }
});
