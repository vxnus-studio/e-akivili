import type { Provenance, Relation } from "../projection/types.ts";

export interface EntityQueryOptions {
  kind?: string;
  query?: string;
  limit?: number;
  page?: number;
}

export interface AkiviliEntityViewModel {
  id: string;
  canonicalId: string;
  category: string;
  kind: string;
  slug: string;
  name: string;
  description: string | null;
  gameVersion: string | null;
  image: string | null;
  rarity: number | null;
  element: string | null;
  path: string | null;
  canonicalData: Record<string, unknown>;
  aliases: string[];
  provenance?: Provenance;
  revision: string;
}

export interface AkiviliRelationViewModel {
  id: string;
  predicate: string;
  sourcePath: string;
  metadata: Record<string, unknown>;
  object: Pick<AkiviliEntityViewModel, "id" | "canonicalId" | "category" | "kind" | "slug" | "name" | "image">;
}

export interface EntitySearchResult {
  items: AkiviliEntityViewModel[];
  total: number;
  page: number;
  limit: number;
  revision: string;
}

export interface EntityDetailResult {
  item: AkiviliEntityViewModel;
  relations: AkiviliRelationViewModel[];
  revision: string;
}

export interface FarmingSourceViewModel {
  type: "calyx" | "stagnant_shadow" | "echo_of_war" | "enemy";
  name: string;
  kind: string;
  slug: string;
  availableDays?: string[];
}

export interface FarmingMaterialViewModel {
  id: string;
  name: string;
  quantity: number | null;
  phase?: string;
  sources: FarmingSourceViewModel[];
  sourceNotes: string[];
}

export interface FarmingTargetViewModel {
  id: string;
  kind: string;
  slug: string;
  name: string;
}

export interface FarmingPlanResult {
  target: FarmingTargetViewModel;
  materials: FarmingMaterialViewModel[];
  revision: string | null;
  preview: boolean;
}

export type EngineRelation = Relation;
