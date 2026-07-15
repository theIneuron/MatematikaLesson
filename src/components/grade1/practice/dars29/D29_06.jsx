// Dars29 · Amaliyot 06 — 🔴 CHAIN aralash (qoldiq + noma'lum qo'shiluvchi) · tag: chain
// 4 misol 2×2 panjarada: 2 ta ayirish (qoldiq: bor − oldi), 2 ta yo'q qo'shiluvchi (a + ? = jami → jami − a).
// Bola berilgan amal bo'yicha to'g'ri SONLI javobni tanlaydi; variantlar bitta qatorda, tanlangan javob faol slotga tushadi.
// Distraktorlar: ikki xonali chalg'itgich (10/13/16 — belgini teskari yoki jamlab), qo'shni son (±1).
// To'g'ri indeks har qatorda o'zgaradi (1,2,3,0). G'alaba: to'rtala slot to'g'ri to'lgach kubok + badge.
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
  { kind: 'sub', a: 7, b: 3, ans: 4, opts: [10, 4, 3, 5] },       // idx1
  { kind: 'add', a: 5, sum: 8, ans: 3, opts: [13, 8, 3, 2] },     // idx2
  { kind: 'sub', a: 9, b: 4, ans: 5, opts: [13, 4, 6, 5] },       // idx3
  { kind: 'add', a: 6, sum: 10, ans: 4, opts: [4, 16, 5, 3] },    // idx0
];
const DATA = { ptype: 'P8', level: '🔴', tag: 'chain' };
const rowLabel = (r) => (r.kind === 'sub' ? `${r.a} − ${r.b} = ?` : `${r.a} + ? = ${r.sum}`);

const T = {
  uz: {
    eyebrow: 'Hovuz bo\'yida · Zanjir', title: 'Aralash zanjir',
    setup: 'To\'rtta misol bor: ba\'zisi ayirish, ba\'zisida qo\'shiluvchi yashiringan.',
    ask: 'Har bir misolga to\'g\'ri javobni tanlang.',
    correct: 'Barakalla! To\'rtala javob to\'g\'ri — zanjir g\'olibi sizsiz!',
    hint: 'Ayirishda son kamayadi. Yashiringan qo\'shiluvchini jamidan toping: jami − ma\'lum son.',
    board: 'Aralash zanjir',
  },
  ru: {
    eyebrow: 'У пруда · Цепочка', title: 'Смешанная цепочка',
    setup: 'Четыре примера: где-то вычитание, а где-то спряталось слагаемое.',
    ask: 'Выбери верный ответ для каждого примера.',
    correct: 'Молодец! Все четыре ответа верны — победитель цепочки это ты!',
    hint: 'При вычитании число уменьшается. Спрятанное слагаемое найди из суммы: сумма − известное число.',
    board: 'Смешанная цепочка',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QURBAQA KANONI: o'tirgan poza, yashil 2-3 ton (tana #57a84f, qorin #a8d89e, kontur #2e6e28),
// TEPADA ikki bo'rtiq katta ko'z (oq + qorachiq + blik, pirpiratadi), keng tabassum,
// old panjalar oldda, orqa oyoq bukilgan; ostida nilufar bargi.
const Frog = () => (
  <svg viewBox="0 0 64 60" width="52" height="49" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="32" cy="53" rx="26" ry="6.5" fill="#4f9a48" stroke="#3c7d36" strokeWidth="1.4" />
    <path d="M32 53 L54 49.5" stroke="#3c7d36" strokeWidth="1.2" opacity=".6" />
    <ellipse cx="25" cy="51.5" rx="12" ry="2.8" fill="#68bd60" opacity=".55" />
    <path d="M12 46 Q6 38 11 31 Q16 26 19 33 Q21 41 16 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M52 46 Q58 38 53 31 Q48 26 45 33 Q43 41 48 46 Z" fill="#3f8a39" stroke="#2e6e28" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 47 L7 49.5 M14.5 48 L10.5 51" stroke="#2e6e28" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M52 47 L57 49.5 M49.5 48 L53.5 51" stroke="#2e6e28" strokeWidth="1.6" strokeLinecap="round" />
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
    <path d="M25 51 L21 53 M25 51 L28.5 53.4 M39 51 L35.5 53.4 M39 51 L43 53" stroke="#2e6e28" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// NINACHI: kichik tana + 2 juft shaffof qanot (pirillaydi), aylanma-suzish traektoriyasi CSS'da.
const Dragonfly = () => (
  <svg viewBox="0 0 48 30" width="38" height="24" aria-hidden="true" style={{ display: 'block' }}>
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

// QAMISH: 2 poya + qo'ng'ir boshoq, pastdan sway; yonida o't-tuflar.
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

// Baliq — lip etib sakrash (dekor, sanalmaydi).
const Fish = () => (
  <svg viewBox="0 0 34 20" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 10 Q1 4 2 2 Q8 4 10 8 Z" fill="#e8834d" stroke="#b95c28" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="17" cy="10" rx="11" ry="6.5" fill="#f2a066" stroke="#b95c28" strokeWidth="1.3" />
    <path d="M13 6 Q17 3.4 21 6" stroke="#b95c28" strokeWidth="1" fill="none" opacity=".6" />
    <circle cx="23" cy="8.6" r="1.4" fill="#1f2430" /><circle cx="23.5" cy="8.2" r="0.5" fill="#fff" />
  </svg>
);

// G'alaba kuboki (ixcham).
const Trophy = () => (
  <svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M17 13 Q5 14 9 24 Q12 32 21 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M47 13 Q59 14 55 24 Q52 32 43 31" fill="none" stroke="#c98a12" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 8 H46 V22 a14 14 0 0 1 -28 0 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 12 Q22 24 27 30" stroke="#f8d47a" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".9" />
    <rect x="28" y="36" width="8" height="8" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="20" y="44" width="24" height="6" rx="2" fill="#f2b134" stroke="#c98a12" strokeWidth="1.6" />
    <rect x="15" y="50" width="34" height="7" rx="2.5" fill="#e2a41f" stroke="#c98a12" strokeWidth="1.8" />
    <path d="M32 12.5 L33.6 16 L37.4 16.4 L34.6 18.9 L35.4 22.6 L32 20.7 L28.6 22.6 L29.4 18.9 L26.6 16.4 L30.4 16 Z" fill="#fff" opacity=".9" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

// Qurbaqalar joyi (sahna px, wrapper top-left).
const FROGS = [
  { x: 20, y: 122 },
  { x: 110, y: 122 },
  { x: 200, y: 122 },
  { x: 290, y: 122 },
];

export default function D29_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda sakrab-kirish qayta ijro etilmaydi — statik yakuniy holat.
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
    <div className="pq pq2906">
      <style>{`
        .pq2906{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq2906 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#1f8a8a;text-transform:uppercase;}
        .pq2906 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq2906 .pq-setup{color:#5c6672;font-weight:500;}
        .pq2906 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq2906 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 10px 12px;border-radius:22px;background:linear-gradient(#eaf6f0,#dcefe6);border:2px solid #c9e3d4;}
        .pq2906 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:212px;border-radius:18px;background:linear-gradient(#cfe9fb 0%,#e2f3fd 46%,#d6eef5 60%);border:2px solid #bfdfe8;overflow:hidden;}
        .pq2906 .pq-fit{position:relative;margin:0 auto;}
        .pq2906 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pq2906Sun 3.6s ease-in-out infinite;z-index:1;}
        .pq2906 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pq2906Cloud linear infinite;z-index:1;}
        .pq2906 .pq-cloud.c1{top:14px;left:-70px;animation-duration:29s;animation-delay:-11s;}
        .pq2906 .pq-cloud.c2{top:38px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-25s;}
        .pq2906 .pq-cloud.c3{top:26px;left:-70px;width:30px;height:10px;opacity:.55;animation-duration:44s;animation-delay:-36s;}
        /* kapalaklar (Dars15 etaloni) */
        .pq2906 .pq-bfly{position:absolute;width:8px;height:8px;z-index:3;}
        .pq2906 .pq-bfly::before,.pq2906 .pq-bfly::after{content:'';position:absolute;top:0;width:6px;height:9px;border-radius:60%;}
        .pq2906 .pq-bfly::before{left:-3px;transform-origin:right center;animation:pq2906Wing .26s ease-in-out infinite alternate;}
        .pq2906 .pq-bfly::after{right:-3px;transform-origin:left center;animation:pq2906Wing .26s ease-in-out infinite alternate;}
        .pq2906 .pq-bfly.bf1::before,.pq2906 .pq-bfly.bf1::after{background:#ff9ec4;}
        .pq2906 .pq-bfly.bf2::before,.pq2906 .pq-bfly.bf2::after{background:#ffcf5a;}
        .pq2906 .pq-bfly.bf1{top:58px;left:14%;animation:pq2906Flit1 8s ease-in-out infinite;}
        .pq2906 .pq-bfly.bf2{top:70px;right:16%;animation:pq2906Flit2 9s ease-in-out infinite;}
        /* nilufar bargi + guli (suvda, dekor) */
        .pq2906 .pq-lily{position:absolute;left:52%;bottom:34px;width:34px;height:12px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#6fbf62,#3f8a39);z-index:1;animation:pq2906BobF 3.4s ease-in-out infinite;}
        .pq2906 .pq-lily::before{content:'';position:absolute;right:-2px;top:-1px;width:12px;height:9px;background:#9adbe2;border-radius:0 50% 50% 0;}
        .pq2906 .pq-lily::after{content:'';position:absolute;left:6px;top:-7px;width:9px;height:9px;border-radius:50%;background:#ffd1e4;box-shadow:5px 0 0 -1px #ffb9d6,-4px 1px 0 -1px #ffb9d6,2px -4px 0 -1px #fff;}
        /* qirg'oq gullari (dekor) */
        .pq2906 .pq-fl{position:absolute;width:6px;height:6px;border-radius:50%;z-index:3;}
        .pq2906 .pq-fl.fl1{left:26px;bottom:14px;background:#ffd94a;box-shadow:4px 0 0 #ffd94a,-4px 0 0 #ffd94a,0 4px 0 #ffd94a,0 -4px 0 #ffd94a;}
        .pq2906 .pq-fl.fl2{right:30px;bottom:12px;background:#ff9ec4;box-shadow:4px 0 0 #ff9ec4,-4px 0 0 #ff9ec4,0 4px 0 #ff9ec4,0 -4px 0 #ff9ec4;}
        .pq2906 .pq-water{position:absolute;left:0;right:0;bottom:0;height:128px;background:linear-gradient(#9adbe2,#5fb3c9 55%,#4a9cb5);z-index:0;}
        .pq2906 .pq-water::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:rgba(255,255,255,.65);}
        .pq2906 .pq-shore{position:absolute;bottom:0;width:74px;height:26px;background:linear-gradient(#8ecb76,#6fae58);z-index:1;}
        .pq2906 .pq-shore.l{left:0;border-radius:0 26px 0 0;}
        .pq2906 .pq-shore.r{right:0;border-radius:26px 0 0 0;}
        .pq2906 .pq-reedw{position:absolute;line-height:0;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));}
        .pq2906 .pq-reed{transform-box:fill-box;transform-origin:50% 100%;animation:pq2906Sway 3.4s ease-in-out infinite;animation-delay:var(--rd,0s);}
        .pq2906 .pq-board{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:3;padding:6px 14px 7px;border-radius:10px;background:linear-gradient(#c19256,#a97b40);border:2.5px solid #8a6234;color:#fdf6e8;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.18);}
        .pq2906 .pq-board::before,.pq2906 .pq-board::after{content:'';position:absolute;top:100%;width:6px;height:12px;background:#8a6234;border-radius:0 0 3px 3px;}
        .pq2906 .pq-board::before{left:16px;} .pq2906 .pq-board::after{right:16px;}
        .pq2906 .pq-dflyw{position:absolute;left:88px;top:44px;line-height:0;z-index:3;animation:pq2906Dfly 13s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.14));}
        .pq2906 .pq-dwing{animation:pq2906Flutter .22s linear infinite alternate;opacity:.5;}
        .pq2906 .pq-dwing.w2{animation-delay:-.08s;} .pq2906 .pq-dwing.w3{animation-delay:-.14s;} .pq2906 .pq-dwing.w4{animation-delay:-.05s;}
        .pq2906 .pq-ring{position:absolute;width:26px;height:9px;border:2px solid rgba(255,255,255,.75);border-radius:50%;z-index:1;opacity:0;animation:pq2906Ring 3.8s ease-out infinite;}
        .pq2906 .pq-ring.r2{animation-delay:-1.9s;}
        .pq2906 .pq-fishw{position:absolute;right:64px;bottom:40px;line-height:0;z-index:2;opacity:0;animation:pq2906Fish 9.5s ease-in-out infinite;}
        .pq2906 .pq-frog{position:absolute;line-height:0;z-index:2;animation:pq2906HopIn .8s cubic-bezier(.4,1.2,.6,1) both;animation-delay:var(--hd,0s);filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq2906 .pq-scene.still .pq-frog{animation:none;}
        .pq2906 .pq-bobf{display:block;position:relative;animation:pq2906BobF 2.6s ease-in-out infinite;animation-delay:var(--fd,0s);}
        .pq2906 .pq-bobf.win{animation:pq2906BobF 2.6s ease-in-out infinite,pq2906Cele .55s ease;}
        .pq2906 .pq-blink{opacity:0;animation:pq2906Blink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq2906 .pq-throat{transform-box:fill-box;transform-origin:50% 55%;animation:pq2906Throat 1.7s ease-in-out infinite;animation-delay:var(--bd,0s);}
        .pq2906 .pq-cnt{position:absolute;top:-8px;right:-4px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pq2906Pop .3s ease both;z-index:4;}
        .pq2906 .pq-trophy{position:absolute;top:70px;left:50%;transform:translateX(-50%);z-index:4;line-height:0;filter:drop-shadow(0 3px 6px rgba(201,138,18,.4));animation:pq2906Ans .55s cubic-bezier(.3,1.5,.5,1) both;}
        .pq2906 .pq-wstar{position:absolute;z-index:4;line-height:0;opacity:0;animation:pq2906Twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq2906 .pq-wstar.w2{animation-delay:-.5s;} .pq2906 .pq-wstar.w3{animation-delay:-1.05s;}
        .pq2906 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq2906 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq2906 .pq-rw{display:flex;flex-wrap:wrap;gap:6px;align-items:center;align-content:center;justify-content:center;padding:5px 9px;border-radius:14px;border:2.5px solid #cfe3da;background:#fff;transition:.15s;}
        .pq2906 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq2906 .pq-rw.good.win{animation:pq2906Cele .5s ease;}
        .pq2906 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pq2906Shake .35s ease;}
        .pq2906 .pq-ex{min-width:38px;height:44px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;padding:0 8px;}
        .pq2906 .pq-op{margin:0 3px;font-size:21px;font-weight:900;} .pq2906 .pq-op.plus{color:#1a7f43;} .pq2906 .pq-op.minus{color:#c0392b;}
        .pq2906 .pq-eq{font-size:22px;font-weight:900;color:#8a94a2;}
        .pq2906 .pq-slot{width:44px;height:44px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pq2906Breath 2.4s ease-in-out infinite;}
        .pq2906 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq2906 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq2906 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq2906 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq2906 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq2906 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq2906 .pq-sgs{display:flex;flex-wrap:wrap;align-content:center;flex-basis:100%;gap:4px;margin-top:3px;justify-content:center;}
        .pq2906 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:18px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq2906 .pq-sg:hover:not(:disabled){border-color:#8fc4b4;transform:translateY(-2px);}
        .pq2906 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq2906 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq2906 .pq-sg:disabled{cursor:default;}
        .pq2906 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq2906In .22s ease both;}
        .pq2906 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq2906 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq2906Sun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pq2906Cloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pq2906Wing{0%{transform:scaleX(1);}100%{transform:scaleX(.35);}}
        @keyframes pq2906Flit1{0%,100%{transform:translate(0,0);}25%{transform:translate(22px,-10px);}50%{transform:translate(42px,5px);}75%{transform:translate(18px,-5px);}}
        @keyframes pq2906Flit2{0%,100%{transform:translate(0,0);}25%{transform:translate(-20px,8px);}50%{transform:translate(-38px,-7px);}75%{transform:translate(-16px,5px);}}
        @keyframes pq2906Sway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pq2906Dfly{0%,100%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(72px,-14px) rotate(6deg);}50%{transform:translate(126px,14px) rotate(-4deg);}75%{transform:translate(52px,30px) rotate(5deg);}}
        @keyframes pq2906Flutter{from{opacity:.35;}to{opacity:.8;}}
        @keyframes pq2906Ring{0%{opacity:.85;transform:scale(.35);}60%{opacity:.3;}100%{opacity:0;transform:scale(3);}}
        @keyframes pq2906Fish{0%,74%,100%{opacity:0;transform:translate(0,16px) rotate(-30deg);}79%{opacity:1;transform:translate(10px,-14px) rotate(-16deg);}84%{opacity:1;transform:translate(24px,-22px) rotate(12deg);}90%{opacity:1;transform:translate(38px,2px) rotate(46deg);}94%{opacity:0;transform:translate(44px,18px) rotate(56deg);}}
        @keyframes pq2906HopIn{0%{opacity:0;transform:translate(-52px,-4px);}35%{opacity:1;transform:translate(-30px,-28px);}65%{transform:translate(-10px,-6px);}82%{transform:translate(-3px,-12px);}100%{transform:translate(0,0);}}
        @keyframes pq2906BobF{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pq2906Throat{0%,100%{transform:scale(1);}50%{transform:scale(1.09);}}
        @keyframes pq2906Blink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pq2906Breath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pq2906Twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq2906Shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pq2906Pop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pq2906Ans{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pq2906Cele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pq2906In{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 212 * scale }}>
        <div className={'pq-scene' + (still ? ' still' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-sun" />
          <span className="pq-cloud c1" /><span className="pq-cloud c2" /><span className="pq-cloud c3" />
          <span className="pq-bfly bf1" /><span className="pq-bfly bf2" />
          <span className="pq-water" />
          <span className="pq-lily" />
          <span className="pq-shore l" /><span className="pq-shore r" />
          <span className="pq-fl fl1" /><span className="pq-fl fl2" />
          <span className="pq-reedw" style={{ left: 5, bottom: 96 }}><Reeds /></span>
          <span className="pq-reedw" style={{ right: 5, bottom: 88 }}><Reeds flip /></span>
          <div className="pq-board">{t.board}</div>
          <span className="pq-ring" style={{ left: 66, bottom: 30 }} />
          <span className="pq-ring r2" style={{ left: 248, bottom: 48 }} />
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
              <span className="pq-wstar" style={{ left: '36%', top: '62px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '61%', top: '76px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '128px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                {r.kind === 'sub' ? (
                  <>
                    <div className="pq-ex">{r.a}<b className="pq-op minus">{'−'}</b>{r.b}</div>
                    <span className="pq-eq">=</span>
                    <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
                  </>
                ) : (
                  <>
                    <div className="pq-ex">{r.a}</div>
                    <b className="pq-op plus">{'+'}</b>
                    <div className={slotCls(i)}>{vals[i] != null ? vals[i] : '?'}</div>
                    <span className="pq-eq">=</span>
                    <div className="pq-ex">{r.sum}</div>
                  </>
                )}
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
