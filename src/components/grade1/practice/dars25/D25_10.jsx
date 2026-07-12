// Dars25 · Amaliyot 10 — «Birlik qo'shing» add-units BILIM TEKSHIRUVI «Olma bog'i» · 🔴 · tag: add_units
// 2 bosqich (trenajyor emas — bilim tekshiruvi): (1) bola [+ Olma] bilan 5 yakka olmani BIRLIKLAR
// guruhiga qo'shadi (qiziqarli harakat, jonli yig'indi-hisoblagich YO'Q); (2) 5 ta qo'shilgach birliklar
// savati YOPQICH bilan berkitiladi (sanab bo'lmaydi) va 4 sonli variant chiqadi — bola 34 + 5 ni XAYOLAN
// hisoblab tanlaydi. To'g'ri → yopqich ochiladi, birliklar «9» nishoni bilan tasdiqlanadi, bayram;
// noto'g'ri → hint, qulf YO'Q, qayta urinish. O'nliklar (3 savat) FIKSIRLANGAN — hech qachon o'zgarmaydi.
// Chalg'ituvchilar: 84 (birlikni o'nlikka qo'shish), 35 (faqat +1), 38 (bittaga kam sanash).
// VEDI-DO-VERNOGO: setChecked FAQAT to'g'rida. studentAnswer = { added, picked }. onReady faqat variant tanlanganda.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const START = 34;        // boshlang'ich son
const TENS = 3;          // 3 o'nlik savat (fiksirlangan)
const BASE_UNITS = 4;    // 34 ning birliklari: 4 yakka olma
const ADD_TARGET = 5;    // qo'shilishi kerak: 5 ta olma
const ADD_CAP = ADD_TARGET; // 5 tadan keyin tugma ishlamaydi
const TARGET = START + ADD_TARGET; // 39
const OPTIONS = [39, 84, 35, 38];  // 4 variant: to'g'ri + M1 + M2 + near-miss
const DATA = { start: START, add: ADD_TARGET, target: TARGET, tens: TENS, options: OPTIONS, answer: TARGET, ptype: "NEW", level: "🔴", tag: "add_units" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Qo'shish", title: "Birlik qo'shing",
    setup: "Bog'da 34 olma bor: 3 savat va 4 dona.",
    ask: "Yana 5 olma qo'shing. Jami nechta bo'ladi?",
    correct: "Barakalla! Birliklar: 4 + 5 = 9, o'nlik o'zgarmaydi. 34 + 5 = 39!",
    hint: "Xayolan hisoblang: 4 birlik bor edi, 5 ta qo'shildi. O'nlik o'zgarmaydi.",
    btnAdd: "Olma",
    tensLbl: "O'nliklar", unitsLbl: "Birliklar",
    fixedLbl: "o'zgarmaydi",
    startHint: "Tugma bilan 5 ta olma qo'shing",
    addedLbl: "Qo'shildi",
    covered: "Olmalar berkitildi. Jami nechta? Xayolan hisoblab tanlang.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сложение", title: "Добавь единицы",
    setup: "В саду 34 яблока: 3 корзины и 4 штуки.",
    ask: "Добавь ещё 5 яблок. Сколько станет всего?",
    correct: "Молодец! Единицы: 4 + 5 = 9, десяток не меняется. 34 + 5 = 39!",
    hint: "Посчитай в уме: было 4 единицы, добавили 5. Десяток не меняется.",
    btnAdd: "Яблоко",
    tensLbl: "Десятки", unitsLbl: "Единицы",
    fixedLbl: "не меняется",
    startHint: "Добавь 5 яблок кнопкой",
    addedLbl: "Добавлено",
    covered: "Яблоки накрыты. Сколько всего? Посчитай в уме и выбери.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma tanasi (2-ton radial) + barg + band + oq blik.
// Bitta yakka olma = bitta birlik. (Dars 21 kanoni bilan bir xil.)
let __aid = 0;
const Apple = ({ w = 26 }) => {
  const id = "pq2510a" + (__aid++);
  const h = w * 34 / 30;
  return (
    <svg viewBox="0 0 30 34" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (o'nlik): to'qilgan savat + jiyakdan mo'ralab turgan olmalar. Savat = 10 olmani
// bog'lagan BITTA o'nlik (ichi qayta sanalmaydi). '10' nishoni markupda qo'shiladi.
let __bid = 0;
const Basket = ({ w = 48 }) => {
  const id = "pq2510b" + (__bid++);
  const h = w * 78 / 88;
  return (
    <svg viewBox="0 0 88 78" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0a45e" />
          <stop offset="100%" stopColor="#9c6329" />
        </linearGradient>
        <radialGradient id={id + "ap"} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      <g stroke="#a6291f" strokeWidth=".7">
        <circle cx="26" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="62" cy="30" r="10" fill={`url(#${id}ap)`} />
        <circle cx="44" cy="25" r="11.5" fill={`url(#${id}ap)`} />
      </g>
      <path d="M46,15 Q52,12 53.5,16.5 Q48.5,18.5 46,15 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".6" />
      <rect x="8" y="33" width="72" height="9" rx="4.5" fill="#c98a45" stroke="#7a4a20" strokeWidth="1.4" />
      <path d="M12,42 L76,42 L67,72 Q66,75 62,75 L26,75 Q22,75 21,72 Z" fill={`url(#${id})`} stroke="#7a4a20" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke="#7a4a20" strokeWidth="1.1" opacity=".55" fill="none">
        <path d="M24,42 L27,74" /><path d="M34,42 L35.6,74" /><path d="M44,42 L44,75" />
        <path d="M54,42 L52.4,74" /><path d="M64,42 L61,74" />
      </g>
      <g stroke="#5f3b18" strokeWidth="1.2" opacity=".5" fill="none">
        <path d="M14,52 Q44,58 74,52" /><path d="M17,62 Q44,68 71,62" />
      </g>
    </svg>
  );
};

export default function D25_10(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [addedIds, setAddedIds] = useState([]); // qo'shilgan yakka olmalar (barqaror id-lar)
  const [picked, setPicked] = useState(null);   // tanlangan variant (son)
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const seqRef = useRef(0);
  // Review yoki qayta ochilishda pop-animatsiya qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  const added = addedIds.length;
  const capped = added >= ADD_CAP; // 5 ta qo'shildi — endi variantlar bosqichi

  // RESTORE: studentAnswer = { added, picked } dan sahnani qayta tiklaydi (msg DOIM; setChecked faqat to'g'rida).
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      const aN = Math.max(0, Math.min(Number(sa.added) || 0, ADD_CAP));
      setAddedIds(Array.from({ length: aN }, (_, k) => k));
      seqRef.current = aN;
      if (sa.picked != null) setPicked(sa.picked);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  // onReady FAQAT variant tanlanganda (harakatning o'zi «javob» emas — bilim tekshiruvi).
  useEffect(() => { onReady?.(capped && picked !== null && !checked); }, [capped, picked, checked, onReady]);

  const lock = isReview || checked;
  const addOne = () => { if (lock || capped) return; setAddedIds((p) => [...p, seqRef.current++]); setFeedback(null); };

  const check = useCallback(() => {
    if (!capped || picked === null) return;
    const correct = picked === TARGET; // bola yig'indini XAYOLAN hisoblab tanladi
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String), studentAnswer: { added, picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [capped, picked, added, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const covered = capped && !ok; // YOPQICH: 5 ta qo'shilgach birliklar berkitiladi, to'g'ri javobgacha ochilmaydi
  const tensArr = Array.from({ length: TENS });
  const baseArr = Array.from({ length: BASE_UNITS });

  return (
    <div className="pq pq2510">
      <style>{`
        .pq2510{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2510 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2510 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2510 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2510 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq2510 .pq-scene{position:relative;width:440px;max-width:100%;min-height:214px;margin:0 auto;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 46%,#cdeeb6 72%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2510 .pq-sun{position:absolute;left:16px;top:12px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2510sun 3.6s ease-in-out infinite;}
        .pq2510 .pq-branch{position:absolute;z-index:1;pointer-events:none;transform-origin:top center;animation:pq2510sway 4.2s ease-in-out infinite;}
        .pq2510 .pq-branch.l{left:-6px;top:24px;} .pq2510 .pq-branch.r{right:-6px;top:18px;animation-delay:-1.6s;}
        .pq2510 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:38px;background:radial-gradient(120% 100% at 50% 100%,#a6d67c 0%,#8fca6b 60%,#7cbd5a 100%);z-index:1;pointer-events:none;}
        .pq2510 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2510 .pq-arena{position:relative;z-index:3;padding:40px 12px 14px;display:flex;flex-direction:column;align-items:center;gap:9px;}
        .pq2510 .pq-row{display:flex;align-items:stretch;justify-content:center;gap:8px;width:100%;}
        .pq2510 .pq-tray{position:relative;flex:1 1 0;min-width:0;min-height:76px;padding:20px 7px 8px;border-radius:14px;background:rgba(255,255,255,.34);border:2px solid rgba(120,150,120,.34);display:flex;flex-wrap:wrap;align-content:flex-end;align-items:flex-end;justify-content:center;gap:4px;overflow:hidden;}
        .pq2510 .pq-tray.tens{flex:0 0 46%;border-style:solid;background:rgba(255,255,255,.24);}
        .pq2510 .pq-cap{position:absolute;top:5px;left:9px;z-index:4;font-size:11px;font-weight:900;letter-spacing:.02em;color:#3c6b45;font-variant-numeric:tabular-nums;pointer-events:none;}
        .pq2510 .pq-cap b{color:#1a7f43;}
        .pq2510 .pq-cap .fx{color:#8a7a5a;font-weight:800;}
        .pq2510 .pq-plus{align-self:center;font-size:26px;font-weight:900;color:#5c6672;flex:0 0 auto;}
        /* o'nlik savat + '10' nishoni (fiksirlangan — bosilmaydi, bezakli tebranish YO'Q) */
        .pq2510 .pq-crate{position:relative;line-height:0;flex:0 0 auto;}
        .pq2510 .pq-badge{position:absolute;top:-5px;right:-3px;min-width:20px;height:18px;padding:0 4px;border-radius:999px;background:#1a7f43;color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:5;pointer-events:none;font-variant-numeric:tabular-nums;box-shadow:0 1px 3px rgba(0,0,0,.28);border:1.5px solid #fff;}
        /* yakka olma (birlik) — bosilmaydi, faqat qo'shilganda pop */
        .pq2510 .pq-unit{line-height:0;flex:0 0 auto;}
        .pq2510 .pq-unit .pop{display:block;animation:pq2510pop .34s cubic-bezier(.3,1.4,.5,1) both;}
        .pq2510 .pq-unit.fresh .pop{filter:drop-shadow(0 2px 3px rgba(26,127,67,.35));}
        /* YOPQICH: birliklar savatini berkitadigan yog'och qopqoq — bola olmalarni sanay olmaydi */
        .pq2510 .pq-lid{position:absolute;inset:0;z-index:6;border-radius:12px;background:repeating-linear-gradient(90deg,#d19b5c 0 26px,#c48d4c 26px 28px);border:2.5px solid #93602c;box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 3px 8px rgba(60,40,15,.28);display:flex;align-items:center;justify-content:center;animation:pq2510lid .4s ease both;}
        .pq2510 .pq-lid b{font-size:30px;font-weight:900;color:#fff4e0;text-shadow:0 2px 2px rgba(90,55,15,.5);}
        .pq2510 .pq-lid.stillLid{animation:none;}
        /* birliklar «9» tasdiq-nishoni — FAQAT g'alabada (sanash-badge) */
        .pq2510 .pq-usum{position:absolute;top:-2px;right:6px;z-index:7;min-width:24px;height:22px;padding:0 6px;border-radius:999px;background:#1a7f43;color:#fff;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.22);font-variant-numeric:tabular-nums;pointer-events:none;animation:pq2510pop .4s .25s ease both;}

        /* harakat jarayoni: nechta olma qo'shildi (yig'indi EMAS — javob sizib chiqmaydi) */
        .pq2510 .pq-progress{margin-top:1px;background:#fff;border:2px solid #cdb98a;color:#8a5a26;font-weight:900;font-size:14px;padding:2px 14px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(0,0,0,.12);}
        .pq2510 .pq-total{margin-top:1px;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:16px;padding:2px 16px;border-radius:999px;font-variant-numeric:tabular-nums;box-shadow:0 3px 7px rgba(0,0,0,.16);animation:pq2510pop .45s ease both;}
        .pq2510 .pq-taphint{font-size:12px;font-weight:800;color:#3c6b45;background:rgba(255,255,255,.7);padding:3px 12px;border-radius:999px;pointer-events:none;}
        .pq2510 .pq-covermsg{font-size:12.5px;font-weight:800;color:#8a5a26;background:rgba(255,248,235,.9);border:1.5px solid #d9b98a;padding:3px 12px;border-radius:999px;pointer-events:none;text-align:center;}

        .pq2510 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2510tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2510 .pq-spark.s2{animation-delay:-.6s;} .pq2510 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2510 .pq-tools{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:14px;}
        .pq2510 .pq-add{display:inline-flex;align-items:center;gap:7px;padding:11px 20px;border-radius:16px;border:2.5px solid #d98077;background:linear-gradient(#ffeeec,#ffd9d4);color:#a6291f;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #d98077;transition:.12s;}
        .pq2510 .pq-add:hover:not(:disabled){filter:brightness(1.04);transform:translateY(-1px);}
        .pq2510 .pq-add:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 #d98077;}
        .pq2510 .pq-add:disabled{background:#eceae6;border-color:#c9c6c0;color:#9a968f;box-shadow:0 3px 0 #c9c6c0;cursor:default;}
        .pq2510 .pq-add .ic{width:24px;height:24px;flex:0 0 auto;}
        .pq2510 .pq-add .pl{font-size:19px;font-weight:900;line-height:1;}

        /* 4 sonli variant — bola yig'indini xayolan hisoblab tanlaydi */
        .pq2510 .pq-opts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px;animation:pq2510in .3s ease both;}
        .pq2510 .pq-opt{min-width:72px;height:70px;padding:0 10px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2510 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq2510 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2510 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2510 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2510cele .5s ease;}
        .pq2510 .pq-opt:disabled{cursor:default;}

        .pq2510 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq2510in .3s ease both;}
        .pq2510 .pq-eq b{min-width:44px;height:40px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2510 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2510 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq2510 .pq-sub{text-align:center;margin-top:6px;font-size:14px;font-weight:800;color:#5a8a4f;font-variant-numeric:tabular-nums;animation:pq2510in .3s .1s both;}

        .pq2510 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2510in .22s ease both;}
        .pq2510 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2510 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2510sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2510sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2510pop{0%{opacity:0;transform:translateY(-10px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pq2510lid{0%{opacity:0;transform:translateY(-105%);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pq2510tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2510cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2510in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <svg className="pq-branch l" width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M0,6 Q26,2 40,14" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M20,4 Q26,0 27,5 Q22,7 20,4 Z" /><path d="M33,8 Q39,4 40,9 Q35,11 33,8 Z" /></g></svg>
        <svg className="pq-branch r" width="54" height="40" viewBox="0 0 54 40" aria-hidden="true"><path d="M54,6 Q28,2 14,14" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" /><g fill="#4fa845" stroke="#3c8536" strokeWidth=".6"><path d="M34,4 Q28,0 27,5 Q32,7 34,4 Z" /><path d="M21,8 Q15,4 14,9 Q19,11 21,8 Z" /></g></svg>
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          <div className="pq-row">
            {/* O'nliklar — 3 savat, FIKSIRLANGAN (o'zgarmaydi): birlik faqat birlikka qo'shiladi */}
            <div className="pq-tray tens">
              <span className="pq-cap">{t.tensLbl}: <b>{TENS}</b> <span className="fx">({t.fixedLbl})</span></span>
              {tensArr.map((_, i) => (
                <span key={i} className="pq-crate">
                  <Basket w={44} />
                  <b className="pq-badge">10</b>
                </span>
              ))}
            </div>

            {/* O'nlik-guruh va birlik-guruh QO'SHILADI (ayirish EMAS, minus EMAS) */}
            <span className="pq-plus">{'+'}</span>

            {/* Birliklar — 4 boshlang'ich + qo'shilgan yakka olmalar. Jonli son-hisoblagich YO'Q:
                yorliqda birliklar SONI ko'rsatilmaydi (javob sizib chiqmasin), «9» faqat g'alabada. */}
            <div className="pq-tray units">
              <span className="pq-cap">{t.unitsLbl}{ok ? <>: <b>{BASE_UNITS + ADD_TARGET}</b></> : null}</span>
              {ok && <span className="pq-usum">{BASE_UNITS + ADD_TARGET}</span>}
              {baseArr.map((_, i) => (
                <span key={"b" + i} className="pq-unit">
                  <span className={still ? undefined : "pop"}><Apple w={26} /></span>
                </span>
              ))}
              {addedIds.map((id) => (
                <span key={"a" + id} className="pq-unit fresh">
                  <span className={still ? undefined : "pop"}><Apple w={26} /></span>
                </span>
              ))}
              {/* YOPQICH: 5 ta qo'shilgach olmalar berkitiladi — to'g'ri javobgacha ochilmaydi */}
              {covered && <span className={"pq-lid" + (still ? " stillLid" : "")}><b>?</b></span>}
            </div>
          </div>

          {ok
            ? <span className="pq-total">{TARGET}</span>
            : covered
              ? <span className="pq-covermsg">{t.covered}</span>
              : added > 0
                ? <span className="pq-progress">{t.addedLbl}: {added} / {ADD_TARGET}</span>
                : <span className="pq-taphint">{t.startHint}</span>}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "16%", top: "54px" }}>✦</span>
          <span className="pq-spark s2" style={{ left: "82%", top: "66px" }}>✦</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "40px" }}>✦</span>
        </>)}
      </div>

      {/* G'alaba: birliklar birlikka qo'shiladi (4 + 5 = 9), o'nliklar o'zgarmaydi → 34 + 5 = 39 */}
      {ok && (<>
        <div className="pq-eq"><b>{START}</b><i>{'+'}</i><b>{ADD_TARGET}</b><i>=</i><b className="res">{TARGET}</b></div>
        <div className="pq-sub">{BASE_UNITS} + {ADD_TARGET} = {BASE_UNITS + ADD_TARGET}</div>
      </>)}

      {/* 1-bosqich: olma qo'shish tugmasi (5 tagacha) */}
      {!capped && (
        <div className="pq-tools">
          <button type="button" className="pq-add" disabled={lock || capped} onClick={addOne}>
            <span className="pl">{'+'}</span>
            <svg className="ic" viewBox="0 0 30 34" aria-hidden="true"><path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" /><path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" /><path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill="#e8443a" stroke="#a6291f" strokeWidth=".8" /></svg>
            <span>{t.btnAdd}</span>
          </button>
        </div>
      )}

      {/* 2-bosqich: 4 sonli variant — harakat tugagach chiqadi, bola xayolan hisoblab tanlaydi */}
      {capped && (
        <div className="pq-opts">
          {OPTIONS.map((n) => {
            const sel = picked === n; const right = ok && n === TARGET;
            return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
          })}
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
