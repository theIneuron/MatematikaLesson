// Dars10 · Amaliyot 09 — P9 Aralash ikki bosqichli «Konveyer: qo'sh, keyin tushir» · 🔴 · tag: word_mixed_2step_10
// 4 + 5 − 2 = 7 (10 ichida). Fabrika-konveyer: boshida 4 kanon-quti; ochilishda AVVAL robot 5 quti
// qo'shadi (tepadan tushib joylashadi), KEYIN (pauza) 2 quti tasma oxiridan yuk-teshikka tushib ketadi.
// Konveyerda 7 qoladi. G'alabada: badge faqat qolgan 7 qutida (chapdan 1..7), chip «4 + 5 − 2 = 7».
// Fon jonli: tishli-g'ildiraklar aylanadi, rolik-g'ildiraklar aylanadi, robot ko'z pirpiratadi +
// antenna puls, chiroqlar miltillaydi, quvurdan bug', «?» breath-pulse. Harakat mount'da bir marta.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const START = 4, PLUS = 5, MINUS = 2, TARGET = 7; // 4 + 5 − 2 = 7
const DATA = { start: START, plus: PLUS, minus: MINUS, target: TARGET, options: [6, 7, 8, 5], ptype: 'P9', level: '🔴', tag: 'word_mixed_2step_10' };
const T = {
  uz: {
    eyebrow: "Fabrika · Masala", title: "Aralash masala",
    setup: "Konveyerda to'rtta quti bor edi. Avval robot yana beshta quti qo'shdi, keyin ikkita quti tasmadan tushib ketdi.",
    ask: "Konveyerda nechta quti qoldi?",
    correct: "Barakalla! To'rtga besh qo'shildi, ikkitasi ketdi — yettita qoldi.",
    hint: "Bosqichma-bosqich: avval to'rtga beshni qo'shing, keyin chiqqan sondan ikkini ayiring.",
  },
  ru: {
    eyebrow: "Фабрика · Задача", title: "Смешанная задача",
    setup: "На конвейере было четыре коробки. Сначала робот добавил ещё пять коробок, потом две коробки упали с ленты.",
    ask: "Сколько коробок осталось на конвейере?",
    correct: "Молодец! К четырём прибавили пять, две ушли — осталось семь.",
    hint: "Шаг за шагом: сначала прибавь к четырём пять, потом от полученного числа отними два.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QUTI KANONI: karton quti — jigarrang-sariq 2-ton (#d9a05b/#b07d3a, kontur #96602c), 3D qopqoq +
// old yuzda tasma/yorliq; bitta quti = bitta dona (sanash uchun).
const Box = () => (
  <svg viewBox="0 0 36 34" width="30" height="28" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M27 10 L35 5 L35 27 L27 32 Z" fill="#b07d3a" stroke="#96602c" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M1 10 L9 5 L35 5 L27 10 Z" fill="#e8b878" stroke="#96602c" strokeWidth="1.4" strokeLinejoin="round" />
    <rect x="1" y="10" width="26" height="22" rx="1.5" fill="#d9a05b" stroke="#96602c" strokeWidth="1.6" />
    <rect x="11.4" y="10" width="5" height="22" fill="#c8894a" opacity=".55" />
    <path d="M12.4 10 L15.6 5 L20.4 5 L17.2 10 Z" fill="#d8a86a" opacity=".7" />
    <rect x="4.5" y="19" width="9" height="6.5" rx="1" fill="#f4e6cc" opacity=".85" />
    <line x1="5.5" y1="21.2" x2="12.5" y2="21.2" stroke="#c8a878" strokeWidth="1" strokeLinecap="round" />
    <line x1="5.5" y1="23.4" x2="10.5" y2="23.4" stroke="#c8a878" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// ROBOT KANONI: metall tana (kulrang-ko'k #8794a8/#aeb9c9/#67728a, kontur #4a5568), ekran-yuz
// (2 ko'z + LED-tabassum, ko'zlar pirpiratadi), antenna (uchida pulslanuvchi doira), kalta qo'l-oyoq.
// Chap qo'li konveyer tomon cho'zilgan — «qo'shayotgani».
const Robot = () => (
  <svg viewBox="0 0 64 80" width="56" height="70" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="32" cy="76" rx="20" ry="4" fill="#3a4353" opacity=".22" />
    <line x1="32" y1="13" x2="32" y2="4.5" stroke="#67728a" strokeWidth="2.6" strokeLinecap="round" />
    <circle className="pq-ant" cx="32" cy="4" r="3.4" fill="#ff7a7a" stroke="#d84f4f" strokeWidth="1" />
    <rect x="15" y="12" width="34" height="24" rx="9" fill="#aeb9c9" stroke="#4a5568" strokeWidth="2" />
    <rect x="11" y="20" width="4" height="8" rx="2" fill="#8794a8" stroke="#4a5568" strokeWidth="1.4" />
    <rect x="49" y="20" width="4" height="8" rx="2" fill="#8794a8" stroke="#4a5568" strokeWidth="1.4" />
    <rect x="20" y="16.5" width="24" height="15" rx="4.5" fill="#26303f" />
    <circle cx="28" cy="23" r="2.6" fill="#7fe0ff" />
    <circle cx="38" cy="23" r="2.6" fill="#7fe0ff" />
    <g className="pq-rblink"><rect x="24.6" y="20.4" width="6.8" height="5.4" rx="1.4" fill="#26303f" /><rect x="34.6" y="20.4" width="6.8" height="5.4" rx="1.4" fill="#26303f" /></g>
    <path d="M27 28.2 Q33 31.2 39 28.2" stroke="#7fe0ff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <rect x="28" y="35" width="8" height="4" fill="#67728a" />
    <rect x="13" y="39" width="38" height="27" rx="8" fill="#8794a8" stroke="#4a5568" strokeWidth="2" />
    <rect x="21" y="45" width="22" height="14" rx="3" fill="#67728a" />
    <circle className="pq-led l1" cx="27" cy="52" r="2" fill="#7be08a" />
    <circle className="pq-led l2" cx="33" cy="52" r="2" fill="#f2c14e" />
    <circle className="pq-led l3" cx="39" cy="52" r="2" fill="#ff7a7a" />
    <path d="M13 46 Q1 44 3 33" fill="none" stroke="#8794a8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="3.5" cy="32.5" r="4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.5" />
    <path d="M51 46 Q60 47 59 55" fill="none" stroke="#8794a8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="59" cy="55.5" r="4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.5" />
    <rect x="20" y="65" width="9" height="10" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.5" />
    <rect x="35" y="65" width="9" height="10" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.5" />
  </svg>
);

// TISHLI-G'ILDIRAK (fon dekori, sekin aylanadi).
const Gear = ({ size, teeth = 8, color = '#b8c1cf' }) => (
  <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: teeth }).map((_, i) => (
      <rect key={i} x="19.5" y="1.5" width="5" height="8" rx="1.2" fill={color} transform={`rotate(${(i * 360) / teeth} 22 22)`} />
    ))}
    <circle cx="22" cy="22" r="14" fill={color} stroke="#a3adbd" strokeWidth="2" />
    <circle cx="22" cy="22" r="5.5" fill="#e6eaf1" stroke="#a3adbd" strokeWidth="1.6" />
  </svg>
);

// KONVEYER ROLIGI (aylanadi).
const Roller = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill="#6b7686" stroke="#3f4756" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="#aeb9c9" />
    <line x1="12" y1="3" x2="12" y2="21" stroke="#3f4756" strokeWidth="1.6" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#3f4756" strokeWidth="1.6" />
  </svg>
);

// Qutilar (sahna px, wrapper left). kind: start = boshidan (chapdan sirg'aladi),
// added = robot qo'shadi (tepadan tushadi). fall = tasma oxiridan yuk-teshikka tushadi.
// n = sanoq tartibi (g'alabada faqat qoluvchi 7 qutida badge 1..7).
const BOXES = [
  { x: 60,  kind: 'start', n: 1, d: 0 },
  { x: 90,  kind: 'start', n: 2, d: 0.12 },
  { x: 120, kind: 'start', n: 3, d: 0.24 },
  { x: 150, kind: 'start', n: 4, d: 0.36 },
  { x: 180, kind: 'added', n: 5, d: 0.9 },
  { x: 210, kind: 'added', n: 6, d: 1.08 },
  { x: 240, kind: 'added', n: 7, d: 1.26 },
  { x: 288, kind: 'added', fall: true, d: 1.44, fd: 2.5 },
  { x: 320, kind: 'added', fall: true, d: 1.62, fd: 2.72 },
];
const ROLLERS = [58, 92, 126, 160, 194, 228, 258];

export default function D10_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-choreografiyasi (qo'shish / tushish) qayta ijro etilmaydi.
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
    <div className="pq pq1009">
      <style>{`
        .pq1009{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1009 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5b6b82;text-transform:uppercase;}
        .pq1009 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1009 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1009 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1009 .pq-stage{display:flex;flex-direction:column;align-items:center;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eef1f6,#e2e7ef);border:2px solid #d2d9e4;}
        .pq1009 .pq-scene{position:relative;width:372px;max-width:100%;height:210px;border-radius:18px;background:linear-gradient(#dbe2ec 0%,#ccd5e2 62%,#c0cad9 100%);border:2px solid #c0cad9;overflow:hidden;}
        .pq1009 .pq-win{position:absolute;top:14px;border-radius:5px;background:linear-gradient(#eaf4fb,#c7e2f2);border:2.5px solid #9bb3c9;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35);z-index:0;}
        .pq1009 .pq-win::before,.pq1009 .pq-win::after{content:'';position:absolute;background:#9bb3c9;}
        .pq1009 .pq-win::before{left:50%;top:0;bottom:0;width:2px;margin-left:-1px;}
        .pq1009 .pq-win::after{top:50%;left:0;right:0;height:2px;margin-top:-1px;}
        .pq1009 .pq-win.w1{left:22px;width:50px;height:32px;}
        .pq1009 .pq-win.w2{left:88px;width:50px;height:32px;}
        .pq1009 .pq-gear{position:absolute;line-height:0;z-index:1;opacity:.5;animation:pqSpin linear infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq1009 .pq-gear.g1{left:296px;top:20px;animation-duration:11s;}
        .pq1009 .pq-gear.g2{left:328px;top:50px;animation-duration:8s;animation-direction:reverse;opacity:.42;}
        .pq1009 .pq-gear.g3{left:150px;top:16px;animation-duration:13s;opacity:.4;}
        .pq1009 .pq-pipe{position:absolute;top:0;right:24px;width:14px;height:60px;background:linear-gradient(90deg,#9aa6b6,#c3ccd8 45%,#8794a8);border:1.5px solid #6b7686;border-top:none;border-radius:0 0 4px 4px;z-index:2;}
        .pq1009 .pq-pipe::after{content:'';position:absolute;left:-4px;bottom:8px;width:22px;height:9px;border-radius:3px;background:#8794a8;border:1.5px solid #6b7686;}
        .pq1009 .pq-valve{position:absolute;top:52px;right:20px;width:9px;height:9px;border-radius:50%;background:#e05a4d;border:1.5px solid #b23b30;z-index:3;}
        .pq1009 .pq-steam{position:absolute;top:-6px;right:28px;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.85);filter:blur(1px);opacity:0;z-index:2;animation:pqSteam 6.5s ease-in-out infinite;}
        .pq1009 .pq-steam.s2{animation-delay:-3.2s;right:26px;}
        .pq1009 .pq-lamp{position:absolute;top:6px;width:8px;height:8px;border-radius:50%;z-index:2;animation:pqLamp 2.4s ease-in-out infinite;}
        .pq1009 .pq-lamp.p1{left:200px;background:#ffd76a;box-shadow:0 0 6px 1px rgba(255,215,106,.7);}
        .pq1009 .pq-lamp.p2{left:224px;background:#8be08a;box-shadow:0 0 6px 1px rgba(139,224,138,.7);animation-delay:-.8s;}
        .pq1009 .pq-lamp.p3{left:248px;background:#ff9a7a;box-shadow:0 0 6px 1px rgba(255,154,122,.7);animation-delay:-1.6s;}
        .pq1009 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(#8b95a6,#6f7a8d);border-top:2px solid #97a1b2;z-index:1;}
        .pq1009 .pq-belt{position:absolute;left:52px;width:214px;bottom:14px;height:24px;border-radius:6px;background:#3f4756;border:2px solid #2c333f;box-shadow:inset 0 3px 5px rgba(0,0,0,.28);overflow:hidden;z-index:1;}
        .pq1009 .pq-belt-surf{position:absolute;left:0;right:0;top:3px;height:12px;background:repeating-linear-gradient(90deg,#5a6373 0 16px,#4a5361 16px 32px);animation:pqTread 1.1s linear infinite;}
        .pq1009 .pq-scene.still .pq-belt-surf{animation:none;}
        .pq1009 .pq-roller{position:absolute;bottom:3px;line-height:0;z-index:1;animation:pqSpin 1.5s linear infinite;}
        .pq1009 .pq-scene.still .pq-roller{animation:none;}
        .pq1009 .pq-hole{position:absolute;left:268px;bottom:14px;width:94px;height:34px;border-radius:8px 8px 5px 5px;background:linear-gradient(#39445a,#1c2434 72%);border:2px solid #2b3342;box-shadow:inset 0 8px 12px rgba(0,0,0,.55);z-index:2;overflow:hidden;}
        .pq1009 .pq-hole::before{content:'';position:absolute;left:8px;right:8px;top:5px;height:6px;border-radius:50%;background:rgba(0,0,0,.4);}
        .pq1009 .pq-holelip{position:absolute;left:266px;bottom:10px;width:98px;height:11px;border-radius:5px;background:linear-gradient(#5a6577,#454f61);border:2px solid #3a4352;z-index:5;box-shadow:0 -1px 2px rgba(0,0,0,.2);}
        .pq1009 .pq-boxw{position:absolute;bottom:38px;line-height:0;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq1009 .pq-boxw.start{animation:pqSlideIn .55s cubic-bezier(.3,.9,.4,1) both;animation-delay:var(--d,0s);}
        .pq1009 .pq-boxw.added{animation:pqDropTop .6s cubic-bezier(.3,1.05,.5,1) both;animation-delay:var(--d,0s);}
        .pq1009 .pq-boxw.fall{animation:pqDropTop .6s cubic-bezier(.3,1.05,.5,1) var(--d,0s) both,pqFallHole .8s cubic-bezier(.45,.05,.75,.85) var(--fd,2.6s) forwards;}
        .pq1009 .pq-scene.still .pq-boxw{animation:none;}
        .pq1009 .pq-bob{display:block;animation:pqBob 2.7s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1009 .pq-bob.win{animation:pqBob 2.7s ease-in-out infinite,pqCele .55s ease;}
        .pq1009 .pq-cnt{position:absolute;top:-9px;right:-6px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1009 .pq-robot{position:absolute;left:2px;bottom:16px;line-height:0;z-index:4;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));}
        .pq1009 .pq-robot.win{animation:pqCele .55s ease;}
        .pq1009 .pq-ant{transform-box:fill-box;transform-origin:50% 50%;animation:pqAnt 1.4s ease-in-out infinite;}
        .pq1009 .pq-rblink{opacity:0;animation:pqBlink 3.6s linear infinite;}
        .pq1009 .pq-led{animation:pqLed 1.8s ease-in-out infinite;}
        .pq1009 .pq-led.l2{animation-delay:-.6s;} .pq1009 .pq-led.l3{animation-delay:-1.2s;}
        .pq1009 .pq-tag{position:absolute;font-size:22px;font-weight:900;z-index:6;text-shadow:0 1px 0 rgba(255,255,255,.7);}
        .pq1009 .pq-tag.add{left:190px;top:36px;color:#1a7f43;animation:pqFlash 1.7s ease 0.75s both;}
        .pq1009 .pq-tag.sub{left:296px;top:44px;color:#c0392b;animation:pqFlash 1.5s ease 2.35s both;}
        .pq1009 .pq-q{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #c3cdda;color:#5b6b82;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(91,107,130,.22);animation:pqBreath 2.2s ease-in-out infinite;z-index:6;}
        .pq1009 .pq-chip{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:7;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq1009 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .pq1009 .pq-opt{width:68px;height:68px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1009 .pq-opt:hover:not(:disabled){border-color:#aeb9c9;transform:translateY(-2px);}
        .pq1009 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1009 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1009 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1009 .pq-opt:disabled{cursor:default;}
        .pq1009 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1009 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1009 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqTread{from{background-position-x:0;}to{background-position-x:32px;}}
        @keyframes pqSlideIn{0%{opacity:0;transform:translateX(-52px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes pqDropTop{0%{opacity:0;transform:translateY(-118px);}70%{opacity:1;transform:translateY(5px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqFallHole{0%{opacity:1;transform:translateY(0) rotate(0);}55%{opacity:1;}100%{opacity:0;transform:translateY(46px) rotate(18deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqAnt{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.35);opacity:.7;}}
        @keyframes pqBlink{0%,92%{opacity:0;}94%,97%{opacity:1;}99%,100%{opacity:0;}}
        @keyframes pqLed{0%,100%{opacity:.4;}50%{opacity:1;}}
        @keyframes pqLamp{0%,100%{opacity:.45;transform:scale(.9);}50%{opacity:1;transform:scale(1.1);}}
        @keyframes pqSteam{0%,60%,100%{opacity:0;transform:translateY(0) scale(.6);}72%{opacity:.85;transform:translateY(-14px) scale(1);}88%{opacity:0;transform:translateY(-26px) scale(1.4);}}
        @keyframes pqFlash{0%{opacity:0;transform:translateY(-4px) scale(.8);}20%{opacity:1;transform:translateY(0) scale(1);}72%{opacity:1;}100%{opacity:0;transform:scale(.9);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.12);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-win w1" /><span className="pq-win w2" />
          <span className="pq-gear g3"><Gear size={38} teeth={9} /></span>
          <span className="pq-gear g1"><Gear size={44} teeth={9} /></span>
          <span className="pq-gear g2"><Gear size={28} teeth={8} color="#aab4c2" /></span>
          <span className="pq-pipe" /><span className="pq-valve" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-lamp p1" /><span className="pq-lamp p2" /><span className="pq-lamp p3" />

          <span className="pq-floor" />

          {/* Konveyer tasma + aylanuvchi roliklar */}
          <div className="pq-belt">
            <span className="pq-belt-surf" />
          </div>
          {ROLLERS.map((x, i) => (<span key={i} className="pq-roller" style={{ left: x, animationDelay: `${-i * 0.18}s` }}><Roller /></span>))}

          {/* Yuk-teshik: tasma oxiridagi ochiq — tushib ketgan qutilar shu yerga kiradi */}
          <span className="pq-hole" />

          {/* 9 quti: 4 boshidan + robot qo'shgan 5; oxirgi 2 si yuk-teshikka tushadi, 7 qoladi */}
          {BOXES.filter((b) => !(still && b.fall)).map((b, i) => (
            <span key={i} className={'pq-boxw ' + b.kind + (b.fall ? ' fall' : '')}
              style={{ left: b.x, '--d': `${b.d}s`, ...(b.fall ? { '--fd': `${b.fd}s` } : {}) }}>
              <span className={'pq-bob' + (ok && !b.fall ? ' win' : '')} style={{ '--bd': `${-i * 0.33}s` }}>
                <Box />
                {ok && !b.fall && <b className="pq-cnt" style={{ animationDelay: `${(b.n - 1) * 0.1}s` }}>{b.n}</b>}
              </span>
            </span>
          ))}

          <span className="pq-holelip" />

          <span className={'pq-robot' + (ok ? ' win' : '')}><Robot /></span>

          {!still && !ok && (
            <>
              <span className="pq-tag add">+{PLUS}</span>
              <span className="pq-tag sub">−{MINUS}</span>
            </>
          )}
          {!ok && <span className="pq-q">?</span>}
          {ok && <span className="pq-chip">{START} + {PLUS} − {MINUS} = {TARGET}</span>}
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
