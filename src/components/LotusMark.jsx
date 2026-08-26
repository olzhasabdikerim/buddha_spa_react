export default function LotusMark({ className = '', color = 'currentColor' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 78C60 78 60 52 60 40"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M60 40C60 40 34 42 22 22C22 22 50 16 60 40Z"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M60 40C60 40 86 42 98 22C98 22 70 16 60 40Z"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M60 38C60 38 44 20 50 2C50 2 68 10 60 38Z"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M60 38C60 38 76 20 70 2C70 2 52 10 60 38Z"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M60 40C60 40 40 50 36 68C36 68 58 68 60 40Z"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M60 40C60 40 80 50 84 68C84 68 62 68 60 40Z"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="60" cy="40" r="2.4" fill={color} />
    </svg>
  )
}
