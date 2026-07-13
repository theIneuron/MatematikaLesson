// Dars31 · Amaliyot 08 — Ko'p-tanlov «Ikki qadamli masala» · 🔴 · tag: multi
// TABIAT SAHNASI (D15_01 etaloni): osmon, quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar, olmali daraxt. Yog'och taxtachada nishon-son «6» (quyoncha yonida turadi).
// Ikki qadamli ifoda-kartalar (a op1 b op2 c). Javobi aynan 6 bo'lgan BARCHA kartani belgilang.
// Har karta 2 qadamda hisoblanadi: qadam1 = a op1 b, qadam2 = natija op2 c. TARGET = 6.
// [0] "4 + 3 − 1"=6 to'g'ri  [1] "5 + 3 − 2"=6 to'g'ri  [2] "8 − 4 + 2"=6 to'g'ri  [3] "9 − 2 − 2"=5 tuzoq.
// GOOD={0,1,2}. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Win-reveal: g'alabada har to'g'ri kartada "= 6" chiqadi, tuzoq xiralashadi (natija win'gacha yopiq).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 6;
// Har karta ikki qadamli: a op1 b op2 c.  op: '+' qo'shish, '-' ayirish.
const CARDS = [
  { a: 4, op1: '+', b: 3, op2: '-', c: 1 }, // 4+3=7, 7−1=6 to'g'ri
  { a: 5, op1: '+', b: 3, op2: '-', c: 2 }, // 5+3=8, 8−2=6 to'g'ri
  { a: 8, op1: '-', b: 4, op2: '+', c: 2 }, // 8−4=4, 4+2=6 to'g'ri
  { a: 9, op1: '-', b: 2, op2: '-', c: 2 }, // 9−2=7, 7−2=5 tuzoq
];
const SIGN = { '-': '−', '+': '+' };
const step1 = (c) => (c.op1 === '+' ? c.a + c.b : c.a - c.b);
const cardVal = (c) => (c.op2 === '+' ? step1(c) + c.c : step1(c) - c.c);
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} ${SIGN[c.op1]} ${c.b} ${SIGN[c.op2]} ${c.c}`;

const DATA = { good: GOOD, target: TARGET, ptype: 'multi', level: '🔴', tag: 'multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala",
    title: "Javobi 6",
    setup: "Kartalarni ikki qadamda hisoblang.",
    ask: "Javobi 6 bo'lgan barcha kartani belgilang.",
    board: "Javob",
    correct: "Barakalla! Uch kartaning javobi 6.",
    hint: "Avval birinchi amal, keyin ikkinchi amal. Javobi 6 mi?",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача",
    title: "Ответ 6",
    setup: "Посчитай карточки в два шага.",
    ask: "Отметь все карточки с ответом 6.",
    board: "Ответ",
    correct: "Молодец! У трёх карточек ответ 6.",
    hint: "Сначала первое действие, потом второе. Ответ равен 6?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda). (D15_01 etalonidan)
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
// O't tutami (maysada). (D15_01 etalonidan)
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
// Qo'ziqorin (daraxt yonida). (D15_01 etalonidan)
const Mushroom = ({ cls }) => (
  <svg className={'pq-mush ' + cls} viewBox="0 0 18 17" width="16" height="15" aria-hidden="true">
    <rect x="6.4" y="8" width="5.2" height="8" rx="2.2" fill="#f4ecd8" stroke="#dccfa8" strokeWidth=".7" />
    <path d="M1.5 8.5 C1.5 3.5 5 1 9 1 C13 1 16.5 3.5 16.5 8.5 Z" fill="#e0584c" stroke="#bf4136" strokeWidth=".8" />
    <circle cx="5.5" cy="6" r="1.1" fill="#fff" /><circle cx="10.5" cy="4.6" r="1.3" fill="#fff" /><circle cx="12.6" cy="7" r="1" fill="#fff" />
  </svg>
);

// Quyoncha (yon ko'rinish, o'ngga qarab) — kurs maskoti. (D15_01 etalonidan, gradient id'lari lokal)
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="44" height="40.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="bfur3108" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="bhead3108" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur3108)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead3108)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead3108)" stroke="#a8977f" strokeWidth="1" />
    <path d="M36.4 17 C34 7.5 36.2 3.6 37.6 3.8 C39 4 39.4 9.5 38.8 17 Z" fill="#f3bccb" />
    <ellipse cx="41" cy="29" rx="4.5" ry="3" fill="#d3c0a6" opacity=".55" />
    <ellipse cx="41.6" cy="23.4" rx="2.1" ry="2.4" fill="#3a322c" />
    <circle cx="42.4" cy="22.5" r="0.8" fill="#fff" />
    <path d="M47.6 26.4 L45.4 25.3 L45.4 27.5 Z" fill="#e08aa0" />
    <path d="M46.4 27.3 Q46.4 29 45 29" fill="none" stroke="#a8977f" strokeWidth="0.8" strokeLinecap="round" />
    <g stroke="#c9b79c" strokeWidth="0.7" strokeLinecap="round">
      <line x1="46" y1="26" x2="52" y2="24.5" /><line x1="46" y1="27" x2="52" y2="27" /><line x1="46" y1="28" x2="51.5" y2="29.5" />
    </g>
    <ellipse cx="34.5" cy="42" rx="5" ry="3" fill="#d3c0a6" stroke="#ac9678" strokeWidth="1" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D31_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
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
    <div className={"pq pq3108" + (still ? " still" : "")}>
      <style>{`
        .pq3108{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3108 *{box-sizing:border-box;}
        .pq3108.still *{animation:none !important;}
        .pq3108 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3108 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3108 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3108 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3108 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:14px;}
        /* ===== TABIAT SAHNASI (D15_01 etaloni) ===== */
        .pq3108 .pq-scene{position:relative;width:404px;max-width:100%;height:236px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3108 .pq-sun{position:absolute;top:16px;left:22px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3108Sun 4s ease-in-out infinite;z-index:1;}
        .pq3108 .pq-cloud{position:absolute;height:15px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3108 .pq-cloud::before,.pq3108 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3108 .pq-cloud::before{width:20px;height:20px;top:-8px;left:8px;} .pq3108 .pq-cloud::after{width:15px;height:15px;top:-6px;left:24px;}
        .pq3108 .pq-cloud.c1{top:22px;left:60%;width:42px;animation:pq3108Drift 14s ease-in-out infinite;}
        .pq3108 .pq-cloud.c2{top:48px;left:32%;width:32px;transform:scale(.8);animation:pq3108Drift 18s ease-in-out infinite reverse;}
        .pq3108 .pq-hills{position:absolute;left:0;right:0;bottom:70px;height:64px;z-index:1;}
        .pq3108 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3108 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3108 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq3108 .pq-hills span:nth-child(3){left:32%;width:40%;height:48px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3108 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:78px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3108 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3108 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3108 .pq-flower.f1{left:18%;bottom:54px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3108 .pq-flower.f2{right:26%;bottom:48px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3108 .pq-flower.f3{left:7%;bottom:50px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3108 .pq-flower.f4{left:88%;bottom:52px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3108 .pq-tuft{position:absolute;z-index:3;}
        .pq3108 .pq-tuft.t1{left:26%;bottom:44px;} .pq3108 .pq-tuft.t2{left:62%;bottom:46px;transform:scale(.85);}
        .pq3108 .pq-mush{position:absolute;z-index:3;left:50px;bottom:44px;}
        /* olmali daraxt (chapda, tepalikda) */
        .pq3108 .pq-tree{position:absolute;left:8px;bottom:62px;width:44px;height:52px;z-index:2;}
        .pq3108 .pq-tree i{position:absolute;}
        .pq3108 .pq-trunk{left:18px;bottom:0;width:8px;height:18px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3108 .pq-leaves{left:0;bottom:12px;width:44px;height:40px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:12px 8px 0 -8px #6fb552,-8px 9px 0 -10px #67ac4c;}
        .pq3108 .pq-fruit{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff9b8a,#d84438);box-shadow:0 1px 1px rgba(0,0,0,.25);z-index:3;}
        .pq3108 .pq-fruit.fr1{left:9px;bottom:34px;} .pq3108 .pq-fruit.fr2{left:26px;bottom:42px;} .pq3108 .pq-fruit.fr3{left:31px;bottom:24px;}
        .pq3108 .pq-bush{position:absolute;right:12px;bottom:60px;width:34px;height:20px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-12px 3px 0 -7px #6fb552;}
        /* kapalaklar */
        .pq3108 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3108 .pq-bfly::before,.pq3108 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3108 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3108Wing .26s ease-in-out infinite alternate;}
        .pq3108 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3108Wing .26s ease-in-out infinite alternate;}
        .pq3108 .pq-bfly.bf1::before,.pq3108 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3108 .pq-bfly.bf2::before,.pq3108 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3108 .pq-bfly.bf1{top:72px;left:24%;animation:pq3108Flit1 8s ease-in-out infinite;}
        .pq3108 .pq-bfly.bf2{top:92px;right:24%;animation:pq3108Flit2 9s ease-in-out infinite;}
        /* qushlar */
        .pq3108 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3108 .pq-bird.b1{top:28px;left:44%;animation:pq3108Fly 7s ease-in-out infinite;}
        .pq3108 .pq-bird.b2{top:44px;left:56%;transform:scale(.78);animation:pq3108Fly 9s ease-in-out infinite;}
        /* quyoncha maysada (nishon yonida) */
        .pq3108 .pq-bunny{position:absolute;right:26px;bottom:22px;z-index:4;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));animation:pq3108Idle 2.8s ease-in-out infinite;}
        .pq3108 .pq-bunny.win{animation:pq3108Hop .7s ease;}
        /* yog'och taxtacha — nishon-son «6» */
        .pq3108 .pq-sign{position:absolute;top:62px;left:50%;transform:translateX(-50%);z-index:5;display:flex;flex-direction:column;align-items:center;gap:5px;padding:9px 16px 12px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq3108 .pq-sign::before,.pq3108 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:24px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq3108 .pq-sign::before{left:20px;} .pq3108 .pq-sign::after{right:20px;}
        .pq3108 .pq-sign-lab{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fbe9d2;text-shadow:0 1px 1px rgba(60,40,15,.4);}
        .pq3108 .pq-sign-tile{min-width:44px;height:48px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;border-radius:12px;background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        .pq3108 .pq-sign-tile.win{animation:pq3108Pop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3108 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pq3108Twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3108 .pq-wstar.s2{animation-delay:-.5s;} .pq3108 .pq-wstar.s3{animation-delay:-1.05s;}
        /* KARTALAR (ko'p-tanlov) */
        .pq3108 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;}
        .pq3108 .pq-card{position:relative;min-width:132px;display:flex;align-items:center;justify-content:center;padding:16px 14px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,130,90,.14);font-family:inherit;}
        .pq3108 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,130,90,.22);}
        .pq3108 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3108 .pq-card:disabled{cursor:default;}
        .pq3108 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq3108 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq3108Cele .55s ease;}
        .pq3108 .pq-card.dim{opacity:.42;filter:grayscale(.32);}
        .pq3108 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:24px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;white-space:nowrap;}
        .pq3108 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq3108 .pq-ceq{color:#1a7f43;font-size:19px;font-weight:900;animation:pq3108Pop .4s ease both;}
        .pq3108 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pq3108Twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3108 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3108In .22s ease both;}
        .pq3108 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3108 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3108Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3108Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3108Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3108Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3108Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3108Fly{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3108Idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq3108Hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-24px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq3108Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3108Twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3108Cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3108In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <Bird cls="b1" /><Bird cls="b2" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-hills"><span /><span /><span /></div>
          <div className="pq-grass" />
          <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /><i className="pq-fruit fr1" /><i className="pq-fruit fr2" /><i className="pq-fruit fr3" /></div>
          <Mushroom cls="m1" />
          <span className="pq-bush" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />

          {/* Yog'och taxtachada nishon-son «6» */}
          <div className="pq-sign">
            <span className="pq-sign-lab">{t.board}</span>
            <span className={'pq-sign-tile' + (ok ? ' win' : '')}>{TARGET}</span>
          </div>

          <span className={'pq-bunny' + (ok ? ' win' : '')}><Bunny /></span>

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '34%', top: '48px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar s2" style={{ left: '60%', top: '54px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar s3" style={{ left: '47%', top: '40px' }}><Star fill="#f2b134" /></span>
            </>
          )}
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
                  <span>{c.a} {SIGN[c.op1]} {c.b} {SIGN[c.op2]} {c.c}</span>
                  {ok && good && <b className="pq-ceq">{'='} {TARGET}</b>}
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
