// Dars07 · Amaliyot 08 — P7 Ko'p-tanlov «Oltilik sharlari» · 🔴 · tag: sum_six_multi
// Park sharlari: 5 shar-kartadagi misollardan jami OLTI bo'ladigan barchasini tanlash; g'alabada to'g'ri sharlar uchadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PAIRS = [{ a: 4, b: 5 }, { a: 6, b: 3 }, { a: 5, b: 3 }, { a: 7, b: 2 }, { a: 7, b: 3 }];
const SUM = 9;
const GOOD = PAIRS.map((p, i) => (p.a + p.b === SUM ? i : -1)).filter((i) => i >= 0); // [0, 1, 3] — soxta: 5+3=8, 7+3=10
const DATA = { ptype: 'P7', level: '🔴', tag: 'sum_six_multi' };
const T = {
  uz: {
    eyebrow: "O'yin maydonchasi · Sharlar", title: "To'qqizlik sharlari",
    setup: "Bayram sharlarida misollar yozilgan — faqat jami TO'QQIZ bo'ladiganlari uchadi.",
    ask: "Jami TO'QQIZ bo'ladigan BARCHA sharlarni bosing.",
    correct: "Barakalla! Uchala to'qqizlik shar ham uchdi!",
    hint: "Har shardagi misolni qo'shing — jami to'qqiz chiqqanlarini tanlang.",
  },
  ru: {
    eyebrow: 'Игровая площадка · Шарики', title: 'Шарики девятки',
    setup: 'На праздничных шариках написаны примеры — взлетят только те, что вместе дают ДЕВЯТЬ.',
    ask: 'Нажми на ВСЕ шарики, которые вместе дают ДЕВЯТЬ.',
    correct: 'Молодец! Все три шарика-девятки взлетели!',
    hint: 'Сложи пример на каждом шарике — выбери те, что дают девять.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Shar palitrasi (2-3 ton, yupqa quyuq kontur): qizil, ko'k, sariq, yashil, binafsha.
const BCOL = [
  { base: '#d9534b', lite: '#eb8f86', dark: '#a83a34', txt: '#fff' },
  { base: '#4f8fc4', lite: '#8fbadd', dark: '#376a94', txt: '#fff' },
  { base: '#f2b134', lite: '#f8d47f', dark: '#c08517', txt: '#6b4404' },
  { base: '#57a84f', lite: '#90cc89', dark: '#3d7d38', txt: '#fff' },
  { base: '#8a5bd6', lite: '#b697e8', dark: '#653fa6', txt: '#fff' },
];
const BalDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      {BCOL.map((c, i) => (
        <radialGradient key={i} id={`pq0708g${i}`} cx="35%" cy="30%" r="78%">
          <stop offset="0%" stopColor={c.lite} />
          <stop offset="100%" stopColor={c.base} />
        </radialGradient>
      ))}
    </defs>
  </svg>
);

// Bayram shari: gradientli tana, oq blik, tugun, ilon-izi ip. Misol shar USTIDA yozilgan;
// g'alabada «= 6» shu sharning ichida pop bo'ladi (javob-vizualda).
const Balloon = ({ g, a, b, ans }) => (
  <svg viewBox="0 0 84 118" width="84" height="112" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M42 90 Q35 98 43 106 Q49 112 41 117" stroke="#9aa0aa" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <ellipse cx="42" cy="46" rx="29" ry="36" fill={`url(#pq0708g${g})`} stroke={BCOL[g].dark} strokeWidth="2" />
    <ellipse cx="31" cy="29" rx="7.5" ry="11" fill="#fff" opacity=".45" transform="rotate(-20 31 29)" />
    <polygon points="42,81 36,90 48,90" fill={BCOL[g].dark} />
    <text x="42" y={ans ? 42 : 53} textAnchor="middle" fontSize="17" fontWeight="900" fill={BCOL[g].txt} fontFamily="inherit">{a} + {b}</text>
    {ans && <text className="pq-apop" x="42" y="66" textAnchor="middle" fontSize="19" fontWeight="900" fill={BCOL[g].txt} fontFamily="inherit">= {SUM}</text>}
  </svg>
);

// Sanoq-nuqta: bitta dona = bitta doira (chap qo'shiluvchi rangi, keyin o'ng qo'shiluvchi rangi).
const Dot = ({ g }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="8" cy="8" r="6.6" fill={`url(#pq0708g${g})`} stroke={BCOL[g].dark} strokeWidth="1.2" />
    <circle cx="5.8" cy="5.4" r="1.7" fill="#fff" opacity=".8" />
  </svg>
);

// Chizilgan yulduzcha: oltin, yupqa kontur, oq blik (g'alaba uchqunlari).
const Star = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="12,2 14.9,8.6 22,9.3 16.7,14.2 18.2,21.3 12,17.6 5.8,21.3 7.3,14.2 2,9.3 9.1,8.6" fill="#f2b134" stroke="#c08517" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="9.6" cy="8.4" r="1.1" fill="#fff" opacity=".75" />
  </svg>
);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';

// Panjara-fon: dumaloq uchli taxtachalar + 2 ko'ndalang reyka.
const Fence = () => (
  <svg viewBox="0 0 372 48" width="372" height="48" aria-hidden="true" style={{ display: 'block' }}>
    {Array.from({ length: 17 }).map((_, i) => (
      <rect key={i} x={4 + i * 22} y="5" width="12" height="42" rx="5" fill="#e7d7b1" stroke="#c9b183" strokeWidth="1.2" />
    ))}
    <rect x="0" y="14" width="372" height="5" rx="2.5" fill="#dbc79a" stroke="#c9b183" strokeWidth="1" />
    <rect x="0" y="31" width="372" height="5" rx="2.5" fill="#dbc79a" stroke="#c9b183" strokeWidth="1" />
  </svg>
);

// Arg'imchoq: A-ramka + osilgan o'rindiq, ustida bola (bola kanoni: teri-rang bosh,
// blikli pirpiratuvchi ko'zlar, tabassum, ko'k futbolka, kalta oyoqchalar). .pq-sw sekin tebranadi.
const Swing = () => (
  <svg viewBox="0 0 130 132" width="126" height="128" aria-hidden="true" style={{ display: 'block', '--bd': '-1.2s' }}>
    <ellipse cx="65" cy="127" rx="58" ry="4" fill="#8fbf7f" />
    <line x1="14" y1="14" x2="5" y2="126" stroke="#8a6a3a" strokeWidth="5" strokeLinecap="round" />
    <line x1="14" y1="14" x2="26" y2="126" stroke="#a5854e" strokeWidth="5" strokeLinecap="round" />
    <line x1="116" y1="14" x2="106" y2="126" stroke="#8a6a3a" strokeWidth="5" strokeLinecap="round" />
    <line x1="116" y1="14" x2="125" y2="126" stroke="#a5854e" strokeWidth="5" strokeLinecap="round" />
    <rect x="8" y="10" width="114" height="7" rx="3.5" fill="#b98a4a" stroke="#8a6a3a" strokeWidth="1.5" />
    <g className="pq-sw">
      <line x1="52" y1="17" x2="52" y2="86" stroke="#7c6c58" strokeWidth="2.4" />
      <line x1="80" y1="17" x2="80" y2="86" stroke="#7c6c58" strokeWidth="2.4" />
      <circle cx="66" cy="51" r="9" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.3" />
      <circle cx="62.8" cy="50" r="1.4" fill="#1f2430" /><circle cx="63.3" cy="49.5" r="0.5" fill="#fff" />
      <circle cx="69.2" cy="50" r="1.4" fill="#1f2430" /><circle cx="69.7" cy="49.5" r="0.5" fill="#fff" />
      <g className="pq-blink"><rect x="61" y="48.4" width="3.7" height="3.2" rx="1.5" fill={SKIN} /><rect x="67.4" y="48.4" width="3.7" height="3.2" rx="1.5" fill={SKIN} /></g>
      <path d="M63.4 55 Q66 57.2 68.6 55" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="56" y="59" width="20" height="27" rx="8" fill="#4f8fc4" stroke="#376a94" strokeWidth="1.4" />
      <path d="M57 64 L52.5 72" stroke="#4f8fc4" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M75 64 L79.5 72" stroke="#4f8fc4" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="52.5" cy="73" r="2.2" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
      <circle cx="79.5" cy="73" r="2.2" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
      <line x1="60" y1="86" x2="59" y2="101" stroke="#5a616b" strokeWidth="4" strokeLinecap="round" />
      <line x1="72" y1="86" x2="73" y2="101" stroke="#5a616b" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="58.5" cy="103" rx="4" ry="2.5" fill="#6d4c33" />
      <ellipse cx="73.5" cy="103" rx="4" ry="2.5" fill="#6d4c33" />
      <rect x="46" y="86" width="40" height="7" rx="3" fill="#d9534b" stroke="#a33630" strokeWidth="1.5" />
    </g>
  </svg>
);

// Slayd-toboggan: narvon + maydoncha + ko'k tushish yuzasi (2 ton, quyuq kontur).
const Slide = () => (
  <svg viewBox="0 0 120 122" width="116" height="118" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="60" cy="118" rx="52" ry="4" fill="#8fbf7f" />
    <line x1="66" y1="30" x2="66" y2="116" stroke="#7c6c58" strokeWidth="4" strokeLinecap="round" />
    <polygon points="62,30 76,34 34,116 18,110" fill="#4f8fc4" stroke="#376a94" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="65,33 72,35 32,110 25,107" fill="#8fbadd" opacity=".85" />
    <line x1="92" y1="118" x2="92" y2="30" stroke="#8a6a3a" strokeWidth="4" strokeLinecap="round" />
    <line x1="108" y1="118" x2="108" y2="30" stroke="#8a6a3a" strokeWidth="4" strokeLinecap="round" />
    {[42, 56, 70, 84, 98, 112].map((y) => (
      <line key={y} x1="92" y1={y} x2="108" y2={y} stroke="#a5854e" strokeWidth="3" strokeLinecap="round" />
    ))}
    <rect x="62" y="24" width="50" height="8" rx="4" fill="#b98a4a" stroke="#8a6a3a" strokeWidth="1.5" />
  </svg>
);

// Turgan bola (nomsiz, bola kanoni): qizil futbolka; g'alabada qo'l silkitadi.
const Kid = ({ wave }) => (
  <svg viewBox="0 0 46 66" width="42" height="60" aria-hidden="true" style={{ display: 'block', '--bd': '-2.4s' }}>
    <circle cx="23" cy="13.5" r="10" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.3" />
    <circle cx="19.2" cy="12.5" r="1.5" fill="#1f2430" /><circle cx="19.7" cy="12" r="0.55" fill="#fff" />
    <circle cx="26.8" cy="12.5" r="1.5" fill="#1f2430" /><circle cx="27.3" cy="12" r="0.55" fill="#fff" />
    <g className="pq-blink"><rect x="17.3" y="10.8" width="3.8" height="3.4" rx="1.6" fill={SKIN} /><rect x="24.9" y="10.8" width="3.8" height="3.4" rx="1.6" fill={SKIN} /></g>
    <path d="M19.6 18 Q23 20.4 26.4 18" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <rect x="11" y="25" width="24" height="23" rx="9" fill="#d9534b" stroke="#a33630" strokeWidth="1.4" />
    <path d="M12 30 L5 39" stroke="#d9534b" strokeWidth="4" strokeLinecap="round" />
    <circle cx="5" cy="40" r="2.3" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" />
    {wave
      ? <g className="pq-wavearm"><path d="M34 30 Q39 22 41 15" stroke="#d9534b" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="41.5" cy="13.5" r="2.4" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" /></g>
      : <g><path d="M34 30 L41 39" stroke="#d9534b" strokeWidth="4" strokeLinecap="round" /><circle cx="41" cy="40" r="2.3" fill={SKIN} stroke={SKIN_LINE} strokeWidth="0.9" /></g>}
    <line x1="17" y1="48" x2="17" y2="59" stroke="#5a616b" strokeWidth="4" strokeLinecap="round" />
    <line x1="29" y1="48" x2="29" y2="59" stroke="#5a616b" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="15.5" cy="61" rx="4" ry="2.4" fill="#6d4c33" />
    <ellipse cx="30.5" cy="61" rx="4" ry="2.4" fill="#6d4c33" />
  </svg>
);

const Flower = ({ c1, c2 }) => (
  <svg viewBox="0 0 18 26" width="16" height="24" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="9" y1="25" x2="9" y2="12" stroke="#6da75c" strokeWidth="2" />
    <circle cx="9" cy="9" r="5" fill={c1} />
    <circle cx="9" cy="9" r="2" fill={c2} />
  </svg>
);

// «6» kalit-doira: oltin, breath-pulse, ora-sira yalt-uchqun; g'alabada selebratsiya.
const Key = () => (
  <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="22" cy="22" r="19" fill="#f2b134" stroke="#c08517" strokeWidth="2" />
    <circle cx="15.5" cy="14.5" r="6" fill="#f8d47f" opacity=".9" />
    <text x="22" y="30" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a4a06" fontFamily="inherit">{SUM}</text>
    <polygon className="pq-glint" points="32.5,7.5 33.7,11 37.2,12.2 33.7,13.4 32.5,16.9 31.3,13.4 27.8,12.2 31.3,11" fill="#fff" />
  </svg>
);

const WINSTARS = [
  { l: -9, t: -8, d: 0, s: 14 }, { l: 92, t: 4, d: 0.15, s: 12 }, { l: 4, t: 66, d: 0.3, s: 11 },
];

export default function D07_08(props) {
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

  return (
    <div className="pq pq0708">
      <style>{`
        .pq0708{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0708 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f8a3a;text-transform:uppercase;}
        .pq0708 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0708 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0708 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0708 .pq-scene{position:relative;width:372px;max-width:100%;height:216px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f6ff 50%,#d9efcb 74%,#9ccd8a 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0708 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0708 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0708 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0708 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-21s;}
        .pq0708 .pq-fence{position:absolute;left:0;right:0;bottom:62px;line-height:0;}
        .pq0708 .pq-swing{position:absolute;left:10px;bottom:4px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0708 .pq-sw{transform-box:fill-box;transform-origin:50% 0%;animation:pqSwing 3.4s ease-in-out infinite;}
        .pq0708 .pq-slide{position:absolute;right:8px;bottom:4px;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0708 .pq-kid{position:absolute;left:198px;bottom:8px;line-height:0;animation:pqBobY 2.8s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));}
        .pq0708 .pq-flo{position:absolute;bottom:5px;line-height:0;}
        .pq0708 .pq-keywrap{position:absolute;top:8px;left:50%;transform:translateX(-50%);line-height:0;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18));}
        .pq0708 .pq-keybr{display:inline-block;line-height:0;animation:pqBreath 2.3s ease-in-out infinite;}
        .pq0708 .pq-keybr.win{animation:pqCele .55s ease;}
        .pq0708 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.6s ease-in-out infinite;}
        .pq0708 .pq-blink{opacity:0;animation:pqBlink 3.7s linear infinite;animation-delay:var(--bd,0s);}
        .pq0708 .pq-wavearm{transform-box:fill-box;transform-origin:15% 95%;animation:pqWave .6s ease-in-out infinite alternate;}
        .pq0708 .pq-cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:368px;margin:26px auto 0;}
        .pq0708 .pq-bwrap{position:relative;}
        .pq0708 .pq-bwrap.rise{animation:pqRise .9s cubic-bezier(.3,1.3,.5,1) both,pqHover 3.4s ease-in-out .9s infinite;z-index:2;}
        .pq0708 .pq-bcard{position:relative;width:112px;padding:10px 6px 8px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;transition:.14s;font-family:inherit;box-shadow:0 2px 5px rgba(0,0,0,.06);display:flex;flex-direction:column;align-items:center;}
        .pq0708 .pq-bcard:hover:not(:disabled){border-color:#9fc79a;transform:translateY(-2px);}
        .pq0708 .pq-bcard:active:not(:disabled){transform:scale(.95);}
        .pq0708 .pq-bcard.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0708 .pq-bcard.right{border-color:#1a7f43;background:#eefaf1;box-shadow:0 0 16px 4px rgba(46,180,96,.45);animation:pqCele .5s ease;}
        .pq0708 .pq-bcard.dim{opacity:.5;}
        .pq0708 .pq-bcard:disabled{cursor:default;}
        .pq0708 .pq-apop{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0708 .pq-dots{display:flex;gap:2.5px;justify-content:center;margin-top:6px;}
        .pq0708 .pq-dot{position:relative;line-height:0;animation:pqDrop .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0708 .pq-cnt{position:absolute;top:-6px;right:-5px;min-width:14px;height:14px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0708 .pq-cstar{position:absolute;line-height:0;animation:pqStarIn .5s cubic-bezier(.3,1.5,.5,1) both,pqTwinkle 1.7s ease-in-out .6s infinite;z-index:3;}
        .pq0708 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0708 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0708 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSwing{0%,100%{transform:rotate(6deg);}50%{transform:rotate(-6deg);}}
        @keyframes pqBobY{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqWave{from{transform:rotate(-8deg);}to{transform:rotate(14deg);}}
        @keyframes pqRise{from{transform:translateY(0);}to{transform:translateY(-22px);}}
        @keyframes pqHover{0%,100%{transform:translateY(-22px);}50%{transform:translateY(-27px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-14px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.35);}to{opacity:1;transform:scale(1);}}
        @keyframes pqStarIn{from{opacity:0;transform:scale(.2) rotate(-40deg);}to{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pqTwinkle{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <BalDefs />
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence"><Fence /></span>
        <span className="pq-flo" style={{ left: 150 }}><Flower c1="#e88bb1" c2="#b1487a" /></span>
        <span className="pq-flo" style={{ left: 172 }}><Flower c1="#f2b134" c2="#b97c14" /></span>
        <span className="pq-swing"><Swing /></span>
        <span className="pq-slide"><Slide /></span>
        <span className="pq-kid"><Kid wave={!!ok} /></span>
        <span className="pq-keywrap"><span className={'pq-keybr' + (ok ? ' win' : '')}><Key /></span></span>
      </div>

      <div className="pq-cards">
        {PAIRS.map((p, i) => {
          const good = p.a + p.b === SUM;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
          return (
            <div key={i} className={'pq-bwrap' + (ok && good ? ' rise' : '')}>
              <button type="button" className={'pq-bcard' + cls} disabled={lock} onClick={() => toggle(i)} aria-label={`${p.a} + ${p.b}`}>
                <Balloon g={i} a={p.a} b={p.b} ans={!!(ok && good)} />
                {ok && good && (
                  <span className="pq-dots">
                    {Array.from({ length: SUM }).map((_, k) => (
                      <span key={k} className="pq-dot" style={{ animationDelay: `${k * 0.09}s` }}>
                        <Dot g={k < p.a ? i % BCOL.length : (i + 1) % BCOL.length} />
                        <b className="pq-cnt">{k + 1}</b>
                      </span>
                    ))}
                  </span>
                )}
                {ok && good && WINSTARS.map((s, k) => (
                  <span key={k} className="pq-cstar" style={{ left: s.l, top: s.t, animationDelay: `${s.d}s, ${0.6 + s.d}s` }}><Star size={s.s} /></span>
                ))}
              </button>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
