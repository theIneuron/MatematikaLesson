// Dars22 · Amaliyot 09 — Masala «Olma bog'i» · timsoh · tag: compare_word
// Og'zaki masala, ikki ISMLI karta: "Anvar · 34" (3 savat + 4 olma), "Zuhra · 43"
// (4 savat + 3 olma). Savol: kim ko'p terdi? To'g'ri = Zuhra (43). Qoida: avval
// o'nliklarni solishtiring — 4 o'nlik 3 o'nlikdan ko'p (birlik ko'p bo'lsa ham).
// M1 tuzoq: Anvarda birlik ko'p (4 > 3) — faqat birlikka qarab Anvar tanlanadi (xato).
// SAVAT = bitta o'nlik (10 olma bir joyda, "10" nishoni); yakka olma = bitta birlik.
// G'alabada: yutgan karta yashil, timsoh KATTA son (43) tomonga og'iz ochadi, "43 > 34".
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// ANSWER-LEAK YO'Q: yutguncha hech qaysi karta g'olib deb belgilanmaydi, belgi ko'rsatilmaydi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const BIG = 43, SMALL = 34;               // Zuhra 43, Anvar 34
const TARGET = "zuhra";                   // ko'p tergan — Zuhra
const CARDS = [
  { key: "anvar", val: 34, tens: 3, units: 4 }, // 3 savat + 4 olma (M1: birlik ko'p)
  { key: "zuhra", val: 43, tens: 4, units: 3 }, // 4 savat + 3 olma — o'nlik ko'p (to'g'ri)
];
const DATA = { a: 34, b: 43, target: TARGET, options: ["anvar", "zuhra"], level: "🔴", tag: "compare_word" };
const SIGN_STR = `${BIG} ${'>'} ${SMALL}`; // "43 > 34" — JS satr, JSX ichida literal belgi YO'Q

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala", title: "Kim ko'p terdi?",
    setup: "Anvar 34, Zuhra 43 olma terdi.",
    ask: "Ko'p terganni tanlang.",
    correct: "Barakalla! Zuhra 43 ta — Anvardan ko'p. 43 > 34.",
    hint: "O'nliklarni solishtiring: 4 o'nlik 3 o'nlikdan ko'p.",
    anvar: "Anvar", zuhra: "Zuhra", ta: "ta", sub: "4 o'nlik 3 o'nlikdan ko'p.", more: "ko'p",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача", title: "Кто собрал больше?",
    setup: "Анвар собрал 34, Зухра 43 яблока.",
    ask: "Выбери, кто собрал больше.",
    correct: "Молодец! Зухра — 43, больше Анвара. 43 > 34.",
    hint: "Сравни десятки: 4 десятка больше 3 десятков.",
    anvar: "Анвар", zuhra: "Зухра", ta: "шт.", sub: "4 десятка больше 3 десятков.", more: "больше",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik, D21_08 kanoni): yumaloq tana (2-ton radial) + barg + band + oq blik.
const Apple = ({ w = 16 }) => {
  const id = "pq2209a" + (__gid++);
  return (
    <svg viewBox="0 0 30 34" width={w} height={w * 34 / 30} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
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

// SAVAT (D21_03 / D22_01 kanoni) — bitta o'nlik = 10 olma bir birlikka bog'langan; oldida yashil
// "10" nishoni. Bola savatdagi olmalarni qayta sanamaydi: savat = bitta razryad birligi.
const Basket = ({ w = 24 }) => {
  const id = "pq2209b" + (__gid++);
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

// Barg (ambient) — bog' havosida sekin uchadigan yashil barg. Dekor, pointer-events YO'Q.
const Leaf = () => (
  <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" style={{ display: "block" }}>
    <path d="M4 16 Q4 4 16 4 Q16 16 4 16 Z" fill="#7cc85e" stroke="#4f9a3f" strokeWidth="1" />
    <path d="M6 14 Q11 9 14 6" stroke="#3f8038" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

// Timsoh (D22_01 / D12_01 kanoni): cho'zilgan yashil tana, tikanli scute-orqa, panjali oyoq,
// blikli ko'z. chomp=false → og'iz tinch; chomp=true → og'iz OCHIQ (jag'lar tishli).
// Asos o'ngga qaragan; wrapper .faceL (scaleX-1) chapga buradi — KATTA son (43) tomoniga.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="96" height="52" aria-hidden="true" style={{ display: "block" }}>
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
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
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

    {chomp ? (
      <>
        <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
        <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
        <g className="pq-jaws chomping">
          <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
          <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
          <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
        </g>
      </>
    ) : (
      <>
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
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" />
  </svg>
);

export default function D22_09(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null); // "anvar" | "zuhra"
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda g'alaba-reveal (timsoh qichirlashi / uchqun) qayta ijro etilmaydi — statik.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === "boolean") { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: [t.anvar, t.zuhra], studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2209">
      <style>{`
        .pq2209{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2209 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq2209 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq2209 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2209 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2209 .pq-scene{position:relative;width:392px;max-width:100%;height:264px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2209 .pq-sun{position:absolute;right:18px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2209sun 3.6s ease-in-out infinite;}
        .pq2209 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:46px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2209 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2209 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2209 .pq-leaf{position:absolute;z-index:2;line-height:0;pointer-events:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq2209 .pq-leaf.l1{left:16%;top:-14px;animation:pq2209leaf 9s linear infinite;}
        .pq2209 .pq-leaf.l2{left:78%;top:-16px;animation:pq2209leaf 12s linear infinite;animation-delay:-5s;}

        .pq2209 .pq-arena{position:absolute;left:8px;right:8px;top:42px;bottom:8px;display:flex;align-items:stretch;justify-content:center;gap:12px;z-index:3;}
        /* Bosiladigan nishon = ISMLI karta. Ichidagi savat/olma STATIK (aylanma tebranish YO'Q). */
        .pq2209 .pq-card{position:relative;flex:1 1 0;min-width:0;max-width:180px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 8px 12px;border-radius:16px;border:3px solid #cdd8d2;background:rgba(255,255,255,.94);cursor:pointer;box-shadow:0 4px 10px rgba(40,60,40,.14);transition:.12s;}
        .pq2209 .pq-card:hover:not(:disabled){border-color:#8fc4a6;transform:translateY(-2px);}
        .pq2209 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2209 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq2209 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pq2209cele .5s ease;}
        .pq2209 .pq-card.dim{opacity:.44;filter:saturate(.62);}
        .pq2209 .pq-card:disabled{cursor:default;}
        .pq2209 .pq-name{display:flex;align-items:baseline;gap:7px;font-weight:900;color:#2e7a3e;}
        .pq2209 .pq-name .nm{font-size:16px;}
        .pq2209 .pq-name .val{font-size:22px;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2209 .pq-card.right .pq-name .nm,.pq2209 .pq-card.right .pq-name .val{color:#1a7f43;}
        .pq2209 .pq-baskrow{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;align-items:flex-end;max-width:150px;line-height:0;}
        .pq2209 .pq-plus{font-size:17px;font-weight:900;color:#8a94a2;line-height:1;}
        .pq2209 .pq-applerow{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;align-items:flex-end;max-width:140px;line-height:0;}
        /* g'alaba lentasi — yutgan karta ustida "ko'p" (AnsPop uslubi). pointer-events YO'Q. */
        .pq2209 .pq-more{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:7;background:#1a7f43;color:#fff;font-weight:900;font-size:12px;padding:2px 12px;border-radius:999px;white-space:nowrap;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);animation:pq2209pop .45s ease both;}

        .pq2209 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2209tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2209 .pq-spark.s2{animation-delay:-.6s;} .pq2209 .pq-spark.s3{animation-delay:-1.15s;}
        .pq2209 .pq-scene.still .pq-spark{animation:none;opacity:.9;}
        .pq2209 .pq-scene.still .pq-more,.pq2209 .pq-scene.still .pq-card.right{animation:none;}

        /* G'alaba xulosasi: timsoh = BELGI, og'zi katta son (43) tomonga ochiq → "43 > 34" */
        .pq2209 .pq-cmp{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:14px;animation:pq2209in .3s ease both;}
        .pq2209 .pq-cmp .pill{display:flex;flex-direction:column;align-items:center;gap:1px;}
        .pq2209 .pq-cmp .pill b{min-width:64px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;font-variant-numeric:tabular-nums;}
        .pq2209 .pq-cmp .pill.win b{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2209 .pq-cmp .pill span{font-size:11px;font-weight:800;color:#8a94a2;}
        .pq2209 .pq-cmpcroc{line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq2209 .pq-cmpcroc.faceL{transform:scaleX(-1);}
        .pq2209 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pq2209sway 3.4s ease-in-out infinite;}
        .pq2209 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq2209 .pq-jaws.chomping{animation:pq2209chomp .5s ease-in-out 3;}
        .pq2209 .pq-crocblink{opacity:0;animation:pq2209blink 4s linear infinite;}
        .pq2209 .pq-cmp.still .pq-jaws.chomping,.pq2209 .pq-cmp.still .pq-croctail,.pq2209 .pq-cmp.still .pq-crocblink{animation:none;}
        .pq2209 .pq-chip{text-align:center;margin-top:8px;font-size:20px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;animation:pq2209in .3s .05s both;}
        .pq2209 .pq-sub{text-align:center;margin-top:4px;font-size:13px;font-weight:800;color:#5c7fa6;animation:pq2209in .3s .1s both;}

        .pq2209 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2209in .22s ease both;}
        .pq2209 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2209 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2209sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2209leaf{0%{transform:translate(0,-14px) rotate(0);opacity:0;}12%{opacity:.85;}88%{opacity:.85;}100%{transform:translate(-26px,168px) rotate(210deg);opacity:0;}}
        @keyframes pq2209sway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2209chomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pq2209blink{0%,90%{opacity:0;}92%,95%{opacity:1;}97%,100%{opacity:0;}}
        @keyframes pq2209pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2209tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2209cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2209in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={"pq-scene" + (still ? " still" : "")}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>
        <span className="pq-leaf l1"><Leaf /></span>
        <span className="pq-leaf l2"><Leaf /></span>

        {/* Ikki ISMLI karta — bosiladigan nishon. Har biri: ism + son + savatlar (o'nlik) + olmalar
            (birlik). Yutguncha hech qaysi g'olib deb belgilanmaydi (answer-leak YO'Q). */}
        <div className="pq-arena">
          {CARDS.map((c) => {
            const sel = picked === c.key;
            const right = ok && c.key === TARGET;
            const dim = ok && c.key !== TARGET;
            return (
              <button
                key={c.key}
                type="button"
                className={"pq-card" + (right ? " right" : sel ? " sel" : "") + (dim ? " dim" : "")}
                disabled={lock}
                onClick={() => { setPicked(c.key); setFeedback(null); }}
              >
                <span className="pq-name"><span className="nm">{t[c.key]}</span><span className="val">{c.val}</span></span>
                {/* O'nliklar: savatlar (har biri "10" nishonli bitta birlik-o'nlik) */}
                <div className="pq-baskrow">
                  {Array.from({ length: c.tens }).map((_, k) => (<span key={k}><Basket w={24} /></span>))}
                </div>
                {/* O'nliklar VA birliklar QO'SHILADI: savat-guruh + olma-guruh (minus EMAS) */}
                <span className="pq-plus">{'+'}</span>
                {/* Birliklar: yakka olmalar */}
                <div className="pq-applerow">
                  {Array.from({ length: c.units }).map((_, k) => (<span key={k}><Apple w={16} /></span>))}
                </div>
                {right && <span className="pq-more">{t.more}</span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "15%", top: "52px" }}>✦</span>
          <span className="pq-spark s2" style={{ left: "85%", top: "64px" }}>✦</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "38px" }}>✦</span>
        </>)}
      </div>

      {/* G'alabada: timsoh og'zi KATTA son (43) tomonga ochiladi → "43 > 34" */}
      {ok && (<>
        <div className={"pq-cmp" + (still ? " still" : "")}>
          <div className="pill win"><b>{BIG}</b><span>{t.zuhra}</span></div>
          <span className="pq-cmpcroc faceL"><Croc chomp /></span>
          <div className="pill"><b>{SMALL}</b><span>{t.anvar}</span></div>
        </div>
        <div className="pq-chip">{SIGN_STR}</div>
        <div className="pq-sub">{t.sub}</div>
      </>)}

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
