// Dars30 · Amaliyot 04 — Tarkibli masala: jadval bilan · 🟡 · tag: choose_op
// Jadval markazda (P24): «Bor edi» 7 · «Keldi» [?] 3 · «Jami» [?]. Bola OPERATOR katakni tanlaydi.
// Sonlar: 7 + 3 = 10 (keldi = qo'shildi -> «+»). Chalg'ituvchi «−» (kamaytirish — M1 qalqoni).
// Barcha buyum — OLMA; Jami 10 = bitta savat (o'nlik). options=[«−»,«+»], javob «+» (chapda EMAS).
// Answer-leak yo'q: g'alabagacha «+» ko'rsatilmaydi, Jami katak «?» (nafas oladi); olmalar sanalmaydi.
// G'alabada: Keldi «+ 3», Jami 10 yashil + olma pop, tenglama 7 + 3 = 10 ochiladi. VEDI-DO-VERNOGO.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 7, B = 3, SUM = 10;                 // 7 + 3 = 10
const PLUS = "+", MINUS = "−";                 // U+2212, ASCII defis EMAS
const TARGET = PLUS;                           // keldi -> qo'shiladi
const DATA = { a: A, b: B, sum: SUM, options: [MINUS, PLUS], answer: TARGET, level: "🟡", tag: "choose_op" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala jadvali",
    title: "Qaysi amal?",
    setup: "Savatda 7 olma bor edi, 3 ta keldi.",
    ask: "Jadvalda qaysi amal?",
    rBor: "Bor edi", rKel: "Keldi", rJam: "Jami",
    correct: "Barakalla! Keldi — qo'shamiz. Amal: +.",
    hint: "Keldi — ko'paydi, demak qo'shish. Olib ketish — ayirish.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Таблица задачи",
    title: "Какое действие?",
    setup: "В корзине было 7 яблок, пришло 3.",
    ask: "Какое действие в таблице?",
    rBor: "Было", rKel: "Пришло", rJam: "Всего",
    correct: "Молодец! Пришло — прибавляем. Действие: +.",
    hint: "Пришло — стало больше, значит сложение. Забрали — вычитание.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 24 }) => {
  const id = "pq3004a" + (__gid++);
  const h = w * 26 / 24;
  return (
    <svg viewBox="0 0 24 26" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat, ustidan olmalar mo'ralaydi, oldida yashil «10»
// nishoni. Bola savatdagi olmalarni QAYTA sanamaydi — savat = bitta razryad birligi. (Dars 21 kanoni)
const Basket = ({ w = 38 }) => {
  const id = "pq3004b" + (__gid++);
  const ap = id + "ap";
  const h = w * 54 / 56;
  return (
    <svg viewBox="0 0 56 54" width={w} height={h} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
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

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (D15 etalon kanoni)
const Bird = ({ cls }) => (
  <svg className={"pq-bird " + cls} viewBox="0 0 22 9" width="20" height="8" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// OLMA DARAXTI (haqiqiy): po'stloq gradientli tana, uch pog'onali barg toji (radial soya, yorug' blik),
// shoxlarda bandi bilan osilgan olmalar sekin tebranadi; ostida yumshoq soya. (D15 etalon darajasi)
const AppleTree = ({ w = 58 }) => {
  const id = "pq3004t" + (__gid++);
  return (
    <svg viewBox="0 0 92 102" width={w} height={w * 102 / 92} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id + "k"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7d4f24" /><stop offset="45%" stopColor="#a9743e" /><stop offset="100%" stopColor="#6d4526" />
        </linearGradient>
        <radialGradient id={id + "f"} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#a3dc7e" /><stop offset="55%" stopColor="#6cb84f" /><stop offset="100%" stopColor="#4a8f3d" />
        </radialGradient>
        <radialGradient id={id + "a"} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f2a49c" /><stop offset="55%" stopColor="#df5b52" /><stop offset="100%" stopColor="#b83b33" />
        </radialGradient>
      </defs>
      <ellipse cx="46" cy="98" rx="27" ry="4" fill="rgba(50,80,35,.18)" />
      <path d="M42 98 C44 80 43 68 40 54 L52 54 C49 70 49 82 50 98 Z" fill={`url(#${id}k)`} stroke="#5f3c1e" strokeWidth="1.1" />
      <path d="M43 68 Q33 60 29 52 M49 66 Q58 58 62 51" fill="none" stroke="#7d4f24" strokeWidth="3.2" strokeLinecap="round" />
      <g className="pq-crown">
        <circle cx="24" cy="44" r="18" fill={`url(#${id}f)`} stroke="#3f7c33" strokeWidth="1.1" />
        <circle cx="68" cy="43" r="17" fill={`url(#${id}f)`} stroke="#3f7c33" strokeWidth="1.1" />
        <circle cx="46" cy="27" r="21" fill={`url(#${id}f)`} stroke="#3f7c33" strokeWidth="1.1" />
        <ellipse cx="38" cy="19" rx="9" ry="5.5" fill="#cdeeaa" opacity=".5" />
        <g className="pq-tapple" style={{ "--sd": "0s" }}>
          <path d="M30 33 l0 4" stroke="#6d4526" strokeWidth="1.1" />
          <circle cx="30" cy="41" r="4.6" fill={`url(#${id}a)`} stroke="#a5342c" strokeWidth=".7" />
          <circle cx="28.6" cy="39.4" r="1.3" fill="#fff" opacity=".6" />
        </g>
        <g className="pq-tapple" style={{ "--sd": "-1.2s" }}>
          <path d="M54 24 l0 4" stroke="#6d4526" strokeWidth="1.1" />
          <circle cx="54" cy="32" r="4.2" fill={`url(#${id}a)`} stroke="#a5342c" strokeWidth=".7" />
          <circle cx="52.8" cy="30.6" r="1.2" fill="#fff" opacity=".6" />
        </g>
        <g className="pq-tapple" style={{ "--sd": "-2.1s" }}>
          <path d="M67 37 l0 4" stroke="#6d4526" strokeWidth="1.1" />
          <circle cx="67" cy="45" r="4.4" fill={`url(#${id}a)`} stroke="#a5342c" strokeWidth=".7" />
          <circle cx="65.7" cy="43.5" r="1.2" fill="#fff" opacity=".6" />
        </g>
      </g>
    </svg>
  );
};

export default function D30_04(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
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

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const opShown = ok ? PLUS : (picked !== null ? picked : null); // g'alabagacha faqat tanlangan belgi

  return (
    <div className={"pq pq3004" + (still ? " still" : "")}>
      <style>{`
        .pq3004.still *{animation:none !important;}
        .pq3004{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3004 *{box-sizing:border-box;}
        .pq3004 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3004 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3004 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3004 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3004 .pq-scene{position:relative;width:360px;max-width:100%;margin:0 auto;padding:40px 14px 66px;border-radius:20px;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#e4f4d9 70%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-sizing:border-box;}
        .pq3004 .pq-sun{position:absolute;right:16px;top:11px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 20px 6px rgba(255,214,74,.55);z-index:1;pointer-events:none;animation:pq3004sun 3.6s ease-in-out infinite;}
        .pq3004 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#d19b5c,#b67c3f);border:2.5px solid #93602c;color:#fdf3e3;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 0 #8a5926,0 5px 8px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);text-shadow:0 1px 1px rgba(0,0,0,.22);pointer-events:none;}
        /* ===== BOG' SAHNASI (D15 etalon darajasi): bulut, qush, maysa, daraxt, gul, kapalak ===== */
        .pq3004 .pq-cloud{position:absolute;height:14px;background:#fff;border-radius:20px;box-shadow:0 5px 0 -2px #fff;opacity:.95;z-index:1;pointer-events:none;}
        .pq3004 .pq-cloud::before,.pq3004 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3004 .pq-cloud::before{width:20px;height:20px;top:-8px;left:7px;}.pq3004 .pq-cloud::after{width:14px;height:14px;top:-5px;left:22px;}
        .pq3004 .pq-cloud.c1{top:10px;left:12%;width:42px;animation:pq3004drift 15s ease-in-out infinite;}
        .pq3004 .pq-cloud.c2{top:24px;left:52%;width:32px;transform:scale(.78);animation:pq3004drift 19s ease-in-out infinite reverse;}
        .pq3004 .pq-bird{position:absolute;z-index:1;opacity:.7;pointer-events:none;}
        .pq3004 .pq-bird.b1{top:15px;left:36%;animation:pq3004bird 8s ease-in-out infinite;}
        .pq3004 .pq-bird.b2{top:27px;left:8%;transform:scale(.75);animation:pq3004bird 10s ease-in-out infinite;}
        .pq3004 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:1;pointer-events:none;}
        .pq3004 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:9px;background:radial-gradient(circle at 5px 9px,#84c95f 5px,transparent 6px) repeat-x;background-size:14px 9px;}
        .pq3004 .pq-tree{position:absolute;left:6px;bottom:2px;z-index:2;line-height:0;pointer-events:none;}
        .pq3004 .pq-crown{transform-box:fill-box;transform-origin:50% 85%;animation:pq3004sway 5.6s ease-in-out infinite;}
        .pq3004 .pq-tapple{transform-box:fill-box;transform-origin:50% 0;animation:pq3004swing 3.6s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq3004 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:2;pointer-events:none;}
        .pq3004 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3004 .pq-flower.f1{left:26%;bottom:16px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3004 .pq-flower.f2{left:50%;bottom:8px;background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3004 .pq-flower.f3{right:9%;bottom:18px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3004 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;pointer-events:none;}
        .pq3004 .pq-bfly::before,.pq3004 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq3004 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3004wing .26s ease-in-out infinite alternate;}
        .pq3004 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3004wing .26s ease-in-out infinite alternate;}
        .pq3004 .pq-bfly.bf2::before,.pq3004 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3004 .pq-bfly.bf1{bottom:44px;left:14%;animation:pq3004flit 9s ease-in-out infinite;}
        .pq3004 .pq-bfly.bf2{bottom:60px;right:10%;animation:pq3004flit 11s ease-in-out infinite reverse;}
        /* g'alaba: daraxtdan olma yog'adi */
        .pq3004 .pq-drop{position:absolute;top:28px;z-index:6;line-height:0;pointer-events:none;animation:pq3004fall 1.6s ease-in both;animation-delay:var(--dd,0s);}

        .pq3004 .pq-tbl{position:relative;z-index:3;width:300px;max-width:100%;margin:0 auto;background:#fff;border:2px solid #c7d8ea;border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(40,60,90,.1);box-sizing:border-box;}
        .pq3004 .pq-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px;border-bottom:1px solid #e6ecf3;}
        .pq3004 .pq-row:last-child{border-bottom:none;}
        .pq3004 .pq-row.jami{background:#f4f8fc;}
        .pq3004 .pq-lbl{font-size:15px;font-weight:600;color:#6a7482;}
        .pq3004 .pq-row.jami .pq-lbl{color:#2f4257;font-weight:800;}
        .pq3004 .pq-cell{display:flex;align-items:center;gap:7px;font-size:22px;font-weight:800;color:#2f4257;font-variant-numeric:tabular-nums;}
        .pq3004 .pq-op{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;font-size:20px;font-weight:900;font-variant-numeric:tabular-nums;}
        .pq3004 .pq-op.empty{background:#eef4fb;border:2px dashed #b8cbe0;color:#9aa9bb;animation:pq3004breathe 2.2s ease-in-out infinite;}
        .pq3004 .pq-op.picked{background:#e8eefc;border:2px solid #2563eb;color:#2563eb;}
        .pq3004 .pq-op.win{background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;}
        .pq3004 .pq-res{display:inline-flex;align-items:center;justify-content:center;min-width:42px;height:34px;padding:0 8px;border-radius:9px;font-size:22px;font-weight:900;font-variant-numeric:tabular-nums;}
        .pq3004 .pq-res.q{background:#eef4fb;border:2px dashed #b8cbe0;color:#9aa9bb;animation:pq3004breathe 2.2s ease-in-out infinite;}
        .pq3004 .pq-res.win{background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;animation:pq3004pop .4s ease both;}
        .pq3004 .pq-pop{margin-left:8px;line-height:0;animation:pq3004pop .5s ease both;}

        .pq3004 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3004tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3004 .pq-spark.s2{animation-delay:-.6s;} .pq3004 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3004 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq3004in .3s ease both;}
        .pq3004 .pq-eq b{min-width:42px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3004 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3004 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}

        .pq3004 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:18px;}
        .pq3004 .pq-opt{min-width:84px;height:74px;padding:0 12px;font-size:38px;font-weight:800;line-height:1;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3004 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq3004 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq3004 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq3004 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3004cele .5s ease;}
        .pq3004 .pq-opt:disabled{cursor:default;}
        .pq3004 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3004in .22s ease both;}
        .pq3004 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3004 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3004sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3004breathe{0%,100%{opacity:.65;transform:scale(1);}50%{opacity:1;transform:scale(1.08);}}
        @keyframes pq3004pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3004tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3004cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3004in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq3004drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3004bird{0%,100%{transform:translate(0,0);}50%{transform:translate(26px,-5px);}}
        @keyframes pq3004sway{0%,100%{transform:rotate(-1.2deg);}50%{transform:rotate(1.2deg);}}
        @keyframes pq3004swing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq3004wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3004flit{0%,100%{transform:translate(0,0);}25%{transform:translate(22px,-10px);}50%{transform:translate(40px,5px);}75%{transform:translate(16px,-5px);}}
        @keyframes pq3004fall{0%{opacity:0;transform:translateY(-14px) rotate(0);}12%{opacity:1;}100%{opacity:0;transform:translateY(150px) rotate(120deg);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <Bird cls="b1" /><Bird cls="b2" />
        <div className="pq-grass" />
        <span className="pq-tree"><AppleTree /></span>
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-title">{t.title}</div>

        {/* P24 masala jadvali — markaziy karta. Operator katak g'alabagacha «?» (yoki tanlangan belgi). */}
        <div className="pq-tbl">
          <div className="pq-row">
            <span className="pq-lbl">{t.rBor}</span>
            <span className="pq-cell">{A}</span>
          </div>
          <div className="pq-row">
            <span className="pq-lbl">{t.rKel}</span>
            <span className="pq-cell">
              {opShown === null
                ? <span className="pq-op empty">{"?"}</span>
                : <span className={"pq-op " + (ok ? "win" : "picked")}>{opShown}</span>}
              {B}
            </span>
          </div>
          <div className="pq-row jami">
            <span className="pq-lbl">{t.rJam}</span>
            <span className="pq-cell">
              {ok
                ? <><span className="pq-res win">{SUM}</span><span className="pq-pop"><Basket w={34} /></span></>
                : <span className="pq-res q">{"?"}</span>}
            </span>
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "12%", top: "50px" }}>{"✦"}</span>
          <span className="pq-spark s2" style={{ left: "86%", top: "70px" }}>{"✦"}</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "34px" }}>{"✦"}</span>
        </>)}
        {ok && !still && (<>
          <span className="pq-drop" style={{ left: "18%", "--dd": ".05s" }}><Apple w={16} /></span>
          <span className="pq-drop" style={{ left: "52%", "--dd": ".3s" }}><Apple w={14} /></span>
          <span className="pq-drop" style={{ left: "80%", "--dd": ".55s" }}><Apple w={16} /></span>
        </>)}
      </div>

      {/* G'alaba: keldi -> QO'SHAMIZ — tenglama 7 + 3 = 10 (natija faqat shu yerda ochiladi) */}
      {ok && (
        <div className="pq-eq"><b>{A}</b><i>{PLUS}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b></div>
      )}

      <div className="pq-opts">
        {DATA.options.map((op) => {
          const sel = picked === op; const right = ok && op === TARGET;
          return <button key={op} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => { setPicked(op); setFeedback(null); }}>{op}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
