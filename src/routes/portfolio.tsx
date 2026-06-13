import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { media, type Category } from "@/data/manifest";

const TABS: { key: Category; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Residential", label: "Residential" },
  { key: "Hospitality", label: "Hospitality" },
  { key: "Commercial", label: "Commercial" },
  { key: "Films", label: "Films" },
];

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Crafted Comforts Luxury Interiors | Bengaluru" },
      { name: "description", content: "Residential, hospitality and commercial interiors by Crafted Comforts — across Bengaluru, Goa, Mumbai, Kolkata, Mysore and Kochi." },
      { property: "og:title", content: "Portfolio — Crafted Comforts" },
      { property: "og:description", content: "Fifty-plus sanctuaries: residential, hospitality and commercial." },
      { property: "og:url", content: "/portfolio" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/media/brand/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: "Crafted Comforts — Portfolio",
        }),
      },
    ],
  }),
  component: PortfolioPage,
});

const PAGE_SIZE = 24;

function PortfolioPage() {
  const [tab, setTab] = useState<Category>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const items = useMemo(() => {
    // Exclude featured items from grids (no duplicate rule)
    const base = media.filter((m) => !m.featured);
    if (tab === "All") return base;
    if (tab === "Films") return base.filter((m) => m.type === "video");
    return base.filter((m) => m.category === tab);
  }, [tab]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [tab]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY > document.body.offsetHeight - 800) {
        setVisible((v) => Math.min(v + PAGE_SIZE, items.length));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const shown = items.slice(0, visible);

  return (
    <PageShell>
      <section className="bg-[color:var(--paper)] pt-28 md:pt-36 pb-10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <p className="overline">Portfolio</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[1.04]">Fifty-plus sanctuaries.</h1>
          <p className="mt-5 text-ink-soft/85 max-w-2xl">
            A complete library of homes, hotels and workplaces built by Crafted Comforts.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-2 gap-y-3 border-b border-[color:var(--brass)]/35 pb-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 text-[12px] tracking-[0.22em] uppercase transition-colors duration-200 ${
                  tab === t.key ? "text-[color:var(--brass-deep)] border-b border-[color:var(--brass)]" : "text-ink-soft/70 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--paper)] pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {shown.map((m, i) => (
              <button
                key={m.src}
                onClick={() => setLightboxIdx(i)}
                className="group block text-left lift bg-[color:var(--ivory)] overflow-hidden"
                aria-label={m.alt}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {m.type === "video" ? (
                    <>
                      <video src={m.src} muted loop playsInline preload="none" className="w-full h-full object-cover zoom" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full border border-[color:var(--brass-light)]/80 bg-[color:var(--ink)]/40 flex items-center justify-center text-[color:var(--brass-light)]">▶</span>
                      </span>
                    </>
                  ) : (
                    <img src={m.src} alt={m.alt} loading="lazy" className="w-full h-full object-cover zoom" />
                  )}
                </div>
                {m.project && (
                  <div className="p-4">
                    <p className="overline text-[10px]">{m.location}</p>
                    <p className="font-display text-lg mt-1">{m.project}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
          {visible < items.length && (
            <div className="mt-12 text-center text-ink-soft/60 text-sm tracking-[0.2em] uppercase">Loading more…</div>
          )}
        </div>
      </section>

      <Lightbox items={shown} openIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
    </PageShell>
  );
}

// Use Reveal indirectly (keep tree-shake-friendly import to prove dep is wired)
export const _r = Reveal;