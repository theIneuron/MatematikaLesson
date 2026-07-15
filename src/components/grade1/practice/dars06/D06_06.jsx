// Dars06 · Amaliyot 06 — P6 Qavatlar zanjiri (8 son uyi, uch qavat birdaniga) · 🔴 · tag: house_chain
// D05_06 zanjir naqshi: vals-state, qator good/bad rang-feedback (pqShake), javob oshkor qilinmaydi.
// AMBIENT: quyosh breath, 2 bulut suzadi, bekat-flag hilpiraydi, 8 chiroqcha to'lqin-bob (±3px),
// pastda kanon-avtobus sekin o'tadi (g'ildirak aylanadi, haydovchi ko'z pirpiratadi), «?» slot breath.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { left: 5, ans: 3, opts: [1, 2, 3, 4] },
  { left: 6, ans: 2, opts: [0, 1, 2, 3] },
  { left: 4, ans: 4, opts: [2, 3, 4, 5] },
  { left: 7, ans: 1, opts: [0, 1, 2, 3] },
];
const DATA = { ptype: 'P6', level: '🔴', tag: 'house_chain' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Bekat', title: 'Qavatlar zanjiri',
    setup: 'Katta bekat uychasining to\'rt qavati bor — har qavatdagi ikki son birga SAKKIZNI beradi.',
    ask: 'Har qavatdagi bo\'sh xonachaga to\'g\'ri sonni tanlang.',
    correct: 'Barakalla! To\'rtala qavat to\'g\'ri — sakkiz uyi mustahkam!',
    hint: 'Qizil qavatlarga qarang: tomda sakkiz — qavatdagi ikki son birga sakkiz bo\'lishi shart.',
  },
  ru: {
    eyebrow: 'Путешествие на автобусе · Остановка', title: 'Цепочка этажей',
    setup: 'У большого домика-остановки четыре этажа — два числа на каждом этаже вместе дают ВОСЕМЬ.',
    ask: 'Выбери верное число для пустого окошка на каждом этаже.',
    correct: 'Молодец! Все четыре этажа верны — дом восьмёрки стоит крепко!',
    hint: 'Посмотри на красные этажи: на крыше восемь — два числа этажа вместе должны дать восемь.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bekat-tom: ko'k cherepitsa ikki ton (#4f8fc4 / #7fb3dc, kontur #33648f), krem karniz,
// markazda oq marshrut-doira ichida «8», tepada sariq bayroqcha (sekin hilpiraydi).
const StationRoof = () => (
  <svg viewBox="0 0 220 74" width="242" height="81" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="110" y1="18" x2="110" y2="5" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round" />
    <path className="pq-flag" d="M110 4 L127 8.5 L110 13 Z" fill="#f2b134" stroke="#c98a12" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M110 16 L18 62 L202 62 Z" fill="#4f8fc4" />
    <path d="M110 16 L58 42 L162 42 Z" fill="#7fb3dc" />
    <path d="M110 16 L79 62 M110 16 L141 62" stroke="#33648f" strokeWidth="1.4" opacity=".35" />
    <path d="M110 16 L18 62 L202 62 Z" fill="none" stroke="#33648f" strokeWidth="2" strokeLinejoin="round" />
    <rect x="10" y="61" width="200" height="9" rx="4" fill="#f6efe2" stroke="#a8721a" strokeWidth="1.6" />
    <circle cx="110" cy="47" r="13" fill="#fff" stroke="#33648f" strokeWidth="2" />
    <text x="110" y="53.5" textAnchor="middle" fontSize="19" fontWeight="900" fill="#33648f" fontFamily="Manrope, sans-serif">8</text>
  </svg>
);

// CHIROQCHA KANONI (koptok-kanon asosida): tepa yog'och qalpoqcha + r~10 doira,
// radial 2-ton, yupqa quyuq kontur, tepa-chap oq blik. Palitra: qizil, ko'k, sariq, yashil.
const LAMP_C = [
  { base: '#d9534b', lite: '#f0918a', line: '#a93a33' },
  { base: '#4f8fc4', lite: '#a8cbe8', line: '#33648f' },
  { base: '#f2b134', lite: '#f8d47a', line: '#c98a12' },
  { base: '#57a84f', lite: '#a9d8a0', line: '#3c7d36' },
];
const GradDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      {LAMP_C.map((c, i) => (
        <radialGradient key={i} id={`pq0606l${i}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c.lite} /><stop offset="70%" stopColor={c.base} />
        </radialGradient>
      ))}
    </defs>
  </svg>
);
const Lamp = ({ k }) => (
  <svg viewBox="0 0 24 30" width="24" height="30" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="9" y="1" width="6" height="5.5" rx="1.6" fill="#8a6a3a" stroke="#6b5129" strokeWidth="1" />
    <circle cx="12" cy="17" r="10" fill={`url(#pq0606l${k % 4})`} stroke={LAMP_C[k % 4].line} strokeWidth="1.6" />
    <ellipse cx="8.4" cy="12.6" rx="2.6" ry="1.7" fill="#fff" opacity=".85" transform="rotate(-28 8.4 12.6)" />
  </svg>
);

// AVTOBUS KANONI (dekorativ, yon ko'rinish, o'ngga yuradi): tana 2 ton #f2b134/#d99a1a,
// kontur #a8721a, ochroq tom, fara + eshik, oq-havorang derazalar, 2 g'ildirak
// (to'q doira + kulrang disk + 4 kegay — pq-wheel sekin aylanadi), haydovchi pirpiratadi.
const Bus = () => (
  <svg viewBox="0 0 120 58" width="104" height="50" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="12" y="6" width="88" height="9" rx="4" fill="#f8d47a" stroke="#a8721a" strokeWidth="1.5" />
    <rect x="4" y="11" width="108" height="33" rx="8" fill="#f2b134" stroke="#a8721a" strokeWidth="2" />
    <rect x="7" y="34" width="102" height="8" rx="3" fill="#d99a1a" />
    <rect x="12" y="17" width="16" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="33" y="17" width="16" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="54" y="17" width="16" height="12" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <rect x="75" y="17" width="13" height="26" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.3" />
    <line x1="81.5" y1="18" x2="81.5" y2="42" stroke="#a8721a" strokeWidth="1.1" />
    <rect x="92" y="16" width="14" height="14" rx="2" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.2" />
    <path d="M94.5 24.5 Q99 17.5 103.5 24.5 L103.5 22.5 Q99 15.5 94.5 22.5 Z" fill="#4f8fc4" stroke="#33648f" strokeWidth=".8" strokeLinejoin="round" />
    <circle cx="99" cy="26" r="4.6" fill="#f2c096" stroke="#c98d5f" strokeWidth="1" />
    <circle cx="97.4" cy="25.4" r="0.95" fill="#1f2430" /><circle cx="97.75" cy="25.05" r="0.35" fill="#fff" />
    <circle cx="100.6" cy="25.4" r="0.95" fill="#1f2430" /><circle cx="100.95" cy="25.05" r="0.35" fill="#fff" />
    <g className="pq-blink" aria-hidden="true">
      <rect x="96.2" y="24.3" width="2.4" height="2.2" rx="1.1" fill="#f2c096" />
      <rect x="99.4" y="24.3" width="2.4" height="2.2" rx="1.1" fill="#f2c096" />
    </g>
    <path d="M97.4 28.6 Q99 29.8 100.6 28.6" stroke="#8a5f3a" strokeWidth=".9" fill="none" strokeLinecap="round" />
    <circle cx="109" cy="38" r="2.7" fill="#fff7cf" stroke="#a8721a" strokeWidth="1.2" />
    <circle cx="30" cy="46" r="8.8" fill="#2b2f36" stroke="#1a1d22" strokeWidth="1" />
    <g className="pq-wheel">
      <circle cx="30" cy="46" r="4.7" fill="#b6bec7" stroke="#7d848d" strokeWidth="1" />
      <path d="M30 41.7 L30 50.3 M25.7 46 L34.3 46" stroke="#5c6672" strokeWidth="1.2" strokeLinecap="round" />
    </g>
    <circle cx="86" cy="46" r="8.8" fill="#2b2f36" stroke="#1a1d22" strokeWidth="1" />
    <g className="pq-wheel">
      <circle cx="86" cy="46" r="4.7" fill="#b6bec7" stroke="#7d848d" strokeWidth="1" />
      <path d="M86 41.7 L86 50.3 M81.7 46 L90.3 46" stroke="#5c6672" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export default function D06_06(props) {
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
    <div className="pq pq0606">
      <style>{`
        .pq0606{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0606 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06e24;text-transform:uppercase;}
        .pq0606 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0606 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0606 .pq-ask{display:block;margin-top:4px;font-size:19px;font-weight:800;}
        .pq0606 .pq-stage{position:relative;display:flex;flex-direction:column;align-items:center;padding:12px 10px 62px;border-radius:22px;background:linear-gradient(#cfe9fb 0%,#e9f5fd 32%,#fdf6ec 60%,#f6ead2 100%);border:2px solid #d5e4ef;overflow:hidden;}
        .pq0606 .pq-sun{position:absolute;top:12px;right:16px;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 16px 4px rgba(249,198,47,.5);animation:pqSun 3.6s ease-in-out infinite;z-index:1;}
        .pq0606 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;z-index:1;}
        .pq0606 .pq-cloud.c1{top:14px;left:-70px;animation-duration:30s;animation-delay:-9s;}
        .pq0606 .pq-cloud.c2{top:40px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-24s;}
        .pq0606 .pq-roofwrap{line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));z-index:2;}
        .pq0606 .pq-flag{transform-box:fill-box;transform-origin:0% 50%;animation:pqFlag 2.2s ease-in-out infinite;}
        .pq0606 .pq-lamps{display:flex;gap:6px;margin:3px 0 10px;z-index:2;}
        .pq0606 .pq-lamp{position:relative;line-height:0;animation:pqBob 2.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0606 .pq-lamp.win{animation:pqBob 2.4s ease-in-out infinite,pqCele .55s ease;}
        .pq0606 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0606 .pq-rows{position:relative;display:grid;grid-template-columns:1fr;width:100%;max-width:360px;align-items:start;gap:8px;z-index:2;}
        @media (min-width:480px){.pq0606 .pq-rows{grid-template-columns:1fr 1fr;max-width:520px;}}
        .pq0606 .pq-rw{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;align-content:center;padding:7px 9px;border-radius:14px;border:2.5px solid #dbe2ea;background:#fff;transition:.15s;animation:pqFloat 4s ease-in-out infinite;}
        .pq0606 .pq-rw:nth-child(1){animation-delay:0s;}
        .pq0606 .pq-rw:nth-child(2){animation-delay:-1.4s;}
        .pq0606 .pq-rw:nth-child(3){animation-delay:-2.7s;}
        .pq0606 .pq-rw:nth-child(4){animation-delay:-3.8s;}
        .pq0606 .pq-rw:nth-child(1) .pq-slot{animation-delay:-.3s;}
        .pq0606 .pq-rw:nth-child(2) .pq-slot{animation-delay:-1.1s;}
        .pq0606 .pq-rw:nth-child(3) .pq-slot{animation-delay:-1.9s;}
        .pq0606 .pq-rw:nth-child(4) .pq-slot{animation-delay:-2.5s;}
        .pq0606 .pq-rw.good{border-color:#1a7f43;background:#e8f7ee;}
        .pq0606 .pq-rw.good.win{animation:pqFloat 4s ease-in-out infinite,pqCele .5s ease;}
        .pq0606 .pq-rw.bad{border-color:#e08a8a;background:#fdf1f1;animation:pqFloat 4s ease-in-out infinite,pqShake .35s ease;}
        .pq0606 .pq-n{width:44px;height:48px;border-radius:10px;background:#f4f6fa;border:2px solid #d9dde5;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;}
        .pq0606 .pq-op{font-size:22px;font-weight:900;color:#33648f;padding:0 1px;flex-shrink:0;}
        .pq0606 .pq-eq8{width:44px;height:48px;border-radius:10px;background:#eaf1f8;border:2px solid #7fa8cf;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#33648f;font-variant-numeric:tabular-nums;flex-shrink:0;}
        .pq0606 .pq-slot{width:44px;height:48px;border-radius:10px;border:2.5px dashed #c3cad6;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#aab3c2;font-variant-numeric:tabular-nums;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0606 .pq-slot.has{border-style:solid;color:#2563eb;border-color:#9db8ea;background:#f2f6fe;animation:none;}
        .pq0606 .pq-rw.good .pq-slot{border-color:#1a7f43;color:#1a7f43;background:#fff;}
        .pq0606 .pq-sgs{display:flex;flex-wrap:wrap;gap:5px;margin-left:4px;flex-basis:100%;justify-content:center;}
        .pq0606 .pq-sg{width:38px;height:38px;border-radius:10px;border:2.5px solid #d6dae3;background:#fff;font-size:17px;font-weight:900;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0606 .pq-sg:hover:not(:disabled){border-color:#e3b878;transform:translateY(-2px);}
        .pq0606 .pq-sg:active:not(:disabled){transform:scale(.92);}
        .pq0606 .pq-sg.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pq0606 .pq-sg:disabled{cursor:default;}
        .pq0606 .pq-road{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#a4adb8,#8f99a5);border-top:2px solid #7d8794;}
        .pq0606 .pq-roadline{position:absolute;left:0;right:0;bottom:11px;height:3px;background:repeating-linear-gradient(90deg,#f4f6fa 0 14px,transparent 14px 32px);opacity:.85;}
        .pq0606 .pq-bus{position:absolute;bottom:3px;left:-150px;animation:pqDrive 17s linear infinite;z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.25));}
        .pq0606 .pq-busbody{animation:pqIdle 1.5s ease-in-out infinite;line-height:0;}
        .pq0606 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 2.8s linear infinite;}
        .pq0606 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0606 .pq-spark{position:absolute;pointer-events:none;opacity:0;animation:pqTwinkle 4.6s ease-in-out infinite;filter:drop-shadow(0 0 2px rgba(242,177,52,.55));}
        .pq0606 .pq-spark.s2{animation-duration:5.4s;animation-delay:-2.6s;}
        .pq0606 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0606 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0606 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(790px);}}
        @keyframes pqFlag{0%,100%{transform:rotate(-5deg);}25%{transform:rotate(4deg) skewY(-3deg) scaleY(.93);}55%{transform:rotate(6deg) scaleY(.96);}80%{transform:rotate(-2deg) skewY(2deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);border-color:#c3cad6;}50%{transform:scale(1.07);border-color:#a9b5c8;}}
        @keyframes pqDrive{from{transform:translateX(0);}to{transform:translateX(880px);}}
        @keyframes pqIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqTwinkle{0%,58%,100%{opacity:0;transform:scale(.3) rotate(0deg);}66%{opacity:1;transform:scale(1) rotate(45deg);}74%{opacity:0;transform:scale(.3) rotate(90deg);}}
        @keyframes pqShake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <GradDefs />
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />

        <div className="pq-roofwrap"><StationRoof /></div>

        {/* 8 bekat-chiroqcha — sanaladigan obyektlar: g'alabada 1..8 badge */}
        <div className="pq-lamps">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={'pq-lamp' + (ok ? ' win' : '')} style={{ animationDelay: ok ? `${i * 0.08}s` : `-${(i * 0.3).toFixed(1)}s` }}>
              <Lamp k={i} />{ok && <b className="pq-cnt">{i + 1}</b>}
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
                <div className="pq-eq8">8</div>
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

        {/* Yo'l + dekorativ kanon-avtobus (sanalmaydi, sekin o'tib turadi) */}
        <span className="pq-road"><span className="pq-roadline" /></span>
        <span className="pq-bus"><span className="pq-busbody"><Bus /></span></span>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
