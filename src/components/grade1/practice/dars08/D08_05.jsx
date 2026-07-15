// Dars08 · Amaliyot 05 — P9 Noma'lum ayriluvchi (8 − ? = 5) · 🔴 · Buvi · tag: missing_subtrahend
// Hovli: savatda 5 tuxum + taxtacha «8 ta bor edi»; buvi kosasida olinganlar yashirin («?» breath) — g'alabada kosa ochilib 3 tuxum (badge 1..3), savatdagilarga badge 1..5, chip «8 − 3 = 5».
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

const DATA = { start: 8, left: 5, target: 3, options: [2, 3, 4], ptype: 'P9', level: '🔴', tag: 'missing_subtrahend' };
const T = {
  uz: {
    eyebrow: 'Qishloq hovlisi · Buvi', title: 'Nechtasi olindi?',
    setup: 'Savatda sakkizta tuxum bor edi. Buvi bir nechtasini olib quymoq pishirdi — savatda beshta qoldi.',
    ask: 'Buvi nechta tuxum olgan?',
    correct: 'Barakalla! Sakkizdan beshta qoldi — demak uchta olingan.',
    hint: 'Sakkizdan boshlang: beshta qolishi uchun nechtasi olinishi kerak? Barmoqlarda sanang.',
    sign: '8 ta bor edi',
  },
  ru: {
    eyebrow: 'Деревенский двор · Бабушка', title: 'Сколько взяли?',
    setup: 'В корзине было восемь яиц. Бабушка взяла несколько и пожарила яичницу — в корзине осталось пять.',
    ask: 'Сколько яиц взяла бабушка?',
    correct: 'Молодец! Из восьми осталось пять — значит, взяли три.',
    hint: 'Начни с восьми: сколько яиц нужно взять, чтобы осталось пять? Посчитай на пальцах.',
    sign: 'Было 8',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Tuxum kanoni: oq-krem oval 2-ton (asos + pastki soya) + blik. Bitta svg = bitta dona.
const Egg = ({ w = 20 }) => (
  <svg viewBox="0 0 22 28" width={w} height={Math.round(w * 28 / 22)} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M11 1.5 C16.8 1.5 20.5 9.2 20.5 16.8 C20.5 23.2 16.4 26.5 11 26.5 C5.6 26.5 1.5 23.2 1.5 16.8 C1.5 9.2 5.2 1.5 11 1.5 Z" fill="#f7f0dd" stroke="#c2b085" strokeWidth="1.4" />
    <path d="M4 20 Q11 25.6 18 20 Q15.5 24.8 11 24.8 Q6.5 24.8 4 20 Z" fill="#e7dcbd" opacity=".9" />
    <ellipse cx="7.6" cy="9.5" rx="2.4" ry="4" fill="#fff" opacity=".85" transform="rotate(-16 7.6 9.5)" />
  </svg>
);

// Bobo-buvi uyi: devor + qizg'ish tom + krest-romli deraza + eshik + mo'ri (tepasida tutun HTML-span).
const House = () => (
  <svg viewBox="0 0 92 104" width="84" height="95" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="60" y="9" width="10" height="22" rx="1.5" fill="#a05a3c" stroke="#7c4028" strokeWidth="1.4" />
    <rect x="10" y="42" width="72" height="58" fill="#f0e2c4" stroke="#cbb691" strokeWidth="1.6" />
    <path d="M2 44 L46 6 L90 44 Z" fill="#c0603f" stroke="#8f4028" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 40 L46 9 L82 40" stroke="#d97a55" strokeWidth="2.4" fill="none" opacity=".6" />
    <rect x="32" y="54" width="28" height="24" rx="2" fill="#cfe9f7" stroke="#8a6a45" strokeWidth="2.4" />
    <line x1="46" y1="55" x2="46" y2="77" stroke="#8a6a45" strokeWidth="2" />
    <line x1="33" y1="66" x2="59" y2="66" stroke="#8a6a45" strokeWidth="2" />
    <rect x="29" y="78" width="34" height="4" rx="2" fill="#b9926a" />
    <rect x="14" y="66" width="13" height="34" rx="1.5" fill="#96602c" stroke="#6e441c" strokeWidth="1.4" />
    <circle cx="24" cy="84" r="1.4" fill="#e0b878" />
  </svg>
);

// Kichik hovli daraxti (qatlamli toj + yorug'lik dog'lari, D03_04 uslubi).
const Tree = () => (
  <svg viewBox="0 0 96 120" width="88" height="110" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M45 118 L45 74 Q45 64 36 56 M53 118 L53 72 Q53 62 62 54" stroke="#7c4f24" strokeWidth="10" strokeLinecap="round" fill="none" />
    <circle cx="34" cy="46" r="26" fill="#4f9a48" />
    <circle cx="64" cy="38" r="27" fill="#5cae54" />
    <circle cx="50" cy="60" r="22" fill="#478b41" />
    <circle cx="46" cy="24" r="18" fill="#68bd60" />
    <circle cx="40" cy="18" r="8" fill="#83cf7a" opacity=".8" />
    <circle cx="70" cy="28" r="8" fill="#83cf7a" opacity=".7" />
    <circle cx="30" cy="38" r="6.5" fill="#6fc267" opacity=".7" />
  </svg>
);

// Yog'och stol-tokcha: ustki taxta + ikki oyoq.
const Table = () => (
  <svg viewBox="0 0 140 74" width="136" height="72" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="16" y="16" width="9" height="56" rx="2" fill="#a9713a" stroke="#7c4f24" strokeWidth="1.2" />
    <rect x="115" y="16" width="9" height="56" rx="2" fill="#a9713a" stroke="#7c4f24" strokeWidth="1.2" />
    <line x1="22" y1="52" x2="118" y2="52" stroke="#b9803f" strokeWidth="4" strokeLinecap="round" opacity=".8" />
    <rect x="2" y="4" width="136" height="13" rx="5" fill="#c58a4a" stroke="#96602c" strokeWidth="1.6" />
    <line x1="10" y1="8" x2="70" y2="8" stroke="#dba463" strokeWidth="2" strokeLinecap="round" opacity=".7" />
  </svg>
);

// To'qilgan savat: gardish + to'qima chiziqli tana. Tuxumlar HTML-span bo'lib gardish ORQASIDAN mo'ralaydi.
const Basket = () => (
  <svg viewBox="0 0 116 60" width="108" height="56" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M10 16 L106 16 L97 51 Q95 57 88 57 L28 57 Q21 57 19 51 Z" fill="#d19a5b" stroke="#96602c" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 28 Q58 34 102 28 M17 40 Q58 46 99 40" stroke="#b9803f" strokeWidth="2.4" fill="none" opacity=".8" />
    <path d="M30 18 L27 55 M52 18 L51 56 M74 18 L75 56 M96 18 L92 53" stroke="#b9803f" strokeWidth="1.6" fill="none" opacity=".5" />
    <rect x="6" y="9" width="104" height="11" rx="5.5" fill="#c08544" stroke="#96602c" strokeWidth="1.8" />
  </svg>
);

// Tovuq kanoni: yon ko'rinish, oq-krem 2-ton tana, qizil toj-soqolcha, sariq tumshuq/oyoq,
// blikli pirpiratuvchi ko'z, qanot-chizig'i; boshi don sari egiladi (pq-hh cho'qish).
const Hen = () => (
  <svg viewBox="0 0 72 54" width="64" height="48" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 22 Q2 14 8 5 Q13 12 18 15 Z" fill="#e4dbc6" stroke="#b9a67e" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M14 26 Q6 22 7 13 Q12 19 17 21 Z" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.2" strokeLinejoin="round" />
    <ellipse cx="30" cy="32" rx="19" ry="13" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.6" />
    <ellipse cx="32" cy="37" rx="12" ry="7" fill="#e4dbc6" />
    <path d="M22 26 Q34 20 42 28 Q36 37 26 36 Q21 32 22 26 Z" fill="#e4dbc6" stroke="#b9a67e" strokeWidth="1.2" />
    <path d="M25 28 Q33 25 39 29" stroke="#b9a67e" strokeWidth="1.2" fill="none" opacity=".7" />
    <g className="pq-hh">
      <path d="M46 20 Q48 14 52 10" stroke="#f6f1e4" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="53" cy="15" r="7.5" fill="#f6f1e4" stroke="#b9a67e" strokeWidth="1.5" />
      <path d="M49 8.5 Q50 4 53 7 Q54 3 57 6.5 Q59 4.5 59.5 9.5 Z" fill="#d9534b" stroke="#b13c36" strokeWidth=".8" strokeLinejoin="round" />
      <polygon points="60,14 67.5,16.5 60,19" fill="#e8a33d" stroke="#c07f1d" strokeWidth=".8" />
      <ellipse cx="58.5" cy="21.5" rx="2" ry="3" fill="#d9534b" />
      <circle cx="55.5" cy="13.6" r="1.3" fill="#1f2430" />
      <circle cx="56" cy="13.1" r="0.5" fill="#fff" />
      <g className="pq-blink" style={{ '--bd': '-1.8s' }}><rect x="53.6" y="11.9" width="3.6" height="3.2" rx="1.5" fill="#f6f1e4" /></g>
    </g>
    <line x1="26" y1="44" x2="26" y2="51.5" stroke="#e8a33d" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="34" y1="44" x2="34" y2="51.5" stroke="#e8a33d" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="26" y1="51.5" x2="30.5" y2="53" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="51.5" x2="38.5" y2="53" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Buvi kanon-uslubda (D07_02 bola kanoni asosida): ro'molli bosh, blikli pirpiratuvchi
// ko'z, tabassum, kuylak+fartuk; ikki qo'li oldindagi KOSAni ushlab turadi (kosa ichi qorong'i —
// olingan tuxumlar ko'rinmaydi, ustida «?» HTML-overlay).
const Granny = () => (
  <svg viewBox="0 0 96 118" width="96" height="118" aria-hidden="true" style={{ display: 'block' }}>
    {/* ko'ylak (etak) + gul-naqsh */}
    <path d="M34 52 Q29 55 28 66 L19 108 Q18 113 25 113 L71 113 Q78 113 77 108 L68 66 Q67 55 62 52 Z" fill="#b06f7e" stroke="#8a4f5e" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="34" cy="80" r="1.7" fill="#f4dbe0" opacity=".8" /><circle cx="48" cy="92" r="1.7" fill="#f4dbe0" opacity=".8" /><circle cx="62" cy="80" r="1.7" fill="#f4dbe0" opacity=".8" /><circle cx="41" cy="100" r="1.7" fill="#f4dbe0" opacity=".8" /><circle cx="55" cy="100" r="1.7" fill="#f4dbe0" opacity=".8" />
    {/* fartuk + belbog' */}
    <path d="M38 66 L58 66 L61 107 Q61 111 56 111 L40 111 Q35 111 35 107 Z" fill="#f4ead2" stroke="#dcc9a0" strokeWidth="1.4" strokeLinejoin="round" />
    <rect x="34" y="63" width="28" height="5" rx="2" fill="#e7d3a6" stroke="#cdb680" strokeWidth="1" />
    {/* bo'yin + bosh */}
    <rect x="43.5" y="39" width="9" height="12" rx="3" fill="#eab98c" stroke="#d69f6f" strokeWidth="1.2" />
    <circle cx="48" cy="27" r="15" fill="#f2c79c" stroke="#d69f6f" strokeWidth="1.4" />
    {/* kulrang soch (peshonada) */}
    <path d="M35 22 Q48 15 61 22 Q56 25 48 24 Q40 25 35 22 Z" fill="#d6d1c9" />
    {/* ro'mol: yon draplar + bosh gumbazi + oq nuqta naqsh */}
    <path d="M32 24 Q27 40 34 52 L41 47 Q35 37 37 26 Z" fill="#c94f4f" stroke="#a53a3a" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M64 24 Q69 40 62 52 L55 47 Q61 37 59 26 Z" fill="#bd4747" stroke="#a53a3a" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M31 27 Q29 7 48 6 Q67 7 65 27 Q57 19 48 19 Q39 19 31 27 Z" fill="#c94f4f" stroke="#a53a3a" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="41" cy="15" r="1.5" fill="#fff" opacity=".85" /><circle cx="55" cy="15" r="1.5" fill="#fff" opacity=".85" /><circle cx="48" cy="11" r="1.5" fill="#fff" opacity=".85" /><circle cx="35" cy="21" r="1.3" fill="#fff" opacity=".8" /><circle cx="61" cy="21" r="1.3" fill="#fff" opacity=".8" />
    {/* ko'zoynak */}
    <circle cx="42" cy="28" r="4.6" fill="#eaf2f7" fillOpacity=".5" stroke="#6b5a4a" strokeWidth="1.3" />
    <circle cx="54" cy="28" r="4.6" fill="#eaf2f7" fillOpacity=".5" stroke="#6b5a4a" strokeWidth="1.3" />
    <path d="M46.6 28 h2.8" stroke="#6b5a4a" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M37.4 28 L33 26 M58.6 28 L63 26" stroke="#6b5a4a" strokeWidth="1.2" strokeLinecap="round" />
    {/* ko'zlar + pirpirash */}
    <circle cx="42" cy="28" r="1.4" fill="#1f2430" /><circle cx="54" cy="28" r="1.4" fill="#1f2430" />
    <g className="pq-blink" style={{ '--bd': '0s' }}>
      <rect x="39.8" y="26.4" width="4.4" height="3.2" rx="1.5" fill="#f2c79c" />
      <rect x="51.8" y="26.4" width="4.4" height="3.2" rx="1.5" fill="#f2c79c" />
    </g>
    {/* burun, yonoq, tabassum, ajin */}
    <path d="M48 30 Q46.6 33 48.4 33.8" stroke="#c98d5f" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <circle cx="38.5" cy="33" r="2.3" fill="#e8927c" opacity=".5" /><circle cx="57.5" cy="33" r="2.3" fill="#e8927c" opacity=".5" />
    <path d="M43 36.5 Q48 40.5 53 36.5" stroke="#a0562f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M34.5 31 q1.4 1 .4 2.4 M61.5 31 q-1.4 1 -.4 2.4" stroke="#d69f6f" strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".7" />
    {/* qo'llar (yeng) + kaftlar kosani ushlaydi */}
    <path d="M35 55 Q26 68 35 88" stroke="#b06f7e" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M61 55 Q70 68 61 88" stroke="#b06f7e" strokeWidth="8" strokeLinecap="round" fill="none" />
    <circle cx="35" cy="89" r="4.2" fill="#f2c79c" stroke="#d69f6f" strokeWidth="1.2" />
    <circle cx="61" cy="89" r="4.2" fill="#f2c79c" stroke="#d69f6f" strokeWidth="1.2" />
    {/* kosa (old-markaz — olingan tuxumlar ichida yashirin) */}
    <path d="M28 90 Q30 105 48 105 Q66 105 68 90 Z" fill="#e3ddd2" stroke="#b7ab97" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M32 95 Q48 100 64 95" stroke="#7fa8d0" strokeWidth="1.8" fill="none" opacity=".7" />
    <ellipse cx="48" cy="90" rx="20" ry="5.5" fill="#f0ebe1" stroke="#b7ab97" strokeWidth="1.6" />
    <ellipse cx="48" cy="90" rx="16" ry="3.6" fill="#3a2f28" />
  </svg>
);

// Savatdagi 5 tuxum (qolganlar) — gardish orqasidan mo'ralaydi.
const BASKET_EGGS = [{ l: 8, t: -9 }, { l: 27, t: -13 }, { l: 46, t: -9 }, { l: 65, t: -13 }, { l: 84, t: -9 }];
// Kosadagi 3 tuxum (olinganlar) — faqat g'alabada ochiladi.
const BOWL_EGGS = [{ l: 29, t: 85 }, { l: 41, t: 81 }, { l: 53, t: 85 }];

export default function D08_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-animatsiyalari qayta ijro etilmaydi (statik yakuniy holat).
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0805" ref={fitRef}>
      <style>{`
        .pq0805{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0805 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0603f;text-transform:uppercase;}
        .pq0805 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0805 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0805 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0805 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:232px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 50%,#f4ecd6 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0805 .pq-fit{position:relative;margin:0 auto;}
        .pq0805 .pq-sun{position:absolute;top:10px;right:12px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0805 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0805 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0805 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-26s;}
        .pq0805 .pq-fence{position:absolute;left:0;right:0;bottom:48px;height:36px;background:repeating-linear-gradient(90deg,#e9dcc0 0 9px,#dbc9a3 9px 13px,transparent 13px 24px);opacity:.85;z-index:0;}
        .pq0805 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:9px;height:5px;background:#d3bf96;border-radius:3px;}
        .pq0805 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#ead9ab,#d9c188);z-index:0;}
        .pq0805 .pq-tree{position:absolute;right:-6px;bottom:44px;z-index:0;opacity:.95;}
        .pq0805 .pq-house{position:absolute;left:0;bottom:44px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0805 .pq-smk{position:absolute;width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.75);animation:pqSmoke 3.6s ease-out infinite;}
        .pq0805 .pq-smk.s1{left:55px;top:2px;}
        .pq0805 .pq-smk.s2{left:60px;top:-6px;animation-delay:-1.8s;}
        .pq0805 .pq-grain{position:absolute;left:62px;bottom:2px;z-index:1;}
        .pq0805 .pq-hen{position:absolute;left:12px;bottom:2px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0805 .pq-hh{transform-box:fill-box;transform-origin:18% 85%;animation:pqPeck 2.7s ease-in-out infinite;}
        .pq0805 .pq-table{position:absolute;left:116px;bottom:8px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0805 .pq-basket{position:absolute;left:128px;bottom:70px;width:108px;height:56px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0805 .pq-egg{position:absolute;z-index:0;animation:pqDrop .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0805 .pq-basket svg{position:relative;z-index:1;}
        .pq0805 .pq-sign{position:absolute;left:70px;bottom:28px;z-index:3;padding:3px 8px;background:#b9803f;border:2px solid #8a5424;border-radius:7px;color:#fff9ec;font-size:11.5px;font-weight:800;white-space:nowrap;box-shadow:0 2px 5px rgba(0,0,0,.18);animation:pqBreath 3.2s ease-in-out infinite;}
        .pq0805 .pq-sign::after{content:'';position:absolute;left:50%;top:100%;width:5px;height:16px;margin-left:-2.5px;background:#96602c;border-radius:0 0 2px 2px;}
        .pq0805 .pq-gran{position:absolute;left:260px;bottom:6px;width:96px;height:118px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0805 .pq-walkin{animation:pqWalkIn 1.3s cubic-bezier(.3,.75,.4,1) both;}
        .pq0805 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0805 .pq-q{position:absolute;left:33px;top:75px;width:30px;height:30px;border-radius:50%;background:#fff;border:2px solid #cfd9ec;color:#3f7fb5;font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(63,127,181,.2);animation:pqQ 2.2s ease-in-out infinite;z-index:4;}
        .pq0805 .pq-bowlegg{position:absolute;z-index:4;animation:pqPop .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0805 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}
        .pq0805 .pq-chip{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0805 .pq-scene.still .pq-walkin{animation:none;}
        .pq0805 .pq-scene.still .pq-egg{animation:none;}
        .pq0805 .pq-scene.still .pq-bowlegg{animation:none;}
        .pq0805 .pq-scene.still .pq-cnt{animation:none;}
        .pq0805 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0805 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0805 .pq-opt:hover:not(:disabled){border-color:#e3b48f;transform:translateY(-2px);}
        .pq0805 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0805 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0805 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0805 .pq-opt:disabled{cursor:default;}
        .pq0805 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0805 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0805 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSmoke{0%{opacity:0;transform:translateY(4px) scale(.6);}30%{opacity:.8;}100%{opacity:0;transform:translateY(-18px) scale(1.25);}}
        @keyframes pqPeck{0%,55%{transform:rotate(0);}63%,72%{transform:rotate(32deg);}82%,100%{transform:rotate(0);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.045);}}
        @keyframes pqWalkIn{from{transform:translateX(110px);}to{transform:translateX(0);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-26px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 232 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '') + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" /><span className="pq-ground" />
        <span className="pq-tree"><Tree /></span>
        <span className="pq-house"><House /><span className="pq-smk s1" /><span className="pq-smk s2" /></span>
        <svg className="pq-grain" viewBox="0 0 46 10" width="46" height="10" aria-hidden="true">
          <ellipse cx="6" cy="6" rx="2.2" ry="1.3" fill="#b98d3f" /><ellipse cx="15" cy="4" rx="2.2" ry="1.3" fill="#caa557" />
          <ellipse cx="24" cy="7" rx="2.2" ry="1.3" fill="#b98d3f" /><ellipse cx="33" cy="4.5" rx="2.2" ry="1.3" fill="#caa557" />
          <ellipse cx="41" cy="6.5" rx="2.2" ry="1.3" fill="#b98d3f" />
        </svg>
        <span className="pq-hen"><Hen /></span>
        <span className="pq-table"><Table /></span>

        {/* Savat: qolgan 5 tuxum — g'alabada badge 1..5 */}
        <div className="pq-basket">
          {BASKET_EGGS.map((p, i) => (
            <span key={i} className="pq-egg" style={{ left: p.l, top: p.t, animationDelay: `${i * 0.08}s` }}>
              <Egg w={20} />
              {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
            </span>
          ))}
          <Basket />
        </div>
        <span className="pq-sign">{t.sign}</span>

        {/* Buvi + kosa: olinganlar yashirin, g'alabada 3 tuxum ochiladi (badge 1..3) */}
        <div className="pq-gran">
          <div className={still ? '' : 'pq-walkin'}>
            <Granny />
            {!ok && <span className="pq-q">?</span>}
            {ok && BOWL_EGGS.map((p, i) => (
              <span key={i} className="pq-bowlegg" style={{ left: p.l, top: p.t, animationDelay: `${0.15 + i * 0.12}s` }}>
                <Egg w={15} />
                <b className="pq-cnt" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>{i + 1}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Ayirish-chip sahna tartibida: boshlang'ich − olingan = qolgan */}
        {ok && <span className="pq-chip">{DATA.start} − {DATA.target} = {DATA.left}</span>}
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
