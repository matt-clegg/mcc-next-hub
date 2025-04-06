import type { H3Event } from "h3";
import { z } from "zod";

export async function getPaginationQuery(event: H3Event) {
    return await getValidatedQuery(event, z.object({
        page: z.coerce.number().optional().default(1),
        limit: z.coerce.number().max(50).optional().default(10)
    }).parse);
}

export function getOffset(page: number, limit: number) {
    return (page - 1) * limit;
}
