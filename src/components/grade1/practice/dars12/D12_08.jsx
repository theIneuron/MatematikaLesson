// Dars12 · Amaliyot 08 — P4 Ko'p-tanlov «To'g'ri yozuvlar» · 🔴 · timsoh · tag: true_statements_multi
// Timsohlar ko'li: 5 yog'och taxtacha, har birida taqqoslash yozuvi. Timsoh faqat TO'G'RI
// yozuvlarni tasdiqlaydi. To'g'rilari: {0,2,4} = 6>4, 7=7, 8>5. Yolg'onlar: 3>5, 2<1.
// Веди-до-верного, ozvuchkasiz. Belgilar: > U+003E, < U+003C, = U+003D. Sonlar 0-10.
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

// op: '>' | '<' | '=' (haqiqiy Unicode belgilar). isTrue — yozuv haqiqatan to'g'rimi.
const CARDS = [
  { a: 6, op: '>', b: 4 }, // to'g'ri  ✓
  { a: 3, op: '>', b: 5 }, // yolg'on  ✗
  { a: 7, op: '=', b: 7 }, // to'g'ri  ✓
  { a: 2, op: '<', b: 1 }, // yolg'on  ✗
  { a: 8, op: '>', b: 5 }, // to'g'ri  ✓
];
const isTrue = (c) => (c.op === '>' ? c.a > c.b : c.op === '<' ? c.a < c.b : c.a === c.b);
const GOOD = CARDS.map((c, i) => (isTrue(c) ? i : -1)).filter((i) => i >= 0); // [0,2,4]
const DATA = { ptype: 'P4', level: '🔴', tag: 'true_statements_multi' };
const T = {
  uz: {
    eyebrow: "Timsohlar ko'li · To'g'ri yozuvlar", title: "To'g'ri yozuvlar",
    setup: "Taxtachalarda yozuvlar bor — faqat to'g'rilarini timsoh tasdiqlaydi.",
    ask: "To'g'ri yozilgan BARCHA yozuvlarni bosing.",
    correct: "Barakalla! Uchala to'g'ri yozuv topildi!",
    hint: "Har yozuvni tekshiring: belgi to'g'ri turibdimi? Katta son tomonga ochiqmi?",
    tagTrue: "to'g'ri", board: "Timsohlar ko'li",
  },
  ru: {
    eyebrow: 'Озеро крокодилов · Верные записи', title: 'Верные записи',
    setup: 'На табличках записи — крокодил подтверждает только верные.',
    ask: 'Нажми на ВСЕ верно записанные записи.',
    correct: 'Молодец! Все три верные записи найдены!',
    hint: 'Проверь каждую запись: правильно ли стоит знак? Открыт ли он к большему числу?',
    tagTrue: 'верно', board: 'Озеро крокодилов',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TIMSOH KANONI (D04_10): cho'zilgan yashil tana (3 ton), tikanli scute-orqa, panjali oyoq,
// ochiq jag' (zigzag oq tishlar, pushti og'iz ichi), blikli ko'z (pirpiratadi), dum tebranadi.
// chomp=true — jag' qisilib-ochiladi (g'alabada). Timsoh o'ngga qaraydi (mascot).
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="132" height="72" aria-hidden="true" style={{ display: 'block' }}>
    {/* dum — kuchli egilgan, sekin tebranadi */}
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    {/* uzoq tomondagi oyoqlar (to'qroq) */}
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    {/* cho'zilgan tana */}
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    {/* orqa — to'q ton */}
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    {/* yon osteoderm-dog'lar */}
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    {/* qorin — och-sariq-yashil, ko'ndalang chiziqli */}
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* orqadagi scute-tikan qatorlari */}
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    {/* yaqin tomondagi oyoqlar — panjali */}
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    {/* bosh suyagi */}
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />
    {/* og'iz ichi — och-pushti */}
    <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
    {/* pastki jag' — zigzag tishlar */}
    <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
    {/* yuqori jag' — pqChomp shu guruhda */}
    <g className={chomp ? 'pq-jaws chomping' : 'pq-jaws'}>
      <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
      <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
      <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
    </g>
    {/* ko'z do'ngligi + tik qorachiqli ko'z (blik) + blink qopqog'i */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" />
  </svg>
);

// KANON BALIQ (D09_06) — dekor, ko'ldan lip etib sakraydi, sanalmaydi.
const Fish = () => (
  <svg viewBox="0 0 34 20" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

// QAMISH (D09_06): 2 poya + qo'ng'ir boshoq, pastdan sway.
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

// NINACHI (D09_06): tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="34" height="21" aria-hidden="true" style={{ display: 'block' }}>
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

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D12_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda taxtachalar kirish-animatsiyasi qayta ijro etilmaydi.
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => isTrue(CARDS[i]));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map((c) => `${c.a} ${c.op} ${c.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1208" ref={fitRef}>
      <style>{`
        .pq1208{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1208 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1208 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1208 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1208 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1208 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:176px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#dff2fb 22%,#bfe6ee 38%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq1208 .pq-fit{position:relative;margin:0 auto;}
        .pq1208 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1208 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1208 .pq-cloud.c1{top:14px;left:-70px;animation-duration:30s;animation-delay:-10s;}
        .pq1208 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:39s;animation-delay:-24s;}
        .pq1208 .pq-water{position:absolute;left:0;right:0;bottom:0;height:118px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq1208 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.6);}
        .pq1208 .pq-shore{position:absolute;bottom:0;width:70px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq1208 .pq-shore.l{left:0;border-radius:0 24px 0 0;}
        .pq1208 .pq-shore.r{right:0;border-radius:24px 0 0 0;}
        .pq1208 .pq-reedw{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1208 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1208 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:3;padding:5px 13px 6px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq1208 .pq-board::before,.pq1208 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:11px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq1208 .pq-board::before{left:15px;} .pq1208 .pq-board::after{right:15px;}
        .pq1208 .pq-dflyw{position:absolute;left:36px;top:44px;line-height:0;z-index:3;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1208 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1208 .pq-dwing.w2{animation-delay:-.08s;} .pq1208 .pq-dwing.w3{animation-delay:-.14s;} .pq1208 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1208 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq1208 .pq-ring.r2{animation-delay:-1.9s;}
        .pq1208 .pq-fishw{position:absolute;right:34px;bottom:30px;line-height:0;z-index:1;opacity:0;animation:pqFish 9.5s ease-in-out infinite;}
        .pq1208 .pq-crocw{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:2;line-height:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.22));}
        .pq1208 .pq-crocbox{display:inline-block;line-height:0;transform-origin:50% 80%;animation:pqCrocBreath 4s ease-in-out infinite;}
        .pq1208 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq1208 .pq-jaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq1208 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqCrocSway 3.4s ease-in-out infinite;}
        .pq1208 .pq-crocblink{opacity:0;animation:pqBlink 4.2s linear infinite;}
        .pq1208 .pq-think{position:absolute;left:54%;top:20px;z-index:4;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#fff;border:2px solid #bcd0dc;color:#2e7a3e;font-size:20px;font-weight:900;box-shadow:0 2px 5px rgba(0,0,0,.14);animation:pqBreath 2.2s ease-in-out infinite;}
        .pq1208 .pq-think::after{content:'';position:absolute;bottom:-7px;left:8px;width:8px;height:8px;border-radius:50%;background:#fff;border:2px solid #bcd0dc;}
        .pq1208 .pq-wstar{position:absolute;z-index:5;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1208 .pq-wstar.w2{animation-delay:-.5s;} .pq1208 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq1208 .pq-cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:16px;}
        .pq1208 .pq-card{position:relative;display:flex;align-items:center;justify-content:center;gap:7px;width:138px;padding:15px 10px 16px;border-radius:16px;background:linear-gradient(#c8975a,#a9793f);border:3px solid #8a6234;cursor:pointer;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);transition:transform .14s,box-shadow .14s,filter .14s;}
        .pq1208 .pq-card::before,.pq1208 .pq-card::after{content:'';position:absolute;top:7px;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.4);box-shadow:0 -1px 1px rgba(0,0,0,.25);}
        .pq1208 .pq-card::before{left:8px;} .pq1208 .pq-card::after{right:8px;}
        .pq1208 .pq-card:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 6px 12px rgba(0,0,0,.2);}
        .pq1208 .pq-card:active:not(:disabled){transform:scale(.96);}
        .pq1208 .pq-card:disabled{cursor:default;}
        .pq1208 .pq-card.sel{outline:3px solid #2563eb;outline-offset:2px;box-shadow:0 4px 10px rgba(37,99,235,.35);}
        .pq1208 .pq-card.right{background:linear-gradient(#8fce8a,#5fb56a);border-color:#2e7a3e;animation:pqCele .55s ease;}
        .pq1208 .pq-card.dim{opacity:.42;filter:grayscale(.5);}
        .pq1208 .pq-num{min-width:36px;height:42px;border-radius:10px;background:#fdf6e8;border:2px solid #e6d3ad;display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:900;color:#5a3d1a;font-variant-numeric:tabular-nums;box-shadow:inset 0 -2px 0 rgba(138,98,52,.18);}
        .pq1208 .pq-sign{width:44px;height:44px;border-radius:12px;background:#eef7e6;border:2px solid #cfe3c2;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;line-height:1;}
        .pq1208 .pq-sign.cmp{color:#2e7a3e;} .pq1208 .pq-sign.eq{color:#1f6feb;}
        .pq1208 .pq-card.right .pq-num{background:#f2fbef;border-color:#bfe3bd;}
        .pq1208 .pq-card.right .pq-sign{background:#fff;border-color:#bfe3bd;}
        .pq1208 .pq-cnt{position:absolute;top:-9px;right:-9px;min-width:20px;height:20px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.28);animation:pqPop .3s ease both;z-index:2;}
        .pq1208 .pq-tag{position:absolute;bottom:-11px;left:50%;transform:translateX(-50%);padding:2px 12px;border-radius:999px;background:#1a7f43;color:#fff;font-size:12px;font-weight:800;white-space:nowrap;box-shadow:0 2px 4px rgba(26,127,67,.3);animation:pqPop .32s ease both;}
        .pq1208 .pq-x{position:absolute;bottom:-11px;left:50%;transform:translateX(-50%);width:24px;height:24px;border-radius:50%;background:#b0392b;color:#fff;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.25);}
        .pq1208 .pq-cardin{animation:pqCardIn .5s cubic-bezier(.3,1.3,.5,1) backwards;}
        .pq1208 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:22px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1208 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1208 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(70px,-12px) rotate(6deg);}50%{transform:translate(128px,10px) rotate(-4deg);}75%{transform:translate(56px,26px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(-10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(-24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(-38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(-44px,18px) rotate(56deg);}}
        @keyframes pqCrocBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.03);}}
        @keyframes pqCrocSway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pqBlink{0%,90%{opacity:0;}93%,96%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqCardIn{from{opacity:0;transform:translateY(-14px) scale(.9);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 176 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-water" />
        <span className="pq-shore l" /><span className="pq-shore r" />
        <span className="pq-reedw" style={{ left: 3, bottom: 3 }}><Reeds /></span>
        <span className="pq-reedw" style={{ right: 3, bottom: 3 }}><Reeds flip /></span>
        <div className="pq-board">{t.board}</div>
        <span className="pq-ring" style={{ left: 70, bottom: 22 }} />
        <span className="pq-ring r2" style={{ left: 232, bottom: 30 }} />
        <span className="pq-fishw"><Fish /></span>
        <span className="pq-dflyw"><Dragonfly /></span>

        {/* Timsoh-mascot — ko'z pirpiraydi, dum tebranadi; g'alabada jag' chomp */}
        <span className="pq-crocw"><span className="pq-crocbox"><Croc chomp={!!ok} /></span></span>

        {/* «?» o'ylash pufagi — javobgacha breath-pulse, g'alabada yo'qoladi */}
        {!ok && <span className="pq-think">?</span>}

        {ok && (
          <>
            <span className="pq-wstar" style={{ left: '30%', top: '40px' }}><Star fill="#f2b134" /></span>
            <span className="pq-wstar w2" style={{ left: '64%', top: '48px' }}><Star fill="#e59a2f" /></span>
            <span className="pq-wstar w3" style={{ left: '48%', top: '96px' }}><Star fill="#f2b134" /></span>
          </>
        )}
      </div>
      </div>

      <div className="pq-cards">
        {CARDS.map((c, i) => {
          const good = isTrue(c);
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : (sel ? ' sel' : '');
          return (
            <button key={i} type="button"
              className={'pq-card' + (still ? '' : ' pq-cardin') + cls}
              disabled={lock}
              style={still ? undefined : { animationDelay: `${i * 0.08}s` }}
              onClick={() => toggle(i)} aria-label={`${c.a} ${c.op} ${c.b}`}>
              <span className="pq-num">{c.a}</span>
              <span className={'pq-sign ' + (c.op === '=' ? 'eq' : 'cmp')}>{c.op}</span>
              <span className="pq-num">{c.b}</span>
              {ok && good && <b className="pq-cnt">{GOOD.indexOf(i) + 1}</b>}
              {ok && (good ? <span className="pq-tag">{t.tagTrue}</span> : <span className="pq-x">✗</span>)}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
