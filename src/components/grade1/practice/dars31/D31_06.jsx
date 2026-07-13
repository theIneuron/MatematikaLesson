// Dars31 · Amaliyot 06 — 🔴 CHAIN ikki qadamli (a op1 b op2 c = ?) · tag: chain
// TABIAT SAHNASI (D15_01 etaloni): osmon, quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar, olmali daraxt. Yuqorida yog'och taxtacha — mavzu sarlavhasi.
// 4 misol 2×2 panjarada, har biri IKKI qadam: step1 = a op1 b → m, step2 = m op2 c → natija.
// Bola faol kartaning slotiga to'g'ri SONLI natijani tanlaydi; variantlar bitta qatorda.
// Sahnada 4 quyoncha (kurs maskoti) maysada o'tiradi — har biri bitta misolga to'g'ri keladi;
// g'alabada 1..4 raqamli nishon oladi va sakraydi. Natija slotlari yechilgunicha «?».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { a: 5, o1: '+', b: 2, o2: '−', c: 3, ans: 4, opts: [10, 4, 3, 7] },   // idx1
  { a: 8, o1: '−', b: 2, o2: '+', c: 1, ans: 7, opts: [11, 5, 7, 6] },   // idx2
  { a: 6, o1: '+', b: 3, o2: '−', c: 4, ans: 5, opts: [1, 9, 13, 5] },   // idx3
  { a: 9, o1: '−', b: 3, o2: '−', c: 2, ans: 4, opts: [4, 14, 6, 8] },   // idx0
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'chain' };
const rowLabel = (r) => `${r.a} ${r.o1} ${r.b} ${r.o2} ${r.c} = ?`;

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir",
    setup: "To'rt misol, har biri ikki qadam.",
    ask: "Har misolga to'g'ri javobni tanlang.",
    correct: "Barakalla! To'rtala javob to'g'ri!",
    hint: "Avval birinchi amal, chiqqan songa ikkinchi amalni qo'llang.",
    board: "Ikki qadamli zanjir",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка",
    setup: "Четыре примера, каждый в два шага.",
    ask: "Выбери верный ответ для каждого примера.",
    correct: "Молодец! Все четыре ответа верны!",
    hint: "Сначала первое действие, к результату примени второе.",
    board: "Цепочка в два шага",
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
  <svg viewBox="0 0 52 48" width="40" height="37" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="bfur3106" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="bhead3106" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur3106)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead3106)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead3106)" stroke="#a8977f" strokeWidth="1" />
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

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D31_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${rowLabel(r)} [${r.opts.join('/')}]`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const slotCls = (i) => 'pq-slot' + (vals[i] != null ? ' has' : '');

  return (
    <div className={'pq pq3106' + (still ? ' still' : '')}>
      <style>{`
        .pq3106{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3106 *{box-sizing:border-box;}
        .pq3106.still *{animation:none !important;}
        .pq3106 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3106 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3106 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3106 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3106 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:14px;}
        /* ===== TABIAT SAHNASI (D15_01 etaloni) ===== */
        .pq3106 .pq-scene{position:relative;width:404px;max-width:100%;height:300px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3106 .pq-sun{position:absolute;top:18px;left:22px;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3106Sun 4s ease-in-out infinite;z-index:1;}
        .pq3106 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3106 .pq-cloud::before,.pq3106 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3106 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3106 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3106 .pq-cloud.c1{top:30px;left:58%;width:46px;animation:pq3106Drift 14s ease-in-out infinite;}
        .pq3106 .pq-cloud.c2{top:60px;left:30%;width:34px;transform:scale(.8);animation:pq3106Drift 18s ease-in-out infinite reverse;}
        .pq3106 .pq-cloud.c3{top:16px;left:38%;width:30px;transform:scale(.72);animation:pq3106Drift 16s ease-in-out infinite;}
        .pq3106 .pq-hills{position:absolute;left:0;right:0;bottom:96px;height:70px;z-index:1;}
        .pq3106 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3106 .pq-hills span:nth-child(1){left:-8%;width:52%;height:62px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3106 .pq-hills span:nth-child(2){right:-6%;width:48%;height:70px;}
        .pq3106 .pq-hills span:nth-child(3){left:32%;width:40%;height:52px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3106 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:104px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3106 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3106 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3106 .pq-flower.f1{left:16%;bottom:80px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3106 .pq-flower.f2{right:28%;bottom:74px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3106 .pq-flower.f3{left:7%;bottom:76px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3106 .pq-flower.f4{left:90%;bottom:78px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3106 .pq-flower.f5{left:44%;bottom:78px;background:#ff7fa8;box-shadow:5px 0 0 #ff7fa8,-5px 0 0 #ff7fa8,0 5px 0 #ff7fa8,0 -5px 0 #ff7fa8;}
        .pq3106 .pq-tuft{position:absolute;z-index:3;}
        .pq3106 .pq-tuft.t1{left:24%;bottom:70px;} .pq3106 .pq-tuft.t2{left:64%;bottom:72px;transform:scale(.85);}
        .pq3106 .pq-mush{position:absolute;z-index:3;left:52px;bottom:70px;}
        /* olmali daraxt (chapda, tepalikda) — Dars31 bog' mavzusi */
        .pq3106 .pq-tree{position:absolute;left:8px;bottom:88px;width:46px;height:56px;z-index:2;}
        .pq3106 .pq-tree i{position:absolute;}
        .pq3106 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3106 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3106 .pq-fruit{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff9b8a,#d84438);box-shadow:0 1px 1px rgba(0,0,0,.25);z-index:3;}
        .pq3106 .pq-fruit.fr1{left:10px;bottom:38px;} .pq3106 .pq-fruit.fr2{left:27px;bottom:46px;} .pq3106 .pq-fruit.fr3{left:33px;bottom:27px;}
        .pq3106 .pq-bush{position:absolute;right:12px;bottom:84px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        /* kapalaklar */
        .pq3106 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3106 .pq-bfly::before,.pq3106 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3106 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3106Wing .26s ease-in-out infinite alternate;}
        .pq3106 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3106Wing .26s ease-in-out infinite alternate;}
        .pq3106 .pq-bfly.bf1::before,.pq3106 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3106 .pq-bfly.bf2::before,.pq3106 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3106 .pq-bfly.bf3::before,.pq3106 .pq-bfly.bf3::after{background:#a9e0ff;}
        .pq3106 .pq-bfly.bf1{top:96px;left:22%;animation:pq3106Flit1 8s ease-in-out infinite;}
        .pq3106 .pq-bfly.bf2{top:120px;right:20%;animation:pq3106Flit2 9s ease-in-out infinite;}
        .pq3106 .pq-bfly.bf3{top:138px;left:52%;animation:pq3106Flit1 10s ease-in-out infinite;}
        /* qushlar */
        .pq3106 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3106 .pq-bird.b1{top:30px;left:42%;animation:pq3106Fly 7s ease-in-out infinite;}
        .pq3106 .pq-bird.b2{top:46px;left:54%;transform:scale(.78);animation:pq3106Fly 9s ease-in-out infinite;}
        .pq3106 .pq-bird.b3{top:22px;left:66%;transform:scale(.9);animation:pq3106Fly 8s ease-in-out infinite;}
        /* yog'och taxtacha (mavzu sarlavhasi) */
        .pq3106 .pq-sign{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:5;max-width:74%;padding:9px 18px 11px;border-radius:13px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fdf6e8;font-size:14px;font-weight:800;letter-spacing:.02em;text-align:center;text-shadow:0 1px 1px rgba(90,60,20,.4);box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);}
        .pq3106 .pq-sign::before,.pq3106 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:26px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq3106 .pq-sign::before{left:26px;} .pq3106 .pq-sign::after{right:26px;}
        /* 4 quyoncha maysada — har biri bitta misolga; g'alabada raqamli nishon + sakrash */
        .pq3106 .pq-bunnies{position:absolute;left:0;right:0;bottom:18px;z-index:4;display:flex;justify-content:space-around;align-items:flex-end;padding:0 16px;}
        .pq3106 .pq-bwrap{position:relative;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq3106 .pq-bhop{display:block;transform-origin:bottom center;animation:pq3106Idle 2.8s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq3106 .pq-bhop.win{animation:pq3106Hop .7s ease var(--wd,0s);}
        .pq3106 .pq-bnum{position:absolute;top:-6px;right:-3px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pq3106Pop .3s ease both;animation-delay:var(--wd,0s);}
        .pq3106 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pq3106Twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3106 .pq-wstar.s2{animation-delay:-.5s;} .pq3106 .pq-wstar.s3{animation-delay:-1.05s;}
        /* qadam-jadval: ikki bosiladigan panjara qatorlari */
        .pq3106 .pq-rows{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:8px;}
        .pq3106 .pq-rw{display:flex;flex-wrap:wrap;gap:5px;align-items:center;align-content:center;justify-content:center;padding:5px 7px;border-radius:14px;border:2.5px solid #cfe3da;background:#fff;transition:.15s;}
        .pq3106 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq3106 .pq-rw.good.win{animation:pq3106Cele .5s ease;}
        .pq3106 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq3106Shake .35s ease;}
        .pq3106 .pq-ex{min-width:34px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;gap:2px;font-size:19px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 6px;}
        .pq3106 .pq-op{font-size:19px;font-weight:900;} .pq3106 .pq-op.plus{color:#1a7f43;} .pq3106 .pq-op.minus{color:#c0392b;}
        .pq3106 .pq-eq{font-size:21px;font-weight:900;color:#8a94a2;margin:0 1px;}
        .pq3106 .pq-slot{width:42px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq3106Breath 2.4s ease-in-out infinite;}
        .pq3106 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq3106 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq3106 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq3106 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq3106 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq3106 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq3106 .pq-sgs{display:flex;flex-wrap:wrap;align-content:center;flex-basis:100%;gap:4px;margin-top:3px;justify-content:center;}
        .pq3106 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:18px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3106 .pq-sg:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);}
        .pq3106 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq3106 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq3106 .pq-sg:disabled{cursor:default;}
        .pq3106 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3106In .22s ease both;}
        .pq3106 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3106 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3106Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3106Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3106Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3106Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3106Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3106Fly{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3106Idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq3106Hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-24px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq3106Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3106Twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3106Breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pq3106Cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq3106Shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3106In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          <span className="pq-sun" />
          <Bird cls="b1" /><Bird cls="b2" /><Bird cls="b3" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
          <div className="pq-hills"><span /><span /><span /></div>
          <div className="pq-grass" />
          <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /><i className="pq-fruit fr1" /><i className="pq-fruit fr2" /><i className="pq-fruit fr3" /></div>
          <Mushroom cls="m1" />
          <span className="pq-bush" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" /><span className="pq-flower f5" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" /><span className="pq-bfly bf3" />

          <div className="pq-sign">{t.board}</div>

          {/* 4 quyoncha — har biri bitta misolga; g'alabada 1..4 nishon oladi va sakraydi */}
          <div className="pq-bunnies">
            {ROWS.map((_, i) => (
              <span key={i} className="pq-bwrap">
                <span className={'pq-bhop' + (ok ? ' win' : '')} style={{ '--bd': `-${i * 0.7}s`, '--wd': `${i * 0.12}s` }}>
                  <Bunny />
                  {ok && <b className="pq-bnum">{i + 1}</b>}
                </span>
              </span>
            ))}
          </div>

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '30%', top: '70px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar s2" style={{ left: '63%', top: '84px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar s3" style={{ left: '48%', top: '58px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">
                  {r.a}
                  <b className={'pq-op ' + (r.o1 === '+' ? 'plus' : 'minus')}>{r.o1 === '+' ? '+' : '−'}</b>
                  {r.b}
                  <b className={'pq-op ' + (r.o2 === '+' ? 'plus' : 'minus')}>{r.o2 === '+' ? '+' : '−'}</b>
                  {r.c}
                </div>
                <span className="pq-eq">=</span>
                <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
