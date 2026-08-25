import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyBar } from "./StickyBar";
import { CookieBar } from "./CookieBar";

export function PageShell({
  children, transparentHeader = false, portfolioDisclaimer = false,
}: { children: ReactNode; transparentHeader?: boolean; portfolioDisclaimer?: boolean }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-ink focus:text-ivory focus:px-3 focus:py-2 focus:z-[200]">
        Skip to content
      </a>
      <Header transparent={transparentHeader} />
      <main id="main" className="page-enter">{children}</main>
      <Footer />
      <StickyBar />
      <CookieBar />
    </>
  );
}