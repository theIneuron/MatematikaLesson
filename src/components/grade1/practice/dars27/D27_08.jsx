// Dars27 · Amaliyot 08 — Ko'p-tanlov «Olma bog'i» · 🔴 · tag: ts_multi
// Bog' peshtaxtasi: 5 ifoda-karta. Ayirmasi aynan 34 bo'lganlarning BARCHASINI belgila.
// [0] "47 − 13" =34 ✓  [1] "68 − 34" =34 ✓  [2] "56 − 22" =34 ✓
// [3] "47 − 14" =33 ✗ tuzoq (birlikdan bittasi kam)  [4] "58 − 26" =32 ✗ tuzoq (birlikda ikki farq).
// GOOD = {0,1,2}. Razryad bo'yicha ayirish: o'nlikdan o'nlik, birlikdan birlik (o'tishsiz).
// Kartalarda FAQAT ifoda matni (bezak savat YO'Q — har sonni noto'g'ri ko'rsatmasin).
// MINUS = U+2212 «−» (ASCII '-' EMAS). Javob (34) g'alabagacha ko'rinmaydi (AnsPop).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const M = '−'; // U+2212 minus (barcha ayirish belgilari shu)
const TARGET = 34;
// Har karta: a − b ayirma (o'tishsiz, razryad bo'yicha).
const CARDS = [
  { a: 47, b: 13 }, // 47 − 13 = 34 ✓  (4−1=3 o'nlik, 7−3=4 birlik)
  { a: 68, b: 34 }, // 68 − 34 = 34 ✓  (6−3=3 o'nlik, 8−4=4 birlik)
  { a: 56, b: 22 }, // 56 − 22 = 34 ✓  (5−2=3 o'nlik, 6−2=4 birlik)
  { a: 47, b: 14 }, // 47 − 14 = 33 ✗ tuzoq (birlikdan bittasi ko'p ayirilgan)
  { a: 58, b: 26 }, // 58 − 26 = 32 ✗ tuzoq (birlikda ikki farq)
];
const cardVal = (c) => c.a - c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} ${M} ${c.b}`;

const DATA = { good: [0, 1, 2], target: TARGET, ptype: 'P13', level: '🔴', tag: 'ts_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Ayirish",
    title: "Ayirmasi 34",
    setup: "Misollarga qarang.",
    ask: "Ayirmasi 34 bo'lgan BARCHA misolni bosing.",
    correct: `Barakalla! 47 ${M} 13, 68 ${M} 34, 56 ${M} 22 — hammasi 34.`,
    hint: "Har misolda o'nlikdan o'nlik, birlikdan birlik ayiring.",
  },
  ru: {
    eyebrow: 'Яблоневый сад · Вычитание',
    title: 'Разность 34',
    setup: 'Посмотри на примеры.',
    ask: 'Нажми ВСЕ примеры с разностью 34.',
    correct: `Молодец! 47 ${M} 13, 68 ${M} 34, 56 ${M} 22 — все дают 34.`,
    hint: 'В каждом примере вычитай десятки и единицы.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): radial 2-ton tana, bandak, barg, oq blik. (Dars21 kanoni)
const Apple = ({ w = 22 }) => {
  const id = 'pq2708a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10» nishoni.
// Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi. (Dars21 kanoni)
const Basket = ({ w = 40 }) => {
  const id = 'pq2708b' + (__gid++);
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

// «34» NISHON: yog'och yorliq, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
// Bu izlanayotgan ayirma — kartalardagi javob EMAS (javobni bola o'zi topadi).
const TargetSign = () => (
  <svg viewBox="0 0 68 48" width="60" height="42" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="30" y="34" width="8" height="12" rx="2" fill="#8a5a2c" />
    <rect x="4" y="4" width="60" height="32" rx="9" fill="#4c9d55" stroke="#2c6633" strokeWidth="2.6" />
    <rect x="10" y="8" width="28" height="8" rx="4" fill="#7fc47f" opacity="0.8" />
    <text x="34" y="28" textAnchor="middle" fontSize="19" fontWeight="900" fill="#f0fbef" fontFamily="Manrope, sans-serif">34</text>
    <polygon className="pq-glint" points="52,8 53.4,12 57.4,13.4 53.4,14.8 52,18.8 50.6,14.8 46.6,13.4 50.6,12" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D27_08(props) {
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
  // Sahna bezaklari — bosilmaydigan nishonlar, shuning uchun yengil ambient jonlanish mumkin.
  const deco = [0, 1, 2, 3];

  return (
    <div className="pq pq2708">
      <style>{`
        .pq2708{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2708 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2708 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2708 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2708 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2708 .pq-stage{position:relative;border-radius:22px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        .pq2708 .pq-sky{position:relative;height:96px;}
        .pq2708 .pq-sun{position:absolute;left:20px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2708sun 3.6s ease-in-out infinite;}
        .pq2708 .pq-signw{position:absolute;left:50%;top:12px;transform:translateX(-50%);line-height:0;z-index:3;}
        .pq2708 .pq-signbr{display:inline-block;line-height:0;animation:pq2708breath 2.4s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(44,102,51,.32));}
        .pq2708 .pq-signbr.win{animation:pq2708cele .6s ease;}
        .pq2708 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pq2708glint 3.4s ease-in-out infinite;}
        .pq2708 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:54px;z-index:1;pointer-events:none;}
        .pq2708 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;}
        .pq2708 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2708 .pq-decos{position:absolute;left:14px;bottom:12px;display:flex;align-items:flex-end;gap:9px;z-index:2;}
        .pq2708 .pq-decoa{position:absolute;right:16px;bottom:14px;display:flex;align-items:flex-end;gap:5px;z-index:2;}
        .pq2708 .pq-obj{line-height:0;}
        .pq2708 .pq-obj.idle{animation:pq2708bob 3s ease-in-out infinite;animation-delay:var(--bd,0s);}

        /* z-index:3 — kartalar pq-shelf (z1) va bezaklardan (z2) OLDINDA turadi; aks holda
           pastki qatordagi karta (58 minus 26) tepalik foniga cho'kib ko'rinmay qoladi */
        .pq2708 .pq-cards{position:relative;z-index:3;display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:15px 12px 12px;}
        .pq2708 .pq-card{position:relative;min-width:132px;display:flex;align-items:center;justify-content:center;padding:18px 16px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,110,150,.12);font-family:inherit;}
        .pq2708 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,150,110,.2);}
        .pq2708 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2708 .pq-card:disabled{cursor:default;}
        .pq2708 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2708 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2708cele .55s ease;}
        .pq2708 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq2708 .pq-clabel{display:flex;align-items:baseline;gap:9px;font-size:27px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2708 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2708 .pq-eq{color:#1a7f43;font-size:20px;font-weight:900;animation:pq2708pop .4s ease both;}
        .pq2708 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;pointer-events:none;animation:pq2708tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2708 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2708in .22s ease both;}
        .pq2708 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2708 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2708breath{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pq2708glint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pq2708sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2708bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2708pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2708tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2708cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2708in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          <span className="pq-signw"><span className={'pq-signbr' + (ok ? ' win' : '')}><TargetSign /></span></span>
        </div>
        <div className="pq-shelf">
          <span className="pq-hill" />
          {/* bezak savatlar (o'nliklar) — bosilmaydigan, yengil tebranadi */}
          <div className="pq-decos">
            {deco.map((i) => (
              <span key={i} className="pq-obj idle" style={{ '--bd': `${i * 0.22}s` }}><Basket w={34} /></span>
            ))}
          </div>
          {/* bezak yakka olmalar (birliklar) */}
          <div className="pq-decoa">
            {deco.map((i) => (
              <span key={i} className="pq-obj idle" style={{ '--bd': `${0.15 + i * 0.2}s` }}><Apple w={20} /></span>
            ))}
          </div>
        </div>

        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
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
