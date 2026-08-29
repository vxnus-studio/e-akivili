import { DatabaseShell } from "../_components/database-shell";
import { KnowledgeConsole } from "../_components/knowledge-console";

export default function KnowledgePage() {
  return (
    <DatabaseShell
      eyebrow="AI retrieval lab"
      title="Facts connected by Astral evidence"
      description="The assistant traverses explicit entity relations for exact gameplay questions and reserves semantic search for fuzzy descriptions and lore across factions."
    >
      <section className="knowledge-principles" aria-label="Retrieval design">
        <article>
          <span>01</span>
          <strong>Resolve</strong>
          <p>Character names and titles resolve to one canonical Astral entity.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Traverse</strong>
          <p>Typed relations connect paths, traces, light cones, and calyx drops.</p>
        </article>
        <article>
          <span>03</span>
          <strong >Answer</strong>
          <p>Compact evidence and an Astral knowledge revision accompany every response.</p>
        </article>
      </section>
      <KnowledgeConsole />
    </DatabaseShell>
  );
}
