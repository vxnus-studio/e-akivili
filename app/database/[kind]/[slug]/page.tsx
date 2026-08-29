import { getAkiviliPersistentEntityQueries } from "@/lib/akivili/engine";
import { ArrowRight, Gem, Layers, Sparkles, Sword, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  EntityHero,
  FactsGrid,
  ProgressionCalculator,
  type AscensionPhase,
  type MaterialItem,
  type TagItem,
  type FactItem,
} from "@vxnus/ui-game";

type DataRecord = Record<string, unknown>;

function record(value: unknown): DataRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as DataRecord) : {};
}

function text(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object") {
    const obj = value as { canonical?: unknown; en?: unknown; name?: unknown };
    if (typeof obj.canonical === "string" && obj.canonical) return obj.canonical;
    if (typeof obj.en === "string" && obj.en) return obj.en;
    if (typeof obj.name === "string" && obj.name) return obj.name;
  }
  return fallback;
}

function cleanText(str: string): string {
  if (!str) return "";
  return str
    .replace(/<color=#[A-Fa-f0-9]+>/g, "")
    .replace(/<\/color>/g, "")
    .replace(/<unbreak>/g, "")
    .replace(/<\/unbreak>/g, "")
    .replace(/<u>/g, "")
    .replace(/<\/u>/g, "")
    .replace(/\\n/g, "\n");
}

export default async function GenericEntityDetailPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  const { kind, slug } = await params;

  // If kind is characters, redirect to /characters/[slug]
  if (kind === "characters" || kind === "character") {
    redirect(`/characters/${slug}`);
  }

  const entityQueries = await getAkiviliPersistentEntityQueries();
  const detail = await entityQueries.detail(kind, slug);

  if (!detail) notFound();

  const { item: entity, relations } = detail;
  const data = entity.canonicalData;
  const rarity = typeof entity.rarity === "number" ? entity.rarity : null;
  const description = entity.description ?? text(data.description) ?? "";
  const path = entity.path ?? text(data.path);
  const element = entity.element ?? text(data.element);

  const materials = relations
    .filter((r) => r.predicate === "requires_ascension_material")
    .map((r) => ({
      id: r.object.id,
      slug: r.object.slug,
      name: r.object.name,
      kind: r.object.kind,
      image: r.object.image,
      count: Number(r.metadata?.amount ?? 1) || 1,
    }));

  const ascensionPhases: AscensionPhase[] = [
    {
      phase: 1,
      levelRange: "Lvl 20 → 40",
      credits: 2000,
      materials: materials.slice(0, 2),
    },
    {
      phase: 2,
      levelRange: "Lvl 40 → 60",
      credits: 8000,
      materials: materials.slice(1, 3),
    },
    {
      phase: 3,
      levelRange: "Lvl 60 → 80",
      credits: 20000,
      materials: materials.slice(2),
    },
  ].filter((p) => p.materials.length > 0);

  // Hero tags
  const tags: TagItem[] = [];
  if (path && path !== "—") {
    tags.push({ label: path, icon: <Sword size={12} /> });
  }
  if (element && element !== "—") {
    tags.push({ label: element, icon: <Zap size={12} /> });
  }
  tags.push({ label: kind.replace(/-/g, " "), icon: <Gem size={12} /> });

  // Facts
  const facts: FactItem[] = [
    { label: "Category", value: kind },
    { label: "Slug Identifier", value: entity.slug },
    { label: "Path", value: path },
    { label: "Rarity", value: rarity ? `${rarity}-Star` : "—" },
  ];

  return (
    <div className="character-detail-page">
      <EntityHero
        name={entity.name}
        subtitle={path && path !== "—" ? path : null}
        eyebrow={`Database Record / ${kind}`}
        stars={rarity}
        description={cleanText(description)}
        backHref={`/database/${kind}`}
        backLabel={`${kind} index`}
        tags={tags}
        image={entity.image}
        gameVersion={entity.gameVersion}
        signalLabel="Canonical entry"
        renderImage={
          entity.image
            ? (src, name) => (
                <div className="w-56 h-56 sm:w-72 sm:h-72 relative flex items-center justify-center">
                  <Image
                    src={src}
                    alt={name}
                    width={280}
                    height={280}
                    className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                    priority
                  />
                </div>
              )
            : undefined
        }
      />

      <FactsGrid facts={facts} />

      {/* Ascension Progression if applicable */}
      {materials.length > 0 && (
        <section className="mb-10">
          <header className="banner-section-heading mb-4">
            <div>
              <span>01 / Material Requirements</span>
              <h2>Ascension Materials</h2>
            </div>
            <p>Direct component relations required for upgrades</p>
          </header>

          <ProgressionCalculator
            ascensionPhases={ascensionPhases}
            totalAscensionMaterials={materials}
            titlePrefix={entity.name}
          />
        </section>
      )}

      {/* Relational Graph Nodes */}
      {relations.length > 0 && (
        <section className="mb-10">
          <header className="banner-section-heading mb-4">
            <div>
              <span>02 / Relational Graph</span>
              <h2>Connected Entities ({relations.length})</h2>
            </div>
            <p>Knowledge graph edges connected to this record</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {relations.map((rel, idx) => (
              <Link
                key={idx}
                href={
                  rel.object.kind === "characters" || rel.object.kind === "character"
                    ? `/characters/${rel.object.slug}`
                    : `/database/${rel.object.kind}/${rel.object.slug}`
                }
                className="flex items-center justify-between gap-3 bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-white/5 hover:border-[var(--accent)] rounded-xl p-3.5 transition-all group hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-black/40 relative overflow-hidden flex items-center justify-center p-1 border border-white/5 shrink-0">
                    {rel.object.image ? (
                      <Image
                        src={rel.object.image}
                        alt={rel.object.name}
                        width={36}
                        height={36}
                        className="object-contain drop-shadow"
                      />
                    ) : (
                      <span className="font-bold text-xs text-[var(--accent)]">
                        {rel.object.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="truncate">
                    <strong className="text-sm block text-[var(--text-light)] group-hover:text-[var(--accent)] truncate">
                      {rel.object.name}
                    </strong>
                    <small className="text-xs text-[var(--text-muted)] uppercase font-mono">
                      {rel.predicate.replace(/_/g, " ")}
                    </small>
                  </div>
                </div>

                <ArrowRight size={15} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
