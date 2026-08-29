"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers, Sparkles } from "lucide-react";

export interface MaterialItem {
  id: string;
  slug: string;
  name: string;
  kind: string;
  image?: string | null;
  count: number;
}

export interface AscensionPhase {
  phase: number;
  levelRange: string;
  credits: number;
  materials: MaterialItem[];
}

interface ProgressionCalculatorProps {
  ascensionPhases: AscensionPhase[];
  totalAscensionMaterials: MaterialItem[];
  titlePrefix?: string;
}

export function ProgressionCalculator({
  ascensionPhases,
  totalAscensionMaterials,
  titlePrefix = "Character",
}: ProgressionCalculatorProps) {
  const [selectedAscPhase, setSelectedAscPhase] = useState<number | "all">("all");

  const displayedAscMaterials =
    selectedAscPhase === "all"
      ? totalAscensionMaterials
      : ascensionPhases.find((p) => p.phase === selectedAscPhase)?.materials ?? [];

  return (
    <div className="bg-[var(--surface-sunken)] border border-white/10 rounded-2xl p-5 md:p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-lg text-sm font-bold bg-[var(--green)] text-[#1c1304] shadow-[0_0_15px_rgba(245,166,35,0.3)] font-extrabold flex items-center gap-2">
            <Layers size={15} /> {titlePrefix} Ascension (Lvl 1 → 80)
          </span>
        </div>

        <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
          <Sparkles size={13} className="text-[var(--accent)]" /> Exact Farming Target
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mr-1">
            Select Phase:
          </span>
          <button
            onClick={() => setSelectedAscPhase("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedAscPhase === "all"
                ? "bg-[var(--green)] text-[#1c1304] font-bold shadow-[0_0_12px_rgba(245,166,35,0.25)]"
                : "bg-[var(--surface-raised)] text-[var(--text-2)] hover:text-white hover:border-white/20 border border-white/5"
            }`}
          >
            Total (Lvl 1 → 80)
          </button>
          {ascensionPhases.map((phase) => (
            <button
              key={phase.phase}
              onClick={() => setSelectedAscPhase(phase.phase)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedAscPhase === phase.phase
                  ? "bg-[var(--green)] text-[#1c1304] font-bold shadow-[0_0_12px_rgba(245,166,35,0.25)]"
                : "bg-[var(--surface-raised)] text-[var(--text-2)] hover:text-white hover:border-white/20 border border-white/5"
              }`}
            >
              Phase {phase.phase} ({phase.levelRange})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {displayedAscMaterials.map((mat) => (
            <Link
              href={`/database/materials/${mat.slug}`}
              key={mat.id}
              className="flex items-center justify-between gap-3 bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-white/5 hover:border-[var(--accent)] rounded-xl p-3.5 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-black/40 relative overflow-hidden flex items-center justify-center p-1 border border-white/5 shrink-0">
                  {mat.image ? (
                    <Image
                      src={mat.image}
                      alt={mat.name}
                      width={40}
                      height={40}
                      className="object-contain drop-shadow"
                    />
                  ) : (
                    <span className="font-bold text-xs text-[var(--accent)]">
                      {mat.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="truncate">
                  <strong className="text-sm block text-[var(--text-light)] group-hover:text-[var(--accent)] truncate">
                    {mat.name}
                  </strong>
                  <small className="text-xs text-[var(--text-muted)] capitalize">
                    {mat.kind}
                  </small>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-xs text-[var(--text-muted)] block">Required</span>
                <strong className="text-base font-extrabold text-[var(--accent)] font-mono">
                  ×{mat.count}
                </strong>
              </div>
            </Link>
          ))}

          {displayedAscMaterials.length === 0 && (
            <div className="col-span-full p-8 text-center text-xs text-[var(--text-muted)]">
              No ascension material breakdown recorded for this phase.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
