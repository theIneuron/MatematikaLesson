// Dars20 · Amaliyot 05 — Make-ten-sub «Garaj» · 🔴 · tag: cross_sub
// Bitta-tanlov: garajda o'n oltita mashina (garaj to'la 10 + yo'lakchada 6). "16 − 9 = ?" → 7.
// G'alaba IKKI ANIQ QADAM: (1) avval yo'lakchadagi 6 mashina yo'lga chiqib ketadi (16−6=10),
// oraliq «10» ko'rsatiladi; (2) keyin garajdan 3 mashina chiqib ketadi (10−3=7). Qolgan yettitasi
// sanaladi. Chip «16 − 9 = 7», qadam «16 − 6 − 3 = 10 − 3». Make-ten-sub.
// Sahna (metodist 2026-07-12, real hayotiy): ochiq ko'cha — osmon, quyosh, bulut,
// uzoqda uylar va daraxtlar, garaj binosi, yo'l va svetofor.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 16, B = 9, TARGET = 7, TEN = 10;
const UNITS = A - TEN;        // 6 — teen birliklari (yo'lakcha); avval shular chiqadi
const FROMTEN = B - UNITS;    // 3 — o'nlikdan (garajdan) olinadigan qolgan qism
const DATA = { a: A, b: B, target: TARGET, options: [6, 7, 8], level: '🔴', tag: 'cross_sub' };

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// Garaj: 10 to'xtash joyi (2×5), hammasi to'la. G'alabada oxirgi FROMTEN(3) mashina
// chiqib ketadi → yettita qoladi (badge 1..7).
const GARAJ = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= TEN - FROMTEN, c: PAL[i % PAL.length] }));
// Yo'lakcha: UNITS(6) birlik mashina. G'alabada avval shular chiqib ketadi.
const LANE = Array.from({ length: UNITS }).map((_, i) => ({ i, c: PAL[(TEN + i) % PAL.length] }));

// KO'CHA ORQA FONI (ambient): uzoqdagi uylar + daraxtlar — syujet ko'chada kechadi.
// Matematik zonaga tegmaydi (z-index past, board belgisi ustidan yopadi).
const Town = () => (
  <svg className="pq-town" viewBox="0 0 400 46" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <g opacity=".9">
      <rect x="42" y="20" width="34" height="26" rx="2" fill="#e6dccb" stroke="#cbb999" strokeWidth="1" />
      <path d="M39 21 L59 7 L79 21 Z" fill="#cf7458" stroke="#ad573f" strokeWidth="1" strokeLinejoin="round" />
      <rect x="49" y="28" width="7" height="7" rx="1" fill="#a9c6e2" />
      <rect x="61" y="28" width="7" height="7" rx="1" fill="#a9c6e2" />
      <rect x="86" y="12" width="26" height="34" rx="2" fill="#d3dfec" stroke="#aabfd6" strokeWidth="1" />
      <rect x="91" y="18" width="6" height="6" fill="#f6ecc9" /><rect x="101" y="18" width="6" height="6" fill="#f6ecc9" />
      <rect x="91" y="29" width="6" height="6" fill="#f6ecc9" /><rect x="101" y="29" width="6" height="6" fill="#f6ecc9" />
      <rect x="122" y="34" width="4" height="12" rx="2" fill="#8a6242" />
      <circle cx="124" cy="26" r="10" fill="#85bd7b" />
      <circle cx="117" cy="31" r="6" fill="#74ad6b" />
      <rect x="272" y="34" width="4" height="12" rx="2" fill="#8a6242" />
      <circle cx="274" cy="27" r="9" fill="#85bd7b" />
      <rect x="290" y="18" width="30" height="28" rx="2" fill="#ead9d3" stroke="#cdb1a7" strokeWidth="1" />
      <path d="M287 19 L305 5 L323 19 Z" fill="#8aa6c8" stroke="#6d87a8" strokeWidth="1" strokeLinejoin="round" />
      <rect x="296" y="26" width="6" height="6" rx="1" fill="#f6ecc9" />
      <rect x="307" y="26" width="6" height="6" rx="1" fill="#f6ecc9" />
      <rect x="330" y="14" width="26" height="32" rx="2" fill="#d9e4d2" stroke="#b4c6a8" strokeWidth="1" />
      <rect x="335" y="20" width="6" height="6" fill="#f6ecc9" /><rect x="345" y="20" width="6" height="6" fill="#f6ecc9" />
      <rect x="335" y="31" width="6" height="6" fill="#f6ecc9" /><rect x="345" y="31" width="6" height="6" fill="#f6ecc9" />
    </g>
  </svg>
);

const T = {
  uz: {
    eyebrow: "Garaj · Ayirish", title: "To'qqiz mashina yo'lga chiqdi",
    setup: "16 mashinadan 9 tasi chiqib ketdi.",
    ask: "16 − 9 nechaga teng?",
    correct: "Barakalla! O'n oltidan oltitasi chiqib o'nta qoldi, yana uchtasi chiqdi — yettita. 16 − 9 = 7.",
    hint: "Avval birliklarni ayiring: o'n oltidan oltitasini chiqaring — o'nta qoladi. To'qqizdan oltitasi chiqdi, qolgan uchtasini o'ndan oling.",
  },
  ru: {
    eyebrow: "Гараж · Вычитание", title: "Девять машин выехали",
    setup: "Из 16 машин выехали 9.",
    ask: "Сколько будет 16 − 9?",
    correct: "Молодец! Из шестнадцати выехали шесть — осталось десять, ещё три — семь. 16 − 9 = 7.",
    hint: "Сначала вычти единицы: из шестнадцати убери шесть — станет десять. Из девяти уехали шесть, а оставшиеся три вычти из десятка.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (radial 2-ton) + tom +
// oynalar + 2 g'ildirak + fara. Bitta mashina = bitta birlik. Chiqishda g'ildiraklar aylanadi.
let __gid = 0;
const Car = ({ c, size = 27 }) => {
  const id = 'd2005c' + (__gid++);
  return (
    <svg viewBox="0 0 48 30" width={size} height={size * 30 / 48} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="60%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      {/* tom / kabina */}
      <path d="M14 13 L18 6 Q19 5 20.5 5 L31 5 Q32.5 5 33.5 6.5 L37 13 Z" fill={c.main} stroke={c.dark} strokeWidth=".8" />
      {/* oynalar */}
      <path d="M18.5 12 L21 7.4 L24.7 7.4 L24.7 12 Z" fill="#dff1fb" stroke={c.dark} strokeWidth=".5" />
      <path d="M26.3 7.4 L30.5 7.4 Q31.4 7.4 32 8.4 L34.4 12 L26.3 12 Z" fill="#dff1fb" stroke={c.dark} strokeWidth=".5" />
      {/* tana */}
      <path d="M4 22 L5.5 15 Q6 12.6 8.5 12.6 L39.5 12.6 Q42 12.6 43 14.6 L45 20 Q45.4 22 43.4 22 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" />
      {/* fara */}
      <ellipse cx="43.2" cy="17.4" rx="1.7" ry="2" fill="#fff4c2" stroke={c.dark} strokeWidth=".4" />
      {/* oq blik */}
      <path d="M9 15.4 L37 15.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".4" />
      {/* g'ildiraklar */}
      <g className="whl"><circle cx="14.5" cy="22.5" r="5.2" fill="#2b2f36" /><circle cx="14.5" cy="22.5" r="2.2" fill="#c7ccd4" /><rect x="13.9" y="18" width="1.2" height="9" fill="#8b929c" /><rect x="10" y="21.9" width="9" height="1.2" fill="#8b929c" /></g>
      <g className="whl"><circle cx="33.5" cy="22.5" r="5.2" fill="#2b2f36" /><circle cx="33.5" cy="22.5" r="2.2" fill="#c7ccd4" /><rect x="32.9" y="18" width="1.2" height="9" fill="#8b929c" /><rect x="29" y="21.9" width="9" height="1.2" fill="#8b929c" /></g>
    </svg>
  );
};

export default function D20_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqib-ketish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  // Chiqib ketish tartibi (IKKI QADAM): avval yo'lakcha birliklari (6), keyin garajdan (3).
  const driveLane = (i) => i * 0.14;                          // birliklar: 0 .. 0.70
  const driveGar = (i) => 1.25 + (i - (TEN - FROMTEN)) * 0.18; // o'nlikdan: 1.25, 1.43, 1.61

  return (
    <div className="pq pq2005">
      <style>{`
        .pq2005{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2005 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2005 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2005 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2005 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2005 .pq-scene{position:relative;width:392px;max-width:100%;height:262px;margin:0 auto;border-radius:20px;background:linear-gradient(#dff1fb 0%,#eaf2fb 52%,#eef1f5 100%);border:2px solid #d3ddec;overflow:hidden;}
        .pq2005 .pq-sun{position:absolute;left:18px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2005 .pq-cloud{position:absolute;top:3px;right:60px;width:48px;height:15px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:13px 4px 0 -3px rgba(255,255,255,.8),-13px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2005 .pq-town{position:absolute;left:0;top:6px;width:100%;height:46px;z-index:1;pointer-events:none;}
        .pq2005 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4f7fb2,#3a6193);border:2.5px solid #2c4c74;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* svetofor */
        .pq2005 .pq-tl{position:absolute;right:16px;top:40px;z-index:2;width:16px;height:38px;border-radius:5px;background:linear-gradient(#3a4049,#23272e);border:2px solid #171a1f;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;box-shadow:0 3px 5px rgba(0,0,0,.22);}
        .pq2005 .pq-tl i{width:8px;height:8px;border-radius:50%;background:#4b525c;}
        .pq2005 .pq-tl i.r{background:#e0463d;box-shadow:0 0 5px 1px rgba(224,70,61,.75);}
        .pq2005 .pq-tl i.g{background:#57c26a;box-shadow:0 0 6px 2px rgba(87,194,106,.85);animation:pqBlink 1.1s steps(1) infinite;}
        .pq2005 .pq-tlpole{position:absolute;right:22px;top:78px;width:4px;height:20px;background:#565c66;z-index:1;}
        /* yo'l */
        .pq2005 .pq-road{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#5b626c,#454b54);border-top:3px solid #2f343b;z-index:1;}
        .pq2005 .pq-road::after{content:'';position:absolute;left:0;right:0;top:15px;height:3px;background:repeating-linear-gradient(90deg,#f4d24a 0 16px,transparent 16px 30px);}

        .pq2005 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:40px;display:flex;align-items:center;justify-content:center;gap:11px;z-index:3;}
        /* garaj bino */
        .pq2005 .pq-garage{position:relative;padding:16px 9px 10px;border-radius:12px 12px 10px 10px;background:linear-gradient(#e7ded1,#d2c4b0);border:2.5px solid #a7906f;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.4);flex:0 0 auto;}
        .pq2005 .pq-garage::before{content:'';position:absolute;left:-4px;right:-4px;top:-9px;height:12px;border-radius:7px 7px 3px 3px;background:linear-gradient(#c0453d,#9c3129);border:2px solid #7f251e;box-shadow:0 2px 3px rgba(0,0,0,.2);}
        .pq2005 .pq-garage.win{animation:pqBoxCele .55s ease;}
        .pq2005 .pq-grid{display:grid;grid-template-columns:repeat(5,32px);grid-auto-rows:23px;gap:4px;}
        .pq2005 .pq-cell{position:relative;border-radius:5px;background:rgba(255,252,246,.55);border:1.4px solid rgba(120,90,50,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(90,60,25,.16);}
        .pq2005 .pq-cell.empty{background:rgba(120,90,50,.14);border-style:dashed;border-color:rgba(120,90,50,.5);}
        .pq2005 .pq-cw{line-height:0;}
        .pq2005 .pq-cw.drive{animation:pqDrive .72s cubic-bezier(.45,.05,.75,.4) forwards;animation-delay:var(--dd,0s);}
        .pq2005 .whl{transform-box:fill-box;transform-origin:50% 50%;}
        .pq2005 .pq-cw.drive .whl{animation:pqRoll .42s linear infinite;animation-delay:var(--dd,0s);}
        .pq2005 .pq-cnt{position:absolute;top:-7px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq2005 .pq-mid{position:absolute;left:50%;top:-13px;transform:translateX(-50%);z-index:7;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;animation:pqMid 1.5s .85s both;}
        .pq2005 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s 1.95s both;font-variant-numeric:tabular-nums;}
        .pq2005 .pq-plus{font-size:22px;font-weight:900;color:#a05a2e;flex:0 0 auto;}
        /* yo'lakcha */
        .pq2005 .pq-lane{position:relative;padding:8px 8px 9px;border-radius:11px;background:linear-gradient(#cdd3db,#b3bbc5);border:2.5px solid #8a939f;box-shadow:0 5px 11px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.35);flex:0 0 auto;}
        .pq2005 .pq-lanegrid{display:grid;grid-template-columns:repeat(2,32px);grid-auto-rows:23px;gap:4px;}
        .pq2005 .pq-lcell{position:relative;border-radius:5px;background:rgba(255,255,255,.4);border:1.4px dashed rgba(90,100,115,.45);display:flex;align-items:center;justify-content:center;}
        .pq2005 .pq-lcell.empty{background:rgba(90,100,115,.12);}
        .pq2005 .pq-tag{position:absolute;left:50%;bottom:-10px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #6b7280;color:#4b5563;font-weight:900;font-size:11px;padding:0 8px;border-radius:999px;font-variant-numeric:tabular-nums;}

        .pq2005 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2005 .pq-spark.s2{animation-delay:-.6s;} .pq2005 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2005 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq2005 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2005 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2005 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2005 .pq-subm{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq2005 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2005 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2005 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2005 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2005 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2005 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2005 .pq-opt:disabled{cursor:default;}
        .pq2005 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2005 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2005 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrive{0%{opacity:1;transform:translate(0,0);}70%{opacity:1;transform:translate(58px,7px);}100%{opacity:0;transform:translate(104px,12px);}}
        @keyframes pqRoll{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqMid{0%{opacity:0;transform:translateX(-50%) scale(.5);}18%{opacity:1;transform:translateX(-50%) scale(1);}72%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.9);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqBlink{0%,60%{opacity:1;}61%,100%{opacity:.35;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @media (prefers-reduced-motion: reduce){.pq2005 .pq-cw.drive,.pq2005 .pq-cw.drive .whl,.pq2005 .pq-sun,.pq2005 .pq-tl i.g{animation:none!important;}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" /><span className="pq-cloud" />
        <Town />
        <div className="pq-board">{t.title}</div>
        <div className="pq-tl"><i className="r" /><i /><i className="g" /></div>
        <span className="pq-tlpole" />

        <div className="pq-arena">
          {/* GARAJ: o'nta joy. G'alabada oxirgi uchtasi chiqib ketadi → yettita qoladi (badge 1..7) */}
          <div className={'pq-garage' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {GARAJ.map((s) => {
                const stay = !s.gone;                 // qoladigan mashinalar
                return (
                  <div key={s.i} className={'pq-cell' + (ok && s.gone ? ' empty' : '')}>
                    {stay && (
                      <span className="pq-cw">
                        <Car c={s.c} size={28} />
                        {ok && <b className="pq-cnt">{s.i + 1}</b>}
                      </span>
                    )}
                    {s.gone && !ok && (
                      <span className="pq-cw"><Car c={s.c} size={28} /></span>
                    )}
                    {s.gone && ok && !still && (
                      <span className="pq-cw drive" style={{ '--dd': `${driveGar(s.i)}s` }}><Car c={s.c} size={28} /></span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-mid">{TEN}</span>}
            {ok && <span className="pq-lbl">{TARGET}</span>}
          </div>

          {/* O'nlik VA birliklar QO'SHILIB minuendni (16) beradi: 10 + 6, ayirish EMAS. */}
          <span className="pq-plus">{'+'}</span>

          {/* YO'LAKCHA: oltita birlik. G'alabada avval shular chiqib ketadi */}
          <div className="pq-lane">
            <div className="pq-lanegrid">
              {LANE.map((s) => (
                <div key={s.i} className={'pq-lcell' + (ok ? ' empty' : '')}>
                  {!ok && (<span className="pq-cw"><Car c={s.c} size={28} /></span>)}
                  {ok && !still && (
                    <span className="pq-cw drive" style={{ '--dd': `${driveLane(s.i)}s` }}><Car c={s.c} size={28} /></span>
                  )}
                </div>
              ))}
            </div>
            {!ok && <span className="pq-tag">{UNITS}</span>}
          </div>
        </div>

        <span className="pq-road" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '80%', top: '110px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '48%', top: '42px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'−'}</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-subm">{A} {'−'} {UNITS} {'−'} {FROMTEN} = {TEN} {'−'} {FROMTEN}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === TARGET;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
