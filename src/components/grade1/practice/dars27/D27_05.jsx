// Dars27 · Amaliyot 05 — Zanjir «Olma bog'i» · ayirish razryad bo'yicha · U+1F534 · tag: ts_chain
// To'rt AYIRISH misoli (2x2 katak). Har katakda: qutili ifoda + '=' + uzuk-uyacha bitta qatorda,
// ostida bitta qatorda 4 tanlov tugmasi. Bola javoblarni birma-bir to'ldiradi, oxirida o'zi Check bosadi.
// Razryad bo'yicha ayirish: o'nlikdan o'nlik, birlikdan birlik (68-25: 6-2=4 o'nlik, 8-5=3 birlik -> 43).
// Chalg'ituvchilar: M1 qo'shib yuborish (47+13=60), M2 bitta razryadni tashlab ketish (faqat birlik/o'nlik),
// M3 yaqin xato. To'g'ri javob HAR QATORDA boshqa o'rinda (idx 1, 2, 3, 0) — chapdan-tekis emas.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// KANON: bir o'nlik = bitta olma SAVATI (10 olma, "10" nishoni); bir birlik = yakka olma (Dars21).
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

const M = '−'; // ayirish belgisi (U+2212, ASCII defis EMAS)

// To'g'ri javob o'rni HAR QATORDA farqli: idx 1, 2, 3, 0
const ROWS = [
  { a: 47, b: 13, ans: 34, opts: [60, 34, 44, 33] }, // 34 -> idx 1
  { a: 68, b: 25, ans: 43, opts: [93, 48, 43, 42] }, // 43 -> idx 2
  { a: 59, b: 36, ans: 23, opts: [95, 29, 24, 23] }, // 23 -> idx 3
  { a: 64, b: 31, ans: 33, opts: [33, 95, 34, 32] }, // 33 -> idx 0
];
const DATA = { ptype: 'P_chain', level: '🔴', tag: 'ts_chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir", title: "Misollar zanjiri",
    setup: "Har misolni yeching.",
    ask: "To'g'ri javobni tanlang.",
    correct: "Barakalla! Har misolni to'g'ri yechdingiz.",
    hint: "O'nlikdan o'nlik, birlikdan birlik ayiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка", title: "Цепочка примеров",
    setup: "Реши каждый пример.",
    ask: "Выбери верный ответ.",
    correct: "Молодец! Ты верно решил каждый пример.",
    hint: "Десятки из десятков, единицы из единиц.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bir birlik) — Dars21 kanoni: yumaloq tana radial 2-ton, bandak, barg, oq blik.
const Apple = ({ w = 26 }) => {
  const id = 'pq2705a' + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <path d="M12,6.5 Q12.6,3.4 14.2,2.4" fill="none" stroke="#7a4a28" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13,4.6 Q17,2.7 18.7,5.4 Q15.4,7.2 13,4.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
      <path d="M12,7.4 C9.4,4.9 4,5.7 4,11.8 C4,17.6 8,23.2 12,23.2 C16,23.2 20,17.6 20,11.8 C20,5.7 14.6,4.9 12,7.4 Z" fill={`url(#${id})`} stroke="#a5342c" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="8.6" cy="10.6" rx="2.6" ry="1.7" fill="#fff" opacity=".55" transform="rotate(-30 8.6 10.6)" />
    </svg>
  );
};

// SAVAT (bir o'nlik = 10 olma) — Dars21 kanoni: to'qima savat, ustidan olmalar mo'ralaydi, yashil "10" nishoni.
const Basket = ({ w = 46 }) => {
  const id = 'pq2705b' + (__gid++);
  const ap = id + 'ap';
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ab78" /><stop offset="100%" stopColor="#b6743c" />
        </linearGradient>
        <radialGradient id={ap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <g>
        <circle cx="16" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="40" cy="21" r="8" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <circle cx="28" cy="16.5" r="9" fill={`url(#${ap})`} stroke="#a5342c" strokeWidth="1" />
        <path d="M29,7.6 Q33,5.7 34.7,8.4 Q31.4,10.2 29,7.6 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".5" />
        <ellipse cx="13" cy="18.6" rx="2.2" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 13 18.6)" />
        <ellipse cx="25" cy="13.6" rx="2.4" ry="1.5" fill="#fff" opacity=".5" transform="rotate(-30 25 13.6)" />
      </g>
      <ellipse cx="28" cy="27" rx="24" ry="5.4" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.4" />
      <path d="M6,27 L50,27 L44,50.4 Q44,52.6 41.4,52.6 L14.6,52.6 Q12,52.6 12,50.4 Z" fill={`url(#${id})`} stroke="#8a5a2c" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#8a5a2c" strokeWidth="1" opacity=".5" fill="none">
        <path d="M19,28 L21,51" /><path d="M28,28 L28,51.6" /><path d="M37,28 L35,51" />
      </g>
      <g stroke="#95632f" strokeWidth="1.3" fill="none" opacity=".7">
        <path d="M9,33 Q28,37 47,33" /><path d="M11,41 Q28,45 45,41" /><path d="M12.6,48 Q28,51.4 43.4,48" />
      </g>
      <g>
        <circle cx="28" cy="41" r="8.4" fill="#1a7f43" stroke="#fff" strokeWidth="1.6" />
        <text x="28" y="44.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
      </g>
    </svg>
  );
};

// KAPALAK — ambient dekor (bosilmaydi): 2 juft qanot pirpiratadi, aylanma suzadi.
const Butterfly = () => (
  <svg viewBox="0 0 40 32" width="30" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq2705-wg" d="M20 16 C10 4 2 6 4 14 C5 20 14 20 20 16 Z" fill="#f6a5cf" stroke="#d9629f" strokeWidth="1" />
    <path className="pq2705-wg" d="M20 16 C30 4 38 6 36 14 C35 20 26 20 20 16 Z" fill="#f6a5cf" stroke="#d9629f" strokeWidth="1" />
    <path className="pq2705-wg" d="M20 16 C13 24 6 26 7 21 C8 17 15 17 20 16 Z" fill="#f7c0dd" stroke="#d9629f" strokeWidth="1" />
    <path className="pq2705-wg" d="M20 16 C27 24 34 26 33 21 C32 17 25 17 20 16 Z" fill="#f7c0dd" stroke="#d9629f" strokeWidth="1" />
    <ellipse cx="20" cy="16" rx="2" ry="6.5" fill="#5a4636" />
    <path d="M20 10 Q18 5 15 4 M20 10 Q22 5 25 4" stroke="#5a4636" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

const Trophy = () => (
  <svg viewBox="0 0 64 64" width="46" height="46" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M17 13 Q5 14 9 24 Q12 32 21 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M47 13 Q59 14 55 24 Q52 32 43 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 8 H46 V22 a14 14 0 0 1 -28 0 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 12 Q22 24 27 30" stroke="#f8d47a" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".9" />
    <rect x="28" y="36" width="8" height="8" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="20" y="44" width="24" height="6" rx="2" fill="#f2b134" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="15" y="50" width="34" height="7" rx="2.5" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.8" />
    <path d="M32 12.5 L33.6 16 L37.4 16.4 L34.6 18.9 L35.4 22.6 L32 20.7 L28.6 22.6 L29.4 18.9 L26.6 16.4 L30.4 16 Z" fill="#fff" opacity=".9" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D27_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.vals) setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: ROWS.map((r) => `${r.a} ${M} ${r.b} = ${r.opts.join('/')}`),
      studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) },
      correct, meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still; // g'alabagacha yengil tebranish (bosiladigan nishon EMAS — dekor)
  const CRATES = [0, 1, 2, 3];
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq2705">
      <style>{`
        .pq2705{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2705 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2705 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2705 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2705 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2705 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eef7e6,#e2f0d6);border:2px solid #cfe3bd;}
        .pq2705 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:150px;border-radius:18px;background:linear-gradient(#cfeafc 0%,#e4f4d9 54%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2705 .pq-fit{position:relative;margin:0 auto;}
        .pq2705 .pq-sun{position:absolute;top:10px;right:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pq2705sun 3.6s ease-in-out infinite;z-index:1;pointer-events:none;}
        .pq2705 .pq-cloud{position:absolute;width:48px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pq2705cloud linear infinite;z-index:1;pointer-events:none;}
        .pq2705 .pq-cloud.c1{top:12px;left:-70px;animation-duration:31s;animation-delay:-9s;}
        .pq2705 .pq-cloud.c2{top:34px;left:-70px;width:34px;height:11px;opacity:.7;animation-duration:41s;animation-delay:-26s;}
        .pq2705 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2705 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2705 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12.5px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2705 .pq-crates{position:absolute;left:10px;right:10px;bottom:12px;display:flex;align-items:flex-end;justify-content:center;gap:10px;z-index:3;pointer-events:none;}
        .pq2705 .pq-crate{position:relative;line-height:0;}
        .pq2705 .pq-crate.idle{animation:pq2705bob 3s ease-in-out infinite;animation-delay:var(--d,0s);}
        .pq2705 .pq-crate.win{animation:pq2705win .5s ease;animation-delay:var(--d,0s);}
        .pq2705 .pq-loose{position:absolute;bottom:16px;line-height:0;z-index:3;pointer-events:none;}
        .pq2705 .pq-loose.l1{left:24px;} .pq2705 .pq-loose.l2{right:26px;}
        .pq2705 .pq-loose.idle{animation:pq2705bob 3.4s ease-in-out infinite;animation-delay:-1.2s;}
        .pq2705 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:19px;height:19px;padding:0 3px;border-radius:999px;background:#1a7f43;color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:6;pointer-events:none;box-shadow:0 2px 4px rgba(0,0,0,.25);animation:pq2705pop .32s both;animation-delay:var(--bd,0s);font-variant-numeric:tabular-nums;}
        .pq2705 .pq-bfly{position:absolute;left:60px;top:34px;line-height:0;z-index:4;animation:pq2705fly 12s ease-in-out infinite;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq2705 .pq2705-wg{transform-box:fill-box;transform-origin:50% 50%;animation:pq2705flap .3s ease-in-out infinite alternate;}
        .pq2705 .pq-trophy{position:absolute;top:36px;left:50%;transform:translateX(-50%);z-index:7;line-height:0;filter:drop-shadow(0 3px 6px rgba(201,138,18,.4));animation:pq2705ans .55s cubic-bezier(.3,1.5,.5,1) both;pointer-events:none;}
        .pq2705 .pq-wstar{position:absolute;z-index:7;line-height:0;opacity:0;animation:pq2705tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));pointer-events:none;}
        .pq2705 .pq-wstar.w2{animation-delay:-.5s;} .pq2705 .pq-wstar.w3{animation-delay:-1.05s;}

        .pq2705 .pq-rows{display:grid;grid-template-columns:1fr;align-items:stretch;gap:10px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq2705 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2705 .pq-card{display:flex;flex-direction:column;align-items:center;gap:8px;padding:9px 8px 10px;border-radius:16px;border:2.5px solid #d8e0cf;background:#fff;transition:.15s;}
        .pq2705 .pq-card.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2705 .pq-card.good.win{animation:pq2705cele .5s ease;}
        .pq2705 .pq-card.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2705shake .35s ease;}
        .pq2705 .pq-line{display:flex;align-items:center;justify-content:center;gap:7px;}
        .pq2705 .pq-ex{min-width:96px;height:44px;border-radius:10px;background:#f5f7f2;border:2px solid #dde3d5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq2705 .pq-ex b.m{color:#c0392b;margin:0 5px;font-weight:900;}
        .pq2705 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq2705 .pq-slot{width:46px;height:44px;border-radius:10px;border:2.5px dashed #c8cfba;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2705breath 2.4s ease-in-out infinite;}
        .pq2705 .pq-card:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2705 .pq-card:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2705 .pq-card:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2705 .pq-card:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2705 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2705 .pq-card.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2705 .pq-opts{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;}
        .pq2705 .pq-opt{width:44px;height:42px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:18px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;padding:0;}
        .pq2705 .pq-opt:hover:not(:disabled){border-color:#8fc283;transform:translateY(-2px);}
        .pq2705 .pq-opt:active:not(:disabled){transform:scale(.92);}
        .pq2705 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2705 .pq-card.good .pq-opt.sel{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;}
        .pq2705 .pq-opt:disabled{cursor:default;}
        .pq2705 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2705in .22s ease both;}
        .pq2705 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2705 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2705bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2705win{0%{transform:scale(1);}30%{transform:scale(1.05) translateY(-2px);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2705sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2705cloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pq2705flap{from{transform:rotateY(0deg);}to{transform:rotateY(55deg);}}
        @keyframes pq2705fly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(80px,-12px) rotate(6deg);}50%{transform:translate(150px,10px) rotate(-4deg);}75%{transform:translate(70px,20px) rotate(5deg);}}
        @keyframes pq2705pop{from{opacity:0;transform:translateX(-50%) scale(.3);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2705ans{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2705tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2705breath{0%,100%{transform:scale(1);border-color:#c8cfba;}50%{transform:scale(1.06);border-color:#aebf9c;}}
        @keyframes pq2705shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2705cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2705in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 150 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-hill" />
          <div className="pq-board">{t.title}</div>
          {!ok && <span className="pq-bfly"><Butterfly /></span>}

          {/* Olma bog'i hosili — ambient dekor savatlar (bosilmaydi). G'alabada 1..4 sanoq nishoni. */}
          <div className="pq-crates">
            {CRATES.map((i) => (
              <span key={i} className={'pq-crate' + (idle ? ' idle' : '') + (ok ? ' win' : '')} style={{ '--d': `${i * 0.12}s` }}>
                <Basket w={44} />
                {ok && <span className="pq-cnt" style={{ '--bd': `${0.2 + i * 0.22}s` }}>{i + 1}</span>}
              </span>
            ))}
          </div>
          <span className={'pq-loose l1' + (idle ? ' idle' : '')}><Apple w={22} /></span>
          <span className={'pq-loose l2' + (idle ? ' idle' : '')}><Apple w={22} /></span>

          {ok && (<>
            <span className="pq-trophy"><Trophy /></span>
            <span className="pq-wstar" style={{ left: '30%', top: '30px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '66%', top: '40px' }}><Star fill="#e59a2f" /></span>
            <span className="pq-wstar w3" style={{ left: '50%', top: '78px' }}><Star fill="#f2b134" /></span>
          </>)}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-card' + cls}>
                <div className="pq-line">
                  <div className="pq-ex">{r.a}<b className="m">{M}</b>{r.b}</div>
                  <span className="pq-eq">=</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>
                <div className="pq-opts">
                  {r.opts.map((n, k) => (
                    <button key={k} type="button" className={'pq-opt' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
