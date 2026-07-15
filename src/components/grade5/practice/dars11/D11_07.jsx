// Dars11 · Amaliyot 07 — Tezlik kasri · 🔴 · speed_fraction (kasr kiritish)
// Halima 35 daqiqada 2 km. 1 daqiqada? 2/35 km. Ikki maydonli kiritish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// ikki maydonli kasr kiritish (surat / maxraj)
function FracInput({ num, den, setNum, setDen, disabled, bd }) {
  const cell = { width: 78, height: 46, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' };
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <input value={num} onChange={(e) => setNum(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={disabled} inputMode="numeric" placeholder="?" style={cell} />
      <div style={{ width: 92, height: 3, background: '#1f2430', borderRadius: 2 }} />
      <input value={den} onChange={(e) => setDen(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={disabled} inputMode="numeric" placeholder="?" style={cell} />
    </div>
  );
}

const D07_NUM = 2, D07_DEN = 35;
const D07_T = {
  uz: {
    eyebrow: 'Tezlik kasri', setup: "Halima 35 daqiqada 2 km yurdi.",
    ask: 'U 1 daqiqada necha km yuradi? Kasr shaklida yozing:',
    correct: "To'g'ri. 2 km 35 daqiqaga: 2 : 35 = 2/35 km.",
    wrong: "Maslahat: nima bo'linyapti — masofa-mi yoki vaqt? Bo'linadigan miqdor suratga, birliklar soni maxrajga tushadi.",
    rule: "«Bir birlikka qancha»: masofa : vaqt = masofa/vaqt.",
  },
  ru: {
    eyebrow: 'Дробь скорости', setup: 'Халима прошла 2 км за 35 минут.',
    ask: 'Сколько км она проходит за 1 минуту? Запишите дробью:',
    correct: 'Верно. 2 км на 35 минут: 2 : 35 = 2/35 км.',
    wrong: 'Подсказка: что делится — расстояние или время? Делимое — сверху, число единиц — снизу.',
    rule: '«Сколько на единицу»: расстояние : время = расстояние/время.',
  },
};
export default function D11_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.num != null) setNum(String(sa.num)); if (sa.den != null) setDen(String(sa.den)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(num) && /^\d+$/.test(den);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(num, 10) === D07_NUM && parseInt(den, 10) === D07_DEN;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { num: parseInt(num, 10), den: parseInt(den, 10) }, correctAnswer: { num: 2, den: 35 }, correct, meta: { tag: 'speed_fraction', level: '🔴' } });
  }, [num, den, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d11-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* yo'l chizig'i: 0 dan 2 km gacha, ustida 🚶 */}
      <div style={{ position: 'relative', height: 66, margin: '12px 12px 4px' }}>
        <div style={{ position: 'absolute', left: '4%', right: '4%', top: 36, height: 8, background: '#7dd3fc', borderRadius: 4, border: '1.5px solid #38bdf8' }} />
        <div style={{ position: 'absolute', left: '4%', top: 44, ...S.mono, fontSize: 12, fontWeight: 800, color: '#0369a1' }}>0</div>
        <div style={{ position: 'absolute', right: '4%', top: 44, ...S.mono, fontSize: 12, fontWeight: 800, color: '#0369a1' }}>2 km</div>
        <div style={{ position: 'absolute', right: '4%', top: -4, transform: 'translateX(50%)', fontSize: 40 }}>🚶</div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>{lang === 'uz' ? '2 km · 35 daqiqa' : '2 км · 35 минут'}</div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <FracInput num={num} den={den} setNum={setNum} setDen={setDen} disabled={isReview || checked} bd={bd} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
