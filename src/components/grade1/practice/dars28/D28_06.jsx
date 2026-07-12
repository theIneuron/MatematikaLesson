// Dars28 · Amaliyot 06 — Mantiq «Qaysi qism savol?» · 🔴 · tag: logic_question
// YANGI MANTIQ: masala tuzilishida SAVOL qismini topish. Ikki matnli karta:
// A = SHART (nima ma'lum — "Bog'da 5 olma va 4 nok bor.", "?" YO'Q),
// B = SAVOL (nimani topish — "Nechta meva bor?", "?" bilan tugaydi).
// Bola SAVOL kartasini bosadi. To'g'ri = B (savol). Bu M2 shart-savol chalkashligini mashq qiladi.
// Sonlar ikki xonali (sbornik: 34 olma va 25 nok). Yig'indi EKRANGA CHIQMAYDI — bu logic
// topshiriq, javob-sizish yo'q; bola faqat savol qismini tanlaydi.
// G'alabada to'g'ri karta ustida «?» nishonchasi paydo bo'ladi — savol «?» bilan tugashini mustahkamlaydi.
// To'g'ri javob — SAVOL kartasi (o'ngda, index 1), chapda EMAS (leftmost-wins tuzog'i yo'q).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Ikki karta: SHART birinchi (A), SAVOL ikkinchi (B). To'g'ri javob — SAVOL.
const TARGET = "savol";
const OPTS = ["shart", "savol"];
const DATA = { target: TARGET, options: OPTS, cond: { apples: 34, pears: 25 }, level: "🔴", tag: "logic_question" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Qaysi — savol?",
    setup: "Masala ikki qismdan iborat.",
    ask: "Qaysi qism — savol?",
    cardShart: "Bog'da 34 olma va 25 nok bor.",
    cardSavol: "Nechta meva bor?",
    correct: "Barakalla! Savol — «Nechta meva bor?». U «?» bilan tugaydi.",
    hint: "Savol nimani topishni so'raydi — «?» bilan tugaydi.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Где вопрос?",
    setup: "Задача состоит из двух частей.",
    ask: "Какая часть — вопрос?",
    cardShart: "В саду 34 яблока и 25 груш.",
    cardSavol: "Сколько всего фруктов?",
    correct: "Молодец! Вопрос — «Сколько всего фруктов?». Он с «?».",
    hint: "Вопрос спрашивает, что найти — заканчивается на «?».",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// OLMA KANONI (Dars21): yumaloq tana (2-ton radial) + barg + band + oq blik. Dekorativ, bosilmaydi.
const Apple = ({ w = 18 }) => {
  const id = "pq2806a" + (__gid++);
  return (
    <svg viewBox="0 0 30 34" width={w} height={w * 34 / 30} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// NOK KANONI (2-ton nok): sarg'ish-yashil tana + band + barg. Dekorativ, bosilmaydi.
const Pear = ({ w = 16 }) => {
  const id = "pq2806p" + (__gid++);
  return (
    <svg viewBox="0 0 26 34" width={w} height={w * 34 / 26} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="42%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#eaf07a" />
          <stop offset="55%" stopColor="#b7d144" />
          <stop offset="100%" stopColor="#7fa22e" />
        </radialGradient>
      </defs>
      <path d="M13,7 Q13.4,3.4 15,2.2" fill="none" stroke="#7a4a24" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.4,5 Q18,2.6 19.6,6 Q15.4,8 13.4,5 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".6" />
      <path d="M13,8 C11,8 10.2,10.6 10.6,12.6 C11,14.6 8.4,16 7.2,18.6 C5.6,22 6,27 9.4,29.8 C12.6,32.4 15.4,32 18.2,29.4 C21.4,26.4 21.4,21.6 19.6,18.4 C18.2,15.8 15.6,14.6 15.2,12.6 C14.8,10.6 15,8 13,8 Z" fill={`url(#${id})`} stroke="#7a9a2c" strokeWidth=".8" />
      <ellipse cx="9.6" cy="22" rx="2.4" ry="3.6" fill="#fff" opacity=".38" transform="rotate(-14 9.6 22)" />
    </svg>
  );
};

export default function D28_06(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlov + feedback (doim msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.cardShart, t.cardSavol], studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  const cardText = (id) => (id === "savol" ? t.cardSavol : t.cardShart);

  return (
    <div className="pq pq2806">
      <style>{`
        .pq2806{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2806 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2806 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2806 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2806 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2806 .pq-orchard{position:relative;width:440px;max-width:100%;margin:0 auto;padding:38px 12px 16px;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 40%,#cfeccb 74%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2806 .pq-sun{position:absolute;left:16px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:2;pointer-events:none;animation:pq2806sun 3.6s ease-in-out infinite;}
        .pq2806 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* dekorativ meva bezaklari — taplarni ushlamaydi, yengil tebranadi */
        .pq2806 .pq-deco{position:absolute;z-index:2;pointer-events:none;transform-origin:top center;}
        .pq2806 .pq-deco.d1{left:10px;top:34px;animation:pq2806sway 4.2s ease-in-out infinite;}
        .pq2806 .pq-deco.d2{right:12px;top:32px;animation:pq2806sway 4.8s ease-in-out .6s infinite;}

        .pq2806 .pq-cards{position:relative;z-index:3;display:flex;gap:12px;justify-content:center;align-items:stretch;}
        .pq2806 .pq-card{position:relative;flex:1 1 0;min-width:0;max-width:196px;min-height:118px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px 12px;border-radius:16px;border:3px solid #d6dae3;background:rgba(255,255,255,.96);cursor:pointer;box-shadow:0 4px 10px rgba(40,60,40,.14);transition:.12s;}
        .pq2806 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2806 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2806 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq2806 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pq2806cele .5s ease;}
        .pq2806 .pq-card.dim{opacity:.42;filter:saturate(.65);}
        .pq2806 .pq-card:disabled{cursor:default;}
        .pq2806 .pq-ctext{font-size:16px;font-weight:800;line-height:1.35;color:#28303c;text-align:center;}
        /* g'alaba: to'g'ri karta ustida «?» nishonchasi (AnsPop) — savol «?» bilan tugaydi */
        .pq2806 .pq-qbadge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);z-index:7;width:32px;height:32px;border-radius:50%;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:20px;display:flex;align-items:center;justify-content:center;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);animation:pq2806pop .45s ease both;}

        .pq2806 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2806tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2806 .pq-spark.s2{animation-delay:-.6s;} .pq2806 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2806 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2806in .22s ease both;}
        .pq2806 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2806 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2806sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2806sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2806pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2806tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2806cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2806in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-orchard">
        <span className="pq-sun" />
        {/* Dekorativ meva (olma/nok) — Dars21 olma kanoni, bosilmaydi, yengil tebranadi */}
        <span className="pq-deco d1"><Apple w={22} /></span>
        <span className="pq-deco d2"><Pear w={20} /></span>
        <div className="pq-board">{t.title}</div>

        {/* Ikki matnli karta: SHART (chapda) va SAVOL (o'ngda). Bola SAVOL kartasini bosadi.
            Karta bosiladigan nishon; «?» badge/sparklar pointer-events:none. Yig'indi ekranga chiqmaydi. */}
        <div className="pq-cards">
          {OPTS.map((id) => {
            const sel = picked === id;
            const right = ok && id === TARGET;
            const dim = ok && id !== TARGET;
            return (
              <button
                key={id}
                type="button"
                className={"pq-card" + (right ? " right" : sel ? " sel" : "") + (dim ? " dim" : "")}
                disabled={lock}
                onClick={() => { setPicked(id); setFeedback(null); }}
              >
                <span className="pq-ctext">{cardText(id)}</span>
                {right && <span className="pq-qbadge">?</span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "16%", top: "44px" }}>✦</span>
          <span className="pq-spark s2" style={{ left: "84%", top: "58px" }}>✦</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "32px" }}>✦</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
