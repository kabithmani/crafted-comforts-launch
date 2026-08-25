/**
 * Collage preloading. Keeps a module-level record of decoded images so a card
 * that scrolls back into view never flickers, and warms upcoming collages while
 * the browser is idle so slow connections still paint complete grids.
 */

const decoded = new Set<string>();
const inFlight = new Map<string, Promise<void>>();

export function isDecoded(src: string) {
  return decoded.has(src);
}

export function markDecoded(src: string) {
  decoded.add(src);
}

export function preload(src: string, priority: "high" | "low" = "low"): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (decoded.has(src)) return Promise.resolve();
  const existing = inFlight.get(src);
  if (existing) return existing;

  const task = new Promise<void>((resolve) => {
    const img = new Image();
    // fetchPriority is not in older lib.dom typings
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
    img.decoding = "async";
    const done = () => {
      decoded.add(src);
      inFlight.delete(src);
      resolve();
    };
    img.onload = () => {
      if (typeof img.decode === "function") img.decode().then(done, done);
      else done();
    };
    img.onerror = () => {
      inFlight.delete(src);
      resolve();
    };
    img.src = src;
  });

  inFlight.set(src, task);
  return task;
}

const idle = (fn: () => void) => {
  if (typeof window === "undefined") return;
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
    .requestIdleCallback;
  if (ric) ric(fn, { timeout: 1200 });
  else window.setTimeout(fn, 200);
};

/** Warm a batch sequentially so we never saturate the connection. */
export function preloadBatch(sources: string[], priority: "high" | "low" = "low") {
  const queue = sources.filter((s) => s && !decoded.has(s));
  if (!queue.length) return;
  idle(() => {
    void queue.reduce<Promise<void>>(
      (chain, src) => chain.then(() => preload(src, priority)),
      Promise.resolve(),
    );
  });
}
