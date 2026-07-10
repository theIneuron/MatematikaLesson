// Dars06 · Amaliyot 03 — Son o'qida nuqta · 🟡 · Sardor · tag: numberline_place
// 6-sinf «Butun sonlar»: manfiy sonni son o'qida tasvirlash. jsx-question kontrakti. Maslahat yo'q.
// Mexanika: -6..6 son o'qi; o'quvchi kerakli bo'linmani (nuqtani) bosadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LO = -6, HI = 6, TARGET = -3;
const DATA = { tag: 'numberline_place', level: '🟡' };
const T = {
  uz: {
    eyebrow: "Son o'qi", title: 'Nuqtani joylashtiring',
    setup: "Son o'qida manfiy sonlar noldan chapda joylashadi.",
    ask: "-3 sonini son o'qida belgilang:",
    correct: "To'g'ri. -3 son o'qida noldan uch birlik chapda turadi.",
    wrong: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
  },
  ru: {
    eyebrow: 'Числовая прямая', title: 'Отметьте точку',
    setup: 'На числовой прямой отрицательные числа лежат левее нуля.',
    ask: 'Отметьте число -3 на числовой прямой:',
    correct: 'Верно. -3 стоит на три единицы левее нуля.',
    wrong: 'Пока неверно. Подумайте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D06_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.value != null) {
      setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === TARGET;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { value: picked }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level, lo: LO, hi: HI },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t.ask]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const values = [];
  for (let v = LO; v <= HI; v++) values.push(v);

  return (
    <div className="pq pq03">
      <style>{`
        .pq03 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq03 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq03 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 6px; color:#374151; }
        .pq03 .pq-ask { font-size:17px; font-weight:700; margin:0 0 26px; }
        .pq03 .pq-axiswrap { position:relative; padding:24px 6px 6px; overflow-x:auto; }
        .pq03 .pq-row { display:flex; justify-content:space-between; align-items:flex-end; position:relative; min-width:320px; }
        .pq03 .pq-line { position:absolute; left:6px; right:6px; top:34px; height:3px; background:#cfd6e4; border-radius:3px; }
        .pq03 .pq-tick { position:relative; flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; background:none; border:none; padding:0; font-family:inherit; }
        .pq03 .pq-dot { width:18px; height:18px; border-radius:50%; border:2px solid #cfd6e4; background:#fff; transition:transform .12s; }
        .pq03 .pq-tick .pq-num { font-size:13px; font-weight:700; color:#6b7280; font-variant-numeric:tabular-nums; }
        .pq03 .pq-tick.sel .pq-dot { background:#2563eb; border-color:#2563eb; transform:scale(1.25); }
        .pq03 .pq-tick.sel .pq-num { color:#2563eb; }
        .pq03 .pq-tick.ok .pq-dot { background:#1a7f43; border-color:#1a7f43; }
        .pq03 .pq-tick.no .pq-dot { background:#c0392b; border-color:#c0392b; }
        .pq03 .pq-tick.zero .pq-num { color:#1f2430; font-weight:800; }
        .pq03 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:22px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq03 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq03 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq03 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq03 .a2 { animation-delay:.08s; }
        .pq03 .a3 { animation-delay:.16s; }
        .pq03 .pq-line { transform-origin:left; animation:pqDraw .55s cubic-bezier(.22,1,.36,1) both; }
        @keyframes pqDraw { from { transform:scaleX(0);} to { transform:scaleX(1);} }
        @keyframes pqUp { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
        .pq03 .pq-tick.ok .pq-dot { animation:pqPulse .6s ease both; }
        @keyframes pqPulse { 0%{transform:scale(1);} 45%{transform:scale(1.55);} 100%{transform:scale(1.25);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <p className="pq-ask a a3">{t.ask}</p>

      <div className="pq-axiswrap">
        <div className="pq-line" />
        <div className="pq-row">
          {values.map((v, vi) => {
            let cls = 'pq-tick';
            if (v === 0) cls += ' zero';
            if (picked === v) cls += checked ? (v === TARGET ? ' ok' : ' no') : ' sel';
            return (
              <button key={v} type="button" className={cls} onClick={() => { if (!isReview && !checked) setPicked(v); }} disabled={isReview || checked}
                style={{ animation: `pqUp .4s cubic-bezier(.22,1,.36,1) ${(0.12 + vi * 0.04).toFixed(2)}s both` }}>
                <span className="pq-dot" />
                <span className="pq-num">{v}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
