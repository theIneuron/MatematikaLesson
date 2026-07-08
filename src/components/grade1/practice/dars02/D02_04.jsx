// Dars02 · Amaliyot 04 — P2 Raqamni tanish (ajratish) · 🟡 · Zuhra · tag: digit_pick
// Uch raqamli kartadan to'rttalisini top. Kartalar suzadi; to'g'ri kartada bayram.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CARDS = [{ id: 'a', d: 3 }, { id: 'b', d: 4 }, { id: 'c', d: 5 }];
const CORRECT_ID = 'b';
const TARGET_D = 4;
const DATA = { ptype: 'P2', level: '🟡', tag: 'digit_pick' };
const T = {
  uz: {
    eyebrow: 'Zuhra bilan', title: 'Raqamni top',
    setup: 'Zuhra raqamli kartalarni terdi.',
    ask: 'Qaysi karta — to\'rt raqami?',
    correct: 'Barakalla! Bu to\'rt raqami.', hint: 'To\'rt raqamining shakliga qarang.',
  },
  ru: {
    eyebrow: 'С Зухрой', title: 'Найди цифру',
    setup: 'Зухра разложила карточки с цифрами.',
    ask: 'На какой карточке цифра четыре?',
    correct: 'Молодец! Это цифра четыре.', hint: 'Посмотри на форму цифры четыре.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D02_04(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => String(c.d)), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0204">
      <style>{`
        .pq0204{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0204 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a5bd6;text-transform:uppercase;}
        .pq0204 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq0204 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0204 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0204 .pq-cards{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
        .pq0204 .pq-card{width:96px;height:126px;border-radius:18px;border:3px solid #e2daf6;background:linear-gradient(#fff,#f4f0fd);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.14s;font-size:64px;font-weight:900;color:#5b46b0;font-variant-numeric:tabular-nums;animation:pqFloat 3.6s ease-in-out infinite;}
        .pq0204 .pq-card.c2{animation-delay:.5s} .pq0204 .pq-card.c3{animation-delay:1s}
        .pq0204 .pq-card:hover:not(.lock){border-color:#b7a6ef;transform:translateY(-3px);}
        .pq0204 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq0204 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0204 .pq-card.lock{cursor:default;}
        .pq0204 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:18px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0204 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0204 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.07);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-cards">
        {CARDS.map((c, ci) => {
          const sel = picked === c.id; const right = ok && c.id === CORRECT_ID;
          return (
            <div key={c.id} className={'pq-card c' + (ci + 1) + (lock ? ' lock' : '') + (right ? ' right' : sel ? ' sel' : '')} onClick={() => { if (!lock) { setPicked(c.id); setFeedback(null); } }}>{c.d}</div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
