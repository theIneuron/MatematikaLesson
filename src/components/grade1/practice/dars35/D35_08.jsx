// Dars35 · Amaliyot 08 — «Massa · kilogramm» · Blok 7 · 🔴 · tag: multi_5kg
// KONSEPT: jami 5 kg. Ko'p-tanlov: 4 juft-karta, jami 5 kg bo'lganlarini BARCHASINI belgilang.
// TABIAT SAHNASI (Dars15 kabi) + BRONZA TURAR TAROZI (Dars12/Dars35 kanoni): 5-kg GIR o'ng pallaga
// TUSHADI → nur o'sha tomonga silliq EGILADI (nishon halol ko'rsatiladi).
// Kartalar: [0] 2+3=5 to'g'ri  [1] 4+1=5 to'g'ri  [2] 1+4=5 to'g'ri  [3] 2+2=4 tuzoq (M3 kg-yig'indi xato).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida. REVIEW/.still: yakuniy holat, animatsiyasiz.
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

const TARGET = 5;
const CARDS = [
  { a: 2, b: 3 }, // 5 to'g'ri
  { a: 4, b: 1 }, // 5 to'g'ri
  { a: 1, b: 4 }, // 5 to'g'ri
  { a: 2, b: 2 }, // 4 tuzoq
];
const cardVal = (c) => c.a + c.b;
const GOOD = CARDS.map((c, i) => (cardVal(c) === TARGET ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const cardLabel = (c) => `${c.a} kg + ${c.b} kg`;

const DATA = { good: GOOD, target: TARGET, unit: 'kg', ptype: 'multi', level: '🔴', tag: 'multi_5kg' };

const T = {
  uz: {
    eyebrow: "Massa · Kilogramm",
    title: "Nishon: 5 kg",
    setup: "Tarozida nishon — 5 kg.",
    ask: "Jami 5 kg bo'lgan barcha juftlarni belgilang.",
    correct: "Barakalla! Uch juftning jami 5 kg.",
    hint: "Har juftni qo'shing: jami 5 kg mi?",
  },
  ru: {
    eyebrow: "Масса · Килограмм",
    title: "Цель: 5 кг",
    setup: "На весах цель — 5 кг.",
    ask: "Отметь все пары, дающие 5 кг.",
    correct: "Молодец! У трёх пар всего 5 кг.",
    hint: "Сложи каждую пару: получается 5 кг?",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const Star = ({ fill }) => (<svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>);

const Bird = ({ cls }) => (
  <svg className={'pq-bird ' + cls} viewBox="0 0 22 9" width="22" height="9" aria-hidden="true">
    <path d="M1 7 Q5.5 1 10 6 Q14.5 1 21 7" fill="none" stroke="#6a7b84" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const Tuft = ({ cls }) => (
  <svg className={'pq-tuft ' + cls} viewBox="0 0 18 13" width="18" height="13" aria-hidden="true">
    <path d="M2 13 Q3.4 4 5 13 M7 13 Q9 2 10.6 13 M12.5 13 Q14 5 15.6 13" fill="none" stroke="#4e9d44" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// BRONZA TAROZI: o'ng pallada 5-kg GIR (nishon). Gir tushadi → nur o'ngga egiladi (STATE + transition).
const PIVOT_X = 170, PIVOT_Y = 52, ARM = 96, PAN_Y = 88;
const BrassBalance = ({ tilt, dropped, celebrate }) => {
  const ax = PIVOT_X - ARM, bx = PIVOT_X + ARM;
  const Cords = ({ x }) => (
    <g stroke="#9C7A38" strokeWidth="1.6" fill="none">
      <line x1={x} y1={PIVOT_Y + 3} x2={x - 26} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x} y2={PAN_Y - 2} />
      <line x1={x} y1={PIVOT_Y + 3} x2={x + 26} y2={PAN_Y - 2} />
      <circle cx={x} cy={PIVOT_Y + 3} r="2.8" fill="#B8954E" stroke="none" />
    </g>
  );
  const Pan = ({ x, w }) => (
    <g>
      <path d={`M${x - 31} ${PAN_Y} Q${x} ${PAN_Y + 22} ${x + 31} ${PAN_Y} Z`} fill="url(#b08pan)" stroke={w ? '#1a7f43' : '#9C7A38'} strokeWidth="1.6" />
      <ellipse cx={x} cy={PAN_Y} rx="31" ry="5" fill="url(#b08rim)" stroke={w ? '#1a7f43' : '#9C7A38'} strokeWidth="1.4" />
    </g>
  );
  return (
    <svg viewBox="0 0 340 216" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="b08brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0DCAE" /><stop offset=".5" stopColor="#D8B878" /><stop offset="1" stopColor="#A8843E" /></linearGradient>
        <linearGradient id="b08post" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A8843E" /><stop offset=".42" stopColor="#E8C98A" /><stop offset=".58" stopColor="#D8B878" /><stop offset="1" stopColor="#9A7634" /></linearGradient>
        <linearGradient id="b08pan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8D2A0" /><stop offset=".55" stopColor="#D7B87A" /><stop offset="1" stopColor="#B5914E" /></linearGradient>
        <linearGradient id="b08rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5EBCF" /><stop offset="1" stopColor="#D7B87A" /></linearGradient>
        <radialGradient id="b08knob" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F3E5C2" /><stop offset="1" stopColor="#B8954E" /></radialGradient>
        <linearGradient id="b08gir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFD4DA" /><stop offset=".45" stopColor="#8A9099" /><stop offset="1" stopColor="#565B63" /></linearGradient>
      </defs>
      <ellipse cx="170" cy="209" rx="76" ry="6" fill="rgba(40,60,30,.18)" />
      <rect x="122" y="195" width="96" height="12" rx="6" fill="url(#b08brass)" stroke="#9A7634" strokeWidth="1.2" />
      <rect x="148" y="187" width="44" height="9" rx="4.5" fill="url(#b08brass)" stroke="#9A7634" strokeWidth="1" />
      <rect x="164" y="64" width="13" height="126" rx="6" fill="url(#b08post)" stroke="#9A7634" strokeWidth="1" />
      <path d={`M${PIVOT_X} 40 L155 67 L185 67 Z`} fill="#B8954E" stroke="#9A7634" strokeWidth="1" />
      <g className="pq-beam" transform={`rotate(${tilt} ${PIVOT_X} ${PIVOT_Y})`}>
        <rect x={ax - 8} y={PIVOT_Y - 5} width={ARM * 2 + 16} height="10" rx="5" fill="url(#b08brass)" stroke="#9A7634" strokeWidth="1.2" />
        {/* CHAP palla — bo'sh */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${ax} ${PIVOT_Y})`}>
          <Cords x={ax} />
          <Pan x={ax} w={false} />
        </g>
        {/* O'NG palla — 5-kg GIR (nishon) */}
        <g className="pq-arm" transform={`rotate(${-tilt} ${bx} ${PIVOT_Y})`}>
          <Cords x={bx} />
          <Pan x={bx} w={celebrate} />
          {dropped && (
            <g className={'pq-drop' + (celebrate ? ' pq-cele' : '')}>
              <g transform={`translate(${bx} ${PAN_Y - 1}) scale(1.18)`}>
                <path d="M-7 -26 a7 7 0 0 1 14 0" fill="none" stroke="#6A7078" strokeWidth="3.6" />
                <path d="M-12 -26 h24 l3 22 a4 4 0 0 1 -4 4 h-22 a4 4 0 0 1 -4 -4Z" fill="url(#b08gir)" stroke="#565B62" strokeWidth="1" />
                <path d="M-10 -25 h5 l-2 28 h-1 a3 3 0 0 1 -3 -3Z" fill="rgba(255,255,255,.26)" />
                <text x="0" y="-9" fontSize="13" textAnchor="middle" fill="#fff" fontWeight="800" fontFamily="'JetBrains Mono',monospace">5</text>
                <text x="0" y="-2" fontSize="6" textAnchor="middle" fill="rgba(255,255,255,.92)" fontFamily="'JetBrains Mono',monospace">kg</text>
              </g>
            </g>
          )}
        </g>
      </g>
      <circle cx={PIVOT_X} cy={PIVOT_Y} r="9" fill="url(#b08knob)" stroke="#9A7634" strokeWidth="1.2" />
    </svg>
  );
};

export default function D35_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => (lang === 'ru' ? String(s).replace(/kg/g, 'кг') : s);
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Kirish xronikasi: gir tushadi, so'ng nur egiladi. still → darrov yakuniy.
  const [stage, setStage] = useState(still ? 2 : 0);

  useEffect(() => {
    if (still) { setStage(2); return; }
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [still]);

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
  // Gir (o'ng) og'ir → nur o'ngga egiladi. STATE + transition = silliq fizik harakat.
  const tilt = stage >= 2 ? 9 : 0;

  const [fitRef, scale] = useFitScale(404);

  return (
    <div className={"pq pq3508" + (still ? " still" : "")} ref={fitRef}>
      <style>{`
        .pq3508.still *{animation:none !important;transition:none !important;}
        .pq3508{box-sizing:border-box;max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3508 *{box-sizing:border-box;}
        .pq3508 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#4e9d54;text-transform:uppercase;}
        .pq3508 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3508 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3508 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        /* ===== TABIAT SAHNASI (Dars15 kanoni) ===== */
        .pq3508 .pq-scene{box-sizing:border-box;position:relative;width:404px;height:296px;border-radius:24px;overflow:hidden;border:2px solid #bfe0d0;background:linear-gradient(#bfe6fb 0%,#d9f1fd 42%,#eaf8ff 62%);box-shadow:inset 0 2px 8px rgba(90,140,180,.14);}
        .pq3508 .pq-fit{position:relative;margin:0 auto;}
        .pq3508 .pq-sun{position:absolute;top:14px;left:18px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 42% 40%,#fff6cf,#ffd84a 68%,#f6b81f);box-shadow:0 0 22px 7px rgba(255,214,74,.6);animation:pq3508sun 4s ease-in-out infinite;z-index:1;}
        .pq3508 .pq-cloud{position:absolute;height:16px;background:#fff;border-radius:20px;box-shadow:0 6px 0 -2px #fff;opacity:.94;z-index:1;}
        .pq3508 .pq-cloud::before,.pq3508 .pq-cloud::after{content:'';position:absolute;background:#fff;border-radius:50%;}
        .pq3508 .pq-cloud::before{width:22px;height:22px;top:-9px;left:8px;} .pq3508 .pq-cloud::after{width:16px;height:16px;top:-6px;left:26px;}
        .pq3508 .pq-cloud.c1{top:28px;left:60%;width:46px;animation:pq3508drift 14s ease-in-out infinite;}
        .pq3508 .pq-cloud.c2{top:58px;left:30%;width:34px;transform:scale(.8);animation:pq3508drift 18s ease-in-out infinite reverse;}
        .pq3508 .pq-hills{position:absolute;left:0;right:0;bottom:72px;height:60px;z-index:1;}
        .pq3508 .pq-hills span{position:absolute;bottom:0;border-radius:50% 50% 0 0;background:linear-gradient(#9ad673,#7cc158);}
        .pq3508 .pq-hills span:nth-child(1){left:-8%;width:52%;height:52px;background:linear-gradient(#a7dd82,#8ecb6a);}
        .pq3508 .pq-hills span:nth-child(2){right:-6%;width:48%;height:60px;}
        .pq3508 .pq-hills span:nth-child(3){left:32%;width:40%;height:44px;background:linear-gradient(#a2da7c,#86c663);}
        .pq3508 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:80px;background:linear-gradient(#84c95f 0%,#69b34c 60%,#5aa53f 100%);z-index:2;}
        .pq3508 .pq-grass::before{content:'';position:absolute;left:0;right:0;top:-6px;height:10px;background:radial-gradient(circle at 6px 10px,#84c95f 6px,transparent 7px) repeat-x;background-size:16px 10px;}
        .pq3508 .pq-flower{position:absolute;width:7px;height:7px;border-radius:50%;z-index:3;}
        .pq3508 .pq-flower::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ffd94a;}
        .pq3508 .pq-flower.f1{left:9%;bottom:56px;background:#ffd94a;box-shadow:5px 0 0 #ffd94a,-5px 0 0 #ffd94a,0 5px 0 #ffd94a,0 -5px 0 #ffd94a;}
        .pq3508 .pq-flower.f2{right:8%;bottom:50px;background:#fff;box-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff;}
        .pq3508 .pq-flower.f3{left:19%;bottom:22px;transform:scale(.85);background:#c79bf0;box-shadow:5px 0 0 #c79bf0,-5px 0 0 #c79bf0,0 5px 0 #c79bf0,0 -5px 0 #c79bf0;}
        .pq3508 .pq-flower.f4{right:18%;bottom:20px;transform:scale(.8);background:#ff9ec4;box-shadow:5px 0 0 #ff9ec4,-5px 0 0 #ff9ec4,0 5px 0 #ff9ec4,0 -5px 0 #ff9ec4;}
        .pq3508 .pq-tuft{position:absolute;z-index:3;}
        .pq3508 .pq-tuft.t1{left:27%;bottom:52px;} .pq3508 .pq-tuft.t2{right:27%;bottom:58px;transform:scale(.85);}
        .pq3508 .pq-tree{position:absolute;left:8px;bottom:66px;width:46px;height:56px;z-index:2;}
        .pq3508 .pq-tree i{position:absolute;}
        .pq3508 .pq-trunk{left:19px;bottom:0;width:8px;height:20px;background:linear-gradient(90deg,#8a5a2c,#a9743e);border-radius:2px;}
        .pq3508 .pq-leaves{left:0;bottom:14px;width:46px;height:42px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#93d36e,#5da845);box-shadow:13px 8px 0 -8px #6fb552,-9px 9px 0 -10px #67ac4c;}
        .pq3508 .pq-bush{position:absolute;right:12px;bottom:62px;width:36px;height:22px;border-radius:16px 16px 3px 3px;background:radial-gradient(circle at 38% 28%,#86c95f,#5aa542);z-index:2;box-shadow:-13px 3px 0 -7px #6fb552;}
        .pq3508 .pq-bfly{position:absolute;width:8px;height:8px;z-index:5;}
        .pq3508 .pq-bfly::before,.pq3508 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq3508 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq3508wing .26s ease-in-out infinite alternate;}
        .pq3508 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq3508wing .26s ease-in-out infinite alternate;}
        .pq3508 .pq-bfly.bf1::before,.pq3508 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq3508 .pq-bfly.bf2::before,.pq3508 .pq-bfly.bf2::after{background:#8ec6ff;}
        .pq3508 .pq-bfly.bf1{top:88px;left:14%;animation:pq3508flit1 8s ease-in-out infinite;}
        .pq3508 .pq-bfly.bf2{top:110px;right:12%;animation:pq3508flit2 9s ease-in-out infinite;}
        .pq3508 .pq-bird{position:absolute;z-index:1;opacity:.7;}
        .pq3508 .pq-bird.b1{top:22px;left:42%;animation:pq3508bird 7s ease-in-out infinite;}
        .pq3508 .pq-bird.b2{top:40px;left:58%;transform:scale(.78);animation:pq3508bird 9s ease-in-out infinite;}
        .pq3508 .pq-badge{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;padding:5px 15px 6px;border-radius:11px;background:linear-gradient(#d19b5c,#b67c3f);border:2px solid #93602c;color:#fff3df;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 0 #8a5926,0 5px 9px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3508 .pq-balwrap{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);width:310px;max-width:90%;z-index:4;}
        .pq3508 .pq-beam,.pq3508 .pq-arm{transition:transform .9s cubic-bezier(.34,1.25,.45,1);}
        .pq3508 .pq-drop{animation:pq3508drop .55s cubic-bezier(.34,1.35,.5,1) both;}
        .pq3508 .pq-cele{animation:pq3508cele .6s ease;}
        /* kartalar */
        .pq3508 .pq-cards{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:11px;justify-content:center;padding:14px 0 4px;max-width:404px;margin:0 auto;}
        .pq3508 .pq-card{position:relative;min-width:130px;flex:1 1 130px;max-width:190px;display:flex;align-items:center;justify-content:center;padding:15px 12px;border-radius:16px;border:2.5px solid #d6dae3;background:#ffffff;color:#3a3324;cursor:pointer;transition:.14s;box-shadow:0 2px 5px rgba(60,90,50,.12);font-family:inherit;}
        .pq3508 .pq-card:hover:not(:disabled){border-color:#7cc158;transform:translateY(-2px);box-shadow:0 5px 12px rgba(60,90,50,.18);}
        .pq3508 .pq-card:active:not(:disabled){transform:scale(.97);}
        .pq3508 .pq-card:disabled{cursor:default;}
        .pq3508 .pq-card.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14),0 2px 6px rgba(37,99,235,.18);}
        .pq3508 .pq-card.won{border-color:#1a7f43;background:#eaf8ef;animation:pq3508cele .55s ease;}
        .pq3508 .pq-card.dim{opacity:.42;filter:grayscale(.32);}
        .pq3508 .pq-clabel{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;justify-content:center;font-size:21px;font-weight:900;color:#33404f;font-variant-numeric:tabular-nums;letter-spacing:.01em;}
        .pq3508 .pq-card.won .pq-clabel{color:#1a7f43;}
        .pq3508 .pq-eq{color:#1a7f43;font-size:17px;font-weight:900;white-space:nowrap;animation:pq3508pop .4s ease both;}
        .pq3508 .pq-spark{position:absolute;top:7px;right:10px;line-height:0;animation:pq3508tw 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3508 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3508in .22s ease both;}
        .pq3508 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3508 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3508sun{0%,100%{transform:scale(1);box-shadow:0 0 20px 6px rgba(255,214,74,.55);}50%{transform:scale(1.06);box-shadow:0 0 26px 9px rgba(255,214,74,.7);}}
        @keyframes pq3508drift{0%,100%{transform:translateX(0);}50%{transform:translateX(-16px);}}
        @keyframes pq3508wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq3508flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(26px,-12px);}50%{transform:translate(48px,6px);}75%{transform:translate(20px,-6px);}}
        @keyframes pq3508flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-24px,10px);}50%{transform:translate(-44px,-8px);}75%{transform:translate(-18px,6px);}}
        @keyframes pq3508bird{0%,100%{transform:translate(0,0);}50%{transform:translate(-34px,-6px);}}
        @keyframes pq3508drop{0%{opacity:0;transform:translateY(-88px);}60%{opacity:1;transform:translateY(4px);}80%{transform:translateY(-2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pq3508pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3508tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3508cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq3508in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 404 * scale, height: 296 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <Bird cls="b1" /><Bird cls="b2" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-hills"><span /><span /><span /></div>
        <div className="pq-grass" />
        <div className="pq-tree"><i className="pq-trunk" /><i className="pq-leaves" /></div>
        <span className="pq-bush" />
        <Tuft cls="t1" /><Tuft cls="t2" />
        <span className="pq-flower f1" /><span className="pq-flower f2" /><span className="pq-flower f3" /><span className="pq-flower f4" />
        <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
        <div className="pq-badge">{t.title}</div>

        {/* 5-kg gir pallaga tushadi → nur egiladi (nishon halol) */}
        <div className="pq-balwrap"><BrassBalance tilt={tilt} dropped={stage >= 1} celebrate={!!ok} /></div>
        </div>
      </div>

      <div className="pq-cards">
        {CARDS.map((c, i) => {
          const good = cardVal(c) === TARGET;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
          return (
            <button key={i} type="button" className={'pq-card' + cls} disabled={lock}
              onClick={() => toggle(i)} aria-label={uL(cardLabel(c))}>
              <div className="pq-clabel">
                <span>{uL(cardLabel(c))}</span>
                {ok && good && <b className="pq-eq">{uL('= 5 kg')}</b>}
              </div>
              {ok && good && <span className="pq-spark"><Star fill="#f2b134" /></span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
