// Dars 4 (3-sinf) · Amaliyot 03 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 79-bet masalasi mavzusi — Toshkent teleminorasi (375 m) va Eyfel minorasi (320 m).
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
      {STARS.map((s, i) => <span key={i} className="g3d4-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
// Ikki minora: balandliklar ustunlar bilan (375 va 320)
const Towers = ({ hA = 375, hB = 320, la = 'Toshkent', lb = 'Eyfel' }) => {
  const H = 120;
  const bar = (h, lbl, col) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800, color: C.glow, textShadow: '0 0 10px rgba(255,184,77,.7)' }}>{h} m</span>
      <div className="g3d4-grow" style={{ width: 44, height: Math.round(H * h / 400), borderRadius: '8px 8px 3px 3px', background: 'linear-gradient(180deg,' + col + ', #1B2A4A)', border: '1.5px solid ' + C.ribbonBd }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase' }}>{lbl}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 34, justifyContent: 'center', alignItems: 'flex-end' }}>
      {bar(hA, la, '#FFB84D')}
      {bar(hB, lb, '#7fd0ff')}
    </div>
  );
};
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
  <div className="g3d4-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d4-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
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
    display: 'block', width: '100%', textAlign: 'left', padding: '14px 14px', borderRadius: 13,
    border: '2px solid ' + bd, background: bg, color: col, fontSize: opts.fs || 17, fontWeight: 800,
    cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, minHeight: 66,
  };
}
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d4-pop { animation: g3d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d4-star { opacity: .3; animation: g3d4tw 3.4s ease-in-out infinite; }
@keyframes g3d4tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d4-grow { transform-origin: bottom; animation: g3d4grow .7s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4grow { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 03 · Qaysi minora baland? (375 va 320) · 🟢 · compare_pick =================== */
const D03_TAG = 'compare_pick', D03_LEVEL = '🟢', D03_CORRECT = 0;
const D03_T = {
  uz: {
    eyebrow: 'Qaysi baland?', setup: "Toshkent teleminorasi 375 metr, Parijdagi Eyfel minorasi esa 320 metr.",
    ask: 'Qaysi minora balandroq?',
    opts: ['Toshkent teleminorasi — 375 m', 'Eyfel minorasi — 320 m', 'Ikkalasi teng'],
    correct: "To'g'ri! 375 > 320: yuzliklar teng (3 = 3), o'nliklar hal qiladi — 7 o'nlik 2 o'nlikdan katta.",
    wrong: "Maslahat: 375 va 320 ni razryadma-razryad solishtiring: yuzliklar teng, unda o'nliklarga qarang.",
    rule: "375 > 320 → Toshkent teleminorasi Eyfel minorasidan baland.",
  },
  ru: {
    eyebrow: 'Что выше?', setup: 'Ташкентская телебашня — 375 метров, а Эйфелева башня в Париже — 320 метров.',
    ask: 'Какая башня выше?',
    opts: ['Ташкентская телебашня — 375 м', 'Эйфелева башня — 320 м', 'Они равны'],
    correct: 'Верно! 375 > 320: сотни равны (3 = 3), решают десятки — 7 десятков больше 2 десятков.',
    wrong: 'Подсказка: сравни 375 и 320 по разрядам: сотни равны, тогда смотри на десятки.',
    rule: '375 > 320 → Ташкентская телебашня выше Эйфелевой.',
  },
};
const D03_ORDER = permFromSeed(3, D03_TAG);
function D04_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D03_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D03_CORRECT, label: t.opts[D03_CORRECT] }, correct, meta: { tag: D03_TAG, level: D03_LEVEL } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><Towers /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div>
        {D03_ORDER.map((i) => (
          <button key={i} type="button" style={optStyle(picked, i, D03_CORRECT, checked, isReview)} disabled={isReview || checked} onClick={() => setPicked(i)}>{t.opts[i]}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_03(props) {
  return (<><style>{FX_CSS}</style><D04_03Impl {...props} /></>);
}
