// Dars08 · Amaliyot 10 — Kub qutisi masala · 🔴 · Madina · tag: cube_context
// Qirrasi 5 sm kub quti. Hajmi = 5³ = 125 sm³. 3D quti + kiritish + vau.
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
const RuleChip = ({ text }) => (
  <div className="d8-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// daraja ko'rsatkichini yuqori indeks qilib chizish
const Pow = ({ base, exp, size = 30, color = '#1f2430' }) => (
  <span style={{ ...S.mono, fontWeight: 800, color }}>
    <span style={{ fontSize: size }}>{base}</span><sup style={{ fontSize: size * 0.6 }}>{exp}</sup>
  </span>
);

const D10_EDGE = 5, D10_ANS = 125;
const D10_T = {
  uz: {
    eyebrow: 'Masala', setup: "Madinaning sovg'a qutisi kub shaklida, qirrasi 5 sm.",
    ask: 'Qutining hajmi necha sm³?', label: 'Hajmni yozing:',
    correct: "To'g'ri. Hajm = 5³ = 5 × 5 × 5 = 125 sm³.",
    wrong: "Maslahat: kub hajmi — qirrasining kubi, ya'ni qirrani uch marta o'zaro ko'paytirish. Bu qo'shish emas.",
    rule: "Kubning hajmi qirrasining kubiga teng: V = a³.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Подарочная коробка Мадины кубическая, ребро 5 см.',
    ask: 'Каков объём коробки в см³?', label: 'Запишите объём:',
    correct: 'Верно. Объём = 5³ = 5 × 5 × 5 = 125 см³.',
    wrong: 'Подсказка: объём куба — куб ребра, то есть ребро умножается на себя три раза. Это не сложение.',
    rule: 'Объём куба равен кубу ребра: V = a³.',
  },
};
export default function D08_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 400], [2, 1200]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'cube_context', level: '🔴' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const conf = ['#f59e0b', '#fe5b1a', '#10b981', '#ec4899', '#7c3aed'];
  const cubeC = ph >= 1 ? '#fe5b1a' : '#94a3b8';
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d8-confetti { animation: d8conf .9s ease-out both; }
        @keyframes d8conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d8-pop, .d8-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* 3D kub quti (SVG izometrik) */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0', position: 'relative' }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* yuqori yuza */}
          <polygon points="45,40 105,40 125,58 65,58" fill={ph >= 1 ? '#ffb488' : '#e2e8f0'} stroke={cubeC} strokeWidth="2" style={{ transition: 'fill .5s' }} />
          {/* old yuza */}
          <polygon points="45,40 65,58 65,118 45,100" fill={ph >= 1 ? '#ff8a52' : '#cbd5e1'} stroke={cubeC} strokeWidth="2" style={{ transition: 'fill .5s' }} />
          {/* o'ng yuza */}
          <polygon points="65,58 125,58 125,118 65,118" fill={ph >= 1 ? '#fb7233' : '#d1d5db'} stroke={cubeC} strokeWidth="2" style={{ transition: 'fill .5s' }} />
          {/* qirra yozuvi */}
          <text x="95" y="138" fontSize="13" fontWeight="800" fill="#b83d0e" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">5 sm</text>
          <text x="30" y="75" fontSize="13" fontWeight="800" fill="#b83d0e" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">5</text>
        </svg>
        {ph >= 2 && <div style={{ position: 'absolute', left: '50%', top: '40%' }}>{Array.from({ length: 12 }).map((_, i) => { const ang = (i / 12) * Math.PI * 2; return <span key={i} className="d8-confetti" style={{ position: 'absolute', width: 7, height: 7, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 60 + 'px', '--dy': Math.sin(ang) * 40 + 'px', animationDelay: (i * 0.02) + 's' }} />; })}</div>}
      </div>
      <div style={{ textAlign: 'center', margin: '2px 0 6px' }}>
        {ph >= 1 ? <span className="d8-pop" style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#1a7f43' }}>5 × 5 × 5 = 125 sm³</span> : <Pow base="5" exp="3" size={28} />}
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 150, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
