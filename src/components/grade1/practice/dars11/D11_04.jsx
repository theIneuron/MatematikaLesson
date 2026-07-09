// Dars11 · Amaliyot 04 — P8 Ko'p-tanlov «Ikki yozuv» · 🟡 · tag: two_expressions
// Poyezd bekatida 3 qizil + 2 ko'k vagon; rasmga mos IKKALA yozuv (3+2, 2+3) — o'rin almashtirish.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const RED = 3, BLUE = 2, TOTAL = RED + BLUE; // 5
// 4 yozuv-karta. To'g'ri to'plam: {3,2} sonlaridan tuzilgani — 3+2 va 2+3 (o'rin almashtirish).
const CARDS = [
  { a: 3, b: 2 }, // ✓ mos
  { a: 2, b: 3 }, // ✓ mos (o'rin almashgan)
  { a: 3, b: 3 }, // ✗ tuzoq (=6, rasmda emas)
  { a: 5, b: 2 }, // ✗ tuzoq (=7, rasmda emas)
];
const LO = Math.min(RED, BLUE), HI = Math.max(RED, BLUE);
const matchPic = (c) => { const s = [c.a, c.b].sort((x, y) => x - y); return s[0] === LO && s[1] === HI; };
const GOOD = CARDS.map((c, i) => (matchPic(c) ? i : -1)).filter((i) => i >= 0); // [0,1]

const DATA = { ptype: 'P8', level: '🟡', tag: 'two_expressions' };
const T = {
  uz: {
    eyebrow: 'Poyezd bekati · Yozuvlar', title: 'Ikki yozuvni top',
    setup: "Poyezdda uchta qizil va ikkita ko'k vagon. Bu rasmni IKKI xil yozsa bo'ladi!",
    ask: 'Rasmga mos keladigan IKKALA yozuvni bosing.',
    correct: "Barakalla! Uch qo'shuv ikki va ikki qo'shuv uch — ikkalasi ham shu rasm! O'rin almashtirish.",
    hint: "Qizil vagonlar nechta, ko'k vagonlar nechta? Qaysi yozuvlar shu sonlardan tuzilgan?",
  },
  ru: {
    eyebrow: 'Вокзал · Записи', title: 'Найди две записи',
    setup: 'В поезде три красных и два синих вагона. Эту картинку можно записать двумя способами!',
    ask: 'Нажми обе записи, которые подходят к картинке.',
    correct: 'Молодец! Три плюс два и два плюс три — обе про эту картинку! Перестановка.',
    hint: 'Сколько красных вагонов, сколько синих? Какие записи составлены из этих чисел?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// G'ILDIRAK: spitsali temir g'ildirak — obod, kuloq, 6 spitsa. Sekin aylanadi (harakat hissi).
const Wheel = ({ cx, cy, r }) => (
  <g className="pq-wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
    <circle cx={cx} cy={cy} r={r} fill="#2f3543" stroke="#171b23" strokeWidth="1.6" />
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 0.82} stroke="#7c869a" strokeWidth="1.5" transform={`rotate(${i * 60} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.42} fill="#c9d2df" stroke="#171b23" strokeWidth="1.1" />
    <circle cx={cx} cy={cy} r={r * 0.15} fill="#5a6577" />
  </g>
);

// LOKOMOTIV KANONI (yon, chapga qaragan): old chiroq + mo'ri (bug') + kabina (deraza+mashinist) + 3 g'ildirak.
const Locomotive = () => (
  <svg viewBox="0 0 96 62" width="80" height="52" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    {/* running board */}
    <rect x="8" y="44" width="82" height="6" rx="2" fill="#3a4152" />
    {/* boiler + smokebox */}
    <rect x="12" y="26" width="46" height="20" rx="10" fill="#54617a" stroke="#2f3543" strokeWidth="2" />
    <rect x="14" y="28" width="42" height="5" rx="2.5" fill="#63708a" />
    <circle cx="16" cy="36" r="9.5" fill="#3c4557" stroke="#2f3543" strokeWidth="1.6" />
    <circle cx="16" cy="36" r="4" fill="#4f5b70" />
    {/* accent stripe */}
    <rect x="20" y="37" width="36" height="3.4" rx="1.7" fill="#f2b134" />
    {/* headlight */}
    <circle cx="10.5" cy="31" r="3.6" fill="#ffe9a8" stroke="#d9b34e" strokeWidth="1.3" />
    <circle cx="10.5" cy="31" r="1.4" fill="#fff6d6" />
    {/* chimney (funnel) */}
    <path d="M26 26 L23.5 14 L36 14 L33.5 26 Z" fill="#2f3543" />
    <ellipse cx="29.7" cy="14" rx="6.4" ry="2" fill="#3c4557" />
    {/* dome */}
    <path d="M42 26 Q42 19.5 48 19.5 Q54 19.5 54 26 Z" fill="#465071" stroke="#2f3543" strokeWidth="1.2" />
    {/* cabin roof overhang */}
    <rect x="53" y="11" width="39" height="6" rx="3" fill="#3c4557" />
    {/* cabin */}
    <rect x="57" y="14" width="32" height="32" rx="7" fill="#54617a" stroke="#2f3543" strokeWidth="2" />
    {/* cabin window */}
    <rect x="61.5" y="19.5" width="21" height="15.5" rx="4" fill="#bfe0f2" stroke="#2f3543" strokeWidth="1.2" />
    {/* machinist */}
    <circle cx="72" cy="28" r="5.6" fill="#e8b98a" />
    <path d="M66.6 26.4 Q72 20.4 77.4 26.4 Z" fill="#d9534b" />
    <rect x="66.8" y="25.6" width="10.4" height="2.4" rx="1.2" fill="#c0392b" />
    <rect x="69.4" y="27.2" width="2.1" height="2.6" rx="1" fill="#3a2a1c" /><rect x="72.6" y="27.2" width="2.1" height="2.6" rx="1" fill="#3a2a1c" />
    <rect className="pq-blink" x="68.8" y="27" width="7.2" height="2.9" rx="1.2" fill="#e8b98a" />
    {/* coupling + buffers (right) */}
    <rect x="88" y="39" width="7" height="4" rx="1.4" fill="#2f3543" />
    <circle cx="90" cy="35" r="2.2" fill="#3a4152" />
    {/* wheels */}
    <Wheel cx={30} cy={52} r={9} />
    <Wheel cx={53} cy={52} r={7} />
    <Wheel cx={73} cy={52} r={7} />
    {/* coupling rod */}
    <line x1="30" y1="52" x2="73" y2="52" stroke="#5a6577" strokeWidth="2" opacity=".5" />
  </svg>
);

// VAGON KANONI: rangli to'rtburchak-yumaloq tana + 2 deraza + 2 g'ildirak + qo'shqich. Bitta vagon = bitta dona.
const Wagon = ({ col, st }) => (
  <svg viewBox="0 0 54 54" width="46" height="46" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    {/* undercarriage */}
    <rect x="6" y="40" width="42" height="4" rx="1.4" fill="#3a4152" />
    {/* couplings */}
    <rect x="0" y="37" width="6" height="4" rx="1.4" fill="#2f3543" />
    <rect x="48" y="37" width="6" height="4" rx="1.4" fill="#2f3543" />
    {/* body */}
    <rect x="4" y="12" width="46" height="28" rx="8" fill={col} stroke={st} strokeWidth="2" />
    <rect x="7" y="14.5" width="40" height="6" rx="3" fill="#fff" opacity=".2" />
    {/* windows */}
    <rect x="11" y="19" width="13" height="11" rx="3" fill="#dff0fb" stroke={st} strokeWidth="1.2" />
    <rect x="30" y="19" width="13" height="11" rx="3" fill="#dff0fb" stroke={st} strokeWidth="1.2" />
    <line x1="17.5" y1="19" x2="17.5" y2="30" stroke={st} strokeWidth="0.9" opacity=".5" />
    <line x1="36.5" y1="19" x2="36.5" y2="30" stroke={st} strokeWidth="0.9" opacity=".5" />
    {/* wheels */}
    <Wheel cx={15} cy={46} r={6.5} />
    <Wheel cx={39} cy={46} r={6.5} />
  </svg>
);

// Kichik vokzal binosi (dekor).
const Depot = () => (
  <svg viewBox="0 0 74 60" width="74" height="60" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="8" y="24" width="58" height="34" rx="3" fill="#e9d3b0" stroke="#c9a878" strokeWidth="2" />
    <path d="M4 24 L37 8 L70 24 Z" fill="#c66b52" stroke="#a24f39" strokeWidth="2" strokeLinejoin="round" />
    <rect x="30" y="40" width="14" height="18" rx="2" fill="#a97a4e" stroke="#8a5f38" strokeWidth="1.4" />
    <circle cx="41" cy="49" r="1.3" fill="#f2d06b" />
    <rect x="14" y="32" width="12" height="11" rx="2" fill="#bfe0f2" stroke="#8fb6cf" strokeWidth="1.3" />
    <rect x="48" y="32" width="12" height="11" rx="2" fill="#bfe0f2" stroke="#8fb6cf" strokeWidth="1.3" />
    <circle cx="37" cy="18" r="4.6" fill="#f4efe2" stroke="#a24f39" strokeWidth="1.3" />
    <line x1="37" y1="18" x2="37" y2="15" stroke="#5a4632" strokeWidth="1" strokeLinecap="round" />
    <line x1="37" y1="18" x2="39.4" y2="18" stroke="#5a4632" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Daraxt (dekor).
const Tree = () => (
  <svg viewBox="0 0 46 56" width="46" height="56" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="20" y="34" width="6" height="20" rx="2" fill="#8a5f38" />
    <circle cx="23" cy="22" r="16" fill="#5cae54" />
    <circle cx="14" cy="26" r="10" fill="#68bd60" />
    <circle cx="32" cy="26" r="10" fill="#4f9a48" />
    <circle cx="16" cy="18" r="5" fill="#83cf7a" opacity=".8" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Poyezd tarkibi: 3 qizil + 2 ko'k vagon (rang bilan guruhlangan). Sanoq: chapdan o'ngga 1..5.
const TRAIN = [
  ...Array.from({ length: RED }).map(() => ({ col: '#d9534b', st: '#a23a33' })),
  ...Array.from({ length: BLUE }).map(() => ({ col: '#4f8fc4', st: '#33648f' })),
];

export default function D11_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => matchPic(CARDS[i]));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => `${c.a} + ${c.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1104">
      <style>{`
        .pq1104{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1104 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0632f;text-transform:uppercase;}
        .pq1104 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1104 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1104 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1104 .pq-scene{position:relative;width:372px;max-width:100%;height:210px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafb 0%,#e2f3fd 46%,#eaf7ff 62%);border:2px solid #c4dff0;overflow:hidden;}
        .pq1104 .pq-sun{position:absolute;top:12px;right:18px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1104 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1104 .pq-cloud.c1{top:20px;left:-72px;animation-duration:33s;}
        .pq1104 .pq-cloud.c2{top:46px;left:-72px;width:38px;height:12px;opacity:.7;animation-duration:44s;animation-delay:-20s;}
        .pq1104 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:70px;background:linear-gradient(#bfe3a6 0%,#a7d68c 100%);z-index:1;}
        .pq1104 .pq-platform{position:absolute;left:0;right:0;bottom:44px;height:16px;background:linear-gradient(#d9c39b,#c2a878);border-top:2px solid #e7d6b6;z-index:2;}
        .pq1104 .pq-depotw{position:absolute;left:6px;bottom:56px;z-index:2;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq1104 .pq-treew{position:absolute;left:70px;bottom:58px;z-index:1;line-height:0;animation:pqSway 4.6s ease-in-out infinite;transform-origin:50% 100%;}
        /* semafor */
        .pq1104 .pq-sem{position:absolute;right:20px;bottom:56px;z-index:3;width:14px;display:flex;flex-direction:column;align-items:center;}
        .pq1104 .pq-sembox{width:14px;height:30px;border-radius:5px;background:#3a4152;border:1.5px solid #232833;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;}
        .pq1104 .pq-sled{width:8px;height:8px;border-radius:50%;background:#5b3030;}
        .pq1104 .pq-sled.red{animation:pqSemR 2.4s ease-in-out infinite;}
        .pq1104 .pq-sled.grn{animation:pqSemG 2.4s ease-in-out infinite;}
        .pq1104 .pq-sempole{width:4px;height:14px;background:#4a5262;}
        /* rails */
        .pq1104 .pq-rails{position:absolute;left:0;right:0;bottom:8px;height:24px;z-index:2;}
        .pq1104 .pq-rail{position:absolute;left:0;right:0;height:3px;background:#8b95a6;}
        .pq1104 .pq-rail.r1{top:6px;} .pq1104 .pq-rail.r2{top:17px;}
        .pq1104 .pq-tie{position:absolute;top:2px;width:5px;height:20px;border-radius:2px;background:#9a7a54;}
        /* train */
        .pq1104 .pq-train{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:flex-end;gap:1px;z-index:4;animation:pqTrainBob 2.4s ease-in-out infinite;}
        .pq1104 .pq-loco{position:relative;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));margin-right:1px;}
        .pq1104 .pq-wag{position:relative;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.2));}
        .pq1104 .pq-wheel{animation:pqSpin 1.7s linear infinite;}
        .pq1104 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq1104 .pq-steam{position:absolute;top:-8px;left:12px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.9);z-index:5;opacity:0;animation:pqSteam 3.6s ease-in-out infinite;}
        .pq1104 .pq-steam.s2{left:16px;animation-delay:-1.2s;} .pq1104 .pq-steam.s3{left:20px;animation-delay:-2.4s;}
        .pq1104 .pq-cnt{position:absolute;top:-2px;left:50%;transform:translateX(-50%);min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:6;}
        .pq1104 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(249,198,47,.6));}
        .pq1104 .pq-wstar.w2{animation-delay:-.5s;} .pq1104 .pq-wstar.w3{animation-delay:-1.05s;}
        /* cards */
        .pq1104 .pq-cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq1104 .pq-card{position:relative;min-width:104px;height:62px;padding:0 14px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;font-size:25px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;font-variant-numeric:tabular-nums;transition:.13s;}
        .pq1104 .pq-card:hover:not(:disabled){border-color:#f0b48f;transform:translateY(-2px);}
        .pq1104 .pq-card:active:not(:disabled){transform:scale(.95);}
        .pq1104 .pq-card.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1104 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1104 .pq-card.dim{opacity:.4;}
        .pq1104 .pq-card:disabled{cursor:default;}
        .pq1104 .pq-plus{color:#c0632f;font-weight:900;}
        .pq1104 .pq-card.right .pq-plus{color:#1a7f43;}
        .pq1104 .pq-eqp{color:#1a7f43;font-weight:900;animation:pqPop .4s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1104 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1104 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1104 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(-360deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqSemR{0%,46%{background:#e34b3f;box-shadow:0 0 6px #e34b3f;}50%,100%{background:#5b3030;box-shadow:none;}}
        @keyframes pqSemG{0%,46%{background:#2f4030;box-shadow:none;}50%,100%{background:#4fd07f;box-shadow:0 0 6px #4fd07f;}}
        @keyframes pqTrainBob{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-2px);}}
        @keyframes pqSteam{0%,58%,100%{opacity:0;transform:translateY(0) scale(.5);}66%{opacity:.85;transform:translateY(-12px) scale(1);}86%{opacity:0;transform:translateY(-26px) scale(1.5);}}
        @keyframes pqBlink{0%,90%{opacity:0;}92%,96%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-ground" />
        <span className="pq-treew"><Tree /></span>
        <span className="pq-depotw"><Depot /></span>
        <span className="pq-platform" />
        <div className="pq-sem">
          <div className="pq-sembox"><span className="pq-sled red" /><span className="pq-sled grn" /></div>
          <span className="pq-sempole" />
        </div>

        <div className="pq-rails">
          <span className="pq-rail r1" /><span className="pq-rail r2" />
          {Array.from({ length: 15 }).map((_, i) => (<span key={i} className="pq-tie" style={{ left: 6 + i * 25 }} />))}
        </div>

        {/* Poyezd: lokomotiv + 5 vagon (3 qizil, 2 ko'k). G'alabada vagonlarda 1..5 sanoq-badge. */}
        <div className="pq-train">
          <span className="pq-loco">
            <Locomotive />
            <span className="pq-steam" /><span className="pq-steam s2" /><span className="pq-steam s3" />
          </span>
          {TRAIN.map((w, i) => (
            <span key={i} className="pq-wag">
              <Wagon col={w.col} st={w.st} />
              {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.1}s` }}>{i + 1}</b>}
            </span>
          ))}
        </div>

        {ok && (
          <>
            <span className="pq-wstar" style={{ left: '26%', top: '30px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '54%', top: '24px' }}><Star fill="#ffd13f" /></span>
            <span className="pq-wstar w3" style={{ left: '76%', top: '34px' }}><Star fill="#f2b134" /></span>
          </>
        )}
      </div>

      {/* 4 yozuv-karta — ko'p-tanlov; rasmga mos IKKALASI (3+2, 2+3). */}
      <div className="pq-cards">
        {CARDS.map((c, i) => {
          const good = matchPic(c);
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
          return (
            <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
              onClick={() => toggle(i)} aria-label={`${c.a} + ${c.b}`}>
              <span>{c.a}</span><span className="pq-plus">+</span><span>{c.b}</span>
              {ok && good && <span className="pq-eqp">= {TOTAL}</span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
