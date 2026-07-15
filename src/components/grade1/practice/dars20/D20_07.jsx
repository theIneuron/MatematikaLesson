// Dars20 · Amaliyot 07 — Taqqoslash «Ikki garaj» · 🔴 · tag: logic_compare
// IKKI garaj yonma-yon: chapda 13 − 5, o'ngda 15 − 8. Savol: qaysi garajda ko'proq
// mashina qoladi? Bola ikkalasini make-ten-sub bilan hisoblab taqqoslaydi:
// 13 − 5 = 8, 15 − 8 = 7 → 8 > 7 → CHAP garajda ko'proq. correct='left'.
// G'alaba (bir marta, sekin, ikki aniq qadam har garaj uchun):
//   (1) birliklar chiqib ketadi (o'ngacha, 13→10 / 15→10), oraliq «10» ko'rsatiladi;
//   (2) o'nlikdan qolgani chiqadi (10−2=8 / 10−3=7). So'ng qolganlar sanaladi, chap
//   garaj yashil belgilanadi, chip «8 > 7».
// Sahna (metodist 2026-07-12, real hayotiy): ochiq ko'cha — osmon, quyosh, bulut,
// uzoqda uylar va daraxtlar, ikki garaj binosi, yo'l va svetofor. Chiziqli tent-tom YO'Q.
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

const M = '−';                       // U+2212 minus (barcha display)
const TEN = 10;

// Ikki garaj konfiguratsiyasi. result = a − b = 10 − fromten.
const G = [
  { key: 'left',  a: 13, b: 5 },     // 13 − 5 = 8
  { key: 'right', a: 15, b: 8 },     // 15 − 8 = 7
].map((g) => {
  const units = g.a - TEN;           // teen birliklari (avval shular ketadi)
  const fromten = g.b - units;       // o'nlikdan olinadigan qolgan qism
  const result = g.a - g.b;          // qoladigan mashina = 10 − fromten
  return { ...g, units, fromten, result };
});

const RES_L = G[0].result, RES_R = G[1].result;   // 8, 7
const DATA = {
  left: [G[0].a, G[0].b], right: [G[1].a, G[1].b],
  leftRes: RES_L, rightRes: RES_R, ans: 'left',
  options: ['left', 'right', 'equal'], ptype: 'LOGIC', level: '🔴', tag: 'logic_compare',
};

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

const T = {
  uz: {
    eyebrow: "Ikki garaj · Taqqoslash", title: "Qaysi garajda ko'proq qoladi?",
    setup: "Chapdan 5 ta, o'ngdan 8 ta mashina chiqdi.",
    ask: "Qaysi garajda ko'proq qoladi?",
    left: "Chap garaj", right: "O'ng garaj", equal: "Teng",
    correct: "Barakalla! Chap garajda sakkizta, o'ng garajda yettita mashina qoldi. Sakkiz yettidan katta — chap garajda ko'proq. 8 > 7.",
    hint: "Ikkovini hisoblang, keyin qaysi ko'p — solishtiring. Avval birliklarni oling, o'nta qoldiring, keyin o'nlikdan qolganini oling.",
  },
  ru: {
    eyebrow: "Два гаража · Сравнение", title: "Где останется больше?",
    setup: "Слева уехали 5, справа 8 машин.",
    ask: "В каком гараже останется больше?",
    left: "Левый гараж", right: "Правый гараж", equal: "Поровну",
    correct: "Молодец! В левом гараже осталось восемь машин, в правом — семь. Восемь больше семи — в левом больше. 8 > 7.",
    hint: "Посчитай оба, потом сравни, где больше. Сначала убери единицы до десяти, затем вычти остаток из десятка.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KO'CHA ORQA FONI (ambient): uzoqdagi uylar + daraxtlar — syujet ochiq ko'chada kechadi.
// Matematik zonaga tegmaydi (z-index past, garajlar ustidan yopadi).
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

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — rangli tana (radial 2-ton) +
// tom-kabina + oynalar + 2 g'ildirak (spitsali) + fara. Bitta mashina = bitta birlik.
// Old tomoni o'ngda (fara o'ngda) — chiqib ketganda o'ngga, yo'lga qarab siljiydi.
let __gid = 0;
const Car = ({ c, size = 22 }) => {
  const id = 'd2007c' + (__gid++);
  return (
    <svg viewBox="0 0 46 28" width={size} height={size * 28 / 46} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      {/* soya */}
      <ellipse cx="23" cy="25.5" rx="18" ry="2.4" fill="rgba(40,30,20,.18)" />
      {/* kabina-tom */}
      <path d="M13 12 Q15 5.5 21 5.5 L30 5.5 Q34 5.5 36 11 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oynalar */}
      <path d="M16.5 11 Q18 7.6 21.5 7.6 L23 7.6 L23 11 Z" fill="#e7f2fb" stroke={c.dark} strokeWidth=".4" />
      <path d="M24.5 7.6 L29 7.6 Q32.5 7.6 33.8 11 L24.5 11 Z" fill="#e7f2fb" stroke={c.dark} strokeWidth=".4" />
      {/* tana */}
      <path d="M5 20 Q5 13.5 11 12.5 L36 12.5 Q41 13.5 42 18 L42 20 Q42 22 40 22 L7 22 Q5 22 5 20 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".9" />
      {/* fara (old, o'ng) */}
      <circle cx="40" cy="16.5" r="1.7" fill="#fff4c2" stroke="#e0b021" strokeWidth=".5" />
      {/* g'ildiraklar (spitsali) */}
      <g>
        <circle cx="14" cy="22" r="5" fill="#2b2f36" />
        <circle cx="14" cy="22" r="2.2" fill="#c7ccd4" />
        <path className="pq-spoke" d="M14 19.4 L14 24.6 M11.4 22 L16.6 22" stroke="#8a929c" strokeWidth=".9" strokeLinecap="round" />
      </g>
      <g>
        <circle cx="32" cy="22" r="5" fill="#2b2f36" />
        <circle cx="32" cy="22" r="2.2" fill="#c7ccd4" />
        <path className="pq-spoke" d="M32 19.4 L32 24.6 M29.4 22 L34.6 22" stroke="#8a929c" strokeWidth=".9" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default function D20_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);      // 'left' | 'right' | 'equal'
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
    const correct = picked === DATA.ans;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.left, t.right, t.equal], studentAnswer: { value: picked }, correctAnswer: { value: DATA.ans }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const anim = ok && !still;    // g'alaba animatsiyasi (bir-martalik, sekin)

  // Chiqib-ketish jadvali (SEKIN, ikki aniq qadam):
  //   1-qadam — birliklar (0..units-1): delay i*0.22
  //   oraliq «10» flash: delay 1.5s
  //   2-qadam — o'nlikdan (fromten dona): delay 1.9 + j*0.22
  //   yakuniy sanoq + natija: delay 3.2s
  const unitDelay = (i) => i * 0.22;
  const tenDelay = (j) => 1.9 + j * 0.22;
  const [fitRef, scale] = useFitScale(344);

  return (
    <div className="pq pq2007" ref={fitRef}>
      <style>{`
        .pq2007{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2007 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2007 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2007 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2007 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2007 .pq-scene{box-sizing:border-box;position:relative;width:344px;height:296px;border-radius:20px;background:linear-gradient(#dff1fb 0%,#eaf2fb 46%,#eef2f6 100%);border:2px solid #d3ddec;overflow:hidden;}
        .pq2007 .pq-fit{position:relative;margin:0 auto;}
        .pq2007 .pq-sun{position:absolute;left:16px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2007 .pq-cloud{position:absolute;top:22px;right:22px;width:50px;height:15px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:13px 4px 0 -3px rgba(255,255,255,.8),-13px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2007 .pq-town{position:absolute;left:0;top:8px;width:100%;height:44px;z-index:1;pointer-events:none;}
        /* svetofor */
        .pq2007 .pq-tl{position:absolute;right:14px;bottom:34px;width:14px;height:34px;border-radius:4px;background:linear-gradient(#3a4048,#22262c);border:1.5px solid #171a1f;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:2px 0;box-shadow:0 2px 4px rgba(0,0,0,.25);}
        .pq2007 .pq-tl i{width:7px;height:7px;border-radius:50%;background:#4a4f57;}
        .pq2007 .pq-tl i.r{background:#e5544b;box-shadow:0 0 5px 1px rgba(229,84,75,.7);animation:pqBlink 2.4s steps(1) infinite;}
        .pq2007 .pq-tl i.y{background:#4a4f57;} .pq2007 .pq-tl i.g{background:#3f8a4a;box-shadow:0 0 5px 1px rgba(63,138,74,.6);animation:pqBlink 2.4s steps(1) 1.2s infinite;}
        .pq2007 .pq-tl::before{content:'';position:absolute;bottom:-16px;width:4px;height:16px;background:#22262c;}

        .pq2007 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 14px 5px;border-radius:9px;background:linear-gradient(#4f7fb2,#3a6193);border:2.5px solid #2c4c74;color:#eff6ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        /* yo'l */
        .pq2007 .pq-road{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#5b636d,#474e57);border-top:3px solid #343a42;z-index:1;}
        .pq2007 .pq-road::after{content:'';position:absolute;left:0;right:0;top:13px;height:3px;background:repeating-linear-gradient(90deg,#f4d774 0 16px,transparent 16px 32px);opacity:.9;}

        .pq2007 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:36px;display:flex;align-items:flex-end;justify-content:center;gap:12px;z-index:3;}
        .pq2007 .pq-garage{position:relative;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:5px;}
        /* garaj bino */
        .pq2007 .pq-gtop{position:relative;width:100%;}
        .pq2007 .pq-gtag{font-size:12px;font-weight:900;color:#3a6193;background:rgba(255,255,255,.8);border:1.5px solid #b8cbe4;padding:1px 10px;border-radius:999px;}
        .pq2007 .pq-box{position:relative;padding:8px 8px 9px;border-radius:12px 12px 10px 10px;background:linear-gradient(#c9d3de,#aeb9c6);border:2.5px solid #8793a2;box-shadow:0 6px 12px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.4);}
        .pq2007 .pq-box::before{content:'';position:absolute;left:-4px;right:-4px;top:-9px;height:10px;background:linear-gradient(#e06a54,#b7442f);border-radius:6px 6px 0 0;border:2px solid #98351f;}
        .pq2007 .pq-box.win{border-color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.28),0 6px 12px rgba(0,0,0,.2);}
        .pq2007 .pq-grid{display:grid;grid-template-columns:repeat(5,25px);grid-auto-rows:19px;gap:3px;}
        .pq2007 .pq-cell{position:relative;border-radius:5px;background:rgba(255,255,255,.34);border:1.3px solid rgba(90,102,120,.4);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(60,70,85,.16);}
        .pq2007 .pq-cell.empty{background:rgba(255,255,255,.14);border-style:dashed;}
        /* yo'lakcha (birliklar) */
        .pq2007 .pq-drive{display:grid;grid-template-columns:repeat(5,25px);gap:3px;min-height:15px;justify-content:center;}
        .pq2007 .pq-slot{display:flex;align-items:center;justify-content:center;}

        .pq2007 .pq-cw{line-height:0;}
        .pq2007 .pq-cw.idle{animation:pqBob 2.8s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2007 .pq-cw.out{animation:pqDriveOut .8s ease-in forwards;animation-delay:var(--od,0s);}
        .pq2007 .pq-cw.out .pq-spoke{animation:pqSpin .38s linear infinite;transform-box:fill-box;transform-origin:center;}
        .pq2007 .pq-cnt{position:absolute;top:-6px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq2007 .pq-cnt.pop{animation:pqPop .3s var(--cd,0s) both;}
        /* oraliq «10» flash */
        .pq2007 .pq-ten{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pqFlash 1.1s 1.4s both;}
        /* yakuniy natija */
        .pq2007 .pq-res{position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);z-index:6;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:13px;padding:1px 10px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;}
        .pq2007 .pq-res.pop{animation:pqPop .4s 3.1s both;}

        .pq2007 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2007 .pq-spark.s2{animation-delay:-.6s;} .pq2007 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2007 .pq-cmp{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:14px;animation:pqIn .3s ease both;font-variant-numeric:tabular-nums;}
        .pq2007 .pq-cmp .pill{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .pq2007 .pq-cmp .pill b{min-width:118px;height:38px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;}
        .pq2007 .pq-cmp .pill.win b{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2007 .pq-cmp .pill span{font-size:11px;font-weight:800;color:#8a94a2;}
        .pq2007 .pq-gt{font-size:26px;font-weight:900;color:#1a7f43;}
        .pq2007 .pq-sub{text-align:center;margin-top:6px;font-size:13px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;line-height:1.7;animation:pqIn .3s .1s both;}

        .pq2007 .pq-opts{display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
        .pq2007 .pq-opt{min-width:104px;height:60px;padding:0 12px;font-size:18px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2007 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2007 .pq-opt:active:not(:disabled){transform:scale(.95);}
        .pq2007 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2007 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2007 .pq-opt:disabled{cursor:default;}
        .pq2007 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2007 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2007 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqDriveOut{0%{opacity:1;transform:translateX(0);}18%{transform:translateX(4px);}100%{opacity:0;transform:translateX(78px);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqFlash{0%{opacity:0;transform:translateX(-50%) scale(.5);}20%{opacity:1;transform:translateX(-50%) scale(1);}80%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(.9);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqBlink{0%,45%{opacity:1;}50%,100%{opacity:.28;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 344 * scale, height: 296 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" /><span className="pq-cloud" />
        <Town />
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {G.map((g, gi) => {
            const winner = ok && g.key === DATA.ans;   // chap g'olib
            // garaj: 10 to'xtash joyi; oxirgi fromten dona chiqib ketadi → result qoladi.
            const spots = Array.from({ length: TEN }, (_, i) => i);
            const units = Array.from({ length: g.units }, (_, i) => i);
            return (
              <div className="pq-garage" key={g.key}>
                <div className="pq-gtop"><span className="pq-gtag">{gi === 0 ? t.left : t.right}</span></div>
                <div className={'pq-box' + (winner ? ' win' : '')}>
                  {anim && <span className="pq-ten">{TEN}</span>}
                  <div className="pq-grid">
                    {spots.map((i) => {
                      const leaves = i >= g.result;             // o'nlikdan chiqadigan
                      const c = PAL[i % PAL.length];
                      // Chiqib ketgan mashina still-holatda ko'rinmaydi (joy bo'sh).
                      if (leaves && ok && still) return <div key={i} className="pq-cell empty" />;
                      const j = i - g.result;                   // ketish tartibi (2-qadam)
                      return (
                        <div key={i} className={'pq-cell' + (leaves && ok ? ' empty' : '')}>
                          <span
                            className={'pq-cw' + (leaves && anim ? ' out' : (!ok ? ' idle' : ''))}
                            style={leaves && anim ? { '--od': `${tenDelay(j)}s` } : { '--bd': `${i * 0.1}s` }}
                          >
                            <Car c={c} size={23} />
                            {ok && !leaves && <b className={'pq-cnt' + (anim ? ' pop' : '')} style={anim ? { '--cd': '3.2s' } : undefined}>{i + 1}</b>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {ok && <span className={'pq-res' + (anim ? ' pop' : '')}>{g.result}</span>}
                </div>
                {/* yo'lakcha: birliklar (1-qadam — avval shular chiqadi) */}
                <div className="pq-drive">
                  {units.map((i) => {
                    if (ok && still) return <span key={i} className="pq-slot" />;
                    const c = PAL[(TEN + i) % PAL.length];
                    return (
                      <span key={i} className="pq-slot">
                        <span
                          className={'pq-cw' + (anim ? ' out' : (!ok ? ' idle' : ''))}
                          style={anim ? { '--od': `${unitDelay(i)}s` } : { '--bd': `${(TEN + i) * 0.1}s` }}
                        >
                          <Car c={c} size={23} />
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pq-tl"><i className="r" /><i className="y" /><i className="g" /></div>
        <span className="pq-road" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '64px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-cmp">
          <div className="pill win"><b>{G[0].a} {M} {G[0].b} = {G[0].result}</b><span>{t.left}</span></div>
          <span className="pq-gt">{'>'}</span>
          <div className="pill"><b>{G[1].a} {M} {G[1].b} = {G[1].result}</b><span>{t.right}</span></div>
        </div>
        <div className="pq-sub">
          {G[0].a} {M} {G[0].units} {M} {G[0].fromten} = {TEN} {M} {G[0].fromten} = {G[0].result}<br />
          {G[1].a} {M} {G[1].units} {M} {G[1].fromten} = {TEN} {M} {G[1].fromten} = {G[1].result}
        </div>
      </>)}

      <div className="pq-opts">
        {DATA.options.map((k) => {
          const sel = picked === k; const right = ok && k === DATA.ans;
          return <button key={k} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(k); setFeedback(null); }}>{t[k]}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
