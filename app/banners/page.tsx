import Link from "next/link";
import { ArrowRight, CalendarRange, Sparkles, Orbit, Activity, Clock3 } from "lucide-react";

export const metadata = {
  title: "Warp Observatory | E-Akivili",
  description: "Live Honkai: Star Rail warp rotation, Brilliant Fixation transmissions, and rerun intelligence.",
};

export default async function WarpsPage() {
  return (
    <div className="banner-observatory">
      <section className="banner-hero">
        <div className="banner-hero-copy">
          <span className="banner-kicker">
            <Orbit size={13} /> Warp intelligence / live archive
          </span>
          <h1>
            Warp
            <br />
            <em>Observatory</em>
          </h1>
          <p>
            Track the current warp signal, inspect character and Brilliant Fixation light cone rotations, and read the statistical pressure building across the Astral Express timeline.
          </p>
          <div className="banner-hero-actions">
            <Link href="/banners/rotation/">
              Explore timeline <ArrowRight size={14} />
            </Link>
            <Link href="/banners/rerun-pressure/">View pressure index</Link>
          </div>
        </div>
        <div className="banner-orbit-visual" aria-hidden="true">
          <span className="orbit-ring ring-one" />
          <span className="orbit-ring ring-two" />
          <span className="orbit-core">
            <Sparkles size={28} />
          </span>
          <span className="orbit-label orbit-label-one">PHASE 3.0.1</span>
          <span className="orbit-label orbit-label-two">68 SIGNALS</span>
          <span className="orbit-label orbit-label-three">SYNCED</span>
        </div>
        <div className="banner-telemetry">
          <span>
            <i /> Archive online
          </span>
          <strong>V3.0 · P1</strong>
        </div>
      </section>

      <section className="banner-metric-grid" aria-label="Banner metrics">
        <article>
          <CalendarRange size={18} />
          <div>
            <span>Current sequence</span>
            <strong>38</strong>
          </div>
          <small>Global warp index</small>
        </article>
        <article>
          <Activity size={18} />
          <div>
            <span>Tracked signals</span>
            <strong>68</strong>
          </div>
          <small>Pressure-ready units</small>
        </article>
        <article>
          <Clock3 size={18} />
          <div>
            <span>Longest wait</span>
            <strong>16</strong>
          </div>
          <small>Completed phases</small>
        </article>
      </section>

      <section className="current-wish-panel">
        <header className="banner-section-heading">
          <div>
            <span>01 / Character Warp Signal</span>
            <h2>Character Event Warps</h2>
          </div>
          <p>Active · Version 3.0 / Phase 1</p>
        </header>

        <div className="featured-wish-grid">
          <div className="five-star-stage">
            <div className="stage-grid" />
            <span className="rarity-mark">✦ 5-star featured warp</span>
            <div className="featured-portraits">
              <div className="featured-portrait">
                <div className="banner-character-fallback">✦</div>
                <span>
                  <small>Character Event Warp</small>
                  <strong>The Herta</strong>
                </span>
              </div>
              <div className="featured-portrait">
                <div className="banner-character-fallback">✦</div>
                <span>
                  <small>Character Event Warp</small>
                  <strong>Aglaea</strong>
                </span>
              </div>
            </div>
          </div>
          <aside className="four-star-roster">
            <span className="roster-label">Support frequency</span>
            <h3>Featured 4-stars</h3>
            <p>Rate-up characters in this warp cycle.</p>
            <div>
              <a href="#">
                <span>01</span>
                <strong>Moze</strong>
                <ArrowRight size={13} />
              </a>
              <a href="#">
                <span>02</span>
                <strong>Gallagher</strong>
                <ArrowRight size={13} />
              </a>
              <a href="#">
                <span>03</span>
                <strong>Yukong</strong>
                <ArrowRight size={13} />
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
