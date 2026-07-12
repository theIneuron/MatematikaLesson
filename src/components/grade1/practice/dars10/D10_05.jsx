// Dars10 · Amaliyot 05 — P10 TESKARI/DETEKTIV «Lift nima qildi?» · 🔴 · tag: reverse_lift
// Yuk lifti (vertikal son o'qi, 0-10): 2-qavatda kabina XIRA-IZI, 8-qavatda kabina O'ZI, oradagi
// yo'l «?» punktir (yo'nalishsiz). Bola harakat yo'nalishi+kattaligini deteksiya qiladi (3 matn-karta).
// G'alabada: 2→8 yashil yuqoriga-strelka + 6 qavat 1..6 badge sanaladi, chip «2 + 6 = 8».
// Fabrika fon: aylanuvchi tishli-g'ildiraklar, katta oynalar, quvur+bug', miltillovchi chiroqlar,
// robotcha (ko'z pirpiraydi, antenna pulslaydi). Lift YURISHI ko'rsatilmaydi (javobni oshkor qilmaslik).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const FROM = 2, TO = 8, STEPS = TO - FROM; // 6
const DATA = { from: FROM, to: TO, diff: STEPS, ptype: 'P10', level: '🔴', tag: 'reverse_lift' };
const CORRECT_ID = 'up6';
const FLOORS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const fy = (f) => 286 - f * 25; // svg-px: f0=286 (past) ... f10=36 (tepa)

const T = {
  uz: {
    eyebrow: 'Fabrika · Detektiv', title: 'Lift nima qildi?',
    setup: 'Yuk lifti ikkinchi qavatda turgan edi. Hozir esa sakkizinchi qavatda!',
    ask: 'Lift nima qildi?',
    correct: 'Barakalla! Ikkidan sakkizga — olti qavat yuqoriga ko\'tarilgan.',
    hint: 'Ikkidan sakkizgacha qavatlarni sanang: nechta qavat? Qaysi tomonga — yuqorigami, pastgami?',
    opts: [
      { id: 'up6', label: 'Olti qavat YUQORIGA ko\'tarilgan' },
      { id: 'down6', label: 'Olti qavat PASTGA tushgan' },
      { id: 'up5', label: 'Besh qavat YUQORIGA ko\'tarilgan' },
    ],
  },
  ru: {
    eyebrow: 'Фабрика · Детектив', title: 'Что сделал лифт?',
    setup: 'Грузовой лифт стоял на втором этаже. А теперь он на восьмом!',
    ask: 'Что сделал лифт?',
    correct: 'Молодец! От двух до восьми — поднялся на шесть этажей вверх.',
    hint: 'Посчитай этажи от двух до восьми: сколько этажей? В какую сторону — вверх или вниз?',
    opts: [
      { id: 'up6', label: 'Поднялся на шесть этажей ВВЕРХ' },
      { id: 'down6', label: 'Спустился на шесть этажей ВНИЗ' },
      { id: 'up5', label: 'Поднялся на пять этажей ВВЕРХ' },
    ],
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Kichik yo'nalish-strelkasi (karta ichida — kartaning O'Z da'vosi, javob emas).
const Arrow = ({ up }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ display: 'block' }}>
    <path d={up ? 'M8 2 L13 8 L9.6 8 L9.6 14 L6.4 14 L6.4 8 L3 8 Z' : 'M8 14 L3 8 L6.4 8 L6.4 2 L9.6 2 L9.6 8 L13 8 Z'}
      fill="currentColor" />
  </svg>
);

// TISHLI-G'ILDIRAK (gear): metall-kulrang cog, markazda hub; wrapper sekin aylanadi.
const Gear = ({ size = 50, teeth = 10, col = '#8794a8', line = '#4a5568', hub = '#aeb9c9' }) => {
  const c = size / 2, R = c - 2;
  const teethEls = [];
  for (let i = 0; i < teeth; i++) {
    const a = (360 / teeth) * i;
    teethEls.push(<rect key={i} x={c - 3.2} y={0.5} width={6.4} height={7.5} rx={1.6} fill={col} stroke={line} strokeWidth={0.8} transform={`rotate(${a} ${c} ${c})`} />);
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      {teethEls}
      <circle cx={c} cy={c} r={R - 5} fill={col} stroke={line} strokeWidth={1.4} />
      <circle cx={c} cy={c} r={R - 12} fill={hub} stroke={line} strokeWidth={1} />
      <circle cx={c} cy={c} r={3} fill={line} />
    </svg>
  );
};

// LIFT KABINASI: to'rtburchak-yumaloq metall quti, eshik-tirqishi, kichik oyna, tutqichlar.
const Cabin = () => (
  <svg viewBox="0 0 60 24" width="60" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2" y="2" width="56" height="20" rx="3.5" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.6" />
    <rect x="4" y="3.5" width="52" height="6" rx="2" fill="#c8d1dc" opacity=".85" />
    <rect x="4" y="13" width="52" height="7.5" rx="1.5" fill="#8794a8" />
    <line x1="30" y1="3.4" x2="30" y2="20.6" stroke="#4a5568" strokeWidth="1.4" />
    <rect x="7" y="5.5" width="12" height="7" rx="1.5" fill="#dfe7f0" stroke="#5a6474" strokeWidth="1" />
    <circle cx="24" cy="16.5" r="1.3" fill="#5a6474" /><circle cx="36" cy="16.5" r="1.3" fill="#5a6474" />
  </svg>
);

// XIRA-IZ (u yerda edi): kabinaning punktir konturi, fill yo'q, sekin pulslaydi.
const GhostCabin = () => (
  <svg viewBox="0 0 60 24" width="60" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2" y="2" width="56" height="20" rx="3.5" fill="none" stroke="#8b97a8" strokeWidth="1.6" strokeDasharray="4 3" />
    <line x1="30" y1="4" x2="30" y2="20" stroke="#8b97a8" strokeWidth="1.2" strokeDasharray="3 3" opacity=".7" />
  </svg>
);

// ROBOTCHA (nomsiz): metall tana + ekran-yuz (2 ko'z pirpiraydi + LED-tabassum), antenna pulslaydi.
const Robot = () => (
  <svg viewBox="0 0 48 58" width="48" height="58" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="24" y1="10" x2="24" y2="3" stroke="#6b7686" strokeWidth="2" strokeLinecap="round" />
    <circle className="pq-ant" cx="24" cy="3" r="3" fill="#ffd15c" stroke="#d99b1f" strokeWidth="1" />
    <rect x="9" y="42" width="8" height="12" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.4" />
    <rect x="31" y="42" width="8" height="12" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.4" />
    <rect x="10" y="30" width="28" height="18" rx="6" fill="#8794a8" stroke="#4a5568" strokeWidth="1.6" />
    <rect x="14" y="33" width="20" height="6" rx="2.5" fill="#aeb9c9" opacity=".8" />
    <rect x="1" y="31" width="8" height="6" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.2" />
    <rect x="39" y="24" width="8" height="6" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.2" transform="rotate(-24 43 27)" />
    <rect x="8" y="10" width="32" height="21" rx="7" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.6" />
    <rect x="12" y="13.5" width="24" height="14" rx="4" fill="#2a3550" />
    <circle cx="19" cy="20" r="2.6" fill="#7fe3ff" />
    <circle cx="29" cy="20" r="2.6" fill="#7fe3ff" />
    <g className="pq-blink"><rect x="16" y="17.4" width="6" height="5.2" rx="2" fill="#2a3550" /><rect x="26" y="17.4" width="6" height="5.2" rx="2" fill="#2a3550" /></g>
    <path d="M18 24.2 Q24 27.4 30 24.2" stroke="#7fe3ff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

export default function D10_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda mount-animatsiyalari qayta ijro etilmaydi — statik yakuniy holat.
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
    const correct = picked === CORRECT_ID;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    const pl = t.opts.find((o) => o.id === picked); const cl = t.opts.find((o) => o.id === CORRECT_ID);
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: t.opts.map((o) => o.label), studentAnswer: { value: picked, label: pl ? pl.label : '' }, correctAnswer: { value: CORRECT_ID, label: cl.label }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1005">
      <style>{`
        .pq1005{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1005 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a6bd6;text-transform:uppercase;}
        .pq1005 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1005 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1005 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1005 .pq-scene{position:relative;width:340px;max-width:100%;height:306px;margin:0 auto;border-radius:20px;background:linear-gradient(#39435c 0%,#455072 44%,#3c4763 100%);border:2px solid #2c3547;overflow:hidden;}
        .pq1005 .pq-wall{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 40px,rgba(255,255,255,.03) 40px 41px);z-index:0;}
        .pq1005 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(#2c3446,#232a39);border-top:2px solid #1c2230;z-index:1;}
        .pq1005 .pq-win{position:absolute;border-radius:4px;background:linear-gradient(135deg,#cfe3f0,#9cc0d8 60%,#7ea6c2);border:3px solid #33465a;box-shadow:0 0 14px 2px rgba(180,220,245,.28);z-index:1;overflow:hidden;}
        .pq1005 .pq-win::before,.pq1005 .pq-win::after{content:'';position:absolute;background:rgba(51,70,90,.6);}
        .pq1005 .pq-win::before{left:50%;top:0;bottom:0;width:2px;margin-left:-1px;}
        .pq1005 .pq-win::after{top:50%;left:0;right:0;height:2px;margin-top:-1px;}
        .pq1005 .pq-win.a{left:214px;top:32px;width:50px;height:56px;}
        .pq1005 .pq-win.b{left:276px;top:28px;width:54px;height:50px;animation-delay:-1.4s;}
        .pq1005 .pq-winglow{position:absolute;inset:0;background:radial-gradient(circle at 40% 34%,rgba(255,255,255,.55),transparent 62%);animation:pqGlow 4.2s ease-in-out infinite;}
        .pq1005 .pq-win.b .pq-winglow{animation-delay:-2s;}
        .pq1005 .pq-gearw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3));}
        .pq1005 .pq-gearw.g1{left:222px;top:104px;animation:pqSpin 9s linear infinite;}
        .pq1005 .pq-gearw.g2{left:266px;top:140px;animation:pqSpinR 7s linear infinite;}
        .pq1005 .pq-pipe{position:absolute;right:6px;top:96px;width:13px;height:190px;border-radius:6px;background:linear-gradient(90deg,#6f7c90,#9aa6b8 45%,#5f6b7e);border:1.5px solid #454f60;z-index:2;}
        .pq1005 .pq-pipe::before{content:'';position:absolute;left:-3px;top:70px;width:19px;height:12px;border-radius:4px;background:linear-gradient(90deg,#5f6b7e,#8593a6);border:1.5px solid #454f60;}
        .pq1005 .pq-valve{position:absolute;right:2px;top:176px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#ffd98a,#e0952a);border:1.5px solid #b06f1c;z-index:3;}
        .pq1005 .pq-steam{position:absolute;right:5px;top:150px;width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.72);z-index:2;opacity:0;animation:pqSteam 4.6s ease-in-out infinite;}
        .pq1005 .pq-steam.s2{top:150px;right:11px;animation-delay:-2.3s;width:7px;height:7px;}
        .pq1005 .pq-lamp{position:absolute;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#fff3c0,#f9c62f);box-shadow:0 0 10px 3px rgba(249,198,47,.5);z-index:2;animation:pqLight 2.4s ease-in-out infinite;}
        .pq1005 .pq-lamp.a{left:200px;top:22px;} .pq1005 .pq-lamp.b{left:308px;top:16px;animation-delay:-1.1s;}
        .pq1005 .pq-track{position:absolute;left:0;top:0;z-index:2;}
        .pq1005 .pq-sign{position:absolute;left:88px;top:12px;width:74px;text-align:center;font-size:10.5px;font-weight:900;letter-spacing:.14em;color:#ffe08a;background:#2c3547;border:1.5px solid #ffd15c;border-radius:6px;padding:2px 0;z-index:3;}
        .pq1005 .pq-cabin{position:absolute;left:98px;line-height:0;z-index:4;filter:drop-shadow(0 3px 4px rgba(0,0,0,.4));animation:pqBob 3s ease-in-out infinite;}
        .pq1005 .pq-cabin.in{animation:pqBob 3s ease-in-out infinite,pqDrop .6s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1005 .pq-cabin.win{animation:pqBob 3s ease-in-out infinite,pqCele .6s ease;}
        .pq1005 .pq-ghost{position:absolute;left:98px;line-height:0;z-index:3;animation:pqGhost 2.8s ease-in-out infinite;}
        .pq1005 .pq-ghost.in{animation:pqGhost 2.8s ease-in-out infinite,pqFade .6s ease both;}
        .pq1005 .pq-qmark{position:absolute;left:113px;width:30px;height:30px;border-radius:50%;background:#fff;border:2.5px solid #b9c0d4;color:#5a6bd6;font-size:19px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(40,50,90,.3);z-index:4;animation:pqBreath 2.2s ease-in-out infinite;}
        .pq1005 .pq-cnt{position:absolute;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;box-shadow:0 1px 3px rgba(0,0,0,.35);}
        .pq1005 .pq-robw{position:absolute;left:236px;top:214px;line-height:0;z-index:4;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35));}
        .pq1005 .pq-ant{transform-box:fill-box;transform-origin:50% 50%;animation:pqPulse 1.5s ease-in-out infinite;}
        .pq1005 .pq-blink{opacity:0;animation:pqBlink 3.6s linear infinite;}
        .pq1005 .pq-arrow{animation:pqArrowIn .55s ease .12s both;}
        .pq1005 .pq-scene.still .pq-arrow{animation:none;}
        .pq1005 .pq-scene.still .pq-cabin.in{animation:pqBob 3s ease-in-out infinite;}
        .pq1005 .pq-scene.still .pq-ghost.in{animation:pqGhost 2.8s ease-in-out infinite;}
        .pq1005 .pq-scene.still .pq-cnt{animation:none;}
        .pq1005 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.25);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq1005 .pq-opts{display:flex;flex-direction:column;gap:10px;margin-top:18px;}
        .pq1005 .pq-opt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px 16px;font-size:16.5px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.13s;}
        .pq1005 .pq-opt .pq-ar{display:flex;color:#9aa3b2;flex:none;}
        .pq1005 .pq-opt:hover:not(:disabled){border-color:#b8bff0;transform:translateY(-2px);box-shadow:0 4px 12px rgba(90,107,214,.14);}
        .pq1005 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq1005 .pq-opt.sel{border-color:#2563eb;background:#eef2fd;} .pq1005 .pq-opt.sel .pq-ar{color:#2563eb;}
        .pq1005 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;} .pq1005 .pq-opt.right .pq-ar{color:#1a7f43;}
        .pq1005 .pq-opt:disabled{cursor:default;}
        .pq1005 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1005 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1005 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqSpinR{from{transform:rotate(0);}to{transform:rotate(-360deg);}}
        @keyframes pqGlow{0%,100%{opacity:.4;}50%{opacity:.85;}}
        @keyframes pqLight{0%,100%{opacity:1;}45%{opacity:.45;}55%{opacity:.9;}}
        @keyframes pqSteam{0%,58%,100%{opacity:0;transform:translateY(0) scale(.6);}66%{opacity:.7;transform:translateY(-14px) scale(1);}80%{opacity:.35;transform:translateY(-26px) scale(1.3);}90%{opacity:0;transform:translateY(-34px) scale(1.5);}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.4);opacity:1;}}
        @keyframes pqBlink{0%,90%{opacity:0;}92%,96%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqGhost{0%,100%{opacity:.32;}50%{opacity:.6;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}
        @keyframes pqDrop{from{opacity:0;transform:translateY(-14px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqFade{from{opacity:0;}to{opacity:.4;}}
        @keyframes pqArrowIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* Ambient: suzuvchi mayda uchqunlar (qorong'u fon dekori) */
        .pq1005 .pq-mote{position:absolute;z-index:1;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,rgba(200,225,255,.6) 52%,rgba(200,225,255,0) 74%);pointer-events:none;opacity:0;animation:pq1005Mote 10s ease-in-out infinite;}
        .pq1005 .pq-mote.m2{width:4px;height:4px;animation-duration:12.5s;animation-delay:-4.5s;}
        .pq1005 .pq-mote.m3{width:6px;height:6px;animation-duration:14s;animation-delay:-8.5s;}
        @keyframes pq1005Mote{0%{opacity:0;transform:translate(0,9px) scale(.7);}22%{opacity:.7;}50%{opacity:.75;transform:translate(4px,-9px) scale(1);}80%{opacity:.4;}100%{opacity:0;transform:translate(0,-22px) scale(.7);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        {/* Ambient uchqunlar (fon, dekor) */}
        <span className="pq-mote m1" aria-hidden="true" style={{ left: 24, top: 150 }} />
        <span className="pq-mote m2" aria-hidden="true" style={{ left: 44, top: 208 }} />
        <span className="pq-mote m3" aria-hidden="true" style={{ left: 20, top: 250 }} />
        <span className="pq-wall" />
        <span className="pq-win a"><span className="pq-winglow" /></span>
        <span className="pq-win b"><span className="pq-winglow" /></span>
        <span className="pq-lamp a" /><span className="pq-lamp b" />
        <span className="pq-gearw g1"><Gear size={50} teeth={10} /></span>
        <span className="pq-gearw g2"><Gear size={38} teeth={9} col="#7c8aa0" hub="#9aa6ba" /></span>
        <span className="pq-pipe" />
        <span className="pq-valve" />
        <span className="pq-steam" /><span className="pq-steam s2" />
        <span className="pq-ground" />
        <div className="pq-sign">YUK LIFTI</div>

        <svg className="pq-track" viewBox="0 0 340 306" width="340" height="306" aria-hidden="true">
          <rect x="86" y="30" width="6" height="262" rx="3" fill="#b6c0cf" stroke="#8b97a8" strokeWidth="1" />
          <rect x="162" y="30" width="6" height="262" rx="3" fill="#b6c0cf" stroke="#8b97a8" strokeWidth="1" />
          <rect x="92" y="30" width="70" height="262" fill="#dfe6ef" opacity=".42" />
          {FLOORS.map((f) => (
            <g key={f}>
              <line x1="92" x2="162" y1={fy(f)} y2={fy(f)} stroke="#aab4c4" strokeWidth="1.3" opacity=".7" />
              <text x="80" y={fy(f) + 4.5} textAnchor="end" fontSize="13" fontWeight="800" fontFamily="Manrope, sans-serif"
                fill={f === TO ? '#aeb9ff' : f === FROM ? '#aeb9ff' : '#c7cfdb'}>{f}</text>
            </g>
          ))}
          <line x1="128" y1="30" x2="128" y2={fy(TO) - 11} stroke="#7b8494" strokeWidth="2" />
          {!ok && (
            <line x1="128" y1={fy(FROM)} x2="128" y2={fy(TO)} stroke="#9aa4b4" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
          )}
          {ok && (
            <g className="pq-arrow">
              <line x1="128" y1={fy(FROM)} x2="128" y2={fy(TO) + 3} stroke="#1a7f43" strokeWidth="4" strokeLinecap="round" />
              <path d={`M128 ${fy(TO) - 8} l-7 12 l7 -4 l7 4 z`} fill="#1a7f43" />
            </g>
          )}
        </svg>

        {/* 8-qavatda kabinaning O'ZI */}
        <span className={'pq-cabin' + (still ? '' : ' in') + (ok ? ' win' : '')} style={{ top: fy(TO) - 12 }}><Cabin /></span>
        {/* 2-qavatda kabinaning XIRA-IZI */}
        <span className={'pq-ghost' + (still ? '' : ' in')} style={{ top: fy(FROM) - 12 }}><GhostCabin /></span>

        {!ok && <span className="pq-qmark" style={{ top: fy((FROM + TO) / 2) - 15 }}>?</span>}

        {ok && Array.from({ length: STEPS }).map((_, i) => (
          <b key={i} className="pq-cnt" style={{ left: 142, top: fy(FROM + i + 1) - 9.5, animationDelay: `${i * 0.12}s` }}>{i + 1}</b>
        ))}

        {ok && <span className="pq-chip">{FROM} + {STEPS} = {TO}</span>}

        <span className="pq-robw"><Robot /></span>
      </div>

      <div className="pq-opts">
        {t.opts.map((o) => {
          const sel = picked === o.id; const right = ok && o.id === CORRECT_ID;
          const up = o.id !== 'down6';
          return (
            <button key={o.id} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(o.id); setFeedback(null); }}>
              <span className="pq-ar"><Arrow up={up} /></span>{o.label}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
