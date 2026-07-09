// Dars05 · Amaliyot 08 — P5 Ko'p-tanlov «Beshlik juftlari» · 🔴 · tag: pairs_multi
// Afisha-kartalardagi juftliklardan jami BESH bo'ladiganlarini tanlash — sirk eshigi kaliti «5».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PAIRS = [{ a: 2, b: 3 }, { a: 1, b: 3 }, { a: 4, b: 1 }, { a: 2, b: 2 }];
const SUM = 5;
const GOOD = PAIRS.map((p, i) => (p.a + p.b === SUM ? i : -1)).filter((i) => i >= 0); // [0, 2]
const DATA = { ptype: 'P5', level: '🔴', tag: 'pairs_multi' };
const T = {
  uz: {
    eyebrow: 'Sirk · Afisha', title: 'Beshlik juftlari',
    setup: 'Afishada son juftlari bor. Jami 5 bo\'ladiganlari eshikni ochadi.',
    ask: 'Jami 5 bo\'ladigan BARCHA juftlarni bosing.',
    correct: 'Barakalla! Eshik ochildi — tomosha boshlanadi!',
    hint: 'Har juftni qo\'shib ko\'ring. Jami 5 bo\'lganlarini tanlang.',
  },
  ru: {
    eyebrow: 'Цирк · Афиша', title: 'Пары пятёрки',
    setup: 'На афише пары чисел. Дверь открывают те, что вместе дают 5.',
    ask: 'Нажми на ВСЕ пары, которые вместе дают 5.',
    correct: 'Молодец! Дверь открылась — представление начинается!',
    hint: 'Сложи каждую пару. Выбери только те, что дают 5.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Koptok kanoni: r~10 doira, radial 2-ton (asos + ochroq tepa-chap), yupqa quyuq
// kontur, tepa-chapda oq blik. Palitra ketma-ket aylanadi: qizil, ko'k, sariq, yashil.
const COL = [
  { base: '#d9534b', lite: '#eb8f86', dark: '#a83a34' },
  { base: '#4f8fc4', lite: '#8fbadd', dark: '#376a94' },
  { base: '#f2b134', lite: '#f8d47f', dark: '#c08517' },
  { base: '#57a84f', lite: '#90cc89', dark: '#3d7d38' },
];
const BallDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      {COL.map((c, i) => (
        <radialGradient key={i} id={`pq0508g${i}`} cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor={c.lite} />
          <stop offset="100%" stopColor={c.base} />
        </radialGradient>
      ))}
    </defs>
  </svg>
);
const Ball = ({ g }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill={`url(#pq0508g${g})`} stroke={COL[g].dark} strokeWidth="1.5" />
    <ellipse cx="8.5" cy="7.6" rx="2.7" ry="1.8" fill="#fff" opacity=".85" transform="rotate(-25 8.5 7.6)" />
  </svg>
);

// Chizilgan yulduzcha: oltin, yupqa quyuq kontur, kichik oq blik.
const Star = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="12,2 14.9,8.6 22,9.3 16.7,14.2 18.2,21.3 12,17.6 5.8,21.3 7.3,14.2 2,9.3 9.1,8.6" fill="#f2b134" stroke="#c08517" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="9.6" cy="8.4" r="1.1" fill="#fff" opacity=".75" />
  </svg>
);

// Chizilgan sirk chodiri: qizil oilaning 3 toni (#d9534b / #b23f38 / #e8837c) + oq,
// yupqa quyuq kontur, tepa bayroqcha sekin hilpiraydi, eshik ustida «5» kalit-doira.
// open=true: eshik pardasi ochilib, ichidan oltin nur va mitti yulduzlar ko'rinadi.
const Tent = ({ open }) => (
  <svg viewBox="0 0 140 112" width="150" height="120" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="70" cy="104" rx="60" ry="6" fill="#dcd2ba" />
    {/* devor + vertikal chiziqlar */}
    <path d="M26 68 L114 68 L110 102 L30 102 Z" fill="#fdf6ee" stroke="#8f3a33" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M38 68 L40 102 L50 102 L48 68 Z" fill="#e8837c" />
    <path d="M92 68 L90 102 L100 102 L102 68 Z" fill="#e8837c" />
    {/* gumbaz-tom */}
    <path d="M70 12 L12 70 Q70 82 128 70 Z" fill="#d9534b" stroke="#8f3a33" strokeWidth="2" strokeLinejoin="round" />
    <path d="M70 12 L38 64 Q54 70 62 71 Z" fill="#fdf3ee" />
    <path d="M70 12 L102 64 Q86 70 78 71 Z" fill="#fdf3ee" />
    {/* etak-tasma */}
    <path d="M12 70 Q70 82 128 70 L126 76 Q70 88 14 76 Z" fill="#b23f38" stroke="#8f3a33" strokeWidth="1.2" strokeLinejoin="round" />
    {/* eshik: yopiq parda yoki ochiq oltin nur */}
    {open ? (
      <g>
        <path d="M56 102 L56 82 Q70 70 84 82 L84 102 Z" fill="#ffe9a8" stroke="#c08517" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="70" cy="88" r="7" fill="#fff6d8" />
        <polygon points="65,86 66.2,89 69,89.3 66.9,91.3 67.5,94 65,92.5 62.5,94 63.1,91.3 61,89.3 63.8,89" fill="#f2b134" />
        <polygon points="75,80 75.9,82.3 78,82.5 76.4,84 76.9,86 75,84.9 73.1,86 73.6,84 72,82.5 74.1,82.3" fill="#f2b134" />
      </g>
    ) : (
      <g>
        <path d="M56 102 L56 82 Q70 70 84 82 L84 102 Z" fill="#8a3630" stroke="#6d2a25" strokeWidth="1.6" strokeLinejoin="round" />
        <line x1="70" y1="73" x2="70" y2="102" stroke="#6d2a25" strokeWidth="1.4" />
        <path d="M60 84 Q62 92 61 100 M80 84 Q78 92 79 100" stroke="#6d2a25" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity=".7" />
      </g>
    )}
    {/* «5» kalit-doira eshik ustida */}
    <g className={'pq-key' + (open ? ' win' : '')}>
      <circle cx="70" cy="58" r="11" fill="#f2b134" stroke="#c08517" strokeWidth="1.8" />
      <circle cx="66.5" cy="54.5" r="4" fill="#f8d47f" opacity=".9" />
      <text x="70" y="63" textAnchor="middle" fontSize="15" fontWeight="900" fill="#7a4a06" fontFamily="inherit">5</text>
      {/* ora-sira yalt-uchqun */}
      <polygon className="pq-glint" points="75.5,49.5 76.7,53 80.2,54.2 76.7,55.4 75.5,58.9 74.3,55.4 70.8,54.2 74.3,53" fill="#fff" />
    </g>
    {/* bayroqcha */}
    <line x1="70" y1="12" x2="70" y2="3" stroke="#8f3a33" strokeWidth="2" strokeLinecap="round" />
    <g className="pq-flag"><polygon points="70,3 85,6.5 70,10" fill="#f2b134" stroke="#c08517" strokeWidth="1.3" strokeLinejoin="round" /></g>
  </svg>
);

const STARS = [
  { l: -20, t: 18, d: 0, s: 18 }, { l: 152, t: 12, d: 0.12, s: 16 }, { l: -8, t: 70, d: 0.24, s: 14 },
  { l: 146, t: 64, d: 0.3, s: 15 }, { l: 28, t: -12, d: 0.18, s: 14 }, { l: 104, t: -14, d: 0.06, s: 17 },
];

export default function D05_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => PAIRS[i].a + PAIRS[i].b === SUM);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: PAIRS.map((p) => `${p.a} + ${p.b}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0508">
      <style>{`
        .pq0508{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0508 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0392b;text-transform:uppercase;}
        .pq0508 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0508 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0508 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0508 .pq-stage{display:flex;justify-content:center;margin-bottom:16px;}
        .pq0508 .pq-tentwrap{position:relative;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0508 .pq-flag{transform-box:fill-box;transform-origin:0% 100%;animation:pqWave 3s ease-in-out infinite;}
        .pq0508 .pq-key{transform-box:fill-box;transform-origin:50% 50%;animation:pqBreath 2.2s ease-in-out infinite;}
        .pq0508 .pq-key.win{animation:pqCele .5s ease;}
        .pq0508 .pq-star{position:absolute;line-height:0;animation:pqStarIn .5s cubic-bezier(.3,1.5,.5,1) both,pqTwinkle 1.6s ease-in-out .7s infinite;}
        .pq0508 .pq-glint{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:pqGlint 3.6s ease-in-out infinite;}
        .pq0508 .pq-amb{position:absolute;line-height:0;pointer-events:none;animation:pqAmb 4.2s ease-in-out infinite;}
        .pq0508 .pq-amb.amb2{animation-duration:5.1s;animation-delay:-2.3s;}
        .pq0508 .pq-cards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:312px;margin:0 auto;}
        .pq0508 .pq-float{animation:pqFloat 4s ease-in-out infinite;}
        .pq0508 .pq-card{position:relative;width:138px;padding:16px 8px 12px;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;transition:.14s;font-family:inherit;box-shadow:0 2px 5px rgba(0,0,0,.06);}
        .pq0508 .pq-card:hover:not(:disabled){border-color:#e8a49d;transform:translateY(-2px);}
        .pq0508 .pq-card:active:not(:disabled){transform:scale(.95);}
        .pq0508 .pq-card.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0508 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;box-shadow:0 0 14px 3px rgba(26,127,67,.35);animation:pqCele .5s ease;}
        .pq0508 .pq-card.dim{opacity:.45;}
        .pq0508 .pq-card:disabled{cursor:default;}
        .pq0508 .pq-cstar{position:absolute;top:5px;right:6px;line-height:0;transform-origin:50% 50%;animation:pqCTw 2.8s ease-in-out infinite;}
        .pq0508 .pq-lbl{font-size:26px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;letter-spacing:1px;}
        .pq0508 .pq-card.right .pq-lbl{color:#1a7f43;}
        .pq0508 .pq-balls{display:flex;gap:3px;justify-content:center;margin-top:9px;}
        .pq0508 .pq-ball{position:relative;line-height:0;animation:pqDrop .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0508 .pq-cnt{position:absolute;top:-7px;right:-6px;min-width:15px;height:15px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0508 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0508 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0508 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWave{0%,100%{transform:rotate(0);}25%{transform:rotate(-5deg) scaleX(.94);}50%{transform:rotate(-8deg) scaleX(.9);}75%{transform:rotate(-3deg) scaleX(.97);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqCTw{0%,100%{opacity:.55;transform:scale(1) rotate(0);}50%{opacity:1;transform:scale(1.25) rotate(14deg);}}
        @keyframes pqGlint{0%,76%,100%{opacity:0;transform:scale(.3) rotate(0);}84%{opacity:1;transform:scale(1.25) rotate(80deg);}92%{opacity:0;transform:scale(.4) rotate(150deg);}}
        @keyframes pqAmb{0%,100%{opacity:.25;transform:scale(.8) rotate(0);}50%{opacity:.95;transform:scale(1.12) rotate(16deg);}}
        @keyframes pqStarIn{from{opacity:0;transform:scale(.2) rotate(-40deg);}to{opacity:1;transform:scale(1) rotate(0);}}
        @keyframes pqTwinkle{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-16px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <BallDefs />
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-tentwrap">
          <Tent open={!!ok} />
          <span className="pq-amb" style={{ left: 10, top: 2 }} aria-hidden="true"><Star size={11} /></span>
          <span className="pq-amb amb2" style={{ right: 6, top: 24 }} aria-hidden="true"><Star size={9} /></span>
          {ok && STARS.map((s, i) => (
            <span key={i} className="pq-star" style={{ left: s.l, top: s.t, animationDelay: `${s.d}s, ${0.7 + s.d}s` }}><Star size={s.s} /></span>
          ))}
        </div>
      </div>

      <div className="pq-cards">
        {PAIRS.map((p, i) => {
          const good = p.a + p.b === SUM;
          const sel = pickedSet.has(i);
          const cls = ok ? (good ? ' right' : ' dim') : sel ? ' sel' : '';
          return (
            <div key={i} className="pq-float" style={{ animationDelay: `${-(i * 0.5)}s` }}>
              <button type="button" className={'pq-card' + cls} disabled={lock} onClick={() => toggle(i)}>
                <span className="pq-cstar" style={{ animationDelay: `${-(i * 0.7)}s` }}><Star size={13} /></span>
                <span className="pq-lbl">{p.a} + {p.b}</span>
                {ok && good && (
                  <span className="pq-balls">
                    {Array.from({ length: p.a + p.b }).map((_, k) => (
                      <span key={k} className="pq-ball" style={{ animationDelay: `${k * 0.09}s` }}>
                        <Ball g={k < p.a ? i % 4 : (i + 1) % 4} />
                        <b className="pq-cnt">{k + 1}</b>
                      </span>
                    ))}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
