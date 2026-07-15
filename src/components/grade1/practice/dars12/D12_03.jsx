// Dars12 · Amaliyot 03 — P4 Hisobla-taqqosla «3 + 2 ▢ 4» · 🟡 · timsoh · tag: compute_compare
// Avval chapni hisobla (3+2=5), keyin 5 va 4 orasidagi belgini tanla. Timsoh og'zi katta son
// tomonga ochiladi (og'iz = belgi). Belgilar U+003E/3C/3D. Ayirish YO'Q. Веди-до-верного, ozvuchkasiz.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 3, B = 2, RIGHT = 4, SUM = A + B; // 5
const DATA = { a: A, b: B, c: RIGHT, target: '>', options: ['>', '<', '='], ptype: 'P4', level: '🟡', tag: 'compute_compare' };
const T = {
  uz: {
    eyebrow: "Timsohlar ko'li · Hisobla-taqqosla", title: "Avval hisobla",
    setup: "Chap tomonda uch qo'shuv ikki, o'ngda to'rt. Avval chap tomonni hisoblang!",
    ask: "Sonlar orasiga qaysi belgi qo'yiladi?",
    correct: "Barakalla! Uch qo'shuv ikki — besh. Besh to'rtdan katta!",
    hint: "Avval chap tomonni hisoblang: uch qo'shuv ikki necha? Keyin to'rt bilan solishtiring.",
  },
  ru: {
    eyebrow: "Озеро крокодилов · Посчитай-сравни", title: "Сначала посчитай",
    setup: "Слева три плюс два, справа четыре. Сначала посчитай левую сторону!",
    ask: "Какой знак поставить между числами?",
    correct: "Молодец! Три плюс два — пять. Пять больше четырёх!",
    hint: "Сначала посчитай левую сторону: три плюс два сколько? Потом сравни с четырьмя.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TIMSOH KANONI (D04_10 / D12_06): cho'zilgan yashil tana (3 ton), tikanli scute-orqa, panjali
// oyoq, blikli ko'z, ochiq jag' — jag'lar taqqoslash belgisi (< >) metaforasi. Bu yerda timsoh
// AYNAN belgi: og'iz ochiq — «>»/«<» (katta son tomonga qaraydi), og'iz yopiq (shut) — «=».
// open=false → shut (jag'lar yopiladi). chomp=true → g'alabada qisilib-ochiladi.
// pq-ctail dum tebranadi, pq-cthroat tomoq puls, pq-cblink ko'z pirpiratadi.
const Croc = ({ open, chomp }) => {
  return (
    <svg viewBox="0 0 132 72" width="96" height="52" aria-hidden="true" style={{ display: 'block' }}>
      {/* dum — kuchli egilgan, sekin tebranadi */}
      <g className="pq-ctail">
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
      {/* qorin — och-sariq-yashil, yengil puls */}
      <ellipse className="pq-cthroat" cx="43" cy="53.5" rx="19" ry="4.6" fill="#d9e8a0" />
      <path d="M30 50.5 q1.2 3.5 .2 6.5 M38 51.5 q1 3.5 0 6 M46 51.5 q1 3.5 0 6 M54 50.5 q1 3.3 0 5.8" stroke="#b8cf82" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* orqa scute-tikan qatorlari */}
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
      {open ? (
        <>
          {/* og'iz OCHIQ — jag'lar «<»/«>» belgisi metaforasi (katta son tomonga) */}
          <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
          {/* pastki jag' — zigzag tishlar yuqoriga */}
          <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
          {/* yuqori jag' — pq-cjaws; g'alabada chomp */}
          <g className={chomp ? 'pq-cjaws chomping' : 'pq-cjaws'}>
            <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
            <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
            <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
          </g>
        </>
      ) : (
        <>
          {/* og'iz TINCH/YOPIQ — teng poza (D12_01 idle snout): ikki parallel jag' chizig'i «=» metaforasi */}
          <path d="M66 35 Q92 31 116 40 Q124 42.5 123 47 Q121 51.5 114 50.5 Q92 52.5 66 50.5 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M66 36 Q92 32.5 114 41" stroke="#2e7a3e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M70 45.5 Q92 47.5 118 46" stroke="#256835" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M82 46 l2 3.2 l2 -3.2 Z M95 46.5 l2 3.2 l2 -3.2 Z M107 46.5 l1.8 3 l1.8 -3 Z" fill="#fff" stroke="#256835" strokeWidth=".5" strokeLinejoin="round" />
          <circle cx="118" cy="42.5" r="1.3" fill="#1f2430" opacity=".7" />
        </>
      )}
      {/* ko'z do'ngligi + tik qorachiqli ko'z (blik) + pirpiratuvchi qopqoq */}
      <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
      <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
      <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
      <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
      <g className="pq-cblink"><circle cx="63" cy="28.5" r="6.3" fill="#3f9950" stroke="#256835" strokeWidth="1.5" /></g>
    </svg>
  );
};

// Kanon baliq (D04_10): yon ko'rinish, tomchi-shakl tana (#e8883a, qorni #f6c07a), uchburchak
// dum + suzgichlar (#c96a24), blikli ko'z. O'ngga qaragan holat (timsoh tomon). Dumi qimirlaydi.
const Fish = () => (
  <svg viewBox="0 0 40 24" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
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

// NINACHI (D09_06): kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish CSS'da.
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

// QAMISH (D09_06): 2 poya + qo'ng'ir boshoq, pastdan sway; yonida o't-tuflar.
const Reeds = ({ flip }) => (
  <svg viewBox="0 0 40 74" width="30" height="55" aria-hidden="true" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
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

// Nilufar bargi (D12_06): kertikli disk, suvda suzadi.
const LilyPad = () => (
  <svg viewBox="0 0 54 34" width="44" height="28" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="27" cy="18" rx="25" ry="13.5" fill="#5aa84f" stroke="#3c7d36" strokeWidth="1.3" />
    <path d="M27 18 L50 9 L50 27 Z" fill="#57b0c6" />
    <path d="M27 18 Q16 12 8 12 M27 18 Q17 20 10 24" stroke="#3c7d36" strokeWidth="1" fill="none" opacity=".5" />
  </svg>
);

// Sanaladigan baliq to'plami (chap tomon). badge=true → g'alabada 1..N ko'k sanoq-badge.
const FishGroup = ({ n, start, badge }) => (
  <div className="pq-grp">
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className="pq-fish" style={{ animationDelay: `${(i % 3) * 0.45}s` }}>
        <span><Fish /></span>
        {badge && <b className="pq-cnt">{start + i + 1}</b>}
      </span>
    ))}
  </div>
);

export default function D12_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // '>' | '<' | '=' | null
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  // Timsoh = belgi: og'iz katta son tomonga ochiladi. '>' → chapga (faceL), '<' → o'ngga, '=' → yopiq.
  const facing = picked === '>' ? 'L' : picked === '<' ? 'R' : null;
  const mouthOpen = picked === '>' || picked === '<';

  const pick = (s) => { if (lock) return; setPicked(s); setFeedback(null); };

  return (
    <div className="pq pq1203">
      <style>{`
        .pq1203{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1203 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1203 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1203 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1203 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1203 .pq-pond{position:relative;min-height:214px;padding:12px;border-radius:24px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 40%,#bfe6f2 55%,#8fcbe0);border:3px solid #b9dcee;overflow:hidden;}
        .pq1203 .pq-water{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(#a3dbe6,#63b4cb 55%,#4a9cb5);z-index:0;}
        .pq1203 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.6);}
        .pq1203 .pq-sun{position:absolute;top:10px;right:14px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1203 .pq-cloud{position:absolute;width:50px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1203 .pq-cloud.c1{top:12px;left:-70px;animation-duration:30s;animation-delay:-11s;}
        .pq1203 .pq-cloud.c2{top:36px;left:-70px;width:36px;height:12px;opacity:.7;animation-duration:40s;animation-delay:-26s;}
        .pq1203 .pq-reedw{position:absolute;bottom:-4px;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1203 .pq-reedw.l{left:2px;} .pq1203 .pq-reedw.r{right:2px;}
        .pq1203 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1203 .pq-lily{position:absolute;line-height:0;z-index:1;opacity:.92;}
        .pq1203 .pq-lily.lp1{left:38px;bottom:12px;} .pq1203 .pq-lily.lp2{right:48px;bottom:8px;transform:scale(.85);}
        .pq1203 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.7);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq1203 .pq-ring.rg1{left:72px;bottom:30px;} .pq1203 .pq-ring.rg2{right:104px;bottom:44px;animation-delay:-1.9s;}
        .pq1203 .pq-dfly{position:absolute;left:64px;top:14px;line-height:0;z-index:2;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1203 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1203 .pq-dwing.w2{animation-delay:-.08s;} .pq1203 .pq-dwing.w3{animation-delay:-.14s;} .pq1203 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1203 .pq-arena{position:relative;z-index:3;display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;min-height:190px;}
        .pq1203 .pq-side{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;z-index:3;}
        .pq1203 .pq-lrow{display:flex;align-items:center;gap:6px;padding:9px 11px;border-radius:16px;background:rgba(255,255,255,.46);border:2px solid rgba(46,122,62,.3);}
        .pq1203 .pq-grp{display:flex;flex-wrap:wrap;gap:4px;max-width:76px;justify-content:center;}
        .pq1203 .pq-plus{font-size:22px;font-weight:900;color:#1a7f43;}
        .pq1203 .pq-fish{position:relative;line-height:0;animation:pqBob 2.3s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.2));}
        .pq1203 .pq-fish span{display:inline-block;line-height:0;}
        .pq1203 .pq-ftail{transform-box:fill-box;transform-origin:100% 50%;animation:pqTail 1.5s ease-in-out infinite;}
        .pq1203 .pq-cnt{position:absolute;top:-7px;right:-6px;min-width:16px;height:16px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1203 .pq-cap{font-size:15px;font-weight:800;color:#204a2a;background:rgba(255,255,255,.72);padding:1px 9px;border-radius:8px;font-variant-numeric:tabular-nums;}
        .pq1203 .pq-cap b{color:#1a7f43;margin-left:2px;}
        .pq1203 .pq-five{position:absolute;top:-16px;left:50%;font-size:30px;font-weight:900;color:#1a7f43;text-shadow:0 2px 5px rgba(255,255,255,.95);z-index:6;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1203 .pq-mid{position:relative;z-index:4;display:flex;flex-direction:column;align-items:center;}
        .pq1203 .pq-op{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:2px;z-index:6;white-space:nowrap;}
        .pq1203 .pq-q{display:inline-block;font-size:34px;font-weight:900;color:#e0863a;text-shadow:0 2px 4px rgba(255,255,255,.85);animation:pqQ 1.6s ease-in-out infinite;}
        .pq1203 .pq-sign{display:inline-block;font-size:30px;font-weight:900;color:#1c6ea0;background:rgba(255,255,255,.9);padding:0 12px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.12);}
        .pq1203 .pq-chip{display:inline-block;font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqChipIn .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq1203 .pq-crocbox{transition:transform .4s cubic-bezier(.4,1.3,.5,1);filter:drop-shadow(0 2px 2px rgba(0,0,0,.22));}
        .pq1203 .pq-crocbox.faceL{transform:scaleX(-1);}
        .pq1203 .pq-cjaws{transform-box:fill-box;transform-origin:2% 92%;transition:transform .3s ease;}
        .pq1203 .pq-cjaws.shut{transform:rotate(16deg);}
        .pq1203 .pq-cjaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq1203 .pq-ctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqCSway 3.4s ease-in-out infinite;}
        .pq1203 .pq-cthroat{transform-box:fill-box;transform-origin:50% 55%;animation:pqCThroat 1.9s ease-in-out infinite;}
        .pq1203 .pq-cblink{opacity:0;animation:pqBlink 4s linear infinite;}
        .pq1203 .pq-numcard{width:70px;height:84px;border-radius:16px;background:linear-gradient(#ffffff,#eaf4fb);border:3px solid #7fb5d6;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#1c6ea0;font-variant-numeric:tabular-nums;box-shadow:0 3px 8px rgba(0,0,0,.14);animation:pqBreath 2.8s ease-in-out infinite;}
        .pq1203 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:18px;}
        .pq1203 .pq-opt{width:74px;height:74px;font-size:36px;font-weight:900;line-height:1;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq1203 .pq-opt:hover:not(:disabled){border-color:#8fc9a6;transform:translateY(-2px);}
        .pq1203 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1203 .pq-opt.sel{border-color:#2e7a3e;background:#eaf7ef;color:#1a7f43;}
        .pq1203 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1203 .pq-opt:disabled{cursor:default;}
        .pq1203 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1203 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1203 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqTail{0%,100%{transform:rotate(7deg);}50%{transform:rotate(-7deg);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqCSway{0%,100%{transform:rotate(0deg);}50%{transform:rotate(4deg);}}
        @keyframes pqCThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pqBlink{0%,92%{opacity:0;}94%,97%{opacity:1;}99%,100%{opacity:0;}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(14deg);}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(480px);}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(60px,10px) rotate(6deg);}50%{transform:translate(120px,-6px) rotate(-4deg);}75%{transform:translate(50px,20px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
        @keyframes pqQ{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.14);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqChipIn{0%{opacity:0;transform:scale(.4);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-pond">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-water" />
        <span className="pq-lily lp1"><LilyPad /></span>
        <span className="pq-lily lp2"><LilyPad /></span>
        <span className="pq-ring rg1" /><span className="pq-ring rg2" />
        <span className="pq-reedw l"><Reeds /></span>
        <span className="pq-reedw r"><Reeds flip /></span>
        <span className="pq-dfly"><Dragonfly /></span>

        <div className="pq-arena">
          {/* CHAP: 3 + 2 (sanaladigan baliqlar) — g'alabada 5 ga aylanadi */}
          <div className="pq-side">
            {ok && <span className="pq-five">{SUM}</span>}
            <div className="pq-lrow">
              <FishGroup n={A} start={0} badge={ok} />
              <span className="pq-plus">+</span>
              <FishGroup n={B} start={A} badge={ok} />
            </div>
            <div className="pq-cap">{A} + {B}{ok && <b>= {SUM}</b>}</div>
          </div>

          {/* O'RTA: timsoh = belgi. Yopiq/ochiq og'iz tanlangan belgiga ergashadi */}
          <div className="pq-mid">
            <div className="pq-op">
              {ok
                ? <span className="pq-chip">{`${SUM} > ${RIGHT}`}</span>
                : picked
                  ? <span className="pq-sign">{picked}</span>
                  : <span className="pq-q">?</span>}
            </div>
            <div className={'pq-crocbox' + (facing === 'L' ? ' faceL' : '')}>
              <Croc open={mouthOpen} chomp={!!ok} />
            </div>
          </div>

          {/* O'NG: berilgan son 4 (son-karta) */}
          <div className="pq-side">
            <div className="pq-numcard">{RIGHT}</div>
            <div className="pq-cap">{lang === 'ru' ? 'четыре' : "to'rt"}</div>
          </div>
        </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((s) => {
          const sel = picked === s; const right = ok && s === DATA.target;
          return <button key={s} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => pick(s)}>{s}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
