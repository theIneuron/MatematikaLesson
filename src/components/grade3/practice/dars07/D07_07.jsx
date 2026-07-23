// Dars 7 (3-sinf) · Amaliyot 07 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: darslik 9/12-bet misollari. Xato: 347 − 128 = 229 (qarz olingan o'nlik unutilgan).
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
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 07 · Xatoni toping · 🟡 · find_error_col =================== */
const D10_TAG = 'find_error_col', D10_LEVEL = '🟡', D10_CORRECT = 1;
const D10_T = {
  uz: {
    eyebrow: 'Xatoni toping', setup: "Uchta misol ustunda yechildi. Bittasida xato bor.",
    ask: 'Qaysi yozuv XATO? Uni bosing.',
    opts: ['323 + 571 = 894', '347 − 128 = 229', '243 − 122 = 121'],
    correct: "To'g'ri topdingiz! 347 − 128 = 219 bo'lishi kerak: birlikka qarz berilgach, o'nlik 4 emas, 3 bo'lib qoladi.",
    wrong: "Maslahat: har misolni tekshirib chiqing. Ayirishda qarz olingan bo'lsa, qo'shni xona 1 ga kamayishi kerak — qaysi javobda bu unutilgan?",
    rule: "Qarz olingan xona 1 ga kamayadi: 347 − 128 = 219, 229 emas.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Три примера решены в столбик. В одном — ошибка.',
    ask: 'Какая запись НЕВЕРНА? Нажми на неё.',
    opts: ['323 + 571 = 894', '347 − 128 = 229', '243 − 122 = 121'],
    correct: 'Верно! Должно быть 347 − 128 = 219: после займа для единиц десятков остаётся не 4, а 3.',
    wrong: 'Подсказка: проверь каждый пример. Если при вычитании был заём, соседний разряд должен уменьшиться на 1 — где это забыли?',
    rule: 'Разряд, у которого заняли, уменьшается на 1: 347 − 128 = 219, а не 229.',
  },
};
const D10_ORDER = permFromSeed(3, D10_TAG);
function D07_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D10_CORRECT, label: t.opts[D10_CORRECT] }, correct, meta: { tag: D10_TAG, level: D10_LEVEL } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div>
        {D10_ORDER.map((i) => (
          <button key={i} type="button" style={optStyle(picked, i, D10_CORRECT, checked, isReview, { fs: 18 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{t.opts[i]}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_07(props) {
  return (<><style>{FX_CSS}</style><D07_07Impl {...props} /></>);
}
