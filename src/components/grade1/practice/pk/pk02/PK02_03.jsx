// PK02_03 — ПК2 (Blok 2) · 5 ichida qo'shish · YANGI SHARTLI (amaliyotda yo'q).
// Mustaqil jsx-savol: React'dan boshqa import yo'q. Kontrakt: onReady/registerCheck/onSubmit.
// Animatsiya markazlashgan freym ichida, chizilgan SVG obyektlar, uzluksiz harakat.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const pick = (v, lang) => (v && typeof v === 'object' ? (v[lang] || v.uz) : v);

// ——— Chizilgan obyektlar (emoji o'rniga real SVG, kattaroq, jonli) ———
const OBJ = {
  apple: (<g><path d="M28 17c-10 0-15 8-13 19 1.6 9 7.5 14 13 14s11.4-5 13-14c2-11-3-19-13-19z" fill="#e8483f" /><path d="M20 25c-1.4 3.4-1.4 8 0 11.5" stroke="#fff" strokeWidth="2.4" fill="none" opacity=".45" strokeLinecap="round" /><rect x="26.2" y="8" width="3.6" height="10" rx="1.8" fill="#7c4a22" /><path d="M30 11c5.5-4.5 11-2.5 9.5 3.2-4.4 2.2-8.6 1-9.5-3.2z" fill="#4faa4f" /></g>),
  fish: (<g><path d="M14 28c9-13 33-15 44-3-11 12-35 10-44 3z" fill="#f2913b" /><path d="M14 28 L4 17 L7 28 L4 39z" fill="#e8743b" /><circle cx="46" cy="23" r="2.6" fill="#1f2430" /><circle cx="46.9" cy="22.2" r=".9" fill="#fff" /><path d="M24 28h15" stroke="#d9772a" strokeWidth="2" strokeLinecap="round" opacity=".6" /></g>),
  balloon: (<g><ellipse cx="28" cy="24" rx="17" ry="20" fill="#e05b7a" /><path d="M28 43 l-4 5 h8z" fill="#c04863" /><path d="M28 48 q5 8 0 16" stroke="#9aa3ad" strokeWidth="1.6" fill="none" /><ellipse cx="21" cy="17" rx="4.5" ry="7" fill="#fff" opacity=".33" /></g>),
  ladybug: (<g><ellipse cx="28" cy="32" rx="19" ry="17" fill="#e8483f" /><path d="M28 16v33" stroke="#1f2430" strokeWidth="2.4" /><circle cx="28" cy="15" r="8" fill="#26120f" /><circle cx="18" cy="27" r="3" fill="#26120f" /><circle cx="38" cy="27" r="3" fill="#26120f" /><circle cx="20" cy="40" r="2.6" fill="#26120f" /><circle cx="36" cy="40" r="2.6" fill="#26120f" /></g>),
  star: (<g><path d="M28 5 l6.5 16.5 17.5 1 -13.5 11 4.5 17 -15-9.7 -15 9.7 4.5-17 -13.5-11 17.5-1z" fill="#f5c033" stroke="#e0a92e" strokeWidth="1.6" strokeLinejoin="round" /></g>),
  chick: (<g><ellipse cx="28" cy="35" rx="16" ry="14" fill="#f7cf3f" /><circle cx="28" cy="19" r="11" fill="#f9d94f" /><path d="M28 19 l7 3.5 -7 3.5z" fill="#f0912e" /><circle cx="25" cy="17" r="1.8" fill="#1f2430" /><circle cx="31" cy="17" r="1.8" fill="#1f2430" /><path d="M13 34 q-4 3 0 7" stroke="#e6b833" strokeWidth="3" fill="none" strokeLinecap="round" /></g>),
  cookie: (<g><circle cx="28" cy="28" r="21" fill="#c98a4b" /><circle cx="28" cy="28" r="21" fill="none" stroke="#b0713a" strokeWidth="2" /><circle cx="20" cy="22" r="2.6" fill="#5a3a1a" /><circle cx="34" cy="20" r="2.2" fill="#5a3a1a" /><circle cx="37" cy="33" r="2.6" fill="#5a3a1a" /><circle cx="22" cy="36" r="2.2" fill="#5a3a1a" /><circle cx="28" cy="29" r="2" fill="#5a3a1a" /></g>),
  bird: (<g><ellipse cx="27" cy="33" rx="16" ry="13" fill="#5aa9e6" /><circle cx="30" cy="20" r="10" fill="#6fb8ee" /><path d="M30 20 l7 3 -7 3z" fill="#f0912e" /><circle cx="33" cy="18" r="1.7" fill="#1f2430" /><path d="M14 31 q-5 4 1 8" stroke="#3f8fce" strokeWidth="3.4" fill="none" strokeLinecap="round" /><path d="M12 34 L2 30 L10 40z" fill="#4f98d6" /></g>),
  dot: (<g><circle cx="28" cy="28" r="18" fill="#4f8fc4" /><ellipse cx="22" cy="21" rx="5" ry="7" fill="#fff" opacity=".3" /></g>),
};
const TYPE = { '🍎': 'apple', '🐟': 'fish', '🎈': 'balloon', '🐞': 'ladybug', '⭐': 'star', '🐤': 'chick', '🍪': 'cookie', '🐦': 'bird', '🔵': 'dot' };
const ANIM = { apple: 'gq-sway', fish: 'gq-swim', balloon: 'gq-float', ladybug: 'gq-bob', star: 'gq-twinkle', chick: 'gq-bob', cookie: 'gq-sway', bird: 'gq-float', dot: 'gq-pulse' };
const SObj = ({ emoji, d }) => {
  const t = TYPE[emoji];
  if (!t) return <span className="gq-emoji gq-bob" style={{ animationDelay: `${d}s` }}>{emoji}</span>;
  return (<svg viewBox="0 0 56 64" width="52" height="58" className={'gq-obj ' + ANIM[t]} style={{ animationDelay: `${d}s` }} aria-hidden="true">{OBJ[t]}</svg>);
};
const Objs = ({ n, emoji, faded = 0 }) => (
  <div className="gq-objs">
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className={'gq-objw' + (i >= n - faded ? ' gq-gone' : '')}><SObj emoji={emoji} d={(i % 5) * 0.28} /></span>
    ))}
  </div>
);
const Basket = () => (
  <svg viewBox="0 0 96 72" width="120" height="90" className="gq-obj gq-bob" aria-hidden="true">
    <path d="M12 26 h72 l-8 38 a6 6 0 0 1 -6 5 H26 a6 6 0 0 1 -6 -5z" fill="#e8c58a" stroke="#c99a52" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M8 26 h80" stroke="#c99a52" strokeWidth="5" strokeLinecap="round" />
    <path d="M22 30 l6 34 M40 30 l3 34 M56 30 l-3 34 M74 30 l-6 34" stroke="#c99a52" strokeWidth="2" opacity=".6" />
  </svg>
);

// Geometriya SVG (shape turi uchun): chiziq/shakl, kattaroq.
function shapeSvg(id, size) {
  const st = '#5a3fa0', sw = 4, S = size;
  if (id === 'circle') return (<svg width={S} height={S} viewBox="0 0 52 52"><circle cx="26" cy="26" r="20" fill="#efe9fb" stroke={st} strokeWidth={sw} /></svg>);
  if (id === 'square') return (<svg width={S} height={S} viewBox="0 0 52 52"><rect x="7" y="7" width="38" height="38" rx="3" fill="#efe9fb" stroke={st} strokeWidth={sw} /></svg>);
  if (id === 'triangle') return (<svg width={S} height={S} viewBox="0 0 52 52"><path d="M26 7 L46 44 L6 44 Z" fill="#efe9fb" stroke={st} strokeWidth={sw} strokeLinejoin="round" /></svg>);
  if (id === 'straight') return (<svg width={S + 24} height={S} viewBox="0 0 72 52"><line x1="8" y1="26" x2="64" y2="26" stroke={st} strokeWidth={sw} strokeLinecap="round" /></svg>);
  if (id === 'curved') return (<svg width={S + 24} height={S} viewBox="0 0 72 52"><path d="M8 34 Q28 6 44 26 T64 22" fill="none" stroke={st} strokeWidth={sw} strokeLinecap="round" /></svg>);
  if (id === 'broken') return (<svg width={S + 24} height={S} viewBox="0 0 72 52"><polyline points="8,34 22,14 38,36 52,16 64,32" fill="none" stroke={st} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>);
  return null;
}

// ——— SAVOL MA'LUMOTI (faqat shu blok fayldan faylga o'zgaradi) ———
const DATA = {
  topic: '5 ichida qo\'shish', kind: 'add', a: 2, b: 3, emoji: '🐞', options: [4, 5, 6], answer: 5,
  eyebrow: { uz: 'Nazorat · 5 ichida', ru: 'Контроль · В пределах 5' },
  setup: { uz: 'Bargda 2 ta xonqizi bor, yana 3 tasi keldi.', ru: 'На листе 2 божьи коровки, приползли ещё 3.' },
  ask: { uz: 'Hammasi bo\'lib nechta?', ru: 'Сколько всего?' },
  correct: { uz: 'Barakalla! Ikki va uch — besh.', ru: 'Молодец! Два и три — пять.' },
  hint: { uz: 'Ikki va uchni qo\'shing.', ru: 'Сложи два и три.' },
};

export default function PK02_03(props) {
  const data = DATA;
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
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
    const correct = picked === data.answer;
    setFeedback({ correct, msg: correct ? pick(data.correct, lang) : pick(data.hint, lang) });
    if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${pick(data.setup, lang)} ${pick(data.ask, lang)}`,
      options: data.options.map(String), studentAnswer: { value: picked },
      correctAnswer: { value: data.answer }, correct, meta: { kind: data.kind, topic: data.topic },
    });
  }, [picked, lang, playCorrect, playWrong, onSubmit]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const em = data.emoji || '🍎';

  const Operand = ({ v }) => (data.noDots
    ? <div className="gq-num">{v}</div>
    : <div className="gq-grp"><Objs n={v} emoji={em} /></div>);
  let visual = null;
  if (data.kind === 'add') {
    visual = (
      <div className="gq-row">
        <Operand v={data.a} /><span className="gq-op">+</span><Operand v={data.b} />
        <span className="gq-op">=</span>
        <div className={'gq-slot' + (ok ? ' win' : '')}>{ok ? data.answer : '?'}</div>
      </div>
    );
  } else if (data.kind === 'sub') {
    visual = (
      <div className="gq-row">
        {data.noDots ? <div className="gq-num">{data.a}</div> : <div className="gq-grp"><Objs n={data.a} emoji={em} faded={ok ? data.b : 0} /></div>}
        <span className="gq-op">−</span><div className="gq-num">{data.b}</div><span className="gq-op">=</span>
        <div className={'gq-slot' + (ok ? ' win' : '')}>{ok ? data.answer : '?'}</div>
      </div>
    );
  } else if (data.kind === 'fill') {
    visual = (
      <div className="gq-eqn big">
        <b>{data.a}</b><span className="gq-op">{data.op || '+'}</span>
        <span className={'gq-slot sm' + (ok ? ' win' : '')}>{ok ? data.answer : '▢'}</span>
        <span className="gq-op">=</span><b>{data.c}</b>
      </div>
    );
  } else if (data.kind === 'commute') {
    visual = (
      <div className="gq-eqn">
        <b>{data.a}</b><span className="gq-op">+</span><b>{data.b}</b><span className="gq-op">=</span>
        <b>{data.b}</b><span className="gq-op">+</span>
        <span className={'gq-slot sm' + (ok ? ' win' : '')}>{ok ? data.answer : '▢'}</span>
      </div>
    );
  } else if (data.kind === 'compose') {
    visual = (
      <div className="gq-compose">
        <div className="gq-total">{pick(data.totalLabel, lang) || 'Jami'}<b>{data.total}</b></div>
        <div className="gq-row">
          <div className="gq-grp"><Objs n={data.left} emoji={em} /></div>
          <span className="gq-op">va</span>
          <div className={'gq-slot' + (ok ? ' win' : '')}>{ok ? data.answer : '?'}</div>
        </div>
      </div>
    );
  } else if (data.kind === 'compare') {
    visual = (
      <div className="gq-row">
        <div className="gq-card">{data.a}</div>
        <div className={'gq-slot' + (ok ? ' win' : '')}>{ok ? data.answer : '?'}</div>
        <div className="gq-card">{data.b}</div>
      </div>
    );
  } else if (data.kind === 'truefalse') {
    visual = (<div className="gq-eqn big">{data.expr}</div>);
  } else if (data.kind === 'convert') {
    visual = (<div className="gq-eqn big">{data.expr}<span className={'gq-slot sm' + (ok ? ' win' : '')}>{ok ? data.answer : '?'}</span>{data.unit ? <span className="gq-unit">{data.unit}</span> : null}</div>);
  } else if (data.kind === 'steps') {
    visual = (
      <div className="gq-eqn">
        <b>{data.start}</b>
        {data.steps.map((s, i) => (<React.Fragment key={i}><span className="gq-op">{s.op}</span><b>{s.n}</b></React.Fragment>))}
        <span className="gq-op">=</span>
        <span className={'gq-slot sm' + (ok ? ' win' : '')}>{ok ? data.answer : '?'}</span>
      </div>
    );
  } else if (data.kind === 'count') {
    visual = data.n === 0
      ? <Basket />
      : <div className="gq-grp big"><Objs n={data.n} emoji={em} /></div>;
  } else if (data.kind === 'place') {
    visual = <div className="gq-bignum">{data.num}</div>;
  } else if (data.kind === 'skip') {
    visual = (
      <div className="gq-seq">
        {data.seq.map((x, i) => (x === null
          ? <span key={i} className={'gq-slot sm' + (ok ? ' win' : '')}>{ok ? data.answer : '▢'}</span>
          : <span key={i} className="gq-scard">{x}</span>))}
      </div>
    );
  } else if (data.kind === 'shape') {
    visual = data.mode === 'count'
      ? <div className="gq-shapebig">{shapeSvg(data.shape, 116)}</div>
      : null;
  }

  const isShapePick = data.kind === 'shape' && data.mode !== 'count';
  const optClass = data.kind === 'truefalse' ? 'gq-opt tf' : isShapePick ? 'gq-opt shape' : 'gq-opt';

  return (
    <div className="pq gq">
      <style>{`
        .gq{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .gq .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a54c2;text-transform:uppercase;}
        .gq .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .gq .pq-setup{color:#5c6672;font-weight:500;}
        .gq .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .gq .gq-stage{min-height:200px;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:radial-gradient(120% 100% at 50% 25%,#faf8ff 0%,#efeafb 100%);border:2px solid #ddd3f0;border-radius:26px;box-shadow:inset 0 2px 14px rgba(90,63,160,.07);}
        .gq .gq-row{display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap;}
        .gq .gq-grp{padding:12px 14px;background:#fff;border:2px solid #e6dff5;border-radius:20px;box-shadow:0 4px 14px rgba(90,63,160,.08);}
        .gq .gq-grp.big{padding:16px 20px;}
        .gq .gq-objs{display:flex;flex-wrap:wrap;gap:8px 10px;justify-content:center;align-items:flex-end;max-width:260px;}
        .gq .gq-objw{line-height:0;}
        .gq .gq-obj{display:block;filter:drop-shadow(0 3px 3px rgba(0,0,0,.14));transform-origin:bottom center;}
        .gq .gq-emoji{font-size:46px;line-height:1;display:inline-block;}
        .gq .gq-objw.gq-gone{opacity:.25;filter:grayscale(1);transition:.35s;}
        .gq .gq-op{font-size:34px;font-weight:900;color:#7a54c2;}
        .gq .gq-num,.gq .gq-card{min-width:66px;height:72px;padding:0 12px;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:900;color:#374151;background:#fff;border:2px solid #d6dae3;border-radius:18px;font-variant-numeric:tabular-nums;box-shadow:0 4px 12px rgba(0,0,0,.06);}
        .gq .gq-slot{width:72px;height:72px;flex-shrink:0;border-radius:18px;border:3px dashed #b9a7e0;background:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;color:#c3b4e6;font-variant-numeric:tabular-nums;animation:gqBreath 2s ease-in-out infinite;}
        .gq .gq-slot.sm{width:56px;height:56px;font-size:32px;}
        .gq .gq-slot.win{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:gqCele .5s ease;}
        .gq .gq-eqn{display:flex;gap:10px;align-items:center;justify-content:center;font-size:44px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;flex-wrap:wrap;}
        .gq .gq-eqn.big{font-size:50px;}
        .gq .gq-eqn b{color:#1f2430;}
        .gq .gq-unit{font-size:30px;font-weight:800;color:#5c6672;}
        .gq .gq-compose{display:flex;flex-direction:column;gap:16px;align-items:center;}
        .gq .gq-total{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:800;color:#5a3fa0;}
        .gq .gq-total b{min-width:44px;height:44px;padding:0 10px;border-radius:14px;background:#fff;border:2px solid #cdbfe6;display:inline-flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#5a3fa0;}
        .gq .gq-bignum{text-align:center;font-size:96px;font-weight:900;color:#1f2430;font-variant-numeric:tabular-nums;letter-spacing:3px;animation:gqBreath 2.4s ease-in-out infinite;}
        .gq .gq-seq{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;}
        .gq .gq-scard{min-width:66px;height:72px;padding:0 12px;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;color:#374151;background:#fff;border:2px solid #d6dae3;border-radius:18px;font-variant-numeric:tabular-nums;box-shadow:0 4px 12px rgba(0,0,0,.06);}
        .gq .gq-shapebig{display:flex;justify-content:center;filter:drop-shadow(0 4px 4px rgba(0,0,0,.12));}
        .gq .gq-opt.shape{display:flex;align-items:center;justify-content:center;padding:12px;min-width:92px;height:84px;}
        .gq .gq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .gq .gq-opt{min-width:74px;height:74px;padding:0 16px;font-size:32px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .gq .gq-opt.tf{font-size:20px;min-width:130px;}
        .gq .gq-opt:hover:not(:disabled){border-color:#b9a7e0;transform:translateY(-2px);}
        .gq .gq-opt:active:not(:disabled){transform:scale(.94);}
        .gq .gq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .gq .gq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:gqCele .5s ease;}
        .gq .gq-opt:disabled{cursor:default;}
        .gq .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:gqIn .22s ease both;}
        .gq .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .gq .pq-fb.no{background:#fdecec;color:#c0392b;}
        .gq .gq-sway{animation:gqSway 3s ease-in-out infinite;}
        .gq .gq-float{animation:gqFloat 3.2s ease-in-out infinite;}
        .gq .gq-swim{animation:gqSwim 2.4s ease-in-out infinite;}
        .gq .gq-bob{animation:gqBob 2.2s ease-in-out infinite;}
        .gq .gq-twinkle{animation:gqTwinkle 2.6s ease-in-out infinite;transform-origin:center;}
        .gq .gq-pulse{animation:gqPulse 2s ease-in-out infinite;transform-origin:center;}
        @keyframes gqSway{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}
        @keyframes gqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes gqSwim{0%,100%{transform:translateX(-3px) rotate(-3deg);}50%{transform:translateX(3px) rotate(3deg);}}
        @keyframes gqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes gqTwinkle{0%,100%{transform:scale(1) rotate(0);opacity:.9;}50%{transform:scale(1.14) rotate(10deg);opacity:1;}}
        @keyframes gqPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
        @keyframes gqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        @keyframes gqCele{0%{transform:scale(1);}30%{transform:scale(1.1);}60%{transform:scale(.95);}100%{transform:scale(1);}}
        @keyframes gqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{pick(data.eyebrow, lang)}</span>
      <p className="pq-body"><span className="pq-setup">{pick(data.setup, lang)}</span><b className="pq-ask">{pick(data.ask, lang)}</b></p>

      {visual && <div className="gq-stage">{visual}</div>}

      <div className="gq-opts">
        {data.options.map((o) => {
          const sel = picked === o; const right = ok && o === data.answer;
          const label = isShapePick ? shapeSvg(o, 46) : (data.optLabels ? pick(data.optLabels[String(o)], lang) : o);
          return <button key={String(o)} type="button" className={optClass + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(o); setFeedback(null); }}>{label}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
