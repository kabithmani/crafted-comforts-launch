interface Props { size?: number; className?: string; strokeWidth?: number; }

/**
 * Brand mark — the Crafted Comforts merkaba: two interlocking equilateral
 * triangles (star tetrahedron) with the front tetrahedron's interior edges
 * drawn in, exactly as in the brand artwork. Hairline weight, currentColor.
 */
export function Merkaba({ size = 28, className = "", strokeWidth = 1.1 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      className={className}
      aria-hidden
    >
      {/* upward tetrahedron */}
      <polygon points="50,2 91.15,71.9 8.85,71.9" />
      {/* downward tetrahedron */}
      <polygon points="50,98 8.85,26.7 91.15,26.7" />
      {/* interior edges of the front tetrahedron — the mark's depth */}
      <path d="M30.8 39.9 H69.2" />
      <path d="M30.8 39.9 L50 52.7 L69.2 39.9" />
      <path d="M50 52.7 V98" />
    </svg>
  );
}
