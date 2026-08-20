// 4-sinf darslarining takrorlanadigan chizma bloklari.
//
// Nega umumiy modulda: qoida kartasi, qadamlar ro'yxati, teng o'lchamli
// kartochkalar qatori va qism-butun tasmasi 42-51 darslarning deyarli
// hammasida uchraydi. Har darsda nusxalansa, bitta tuzatish o'n joyda
// qilinardi (CLAUDE.md §5). Mavzuga xos chizma darsning o'z faylida qoladi.
import { T } from '../theoryShell/palette.js';
import { FitSvg } from './ui.jsx';

const INK_SOFT = 'rgba(23,59,82,.12)';

// ---------------------------------------------------------------------------
// Plita — tenglama yoki ifodaning bir bo'lagi.
// kind: known (havorang) | unknown (aksent) | result (yashil) | sign (belgi)
// ---------------------------------------------------------------------------
export const Plate = ({ x, y, w, h, text, kind = 'known', lit = false, size = 27 }) => {
  if (kind === 'sign') {
    return (
      <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" fill={T.ink2} fontSize={size - 2} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {text}
      </text>
    );
  }
  const tone = kind === 'unknown' ? T.accent : kind === 'result' ? T.success : T.cyan;
  const fill = kind === 'unknown' ? T.accentSoft : kind === 'result' ? T.successSoft : T.cyanSoft;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="13" fill={fill} stroke={tone} strokeWidth={lit ? 3 : 1.8} />
      <text x={x + w / 2} y={y + h / 2 + size / 2.6} textAnchor="middle" fill={tone} fontSize={size} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {text}
      </text>
    </g>
  );
};

// Chizma ostidagi kichik izoh.
export const Caption = ({ x, y, text, tone = T.ink3, size = 13 }) => (
  <text x={x} y={y} textAnchor="middle" fill={tone} fontSize={size} fontWeight="750" fontFamily="Manrope, sans-serif">
    {text}
  </text>
);

// ---------------------------------------------------------------------------
// Teng o'lchamli kartochkalar qatori: variantlarni yonma-yon solishtirish.
// Ramkalar bir xil o'lchamda va markazda turadi (metodist talabi).
// `records` — matn massivi; ko'p qatorli matn uchun `\n` ishlatiladi.
// ---------------------------------------------------------------------------
export const RecordRow = ({
  records, picked = null, solved = false, correctIndex = -1,
  width = 760, cardW = 200, cardH = 104, gap = 20, top = 46, numbered = true, size = 19,
}) => {
  const total = records.length * cardW + (records.length - 1) * gap;
  const x0 = (width - total) / 2;
  const height = top + cardH + (numbered ? 62 : 20);
  return (
    <FitSvg viewBox={`0 0 ${width} ${height}`}>
      {records.map((text, index) => {
        const state = solved && index === correctIndex
          ? 'right'
          : picked === index && !solved ? 'wrong' : 'idle';
        const tone = state === 'right' ? T.success : state === 'wrong' ? T.accent : T.ink3;
        const fill = state === 'right' ? T.successSoft : state === 'wrong' ? '#FFF6F3' : '#FBFDF7';
        const x = x0 + index * (cardW + gap);
        const lines = String(text).split('\n');
        return (
          <g key={index}>
            <rect x={x} y={top} width={cardW} height={cardH} rx="16" fill={fill} stroke={tone} strokeWidth={state === 'idle' ? 1.8 : 3} />
            {lines.map((line, lineIndex) => (
              <text
                key={lineIndex}
                x={x + cardW / 2}
                y={top + cardH / 2 + 7 - (lines.length - 1) * 13 + lineIndex * 26}
                textAnchor="middle"
                fill={T.ink}
                fontSize={size}
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
              >
                {line}
              </text>
            ))}
            {numbered && (
              <text x={x + cardW / 2} y={top + cardH + 36} textAnchor="middle" fill={tone} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {index + 1}
              </text>
            )}
          </g>
        );
      })}
    </FitSvg>
  );
};

// ---------------------------------------------------------------------------
// Qism va butun tasmasi.
//   mode 'part'  — butun ma'lum, bir qism noma'lum;
//   mode 'whole' — ikki qism ma'lum, butun noma'lum.
// `frame` kadrlarni ochadi, `solvedValue` javobni qo'yadi.
// ---------------------------------------------------------------------------
export const BarModel = ({
  mode = 'part', whole, known, unknownLabel = 'x', frame = 4, solvedValue = null,
  wholeLabel, partLabel, formula = null,
}) => {
  const x0 = 70;
  const x1 = 590;
  const width = x1 - x0;
  const share = mode === 'part' && Number(whole) > 0
    ? Math.min(0.86, Math.max(0.14, Number(known) / Number(whole)))
    : 0.44;
  const split = x0 + width * share;
  const done = solvedValue !== null;
  return (
    <FitSvg viewBox="0 0 660 230">
      <g opacity={frame >= 1 ? 1 : 0.25}>
        <rect x={x0} y={44} width={width} height={34} rx="10" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
        <text x={(x0 + x1) / 2} y={68} textAnchor="middle" fill={T.cyan} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {mode === 'part' ? whole : (done ? String(solvedValue) : unknownLabel)}
        </text>
        {wholeLabel && <Caption x={(x0 + x1) / 2} y={34} text={wholeLabel} />}
      </g>

      <g opacity={frame >= 2 ? 1 : 0.25}>
        <rect x={x0} y={104} width={split - x0} height={44} rx="10" fill="rgba(149,201,61,.22)" stroke={T.lime} strokeWidth="1.8" />
        <text x={(x0 + split) / 2} y={133} textAnchor="middle" fill="#4C6B18" fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {known}
        </text>
        <rect
          x={split}
          y={104}
          width={x1 - split}
          height={44}
          rx="10"
          fill={done ? T.successSoft : T.accentSoft}
          stroke={done ? T.success : T.accent}
          strokeWidth={frame >= 3 ? 3 : 1.8}
          strokeDasharray={done ? undefined : '7 5'}
        />
        <text x={(split + x1) / 2} y={133} textAnchor="middle" fill={done ? T.success : T.accent} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {mode === 'part' ? (done ? String(solvedValue) : unknownLabel) : whole}
        </text>
        {partLabel && <Caption x={(x0 + x1) / 2} y={170} text={partLabel} />}
      </g>

      {frame >= 3 && (
        <g>
          <rect x={x0} y={178} width={width} height={40} rx="12" fill={done ? T.successSoft : '#FBFDF7'} stroke={done ? T.success : INK_SOFT} strokeWidth="1.6" />
          <text x={(x0 + x1) / 2} y={205} textAnchor="middle" fill={done ? T.success : T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {formula ?? (mode === 'part'
              ? `${unknownLabel} = ${whole} - ${known}${done ? ` = ${solvedValue}` : ''}`
              : `${unknownLabel} = ${known} + ${whole}${done ? ` = ${solvedValue}` : ''}`)}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// ---------------------------------------------------------------------------
// QOIDA kartasi. Matn ko'p bo'lgani uchun HTML: balandlik kontentga qarab.
// `rows` — { tone, head, body, formula } ro'yxati; `frame` ularni ochadi.
// ---------------------------------------------------------------------------
export const RuleRows = ({ rows, frame = 99 }) => (
  <div className="kit-rule">
    {rows.map((row, index) => (
      <div key={row.head} className={`kit-rule-row ${frame >= index + 1 ? 'is-open' : ''}`}>
        <span className="kit-rule-num" style={{ background: row.tone ?? T.cyan }}>{index + 1}</span>
        <div>
          <strong style={{ color: row.tone ?? T.cyan }}>{row.head}</strong>
          <p>{row.body}</p>
        </div>
        {row.formula && <b className="kit-rule-formula">{row.formula}</b>}
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Yechim qadamlari ro'yxati: "xatoni top" ekranlari uchun.
// `badIndex` — javob berilgach yonadigan noto'g'ri qator.
// ---------------------------------------------------------------------------
export const StepList = ({ steps, badIndex = -1, revealBad = false, hint = null, showHint = false, badLabel }) => (
  <div className="kit-steps">
    {steps.map((step, index) => {
      const bad = revealBad && index === badIndex;
      return (
        <div key={index} className={`kit-step ${bad ? 'is-bad' : ''}`}>
          <span className="kit-step-num">{index + 1}</span>
          <b>{step}</b>
          {bad && badLabel && <i>{badLabel}</i>}
        </div>
      );
    })}
    {showHint && hint && <p className="kit-step-hint">{hint}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// Qadamlar taxtasi: har qadam alohida qatorda, oxirgi qator — javob.
// Oraliq qiymat va javob boshqa rangda, shuning uchun "oraliq javob emas"
// g'oyasi chizmaning o'zida ko'rinadi.
//
// `rows` — { label, expr, kind } ro'yxati; kind: 'mid' yoki 'final'.
// `frame` qatorlarni ketma-ket ochadi, `solvedValue` javobni qo'yadi.
// ---------------------------------------------------------------------------
export const StepRows = ({ rows, frame = 99, solvedValue = null, width = 660 }) => {
  const height = 34 + rows.length * 58;
  return (
    <FitSvg viewBox={`0 0 ${width} ${height}`}>
      {rows.map((row, index) => {
        const y = 20 + index * 58;
        const open = frame >= index + 1;
        const done = row.kind === 'final' && solvedValue !== null;
        const tone = row.kind === 'final' ? (done ? T.success : T.accent) : T.cyan;
        const fill = row.kind === 'final' ? (done ? T.successSoft : T.accentSoft) : T.cyanSoft;
        return (
          <g key={index} opacity={open ? 1 : 0.24}>
            <rect
              x={44}
              y={y}
              width={width - 88}
              height={46}
              rx="13"
              fill={fill}
              stroke={tone}
              strokeWidth={row.kind === 'final' ? 2.4 : 1.6}
            />
            <text x={62} y={y + 30} fill={tone} fontSize="12" fontWeight="800" letterSpacing="1" fontFamily="Manrope, sans-serif">
              {row.label}
            </text>
            <text x={width - 60} y={y + 31} textAnchor="end" fill={T.ink} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.kind === 'final' && solvedValue !== null ? `${row.expr} = ${solvedValue}` : row.expr}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};
