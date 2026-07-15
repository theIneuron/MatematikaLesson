// Dars10 · Amaliyot 06 — P8 Zanjir aralash «Fabrika smenasi» · 🔴 · tag: mixed_chain_10
// 4 ARALASH misol (10 ichida, qo'shish + ayirish, belgi rangli). Fabrika-sahna: taxta «Hisob-kitob
// smenasi», konveyer ustida 4 kanon-karton quti (mount'da birin-ketin tushib joylashadi, keyin bob;
// g'alabada badge 1..4 + uchqunlar). Robot smenani boshqaradi (ko'z pirpiratadi, antenna puls).
// Fon: tishli-g'ildiraklar aylanadi, rolik-g'ildiraklar aylanadi, quvurdan bug', chiroqlar miltillaydi.
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

const ROWS = [
  { expr: '6 + 3', ans: 9, opts: [7, 8, 9, 10] },
  { expr: '10 − 4', ans: 6, opts: [4, 5, 6, 7] },
  { expr: '5 + 4', ans: 9, opts: [7, 8, 9, 10] },
  { expr: '8 − 6', ans: 2, opts: [0, 1, 2, 3] },
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'mixed_chain_10' };
const T = {
  uz: {
    eyebrow: 'Fabrika · Smena', title: 'Aralash zanjir',
    setup: 'Fabrikada hisob-kitob smenasi! To\'rtta misol — qo\'shish ham, ayirish ham bor.',
    ask: 'Har misol uchun to\'g\'ri javobni tanlang. Belgiga diqqat!',
    correct: 'Barakalla! To\'rtala misol to\'g\'ri — smena bajarildi!',
    hint: 'Qizil qatorlarga qarang: avval belgini aniqlang — qo\'shuvmi, ayiruvmi? Keyin sanang.',
    board: 'Hisob-kitob smenasi',
  },
  ru: {
    eyebrow: 'Фабрика · Смена', title: 'Смешанная цепочка',
    setup: 'На фабрике счётная смена! Четыре примера — есть и сложение, и вычитание.',
    ask: 'Выбери верный ответ для каждого примера. Внимание на знак!',
    correct: 'Молодец! Все четыре примера верны — смена выполнена!',
    hint: 'Посмотри на красные строки: сначала определи знак — плюс или минус? Потом посчитай.',
    board: 'Счётная смена',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TISHLI-G'ILDIRAK: 8 tish + tana + o'q. Metall kulrang-ko'k, fon dekori (sekin aylanadi).
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

// ROBOT KANONI: to'rtburchak-yumaloq metall tana (kulrang-ko'k 2-3 ton), old panelda ekran-yuz
// (ikki dumaloq ko'z + LED-tabassum, ko'zlar pirpiratadi), antenna (uchida pulslanuvchi doira),
// kalta qo'l-oyoq (bo'g'in-to'garaklar). Do'stona ifoda. Smenani boshqaradi.
const Robot = () => (
  <svg viewBox="0 0 72 100" width="61" height="85" aria-hidden="true" style={{ display: 'block' }}>
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

// QUTI KANONI: karton quti — jigarrang-sariq 2-ton, tepa qopqoq, o'rta tasma, «tepaga» belgisi.
// Bitta quti = bitta dona (sanash uchun).
const Box = () => (
  <svg viewBox="0 0 50 48" width="46" height="44" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="8" y="6" width="34" height="9" rx="2" fill="#b9843f" stroke="#96602c" strokeWidth="1.7" />
    <rect x="6" y="14" width="38" height="30" rx="3" fill="#d9a05b" stroke="#96602c" strokeWidth="2" />
    <rect x="6.5" y="21" width="37" height="7" fill="#eac48c" opacity=".85" />
    <line x1="25" y1="14" x2="25" y2="44" stroke="#96602c" strokeWidth="1.3" opacity=".45" />
    <path d="M19 37 L25 31 L31 37 M25 31 L25 41" stroke="#96602c" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Qutilar joyi (sahna px, chapdan). Konveyer ustida.
const BOXES = [{ x: 92 }, { x: 160 }, { x: 228 }, { x: 296 }];

export default function D10_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda quti-tushish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.expr} = ${r.opts.join('/')}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1006">
      <style>{`
        .pq1006{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1006 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5a6b8c;text-transform:uppercase;}
        .pq1006 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1006 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1006 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1006 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#e8ecf3,#dde3ec);border:2px solid #cdd6e2;}
        .pq1006 .pq-fit{position:relative;margin:0 auto;}
        .pq1006 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:206px;border-radius:18px;background:linear-gradient(#cdd7e6 0%,#bdc9db 52%,#aab7cc 100%);border:2px solid #b3bfd0;overflow:hidden;}
        .pq1006 .pq-window{position:absolute;border-radius:5px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2px solid #9db0c6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);z-index:0;}
        .pq1006 .pq-window.w1{left:150px;top:16px;width:52px;height:38px;}
        .pq1006 .pq-window.w2{left:212px;top:16px;width:52px;height:38px;}
        .pq1006 .pq-window::after{content:'';position:absolute;left:50%;top:4px;bottom:4px;width:2px;background:#9db0c6;transform:translateX(-1px);}
        .pq1006 .pq-gear{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1006 .pq-gear svg{animation:pqSpin 7s linear infinite;}
        .pq1006 .pq-gear.g1{left:6px;top:8px;}
        .pq1006 .pq-gear.g2{left:40px;top:30px;}
        .pq1006 .pq-gear.g2 svg{animation:pqSpin 5.4s linear infinite reverse;}
        .pq1006 .pq-pipe{position:absolute;left:0;right:0;top:0;height:11px;background:linear-gradient(#b7c1d0,#8b97a9 55%,#727e92);border-bottom:2px solid #667080;z-index:2;}
        .pq1006 .pq-pipe::after{content:'';position:absolute;right:44px;top:-4px;width:16px;height:16px;border-radius:4px;background:linear-gradient(#c3ccd9,#93a0b2);border:1.5px solid #6c7789;}
        .pq1006 .pq-valve{position:absolute;right:26px;top:-6px;width:10px;height:10px;border-radius:50%;background:#e05a4d;border:1.5px solid #b23b30;z-index:3;}
        .pq1006 .pq-steam{position:absolute;right:46px;top:-6px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.85);z-index:2;opacity:0;animation:pqSteam 4.2s ease-in-out infinite;}
        .pq1006 .pq-steam.s2{right:52px;animation-delay:-2.1s;}
        .pq1006 .pq-led{position:absolute;top:15px;width:8px;height:8px;border-radius:50%;z-index:3;box-shadow:0 0 5px currentColor;}
        .pq1006 .pq-led.l1{left:14px;color:#57d68a;background:#57d68a;animation:pqBlinkL 1.5s ease-in-out infinite;}
        .pq1006 .pq-led.l2{left:26px;color:#ffcf3f;background:#ffcf3f;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-.5s;}
        .pq1006 .pq-led.l3{left:38px;color:#e05a4d;background:#e05a4d;animation:pqBlinkL 1.5s ease-in-out infinite;animation-delay:-1s;}
        .pq1006 .pq-board{position:absolute;top:14px;left:50%;transform:translateX(-50%);z-index:4;padding:6px 15px 7px;border-radius:9px;background:linear-gradient(#9aa7bd,#7a889f);border:2.5px solid #5f6c82;color:#fbfdff;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1006 .pq-board::before,.pq1006 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#5f6c82;}
        .pq1006 .pq-board::before{left:18px;} .pq1006 .pq-board::after{right:18px;}
        .pq1006 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#8b95a6,#6f7a8d);border-top:2px solid #97a1b2;z-index:1;}
        .pq1006 .pq-belt{position:absolute;left:74px;right:6px;bottom:12px;height:24px;border-radius:5px;background:#5a6577;border:2px solid #454f61;overflow:hidden;z-index:2;box-shadow:0 2px 3px rgba(0,0,0,.2);}
        .pq1006 .pq-beltmov{position:absolute;left:-24px;right:-24px;top:0;bottom:0;background:repeating-linear-gradient(90deg,#5a6577 0 15px,#4a5568 15px 20px);animation:pqBelt .85s linear infinite;}
        .pq1006 .pq-scene.still .pq-beltmov{}
        .pq1006 .pq-rollers{position:absolute;left:78px;right:10px;bottom:5px;height:12px;display:flex;justify-content:space-between;z-index:1;}
        .pq1006 .pq-roller{width:12px;height:12px;border-radius:50%;background:conic-gradient(#8794a8 0 25%,#5f6b80 0 50%,#8794a8 0 75%,#5f6b80 0);border:1.4px solid #454f61;animation:pqSpin 1.1s linear infinite;}
        .pq1006 .pq-robotw{position:absolute;left:5px;bottom:15px;line-height:0;z-index:3;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq1006 .pq-robotw.win{animation:pqCele .55s ease;}
        .pq1006 .pq-ant{transform-box:fill-box;transform-origin:center;animation:pqPulse 1.2s ease-in-out infinite;}
        .pq1006 .pq-blink{opacity:0;animation:pqBlink 3.6s linear infinite;}
        .pq1006 .pq-boxw{position:absolute;bottom:36px;line-height:0;z-index:3;animation:pqBoxIn .6s cubic-bezier(.3,1.05,.5,1) both;animation-delay:var(--bd,0s);filter:drop-shadow(0 3px 3px rgba(0,0,0,.2));}
        .pq1006 .pq-scene.still .pq-boxw{animation:none;}
        .pq1006 .pq-bob{display:block;position:relative;animation:pqBobBox 2.8s ease-in-out infinite;animation-delay:var(--fd,0s);}
        .pq1006 .pq-bob.win{animation:pqBobBox 2.8s ease-in-out infinite,pqCele .55s ease;}
        .pq1006 .pq-cnt{position:absolute;top:-9px;right:-5px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1006 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1006 .pq-wstar.w2{animation-delay:-.5s;} .pq1006 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq1006 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq1006 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq1006 .pq-rw{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center;justify-content:center;padding:5px 9px;border-radius:14px;border:2.5px solid #cdd6e2;background:#fff;transition:.15s;}
        .pq1006 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1006 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1006 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}
        .pq1006 .pq-ex{min-width:88px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq1006 .pq-op{margin:0 5px;} .pq1006 .pq-op.plus{color:#1a7f43;} .pq1006 .pq-op.minus{color:#c0392b;}
        .pq1006 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq1006 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1006 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq1006 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1006 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1006 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1006 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1006 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq1006 .pq-sgs{display:flex;flex-wrap:wrap;align-content:center;gap:5px;margin-left:4px;flex-basis:100%;justify-content:center;}
        .pq1006 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1006 .pq-sg:hover:not(:disabled){border-color:#9db0cc;transform:translateY(-2px);}
        .pq1006 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1006 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1006 .pq-sg:disabled{cursor:default;}
        .pq1006 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1006 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1006 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqBelt{from{transform:translateX(0);}to{transform:translateX(20px);}}
        @keyframes pqSteam{0%,62%,100%{opacity:0;transform:translateY(0) scale(.6);}70%{opacity:.85;transform:translateY(-10px) scale(1);}88%{opacity:0;transform:translateY(-22px) scale(1.4);}}
        @keyframes pqBlinkL{0%,100%{opacity:1;}50%{opacity:.28;}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:.65;}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqBoxIn{0%{opacity:0;transform:translateY(-120px);}70%{opacity:1;transform:translateY(4px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqBobBox{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* Ambient: suzuvchi mayda uchqunlar (fon dekori) */
        .pq1006 .pq-mote{position:absolute;z-index:0;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,rgba(242,177,52,.5) 55%,rgba(242,177,52,0) 72%);pointer-events:none;opacity:0;animation:pq1006Mote 10s ease-in-out infinite;}
        .pq1006 .pq-mote.m2{width:4px;height:4px;animation-duration:12.5s;animation-delay:-4s;}
        .pq1006 .pq-mote.m3{width:6px;height:6px;animation-duration:13.5s;animation-delay:-8s;}
        @keyframes pq1006Mote{0%{opacity:0;transform:translate(0,8px) scale(.7);}22%{opacity:.5;}50%{opacity:.55;transform:translate(4px,-9px) scale(1);}80%{opacity:.3;}100%{opacity:0;transform:translate(0,-20px) scale(.7);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 206 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {/* Ambient uchqunlar (fon, dekor) */}
          <span className="pq-mote m1" aria-hidden="true" style={{ left: 292, top: 30 }} />
          <span className="pq-mote m2" aria-hidden="true" style={{ left: 322, top: 62 }} />
          <span className="pq-mote m3" aria-hidden="true" style={{ left: 300, top: 90 }} />
          <span className="pq-window w1" /><span className="pq-window w2" />
          <span className="pq-gear g1"><Gear size={42} /></span>
          <span className="pq-gear g2"><Gear size={26} c="#98a4b6" line="#5f6b80" /></span>
          <span className="pq-pipe" />
          <span className="pq-valve" />
          <span className="pq-steam" /><span className="pq-steam s2" />
          <span className="pq-led l1" /><span className="pq-led l2" /><span className="pq-led l3" />
          <div className="pq-board">{t.board}</div>

          <span className="pq-floor" />
          <div className="pq-belt"><span className="pq-beltmov" /></div>
          <div className="pq-rollers">
            {Array.from({ length: 7 }).map((_, i) => (<span key={i} className="pq-roller" style={{ animationDelay: `${-i * 0.12}s` }} />))}
          </div>

          <span className={'pq-robotw' + (ok ? ' win' : '')}><Robot /></span>

          {/* 4 kanon-quti — mount'da birin-ketin konveyerga tushadi, keyin bob; g'alabada badge 1..4 */}
          {BOXES.map((p, i) => (
            <span key={i} className="pq-boxw" style={{ left: p.x, '--bd': `${0.25 + i * 0.2}s` }}>
              <span className={'pq-bob' + (ok ? ' win' : '')} style={{ '--fd': `-${i * 0.6}s` }}>
                <Box />
                {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
              </span>
            </span>
          ))}

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '30%', top: '54px' }}><Star fill="#ffd13f" /></span>
              <span className="pq-wstar w2" style={{ left: '58%', top: '60px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w3" style={{ left: '80%', top: '48px' }}><Star fill="#ffd13f" /></span>
            </>
          )}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const [a, op, b] = r.expr.split(' ');
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">{a}<b className={'pq-op ' + (op === '+' ? 'plus' : 'minus')}>{op}</b>{b}</div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
