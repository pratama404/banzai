import Link from "next/link";
import Iconify from "@/components/Iconify";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentAuthUser } from "@/lib/admin-auth";
import { loadCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ categories }, session] = await Promise.all([
    loadCatalog(),
    getCurrentAuthUser(),
  ]);

  return (
    <div className="landing-page">
      {/* ══════ TOP BAR ══════ */}
      <header className="topbar topbar--transparent">
        <Link className="brand" href="/" aria-label="PWO Vademecum, beranda">
          <img className="brand-logo" src="/assets/logo/logo-pwo.png" alt="Logo PWO 2026" />
          <span className="brand-copy">
            <strong>PRINCIPAL WARFARE OFFICER</strong>
            <small>E-REFERENCES · CLASS OF 2026</small>
          </span>
        </Link>
        <nav className="topbar-nav">
          <Link href="/" className="topbar-link is-active">
            BERANDA
          </Link>
          <Link href="/materi" className="topbar-link">
            MATERI
          </Link>
          {session.authenticated ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="topbar-link">
              LOGIN
            </Link>
          )}
        </nav>
      </header>

      {/* ══════ HERO — FULL VIEWPORT WITH INTEGRATED SLOGANS ══════ */}
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__bg">
          <img src="/assets/home-cover.png" alt="" loading="eager" />
        </div>
        <div className="landing-hero__overlay"></div>

        <div className="landing-hero__content">
          <p className="landing-hero__kicker"></p>
          <h1 id="landing-title" className="landing-hero__title">
            E-REFERENCES
            <br />
            <em>PRINCIPAL WARFARE OFFICER</em>
          </h1>
          <p className="landing-hero__desc"></p>
          <a className="landing-hero__cta" href="#materi">
            <span>EXPLORE THE REFERENCES</span>
            <span className="cta-arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        {/* Three slogans — bottom strip */}
        <div className="hero-slogans" aria-label="Tiga pilar semangat PWO">
          <div className="hero-slogan">
            <span className="hero-slogan__kanji">気迫</span>
            <div className="hero-slogan__body">
              <span className="hero-slogan__romaji">KIHAKU</span>
              <span className="hero-slogan__meaning">Fighting Spirit</span>
            </div>
          </div>
          <span className="hero-slogans__sep" aria-hidden="true"></span>
          <div className="hero-slogan">
            <span className="hero-slogan__kanji hero-slogan__kanji--red">精撃</span>
            <div className="hero-slogan__body">
              <span className="hero-slogan__romaji">SEIGEKI</span>
              <span className="hero-slogan__meaning">Precision Strike</span>
            </div>
          </div>
          <span className="hero-slogans__sep" aria-hidden="true"></span>
          <div className="hero-slogan">
            <span className="hero-slogan__kanji">必勝</span>
            <div className="hero-slogan__body">
              <span className="hero-slogan__romaji">HISSHOU</span>
              <span className="hero-slogan__meaning">Certain Victory</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ ABOUT PWO ══════ */}
      <section className="about-section" id="about" aria-labelledby="about-heading">
        <div className="about-section__inner">
          <div className="about-section__text">
            <p className="section-eyebrow">ABOUT PWO</p>
            <h2 id="about-heading" className="section-title">
              Principal Warfare Officer
            </h2>
            <p>
              The PWO (Principal Warfare Officer) program is an elite advanced course for Indonesian
              Navy officers, designed to master tactical command and modern naval warfare strategy.
              The curriculum spans General Warfare, Anti Air Warfare (AAW), Anti Surface Warfare
              (ASuW), Anti Submarine Warfare (ASW), Electronic Warfare (EW), Mine Warfare (MW), and
              international doctrine references from the UK IPWO &amp; Dutch CCO.
            </p>
            <p>
              PWO graduates are trained to command combat operations aboard warships, make
              split-second tactical decisions under extreme pressure, and orchestrate every element
              of a naval task force into a unified and decisive fighting machine.
            </p>
          </div>
          <div className="about-section__image">
            <img src="/assets/banzai-cover.jpg" alt="PWO 2026 Cover Art" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ══════ MATERI PREVIEW (DYNAMIC FROM CATALOG) ══════ */}
      <section className="materi-preview" id="materi" aria-labelledby="materi-heading">
        <div className="materi-preview__inner">
          <p className="section-eyebrow">E-REFERENCES</p>
          <h2 id="materi-heading" className="section-title">
            Explore PWO <em>Materials</em>
          </h2>
          <p className="section-subtitle">
            A complete collection of curricula, tactical modules, and naval warfare doctrine
            references — all in one platform.
          </p>

          <div className="materi-grid">
            {categories.map((cat, idx) => {
              const isWide = cat.id === "ref" || (idx === categories.length - 1 && categories.length % 2 === 1);
              return (
                <Link
                  key={cat.id}
                  href={`/materi?cat=${encodeURIComponent(cat.id)}`}
                  className={`materi-card${isWide ? " materi-card--wide" : ""}`}
                >
                  <span className="materi-card__icon" aria-hidden="true">
                    <Iconify icon={cat.icon} />
                  </span>
                  <h3 className="materi-card__title">
                    {cat.code ? `${cat.code}. ` : `${idx + 1}. `}
                    {cat.name}
                  </h3>
                  <p className="materi-card__code">{cat.short}</p>
                  <p className="materi-card__desc">{cat.desc}</p>
                  {cat.id === "ref" && cat.subcategories && cat.subcategories.length > 0 ? (
                    <div className="materi-card-chips">
                      {cat.subcategories.map((sub) => (
                        <span key={sub.id} className="materi-chip">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="materi-card__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="materi-preview__cta">
            <Link className="btn-primary" href="/materi">
              EXPLORE ALL MATERIALS <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="footer">
        <span>E-REFERENCES · PWO CLASS OF 2026</span>
        <span>気迫 · 精撃 · 必勝</span>
      </footer>
    </div>
  );
}
