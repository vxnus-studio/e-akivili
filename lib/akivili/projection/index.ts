import { hashId, PROJECTION_VERSION, stableStringify, toSlug } from "./identity.ts";
import { normalize } from "../domain/entities.ts";
import type {
  AkiviliDocumentMetadata,
  AkiviliProjection,
  Alias,
  Document,
  Entity,
  ProjectionInput,
  ProjectionStats,
  Relation,
} from "./types.ts";

export function projectAkivili(input: ProjectionInput): AkiviliProjection {
  const started = performance.now();

  const entities: Entity[] = [];
  const entityIdSet = new Set<string>();

  for (const item of input.entities) {
    if (!item.id || !item.kind) continue;
    const name = item.name && item.name.trim() ? item.name.trim() : `${item.kind}:${item.id.split(":").at(-1)}`;
    const slug = toSlug(item.kind, item.id, name);
    const entity: Entity = {
      id: item.id,
      namespace: "hsr",
      kind: item.kind,
      slug,
      name,
      data: item.data ?? {},
      provenance: {
        provider: "project-yatta",
        source: "sr-data",
        sourceId: item.id,
      },
      temporal: {
        game_version: "4.5",
      },
    };
    entities.push(entity);
    entityIdSet.add(entity.id);
  }

  const aliases: Alias[] = [];
  const seenAliasKey = new Set<string>();

  for (const item of input.aliases) {
    if (!item.entityId || !item.alias || !entityIdSet.has(item.entityId)) continue;
    const norm = normalize(item.alias);
    if (!norm) continue;
    const key = `${item.entityId}:${norm}`;
    if (seenAliasKey.has(key)) continue;
    seenAliasKey.add(key);

    const aliasId = hashId("hsr:alias", `${item.entityId}:${norm}`);
    aliases.push({
      id: aliasId,
      entityId: item.entityId,
      alias: item.alias,
    });
  }

  const relations: Relation[] = [];
  const seenRelationKey = new Set<string>();

  for (const item of input.relations) {
    if (!item.subjectId || !item.predicate || !item.objectId) continue;
    if (!entityIdSet.has(item.subjectId) || !entityIdSet.has(item.objectId)) continue;
    const key = `${item.subjectId}:${item.predicate}:${item.objectId}`;
    if (seenRelationKey.has(key)) continue;
    seenRelationKey.add(key);

    const relId = hashId("hsr:rel", key);
    relations.push({
      id: relId,
      subjectId: item.subjectId,
      predicate: item.predicate,
      objectId: item.objectId,
      metadata: item.metadata ?? {},
    });
  }

  const documents: Document[] = [];
  const documentMetadata: AkiviliDocumentMetadata[] = [];
  const seenDocKey = new Set<string>();

  let claimIndex = 0;
  for (const item of input.claims) {
    if (!item.entityId || !item.statement || !entityIdSet.has(item.entityId)) continue;
    const key = `${item.entityId}:${item.statement}`;
    if (seenDocKey.has(key)) continue;
    seenDocKey.add(key);

    const docId = hashId("hsr:doc", `${item.entityId}:${claimIndex++}`);
    documents.push({
      id: docId,
      entityId: item.entityId,
      content: item.statement,
      provenance: {
        provider: "project-yatta",
        source: item.source || "Honkai: Star Rail Yatta API",
        confidence: item.confidence,
      },
    });

    const category = item.entityId.split(":")[1] ?? "lore";
    documentMetadata.push({
      id: docId,
      category,
      parentSourceId: item.entityId,
      title: `${category} lore`,
    });
  }

  // Deterministic sorting
  entities.sort((a, b) => a.id.localeCompare(b.id));
  aliases.sort((a, b) => a.id.localeCompare(b.id));
  relations.sort((a, b) => a.id.localeCompare(b.id));
  documents.sort((a, b) => a.id.localeCompare(b.id));
  documentMetadata.sort((a, b) => a.id.localeCompare(b.id));

  const stats: ProjectionStats = {
    inputEntities: input.entities.length,
    inputAliases: input.aliases.length,
    inputClaims: input.claims.length,
    inputRelations: input.relations.length,
    projectedEntities: entities.length,
    projectedAliases: aliases.length,
    projectedRelations: relations.length,
    projectedDocuments: documents.length,
    projectionMs: performance.now() - started,
  };

  const projection: AkiviliProjection = {
    entities,
    aliases,
    relations,
    documents,
    documentMetadata,
    revision: "",
    stats,
  };

  projection.revision = projectionRevision(projection);
  return projection;
}

export function projectionRevision(projection: Omit<AkiviliProjection, "revision">): string {
  const content = stableStringify({
    version: PROJECTION_VERSION,
    entities: projection.entities,
    aliases: projection.aliases,
    relations: projection.relations,
    documents: projection.documents,
  });
  return hashId("akivili:rev", content);
}
