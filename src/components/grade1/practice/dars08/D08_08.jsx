// Dars08 · Amaliyot 08 — P9 Ko'p-tanlov «Uchlik misollari» · 🔴 · tag: diff_three_multi
// Kir ipidagi 5 ko'ylakchada ayirish misollari; natijasi 3 bo'lgan BARCHASINI tanlash (6 − 2 = 4 tuzoq).
// G'alabada to'g'ri ko'ylakchalar yashil porlaydi, har birida «= 3» pop. Ko'ylakcha-tugmalarga doimiy
// siljish berilmagan (qoida) — sway faqat dekorda: ip uchlari, uy bayroqchasi.
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

const RES = 3;
// «boshlang'ich − ketgan» — hamma joyda katta − kichik, natija manfiy emas.
const EXPRS = [{ a: 5, b: 2 }, { a: 7, b: 4 }, { a: 6, b: 2 }, { a: 4, b: 1 }, { a: 8, b: 5 }];
const GOOD = EXPRS.map((e, i) => (e.a - e.b === RES ? i : -1)).filter((i) => i >= 0); // [0, 1, 3, 4]
const DATA = { ptype: 'P9', level: '🔴', tag: 'diff_three_multi' };
const T = {
  uz: {
    eyebrow: "Qishloq hovlisi · Kir ipi", title: 'Uchlik misollari',
    setup: "Kir ipidagi ko'ylakchalarda misollar yozilgan — faqat natijasi UCH bo'lganlari bizniki.",
    ask: "Natijasi UCH bo'ladigan BARCHA ko'ylakchalarni bosing.",
    correct: "Barakalla! To'rttala uchlik topildi!",
    hint: "Har misolni barmoqda ayirib ko'ring: natijasi uch bo'lganlarinigina tanlang, bittasini ham qoldirmang.",
  },
  ru: {
    eyebrow: 'Деревенский двор · Бельевая верёвка', title: 'Примеры тройки',
    setup: 'На рубашках на бельевой верёвке написаны примеры — наши только те, где получается ТРИ.',
    ask: 'Нажми на ВСЕ рубашки, где получается ТРИ.',
    correct: 'Молодец! Все четыре тройки найдены!',
    hint: 'Вычти каждый пример на пальцах: выбирай только те, где получается три, и не пропусти ни одной.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Ko'ylakcha palitrasi (2-3 ton + quyuq kontur): qizil, ko'k, sariq, yashil, binafsha.
const SCOL = [
  { base: '#e0716a', dark: '#b04a44', line: '#96352f', txt: '#fff' },
  { base: '#5d9bd0', dark: '#3f739e', line: '#33608a', txt: '#fff' },
  { base: '#f2c14e', dark: '#cf9327', line: '#a8761b', txt: '#6b4404' },
  { base: '#6cb763', dark: '#498943', line: '#3a7136', txt: '#fff' },
  { base: '#9a72d8', dark: '#7350ab', line: '#5f3f96', txt: '#fff' },
];

// Kir ipiga qisqich bilan osilgan ko'ylakcha: yoqa, yenglar, etak-soyasi, blik.
// Misol ko'krakda; g'alabada «= 3» shu ko'ylakchaning o'zida pop bo'ladi.
const Shirt = ({ c, a, b, sel, ans }) => (
  <svg viewBox="0 0 64 78" width="64" height="78" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="16.5" y="2" width="5" height="13" rx="2" fill="#c9a674" stroke="#a5854e" strokeWidth="1" />
    <rect x="42.5" y="2" width="5" height="13" rx="2" fill="#c9a674" stroke="#a5854e" strokeWidth="1" />
    <path d="M22 14 L11 19 L3 33 L13 38.5 L13 67 Q32 73 51 67 L51 38.5 L61 33 L53 19 L42 14 Q32 21 22 14 Z"
      fill={c.base} stroke={sel ? '#2563eb' : c.line} strokeWidth={sel ? 3 : 2} strokeLinejoin="round" />
    <path d="M22 14 Q32 21 42 14" stroke={c.dark} strokeWidth="2" fill="none" />
    <path d="M13 38.5 L17.5 34 M51 38.5 L46.5 34" stroke={c.dark} strokeWidth="1.4" opacity=".55" />
    <path d="M13 61 Q32 67 51 61 L51 67 Q32 73 13 67 Z" fill={c.dark} opacity=".3" />
    <ellipse cx="23" cy="30" rx="5.5" ry="9" fill="#fff" opacity=".16" transform="rotate(-14 23 30)" />
    <text x="32" y={ans ? 37 : 45} textAnchor="middle" fontSize="13" fontWeight="900" fill={c.txt} fontFamily="inherit">{a} − {b}</text>
    {ans && <text className="pq-apop" x="32" y="59" textAnchor="middle" fontSize="15.5" fontWeight="900" fill={c.txt} fontFamily="inherit">= {RES}</text>}
  </svg>
);

// Tovuq kanoni (D08_01 bilan bir xil): yon ko'rinish, oq-krem tana 2-ton, qizil toj-soqolcha,
// sariq tumshuq/oyoqlar, blikli pirpiratuvchi ko'z, qanot-chizig'i. Bosh — cho'qish guruhi (.pq-hd).
const CREAM = { body: '#f6f1e4', shade: '#e4dbc6', line: '#b9a67e' };
const MALLA = { body: '#e8d5b0', shade: '#d8c092', line: '#b9a67e' };
const Hen = ({ tone, pd = '0s', bd = '0s' }) => (
  <svg viewBox="0 0 64 54" width="52" height="44" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M48 26 Q61 21 60 8 Q54 17 46 20 Z" fill={tone.shade} stroke={tone.line} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M50 24 Q58 19 58 12" stroke={tone.line} strokeWidth="1" fill="none" opacity=".5" />
    <line x1="32" y1="41" x2="31" y2="50" stroke="#e8a33d" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="39" y1="41" x2="40" y2="50" stroke="#e8a33d" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="31" y1="50" x2="26.5" y2="51.5" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="50" x2="35.5" y2="51.5" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="36" cy="32" rx="16" ry="11" fill={tone.body} stroke={tone.line} strokeWidth="1.5" />
    <ellipse cx="38" cy="36.5" rx="11" ry="6" fill={tone.shade} />
    <path d="M30 27 Q42 24 46 31 Q40 38 31 36 Q27 31 30 27 Z" fill={tone.shade} stroke={tone.line} strokeWidth="1" />
    <path d="M33 29 Q40 27.5 43.5 31" stroke={tone.line} strokeWidth="1" fill="none" opacity=".55" />
    <g className="pq-hd" style={{ animationDelay: pd }}>
      <path d="M17.5 13 Q18.5 6 21.5 10.5 Q23 5 26 9.5 Q28.5 6 29.5 12.5 Z" fill="#d9534b" />
      <ellipse cx="17.5" cy="26.5" rx="2.1" ry="3" fill="#d9534b" />
      <circle cx="23" cy="18" r="8" fill={tone.body} stroke={tone.line} strokeWidth="1.5" />
      <ellipse cx="26" cy="21.5" rx="4" ry="2.6" fill={tone.shade} opacity=".7" />
      <polygon points="16,16.5 7.5,19.2 16,21.8" fill="#e8a33d" />
      <line x1="15.5" y1="19" x2="9.5" y2="19.2" stroke="#c07f1e" strokeWidth="0.9" />
      <circle cx="21" cy="16" r="1.6" fill="#1f2430" />
      <circle cx="21.6" cy="15.4" r="0.6" fill="#fff" />
      <g className="pq-blink" style={{ '--bd': bd }}>
        <rect x="19" y="14.2" width="4.2" height="3.6" rx="1.6" fill={tone.body} />
      </g>
    </g>
  </svg>
);

// Chumchuq (D03_04 kanoni, chumchuq palitrasi) — panjara ustida o'tiribdi, pirpiratadi.
const SPAR = { body: '#8a6543', breast: '#dcbb8e', head: '#7a5a3b', wing: '#5f4327' };
const Sparrow = () => (
  <svg viewBox="0 0 64 52" width="30" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 22 L23 22 L23 31 L8 30 Z" fill={SPAR.wing} />
    <path d="M6 22 L14 26 L6 30 Z" fill={SPAR.body} opacity=".7" />
    <ellipse cx="34" cy="27" rx="16" ry="11" fill={SPAR.body} />
    <ellipse cx="38" cy="31.5" rx="11.5" ry="7" fill={SPAR.breast} />
    <circle cx="48" cy="17.5" r="8.6" fill={SPAR.head} />
    <ellipse cx="50" cy="20" rx="5" ry="3.6" fill={SPAR.breast} opacity=".85" />
    <polygon points="56,15.5 63.5,18.5 56,21.5" fill="#e8a33d" />
    <circle cx="50.6" cy="15.8" r="2" fill="#1f2430" />
    <circle cx="51.4" cy="15.1" r="0.7" fill="#fff" />
    <g className="pq-blink" style={{ '--bd': '-2.1s' }}><rect x="48.2" y="13.6" width="4.8" height="4.4" rx="2" fill={SPAR.head} /></g>
    <path d="M25 21 Q37 12 47 20 Q42 30 31 31 Q25 27 25 21 Z" fill={SPAR.wing} />
    <line x1="31" y1="37.5" x2="29" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="38" y1="38" x2="38" y2="47" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// Bobo-buvi uychasi: devor + qizil tom + mo'ri + deraza (rom-krest) + eshik + tomda bayroqcha (sway).
const House = () => (
  <svg viewBox="0 0 96 96" width="88" height="88" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="66" y="24" width="9" height="18" fill="#9c4230" />
    <line x1="48" y1="18" x2="48" y2="7" stroke="#8a5a2e" strokeWidth="2" strokeLinecap="round" />
    <g className="pq-flag"><polygon points="48,7 63,10.5 48,14" fill="#d9534b" /></g>
    <rect x="10" y="44" width="76" height="48" rx="3" fill="#efdcb4" stroke="#cbb188" strokeWidth="2" />
    <path d="M4 48 L48 18 L92 48 Z" fill="#c0563f" stroke="#9c4230" strokeWidth="2" strokeLinejoin="round" />
    <rect x="58" y="56" width="20" height="36" rx="2" fill="#a9713d" stroke="#8a5a2e" strokeWidth="1.6" />
    <circle cx="62.5" cy="74" r="1.6" fill="#6d4623" />
    <rect x="19" y="56" width="24" height="20" rx="2" fill="#bfe3f5" stroke="#8fb6cf" strokeWidth="2" />
    <line x1="31" y1="56" x2="31" y2="76" stroke="#8fb6cf" strokeWidth="2" />
    <line x1="19" y1="66" x2="43" y2="66" stroke="#8fb6cf" strokeWidth="2" />
  </svg>
);

// Hovli daraxti: uch tonlik barg-toji + mevalar (D03_04 palitrasi, ixcham).
const Tree = () => (
  <svg viewBox="0 0 96 120" width="86" height="108" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M46 118 L46 74 Q46 64 38 56 M52 118 L52 72 Q52 62 60 54" stroke="#7c4f24" strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="46" r="24" fill="#4f9a48" />
    <circle cx="62" cy="38" r="26" fill="#5cae54" />
    <circle cx="48" cy="60" r="20" fill="#478b41" />
    <circle cx="48" cy="26" r="17" fill="#68bd60" />
    <circle cx="42" cy="20" r="7" fill="#83cf7a" opacity=".8" />
    <circle cx="70" cy="30" r="7" fill="#83cf7a" opacity=".7" />
    <circle cx="36" cy="34" r="4" fill="#d94f5c" />
    <circle cx="34.8" cy="32.8" r="1.3" fill="#fff" opacity=".5" />
    <circle cx="60" cy="52" r="4" fill="#d94f5c" />
    <circle cx="58.8" cy="50.8" r="1.3" fill="#fff" opacity=".5" />
  </svg>
);

// Yer qatlami: don-dog' (tovuqlar cho'qiydigan donlar) + o't-tuplar + gul.
const Ground = () => (
  <svg viewBox="0 0 340 20" width="340" height="20" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M10 18 q3 -9 5 -1 M20 19 q3 -10 6 -1 M186 18 q3 -9 5 -1 M318 19 q3 -10 6 -1" stroke="#5ea44d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <g><line x1="300" y1="19" x2="300" y2="10" stroke="#5ea44d" strokeWidth="2" /><circle cx="300" cy="8" r="3.2" fill="#e88bb1" /><circle cx="300" cy="8" r="1.3" fill="#b1487a" /></g>
    {[[38, 15], [46, 18], [56, 14], [88, 15], [98, 18], [130, 16], [140, 13], [166, 15], [206, 16], [216, 13], [252, 16]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="2" ry="1.3" fill="#d9a441" stroke="#b97c14" strokeWidth=".5" transform={`rotate(${(i % 3) * 30 - 30} ${x} ${y})`} />
    ))}
  </svg>
);

// «3» kalit-doira: oltin, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const Key = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="22" cy="22" r="19" fill="#f2b134" stroke="#c08517" strokeWidth="2" />
    <circle cx="15.5" cy="14.5" r="6" fill="#f8d47f" opacity=".9" />
    <text x="22" y="30" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">{RES}</text>
    <polygon className="pq-glint" points="32.5,7.5 33.7,11 37.2,12.2 33.7,13.4 32.5,16.9 31.3,13.4 27.8,12.2 31.3,11" fill="#fff" />
  </svg>
);

// Chizilgan yulduzcha: oltin, yupqa kontur, oq blik (g'alaba uchqunlari).
const Star = ({ size = 12 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="12,2 14.9,8.6 22,9.3 16.7,14.2 18.2,21.3 12,17.6 5.8,21.3 7.3,14.2 2,9.3 9.1,8.6" fill="#f2b134" stroke="#c08517" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="9.6" cy="8.4" r="1.1" fill="#fff" opacity=".75" />
  </svg>
);

// Ikki ustun + salqi ip + ip uchlari (sway) + ustun tagidagi o't-do'ngliklar.
const LineBg = () => (
  <svg viewBox="0 0 372 132" width="372" height="132" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="11" cy="127" rx="16" ry="4.5" fill="#8ecb76" />
    <ellipse cx="361" cy="127" rx="16" ry="4.5" fill="#8ecb76" />
    <rect x="7" y="6" width="7" height="120" rx="3" fill="#b98a4a" stroke="#8a6a3a" strokeWidth="1.5" />
    <rect x="358" y="6" width="7" height="120" rx="3" fill="#b98a4a" stroke="#8a6a3a" strokeWidth="1.5" />
    <path d="M6 10 q4.5 -4 9 0 M357 10 q4.5 -4 9 0" stroke="#8a6a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M12 22 Q186 58 360 22" stroke="#9aa0aa" strokeWidth="2.4" fill="none" />
    <circle cx="12" cy="22" r="2.6" fill="#7c828c" />
    <circle cx="360" cy="22" r="2.6" fill="#7c828c" />
    <g className="pq-tail"><path d="M12 23 q-4 9 1 15" stroke="#9aa0aa" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
    <g className="pq-tail" style={{ animationDelay: '-1.4s' }}><path d="M360 23 q4 9 -1 15" stroke="#9aa0aa" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
    <path d="M28 128 q3 -8 5 -1 M348 128 q3 -8 5 -1" stroke="#5ea44d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </svg>
);

// Ko'ylakchalar ip salqisi bo'ylab: x = chap chet, top = ipdagi balandlik.
const POS = [{ x: 24, top: 22 }, { x: 90, top: 29 }, { x: 156, top: 32 }, { x: 222, top: 29 }, { x: 288, top: 21 }];
const PECK = [{ x: 104, b: 20 }, { x: 164, b: 16 }, { x: 232, b: 22 }];
const WINSTARS = [{ l: -7, t: 6, d: 0, s: 12 }, { l: 57, t: -4, d: 0.18, s: 11 }];

export default function D08_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review yoki qayta ochilishda kirish-animatsiyasi (ko'ylakchalar tushishi) qayta ijro etilmaydi.
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => EXPRS[i].a - EXPRS[i].b === RES);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: EXPRS.map((e) => `${e.a} − ${e.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq0808" ref={fitRef}>
      <style>{`
        .pq0808{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0808 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#a06a2c;text-transform:uppercase;}
        .pq0808 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0808 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0808 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0808 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:216px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 52%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0808 .pq-fit{position:relative;margin:0 auto;}
        .pq0808 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0808 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq0808 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-13s;}
        .pq0808 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-24s;}
        .pq0808 .pq-fence{position:absolute;left:0;right:0;bottom:56px;height:38px;background:repeating-linear-gradient(90deg,#d8b98a 0 10px,#c9a674 10px 14px,transparent 14px 26px);opacity:.9;z-index:0;}
        .pq0808 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:10px;height:5px;background:#c9a674;border-radius:3px;}
        .pq0808 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(#8ecb76,#77b862);z-index:0;}
        .pq0808 .pq-house{position:absolute;left:4px;bottom:52px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0808 .pq-flag{transform-box:fill-box;transform-origin:0% 60%;animation:pqSway 2.6s ease-in-out infinite alternate;}
        .pq0808 .pq-tree{position:absolute;right:0;bottom:48px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq0808 .pq-groundw{position:absolute;left:16px;bottom:6px;z-index:1;}
        .pq0808 .pq-henw{position:absolute;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0808 .pq-hd{transform-box:fill-box;transform-origin:88% 92%;animation:pqPeck 1.7s ease-in-out infinite;}
        .pq0808 .pq-lean{transform-origin:50% 100%;animation:pqLean 1.7s ease-in-out infinite;}
        .pq0808 .pq-sparrow{position:absolute;left:252px;bottom:92px;z-index:1;line-height:0;animation:pqBob 2.6s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18));}
        .pq0808 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0808 .pq-keywrap{position:absolute;top:6px;left:50%;transform:translateX(-50%);line-height:0;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18));}
        .pq0808 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;}
        .pq0808 .pq-keybr.win{animation:pqCele .55s ease;}
        .pq0808 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.6s ease-in-out infinite;}
        .pq0808 .pq-line{box-sizing:border-box;position:relative;width:372px;height:132px;}
        .pq0808 .pq-linebg{position:absolute;left:0;top:0;line-height:0;}
        .pq0808 .pq-tail{transform-box:fill-box;transform-origin:50% 0%;animation:pqSway 3s ease-in-out infinite alternate;}
        .pq0808 .pq-shirt{position:absolute;width:64px;height:78px;background:none;border:none;padding:0;cursor:pointer;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));transition:filter .14s,transform .14s;}
        .pq0808 .pq-shirt:hover:not(:disabled){transform:translateY(-2px);}
        .pq0808 .pq-shirt:active:not(:disabled){transform:scale(.95);}
        .pq0808 .pq-shirt.sel{filter:drop-shadow(0 2px 2px rgba(0,0,0,.12)) drop-shadow(0 0 6px rgba(37,99,235,.85));}
        .pq0808 .pq-shirt.right{filter:drop-shadow(0 2px 2px rgba(0,0,0,.1)) drop-shadow(0 0 9px rgba(46,180,96,.8));animation:pqCele .55s ease;}
        .pq0808 .pq-shirt.dim{opacity:.45;}
        .pq0808 .pq-shirt:disabled{cursor:default;}
        .pq0808 .pq-dropin{animation:pqDropIn .6s cubic-bezier(.3,1.3,.5,1) backwards;}
        .pq0808 .pq-line.still .pq-dropin{animation:none;}
        .pq0808 .pq-apop{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0808 .pq-cstar{position:absolute;line-height:0;animation:pqStarIn .5s cubic-bezier(.3,1.5,.5,1) both,pqTwinkle 1.7s ease-in-out .6s infinite;z-index:3;}
        .pq0808 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0808 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0808 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(460px);}}
        @keyframes pqSway{from{transform:rotate(-4deg);}to{transform:rotate(7deg);}}
        @keyframes pqPeck{0%,50%,100%{transform:rotate(0);}62%{transform:rotate(-20deg);}72%{transform:rotate(-5deg);}84%{transform:rotate(-18deg);}}
        @keyframes pqLean{0%,50%,100%{transform:rotate(0);}62%,84%{transform:rotate(-6deg);}72%{transform:rotate(-4deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqDropIn{from{opacity:0;transform:translateY(-18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.35);}to{opacity:1;transform:scale(1);}}
        @keyframes pqStarIn{from{opacity:0;transform:scale(.2) rotate(-40deg);}to{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pqTwinkle{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 372 * scale, height: 216 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" /><span className="pq-grass" />
        <span className="pq-house"><House /></span>
        <span className="pq-tree"><Tree /></span>
        <span className="pq-groundw"><Ground /></span>
        {/* Don cho'qiyotgan tovuqlar (stagger) — dekor, sanalmaydi */}
        {PECK.map((p, i) => (
          <div key={i} className="pq-henw" style={{ left: p.x, bottom: p.b }}>
            <div className="pq-lean" style={{ animationDelay: `${i * 0.55}s` }}>
              <Hen tone={i === 1 ? MALLA : CREAM} pd={`${i * 0.55}s`} bd={`${-i * 0.9}s`} />
            </div>
          </div>
        ))}
        <span className="pq-sparrow"><Sparrow /></span>
        <span className="pq-keywrap"><span className={'pq-keybr' + (ok ? ' win' : '')}><Key /></span></span>
      </div>
      </div>

      {/* Kir ipi: 5 ko'ylakcha-tugma ip salqisi bo'ylab osilgan */}
      <div className="pq-fit" style={{ width: 372 * scale, height: 132 * scale, marginTop: 10 }}>
      <div className={'pq-line' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-linebg"><LineBg /></span>
        {EXPRS.map((e, i) => {
          const good = e.a - e.b === RES;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
          return (
            <button key={i} type="button" className={'pq-shirt pq-dropin' + cls} disabled={lock}
              style={{ left: POS[i].x, top: POS[i].top, animationDelay: `${i * 0.12}s` }}
              onClick={() => toggle(i)} aria-label={`${e.a} − ${e.b}`}>
              <Shirt c={SCOL[i]} a={e.a} b={e.b} sel={!ok && sel} ans={!!(ok && good)} />
              {ok && good && WINSTARS.map((s, k) => (
                <span key={k} className="pq-cstar" style={{ left: s.l, top: s.t, animationDelay: `${s.d}s, ${0.6 + s.d}s` }}><Star size={s.s} /></span>
              ))}
            </button>
          );
        })}
      </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
