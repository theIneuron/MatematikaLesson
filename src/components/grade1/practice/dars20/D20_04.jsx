// Dars20 · Amaliyot 04 — Noma'lum ayriluvchi «Garaj» · 🟡 · tag: missing_sub
// Garajda o'n uchta mashina bor edi, hozir sakkiztasi qoldi. "13 − [?] = 8" — nechta mashina
// chiqib ketdi? → 5 (13 − 5 = 8). Make-ten-sub: avval birliklar (3) chiqadi — o'nta qoladi,
// keyin o'nlikdan yana ikkitasi chiqadi — sakkizta. G'alaba (ikki aniq qadam):
//   1) yo'lakdagi uchta mashina yo'lga chiqib ketadi → oraliq «10» ko'rsatiladi;
//   2) garajdan yana ikkita mashina chiqadi → «8». Qolgan sakkiztasi sanaladi.
// Sahna (metodist 2026-07-12): chiziqli tent-tom OLINDI — syujet ochiq ko'chada: osmon,
// quyosh, bulut, uzoqda uylar va daraxtlar, pastda yo'l va svetofor.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 13, ANS = 5, TARGET = 8, TEN = 10;
const UNITS = A - TEN;         // 3 — teen birliklari (yo'lak); avval shular chiqadi
const FROMTEN = ANS - UNITS;   // 2 — o'nlikdan (garajdan) chiqadigan qolgan qism
const GONE1 = TEN - FROMTEN;   // 8 — garajda shu indeksdan (8,9) mashinalar chiqadi
const DATA = { a: A, ans: ANS, target: TARGET, options: [4, 5, 6], ptype: 'P13', level: '🟡', tag: 'missing_sub' };

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#f0938c', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f0b429', dark: '#c98d16' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// Garaj (ten-frame): 10 to'xtash joyi (5×2), hammasi to'la. G'alabada oxirgi ikkitasi
// (i=8,9) chiqib ketadi → sakkiztasi qoladi (badge 1..8).
const GARAJ = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= GONE1, c: PAL[i % PAL.length] }));
// Yo'lak: teen birliklari — uchta mashina. G'alabada uchtasi ham chiqib ketadi (avval shular).
const YOLAK = Array.from({ length: UNITS }).map((_, i) => ({ i, c: PAL[(TEN + i) % PAL.length] }));

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
    eyebrow: "Garaj · Noma'lum ayriluvchi", title: "Nechta mashina chiqib ketdi?",
    setup: "13 mashinadan hozir 8 tasi qoldi.",
    ask: "13 − [?] = 8. Nechta mashina chiqdi?",
    correct: "Barakalla! O'n uchdan uchtasi chiqib o'nta qoldi, yana ikkitasi chiqdi — sakkizta. Beshta mashina chiqib ketdi. 13 − 5 = 8.",
    hint: "Avval birliklarni chiqaring: o'n uchdan uchtasi chiqsa, o'nta qoladi. Endi o'ntadan sakkizgacha yana nechta chiqishi kerakligini o'ylang.",
  },
  ru: {
    eyebrow: 'Гараж · Неизвестное вычитаемое', title: 'Сколько машин уехало?',
    setup: 'Из 13 машин осталось 8.',
    ask: '13 − [?] = 8. Сколько машин уехало?',
    correct: 'Молодец! Из тринадцати уехали три — осталось десять, ещё две — восемь. Уехало пять машин. 13 − 5 = 8.',
    hint: 'Сначала убери единицы: из тринадцати уехали три — останется десять. Теперь подумай, сколько ещё уедет от десяти до восьми.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (2-ton gradient) + tom +
// ikkita oyna + ikkita g'ildirak + fara. Bitta mashina = bitta birlik. Rang palitradan.
// Chiqib ketishda g'ildiraklar (.pq-wh) aylanadi.
let __gid = 0;
const Car = ({ c, size = 27 }) => {
  const id = 'd2004c' + (__gid++);
  return (
    <svg viewBox="0 0 48 30" width={size} height={size * 30 / 48} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.main} />
        </linearGradient>
      </defs>
      {/* soya */}
      <ellipse cx="24" cy="27.6" rx="19" ry="2.2" fill="#000" opacity=".12" />
      {/* tom */}
      <path d="M15 15 L19 8.5 Q20 7 22 7 L29 7 Q31 7 32 8.5 L36 15 Z" fill={c.dark} />
      {/* oynalar */}
      <path d="M18.6 14 L21 9.3 L25 9.3 L25 14 Z" fill="#d2ecf8" />
      <path d="M27 9.3 L30.4 9.3 L33 14 L27 14 Z" fill="#d2ecf8" />
      {/* tana */}
      <rect x="5" y="14.5" width="38" height="8.6" rx="4.2" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".7" />
      {/* eshik chizig'i */}
      <line x1="24" y1="15.4" x2="24" y2="22.6" stroke={c.dark} strokeWidth=".7" opacity=".5" />
      {/* fara */}
      <circle cx="41.4" cy="18.6" r="1.7" fill="#ffe27a" stroke="#e0a92a" strokeWidth=".4" />
      {/* g'ildiraklar */}
      <g className="pq-wh" style={{ transformOrigin: '13px 23.5px' }}>
        <circle cx="13" cy="23.5" r="4.6" fill="#2b2f36" />
        <circle cx="13" cy="23.5" r="1.9" fill="#cbd0d8" />
        <line x1="13" y1="20.4" x2="13" y2="26.6" stroke="#8a909a" strokeWidth=".8" />
        <line x1="9.9" y1="23.5" x2="16.1" y2="23.5" stroke="#8a909a" strokeWidth=".8" />
      </g>
      <g className="pq-wh" style={{ transformOrigin: '35px 23.5px' }}>
        <circle cx="35" cy="23.5" r="4.6" fill="#2b2f36" />
        <circle cx="35" cy="23.5" r="1.9" fill="#cbd0d8" />
        <line x1="35" y1="20.4" x2="35" y2="26.6" stroke="#8a909a" strokeWidth=".8" />
        <line x1="31.9" y1="23.5" x2="38.1" y2="23.5" stroke="#8a909a" strokeWidth=".8" />
      </g>
    </svg>
  );
};

export default function D20_04(props) {
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
    const correct = picked === ANS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: ANS }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  // Chiqib ketish tartibi (ikki aniq qadam): avval yo'lak birliklari (3), qisqa pauza —
  // oraliq «10», keyin garajdan o'nlikdan qolgani (2).
  const flyYolak = (i) => i * 0.18;                 // birliklar: 0, .18, .36
  const flyGaraj = (i) => 1.4 + (i - GONE1) * 0.22; // o'nlikdan: 1.4, 1.62
  const D = still ? '0s' : '2.55s';                 // g'alaba chip/eq — animatsiyadan keyin

  return (
    <div className="pq pq2004">
      <style>{`
        .pq2004{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2004 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2004 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2004 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2004 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2004 .pq-scene{position:relative;width:380px;max-width:100%;height:256px;margin:0 auto;border-radius:20px;background:linear-gradient(#dff1fb 0%,#e9f1fb 52%,#eef2f6 100%);border:2px solid #d3ddec;overflow:hidden;}
        .pq2004 .pq-sun{position:absolute;left:20px;top:15px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2004 .pq-cloud{position:absolute;z-index:1;width:42px;height:15px;border-radius:999px;background:rgba(255,255,255,.85);box-shadow:13px 3px 0 -3px rgba(255,255,255,.85),-11px 3px 0 -4px rgba(255,255,255,.8);}
        .pq2004 .pq-cloud.c1{right:44px;top:3px;animation:pqDrift 7s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2004 .pq-town{position:absolute;left:0;top:6px;width:100%;height:46px;z-index:1;pointer-events:none;}
        .pq2004 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4f7fb2,#3a6193);border:2.5px solid #2c4c74;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* yo'l (asfalt) */
        .pq2004 .pq-yol{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#5b636e,#454c56);border-top:3px solid #333941;z-index:1;}
        .pq2004 .pq-yol::after{content:'';position:absolute;left:0;right:0;top:15px;height:3px;background:repeating-linear-gradient(90deg,#f2d24a 0 16px,transparent 16px 30px);opacity:.9;}
        /* svetofor */
        .pq2004 .pq-light{position:absolute;right:16px;bottom:34px;width:16px;height:34px;border-radius:5px;background:linear-gradient(#3a4048,#282d33);border:2px solid #1e2227;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;box-shadow:0 2px 4px rgba(0,0,0,.25);}
        .pq2004 .pq-light i{width:7px;height:7px;border-radius:50%;background:#3a4048;}
        .pq2004 .pq-light i.r{background:#e0554c;} .pq2004 .pq-light i.y{background:#6b5a30;}
        .pq2004 .pq-light i.g{background:#4bd07a;box-shadow:0 0 6px 1px rgba(75,208,122,.75);animation:pqBlink 1.6s ease-in-out infinite;}
        .pq2004 .pq-light::before{content:'';position:absolute;bottom:-14px;width:4px;height:14px;background:#41474f;}

        .pq2004 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:38px;display:flex;align-items:center;justify-content:center;gap:11px;z-index:3;}
        .pq2004 .pq-box{position:relative;padding:8px 9px 10px;border-radius:14px;background:linear-gradient(#c9d2dc,#a9b4c1);border:2.5px solid #7f8b99;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.35);flex:0 0 auto;}
        .pq2004 .pq-box.win{animation:pqBoxCele .55s ease;}
        .pq2004 .pq-cap{position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:800;letter-spacing:.02em;color:#4a5563;background:rgba(255,255,255,.82);padding:0 7px;border-radius:999px;white-space:nowrap;text-transform:uppercase;}
        .pq2004 .pq-grid{display:grid;grid-template-columns:repeat(5,30px);grid-auto-rows:22px;gap:3px;}
        .pq2004 .pq-grid.lane{grid-template-columns:repeat(${UNITS},30px);}
        .pq2004 .pq-cell{position:relative;border-radius:6px;background:rgba(255,255,255,.55);border:1.4px solid rgba(90,105,125,.5);display:flex;align-items:flex-end;justify-content:center;box-shadow:inset 0 1px 2px rgba(60,72,88,.16);}
        .pq2004 .pq-cell.empty{background:rgba(255,255,255,.24);border-style:dashed;border-color:rgba(90,105,125,.55);}
        .pq2004 .pq-cw{line-height:0;}
        .pq2004 .pq-cw.go{animation:pqDrive .8s ease-in forwards;animation-delay:var(--fd,0s);}
        .pq2004 .pq-wh{transform-box:view-box;}
        .pq2004 .pq-cw.go .pq-wh{animation:pqWheel .4s linear infinite;animation-delay:var(--fd,0s);}
        .pq2004 .pq-cnt{position:absolute;top:-7px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqCnt .3s both;}
        .pq2004 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;}
        .pq2004 .pq-lbl.mid{border-color:#c9822f;color:#c9822f;animation:pqMid 1.5s .95s both;}
        .pq2004 .pq-lbl.fin{border-color:#1a7f43;color:#1a7f43;animation:pqPop .4s both;}

        .pq2004 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2004 .pq-spark.s2{animation-delay:-.6s;} .pq2004 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2004 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s both;}
        .pq2004 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2004 .pq-eq b.sub{background:#fdeceb;border-color:#d9534b;color:#a63a33;}
        .pq2004 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2004 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2004 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pqIn .3s both;}

        .pq2004 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq2004 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2004 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2004 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2004 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2004 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2004 .pq-opt:disabled{cursor:default;}
        .pq2004 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2004 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2004 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrive{0%{opacity:1;transform:translate(0,0);}12%{transform:translate(3px,-1px);}100%{opacity:0;transform:translate(66px,9px);}}
        @keyframes pqWheel{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqCnt{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqMid{0%{opacity:0;transform:translateX(-50%) scale(.5);}12%{opacity:1;transform:translateX(-50%) scale(1);}68%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.85);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqDrift{0%,100%{transform:translateX(0);}50%{transform:translateX(-10px);}}
        @keyframes pqBlink{0%,100%{opacity:1;}50%{opacity:.45;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBoxCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" /><span className="pq-cloud c1" />
        <Town />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* Garaj: o'nta joy. G'alabada oxirgi ikkitasi chiqadi → sakkiztasi qoladi (badge 1..8) */}
          <div className={'pq-box' + (ok ? ' win' : '')}>
            <span className="pq-cap">{lang === 'ru' ? 'Гараж' : 'Garaj'}</span>
            <div className="pq-grid">
              {GARAJ.map((s) => (
                <div key={s.i} className={'pq-cell' + (s.gone && ok ? ' empty' : '')}>
                  {!s.gone && (
                    <span className="pq-cw">
                      <Car c={s.c} size={27} />
                      {ok && <b className="pq-cnt" style={{ animationDelay: still ? '0s' : `${2.4 + s.i * 0.05}s` }}>{s.i + 1}</b>}
                    </span>
                  )}
                  {s.gone && !ok && (<span className="pq-cw"><Car c={s.c} size={27} /></span>)}
                  {s.gone && ok && !still && (
                    <span className="pq-cw go" style={{ '--fd': `${flyGaraj(s.i)}s` }}><Car c={s.c} size={27} /></span>
                  )}
                </div>
              ))}
            </div>
            {ok && !still && <span className="pq-lbl mid">{TEN}</span>}
            {ok && <span className="pq-lbl fin" style={{ animationDelay: still ? '0s' : '2.4s' }}>{TARGET}</span>}
          </div>

          {/* Yo'lak: uchta birlik. G'alabada uchtasi ham yo'lga chiqib ketadi (avval shular) */}
          <div className="pq-box">
            <span className="pq-cap">{lang === 'ru' ? 'Двор' : "Yo'lak"}</span>
            <div className="pq-grid lane">
              {YOLAK.map((s) => (
                <div key={s.i} className={'pq-cell' + (ok ? ' empty' : '')}>
                  {!ok && (<span className="pq-cw"><Car c={s.c} size={27} /></span>)}
                  {ok && !still && (
                    <span className="pq-cw go" style={{ '--fd': `${flyYolak(s.i)}s` }}><Car c={s.c} size={27} /></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className="pq-yol" />
        <span className="pq-light"><i className="r" /><i className="y" /><i className="g" /></span>

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '52%', top: '42px' }}>✦</span>
        </>)}
      </div>

      {ok && (<>
        <div className="pq-eq" style={{ animationDelay: D }}><b>{A}</b><i>{'−'}</i><b className="sub">{ANS}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub" style={{ animationDelay: D }}>{A} {'−'} {UNITS} {'−'} {FROMTEN} = {TEN} {'−'} {FROMTEN} = {TARGET}</div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === ANS;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
