CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "akivili_aliases" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_id" text NOT NULL,
	"alias" text NOT NULL,
	"normalized_alias" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akivili_chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"revision" text NOT NULL,
	"ordinal" integer NOT NULL,
	"content" text NOT NULL,
	"content_hash" varchar(64) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akivili_dataset_revisions" (
	"revision" text PRIMARY KEY NOT NULL,
	"projection_version" text NOT NULL,
	"source_checksums" jsonb NOT NULL,
	"entity_count" integer NOT NULL,
	"alias_count" integer NOT NULL,
	"relation_count" integer NOT NULL,
	"document_count" integer NOT NULL,
	"installed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akivili_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_id" text NOT NULL,
	"content" text NOT NULL,
	"source_id" text DEFAULT 'e-akivili' NOT NULL,
	"revision" text DEFAULT '' NOT NULL,
	"content_hash" varchar(64) DEFAULT '' NOT NULL,
	"provenance" jsonb,
	"category" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"parent_source_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akivili_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"chunk_id" text NOT NULL,
	"revision" text NOT NULL,
	"model" text NOT NULL,
	"provider" text NOT NULL,
	"dimensions" integer DEFAULT 768 NOT NULL,
	"content_hash" varchar(64) NOT NULL,
	"embedding" vector(768) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akivili_entities" (
	"id" text PRIMARY KEY NOT NULL,
	"namespace" text DEFAULT 'hsr' NOT NULL,
	"kind" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"data" jsonb NOT NULL,
	"provenance" jsonb,
	"temporal" jsonb
);
--> statement-breakpoint
CREATE TABLE "akivili_relations" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_id" text NOT NULL,
	"predicate" text NOT NULL,
	"object_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"provenance" jsonb,
	"temporal" jsonb
);
--> statement-breakpoint
CREATE TABLE "akivili_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"license" text NOT NULL,
	"uri" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "akivili_aliases" ADD CONSTRAINT "akivili_aliases_entity_id_akivili_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."akivili_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "akivili_chunks" ADD CONSTRAINT "akivili_chunks_document_id_akivili_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."akivili_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "akivili_documents" ADD CONSTRAINT "akivili_documents_entity_id_akivili_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."akivili_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "akivili_embeddings" ADD CONSTRAINT "akivili_embeddings_chunk_id_akivili_chunks_id_fk" FOREIGN KEY ("chunk_id") REFERENCES "public"."akivili_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "akivili_relations" ADD CONSTRAINT "akivili_relations_subject_id_akivili_entities_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."akivili_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "akivili_relations" ADD CONSTRAINT "akivili_relations_object_id_akivili_entities_id_fk" FOREIGN KEY ("object_id") REFERENCES "public"."akivili_entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "akivili_aliases_entity_alias_uidx" ON "akivili_aliases" USING btree ("entity_id","normalized_alias");--> statement-breakpoint
CREATE INDEX "akivili_aliases_normalized_idx" ON "akivili_aliases" USING btree ("normalized_alias");--> statement-breakpoint
CREATE INDEX "akivili_chunks_document_ordinal_idx" ON "akivili_chunks" USING btree ("document_id","ordinal");--> statement-breakpoint
CREATE INDEX "akivili_chunks_revision_idx" ON "akivili_chunks" USING btree ("revision");--> statement-breakpoint
CREATE INDEX "akivili_documents_entity_idx" ON "akivili_documents" USING btree ("entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "akivili_embeddings_chunk_revision_model_uidx" ON "akivili_embeddings" USING btree ("chunk_id","revision","model");--> statement-breakpoint
CREATE INDEX "akivili_embeddings_revision_model_idx" ON "akivili_embeddings" USING btree ("revision","model");--> statement-breakpoint
CREATE INDEX "akivili_entities_kind_slug_idx" ON "akivili_entities" USING btree ("kind","slug");--> statement-breakpoint
CREATE INDEX "akivili_entities_kind_name_idx" ON "akivili_entities" USING btree ("kind","name");--> statement-breakpoint
CREATE INDEX "akivili_relations_subject_predicate_idx" ON "akivili_relations" USING btree ("subject_id","predicate");--> statement-breakpoint
CREATE INDEX "akivili_relations_object_predicate_idx" ON "akivili_relations" USING btree ("object_id","predicate");