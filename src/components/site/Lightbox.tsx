import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackViewProject } from "@/lib/analytics";
import { preload } from "@/lib/image-preload";
import type { MediaItem } from "@/data/manifest";

export function Lightbox({
  items, openIndex, onClose,
}: { items: MediaItem[]; openIndex: number | null; onClose: () => void; }) {
  const [i, setI] = useState(openIndex ?? 0);
  const [loaded, setLoaded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const count = items.length;
  const wrap = useCallback((n: number) => (count ? (n + count) % count : 0), [count]);
  const go = useCallback((n: number) => setI(wrap(n)), [wrap]);

  useEffect(() => {
    if (openIndex !== null) setI(openIndex);
  }, [openIndex]);

  // Warm the neighbouring frames so next/prev is instant.
  const neighbours = useMemo(() => {
    if (openIndex === null || !count) return [];
    return [wrap(i + 1), wrap(i + 2), wrap(i - 1)]
      .map((n) => items[n])
      .filter((it) => it && it.type === "image")
      .map((it) => it.src);
  }, [i, items, count, openIndex, wrap]);

  useEffect(() => {
    neighbours.forEach((src) => void preload(src, "low"));
  }, [neighbours]);

  useEffect(() => {
    const it = items[i];
    if (it?.project) trackViewProject(it.project);
    setLoaded(it?.type === "image" ? false : true);
  }, [i, items]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [i, openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(i + 1); }
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(count - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [openIndex, i, count, go, onClose]);

  if (openIndex === null || !count) return null;
  const it = items[i];

  return (
    <div
      role="dialog" aria-modal="true" aria-label={it?.alt}
      className="fixed inset-0 z-[100] bg-[color:var(--ink)]/96 backdrop-blur-md flex flex-col overscroll-contain"
      onClick={onClose}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        touchStart.current = null;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? i + 1 : i - 1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
      }}
    >
      {/* top bar */}
      <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 text-ivory/85 shrink-0">
        <span className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-[color:var(--brass-light)]">
          {i + 1} / {count}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close gallery"
          className="text-3xl leading-none px-3 py-1 text-ivory/80 hover:text-ivory transition-colors"
        >
          ×
        </button>
      </div>

      {/* stage */}
      <div
        className="flex-1 min-h-0 flex items-center justify-center px-2 md:px-16 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <NavArrow side="left" onClick={() => go(i - 1)} />
        <div className="w-full h-full flex items-center justify-center">
          {it.type === "video" ? (
            <video
              key={it.src}
              src={it.src}
              controls autoPlay playsInline
              className="max-h-full max-w-full w-auto h-auto"
            />
          ) : (
            <img
              key={it.src}
              src={it.src}
              alt={it.alt}
              draggable={false}
              onLoad={() => setLoaded(true)}
              className={`max-h-full max-w-full w-auto h-auto object-contain transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
        <NavArrow side="right" onClick={() => go(i + 1)} />
      </div>

      {/* caption */}
      <div className="px-5 pt-3 text-center text-ivory shrink-0" onClick={(e) => e.stopPropagation()}>
        {it.project && <div className="font-display text-xl md:text-3xl">{it.project}</div>}
        {it.location && <div className="overline text-[color:var(--brass-light)] mt-1 text-[10px]">{it.location}</div>}
        {it.desc && <p className="text-ivory/70 max-w-xl mx-auto mt-2 text-sm hidden md:block">{it.desc}</p>}
      </div>

      {/* thumbnail strip */}
      {count > 1 && (
        <div
          ref={stripRef}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 flex gap-2 overflow-x-auto px-4 md:px-8 py-4 md:py-5 justify-start md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((thumb, n) => (
            <button
              key={thumb.src + n}
              data-active={n === i}
              onClick={() => go(n)}
              aria-label={`View frame ${n + 1}`}
              aria-current={n === i}
              className={`relative shrink-0 w-14 h-11 md:w-20 md:h-14 overflow-hidden transition-all duration-300 ${
                n === i
                  ? "ring-1 ring-[color:var(--brass-light)] opacity-100"
                  : "opacity-45 hover:opacity-80"
              }`}
            >
              {thumb.type === "video" ? (
                <span className="w-full h-full flex items-center justify-center bg-ivory/10 text-[color:var(--brass-light)] text-xs">▶</span>
              ) : (
                <img src={thumb.src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      aria-label={side === "left" ? "Previous frame" : "Next frame"}
      onClick={onClick}
      className={`absolute ${side === "left" ? "left-1 md:left-4" : "right-1 md:right-4"} top-1/2 -translate-y-1/2 z-10
        w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full
        border border-[color:var(--brass)]/40 bg-[color:var(--ink)]/50 text-ivory/80
        hover:text-ivory hover:border-[color:var(--brass-light)] transition-colors duration-300 text-2xl leading-none`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
