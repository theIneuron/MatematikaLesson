// Dars03 · Amaliyot 10 — YANGI kreativ: «5 va yana» ramkasini to'ldirib SONNI HOSIL QIL · 🔴 · robot · tag: build_frame
// 2×5 katakli ramka. Bola kataklarni bosib to'ldiradi va 7 sonini o'zi YARATADI (5 + 2).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 7, COLS = 5, CELLS = 10;
const DATA = { target: TARGET, ptype: 'NEW', level: '🔴', tag: 'build_frame' };
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Robot', title: 'Sonni hosil qil',
    setup: 'Bayramga robot ham keldi! U mehmonlarga olma tarqatadi, ekranida esa yetti soni yonmoqda.',
    ask: 'Ramkaga yettita olma qo\'ying: avval to\'liq beshlik, keyin yana.',
    correctFive: 'Barakalla! To\'liq beshlik va yana ikkita — yetti hosil bo\'ldi. Robot mehmonlarga tarqatishga tayyor!',
    correctAny: 'Barakalla! Yettita olma — yetti hosil bo\'ldi. Qarang: to\'liq beshlik va yana ikkita bilan ham shunday chiqadi.',
    hintLess: 'Hali kam. Robot ekranidagi songa qarang, olmalarni sanang va yana qo\'shing.',
    hintMore: 'Ko\'p bo\'lib ketdi. Olmalarni sanang va ortiqchasini bosib olib tashlang.',
    rowFive: 'beshlik', rowMore: 'va yana',
  },
  ru: {
    eyebrow: 'Праздник урожая · Робот', title: 'Собери число',
    setup: 'На праздник приехал робот! Он раздаёт гостям яблоки, а на его экране горит число семь.',
    ask: 'Положи в рамку семь яблок: сначала полную пятёрку, потом ещё.',
    correctFive: 'Молодец! Полная пятёрка и ещё два — получилось семь. Робот готов угощать гостей!',
    correctAny: 'Молодец! Семь яблок — получилось семь. Смотри: с полной пятёркой и ещё двумя выходит так же.',
    hintLess: 'Пока мало. Посмотри на число на экране робота, посчитай яблоки и добавь ещё.',
    hintMore: 'Слишком много. Посчитай яблоки и убери лишние, нажав на них.',
    rowFive: 'пятёрка', rowMore: 'и ещё',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D03_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [cells, setCells] = useState(() => Array(CELLS).fill(false));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const filled = cells.filter(Boolean).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.cells)) {
      setCells(initialAnswer.studentAnswer.cells);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(filled > 0 && !checked); }, [filled, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setCells((prev) => { const nc = [...prev]; nc[i] = !nc[i]; return nc; });
    setFeedback(null);
  };

  const topFilled = cells.slice(0, COLS).filter(Boolean).length;
  const botFilled = filled - topFilled;

  const check = useCallback(() => {
    if (filled === 0) return;
    const correct = filled === TARGET;
    const msg = correct ? (topFilled === COLS ? t.correctFive : t.correctAny) : (filled < TARGET ? t.hintLess : t.hintMore);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [], studentAnswer: { cells, count: filled }, correctAnswer: { count: TARGET }, correct, meta: { ...DATA } });
  }, [cells, filled, topFilled, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  let badge = 0;

  return (
    <div className="pq pq0310">
      <style>{`
        .pq0310{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0310 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4b5bd6;text-transform:uppercase;}
        .pq0310 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0310 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0310 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0310 .pq-stage{display:flex;gap:18px;justify-content:center;align-items:center;flex-wrap:wrap;}
        .pq0310 .pq-robot{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .pq0310 .pq-screen{width:86px;height:64px;border-radius:14px;background:#101827;border:3px solid #33415c;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;color:#5eead4;font-variant-numeric:tabular-nums;box-shadow:0 0 14px rgba(94,234,212,.35);animation:pqGlow 2s ease-in-out infinite;}
        .pq0310 .pq-screen.win{color:#4ade80;box-shadow:0 0 18px rgba(74,222,128,.55);}
        .pq0310 .pq-antenna{width:4px;height:14px;background:#33415c;border-radius:2px;position:relative;}
        .pq0310 .pq-antenna::after{content:'';position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:9px;height:9px;border-radius:50%;background:#f43f5e;animation:pqBlink 1.4s ease-in-out infinite;}
        .pq0310 .pq-base{width:56px;height:12px;border-radius:6px;background:#33415c;margin-top:2px;}
        .pq0310 .pq-frameWrap{display:flex;flex-direction:column;gap:6px;}
        .pq0310 .pq-rowLbl{font-size:12px;font-weight:800;color:#8a93a3;text-transform:uppercase;letter-spacing:.04em;padding-left:2px;}
        .pq0310 .pq-row{display:flex;gap:7px;}
        .pq0310 .pq-cell{position:relative;width:54px;height:54px;border-radius:13px;border:2.5px dashed #c6cdd8;background:#fbfcfe;font-size:30px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.13s;padding:0;}
        .pq0310 .pq-row.five .pq-cell{border-color:#f0b7c9;background:#fef5f8;}
        .pq0310 .pq-cell:hover:not(:disabled){transform:translateY(-2px);border-color:#93a7c4;}
        .pq0310 .pq-cell:active:not(:disabled){transform:scale(.92);}
        .pq0310 .pq-cell.on{border-style:solid;border-color:#8fb885;background:#f2faee;}
        .pq0310 .pq-cell.on .pq-fruit{animation:pqDrop .35s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0310 .pq-cell.winlit{border-color:#1a7f43;background:#e8f7ee;}
        .pq0310 .pq-cell:disabled{cursor:default;}
        .pq0310 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0310 .pq-eq{text-align:center;margin-top:14px;font-size:26px;font-weight:900;color:#1a7f43;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0310 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0310 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0310 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqGlow{0%,100%{box-shadow:0 0 10px rgba(94,234,212,.25);}50%{box-shadow:0 0 18px rgba(94,234,212,.5);}}
        @keyframes pqBlink{0%,100%{opacity:1;}50%{opacity:.3;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-20px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:scale(.4);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-robot">
          <span className="pq-antenna" />
          <div className={'pq-screen' + (ok ? ' win' : '')}>{TARGET}</div>
          <span className="pq-base" />
        </div>

        <div className="pq-frameWrap">
          <span className="pq-rowLbl">{t.rowFive}</span>
          <div className="pq-row five">
            {cells.slice(0, COLS).map((on, i) => {
              if (on) badge += 1; const b = badge;
              return (
                <button key={i} type="button" className={'pq-cell' + (on ? ' on' : '') + (ok && on ? ' winlit' : '')} disabled={lock} onClick={() => toggle(i)}>
                  {on && <span className="pq-fruit">🍎</span>}{ok && on && <b className="pq-cnt">{b}</b>}
                </button>
              );
            })}
          </div>
          <span className="pq-rowLbl">{t.rowMore}</span>
          <div className="pq-row">
            {cells.slice(COLS).map((on, k) => {
              if (on) badge += 1; const b = badge;
              return (
                <button key={k} type="button" className={'pq-cell' + (on ? ' on' : '') + (ok && on ? ' winlit' : '')} disabled={lock} onClick={() => toggle(COLS + k)}>
                  {on && <span className="pq-fruit">🍎</span>}{ok && on && <b className="pq-cnt">{b}</b>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {ok && <div className="pq-eq">{topFilled} + {botFilled} = {TARGET}</div>}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
