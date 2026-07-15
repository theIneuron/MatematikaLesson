// Dars06 · Amaliyot 02 — P5 Yashirin qo'shiluvchi (compose_hidden) · 🟡 · tag: compose_hidden
// 6 = 4 + ?: kanon sariq avtobus, old qatorda 4 qizil yo'lovchi ko'rinadi, orqa qator
// derazalari parda bilan yopiq. G'alabada pardalar ochiladi — 2 yashil yo'lovchi pqPop,
// badge 1..6, chip «4 + 2 = 6». Веди-до-верного: noto'g'rida qulflanmaydi.
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

const DATA = { total: 6, shown: 4, target: 2, options: [1, 2, 3], ptype: 'P5', level: '🟡', tag: 'compose_hidden' };
const T = {
  uz: {
    eyebrow: 'Avtobus sayohati · Yo\'lovchilar', title: 'Yashiringan yo\'lovchilar',
    setup: 'Avtobusda jami oltita yo\'lovchi bor. Old qatorda to\'rtta qizil kepkali bola ko\'rinib turibdi, yashil kepkalilar esa orqa qatorda yashiringan.',
    ask: 'Orqa qatorda nechta yashil kepkali yo\'lovchi bor?',
    correct: 'Barakalla! To\'rt va yana ikki — olti. Pardalar ochildi!',
    hint: 'Jami oltita yo\'lovchi. Old qatordagilarni sanang va yetmaganini o\'ylang.',
  },
  ru: {
    eyebrow: 'Поездка на автобусе · Пассажиры', title: 'Спрятанные пассажиры',
    setup: 'В автобусе всего шесть пассажиров. В переднем ряду видно четверых ребят в красных кепках, а пассажиры в зелёных кепках спрятались в заднем ряду.',
    ask: 'Сколько пассажиров в зелёных кепках в заднем ряду?',
    correct: 'Молодец! Четыре и ещё два — шесть. Шторки открылись!',
    hint: 'Всего шесть пассажиров. Посчитай тех, кто в переднем ряду, и подумай, скольких не хватает.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Kanon yo'lovchi: dumaloq teri-rang bosh, blikli ikki ko'z, tabassum, rangli kepka
// (yarim-doira + gardish) va yelka-ko'ylak yoyi. Bitta yo'lovchi = bitta bosh.
const RED = { shirt: '#d9534b', line: '#a33630' };
const GREEN = { shirt: '#57a84f', line: '#3a7a35' };
const FRONT_X = [36, 104, 172, 240]; // old qator derazalari (w=56, y=118)
const BACK_X = [88, 178];            // orqa qator derazalari (w=66, y=72)

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

// Sanoq-badge (ko'k pq-cnt): g'alabada 1..6, ketma-ket pop.
const Badge = ({ cx, cy, n, delay }) => (
  <g className="pq-cnt" style={{ animationDelay: delay }}>
    <circle cx={cx} cy={cy} r="8.6" fill="#2563eb" stroke="#fff" strokeWidth="1.6" />
    <text x={cx} y={cy + 3.6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">{n}</text>
  </g>
);

// Parda: ikki pleat-panel, sway; open holatda ikki chetga yig'iladi.
const Curtain = ({ x, open, sway }) => (
  <g className={'pq-curt' + (open ? ' open' : '')}>
    <g className="pq-csway" style={{ animationDelay: sway }}>
      <g className="pq-cl">
        <rect x={x - 1} y="72" width="35" height="34" rx="2" fill="#e08bab" stroke="#b95f7d" strokeWidth="1.4" />
        <path d={`M ${x + 7} 74 L ${x + 7} 104 M ${x + 15} 74 L ${x + 15} 104 M ${x + 23} 74 L ${x + 23} 104`} stroke="#c06a8c" strokeWidth="1.6" opacity=".7" />
      </g>
      <g className="pq-cr">
        <rect x={x + 32} y="72" width="35" height="34" rx="2" fill="#e08bab" stroke="#b95f7d" strokeWidth="1.4" />
        <path d={`M ${x + 41} 74 L ${x + 41} 104 M ${x + 49} 74 L ${x + 49} 104 M ${x + 57} 74 L ${x + 57} 104`} stroke="#c06a8c" strokeWidth="1.6" opacity=".7" />
      </g>
    </g>
    <rect x={x - 4} y="68.4" width="74" height="3.6" rx="1.8" fill="#8a5f28" />
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

// Kanon avtobus: yon ko'rinish, tana 2 ton, ochroq tom, old fara + eshik, 2 g'ildirak.
const Bus = ({ ok }) => (
  <svg viewBox="0 0 364 230" width="330" height="209" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      {FRONT_X.map((x, i) => (<clipPath key={i} id={`pq0602cf${i}`}><rect x={x} y="118" width="56" height="40" rx="8" /></clipPath>))}
      {BACK_X.map((x, i) => (<clipPath key={i} id={`pq0602cb${i}`}><rect x={x} y="72" width="66" height="34" rx="8" /></clipPath>))}
    </defs>

    <rect x="8" y="54" width="340" height="136" rx="20" fill="#f2b134" stroke="#a8721a" strokeWidth="3" />
    <rect x="12" y="158" width="332" height="28" rx="12" fill="#d99a1a" />
    <path d="M 58 190 A 26 26 0 0 1 110 190 Z" fill="#8a5c12" />
    <path d="M 246 190 A 26 26 0 0 1 298 190 Z" fill="#8a5c12" />
    <rect x="18" y="46" width="320" height="14" rx="7" fill="#f8d67f" stroke="#a8721a" strokeWidth="2" />

    {/* Orqa qator (yuqori) — pardali derazalar; g'alabada yashil yo'lovchilar ochiladi */}
    {BACK_X.map((x, i) => (
      <g key={i}>
        <rect x={x} y="72" width="66" height="34" rx="8" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
        {ok && (
          <g clipPath={`url(#pq0602cb${i})`}>
            <g className="pq-gpass" style={{ animationDelay: `${0.45 + i * 0.18}s` }}>
              <Passenger cx={x + 33} cy={94} c={GREEN} blinkDelay={`${-1.3 - i * 1.7}s`} />
            </g>
          </g>
        )}
        <Curtain x={x} open={ok} sway={`${-i * 1.6}s`} />
        {!ok && (
          <text className="pq-q" style={{ animationDelay: `${-i * 1.1}s` }} x={x + 33} y="97" textAnchor="middle" fontSize="21" fontWeight="900" fill="#7c3a52">?</text>
        )}
      </g>
    ))}

    {/* Old qator (pastki) — 4 qizil yo'lovchi ko'rinib turibdi */}
    {FRONT_X.map((x, i) => (
      <g key={i}>
        <rect x={x} y="118" width="56" height="40" rx="8" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
        <g clipPath={`url(#pq0602cf${i})`}>
          <Passenger cx={x + 28} cy={140} c={RED} blinkDelay={`${-i * 0.9}s`} />
        </g>
      </g>
    ))}

    {/* Eshik (oldda) + fara + orqa chiroq + bamper */}
    <rect x="306" y="100" width="32" height="86" rx="5" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
    <line x1="322" y1="102" x2="322" y2="184" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="309" y="140" width="5" height="10" rx="2" fill="#a8721a" opacity=".7" />
    <circle cx="340" cy="170" r="6" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.6" />
    <rect x="10" y="164" width="5" height="11" rx="2" fill="#d9534b" stroke="#a33630" strokeWidth="1" />
    <rect x="4" y="188" width="352" height="10" rx="5" fill="#b6bcc6" stroke="#848a96" strokeWidth="1.6" />

    <Wheel cx={84} />
    <Wheel cx={272} />

    {/* Sanoq-badge'lar: qizillar 1-4, yashillar 5-6 */}
    {ok && FRONT_X.map((x, i) => (<Badge key={i} cx={x + 39} cy={129} n={i + 1} delay={`${0.5 + i * 0.15}s`} />))}
    {ok && BACK_X.map((x, i) => (<Badge key={i} cx={x + 44} cy={83} n={DATA.shown + i + 1} delay={`${0.5 + (DATA.shown + i) * 0.15}s`} />))}
  </svg>
);

export default function D06_02(props) {
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
    <div className="pq pq0602" ref={fitRef}>
      <style>{`
        .pq0602{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0602 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06e24;text-transform:uppercase;}
        .pq0602 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0602 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0602 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0602 .pq-scene{box-sizing:border-box;position:relative;width:350px;height:256px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f4fe 60%,#eef8f2 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0602 .pq-fit{position:relative;margin:0 auto;}
        .pq0602 .pq-sun{position:absolute;top:12px;right:16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun06 3.6s ease-in-out infinite;z-index:1;}
        .pq0602 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud06 linear infinite;z-index:1;}
        .pq0602 .pq-cloud.c1{top:16px;left:-70px;animation-duration:28s;animation-delay:-9s;}
        .pq0602 .pq-cloud.c2{top:42px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-24s;}
        .pq0602 .pq-road{position:absolute;bottom:0;left:0;right:0;height:32px;background:#8f97a3;border-top:2px solid #7b828e;}
        .pq0602 .pq-road::before{content:'';position:absolute;top:14px;left:0;right:0;height:3px;background:repeating-linear-gradient(90deg,#f4d06f 0 20px,transparent 20px 42px);opacity:.8;}
        .pq0602 .pq-buswrap{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:2;}
        .pq0602 .pq-busidle{animation:pqIdle06 3.2s ease-in-out infinite;filter:drop-shadow(0 3px 4px rgba(0,0,0,.18));}
        .pq0602 .pq-spokes{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0602 .pq-blink{opacity:0;animation:pqBlink06 3.8s linear infinite;}
        .pq0602 .pq-csway{transform-box:fill-box;transform-origin:50% 0;animation:pqSway06 3.4s ease-in-out infinite;}
        .pq0602 .pq-cl{transform-box:fill-box;transform-origin:0% 50%;transition:transform .8s cubic-bezier(.5,1.3,.5,1);}
        .pq0602 .pq-cr{transform-box:fill-box;transform-origin:100% 50%;transition:transform .8s cubic-bezier(.5,1.3,.5,1);}
        .pq0602 .pq-curt.open .pq-cl{transform:scaleX(.2);}
        .pq0602 .pq-curt.open .pq-cr{transform:scaleX(.2);}
        .pq0602 .pq-q{transform-box:fill-box;transform-origin:50% 50%;animation:pqBreath06 2.4s ease-in-out infinite;}
        .pq0602 .pq-gpass{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0602 .pq-cnt{transform-box:fill-box;transform-origin:50% 50%;animation:pqPop .35s ease both;}
        .pq0602 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:23px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns06 .5s cubic-bezier(.3,1.5,.5,1) both;animation-delay:1.35s;z-index:5;white-space:nowrap;}
        .pq0602 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0602 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0602 .pq-opt:hover:not(:disabled){border-color:#f0d3a0;transform:translateY(-2px);}
        .pq0602 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0602 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0602 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele06 .5s ease;}
        .pq0602 .pq-opt:disabled{cursor:default;}
        .pq0602 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn06 .22s ease both;}
        .pq0602 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0602 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqIdle06{0%,100%{transform:translateY(0);}50%{transform:translateY(-1.5px);}}
        @keyframes pqSun06{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud06{from{transform:translateX(0);}to{transform:translateX(440px);}}
        @keyframes pqBlink06{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqSway06{0%,100%{transform:skewX(1.6deg);}50%{transform:skewX(-1.6deg);}}
        @keyframes pqBreath06{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.14);opacity:1;}}
        @keyframes pqAns06{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele06{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn06{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
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
