// Dars11 · Amaliyot 02 — P11 O'rin almashtirish «Poyezd bekati» · 🟡 · tag: swap_same
// Ikki qator poyezd: 3 qizil + 2 ko'k vagon («3 + 2») va aynan shu vagonlar almashgan holda
// 2 ko'k + 3 qizil («2 + 3»). Almashsa ham jami — besh. O'rtada «=» breath, g'alabada 1..5 badge.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TOP = ['r', 'r', 'r', 'b', 'b']; // 3 qizil + 2 ko'k
const BOT = ['b', 'b', 'r', 'r', 'r']; // orqaga qaytdi: 2 ko'k + 3 qizil
const COL = {
  r: { body: '#d9534b', roof: '#b23b32', band: '#e8837c', glass: '#ffe1dc' },
  b: { body: '#4f8fc4', roof: '#396f9f', band: '#7fb0d8', glass: '#e0f0fb' },
};
const DATA = { a: 3, b: 2, target: 5, options: [4, 5, 6], ptype: 'P11', level: '🟡', tag: 'swap_same' };

const T = {
  uz: {
    eyebrow: "Poyezd bekati · Almashtirish", title: "O'rin almashtirish",
    setup: "Poyezdda uchta qizil va ikkita ko'k vagon bor. Poyezd orqaga qaytdi — endi ikkita ko'k, keyin uchta qizil!",
    ask: "Vagonlar o'rin almashdi. Jami nechta vagon qoldi?",
    correct: "Barakalla! Uch qo'shuv ikki yoki ikki qo'shuv uch — baribir besh! O'rin almashsa, jami o'zgarmaydi.",
    hint: "Ikkala poyezdni ham sanang: vagonlar joyi o'zgardi, lekin soni-chi?",
  },
  ru: {
    eyebrow: "Станция · Перестановка", title: "Перестановка",
    setup: "В поезде три красных и два синих вагона. Поезд поехал назад — теперь два синих, потом три красных!",
    ask: "Вагоны поменялись местами. Сколько всего вагонов осталось?",
    correct: "Молодец! Три плюс два или два плюс три — всё равно пять! От перестановки сумма не меняется.",
    hint: "Посчитай оба поезда: вагоны поменяли места, а сколько их?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Spitsali g'ildirak — o'z markazi atrofida sekin aylanadi (transform-box:fill-box).
const Wheel = ({ cx, cy, r = 6.5 }) => (
  <g className="pq-wheel">
    <circle cx={cx} cy={cy} r={r} fill="#2f333c" stroke="#14171d" strokeWidth={r * 0.28} />
    {[0, 45, 90, 135].map((a) => (
      <line key={a} x1={cx} y1={cy - r * 0.72} x2={cx} y2={cy + r * 0.72} stroke="#6b7280" strokeWidth={r * 0.18} transform={`rotate(${a} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.34} fill="#8b93a0" stroke="#5a616e" strokeWidth="1" />
    <circle cx={cx} cy={cy} r={r * 0.12} fill="#3a3f49" />
  </g>
);

// LOKOMOTIV (chapga qaragan, old tomonda): dumaloq old chiroq, mo'ri (bug' chiqadi), kabina
// (deraza + mashinist boshi, ko'z pirpiratadi), boyler-dome, 2 katta + 1 kichik spitsali g'ildirak.
const Loco = () => (
  <svg viewBox="0 -14 100 76" width="58" height="44" className="pq-locosvg" aria-hidden="true">
    {/* bug' */}
    <circle className="pq-steam s1" cx="31" cy="6" r="4" fill="#ffffff" opacity="0" />
    <circle className="pq-steam s2" cx="34" cy="0" r="5" fill="#ffffff" opacity="0" />
    <circle className="pq-steam s3" cx="29" cy="-6" r="6" fill="#f4f7fb" opacity="0" />
    {/* rom + kotguvchi (cowcatcher) */}
    <polygon points="8,46 20,46 12,60" fill="#33475c" />
    <rect x="12" y="47" width="78" height="6" rx="2" fill="#272c34" />
    {/* boyler */}
    <rect x="16" y="24" width="50" height="24" rx="11" fill="#46617c" stroke="#33475c" strokeWidth="2" />
    <ellipse cx="17" cy="36" rx="3.4" ry="11" fill="#38506a" />
    <line x1="38" y1="25" x2="38" y2="47" stroke="#33475c" strokeWidth="1.4" opacity=".5" />
    <line x1="50" y1="25" x2="50" y2="47" stroke="#33475c" strokeWidth="1.4" opacity=".5" />
    {/* old chiroq */}
    <circle cx="21" cy="30" r="6.4" fill="#fff2b0" opacity=".55" />
    <circle cx="21" cy="30" r="4.4" fill="#ffe067" stroke="#d9a93a" strokeWidth="1.4" />
    <circle cx="19.4" cy="28.4" r="1.3" fill="#fff8dc" />
    {/* mo'ri + dome */}
    <path d="M26 24 L36 24 L34 12 L28 12 Z" fill="#35485c" />
    <rect x="25" y="9.5" width="12" height="3.6" rx="1.4" fill="#2b3a4b" />
    <path d="M45 24 Q52 12 59 24 Z" fill="#35485c" />
    {/* kabina */}
    <rect x="58" y="14" width="30" height="34" rx="6" fill="#3c5470" stroke="#2b3a4b" strokeWidth="2" />
    <rect x="55" y="10" width="36" height="7" rx="3" fill="#2b3a4b" />
    <rect x="63" y="34" width="22" height="11" rx="3" fill="#33465c" />
    {/* deraza + mashinist */}
    <rect x="63" y="19" width="20" height="15" rx="3" fill="#cfe8f5" stroke="#2b3a4b" strokeWidth="1.6" />
    <circle cx="73" cy="28.5" r="6" fill="#edb98c" />
    <path d="M67 27.5 Q73 18.5 79 27.5 Z" fill="#d9534b" />
    <rect x="66.5" y="26.6" width="13" height="2" rx="1" fill="#b23b32" />
    <circle cx="70.6" cy="28.6" r="1.05" fill="#2b2f38" /><circle cx="75.4" cy="28.6" r="1.05" fill="#2b2f38" />
    <g className="pq-blink"><rect x="69.4" y="27.4" width="2.4" height="2.4" rx="1" fill="#edb98c" /><rect x="74.2" y="27.4" width="2.4" height="2.4" rx="1" fill="#edb98c" /></g>
    <path d="M71 31.4 Q73 33 75 31.4" stroke="#a9663f" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* qo'shqich */}
    <rect x="88" y="43" width="7" height="4" rx="1.5" fill="#5a616e" />
    {/* g'ildiraklar */}
    <Wheel cx={18} cy={53} r={5} />
    <Wheel cx={36} cy={52} r={9} />
    <Wheel cx={56} cy={52} r={9} />
    <line x1="36" y1="52" x2="56" y2="52" stroke="#5a616e" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
  </svg>
);

// VAGON: rangli yumaloq-to'rtburchak tana (2-3 ton), tom, ikki deraza, 2 spitsali g'ildirak,
// ikki tomonda qo'shqich. Bitta vagon = bitta dona (sanash uchun).
const Wagon = ({ c }) => (
  <svg viewBox="0 0 54 60" width="44" height="49" className="pq-wagsvg" aria-hidden="true">
    <rect x="0" y="45" width="6" height="4" rx="1.5" fill="#5a616e" />
    <rect x="48" y="45" width="6" height="4" rx="1.5" fill="#5a616e" />
    <rect x="4" y="46" width="46" height="6" rx="2" fill="#272c34" />
    <rect x="5" y="16" width="44" height="32" rx="6" fill={c.body} stroke={c.roof} strokeWidth="2" />
    <rect x="6" y="30" width="42" height="8" fill={c.band} opacity=".5" />
    <rect x="2.5" y="11" width="49" height="9" rx="4" fill={c.roof} />
    <rect x="4" y="12" width="46" height="2.6" rx="1.3" fill="#ffffff" opacity=".2" />
    <rect x="11" y="21" width="13" height="10" rx="2.5" fill={c.glass} stroke={c.roof} strokeWidth="1.4" />
    <rect x="30" y="21" width="13" height="10" rx="2.5" fill={c.glass} stroke={c.roof} strokeWidth="1.4" />
    <line x1="12" y1="24.5" x2="23" y2="24.5" stroke="#ffffff" strokeWidth="1" opacity=".55" />
    <Wheel cx={16} cy={53} r={6.5} />
    <Wheel cx={38} cy={53} r={6.5} />
  </svg>
);

export default function D11_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda o'rin-almashtirish qayta ijro etilmaydi — statik holat.
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

  const renderTrain = (arr, side) => (
    <div className={'pq-train ' + side}>
      <span className="pq-rail"><span className="pq-sleepers" /></span>
      <div className="pq-cars">
        <span className={'pq-loco' + (ok ? ' win' : '')}><Loco /></span>
        {arr.map((k, i) => (
          <span key={i} className="pq-wag" style={{ animationDelay: `${0.15 + i * 0.11}s` }}>
            <Wagon c={COL[k]} />
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.1}s` }}>{i + 1}</b>}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pq pq1102">
      <style>{`
        .pq1102{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1102 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c26a2b;text-transform:uppercase;}
        .pq1102 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1102 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1102 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1102 .pq-scene{position:relative;width:384px;max-width:100%;margin:0 auto;padding:10px 10px 8px;border-radius:22px;background:linear-gradient(#d5ecfb 0%,#e6f4fd 46%,#eef7ea 100%);border:2px solid #c4dff0;overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:2px;}
        .pq1102 .pq-sun{position:absolute;top:12px;right:16px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:0;}
        .pq1102 .pq-cloud{position:absolute;width:46px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:14px 5px 0 -4px #fff,-13px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq1102 .pq-cloud.c1{top:14px;left:-60px;animation-duration:34s;}
        .pq1102 .pq-cloud.c2{top:40px;left:-60px;width:34px;height:11px;opacity:.7;animation-duration:46s;animation-delay:-22s;}
        .pq1102 .pq-sem{position:absolute;right:8px;bottom:12px;width:16px;height:74px;z-index:1;}
        .pq1102 .pq-sempost{position:absolute;left:6px;bottom:0;width:4px;height:74px;border-radius:2px;background:linear-gradient(#9aa2ae,#727a86);}
        .pq1102 .pq-semhead{position:absolute;left:0;top:0;width:16px;height:34px;border-radius:6px;background:#3a4250;border:1.5px solid #262c36;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:3px 0;}
        .pq1102 .pq-lamp{width:8px;height:8px;border-radius:50%;}
        .pq1102 .pq-lamp.red{background:#e0554a;box-shadow:0 0 5px #e0554a;animation:pqLampA 2.6s steps(1,end) infinite;}
        .pq1102 .pq-lamp.green{background:#54c07a;box-shadow:0 0 5px #54c07a;animation:pqLampB 2.6s steps(1,end) infinite;}
        .pq1102 .pq-expr{position:relative;z-index:2;font-size:15px;font-weight:900;color:#425064;background:rgba(255,255,255,.82);padding:2px 12px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 1px 2px rgba(0,0,0,.06);}
        .pq1102 .pq-expr .pq-op{font-style:normal;color:#1a7f43;margin:0 2px;}
        .pq1102 .pq-train{position:relative;z-index:2;width:322px;max-width:100%;height:56px;margin-top:1px;}
        .pq1102 .pq-ground{position:absolute;left:0;right:0;top:38px;bottom:0;z-index:0;background:linear-gradient(#cdeab0 0%,#b4dd92 46%,#a2d17f 100%);}
        .pq1102 .pq-ground::before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:#8fbf6b;}
        .pq1102 .pq-rail{position:absolute;left:-60px;right:-60px;bottom:2px;height:9px;z-index:1;}
        .pq1102 .pq-rail::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;border-radius:2px;background:linear-gradient(#e0e6ee,#9aa4b4);}
        .pq1102 .pq-sleepers{position:absolute;left:0;right:0;top:0;height:6px;background:repeating-linear-gradient(90deg,#7c5a34 0 6px,transparent 6px 15px);opacity:.9;animation:pqRailMove 1.15s linear infinite;}
        .pq1102 .pq-cars{position:absolute;left:0;right:0;bottom:5px;display:flex;align-items:flex-end;justify-content:center;gap:3px;line-height:0;}
        .pq1102 .pq-loco{line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqRollIn .5s ease both;}
        .pq1102 .pq-loco.win{animation:pqCele .55s ease;}
        .pq1102 .pq-wag{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1102 .pq-train.top .pq-wag{animation:pqDrop .5s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1102 .pq-train.bot .pq-wag{animation:pqSwapIn .55s cubic-bezier(.3,1.15,.5,1) both;}
        .pq1102 .pq-train.top{animation:pqChug 2s ease-in-out .6s infinite;}
        .pq1102 .pq-train.bot{animation:pqChug 2.2s ease-in-out .9s infinite;}
        .pq1102 .pq-scene.still .pq-train{animation:none;}
        .pq1102 .pq-scene.still .pq-wag,.pq1102 .pq-scene.still .pq-loco{animation:none;}
        .pq1102 .pq-cnt{position:absolute;top:-7px;right:-3px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1102 .pq-wheel{transform-box:fill-box;transform-origin:center;animation:pqSpin 2.4s linear infinite;}
        .pq1102 .pq-steam{transform-box:fill-box;animation:pqSteam 3s ease-in infinite;}
        .pq1102 .pq-steam.s2{animation-delay:-1s;} .pq1102 .pq-steam.s3{animation-delay:-2s;}
        .pq1102 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq1102 .pq-eqbig{position:relative;z-index:2;font-size:26px;font-weight:900;color:#8a6a3a;margin:1px 0;animation:pqEq 2.2s ease-in-out infinite;}
        .pq1102 .pq-sum{display:flex;align-items:center;justify-content:center;gap:8px;margin:14px auto 0;padding:8px 16px;width:max-content;max-width:100%;border-radius:14px;background:#fbf7ef;border:2px solid #efe6d4;font-size:21px;font-weight:900;color:#425064;font-variant-numeric:tabular-nums;flex-wrap:wrap;}
        .pq1102 .pq-sum.win{border-color:#bfe6cd;background:#eef9f1;animation:pqCele .5s ease;}
        .pq1102 .pq-sum .pq-op{color:#1a7f43;}
        .pq1102 .pq-seq{color:#b0a48f;}
        .pq1102 .pq-sres{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 6px;border-radius:9px;background:#fff;border:2px dashed #d8cdb6;color:#b8ac93;animation:pqBreath 2s ease-in-out infinite;}
        .pq1102 .pq-sres.win{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqPop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1102 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1102 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pq1102 .pq-opt:hover:not(:disabled){border-color:#f0c99a;transform:translateY(-2px);}
        .pq1102 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1102 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1102 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1102 .pq-opt:disabled{cursor:default;}
        .pq1102 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1102 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1102 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqRailMove{from{background-position:0 0;}to{background-position:15px 0;}}
        @keyframes pqChug{0%,100%{transform:translateY(0) translateX(0);}25%{transform:translateY(-2px) translateX(1.2px);}50%{transform:translateY(0) translateX(0);}75%{transform:translateY(-2px) translateX(-1.2px);}}
        @keyframes pqBallast{from{background-position:0 0;}to{background-position:18px 0;}}
        @keyframes pqSteam{0%{opacity:0;transform:translate(0,0) scale(.5);}22%{opacity:.8;}100%{opacity:0;transform:translate(-6px,-20px) scale(1.6);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqLampA{0%,45%{opacity:1;}46%,100%{opacity:.22;}}
        @keyframes pqLampB{0%,45%{opacity:.22;}46%,100%{opacity:1;}}
        @keyframes pqBlink{0%,92%{opacity:0;}94%,97%{opacity:1;}99%,100%{opacity:0;}}
        @keyframes pqEq{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.16);opacity:1;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-34px) scale(.85);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqSwapIn{0%{opacity:0;transform:translateX(56px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes pqRollIn{0%{opacity:0;transform:translateX(-30px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-ground" />
        <div className="pq-sem"><span className="pq-sempost" /><div className="pq-semhead"><span className="pq-lamp red" /><span className="pq-lamp green" /></div></div>

        <span className="pq-expr">3 <i className="pq-op">+</i> 2</span>
        {renderTrain(TOP, 'top')}
        <span className="pq-eqbig">=</span>
        <span className="pq-expr">2 <i className="pq-op">+</i> 3</span>
        {renderTrain(BOT, 'bot')}
      </div>

      <div className={'pq-sum' + (ok ? ' win' : '')}>
        <span>3 <b className="pq-op">+</b> 2</span>
        <b className="pq-seq">=</b>
        <span>2 <b className="pq-op">+</b> 3</span>
        <b className="pq-seq">=</b>
        <span className={'pq-sres' + (ok ? ' win' : '')}>{ok ? DATA.target : '?'}</span>
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
