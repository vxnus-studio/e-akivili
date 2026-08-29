export interface Provenance {
  provider?: string;
  source?: string;
  sourceId?: string;
  sourceRevision?: string;
  locator?: string;
  contentHash?: string;
  observedAt?: string;
  extractedVia?: string;
  confidence?: string;
  [key: string]: unknown;
}

export interface TemporalSemantics {
  validFrom?: string;
  validUntil?: string;
  release_timestamp?: number;
  game_version?: string;
  [key: string]: unknown;
}

export interface Entity {
  id: string;
  namespace: string;
  kind: string;
  slug: string;
  name: string;
  data: Record<string, unknown>;
  provenance?: Provenance;
  temporal?: TemporalSemantics;
}

export interface Alias {
  id: string;
  entityId: string;
  alias: string;
}

export interface Relation {
  id: string;
  subjectId: string;
  predicate: string;
  objectId: string;
  metadata?: Record<string, unknown>;
  provenance?: Provenance;
  temporal?: TemporalSemantics;
}

export interface Document {
  id: string;
  entityId: string;
  content: string;
  provenance?: Provenance;
}

export interface BatchDataset {
  entities: Entity[];
  aliases: Alias[];
  relations: Relation[];
  documents: Document[];
}

export interface AkiviliDocumentMetadata {
  id: string;
  category: string;
  parentSourceId: string;
  title: string;
}

export interface AkiviliProjection extends BatchDataset {
  entities: Entity[];
  aliases: Alias[];
  relations: Relation[];
  documents: Document[];
  documentMetadata: AkiviliDocumentMetadata[];
  revision: string;
  stats: ProjectionStats;
}

export interface ProjectionStats {
  inputEntities: number;
  inputAliases: number;
  inputClaims: number;
  inputRelations: number;
  projectedEntities: number;
  projectedAliases: number;
  projectedRelations: number;
  projectedDocuments: number;
  projectionMs: number;
  validationMs?: number;
  ingestionMs?: number;
  artifactBytes?: number;
}

export interface NormalizedEntity {
  id: string;
  kind: string;
  name: string;
  data: Record<string, unknown>;
}

export interface NormalizedAlias {
  entityId: string;
  alias: string;
  language: string;
}

export interface NormalizedClaim {
  entityId: string;
  statement: string;
  confidence: string;
  source: string;
}

export interface NormalizedRelation {
  subjectId: string;
  predicate: string;
  objectId: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectionInput {
  entities: NormalizedEntity[];
  aliases: NormalizedAlias[];
  claims: NormalizedClaim[];
  relations: NormalizedRelation[];
}
