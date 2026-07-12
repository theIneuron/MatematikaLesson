// Dars05 · Amaliyot 06 — P6 Qavatlar zanjiri (5 son uyi) · 🔴 · tag: house_chain
// Chodir-tom «5» + uch qavat [son][?] birdaniga: qator-rang feedback (good/bad, pqShake),
// to'g'ri son hech qachon aytilmaydi; g'alabada uchala qavat yashil to'ladi, 5 koptok 1..5 badge bilan sanaladi.
// AMBIENT-QATLAM: bayroq uzluksiz hilpiraydi; 5 koptok manfiy-delay bilan to'lqinsimon bob (±3px,
// sanashga xalaqit bermaydi); qavat-kartalar yengil float (stagger); «?» slot breath-pulse;
// qatorlar yonidagi 2 yulduzcha ora-sira twinkle. G'alabada cele'dan keyin bob/float qaytadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { left: 1, ans: 4, opts: [2, 3, 4, 5] },
  { left: 2, ans: 3, opts: [1, 2, 3, 4] },
  { left: 4, ans: 1, opts: [0, 1, 2, 3] },
  { left: 3, ans: 2, opts: [1, 2, 3, 4] },
];
const DATA = { ptype: 'P6', level: '🔴', tag: 'house_chain' };
const T = {
  uz: {
    eyebrow: 'Sirk · Chodir', title: 'Qavatlar zanjiri',
    setup: 'Chodirning har qavatida ikki son qo\'shilib 5 bo\'ladi.',
    ask: 'Bo\'sh katakka to\'g\'ri sonni tanlang.',
    correct: 'Barakalla! To\'rtala qavat to\'g\'ri to\'ldirildi — chodir mustahkam!',
    hint: 'Qizil qavatlarga qarang. Birinchi songa qo\'shganda 5 chiqsin.',
  },
  ru: {
    eyebrow: 'Цирк · Шатёр', title: 'Цепочка этажей',
    setup: 'На каждом этаже шатра два числа вместе дают 5.',
    ask: 'Выбери верное число для пустой клетки.',
    correct: 'Молодец! Все четыре этажа заполнены верно — шатёр стоит крепко!',
    hint: 'Посмотри на красные этажи. С первым числом в сумме должно получиться 5.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan sirk chodir-tomi (sodda versiya): krem asos, 3 qizil xiyol-klin,
// pastda 6 ta scallop-osma, tepada sariq bayroqcha (sekin hilpiraydi),
// markazda oq doira ichida «5». Qizil oila: #d9534b / kontur #a93a33 / krem #f6efe2.
const TentRoof = () => (
  <svg viewBox="0 0 220 70" width="242" height="77" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="110" y1="18" x2="110" y2="5" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <path className="pq-flag" d="M110 4 L127 8.5 L110 13 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M110 18 L14 60 q16 10 32 0 q16 10 32 0 q16 10 32 0 q16 10 32 0 q16 10 32 0 q16 10 32 0 Z" fill="#f6efe2" />
    <path d="M110 18 L14 60 q16 10 32 0 Z" fill="#d9534b" />
    <path d="M110 18 L78 60 q16 10 32 0 Z" fill="#d9534b" />
    <path d="M110 18 L142 60 q16 10 32 0 Z" fill="#d9534b" />
    <path d="M110 18 L14 60 q16 10 32 0 q16 10 32 0 q16 10 32 0 q16 10 32 0 q16 10 32 0 q16 10 32 0 Z" fill="none" stroke="#a93a33" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="110" cy="46" r="13" fill="#fff" stroke="#a93a33" strokeWidth="2" />
    <text x="110" y="52.5" textAnchor="middle" fontSize="19" fontWeight="900" fill="#a93a33" fontFamily="Manrope, sans-serif">5</text>
  </svg>
);

// KOPTOK KANONI: r~10 doira, radial 2-ton (asos + ochroq tepa-chap), yupqa quyuq
// kontur, tepa-chapda oq blik-ellipse. Palitra ketma-ket: qizil, ko'k, sariq, yashil, qizil.
const BALLS = [
  { base: '#d9534b', lite: '#f0918a', line: '#a93a33' },
  { base: '#4f8fc4', lite: '#a8cbe8', line: '#33648f' },
  { base: '#f2b134', lite: '#f8d47a', line: '#c98a12' },
  { base: '#57a84f', lite: '#a9d8a0', line: '#3c7d36' },
  { base: '#d9534b', lite: '#f0918a', line: '#a93a33' },
];
const Ball = ({ c, gid }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={gid} cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor={c.lite} />
        <stop offset="70%" stopColor={c.base} />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill={`url(#${gid})`} stroke={c.line} strokeWidth="1.6" />
    <ellipse cx="8.4" cy="7.6" rx="2.6" ry="1.7" fill="#fff" opacity=".85" transform="rotate(-28 8.4 7.6)" />
  </svg>
);

export default function D05_06(props) {
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
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(Object.keys(vals).length === N && !checked); }, [vals, checked, onReady, N]);

  const rowRight = (i) => vals[i] === ROWS[i].ans;
  const check = useCallback(() => {
    if (Object.keys(vals).length !== N) return;
    const correct = ROWS.every((_, i) => rowRight(i));
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => r.opts.join('/')), studentAnswer: { vals }, correctAnswer: { vals: ROWS.map((r) => r.ans) }, correct, meta: { ...DATA } });
  }, [vals, playCorrect, playWrong, onSubmit, t]); // eslint-disable-line
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0506">
      <style>{`
        .pq0506{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0506 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c0392b;text-transform:uppercase;}
        .pq0506 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0506 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0506 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0506 .pq-stage{display:flex;flex-direction:column;align-items:center;padding:14px 10px 16px;border-radius:22px;background:linear-gradient(#fdf6ec,#faeeda);border:2px solid #f0e2cb;}
        .pq0506 .pq-roofwrap{line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0506 .pq-flag{transform-box:fill-box;transform-origin:0% 50%;animation:pqFlag 2.2s ease-in-out infinite;}
        .pq0506 .pq-balls{display:flex;gap:7px;margin:4px 0 10px;}
        .pq0506 .pq-ball{position:relative;line-height:0;animation:pqBob 2.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0506 .pq-ball.win{animation:pqBob 2.4s ease-in-out infinite,pqCele .55s ease;}
        .pq0506 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0506 .pq-rows{position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:8px;}
        .pq0506 .pq-rw{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;align-content:center;padding:7px 9px;border-radius:14px;border:2.5px solid #e3d9c8;background:#fff;transition:.15s;animation:pqFloat 4s ease-in-out infinite;}
        .pq0506 .pq-rw:nth-child(1){animation-delay:0s;}
        .pq0506 .pq-rw:nth-child(2){animation-delay:-1.4s;}
        .pq0506 .pq-rw:nth-child(3){animation-delay:-2.7s;}
        .pq0506 .pq-rw:nth-child(4){animation-delay:-3.8s;}
        .pq0506 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq0506 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq0506 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq0506 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.5s;}
        .pq0506 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq0506 .pq-rw.good.win{animation:pqFloat 4s ease-in-out infinite,pqCele .5s ease;}
        .pq0506 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqFloat 4s ease-in-out infinite,pqShake .35s ease;}
        .pq0506 .pq-n{width:44px;height:48px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;}
        .pq0506 .pq-op{font-size:22px;font-weight:900;color:#c0392b;padding:0 1px;flex-shrink:0;}
        .pq0506 .pq-eq5{width:42px;height:48px;border-radius:10px;background:#fff4e2;border:2px solid #e6b877;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#c0392b;font-variant-numeric:tabular-nums;flex-shrink:0;}
        .pq0506 .pq-slot{width:44px;height:48px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0506 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq0506 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq0506 .pq-sgs{display:flex;gap:5px;margin-left:4px;flex-basis:100%;justify-content:center;}
        .pq0506 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0506 .pq-sg:hover:not(:disabled){border-color:#e0a8a2;transform:translateY(-2px);}
        .pq0506 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq0506 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0506 .pq-sg:disabled{cursor:default;}
        .pq0506 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0506 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0506 .pq-fb.no{background:#fdecec;color:#c0392b;}
        .pq0506 .pq-spark{position:absolute;pointer-events:none;opacity:0;animation:pqTwinkle 4.6s ease-in-out infinite;filter:drop-shadow(0 0 2px rgba(242,177,52,.55));}
        .pq0506 .pq-spark.s2{animation-duration:5.4s;animation-delay:-2.6s;}
        @keyframes pqFlag{0%,100%{transform:rotate(-5deg);}25%{transform:rotate(4deg) skewY(-3deg) scaleY(.93);}55%{transform:rotate(6deg) scaleY(.96);}80%{transform:rotate(-2deg) skewY(2deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pqTwinkle{0%,58%,100%{opacity:0;transform:scale(.3) rotate(0deg);}66%{opacity:1;transform:scale(1) rotate(45deg);}74%{opacity:0;transform:scale(.3) rotate(90deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-roofwrap"><TentRoof /></div>
        <div className="pq-balls">
          {BALLS.map((c, i) => (
            <span key={i} className={'pq-ball' + (ok ? ' win' : '')} style={{ animationDelay: ok ? `${i * 0.1}s` : `-${(i * 0.3).toFixed(1)}s` }}>
              <Ball c={c} gid={`pq0506b${i}`} />{ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          ))}
        </div>
        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const cls = feedback ? (rowRight(i) ? ' good' + (ok ? ' win' : '') : ' bad') : '';
            return (
              <div key={i} className={'pq-rw' + cls}>
                <div className="pq-n">{r.left}</div>
                <span className="pq-op">+</span>
                <div className={'pq-slot' + (vals[i] != null ? ' has' : '')}>{vals[i] != null ? vals[i] : '?'}</div>
                <span className="pq-op">=</span>
                <div className="pq-eq5">5</div>
                <div className="pq-sgs">
                  {r.opts.map((n) => (
                    <button key={n} type="button" className={'pq-sg' + (vals[i] === n ? ' sel' : '')} disabled={lock}
                      onClick={() => { setVals((prev) => ({ ...prev, [i]: n })); setFeedback(null); }}>{n}</button>
                  ))}
                </div>
              </div>
            );
          })}
          <svg className="pq-spark" style={{ left: '-17px', top: '31%' }} width="13" height="13" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#f2b134" /></svg>
          <svg className="pq-spark s2" style={{ right: '-18px', top: '63%' }} width="11" height="11" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 L12.4 7.6 L18.5 10 L12.4 12.4 L10 18.5 L7.6 12.4 L1.5 10 L7.6 7.6 Z" fill="#e59a2f" /></svg>
        </div>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
