// Dars22 · Amaliyot 08 — Qaysi katta? «Olma bog'i» · timsoh · tag: compare_units
// Bitta-tanlov SON: 45 va 48 — qaysi katta? O'nliklar TENG (ikkovida 4 o'nlik), shuning uchun
// birliklarni solishtirish kerak: 8 > 5 -> 48 katta. To'g'ri javob 48. Variantlar [48, 45, "teng"]
// son/soz tugmalari. "teng" — M2 yanglish tuzoq (o'nliklar teng => teng deb o'ylash).
// SAVAT = bitta o'nlik (10 olma bir joyda, "10" nishoni); yakka olma = bitta birlik. O'nliklar
// QO'SHILADI: 45 = 4 savat + 5 olma, 48 = 4 savat + 8 olma. Katta son yutguncha timsoh og'zi
// hech qayoqqa ochilmaydi (javob sizmaydi) — slotda "?" turadi. G'alabada timsoh og'zini KATTA
// songa (o'ngdagi 48) ochadi + "48 > 45" chizig'i chiqadi. VEDI-DO-VERNOGO: noto'g'rida qulf yo'q,
// retry yo'q; setChecked FAQAT to'g'rida. Savol matni ANIQ: "Ikkita son bor: 45 va 48" + qaysi katta.
// "=" (teng) — M2 tuzoq-variant, hech qachon to'g'ri emas; timsoh FAQAT to'g'ri javobda (og'iz KATTA
// songa) ko'rinadi. Teng bo'lganda tinch/tekis og'iz (CrocCalm) — hech tomonga ochilmaydi.
// Ambient boyitish: bulutlar + hilpiragan gullar + barglar (dekor, pointer-events YO'Q).
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

const LEFT = 45, RIGHT = 48;               // taqqoslanadigan ikki xonali sonlar (21-100)
const LT = 4, LU = 5;                       // 45 = 4 o'nlik + 5 birlik
const RT = 4, RU = 8;                       // 48 = 4 o'nlik + 8 birlik (o'nliklar TENG: 4 = 4)
const OPTIONS = ["big", "small", "equal"];  // barqaror kalitlar; yorliq per-lang
const ANS = "big";                          // 48 katta (o'ng)
const BIG_SIDE = "right";                   // katta son o'ngda -> timsoh og'zi o'ngga
const GROUPS = [
  { n: LEFT, tens: LT, units: LU, side: "left" },
  { n: RIGHT, tens: RT, units: RU, side: "right" },
];
const DATA = {
  left: LEFT, right: RIGHT, options: OPTIONS, ans: ANS, big: RIGHT, small: LEFT,
  level: "🔴", tag: "compare_units", ptype: "COMPARE_PICK",
};

const T = {
  uz: {
    eyebrow: "Olma bog'i · Taqqoslash", title: "Qaysi katta?",
    setup: "Ikkita son bor: 45 va 48.",
    ask: "Qaysi son katta?",
    equal: "teng",
    tens: "O'nliklar", units: "birliklar",
    correct: "Barakalla! O'nliklar teng, 8 birlik 5 birlikdan ko'p. 48 > 45.",
    hint: "O'nliklar teng — birliklarni solishtiring: 8 > 5.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Сравнение", title: "Что больше?",
    setup: "Есть два числа: 45 и 48.",
    ask: "Какое число больше?",
    equal: "равно",
    tens: "Десятки", units: "единицы",
    correct: "Молодец! Десятки равны, 8 единиц больше 5. 48 > 45.",
    hint: "Десятки равны — сравни единицы: 8 > 5.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

let __gid = 0;

// YAKKA OLMA (bitta birlik) — D21 kanoni: yumaloq tana radial 2-ton, bandak, barg, oq blik.
const Apple = ({ w = 13 }) => {
  const id = "pq2208a" + (__gid++);
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

// SAVAT (bitta o'nlik = 10 olma) — D21 kanoni: to'qima savat, olmalar mo'ralaydi, yashil "10" nishoni.
const Basket = ({ w = 22 }) => {
  const id = "pq2208b" + (__gid++);
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

// TIMSOH (Dars04 kanoni). Och timsoh og'zini KATTA songa ochadi. gt: bosh o'ngda, og'iz chapga.
// lt = ko'zgu (og'iz o'ngga). eq = tinch timsoh, og'iz yopiq. gid — noyob gradient.
const CrocDefs = ({ gid }) => (
  <defs>
    <linearGradient id={gid + "G"} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7FD37F" /><stop offset="52%" stopColor="#52B95B" /><stop offset="100%" stopColor="#3C9A45" />
    </linearGradient>
    <linearGradient id={gid + "B"} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#E3F3C4" /><stop offset="100%" stopColor="#B6DE92" />
    </linearGradient>
  </defs>
);
const CrocOpen = ({ gid }) => (
  <g>
    <path d="M52 19 Q59 16 58 22 Q59 28 52 25 Q54 22 52 19 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1" />
    <path d="M37 14 Q56 12.5 55 23 Q54 34 37 29.5 Q41.5 22 37 14 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1.3" />
    <g fill="#3F9A42" opacity="0.85"><path d="M44 11.5 q1.6 -3 3.2 0 Z" /><path d="M49 12 q1.4 -2.6 2.8 0 Z" /></g>
    <path d="M43 29 q0.6 4.5 4.5 5 q-1.4 -2.5 -1 -4.6 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="0.9" />
    <path d="M40 17 Q22 8 6 9 Q2 9 3 12.5 Q22 16 40 21.5 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M40 27 Q22 36 6 35 Q2 35 3 31.5 Q22 28 40 22.5 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M7 33 Q22 33.4 38 27.6 Q23 31 8.5 31 Z" fill={`url(#${gid}B)`} opacity="0.9" />
    <g fill="#FFFFFF" stroke="#CFE3CF" strokeWidth="0.3">
      <path d="M8 13.4 L11 13.4 L9.5 16.6 Z" /><path d="M15 15.2 L18 15.2 L16.5 18.4 Z" /><path d="M22 17 L25 17 L23.5 20.2 Z" /><path d="M29 18.7 L32 18.7 L30.5 21.6 Z" />
    </g>
    <g fill="#FFFFFF" stroke="#CFE3CF" strokeWidth="0.3">
      <path d="M8 30.6 L11 30.6 L9.5 27.4 Z" /><path d="M15 28.8 L18 28.8 L16.5 25.6 Z" /><path d="M22 27 L25 27 L23.5 23.8 Z" /><path d="M29 25.3 L32 25.3 L30.5 22.4 Z" />
    </g>
    <ellipse cx="6.5" cy="10.6" rx="0.9" ry="0.7" fill="#2E7D32" /><ellipse cx="9" cy="11.1" rx="0.9" ry="0.7" fill="#2E7D32" />
    <g>
      <circle cx="49" cy="12.5" r="3.9" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1" />
      <circle cx="49" cy="12.1" r="2" fill="#FFFFFF" /><circle cx="49.5" cy="12.1" r="1" fill="#23303A" /><circle cx="49.9" cy="11.5" r="0.4" fill="#fff" />
      <circle cx="42" cy="11.2" r="4.6" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1" />
      <circle cx="42" cy="10.7" r="2.4" fill="#FFFFFF" /><circle cx="42.7" cy="10.7" r="1.2" fill="#23303A" /><circle cx="43.2" cy="10" r="0.5" fill="#fff" />
    </g>
  </g>
);
const CrocCalm = ({ gid }) => (
  <g>
    <path d="M5 19 Q-1 16 0 22 Q-1 28 5 25 Q3 22 5 19 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1" />
    <path d="M9 15 Q5 15 5 22 Q5 29 9 29 L48 29 Q55 28 55 22 Q55 16 48 15 Z" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1.3" />
    <path d="M10 27 Q28 28 48 27 Q28 30.5 10 29 Z" fill={`url(#${gid}B)`} opacity="0.85" />
    <g fill="#3F9A42" opacity="0.85"><path d="M16 14 q1.5 -2.6 3 0 Z" /><path d="M22 14 q1.5 -2.6 3 0 Z" /></g>
    <rect x="14" y="20" width="30" height="2.6" rx="1.3" fill="#2E7D32" />
    <rect x="14" y="24.4" width="30" height="2.6" rx="1.3" fill="#2E7D32" />
    <ellipse cx="50" cy="20.5" rx="0.9" ry="0.7" fill="#2E7D32" /><ellipse cx="50" cy="23.5" rx="0.9" ry="0.7" fill="#2E7D32" />
    <g>
      <circle cx="41" cy="12.5" r="3.8" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1" />
      <circle cx="41" cy="12.1" r="1.9" fill="#FFFFFF" /><circle cx="41" cy="12.1" r="0.95" fill="#23303A" />
      <circle cx="47.5" cy="13" r="3.4" fill={`url(#${gid}G)`} stroke="#3F9A42" strokeWidth="1" />
      <circle cx="47.5" cy="12.6" r="1.7" fill="#FFFFFF" /><circle cx="47.5" cy="12.6" r="0.85" fill="#23303A" />
    </g>
  </g>
);
// dir: 'gt' og'iz chapga | 'lt' og'iz o'ngga (ko'zgu) | 'eq' yopiq
const CrocSign = ({ dir, gid, size = 62 }) => (
  <svg viewBox="0 0 60 44" width={size} height={size * 44 / 60} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
    <CrocDefs gid={gid} />
    {dir === "eq"
      ? <CrocCalm gid={gid} />
      : dir === "lt"
        ? <g transform="translate(60,0) scale(-1,1)"><CrocOpen gid={gid} /></g>
        : <CrocOpen gid={gid} />}
  </svg>
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

let __uid = 0;

export default function D22_08(props) {
  const { lang = "uz", mode = "answer", initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === "review";
  const [picked, setPicked] = useState(null);      // "big" | "small" | "equal"
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda g'alaba-reveal (timsoh / chip) qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;
  const uidRef = useRef(null);
  if (uidRef.current === null) uidRef.current = ++__uid;
  const gid = "pq2208c" + uidRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === "boolean") { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const optLabel = useCallback((k) => (k === "big" ? String(RIGHT) : k === "small" ? String(LEFT) : t.equal), [t]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === ANS;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(optLabel), studentAnswer: { value: picked }, correctAnswer: { value: ANS }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t, optLabel]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;
  const idle = !ok && !still;                        // g'alabagacha yengil tebranish (dekor, bosiladigan EMAS)
  const ansDir = BIG_SIDE === "left" ? "gt" : "lt";  // timsoh og'zi katta son tomonga
  const [fitRef, scale] = useFitScale(392);

  return (
    <div className="pq pq2208" ref={fitRef}>
      <style>{`
        .pq2208{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2208 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq2208 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2208 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2208 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq2208 .pq-scene{box-sizing:border-box;position:relative;width:392px;height:274px;border-radius:20px;background:linear-gradient(#cfeafc 0%,#e4f4d9 52%,#d3edb6 100%);border:2px solid #bfe0a8;overflow:hidden;}
        .pq2208 .pq-fit{position:relative;margin:0 auto;}
        .pq2208 .pq-sun{position:absolute;right:20px;top:14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 5px rgba(249,198,47,.5);z-index:1;pointer-events:none;animation:pq2208sun 3.6s ease-in-out infinite;}
        .pq2208 .pq-hill{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#bfe39a,#a7d47f);border-top:3px solid #8fc267;z-index:1;pointer-events:none;}
        .pq2208 .pq-hill::before{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 10px,transparent 10px 22px);}
        .pq2208 .pq-leaf{position:absolute;z-index:1;color:#7fbf5a;opacity:.7;line-height:0;pointer-events:none;animation:pq2208leaf 5.5s ease-in-out infinite;}
        .pq2208 .pq-leaf.l2{animation-delay:-2.4s;color:#a7d47f;} .pq2208 .pq-leaf.l3{animation-delay:-4s;color:#8fc267;}
        .pq2208 .pq-cloud{position:absolute;z-index:1;pointer-events:none;width:42px;height:13px;border-radius:999px;background:rgba(255,255,255,.88);animation:pq2208drift 12s ease-in-out infinite;}
        .pq2208 .pq-cloud::before{content:'';position:absolute;left:7px;top:-7px;width:16px;height:12px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2208 .pq-cloud::after{content:'';position:absolute;left:21px;top:-5px;width:12px;height:9px;border-radius:50%;background:rgba(255,255,255,.88);}
        .pq2208 .pq-cloud.c1{left:7%;top:15px;}
        .pq2208 .pq-cloud.c2{left:64%;top:30px;width:28px;animation-delay:-6s;}
        .pq2208 .pq-flw{position:absolute;bottom:5px;z-index:2;line-height:0;pointer-events:none;transform-origin:50% 100%;animation:pq2208flsway 4s ease-in-out infinite;}
        .pq2208 .pq-flw.f1{left:9px;}
        .pq2208 .pq-flw.f2{left:30px;bottom:9px;animation-delay:-1.4s;}
        .pq2208 .pq-flw.f3{right:11px;animation-delay:-2.2s;}
        .pq2208 .pq-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;padding:4px 15px 5px;border-radius:9px;background:linear-gradient(#4c9d55,#3a7f42);border:2.5px solid #2c6633;color:#f0fbef;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);pointer-events:none;}

        .pq2208 .pq-arena{position:absolute;left:8px;right:8px;top:44px;bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px;z-index:3;}
        .pq2208 .pq-num{position:relative;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:6px;width:132px;}
        .pq2208 .pq-tile{min-width:74px;height:52px;padding:0 12px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#2f6bab;background:#fff;border:2.5px solid #b8d0ea;border-radius:14px;font-variant-numeric:tabular-nums;box-shadow:0 3px 6px rgba(0,0,0,.1);transition:.2s;}
        .pq2208 .pq-tile.win{color:#1a7f43;border-color:#1a7f43;background:#e8f7ee;box-shadow:0 0 0 3px rgba(26,127,67,.22),0 3px 6px rgba(0,0,0,.1);}
        .pq2208 .pq-models{display:flex;flex-direction:column;align-items:center;gap:4px;}
        .pq2208 .pq-baskets{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:100px;}
        .pq2208 .pq-apples{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;max-width:100px;min-height:12px;}
        .pq2208 .pq-obj{line-height:0;}
        .pq2208 .pq-obj.idle{animation:pq2208bob 2.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2208 .pq-badge{margin-top:1px;padding:1px 10px;border-radius:999px;background:#fff;border:2px solid #c9a25a;color:#a9791f;font-weight:900;font-size:12px;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(0,0,0,.14);animation:pq2208pop .38s ease both;}
        .pq2208 .pq-badge.big{border-color:#1a7f43;color:#1a7f43;}

        .pq2208 .pq-slot{position:relative;flex:0 0 auto;width:66px;height:66px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:#fff;border:2.5px dashed #cbb68a;box-shadow:inset 0 2px 5px rgba(120,90,40,.12);}
        .pq2208 .pq-slot.win{border-style:solid;border-color:#3C9A45;background:#f0faec;box-shadow:0 0 0 3px rgba(60,154,69,.18);}
        .pq2208 .pq-q{font-size:34px;font-weight:900;color:#c9a25a;}
        .pq2208 .pq-crocwrap{line-height:0;animation:pq2208croc .5s cubic-bezier(.2,1.4,.5,1) both;}

        .pq2208 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2208tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2208 .pq-spark.s2{animation-delay:-.6s;} .pq2208 .pq-spark.s3{animation-delay:-1.15s;}

        .pq2208 .pq-scene.still .pq-crocwrap,.pq2208 .pq-scene.still .pq-tile.win,.pq2208 .pq-scene.still .pq-badge,.pq2208 .pq-scene.still .pq-spark{animation:none;}
        .pq2208 .pq-scene.still .pq-spark{opacity:.9;}

        .pq2208 .pq-cmp{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:14px;animation:pq2208in .3s ease both;font-variant-numeric:tabular-nums;}
        .pq2208 .pq-cmp b{min-width:64px;height:46px;padding:0 10px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border-radius:12px;background:#eef4fb;border:2px solid #b8d0ea;color:#2f6bab;}
        .pq2208 .pq-cmp b.win{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq2208 .pq-gt{font-size:28px;font-weight:900;color:#1a7f43;}
        .pq2208 .pq-note{text-align:center;margin-top:6px;font-size:13px;font-weight:800;color:#5c7fa6;font-variant-numeric:tabular-nums;animation:pq2208in .3s .1s both;}

        .pq2208 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap;}
        .pq2208 .pq-opt{min-width:100px;height:72px;padding:0 14px;font-size:28px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2208 .pq-opt:hover:not(:disabled){border-color:#94b8e2;transform:translateY(-2px);}
        .pq2208 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq2208 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq2208 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pq2208cele .5s ease;}
        .pq2208 .pq-opt:disabled{cursor:default;}
        .pq2208 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2208in .22s ease both;}
        .pq2208 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2208 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2208bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq2208sun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pq2208drift{0%,100%{transform:translateX(0);}50%{transform:translateX(14px);}}
        @keyframes pq2208flsway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pq2208leaf{0%{transform:translate(0,0) rotate(0);}50%{transform:translate(-10px,8px) rotate(24deg);}100%{transform:translate(0,0) rotate(0);}}
        @keyframes pq2208pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2208croc{0%{opacity:0;transform:scale(.3) rotate(-8deg);}60%{opacity:1;transform:scale(1.12) rotate(3deg);}100%{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pq2208tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2208cele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2208in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 392 * scale, height: 274 * scale }}>
      <div className={"pq-scene" + (still ? " still" : "")} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-hill" />
        <span className="pq-leaf" style={{ left: "14%", top: "60px" }} aria-hidden="true">&#10087;</span>
        <span className="pq-leaf l2" style={{ left: "70%", top: "48px" }} aria-hidden="true">&#10087;</span>
        <span className="pq-leaf l3" style={{ left: "44%", top: "72px" }} aria-hidden="true">&#10087;</span>
        <span className="pq-cloud c1" />
        <span className="pq-cloud c2" />
        <span className="pq-flw f1"><Flower /></span>
        <span className="pq-flw f2"><Flower c="#8f7ae0" /></span>
        <span className="pq-flw f3"><Flower c="#f2a13c" /></span>
        <div className="pq-title">{t.title}</div>

        <div className="pq-arena">
          {/* CHAP son (45) */}
          {(() => {
            const g = GROUPS[0]; const win = ok && g.side === BIG_SIDE;
            const bs = Array.from({ length: g.tens }); const ap = Array.from({ length: g.units });
            return (
              <div className="pq-num">
                <div className={"pq-tile" + (win ? " win" : "")}>{g.n}</div>
                <div className="pq-models">
                  <div className="pq-baskets">
                    {bs.map((_, i) => (<span key={i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.1}s` }}><Basket w={22} /></span>))}
                  </div>
                  <div className="pq-apples">
                    {ap.map((_, i) => (<span key={i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(g.tens + i) * 0.1}s` }}><Apple w={13} /></span>))}
                  </div>
                  {ok && <span className={"pq-badge" + (win ? " big" : "")}>{g.units}</span>}
                </div>
              </div>
            );
          })()}

          {/* TIMSOH sloti — javob (qaysi katta) yechilguncha '?', g'alabada og'iz KATTA songa ochiladi */}
          <div className={"pq-slot" + (ok ? " win" : "")}>
            {ok ? (
              <span className="pq-crocwrap"><CrocSign dir={ansDir} gid={gid} size={62} /></span>
            ) : (
              <span className="pq-q">?</span>
            )}
          </div>

          {/* O'NG son (48) */}
          {(() => {
            const g = GROUPS[1]; const win = ok && g.side === BIG_SIDE;
            const bs = Array.from({ length: g.tens }); const ap = Array.from({ length: g.units });
            return (
              <div className="pq-num">
                <div className={"pq-tile" + (win ? " win" : "")}>{g.n}</div>
                <div className="pq-models">
                  <div className="pq-baskets">
                    {bs.map((_, i) => (<span key={i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${i * 0.1}s` }}><Basket w={22} /></span>))}
                  </div>
                  <div className="pq-apples">
                    {ap.map((_, i) => (<span key={i} className={"pq-obj" + (idle ? " idle" : "")} style={{ "--bd": `${(g.tens + i) * 0.1}s` }}><Apple w={13} /></span>))}
                  </div>
                  {ok && <span className={"pq-badge" + (win ? " big" : "")}>{g.units}</span>}
                </div>
              </div>
            );
          })()}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: "16%", top: "50px" }}>&#10022;</span>
          <span className="pq-spark s2" style={{ left: "82%", top: "62px" }}>&#10022;</span>
          <span className="pq-spark s3" style={{ left: "50%", top: "38px" }}>&#10022;</span>
        </>)}
      </div>
      </div>

      {ok && (<>
        <div className="pq-cmp">
          <b className="win">{RIGHT}</b>
          <span className="pq-gt">{'>'}</span>
          <b>{LEFT}</b>
        </div>
        <div className="pq-note">{t.tens}: {LT} {'='} {RT} &middot; {t.units}: {RU} {'>'} {LU}</div>
      </>)}

      <div className="pq-opts">
        {OPTIONS.map((k) => {
          const sel = picked === k; const right = ok && k === ANS;
          return <button key={k} type="button" className={"pq-opt" + (right ? " right" : sel ? " sel" : "")} disabled={lock} onClick={() => { setPicked(k); setFeedback(null); }}>{optLabel(k)}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? "ok" : "no"}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
