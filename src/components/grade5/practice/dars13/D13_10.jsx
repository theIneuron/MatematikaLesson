// Dars13 · Amaliyot 10 — Poyga · 🔴 · race_compare
// Uch bola bir xil yo'lni bosadi. Bir qadamda: Nodira 1/4, Daler 1/6, Malika 1/3.
// Ikki qadamdan keyin kim oldinda? 2/4, 2/6, 2/3 -> Malika.
// To'g'ri javobdan keyin: yo'llar bo'laklarga bo'linadi, keyin uch chopqin
// bir vaqtda ikki qadam bosadi, g'olibning yo'li yonadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #2563eb; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
  .d13-div { transform: scaleY(0); transform-origin: top; animation: d13div .3s cubic-bezier(.22,1,.36,1) both; }
  @keyframes d13div { to { transform: scaleY(1); } }
  .d13-label { animation: pqIn .3s ease both; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } .d13-div { transform: scaleY(1); } }
`;

const RUNNERS = [
  { key: 'nodira', den: 4, color: '#f59e0b' },
  { key: 'daler', den: 6, color: '#10b981' },
  { key: 'malika', den: 3, color: '#7c3aed' },
];
const D13_10_DATA = { steps: 2, correct: 'malika', tag: 'race_compare', level: '🔴' };
const D13_10_T = {
  uz: {
    eyebrow: 'Poyga', setup: "Uch bola bir xil uzunlikdagi yo'ldan yuguradi. Har biri bir qadamda yo'lning quyidagi qismini bosadi.",
    names: { nodira: 'Nodira', daler: 'Daler', malika: 'Malika' },
    ask: "Ikki qadamdan keyin kim eng oldinda bo'ladi? Yo'lni bosing.",
    step: 'qadam',
    correct: "To'g'ri. Uchalasi ham ikki qadam bosdi. Suratlar teng — 2. Malikaning qadami eng yirik, chunki uning maxraji eng kichik.",
    wrongMsg: "Maslahat: qadamlar soni bir xil — ikkitadan. Demak kimning bitta qadami eng uzun ekanini toping.",
  },
  ru: {
    eyebrow: 'Гонка', setup: 'Трое детей бегут по одинаковой дорожке. За один шаг каждый проходит такую часть пути.',
    names: { nodira: 'Нодира', daler: 'Далер', malika: 'Малика' },
    ask: 'Кто будет впереди после двух шагов? Нажмите на дорожку.',
    step: 'шаг',
    correct: 'Верно. Все сделали по два шага. Числители равны — 2. Шаг Малики самый длинный, потому что у неё самый маленький знаменатель.',
    wrongMsg: 'Подсказка: шагов поровну — по два. Значит найдите, чей один шаг самый длинный.',
  },
};

export default function D13_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_10_T[lang] || D13_10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [phase, setPhase] = useState(0); // 0 tinch · 1 bo'lish · 2 birinchi qadam · 3 ikkinchi qadam · 4 g'olib
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.key) {
      setPicked(sa.key);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPhase(4); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const runRace = () => {
    timers.current.push(setTimeout(() => setPhase(1), 200));
    timers.current.push(setTimeout(() => setPhase(2), 1000));
    timers.current.push(setTimeout(() => setPhase(3), 1900));
    timers.current.push(setTimeout(() => setPhase(4), 2800));
  };

  const check = useCallback(() => {
    const correct = picked === D13_10_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) runRace();
    onSubmit?.({
      questionText: t.ask, options: RUNNERS.map((r) => ({ id: r.key, label: t.names[r.key] })),
      studentAnswer: { key: picked, label: t.names[picked] },
      correctAnswer: { key: 'malika', label: t.names.malika },
      correct, meta: { tag: D13_10_DATA.tag, level: D13_10_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const stepsDone = phase >= 3 ? 2 : phase >= 2 ? 1 : 0;

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>

      <div style={{ margin: '16px 0 10px' }}>
        {RUNNERS.map((r) => {
          const on = picked === r.key;
          const isWinner = phase >= 4 && r.key === D13_10_DATA.correct;
          // Xato javobda to'g'ri yo'l ochib berilmaydi — faqat tanlangani qizil.
          let bd = '#e5e7eb';
          if (on && !checked) bd = '#2563eb';
          if (checked && on) bd = (r.key === D13_10_DATA.correct) ? '#1a7f43' : '#c0392b';
          const pct = (stepsDone / r.den) * 100;
          return (
            <button key={r.key} type="button" disabled={isReview || checked} onClick={() => setPicked(r.key)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', marginBottom: 10, borderRadius: 14, border: '2px solid ' + bd, background: on && !checked ? '#f8fafc' : '#fff', cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: isWinner ? '0 0 0 4px rgba(124,58,237,.18)' : 'none', transition: 'box-shadow .4s, border-color .3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: r.color }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#374151', flex: 1 }}>{t.names[r.key]}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9aa1ad' }}>1 {t.step} =</span>
                <Frac a={1} b={r.den} size={13} tone={r.color} />
              </div>

              <div style={{ position: 'relative', height: 30, border: '2px solid #1f2430', borderRadius: 7, background: '#f8fafc', overflow: 'hidden' }}>
                {/* to'ldirish */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct + '%', background: r.color, opacity: .9, transition: 'width .8s cubic-bezier(.22,1,.36,1)' }} />
                {/* bo'laklarga bo'linish */}
                {phase >= 1 && Array.from({ length: r.den - 1 }).map((_, i) => (
                  <div key={i} className="d13-div" style={{ position: 'absolute', top: 0, bottom: 0, left: ((i + 1) / r.den * 100) + '%', width: 2, background: '#1f2430', opacity: .55, animationDelay: (i * 70) + 'ms' }} />
                ))}
                {/* chopqin */}
                {phase >= 1 && (
                  <div style={{ position: 'absolute', top: 3, left: `calc(${pct}% - 12px)`, width: 24, height: 24, borderRadius: 999, background: '#fff', border: '2.5px solid ' + r.color, transition: 'left .8s cubic-bezier(.22,1,.36,1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: r.color }} />
                  </div>
                )}
                {/* marraga yaqin holat: bosib o'tilgan qism kasr bilan */}
                {phase >= 3 && (
                  <div className="d13-label" style={{ position: 'absolute', right: 6, top: 4, fontSize: 12, fontWeight: 800, color: '#1f2430', background: 'rgba(255,255,255,.9)', borderRadius: 6, padding: '1px 5px' }}>
                    {2}/{r.den}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="pq-ask" style={{ fontSize: 15.5 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
