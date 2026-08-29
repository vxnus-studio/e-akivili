import { type NextRequest, NextResponse } from "next/server";
import { getAkiviliPersistentEntityQueries } from "@/lib/akivili/engine";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ kind: string; slug: string }> }
) {
  try {
    const { kind, slug } = await context.params;
    const queries = await getAkiviliPersistentEntityQueries();
    const result = await queries.detail(kind, slug);

    if (!result) {
      return NextResponse.json({ error: `Entity '${kind}/${slug}' not found.` }, { status: 404 });
    }

    return NextResponse.json(result, {
      headers: { "cache-control": "public, max-age=60, s-maxage=300" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Entity lookup failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
