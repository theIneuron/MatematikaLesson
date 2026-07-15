// Dars22 · Amaliyot 03 — Butunlarni ajratib ol · 🔴 · tag: to_mixed_counter
// 23/6. "1 butun ol" tugmasi har bosishda 6/6 ni ayiradi. Boshqa butun chiqmaguncha davom → 3 butun, 5/6 = 3⅚.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

const D03_START = 23, D03_DEN = 6; // 23/6 = 3 butun, 5/6
const D03_T = {
  uz: {
    eyebrow: 'Ajratib ol', setup: "Sardorda 23/6 pitssa bor — har biri olti bo'lakka kesilgan. «1 butun ol» tugmasi bir marta bosilganda olti bo'lakdan bitta to'liq pitssa yig'iladi.",
    ask: "Barcha to'liq pitssalarni yig'ib oling, so'ng tekshiring.",
    btn: '1 butun ol (6/6)', reset: 'Qaytadan', done: "Boshqa to'liq chiqmaydi",
    correct: "To'g'ri. 3 ta to'liq pitssa chiqdi, 5/6 ortdi. Demak 23/6 = 3⅚.",
    wrong: "Maslahat: qolgan bo'laklar oltitaga yetsa, yana bir butun yig'ish mumkin. Yetmay qolgunicha davom eting.",
    rule: "Noto'g'ri → aralash: nechta butun chiqsa — butun qism, qolgan — surat.",
  },
  ru: {
    eyebrow: 'Извлеки', setup: 'У Сардора 23/6 пиццы — каждая нарезана на шесть частей. При нажатии «взять 1 целое» из шести частей собирается одна целая пицца.',
    ask: 'Собери все целые пиццы, затем проверь.',
    btn: 'Взять 1 целое (6/6)', reset: 'Заново', done: 'Больше целого нет',
    correct: 'Верно. Получилось 3 целых пиццы, осталось 5/6. Значит 23/6 = 3⅚.',
    wrong: 'Подсказка: если осталось шесть или больше частей, можно взять ещё целое. Продолжай, пока получается.',
    rule: 'Неправильная → смешанное: сколько целых получилось — целая часть, остаток — числитель.',
  },
};

export default function D22_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [rem, setRem] = useState(D03_START);
  const [wholes, setWholes] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.wholes != null) { setWholes(s.wholes); setRem(D03_START - s.wholes * D03_DEN); } if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(wholes > 0 && !checked); }, [wholes, checked, onReady]);
  const locked = isReview || checked;
  const take = () => { if (locked || rem < D03_DEN) return; setRem((r) => r - D03_DEN); setWholes((w) => w + 1); };
  const reset = () => { if (locked) return; setRem(D03_START); setWholes(0); };
  const check = useCallback(() => {
    const correct = rem < D03_DEN && wholes === Math.floor(D03_START / D03_DEN);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { wholes, rem }, correctAnswer: { wholes: Math.floor(D03_START / D03_DEN), rem: D03_START % D03_DEN }, correct, meta: { tag: 'to_mixed_counter', level: '🔴' } });
  }, [rem, wholes, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const canTake = rem >= D03_DEN && !locked;
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      {/* olingan butunlar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 6px', minHeight: 44, flexWrap: 'wrap' }}>
        {Array.from({ length: wholes }).map((_, i) => <div key={i} className="d22-pop" style={{ width: 40, height: 40, borderRadius: 8, background: '#86efac', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontWeight: 800, color: '#15803d', fontSize: 15 }}>1</div>)}
        {wholes > 0 && <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>+</span>}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{lang === 'uz' ? 'qoldi:' : 'осталось:'}</span><Frac num={String(rem)} den="6" size={22} color="#7c3aed" /></span>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', margin: '6px 0' }}>
        <button type="button" disabled={!canTake} onClick={take} style={{ padding: '12px 18px', borderRadius: 13, border: '2px solid ' + (canTake ? '#22c55e' : '#cbd5e1'), background: canTake ? '#f0fdf4' : '#f8fafc', color: canTake ? '#15803d' : '#cbd5e1', fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 14.5, fontWeight: 800, cursor: canTake ? 'pointer' : 'default' }}>{t.btn}</button>
        {wholes > 0 && !locked && <button type="button" onClick={reset} style={{ padding: '12px 14px', borderRadius: 13, border: '2px solid #d6dae3', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>{t.reset}</button>}
      </div>
      {rem < D03_DEN && !checked && <div style={{ textAlign: 'center', fontSize: 12.5, color: '#16a34a', fontWeight: 700 }}>{t.done} ✓</div>}
      <p style={{ ...S.ask, fontSize: 15 }}>{renderFr(t.ask)}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
