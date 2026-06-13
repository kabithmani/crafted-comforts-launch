import type { ReactNode } from "react";
import { PageShell } from "./PageShell";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  const updated = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());
  return (
    <PageShell>
      <article className="bg-[color:var(--paper)] pt-32 md:pt-40 pb-24 md:pb-32">
        <div className="max-w-[760px] mx-auto px-5 md:px-8">
          <p className="overline">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl mt-3 leading-[1.1]">{title}</h1>
          <p className="mt-3 text-sm text-ink-soft/65">Last updated: {updated}</p>
          <div className="mt-12 text-[16px] leading-[1.85] text-ink-soft space-y-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:text-ink [&_strong]:text-ink">
            {children}
          </div>
        </div>
      </article>
    </PageShell>
  );
}