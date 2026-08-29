import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARTIFACT_DIR, ARTIFACT_PATH, MANIFEST_PATH } from "../lib/akivili/artifact.ts";
import { dataRoot, loadNormalizedInput } from "../lib/akivili/projection/input.ts";
import { PROJECTION_VERSION, stableStringify } from "../lib/akivili/projection/identity.ts";
import { projectAkivili, projectionRevision } from "../lib/akivili/projection/index.ts";
import { validateProjection } from "../lib/akivili/projection/validate.ts";

function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

const root = dataRoot();
const input = loadNormalizedInput(root);
const projection = projectAkivili(input);

const artifact = {
  ...projection,
  stats: {
    ...projection.stats,
    projectionMs: 0,
    validationMs: 0,
    ingestionMs: undefined,
    artifactBytes: undefined,
  },
};

artifact.revision = projectionRevision(artifact);
validateProjection(artifact);

const serialized = stableStringify(artifact);
const artifactBuffer = Buffer.from(serialized, "utf8");

const entityBytes = readFileSync(join(root, "entities.json"));
const aliasBytes = readFileSync(join(root, "aliases.json"));
const claimBytes = readFileSync(join(root, "claims.json"));
const relationBytes = readFileSync(join(root, "relations.json"));

const manifest = {
  projectionVersion: PROJECTION_VERSION,
  revision: artifact.revision,
  source: {
    entitiesSha256: sha256(entityBytes),
    aliasesSha256: sha256(aliasBytes),
    claimsSha256: sha256(claimBytes),
    relationsSha256: sha256(relationBytes),
    combinedSha256: sha256(Buffer.concat([entityBytes, aliasBytes, claimBytes, relationBytes])),
  },
  counts: {
    entities: artifact.entities.length,
    aliases: artifact.aliases.length,
    relations: artifact.relations.length,
    documents: artifact.documents.length,
  },
  artifactSha256: sha256(artifactBuffer),
  artifactBytes: artifactBuffer.byteLength,
  generatedAt: new Date().toISOString(),
};

mkdirSync(ARTIFACT_DIR, { recursive: true });
writeFileSync(ARTIFACT_PATH, artifactBuffer);
writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

const written = readFileSync(ARTIFACT_PATH);
if (sha256(written) !== manifest.artifactSha256) {
  throw new Error("Generated artifact checksum verification failed");
}

console.log(
  JSON.stringify(
    {
      artifact: ARTIFACT_PATH,
      manifest: MANIFEST_PATH,
      revision: artifact.revision,
      counts: manifest.counts,
      bytes: manifest.artifactBytes,
      sourceRoot: root,
    },
    null,
    2,
  ),
);
