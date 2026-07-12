// Dars22 · Amaliyot 03 — Qaysi katta? «Olma bog'i» · timsoh · tag: compare_pick
// Ikki RASMLI karta, kattasini tanlash. A karta = 4 savat + 2 olma (= 42) — TO'G'RI (kattasi).
// B karta = 2 savat + 4 olma (= 24) — M4 o'rin almashish tuzog'i (42 va 24). Qoida: avval
// O'NLIKLARNI (savatlarni) solishtiring; 4 savat 2 savatdan ko'p → 42 katta. Savat = 10 olmani
// bog'lagan bitta o'nlik ('10' nishoni), yakka olma = bitta birlik. Timsoh og'zini KATTA son
// tomonga (chapga, A) ochadi (Dars04/Dars12 belgi-kanoni). Javob-sirqish YO'Q: raqamlar (42/24)
// faqat g'alabada ochiladi, gacha savat/olma rasmi ko'rinadi. VEDI-DO-VERNOGO: noto'g'rida qulf
// yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Savol matni ANIQ: ikkita to'plam bor — qayerda olma ko'p, o'sha kartani tanlash.
// Ambient boyitish: bulutlar + hilpiragan gullar (dekor, pointer-events YO'Q).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const GT = '>'; // katta belgisi (JS satr — JSX ichida literal > EMAS)
// Ikki rasm-karta. A birinchi (chap, katta). picked = karta qiymati.
const CARDS = [
  { key: 'A', val: 42, tens: 4, units: 2 }, // 4 savat + 2 olma
  { key: 'B', val: 24, tens: 2, units: 4 }, // 2 savat + 4 olma (M4 o'rin almashish)
];
const TARGET = 42; // kattasi = A
const DATA = { target: TARGET, options: CARDS.map((c) => c.val), level: '🟡', tag: 'compare_pick' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Taqqoslash", title: "Qaysi katta?",
    setup: "Ikkita olma to'plami bor.",
    ask: "Qayerda olma ko'p? O'sha kartani tanlang.",
    correct: "Barakalla! Qirq ikki yigirma to'rtdan katta. 42 > 24.",
    hint: "O'nliklarni sanang: 4 o'nlik 2 o'nlikdan ko'p.",
    tenword: "o'nlik",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сравнение", title: "Что больше?",
    setup: "Есть два набора яблок.",
    ask: "Где яблок больше? Выбери эту карточку.",
    correct: "Молодец! Сорок два больше двадцати четырёх. 42 > 24.",
    hint: "Сосчитай десятки: 4 десятка больше 2 десятков.",
    tenword: "десятка",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Unikal gradient id-lar uchun hisoblagich.
let __gid = 0;

// OLMA KANONI (yakka birlik, D21_08): yumaloq tana (2-ton radial) + barg + band + oq blik.
const Apple = ({ w = 17 }) => {
  const id = 'pq2203a' + (__gid++);
  return (
    <svg viewBox="0 0 30 34" width={w} height={w * 34 / 30} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#ff9b7a" />
          <stop offset="46%" stopColor="#e8443a" />
          <stop offset="100%" stopColor="#b32a22" />
        </radialGradient>
      </defs>
      {/* band */}
      <path d="M15,9 Q15.4,4.4 17.4,3" fill="none" stroke="#7a4a24" strokeWidth="1.8" strokeLinecap="round" />
      {/* barg */}
      <path d="M16.5,6 Q22.5,3.2 24.6,7.4 Q19.4,9.6 16.5,6 Z" fill="#4fa845" stroke="#3c8536" strokeWidth=".7" />
      {/* tana */}
      <path d="M15,10 C15,10 12.6,7 9,8.2 C4.6,9.6 3.4,14 3.4,18.4 C3.4,25.4 8.4,31 15,31 C21.6,31 26.6,25.4 26.6,18.4 C26.6,14 25.4,9.6 21,8.2 C17.4,7 15,10 15,10 Z" fill={`url(#${id})`} stroke="#a6291f" strokeWidth=".8" />
      {/* oq blik */}
      <ellipse cx="10.4" cy="15" rx="2.8" ry="4.4" fill="#fff" opacity=".42" transform="rotate(-18 10.4 15)" />
    </svg>
  );
};

// SAVAT KANONI (bitta o'nlik = 10 olma to'plami, D21_08): to'qilgan savat + ichida olmalar + «10»
// nishoni. Bola savat ichidagi olmalarni QAYTA sanamaydi — savat bitta birlik-o'nlik.
const Basket = ({ w = 25 }) => {
  const id = 'pq2203b' + (__gid++);
  return (
    <svg viewBox="0 0 64 62" width={w} height={w * 62 / 64} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d79a55" />
          <stop offset="100%" stopColor="#a86a2f" />
        </linearGradient>
      </defs>
      {/* savatdagi olmalar */}
      <circle cx="22" cy="20" r="8.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
      <circle cx="35" cy="17" r="9" fill="#ef5a52" stroke="#a11d2a" strokeWidth="1" />
      <circle cx="46" cy="20" r="8" fill="#e63b3b" stroke="#a11d2a" strokeWidth="1" />
      <path d="M35 8 Q40 4 42 9 Q38 12 35 8 Z" fill="#4fae55" />
      {/* tana */}
      <path d="M8 27 L56 27 L50 55 Q49 58 46 58 L18 58 Q15 58 14 55 Z" fill={`url(#${id})`} stroke="#7c4e22" strokeWidth="1.6" strokeLinejoin="round" />
      {/* to'quv — gorizontal yoylar */}
      <path d="M11 34 Q32 39 53 34" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <path d="M13 43 Q32 48 51 43" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      <path d="M15 51 Q32 55 49 51" fill="none" stroke="#7c4e22" strokeWidth="1.2" opacity=".5" />
      {/* to'quv — vertikal ustunlar */}
      <line x1="24" y1="28" x2="22" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <line x1="32" y1="28" x2="32" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      <line x1="40" y1="28" x2="42" y2="57" stroke="#7c4e22" strokeWidth="1" opacity=".38" />
      {/* qirra */}
      <rect x="5" y="24" width="54" height="7" rx="3.5" fill="#c78a45" stroke="#7c4e22" strokeWidth="1.4" />
      {/* «10» nishoni — savat bitta o'nlik ekanini bildiradi */}
      <circle cx="53" cy="12" r="9.5" fill="#1a7f43" stroke="#fff" strokeWidth="2" />
      <text x="53" y="15.6" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily="Manrope,system-ui,sans-serif">10</text>
    </svg>
  );
};

// TIMSOH KANONI (Dars04/Dars12 belgi-kanoni): cho'zilgan yashil tana, scute-tikanli orqa, panjali
// oyoq, tik-qorachiqli ko'z + pirpiratish qopqog'i. chomp=false → og'iz tinch/yopiq; chomp=true →
// og'iz OCHIQ (jag'lar < > belgisini eslatadi). O'ngga qaragan asos; g'alabada wrapper .faceL
// (scaleX-1) chapga — KATTA son (A) tomonga og'iz ochadi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="98" height="53" aria-hidden="true" style={{ display: 'block' }}>
    {/* dum — egilgan, sekin tebranadi */}
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    {/* uzoq tomondagi oyoqlar */}
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    {/* cho'zilgan tana */}
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    {/* qorin */}
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* orqa scute-tikanlar */}
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    {/* yaqin oyoqlar — panjali */}
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    {/* bosh suyagi */}
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />

    {chomp ? (
      <>
        {/* og'iz OCHIQ — jag'lar < > belgisini eslatadi (metafora) */}
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
        {/* og'iz TINCH/yopiq — cho'zilgan snout */}
        <path d="M66 35 Q92 31 116 40 Q124 42.5 123 47 Q121 51.5 114 50.5 Q92 52.5 66 50.5 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M66 36 Q92 32.5 114 41" stroke="#2e7a3e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M70 45.5 Q92 47.5 118 46" stroke="#256835" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M82 46 l2 3.2 l2 -3.2 Z M95 46.5 l2 3.2 l2 -3.2 Z M107 46.5 l1.8 3 l1.8 -3 Z" fill="#fff" stroke="#256835" strokeWidth=".5" strokeLinejoin="round" />
        <circle cx="118" cy="42.5" r="1.3" fill="#1f2430" opacity=".7" />
      </>
    )}

    {/* ko'z do'ngligi + tik qorachiqli ko'z + pirpiratish qopqog'i */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" />
  </svg>
);

// Gul (ambient) — bog' chetida hilpiragan mayda gul. Dekor, pointer-events YO'Q.
const Flower = ({ c = '#e8739e' }) => (
  <svg viewBox="0 0 16 22" width="13" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M8 11 L8 20" stroke="#4f9a3f" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 16 Q4.4 15 4 12.4 Q7.2 12.8 8 16 Z" fill="#5aa84f" />
    <g fill={c}>
      <circle cx="8" cy="3.6" r="2.6" /><circle cx="4.3" cy="6.2" r="2.6" /><circle cx="11.7" cy="6.2" r="2.6" />
      <circle cx="5.5" cy="10" r="2.6" /><circle cx="10.5" cy="10" r="2.6" />
    </g>
    <circle cx="8" cy="6.9" r="2.3" fill="#ffd76a" stroke="#e8b53a" strokeWidth=".6" />
  </svg>
);

// Bog' bargligi (dekorativ, taplarni ushlamaydi) — bargli shox + olma.
const Leaf = ({ flip }) => (
  <svg width="50" height="38" viewBox="0 0 52 40" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M0,8 Q26,2 40,16" fill="none" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" />
    <g fill="#4fa845" stroke="#3c8536" strokeWidth=".6">
      <path d="M18,6 Q24,2 25,7 Q20,9 18,6 Z" />
      <path d="M31,10 Q37,6 38,11 Q33,13 31,10 Z" />
    </g>
    <circle cx="41" cy="18" r="4.5" fill="#e63b3b" stroke="#a11d2a" strokeWidth=".8" />
  </svg>
);

export default function D22_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // 42 | 24
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review/qayta ochilishda g'alaba-reveal (chomp/pop/uchqun) qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  // RESTORE: qayta ochilishda tanlov + feedback (doim msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => String(c.val)), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const big = CARDS[0], small = CARDS[1]; // 42, 24

  return (
    <div className="pq pq2203">
      <style>{`
        .pq2203{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2203 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2203 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2203 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2203 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2203 .pq-orchard{position:relative;width:452px;max-width:100%;margin:0 auto;padding:36px 10px 16px;border-radius:20px;background:linear-gradient(#cdeafd 0%,#dff1fb 40%,#cfeccb 74%,#b6df97 100%);border:2px solid #bfe0cd;overflow:hidden;}
        .pq2203 .pq-sun{position:absolute;left:14px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:2;pointer-events:none;animation:pq2203sun 3.6s ease-in-out infinite;}
        .pq2203 .pq-leaf{position:absolute;z-index:2;pointer-events:none;transform-origin:top center;}
        .pq2203 .pq-leaf.l{left:-4px;top:2px;animation:pq2203sway 4.2s ease-in-out infinite;}
        .pq2203 .pq-leaf.r{right:-4px;top:-2px;animation:pq2203sway 4.6s ease-in-out .8s infinite;}
        .pq2203 .pq-cloud{position:absolute;z-index:1;pointer-events:none;width:40px;height:12px;border-radius:999px;background:rgba(255,255,255,.85);animation:pq2203drift 12s ease-in-out infinite;}
        .pq2203 .pq-cloud::before{content:'';position:absolute;left:6px;top:-6px;width:15px;height:11px;border-radius:50%;background:rgba(255,255,255,.85);}
        .pq2203 .pq-cloud::after{content:'';position:absolute;left:20px;top:-4px;width:11px;height:9px;border-radius:50%;background:rgba(255,255,255,.85);}
        .pq2203 .pq-cloud.c1{left:16%;top:14px;}
        .pq2203 .pq-cloud.c2{right:20%;top:26px;width:28px;animation-delay:-6s;}
        .pq2203 .pq-flw{position:absolute;bottom:5px;z-index:2;line-height:0;pointer-events:none;transform-origin:50% 100%;animation:pq2203sway 4s ease-in-out infinite;}
        .pq2203 .pq-flw.f1{left:9px;}
        .pq2203 .pq-flw.f2{left:30px;bottom:9px;animation-delay:-1.4s;}
        .pq2203 .pq-flw.f3{right:11px;animation-delay:-2.2s;}
        .pq2203 .pq-board{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#3f9b57,#2c7c42);border:2.5px solid #226334;color:#f0fff4;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}

        .pq2203 .pq-cards{position:relative;z-index:3;display:flex;gap:6px;justify-content:center;align-items:stretch;}
        .pq2203 .pq-card{position:relative;flex:1 1 0;min-width:0;max-width:168px;min-height:152px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:12px 6px;border-radius:16px;border:3px solid #d6dae3;background:rgba(255,255,255,.94);cursor:pointer;box-shadow:0 4px 10px rgba(40,60,40,.14);transition:.12s;}
        .pq2203 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2203 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2203 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq2203 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pq2203cele .5s ease;}
        .pq2203 .pq-card.dim{opacity:.5;filter:saturate(.7);}
        .pq2203 .pq-card:disabled{cursor:default;}
        .pq2203 .pq-baskrow{display:flex;justify-content:center;align-items:flex-end;flex-wrap:wrap;gap:2px;line-height:0;max-width:118px;}
        .pq2203 .pq-plus{font-size:18px;font-weight:900;color:#5c6672;line-height:1;}
        .pq2203 .pq-applerow{display:flex;justify-content:center;align-items:flex-end;flex-wrap:wrap;gap:3px;max-width:120px;line-height:0;}
        /* g'alaba: yakuniy son pilyulasi (AnsPop) — javob FAQAT to'g'rida ochiladi */
        .pq2203 .pq-total{position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:7;background:#fff;border:2.5px solid #1a7f43;color:#1a7f43;font-weight:900;font-size:16px;padding:2px 13px;border-radius:999px;pointer-events:none;box-shadow:0 3px 7px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;animation:pq2203pop .45s ease both;}
        .pq2203 .pq-total.sm{border-color:#8a94a2;color:#8a94a2;}

        /* markaziy timsoh-slot — bosiladigan nishon EMAS, dekorativ jonli */
        .pq2203 .pq-croc-slot{position:relative;flex:0 0 auto;width:100px;align-self:center;display:flex;align-items:center;justify-content:center;pointer-events:none;}
        .pq2203 .pq-crocbox{transition:transform .5s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.24));}
        .pq2203 .pq-crocbox.faceL{transform:scaleX(-1);}
        .pq2203 .pq-crocidle{animation:pq2203float 3.6s ease-in-out infinite;}
        .pq2203 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pq2203crocsway 3.4s ease-in-out infinite;}
        .pq2203 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq2203 .pq-jaws.chomping{animation:pq2203chomp .5s ease-in-out 3;}
        .pq2203 .pq-crocblink{opacity:0;animation:pq2203blink 4s linear infinite;}
        .pq2203 .pq-q{position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:26px;height:26px;border-radius:50%;background:#fff;border:2.5px solid #2e7a3e;color:#2e7a3e;font-size:18px;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 3px 6px rgba(0,0,0,.16);animation:pq2203q 1.8s ease-in-out infinite;}
        .pq2203 .pq-chip{position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:16px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 12px;border-radius:12px;box-shadow:0 4px 12px rgba(26,127,67,.24);z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;animation:pq2203chipin .5s cubic-bezier(.3,1.5,.5,1) both;}

        .pq2203 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2203tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2203 .pq-spark.s2{animation-delay:-.6s;} .pq2203 .pq-spark.s3{animation-delay:-1.15s;}

        /* g'alaba: taqqoslash qatori — o'nlik-birinchi mustahkamlash */
        .pq2203 .pq-cmp{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:14px;animation:pq2203in .3s ease both;font-variant-numeric:tabular-nums;}
        .pq2203 .pq-cmp .pill{display:flex;flex-direction:column;align-items:center;gap:2px;}
        .pq2203 .pq-cmp .pill b{min-width:70px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;}
        .pq2203 .pq-cmp .pill.win b{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2203 .pq-cmp .pill span{font-size:11px;font-weight:800;color:#8a94a2;}
        .pq2203 .pq-gt{font-size:28px;font-weight:900;color:#1a7f43;}

        .pq2203 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2203in .22s ease both;}
        .pq2203 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2203 .pq-fb.no{background:#fdecec;color:#c0392b;}

        /* review/qayta ochish: g'alaba-reveal animatsiyalari qotadi (ambient — sun/barg/timsoh — davom etadi) */
        .pq2203 .pq-orchard.still .pq-total,.pq2203 .pq-orchard.still .pq-chip,.pq2203 .pq-orchard.still .pq-jaws.chomping,.pq2203 .pq-orchard.still .pq-spark,.pq2203 .pq-orchard.still .pq-card.right{animation:none;}

        @keyframes pq2203sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2203sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2203drift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq2203float{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pq2203crocsway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2203chomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pq2203blink{0%,90%{opacity:0;}92%,95%{opacity:1;}97%,100%{opacity:0;}}
        @keyframes pq2203q{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.14);}}
        @keyframes pq2203chipin{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2203pop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2203tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2203cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq2203in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-orchard' + (still ? ' still' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" />
        <span className="pq-cloud c2" />
        <span className="pq-leaf l"><Leaf /></span>
        <span className="pq-leaf r"><Leaf flip /></span>
        <span className="pq-flw f1"><Flower /></span>
        <span className="pq-flw f2"><Flower c="#8f7ae0" /></span>
        <span className="pq-flw f3"><Flower c="#f2a13c" /></span>
        <div className="pq-board">{t.title}</div>

        {/* Ikki rasm-karta + markazda timsoh-belgi. Karta = bosiladigan nishon (ichidagi savat/olma
            statik). Timsoh dekorativ (pointer-events:none), g'alabada og'zini kattaga (A) ochadi.
            Raqamlar (42/24) FAQAT to'g'rida ochiladi — javob-sirqish yo'q. */}
        <div className="pq-cards">
          {/* CHAP — A karta (4 savat + 2 olma = 42, kattasi) */}
          {(() => {
            const o = big;
            const sel = picked === o.val;
            const right = ok && o.val === TARGET;
            const dim = ok && o.val !== TARGET;
            return (
              <button type="button" className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')} disabled={lock} onClick={() => { setPicked(o.val); setFeedback(null); }}>
                <div className="pq-baskrow">
                  {Array.from({ length: o.tens }).map((_, k) => (<span key={k}><Basket w={25} /></span>))}
                </div>
                <span className="pq-plus">{'+'}</span>
                <div className="pq-applerow">
                  {Array.from({ length: o.units }).map((_, k) => (<span key={k}><Apple w={17} /></span>))}
                </div>
                {ok && <span className="pq-total">{o.val}</span>}
              </button>
            );
          })()}

          {/* MARKAZ — timsoh = belgi; g'alabada chapga (A, katta) og'iz ochadi */}
          <div className="pq-croc-slot">
            {ok
              ? <span className="pq-chip">{big.val} {GT} {small.val}</span>
              : <span className="pq-q">?</span>}
            <div className={'pq-crocbox' + (ok ? ' faceL' : '')}>
              <div className="pq-crocidle"><Croc chomp={!!ok} /></div>
            </div>
          </div>

          {/* O'NG — B karta (2 savat + 4 olma = 24, o'rin almashish tuzog'i) */}
          {(() => {
            const o = small;
            const sel = picked === o.val;
            const right = ok && o.val === TARGET;
            const dim = ok && o.val !== TARGET;
            return (
              <button type="button" className={'pq-card' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')} disabled={lock} onClick={() => { setPicked(o.val); setFeedback(null); }}>
                <div className="pq-baskrow">
                  {Array.from({ length: o.tens }).map((_, k) => (<span key={k}><Basket w={25} /></span>))}
                </div>
                <span className="pq-plus">{'+'}</span>
                <div className="pq-applerow">
                  {Array.from({ length: o.units }).map((_, k) => (<span key={k}><Apple w={17} /></span>))}
                </div>
                {ok && <span className="pq-total sm">{o.val}</span>}
              </button>
            );
          })()}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '15%', top: '42px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '85%', top: '54px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>✦</span>
        </>)}
      </div>

      {/* G'alabada: taqqoslash — o'nliklar birinchi (4 o'nlik > 2 o'nlik → 42 > 24) */}
      {ok && (
        <div className="pq-cmp">
          <div className="pill win"><b>{big.val}</b><span>{big.tens} {t.tenword}</span></div>
          <span className="pq-gt">{GT}</span>
          <div className="pill"><b>{small.val}</b><span>{small.tens} {t.tenword}</span></div>
        </div>
      )}

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
