import { NextResponse } from "next/server";
import { countAkiviliEntities } from "@/lib/akivili/persistence/entities";
import { getDatabase } from "@/db/client";
import { akiviliDatasetRevisions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDatabase();
    const entityCount = await countAkiviliEntities(db);
    const [rev] = await db
      .select()
      .from(akiviliDatasetRevisions)
      .orderBy(desc(akiviliDatasetRevisions.installedAt))
      .limit(1);

    return NextResponse.json({
      status: "healthy",
      service: "e-akivili",
      entityCount,
      revision: rev?.revision ?? null,
      installedAt: rev?.installedAt ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Health check failed.";
    return NextResponse.json({ status: "unhealthy", error: message }, { status: 500 });
  }
}
