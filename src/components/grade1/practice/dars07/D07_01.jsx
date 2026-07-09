// Dars07 · Amaliyot 01 — P5 Ramka takrori (Dars06 ikki rangli o'nlik-ramka spirali) · 🟢 · tag: frame_warmup
// Park kirish darvozasi yonidagi taxtada 2×5 ramka: 5 qizil + 3 yashil bola. G'alabada darvoza ochiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { red: 5, green: 3, target: 8, options: [7, 8, 9], ptype: 'P5', level: '🟢', tag: 'frame_warmup' };
const T = {
  uz: {
    eyebrow: "O'yin maydonchasi · Kirish", title: "Ramka takrori",
    setup: "Bolalar parkka kelishdi! Darvoza taxtasida bugungi mehmonlar ramkasi turibdi: birinchi qator to'la qizil, ikkinchisida yashillar.",
    ask: "Ramkada jami nechta bola belgilangan?",
    correct: "Barakalla! To'liq beshlik va yana uch — sakkiz. Darvoza ochildi!",
    hint: "Avval to'liq qizil beshlikni oling, keyin yashillarni qo'shib sanang.",
  },
  ru: {
    eyebrow: "Игровая площадка · Вход", title: "Повторение рамки",
    setup: "Дети пришли в парк! На доске у ворот — рамка сегодняшних гостей: первый ряд полностью красный, во втором — зелёные.",
    ask: "Сколько всего детей отмечено в рамке?",
    correct: "Молодец! Полная пятёрка и ещё три — восемь. Ворота открылись!",
    hint: "Сначала возьми полную красную пятёрку, потом присчитай зелёных.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
// Bola kanoni: teri-rang dumaloq bosh + soch yarim-doira + blikli pirpiratuvchi ko'zlar +
// tabassum + futbolka (yumaloq to'rtburchak) + kalta oyoqchalar. Bitta bola = bitta figura.
const RED = { shirt: '#d9534b', line: '#a33630' };
const GREEN = { shirt: '#57a84f', line: '#3a7a35' };
const HAIR = ['#6b4a2f', '#8a5f3a', '#54381f'];

const Kid = ({ c, d }) => (
  <svg viewBox="0 0 34 44" width="30" height="40" aria-hidden="true" style={{ display: 'block', '--bd': `${-(d * 0.55)}s` }}>
    <line x1="13.5" y1="34" x2="13.5" y2="41.5" stroke="#5b6472" strokeWidth="3.4" strokeLinecap="round" />
    <line x1="20.5" y1="34" x2="20.5" y2="41.5" stroke="#5b6472" strokeWidth="3.4" strokeLinecap="round" />
    <rect x="7" y="21" width="20" height="15.5" rx="6" fill={c.shirt} stroke={c.line} strokeWidth="1.4" />
    <circle cx="17" cy="11.5" r="9" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.4" />
    <path d="M8.1 10.2 A9 9 0 0 1 25.9 10.2 Z" fill={HAIR[d % 3]} />
    <circle cx="13.6" cy="13" r="1.35" fill="#1f2430" /><circle cx="14.1" cy="12.5" r="0.5" fill="#fff" />
    <circle cx="20.4" cy="13" r="1.35" fill="#1f2430" /><circle cx="20.9" cy="12.5" r="0.5" fill="#fff" />
    <g className="pq-blink"><rect x="11.9" y="11.4" width="3.5" height="3" rx="1.4" fill={SKIN} /><rect x="18.7" y="11.4" width="3.5" height="3" rx="1.4" fill={SKIN} /></g>
    <path d="M14 16.6 Q17 18.8 20 16.6" stroke="#8a5f3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

// Yog'och ark-darvoza: ikki ustun + gumbaz-to'sin + tepada hilpiraydigan bayroqcha.
const Gate = () => (
  <svg viewBox="0 0 96 176" width="96" height="176" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="48" y1="28" x2="48" y2="5" stroke="#7c4f24" strokeWidth="2.6" strokeLinecap="round" />
    <path className="pq-flag" d="M49 4.5 L71 10 L49 15.5 Z" fill="#d9534b" stroke="#a33630" strokeWidth="1" strokeLinejoin="round" />
    <rect x="8" y="40" width="11" height="132" rx="2.5" fill="#a3703f" stroke="#7c4f24" strokeWidth="1.6" />
    <rect x="77" y="40" width="11" height="132" rx="2.5" fill="#a3703f" stroke="#7c4f24" strokeWidth="1.6" />
    <path d="M11.5 55 L11.5 160 M84.5 55 L84.5 160" stroke="#7c4f24" strokeWidth="1.2" opacity=".3" />
    <rect x="2" y="26" width="92" height="17" rx="8.5" fill="#b98a55" stroke="#7c4f24" strokeWidth="1.8" />
    <path d="M10 34.5 q19 -3.5 38 0 q19 3.5 38 0" stroke="#7c4f24" strokeWidth="1.2" fill="none" opacity=".35" />
  </svg>
);

// Arg'imchoq: A-ramka + zanjirda osilgan o'rindiq (sekin tebranadi — .pq-sw).
const Swing = () => (
  <svg viewBox="0 0 66 108" width="66" height="108" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="10" y1="10" x2="4" y2="104" stroke="#a3703f" strokeWidth="5" strokeLinecap="round" />
    <line x1="10" y1="10" x2="18" y2="104" stroke="#8a6543" strokeWidth="5" strokeLinecap="round" />
    <line x1="56" y1="10" x2="48" y2="104" stroke="#8a6543" strokeWidth="5" strokeLinecap="round" />
    <line x1="56" y1="10" x2="62" y2="104" stroke="#a3703f" strokeWidth="5" strokeLinecap="round" />
    <line x1="6" y1="10" x2="60" y2="10" stroke="#7c4f24" strokeWidth="5" strokeLinecap="round" />
    <g className="pq-sw">
      <line x1="26" y1="12" x2="26" y2="64" stroke="#9aa4b2" strokeWidth="2" strokeDasharray="3 2.5" />
      <line x1="40" y1="12" x2="40" y2="64" stroke="#9aa4b2" strokeWidth="2" strokeDasharray="3 2.5" />
      <rect x="19" y="63" width="28" height="7" rx="3" fill="#d9534b" stroke="#a33630" strokeWidth="1.4" />
    </g>
  </svg>
);

export default function D07_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
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
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0701">
      <style>{`
        .pq0701{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0701 *,.pq0701 *::before,.pq0701 *::after{box-sizing:border-box;}
        .pq0701 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a8f4d;text-transform:uppercase;}
        .pq0701 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0701 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0701 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0701 .pq-scene{position:relative;width:388px;height:252px;margin:0 auto;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 58%,#eef9ea 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0701 .pq-sun{position:absolute;top:10px;right:12px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0701 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0701 .pq-cloud.c1{top:16px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0701 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-25s;}
        .pq0701 .pq-tt{position:absolute;border-radius:50%;}
        .pq0701 .pq-tt.t1{left:322px;top:76px;width:46px;height:46px;background:#5cae54;}
        .pq0701 .pq-tt.t2{left:348px;top:90px;width:38px;height:38px;background:#4f9a48;}
        .pq0701 .pq-tt.t3{left:334px;top:66px;width:26px;height:26px;background:#68bd60;}
        .pq0701 .pq-fence{position:absolute;left:0;right:0;top:122px;height:40px;background:repeating-linear-gradient(90deg,#e2d3b0 0 9px,rgba(0,0,0,0) 9px 16px);}
        .pq0701 .pq-fence::before,.pq0701 .pq-fence::after{content:'';position:absolute;left:0;right:0;height:5px;background:#d3c096;border-radius:2px;}
        .pq0701 .pq-fence::before{top:7px;} .pq0701 .pq-fence::after{top:25px;}
        .pq0701 .pq-grass{position:absolute;left:0;right:0;top:158px;bottom:0;background:linear-gradient(#bfe0a8,#a8d18f);}
        .pq0701 .pq-flora{position:absolute;left:0;right:0;bottom:0;pointer-events:none;}
        .pq0701 .pq-gate{position:absolute;left:4px;top:44px;width:96px;height:176px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0701 .pq-openpath{position:absolute;left:16px;top:100px;width:64px;height:72px;background:linear-gradient(#cde9b4 0 14px,#e8dcc0 14px);border-radius:3px;}
        .pq0701 .pq-gate svg{position:absolute;left:0;top:0;}
        .pq0701 .pq-flag{transform-box:fill-box;transform-origin:0% 50%;animation:pqFlag 1.15s ease-in-out infinite;}
        .pq0701 .pq-door{position:absolute;top:98px;width:29px;height:74px;background:repeating-linear-gradient(90deg,#c99a63 0 7px,#b9854c 7px 10px);border:2px solid #7c4f24;border-radius:3px;}
        .pq0701 .pq-door::after{content:'';position:absolute;left:1px;right:1px;top:30px;height:5px;background:#a3703f;border-radius:2px;}
        .pq0701 .pq-door.dl{left:19px;transform-origin:left center;}
        .pq0701 .pq-door.dr{left:48px;transform-origin:right center;}
        .pq0701 .pq-door.dl::before{content:'';position:absolute;right:4px;top:35px;width:5px;height:5px;border-radius:50%;background:#5f3a17;z-index:1;}
        .pq0701 .pq-door.dr::before{content:'';position:absolute;left:4px;top:35px;width:5px;height:5px;border-radius:50%;background:#5f3a17;z-index:1;}
        .pq0701 .pq-door.dl.open{animation:pqDoorL 1s ease .15s forwards;}
        .pq0701 .pq-door.dr.open{animation:pqDoorR 1s ease .15s forwards;}
        .pq0701 .pq-swing{position:absolute;left:318px;top:112px;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0701 .pq-sw{transform-box:fill-box;transform-origin:50% 0;animation:pqSwing 3.4s ease-in-out infinite alternate;}
        .pq0701 .pq-board{position:absolute;left:98px;top:56px;width:218px;padding:8px;background:#fdf9ee;border:5px solid #b98a55;border-radius:12px;box-shadow:0 0 0 2px #8a6543,0 3px 8px rgba(0,0,0,.16);z-index:3;}
        .pq0701 .pq-board::before,.pq0701 .pq-board::after{content:'';position:absolute;top:100%;width:9px;height:32px;background:#a3703f;border:2px solid #7c4f24;border-radius:0 0 3px 3px;}
        .pq0701 .pq-board::before{left:24px;} .pq0701 .pq-board::after{right:24px;}
        .pq0701 .pq-q{position:absolute;top:-13px;right:-11px;width:28px;height:28px;border-radius:50%;background:#fff;border:2.5px solid #f2b134;color:#b97c14;font-size:17px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.15);animation:pqQ 2s ease-in-out infinite;z-index:4;}
        .pq0701 .pq-grid{display:flex;flex-direction:column;gap:3px;}
        .pq0701 .pq-grid.win{animation:pqCele .5s ease;}
        .pq0701 .pq-row{display:flex;gap:3px;justify-content:center;}
        .pq0701 .pq-cell{position:relative;width:36px;height:46px;border-radius:8px;border:2px solid rgba(0,0,0,0);display:flex;align-items:flex-end;justify-content:center;padding-bottom:1px;}
        .pq0701 .pq-row.r1 .pq-cell.full{background:#fdf0ef;border-color:#e0968f;}
        .pq0701 .pq-row.r2 .pq-cell.full{background:#f1f9ef;border-color:#8fc489;}
        .pq0701 .pq-cell.empty{border:2px dashed #c9cfda;background:#fff;}
        .pq0701 .pq-kid{display:block;line-height:0;animation:pqKidBob 2.9s ease-in-out infinite;}
        .pq0701 .pq-kidin{display:block;line-height:0;animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0701 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0701 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0701 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0701 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq0701 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.13s;}
        .pq0701 .pq-opt:hover:not(:disabled){border-color:#9fcaa8;transform:translateY(-2px);}
        .pq0701 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0701 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0701 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0701 .pq-opt:disabled{cursor:default;}
        .pq0701 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0701 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0701 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(480px);}}
        @keyframes pqFlag{0%,100%{transform:skewY(0deg);}30%{transform:skewY(5deg) scaleX(.95);}70%{transform:skewY(-4deg);}}
        @keyframes pqSwing{from{transform:rotate(-7deg);}to{transform:rotate(7deg);}}
        @keyframes pqQ{0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes pqKidBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.5px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-30px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqDoorL{to{transform:perspective(260px) rotateY(-78deg);}}
        @keyframes pqDoorR{to{transform:perspective(260px) rotateY(78deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-tt t1" /><span className="pq-tt t2" /><span className="pq-tt t3" />
        <span className="pq-fence" />
        <span className="pq-grass" />
        <svg className="pq-flora" viewBox="0 0 388 34" width="388" height="34" aria-hidden="true">
          <path d="M14 32 q3 -9 5 -1 M24 33 q3 -10 6 -1 M368 32 q3 -9 5 -1 M378 33 q3 -10 6 -1 M196 33 q3 -9 5 -1" stroke="#7fb96e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <g><line x1="120" y1="33" x2="120" y2="22" stroke="#6da75c" strokeWidth="2" /><circle cx="120" cy="19" r="3.4" fill="#f2b134" /><circle cx="120" cy="19" r="1.4" fill="#b97c14" /></g>
          <g><line x1="300" y1="33" x2="300" y2="23" stroke="#6da75c" strokeWidth="2" /><circle cx="300" cy="20" r="3.4" fill="#e88bb1" /><circle cx="300" cy="20" r="1.4" fill="#b1487a" /></g>
        </svg>

        <div className="pq-gate">
          <span className="pq-openpath" />
          <span className={'pq-door dl' + (ok ? ' open' : '')} />
          <span className={'pq-door dr' + (ok ? ' open' : '')} />
          <Gate />
        </div>

        <div className="pq-swing"><Swing /></div>

        <div className="pq-board">
          {!ok && <span className="pq-q">?</span>}
          <div className={'pq-grid' + (ok ? ' win' : '')}>
            <div className="pq-row r1">
              {Array.from({ length: DATA.red }).map((_, i) => (
                <div key={i} className="pq-cell full">
                  <span className="pq-kid" style={{ animationDelay: `${-(i * 0.37)}s` }}>
                    <span className="pq-kidin" style={{ animationDelay: `${i * 0.08}s` }}><Kid c={RED} d={i} /></span>
                  </span>
                  {ok && <b className="pq-cnt">{i + 1}</b>}
                </div>
              ))}
            </div>
            <div className="pq-row r2">
              {Array.from({ length: DATA.red }).map((_, i) => {
                const full = i < DATA.green;
                return (
                  <div key={i} className={'pq-cell ' + (full ? 'full' : 'empty')}>
                    {full && (
                      <>
                        <span className="pq-kid" style={{ animationDelay: `${-((DATA.red + i) * 0.37)}s` }}>
                          <span className="pq-kidin" style={{ animationDelay: `${(DATA.red + i) * 0.08}s` }}><Kid c={GREEN} d={DATA.red + i} /></span>
                        </span>
                        {ok && <b className="pq-cnt">{DATA.red + i + 1}</b>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {ok && <span className="pq-chip">{DATA.red} + {DATA.green} = {DATA.target}</span>}
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
