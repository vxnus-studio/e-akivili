# E-Akivili — Honkai: Star Rail Astral Knowledge Base

**Website:** [https://e-akivili.vxnus.xyz](https://e-akivili.vxnus.xyz)

E-Akivili is an open, structured knowledge base and retrieval engine for **Honkai: Star Rail**, designed for both humans and AI agents.

Rather than acting as a static wiki, E-Akivili exposes canonical entities, graph relationships, and searchable lore through high-throughput REST APIs and the **Model Context Protocol (MCP)**.

Built with a full-stack Next.js App Router frontend, Neon PostgreSQL (with `pgvector`), and Drizzle ORM, the project provides deterministic projections, rich multilingual aliases, and graph-connected telemetry across the cosmos.

---

## 🌟 Key Features

* **2,662+ Canonical Entities** — Comprehensive index of Characters, Light Cones, Relic Sets, Items, In-Game Books, and Messaging Logs.
* **7,538+ Multilingual Aliases** — Instant search across English, Simplified Chinese (`cn`), Japanese (`jp`), and Korean (`kr`).
* **2,575+ Graph Relations** — Explicit typed triples linking characters to required ascension items, light cone costs, relic suite pieces, and message senders.
* **7,111+ Lore Documents & Chunks** — Full-text searchable in-game book chronicles, dialogue scripts, and character story profiles.
* **Model Context Protocol (MCP)** — Native 2026-compliant MCP server at `/api/mcp` for autonomous AI agents.
* **Trailblaze Command & Farming Rotation** — Real-time Calyx schedules with automated timezone detection and daily countdown timers.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` (or create `.env.local`):
```env
DATABASE_URL=postgresql://user:password@ep-your-neon-pooler.region.neon.tech/neondb?sslmode=require
```

### 3. Apply Migrations & Ingest Dataset
```bash
# Apply Drizzle migrations (pgvector enabled)
npm run db:migrate

# Build the deterministic projection artifact
npm run akivili:build

# Ingest into Neon PostgreSQL
npm run akivili:ingest

# Verify database table counts
npm run akivili:verify-db
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Database Architecture (`db/schema.ts`)

| Table | Prefix | Records | Description |
|---|---|---|---|
| `akivili_entities` | `hsr:` | 2,662 | Characters, light cones, relics, items, books, messages |
| `akivili_aliases` | `hsr:alias:` | 7,538 | Multilingual normalization for search |
| `akivili_relations` | `hsr:rel:` | 2,575 | Typed graph edges (`requires_ascension_material`, `contains_relic_piece`, etc.) |
| `akivili_documents` | `hsr:doc:` | 7,111 | Narrative texts, readable books, and dialogue claims |
| `akivili_chunks` | `hsr:doc:...:0` | 7,111 | Retrieval chunks for full-text search & embeddings |
| `akivili_embeddings`| `hsr:emb:` | — | 768-dimensional vector embeddings (`pgvector`) |
| `akivili_sources` | — | 4 | Attribution for HoYoverse, Yatta API, Prydwen, and E-Akivili |
| `akivili_dataset_revisions` | `akivili:rev:` | 1 | Deterministic content hashes and migration checkpoints |

---

## 🌐 Public REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | System health check, active revision, and entity count telemetry |
| `/api/entities` | `GET` | List & search entities with pagination (`q`, `kind`, `limit`, `page`) |
| `/api/entities/:kind/:slug` | `GET` | Retrieve entity canonical data and outgoing graph relations |
| `/api/knowledge/search` | `GET` | PostgreSQL full-text rank search over 7,111 lore chunks |
| `/api/farming/daily` | `GET` | Daily Crimson Calyx & Stagnant Shadow rotation schedule |
| `/api/mcp` | `GET`/`POST` | Model Context Protocol server endpoint |

---

## 🤖 Model Context Protocol (MCP) Integration

Connect your autonomous AI coding agents (Antigravity, Claude Code, Cursor, Windsurf) directly to E-Akivili.

**Endpoint:** `https://e-akivili.vxnus.xyz/api/mcp`

### Configuration (`mcp_config.json`):
```json
{
  "mcpServers": {
    "akivili": {
      "url": "https://e-akivili.vxnus.xyz/api/mcp"
    }
  }
}
```

### Available MCP Tools:
* `find_entity` — Search and resolve Star Rail entities by name, kind, or multilingual alias.
* `get_entity` — Retrieve complete entity stats and outgoing graph relations.
* `search_knowledge` — Search across in-game lore, readable books, and character dialogue.

---

## 🤝 Acknowledgments & Attribution

E-Akivili is built on the contributions of the Honkai: Star Rail community:
* **[HoYoverse (COGNOSPHERE PTE. LTD.)](https://hsr.hoyoverse.com/)** — For creating *Honkai: Star Rail*.
* **[Project Yatta (sr.yatta.moe)](https://sr.yatta.moe/)** — For providing the comprehensive game data API and normalization archive.
* **[Prydwen Institute](https://www.prydwen.gg/star-rail/)** — For character tier lists, rotations, and theorycrafting.
* **[Mar-7th / StarRailRes](https://github.com/Mar-7th/StarRailRes)** — For high-resolution in-game icons and asset mappings.

---

## 📄 License & Disclaimer

* **Disclaimer**: E-Akivili is an independent, non-commercial fan project and is not affiliated with or endorsed by COGNOSPHERE PTE. LTD. (HoYoverse). All game content and trademarks belong to HoYoverse.
* **License**: Open source under the [MIT License](LICENSE).
