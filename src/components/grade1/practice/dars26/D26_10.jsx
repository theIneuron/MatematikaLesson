// Dars26 · Amaliyot 10 — «Razryad bo'yicha birlashtiring» combine BILIM TEKSHIRUVI «Olma bog'i» · 🔴 · tag: combine_place
// 2 bosqich (trenajyor emas — bilim tekshiruvi): (1) bola [Birlashtiring] tugmasini bosadi → RAZRYAD
// BO'YICHA birlashadi: savatlar bir joyga (3+2 savat), yakka olmalar bir joyga (4+5 olma) oqib keladi;
// (2) birlashish tugagach ikkala guruh YOPQICH bilan berkitiladi (sanab bo'lmaydi), sanoq-nishonlar
// ko'rsatilmaydi va 4 sonli variant chiqadi — bola 34 + 25 ni XAYOLAN hisoblab tanlaydi.
// To'g'ri → yopqichlar ochiladi, «5» va «9» sanash-nishonlari pop bilan tasdiqlaydi, bayram-animatsiya;
// noto'g'ri → hint, qulf YO'Q, qayta urinish. MODEL: o'nlikni o'nlikka, birlikni birlikka (o'tishsiz).
// Sonlar sbornikdan: 34 + 25 = 59. Distraktorlar: 14 (M1 barcha raqamlar: 3+4+2+5), 50 (M2 faqat
// o'nliklar), 58 (near-miss). VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida (picked === 59).
// studentAnswer = { picked }. onReady faqat birlashtirilib variant tanlanganda.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A_TENS = 3, A_UNITS = 4;      // 34 = 3 savat + 4 olma
const B_TENS = 2, B_UNITS = 5;      // 25 = 2 savat + 5 olma
const M_TENS = A_TENS + B_TENS;     // birlashgach 5 savat (o'nliklar)
const M_UNITS = A_UNITS + B_UNITS;  // birlashgach 9 olma (birliklar)
const ADD_A = 34, ADD_B = 25, TARGET = 59;
const OPTIONS = [59, 14, 50, 58]; // 4 variant: to'g'ri + M1 + M2 + near-miss
const DATA = { a: ADD_A, b: ADD_B, target: TARGET, options: OPTIONS, answer: TARGET, ptype: 'NEW', level: '🔴', tag: 'combine_place' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Birlashtirish", title: "Razryad bo'yicha qo'shing",
    setup: "Bog'da ikki to'plam olma bor: 34 va 25.",
    ask: "Birlashtiring. Jami nechta olma bo'ladi?",
    correct: "Barakalla! O'nliklar: 3 + 2 = 5, birliklar: 4 + 5 = 9. 34 + 25 = 59!",
    hint: "Xayolan hisoblang: o'nlikka o'nlik (3+2), birlikka birlik (4+5).",
    btnMerge: "Birlashtiring",
    first: "Avval savatlarni birlashtiring.",
    covered: "Guruhlar berkitildi. Jami nechta? Xayolan hisoblab tanlang.",
    tens: "o'nlik", units: "birlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Объединение", title: "Сложи по разрядам",
    setup: "В саду две группы яблок: 34 и 25.",
    ask: "Объедини. Сколько яблок будет всего?",
    correct: "Молодец! Десятки: 3 + 2 = 5, единицы: 4 + 5 = 9. 34 + 25 = 59!",
    hint: "Посчитай в уме: десятки к десяткам (3+2), единицы к единицам (4+5).",
    btnMerge: "Объединить",
    first: "Сначала объедини корзины.",
    covered: "Группы накрыты. Сколько всего? Посчитай в уме и выбери.",
    tens: "десятков", units: "единиц",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// SAVAT KANONI (bitta o'nlik = 10 olma bir birlikka bog'langan) — Dars21 dan uzviy. To'qilgan savat,
// ustidan olmalar mo'ralaydi, oldida yashil "10" nishoni. Bola savatdagi olmalarni QAYTA sanamaydi —
// savat bitta BUTUN o'nlik. Bog' modeli sifatida ko'rsatiladi (bosilmaydi — javob tugmalarda).
const Crate = ({ w = 38 }) => {
  const uid = 'pq2610c' + (__gid++);
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

// YAKKA OLMA (bitta birlik) — Dars21 kanonidan: yumaloq tana (2-ton radial), bandak, barg, oq blik.
const Apple = ({ w = 24 }) => {
  const id = 'pq2610a' + (__gid++);
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

const A_C = Array.from({ length: A_TENS });
const A_A = Array.from({ length: A_UNITS });
const B_C = Array.from({ length: B_TENS });
const B_A = Array.from({ length: B_UNITS });
const MC = Array.from({ length: M_TENS });
const MA = Array.from({ length: M_UNITS });

export default function D26_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [combined, setCombined] = useState(false);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda birlashish animatsiyasi qayta ijro etilmaydi — statik yakuniy holat.
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
  const idle = !combined && !still; // birlashtirilmagan dekor savatlar/olmalar yengil tebranadi (bosiladigan nishon EMAS)

  const combine = () => { if (lock || combined) return; setCombined(true); setFeedback(null); };
  const flowDelay = (i) => still ? 0 : i * 0.16;      // savat/olmalar ketma-ket oqib keladi
  const pillDelay = (n) => still ? 0 : 0.2 + n * 0.28; // razryad-sanoq nishonchalari

  return (
    <div className="pq pq2610">
      <style>{`
        .pq2610{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2610 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2610 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2610 .pq-setup{color:#5c6672;font-weight:700;font-variant-numeric:tabular-nums;}
        .pq2610 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2610 .pq-scene{position:relative;width:388px;max-width:100%;height:236px;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6f5 0%,#d7f0dd 56%,#bfe0a4 100%);border:2px solid #b7d8bd;overflow:hidden;}
        .pq2610 .pq-sun{position:absolute;right:18px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2610sun 3.6s ease-in-out infinite;}
        .pq2610 .pq-leaf{position:absolute;z-index:1;color:#5fb15a;opacity:.8;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(60,120,50,.3));animation:pq2610sway 4.4s ease-in-out infinite;}
        .pq2610 .pq-leaf.l2{animation-delay:-2.1s;color:#7bc06f;}
        .pq2610 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 16px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2610 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(#8fcf6e,#68ad4c);border-top:3px solid #4f9138;z-index:1;pointer-events:none;}
        .pq2610 .pq-ground::after{content:'';position:absolute;left:0;right:0;top:6px;height:3px;background:repeating-linear-gradient(90deg,#5aa03d 0 10px,transparent 10px 22px);opacity:.6;}

        .pq2610 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:28px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:3;}
        /* har son bloki: o'nlik savatlar (tepada) + yakka olmalar (pastda) + qiymat pili */
        .pq2610 .pq-num{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2610 .pq-crates{display:flex;justify-content:center;gap:3px;}
        .pq2610 .pq-apples{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:110px;}
        .pq2610 .pq-obj{position:relative;line-height:0;}
        .pq2610 .pq-obj.idle{animation:pq2610bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2610 .pq-pill{padding:1px 12px;border-radius:999px;background:#fff;border:2px solid #b6dcb6;color:#3f8a41;font-weight:900;font-size:14px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.12);}
        .pq2610 .pq-plus{font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;align-self:center;}

        /* birlashgan holat: razryad bo'yicha ikki ustun — o'nliklar birga, birliklar birga */
        .pq2610 .pq-merged{display:flex;align-items:center;justify-content:center;gap:10px;animation:pq2610in .3s ease both;}
        .pq2610 .pq-place{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px 8px 5px;border-radius:14px;background:rgba(255,255,255,.42);border:2px dashed #7cb27f;}
        .pq2610 .pq-place .lab{font-size:11px;font-weight:800;letter-spacing:.02em;color:#2c6633;text-transform:uppercase;}
        .pq2610 .pq-mobj{line-height:0;animation:pq2610flow .4s ease both;animation-delay:var(--en,0s);}
        /* YOPQICH: birlashgan guruhni berkitadigan yog'och qopqoq — bola savat/olmalarni sanay olmaydi */
        .pq2610 .pq-wrap{position:relative;}
        .pq2610 .pq-shade{position:absolute;inset:-5px;z-index:6;border-radius:11px;background:repeating-linear-gradient(90deg,#d19b5c 0 22px,#c48d4c 22px 24px);border:2px solid #93602c;box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 3px 7px rgba(60,40,15,.28);display:flex;align-items:center;justify-content:center;animation:pq2610lid .4s ease both;animation-delay:var(--sd,0s);}
        .pq2610 .pq-shade b{font-size:26px;font-weight:900;color:#fff4e0;text-shadow:0 2px 2px rgba(90,55,15,.5);}
        .pq2610 .pq-shade.stillLid{animation:none;}
        /* razryad-sanoq nishonchasi (nechta o'nlik / nechta birlik) — bezak, bosilmaydi */
        .pq2610 .pq-cnt{min-width:24px;height:22px;padding:0 6px;border-radius:999px;background:#1a7f43;color:#fff;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.22);font-variant-numeric:tabular-nums;pointer-events:none;animation:pq2610pop .32s both;animation-delay:var(--cd,0s);}
        .pq2610 .pq-cnt.u{background:#c9822f;}

        .pq2610 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2610tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2610 .pq-spark.s2{animation-delay:-.6s;} .pq2610 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2610 .pq-tools{display:flex;justify-content:center;margin-top:16px;}
        .pq2610 .pq-merge{display:inline-flex;align-items:center;gap:9px;padding:12px 22px;border-radius:16px;border:2.5px solid #4c9d55;background:linear-gradient(#eafaea,#d6f2d9);color:#2c6633;font-size:17px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #7bb87f;transition:.12s;}
        .pq2610 .pq-merge:hover:not(:disabled){filter:brightness(1.03);transform:translateY(-1px);}
        .pq2610 .pq-merge:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #7bb87f;}
        .pq2610 .pq-merge:disabled{background:#eceae6;border-color:#c9c6c0;color:#9a968f;box-shadow:0 3px 0 #c9c6c0;cursor:default;}
        .pq2610 .pq-merge .ic{width:44px;height:26px;flex:0 0 auto;}

        .pq2610 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2610in .3s ease both;}
        .pq2610 .pq-eq b{min-width:40px;height:38px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef7ee;border:2px solid #b6dcb6;color:#3f8a41;font-variant-numeric:tabular-nums;}
        .pq2610 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2610 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2610 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2610in .3s .1s both;}

        .pq2610 .pq-first{text-align:center;margin-top:14px;font-size:13px;font-weight:800;color:#8a7a5a;}
        .pq2610 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:16px;}
        .pq2610 .pq-opt{min-width:72px;height:72px;padding:0 8px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2610 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2610 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2610 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2610 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2610cele .5s ease;}
        .pq2610 .pq-opt:disabled{cursor:default;opacity:.55;}
        .pq2610 .pq-opt.sel:disabled,.pq2610 .pq-opt.right:disabled{opacity:1;}
        .pq2610 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2610in .22s ease both;}
        .pq2610 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2610 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2610bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2610sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2610sway{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}
        @keyframes pq2610flow{from{opacity:0;transform:translateY(6px) scale(.82);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2610lid{from{opacity:0;transform:translateY(-14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq2610pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2610tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2610cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2610in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-leaf" style={{ left: '16px', top: '30px' }}>❧</span>
        <span className="pq-leaf l2" style={{ right: '18px', bottom: '40px' }}>❧</span>
        <div className="pq-board">{t.title}</div>

        <div className="pq-arena">
          {!combined ? (<>
            {/* 34 = 3 savat (o'nlik) + 4 olma (birlik) */}
            <div className="pq-num">
              <div className="pq-crates">
                {A_C.map((_, i) => (
                  <span key={'ac' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.1}s` }}><Crate w={36} /></span>
                ))}
              </div>
              <div className="pq-apples">
                {A_A.map((_, i) => (
                  <span key={'aa' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(A_TENS + i) * 0.1}s` }}><Apple w={22} /></span>
                ))}
              </div>
              <span className="pq-pill">{ADD_A}</span>
            </div>

            {/* Razryad bo'yicha QO'SHAMIZ (ayirish EMAS) */}
            <span className="pq-plus">{'+'}</span>

            {/* 25 = 2 savat (o'nlik) + 5 olma (birlik) */}
            <div className="pq-num">
              <div className="pq-crates">
                {B_C.map((_, i) => (
                  <span key={'bc' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${i * 0.1}s` }}><Crate w={36} /></span>
                ))}
              </div>
              <div className="pq-apples">
                {B_A.map((_, i) => (
                  <span key={'ba' + i} className={'pq-obj' + (idle ? ' idle' : '')} style={{ '--bd': `${(B_TENS + i) * 0.1}s` }}><Apple w={22} /></span>
                ))}
              </div>
              <span className="pq-pill">{ADD_B}</span>
            </div>
          </>) : (
            /* Birlashgan: o'nliklar bir ustunda (3+2 = 5 savat), birliklar boshqa ustunda (4+5 = 9 olma).
               BILIM TEKSHIRUVI: birlashish tugagach guruhlar YOPQICH bilan berkitiladi, sanoq-nishonlar
               («5», «9») va yig'indi (59) FAQAT to'g'ri javobda ochiladi. */
            <div className="pq-merged">
              <div className="pq-place">
                <span className="lab">{t.tens}</span>
                <div className="pq-wrap">
                  <div className="pq-crates">
                    {MC.map((_, i) => (
                      <span key={'mc' + i} className="pq-mobj" style={{ '--en': `${flowDelay(i)}s` }}><Crate w={34} /></span>
                    ))}
                  </div>
                  {!ok && <span className={'pq-shade' + (still ? ' stillLid' : '')} style={{ '--sd': still ? '0s' : '2.4s' }}><b>?</b></span>}
                </div>
                {ok && <span className="pq-cnt" style={{ '--cd': `${pillDelay(1)}s` }}>{M_TENS}</span>}
              </div>

              <span className="pq-plus">{'+'}</span>

              <div className="pq-place">
                <span className="lab">{t.units}</span>
                <div className="pq-wrap">
                  <div className="pq-apples">
                    {MA.map((_, i) => (
                      <span key={'ma' + i} className="pq-mobj" style={{ '--en': `${flowDelay(M_TENS + i)}s` }}><Apple w={22} /></span>
                    ))}
                  </div>
                  {!ok && <span className={'pq-shade' + (still ? ' stillLid' : '')} style={{ '--sd': still ? '0s' : '2.4s' }}><b>?</b></span>}
                </div>
                {ok && <span className="pq-cnt u" style={{ '--cd': `${pillDelay(2)}s` }}>{M_UNITS}</span>}
              </div>
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

      {/* Birlashtirish tugmasi — birlashguncha ko'rinadi */}
      {!combined && (
        <div className="pq-tools">
          <button type="button" className="pq-merge" disabled={lock} onClick={combine}>
            <MergeIcon />
            <span>{t.btnMerge}</span>
          </button>
        </div>
      )}

      {/* G'alaba: razryadlar qo'shilib 59 beradi (yig'indi faqat shu yerda ochiladi) */}
      {ok && (<>
        <div className="pq-eq"><b>{ADD_A}</b><i>{'+'}</i><b>{ADD_B}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{M_TENS} {t.tens} {'+'} {M_UNITS} {t.units} = {TARGET}</div>
      </>)}

      {/* Birlashgach javob tugmalari faollashadi. Birlashmaguncha o'chirilgan — yig'indi ko'rsatilmaydi. */}
      {combined
        ? (
          <div className="pq-opts">
            {DATA.options.map((n) => {
              const sel = picked === n; const right = ok && n === TARGET;
              return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
            })}
          </div>
        )
        : <div className="pq-first">{t.first}</div>}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
