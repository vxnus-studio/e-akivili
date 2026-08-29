import { type NextRequest, NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { getDatabase } from "@/db/client";
import {
  akiviliChunks,
  akiviliDatasetRevisions,
  akiviliDocuments,
  akiviliEntities,
} from "@/db/schema";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const headers = { "cache-control": "public, max-age=60, s-maxage=300" };

  if (!query) {
    return NextResponse.json({ error: "A search query is required." }, { status: 400 });
  }

  const parsedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 8);
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(50, parsedLimit)) : 8;

  try {
    const database = getDatabase();
    const [rev] = await database
      .select()
      .from(akiviliDatasetRevisions)
      .orderBy(desc(akiviliDatasetRevisions.installedAt))
      .limit(1);
    const activeRevision = rev?.revision;

    const result = await database.execute<{
      entity_id: string;
      kind: string;
      slug: string;
      name: string;
      section: string;
      content: string;
      rank: number;
    }>(sql`
      select
        e.id as entity_id,
        e.kind,
        e.slug,
        e.name,
        d.title as section,
        c.content,
        ts_rank(
          to_tsvector('english', c.content),
          websearch_to_tsquery('english', ${query})
        ) as rank
      from ${akiviliChunks} c
      join ${akiviliDocuments} d on d.id = c.document_id
      join ${akiviliEntities} e on e.id = d.entity_id
      where
        ${activeRevision ? sql`c.revision = ${activeRevision} and` : sql``}
        to_tsvector('english', c.content) @@ websearch_to_tsquery('english', ${query})
      order by rank desc, d.id asc
      limit ${limit}
    `);

    const rows =
      (result as unknown as { rows: unknown[] }).rows ??
      (result as unknown as unknown[]);
    return NextResponse.json({ items: rows, preview: false }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
