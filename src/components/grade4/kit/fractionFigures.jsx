// 18-20-darslarning umumiy kasr chizmalari.
//
// Uch dars ham bitta ko'rgazmali tilda gapiradi: teng kataklarga bo'lingan
// tasma, doira va sonlar nuri. Model bir xil bo'lgani uchun bola 18-darsda
// o'rgangan rasmni 19 va 20-darsda qaytadan o'rganmaydi — faqat u bilan
// yangi ish qiladi. Har darsda qaytadan chizilsa, uchta xil kasr paydo
// bo'lardi (CLAUDE.md 5-bo'lim).
import { T } from '../theoryShell/palette.js';

// ---------------------------------------------------------------------------
// Kasr yozuvi: surat, chiziq, maxraj. Matn emas, chizma — shuning uchun
// sonlar hamma joyda bir xil o'lchamda va bir xil joyda turadi.
// ---------------------------------------------------------------------------
export const FractionGlyph = ({
  num, den, x, y, size = 26, tone = T.ink, label = null, labelTone = null,
}) => {
  // Geometriya taxminan emas, hisob bilan quriladi. SVG da `y` matnning
  // TAYANCH chizig'i (baseline), raqamning tepasi esa undan `cap` balandlikda
  // turadi. Ilgari maxraj tayanchi chiziqqa juda yaqin qo'yilgani uchun
  // raqamning tepasi kasr chizig'ining ustiga chiqib ketardi.
  //
  // JetBrains Mono da raqam balandligi taxminan 0.72 em, kengligi 0.6 em.
  const cap = size * 0.72;
  const stroke = Math.max(2, size * 0.09);
  const gap = Math.max(4, size * 0.22);          // chiziq bilan raqam orasi
  const digits = Math.max(String(num).length, String(den).length);
  const width = digits * size * 0.6 + size * 0.42;
  // Surat tayanchi chiziqdan yuqorida: raqamning pastki qirrasi shu yerda.
  const numBase = y - stroke / 2 - gap;
  // Maxraj tayanchi chiziqdan pastda: raqamning tepasi chiziqqa tegmasligi
  // uchun bo'shliqqa raqam balandligi ham qo'shiladi.
  const denBase = y + stroke / 2 + gap + cap;
  return (
    <g>
      <text x={x} y={numBase} textAnchor="middle" fill={tone} fontSize={size} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {num}
      </text>
      <line x1={x - width / 2} y1={y} x2={x + width / 2} y2={y} stroke={tone} strokeWidth={stroke} strokeLinecap="round" />
      <text x={x} y={denBase} textAnchor="middle" fill={tone} fontSize={size} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {den}
      </text>
      {label && (
        <text x={x} y={denBase + size * 0.56} textAnchor="middle" fill={labelTone ?? T.ink3} fontSize={size * 0.44} fontWeight="700" fontFamily="Manrope, sans-serif">
          {label}
        </text>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Teng kataklarga bo'lingan tasma.
//
//   parts   — nechta teng katak;
//   shaded  — boshidan nechtasi bo'yalgan (asosiy rang);
//   extra   — qo'shimcha bo'yalgan kataklar to'plami (Set, indekslar);
//   cuts    — teng bo'lmagan bo'linish uchun 0..1 oralig'idagi kesim nuqtalari;
//   onCell  — katak bosilganda chaqiriladi (CellFill mexanikasi).
// ---------------------------------------------------------------------------
export const FractionBar = ({
  parts, shaded = 0, extra = null, cuts = null,
  x = 46, y = 60, width = 428, height = 62,
  tone = T.cyan, extraTone = T.lime, onCell = null, canPick = false, wrongCell = null,
  // Bo'yalgan katak rangi: ikkita qo'shiluvchi yonma-yon turganda ular
  // kasr yozuvi bilan bir rangda bo'lishi kerak, aks holda qaysi tasma
  // qaysi kasrga tegishli ekani ko'rinmaydi.
  shade = 'rgba(22,143,163,.28)',
}) => {
  const edges = cuts
    ? [0, ...cuts, 1].map((value) => x + value * width)
    : Array.from({ length: parts + 1 }, (_, index) => x + (index * width) / parts);
  const count = edges.length - 1;
  return (
    <g>
      {Array.from({ length: count }, (_, index) => {
        const left = edges[index];
        const cellWidth = edges[index + 1] - left;
        const isExtra = extra?.has(index);
        const isBase = index < shaded;
        const bad = wrongCell === index;
        // Bo'yalgan katak yaqqol ko'rinishi kerak: T.cyanSoft oq fonda deyarli
        // sezilmasdi va bola qaysi katak olinganini ajratolmasdi.
        const fill = bad ? 'rgba(255,91,53,.24)'
          : isExtra ? 'rgba(149,201,61,.46)'
            : isBase ? shade : '#FFFFFF';
        const stroke = bad ? T.accent : isExtra ? extraTone : isBase ? tone : 'rgba(23,59,82,.22)';
        return (
          <g key={index}>
            <rect
              x={left}
              y={y}
              width={cellWidth}
              height={height}
              fill={fill}
              stroke={stroke}
              strokeWidth={isBase || isExtra ? 2.4 : 1.6}
              style={onCell ? { cursor: canPick ? 'pointer' : 'default' } : undefined}
              data-g4-branch={onCell ? 'cell' : undefined}
              data-g4-source-index={onCell ? index : undefined}
              data-g4-correct={onCell ? (!isBase && !isExtra ? 'true' : 'false') : undefined}
              onClick={onCell && canPick ? () => onCell(index) : undefined}
            />
          </g>
        );
      })}
      <rect x={x} y={y} width={width} height={height} fill="none" stroke={T.ink} strokeWidth="2.6" rx="3" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Teng sektorlarga bo'lingan doira.
// ---------------------------------------------------------------------------
export const FractionCircle = ({ parts, shaded = 0, cx = 260, cy = 116, r = 86, tone = T.cyan }) => {
  const sector = (index) => {
    const a0 = (index * 2 * Math.PI) / parts - Math.PI / 2;
    const a1 = ((index + 1) * 2 * Math.PI) / parts - Math.PI / 2;
    const big = a1 - a0 > Math.PI ? 1 : 0;
    return `M${cx} ${cy} L${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} A${r} ${r} 0 ${big} 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r} Z`;
  };
  return (
    <g>
      {Array.from({ length: parts }, (_, index) => (
        <path
          key={index}
          d={sector(index)}
          fill={index < shaded ? 'rgba(22,143,163,.28)' : '#FFFFFF'}
          stroke={index < shaded ? tone : 'rgba(23,59,82,.22)'}
          strokeWidth={index < shaded ? 2.4 : 1.6}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.ink} strokeWidth="2.6" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Sonlar nuri: 0 dan 1 gacha teng ulushlarga bo'linadi.
//
//   mark  — nuqta turgan ulush raqami;
//   from, step — qo'shishni ko'rsatadigan yoy (2/9 dan 5 ulush o'ngga).
// ---------------------------------------------------------------------------
export const FractionRay = ({
  parts, mark = null, from = null, step = 0, showFraction = true, y = 96,
}) => {
  const x0 = 60;
  const x1 = 456;
  const at = (value) => x0 + (value / parts) * (x1 - x0);
  return (
    <g>
      <line x1={x0} y1={y} x2={x1 + 24} y2={y} stroke={T.ink} strokeWidth="2.6" />
      <path d={`M${x1 + 24} ${y} l-12 -6 v12 z`} fill={T.ink} />
      {Array.from({ length: parts + 1 }, (_, index) => (
        <g key={index}>
          <line x1={at(index)} y1={y - 12} x2={at(index)} y2={y + 12} stroke={index === 0 || index === parts ? T.ink : T.ink3} strokeWidth={index === 0 || index === parts ? 2.4 : 1.5} />
          {(index === 0 || index === parts) && (
            <text x={at(index)} y={y + 34} textAnchor="middle" fill={T.ink2} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {index === 0 ? '0' : '1'}
            </text>
          )}
        </g>
      ))}
      {from !== null && step > 0 && (
        <g>
          {/* Qadam yoyi belgidan belgiga boradi va uchi PASTGA, ya'ni yetib
              kelgan belgiga qaraydi. Ilgari uchburchak yuqoriga qaragani uchun
              strelka yoydan chiqib ketgandek ko'rinardi. */}
          <path
            d={`M${at(from)} ${y - 14} Q${at(from + step / 2)} ${y - 52} ${at(from + step)} ${y - 18}`}
            fill="none"
            stroke={T.accent}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d={`M${at(from + step)} ${y - 5} l-6 -12 h12 z`} fill={T.accent} />
        </g>
      )}
      {mark !== null && (
        <g>
          <circle cx={at(mark)} cy={y} r="7" fill={T.success} stroke="#FFFFFF" strokeWidth="2" />
          {showFraction && <FractionGlyph num={mark} den={parts} x={at(mark)} y={y - 42} size={20} tone={T.success} />}
        </g>
      )}
    </g>
  );
};
