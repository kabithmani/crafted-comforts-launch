import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { waPrefill, telHref } from "@/lib/site-config";
import { trackWhatsApp, trackCall, trackBookCTA } from "@/lib/analytics";
import { WhatsAppGlyph, PhoneGlyph } from "./Header";

export function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > (window.innerHeight * 0.8));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-ink text-ivory border-t border-[color:var(--brass)]/40 safe-bottom transition-transform duration-500"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)", transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
    >
      <div className="grid grid-cols-3 divide-x divide-ivory/15">
        <a href={waPrefill()} target="_blank" rel="noopener" onClick={trackWhatsApp}
          className="flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em]">
          <span className="text-[color:var(--brass-light)]"><WhatsAppGlyph size={18} /></span>
          WhatsApp
        </a>
        <a href={telHref} onClick={trackCall}
          className="flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em]">
          <span className="text-[color:var(--brass-light)]"><PhoneGlyph size={18} /></span>
          Call
        </a>
        <Link to="/" hash="lead-form" onClick={() => trackBookCTA("sticky")}
          className="flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.18em] bg-[color:var(--brass)] text-ivory">
          Book
        </Link>
      </div>
    </div>
  );
}