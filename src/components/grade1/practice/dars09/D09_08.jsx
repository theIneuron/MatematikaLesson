// Dars09 · Amaliyot 08 — P10 Ko'p-tanlov «To'rtlik barglari» · 🔴 · tag: result_four_multi
// Hovuz sahnasida 5 nilufar-barg suzadi; har bargda misol yozilgan. Natijasi TO'RT bo'lgan
// BARCHASINI tanlash: {2+2, 5−1, 3+1, 1+3} — 4 ta, 5−2=3 TUZOQ. G'alabada to'g'ri barglar
// yashil porlaydi, har birida «= 4» pop, tuzoq-barg xira; qurbaqa sakrashga tayyor. Barglarga
// doimiy siljish berilmagan (qoida) — animatsiya faqat dekorda: qamishlar, ninachi, suv-halqalar,
// baliq, quyosh, bulutlar, kalit-doira breath.
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

const RES = 4;
// Sonlar qat'iy 0-5. Minus «−» = U+2212. Sonlar bilan «kichik − katta» yo'q (natija manfiy emas).
const EXPRS = [
  { a: 2, op: '+', b: 2 }, // 4 ✓
  { a: 5, op: '−', b: 1 }, // 4 ✓
  { a: 3, op: '+', b: 1 }, // 4 ✓
  { a: 5, op: '−', b: 2 }, // 3 ✗ tuzoq
  { a: 1, op: '+', b: 3 }, // 4 ✓
];
const val = (e) => (e.op === '+' ? e.a + e.b : e.a - e.b);
const GOOD = EXPRS.map((e, i) => (val(e) === RES ? i : -1)).filter((i) => i >= 0); // [0,1,2,4]
const DATA = { ptype: 'P10', level: '🔴', tag: 'result_four_multi' };
const T = {
  uz: {
    eyebrow: "Hovuz bo'yida · Barglar", title: 'To\'rtlik barglari',
    setup: "Suv ustidagi barglarda misollar yozilgan — qurbaqa faqat natijasi TO'RT bo'lgan barglarga sakraydi.",
    ask: "Natijasi TO'RT bo'ladigan BARCHA barglarni bosing.",
    correct: "Barakalla! To'rttala to'rtlik topildi — qurbaqa yo'li tayyor!",
    hint: "Har misolni barmoqda hisoblang: belgiga qarang — qo'shuvmi, ayiruvmi? Natijasi to'rt bo'lganlarinigina tanlang.",
  },
  ru: {
    eyebrow: 'У пруда · Листья', title: 'Листья четвёрки',
    setup: 'На листьях над водой написаны примеры — лягушка прыгает только на листья, где получается ЧЕТЫРЕ.',
    ask: 'Найди все листья с результатом ЧЕТЫРЕ.',
    correct: 'Молодец! Все четыре четвёрки найдены — путь лягушки готов!',
    hint: 'Посчитай каждый пример на пальцах: посмотри на знак — плюс или минус? Выбирай только те, где получается четыре.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const OPC = { '+': '#1a7f43', '−': '#c0392b' };

// NILUFAR-BARG: yumaloq yashil barg (2-3 ton), o'ng chetda suv-rangli o'yiq (kanon nilufar tirqishi),
// markaziy tomirlar, ustida ochroq plaka — unda misol yozuvi (belgisi rangli: qo'shuv yashil, ayiruv qizil).
// G'alabada plaka tepaga suriladi va pastida «= 4» pop bo'ladi.
const Pad = ({ e, ans }) => (
  <svg viewBox="0 0 82 70" width="82" height="70" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="41" cy="59" rx="34" ry="7" fill="#2f7d92" opacity=".28" />
    <ellipse cx="41" cy="34" rx="35" ry="29" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.8" />
    <ellipse cx="38" cy="30" rx="27" ry="20" fill="#68bd60" opacity=".5" />
    <path d="M41 34 L70 25 L70 43 Z" fill="#4a9cb5" />
    <path d="M41 34 L41 7 M41 34 L16 21 M41 34 L16 48 M41 34 L41 61 M41 34 L20 34" stroke="#3c7d36" strokeWidth="1.1" opacity=".42" fill="none" strokeLinecap="round" />
    <ellipse cx="39" cy="27" rx="23" ry="12.5" fill="#eef7e6" stroke="#bcd9a8" strokeWidth="1.2" opacity=".96" />
    <text x="39" y={ans ? 26 : 32} textAnchor="middle" fontSize="15.5" fontWeight="900" fontFamily="inherit">
      <tspan fill="#2e5a27">{e.a} </tspan>
      <tspan fill={OPC[e.op]}>{e.op}</tspan>
      <tspan fill="#2e5a27"> {e.b}</tspan>
    </text>
    {ans && <text className="pq-apop" x="39" y="47" textAnchor="middle" fontSize="14.5" fontWeight="900" fill="#1a7f43" fontFamily="inherit">= {RES}</text>}
  </svg>
);

// QURBAQA KANONI (D09_06): o'tirgan poza, yashil 2-3 ton (tana #57a84f, qorin #a8d89e, kontur #2e6e28),
// tepada ikki bo'rtiq blikli pirpiratuvchi ko'z, keng tabassum, tomoq-puls; nilufar bargida o'tiribdi.
const Frog = () => (
  <svg viewBox="0 0 64 60" width="50" height="47" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="32" cy="53" rx="26" ry="6.5" fill="#4f9a48" stroke="#3c7d36" strokeWidth="1.4" />
    <ellipse cx="25" cy="51.5" rx="12" ry="2.8" fill="#68bd60" opacity=".55" />
    <path d="M12 46 Q6 38 11 31 Q16 26 19 33 Q21 41 16 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M52 46 Q58 38 53 31 Q48 26 45 33 Q43 41 48 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 47 L7 49.5 M14.5 48 L10.5 51" stroke="#2e6e28" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M52 47 L57 49.5 M49.5 48 L53.5 51" stroke="#2e6e28" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="32" cy="34" rx="18" ry="14.5" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <ellipse className="pq-throat" cx="32" cy="40" rx="11.5" ry="7.5" fill="#a8d89e" />
    <circle cx="23" cy="15" r="7.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.5" />
    <circle cx="41" cy="15" r="7.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.5" />
    <circle cx="23" cy="15" r="5" fill="#fff" />
    <circle cx="41" cy="15" r="5" fill="#fff" />
    <circle cx="24" cy="16" r="2.2" fill="#1f2430" /><circle cx="24.9" cy="15.2" r="0.8" fill="#fff" />
    <circle cx="40" cy="16" r="2.2" fill="#1f2430" /><circle cx="40.9" cy="15.2" r="0.8" fill="#fff" />
    <g className="pq-blink"><circle cx="23" cy="15" r="5.3" fill="#57a84f" /><circle cx="41" cy="15" r="5.3" fill="#57a84f" /></g>
    <path d="M22 29 Q32 36 42 29" stroke="#2e6e28" strokeWidth="1.9" fill="none" strokeLinecap="round" />
    <path d="M25 45.5 L25 51 M39 45.5 L39 51" stroke="#3f8a39" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M25 51 L21 53 M25 51 L28.5 53.4 M39 51 L35.5 53.4 M39 51 L43 53" stroke="#2e6e28" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// NINACHI (D09_06): kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish traektoriyasi CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse className="pq-dwing" cx="18" cy="8" rx="12" ry="4" fill="#cfe9fb" transform="rotate(-18 18 8)" />
    <ellipse className="pq-dwing w2" cx="26" cy="8" rx="12" ry="4" fill="#dff1fd" transform="rotate(14 26 8)" />
    <ellipse className="pq-dwing w3" cx="18" cy="19" rx="11" ry="3.6" fill="#cfe9fb" transform="rotate(16 18 19)" />
    <ellipse className="pq-dwing w4" cx="26" cy="19" rx="11" ry="3.6" fill="#dff1fd" transform="rotate(-12 26 19)" />
    <path d="M33 13.5 L9 13.5" stroke="#4f8fc4" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 13.5 L13 13.5" stroke="#33648f" strokeWidth="1" opacity=".5" />
    <circle cx="36" cy="13.5" r="3.6" fill="#4f8fc4" stroke="#33648f" strokeWidth="1.2" />
    <circle cx="37.6" cy="12.2" r="1" fill="#1f2430" />
  </svg>
);

// QAMISH (D09_06): 2 poya + qo'ng'ir boshoq, pastdan sway; yonida o't-tuflar.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="32" height="59" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <g className="pq-reed" style={{ '--rd': '0s' }}>
      <path d="M10 74 Q9 40 12 18" stroke="#3c7d36" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="12.5" cy="13" rx="3.4" ry="8" fill="#8a5f3a" stroke="#6d4526" strokeWidth="1" />
    </g>
    <g className="pq-reed" style={{ '--rd': '-1.3s' }}>
      <path d="M25 74 Q25 46 21 27" stroke="#4f9a48" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="20.5" cy="22.5" rx="3" ry="7" fill="#9a6b40" stroke="#6d4526" strokeWidth="1" />
    </g>
    <path d="M2 74 q3 -12 6 -1 M32 74 q3 -14 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
);

// Baliq — lip etib sakrash (dekor, sanalmaydi).
const Fish = () => (
  <svg viewBox="0 0 34 20" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

// Nilufar guli — ochilgan pushti gul, mayda pad ustida (dekor).
const Lily = () => (
  <svg viewBox="0 0 42 34" width="34" height="27" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="21" cy="26" rx="18" ry="6" fill="#4f9a48" opacity=".8" />
    <path d="M21 25 L34 30 L37 28 Z" fill="#3c7d36" opacity=".7" />
    <ellipse cx="21" cy="15" rx="4" ry="10" fill="#f2acc8" stroke="#d67ba0" strokeWidth="1" />
    <ellipse cx="21" cy="15" rx="10" ry="4" fill="#f6b8d0" stroke="#d67ba0" strokeWidth="1" />
    <ellipse cx="21" cy="15" rx="7.5" ry="7.5" fill="#f7c3d8" opacity=".85" transform="rotate(45 21 15)" />
    <ellipse cx="21" cy="15" rx="7.5" ry="7.5" fill="#f7c3d8" opacity=".85" transform="rotate(-45 21 15)" />
    <circle cx="21" cy="15" r="3.6" fill="#f4d35e" stroke="#d8a93b" strokeWidth="1" />
  </svg>
);

// «4» kalit-doira: oltin, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const Key = () => (
  <svg viewBox="0 0 44 44" width="46" height="46" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="22" cy="22" r="19" fill="#f2b134" stroke="#c08517" strokeWidth="2" />
    <circle cx="15.5" cy="14.5" r="6" fill="#f8d47f" opacity=".9" />
    <text x="22" y="30" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">{RES}</text>
    <polygon className="pq-glint" points="32.5,7.5 33.7,11 37.2,12.2 33.7,13.4 32.5,16.9 31.3,13.4 27.8,12.2 31.3,11" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Barglar joyi (sahna px, wrapper top-left). 82x70 barg — o'zaro ustma-ust tushmaydi.
const POS = [
  { x: 16, top: 60 },
  { x: 270, top: 52 },
  { x: 145, top: 100 },
  { x: 42, top: 162 },
  { x: 256, top: 162 },
];

export default function D09_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda barglar kirish-animatsiyasi (drop-in) qayta ijro etilmaydi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => val(EXPRS[i]) === RES);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: EXPRS.map((e) => `${e.a} ${e.op} ${e.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq0908" ref={fitRef}>
      <style>{`
        .pq0908{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0908 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq0908 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0908 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0908 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0908 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:244px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#dff2fb 18%,#bfe6ee 30%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq0908 .pq-fit{position:relative;margin:0 auto;}
        .pq0908 .pq-sun{position:absolute;top:10px;left:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0908 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0908 .pq-cloud.c1{top:16px;left:-70px;animation-duration:31s;animation-delay:-12s;}
        .pq0908 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:39s;animation-delay:-26s;}
        .pq0908 .pq-water{position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq0908 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.6);}
        .pq0908 .pq-shore{position:absolute;bottom:0;width:66px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq0908 .pq-shore.l{left:0;border-radius:0 24px 0 0;}
        .pq0908 .pq-shore.r{right:0;border-radius:24px 0 0 0;}
        .pq0908 .pq-reedw{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0908 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq0908 .pq-dflyw{position:absolute;left:118px;top:26px;line-height:0;z-index:3;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq0908 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq0908 .pq-dwing.w2{animation-delay:-.08s;} .pq0908 .pq-dwing.w3{animation-delay:-.14s;} .pq0908 .pq-dwing.w4{animation-delay:-.05s;}
        .pq0908 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq0908 .pq-ring.r2{animation-delay:-1.9s;}
        .pq0908 .pq-fishw{position:absolute;right:30px;bottom:34px;line-height:0;z-index:1;opacity:0;animation:pqFish 9.5s ease-in-out infinite;}
        .pq0908 .pq-lilyw{position:absolute;left:6px;top:120px;line-height:0;z-index:1;animation:pqBobF 3.2s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12));}
        .pq0908 .pq-frogw{position:absolute;left:150px;top:186px;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0908 .pq-bobf{display:block;position:relative;animation:pqBobF 2.6s ease-in-out infinite;}
        .pq0908 .pq-bobf.win{animation:pqBobF 2.6s ease-in-out infinite,pqCele .55s ease;}
        .pq0908 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0908 .pq-throat{transform-box:fill-box;transform-origin:50% 55%;animation:pqThroat 1.7s ease-in-out infinite;}
        .pq0908 .pq-keywrap{position:absolute;top:6px;left:50%;transform:translateX(-50%);line-height:0;z-index:4;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18));}
        .pq0908 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;}
        .pq0908 .pq-keybr.win{animation:pqCele .55s ease;}
        .pq0908 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.6s ease-in-out infinite;}
        .pq0908 .pq-pad{position:absolute;width:82px;height:70px;background:none;border:none;padding:0;cursor:pointer;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));transition:filter .14s,transform .14s;}
        .pq0908 .pq-pad:hover:not(:disabled){transform:translateY(-2px);}
        .pq0908 .pq-pad:active:not(:disabled){transform:scale(.95);}
        .pq0908 .pq-pad.sel{transform:translateY(-5px) scale(1.06);z-index:6;animation:pqSelAura 1.6s ease-in-out infinite;}
        .pq0908 .pq-pad.sel:hover:not(:disabled){transform:translateY(-7px) scale(1.06);}
        .pq0908 .pq-selbadge{position:absolute;top:-5px;right:-3px;width:23px;height:23px;border-radius:50%;background:#2563eb;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.28);z-index:8;animation:pqPop .28s cubic-bezier(.3,1.5,.5,1) both,pqBadgeGlow 1.6s ease-in-out infinite;}
        .pq0908 .pq-selspk{position:absolute;line-height:0;z-index:7;opacity:0;pointer-events:none;animation:pqSpk 1.4s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,240,170,.9));}
        .pq0908 .pq-selspk.s2{animation-delay:-.46s;} .pq0908 .pq-selspk.s3{animation-delay:-.93s;}
        .pq0908 .pq-selring{position:absolute;left:50%;top:52%;width:78px;height:64px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid rgba(255,245,190,.9);z-index:1;opacity:0;pointer-events:none;animation:pqSelRing 1.9s ease-out infinite;}
        .pq0908 .pq-pad.right{filter:drop-shadow(0 2px 2px rgba(0,0,0,.1)) drop-shadow(0 0 10px rgba(46,180,96,.85));animation:pqCele .55s ease;}
        .pq0908 .pq-pad.dim{opacity:.42;}
        .pq0908 .pq-pad:disabled{cursor:default;}
        .pq0908 .pq-padin{animation:pqPadIn .6s cubic-bezier(.3,1.3,.5,1) backwards;}
        .pq0908 .pq-scene.still .pq-padin{animation:none;}
        .pq0908 .pq-apop{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0908 .pq-cstar{position:absolute;line-height:0;animation:pqStarIn .5s cubic-bezier(.3,1.5,.5,1) both,pqTwinkle 1.7s ease-in-out .6s infinite;z-index:5;}
        .pq0908 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq0908 .pq-wstar.w2{animation-delay:-.5s;} .pq0908 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq0908 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0908 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0908 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(64px,12px) rotate(6deg);}50%{transform:translate(118px,-8px) rotate(-4deg);}75%{transform:translate(46px,26px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(-10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(-24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(-38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(-44px,18px) rotate(56deg);}}
        @keyframes pqBobF{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqPadIn{from{opacity:0;transform:translateY(-16px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.35);}to{opacity:1;transform:scale(1);}}
        @keyframes pqStarIn{from{opacity:0;transform:scale(.2) rotate(-40deg);}to{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqSelAura{0%,100%{filter:drop-shadow(0 4px 3px rgba(0,0,0,.22)) drop-shadow(0 0 5px rgba(255,255,255,.9)) drop-shadow(0 0 8px rgba(120,200,255,.45));}50%{filter:drop-shadow(0 5px 4px rgba(0,0,0,.24)) drop-shadow(0 0 9px rgba(255,255,255,1)) drop-shadow(0 0 18px rgba(140,215,255,.85));}}
        @keyframes pqBadgeGlow{0%,100%{box-shadow:0 2px 4px rgba(0,0,0,.28),0 0 0 0 rgba(37,99,235,.5);}50%{box-shadow:0 2px 4px rgba(0,0,0,.28),0 0 0 5px rgba(37,99,235,0);}}
        @keyframes pqSpk{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.15) rotate(60deg);}}
        @keyframes pqSelRing{0%{opacity:.75;transform:translate(-50%,-50%) scale(.55);}70%{opacity:.2;}100%{opacity:0;transform:translate(-50%,-50%) scale(1.5);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 244 * scale }}>
      <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-water" />
        <span className="pq-shore l" /><span className="pq-shore r" />
        <span className="pq-reedw" style={{ left: 3, bottom: 3 }}><Reeds /></span>
        <span className="pq-reedw" style={{ right: 3, bottom: 3 }}><Reeds flip /></span>
        <span className="pq-ring" style={{ left: 60, bottom: 30 }} />
        <span className="pq-ring r2" style={{ left: 210, bottom: 20 }} />
        <span className="pq-fishw"><Fish /></span>
        <span className="pq-lilyw"><Lily /></span>
        <span className="pq-dflyw"><Dragonfly /></span>

        {/* «4» kalit-doira — breath, g'alabada selebratsiya */}
        <span className="pq-keywrap"><span className={'pq-keybr' + (ok ? ' win' : '')}><Key /></span></span>

        {/* 5 nilufar-barg — bosiladigan tugmalar; sanaladigan barglar, siljish yo'q */}
        {EXPRS.map((e, i) => {
          const good = val(e) === RES;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
          return (
            <button key={i} type="button" className={'pq-pad pq-padin' + cls} disabled={lock}
              style={{ left: POS[i].x, top: POS[i].top, animationDelay: `${i * 0.1}s` }}
              onClick={() => toggle(i)} aria-label={`${e.a} ${e.op} ${e.b}`}>
              <Pad e={e} ans={!!(ok && good)} />
              {!ok && sel && (
                <>
                  <span className="pq-selring" />
                  <span className="pq-selbadge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span className="pq-selspk" style={{ left: 4, top: 2 }}><Star fill="#fff3b0" /></span>
                  <span className="pq-selspk s2" style={{ right: 6, top: 26 }}><Star fill="#bfe6ff" /></span>
                  <span className="pq-selspk s3" style={{ left: 20, top: 44 }}><Star fill="#fff3b0" /></span>
                </>
              )}
              {ok && good && (
                <span className="pq-cstar" style={{ left: 2, top: -4 }}><Star fill="#f2b134" /></span>
              )}
            </button>
          );
        })}

        {/* Kuzatuvchi qurbaqa — sakrashga tayyor (dekor); g'alabada selebratsiya */}
        <span className="pq-frogw">
          <span className={'pq-bobf' + (ok ? ' win' : '')}><Frog /></span>
        </span>

        {ok && (
          <>
            <span className="pq-wstar" style={{ left: '30%', top: '60px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '64%', top: '54px' }}><Star fill="#e59a2f" /></span>
            <span className="pq-wstar w3" style={{ left: '50%', top: '150px' }}><Star fill="#f2b134" /></span>
          </>
        )}
      </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
