// Dars30 · Amaliyot 06 — 🔴 JADVAL DAFTARI (4 qatorli ledger) · tag: table_chain
// P24 masala jadvali: ustunlar «Bor edi | O'zgarish | Natija»; 4 qator, har qatorda natija slotini to'ldirasiz.
// Misollar: 4+2=6, 8−3=5, 5+4=9, 7−2=5. Natija sloti g'alabagacha «?» (nafas oladi), tanlangan son tushadi.
// Distraktorlar: ikki xonali chalg'itgich (10/11/12), qo'shni son (±1), teskari amal natijasi.
// To'g'ri indeks har qatorda o'zgaradi (1,2,3,0). G'alaba: to'rtala natija to'g'ri to'lgach kubok + badge.
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

const ROWS = [
  { kind: 'add', a: 4, b: 2, ans: 6, opts: [10, 6, 5, 3] },  // idx1
  { kind: 'sub', a: 8, b: 3, ans: 5, opts: [11, 4, 5, 6] },  // idx2
  { kind: 'add', a: 5, b: 4, ans: 9, opts: [1, 8, 10, 9] },  // idx3
  { kind: 'sub', a: 7, b: 2, ans: 5, opts: [5, 12, 6, 4] },  // idx0
];
const DATA = { ptype: 'P24', level: '🔴', tag: 'table_chain' };
const sign = (r) => (r.kind === 'add' ? '+' : '−');
const rowLabel = (r) => `${r.a} ${sign(r)} ${r.b} = ${r.ans}`;

const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Jadval', title: 'Jadval daftari',
    setup: 'To\'rt qatorli jadval: bor edi, o\'zgarish, natija.',
    ask: 'Har qator natijasini tanlang.',
    correct: 'Barakalla! To\'rtala natija to\'g\'ri.',
    hint: 'Qo\'shishda son ortadi, ayirishda kamayadi.',
    board: 'Jadval daftari',
    hA: 'Bor edi', hB: 'O\'zgarish', hC: 'Natija',
  },
  ru: {
    eyebrow: 'У пруда · Таблица', title: 'Таблица-ведомость',
    setup: 'Таблица из четырёх строк: было, изменение, итог.',
    ask: 'Отметь итог каждой строки.',
    correct: 'Молодец! Все четыре итога верны.',
    hint: 'При сложении число растёт, при вычитании — уменьшается.',
    board: 'Таблица-ведомость',
    hA: 'Было', hB: 'Изменение', hC: 'Итог',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza, yashil 2-3 ton, tepada ikki katta ko'z (pirpiratadi), keng tabassum.
const Frog = () => (
  <svg viewBox="0 0 64 60" width="46" height="43" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="32" cy="53" rx="26" ry="6.5" fill="#4f9a48" stroke="#3c7d36" strokeWidth="1.4" />
    <ellipse cx="25" cy="51.5" rx="12" ry="2.8" fill="#68bd60" opacity=".55" />
    <path d="M12 46 Q6 38 11 31 Q16 26 19 33 Q21 41 16 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M52 46 Q58 38 53 31 Q48 26 45 33 Q43 41 48 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="32" cy="34" rx="18" ry="14.5" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.6" />
    <ellipse className="pq-throat" cx="32" cy="40" rx="11.5" ry="7.5" fill="#a8d89e" />
    <circle cx="23" cy="15" r="7.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.5" />
    <circle cx="41" cy="15" r="7.6" fill="#57a84f" stroke="#2e6e28" strokeWidth="1.5" />
    <circle cx="23" cy="15" r="5" fill="#fff" />
    <circle cx="41" cy="15" r="5" fill="#fff" />
    <circle cx="24" cy="16" r="2.2" fill="#1f2430" /><circle cx="24.9" cy="15.2" r="0.8" fill="#fff" />
    <circle cx="40" cy="16" r="2.2" fill="#1f2430" /><circle cx="40.9" cy="15.2" r="0.8" fill="#fff" />
    <g className="pq-blink"><circle cx="23" cy="15" r="5.3" fill="#57a84f" /><circle cx="41" cy="15" r="5.3" fill="#57a84f" /></g>
    <path d="M22 29 Q32 36 42 29" stroke="#2e6e28" strokeWidth="1.9" fill="none" strokeLinecap="round" />
    <path d="M25 45.5 L25 51 M39 45.5 L39 51" stroke="#3f8a39" strokeWidth="3.4" strokeLinecap="round" />
  </svg>
);

// NINACHI: kichik tana + shaffof qanotlar (pirillaydi), suzish traektoriyasi CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="34" height="21" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse className="pq-dwing" cx="18" cy="8" rx="12" ry="4" fill="#cfe9fb" transform="rotate(-18 18 8)" />
    <ellipse className="pq-dwing w2" cx="26" cy="8" rx="12" ry="4" fill="#dff1fd" transform="rotate(14 26 8)" />
    <ellipse className="pq-dwing w3" cx="18" cy="19" rx="11" ry="3.6" fill="#cfe9fb" transform="rotate(16 18 19)" />
    <ellipse className="pq-dwing w4" cx="26" cy="19" rx="11" ry="3.6" fill="#dff1fd" transform="rotate(-12 26 19)" />
    <path d="M33 13.5 L9 13.5" stroke="#4f8fc4" strokeWidth="3" strokeLinecap="round" />
    <circle cx="36" cy="13.5" r="3.6" fill="#4f8fc4" stroke="#33648f" strokeWidth="1.2" />
    <circle cx="37.6" cy="12.2" r="1" fill="#1f2430" />
  </svg>
);

// QAMISH: poya + qo'ng'ir boshoq, pastdan sway.
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

// NILUFAR BARGI (suvda): yashil barg + kesim, ustida ochilgan gul; suvda yengil tebranadi.
const Lily = ({ bloom }) => (
  <svg viewBox="0 0 36 18" width="32" height="16" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
    <ellipse cx="18" cy="12" rx="16" ry="5.6" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1" />
    <path d="M18 12 L34 8.6 L34 15.4 Z" fill="#5fb3c9" />
    <ellipse cx="13" cy="10.4" rx="7" ry="2.2" fill="#68bd60" opacity=".6" />
    {bloom && (<g>
      <path d="M18 8 L15.4 2.6 L18 4.6 L20.6 2.6 Z M18 8 L12.6 5 L15 7.6 Z M18 8 L23.4 5 L21 7.6 Z" fill="#f8b8cf" stroke="#e58bad" strokeWidth=".6" strokeLinejoin="round" />
      <circle cx="18" cy="6.8" r="1.4" fill="#f6c14c" />
    </g>)}
  </svg>
);

// BALIQ (haqiqiy): gradientsiz ammo 2-ton tana, suzgich chizig'i, ko'z-blik; vaqti-vaqti bilan suvdan sakraydi.
const Fish = () => (
  <svg viewBox="0 0 34 18" width="28" height="15" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M3 9 Q0 3 1 1.5 Q6 3.5 8.5 6.5 L8.5 11.5 Q6 14.5 1 16.5 Q0 15 3 9 Z" fill="#f0a04b" stroke="#c97a2e" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="19" cy="9" rx="11" ry="6.5" fill="#f6b45f" stroke="#c97a2e" strokeWidth="1.1" />
    <path d="M14 4.6 Q18.5 1.4 22 4.2" fill="none" stroke="#c97a2e" strokeWidth="1" />
    <path d="M13 9 Q19 12.6 25 9.6" fill="none" stroke="#e08c37" strokeWidth="1" opacity=".8" />
    <circle cx="24.5" cy="7.4" r="1.5" fill="#1f2430" /><circle cx="25.1" cy="6.9" r=".55" fill="#fff" />
  </svg>
);

// G'alaba kuboki (ixcham).
const Trophy = () => (
  <svg viewBox="0 0 64 64" width="46" height="46" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M17 13 Q5 14 9 24 Q12 32 21 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M47 13 Q59 14 55 24 Q52 32 43 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 8 H46 V22 a14 14 0 0 1 -28 0 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="36" width="8" height="8" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="20" y="44" width="24" height="6" rx="2" fill="#f2b134" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="15" y="50" width="34" height="7" rx="2.5" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.8" />
    <path d="M32 12.5 L33.6 16 L37.4 16.4 L34.6 18.9 L35.4 22.6 L32 20.7 L28.6 22.6 L29.4 18.9 L26.6 16.4 L30.4 16 Z" fill="#fff" opacity=".9" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

const FROGS = [
  { x: 22, y: 116 },
  { x: 118, y: 116 },
  { x: 214, y: 116 },
  { x: 300, y: 116 },
];

export default function D30_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]); // eslint-disable-line
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => vals[i] === ROWS[i].ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${rowLabel(r)} [${r.opts.join('/')}]`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const slotCls = (i) => 'pq-slot' + (vals[i] != null ? ' has' : '');
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className={"pq pq3006" + (still ? " still" : "")}>
      <style>{`
        .pq3006.still *{animation:none !important;}
        .pq3006{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;box-sizing:border-box;}
        .pq3006 *{box-sizing:border-box;}
        .pq3006 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq3006 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq3006 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3006 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq3006 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq3006 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:180px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 46%,#d6eef5 60%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq3006 .pq-fit{position:relative;margin:0 auto;}
        .pq3006 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pq3006Sun 3.6s ease-in-out infinite;z-index:1;}
        .pq3006 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pq3006Cloud linear infinite;z-index:1;}
        .pq3006 .pq-cloud.c1{top:14px;left:-70px;animation-duration:29s;animation-delay:-11s;}
        .pq3006 .pq-cloud.c2{top:38px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-25s;}
        .pq3006 .pq-water{position:absolute;left:0;right:0;bottom:0;height:100px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq3006 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq3006 .pq-shore{position:absolute;bottom:0;width:70px;height:24px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq3006 .pq-shore.l{left:0;border-radius:0 26px 0 0;}
        .pq3006 .pq-shore.r{right:0;border-radius:26px 0 0 0;}
        .pq3006 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq3006 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pq3006Sway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq3006 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:3;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq3006 .pq-board::before,.pq3006 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq3006 .pq-board::before{left:16px;} .pq3006 .pq-board::after{right:16px;}
        .pq3006 .pq-dflyw{position:absolute;left:80px;top:40px;line-height:0;z-index:3;animation:pq3006Dfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq3006 .pq-lilyw{position:absolute;line-height:0;z-index:2;animation:pq3006BobF 3.4s ease-in-out infinite;animation-delay:var(--ld,0s);filter:drop-shadow(0 2px 2px rgba(0,30,40,.14));}
        .pq3006 .pq-fishw{position:absolute;left:154px;bottom:30px;line-height:0;z-index:1;opacity:0;animation:pq3006Leap 7s ease-in-out infinite;animation-delay:1.4s;filter:drop-shadow(0 2px 2px rgba(0,30,40,.2));}
        .pq3006 .pq-dwing{animation:pq3006Flutter .22s linear infinite alternate;opacity:.5;}
        .pq3006 .pq-dwing.w2{animation-delay:-.08s;} .pq3006 .pq-dwing.w3{animation-delay:-.14s;} .pq3006 .pq-dwing.w4{animation-delay:-.05s;}
        .pq3006 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pq3006Ring 3.8s ease-out infinite;}
        .pq3006 .pq-ring.r2{animation-delay:-1.9s;}
        .pq3006 .pq-frog{position:absolute;line-height:0;z-index:2;animation:pq3006HopIn .8s cubic-bezier(.4,1.2,.6,1) both;animation-delay:var(--hd,0s);filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq3006 .pq-scene.still .pq-frog{animation:none;}
        .pq3006 .pq-bobf{display:block;position:relative;animation:pq3006BobF 2.6s ease-in-out infinite;animation-delay:var(--fd,0s);}
        .pq3006 .pq-bobf.win{animation:pq3006BobF 2.6s ease-in-out infinite,pq3006Cele .55s ease;}
        .pq3006 .pq-blink{opacity:0;animation:pq3006Blink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq3006 .pq-throat{transform-box:fill-box;transform-origin:50% 55%;animation:pq3006Throat 1.7s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq3006 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pq3006Pop .3s ease both;z-index:4;}
        .pq3006 .pq-trophy{position:absolute;top:52px;left:50%;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 6px rgba(201,138,18,.4));animation:pq3006Ans .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq3006 .pq-wstar{position:absolute;z-index:4;line-height:0;opacity:0;animation:pq3006Twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq3006 .pq-wstar.w2{animation-delay:-.5s;} .pq3006 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq3006 .pq-table{width:372px;max-width:100%;display:flex;flex-direction:column;gap:6px;box-sizing:border-box;}
        .pq3006 .pq-hdr{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:6px;padding:0 4px;}
        .pq3006 .pq-hc{font-size:12px;font-weight:800;letter-spacing:.02em;color:#5c6672;text-transform:uppercase;text-align:center;}
        .pq3006 .pq-rw{border-radius:14px;border:2.5px solid #cfe3da;background:#fff;padding:7px 8px;transition:.15s;}
        .pq3006 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq3006 .pq-rw.good.win{animation:pq3006Cele .5s ease;}
        .pq3006 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq3006Shake .35s ease;}
        .pq3006 .pq-cells{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:6px;align-items:center;}
        .pq3006 .pq-cell{height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;font-variant-numeric:tabular-nums;padding:0 4px;}
        .pq3006 .pq-cell.a{background:#f4f6fa;border:2px solid #d9dde5;color:#374151;}
        .pq3006 .pq-cell.op{background:#f4f6fa;border:2px solid #d9dde5;color:#374151;gap:4px;}
        .pq3006 .pq-cell.op .s{font-weight:900;} .pq3006 .pq-cell.op .s.plus{color:#1a7f43;} .pq3006 .pq-cell.op .s.minus{color:#c0392b;}
        .pq3006 .pq-slot{height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq3006Breath 2.4s ease-in-out infinite;}
        .pq3006 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq3006 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq3006 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq3006 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq3006 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq3006 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq3006 .pq-sgs{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;justify-content:center;}
        .pq3006 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:18px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq3006 .pq-sg:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq3006 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq3006 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq3006 .pq-sg:disabled{cursor:default;}
        .pq3006 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3006In .22s ease both;}
        .pq3006 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3006 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3006Sun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pq3006Cloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pq3006Sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq3006Dfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(72px,-14px) rotate(6deg);}50%{transform:translate(126px,14px) rotate(-4deg);}75%{transform:translate(52px,30px) rotate(5deg);}}
        @keyframes pq3006Flutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pq3006Ring{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pq3006HopIn{0%{opacity:0;transform:translate(-52px,-4px);}35%{opacity:1;transform:translate(-30px,-28px);}65%{transform:translate(-10px,-6px);}82%{transform:translate(-3px,-12px);}100%{transform:translate(0,0);}}
        @keyframes pq3006BobF{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq3006Throat{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pq3006Blink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pq3006Breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.05);border-color:#a9b5c8;}}
        @keyframes pq3006Twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3006Shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq3006Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3006Ans{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq3006Cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pq3006In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pq3006Leap{0%,55%,100%{opacity:0;transform:translateY(26px) rotate(24deg);}62%{opacity:1;}68%{opacity:1;transform:translateY(-18px) rotate(-6deg);}74%{opacity:1;transform:translateY(0) rotate(-28deg);}80%{opacity:0;transform:translateY(26px) rotate(-40deg);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 180 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" />
          <span className="pq-water" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-reedw" style={{ left: 5, bottom: 72 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 5, bottom: 66 }}><Reeds flip /></span>
          <div className="pq-board">{t.board}</div>
          <span className="pq-ring" style={{ left: 66, bottom: 26 }} />
          <span className="pq-ring r2" style={{ left: 248, bottom: 40 }} />
          <span className="pq-lilyw" style={{ left: 96, bottom: 18, '--ld': '-1.1s' }}><Lily bloom /></span>
          <span className="pq-lilyw" style={{ left: 208, bottom: 8, '--ld': '-2.3s' }}><Lily /></span>
          <span className="pq-lilyw" style={{ left: 292, bottom: 22, '--ld': '-.4s' }}><Lily bloom /></span>
          <span className="pq-fishw"><Fish /></span>
          <span className="pq-dflyw"><Dragonfly /></span>

          {/* 4 kanon-qurbaqa — mount'da birin-ketin sakrab kiradi, keyin bob; g'alabada badge 1..4 */}
          {FROGS.map((p, i) => (
            <span key={i} className="pq-frog" style={{ left: p.x, top: p.y, '--hd': `${i * 0.22}s` }}>
              <span className={'pq-bobf' + (ok ? ' win' : '')} style={{ '--fd': `-${i * 0.65}s`, '--bd': `-${i * 0.9}s` }}>
                <Frog />
                {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.12}s` }}>{i + 1}</b>}
              </span>
            </span>
          ))}

          {ok && (
            <>
              <span className="pq-trophy"><Trophy /></span>
              <span className="pq-wstar" style={{ left: '36%', top: '48px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '61%', top: '60px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '104px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
        </div>

        <div className="pq-table">
          <div className="pq-hdr">
            <span className="pq-hc">{t.hA}</span>
            <span className="pq-hc">{t.hB}</span>
            <span className="pq-hc">{t.hC}</span>
          </div>
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-cells">
                  <div className="pq-cell a">{r.a}</div>
                  <div className="pq-cell op">
                    <span className={'s ' + (r.kind === 'add' ? 'plus' : 'minus')}>{r.kind === 'add' ? '+' : '−'}</span>
                    <span>{r.b}</span>
                  </div>
                  <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
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
