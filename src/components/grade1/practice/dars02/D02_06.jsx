// Dars02 · Amaliyot 06 — P2 Raqamga to'plam (teskari) · 🟡 · tag: digit_to_qty
// Berilgan raqamga mos to'plamni tanla. Kartalar suzadi; to'g'ri kartada bayram.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET_N = 5;
const CARDS = [{ id: 'a', n: 4 }, { id: 'b', n: 5 }, { id: 'c', n: 3 }];
const CORRECT_ID = 'b';
const DATA = { ptype: 'P2', level: '🟡', tag: 'digit_to_qty' };
const T = {
  uz: {
    eyebrow: 'Anvar bilan', title: 'Raqamga to\'plam',
    setup: 'Anvarga beshta olma kerak.',
    ask: 'Qaysi savatda aynan beshta olma bor?',
    correct: 'Barakalla! Bu savatda beshta olma.', hint: 'Har savatdagi olmalarni sanang.',
  },
  ru: {
    eyebrow: 'С Анваром', title: 'Группа к цифре',
    setup: 'Анвару нужно пять яблок.',
    ask: 'В какой корзине ровно пять яблок?',
    correct: 'Молодец! Здесь пять яблок.', hint: 'Посчитай яблоки в каждой корзине.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D02_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.id != null) setPicked(initialAnswer.studentAnswer.id);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT_ID;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => `${c.n} ta`), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0206">
      <style>{`
        .pq0206{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0206 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq0206 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq0206 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0206 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0206 .pq-target{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;}
        .pq0206 .pq-tnum{width:56px;height:56px;border-radius:14px;background:#2563eb;color:#fff;font-size:32px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(37,99,235,.3);}
        .pq0206 .pq-cards{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .pq0206 .pq-card{position:relative;width:150px;min-height:150px;padding:16px 10px;border-radius:20px;border:3px solid #d7e2ee;background:linear-gradient(#fff,#eef4fa);cursor:pointer;transition:.14s;display:flex;align-items:center;justify-content:center;animation:pqFloat 4s ease-in-out infinite;}
        .pq0206 .pq-card.c2{animation-delay:.6s} .pq0206 .pq-card.c3{animation-delay:1.2s}
        .pq0206 .pq-card:hover:not(.lock){border-color:#9cc0e6;transform:translateY(-3px);}
        .pq0206 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq0206 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0206 .pq-card.lock{cursor:default;}
        .pq0206 .pq-basket{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:120px;}
        .pq0206 .pq-obj{font-size:30px;line-height:1;}
        .pq0206 .pq-tick{position:absolute;top:8px;right:8px;color:#1a7f43;}
        .pq0206 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0206 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0206 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-target"><span className="pq-tnum">{TARGET_N}</span></div>

      <div className="pq-cards">
        {CARDS.map((c, ci) => {
          const sel = picked === c.id; const right = ok && c.id === CORRECT_ID;
          return (
            <div key={c.id} className={'pq-card c' + (ci + 1) + (lock ? ' lock' : '') + (right ? ' right' : sel ? ' sel' : '')} onClick={() => { if (!lock) { setPicked(c.id); setFeedback(null); } }}>
              {right && <span className="pq-tick"><IconOk /></span>}
              <div className="pq-basket">
                {Array.from({ length: c.n }).map((_, i) => (<span key={i} className="pq-obj">🍎</span>))}
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
