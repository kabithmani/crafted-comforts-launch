import { Merkaba } from "./Merkaba";

/**
 * Logo lockup: merkaba mark + wordmark + tagline.
 * `tone` picks the palette so it can sit on paper or over dark imagery.
 */
export function Logo({
  tone = "ink",
  size = 30,
  showTagline = true,
  className = "",
}: {
  tone?: "ink" | "ivory";
  size?: number;
  showTagline?: boolean;
  className?: string;
}) {
  const dark = tone === "ivory";
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className={dark ? "text-ivory" : "text-[color:var(--brass)]"}>
        <Merkaba size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[19px] md:text-[21px] tracking-[0.06em] ${
            dark ? "text-ivory" : "text-ink"
          }`}
        >
          Crafted Comforts
        </span>
        {showTagline && (
          <span
            className={`font-body font-light text-[10px] md:text-[11px] tracking-[0.14em] mt-[6px] ${
              dark ? "text-[color:var(--brass-light)]" : "text-[color:var(--brass)]"
            }`}
          >
            Spaces to Sanctuaries
          </span>
        )}
      </span>

    </span>
  );
}
