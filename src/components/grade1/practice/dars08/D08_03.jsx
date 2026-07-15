// Dars08 · Amaliyot 03 — P9 Ayirish ma'nosi (ketish) · 🟡 · tag: walk_away
// Hovlida 7 tovuq don cho'qib turibdi; sahna ochilganda 3 tasi birin-ketin YURIB tovuqxonaga
// kirib ketadi (restore/review — statik yakuniy holat, ketganlar ko'rinmaydi). Hovlida 4 qoladi.
// G'alabada badge faqat qolgan 4 tovuqda (1..4), chip sahna tartibida «7 − 3 = 4».
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

const DATA = { start: 7, gone: 3, target: 4, options: [3, 4, 5], ptype: 'P9', level: '🟡', tag: 'walk_away' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Tovuqxona', title: 'Nechta qoldi?',
    setup: 'Hovlida yettita tovuq don cho\'qib turgan edi. Kech kirdi — uchtasi tovuqxonaga kirib ketdi.',
    ask: 'Hovlida nechta tovuq QOLDI?',
    correct: 'Barakalla! Yetti tovuqdan uchtasi ketdi — to\'rttasi qoldi.',
    hint: 'Hovlida qolgan tovuqlarni sanang — katakka kirganlari endi hovlida emas.',
  },
  ru: {
    eyebrow: 'Сельский двор · Курятник', title: 'Сколько осталось?',
    setup: 'Во дворе семь кур клевали зёрна. Наступил вечер — три курицы ушли в курятник.',
    ask: 'Сколько кур ОСТАЛОСЬ во дворе?',
    correct: 'Молодец! Было семь кур, три ушли — осталось четыре.',
    hint: 'Посчитай кур, которые остались во дворе, — те, что зашли в курятник, уже не во дворе.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TOVUQ KANONI: yon ko'rinish, o'ngga qaragan. Oq-krem tana 2-ton (#f6f1e4/#e4dbc6,
// kontur #b9a67e), qizil toj+soqolcha (#d9534b), sariq tumshuq/oyoqlar (#e8a33d),
// blikli pirpiratuvchi ko'z, qanot-chizig'i. Bosh guruhi (pq-hd) cho'qish/qadam qiladi.
const Hen = ({ d = 0 }) => (
  <svg viewBox="0 0 58 46" width="48" height="38" aria-hidden="true"
    style={{ display: 'block', '--pd': `${-(d * 0.55)}s`, '--bd': `${-(d * 0.7)}s` }}>
    <path d="M13 24 Q2 20 2 12 Q11 14 15 21 Z" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M14 21 Q6 13 9 5 Q16 10 17 19 Z" fill="#e4dbc6" stroke="#b9a67e" strokeWidth="1.3" strokeLinejoin="round" />
    <line x1="24" y1="35" x2="23" y2="43" stroke="#e8a33d" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="32" y1="35" x2="32" y2="43" stroke="#e8a33d" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="23" y1="43" x2="27" y2="44" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="43" x2="36" y2="44" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="27" cy="26" rx="15" ry="10.5" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.5" />
    <path d="M15 30 Q27 38.5 39 29 Q34 36 26 36.2 Q19 36 15 30 Z" fill="#e4dbc6" />
    <path d="M19 22 Q28 17.5 34 23 Q30 30 21 29 Q17.5 26 19 22 Z" fill="#eee7d3" stroke="#b9a67e" strokeWidth="1.2" />
    <path d="M22 24.5 Q27 22.5 31 25" stroke="#b9a67e" strokeWidth="1" fill="none" opacity=".65" />
    <g className="pq-hd">
      <path d="M34 25 Q36.5 18 39 14.5" stroke="#f6f1e4" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="41" cy="12" r="7" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.5" />
      <path d="M36.6 8.4 Q37.4 3 40 5.8 Q41 1.6 43.6 4.8 Q45.8 2.6 46.4 7.4 Q43.4 9.6 39 9.6 Z" fill="#d9534b" />
      <path d="M45.2 16.6 q.4 4.4 -2.4 4.6 q-1.6 -2.4 .4 -4.8 Z" fill="#d9534b" />
      <polygon points="47.4,10.6 54.5,13 47.4,15.2" fill="#e8a33d" />
      <line x1="47.6" y1="12.9" x2="52.5" y2="13" stroke="#c07f22" strokeWidth=".9" />
      <circle cx="43" cy="10.6" r="1.5" fill="#1f2430" />
      <circle cx="43.6" cy="10" r="0.55" fill="#fff" />
      <g className="pq-blink"><rect x="41.1" y="8.7" width="3.9" height="3.6" rx="1.6" fill="#f6f1e4" /></g>
    </g>
  </svg>
);

// TOVUQXONA: oyoqli yog'och katak-uycha — taxta devor, qiya tom + bayroqcha (sway),
// qorong'i kirish teshigi, narvon-taxta, dumaloq deraza. Derazadan tovuqlar kirib
// bo'lgach bitta bosh boqib turadi (pq-peek, kechikib paydo bo'ladi).
const Coop = () => (
  <svg viewBox="0 0 120 138" width="116" height="133" aria-hidden="true" style={{ display: 'block' }}>
    <defs><clipPath id="pq0803win"><circle cx="84" cy="82" r="12.4" /></clipPath></defs>
    <ellipse cx="60" cy="134" rx="52" ry="4" fill="#6da75c" opacity=".55" />
    <rect x="14" y="108" width="8" height="27" rx="2" fill="#8a5424" />
    <rect x="98" y="108" width="8" height="27" rx="2" fill="#8a5424" />
    <rect x="7" y="52" width="106" height="60" rx="3" fill="#c58a4a" stroke="#8a5424" strokeWidth="2" />
    <line x1="9" y1="68" x2="111" y2="68" stroke="#a06a2e" strokeWidth="1.4" opacity=".55" />
    <line x1="9" y1="83" x2="111" y2="83" stroke="#a06a2e" strokeWidth="1.4" opacity=".55" />
    <line x1="9" y1="97" x2="111" y2="97" stroke="#a06a2e" strokeWidth="1.4" opacity=".55" />
    <path d="M20 112 L20 86 Q30 75 40 86 L40 112 Z" fill="#46301b" stroke="#8a5424" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M24 112 L24 90 Q30 84 36 90 L36 112 Z" fill="#2e1f10" />
    <polygon points="6,132 19,109 30,111 15,135" fill="#b0793f" stroke="#8a5424" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="13" y1="125" x2="23" y2="127" stroke="#8a5424" strokeWidth="1.6" />
    <line x1="16" y1="118" x2="26" y2="120" stroke="#8a5424" strokeWidth="1.6" />
    <circle cx="84" cy="82" r="14" fill="#3d2a14" stroke="#8a5424" strokeWidth="3" />
    <g clipPath="url(#pq0803win)">
      <g className="pq-peek">
        <circle cx="85" cy="89" r="8.4" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.4" />
        <path d="M81 81.6 Q81.8 77.2 84 79.4 Q85 76.2 87.4 78.8 Q89.4 77.2 89.6 81 Q86.6 82.8 82.6 82.8 Z" fill="#d9534b" />
        <polygon points="77.6,85.6 71.8,87.8 77.6,89.8" fill="#e8a33d" />
        <circle cx="81" cy="85.2" r="1.4" fill="#1f2430" />
        <circle cx="81.5" cy="84.7" r="0.5" fill="#fff" />
        <g className="pq-blink" style={{ '--bd': '-2.1s' }}><rect x="79.2" y="83.4" width="3.7" height="3.5" rx="1.5" fill="#f6f1e4" /></g>
      </g>
    </g>
    <circle cx="84" cy="82" r="14" fill="none" stroke="#8a5424" strokeWidth="3" />
    <polygon points="0,54 60,18 120,54" fill="#c0684a" stroke="#8a4530" strokeWidth="2" strokeLinejoin="round" />
    <line x1="8" y1="50" x2="60" y2="19.5" stroke="#dd8a68" strokeWidth="2" opacity=".6" />
    <line x1="60" y1="20" x2="60" y2="4" stroke="#8a5424" strokeWidth="2.4" strokeLinecap="round" />
    <polygon className="pq-flag" points="61,4 75,8.5 61,13" fill="#d9534b" />
  </svg>
);

// Bobo-buvi uyi: devor + tom + krest-romli deraza + eshik + mo'ri.
const House = () => (
  <svg viewBox="0 0 96 88" width="92" height="84" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="64" y="12" width="10" height="20" fill="#a06a38" stroke="#7e4f24" strokeWidth="1.5" />
    <rect x="8" y="36" width="80" height="50" fill="#f0e3c8" stroke="#cbb389" strokeWidth="2" />
    <polygon points="0,40 48,6 96,40" fill="#c0684a" stroke="#8a4530" strokeWidth="2" strokeLinejoin="round" />
    <rect x="20" y="48" width="21" height="19" fill="#cdeaf7" stroke="#8a6a44" strokeWidth="2" />
    <line x1="30.5" y1="48" x2="30.5" y2="67" stroke="#8a6a44" strokeWidth="1.6" />
    <line x1="20" y1="57.5" x2="41" y2="57.5" stroke="#8a6a44" strokeWidth="1.6" />
    <rect x="55" y="54" width="19" height="32" rx="2" fill="#8a5a2e" stroke="#6f4722" strokeWidth="2" />
    <circle cx="70" cy="70" r="1.6" fill="#e8c98a" />
  </svg>
);

const Tree = () => (
  <svg viewBox="0 0 116 104" width="108" height="97" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M54 100 L54 62 Q54 52 44 44 M62 100 L62 60 Q62 52 72 44" stroke="#7c4f24" strokeWidth="10" strokeLinecap="round" fill="none" />
    <circle cx="38" cy="40" r="26" fill="#4f9a48" />
    <circle cx="76" cy="34" r="27" fill="#5cae54" />
    <circle cx="57" cy="22" r="20" fill="#68bd60" />
    <circle cx="50" cy="16" r="8" fill="#83cf7a" opacity=".8" />
    <circle cx="86" cy="26" r="8" fill="#83cf7a" opacity=".7" />
    <circle cx="34" cy="30" r="4.6" fill="#d94f5c" />
    <circle cx="32.6" cy="28.6" r="1.4" fill="#fff" opacity=".5" />
    <circle cx="82" cy="46" r="4.6" fill="#d94f5c" />
    <circle cx="80.6" cy="44.6" r="1.4" fill="#fff" opacity=".5" />
  </svg>
);

// Qoladigan 4 tovuq (old qator) va ketadigan 3 tovuq (orqa qator).
// gx = tovuqxona eshigigacha yo'l (px), gd = yurish davomiyligi, dl = start-kechikish.
const STAY = [8, 68, 130, 190];
const GO = [
  { x: 34, gx: 215, gd: 2.6, dl: 0.4 },
  { x: 96, gx: 153, gd: 1.9, dl: 1.4 },
  { x: 158, gx: 91, gd: 1.2, dl: 2.4 },
];
const SEEDS = [58, 118, 180, 230];

export default function D08_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda ketish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0803" ref={fitRef}>
      <style>{`
        .pq0803{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0803 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a3652e;text-transform:uppercase;}
        .pq0803 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0803 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0803 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0803 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:232px;border-radius:20px;background:linear-gradient(#f6dfc0 0%,#fbeed6 46%,#eef4e2 100%);border:2px solid #e4cfa8;overflow:hidden;}
        .pq0803 .pq-fit{position:relative;margin:0 auto;}
        .pq0803 .pq-sun{position:absolute;top:10px;right:128px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0803 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.85;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0803 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0803 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.65;animation-duration:38s;animation-delay:-26s;}
        .pq0803 .pq-house{position:absolute;left:-6px;bottom:76px;z-index:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0803 .pq-tree{position:absolute;left:84px;bottom:80px;z-index:0;}
        .pq0803 .pq-fence{position:absolute;left:0;right:0;bottom:54px;height:34px;background:repeating-linear-gradient(90deg,#e9dcc0 0 9px,#dbc9a3 9px 13px,transparent 13px 24px);opacity:.85;z-index:0;}
        .pq0803 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#d3bf96;border-radius:3px;}
        .pq0803 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#a8cd82,#8cba68);z-index:0;}
        .pq0803 .pq-grain{position:absolute;left:0;bottom:14px;z-index:1;}
        .pq0803 .pq-coop{position:absolute;right:2px;bottom:12px;z-index:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18));}
        .pq0803 .pq-flag{transform-box:view-box;transform-origin:61px 4px;animation:pqSway 2.4s ease-in-out infinite alternate;}
        .pq0803 .pq-henw{position:absolute;bottom:22px;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0803 .pq-henw.back{bottom:40px;z-index:2;}
        .pq0803 .pq-hd{transform-box:view-box;transform-origin:35px 24px;animation:pqPeck 3s ease-in-out infinite;animation-delay:var(--pd,0s);}
        .pq0803 .pq-go{animation:pqGo var(--gd) linear var(--gdel) both;}
        .pq0803 .pq-go .pq-hd{animation:pqNod .36s ease-in-out var(--gdel) infinite alternate;}
        .pq0803 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0803 .pq-peek{transform-box:view-box;opacity:0;animation:pqPeekIn .55s ease 4s both,pqPeekBob 3.2s ease-in-out 4.8s infinite;}
        .pq0803 .pq-scene.still .pq-go{display:none;}
        .pq0803 .pq-scene.still .pq-peek{opacity:1;animation:pqPeekBob 3.2s ease-in-out infinite;}
        .pq0803 .pq-scene.win .pq-stay{animation:pqCele .5s ease;}
        .pq0803 .pq-cnt{position:absolute;top:-10px;left:50%;margin-left:-9.5px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq0803 .pq-q{position:absolute;left:206px;top:58px;width:34px;height:34px;border-radius:50%;background:#fff;border:2px solid #e2cfa4;color:#a3652e;font-size:22px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(163,101,46,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:3;}
        .pq0803 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0803 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0803 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0803 .pq-opt:hover:not(:disabled){border-color:#e2c391;transform:translateY(-2px);}
        .pq0803 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0803 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0803 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0803 .pq-opt:disabled{cursor:default;}
        .pq0803 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0803 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0803 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSway{from{transform:rotate(4deg);}to{transform:rotate(-7deg);}}
        @keyframes pqPeck{0%,46%,100%{transform:rotate(0deg);}56%,64%{transform:rotate(28deg);}72%{transform:rotate(7deg);}80%,88%{transform:rotate(25deg);}}
        @keyframes pqNod{from{transform:rotate(0deg);}to{transform:rotate(9deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqGo{
          0%{transform:translateX(0) translateY(0);opacity:1;}
          10%{transform:translateX(calc(var(--gx)*.12)) translateY(-3px);}
          20%{transform:translateX(calc(var(--gx)*.24)) translateY(0);}
          30%{transform:translateX(calc(var(--gx)*.36)) translateY(-3px);}
          40%{transform:translateX(calc(var(--gx)*.48)) translateY(0);}
          50%{transform:translateX(calc(var(--gx)*.6)) translateY(-3px);}
          60%{transform:translateX(calc(var(--gx)*.72)) translateY(0);}
          70%{transform:translateX(calc(var(--gx)*.84)) translateY(-3px);}
          80%{transform:translateX(var(--gx)) translateY(0);opacity:1;}
          88%{transform:translateX(calc(var(--gx) + 8px)) translateY(-5px) scale(.85);opacity:1;}
          100%{transform:translateX(calc(var(--gx) + 16px)) translateY(-9px) scale(.55);opacity:0;}
        }
        @keyframes pqPeekIn{from{opacity:0;transform:translateY(9px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqPeekBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.6px);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 232 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '') + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-house"><House /></span>
        <span className="pq-tree"><Tree /></span>
        <span className="pq-fence" /><span className="pq-grass" />
        {/* Don-dog' — har bir qolgan tovuqning tumshug'i oldida */}
        <svg className="pq-grain" viewBox="0 0 360 14" width="360" height="14" aria-hidden="true">
          {SEEDS.map((x, i) => (
            <g key={i}>
              <ellipse cx={x - 6} cy="8" rx="2" ry="1.3" fill="#b97c14" />
              <ellipse cx={x} cy="10.5" rx="2" ry="1.3" fill="#b97c14" transform={`rotate(20 ${x} 10.5)`} />
              <ellipse cx={x + 6} cy="8.5" rx="2" ry="1.3" fill="#b97c14" transform={`rotate(-25 ${x + 6} 8.5)`} />
              <ellipse cx={x + 2} cy="6" rx="1.8" ry="1.2" fill="#8a6543" />
            </g>
          ))}
        </svg>
        <span className="pq-coop"><Coop /></span>

        {/* Qoladigan 4 tovuq — don cho'qiydi (stagger); g'alabada badge 1..4 */}
        {STAY.map((x, i) => (
          <div key={'s' + i} className="pq-henw" style={{ left: x }}>
            <div className="pq-stay"><Hen d={i} /></div>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
          </div>
        ))}
        {/* Ketadigan 3 tovuq — birin-ketin tovuqxona eshigiga yurib kirib ketadi; badge chiqmaydi */}
        {GO.map((g, i) => (
          <div key={'g' + i} className="pq-henw back pq-go"
            style={{ left: g.x, '--gx': `${g.gx}px`, '--gd': `${g.gd}s`, '--gdel': `${g.dl}s` }}>
            <Hen d={4 + i} />
          </div>
        ))}

        {!ok && <span className="pq-q">?</span>}
        {ok && <span className="pq-chip">{DATA.start} − {DATA.gone} = {DATA.target}</span>}
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
