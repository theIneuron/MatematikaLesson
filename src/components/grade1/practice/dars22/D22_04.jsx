// Dars22 · Amaliyot 04 — Belgini tanlang «36 ▢ 34» · 🟡 · timsoh · tag: compare_units
// Olma bog'i: chapda 36 (3 savat + 6 olma), o'ngda 34 (3 savat + 4 olma). O'nliklar TENG (3 = 3),
// birliklar hal qiladi: 6 > 4 → 36 > 34. Timsoh og'zini KATTA son tomonga ochadi (chapga, '>').
// M2 qalqoni: o'nliklar teng bo'lsa ham sonlar teng EMAS — birliklarga qaraladi ('=' — noto'g'ri).
// Distraktorlar: '<' (M3 belgi yo'nalishi), '=' (M2 o'nliklar teng = teng). VEDI-DO-VERNOGO:
// noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Timsoh tanlangan belgini AKS ETTIRADI: '>' — og'iz ochiq chapga, '<' — og'iz ochiq o'ngga,
// '=' — og'iz TO'LIQ YOPIQ, tekis tumshuq, hech qaysi tomonga ochilmaydi (TUZATILDI: avval
// rotate-hack yopishda ochiq pastki jag' + pushti og'iz ich qolib, og'iz yarim ochiq ko'rinardi).
// Savol matni ANIQ: "Ikkita son bor: 36 va 34" + solishtirish-buyruq. Ambient: bulut + gullar.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 36, B = 34;                 // chap = 36, o'ng = 34
const TENS_A = 3, UNITS_A = 6;        // 36 = 3 savat + 6 olma
const TENS_B = 3, UNITS_B = 4;        // 34 = 3 savat + 4 olma
const TARGET = ">";                    // 36 > 34
const DATA = { a: A, b: B, target: TARGET, options: [">", "<", "="], level: "🟡", tag: "compare_units" };
const tensSign = TENS_A === TENS_B ? "=" : TENS_A > TENS_B ? ">" : "<";     // 3 = 3
const unitsSign = UNITS_A > UNITS_B ? ">" : UNITS_A < UNITS_B ? "<" : "=";  // 6 > 4

const T = {
  uz: {
    eyebrow: "Olma bog'i · Taqqoslash", title: "Belgini tanlang",
    setup: "Ikkita son bor: 36 va 34.",
    ask: "Sonlarni solishtiring va to'g'ri belgini tanlang.",
    correct: "Barakalla! O'nliklar teng, birliklar hal qiladi: 6 > 4. 36 > 34.",
    hint: "O'nliklar teng bo'lsa, birliklarga qarang.",
    wTens: "O'nliklar", wUnits: "Birliklar",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сравнение", title: "Выбери знак",
    setup: "Есть два числа: 36 и 34.",
    ask: "Сравни числа и выбери верный знак.",
    correct: "Молодец! Десятки равны, решают единицы: 6 > 4. 36 > 34.",
    hint: "Если десятки равны — смотри на единицы.",
    wTens: "Десятки", wUnits: "Единицы",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (D21_03 kanoni)
const Apple = ({ w = 16 }) => {
  const id = "pq2204a" + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma bir birlikka bog'langan): to'qima savat, ustidan olmalar mo'ralaydi,
// oldida yashil «10» nishoni. Savat = bitta razryad birligi (qayta sanalmaydi). (D21_03 kanoni)
const Basket = ({ w = 30 }) => {
  const id = "pq2204b" + (__gid++);
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

// TIMSOH (D12_02 / D04 kanoni): cho'zilgan yashil tana (uch ton), tikanli scute-orqa, panjali oyoq,
// blikli ko'z. open=true — og'iz OCHIQ (< / > shakli: pushti ich, zigzag tishlar, ko'tarilgan jag');
// open=false — og'iz TO'LIQ YOPIQ tekis tumshuq ('=' holati: hech qaysi tomonga ochilmaydi, ochiq
// jag' qoldiqlari YO'Q). chomp — g'alabada chaynash (faqat ochiq og'izda). Wrapper faceL bilan
// chapga (kattaroq son tomon) buriladi.
const Croc = ({ open, chomp }) => (
  <svg viewBox="0 0 132 72" width="112" height="61" aria-hidden="true" style={{ display: "block" }}>
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    <ellipse className="pq-crocbelly" cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />

    {open ? (
      <>
        {/* og'iz OCHIQ — pushti ich, pastki jag', zigzag tishlar + ko'tarilgan yuqori jag' */}
        <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
        <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
        <g className={"pq-jaws" + (chomp ? " chomping" : "")}>
          <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
          <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
          <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
        </g>
      </>
    ) : (
      <>
        {/* og'iz TO'LIQ YOPIQ — tekis cho'zilgan tumshuq ('=' holati: hech qaysi tomonga ochilmaydi) */}
        <path d="M66 35 Q92 31 116 40 Q124 42.5 123 47 Q121 51.5 114 50.5 Q92 52.5 66 50.5 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M66 36 Q92 32.5 114 41" stroke="#2e7a3e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M70 45.5 Q92 47.5 118 46" stroke="#256835" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M82 46 l2 3.2 l2 -3.2 Z M95 46.5 l2 3.2 l2 -3.2 Z M107 46.5 l1.8 3 l1.8 -3 Z" fill="#fff" stroke="#256835" strokeWidth=".5" strokeLinejoin="round" />
        <circle cx="118" cy="42.5" r="1.3" fill="#1f2430" opacity=".7" />
      </>
    )}

    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
  </svg>
);

// Bargcha — ambient (havoda sekin uchadi, dekor). Bosiladigan nishon EMAS.
const Leaf = ({ c1 = "#7cbf5a", c2 = "#4f9a3f" }) => (
  <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" style={{ display: "block" }}>
    <path d="M4 16 Q10 2 17 4 Q16 15 4 16 Z" fill={c1} stroke={c2} strokeWidth="1" strokeLinejoin="round" />
    <path d="M6.5 14 Q11 8 15 6" stroke={c2} strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Gul (ambient) — bog' chetida hilpiragan mayda gul. Dekor, pointer-events YO'Q.
const Flower = ({ c = "#e8739e" }) => (
  <svg viewBox="0 0 16 22" width="13" height="18" aria-hidden="true" style={{ display: "block" }}>
    <path d="M8 11 L8 20" stroke="#4f9a3f" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 16 Q4.4 15 4 12.4 Q7.2 12.8 8 16 Z" fill="#5aa84f" />
    <g fill={c}>
      <circle cx="8" cy="3.6" r="2.6" /><circle cx="4.3" cy="6.2" r="2.6" /><circle cx="11.7" cy="6.2" r="2.6" />
      <circle cx="5.5" cy="10" r="2.6" /><circle cx="10.5" cy="10" r="2.6" />
    </g>
    <circle cx="8" cy="6.9" r="2.3" fill="#ffd76a" stroke="#e8b53a" strokeWidth=".6" />
  </svg>
);

export default function D22_04(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null);        // ">" | "<" | "="
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda g'alaba animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.sign != null) setPicked(initialAnswer.studentAnswer.sign);
      if (typeof initialAnswer.correct === "boolean") {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { sign: picked }, correctAnswer: { sign: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !still;                                // ambient jonlanish (bosiladigan nishon EMAS)
  // Timsoh tanlangan belgini aks ettiradi: '>' — og'iz ochiq chapga (faceL), '<' — og'iz ochiq
  // o'ngga, '=' — og'iz TO'LIQ yopiq, tekis, hech qaysi tomonga burilmaydi (teng holat).
  const faceL = picked === ">";
  const open = picked === ">" || picked === "<";
  const bigLeft = A > B;                              // 36 > 34 — chap kattaroq

  const baskA = Array.from({ length: TENS_A });
  const applA = Array.from({ length: UNITS_A });
  const baskB = Array.from({ length: TENS_B });
  const applB = Array.from({ length: UNITS_B });

  const Pile = ({ bask, appl, base }) => (
    <div className="pq-pile">
      <div className="pq-baskets">
        {bask.map((_, i) => (
          <span key={i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.13}s` }}><Basket w={30} /></span>
        ))}
      </div>
      <div className="pq-apples">
        {appl.map((_, i) => (
          <span key={i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(base + i) * 0.13}s` }}><Apple w={16} /></span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pq pq2204">
      <style>{`
        .pq2204{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2204 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2204 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2204 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2204 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2204 .pq-scene{position:relative;width:412px;max-width:100%;height:250px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 50%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2204 .pq-sun{position:absolute;right:18px;top:13px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2204sun 3.6s ease-in-out infinite;}
        .pq2204 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:48px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2204 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2204 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2204 .pq-leaf{position:absolute;z-index:2;line-height:0;pointer-events:none;opacity:.9;animation:pq2204leaf linear infinite;}
        .pq2204 .pq-leaf.l1{left:24%;top:-16px;animation-duration:9s;animation-delay:-1s;}
        .pq2204 .pq-leaf.l2{left:58%;top:-16px;animation-duration:11s;animation-delay:-5s;}
        .pq2204 .pq-leaf.l3{left:80%;top:-16px;animation-duration:10s;animation-delay:-8s;}
        .pq2204 .pq-cloud{position:absolute;z-index:1;pointer-events:none;width:44px;height:13px;border-radius:999px;background:rgba(255,255,255,.88);animation:pq2204drift 12s ease-in-out infinite;}
        .pq2204 .pq-cloud::before{content:'';position:absolute;left:7px;top:-7px;width:17px;height:13px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2204 .pq-cloud::after{content:'';position:absolute;left:22px;top:-5px;width:13px;height:10px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2204 .pq-cloud.c1{left:7%;top:16px;}
        .pq2204 .pq-cloud.c2{left:66%;top:32px;width:30px;animation-delay:-6s;}
        .pq2204 .pq-flw{position:absolute;bottom:5px;z-index:2;line-height:0;pointer-events:none;transform-origin:50% 100%;animation:pq2204sway 4s ease-in-out infinite;}
        .pq2204 .pq-flw.f1{left:9px;}
        .pq2204 .pq-flw.f2{left:32px;bottom:9px;animation-delay:-1.4s;}
        .pq2204 .pq-flw.f3{right:11px;animation-delay:-2.2s;}

        .pq2204 .pq-arena{position:absolute;left:6px;right:6px;top:28px;bottom:52px;display:flex;align-items:flex-end;justify-content:center;gap:2px;z-index:3;}
        .pq2204 .pq-group{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;flex:0 0 auto;}
        .pq2204 .pq-pile{display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2204 .pq-baskets{display:flex;justify-content:center;gap:3px;}
        .pq2204 .pq-apples{display:flex;justify-content:center;gap:3px;min-height:18px;}
        .pq2204 .pq-obj{line-height:0;}
        .pq2204 .pq-obj.idle{animation:pq2204bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2204 .pq-card{position:relative;width:58px;height:56px;border-radius:14px;background:linear-gradient(#ffffff,#eef4fc);border:3px solid #cdd8ea;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#2b3550;font-variant-numeric:tabular-nums;box-shadow:0 5px 12px rgba(31,54,86,.18);animation:pq2204card 3s ease-in-out infinite;}
        .pq2204 .pq-card.r{animation-delay:-1.5s;}
        .pq2204 .pq-card.win{border-color:#1a7f43;background:linear-gradient(#eafaf0,#d3f1e0);color:#1a7f43;animation:pq2204card 3s ease-in-out infinite,pq2204cele .6s ease;}

        .pq2204 .pq-mid{position:relative;display:flex;flex-direction:column;align-items:center;flex:0 0 auto;}
        .pq2204 .pq-slot{width:52px;height:56px;border-radius:14px;border:3px dashed #b3c4dd;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#93a6c1;background:rgba(255,255,255,.6);line-height:1;animation:pq2204breath 2.3s ease-in-out infinite;}
        .pq2204 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#fff;animation:pq2204slotin .35s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2204 .pq-slot.win{border-color:#1a7f43;color:#1a7f43;background:#eafaf0;}
        .pq2204 .pq-crocbox{position:absolute;bottom:-2px;left:50%;transform:translateX(-50%) translateY(8px);z-index:3;transition:transform .5s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));pointer-events:none;}
        .pq2204 .pq-crocbox.faceL{transform:translateX(-50%) translateY(8px) scaleX(-1);}
        .pq2204 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pq2204sway 3.4s ease-in-out infinite;}
        .pq2204 .pq-crocbelly{transform-box:fill-box;transform-origin:50% 50%;animation:pq2204belly 3s ease-in-out infinite;}
        .pq2204 .pq-crocblink{transform-box:fill-box;transform-origin:50% 20%;opacity:0;animation:pq2204blink 4.2s ease-in-out infinite;}
        .pq2204 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq2204 .pq-jaws.chomping{animation:pq2204chomp .5s ease-in-out 2;}
        .pq2204 .pq-scene.still .pq-crocbox,.pq2204 .pq-scene.still .pq-jaws{transition:none;}
        .pq2204 .pq-scene.still .pq-jaws.chomping{animation:none;}
        .pq2204 .pq-scene.still .pq-slot.has{animation:none;}
        .pq2204 .pq-scene.still .pq-card.win{animation:pq2204card 3s ease-in-out infinite;}

        .pq2204 .pq-star{position:absolute;z-index:6;line-height:0;opacity:0;pointer-events:none;animation:pq2204tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq2204 .pq-star.s2{animation-delay:-.5s;} .pq2204 .pq-star.s3{animation-delay:-1.05s;}

        .pq2204 .pq-why{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 10px;margin-top:14px;font-size:14px;font-weight:800;color:#3f6e46;font-variant-numeric:tabular-nums;animation:pq2204in .3s ease both;}
        .pq2204 .pq-why .k{font-size:11px;font-weight:800;color:#8a94a2;text-transform:uppercase;letter-spacing:.03em;margin-right:2px;}
        .pq2204 .pq-why .chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;}
        .pq2204 .pq-why .chip.u{background:#e8f7ee;border-color:#8fca88;color:#1a7f43;}
        .pq2204 .pq-why .arr{font-size:18px;font-weight:900;color:#8a94a2;}
        .pq2204 .pq-why .res{padding:3px 12px;border-radius:999px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:16px;}

        .pq2204 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:16px;}
        .pq2204 .pq-opt{width:76px;height:70px;font-size:38px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;line-height:1;transition:.12s;}
        .pq2204 .pq-opt:hover:not(:disabled){border-color:#8fc47a;transform:translateY(-2px);}
        .pq2204 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2204 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2204 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2204cele .5s ease;}
        .pq2204 .pq-opt:disabled{cursor:default;}
        .pq2204 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2204in .22s ease both;}
        .pq2204 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2204 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2204sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2204leaf{0%{transform:translateY(0) rotate(0);opacity:0;}10%{opacity:.9;}90%{opacity:.9;}100%{transform:translateY(300px) rotate(220deg);opacity:0;}}
        @keyframes pq2204sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2204drift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq2204bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2204card{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pq2204belly{0%,100%{transform:scaleY(1);}50%{transform:scaleY(1.07);}}
        @keyframes pq2204blink{0%,90%{opacity:0;transform:scaleY(0);}93%,96%{opacity:1;transform:scaleY(1);}100%{opacity:0;transform:scaleY(0);}}
        @keyframes pq2204chomp{0%,100%{transform:rotate(0);}50%{transform:rotate(15deg);}}
        @keyframes pq2204breath{0%,100%{transform:scale(1);border-color:#b3c4dd;}50%{transform:scale(1.05);border-color:#98abc8;}}
        @keyframes pq2204slotin{0%{transform:scale(.55);}100%{transform:scale(1);}}
        @keyframes pq2204tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2204cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2204in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={"pq-scene" + (still ? " still" : "")}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>
        <span className="pq-cloud c1" />
        <span className="pq-cloud c2" />
        <span className="pq-leaf l1"><Leaf /></span>
        <span className="pq-leaf l2"><Leaf c1="#e6b34d" c2="#c9822f" /></span>
        <span className="pq-leaf l3"><Leaf /></span>
        <span className="pq-flw f1"><Flower /></span>
        <span className="pq-flw f2"><Flower c="#8f7ae0" /></span>
        <span className="pq-flw f3"><Flower c="#f2a13c" /></span>

        <div className="pq-arena">
          {/* CHAP: 36 = 3 savat + 6 olma */}
          <div className="pq-group">
            <Pile bask={baskA} appl={applA} base={TENS_A} />
            <div className={"pq-card" + (ok && bigLeft ? " win" : "")}>{A}</div>
          </div>

          {/* O'RTA: bo'sh joy + timsoh (og'iz tanlangan belgiga ergashadi) */}
          <div className="pq-mid">
            <div className={"pq-slot" + (picked ? " has" : "") + (ok ? " win" : "")}>{picked || "?"}</div>
            <div className={"pq-crocbox" + (faceL ? " faceL" : "")}>
              <Croc open={open} chomp={!!ok} />
            </div>
          </div>

          {/* O'NG: 34 = 3 savat + 4 olma */}
          <div className="pq-group">
            <Pile bask={baskB} appl={applB} base={TENS_B} />
            <div className={"pq-card r" + (ok && !bigLeft ? " win" : "")}>{B}</div>
          </div>
        </div>

        {ok && (<>
          <span className="pq-star" style={{ left: "30%", top: "30px" }}><Star fill="#f2b134" /></span>
          <span className="pq-star s2" style={{ left: "64%", top: "44px" }}><Star fill="#e59a2f" /></span>
          <span className="pq-star s3" style={{ left: "48%", top: "18px" }}><Star fill="#f2b134" /></span>
        </>)}
      </div>

      {ok && (
        <div className="pq-why">
          <span className="chip"><span className="k">{t.wTens}</span>{TENS_A} {tensSign} {TENS_B}</span>
          <span className="chip u"><span className="k">{t.wUnits}</span>{UNITS_A} {unitsSign} {UNITS_B}</span>
          <span className="arr">{"→"}</span>
          <b className="res">{A} {TARGET} {B}</b>
        </div>
      )}

      <div className="pq-opts">
        {DATA.options.map((s) => {
          const sel = picked === s; const right = ok && s === DATA.target;
          return <button key={s} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => { if (lock) return; setPicked(s); setFeedback(null); }}>{s}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
