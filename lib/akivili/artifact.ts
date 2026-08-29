import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AkiviliProjection, BatchDataset } from "./projection/types.ts";
import { stableStringify } from "./projection/identity.ts";
import { projectionRevision } from "./projection/index.ts";
import { validateProjection } from "./projection/validate.ts";

export const ARTIFACT_DIR = join(process.cwd(), "data", "artifact");
export const ARTIFACT_PATH = join(ARTIFACT_DIR, "akivili-artifact.json");
export const MANIFEST_PATH = join(ARTIFACT_DIR, "manifest.json");

export interface AkiviliArtifactManifest {
  projectionVersion: string;
  revision: string;
  source: {
    entitiesSha256: string;
    aliasesSha256: string;
    claimsSha256: string;
    relationsSha256: string;
    combinedSha256: string;
  };
  counts: {
    entities: number;
    aliases: number;
    relations: number;
    documents: number;
  };
  artifactSha256: string;
  artifactBytes: number;
  generatedAt: string;
}

export function readArtifact(path = ARTIFACT_PATH): AkiviliProjection {
  const projection = JSON.parse(readFileSync(path, "utf8")) as AkiviliProjection;
  validateProjection(projection);
  if (projection.revision !== projectionRevision(projection)) {
    throw new Error(`Artifact revision mismatch: ${projection.revision}`);
  }
  return projection;
}

export function readArtifactManifest(path = MANIFEST_PATH): AkiviliArtifactManifest {
  return JSON.parse(readFileSync(path, "utf8")) as AkiviliArtifactManifest;
}

export function artifactSha256(dataset: BatchDataset & { documentMetadata?: unknown; revision?: string; stats?: unknown }): string {
  return createHash("sha256").update(stableStringify(dataset)).digest("hex");
}
