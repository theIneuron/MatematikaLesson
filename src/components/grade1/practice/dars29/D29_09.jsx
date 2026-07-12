// Dars29 · Amaliyot 09 — Qoldiqqa masala «Savatda 48 olma edi, 15 sotildi» · 🔴 · tag: remainder
// Sonli tanlov: 48 − 15 = 33 (o'tishsiz: 4−1=3 o'nlik, 8−5=3 birlik). Bola ma'nodan amalni oladi:
// sotildi -> KAMAYDI -> ayirish. Razryad: 48 = 4 savat (o'nlik) + 8 olma (birlik); sotilgan 15 =
// 1 savat + 5 olma "sotildi" belgisi bilan, g'alabada chiqib ketadi, 33 = 3 savat + 3 olma qoladi.
// Variantlar [63,33,30]: 33 to'g'ri (birinchi EMAS), 63 = noto'g'ri amal (48+15), 30 = faqat o'nlik
// (birlik unutildi). G'alabada tenglama 48 − 15 = 33 ochiladi. VEDI-DO-VERNOGO: xatoda qulf yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 48, S = 15, R = 33;                  // 48 − 15 = 33 (o'tishsiz, <= 99)
const TA = 4, UA = 8;                          // 48 razryadi: 4 o'nlik (savat) + 8 birlik (olma)
const TS = 1, US = 5;                          // sotilgan 15: 1 savat + 5 olma
const TR = 3, UR = 3;                          // qoldiq 33: 3 savat + 3 olma
const MINUS = "−";                             // U+2212, ASCII defis EMAS
const OPT = [63, R, 30];                       // 63 = 48+15 (M1 amal), 30 = faqat o'nlik (M2)
const TARGET = R;
const DATA = { a: A, sub: S, rem: R, options: OPT, answer: R, level: "🔴", tag: "remainder" };

const T = {
  uz: {
    eyebrow: "Olma savati · Masala",
    title: "Qoldiqni toping",
    setup: "Savatda 48 olma bor edi, 15 tasini sotdilar.",
    ask: "Nechta qoldi?",
    sold: "sotildi",
    correct: "Barakalla! 48 − 15 = 33 ta qoldi.",
    hint: "Sotildi — kamaydi. 48 dan 15 ni ayiring.",
    tw: "o'nlik", uw: "birlik",
  },
  ru: {
    eyebrow: "Корзина яблок · Задача",
    title: "Найди остаток",
    setup: "В корзине было 48 яблок, 15 продали.",
    ask: "Сколько осталось?",
    sold: "продали",
    correct: "Молодец! 48 − 15 = 33 осталось.",
    hint: "Продали — стало меньше. Из 48 вычтите 15.",
    tw: "дес.", uw: "ед.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 24 }) => {
  const id = "pq2909a" + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10»
// nishoni. Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi. (Dars 21 kanoni)
const Basket = ({ w = 38 }) => {
  const id = "pq2909b" + (__gid++);
  const ap = id + "ap";
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// Razryad to'plami: qoldiq (keep) + sotilgan (leave) qism. YECHISHGACHA barcha 48 bir xil ko'rinadi
// (javob-sizish yo'q — bola sanab olmasligi uchun); FAQAT g'alabada 15 tasi "out" bilan chiqib ketadi.
const Pile = ({ phase }) => {
  // phase: "before" (48 — hammasi bir xil) | "out" (15 chiqmoqda) | "still" (faqat 33)
  const idle = phase === "before";
  // MUHIM: "before" da sotilganlar ham keep bilan BIR XIL (kulrang emas) — aks holda bola 33 ni sanab oladi.
  const leaveCls = phase === "out" ? "pq-obj leave out" : phase === "still" ? "pq-obj leave hidden" : ("pq-obj" + (idle ? " idle" : ""));
  return (
    <div className="pq-num">
      <div className="pq-tens">
        {Array.from({ length: TR }).map((_, i) => (
          <span key={"kt" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.1}s` }}><Basket w={34} /></span>
        ))}
        {Array.from({ length: TS }).map((_, i) => (
          <span key={"lt" + i} className={leaveCls} style={{ "--bd": `${(TR + i) * 0.1}s` }}><Basket w={34} /></span>
        ))}
      </div>
      <div className="pq-units">
        {Array.from({ length: UR }).map((_, i) => (
          <span key={"ku" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(TA + i) * 0.1}s` }}><Apple w={22} /></span>
        ))}
        {Array.from({ length: US }).map((_, i) => (
          <span key={"lu" + i} className={leaveCls} style={{ "--bd": `${(TA + UR + i) * 0.1}s` }}><Apple w={22} /></span>
        ))}
      </div>
    </div>
  );
};

export default function D29_09(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqib-ketish animatsiyasi qayta ijro etilmaydi — statik 33.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer && initialAnswer.correct));
  const still = stillRef.current;

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPT.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const phase = ok ? (still ? "still" : "out") : "before";

  return (
    <div className="pq pq2909">
      <style>{`
        .pq2909{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2909 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2909 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2909 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-scene{position:relative;width:380px;max-width:100%;height:238px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2909 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2909sun 3.6s ease-in-out infinite;}
        .pq2909 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2909 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2909 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2909 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:12px;display:flex;align-items:center;justify-content:center;z-index:3;}
        .pq2909 .pq-grp{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq2909 .pq-num{display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq2909 .pq-tens{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:4px;max-width:170px;}
        .pq2909 .pq-units{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:4px;max-width:150px;}
        .pq2909 .pq-obj{line-height:0;}
        .pq2909 .pq-obj.idle{animation:pq2909bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);transform-origin:50% 100%;}
        .pq2909 .pq-obj.leave{opacity:.42;filter:grayscale(.35);}
        .pq2909 .pq-obj.leave.out{animation:pq2909out .6s ease forwards;animation-delay:var(--bd,0s);}
        .pq2909 .pq-obj.leave.hidden{display:none;}
        .pq2909 .pq-tag{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #c9822f;color:#b46e1f;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);}
        .pq2909 .pq-gl{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);animation:pq2909pop .38s ease both;}
        .pq2909 .pq-sold{display:inline-flex;align-items:center;gap:5px;padding:2px 10px;border-radius:999px;background:#fff4e6;border:2px dashed #d8933a;color:#b46e1f;font-weight:800;font-size:12px;font-variant-numeric:tabular-nums;}

        .pq2909 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2909tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2909 .pq-spark.s2{animation-delay:-.6s;} .pq2909 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2909 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2909in .3s ease both;}
        .pq2909 .pq-eq b{min-width:42px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2909 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2909 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2909 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2909in .3s .1s both;}

        .pq2909 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq2909 .pq-opt{min-width:88px;height:74px;padding:0 12px;font-size:30px;font-weight:800;line-height:1;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2909 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2909 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2909 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2909 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2909cele .5s ease;}
        .pq2909 .pq-opt:disabled{cursor:default;}
        .pq2909 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2909in .22s ease both;}
        .pq2909 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2909 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2909bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2909sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2909pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2909out{0%{opacity:.42;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(24px,-14px) scale(.6);}}
        @keyframes pq2909tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2909cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2909in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          <div className="pq-grp">
            <Pile phase={phase} />
            {!ok
              ? (<span className="pq-sold">{S} {t.sold} {"→"}</span>)
              : (<span className="pq-gl">{A} {MINUS} {S} = {R}</span>)}
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "16%", top: "54px" }}>{"✦"}</span>
          <span className="pq-spark s2" style={{ left: "82%", top: "68px" }}>{"✦"}</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "42px" }}>{"✦"}</span>
        </>)}
      </div>

      {/* G'alaba: sotildi -> kamaydi -> ayirish; tenglama 48 − 15 = 33 (javob faqat shu yerda ochiladi) */}
      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{MINUS}</i><b>{S}</b><i>=</i><b className="res">{R}</b></div>
        <div className="pq-sub">{TA}{MINUS}{TS}={TR} {t.tw} · {UA}{MINUS}{US}={UR} {t.uw}</div>
      </>)}

      <div className="pq-opts">
        {OPT.map((op) => {
          const sel = picked === op; const right = ok && op === TARGET;
          return <button key={op} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => { setPicked(op); setFeedback(null); }}>{op}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
