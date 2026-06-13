interface Props { size?: number; className?: string; strokeWidth?: number; }
export function Merkaba({ size = 28, className = "", strokeWidth = 1.5 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polygon points="32,6 58,52 6,52" />
      <polygon points="32,58 6,12 58,12" />
      <circle cx="32" cy="32" r="22" opacity="0.25" />
    </svg>
  );
}