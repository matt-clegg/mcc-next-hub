import { inArray, notInArray } from "drizzle-orm";
import { z } from "zod";

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    id: z.string().optional(),
    title: z.string(),
    parent: z.string().optional()
  }).parse);

  const { id, parent, title } = body;
  const newSlug = slugify(title);

  if (!id) {
    const parentUrl = await getParentPageUrl(parent);

    const newUrl = parentUrl
      ? `${parentUrl}/${newSlug}`
      : `/${newSlug}`;

    const existing = await useDrizzle()
      .select({
        id: tables.pages.id,
        url: tables.pages.url,
        title: tables.pages.title
      })
      .from(tables.pages)
      .where(eq(tables.pages.url, newUrl));

    if (existing) {
      return {
        valid: false,
        message: "Page with that url already exists",
        existing
      };
    }

    return {
      valid: true,
      message: "No conflicts"
    };
  }
  else {
    const originalPage = await useDrizzle()
      .select()
      .from(tables.pages)
      .where(eq(tables.pages.id, id))
      .get();

    if (!originalPage) {
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found"
      });
    }

    const parentUrl = await getParentPageUrl(parent);
    const newParentUrl = parentUrl
      ? `${parentUrl}/${newSlug}`
      : `/${newSlug}`;

    const allDescendants = await getPageDescendants(id);

    const newUrlMap: Record<string, string> = {};
    newUrlMap[id] = newParentUrl;

    await buildDescendantsUrls(allDescendants, newUrlMap, id);

    const allPotentialUrls = Object.values(newUrlMap);
    if (allPotentialUrls.length === 0) {
      return {
        valid: true,
        message: "No conflicts"
      };
    }

    const subtreeIds = Object.keys(newUrlMap);
    const conflicts = await useDrizzle()
      .select({
        id: tables.pages.id,
        url: tables.pages.url,
        title: tables.pages.title
      })
      .from(tables.pages)
      .where(and(inArray(tables.pages.url, allPotentialUrls), notInArray(tables.pages.id, subtreeIds))); // TODO: might be problematic

    if (conflicts.length > 0) {
      return {
        valid: false,
        message: "There are collisions with existing pages",
        conflicts
      };
    }

    return {
      valid: true,
      message: "No conflicts"
    };
  }
});

// async function getAllDescendants(id: string): Promise<{
//   id: string;
//   parent: string | null;
//   slug: string;
// }[]> {
//   const directChildren = await useDrizzle()
//     .select({
//       id: tables.pages.id,
//       parent: tables.pages.parent,
//       slug: tables.pages.slug
//     })
//     .from(tables.pages)
//     .where(eq(tables.pages.parent, id));
//
//   const descendants = [...directChildren];
//   for (const child of directChildren) {
//     const childDescendants = await getAllDescendants(child.id);
//     descendants.push(...childDescendants);
//   }
//
//   return descendants;
// }

async function buildDescendantsUrls(
  allDescendants: { id: string; parent: string | null; slug: string }[],
  newUrlMap: Record<string, string>,
  currentParentId: string): Promise<void> {
  const children = allDescendants.filter(c => c.parent === currentParentId);

  for (const child of children) {
    const parentUrlForChild = newUrlMap[child.parent!]; // might need to confirm child has parent
    newUrlMap[child.id] = `${parentUrlForChild}/${child.slug}`;

    await buildDescendantsUrls(allDescendants, newUrlMap, child.id);
  }
}
