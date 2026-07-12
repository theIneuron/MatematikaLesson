// Dars26 · Amaliyot 06 — «Qaysi to'g'ri?» razryad-guruhlash «Olma bog'i» · 🔴 · tag: logic_group
// Ikki guruhlash-kartasi (bitta-tanlov). 34 + 25 ni qanday to'g'ri guruhlaymiz?
// A karta = "30 + 20 va 4 + 5" — o'nlikka o'nlik (3+2 savat), birlikka birlik (4+5 olma). TO'G'RI.
// B karta = "30 + 5 va 20 + 4" — o'rinlar aralashgan (savat bilan yakka olma) — NOTO'G'RI (M3 o'rin almashish).
// KANON (Dars21): bitta savat = bitta o'nlik (10 olma, "10" nishoni), bitta yakka olma = bitta birlik.
// KO'PAYTIRISHSIZ (o'quvchi hali o'tmagan): savatlar O'NLIKLAB BIRMA-BIR SANALADI (10, 20, 30...),
// «3 × 10» yoki ko'paytirish-nuqta ishlatilmaydi — faqat qo'shish va sanash.
// Faqat QO'SHISH — minus YO'Q. G'alabada AnsPop: 34 + 25 = 59 (o'nlik+o'nlik, birlik+birlik).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// JAVOB SIZDIRISH YO'Q: yig'indi (59) faqat g'alabada ko'rinadi, A oldindan belgilanmaydi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const N1 = 34, N2 = 25, SUM = 59; // 34 + 25 = 59 (o'tishsiz: 3+2 o'nlik, 4+5 birlik)
const TARGET = "A";
// Ikki karta. Har guruh — qo'shiluvchilar ro'yxati; addend = { crates:n } (o'nlik) yoki { apples:n } (birlik).
const OPTS = [
  {
    id: "A", text: "30 + 20 va 4 + 5",
    groups: [
      { addends: [{ crates: 3 }, { crates: 2 }], lab: "30 + 20" }, // o'nlikka o'nlik
      { addends: [{ apples: 4 }, { apples: 5 }], lab: "4 + 5" },   // birlikka birlik
    ],
  },
  {
    id: "B", text: "30 + 5 va 20 + 4",
    groups: [
      { addends: [{ crates: 3 }, { apples: 5 }], lab: "30 + 5" }, // aralash (M3 o'rin almashish)
      { addends: [{ crates: 2 }, { apples: 4 }], lab: "20 + 4" }, // aralash
    ],
  },
];
const DATA = { n1: N1, n2: N2, target: SUM, correctId: TARGET, options: OPTS.map((o) => o.text), level: "🔴", tag: "logic_group" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Mantiq", title: "Qaysi to'g'ri?",
    setup: "34 + 25 ni qo'shmoqchimiz.",
    ask: "Qaysi kartada to'g'ri guruhlangan?",
    correct: "Barakalla! Savat savatga, olma olmaga. Savatlarni sanaymiz: 10, 20, 30, 40, 50. Olmalar: 4 + 5 = 9. 50 + 9 = 59.",
    hint: "Savatni savatga, yakka olmani yakka olmaga qo'shing — aralashtirmang.",
    and: "va",
    count: "Savatlarni birma-bir sanang: 10, 20, 30, 40, 50.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Логика", title: "Что верно?",
    setup: "Хотим сложить 34 + 25.",
    ask: "На какой карточке сгруппировано верно?",
    correct: "Молодец! Корзины к корзинам, яблоки к яблокам. Считаем корзины: 10, 20, 30, 40, 50. Яблоки: 4 + 5 = 9. 50 + 9 = 59.",
    hint: "Корзины складывай с корзинами, отдельные яблоки — с яблоками, не смешивай.",
    and: "и",
    count: "Считай корзины по одной: 10, 20, 30, 40, 50.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Unikal gradient id-lar uchun hisoblagich.
let __gid = 0;

// OLMA KANONI (yakka birlik): yumaloq tana (2-ton radial) + barg + band + oq blik. Bitta olma = bitta birlik.
const Apple = ({ w = 14 }) => {
  const id = "pq2606a" + (__gid++);
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

// SAVAT KANONI (bitta o'nlik = 10 olma to'plami): to'qilgan savat + ichida olmalar + "10" nishoni.
// Bola savatning ichidagi olmalarni QAYTA sanamaydi — savat bitta birlik-o'nlik.
const Basket = ({ w = 22 }) => {
  const id = "pq2606b" + (__gid++);
  return (
    <svg viewBox="0 0 64 62" width={w} height={w * 62 / 64} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d79a55" />
          <stop offset="100%" stopColor="#a86a2f" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="20" r="8.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
      <circle cx="35" cy="17" r="9" fill="#ef5a52" stroke="#a11d2a" strokeWidth="1" />
      <circle cx="46" cy="20" r="8" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
      <path d="M35 8 Q40 4 42 9 Q38 12 35 8 Z" fill="#4fae55" />
      <path d="M8 27 L56 27 L50 55 Q49 58 46 58 L18 58 Q15 58 14 55 Z" fill={`url(#${id})`} stroke="#7c4e22" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 34 Q32 39 53 34" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <path d="M13 43 Q32 48 51 43" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <path d="M15 51 Q32 55 49 51" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <line x1="24" y1="28" x2="22" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <line x1="32" y1="28" x2="32" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <line x1="40" y1="28" x2="42" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <rect x="5" y="24" width="54" height="7" rx="3.5" fill="#c78a45" stroke="#7c4e22" strokeWidth="1.4" />
      <circle cx="53" cy="12" r="9.5" fill="#1a7f43" stroke="#fff" strokeWidth="2" />
      <text x="53" y="15.6" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
    </svg>
  );
};

// Bog' bargligi (dekorativ, taplarni ushlamaydi) — bargli shox.
const Leaf = ({ flip }) => (
  <svg width="52" height="40" viewBox="0 0 52 40" aria-hidden="true" style={{ display: "block", transform: flip ? "scaleX(-1)" : "none" }}>
    <path d="M0,8 Q26,2 40,16" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" />
    <g fill="#4fa845" stroke="#3c8536" strokeWidth=".6">
      <path d="M18,6 Q24,2 25,7 Q20,9 18,6 Z" />
      <path d="M31,10 Q37,6 38,11 Q33,13 31,10 Z" />
    </g>
    <circle cx="41" cy="18" r="4.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth=".8" />
  </svg>
);

// Bitta qo'shiluvchini chizadi: savatlar (o'nlik) yoki yakka olmalar (birlik).
const Addend = ({ a }) => {
  if (a.crates) return (<span className="pq-ic">{Array.from({ length: a.crates }).map((_, k) => (<span key={k}><Basket w={22} /></span>))}</span>);
  return (<span className="pq-ic">{Array.from({ length: a.apples }).map((_, k) => (<span key={k}><Apple w={14} /></span>))}</span>);
};

export default function D26_06(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map((o) => o.text), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2606">
      <style>{`
        .pq2606{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2606 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2606 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2606 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2606 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2606 .pq-orchard{position:relative;width:440px;max-width:100%;margin:0 auto;padding:36px 12px 14px;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 40%,#cfeccb 74%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2606 .pq-sun{position:absolute;left:16px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:2;pointer-events:none;animation:pq2606sun 3.6s ease-in-out infinite;}
        .pq2606 .pq-leaf{position:absolute;z-index:2;pointer-events:none;transform-origin:top center;}
        .pq2606 .pq-leaf.l{left:-4px;top:2px;animation:pq2606sway 4.2s ease-in-out infinite;}
        .pq2606 .pq-leaf.r{right:-4px;top:-2px;animation:pq2606sway 4.6s ease-in-out .8s infinite;}
        .pq2606 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2606 .pq-cards{position:relative;z-index:3;display:flex;flex-direction:column;gap:12px;}
        .pq2606 .pq-card{position:relative;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:12px 10px;border-radius:16px;border:3px solid #d6dae3;background:rgba(255,255,255,.94);cursor:pointer;box-shadow:0 4px 10px rgba(40,60,40,.14);transition:.12s;}
        .pq2606 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2606 .pq-card:active:not(:disabled){transform:scale(.98);}
        .pq2606 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq2606 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pq2606cele .5s ease;}
        .pq2606 .pq-card.dim{opacity:.42;filter:saturate(.65);}
        .pq2606 .pq-card:disabled{cursor:default;}
        .pq2606 .pq-grp{display:flex;flex-direction:column;align-items:center;gap:4px;}
        .pq2606 .pq-ic{display:inline-flex;align-items:flex-end;gap:2px;line-height:0;}
        .pq2606 .pq-grp .pq-icons{display:inline-flex;align-items:flex-end;gap:5px;line-height:0;}
        .pq2606 .pq-mini{font-size:14px;font-weight:900;color:#8a94a2;line-height:1;padding:0 1px;}
        .pq2606 .pq-lab{font-size:14px;font-weight:800;color:#374151;font-variant-numeric:tabular-nums;}
        .pq2606 .pq-va{font-size:14px;font-weight:800;color:#5c6672;padding:0 2px;align-self:center;}
        /* g'alaba: to'g'ri karta ustida yig'indi pilyulasi (AnsPop) */
        .pq2606 .pq-total{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:16px;padding:2px 13px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq2606pop .45s ease both;}

        .pq2606 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2606tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2606 .pq-spark.s2{animation-delay:-.6s;} .pq2606 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2606 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2606in .3s ease both;}
        .pq2606 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2606 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2606 .pq-eq i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}
        .pq2606 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2606in .3s .1s both;}

        .pq2606 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2606in .22s ease both;}
        .pq2606 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2606 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2606sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2606sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2606pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2606tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2606cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2606in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-orchard">
        <span className="pq-sun" />
        <span className="pq-leaf l"><Leaf /></span>
        <span className="pq-leaf r"><Leaf flip /></span>
        <div className="pq-board">{t.title}</div>

        {/* Ikki guruhlash-kartasi: har karta ikki guruh (mini savat/olma + yozuv) "va" bilan ajratilgan.
            Kartaning o'zi bosiladigan nishon — ichidagi rasm statik, pilyula/nishonlar pointer-events:none. */}
        <div className="pq-cards">
          {OPTS.map((o) => {
            const sel = picked === o.id;
            const right = ok && o.id === TARGET;
            const dim = ok && o.id !== TARGET;
            return (
              <button
                key={o.id}
                type="button"
                className={"pq-card" + (right ? " right" : sel ? " sel" : "") + (dim ? " dim" : "")}
                disabled={lock}
                onClick={() => { setPicked(o.id); setFeedback(null); }}
              >
                {o.groups.map((g, gi) => (
                  <React.Fragment key={gi}>
                    {gi > 0 && <span className="pq-va">{t.and}</span>}
                    <span className="pq-grp">
                      <span className="pq-icons">
                        {g.addends.map((a, ai) => (
                          <React.Fragment key={ai}>
                            {ai > 0 && <span className="pq-mini">+</span>}
                            <Addend a={a} />
                          </React.Fragment>
                        ))}
                      </span>
                      <span className="pq-lab">{g.lab}</span>
                    </span>
                  </React.Fragment>
                ))}
                {right && <span className="pq-total">{SUM}</span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "14%", top: "44px" }}>✦</span>
          <span className="pq-spark s2" style={{ left: "86%", top: "58px" }}>✦</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "30px" }}>✦</span>
        </>)}
      </div>

      {/* G'alabada: KO'PAYTIRISHSIZ izoh — savatlar (o'nliklar) birma-bir qo'shib sanaladi:
          10 + 10 + 10 + 10 + 10 = 50, olmalar 4 + 5 = 9, so'ng 50 + 9 = 59. */}
      {ok && (<>
        <div className="pq-eq"><b>10</b><i>+</i><b>10</b><i>+</i><b>10</b><i>+</i><b>10</b><i>+</i><b>10</b><i>=</i><b>50</b></div>
        <div className="pq-eq"><b>4</b><i>+</i><b>5</b><i>=</i><b>9</b></div>
        <div className="pq-sub">{t.count}</div>
        <div className="pq-sub">50 + 9 = {SUM}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
