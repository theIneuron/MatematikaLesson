// Dars22 · Amaliyot 07 — Ko'p-tanlov «40 dan katta» · 🔴 · tag: compare_multi
// Olma bog'i: 5 son-karta (45, 38, 52, 24, 60). 40 dan KATTA barcha sonni belgilash.
// GOOD = {45, 52, 60} (idekslar 0,2,4). Tuzoqlar: 38, 24. Faqat aynan {45,52,60} to'g'ri.
// QOIDA: avval O'NLIKLAR taqqoslanadi — 40 = 4 o'nlik (savat). Timsohning ochiq og'zi
// KATTA songa qaraydi (Dars04/Dars12 kanoni): 45 > 40, 52 > 40, 60 > 40.
// M1 birlik-taqqoslash, M2 teng-o'nlik, M3 belgi-yo'nalish, M4 raqam-almashtirish tuzoqlari.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
// Savol matni ANIQ: kartalarda 5 ta son bor — har birini 40 bilan solishtirib, kattalarini bosish.
// Ambient boyitish: bulutlar + hilpiragan gullar (dekor, pointer-events YO'Q).
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

const THRESH = 40;
const NUMS = [45, 38, 52, 24, 60];
const GOOD = NUMS.map((n, i) => (n > THRESH ? i : -1)).filter((i) => i >= 0); // [0,2,4]
const DATA = { nums: NUMS, thresh: THRESH, good: GOOD, level: '🔴', tag: 'compare_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Taqqoslash",
    title: "40 dan katta",
    setup: "Kartalarda 5 ta son bor.",
    ask: "Har birini 40 bilan solishtiring: 40 dan KATTA sonlarning hammasini bosing.",
    correct: "Barakalla! 45, 52, 60 — hammasi 40 dan katta.",
    hint: "Har sonni 40 bilan solishtiring.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сравнение",
    title: "Больше 40",
    setup: "На карточках 5 чисел.",
    ask: "Сравни каждое с 40: нажми ВСЕ числа больше 40.",
    correct: "Молодец! 45, 52, 60 — все больше 40.",
    hint: "Сравни каждое число с 40.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik): yumaloq tana — radial 2-ton, bandak, barg, oq blik. (Dars21 kanoni)
const Apple = ({ w = 26 }) => {
  const id = 'pq2207a' + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma): to'qima savat + olmalar + yashil «10» nishoni. (Dars21 kanoni)
const Basket = ({ w = 34 }) => {
  const id = 'pq2207b' + (__gid++);
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

// TIMSOH BOSHI = «katta» belgisi (og'zi CHAPGA — katta songa — ochiladi, ya'ni «>»).
// Yashil 3-ton, ustida qalqonchalar (scute), tishlar zigzag. Dars04/Dars12 taqqoslash kanoni.
const CrocGt = ({ w = 40 }) => {
  const id = 'pq2207g' + (__gid++);
  const h = w * 40 / 56;
  return (
    <svg viewBox="0 0 56 40" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fca86" /><stop offset="60%" stopColor="#57a84f" /><stop offset="100%" stopColor="#3f8038" />
        </linearGradient>
      </defs>
      {/* yuqori jag' (chapga ochiladi) */}
      <path d="M50,19 L47,7 Q46,4 41,4 L12,4 Q5,4 4,8 Q4,11 9,12 L44,17 Q50,17 50,19 Z" fill={`url(#${id})`} stroke="#2f6633" strokeWidth="1.2" strokeLinejoin="round" />
      {/* pastki jag' */}
      <path d="M50,21 L47,33 Q46,36 41,36 L14,36 Q7,36 7,32 Q7,29 12,28 L44,23 Q50,23 50,21 Z" fill={`url(#${id})`} stroke="#2f6633" strokeWidth="1.2" strokeLinejoin="round" />
      {/* qalqonchalar */}
      <g fill="#3f8038">
        <path d="M40,4 l3,-3 l3,3 Z" /><path d="M30,4 l3,-3 l3,3 Z" /><path d="M20,4 l3,-3 l3,3 Z" />
      </g>
      {/* yuqori tishlar (pastga) */}
      <g fill="#fff" stroke="#cfe0cf" strokeWidth=".3">
        <path d="M13,12.6 l2,4 l2,-3.7 Z" /><path d="M21,13.6 l2,4 l2,-3.5 Z" /><path d="M29,14.6 l2,3.9 l2,-3.3 Z" /><path d="M37,15.6 l2,3.7 l2,-3.1 Z" />
      </g>
      {/* pastki tishlar (yuqoriga) */}
      <g fill="#fff" stroke="#cfe0cf" strokeWidth=".3">
        <path d="M15,27.4 l2,-4 l2,3.7 Z" /><path d="M23,26.4 l2,-4 l2,3.5 Z" /><path d="M31,25.4 l2,-3.9 l2,3.3 Z" /><path d="M39,24.4 l2,-3.7 l2,3.1 Z" />
      </g>
      {/* ko'z */}
      <circle cx="43" cy="9" r="3.4" fill="#eafbe9" stroke="#2f6633" strokeWidth="1" />
      <circle cx="43.8" cy="9.4" r="1.6" fill="#1f2430" />
      {/* burun teshigi */}
      <circle cx="8" cy="8.6" r="1.1" fill="#2f6633" />
    </svg>
  );
};

// TIMSOH MASKOTI (bog' qorovuli): o'tirgan do'stona timsoh — tana, dum, boshi, jilmaygan og'zi.
const CrocMascot = ({ w = 78 }) => {
  const id = 'pq2207m' + (__gid++);
  const h = w * 54 / 84;
  return (
    <svg viewBox="0 0 84 54" width={w} height={h} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fca86" /><stop offset="100%" stopColor="#4f9e49" />
        </linearGradient>
      </defs>
      {/* dum */}
      <path d="M68,42 Q84,40 79,29 Q77,36 68,37 Z" fill={`url(#${id})`} stroke="#2f6633" strokeWidth="1.2" strokeLinejoin="round" />
      {/* tana */}
      <ellipse cx="44" cy="41" rx="30" ry="11" fill={`url(#${id})`} stroke="#2f6633" strokeWidth="1.4" />
      {/* oyoqlar */}
      <g fill="#4f9e49" stroke="#2f6633" strokeWidth="1"><rect x="26" y="47" width="6" height="6" rx="2" /><rect x="52" y="47" width="6" height="6" rx="2" /></g>
      {/* bosh */}
      <path d="M6,34 Q4,26 14,24 L30,24 Q40,25 40,32 Q40,39 30,40 L14,40 Q7,40 6,34 Z" fill={`url(#${id})`} stroke="#2f6633" strokeWidth="1.4" strokeLinejoin="round" />
      {/* og'iz chizig'i */}
      <path d="M8,33 L34,33" stroke="#2f6633" strokeWidth="1.2" strokeLinecap="round" />
      {/* tishlar */}
      <g fill="#fff"><path d="M12,33 l1.6,3 l1.6,-3 Z" /><path d="M18,33 l1.6,3 l1.6,-3 Z" /><path d="M24,33 l1.6,3 l1.6,-3 Z" /></g>
      {/* burun teshigi */}
      <circle cx="9" cy="29" r="1.2" fill="#2f6633" />
      {/* ko'z */}
      <circle cx="26" cy="21" r="5" fill="#eafbe9" stroke="#2f6633" strokeWidth="1.4" />
      <circle cx="27" cy="21.6" r="2.3" fill="#1f2430" />
      {/* orqa qalqonchalar */}
      <g fill="#3f8038"><path d="M40,31 l3,-4 l3,4 Z" /><path d="M50,30 l3,-4 l3,4 Z" /><path d="M60,31 l3,-4 l3,4 Z" /></g>
    </svg>
  );
};

const Leaf = ({ w = 13 }) => (<svg viewBox="0 0 20 20" width={w} height={w} aria-hidden="true" style={{ display: 'block' }}><path d="M3,17 Q3,4 17,3 Q16,16 3,17 Z" fill="#7cbf5e" stroke="#5a9a41" strokeWidth="1" /><path d="M6,14 Q11,9 15,6" fill="none" stroke="#5a9a41" strokeWidth="1" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

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

export default function D22_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const vals = initialAnswer.studentAnswer.values;
      if (Array.isArray(vals)) setPickedSet(new Set(vals));
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => NUMS[i] > THRESH);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: NUMS.map(String), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq2207" ref={fitRef}>
      <style>{`
        .pq2207{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2207 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq2207 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2207 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2207 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq2207 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:176px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2207 .pq-fit{position:relative;margin:0 auto;}
        .pq2207 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2207sun 3.6s ease-in-out infinite;}
        .pq2207 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:56px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2207 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2207 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;font-variant-numeric:tabular-nums;}

        .pq2207 .pq-arena{position:absolute;left:8px;right:8px;top:40px;bottom:10px;display:flex;align-items:flex-end;justify-content:center;gap:16px;z-index:3;}
        .pq2207 .pq-mascot{line-height:0;pointer-events:none;transform-origin:bottom center;animation:pq2207breath 3s ease-in-out infinite;}
        .pq2207 .pq-gate{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;}
        .pq2207 .pq-baskets{display:flex;gap:2px;}
        .pq2207 .pq-obj{line-height:0;}
        .pq2207 .pq-obj.idle{animation:pq2207bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2207 .pq-gate-badge{padding:1px 13px 2px;border-radius:999px;background:#fff;border:2px solid #2f6bab;color:#2f6bab;font-weight:900;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.16);}

        .pq2207 .pq-leaf{position:absolute;line-height:0;z-index:2;pointer-events:none;opacity:.9;}
        .pq2207 .pq-leaf.l1{left:32%;top:20px;animation:pq2207drift 5s ease-in-out infinite;}
        .pq2207 .pq-leaf.l2{left:62%;top:14px;animation:pq2207drift 6.2s ease-in-out .8s infinite;}
        .pq2207 .pq-cloud{position:absolute;z-index:1;pointer-events:none;width:40px;height:12px;border-radius:999px;background:rgba(255,255,255,.88);animation:pq2207cdrift 12s ease-in-out infinite;}
        .pq2207 .pq-cloud::before{content:'';position:absolute;left:6px;top:-6px;width:15px;height:11px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2207 .pq-cloud::after{content:'';position:absolute;left:20px;top:-4px;width:11px;height:9px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2207 .pq-cloud.c1{left:7%;top:14px;}
        .pq2207 .pq-flw{position:absolute;bottom:5px;z-index:2;line-height:0;pointer-events:none;transform-origin:50% 100%;animation:pq2207flsway 4s ease-in-out infinite;}
        .pq2207 .pq-flw.f1{left:9px;}
        .pq2207 .pq-flw.f2{right:11px;animation-delay:-2s;}
        .pq2207 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2207tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2207 .pq-spark.s2{animation-delay:-.6s;} .pq2207 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2207 .pq-cards{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:16px;}
        .pq2207 .pq-card{position:relative;min-width:104px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 14px;border-radius:16px;border:2.5px solid #dbe2ec;background:#fff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,110,150,.12);font-family:inherit;}
        .pq2207 .pq-card:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,110,150,.2);}
        .pq2207 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2207 .pq-card:disabled{cursor:default;}
        .pq2207 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2207 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2207cele .55s ease;}
        .pq2207 .pq-card.dim{opacity:.44;filter:grayscale(.3);}
        .pq2207 .pq-apple{line-height:0;pointer-events:none;}
        .pq2207 .pq-num{font-size:34px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;line-height:1;}
        .pq2207 .pq-card.won .pq-num{color:#1a7f43;}
        .pq2207 .pq-cmp{display:flex;align-items:center;gap:5px;margin-top:2px;font-size:15px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;animation:pq2207pop .4s ease both;}
        .pq2207 .pq-cmp .g{line-height:0;}
        .pq2207 .pq-spark2{position:absolute;top:6px;right:9px;line-height:0;pointer-events:none;animation:pq2207tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2207 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2207in .22s ease both;}
        .pq2207 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2207 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2207sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2207breath{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
        @keyframes pq2207bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2207drift{0%,100%{transform:translate(0,0) rotate(-6deg);}50%{transform:translate(-10px,7px) rotate(9deg);}}
        @keyframes pq2207cdrift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq2207flsway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2207tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2207pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2207cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2207in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 380 * scale, height: 176 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <div className="pq-title">{t.title}</div>
        <span className="pq-cloud c1" />
        <span className="pq-leaf l1"><Leaf w={13} /></span>
        <span className="pq-leaf l2"><Leaf w={11} /></span>
        <span className="pq-flw f1"><Flower /></span>
        <span className="pq-flw f2"><Flower c="#f2a13c" /></span>

        <div className="pq-arena">
          {/* Bog' qorovuli — timsoh (dekor, ambient nafas) */}
          <span className="pq-mascot"><CrocMascot w={80} /></span>
          {/* 40 chegarasi = 4 o'nlik (4 savat). Avval O'NLIKLAR taqqoslanadi. */}
          <div className="pq-gate">
            <div className="pq-baskets">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="pq-obj idle" style={{ '--bd': `${i * 0.12}s` }}><Basket w={32} /></span>
              ))}
            </div>
            <span className="pq-gate-badge">{THRESH}</span>
          </div>
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '16%', top: '48px' }}>✦</span>
          <span className="pq-spark s2" style={{ left: '82%', top: '60px' }}>✦</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '36px' }}>✦</span>
        </>)}
      </div>
      </div>

      <div className="pq-cards">
        {NUMS.map((n, i) => {
          const good = n > THRESH;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
          return (
            <button key={i} type="button" className={'pq-card' + cls} disabled={lock} onClick={() => toggle(i)} aria-label={String(n)}>
              <span className="pq-apple"><Apple w={22} /></span>
              <span className="pq-num">{n}</span>
              {ok && good && (
                <span className="pq-cmp"><span>{n}</span><span className="g"><CrocGt w={38} /></span><span>{THRESH}</span></span>
              )}
              {ok && good && <span className="pq-spark2"><Star fill="#f2b134" /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
