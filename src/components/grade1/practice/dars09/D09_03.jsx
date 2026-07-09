// Dars09 · Amaliyot 03 — P10 Son o'qida ORQAGA sakrash (4 → 3) · 🟡 · tag: numline_back
// Hovuz: suv ustida 6 nilufar-tosh (0-5), qurbaqa 4-toshda; mount'da BIR orqaga sakraydi (ark chapga,
// strelka chapga). 3-tosh raqami «?» yopiq; g'alabada «?» ochilib 3, chip «4 − 1 = 3».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { start: 4, jump: 1, target: 3, options: [2, 3, 5], ptype: 'P10', level: '🟡', tag: 'numline_back' };
// Toshlar markazi (sahna px). 4-tosh markazi 268, 3-tosh 209 → sakrash dx = −59px.
const STONE_X = [33, 92, 151, 209, 268, 327];
const STONE_TOP = 150, HOP_DX = STONE_X[3] - STONE_X[4]; // -59

const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Son o\'qi', title: 'Orqaga sakrash',
    setup: 'Qurbaqa to\'rt raqamli toshda turgan edi. U ORQAGA bir marta sakradi!',
    ask: 'Qurbaqa endi qaysi raqamli toshda?',
    correct: 'Barakalla! To\'rtdan bir qadam orqaga — uch. Ayirganda orqaga sakraymiz!',
    hint: 'To\'rtdan boshlang va bir qadam orqaga sanang.',
  },
  ru: {
    eyebrow: 'У пруда · Числовая прямая', title: 'Прыжок назад',
    setup: 'Лягушка сидела на камне с цифрой четыре. Она прыгнула НАЗАД один раз!',
    ask: 'На камне с какой цифрой лягушка теперь?',
    correct: 'Молодец! От четырёх один шаг назад — три. Когда вычитаем — прыгаем назад!',
    hint: 'Начни с четырёх и отсчитай один шаг назад.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza (pq-poseS) — tana #57a84f, qorin #a8d89e, kontur #2e6e28,
// TEPADA ikki bo'rtiq ko'z (oq+qorachiq+blik, pirpiratadi), keng tabassum, old panjalar oldda,
// orqa oyoq bukilgan; sakrash pozasi (pq-poseJ) — oyoqlar cho'zilgan, tana chapga engashgan.
const Frog = () => (
  <svg viewBox="0 0 64 56" width="54" height="47" aria-hidden="true" style={{ display: 'block' }}>
    <g className="pq-poseS">
      {/* orqa oyoq-sonlar (bukilgan) */}
      <ellipse cx="15" cy="40" rx="8.5" ry="10" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" transform="rotate(-14 15 40)" />
      <ellipse cx="49" cy="40" rx="8.5" ry="10" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" transform="rotate(14 49 40)" />
      <ellipse cx="12" cy="50.5" rx="6.6" ry="2.9" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.4" />
      <ellipse cx="52" cy="50.5" rx="6.6" ry="2.9" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.4" />
      {/* tana + qorin */}
      <ellipse cx="32" cy="36" rx="17" ry="15" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.7" />
      <ellipse cx="32" cy="42.5" rx="11.5" ry="8" fill="#a8d89e" />
      {/* tomoq — puls (nafas) */}
      <ellipse className="pq-throat" cx="32" cy="31.5" rx="6.5" ry="4" fill="#a8d89e" />
      {/* keng tabassum + burun */}
      <path d="M21 24.5 Q32 32 43 24.5" stroke="#2e6e28" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="29" cy="21" r="0.9" fill="#2e6e28" /><circle cx="35" cy="21" r="0.9" fill="#2e6e28" />
      {/* bo'rtiq ko'zlar tepada */}
      <circle cx="22" cy="13" r="8" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.7" />
      <circle cx="42" cy="13" r="8" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.7" />
      <circle cx="22" cy="13.5" r="5.3" fill="#fff" /><circle cx="42" cy="13.5" r="5.3" fill="#fff" />
      <circle cx="21.2" cy="14.2" r="2.5" fill="#1f2430" /><circle cx="41.2" cy="14.2" r="2.5" fill="#1f2430" />
      <circle cx="22.4" cy="12.8" r="1" fill="#fff" /><circle cx="42.4" cy="12.8" r="1" fill="#fff" />
      <g className="pq-blink">
        <circle cx="22" cy="13.5" r="5.6" fill="#57a84f" /><circle cx="42" cy="13.5" r="5.6" fill="#57a84f" />
      </g>
      {/* old panjalar oldda (barmoq chiziqlari bilan) */}
      <ellipse cx="25" cy="49.5" rx="5" ry="2.8" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.4" />
      <ellipse cx="39" cy="49.5" rx="5" ry="2.8" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.4" />
      <path d="M22 49.5 L21 51.2 M25 50 L25 51.8 M28 49.5 L29 51.2" stroke="#2e6e28" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M36 49.5 L35 51.2 M39 50 L39 51.8 M42 49.5 L43 51.2" stroke="#2e6e28" strokeWidth="1.1" strokeLinecap="round" />
    </g>
    <g className="pq-poseJ">
      {/* cho'zilgan orqa oyoqlar (orqada, o'ngda) */}
      <path d="M40 32 Q53 36 61 27" stroke="#2e6e28" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M40 32 Q53 36 61 27" stroke="#57a84f" strokeWidth="4.2" fill="none" strokeLinecap="round" />
      <path d="M41 39 Q54 45 62 38" stroke="#2e6e28" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M41 39 Q54 45 62 38" stroke="#57a84f" strokeWidth="4.2" fill="none" strokeLinecap="round" />
      <ellipse cx="60.5" cy="26" rx="3.2" ry="2" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.1" />
      <ellipse cx="61" cy="38.5" rx="3.2" ry="2" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.1" />
      {/* cho'zilgan old oyoqlar (oldinda, pastda) */}
      <path d="M22 34 Q15 43 9 48" stroke="#2e6e28" strokeWidth="5.4" fill="none" strokeLinecap="round" />
      <path d="M22 34 Q15 43 9 48" stroke="#57a84f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="8" cy="49" rx="3.2" ry="1.9" fill="#6cb85e" stroke="#2e6e28" strokeWidth="1.1" />
      {/* engashgan tana + qorin */}
      <ellipse cx="30" cy="30" rx="16" ry="12" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.7" transform="rotate(-16 30 30)" />
      <ellipse cx="28" cy="35" rx="10" ry="6" fill="#a8d89e" transform="rotate(-16 28 35)" />
      {/* ko'zlar (chap-oldga qaraydi) */}
      <circle cx="17" cy="15" r="7" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
      <circle cx="31" cy="11" r="7" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
      <circle cx="16.4" cy="15.4" r="4.6" fill="#fff" /><circle cx="30.4" cy="11.4" r="4.6" fill="#fff" />
      <circle cx="15" cy="16" r="2.2" fill="#1f2430" /><circle cx="29" cy="12" r="2.2" fill="#1f2430" />
      <circle cx="16" cy="14.6" r="0.9" fill="#fff" /><circle cx="30" cy="10.6" r="0.9" fill="#fff" />
      <path d="M10 22 Q17 27 24 24" stroke="#2e6e28" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// NINACHI: kichik tanacha + 2 juft shaffof qanot (pirillaydi), boshi o'ngda — olg'a uchadi.
const Dragonfly = () => (
  <svg viewBox="0 0 44 26" width="40" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M2 14 L16 12" stroke="#3f7fb5" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M4 13.8 L14 12.4" stroke="#2b5f8e" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
    <g className="pq-wingsT">
      <ellipse cx="19" cy="6" rx="8" ry="3" fill="#dff0fb" opacity=".75" stroke="#b7d9ee" strokeWidth=".8" transform="rotate(-24 19 6)" />
      <ellipse cx="27" cy="6" rx="8" ry="3" fill="#dff0fb" opacity=".75" stroke="#b7d9ee" strokeWidth=".8" transform="rotate(24 27 6)" />
    </g>
    <g className="pq-wingsB">
      <ellipse cx="19" cy="17" rx="7" ry="2.8" fill="#eaf6fd" opacity=".65" stroke="#b7d9ee" strokeWidth=".8" transform="rotate(24 19 17)" />
      <ellipse cx="27" cy="17" rx="7" ry="2.8" fill="#eaf6fd" opacity=".65" stroke="#b7d9ee" strokeWidth=".8" transform="rotate(-24 27 17)" />
    </g>
    <ellipse cx="23" cy="11.8" rx="4.4" ry="2.9" fill="#3f7fb5" />
    <circle cx="29.5" cy="10.6" r="2.9" fill="#2b5f8e" />
    <circle cx="30.4" cy="9.7" r="1" fill="#fff" opacity=".85" />
  </svg>
);

// QAMISH: poya + qo'ng'ir boshcha + barg-tig'lar; pastdan sway.
const Reed = ({ h = 64 }) => (
  <svg viewBox="0 0 20 70" width={Math.round(h * 20 / 70)} height={h} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M10 70 Q9 42 10 18" stroke="#4c8a41" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <rect x="7" y="5" width="6" height="16" rx="3" fill="#8a5a33" />
    <path d="M10 5 L10 1" stroke="#4c8a41" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 62 Q19 46 15 30" stroke="#5ea44d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M8 64 Q1 50 5 34" stroke="#5ea44d" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export default function D09_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda sakrash qayta ijro etilmaydi — statik yakuniy holat (qurbaqa 3-toshda).
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
    <div className="pq pq0903">
      <style>{`
        .pq0903{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0903 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f7fa3;text-transform:uppercase;}
        .pq0903 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0903 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0903 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0903 .pq-scene{position:relative;width:360px;height:232px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 40%,#dff2f5 44%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0903 .pq-sun{position:absolute;top:8px;right:12px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0903 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0903 .pq-cloud.c1{top:14px;left:-70px;animation-duration:32s;animation-delay:-14s;}
        .pq0903 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:40s;animation-delay:-27s;}
        .pq0903 .pq-shore{position:absolute;left:0;right:0;top:94px;height:9px;background:linear-gradient(#a5d18c,#8bbf74);z-index:0;}
        .pq0903 .pq-water{position:absolute;left:0;right:0;top:102px;bottom:0;background:linear-gradient(#8fd0cb 0%,#5aa8b4 45%,#3f8ea6 100%);z-index:0;}
        .pq0903 .pq-flora{position:absolute;left:0;top:82px;z-index:1;}
        .pq0903 .pq-reed{position:absolute;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;z-index:1;}
        .pq0903 .pq-rip{position:absolute;width:46px;height:14px;border:2px solid rgba(255,255,255,.55);border-radius:50%;animation:pqRip 6s ease-out infinite;z-index:1;}
        .pq0903 .pq-dfly{position:absolute;left:40px;top:40px;animation:pqDfly 13s ease-in-out infinite;z-index:5;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq0903 .pq-wingsT{transform-box:view-box;transform-origin:23px 11px;animation:pqFlut .14s linear infinite alternate;}
        .pq0903 .pq-wingsB{transform-box:view-box;transform-origin:23px 13px;animation:pqFlut .14s linear infinite alternate;animation-delay:.07s;}
        .pq0903 .pq-stone{position:absolute;top:${STONE_TOP}px;width:52px;height:40px;border-radius:50%;background:radial-gradient(ellipse at 40% 32%,#8cc97e,#5da24f 68%,#4c8a41);border:2.5px solid #35702c;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 0 rgba(24,66,84,.35);z-index:2;}
        .pq0903 .pq-stone.win{animation:pqCele .5s ease;}
        .pq0903 .pq-num{font-size:20px;font-weight:900;color:#fff;text-shadow:0 1px 2px rgba(20,60,25,.6);font-variant-numeric:tabular-nums;}
        .pq0903 .pq-num.pop{animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;color:#fdfdc9;}
        .pq0903 .pq-qm{display:inline-block;font-size:20px;font-weight:900;color:#fff;text-shadow:0 1px 2px rgba(20,60,25,.6);animation:pqQb 1.8s ease-in-out infinite;}
        .pq0903 .pq-arc{position:absolute;left:0;top:0;z-index:3;pointer-events:none;opacity:1;}
        .pq0903 .pq-scene:not(.still) .pq-arc{animation:pqArcIn .5s ease 1.15s both;}
        .pq0903 .pq-frogw{position:absolute;left:241px;top:112px;z-index:4;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0903 .pq-scene:not(.still) .pq-frogw{animation:pqHop 1.3s ease-in-out .9s both;}
        .pq0903 .pq-scene.still .pq-frogw{transform:translate(${HOP_DX}px,0);}
        .pq0903 .pq-poseJ{opacity:0;}
        .pq0903 .pq-scene:not(.still) .pq-poseS{animation:pqPoseS 1.3s linear .9s both;}
        .pq0903 .pq-scene:not(.still) .pq-poseJ{animation:pqPoseJ 1.3s linear .9s both;}
        .pq0903 .pq-throat{transform-box:fill-box;transform-origin:center;animation:pqThroat 2.4s ease-in-out infinite;}
        .pq0903 .pq-blink{opacity:0;animation:pqBlink 4.1s linear infinite;animation-delay:-1.6s;}
        .pq0903 .pq-cnt{position:absolute;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq0903 .pq-chip{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0903 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0903 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0903 .pq-opt:hover:not(:disabled){border-color:#a9d3e6;transform:translateY(-2px);}
        .pq0903 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0903 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0903 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0903 .pq-opt:disabled{cursor:default;}
        .pq0903 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0903 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0903 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqRip{0%{transform:scale(.25);opacity:0;}12%{opacity:.65;}70%{transform:scale(1.5);opacity:0;}100%{transform:scale(1.5);opacity:0;}}
        @keyframes pqDfly{0%{transform:translate(0,0);}22%{transform:translate(78px,26px);}45%{transform:translate(168px,4px);}68%{transform:translate(120px,-16px);}100%{transform:translate(0,0);}}
        @keyframes pqFlut{from{transform:scaleY(1);}to{transform:scaleY(.55);}}
        @keyframes pqHop{0%{transform:translate(0,0) scale(1,1);}14%{transform:translate(0,3px) scale(1.08,.88);}28%{transform:translate(-10px,-22px) scale(.96,1.06);}52%{transform:translate(-32px,-36px) scale(.96,1.06);}78%{transform:translate(-54px,-10px) scale(.98,1.02);}88%{transform:translate(-59px,3px) scale(1.07,.9);}100%{transform:translate(-59px,0) scale(1,1);}}
        @keyframes pqPoseS{0%,16%{opacity:1;}20%,80%{opacity:0;}86%,100%{opacity:1;}}
        @keyframes pqPoseJ{0%,16%{opacity:0;}20%,80%{opacity:1;}86%,100%{opacity:0;}}
        @keyframes pqThroat{0%,100%{transform:scale(1,1);}50%{transform:scale(1.15,1.3);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqArcIn{from{opacity:0;}to{opacity:1;}}
        @keyframes pqQb{0%,100%{transform:scale(1);}50%{transform:scale(1.16);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (still ? ' still' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-shore" /><span className="pq-water" />
        {/* qirg'oq-o't chetlarda */}
        <svg className="pq-flora" viewBox="0 0 360 20" width="360" height="20" aria-hidden="true">
          <path d="M8 19 q3 -10 5 -1 M17 20 q3 -11 6 -1 M28 19 q3 -9 5 -1 M330 19 q3 -10 5 -1 M341 20 q3 -11 6 -1 M351 19 q3 -9 5 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="40" y1="19" x2="40" y2="11" stroke="#5ea44d" strokeWidth="2" /><circle cx="40" cy="9" r="3" fill="#e88bb1" /><circle cx="40" cy="9" r="1.2" fill="#b1487a" /></g>
        </svg>
        {/* qamishlar — sway (toshlar orqasida) */}
        <span className="pq-reed" style={{ left: 4, top: 140 }}><Reed h={64} /></span>
        <span className="pq-reed" style={{ left: 20, top: 158, animationDelay: '-1.4s' }}><Reed h={48} /></span>
        <span className="pq-reed" style={{ left: 338, top: 104, animationDelay: '-2.2s' }}><Reed h={42} /></span>
        {/* suv-halqalar — kengayib so'nadi */}
        <span className="pq-rip" style={{ left: 66, top: 200, animationDelay: '-1s' }} />
        <span className="pq-rip" style={{ left: 282, top: 206, animationDelay: '-4s' }} />
        {/* ninachi — aylanma-suzish */}
        <span className="pq-dfly"><Dragonfly /></span>

        {/* SON O'QI: 6 nilufar-tosh 0-5, 3-tosh raqami «?» yopiq (g'alabada ochiladi) */}
        {STONE_X.map((cx, i) => (
          <span key={i} className={'pq-stone' + (ok && i === DATA.target ? ' win' : '')} style={{ left: cx - 26 }}>
            {i === DATA.target
              ? (ok ? <b className="pq-num pop">{DATA.target}</b> : <b className="pq-qm">?</b>)
              : <b className="pq-num">{i}</b>}
          </span>
        ))}

        {/* sakrash ARKI — punktir yoy 4-toshdan 3-toshga, strelka chapga */}
        <svg className="pq-arc" viewBox="0 0 360 232" width="360" height="232" aria-hidden="true">
          <path d="M268 140 Q238 96 213 132" stroke="#2b6ea3" strokeWidth="3" strokeDasharray="6 6" fill="none" strokeLinecap="round" />
          <polygon points="213,132 222.4,126.4 215,121.2" fill="#2b6ea3" />
        </svg>
        {/* g'alabada: bitta orqaga qadam — 1 badge ark cho'qqisida */}
        {ok && <b className="pq-cnt" style={{ left: 228, top: 82 }}>1</b>}

        {/* qurbaqa — mount'da 4-toshdan 3-toshga BIR orqaga sakraydi */}
        <span className="pq-frogw"><Frog /></span>

        {ok && <span className="pq-chip">{DATA.start} − {DATA.jump} = {DATA.target}</span>}
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
