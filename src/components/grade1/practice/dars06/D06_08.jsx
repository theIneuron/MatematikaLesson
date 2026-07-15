// Dars06 · Amaliyot 08 — P5 Ko'p-tanlov «O'nlik chiptalari» · 🔴 · tag: ten_pairs_multi
// 4 avtobus-chiptadan jami O'N bo'ladigan UCHTASINI tanlash (6+4, 7+3, 8+2; 5+3 — soxta).
// Sahna: 10-marshrut sariq avtobus (kanon), g'ildiraklar sekin aylanadi, haydovchi ko'z pirpiratadi,
// tepada «10» kalit-doira breath. G'alabada to'g'ri chiptalar yashil glow + kompostr-teshikcha.
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

const PAIRS = [{ a: 6, b: 4 }, { a: 5, b: 3 }, { a: 7, b: 3 }, { a: 8, b: 2 }];
const SUM = 10;
const GOOD = PAIRS.map((p, i) => (p.a + p.b === SUM ? i : -1)).filter((i) => i >= 0); // [0, 2, 3]
const DATA = { ptype: 'P5', level: '🔴', tag: 'ten_pairs_multi' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Chiptalar', title: 'O\'nlik chiptalari',
    setup: 'Avtobus chiptalari sonli: faqat jami O\'N bo\'ladiganlari haqiqiy chipta.',
    ask: 'Jami O\'N bo\'ladigan BARCHA chiptalarni bosing.',
    correct: 'Barakalla! Uchala haqiqiy chipta topildi — marhamat, avtobusga!',
    hint: 'Har chiptani barmoqda qo\'shib ko\'ring: jami o\'n bo\'lganlarinigina tanlang, bittasini ham qoldirmang.',
  },
  ru: {
    eyebrow: 'Автобусное путешествие · Билеты', title: 'Билеты десятки',
    setup: 'На автобусных билетах написаны числа: настоящие только те, что вместе дают ДЕСЯТЬ.',
    ask: 'Нажми на ВСЕ билеты, которые вместе дают ДЕСЯТЬ.',
    correct: 'Молодец! Все три настоящих билета найдены — добро пожаловать в автобус!',
    hint: 'Сложи каждый билет на пальцах: выбирай только те, что дают десять, и не пропусти ни одного.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan yulduzcha: oltin, yupqa quyuq kontur, kichik oq blik (g'alaba bezagi).
const Star = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="12,2 14.9,8.6 22,9.3 16.7,14.2 18.2,21.3 12,17.6 5.8,21.3 7.3,14.2 2,9.3 9.1,8.6" fill="#f2b134" stroke="#c08517" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="9.6" cy="8.4" r="1.1" fill="#fff" opacity=".75" />
  </svg>
);

// G'ildirak: to'q doira + kulrang disk + 4 kegay (pq-wheel sekin aylanadi).
const Wheel = ({ cx }) => (
  <g>
    <circle cx={cx} cy="82" r="14" fill="#2e2f38" stroke="#15161c" strokeWidth="2" />
    <circle cx={cx} cy="82" r="6.8" fill="#c3c8d1" stroke="#878d98" strokeWidth="1.4" />
    <g className="pq-wheel">
      <line x1={cx - 5} y1="82" x2={cx + 5} y2="82" stroke="#5a606c" strokeWidth="1.7" strokeLinecap="round" />
      <line x1={cx} y1="77" x2={cx} y2="87" stroke="#5a606c" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx={cx} cy="82" r="1.7" fill="#5a606c" />
    </g>
  </g>
);

// AVTOBUS KANONI: yon ko'rinish sariq shahar avtobusi — tana 2 ton (#f2b134 / #d99a1a,
// kontur #a8721a), tomi ochroq, oldida fara + eshik, oq-havorang derazalar (#dff1fb),
// haydovchi (nomsiz personaj) blikli ko'z + pirpiratish. open=true: eshikdan oltin nur.
const Bus = ({ open }) => (
  <svg viewBox="0 0 210 108" width="224" height="115" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="104" cy="101" rx="92" ry="5.5" fill="rgba(60,55,35,.18)" />
    {/* tana: 2 ton */}
    <rect x="6" y="22" width="192" height="58" rx="10" fill="#f2b134" />
    <path d="M6 62 L198 62 L198 70 Q198 80 188 80 L16 80 Q6 80 6 70 Z" fill="#d99a1a" />
    {/* tom ochroq */}
    <path d="M16 22 L188 22 Q198 22 198 31 L6 31 Q6 22 16 22 Z" fill="#f8d47f" />
    <rect x="6" y="22" width="192" height="58" rx="10" fill="none" stroke="#a8721a" strokeWidth="2.5" />
    {/* yo'lovchi derazalari */}
    <rect x="18" y="34" width="30" height="19" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.5" />
    <rect x="54" y="34" width="30" height="19" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.5" />
    <rect x="90" y="34" width="30" height="19" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.5" />
    {/* haydovchi oynasi + haydovchi */}
    <rect x="126" y="31" width="28" height="22" rx="3.5" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.5" />
    <circle cx="139" cy="44" r="6.5" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.2" />
    <path d="M132.8 40.5 Q139 33.8 145.2 40.5 L145.2 38.8 Q139 32 132.8 38.8 Z" fill="#4f8fc4" stroke="#376a94" strokeWidth="1" strokeLinejoin="round" />
    <path d="M144.5 39.6 Q148 40.2 149.5 41.8" stroke="#376a94" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="136.8" cy="42.8" r="1.15" fill="#1f2430" /><circle cx="137.2" cy="42.4" r="0.45" fill="#fff" />
    <circle cx="141.6" cy="42.8" r="1.15" fill="#1f2430" /><circle cx="142" cy="42.4" r="0.45" fill="#fff" />
    <g className="pq-blink" aria-hidden="true">
      <rect x="135.4" y="41.4" width="2.9" height="2.7" rx="1.3" fill="#f2c096" />
      <rect x="140.2" y="41.4" width="2.9" height="2.7" rx="1.3" fill="#f2c096" />
    </g>
    <path d="M136.8 46.8 Q139.2 48.4 141.6 46.8" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* marshrut taxtasi «10» */}
    <rect x="128" y="24" width="24" height="10" rx="2.5" fill="#fffdf2" stroke="#a8721a" strokeWidth="1.2" />
    <text x="140" y="32" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#8a5f0e" fontFamily="inherit">10</text>
    {/* eshik: yopiq oq-havorang yoki ochiq oltin nur */}
    {open ? (
      <g>
        <rect x="162" y="34" width="28" height="46" rx="3" fill="#ffe9a8" stroke="#1a7f43" strokeWidth="2" />
        <circle cx="176" cy="60" r="6.5" fill="#fff6d8" />
        <polygon points="176,50 177.2,53 180,53.3 177.9,55.3 178.5,58 176,56.5 173.5,58 174.1,55.3 172,53.3 174.8,53" fill="#f2b134" />
      </g>
    ) : (
      <g>
        <rect x="162" y="34" width="28" height="46" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.5" />
        <line x1="176" y1="34" x2="176" y2="80" stroke="#a8721a" strokeWidth="1.4" />
        <rect x="164.5" y="58" width="9.5" height="19" fill="#c9e4f4" opacity=".85" />
        <rect x="178" y="58" width="9.5" height="19" fill="#c9e4f4" opacity=".85" />
      </g>
    )}
    {/* fara */}
    <circle cx="193.5" cy="57" r="4.2" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.5" />
    <Wheel cx={48} />
    <Wheel cx={140} />
  </svg>
);

// «10» kalit-doira: oltin, blik, ora-sira yalt-uchqun; doim breath.
const Key = ({ win }) => (
  <svg viewBox="0 0 46 46" width="48" height="48" aria-hidden="true" style={{ display: 'block' }}>
    <g className={'pq-key' + (win ? ' win' : '')}>
      <circle cx="23" cy="23" r="15.5" fill="#f2b134" stroke="#c08517" strokeWidth="2" />
      <circle cx="18" cy="17.5" r="5.5" fill="#f8d47f" opacity=".9" />
      <text x="23" y="28.5" textAnchor="middle" fontSize="15" fontWeight="900" fill="#7a4a06" fontFamily="inherit">10</text>
      <polygon className="pq-glint" points="33,5 34.4,9.6 39,11 34.4,12.4 33,17 31.6,12.4 27,11 31.6,9.6" fill="#fff" />
    </g>
  </svg>
);

// Chipta ichidagi mitti avtobus-piktogramma (kanon ranglarda).
const BusMini = () => (
  <svg viewBox="0 0 34 24" width="27" height="19" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="1.5" y="3" width="31" height="15" rx="4" fill="#f2b134" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="5" y="6.5" width="6.5" height="5" rx="1.2" fill="#dff1fb" />
    <rect x="14" y="6.5" width="6.5" height="5" rx="1.2" fill="#dff1fb" />
    <rect x="23" y="6.5" width="6" height="5" rx="1.2" fill="#dff1fb" />
    <circle cx="9" cy="19" r="3.2" fill="#2e2f38" />
    <circle cx="25" cy="19" r="3.2" fill="#2e2f38" />
    <circle cx="9" cy="19" r="1.2" fill="#c3c8d1" />
    <circle cx="25" cy="19" r="1.2" fill="#c3c8d1" />
  </svg>
);

// Kompostr-teshikcha: yashil halqa ichida punch-teshik (g'alabada paydo bo'ladi).
const Punch = () => (
  <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="10" cy="10" r="8" fill="#e8f7ee" stroke="#1a7f43" strokeWidth="2" />
    <circle cx="10" cy="10" r="3.6" fill="#4a4438" />
    <circle cx="8.8" cy="8.8" r="1" fill="#6d675b" />
  </svg>
);

const STARS = [
  { l: -26, t: 8, d: 0, s: 17 }, { l: 56, t: 2, d: 0.12, s: 15 }, { l: -8, t: -12, d: 0.24, s: 13 },
  { l: 44, t: 30, d: 0.3, s: 14 }, { l: 6, t: 40, d: 0.18, s: 12 },
];

export default function D06_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => PAIRS[i].a + PAIRS[i].b === SUM);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: PAIRS.map((p) => `${p.a} + ${p.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(330);

  return (
    <div className="pq pq0608" ref={fitRef}>
      <style>{`
        .pq0608{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0608 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b07f16;text-transform:uppercase;}
        .pq0608 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0608 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0608 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0608 .pq-scene{box-sizing:border-box;position:relative;width:330px;height:186px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f5fd 58%,#eef6ea 78%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0608 .pq-fit{position:relative;margin:0 auto 16px;}
        .pq0608 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.5s ease-in-out infinite;}
        .pq0608 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0608 .pq-cloud.c1{top:24px;left:-70px;animation-duration:28s;animation-delay:-12s;}
        .pq0608 .pq-cloud.c2{top:52px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-25s;}
        .pq0608 .pq-road{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#9aa1ac,#868d99);border-top:2px solid #7c828e;}
        .pq0608 .pq-roadline{position:absolute;left:0;right:0;bottom:14px;height:3px;background-image:linear-gradient(90deg,#f4f6f8 0 14px,transparent 14px 26px);background-size:26px 3px;background-repeat:repeat-x;opacity:.85;animation:pqRoad .5s linear infinite;}
        .pq0608 .pq-buspos{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0608 .pq-busidle{animation:pqIdle 2.6s ease-in-out infinite;}
        .pq0608 .pq-busidle.cele{animation:pqCele .6s ease 2;}
        .pq0608 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0608 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0608 .pq-keywrap{position:absolute;top:6px;left:50%;transform:translateX(-50%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));z-index:3;}
        .pq0608 .pq-key{transform-box:fill-box;transform-origin:50% 50%;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0608 .pq-key.win{animation:pqCele .5s ease;}
        .pq0608 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 4s ease-in-out infinite;}
        .pq0608 .pq-star{position:absolute;line-height:0;animation:pqStarIn .5s cubic-bezier(.3,1.5,.5,1) both,pqTwinkle 1.6s ease-in-out .7s infinite;z-index:4;}
        .pq0608 .pq-cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:320px;margin:0 auto;}
        .pq0608 .pq-float{animation:pqFloat 4s ease-in-out infinite;}
        .pq0608 .pq-tkt{position:relative;display:flex;align-items:stretch;width:148px;height:76px;padding:0;border-radius:12px;border:2.5px solid #dcd0a8;background:linear-gradient(#fffdf4,#fbf4dd);cursor:pointer;transition:.14s;font-family:inherit;box-shadow:0 2px 5px rgba(0,0,0,.07);}
        .pq0608 .pq-tkt:hover:not(:disabled){border-color:#e0b25f;transform:translateY(-2px);}
        .pq0608 .pq-tkt:active:not(:disabled){transform:scale(.95);}
        .pq0608 .pq-tkt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0608 .pq-tkt.right{border-color:#1a7f43;background:#e8f7ee;box-shadow:0 0 14px 3px rgba(26,127,67,.35);animation:pqCele .5s ease;}
        .pq0608 .pq-tkt.dim{opacity:.45;}
        .pq0608 .pq-tkt:disabled{cursor:default;}
        .pq0608 .pq-perf{position:absolute;left:10px;right:10px;height:3px;background-image:radial-gradient(circle 1.5px at 1.5px 1.5px,#cdbf94 92%,transparent 100%);background-size:7px 3px;background-repeat:repeat-x;opacity:.8;pointer-events:none;}
        .pq0608 .pq-perf.top{top:4px;} .pq0608 .pq-perf.bot{bottom:4px;}
        .pq0608 .pq-stub{width:42px;display:flex;align-items:center;justify-content:center;border-right:2px dashed #d5c89b;}
        .pq0608 .pq-tkt.right .pq-stub{border-right-color:#9fd3b4;}
        .pq0608 .pq-lbl{flex:1;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;letter-spacing:1px;}
        .pq0608 .pq-tkt.right .pq-lbl{color:#1a7f43;}
        .pq0608 .pq-punch{position:absolute;top:8px;right:9px;line-height:0;animation:pqPop .35s ease both;}
        .pq0608 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0608 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0608 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(430px);}}
        @keyframes pqRoad{from{background-position:0 0;}to{background-position:-26px 0;}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqStarIn{from{opacity:0;transform:scale(.2) rotate(-40deg);}to{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pqTwinkle{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 330 * scale, height: 186 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-road" /><span className="pq-roadline" />
        <div className="pq-buspos">
          <div className={'pq-busidle' + (ok ? ' cele' : '')}><Bus open={!!ok} /></div>
        </div>
        <div className="pq-keywrap">
          <Key win={!!ok} />
          {ok && STARS.map((s, i) => (
            <span key={i} className="pq-star" style={{ left: s.l, top: s.t, animationDelay: `${s.d}s, ${0.7 + s.d}s` }}><Star size={s.s} /></span>
          ))}
        </div>
      </div>
      </div>

      <div className="pq-cards">
        {PAIRS.map((p, i) => {
          const good = p.a + p.b === SUM;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
          return (
            <div key={i} className="pq-float" style={{ animationDelay: `${-(i * 0.55)}s` }}>
              <button type="button" className={'pq-tkt' + cls} disabled={lock} onClick={() => toggle(i)}>
                <span className="pq-perf top" aria-hidden="true" />
                <span className="pq-perf bot" aria-hidden="true" />
                <span className="pq-stub"><BusMini /></span>
                <span className="pq-lbl">{p.a} + {p.b}</span>
                {ok && good && <span className="pq-punch"><Punch /></span>}
              </button>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
