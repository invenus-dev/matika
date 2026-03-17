interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 64, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      {/* Blue tile — plus */}
      <g transform="rotate(-5 16 16)">
        <rect x="3" y="3" width="27" height="27" rx="6" fill="#3b82f6" />
        <rect x="10" y="14" width="13" height="4" rx="1.5" fill="white" />
        <rect x="14.5" y="9.5" width="4" height="13" rx="1.5" fill="white" />
      </g>

      {/* Green tile — number 2 */}
      <g transform="rotate(4 48 16)">
        <rect x="34" y="3" width="27" height="27" rx="6" fill="#22c55e" />
        <text
          x="47.5"
          y="23"
          textAnchor="middle"
          fill="white"
          fontSize="19"
          fontWeight="bold"
          fontFamily="Comic Sans MS, cursive"
        >
          2
        </text>
      </g>

      {/* Amber tile — number 5 */}
      <g transform="rotate(3 16 48)">
        <rect x="3" y="34" width="27" height="27" rx="6" fill="#f59e0b" />
        <text
          x="16.5"
          y="54"
          textAnchor="middle"
          fill="white"
          fontSize="19"
          fontWeight="bold"
          fontFamily="Comic Sans MS, cursive"
        >
          5
        </text>
      </g>

      {/* Pink tile — minus */}
      <g transform="rotate(-3 48 48)">
        <rect x="34" y="34" width="27" height="27" rx="6" fill="#ec4899" />
        <rect x="41" y="45.5" width="13" height="4" rx="1.5" fill="white" />
      </g>

      {/* Center sparkle star */}
      <g transform="translate(32 32)">
        <circle r="5.5" fill="#fbbf24" />
        <path
          d="M0-8 L1.8-2.5 L7.6-2.5 L2.9 1 L4.7 6.5 L0 3 L-4.7 6.5 L-2.9 1 L-7.6-2.5 L-1.8-2.5Z"
          fill="#fbbf24"
          opacity="0.6"
        />
      </g>
    </svg>
  )
}
