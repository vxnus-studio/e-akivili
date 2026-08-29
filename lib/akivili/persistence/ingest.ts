import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { artifactSha256, ARTIFACT_PATH, MANIFEST_PATH, readArtifact, readArtifactManifest } from "../artifact.ts";
import { normalize } from "../domain/entities.ts";
import { createTransactionalDatabase } from "./db.ts";
import {
  akiviliAliases,
  akiviliChunks,
  akiviliDatasetRevisions,
  akiviliDocuments,
  akiviliEntities,
  akiviliRelations,
  akiviliSources,
  type NewAkiviliEntity,
  type NewAkiviliRelation,
  type NewAkiviliDocument,
  type NewAkiviliChunk,
} from "../../../db/schema.ts";
import type { AkiviliProjection } from "../projection/types.ts";

const CHUNK_SIZE = 250;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

function chunks<T>(items: T[], size = CHUNK_SIZE): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function validateManifest(projection: AkiviliProjection) {
  const manifest = readArtifactManifest(MANIFEST_PATH);
  const artifact = readFileSync(ARTIFACT_PATH);
  if (artifactSha256(projection) !== artifactSha256(JSON.parse(artifact.toString()))) {
    throw new Error("Artifact content changed while loading");
  }
  if (manifest.revision !== projection.revision) {
    throw new Error(`Artifact revision mismatch: ${projection.revision}`);
  }
  if (
    manifest.counts.entities !== projection.entities.length ||
    manifest.counts.aliases !== projection.aliases.length ||
    manifest.counts.relations !== projection.relations.length ||
    manifest.counts.documents !== projection.documents.length
  ) {
    throw new Error("Artifact manifest counts do not match projection");
  }
  return manifest;
}

async function insertChunks<T>(items: T[], insert: (chunk: T[]) => Promise<unknown>) {
  for (const chunk of chunks(items)) {
    if (chunk.length) await insert(chunk);
  }
}

export async function ingestAkiviliArtifact(connectionString = process.env.DATABASE_URL) {
  const started = performance.now();
  const projection = readArtifact();
  const manifest = validateManifest(projection);
  const { pool, db } = createTransactionalDatabase(connectionString);

  try {
    await db.transaction(async (tx) => {
      await tx.delete(akiviliRelations);
      await tx.delete(akiviliAliases);
      await tx.delete(akiviliChunks);
      await tx.delete(akiviliDocuments);
      await tx.delete(akiviliEntities);
      await tx.delete(akiviliSources);
      await tx.delete(akiviliDatasetRevisions);

      await tx.insert(akiviliSources).values([
        {
          id: "hoyoverse",
          title: "HoYoverse / COGNOSPHERE Pte., Ltd.",
          license: "All rights reserved by HoYoverse",
          uri: "https://hsr.hoyoverse.com/",
          metadata: {
            type: "intellectual_property",
            description: "Original game data, character designs, audio, and imagery belong to HoYoverse (COGNOSPHERE Pte., Ltd.).",
          },
        },
        {
          id: "project-yatta",
          title: "Project Yatta",
          license: "Community API Data",
          uri: "https://sr.yatta.moe/",
          metadata: {
            type: "game_data_provider",
            description: "Community API service and game asset normalization provided by Project Yatta (sr.yatta.moe).",
          },
        },
        {
          id: "prydwen",
          title: "Prydwen Institute",
          license: "Community Theorycrafting",
          uri: "https://www.prydwen.gg/star-rail/",
          metadata: {
            type: "theorycrafting_guide_provider",
            description: "Character builds, tier lists, light cone and relic rankings for Honkai: Star Rail.",
          },
        },
        {
          id: "e-akivili",
          title: "E-Akivili",
          license: "CC-BY-4.0",
          uri: "https://github.com/vxnuslabs/e-akivili",
          metadata: {
            type: "application",
            licenseDescription: "Creative Commons Attribution 4.0 International",
            licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
          },
        },
      ]);

      await insertChunks(
        projection.entities,
        (chunk) =>
          tx.insert(akiviliEntities).values(
            chunk.map(
              (entity) =>
                ({
                  id: entity.id,
                  namespace: entity.namespace,
                  kind: entity.kind,
                  slug: entity.slug,
                  name: entity.name,
                  data: entity.data,
                  provenance: entity.provenance ? (entity.provenance as unknown as Record<string, unknown>) : null,
                  temporal: entity.temporal ? (entity.temporal as unknown as Record<string, unknown>) : null,
                }) as NewAkiviliEntity,
            ),
          ),
      );

      await insertChunks(
        projection.aliases,
        (chunk) =>
          tx.insert(akiviliAliases).values(
            chunk.map((alias) => ({
              id: alias.id,
              entityId: alias.entityId,
              alias: alias.alias,
              normalizedAlias: normalize(alias.alias),
            })),
          ),
      );

      if (projection.relations.length > 0) {
        await insertChunks(
          projection.relations,
          (chunk) =>
            tx.insert(akiviliRelations).values(
              chunk.map(
                (relation) =>
                  ({
                    id: relation.id,
                    subjectId: relation.subjectId,
                    predicate: relation.predicate,
                    objectId: relation.objectId,
                    metadata: relation.metadata ?? {},
                    provenance: relation.provenance ? (relation.provenance as unknown as Record<string, unknown>) : null,
                    temporal: relation.temporal ? (relation.temporal as unknown as Record<string, unknown>) : null,
                  }) as NewAkiviliRelation,
              ),
            ),
        );
      }

      const metadataMap = new Map(projection.documentMetadata.map((item) => [item.id, item]));

      await insertChunks(
        projection.documents,
        (chunk) =>
          tx.insert(akiviliDocuments).values(
            chunk.map((document) => {
              const item = metadataMap.get(document.id);
              return {
                id: document.id,
                entityId: document.entityId,
                content: document.content,
                sourceId: "e-akivili",
                revision: projection.revision,
                contentHash: hash(document.content),
                provenance: document.provenance ? (document.provenance as unknown as Record<string, unknown>) : null,
                category: item?.category ?? "lore",
                title: item?.title ?? "",
                parentSourceId: item?.parentSourceId ?? document.entityId,
              } as NewAkiviliDocument;
            }),
          ),
      );

      await insertChunks(
        projection.documents,
        (chunk) =>
          tx.insert(akiviliChunks).values(
            chunk.map(
              (document) =>
                ({
                  id: `${document.id}:0`,
                  documentId: document.id,
                  revision: projection.revision,
                  ordinal: 0,
                  content: document.content,
                  contentHash: hash(document.content),
                  metadata: { category: metadataMap.get(document.id)?.category ?? "" },
                }) as NewAkiviliChunk,
            ),
          ),
      );

      await tx.insert(akiviliDatasetRevisions).values({
        revision: projection.revision,
        projectionVersion: manifest.projectionVersion,
        sourceChecksums: manifest.source,
        entityCount: projection.entities.length,
        aliasCount: projection.aliases.length,
        relationCount: projection.relations.length,
        documentCount: projection.documents.length,
      });
    });

    return {
      revision: projection.revision,
      counts: {
        entities: projection.entities.length,
        aliases: projection.aliases.length,
        relations: projection.relations.length,
        documents: projection.documents.length,
      },
      durationMs: performance.now() - started,
    };
  } finally {
    await pool.end();
  }
}
