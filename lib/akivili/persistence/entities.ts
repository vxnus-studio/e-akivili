import { and, asc, count, eq, ilike, inArray, or } from "drizzle-orm";
import { getDatabase } from "../../../db/client.ts";
import {
  akiviliAliases,
  akiviliDatasetRevisions,
  akiviliEntities,
  akiviliRelations,
  type AkiviliEntity,
} from "../../../db/schema.ts";
import {
  categoryForKind,
  entityViewModel,
  normalize,
  type EntityLike,
} from "../domain/entities.ts";
import type {
  AkiviliEntityViewModel,
  AkiviliRelationViewModel,
  EntityDetailResult,
  EntityQueryOptions,
  EntitySearchResult,
} from "../domain/types.ts";

function compareAkiviliEntity(a: AkiviliEntity, b: AkiviliEntity): number {
  const dataA = (a.data ?? {}) as Record<string, unknown>;
  const dataB = (b.data ?? {}) as Record<string, unknown>;

  const rarityA = (dataA.rarity ?? dataA.rank ?? 0) as number;
  const rarityB = (dataB.rarity ?? dataB.rank ?? 0) as number;
  if (rarityA !== rarityB) return rarityB - rarityA;

  return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

function toEntityLike(row: AkiviliEntity): EntityLike {
  return {
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    name: row.name,
    data: row.data,
    provenance: row.provenance ?? undefined,
    temporal: row.temporal ?? undefined,
  };
}

export class AkiviliPersistentEntityQueries {
  private readonly db;

  constructor(db = getDatabase()) {
    this.db = db;
  }

  private async revision(): Promise<string> {
    const [row] = await this.db
      .select({ revision: akiviliDatasetRevisions.revision })
      .from(akiviliDatasetRevisions)
      .limit(1);
    return row?.revision ?? "akivili:rev:default";
  }

  private async aliasesFor(entityIds: string[]): Promise<Map<string, string[]>> {
    if (!entityIds.length) return new Map();
    const rows = await this.db
      .select({ entityId: akiviliAliases.entityId, alias: akiviliAliases.alias })
      .from(akiviliAliases)
      .where(inArray(akiviliAliases.entityId, entityIds));
    const result = new Map<string, string[]>();
    for (const row of rows) {
      result.set(row.entityId, [...(result.get(row.entityId) ?? []), row.alias].sort());
    }
    return result;
  }

  private async toViews(rows: AkiviliEntity[], revision: string): Promise<AkiviliEntityViewModel[]> {
    const aliases = await this.aliasesFor(rows.map((row) => row.id));
    return rows.map((row) => entityViewModel(toEntityLike(row), revision, aliases));
  }

  async getEntity(kind: string, slug: string): Promise<AkiviliEntityViewModel | null> {
    const category = categoryForKind(kind);
    const [row] = await this.db
      .select()
      .from(akiviliEntities)
      .where(and(eq(akiviliEntities.kind, category ?? kind), eq(akiviliEntities.slug, slug)))
      .limit(1);
    if (!row) return null;
    const revision = await this.revision();
    return (await this.toViews([row], revision))[0] ?? null;
  }

  async resolveEntity(query: string, kind?: string): Promise<AkiviliEntityViewModel | null> {
    const category = categoryForKind(kind);
    const normalized = normalize(query);
    const conditions = category
      ? and(
          eq(akiviliEntities.kind, category),
          or(eq(akiviliEntities.slug, query.toLowerCase()), ilike(akiviliEntities.name, query)),
        )
      : or(eq(akiviliEntities.slug, query.toLowerCase()), ilike(akiviliEntities.name, query));

    const [direct] = await this.db
      .select()
      .from(akiviliEntities)
      .where(conditions)
      .orderBy(asc(akiviliEntities.name), asc(akiviliEntities.id))
      .limit(1);
    if (direct) return (await this.toViews([direct], await this.revision()))[0] ?? null;

    const aliasRows = await this.db
      .select({ entityId: akiviliAliases.entityId })
      .from(akiviliAliases)
      .where(ilike(akiviliAliases.normalizedAlias, `%${normalized}%`))
      .limit(20);
    if (!aliasRows.length) return null;

    const ids = aliasRows.map((row) => row.entityId);
    const rows = await this.db
      .select()
      .from(akiviliEntities)
      .where(and(inArray(akiviliEntities.id, ids), ...(category ? [eq(akiviliEntities.kind, category)] : [])))
      .orderBy(asc(akiviliEntities.name), asc(akiviliEntities.id))
      .limit(1);
    return rows.length ? (await this.toViews(rows, await this.revision()))[0] ?? null : null;
  }

  async searchEntities(options: EntityQueryOptions = {}): Promise<EntitySearchResult> {
    const category = categoryForKind(options.kind);
    const query = options.query?.trim() ?? "";
    const normalized = normalize(query);

    const categoryCondition = category ? eq(akiviliEntities.kind, category) : undefined;
    const queryCondition = normalized
      ? or(ilike(akiviliEntities.name, `%${query}%`), ilike(akiviliEntities.slug, `%${query}%`))
      : undefined;

    const base = [categoryCondition, queryCondition].filter(Boolean) as Parameters<typeof and>;
    let rows = await this.db
      .select()
      .from(akiviliEntities)
      .where(base.length ? and(...base) : undefined)
      .orderBy(asc(akiviliEntities.name), asc(akiviliEntities.id));

    if (normalized) {
      const aliasRows = await this.db
        .select({ entityId: akiviliAliases.entityId })
        .from(akiviliAliases)
        .where(ilike(akiviliAliases.normalizedAlias, `%${normalized}%`));
      const aliasIds = new Set(aliasRows.map((row) => row.entityId));
      const aliasEntities = aliasIds.size
        ? await this.db
            .select()
            .from(akiviliEntities)
            .where(inArray(akiviliEntities.id, [...aliasIds]))
            .orderBy(asc(akiviliEntities.name), asc(akiviliEntities.id))
        : [];
      const merged = new Map(rows.map((row) => [row.id, row]));
      for (const row of aliasEntities) {
        if (!category || row.kind === category) merged.set(row.id, row);
      }
      rows = [...merged.values()].sort(compareAkiviliEntity);
    } else {
      rows = rows.sort(compareAkiviliEntity);
    }

    const limit = Math.max(1, Math.min(50, options.limit ?? 24));
    const page = Math.max(1, options.page ?? 1);
    const revision = await this.revision();
    const views = await this.toViews(rows.slice((page - 1) * limit, page * limit), revision);
    return { items: views, total: rows.length, page, limit, revision };
  }

  async listEntities(options: EntityQueryOptions = {}): Promise<EntitySearchResult> {
    return this.searchEntities({ ...options, query: "" });
  }

  async detail(kind: string, slug: string): Promise<EntityDetailResult | null> {
    const item = await this.getEntity(kind, slug);
    if (!item) return null;

    const relationRows = await this.db
      .select()
      .from(akiviliRelations)
      .where(eq(akiviliRelations.subjectId, item.id))
      .limit(100);

    const objectIds = relationRows.map((row) => row.objectId);
    const objects = objectIds.length
      ? await this.db.select().from(akiviliEntities).where(inArray(akiviliEntities.id, objectIds))
      : [];
    const objectMap = new Map(objects.map((row) => [row.id, row]));
    const revision = item.revision;
    const aliases = await this.aliasesFor(objects.map((row) => row.id));

    const relations: AkiviliRelationViewModel[] = [];
    for (const relation of relationRows) {
      const object = objectMap.get(relation.objectId);
      if (!object) continue;
      const objectView = entityViewModel(toEntityLike(object), revision, aliases);
      relations.push({
        id: relation.id,
        predicate: relation.predicate,
        sourcePath: relation.predicate,
        metadata: (relation.metadata ?? {}) as Record<string, unknown>,
        object: {
          id: objectView.id,
          canonicalId: objectView.canonicalId,
          category: objectView.category,
          kind: objectView.kind,
          slug: objectView.slug,
          name: objectView.name,
          image: objectView.image,
        },
      });
    }

    return { item, relations, revision };
  }
}

export async function countAkiviliEntities(db = getDatabase()) {
  const [row] = await db.select({ count: count() }).from(akiviliEntities);
  return Number(row?.count ?? 0);
}
