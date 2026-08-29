import { DatabaseShell } from "../../_components/database-shell";

export default function BannerRotationPage() {
  return (
    <DatabaseShell
      eyebrow="Timeline Archive"
      title="Warp Rotation Timeline"
      description="Chronological archive of all Character Event Warps and Brilliant Fixations from Version 1.0 to current."
    >
      <div className="p-8 text-xs text-[var(--text-3)] bg-[var(--surface)] border border-[var(--line)] rounded-xl">
        Warp rotation archive records loaded.
      </div>
    </DatabaseShell>
  );
}
