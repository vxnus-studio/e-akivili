import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * E-Akivili canonical snapshot storage for Honkai: Star Rail.
 * Namespace: hsr
 * Prefix: akivili_
 */

export const akiviliSources = pgTable("akivili_sources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  license: text("license").notNull(),
  uri: text("uri"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
});

export const akiviliEntities = pgTable(
  "akivili_entities",
  {
    id: text("id").primaryKey(),
    namespace: text("namespace").notNull().default("hsr"),
    kind: text("kind").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    provenance: jsonb("provenance").$type<Record<string, unknown>>(),
    temporal: jsonb("temporal").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("akivili_entities_kind_slug_idx").on(table.kind, table.slug),
    index("akivili_entities_kind_name_idx").on(table.kind, table.name),
  ],
);

export const akiviliAliases = pgTable(
  "akivili_aliases",
  {
    id: text("id").primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => akiviliEntities.id, { onDelete: "cascade" }),
    alias: text("alias").notNull(),
    normalizedAlias: text("normalized_alias").notNull(),
  },
  (table) => [
    uniqueIndex("akivili_aliases_entity_alias_uidx").on(table.entityId, table.normalizedAlias),
    index("akivili_aliases_normalized_idx").on(table.normalizedAlias),
  ],
);

export const akiviliRelations = pgTable(
  "akivili_relations",
  {
    id: text("id").primaryKey(),
    subjectId: text("subject_id")
      .notNull()
      .references(() => akiviliEntities.id, { onDelete: "cascade" }),
    predicate: text("predicate").notNull(),
    objectId: text("object_id")
      .notNull()
      .references(() => akiviliEntities.id, { onDelete: "cascade" }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    provenance: jsonb("provenance").$type<Record<string, unknown>>(),
    temporal: jsonb("temporal").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("akivili_relations_subject_predicate_idx").on(table.subjectId, table.predicate),
    index("akivili_relations_object_predicate_idx").on(table.objectId, table.predicate),
  ],
);

export const akiviliDocuments = pgTable(
  "akivili_documents",
  {
    id: text("id").primaryKey(),
    entityId: text("entity_id")
      .notNull()
      .references(() => akiviliEntities.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    sourceId: text("source_id").notNull().default("e-akivili"),
    revision: text("revision").notNull().default(""),
    contentHash: varchar("content_hash", { length: 64 }).notNull().default(""),
    provenance: jsonb("provenance").$type<Record<string, unknown>>(),
    category: text("category").notNull(),
    title: text("title").notNull().default(""),
    parentSourceId: text("parent_source_id").notNull(),
  },
  (table) => [index("akivili_documents_entity_idx").on(table.entityId)],
);

export const akiviliChunks = pgTable(
  "akivili_chunks",
  {
    id: text("id").primaryKey(),
    documentId: text("document_id").notNull().references(() => akiviliDocuments.id, { onDelete: "cascade" }),
    revision: text("revision").notNull(),
    ordinal: integer("ordinal").notNull(),
    content: text("content").notNull(),
    contentHash: varchar("content_hash", { length: 64 }).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  },
  (table) => [
    index("akivili_chunks_document_ordinal_idx").on(table.documentId, table.ordinal),
    index("akivili_chunks_revision_idx").on(table.revision),
  ],
);

export const akiviliEmbeddings = pgTable(
  "akivili_embeddings",
  {
    id: text("id").primaryKey(),
    chunkId: text("chunk_id").notNull().references(() => akiviliChunks.id, { onDelete: "cascade" }),
    revision: text("revision").notNull(),
    model: text("model").notNull(),
    provider: text("provider").notNull(),
    dimensions: integer("dimensions").notNull().default(768),
    contentHash: varchar("content_hash", { length: 64 }).notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("akivili_embeddings_chunk_revision_model_uidx").on(table.chunkId, table.revision, table.model),
    index("akivili_embeddings_revision_model_idx").on(table.revision, table.model),
  ],
);

export const akiviliDatasetRevisions = pgTable("akivili_dataset_revisions", {
  revision: text("revision").primaryKey(),
  projectionVersion: text("projection_version").notNull(),
  sourceChecksums: jsonb("source_checksums").$type<Record<string, string>>().notNull(),
  entityCount: integer("entity_count").notNull(),
  aliasCount: integer("alias_count").notNull(),
  relationCount: integer("relation_count").notNull(),
  documentCount: integer("document_count").notNull(),
  installedAt: timestamp("installed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AkiviliEntity = typeof akiviliEntities.$inferSelect;
export type NewAkiviliEntity = typeof akiviliEntities.$inferInsert;
export type AkiviliAlias = typeof akiviliAliases.$inferSelect;
export type AkiviliRelation = typeof akiviliRelations.$inferSelect;
export type NewAkiviliRelation = typeof akiviliRelations.$inferInsert;
export type AkiviliDocument = typeof akiviliDocuments.$inferSelect;
export type NewAkiviliDocument = typeof akiviliDocuments.$inferInsert;
export type NewAkiviliChunk = typeof akiviliChunks.$inferInsert;
