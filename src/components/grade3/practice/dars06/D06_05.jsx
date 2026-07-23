// Dars 6 (3-sinf) · Amaliyot 05 — mustaqil topshiriq fayli (grade2 naqshi).
// Yo'nalish konsepti: o'qda chapda — kichik, o'ngda — katta.
// 250 dan chapda faqat undan kichik son yotadi: 230.
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Lumo — Bit shahri) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 24%, #4a2342 0%, #261335 58%, #130b23 100%)',
  stageBd: '#4A2A48', sink: '#F3E9F2', sink2: '#C9A9C6', stile: '#2a1530',
  glow: '#FFB84D', glowDk: '#E67E22', ribbon: '#1B2A4A', ribbonBd: '#3A4E78',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="g3d6-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
// Son o'qi: katta belgilar — yuzlik (label bilan), kichik belgilar — o'nlik; strelka-nuqta.
function NumLine({ lo, hi, marks = [], dot = null, dotLabel = null, seg = null }) {
  const W = 560, X0 = 40, X1 = 520, LINE_Y = 56;
  const xOf = (v) => X0 + (X1 - X0) * ((v - lo) / (hi - lo));
  return (
    <svg viewBox={`0 0 ${W} 96`} style={{ width: '100%', display: 'block' }} aria-hidden="true">
      {seg && <rect x={xOf(seg[0])} y={LINE_Y - 16} width={xOf(seg[1]) - xOf(seg[0])} height={32} rx={8} fill="rgba(255,184,77,.18)" stroke="rgba(255,184,77,.55)" strokeWidth="1.5" />}
      <line x1={X0 - 14} y1={LINE_Y} x2={X1 + 14} y2={LINE_Y} stroke={C.sink2} strokeWidth="2.5" />
      <polygon points={`${X1 + 22},${LINE_Y} ${X1 + 10},${LINE_Y - 5} ${X1 + 10},${LINE_Y + 5}`} fill={C.sink2} />
      {/* kichik belgilar — har o'nlik */}
      {Array.from({ length: Math.round((hi - lo) / 10) + 1 }).map((_, i) => {
        const v = lo + i * 10;
        const big = v % 100 === 0;
        return <line key={i} x1={xOf(v)} y1={LINE_Y - (big ? 12 : 6)} x2={xOf(v)} y2={LINE_Y + (big ? 12 : 6)} stroke={big ? C.sink : 'rgba(243,233,242,.5)'} strokeWidth={big ? 3 : 1.5} />;
      })}
      {/* yuzlik yorliqlari */}
      {Array.from({ length: Math.floor(hi / 100) - Math.ceil(lo / 100) + 1 }).map((_, i) => {
        const v = (Math.ceil(lo / 100) + i) * 100;
        return <text key={v} x={xOf(v)} y={LINE_Y + 32} textAnchor="middle" fill={C.sink} fontSize="16" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{v}</text>;
      })}
      {/* qo'shimcha harfli belgilar */}
      {marks.map(([v, lbl]) => (
        <g key={lbl}>
          <circle cx={xOf(v)} cy={LINE_Y} r="6" fill="#7fd0ff" />
          <text x={xOf(v)} y={LINE_Y - 20} textAnchor="middle" fill="#7fd0ff" fontSize="16" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{lbl}</text>
        </g>
      ))}
      {/* strelka-nuqta */}
      {dot != null && (
        <g className="g3d6-pop">
          <circle cx={xOf(dot)} cy={LINE_Y} r="10" fill="rgba(255,184,77,.3)" />
          <circle cx={xOf(dot)} cy={LINE_Y} r="5.5" fill={C.glow} />
          <polygon points={`${xOf(dot)},${LINE_Y - 26} ${xOf(dot) - 6},${LINE_Y - 38} ${xOf(dot) + 6},${LINE_Y - 38}`} fill={C.glow} />
          {dotLabel && <text x={xOf(dot)} y={LINE_Y - 44} textAnchor="middle" fill={C.glow} fontSize="16" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{dotLabel}</text>}
        </g>
      )}
    </svg>
  );
}
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 17, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 18.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="g3d6-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d6-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = C.paper, bd = C.line, col = '#374151';
  if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
  if (show) { const ok = i === correctIdx; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: 'center', padding: '14px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 22, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: "'JetBrains Mono', monospace", minHeight: 66,
  };
}
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d6-pop { animation: g3d6pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d6pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d6-star { opacity: .3; animation: g3d6tw 3.4s ease-in-out infinite; }
@keyframes g3d6tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 05 · Chapda qaysi son? (230) · 🟡 · line_direction =================== */
const D01_TAG = 'line_direction', D01_LEVEL = '🟡', D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: "Chapmi, o'ngmi?", setup: "O'qda sonlar tartib bilan joylashadi: chapda kichiklari, o'ngda kattalari. Nuqta 250 da turibdi.",
    ask: "Qaysi son o'qda 250 dan CHAP tomonda yotadi?",
    opts: ['230', '280', '255'],
    correct: "To'g'ri! 230 < 250, demak u o'qda 250 dan chapda yotadi. 280 va 255 esa o'ngda.",
    wrong: "Maslahat: chapda — 250 dan KICHIK sonlar. Har variantni 250 bilan taqqoslang.",
    rule: "O'qda chap tomon — kichik sonlar, o'ng tomon — katta sonlar.",
  },
  ru: {
    eyebrow: 'Слева или справа?', setup: 'На прямой числа стоят по порядку: слева меньшие, справа большие. Точка стоит на 250.',
    ask: 'Какое число лежит на прямой СЛЕВА от 250?',
    opts: ['230', '280', '255'],
    correct: 'Верно! 230 < 250, значит, оно лежит слева от 250. А 280 и 255 — справа.',
    wrong: 'Подсказка: слева — числа МЕНЬШЕ 250. Сравни каждый вариант с 250.',
    rule: 'На прямой левая сторона — меньшие числа, правая — большие.',
  },
};
const D01_ORDER = permFromSeed(3, D01_TAG);
function D06_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D01_CORRECT, label: t.opts[D01_CORRECT] }, correct, meta: { tag: D01_TAG, level: D01_LEVEL } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><NumLine lo={200} hi={300} dot={250} dotLabel={'250'} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {D01_ORDER.map((i) => (
          <button key={i} type="button" style={optStyle(picked, i, D01_CORRECT, checked, isReview, { half: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{t.opts[i]}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D06_05(props) {
  return (<><style>{FX_CSS}</style><D06_05Impl {...props} /></>);
}
