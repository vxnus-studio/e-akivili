import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const entities = await sql`SELECT count(*)::int as count FROM akivili_entities`;
const aliases = await sql`SELECT count(*)::int as count FROM akivili_aliases`;
const relations = await sql`SELECT count(*)::int as count FROM akivili_relations`;
const documents = await sql`SELECT count(*)::int as count FROM akivili_documents`;
const chunks = await sql`SELECT count(*)::int as count FROM akivili_chunks`;
const sources = await sql`SELECT count(*)::int as count FROM akivili_sources`;
const revisions = await sql`SELECT * FROM akivili_dataset_revisions`;

console.log({
  entities: entities[0].count,
  aliases: aliases[0].count,
  relations: relations[0].count,
  documents: documents[0].count,
  chunks: chunks[0].count,
  sources: sources[0].count,
  revisions: revisions,
});
