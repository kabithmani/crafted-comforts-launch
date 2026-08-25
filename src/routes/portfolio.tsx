import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Lightbox } from "@/components/site/Lightbox";
import { media, type Category, type MediaItem } from "@/data/manifest";

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

const PAGE_SIZE = 12;

type ProjectGroup = {
  key: string;
  project?: string;
  location?: string;
  desc?: string;
  category: Category;
  items: MediaItem[];
  collage: MediaItem[];
};

/** Pick up to `n` visually diverse items — spread evenly across the set. */
function spread(items: MediaItem[], n: number) {
  if (items.length <= n) return items;
  const step = items.length / n;
  return Array.from({ length: n }, (_, i) => items[Math.floor(i * step)]);
}

function buildGroups(base: MediaItem[]): ProjectGroup[] {
  const map = new Map<string, ProjectGroup>();
  for (const m of base) {
    const key = m.project ?? m.src;
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        project: m.project,
        location: m.location,
        desc: m.desc,
        category: m.category,
        items: [],
        collage: [],
      };
      map.set(key, g);
    }
    g.items.push(m);
  }
  const groups = [...map.values()];
  for (const g of groups) {
    const images = g.items.filter((i) => i.type === "image");
    const pool = images.length >= 3 ? images : g.items;
    g.collage = spread(pool, Math.min(4, pool.length));
  }
  return groups;
}

function Tile({ item, className, priority }: { item: MediaItem; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[color:var(--ivory)] ${className ?? ""}`}>
      {item.type === "video" ? (
        <>
          <video src={item.src} muted loop playsInline preload="metadata" className="w-full h-full object-cover zoom" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-10 h-10 rounded-full border border-[color:var(--brass-light)]/80 bg-[color:var(--ink)]/40 flex items-center justify-center text-[color:var(--brass-light)] text-sm">▶</span>
          </span>
        </>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover zoom"
        />
      )}
    </div>
  );
}

function Collage({ items, priority }: { items: MediaItem[]; priority?: boolean }) {
  const n = items.length;

  if (n >= 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-0 aspect-[4/3]">
        {items.slice(0, 4).map((it, i) => (
          <Tile key={it.src} item={it} priority={priority && i === 0} />
        ))}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-0 aspect-[4/3]">
        <Tile item={items[0]} className="col-span-2 row-span-2" priority={priority} />
        <Tile item={items[1]} />
        <Tile item={items[2]} />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-0 aspect-[4/3]">
        <Tile item={items[0]} priority={priority} />
        <Tile item={items[1]} />
      </div>
    );
  }
  return (
    <div className="aspect-[4/3]">
      <Tile item={items[0]} priority={priority} />
    </div>
  );
}

function PortfolioPage() {
  const [tab, setTab] = useState<Category>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<{ items: MediaItem[]; index: number } | null>(null);

  const groups = useMemo(() => {
    const base = media.filter((m) => !m.featured);
    let filtered = base;
    if (tab === "Films") filtered = base.filter((m) => m.type === "video");
    else if (tab !== "All") filtered = base.filter((m) => m.category === tab);
    return buildGroups(filtered);
  }, [tab]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [tab]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY > document.body.offsetHeight - 800) {
        setVisible((v) => Math.min(v + PAGE_SIZE, groups.length));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groups.length]);

  const shown = groups.slice(0, visible);

  return (
    <PageShell portfolioDisclaimer>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {shown.map((g, gi) => (
              <button
                key={g.key}
                onClick={() => setLightbox({ items: g.items, index: 0 })}
                className="group block text-left lift bg-[color:var(--ivory)] overflow-hidden w-full"
                aria-label={g.project ?? g.items[0].alt}
              >
                <Collage items={g.collage} priority={gi < 3} />
                <div className="p-4">
                  {g.location && <p className="overline text-[10px]">{g.location}</p>}
                  {g.project && <p className="font-display text-xl mt-1">{g.project}</p>}
                  {g.desc && <p className="mt-2 text-sm text-ink-soft/75">{g.desc}</p>}
                  <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[color:var(--brass)]">
                    {g.items.length} {g.items.length === 1 ? "frame" : "frames"}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {visible < groups.length && (
            <div className="mt-12 text-center text-ink-soft/60 text-sm tracking-[0.2em] uppercase">Scroll for more…</div>
          )}
        </div>
      </section>

      <Lightbox
        items={lightbox?.items ?? []}
        openIndex={lightbox ? lightbox.index : null}
        onClose={() => setLightbox(null)}
      />
    </PageShell>
  );
}
