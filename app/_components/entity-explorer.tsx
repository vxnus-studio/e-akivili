"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import {
  Flame,
  Droplets,
  Wind,
  Zap,
  Snowflake,
  Leaf,
  Mountain,
  Star,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
export interface EntityPreview {
  id: number | string;
  kind: string;
  slug: string;
  name: string;
  description: string | null;
  gameVersion: string | null;
  image: string | null;
  rarity: number | null;
  element: string | null;
  path?: string | null;
}

export const defaultKindLabels: Record<string, string> = {
  characters: "Character",
  "light-cones": "Light Cone",
  weapons: "Light Cone",
  materials: "Material",
  domains: "Domain",
  relics: "Relic & Ornament",
  artifacts: "Relic & Ornament",
  enemies: "Enemy",
  geographies: "Region",
};

export function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let prev: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (prev !== undefined) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (i - prev !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    prev = i;
  }

  return rangeWithDots;
}

export function EntityImage({ entity }: { entity: EntityPreview }) {
  const [error, setError] = useState(false);
  if (!entity.image || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--surface-sunken)]">
        <span className="text-3xl font-bold text-[var(--accent)] opacity-25">
          {entity.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <img
      src={entity.image}
      alt={entity.name}
      onError={() => setError(true)}
      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
    />
  );
}

export interface EntityExplorerProps {
  kind?: string;
  compact?: boolean;
  kindLabels?: Record<string, string>;
  apiEndpoint?: string;
  getDetailHref?: (entity: EntityPreview) => string;
  renderElementBadge?: (element: string | null) => ReactNode;
}

interface EntitySearchResult {
  items: EntityPreview[];
  total: number;
  limit: number;
  page: number;
  preview?: boolean;
}

export function EntityExplorer({
  kind,
  compact = false,
  kindLabels = defaultKindLabels,
  apiEndpoint = "/api/entities",
  getDetailHref,
  renderElementBadge,
}: EntityExplorerProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [result, setResult] = useState<EntitySearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const explorerRef = useRef<HTMLElement>(null);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (explorerRef.current) {
      const topOffset = explorerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      limit: compact ? "12" : "24",
      page: page.toString(),
    });
    if (kind) params.set("kind", kind);
    if (submittedQuery) params.set("q", submittedQuery);

    fetch(`${apiEndpoint}?${params}`)
      .then((response) => {
        if (!response.ok) throw new Error("The knowledge API is unavailable.");
        return response.json();
      })
      .then((payload: EntitySearchResult) => {
        if (active) setResult(payload);
      })
      .catch((cause) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Search failed.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiEndpoint, compact, kind, page, submittedQuery]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmittedQuery(query);
    setPage(1);
  }

  const totalPages = result ? Math.ceil(result.total / result.limit) : 0;
  const paginationRange = totalPages > 1 ? getPaginationRange(page, totalPages) : [];

  const defaultElementBadge = (element: string | null) => {
    if (!element) return null;
    const el = element.toLowerCase();
    const props = { size: 14, strokeWidth: 2.5, className: "drop-shadow-sm" };

    if (el.includes("pyro") || el === "fire") return <Flame {...props} color="#ff5a5a" />;
    if (el.includes("hydro") || el === "water") return <Droplets {...props} color="#45b6ff" />;
    if (el.includes("anemo") || el === "wind") return <Wind {...props} color="#5ceda1" />;
    if (el.includes("electro") || el.includes("lightning") || el.includes("thunder"))
      return <Zap {...props} color="#c65df5" />;
    if (el.includes("cryo") || el === "ice") return <Snowflake {...props} color="#99ffff" />;
    if (el.includes("dendro")) return <Leaf {...props} color="#85cc33" />;
    if (el.includes("geo") || el === "physical") return <Mountain {...props} color="#ffb13b" />;
    if (el.includes("quantum")) return <Zap {...props} color="#6375f0" />;
    if (el.includes("imaginary")) return <Star {...props} color="#f5c842" />;
    return <HelpCircle {...props} color="#ffffff" />;
  };

  const getBadge = renderElementBadge ?? defaultElementBadge;

  return (
    <section ref={explorerRef} className="entity-explorer" aria-busy={loading}>
      <form className="entity-search" onSubmit={submit}>
        <label>
          <span className="sr-only">
            Search {kind ? kindLabels[kind] ?? kind : "all entities"}
          </span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder={kind ? `Search ${kindLabels[kind] ?? kind}…` : "Search characters, light cones, relics…"}
            type="search"
            value={query}
          />
        </label>
        <button type="submit">Search graph</button>
      </form>

      <div className="entity-result-meta">
        <span>
          {loading
            ? "Querying knowledge graph…"
            : `${result?.total ?? 0} ${kind ? kindLabels[kind] ?? kind : "entities"} shown`}
        </span>
        {result?.preview ? (
          <span className="preview-pill">Preview data · connect Neon for full results</span>
        ) : null}
      </div>

      {error ? <p className="data-error">{error}</p> : null}

      {!loading && !error && result?.items.length === 0 ? (
        <div className="empty-knowledge">
          <strong>No matching records</strong>
          <span>
            {submittedQuery
              ? `Nothing matched “${submittedQuery}”.`
              : "Run the first sync after connecting Neon."}
          </span>
        </div>
      ) : null}

      <div className="entity-grid mt-6 gap-4 sm:gap-6">
        {result?.items.map((entity) => {
          let rarityColor = "rgba(255, 255, 255, 0.1)";
          let rarityGlow = "transparent";

          if (entity.rarity === 5) {
            rarityColor = "#d4af37";
            rarityGlow = "rgba(212, 175, 55, 0.35)";
          } else if (entity.rarity === 4) {
            rarityColor = "#a366ff";
            rarityGlow = "rgba(163, 102, 255, 0.35)";
          } else if (entity.rarity === 3) {
            rarityColor = "#4da6ff";
            rarityGlow = "rgba(77, 166, 255, 0.35)";
          }

          const ElementIcon = getBadge(entity.element);
          const isCharacter = entity.kind === "characters" || entity.kind === "character";
          const href = getDetailHref
            ? getDetailHref(entity)
            : isCharacter
              ? `/characters/${entity.slug}`
              : `/database/${entity.kind}/${entity.slug}`;

          return (
            <Link
              key={`${entity.kind}:${entity.id}`}
              href={href}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-[var(--surface-sunken)] border border-white/10 hover:border-[var(--accent)]/50 transition-all duration-300 hover:-translate-y-1.5"
              style={{
                boxShadow: `0 4px 20px -2px rgba(0,0,0,0.5), 0 0 15px ${rarityGlow}`,
                borderBottom: `3px solid ${rarityColor}`,
              }}
            >
              {/* Centered 256x256 image area with no overlays obscuring the character */}
              <div className="relative aspect-square w-full bg-[var(--surface)] flex items-center justify-center p-3 overflow-hidden">
                {entity.image ? (
                  <img
                    src={entity.image}
                    alt={entity.name}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full font-mono text-xl font-bold text-[var(--green-2)]/40">
                    {entity.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Element badge anchored in top-right without covering the subject */}
                {ElementIcon && (
                  <div
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md group-hover:bg-black/80 transition-colors"
                    title={entity.element ?? undefined}
                  >
                    {ElementIcon}
                  </div>
                )}
              </div>

              {/* Clean info bar below the image - text NEVER overlays or covers the character art */}
              <div className="p-3 bg-[var(--surface-2)]/70 border-t border-white/5 flex flex-col justify-center items-center min-h-[58px] gap-1">
                <h2 className="text-xs sm:text-sm font-bold text-white text-center leading-tight truncate w-full group-hover:text-[var(--green-2)] transition-colors">
                  {entity.name}
                </h2>
                {entity.path || entity.element ? (
                  <span className="text-[10px] text-[var(--text-3)] font-mono text-center truncate w-full">
                    {[entity.element, entity.path].filter(Boolean).join(" · ")}
                  </span>
                ) : (
                  <span className="text-[10px] text-[var(--text-3)] font-mono text-center truncate w-full capitalize">
                    {defaultKindLabels[entity.kind] ?? entity.kind}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {result && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[var(--line)] w-full">
          <div className="text-xs text-[var(--text-3)] font-mono text-center sm:text-left">
            Showing{" "}
            <span className="text-[var(--text-light)] font-semibold">
              {(page - 1) * result.limit + 1}
            </span>
            –
            <span className="text-[var(--text-light)] font-semibold">
              {Math.min(page * result.limit, result.total)}
            </span>{" "}
            of{" "}
            <span className="text-[var(--text-light)] font-semibold">{result.total}</span>{" "}
            entities
          </div>

          <div className="flex sm:hidden items-center justify-center gap-1.5 w-full">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(1)}
              className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--text-3)] hover:text-[var(--text)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="First page"
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--text-2)] hover:text-white hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3.5 py-1.5 bg-[var(--surface-sunken)] border border-[var(--line)] rounded-lg text-xs font-mono text-[var(--text-2)] flex items-center gap-1.5 shadow-inner">
              <span className="text-[var(--green)] font-bold">{page}</span>
              <span className="text-[var(--text-3)]">/</span>
              <span className="text-[var(--text-light)]">{totalPages}</span>
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--text-2)] hover:text-white hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--text-3)] hover:text-[var(--text)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="Last page"
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(1)}
              className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--text-3)] hover:text-[var(--text)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="First page"
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-xs text-[var(--text-2)] hover:text-white hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <div className="flex items-center gap-1">
              {paginationRange.map((pageNum, idx) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 py-1 text-xs text-[var(--text-3)] font-mono select-none"
                    >
                      …
                    </span>
                  );
                }
                const isCurrent = pageNum === page;
                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum as number)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                      isCurrent
                        ? "bg-[var(--green)] text-[#081610] shadow-[0_0_14px_rgba(245,166,35,0.35)] border border-[var(--green)]"
                        : "bg-[var(--surface-sunken)] text-[var(--text-2)] border border-[var(--line)] hover:bg-[var(--surface-2)] hover:border-[var(--line-strong)] hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-xs text-[var(--text-2)] hover:text-white hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="Next page"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--text-3)] hover:text-[var(--text)] hover:border-[var(--line-strong)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
              title="Last page"
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
