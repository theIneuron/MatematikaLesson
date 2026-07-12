// Dars10 · Amaliyot 08 — P10 Ko'p-tanlov «Yettilik kartalari» · 🔴 · tag: result_seven_multi
// Fabrika-sahna: konveyerda 5 karta suzadi; har kartada misol yozilgan. Natijasi YETTI bo'lgan
// BARCHASINI tanlash: {3+4, 10−3, 6+1, 2+5} — 4 ta, 10−4=6 TUZOQ (indeks 3). G'alabada to'g'ri
// kartalar yashil porlaydi, har birida «= 7» pop, tuzoq-karta xira; robot xursand. Kartalarga
// doimiy siljish berilmagan (qoida) — kirish-animatsiyasi mount'da bir marta, keyin statik.
// Fon dekori jonli: tishli-g'ildiraklar aylanadi, konveyer-roliklar aylanadi, robot ko'z pirpiratadi
// + antenna puls, quvurdan bug', chiroqlar miltillaydi, «7» kalit-doira breath-pulse.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const RES = 7;
// Sonlar qat'iy 0-10. Minus «−» = U+2212. Sonlar bilan «kichik − katta» yo'q (natija manfiy emas).
const EXPRS = [
  { a: 3, op: '+', b: 4 },  // 7 ✓
  { a: 10, op: '−', b: 3 }, // 7 ✓
  { a: 6, op: '+', b: 1 },  // 7 ✓
  { a: 10, op: '−', b: 4 }, // 6 ✗ tuzoq
  { a: 2, op: '+', b: 5 },  // 7 ✓
];
const val = (e) => (e.op === '+' ? e.a + e.b : e.a - e.b);
const GOOD = EXPRS.map((e, i) => (val(e) === RES ? i : -1)).filter((i) => i >= 0); // [0,1,2,4]
const DATA = { ptype: 'P10', level: '🔴', tag: 'result_seven_multi' };
const T = {
  uz: {
    eyebrow: 'Fabrika · Kartalar', title: 'Yettilik kartalari',
    setup: "Robotning kartalarida misollar bor — u faqat natijasi YETTI bo'lgan kartalarni saralaydi.",
    ask: "Natijasi YETTI bo'ladigan BARCHA kartalarni bosing.",
    correct: "Barakalla! To'rttala yettilik topildi — robot xursand!",
    hint: "Har misolni hisoblang: belgiga qarang — qo'shuvmi, ayiruvmi? Natijasi yetti bo'lganlarinigina tanlang.",
  },
  ru: {
    eyebrow: 'Фабрика · Карточки', title: 'Карточки семёрки',
    setup: 'На карточках робота записаны примеры — он отбирает только карточки, где получается СЕМЬ.',
    ask: 'Нажми на все карточки, где получается СЕМЬ.',
    correct: 'Молодец! Все четыре семёрки найдены — робот доволен!',
    hint: 'Посчитай каждый пример: посмотри на знак — плюс или минус? Выбирай только те, где получается семь.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TISHLI-G'ILDIRAK KANONI (D10_06): 8 tish + tana + o'q. Metall kulrang-ko'k, fon dekori (sekin aylanadi).
const Gear = ({ size = 44, c = '#8794a8', line = '#5a6577' }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x="21.5" y="1.5" width="5" height="9" rx="1.6" fill={c} stroke={line} strokeWidth="1.2" transform={`rotate(${i * 45} 24 24)`} />
    ))}
    <circle cx="24" cy="24" r="14.5" fill={c} stroke={line} strokeWidth="2" />
    <circle cx="24" cy="24" r="6.5" fill="#e9edf3" stroke={line} strokeWidth="1.6" />
    <circle cx="24" cy="24" r="2.4" fill={line} />
  </svg>
);

// ROBOT KANONI (D10_06): to'rtburchak-yumaloq metall tana (kulrang-ko'k 2-3 ton), old panelda ekran-yuz
// (ikki dumaloq ko'z + LED-tabassum, ko'zlar pirpiratadi), antenna (uchida pulslanuvchi doira),
// kalta qo'l-oyoq (bo'g'in-to'garaklar). Do'stona ifoda. Saralashni boshqaradi.
const Robot = () => (
  <svg viewBox="0 0 72 100" width="52" height="73" aria-hidden="true" style={{ display: 'block' }}>
    {/* antenna */}
    <line x1="36" y1="20" x2="36" y2="8" stroke="#67728a" strokeWidth="3" strokeLinecap="round" />
    <circle className="pq-ant" cx="36" cy="6.5" r="4.2" fill="#ffb14e" stroke="#d98b23" strokeWidth="1.1" />
    {/* legs + foot joints */}
    <line x1="28" y1="86" x2="28" y2="94" stroke="#67728a" strokeWidth="5.5" strokeLinecap="round" />
    <line x1="44" y1="86" x2="44" y2="94" stroke="#67728a" strokeWidth="5.5" strokeLinecap="round" />
    <circle cx="28" cy="95.5" r="4.2" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.4" />
    <circle cx="44" cy="95.5" r="4.2" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.4" />
    {/* arms + hand joints */}
    <line x1="13" y1="58" x2="7" y2="70" stroke="#67728a" strokeWidth="4.4" strokeLinecap="round" />
    <circle cx="6" cy="72" r="4.4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.3" />
    <line x1="59" y1="58" x2="65" y2="70" stroke="#67728a" strokeWidth="4.4" strokeLinecap="round" />
    <circle cx="66" cy="72" r="4.4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.3" />
    {/* body */}
    <rect x="14" y="48" width="44" height="40" rx="13" fill="#aeb9c9" stroke="#4a5568" strokeWidth="2" />
    <rect x="21" y="55" width="30" height="15" rx="5" fill="#98a4b6" stroke="#67728a" strokeWidth="1.4" />
    <circle cx="28" cy="62.5" r="2.3" fill="#c9d2df" /><circle cx="36" cy="62.5" r="2.3" fill="#c9d2df" /><circle cx="44" cy="62.5" r="2.3" fill="#c9d2df" />
    <rect x="27" y="78" width="18" height="5" rx="2.5" fill="#8794a8" stroke="#67728a" strokeWidth="1.1" />
    {/* head */}
    <rect x="18" y="20" width="36" height="30" rx="11" fill="#8794a8" stroke="#4a5568" strokeWidth="2" />
    {/* face screen */}
    <rect x="22" y="25" width="28" height="20" rx="7" fill="#1e2740" />
    <circle cx="31" cy="33" r="3.3" fill="#7cf0ff" /><circle cx="41" cy="33" r="3.3" fill="#7cf0ff" />
    <circle cx="32" cy="32.2" r="1" fill="#dffcff" /><circle cx="42" cy="32.2" r="1" fill="#dffcff" />
    <g className="pq-blink"><rect x="27.5" y="29.5" width="7" height="7" rx="2.5" fill="#1e2740" /><rect x="37.5" y="29.5" width="7" height="7" rx="2.5" fill="#1e2740" /></g>
    <path d="M30 39.5 Q36 43.5 42 39.5" stroke="#7cf0ff" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* ear bolts */}
    <circle cx="17" cy="35" r="2.6" fill="#67728a" stroke="#4a5568" strokeWidth="1.1" />
    <circle cx="55" cy="35" r="2.6" fill="#67728a" stroke="#4a5568" strokeWidth="1.1" />
  </svg>
);

// «7» kalit-doira: oltin, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const Key = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="22" cy="22" r="19" fill="#f2b134" stroke="#c08517" strokeWidth="2" />
    <circle cx="15.5" cy="14.5" r="6" fill="#f8d47f" opacity=".9" />
    <text x="22" y="30" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">{RES}</text>
    <polygon className="pq-glint" points="32.5,7.5 33.7,11 37.2,12.2 33.7,13.4 32.5,16.9 31.3,13.4 27.8,12.2 31.3,11" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Kartalar joyi (sahna px, chapdan). Konveyer ustida bir qatorda — o'zaro ustma-ust tushmaydi.
const POS = [{ x: 60 }, { x: 122 }, { x: 184 }, { x: 246 }, { x: 308 }];

export default function D10_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda karta kirish-animatsiyasi (drop-in) qayta ijro etilmaydi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => val(EXPRS[i]) === RES);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: EXPRS.map((e) => `${e.a} ${e.op} ${e.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1008">
      <style>{`
        .pq1008{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1008 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a6b8c;text-transform:uppercase;}
        .pq1008 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1008 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1008 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1008 .pq-stage{display:flex;flex-direction:column;align-items:center;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eef1f6,#e2e7ef);border:2px solid #d2d9e4;}
        .pq1008 .pq-scene{position:relative;width:372px;max-width:100%;height:210px;border-radius:18px;background:linear-gradient(#cdd7e6 0%,#bdc9db 52%,#aab7cc 100%);border:2px solid #b3bfd0;overflow:hidden;}
        .pq1008 .pq-window{position:absolute;top:20px;border-radius:5px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2px solid #9db0c6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:0;}
        .pq1008 .pq-window.w1{left:250px;width:50px;height:36px;}
        .pq1008 .pq-window.w2{left:308px;width:50px;height:36px;}
        .pq1008 .pq-window::after{content:'';position:absolute;left:50%;top:4px;bottom:4px;width:2px;background:#9db0c6;transform:translateX(-1px);}
        .pq1008 .pq-gear{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1008 .pq-gear svg{animation:pqSpin 7s linear infinite;}
        .pq1008 .pq-gear.g1{left:8px;top:22px;}
        .pq1008 .pq-gear.g2{left:44px;top:44px;}
        .pq1008 .pq-gear.g2 svg{animation:pqSpin 5.4s linear infinite reverse;}
        .pq1008 .pq-pipe{position:absolute;left:0;right:0;top:0;height:11px;background:linear-gradient(#b7c1d0,#8b97a9 55%,#727e92);border-bottom:2px solid #667080;z-index:2;}
        .pq1008 .pq-pipe::after{content:'';position:absolute;right:44px;top:-4px;width:16px;height:16px;border-radius:4px;background:linear-gradient(#c3ccd9,#93a0b2);border:1.5px solid #6c7789;}
        .pq1008 .pq-valve{position:absolute;right:26px;top:-6px;width:10px;height:10px;border-radius:50%;background:#e05a4d;border:1.5px solid #b23b30;z-index:3;}
        .pq1008 .pq-steam{position:absolute;right:46px;top:-6px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.85);z-index:2;opacity:0;animation:pqSteam 4.2s ease-in-out infinite;}
        .pq1008 .pq-steam.s2{right:52px;animation-delay:-2.1s;}
        .pq1008 .pq-led{position:absolute;top:16px;width:8px;height:8px;border-radius:50%;z-index:3;box-shadow:0 0 5px currentColor;}
        .pq1008 .pq-led.l1{left:14px;color:#57d68a;background:#57d68a;animation:pqBlinkL 1.5s ease-in-out infinite;}
        .pq1008 .pq-led.l2{left:26px;color:#ffcf3f;background:#ffcf3f;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-.5s;}
        .pq1008 .pq-led.l3{left:38px;color:#e05a4d;background:#e05a4d;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-1s;}
        .pq1008 .pq-keywrap{position:absolute;top:15px;left:50%;transform:translateX(-50%);line-height:0;z-index:4;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18));}
        .pq1008 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;}
        .pq1008 .pq-keybr.win{animation:pqCele .55s ease;}
        .pq1008 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.6s ease-in-out infinite;}
        .pq1008 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:16px;background:linear-gradient(#8b95a6,#6f7a8d);border-top:2px solid #97a1b2;z-index:1;}
        .pq1008 .pq-belt{position:absolute;left:52px;right:6px;bottom:8px;height:24px;border-radius:5px;background:#5a6577;border:2px solid #454f61;overflow:hidden;z-index:2;box-shadow:0 2px 3px rgba(0,0,0,.2);}
        .pq1008 .pq-beltmov{position:absolute;left:-24px;right:-24px;top:0;bottom:0;background:repeating-linear-gradient(90deg,#5a6577 0 15px,#4a5568 15px 20px);animation:pqBelt .85s linear infinite;}
        .pq1008 .pq-rollers{position:absolute;left:56px;right:10px;bottom:2px;height:12px;display:flex;justify-content:space-between;z-index:1;}
        .pq1008 .pq-roller{width:12px;height:12px;border-radius:50%;background:conic-gradient(#8794a8 0 25%,#5f6b80 0 50%,#8794a8 0 75%,#5f6b80 0);border:1.4px solid #454f61;animation:pqSpin 1.1s linear infinite;}
        .pq1008 .pq-robotw{position:absolute;left:2px;bottom:6px;line-height:0;z-index:3;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq1008 .pq-robotw.win{animation:pqCele .55s ease;}
        .pq1008 .pq-ant{transform-box:fill-box;transform-origin:center;animation:pqPulse 1.2s ease-in-out infinite;}
        .pq1008 .pq-blink{opacity:0;animation:pqBlink 3.6s linear infinite;}
        .pq1008 .pq-card{position:absolute;top:124px;width:58px;height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-radius:11px;border:2.5px solid #cbd3e0;background:linear-gradient(#ffffff,#f2f6fb);color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;box-shadow:0 3px 5px rgba(0,0,0,.16);transition:transform .12s,filter .14s,border-color .14s,background .14s;z-index:3;}
        .pq1008 .pq-card:hover:not(:disabled){transform:translateY(-3px);border-color:#9db0cc;}
        .pq1008 .pq-card:active:not(:disabled){transform:scale(.95);}
        .pq1008 .pq-card.sel{border-color:#2563eb;background:#e8eefc;box-shadow:0 3px 8px rgba(37,99,235,.3);}
        .pq1008 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .55s ease;}
        .pq1008 .pq-card.dim{opacity:.4;}
        .pq1008 .pq-card:disabled{cursor:default;}
        .pq1008 .pq-cardin{animation:pqCardIn .55s cubic-bezier(.3,1.2,.5,1) backwards;}
        .pq1008 .pq-scene.still .pq-cardin{animation:none;}
        .pq1008 .pq-tab{position:absolute;top:5px;left:50%;transform:translateX(-50%);width:22px;height:4px;border-radius:2px;background:#c3cdda;}
        .pq1008 .pq-card.sel .pq-tab{background:#2563eb;}
        .pq1008 .pq-card.right .pq-tab{background:#1a7f43;}
        .pq1008 .pq-cex{font-size:19px;font-weight:900;line-height:1;letter-spacing:-.01em;}
        .pq1008 .pq-cex .op{margin:0 3px;}
        .pq1008 .pq-cex .op.plus{color:#1a7f43;} .pq1008 .pq-cex .op.minus{color:#c0392b;}
        .pq1008 .pq-cres{font-size:14.5px;font-weight:900;color:#1a7f43;line-height:1;animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1008 .pq-cstar{position:absolute;top:-6px;right:-5px;line-height:0;animation:pqStarIn .5s cubic-bezier(.3,1.5,.5,1) both,pqTwinkle 1.7s ease-in-out .6s infinite;z-index:5;}
        .pq1008 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1008 .pq-wstar.w2{animation-delay:-.5s;} .pq1008 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq1008 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1008 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1008 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqBelt{from{transform:translateX(0);}to{transform:translateX(20px);}}
        @keyframes pqSteam{0%,62%,100%{opacity:0;transform:translateY(0) scale(.6);}70%{opacity:.85;transform:translateY(-10px) scale(1);}88%{opacity:0;transform:translateY(-22px) scale(1.4);}}
        @keyframes pqBlinkL{0%,100%{opacity:1;}50%{opacity:.28;}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:.65;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqCardIn{from{opacity:0;transform:translateY(-40px) scale(.85);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.35);}to{opacity:1;transform:scale(1);}}
        @keyframes pqStarIn{from{opacity:0;transform:scale(.2) rotate(-40deg);}to{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* Ambient: suzuvchi uchqunlar + sekin aylanuvchi bolt (fon dekori) */
        .pq1008 .pq-mote{position:absolute;z-index:0;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,rgba(242,177,52,.5) 55%,rgba(242,177,52,0) 72%);pointer-events:none;opacity:0;animation:pq1008Mote 9.5s ease-in-out infinite;}
        .pq1008 .pq-mote.m2{width:6px;height:6px;animation-duration:12.5s;animation-delay:-5s;}
        .pq1008 .pq-nut{position:absolute;z-index:0;line-height:0;opacity:.32;pointer-events:none;animation:pq1008Nut 12.5s ease-in-out infinite;}
        @keyframes pq1008Mote{0%{opacity:0;transform:translate(0,8px) scale(.7);}22%{opacity:.5;}50%{opacity:.55;transform:translate(4px,-9px) scale(1);}80%{opacity:.3;}100%{opacity:0;transform:translate(0,-20px) scale(.7);}}
        @keyframes pq1008Nut{0%{transform:translate(0,0) rotate(0);}50%{transform:translate(-4px,-7px) rotate(180deg);}100%{transform:translate(0,0) rotate(360deg);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          {/* Ambient uchqunlar + bolt (fon, dekor) */}
          <span className="pq-mote m1" aria-hidden="true" style={{ left: 135, top: 46 }} />
          <span className="pq-mote m2" aria-hidden="true" style={{ left: 230, top: 62 }} />
          <span className="pq-nut" aria-hidden="true" style={{ left: 104, top: 96 }}><svg width="13" height="13" viewBox="0 0 20 20"><path d="M10 1.4 L16.9 5.4 L16.9 13.6 L10 17.6 L3.1 13.6 L3.1 5.4 Z" fill="none" stroke="#9aa6b6" strokeWidth="2" /><circle cx="10" cy="10" r="3.2" fill="none" stroke="#9aa6b6" strokeWidth="2" /></svg></span>
          <span className="pq-window w1" /><span className="pq-window w2" />
          <span className="pq-gear g1"><Gear size={42} /></span>
          <span className="pq-gear g2"><Gear size={26} c="#98a4b6" line="#5f6b80" /></span>
          <span className="pq-pipe" />
          <span className="pq-valve" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-led l1" /><span className="pq-led l2" /><span className="pq-led l3" />

          {/* «7» kalit-doira — robot shu natija bo'yicha saralaydi; breath, g'alabada selebratsiya */}
          <span className="pq-keywrap"><span className={'pq-keybr' + (ok ? ' win' : '')}><Key /></span></span>

          <span className="pq-floor" />
          <div className="pq-belt"><span className="pq-beltmov" /></div>
          <div className="pq-rollers">
            {Array.from({ length: 7 }).map((_, i) => (<span key={i} className="pq-roller" style={{ animationDelay: `${-i * 0.12}s` }} />))}
          </div>

          <span className={'pq-robotw' + (ok ? ' win' : '')}><Robot /></span>

          {/* 5 karta — bosiladigan tugmalar; sanaladigan nishonlar, doimiy siljish yo'q */}
          {EXPRS.map((e, i) => {
            const good = val(e) === RES;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
            return (
              <button key={i} type="button" className={'pq-card pq-cardin' + cls} disabled={lock}
                style={{ left: POS[i].x, animationDelay: `${i * 0.1}s` }}
                onClick={() => toggle(i)} aria-label={`${e.a} ${e.op} ${e.b}`}>
                <span className="pq-tab" />
                <span className="pq-cex">
                  <span>{e.a}</span>
                  <b className={'op ' + (e.op === '+' ? 'plus' : 'minus')}>{e.op}</b>
                  <span>{e.b}</span>
                </span>
                {ok && good && <span className="pq-cres">= {RES}</span>}
                {ok && good && <span className="pq-cstar"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '28%', top: '58px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-wstar w2" style={{ left: '58%', top: '64px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w3" style={{ left: '80%', top: '52px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
