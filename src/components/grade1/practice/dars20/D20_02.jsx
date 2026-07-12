// Dars20 · Amaliyot 02 — Make-ten-sub «Garaj» · 🟡 · tag: cross_sub
// Bitta-tanlov: garajda o'n uchta mashina (10 joy to'la + yo'lakchada 3). "13 − 5 = ?" → 8.
// IKKI ANIQ QADAM animatsiya (metodist B): (1) avval yo'lakchadagi 3 birlik chiqib ketadi
// (13 − 3 = 10) — oraliq «10» ko'rsatiladi, qisqa pauza; (2) keyin garajdan (o'nlikdan) 2 chiqadi
// (10 − 2 = 8). Mashina joydan chiqib yo'lga qarab siljiydi, g'ildirak aylanadi — sekin, bir-martalik.
// Chip «13 − 5 = 8», qadam «13 − 3 − 2 = 10 − 2». VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q;
// setChecked FAQAT to'g'rida.
// Sahna (metodist 2026-07-12): gofrasimon tent-tom OLINDI — syujet ochiq ko'chada: osmon,
// quyosh, bulut, uzoqda uylar va daraxtlar, pastda yo'l va svetofor.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 13, B = 5, TARGET = 8, TEN = 10;
const UNITS = A - TEN;        // 3 — teen birliklari (yo'lakcha); avval shular chiqadi
const FROMTEN = B - UNITS;    // 2 — o'nlikdan (garajdan) chiqadigan qolgani
const DATA = { a: A, b: B, target: TARGET, options: [7, 8, 9], level: '🟡', tag: 'cross_sub' };

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#f0938b', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// Garaj: 10 joy (5×2), hammasi to'la. G'alabada oxirgi FROMTEN(2) mashina chiqadi → sakkizta qoladi.
const GARAGE = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= TEN - FROMTEN, c: PAL[i % PAL.length] }));
// Yo'lakcha: UNITS(3) mashina — birliklar. G'alabada uchtasi ham chiqib ketadi (avval shular).
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
    eyebrow: "Garaj · Ayirish", title: "Beshta mashina chiqib ketdi",
    setup: "13 mashinadan 5 tasi chiqib ketdi.",
    ask: "13 − 5 nechaga teng?",
    correct: "Barakalla! O'n uchdan uchtasi chiqib o'nta qoldi, yana ikkitasi chiqdi — sakkizta. 13 − 5 = 8.",
    hint: "Avval birliklarni ayiring: o'n uchdan uchtasini chiqaring — o'nta qoladi. Beshdan uchtasi chiqdi, qolgan ikkitasini o'ndan chiqaring.",
  },
  ru: {
    eyebrow: "Гараж · Вычитание", title: "Пять машин выехали",
    setup: "Из 13 машин выехали 5.",
    ask: "Сколько будет 13 − 5?",
    correct: "Молодец! Из тринадцати выехали три — осталось десять, ещё две — восемь. 13 − 5 = 8.",
    hint: "Сначала вычти единицы: из тринадцати убери три — станет десять. Из пяти выехали три, а оставшиеся две вычти из десятка.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (2-ton gradient) + kabina +
// oynalar + 2 g'ildirak + fara. Bitta mashina = bitta birlik. Rang palitradan.
let __gid = 0;
const Car = ({ c, w = 30 }) => {
  const id = 'd2002c' + (__gid++);
  const h = w * 30 / 46;
  return (
    <svg viewBox="0 0 46 30" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* tana + kabina silueti */}
      <path d="M2.5,24 L2.5,20 Q2.5,17.4 5,17 L13,16.6 L17,9.6 Q18.2,8 20.6,8 L29.4,8 Q31.8,8 33,9.9 L37,16.6 L41.6,17.2 Q43.5,17.6 43.5,20 L43.5,24 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" strokeLinejoin="round" />
      {/* oynalar */}
      <path d="M19.4,15.6 L21.4,10.2 L24.4,10.2 L24.4,15.6 Z" fill="#d6eeff" stroke={c.dark} strokeWidth=".5" />
      <path d="M25.6,15.6 L25.6,10.2 L28.6,10.2 L31,15.6 Z" fill="#d6eeff" stroke={c.dark} strokeWidth=".5" />
      {/* fara */}
      <circle cx="41.4" cy="20.4" r="1.5" fill="#fff3b0" stroke={c.dark} strokeWidth=".4" />
      {/* oq blik */}
      <path d="M6,19.4 Q22,17.8 40,19.4" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" opacity=".45" />
      {/* g'ildiraklar (aylanadigan) */}
      <g className="pq-wheel">
        <circle cx="13" cy="24" r="4.4" fill="#2a2f3a" />
        <circle cx="13" cy="24" r="1.9" fill="#c3cad6" />
        <line x1="13" y1="24" x2="13" y2="20.4" stroke="#8b93a2" strokeWidth="1" strokeLinecap="round" />
      </g>
      <g className="pq-wheel">
        <circle cx="33" cy="24" r="4.4" fill="#2a2f3a" />
        <circle cx="33" cy="24" r="1.9" fill="#c3cad6" />
        <line x1="33" y1="24" x2="33" y2="20.4" stroke="#8b93a2" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default function D20_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqib-ketish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bosiladigan nishon EMAS)

  // IKKI QADAM tartibi: (1) yo'lakcha birliklari (3) sekin chiqadi → oraliq «10» → (2) garajdan 2.
  const laneDelay = (i) => i * 0.28;                  // birliklar: 0, .28, .56 (sekin)
  const MID_AT = 1.35;                                 // oraliq «10» — birliklar chiqib bo'lgach
  const garageDelay = (i) => 2.55 + (i - (TEN - FROMTEN)) * 0.28; // o'nlikdan: 2.55, 2.83
  const lblDelay = still ? 0 : 3.55;                   // yakuniy «8»

  return (
    <div className="pq pq2002">
      <style>{`
        .pq2002{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2002 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2002 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2002 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2002 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2002 .pq-scene{position:relative;width:380px;max-width:100%;height:252px;margin:0 auto;border-radius:20px;background:linear-gradient(#dbeefb 0%,#e8f0fa 52%,#eef1f6 100%);border:2px solid #cdd9e8;overflow:hidden;}
        .pq2002 .pq-sun{position:absolute;left:18px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2002 .pq-cloud{position:absolute;top:4px;right:16px;width:48px;height:15px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:13px 4px 0 -3px rgba(255,255,255,.8),-13px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2002 .pq-town{position:absolute;left:0;top:6px;width:100%;height:46px;z-index:1;pointer-events:none;}
        .pq2002 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f7bb0,#2f6191);border:2.5px solid #234c74;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* yo'l (asfalt) — pastda, uzuq markaziy chiziq bilan */
        .pq2002 .pq-road{position:absolute;left:0;right:0;bottom:0;height:32px;background:linear-gradient(#59626e,#454d58);border-top:3px solid #333a44;z-index:1;}
        .pq2002 .pq-road::after{content:'';position:absolute;left:0;right:0;top:14px;height:3px;background:repeating-linear-gradient(90deg,#f6d64a 0 16px,transparent 16px 30px);}
        /* svetofor — o'ngda, mayda jonli detal */
        .pq2002 .pq-tl{position:absolute;right:14px;bottom:34px;width:12px;height:30px;border-radius:4px;background:#2c333d;border:1.5px solid #1c222a;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;box-shadow:0 2px 4px rgba(0,0,0,.25);}
        .pq2002 .pq-tl i{width:6px;height:6px;border-radius:50%;background:#5a636e;}
        .pq2002 .pq-tl i.r{background:#e2554d;box-shadow:0 0 5px #e2554d;animation:pqBlink 2.2s steps(1) infinite;}
        .pq2002 .pq-tl i.g{background:#4aa657;box-shadow:0 0 5px #4aa657;animation:pqBlink 2.2s steps(1) 1.1s infinite;}

        .pq2002 .pq-arena{position:absolute;left:10px;right:10px;top:44px;bottom:40px;display:flex;align-items:center;justify-content:center;gap:10px;z-index:3;}
        /* garaj bino/karkas — 5×2 to'xtash joyi */
        .pq2002 .pq-garage{position:relative;padding:9px 10px 11px;border-radius:12px;background:linear-gradient(#e9edf2,#cfd6df);border:2.5px solid #8a95a3;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.5);flex:0 0 auto;}
        .pq2002 .pq-garage.win{animation:pqBoxCele .55s ease;}
        .pq2002 .pq-grid{display:grid;grid-template-columns:repeat(5,28px);grid-auto-rows:22px;gap:4px;}
        /* yo'lakcha — 3 to'xtash joyi qatori */
        .pq2002 .pq-lane{position:relative;padding:9px 8px 11px;border-radius:12px;background:linear-gradient(#e3e8ee,#c9d1da);border:2.5px dashed #96a0ad;flex:0 0 auto;}
        .pq2002 .pq-lanegrid{display:grid;grid-template-columns:repeat(1,28px);grid-auto-rows:22px;gap:4px;}
        .pq2002 .pq-cell{position:relative;border-radius:5px;background:rgba(70,80,92,.14);border:1.4px solid rgba(90,100,112,.35);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(50,58,68,.12);}
        .pq2002 .pq-cell.empty{background:rgba(70,80,92,.06);border-style:dashed;border-color:rgba(90,100,112,.4);}
        .pq2002 .pq-cw{line-height:0;}
        .pq2002 .pq-cw.idle{animation:pqBob 2.8s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2002 .pq-cw.drive{animation:pqDrive .85s cubic-bezier(.45,0,.75,1) forwards;animation-delay:var(--fd,0s);}
        .pq2002 .pq-cw.drive .pq-wheel{transform-box:fill-box;transform-origin:center;animation:pqSpin .3s linear infinite;}
        .pq2002 .pq-cw.drive .pq-wheel:nth-of-type(2){animation-delay:0s;}
        .pq2002 .pq-cnt{position:absolute;top:-7px;right:-6px;min-width:16px;height:16px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        /* oraliq «10» — birliklar chiqib bo'lgach, pauzada; keyin yo'qoladi (faqat jonli) */
        .pq2002 .pq-mid{position:absolute;left:50%;top:-13px;transform:translateX(-50%);z-index:7;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:13px;padding:1px 11px;border-radius:999px;box-shadow:0 2px 5px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;opacity:0;animation:pqMid 1.15s ${MID_AT}s both;}
        .pq2002 .pq-lbl{position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s var(--ld,0s) both;font-variant-numeric:tabular-nums;}
        .pq2002 .pq-plus{font-size:22px;font-weight:900;color:#5c6672;flex:0 0 auto;}

        .pq2002 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2002 .pq-spark.s2{animation-delay:-.6s;} .pq2002 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2002 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq2002 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2002 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2002 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2002 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq2002 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2002 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2002 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2002 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2002 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2002 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2002 .pq-opt:disabled{cursor:default;}
        .pq2002 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2002 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2002 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pqDrive{0%{opacity:1;transform:translateX(0);}15%{transform:translateX(-4px);}100%{opacity:0;transform:translateX(96px);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqMid{0%{opacity:0;transform:translateX(-50%) scale(.5);}18%{opacity:1;transform:translateX(-50%) scale(1);}82%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.85);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqBlink{0%,60%{opacity:1;}61%,100%{opacity:.28;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" /><span className="pq-cloud" />
        <Town />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* Garaj: o'nta joy. G'alabada oxirgi ikkita mashina chiqadi → sakkizta qoladi (badge 1..8) */}
          <div className={'pq-garage' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {GARAGE.map((s) => {
                const stay = !s.gone;                     // qoladigan mashinalar
                return (
                  <div key={s.i} className={'pq-cell' + (s.gone && (ok || false) ? ' empty' : '')}>
                    {stay && (
                      <span className={'pq-cw' + (idle ? ' idle' : '')} style={{ '--bd': `${s.i * 0.1}s` }}>
                        <Car c={s.c} w={26} />
                        {ok && <b className="pq-cnt">{s.i + 1}</b>}
                      </span>
                    )}
                    {s.gone && !ok && (
                      <span className={'pq-cw' + (idle ? ' idle' : '')} style={{ '--bd': `${s.i * 0.1}s` }}>
                        <Car c={s.c} w={26} />
                      </span>
                    )}
                    {s.gone && ok && !still && (
                      <span className="pq-cw drive" style={{ '--fd': `${garageDelay(s.i)}s` }}>
                        <Car c={s.c} w={26} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && !still && <span className="pq-mid">{TEN}</span>}
            {ok && <span className="pq-lbl" style={{ '--ld': `${lblDelay}s` }}>{TARGET}</span>}
          </div>

          {/* O'nlik VA birliklar QO'SHILIB minuendni (13) beradi: 10 + 3, ayirish EMAS. */}
          <span className="pq-plus">{'+'}</span>

          {/* Yo'lakcha: uchta birlik. G'alabada uchtasi ham chiqib ketadi (avval shular) */}
          <div className="pq-lane">
            <div className="pq-lanegrid">
              {LANE.map((s) => (
                <div key={s.i} className={'pq-cell' + (ok ? ' empty' : '')}>
                  {!ok && (
                    <span className={'pq-cw' + (idle ? ' idle' : '')} style={{ '--bd': `${(TEN + s.i) * 0.1}s` }}>
                      <Car c={s.c} w={26} />
                    </span>
                  )}
                  {ok && !still && (
                    <span className="pq-cw drive" style={{ '--fd': `${laneDelay(s.i)}s` }}>
                      <Car c={s.c} w={26} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className="pq-road" />
        <div className="pq-tl"><i className="r" /><i /><i className="g" /></div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '56px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '80%', top: '68px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '42px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'−'}</i><b>{B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{A} {'−'} {UNITS} {'−'} {FROMTEN} = {TEN} {'−'} {FROMTEN}</div>
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
