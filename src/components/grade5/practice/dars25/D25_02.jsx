// Dars25 · Amaliyot 02 — Yaqin butunga ula · 🟡 · tag: round_whole_match
// Har o'nli sonni eng yaqin butun songa ulash. o'ndan <5 → pastga, ≥5 → yuqoriga.
// 3,48→3 · 3,72→4 · 4,5→5 · 2,19→2 · 5,63→6 (yuzdanli — o'ndanga qarash trapi).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D02_L = { e1: '3,48', e2: '3,72', e3: '4,5', e4: '2,19', e5: '5,63' };
const D02_PAIRS = { e1: '3', e2: '4', e3: '5', e4: '2', e5: '6' };
const D02_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Nodira har bir o'nli sonni eng yaqin butun songa yaxlitladi. Har sonni to'g'ri butuniga ulang.",
    ask: "Chapdagi sonni tanlang, keyin uning yaxlit butunini o'ngdan bosing:",
    correct: "To'g'ri. Har sonda verguldan keyingi birinchi raqamga qarab yaxlitladingiz.",
    wrong: "Har son ikki butun orasida turibdi. Qaysi butunga yaqinroq?",
    rule: "Butungacha yaxlitlash: o'ndan xonasiga qarang. 4,5 → 5.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Нодира округлила каждое десятичное число до ближайшего целого. Соедини каждое число с верным целым.',
    ask: 'Выберите число слева, затем нажмите его округлённое целое справа:',
    correct: 'Верно. Смотрели на первую цифру после запятой каждого числа.',
    wrong: 'Каждое число лежит между двумя целыми. К какому целому оно ближе?',
    rule: 'Округление до целого: смотри на разряд десятых. 4,5 → 5.',
  },
};

export default function D25_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const left = ['e1', 'e2', 'e3', 'e4', 'e5'];
  const right = ['4', '2', '5', '6', '3'];
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 5;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = left.every((l) => map[l] === D02_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D02_PAIRS, correct, meta: { tag: 'round_whole_match', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {left.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#2563eb'; bg = '#eff6ff'; }
            if (done) { bd = '#93c5fd'; bg = '#f0f6ff'; }
            if (checked && done) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ width: 92, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none', ...S.mono, fontSize: 21, fontWeight: 800, color: '#1f2430', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{D02_L[l]}{done ? <span style={{ fontSize: 15, color: '#94a3b8' }}>→</span> : null}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {right.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 60, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{r}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
