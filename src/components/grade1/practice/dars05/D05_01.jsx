// Dars05 · Amaliyot 01 — P5 «Yashiringan koptok» (compose_hidden) · 🟢 · jonglyor · tag: compose_hidden
// Jami 3 koptok: chap kaftda 2 ko'rinadi, o'ng MUSHTda 1 yashiringan. G'alabada musht ochiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { total: 3, shown: 2, target: 1, options: [1, 2, 3], ptype: 'P5', level: '🟢', tag: 'compose_hidden' };
const T = {
  uz: {
    eyebrow: 'Sirk · Jonglyor', title: 'Yashiringan koptok',
    setup: 'Jonglyorda jami 3 ta koptok bor. Chap qo\'lida 2 tasi ko\'rinadi.',
    ask: 'O\'ng qo\'lida nechta koptok yashiringan?',
    correct: 'Barakalla! Ikki va yana bir — uchta!',
    hint: 'Jami 3 ta koptok. Chapda 2 ta bor — o\'ngda nechta qolganini o\'ylang.',
  },
  ru: {
    eyebrow: 'Цирк · Жонглёр', title: 'Спрятанный мяч',
    setup: 'У жонглёра всего 3 мяча. Два видны в левой руке.',
    ask: 'Сколько мячей спрятано в правой руке?',
    correct: 'Молодец! Два и ещё один — три!',
    hint: 'Всего 3 мяча. В левой руке 2 — подумай, сколько спрятано в правой.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KOPTOK KANONI: r~10, 2 ton (asos + ochroq tepa-chap), yupqa quyuq kontur, oq blik.
const BALL_COLORS = [
  { base: '#d9534b', light: '#e8837d', line: '#a83a34' }, // qizil
  { base: '#4f8fc4', light: '#7fb2d9', line: '#3a6c96' }, // ko'k
  { base: '#f2b134', light: '#f7cd74', line: '#c08417' }, // sariq
  { base: '#57a84f', light: '#82c47c', line: '#3f7d39' }, // yashil
];
const Ball = ({ c }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="10" fill={c.base} stroke={c.line} strokeWidth="1.6" />
    <circle cx="9" cy="8.6" r="5.6" fill={c.light} opacity=".55" />
    <ellipse cx="7.8" cy="7" rx="2.4" ry="1.6" fill="#fff" opacity=".85" />
  </svg>
);

// Chizilgan jonglyor: qizil qalpoq + pompon, blikli ko'zlar, tabassum, oq yoqa,
// binafsha kostyum. Chap kaft OCHIQ (tepaga qaragan), o'ng qo'l — MUSHT (pulslanadi).
// open=true bo'lganda musht o'rnida OCHIQ KAFT paydo bo'ladi (pqPop).
const Juggler = ({ open }) => (
  <svg viewBox="0 0 220 150" width="220" height="150" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="110" cy="144" rx="52" ry="6" fill="rgba(31,36,48,.10)" />
    {/* oyoqlar */}
    <path d="M100 112 L96 136" stroke="#5b4a9e" strokeWidth="10" strokeLinecap="round" />
    <path d="M120 112 L124 136" stroke="#5b4a9e" strokeWidth="10" strokeLinecap="round" />
    <ellipse cx="92" cy="139" rx="8.5" ry="4" fill="#d9534b" stroke="#a83a34" strokeWidth="1.4" />
    <ellipse cx="128" cy="139" rx="8.5" ry="4" fill="#d9534b" stroke="#a83a34" strokeWidth="1.4" />
    <ellipse cx="89" cy="137.6" rx="2.2" ry="1" fill="#fff" opacity=".6" />
    <ellipse cx="125" cy="137.6" rx="2.2" ry="1" fill="#fff" opacity=".6" />
    {/* yenglar — ikki yonga ochiq qo'llar */}
    <path d="M92 80 Q68 82 50 93" stroke="#8a63d9" strokeWidth="11" fill="none" strokeLinecap="round" />
    <path d="M128 80 Q152 82 170 91" stroke="#8a63d9" strokeWidth="11" fill="none" strokeLinecap="round" />
    {/* bo'yin + tana */}
    <rect x="106" y="56" width="8" height="10" fill="#f6cf9f" />
    <path d="M88 74 Q110 66 132 74 L128 112 Q110 118 92 112 Z" fill="#8a63d9" stroke="#5f3fa8" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M103 72 Q110 70 117 72 L114 110 Q110 112 106 110 Z" fill="#9c7ce2" />
    <circle cx="110" cy="88" r="2.4" fill="#f2b134" stroke="#c08417" strokeWidth="1" />
    <circle cx="110" cy="99" r="2.4" fill="#f2b134" stroke="#c08417" strokeWidth="1" />
    <path d="M92.4 106 L127.6 106 L127.2 112.5 Q110 117.5 92.8 112.5 Z" fill="#f2b134" stroke="#c08417" strokeWidth="1.2" strokeLinejoin="round" />
    {/* oq yoqa */}
    <circle cx="98" cy="68" r="4.2" fill="#fff" stroke="#ddd2f0" strokeWidth="1" />
    <circle cx="122" cy="68" r="4.2" fill="#fff" stroke="#ddd2f0" strokeWidth="1" />
    <circle cx="110" cy="71" r="4.2" fill="#fff" stroke="#ddd2f0" strokeWidth="1" />
    {/* bosh: quloqlar, soch, yuz, qalpoq */}
    <circle cx="90.5" cy="44" r="3.5" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.3" />
    <circle cx="129.5" cy="44" r="3.5" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.3" />
    <circle cx="110" cy="42" r="19" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.5" />
    <path d="M92.5 34 Q90.5 42 94 48" stroke="#6b4326" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M127.5 34 Q129.5 42 126 48" stroke="#6b4326" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M91 33 Q110 8 129 33 Q110 27 91 33 Z" fill="#d9534b" stroke="#a83a34" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M90 32 Q110 25 130 32 Q110 38 90 32 Z" fill="#e8837d" stroke="#a83a34" strokeWidth="1.2" strokeLinejoin="round" />
    <g className="pq-pom">
      <circle cx="110" cy="12" r="4.5" fill="#f2b134" stroke="#c08417" strokeWidth="1.2" />
      <circle cx="108.5" cy="10.5" r="1.2" fill="#fff" opacity=".8" />
    </g>
    {/* yuz: qoshlar, ko'zlar (blik), burun, tabassum, yonoqlar */}
    <path d="M99 33.5 q4 -3 7.5 -.5" stroke="#7a4a22" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M113.5 33 q4 -2.5 7.5 .5" stroke="#7a4a22" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="103" cy="39" r="2.4" fill="#1f2430" />
    <circle cx="103.9" cy="38.1" r="0.85" fill="#fff" />
    <circle cx="117" cy="39" r="2.4" fill="#1f2430" />
    <circle cx="117.9" cy="38.1" r="0.85" fill="#fff" />
    {/* qovoqlar — ko'z pirpiratish (opacity 0→1 qisqa, har ~3.6s) */}
    <g className="pq-lids">
      <rect x="99.8" y="35.6" width="6.6" height="6.6" rx="3" fill="#f6cf9f" />
      <path d="M100.6 39.6 q2.4 1.8 5 0" stroke="#c98d54" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <rect x="113.8" y="35.6" width="6.6" height="6.6" rx="3" fill="#f6cf9f" />
      <path d="M114.6 39.6 q2.4 1.8 5 0" stroke="#c98d54" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </g>
    <ellipse cx="110" cy="45.5" rx="2.4" ry="1.9" fill="#eab27e" />
    <path d="M102 50 Q110 57.5 118 50" stroke="#a8632c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <ellipse cx="98.5" cy="47.5" rx="3.2" ry="2.1" fill="#f0a3a0" opacity=".5" />
    <ellipse cx="121.5" cy="47.5" rx="3.2" ry="2.1" fill="#f0a3a0" opacity=".5" />
    {/* manjetlar */}
    <circle cx="50" cy="93" r="5.5" fill="#f2b134" stroke="#c08417" strokeWidth="1.2" />
    <circle cx="170" cy="91" r="5.5" fill="#f2b134" stroke="#c08417" strokeWidth="1.2" />
    {/* chap OCHIQ kaft (tepaga qaragan): barmoq do'ngliklari + kaft + bosh barmoq */}
    <g>
      <circle cx="33.5" cy="92.5" r="2.6" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
      <circle cx="38.5" cy="90.8" r="2.8" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
      <circle cx="44" cy="90.6" r="2.8" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
      <circle cx="49" cy="92" r="2.6" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
      <ellipse cx="41" cy="96" rx="9" ry="6.2" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.4" />
      <circle cx="48.5" cy="99" r="2.4" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
    </g>
    {/* o'ng qo'l: musht (pulslanadi) yoki g'alabada ochiq kaft */}
    {open ? (
      <g className="pq-palmR">
        <circle cx="169.5" cy="88.5" r="2.6" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
        <circle cx="174" cy="87" r="2.8" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
        <circle cx="179.4" cy="87" r="2.8" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
        <circle cx="184.4" cy="88.4" r="2.6" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
        <ellipse cx="177" cy="93" rx="9" ry="6.2" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.4" />
        <circle cx="169" cy="95.5" r="2.4" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.2" />
      </g>
    ) : (
      <g className="pq-fist">
        <circle cx="176" cy="92" r="8" fill="#f6cf9f" stroke="#c98d54" strokeWidth="1.5" />
        <path d="M170.5 88.5 q2 -1.8 3.8 -.4 M175 87.4 q2 -1.6 3.6 -.2 M179.4 88.4 q1.8 -1.2 3 .2" stroke="#c98d54" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M169.5 94.5 q3 3.6 7.5 3" stroke="#c98d54" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </g>
    )}
  </svg>
);

// Bayramona bayroqchalar (bunting) — sirk sahnasining tepasi.
const Bunting = () => (
  <svg viewBox="0 0 300 26" width="100%" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="0" y1="8" x2="300" y2="8" stroke="#cbb79e" strokeWidth="2" />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 18 + i * 33;
      const c = BALL_COLORS[i % 4];
      return <polygon key={i} className="pq-flag" style={{ animationDelay: `${(-i * 0.37).toFixed(2)}s` }} points={`${x - 7},8 ${x + 7},8 ${x},22`} fill={c.base} stroke={c.line} strokeWidth="1" strokeLinejoin="round" />;
    })}
  </svg>
);

export default function D05_01(props) {
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
    <div className="pq pq0501">
      <style>{`
        .pq0501{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0501 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d6577a;text-transform:uppercase;}
        .pq0501 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0501 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0501 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0501 .pq-scene{position:relative;width:300px;height:214px;margin:0 auto;border-radius:20px;background:linear-gradient(180deg,#fdf3f5 0%,#fdeff4 55%,#fff4e2 100%);border:2px solid #f0d9df;overflow:hidden;}
        .pq0501 .pq-stripes{position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(217,83,75,.05) 0 22px,rgba(255,255,255,0) 22px 44px);}
        .pq0501 .pq-floor{position:absolute;bottom:0;left:0;right:0;height:24px;background:#f6e4c6;border-top:2px solid #eadbb8;}
        .pq0501 .pq-bunting{position:absolute;top:0;left:0;right:0;}
        .pq0501 .pq-jgl{position:absolute;left:40px;bottom:6px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));animation:pqSway 3.6s ease-in-out infinite;transform-origin:50% 100%;}
        .pq0501 .pq-jgl.win{animation:pqCele .6s ease,pqSway 3.6s ease-in-out .6s infinite;}
        .pq0501 .pq-pom{transform-box:fill-box;transform-origin:center;animation:pqPom 1.5s ease-in-out -0.4s infinite;}
        .pq0501 .pq-lids{opacity:0;animation:pqBlink 3.6s linear infinite;}
        .pq0501 .pq-fist{transform-box:fill-box;transform-origin:center;animation:pqFist 1s ease-in-out infinite;}
        .pq0501 .pq-palmR{transform-box:fill-box;transform-origin:center;animation:pqPop .45s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0501 .pq-flag{transform-box:fill-box;transform-origin:50% 0;animation:pqFlag 2.6s ease-in-out infinite;}
        .pq0501 .pq-spot{position:absolute;left:50px;bottom:0;width:200px;height:46px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(242,177,52,.38) 0%,rgba(242,177,52,0) 68%);animation:pqSpot 3.2s ease-in-out infinite;}
        .pq0501 .pq-ball{position:absolute;width:26px;height:26px;line-height:0;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18));animation:pqBob 2s ease-in-out infinite;z-index:2;}
        .pq0501 .pq-ball.drop{animation:pqPop .5s cubic-bezier(.3,1.5,.5,1) both,pqBob 2s ease-in-out .5s infinite;}
        .pq0501 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0501 .pq-q{position:absolute;left:206px;top:98px;font-size:30px;font-weight:900;color:#c9821a;text-shadow:0 2px 6px rgba(255,255,255,.9);animation:pqBreath 2.2s ease-in-out infinite;z-index:2;}
        .pq0501 .pq-chip{position:absolute;top:26px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:4;white-space:nowrap;font-variant-numeric:tabular-nums;}
        .pq0501 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0501 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0501 .pq-opt:hover:not(:disabled){border-color:#f0c3d3;transform:translateY(-2px);}
        .pq0501 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0501 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0501 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0501 .pq-opt:disabled{cursor:default;}
        .pq0501 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0501 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0501 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
        @keyframes pqSway{0%,100%{transform:rotate(-1.2deg);}50%{transform:rotate(1.2deg);}}
        @keyframes pqPom{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.6px);}}
        @keyframes pqBlink{0%,86%,96%,100%{opacity:0;}89%,93%{opacity:1;}}
        @keyframes pqFist{0%,100%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.2) rotate(-4deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1) translateY(0);}50%{transform:scale(1.16) translateY(-2px);}}
        @keyframes pqFlag{0%,100%{transform:rotate(-5deg);}50%{transform:rotate(5deg);}}
        @keyframes pqSpot{0%,100%{opacity:.45;transform:scale(1);}50%{opacity:.95;transform:scale(1.06);}}
        @keyframes pqPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.14);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <span className="pq-stripes" />
        <span className="pq-floor" />
        <span className="pq-spot" />
        <div className="pq-bunting"><Bunting /></div>
        {ok && <span className="pq-chip">2 + 1 = 3</span>}
        <div className={'pq-jgl' + (ok ? ' win' : '')}><Juggler open={!!ok} /></div>
        {/* chap kaftdagi 2 ko'rinadigan koptok */}
        <span className="pq-ball" style={{ left: 55, top: 119, animationDelay: '0s' }}>
          <Ball c={BALL_COLORS[0]} />{ok && <b className="pq-cnt">1</b>}
        </span>
        <span className="pq-ball" style={{ left: 79, top: 111, animationDelay: '1s' }}>
          <Ball c={BALL_COLORS[1]} />{ok && <b className="pq-cnt">2</b>}
        </span>
        {/* o'ng musht ustidagi savol belgisi / g'alabada uchinchi koptok */}
        {!ok && <span className="pq-q">?</span>}
        {ok && (
          <span className="pq-ball drop" style={{ left: 201, top: 113 }}>
            <Ball c={BALL_COLORS[2]} /><b className="pq-cnt">3</b>
          </span>
        )}
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
