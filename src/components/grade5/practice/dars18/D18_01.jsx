// Dars18 · Amaliyot 01 — Sonni joylashtir · 🟢 · tag: sub_place_tile
// 6/7 − 2/7 = 4/7. Yangi mexanika: suratni katakka SONNI BOSIB joylashtirish (yozish emas).
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
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

// bar: n katak. shaded tasi bo'yalgan; reveal bo'lganda remove[] indeksli bo'laklar chetga chiqib yo'qoladi.
function Bar({ n, shaded, remove = [], reveal = false, w = 252, h = 40 }) {
  const cw = w / n, rm = new Set(remove);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={'b' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      ))}
      {Array.from({ length: shaded }).map((_, i) => {
        const gone = reveal && rm.has(i);
        return <rect key={'s' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"
          style={{ transform: gone ? 'translateY(-16px)' : 'none', opacity: gone ? 0 : 1, transition: `transform .7s ease ${(rm.has(i) ? 0.2 + i * 0.18 : 0).toFixed(2)}s, opacity .7s ease ${(rm.has(i) ? 0.2 + i * 0.18 : 0).toFixed(2)}s` }} />;
      })}
    </svg>
  );
}

const D01_ANS = 4;                 // 6/7 − 2/7 = 4/7
const D01_TILES = [8, 4, 3, 5, 2]; // 8 = qo'shib yuborish xatosi; to'g'risi 4
const D01_T = {
  uz: {
    eyebrow: "Tug'ilgan kun", setup: "Laylo tug'ilgan kuniga tayyorlangan tortning 6/7 qismi turardi. Kelgan mehmonlarga u 2/7 qismini uzatdi.",
    ask: 'Layloda tortning qancha qismi qoldi? 6/7 − 2/7 = ?/7', label: "Katakka qo'yish uchun sonni bosing:",
    correct: "To'g'ri. Suratlarni ayirdik: 6 − 2 = 4, maxraj 7 o'sha. Demak 6/7 − 2/7 = 4/7.",
    wrong: "Maslahat: rasmda avval nechta bo'lak bor edi, nechtasi uzatildi? Qolganini bo'laklardan sanab ko'ring.",
    rule: "Bir xil maxrajli kasrlarni ayirishda suratlarni ayiramiz, maxraj o'zgarmaydi.",
  },
  ru: {
    eyebrow: 'День рождения', setup: 'На день рождения Лайло осталось 6/7 торта. Пришедшим гостям она передала 2/7.',
    ask: 'Сколько торта осталось у Лайло? 6/7 − 2/7 = ?/7', label: 'Нажми число, чтобы поставить его в клетку:',
    correct: 'Верно. Вычли числители: 6 − 2 = 4, знаменатель 7 тот же. Значит 6/7 − 2/7 = 4/7.',
    wrong: 'Подсказка: сколько частей было сначала и сколько передали? Сосчитай оставшиеся части по рисунку.',
    rule: 'При вычитании дробей с равным знаменателем вычитаем числители, знаменатель не меняем.',
  },
};

export default function D18_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setPick(sa.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: D01_TILES.map((n) => ({ id: String(n), label: String(n) })), studentAnswer: { value: pick }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'sub_place_tile', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : (pick != null ? '#2563eb' : '#cbd5e1');
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } svg [style] { transition: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '10px 0 6px' }}>
        <Bar n={7} shaded={6} remove={[4, 5]} reveal={reveal} />
        {reveal && <span className="d18-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 17, fontWeight: 800, color: '#0f766e' }}>=<Frac num="4" den="7" size={19} color="#0f766e" /></span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ ...S.mono, fontSize: 16, fontWeight: 700, color: '#64748b' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 56, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, borderRadius: 11, border: '2px ' + (pick != null ? 'solid' : 'dashed') + ' ' + bd, color: pick != null ? '#1f2430' : '#c2c8d2', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }}>{pick != null ? pick : '?'}</div>
          <div style={{ width: 60, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>7</div>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '12px 0 6px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D01_TILES.map((n) => {
          const on = pick === n;
          let bdt = '#cbd5e1', bg = '#fff', col = '#334155';
          if (on) { bdt = '#2563eb'; bg = '#eff6ff'; col = '#1e40af'; }
          if (checked && on) { const ok = n === D01_ANS; bdt = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = bdt; }
          return <button key={n} type="button" disabled={locked} onClick={() => setPick(n)} style={{ width: 48, height: 48, borderRadius: 12, border: '2px solid ' + bdt, background: bg, color: col, fontSize: 22, fontWeight: 800, cursor: locked ? 'default' : 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
