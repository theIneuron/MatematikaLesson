// Dars28 · Amaliyot 08 — Ko'p-tanlov «Olma bog'i» · 🔴 · tag: sum_multi
// Ko'p-tanlov: 5 ifoda-karta. Javobi aynan 59 bo'lgan BARCHA misolni belgilang.
// [0] "34 + 25" =59 to'g'ri  [1] "43 + 16" =59 to'g'ri  [2] "36 + 23" =59 to'g'ri
// [3] "34 + 15" =49 tuzoq  [4] "42 + 16" =58 tuzoq. GOOD = {0,1,2}. TARGET = 59.
// SAHNA (Dars15 etaloni bo'yicha qayta qurilgan): qatlamli TOZA tabiat — osmon, quyosh,
// bulutlar, tepaliklar, maysa, gullar, ikki olma daraxti MAYSADA turadi; markazda yog'och
// TAXTACHA «= 59» (nishon-son katta va o'qiladigan), yonida quyoncha maskot (idle).
// Kartalar sahnadan PASTDA, toza och panelda — fon va topshiriq endi aralashmaydi.
// G'alabada: to'g'ri kartalarda «= 59» ochiladi + yulduzcha, taxtacha selebratsiya,
// quyoncha ikki marta sakraydi, sahnada uchqunlar.
// VEDI-DO-VERNOGO: noto'g'rida qulf yo'q, retry yo'q; setChecked FAQAT to'g'rida.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 59;
// Har karta: a + b yig'indi (razryad oshmaydi).
const CARDS = [
  { a: 34, b: 25 }, // 34 + 25 = 59 to'g'ri
  { a: 43, b: 16 }, // 43 + 16 = 59 to'g'ri
  { a: 36, b: 23 }, // 36 + 23 = 59 to'g'ri
  { a: 34, b: 15 }, // 34 + 15 = 49 tuzoq
  { a: 42, b: 16 }, // 42 + 16 = 58 tuzoq
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} + ${c.b}`;

const DATA = { good: GOOD, target: TARGET, ptype: 'sum_multi', level: '🔴', tag: 'sum_multi' };

const T = {
  uz: {
    eyebrow: "Olma bog'i · Masala",
    title: "Javobi 59",
    setup: "Taxtachada 59 turibdi.",
    ask: "Javobi 59 bo'lgan barcha misollarni bosing.",
    correct: "Barakalla! 34+25, 43+16, 36+23 — hammasi 59.",
    hint: "Har misolda o'nliklarni va birliklarni qo'shing.",
  },
  ru: {
    eyebrow: "Яблоневый сад · Задача",
    title: "Ответ 59",
    setup: "На табличке число 59.",
    ask: "Нажми все примеры с ответом 59.",
    correct: "Молодец! 34+25, 43+16, 36+23 — все дают 59.",
    hint: "В каждом примере сложи десятки и единицы.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

// QUYONCHA maskot (Dars15 etaloni, yon ko'rinish) — maysada turadi, g'alabada sakraydi. Dekor, bosilmaydi.
const Bunny = () => (
  <svg viewBox="0 0 52 48" width="44" height="40.6" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="pq2808fur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d7c8b7" /><stop offset="1" stopColor="#bda98f" />
      </linearGradient>
      <linearGradient id="pq2808hd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddcfbf" /><stop offset="1" stopColor="#c6b399" />
      </linearGradient>
    </defs>
    <ellipse cx="26" cy="45" rx="16" ry="2.8" fill="rgba(0,0,0,.13)" />
    <circle cx="8.5" cy="30" r="6" fill="#fdfbf7" stroke="#e6ddd0" strokeWidth="1" />
    <path d="M30 20 C25 8 27 1.5 29.5 1.8 C32 2.1 33 9 33.2 19 Z" fill="#c2b096" stroke="#a08b70" strokeWidth="1" />
    <path d="M7 33 C6 22 15 17 26 18.5 C37 20 42 26 41 33 C40 41 31 43.5 21 43 C12 42.6 8 39 7 33 Z" fill="url(#pq2808fur)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M13 36 C15 42 32 43 36 38 C33 43 15 43.5 12 38 Z" fill="#efe6d6" opacity=".7" />
    <ellipse cx="17" cy="41.5" rx="10" ry="4" fill="#cbb8a0" stroke="#ac9678" strokeWidth="1" />
    <circle cx="9" cy="41.5" r="2.1" fill="#e6dccb" />
    <circle cx="39" cy="25" r="10" fill="url(#pq2808hd)" stroke="#b09a7e" strokeWidth="1" />
    <path d="M35 18 C31.5 5 35 0 37.7 0.4 C40.4 0.8 41 9 40 18 Z" fill="url(#pq2808hd)" stroke="#a8977f" strokeWidth="1" />
    <path d="M36.4 17 C34 7.5 36.2 3.6 37.6 3.8 C39 4 39.4 9.5 38.8 17 Z" fill="#f3bccb" />
    <ellipse cx="41" cy="29" rx="4.5" ry="3" fill="#d3c0a6" opacity=".55" />
    <ellipse cx="41.6" cy="23.4" rx="2.1" ry="2.4" fill="#3a322c" />
    <circle cx="42.4" cy="22.5" r="0.8" fill="#fff" />
    <path d="M47.6 26.4 L45.4 25.3 L45.4 27.5 Z" fill="#e08aa0" />
    <path d="M46.4 27.3 Q46.4 29 45 29" fill="none" stroke="#a8977f" strokeWidth="0.8" strokeLinecap="round" />
    <g stroke="#c9b79c" strokeWidth="0.7" strokeLinecap="round">
      <line x1="46" y1="26" x2="52" y2="24.5" /><line x1="46" y1="27" x2="52" y2="27" /><line x1="46" y1="28" x2="51.5" y2="29.5" />
    </g>
    <ellipse cx="34.5" cy="42" rx="5" ry="3" fill="#d3c0a6" stroke="#ac9678" strokeWidth="1" />
  </svg>
);

export default function D28_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => cardVal(CARDS[i]) === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: CARDS.map(cardLabel), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq2808">
      <style>{`
        .pq2808{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2808 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a41;text-transform:uppercase;}
        .pq2808 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq2808 .pq-setup{color:#5c6672;font-weight:500;font-variant-numeric:tabular-nums;}
        .pq2808 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums;}

        .pq2808 .pq-wrap{border-radius:22px;border:2px solid #cfe6c6;background:linear-gradient(#fbfdf8,#f0f7ea);overflow:hidden;}
        /* ===== TABIAT SAHNASI (Dars15 qatlamlari: osmon -> bulut -> tepalik -> maysa -> daraxt/gul -> taxtacha) ===== */
        .pq2808 .pq-scene{position:relative;height:172px;background:linear-gradient(#bfe6fb 0%,#d9f1fd 46%,#eaf8ff 66%);overflow:hidden;}
        .pq2808 .pq-sun{position:absolute;top:14px;left:18px;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 20px 6px rgba(255,214,74,.55);animation:pq2808sun 4s ease-in-out infinite;z-index:1;pointer-events:none;}
        .pq2808 .pq-cloud{position:absolute;height:15px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;pointer-events:none;}
        .pq2808 .pq-cloud::before,.pq2808 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq2808 .pq-cloud::before{width:20px;height:20px;top:-8px;left:8px;} .pq2808 .pq-cloud::after{width:14px;height:14px;top:-5px;left:24px;}
        .pq2808 .pq-cloud.c1{top:18px;left:58%;width:44px;animation:pq2808drift 14s ease-in-out infinite;}
        .pq2808 .pq-cloud.c2{top:44px;left:30%;width:32px;transform:scale(.8);animation:pq2808drift 18s ease-in-out infinite reverse;}
        .pq2808 .pq-hills{position:absolute;left:0;right:0;bottom:48px;height:56px;z-index:1;pointer-events:none;}
        .pq2808 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq2808 .pq-hills span:nth-child(1){left:-8%;width:54%;height:46px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq2808 .pq-hills span:nth-child(2){right:-6%;width:50%;height:56px;}
        .pq2808 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:52px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;pointer-events:none;}
        .pq2808 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        /* olma daraxtlari — maysada turadi (osmonda "suzmaydi") */
        .pq2808 .pq-tree{position:absolute;bottom:40px;z-index:3;pointer-events:none;transform-origin:50% 100%;}
        .pq2808 .pq-tree.t1{left:12px;animation:pq2808sway 4.2s ease-in-out infinite;}
        .pq2808 .pq-tree.t2{right:12px;animation:pq2808sway 4.8s ease-in-out .6s infinite;}
        .pq2808 .pq-trunk{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);width:9px;height:26px;border-radius:3px;background:linear-gradient(#9a6a3a,#734b26);}
        .pq2808 .pq-crown{position:relative;width:56px;height:46px;border-radius:50%;background:radial-gradient(circle at 40% 34%,#7cc86a,#4d9d43 68%,#3c8438);box-shadow:inset 0 -4px 8px rgba(0,0,0,.12);}
        .pq2808 .pq-crown i{position:absolute;width:9px;height:9px;border-radius:50%;background:#e0392f;box-shadow:0 1px 1px rgba(0,0,0,.25);}
        /* gullar — maysada */
        .pq2808 .pq-flower{position:absolute;width:6px;height:6px;border-radius:50%;z-index:3;pointer-events:none;}
        .pq2808 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq2808 .pq-flower.f1{left:20%;bottom:30px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq2808 .pq-flower.f2{left:33%;bottom:18px;background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq2808 .pq-flower.f3{right:26%;bottom:24px;background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        /* YOG'OCH TAXTACHA — nishon-son «= 59» (Dars15 taxtacha uslubi) */
        .pq2808 .pq-sign{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:5;display:flex;flex-direction:column;align-items:center;gap:5px;padding:9px 16px 11px;border-radius:14px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;box-shadow:0 5px 0 #8a5926,0 8px 12px rgba(0,0,0,.16),inset 0 2px 0 rgba(255,255,255,.28);pointer-events:none;}
        .pq2808 .pq-sign::before,.pq2808 .pq-sign::after{content:'';position:absolute;top:100%;width:7px;height:34px;background:linear-gradient(90deg,#7d5122,#9c6a30);border-radius:0 0 3px 3px;box-shadow:0 2px 3px rgba(0,0,0,.15);}
        .pq2808 .pq-sign::before{left:22px;} .pq2808 .pq-sign::after{right:22px;}
        .pq2808 .pq-ttl{font-size:11.5px;font-weight:800;letter-spacing:.03em;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);white-space:nowrap;}
        .pq2808 .pq-trow{display:flex;align-items:center;gap:8px;}
        .pq2808 .pq-teq{font-size:24px;font-weight:900;color:#fbe9d2;text-shadow:0 1px 1px rgba(0,0,0,.25);}
        .pq2808 .pq-tnum{min-width:52px;height:48px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;border-radius:12px;background:#e8f7ee;border:2.5px solid #1a7f43;color:#1a7f43;font-variant-numeric:tabular-nums;box-shadow:0 2px 4px rgba(60,40,15,.25);}
        /* quyoncha maskot — maysada, taxtacha yonida */
        .pq2808 .pq-bun{position:absolute;bottom:38px;left:65%;z-index:4;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq2808 .pq-bunin{display:block;transform-origin:bottom center;animation:pq2808idle 2.8s ease-in-out infinite;}
        .pq2808 .pq-bun.hop .pq-bunin{animation:pq2808hop .68s ease 2;}
        .pq2808 .pq-spk{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq2808tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq2808 .pq-spk.s2{animation-delay:-.6s;} .pq2808 .pq-spk.s3{animation-delay:-1.15s;}

        /* ===== KARTALAR — sahnadan pastda, toza panelda ===== */
        .pq2808 .pq-cards{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:16px 12px 16px;}
        .pq2808 .pq-card{position:relative;min-width:132px;display:flex;align-items:center;justify-content:center;padding:16px 16px;border-radius:16px;border:2.5px solid #dbe2ec;background:#ffffff;color:#2a3140;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(80,130,90,.14);font-family:inherit;}
        .pq2808 .pq-card:hover:not(:disabled){border-color:#8fcf83;transform:translateY(-2px);box-shadow:0 5px 12px rgba(80,130,90,.22);}
        .pq2808 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq2808 .pq-card:disabled{cursor:default;}
        .pq2808 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq2808 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq2808cele .55s ease;}
        .pq2808 .pq-card.dim{opacity:.42;filter:grayscale(.32);}
        .pq2808 .pq-clabel{display:flex;align-items:baseline;gap:8px;font-size:26px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq2808 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq2808 .pq-ceq{color:#1a7f43;font-size:20px;font-weight:900;animation:pq2808pop .4s ease both;}
        .pq2808 .pq-cstar{position:absolute;top:7px;right:10px;line-height:0;animation:pq2808tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}

        .pq2808 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2808in .22s ease both;}
        .pq2808 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2808 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pq2808sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq2808drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq2808sway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.2deg);}}
        @keyframes pq2808idle{0%,100%{transform:translateY(0) scaleY(1);}50%{transform:translateY(-1.5px) scaleY(1.02);}}
        @keyframes pq2808hop{0%{transform:translateY(0) scaleY(.86);}18%{transform:translateY(0) scaleY(1.05);}45%{transform:translateY(-22px) scaleY(1.08);}80%{transform:translateY(0) scaleY(.82);}100%{transform:translateY(0) scaleY(1);}}
        @keyframes pq2808pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2808tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2808cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2808in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        /* taxtacha translateX bilan markazda — cele transformni buzmasin */
        @keyframes pq2808celeSign{0%{transform:translateX(-50%) scale(1);}30%{transform:translateX(-50%) scale(1.06);}60%{transform:translateX(-50%) scale(.97);}100%{transform:translateX(-50%) scale(1);}}
        .pq2808 .pq-sign.win{animation:pq2808celeSign .6s ease;}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-wrap">
        {/* Qatlamli tabiat sahnasi: fon (osmon/tepalik/maysa) aniq ORQADA, taxtacha «= 59» aniq OLDINDA */}
        <div className="pq-scene">
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <div className="pq-hills"><span /><span /></div>
          <div className="pq-grass" />
          <div className="pq-tree t1"><span className="pq-crown"><i style={{ left: '14px', top: '16px' }} /><i style={{ left: '34px', top: '10px' }} /><i style={{ left: '25px', top: '29px' }} /></span><span className="pq-trunk" /></div>
          <div className="pq-tree t2"><span className="pq-crown"><i style={{ left: '12px', top: '12px' }} /><i style={{ left: '32px', top: '22px' }} /><i style={{ left: '22px', top: '32px' }} /></span><span className="pq-trunk" /></div>
          <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" />

          {/* nishon-son: shu songa teng misollar qidiriladi */}
          <div className={'pq-sign' + (ok ? ' win' : '')}>
            <span className="pq-ttl">{t.title}</span>
            <span className="pq-trow"><span className="pq-teq">=</span><b className="pq-tnum">{TARGET}</b></span>
          </div>

          {/* quyoncha maskot — g'alabada sakraydi */}
          <span className={'pq-bun' + (ok ? ' hop' : '')}><span className="pq-bunin"><Bunny /></span></span>

          {ok && (<>
            <span className="pq-spk" style={{ left: '20%', top: '38px' }}>✦</span>
            <span className="pq-spk s2" style={{ left: '78%', top: '52px' }}>✦</span>
            <span className="pq-spk s3" style={{ left: '50%', top: '18px' }}>✦</span>
          </>)}
        </div>

        {/* Misol-kartalar — toza panelda, fon bezaklari bilan aralashmaydi */}
        <div className="pq-cards">
          {CARDS.map((c, i) => {
            const good = cardVal(c) === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={cardLabel(c)}>
                <div className="pq-clabel">
                  <span>{cardLabel(c)}</span>
                  {ok && good && <b className="pq-ceq">= {TARGET}</b>}
                </div>
                {ok && good && <span className="pq-cstar"><Star fill="#f2b134" /></span>}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
