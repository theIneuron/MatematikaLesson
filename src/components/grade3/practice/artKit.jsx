// Predmet kiti — 3-sinf amaliyoti uchun chizilgan buyumlar va animatsiyalar.
// Kontrakt: src/books/grade3/TIPLAR_AMALIYOT_3SINF.md §3.8.
//
// Nega bitta faylda: 2-sinf amaliyotida har topshiriq o'z SVG'sini ichida saqlaydi va
// 190 faylda nusxalanadi — bitta bug 190 joyda tuzatiladi (CLAUDE.md §5 taqiqlaydi).
// Bu yerda buyumlar bir marta chiziladi, banklar ularga tavsif orqali murojaat qiladi.
//
// Kanon (3-sinf darsligi metaforasi, eski D01_02 dan): PANEL — yuzlik, LENTA — o'nlik,
// CHIROQ — birlik. Sahna KUNDUZGI, yorug' (START_GRADE3.md §2.18: qorong'i sahna rad etiladi).

const C = {
  hundred: '#FFB92E', hundredDk: '#C77E00',
  ten: '#019ACB', tenDk: '#065E7E',
  one: '#FF4F28', oneDk: '#B32C10',
  ink: '#0E0E10', muted: '#5F6570', line: '#C7DDF2', paper: '#FFFFFF',
};

export const ART_CSS = `
  /* Animatsiyalar estetik va JAVOBNI OCHMAYDI (metodist, 2026-08-06): ular buyumning
     paydo bo'lishini va "tirikligini" ko'rsatadi, to'g'ri variantga ishora qilmaydi. */

  /* Paydo bo'lish: yumshoq prujina, ozgina burilib to'g'rilanadi. */
  .g3-art-drop { animation: g3-art-drop .52s cubic-bezier(.22,1.2,.36,1) both; }
  @keyframes g3-art-drop {
    0%   { opacity: 0; transform: translateY(-14px) scale(.62) rotate(-7deg); }
    62%  { opacity: 1; transform: translateY(1px) scale(1.04) rotate(1.5deg); }
    100% { opacity: 1; transform: none; }
  }
  .g3-art-float { animation: g3-art-float 3.4s ease-in-out infinite; }
  @keyframes g3-art-float { 50% { transform: translateY(-4px); } }
  .g3-art-lit { animation: g3-art-lit 1.8s ease-in-out infinite; }
  @keyframes g3-art-lit { 50% { filter: brightness(1.16); transform: scale(1.06); } }
  /* Tablo raqamlari birin-ketin chiqadi — son yozilayotgandek. */
  .g3-art-plate span { animation: g3-art-type .42s cubic-bezier(.22,1.2,.36,1) both; }
  @keyframes g3-art-type { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  /* To'g'ri javobdan keyin sahna bir marta to'lqin bilan tasdiqlaydi. */
  .g3-result-correct .g3-art-piece { animation: g3-art-wave .62s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes g3-art-wave { 40% { transform: translateY(-7px) scale(1.06); } 100% { transform: none; } }

  /* Faqat TO'G'RI javobdan keyin son sahnada yig'iladi: avval razryadlar qiymati,
     keyin butun son. Shundan bola natija qayerdan chiqqanini KO'RADI.
     Javobdan oldin ko'rsatilmaydi — aks holda bu tayyor yechim bo'lardi. */
  .g3-art-sum {
    display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 7px;
    margin-top: 9px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 800;
  }
  .g3-art-sum span { animation: g3-art-rise .55s cubic-bezier(.22,1.2,.36,1) both; }
  .g3-art-sum .part { font-size: 21px; color: ${C.tenDk}; }
  .g3-art-sum .plus, .g3-art-sum .eq { font-size: 19px; color: ${C.muted}; }
  .g3-art-sum .total { font-size: 34px; color: ${C.hundredDk}; text-shadow: 0 2px 10px rgba(199,126,0,.22); }
  @keyframes g3-art-rise {
    0%   { opacity: 0; transform: translateY(10px) scale(.86); }
    70%  { opacity: 1; transform: translateY(-2px) scale(1.04); }
    100% { opacity: 1; transform: none; }
  }
  .g3-art-array { display: flex; flex-direction: column; align-items: center; }
  .g3-art-array-row { display: flex; }
  .g3-art-dot {
    border-radius: 50%; background: radial-gradient(circle at 34% 30%, #FFD9A6, ${C.hundred} 62%, ${C.hundredDk});
    box-shadow: 0 1px 2px rgba(38,49,62,.22);
  }
  .g3-art-row { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 5px; }
  .g3-art-group { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .g3-art-caption { font: 800 11px 'Manrope', system-ui, sans-serif; letter-spacing: .05em; text-transform: uppercase; }
  .g3-art-stacks { display: flex; align-items: flex-end; justify-content: center; gap: 16px; flex-wrap: wrap; }
  .g3-art-total {
    margin-top: 6px; text-align: center; font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 34px; font-weight: 800; color: ${C.hundredDk};
  }
  .g3-art-total-label { text-align: center; font: 750 12px 'Manrope', system-ui, sans-serif; color: ${C.muted}; }
  .g3-art-plate {
    display: inline-flex; gap: 3px; padding: 7px 11px; border-radius: 12px;
    background: ${C.paper}; border: 2px solid ${C.line};
    box-shadow: inset 0 0 14px rgba(20,90,134,.08);
  }
  .g3-art-plate span {
    font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 27px; font-weight: 800;
    color: #145A86; min-width: 19px; text-align: center; transition: color .3s ease, transform .3s ease;
  }
  .g3-art-plate span.is-lit { color: ${C.one}; transform: scale(1.16); }
  .g3-art-plate span.is-dim { color: #A7C4D8; }
  .g3-art-chip {
    display: inline-flex; flex-direction: column; align-items: center; gap: 1px;
    padding: 5px 13px; border-radius: 12px; background: ${C.paper}; border: 2px solid ${C.line};
    transition: transform .25s cubic-bezier(.34,1.4,.64,1), box-shadow .25s ease;
  }
  .g3-art-chip b { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 29px; font-weight: 800; color: #145A86; line-height: 1.05; }
  .g3-art-chip i { font: 800 10px 'Manrope', system-ui, sans-serif; font-style: normal; letter-spacing: .04em; text-transform: uppercase; }
  .g3-art-line { position: relative; width: 100%; max-width: 430px; height: 52px; margin: 0 auto; }
  .g3-art-line.is-tall { height: 66px; margin-top: 12px; }
  .g3-art-line-tick.is-inner { height: 13px; top: 15px; background: #A9CBE4; }
  .g3-art-line-value {
    position: absolute; transform: translateX(-50%); font: 800 15px 'JetBrains Mono', monospace;
    color: ${C.hundredDk}; white-space: nowrap;
    animation: g3-art-rise .5s cubic-bezier(.22,1.2,.36,1) both;
  }
  /* Rels bo'ylab sekin yorug'lik yuradi — o'q "ishlab turgandek". */
  .g3-art-line-rail {
    position: absolute; left: 0; right: 0; top: 20px; height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, #B9D7F0, #7FAFD4, #B9D7F0);
    background-size: 220% 100%; animation: g3-art-rail 5.5s linear infinite;
  }
  @keyframes g3-art-rail { to { background-position: -220% 0; } }
  .g3-art-line-tick { position: absolute; top: 12px; width: 3px; height: 19px; border-radius: 2px; background: #7FAFD4; transform: translateX(-50%); }
  .g3-art-line-mark { position: absolute; top: 33px; transform: translateX(-50%); font: 800 12px 'JetBrains Mono', monospace; color: #145A86; white-space: nowrap; }
  .g3-art-line-gap {
    position: absolute; top: 4px; transform: translateX(-50%); font: 800 18px 'JetBrains Mono', monospace;
    color: ${C.one}; animation: g3-art-gap 2.4s ease-in-out infinite;
  }
  @keyframes g3-art-gap { 50% { transform: translateX(-50%) translateY(-3px); opacity: .55; } }
  @media (prefers-reduced-motion: reduce) {
    .g3-art-drop, .g3-art-float, .g3-art-lit, .g3-art-line-rail, .g3-art-line-gap,
    .g3-art-plate span, .g3-result-correct .g3-art-piece,
    .g3-art-sum span, .g3-art-line-value { animation: none !important; }
  }
`;

/* --------------------------- buyumlar: panel · lenta · chiroq --------------------------- */

// Gradientlar bir marta e'lon qilinadi: har bir buyum ichida takrorlansa, bir sahnada
// o'nlab bir xil id paydo bo'lardi va brauzer ularni chalkashtirar edi.
export function GradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="g3ArtPanel" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFFCF3" /><stop offset="52%" stopColor="#FFF1D4" /><stop offset="100%" stopColor="#FFE1AC" />
        </linearGradient>
        <linearGradient id="g3ArtPanelLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD469" /><stop offset="100%" stopColor="#F0A012" />
        </linearGradient>
        <linearGradient id="g3ArtLenta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4FCFF" /><stop offset="48%" stopColor="#DFF3FB" /><stop offset="100%" stopColor="#BFE4F4" />
        </linearGradient>
        <linearGradient id="g3ArtLentaLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5FCCF0" /><stop offset="100%" stopColor="#0182AE" />
        </linearGradient>
        <radialGradient id="g3ArtBulb" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#FFF0D9" /><stop offset="45%" stopColor="#FFB08E" /><stop offset="100%" stopColor="#FF6A3D" />
        </radialGradient>
        <linearGradient id="g3ArtCap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8FA0AE" /><stop offset="38%" stopColor="#EEF3F7" /><stop offset="100%" stopColor="#7E93A2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// PANEL — yuzlik: 10x10 chiroqli qalqon, yuqori chetida yorug'lik aksi.
export function Panel({ s = 34, delay = 0, anim = true }) {
  return (
    <svg className={`g3-art-piece${anim ? ' g3-art-drop' : ''}`} width={s} height={s} viewBox="0 0 40 40" aria-hidden="true"
      style={{ animationDelay: `${delay}s`, filter: 'drop-shadow(0 3px 4px rgba(38,49,62,.20))' }}>
      <rect x="1.2" y="1.2" width="37.6" height="37.6" rx="6" fill="url(#g3ArtPanel)" stroke={C.hundredDk} strokeWidth="1.7" />
      {Array.from({ length: 100 }).map((_, i) => (
        <rect key={i} x={4.4 + (i % 10) * 3.2} y={4.4 + Math.floor(i / 10) * 3.2} width="2.2" height="2.2" rx="0.7" fill="url(#g3ArtPanelLight)" />
      ))}
      <path d="M4 3.4 H36 A2.6 2.6 0 0 1 38.6 6 V9 C26 5.4 14 5.4 1.4 9 V6 A2.6 2.6 0 0 1 4 3.4 Z" fill="#FFFFFF" opacity=".38" />
      <rect x="1.2" y="1.2" width="37.6" height="37.6" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity=".5" />
    </svg>
  );
}

// LENTA — o'nlik: bitta qatorda 10 chiroq, ustida yaltiroq chiziq.
export function Lenta({ s = 34, delay = 0, anim = true }) {
  return (
    <svg className={`g3-art-piece${anim ? ' g3-art-drop' : ''}`} width={s} height={s * 0.34} viewBox="0 0 40 14" aria-hidden="true"
      style={{ animationDelay: `${delay}s`, filter: 'drop-shadow(0 2px 3px rgba(38,49,62,.20))' }}>
      <rect x="0.9" y="0.9" width="38.2" height="12.2" rx="4" fill="url(#g3ArtLenta)" stroke={C.tenDk} strokeWidth="1.4" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={3 + i * 3.5} y="3.9" width="2.4" height="6.2" rx="1.1" fill="url(#g3ArtLentaLight)" />
      ))}
      <rect x="2.4" y="2" width="35.2" height="2.2" rx="1.1" fill="#FFFFFF" opacity=".55" />
    </svg>
  );
}

// CHIROQ — birlik: yakka chiroq, atrofida yumshoq nur.
export function Chiroq({ s = 15, delay = 0, anim = true }) {
  return (
    <svg className={`g3-art-piece${anim ? ' g3-art-drop' : ''}`} width={s} height={s * 1.3} viewBox="0 0 14 18" aria-hidden="true"
      style={{ animationDelay: `${delay}s`, filter: 'drop-shadow(0 1px 2px rgba(38,49,62,.24))' }}>
      <circle cx="7" cy="6.6" r="6.5" fill={C.one} opacity=".13" />
      <circle cx="7" cy="6.6" r="5.3" fill="url(#g3ArtBulb)" stroke={C.oneDk} strokeWidth="1.1" />
      <ellipse cx="5.2" cy="4.6" rx="1.7" ry="1.2" fill="#FFFFFF" opacity=".72" transform="rotate(-28 5.2 4.6)" />
      <rect x="4.4" y="11.9" width="5.2" height="4.5" rx="1.3" fill="url(#g3ArtCap)" stroke="#6E828F" strokeWidth="0.8" />
      <rect x="4.7" y="13.4" width="4.6" height="0.7" rx="0.35" fill="#7E8B96" opacity=".7" />
    </svg>
  );
}

const PIECE = { h: Panel, t: Lenta, o: Chiroq };
const PIECE_SIZE = { h: 30, t: 46, o: 15 };
const PIECE_COLOR = { h: C.hundredDk, t: C.tenDk, o: C.oneDk };

/* --------------------------- tarkiblar --------------------------- */

// Sonni buyumlar bilan ko'rsatadi: yuzlik panellari, o'nlik lentalari, birlik chiroqlari.
// Buyumlar kaskad bilan tushadi (delay = i * 0.04), son pastda suzib turadi.
export function PlaceValueFigure({ h = 0, t = 0, o = 0, captions, total, totalLabel, anim = true, reveal = false, sum }) {
  const groups = [['h', h], ['t', t], ['o', o]].filter(([, n]) => n > 0);
  let index = 0;
  // Yig'indi qismlari: berilmasa razryadlardan hisoblanadi (9 panel -> 900 va h.k.).
  const parts = sum?.parts || groups.map(([kind, n]) => String(n * (kind === 'h' ? 100 : kind === 't' ? 10 : 1)));
  const totalValue = sum?.total ?? String(h * 100 + t * 10 + o);
  return (
    <div>
      <div className="g3-art-stacks">
        {groups.map(([kind, count]) => {
          const Piece = PIECE[kind];
          return (
            <div key={kind} className="g3-art-group">
              <div className="g3-art-row" style={{ maxWidth: kind === 'h' ? 180 : kind === 't' ? 155 : 116 }}>
                {Array.from({ length: count }).map((_, i) => {
                  index += 1;
                  return <Piece key={i} s={PIECE_SIZE[kind]} delay={index * 0.04} anim={anim} />;
                })}
              </div>
              {captions?.[kind] && (
                <span className="g3-art-caption" style={{ color: PIECE_COLOR[kind] }}>{count} {captions[kind]}</span>
              )}
            </div>
          );
        })}
      </div>
      {total != null && (
        <>
          {totalLabel && <div className="g3-art-total-label">{totalLabel}</div>}
          <div className="g3-art-total g3-art-float">{total}</div>
        </>
      )}
      {reveal && parts.length > 0 && (
        <div className="g3-art-sum" aria-live="polite">
          {parts.map((part, i) => (
            <span key={`p${part}`} className="part" style={{ animationDelay: `${i * 0.16}s` }}>
              {i > 0 ? <span className="plus" style={{ marginRight: 7 }}>{sum?.sep || '+'}</span> : null}{part}
            </span>
          ))}
          <span className="eq" style={{ animationDelay: `${parts.length * 0.16}s` }}>=</span>
          <span className="total" style={{ animationDelay: `${parts.length * 0.16 + 0.14}s` }}>{totalValue}</span>
        </div>
      )}
    </div>
  );
}

// Tabло: sonning raqamlari, biri yoritilishi mumkin.
export function NumberPlate({ value, lit = null, dim = null, size }) {
  return (
    <span className="g3-art-plate" style={size ? { fontSize: size } : undefined}>
      {String(value).split('').map((digit, i) => (
        <span key={i} className={lit === i ? 'is-lit g3-art-lit' : dim === i ? 'is-dim' : ''} style={{ animationDelay: `${i * 0.07}s` }}>{digit}</span>
      ))}
    </span>
  );
}

// Raqam-chip razryad nomi bilan (dnd fishkalari uchun).
export function DigitChip({ value, place, kind = 'h' }) {
  return (
    <span className="g3-art-chip" style={{ borderColor: PIECE_COLOR[kind] }}>
      <b>{value}</b>
      {place && <i style={{ color: PIECE_COLOR[kind] }}>{place}</i>}
    </span>
  );
}

// Son o'qi: chap va o'ng chegara, orasida noma'lum joylar.
// values berilsa, noma'lumlar sonning HAQIQIY joyida turadi va to'g'ri javobdan keyin
// savol belgisi o'rniga sonning o'zi chiqadi (metodist qarori 2026-08-06):
// bola 407 nega chap chetda, 472 nega o'ng chetda ekanini ko'radi.
export function NumberLineFigure({ from, to, gaps = 0, values, reveal = false }) {
  const span = to - from || 1;
  const points = values?.length
    ? values.map((value) => ({ value, pos: (value - from) / span }))
    : Array.from({ length: gaps }, (_, i) => ({ value: null, pos: (i + 1) / (gaps + 1) }));

  // Yonma-yon tushgan sonlar ustma-ust chiqmasin: yaqin qo'shni yuqoriroq qatorga ko'chadi.
  const rows = points.reduce((acc, { pos }, i) => {
    const previous = points[i - 1];
    const near = previous && pos - previous.pos < 0.11;
    acc.push(near ? 1 - acc[i - 1] : 0);
    return acc;
  }, []);

  return (
    <div className={`g3-art-line${rows.includes(1) ? ' is-tall' : ''}`}>
      <div className="g3-art-line-rail" />
      {[0, 1].map((edge) => {
        const left = `${edge * 100}%`;
        return (
          <span key={`edge${edge}`}>
            <span className="g3-art-line-tick" style={{ left }} />
            <span className="g3-art-line-mark" style={{ left }}>{edge ? to : from}</span>
          </span>
        );
      })}
      {points.map(({ value, pos }, i) => (
        <span key={`pt${i}`}>
          <span className="g3-art-line-tick is-inner" style={{ left: `${pos * 100}%` }} />
          {reveal && value != null ? (
            <span className="g3-art-line-value" style={{ left: `${pos * 100}%`, top: rows[i] ? -14 : 2, animationDelay: `${i * 0.14}s` }}>
              {value}
            </span>
          ) : (
            <span className="g3-art-line-gap g3-art-lit" style={{ left: `${pos * 100}%`, top: rows[i] ? -12 : 4 }}>?</span>
          )}
        </span>
      ))}
    </div>
  );
}

// MASSIV — ko'paytirishning kanonik modeli: teng qatorlar. 9 x 8 — to'qqiz qator, har
// qatorda sakkizta chiroq. Bola ko'paytmani "teng qo'shiluvchilar" sifatida ko'radi.
export function ArrayFigure({ rows = 1, cols = 1, anim = true }) {
  const dot = rows * cols > 48 ? 7 : 10;
  return (
    <div className="g3-art-array" style={{ gap: dot > 8 ? 5 : 3 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="g3-art-array-row" style={{ gap: dot > 8 ? 5 : 3 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <span key={c} className={anim ? 'g3-art-dot g3-art-drop' : 'g3-art-dot'}
              style={{ width: dot, height: dot, animationDelay: `${(r * cols + c) * 0.012}s` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* --------------------------- tavsifdan chizmaga --------------------------- */
// Bank tavsif beradi, kit chizadi. Tavsif shakllari:
//   { pv: { h, t, o }, captions, total, totalLabel }
//   { plate: '854', lit: 1 }
//   { digit: '9', place: "yuzlik", kind: 'h' }
//   { line: { from: 928, to: 932, values: [929, 930, 931] } } — javobdan keyin sonlar chiqadi
//   { piece: 'h', count: 7 }        — bitta turdagi buyumlar qatori
//   { plates: ['680','608'] }      — tablolar qatori
//   { array: { rows: 9, cols: 8 } } — teng qatorlar (ko'paytirish modeli)
//   sum: { parts: ['900','100'], total: '1000', sep: '+' } — to'g'ri javobdan keyingi yig'indi.
//        parts: [] bersangiz, yig'indi umuman ko'rsatilmaydi.
export function Art({ art, anim = true, reveal = false }) {
  if (!art) return null;
  if (art.pv) {
    return (
      <PlaceValueFigure {...art.pv} captions={art.captions} total={art.total} totalLabel={art.totalLabel}
        anim={anim} reveal={reveal} sum={art.sum} />
    );
  }
  if (art.plate) return <NumberPlate value={art.plate} lit={art.lit} dim={art.dim} />;
  if (art.plates) {
    return (
      <span className="g3-art-row" style={{ gap: 9 }}>
        {art.plates.map((value, i) => (
          <span key={`pl${i}`} className={anim ? 'g3-art-drop' : undefined} style={{ animationDelay: `${i * 0.06}s` }}>
            <NumberPlate value={value} lit={art.litIndexes?.[i]} />
          </span>
        ))}
      </span>
    );
  }
  if (art.digit) return <DigitChip value={art.digit} place={art.place} kind={art.kind} />;
  if (art.line) return <NumberLineFigure {...art.line} reveal={reveal} />;
  if (art.array) return <ArrayFigure {...art.array} anim={anim} />;
  if (art.piece) {
    const Piece = PIECE[art.piece];
    return (
      <span className="g3-art-row" style={{ maxWidth: 150 }}>
        {Array.from({ length: art.count }).map((_, i) => <Piece key={i} s={PIECE_SIZE[art.piece]} delay={i * 0.04} anim={anim} />)}
      </span>
    );
  }
  return null;
}
