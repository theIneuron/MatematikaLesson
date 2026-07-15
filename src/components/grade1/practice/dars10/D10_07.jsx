// Dars10 · Amaliyot 07 — LOGIC «Ortiqchani top» · 🔴 · tag: logic_odd_one_out
// 4 robot-panel konveyerda, har birida misol: «7 + 3», «5 + 5», «6 + 4», «5 + 4».
// Uchtasining natijasi 10, bittasi (5 + 4 = 9) boshqacha — ortiqcha. Bola panelni BEVOSITA bosadi.
// Fabrika-sahna kanoni: fon tishli-g'ildiraklar aylanadi, konveyer-roliklar aylanadi, robot-usta
// ko'z pirpiratadi + antenna puls, chiroqlar miltillaydi, quvurdan bug', «?» breath-pulse.
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

const PANELS = [
  { expr: '7 + 3', sum: 10 },
  { expr: '5 + 5', sum: 10 },
  { expr: '6 + 4', sum: 10 },
  { expr: '5 + 4', sum: 9 }, // ortiqcha — boshqacha natija
];
const CORRECT = 3; // ortiqcha panel indeksi
const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_odd_one_out' };
const T = {
  uz: {
    eyebrow: 'Fabrika · Mantiq', title: 'Ortiqchani top',
    setup: 'Konveyerda to\'rtta panel: uchtasining natijasi bir xil, bittasi boshqacha.',
    ask: 'Qaysi panel ortiqcha? Uni bosing.',
    correct: 'Barakalla! Uchta panel o\'nni beradi, bittasi — boshqacha son. Ortiqchasini topdingiz!',
    hint: 'Har panelni hisoblang: uchtasi bir xil natija beradi. Boshqacha natijali qaysi biri?',
    board: 'Mantiq stansiyasi', other: 'boshqacha',
  },
  ru: {
    eyebrow: 'Фабрика · Логика', title: 'Найди лишний',
    setup: 'На конвейере четыре панели: у трёх результат одинаковый, у одной — другой.',
    ask: 'Какая панель лишняя? Нажми на неё.',
    correct: 'Молодец! Три панели дают десять, а одна — другое число. Ты нашёл лишнюю!',
    hint: 'Посчитай каждую панель: у трёх получается одинаковый результат. У какой результат другой?',
    board: 'Станция логики', other: 'другой',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TISHLI-G'ILDIRAK KANONI: 8 tish + tana + o'q. Metall kulrang-ko'k, fon dekori (sekin aylanadi).
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

// ROBOT-USTA KANONI: to'rtburchak-yumaloq metall tana (kulrang-ko'k 2-3 ton), old panelda ekran-yuz
// (ikki dumaloq ko'z + LED-tabassum, ko'zlar pirpiratadi), antenna (uchida pulslanuvchi doira),
// kalta qo'l-oyoq (bo'g'in-to'garaklar). Do'stona ifoda. Smenani tekshiradi.
const Robot = () => (
  <svg viewBox="0 0 72 100" width="58" height="81" aria-hidden="true" style={{ display: 'block' }}>
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
    <rect x="27" y="78" width="18" height="5" rx="2.5" fill="#8794a8" stroke="#67728a" strokeWidth="1.1" />
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

export default function D10_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // panel indeksi
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda panel-tushish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.idx != null) setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: PANELS.map((p) => p.expr), studentAnswer: { idx: picked }, correctAnswer: { idx: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1007">
      <style>{`
        .pq1007{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1007 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a6b8c;text-transform:uppercase;}
        .pq1007 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1007 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1007 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1007 .pq-stage{display:flex;flex-direction:column;align-items:center;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#e8ecf3,#dde3ec);border:2px solid #cdd6e2;}
        .pq1007 .pq-fit{position:relative;margin:0 auto;}
        .pq1007 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:210px;border-radius:18px;background:linear-gradient(#cdd7e6 0%,#bdc9db 52%,#aab7cc 100%);border:2px solid #b3bfd0;overflow:hidden;}
        .pq1007 .pq-window{position:absolute;border-radius:5px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2px solid #9db0c6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:0;}
        .pq1007 .pq-window.w1{left:20px;top:52px;width:48px;height:34px;}
        .pq1007 .pq-window.w2{left:308px;top:52px;width:48px;height:34px;}
        .pq1007 .pq-window::after{content:'';position:absolute;left:50%;top:4px;bottom:4px;width:2px;background:#9db0c6;transform:translateX(-1px);}
        .pq1007 .pq-gear{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1007 .pq-gear svg{animation:pqSpin 7s linear infinite;}
        .pq1007 .pq-gear.g1{left:4px;top:6px;}
        .pq1007 .pq-gear.g2{left:38px;top:28px;}
        .pq1007 .pq-gear.g2 svg{animation:pqSpin 5.4s linear infinite reverse;}
        .pq1007 .pq-gear.g3{right:6px;top:8px;}
        .pq1007 .pq-gear.g3 svg{animation:pqSpin 9s linear infinite;}
        .pq1007 .pq-pipe{position:absolute;left:0;right:0;top:0;height:11px;background:linear-gradient(#b7c1d0,#8b97a9 55%,#727e92);border-bottom:2px solid #667080;z-index:2;}
        .pq1007 .pq-pipe::after{content:'';position:absolute;right:44px;top:-4px;width:16px;height:16px;border-radius:4px;background:linear-gradient(#c3ccd9,#93a0b2);border:1.5px solid #6c7789;}
        .pq1007 .pq-valve{position:absolute;right:26px;top:-6px;width:10px;height:10px;border-radius:50%;background:#e05a4d;border:1.5px solid #b23b30;z-index:3;}
        .pq1007 .pq-steam{position:absolute;right:46px;top:-6px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.85);z-index:2;opacity:0;animation:pqSteam 4.2s ease-in-out infinite;}
        .pq1007 .pq-steam.s2{right:52px;animation-delay:-2.1s;}
        .pq1007 .pq-led{position:absolute;top:15px;width:8px;height:8px;border-radius:50%;z-index:3;box-shadow:0 0 5px currentColor;}
        .pq1007 .pq-led.l1{left:14px;color:#57d68a;background:#57d68a;animation:pqBlinkL 1.5s ease-in-out infinite;}
        .pq1007 .pq-led.l2{left:26px;color:#ffcf3f;background:#ffcf3f;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-.5s;}
        .pq1007 .pq-led.l3{left:38px;color:#e05a4d;background:#e05a4d;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-1s;}
        .pq1007 .pq-board{position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:4;padding:6px 15px 7px;border-radius:9px;background:linear-gradient(#9aa7bd,#7a889f);border:2.5px solid #5f6c82;color:#fbfdff;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1007 .pq-board::before,.pq1007 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#5f6c82;}
        .pq1007 .pq-board::before{left:18px;} .pq1007 .pq-board::after{right:18px;}
        .pq1007 .pq-q{position:absolute;top:47px;left:50%;transform:translateX(-50%);width:30px;height:30px;border-radius:50%;background:#fff;border:2px solid #c3cdda;color:#5b6b82;font-size:19px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(91,107,130,.22);animation:pqBreath 2.2s ease-in-out infinite;z-index:5;}
        .pq1007 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#8b95a6,#6f7a8d);border-top:2px solid #97a1b2;z-index:1;}
        .pq1007 .pq-belt{position:absolute;left:74px;right:6px;bottom:12px;height:24px;border-radius:5px;background:#5a6577;border:2px solid #454f61;overflow:hidden;z-index:2;box-shadow:0 2px 3px rgba(0,0,0,.2);}
        .pq1007 .pq-beltmov{position:absolute;left:-24px;right:-24px;top:0;bottom:0;background:repeating-linear-gradient(90deg,#5a6577 0 15px,#4a5568 15px 20px);animation:pqBelt .85s linear infinite;}
        .pq1007 .pq-scene.still .pq-beltmov{animation:none;}
        .pq1007 .pq-rollers{position:absolute;left:78px;right:10px;bottom:5px;height:12px;display:flex;justify-content:space-between;z-index:1;}
        .pq1007 .pq-roller{width:12px;height:12px;border-radius:50%;background:conic-gradient(#8794a8 0 25%,#5f6b80 0 50%,#8794a8 0 75%,#5f6b80 0);border:1.4px solid #454f61;animation:pqSpin 1.1s linear infinite;}
        .pq1007 .pq-scene.still .pq-roller{animation:none;}
        .pq1007 .pq-robotw{position:absolute;left:6px;bottom:14px;line-height:0;z-index:3;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq1007 .pq-robotw.win{animation:pqCele .55s ease;}
        .pq1007 .pq-ant{transform-box:fill-box;transform-origin:center;animation:pqPulse 1.2s ease-in-out infinite;}
        .pq1007 .pq-blink{opacity:0;animation:pqBlink 3.6s linear infinite;}

        .pq1007 .pq-panel{position:absolute;top:90px;width:64px;box-sizing:border-box;background:none;border:none;padding:0;cursor:pointer;z-index:5;font-family:inherit;animation:pqDropIn .55s cubic-bezier(.3,1.1,.5,1) both;}
        .pq1007 .pq-scene.still .pq-panel{animation:none;}
        .pq1007 .pq-panel:disabled{cursor:default;}
        .pq1007 .pq-mon{position:relative;width:64px;height:58px;border-radius:14px;background:linear-gradient(#aeb9c9,#8794a8);border:2.5px solid #4a5568;box-shadow:0 3px 4px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;transition:.14s;}
        .pq1007 .pq-mon::before,.pq1007 .pq-mon::after{content:'';position:absolute;top:24px;width:5px;height:5px;border-radius:50%;background:#67728a;border:1.4px solid #4a5568;}
        .pq1007 .pq-mon::before{left:-4px;} .pq1007 .pq-mon::after{right:-4px;}
        .pq1007 .pq-antp{position:absolute;top:-11px;left:50%;transform:translateX(-50%);width:2.4px;height:9px;background:#67728a;border-radius:2px;z-index:1;}
        .pq1007 .pq-antp::after{content:'';position:absolute;left:50%;top:-6px;transform:translateX(-50%);width:6px;height:6px;border-radius:50%;background:#ffb14e;border:1.2px solid #d98b23;}
        .pq1007 .pq-scr{width:50px;height:34px;border-radius:7px;background:#1e2740;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:900;color:#7cf0ff;font-variant-numeric:tabular-nums;box-shadow:inset 0 0 0 1px rgba(124,240,255,.25);}
        .pq1007 .pq-op{margin:0 3px;} .pq1007 .pq-op.plus{color:#8ef0a8;}
        .pq1007 .pq-panel:hover:not(:disabled) .pq-mon{transform:translateY(-3px);}
        .pq1007 .pq-panel:active:not(:disabled) .pq-mon{transform:scale(.94);}
        .pq1007 .pq-panel.sel .pq-mon{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.35),0 3px 4px rgba(0,0,0,.2);}
        .pq1007 .pq-panel.bad .pq-mon{border-color:#e08a8a;animation:pqShake .35s ease;}
        .pq1007 .pq-panel.good .pq-mon{border-color:#1a7f43;background:linear-gradient(#d6f0e0,#b6e4c8);}
        .pq1007 .pq-panel.odd .pq-mon{border-color:#c0392b;background:linear-gradient(#f6d7d2,#eeb9b1);}
        .pq1007 .pq-res{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:4px;font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;padding:1px 8px;border-radius:9px;white-space:nowrap;animation:pqPop .3s ease both;z-index:6;}
        .pq1007 .pq-res.g{color:#1a7f43;background:#e8f7ee;border:1.5px solid #9fd8b5;}
        .pq1007 .pq-res.r{color:#c0392b;background:#fdecec;border:1.5px solid #eab3ad;}
        .pq1007 .pq-tag{position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:900;color:#fff;background:#c0392b;padding:2px 8px;border-radius:7px;white-space:nowrap;box-shadow:0 2px 4px rgba(192,57,43,.32);animation:pqPop .3s ease both;z-index:7;}
        .pq1007 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1007 .pq-wstar.w2{animation-delay:-.5s;} .pq1007 .pq-wstar.w3{animation-delay:-1.05s;}

        .pq1007 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1007 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1007 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqBelt{from{transform:translateX(0);}to{transform:translateX(20px);}}
        @keyframes pqSteam{0%,62%,100%{opacity:0;transform:translateY(0) scale(.6);}70%{opacity:.85;transform:translateY(-10px) scale(1);}88%{opacity:0;transform:translateY(-22px) scale(1.4);}}
        @keyframes pqBlinkL{0%,100%{opacity:1;}50%{opacity:.28;}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:.65;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.12);}}
        @keyframes pqDropIn{0%{opacity:0;transform:translateY(-70px);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* Ambient: suzuvchi mayda uchqunlar (fon dekori) */
        .pq1007 .pq-mote{position:absolute;z-index:0;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,rgba(124,240,255,.5) 55%,rgba(124,240,255,0) 74%);pointer-events:none;opacity:0;animation:pq1007Mote 10.5s ease-in-out infinite;}
        .pq1007 .pq-mote.m2{width:4px;height:4px;animation-duration:12s;animation-delay:-4.5s;}
        .pq1007 .pq-mote.m3{width:6px;height:6px;animation-duration:14s;animation-delay:-8.5s;}
        @keyframes pq1007Mote{0%{opacity:0;transform:translate(0,8px) scale(.7);}22%{opacity:.5;}50%{opacity:.55;transform:translate(-4px,-9px) scale(1);}80%{opacity:.3;}100%{opacity:0;transform:translate(0,-20px) scale(.7);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 210 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {/* Ambient uchqunlar (fon, dekor) */}
          <span className="pq-mote m1" aria-hidden="true" style={{ left: 120, top: 58 }} />
          <span className="pq-mote m2" aria-hidden="true" style={{ left: 210, top: 50 }} />
          <span className="pq-mote m3" aria-hidden="true" style={{ left: 280, top: 64 }} />
          <span className="pq-window w1" /><span className="pq-window w2" />
          <span className="pq-gear g1"><Gear size={42} /></span>
          <span className="pq-gear g2"><Gear size={26} c="#98a4b6" line="#5f6b80" /></span>
          <span className="pq-gear g3"><Gear size={34} c="#9aa6b8" line="#5f6b80" /></span>
          <span className="pq-pipe" />
          <span className="pq-valve" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-led l1" /><span className="pq-led l2" /><span className="pq-led l3" />
          <div className="pq-board">{t.board}</div>
          {!ok && <span className="pq-q">?</span>}

          <span className="pq-floor" />
          <div className="pq-belt"><span className="pq-beltmov" /></div>
          <div className="pq-rollers">
            {Array.from({ length: 7 }).map((_, i) => (<span key={i} className="pq-roller" style={{ animationDelay: `${-i * 0.12}s` }} />))}
          </div>

          <span className={'pq-robotw' + (ok ? ' win' : '')}><Robot /></span>

          {/* 4 robot-panel — mount'da birin-ketin tushadi, keyin STATIK (bosiladigan nishon). */}
          {PANELS.map((p, i) => {
            const sel = picked === i;
            let cls = '';
            if (ok) cls = i === CORRECT ? ' odd' : ' good';
            else if (feedback && !feedback.correct && sel) cls = ' bad';
            else if (sel) cls = ' sel';
            const [a, op, b] = p.expr.split(' ');
            return (
              <button key={i} type="button" className={'pq-panel' + cls} style={{ left: 76 + i * 74, animationDelay: `${0.2 + i * 0.16}s` }}
                disabled={lock} onClick={() => { setPicked(i); setFeedback(null); }}>
                {ok && i === CORRECT && <span className="pq-tag">{t.other}</span>}
                <span className="pq-antp" />
                <span className="pq-mon">
                  <span className="pq-scr">{a}<b className={'pq-op ' + (op === '+' ? 'plus' : 'minus')}>{op}</b>{b}</span>
                </span>
                {ok && <span className={'pq-res ' + (i === CORRECT ? 'r' : 'g')}>= {p.sum}</span>}
              </button>
            );
          })}

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '26%', top: '58px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-wstar w2" style={{ left: '54%', top: '64px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w3" style={{ left: '78%', top: '52px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
