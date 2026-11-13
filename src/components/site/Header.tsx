import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { waPrefill } from "@/lib/site-config";
import { trackBookCTA, trackWhatsApp } from "@/lib/analytics";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/manufacturing", label: "Manufacturing" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/", label: "Contact", hash: "lead-form" as string | undefined },
];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onContact = () => trackBookCTA("header");
  const showSolid = !transparent || scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 safe-top transition-all duration-500 ${
        showSolid
          ? `bg-paper/95 border-b border-[color:var(--brass)]/35 ${
              // backdrop-filter makes the header the containing block for the fixed
              // mobile menu, trapping it in the 72px bar — so drop the blur while it is open.
              open ? "" : "backdrop-blur"
            }`
          : "bg-transparent"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-[72px] md:h-[88px] flex items-center justify-between">
        <Link to="/" aria-label="Crafted Comforts — Spaces to Sanctuaries, home">
          <Logo tone={showSolid ? "ink" : "ivory"} size={32} />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              hash={n.hash}
              className={`story-underline text-[12px] tracking-[0.22em] uppercase ${
                showSolid ? "text-ink-soft" : "text-ivory/90"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={waPrefill()}
            target="_blank" rel="noopener"
            aria-label="Chat on WhatsApp"
            onClick={trackWhatsApp}
            className={`p-2 ${showSolid ? "text-ink" : "text-ivory"}`}
          >
            <WhatsAppGlyph />
          </a>
          <Link to="/" hash="lead-form" onClick={onContact} className="btn-brass !py-[12px] !px-[22px] !text-[11px]">
            Book a Consultation
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className={`md:hidden p-2 ${showSolid ? "text-ink" : "text-ivory"}`}
          onClick={() => setOpen((v) => !v)}
        >
          <Burger open={open} />
        </button>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-ink text-ivory safe-inset overscroll-contain transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="h-full flex flex-col items-center justify-center gap-7 px-6">
          {NAV.map((n, i) => (
            <Link
              key={n.label}
              to={n.to}
              hash={n.hash}
              onClick={() => setOpen(false)}
              className="font-display text-4xl tracking-wide"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 350ms cubic-bezier(0.22,1,0.36,1) ${i * 60 + 120}ms, transform 350ms cubic-bezier(0.22,1,0.36,1) ${i * 60 + 120}ms`,
              }}
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-6 flex gap-3">
            <a href={waPrefill()} target="_blank" rel="noopener" onClick={() => { trackWhatsApp(); setOpen(false); }} className="btn-outline-ivory">WhatsApp</a>
            <Link to="/" hash="lead-form" onClick={() => { onContact(); setOpen(false); }} className="btn-brass">Book</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="9" x2="24" y2="9" style={{ transition: "transform 300ms", transform: open ? "translateY(5px) rotate(45deg)" : "", transformOrigin: "center" }} />
      <line x1="4" y1="19" x2="24" y2="19" style={{ transition: "transform 300ms", transform: open ? "translateY(-5px) rotate(-45deg)" : "", transformOrigin: "center" }} />
    </svg>
  );
}

export function WhatsAppGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.358.69 4.55 1.879 6.402L4 29l7.79-1.84a11.95 11.95 0 0 0 4.21.762h.001C22.628 27.922 28 22.55 28 15.922 28 8.373 22.628 3 16.001 3zm0 22.013h-.001a9.99 9.99 0 0 1-3.927-.795l-.281-.117-4.625 1.093 1.115-4.506-.149-.292a9.96 9.96 0 0 1-1.4-5.395c.002-5.521 4.49-10.01 10.013-10.01 5.521 0 10.012 4.49 10.012 10.013 0 5.522-4.49 10.009-10.012 10.009zm5.498-7.487c-.301-.151-1.781-.879-2.057-.979-.276-.101-.477-.151-.678.15-.201.301-.778.978-.953 1.179-.176.201-.351.226-.652.075-.301-.151-1.272-.469-2.423-1.496-.895-.798-1.498-1.785-1.674-2.086-.176-.301-.019-.464.132-.614.135-.135.301-.351.452-.527.151-.176.201-.301.301-.502.101-.201.05-.376-.025-.527-.075-.151-.678-1.633-.929-2.236-.245-.587-.494-.508-.678-.518-.176-.009-.376-.011-.577-.011-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512s1.079 2.913 1.229 3.114c.151.201 2.124 3.244 5.149 4.55.72.311 1.281.497 1.72.636.722.23 1.381.197 1.9.12.58-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z"/>
    </svg>
  );
}

export function PhoneGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}