// Dars05 · Amaliyot 10 — YANGI kreativ «Dorboz tarozisi» · 🔴 · dorboz · tag: balance_compose
// 5 = 2 + ?: jonli qiyshayadigan tarozi. Chap pallada 5 kanon-koptok (fiks), o'ngda 2; bola o'ng
// pallani bosib qo'shadi (max 6), qo'shilganini bosib olib tashlaydi (D04_08 naqshi). Веди-до-верного.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT = 5, START = 2, MAX = 6;
const DATA = { left: 5, startRight: 2, ptype: 'NEW', level: '🔴', tag: 'balance_compose' };
const T = {
  uz: {
    eyebrow: 'Sirk · Dorboz', title: 'Tarozini tenglashtir',
    setup: 'Chap pallada 5 ta koptok bor. O\'ng pallada esa 2 ta.',
    ask: 'O\'ng pallaga koptok qo\'shing. Ikkala palla teng bo\'lsin!',
    correct: 'Barakalla! Besh — bu ikki va uch. Tarozi teng bo\'ldi!',
    hintLess: 'O\'ng palla yuqorida — u yengil. Yana koptok qo\'shing.',
    hintMore: 'O\'ng palla og\'ir bo\'lib ketdi. Bitta koptokni bosib oling.',
    tapHint: 'Pallaga bosing',
  },
  ru: {
    eyebrow: 'Цирк · Канатоходец', title: 'Уравновесь весы',
    setup: 'На левой чаше 5 мячиков. На правой — 2.',
    ask: 'Добавь мячики на правую чашу. Пусть обе чаши будут равны!',
    correct: 'Молодец! Пять — это два и три. Весы стали равны!',
    hintLess: 'Правая чаша выше — она легче. Добавь ещё мячик.',
    hintMore: 'Правая чаша стала тяжёлой. Убери один мячик, нажав на него.',
    tapHint: 'Нажимай на чашу',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Kanon-koptok gradientlari (bir marta, sahna ichida): asos rang + ochroq tepa-chap.
const GradDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <radialGradient id="pq0510g0" cx="35%" cy="30%" r="80%"><stop offset="0%" stopColor="#ef8d86" /><stop offset="100%" stopColor="#d9534b" /></radialGradient>
      <radialGradient id="pq0510g1" cx="35%" cy="30%" r="80%"><stop offset="0%" stopColor="#8fc0e2" /><stop offset="100%" stopColor="#4f8fc4" /></radialGradient>
      <radialGradient id="pq0510g2" cx="35%" cy="30%" r="80%"><stop offset="0%" stopColor="#f8d67f" /><stop offset="100%" stopColor="#f2b134" /></radialGradient>
      <radialGradient id="pq0510g3" cx="35%" cy="30%" r="80%"><stop offset="0%" stopColor="#93cf8c" /><stop offset="100%" stopColor="#57a84f" /></radialGradient>
    </defs>
  </svg>
);

// Kanon-koptok: r~10 doira, radial 2-ton, yupqa quyuq kontur, tepa-chap oq blik.
// Ranglar ketma-ket aylanadi: qizil, ko'k, sariq, yashil.
const BALL_LINE = ['#a33630', '#34648c', '#b97c14', '#3a7a35'];
const Ball = ({ k }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill={`url(#pq0510g${k % 4})`} stroke={BALL_LINE[k % 4]} strokeWidth="1.6" />
    <ellipse cx="8.2" cy="7.6" rx="3" ry="1.9" fill="#fff" opacity=".8" transform="rotate(-28 8.2 7.6)" />
  </svg>
);

// Koptoklar palla-savat ICHIDA ixcham panjara bo'lib turadi: 3 pastda, 3 tepada (savat devori atrofida ko'rinadi).
const SLOTS = [
  { x: 9, y: 22 }, { x: 35, y: 22 }, { x: 61, y: 22 },
  { x: 9, y: 0 }, { x: 35, y: 0 }, { x: 61, y: 0 },
];

// Dorboz (dekorativ): arqon ustida, langar tayoq bilan; qizil kostyum, oq chiziqlar,
// ko'z = quyuq doira + oq blik. Wrapper sekin sway, tayoq alohida tebranadi.
const Walker = () => (
  <svg viewBox="0 0 76 58" width="66" height="50" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-pole" d="M4 33 Q38 26 72 33" stroke="#8a5f28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M36 40 L33 52 M41 40 L44 52" stroke="#35507a" strokeWidth="3.6" strokeLinecap="round" fill="none" />
    <ellipse cx="32" cy="53.5" rx="4" ry="2" fill="#1f2430" />
    <ellipse cx="45" cy="53.5" rx="4" ry="2" fill="#1f2430" />
    <path d="M32 22 L45 22 L43 41 L34 41 Z" fill="#d9534b" stroke="#a33630" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M33 28 L44 28 M33.5 33 L43.5 33" stroke="#fff" strokeWidth="2" opacity=".85" />
    <path d="M33 24 L16 30.5" stroke="#d9534b" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M44 24 L61 30.5" stroke="#d9534b" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="15" cy="31" r="2.6" fill="#f0c29a" stroke="#b5885f" strokeWidth="1" />
    <circle cx="62" cy="31" r="2.6" fill="#f0c29a" stroke="#b5885f" strokeWidth="1" />
    <circle cx="38.5" cy="13" r="7.2" fill="#f0c29a" stroke="#b5885f" strokeWidth="1.4" />
    <path d="M31.5 10.5 Q38.5 3 45.5 10.5 L45.5 8 Q38.5 .5 31.5 8 Z" fill="#d9534b" stroke="#a33630" strokeWidth="1.1" strokeLinejoin="round" />
    <circle cx="36" cy="12.8" r="1.3" fill="#1f2430" /><circle cx="36.5" cy="12.3" r="0.5" fill="#fff" />
    <circle cx="41.5" cy="12.8" r="1.3" fill="#1f2430" /><circle cx="41.9" cy="12.3" r="0.5" fill="#fff" />
    <g className="pq-blink" aria-hidden="true">
      <rect x="34.3" y="11.2" width="3.5" height="3.3" rx="1.6" fill="#f0c29a" />
      <rect x="39.8" y="11.2" width="3.5" height="3.3" rx="1.6" fill="#f0c29a" />
    </g>
    <path d="M36 16.8 Q38.5 18.8 41 16.8" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

// Tarozi ustuni: yog'och ustun + ikki pog'onali asos + qizil sirk-spiral chiziqlar.
const Stand = () => (
  <svg viewBox="0 0 64 168" width="64" height="168" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2" y="158" width="60" height="9" rx="4" fill="#c98d4e" stroke="#7a4a1e" strokeWidth="1.6" />
    <rect x="9" y="150" width="46" height="9" rx="3" fill="#a8642a" stroke="#7a4a1e" strokeWidth="1.5" />
    <rect x="27" y="6" width="10" height="146" fill="#c98d4e" stroke="#7a4a1e" strokeWidth="1.6" />
    <path d="M29 10 L29 148" stroke="#e0b25f" strokeWidth="2" opacity=".7" />
    <path d="M27 24 L37 32 M27 52 L37 60 M27 80 L37 88 M27 108 L37 116 M27 136 L37 144" stroke="#d9534b" strokeWidth="3.4" opacity=".75" />
    <rect x="22" y="2" width="20" height="7" rx="3" fill="#a8642a" stroke="#7a4a1e" strokeWidth="1.5" />
  </svg>
);

// Sirk bayroqchalari (dekorativ bunting), rang palitrasi koptoklarniki.
const Bunting = () => (
  <svg viewBox="0 0 330 28" width="100%" height="28" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M0 5 Q165 20 330 5" stroke="#b98a4e" strokeWidth="1.6" fill="none" />
    <path className="pq-flag" style={{ animationDelay: '-.4s' }} d="M25 7 L41 7 L33 20 Z" fill="#d9534b" opacity=".85" />
    <path className="pq-flag" style={{ animationDelay: '-1.1s' }} d="M75 10 L91 10 L83 23 Z" fill="#4f8fc4" opacity=".85" />
    <path className="pq-flag" style={{ animationDelay: '-1.9s' }} d="M125 12 L141 12 L133 25 Z" fill="#f2b134" opacity=".85" />
    <path className="pq-flag" style={{ animationDelay: '-2.6s' }} d="M185 12 L201 12 L193 25 Z" fill="#57a84f" opacity=".85" />
    <path className="pq-flag" style={{ animationDelay: '-.8s' }} d="M240 10 L256 10 L248 23 Z" fill="#d9534b" opacity=".85" />
    <path className="pq-flag" style={{ animationDelay: '-1.5s' }} d="M290 7 L306 7 L298 20 Z" fill="#4f8fc4" opacity=".85" />
  </svg>
);

export default function D05_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [right, setRight] = useState(START);
  const [touched, setTouched] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.right != null) { setRight(initialAnswer.studentAnswer.right); setTouched(true); }
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const lock = isReview || checked;
  const addOne = () => { if (lock || right >= MAX) return; setRight((r) => r + 1); setTouched(true); setFeedback(null); };
  const removeAdded = (i) => {
    if (lock || i < START || right <= START) return; // faqat bola qo'shganlari olinadi
    setRight((r) => r - 1); setFeedback(null);
  };

  const check = useCallback(() => {
    if (!touched) return;
    const correct = right === LEFT;
    const msg = correct ? t.correct : (right < LEFT ? t.hintLess : t.hintMore);
    setFeedback({ correct, msg }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [], studentAnswer: { right }, correctAnswer: { right: LEFT }, correct, meta: { ...DATA } });
  }, [right, touched, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  // JONLI TILT: chap og'ir bo'lsa burchak manfiy (chap pastda), teng bo'lsa 0 — beam gorizontal.
  const ang = Math.max(-14, Math.min(14, (right - LEFT) * 5));

  return (
    <div className="pq pq0510">
      <style>{`
        .pq0510{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0510 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c2452f;text-transform:uppercase;}
        .pq0510 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0510 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0510 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0510 .pq-scene{position:relative;width:330px;height:300px;margin:0 auto;border-radius:20px;background:linear-gradient(#f6e7f2 0%,#fdf3e3 55%,#f6e6cc 100%);border:2px solid #ecd9c3;overflow:hidden;}
        .pq0510 .pq-bunt{position:absolute;top:0;left:0;right:0;}
        .pq0510 .pq-rope{position:absolute;left:0;right:0;top:56px;height:3px;background:linear-gradient(#a8744a,#7a5233);box-shadow:0 1px 0 rgba(0,0,0,.12);}
        .pq0510 .pq-walkpath{position:absolute;left:14%;top:10px;animation:pqWalk 7s ease-in-out infinite alternate;z-index:1;}
        .pq0510 .pq-walker{transform-origin:50% 95%;animation:pqWSway 3.6s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0510 .pq-walker.cele{animation:pqJump .55s ease 3;}
        .pq0510 .pq-pole{transform-box:fill-box;transform-origin:50% 50%;animation:pqPole 3.6s ease-in-out infinite;}
        .pq0510 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0510 .pq-flag{transform-box:fill-box;transform-origin:50% 0;animation:pqFlag 3s ease-in-out infinite;}
        .pq0510 .pq-stand{position:absolute;left:50%;top:104px;transform:translateX(-50%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0510 .pq-ground{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:210px;height:16px;border-radius:50%;background:rgba(150,110,55,.22);}
        .pq0510 .pq-beam{position:absolute;left:50%;top:102px;width:210px;height:12px;margin-left:-105px;transform-origin:50% 50%;transition:transform .55s cubic-bezier(.4,1.4,.5,1);z-index:2;}
        .pq0510 .pq-bar{position:absolute;inset:0;border-radius:6px;background:linear-gradient(#c98d4e,#a8642a);border:2px solid #7a4a1e;box-shadow:0 2px 2px rgba(0,0,0,.2);}
        .pq0510 .pq-cap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:17px;height:17px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e8cd7e,#c9a13b 70%,#9a7a20);border:1.5px solid #7a5f14;z-index:3;}
        .pq0510 .pq-ring{position:absolute;top:2px;width:8px;height:8px;border-radius:50%;background:#c9a13b;border:1.5px solid #7a5f14;z-index:1;}
        .pq0510 .pq-ring.rL{left:4px;} .pq0510 .pq-ring.rR{right:4px;}
        .pq0510 .pq-pan{position:absolute;top:8px;width:100px;height:116px;transform-origin:50% 0;transition:transform .55s cubic-bezier(.4,1.4,.5,1);}
        .pq0510 .pq-pan.pL{left:-42px;} .pq0510 .pq-pan.pR{left:158px;}
        .pq0510 .pq-pan.tap{cursor:pointer;}
        .pq0510 .pq-strings{display:block;margin:0 auto;}
        /* palla-savat — chuqurroq piyola; koptoklar shu savat ICHIDA turadi (devor atrofida ko'rinadi) */
        .pq0510 .pq-dish{position:absolute;left:1px;top:18px;width:98px;height:68px;border-radius:16px 16px 50px 50px;background:linear-gradient(#e6b968,#c28c42 62%,#a9762f);border:2.5px solid #82571f;box-shadow:inset 0 6px 9px rgba(0,0,0,.22),inset 0 -3px 4px rgba(255,255,255,.16),0 3px 3px rgba(0,0,0,.2);transition:.15s;}
        .pq0510 .pq-pan.tap .pq-dish{border-style:dashed;border-color:#c2803a;}
        .pq0510 .pq-pan.tap:hover .pq-dish{border-color:#a35f16;filter:brightness(1.06);}
        .pq0510 .pq-dish.win{border-style:solid;border-color:#1a7f43;box-shadow:inset 0 5px 8px rgba(0,0,0,.14),0 0 0 3px rgba(26,127,67,.25);animation:pqCele .5s ease;}
        .pq0510 .pq-ball{position:absolute;width:26px;height:26px;line-height:0;animation:pqDrop .38s cubic-bezier(.3,1.4,.5,1) both;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));z-index:2;}
        .pq0510 .pq-ball svg{animation:pqJig var(--jt,3.2s) ease-in-out infinite;animation-delay:var(--jd,0s);}
        .pq0510 .pq-ball.added{cursor:pointer;}
        .pq0510 .pq-ball.added:hover{transform:scale(1.12);}
        .pq0510 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0510 .pq-plusbub{position:absolute;left:50%;top:80px;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;background:#fff;border:2px dashed #c2803a;color:#a35f16;font-weight:900;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;animation:pqBob 1.8s ease-in-out infinite;}
        .pq0510 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0510 .pq-taphint{position:absolute;bottom:5px;right:12px;font-size:12.5px;font-weight:700;color:#b06e24;background:rgba(255,255,255,.85);padding:3px 10px;border-radius:999px;animation:pqBobY 1.8s ease-in-out infinite;z-index:4;white-space:nowrap;}
        .pq0510 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0510 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0510 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWalk{from{transform:translateX(-14px);}to{transform:translateX(14px);}}
        @keyframes pqWSway{0%,100%{transform:rotate(-3deg) translateY(0);}25%,75%{transform:rotate(0deg) translateY(-1.5px);}50%{transform:rotate(3deg) translateY(0);}}
        @keyframes pqPole{0%,100%{transform:rotate(2.5deg);}50%{transform:rotate(-2.5deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqFlag{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqJig{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-2px) rotate(2deg);}}
        @keyframes pqJump{0%,100%{transform:translateY(0);}40%{transform:translateY(-9px);}}
        @keyframes pqBob{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,-4px);}}
        @keyframes pqBobY{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-26px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <GradDefs />
        <div className="pq-bunt"><Bunting /></div>
        <span className="pq-rope" />
        <div className="pq-walkpath"><div className={'pq-walker' + (ok ? ' cele' : '')}><Walker /></div></div>
        <div className="pq-stand"><Stand /></div>
        <span className="pq-ground" />
        {ok && <span className="pq-chip">{LEFT} = {START} + {right - START}</span>}

        <div className="pq-beam" style={{ transform: `rotate(${ang}deg)` }}>
          <span className="pq-bar" /><span className="pq-cap" />
          <span className="pq-ring rL" /><span className="pq-ring rR" />

          {/* Chap palla — 5 fiks koptok; ip tik qolsin deb beam'ga qarshi buriladi */}
          <div className="pq-pan pL" style={{ transform: `rotate(${-ang}deg)` }}>
            <svg className="pq-strings" viewBox="0 0 96 30" width="96" height="30" aria-hidden="true">
              <path d="M48 2 L10 29 M48 2 L86 29 M48 2 L48 29" stroke="#7a5233" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              <circle cx="48" cy="3" r="2.6" fill="#c9a13b" stroke="#7a5f14" strokeWidth="1" />
            </svg>
            <div className={'pq-dish' + (ok ? ' win' : '')} />
            {Array.from({ length: LEFT }).map((_, i) => (
              <span key={i} className="pq-ball" style={{ left: SLOTS[i].x, top: SLOTS[i].y + 30, animationDelay: `${i * 0.05}s`, '--jd': `${-(i * 0.9)}s`, '--jt': `${2.8 + (i % 3) * 0.5}s` }}>
                <Ball k={i} />{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
          </div>

          {/* O'ng palla — bosilsa +1 (max 6); qo'shilgan koptok bosilsa olinadi */}
          <div className={'pq-pan pR' + (lock ? '' : ' tap')} style={{ transform: `rotate(${-ang}deg)` }} onClick={addOne}>
            <svg className="pq-strings" viewBox="0 0 96 30" width="96" height="30" aria-hidden="true">
              <path d="M48 2 L10 29 M48 2 L86 29 M48 2 L48 29" stroke="#7a5233" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              <circle cx="48" cy="3" r="2.6" fill="#c9a13b" stroke="#7a5f14" strokeWidth="1" />
            </svg>
            <div className={'pq-dish' + (ok ? ' win' : '')} />
            {Array.from({ length: right }).map((_, i) => (
              <span key={i} className={'pq-ball' + (i >= START && !lock ? ' added' : '')}
                style={{ left: SLOTS[i].x, top: SLOTS[i].y + 30, animationDelay: `${i * 0.05}s`, '--jd': `${-(0.45 + i * 0.9)}s`, '--jt': `${3 + (i % 3) * 0.5}s` }}
                onClick={(e) => { if (i >= START) { e.stopPropagation(); removeAdded(i); } }}>
                <Ball k={i} />{ok && <b className="pq-cnt">{i + 1}</b>}
              </span>
            ))}
            {!lock && right < MAX && <span className="pq-plusbub">+</span>}
          </div>
        </div>

        {!lock && <span className="pq-taphint">{t.tapHint}</span>}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
