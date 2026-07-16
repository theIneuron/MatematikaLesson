// Qulay qo'shish (guruhlash). To'g'ri javobdan keyin 54+46 va 39+61 juftlari
// yoylar bilan bog'lanadi, har biri 100 ga aylanadi, 78 qoladi → 278.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D07_NUMS = [54, 39, 78, 46, 61];
const D07_PAIRS = [[0, 3], [1, 4]]; // 54+46, 39+61
const D07_T = {
  uz: {
    eyebrow: 'Qulay usul',
    setup: "Qo'shishning guruhlash qonuni yig'indini qulay hisoblashga yordam beradi.",
    ask: '54 + 39 + 78 + 46 + 61 ni qulay usulda hisoblang.',
    opts: ['258', '288', '278', '368'],
    correct: "To'g'ri. (54 + 46) va (39 + 61) — ikkita to'liq yuzlik. 100 + 100 + 78 = 278.",
    wrong: "Maslahat: qo'shilganda yumaloq son (100) beradigan juftlarni qidiring. 54 ga qaysi son yaxshi qo'shiladi?",
  },
  ru: {
    eyebrow: 'Удобный способ',
    setup: 'Сочетательный закон сложения помогает считать удобно.',
    ask: '54 + 39 + 78 + 46 + 61 удобным способом.',
    opts: ['258', '288', '278', '368'],
    correct: 'Верно. (54 + 46) и (39 + 61) — две полные сотни. 100 + 100 + 78 = 278.',
    wrong: 'Подсказка: ищите пары, дающие круглое число (100). Какое число хорошо дополняет 54?',
  },
};

export default function D03_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0); // 1 birinchi juft · 2 ikkinchi juft · 3 yakun
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) { setPicked(sa.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(3); } }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 2;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) { [[1, 500], [2, 1400], [3, 2300]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setStep(v), ms))); }
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: 2 }, correct, meta: { tag: 'qulay_add', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === 2; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: "'JetBrains Mono', monospace", minHeight: 48 };
  };

  const pairActive = (i) => (step >= 1 && (i === 0 || i === 3)) || (step >= 2 && (i === 1 || i === 4));
  const pairColor = (i) => (i === 0 || i === 3) ? '#fe5b1a' : '#7c3aed';

  return (
    <div style={S.wrap}>
      <style>{`
        .d3-pop { animation: d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d3-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', margin: '20px 0 8px', flexWrap: 'wrap' }}>
        {D07_NUMS.map((n, i) => {
          const act = pairActive(i);
          const tints = ['#fe5b1a', '#7c3aed', '#0f766e', '#c2410c', '#be185d'];
          const soft = ['#fff0e8', '#f3e8ff', '#d1faf0', '#ffedd5', '#fce7f3'];
          return (
            <React.Fragment key={i}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 800,
                padding: '10px 15px', borderRadius: 14,
                background: act ? (pairColor(i) === '#fe5b1a' ? '#ffe7d8' : '#ede9fe') : soft[i],
                color: act ? pairColor(i) : tints[i],
                border: '2.5px solid ' + (act ? pairColor(i) : tints[i]),
                boxShadow: act ? '0 4px 12px ' + (pairColor(i) === '#fe5b1a' ? 'rgba(37,99,235,.25)' : 'rgba(124,58,237,.25)') : 'none',
                transform: act ? 'scale(1.08)' : 'none',
                transition: 'all .5s cubic-bezier(.34,1.56,.64,1)',
              }}>{n}</span>
              {i < 4 && <span style={{ color: '#cbd2dc', fontWeight: 800, fontSize: 24 }}>+</span>}
            </React.Fragment>
          );
                })}
      </div>

      <div style={{ textAlign: 'center', minHeight: 30, fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800 }}>
        {step >= 1 && <span className="d3-pop" style={{ color: '#fe5b1a', marginRight: 14 }}>54+46 = 100</span>}
        {step >= 2 && <span className="d3-pop" style={{ color: '#7c3aed' }}>39+61 = 100</span>}
      </div>
      <div style={{ textAlign: 'center', minHeight: 30, fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color: '#1a7f43' }}>
        {step >= 3 && <span className="d3-pop">100 + 100 + 78 = 278</span>}
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
