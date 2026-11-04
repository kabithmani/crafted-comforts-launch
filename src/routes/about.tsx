import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Merkaba } from "@/components/site/Merkaba";
import { waPrefill, telHref, SITE } from "@/lib/site-config";
import { trackBookCTA, trackWhatsApp } from "@/lib/analytics";

const HEADER_IMAGE = "/media/hero/modern-styled-entryway.jpg";
const CITIES = ["Bengaluru", "Goa", "Mumbai", "Kolkata", "Mysore", "Kochi"];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Crafted Comforts — 20+ Years of In-House Luxury Interiors" },
      { name: "description", content: "Three founders, 25–30 years' experience each. Nine in-house factories. 500+ sanctuaries across six cities — the story of Crafted Comforts." },
      { property: "og:title", content: "About Crafted Comforts" },
      { property: "og:description", content: "Twenty years of building sanctuaries — in-house, end-to-end." },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <PageShell transparentHeader>
      <section className="relative h-[70vh] min-h-[480px] bg-[color:var(--ink)] overflow-hidden">
        <img src={HEADER_IMAGE} alt="Quiet luxury interior detail" className="absolute inset-0 w-full h-full object-cover hero-settle" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-[color:var(--ink)]/40 to-[color:var(--ink)]/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1200px] mx-auto w-full px-5 md:px-8 pb-16 md:pb-24 text-ivory hero-rise">
            <p className="overline text-[color:var(--brass-light)]">About</p>
            <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-3xl leading-[1.03]">
              Twenty years of building sanctuaries.
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--paper)] py-24 md:py-36">
        <div className="max-w-[860px] mx-auto px-5 md:px-8">
          <Reveal>
            <p className="font-display italic text-3xl md:text-4xl leading-[1.25] text-ink-soft">
              Some firms design. Some build. Some manufacture. We never understood why a home should pass through three pairs of hands.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 space-y-7 text-[16px] md:text-[17px] leading-[1.8] text-ink-soft">
              <p>
                Crafted Comforts was founded by three partners with 25–30 years each across construction and real estate, manufacturing, and interiors and execution, and is led day-to-day by our CEO. For over twenty years we have designed and built interiors the hard way — in-house — across Bengaluru, Goa, Mumbai, Kolkata, Mysore and Kochi, for homes, hotels and workplaces alike.
              </p>
              <p>
                We don't hand your project to subcontractors and hope. We design it, manufacture it in our own nine factories, build it, and style it down to the last cushion. That is why the result feels considered — and why more of your budget reaches the parts you can see and touch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--ink)] text-ivory py-24 md:py-36">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8 text-center">
          <Reveal>
            <div className="text-[color:var(--brass)] flex justify-center mb-8"><Merkaba size={32} /></div>
            <p className="font-display italic text-3xl md:text-5xl leading-[1.18]">
              "No handoffs. No hoping. One team, first sketch to final cushion."
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--ivory)] py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 text-center">
          <Reveal><p className="overline">Where we've worked</p></Reveal>
          <Reveal delay={120}>
            <div className="mt-7 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-ink font-display text-2xl md:text-3xl">
              {CITIES.map((c, i) => (
                <span key={c} className="flex items-center gap-x-8">
                  {c}
                  {i < CITIES.length - 1 && <span className="text-[color:var(--brass)] text-base">·</span>}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--ink)] text-ivory py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">Begin the conversation.</h2>
            <p className="mt-4 text-ivory/75">A free, no-obligation consultation — at our studio in Indiranagar, or wherever you are.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/" hash="lead-form" onClick={() => trackBookCTA("about_footer")} className="btn-brass">Book a Consultation</Link>
              <a href={waPrefill()} target="_blank" rel="noopener" onClick={trackWhatsApp} className="btn-outline-ivory">WhatsApp</a>
              <a href={telHref} className="text-ivory/70 text-sm self-center">{SITE.phoneDisplay}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}