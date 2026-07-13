// Dars20 · Amaliyot 09 — Og'zaki masala «Garaj» · 🔴 · tag: cross_word
// Hikoya: garajda o'n uchta mashina bor edi, beshtasi chiqib ketdi. Nechta qoldi? → 8.
// Garaj = ten-frame (2×5 = 10 to'la joy) + yo'lakchada uchta birlik-mashina.
// Make-ten-sub IKKI ANIQ QADAM: (1) avval yo'lakcha birliklari (3 ta) chiqib ketadi — 13−3=10,
// oraliq «10» ko'rsatiladi; qisqa pauza; (2) keyin o'nlikdan qolgani (2 ta) chiqadi — 10−2=8.
// Mashina haqiqatan chiqib ketadi: yo'lga qarab siljiydi, g'ildirak aylanadi (bir-martalik, sekin).
// Chip «13 − 5 = 8», ost-satr «13 − 3 − 2 = 10 − 2».
// Sahna (metodist 2026-07-12, real hayotiy): ochiq ko'cha — osmon, quyosh, bulut,
// uzoqda uylar va daraxtlar, garaj binosi, yo'l va svetofor. Chiziqli tent-tom YO'Q.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 13, B = 5, TARGET = 8, TEN = 10;
const UNITS = A - TEN;        // 3 — teen birliklari (yo'lakcha); avval shular chiqadi
const FROMTEN = B - UNITS;    // 2 — o'nlikdan chiqadigan qolgan qism
const DATA = { a: A, b: B, target: TARGET, options: [7, 8, 9], level: '🔴', tag: 'cross_word' };

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// Garaj (10 joy, hammasi to'la). G'alabada oxirgi FROMTEN(2) mashina chiqadi → sakkizta qoladi.
const GARAJ = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= TEN - FROMTEN, c: PAL[i % PAL.length] }));
// Yo'lakcha: uchta birlik-mashina (teen birliklari). G'alabada uchtasi ham chiqadi (avval shular).
const YARD = Array.from({ length: UNITS }).map((_, i) => ({ i, c: PAL[(TEN + i) % PAL.length] }));

const T = {
  uz: {
    eyebrow: "Garaj · Og'zaki masala", title: "Beshta mashina chiqib ketdi",
    setup: "13 mashinadan 5 tasi chiqib ketdi.",
    ask: "Nechta mashina qoldi?",
    correct: "Barakalla! O'n uchdan uchtasi chiqib o'nta qoldi, yana ikkitasi chiqdi — sakkizta. 13 − 5 = 8.",
    hint: "Avval birliklarni ayiring: o'n uchdan uchtasini chiqaring — o'nta qoladi. Beshdan uchtasi ketdi, qolgan ikkitasini o'ndan chiqaring.",
  },
  ru: {
    eyebrow: 'Гараж · Задача', title: 'Пять машин уехали',
    setup: 'Из 13 машин уехали 5.',
    ask: 'Сколько машин осталось?',
    correct: 'Молодец! Из тринадцати уехали три — осталось десять, ещё две — восемь. 13 − 5 = 8.',
    hint: 'Сначала вычти единицы: из тринадцати убери три — станет десять. Из пяти ушли три, а оставшиеся две вычти из десятка.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KO'CHA ORQA FONI (ambient): uzoqdagi uylar + daraxtlar — syujet ochiq ko'chada kechadi.
// Matematik zonaga tegmaydi (z-index past, garaj ustidan yopadi).
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

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — kabina (2-ton tana) + oynalar +
// ikki g'ildirak + fara (old, o'ng tomon). Bitta mashina = bitta birlik. O'ngga qaragan
// (chiqib ketganda o'ngga — yo'lga — siljiydi). Chiqishda g'ildiraklar aylanadi (.wheel).
let __gid = 0;
const Car = ({ c, size = 26 }) => {
  const id = 'd2009c' + (__gid++);
  return (
    <svg viewBox="0 0 46 28" width={size} height={size * 28 / 46} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* kabina + tom */}
      <path d="M13 13 L17 5.5 Q18 4.5 20 4.5 L28 4.5 Q30 4.5 31 5.5 L35 13 Z" fill={c.main} stroke={c.dark} strokeWidth=".8" strokeLinejoin="round" />
      {/* oynalar */}
      <path d="M18.5 12 L21 6.5 L23 6.5 L23 12 Z" fill="#e7f4ff" stroke={c.dark} strokeWidth=".5" />
      <path d="M24.5 12 L24.5 6.5 L27 6.5 L29.5 12 Z" fill="#e7f4ff" stroke={c.dark} strokeWidth=".5" />
      {/* tana */}
      <path d="M4 22 Q3.5 13.5 11 13 L34 13 Q41 13.5 42.5 20 L42.5 22 Q42.5 23.6 40.5 23.6 L6 23.6 Q4 23.6 4 22 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" />
      {/* fara (old) */}
      <circle cx="40.8" cy="18" r="1.7" fill="#fff3c0" stroke="#d9a300" strokeWidth=".4" />
      {/* g'ildiraklar */}
      <g className="wheel">
        <circle cx="14" cy="23.5" r="4.4" fill="#2b2f36" />
        <circle cx="14" cy="23.5" r="1.9" fill="#c7ccd4" />
        <path d="M14 20.2 V26.8 M10.7 23.5 H17.3" stroke="#8a9099" strokeWidth=".8" />
      </g>
      <g className="wheel">
        <circle cx="32" cy="23.5" r="4.4" fill="#2b2f36" />
        <circle cx="32" cy="23.5" r="1.9" fill="#c7ccd4" />
        <path d="M32 20.2 V26.8 M28.7 23.5 H35.3" stroke="#8a9099" strokeWidth=".8" />
      </g>
    </svg>
  );
};

export default function D20_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqib-ketish animatsiyasi qayta ijro etilmaydi — statik yakun.
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
  const anim = ok && !still;           // faqat jonli g'alabada animatsiya

  // QADAM 1: yo'lakcha birliklari (3) chiqadi — 13−3=10. QADAM 2: o'nlikdan qolgani (2).
  const driveYard = (i) => i * 0.2;                         // birliklar: 0, .2, .4  (tugash ~1.15s)
  const driveGar = (i) => 1.75 + (i - (TEN - FROMTEN)) * 0.2; // o'nlikdan: 1.75, 1.95 (pauzadan keyin)
  const badgeDelay = still ? '0s' : '2.8s';                 // sanoq faqat oxirida ochiladi

  return (
    <div className="pq pq2009">
      <style>{`
        .pq2009{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2009 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2009 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2009 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2009 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2009 .pq-scene{position:relative;width:392px;max-width:100%;height:262px;margin:0 auto;border-radius:20px;background:linear-gradient(#dff1fb 0%,#eaf2fb 52%,#eef1f4 100%);border:2px solid #d3ddec;overflow:hidden;}
        .pq2009 .pq-sun{position:absolute;left:18px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2009 .pq-cloud{position:absolute;top:8px;right:66px;width:48px;height:15px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:13px 4px 0 -3px rgba(255,255,255,.8),-13px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2009 .pq-town{position:absolute;left:0;top:8px;width:100%;height:44px;z-index:1;pointer-events:none;}
        /* svetofor (mayda ambient, o'ng yuqori) */
        .pq2009 .pq-light{position:absolute;right:16px;top:14px;width:14px;z-index:2;}
        .pq2009 .pq-light .pole{position:absolute;left:5px;top:34px;width:4px;height:40px;background:linear-gradient(#8a919c,#5c626c);border-radius:2px;}
        .pq2009 .pq-light .box{position:relative;width:14px;padding:3px 0;border-radius:5px;background:#3a3f47;border:1.5px solid #23262b;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:0 1px 3px rgba(0,0,0,.25);}
        .pq2009 .pq-light .box i{width:6px;height:6px;border-radius:50%;opacity:.35;}
        .pq2009 .pq-light .box i.r{background:#e8524a;} .pq2009 .pq-light .box i.y{background:#f2b134;} .pq2009 .pq-light .box i.g{background:#57a84f;}
        .pq2009 .pq-light .box i.on{opacity:1;box-shadow:0 0 6px currentColor;animation:pqBlink 2.4s steps(1,end) infinite;}
        .pq2009 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4f7fb2,#3a6193);border:2.5px solid #2c4c74;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* yo'l (pastki) + o'rta chiziq */
        .pq2009 .pq-road{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#5b636e,#464d57);border-top:3px solid #343a43;z-index:1;}
        .pq2009 .pq-road::after{content:'';position:absolute;left:0;right:0;top:15px;height:3px;background:repeating-linear-gradient(90deg,#f2d264 0 16px,transparent 16px 34px);}

        .pq2009 .pq-arena{position:absolute;left:10px;right:10px;top:42px;bottom:40px;display:flex;align-items:center;justify-content:center;gap:11px;z-index:3;}
        /* garaj bino: to'la (10) to'xtash joyi */
        .pq2009 .pq-garaj{position:relative;padding:16px 10px 11px;border-radius:12px 12px 10px 10px;background:linear-gradient(#e9edf2,#cfd6df);border:2.5px solid #9aa5b2;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.55);flex:0 0 auto;}
        .pq2009 .pq-garaj.win{animation:pqBoxCele .55s ease;}
        .pq2009 .pq-garaj::before{content:'';position:absolute;left:-4px;right:-4px;top:-11px;height:12px;background:linear-gradient(#c04a42,#a13a33);border:2px solid #86302a;border-radius:6px 6px 3px 3px;box-shadow:0 2px 4px rgba(0,0,0,.2);}
        .pq2009 .pq-grid{display:grid;grid-template-columns:repeat(5,30px);grid-auto-rows:22px;gap:4px;}
        .pq2009 .pq-slot{position:relative;border-radius:6px;background:rgba(120,132,148,.16);border:1.4px solid rgba(120,132,148,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(60,68,80,.14);}
        .pq2009 .pq-slot.empty{background:rgba(90,99,110,.12);border-style:dashed;border-color:rgba(120,132,148,.55);}
        .pq2009 .pq-cw{line-height:0;position:relative;}
        .pq2009 .pq-cw.drive{animation:pqDrive .8s cubic-bezier(.45,.05,.75,.35) forwards;animation-delay:var(--fd,0s);}
        .pq2009 .fly .wheel,.pq2009 .drive .wheel{transform-box:fill-box;transform-origin:center;animation:pqSpin .38s linear infinite;}
        .pq2009 .pq-cnt{position:absolute;top:-8px;right:-6px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s var(--pd,0s) both;}
        .pq2009 .pq-lbl{position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:12px;padding:1px 10px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;}
        .pq2009 .pq-lbl.fin{animation:pqPop .4s var(--ld,0s) both;}
        /* oraliq «10» — 1-qadam tugagach chiqib, 2-qadam boshida so'nadi */
        .pq2009 .pq-ten{position:absolute;left:50%;top:-15px;transform:translateX(-50%);z-index:7;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:13px;padding:1px 11px;border-radius:999px;box-shadow:0 2px 5px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pqTen 1.5s 1.15s both;}
        .pq2009 .pq-plus{font-size:24px;font-weight:900;color:#5c636e;flex:0 0 auto;align-self:center;}
        /* yo'lakcha: uchta birlik-mashina */
        .pq2009 .pq-yard{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;flex:0 0 auto;}
        .pq2009 .pq-yrow{display:flex;flex-direction:column;gap:4px;}
        .pq2009 .pq-tag{font-size:12px;font-weight:900;color:#5c636e;background:rgba(255,255,255,.75);padding:1px 10px;border-radius:999px;font-variant-numeric:tabular-nums;}

        .pq2009 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2009 .pq-spark.s2{animation-delay:-.6s;} .pq2009 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2009 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:16px;animation:pqIn .3s ease both;}
        .pq2009 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2009 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2009 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2009 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq2009 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2009 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2009 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2009 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2009 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2009 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2009 .pq-opt:disabled{cursor:default;}
        .pq2009 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2009 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2009 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrive{0%{opacity:1;transform:translateX(0);}12%{transform:translateX(-4px);}100%{opacity:0;transform:translateX(150px);}}
        @keyframes pqSpin{to{transform:rotate(360deg);}}
        @keyframes pqTen{0%{opacity:0;transform:translateX(-50%) scale(.5);}14%{opacity:1;transform:translateX(-50%) scale(1);}72%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.9);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqBlink{0%,60%{opacity:1;}61%,100%{opacity:.35;}}
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
        <div className="pq-light"><span className="pole" /><span className="box"><i className="r" /><i className="y" /><i className="g on" /></span></div>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* GARAJ: o'nta to'xtash joyi to'la. G'alabada oxirgi ikkitasi chiqadi → sakkizta qoladi */}
          <div className={'pq-garaj' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {GARAJ.map((s) => {
                const stay = !s.gone;                       // qoladigan mashinalar (1..8)
                const driveNow = s.gone && anim;            // g'alabada o'nlikdan chiqadi (2-qadam)
                const empty = s.gone && ok && !anim;        // statik yakun: joy bo'sh
                return (
                  <div key={s.i} className={'pq-slot' + (empty ? ' empty' : '')}>
                    {stay && (
                      <span className="pq-cw">
                        <Car c={s.c} size={26} />
                        {ok && <b className="pq-cnt" style={{ '--pd': badgeDelay }}>{s.i + 1}</b>}
                      </span>
                    )}
                    {s.gone && !ok && (
                      <span className="pq-cw"><Car c={s.c} size={26} /></span>
                    )}
                    {driveNow && (
                      <span className="pq-cw drive" style={{ '--fd': `${driveGar(s.i)}s` }}>
                        <Car c={s.c} size={26} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {anim && <span className="pq-ten">{TEN}</span>}
            {ok && <span className="pq-lbl fin" style={{ '--ld': still ? '0s' : '2.85s' }}>{TARGET}</span>}
          </div>

          {/* O'nlik VA birliklar QO'SHILIB minuendni (13) beradi: 10 + 3, ayirish EMAS. */}
          <span className="pq-plus">{'+'}</span>

          {/* YO'LAKCHA: uchta birlik-mashina. G'alabada avval shular chiqadi (1-qadam) */}
          <div className="pq-yard">
            <div className="pq-yrow">
              {YARD.map((s) => (
                <React.Fragment key={s.i}>
                  {!ok && <span className="pq-cw"><Car c={s.c} size={26} /></span>}
                  {anim && (
                    <span className="pq-cw drive" style={{ '--fd': `${driveYard(s.i)}s` }}>
                      <Car c={s.c} size={26} />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            {!ok && <span className="pq-tag">{UNITS}</span>}
          </div>
        </div>

        <span className="pq-road" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '18%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '66px' }}>✦</span>
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
