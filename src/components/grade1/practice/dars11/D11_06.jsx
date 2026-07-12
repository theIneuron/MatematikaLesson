// Dars11 · Amaliyot 06 — P8 Juftlarni ulash (DRAG, elastik) · 🔴 · o'rin almashgan qo'shiluvchilar · tag: match_swapped
// Poyezd bekati: chap ustundagi har yozuvni o'ng ustundagi o'rin almashgan jufti bilan chiziq (сцепка) orqali ula. 3+4 ↔ 4+3.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chap ustun (aslidagi tartib) va o'ng ustun (o'rin almashgan, ARALASH tartib).
const LEFT = [{ a: 3, b: 4 }, { a: 2, b: 5 }, { a: 6, b: 1 }];
const RIGHT = [{ a: 1, b: 6 }, { a: 4, b: 3 }, { a: 5, b: 2 }];
const WAGON = ['#d9534b', '#4f8fc4', '#f2b134']; // chap kartochka bezagi — mos EMAS, javobni oshkor qilmaydi
const DATA = { ptype: 'P8', level: '🔴', tag: 'match_swapped' };
const CW = 360, ROW = 76;
const T = {
  uz: {
    eyebrow: "Poyezd bekati · Juftlash", title: "Almashgan juftni ula",
    setup: "Har yozuvning o'rin almashgan jufti bor. Masalan: uch qo'shuv to'rt — to'rt qo'shuv uch.",
    ask: "Har yozuvni o'rin almashgan jufti bilan chiziq orqali ulang.",
    correct: "Barakalla! Barcha juftlar to'g'ri — o'rin almashsa, yig'indi bir xil!",
    hint: "Har yozuvdagi sonlarni o'ng tomonda teskari tartibda qidiring.",
  },
  ru: {
    eyebrow: "Станция · Пары", title: "Соедини переставленную пару",
    setup: "У каждой записи есть пара с переставленными местами. Например: три плюс четыре — четыре плюс три.",
    ask: "Соедини каждую запись с её переставленной парой линией.",
    correct: "Молодец! Все пары верны — от перестановки мест сумма не меняется!",
    hint: "Ищи числа каждой записи справа в обратном порядке.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Spitsali g'ildirak — o'z markazi atrofida sekin aylanadi (pq-wheel klassi CSS'da).
const Wheel = ({ cx, cy, r = 8 }) => (
  <g className="pq-wheel">
    <circle cx={cx} cy={cy} r={r} fill="#3a4150" stroke="#242a35" strokeWidth="2" />
    <circle cx={cx} cy={cy} r={r * 0.44} fill="#aab3c2" stroke="#6b7484" strokeWidth="1" />
    <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#6b7484" strokeWidth="1.5" />
    <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#6b7484" strokeWidth="1.5" />
    <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke="#6b7484" strokeWidth="1.2" />
    <line x1={cx - r * 0.7} y1={cy + r * 0.7} x2={cx + r * 0.7} y2={cy - r * 0.7} stroke="#6b7484" strokeWidth="1.2" />
    <circle cx={cx} cy={cy} r="1.9" fill="#242a35" />
  </g>
);

// VAGON KANONI: to'rtburchak-yumaloq rangli tana, tepa yorug' chiziq, 2 deraza, 2 g'ildirak, qo'shqich (сцепка).
const Wagon = ({ x, c }) => {
  const cd = { '#d9534b': '#a83c34', '#4f8fc4': '#3a6f9c', '#f2b134': '#c98b16' }[c];
  return (
    <g>
      <rect x={x + 54} y={92} width={8} height={5} rx={2} fill="#6b7484" /> {/* qo'shqich */}
      <rect x={x} y={60} width={56} height={40} rx={9} fill={c} stroke={cd} strokeWidth="2" />
      <rect x={x + 3} y={63} width={50} height={9} rx={4} fill="#fff" opacity=".28" />
      <rect x={x + 9} y={74} width={16} height={14} rx={3} fill="#eaf4fb" stroke={cd} strokeWidth="1.4" />
      <rect x={x + 31} y={74} width={16} height={14} rx={3} fill="#eaf4fb" stroke={cd} strokeWidth="1.4" />
      <Wheel cx={x + 15} cy={104} r={8} />
      <Wheel cx={x + 41} cy={104} r={8} />
    </g>
  );
};

// LOKOMOTIV KANONI: old chiroq (o'ngda), mo'ri (bug'), kabina (deraza + mashinist), 3 g'ildirak.
const Loco = ({ x }) => (
  <g>
    <rect x={x - 6} y={92} width={8} height={5} rx={2} fill="#6b7484" /> {/* orqa qo'shqich */}
    {/* kabina */}
    <rect x={x} y={52} width={36} height={48} rx={7} fill="#5a7d54" stroke="#3f5c3b" strokeWidth="2" />
    <rect x={x + 6} y={58} width={23} height={18} rx={3} fill="#dff0fb" stroke="#3f5c3b" strokeWidth="1.6" />
    {/* mashinist */}
    <g>
      <circle cx={x + 17} cy={69} r={6.5} fill="#f3c9a2" />
      <path d={`M${x + 10} 66 Q${x + 17} 58 ${x + 24} 66 Z`} fill="#c94f43" />
      <rect x={x + 8} y={65} width={18} height={3} rx={1.5} fill="#a83c34" />
      <circle className="pq-deye" cx={x + 15} cy={70} r={1.3} fill="#2a2320" />
    </g>
    {/* qozon */}
    <rect x={x + 34} y={68} width={70} height={32} rx={14} fill="#6d8f66" stroke="#3f5c3b" strokeWidth="2" />
    <rect x={x + 40} y={72} width={60} height={6} rx={3} fill="#fff" opacity=".22" />
    {/* old chiroq */}
    <circle cx={x + 101} cy={86} r={6.5} fill="#ffe08a" stroke="#d9a52a" strokeWidth="1.6" />
    <circle cx={x + 101} cy={86} r={2.4} fill="#fff8dc" />
    {/* to'siq (cowcatcher) */}
    <path d={`M${x + 104} 92 L${x + 112} 100 L${x + 104} 100 Z`} fill="#4a5568" />
    {/* mo'ri */}
    <rect x={x + 46} y={48} width={13} height={22} rx={3} fill="#4a5568" stroke="#2f3947" strokeWidth="1.5" />
    <rect x={x + 44} y={46} width={17} height={6} rx={3} fill="#5f6b80" stroke="#2f3947" strokeWidth="1.4" />
    {/* gumbaz */}
    <rect x={x + 68} y={58} width={12} height={12} rx={3} fill="#5f6b80" stroke="#3f5c3b" strokeWidth="1.4" />
    {/* bug' */}
    <circle className="pq-steam s1" cx={x + 52} cy={42} r={5} fill="#fff" />
    <circle className="pq-steam s2" cx={x + 55} cy={36} r={6} fill="#fff" />
    <circle className="pq-steam s3" cx={x + 50} cy={30} r={7} fill="#fff" />
    {/* g'ildiraklar */}
    <Wheel cx={x + 12} cy={104} r={8} />
    <Wheel cx={x + 55} cy={104} r={12} />
    <Wheel cx={x + 88} cy={104} r={12} />
  </g>
);

const TrainScene = () => (
  <svg className="pq-tsvg" viewBox="0 0 360 128" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    {/* tepaliklar */}
    <ellipse cx="80" cy="118" rx="130" ry="26" fill="#c1e2ac" />
    <ellipse cx="300" cy="122" rx="150" ry="24" fill="#d0ebbc" />
    {/* semafor */}
    <rect x="7" y="72" width="4" height="44" fill="#5a6270" />
    <rect x="1" y="56" width="16" height="22" rx="4" fill="#33383f" />
    <circle className="pq-sem sr" cx="9" cy="62" r="4" fill="#e5463c" />
    <circle className="pq-sem sg" cx="9" cy="72" r="4" fill="#57c46a" />
    {/* peron + rels */}
    <rect x="0" y="112" width="360" height="16" fill="#cbb89b" />
    <rect x="0" y="109" width="360" height="4" fill="#8a8f98" />
    {Array.from({ length: 20 }).map((_, i) => (<rect key={i} x={i * 18} y="112" width="6" height="6" fill="#7a6f5c" opacity=".6" />))}
    {/* poyezd (yengil ambient tebranish) */}
    <g className="pq-consist">
      <Wagon x={18} c={WAGON[0]} />
      <Wagon x={80} c={WAGON[1]} />
      <Wagon x={142} c={WAGON[2]} />
      <Loco x={210} />
    </g>
  </svg>
);

export default function D11_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [links, setLinks] = useState({}); // {leftIdx: rightIdx}
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  const [dragLine, setDragLine] = useState(null);
  const boxRef = useRef(null);
  const dragRef = useRef(null);
  const N = LEFT.length;
  const H = N * ROW;
  const leftY = (i) => i * ROW + ROW / 2;
  const rightY = (j) => j * ROW + ROW / 2;
  // Review/qayta ochilishda kartochka-tushish animatsiyasi qayta ijro etilmaydi.
  const stillRef = useRef(isReview || !!(initialAnswer && initialAnswer.studentAnswer));
  const still = stillRef.current;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.links) {
      setLinks(initialAnswer.studentAnswer.links);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(links).length === N && !checked); }, [links, checked, onReady, N]);

  const lock = isReview || checked;
  const LX = 3 + 120, RX = CW - 3 - 120; // chiziq boshi/oxiri (kartochka ichki qirralari)

  const startDrag = (li, e) => {
    if (lock) return; e.preventDefault();
    dragRef.current = { li };
    setDragLine({ x1: LX, y1: leftY(li), x2: LX, y2: leftY(li) });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  };
  const moveDrag = (e) => {
    if (!dragRef.current || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const s = r.width / (boxRef.current.offsetWidth || 1); // zoom kompensatsiyasi
    setDragLine({ x1: LX, y1: leftY(dragRef.current.li), x2: (e.clientX - r.left) / s, y2: (e.clientY - r.top) / s });
  };
  const endDrag = (e) => {
    const dr = dragRef.current; dragRef.current = null; setDragLine(null);
    if (!dr || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const s = r.width / (boxRef.current.offsetWidth || 1); // zoom kompensatsiyasi
    const mx = (e.clientX - r.left) / s, my = (e.clientY - r.top) / s;
    const row = Math.floor(my / ROW);
    if (mx > CW / 2 && row >= 0 && row < N) {
      setLinks((prev) => { const nl = {}; for (const k of Object.keys(prev)) if (Number(k) !== dr.li && prev[k] !== row) nl[k] = prev[k]; nl[dr.li] = row; return nl; });
      setFeedback(null);
    }
  };

  const isPairRight = (li) => { const ri = links[li]; if (ri == null) return false; const L = LEFT[li], R = RIGHT[ri]; return R.a === L.b && R.b === L.a; };
  const check = useCallback(() => {
    if (Object.keys(links).length !== N) return;
    const correct = LEFT.every((_, li) => isPairRight(li));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`,
      options: RIGHT.map((r) => `${r.a} + ${r.b}`),
      studentAnswer: { links },
      correctAnswer: { pairs: LEFT.map((l) => ({ left: `${l.a} + ${l.b}`, right: `${l.b} + ${l.a}` })) },
      correct, meta: { ...DATA },
    });
  }, [links, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;
  const lineColor = (li) => (feedback ? (isPairRight(li) ? '#1a7f43' : '#c0392b') : '#2563eb');
  const curve = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; const sag = Math.min(30, Math.max(8, Math.hypot(x2 - x1, y2 - y1) * 0.14)); return `M ${x1} ${y1} Q ${mx} ${my + sag} ${x2} ${y2}`; };

  return (
    <div className="pq pq1106">
      <style>{`
        .pq1106{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1106 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq1106 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1106 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1106 .pq-ask{display:block;margin-top:4px;font-size:18px;font-weight:800;}
        .pq1106 .pq-train{position:relative;width:${CW}px;max-width:100%;height:128px;margin:0 auto 10px;border-radius:18px;overflow:hidden;background:linear-gradient(#bfe3f6 0%,#d9f0fb 52%,#eaf7ea 100%);border:2px solid #bcdcef;}
        .pq1106 .pq-tsvg{position:absolute;inset:0;width:100%;height:100%;display:block;}
        .pq1106 .pq-sun{position:absolute;top:12px;right:20px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq1106 .pq-cloud{position:absolute;width:46px;height:15px;background:#fff;border-radius:999px;opacity:.9;box-shadow:14px 5px 0 -4px #fff,-13px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq1106 .pq-cloud.c1{top:16px;left:-70px;animation-duration:34s;}
        .pq1106 .pq-cloud.c2{top:40px;left:-70px;width:34px;height:11px;opacity:.7;animation-duration:46s;animation-delay:-20s;}
        .pq1106 .pq-bird{position:absolute;z-index:0;color:#7c869a;opacity:.68;line-height:0;animation:pq1106Bird linear infinite;}
        .pq1106 .pq-bird svg{display:block;}
        .pq1106 .pq-bird.bd1{top:28px;left:-24px;animation-duration:26s;}
        .pq1106 .pq-bird.bd2{top:50px;left:-24px;animation-duration:35s;animation-delay:-14s;}
        .pq1106 .pq-bird.bd2 svg{width:12px;height:6px;}
        @keyframes pq1106Bird{from{transform:translateX(0);}to{transform:translateX(420px);}}
        .pq1106 .pq-wheel{transform-box:fill-box;transform-origin:center;animation:pqSpin 2.4s linear infinite;}
        .pq1106 .pq-consist{transform-box:fill-box;transform-origin:center;animation:pqTrainBob 3.4s ease-in-out infinite;}
        .pq1106 .pq-steam{opacity:0;animation:pqSteam 3.6s ease-in-out infinite;}
        .pq1106 .pq-steam.s2{animation-delay:-1.2s;} .pq1106 .pq-steam.s3{animation-delay:-2.4s;}
        .pq1106 .pq-deye{animation:pqBlink 3.8s linear infinite;transform-box:fill-box;transform-origin:center;}
        .pq1106 .pq-sem{animation:pqSem 2.4s steps(1,end) infinite;}
        .pq1106 .pq-sem.sg{animation-delay:1.2s;}
        .pq1106 .pq-connect{position:relative;width:${CW}px;max-width:100%;margin:2px auto 0;touch-action:none;}
        .pq1106 .pq-svg{position:absolute;inset:0;pointer-events:none;z-index:1;}
        .pq1106 .pq-lc,.pq1106 .pq-rc{position:absolute;height:56px;transform:translateY(-50%);border-radius:14px;border:2.5px solid #d6dae3;background:#fff;display:flex;align-items:center;justify-content:center;z-index:2;font-variant-numeric:tabular-nums;box-shadow:0 2px 5px rgba(58,53,48,.07);}
        .pq1106 .pq-lc{left:3px;width:120px;padding-left:12px;cursor:grab;user-select:none;touch-action:none;overflow:visible;}
        .pq1106 .pq-lc.drop{animation:pqDrop .5s cubic-bezier(.3,1.3,.5,1) both;}
        .pq1106 .pq-lc.linked{border-color:#7aa7f0;}
        .pq1106 .pq-lc::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:6px;border-radius:6px;background:var(--wc);}
        .pq1106 .pq-rc{right:3px;width:120px;background:#f7f8fb;}
        .pq1106 .pq-rc.linked{border-color:#7aa7f0;background:#f2f6ff;}
        .pq1106 .pq-expr{font-size:23px;font-weight:900;color:#374151;}
        .pq1106 .pq-plus{color:#2b7fc4;margin:0 5px;font-style:normal;}
        .pq1106 .pq-dot{position:absolute;right:-7px;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:50%;background:#2563eb;border:2px solid #fff;box-shadow:0 0 0 3px rgba(37,99,235,.18);animation:pqPulse 1.6s ease-in-out infinite;}
        .pq1106 .pq-dot.on{background:#7aa7f0;animation:none;}
        .pq1106 .pq-cnt{position:absolute;top:-9px;left:-9px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:4;}
        .pq1106 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1106 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1106 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSpin{from{transform:rotate(0);}to{transform:rotate(360deg);}}
        @keyframes pqTrainBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqSteam{0%,55%,100%{opacity:0;transform:translateY(0) scale(.6);}64%{opacity:.9;transform:translateY(-8px) scale(1);}90%{opacity:0;transform:translateY(-20px) scale(1.4);}}
        @keyframes pqBlink{0%,92%{transform:scaleY(1);}94%,98%{transform:scaleY(.1);}100%{transform:scaleY(1);}}
        @keyframes pqSem{0%,50%{opacity:1;}50.01%,100%{opacity:.18;}}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(440px);}}
        @keyframes pqPulse{0%,100%{box-shadow:0 0 0 3px rgba(37,99,235,.18);}50%{box-shadow:0 0 0 6px rgba(37,99,235,.07);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-50%) translateX(-14px);}100%{opacity:1;transform:translateY(-50%) translateX(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-train">
        <span className="pq-bird bd1" aria-hidden="true"><svg viewBox="0 0 24 10" width="14" height="6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-bird bd2" aria-hidden="true"><svg viewBox="0 0 24 10" width="14" height="6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 8 Q6 1 11 8 Q16 1 21 8" /></svg></span>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <TrainScene />
      </div>

      <div className="pq-connect" ref={boxRef} style={{ height: H }}>
        <svg className="pq-svg" viewBox={`0 0 ${CW} ${H}`} width={CW} height={H}>
          {LEFT.map((_, li) => {
            const ri = links[li]; if (ri == null) return null;
            return <path key={li} d={curve(LX, leftY(li), RX, rightY(ri))} stroke={lineColor(li)} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
          })}
          {dragLine && <path d={curve(dragLine.x1, dragLine.y1, dragLine.x2, dragLine.y2)} stroke="#2563eb" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeDasharray="2 8" />}
        </svg>

        {LEFT.map((l, li) => (
          <div key={li} className={'pq-lc' + (!still ? ' drop' : '') + (links[li] != null ? ' linked' : '')}
            style={{ top: leftY(li), '--wc': WAGON[li], animationDelay: !still ? `${li * 0.09}s` : undefined }}
            onPointerDown={(e) => startDrag(li, e)} onPointerMove={moveDrag} onPointerUp={endDrag}>
            <span className="pq-expr">{l.a}<i className="pq-plus">+</i>{l.b}</span>
            {ok && <b className="pq-cnt">{li + 1}</b>}
            {!lock && <span className={'pq-dot' + (links[li] != null ? ' on' : '')} />}
          </div>
        ))}
        {RIGHT.map((r, j) => {
          const linked = Object.values(links).includes(j);
          return (
            <div key={j} className={'pq-rc' + (linked ? ' linked' : '')} style={{ top: rightY(j) }}>
              <span className="pq-expr">{r.a}<i className="pq-plus">+</i>{r.b}</span>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
