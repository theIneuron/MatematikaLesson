// Dars10 · Amaliyot 08 — Noto'g'ri kasrni son o'qida belgilash · 🔴 · Bekzod · tag: place_improper
// Darslik §27: 0..2 oralig'ida yarim ulushlar; 3/2 ni belgilash (1 dan o'ngda). Maslahat yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET_K = 3; // 3/2 → k=3 (yarim ulushlar bo'yicha)
// k: 0→0, 1→1/2, 2→1, 3→3/2, 4→2
const TICKS = [
  { k: 0, label: '0', edge: true },
  { k: 1, label: '1/2', edge: false },
  { k: 2, label: '1', edge: true },
  { k: 3, label: '3/2', edge: false },
  { k: 4, label: '2', edge: true },
];
const DATA = { tag: 'place_improper', level: '🔴' };
const T = {
  uz: {
    eyebrow: "Son o'qi", title: 'Nuqtani belgilang',
    setup: "0 bilan 2 oralig'i yarim (1/2) ulushlarga bo'lingan.",
    ask: "3/2 kasrini son o'qida belgilang:",
    correct: "To'g'ri. 3/2 = 1 butun va 1/2, ya'ni 1 dan keyingi birinchi yarim.",
    wrong: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
  },
  ru: {
    eyebrow: 'Числовая прямая', title: 'Отметьте точку',
    setup: 'Отрезок от 0 до 2 разделён на половинки (1/2).',
    ask: 'Отметьте дробь 3/2 на числовой прямой:',
    correct: 'Верно. 3/2 = 1 целая и 1/2, то есть первая половинка после 1.',
    wrong: 'Пока неверно. Подумайте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D10_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.k != null) {
      setPicked(initialAnswer.studentAnswer.k);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === TARGET_K;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { k: picked }, correctAnswer: { k: TARGET_K, fraction: '3/2' },
      correct, meta: { tag: DATA.tag, level: DATA.level },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t.ask]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  return (
    <div className="pq pq08">
      <style>{`
        .pq08 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq08 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq08 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 6px; color:#374151; }
        .pq08 .pq-ask { font-size:17px; font-weight:700; margin:0 0 30px; }
        .pq08 .pq-axiswrap { position:relative; padding:24px 6px 6px; }
        .pq08 .pq-row { display:flex; justify-content:space-between; align-items:flex-end; position:relative; }
        .pq08 .pq-line { position:absolute; left:6px; right:6px; top:34px; height:3px; background:#cfd6e4; border-radius:3px; }
        .pq08 .pq-tick { position:relative; flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer; background:none; border:none; padding:0; font-family:inherit; }
        .pq08 .pq-dot { width:20px; height:20px; border-radius:50%; border:2px solid #cfd6e4; background:#fff; transition:transform .12s; }
        .pq08 .pq-tick .pq-num { font-size:14px; font-weight:700; color:#6b7280; font-variant-numeric:tabular-nums; }
        .pq08 .pq-tick.sel .pq-dot { background:#2563eb; border-color:#2563eb; transform:scale(1.25); }
        .pq08 .pq-tick.sel .pq-num { color:#2563eb; }
        .pq08 .pq-tick.ok .pq-dot { background:#1a7f43; border-color:#1a7f43; }
        .pq08 .pq-tick.no .pq-dot { background:#c0392b; border-color:#c0392b; }
        .pq08 .pq-tick.edge .pq-num { color:#1f2430; font-weight:800; }
        .pq08 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:24px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq08 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq08 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq08 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq08 .a2 { animation-delay:.08s; }
        .pq08 .a3 { animation-delay:.16s; }
        .pq08 .pq-line { transform-origin:left; animation:pqDraw .55s cubic-bezier(.22,1,.36,1) both; }
        @keyframes pqDraw { from { transform:scaleX(0);} to { transform:scaleX(1);} }
        @keyframes pqUp { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
        .pq08 .pq-tick.ok .pq-dot { animation:pqPulse .6s ease both; }
        @keyframes pqPulse { 0%{transform:scale(1);} 45%{transform:scale(1.55);} 100%{transform:scale(1.25);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <p className="pq-ask a a3">{t.ask}</p>

      <div className="pq-axiswrap">
        <div className="pq-line" />
        <div className="pq-row">
          {TICKS.map((tk) => {
            let cls = 'pq-tick';
            if (tk.edge) cls += ' edge';
            if (picked === tk.k) cls += checked ? (tk.k === TARGET_K ? ' ok' : ' no') : ' sel';
            return (
              <button key={tk.k} type="button" className={cls} onClick={() => { if (!isReview && !checked) setPicked(tk.k); }} disabled={isReview || checked}
                style={{ animation: `pqUp .4s cubic-bezier(.22,1,.36,1) ${(0.12 + tk.k * 0.06).toFixed(2)}s both` }}>
                <span className="pq-dot" />
                <span className="pq-num">{tk.label}</span>
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
