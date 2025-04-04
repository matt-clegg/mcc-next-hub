import type { PageSelect } from "~~/server/database/schema/pages";

export default eventHandler(async () => {
  const pages = await useDrizzle()
    .select()
    .from(tables.pages);

  const nodes: Record<string, PageSelect> = {};
  const tree: PageSelect = [];

  pages.forEach((page) => {
    nodes[page.id] = { ...page, children: [] };
  });

  pages.forEach((page) => {
    if (page.parent) {
      nodes[page.parent]?.children?.push(nodes[page.id]);
    }
    else {
      tree.push(nodes[page.id]);
    }
  });

  return tree;
});
