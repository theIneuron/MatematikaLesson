// Dars07 · Amaliyot 09 — Eng sovuq shahar · 🔴 · temp_coldest (termometrlar)
// Uch shahar harorati. Eng sovug'ini (eng kichik) tanlash. Uch mini termometr vizual.
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
  <div className="d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_CITIES = [
  { city: { uz: 'Toshkent', ru: 'Ташкент' }, temp: -5 },
  { city: { uz: 'Nukus', ru: 'Нукус' }, temp: -14 },
  { city: { uz: 'Termiz', ru: 'Термиз' }, temp: 3 },
];
const D09_COLD = 1; // Nukus -14 eng sovuq
const D09_T = {
  uz: {
    eyebrow: 'Eng sovuq', setup: "Uch shaharda ertalabki harorat o'lchandi.",
    ask: 'Qaysi shahar ENG SOVUQ?',
    correct: "To'g'ri. -14 eng kichik son — Nukus eng sovuq. Minus qancha katta, shuncha sovuq.",
    wrong: "Maslahat: eng sovuq — eng kichik son. -14, -5, 3 dan qaysi biri son o'qida eng chapda?",
    rule: "Harorat qancha past bo'lsa, son shuncha kichik. Eng sovuq = eng kichik son.",
  },
  ru: {
    eyebrow: 'Самый холодный', setup: 'В трёх городах измерили утреннюю температуру.',
    ask: 'Какой город САМЫЙ ХОЛОДНЫЙ?',
    correct: 'Верно. -14 наименьшее — Нукус самый холодный. Чем больше минус, тем холоднее.',
    wrong: 'Подсказка: самый холодный — наименьшее число. Какое из -14, -5, 3 левее на оси?',
    rule: 'Чем ниже температура, тем меньше число. Самый холодный = наименьшее число.',
  },
};
export default function D07_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D09_COLD;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D09_CITIES.map((c, i) => ({ id: String(i), label: c.city.uz + ' ' + c.temp })), studentAnswer: { idx: picked }, correctAnswer: { idx: D09_COLD }, correct, meta: { tag: 'temp_coldest', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cardStyle = (i) => {
    const on = picked === i;
    let bg = '#fff', bd = '#d6dae3', col = '#1f2430';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1e40af'; }
    if (checked && on) { const ok = i === D09_COLD; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, padding: '12px 6px', borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', textAlign: 'center', minHeight: 120, position: 'relative', overflow: 'hidden' };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d7-pop { animation: d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d7-shake { animation: d7shake .5s ease-in-out 3; }
        @keyframes d7shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
        .d7-snow { animation: d7snow 1.4s linear infinite; }
        @keyframes d7snow { 0% { transform: translateY(-6px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(26px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .d7-pop, .d7-shake, .d7-snow { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        {D09_CITIES.map((c, i) => {
          // mini termometr: harorat past bo'lsa ko'kroq/pastroq
          const frac = (c.temp + 20) / 40; // -20..20 → 0..1
          const fillC = c.temp < 0 ? '#2563eb' : '#f59e0b';
          const coldWin = checked && fb?.correct && i === D09_COLD;
            return (
            <button key={i} type="button" className={coldWin ? 'd7-shake' : undefined} style={cardStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
              {coldWin && Array.from({ length: 6 }).map((_, k) => <span key={k} className="d7-snow" style={{ position: 'absolute', top: 0, left: (12 + k * 14) + '%', fontSize: 11, animationDelay: (k * 0.2) + 's' }}>❄️</span>)}
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{c.city[lang] || c.city.uz}</div>
              <div style={{ position: 'relative', width: 14, height: 56, background: '#f1f5f9', borderRadius: 8, margin: '0 auto 8px', border: '1.5px solid #cbd5e1', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: Math.max(6, frac * 56) + '%', background: fillC }} />
              </div>
              <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: c.temp < 0 ? '#2563eb' : '#c2410c' }}>{c.temp}°</div>
            </button>
          ); })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
