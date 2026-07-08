// Dars04 · Amaliyot 01 — LOGIC Naqshni davom ettir: «Hayvonlar paradi» · 🟢 · tag: logic_pattern
// Hayvonot bog'ida parad: fil, maymun, fil, maymun, fil, «?» — qatorda keyingi kim?
// Hayvonlar CHIZILGAN SVG (D03_04 Bird/Tree kanoni): qatlamli shakllar, bir rang-oilaning
// 2-3 toni, yupqa quyuq kontur, blikli ko'z; yurish-bob stagger bilan, g'alabada selebratsiya.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PATTERN = ['fil', 'maymun', 'fil', 'maymun', 'fil'];
const OPTS = ['maymun', 'fil', 'quyon'];
const CORRECT_ID = 'maymun';
const OPT_NAMES = {
  uz: { maymun: 'maymun', fil: 'fil', quyon: 'quyon' },
  ru: { maymun: 'обезьяна', fil: 'слон', quyon: 'кролик' },
};
const DATA = { ptype: 'LOGIC', level: '🟢', tag: 'logic_pattern' };
const T = {
  uz: {
    eyebrow: "Hayvonot bog'i · Parad", title: "Paradni davom ettir",
    setup: "Hayvonot bog'ida parad boshlandi! Hayvonlar qatorda tartib bilan yurishmoqda.",
    ask: "Qatorda keyingi kim keladi?",
    correct: "Barakalla! Qator takrorlanmoqda: fil, maymun, fil, maymun — keyingisi maymun!",
    hint: "Qatorni boshidan ayting: fil, maymun, fil, maymun... Nima takrorlanmoqda?",
  },
  ru: {
    eyebrow: 'Зоопарк · Парад', title: 'Продолжи парад',
    setup: 'В зоопарке начался парад! Звери идут в ряд по порядку.',
    ask: 'Кто идёт в ряду следующим?',
    correct: 'Молодец! Ряд повторяется: слон, обезьяна, слон, обезьяна — дальше обезьяна!',
    hint: 'Назови ряд с начала: слон, обезьяна, слон, обезьяна... Что повторяется?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan fil (yon ko'rinish, o'ngga yuradi): kulrang 2-3 ton, katta quloq,
// tebranadigan xartum (pq-trunk), to'rt oyoq, dumcha, blikli ko'z.
const Elephant = ({ w = 58 }) => (
  <svg viewBox="0 0 76 58" width={w} height={Math.round(w * 58 / 76)} aria-hidden="true">
    <path d="M9 25 Q3 29 5.5 36" stroke="#7d8a99" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <circle cx="5.8" cy="36.6" r="2" fill="#6b7888" />
    <rect x="14" y="37" width="7.5" height="16" rx="3.4" fill="#8593a3" />
    <rect x="36" y="37" width="7.5" height="16" rx="3.4" fill="#8593a3" />
    <ellipse cx="30" cy="30" rx="22" ry="16" fill="#9aa8b8" stroke="#6b7888" strokeWidth="1.6" />
    <path d="M14 22 Q28 14 44 21" stroke="#b6c2cf" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".7" />
    <rect x="20" y="40" width="8" height="14" rx="3.6" fill="#9aa8b8" stroke="#6b7888" strokeWidth="1.4" />
    <rect x="42" y="40" width="8" height="14" rx="3.6" fill="#9aa8b8" stroke="#6b7888" strokeWidth="1.4" />
    <path d="M21 51 q3 2 6 0 M43 51 q3 2 6 0" stroke="#e6ebf0" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="55" cy="19" r="12.5" fill="#9aa8b8" stroke="#6b7888" strokeWidth="1.6" />
    <ellipse cx="47.5" cy="20.5" rx="8.5" ry="11" fill="#8593a3" stroke="#6b7888" strokeWidth="1.4" />
    <ellipse cx="47.5" cy="20.5" rx="5" ry="7.4" fill="#b6c2cf" />
    <g className="pq-trunk">
      <path d="M64 13 Q74 20 71 31 Q69 39 63 40" stroke="#6b7888" strokeWidth="7.6" fill="none" strokeLinecap="round" />
      <path d="M64 13 Q74 20 71 31 Q69 39 63 40" stroke="#9aa8b8" strokeWidth="5.2" fill="none" strokeLinecap="round" />
      <path d="M66 17 Q72 23 70 30" stroke="#b6c2cf" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
    <circle cx="58.5" cy="15" r="2.1" fill="#1f2430" />
    <circle cx="59.3" cy="14.3" r="0.75" fill="#fff" />
  </svg>
);

// Chizilgan maymun: jigarrang tana, ochiq yuz-qorin, dumaloq quloqlar,
// egilib tebranadigan dum (pq-tail), blikli ko'zlar.
const Monkey = ({ w = 40 }) => (
  <svg viewBox="0 0 56 58" width={w} height={Math.round(w * 58 / 56)} aria-hidden="true">
    <path className="pq-tail" d="M11 36 Q1 31 4 20 Q6 13 12 14" stroke="#8a5a33" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M16 34 Q11 40 13 47 M40 34 Q45 40 43 47" stroke="#8a5a33" strokeWidth="4" fill="none" strokeLinecap="round" />
    <ellipse cx="28" cy="39" rx="14" ry="13" fill="#8a5a33" stroke="#5f3c1e" strokeWidth="1.6" />
    <ellipse cx="28.5" cy="42" rx="8.5" ry="8" fill="#e2b985" />
    <path d="M20 49 L17 55.5 M36 49 L39 55.5" stroke="#6f4626" strokeWidth="3.6" strokeLinecap="round" />
    <circle cx="15" cy="13.5" r="5.4" fill="#8a5a33" stroke="#5f3c1e" strokeWidth="1.4" />
    <circle cx="15" cy="13.5" r="2.7" fill="#e2b985" />
    <circle cx="41" cy="13.5" r="5.4" fill="#8a5a33" stroke="#5f3c1e" strokeWidth="1.4" />
    <circle cx="41" cy="13.5" r="2.7" fill="#e2b985" />
    <circle cx="28" cy="17" r="12.4" fill="#8a5a33" stroke="#5f3c1e" strokeWidth="1.6" />
    <ellipse cx="24" cy="15" rx="4.2" ry="4.6" fill="#e2b985" />
    <ellipse cx="32" cy="15" rx="4.2" ry="4.6" fill="#e2b985" />
    <ellipse cx="28" cy="20.5" rx="7.6" ry="6.2" fill="#e2b985" />
    <circle cx="24.2" cy="15.4" r="1.9" fill="#1f2430" /><circle cx="24.9" cy="14.7" r="0.7" fill="#fff" />
    <circle cx="31.8" cy="15.4" r="1.9" fill="#1f2430" /><circle cx="32.5" cy="14.7" r="0.7" fill="#fff" />
    <path d="M26.8 20.6 q1.2 1 2.4 0" stroke="#5f3c1e" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M24.6 23.6 q3.4 2.6 6.8 0" stroke="#5f3c1e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);

// Chizilgan quyon (variant kartasi uchun): oq-kulrang 2-3 ton, uzun quloqlar
// pushti ichlik bilan, dumcha-pufak, blikli ko'zlar, mo'ylov chizig'i.
const Rabbit = ({ w = 42 }) => (
  <svg viewBox="0 0 52 58" width={w} height={Math.round(w * 58 / 52)} aria-hidden="true">
    <g transform="rotate(-8 20 12)">
      <ellipse cx="20" cy="12" rx="4.6" ry="11" fill="#d8cec2" stroke="#a89a8a" strokeWidth="1.4" />
      <ellipse cx="20" cy="13" rx="2.2" ry="7.4" fill="#f2c3cd" />
    </g>
    <g transform="rotate(8 31 12)">
      <ellipse cx="31" cy="12" rx="4.6" ry="11" fill="#d8cec2" stroke="#a89a8a" strokeWidth="1.4" />
      <ellipse cx="31" cy="13" rx="2.2" ry="7.4" fill="#f2c3cd" />
    </g>
    <circle cx="40" cy="47" r="4" fill="#f7f2ea" stroke="#a89a8a" strokeWidth="1.2" />
    <ellipse cx="25" cy="42" rx="15" ry="13" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.6" />
    <ellipse cx="24" cy="45" rx="8" ry="7" fill="#f7f2ea" />
    <circle cx="25" cy="25.5" r="11" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.6" />
    <circle cx="21" cy="23.6" r="1.8" fill="#1f2430" /><circle cx="21.6" cy="23" r="0.65" fill="#fff" />
    <circle cx="29" cy="23.6" r="1.8" fill="#1f2430" /><circle cx="29.6" cy="23" r="0.65" fill="#fff" />
    <path d="M23.7 27.6 h2.6 l-1.3 1.9 Z" fill="#e58ba0" />
    <path d="M25 29.7 q0 2.1 -2.1 2.5 M25 29.7 q0 2.1 2.1 2.5" stroke="#a89a8a" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d="M14 27 h4.6 M14.4 29.8 h4.2 M31.4 27 h4.6 M31.4 29.8 h4.2" stroke="#bcb0a1" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="17" cy="53.4" rx="5" ry="2.6" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.2" />
    <ellipse cx="31" cy="53.4" rx="5" ry="2.6" fill="#e9e0d4" stroke="#a89a8a" strokeWidth="1.2" />
  </svg>
);

// Bayram gulchambari (bayroqchalar ipi) — parad sahnasining tepasida.
const FLAG_C = ['#e2703a', '#f2b134', '#5cae54', '#4f8fc4', '#e88bb1'];
const Garland = () => (
  <svg viewBox="0 0 340 26" width="100%" height="26" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M0 4 Q170 15 340 4" stroke="#b7855a" strokeWidth="1.5" fill="none" />
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 16 + i * 32; const p = x / 340;
      const y = (1 - p) * (1 - p) * 4 + 2 * p * (1 - p) * 15 + p * p * 4;
      return <polygon key={i} points={`${x},${y} ${x + 13},${y} ${x + 6.5},${y + 12}`} fill={FLAG_C[i % FLAG_C.length]} opacity=".9" />;
    })}
  </svg>
);

export default function D04_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const names = OPT_NAMES[lang] || OPT_NAMES.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.id != null) setPicked(initialAnswer.studentAnswer.id);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT_ID;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    const nm = OPT_NAMES[lang] || OPT_NAMES.uz;
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: OPTS.map((o) => nm[o]), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t, lang]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0401">
      <style>{`
        .pq0401{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0401 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c2803a;text-transform:uppercase;}
        .pq0401 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0401 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0401 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0401 .pq-scene{position:relative;max-width:420px;margin:0 auto;padding:30px 8px 14px;border-radius:20px;border:2px solid #cfe3c8;background:linear-gradient(#dff2fd 0%,#eaf7ff 50%,#dcefcd 76%,#cfe8b8 100%);overflow:hidden;}
        .pq0401 .pq-garland{position:absolute;top:4px;left:0;right:0;}
        .pq0401 .pq-row{display:flex;align-items:flex-end;justify-content:center;gap:6px;}
        .pq0401 .pq-anim{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqWalk 1.6s ease-in-out infinite;}
        .pq0401 .pq-row.cele .pq-anim{animation:pqHop .55s ease-in-out infinite;}
        .pq0401 .pq-trunk{transform-box:fill-box;transform-origin:top left;animation:pqTrunk 2.6s ease-in-out infinite;}
        .pq0401 .pq-tail{transform-box:fill-box;transform-origin:bottom right;animation:pqTail 2.2s ease-in-out infinite;}
        .pq0401 .pq-cell{position:relative;width:52px;height:52px;margin-left:4px;border:3px dashed #c9a15f;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.55);animation:pqPulse 1.5s ease-in-out infinite;flex:0 0 auto;}
        .pq0401 .pq-cell.right{border:3px solid #1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0401 .pq-q{font-size:26px;font-weight:900;color:#c2803a;}
        .pq0401 .pq-dropin{position:relative;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0401 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0401 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:18px;}
        .pq0401 .pq-opt{position:relative;width:86px;height:84px;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:6px;transition:.14s;}
        .pq0401 .pq-opt svg{filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));}
        .pq0401 .pq-opt:disabled{cursor:default;}
        .pq0401 .pq-opt:hover:not(:disabled){border-color:#dcae64;transform:translateY(-3px);}
        .pq0401 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0401 .pq-opt.sel{border-color:#2563eb;background:#eef3fe;}
        .pq0401 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0401 .pq-tick{position:absolute;top:6px;right:6px;color:#1a7f43;}
        .pq0401 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0401 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0401 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWalk{0%,100%{transform:translateY(0) rotate(0);}25%{transform:translateY(-3px) rotate(-1.2deg);}75%{transform:translateY(-3px) rotate(1.2deg);}}
        @keyframes pqHop{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
        @keyframes pqTrunk{0%,100%{transform:rotate(4deg);}50%{transform:rotate(-5deg);}}
        @keyframes pqTail{0%,100%{transform:rotate(6deg);}50%{transform:rotate(-8deg);}}
        @keyframes pqPulse{0%,100%{transform:scale(1);border-color:#c9a15f;}50%{transform:scale(1.07);border-color:#e2a33d;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-24px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <div className="pq-garland"><Garland /></div>
        <div className={'pq-row' + (ok ? ' cele' : '')}>
          {PATTERN.map((a, i) => (
            <span key={i} className="pq-anim" style={{ animationDelay: `${i * 0.18}s` }}>
              {a === 'fil' ? <Elephant /> : <Monkey />}
              {ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          ))}
          <span className={'pq-cell' + (ok ? ' right' : '')}>
            {ok
              ? <span className="pq-dropin"><Monkey w={38} /><b className="pq-cnt">{PATTERN.length + 1}</b></span>
              : <span className="pq-q">?</span>}
          </span>
        </div>
      </div>

      <div className="pq-opts">
        {OPTS.map((o) => {
          const sel = picked === o; const right = ok && o === CORRECT_ID;
          return (
            <button key={o} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(o); setFeedback(null); }} aria-label={names[o]}>
              {right && <span className="pq-tick"><IconOk /></span>}
              {o === 'maymun' ? <Monkey w={44} /> : o === 'fil' ? <Elephant w={58} /> : <Rabbit w={42} />}
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
