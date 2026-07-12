// Dars23 · Amaliyot 10 — NEW «Quyonni sakrating» build «Olma bog'i» · 🔴 · tag: perform_skip
// Bola quyonni O'ZI sakratadi: [Sakrash +5] tugmasi bilan quyon tayl-yo'lakda bir sakrashda
// keyingi taylga o'tadi: 5, 10, 15, 20, 25. Har sakrash QADAMI DOIM 5 (qadam o'zgarmaydi). 25 da
// TO'XTAYDI (undan keyin bosish hech narsa qilmaydi). Har qo'ngan tayl o'z soni bilan yonadi
// (5, 10, 15, 20, 25) — 5 lab ketma-ketlik ko'rinib boradi. ANSWER-LEAK YO'Q: 25 taldan oldin
// yonmaydi, yetib bormagan tayllar '?' turadi. Check quyon kamida bir marta sakraganda faol
// (pos>0). To'g'ri = pos===25 (aynan 25 ga yetdi). Erta tekshirsa (pos<25) — hint, qulf YO'Q.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida. studentAnswer={pos}.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const STEP = 5, TARGET = 25;
const TILES = [5, 10, 15, 20, 25];     // 5 lab tayl-yo'lak (qadam doim 5)
const COLS = TILES.length + 1;         // 6 ustun: boshlash + 5 tayl
const DATA = { tiles: TILES, step: STEP, target: TARGET, options: [25], ptype: 'NEW', level: '🔴', tag: 'perform_skip' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Sakrash", title: "Quyonni sakrating",
    setup: "Quyon 5 lab sakraydi.",
    ask: "25 gacha sakrating.",
    correct: "Barakalla! 5, 10, 15, 20, 25 — quyon yetib keldi!",
    hint: "Har sakrash 5 ga. 25 gacha sakrayvering.",
    btn: "Sakrash", countLbl: "Quyon",
  },
  ru: {
    eyebrow: "Яблоневый сад · Прыжки", title: "Пусть зайчик прыгает",
    setup: "Зайчик прыгает по 5.",
    ask: "Допрыгай до 25.",
    correct: "Молодец! 5, 10, 15, 20, 25 — зайчик добрался!",
    hint: "Каждый прыжок по 5. Прыгай до 25.",
    btn: "Прыжок", countLbl: "Зайчик",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QUYON KANONI: soddalashtirilgan 2-ton tana + quloqlar (ichi pushti) + oq dumcha. O'ngga qaragan,
// oldinga (o'ngga) sakraydi. Bosiladigan nishon EMAS — tugma bilan boshqariladi.
let __rid = 0;
const Rabbit = ({ w = 46 }) => {
  const id = 'pq2310r' + (__rid++);
  const h = w * 46 / 50;
  return (
    <svg viewBox="0 0 50 46" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f3fb" />
          <stop offset="100%" stopColor="#cec8de" />
        </linearGradient>
      </defs>
      <circle cx="10" cy="30" r="5.2" fill="#ffffff" stroke="#c6c0d6" strokeWidth="1" />
      <ellipse cx="17" cy="38.2" rx="8" ry="3.6" fill="#ddd7ea" stroke="#c6c0d6" strokeWidth=".8" />
      <ellipse cx="23" cy="27" rx="13.5" ry="11.5" fill={`url(#${id})`} stroke="#bcb6cf" strokeWidth="1" />
      <ellipse cx="33" cy="38.4" rx="6.6" ry="3.4" fill="#ddd7ea" stroke="#c6c0d6" strokeWidth=".8" />
      <circle cx="35" cy="20" r="9.2" fill={`url(#${id})`} stroke="#bcb6cf" strokeWidth="1" />
      <g stroke="#bcb6cf" strokeWidth="1">
        <ellipse cx="31.5" cy="7" rx="3.1" ry="8.6" fill={`url(#${id})`} transform="rotate(-10 31.5 7)" />
        <ellipse cx="39" cy="6.5" rx="3.1" ry="8.6" fill={`url(#${id})`} transform="rotate(9 39 6.5)" />
      </g>
      <g>
        <ellipse cx="31.7" cy="8" rx="1.4" ry="5.6" fill="#f6b7c6" transform="rotate(-10 31.7 8)" />
        <ellipse cx="38.8" cy="7.6" rx="1.4" ry="5.6" fill="#f6b7c6" transform="rotate(9 38.8 7.6)" />
      </g>
      <circle cx="37.6" cy="18.6" r="1.8" fill="#3a3450" />
      <circle cx="38.3" cy="17.9" r=".55" fill="#fff" />
      <path d="M43.2,21.2 Q45.4,21.6 44.2,23.4 Q42.9,23.1 43.2,21.2 Z" fill="#f18aa0" stroke="#d76e88" strokeWidth=".4" />
      <path d="M43,23.6 Q47,23.4 48.6,22.6 M43,24.2 Q47,24.8 48.8,25.4" fill="none" stroke="#b7b1c8" strokeWidth=".7" strokeLinecap="round" />
    </svg>
  );
};

export default function D23_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pos, setPos] = useState(0); // 0,5,10,15,20,25
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash arki qayta o'ynatilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  const hop = Math.round(pos / STEP);          // 0..5 (quyon nechinchi ustunda)
  const leftPct = ((hop + 0.5) / COLS) * 100;  // ustun markaziga to'g'rilangan

  // RESTORE: studentAnswer = { pos } dan sahnani tiklaydi (msg doim; setChecked faqat to'g'rida).
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      let p = Math.max(0, Math.min(Number(sa.pos) || 0, TARGET));
      p = Math.round(p / STEP) * STEP; // 5 ga karrali holatga qulflash
      setPos(p);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pos > 0 && !checked); }, [pos, checked, onReady]);

  const lock = isReview || checked;
  const doHop = () => {
    if (lock || pos >= TARGET) return; // 25 da to'xtaydi
    setPos((p) => Math.min(p + STEP, TARGET));
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pos <= 0) return;
    const correct = pos === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [String(TARGET)], studentAnswer: { pos }, correctAnswer: { pos: TARGET }, correct, meta: { ...DATA } });
  }, [pos, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2310">
      <style>{`
        .pq2310{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2310 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2310 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2310 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2310 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2310 .pq-scene{position:relative;width:440px;max-width:100%;height:216px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 44%,#cdeeb6 70%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2310 .pq-sun{position:absolute;left:14px;top:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2310sun 3.6s ease-in-out infinite;}
        .pq2310 .pq-branch{position:absolute;z-index:1;pointer-events:none;transform-origin:top center;animation:pq2310sway 4.2s ease-in-out infinite;}
        .pq2310 .pq-branch.r{right:-6px;top:16px;animation-delay:-1.6s;}
        .pq2310 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:40px;background:radial-gradient(120% 100% at 50% 100%,#a6d67c 0%,#8fca6b 60%,#7cbd5a 100%);z-index:1;pointer-events:none;}
        .pq2310 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq2310 .pq-count{position:absolute;top:9px;right:12px;z-index:6;display:flex;align-items:center;gap:6px;padding:3px 12px 3px 10px;border-radius:999px;background:#fff;border:2.5px solid #b8d0ea;box-shadow:0 2px 5px rgba(0,0,0,.14);pointer-events:none;transition:.15s;}
        .pq2310 .pq-count .cap{font-size:11px;font-weight:800;color:#5c7fa6;letter-spacing:.02em;}
        .pq2310 .pq-count b{font-size:18px;font-weight:900;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2310 .pq-count.win{border-color:#1a7f43;} .pq2310 .pq-count.win b{color:#1a7f43;}

        .pq2310 .pq-lane{position:absolute;left:12px;right:12px;bottom:14px;height:130px;z-index:3;}
        .pq2310 .pq-track{position:absolute;left:0;right:0;bottom:0;display:flex;gap:5px;}
        .pq2310 .pq-cell{flex:1 1 0;min-width:0;}
        .pq2310 .pq-start{height:48px;border-radius:11px;display:flex;align-items:flex-end;justify-content:center;}
        .pq2310 .pq-tile{height:48px;border-radius:11px;border:2.5px dashed #a9c4a0;background:rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#8aab7b;font-variant-numeric:tabular-nums;transition:border-color .2s,background .2s,color .2s;}
        .pq2310 .pq-tile.lit{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 3px 6px rgba(26,127,67,.18);}
        .pq2310 .pq-tile.win{animation:pq2310cele .5s ease;}
        /* Quyon — bosiladigan nishon EMAS; sakrash tugmasi bilan siljiydi (gorizontal transition + ark) */
        .pq2310 .pq-rabbit{position:absolute;bottom:56px;transform:translateX(-50%);transition:left .42s cubic-bezier(.34,1.3,.5,1);z-index:5;pointer-events:none;}
        .pq2310 .pq-rabbit.still{transition:none;} /* review/qayta ochishda siljimaydi — statik yakuniy holat */
        .pq2310 .pq-hopwrap{animation:pq2310hop .42s cubic-bezier(.34,1.2,.5,1) both;}
        .pq2310 .pq-hopwrap.still{animation:none;}

        .pq2310 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2310tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2310 .pq-spark.s2{animation-delay:-.6s;} .pq2310 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2310 .pq-seq{text-align:center;margin-top:14px;font-size:18px;font-weight:800;color:#5c7fa6;letter-spacing:.05em;font-variant-numeric:tabular-nums;animation:pq2310in .3s .05s both;}
        .pq2310 .pq-seq b{color:#1a7f43;}

        .pq2310 .pq-tools{display:flex;justify-content:center;margin-top:16px;}
        .pq2310 .pq-hopbtn{display:inline-flex;align-items:center;gap:9px;padding:11px 20px 11px 14px;border-radius:16px;border:2.5px solid #9ab7c9;background:linear-gradient(#eef7fd,#d6ebf7);color:#2f6bab;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #9ab7c9;transition:.12s;}
        .pq2310 .pq-hopbtn:hover:not(:disabled){filter:brightness(1.04);transform:translateY(-1px);}
        .pq2310 .pq-hopbtn:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #9ab7c9;}
        .pq2310 .pq-hopbtn:disabled{background:#eceae6;border-color:#c9c6c0;color:#9a968f;box-shadow:0 3px 0 #c9c6c0;cursor:default;}
        .pq2310 .pq-hopbtn .ic{width:30px;height:28px;flex:0 0 auto;}
        .pq2310 .pq-hopbtn .amt{font-size:19px;font-weight:900;line-height:1;padding:2px 8px;border-radius:999px;background:#2f6bab;color:#fff;font-variant-numeric:tabular-nums;}
        .pq2310 .pq-hopbtn:disabled .amt{background:#b3b0aa;}

        .pq2310 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2310in .22s ease both;}
        .pq2310 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2310 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2310hop{0%{transform:translateY(0);}42%{transform:translateY(-20px);}72%{transform:translateY(-4px);}100%{transform:translateY(0);}}
        @keyframes pq2310sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2310sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2310tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2310cele{0%{transform:scale(1);}30%{transform:scale(1.07);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2310in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <svg className="pq-branch r" width="60" height="42" viewBox="0 0 60 42" aria-hidden="true"><path d="M60,6 Q32,3 16,15" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g stroke="#a6291f" strokeWidth=".6"><circle cx="24" cy="17" r="5" fill="#e8443a" /><circle cx="36" cy="12" r="4.4" fill="#e8443a" /></g><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M40,5 Q34,1 33,6 Q38,8 40,5 Z" /><path d="M27,9 Q21,5 20,10 Q25,12 27,9 Z" /></g></svg>
        <div className="pq-title">{t.title}</div>
        <div className={'pq-count' + (ok ? ' win' : '')}><span className="cap">{t.countLbl}</span><b>{pos}</b></div>

        <div className="pq-lane">
          <div className={'pq-rabbit' + (still ? ' still' : '')} style={{ left: leftPct + '%' }}>
            <div className={'pq-hopwrap' + (still ? ' still' : '')} key={still ? 'static' : hop}>
              <Rabbit w={46} />
            </div>
          </div>
          <div className="pq-track">
            <div className="pq-cell">
              <div className="pq-start" aria-hidden="true">
                <svg width="34" height="30" viewBox="0 0 34 30"><ellipse cx="17" cy="27" rx="16" ry="4" fill="#6fae4e" opacity=".5" /><path d="M4,26 Q6,15 9,26 M9,26 Q11,13 14,26 M20,26 Q22,14 25,26 M25,26 Q27,16 30,26" fill="none" stroke="#4f9440" strokeWidth="2" strokeLinecap="round" /><ellipse cx="17" cy="24" rx="7" ry="4.4" fill="#5a3a22" /></svg>
              </div>
            </div>
            {TILES.map((val, i) => {
              const reached = pos >= val;                 // qo'ngan tayl yonadi (soni ochiladi)
              const winTile = reached && val === TARGET && ok;
              return (
                <div className="pq-cell" key={val}>
                  <div className={'pq-tile' + (reached ? ' lit' : '') + (winTile ? ' win' : '')}>{reached ? val : '?'}</div>
                </div>
              );
            })}
          </div>
        </div>

        <span className="pq-hill" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '48px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '60px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '38px' }}>✦</span>
        </>)}
      </div>

      {ok && (<div className="pq-seq">5 · 10 · 15 · 20 · <b>25</b></div>)}

      <div className="pq-tools">
        <button type="button" className="pq-hopbtn" disabled={lock || pos >= TARGET} onClick={doHop}>
          <svg className="ic" viewBox="0 0 50 46" aria-hidden="true"><ellipse cx="23" cy="27" rx="13.5" ry="11.5" fill="#eceaf4" stroke="#bcb6cf" strokeWidth="1" /><circle cx="10" cy="30" r="5" fill="#fff" stroke="#c6c0d6" strokeWidth="1" /><circle cx="35" cy="20" r="9" fill="#eceaf4" stroke="#bcb6cf" strokeWidth="1" /><ellipse cx="31.5" cy="7" rx="3" ry="8.4" fill="#eceaf4" stroke="#bcb6cf" strokeWidth="1" transform="rotate(-10 31.5 7)" /><ellipse cx="39" cy="6.5" rx="3" ry="8.4" fill="#eceaf4" stroke="#bcb6cf" strokeWidth="1" transform="rotate(9 39 6.5)" /><circle cx="37.6" cy="18.6" r="1.6" fill="#3a3450" /><path d="M43.2,21.2 Q45.2,21.6 44.1,23.3 Q42.9,23 43.2,21.2 Z" fill="#f18aa0" /></svg>
          <span>{t.btn}</span>
          <span className="amt">+5</span>
        </button>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
