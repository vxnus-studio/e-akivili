import { AkiviliPersistentEntityQueries } from "./persistence/entities.ts";

let persistentCached: Promise<AkiviliPersistentEntityQueries> | undefined;

export function getAkiviliPersistentEntityQueries(): Promise<AkiviliPersistentEntityQueries> {
  persistentCached ??= Promise.resolve(new AkiviliPersistentEntityQueries());
  return persistentCached;
}

export function resetAkiviliPersistentEntityQueriesForTests(): void {
  persistentCached = undefined;
}

export { AkiviliPersistentEntityQueries } from "./persistence/entities.ts";
export type * from "./domain/types.ts";
