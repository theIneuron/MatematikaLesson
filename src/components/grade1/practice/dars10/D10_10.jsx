// Dars10 · Amaliyot 10 — «Sehrli mashina» (funksiya-mashina) · 🔴 · tag: function_machine
// YANGI mexanika: qoida-asosli mashina. Bosqich 1 (avto-demo, mount'da bir marta):
// «2» kiradi → g'ildiraklar aylanadi → «5» chiqadi (qoida +3 ni o'rgatadi). Bosqich 2:
// «4» koptogi + «Ishga tushir» tugmasi → g'ildiraklar aylanadi → chiqishda «?» → variant (7) tanla.
// Fabrika-kanon: metall korpus, kirish-voronka, chiqish-nov, ichki tishli-g'ildiraklar (aylanadi),
// «+ 3» LED qoida-tablo (breath), fon-g'ildiraklar, bug'li quvur, miltillovchi chiroqlar, robot-operator.
// still/restore: demo o'tkaziladi — darhol tayyor (chiqish = 7 statik).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { rule: '+3', input: 4, target: 7, options: [6, 7, 8], ptype: 'NEW', level: '🔴', tag: 'function_machine' };
const ADD = DATA.target - DATA.input;   // 3
const DEMO = { in: 2, out: 2 + ADD };   // 2 → 5
const T = {
  uz: {
    eyebrow: 'Fabrika · Sehrli mashina', title: 'Sehrli mashina',
    setup: 'Bu sehrli mashina har songa uchtani qo\'shadi! Qarang: ikki kirdi — besh chiqdi. Endi to\'rt kiritamiz.',
    ask: 'Ishga tushir tugmasini bosing, keyin nechta chiqishini tanlang.',
    correct: 'Barakalla! To\'rtga uch qo\'shildi — yetti chiqdi. Mashina qoidasini tushundingiz!',
    hint: 'Qoidaga qarang: mashina har songa uch qo\'shadi. To\'rtga uch qo\'shing.',
    btnRun: 'Ishga tushir', demoNote: 'Namuna',
  },
  ru: {
    eyebrow: 'Фабрика · Волшебная машина', title: 'Волшебная машина',
    setup: 'Эта волшебная машина к каждому числу прибавляет три! Смотрите: вошло два — вышло пять. Теперь введём четыре.',
    ask: 'Нажми «Запусти», а потом выбери, сколько выйдет.',
    correct: 'Молодец! К четырём прибавили три — вышло семь. Ты понял правило машины!',
    hint: 'Посмотри на правило: машина к каждому числу прибавляет три. Прибавь к четырём три.',
    btnRun: 'Запусти', demoNote: 'Образец',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const IconPlay = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5 L19 12 L7 19 Z" /></svg>);

// TISHLI-G'ILDIRAK KANONI (D10_06): 8 tish + tana + o'q. Metall kulrang-ko'k.
const Gear = ({ size = 44, c = '#8794a8', line = '#5a6577', core = '#e9edf3' }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x="21.5" y="1.5" width="5" height="9" rx="1.6" fill={c} stroke={line} strokeWidth="1.2" transform={`rotate(${i * 45} 24 24)`} />
    ))}
    <circle cx="24" cy="24" r="14.5" fill={c} stroke={line} strokeWidth="2" />
    <circle cx="24" cy="24" r="6.5" fill={core} stroke={line} strokeWidth="1.6" />
    <circle cx="24" cy="24" r="2.4" fill={line} />
  </svg>
);

// ROBOT-OPERATOR KANONI (D10_06): metall tana, ekran-yuz (pirpiratuvchi ko'z + LED-tabassum),
// antenna (pulslanuvchi doira), bo'g'in-to'garakli qo'l-oyoq. Mashinani boshqaradi.
const Robot = () => (
  <svg viewBox="0 0 72 100" width="44" height="61" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="36" y1="20" x2="36" y2="8" stroke="#67728a" strokeWidth="3" strokeLinecap="round" />
    <circle className="pq-ant" cx="36" cy="6.5" r="4.2" fill="#ffb14e" stroke="#d98b23" strokeWidth="1.1" />
    <line x1="28" y1="86" x2="28" y2="94" stroke="#67728a" strokeWidth="5.5" strokeLinecap="round" />
    <line x1="44" y1="86" x2="44" y2="94" stroke="#67728a" strokeWidth="5.5" strokeLinecap="round" />
    <circle cx="28" cy="95.5" r="4.2" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.4" />
    <circle cx="44" cy="95.5" r="4.2" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.4" />
    <line x1="13" y1="58" x2="7" y2="70" stroke="#67728a" strokeWidth="4.4" strokeLinecap="round" />
    <circle cx="6" cy="72" r="4.4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.3" />
    <line x1="59" y1="58" x2="65" y2="70" stroke="#67728a" strokeWidth="4.4" strokeLinecap="round" />
    <circle cx="66" cy="72" r="4.4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.3" />
    <rect x="14" y="48" width="44" height="40" rx="13" fill="#aeb9c9" stroke="#4a5568" strokeWidth="2" />
    <rect x="21" y="55" width="30" height="15" rx="5" fill="#98a4b6" stroke="#67728a" strokeWidth="1.4" />
    <circle cx="28" cy="62.5" r="2.3" fill="#c9d2df" /><circle cx="36" cy="62.5" r="2.3" fill="#c9d2df" /><circle cx="44" cy="62.5" r="2.3" fill="#c9d2df" />
    <rect x="18" y="20" width="36" height="30" rx="11" fill="#8794a8" stroke="#4a5568" strokeWidth="2" />
    <rect x="22" y="25" width="28" height="20" rx="7" fill="#1e2740" />
    <circle cx="31" cy="33" r="3.3" fill="#7cf0ff" /><circle cx="41" cy="33" r="3.3" fill="#7cf0ff" />
    <circle cx="32" cy="32.2" r="1" fill="#dffcff" /><circle cx="42" cy="32.2" r="1" fill="#dffcff" />
    <g className="pq-blink"><rect x="27.5" y="29.5" width="7" height="7" rx="2.5" fill="#1e2740" /><rect x="37.5" y="29.5" width="7" height="7" rx="2.5" fill="#1e2740" /></g>
    <path d="M30 39.5 Q36 43.5 42 39.5" stroke="#7cf0ff" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="17" cy="35" r="2.6" fill="#67728a" stroke="#4a5568" strokeWidth="1.1" />
    <circle cx="55" cy="35" r="2.6" fill="#67728a" stroke="#4a5568" strokeWidth="1.1" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D10_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [ran, setRan] = useState(false);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review/qayta ochilishda demo va kirish-harakati qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      setRan(true);
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(ran && picked !== null && !checked); }, [ran, picked, checked, onReady]);

  const check = useCallback(() => {
    if (!ran || picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked, ran: true }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [ran, picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const showDemo = !still && !ran;

  return (
    <div className="pq pq1010">
      <style>{`
        .pq1010{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1010 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a6b8c;text-transform:uppercase;}
        .pq1010 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1010 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1010 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1010 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 14px;border-radius:22px;background:linear-gradient(#e8ecf3,#dde3ec);border:2px solid #cdd6e2;}
        .pq1010 .pq-scene{position:relative;width:372px;max-width:100%;height:250px;border-radius:18px;background:linear-gradient(#cdd7e6 0%,#bdc9db 55%,#aab7cc 100%);border:2px solid #b3bfd0;overflow:hidden;}

        /* Fon dekori */
        .pq1010 .pq-gear{position:absolute;line-height:0;z-index:0;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq1010 .pq-gear svg{animation:pqSpin 8s linear infinite;}
        .pq1010 .pq-gear.bg1{left:6px;top:10px;opacity:.55;}
        .pq1010 .pq-gear.bg2{left:40px;top:34px;opacity:.5;}
        .pq1010 .pq-gear.bg2 svg{animation:pqSpin 6s linear infinite reverse;}
        .pq1010 .pq-gear.bg3{right:8px;top:16px;opacity:.5;}
        .pq1010 .pq-gear.bg3 svg{animation:pqSpin 10s linear infinite;}
        .pq1010 .pq-pipe{position:absolute;left:0;right:0;top:0;height:11px;background:linear-gradient(#b7c1d0,#8b97a9 55%,#727e92);border-bottom:2px solid #667080;z-index:1;}
        .pq1010 .pq-valve{position:absolute;right:30px;top:-6px;width:10px;height:10px;border-radius:50%;background:#e05a4d;border:1.5px solid #b23b30;z-index:3;}
        .pq1010 .pq-steam{position:absolute;right:34px;top:-6px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.85);z-index:2;opacity:0;animation:pqSteam 4.4s ease-in-out infinite;}
        .pq1010 .pq-steam.s2{right:42px;animation-delay:-2.2s;}
        .pq1010 .pq-led{position:absolute;top:15px;width:8px;height:8px;border-radius:50%;z-index:3;box-shadow:0 0 5px currentColor;}
        .pq1010 .pq-led.l1{left:14px;color:#57d68a;background:#57d68a;animation:pqBlinkL 1.5s ease-in-out infinite;}
        .pq1010 .pq-led.l2{left:26px;color:#ffcf3f;background:#ffcf3f;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-.5s;}
        .pq1010 .pq-led.l3{left:38px;color:#e05a4d;background:#e05a4d;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-1s;}
        .pq1010 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:22px;background:linear-gradient(#8b95a6,#6f7a8d);border-top:2px solid #97a1b2;z-index:1;}

        /* Kirish voronka */
        .pq1010 .pq-funnel{position:absolute;left:148px;top:26px;width:76px;height:28px;z-index:3;background:linear-gradient(#c9d2df,#93a0b2);border:2px solid #6c7789;border-bottom:none;clip-path:polygon(0 0,100% 0,70% 100%,30% 100%);}
        .pq1010 .pq-funnel::after{content:'';position:absolute;left:6px;top:3px;width:12px;height:16px;background:rgba(255,255,255,.4);border-radius:3px;clip-path:polygon(0 0,100% 0,55% 100%,25% 100%);}

        /* Mashina korpusi */
        .pq1010 .pq-machine{position:absolute;left:108px;top:52px;width:156px;height:132px;border-radius:16px;background:linear-gradient(150deg,#c2ccd9 0%,#a6b2c4 55%,#93a0b3 100%);border:3px solid #6c7789;box-shadow:inset 0 2px 0 rgba(255,255,255,.4),0 4px 8px rgba(60,72,92,.25);z-index:2;}
        .pq1010 .pq-machine .rivet{position:absolute;width:6px;height:6px;border-radius:50%;background:radial-gradient(#e6ebf2,#8794a8);border:1px solid #6c7789;}
        .pq1010 .pq-machine .rivet.r1{left:7px;top:7px;} .pq1010 .pq-machine .rivet.r2{right:7px;top:7px;}
        .pq1010 .pq-machine .rivet.r3{left:7px;bottom:7px;} .pq1010 .pq-machine .rivet.r4{right:7px;bottom:7px;}
        /* ichki tishli-g'ildirak darchasi */
        .pq1010 .pq-win{position:absolute;left:14px;top:24px;width:64px;height:84px;border-radius:10px;background:radial-gradient(circle at 50% 40%,#38435c,#232c40);border:2.5px solid #59647e;box-shadow:inset 0 2px 6px rgba(0,0,0,.5);overflow:hidden;}
        .pq1010 .pq-wgear{position:absolute;line-height:0;}
        .pq1010 .pq-wgear svg{animation:pqSpin 3.4s linear infinite;}
        .pq1010 .pq-wgear.a{left:8px;top:12px;} .pq1010 .pq-wgear.b{right:6px;bottom:10px;}
        .pq1010 .pq-wgear.b svg{animation:pqSpin 2.6s linear infinite reverse;}
        /* qoida-tablo «+ 3» */
        .pq1010 .pq-rule{position:absolute;right:12px;top:34px;width:62px;height:44px;border-radius:9px;background:linear-gradient(#141c30,#232f4a);border:2.5px solid #5a6b8c;display:flex;align-items:center;justify-content:center;gap:3px;box-shadow:inset 0 0 8px rgba(0,0,0,.55),0 0 6px rgba(90,214,138,.25);animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1010 .pq-rule b{font-size:26px;font-weight:900;color:#6df0a5;text-shadow:0 0 8px rgba(109,240,165,.7);font-variant-numeric:tabular-nums;}
        .pq1010 .pq-rule small{position:absolute;top:3px;left:8px;font-size:8px;font-weight:800;letter-spacing:.06em;color:#8fa2c4;text-transform:uppercase;}
        /* mashina quvvat chiroqlari */
        .pq1010 .pq-mlamp{position:absolute;right:14px;bottom:12px;width:9px;height:9px;border-radius:50%;background:#6b7686;border:1px solid #4a5568;}
        .pq1010 .pq-mlamp.m2{right:28px;} .pq1010 .pq-mlamp.m3{right:42px;}
        .pq1010 .pq-machine.win .pq-mlamp{background:#57d68a;border-color:#2f9c5f;box-shadow:0 0 7px 1px rgba(87,214,138,.8);animation:pqBlinkL .7s ease-in-out infinite;}
        .pq1010 .pq-machine.win .pq-mlamp.m2{animation-delay:-.23s;} .pq1010 .pq-machine.win .pq-mlamp.m3{animation-delay:-.46s;}
        .pq1010 .pq-machine.win{animation:pqCele .55s ease;}

        /* Chiqish nov */
        .pq1010 .pq-chute{position:absolute;left:166px;top:182px;width:40px;height:20px;z-index:2;background:linear-gradient(#a6b2c4,#7f8ca0);border:2px solid #6c7789;border-top:none;clip-path:polygon(18% 0,82% 0,100% 100%,0 100%);}

        /* Umumiy koptok */
        .pq1010 .pq-ball{position:relative;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;box-shadow:inset 0 2px 3px rgba(255,255,255,.5),inset 0 -3px 5px rgba(0,0,0,.22),0 2px 4px rgba(0,0,0,.25);border:2px solid rgba(0,0,0,.12);}
        .pq1010 .pq-ball::after{content:'';position:absolute;top:6px;left:9px;width:9px;height:6px;border-radius:50%;background:rgba(255,255,255,.55);}
        .pq1010 .pq-ball.blue{background:radial-gradient(circle at 38% 32%,#7db8f0,#2f7fd6 70%,#1f5fae);}
        .pq1010 .pq-ball.teal{background:radial-gradient(circle at 38% 32%,#7fe0d0,#22a996 70%,#0f8272);}
        .pq1010 .pq-ball.amber{background:radial-gradient(circle at 38% 32%,#ffd98a,#f2a63a 70%,#d98b23);}

        /* Kirish (tayyor) koptok */
        .pq1010 .pq-inwrap{position:absolute;left:167px;top:2px;z-index:4;animation:pqReady .5s ease 3.05s both;}
        .pq1010 .pq-scene.still .pq-inwrap{animation:none;}
        .pq1010 .pq-inbob{position:relative;line-height:0;animation:pqBob 2.6s ease-in-out 3.55s infinite;}
        .pq1010 .pq-scene.still .pq-inbob{animation:none;}

        /* Ishga tushirilganda tushuvchi koptok */
        .pq1010 .pq-drop{position:absolute;left:167px;top:2px;z-index:4;line-height:0;animation:pqRunDrop .8s cubic-bezier(.4,.55,.5,1) both;}

        /* Chiqish koptok */
        .pq1010 .pq-outwrap{position:absolute;left:167px;top:204px;z-index:4;animation:pqOutCome .5s cubic-bezier(.3,1.4,.5,1) .74s both;}
        .pq1010 .pq-scene.still .pq-outwrap{animation:none;}
        .pq1010 .pq-outwrap .pq-ball.q{background:radial-gradient(circle at 38% 32%,#fff,#e3e9f2 72%,#cdd6e2);color:#5a6b8c;animation:pqBreath 2s ease-in-out infinite;}
        .pq1010 .pq-outwrap.win .pq-ball{box-shadow:inset 0 2px 3px rgba(255,255,255,.5),inset 0 -3px 5px rgba(0,0,0,.22),0 0 16px 4px rgba(255,180,60,.85);animation:pqWin .6s cubic-bezier(.3,1.5,.5,1) both;}

        /* Demo qatlami (mount'da bir marta) */
        .pq1010 .pq-demoball{position:absolute;left:171px;top:6px;z-index:5;line-height:0;animation:pqDemoIn 3.1s ease-in-out both;}
        .pq1010 .pq-demoball .pq-ball{width:30px;height:30px;font-size:16px;}
        .pq1010 .pq-demoout{position:absolute;left:171px;top:206px;z-index:5;line-height:0;animation:pqDemoOut 3.1s ease-in-out both;}
        .pq1010 .pq-demoout .pq-ball{width:30px;height:30px;font-size:16px;}
        .pq1010 .pq-demonote{position:absolute;left:50%;top:118px;transform:translateX(-50%);z-index:6;padding:4px 12px 5px;border-radius:11px;background:#fff;border:2px solid #c3cdda;color:#2f7fd6;font-size:15px;font-weight:900;white-space:nowrap;box-shadow:0 4px 10px rgba(60,72,92,.2);animation:pqDemoNote 3.1s ease-in-out both;}
        .pq1010 .pq-demonote small{display:block;font-size:8px;letter-spacing:.06em;color:#8a94a2;text-transform:uppercase;text-align:center;margin-bottom:1px;}

        /* Robot-operator */
        .pq1010 .pq-robotw{position:absolute;left:8px;bottom:14px;line-height:0;z-index:3;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq1010 .pq-robotw.win{animation:pqCele .55s ease;}
        .pq1010 .pq-ant{transform-box:fill-box;transform-origin:center;animation:pqPulse 1.2s ease-in-out infinite;}
        .pq1010 .pq-blink{opacity:0;animation:pqBlink 3.6s linear infinite;}

        /* G'alaba uchqunlari */
        .pq1010 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1010 .pq-wstar.w2{animation-delay:-.5s;} .pq1010 .pq-wstar.w3{animation-delay:-1.05s;}

        /* G'alaba chip */
        .pq1010 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:7;white-space:nowrap;}

        /* Ishga tushir tugma */
        .pq1010 .pq-run{display:inline-flex;align-items:center;gap:8px;padding:12px 26px;border-radius:15px;border:none;background:linear-gradient(#2f7fd6,#1f62b0);color:#fff;font-size:18px;font-weight:900;font-family:inherit;cursor:pointer;box-shadow:0 4px 0 #184e8c,0 6px 12px rgba(31,98,176,.35);transition:.12s;}
        .pq1010 .pq-run:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 #184e8c,0 9px 16px rgba(31,98,176,.4);}
        .pq1010 .pq-run:active:not(:disabled){transform:translateY(2px);box-shadow:0 2px 0 #184e8c,0 3px 7px rgba(31,98,176,.35);}
        .pq1010 .pq-run:disabled{background:linear-gradient(#aeb9c9,#98a4b6);box-shadow:0 4px 0 #7c889a;cursor:default;}

        /* Variantlar */
        .pq1010 .pq-opts{display:flex;gap:12px;justify-content:center;transition:opacity .25s;}
        .pq1010 .pq-opts.dim{opacity:.45;}
        .pq1010 .pq-opt{width:70px;height:70px;font-size:29px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1010 .pq-opt:hover:not(:disabled){border-color:#9db0cc;transform:translateY(-2px);}
        .pq1010 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1010 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1010 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1010 .pq-opt:disabled{cursor:default;}

        .pq1010 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1010 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1010 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqBlinkL{0%,100%{opacity:1;}50%{opacity:.28;}}
        @keyframes pqSteam{0%,62%,100%{opacity:0;transform:translateY(0) scale(.6);}70%{opacity:.85;transform:translateY(-10px) scale(1);}88%{opacity:0;transform:translateY(-22px) scale(1.4);}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:.65;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqReady{0%{opacity:0;transform:translateY(-10px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqRunDrop{0%{opacity:1;transform:translateY(0) scale(1);}55%{opacity:1;transform:translateY(30px) scale(.82);}100%{opacity:0;transform:translateY(46px) scale(.55);}}
        @keyframes pqOutCome{0%{opacity:0;transform:translateY(-16px) scale(.4);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqWin{0%{transform:scale(.6);}55%{transform:scale(1.28);}100%{transform:scale(1);}}
        @keyframes pqDemoIn{0%{opacity:0;transform:translateY(-22px) scale(.5);}7%{opacity:1;transform:translateY(-22px) scale(1);}26%{opacity:1;transform:translateY(8px) scale(.9);}36%{opacity:0;transform:translateY(18px) scale(.6);}100%{opacity:0;}}
        @keyframes pqDemoOut{0%,42%{opacity:0;transform:translateY(-10px) scale(.35);}52%{opacity:1;transform:translateY(0) scale(1.1);}60%{transform:translateY(0) scale(1);}82%{opacity:1;}94%,100%{opacity:0;transform:translateY(8px) scale(.85);}}
        @keyframes pqDemoNote{0%,48%{opacity:0;transform:translateX(-50%) translateY(5px) scale(.85);}58%{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}82%{opacity:1;}95%,100%{opacity:0;transform:translateX(-50%) translateY(0) scale(.9);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          {/* fon */}
          <span className="pq-gear bg1"><Gear size={38} /></span>
          <span className="pq-gear bg2"><Gear size={24} c="#98a4b6" line="#5f6b80" /></span>
          <span className="pq-gear bg3"><Gear size={30} c="#98a4b6" line="#5f6b80" /></span>
          <span className="pq-pipe" />
          <span className="pq-valve" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-led l1" /><span className="pq-led l2" /><span className="pq-led l3" />
          <span className="pq-floor" />

          {/* voronka + mashina + nov */}
          <span className="pq-funnel" />
          <div className={'pq-machine' + (ok ? ' win' : '')}>
            <span className="rivet r1" /><span className="rivet r2" /><span className="rivet r3" /><span className="rivet r4" />
            <div className="pq-win">
              <span className="pq-wgear a"><Gear size={34} c="#7f8ca0" line="#4a5568" core="#c9d2df" /></span>
              <span className="pq-wgear b"><Gear size={26} c="#7f8ca0" line="#4a5568" core="#c9d2df" /></span>
            </div>
            <div className="pq-rule"><small>Qoida</small><b>+</b><b>{ADD}</b></div>
            <span className="pq-mlamp" /><span className="pq-mlamp m2" /><span className="pq-mlamp m3" />
          </div>
          <span className="pq-chute" />

          {/* robot-operator */}
          <span className={'pq-robotw' + (ok ? ' win' : '')}><Robot /></span>

          {/* Bosqich 1 — avto-demo (2 → 5) */}
          {showDemo && (
            <>
              <span className="pq-demoball"><span className="pq-ball teal"><span style={{ position: 'relative', zIndex: 1 }}>{DEMO.in}</span></span></span>
              <span className="pq-demoout"><span className="pq-ball blue"><span style={{ position: 'relative', zIndex: 1 }}>{DEMO.out}</span></span></span>
              <span className="pq-demonote"><small>{t.demoNote}</small>{DEMO.in} → {DEMO.out}</span>
            </>
          )}

          {/* Bosqich 2 — kirish «4» tayyor (ishga tushmaguncha) */}
          {!ran && (
            <span className="pq-inwrap"><span className="pq-inbob"><span className="pq-ball amber"><span style={{ position: 'relative', zIndex: 1 }}>{DATA.input}</span></span></span></span>
          )}
          {/* ishga tushirilganda «4» mashinaga tushadi */}
          {ran && !still && (
            <span className="pq-drop"><span className="pq-ball amber"><span style={{ position: 'relative', zIndex: 1 }}>{DATA.input}</span></span></span>
          )}
          {/* chiqish koptok: «?» yoki g'alabada «7» */}
          {ran && (
            <span className={'pq-outwrap' + (ok ? ' win' : '')}>
              <span className={'pq-ball ' + (ok ? 'blue' : 'q')}><span style={{ position: 'relative', zIndex: 1 }}>{ok ? DATA.target : '?'}</span></span>
            </span>
          )}

          {ok && (
            <>
              <span className="pq-chip">{DATA.input} + {ADD} = {DATA.target}</span>
              <span className="pq-wstar" style={{ left: '30%', top: '58px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-wstar w2" style={{ left: '60%', top: '64px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w3" style={{ left: '82%', top: '52px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>

        <button type="button" className="pq-run" disabled={ran || lock} onClick={() => { setRan(true); setFeedback(null); }}>
          <IconPlay />{t.btnRun}
        </button>

        <div className={'pq-opts' + (ran ? '' : ' dim')}>
          {DATA.options.map((n) => {
            const sel = picked === n; const right = ok && n === DATA.target;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={!ran || lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
