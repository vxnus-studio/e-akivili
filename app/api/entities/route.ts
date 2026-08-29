import { type NextRequest, NextResponse } from "next/server";
import { getAkiviliPersistentEntityQueries } from "@/lib/akivili/engine";

export async function GET(request: NextRequest) {
  try {
    const kind = request.nextUrl.searchParams.get("kind")?.toLowerCase() || undefined;
    const query = request.nextUrl.searchParams.get("q")?.trim() || "";
    const parsedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 24);
    const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(50, parsedLimit)) : 24;
    const parsedPage = Number(request.nextUrl.searchParams.get("page") ?? 1);
    const page = Number.isFinite(parsedPage) ? Math.max(1, Math.floor(parsedPage)) : 1;

    const queries = await getAkiviliPersistentEntityQueries();
    const result = await queries.searchEntities({ kind, query, limit, page });

    return NextResponse.json(
      { ...result, preview: false },
      { headers: { "cache-control": "public, max-age=60, s-maxage=300" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Entities query failed.";
    return NextResponse.json({ error: message, items: [], total: 0, page: 1, limit: 24 }, { status: 500 });
  }
}
