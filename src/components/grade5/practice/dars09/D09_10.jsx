// Dars09 · Amaliyot 10 — Qolgan kitob · 🔴 · book_remaining (kiritish + vau)
// 320 bet, 3/8 o'qildi. Necha bet O'QILMAGAN? 120 o'qildi, 320-120=200.
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
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D10_TOTAL = 320, D10_NUM = 3, D10_DEN = 8, D10_READ = 120, D10_ANS = 200;
const D10_T = {
  uz: {
    eyebrow: 'Qolgan kitob', setup: "Aziza 320 betlik kitobning 3/8 qismini o'qidi.",
    ask: "Kitobning necha beti hali O'QILMAGAN?", label: 'Javobni yozing:',
    correct: "To'g'ri. O'qilgan: 320 : 8 × 3 = 120; qolgan: 320 − 120 = 200 bet.",
    wrong: "Maslahat: o'qilmagan betlar — butundan o'qilgan qismni ayirgandagi qoldiq. O'qilgan qism kasr bilan berilgan.",
    rule: "Qolgan qism = butun − olingan qism. Avval kasr qismini hisoblang.",
  },
  ru: {
    eyebrow: 'Осталось книги', setup: 'Азиза прочитала 3/8 книги в 320 страниц.',
    ask: 'Сколько страниц ещё НЕ ПРОЧИТАНО?', label: 'Запишите ответ:',
    correct: 'Верно. Прочитано: 320 : 8 × 3 = 120; осталось: 320 − 120 = 200 страниц.',
    wrong: 'Подсказка: непрочитанные страницы — это остаток после вычитания прочитанного из целого. Прочитанную часть задаёт дробь.',
    rule: 'Оставшаяся часть = целое − взятая часть. Сначала посчитай долю.',
  },
};
export default function D09_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1 o'qilgan bo'yaladi · 2 qolgan · 3 salyut
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(3); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 700], [2, 2100], [3, 3300]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'book_remaining', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const conf = ['#f59e0b', '#2563eb', '#10b981', '#ec4899', '#7c3aed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d9-confetti { animation: d9conf .9s ease-out both; }
        @keyframes d9conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d9-pop, .d9-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* 8 ulushli polosa: 3 o'qilgan (ph>=1), 5 qolgan (ph>=2 yashil urg'u) */}
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '10px 0', position: 'relative' }}>
        {Array.from({ length: D10_DEN }).map((_, i) => {
          const isRead = i < D10_NUM;
          let bg = '#e5e7eb', bd2 = '#d1d5db';
          if (isRead && ph >= 1) { bg = '#fbcfe8'; bd2 = '#f472b6'; }
          if (!isRead && ph >= 2) { bg = '#1a7f43'; bd2 = '#166534'; }
          return <div key={i} className={(!isRead && ph >= 2) ? 'd9-pop' : undefined} style={{ width: 34, height: 46, borderRadius: 5, background: bg, border: '1.5px solid ' + bd2, transition: 'background .7s ease' }} />;
        })}
        {ph >= 3 && <div style={{ position: 'absolute', left: '50%', top: '50%' }}>{Array.from({ length: 12 }).map((_, i) => { const ang = (i / 12) * Math.PI * 2; return <span key={i} className="d9-confetti" style={{ position: 'absolute', width: 7, height: 7, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 55 + 'px', '--dy': Math.sin(ang) * 32 + 'px', animationDelay: (i * 0.02) + 's' }} />; })}</div>}
      </div>
      {ph >= 2 && <div className="d9-pop" style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>{lang === 'uz' ? "Pushti — o'qilgan · yashil — qolgan" : 'Розовое — прочитано · зелёное — осталось'}</div>}
      {ph >= 2 && <div className="d9-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43', marginBottom: 4 }}>320 − 120 = 200</div>}
      <p style={{ ...S.ask, fontSize: 16, margin: '6px 0' }}>{t.ask}</p>
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
