// Dars13 · Amaliyot 06 — P13 Zanjir «O'nlikka to'ldir» · 🔴 · tag: complete_ten_chain
// 4 qator: har qutida `have` qalam bor, o'nlikkacha (10) nechta yetmaydi? 10 birlik birlashib
// 1 dasta (o'nlik) bo'ladi. Do'kon sahnasi: taxta «O'nlikni to'ldir», javon, qalam qutisi va
// rezinka bilan bog'langan dasta (breath-bob; g'alabada 1..10 sanoq-badge + uchqunlar).
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

const TEN = 10;
const ROWS = [
  { have: 6, ans: 4, opts: [2, 3, 4, 5] },
  { have: 8, ans: 2, opts: [0, 1, 2, 3] },
  { have: 3, ans: 7, opts: [5, 6, 7, 8] },
  { have: 5, ans: 5, opts: [3, 4, 5, 6] },
];
const DATA = { ptype: 'P13', level: '🔴', tag: 'complete_ten_chain' };

// Qalam ranglari (palitradan, 2-ton): sariq / ko'k / yashil / qizil.
const PAL = [
  { main: '#f2b134', dark: '#d3941f' },
  { main: '#4f8fc4', dark: '#3a6f9e' },
  { main: '#57a84f', dark: '#43893c' },
  { main: '#d9534b', dark: '#b23e37' },
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Zanjir", title: "O'ngacha to'ldir",
    setup: "To'rtta qutini o'ngacha to'ldiramiz. Har biriga nechta qalam yetmaydi?",
    ask: "Har qatorda o'ngacha nechta yetmasligini tanlang.",
    correct: "Barakalla! To'rtala qatorda o'ngacha to'ldi!",
    hint: "Qizil qatorlarga qarang: bordan o'ngacha nechta yetmaydi? Barmoqda sanang.",
    board: "O'ngacha to'ldir",
  },
  ru: {
    eyebrow: 'Магазин карандашей · Цепочка', title: 'Дополни до десяти',
    setup: 'Дополняем четыре коробки до десяти. Сколько карандашей не хватает в каждой?',
    ask: 'Выбери, сколько не хватает до десяти в каждой строке.',
    correct: 'Молодец! Все четыре строки дополнены до десяти!',
    hint: 'Посмотри на красные строки: от того, что есть, до десяти — сколько не хватает? Посчитай на пальцах.',
    board: 'Дополни до десяти',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// QALAM KANONI (birlik): tik yog'och qalam — 2-ton tana + blik, uchida yog'och konus + qora grafit
// uchi, orqasida metall halqa + pushti o'chirg'ich. Bitta qalam = bitta birlik. Rang palitradan.
const Pencil = ({ c = PAL[0] }) => (
  <svg viewBox="0 0 16 60" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ display: 'block' }}>
    {/* grafit uchi */}
    <polygon points="8,1.5 5.7,8 10.3,8" fill="#2f2b28" />
    {/* yog'och konus (yo'nilgan) */}
    <polygon points="8,3.6 4,14 12,14" fill="#eed2a4" stroke="#c9ad7e" strokeWidth="0.7" strokeLinejoin="round" />
    {/* tana — 2-ton + blik */}
    <rect x="4" y="13.5" width="8" height="32" fill={c.main} />
    <rect x="4" y="13.5" width="2.7" height="32" fill={c.dark} />
    <rect x="9.5" y="13.5" width="1.5" height="32" fill="#ffffff" opacity="0.32" />
    <rect x="4" y="13.5" width="8" height="32" fill="none" stroke={c.dark} strokeWidth="0.6" opacity="0.5" />
    {/* metall halqa */}
    <rect x="3.6" y="45" width="8.8" height="6" fill="#cfd3d9" stroke="#a2a8b0" strokeWidth="0.6" />
    <line x1="3.6" y1="47.4" x2="12.4" y2="47.4" stroke="#a2a8b0" strokeWidth="0.6" />
    <line x1="3.6" y1="49" x2="12.4" y2="49" stroke="#a2a8b0" strokeWidth="0.6" />
    {/* pushti o'chirg'ich */}
    <rect x="4.3" y="50.2" width="7.4" height="7" rx="2.4" fill="#f2a9c0" stroke="#d97fa0" strokeWidth="0.7" />
    <rect x="5" y="51" width="2" height="4.6" rx="1" fill="#ffffff" opacity="0.4" />
  </svg>
);

const Star = ({ fill }) => (
  <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill={fill} /></svg>
);

export default function D13_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.vals) {
      setVals(initialAnswer.studentAnswer.vals);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.have} + ? = ${TEN}`), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(372);

  return (
    <div className="pq pq1306">
      <style>{`
        .pq1306{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1306 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07a1e;text-transform:uppercase;}
        .pq1306 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1306 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1306 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1306 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#fbe9cf,#f4dcb4);border:2px solid #e9d3a6;}
        .pq1306 .pq-scene{box-sizing:border-box;position:relative;width:372px;height:172px;border-radius:18px;background:linear-gradient(#fdf1d8 0%,#f7e2be 55%,#efd2a4 100%);border:2px solid #e6cfa0;overflow:hidden;}
        .pq1306 .pq-fit{position:relative;margin:0 auto;}
        .pq1306 .pq-beam{position:absolute;top:-20px;right:52px;width:70px;height:170px;background:linear-gradient(180deg,rgba(255,241,196,.7),rgba(255,241,196,0));transform:rotate(16deg);transform-origin:top center;z-index:1;animation:pqBeam 4.5s ease-in-out infinite;pointer-events:none;}
        .pq1306 .pq-window{position:absolute;top:12px;right:14px;width:56px;height:44px;border-radius:6px;background:linear-gradient(135deg,#dff0fb 0 45%,#c2ddf0 45% 55%,#dff0fb 55%);border:2.5px solid #b58a4e;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);z-index:1;}
        .pq1306 .pq-window::after{content:'';position:absolute;left:50%;top:3px;bottom:3px;width:2px;background:#b58a4e;transform:translateX(-1px);}
        .pq1306 .pq-window::before{content:'';position:absolute;top:50%;left:3px;right:3px;height:2px;background:#b58a4e;transform:translateY(-1px);}
        .pq1306 .pq-sun{position:absolute;top:20px;right:22px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:1;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1306 .pq-board{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:5;padding:6px 15px 7px;border-radius:10px;background:linear-gradient(#c98a4e,#a86c34);border:2.5px solid #7f5326;color:#fdf3e2;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);}
        .pq1306 .pq-board::before,.pq1306 .pq-board::after{content:'';position:absolute;bottom:100%;width:2.5px;height:8px;background:#7f5326;}
        .pq1306 .pq-board::before{left:18px;} .pq1306 .pq-board::after{right:18px;}
        .pq1306 .pq-tag{position:absolute;top:0;left:30px;width:30px;height:20px;background:linear-gradient(#f6c95a,#e9a92f);border:1.5px solid #c98a2c;border-radius:0 0 5px 5px;z-index:4;transform-origin:50% 0;animation:pqSway 3.2s ease-in-out infinite;display:flex;align-items:flex-end;justify-content:center;padding-bottom:2px;font-size:9px;font-weight:900;color:#7a4e12;}
        .pq1306 .pq-tag::before{content:'';position:absolute;bottom:100%;left:50%;width:2px;height:12px;background:#b58a4e;transform:translateX(-1px);}
        .pq1306 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(#c98a4e,#a86c34 60%,#8f5a2a);border-top:3px solid #d9a463;z-index:2;}
        .pq1306 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:5px;height:2px;background:rgba(255,255,255,.22);}
        /* qalam qutisi (birlik zaxira) */
        .pq1306 .pq-box{position:absolute;left:22px;bottom:24px;width:60px;height:34px;z-index:4;}
        .pq1306 .pq-boxpen{position:absolute;bottom:14px;width:12px;height:46px;transform-origin:50% 100%;animation:pqSway 3.4s ease-in-out infinite;}
        .pq1306 .pq-boxfront{position:absolute;left:0;bottom:0;width:60px;height:26px;background:linear-gradient(#b9843f,#9a6630);border:2px solid #7f5326;border-radius:3px 3px 5px 5px;z-index:3;box-shadow:inset 0 2px 0 rgba(255,255,255,.18);}
        .pq1306 .pq-boxfront::after{content:'';position:absolute;left:7px;right:7px;top:8px;height:9px;background:#eac48c;border-radius:2px;opacity:.85;}
        /* bo'sh stakan (birlik) */
        .pq1306 .pq-cup{position:absolute;right:24px;bottom:24px;width:34px;height:30px;z-index:4;}
        .pq1306 .pq-cuppen{position:absolute;bottom:12px;width:11px;height:42px;transform-origin:50% 100%;animation:pqSway 3.1s ease-in-out infinite;}
        .pq1306 .pq-cupfront{position:absolute;left:0;bottom:0;width:34px;height:22px;background:linear-gradient(#e6a8b6,#cf7f92);border:2px solid #b45f74;border-radius:4px 4px 8px 8px;z-index:3;box-shadow:inset 0 2px 0 rgba(255,255,255,.28);}
        /* dasta (o'nlik) — 10 qalam + qizil rezinka */
        .pq1306 .pq-dastaw{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:4;animation:pqBob 2.9s ease-in-out infinite;}
        .pq1306 .pq-dastaw.win{animation:pqBob 2.9s ease-in-out infinite,pqCele .6s ease;}
        .pq1306 .pq-dtag{position:absolute;top:-19px;left:50%;transform:translateX(-50%);z-index:6;padding:1px 8px;border-radius:8px;background:#2f6f3a;color:#fff;font-size:12px;font-weight:900;box-shadow:0 2px 4px rgba(0,0,0,.2);}
        .pq1306 .pq-drow{position:relative;display:flex;gap:2px;filter:drop-shadow(0 3px 3px rgba(0,0,0,.2));}
        .pq1306 .pq-dpen{position:relative;width:15px;height:54px;}
        .pq1306 .pq-band{position:absolute;left:-4px;right:-4px;top:26px;height:10px;border-radius:3px;background:linear-gradient(#e2635b,#c8443c);border:1.5px solid #a5352e;box-shadow:0 1px 2px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.35);z-index:3;}
        .pq1306 .pq-cnt{position:absolute;top:-9px;left:50%;transform:translateX(-50%);min-width:14px;height:14px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.25);animation:pqPop .3s ease both;z-index:7;}
        .pq1306 .pq-wstar{position:absolute;z-index:6;line-height:0;opacity:0;animation:pqTwinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(242,177,52,.6));}
        .pq1306 .pq-wstar.w2{animation-delay:-.5s;} .pq1306 .pq-wstar.w3{animation-delay:-1.05s;}
        /* qatorlar */
        .pq1306 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq1306 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq1306 .pq-rw{display:flex;gap:7px;align-items:center;justify-content:center;align-content:center;flex-wrap:wrap;padding:5px 8px;border-radius:14px;border:2.5px solid #ecdcbf;background:#fffaf0;transition:.15s;}
        .pq1306 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1306 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1306 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}
        .pq1306 .pq-n{width:42px;height:44px;border-radius:10px;background:#fbf3e2;border:2px solid #e6c98f;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#8a5a1e;font-variant-numeric:tabular-nums;flex-shrink:0;}
        .pq1306 .pq-frame{display:flex;gap:2px;padding:4px 5px;border-radius:9px;background:#fbf3e2;border:2px solid #ecdcbf;}
        .pq1306 .pq-cell{width:9px;height:32px;border-radius:3px;border:1.5px dashed #d8c59c;box-sizing:border-box;padding:1px;background:#fdf8ec;}
        .pq1306 .pq-cell.on{border:1.5px solid transparent;background:transparent;padding:1px;}
        .pq1306 .pq-cell.fill{animation:pqFill .42s cubic-bezier(.3,1.4,.5,1) both;}
        .pq1306 .pq-op{font-size:20px;font-weight:900;color:#c07a1e;}
        .pq1306 .pq-slot{width:38px;height:40px;border-radius:10px;border:2.5px dashed #d8c59c;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#c2a25e;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1306 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq1306 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1306 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1306 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1306 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1306 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq1306 .pq-eq{font-size:19px;font-weight:900;color:#8a7a55;font-variant-numeric:tabular-nums;}
        .pq1306 .pq-sgs{display:flex;flex-wrap:wrap;align-content:center;gap:5px;margin-left:2px;flex-basis:100%;justify-content:center;}
        .pq1306 .pq-sg{width:36px;height:40px;border-radius:10px;border:2.5px solid #e0d3b6;background:#fff;font-size:18px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1306 .pq-sg:hover:not(:disabled){border-color:#e0a94e;transform:translateY(-2px);}
        .pq1306 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1306 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1306 .pq-sg:disabled{cursor:default;}
        .pq1306 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1306 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1306 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBeam{0%,100%{opacity:.55;}50%{opacity:.85;}}
        @keyframes pqSway{0%,100%{transform:rotate(-2.5deg);}50%{transform:rotate(2.5deg);}}
        @keyframes pqBob{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#d8c59c;}50%{transform:scale(1.06);border-color:#c9ad7e;}}
        @keyframes pqFill{0%{opacity:0;transform:translateY(-12px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:translateX(-50%) scale(.4);}to{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0deg);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 372 * scale, height: 172 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-beam" />
          <span className="pq-window" />
          <span className="pq-sun" />
          <div className="pq-board">{t.board}</div>
          <span className="pq-tag">10</span>
          <span className="pq-shelf" />

          {/* qalam qutisi — birlik zaxira (yon qalamlar tebranadi) */}
          <div className="pq-box">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="pq-boxpen" style={{ left: 6 + i * 12, animationDelay: `${-i * 0.5}s` }}><Pencil c={PAL[i % PAL.length]} /></span>
            ))}
            <span className="pq-boxfront" />
          </div>

          {/* dasta (o'nlik) — 10 qalam qizil rezinka bilan; g'alabada 1..10 sanoq-badge */}
          <div className={'pq-dastaw' + (ok ? ' win' : '')}>
            <span className="pq-dtag">10</span>
            <div className="pq-drow">
              {Array.from({ length: TEN }).map((_, i) => (
                <span key={i} className="pq-dpen"><Pencil c={PAL[i % PAL.length]} />{ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.06}s` }}>{i + 1}</b>}</span>
              ))}
              <span className="pq-band" />
            </div>
          </div>

          {/* bo'sh stakan — birlik qalamlar */}
          <div className="pq-cup">
            {[0, 1, 2].map((i) => (
              <span key={i} className="pq-cuppen" style={{ left: 4 + i * 9, animationDelay: `${-i * 0.6}s` }}><Pencil c={PAL[(i + 1) % PAL.length]} /></span>
            ))}
            <span className="pq-cupfront" />
          </div>

          {ok && (
            <>
              <span className="pq-wstar" style={{ left: '34%', top: '44px' }}><Star fill="#f2b134" /></span>
              <span className="pq-wstar w2" style={{ left: '60%', top: '52px' }}><Star fill="#e59a2f" /></span>
              <span className="pq-wstar w3" style={{ left: '48%', top: '30px' }}><Star fill="#f2b134" /></span>
            </>
          )}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-n">{r.have}</div>
                <b className="pq-op">+</b>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <span className="pq-eq">= {TEN}</span>
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
