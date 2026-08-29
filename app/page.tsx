import Link from "next/link";
import { Icon } from "./_components/navigation";
import { HomeRotation } from "./_components/home-rotation";

const characterPreview = [
  { name: "Acheron", path: "Nihility", element: "Lightning" },
  { name: "Firefly", path: "Destruction", element: "Fire" },
  { name: "Robin", path: "Harmony", element: "Physical" },
];

export default async function Home() {
  const characterCount = 68;

  return (
    <>
      <HomeRotation />

      <section className="banner-grid" id="banners" aria-label="Current warps">
        <Link className="banner-image-card" href="/knowledge/">
          <div className="banner-placeholder character-placeholder">
            <span className="placeholder-icon"><Icon name="users" size={24} /></span>
            <span className="placeholder-copy">
              <strong>Ask across Star Rail data</strong>
              <small>Exact facts with Astral graph evidence</small>
            </span>
          </div>
          <div className="banner-caption">
            <div><span>AI retrieval</span><strong>Trace paths, traces, and factions</strong></div>
            <Icon name="chevron" size={16} />
          </div>
        </Link>

        <Link className="banner-image-card" href="/explore/">
          <div className="banner-placeholder weapon-placeholder">
            <span className="placeholder-icon"><Icon name="sword" size={24} /></span>
            <span className="placeholder-copy">
              <strong>Search every entity</strong>
              <small>Characters, light cones, relics, calyxes</small>
            </span>
          </div>
          <div className="banner-caption">
            <div><span>Knowledge explorer</span><strong>Browse the normalized archive</strong></div>
            <Icon name="chevron" size={16} />
          </div>
        </Link>
      </section>

      <section className="character-database" id="characters" aria-labelledby="characters-title">
        <div className="database-copy">
          <span className="section-eyebrow">Character Database</span>
          <h2 id="characters-title">Find builds for every Astral passenger</h2>
          <p>Traces, ascension costs, light cones, relics, planar ornaments, and team synergies.</p>
          <div className="database-filters">
            <span>{characterCount} characters</span>
            <span>7 Elements</span>
            <span>7 Paths</span>
          </div>
          <Link className="primary-action" href="/database/characters/">Browse characters <Icon name="chevron" size={15} /></Link>
        </div>
        <div className="database-portraits">
          {characterPreview.map((character, index) => (
            <div className={`database-character character-${index + 1}`} key={character.name}>
              <div className="w-full h-full flex items-center justify-center bg-[var(--surface-raised)]/40 rounded-xl">
                <span className="text-3xl font-black text-[var(--green-2)]/30">{character.name}</span>
              </div>
              <span><strong>{character.name}</strong><small>{character.element} · {character.path}</small></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
