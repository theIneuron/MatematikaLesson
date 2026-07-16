// Dars07 · Amaliyot 01 — Qarama-qarshi son · 🟢 · opposite (javob kiritish)
// 7 ga qarama-qarshi. Son o'qida 7 dan nol orqali -7 ga aks etadi. Javob kiritish.
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
  <div className="d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D01_N = 7, D01_ANS = -7;
const D01_T = {
  uz: {
    eyebrow: 'Qarama-qarshi', setup: "Bekzod 7 sonini son o'qida topdi.",
    ask: '7 soniga qarama-qarshi son qaysi?', label: 'Javobni yozing:',
    correct: "To'g'ri. 7 va -7 noldan 7 birlik uzoqda, turli tomonda. Qarama-qarshisi -7.",
    wrong: "Maslahat: nolning narigi tomoniga xuddi shuncha uzoqlikka o'ting. 7 ning aksi qaysi?",
    rule: "Qarama-qarshi sonlar noldan bir xil uzoqlikda, lekin turli tomonda joylashadi.",
  },
  ru: {
    eyebrow: 'Противоположное', setup: 'Бекзод нашёл число 7 на числовой оси.',
    ask: 'Какое число противоположно 7?', label: 'Запишите ответ:',
    correct: 'Верно. 7 и -7 на расстоянии 7 от нуля, по разные стороны. Противоположное -7.',
    wrong: 'Подсказка: перейдите на ту же длину по другую сторону нуля. Что напротив 7?',
    rule: 'Противоположные числа на одинаковом расстоянии от нуля, но по разные стороны.',
  },
};
export default function D07_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [flip, setFlip] = useState(false); // aks ettirish animatsiyasi
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setFlip(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^-?\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D01_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setFlip(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'opposite', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const nums = []; for (let v = -8; v <= 8; v++) nums.push(v);
  return (
    <div style={S.wrap}>
      <style>{`
        .d7-pop { animation: d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d7-arc { animation: d7arc .85s cubic-bezier(.4,0,.2,1) both; }
        @keyframes d7arc { 0% { transform: translateX(-50%) translateY(0); } 45% { transform: translateX(-50%) translateY(-22px); } 100% { transform: translateX(-50%) translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .d7-pop, .d7-arc { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* son o'qi: 7 belgilangan; token 7 dan -7 ga aks etadi */}
      <div style={{ position: 'relative', height: 78, margin: '16px 6px 8px' }}>
        <div style={{ position: 'absolute', left: '2%', right: '2%', top: 44, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
        {/* nol chizig'i (ko'zgu) */}
        <div style={{ position: 'absolute', left: '50%', top: 30, bottom: 8, width: 2, background: '#94a3b8', transform: 'translateX(-50%)' }} />
        {nums.map((v, i) => {
          const hl = v === D01_N || (flip && v === D01_ANS);
          const c = v === D01_ANS && flip ? '#c2410c' : v === D01_N ? '#fe5b1a' : (v === 0 ? '#64748b' : '#cbd5e1');
          return (
            <div key={v} style={{ position: 'absolute', left: `calc(2% + ${i / (nums.length - 1) * 96}%)`, top: 34, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ width: hl ? 15 : 8, height: hl ? 15 : 8, borderRadius: 999, background: c, margin: '0 auto', transition: 'all .3s' }} />
              {(v === D01_N || v === 0 || (flip && v === D01_ANS)) && <div style={{ marginTop: 5, fontSize: 12, fontWeight: 800, color: c, ...S.mono }}>{v}</div>}
            </div>
          );
        })}
        {/* aks etuvchi token */}
        <div className={flip ? "d7-arc" : undefined} style={{ position: 'absolute', left: `calc(2% + ${((flip ? D01_ANS : D01_N) + 8) / 16 * 96}%)`, top: 8, transform: 'translateX(-50%)', transition: 'left .8s cubic-bezier(.34,1.56,.64,1)' }}>
          <div style={{ fontSize: 16 }}>🔵</div>
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^-\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="text" placeholder="?"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
