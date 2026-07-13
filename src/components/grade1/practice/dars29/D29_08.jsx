// Dars29 · Amaliyot 08 — Ko'p-tanlov «Olma bog'i» · 🔴 · tag: multi
// TABIAT SAHNASI (Dars15 etaloni): jonli quyosh, bulutlar, qushlar, tepaliklar, maysa, gullar,
// kapalaklar, olma daraxtlari. Quyoncha maskot maysada kuzatib o'tiradi; g'alabada quvonch bilan
// joyida sakraydi. Ko'p-tanlov: 4 ifoda-karta, javobi aynan 5 bo'lgan BARCHASINI belgilash.
// [0] "8 − 3" =5  [1] "2 + 3" =5  [2] "9 − 4" =5  [3] "6 − 2" =4 tuzoq. GOOD = {0,1,2}.
// Win-reveal: har to'g'ri kartada "= 5" chiqadi, tuzoq xiralashadi.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 5;
// Har karta: a op b. op: '-' ayirish (qoldiq), '+' qo'shish (noma'lum qo'shiluvchi).
const CARDS = [
  { a: 8, op: '-', b: 3 }, // 8 − 3 = 5 to'g'ri
  { a: 2, op: '+', b: 3 }, // 2 + 3 = 5 to'g'ri
  { a: 9, op: '-', b: 4 }, // 9 − 4 = 5 to'g'ri
  { a: 6, op: '-', b: 2 }, // 6 − 2 = 4 tuzoq
];
const SIGN = { '-': '−', '+': '+' };
const cardVal = (c) => (c.op === '+' ? c.a + c.b : c.a - c.b);
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} ${SIGN[c.op]} ${c.b}`;

const DATA = { good: GOOD, target: TARGET, ptype: 'multi', level: '🔴', tag: 'multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala",
    title: "Javobi 5",
    setup: "To'rtta karta bor, har birida misol yozilgan.",
    ask: "Javobi 5 ga teng bo'lgan HAMMA kartani belgilang.",
    correct: "Barakalla! Uchta kartaning javobi 5.",
    hint: "Har kartani o'zingiz hisoblang: javobi 5 chiqadimi?",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача",
    title: "Ответ 5",
    setup: "Есть четыре карточки, на каждой пример.",
    ask: "Отметь ВСЕ карточки с ответом 5.",
    correct: "Молодец! У трёх карточек ответ 5.",
    hint: "Посчитай каждую карточку: получится ли 5?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Uzoqdagi qush (osmonda) — Dars15 etaloni.
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

// QUYONCHA (kurs maskoti, Dars15 etaloni) — maysada o'tiradi, g'alabada quvonch sakraydi.
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="46" height="42.5" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="bfur2908" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" /></linearGradient>
      <linearGradient id="bhead2908" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" /></linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#bfur2908)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#bhead2908)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#bhead2908)" stroke="#a8977f" strokeWidth="1" />
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

// «5» NISHON: yashil bog' lavhasi, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const TargetBadge = () => (
  <svg viewBox="0 0 62 46" width="56" height="41" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="3" y="6" width="56" height="34" rx="13" fill="#2e7d46" stroke="#1f5e33" strokeWidth="2.4" />
    <rect x="9" y="10" width="26" height="9" rx="5" fill="#5aa86a" opacity="0.7" />
    <text x="31" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff" fontFamily="inherit">5</text>
    <polygon className="pq-glint" points="49,10 50.4,14 54.4,15.4 50.4,16.8 49,20.8 47.6,16.8 43.6,15.4 47.6,14" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

export default function D29_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda quvonch-sakrash qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

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
    <div className="pq pq2908">
      <style>{`
        .pq2908{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2908 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq2908 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2908 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2908 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2908 .pq-stage{position:relative;border-radius:22px;background:#f2f9ec;border:2px solid #bfe0d0;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);}
        /* ===== TABIAT LENTASI (Dars15 etaloni) ===== */
        .pq2908 .pq-sky{position:relative;height:124px;background:linear-gradient(#bfe6fb 0%,#d9f1fd 58%,#eaf8ff 78%);}
        .pq2908 .pq-sun{position:absolute;left:18px;top:12px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);z-index:1;animation:pq2908Sun 4s ease-in-out infinite;}
        .pq2908 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq2908 .pq-cloud::before,.pq2908 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2908 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq2908 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq2908 .pq-cloud.c1{top:16px;left:42%;width:46px;animation:pq2908Drift 14s ease-in-out infinite;}
        .pq2908 .pq-cloud.c2{top:40px;left:64%;width:34px;transform:scale(.8);animation:pq2908Drift 18s ease-in-out infinite reverse;}
        .pq2908 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq2908 .pq-bird.b1{top:16px;left:30%;animation:pq2908BirdA 7s ease-in-out infinite;}
        .pq2908 .pq-bird.b2{top:30px;left:56%;transform:scale(.78);animation:pq2908BirdA 9s ease-in-out infinite;}
        .pq2908 .pq-hills{position:absolute;left:0;right:0;bottom:18px;height:52px;z-index:1;}
        .pq2908 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2908 .pq-hills span:nth-child(1){left:-8%;width:52%;height:44px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2908 .pq-hills span:nth-child(2){right:-6%;width:48%;height:52px;}
        .pq2908 .pq-hills span:nth-child(3){left:32%;width:40%;height:38px;background:linear-gradient(#a2da7c,#86c663);}
        .pq2908 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:22px;background:linear-gradient(#84c95f 0%,#69b34c 70%,#5aa53f 100%);z-index:2;}
        .pq2908 .pq-ground::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq2908 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:3;}
        .pq2908 .pq-flower.f1{left:22%;bottom:10px;background:#ffd94a;box-shadow:4px 0 0 #ffd94a,-4px 0 0 #ffd94a,0 4px 0 #ffd94a,0 -4px 0 #ffd94a;}
        .pq2908 .pq-flower.f2{left:48%;bottom:8px;background:#ff9ec4;box-shadow:4px 0 0 #ff9ec4,-4px 0 0 #ff9ec4,0 4px 0 #ff9ec4,0 -4px 0 #ff9ec4;}
        .pq2908 .pq-flower.f3{right:26%;bottom:11px;background:#c79bf0;box-shadow:4px 0 0 #c79bf0,-4px 0 0 #c79bf0,0 4px 0 #c79bf0,0 -4px 0 #c79bf0;}
        .pq2908 .pq-tuft{position:absolute;z-index:3;}
        .pq2908 .pq-tuft.t1{left:34%;bottom:6px;} .pq2908 .pq-tuft.t2{right:38%;bottom:8px;transform:scale(.85);}
        .pq2908 .pq-bfly{position:absolute;width:8px;height:8px;z-index:4;}
        .pq2908 .pq-bfly::before,.pq2908 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2908 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2908Wing .26s ease-in-out infinite alternate;}
        .pq2908 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2908Wing .26s ease-in-out infinite alternate;}
        .pq2908 .pq-bfly.bf1::before,.pq2908 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2908 .pq-bfly.bf2::before,.pq2908 .pq-bfly.bf2::after{background:#a9e0ff;}
        .pq2908 .pq-bfly.bf1{top:58px;left:24%;animation:pq2908Flit1 8s ease-in-out infinite;}
        .pq2908 .pq-bfly.bf2{top:72px;right:30%;animation:pq2908Flit2 9s ease-in-out infinite;}
        /* olma daraxtlari */
        .pq2908 .pq-tree{position:absolute;bottom:16px;z-index:2;transform-origin:50% 100%;}
        .pq2908 .pq-tree.t1{left:64px;animation:pq2908SwayT 4.2s ease-in-out infinite;}
        .pq2908 .pq-tree.t2{right:118px;bottom:20px;animation:pq2908SwayT 4.8s ease-in-out .6s infinite;}
        .pq2908 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:8px;height:22px;border-radius:3px;background:linear-gradient(90deg,#8a5a2c,#a9743e);}
        .pq2908 .pq-crown{display:block;width:48px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#93d36e,#5da845 68%,#4d9640);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2908 .pq-crown i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.22);}
        /* «5» nishoni + quyoncha */
        .pq2908 .pq-badge{position:absolute;right:16px;top:14px;line-height:0;z-index:3;}
        .pq2908 .pq-badgebr{display:inline-block;line-height:0;animation:pq2908Breath 2.3s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(30,90,50,.32));}
        .pq2908 .pq-badgebr.win{animation:pq2908Cele .6s ease;}
        .pq2908 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pq2908Glint 3.4s ease-in-out infinite;}
        .pq2908 .pq-buny{position:absolute;right:34px;bottom:14px;z-index:4;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq2908 .pq-buny .pq-hopwrap{display:block;transform-origin:bottom center;animation:pq2908Idle 2.8s ease-in-out infinite;}
        .pq2908 .pq-buny.win .pq-hopwrap{animation:pq2908JoyHop .7s ease infinite;}
        .pq2908 .pq-buny.winstill .pq-hopwrap{animation:none;}
        .pq2908 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;animation:pq2908Tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq2908 .pq-wstar.w2{animation-delay:-.5s;} .pq2908 .pq-wstar.w3{animation-delay:-1.05s;}

        .pq2908 .pq-cards{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:16px 12px 14px;}
        .pq2908 .pq-card{position:relative;min-width:120px;display:flex;align-items:center;justify-content:center;padding:16px 16px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,130,90,.14);font-family:inherit;}
        .pq2908 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,130,90,.22);}
        .pq2908 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2908 .pq-card:disabled{cursor:default;}
        .pq2908 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2908 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2908Cele .55s ease;}
        .pq2908 .pq-card.dim{opacity:.42;filter:grayscale(.32);}

        .pq2908 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2908 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2908 .pq-eq{color:#1a7f43;font-size:20px;font-weight:900;animation:pq2908Pop .4s ease both;}
        .pq2908 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pq2908Tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2908 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2908In .22s ease both;}
        .pq2908 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2908 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2908Sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2908Drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2908BirdA{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq2908Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2908Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq2908Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq2908SwayT{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2908Breath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pq2908Glint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pq2908Idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2908JoyHop{0%{transform:translateY(0) scaleY(.9);}30%{transform:translateY(-16px) scaleY(1.06);}70%{transform:translateY(0) scaleY(.86);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2908Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2908Tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2908Cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2908In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-sky">
          <span className="pq-sun" />
          <Bird cls="b1" /><Bird cls="b2" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-hills"><span /><span /><span /></div>
          <span className="pq-ground" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '12px', top: '14px' }} /><i style={{ left: '30px', top: '9px' }} /><i style={{ left: '22px', top: '26px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '11px', top: '11px' }} /><i style={{ left: '28px', top: '20px' }} /></span><span className="pq-trunk" /></div>
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
          <Tuft cls="t1" /><Tuft cls="t2" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
          <span className="pq-badge"><span className={'pq-badgebr' + (ok ? ' win' : '')}><TargetBadge /></span></span>
          {/* Quyoncha maskot: kuzatib o'tiradi; g'alabada quvonch bilan sakraydi */}
          <span className={'pq-buny' + (ok ? (still ? ' winstill' : ' win') : '')}><span className="pq-hopwrap"><Bunny /></span></span>
          {ok && (<>
            <span className="pq-wstar" style={{ left: '30%', top: '46px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '58%', top: '58px' }}><Star fill="#e59a2f" /></span>
            <span className="pq-wstar w3" style={{ left: '78%', top: '40px' }}><Star fill="#f2b134" /></span>
          </>)}
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
                  <span>{c.a} {c.op === '+' ? '+' : '−'} {c.b}</span>
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
