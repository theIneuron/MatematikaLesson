// Dars06 · Amaliyot 09 — P5 Yashirin qo'shiluvchi (compose_hidden9) · 🔴 · tag: compose_hidden9
// 9 = 6 + ?: kanon sariq avtobus (old tomoni chapda), derazalarda 6 yo'lovchi (3 qizil + 3 yashil),
// o'ngdagi orqa maydoncha eshigi yopiq. G'alabada eshik tabaqalari ochiladi — 3 ko'k-kepkali
// yo'lovchi pqPop bilan ko'rinadi, badge 1..9, chip «6 + 3 = 9». Веди-до-верного: qulflanmaydi.
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

const DATA = { total: 9, shown: 6, target: 3, options: [2, 3, 4, 5], ptype: 'P5', level: '🔴', tag: 'compose_hidden9' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Yo\'lovchilar', title: 'Orqa maydoncha',
    setup: 'Avtobusda jami to\'qqizta yo\'lovchi: oltitasi derazalarda ko\'rinib turibdi, qolganlari orqa maydonchada.',
    ask: 'Orqa maydonchada nechta yo\'lovchi bor?',
    correct: 'Barakalla! Olti va yana uch — to\'qqiz. Eshik ochildi!',
    hint: 'Jami to\'qqizta. Derazadagilarni sanang va to\'qqizgacha nechta yetmasligini o\'ylang.',
  },
  ru: {
    eyebrow: 'Поездка на автобусе · Пассажиры', title: 'Задняя площадка',
    setup: 'В автобусе всего девять пассажиров: шестерых видно в окнах, остальные — на задней площадке.',
    ask: 'Сколько пассажиров на задней площадке?',
    correct: 'Молодец! Шесть и ещё три — девять. Дверь открылась!',
    hint: 'Всего девять пассажиров. Посчитай тех, кто в окнах, и подумай, скольких не хватает до девяти.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Kanon yo'lovchi: dumaloq teri-rang bosh, blikli ikki ko'z, tabassum, rangli kepka
// (yarim-doira + gardish) va yelka-ko'ylak yoyi. Bitta yo'lovchi = bitta bosh.
const RED = { shirt: '#d9534b', line: '#a33630' };
const GREEN = { shirt: '#57a84f', line: '#3a7a35' };
const BLUE = { shirt: '#4f8fc4', line: '#34648c' };
const WIN_X = [66, 128, 190];      // deraza qatorlari (w=56): yuqori y=72, pastki y=118
const BACK_CX = [271, 297, 323];   // orqa maydonchadagi 3 yo'lovchi boshlari

const Passenger = ({ cx, cy, c, blinkDelay }) => (
  <g>
    <path d={`M ${cx - 15} ${cy + 27} Q ${cx} ${cy + 11} ${cx + 15} ${cy + 27} L ${cx + 15} ${cy + 40} L ${cx - 15} ${cy + 40} Z`} fill={c.shirt} stroke={c.line} strokeWidth="1.4" />
    <circle cx={cx} cy={cy} r="12" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.5" />
    <path d={`M ${cx - 11.7} ${cy - 2.5} A 11.7 11.7 0 0 1 ${cx + 11.7} ${cy - 2.5} Z`} fill={c.shirt} stroke={c.line} strokeWidth="1.2" />
    <rect x={cx - 13.4} y={cy - 4.2} width="26.8" height="3.4" rx="1.7" fill={c.line} />
    <circle cx={cx - 4.5} cy={cy + 3} r="1.8" fill="#1f2430" /><circle cx={cx - 3.9} cy={cy + 2.4} r="0.7" fill="#fff" />
    <circle cx={cx + 4.5} cy={cy + 3} r="1.8" fill="#1f2430" /><circle cx={cx + 5.1} cy={cy + 2.4} r="0.7" fill="#fff" />
    <rect className="pq-blink" style={{ animationDelay: blinkDelay }} x={cx - 6.7} y={cy + 0.8} width="13.4" height="4.4" rx="2.1" fill="#f2c096" />
    <path d={`M ${cx - 3.5} ${cy + 7.5} Q ${cx} ${cy + 10} ${cx + 3.5} ${cy + 7.5}`} stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </g>
);

// Sanoq-badge (ko'k pq-cnt): g'alabada 1..9, ketma-ket pop.
const Badge = ({ cx, cy, n, delay }) => (
  <g className="pq-cnt" style={{ animationDelay: delay }}>
    <circle cx={cx} cy={cy} r="8.6" fill="#2563eb" stroke="#fff" strokeWidth="1.6" />
    <text x={cx} y={cy + 3.6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">{n}</text>
  </g>
);

// G'ildirak: to'q shina + kulrang disk + 4 kegay (SEKIN AYLANADI pqWheel).
const Wheel = ({ cx }) => (
  <g>
    <circle cx={cx} cy="204" r="22" fill="#2b2f36" stroke="#14171c" strokeWidth="2" />
    <circle cx={cx} cy="204" r="10.5" fill="#cfd4dc" stroke="#8b919c" strokeWidth="1.6" />
    <g className="pq-spokes">
      <line x1={cx - 8.5} y1="204" x2={cx + 8.5} y2="204" stroke="#8b919c" strokeWidth="2.2" strokeLinecap="round" />
      <line x1={cx} y1="195.5" x2={cx} y2="212.5" stroke="#8b919c" strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <circle cx={cx} cy="204" r="2.6" fill="#6d7480" />
  </g>
);

// Eshik tabaqasi: sariq panel + xira oyna (ichi ko'rinmaydi) + pastki panel.
const DoorLeaf = ({ x }) => (
  <g>
    <rect x={x} y="79" width="40" height="104" rx="3" fill="#eec254" stroke="#a8721a" strokeWidth="1.6" />
    <rect x={x + 4} y="86" width="32" height="46" rx="4" fill="#cfe0ea" stroke="#9fb4c2" strokeWidth="1.4" />
    <path d={`M ${x + 7} 126 L ${x + 31} 92`} stroke="#fff" strokeWidth="3" opacity=".45" />
    <path d={`M ${x + 14} 128 L ${x + 34} 100`} stroke="#fff" strokeWidth="1.6" opacity=".35" />
    <rect x={x + 4} y="140" width="32" height="34" rx="3" fill="#e0b23e" opacity=".55" />
  </g>
);

// Kanon avtobus: yon ko'rinish (old tomoni CHAPDA), tana 2 ton (#f2b134/#d99a1a, kontur
// #a8721a), ochroq tom, old fara + eshik, 2 aylanuvchi g'ildirak, oq-havorang derazalar.
const Bus = ({ ok }) => (
  <svg viewBox="0 0 364 230" width="330" height="209" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      {WIN_X.map((x, i) => (<clipPath key={`t${i}`} id={`pq0609wt${i}`}><rect x={x} y="72" width="56" height="34" rx="8" /></clipPath>))}
      {WIN_X.map((x, i) => (<clipPath key={`b${i}`} id={`pq0609wb${i}`}><rect x={x} y="118" width="56" height="40" rx="8" /></clipPath>))}
      <clipPath id="pq0609door"><rect x="257" y="79" width="80" height="104" rx="4" /></clipPath>
    </defs>

    <rect x="8" y="54" width="340" height="136" rx="20" fill="#f2b134" stroke="#a8721a" strokeWidth="3" />
    <rect x="12" y="158" width="332" height="28" rx="12" fill="#d99a1a" />
    <path d="M 66 190 A 26 26 0 0 1 118 190 Z" fill="#8a5c12" />
    <path d="M 204 190 A 26 26 0 0 1 256 190 Z" fill="#8a5c12" />
    <rect x="18" y="46" width="320" height="14" rx="7" fill="#f8d67f" stroke="#a8721a" strokeWidth="2" />

    {/* Old eshik (chapda) + fara + orqa chiroq + bamper */}
    <rect x="22" y="100" width="32" height="86" rx="5" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
    <line x1="38" y1="102" x2="38" y2="184" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="50" y="140" width="5" height="10" rx="2" fill="#a8721a" opacity=".7" />
    <circle cx="16" cy="170" r="6" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="349" y="164" width="5" height="11" rx="2" fill="#d9534b" stroke="#a33630" strokeWidth="1" />
    <rect x="4" y="188" width="352" height="10" rx="5" fill="#b6bcc6" stroke="#848a96" strokeWidth="1.6" />

    {/* Yuqori qator — 3 qizil yo'lovchi derazalarda */}
    {WIN_X.map((x, i) => (
      <g key={`wt${i}`}>
        <rect x={x} y="72" width="56" height="34" rx="8" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
        <g clipPath={`url(#pq0609wt${i})`}>
          <Passenger cx={x + 28} cy={94} c={RED} blinkDelay={`${-i * 1.1}s`} />
        </g>
      </g>
    ))}

    {/* Pastki qator — 3 yashil yo'lovchi derazalarda */}
    {WIN_X.map((x, i) => (
      <g key={`wb${i}`}>
        <rect x={x} y="118" width="56" height="40" rx="8" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
        <g clipPath={`url(#pq0609wb${i})`}>
          <Passenger cx={x + 28} cy={140} c={GREEN} blinkDelay={`${-0.6 - i * 1.5}s`} />
        </g>
      </g>
    ))}

    {/* Orqa maydoncha (o'ngda): ichki fon + g'alabada 3 ko'k-kepkali yo'lovchi */}
    <rect x="256" y="78" width="82" height="106" rx="6" fill="#f6e7c8" />
    <rect x="256" y="166" width="82" height="18" fill="#dcb271" />
    {ok && (
      <g clipPath="url(#pq0609door)">
        {BACK_CX.map((cx, i) => (
          <g key={i} className="pq-gpass" style={{ animationDelay: `${0.5 + i * 0.18}s` }}>
            <Passenger cx={cx} cy={128} c={BLUE} blinkDelay={`${-0.9 - i * 1.4}s`} />
          </g>
        ))}
      </g>
    )}

    {/* Eshik tabaqalari: yopiq → g'alabada ikki chetga ochiladi */}
    <g className={'pq-rdoor' + (ok ? ' open' : '')} clipPath="url(#pq0609door)">
      <g className="pq-dl"><DoorLeaf x={257} /></g>
      <g className="pq-dr"><DoorLeaf x={297} /></g>
    </g>
    <rect x="254" y="76" width="86" height="110" rx="8" fill="none" stroke="#a8721a" strokeWidth="2.5" />
    {!ok && <text className="pq-q" x="297" y="143" textAnchor="middle" fontSize="30" fontWeight="900" fill="#7c5210">?</text>}

    <Wheel cx={92} />
    <Wheel cx={230} />

    {/* Sanoq-badge'lar: derazadagilar 1-6 (chapdan), maydonchadagilar 7-9 */}
    {ok && WIN_X.map((x, i) => (<Badge key={`bt${i}`} cx={x + 44} cy={81} n={i + 1} delay={`${0.35 + i * 0.15}s`} />))}
    {ok && WIN_X.map((x, i) => (<Badge key={`bb${i}`} cx={x + 44} cy={127} n={4 + i} delay={`${0.35 + (3 + i) * 0.15}s`} />))}
    {ok && BACK_CX.map((cx, i) => (<Badge key={`bp${i}`} cx={cx} cy={96} n={DATA.shown + i + 1} delay={`${1.15 + i * 0.15}s`} />))}
  </svg>
);

export default function D06_09(props) {
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
  const [fitRef, scale] = useFitScale(350);

  return (
    <div className="pq pq0609" ref={fitRef}>
      <style>{`
        .pq0609{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0609 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06e24;text-transform:uppercase;}
        .pq0609 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0609 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0609 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0609 .pq-scene{box-sizing:border-box;position:relative;width:350px;height:256px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f4fe 60%,#eef8f2 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0609 .pq-fit{position:relative;margin:0 auto;}
        .pq0609 .pq-sun{position:absolute;top:12px;right:16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun0609 3.6s ease-in-out infinite;z-index:1;}
        .pq0609 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud0609 linear infinite;z-index:1;}
        .pq0609 .pq-cloud.c1{top:16px;left:-70px;animation-duration:29s;animation-delay:-11s;}
        .pq0609 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-25s;}
        .pq0609 .pq-road{position:absolute;bottom:0;left:0;right:0;height:32px;background:#8f97a3;border-top:2px solid #7b828e;}
        .pq0609 .pq-road::before{content:'';position:absolute;top:14px;left:0;right:0;height:3px;background:repeating-linear-gradient(90deg,#f4d06f 0 20px,transparent 20px 42px);opacity:.8;}
        .pq0609 .pq-buswrap{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:2;}
        .pq0609 .pq-busidle{animation:pqIdle0609 3.2s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(0,0,0,.18));}
        .pq0609 .pq-spokes{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0609 .pq-blink{opacity:0;animation:pqBlink0609 3.8s linear infinite;}
        .pq0609 .pq-dl{transform-box:fill-box;transform-origin:0% 50%;transition:transform .85s cubic-bezier(.55,1.2,.5,1);}
        .pq0609 .pq-dr{transform-box:fill-box;transform-origin:100% 50%;transition:transform .85s cubic-bezier(.55,1.2,.5,1);}
        .pq0609 .pq-rdoor.open .pq-dl{transform:scaleX(.13);}
        .pq0609 .pq-rdoor.open .pq-dr{transform:scaleX(.13);}
        .pq0609 .pq-q{transform-box:fill-box;transform-origin:50% 50%;animation:pqBreath0609 2.4s ease-in-out infinite;}
        .pq0609 .pq-gpass{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0609 .pq-cnt{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .35s ease both;}
        .pq0609 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns0609 .5s cubic-bezier(.3,1.5,.5,1) both;animation-delay:1.5s;z-index:5;white-space:nowrap;}
        .pq0609 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0609 .pq-opt{width:66px;height:66px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0609 .pq-opt:hover:not(:disabled){border-color:#f0d3a0;transform:translateY(-2px);}
        .pq0609 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0609 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0609 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele0609 .5s ease;}
        .pq0609 .pq-opt:disabled{cursor:default;}
        .pq0609 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn0609 .22s ease both;}
        .pq0609 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0609 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqIdle0609{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqSun0609{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud0609{from{transform:translateX(0);}to{transform:translateX(440px);}}
        @keyframes pqBlink0609{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqBreath0609{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.14);opacity:1;}}
        @keyframes pqAns0609{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele0609{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn0609{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 350 * scale, height: 256 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <div className="pq-road" />
        {ok && <span className="pq-chip">{DATA.shown} + {DATA.target} = {DATA.total}</span>}
        <div className="pq-buswrap"><div className="pq-busidle"><Bus ok={!!ok} /></div></div>
      </div>
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
