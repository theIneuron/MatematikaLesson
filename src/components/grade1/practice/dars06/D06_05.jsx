// Dars06 · Amaliyot 05 — P2 Bo'sh o'rindiqlar (7 + 3 = 10 o'nlik juftligi) · 🟡 · tag: empty_seats
// Avtobus salonida o'nlik-ramka 2×5: 7 katak band (5 qizil + 2 yashil yo'lovchi), 3 katak shtrix-bo'sh.
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

const DATA = { total: 10, taken: 7, target: 3, options: [2, 3, 4], ptype: 'P2', level: "🟡", tag: 'empty_seats' };
// Yo'lovchi kanon-ranglari: birinchi 5 qizil, keyingi 2 yashil, qolgan 3 katak bo'sh (null).
const RED = { cap: '#d9534b', line: '#a33630' };
const GREEN = { cap: '#57a84f', line: '#3a7a35' };
const SEATS = [RED, RED, RED, RED, RED, GREEN, GREEN, null, null, null];

const T = {
  uz: {
    eyebrow: "Avtobus sayohati · O'rindiqlar", title: "Bo'sh o'rindiqlar",
    setup: "Avtobusda o'nta o'rindiq bor: yettitasi band, qolgani bo'sh.",
    ask: "Nechta o'rindiq bo'sh?",
    correct: "Barakalla! Yetti va uch — o'n. Hammaga joy yetadi!",
    hint: "Shtrixli bo'sh kataklarni birma-bir sanang.",
  },
  ru: {
    eyebrow: "Путешествие на автобусе · Места", title: "Свободные места",
    setup: "В автобусе десять мест: семь занято, остальные свободны.",
    ask: "Сколько мест свободно?",
    correct: "Молодец! Семь и три — десять. Всем хватит места!",
    hint: "Посчитай пустые клетки со штрихом одну за другой.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Yo'lovchi kanoni: teri-rang dumaloq bosh (#f2c096, kontur #c98d5f), blikli ikki ko'z,
// tabassum, rangli kepka (yarim-doira + gardish) va yelka-ko'ylak yoyi. Bitta yo'lovchi = bitta bosh.
const Passenger = ({ c, bd }) => (
  <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M7 40 Q20 27 33 40 Z" fill={c.cap} stroke={c.line} strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="20" cy="19" r="11" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.5" />
    <path d="M9.4 16.4 A11 11 0 0 1 30.6 16.4 Z" fill={c.cap} stroke={c.line} strokeWidth="1.3" strokeLinejoin="round" />
    <rect x="8.8" y="15" width="22.4" height="3" rx="1.5" fill={c.line} />
    <circle cx="16" cy="21.5" r="1.7" fill="#1f2430" /><circle cx="16.6" cy="20.9" r="0.6" fill="#fff" />
    <circle cx="24" cy="21.5" r="1.7" fill="#1f2430" /><circle cx="24.6" cy="20.9" r="0.6" fill="#fff" />
    <g className="pq-blink" style={{ animationDelay: bd }}>
      <rect x="13.9" y="19.5" width="4.2" height="3.8" rx="1.8" fill="#f2c096" />
      <rect x="21.9" y="19.5" width="4.2" height="3.8" rx="1.8" fill="#f2c096" />
    </g>
    <path d="M17 26 Q20 28.4 23 26" stroke="#b5885f" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

// G'ildirak: to'q doira + kulrang disk + 4 kegay (krest), ichki guruh pqWheel bilan SEKIN aylanadi.
const Wheel = ({ cx }) => (
  <g>
    <circle cx={cx} cy="162" r="23" fill="#2b2f36" stroke="#1f2430" strokeWidth="2.5" />
    <g className="pq-wheel">
      <circle cx={cx} cy="162" r="11.5" fill="#c9ced6" stroke="#8b93a1" strokeWidth="1.6" />
      <line x1={cx - 9} y1="162" x2={cx + 9} y2="162" stroke="#8b93a1" strokeWidth="2.2" />
      <line x1={cx} y1="153" x2={cx} y2="171" stroke="#8b93a1" strokeWidth="2.2" />
      <circle cx={cx} cy="162" r="3" fill="#5c6672" />
    </g>
  </g>
);

// Avtobus kanoni: yon ko'rinish sariq shahar avtobusi — tana 2 ton (#f2b134 / #d99a1a,
// kontur #a8721a), ochroq tom, oldida fara + eshik, katta salon oynasi (#dff1fb) — uning
// ustiga HTML o'nlik-ramka qo'yiladi.
const Bus = () => (
  <svg viewBox="0 0 320 196" width="320" height="196" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="6" y="28" width="296" height="116" rx="18" fill="#f2b134" stroke="#a8721a" strokeWidth="3" />
    <rect x="12" y="118" width="284" height="22" rx="8" fill="#d99a1a" />
    <rect x="14" y="18" width="280" height="16" rx="8" fill="#f8d67f" stroke="#a8721a" strokeWidth="2" />
    <rect x="20" y="44" width="222" height="96" rx="10" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
    <rect x="250" y="52" width="40" height="88" rx="6" fill="#dff1fb" stroke="#a8721a" strokeWidth="2" />
    <line x1="270" y1="55" x2="270" y2="137" stroke="#a8721a" strokeWidth="1.6" />
    <circle cx="295" cy="126" r="6" fill="#fff3c0" stroke="#a8721a" strokeWidth="2" />
    <rect x="3" y="116" width="7" height="13" rx="2.5" fill="#d9534b" stroke="#a33630" strokeWidth="1.2" />
    <Wheel cx={70} />
    <Wheel cx={240} />
  </svg>
);

export default function D06_05(props) {
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
  const [fitRef, scale] = useFitScale(336);

  return (
    <div className="pq pq0605" ref={fitRef}>
      <style>{`
        .pq0605{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0605 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06e24;text-transform:uppercase;}
        .pq0605 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0605 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0605 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0605 .pq-scene{box-sizing:border-box;position:relative;width:336px;height:252px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 60%,#eef6fb 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0605 .pq-fit{position:relative;margin:0 auto;}
        .pq0605 .pq-sun{position:absolute;top:12px;right:16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0605 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0605 .pq-cloud.c1{top:20px;left:-70px;animation-duration:30s;animation-delay:-9s;}
        .pq0605 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:38s;animation-delay:-24s;}
        .pq0605 .pq-road{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#8b939e,#6f7883);}
        .pq0605 .pq-road::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:#d8dde3;}
        .pq0605 .pq-road::after{content:'';position:absolute;left:0;right:0;top:12px;height:3px;background:repeating-linear-gradient(90deg,#f5f7fa 0 18px,transparent 18px 34px);opacity:.85;}
        .pq0605 .pq-bus{position:absolute;left:50%;bottom:12px;width:320px;height:196px;animation:pqIdle 2.6s ease-in-out infinite;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));}
        .pq0605 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 6s linear infinite;}
        .pq0605 .pq-frame{position:absolute;left:24px;top:51px;display:grid;grid-template-columns:repeat(5,38px);grid-auto-rows:38px;gap:6px;}
        .pq0605 .pq-seat{position:relative;width:38px;height:38px;border-radius:9px;background:#fff;border:2px solid #b9c1cf;display:flex;align-items:center;justify-content:center;}
        .pq0605 .pq-seat.empty{border-style:dashed;border-color:#9fb4d9;background:repeating-linear-gradient(45deg,#fff 0 5px,#eef4fb 5px 10px);animation:pqSeatPulse 2.4s ease-in-out infinite;}
        .pq0605 .pq-seat.empty.done{animation:none;box-shadow:none;}
        .pq0605 .pq-q{font-size:17px;font-weight:900;color:#7d97bd;animation:pqBreath 2.4s ease-in-out infinite;}
        .pq0605 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0605 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0605 .pq-chip{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:5;white-space:nowrap;}
        .pq0605 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0605 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0605 .pq-opt:hover:not(:disabled){border-color:#f0d3a3;transform:translateY(-2px);}
        .pq0605 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0605 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0605 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0605 .pq-opt:disabled{cursor:default;}
        .pq0605 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0605 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0605 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(430px);}}
        @keyframes pqIdle{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,-1.5px);}}
        @keyframes pqWheel{to{transform:rotate(360deg);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqSeatPulse{0%,100%{border-color:#9fb4d9;box-shadow:0 0 0 0 rgba(79,143,196,0);}50%{border-color:#4f8fc4;box-shadow:0 0 0 3px rgba(79,143,196,.16);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);opacity:.75;}50%{transform:scale(1.14);opacity:1;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 336 * scale, height: 252 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        <span className="pq-road" />
        <div className="pq-bus">
          <Bus />
          <div className="pq-frame">
            {SEATS.map((c, i) => {
              if (c) {
                return (
                  <div key={i} className="pq-seat">
                    <Passenger c={c} bd={`${-(i * 0.55)}s`} />
                  </div>
                );
              }
              const k = i - DATA.taken; // 0..2 — bo'sh katak tartibi
              return (
                <div key={i} className={'pq-seat empty' + (ok ? ' done' : '')} style={{ animationDelay: `${-(k * 0.5)}s` }}>
                  {!ok && <span className="pq-q" style={{ animationDelay: `${-(k * 0.5)}s` }}>?</span>}
                  {ok && <b className="pq-cnt" style={{ animationDelay: `${k * 0.15}s` }}>{k + 1}</b>}
                </div>
              );
            })}
          </div>
        </div>
        {ok && <span className="pq-chip">{DATA.taken} + {DATA.target} = {DATA.total}</span>}
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
