// Dars05 · Amaliyot 09 — P5 Yashirin qism «Sehrli sumka» · 🔴 · sehrgar · tag: hidden_bag
// Jami 5 koptok: 2 tasi stolda ko'rinadi, 3 tasi sumkada. G'alabada sumka ochiladi, koptoklar sakrab chiqadi.
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

const DATA = { total: 5, shown: 2, target: 3, options: [1, 2, 3, 4], ptype: 'P5', level: '🔴', tag: 'hidden_bag' };
const T = {
  uz: {
    eyebrow: 'Sirk · Sehrgar', title: 'Sehrli qop',
    setup: 'Sehrgarda jami 5 ta koptok bor. Ikkitasi stolda, qolgani qopda.',
    ask: 'Qopda nechta koptok yashiringan?',
    correct: 'Barakalla! Ikki va yana uch — besh!',
    hint: 'Jami 5 ta koptok. Stolda 2 ta bor — qopda nechta qolganini o\'ylang.',
  },
  ru: {
    eyebrow: 'Цирк · Фокусник', title: 'Волшебный мешок',
    setup: 'У фокусника всего 5 мячиков. Два на столе, остальные в мешке.',
    ask: 'Сколько мячиков спрятано в мешке?',
    correct: 'Молодец! Два и ещё три — пять!',
    hint: 'Всего 5 мячиков. На столе 2 — подумай, сколько спрятано в мешке.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// KOPTOK KANONI: r~10, radial 2-ton (asos + ochroq tepa-chap), yupqa quyuq kontur, oq blik.
// Palitra ketma-ket aylanadi: qizil, ko'k, sariq, yashil.
const BALL_COLORS = [
  { base: '#d9534b', light: '#f0928c', dark: '#9e352f' },
  { base: '#4f8fc4', light: '#93bede', dark: '#31648f' },
  { base: '#f2b134', light: '#f9d484', dark: '#b97c14' },
  { base: '#57a84f', light: '#95cf8f', dark: '#397733' },
];
const Ball = ({ c, gid }) => (
  <svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true" style={{ display: 'block' }}>
    <defs>
      <radialGradient id={gid} cx="0.36" cy="0.32" r="0.85">
        <stop offset="0%" stopColor={c.light} />
        <stop offset="100%" stopColor={c.base} />
      </radialGradient>
    </defs>
    <circle cx="13" cy="13" r="10.5" fill={`url(#${gid})`} stroke={c.dark} strokeWidth="1.6" />
    <ellipse cx="9.4" cy="8.6" rx="3" ry="1.9" fill="#fff" opacity=".8" transform="rotate(-28 9.4 8.6)" />
  </svg>
);

// Besh qirrali yulduz yo'li (sumka bezagi, tayoqcha uchi, uchqunlar uchun umumiy).
const STAR_D = 'M12 2.2 L14.7 8.9 L21.8 9.4 L16.3 14 L18.1 21 L12 17.1 L5.9 21 L7.7 14 L2.2 9.4 L9.3 8.9 Z';
const Star = ({ size = 12, color = '#f7d354' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
    <path d={STAR_D} fill={color} stroke="#c9971a" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

// Stol: yog'och taxta-ustki (ikki ton + tola chiziqlari), ikki oyoq, ko'ndalang bog'lam.
const Table = () => (
  <svg viewBox="0 0 130 96" width="130" height="96" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M16 29 L12 88" stroke="#6e4a22" strokeWidth="9" strokeLinecap="round" />
    <path d="M114 29 L118 88" stroke="#6e4a22" strokeWidth="9" strokeLinecap="round" />
    <path d="M17 31 L13.5 84" stroke="#8a5a2e" strokeWidth="4" strokeLinecap="round" />
    <path d="M113 31 L116.5 84" stroke="#8a5a2e" strokeWidth="4" strokeLinecap="round" />
    <path d="M17 64 Q65 58 113 64" stroke="#6e4a22" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    <rect x="2" y="13" width="126" height="12" rx="3.5" fill="#b07c4a" stroke="#6e4a22" strokeWidth="1.8" />
    <rect x="4" y="23" width="122" height="6" rx="2.5" fill="#8a5a2e" />
    <path d="M14 19 h22 M50 17.5 h28 M94 19 h20" stroke="#8a5a2e" strokeWidth="1.5" strokeLinecap="round" opacity=".65" />
  </svg>
);

// Sehr-tayoqchasi: qora tayoq, oq uchlik, uchida pulslanadigan yulduz + davriy yalt-halqa.
const Wand = () => (
  <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="14" y1="58" x2="44" y2="18" stroke="#171020" strokeWidth="6" strokeLinecap="round" />
    <line x1="38.5" y1="25.5" x2="44" y2="18" stroke="#f5f2ea" strokeWidth="6" strokeLinecap="round" />
    <circle className="pq-wandring" cx="43.8" cy="11.8" r="7" fill="none" stroke="#f7d354" strokeWidth="2" />
    <g transform="translate(34,2) scale(.82)">
      <path className="pq-wandstar" d={STAR_D} fill="#f7d354" stroke="#c9971a" strokeWidth="1.2" strokeLinejoin="round" />
    </g>
  </svg>
);

// Sehrli sumka: binafsha-to'q xalta, ikki ton + shimmer-blik, sariq bog'ich-arqon,
// ustida yulduzchalar. open=true: og'zi ochiq (to'q ichki ellips), arqon bo'shagan.
const BagStars = () => (
  <g>
    <g className="pq-bagstar" style={{ animationDuration: '1.7s' }} transform="translate(37,52) scale(.5)"><path d={STAR_D} fill="#f2d54f" /></g>
    <g className="pq-bagstar" style={{ animationDuration: '2.3s', animationDelay: '-.8s' }} transform="translate(55,68) scale(.42)"><path d={STAR_D} fill="#f2d54f" /></g>
    <g className="pq-bagstar" style={{ animationDuration: '2s', animationDelay: '-1.4s' }} transform="translate(27,76) scale(.38)"><path d={STAR_D} fill="#f2d54f" /></g>
  </g>
);
const Bag = ({ open }) => (
  <svg viewBox="0 0 96 112" width="92" height="107" aria-hidden="true" style={{ display: 'block' }}>
    {open ? (
      <g>
        <path d="M30 36 Q8 52 10 79 Q12 103 48 105 Q84 103 86 79 Q88 52 66 36 Q48 44 30 36 Z" fill="#6b4a9e" stroke="#3d2a63" strokeWidth="2" strokeLinejoin="round" />
        <path d="M66 36 Q88 52 86 79 Q85 96 66 102 Q78 92 78 76 Q78 54 62 40 Z" fill="#563a85" />
        <ellipse className="pq-shine" cx="30" cy="64" rx="9" ry="17" fill="#9d7cd4" opacity=".45" transform="rotate(14 30 64)" />
        <ellipse cx="48" cy="36" rx="20" ry="8.5" fill="#2c1d4a" stroke="#3d2a63" strokeWidth="2" />
        <path d="M28 38.5 Q48 48 68 38.5 Q60 45 48 45.5 Q36 45 28 38.5 Z" fill="#8a67c2" />
        <path d="M28 52 Q48 60 68 52" stroke="#f2b134" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="66" cy="53" r="3.4" fill="#f2b134" stroke="#b97c14" strokeWidth="1" />
        <BagStars />
      </g>
    ) : (
      <g>
        <path d="M34 16 Q39 5 48 9 Q57 3 62 16 L59 30 L37 30 Z" fill="#7c58b0" stroke="#3d2a63" strokeWidth="2" strokeLinejoin="round" />
        <path d="M36 30 Q10 46 12 78 Q14 103 48 105 Q82 103 84 78 Q86 46 60 30 Q48 36 36 30 Z" fill="#6b4a9e" stroke="#3d2a63" strokeWidth="2" strokeLinejoin="round" />
        <path d="M60 30 Q86 46 84 78 Q83 96 64 102 Q76 92 76 76 Q76 50 56 34 Z" fill="#563a85" />
        <ellipse className="pq-shine" cx="31" cy="62" rx="9" ry="17" fill="#9d7cd4" opacity=".45" transform="rotate(14 31 62)" />
        <path d="M34 27 Q48 34 62 27" stroke="#f2b134" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="48" cy="31" r="3.6" fill="#f2b134" stroke="#b97c14" strokeWidth="1" />
        <path className="pq-rope" d="M48 33 q-3 6 -7 8 M48 33 q4 5 3 10" stroke="#f2b134" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <BagStars />
      </g>
    )}
  </svg>
);

// Sumkadan chiqadigan koptoklar (g'alaba) — yakuniy joy + kechikish.
const POP_BALLS = [
  { x: 198, y: 52 }, { x: 226, y: 30 }, { x: 254, y: 50 },
];
// Yulduzcha-uchqunlar (g'alaba).
const SPARKS = [
  { x: 188, y: 78, d: 0, s: 13 }, { x: 272, y: 66, d: .3, s: 11 }, { x: 206, y: 108, d: .6, s: 10 },
  { x: 280, y: 104, d: .15, s: 12 }, { x: 238, y: 96, d: .45, s: 9 },
];
// Havoda doim suzib yuruvchi mayda sehr-uchqunlari: pastdan tepaga, so'nadi, loop.
// Har biri o'z x/delay/duration bilan — hech qachon sinxron emas.
const FLOATS = [
  { x: 126, y: 130, s: 7, dur: 4.2, d: 0 },
  { x: 160, y: 150, s: 6, dur: 5.1, d: -1.7 },
  { x: 184, y: 118, s: 8, dur: 4.6, d: -2.9 },
  { x: 106, y: 154, s: 6, dur: 5.6, d: -3.8 },
];

export default function D05_09(props) {
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
    <div className="pq pq0509" ref={fitRef}>
      <style>{`
        .pq0509{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0509 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a3fa8;text-transform:uppercase;}
        .pq0509 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0509 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0509 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0509 .pq-fit{position:relative;margin:0 auto;}
        .pq0509 .pq-scene{box-sizing:border-box;position:relative;width:300px;height:200px;border-radius:20px;background:linear-gradient(#43306e 0%,#5a4590 58%,#7a68b4 100%);border:2px solid #8d7cc4;overflow:hidden;}
        .pq0509 .pq-floor{position:absolute;left:0;right:0;bottom:0;height:26px;background:#382a5e;}
        .pq0509 .pq-spot{position:absolute;left:50%;bottom:2px;transform:translateX(-50%);width:264px;height:34px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,246,214,.35),transparent 70%);animation:pqBreath 4.4s ease-in-out infinite;}
        .pq0509 .pq-bgstar{position:absolute;opacity:.3;animation:pqBgTw 6s ease-in-out infinite;}
        .pq0509 .pq-float{position:absolute;line-height:0;opacity:0;pointer-events:none;animation:pqFloat 4.5s ease-in-out infinite;}
        .pq0509 .pq-tablewrap{position:absolute;left:16px;bottom:6px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.25));}
        .pq0509 .pq-wand{position:absolute;left:142px;bottom:2px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));}
        .pq0509 .pq-wandstar{transform-box:fill-box;transform-origin:center;animation:pqStarPulse 1.6s ease-in-out infinite;}
        .pq0509 .pq-wandring{transform-box:fill-box;transform-origin:center;opacity:0;animation:pqRing 3s ease-out infinite;}
        .pq0509 .pq-bagwrap{position:absolute;right:16px;bottom:8px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));transform-origin:50% 92%;animation:pqSway 2.8s ease-in-out infinite;transition:transform .4s ease;}
        .pq0509 .pq-bagwrap.open{animation:none;transform:rotate(-7deg);}
        .pq0509 .pq-rope{transform-box:fill-box;transform-origin:50% 0%;animation:pqRope 2.1s ease-in-out infinite;}
        .pq0509 .pq-shine{animation:pqShimmer 2.6s ease-in-out infinite;}
        .pq0509 .pq-bagstar{animation:pqTwinkle 1.9s ease-in-out infinite;}
        .pq0509 .pq-ball{position:absolute;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.28));}
        .pq0509 .pq-bob{display:block;line-height:0;animation:pqBob 2.6s ease-in-out infinite;}
        .pq0509 .pq-ball.tb{animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0509 .pq-ball.pop{animation:pqPopOut .65s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0509 .pq-cnt{position:absolute;top:-8px;right:-9px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;border:1.5px solid #fff;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:2;}
        .pq0509 .pq-spark{position:absolute;line-height:0;animation:pqSpark 1.5s ease-in-out infinite;}
        .pq0509 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:3px 14px;border-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.28);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0509 .pq-opts{display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap;}
        .pq0509 .pq-opt{width:66px;height:66px;font-size:28px;font-weight:800;border-radius:16px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0509 .pq-opt:hover:not(:disabled){border-color:#c3aede;transform:translateY(-2px);}
        .pq0509 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0509 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0509 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0509 .pq-opt:disabled{cursor:default;}
        .pq0509 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0509 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0509 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-32px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqPopOut{0%{opacity:0;transform:translateY(52px) scale(.2);}55%{opacity:1;}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pqSway{0%,100%{transform:rotate(-2.2deg);}50%{transform:rotate(2.4deg);}}
        @keyframes pqShimmer{0%,100%{opacity:.22;}50%{opacity:.6;}}
        @keyframes pqTwinkle{0%,100%{opacity:.55;}50%{opacity:1;}}
        @keyframes pqStarPulse{0%,100%{transform:scale(1);opacity:.85;}50%{transform:scale(1.2);opacity:1;}}
        @keyframes pqSpark{0%{opacity:0;transform:scale(.2) rotate(0deg);}40%{opacity:1;transform:scale(1) rotate(20deg);}100%{opacity:0;transform:scale(.3) rotate(45deg);}}
        @keyframes pqRing{0%{opacity:0;transform:scale(.35);}6%{opacity:.85;}26%{opacity:0;transform:scale(1.5);}100%{opacity:0;transform:scale(1.5);}}
        @keyframes pqRope{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(6deg);}}
        @keyframes pqBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
        @keyframes pqFloat{0%{opacity:0;transform:translateY(0) scale(.5) rotate(0deg);}12%{opacity:.85;}60%{opacity:.5;}100%{opacity:0;transform:translateY(-48px) scale(1) rotate(40deg);}}
        @keyframes pqBgTw{0%,100%{opacity:.16;}50%{opacity:.5;}}
        @keyframes pqBreath{0%,100%{opacity:.7;transform:translateX(-50%) scaleX(1);}50%{opacity:1;transform:translateX(-50%) scaleX(1.05);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 300 * scale, height: 200 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-bgstar" style={{ left: 26, top: 16, animationDuration: '5.5s', animationDelay: '-1.2s' }}><Star size={10} /></span>
        <span className="pq-bgstar" style={{ left: 92, top: 8, animationDuration: '7s', animationDelay: '-3.4s' }}><Star size={8} /></span>
        <span className="pq-bgstar" style={{ left: 152, top: 24, animationDuration: '6.2s', animationDelay: '-5s' }}><Star size={9} /></span>
        <span className="pq-bgstar" style={{ left: 258, top: 14, animationDuration: '6.8s', animationDelay: '-2.3s' }}><Star size={8} /></span>
        <span className="pq-floor" />
        <span className="pq-spot" />

        {FLOATS.map((f, i) => (
          <span key={i} className="pq-float" style={{ left: f.x, top: f.y, animationDuration: `${f.dur}s`, animationDelay: `${f.d}s` }}><Star size={f.s} color="#ffe58a" /></span>
        ))}

        <div className="pq-tablewrap"><Table /></div>
        {Array.from({ length: DATA.shown }).map((_, i) => (
          <span key={i} className="pq-ball tb" style={{ left: 45 + i * 36, top: 87, animationDelay: `${i * 0.12}s` }}>
            <span className="pq-bob" style={{ animationDelay: `${-1.3 * i - 0.2}s` }}>
              <Ball c={BALL_COLORS[i % 4]} gid={`pq0509g${i}`} />
            </span>
            {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.15}s` }}>{i + 1}</b>}
          </span>
        ))}

        <div className="pq-wand"><Wand /></div>
        <div className={'pq-bagwrap' + (ok ? ' open' : '')}><Bag open={!!ok} /></div>

        {ok && POP_BALLS.map((p, i) => (
          <span key={i} className="pq-ball pop" style={{ left: p.x, top: p.y, animationDelay: `${0.2 + i * 0.18}s` }}>
            <span className="pq-bob" style={{ animationDelay: `${-0.95 * i - 0.4}s`, animationDuration: '3s' }}>
              <Ball c={BALL_COLORS[(DATA.shown + i) % 4]} gid={`pq0509p${i}`} />
            </span>
            <b className="pq-cnt" style={{ animationDelay: `${0.9 + i * 0.18}s` }}>{DATA.shown + i + 1}</b>
          </span>
        ))}
        {ok && SPARKS.map((s, i) => (
          <span key={i} className="pq-spark" style={{ left: s.x, top: s.y, animationDelay: `${s.d}s` }}><Star size={s.s} /></span>
        ))}
        {ok && <span className="pq-chip">{DATA.shown} + {DATA.target} = {DATA.total}</span>}
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
