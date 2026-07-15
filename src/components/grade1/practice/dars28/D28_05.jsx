// Dars28 · Amaliyot 05 — Masala tuzilishi «Yig'indiga masala» zanjiri · 🔴 · tag: sum_chain
// CHAIN: 4 ta yig'indiga masala birdaniga (barchasi QO'SHISH — ikki guruh birlashsa qo'shiladi).
// Sonlar QIYIN: ikki xonali + ikki xonali, razryad ustidan o'tmaydi (birlik+birlik < 10,
// o'nlik+o'nlik), yig'indi <= 99. Sbornikdan: 24+13=37, 41+35=76, 52+27=79, 63+24=87.
// Har son SAVAT (o'nlik = 10 olma, «10» nishoni) + yakka OLMA (birlik) modeli bilan ko'rsatiladi;
// o'nlikka o'nlik, birlikka birlik qo'shiladi (Dars21 kanoni). Har misol = modelli ifoda + '=' +
// uzuk-chiziqli katak, ostida bitta qatorda variantlar. To'g'ri javob har qatorda BOSHQA o'rinda
// (idx 1, 2, 3, 0) — chapdagi doim g'olib emas. Chalg'ituvchilar: barcha raqamlarni qo'shib
// yuborish (M1: 24+13 -> 2+4+1+3=10), faqat o'nliklar (M2: 20+10=30), bir birlik farq (M3).
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
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

const ROWS = [
  { expr: '24 + 13', ans: 37, opts: [10, 37, 30, 38] },  // to'g'ri idx 1
  { expr: '41 + 35', ans: 76, opts: [13, 70, 76, 75] },  // to'g'ri idx 2
  { expr: '52 + 27', ans: 79, opts: [16, 70, 78, 79] },  // to'g'ri idx 3
  { expr: '63 + 24', ans: 87, opts: [87, 15, 80, 86] },  // to'g'ri idx 0
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'sum_chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir", title: "Masalalar zanjiri",
    setup: "Har misolni yeching.",
    ask: "To'g'ri javobni tanlang.",
    correct: "Barakalla! Har misolni to'g'ri yechdingiz.",
    hint: "Jami topish — qo'shing: o'nlikka o'nlik, birlikka birlik.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка", title: "Цепочка примеров",
    setup: "Реши каждый пример.",
    ask: "Выбери верный ответ.",
    correct: "Молодец! Ты верно решил каждый пример.",
    hint: "Найти всего — сложить.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// KICHIK SAVAT (bitta o'nlik = 10 olma, «10» nishoni). Ifoda ichida modelni ko'rsatadi — bosilmaydi.
const CrateMini = () => (
  <svg viewBox="0 0 26 24" width="16" height="15" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M3,7 L23,7 L20,21 Q19.6,22.4 18.2,22.4 L7.8,22.4 Q6.4,22.4 6,21 Z" fill="#cd9450" stroke="#8a5a2c" strokeWidth="1.2" strokeLinejoin="round" />
    <g stroke="#8a5a2c" strokeWidth=".8" opacity=".5" fill="none">
      <path d="M10,8 L11,21" /><path d="M16,8 L15,21" />
      <path d="M5,12 Q13,14.5 21,12" /><path d="M6,17 Q13,19 20,17" />
    </g>
    <ellipse cx="13" cy="7" rx="10.5" ry="2.6" fill="#d59a5f" stroke="#8a5a2c" strokeWidth="1.1" />
    <circle cx="13" cy="15" r="6" fill="#1a7f43" stroke="#fff" strokeWidth="1.1" />
    <text x="13" y="17.8" textAnchor="middle" fontSize="7.4" fontWeight="800" fill="#fff" fontFamily="Manrope, sans-serif">10</text>
  </svg>
);

// YAKKA OLMA (bitta birlik). Ifoda ichida modelni ko'rsatadi — bosilmaydi.
const AppleMini = () => (
  <svg viewBox="0 0 16 18" width="10" height="11" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M8,4.6 Q8.4,2.4 9.6,1.8" fill="none" stroke="#7a4a28" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8.6,3.2 Q11.4,1.9 12.6,3.8 Q10.4,5 8.6,3.2 Z" fill="#5aa84f" stroke="#3f8038" strokeWidth=".4" />
    <path d="M8,5 C6.2,3.3 2.6,3.9 2.6,8 C2.6,11.9 5.3,15.6 8,15.6 C10.7,15.6 13.4,11.9 13.4,8 C13.4,3.9 9.8,3.3 8,5 Z" fill="#df5b52" stroke="#a5342c" strokeWidth=".9" strokeLinejoin="round" />
    <ellipse cx="5.6" cy="7.2" rx="1.7" ry="1.1" fill="#fff" opacity=".5" transform="rotate(-30 5.6 7.2)" />
  </svg>
);

// Ikki xonali son = savatlar (o'nlik) + yakka olmalar (birlik) + raqam yorlig'i. Javobni OCHMAYDI.
const Operand = ({ n }) => {
  const tens = Math.floor(n / 10), units = n % 10;
  return (
    <span className="pq-oper">
      <span className="pq-nv">
        <span className="pq-nv-c">{Array.from({ length: tens }).map((_, i) => <CrateMini key={i} />)}</span>
        <span className="pq-nv-a">{Array.from({ length: units }).map((_, i) => <AppleMini key={i} />)}</span>
      </span>
      <b className="pq-dig">{n}</b>
    </span>
  );
};

// KATTA OLMA (g'alaba dekori): yumaloq tana — radial 2-ton, bandak, barg, oq blik. Bosilmaydi.
const Apple = ({ w = 34 }) => {
  const id = 'pq2805a' + (__gid++);
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

// KATTA SAVAT (g'alaba dekori): to'qima savat, ustidan olmalar mo'ralaydi. Bosilmaydi.
const Basket = ({ w = 54 }) => {
  const id = 'pq2805b' + (__gid++);
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

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// 4 dekor-olma joyi (sahna px).
const APPLES = [
  { x: 34, y: 120 },
  { x: 120, y: 120 },
  { x: 206, y: 120 },
  { x: 292, y: 120 },
];

export default function D28_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda kirish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.expr} = ${r.opts.join('/')}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq2805">
      <style>{`
        .pq2805{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2805 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2805 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2805 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2805 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2805 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eef7ea,#e2f0da);border:2px solid #cfe6c6;}
        .pq2805 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:206px;border-radius:18px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2805 .pq-fit{position:relative;margin:0 auto;}
        .pq2805 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pq2805sun 3.6s ease-in-out infinite;z-index:1;pointer-events:none;}
        .pq2805 .pq-cloud{position:absolute;width:50px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pq2805cloud linear infinite;z-index:1;pointer-events:none;}
        .pq2805 .pq-cloud.c1{top:12px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq2805 .pq-cloud.c2{top:34px;left:-70px;width:36px;height:11px;opacity:.7;animation-duration:39s;animation-delay:-26s;}
        .pq2805 .pq-tree{position:absolute;bottom:44px;z-index:1;pointer-events:none;transform-origin:50% 100%;}
        .pq2805 .pq-tree.t1{left:4px;animation:pq2805sway 4.2s ease-in-out infinite;}
        .pq2805 .pq-tree.t2{right:6px;bottom:48px;animation:pq2805sway 4.8s ease-in-out .6s infinite;}
        .pq2805 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:9px;height:28px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2805 .pq-crown{position:relative;width:62px;height:50px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2805 .pq-crown i{position:absolute;width:9px;height:9px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2805 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2805 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}
        .pq2805 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:3;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#8a5a2c,#6d4420);border:2.5px solid #59340f;color:#fff6e6;font-size:12.5px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);pointer-events:none;}
        .pq2805 .pq-board::before,.pq2805 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#59340f;border-radius:0 0 3px 3px;}
        .pq2805 .pq-board::before{left:16px;} .pq2805 .pq-board::after{right:16px;}
        .pq2805 .pq-apw{position:absolute;line-height:0;z-index:2;animation:pq2805drop .7s cubic-bezier(.4,1.2,.6,1) both;animation-delay:var(--hd,0s);filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq2805 .pq-scene.still .pq-apw{animation:none;}
        .pq2805 .pq-boba{display:block;position:relative;animation:pq2805bob 2.8s ease-in-out infinite;animation-delay:var(--fd,0s);}
        .pq2805 .pq-boba.win{animation:pq2805bob 2.8s ease-in-out infinite,pq2805cele .55s ease;}
        .pq2805 .pq-cnt{position:absolute;top:-8px;right:-6px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#1a7f43;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pq2805pop .3s ease both;z-index:4;pointer-events:none;font-variant-numeric:tabular-nums;}
        .pq2805 .pq-basketw{position:absolute;top:66px;left:50%;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 6px rgba(138,90,44,.4));animation:pq2805ans .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2805 .pq-wstar{position:absolute;z-index:4;line-height:0;opacity:0;animation:pq2805tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));pointer-events:none;}
        .pq2805 .pq-wstar.w2{animation-delay:-.5s;} .pq2805 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq2805 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq2805 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2805 .pq-rw{display:flex;flex-wrap:wrap;gap:7px;align-items:center;align-content:center;justify-content:center;padding:6px 8px;border-radius:14px;border:2.5px solid #cfe3d0;background:#fff;transition:.15s;}
        .pq2805 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2805 .pq-rw.good.win{animation:pq2805cele .5s ease;}
        .pq2805 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2805shake .35s ease;}
        .pq2805 .pq-ex{min-width:150px;min-height:70px;border-radius:12px;background:#f2f8f2;border:2px solid #cfe3d0;display:flex;align-items:center;justify-content:center;gap:5px;padding:6px 8px;}
        .pq2805 .pq-oper{display:flex;flex-direction:column;align-items:center;gap:3px;}
        .pq2805 .pq-nv{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:40px;}
        .pq2805 .pq-nv-c{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:56px;}
        .pq2805 .pq-nv-a{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:56px;}
        .pq2805 .pq-dig{font-size:19px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;line-height:1;}
        .pq2805 .pq-op{font-size:19px;font-weight:900;color:#1a7f43;align-self:center;margin:0 2px;}
        .pq2805 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq2805 .pq-slot{width:46px;height:46px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2805breath 2.4s ease-in-out infinite;}
        .pq2805 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2805 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2805 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2805 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2805 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2805 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2805 .pq-sgs{display:flex;align-content:center;flex-basis:100%;gap:6px;margin-left:4px;justify-content:center;flex-wrap:wrap;}
        .pq2805 .pq-sg{min-width:44px;height:40px;padding:0 6px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2805 .pq-sg:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2805 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2805 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2805 .pq-sg:disabled{cursor:default;}
        .pq2805 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2805in .22s ease both;}
        .pq2805 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2805 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2805sun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pq2805cloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pq2805sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2805drop{0%{opacity:0;transform:translateY(-30px) scale(.6);}55%{opacity:1;transform:translateY(6px) scale(1.04);}75%{transform:translateY(-3px);}100%{transform:translateY(0) scale(1);}}
        @keyframes pq2805bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2805breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pq2805tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2805pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2805ans{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2805cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2805shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2805in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 206 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '16px', top: '18px' }} /><i style={{ left: '38px', top: '11px' }} /><i style={{ left: '28px', top: '31px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '14px', top: '13px' }} /><i style={{ left: '36px', top: '24px' }} /><i style={{ left: '24px', top: '34px' }} /></span><span className="pq-trunk" /></div>
          <span className="pq-ground" />
          <div className="pq-board">{t.title}</div>

          {/* 4 dekor-olma — mount'da birin-ketin tushadi, keyin bob; g'alabada 1..4 nishoncha */}
          {APPLES.map((p, i) => (
            <span key={i} className="pq-apw" style={{ left: p.x, top: p.y, '--hd': `${i * 0.2}s` }}>
              <span className={'pq-boba' + (ok ? ' win' : '')} style={{ '--fd': `-${i * 0.7}s` }}>
                <Apple w={34} />
                {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
              </span>
            </span>
          ))}

          {ok && (
            <>
              <span className="pq-basketw"><Basket w={54} /></span>
              <span className="pq-wstar" style={{ left: '34%', top: '58px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '62%', top: '72px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '120px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const [a, op, b] = r.expr.split(' ');
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-ex">
                  <Operand n={+a} />
                  <b className="pq-op">{op}</b>
                  <Operand n={+b} />
                </div>
                <span className="pq-eq">=</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
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
