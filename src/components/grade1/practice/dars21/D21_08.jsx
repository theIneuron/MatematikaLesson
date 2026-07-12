// Dars21 · Amaliyot 08 — Qaysi rasm? «Olma bog'i» · 🔴 · tag: m1_position
// Ikki RASMLI tanlov (M1 o'rin almashish tuzog'i). Kerak: 5 o'nlik va 3 birlik.
// A rasm = 5 savat + 3 olma (= 53) — TO'G'RI. B rasm = 3 savat + 5 olma (= 35) — o'rin almashgan.
// Savat = 10 olmani bog'lagan BITTA birlik ('10' nishoni bilan) — ichi qayta sanalmaydi. Yakka olma = 1 birlik.
// O'nliklar VA birliklar QO'SHILADI: 50 + 3 = 53 (savat-guruh bilan olma-guruh orasida minus YO'Q).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TENS = 5, UNITS = 3, TEN = 10, TARGET = 53;
const TENS_VAL = TENS * TEN; // 50
// Ikki rasm-karta: A (to'g'ri, 53) va B (o'rin almashgan, 35). Tartib saqlanadi — A birinchi.
const OPTS = [
  { val: 53, tens: 5, units: 3 }, // A — 5 savat + 3 olma
  { val: 35, tens: 3, units: 5 }, // B — 3 savat + 5 olma (M1)
];
const DATA = { target: TARGET, tens: TENS, units: UNITS, options: OPTS.map((o) => o.val), level: '🔴', tag: 'm1_position' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Razryad", title: "Qaysi rasm?",
    setup: "Ikkala rasmda savatlar (o'nliklar) va yakka olmalar (birliklar) bor.",
    ask: "Qaysi rasmda 5 o'nlik va 3 birlik ko'rsatilgan?",
    correct: "Barakalla! 5 savat — ellik, 3 olma — ellik uch. 53.",
    hint: "Avval 5 o'nlik savat, keyin 3 yakka olma.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Разряд", title: "Какая картинка?",
    setup: "На обеих картинках корзины (десятки) и отдельные яблоки (единицы).",
    ask: "На какой картинке показано 5 десятков и 3 единицы?",
    correct: "Молодец! 5 корзин — пятьдесят, 3 яблока — пятьдесят три. 53.",
    hint: "Сначала 5 корзин-десятков, потом 3 отдельных яблока.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Unikal gradient id-lar uchun hisoblagich.
let __gid = 0;

// OLMA KANONI (yakka birlik): yumaloq tana (2-ton radial) + barg + band + oq blik. Bitta olma = bitta birlik.
const Apple = ({ w = 18 }) => {
  const id = 'pq2108a' + (__gid++);
  return (
    <svg viewBox="0 0 30 34" width={w} height={w * 34 / 30} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      {/* band */}
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      {/* barg */}
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      {/* tana */}
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (bitta o'nlik = 10 olma to'plami): to'qilgan savat + ichida olmalar + «10» nishoni.
// Bola savatning ichidagi olmalarni QAYTA sanamaydi — savat bitta birlik-o'nlik.
const Basket = ({ w = 26 }) => {
  const id = 'pq2108b' + (__gid++);
  return (
    <svg viewBox="0 0 64 62" width={w} height={w * 62 / 64} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d79a55" />
          <stop offset="100%" stopColor="#a86a2f" />
        </linearGradient>
      </defs>
      {/* savatdagi olmalar */}
      <circle cx="22" cy="20" r="8.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
      <circle cx="35" cy="17" r="9" fill="#ef5a52" stroke="#a11d2a" strokeWidth="1" />
      <circle cx="46" cy="20" r="8" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
      <path d="M35 8 Q40 4 42 9 Q38 12 35 8 Z" fill="#4fae55" />
      {/* tana */}
      <path d="M8 27 L56 27 L50 55 Q49 58 46 58 L18 58 Q15 58 14 55 Z" fill={`url(#${id})`} stroke="#7c4e22" strokeWidth="1.6" strokeLinejoin="round" />
      {/* to'quv — gorizontal yoylar */}
      <path d="M11 34 Q32 39 53 34" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <path d="M13 43 Q32 48 51 43" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <path d="M15 51 Q32 55 49 51" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      {/* to'quv — vertikal ustunlar */}
      <line x1="24" y1="28" x2="22" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <line x1="32" y1="28" x2="32" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <line x1="40" y1="28" x2="42" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      {/* qirra */}
      <rect x="5" y="24" width="54" height="7" rx="3.5" fill="#c78a45" stroke="#7c4e22" strokeWidth="1.4" />
      {/* «10» nishoni — savat bitta o'nlik ekanini bildiradi */}
      <circle cx="53" cy="12" r="9.5" fill="#1a7f43" stroke="#fff" strokeWidth="2" />
      <text x="53" y="15.6" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
    </svg>
  );
};

// Bog' bargligi (dekorativ, taplarni ushlamaydi) — bargli shox.
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

export default function D21_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map((o) => String(o.val)), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2108">
      <style>{`
        .pq2108{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2108 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2108 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2108 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2108 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2108 .pq-orchard{position:relative;width:420px;max-width:100%;margin:0 auto;padding:34px 12px 14px;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 40%,#cfeccb 74%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2108 .pq-sun{position:absolute;left:16px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:2;pointer-events:none;animation:pq2108sun 3.6s ease-in-out infinite;}
        .pq2108 .pq-leaf{position:absolute;z-index:2;pointer-events:none;transform-origin:top center;}
        .pq2108 .pq-leaf.l{left:-4px;top:2px;animation:pq2108sway 4.2s ease-in-out infinite;}
        .pq2108 .pq-leaf.r{right:-4px;top:-2px;animation:pq2108sway 4.6s ease-in-out .8s infinite;}
        .pq2108 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2108 .pq-cards{position:relative;z-index:3;display:flex;gap:12px;justify-content:center;align-items:stretch;}
        .pq2108 .pq-card{position:relative;flex:1 1 0;min-width:0;max-width:190px;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:12px 8px;border-radius:16px;border:3px solid #d6dae3;background:rgba(255,255,255,.94);cursor:pointer;box-shadow:0 4px 10px rgba(40,60,40,.14);transition:.12s;}
        .pq2108 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2108 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2108 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq2108 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pq2108cele .5s ease;}
        .pq2108 .pq-card.dim{opacity:.42;filter:saturate(.65);}
        .pq2108 .pq-card:disabled{cursor:default;}
        .pq2108 .pq-baskrow{display:flex;justify-content:center;align-items:flex-end;flex-wrap:wrap;gap:2px;line-height:0;}
        .pq2108 .pq-plus{font-size:20px;font-weight:900;color:#5c6672;line-height:1;}
        .pq2108 .pq-applerow{display:flex;justify-content:center;align-items:flex-end;flex-wrap:wrap;gap:3px;max-width:150px;line-height:0;}
        /* g'alaba: yakuniy jami pilyulasi (AnsPop) — to'g'ri rasm ustida javob */
        .pq2108 .pq-total{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:16px;padding:2px 13px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq2108pop .45s ease both;}

        .pq2108 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2108tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2108 .pq-spark.s2{animation-delay:-.6s;} .pq2108 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2108 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pq2108in .3s ease both;}
        .pq2108 .pq-eq b{min-width:44px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2108 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2108 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq2108 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2108in .22s ease both;}
        .pq2108 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2108 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2108sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2108sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2108pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2108tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2108cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2108in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-orchard">
        <span className="pq-sun" />
        <span className="pq-leaf l"><Leaf /></span>
        <span className="pq-leaf r"><Leaf flip /></span>
        <div className="pq-board">{t.title}</div>

        {/* Ikki rasmli tanlov: har kartada savatlar (o'nlik) + yakka olmalar (birlik). Kartaning o'zi
            bosiladigan nishon — ichidagi olma/savat statik, badge/nishonlar pointer-events:none. */}
        <div className="pq-cards">
          {OPTS.map((o) => {
            const sel = picked === o.val;
            const right = ok && o.val === TARGET;
            const dim = ok && o.val !== TARGET;
            return (
              <button
                key={o.val}
                type="button"
                className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.val); setFeedback(null); }}
              >
                {/* O'nliklar: savatlar (har biri 10 olmani bog'lagan bitta birlik, '10' nishoni bilan) */}
                <div className="pq-baskrow">
                  {Array.from({ length: o.tens }).map((_, k) => (
                    <span key={k}><Basket w={26} /></span>
                  ))}
                </div>
                {/* O'nliklar VA birliklar QO'SHILADI: savat-guruh + olma-guruh (minus EMAS) */}
                <span className="pq-plus">{'+'}</span>
                {/* Birliklar: yakka olmalar */}
                <div className="pq-applerow">
                  {Array.from({ length: o.units }).map((_, k) => (
                    <span key={k}><Apple w={18} /></span>
                  ))}
                </div>
                {right && <span className="pq-total">{TARGET}</span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '40px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '54px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>✦</span>
        </>)}
      </div>

      {/* G'alabada: o'nlik va birlik QO'SHILADI — 50 + 3 = 53 */}
      {ok && (
        <div className="pq-eq"><b>{TENS_VAL}</b><i>{'+'}</i><b>{UNITS}</b><i>=</i><b className="res">{TARGET}</b></div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
