// Dars11 · Amaliyot 08 — P11 Ko'p-tanlov «Poyezd bekati» · 🔴 · tag: equal_pairs_multi
// O'rin almashtirish qonuni: 5 poyezd-beletda tenglik yozilgan; faqat chap=o'ng (haqiqiy o'rin
// almashtirish) bo'lganlarini tanlash — {4+3=3+4, 2+5=5+2, 6+1=1+6}. Ikki tuzoq: 4+3=3+3,
// 2+5=5+3 (sonlar boshqa). G'alabada to'g'rilari yashil «to'g'ri» + ko'k sanoq 1..3, tuzoqlari
// xira «✗». Sahna DOIM harakatda: g'ildiraklar aylanadi, mo'ridan bug', mashinist ko'z
// pirpiratadi, semafor almashadi, bulutlar suzadi, quyosh breath, rels oqadi. Beletlar bosiladi —
// bosiladigan nishonda doimiy siljish YO'Q (qoida).
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Sonlar qat'iy 0-10. Bu dars — o'rin almashtirish (faqat qo'shish, ayirish yo'q).
const CARDS = [
  { l: [4, 3], r: [3, 4] }, // ✓ o'rin almashdi
  { l: [2, 5], r: [5, 2] }, // ✓ o'rin almashdi
  { l: [6, 1], r: [1, 6] }, // ✓ o'rin almashdi
  { l: [4, 3], r: [3, 3] }, // ✗ tuzoq — o'ngda son boshqa (4→3)
  { l: [2, 5], r: [5, 3] }, // ✗ tuzoq — o'ngda son boshqa (2→3)
];
// Haqiqiy o'rin almashtirish: chapdagi juft = o'ngdagi juftning teskarisi.
const isGood = (c) => c.l[0] === c.r[1] && c.l[1] === c.r[0];
const GOOD = CARDS.map((c, i) => (isGood(c) ? i : -1)).filter((i) => i >= 0); // [0,1,2]
const DATA = { ptype: 'P11', level: '🔴', tag: 'equal_pairs_multi' };
const BARS = [2, 3, 2, 4, 2, 3, 4, 2, 3, 2];

const T = {
  uz: {
    eyebrow: "Poyezd bekati · Tengliklar", title: "To'g'ri tengliklar",
    setup: "Kartalarda tengliklar yozilgan — faqat o'rin almashtirish qonuni to'g'ri bo'lganlari haqiqiy.",
    ask: "To'g'ri yozilgan BARCHA tengliklarni bosing.",
    correct: "Barakalla! Uchala to'g'ri tenglik topildi — o'rin almashsa, yig'indi teng!",
    hint: "Har tenglikni tekshiring: chap va o'ngdagi sonlar bir xilmi, faqat o'rni almashganmi?",
    ticket: "BELET", okTag: "to'g'ri",
  },
  ru: {
    eyebrow: "Вокзал · Равенства", title: "Верные равенства",
    setup: "На карточках записаны равенства — настоящие только те, где верен закон перестановки.",
    ask: "Нажми на ВСЕ верно записанные равенства.",
    correct: "Молодец! Все три верных равенства найдены — от перестановки сумма не меняется!",
    hint: "Проверь каждое равенство: слева и справа одни и те же числа, только переставлены?",
    ticket: "БИЛЕТ", okTag: "верно",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Spitsali g'ildirak — o'z markazi atrofida sekin aylanadi (fill-box origin bilan).
const Wheel = ({ cx, cy, r }) => (
  <g className="pq-wheel">
    <circle cx={cx} cy={cy} r={r} fill="#39424f" stroke="#232a33" strokeWidth="1.5" />
    <circle cx={cx} cy={cy} r={r * 0.42} fill="#9aa6b6" stroke="#5a6577" strokeWidth="1" />
    {Array.from({ length: 6 }).map((_, k) => (
      <rect key={k} x={cx - 0.8} y={cy - r + 1.6} width="1.6" height={r - 2} rx="0.8" fill="#5a6577" transform={`rotate(${k * 60} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.14} fill="#2a313b" />
  </g>
);

// LOKOMOTIV (old chap: chiroq + cowcatcher, mo'ri bug', kabina + mashinist) + 3 rangli vagon.
// Vagonlar rang bilan guruhlanadi (qizil/ko'k/sariq). G'ildiraklar aylanadi, mo'ridan bug' chiqadi.
const Train = () => (
  <svg viewBox="0 0 300 100" width="300" height="100" aria-hidden="true" style={{ display: 'block' }}>
    {/* couplers */}
    <rect x="88" y="66" width="12" height="4.5" rx="2" fill="#4a5568" />
    <rect x="152" y="66" width="12" height="4.5" rx="2" fill="#4a5568" />
    <rect x="216" y="66" width="12" height="4.5" rx="2" fill="#4a5568" />

    {/* --- vagon 3 (sariq) --- */}
    <rect x="224" y="46" width="62" height="6" rx="3" fill="#cf9422" />
    <rect x="226" y="50" width="56" height="24" rx="7" fill="#f2b134" stroke="#cf9422" strokeWidth="2" />
    <rect x="234" y="55" width="16" height="12" rx="3" fill="#ffe9c0" stroke="#cf9422" strokeWidth="1.4" />
    <rect x="258" y="55" width="16" height="12" rx="3" fill="#ffe9c0" stroke="#cf9422" strokeWidth="1.4" />
    <Wheel cx={240} cy={80} r={8} /><Wheel cx={268} cy={80} r={8} />

    {/* --- vagon 2 (ko'k) --- */}
    <rect x="160" y="46" width="62" height="6" rx="3" fill="#3a6f9c" />
    <rect x="162" y="50" width="56" height="24" rx="7" fill="#4f8fc4" stroke="#33648f" strokeWidth="2" />
    <rect x="170" y="55" width="16" height="12" rx="3" fill="#dff0fb" stroke="#33648f" strokeWidth="1.4" />
    <rect x="194" y="55" width="16" height="12" rx="3" fill="#dff0fb" stroke="#33648f" strokeWidth="1.4" />
    <Wheel cx={176} cy={80} r={8} /><Wheel cx={204} cy={80} r={8} />

    {/* --- vagon 1 (qizil) --- */}
    <rect x="96" y="46" width="62" height="6" rx="3" fill="#b8443d" />
    <rect x="98" y="50" width="56" height="24" rx="7" fill="#d9534b" stroke="#a33c35" strokeWidth="2" />
    <rect x="106" y="55" width="16" height="12" rx="3" fill="#ffe4d6" stroke="#a33c35" strokeWidth="1.4" />
    <rect x="130" y="55" width="16" height="12" rx="3" fill="#ffe4d6" stroke="#a33c35" strokeWidth="1.4" />
    <Wheel cx={112} cy={80} r={8} /><Wheel cx={140} cy={80} r={8} />

    {/* --- lokomotiv --- */}
    <polygon points="3,74 13,66 13,74" fill="#24344d" />
    <rect x="12" y="48" width="54" height="26" rx="13" fill="#3b5170" stroke="#24344d" strokeWidth="2" />
    <rect x="16" y="51" width="44" height="5" rx="2.5" fill="#5c76a0" opacity=".7" />
    {/* smokebox + old chiroq */}
    <circle cx="15" cy="61" r="10" fill="#2c3d5a" stroke="#24344d" strokeWidth="1.5" />
    <circle cx="15" cy="61" r="4.5" fill="#ffe08a" stroke="#d9a93b" strokeWidth="1.2" />
    {/* bug' dome */}
    <ellipse cx="46" cy="47" rx="6" ry="5" fill="#5c76a0" stroke="#24344d" strokeWidth="1.4" />
    {/* mo'ri */}
    <rect x="22" y="31" width="12" height="6" rx="2" fill="#2c3d5a" />
    <rect x="24" y="34" width="8" height="15" rx="2" fill="#24344d" />
    {/* bug' bulutchalari */}
    <circle className="pq-steam s1" cx="28" cy="27" r="5" fill="#ffffff" />
    <circle className="pq-steam s2" cx="32" cy="21" r="6" fill="#ffffff" />
    <circle className="pq-steam s3" cx="27" cy="14" r="7" fill="#ffffff" />
    {/* kabina */}
    <rect x="60" y="29" width="33" height="6" rx="3" fill="#24344d" />
    <rect x="63" y="32" width="27" height="42" rx="5" fill="#34496b" stroke="#24344d" strokeWidth="2" />
    <rect x="66" y="37" width="18" height="16" rx="3" fill="#cfe2f5" stroke="#24344d" strokeWidth="1.2" />
    {/* mashinist */}
    <circle cx="75" cy="46" r="5" fill="#f2c79a" stroke="#d3a06f" strokeWidth="1" />
    <path d="M69.5 44 Q75 38 80.5 44 Z" fill="#d94f5c" />
    <circle cx="73.2" cy="46" r="0.9" fill="#1f2430" />
    <circle cx="77" cy="46" r="0.9" fill="#1f2430" />
    <path d="M72.5 49.5 Q75 51 77.5 49.5" stroke="#b06b45" strokeWidth="1" fill="none" strokeLinecap="round" />
    <g className="pq-blink"><rect x="71.6" y="44.6" width="3.2" height="3" rx="1.2" fill="#f2c79a" /><rect x="75.4" y="44.6" width="3.2" height="3" rx="1.2" fill="#f2c79a" /></g>
    {/* loko g'ildiraklari + shatun */}
    <line x1="26" y1="80" x2="52" y2="80" stroke="#2a313b" strokeWidth="2.4" strokeLinecap="round" />
    <Wheel cx={12} cy={82} r={5} /><Wheel cx={26} cy={80} r={9} /><Wheel cx={52} cy={80} r={9} />
    <circle cx="26" cy="80" r="1.8" fill="#c9d2df" /><circle cx="52" cy="80" r="1.8" fill="#c9d2df" />
  </svg>
);

// Semafor — ustunda ikki chiroq, navbatma-navbat yonadi (qizil/yashil almashadi).
const Semafor = () => (
  <svg viewBox="0 0 34 100" width="34" height="100" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="14" y="10" width="6" height="82" rx="2.5" fill="#5a6577" stroke="#3f4757" strokeWidth="1" />
    <rect x="10" y="88" width="14" height="6" rx="2" fill="#4a5568" />
    <rect x="5" y="6" width="24" height="36" rx="7" fill="#2f3743" stroke="#1f252e" strokeWidth="1.6" />
    <circle className="pq-sem r" cx="17" cy="16" r="6" fill="#e0554a" />
    <circle className="pq-sem g" cx="17" cy="31" r="6" fill="#57a84f" />
    <rect x="9" y="6" width="16" height="4" rx="2" fill="#3f4757" />
  </svg>
);

// Fon daraxti (dekor, uzoqda).
const Tree = () => (
  <svg viewBox="0 0 40 54" width="40" height="54" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="17" y="34" width="6" height="18" rx="2" fill="#8a5f3a" />
    <circle cx="20" cy="22" r="15" fill="#4f9a48" />
    <circle cx="11" cy="26" r="9" fill="#5cae54" />
    <circle cx="29" cy="26" r="9" fill="#478b41" />
    <circle cx="20" cy="14" r="9" fill="#68bd60" />
  </svg>
);

export default function D11_08(props) {
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
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => GOOD.includes(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: CARDS.map((c) => `${c.l[0]} + ${c.l[1]} = ${c.r[0]} + ${c.r[1]}`),
      studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA },
    });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1108">
      <style>{`
        .pq1108{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1108 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f6f9c;text-transform:uppercase;}
        .pq1108 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1108 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1108 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1108 .pq-scene{position:relative;width:372px;max-width:100%;height:172px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e2f2fb 46%,#eaf4ea 100%);border:2px solid #c4ddf0;overflow:hidden;}
        .pq1108 .pq-sun{position:absolute;top:12px;left:16px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:0;}
        .pq1108 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:0;}
        .pq1108 .pq-cloud.c1{top:20px;left:-70px;animation-duration:33s;animation-delay:-8s;}
        .pq1108 .pq-cloud.c2{top:46px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:41s;animation-delay:-24s;}
        .pq1108 .pq-platform{position:absolute;left:0;right:0;bottom:0;height:30px;background:linear-gradient(#cdbb9c,#ac9670);border-top:2px solid #d8c9ae;z-index:1;}
        .pq1108 .pq-treew{position:absolute;left:8px;bottom:24px;line-height:0;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1108 .pq-semw{position:absolute;right:14px;bottom:22px;line-height:0;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq1108 .pq-sem{transform-box:fill-box;transform-origin:50% 50%;}
        .pq1108 .pq-sem.r{animation:pqSemR 2.8s steps(1,end) infinite;}
        .pq1108 .pq-sem.g{animation:pqSemG 2.8s steps(1,end) infinite;}
        .pq1108 .pq-trackw{position:absolute;left:0;right:0;bottom:30px;height:15px;overflow:hidden;z-index:2;}
        .pq1108 .pq-ties{position:absolute;left:-40px;right:-40px;top:3px;bottom:2px;background:repeating-linear-gradient(90deg,#9a7250 0 6px,transparent 6px 20px);animation:pqTies 1.05s linear infinite;}
        .pq1108 .pq-rail{position:absolute;left:0;right:0;height:3px;background:linear-gradient(#eef3f8,#9aa6b6);}
        .pq1108 .pq-rail.a{top:2px;} .pq1108 .pq-rail.b{top:9px;}
        .pq1108 .pq-trainw{position:absolute;left:18px;bottom:22px;line-height:0;z-index:3;filter:drop-shadow(0 3px 3px rgba(0,0,0,.2));}
        .pq1108 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 2.6s linear infinite;}
        .pq1108 .pq-steam{transform-box:fill-box;transform-origin:50% 50%;opacity:0;}
        .pq1108 .pq-steam.s1{animation:pqSteam 2.6s ease-out infinite;animation-delay:0s;}
        .pq1108 .pq-steam.s2{animation:pqSteam 2.6s ease-out infinite;animation-delay:-.85s;}
        .pq1108 .pq-steam.s3{animation:pqSteam 2.6s ease-out infinite;animation-delay:-1.7s;}
        .pq1108 .pq-blink{opacity:0;animation:pqBlink 3.9s linear infinite;}

        .pq1108 .pq-tks{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1108 .pq-tk{position:relative;width:158px;padding:0 0 12px;border-radius:14px;border:2.5px solid #d6dae3;background:#fdfbf5;cursor:pointer;overflow:hidden;transition:transform .14s,border-color .14s,box-shadow .14s,opacity .2s;text-align:left;font-family:inherit;}
        .pq1108 .pq-tk:hover:not(:disabled){border-color:#9db8ea;transform:translateY(-2px);box-shadow:0 6px 14px rgba(40,60,90,.13);}
        .pq1108 .pq-tk:active:not(:disabled){transform:scale(.97);}
        .pq1108 .pq-tk:disabled{cursor:default;}
        .pq1108 .pq-tk.sel{border-color:#2563eb;background:#f3f6fe;box-shadow:0 0 0 3px rgba(37,99,235,.14);}
        .pq1108 .pq-tk.right{border-color:#1a7f43;background:#eaf8ef;animation:pqCele .55s ease;}
        .pq1108 .pq-tk.dim{opacity:.42;}
        .pq1108 .pq-tk-hd{display:flex;align-items:center;gap:6px;padding:7px 11px;background:linear-gradient(#5f6f8f,#4d5c78);color:#eef3fb;}
        .pq1108 .pq-tk.right .pq-tk-hd{background:linear-gradient(#2f9e5b,#1f8449);}
        .pq1108 .pq-tk-lbl{font-size:11px;font-weight:800;letter-spacing:.09em;}
        .pq1108 .pq-tk-no{margin-left:auto;font-size:11px;font-weight:800;opacity:.85;font-variant-numeric:tabular-nums;}
        .pq1108 .pq-perf{display:block;height:0;border-top:2px dashed #d3d8e1;margin:0 6px;}
        .pq1108 .pq-tk.right .pq-perf{border-top-color:#bfe4cd;}
        .pq1108 .pq-eq{display:flex;align-items:center;justify-content:center;gap:2px;padding:16px 6px 8px;font-size:23px;font-weight:900;color:#2e3a4e;font-variant-numeric:tabular-nums;}
        .pq1108 .pq-eq .pl{color:#1a7f43;margin:0 2px;}
        .pq1108 .pq-eq .eqs{color:#4a5568;margin:0 5px;}
        .pq1108 .pq-bc{display:flex;gap:2px;justify-content:center;align-items:flex-end;height:12px;opacity:.45;}
        .pq1108 .pq-bc i{height:12px;background:#8a94a2;display:block;}
        .pq1108 .pq-tk-chk{position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:50%;border:2px solid #c3cad6;background:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;}
        .pq1108 .pq-tk.sel .pq-tk-chk{border-color:#2563eb;background:#2563eb;color:#fff;}
        .pq1108 .pq-tk.right .pq-tk-chk{border-color:#2563eb;background:#2563eb;color:#fff;animation:pqPop .35s ease both;}
        .pq1108 .pq-okpill{position:absolute;left:50%;bottom:9px;transform:translateX(-50%);background:#1a7f43;color:#fff;font-size:11.5px;font-weight:800;padding:2px 13px;border-radius:999px;letter-spacing:.03em;animation:pqPop .35s ease both;}
        .pq1108 .pq-xmark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:900;color:#c0392b;opacity:.6;}

        .pq1108 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1108 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1108 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWheel{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqSteam{0%{opacity:0;transform:translateY(6px) scale(.5);}25%{opacity:.85;}100%{opacity:0;transform:translateY(-16px) scale(1.6);}}
        @keyframes pqTies{from{transform:translateX(0);}to{transform:translateX(20px);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSemR{0%,50%{opacity:1;}50.01%,100%{opacity:.2;}}
        @keyframes pqSemG{0%,50%{opacity:.2;}50.01%,100%{opacity:1;}}
        @keyframes pqBlink{0%,90%{opacity:0;}92%,95%{opacity:1;}97%,100%{opacity:0;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-platform" />
        <span className="pq-treew"><Tree /></span>
        <span className="pq-semw"><Semafor /></span>
        <div className="pq-trackw"><span className="pq-ties" /><span className="pq-rail a" /><span className="pq-rail b" /></div>
        <span className="pq-trainw"><Train /></span>
      </div>

      {/* 5 poyezd-beleti — bosiladigan tugmalar; doimiy siljish yo'q */}
      <div className="pq-tks">
        {CARDS.map((c, i) => {
          const good = isGood(c);
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : (sel ? ' sel' : '');
          const order = ok && good ? GOOD.indexOf(i) + 1 : null;
          return (
            <button key={i} type="button" className={'pq-tk' + cls} disabled={lock}
              onClick={() => toggle(i)} aria-label={`${c.l[0]} + ${c.l[1]} = ${c.r[0]} + ${c.r[1]}`}>
              <span className="pq-tk-hd">
                <TrainGlyph />
                <span className="pq-tk-lbl">{t.ticket}</span>
                <span className="pq-tk-no">№{i + 1}</span>
              </span>
              <span className="pq-perf" />
              <span className="pq-eq">
                <b className="n">{c.l[0]}</b><b className="pl">+</b><b className="n">{c.l[1]}</b>
                <b className="eqs">=</b>
                <b className="n">{c.r[0]}</b><b className="pl">+</b><b className="n">{c.r[1]}</b>
              </span>
              {!ok && (<span className="pq-bc">{BARS.map((w, k) => (<i key={k} style={{ width: w }} />))}</span>)}
              <span className="pq-tk-chk">{ok && good ? order : (sel && !ok ? '✓' : '')}</span>
              {ok && good && <span className="pq-okpill">{t.okTag}</span>}
              {ok && !good && <span className="pq-xmark">✗</span>}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}

// Belet sarlavhasidagi kichik lokomotiv nishoni.
function TrainGlyph() {
  return (
    <svg viewBox="0 0 26 18" width="21" height="14.5" aria-hidden="true" style={{ display: 'block' }}>
      <rect x="2" y="4" width="13" height="9" rx="2.5" fill="#c7d2e4" />
      <rect x="12" y="1.5" width="9" height="11.5" rx="2.5" fill="#e3ebf6" />
      <rect x="14.5" y="4" width="4.5" height="4" rx="1" fill="#7f93b3" />
      <rect x="5" y="6.5" width="3" height="3" rx="1" fill="#7f93b3" />
      <rect x="9" y="6.5" width="3" height="3" rx="1" fill="#7f93b3" />
      <circle cx="7" cy="15" r="2.2" fill="#8794a8" /><circle cx="16" cy="15" r="2.2" fill="#8794a8" />
      <circle cx="7" cy="15" r="0.8" fill="#e3ebf6" /><circle cx="16" cy="15" r="0.8" fill="#e3ebf6" />
    </svg>
  );
}
