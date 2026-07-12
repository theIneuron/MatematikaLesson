// Dars21 · Amaliyot 04 — Razryad "Olma bog'i" · 🟡 · tag: digit_value
// Bitta-tanlov: katta 47 soni ikki xonada (o'nliklar | birliklar). Savol — birliklar xonasida
// qaysi raqam. To'g'ri javob 7 (oxirgi raqam). Tuzoqlar: 4 = o'nliklar raqami, 11 = 4+7 qo'shib
// yuborilgan. G'alabada 47 = 4 savat (o'nlik) + 7 olma (birlik) yoyilib ko'rsatiladi, tenglama
// 40 + 7 = 47 (o'nlik va birlik QO'SHILADI, ayirish yo'q). VEDI-DO-VERNOGO: noto'g'rida qulf yo'q,
// retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const NUM = 47, TENS_DIGIT = 4, UNITS_DIGIT = 7, TARGET = 7;
const DATA = { num: NUM, tens: TENS_DIGIT, units: UNITS_DIGIT, options: [7, 4, 11], correct: TARGET, level: '🟡', tag: 'digit_value' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Razryad", title: "Birliklar xonasi",
    setup: "Kartochkada 47 soni yozilgan.",
    ask: "47 sonining birliklar xonasida qaysi raqam turibdi?",
    correct: "Barakalla! 47 da birliklar — 7, o'nliklar — 4.",
    hint: "Birliklar — oxirgi raqam. O'nliklar — oldingisi.",
    tens: "O'nliklar", units: "Birliklar", basketWord: "savat", appleWord: "olma",
  },
  ru: {
    eyebrow: "Яблоневый сад · Разряд", title: "Разряд единиц",
    setup: "На карточке написано число 47.",
    ask: "Какая цифра стоит в разряде единиц числа 47?",
    correct: "Молодец! В 47 единицы — 7, десятки — 4.",
    hint: "Единицы — последняя цифра. Десятки — перед ней.",
    tens: "Десятки", units: "Единицы", basketWord: "корзины", appleWord: "яблок",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Unikal gradient id-lar uchun hisoblagich.
let __gid = 0;

// OLMA KANONI (yakka birlik): yumaloq tana (2-ton radial) + barg + band + oq blik. Bitta olma = bitta birlik.
const Apple = ({ w = 26 }) => {
  const id = 'pq2104a' + (__gid++);
  return (
    <svg viewBox="0 0 40 44" width={w} height={w * 44 / 40} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ff9280" />
          <stop offset="55%" stopColor="#e63b3b" />
          <stop offset="100%" stopColor="#b21f2d" />
        </radialGradient>
      </defs>
      {/* band */}
      <path d="M20 13 Q21 6 24 5" fill="none" stroke="#7c4a25" strokeWidth="2.2" strokeLinecap="round" />
      {/* barg */}
      <path d="M21 9 Q29 4 31 11 Q24 13 21 9 Z" fill="#4fae55" stroke="#3c8a41" strokeWidth=".7" />
      {/* tana */}
      <path d="M20 13 C17 9 11 8 8 12 C4 17 5 28 11 35 C14 38 17 37 20 36 C23 37 26 38 29 35 C35 28 36 17 32 12 C29 8 23 9 20 13 Z" fill={`url(#${id})`} stroke="#a11d2a" strokeWidth="1" />
      {/* blik */}
      <ellipse cx="13.5" cy="19" rx="4" ry="6" fill="#fff" opacity=".3" />
    </svg>
  );
};

// SAVAT KANONI (bitta o'nlik = 10 olma to'plami): to'qilgan savat + ichida olmalar + "10" nishoni.
// Bola savatning ichidagi olmalarni QAYTA sanamaydi — savat bitta birlik-o'nlik.
const Basket = ({ w = 48 }) => {
  const id = 'pq2104b' + (__gid++);
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
      {/* "10" nishoni */}
      <circle cx="53" cy="12" r="9.5" fill="#1a7f43" stroke="#fff" strokeWidth="2" />
      <text x="53" y="15.6" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
    </svg>
  );
};

// Bog' burchagi bargligi (dekorativ) — bir nechta olma osilgan bargli shox.
const Foliage = ({ flip }) => (
  <svg width="94" height="76" viewBox="0 0 94 76" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M0 0 Q42 -4 70 16 Q90 30 76 46 Q58 60 32 50 Q6 40 0 0 Z" fill="#6cbf5a" opacity=".93" />
    <path d="M8 8 Q40 8 64 22" fill="none" stroke="#4f9e43" strokeWidth="2" opacity=".5" />
    <circle cx="52" cy="42" r="6.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
    <circle cx="30" cy="30" r="5.5" fill="#ef5a52" stroke="#a11d2a" strokeWidth="1" />
  </svg>
);

export default function D21_04(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2104">
      <style>{`
        .pq2104{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2104 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2104 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2104 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2104 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2104 .pq-scene{position:relative;width:380px;max-width:100%;height:230px;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe4f5 0%,#d8f0e0 60%,#cfeccb 100%);border:2px solid #bfe0cf;overflow:hidden;}
        .pq2104 .pq-sun{position:absolute;left:16px;top:13px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#ffcf3f 70%,#f5b012);box-shadow:0 0 18px 5px rgba(255,207,63,.5);z-index:2;animation:pq2104sun 3.6s ease-in-out infinite;pointer-events:none;}
        .pq2104 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#8fd06a,#6bb84e);border-top:3px solid #5aa53f;z-index:1;pointer-events:none;}
        .pq2104 .pq-fol{position:absolute;z-index:1;transform-origin:top center;pointer-events:none;}
        .pq2104 .pq-fol.f1{right:-8px;top:-6px;animation:pq2104sway 3.8s ease-in-out infinite;}
        .pq2104 .pq-fol.f2{left:-14px;bottom:22px;transform:scale(.66);transform-origin:bottom left;animation:pq2104sway 4.4s ease-in-out .6s infinite;}
        .pq2104 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7d43);border:2.5px solid #226539;color:#effaf1;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2104 .pq-numwrap{position:absolute;left:0;right:0;top:52%;transform:translateY(-50%);display:flex;justify-content:center;gap:16px;z-index:4;}
        .pq2104 .pq-slot{position:relative;display:flex;flex-direction:column;align-items:center;}
        .pq2104 .pq-card{width:68px;height:90px;border-radius:16px;background:#fffdf6;border:3px solid #e3c58f;display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:900;color:#8a5a2b;font-variant-numeric:tabular-nums;box-shadow:0 6px 14px rgba(120,80,30,.22),inset 0 2px 0 rgba(255,255,255,.7);}
        .pq2104 .pq-slot.units .pq-card{border-color:#f0a63a;}
        .pq2104 .pq-slot.units .pq-card.hl{animation:pq2104ring 1.6s ease-in-out infinite;}
        .pq2104 .pq-slot.units.won .pq-card{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2104pop .5s ease;}
        .pq2104 .pq-slot.tens.won .pq-card{border-color:#4a90d9;background:#eef5fc;color:#2f6bab;}
        .pq2104 .pq-place{margin-top:8px;font-size:12px;font-weight:800;letter-spacing:.02em;text-transform:uppercase;color:#5c6672;opacity:0;transform:translateY(-4px);transition:.3s;}
        .pq2104 .pq-slot.won .pq-place{opacity:1;transform:translateY(0);}
        .pq2104 .pq-slot.units .pq-place{color:#1a7f43;}
        .pq2104 .pq-slot.tens .pq-place{color:#2f6bab;}
        .pq2104 .pq-qbubble{position:absolute;top:-15px;left:50%;transform:translateX(-50%);width:24px;height:24px;border-radius:50%;background:#f0a63a;color:#fff;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,.2);animation:pq2104bob 1.4s ease-in-out infinite;z-index:6;pointer-events:none;}

        .pq2104 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pq2104twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));pointer-events:none;}
        .pq2104 .pq-spark.s2{animation-delay:-.6s;} .pq2104 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2104 .pq-decomp{display:flex;justify-content:center;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-top:14px;animation:pq2104in .3s ease both;}
        .pq2104 .pq-grp{display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pq2104 .pq-row{display:flex;justify-content:center;align-items:flex-end;gap:5px;flex-wrap:wrap;max-width:210px;}
        .pq2104 .pq-it{line-height:0;animation:pq2104in .35s var(--d,0s) both;}
        .pq2104 .pq-gl{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2104 .pq-gl.blue{color:#2f6bab;} .pq2104 .pq-gl.green{color:#1a7f43;}
        .pq2104 .pq-op{align-self:center;font-size:26px;font-weight:900;color:#5c6672;}

        .pq2104 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:12px;animation:pq2104in .3s .1s both;}
        .pq2104 .pq-eq b{min-width:44px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef5fc;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2104 .pq-eq b.one{background:#e8f7ee;border-color:#8fd0a6;color:#1a7f43;}
        .pq2104 .pq-eq b.res{background:#fff5e6;border-color:#f0a63a;color:#b06b12;}
        .pq2104 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq2104 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2104 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2104 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2104 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2104 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2104 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2104cele .5s ease;}
        .pq2104 .pq-opt:disabled{cursor:default;}
        .pq2104 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2104in .22s ease both;}
        .pq2104 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2104 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2104sun{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pq2104sway{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pq2104ring{0%,100%{box-shadow:0 6px 14px rgba(120,80,30,.22),0 0 0 0 rgba(240,166,58,.55);}50%{box-shadow:0 6px 14px rgba(120,80,30,.22),0 0 0 8px rgba(240,166,58,0);}}
        @keyframes pq2104bob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pq2104pop{0%{transform:scale(1);}35%{transform:scale(1.07);}70%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2104cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2104twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2104in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-fol f1"><Foliage /></span>
        <span className="pq-fol f2"><Foliage flip /></span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-numwrap">
          {/* O'nliklar xonasi — 4 */}
          <div className={'pq-slot tens' + (ok ? ' won' : '')}>
            <div className="pq-card">{TENS_DIGIT}</div>
            <span className="pq-place">{t.tens}</span>
          </div>
          {/* Birliklar xonasi — so'ralayotgan xona: javob YASHIRIN («?»), faqat g'alabada 7 ochiladi */}
          <div className={'pq-slot units' + (ok ? ' won' : '')}>
            <div className={'pq-card' + (ok ? '' : ' hl')}>{ok ? UNITS_DIGIT : '?'}</div>
            <span className="pq-place">{t.units}</span>
          </div>
        </div>

        <span className="pq-grass" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '30px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '52px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '24px' }}>✦</span>
        </>)}
      </div>

      {/* G'alabada 47 = 4 savat (o'nlik) + 7 olma (birlik). O'nlik va birlik QO'SHILADI. */}
      {ok && (<>
        <div className="pq-decomp">
          <div className="pq-grp">
            <div className="pq-row">
              {Array.from({ length: TENS_DIGIT }).map((_, i) => (
                <span key={i} className="pq-it" style={{ '--d': `${i * 0.08}s` }}><Basket w={44} /></span>
              ))}
            </div>
            <span className="pq-gl blue">{TENS_DIGIT} {t.basketWord}</span>
          </div>
          <span className="pq-op">{'+'}</span>
          <div className="pq-grp">
            <div className="pq-row">
              {Array.from({ length: UNITS_DIGIT }).map((_, i) => (
                <span key={i} className="pq-it" style={{ '--d': `${(TENS_DIGIT + i) * 0.08}s` }}><Apple w={26} /></span>
              ))}
            </div>
            <span className="pq-gl green">{UNITS_DIGIT} {t.appleWord}</span>
          </div>
        </div>
        <div className="pq-eq"><b>{TENS_DIGIT * 10}</b><i>{'+'}</i><b className="one">{UNITS_DIGIT}</b><i>=</i><b className="res">{NUM}</b></div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
