// Dars11 · Amaliyot 09 — P9 strategiya: o'rin almashtir-da hisobla (2 + 7 = 7 + 2) · 🔴 · tag: strategy_swap
// Poyezd bekati: son o'qi = temir yo'l (0..10). Lokomotiv 2-bekatdan turadi; to'g'ri javobda YURIB (sakramasdan) 7 bekat oldinga — 9 ga yetadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 2, B = 7, TARGET = A + B; // 9
const DATA = { a: A, b: B, target: TARGET, options: [8, 9, 10], ptype: 'P9', level: '🔴', tag: 'strategy_swap' };
// Son o'qi geometriyasi (SVG user birliklari): x(i) = 30 + i*40, i = 0..10.
const X0 = 30, DX = 40, RAILY = 110;
const xAt = (i) => X0 + i * DX;

const T = {
  uz: {
    eyebrow: "Poyezd bekati · Yo'l", title: "Yur-da, hisobla",
    setup: "Poyezd ikki raqamli bekatda turibdi. Unga yettita qo'shamiz — poyezd yetti bekat oldinga yuradi.",
    ask: "Poyezd qaysi bekatga yetib boradi?",
    correct: "Barakalla! Ikkidan yetti bekat oldinga — to'qqiz. Ikki qo'shuv yetti, yetti qo'shuv ikki — baribir to'qqiz!",
    hint: "Poyezd bilan sanang: ikkinchi bekatdan boshlab oldinga yetti bekat yuring.",
  },
  ru: {
    eyebrow: "Вокзал · Путь", title: "Едем и считаем",
    setup: "Поезд стоит на станции два. Прибавим семь — поезд проедет семь станций вперёд.",
    ask: "На какую станцию приедет поезд?",
    correct: "Молодец! От двух семь станций вперёд — девять. Два плюс семь, семь плюс два — всё равно девять!",
    hint: "Считай вместе с поездом: от станции два — семь станций вперёд.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Spitsali g'ildirak — o'z markazi atrofida sekin aylanadi (pq-wheel klassi CSS'da).
const Wheel = ({ cx, cy, r = 7 }) => (
  <g className="pq-wheel">
    <circle cx={cx} cy={cy} r={r} fill="#33383f" stroke="#1c1f25" strokeWidth="1.5" />
    <circle cx={cx} cy={cy} r={r * 0.44} fill="#c9cede" stroke="#1c1f25" strokeWidth="1" />
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 0.8} stroke="#727a89" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${i * 60} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r="1.5" fill="#1c1f25" />
  </g>
);

// LOKOMOTIV KANONI (o'ngga qaragan, markaz (0,0) g'ildirak-tekisligida): mo'ri (bug'), qozon,
// old chiroq, to'siq, kabina (deraza + mashinist boshi, ko'z pirpiratadi), 3 spitsali g'ildirak.
const Loco = () => (
  <>
    {/* bug' (mo'ridan) */}
    <circle className="pq-lsteam" cx="2" cy="-58" r="4.5" fill="rgba(255,255,255,.9)" />
    <circle className="pq-lsteam s2" cx="5" cy="-66" r="5.5" fill="rgba(255,255,255,.85)" />
    <circle className="pq-lsteam s3" cx="1" cy="-74" r="6.5" fill="rgba(255,255,255,.8)" />
    {/* shassi */}
    <rect x="-33" y="-10" width="66" height="8" rx="3" fill="#2f333b" />
    {/* kabina (chapda) */}
    <rect x="-34" y="-48" width="26" height="40" rx="8" fill="#4bab68" stroke="#2c6f42" strokeWidth="2" />
    <rect x="-36" y="-48" width="30" height="9" rx="4" fill="#2c6f42" />
    <rect x="-30" y="-42" width="17" height="16" rx="3.5" fill="#cfe7f6" stroke="#2c6f42" strokeWidth="1.8" />
    {/* mashinist */}
    <circle cx="-21.5" cy="-33" r="6.5" fill="#f1c9a5" />
    <path d="M-28 -36 Q-21.5 -46 -15 -36 Z" fill="#d9534b" />
    <rect x="-28" y="-37.6" width="13" height="3.2" rx="1.6" fill="#b23b30" />
    <g className="pq-lblink"><circle cx="-24" cy="-32.5" r="1.4" fill="#2f2118" /><circle cx="-19" cy="-32.5" r="1.4" fill="#2f2118" /></g>
    <path d="M-24 -28 Q-21.5 -26 -19 -28" stroke="#b06a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    {/* qozon (o'ngda) */}
    <rect x="-10" y="-36" width="42" height="28" rx="13" fill="#4bab68" stroke="#2c6f42" strokeWidth="2" />
    <rect x="-10" y="-36" width="42" height="10" rx="8" fill="#5cbd79" opacity=".7" />
    <line x1="4" y1="-35" x2="4" y2="-9" stroke="#2c6f42" strokeWidth="1.5" opacity=".5" />
    <line x1="18" y1="-35" x2="18" y2="-9" stroke="#2c6f42" strokeWidth="1.5" opacity=".5" />
    {/* gumbaz */}
    <path d="M-6 -36 a6 6 0 0 1 12 0 Z" fill="#37414c" />
    {/* mo'ri */}
    <rect x="-3" y="-56" width="13" height="22" rx="2" fill="#37414c" stroke="#242c34" strokeWidth="1.6" />
    <rect x="-6" y="-59" width="19" height="6" rx="3" fill="#2b333c" />
    {/* old chiroq */}
    <circle cx="29" cy="-20" r="6" fill="#ffe08a" stroke="#e0a92e" strokeWidth="2" />
    <circle cx="29" cy="-20" r="2.4" fill="#fff6cf" />
    {/* to'siq */}
    <path d="M33 -8 L41 0 L33 0 Z" fill="#2f333b" />
    {/* g'ildiraklar */}
    <Wheel cx={-20} cy={0} r={7} />
    <Wheel cx={6} cy={0} r={9} />
    <Wheel cx={24} cy={0} r={7} />
  </>
);

export default function D11_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash qayta ijro etilmaydi — lokomotiv statik 9-bekatda.
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
  // Lokomotiv 2-bekatdan turadi; to'g'ri javobda YURIB 9 ga boradi (still bo'lsa darhol 9-da).
  const baseX = (ok && still) ? xAt(9) : xAt(2);
  const locoCls = 'pq-loco' + (ok && !still ? ' drive' : ' bob');

  return (
    <div className="pq pq1109">
      <style>{`
        .pq1109{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1109 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7fb5;text-transform:uppercase;}
        .pq1109 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1109 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1109 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1109 .pq-scene{position:relative;width:100%;max-width:500px;height:238px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafb 0%,#e4f4ff 52%,#eaf7e4 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq1109 .pq-sun{position:absolute;top:14px;left:20px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq1109 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq1109 .pq-cloud.c1{top:26px;left:-70px;animation-duration:34s;}
        .pq1109 .pq-cloud.c2{top:54px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:46s;animation-delay:-22s;}
        .pq1109 .pq-bird{position:absolute;z-index:0;color:#7c869a;opacity:.7;line-height:0;animation:pq1109Bird linear infinite;}
        .pq1109 .pq-bird svg{display:block;}
        .pq1109 .pq-bird.bd1{top:36px;left:-24px;animation-duration:28s;}
        .pq1109 .pq-bird.bd2{top:58px;left:-24px;animation-duration:37s;animation-delay:-16s;}
        .pq1109 .pq-bird.bd2 svg{width:12px;height:6px;}
        .pq1109 .pq-fly{position:absolute;z-index:0;left:28px;top:60px;line-height:0;animation:pq1109Fly 4s ease-in-out infinite;}
        @keyframes pq1109Bird{from{transform:translateX(0);}to{transform:translateX(560px);}}
        @keyframes pq1109Fly{0%,100%{transform:translateY(0) rotate(-5deg);}50%{transform:translateY(-8px) rotate(5deg);}}
        .pq1109 .pq-hill{position:absolute;bottom:70px;left:0;right:0;height:60px;background:radial-gradient(120px 60px at 20% 100%,#bfe4a8 0 60%,transparent 62%),radial-gradient(150px 70px at 80% 100%,#b2dd9a 0 60%,transparent 62%);opacity:.8;}
        .pq1109 .pq-tree{position:absolute;bottom:96px;width:0;height:0;}
        .pq1109 .pq-tree.t1{left:64px;} .pq1109 .pq-tree.t2{left:112px;}
        .pq1109 .pq-tree i{position:absolute;bottom:0;left:-3px;width:6px;height:16px;background:#8a5a2c;border-radius:2px;}
        .pq1109 .pq-tree b{position:absolute;bottom:12px;left:-13px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#7ec96f,#4f9a48);}
        .pq1109 .pq-tree.t2 b{background:radial-gradient(circle at 38% 34%,#8ed07f,#5cae54);width:22px;height:22px;left:-11px;}
        /* semafor */
        .pq1109 .pq-sem{position:absolute;top:18px;right:18px;width:14px;height:74px;z-index:4;}
        .pq1109 .pq-sem .pole{position:absolute;bottom:0;left:5px;width:4px;height:74px;background:linear-gradient(#8a94a6,#5f6a7c);border-radius:2px;}
        .pq1109 .pq-sem .box{position:absolute;top:0;left:0;width:14px;height:34px;border-radius:5px;background:#37414c;border:1.5px solid #232a32;padding:3px 0;display:flex;flex-direction:column;align-items:center;justify-content:space-around;}
        .pq1109 .pq-sem .lmp{width:7px;height:7px;border-radius:50%;background:#2b333c;}
        .pq1109 .pq-sem .lmp.r{animation:pqSemR 3s steps(1) infinite;}
        .pq1109 .pq-sem .lmp.y{animation:pqSemY 3s steps(1) infinite;}
        .pq1109 .pq-sem .lmp.g{animation:pqSemG 3s steps(1) infinite;}
        /* son o'qi (SVG) */
        .pq1109 .pq-nlwrap{position:absolute;left:0;right:0;bottom:0;height:174px;}
        .pq1109 .pq-nl{display:block;width:100%;height:100%;}
        .pq1109 .pq-wheel{transform-box:fill-box;transform-origin:center;animation:pqSpin 1.9s linear infinite;}
        .pq1109 .pq-loco{transform-box:fill-box;transform-origin:center;}
        .pq1109 .pq-loco.bob{animation:pqBob 2.7s ease-in-out infinite;}
        .pq1109 .pq-loco.drive{animation:pqDrive 2s cubic-bezier(.5,0,.5,1) .3s forwards;}
        .pq1109 .pq-loco.drive .pq-wheel{animation-duration:.5s;}
        .pq1109 .pq-lsteam{transform-box:fill-box;transform-origin:center;opacity:0;animation:pqLsteam 3.4s ease-in-out infinite;}
        .pq1109 .pq-lsteam.s2{animation-delay:-1.1s;} .pq1109 .pq-lsteam.s3{animation-delay:-2.2s;}
        .pq1109 .pq-lblink{animation:pqBlink 4s linear infinite;transform-box:fill-box;transform-origin:center;}
        .pq1109 .pq-bubble{animation:pqBubble 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom;}
        .pq1109 .pq-path{fill:none;stroke:#2563eb;stroke-width:3;stroke-linecap:round;stroke-dasharray:3 7;opacity:0;animation:pqArcIn .5s ease .3s forwards;}
        .pq1109 .pq-step{opacity:0;animation:pqPop .32s cubic-bezier(.3,1.5,.5,1) forwards;}
        .pq1109 .pq-nine{transform-box:fill-box;transform-origin:center;animation:pqNine .5s cubic-bezier(.3,1.5,.5,1) 2.25s both;}
        /* board / chip (yuqori markaz) */
        .pq1109 .pq-board,.pq1109 .pq-chip{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:5px;font-variant-numeric:tabular-nums;white-space:nowrap;}
        .pq1109 .pq-board{padding:6px 16px;border-radius:999px;background:rgba(255,255,255,.92);border:2px solid #cfe0ef;font-size:22px;font-weight:900;color:#3a4250;box-shadow:0 3px 8px rgba(0,0,0,.1);}
        .pq1109 .pq-board .q{color:#3f7fb5;animation:pqBreath 1.5s ease-in-out infinite;display:inline-block;}
        .pq1109 .pq-board .op{color:#8a94a2;}
        .pq1109 .pq-chip{padding:7px 16px;border-radius:999px;background:#fff;border:2px solid #bfe0c9;box-shadow:0 4px 12px rgba(0,0,0,.14);font-size:21px;font-weight:900;color:#3a4250;animation:pqChip .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1109 .pq-chip .op{color:#8a94a2;} .pq1109 .pq-chip .res{color:#1a7f43;}
        .pq1109 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq1109 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1109 .pq-opt:hover:not(:disabled){border-color:#9fc6ea;transform:translateY(-2px);}
        .pq1109 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1109 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1109 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1109 .pq-opt:disabled{cursor:default;}
        .pq1109 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1109 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1109 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqBob{0%,100%{transform:translate(0,0);}50%{transform:translate(0,-3px);}}
        @keyframes pqDrive{0%{transform:translateX(0);}50%{transform:translate(140px,-1.5px);}100%{transform:translateX(280px);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(580px);}}
        @keyframes pqLsteam{0%{opacity:0;transform:translateY(4px) scale(.5);}28%{opacity:.85;}70%{opacity:.5;}100%{opacity:0;transform:translateY(-14px) scale(1.5);}}
        @keyframes pqBlink{0%,92%,100%{transform:scaleY(1);}94%,98%{transform:scaleY(.1);}}
        @keyframes pqBubble{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-2px) scale(1.03);}}
        @keyframes pqArcIn{from{opacity:0;}to{opacity:.95;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.18);opacity:.7;}}
        @keyframes pqNine{0%{transform:scale(1);}50%{transform:scale(1.5);}100%{transform:scale(1.18);}}
        @keyframes pqSemR{0%,33%{background:#e05a4d;box-shadow:0 0 6px #e05a4d;}34%,100%{background:#2b333c;box-shadow:none;}}
        @keyframes pqSemY{0%,33%{background:#2b333c;box-shadow:none;}34%,66%{background:#ffcf3f;box-shadow:0 0 6px #ffcf3f;}67%,100%{background:#2b333c;box-shadow:none;}}
        @keyframes pqSemG{0%,66%{background:#2b333c;box-shadow:none;}67%,100%{background:#57d68a;box-shadow:0 0 6px #57d68a;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqChip{0%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.7);}100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-bird bd1" aria-hidden="true"><svg viewBox="0 0 24 10" width="15" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-bird bd2" aria-hidden="true"><svg viewBox="0 0 24 10" width="15" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-fly" aria-hidden="true"><svg viewBox="0 0 20 16" width="14" height="11"><ellipse cx="7" cy="6" rx="5" ry="4" fill="#f2b134" opacity=".72" /><ellipse cx="13" cy="6" rx="5" ry="4" fill="#e88078" opacity=".72" /><ellipse cx="7" cy="11" rx="4" ry="3" fill="#f2b134" opacity=".62" /><ellipse cx="13" cy="11" rx="4" ry="3" fill="#e88078" opacity=".62" /><rect x="9.4" y="3" width="1.2" height="10" rx="0.6" fill="#5a4632" /></svg></span>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-hill" />
        <span className="pq-tree t1"><i /><b /></span>
        <span className="pq-tree t2"><i /><b /></span>
        <div className="pq-sem"><span className="pole" /><span className="box"><span className="lmp r" /><span className="lmp y" /><span className="lmp g" /></span></div>

        {!ok && <div className="pq-board"><span>{DATA.a}</span><span className="op">+</span><span>{DATA.b}</span><span className="op">=</span><b className="q">?</b></div>}
        {ok && <div className="pq-chip"><span>{DATA.a}</span><span className="op">+</span><span>{DATA.b}</span><span className="op">=</span><span>{DATA.b}</span><span className="op">+</span><span>{DATA.a}</span><span className="op">=</span><span className="res">{DATA.target}</span></div>}

        <div className="pq-nlwrap">
          <svg className="pq-nl" viewBox="0 0 460 156" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            {/* rels */}
            <rect x="14" y={RAILY - 2} width="432" height="3.5" rx="1.6" fill="#c9cede" />
            <rect x="14" y={RAILY + 4} width="432" height="3.5" rx="1.6" fill="#8b93a3" />
            {Array.from({ length: 21 }).map((_, i) => (
              <rect key={i} x={22 + i * 21} y={RAILY - 3} width="5" height="11" rx="1.5" fill="#a98050" opacity=".5" />
            ))}

            {/* bekatlar 0..10: shtrix + son; 7-boshlanish (amber), 9-natija (yashil, ok) */}
            {Array.from({ length: 11 }).map((_, i) => {
              const x = xAt(i);
              const isStart = i === 2, isRes = i === 9;
              return (
                <g key={i}>
                  <line x1={x} y1={RAILY - 6} x2={x} y2={RAILY + 12} stroke="#7a8496" strokeWidth="2" strokeLinecap="round" />
                  {isStart && <circle cx={x} cy={RAILY + 30} r="12.5" fill="#fde4a6" stroke="#eab54c" strokeWidth="2" />}
                  {isRes && ok && <circle className="pq-nine" cx={x} cy={RAILY + 30} r="13" fill="#d3f2df" stroke="#4bab68" strokeWidth="2.4" />}
                  <text x={x} y={RAILY + 35} textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="Manrope, system-ui, sans-serif"
                    fill={isRes && ok ? '#1a7f43' : isStart ? '#b47f16' : '#5a6577'}>{i}</text>
                </g>
              );
            })}

            {/* to'g'ri javobda: 2 dan 9 gacha yurish yo'li (dashed) + 7 qadam sanoq-badge (1..7) har bekatda */}
            {ok && (
              <g>
                <path className="pq-path" d={`M${xAt(2)} ${RAILY - 12} L${xAt(9)} ${RAILY - 12}`} />
                {Array.from({ length: B }).map((_, k) => {
                  const st = 3 + k; // bekat 3..9
                  return (
                    <g key={k} className="pq-step" style={{ animationDelay: `${0.5 + k * (2 / B)}s` }}>
                      <circle cx={xAt(st)} cy={RAILY - 30} r="9.5" fill={st === 9 ? '#1a7f43' : '#2563eb'} stroke="#fff" strokeWidth="2" />
                      <text x={xAt(st)} y={RAILY - 26} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{k + 1}</text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* boshlanish belgisi «+ 7» — 2-bekatda (javobni oshkor qilmaydi) */}
            {!ok && (
              <g className="pq-bubble">
                <rect x={xAt(2) - 24} y={RAILY - 82} width="48" height="25" rx="9" fill="#ffffff" stroke="#c3d3e6" strokeWidth="1.6" />
                <path d={`M${xAt(2) - 4} ${RAILY - 57} L${xAt(2) + 4} ${RAILY - 57} L${xAt(2)} ${RAILY - 49} Z`} fill="#ffffff" stroke="#c3d3e6" strokeWidth="1.2" />
                <text x={xAt(2)} y={RAILY - 64} textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="Manrope, system-ui, sans-serif" fill="#3f7fb5">+ {DATA.b}</text>
              </g>
            )}

            {/* lokomotiv — 2-bekatdan; to'g'ri javobda YURIB (280px = 7 bekat) 9 ga keladi */}
            <g transform={`translate(${baseX} ${RAILY - 9})`}>
              <g className={locoCls}><Loco /></g>
            </g>
          </svg>
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
