import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Merkaba } from "@/components/site/Merkaba";
import { Reveal, CountUp } from "@/components/site/Reveal";
import { LeadForm, ContactCallout } from "@/components/site/LeadForm";
import { SITE, telHref, waPrefill } from "@/lib/site-config";
import { trackBookCTA, trackWhatsApp } from "@/lib/analytics";
import { media } from "@/data/manifest";

const HERO_IMAGE = "/media/hero/modern-luxury-apartment-with-elegant-interior-design-comfortable-lighting-generated-by-artificial-intelligence.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crafted Comforts — Luxury Interiors, Designed & Built In-House | Bengaluru" },
      { name: "description", content: "Crafted Comforts designs, manufactures, renovates and styles luxury interiors in Bengaluru — end-to-end, in-house, with factory-direct value. Complete interiors from ₹15 lakhs." },
      { property: "og:title", content: "Crafted Comforts — Spaces to Sanctuaries" },
      { property: "og:description", content: "Luxury interior design-and-build in Bengaluru — end-to-end in-house, from sketch to soft furnishing." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/media/brand/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchpriority: "high" } as any,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

const FLAGSHIP = ["Uniqlo", "Godrej Script", "JSW Paints", "Zimson", "Neeru's", "Rareism"];

const PILLARS = [
  { t: "End-to-end, in-house.", b: "Design, manufacture, renovate, execute and style under one roof. No handoffs, no middleman markups — one accountable team from the first sketch to the final cushion." },
  { t: "Factory-direct value.", b: "Nine factories across Bengaluru, Pune and Goa mean 15–20% more of your budget goes into materials and finishing — not into margins. You feel the difference in every surface." },
  { t: "Soft furnishing is our signature.", b: "The layer most firms outsource, we manufacture ourselves — drapery, upholstery and textiles tuned to each room's light, scale and mood." },
  { t: "Fifteen years, fifty-plus spaces.", b: "Three founders with 25–30 years' experience each, across residential, hospitality and commercial work in six cities." },
];

const SERVICES = [
  { t: "Residential interiors", b: "Apartments, villas, bungalows — full-home design and build." },
  { t: "Commercial & hospitality", b: "Offices, retail, restaurants, hotels, spas, resorts." },
  { t: "Renovation & refurbishment", b: "Full or partial, managed end-to-end." },
  { t: "Modular solutions", b: "Kitchens and wardrobes, factory-built to the millimetre." },
  { t: "Soft furnishing & styling", b: "Our in-house atelier — the finishing layer." },
];

const PROCESS = [
  { n: 1, t: "Consultation", b: "Free and no-obligation; we understand your vision, space and budget." },
  { n: 2, t: "Design proposal", b: "Tailored concepts, materials and a clear scope." },
  { n: 3, t: "In-house manufacturing", b: "Built in our own nine factories." },
  { n: 4, t: "Execution & supervision", b: "One team manages the full build to handover." },
  { n: 5, t: "Styling & handover", b: "Soft furnishing and finishing; we hand over a finished home." },
];

const TESTIMONIALS = [
  { q: "When I saw my home become what I had always dreamed it to be, I realised what exceptional design and attention to detail can do. Thanks to Crafted Comforts who made it real for my family.", a: "Astha Rai, Homeowner" },
  { q: "Crafted Comforts truly understood and executed what we wanted. Attentive, and they exceeded expectations renovating our office space.", a: "Ajay Setu, CEO, Retail" },
  { q: "Working with Crafted Comforts for my retail space was a pleasure. Their professionalism and creativity made the whole process seamless.", a: "Balachandra Swamy, Business Owner" },
];

const FAQS = [
  { q: "What do projects start at?", a: "Complete interiors start at ₹15 lakhs — covering both hard and soft furnishing, manufactured in-house." },
  { q: "Which cities do you work in?", a: "Bengaluru is home; we have delivered across Goa, Mumbai, Kolkata, Mysore and Kochi." },
  { q: "Can I visit the factory?", a: "Yes — and we encourage it. Seeing your home being made is the best reassurance we can offer." },
  { q: "What makes you different from other interior firms?", a: "We don't outsource. Design, manufacturing, execution and styling are all in-house, so 15–20% more of your budget reaches materials and finishing." },
  { q: "How does the process work?", a: "A free consultation, a tailored design proposal, manufacturing in our own factories, supervised execution, and a styled handover." },
  { q: "Do you do renovations?", a: "Yes — full or partial, residential and commercial, managed end-to-end." },
];

function Index() {
  const featured = media.filter((m) => m.featured).slice(0, 6);
  const softFurnishingImg = media.find((m) => m.project === "Kailsha Residence" && m.type === "image")?.src
    ?? "/media/hero/luxurious-modern-kitchen-contemporary-interior-decor-furnishings-black-white-interior-design.jpg";

  return (
    <PageShell transparentHeader>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-[color:var(--ink)]">
        <img
          src={HERO_IMAGE}
          alt="A serene, sunlit Crafted Comforts living interior in Bengaluru"
          width={1920} height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover hero-settle"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-[color:var(--ink)]/55 to-[color:var(--ink)]/10" />
        <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 pb-24 md:pb-32 text-ivory w-full hero-rise">
          <p className="overline text-[color:var(--brass-light)]">Bengaluru · Luxury Interiors, Made In-House</p>
          <h1 className="font-display mt-5 text-[44px] leading-[1.04] md:text-[88px] md:leading-[0.98] max-w-4xl">
            We turn spaces into sanctuaries.
          </h1>
          <p className="mt-6 max-w-2xl text-ivory/85 text-[15px] md:text-[17px] leading-relaxed">
            Designed, manufactured, renovated and styled end-to-end by our own studios and factories — so every detail, down to the soft furnishing, is ours to perfect.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 items-center">
            <Link to="/" hash="lead-form" onClick={() => trackBookCTA("hero")} className="btn-brass">Book a Consultation</Link>
            <a href={waPrefill()} target="_blank" rel="noopener" onClick={trackWhatsApp} className="btn-outline-ivory">Chat on WhatsApp</a>
            <span className="text-sm text-ivory/70">or call <a href={telHref} className="story-underline text-[color:var(--brass-light)]">{SITE.phoneDisplay}</a></span>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-ivory/70 text-[11px] tracking-[0.3em] uppercase flex flex-col items-center gap-2 float-cue">
          <span className="block w-px h-10 bg-[color:var(--brass-light)]/60" />
          scroll
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[color:var(--ink)] text-ivory py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
          {[
            { v: 15, s: "+", label: "Years of craft" },
            { v: 9, s: "", label: "In-house factories" },
            { v: 500, s: "+", label: "Projects delivered" },
            { v: 6, s: "", label: "Cities" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="">
              <div className="font-display text-6xl md:text-7xl text-[color:var(--brass-light)]">
                <CountUp value={s.v} suffix={s.s} />
              </div>
              <div className="overline text-ivory/65 mt-3">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FLAGSHIP STRIP */}
      <section className="bg-[color:var(--ivory)] py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 text-center">
          <Reveal><p className="overline">Trusted to craft spaces for</p></Reveal>
          <Reveal hairline className="hairline mt-7 mx-auto max-w-3xl" />
          <Reveal delay={120}>
            <div className="mt-7 flex flex-wrap justify-center items-center gap-x-7 gap-y-3 text-ink-soft font-body uppercase tracking-[0.22em] text-[12px] md:text-[13px]">
              {FLAGSHIP.map((b, i) => (
                <span key={b} className="flex items-center gap-x-7">
                  {b}
                  {i < FLAGSHIP.length - 1 && <span className="hidden md:inline-block w-px h-3 bg-[color:var(--brass)]/60" />}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal hairline className="hairline mt-7 mx-auto max-w-3xl" />
        </div>
      </section>

      {/* WHY US — 4 pillars */}
      <section className="bg-[color:var(--paper)] py-24 md:py-36">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="overline">Why us</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3 max-w-3xl">Four reasons your home will feel different.</h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-2 gap-y-14 gap-x-16">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <div className="text-[color:var(--brass)] mb-4"><Merkaba size={22} /></div>
                <h3 className="font-display text-2xl md:text-3xl">{p.t}</h3>
                <p className="mt-4 text-ink-soft/85 text-[15px] leading-relaxed">{p.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOFT FURNISHING FEATURE */}
      <section className="bg-[color:var(--ink)] text-ivory py-24 md:py-36 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Reveal>
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img src={softFurnishingImg} alt="Bespoke soft furnishing by Crafted Comforts" loading="lazy"
                className="w-full h-full object-cover" width={800} height={1000} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="overline text-[color:var(--brass-light)]">Our signature</p>
            <h2 className="font-display text-4xl md:text-5xl mt-4 leading-[1.08]">
              The soul of a sanctuary is in its soft furnishing.
            </h2>
            <p className="mt-6 text-ivory/80 leading-relaxed">
              Most firms source soft furnishing from third parties and hope it fits. We run our own atelier — bespoke drapery, upholstery, cushions, rugs and bed linen, manufactured to the millimetre for each space. Fabric is chosen against the room's light. Seams are decided by the sofa they'll live on. It is the layer that turns a finished room into a home — and it is entirely ours.
            </p>
            <p className="mt-7 overline text-[color:var(--brass-light)]">drapery · upholstery · bed linen · rugs · cushions</p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[color:var(--ivory)] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="overline">Services</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3 max-w-2xl">What we make.</h2>
          </Reveal>
          <div className="mt-14 grid md:grid-cols-3 gap-x-8 gap-y-10">
            {SERVICES.map((s, i) => (
              <Reveal key={s.t} delay={i * 80}>
                <div className="border-t border-[color:var(--brass)]/45 pt-6">
                  <div className="text-[color:var(--brass)]"><Merkaba size={18} /></div>
                  <h3 className="font-display text-2xl mt-4">{s.t}</h3>
                  <p className="mt-3 text-ink-soft/85 text-[15px]">{s.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="font-display italic text-2xl md:text-3xl text-center mt-16 max-w-3xl mx-auto text-ink-soft">
              Complete interiors from ₹15 lakhs — covering both hard and soft furnishing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="bg-[color:var(--paper)] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="overline">Selected work</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3">A few of our sanctuaries.</h2>
          </Reveal>
          <div className="mt-14 grid md:grid-cols-2 gap-x-8 gap-y-14">
            {featured.map((m, i) => (
              <Reveal key={m.src} delay={i * 70}>
                <Link to="/portfolio" className="group block lift">
                  <div className="aspect-[5/4] overflow-hidden bg-[color:var(--ivory)]">
                    <img src={m.src} alt={m.alt} loading="lazy" className="w-full h-full object-cover zoom" width={900} height={720} />
                  </div>
                  <div className="mt-5">
                    <p className="overline">{m.location}</p>
                    <h3 className="font-display text-2xl md:text-3xl mt-1">{m.project}</h3>
                    <p className="mt-2 text-ink-soft/85 text-[15px]">{m.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link to="/portfolio" className="btn-outline-ink">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-[color:var(--ink)] text-ivory py-24 md:py-36">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="overline text-[color:var(--brass-light)]">How we work</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3 max-w-3xl">From the first sketch to the final cushion.</h2>
          </Reveal>
          <div className="mt-14 md:grid md:grid-cols-5 md:gap-6 relative">
            <Reveal hairline className="hidden md:block hairline absolute left-0 right-0 top-8" />
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80} className="mb-10 md:mb-0">
                <div className={`flex md:flex-col gap-5 md:gap-6 items-start ${p.n === 3 ? "md:text-[color:var(--brass-light)]" : ""}`}>
                  <div className={`shrink-0 w-16 h-16 flex items-center justify-center font-display text-3xl border ${p.n === 3 ? "bg-[color:var(--brass)] text-[color:var(--ink)] border-[color:var(--brass)]" : "border-[color:var(--brass)]/60 text-[color:var(--brass-light)]"}`}>
                    {p.n}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl">{p.t}</h3>
                    <p className="mt-2 text-ivory/75 text-[14px] leading-relaxed">{p.b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[color:var(--paper)] py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="overline">In their words</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3">What clients say.</h2>
          </Reveal>
          <div className="mt-14 grid md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.a} delay={i * 90}>
                <figure className="bg-[color:var(--ivory)] p-8 md:p-10 h-full relative">
                  <span className="absolute -top-2 left-6 font-display text-[120px] leading-none text-[color:var(--brass)]/30 select-none">"</span>
                  <blockquote className="relative font-display text-xl md:text-[22px] leading-[1.45] text-ink-soft">
                    {t.q}
                  </blockquote>
                  <figcaption className="mt-6 overline">{t.a}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[color:var(--ivory)] py-24 md:py-32">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="overline">Questions</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3">Good to know.</h2>
          </Reveal>
          <Reveal delay={120}>
            <dl className="mt-12 divide-y divide-[color:var(--brass)]/30 border-y border-[color:var(--brass)]/30">
              {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="lead-form" className="bg-[color:var(--ink)] text-ivory py-24 md:py-36 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 grid md:grid-cols-[1fr_360px] gap-12">
          <div>
            <Reveal>
              <p className="overline text-[color:var(--brass-light)]">Begin</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3 leading-[1.05]">Book your consultation.</h2>
              <p className="mt-5 text-ivory/80 max-w-xl">
                Tell us about your space — we'll be in touch within one business day.
              </p>
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <LeadForm />
            </Reveal>
          </div>
          <Reveal delay={200} className="md:pt-20">
            <ContactCallout />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5">
      <summary className="flex justify-between items-start gap-6 cursor-pointer list-none">
        <span className="font-display text-xl md:text-2xl text-ink">{q}</span>
        <span className="text-[color:var(--brass)] transition-transform duration-300 group-open:rotate-45 text-2xl leading-none mt-1">+</span>
      </summary>
      <p className="mt-3 text-ink-soft/85 leading-relaxed max-w-prose">{a}</p>
    </details>
  );
}
