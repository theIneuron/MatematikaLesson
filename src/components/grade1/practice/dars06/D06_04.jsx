// Dars06 · Amaliyot 04 — P5 Ikki rangli o'nlik-ramka o'qish («5 va yana 2») · 🟡 · tag: two_color_read
// Avtobus o'rindiq-ramkasi: 1-qator to'liq 5 QIZIL yo'lovchi, 2-qatorda 2 YASHIL; jami = 7.
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

const DATA = { red: 5, green: 2, target: 7, options: [6, 7, 8], ptype: 'P5', level: '🟡', tag: 'two_color_read' };
// Katak tartibi sahna tartibida: 0-4 qizil (1-qator), 5-6 yashil, 7-9 bo'sh (2-qator).
const KINDS = ['red', 'red', 'red', 'red', 'red', 'green', 'green', null, null, null];
const T = {
  uz: {
    eyebrow: "Avtobus sayohati · Salon", title: "Ikki rangli salon",
    setup: "Avtobus salonida ikki qator o'rindiq: birinchisi to'la qizil, ikkinchisida yashillar.",
    ask: "Salonda jami nechta yo'lovchi o'tiribdi?",
    correct: "Barakalla! To'liq beshlik va yana ikki — yetti.",
    hint: "Avval to'liq qizil beshlikni oling, keyin yashillarni qo'shib sanang.",
  },
  ru: {
    eyebrow: 'Автобусное путешествие · Салон', title: 'Двухцветный салон',
    setup: 'В салоне автобуса два ряда сидений: первый полностью красный, во втором — зелёные.',
    ask: 'Сколько всего пассажиров сидит в салоне?',
    correct: 'Молодец! Полная пятёрка и ещё два — семь.',
    hint: 'Сначала возьми полную красную пятёрку, потом досчитай зелёных.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// YO'LOVCHI KANONI: dumaloq teri-rang bosh (#f2c096, kontur #c98d5f), blikli ikki ko'z,
// tabassum, rangli kepka (yarim-doira + gardish) + yelka-ko'ylak yoyi. Ko'z pirpiratadi
// (teri-rang qovoq-rect, pqBlink). Bitta yo'lovchi = bitta bosh.
const SUIT = {
  red: { cap: '#d9534b', line: '#a33630' },
  green: { cap: '#57a84f', line: '#3a7a35' },
};
const Passenger = ({ kind, blinkDelay }) => {
  const c = SUIT[kind];
  return (
    <svg viewBox="0 0 40 42" width="34" height="36" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M7 42 Q20 27 33 42 Z" fill={c.cap} stroke={c.line} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="11.5" fill="#f2c096" stroke="#c98d5f" strokeWidth="1.4" />
      <ellipse cx="13.6" cy="25" rx="2" ry="1.3" fill="#eda28a" opacity=".55" />
      <ellipse cx="26.4" cy="25" rx="2" ry="1.3" fill="#eda28a" opacity=".55" />
      <circle cx="15.9" cy="21.8" r="1.7" fill="#1f2430" />
      <circle cx="16.5" cy="21.2" r="0.6" fill="#fff" />
      <circle cx="24.1" cy="21.8" r="1.7" fill="#1f2430" />
      <circle cx="24.7" cy="21.2" r="0.6" fill="#fff" />
      <g className="pq-blink" style={{ animationDelay: blinkDelay }}>
        <rect x="13.7" y="19.8" width="4.4" height="4" rx="1.9" fill="#f2c096" />
        <rect x="21.9" y="19.8" width="4.4" height="4" rx="1.9" fill="#f2c096" />
      </g>
      <path d="M16.6 27.2 Q20 29.8 23.4 27.2" stroke="#8a5f3a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M9 17 Q20 4.5 31 17 Z" fill={c.cap} stroke={c.line} strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="7.4" y="15.6" width="25.2" height="3.4" rx="1.7" fill={c.cap} stroke={c.line} strokeWidth="1.1" />
      <circle cx="20" cy="7" r="1.6" fill={c.line} />
    </svg>
  );
};

// G'ildirak: to'q doira + kulrang disk + 4 kegay (krest, SEKIN AYLANADI — pqWheel).
const Wheel = ({ cx, delay }) => (
  <g>
    <circle cx={cx} cy="69" r="13" fill="#2b2f36" stroke="#15181d" strokeWidth="1.6" />
    <circle cx={cx} cy="69" r="7" fill="#9aa2ad" stroke="#666d78" strokeWidth="1.3" />
    <g className="pq-wheel" style={{ animationDelay: delay }}>
      <line x1={cx - 5.2} y1="69" x2={cx + 5.2} y2="69" stroke="#565d68" strokeWidth="1.7" strokeLinecap="round" />
      <line x1={cx} y1="63.8" x2={cx} y2="74.2" stroke="#565d68" strokeWidth="1.7" strokeLinecap="round" />
    </g>
    <circle cx={cx} cy="69" r="1.9" fill="#454b55" />
  </g>
);

// AVTOBUS KANONI: yon ko'rinish sariq shahar avtobusi — tana 2 ton (#f2b134 / #d99a1a,
// kontur #a8721a), tomi ochroq, oldida fara + eshik, derazalar oq-havorang (#dff1fb).
const Bus = () => (
  <svg viewBox="0 0 180 92" width="172" height="88" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="12" y="14" width="152" height="10" rx="5" fill="#f8d67f" stroke="#a8721a" strokeWidth="1.5" />
    <rect x="4" y="20" width="168" height="50" rx="10" fill="#f2b134" stroke="#a8721a" strokeWidth="2" />
    <rect x="6" y="56" width="164" height="12" rx="5" fill="#d99a1a" />
    <path d="M6 54 L170 54" stroke="#a8721a" strokeWidth="1.4" opacity=".7" />
    <rect x="14" y="28" width="30" height="20" rx="3" fill="#dff1fb" stroke="#8fb4c9" strokeWidth="1.4" />
    <rect x="50" y="28" width="30" height="20" rx="3" fill="#dff1fb" stroke="#8fb4c9" strokeWidth="1.4" />
    <rect x="86" y="28" width="30" height="20" rx="3" fill="#dff1fb" stroke="#8fb4c9" strokeWidth="1.4" />
    <rect x="134" y="28" width="22" height="40" rx="3" fill="#dff1fb" stroke="#a8721a" strokeWidth="1.6" />
    <line x1="145" y1="29" x2="145" y2="67" stroke="#8fb4c9" strokeWidth="1.4" />
    <circle cx="167" cy="52" r="4.2" fill="#fff3c0" stroke="#a8721a" strokeWidth="1.3" />
    <Wheel cx={44} delay="0s" />
    <Wheel cx={132} delay="-3.5s" />
  </svg>
);

// Ramka tepasidagi kichik avtobus-piktogramma (o'rindiq-xarita sarlavhasi).
const BusMini = () => (
  <svg viewBox="0 0 34 20" width="30" height="18" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="1" y="1.5" width="32" height="13" rx="4" fill="#f2b134" stroke="#a8721a" strokeWidth="1.4" />
    <rect x="4.5" y="4.5" width="6.5" height="5" rx="1.4" fill="#dff1fb" />
    <rect x="13.5" y="4.5" width="6.5" height="5" rx="1.4" fill="#dff1fb" />
    <rect x="22.5" y="4.5" width="6.5" height="5" rx="1.4" fill="#dff1fb" />
    <circle cx="9" cy="15.5" r="3" fill="#2b2f36" /><circle cx="9" cy="15.5" r="1.2" fill="#9aa2ad" />
    <circle cx="25" cy="15.5" r="3" fill="#2b2f36" /><circle cx="25" cy="15.5" r="1.2" fill="#9aa2ad" />
  </svg>
);

export default function D06_04(props) {
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
  const [fitRef, scale] = useFitScale(330);

  return (
    <div className="pq pq0604" ref={fitRef}>
      <style>{`
        .pq0604{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0604 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#b06e24;text-transform:uppercase;}
        .pq0604 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0604 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0604 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0604 .pq-scene{box-sizing:border-box;position:relative;width:330px;height:292px;border-radius:20px;background:linear-gradient(#cfe9fb 0%,#e6f5ff 60%,#dff0fa 100%);border:2px solid #c4dff0;overflow:hidden;}
        .pq0604 .pq-fit{position:relative;margin:0 auto;}
        .pq0604 .pq-sun{position:absolute;top:10px;right:14px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff3c0,#f9c62f 70%,#f0ab18);box-shadow:0 0 18px 4px rgba(249,198,47,.55);animation:pqSun 3.6s ease-in-out infinite;}
        .pq0604 .pq-cloud{position:absolute;width:52px;height:16px;background:#fff;border-radius:999px;opacity:.9;box-shadow:16px 5px 0 -4px #fff,-15px 6px 0 -5px #fff,4px -6px 0 -3px #fff;animation:pqCloud linear infinite;}
        .pq0604 .pq-cloud.c1{top:18px;left:-70px;animation-duration:28s;animation-delay:-10s;}
        .pq0604 .pq-cloud.c2{top:44px;left:-70px;width:38px;height:12px;opacity:.7;animation-duration:37s;animation-delay:-22s;}
        .pq0604 .pq-chip{position:absolute;top:5px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:6;white-space:nowrap;}
        .pq0604 .pq-card{position:absolute;left:50%;top:42px;transform:translateX(-50%);background:#fff;border:2px solid #d7e3ee;border-radius:16px;padding:7px 10px 11px;box-shadow:0 4px 12px rgba(31,36,48,.1);z-index:2;}
        .pq0604 .pq-card.win{animation:pqCele .5s ease;}
        .pq0604 .pq-fhead{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:6px;}
        .pq0604 .pq-fhead i{display:block;width:26px;height:2.5px;border-radius:2px;background:#d7e3ee;}
        .pq0604 .pq-grid{display:grid;grid-template-columns:repeat(5,42px);grid-auto-rows:42px;gap:6px;}
        .pq0604 .pq-cell{background:#fff;border:2px solid #b9c1cf;border-radius:9px;display:flex;align-items:center;justify-content:center;}
        .pq0604 .pq-seat{position:relative;line-height:0;animation:pqDrop .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0604 .pq-blink{opacity:0;animation:pqBlink 3.8s linear infinite;}
        .pq0604 .pq-cnt{position:absolute;top:-7px;right:-7px;min-width:17px;height:17px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0604 .pq-road{position:absolute;left:0;right:0;bottom:0;height:32px;background:linear-gradient(#98a0aa,#7f8791);border-top:3px solid #6b727c;}
        .pq0604 .pq-dash{position:absolute;left:0;right:0;bottom:13px;height:3px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.75) 0 16px,transparent 16px 32px);}
        .pq0604 .pq-buswrap{position:absolute;left:50%;bottom:3px;animation:pqBusIdle 2.6s ease-in-out infinite;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));z-index:1;}
        .pq0604 .pq-wheel{transform-box:fill-box;transform-origin:50% 50%;animation:pqWheel 7s linear infinite;}
        .pq0604 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0604 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pq0604 .pq-opt:hover:not(:disabled){border-color:#e9c98f;transform:translateY(-2px);}
        .pq0604 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0604 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0604 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0604 .pq-opt:disabled{cursor:default;}
        .pq0604 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:14px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0604 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0604 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSun{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}
        @keyframes pqCloud{from{transform:translateX(0);}to{transform:translateX(430px);}}
        @keyframes pqBlink{0%,88%{opacity:0;}91%,95%{opacity:1;}98%,100%{opacity:0;}}
        @keyframes pqWheel{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes pqBusIdle{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,-1.5px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-26px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-fit" style={{ width: 330 * scale, height: 292 * scale }}>
      <div className="pq-scene" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <span className="pq-sun" />
        <span className="pq-cloud c1" /><span className="pq-cloud c2" />
        {ok && <span className="pq-chip">{DATA.red} + {DATA.green} = {DATA.target}</span>}

        {/* O'NLIK-RAMKA avtobus o'rindiq-xaritasi sifatida: tepada mini-avtobus piktogrammasi */}
        <div className={'pq-card' + (ok ? ' win' : '')}>
          <div className="pq-fhead"><i /><BusMini /><i /></div>
          <div className="pq-grid">
            {KINDS.map((kind, i) => (
              <div key={i} className="pq-cell">
                {kind && (
                  <span className="pq-seat" style={{ animationDelay: `${i * 0.07}s` }}>
                    <Passenger kind={kind} blinkDelay={`${-(i * 0.55)}s`} />
                    {ok && <b className="pq-cnt" style={{ animationDelay: `${i * 0.09}s` }}>{i + 1}</b>}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pq-road"><span className="pq-dash" /></div>
        <div className="pq-buswrap"><Bus /></div>
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
