/**
 * Public MCP (Model Context Protocol) server endpoint for Honkai: Star Rail.
 *
 * Exposes the Astral Knowledge Base as MCP tools that AI agents can call directly.
 * Implements the 2026 MCP specification via mcp-handler.
 *
 * Endpoint: GET/POST /api/mcp
 *
 * Tool inventory:
 *   find_entity       – Search/resolve entities by name, kind, or alias
 *   get_entity        – Retrieve a single entity with outgoing graph relations
 *   search_knowledge  – Full-text search over lore, character dialogues, and readable books
 */

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { getAkiviliPersistentEntityQueries } from "@/lib/akivili/engine";
import { getDatabase } from "@/db/client";
import {
  akiviliChunks,
  akiviliDatasetRevisions,
  akiviliDocuments,
  akiviliEntities,
} from "@/db/schema";
import { desc, sql } from "drizzle-orm";

function clamp(value: number | null | undefined, max: number, fallback: number): number {
  const n = Number(value ?? fallback);
  return Number.isFinite(n) ? Math.max(1, Math.min(max, n)) : fallback;
}

function jsonContent(value: unknown): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

function errorContent(message: string): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text" as const, text: `Error: ${message}` }] };
}

const handler = createMcpHandler((server) => {
  // -------------------------------------------------------------------------
  // find_entity
  // -------------------------------------------------------------------------
  server.registerTool(
    "find_entity",
    {
      title: "Find Entity",
      description:
        "Search and resolve canonical Honkai: Star Rail entities (characters, light cones, relic sets, items, books, messages) by name, partial name, or alias. Returns a paginated list of matching records.",
      inputSchema: z.object({
        q: z
          .string()
          .optional()
          .describe("Name or partial name to search for (case-insensitive match)."),
        kind: z
          .string()
          .optional()
          .describe("Category filter: characters, light-cones, relics, items, books, messages."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .default(24)
          .describe("Maximum results (1-50, default 24)."),
        page: z
          .number()
          .int()
          .min(1)
          .optional()
          .default(1)
          .describe("Page number (default 1)."),
      }),
    },
    async ({ q, kind, limit, page }) => {
      try {
        const queries = await getAkiviliPersistentEntityQueries();
        const result = await queries.searchEntities({
          query: q ?? "",
          kind: kind?.toLowerCase(),
          limit: clamp(limit, 50, 24),
          page: Math.max(1, page ?? 1),
        });
        return jsonContent(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Entity search failed.";
        return errorContent(message);
      }
    },
  );

  // -------------------------------------------------------------------------
  // get_entity
  // -------------------------------------------------------------------------
  server.registerTool(
    "get_entity",
    {
      title: "Get Entity",
      description:
        "Retrieve a single canonical entity by category and slug, including its attributes, stats, and graph relations (ascension materials, relic pieces, message senders).",
      inputSchema: z.object({
        kind: z
          .string()
          .describe("Entity category (e.g. characters, light-cones, relics, items, books, messages)."),
        slug: z
          .string()
          .describe("URL-friendly entity slug (e.g. march-7th, arrows, passerby-of-wandering-cloud)."),
      }),
    },
    async ({ kind, slug }) => {
      try {
        const queries = await getAkiviliPersistentEntityQueries();
        const result = await queries.detail(kind.toLowerCase(), slug);
        if (!result) return errorContent(`Entity '${kind}/${slug}' not found.`);
        return jsonContent(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to retrieve entity.";
        return errorContent(message);
      }
    },
  );

  // -------------------------------------------------------------------------
  // search_knowledge
  // -------------------------------------------------------------------------
  server.registerTool(
    "search_knowledge",
    {
      title: "Search Knowledge",
      description:
        "Full-text search over Honkai: Star Rail lore documents, in-game books, character stories, and dialogue claims.",
      inputSchema: z.object({
        q: z
          .string()
          .describe("Full-text search query (e.g. Astral Express Akivili Trailblaze Stellaron)."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .default(8)
          .describe("Maximum results (1-50, default 8)."),
      }),
    },
    async ({ q, limit }) => {
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
              websearch_to_tsquery('english', ${q})
            ) as rank
          from ${akiviliChunks} c
          join ${akiviliDocuments} d on d.id = c.document_id
          join ${akiviliEntities} e on e.id = d.entity_id
          where
            ${activeRevision ? sql`c.revision = ${activeRevision} and` : sql``}
            to_tsvector('english', c.content) @@ websearch_to_tsquery('english', ${q})
          order by rank desc, d.id asc
          limit ${clamp(limit, 50, 8)}
        `);

        const rows =
          (result as unknown as { rows: unknown[] }).rows ??
          (result as unknown as unknown[]);
        return jsonContent({ items: rows, preview: false });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Knowledge search failed.";
        return errorContent(message);
      }
    },
  );
});

export { handler as GET, handler as POST };
