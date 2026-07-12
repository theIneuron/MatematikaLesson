// Dars25 · Amaliyot 08 — Ko'p-tanlov «Olma bog'i» · 🔴 · tag: td_multi
// Ikki xonali + bir xonali (o'tishsiz). 5 ifoda-karta. Javobi aynan 39 bo'lganlarni BARCHASINI belgila.
// [0] "34 + 5" =39 ✓  [1] "36 + 3" =39 ✓  [2] "30 + 9" =39 ✓
// [3] "34 + 4" =38 ✗ tuzoq  [4] "35 + 3" =38 ✗ tuzoq. GOOD = {0,1,2}.
// KANON (Dars21): o'nlik = olma SAVATI ('10' nishoni), birlik = yakka olma. Barcha misol 30-larda —
// 3 savat (o'nliklar) O'ZGARMAYDI, faqat birliklar qo'shiladi. QO'SHISH — minus YO'Q. Natija < 100.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 39;
// Har karta: a + b (ikki xonali + bir xonali, birliklar yig'indisi < 10, o'tishsiz).
const CARDS = [
  { a: 34, b: 5 }, // 34 + 5 = 39 ✓
  { a: 36, b: 3 }, // 36 + 3 = 39 ✓
  { a: 30, b: 9 }, // 30 + 9 = 39 ✓
  { a: 34, b: 4 }, // 34 + 4 = 38 ✗ tuzoq (birliklarni kam sanash)
  { a: 35, b: 3 }, // 35 + 3 = 38 ✗ tuzoq (birliklarni kam sanash)
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} + ${c.b}`;

const DATA = { good: [0, 1, 2], target: 39, ptype: 'P13', level: '🔴', tag: 'td_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Qo'shish",
    title: "Javobi 39",
    setup: "Kartochkalarda 5 ta misol bor.",
    ask: "Javobi 39 bo'lgan BARCHA misollarni bosing.",
    correct: "Barakalla! 34+5, 36+3, 30+9 — hammasining javobi 39.",
    hint: "Har misolda birliklarni qo'shing, o'nlikni tekshiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сложение",
    title: "Ответ 39",
    setup: "На карточках 5 примеров.",
    ask: "Нажми ВСЕ примеры с ответом 39.",
    correct: "Молодец! 34+5, 36+3, 30+9 — у всех ответ 39.",
    hint: "В каждом примере сложи единицы, проверь десяток.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10» nishoni.
// Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta o'nlik. Dars21 kanoni. (Dekor: statik.)
const Basket = ({ w = 30 }) => {
  const id = 'pq2508b' + (__gid++);
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
      {/* olmalar to'plami savat ustidan mo'ralaydi */}
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      {/* savat gardishi */}
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      {/* savat tanasi */}
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      {/* tik to'qima */}
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      {/* ko'ndalang to'qima */}
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      {/* «10» nishoni — bu savat bitta o'nlik ekanini bildiradi */}
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Sahna bezagi, statik.)
const Apple = ({ w = 22 }) => {
  const id = 'pq2508a' + (__gid++);
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

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D25_08(props) {
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

  return (
    <div className="pq pq2508">
      <style>{`
        .pq2508{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2508 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2508 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2508 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2508 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2508 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#dff1fb 0%,#e9f6df 55%,#dcefc0 100%);border:2px solid #cfe3bd;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        /* ambient sahna (bosilmaydi): quyosh + tebranuvchi olma daraxtlari + taxta sarlavha */
        .pq2508 .pq-sky{position:relative;height:78px;}
        .pq2508 .pq-sun{position:absolute;left:20px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2508sun 3.6s ease-in-out infinite;}
        .pq2508 .pq-tree{position:absolute;bottom:2px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2508 .pq-tree.t1{left:14px;animation:pq2508sway 4.2s ease-in-out infinite;}
        .pq2508 .pq-tree.t2{right:16px;animation:pq2508sway 4.8s ease-in-out .6s infinite;}
        .pq2508 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:7px;height:22px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2508 .pq-crown{width:48px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2508 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2508 .pq-board{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;font-variant-numeric:tabular-nums;}
        /* tushuvchi barglar — bosilmaydigan dekor */
        .pq2508 .pq-leaf{position:absolute;top:-8px;width:9px;height:9px;border-radius:50% 0 50% 50%;background:#7cc86a;opacity:0;z-index:2;pointer-events:none;animation:pq2508fall 6s linear infinite;}
        .pq2508 .pq-leaf.l1{left:32%;animation-delay:0s;} .pq2508 .pq-leaf.l2{left:58%;background:#e0932f;animation-delay:2.1s;} .pq2508 .pq-leaf.l3{left:76%;animation-delay:4s;}

        .pq2508 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 12px;}
        .pq2508 .pq-card{position:relative;min-width:150px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:13px 14px 14px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,120,80,.12);font-family:inherit;}
        .pq2508 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,120,80,.2);}
        .pq2508 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2508 .pq-card:disabled{cursor:default;}
        .pq2508 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2508 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2508cele .55s ease;}
        .pq2508 .pq-card.dim{opacity:.44;filter:grayscale(.32);}
        /* karta bezagi: 3 savat (o'nliklar O'ZGARMAYDI) + yakka olma — statik, bosiladigan nishonda idle YO'Q */
        .pq2508 .pq-viz{display:flex;align-items:flex-end;justify-content:center;gap:3px;min-height:34px;}
        .pq2508 .pq-viz .pq-loose{margin-left:3px;}
        .pq2508 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2508 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2508 .pq-eq{color:#1a7f43;font-size:20px;font-weight:900;animation:pq2508pop .4s ease both;}
        .pq2508 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;pointer-events:none;animation:pq2508tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2508 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2508in .22s ease both;}
        .pq2508 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2508 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2508sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2508sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2508fall{0%{opacity:0;transform:translateY(0) rotate(0);}12%{opacity:.9;}100%{opacity:0;transform:translateY(74px) rotate(220deg);}}
        @keyframes pq2508pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2508tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2508cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2508in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '12px', top: '14px' }} /><i style={{ left: '28px', top: '9px' }} /><i style={{ left: '22px', top: '24px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '10px', top: '11px' }} /><i style={{ left: '28px', top: '20px' }} /></span><span className="pq-trunk" /></div>
          <span className="pq-leaf l1" /><span className="pq-leaf l2" /><span className="pq-leaf l3" />
          <div className="pq-board">{t.title}</div>
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                {/* Hisoblab-tanlash: karta = ifoda (soxta o'zgarmas savat-dekor olib tashlandi — review D25_08). */}
                <div className="pq-clabel">
                  <span>{cardLabel(c)}</span>
                  {ok && good && <b className="pq-eq">= {TARGET}</b>}
                </div>
                {ok && good && <span className="pq-spark"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
