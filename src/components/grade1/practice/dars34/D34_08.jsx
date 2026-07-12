// Dars34 · Amaliyot 08 — «1 m necha dm?» · Blok 7 uzunlik · Metrni dm'ga aylantir · 🔴 · tag: convert_m
// Metr-chizg'ich 10 ta teng dm bo'lakka bo'lingan (0..10 dm belgilar, dm chegaralari uzun/qalin). To'g'ri = '10 dm' (index 1, chapdan emas).
// Distraktorlar: '1 dm' (M2: 1 dm = 1 dm deb bittani sanash), '100 dm' (M1: 1 m = 100 sm ni dm bilan aralashtirish).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint birlikni o'rgatadi («1 m — o'nta dm»).
// ANSWER-LEAK: metr-chizg'ich 10 bo'lakli DATA (halol ko'rsatiladi); javob = bolaning sanashi. G'alabagacha variantlar neytral.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); yashil holat va uchqunlar statik ham beriladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Metr-chizg'ich: 1 m = 10 dm. To'g'ri variant '10 dm' — NOT-first (index 1).
const OPTS = [
  { id: '1 dm' },    // M2 tuzoq: bir bo'lak = 1 dm deb butun metrni 1 deb sanash
  { id: '10 dm' },   // TO'G'RI: 1 m = 10 dm (index 1)
  { id: '100 dm' },  // M1 tuzoq: 1 m = 100 sm ni dm bilan aralashtirish
];
const TARGET = '10 dm';
const DATA = { meter_dm: 10, target: TARGET, options: OPTS.map((o) => o.id), level: '🔴', tag: 'convert_m' };

const T = {
  uz: {
    eyebrow: "Uzunlik · Metr", title: "1 m necha dm?",
    ask: "1 m necha dm?",
    mlab: "1 metr",
    correct: "Barakalla! 1 m = 10 dm.",
    hint: "1 m — o'nta dm. Bo'laklarni sanang.",
  },
  ru: {
    eyebrow: "Длина · Метр", title: "1 м — сколько дм?",
    ask: "1 м — сколько дм?",
    mlab: "1 метр",
    correct: "Молодец! 1 м = 10 дм.",
    hint: "1 м — это десять дм. Посчитай части.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Metr-chizg'ich: 10 ta teng dm bo'lak. Kanon: 0-belgi x=16, har dm = 30px, belgi N = 16+N*30 (N=0..10).
// dm chegaralari uzun/qalin. Bo'laklar galma-gal rangda; won=g'alabada yashil to'lqin.
const MeterScene = ({ won }) => {
  const x0 = 16, step = 30, N = 10; // 10 dm bo'lak -> 300px keng
  const segs = [];
  for (let i = 0; i < N; i++) {
    const x = x0 + i * step;
    const alt = i % 2 === 0;
    const fill = won ? (alt ? '#c9edd6' : '#dcf3e5') : (alt ? '#f6d79a' : '#fbe9c4');
    segs.push(<rect key={'s' + i} x={x} y={34} width={step} height={30} fill={fill} />);
  }
  const ticks = [];
  for (let n = 0; n <= N; n++) {
    const x = x0 + n * step;
    const isEnd = n === 0 || n === N; // metr chegaralari eng uzun
    ticks.push(
      <g key={'t' + n}>
        <line x1={x} y1={isEnd ? 28 : 32} x2={x} y2={68} stroke={won ? '#1a7f43' : '#7a5a2a'} strokeWidth={isEnd ? 2.6 : 1.6} />
        <text x={x} y={82} textAnchor="middle" fontSize={isEnd ? 10 : 9} fontWeight={isEnd ? 800 : 600} fill={won ? '#1a7f43' : '#6a4a1f'}>{n}</text>
      </g>
    );
  }
  const bodyStroke = won ? '#1a7f43' : '#c9a86a';
  return (
    <svg viewBox="0 0 330 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* 1 metr belgisi — butun uzunlik ustida qavs */}
      <g stroke={won ? '#1a7f43' : '#9a6418'} strokeWidth={1.6} fill="none">
        <line x1={x0} y1={18} x2={x0} y2={24} />
        <line x1={x0} y1={18} x2={x0 + N * step} y2={18} />
        <line x1={x0 + N * step} y1={18} x2={x0 + N * step} y2={24} />
      </g>
      <text x={x0 + (N * step) / 2} y={13} textAnchor="middle" fontSize={10} fontWeight={800} fill={won ? '#1a7f43' : '#8a5a14'}>1 m</text>
      {/* Metr-chizg'ich tanasi: 10 dm bo'lak */}
      {segs}
      <rect x={x0} y={34} width={N * step} height={30} rx={4} fill="none" stroke={bodyStroke} strokeWidth={1.6} />
      {ticks}
    </svg>
  );
};

export default function D34_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const uL = (s) => lang === 'ru' ? String(s).replace(/sm/g, 'см').replace(/dm/g, 'дм').replace(/m/g, 'м') : s;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlov + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint });
      if (initialAnswer.correct) setChecked(true);
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTS.map((o) => o.id), studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3408" + (still ? " still" : "")}>
      <style>{`
        .pq3408.still *{animation:none !important;}
        .pq3408{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3408 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c78a2a;text-transform:uppercase;}
        .pq3408 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3408 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3408 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:38px 14px 16px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f5ecd8 100%);border:2px solid #e6d6ac;overflow:hidden;}
        .pq3408 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d79a3c,#b87a24);border:2.5px solid #9a6418;color:#fff8ec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3408 .pq-scene{position:relative;z-index:3;height:104px;margin-bottom:12px;}
        .pq3408 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:4px;}
        .pq3408 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:13px 4px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #e0cfa4;cursor:pointer;transition:.12s;font-size:18px;font-weight:800;color:#5a4a2f;box-shadow:0 3px 8px rgba(80,60,20,.1);}
        .pq3408 .pq-opt:hover:not(:disabled){background:#fdf7e8;border-color:#d5b878;}
        .pq3408 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3408 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3408 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3408cele .5s ease;}
        .pq3408 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3408 .pq-opt:disabled{cursor:default;}
        .pq3408 .pq-tick{position:absolute;top:-10px;right:-7px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3408pop .45s ease both;}
        .pq3408.still .pq-tick{animation:none;}
        .pq3408 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3408tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3408 .pq-spark.s2{animation-delay:-.6s;} .pq3408 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3408.still .pq-spark{opacity:1;}
        .pq3408 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3408in .22s ease both;}
        .pq3408 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3408 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3408pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3408tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3408cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3408in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Metr-chizg'ich 10 ta teng dm bo'lakka bo'lingan — DATA (halol ko'rsatiladi). Javob = bo'laklarni sanash. */}
        <div className="pq-scene"><MeterScene won={ok} /></div>

        {/* Variantlar — matn ('1 dm' / '10 dm' / '100 dm'). G'alabagacha neytral (javob-leak yo'q). */}
        <div className="pq-opts">
          {OPTS.map((o) => {
            const sel = picked === o.id;
            const right = ok && o.id === TARGET;
            const dim = ok && o.id !== TARGET;
            return (
              <button
                key={o.id}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.id); setFeedback(null); }}
              >
                {uL(o.id)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '14%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '86%', top: '52px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '30px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
