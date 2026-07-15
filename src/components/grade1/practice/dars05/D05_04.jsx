// Dars05 · Amaliyot 04 — P6 Son uyi (sirk chodiri) · 🟡 · tag: number_house
// Tomda 5, qavatda [2 | ?]: bo'sh xonachaga 3 yoziladi. Веди-до-верного, ozvuchkasiz.
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

const DATA = { roof: 5, left: 2, target: 3, options: [2, 3, 4], ptype: 'P6', level: '🟡', tag: 'number_house' };
const T = {
  uz: {
    eyebrow: 'Sirk · Chodir', title: 'Son uyi',
    setup: 'Chodir tomida 5 turibdi. Qavatdagi ikki son qo\'shilib 5 bo\'ladi.',
    ask: 'Bo\'sh katakka qaysi son yoziladi?',
    correct: 'Barakalla! Ikki va uch — besh.',
    hint: 'Ikkiga nechta qo\'shsak 5 bo\'ladi? Barmoqda sanang.',
  },
  ru: {
    eyebrow: 'Цирк · Шатёр', title: 'Числовой домик',
    setup: 'На крыше шатра число 5. Два числа на этаже вместе дают 5.',
    ask: 'Какое число пишется в пустой клетке?',
    correct: 'Молодец! Два и три — пять.',
    hint: 'Сколько прибавить к двум, чтобы получилось 5? Посчитай на пальчиках.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Sirk gumbazi: qizil-oq yo'l-yo'l uchburchak panellar, pastida ilma-scallop hoshiya,
// tepada hilpiraydigan bayroqcha (transform-box), gumbaz markazida «5» doira-belgi.
const Dome = () => (
  <svg viewBox="0 0 220 126" width="220" height="126" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <clipPath id="pqDomeClip0504"><path d="M110 34 L26 112 L194 112 Z" /></clipPath>
      <linearGradient id="pqShimmer0504" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <line x1="110" y1="10" x2="110" y2="36" stroke="#7c4f24" strokeWidth="3" strokeLinecap="round" />
    <path className="pq-topflag" d="M111 8 L137 14.5 L111 21 Z" fill="#f2b134" stroke="#c88f1a" strokeWidth="1.2" strokeLinejoin="round" />
    {Array.from({ length: 6 }).map((_, i) => {
      const x = 26 + i * 28;
      return <path key={i} d={`M110 34 L${x} 112 L${x + 28} 112 Z`} fill={i % 2 === 0 ? '#d9534b' : '#fdf6ec'} />;
    })}
    <g clipPath="url(#pqDomeClip0504)">
      <rect className="pq-shimmer" x="-64" y="30" width="64" height="86" fill="url(#pqShimmer0504)" />
    </g>
    <path d="M110 34 L26 112 L194 112 Z" fill="none" stroke="#a03a34" strokeWidth="2" strokeLinejoin="round" />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M${26 + i * 14} 112 a7 6 0 0 0 14 0 Z`} fill={i % 2 === 0 ? '#d9534b' : '#fdf6ec'} stroke="#a03a34" strokeWidth="1.1" />
    ))}
    <circle cx="110" cy="34" r="3.6" fill="#a03a34" />
    <g className="pq-badge">
      <circle cx="110" cy="80" r="19" fill="#fffdf6" stroke="#a03a34" strokeWidth="2.4" />
      <text x="110" y="89" textAnchor="middle" fontSize="26" fontWeight="900" fill="#a03a34">{DATA.roof}</text>
    </g>
  </svg>
);

// Osmon buluti: 3 ellipsdan chizilgan yumshoq bulut, sekin chapdan o'ngga suzadi.
const Cloud = ({ w = 46 }) => (
  <svg viewBox="0 0 60 26" width={w} aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="19" cy="17" rx="14" ry="8" fill="#ffffff" />
    <ellipse cx="33" cy="12" rx="12" ry="9" fill="#ffffff" />
    <ellipse cx="45" cy="17" rx="11" ry="7" fill="#ffffff" />
  </svg>
);

// Zamin o'ti: 3 poya, har biri o'z fazasida asosidan tebranadi.
const Grass = () => (
  <svg viewBox="0 0 26 20" width="22" height="17" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-blade b1" d="M5 19 C4 13 6 9 8 5" stroke="#4a9a44" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path className="pq-blade b2" d="M13 19 C13 11 13 8 13 3" stroke="#3e8f3e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path className="pq-blade b3" d="M21 19 C22 13 20 9 18 6" stroke="#57a84f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
);

// Zamin bayroqchasi: yog'och ustuncha + hilpiraydigan vimpel (rang koptok palitrasidan).
const MiniFlag = ({ color }) => (
  <svg viewBox="0 0 28 46" width="20" height="33" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="5" y1="5" x2="5" y2="43" stroke="#7c4f24" strokeWidth="2.6" strokeLinecap="round" />
    <path className="pq-pennant" d="M6 5 L25 10.5 L6 16 Z" fill={color} stroke="rgba(0,0,0,.28)" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

export default function D05_04(props) {
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
  const [fitRef, scale] = useFitScale(300);

  return (
    <div className="pq pq0504" ref={fitRef}>
      <style>{`
        .pq0504{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0504 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d9534b;text-transform:uppercase;}
        .pq0504 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0504 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0504 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0504 .pq-fit{position:relative;margin:0 auto;}
        .pq0504 .pq-scene{box-sizing:border-box;position:relative;width:300px;height:246px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#eaf6ff 58%,#e2f3da 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0504 .pq-ground{position:absolute;left:0;right:0;bottom:0;height:44px;background:linear-gradient(#a5d99a,#79bd68);}
        .pq0504 .pq-tent{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0504 .pq-floor{display:flex;gap:8px;padding:9px 12px 11px;background:#fdf6ec repeating-linear-gradient(90deg,rgba(217,83,75,.10) 0 10px,rgba(0,0,0,0) 10px 20px);border:2px solid #a03a34;border-top:none;border-radius:0 0 14px 14px;}
        .pq0504 .pq-room{width:58px;height:52px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;font-variant-numeric:tabular-nums;}
        .pq0504 .pq-room.known{background:#fff;border:2.5px solid #c98c3a;color:#1f2430;}
        .pq0504 .pq-room.gap{background:#fff8f4;border:2.5px dashed #d9534b;color:#d9534b;}
        .pq0504 .pq-room.gap.win{background:#e8f7ee;border:2.5px solid #1a7f43;animation:pqCele .5s ease;}
        .pq0504 .pq-q{display:inline-block;animation:pqPulse 1.3s ease-in-out infinite;}
        .pq0504 .pq-fill{color:#1a7f43;animation:pqFillIn .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0504 .pq-topflag,.pq0504 .pq-pennant{transform-box:fill-box;transform-origin:0% 55%;animation:pqWave 2.1s ease-in-out infinite;}
        .pq0504 .pq-topflag{animation:pqWaveBig 1.5s ease-in-out infinite;}
        .pq0504 .pq-badge{transform-box:fill-box;transform-origin:center;animation:pqBreath 3.2s ease-in-out infinite;}
        .pq0504 .pq-shimmer{animation:pqShimmer 9s linear infinite;}
        .pq0504 .pq-cloud{position:absolute;left:-62px;line-height:0;opacity:.92;animation:pqDrift 26s linear infinite;pointer-events:none;}
        .pq0504 .pq-cloud.c1{top:16px;animation-delay:-8s;}
        .pq0504 .pq-cloud.c2{top:44px;animation-duration:38s;animation-delay:-21s;}
        .pq0504 .pq-grass{position:absolute;line-height:0;pointer-events:none;}
        .pq0504 .pq-grass.g1{left:24px;bottom:6px;}
        .pq0504 .pq-grass.g2{left:66%;bottom:4px;}
        .pq0504 .pq-grass.g3{right:44px;bottom:10px;}
        .pq0504 .pq-blade{transform-box:fill-box;transform-origin:50% 100%;animation:pqSway 3s ease-in-out infinite;}
        .pq0504 .pq-blade.b2{animation-duration:2.6s;animation-delay:-.9s;}
        .pq0504 .pq-blade.b3{animation-duration:3.4s;animation-delay:-1.7s;}
        .pq0504 .pq-grass.g2 .pq-blade{animation-delay:-1.2s;}
        .pq0504 .pq-grass.g3 .pq-blade{animation-delay:-2.1s;}
        .pq0504 .pq-mini{position:absolute;bottom:18px;line-height:0;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18));}
        .pq0504 .pq-mini.m1{left:16px;}
        .pq0504 .pq-mini.m2{left:42px;bottom:24px;}
        .pq0504 .pq-mini.m3{right:18px;}
        .pq0504 .pq-mini.m1 .pq-pennant{animation-duration:2.3s;}
        .pq0504 .pq-mini.m2 .pq-pennant{animation-duration:1.9s;animation-delay:-.7s;}
        .pq0504 .pq-mini.m3 .pq-pennant{animation-duration:2.6s;animation-delay:-1.3s;}
        .pq0504 .pq-scene.win .pq-topflag,.pq0504 .pq-scene.win .pq-pennant{animation-duration:.45s;}
        .pq0504 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 14px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:3;white-space:nowrap;}
        .pq0504 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px;}
        .pq0504 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0504 .pq-opt:hover:not(:disabled){border-color:#e7b0ac;transform:translateY(-2px);}
        .pq0504 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0504 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0504 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0504 .pq-opt:disabled{cursor:default;}
        .pq0504 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0504 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0504 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqWave{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(7deg);}}
        @keyframes pqWaveBig{0%,100%{transform:rotate(-7deg) scaleY(.96);}50%{transform:rotate(11deg) scaleY(1.04);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        @keyframes pqShimmer{0%{transform:translateX(0);}55%{transform:translateX(292px);}100%{transform:translateX(292px);}}
        @keyframes pqDrift{from{transform:translateX(0);}to{transform:translateX(430px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqPulse{0%,100%{transform:scale(1) rotate(-3deg);opacity:.65;}50%{transform:scale(1.22) rotate(3deg);opacity:1;}}
        @keyframes pqFillIn{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 300 * scale, height: 246 * scale }}>
      <div className={'pq-scene' + (ok ? ' win' : '')} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {ok && <span className="pq-chip">{DATA.left} + {DATA.target} = {DATA.roof}</span>}
        <span className="pq-cloud c1"><Cloud w={46} /></span>
        <span className="pq-cloud c2"><Cloud w={34} /></span>
        <span className="pq-ground" />
        <span className="pq-grass g1"><Grass /></span>
        <span className="pq-grass g2"><Grass /></span>
        <span className="pq-grass g3"><Grass /></span>
        <span className="pq-mini m1"><MiniFlag color="#4f8fc4" /></span>
        <span className="pq-mini m2"><MiniFlag color="#57a84f" /></span>
        <span className="pq-mini m3"><MiniFlag color="#f2b134" /></span>
        <div className="pq-tent">
          <Dome />
          <div className="pq-floor">
            <div className="pq-room known">{DATA.left}</div>
            <div className={'pq-room gap' + (ok ? ' win' : '')}>{ok ? <b className="pq-fill">{DATA.target}</b> : <span className="pq-q">?</span>}</div>
          </div>
        </div>
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
