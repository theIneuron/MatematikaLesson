// Dars06 · Amaliyot 01 — Termometr · 🟢 · read_temp (javob kiritish)
// Vertikal termometr -6°C ko'rsatadi. Bola haroratni o'qib yozadi. To'g'ri javobdan
// keyin suyuqlik darajasi animatsiya bilan to'ldiriladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D01_TEMP = -6, D01_LO = -10, D01_HI = 10;
const D01_T = {
  uz: {
    eyebrow: 'Termometr', setup: "Ko'chada sovuq. Har bo'linma 2 gradus. Ustunni sanab, haroratni toping.",
    ask: "Termometr necha gradus ko'rsatyapti?", label: "Haroratni yozing:",
    correct: "To'g'ri. Termometr -6°C ni ko'rsatyapti — noldan 6 gradus past.",
    wrong: "Maslahat: ustun nol chizig'idan pastda tugayapti — harorat musbatmi yoki manfiy? Har bo'linma bir gradusdan ko'proqni bildirishini ham unutmang.",
  },
  ru: {
    eyebrow: 'Термометр', setup: 'На улице холодно. Каждое деление 2 градуса. Сосчитайте столбик.',
    ask: 'Сколько градусов показывает термометр?', label: 'Запишите температуру (например: -4):',
    correct: 'Верно. Термометр показывает -6°C — на 6 градусов ниже нуля.',
    wrong: 'Подсказка: столбик заканчивается ниже нулевой линии — температура положительная или отрицательная? И помните, что одно деление больше одного градуса.',
  },
};
export default function D06_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [glow, setGlow] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setGlow(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^-?\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D01_TEMP;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setGlow(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D01_TEMP }, correct, meta: { tag: 'read_temp', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  // termometr: 0 tepada (10) → past (-10). ustun balandligi TEMP ga bog'liq
  const H = 200, range = D01_HI - D01_LO;
  const zeroY = ((D01_HI - 0) / range) * H;
  const tempY = ((D01_HI - D01_TEMP) / range) * H;
  const ticks = [];
  for (let v = D01_HI; v >= D01_LO; v -= 2) ticks.push(v);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <svg width="120" height={H + 50} viewBox={`0 0 120 ${H + 50}`}>
          {/* naycha */}
          <rect x="50" y="10" width="20" height={H} rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
          {/* nol chizig'i */}
          <line x1="30" y1={10 + zeroY} x2="90" y2={10 + zeroY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="94" y={14 + zeroY} fontSize="12" fontWeight="800" fill="#64748b" fontFamily="'JetBrains Mono', monospace">0</text>
          {/* bo'linmalar */}
          {ticks.map((v) => { const y = 10 + ((D01_HI - v) / range) * H; return v !== 0 ? <g key={v}><line x1="44" y1={y} x2="50" y2={y} stroke="#cbd5e1" strokeWidth="1.5" /></g> : null; })}
          {/* suyuqlik ustuni — doim -6 da turadi (0 dan tempgacha, pastga) */}
          <rect x="54" y={10 + zeroY} width="12" height={tempY - zeroY} fill={glow ? '#fe5b1a' : '#ff8a52'} style={{ transition: 'fill .5s' }} />
        </svg>
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^-\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="text" placeholder="?"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
