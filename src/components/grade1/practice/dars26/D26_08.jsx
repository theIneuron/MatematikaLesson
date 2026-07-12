// Dars26 · Amaliyot 08 — Ko'p-tanlov «Olma bog'i» · 🔴 · tag: tt_multi
// Ikki xonali + ikki xonali (o'tishsiz). 5 ifoda-karta; javobi aynan 59 bo'lganlarni BARCHASINI belgila.
// [0] "34 + 25" =59 ✓  [1] "43 + 16" =59 ✓  [2] "36 + 23" =59 ✓
// [3] "34 + 15" =49 ✗ tuzoq  [4] "42 + 16" =58 ✗ tuzoq. GOOD = {0,1,2}.
// MODEL: razryad bo'yicha qo'shish — o'nlik+o'nlik, birlik+birlik (34+25: 3+2=5 o'nlik, 4+5=9 birlik -> 59).
// Chalg'ituvchi tuzilishi: M1 barcha raqamni qo'shish (3+4+2+5=14), M2 faqat bitta razryad (30+20=50),
// M3 razryadlarni almashtirish. QO'SHISH — minus YO'Q. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 59;
// Har karta: a + b yig'indi (ikkalasi ham ikki xonali, o'tishsiz).
const CARDS = [
  { a: 34, b: 25 }, // 34 + 25 = 59 ✓
  { a: 43, b: 16 }, // 43 + 16 = 59 ✓
  { a: 36, b: 23 }, // 36 + 23 = 59 ✓
  { a: 34, b: 15 }, // 34 + 15 = 49 ✗ tuzoq
  { a: 42, b: 16 }, // 42 + 16 = 58 ✗ tuzoq
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} + ${c.b}`;

const DATA = { good: [0, 1, 2], target: 59, level: '🔴', tag: 'tt_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Qo'shish",
    title: "Javobi 59",
    setup: "Kartochkalarda 5 ta misol bor.",
    ask: "Javobi 59 bo'lgan BARCHA misollarni bosing.",
    correct: "Barakalla! 34+25, 43+16, 36+23 — hammasining javobi 59.",
    hint: "Har misolda o'nlikka o'nlikni, birlikka birlikni qo'shing.",
    tens: "o'nliklar",
    units: "birliklar",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сложение",
    title: "Ответ 59",
    setup: "На карточках 5 примеров.",
    ask: "Нажми ВСЕ примеры с ответом 59.",
    correct: "Молодец! 34+25, 43+16, 36+23 — у всех ответ 59.",
    hint: "В каждом примере сложи десятки с десятками, единицы с единицами.",
    tens: "десятки",
    units: "единицы",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — Dars21 kanoni: yumaloq 2-ton tana + bandak + barg + oq blik.
const Apple = ({ w = 22 }) => {
  const id = 'pq2608a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
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

// SAVAT (bitta o'nlik = 10 olma) — Dars21 kanoni: to'qima savat, olmalar mo'ralaydi, «10» nishoni.
const Basket = ({ w = 34 }) => {
  const id = 'pq2608b' + (__gid++);
  const ap = id + 'ap';
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
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

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D26_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(cardLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // G'alaba izohi uchun namuna: 34 + 25 razryad bo'yicha (o'nlik+o'nlik, birlik+birlik).
  const ex = CARDS[0];
  const exTens = Math.floor(ex.a / 10) + Math.floor(ex.b / 10); // 3 + 2 = 5
  const exUnits = (ex.a % 10) + (ex.b % 10);                    // 4 + 5 = 9

  return (
    <div className="pq pq2608">
      <style>{`
        .pq2608{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2608 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2608 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2608 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2608 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2608 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#cfeafc 0%,#e4f4d9 55%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq2608 .pq-sky{position:relative;height:70px;}
        .pq2608 .pq-sun{position:absolute;left:20px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 15px 3px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2608sun 3.6s ease-in-out infinite;}
        /* bezak daraxti — tebranadigan shox-barg (bosilmaydi) */
        .pq2608 .pq-tree{position:absolute;bottom:2px;right:16px;z-index:1;pointer-events:none;transform-origin:50% 100%;animation:pq2608sway 4.6s ease-in-out infinite;}
        .pq2608 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:7px;height:22px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2608 .pq-crown{width:50px;height:42px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2608 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2608 .pq-deco{position:absolute;left:18px;bottom:4px;display:flex;align-items:flex-end;gap:6px;z-index:1;pointer-events:none;opacity:.96;}
        .pq2608 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;font-variant-numeric:tabular-nums;}

        .pq2608 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 12px;}
        .pq2608 .pq-card{position:relative;min-width:120px;display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 16px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,110,150,.12);font-family:inherit;}
        .pq2608 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,130,90,.2);}
        .pq2608 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2608 .pq-card:disabled{cursor:default;}
        .pq2608 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2608 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2608cele .55s ease;}
        .pq2608 .pq-card.dim{opacity:.42;filter:grayscale(.32);}
        .pq2608 .pq-clabel{font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2608 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2608 .pq-eq{color:#1a7f43;font-size:21px;font-weight:900;font-variant-numeric:tabular-nums;animation:pq2608pop .4s ease both;}
        .pq2608 .pq-spark{position:absolute;top:6px;right:9px;line-height:0;pointer-events:none;animation:pq2608tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        /* g'alaba: 34 + 25 razryad bo'yicha (o'nlik+o'nlik, birlik+birlik) */
        .pq2608 .pq-model{margin-top:14px;padding:12px 14px;border-radius:16px;background:#f2f9f2;border:2px solid #cfe6cf;animation:pq2608in .3s ease both;}
        .pq2608 .pq-mhead{text-align:center;font-size:14px;font-weight:800;color:#3f8a41;font-variant-numeric:tabular-nums;margin-bottom:8px;}
        .pq2608 .pq-mrow{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:5px 0;}
        .pq2608 .pq-mtag{min-width:74px;font-size:13px;font-weight:800;color:#5c6672;text-align:right;}
        .pq2608 .pq-glyphs{display:flex;align-items:flex-end;gap:3px;line-height:0;}
        .pq2608 .pq-mplus{font-size:18px;font-weight:900;color:#8a94a2;}
        .pq2608 .pq-meq{font-size:16px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;}
        .pq2608 .pq-mfin{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:8px;padding-top:8px;border-top:2px dashed #cfe6cf;}
        .pq2608 .pq-mfin b{min-width:40px;height:36px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2608 .pq-mfin b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2608 .pq-mfin i{font-style:normal;font-size:19px;font-weight:900;color:#8a94a2;}

        .pq2608 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2608in .22s ease both;}
        .pq2608 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2608 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2608sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2608sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2608pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2608tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2608cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2608in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          {/* bezak: savat va olmalar (aniq javobni bermaydi — faqat bog' foni) */}
          <div className="pq-deco">
            <Basket w={40} />
            <Apple w={22} />
            <Apple w={20} />
          </div>
          <div className="pq-tree"><span className="pq-crown"><i style={{ left: '12px', top: '12px' }} /><i style={{ left: '30px', top: '20px' }} /><i style={{ left: '22px', top: '30px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-title">{t.title}</div>
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                <span className="pq-clabel">{cardLabel(c)}</span>
                {ok && good && <b className="pq-eq">= {TARGET}</b>}
                {ok && good && <span className="pq-spark"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* G'alaba: 34 + 25 misolida razryad bo'yicha qo'shish — o'nlik+o'nlik, birlik+birlik */}
      {ok && (
        <div className="pq-model">
          <div className="pq-mhead">{ex.a} + {ex.b}</div>
          <div className="pq-mrow">
            <span className="pq-mtag">{t.tens}:</span>
            <span className="pq-glyphs">{Array.from({ length: Math.floor(ex.a / 10) }).map((_, k) => <Basket key={'ta' + k} w={30} />)}</span>
            <span className="pq-mplus">{'+'}</span>
            <span className="pq-glyphs">{Array.from({ length: Math.floor(ex.b / 10) }).map((_, k) => <Basket key={'tb' + k} w={30} />)}</span>
            <span className="pq-meq">= {exTens}</span>
          </div>
          <div className="pq-mrow">
            <span className="pq-mtag">{t.units}:</span>
            <span className="pq-glyphs">{Array.from({ length: ex.a % 10 }).map((_, k) => <Apple key={'ua' + k} w={20} />)}</span>
            <span className="pq-mplus">{'+'}</span>
            <span className="pq-glyphs">{Array.from({ length: ex.b % 10 }).map((_, k) => <Apple key={'ub' + k} w={20} />)}</span>
            <span className="pq-meq">= {exUnits}</span>
          </div>
          <div className="pq-mfin"><b>{exTens * 10}</b><i>{'+'}</i><b>{exUnits}</b><i>=</i><b className="res">{TARGET}</b></div>
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
