// Dars11 · Amaliyot 01 — P7 qo'shish / o'rin almashtirish (spiral: Dars10 takrori, 10 ichida) · 🟢 · tag: sum_warmup
// Poyezd bekati: lokomotiv + 4 qizil + 3 ko'k vagon (jami 7). Vagonlar birin-ketin kiradi; g'alabada badge 1..7 + chip «4 + 3 = 7».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const RED = 4, BLUE = 3, TOTAL = RED + BLUE; // 7
const CARS = [
  ...Array.from({ length: RED }, () => ({ main: '#d9534b', dark: '#b23b30', roof: '#e88078', win: '#fbe1de' })),
  ...Array.from({ length: BLUE }, () => ({ main: '#4f8fc4', dark: '#33648f', roof: '#7fb0dc', win: '#dcecf8' })),
];
const DATA = { a: RED, b: BLUE, target: TOTAL, options: [6, 7, 8], ptype: 'P7', level: '🟢', tag: 'sum_warmup' };

const T = {
  uz: {
    eyebrow: "Poyezd bekati · Vagonlar", title: "Nechta vagon?",
    setup: "Bolalar poyezdda sayohatga chiqishdi! Poyezdda to'rtta qizil va uchta ko'k vagon bor.",
    ask: "Poyezdda jami nechta vagon bor?",
    correct: "Barakalla! To'rt va uch — yetti vagon.",
    hint: "Avval qizil vagonlarni, keyin ko'k vagonlarni qo'shib sanang.",
  },
  ru: {
    eyebrow: "Вокзал · Вагоны", title: "Сколько вагонов?",
    setup: "Дети отправились в путешествие на поезде! В поезде четыре красных и три синих вагона.",
    ask: "Сколько всего вагонов в поезде?",
    correct: "Молодец! Четыре и три — семь вагонов.",
    hint: "Сначала посчитай красные вагоны, потом синие и сложи.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Spitsali g'ildirak — o'z markazi atrofida sekin aylanadi (CSS pqSpin).
const Wheel = ({ cx, cy, r = 8 }) => (
  <g className="pq-wheel">
    <circle cx={cx} cy={cy} r={r} fill="#33383f" stroke="#1c1f25" strokeWidth="1.6" />
    <circle cx={cx} cy={cy} r={r * 0.44} fill="#c9cede" stroke="#1c1f25" strokeWidth="1" />
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 0.82} stroke="#727a89" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${i * 60} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r="1.7" fill="#1c1f25" />
  </g>
);

// LOKOMOTIV (old tomon chapda): old chiroq, mo'ri (bug'), kabina (deraza + mashinist boshi), 3 g'ildirak.
const Loco = () => (
  <svg viewBox="0 -20 118 98" width="86" height="71" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    {/* bug' (mo'ridan) */}
    <circle className="pq-lsteam" cx="27" cy="4" r="4.5" fill="rgba(255,255,255,.9)" />
    <circle className="pq-lsteam s2" cx="30" cy="-5" r="5.5" fill="rgba(255,255,255,.85)" />
    <circle className="pq-lsteam s3" cx="26" cy="-14" r="6.5" fill="rgba(255,255,255,.8)" />
    {/* shassi */}
    <rect x="6" y="55" width="106" height="9" rx="3" fill="#2f333b" />
    {/* kabina (orqada, baland) */}
    <rect x="60" y="6" width="50" height="52" rx="9" fill="#3f9a5c" stroke="#2c6f42" strokeWidth="2" />
    <rect x="55" y="6" width="60" height="9" rx="4" fill="#2c6f42" />
    {/* deraza + mashinist */}
    <rect x="72" y="21" width="30" height="23" rx="5" fill="#cfe7f6" stroke="#2c6f42" strokeWidth="2" />
    <circle cx="87" cy="35" r="8.5" fill="#f1c9a5" />
    <path d="M78.5 32 Q87 22 95.5 32 Z" fill="#d9534b" />
    <rect x="78.5" y="30.5" width="17" height="3.4" rx="1.7" fill="#b23b30" />
    <g className="pq-lblink"><circle cx="84" cy="35.5" r="1.5" fill="#2f2118" /><circle cx="90" cy="35.5" r="1.5" fill="#2f2118" /></g>
    <path d="M84 40 Q87 42 90 40" stroke="#b06a4a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* qozon (old) */}
    <rect x="8" y="30" width="56" height="28" rx="13" fill="#4bab68" stroke="#2c6f42" strokeWidth="2" />
    <rect x="8" y="30" width="56" height="10" rx="8" fill="#5cbd79" opacity=".7" />
    <line x1="26" y1="31" x2="26" y2="57" stroke="#2c6f42" strokeWidth="1.6" opacity=".5" />
    <line x1="46" y1="31" x2="46" y2="57" stroke="#2c6f42" strokeWidth="1.6" opacity=".5" />
    {/* mo'ri */}
    <rect x="21" y="10" width="13" height="22" rx="2" fill="#37414c" stroke="#242c34" strokeWidth="1.6" />
    <rect x="18" y="7" width="19" height="6" rx="3" fill="#2b333c" />
    {/* gumbaz */}
    <path d="M42 30 a7 7 0 0 1 14 0 Z" fill="#37414c" />
    {/* old chiroq */}
    <circle cx="13" cy="44" r="6" fill="#ffe08a" stroke="#e0a92e" strokeWidth="2" />
    <circle cx="13" cy="44" r="2.4" fill="#fff6cf" />
    {/* qo'shqich (o'ngda, vagonga) */}
    <rect x="110" y="48" width="8" height="5" rx="2" fill="#2f333b" />
    {/* g'ildiraklar */}
    <Wheel cx={30} cy={62} r={11} />
    <Wheel cx={62} cy={62} r={11} />
    <Wheel cx={92} cy={64} r={8} />
  </svg>
);

// VAGON — rangli tana, deraza(lar), 2 g'ildirak, chapda qo'shqich. Bitta vagon = bitta dona.
const Wagon = ({ c }) => (
  <svg viewBox="-4 0 68 74" width="52" height="57" aria-hidden="true" style={{ display: 'block' }}>
    {/* qo'shqich (oldingi vagonga) */}
    <rect x="-4" y="42" width="8" height="5" rx="2" fill="#2f333b" />
    {/* shassi */}
    <rect x="4" y="46" width="56" height="8" rx="3" fill="#2f333b" />
    {/* tana */}
    <rect x="4" y="11" width="56" height="36" rx="9" fill={c.main} stroke={c.dark} strokeWidth="2" />
    <rect x="4" y="11" width="56" height="10" rx="7" fill={c.roof} opacity=".85" />
    {/* derazalar */}
    <rect x="13" y="24" width="16" height="15" rx="3.5" fill={c.win} stroke={c.dark} strokeWidth="1.8" />
    <rect x="35" y="24" width="16" height="15" rx="3.5" fill={c.win} stroke={c.dark} strokeWidth="1.8" />
    <line x1="21" y1="25" x2="21" y2="38" stroke={c.dark} strokeWidth="1.1" opacity=".45" />
    <line x1="43" y1="25" x2="43" y2="38" stroke={c.dark} strokeWidth="1.1" opacity=".45" />
    {/* g'ildiraklar */}
    <Wheel cx={19} cy={58} r={8} />
    <Wheel cx={45} cy={58} r={8} />
  </svg>
);

export default function D11_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda vagon-kirish qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq1101">
      <style>{`
        .pq1101{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1101 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7fb5;text-transform:uppercase;}
        .pq1101 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1101 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1101 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1101 .pq-scene{position:relative;width:100%;max-width:520px;height:216px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafb 0%,#e4f4ff 52%,#eaf7e4 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq1101 .pq-sun{position:absolute;top:14px;left:22px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq1101 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq1101 .pq-cloud.c1{top:24px;left:-70px;animation-duration:34s;}
        .pq1101 .pq-cloud.c2{top:52px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:46s;animation-delay:-22s;}
        .pq1101 .pq-bird{position:absolute;z-index:0;color:#7c869a;opacity:.72;line-height:0;animation:pq1101Bird linear infinite;}
        .pq1101 .pq-bird svg{display:block;}
        .pq1101 .pq-bird.bd1{top:40px;left:-24px;animation-duration:27s;}
        .pq1101 .pq-bird.bd2{top:66px;left:-24px;animation-duration:36s;animation-delay:-14s;}
        .pq1101 .pq-bird.bd2 svg{width:12px;height:6px;}
        .pq1101 .pq-fly{position:absolute;z-index:0;left:30px;top:92px;line-height:0;animation:pq1101Fly 3.8s ease-in-out infinite;}
        .pq1101 .pq-scene.still .pq-bird,.pq1101 .pq-scene.still .pq-fly{animation:none;}
        @keyframes pq1101Bird{from{transform:translateX(0);}to{transform:translateX(560px);}}
        @keyframes pq1101Fly{0%,100%{transform:translateY(0) rotate(-5deg);}50%{transform:translateY(-9px) rotate(5deg);}}
        .pq1101 .pq-hill{position:absolute;bottom:44px;left:0;right:0;height:60px;background:radial-gradient(120px 60px at 22% 100%,#bfe4a8 0 60%,transparent 62%),radial-gradient(150px 70px at 78% 100%,#b2dd9a 0 60%,transparent 62%);opacity:.85;}
        .pq1101 .pq-tree{position:absolute;bottom:56px;width:0;height:0;}
        .pq1101 .pq-tree.t1{right:44px;} .pq1101 .pq-tree.t2{right:96px;}
        .pq1101 .pq-tree i{position:absolute;bottom:0;left:-3px;width:6px;height:16px;background:#8a5a2c;border-radius:2px;}
        .pq1101 .pq-tree b{position:absolute;bottom:12px;left:-13px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#7ec96f,#4f9a48);}
        .pq1101 .pq-tree.t2 b{background:radial-gradient(circle at 38% 34%,#8ed07f,#5cae54);width:22px;height:22px;left:-11px;}
        /* semafor */
        .pq1101 .pq-sem{position:absolute;bottom:52px;right:14px;width:14px;height:70px;z-index:4;}
        .pq1101 .pq-sem .pole{position:absolute;bottom:0;left:5px;width:4px;height:70px;background:linear-gradient(#8a94a6,#5f6a7c);border-radius:2px;}
        .pq1101 .pq-sem .box{position:absolute;top:0;left:0;width:14px;height:34px;border-radius:5px;background:#37414c;border:1.5px solid #232a32;padding:3px 0;display:flex;flex-direction:column;align-items:center;justify-content:space-around;}
        .pq1101 .pq-sem .lmp{width:7px;height:7px;border-radius:50%;background:#2b333c;}
        .pq1101 .pq-sem .lmp.r{animation:pqSemR 3s steps(1) infinite;}
        .pq1101 .pq-sem .lmp.y{animation:pqSemY 3s steps(1) infinite;}
        .pq1101 .pq-sem .lmp.g{animation:pqSemG 3s steps(1) infinite;}
        /* poyezd yo'lagi */
        .pq1101 .pq-trackwrap{position:absolute;left:0;right:0;bottom:0;height:120px;overflow-x:auto;overflow-y:hidden;display:flex;align-items:flex-end;}
        .pq1101 .pq-track{position:relative;min-width:max-content;margin:0 auto;padding:0 14px 0 8px;}
        .pq1101 .pq-rails{position:absolute;left:0;right:0;bottom:8px;height:20px;z-index:0;}
        .pq1101 .pq-rails::before,.pq1101 .pq-rails::after{content:'';position:absolute;left:0;right:0;height:3px;background:linear-gradient(#c9cede,#8b93a3);border-radius:2px;}
        .pq1101 .pq-rails::before{top:6px;} .pq1101 .pq-rails::after{top:13px;}
        .pq1101 .pq-sleepers{position:absolute;left:-30px;right:-30px;bottom:8px;height:20px;background:repeating-linear-gradient(90deg,transparent 0 14px,#a9805090 14px 20px);z-index:0;animation:pqFlow .9s linear infinite;}
        .pq1101 .pq-scene.still .pq-sleepers{animation:none;}
        .pq1101 .pq-train{position:relative;z-index:2;display:flex;align-items:flex-end;gap:3px;padding-bottom:10px;}
        .pq1101 .pq-car{position:relative;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));animation:pqCarIn .5s cubic-bezier(.3,1.1,.5,1) both;animation-delay:var(--d,0s);}
        .pq1101 .pq-scene.still .pq-car{animation:none;}
        .pq1101 .pq-carbob{display:block;animation:pqBob 2.7s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1101 .pq-wheel{transform-box:fill-box;transform-origin:center;animation:pqSpin 1.7s linear infinite;}
        .pq1101 .pq-lsteam{transform-box:fill-box;transform-origin:center;opacity:0;animation:pqLsteam 3.4s ease-in-out infinite;}
        .pq1101 .pq-lsteam.s2{animation-delay:-1.1s;} .pq1101 .pq-lsteam.s3{animation-delay:-2.2s;}
        .pq1101 .pq-lblink{opacity:1;animation:pqBlink 4s linear infinite;}
        .pq1101 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .32s ease both;z-index:5;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq1101 .pq-chip{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:6;display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:999px;background:#fff;border:2px solid #bfe0c9;box-shadow:0 4px 12px rgba(0,0,0,.14);font-size:22px;font-weight:900;color:#3a4250;font-variant-numeric:tabular-nums;animation:pqChip .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1101 .pq-chip .op{color:#8a94a2;} .pq1101 .pq-chip .res{color:#1a7f43;}
        .pq1101 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq1101 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1101 .pq-opt:hover:not(:disabled){border-color:#9fc6ea;transform:translateY(-2px);}
        .pq1101 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1101 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1101 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1101 .pq-opt:disabled{cursor:default;}
        .pq1101 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1101 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1101 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(-360deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(600px);}}
        @keyframes pqFlow{from{background-position:0 0;}to{background-position:20px 0;}}
        @keyframes pqCarIn{0%{opacity:0;transform:translateX(34px) scale(.9);}100%{opacity:1;transform:translateX(0) scale(1);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqLsteam{0%{opacity:0;transform:translateY(4px) scale(.5);}28%{opacity:.85;}70%{opacity:.5;}100%{opacity:0;transform:translateY(-14px) scale(1.5);}}
        @keyframes pqBlink{0%,92%,100%{opacity:1;}94%,98%{opacity:0;}}
        @keyframes pqSemR{0%,33%{background:#e05a4d;box-shadow:0 0 6px #e05a4d;}34%,100%{background:#2b333c;box-shadow:none;}}
        @keyframes pqSemY{0%,33%{background:#2b333c;box-shadow:none;}34%,66%{background:#ffcf3f;box-shadow:0 0 6px #ffcf3f;}67%,100%{background:#2b333c;box-shadow:none;}}
        @keyframes pqSemG{0%,66%{background:#2b333c;box-shadow:none;}67%,100%{background:#57d68a;box-shadow:0 0 6px #57d68a;}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqChip{0%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.7);}100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        <span className="pq-bird bd1" aria-hidden="true"><svg viewBox="0 0 24 10" width="15" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-bird bd2" aria-hidden="true"><svg viewBox="0 0 24 10" width="15" height="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-fly" aria-hidden="true"><svg viewBox="0 0 20 16" width="15" height="12"><ellipse cx="7" cy="6" rx="5" ry="4" fill="#f2b134" opacity=".75" /><ellipse cx="13" cy="6" rx="5" ry="4" fill="#e88078" opacity=".75" /><ellipse cx="7" cy="11" rx="4" ry="3" fill="#f2b134" opacity=".65" /><ellipse cx="13" cy="11" rx="4" ry="3" fill="#e88078" opacity=".65" /><rect x="9.4" y="3" width="1.2" height="10" rx="0.6" fill="#5a4632" /></svg></span>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-hill" />
        <span className="pq-tree t1"><i /><b /></span>
        <span className="pq-tree t2"><i /><b /></span>
        <div className="pq-sem"><span className="pole" /><span className="box"><span className="lmp r" /><span className="lmp y" /><span className="lmp g" /></span></div>

        {ok && <div className="pq-chip"><span>{DATA.a}</span><span className="op">+</span><span>{DATA.b}</span><span className="op">=</span><span className="res">{DATA.target}</span></div>}

        <div className="pq-trackwrap">
          <div className="pq-track">
            <span className="pq-sleepers" />
            <div className="pq-rails" />
            <div className="pq-train">
              <span className="pq-car" style={{ '--d': '0s' }}><span className="pq-carbob"><Loco /></span></span>
              {CARS.map((c, i) => (
                <span key={i} className="pq-car" style={{ '--d': `${0.28 + i * 0.13}s` }}>
                  <span className="pq-carbob" style={{ '--bd': `-${i * 0.55}s` }}>
                    <Wagon c={c} />
                    {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.09}s` }}>{i + 1}</b>}
                  </span>
                </span>
              ))}
            </div>
          </div>
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
