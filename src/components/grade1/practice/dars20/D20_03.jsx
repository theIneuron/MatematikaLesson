// Dars20 · Amaliyot 03 — To'g'ri-noto'g'ri «Garaj» · 🟡 · tag: true_false
// Ekranda tenglik: "15 − 8 = 7". Savol: "Bu to'g'rimi?" Ikki tugma: "Ha" / "Yo'q".
// To'g'ri javob = "Ha" (15 − 8 haqiqatan 7). Garaj modeli 15 mashinani ko'rsatadi:
// garajda o'nta joy to'la (10) + yo'lakchada beshta mashina (birliklar) = 15.
// G'alaba (make-ten-sub): avval yo'lakcha beshtasi chiqib ketadi (15−5=10, oraliq «10»),
// keyin garajdan uchtasi chiqadi (10−3=7). Qolgan yettita sanaladi. Chip "15 − 8 = 7 ✓".
// Mashina yo'lga qarab siljib chiqadi, g'ildiragi aylanadi. VEDI-DO-VERNOGO: noto'g'ri
// "Yo'q" bosilsa qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Sahna (metodist 2026-07-12): yopiq tom-lenta OLINDI — syujet ochiq ko'chada: osmon,
// quyosh, bulut, uzoqda uylar va daraxtlar, pastda yo'l va svetofor.
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

const A = 15, B = 8, SUM = 7, TEN = 10;
const UNITS = A - TEN;        // 5 — yo'lakcha birliklari; avval shular chiqadi (15−5=10)
const FROMTEN = B - UNITS;    // 3 — garajdan (o'nlikdan) olinadigan qolgan qism (10−3=7)
const STAY = TEN - FROMTEN;   // 7 — garajda qoladigan mashinalar
const DATA = { a: A, b: B, sum: SUM, isTrue: true, correct: 'ha', ptype: 'P2', level: '🟡', tag: 'true_false' };

// Mashina rang palitrasi (qizil / ko'k / sariq / yashil / pushti — aylanma).
const PAL = [
  { light: '#ef8a82', main: '#d9534b', dark: '#a63a33' }, // qizil
  { light: '#8fbdec', main: '#4a90d9', dark: '#2f6bab' }, // ko'k
  { light: '#f9d17c', main: '#f2b134', dark: '#cd9421' }, // sariq
  { light: '#8fca88', main: '#57a84f', dark: '#3f8038' }, // yashil
  { light: '#f4aecb', main: '#e879a6', dark: '#c14e7e' }, // pushti
];

// Garaj: 10 joy (5×2), hammasi to'la. G'alabada oxirgi FROMTEN(3) joy bo'shaydi → yettita qoladi.
const GAR = Array.from({ length: TEN }).map((_, i) => ({ i, gone: i >= STAY, c: PAL[i % PAL.length] }));
// Yo'lakcha: UNITS(5) birlik mashina. G'alabada beshtasi ham chiqib ketadi (avval shular).
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
    eyebrow: "Garaj · To'g'ri-noto'g'ri", title: "Bu to'g'rimi?",
    setup: "15 mashinadan 8 tasi chiqib ketdi.",
    ask: "15 − 8 = 7. Bu to'g'rimi?",
    correct: "Barakalla! O'n beshdan beshtasi chiqsa — o'nta, yana uchtasi — yettita. 15 − 8 = 7. Ha, to'g'ri.",
    hint: "O'ngacha ayiring: o'n beshdan beshtasini chiqaring — o'nta qoladi. Sakkizdan beshtasi ketdi, qolgan uchtasini o'ndan oling.",
    yes: "Ha", no: "Yo'q",
  },
  ru: {
    eyebrow: 'Гараж · Верно-неверно', title: 'Это верно?',
    setup: 'Из 15 машин уехали 8.',
    ask: '15 − 8 = 7. Это верно?',
    correct: 'Молодец! Из пятнадцати уехали пять — стало десять, ещё три — семь. 15 − 8 = 7. Да, верно.',
    hint: 'Вычитай до десяти: из пятнадцати убери пять — станет десять. Из восьми ушло пять, оставшиеся три вычти из десятка.',
    yes: 'Да', no: 'Нет',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// MASHINA KANONI (yakka birlik): sodda yumaloq mashina — 2-tonli tana + tom + oynalar +
// ikkita g'ildirak + fara. Bitta mashina = bitta birlik. Chiqib ketishda g'ildirak aylanadi.
let __gid = 0;
const Car = ({ c, size = 30 }) => {
  const id = 'd2003c' + (__gid++);
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
      <ellipse cx="24" cy="27.2" rx="19" ry="2.3" fill="rgba(40,30,20,.18)" />
      {/* tom / kabina */}
      <path d="M13.5 14 L17.5 6.2 Q18.4 4.6 20.2 4.6 L30 4.6 Q31.8 4.6 32.8 6.2 L37.5 14 Z" fill={c.dark} />
      {/* tana */}
      <rect x="3" y="12.4" width="42" height="11.8" rx="5.6" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".8" />
      {/* oynalar */}
      <path d="M19 7 L16.4 12.8 L22.8 12.8 L22.8 7 Z" fill="#d6ecff" opacity=".92" />
      <path d="M24.6 7 L24.6 12.8 L35 12.8 L31 7 Z" fill="#d6ecff" opacity=".92" />
      {/* fara */}
      <circle cx="43" cy="17.4" r="1.7" fill="#fff3b0" stroke="#e2b640" strokeWidth=".5" />
      {/* blik */}
      <rect x="6" y="14.8" width="14" height="2.4" rx="1.2" fill="#fff" opacity=".28" />
      {/* g'ildiraklar (chiqishda aylanadi) */}
      <g className="pq-wheel">
        <circle cx="14" cy="24" r="5" fill="#2b2f36" />
        <circle cx="14" cy="24" r="2.4" fill="#cfd6df" />
        <path d="M14 20.4 V27.6 M10.4 24 H17.6" stroke="#7a828c" strokeWidth=".9" />
      </g>
      <g className="pq-wheel">
        <circle cx="34" cy="24" r="5" fill="#2b2f36" />
        <circle cx="34" cy="24" r="2.4" fill="#cfd6df" />
        <path d="M34 20.4 V27.6 M30.4 24 H37.6" stroke="#7a828c" strokeWidth=".9" />
      </g>
    </svg>
  );
};

export default function D20_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);      // 'ha' | 'yo'q'
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
    const correct = picked === DATA.correct;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.yes, t.no], studentAnswer: { value: picked }, correctAnswer: { value: DATA.correct }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const anim = ok && !still;   // jonli g'alaba animatsiyasi (restore/review'da statik)

  // Chiqish tartibi (make-ten-sub): 1) yo'lakcha birliklari (5), 2) garajdan qolgani (3).
  const walkDelay = (i) => i * 0.18;                              // birliklar: 0 … .72
  const garDelay = (i) => 1.65 + (i - STAY) * 0.18;              // o'nlikdan: 1.65, 1.83, 2.01
  const [fitRef, scale] = useFitScale(384);

  return (
    <div className="pq pq2003" ref={fitRef}>
      <style>{`
        .pq2003{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2003 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2003 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2003 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2003 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2003 .pq-scene{box-sizing:border-box;position:relative;width:384px;height:262px;border-radius:20px;background:linear-gradient(#dff0fb 0%,#e9eef5 52%,#e2e6ec 100%);border:2px solid #cdd7e4;overflow:hidden;}
        .pq2003 .pq-fit{position:relative;margin:0 auto;}
        .pq2003 .pq-sun{position:absolute;left:18px;top:14px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq2003 .pq-cloud{position:absolute;top:2px;right:66px;width:48px;height:15px;border-radius:12px;background:rgba(255,255,255,.85);box-shadow:13px 4px 0 -3px rgba(255,255,255,.8),-13px 3px 0 -4px rgba(255,255,255,.75);z-index:1;animation:pqCloud 6s ease-in-out infinite;}
        /* uzoqdagi ko'cha: uylar + daraxtlar (ambient orqa fon) */
        .pq2003 .pq-town{position:absolute;left:0;top:6px;width:100%;height:46px;z-index:1;pointer-events:none;}
        /* svetofor */
        .pq2003 .pq-light{position:absolute;top:14px;right:16px;width:16px;padding:4px 0;border-radius:5px;background:#2c333d;z-index:4;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:0 2px 4px rgba(0,0,0,.25);}
        .pq2003 .pq-light span{width:8px;height:8px;border-radius:50%;}
        .pq2003 .pq-light .r{background:#6b2b2b;} .pq2003 .pq-light .y{background:#6b5a2b;}
        .pq2003 .pq-light .g{background:#57a84f;box-shadow:0 0 7px 2px rgba(87,168,79,.75);animation:pqBlink 1.8s ease-in-out infinite;}
        .pq2003 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#4f596a,#3a4252);border:2.5px solid #2c3442;color:#eef2f8;font-size:12px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.2);}
        /* yo'l (chiqish) */
        .pq2003 .pq-road{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#4a5058,#3a3f46);z-index:1;border-top:3px solid #2b2f34;}
        .pq2003 .pq-road::after{content:'';position:absolute;left:0;right:0;top:15px;height:3px;background:repeating-linear-gradient(90deg,#f4c542 0 16px,transparent 16px 30px);}

        .pq2003 .pq-arena{position:absolute;left:10px;right:10px;top:40px;bottom:42px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;z-index:3;}
        /* garaj bino */
        .pq2003 .pq-garage{position:relative;padding:9px 10px 11px;border-radius:12px;background:linear-gradient(#c9cfd8,#aab2bd);border:2.5px solid #8a929e;box-shadow:0 6px 13px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.35);}
        .pq2003 .pq-garage.win{animation:pqBox .55s ease;}
        .pq2003 .pq-grid{display:grid;grid-template-columns:repeat(5,36px);grid-auto-rows:26px;gap:5px;}
        .pq2003 .pq-cell{position:relative;border-radius:6px;background:rgba(70,78,90,.16);border:1.5px solid rgba(90,98,110,.45);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 2px rgba(40,46,55,.2);}
        .pq2003 .pq-cell.empty{background:rgba(60,66,76,.28);border-style:dashed;border-color:rgba(90,98,110,.55);}
        /* yo'lakcha (birliklar) */
        .pq2003 .pq-walk{position:relative;display:flex;align-items:center;gap:7px;padding:5px 10px;border-radius:10px;background:rgba(255,255,255,.5);border:1.5px dashed #b6bfcb;}
        .pq2003 .pq-walk .pq-wcell{position:relative;width:34px;height:22px;display:flex;align-items:center;justify-content:center;}
        .pq2003 .pq-walk .pq-tag{margin-left:2px;font-size:12px;font-weight:900;color:#5c6672;background:#fff;padding:1px 9px;border-radius:999px;font-variant-numeric:tabular-nums;}

        .pq2003 .pq-cw{line-height:0;}
        .pq2003 .pq-cw.drive{animation:pqDrive .75s ease-in forwards;animation-delay:var(--dd,0s);}
        .pq2003 .pq-cw.drive .pq-wheel{animation:pqSpin .4s linear infinite;}
        .pq2003 .pq-wheel{transform-box:fill-box;transform-origin:center;}
        .pq2003 .pq-cnt{position:absolute;top:-6px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1a7f43;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        .pq2003 .pq-cnt.late{animation:pqPop .3s both;animation-delay:2.5s;}
        .pq2003 .pq-lbl{position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);z-index:7;background:#fff;border:2px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:12px;padding:1px 10px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;}
        .pq2003 .pq-lbl.late{animation:pqPop .4s both;animation-delay:2.35s;}
        .pq2003 .pq-mid{position:absolute;right:-6px;top:-12px;z-index:7;background:#fff6ea;border:2px solid #d79a3a;color:#a05a1f;font-weight:900;font-size:12px;padding:1px 9px;border-radius:999px;box-shadow:0 2px 4px rgba(0,0,0,.18);font-variant-numeric:tabular-nums;opacity:0;animation:pqMid 1.2s ease both;animation-delay:.95s;}

        .pq2003 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2003 .pq-spark.s2{animation-delay:-.6s;} .pq2003 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2003 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq2003 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef2f7;border:2px solid #c4cdd9;color:#465468;font-variant-numeric:tabular-nums;}
        .pq2003 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2003 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2003 .pq-eq .ok{color:#1a7f43;font-size:22px;}
        .pq2003 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#6b7686;font-variant-numeric:tabular-nums;animation:pqIn .3s .1s both;}

        .pq2003 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:18px;}
        .pq2003 .pq-opt{min-width:118px;height:62px;padding:0 18px;font-size:22px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq2003 .pq-opt:hover:not(:disabled){border-color:#8fc487;transform:translateY(-2px);}
        .pq2003 .pq-opt:active:not(:disabled){transform:scale(.96);}
        .pq2003 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2003 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq2003 .pq-opt:disabled{cursor:default;}
        .pq2003 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq2003 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2003 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrive{0%{opacity:1;transform:translateX(0) translateY(0);}12%{transform:translateX(6px) translateY(-1px);}100%{opacity:0;transform:translateX(150px) translateY(3px);}}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqMid{0%{opacity:0;transform:scale(.5);}18%{opacity:1;transform:scale(1);}72%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(.9);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{0%,100%{transform:translateX(0);}50%{transform:translateX(-8px);}}
        @keyframes pqBlink{0%,100%{opacity:1;}50%{opacity:.5;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqBox{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 384 * scale, height: 262 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" /><span className="pq-cloud" />
        <Town />
        <div className="pq-board">{t.title}</div>
        <div className="pq-light"><span className="r" /><span className="y" /><span className="g" /></div>

        <div className="pq-arena">
          {/* Garaj: o'nta joy. G'alabada oxirgi uchtasi chiqadi → yettita qoladi (badge 1..7) */}
          <div className={'pq-garage' + (ok ? ' win' : '')}>
            <div className="pq-grid">
              {GAR.map((s) => {
                const stay = !s.gone;
                return (
                  <div key={s.i} className={'pq-cell' + (s.gone && ok ? ' empty' : '')}>
                    {stay && (
                      <span className="pq-cw">
                        <Car c={s.c} size={30} />
                        {ok && <b className={'pq-cnt' + (anim ? ' late' : '')}>{s.i + 1}</b>}
                      </span>
                    )}
                    {s.gone && !ok && (
                      <span className="pq-cw"><Car c={s.c} size={30} /></span>
                    )}
                    {s.gone && anim && (
                      <span className="pq-cw drive" style={{ '--dd': `${garDelay(s.i)}s` }}><Car c={s.c} size={30} /></span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* oraliq «10» (avval birliklar chiqib bo'lgach) */}
            {anim && <span className="pq-mid">{TEN}</span>}
            {ok && <span className={'pq-lbl' + (anim ? ' late' : '')}>{STAY}</span>}
          </div>

          {/* Yo'lakcha: beshta birlik mashina. G'alabada beshtasi ham chiqib ketadi (avval shular) */}
          <div className="pq-walk">
            {WALK.map((s) => (
              <div key={s.i} className="pq-wcell">
                {!ok && <span className="pq-cw"><Car c={s.c} size={30} /></span>}
                {anim && <span className="pq-cw drive" style={{ '--dd': `${walkDelay(s.i)}s` }}><Car c={s.c} size={30} /></span>}
              </div>
            ))}
            <span className="pq-tag">{UNITS}</span>
          </div>
        </div>

        <span className="pq-road" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '54px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '42px' }}>✦</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{'−'}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b><span className="ok">✓</span></div>
        <div className="pq-sub">{A} {'−'} {UNITS} {'−'} {FROMTEN} = {TEN} {'−'} {FROMTEN}</div>
      </>)}

      <div className="pq-opts">
        {[{ k: 'ha', lbl: t.yes }, { k: "yo'q", lbl: t.no }].map((o) => {
          const sel = picked === o.k; const right = ok && o.k === DATA.correct;
          return <button key={o.k} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o.k); setFeedback(null); }}>{o.lbl}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
