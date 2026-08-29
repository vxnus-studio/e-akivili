import { DatabaseShell } from "../_components/database-shell";
import { Icon } from "../_components/navigation";

export const metadata = {
  title: "Lore Engine | E-Akivili",
  description: "Explore Honkai: Star Rail book collections, readable curio chronicles, relic flavor texts, and Aeon myths.",
};

export default function LoreEnginePage() {
  return (
    <DatabaseShell
      eyebrow="Cosmic Narrative Archive"
      title="Lore Engine"
      description="Deterministic retrieval over thousands of readable books, relic chronicles, light cone lore, and faction archives across the cosmos."
    >
      <div className="p-12 text-center flex flex-col items-center justify-center gap-4 bg-[var(--surface)] border border-[var(--line)] rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--green-2)]">
          <Icon name="sparkles" size={24} />
        </div>
        <div className="max-w-md">
          <h2 className="text-lg font-bold text-[var(--text)]">Astral Lore Repository</h2>
          <p className="text-xs text-[var(--text-3)] mt-1">
            Browse chronicles from the Astral Express, Xianzhou Alliance, IPC, Penacony, and Jarilo-VI.
          </p>
        </div>
      </div>
    </DatabaseShell>
  );
}
