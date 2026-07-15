// Dars10 · Amaliyot 04 — P8 «Yozuvni tanla» konveyer · 🟡 · tag: pick_expression_conv
// Fabrika-konveyer: chapdan 6 quti keladi, robot 2 quti qo'shadi; rasmga mos yozuvni tanla («6 + 2»).
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

const A = 6, B = 2, SUM = A + B; // 8
const CORRECT = '6 + 2';
const OPTIONS = ['6 + 2', '6 − 2', '2 + 6']; // − = U+2212; «2 + 6» — tartib aldamchi
const DATA = { a: A, b: B, ptype: 'P8', level: '🟡', tag: 'pick_expression_conv' };
const T = {
  uz: {
    eyebrow: 'Fabrika · Konveyer', title: 'Yozuvni tanla',
    setup: 'Konveyerda oltita quti kelayotgan edi. Robot ularga yana ikkita quti qo\'shdi.',
    ask: 'Rasmga qaysi yozuv mos keladi?',
    correct: 'Barakalla! Olti qo\'shuv ikki — shu rasmning yozuvi.',
    hint: 'Konveyerda nechta quti bor edi? Robot nechta qo\'shdi? Yozuvdagi birinchi son shu bo\'lsin.',
  },
  ru: {
    eyebrow: 'Фабрика · Конвейер', title: 'Выбери запись',
    setup: 'По конвейеру ехали шесть коробок. Робот добавил к ним ещё две коробки.',
    ask: 'Какая запись подходит к рисунку?',
    correct: 'Молодец! Шесть плюс два — это и есть запись рисунка.',
    hint: 'Сколько коробок было на конвейере? Сколько добавил робот? Пусть первое число в записи будет таким.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QUTI KANONI: karton quti — jigarrang-sariq 2-ton (#d9a05b/#c08840, kontur #96602c),
// old yuzda tasma/belgi; bitta quti = bitta dona (sanash uchun).
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
// Chap qo'li quti tomon cho'zilgan — «qo'shayotgani».
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
    <path d="M13 46 Q1 46 1 57" fill="none" stroke="#8794a8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="1.5" cy="57.5" r="4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.5" />
    <path d="M51 46 Q60 47 59 55" fill="none" stroke="#8794a8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="59" cy="55.5" r="4" fill="#aeb9c9" stroke="#4a5568" strokeWidth="1.5" />
    <rect x="20" y="65" width="9" height="10" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.5" />
    <rect x="35" y="65" width="9" height="10" rx="3" fill="#67728a" stroke="#4a5568" strokeWidth="1.5" />
  </svg>
);

// Tishli-g'ildirak (fon dekori, sekin aylanadi).
const Gear = ({ size, teeth = 8, color = '#b8c1cf' }) => (
  <svg viewBox="0 0 44 44" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: teeth }).map((_, i) => (
      <rect key={i} x="19.5" y="1.5" width="5" height="8" rx="1.2" fill={color} transform={`rotate(${(i * 360) / teeth} 22 22)`} />
    ))}
    <circle cx="22" cy="22" r="14" fill={color} stroke="#a3adbd" strokeWidth="2" />
    <circle cx="22" cy="22" r="5.5" fill="#e6eaf1" stroke="#a3adbd" strokeWidth="1.6" />
  </svg>
);

// Konveyer roligi (aylanadi).
const Roller = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill="#6b7686" stroke="#3f4756" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="#aeb9c9" />
    <line x1="12" y1="3" x2="12" y2="21" stroke="#3f4756" strokeWidth="1.6" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#3f4756" strokeWidth="1.6" />
  </svg>
);

// Quti joylari (sahna px, wrapper top-left). n — sanoq tartibi (g'alabada badge).
const LEFT = [
  { left: 40, top: 124, n: 1 }, { left: 73, top: 124, n: 2 }, { left: 106, top: 124, n: 3 },
  { left: 40, top: 96, n: 4 }, { left: 73, top: 96, n: 5 }, { left: 106, top: 96, n: 6 },
];
const RIGHT = [
  { left: 190, top: 124, n: 7 },
  { left: 190, top: 96, n: 8 },
];
const ROLLERS = [16, 62, 108, 154, 200, 246, 292, 330];

export default function D10_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-harakati (quti sirg'alishi / tushishi) qayta ijro etilmaydi.
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
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS, studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1004">
      <style>{`
        .pq1004{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1004 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5b6b82;text-transform:uppercase;}
        .pq1004 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1004 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1004 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1004 .pq-stage{display:flex;flex-direction:column;align-items:center;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eef1f6,#e2e7ef);border:2px solid #d2d9e4;}
        .pq1004 .pq-fit{position:relative;margin:0 auto;}
        .pq1004 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:210px;border-radius:18px;background:linear-gradient(#dbe2ec 0%,#ccd5e2 62%,#c0cad9 100%);border:2px solid #c0cad9;overflow:hidden;}
        .pq1004 .pq-win{position:absolute;top:14px;border-radius:5px;background:linear-gradient(#eaf4fb,#c7e2f2);border:2.5px solid #9bb3c9;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35);}
        .pq1004 .pq-win::before,.pq1004 .pq-win::after{content:'';position:absolute;background:#9bb3c9;}
        .pq1004 .pq-win::before{left:50%;top:0;bottom:0;width:2px;margin-left:-1px;}
        .pq1004 .pq-win::after{top:50%;left:0;right:0;height:2px;margin-top:-1px;}
        .pq1004 .pq-win.w1{left:26px;width:52px;height:34px;}
        .pq1004 .pq-win.w2{left:96px;width:52px;height:34px;}
        .pq1004 .pq-pipe{position:absolute;top:0;right:22px;width:14px;height:66px;background:linear-gradient(90deg,#9aa6b6,#c3ccd8 45%,#8794a8);border:1.5px solid #6b7686;border-top:none;border-radius:0 0 4px 4px;z-index:1;}
        .pq1004 .pq-pipe::after{content:'';position:absolute;left:-4px;bottom:8px;width:22px;height:9px;border-radius:3px;background:#8794a8;border:1.5px solid #6b7686;}
        .pq1004 .pq-steam{position:absolute;top:-6px;right:26px;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.85);filter:blur(1px);opacity:0;z-index:1;animation:pqSteam 6.5s ease-in-out infinite;}
        .pq1004 .pq-steam.s2{animation-delay:-3.2s;right:24px;}
        .pq1004 .pq-gear{position:absolute;line-height:0;z-index:0;opacity:.5;animation:pqSpin linear infinite;}
        .pq1004 .pq-gear.g1{left:288px;top:22px;animation-duration:11s;}
        .pq1004 .pq-gear.g2{left:322px;top:52px;animation-duration:8s;animation-direction:reverse;opacity:.42;}
        .pq1004 .pq-gear.g3{left:8px;top:20px;animation-duration:13s;opacity:.4;}
        .pq1004 .pq-lamp{position:absolute;top:6px;width:8px;height:8px;border-radius:50%;z-index:2;animation:pqLamp 2.4s ease-in-out infinite;}
        .pq1004 .pq-lamp.p1{left:170px;background:#ffd76a;box-shadow:0 0 6px 1px rgba(255,215,106,.7);}
        .pq1004 .pq-lamp.p2{left:196px;background:#8be08a;box-shadow:0 0 6px 1px rgba(139,224,138,.7);animation-delay:-.8s;}
        .pq1004 .pq-lamp.p3{left:222px;background:#ff9a7a;box-shadow:0 0 6px 1px rgba(255,154,122,.7);animation-delay:-1.6s;}
        .pq1004 .pq-belt{position:absolute;left:6px;right:6px;top:150px;height:46px;border-radius:9px;background:#3f4756;border:2px solid #2c333f;box-shadow:inset 0 3px 5px rgba(0,0,0,.28);overflow:hidden;z-index:1;}
        .pq1004 .pq-belt-surf{position:absolute;left:0;right:0;top:3px;height:14px;background:repeating-linear-gradient(90deg,#5a6373 0 16px,#4a5361 16px 32px);animation:pqTread 1.1s linear infinite;}
        .pq1004 .pq-scene.still .pq-belt-surf{animation:none;}
        .pq1004 .pq-roller{position:absolute;bottom:5px;line-height:0;animation:pqSpin 1.5s linear infinite;}
        .pq1004 .pq-scene.still .pq-roller{animation:none;}
        .pq1004 .pq-box{position:absolute;line-height:0;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqSlideIn .7s cubic-bezier(.3,.9,.4,1) both;}
        .pq1004 .pq-box.drop{animation:pqDrop .55s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1004 .pq-scene.still .pq-box{animation:none;}
        .pq1004 .pq-bob{display:block;animation:pqBob 2.6s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1004 .pq-box.win .pq-bob{animation:pqBob 2.6s ease-in-out infinite,pqCele .55s ease;}
        .pq1004 .pq-cnt{position:absolute;top:-9px;right:-6px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1004 .pq-robot{position:absolute;left:226px;top:82px;line-height:0;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2));}
        .pq1004 .pq-ant{transform-box:fill-box;transform-origin:50% 50%;animation:pqAnt 1.4s ease-in-out infinite;}
        .pq1004 .pq-rblink{opacity:0;animation:pqBlink 3.6s linear infinite;}
        .pq1004 .pq-led{animation:pqLed 1.8s ease-in-out infinite;}
        .pq1004 .pq-led.l2{animation-delay:-.6s;} .pq1004 .pq-led.l3{animation-delay:-1.2s;}
        .pq1004 .pq-plus{position:absolute;left:146px;top:98px;font-size:42px;font-weight:900;color:#5b6b82;z-index:3;text-shadow:0 1px 0 rgba(255,255,255,.6);animation:pqPlus 2.8s ease-in-out infinite;}
        .pq1004 .pq-q{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #c3cdda;color:#5b6b82;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(91,107,130,.22);animation:pqBreath 2.2s ease-in-out infinite;z-index:5;}
        .pq1004 .pq-chip{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq1004 .pq-cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq1004 .pq-card{display:flex;align-items:center;gap:5px;min-width:92px;height:62px;padding:0 14px;font-size:26px;font-weight:900;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1004 .pq-card:hover:not(:disabled){border-color:#aeb9c9;transform:translateY(-2px);}
        .pq1004 .pq-card:active:not(:disabled){transform:scale(.95);}
        .pq1004 .pq-card.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1004 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1004 .pq-card:disabled{cursor:default;}
        .pq1004 .pq-cop.plus{color:#1a7f43;} .pq1004 .pq-cop.minus{color:#c0392b;}
        .pq1004 .pq-card.right .pq-cop{color:#1a7f43;}
        .pq1004 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1004 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1004 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqTread{from{background-position-x:0;}to{background-position-x:32px;}}
        @keyframes pqSlideIn{0%{opacity:0;transform:translateX(-64px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-42px) scale(.8);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqAnt{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.35);opacity:.7;}}
        @keyframes pqBlink{0%,92%{opacity:0;}94%,97%{opacity:1;}99%,100%{opacity:0;}}
        @keyframes pqLed{0%,100%{opacity:.4;}50%{opacity:1;}}
        @keyframes pqLamp{0%,100%{opacity:.45;transform:scale(.9);}50%{opacity:1;transform:scale(1.1);}}
        @keyframes pqSteam{0%,60%,100%{opacity:0;transform:translateY(0) scale(.6);}72%{opacity:.85;transform:translateY(-14px) scale(1);}88%{opacity:0;transform:translateY(-26px) scale(1.4);}}
        @keyframes pqPlus{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* Ambient: suzuvchi mayda uchqunlar (fon dekori) */
        .pq1004 .pq-mote{position:absolute;z-index:0;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,rgba(124,240,255,.5) 55%,rgba(124,240,255,0) 74%);pointer-events:none;opacity:0;animation:pq1004Mote 9.5s ease-in-out infinite;}
        .pq1004 .pq-mote.m2{width:4px;height:4px;animation-duration:12s;animation-delay:-4s;}
        .pq1004 .pq-mote.m3{width:6px;height:6px;animation-duration:13.5s;animation-delay:-8s;}
        @keyframes pq1004Mote{0%{opacity:0;transform:translate(0,8px) scale(.7);}22%{opacity:.5;}50%{opacity:.55;transform:translate(-4px,-9px) scale(1);}80%{opacity:.3;}100%{opacity:0;transform:translate(0,-20px) scale(.7);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 210 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {/* Ambient uchqunlar (fon, dekor) */}
          <span className="pq-mote m1" aria-hidden="true" style={{ left: 162, top: 40 }} />
          <span className="pq-mote m2" aria-hidden="true" style={{ left: 210, top: 66 }} />
          <span className="pq-mote m3" aria-hidden="true" style={{ left: 250, top: 34 }} />
          <span className="pq-gear g3"><Gear size={40} teeth={9} /></span>
          <span className="pq-win w1" /><span className="pq-win w2" />
          <span className="pq-gear g1"><Gear size={46} teeth={9} /></span>
          <span className="pq-gear g2"><Gear size={30} teeth={8} color="#aab4c2" /></span>
          <span className="pq-pipe" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-lamp p1" /><span className="pq-lamp p2" /><span className="pq-lamp p3" />

          {/* Konveyer tasma + aylanuvchi roliklar */}
          <div className="pq-belt">
            <span className="pq-belt-surf" />
            {ROLLERS.map((x, i) => (<span key={i} className="pq-roller" style={{ left: x, animationDelay: `${-i * 0.18}s` }}><Roller /></span>))}
          </div>

          {/* 6 quti — chapdan konveyerda sirg'alib keladi */}
          {LEFT.map((p) => (
            <span key={'L' + p.n} className="pq-box" style={{ left: p.left, top: p.top, animationDelay: `${(p.n - 1) * 0.12}s` }}>
              <span className="pq-bob" style={{ '--bd': `${-p.n * 0.35}s` }}>
                <Box />
                {ok && <b className="pq-cnt">{p.n}</b>}
              </span>
            </span>
          ))}

          <span className="pq-plus">+</span>

          {/* Robot qo'shgan 2 quti — tepadan tushadi */}
          {RIGHT.map((p, i) => (
            <span key={'R' + p.n} className={'pq-box drop' + (ok ? ' win' : '')} style={{ left: p.left, top: p.top, animationDelay: `${0.85 + i * 0.18}s` }}>
              <span className="pq-bob" style={{ '--bd': `${-p.n * 0.35}s` }}>
                <Box />
                {ok && <b className="pq-cnt">{p.n}</b>}
              </span>
            </span>
          ))}

          <span className="pq-robot"><Robot /></span>

          {!ok && <span className="pq-q">?</span>}
          {ok && <span className="pq-chip">{A} + {B} = {SUM}</span>}
        </div>
        </div>
      </div>

      <div className="pq-cards">
        {OPTIONS.map((ex) => {
          const [x, op, y] = ex.split(' ');
          const sel = picked === ex; const right = ok && ex === CORRECT;
          return (
            <button key={ex} type="button" className={'pq-card' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(ex); setFeedback(null); }}>
              <span className="pq-cx">{x}</span>
              <span className={'pq-cop ' + (op === '+' ? 'plus' : 'minus')}>{op}</span>
              <span className="pq-cx">{y}</span>
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
