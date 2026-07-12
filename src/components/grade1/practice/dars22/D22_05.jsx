// Dars22 · Amaliyot 05 — Zanjir «Olma bog'i» taqqoslash · compare_chain · timsoh
// 4 qator ketma-ket to'ldiriladi: har juftga "A ? B" belgi tanlanadi (>, <, =).
// Qatorlar: 23<32, 50=50, 61>59, 47>43. Qoida: AVVAL o'nliklar (savatlar), teng bo'lsa BIRLIKLAR (olmalar).
// Har juftda tanho savatlar = o'nlik, tanho olmalar = birlik. Timsoh belgi vazifasini bajaradi:
// g'alabada og'zini KATTA son tomonga ochadi (Dars04/Dars12 kanoni), teng bo'lsa og'iz tinch/yopiq.
// ANSWER-LEAK yo'q: solishtirilgunga qadar markazda '?' turadi, belgi FAQAT to'g'ri javobda ochiladi.
// VEDI-DO-VERNOGO: noto'g'ri qator qulflanmaydi, retry tugmasi yo'q; setChecked FAQAT hammasi to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SIGNS = ['>', '<', '=']; // belgi variantlari — matn ko'rinishidagi qiymatlar (literal < > EMAS)

// Har qator: taqqoslash arifmetik jihatdan to'g'ri. bigger: 'L' chap, 'R' o'ng, 'E' teng.
const ROWS = [
  { a: 23, b: 32, target: '<' },
  { a: 50, b: 50, target: '=' },
  { a: 61, b: 59, target: '>' },
  { a: 47, b: 43, target: '>' },
].map((r) => ({
  ...r,
  tensA: Math.floor(r.a / 10), unitsA: r.a % 10,
  tensB: Math.floor(r.b / 10), unitsB: r.b % 10,
  bigger: r.a > r.b ? 'L' : (r.a < r.b ? 'R' : 'E'),
}));
const N = ROWS.length;
const DATA = { level: '🔴', tag: 'compare_chain' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Zanjir",
    title: "Belgilar zanjiri",
    setup: "Har juftga belgi qo'ying.",
    ask: "Har qatorni to'ldiring.",
    correct: "Barakalla! Har juftni to'g'ri solishtirdingiz.",
    hint: "Avval o'nliklar, teng bo'lsa birliklar.",
    tensLbl: "o'nliklar", tensEq: "o'nliklar teng", unitLbl: "birliklar",
  },
  ru: {
    eyebrow: "Яблоневый сад · Цепочка",
    title: "Цепочка знаков",
    setup: "Поставь знак к каждой паре.",
    ask: "Заполни каждую строку.",
    correct: "Молодец! Ты верно сравнил каждую пару.",
    hint: "Сначала десятки, если равны — единицы.",
    tensLbl: "десятки", tensEq: "десятки равны", unitLbl: "единицы",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — Dars21 kanoni: yumaloq tana (radial 2-ton), bandak, barg, oq blik.
const Apple = ({ w = 12 }) => {
  const id = 'pq2205a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma bir birlikka bog'langan) — Dars21 kanoni: to'qima savat, olmalar
// mo'ralaydi, yashil «10» nishoni. Bola savat ichini qayta sanamaydi — savat = bitta o'nlik.
const Basket = ({ w = 30 }) => {
  const id = 'pq2205b' + (__gid++);
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

// TIMSOH (Dars12/Dars04 kanoni): cho'zilgan yashil tana, tikanli scute-orqa, panjali oyoq, blikli ko'z.
// chomp=false → og'iz TINCH/yopiq (teng holat); chomp=true → og'iz OCHIQ (jag'lar < > belgisini eslatadi).
// Asos o'ngga qaragan; g'alabada wrapper .faceL (scaleX-1) chapga buradi — og'iz doim KATTA son tomonga.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="92" height="50" aria-hidden="true" style={{ display: 'block' }}>
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

// Bitta son tomoni: prominent raqam (o'nlik yashil, birlik qizil) + kichik razryad-strip (savatlar/olmalar).
// Savat = o'nlik, olma = birlik. AVVAL o'nliklar (savatlar) taqqoslanadi — shu bois savatlar chapda.
const Side = ({ tens, units, win }) => (
  <div className="pq-side">
    <div className={'pq-card' + (win ? ' win' : '')}>
      <span className="tn">{tens}</span><span className="un">{units}</span>
    </div>
    <div className="pq-pv">
      <span className="pq-tens" aria-hidden="true">
        {Array.from({ length: tens }).map((_, k) => (<span key={k} className="pq-mini"><Basket w={16} /></span>))}
      </span>
      {units > 0 && (
        <span className="pq-units" aria-hidden="true">
          {Array.from({ length: units }).map((_, k) => (<span key={k} className="pq-mini"><Apple w={11} /></span>))}
        </span>
      )}
    </div>
  </div>
);

// OLMA DARAXTI (dekor): qo'ng'ir tana + yashil shox-barg + bir necha olma. Bosiladigan nishon EMAS.
const Tree = () => (
  <svg viewBox="0 0 60 72" width="52" height="62" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="26" y="42" width="8" height="26" rx="3" fill="#8a5a2c" />
    <path d="M30 60 L22 52 M30 56 L38 48" stroke="#8a5a2c" strokeWidth="3" strokeLinecap="round" />
    <circle cx="30" cy="26" r="20" fill="#5aa84f" />
    <circle cx="16" cy="34" r="13" fill="#4f9a48" />
    <circle cx="44" cy="34" r="13" fill="#4f9a48" />
    <circle cx="22" cy="22" r="3" fill="#df5b52" /><circle cx="38" cy="20" r="3" fill="#df5b52" />
    <circle cx="30" cy="34" r="3" fill="#df5b52" /><circle cx="43" cy="30" r="3" fill="#df5b52" /><circle cx="17" cy="30" r="3" fill="#df5b52" />
  </svg>
);

export default function D22_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // { rowIdx: belgi-satri }
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda g'alaba-reveal (chomp, chip, uchqun) qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady]);

  const rowRight = (i) => vals[i] === ROWS[i].target;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.target);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: ROWS.map((r) => `${r.a} _ ${r.b}`),
      studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) },
      correctAnswer: { vals: ROWS.map((r) => r.target) },
      correct, meta: { ...DATA },
    });
  }, [vals, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  // Tens-first izoh (g'alabada har qator ostida): o'nliklar birinchi, teng bo'lsa birliklar.
  const stepText = (r) => {
    if (r.bigger === 'E') return `${r.a} ${r.target} ${r.b}`;
    if (r.tensA === r.tensB) return `${t.tensEq}, ${t.unitLbl}: ${r.unitsA} ${r.target} ${r.unitsB}`;
    return `${t.tensLbl}: ${r.tensA} ${r.target} ${r.tensB}`;
  };

  return (
    <div className="pq pq2205">
      <style>{`
        .pq2205{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2205 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2205 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2205 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2205 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2205 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:11px;padding:0 0 4px;}
        /* orchard sahna — dekor, ambient jonlanish (bosiladigan nishon EMAS) */
        .pq2205 .pq-scene{position:relative;width:380px;max-width:100%;height:116px;border-radius:20px;overflow:hidden;border:2px solid #bfe0a8;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);}
        .pq2205 .pq-sun{position:absolute;right:18px;top:12px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2205sun 3.6s ease-in-out infinite;}
        .pq2205 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2205 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2205 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2205 .pq-tree{position:absolute;left:14px;bottom:20px;z-index:2;line-height:0;pointer-events:none;transform-box:fill-box;transform-origin:50% 100%;animation:pq2205sway 4.2s ease-in-out infinite;}
        .pq2205 .pq-bk{position:absolute;bottom:14px;z-index:3;line-height:0;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq2205 .pq-bk.b1{right:26px;} .pq2205 .pq-bk.b2{right:74px;bottom:16px;}
        .pq2205 .pq-leaf{position:absolute;top:-8px;width:9px;height:9px;border-radius:0 100% 0 100%;background:#e08a4a;opacity:.85;z-index:4;pointer-events:none;}
        .pq2205 .pq-leaf.l1{left:38%;animation:pq2205fall 6s linear infinite;}
        .pq2205 .pq-leaf.l2{left:62%;background:#d9584f;animation:pq2205fall 7.4s linear -2.6s infinite;}
        .pq2205 .pq-leaf.l3{left:50%;background:#e6b84a;animation:pq2205fall 8.2s linear -5s infinite;}
        .pq2205 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2205tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2205 .pq-spark.s2{animation-delay:-.6s;} .pq2205 .pq-spark.s3{animation-delay:-1.15s;}

        /* qatorlar */
        .pq2205 .pq-rows{display:flex;flex-direction:column;gap:9px;width:100%;}
        .pq2205 .pq-rw{display:flex;flex-direction:column;gap:8px;padding:9px 10px;border-radius:15px;border:2.5px solid #e4d6b8;background:#fffdf6;transition:.15s;}
        .pq2205 .pq-rw.good{border-color:#1a7f43;background:#eefaf1;}
        .pq2205 .pq-rw.good.win{animation:pq2205cele .5s ease;}
        .pq2205 .pq-rw.bad{border-color:#e0a86a;background:#fdf4e8;animation:pq2205shake .35s ease;}

        .pq2205 .pq-cmp{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:nowrap;}
        .pq2205 .pq-side{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1 1 0;min-width:0;}
        .pq2205 .pq-card{display:flex;align-items:center;justify-content:center;min-width:66px;height:44px;padding:0 8px;border-radius:12px;background:#fff;border:2.5px solid #d9cdb0;font-size:28px;font-weight:900;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.08);}
        .pq2205 .pq-card .tn{color:#1a7f43;} .pq2205 .pq-card .un{color:#c0392b;}
        .pq2205 .pq-card.win{border-color:#1a7f43;background:#eefaf1;box-shadow:0 0 0 3px rgba(26,127,67,.18);}
        .pq2205 .pq-pv{display:flex;align-items:flex-end;justify-content:center;gap:6px;min-height:18px;flex-wrap:wrap;}
        .pq2205 .pq-tens{display:flex;gap:2px;align-items:flex-end;}
        .pq2205 .pq-units{display:flex;gap:1px;align-items:flex-end;flex-wrap:wrap;justify-content:center;max-width:120px;padding-left:5px;border-left:2px dotted #e0cfa8;}
        .pq2205 .pq-mini{line-height:0;}

        .pq2205 .pq-croc-slot{position:relative;flex:0 0 auto;width:100px;display:flex;align-items:center;justify-content:center;}
        .pq2205 .pq-crocbox{transition:transform .5s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq2205 .pq-crocbox.faceL{transform:scaleX(-1);}
        .pq2205 .pq-crocidle{animation:pq2205float 3.6s ease-in-out infinite;}
        .pq2205 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pq2205crocsway 3.4s ease-in-out infinite;}
        .pq2205 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq2205 .pq-jaws.chomping{animation:pq2205chomp .5s ease-in-out 3;}
        .pq2205 .pq-crocblink{opacity:0;animation:pq2205blink 4s linear infinite;}
        .pq2205 .pq-q{position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:26px;height:26px;border-radius:50%;background:#fff;border:2.5px solid #b79a5a;color:#8a6d2e;font-size:18px;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 3px 6px rgba(0,0,0,.14);font-variant-numeric:tabular-nums;}
        .pq2205 .pq-q.set{border-color:#2563eb;color:#2563eb;}
        .pq2205 .pq-chip{position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:17px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 12px;border-radius:12px;box-shadow:0 4px 12px rgba(26,127,67,.22);z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;animation:pq2205chipin .5s cubic-bezier(.3,1.5,.5,1) both;}

        .pq2205 .pq-pick{display:flex;gap:8px;justify-content:center;align-items:center;}
        .pq2205 .pq-sg{width:52px;height:44px;border-radius:12px;border:2.5px solid #e0d3b4;background:#fff;font-size:26px;font-weight:900;color:#374151;cursor:pointer;line-height:1;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq2205 .pq-sg:hover:not(:disabled){border-color:#e0a83f;transform:translateY(-2px);}
        .pq2205 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2205 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2205 .pq-sg:disabled{cursor:default;}
        .pq2205 .pq-step{text-align:center;font-size:13px;font-weight:800;color:#5c7a4a;font-variant-numeric:tabular-nums;padding:4px 10px;border-radius:10px;background:#eefaf1;animation:pq2205in .3s .1s both;}

        .pq2205 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2205in .22s ease both;}
        .pq2205 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2205 .pq-fb.no{background:#fdecec;color:#c0392b;}

        /* review/qayta ochilishda g'alaba-animatsiyalar to'xtaydi */
        .pq2205 .pq-stage.still .pq-jaws.chomping,.pq2205 .pq-stage.still .pq-chip,.pq2205 .pq-stage.still .pq-spark,.pq2205 .pq-stage.still .pq-rw.good.win{animation:none;}

        @keyframes pq2205sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2205sway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(1.6deg);}}
        @keyframes pq2205fall{0%{transform:translateY(0) rotate(0);opacity:0;}12%{opacity:.85;}100%{transform:translateY(120px) rotate(220deg);opacity:0;}}
        @keyframes pq2205float{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2205crocsway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2205chomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pq2205blink{0%,90%{opacity:0;}92%,95%{opacity:1;}97%,100%{opacity:0;}}
        @keyframes pq2205chipin{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2205tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2205cele{0%{transform:scale(1);}30%{transform:scale(1.02);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq2205shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2205in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-stage' + (still ? ' still' : '')}>
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-hill" />
          <div className="pq-title">{t.title}</div>
          <span className="pq-tree"><Tree /></span>
          <span className="pq-bk b1"><Basket w={30} /></span>
          <span className="pq-bk b2"><Basket w={24} /></span>
          <span className="pq-leaf l1" /><span className="pq-leaf l2" /><span className="pq-leaf l3" />
          {ok && (<>
            <span className="pq-spark" style={{ left: '20%', top: '18px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '78%', top: '30px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '52%', top: '12px' }}>✦</span>
          </>)}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            const winL = ok && (r.bigger === 'L' || r.bigger === 'E');
            const winR = ok && (r.bigger === 'R' || r.bigger === 'E');
            // g'alabada timsoh og'zi KATTA son tomonga: chap katta -> faceL; teng -> og'iz tinch (chomp yo'q).
            const faceL = ok && r.bigger === 'L';
            const chomp = ok && r.bigger !== 'E';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-cmp">
                  <Side tens={r.tensA} units={r.unitsA} win={winL} />

                  <div className="pq-croc-slot">
                    {ok
                      ? <span className="pq-chip">{r.a} {r.target} {r.b}</span>
                      : <span className={'pq-q' + (vals[i] != null ? ' set' : '')}>{vals[i] != null ? vals[i] : '?'}</span>}
                    <div className={'pq-crocbox' + (faceL ? ' faceL' : '')}>
                      <div className="pq-crocidle"><Croc chomp={chomp} /></div>
                    </div>
                  </div>

                  <Side tens={r.tensB} units={r.unitsB} win={winR} />
                </div>

                {ok ? (
                  <div className="pq-step">{stepText(r)}</div>
                ) : (
                  <div className="pq-pick">
                    {SIGNS.map((s) => (
                      <button key={s} type="button" className={'pq-sg' + (vals[i] === s ? ' sel' : '')} disabled={lock}
                        onClick={() => { setVals((prev) => ({ ...prev, [i]: s })); setFeedback(null); }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
