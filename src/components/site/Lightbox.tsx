import { useEffect, useState } from "react";
import { trackViewProject } from "@/lib/analytics";
import type { MediaItem } from "@/data/manifest";

export function Lightbox({
  items, openIndex, onClose,
}: { items: MediaItem[]; openIndex: number | null; onClose: () => void; }) {
  const [i, setI] = useState(openIndex ?? 0);

  useEffect(() => {
    if (openIndex !== null) {
      setI(openIndex);
      const it = items[openIndex];
      if (it?.project) trackViewProject(it.project);
    }
  }, [openIndex, items]);

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => Math.min(items.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [openIndex, items.length, onClose]);

  useEffect(() => {
    const it = items[i];
    if (it?.project) trackViewProject(it.project);
  }, [i, items]);

  if (openIndex === null) return null;
  const it = items[i];

  return (
    <div
      role="dialog" aria-modal="true" aria-label={it?.alt}
      className="fixed inset-0 z-[100] bg-[color:var(--ink)]/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      <div className="flex justify-between items-center px-5 py-4 text-ivory/85">
        <span className="text-xs tracking-[0.22em] uppercase text-[color:var(--brass-light)]">{i + 1} / {items.length}</span>
        <button onClick={onClose} aria-label="Close" className="text-2xl leading-none p-2">×</button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 md:px-12 relative" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Previous"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="hidden md:block absolute left-4 text-ivory/70 text-3xl disabled:opacity-20 p-3"
        >‹</button>
        <div className="max-w-[1200px] max-h-[80vh] w-full flex items-center justify-center">
          {it.type === "video" ? (
            <video src={it.src} controls autoPlay playsInline className="max-h-[80vh] w-auto" />
          ) : (
            <img src={it.src} alt={it.alt} className="max-h-[80vh] w-auto object-contain" />
          )}
        </div>
        <button
          aria-label="Next"
          onClick={() => setI((v) => Math.min(items.length - 1, v + 1))}
          disabled={i >= items.length - 1}
          className="hidden md:block absolute right-4 text-ivory/70 text-3xl disabled:opacity-20 p-3"
        >›</button>
      </div>
      <div className="px-6 pb-8 pt-3 text-center text-ivory">
        {it.project && <div className="font-display text-2xl md:text-3xl">{it.project}</div>}
        {it.location && <div className="overline text-[color:var(--brass-light)] mt-1">{it.location}</div>}
        {it.desc && <p className="text-ivory/70 max-w-xl mx-auto mt-3 text-sm">{it.desc}</p>}
      </div>
    </div>
  );
}