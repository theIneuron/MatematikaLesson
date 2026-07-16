// Dars07 · Amaliyot 06 — Manfiyning qarshisi · 🟡 · opposite_of_neg (kiritish + aks)
// -12 ga qarama-qarshi. Javob kiritish, son o'qida -12 dan 12 ga aks etadi.
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

const D06_N = -12, D06_ANS = 12;
const D06_T = {
  uz: {
    eyebrow: 'Qarshisini top', setup: "Nilufar -12 sonini oldi.",
    ask: '-12 soniga qarama-qarshi son qaysi?', label: 'Javobni yozing:',
    correct: "To'g'ri. -12 ning aksi 12. Ikkalasi noldan 12 birlik uzoqda.",
    wrong: "Maslahat: -12 noldan chapda 12 birlik. Narigi tomonda ham 12 birlik — bu qaysi son?",
    rule: "Manfiy songa qarama-qarshi son musbat bo'ladi (ishora almashadi).",
  },
  ru: {
    eyebrow: 'Найдите противоположное', setup: 'Нилуфар взяла число -12.',
    ask: 'Какое число противоположно -12?', label: 'Запишите ответ:',
    correct: 'Верно. Противоположное -12 это 12. Оба на расстоянии 12 от нуля.',
    wrong: 'Подсказка: -12 на 12 левее нуля. По другую сторону тоже 12 — какое это число?',
    rule: 'Противоположное отрицательному числу — положительное (знак меняется).',
  },
};
export default function D07_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [flip, setFlip] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setFlip(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^-?\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setFlip(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'opposite_of_neg', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const nums = []; for (let v = -13; v <= 13; v++) nums.push(v);
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
      <div style={{ position: 'relative', height: 74, margin: '14px 6px 8px' }}>
        <div style={{ position: 'absolute', left: '2%', right: '2%', top: 42, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: '50%', top: 28, bottom: 8, width: 2, background: '#94a3b8', transform: 'translateX(-50%)' }} />
        {nums.map((v, i) => {
          const hl = v === D06_N || (flip && v === D06_ANS);
          const c = v === D06_ANS && flip ? '#1a7f43' : v === D06_N ? '#c0392b' : (v === 0 ? '#64748b' : '#cbd5e1');
          return (
            <div key={v} style={{ position: 'absolute', left: `calc(2% + ${i / (nums.length - 1) * 96}%)`, top: 32, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ width: hl ? 14 : 6, height: hl ? 14 : 6, borderRadius: 999, background: c, margin: '0 auto', transition: 'all .3s' }} />
              {(v === D06_N || v === 0 || (flip && v === D06_ANS)) && <div style={{ marginTop: 4, fontSize: 11, fontWeight: 800, color: c, ...S.mono }}>{v}</div>}
            </div>
          );
        })}
        <div className={flip ? "d7-arc" : undefined} style={{ position: 'absolute', left: `calc(2% + ${((flip ? D06_ANS : D06_N) + 13) / 26 * 96}%)`, top: 6, transform: 'translateX(-50%)', transition: 'left .8s cubic-bezier(.34,1.56,.64,1)' }}>
          <div style={{ fontSize: 15 }}>🔴</div>
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
