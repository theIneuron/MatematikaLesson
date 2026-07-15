// Dars12 · Amaliyot 07 — LOGIC «Kichikdan kattaga» tartiblash · 🔴 · timsoh · tag: logic_ordering
// Ko'lda 3 nilufar-barg (7, 3, 5 aralash). Bola ularni kichikdan kattaga ketma-ket bosadi
// (tanlangan tartib 1,2,3 raqamlanadi). To'g'ri tartib 3, 5, 7. G'alabada — 3 < 5 < 7 qatori,
// timsohlar orasida «<». Веди-до-верного, ozvuchkasiz.
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

const CARDS = [7, 3, 5];   // ko'lda ko'rinadigan aralash tartib
const SORTED = [3, 5, 7];  // to'g'ri tartib — kichikdan kattaga
const DATA = { ptype: 'LOGIC', level: '🔴', tag: 'logic_ordering' };
const T = {
  uz: {
    eyebrow: "Timsohlar ko'li · Tartiblash", title: "Kichikdan kattaga",
    setup: "Ko'lda uch barg: sonlar aralashib ketgan. Ularni tartibga solamiz!",
    ask: "Barglarni kichik sondan katta songa qarab, ketma-ket bosing.",
    correct: "Barakalla! Uch, besh, yetti — kichikdan kattaga to'g'ri tartib!",
    hint: "Avval eng kichik sonni toping va bosing, keyin undan kattasini, keyin eng kattasini.",
  },
  ru: {
    eyebrow: "Озеро крокодилов · Порядок", title: "От меньшего к большему",
    setup: "На озере три листа: числа перемешались. Наведём порядок!",
    ask: "Нажимай на листья по порядку — от меньшего числа к большему.",
    correct: "Молодец! Три, пять, семь — от меньшего к большему, верный порядок!",
    hint: "Сначала найди и нажми самое маленькое число, потом побольше, потом самое большое.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Nilufar barg (top-down): yashil disk, ochroq ichki halqalar, tepasida V-o'yiq (suv ko'rinadi),
// markazdan tarqaladigan tomirlar. Bosiladigan nishon — statik (siljimaydi), faqat mount kirishi.
const Lily = () => (
  <svg viewBox="0 0 104 92" width="98" height="86" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="52" cy="52" rx="49" ry="38" fill="#2e6e28" opacity=".22" />
    <ellipse cx="52" cy="48" rx="49" ry="38" fill="#4f9a48" stroke="#3c7d36" strokeWidth="2" />
    <ellipse cx="46" cy="40" rx="32" ry="22" fill="#5faa54" opacity=".6" />
    <ellipse cx="40" cy="33" rx="17" ry="10" fill="#7cc267" opacity=".5" />
    <path d="M52 10 L46 31 L58 31 Z" fill="#bfe3f0" />
    <g stroke="#3c7d36" strokeWidth="1.1" opacity=".34" fill="none" strokeLinecap="round">
      <path d="M52 48 L13 42" /><path d="M52 48 L25 19" /><path d="M52 48 L88 20" />
      <path d="M52 48 L92 46" /><path d="M52 48 L84 74" /><path d="M52 48 L52 84" /><path d="M52 48 L20 72" />
    </g>
  </svg>
);

// Timsoh kanoni (D04_10 dan): cho'zilgan yashil tana, tikanli scute-orqa, panjali oyoq,
// ochiq jag' (zigzag oq tishlar, pushti og'iz ichi), blikli ko'z. O'ngga qaraydi — og'iz
// KATTA son (o'ng) tomonga ochiladi = «<». chomp=true: jag' g'alabada qisilib-ochiladi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="132" height="72" aria-hidden="true" style={{ display: 'block' }}>
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
    <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
    <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
    <g className={chomp ? 'pq-jaws chomping' : 'pq-jaws'}>
      <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
      <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
      <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
    </g>
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
  </svg>
);

// Ninachi — 2 juft shaffof qanot (pirillaydi), ko'l ustida aylanma-suzadi.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse className="pq-dwing" cx="18" cy="8" rx="12" ry="4" fill="#cfe9fb" transform="rotate(-18 18 8)" />
    <ellipse className="pq-dwing w2" cx="26" cy="8" rx="12" ry="4" fill="#dff1fd" transform="rotate(14 26 8)" />
    <ellipse className="pq-dwing w3" cx="18" cy="19" rx="11" ry="3.6" fill="#cfe9fb" transform="rotate(16 18 19)" />
    <ellipse className="pq-dwing w4" cx="26" cy="19" rx="11" ry="3.6" fill="#dff1fd" transform="rotate(-12 26 19)" />
    <path d="M33 13.5 L9 13.5" stroke="#4f8fc4" strokeWidth="3" strokeLinecap="round" />
    <circle cx="36" cy="13.5" r="3.6" fill="#4f8fc4" stroke="#33648f" strokeWidth="1.2" />
    <circle cx="37.6" cy="12.2" r="1" fill="#1f2430" />
  </svg>
);

// Qamish — 2 poya + qo'ng'ir boshoq, pastdan sway.
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

// Baliq — lip etib sakraydi (dekor, sanalmaydi).
const Fish = () => (
  <svg viewBox="0 0 34 20" width="28" height="16" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D12_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [order, setOrder] = useState([]); // bosilgan qiymatlar, tanlash tartibida
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda barglar sakrab-kirishi qayta ijro etilmaydi — statik.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.order)) {
      setOrder(initialAnswer.studentAnswer.order);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(order.length === 3 && !checked); }, [order, checked, onReady]);

  const lock = isReview || checked;
  const pickCard = (v) => {
    if (lock) return;
    const wrongShown = feedback && !feedback.correct;
    setFeedback(null);
    setOrder((prev) => {
      if (wrongShown) return [v];               // noto'g'ridan keyin — boshdan
      const idx = prev.indexOf(v);
      if (idx !== -1) return prev.slice(0, idx); // tanlangan bargni bossa — o'shandan keyingisini bekor
      if (prev.length >= 3) return prev;
      return [...prev, v];
    });
  };

  const check = useCallback(() => {
    if (order.length !== 3) return;
    const correct = SORTED.every((v, i) => order[i] === v);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(String), studentAnswer: { order }, correctAnswer: { order: SORTED }, correct, meta: { ...DATA } });
  }, [order, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1207">
      <style>{`
        .pq1207{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1207 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1207 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1207 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1207 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1207 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq1207 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:218px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 42%,#d6eef5 58%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq1207 .pq-fit{position:relative;margin:0 auto;}
        .pq1207 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1207 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1207 .pq-cloud.c1{top:12px;left:-70px;animation-duration:31s;animation-delay:-9s;}
        .pq1207 .pq-cloud.c2{top:34px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:41s;animation-delay:-26s;}
        .pq1207 .pq-water{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq1207 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq1207 .pq-shore{position:absolute;bottom:0;width:70px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq1207 .pq-shore.l{left:0;border-radius:0 24px 0 0;}
        .pq1207 .pq-shore.r{right:0;border-radius:24px 0 0 0;}
        .pq1207 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1207 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqReedSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1207 .pq-dflyw{position:absolute;left:70px;top:20px;line-height:0;z-index:3;animation:pqDfly 14s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1207 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1207 .pq-dwing.w2{animation-delay:-.08s;} .pq1207 .pq-dwing.w3{animation-delay:-.14s;} .pq1207 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1207 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq1207 .pq-ring.r2{animation-delay:-1.9s;}
        .pq1207 .pq-fishw{position:absolute;right:52px;bottom:30px;line-height:0;z-index:2;opacity:0;animation:pqFish 9.5s ease-in-out infinite;}
        .pq1207 .pq-pads{position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center;align-items:flex-end;gap:6px;z-index:5;}
        .pq1207 .pq-card{position:relative;width:100px;height:106px;border:none;background:transparent;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .14s;}
        .pq1207 .pq-card:hover:not(:disabled) .pq-pad{transform:translateY(-4px) scale(1.04);}
        .pq1207 .pq-card:active:not(:disabled){transform:scale(.95);}
        .pq1207 .pq-card:disabled{cursor:default;}
        .pq1207 .pq-pad{display:block;line-height:0;filter:drop-shadow(0 3px 4px rgba(0,0,0,.24));transition:transform .16s;animation:pqPadIn .5s cubic-bezier(.3,1.3,.5,1) both;animation-delay:var(--pd,0s);}
        .pq1207 .pq-scene.still .pq-pad{animation:none;}
        .pq1207 .pq-numchip{position:absolute;top:50%;left:50%;transform:translate(-50%,-56%);width:46px;height:46px;border-radius:13px;background:#fff;border:3px solid #dfe7ee;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#2b3648;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(0,0,0,.2);transition:.15s;}
        .pq1207 .pq-card.sel .pq-numchip{border-color:#2563eb;color:#1d4ed8;background:#eef3fe;}
        .pq1207 .pq-card.win .pq-numchip{border-color:#1a7f43;color:#1a7f43;background:#e8f7ee;}
        .pq1207 .pq-card.win{animation:pqCele .5s ease;}
        .pq1207 .pq-seq{position:absolute;top:0;right:12px;min-width:22px;height:22px;padding:0 4px;border-radius:50%;background:#2563eb;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(37,99,235,.42);animation:pqPop .28s ease both;z-index:6;}
        .pq1207 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1207 .pq-wstar.w2{animation-delay:-.5s;} .pq1207 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq1207 .pq-result{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap;padding:11px 14px;border-radius:18px;background:linear-gradient(#e8f7ee,#d9efe1);border:2px solid #bfe6cd;animation:pqIn .3s ease both;}
        .pq1207 .pq-rcard{width:50px;height:50px;border-radius:13px;background:#fff;border:3px solid #1a7f43;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(26,127,67,.2);}
        .pq1207 .pq-rcroc{position:relative;line-height:0;flex-shrink:0;width:54px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq1207 .pq-rcroc svg{width:54px;height:auto;}
        .pq1207 .pq-rlt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);font-size:19px;font-weight:900;color:#1a7f43;}
        .pq1207 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq1207 .pq-jaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq1207 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqCrocSway 3.4s ease-in-out infinite;}
        .pq1207 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1207 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1207 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqReedSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqCrocSway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(64px,10px) rotate(6deg);}50%{transform:translate(120px,-8px) rotate(-4deg);}75%{transform:translate(48px,18px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(44px,18px) rotate(56deg);}}
        @keyframes pqPadIn{0%{opacity:0;transform:translateY(16px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 218 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-water" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-reedw" style={{ left: 3, bottom: 66 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 3, bottom: 60 }}><Reeds flip /></span>
          <span className="pq-ring" style={{ left: 58, bottom: 24 }} />
          <span className="pq-ring r2" style={{ left: 250, bottom: 38 }} />
          <span className="pq-fishw"><Fish /></span>
          <span className="pq-dflyw"><Dragonfly /></span>

          <div className="pq-pads">
            {CARDS.map((n, i) => {
              const seq = order.indexOf(n);
              const selected = seq !== -1;
              return (
                <button key={n} type="button"
                  className={'pq-card' + (ok ? ' win' : selected ? ' sel' : '')}
                  disabled={lock} onClick={() => pickCard(n)}>
                  <span className="pq-pad" style={{ '--pd': `${i * 0.12}s` }}><Lily /></span>
                  <span className="pq-numchip">{n}</span>
                  {selected && <b className="pq-seq">{seq + 1}</b>}
                </button>
              );
            })}
          </div>

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '18%', top: '30px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '78%', top: '44px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '50%', top: '22px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
        </div>

        {ok && (
          <div className="pq-result">
            {SORTED.map((v, i) => (
              <React.Fragment key={v}>
                <span className="pq-rcard">{v}</span>
                {i < SORTED.length - 1 && (
                  <span className="pq-rcroc"><b className="pq-rlt">&lt;</b><Croc chomp /></span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
