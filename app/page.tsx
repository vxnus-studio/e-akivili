import Link from "next/link";
import { Icon } from "./_components/navigation";
import { getAkiviliPersistentEntityQueries } from "@/lib/akivili/engine";

export default async function Home() {
  let characterCount = 95;
  let displayCharacters: Array<{
    name: string;
    slug: string;
    element: string | null;
    path: string | null;
    image: string | null;
  }> = [];

  try {
    const queries = await getAkiviliPersistentEntityQueries();
    const result = await queries.searchEntities({ kind: "characters", limit: 6 });
    characterCount = result.total || 95;

    const featuredSlugs = ["firefly", "acheron", "robin"];
    const fetched = await Promise.all(
      featuredSlugs.map((slug) => queries.getEntity("characters", slug))
    );
    displayCharacters = fetched.filter(Boolean) as typeof displayCharacters;

    if (displayCharacters.length < 3) {
      displayCharacters = result.items.slice(0, 3).map((item) => ({
        name: item.name,
        slug: item.slug,
        element: item.element,
        path: item.path ?? null,
        image: item.image,
      }));
    }
  } catch (error) {
    console.error("Failed to query database for homepage:", error);
    // Fallback data
    displayCharacters = [
      {
        name: "Firefly",
        slug: "firefly",
        element: "Fire",
        path: "Destruction",
        image: "https://cdn.vxnus.xyz/e-akivili/characters/1310.avif",
      },
      {
        name: "Acheron",
        slug: "acheron",
        element: "Lightning",
        path: "Nihility",
        image: "https://cdn.vxnus.xyz/e-akivili/characters/1308.avif",
      },
      {
        name: "Robin",
        slug: "robin",
        element: "Physical",
        path: "Harmony",
        image: "https://cdn.vxnus.xyz/e-akivili/characters/1309.avif",
      },
    ];
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <h1>Astral Command</h1>
          <p>The normalized Star Rail knowledge archive, build database, and neural intelligence engine.</p>
        </div>

        <div className="server-time">
          <Icon name="clock" size={15} />
          <span>Database live</span>
          <strong>{characterCount} Records</strong>
        </div>
      </section>

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
          <Link className="primary-action" href="/database/characters/">
            Browse characters <Icon name="chevron" size={15} />
          </Link>
        </div>

        <div className="database-portraits">
          {displayCharacters.map((character, index) => (
            <Link
              href={`/characters/${character.slug}/`}
              className={`database-character character-${index + 1} transition-all duration-300 hover:scale-[1.12]`}
              key={character.name}
            >
              <div className="w-full h-full flex items-center justify-center relative pb-10">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.75)]"
                  />
                ) : (
                  <span className="text-3xl font-black text-[var(--green-2)]/30">{character.name}</span>
                )}
              </div>
              <span>
                <strong>{character.name}</strong>
                <small>{[character.element, character.path].filter(Boolean).join(" · ")}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
