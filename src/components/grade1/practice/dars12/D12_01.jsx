// Dars12 · Amaliyot 01 — P4 Taqqoslash «Timsohlar ko'li» · 🟢 · timsoh · tag: compare_warmup
// Ikki son-karta (6 va 4), orasida katta timsoh + baliq to'plamlari. To'g'ri belgi «>»:
// g'alabada timsoh og'zini KATTA son (6, chap) tomonga ochadi, «6 > 4» yashil. Веди-до-верного.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 6, B = 4, TARGET = '>';
const LEFT_N = A, RIGHT_N = B;
const DATA = { a: A, b: B, target: TARGET, options: ['>', '<', '='], ptype: 'P4', level: '🟢', tag: 'compare_warmup' };
const SIGN_STR = `${A} ${TARGET} ${B}`;
const T = {
  uz: {
    eyebrow: "Timsohlar ko'li · Taqqoslash", title: "Qaysi belgi?",
    setup: "Ko'ldagi och timsoh doim KATTA son tomonga og'iz ochadi. Chapda olti, o'ngda to'rt.",
    ask: "Sonlar orasiga qaysi belgi qo'yiladi?",
    correct: "Barakalla! Olti to'rtdan katta — timsoh chapga og'iz ochdi.",
    hint: "Qaysi son katta? Timsoh og'zi katta songa qaraydi: ochiq tomoni kattaga.",
  },
  ru: {
    eyebrow: "Озеро крокодилов · Сравнение", title: "Какой знак?",
    setup: "Голодный крокодил в озере всегда открывает пасть к БОЛЬШЕМУ числу. Слева шесть, справа четыре.",
    ask: "Какой знак поставить между числами?",
    correct: "Молодец! Шесть больше четырёх — крокодил открыл пасть влево.",
    hint: "Какое число больше? Пасть крокодила смотрит на большее: открытая сторона к большему.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan timsoh (D04_10 kanoni): cho'zilgan yashil tana (#3f9950/#2e7a3e), tikanli scute-orqa,
// panjali oyoq, blikli tik-qorachiqli ko'z, ko'z ustida pirpiratish qopqog'i (pq-crocblink).
// chomp=false → og'iz TINCH/yopiq (tinch snout); chomp=true → og'iz OCHIQ + qichirlaydi (jag' aylanadi).
// O'ngga qaragan asos; g'alabada wrapper .faceL (scaleX-1) chapga — KATTA son (6) tomonga buradi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="116" height="63" aria-hidden="true" style={{ display: 'block' }}>
    {/* dum — kuchli egilgan, sekin tebranadi */}
    <g className="pq-croctail">
      <path d="M28 38 Q16 39 12 32 Q8 24 10 19 Q4 30 5 41 Q7 55 28 56 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 39 l0 -7 6 5 Z M15 34 l-2 -7 6 3.5 Z M10 25 l-3 -6.5 5.5 2 Z" fill="#2e7a3e" />
    </g>
    {/* uzoq tomondagi oyoqlar */}
    <path d="M26 48 L25 61 Q25 64 28 64 L35 64 L35 50 Z" fill="#2e7a3e" />
    <ellipse cx="32" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    <path d="M46 48 L45 61 Q45 64 48 64 L55 64 L55 50 Z" fill="#2e7a3e" />
    <ellipse cx="52" cy="62.5" rx="6" ry="2.6" fill="#2e7a3e" />
    {/* cho'zilgan tana */}
    <ellipse cx="42" cy="46" rx="26" ry="12.5" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <path d="M17 43 Q22 34 42 33.5 Q62 34 67 43 Q54 37.5 42 37.5 Q30 37.5 17 43 Z" fill="#2e7a3e" />
    <circle cx="30" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="39" cy="47" r="1.4" fill="#2e7a3e" opacity=".5" />
    <circle cx="48" cy="44" r="1.4" fill="#2e7a3e" opacity=".5" /><circle cx="56" cy="47" r="1.3" fill="#2e7a3e" opacity=".5" />
    {/* qorin */}
    <ellipse cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
    <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* orqa scute-tikanlar */}
    <path d="M21 39 l4.5 -7 4.5 7 Z M31 36.5 l4.5 -7 4.5 7 Z M41 36 l4.5 -7 4.5 7 Z M51 37.5 l4.5 -7 4.5 7 Z" fill="#256835" />
    <path d="M26.5 41 l3.2 -5 3.2 5 Z M36.5 39.5 l3.2 -5 3.2 5 Z M46.5 39.5 l3.2 -5 3.2 5 Z M56 41.5 l3 -4.6 3 4.6 Z" fill="#2e7a3e" />
    {/* yaqin oyoqlar — panjali */}
    <path d="M33 50 L32 62 Q32 65.5 36 65.5 L42 65.5 L42 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="40" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M42.5 62 l.5 3.4 M45.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M52 50 L51 62 Q51 65.5 55 65.5 L61 65.5 L61 52 Z" fill="#3f9950" stroke="#256835" strokeWidth="1.5" strokeLinejoin="round" />
    <ellipse cx="59" cy="63.8" rx="6.5" ry="2.8" fill="#3f9950" stroke="#256835" strokeWidth="1.4" />
    <path d="M61.5 62 l.5 3.4 M64.3 62.2 l.3 2.9" stroke="#256835" strokeWidth="1.1" strokeLinecap="round" />
    {/* bosh suyagi */}
    <path d="M58 34 Q65 29.5 71 33 L74 42 L72 50 Q65 52.5 58 50.5 Z" fill="#3f9950" />

    {chomp ? (
      <>
        {/* og'iz OCHIQ — jag'lar < > belgisini eslatadi (metafora) */}
        <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
        <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
        <g className="pq-jaws chomping">
          <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
          <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
          <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
        </g>
      </>
    ) : (
      <>
        {/* og'iz TINCH/yopiq — cho'zilgan snout (teng-poza uslubi) */}
        <path d="M66 35 Q92 31 116 40 Q124 42.5 123 47 Q121 51.5 114 50.5 Q92 52.5 66 50.5 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M66 36 Q92 32.5 114 41" stroke="#2e7a3e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M70 45.5 Q92 47.5 118 46" stroke="#256835" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M82 46 l2 3.2 l2 -3.2 Z M95 46.5 l2 3.2 l2 -3.2 Z M107 46.5 l1.8 3 l1.8 -3 Z" fill="#fff" stroke="#256835" strokeWidth=".5" strokeLinejoin="round" />
        <circle cx="118" cy="42.5" r="1.3" fill="#1f2430" opacity=".7" />
      </>
    )}

    {/* ko'z do'ngligi + tik qorachiqli ko'z + pirpiratish qopqog'i */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <circle className="pq-crocblink" cx="63" cy="28.5" r="6.4" fill="#3f9950" />
  </svg>
);

// Kanon baliq (D04_10): tomchi-shakl tana (#e8883a, qorni #f6c07a), uchburchak dum (pirillaydi),
// suzgichlar (#c96a24), blikli ko'z. O'ngga qaragan asos; chapga — .flip (scaleX-1).
const Fish = () => (
  <svg viewBox="0 0 40 24" width="26" height="16" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-ftail" d="M10 12 L2 5 L4.5 12 L2 19 Z" fill="#c96a24" stroke="#a8531a" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 12 Q13 4.5 23 4 Q36 4.5 37.5 12 Q36 19.5 23 20 Q13 19.5 8 12 Z" fill="#e8883a" stroke="#a8531a" strokeWidth="1.3" />
    <path d="M11 14.5 Q22 20.5 34 14 Q30 18.5 22 18.8 Q15 18.5 11 14.5 Z" fill="#f6c07a" />
    <path d="M17 5.8 Q22 2.6 26.5 6 Q21.5 7.6 17 5.8 Z" fill="#c96a24" />
    <path d="M20 12.5 Q24 14.5 22.5 17.5" fill="none" stroke="#c96a24" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="30.5" cy="9.6" r="2.1" fill="#1f2430" />
    <circle cx="31.3" cy="8.9" r="0.7" fill="#fff" />
    <path d="M34.8 13.6 q1.6 1.1 3 .5" fill="none" stroke="#a8531a" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// QAMISH (D09_06 kanoni): 2 poya + qo'ng'ir boshoq, pastdan sway.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="34" height="63" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
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

// NINACHI (D09_06 kanoni): tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish.
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

export default function D12_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // '>' | '<' | '='
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // Review/qayta ochilishda g'alaba-reveal (badge/qichirlash) qayta ijro etilmaydi — statik.
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
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1201">
      <style>{`
        .pq1201{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1201 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1201 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq1201 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1201 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}

        .pq1201 .pq-lake{position:relative;max-width:376px;margin:0 auto;height:250px;border-radius:22px;overflow:hidden;border:3px solid #bfe0d6;background:linear-gradient(#cfe9fb 0%,#c1e6ea 26%,#7fc7d4 55%,#4fa6bc 100%);}
        .pq1201 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1201 .pq-cloud{position:absolute;width:50px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:15px 5px 0 -4px #fff,-14px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1201 .pq-cloud.c1{top:12px;left:-70px;animation-duration:30s;animation-delay:-6s;}
        .pq1201 .pq-cloud.c2{top:34px;left:-70px;width:36px;height:11px;opacity:.7;animation-duration:40s;animation-delay:-24s;}
        .pq1201 .pq-reedw{position:absolute;bottom:0;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1201 .pq-reedw.l{left:0;} .pq1201 .pq-reedw.r{right:0;}
        .pq1201 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqReedSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1201 .pq-dflyw{position:absolute;left:33%;top:8px;line-height:0;z-index:4;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1201 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1201 .pq-dwing.w2{animation-delay:-.08s;} .pq1201 .pq-dwing.w3{animation-delay:-.14s;} .pq1201 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1201 .pq-ring{position:absolute;left:30%;bottom:24px;width:24px;height:8px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:2;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq1201 .pq-ring.r2{left:64%;bottom:40px;animation-delay:-1.9s;}

        .pq1201 .pq-row{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:4px;padding:0 10px;}
        .pq1201 .pq-side{display:flex;flex-direction:column;align-items:center;gap:9px;width:100px;}
        .pq1201 .pq-cardwrap{position:relative;display:flex;align-items:center;justify-content:center;animation:pqFloat 3.2s ease-in-out infinite;}
        .pq1201 .pq-side:last-child .pq-cardwrap{animation-delay:-1.6s;}
        .pq1201 .pq-pad{position:absolute;bottom:-7px;width:66px;height:20px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#7cc85e,#4f9a3f);box-shadow:0 3px 5px rgba(0,0,0,.16);}
        .pq1201 .pq-card{position:relative;width:50px;height:58px;border-radius:14px;background:linear-gradient(#ffffff,#eef6f1);border:3px solid #c7ddd0;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#2e7a3e;font-variant-numeric:tabular-nums;box-shadow:0 4px 8px rgba(0,0,0,.14);}
        .pq1201 .pq-card.win{border-color:#1a7f43;color:#1a7f43;background:linear-gradient(#eefaf1,#dff3e7);}
        .pq1201 .pq-card.big.win{animation:pqCele .5s ease;}
        .pq1201 .pq-school{display:flex;flex-wrap:wrap;gap:4px 5px;justify-content:center;max-width:92px;min-height:38px;}
        .pq1201 .pq-fish{position:relative;line-height:0;animation:pqFishBob 2.4s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.2));}
        .pq1201 .pq-fish span{display:inline-block;line-height:0;}
        .pq1201 .pq-fish.flip span{transform:scaleX(-1);}
        .pq1201 .pq-fish.win{animation:pqFishBob 2.4s ease-in-out infinite,pqCele .55s ease;}
        .pq1201 .pq-ftail{transform-box:fill-box;transform-origin:100% 50%;animation:pqFishTail 1.5s ease-in-out infinite;}
        .pq1201 .pq-cnt{position:absolute;top:-7px;right:-6px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#1d4ed8;color:#fff;font-size:9.5px;font-weight:800;line-height:1;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:5;}

        .pq1201 .pq-croc-slot{position:relative;flex-shrink:0;width:120px;display:flex;align-items:center;justify-content:center;}
        .pq1201 .pq-crocbox{transition:transform .5s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 3px 3px rgba(0,0,0,.24));}
        .pq1201 .pq-crocbox.faceL{transform:scaleX(-1);}
        .pq1201 .pq-crocidle{animation:pqFloat 3.6s ease-in-out infinite;}
        .pq1201 .pq-croctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqCrocSway 3.4s ease-in-out infinite;}
        .pq1201 .pq-jaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq1201 .pq-jaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq1201 .pq-crocblink{opacity:0;animation:pqBlink 4s linear infinite;}
        .pq1201 .pq-q{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;background:#fff;border:2.5px solid #2e7a3e;color:#2e7a3e;font-size:19px;font-weight:900;line-height:1;display:flex;align-items:center;justify-content:center;z-index:6;box-shadow:0 3px 6px rgba(0,0,0,.16);animation:pqQ 1.8s ease-in-out infinite;}
        .pq1201 .pq-chip{position:absolute;top:2px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.24);z-index:6;white-space:nowrap;animation:pqChipIn .5s cubic-bezier(.3,1.5,.5,1) both;}

        .pq1201 .pq-lake.still .pq-cnt,.pq1201 .pq-lake.still .pq-chip,.pq1201 .pq-lake.still .pq-jaws.chomping,.pq1201 .pq-lake.still .pq-card.big.win{animation:none;}
        .pq1201 .pq-lake.still .pq-fish.win{animation:pqFishBob 2.4s ease-in-out infinite;}

        .pq1201 .pq-opts{display:flex;gap:14px;justify-content:center;margin-top:20px;}
        .pq1201 .pq-opt{width:76px;height:70px;font-size:38px;font-weight:900;line-height:1;border-radius:18px;border:2.5px solid #cdd8d2;background:#fff;color:#2e7a3e;cursor:pointer;transition:.12s;display:flex;align-items:center;justify-content:center;}
        .pq1201 .pq-opt:hover:not(:disabled){border-color:#8fc4a6;transform:translateY(-2px);}
        .pq1201 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1201 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1201 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1201 .pq-opt:disabled{cursor:default;}

        .pq1201 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1201 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1201 .pq-fb.no{background:#fdecec;color:#c0392b;}

        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(480px);}}
        @keyframes pqReedSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(60px,18px) rotate(6deg);}50%{transform:translate(120px,6px) rotate(-4deg);}75%{transform:translate(52px,30px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.8;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqFishBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqFishTail{0%,100%{transform:rotate(7deg);}50%{transform:rotate(-7deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqCrocSway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pqBlink{0%,90%{opacity:0;}92%,95%{opacity:1;}97%,100%{opacity:0;}}
        @keyframes pqQ{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.14);}}
        @keyframes pqChipIn{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-lake' + (still ? ' still' : '')}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-reedw l"><Reeds /></span>
        <span className="pq-reedw r"><Reeds flip /></span>
        <span className="pq-dflyw"><Dragonfly /></span>
        <span className="pq-ring" /><span className="pq-ring r2" />

        <div className="pq-row">
          {/* CHAP — katta son (6) + 6 baliq */}
          <div className="pq-side">
            <div className="pq-cardwrap">
              <span className="pq-pad" />
              <div className={'pq-card big' + (ok ? ' win' : '')}>{A}</div>
            </div>
            <div className="pq-school">
              {Array.from({ length: LEFT_N }).map((_, i) => (
                <span key={i} className={'pq-fish' + (ok ? ' win' : '')} style={{ animationDelay: `${(i % 3) * 0.45}s` }}>
                  <span><Fish /></span>{ok && <b className="pq-cnt">{i + 1}</b>}
                </span>
              ))}
            </div>
          </div>

          {/* MARKAZ — timsoh = belgi; g'alabada chapga (6) og'iz ochadi */}
          <div className="pq-croc-slot">
            {ok ? <span className="pq-chip">{SIGN_STR}</span> : <span className="pq-q">?</span>}
            <div className={'pq-crocbox' + (ok ? ' faceL' : '')}>
              <div className="pq-crocidle"><Croc chomp={!!ok} /></div>
            </div>
          </div>

          {/* O'NG — kichik son (4) + 4 baliq */}
          <div className="pq-side">
            <div className="pq-cardwrap">
              <span className="pq-pad" />
              <div className={'pq-card' + (ok ? ' win' : '')}>{B}</div>
            </div>
            <div className="pq-school">
              {Array.from({ length: RIGHT_N }).map((_, i) => (
                <span key={i} className={'pq-fish flip' + (ok ? ' win' : '')} style={{ animationDelay: `${(i % 3) * 0.5}s` }}>
                  <span><Fish /></span>{ok && <b className="pq-cnt">{i + 1}</b>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((s) => {
          const sel = picked === s; const right = ok && s === TARGET;
          return (
            <button key={s} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(s); setFeedback(null); }}>{s}</button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
