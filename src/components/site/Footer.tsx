import { Link } from "@tanstack/react-router";
import { Merkaba } from "./Merkaba";
import { SITE, telHref } from "@/lib/site-config";

export function Footer({ disclaimer = false }: { disclaimer?: boolean }) {
  return (
    <footer className="relative bg-ink text-ivory overflow-hidden">
      <div
        aria-hidden
        className="absolute -right-24 -bottom-24 opacity-[0.05] text-[color:var(--brass)] spin-slow"
      >
        <Merkaba size={520} strokeWidth={1} />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 text-[color:var(--brass-light)]">
            <Merkaba size={26} />
            <span className="font-body text-[13px] tracking-[0.28em] uppercase text-ivory">Crafted Comforts</span>
          </div>
          <p className="mt-5 font-display italic text-2xl text-ivory/85">Spaces to Sanctuaries.</p>
          <p className="mt-6 text-sm text-ivory/65 max-w-md">{SITE.studioAddress}</p>
        </div>

        <div>
          <div className="overline mb-4 text-[color:var(--brass-light)]">Reach us</div>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><a href={telHref} className="story-underline">{SITE.phoneDisplay}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="story-underline break-all">{SITE.email}</a></li>
            <li className="flex gap-4 pt-3">
              <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-[color:var(--brass-light)]">Instagram</a>
              <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-[color:var(--brass-light)]">Facebook</a>
            </li>
          </ul>
        </div>

        <div>
          <div className="overline mb-4 text-[color:var(--brass-light)]">Explore</div>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link to="/about" className="story-underline">About</Link></li>
            <li><Link to="/manufacturing" className="story-underline">Manufacturing</Link></li>
            <li><Link to="/portfolio" className="story-underline">Portfolio</Link></li>
            <li><Link to="/privacy" className="story-underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="story-underline">Terms</Link></li>
            <li><Link to="/cancellation" className="story-underline">Cancellation Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-ivory/10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 text-xs text-ivory/55 flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Crafted Comforts · Spaces to Sanctuaries</span>
          <span>Bengaluru · Goa · Mumbai · Kolkata · Mysore · Kochi</span>
        </div>
      </div>
    </footer>
  );
}