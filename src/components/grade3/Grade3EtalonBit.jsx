export default function Grade3EtalonBit({
  state = 'present',
  className = '',
}) {
  return (
    <svg
      className={`g1-char g1-char-bit ${className}`}
      viewBox="0 0 120 150"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grade3-etalon-bit-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2ECF2" />
          <stop offset="100%" stopColor="#B6C7D2" />
        </linearGradient>
        <linearGradient id="grade3-etalon-bit-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EBF2F6" />
          <stop offset="100%" stopColor="#C4D3DC" />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />

      <g className="g1-bit-ant">
        <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="11" r="6" fill="#FF4F28" />
        <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
      </g>

      <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
      <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />

      <rect
        x="34"
        y="60"
        width="52"
        height="62"
        rx="18"
        fill="url(#grade3-etalon-bit-body)"
        stroke="#A9BCC8"
        strokeWidth="2"
      />
      <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />

      {state === 'happy' && (
        <g>
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      )}
      {state === 'present' && (
        <g>
          <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
          <g className="g1-bit-wave">
            <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
            <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
          </g>
        </g>
      )}
      {state === 'hint' && (
        <g>
          <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
          <path d="M84 74 C 92 64 96 54 95 46" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="95" cy="45" r="5" fill="#B6C7D2" />
        </g>
      )}

      <rect
        x="28"
        y="28"
        width="64"
        height="46"
        rx="16"
        fill="url(#grade3-etalon-bit-head)"
        stroke="#A9BCC8"
        strokeWidth="2"
      />
      <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
      <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
      <g className="g1-eyes" fill="#5BD6F2">
        {state === 'hint'
          ? (
            <>
              <circle cx="50" cy="50" r="4.5" />
              <circle cx="70" cy="49" r="5.5" />
            </>
          )
          : (
            <>
              <circle cx="50" cy="50" r="5" />
              <circle cx="70" cy="50" r="5" />
            </>
          )}
      </g>
      {state === 'happy' && (
        <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}
      {state === 'present' && (
        <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />
      )}
      {state === 'hint' && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
      {state === 'hint' && (
        <g>
          <circle cx="99" cy="38" r="9" fill="#FFC23C" />
          <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
        </g>
      )}
    </svg>
  );
}
