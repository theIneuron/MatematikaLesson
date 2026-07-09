// Dars11 · Amaliyot 07 — LOGIC «Ko'zgu naqsh» · 🔴 · tag: logic_symmetry
// Yangi mantiq turi: SIMMETRIYA. Poyezd bezak-paneli, o'rtada vertikal ko'zgu o'qi. Chap yarmda
// naqsh (qizil-ko'k-sariq, o'qqa qarab); o'ng yarm — «?». Vertikal o'q → ranglar tartibi TESKARI
// (chap: R,B,Y  →  o'ng: Y,B,R), ikki eng ichki katak bir xil bo'lib o'qda uchrashadi (kapalak-effekt).
// Tanlangan naqsh panel o'ng yarmiga darhol qo'yiladi (bola simmetriyani ko'radi); to'g'rida yashil.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Rang palitrasi (vagon-kanon ranglar): {f: to'ldirish, s: kontur}.
const C = {
  R: { f: '#d9534b', s: '#a23a33' },
  B: { f: '#4f8fc4', s: '#33648f' },
  Y: { f: '#f2b134', s: '#c98a1e' },
  G: { f: '#57a84f', s: '#3c7a37' },
};
const LEFT = [C.R, C.B, C.Y];   // chap yarm (o'qqa qarab: R,B,Y — Y o'qqa eng yaqin)
// 3 nomzod (o'ng yarm, o'qdan tashqariga: [0]=o'qqa yaqin). To'g'ri = chapning teskarisi.
const CARDS = [
  [C.R, C.B, C.Y], // ✗ aynan nusxa (chap bilan bir xil — simmetriya emas, ko'chirma)
  [C.Y, C.B, C.R], // ✓ ko'zgu aksi (tartib teskari)
  [C.Y, C.B, C.G], // ✗ rang xato (eng chekka katak yashil — qizil bo'lishi kerak edi)
];
const CORRECT = 1;

const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_symmetry' };
const T = {
  uz: {
    eyebrow: 'Poyezd bekati · Simmetriya', title: "Ko'zgu naqsh",
    setup: "Poyezd bezagi simmetrik: o'ng yarmi chap yarmning ko'zgudagi aksi bo'lishi kerak.",
    ask: "O'ng yarmiga qaysi naqsh mos keladi?",
    correct: "Barakalla! O'ng yarmi chapning aynan ko'zgu aksi — naqsh simmetrik!",
    hint: "Chap yarmga qarang: ko'zguda qanday ko'rinadi? Ranglar tartibi teskari bo'ladi.",
    ribbon: 'Poyezd bezagi', mirror: "ko'zgu",
    opts: ['1-naqsh', '2-naqsh', '3-naqsh'],
  },
  ru: {
    eyebrow: 'Вокзал · Симметрия', title: 'Зеркальный узор',
    setup: 'Украшение поезда симметрично: правая половина должна быть зеркальным отражением левой.',
    ask: 'Какой узор подходит для правой половины?',
    correct: 'Молодец! Правая половина — точное зеркальное отражение левой. Узор симметричный!',
    hint: 'Посмотри на левую половину: как она выглядит в зеркале? Порядок цветов меняется на обратный.',
    ribbon: 'Украшение поезда', mirror: 'зеркало',
    opts: ['узор 1', 'узор 2', 'узор 3'],
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// G'ILDIRAK: spitsali temir g'ildirak — obod, kuloq, 6 spitsa. Sekin aylanadi (harakat hissi).
const Wheel = ({ cx, cy, r }) => (
  <g className="pq-wheel" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
    <circle cx={cx} cy={cy} r={r} fill="#2f3543" stroke="#171b23" strokeWidth="1.6" />
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 0.82} stroke="#7c869a" strokeWidth="1.5" transform={`rotate(${i * 60} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.42} fill="#c9d2df" stroke="#171b23" strokeWidth="1.1" />
    <circle cx={cx} cy={cy} r={r * 0.15} fill="#5a6577" />
  </g>
);

// LOKOMOTIV KANONI (yon, chapga qaragan): old chiroq + mo'ri (bug') + kabina (deraza+mashinist) + 3 g'ildirak.
const Locomotive = () => (
  <svg viewBox="0 0 96 62" width="72" height="47" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <rect x="8" y="44" width="82" height="6" rx="2" fill="#3a4152" />
    <rect x="12" y="26" width="46" height="20" rx="10" fill="#54617a" stroke="#2f3543" strokeWidth="2" />
    <rect x="14" y="28" width="42" height="5" rx="2.5" fill="#63708a" />
    <circle cx="16" cy="36" r="9.5" fill="#3c4557" stroke="#2f3543" strokeWidth="1.6" />
    <circle cx="16" cy="36" r="4" fill="#4f5b70" />
    <rect x="20" y="37" width="36" height="3.4" rx="1.7" fill="#f2b134" />
    <circle cx="10.5" cy="31" r="3.6" fill="#ffe9a8" stroke="#d9b34e" strokeWidth="1.3" />
    <circle cx="10.5" cy="31" r="1.4" fill="#fff6d6" />
    <path d="M26 26 L23.5 14 L36 14 L33.5 26 Z" fill="#2f3543" />
    <ellipse cx="29.7" cy="14" rx="6.4" ry="2" fill="#3c4557" />
    <path d="M42 26 Q42 19.5 48 19.5 Q54 19.5 54 26 Z" fill="#465071" stroke="#2f3543" strokeWidth="1.2" />
    <rect x="53" y="11" width="39" height="6" rx="3" fill="#3c4557" />
    <rect x="57" y="14" width="32" height="32" rx="7" fill="#54617a" stroke="#2f3543" strokeWidth="2" />
    <rect x="61.5" y="19.5" width="21" height="15.5" rx="4" fill="#bfe0f2" stroke="#2f3543" strokeWidth="1.2" />
    <circle cx="72" cy="28" r="5.6" fill="#e8b98a" />
    <path d="M66.6 26.4 Q72 20.4 77.4 26.4 Z" fill="#d9534b" />
    <rect x="66.8" y="25.6" width="10.4" height="2.4" rx="1.2" fill="#c0392b" />
    <g className="pq-blink"><rect x="69.4" y="27" width="2.2" height="2.6" rx="1" fill="#3a2a1c" /><rect x="72.6" y="27" width="2.2" height="2.6" rx="1" fill="#3a2a1c" /></g>
    <g className="pq-blink2"><rect x="68.8" y="26.6" width="7.6" height="1.7" rx="0.8" fill="#e8b98a" /></g>
    <rect x="88" y="39" width="7" height="4" rx="1.4" fill="#2f3543" />
    <circle cx="90" cy="35" r="2.2" fill="#3a4152" />
    <Wheel cx={30} cy={52} r={9} />
    <Wheel cx={53} cy={52} r={7} />
    <Wheel cx={73} cy={52} r={7} />
    <line x1="30" y1="52" x2="73" y2="52" stroke="#5a6577" strokeWidth="2" opacity=".5" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const Spark = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z" fill="#f6c453" stroke="#d99b1e" strokeWidth="0.6" /></svg>
);

// Rangli naqsh-katak: qatlamli (to'ldirish + kontur + tepa blik).
const Cell = ({ c, cls = '', style }) => (
  <span className={'pq-cell' + (cls ? ' ' + cls : '')} style={{ background: c.f, borderColor: c.s, ...style }} />
);

export default function D11_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // nomzod indeksi
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: t.opts.slice(), studentAnswer: { idx: picked }, correctAnswer: { idx: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const rightPattern = picked !== null ? CARDS[picked] : null; // panel o'ng yarmiga qo'yiladigan tanlov

  return (
    <div className="pq pq1107">
      <style>{`
        .pq1107{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1107 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a5bd6;text-transform:uppercase;}
        .pq1107 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1107 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1107 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1107 .pq-scene{position:relative;width:372px;max-width:100%;height:214px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafb 0%,#e2f3fd 46%,#eaf7ff 64%);border:2px solid #c4dff0;overflow:hidden;}
        .pq1107 .pq-sun{position:absolute;top:12px;right:16px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1107 .pq-cloud{position:absolute;width:50px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1107 .pq-cloud.c1{top:18px;left:-70px;animation-duration:34s;}
        .pq1107 .pq-cloud.c2{top:44px;left:-70px;width:36px;height:12px;opacity:.7;animation-duration:46s;animation-delay:-22s;}
        .pq1107 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe3a6 0%,#a7d68c 100%);z-index:1;}
        .pq1107 .pq-platform{position:absolute;left:0;right:0;bottom:40px;height:12px;background:linear-gradient(#d9c39b,#c2a878);border-top:2px solid #e7d6b6;z-index:2;}
        /* semafor */
        .pq1107 .pq-sem{position:absolute;right:16px;bottom:50px;z-index:3;width:14px;display:flex;flex-direction:column;align-items:center;}
        .pq1107 .pq-sembox{width:14px;height:30px;border-radius:5px;background:#3a4152;border:1.5px solid #232833;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;}
        .pq1107 .pq-sled{width:8px;height:8px;border-radius:50%;background:#5b3030;}
        .pq1107 .pq-sled.red{animation:pqSemR 2.4s ease-in-out infinite;}
        .pq1107 .pq-sled.grn{animation:pqSemG 2.4s ease-in-out infinite;}
        .pq1107 .pq-sempole{width:4px;height:14px;background:#4a5262;}
        /* rails */
        .pq1107 .pq-rails{position:absolute;left:0;right:0;bottom:8px;height:24px;z-index:2;}
        .pq1107 .pq-rail{position:absolute;left:0;right:0;height:3px;background:#8b95a6;}
        .pq1107 .pq-rail.r1{top:6px;} .pq1107 .pq-rail.r2{top:17px;}
        .pq1107 .pq-tie{position:absolute;top:2px;width:5px;height:20px;border-radius:2px;background:#9a7a54;}
        /* lokomotiv (chapda, ambient tebranish) */
        .pq1107 .pq-locow{position:absolute;left:6px;bottom:15px;z-index:4;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));animation:pqTrainBob 2.6s ease-in-out infinite;}
        .pq1107 .pq-wheel{animation:pqSpin 1.7s linear infinite;}
        .pq1107 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq1107 .pq-blink2{opacity:1;animation:pqBlink2 3.8s linear infinite;}
        .pq1107 .pq-steam{position:absolute;top:-8px;left:16px;width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.9);z-index:5;opacity:0;animation:pqSteam 3.6s ease-in-out infinite;}
        .pq1107 .pq-steam.s2{left:20px;animation-delay:-1.2s;} .pq1107 .pq-steam.s3{left:24px;animation-delay:-2.4s;}
        /* bezak paneli (markaz) */
        .pq1107 .pq-boardw{position:absolute;top:24px;left:50%;transform:translateX(-50%);z-index:5;}
        .pq1107 .pq-board{position:relative;padding:11px 13px 12px;border-radius:14px;background:linear-gradient(#fbf3e2,#f3e7cd);border:3px solid #c99a58;box-shadow:0 5px 10px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.6);transition:border-color .25s,box-shadow .25s;}
        .pq1107 .pq-board.win{border-color:#1a7f43;box-shadow:0 5px 14px rgba(26,127,67,.28),inset 0 1px 0 rgba(255,255,255,.6);animation:pqCele .55s ease;}
        .pq1107 .pq-ribbon{position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:2px 12px;border-radius:8px;background:linear-gradient(#c66b52,#a24f39);color:#fff5ec;font-size:10.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,.2);}
        .pq1107 .pq-halves{display:flex;align-items:center;justify-content:center;margin-top:6px;}
        .pq1107 .pq-half{display:flex;gap:5px;}
        .pq1107 .pq-half.right.win{animation:pqCele .55s ease;}
        .pq1107 .pq-cell{position:relative;width:28px;height:28px;border-radius:8px;border:2px solid transparent;box-sizing:border-box;overflow:hidden;}
        .pq1107 .pq-cell:not(.q)::after{content:'';position:absolute;left:3px;right:3px;top:3px;height:6px;border-radius:5px;background:rgba(255,255,255,.4);}
        .pq1107 .pq-cell.q{background:#fff;border:2px dashed #c3cad6;color:#9aa3b2;font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;animation:pqBreath 2.2s ease-in-out infinite;}
        .pq1107 .pq-cell.q.q2{animation-delay:-.7s;} .pq1107 .pq-cell.q.q3{animation-delay:-1.4s;}
        .pq1107 .pq-cell.fill{animation:pqDrop .45s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1107 .pq-cell.win{box-shadow:0 0 0 2px #1a7f43,0 0 8px rgba(26,127,67,.4);}
        /* ko'zgu o'qi */
        .pq1107 .pq-axis{position:relative;width:0;align-self:stretch;border-left:2.5px dashed #c99a58;margin:0 10px;display:flex;align-items:center;}
        .pq1107 .pq-axis .pq-spark{position:absolute;top:-9px;left:50%;transform:translateX(-50%);line-height:0;animation:pqSun 2.4s ease-in-out infinite;}
        .pq1107 .pq-axis::before,.pq1107 .pq-axis::after{content:'';position:absolute;top:50%;transform:translateY(-50%);border-top:4px solid transparent;border-bottom:4px solid transparent;}
        .pq1107 .pq-axis::before{right:2px;border-right:5px solid #c99a58;}
        .pq1107 .pq-axis::after{left:2px;border-left:5px solid #c99a58;}
        /* g'alaba yulduzlari */
        .pq1107 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(249,198,47,.6));}
        .pq1107 .pq-wstar.w2{animation-delay:-.5s;} .pq1107 .pq-wstar.w3{animation-delay:-1.05s;}
        /* nomzod-kartalar */
        .pq1107 .pq-cards{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px;}
        .pq1107 .pq-cardbtn{position:relative;display:flex;align-items:center;gap:6px;padding:12px 13px 12px 12px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;transition:.13s;}
        .pq1107 .pq-cardbtn:hover:not(:disabled){border-color:#c0a4ea;transform:translateY(-2px);}
        .pq1107 .pq-cardbtn:active:not(:disabled){transform:scale(.95);}
        .pq1107 .pq-cardbtn.sel{border-color:#2563eb;background:#eef2fd;}
        .pq1107 .pq-cardbtn.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq1107 .pq-cardbtn.dim{opacity:.4;}
        .pq1107 .pq-cardbtn:disabled{cursor:default;}
        .pq1107 .pq-cardaxis{align-self:stretch;width:0;border-left:2.5px dashed #c3cad6;margin-right:1px;}
        .pq1107 .pq-cardbtn.right .pq-cardaxis{border-color:#9fd8b5;}
        .pq1107 .pq-mini{display:flex;gap:4px;}
        .pq1107 .pq-cell.mini{width:22px;height:22px;border-radius:6px;}
        .pq1107 .pq-cell.mini::after{left:2px;right:2px;top:2px;height:5px;}
        .pq1107 .pq-badge{position:absolute;top:-9px;right:-9px;width:22px;height:22px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(26,127,67,.35);animation:pqPop .3s ease both;}
        .pq1107 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1107 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1107 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(-360deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSemR{0%,46%{background:#e34b3f;box-shadow:0 0 6px #e34b3f;}50%,100%{background:#5b3030;box-shadow:none;}}
        @keyframes pqSemG{0%,46%{background:#2f4030;box-shadow:none;}50%,100%{background:#4fd07f;box-shadow:0 0 6px #4fd07f;}}
        @keyframes pqTrainBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqSteam{0%,58%,100%{opacity:0;transform:translateY(0) scale(.5);}66%{opacity:.85;transform:translateY(-12px) scale(1);}86%{opacity:0;transform:translateY(-26px) scale(1.5);}}
        @keyframes pqBlink{0%,90%{opacity:0;}92%,96%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqBlink2{0%,90%{opacity:1;}92%,96%{opacity:0;}98%,100%{opacity:1;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.08);border-color:#a9b5c8;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-26px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-ground" />
        <span className="pq-platform" />
        <div className="pq-sem">
          <div className="pq-sembox"><span className="pq-sled red" /><span className="pq-sled grn" /></div>
          <span className="pq-sempole" />
        </div>

        <div className="pq-rails">
          <span className="pq-rail r1" /><span className="pq-rail r2" />
          {Array.from({ length: 15 }).map((_, i) => (<span key={i} className="pq-tie" style={{ left: 6 + i * 25 }} />))}
        </div>

        <span className="pq-locow">
          <Locomotive />
          <span className="pq-steam" /><span className="pq-steam s2" /><span className="pq-steam s3" />
        </span>

        {/* Bezak paneli: chap yarm (naqsh) + ko'zgu o'qi + o'ng yarm (?/tanlov). G'alabada o'ng yarm yashil. */}
        <div className="pq-boardw">
          <div className={'pq-board' + (ok ? ' win' : '')}>
            <span className="pq-ribbon">{t.ribbon}</span>
            <div className="pq-halves">
              <div className="pq-half">
                {LEFT.map((c, i) => (<Cell key={'L' + i} c={c} />))}
              </div>
              <div className="pq-axis"><span className="pq-spark"><Spark /></span></div>
              <div className={'pq-half right' + (ok ? ' win' : '')}>
                {rightPattern
                  ? rightPattern.map((c, i) => (
                    <Cell key={'R' + picked + '-' + i} c={c} cls={'fill' + (ok ? ' win' : '')} style={{ animationDelay: `${i * 0.09}s` }} />
                  ))
                  : [0, 1, 2].map((i) => (<span key={'Q' + i} className={'pq-cell q' + (i === 1 ? ' q2' : i === 2 ? ' q3' : '')}>?</span>))}
              </div>
            </div>
          </div>
        </div>

        {ok && (
          <>
            <span className="pq-wstar" style={{ left: '22%', top: '26px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '50%', top: '18px' }}><Star fill="#ffd13f" /></span>
            <span className="pq-wstar w3" style={{ left: '76%', top: '30px' }}><Star fill="#f2b134" /></span>
          </>
        )}
      </div>

      {/* 3 nomzod-naqsh — ko'zgu o'qidan boshlab (chap chekka = o'qqa yaqin). Bittasi to'g'ri aks. */}
      <div className="pq-cards">
        {CARDS.map((pat, i) => {
          const sel = picked === i; const right = ok && i === CORRECT;
          const cls = right ? ' right' : ok ? ' dim' : sel ? ' sel' : '';
          return (
            <button key={i} type="button" className={'pq-cardbtn' + cls} disabled={lock}
              onClick={() => { setPicked(i); setFeedback(null); }} aria-label={t.opts[i]}>
              <span className="pq-cardaxis" />
              <span className="pq-mini">{pat.map((c, j) => (<Cell key={j} c={c} cls="mini" />))}</span>
              {right && <span className="pq-badge"><IconOk /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
