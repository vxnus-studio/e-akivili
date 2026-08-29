import { DatabaseShell } from "../_components/database-shell";
import { EntityExplorer } from "../_components/entity-explorer";

export default function ExplorePage() {
  return (
    <DatabaseShell
      eyebrow="Universal search"
      title="Explore the Astral knowledge graph"
      description="Search the normalized records that power E-Akivili's pages, retrieval tools, and AI answers across the Star Rail universe."
    >
      <EntityExplorer />
    </DatabaseShell>
  );
}
