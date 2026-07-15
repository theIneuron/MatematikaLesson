// Dars20 · Amaliyot 01 — Make-ten-sub «Garaj» · 🟢 · tag: cross_sub
// Bitta-tanlov: garajda o'n ikkita mashina (garaj to'la 10 + yo'lakda 2). "12 − 4 nechaga teng?" → 8.
// Animatsiya IKKI ANIQ QADAM: (1) avval yo'lakdagi 2 mashina chiqib ketadi (12 − 2 = 10),
// oraliq «10» ko'rsatiladi; (2) keyin garajdan 2 mashina chiqadi (10 − 2 = 8). Qolgan 8 sanaladi.
// Chip «12 − 4 = 8», qadam «12 − 2 − 2 = 10 − 2». Make-ten-sub.
// Sahna (metodist 2026-07-12): chiziqli tent-tom OLINDI — syujet ochiq ko'chada: osmon,
// quyosh, bulut, uzoqda uylar va daraxtlar, pastda yo'l va svetofor.
// VEDI-DO-VERNOGO: noto'g'ri javobda qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// MOBIL-FIT: qat'iy o'lchamli sahnani mavjud kenglikka sig'diradi — ichki px koordinatalar buzilmaydi.
const useFitScale = (designW) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (w) => setScale(w > 0 ? Math.min(1, w / designW) : 1);
    const ro = new ResizeObserver((es) => apply(es[0].contentRect.width));
    ro.observe(el); apply(el.clientWidth);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
};

const A = 12, B = 4, TARGET = 8, TEN = 10;
const UNITS = A - TEN;        // 2 — teen birliklari (yo'lakda); avval shular chiqadi
const FROMTEN = B - UNITS;    // 2 — o'nlikdan (garajdan) chiqadigan qolgan qism
const STAY = TEN - FROMTEN;   // 8 — garajda qoladigan mashinalar
const DATA = { a: A, b: B, target: TARGET, options: [7, 8, 9], ptype: 'P13', level: '🟢', tag: 'cross_sub' };

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// Garaj: 10 to'xtash joyi (2×5), hammasi to'la. G'alabada oxirgi FROMTEN(2) mashina chiqadi → 8 qoladi.
const GAR = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= STAY, c: PAL[i % PAL.length] }));
// Yo'lak: teen birliklari (2 mashina). G'alabada ikkalasi ham chiqadi (avval shular).
const WALK = Array.from({ length: UNITS }).map((_, i) => ({ i, c: PAL[(TEN + i) % PAL.length] }));

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
    eyebrow: "Garaj · Ayirish", title: "To'rt mashina chiqib ketdi",
    setup: "12 mashinadan 4 tasi chiqib ketdi.",
    ask: "12 − 4 nechaga teng?",
    correct: "Barakalla! O'n ikkidan ikkitasi chiqib o'nta qoldi, yana ikkitasi chiqdi — sakkizta. 12 − 4 = 8.",
    hint: "Avval yo'lakdagi ikki mashinani chiqaring — o'nta qoladi. To'rtdan ikkitasi ketdi, qolgan ikkitasini garajdan chiqaring.",
  },
  ru: {
    eyebrow: 'Гараж · Вычитание', title: 'Четыре машины уехали',
    setup: 'Из 12 машин уехали 4.',
    ask: 'Сколько будет 12 − 4?',
    correct: 'Молодец! Из двенадцати уехали две — осталось десять, ещё две — восемь. 12 − 4 = 8.',
    hint: 'Сначала выведи две машины с дорожки — станет десять. Из четырёх уехали две, а оставшиеся две выведи из гаража.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (radial 2-ton) + tom +
// oynalar + fara + 2 g'ildirak (chiqishda aylanadi). Bitta mashina = bitta birlik. Rang palitradan.
let __gid = 0;
const Car = ({ c, size = 34 }) => {
  const id = 'd2001c' + (__gid++);
  return (
    <svg viewBox="0 0 48 30" width={size} height={size * 30 / 48} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* soya */}
      <ellipse cx="24" cy="27" rx="20" ry="2.4" fill="rgba(0,0,0,.12)" />
      {/* tom */}
      <path d="M13 13 L17.5 5.5 L30.5 5.5 L35 13 Z" fill={c.dark} />
      {/* oynalar */}
      <path d="M15.6 12 L18.6 7 L22.5 7 L22.5 12 Z" fill="#dff0fb" stroke={c.dark} strokeWidth=".5" />
      <path d="M24.5 7 L29.4 7 L32.4 12 L24.5 12 Z" fill="#dff0fb" stroke={c.dark} strokeWidth=".5" />
      {/* tana */}
      <path d="M4 14 Q4 12.5 6.5 12.5 L37 12.5 Q41.5 12.5 44 17 L44 20.5 Q44 22.5 41.5 22.5 L6.5 22.5 Q4 22.5 4 20.5 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" />
      {/* fara */}
      <circle cx="42.4" cy="16.5" r="1.5" fill="#fff6c0" stroke={c.dark} strokeWidth=".4" />
      {/* g'ildiraklar (chiqishda aylanadi) */}
      <g className="whl">
        <circle cx="15" cy="22.5" r="4.4" fill="#2c2f36" />
        <circle cx="15" cy="22.5" r="1.7" fill="#c9ccd2" />
        <rect x="14.4" y="19" width="1.2" height="7" fill="#7a7e86" opacity=".7" />
      </g>
      <g className="whl">
        <circle cx="33" cy="22.5" r="4.4" fill="#2c2f36" />
        <circle cx="33" cy="22.5" r="1.7" fill="#c9ccd2" />
        <rect x="32.4" y="19" width="1.2" height="7" fill="#7a7e86" opacity=".7" />
      </g>
    </svg>
  );
};

export default function D20_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda chiqish-animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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

  // Chiqish tartibi (2 qadam): 1) yo'lakdagi birliklar (0.15, 0.5); 2) garajdan o'nlikdan (1.55, 1.9).
  const walkDelay = (i) => 0.15 + i * 0.35;
  const garDelay = (i) => 1.55 + (i - STAY) * 0.35;
  // Qolgan mashinalar sanovi (badge) chiqib ketgandan keyin: still bo'lsa darrov.
  const cntDelay = (i) => (still ? 0 : 2.55 + i * 0.11);
  const labDelay = still ? 0 : 2.6;
  const [fitRef, scale] = useFitScale(392);

  return (
    <div className="pq pq2001" ref={fitRef}>
      <style>{`
        .pq2001{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2001 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2001 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2001 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2001 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2001 .pq-scene{box-sizing:border-box;position:relative;width:392px;height:256px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e2eef9 46%,#eef1f5 100%);border:2px solid #cdd9e8;overflow:hidden;}
        .pq2001 .pq-fit{position:relative;margin:0 auto;}
        .pq2001 .pq-sun{position:absolute;left:18px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2001 .pq-cloud{position:absolute;top:4px;right:14px;width:52px;height:16px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:14px 4px 0 -3px rgba(255,255,255,.8),-14px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2001 .pq-town{position:absolute;left:0;top:6px;width:100%;height:46px;z-index:1;pointer-events:none;}
        .pq2001 .pq-board{position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f6ea8,#2c4c74);border:2.5px solid #223a5a;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.24);}
        /* svetofor */
        .pq2001 .pq-sf{position:absolute;right:14px;bottom:32px;width:13px;height:32px;border-radius:4px;background:#33383f;z-index:4;box-shadow:0 2px 4px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;}
        .pq2001 .pq-sf i{width:7px;height:7px;border-radius:50%;background:#5a616b;}
        .pq2001 .pq-sf i.r{background:#e14b3b;box-shadow:0 0 5px #e14b3b;animation:pqRed 2.4s steps(1) infinite;}
        .pq2001 .pq-sf i.g{background:#2f7d3a;animation:pqGrn 2.4s steps(1) infinite;}
        /* yo'l */
        .pq2001 .pq-road{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#565c66,#43474f);border-top:3px solid #2f333a;z-index:1;}
        .pq2001 .pq-road::after{content:'';position:absolute;left:0;right:0;top:13px;height:3px;background:repeating-linear-gradient(90deg,#f4d24a 0 16px,transparent 16px 34px);}

        .pq2001 .pq-arena{position:absolute;left:10px;right:10px;top:44px;bottom:38px;display:flex;align-items:center;justify-content:center;gap:10px;z-index:3;}
        .pq2001 .pq-bay{position:relative;padding:8px 9px 9px;border-radius:14px;background:linear-gradient(#e7ecf3,#cfd6e0);border:2.5px solid #aeb7c4;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.5);flex:0 0 auto;}
        .pq2001 .pq-bay.win{animation:pqBayCele .55s ease;}
        .pq2001 .pq-grid{display:grid;grid-template-columns:repeat(5,36px);grid-auto-rows:24px;gap:5px 4px;}
        .pq2001 .pq-lane{display:grid;grid-template-columns:36px;grid-auto-rows:24px;gap:5px;}
        .pq2001 .pq-cell{position:relative;border-radius:6px;background:rgba(255,255,255,.5);border:1.4px solid rgba(120,130,145,.45);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(70,80,95,.14);}
        .pq2001 .pq-cell.empty{background:rgba(120,130,145,.1);border-style:dashed;border-color:rgba(120,130,145,.5);}
        .pq2001 .pq-cw{line-height:0;}
        .pq2001 .pq-cw.drive{animation:pqDrive .85s cubic-bezier(.4,.1,.75,.9) forwards;animation-delay:var(--dd,0s);}
        .pq2001 .whl{transform-box:fill-box;transform-origin:center;}
        .pq2001 .pq-cw.drive .whl{animation:pqSpin .32s linear infinite;animation-delay:var(--dd,0s);}
        .pq2001 .pq-cnt{position:absolute;top:-7px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s both;animation-delay:var(--cd,0s);box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq2001 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);animation:pqPop .4s both;animation-delay:var(--ld,0s);font-variant-numeric:tabular-nums;}
        .pq2001 .pq-mid{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:5;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;animation:pqMid 1.7s ease 1s both;}

        .pq2001 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2001 .pq-spark.s2{animation-delay:-.6s;} .pq2001 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2001 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq2001 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2001 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2001 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2001 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq2001 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq2001 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2001 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2001 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2001 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2001 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2001 .pq-opt:disabled{cursor:default;}
        .pq2001 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2001 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2001 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrive{0%{opacity:1;transform:translateX(0);}18%{transform:translateX(3px);}100%{opacity:0;transform:translateX(78px);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqMid{0%{opacity:0;transform:translateX(-50%) scale(.5);}18%{opacity:1;transform:translateX(-50%) scale(1);}78%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.9);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqRed{0%,50%{opacity:1;}51%,100%{opacity:.25;}}
        @keyframes pqGrn{0%,50%{opacity:.25;}51%,100%{opacity:1;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBayCele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 392 * scale, height: 256 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" /><span className="pq-cloud" />
        <Town />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {/* Garaj: o'nta to'xtash joyi. G'alabada oxirgi ikkitasi chiqadi → sakkizta qoladi (badge 1..8) */}
          <div className={'pq-bay' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {GAR.map((s) => {
                const emptyNow = s.gone && ok;             // chiqib ketgan joy
                return (
                  <div key={s.i} className={'pq-cell' + (emptyNow ? ' empty' : '')}>
                    {!s.gone && (
                      <span className="pq-cw">
                        <Car c={s.c} size={34} />
                        {ok && <b className="pq-cnt" style={{ '--cd': `${cntDelay(s.i)}s` }}>{s.i + 1}</b>}
                      </span>
                    )}
                    {s.gone && !ok && (
                      <span className="pq-cw"><Car c={s.c} size={34} /></span>
                    )}
                    {s.gone && ok && !still && (
                      <span className="pq-cw drive" style={{ '--dd': `${garDelay(s.i)}s` }}><Car c={s.c} size={34} /></span>
                    )}
                  </div>
                );
              })}
            </div>
            {ok && <span className="pq-lbl" style={{ '--ld': `${labDelay}s` }}>{TARGET}</span>}
            {ok && !still && <span className="pq-mid">{TEN}</span>}
          </div>

          {/* Yo'lak: ikkita birlik-mashina. G'alabada avval shular chiqadi */}
          <div className="pq-lane">
            {WALK.map((s) => (
              <div key={s.i} className={'pq-cell' + (ok ? ' empty' : '')}>
                {!ok && (<span className="pq-cw"><Car c={s.c} size={34} /></span>)}
                {ok && !still && (
                  <span className="pq-cw drive" style={{ '--dd': `${walkDelay(s.i)}s` }}><Car c={s.c} size={34} /></span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pq-sf"><i className="r" /><i /><i className="g" /></div>
        <span className="pq-road" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '20%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '68px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '42px' }}>✦</span>
        </>)}
      </div>
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
