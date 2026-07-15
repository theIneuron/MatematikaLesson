// Dars23 · Amaliyot 08 — Sanoq «Olma bog'i» · skip-count by tens (ko'p-tanlov) · 🔴 · tag: skip_multi
// Ko'p-tanlov: 5 son-karta — 20, 25, 40, 35, 60. 10 lab sanoqda UCHRAYDIGAN barcha sonni belgilash.
// TO'G'RI to'plam = {20, 40, 60} (oxiri 0). Tuzoqlar: 25, 35 (oxiri 5 — 5 lab sanoqda, 10 lab EMAS).
// TABIAT SAHNASI (D15_01 kanoni): quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar, olma daraxti;
// quyoncha maysada (idle), g'alabada quvonib sakraydi. Kartalar TOZA (faqat son) — sahna ostida.
// G'alabada to'g'ri kartalar yashil bo'ladi, ustiga savat (bitta o'nlik) chiqadi; pastda 10 lab yo'lakcha
// ochiladi: 10 · 20 · 30 · 40 · 50 · 60 (uchraganlari yashil). Qadam doim bir xil: har safar 10 ga ortadi.
// LEAK yo'q: g'alabagacha barcha kartalar bir xil (oddiy son), to'g'ri javob ko'rinmaydi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const STEP = 10;
const CARDS = [20, 25, 40, 35, 60];         // ko'rsatiladigan son-kartalar (variantlar)
const isTen = (n) => n % 10 === 0;          // 10 lab sanoqda uchraydimi (oxiri 0)
const GOOD = CARDS.map((n, i) => (isTen(n) ? i : -1)).filter((i) => i >= 0); // [0, 2, 4] -> 20, 40, 60
const TRACK = [10, 20, 30, 40, 50, 60];     // g'alabada ochiladigan 10 lab yo'lakcha
const GOODVALS = CARDS.filter(isTen);       // [20, 40, 60]
const DATA = { cards: CARDS, good: GOOD, target: GOODVALS, step: STEP, options: CARDS, ptype: 'P08', level: '🔴', tag: 'skip_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Sanoq",
    title: "10 lab sonlar",
    setup: "Sonlarga qarang.",
    ask: "10 lab sanoqda uchraydigan BARCHA sonni bosing.",
    correct: "Barakalla! 20, 40, 60 — hammasi 10 lab sanoqda.",
    hint: "10 lab: 10, 20, 30... Oxiri 0 bo'lgan sonlar.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Счёт",
    title: "Числа по 10",
    setup: "Посмотри на числа.",
    ask: "Нажми ВСЕ числа из счёта по 10.",
    correct: "Молодец! 20, 40, 60 — все из счёта по 10.",
    hint: "По 10: 10, 20, 30... Числа, которые кончаются на 0.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

let __rid = 0;

// Uzoqdagi qush (osmonda) — oddiy "m" shakli (D15_01 kanoni).
const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
// O't tutami (maysada).
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// QUYONCHA (D15_01 kanoni, yon ko'rinish, o'ngga qarab) — kurs maskoti. Maysada o'tiradi, g'alabada sakraydi.
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="pq2308bf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="pq2308bh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#pq2308bf)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#pq2308bh)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#pq2308bh)" stroke="#a8977f" strokeWidth="1" />
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

// SAVAT KANONI (bitta o'nlik = 10 olma) — Dars21 dan uzviy. G'alabada to'g'ri karta ustida ko'rinadi.
const Basket = ({ w = 30 }) => {
  const id = 'pq2308b' + (__rid++);
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

export default function D23_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => isTen(CARDS[i]));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(String), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(404);

  return (
    <div className="pq pq2308" ref={fitRef}>
      <style>{`
        .pq2308{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2308 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2308 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2308 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2308 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        /* ===== TABIAT SAHNASI (D15_01 kanoni) ===== */
        .pq2308 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:240px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq2308 .pq-fit{position:relative;margin:0 auto;}
        .pq2308 .pq-sun{position:absolute;top:16px;left:20px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq2308sun 4s ease-in-out infinite;z-index:1;}
        .pq2308 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq2308 .pq-cloud::before,.pq2308 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2308 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq2308 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq2308 .pq-cloud.c1{top:30px;left:58%;width:46px;animation:pq2308drift 14s ease-in-out infinite;}
        .pq2308 .pq-cloud.c2{top:56px;left:30%;width:34px;transform:scale(.8);animation:pq2308drift 18s ease-in-out infinite reverse;}
        .pq2308 .pq-cloud.c3{top:16px;left:40%;width:30px;transform:scale(.72);animation:pq2308drift 16s ease-in-out infinite;}
        .pq2308 .pq-hills{position:absolute;left:0;right:0;bottom:74px;height:64px;z-index:1;}
        .pq2308 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2308 .pq-hills span:nth-child(1){left:-8%;width:52%;height:56px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2308 .pq-hills span:nth-child(2){right:-6%;width:48%;height:64px;}
        .pq2308 .pq-hills span:nth-child(3){left:32%;width:40%;height:48px;background:linear-gradient(#a2da7c,#86c663);}
        .pq2308 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:82px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq2308 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2308 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq2308 .pq-flower.f1{left:16%;bottom:60px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq2308 .pq-flower.f2{right:26%;bottom:52px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq2308 .pq-flower.f3{left:8%;bottom:54px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq2308 .pq-flower.f4{left:88%;bottom:56px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq2308 .pq-flower.f5{left:70%;bottom:54px;background:#ff7fa8;box-shadow:5px 0 0 #ff7fa8,-5px 0 0 #ff7fa8,0 5px 0 #ff7fa8,0 -5px 0 #ff7fa8;}
        .pq2308 .pq-tuft{position:absolute;z-index:3;}
        .pq2308 .pq-tuft.t1{left:24%;bottom:50px;} .pq2308 .pq-tuft.t2{left:78%;bottom:52px;transform:scale(.85);}
        /* olma daraxti (chapda) + olmalar — «Olma bog'i» belgisi */
        .pq2308 .pq-tree{position:absolute;left:8px;bottom:66px;width:44px;height:52px;z-index:2;}
        .pq2308 .pq-tree i{position:absolute;}
        .pq2308 .pq-trunk{left:18px;bottom:0;width:8px;height:18px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq2308 .pq-leaves{left:0;bottom:12px;width:44px;height:40px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:12px 8px 0 -8px #6fb552,-8px 9px 0 -10px #67ac4c;}
        .pq2308 .pq-tapple{position:absolute;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2a49c,#df5b52 60%,#b83b33);z-index:3;}
        .pq2308 .pq-tapple.a1{left:16px;bottom:96px;} .pq2308 .pq-tapple.a2{left:33px;bottom:88px;} .pq2308 .pq-tapple.a3{left:9px;bottom:84px;}
        /* kapalaklar */
        .pq2308 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq2308 .pq-bfly::before,.pq2308 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2308 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2308wing .26s ease-in-out infinite alternate;}
        .pq2308 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2308wing .26s ease-in-out infinite alternate;}
        .pq2308 .pq-bfly.bf1::before,.pq2308 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2308 .pq-bfly.bf2::before,.pq2308 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq2308 .pq-bfly.bf1{top:80px;left:22%;animation:pq2308flit1 8s ease-in-out infinite;}
        .pq2308 .pq-bfly.bf2{top:104px;right:20%;animation:pq2308flit2 9s ease-in-out infinite;}
        /* qushlar */
        .pq2308 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq2308 .pq-bird.b1{top:28px;left:44%;animation:pq2308bird 7s ease-in-out infinite;}
        .pq2308 .pq-bird.b2{top:44px;left:56%;transform:scale(.78);animation:pq2308bird 9s ease-in-out infinite;}
        /* yashil lavha (sarlavha) */
        .pq2308 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#6a9e46,#4d7f30);border:2.5px solid #3c6626;color:#f2fbec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* savat (maysada, dekorativ) */
        .pq2308 .pq-deco{position:absolute;bottom:16px;z-index:3;line-height:0;pointer-events:none;}
        .pq2308 .pq-deco.d1{left:20px;} .pq2308 .pq-deco.d2{right:20px;}
        /* quyoncha (maysada) */
        .pq2308 .pq-scenebunny{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq2308 .pq-scenebunny.bob{animation:pq2308bob 2.8s ease-in-out infinite;}
        .pq2308 .pq-scenebunny.hop{animation:pq2308shop .6s ease;}
        /* yakuniy porlashlar */
        .pq2308 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2308twinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2308 .pq-spark.s2{animation-delay:-.6s;} .pq2308 .pq-spark.s3{animation-delay:-1.15s;}
        /* son-kartalar */
        .pq2308 .pq-cards{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;margin-top:16px;}
        .pq2308 .pq-card{position:relative;width:88px;min-height:104px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:8px 6px 12px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.13s;box-shadow:0 2px 5px rgba(80,110,80,.12);font-family:inherit;}
        .pq2308 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,110,80,.2);}
        .pq2308 .pq-card:active:not(:disabled){transform:scale(.96);}
        .pq2308 .pq-card:disabled{cursor:default;}
        .pq2308 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2308 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2308cele .55s ease;}
        .pq2308 .pq-card.dim{opacity:.44;filter:grayscale(.32);}
        .pq2308 .pq-cbk{height:40px;display:flex;align-items:flex-end;justify-content:center;line-height:0;pointer-events:none;}
        .pq2308 .pq-cbk .pop{animation:pq2308pop .4s ease both;}
        .pq2308 .pq-cnum{font-size:30px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;}
        .pq2308 .pq-card.won .pq-cnum{color:#1a7f43;}
        .pq2308 .pq-cspark{position:absolute;top:6px;right:9px;line-height:0;pointer-events:none;animation:pq2308twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        /* 10 lab yo'lakcha */
        .pq2308 .pq-track{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;margin-top:16px;animation:pq2308in .3s ease both;}
        .pq2308 .pq-track b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #cbd6c2;color:#7a8ba0;font-variant-numeric:tabular-nums;}
        .pq2308 .pq-track b.hit{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2308 .pq-track i{font-style:normal;font-size:16px;font-weight:900;color:#b3bccb;}

        .pq2308 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2308in .22s ease both;}
        .pq2308 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2308 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2308sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2308drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2308wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2308flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(24px,-10px);}50%{transform:translate(44px,6px);}75%{transform:translate(18px,-6px);}}
        @keyframes pq2308flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-22px,10px);}50%{transform:translate(-40px,-8px);}75%{transform:translate(-16px,6px);}}
        @keyframes pq2308bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq2308bob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-3px);}}
        @keyframes pq2308shop{0%{transform:translateX(-50%) translateY(0);}45%{transform:translateX(-50%) translateY(-26px);}100%{transform:translateX(-50%) translateY(0);}}
        @keyframes pq2308twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2308cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2308pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2308in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 404 * scale, height: 240 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <Bird cls="b1" /><Bird cls="b2" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
        <div className="pq-hills"><span /><span /><span /></div>
        <div className="pq-grass" />
        <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /></div>
        <span className="pq-tapple a1" /><span className="pq-tapple a2" /><span className="pq-tapple a3" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
        <span className="pq-flower f4" /><span className="pq-flower f5" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-board">{t.title}</div>

        <span className="pq-deco d1" aria-hidden="true"><Basket w={30} /></span>
        <span className="pq-deco d2" aria-hidden="true"><Basket w={26} /></span>
        <span className={'pq-scenebunny ' + (ok && !still ? 'hop' : (still ? '' : 'bob'))} aria-hidden="true"><Bunny /></span>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '46px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '78%', top: '58px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '34px' }}>✦</span>
        </>)}
      </div>
      </div>

      <div className="pq-cards">
        {CARDS.map((n, i) => {
          const good = isTen(n);
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
          return (
            <button key={i} type="button" className={'pq-card' + cls} disabled={lock} onClick={() => toggle(i)} aria-label={String(n)}>
              <div className="pq-cbk">{ok && good && <span className="pop"><Basket w={30} /></span>}</div>
              <div className="pq-cnum">{n}</div>
              {ok && good && <span className="pq-cspark"><Star fill="#f2b134" /></span>}
            </button>
          );
        })}
      </div>

      {ok && (
        <div className="pq-track">
          {TRACK.map((v, k) => (
            <React.Fragment key={v}>
              <b className={GOODVALS.includes(v) ? 'hit' : ''}>{v}</b>
              {k < TRACK.length - 1 && <i>·</i>}
            </React.Fragment>
          ))}
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
