// Bir necha darsda takrorlanadigan MATEMATIK chizmalar.
//
// Mavzuga xos sahna (depo, quvur, tramvay) dars faylida qoladi; bu yerda faqat
// matematik yozuvning o'zi turadi, chunki u 12 va 13-darslarda bir xil.
// Ilgari shunday chizmalar har darsda qaytadan chizilardi (CLAUDE.md §5).
import { T } from '../theoryShell/palette.js';
import { FitSvg } from './ui.jsx';

// ---------------------------------------------------------------------------
// Yozma bo'lish ustuni — darslikdagi burchakli yozuv.
//
//   19284 | 6
//  -18    -----
//   ---     3214
//    12
//
// `steps` — har bir qadam: { bring, sub, rest, digit }
//   bring  — shu qadamdagi to'liqsiz bo'linuvchi (masalan '19', keyin '12')
//   sub    — ayiriladigan son ('18')
//   rest   — ayirmadan keyingi qoldiq ('1')
//   digit  — bo'linmaning shu qadamdagi raqami ('3')
// `frame` — nechta qadam ochilgani; `revealAll` hammasini ko'rsatadi.
// ---------------------------------------------------------------------------
export const DivisionColumn = ({
  dividend, divisor, quotient, steps,
  frame = 0, revealAll = false, quotientMask = null, highlightStep = -1,
}) => {
  const cw = 17;                       // bitta raqam kengligi (JetBrains Mono, 22px)
  const left = 56;                     // bo'linuvchi boshlanadigan x
  const barX = left + String(dividend).length * cw + 10;
  const shown = revealAll ? steps.length : Math.max(0, Math.min(frame, steps.length));
  const rowH = 24;

  // Har bir qadamning o'ng qirrasi: to'liqsiz bo'linuvchi qayerda tugaydi.
  // Har qadamda to'liqsiz bo'linuvchining o'ng qirrasi bir raqamga suriladi.
  const laid = steps.reduce((acc, step, index) => {
    const endCol = index === 0 ? String(step.bring).length : acc[index - 1].endCol + 1;
    return [...acc, { ...step, endCol }];
  }, []);

  return (
    <FitSvg viewBox="0 0 520 232">
      {/* bo'linuvchi va bo'luvchi */}
      <text x={left} y="30" fill={T.ink} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace" letterSpacing="1.6">
        {dividend}
      </text>
      <line x1={barX} y1="10" x2={barX} y2="62" stroke={T.ink} strokeWidth="2" />
      <text x={barX + 12} y="30" fill={T.ink} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {divisor}
      </text>
      <line x1={barX} y1="40" x2={barX + 130} y2="40" stroke={T.ink} strokeWidth="2" />
      <text x={barX + 12} y="62" fill={T.success} fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace" letterSpacing="1.6">
        {quotientMask ?? quotient}
      </text>

      {/* qadamlar */}
      {laid.map((step, index) => {
        const on = index < shown;
        const y = 50 + index * rowH * 2;
        const rightEdge = left + step.endCol * cw;
        const subX = rightEdge - String(step.sub).length * cw;
        const restX = rightEdge - String(step.rest).length * cw;
        const hot = index === highlightStep;
          // Nolni ayirish yozilmaydi: bo'linmaga nol qo'yiladi va keyingi raqam
          // tushiriladi. Qoldiq nol bo'lsa, oldingi nol ham yozilmaydi.
          const zeroStep = String(step.sub) === '0';
          const last = index === laid.length - 1;
          const nextDigit = last ? '' : String(dividend)[laid[index + 1].endCol - 1];
          const carried = last
            ? String(step.rest)
            : (String(step.rest) === '0' ? nextDigit : String(step.rest) + nextDigit);
          const carriedX = rightEdge + cw - carried.length * cw;
          return (
            <g key={index} opacity={on ? 1 : 0.2} style={{ transition: 'opacity .4s' }}>
              {!zeroStep && (
                <>
                  <text x={subX - 12} y={y} fill={hot ? T.accent : T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                    −
                  </text>
                  <text x={subX} y={y} fill={hot ? T.accent : T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace" letterSpacing="1.6">
                    {step.sub}
                  </text>
                  <line x1={subX - 4} y1={y + 7} x2={rightEdge + 2} y2={y + 7} stroke={hot ? T.accent : T.ink3} strokeWidth="1.6" />
                </>
              )}
              <text
                x={last ? restX : carriedX}
                y={y + rowH}
                fill={last ? T.success : T.ink}
                fontSize="20"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="1.6"
              >
                {carried}
              </text>
            </g>
        );
      })}
    </FitSvg>
  );
};

// ---------------------------------------------------------------------------
// Bo'linmada nechta raqam bo'lishini ko'rsatadigan chizma: birinchi to'liqsiz
// bo'linuvchi ajratiladi, undan keyingi har raqam bitta o'ringa to'g'ri keladi.
// ---------------------------------------------------------------------------
export const QuotientLengthFigure = ({ dividend, divisor, firstLen, reveal = false }) => {
  const digits = String(dividend).split('');
  const cw = 44;
  const startX = (520 - digits.length * cw) / 2;
  const count = digits.length - firstLen + 1;
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="34" textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="700" fontFamily="JetBrains Mono, monospace">
        {dividend} : {divisor}
      </text>
      <rect
        x={startX - 5}
        y="52"
        width={firstLen * cw + 10}
        height="52"
        rx="12"
        fill={T.cyanSoft}
        stroke={T.cyan}
        strokeWidth="2"
      />
      {digits.map((digit, index) => (
        <text
          key={index}
          x={startX + index * cw + cw / 2}
          y="88"
          textAnchor="middle"
          fill={index < firstLen ? T.cyan : T.ink}
          fontSize="28"
          fontWeight="800"
          fontFamily="JetBrains Mono, monospace"
        >
          {digit}
        </text>
      ))}
      {digits.map((digit, index) => (
        index >= firstLen - 1 && (
          <g key={`m-${index}`}>
            <path d={`M${startX + index * cw + cw / 2} 108 L${startX + index * cw + cw / 2} 128`} stroke={T.accent} strokeWidth="1.8" />
            <circle cx={startX + index * cw + cw / 2} cy="140" r="9" fill={T.accentSoft} stroke={T.accent} strokeWidth="1.8" />
          </g>
        )
      ))}
      {reveal && (
        <text x="260" y="186" textAnchor="middle" fill={T.accent} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {count}
        </text>
      )}
    </FitSvg>
  );
};

// ---------------------------------------------------------------------------
// Tenglashtirish diagrammasi (15-dars).
//
// O'rtacha arifmetik qiymatning ma'nosi — "hamma ustunni bir balandlikka
// keltirish". Baland ustundagi ortiqcha past ustunga quyiladi. Shu sababli
// chizma ikki holatni ko'rsatadi: qanday bo'lgan va tenglashtirilgach qanday.
//
//   bars    — [{ label, value }]
//   level   — bola qo'ygan chiziq balandligi (null bo'lsa chiziq yo'q)
//   target  — haqiqiy o'rtacha
//   settled — hammasi tenglashgan holat
// ---------------------------------------------------------------------------
export const LevelFigure = ({ bars, level = null, target = null, settled = false, unit = '' }) => {
  const base = 196;
  const top = 30;
  const span = base - top;
  const peak = Math.max(...bars.map((bar) => bar.value), level ?? 0, target ?? 0);
  const scale = span / (peak * 1.12);
  const slot = 420 / bars.length;
  const width = Math.min(52, slot - 14);
  const x0 = 50 + (slot - width) / 2;
  const levelY = level === null ? null : base - level * scale;

  return (
    <FitSvg viewBox="0 0 520 232">
      <line x1="40" y1={base} x2="486" y2={base} stroke={T.ink3} strokeWidth="2" />
      {bars.map((bar, index) => {
        const x = x0 + index * slot;
        const barTop = base - bar.value * scale;
        const flatTop = settled && target !== null ? base - target * scale : null;
        const over = levelY !== null && barTop < levelY;
        const under = levelY !== null && barTop > levelY;
        return (
          <g key={index}>
            {settled ? (
              <rect x={x} y={flatTop} width={width} height={base - flatTop} rx="6" fill={T.successSoft} stroke={T.success} strokeWidth="2" />
            ) : (
              <>
                <rect
                  x={x}
                  y={over ? levelY : barTop}
                  width={width}
                  height={base - (over ? levelY : barTop)}
                  rx="6"
                  fill={T.cyanSoft}
                  stroke={T.cyan}
                  strokeWidth="1.8"
                />
                {over && (
                  <rect x={x} y={barTop} width={width} height={levelY - barTop} rx="6" fill="rgba(255,91,53,.22)" stroke={T.accent} strokeWidth="1.8" />
                )}
                {under && (
                  <rect x={x} y={levelY} width={width} height={barTop - levelY} rx="6" fill="rgba(23,59,82,.06)" stroke={T.ink3} strokeWidth="1.4" strokeDasharray="4 4" />
                )}
              </>
            )}
            <text x={x + width / 2} y={base + 20} textAnchor="middle" fill={T.ink3} fontSize="12" fontWeight="700" fontFamily="Manrope, sans-serif">
              {bar.label}
            </text>
            <text
              x={x + width / 2}
              y={(settled ? flatTop : barTop) - 8}
              textAnchor="middle"
              fill={settled ? T.success : T.ink}
              fontSize="14"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {settled ? target : bar.value}
            </text>
          </g>
        );
      })}
      {levelY !== null && !settled && (
        <>
          <line x1="44" y1={levelY} x2="482" y2={levelY} stroke={T.accent} strokeWidth="2.4" strokeDasharray="8 6" />
          <text x="486" y={levelY - 6} textAnchor="end" fill={T.accent} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {level} {unit}
          </text>
        </>
      )}
      {settled && target !== null && (
        <>
          <line x1="44" y1={base - target * scale} x2="482" y2={base - target * scale} stroke={T.success} strokeWidth="2.4" />
          <text x="486" y={base - target * scale - 6} textAnchor="end" fill={T.success} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {target} {unit}
          </text>
        </>
      )}
    </FitSvg>
  );
};

// ---------------------------------------------------------------------------
// Shkala (17-dars): chizg'ich, termometr, spidometr — hammasi bitta chizma.
//
// Katta belgilar sonlar bilan imzolanadi, ular orasidagi kichik belgilar esa
// bo'linmalar. Bir bo'linma qiymati = katta belgilar farqi : bo'linmalar soni.
//
//   interactive — { target, picked, wrongSet, disabled, onPick }: bola belgini
//                 bosib javob beradi, tayyor variantdan tanlamaydi.
// ---------------------------------------------------------------------------
export const ScaleFigure = ({
  min, max, majorEvery, minorPerMajor,
  vertical = false, unit = '', pointer = null, highlight = null,
  interactive = null, showValues = true, caption = null, accentPair = null,
  tube = false, fillTo = null,
}) => {
  const step = majorEvery / minorPerMajor;
  const count = Math.round((max - min) / step);
  const values = Array.from({ length: count + 1 }, (_, index) => min + index * step);
  // `tube` — termometr korpusi. Shkala shishaning ichida turadi, shuning uchun
  // belgilar va sonlar o'ngga va chapga suriladi, quyi chegara esa kolba uchun
  // joy qoldiradi.
  const axisA = vertical ? (tube ? 168 : 196) : 46;
  const axisB = vertical ? 30 : 474;
  const at = (value) => axisA + ((value - min) / (max - min)) * (axisB - axisA);
  const line = vertical ? 250 : 64;
  const gap = Math.abs(axisB - axisA) / Math.max(count, 1);
  // Gorizontal shkala past va keng bo'ladi, shuning uchun karta ham past
  // nisbat oladi — aks holda chizma baland oq quti o'rtasida yo'qolib qolardi.
  // Tik shkalada chizma torroq: viewBox ham torroq olinadi, aks holda telefonda
  // butun kenglikka moslashib, belgilar orasi bir necha pikselga tushib qolardi
  // va barmoq bilan bosib bo'lmasdi.
  const box = vertical ? '150 8 240 228' : '0 0 520 150';
  const tickX = tube ? line + 14 : line;
  const labelX = tube ? line - 24 : line - 12;
  const bulbY = at(min) + 28;
  const fillValue = fillTo ?? highlight ?? null;

  const tick = (value) => {
    const major = Math.abs(value / majorEvery - Math.round(value / majorEvery)) < 1e-9;
    const size = major ? 20 : 10;
    const p = at(value);
    const hot = highlight !== null && Math.abs(value - highlight) < 1e-9;
    const paired = Boolean(accentPair && accentPair.includes(value));
    const stroke = hot ? T.success : paired ? T.accent : major ? T.ink : T.ink3;
    return { major, size, p, hot, paired, stroke };
  };

  return (
    <FitSvg viewBox={box}>
      {tube && (
        <g>
          <rect x={line - 14} y={at(max) - 16} width="28" height={bulbY - at(max) + 16} rx="14" fill="#FFFFFF" stroke="#2E4A5C" strokeWidth="2.6" />
          <circle cx={line} cy={bulbY} r="18" fill={T.accent} stroke="#2E4A5C" strokeWidth="2.6" />
          {fillValue !== null && (
            <rect x={line - 7} y={at(fillValue)} width="14" height={bulbY - at(fillValue)} fill={T.accent} />
          )}
        </g>
      )}
      {vertical && !tube ? (
        <line x1={line} y1={at(min)} x2={line} y2={at(max)} stroke={T.ink} strokeWidth="2.4" />
      ) : vertical ? null : (
        <line x1={at(min)} y1={line} x2={at(max)} y2={line} stroke={T.ink} strokeWidth="2.4" />
      )}
      {values.map((value) => {
        const { major, size, p, hot, paired, stroke } = tick(value);
        return (
          <g key={value}>
            {vertical ? (
              <line x1={tickX} y1={p} x2={tickX + size} y2={p} stroke={stroke} strokeWidth={major ? 2.4 : 1.6} />
            ) : (
              <line x1={p} y1={line} x2={p} y2={line - size} stroke={stroke} strokeWidth={major ? 2.4 : 1.6} />
            )}
            {((major && showValues) || paired || hot) && (
              vertical ? (
                <text x={labelX} y={p + 5} textAnchor="end" fill={hot ? T.success : T.ink2} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                  {value}
                </text>
              ) : (
                <text x={p} y={line + 24} textAnchor="middle" fill={hot ? T.success : paired ? T.accent : T.ink2} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                  {value}
                </text>
              )
            )}
          </g>
        );
      })}
      {unit && (
        <text
          x={vertical ? tickX + 34 : 480}
          y={vertical ? at(max) + 4 : line - 14}
          textAnchor="start"
          fill={T.ink3}
          fontSize="12"
          fontWeight="700"
          fontFamily="Manrope, sans-serif"
        >
          {unit}
        </text>
      )}
      {pointer !== null && (
        vertical ? (
          <g>
            <path d={`M${labelX - 40} ${at(pointer)} l14 -9 v18 z`} fill={T.accent} />
            <text x={labelX - 46} y={at(pointer) + 5} textAnchor="end" fill={T.accent} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">?</text>
          </g>
        ) : (
          <g>
            <path d={`M${at(pointer)} ${line - 30} l-9 -14 h18 z`} fill={T.accent} />
            <text x={at(pointer)} y={line - 50} textAnchor="middle" fill={T.accent} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">?</text>
          </g>
        )
      )}
      {interactive && values.map((value) => {
        const { p } = tick(value);
        const right = Math.abs(value - interactive.target) < 1e-9;
        const bad = Boolean(interactive.wrongSet?.has(value));
        const chosen = interactive.picked !== null && Math.abs(value - interactive.picked) < 1e-9;
        return (
          <g key={`hit-${value}`}>
            {(chosen || bad) && (
              <circle
                cx={vertical ? tickX + 10 : p}
                cy={vertical ? p : line - 10}
                r="9"
                fill={bad ? 'rgba(255,91,53,.18)' : T.successSoft}
                stroke={bad ? T.accent : T.success}
                strokeWidth="2"
              />
            )}
            <rect
              x={vertical ? tickX - 14 : p - gap / 2}
              y={vertical ? p - gap / 2 : line - 34}
              width={vertical ? 54 : gap}
              height={vertical ? gap : 48}
              fill="transparent"
              data-g4-branch="tick"
              data-g4-source-index={value}
              data-g4-correct={right ? 'true' : 'false'}
              style={{ cursor: interactive.disabled ? 'default' : 'pointer' }}
              onClick={() => (interactive.disabled ? null : interactive.onPick(value))}
            />
          </g>
        );
      })}
      {caption && (
        <text x="260" y={vertical ? 224 : 132} textAnchor="middle" fill={T.ink3} fontSize="12.5" fontWeight="700" fontFamily="Manrope, sans-serif">
          {caption}
        </text>
      )}
    </FitSvg>
  );
};
