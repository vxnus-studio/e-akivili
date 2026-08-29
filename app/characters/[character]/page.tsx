import { getAkiviliPersistentEntityQueries } from "@/lib/akivili/engine";
import { BookOpen, CalendarDays, Gem, Sparkles, Sword, Zap } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
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

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ character: string }>;
}) {
  const { character: slug } = await params;
  const entityQueries = await getAkiviliPersistentEntityQueries();
  const detail = await entityQueries.detail("characters", slug);

  if (!detail) notFound();

  const { item: character, relations } = detail;
  const data = character.canonicalData;
  const voices = record(data.cv);

  // Ascension & materials
  const ascensionRelations = relations.filter((r) => r.predicate === "requires_ascension_material");

  const totalMap = new Map<string, MaterialItem>();
  for (const rel of ascensionRelations) {
    const count = Number(rel.metadata?.amount ?? 1) || 1;
    const item: MaterialItem = {
      id: rel.object.id,
      slug: rel.object.slug,
      name: rel.object.name,
      kind: rel.object.kind,
      image: rel.object.image,
      count,
    };
    const existing = totalMap.get(rel.object.id);
    if (existing) {
      existing.count += count;
    } else {
      totalMap.set(rel.object.id, { ...item, count });
    }
  }

  const totalAscensionMaterials: MaterialItem[] = Array.from(totalMap.values()).sort(
    (a, b) => b.count - a.count,
  );

  const ascensionPhases: AscensionPhase[] = [
    {
      phase: 1,
      levelRange: "Lvl 20 → 40",
      credits: 4000,
      materials: totalAscensionMaterials.slice(0, 2),
    },
    {
      phase: 2,
      levelRange: "Lvl 40 → 50",
      credits: 8000,
      materials: totalAscensionMaterials.slice(1, 3),
    },
    {
      phase: 3,
      levelRange: "Lvl 50 → 60",
      credits: 16000,
      materials: totalAscensionMaterials.slice(2, 4),
    },
    {
      phase: 4,
      levelRange: "Lvl 60 → 70",
      credits: 40000,
      materials: totalAscensionMaterials.slice(3, 5),
    },
    {
      phase: 5,
      levelRange: "Lvl 70 → 80",
      credits: 80000,
      materials: totalAscensionMaterials.slice(4),
    },
  ].filter((p) => p.materials.length > 0);

  const rarity = typeof character.rarity === "number" ? character.rarity : 4;
  const element = character.element ?? text(data.element);
  const path = character.path ?? text(data.path);
  const faction = text(data.faction) !== "—" ? text(data.faction) : text(record(data.fetter).faction);
  const description =
    character.description ??
    (Array.isArray(data.story) && data.story[0]
      ? cleanText(String((data.story[0] as DataRecord).text ?? ""))
      : "");

  // Base Stats
  const baseStats = record(data.base_stats);
  const hp = baseStats.hPBase ? Math.round(Number(baseStats.hPBase)) : null;
  const atk = baseStats.attackBase ? Math.round(Number(baseStats.attackBase)) : null;
  const def = baseStats.defenceBase ? Math.round(Number(baseStats.defenceBase)) : null;
  const spd = baseStats.speedBase ? Math.round(Number(baseStats.speedBase)) : null;

  // Skills, Passives, Eidolons, Story
  const skills = Array.isArray(data.skills) ? (data.skills as DataRecord[]) : [];
  const passives = Array.isArray(data.passives) ? (data.passives as DataRecord[]) : [];
  const eidolons = Array.isArray(data.eidolons) ? (data.eidolons as DataRecord[]) : [];
  const stories = Array.isArray(data.story) ? (data.story as DataRecord[]) : [];

  // Hero Tags
  const tags: TagItem[] = [];
  if (element && element !== "—") {
    tags.push({ label: element, icon: <Zap size={12} /> });
  }
  if (path && path !== "—") {
    tags.push({ label: path, icon: <Sword size={12} /> });
  }
  if (faction && faction !== "—") {
    tags.push({ label: faction, icon: <Gem size={12} /> });
  }

  // Facts items
  const facts: FactItem[] = [
    { label: "Path", value: path },
    { label: "Combat Type", value: element },
    { label: "Faction", value: faction },
    { label: "Base HP (Lvl 1)", value: hp ? String(hp) : "—" },
    { label: "Base ATK (Lvl 1)", value: atk ? String(atk) : "—" },
    { label: "Base DEF (Lvl 1)", value: def ? String(def) : "—" },
    { label: "Base SPD", value: spd ? String(spd) : "—" },
    { label: "Eidolons", value: String(eidolons.length || data.eidolon_count || 6) },
  ];

  return (
    <div className="character-detail-page">
      <EntityHero
        name={character.name}
        subtitle={path && path !== "—" ? path : null}
        eyebrow={`Astral Profile / ${element?.toLowerCase() ?? "cosmic"}`}
        stars={rarity}
        description={description}
        backHref="/database/characters"
        backLabel="Character index"
        tags={tags}
        image={character.image}
        gameVersion={character.gameVersion}
        signalLabel="Canonical record"
        renderImage={
          character.image
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

      {/* Combat Skills */}
      {skills.length > 0 && (
        <section className="mb-10">
          <header className="banner-section-heading mb-4">
            <div>
              <span>01 / Combat Abilities</span>
              <h2>Combat Skills & Talents</h2>
            </div>
            <p>Traces and active battle commands</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, idx) => (
              <div
                key={String(skill.id || idx)}
                className="bg-[var(--surface-sunken)] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--accent)]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--green-2)] font-bold">
                      {String(skill.type || "Skill")}
                    </span>
                    {Boolean(skill.tag) && (
                      <span className="text-[10px] text-[var(--text-3)] font-mono">
                        {String(skill.tag)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{String(skill.name)}</h3>
                  <p className="text-xs text-[var(--text-2)] leading-relaxed m-0 whitespace-pre-line">
                    {cleanText(String(skill.description))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Minor Traces / Passives */}
      {passives.length > 0 && (
        <section className="mb-10">
          <header className="banner-section-heading mb-4">
            <div>
              <span>02 / Major Traces</span>
              <h2>Ascension Bonus Abilities</h2>
            </div>
            <p>Passive perks unlocked through Ascension 2, 4, and 6</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {passives.map((passive, idx) => (
              <div
                key={String(passive.id || idx)}
                className="bg-[var(--surface-sunken)] border border-white/5 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[var(--accent)]" />
                  <h3 className="text-sm font-bold text-white m-0">{String(passive.name)}</h3>
                </div>
                <p className="text-xs text-[var(--text-3)] leading-relaxed m-0 whitespace-pre-line">
                  {cleanText(String(passive.description))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Eidolons */}
      {eidolons.length > 0 && (
        <section className="mb-10">
          <header className="banner-section-heading mb-4">
            <div>
              <span>03 / Stellar Constellations</span>
              <h2>Eidolon Resonances</h2>
            </div>
            <p>Duplicate character warp unlocks from Rank 1 through Rank 6</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eidolons.map((eidolon) => (
              <div
                key={String(eidolon.rank)}
                className="bg-[var(--surface-sunken)] border border-white/5 rounded-2xl p-5 flex gap-4 items-start hover:border-white/20 transition-all"
              >
                <span className="w-9 h-9 rounded-xl bg-[var(--surface-raised)] border border-white/10 flex items-center justify-center font-mono font-black text-sm text-[var(--gold)] shrink-0">
                  E{String(eidolon.rank)}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{String(eidolon.name)}</h3>
                  <p className="text-xs text-[var(--text-2)] leading-relaxed m-0 whitespace-pre-line">
                    {cleanText(String(eidolon.description))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Progression & Materials Section via ui-game */}
      {totalAscensionMaterials.length > 0 && (
        <section className="mb-10">
          <header className="banner-section-heading mb-4">
            <div>
              <span>04 / Progression Calculator</span>
              <h2>Ascension Materials</h2>
            </div>
            <p>
              {totalAscensionMaterials.length} farming resources with exact step-by-step quotas
            </p>
          </header>

          <ProgressionCalculator
            ascensionPhases={ascensionPhases}
            totalAscensionMaterials={totalAscensionMaterials}
            titlePrefix="Character"
          />
        </section>
      )}

      {/* Character Stories & Voice Cast */}
      <section className="character-bottom-grid">
        <article>
          <span className="banner-kicker">
            <BookOpen size={13} /> Character Archive
          </span>
          <h2>Lore & Background</h2>
          <div className="space-y-3">
            {stories.slice(0, 3).map((st, idx) => (
              <div key={idx} className="bg-[var(--surface-sunken)] p-3 rounded-lg border border-white/5">
                <strong className="text-xs text-[var(--green-2)] block mb-1">{String(st.title)}</strong>
                <p className="text-xs text-[var(--text-3)] line-clamp-3 m-0 leading-relaxed whitespace-pre-line">
                  {cleanText(String(st.text))}
                </p>
              </div>
            ))}
            {stories.length === 0 && (
              <p className="text-xs text-[var(--text-3)]">No in-game story logs recorded.</p>
            )}
          </div>
        </article>

        <article>
          <span className="banner-kicker">
            <CalendarDays size={13} /> Voice Archive
          </span>
          <h2>Voice Actors</h2>
          <div className="voice-list">
            {Object.entries(voices).map(([language, actor]) => (
              <span key={language}>
                <small>{language.replace(/^CV_/, "")}</small>
                <strong>{String(actor)}</strong>
              </span>
            ))}
            {Object.keys(voices).length === 0 && (
              <p className="text-xs text-[var(--text-3)] col-span-full">Voice actors index synchronized.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
