import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Lightbox } from "@/components/site/Lightbox";
import { media, type Category, type MediaItem } from "@/data/manifest";
import { getPortfolioProjects } from "@/lib/portfolio.functions";
import type { DbProject } from "@/lib/portfolio-shared";
import { isDecoded, markDecoded, preloadBatch } from "@/lib/image-preload";
import { SITE } from "@/lib/site-config";

const TABS: { key: Category; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Residential", label: "Residential" },
  { key: "Hospitality", label: "Hospitality" },
  { key: "Commercial", label: "Commercial" },
  { key: "Films", label: "Films" },
];

const projectsQuery = queryOptions({
  queryKey: ["portfolio-projects"],
  queryFn: () => getPortfolioProjects(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/portfolio")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  head: ({ loaderData }) => {
    const dbProjects = (loaderData ?? []) as DbProject[];
    const fileGroups = buildGroups(media.filter((m) => !m.featured));
    const cards = [
      ...dbProjects.map((p) => ({
        name: p.title,
        location: p.location,
        desc: p.description,
        image: p.images[0]?.url,
      })),
      ...fileGroups.map((g) => ({
        name: g.project ?? "Crafted Comforts project",
        location: g.location ?? "",
        desc: g.desc ?? "",
        image: g.collage[0]?.src,
      })),
    ].slice(0, 40);

    const base = SITE.websiteUrl.replace(/\/$/, "");
    const abs = (u?: string) => (u ? (u.startsWith("http") ? u : `${base}${u}`) : undefined);

    return {
      meta: [
        { title: "Portfolio — 500+ Luxury Interior Projects | Crafted Comforts Bengaluru" },
        {
          name: "description",
          content:
            "Browse completed luxury interior design-and-build projects by Crafted Comforts — homes, hotels, restaurants and workplaces across Bengaluru, Goa, Mumbai, Kolkata, Mysore and Kochi.",
        },
        {
          name: "keywords",
          content:
            "luxury interior design portfolio Bengaluru, residential interiors, hospitality interiors, commercial interiors, turnkey interior contractors India",
        },
        { property: "og:title", content: "Portfolio — Crafted Comforts Luxury Interiors" },
        {
          property: "og:description",
          content:
            "Residential, hospitality and commercial sanctuaries built end-to-end by Crafted Comforts.",
        },
        { property: "og:url", content: "/portfolio" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: `${base}/media/brand/og-image.png` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Portfolio — Crafted Comforts Luxury Interiors" },
        { name: "twitter:image", content: `${base}/media/brand/og-image.png` },
      ],
      links: [{ rel: "canonical", href: "/portfolio" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Crafted Comforts — Portfolio",
            url: `${base}/portfolio`,
            description:
              "Completed luxury interior design-and-build projects by Crafted Comforts, Bengaluru.",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: cards.length,
              itemListElement: cards.map((c, n) => ({
                "@type": "ListItem",
                position: n + 1,
                item: {
                  "@type": "CreativeWork",
                  name: c.name,
                  ...(c.desc ? { description: c.desc } : {}),
                  ...(c.location ? { locationCreated: { "@type": "Place", name: c.location } } : {}),
                  ...(abs(c.image) ? { image: abs(c.image) } : {}),
                  creator: { "@type": "Organization", name: "Crafted Comforts" },
                },
              })),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
              { "@type": "ListItem", position: 2, name: "Portfolio", item: `${base}/portfolio` },
            ],
          }),
        },
      ],
    };
  },
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
  source: "admin" | "library";
};

/** Pick up to `n` visually diverse items — spread evenly across the set. */
function spread(items: MediaItem[], n: number) {
  if (items.length <= n) return items;
  const step = items.length / n;
  return Array.from({ length: n }, (_, i) => items[Math.floor(i * step)]);
}

function buildGroups(base: MediaItem[]): ProjectGroup[] {
  const map = new Map<string, ProjectGroup>();
  const loose: MediaItem[] = [];
  for (const m of base) {
    if (!m.project) { loose.push(m); continue; }
    let g = map.get(m.project);
    if (!g) {
      g = {
        key: m.project,
        project: m.project,
        location: m.location,
        desc: m.desc,
        category: m.category,
        items: [],
        collage: [],
        source: "library",
      };
      map.set(m.project, g);
    }
    g.items.push(m);
  }

  // Fold single-frame projects and unnamed media into 4-up "selected works" collages.
  const groups: ProjectGroup[] = [];
  const leftovers: MediaItem[] = [...loose];
  for (const g of map.values()) {
    if (g.items.length < 3) leftovers.push(...g.items);
    else groups.push(g);
  }
  for (let i = 0; i < leftovers.length; i += 4) {
    const chunk = leftovers.slice(i, i + 4);
    if (!chunk.length) break;
    groups.push({
      key: `selected-${chunk[0].src}`,
      project: "Selected Works",
      location: chunk[0].location,
      desc: "A set of details and finishes from completed Crafted Comforts projects.",
      category: chunk[0].category,
      items: chunk,
      collage: [],
      source: "library",
    });
  }

  for (const g of groups) {
    const images = g.items.filter((i) => i.type === "image");
    const pool = images.length >= 3 ? images : g.items;
    g.collage = spread(pool, Math.min(4, pool.length));
  }
  return groups;
}

/** Admin-managed projects mapped onto the same card shape. */
function dbGroups(projects: DbProject[]): ProjectGroup[] {
  return projects
    .filter((p) => p.images.length > 0)
    .map((p) => {
      const items: MediaItem[] = p.images.map((img) => ({
        src: img.url,
        type: "image" as const,
        alt: img.alt || `${p.title} — ${p.location}`,
        project: p.title,
        location: p.location,
        desc: p.description,
        category: (TABS.some((t) => t.key === p.category) ? p.category : "Residential") as Category,
        featured: false,
      }));
      return {
        key: `db-${p.id}`,
        project: p.title,
        location: p.location,
        desc: p.description,
        category: items[0].category,
        items,
        collage: items.slice(0, 4),
        source: "admin" as const,
      };
    });
}

function Tile({
  item, className, priority,
}: { item: MediaItem; className?: string; priority?: boolean }) {
  const [ready, setReady] = useState(() => item.type !== "image" || isDecoded(item.src));

  return (
    <div className={`relative overflow-hidden bg-[color:var(--ivory)] ${className ?? ""}`}>
      {/* brand-tinted placeholder — never a spinner */}
      {!ready && (
        <span
          aria-hidden
          className="absolute inset-0 bg-[color:var(--brass)]/10 collage-shimmer"
        />
      )}
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
          // @ts-expect-error fetchpriority is valid HTML, not yet in React typings
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => { markDecoded(item.src); setReady(true); }}
          onError={() => setReady(true)}
          className={`relative w-full h-full object-cover zoom transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
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
          <Tile key={it.src} item={it} priority={priority && i < 2} />
        ))}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-0 aspect-[4/3]">
        <Tile item={items[0]} className="col-span-2 row-span-2" priority={priority} />
        <Tile item={items[1]} priority={priority} />
        <Tile item={items[2]} />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-0 aspect-[4/3]">
        <Tile item={items[0]} priority={priority} />
        <Tile item={items[1]} priority={priority} />
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
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const [tab, setTab] = useState<Category>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<{ items: MediaItem[]; index: number } | null>(null);

  const groups = useMemo(() => {
    const admin = dbGroups(projects);
    const base = media.filter((m) => !m.featured);
    let filtered = base;
    let adminFiltered = admin;
    if (tab === "Films") {
      filtered = base.filter((m) => m.type === "video");
      adminFiltered = admin.filter((g) => g.category === "Films");
    } else if (tab !== "All") {
      filtered = base.filter((m) => m.category === tab);
      adminFiltered = admin.filter((g) => g.category === tab);
    }
    return [...adminFiltered, ...buildGroups(filtered)];
  }, [tab, projects]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [tab]);

  // Preload the visible collages at high priority, then warm the next two pages
  // so cards further down the list are already decoded when they scroll in.
  useEffect(() => {
    const collageSrc = (g: ProjectGroup) =>
      g.collage.filter((i) => i.type === "image").map((i) => i.src);
    const current = groups.slice(0, visible).flatMap(collageSrc);
    const upcoming = groups.slice(visible, visible + PAGE_SIZE * 2).flatMap(collageSrc);
    preloadBatch(current, "high");
    preloadBatch(upcoming, "low");
  }, [groups, visible]);

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
          <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[1.04]">Five hundred sanctuaries.</h1>
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
              <article
                key={g.key}
                itemScope
                itemType="https://schema.org/CreativeWork"
                className="bg-[color:var(--ivory)] overflow-hidden"
              >
                <meta itemProp="name" content={g.project ?? "Crafted Comforts project"} />
                {g.desc && <meta itemProp="description" content={g.desc} />}
                {g.collage[0] && <meta itemProp="image" content={g.collage[0].src} />}
                <button
                  onClick={() => setLightbox({ items: g.items, index: 0 })}
                  className="group block text-left lift w-full"
                  aria-label={`Open gallery — ${g.project ?? g.items[0].alt}`}
                >
                  <Collage items={g.collage} priority={gi < 3} />
                  <div className="p-4">
                    {g.location && (
                      <p className="overline text-[10px]" itemProp="locationCreated">{g.location}</p>
                    )}
                    {g.project && <h2 className="font-display text-xl mt-1">{g.project}</h2>}
                    {g.desc && <p className="mt-2 text-sm text-ink-soft/75">{g.desc}</p>}
                    <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[color:var(--brass)]">
                      {g.items.length} {g.items.length === 1 ? "frame" : "frames"}
                    </p>
                  </div>
                </button>
              </article>
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
