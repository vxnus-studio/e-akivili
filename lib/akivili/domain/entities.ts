import type { Entity } from "../projection/types.ts";
import type {
  AkiviliEntityViewModel,
  AkiviliRelationViewModel,
  EntityDetailResult,
  EntityQueryOptions,
  EntitySearchResult,
} from "./types.ts";

export const CATEGORY_BY_UI_KIND: Record<string, string> = {
  characters: "character",
  "light-cones": "lightcone",
  lightcones: "lightcone",
  relics: "relic_set",
  "relic-sets": "relic_set",
  items: "item",
  materials: "item",
  books: "book",
  messages: "message",
};

export const UI_KIND_BY_CATEGORY: Record<string, string> = {
  character: "characters",
  lightcone: "light-cones",
  relic_set: "relics",
  item: "items",
  book: "books",
  message: "messages",
};

export function categoryForKind(kind?: string): string | undefined {
  if (!kind) return undefined;
  return CATEGORY_BY_UI_KIND[kind] ?? kind;
}

export function normalize(value: string): string {
  const norm = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "");
  return norm || value.trim().toLowerCase();
}

function text(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object" && typeof (value as { en?: unknown }).en === "string") {
    const english = (value as { en: string }).en.trim();
    return english || null;
  }
  return null;
}

function imageFromData(kind: string, data: Record<string, unknown>, id: string): string | null {
  const custom = typeof data.custom_image_url === "string" ? data.custom_image_url : null;
  if (custom) return custom;
  const icon = typeof data.icon === "string" ? data.icon : null;
  if (icon?.startsWith("http")) return icon;
  const numericId = id.split(":").at(-1);
  if (kind === "character") {
    const charId = icon ?? numericId;
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.vxnus.xyz";
    return `${cdnUrl}/e-akivili/characters/${charId}.avif`;
  }
  if (kind === "lightcone") {
    return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/light_cone/${icon ?? numericId}.png`;
  }
  if (kind === "relic_set") {
    return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/relic/${icon ?? numericId}.png`;
  }
  if (kind === "item") {
    return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/item/${icon ?? numericId}.png`;
  }
  return null;
}

export type EntityLike = Pick<Entity, "id" | "kind" | "slug" | "name" | "data" | "provenance" | "temporal">;

export function entityViewModel(
  entity: EntityLike,
  revision: string,
  aliasesByEntity: Map<string, string[]>,
): AkiviliEntityViewModel {
  const data = (entity.data ?? {}) as Record<string, unknown>;
  const element = text(data.element) ?? text(data.element_id);
  const path = text(data.path) ?? text(data.path_id);
  const rarityValue = data.rarity ?? data.rank;

  return {
    id: entity.id,
    canonicalId: entity.id,
    category: entity.kind,
    kind: UI_KIND_BY_CATEGORY[entity.kind] ?? entity.kind,
    slug: entity.slug,
    name: entity.name,
    description: text(data.description),
    gameVersion: entity.temporal?.game_version ?? "4.5",
    image: imageFromData(entity.kind, data, entity.id),
    rarity: typeof rarityValue === "number" ? rarityValue : null,
    element,
    path,
    canonicalData: data,
    aliases: aliasesByEntity.get(entity.id) ?? [],
    provenance: entity.provenance,
    revision,
  };
}
