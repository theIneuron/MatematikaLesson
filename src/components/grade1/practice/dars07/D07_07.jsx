// Dars07 · Amaliyot 07 — LOGIC o'suvchi naqsh (kubik minoralar 1-2-3-?) · 🔴 · tag: logic_growing
// Qum maydonchasida minoralar qatori: 1, 2, 3 kubik, keyin shtrix-«?». G'alabada 4-minora
// kubiklar birin-ketin tushib quriladi, har ustun ostida soni (1,2,3,4) ko'rinadi.
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

const DATA = { target: 5, options: [5, 6, 4], ptype: 'LOGIC', level: '🔴', tag: 'logic_growing' };
const T = {
  uz: {
    eyebrow: 'O\'yin maydonchasi · Qum maydoni', title: 'O\'suvchi naqsh',
    setup: 'Bolalar qumda kubik minoralar qatorini qurishdi.',
    ask: 'Keyingi minora qanday bo\'ladi?',
    correct: 'Barakalla! Ikki, uch, to\'rt — keyingisi besh kubikli minora!',
    hint: 'Minoralarni solishtiring: har keyingisi avvalgisidan nechtaga baland?',
    opts: ['5 kubik', '6 kubik', '4 kubik'],
  },
  ru: {
    eyebrow: 'Игровая площадка · Песочница', title: 'Растущий узор',
    setup: 'Дети построили в песке ряд башен из кубиков.',
    ask: 'Какой будет следующая башня?',
    correct: 'Молодец! Два, три, четыре — следующая башня из пяти кубиков!',
    hint: 'Сравни башни: на сколько каждая следующая выше предыдущей?',
    opts: ['5 кубиков', '6 кубиков', '4 кубика'],
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const SKIN = '#f2c096', SKIN_LINE = '#c98d5f';
// Yog'och kubik palitrasi: f=old yuz, t=usti (ochroq), s=yon (to'qroq), l=kontur.
const PAL = [
  { f: '#d9534b', t: '#e8837d', s: '#a83a33', l: '#8f2f29' }, // qizil
  { f: '#4f8fc4', t: '#7fb0d8', s: '#3a6f9c', l: '#2c567a' }, // ko'k
  { f: '#f2b134', t: '#f7cd74', s: '#cf8f1a', l: '#a8721a' }, // sariq
  { f: '#57a84f', t: '#84c47d', s: '#3f8a39', l: '#31682c' }, // yashil
];

// Kubik kanoni: 2-3 ton (old + ochroq ust + to'qroq yon) + yupqa kontur + blik.
const Cube = ({ c, w = 40 }) => (
  <svg viewBox="0 0 40 35" width={w} height={w * 35 / 40} aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="3,9 11,2 37,2 29,9" fill={c.t} stroke={c.l} strokeWidth="1.5" strokeLinejoin="round" />
    <polygon points="29,9 37,2 37,27 29,34" fill={c.s} stroke={c.l} strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="3" y="9" width="26" height="25" rx="1.5" fill={c.f} stroke={c.l} strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="6" y="12" width="7.5" height="4.6" rx="2.2" fill="#fff" opacity=".38" />
  </svg>
);

// Minora = ustma-ust kubiklar (bitta kubik = bitta sanaladigan dona).
// drop=true — g'alaba-qurilish: kubiklar birin-ketin balanddan tushadi.
const CUBE_STEP = 25, CUBE_H = 35;
const Tower = ({ n, off = 0, w = 40, drop = false }) => {
  const k = w / 40, step = CUBE_STEP * k;
  return (
    <div className="pq-tower" style={{ width: w, height: (CUBE_STEP * (n - 1) + CUBE_H) * k }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className={'pq-cube' + (drop ? ' fall' : '')}
          style={{ bottom: i * step, animationDelay: drop ? `${0.15 + i * 0.3}s` : `${(off + i) * 0.09}s` }}>
          <Cube c={PAL[(off + i) % PAL.length]} w={w} />
        </span>
      ))}
    </div>
  );
};

// Bola kanoni: dumaloq teri-rang bosh + blikli ko'zlar + tabassum + rangli futbolka + kalta oyoqlar.
const Kid = ({ c, d }) => (
  <svg viewBox="0 0 40 60" width="36" height="54" aria-hidden="true" style={{ display: 'block', '--bd': `${-d}s` }}>
    <circle cx="20" cy="12" r="9.5" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.5" />
    <circle cx="16.6" cy="11" r="1.5" fill="#1f2430" /><circle cx="17.1" cy="10.5" r="0.55" fill="#fff" />
    <circle cx="23.4" cy="11" r="1.5" fill="#1f2430" /><circle cx="23.9" cy="10.5" r="0.55" fill="#fff" />
    <g className="pq-blink"><rect x="14.7" y="9.3" width="3.8" height="3.4" rx="1.6" fill={SKIN} /><rect x="21.5" y="9.3" width="3.8" height="3.4" rx="1.6" fill={SKIN} /></g>
    <path d="M17 15.6 Q20 18 23 15.6" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <rect x="9" y="22" width="22" height="21" rx="9" fill={c.f} stroke={c.l} strokeWidth="1.5" />
    <path d="M9.5 27 Q4.5 31.5 5.5 37.5" stroke={c.f} strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="5.8" cy="39" r="2.6" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
    <path d="M30.5 27 Q35.5 31.5 34.5 37.5" stroke={c.f} strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="34.2" cy="39" r="2.6" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1" />
    <rect x="13" y="42" width="5.5" height="12" rx="2.5" fill="#5b6a86" />
    <rect x="21.5" y="42" width="5.5" height="12" rx="2.5" fill="#5b6a86" />
    <ellipse cx="15.2" cy="55.5" rx="4" ry="2.4" fill="#3f4a5f" />
    <ellipse cx="24.8" cy="55.5" rx="4" ry="2.4" fill="#3f4a5f" />
  </svg>
);

// Arg'imchoq: yog'och ramka + osilgan o'rindiq (pq-swy sekin tebranadi).
const Swing = () => (
  <svg viewBox="0 0 88 98" width="84" height="94" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="16" y1="10" x2="6" y2="94" stroke="#b0703a" strokeWidth="5" strokeLinecap="round" />
    <line x1="16" y1="10" x2="26" y2="94" stroke="#9c5f2e" strokeWidth="5" strokeLinecap="round" />
    <line x1="72" y1="10" x2="62" y2="94" stroke="#9c5f2e" strokeWidth="5" strokeLinecap="round" />
    <line x1="72" y1="10" x2="82" y2="94" stroke="#b0703a" strokeWidth="5" strokeLinecap="round" />
    <line x1="14" y1="10" x2="74" y2="10" stroke="#b0703a" strokeWidth="6" strokeLinecap="round" />
    <g className="pq-swy">
      <line x1="36" y1="12" x2="36" y2="62" stroke="#8a6a3a" strokeWidth="2.2" />
      <line x1="52" y1="12" x2="52" y2="62" stroke="#8a6a3a" strokeWidth="2.2" />
      <rect x="30" y="61" width="28" height="7" rx="3.5" fill="#d9534b" stroke="#8f2f29" strokeWidth="1.5" />
    </g>
  </svg>
);

// Slayd-toboggan: narvon + platforma + ko'k qiyalik (blik-chiziqli).
const Slide = () => (
  <svg viewBox="0 0 96 90" width="90" height="84" aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="44,16 60,16 90,74 74,82" fill="#4f8fc4" stroke="#2c567a" strokeWidth="2" strokeLinejoin="round" />
    <line x1="53" y1="21" x2="79" y2="73" stroke="#7fb0d8" strokeWidth="5" strokeLinecap="round" opacity=".8" />
    <line x1="26" y1="22" x2="26" y2="86" stroke="#b0703a" strokeWidth="5" strokeLinecap="round" />
    <line x1="42" y1="22" x2="42" y2="86" stroke="#9c5f2e" strokeWidth="5" strokeLinecap="round" />
    <line x1="26" y1="36" x2="42" y2="36" stroke="#8a5a2c" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="26" y1="50" x2="42" y2="50" stroke="#8a5a2c" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="26" y1="64" x2="42" y2="64" stroke="#8a5a2c" strokeWidth="3.2" strokeLinecap="round" />
    <line x1="26" y1="78" x2="42" y2="78" stroke="#8a5a2c" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="20" y="12" width="30" height="9" rx="4" fill="#f2b134" stroke="#a8721a" strokeWidth="1.5" />
  </svg>
);

export default function D07_07(props) {
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
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: t.opts, studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;
  const BADGE_D = [1.6, 1.75, 1.9, 2.05];
  const [fitRef, scale] = useFitScale(360);

  return (
    <div className="pq pq0707" ref={fitRef}>
      <style>{`
        .pq0707{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0707 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c07f2e;text-transform:uppercase;}
        .pq0707 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0707 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0707 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0707 .pq-scene{box-sizing:border-box;position:relative;width:360px;height:250px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e8f6ff 40%,#c9e8a4 40.5%,#a9d67f 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0707 .pq-fit{position:relative;margin:0 auto;}
        .pq0707 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.5s ease-in-out infinite;}
        .pq0707 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0707 .pq-cloud.c1{top:18px;left:-70px;animation-duration:30s;animation-delay:-12s;}
        .pq0707 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-26s;}
        .pq0707 .pq-fence{position:absolute;left:0;right:0;bottom:122px;height:30px;background:repeating-linear-gradient(90deg,#e6cfa0 0 9px,rgba(255,255,255,0) 9px 19px);opacity:.85;}
        .pq0707 .pq-fence::after{content:'';position:absolute;left:0;right:0;top:7px;height:5px;background:#dcbb8e;border-radius:3px;}
        .pq0707 .pq-slide{position:absolute;left:6px;bottom:86px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0707 .pq-swing{position:absolute;right:6px;bottom:86px;z-index:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.14));}
        .pq0707 .pq-swy{transform-box:fill-box;transform-origin:50% 0;animation:pqSwing 2.7s ease-in-out infinite alternate;}
        .pq0707 .pq-kid{position:absolute;bottom:56px;z-index:1;animation:pqBobY 3.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));}
        .pq0707 .pq-kid.k1{left:66px;}
        .pq0707 .pq-kid.k2{right:66px;animation-duration:3.9s;animation-delay:-1.6s;}
        .pq0707 .pq-fl{position:absolute;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 50% 50%,#b1487a 30%,#e88bb1 32%);z-index:1;}
        .pq0707 .pq-fl.f1{left:112px;bottom:88px;}
        .pq0707 .pq-fl.f2{right:116px;bottom:82px;}
        .pq0707 .pq-sand{position:absolute;left:34px;right:34px;bottom:8px;height:66px;border-radius:14px;background:#f3ddab;border:4px solid #c9a26a;box-shadow:inset 0 3px 7px rgba(160,120,50,.28);z-index:2;}
        .pq0707 .pq-sand::before{content:'';position:absolute;inset:2px;border-radius:10px;background-image:radial-gradient(circle at 12% 60%,#e2c78e 2px,rgba(255,255,255,0) 2.6px),radial-gradient(circle at 38% 78%,#e2c78e 1.8px,rgba(255,255,255,0) 2.4px),radial-gradient(circle at 64% 55%,#e8d09c 2px,rgba(255,255,255,0) 2.6px),radial-gradient(circle at 88% 72%,#e2c78e 1.7px,rgba(255,255,255,0) 2.3px);}
        .pq0707 .pq-trow{position:absolute;left:20px;right:20px;bottom:24px;display:flex;justify-content:space-between;align-items:flex-end;}
        .pq0707 .pq-tslot{position:relative;display:flex;justify-content:center;align-items:flex-end;min-width:40px;}
        .pq0707 .pq-tslot.win{animation:pqCele .55s ease both;animation-delay:var(--cd,1.6s);}
        .pq0707 .pq-tower{position:relative;}
        .pq0707 .pq-cube{position:absolute;left:0;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.16));animation:pqDrop .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0707 .pq-cube.fall{animation:pqFall .6s cubic-bezier(.34,1.2,.5,1) both;}
        .pq0707 .pq-qbox{width:40px;height:96px;border:2.5px dashed #b9915f;border-radius:10px;background:rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center;animation:pqPulse 2s ease-in-out infinite;}
        .pq0707 .pq-q{font-size:28px;font-weight:900;color:#a97b3e;}
        .pq0707 .pq-cnt{position:absolute;left:50%;bottom:-24px;transform:translate(-50%,0);min-width:20px;height:20px;padding:0 4px;border-radius:50%;background:#2563eb;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPopC .35s ease both;z-index:3;}
        .pq0707 .pq-opts{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:20px;}
        .pq0707 .pq-opt{width:86px;height:112px;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding:0 0 12px;transition:.13s;}
        .pq0707 .pq-opt:hover:not(:disabled){border-color:#dab88a;transform:translateY(-2px);}
        .pq0707 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0707 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0707 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0707 .pq-opt:disabled{cursor:default;}
        .pq0707 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;animation-delay:var(--bd,0s);}
        .pq0707 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0707 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0707 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(470px);}}
        @keyframes pqSwing{from{transform:rotate(6.5deg);}to{transform:rotate(-6.5deg);}}
        @keyframes pqBobY{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}90%,94%{opacity:1;}96%,100%{opacity:0;}}
        @keyframes pqPulse{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.07);opacity:1;}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-32px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqFall{0%{opacity:0;transform:translateY(-72px);}60%{opacity:1;transform:translateY(4px);}80%{transform:translateY(-3px);}100%{transform:translateY(0);}}
        @keyframes pqPopC{from{opacity:0;transform:translate(-50%,6px) scale(.4);}to{opacity:1;transform:translate(-50%,0) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 360 * scale, height: 250 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-fence" />
        <div className="pq-slide"><Slide /></div>
        <div className="pq-swing"><Swing /></div>
        <div className="pq-kid k1"><Kid c={PAL[0]} d={1.2} /></div>
        <div className="pq-kid k2"><Kid c={PAL[1]} d={2.6} /></div>
        <span className="pq-fl f1" /><span className="pq-fl f2" />
        <div className="pq-sand">
          <div className="pq-trow">
            {[2, 3, 4, 5].map((n, i) => (
              <div key={n} className={'pq-tslot' + (ok ? ' win' : '')} style={{ '--cd': `${1.55 + i * 0.12}s` }}>
                {i < 3
                  ? <Tower n={n} off={i} />
                  : ok
                    ? <Tower n={5} off={3} drop />
                    : <span className="pq-qbox"><span className="pq-q">?</span></span>}
                {ok && <b className="pq-cnt" style={{ animationDelay: `${BADGE_D[i]}s` }}>{n}</b>}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n, i) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return (
            <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')}
              disabled={lock} aria-label={t.opts[i]}
              onClick={() => { setPicked(n); setFeedback(null); }}>
              <Tower n={n} off={3} w={24} />
            </button>
          );
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
