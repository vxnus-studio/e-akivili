import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { NormalizedAlias, NormalizedClaim, NormalizedEntity, NormalizedRelation, ProjectionInput } from "./types.ts";

export function dataRoot(): string {
  const candidate = resolve(process.cwd(), "../game-data/sr-data/data/normalized");
  if (existsSync(candidate)) return candidate;
  const directCandidate = resolve(process.cwd(), "game-data/sr-data/data/normalized");
  if (existsSync(directCandidate)) return directCandidate;
  return candidate;
}

export function loadNormalizedInput(root = dataRoot()): ProjectionInput {
  const entitiesPath = join(root, "entities.json");
  const aliasesPath = join(root, "aliases.json");
  const claimsPath = join(root, "claims.json");
  const relationsPath = join(root, "relations.json");

  const entities: NormalizedEntity[] = existsSync(entitiesPath)
    ? JSON.parse(readFileSync(entitiesPath, "utf8"))
    : [];

  const aliases: NormalizedAlias[] = existsSync(aliasesPath)
    ? JSON.parse(readFileSync(aliasesPath, "utf8"))
    : [];

  const claims: NormalizedClaim[] = existsSync(claimsPath)
    ? JSON.parse(readFileSync(claimsPath, "utf8"))
    : [];

  const relations: NormalizedRelation[] = existsSync(relationsPath)
    ? JSON.parse(readFileSync(relationsPath, "utf8"))
    : [];

  return {
    entities,
    aliases,
    claims,
    relations,
  };
}
