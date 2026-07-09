// Dars12 · Amaliyot 06 — P4 Belgilar zanjiri (taqqoslash) · 🔴 · timsoh · tag: sign_chain
// 4 taqqoslash juftligi birdaniga (> < =). Har juft: [son] [? belgi-slot] [son] + 3 belgi-tugma.
// Ko'l-sahna: taxta «Taqqoslash smenasi», 4 kanon-timsoh nilufar bargida (mount'da suzib kiradi,
// ko'z pirpiratadi + dum-tomoq harakati; g'alabada og'iz ochib chomp + badge 1..4). Qamishlar sway,
// ninachi suzadi, suv-halqalar, quyosh breath, 2 bulut. Веди-до-верного, ozvuchkasiz. Belgilar U+003E/3C/3D.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { a: 6, b: 4, ans: '>', opts: ['>', '<', '='] },
  { a: 3, b: 5, ans: '<', opts: ['>', '<', '='] },
  { a: 7, b: 7, ans: '=', opts: ['>', '<', '='] },
  { a: 8, b: 2, ans: '>', opts: ['>', '<', '='] },
];
const DATA = { ptype: 'P4', level: '🔴', tag: 'sign_chain' };
const T = {
  uz: {
    eyebrow: 'Timsohlar ko\'li · Zanjir', title: 'Belgilar zanjiri',
    setup: 'Timsohlar to\'rtta juftlikni taqqoslamoqchi. Har juftga to\'g\'ri belgi kerak.',
    ask: 'Har juft songa to\'g\'ri belgini tanlang.',
    correct: 'Barakalla! To\'rtala belgi to\'g\'ri — timsohlar mamnun!',
    hint: 'Qizil qatorlarga qarang: qaysi son katta? Teng bo\'lsa — teng belgisi.',
    board: 'Taqqoslash smenasi',
  },
  ru: {
    eyebrow: 'Озеро крокодилов · Цепочка', title: 'Цепочка знаков',
    setup: 'Крокодилы хотят сравнить четыре пары. Для каждой пары нужен верный знак.',
    ask: 'Выбери верный знак для каждой пары чисел.',
    correct: 'Молодец! Все четыре знака верны — крокодилы довольны!',
    hint: 'Посмотри на красные строки: какое число больше? Если равны — знак равенства.',
    board: 'Смена сравнения',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// TIMSOH KANONI (D04_10): cho'zilgan yashil tana (3 ton), tikanli scute-orqa, panjali oyoq,
// blikli ko'z, ochiq jag' — jag'lar < > belgisini eslatadi. chomp=true: og'iz qisilib-ochiladi.
// pq-cjaws — yuqori jag'; pq-ctail — dum sekin tebranadi; pq-cblink — ko'z pirpiraydi.
const Croc = ({ chomp }) => (
  <svg viewBox="0 0 132 72" width="76" height="41" aria-hidden="true" style={{ display: 'block' }}>
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
    {/* og'iz ichi — och-pushti */}
    <path d="M68 42 L108 23 L108 55 Z" fill="#f2a9b4" />
    {/* pastki jag' — zigzag tishlar yuqoriga */}
    <path d="M66 42 L116 55 Q125 57.5 123 62 Q120.5 65.5 111 62.5 L64 51.5 Z" fill="#b8d488" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M72 45.5 L78.5 40 L82 48 L88.5 42.5 L92 50.5 L98.5 45 L102 53 L108.5 47.5 L112 55.5 Z" fill="#fff" />
    {/* yuqori jag' — pq-cjaws shu guruhda; tishlar pastga, burun teshigi uchida */}
    <g className={chomp ? 'pq-cjaws chomping' : 'pq-cjaws'}>
      <path d="M66 34 Q70 30 78 30 L114 14 Q123 10.5 126 15.5 Q127.5 19.5 119 23.5 L74 44 Z" fill="#4aa35b" stroke="#256835" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M67.5 33 Q71 30.5 78 30 L114 14 Q120 11.5 123.5 13 L117 16.5 L77 34.5 Z" fill="#2e7a3e" />
      <path d="M118 24 L116 31.5 L110 27.5 L108 35 L101 31 L99 38.5 L93 35 L91 42 L84 38.5 L82.5 45.5 L76 42 Z" fill="#fff" />
      <circle cx="117.5" cy="16.5" r="1.3" fill="#1f2430" opacity=".75" />
    </g>
    {/* ko'z do'ngligi + tik qorachiqli ko'z (blik) + pirpiratuvchi qopqoq */}
    <circle cx="63" cy="28.5" r="6" fill="#3f9950" stroke="#256835" strokeWidth="1.5" />
    <circle cx="63.6" cy="27.8" r="3.9" fill="#fff" />
    <ellipse cx="64.3" cy="28" rx="1.5" ry="2.5" fill="#1f2430" />
    <circle cx="65" cy="26.9" r="0.75" fill="#fff" />
    <g className="pq-cblink"><circle cx="63" cy="28.5" r="6.3" fill="#3f9950" stroke="#256835" strokeWidth="1.5" /></g>
  </svg>
);

// NINACHI (D09_06): kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" aria-hidden="true" style={{ display: 'block' }}>
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

// Nilufar bargi — kertikli disk, suvda suzadi.
const LilyPad = () => (
  <svg viewBox="0 0 54 34" width="50" height="31" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="27" cy="18" rx="25" ry="13.5" fill="#5aa84f" stroke="#3c7d36" strokeWidth="1.3" />
    <path d="M27 18 L50 9 L50 27 Z" fill="#57b0c6" />
    <path d="M27 18 Q16 12 8 12 M27 18 Q17 20 10 24" stroke="#3c7d36" strokeWidth="1" fill="none" opacity=".5" />
  </svg>
);

// Timsohlar joyi (sahna px, wrapper top-left) — bir qatorda, yengil balandlik farqi.
const CROCS = [
  { x: 4, y: 116, flip: false },
  { x: 96, y: 130, flip: true },
  { x: 188, y: 116, flip: false },
  { x: 280, y: 130, flip: true },
];

export default function D12_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: belgi}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda suzib-kirish qayta ijro etilmaydi — statik yakuniy holat.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a} ? ${r.b}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq1206">
      <style>{`
        .pq1206{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1206 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2e7a3e;text-transform:uppercase;}
        .pq1206 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1206 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1206 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1206 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq1206 .pq-scene{position:relative;width:372px;max-width:100%;height:200px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 44%,#d6eef5 58%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq1206 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1206 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1206 .pq-cloud.c1{top:14px;left:-70px;animation-duration:29s;animation-delay:-11s;}
        .pq1206 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-25s;}
        .pq1206 .pq-water{position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq1206 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq1206 .pq-shore{position:absolute;bottom:0;width:74px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq1206 .pq-shore.l{left:0;border-radius:0 24px 0 0;}
        .pq1206 .pq-shore.r{right:0;border-radius:24px 0 0 0;}
        .pq1206 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1206 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq1206 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:5;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq1206 .pq-board::before,.pq1206 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq1206 .pq-board::before{left:16px;} .pq1206 .pq-board::after{right:16px;}
        .pq1206 .pq-dflyw{position:absolute;left:86px;top:44px;line-height:0;z-index:4;animation:pqDfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq1206 .pq-dwing{animation:pqFlutter .22s linear infinite alternate;opacity:.5;}
        .pq1206 .pq-dwing.w2{animation-delay:-.08s;} .pq1206 .pq-dwing.w3{animation-delay:-.14s;} .pq1206 .pq-dwing.w4{animation-delay:-.05s;}
        .pq1206 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pqRing 3.8s ease-out infinite;}
        .pq1206 .pq-ring.r2{animation-delay:-1.9s;}
        .pq1206 .pq-lily{position:absolute;line-height:0;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq1206 .pq-croc{position:absolute;line-height:0;z-index:3;animation:pqSwimIn .85s cubic-bezier(.35,1.15,.6,1) both;animation-delay:var(--sd,0s);filter:drop-shadow(0 2px 3px rgba(0,0,0,.22));}
        .pq1206 .pq-scene.still .pq-croc{animation:none;}
        .pq1206 .pq-croc.flip{transform:scaleX(-1);}
        .pq1206 .pq-bobc{display:block;position:relative;animation:pqBobC 2.9s ease-in-out infinite;animation-delay:var(--fd,0s);}
        .pq1206 .pq-bobc.win{animation:pqBobC 2.9s ease-in-out infinite,pqCele .6s ease;}
        .pq1206 .pq-ctail{transform-box:fill-box;transform-origin:92% 58%;animation:pqSway 3.2s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1206 .pq-cthroat{transform-box:fill-box;transform-origin:50% 40%;animation:pqThroat 1.9s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq1206 .pq-cblink{opacity:0;animation:pqBlink 4s linear infinite;animation-delay:var(--bd,0s);}
        .pq1206 .pq-cjaws{transform-box:fill-box;transform-origin:2% 90%;}
        .pq1206 .pq-cjaws.chomping{animation:pqChomp .5s ease-in-out 3;}
        .pq1206 .pq-cnt{position:absolute;top:-6px;left:44%;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:6;}
        .pq1206 .pq-croc.flip .pq-cnt{transform:scaleX(-1);}
        .pq1206 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1206 .pq-wstar.w2{animation-delay:-.5s;} .pq1206 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq1206 .pq-rows{display:flex;flex-direction:column;gap:7px;width:372px;max-width:100%;}
        .pq1206 .pq-rw{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:6px 12px;border-radius:14px;border:2.5px solid #cfe3da;background:#fff;transition:.15s;}
        .pq1206 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1206 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1206 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}
        .pq1206 .pq-pair{display:flex;align-items:center;gap:9px;}
        .pq1206 .pq-num{min-width:40px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;}
        .pq1206 .pq-rw.good .pq-num{border-color:#bfe3cd;background:#f2fbf5;}
        .pq1206 .pq-slot{width:46px;height:46px;border-radius:12px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:27px;font-weight:900;color:#aab3c2;line-height:1;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1206 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq1206 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1206 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1206 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1206 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1206 .pq-rw.good .pq-slot{border-style:solid;border-color:#1a7f43;color:#1a7f43;background:#fff;animation:none;}
        .pq1206 .pq-rw.bad .pq-slot{border-color:#e08a8a;color:#c0392b;background:#fff;animation:none;}
        .pq1206 .pq-sgs{display:flex;gap:6px;}
        .pq1206 .pq-sg{width:42px;height:42px;border-radius:11px;border:2.5px solid #d6dae3;background:#fff;font-size:22px;font-weight:900;color:#374151;cursor:pointer;line-height:1;transition:.12s;}
        .pq1206 .pq-sg:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq1206 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1206 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1206 .pq-sg:disabled{cursor:default;}
        .pq1206 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1206 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1206 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqDfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(72px,-14px) rotate(6deg);}50%{transform:translate(126px,14px) rotate(-4deg);}75%{transform:translate(52px,30px) rotate(5deg);}}
        @keyframes pqFlutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pqRing{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pqSwimIn{0%{opacity:0;transform:translateX(-46px) scale(.85);}55%{opacity:1;}100%{opacity:1;transform:translateX(0) scale(1);}}
        @keyframes pqBobC{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqThroat{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqChomp{0%,100%{transform:rotate(0);}50%{transform:rotate(13deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-scene' + (still ? ' still' : '')}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-water" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-reedw" style={{ left: 4, bottom: 90 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 4, bottom: 84 }}><Reeds flip /></span>
          <div className="pq-board">{t.board}</div>
          <span className="pq-ring" style={{ left: 70, bottom: 28 }} />
          <span className="pq-ring r2" style={{ left: 250, bottom: 44 }} />
          <span className="pq-dflyw"><Dragonfly /></span>

          {/* nilufar barglari — timsohlar ostida */}
          {CROCS.map((p, i) => (
            <span key={'l' + i} className="pq-lily" style={{ left: p.x + 14, top: p.y + 26 }}><LilyPad /></span>
          ))}

          {/* 4 kanon-timsoh — mount'da suzib kiradi; g'alabada og'iz ochib chomp + badge 1..4 */}
          {CROCS.map((p, i) => (
            <span key={i} className={'pq-croc' + (p.flip ? ' flip' : '')} style={{ left: p.x, top: p.y, '--sd': `${i * 0.2}s` }}>
              <span className={'pq-bobc' + (ok ? ' win' : '')} style={{ '--fd': `-${i * 0.7}s`, '--bd': `-${i * 0.85}s` }}>
                <Croc chomp={!!ok} />
                {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
              </span>
            </span>
          ))}

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '30%', top: '58px' }}><svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#f2b134" /></svg></span>
              <span className="pq-wstar w2" style={{ left: '64%', top: '70px' }}><svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#e59a2f" /></svg></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '112px' }}><svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#f2b134" /></svg></span>
            </>
          )}
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-pair">
                  <span className="pq-num">{r.a}</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                  <span className="pq-num">{r.b}</span>
                </div>
                <div className="pq-sgs">
                  {r.opts.map((s) => (
                    <button key={s} type="button" className={'pq-sg' + (vals[i] === s ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: s })); setFeedback(null); }}>{s}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
