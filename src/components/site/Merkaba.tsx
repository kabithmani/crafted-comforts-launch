interface Props { size?: number; className?: string; strokeWidth?: number; }

/**
 * Brand mark — star tetrahedron (merkaba) drawn as a wireframe: two
 * interlocking triangles plus the interior edges of the front tetrahedron.
 */
export function Merkaba({ size = 28, className = "", strokeWidth = 1.4 }: Props) {
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
      className={className}
      aria-hidden
    >
      {/* upward tetrahedron */}
      <polygon points="50,6 88.1,72 11.9,72" />
      {/* downward tetrahedron */}
      <polygon points="50,94 11.9,28 88.1,28" />
      {/* interior edges — gives the mark its depth */}
      <path d="M24.6 50 H75.4" />
      <path d="M24.6 50 L50 72 L75.4 50" />
      <path d="M50 72 V94" />
    </svg>
  );
}
