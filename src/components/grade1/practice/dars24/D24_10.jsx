// Dars24 · Amaliyot 10 — NEW «Savatlarni birlashtiring» combine «Olma bog'i» · 🔴 · tag: combine_tens
// BILIM TEKSHIRUVI (metodist 2026-07-12, «10-amaliyot trenajyor bo'lib qolgan» naqshi): 20 + 30.
// Sahna: 2 savat (20, chapda) '+' 3 savat (30, o'ngda). Bola [Birlashtiring] tugmasini bosadi →
// savatlar bitta qatorga birlashadi va ustiga YOG'OCH QOPQOQ yopiladi («?» bilan) — savatlarni sanab
// bo'lmaydi, jonli sanoq-nishonlari YO'Q. Pastda 4 sonli variant [50] [5] [60] [40] faollashadi —
// bola yig'indini XAYOLAN hisoblab tanlaydi. To'g'rida qopqoq ko'tariladi, savatlar 10 lab sanaladi
// (10..50), tenglama 20 + 30 = 50 ochiladi, bayram; noto'g'rida hint, qulf YO'Q, qayta urinish.
// MODEL: o'nliklarni SANAYMIZ — 2 o'nlik va 3 o'nlik = 5 o'nlik (= 50); ustun YO'Q. Sonlar 1-sinf
// sbornik zadach/primerlaridan: 20 + 30. Distraktorlar: 5 (M1 o'nlikni birlik deb: 2+3), 60 (M4
// bittaga adashib sanash), 40 DRAFT (javob−10, metodist validatsiyasini kutadi). onReady faqat
// birlashtirib variant tanlanganda. setChecked FAQAT to'g'rida (picked === 50). studentAnswer = { picked }.
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

const A = 2, B = 3;                 // savatlar soni: 2 o'nlik + 3 o'nlik
const TOTAL = A + B;               // birlashgach 5 savat
const ADD_A = 20, ADD_B = 30, TARGET = 50;
// 4 variant (bilim-tekshiruv naqshi); 40 — DRAFT distraktor (yumaloq o'nlik, javob−10), metodist validatsiyasini kutadi.
const DATA = { a: ADD_A, b: ADD_B, target: TARGET, options: [50, 5, 60, 40], ptype: 'NEW', level: '🔴', tag: 'combine_tens' };
const GROUP_A = Array.from({ length: A }).map((_, i) => i);
const GROUP_B = Array.from({ length: B }).map((_, i) => i);
const MERGED = Array.from({ length: TOTAL }).map((_, i) => i);

const T = {
  uz: {
    eyebrow: "Olma bog'i · Birlashtirish", title: "Savatlarni birlashtiring",
    setup: "20 + 30.",
    ask: "Birlashtiring, keyin javobni tanlang.",
    correct: "Barakalla! 2 savat va 3 savat — 5 savat. 20 + 30 = 50.",
    hint: "Har savat — bitta o'nlik. 2 o'nlik va 3 o'nlik — jami nechta o'nlik?",
    btnMerge: "Birlashtiring",
    first: "Avval savatlarni birlashtiring.",
    covered: "Savatlar berkitildi — yig'indini xayolan hisoblang.",
    tword: "o'nlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Объединение", title: "Объедини корзины",
    setup: "20 + 30.",
    ask: "Объедини, потом выбери ответ.",
    correct: "Молодец! 2 корзины и 3 корзины — 5 корзин. 20 + 30 = 50.",
    hint: "Каждая корзина — десяток. 2 десятка и 3 десятка — сколько всего десятков?",
    btnMerge: "Объединить",
    first: "Сначала объедини корзины.",
    covered: "Корзины закрыты — сосчитай сумму в уме.",
    tword: "десятков",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma bir birlikka bog'langan) — Dars21 dan uzviy. To'qilgan savat,
// ustidan olmalar mo'ralaydi, oldida yashil "10" nishoni. Bola savatdagi olmalarni QAYTA sanamaydi —
// savat bitta BUTUN o'nlik. Bog' modeli sifatida ko'rsatiladi (bosilmaydi — javob tugmalarda).
const Crate = ({ w = 40 }) => {
  const uid = 'pq2410c' + (__gid++);
  const h = w * 96 / 88;
  const ap = (x, y, s) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,-9 Q0.6,-13 3,-14.5" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1,-10 Q6.5,-14.5 10.5,-10 Q5.5,-6.8 1,-10 Z" fill="#57ad55" stroke="#3f8a41" strokeWidth=".6" />
      <path d="M0,-8 C-6,-8 -11,-4 -11,3 C-11,10.4 -6,14 -3,14 C-1,14 -0.5,12.5 0,12.5 C0.5,12.5 1,14 3,14 C6,14 11,10.4 11,3 C11,-4 6,-8 0,-8 Z" fill={`url(#${uid}a)`} stroke="#a3241f" strokeWidth=".8" />
      <ellipse cx="-4.6" cy="-1.4" rx="2.6" ry="3.6" fill="#fff" opacity=".4" />
    </g>
  );
  return (
    <svg viewBox="0 0 88 96" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={uid + 'a'} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ff8f7a" /><stop offset="45%" stopColor="#ec4d3d" /><stop offset="100%" stopColor="#b62a24" />
        </radialGradient>
        <linearGradient id={uid + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2a659" /><stop offset="100%" stopColor="#a2662a" />
        </linearGradient>
      </defs>
      {ap(30, 42, 1)}
      {ap(60, 42, 1)}
      {ap(45, 34, 1.16)}
      <path d="M14,54 L74,54 L66,92 L22,92 Z" fill={`url(#${uid}w)`} stroke="#7c4f21" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="30" y1="56" x2="33" y2="91" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <line x1="44" y1="56" x2="44" y2="92" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <line x1="58" y1="56" x2="55" y2="91" stroke="#8a5a26" strokeWidth="1.3" opacity=".5" />
      <path d="M17,62 Q44,67 71,62" fill="none" stroke="#b9803c" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M18.5,72 Q44,77 69.5,72" fill="none" stroke="#cd9046" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M20,82 Q44,87 68,82" fill="none" stroke="#b9803c" strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="44" cy="54" rx="31" ry="7" fill="#d29a4e" stroke="#7c4f21" strokeWidth="1.6" />
      <ellipse cx="44" cy="54" rx="23" ry="4.2" fill="#8a5a26" opacity=".32" />
      <g>
        <circle cx="44" cy="74" r="11" fill="#2e7d46" stroke="#1f5e33" strokeWidth="1.4" />
        <text x="44" y="78.4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
      </g>
    </svg>
  );
};

// Birlashtirish tugmasi ichidagi kichik nishon: ikki savat bitta savatga oqib kelmoqda (bezak, alohida
// bosiladigan nishon EMAS — bir butun tugma).
const MergeIcon = () => (
  <svg className="ic" viewBox="0 0 52 30" aria-hidden="true">
    <g>
      <path d="M4,10 L16,10 L14,25 L6,25 Z" fill="#c98243" stroke="#7a4a20" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M36,10 L48,10 L46,25 L38,25 Z" fill="#c98243" stroke="#7a4a20" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="10" cy="8" r="4" fill="#e8443a" stroke="#a6291f" strokeWidth=".7" />
      <circle cx="42" cy="8" r="4" fill="#e8443a" stroke="#a6291f" strokeWidth=".7" />
    </g>
    <path d="M18,15 L34,15" fill="none" stroke="#3f8a41" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M30,11 L34,15 L30,19" fill="none" stroke="#3f8a41" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function D24_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [combined, setCombined] = useState(false);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda birlashish/sanoq animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: studentAnswer = { picked } dan holatni tiklaydi. Javob berilgan bo'lsa savatlar
  // birlashtirilgan bo'lgan (options faqat birlashgach faol) → combined = true.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      setCombined(true);
      if (initialAnswer.studentAnswer.picked != null) setPicked(initialAnswer.studentAnswer.picked);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(combined && picked !== null && !checked); }, [combined, picked, checked, onReady]);

  const check = useCallback(() => {
    if (!combined || picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [combined, picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !combined && !still; // birlashtirilmagan dekor savatlar yengil tebranadi (bosiladigan nishon EMAS)

  const combine = () => { if (lock || combined) return; setCombined(true); setFeedback(null); };
  // BILIM TEKSHIRUVI: g'alabagacha sanoq-nishonlari umuman ko'rsatilmaydi (qopqoq yig'indini yashiradi).
  // Faqat to'g'ri javobda qopqoq ko'tarilib, savatlar 10 lab sanaladi: 10, 20, 30, 40, 50.
  const badge = (i) => (i + 1) * 10;
  const cnDelay = (i) => still ? 0 : 0.5 + i * 0.28;  // sanoq nishonchalari qopqoq ko'tarilgach ketma-ket
  const enDelay = (i) => still ? 0 : i * 0.2;         // savatlar ketma-ket "oqib keladi"
  const coverDelay = still ? 0 : TOTAL * 0.2 + 0.25;  // qopqoq savatlar joylashib bo'lgach yopiladi
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq2410" ref={fitRef}>
      <style>{`
        .pq2410{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2410 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2410 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2410 .pq-setup{color:#5c6672;font-weight:700;font-variant-numeric:tabular-nums;}
        .pq2410 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2410 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:214px;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2410 .pq-fit{position:relative;margin:0 auto;}
        .pq2410 .pq-sun{position:absolute;right:18px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2410sun 3.6s ease-in-out infinite;}
        .pq2410 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.8;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2410sway 4.4s ease-in-out infinite;}
        .pq2410 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2410 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2410 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2410 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        .pq2410 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:30px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2410 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;}
        .pq2410 .pq-baskets{display:flex;justify-content:center;gap:4px;}
        .pq2410 .pq-obj{position:relative;line-height:0;}
        .pq2410 .pq-obj.idle{animation:pq2410bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2410 .pq-pill{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #b6dcb6;color:#3f8a41;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.12);}
        .pq2410 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        /* birlashgan qator — savatlar bitta joyga oqib keladi, o'nliklab sanaladi */
        .pq2410 .pq-merged{display:flex;align-items:flex-end;justify-content:center;gap:5px;animation:pq2410in .3s ease both;}
        .pq2410 .pq-mobj{position:relative;line-height:0;animation:pq2410flow .4s ease both;animation-delay:var(--en,0s);}
        /* 10 lab sanoq nishonchasi — savat ustida (bezak, bosilmaydi) */
        .pq2410 .pq-cnt{position:absolute;top:-11px;left:50%;transform:translateX(-50%);min-width:22px;height:20px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;animation:pq2410pop .32s both;animation-delay:var(--cd,0s);}
        .pq2410 .pq-cnt.fin{background:#1a7f43;animation:pq2410fin .5s ease both;animation-delay:var(--cd,0s);}

        /* YOG'OCH QOPQOQ — birlashgan savatlarni berkitadi (yig'indini sanab bo'lmaydi); bezak, bosilmaydi */
        .pq2410 .pq-mwrap{position:relative;}
        .pq2410 .pq-cover{position:absolute;inset:-16px -10px -8px;z-index:8;display:flex;align-items:center;justify-content:center;border-radius:16px;background:repeating-linear-gradient(180deg,#d3a263 0 11px,#c08a4b 11px 13px);border:3px solid #7c4f21;box-shadow:0 4px 8px rgba(60,35,10,.28),inset 0 2px 0 rgba(255,255,255,.25);opacity:0;pointer-events:none;animation:pq2410cover .4s ease forwards;animation-delay:var(--cvd,0s);}
        .pq2410 .pq-cover b{font-size:36px;font-weight:900;color:#fff6e6;text-shadow:0 2px 3px rgba(90,55,15,.45);}
        .pq2410 .pq-cover.st{animation:none;opacity:1;}
        .pq2410 .pq-cover.lift{opacity:1;animation:pq2410lift .5s ease forwards;}

        .pq2410 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2410tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2410 .pq-spark.s2{animation-delay:-.6s;} .pq2410 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2410 .pq-tools{display:flex;justify-content:center;margin-top:16px;}
        .pq2410 .pq-merge{display:inline-flex;align-items:center;gap:9px;padding:12px 22px;border-radius:16px;border:2.5px solid #4c9d55;background:linear-gradient(#eafaea,#d6f2d9);color:#2c6633;font-size:17px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #7bb87f;transition:.12s;}
        .pq2410 .pq-merge:hover:not(:disabled){filter:brightness(1.03);transform:translateY(-1px);}
        .pq2410 .pq-merge:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #7bb87f;}
        .pq2410 .pq-merge:disabled{background:#eceae6;border-color:#c9c6c0;color:#9a968f;box-shadow:0 3px 0 #c9c6c0;cursor:default;}
        .pq2410 .pq-merge .ic{width:44px;height:26px;flex:0 0 auto;}

        .pq2410 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2410in .3s ease both;}
        .pq2410 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2410 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2410 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2410 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2410in .3s .1s both;}

        .pq2410 .pq-first{text-align:center;margin-top:14px;font-size:13px;font-weight:800;color:#8a7a5a;}
        .pq2410 .pq-opts{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px;}
        .pq2410 .pq-opt{min-width:66px;height:66px;padding:0 8px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2410 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2410 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2410 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2410 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2410cele .5s ease;}
        .pq2410 .pq-opt:disabled{cursor:default;opacity:.55;}
        .pq2410 .pq-opt.sel:disabled,.pq2410 .pq-opt.right:disabled{opacity:1;}
        .pq2410 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2410in .22s ease both;}
        .pq2410 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2410 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2410bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2410sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2410sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2410flow{from{opacity:0;transform:translateY(6px) scale(.82);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2410cover{from{opacity:0;transform:translateY(-16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq2410lift{from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(-32px);}}
        @keyframes pq2410pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2410fin{0%{transform:translateX(-50%) scale(.4);}55%{transform:translateX(-50%) scale(1.25);}100%{transform:translateX(-50%) scale(1);}}
        @keyframes pq2410tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2410cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2410in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 380 * scale, height: 214 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ left: '16px', top: '30px' }}>❧</span>
        <span className="pq-leaf l2" style={{ right: '18px', bottom: '44px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {!combined ? (<>
            {/* 2 savat = 2 o'nlik = 20 */}
            <div className="pq-group">
              <div className="pq-baskets">
                {GROUP_A.map((i) => (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.12}s` }}>
                    <Crate w={40} />
                  </span>
                ))}
              </div>
              <span className="pq-pill">{ADD_A}</span>
            </div>

            {/* O'nliklar QO'SHILADI: savatlarni birlashtiramiz (ayirish EMAS) */}
            <span className="pq-plus">{'+'}</span>

            {/* 3 savat = 3 o'nlik = 30 */}
            <div className="pq-group">
              <div className="pq-baskets">
                {GROUP_B.map((i) => (
                  <span key={i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(A + i) * 0.12}s` }}>
                    <Crate w={40} />
                  </span>
                ))}
              </div>
              <span className="pq-pill">{ADD_B}</span>
            </div>
          </>) : (
            /* Birlashgan qator: barcha savatlar bitta joyda; g'alabagacha ustini QOPQOQ yopadi
               (yig'indini sanab bo'lmaydi — bola xayolan hisoblaydi). G'alabada qopqoq ko'tarilib,
               savatlar 10 lab sanaladi (10..50). */
            <div className="pq-mwrap">
              <div className="pq-merged">
                {MERGED.map((i) => {
                  const cls = 'pq-cnt' + (i === TOTAL - 1 ? ' fin' : '');
                  return (
                    <span key={i} className="pq-mobj" style={{ '--en': `${enDelay(i)}s` }}>
                      <Crate w={40} />
                      {ok && <span className={cls} style={{ '--cd': `${cnDelay(i)}s` }}>{badge(i)}</span>}
                    </span>
                  );
                })}
              </div>
              {!ok
                ? <span className={'pq-cover' + (still ? ' st' : '')} style={{ '--cvd': `${coverDelay}s` }} aria-hidden="true"><b>?</b></span>
                : (!still && <span className="pq-cover lift" aria-hidden="true"><b>?</b></span>)}
            </div>
          )}
        </div>

        <span className="pq-ground" />

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '52px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '66px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '40px' }}>✦</span>
        </>)}
      </div>
      </div>

      {/* Birlashtirish tugmasi — birlashguncha ko'rinadi */}
      {!combined && (
        <div className="pq-tools">
          <button type="button" className="pq-merge" disabled={lock} onClick={combine}>
            <MergeIcon />
            <span>{t.btnMerge}</span>
          </button>
        </div>
      )}

      {/* G'alaba: o'nliklar QO'SHILIB 50 beradi (javob faqat shu yerda ochiladi) */}
      {ok && (<>
        <div className="pq-eq"><b>{ADD_A}</b><i>{'+'}</i><b>{ADD_B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{TOTAL} {t.tword} = {TARGET}</div>
      </>)}

      {/* Birlashgach 4 sonli variant faollashadi — yig'indi qopqoq ostida, bola XAYOLAN hisoblaydi. */}
      {combined
        ? (<>
          {!ok && <div className="pq-first">{t.covered}</div>}
          <div className="pq-opts">
            {DATA.options.map((n) => {
              const sel = picked === n; const right = ok && n === TARGET;
              return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
            })}
          </div>
        </>)
        : <div className="pq-first">{t.first}</div>}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
