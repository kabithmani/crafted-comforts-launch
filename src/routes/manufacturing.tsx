import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Merkaba } from "@/components/site/Merkaba";
import { media } from "@/data/manifest";
import { waPrefill, telHref, SITE } from "@/lib/site-config";
import { trackBookCTA, trackCall, trackWhatsApp } from "@/lib/analytics";

const TILES = [
  { t: "Carpentry & joinery", b: "Solid wood and panel work cut, finished and assembled in-house." },
  { t: "Modular manufacturing", b: "Kitchens and wardrobes machined to the millimetre." },
  { t: "The soft-furnishing atelier", b: "Drapery, upholstery and linen made for each specific room." },
];

export const Route = createFileRoute("/manufacturing")({
  head: () => ({
    meta: [
      { title: "See It Being Made — Crafted Comforts Factories | Bengaluru, Pune, Goa" },
      { name: "description", content: "Nine factories. Our own craftsmen. Carpentry, modular and the soft-furnishing atelier — all in-house. See your home being made." },
      { property: "og:title", content: "See It Being Made — Crafted Comforts Factories" },
      { property: "og:description", content: "Nine in-house factories. 15–20% more of your budget into materials and finishing." },
      { property: "og:url", content: "/manufacturing" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/manufacturing" }],
  }),
  component: Manufacturing,
});

function Manufacturing() {
  const videos = media.filter((m) => m.type === "video");
  const bgVideo = videos[0]?.src;
  const accent = videos.slice(1, 4);

  return (
    <PageShell transparentHeader>
      <section className="relative h-[88vh] min-h-[540px] bg-[color:var(--ink)] text-ivory overflow-hidden">
        {bgVideo && (
          <video
            src={bgVideo}
            autoPlay muted loop playsInline preload="none"
            className="absolute inset-0 w-full h-full object-cover opacity-65"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-[color:var(--ink)]/55 to-[color:var(--ink)]/30" />
        <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 h-full flex items-end pb-16 md:pb-24 hero-rise">
          <div>
            <p className="overline text-[color:var(--brass-light)]">Manufacturing</p>
            <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[1.02] max-w-3xl">See it being made.</h1>
            <p className="mt-5 max-w-xl text-ivory/85">Nine factories. Our own craftsmen. No middlemen.</p>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-24 md:py-36">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="text-[16px] md:text-[17px] leading-[1.85] text-ink-soft">
              Nine factories — five in Bengaluru, two in Pune, two in Goa — and our own craftsmen mean we control quality and cost from raw material to final fit. Carpentry, modular units, upholstery and soft furnishing all happen under our roofs. Because there is no middleman markup, <strong className="text-ink">15–20% more of your budget</strong> goes into materials and finishing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--ivory)] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid md:grid-cols-3 gap-x-8 gap-y-12">
          {TILES.map((t, i) => (
            <Reveal key={t.t} delay={i * 100}>
              <div className="border-t border-[color:var(--brass)]/45 pt-6">
                <div className="text-[color:var(--brass)]"><Merkaba size={22} /></div>
                <h3 className="font-display text-2xl md:text-3xl mt-4">{t.t}</h3>
                <p className="mt-3 text-ink-soft/85">{t.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {accent.length > 0 && (
        <section className="bg-[color:var(--ink)] py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid md:grid-cols-3 gap-4">
            {accent.map((v, i) => (
              <Reveal key={v.src} delay={i * 80}>
                <div className="aspect-[3/4] overflow-hidden bg-black">
                  <video src={v.src} autoPlay muted loop playsInline preload="none" className="w-full h-full object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[color:var(--paper)] py-24 md:py-32">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 text-center">
          <Reveal>
            <p className="overline">Visit the factory.</p>
            <h2 className="font-display text-4xl md:text-5xl mt-4 italic">See your home being made before it arrives.</h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href={waPrefill("Hi Crafted Comforts — I'd like to visit the factory.")}
                target="_blank" rel="noopener"
                onClick={trackWhatsApp}
                className="btn-brass"
              >Book a Factory Visit</a>
              <a href={telHref} onClick={trackCall} className="btn-outline-ink">Call {SITE.phoneDisplay}</a>
              <Link to="/" hash="lead-form" onClick={() => trackBookCTA("manufacturing_footer")} className="btn-outline-ink">Or send your details</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}























