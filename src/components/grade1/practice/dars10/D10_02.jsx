// Dars10 · Amaliyot 02 — P10 lift yuqoriga «Yuk lifti» · 🟡 · tag: lift_up
// Vertikal son o'qi = yuk lifti. Kabina 3-qavatda, mount'da besh qavat yuqoriga (3→8) ko'tariladi.
// 8-qavat raqami «?» yopiq; g'alabada ochilib 8, chip «3 + 5 = 8», qavat-badge 1..8.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const START = 3, JUMP = 5, TARGET = 8;
const MINUS = '+';
const DATA = { start: 3, jump: 5, target: 8, options: [7, 8, 9], ptype: 'P10', level: '🟡', tag: 'lift_up' };

// Qavat geometriyasi (px). Shaxta ichida sfb(f); sahnada scfb(f).
const FLOOR_H = 19, SHAFT_BOTTOM = 28, SBASE = 6;
const sfb = (f) => SBASE + f * FLOOR_H;              // shaxta ichi
const scfb = (f) => SHAFT_BOTTOM + sfb(f);           // sahna
const DROP = (START - TARGET) * FLOOR_H;             // 76 — mount tushishi
const FLOORS = Array.from({ length: 11 }, (_, f) => f); // 0..10
const BADGES = Array.from({ length: TARGET }, (_, i) => i + 1); // 1..8 (qavatlar)

const T = {
  uz: {
    eyebrow: 'Fabrika · Yuk lifti', title: 'Yuqoriga ko\'tar',
    setup: 'Yuk lifti uchinchi qavatda turgan edi. U besh qavat yuqoriga ko\'tarildi.',
    ask: 'Lift qaysi qavatga yetib keldi?',
    correct: 'Barakalla! Uchdan besh yuqoriga — sakkiz. Yuqoriga = qo\'shish!',
    hint: 'Qavatlarni sanang: uchdan boshlab yuqoriga besh qavat.',
  },
  ru: {
    eyebrow: 'Завод · Грузовой лифт', title: 'Подними вверх',
    setup: 'Грузовой лифт стоял на третьем этаже. Он поднялся на пять этажей вверх.',
    ask: 'На какой этаж поднялся лифт?',
    correct: 'Молодец! От трёх на пять вверх — восемь. Вверх — это сложение!',
    hint: 'Считай этажи: от трёх вверх на пять этажей.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TISHLI-G'ILDIRAK: 8 tish + gardish + markaz; svg o'zi aylanadi (pq-gear).
const Gear = ({ cls }) => (
  <svg className={'pq-gear' + (cls ? ' ' + cls : '')} viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x="19.4" y="1" width="5.2" height="9" rx="1.5" fill="#7c8698" transform={`rotate(${i * 45} 22 22)`} />
    ))}
    <circle cx="22" cy="22" r="14" fill="#8a94a2" stroke="#5c6672" strokeWidth="2" />
    <circle cx="22" cy="22" r="7.2" fill="#6b7686" stroke="#5c6672" strokeWidth="1.4" />
    <circle cx="22" cy="22" r="2.6" fill="#4a5568" />
  </svg>
);

// KONVEYER ROLIGI: spitsali g'ildirak, joyida aylanadi (pq-roller).
const Roller = () => (
  <svg className="pq-roller" viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="10" cy="10" r="8.4" fill="#b7c0cd" stroke="#67728a" strokeWidth="1.6" />
    <line x1="10" y1="2" x2="10" y2="18" stroke="#67728a" strokeWidth="1.3" />
    <line x1="2" y1="10" x2="18" y2="10" stroke="#67728a" strokeWidth="1.3" />
    <circle cx="10" cy="10" r="2" fill="#67728a" />
  </svg>
);

// KARTON QUTI KANONI: jigarrang-sariq 2-ton, tasma+belgi. Bitta quti = bitta yuk.
const Box = ({ w = 24 }) => (
  <svg viewBox="0 0 28 24" width={w} height={(w * 24) / 28} aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2" y="3.5" width="24" height="18.5" rx="2.4" fill="#d9a05b" stroke="#96602c" strokeWidth="1.6" />
    <path d="M2 9 H26 M14 3.5 V22" stroke="#96602c" strokeWidth="1.3" opacity=".6" />
    <rect x="9" y="8.6" width="10" height="4.6" rx="1.1" fill="#c08840" stroke="#96602c" strokeWidth="0.8" />
  </svg>
);

// KABINA: metall quti, ikki tabaqali eshik, oynalar.
const Cabin = () => (
  <svg viewBox="0 0 56 34" width="56" height="34" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="1.5" y="1.5" width="53" height="31" rx="5" fill="#cdd6e2" stroke="#5c6672" strokeWidth="2.2" />
    <rect x="6" y="6" width="44" height="22" rx="3" fill="#aeb9c9" stroke="#67728a" strokeWidth="1.3" />
    <rect x="9" y="8" width="18" height="18" rx="2" fill="#9aa6b8" stroke="#67728a" strokeWidth="1.2" />
    <rect x="29" y="8" width="18" height="18" rx="2" fill="#9aa6b8" stroke="#67728a" strokeWidth="1.2" />
    <line x1="28" y1="8" x2="28" y2="26" stroke="#5c6672" strokeWidth="1.6" />
    <rect x="12" y="11" width="12" height="7" rx="1.5" fill="#bfe6f0" stroke="#67728a" strokeWidth="0.8" />
    <rect x="32" y="11" width="12" height="7" rx="1.5" fill="#bfe6f0" stroke="#67728a" strokeWidth="0.8" />
  </svg>
);

// ROBOT KANONI: metall tana (kulrang-ko'k 2-3 ton), ekran-yuz (ko'z pirpiratadi + LED tabassum),
// antenna (uchida pulslanuvchi doira), kalta bo'g'inli qo'l-oyoq. Do'stona.
const Robot = () => (
  <svg viewBox="0 0 60 80" width="52" height="69" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="30" y1="14" x2="30" y2="6" stroke="#67728a" strokeWidth="2.4" strokeLinecap="round" />
    <circle className="pq-ant" cx="30" cy="4.5" r="3.4" fill="#ff8f8f" stroke="#c94f4f" strokeWidth="1" />
    <rect x="13" y="13" width="34" height="27" rx="8" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.8" />
    <rect x="17.5" y="17.5" width="25" height="18" rx="5" fill="#2b3446" stroke="#4a5568" strokeWidth="1.2" />
    <g className="pq-reye">
      <circle cx="25" cy="24" r="3" fill="#7fe0ff" />
      <circle cx="35" cy="24" r="3" fill="#7fe0ff" />
    </g>
    <path d="M24 29.5 Q30 33.5 36 29.5" stroke="#7fe0ff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <rect x="26.5" y="39.5" width="7" height="4" fill="#8794a8" />
    <line x1="16" y1="50" x2="8.5" y2="56" stroke="#67728a" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="7.5" cy="57" r="2.8" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1" />
    <line x1="44" y1="50" x2="51.5" y2="56" stroke="#67728a" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="52.5" cy="57" r="2.8" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1" />
    <rect x="15" y="43" width="30" height="25" rx="7" fill="#8794a8" stroke="#4a5568" strokeWidth="1.8" />
    <rect x="20.5" y="48" width="19" height="11" rx="3" fill="#aeb9c9" stroke="#67728a" strokeWidth="1" />
    <circle className="pq-led l1" cx="25" cy="63.5" r="1.9" fill="#8ee6a0" />
    <circle className="pq-led l2" cx="30" cy="63.5" r="1.9" fill="#f2d06b" />
    <circle className="pq-led l3" cx="35" cy="63.5" r="1.9" fill="#ef8a8a" />
    <line x1="24" y1="68" x2="24" y2="75" stroke="#67728a" strokeWidth="3.6" strokeLinecap="round" />
    <line x1="36" y1="68" x2="36" y2="75" stroke="#67728a" strokeWidth="3.6" strokeLinecap="round" />
    <ellipse cx="24" cy="76" rx="4.2" ry="2.3" fill="#4a5568" />
    <ellipse cx="36" cy="76" rx="4.2" ry="2.3" fill="#4a5568" />
  </svg>
);

export default function D10_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda tushish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1002">
      <style>{`
        .pq1002{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1002 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a6b86;text-transform:uppercase;}
        .pq1002 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1002 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1002 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1002 .pq-stage{display:flex;justify-content:center;padding:10px;border-radius:22px;background:linear-gradient(#e7ebf1,#dbe1ea);border:2px solid #c8d0dc;}
        .pq1002 .pq-scene{position:relative;width:340px;max-width:100%;height:276px;border-radius:18px;background:linear-gradient(#eef1f6 0%,#dfe4ec 55%,#d2d9e4 100%);border:2px solid #c2cad8;overflow:hidden;}

        /* --- Fabrika foni --- */
        .pq1002 .pq-window{position:absolute;top:34px;right:14px;width:78px;height:66px;border-radius:6px;background:linear-gradient(135deg,#bfe0ef,#9fc9e4);border:3px solid #8f9aac;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35);z-index:1;background-image:linear-gradient(135deg,#c9e6f2,#a5cee6);}
        .pq1002 .pq-window::before{content:'';position:absolute;left:50%;top:4px;bottom:4px;width:2.5px;margin-left:-1.25px;background:#8f9aac;}
        .pq1002 .pq-window::after{content:'';position:absolute;top:50%;left:4px;right:4px;height:2.5px;margin-top:-1.25px;background:#8f9aac;}
        .pq1002 .pq-glow{position:absolute;top:38px;right:18px;width:30px;height:24px;background:rgba(255,255,255,.5);border-radius:4px;transform:skewX(-16deg);filter:blur(3px);z-index:1;animation:pqGlow 5s ease-in-out infinite;}
        .pq1002 .pq-pipe{position:absolute;top:12px;left:0;right:0;height:12px;background:linear-gradient(#aab4c2,#8894a5);border-bottom:2px solid #6f7a8b;z-index:1;box-shadow:inset 0 2px 0 rgba(255,255,255,.35);}
        .pq1002 .pq-valve{position:absolute;top:8px;left:120px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#c7d0dc,#8894a5);border:2px solid #6f7a8b;z-index:2;animation:pqGear 14s linear infinite;}
        .pq1002 .pq-valve::before,.pq1002 .pq-valve::after{content:'';position:absolute;left:50%;top:50%;width:16px;height:3px;background:#6f7a8b;transform:translate(-50%,-50%);border-radius:2px;}
        .pq1002 .pq-valve::after{transform:translate(-50%,-50%) rotate(90deg);}
        .pq1002 .pq-steam{position:absolute;top:2px;left:126px;width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.8);opacity:0;z-index:2;animation:pqSteam 4.4s ease-out infinite;}
        .pq1002 .pq-steam.s2{left:133px;animation-delay:-2.2s;width:7px;height:7px;}
        .pq1002 .pq-gearw{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq1002 .pq-gear{transform-origin:50% 50%;animation:pqGear 9s linear infinite;}
        .pq1002 .pq-gear.g2{animation-duration:6.5s;animation-direction:reverse;}
        .pq1002 .pq-lamp{position:absolute;top:24px;width:3px;height:12px;background:#8894a5;z-index:2;}
        .pq1002 .pq-lamp::after{content:'';position:absolute;left:50%;top:12px;width:16px;height:9px;margin-left:-8px;border-radius:0 0 9px 9px;background:radial-gradient(circle at 50% 20%,#fff4c4,#f2c94c);box-shadow:0 0 8px 2px rgba(242,201,76,.55);animation:pqFlick 3.2s steps(1) infinite;}
        .pq1002 .pq-lamp.la{left:170px;} .pq1002 .pq-lamp.lb{left:214px;animation-delay:-1.1s;}
        .pq1002 .pq-lamp.lb::after{animation-delay:-1.6s;}

        /* --- Yuk lifti shaxtasi --- */
        .pq1002 .pq-shaft{position:absolute;left:42px;bottom:${SHAFT_BOTTOM}px;width:60px;height:236px;border-radius:6px;background:linear-gradient(#c4ccd8,#b3bccb);border:3px solid #7c8698;overflow:hidden;z-index:2;box-shadow:inset 0 0 8px rgba(0,0,0,.12);}
        .pq1002 .pq-rail{position:absolute;top:2px;bottom:2px;width:3px;background:repeating-linear-gradient(#8994a5 0 6px,#aab4c2 6px 12px);}
        .pq1002 .pq-rail.rl{left:5px;} .pq1002 .pq-rail.rr{right:5px;}
        .pq1002 .pq-tick{position:absolute;left:6px;right:6px;height:2px;background:rgba(90,102,124,.4);}
        .pq1002 .pq-tick.t5{background:rgba(37,99,235,.5);height:2.5px;}
        .pq1002 .pq-cabinw{position:absolute;left:2px;width:56px;bottom:${sfb(TARGET)}px;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.22));}
        .pq1002 .pq-cabinw.go{animation:pqDescend 1.05s cubic-bezier(.45,.05,.55,1) both;}
        .pq1002 .pq-cabinw.win .pq-cab{animation:pqCele .55s ease;}
        .pq1002 .pq-cable{position:absolute;left:50%;bottom:34px;width:2.4px;height:250px;margin-left:-1.2px;background:linear-gradient(#6f7a8b,#8894a5);}
        .pq1002 .pq-cargo{position:absolute;left:50%;top:-17px;transform:translateX(-50%);z-index:2;}

        /* --- Qavat raqamlari (shaxtadan chapda) --- */
        .pq1002 .pq-fl{position:absolute;left:12px;width:24px;height:18px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#8994a5;font-variant-numeric:tabular-nums;z-index:2;}
        .pq1002 .pq-fl.tgt{color:#fff;border-radius:7px;width:22px;height:19px;box-shadow:0 2px 5px rgba(0,0,0,.18);}
        .pq1002 .pq-fl.q{background:linear-gradient(#5f6b86,#4a5568);animation:pqBreath 1.9s ease-in-out infinite;}
        .pq1002 .pq-fl.hit{background:linear-gradient(#2fbf6b,#1a9d52);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1002 .pq-ground{position:absolute;left:8px;bottom:${scfb(0) - 11}px;font-size:9px;font-weight:800;color:#aab4c2;z-index:2;}

        /* --- Qavat-badge (g'alaba: qolgan 1..5) --- */
        .pq1002 .pq-cnt{position:absolute;left:106px;width:19px;height:19px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:4;animation:pqPop .32s ease both;box-shadow:0 2px 4px rgba(37,99,235,.35);}

        /* --- Boshqaruv paneli + robot --- */
        .pq1002 .pq-panel{position:absolute;left:150px;bottom:96px;width:40px;height:60px;border-radius:8px;background:linear-gradient(#4a5568,#3a424f);border:2.5px solid #2b3140;z-index:3;display:flex;flex-direction:column;align-items:center;padding-top:6px;box-shadow:0 3px 6px rgba(0,0,0,.2);}
        .pq1002 .pq-pind{width:26px;height:22px;border-radius:5px;background:#0e1a24;color:#7fe0ff;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;box-shadow:inset 0 0 6px rgba(127,224,255,.4);}
        .pq1002 .pq-pind.win{color:#7dffa8;box-shadow:inset 0 0 6px rgba(125,255,168,.5);}
        .pq1002 .pq-pdown{margin-top:5px;font-size:15px;font-weight:900;color:#ff9d5c;line-height:1;animation:pqArrow 1.3s ease-in-out infinite;}
        .pq1002 .pq-pdown.win{color:#7dffa8;animation:none;}
        .pq1002 .pq-pbtn{margin-top:4px;width:9px;height:9px;border-radius:50%;background:#ef8a8a;box-shadow:0 0 5px rgba(239,138,138,.6);animation:pqFlick 2.4s steps(1) infinite;}
        .pq1002 .pq-robot{position:absolute;left:196px;bottom:26px;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));animation:pqBob 3s ease-in-out infinite;}
        .pq1002 .pq-ant{transform-box:fill-box;transform-origin:50% 50%;animation:pqAnt 1.5s ease-in-out infinite;}
        .pq1002 .pq-reye{transform-box:fill-box;transform-origin:50% 50%;animation:pqBlink 3.6s linear infinite;}
        .pq1002 .pq-led{animation:pqFlick 2.8s steps(1) infinite;}
        .pq1002 .pq-led.l2{animation-delay:-.9s;} .pq1002 .pq-led.l3{animation-delay:-1.7s;}

        /* --- Konveyer (pastda) --- */
        .pq1002 .pq-conv{position:absolute;left:0;right:0;bottom:0;height:24px;background:linear-gradient(#5c6672,#454e5a);border-top:2px solid #6f7a8b;z-index:2;}
        .pq1002 .pq-conv::before{content:'';position:absolute;left:0;right:0;top:3px;height:3px;background:repeating-linear-gradient(90deg,#7c8698 0 10px,#5c6672 10px 20px);}
        .pq1002 .pq-rollw{position:absolute;bottom:2px;line-height:0;z-index:3;}
        .pq1002 .pq-roller{transform-origin:50% 50%;animation:pqRoller 2.2s linear infinite;}
        .pq1002 .pq-convbox{position:absolute;bottom:19px;right:22px;z-index:3;filter:drop-shadow(0 1px 2px rgba(0,0,0,.2));}

        /* --- Chip (g'alaba) --- */
        .pq1002 .pq-chip{position:absolute;top:26px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}

        /* --- Variantlar --- */
        .pq1002 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq1002 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1002 .pq-opt:hover:not(:disabled){border-color:#aeb9c9;transform:translateY(-2px);}
        .pq1002 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1002 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1002 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1002 .pq-opt:disabled{cursor:default;}
        .pq1002 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1002 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1002 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqDescend{from{transform:translateY(-${DROP}px);}to{transform:translateY(0);}}
        @keyframes pqGear{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqRoller{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqAnt{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.35);opacity:.72;}}
        @keyframes pqBlink{0%,90%{transform:scaleY(1);}93%{transform:scaleY(.12);}96%,100%{transform:scaleY(1);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqArrow{0%,100%{transform:translateY(0);opacity:.8;}50%{transform:translateY(3px);opacity:1;}}
        @keyframes pqFlick{0%,100%{opacity:1;}45%{opacity:1;}47%{opacity:.35;}52%{opacity:1;}78%{opacity:1;}80%{opacity:.4;}83%{opacity:1;}}
        @keyframes pqGlow{0%,100%{opacity:.35;}50%{opacity:.7;}}
        @keyframes pqSteam{0%{opacity:0;transform:translateY(0) scale(.6);}20%{opacity:.8;}100%{opacity:0;transform:translateY(-22px) scale(1.6);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:scale(.3);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-scene">
          {/* Fabrika foni */}
          <span className="pq-pipe" />
          <span className="pq-valve" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-window" /><span className="pq-glow" />
          <span className="pq-gearw" style={{ top: 30, left: 116 }}><Gear /></span>
          <span className="pq-gearw" style={{ top: 58, left: 148 }}><Gear cls="g2" /></span>
          <span className="pq-lamp la" /><span className="pq-lamp lb" />

          {/* Yuk lifti shaxtasi */}
          <div className="pq-shaft">
            <span className="pq-rail rl" /><span className="pq-rail rr" />
            {FLOORS.map((f) => (
              <span key={f} className={'pq-tick' + (f === TARGET ? ' t5' : '')} style={{ bottom: sfb(f) }} />
            ))}
            <div className={'pq-cabinw' + (still ? '' : ' go') + (ok ? ' win' : '')}>
              <span className="pq-cable" />
              <span className="pq-cargo"><Box w={22} /></span>
              <span className="pq-cab"><Cabin /></span>
            </div>
          </div>

          {/* Qavat raqamlari */}
          {FLOORS.map((f) => {
            const isT = f === TARGET;
            const cls = 'pq-fl' + (isT ? ' tgt' + (ok ? ' hit' : ' q') : '');
            return <span key={f} className={cls} style={{ bottom: scfb(f) - 9 }}>{isT ? (ok ? TARGET : '?') : f}</span>;
          })}
          <span className="pq-ground">yer</span>

          {/* Qavat-badge — g'alabada qolgan 1..5 */}
          {ok && BADGES.map((f, i) => (
            <b key={f} className="pq-cnt" style={{ bottom: scfb(f) - 9, animationDelay: `${i * 0.12}s` }}>{f}</b>
          ))}

          {/* Boshqaruv paneli */}
          <div className="pq-panel">
            <span className={'pq-pind' + (ok ? ' win' : '')}>{ok ? TARGET : '?'}</span>
            <span className={'pq-pdown' + (ok ? ' win' : '')}>{'▲'}</span>
            <span className="pq-pbtn" />
          </div>

          {/* Robot */}
          <span className="pq-robot"><Robot /></span>

          {/* Konveyer */}
          <span className="pq-conv" />
          <span className="pq-rollw" style={{ left: 10 }}><Roller /></span>
          <span className="pq-rollw" style={{ left: 46 }}><Roller /></span>
          <span className="pq-rollw" style={{ left: 250 }}><Roller /></span>
          <span className="pq-rollw" style={{ left: 286 }}><Roller /></span>
          <span className="pq-convbox"><Box w={22} /></span>

          {/* Chip */}
          {ok && <span className="pq-chip">{START} {MINUS} {JUMP} = {TARGET}</span>}
        </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
