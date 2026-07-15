// Dars18 · Amaliyot 06 — Zanjir «Olma bozori» · 🔴 · tag: make_ten_chain
// 4 qator: har birida A-yashik (ten-frame) da A ta olma + yashikning O'NG tomonida B ta
// yakka olma TOZA USTUN bo'lib turadi (5+ bo'lsa 2 ustun), ostida son-yorliq; yashik bilan
// hech qachon ustma-ust tushmaydi (frame+ustun bitta nowrap-guruhda).
// "A + B = ?" — o'nlikdan o'tib qo'shishni tanlang. Ayirish yo'q, hammasi 0-20.
// Bozor sahnasi: yog'och rasta, qizil-oq chodir-soyabon, quyosh, uzluksiz ambient.
// G'alaba: yakka olmalar yashikka tushib o'nlik to'ladi, ortig'i chetda + "A + B = N" chip + uchqun.
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
const RAW = [
  { a: 9, b: 5, ans: 14, opts: [12, 13, 14, 15] },
  { a: 7, b: 6, ans: 13, opts: [11, 12, 13, 14] },
  { a: 8, b: 4, ans: 12, opts: [10, 11, 12, 13] },
  { a: 9, b: 7, ans: 16, opts: [14, 15, 16, 17] },
];
// gap = o'nlikni to'ldirish uchun kerak; over = ortiqcha (2-yashikka o'tadi).
const ROWS = RAW.map((r) => ({ ...r, gap: TEN - r.a, over: r.b - (TEN - r.a) }));
const DATA = { ptype: 'P13', level: '🔴', tag: 'make_ten_chain' };

// OLMA palitrasi (aylanma, 2-ton): qizil / yashil.
const PAL = [
  { main: '#d9534b', dark: '#b23c34', light: '#ec8f89' }, // qizil
  { main: '#57a84f', dark: '#3f8038', light: '#8fca88' }, // yashil
];

const T = {
  uz: {
    eyebrow: "Olma bozori · Zanjir", title: "O'nlikdan o'tib qo'shing",
    setup: "Har qatorda o'nta joyli yashikda bir nechta olma bor, yonida yana bir nechta yakka olma turibdi.",
    ask: "Har qatorda hammasi bo'lib nechta olma bo'lishini tanlang.",
    correct: "Barakalla! Har qatorda yashik o'ntaga to'ldi, ortig'i esa yoniga o'tdi — javob to'g'ri!",
    hint: "Avval yashikni o'ngacha to'ldiring: yakka olmalardan bo'sh uyalarga qancha kerak? Qolganini o'nga qo'shing.",
    board: "Olma bozori",
  },
  ru: {
    eyebrow: 'Яблочный рынок · Цепочка', title: 'Сложи с переходом через десяток',
    setup: 'В каждой строке в ящике на десять мест лежит несколько яблок, а рядом стоит ещё несколько отдельных яблок.',
    ask: 'Выбери, сколько всего яблок будет в каждой строке.',
    correct: 'Молодец! В каждой строке ящик заполнился до десяти, а остаток перешёл рядом — ответ верный!',
    hint: 'Сначала дополни ящик до десяти: сколько отдельных яблок нужно в пустые ячейки? Остаток прибавь к десяти.',
    board: 'Яблочный рынок',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// OLMA KANONI (yakka birlik): yumaloq olma — 2-ton radial doira + oq blik, tepada jigarrang
// bandcha + yashil barg. Bitta olma = bitta birlik. Rang palitradan (qizil/yashil aylanma).
let __gid = 0;
const Apple = ({ c = PAL[0], size = 18 }) => {
  const id = 'd1806a' + (__gid++);
  return (
    <svg viewBox="0 0 32 34" width={size} height={size * 34 / 32} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="36%" r="72%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="58%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path d="M16 11 L16 4" fill="none" stroke="#7a4a24" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 8 Q21 3 24 7 Q20 10 16 8 Z" fill="#5aa84f" />
      <path d="M18 8 Q21 6 23 7" fill="none" stroke="#3f8038" strokeWidth=".7" opacity=".7" />
      <path d="M16 11 C10 11 6 15 6 21 C6 27 11 31 16 31 C21 31 26 27 26 21 C26 15 22 11 16 11 Z" fill={`url(#${id})`} stroke={c.dark} strokeWidth=".7" />
      <path d="M16 11 C15 14 15 15 16 16 C17 15 17 14 16 11 Z" fill={c.dark} opacity=".5" />
      <ellipse cx="12" cy="17" rx="3.2" ry="2.1" fill="#ffffff" opacity=".7" transform="rotate(-26 12 17)" />
    </svg>
  );
};

export default function D18_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({}); // {rowIdx: son}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const N = ROWS.length;
  // Review yoki qayta ochilishda to'ldirish-animatsiyasi qayta ijro etilmaydi — statik yakun.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.vals)) {
      const obj = {};
      initialAnswer.studentAnswer.vals.forEach((v, i) => { if (v != null) obj[i] = v; });
      setVals(obj);
      if (typeof initialAnswer.correct === 'boolean') {
        setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
        if (initialAnswer.correct) setChecked(true);
      }
    }
  }, [initialAnswer]); // eslint-disable-line

  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((r, i) => vals[i] === r.ans);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.a} + ${r.b} = ?`), studentAnswer: { vals: ROWS.map((_, i) => (vals[i] != null ? vals[i] : null)) }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const [fitRef, scale] = useFitScale(380);

  return (
    <div className="pq pq1806">
      <style>{`
        .pq1806{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1806 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b23c34;text-transform:uppercase;}
        .pq1806 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 10px;}
        .pq1806 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1806 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq1806 .pq-stage{display:flex;flex-direction:column;align-items:center;gap:12px;padding:10px 10px 13px;border-radius:22px;background:linear-gradient(#eaf5e5,#e0efd8);border:2px solid #cbe3bc;}

        /* bozor sahnasi */
        .pq1806 .pq-scene{box-sizing:border-box;position:relative;width:380px;height:96px;border-radius:18px;background:linear-gradient(#eaf6ff 0%,#dcefff 52%,#cfe6f7 100%);border:2px solid #bcdcee;overflow:hidden;}
        .pq1806 .pq-fit{position:relative;margin:0 auto;}
        .pq1806 .pq-canopy{position:absolute;top:0;left:0;right:0;height:20px;background:repeating-linear-gradient(90deg,#d9534b 0 20px,#fdf1ef 20px 40px);border-bottom:2px solid #b23c34;z-index:3;}
        .pq1806 .pq-canopy::after{content:'';position:absolute;left:0;right:0;top:100%;height:9px;background:repeating-linear-gradient(90deg,#d9534b 0 20px,#fdf1ef 20px 40px);-webkit-mask:radial-gradient(9px at 10px 0,transparent 98%,#000) repeat-x;mask:radial-gradient(9px at 10px 0,transparent 98%,#000) repeat-x;-webkit-mask-size:20px 9px;mask-size:20px 9px;}
        .pq1806 .pq-beam{position:absolute;top:6px;right:56px;width:64px;height:150px;background:linear-gradient(180deg,rgba(255,244,196,.7),rgba(255,244,196,0));transform:rotate(15deg);transform-origin:top center;z-index:1;animation:pqBeam 4.5s ease-in-out infinite;pointer-events:none;}
        .pq1806 .pq-sun{position:absolute;top:26px;right:22px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff6ce,#f9c62f 72%,#f0ab18);box-shadow:0 0 14px 4px rgba(249,198,47,.5);z-index:2;animation:pqSun 3.6s ease-in-out infinite;}
        .pq1806 .pq-board{position:absolute;top:26px;left:50%;transform:translateX(-50%);z-index:5;padding:5px 15px 6px;border-radius:10px;background:linear-gradient(#5a9e4f,#43863b);border:2.5px solid #316a2c;color:#f2fbef;font-size:12.5px;font-weight:800;letter-spacing:.03em;white-space:nowrap;box-shadow:0 3px 6px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.3);}
        .pq1806 .pq-shelf{position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(#c98a4e,#a86c34 60%,#8f5a2a);border-top:3px solid #d9a463;z-index:2;}
        .pq1806 .pq-shelf::after{content:'';position:absolute;left:0;right:0;top:6px;height:2px;background:rgba(255,255,255,.2);}
        .pq1806 .pq-crate{position:absolute;bottom:28px;width:34px;height:24px;z-index:3;border-radius:4px;background:linear-gradient(#cf9457,#ac7238);border:1.6px solid #8a5628;box-shadow:inset 0 2px 0 rgba(255,255,255,.22);animation:pqSway 3.6s ease-in-out infinite;transform-origin:bottom center;}
        .pq1806 .pq-crate.l{left:24px;} .pq1806 .pq-crate.r{right:24px;animation-delay:-1.4s;}
        .pq1806 .pq-crate .ap{position:absolute;top:-6px;width:10px;height:10px;border-radius:50%;}
        .pq1806 .pq-crate .ap.a{left:3px;background:radial-gradient(circle at 38% 34%,#ec8f89,#d9534b);}
        .pq1806 .pq-crate .ap.b{left:12px;background:radial-gradient(circle at 38% 34%,#8fca88,#57a84f);}
        .pq1806 .pq-crate .ap.c{left:21px;background:radial-gradient(circle at 38% 34%,#ec8f89,#d9534b);}

        /* qatorlar */
        .pq1806 .pq-rows{display:grid;grid-template-columns:1fr;align-items:start;gap:8px;width:100%;max-width:360px;}
        @media (min-width:480px){.pq1806 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq1806 .pq-rw{display:flex;gap:10px;align-items:center;align-content:center;justify-content:center;flex-wrap:wrap;padding:8px 10px;border-radius:14px;border:2.5px solid #d3e6c6;background:#fbfef8;transition:.15s;}
        .pq1806 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq1806 .pq-rw.good.win{animation:pqCele .5s ease;}
        .pq1806 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqShake .35s ease;}

        /* ten-frame yashik (2×5) */
        .pq1806 .pq-frame{display:grid;grid-template-columns:repeat(5,20px);grid-auto-rows:20px;gap:3px;padding:5px;border-radius:11px;background:linear-gradient(#f0dcbd,#e6cca2);border:2px solid #d0b283;box-shadow:inset 0 1px 0 rgba(255,255,255,.4);flex:0 0 auto;}
        .pq1806 .pq-cell{position:relative;border-radius:6px;background:rgba(255,252,246,.5);border:1.4px solid rgba(150,110,70,.3);display:flex;align-items:center;justify-content:center;}
        .pq1806 .pq-cell.empty{background:rgba(255,255,255,.26);border-style:dashed;border-color:rgba(150,110,70,.52);animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1806 .pq-rw:nth-child(2) .pq-cell.empty{animation-delay:-.7s;}
        .pq1806 .pq-rw:nth-child(3) .pq-cell.empty{animation-delay:-1.4s;}
        .pq1806 .pq-rw:nth-child(4) .pq-cell.empty{animation-delay:-2.1s;}
        .pq1806 .pq-ap{width:17px;height:18px;line-height:0;}
        .pq1806 .pq-ap svg{width:100%;height:100%;}
        .pq1806 .pq-ap.drop{animation:pqDrop .5s cubic-bezier(.3,1.2,.5,1) both;animation-delay:var(--dd,0s);}
        /* 390px etalon-layout: hamma narsa karta ichiga sig'sin (yashik ustiga chiqib ketmasin) */
        @media (max-width:639.98px){
          .pq1806 .pq-frame{grid-template-columns:repeat(5,17px);grid-auto-rows:17px;gap:2px;padding:4px;}
          .pq1806 .pq-ap{width:15px;height:16px;}
          .pq1806 .pq-fl{gap:6px;}
        }

        /* frame + yakka olmalar — bitta ajralmas guruh (ustma-ust tushmasin) */
        .pq1806 .pq-fl{display:flex;gap:9px;align-items:center;flex:0 0 auto;flex-wrap:nowrap;}
        /* yakka olmalar (yig'indi B) va ortiqcha (over): yashik O'NGida toza ustun(lar) */
        .pq1806 .pq-loose{display:flex;flex-direction:column;align-items:center;gap:3px;flex:0 0 auto;}
        .pq1806 .pq-loose .grp{display:grid;grid-auto-flow:column;gap:3px;justify-items:center;align-items:center;}
        .pq1806 .pq-loose .grp .pq-ap{animation:pqFloat 2.6s ease-in-out infinite;}
        .pq1806 .pq-loose .grp .pq-ap:nth-child(2n){animation-delay:-.7s;}
        .pq1806 .pq-loose .grp .pq-ap:nth-child(3n){animation-delay:-1.3s;}
        .pq1806 .pq-tag{font-size:11px;font-weight:900;color:#7a5a2e;background:rgba(255,255,255,.72);padding:0 8px;border-radius:999px;}
        .pq1806 .pq-over{display:flex;flex-direction:column;align-items:center;gap:3px;flex:0 0 auto;}
        .pq1806 .pq-over .grp{display:grid;grid-auto-flow:column;gap:3px;justify-items:center;align-items:center;}
        .pq1806 .pq-over .grp .pq-ap{animation:pqDrop .5s cubic-bezier(.3,1.2,.5,1) both;}
        .pq1806 .pq-over .tag{font-size:11px;font-weight:900;color:#1a7f43;background:#e8f7ee;padding:0 8px;border-radius:999px;}

        /* tenglama */
        .pq1806 .pq-eq{display:flex;align-items:center;gap:5px;font-size:19px;font-weight:900;color:#6b7a58;font-variant-numeric:tabular-nums;}
        .pq1806 .pq-eq .a{color:#b23c34;} .pq1806 .pq-eq .b{color:#3f8038;}
        .pq1806 .pq-slot{width:38px;height:40px;border-radius:10px;border:2.5px dashed #cbe0ba;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#9bb884;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq1806 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq1806 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq1806 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.7s;}
        .pq1806 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq1806 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}

        .pq1806 .pq-chip{flex-basis:100%;text-align:center;margin-left:2px;padding:5px 11px;border-radius:11px;background:#e8f7ee;border:2px solid #1a7f43;color:#1a7f43;font-size:15px;font-weight:900;font-variant-numeric:tabular-nums;white-space:nowrap;animation:pqPop .35s ease both;}
        .pq1806 .pq-sgs{display:flex;flex-wrap:wrap;flex-basis:100%;justify-content:center;align-content:center;gap:6px;margin-left:2px;}
        .pq1806 .pq-sg{width:40px;height:42px;border-radius:11px;border:2.5px solid #d6e6c8;background:#fff;font-size:20px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1806 .pq-sg:hover:not(:disabled){border-color:#8cc47f;transform:translateY(-2px);}
        .pq1806 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq1806 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq1806 .pq-sg:disabled{cursor:default;}

        .pq1806 .pq-spark{position:absolute;z-index:6;color:#ffd13f;opacity:0;line-height:0;font-size:14px;animation:pqTwinkle 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq1806 .pq-spark.s2{animation-delay:-.6s;} .pq1806 .pq-spark.s3{animation-delay:-1.15s;}

        .pq1806 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1806 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1806 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqBeam{0%,100%{opacity:.5;}50%{opacity:.85;}}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-3px) rotate(-1.4deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-30px) scale(.8);}70%{opacity:1;transform:translateY(2px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqTwinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage" ref={fitRef}>
        <div className="pq-fit" style={{ width: 380 * scale, height: 96 * scale }}>
        <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <span className="pq-beam" />
          <span className="pq-canopy" />
          <span className="pq-sun" />
          <div className="pq-board">{t.board}</div>
          <span className="pq-crate l"><span className="ap a" /><span className="ap b" /><span className="ap c" /></span>
          <span className="pq-crate r"><span className="ap a" /><span className="ap b" /><span className="ap c" /></span>
          <span className="pq-shelf" />
          {ok && (<>
            <span className="pq-spark" style={{ left: '12%', top: '30px' }}>✦</span>
            <span className="pq-spark s2" style={{ left: '48%', bottom: '10px' }}>✦</span>
            <span className="pq-spark s3" style={{ left: '30%', top: '24px' }}>✦</span>
          </>)}
        </div>
        </div>

        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            // Yakka olmalar ustuni: 4 tagacha — 1 ustun, 5+ — 2 ustun (toza panjara, yashikka tegmaydi).
            const colRows = (n) => (n >= 5 ? Math.ceil(n / 2) : Math.max(n, 1));
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-fl">
                  {/* ten-frame: A to'la; g'alabada bo'sh uyalar yakka olmalardan to'ladi */}
                  <div className="pq-frame">
                    {Array.from({ length: TEN }).map((_, k) => {
                      const preset = k < r.a;
                      const show = preset || ok;
                      const isAdd = !preset && ok;
                      return (
                        <div key={k} className={'pq-cell' + (show ? ' full' : ' empty')}>
                          {show && (
                            <span className={'pq-ap' + (isAdd && !still ? ' drop' : '')} style={{ '--dd': `${(k - r.a) * 0.12}s` }}>
                              <Apple c={PAL[(i + k) % PAL.length]} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* yakka olmalar (yig'indi B) yoki g'alabada ortiqcha (over) — yashik O'NGida */}
                  {ok ? (
                    <div className="pq-over">
                      <div className="grp" style={{ gridTemplateRows: `repeat(${colRows(r.over)}, auto)` }}>
                        {Array.from({ length: r.over }).map((_, k) => (
                          <span key={k} className="pq-ap" style={{ animationDelay: `${(r.gap + k) * 0.12}s` }}>
                            <Apple c={PAL[(i + 1 + k) % PAL.length]} />
                          </span>
                        ))}
                      </div>
                      <span className="tag">{TEN} + {r.over}</span>
                    </div>
                  ) : (
                    <div className="pq-loose">
                      <div className="grp" style={{ gridTemplateRows: `repeat(${colRows(r.b)}, auto)` }}>
                        {Array.from({ length: r.b }).map((_, k) => (
                          <span key={k} className="pq-ap"><Apple c={PAL[(i + 1 + k) % PAL.length]} /></span>
                        ))}
                      </div>
                      <span className="pq-tag">{r.b}</span>
                    </div>
                  )}
                </div>

                <div className="pq-eq">
                  <span className="a">{r.a}</span>
                  <span>+</span>
                  <span className="b">{r.b}</span>
                  <span>=</span>
                  <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                </div>

                {ok ? (
                  <span className="pq-chip">{r.a} + {r.b} = {r.ans}</span>
                ) : (
                  <div className="pq-sgs">
                    {r.opts.map((n) => (
                      <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                        onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
