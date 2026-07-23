// Dars 10 (3-sinf) · Amaliyot 06 — mustaqil topshiriq fayli (grade5 dars04 formati).
// Manba: darslik 10-bet 1-mashq (0 va 1 bilan ko'paytirish: 99 · 0) · grade5 zero_rule formati.
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
      {STARS.map((s, i) => <span key={i} className="g3d3-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const Neon = ({ text, size = 40 }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ padding: '10px 22px', borderRadius: 14, background: '#152342', border: '1.5px solid ' + C.ribbonBd, boxShadow: 'inset 0 0 18px rgba(255,184,77,.22)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: size, fontWeight: 800, letterSpacing: 6, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)' }}>{text}</span>
    </div>
  </div>
);
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
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
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
    display: 'block', width: '100%', textAlign: 'center', padding: '14px 14px', borderRadius: 13,
    border: '2px solid ' + bd, background: bg, color: col, fontSize: opts.fs || 20, fontWeight: 800,
    cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, minHeight: 66,
    fontFamily: "'JetBrains Mono', monospace",
  };
}
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d3-pop { animation: g3d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d3-star { opacity: .3; animation: g3d3tw 3.4s ease-in-out infinite; }
@keyframes g3d3tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 06 · Nol bilan ko'paytirish (99 × 0) · 🟡 · zero_rule =================== */
// Chalg'ituvchilar: 99 (o'zgarmaydi deb o'ylash — bu ×1 qoidasi), 1.
const D01_TAG = 'zero_rule', D01_LEVEL = '🟡', D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: "Nol qoidasi", setup: "Displeyda g'alati misol: 99 × 0. Katta son, lekin nol marta olingan!",
    ask: "99 × 0 nechaga teng?",
    opts: ['0', '99', '1'],
    correct: "To'g'ri! Har qanday sonni 0 ga ko'paytirsak 0 chiqadi: 99 ni nol marta olsak — hech narsa yo'q.",
    wrong: "Maslahat: 99 × 0 — bu 99 ni NOL marta olish. Bitta ham olmasak, qancha bo'ladi? (99 × 1 bo'lsa edi, o'zgarmasdi.)",
    rule: "Nolga ko'paytirish doim nol: 99 × 0 = 0. Birga ko'paytirish son o'zini beradi: 84 × 1 = 84.",
  },
  ru: {
    eyebrow: 'Правило ноля', setup: 'На дисплее странный пример: 99 × 0. Число большое, но взято ноль раз!',
    ask: 'Чему равно 99 × 0?',
    opts: ['0', '99', '1'],
    correct: 'Верно! Любое число, умноженное на 0, даёт 0: если взять 99 ноль раз — не будет ничего.',
    wrong: 'Подсказка: 99 × 0 — это взять 99 НОЛЬ раз. Если не взять ни одного, сколько будет? (Вот 99 × 1 не изменилось бы.)',
    rule: 'Умножение на ноль всегда ноль: 99 × 0 = 0. Умножение на один даёт само число: 84 × 1 = 84.',
  },
};
const D01_ORDER = permFromSeed(3, D01_TAG);
function D10_06Impl(props) {
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
      <Stage><Neon text="99 × 0" size={32} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div>
        {D01_ORDER.map((i) => (
          <button key={i} type="button" style={optStyle(picked, i, D01_CORRECT, checked, isReview)} disabled={isReview || checked} onClick={() => setPicked(i)}>{t.opts[i]}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D10_06(props) {
  return (<><style>{FX_CSS}</style><D10_06Impl {...props} /></>);
}
