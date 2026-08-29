import { createHash } from "node:crypto";

export const PROJECTION_VERSION = "akivili-e-projection-v1";

export function toSlug(kind: string, id: string, name?: string): string {
  const source = typeof name === "string" && name.trim() ? name : `${kind}-${id.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const slug = source
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
  return slug || `${kind}-${id.split(":").at(-1) ?? id}`;
}

export function hashId(prefix: string, value: string): string {
  return `${prefix}:${createHash("sha256").update(value).digest("hex")}`;
}

export function stableStringify(value: unknown): string {
  if (value === undefined) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).filter((key) => object[key] !== undefined).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`).join(",")}}`;
}
