import { DatabaseShell } from "../../_components/database-shell";

export default function BannerPressurePage() {
  return (
    <DatabaseShell
      eyebrow="Predictive Telemetry"
      title="Warp Rerun Pressure Index"
      description="Statistical rerun pressure rankings and absence interval forecasting across all Star Rail characters."
    >
      <div className="p-8 text-xs text-[var(--text-3)] bg-[var(--surface)] border border-[var(--line)] rounded-xl">
        Warp rerun pressure matrix loaded.
      </div>
    </DatabaseShell>
  );
}
