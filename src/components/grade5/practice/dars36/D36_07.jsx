// Dars36 · Amaliyot 07 — Balandlikni top · 🔴 · tag: tri_inverse_h
// Yuza 12, asos 6. S×2 = asos×balandlik → 24 = 6×h → h = 4. Teskari masala. Ishlangan yechim reveal.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: indigo
const HUE = { d: '#4338ca', l: '#eef2ff', m: '#c7d2fe', deep: '#3730a3', fill: '#6366f1' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d36-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D07_ANS = 4;
const D07_T = {
  uz: {
    eyebrow: 'Teskari masala', setup: "Uchburchak yuzasi 12 sm², asosi 6 sm. Balandligi noma'lum.",
    ask: 'Balandligini toping (sm):',
    correct: "To'g'ri. S × 2 = asos × balandlik → 12 × 2 = 24; 24 : 6 = 4.",
    wrong: "Yuza formulada 2 ga bo'lingan. Berilgan yuza to'liq ko'paytmami yoki uning yarmimi? Shundan boshlab noma'lum tomonni izlang.",
    rule: "Balandlik = (yuza × 2) : asos.",
    lS: 'S', lB: 'asos', lH: 'balandlik',
  },
  ru: {
    eyebrow: 'Обратная задача', setup: 'Площадь треугольника 12 см², основание 6 см. Высота неизвестна.',
    ask: 'Найди высоту (см):',
    correct: 'Верно. S × 2 = основание × высота → 12 × 2 = 24; 24 : 6 = 4.',
    wrong: 'В формуле площадь делится на 2. Данная площадь — это полное произведение или его половина? Отсюда ищи неизвестную сторону.',
    rule: 'Высота = (площадь × 2) : основание.',
    lS: 'S', lB: 'основание', lH: 'высота',
  },
};

export default function D36_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value).replace('.', ',')); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+([.,]\d+)?$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.replace(',', '.'));
    const correct = Math.abs(num - D07_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: num }, correctAnswer: { value: D07_ANS }, correct, meta: { tag: 'tri_inverse_h', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : HUE.d;
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d36-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, margin: '12px 0', padding: '12px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 800, color: HUE.deep }}>{t.lS}</div><div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>12</div></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 800, color: HUE.deep }}>{t.lB}</div><div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>6</div></div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 800, color: HUE.deep }}>{t.lH}</div><div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: HUE.d }}>{revealed ? '4' : '?'}</div></div>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151' }}>h =</span>
        <input value={val} onChange={(e) => { const p = e.target.value.replace(/[^\d.,]/g, '').replace(/\./g, ',').split(','); setVal((p.length > 1 ? p[0] + ',' + p.slice(1).join('') : p[0]).slice(0, 5)); }} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151' }}>sm</span>
      </div>
      {revealed && (
        <div className="d36-pop" style={{ ...S.mono, textAlign: 'center', marginTop: 12, padding: '10px', borderRadius: 12, fontSize: 15, fontWeight: 800, color: HUE.d, background: HUE.l, border: '1.5px solid ' + HUE.m }}>12 × 2 = 24 → 24 : 6 = 4</div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
