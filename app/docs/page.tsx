import { DatabaseShell } from "../_components/database-shell";

export const metadata = {
  title: "API Documentation | E-Akivili",
  description:
    "Comprehensive public API documentation for E-Akivili Star Rail knowledge graph, entities, farming plans, warps, and AI retrieval.",
};

type Parameter = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type ApiEndpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  category:
    | "Core & Health"
    | "Entities & Relations"
    | "Farming & Calyxes"
    | "AI & Knowledge Retrieval"
    | "Model Context Protocol (MCP)";
  parameters?: Parameter[];
  exampleRequest: string;
  exampleResponse: string;
};

const apiEndpoints: ApiEndpoint[] = [
  {
    id: "health-check",
    method: "GET",
    path: "/api/health",
    title: "Health & System Status",
    description:
      "Returns health status, active dataset revision, entity count, and PostgreSQL database telemetry.",
    category: "Core & Health",
    exampleRequest: "curl -X GET https://e-akivili.vxnus.xyz/api/health",
    exampleResponse: JSON.stringify(
      {
        status: "healthy",
        service: "e-akivili",
        entityCount: 2662,
        revision: "akivili:rev:2081db808514462ed79571a2d3a683b1f254c8c585b68d6acf1a9978f00aebaf",
        installedAt: "2026-08-28T22:57:51.578Z",
        timestamp: "2026-08-29T07:00:00.000Z",
      },
      null,
      2
    ),
  },
  {
    id: "search-entities",
    method: "GET",
    path: "/api/entities",
    title: "List & Search Entities",
    description:
      "Search canonical Honkai: Star Rail entities (characters, light-cones, relics, items, books, messages) with pagination, category filter, and multilingual alias matching.",
    category: "Entities & Relations",
    parameters: [
      { name: "q", type: "string", required: false, description: "Search query or multilingual alias keyword." },
      { name: "kind", type: "string", required: false, description: "Category filter (characters, light-cones, relics, items, books, messages)." },
      { name: "limit", type: "number", required: false, description: "Maximum records to return (1-50, default 24)." },
      { name: "page", type: "number", required: false, description: "Pagination page number (default 1)." },
    ],
    exampleRequest: 'curl -X GET "https://e-akivili.vxnus.xyz/api/entities?kind=characters&q=march"',
    exampleResponse: JSON.stringify(
      {
        items: [
          {
            id: "hsr:character:1001",
            canonicalId: "hsr:character:1001",
            category: "character",
            kind: "characters",
            slug: "march-7th",
            name: "March 7th",
            description: "A girl who once slumbered in eternal ice and knows nothing about her past.",
            gameVersion: "4.5",
            image: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/character/1001.png",
            rarity: 4,
            element: "Ice",
            path: "Preservation",
            aliases: ["March 7th", "三月七", "三月なのか", "Mar. 7th"],
          },
        ],
        total: 1,
        page: 1,
        limit: 24,
        revision: "akivili:rev:2081db808514...",
        preview: false,
      },
      null,
      2
    ),
  },
  {
    id: "entity-detail",
    method: "GET",
    path: "/api/entities/:kind/:slug",
    title: "Get Entity Details & Relations",
    description:
      "Retrieve a single entity by kind and slug, along with its full canonical data and outgoing graph relations (ascension materials, relic suites, message contacts).",
    category: "Entities & Relations",
    parameters: [
      { name: "kind", type: "string", required: true, description: "Entity kind (characters, light-cones, relics, items, books, messages)." },
      { name: "slug", type: "string", required: true, description: "Unique slug identifier (e.g. march-7th, arrows)." },
    ],
    exampleRequest: "curl -X GET https://e-akivili.vxnus.xyz/api/entities/characters/march-7th",
    exampleResponse: JSON.stringify(
      {
        item: {
          id: "hsr:character:1001",
          slug: "march-7th",
          name: "March 7th",
          element: "Ice",
          path: "Preservation",
          rarity: 4,
        },
        relations: [
          {
            id: "hsr:rel:...",
            predicate: "requires_ascension_material",
            object: {
              id: "hsr:item:110141",
              name: "Safeguard of Amber",
              slug: "safeguard-of-amber",
            },
          },
        ],
        revision: "akivili:rev:2081db...",
      },
      null,
      2
    ),
  },
  {
    id: "farming-daily",
    method: "GET",
    path: "/api/farming/daily",
    title: "Daily Calyx Farming Schedule",
    description:
      "Retrieves characters and light cones grouped by day of the week based on active Crimson Calyx rotation schedules.",
    category: "Farming & Calyxes",
    exampleRequest: "curl -X GET https://e-akivili.vxnus.xyz/api/farming/daily",
    exampleResponse: JSON.stringify(
      {
        days: {
          1: {
            dayName: "Monday",
            chars: [{ name: "Acheron", slug: "acheron", element: "Lightning", path: "Nihility" }],
            weapons: [{ name: "Along the Passing Shore", slug: "along-the-passing-shore", type: "Nihility" }],
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: "knowledge-search",
    method: "GET",
    path: "/api/knowledge/search",
    title: "Full-Text Lore & Knowledge Search",
    description:
      "Performs PostgreSQL full-text rank search across 7,111 in-game books, character lore profiles, and daily messaging conversations.",
    category: "AI & Knowledge Retrieval",
    parameters: [
      { name: "q", type: "string", required: true, description: "Full-text search query (websearch syntax supported)." },
      { name: "limit", type: "number", required: false, description: "Maximum chunks (default 8)." },
    ],
    exampleRequest: 'curl -X GET "https://e-akivili.vxnus.xyz/api/knowledge/search?q=Astral+Express+Akivili"',
    exampleResponse: JSON.stringify(
      {
        items: [
          {
            entity_id: "hsr:character:1001",
            kind: "character",
            slug: "march-7th",
            name: "March 7th",
            section: "character lore",
            content: "A girl who once slumbered in eternal ice...",
            rank: 0.0759,
          },
        ],
        preview: false,
      },
      null,
      2
    ),
  },
  {
    id: "mcp-server",
    method: "POST",
    path: "/api/mcp",
    title: "Model Context Protocol (MCP) Server",
    description:
      "Streamable HTTP MCP endpoint exposing find_entity, get_entity, and search_knowledge tools for autonomous AI coding agents.",
    category: "Model Context Protocol (MCP)",
    exampleRequest: 'curl -X POST https://e-akivili.vxnus.xyz/api/mcp -H "Content-Type: application/json" -d \'{"jsonrpc":"2.0","id":1,"method":"tools/list"}\'',
    exampleResponse: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: 1,
        result: {
          tools: [
            { name: "find_entity", description: "Search entities by name or alias" },
            { name: "get_entity", description: "Get entity details and graph relations" },
            { name: "search_knowledge", description: "Full-text lore search" },
          ],
        },
      },
      null,
      2
    ),
  },
];

const categories = [
  "Core & Health",
  "Entities & Relations",
  "Farming & Calyxes",
  "AI & Knowledge Retrieval",
  "Model Context Protocol (MCP)",
] as const;

export default function ApiDocsPage() {
  return (
    <DatabaseShell
      eyebrow="Public Interface"
      title="API Reference & Integration"
      description="Connect your AI agents, bots, tools, and applications directly to E-Akivili's structured Honkai: Star Rail knowledge base and graph database."
    >
      <div className="flex flex-col gap-10">
        <section className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] shadow-[0_0_8px_var(--green)]" />
              <span className="text-xs font-mono font-bold tracking-wider text-[var(--green-2)] uppercase">
                REST & Model Context Protocol (MCP)
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-[var(--text)] m-0">
              Machine-Readable Honkai: Star Rail Telemetry & Facts
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-2)] leading-relaxed m-0">
              All endpoints return standard JSON and support high-throughput AI retrieval, MCP agents, Discord bots, and interactive web tools.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-14">
          {categories.map((cat) => {
            const catEndpoints = apiEndpoints.filter((ep) => ep.category === cat);
            if (!catEndpoints.length) return null;

            return (
              <section key={cat} className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
                  <span className="text-xs font-mono font-bold text-[var(--green-2)] tracking-wider uppercase">
                    Section
                  </span>
                  <h2 className="text-xl font-bold text-[var(--text)] m-0">{cat}</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {catEndpoints.map((ep) => (
                    <article
                      key={ep.id}
                      className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className="p-5 md:p-6 border-b border-[var(--line)] bg-[#0c101e]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                ep.method === "GET"
                                  ? "bg-[rgba(78,136,245,0.15)] text-[var(--green-2)] border border-[rgba(78,136,245,0.3)]"
                                  : "bg-[rgba(242,201,76,0.15)] text-[var(--gold)] border border-[rgba(242,201,76,0.3)]"
                              }`}
                            >
                              {ep.method}
                            </span>
                            <code className="text-sm font-mono font-bold text-[var(--text)]">
                              {ep.path}
                            </code>
                          </div>
                          <h3 className="text-base font-semibold text-[var(--text)] m-0 mt-1">
                            {ep.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5 md:p-6 flex flex-col gap-6">
                        <p className="text-xs md:text-sm text-[var(--text-2)] leading-relaxed m-0">
                          {ep.description}
                        </p>

                        {ep.parameters && ep.parameters.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wider">
                              Parameters
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {ep.parameters.map((p) => (
                                <div
                                  key={p.name}
                                  className="bg-[#080a14] border border-[var(--line)] p-2.5 rounded-lg text-xs flex flex-wrap items-center gap-2"
                                >
                                  <code className="font-mono text-[var(--green-2)] font-bold">
                                    {p.name}
                                  </code>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-3)]">
                                    {p.type}
                                  </span>
                                  {p.required && (
                                    <span className="text-[10px] font-mono text-red-400 font-bold">
                                      required
                                    </span>
                                  )}
                                  <span className="text-[var(--text-2)] flex-1">{p.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wider">
                              Example Request
                            </span>
                            <pre className="bg-[#080a14] border border-[var(--line)] p-3.5 rounded-lg text-xs font-mono text-[var(--text)] overflow-x-auto m-0 leading-relaxed">
                              {ep.exampleRequest}
                            </pre>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wider">
                              Example Response (JSON)
                            </span>
                            <pre className="bg-[#080a14] border border-[var(--line)] p-3.5 rounded-lg text-xs font-mono text-[var(--green-2)] overflow-x-auto max-h-56 m-0 leading-relaxed">
                              {ep.exampleResponse}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </DatabaseShell>
  );
}
