// Dars01 · Amaliyot 08 — P2 Sonni to'plamga moslash · 🟡 · Zuhraning yulduzcha kartalari · tag: match_set
// Animatsiya: kartalar yengil suzadi, yulduzchalar miltillaydi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CARDS = [{ id: 'a', n: 5 }, { id: 'b', n: 4 }, { id: 'c', n: 3 }];
const CORRECT_ID = 'a';
const DATA = { target: CORRECT_ID, ptype: 'P2', level: '🟡', tag: 'match_set' };
const T = {
  uz: {
    eyebrow: 'Zuhra bilan', title: 'Mos to\'plamni tanla',
    setup: 'Zuhra yulduzcha kartalar yasadi.',
    ask: 'Qaysi kartada aynan beshta yulduzcha bor?',
    correct: 'Barakalla! Bu kartada beshta yulduzcha.', hint: 'Har kartadagi yulduzchalarni sanang va beshtalisini tanlang.',
  },
  ru: {
    eyebrow: 'С Зухрой', title: 'Выбери нужную группу',
    setup: 'Зухра сделала карточки со звёздочками.',
    ask: 'На какой карточке ровно пять звёздочек?',
    correct: 'Молодец! Здесь пять звёздочек.', hint: 'Посчитай звёздочки на каждой карточке и выбери, где пять.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_08(props) {
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
    <div className="pq pq08">
      <style>{`
        .pq08{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq08 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a5bd6;text-transform:uppercase;}
        .pq08 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq08 .pq-setup{color:#5c6672;font-weight:500;}
        .pq08 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq08 .pq-cards{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .pq08 .pq-card{position:relative;width:150px;min-height:150px;padding:16px 10px;border-radius:20px;border:3px solid #e2daf6;background:linear-gradient(#fff,#f4f0fd);cursor:pointer;transition:.14s;display:flex;align-items:center;justify-content:center;animation:pqFloat 4s ease-in-out infinite;}
        .pq08 .pq-card.c2{animation-delay:.6s} .pq08 .pq-card.c3{animation-delay:1.2s}
        .pq08 .pq-card:hover:not(.lock){border-color:#b7a6ef;transform:translateY(-3px);}
        .pq08 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq08 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq08 .pq-card.lock{cursor:default;}
        .pq08 .pq-stars{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:120px;}
        .pq08 .pq-st{font-size:32px;animation:pqTw 2s ease-in-out infinite;}
        .pq08 .pq-tick{position:absolute;top:8px;right:8px;color:#1a7f43;}
        .pq08 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq08 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq08 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqTw{0%,100%{opacity:.6;transform:scale(.92);}50%{opacity:1;transform:scale(1.1);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-cards">
        {CARDS.map((c, ci) => {
          const sel = picked === c.id; const right = ok && c.id === CORRECT_ID;
          return (
            <div key={c.id} className={'pq-card c' + (ci + 1) + (lock ? ' lock' : '') + (right ? ' right' : sel ? ' sel' : '')} onClick={() => { if (!lock) { setPicked(c.id); setFeedback(null); } }}>
              {right && <span className="pq-tick"><IconOk /></span>}
              <div className="pq-stars">
                {Array.from({ length: c.n }).map((_, i) => (<span key={i} className="pq-st" style={{ animationDelay: `${i * 0.2}s` }}>⭐</span>))}
              </div>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
