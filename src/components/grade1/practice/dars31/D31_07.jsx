// Dars31 · Amaliyot 07 — «Qaysi qadam xato?» · Ikki qadamli masala · Xatoni top (P13) · 🔴 · tag: find_error
// Masala: bor edi 5, keldi 3, ketdi 2. Yechim ikki qadam-qator:
//   1-qadam: 5 + 3 = 8 (to'g'ri) · 2-qadam: 8 − 2 = 5 (XATO — aslida 6). Bola XATO qadamni bosadi.
// Xato qadam = 2-qator (chap-yutadi tuzog'idan qochish: to'g'ri qadam birinchi). Minus U+2212 «−».
// JAVOB-LEAK YO'Q: qaysi qadam xato ekani g'alabagacha belgilanmaydi; tuzatish (6) FAQAT g'alabada ochiladi.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint yo'lni ko'rsatadi (javobni emas).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 minus

// Ikki qadam-qator. Xato qadam index 1 (2-qadam) — chap-yutadi tuzog'idan qochish.
const STEPS = [
  { id: 's1', a: 5, op: '+', b: 3, shown: 8, bad: false }, // 1-qadam: 5 + 3 = 8 to'g'ri
  { id: 's2', a: 8, op: M, b: 2, shown: 5, bad: true },    // 2-qadam: 8 − 2 = 5 XATO (aslida 6) — index 1
];
const TARGET = 's2';                  // bosish kerak bo'lgan xato qadam
const REAL = 8 - 2;                   // 6 — to'g'ri natija (faqat g'alabada ochiladi)
const DATA = { story: { bor: 5, keldi: 3, ketdi: 2 }, target: TARGET, real: REAL, options: STEPS.map((s) => s.id), level: '🔴', tag: 'find_error' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Ikki qadam", title: "Xato qadam?",
    setup: "Bor edi 5, keldi 3, ketdi 2.",
    ask: "Qaysi qadam xato?",
    st1: "1-qadam", st2: "2-qadam",
    correct: "Barakalla! 8 " + M + " 2 = 6, 5 emas.",
    hint: "Har bir qadamni tekshiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Два шага", title: "Ошибка в шаге?",
    setup: "Было 5, пришло 3, ушло 2.",
    ask: "В каком шаге ошибка?",
    st1: "Шаг 1", st2: "Шаг 2",
    correct: "Молодец! 8 " + M + " 2 = 6, а не 5.",
    hint: "Проверь каждый шаг.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// Bog' bargligi (dekorativ, taplarni ushlamaydi).
const Leaf = ({ flip }) => (
  <svg width="52" height="40" viewBox="0 0 52 40" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M0,8 Q26,2 40,16" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" />
    <g fill="#4fa845" stroke="#3c8536" strokeWidth=".6">
      <path d="M18,6 Q24,2 25,7 Q20,9 18,6 Z" />
      <path d="M31,10 Q37,6 38,11 Q33,13 31,10 Z" />
    </g>
    <circle cx="41" cy="18" r="4.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth=".8" />
  </svg>
);

// Yakka olma (dekor, bosilmaydi) — bog' hissi. (Dars 21 kanoni)
const Apple = ({ w = 20 }) => {
  const id = 'pq3107a' + (__gid++);
  return (
    <svg viewBox="0 0 30 34" width={w} height={w * 34 / 30} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" /><stop offset="46%" stopColor="#e8443a" /><stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

export default function D31_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: STEPS.map((s) => `${s.a} ${s.op} ${s.b} = ${s.shown}`), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3107" + (still ? " still" : "")}>
      <style>{`
        .pq3107.still *{animation:none !important;}
        .pq3107{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3107 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3107 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3107 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3107 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3107 .pq-orchard{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 12px 16px;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 40%,#cfeccb 74%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq3107 .pq-sun{position:absolute;left:16px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:2;pointer-events:none;animation:pq3107sun 3.6s ease-in-out infinite;}
        .pq3107 .pq-leaf{position:absolute;z-index:2;pointer-events:none;transform-origin:top center;}
        .pq3107 .pq-leaf.l{left:-4px;top:2px;animation:pq3107sway 4.2s ease-in-out infinite;}
        .pq3107 .pq-leaf.r{right:-4px;top:-2px;animation:pq3107sway 4.6s ease-in-out .8s infinite;}
        .pq3107 .pq-apple{position:absolute;z-index:2;pointer-events:none;}
        .pq3107 .pq-apple.a1{right:18px;bottom:10px;animation:pq3107bob 3s ease-in-out infinite;}
        .pq3107 .pq-apple.a2{left:20px;bottom:14px;animation:pq3107bob 3.4s ease-in-out .5s infinite;}
        .pq3107 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        /* Qadam-jadval: ikki bosiladigan qator, hairline ajratgich */
        .pq3107 .pq-table{box-sizing:border-box;position:relative;z-index:3;width:100%;border-radius:15px;overflow:hidden;border:3px solid #d6dae3;background:rgba(255,255,255,.97);box-shadow:0 4px 10px rgba(40,60,40,.14);}
        .pq3107 .pq-row{box-sizing:border-box;position:relative;width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:60px;padding:10px 14px;background:transparent;border:0;border-top:1px solid #e6e9ef;cursor:pointer;transition:.12s;text-align:left;}
        .pq3107 .pq-row:first-child{border-top:0;}
        .pq3107 .pq-row:hover:not(:disabled){background:#f3f7ff;}
        .pq3107 .pq-row:active:not(:disabled){transform:scale(.99);}
        .pq3107 .pq-row.sel{background:#eef3fe;box-shadow:inset 3px 0 0 #2563eb;}
        .pq3107 .pq-row.right{background:#e8f7ee;box-shadow:inset 3px 0 0 #1a7f43;animation:pq3107cele .5s ease;}
        .pq3107 .pq-row.dim{opacity:.42;filter:saturate(.65);}
        .pq3107 .pq-row:disabled{cursor:default;}
        .pq3107 .pq-lab{font-size:12px;font-weight:800;letter-spacing:.02em;color:#9aa3b0;flex:0 0 auto;white-space:nowrap;}
        .pq3107 .pq-eqtxt{display:flex;align-items:center;gap:4px;font-size:19px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;line-height:1;flex:0 0 auto;}
        .pq3107 .pq-eqtxt i{font-style:normal;color:#8a94a2;font-weight:800;}
        .pq3107 .pq-eqtxt s{color:#c0392b;text-decoration-thickness:2.5px;}
        .pq3107 .pq-eqtxt em{font-style:normal;color:#1a7f43;font-weight:900;}
        /* g'alaba: xato qadamdagi to'g'ri natija pilyulasi (AnsPop) — faqat g'alabada */
        .pq3107 .pq-mark{position:absolute;top:-9px;right:12px;z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:14px;padding:2px 12px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq3107pop .45s ease both;}

        .pq3107 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3107tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3107 .pq-spark.s2{animation-delay:-.6s;} .pq3107 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3107 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq3107in .3s ease both;}
        .pq3107 .pq-eq b{min-width:42px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3107 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3107 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq3107 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3107in .22s ease both;}
        .pq3107 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3107 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3107sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3107sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq3107bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pq3107pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3107tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3107cele{0%{transform:scale(1);}30%{transform:scale(1.02);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3107in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-orchard">
        <span className="pq-sun" />
        <span className="pq-leaf l"><Leaf /></span>
        <span className="pq-leaf r"><Leaf flip /></span>
        <span className="pq-apple a1"><Apple w={20} /></span>
        <span className="pq-apple a2"><Apple w={16} /></span>
        <div className="pq-board">{t.title}</div>

        {/* Ikki qadam-qator: har qadam bosiladigan nishon;
            g'alabagacha qaysi biri xato ekani belgilanmaydi (javob-leak yo'q). */}
        <div className="pq-table">
          {STEPS.map((s, i) => {
            const sel = picked === s.id;
            const right = ok && s.id === TARGET;
            const dim = ok && s.id !== TARGET;
            return (
              <button
                key={s.id}
                type="button"
                className={'pq-row' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(s.id); setFeedback(null); }}
              >
                <span className="pq-lab">{i === 0 ? t.st1 : t.st2}</span>
                <span className="pq-eqtxt">
                  <b>{s.a}</b><i>{s.op}</i><b>{s.b}</b><i>=</i>
                  {right
                    ? (<><s>{s.shown}</s> <em>{REAL}</em></>)
                    : (<b>{s.shown}</b>)}
                </span>
                {right && <span className="pq-mark">{REAL}</span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '42px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '56px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>{'✦'}</span>
        </>)}
      </div>

      {/* G'alabada: xato qadamning to'g'ri ko'rinishi — 8 − 2 = 6 */}
      {ok && (<div className="pq-eq"><b>8</b><i>{M}</i><b>2</b><i>=</i><b className="res">{REAL}</b></div>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
