// Dars30 · Amaliyot 09 — «Tarkibli masala: jadval bilan» · 🔴 · tag: table_sum
// Jadval-masala (razryad, o'tishsiz): Bor edi 34 / Keldi + 25 / Jami ?. MATH 34 + 25 = 59.
// Bor edi 34 va Keldi 25 razryad bilan: o'nlik = savat (yashil «10»), birlik = yakka olma.
// Variantlar [50, 59, 60]: 59 = to'g'ri (birinchi EMAS), 50 = faqat o'nlik (30+20), 60 = yaxlitlash.
// Answer-leak yo'q: Jami katagi g'alabagacha «?» (nafas); natija oldindan ajratilmaydi/bo'yalmaydi.
// G'alabada: Jami 59 yashil + savat pop, tenglama 34 + 25 = 59 va subline «3+2=5 o'nlik · 4+5=9 birlik».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 34, B = 25, SUM = 59;                 // 34 + 25 = 59 (o'tishsiz)
const TA = 3, UA = 4, TB = 2, UB = 5;           // razryad: 34 = 3 o'nlik 4 birlik · 25 = 2 o'nlik 5 birlik
const PLUS = "+";
const TARGET = SUM;
const DATA = { a: A, b: B, sum: SUM, op: PLUS, options: [50, SUM, 60], answer: SUM, level: "🔴", tag: "table_sum" };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Jadval",
    title: "Jami nechta?",
    setup: "Bog'da 34 olma bor edi, 25 ta keldi.",
    ask: "Jami nechta?",
    rBor: "Bor edi", rKel: "Keldi", rJam: "Jami",
    sub: "3+2=5 o'nlik · 4+5=9 birlik",
    correct: "Barakalla! O'nlik o'nlikka, birlik birlikka. 34 + 25 = 59.",
    hint: "Avval o'nliklarni qo'shing, keyin birliklarni. Faqat o'nlik — kam.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Таблица",
    title: "Сколько всего?",
    setup: "В саду было 34 яблока, пришло 25.",
    ask: "Сколько всего?",
    rBor: "Было", rKel: "Пришло", rJam: "Всего",
    sub: "3+2=5 дес. · 4+5=9 ед.",
    correct: "Молодец! Десятки к десяткам, единицы к единицам. 34 + 25 = 59.",
    hint: "Сначала сложи десятки, потом единицы. Только десятки — мало.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars 21 kanoni)
const Apple = ({ w = 24 }) => {
  const id = "pq3009a" + (__gid++);
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
const Basket = ({ w = 30 }) => {
  const id = "pq3009b" + (__gid++);
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

// RAZRYAD to'plami: o'nliklar (savat) + birliklar (yakka olma). Operand — natija EMAS (answer-leak yo'q).
// Bezak tebranish idle bilan (bosiladigan nishon EMAS — dekor).
const NumGroup = ({ tens, units, idle }) => (
  <span className="pq-ng">
    {Array.from({ length: tens }).map((_, i) => (
      <span key={"t" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.12}s` }}><Basket w={26} /></span>
    ))}
    {Array.from({ length: units }).map((_, i) => (
      <span key={"u" + i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(tens + i) * 0.12}s` }}><Apple w={15} /></span>
    ))}
  </span>
);

// Uzoqdagi qush (osmonda) — oddiy "m" shakli. (D15 etalon kanoni)
const Bird = ({ cls }) => (
  <svg className={"pq-bird " + cls} viewBox="0 0 22 9" width="20" height="8" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// OLMA DARAXTI (haqiqiy): po'stloq gradientli tana, uch pog'onali barg toji (radial soya, yorug' blik),
// shoxlarda bandi bilan osilgan olmalar sekin tebranadi; ostida yumshoq soya. (D15 etalon darajasi)
const AppleTree = ({ w = 58 }) => {
  const id = "pq3009t" + (__gid++);
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

export default function D30_09(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

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
  const idle = !ok && !still;

  return (
    <div className={"pq pq3009" + (still ? " still" : "")}>
      <style>{`
        .pq3009.still *{animation:none !important;}
        .pq3009{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3009 *{box-sizing:border-box;}
        .pq3009 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq3009 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3009 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq3009 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq3009 .pq-scene{position:relative;width:372px;max-width:100%;margin:0 auto;border-radius:20px;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#e4f4d9 70%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;box-sizing:border-box;padding:40px 12px 66px;}
        .pq3009 .pq-sun{position:absolute;right:16px;top:11px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 20px 6px rgba(255,214,74,.55);z-index:1;pointer-events:none;animation:pq3009sun 3.6s ease-in-out infinite;}
        .pq3009 .pq-title{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#d19b5c,#b67c3f);border:2.5px solid #93602c;color:#fdf3e3;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 0 #8a5926,0 5px 8px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.3);text-shadow:0 1px 1px rgba(0,0,0,.22);pointer-events:none;}
        /* ===== BOG' SAHNASI (D15 etalon darajasi): bulut, qush, maysa, daraxt, gul, kapalak ===== */
        .pq3009 .pq-cloud{position:absolute;height:14px;background:#fff;border-radius:20px;box-shadow:0 5px 0 -2px #fff;opacity:.95;z-index:1;pointer-events:none;}
        .pq3009 .pq-cloud::before,.pq3009 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3009 .pq-cloud::before{width:20px;height:20px;top:-8px;left:7px;}.pq3009 .pq-cloud::after{width:14px;height:14px;top:-5px;left:22px;}
        .pq3009 .pq-cloud.c1{top:10px;left:12%;width:42px;animation:pq3009drift 15s ease-in-out infinite;}
        .pq3009 .pq-cloud.c2{top:24px;left:52%;width:32px;transform:scale(.78);animation:pq3009drift 19s ease-in-out infinite reverse;}
        .pq3009 .pq-bird{position:absolute;z-index:1;opacity:.7;pointer-events:none;}
        .pq3009 .pq-bird.b1{top:15px;left:36%;animation:pq3009bird 8s ease-in-out infinite;}
        .pq3009 .pq-bird.b2{top:27px;left:8%;transform:scale(.75);animation:pq3009bird 10s ease-in-out infinite;}
        .pq3009 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:1;pointer-events:none;}
        .pq3009 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-5px;height:9px;background:radial-gradient(circle at 5px 9px,#84c95f 5px,transparent 6px) repeat-x;background-size:14px 9px;}
        .pq3009 .pq-tree{position:absolute;left:6px;bottom:2px;z-index:2;line-height:0;pointer-events:none;}
        .pq3009 .pq-crown{transform-box:fill-box;transform-origin:50% 85%;animation:pq3009sway 5.6s ease-in-out infinite;}
        .pq3009 .pq-tapple{transform-box:fill-box;transform-origin:50% 0;animation:pq3009swing 3.6s ease-in-out infinite;animation-delay:var(--sd,0s);}
        .pq3009 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:2;pointer-events:none;}
        .pq3009 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3009 .pq-flower.f1{left:26%;bottom:16px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3009 .pq-flower.f2{left:50%;bottom:8px;background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3009 .pq-flower.f3{right:9%;bottom:18px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3009 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;pointer-events:none;}
        .pq3009 .pq-bfly::before,.pq3009 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;background:#ff9ec4;}
        .pq3009 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3009wing .26s ease-in-out infinite alternate;}
        .pq3009 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3009wing .26s ease-in-out infinite alternate;}
        .pq3009 .pq-bfly.bf2::before,.pq3009 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq3009 .pq-bfly.bf1{bottom:44px;left:14%;animation:pq3009flit 9s ease-in-out infinite;}
        .pq3009 .pq-bfly.bf2{bottom:60px;right:10%;animation:pq3009flit 11s ease-in-out infinite reverse;}
        /* g'alaba: daraxtdan olma yog'adi */
        .pq3009 .pq-drop{position:absolute;top:28px;z-index:6;line-height:0;pointer-events:none;animation:pq3009fall 1.6s ease-in both;animation-delay:var(--dd,0s);}

        /* Jadval — sahna markazi (3 qator, hairline separatorlar). Razryad to'plami qiymat katagida. */
        .pq3009 .pq-table{position:relative;z-index:3;width:100%;max-width:344px;margin:0 auto;background:#fff;border:2px solid #cbb58e;border-radius:14px;box-shadow:0 3px 8px rgba(0,0,0,.10);overflow:hidden;box-sizing:border-box;}
        .pq3009 .pq-tr{display:flex;align-items:center;min-height:52px;padding:8px 12px;gap:8px;}
        .pq3009 .pq-tr + .pq-tr{border-top:1px solid #e8dfca;}
        .pq3009 .pq-lab{flex:0 0 auto;min-width:56px;font-size:15px;font-weight:700;color:#7a6f57;}
        .pq3009 .pq-val{flex:1 1 auto;display:flex;align-items:center;justify-content:flex-end;gap:6px;font-size:20px;font-weight:900;color:#3a3320;font-variant-numeric:tabular-nums;}
        .pq3009 .pq-ng{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:3px;max-width:190px;}
        .pq3009 .pq-num{flex:0 0 auto;min-width:30px;text-align:right;}
        .pq3009 .pq-sign{flex:0 0 auto;font-size:20px;font-weight:900;color:#2f6bab;}
        .pq3009 .pq-tr.res .pq-lab{color:#2c6633;}
        .pq3009 .pq-tr.res{background:#f4faf0;}
        .pq3009 .pq-tr.res.win{background:#e8f7ee;}
        .pq3009 .pq-q{display:inline-flex;align-items:center;justify-content:center;min-width:40px;height:40px;padding:0 10px;border-radius:11px;background:#eef2f7;border:2px solid #c3cddb;color:#5a6b82;font-size:24px;font-weight:900;animation:pq3009breathe 2.4s ease-in-out infinite;}
        .pq3009 .pq-fill{display:inline-flex;align-items:center;gap:8px;padding:0 12px;height:42px;border-radius:11px;background:#1a7f43;border:2px solid #15693a;color:#fff;font-size:24px;font-weight:900;font-variant-numeric:tabular-nums;animation:pq3009pop .4s ease both;}
        .pq3009 .pq-fill .pq-obj{line-height:0;}

        .pq3009 .pq-obj{line-height:0;}
        .pq3009 .pq-obj.idle{animation:pq3009bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);transform-origin:50% 100%;}

        .pq3009 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3009tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3009 .pq-spark.s2{animation-delay:-.6s;} .pq3009 .pq-spark.s3{animation-delay:-1.15s;}

        .pq3009 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;flex-wrap:wrap;animation:pq3009in .3s ease both;}
        .pq3009 .pq-eq b{min-width:46px;height:38px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq3009 .pq-eq b.res{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq3009 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq3009 .pq-subline{text-align:center;margin-top:7px;font-size:14px;font-weight:700;color:#5c7250;font-variant-numeric:tabular-nums;animation:pq3009in .34s ease both;}

        .pq3009 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:18px;}
        .pq3009 .pq-opt{min-width:84px;height:74px;padding:0 12px;font-size:34px;font-weight:800;line-height:1;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3009 .pq-opt:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);}
        .pq3009 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq3009 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq3009 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq3009cele .5s ease;}
        .pq3009 .pq-opt:disabled{cursor:default;}
        .pq3009 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3009in .22s ease both;}
        .pq3009 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3009 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq3009bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3009sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq3009breathe{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.08);opacity:1;}}
        @keyframes pq3009pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3009tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3009cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3009in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq3009drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-14px);}}
        @keyframes pq3009bird{0%,100%{transform:translate(0,0);}50%{transform:translate(26px,-5px);}}
        @keyframes pq3009sway{0%,100%{transform:rotate(-1.2deg);}50%{transform:rotate(1.2deg);}}
        @keyframes pq3009swing{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq3009wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3009flit{0%,100%{transform:translate(0,0);}25%{transform:translate(22px,-10px);}50%{transform:translate(40px,5px);}75%{transform:translate(16px,-5px);}}
        @keyframes pq3009fall{0%{opacity:0;transform:translateY(-14px) rotate(0);}12%{opacity:1;}100%{opacity:0;transform:translateY(150px) rotate(120deg);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <div className="pq-title">{t.title}</div>

        {/* JADVAL: Bor edi 34 (razryad) / Keldi + 25 (razryad) / Jami ? — natija g'alabagacha «?» */}
        <div className="pq-table">
          <div className="pq-tr">
            <span className="pq-lab">{t.rBor}</span>
            <span className="pq-val"><NumGroup tens={TA} units={UA} idle={idle} /><span className="pq-num">{A}</span></span>
          </div>
          <div className="pq-tr">
            <span className="pq-lab">{t.rKel}</span>
            <span className="pq-val"><span className="pq-sign">{PLUS}</span><NumGroup tens={TB} units={UB} idle={idle} /><span className="pq-num">{B}</span></span>
          </div>
          <div className={"pq-tr res" + (ok ? " win" : "")}>
            <span className="pq-lab">{t.rJam}</span>
            <span className="pq-val">
              {!ok
                ? <span className="pq-q">?</span>
                : <span className="pq-fill"><Basket w={26} />{SUM}</span>}
            </span>
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "12%", top: "44px" }}>{"✦"}</span>
          <span className="pq-spark s2" style={{ left: "84%", top: "60px" }}>{"✦"}</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "34px" }}>{"✦"}</span>
        </>)}
      </div>

      {/* G'alaba: o'nlik o'nlikka, birlik birlikka — tenglama 34 + 25 = 59 (javob faqat shu yerda) */}
      {ok && (<>
        <div className="pq-eq"><b>{A}</b><i>{PLUS}</i><b>{B}</b><i>=</i><b className="res">{SUM}</b></div>
        <div className="pq-subline">{t.sub}</div>
      </>)}

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
