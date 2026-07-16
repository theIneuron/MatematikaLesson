// Dars04 · Amaliyot 02 — Og'zaki · 🟢 · Bekzod · tag: simple_product
// 25 × 4. Variant yo'q — javobni yozadi. To'g'ri javobdan keyin son o'qida
// token 25→50→75→100 sakraydi.
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

/* =================== 02 · Og'zaki · 🟢 · simple_product (javob kiritish) =================== */

const D02_STEPS = [25, 50, 75, 100];
const D02_ANS = 100;
const D02_T = {
  uz: { eyebrow: "Og'zaki", setup: 'Bekzod 25 ni 4 marta oldi.', ask: '25 × 4 ni hisoblang.', label: 'Javobni yozing:', correct: "To'g'ri. 25 + 25 + 25 + 25 = 100. To'rtta chorak — bir butun.", wrong: "Maslahat: 25 — bu chorak. To'rtta chorak birga qancha butunni beradi?" },
  ru: { eyebrow: 'Устно', setup: 'Бекзод взял 25 четыре раза.', ask: 'Вычислите 25 × 4.', label: 'Запишите ответ:', correct: 'Верно. 25 + 25 + 25 + 25 = 100. Четыре четверти — целое.', wrong: 'Подсказка: 25 — это четверть. Сколько целого дают вместе четыре четверти?' },
};
export default function D04_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(-1);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(3); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [0, 1, 2, 3].forEach((k) => timers.current.push(setTimeout(() => setStep(k), 600 + k * 950)));
    onSubmit?.({ questionText: '25 × 4', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'simple_product', level: '🟢' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d4-pop { animation: d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d4-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ maxHeight: step >= 0 ? 96 : 0, opacity: step >= 0 ? 1 : 0, overflow: 'hidden', transition: 'max-height .6s ease, opacity .5s ease' }}>
        <div style={{ position: 'relative', height: 70, margin: '12px 24px 0' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 44, height: 3, background: '#e2e8f0', borderRadius: 2 }} />
          {[0, 25, 50, 75, 100].map((v, i) => (
            <div key={v} style={{ position: 'absolute', left: v + '%', top: 38, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: (step >= i - 1 && i > 0) || i === 0 ? '#fe5b1a' : '#cbd5e1', transition: 'background .4s' }} />
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: (step >= i - 1) || i === 0 ? '#b83d0e' : '#94a3b8', ...S.mono, transition: 'color .4s' }}>{v}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: (step >= 0 ? D02_STEPS[step] : 0) + '%', top: 14, transform: 'translateX(-50%)', transition: 'left .9s cubic-bezier(.34,1.56,.64,1)' }}>
            <div className="d4-pop" key={step} style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#c2410c', whiteSpace: 'nowrap' }}>+25</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', ...S.mono, fontSize: 34, fontWeight: 800, margin: '14px 0 4px', letterSpacing: 1 }}>25 × 4</div>
      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700, textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 150, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
