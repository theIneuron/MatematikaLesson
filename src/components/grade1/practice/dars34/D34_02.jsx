// Dars34 · Amaliyot 02 — «Detsimetr va metr» · Blok 7 uzunlik · Chizg'ich bilan o'lchash (sm) · 🟢 · tag: measure_cm
// Chizg'ich (0..15 sm, dm belgilari 0 va 10 uzunroq) ustida lenta 0 dan 8 gacha. Savol: lenta necha sm?
// Variantlar (matn): '6 sm' (kalta o'qish), '8 sm' TO'G'RI (chapdan emas), '9 sm' (uzun o'qish).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint o'qishni o'rgatadi (o'ng uch qayerda?).
// ANSWER-LEAK: chizg'ich+lenta = DATA (ko'rsatish halol); javob = bolaning o'qishi; to'g'ri variant g'alabagacha yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri variant statik yashil holatini ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Lenta 0..8: chap uchi 0-belgida (x=16), o'ng uchi 8-belgida (x=16+8*20=176). 1 sm = 20px.
const LEN = 8;
const OPTIONS = [{ n: 6 }, { n: 8 }, { n: 9 }]; // TO'G'RI n=8 (index 1, chapda emas)
const CORRECT = 8;
const DATA = { length: LEN, unit: 'sm', options: OPTIONS.map((o) => o.n), correct: CORRECT, level: '🟢', tag: 'measure_cm' };

const T = {
  uz: {
    eyebrow: "Uzunlik · O'lchash", title: "Chizg'ich bilan o'lchang",
    ask: "Lenta necha sm?", unit: "sm",
    correct: "Barakalla! Lenta 8 sm.",
    hint: "Lentaning o'ng uchi qaysi songa to'g'ri keladi? O'sha son — javob.",
  },
  ru: {
    eyebrow: "Длина · Измерение", title: "Измерь линейкой",
    ask: "Сколько см в ленте?", unit: "см",
    correct: "Молодец! Лента 8 см.",
    hint: "На каком числе правый конец ленты? Это число — ответ.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizg'ich SVG kanon: viewBox 0 0 330 96, 0-belgi x=16, 1 sm = 20px; dm belgilari (0,10) uzunroq/qalinroq.
const MARKS = 15;
const X0 = 16, STEP = 20;
const Ruler = () => {
  const ticks = [];
  for (let i = 0; i <= MARKS; i++) {
    const x = X0 + i * STEP;
    const isDm = i % 10 === 0;
    ticks.push(
      <g key={i}>
        <line x1={x} y1={46} x2={x} y2={isDm ? 66 : 58} stroke={isDm ? '#7a5a1e' : '#9a7b3a'} strokeWidth={isDm ? 2 : 1} />
        <text x={x} y={80} textAnchor="middle" fontSize="9" fontWeight={isDm ? 800 : 600} fill="#6b5220" fontFamily="'JetBrains Mono',monospace">{i}</text>
      </g>
    );
  }
  const objRight = X0 + LEN * STEP;
  return (
    <svg viewBox="0 0 330 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* Lenta — chizg'ich ustida, chap uchi 0-belgida */}
      <g className="pq-obj">
        <rect x={X0} y={22} width={objRight - X0} height={14} rx={3} fill="#e2679b" stroke="#b83e75" strokeWidth="1.5" />
        <line x1={X0} y1={29} x2={objRight} y2={29} stroke="#f4b6d1" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1={X0} y1={20} x2={X0} y2={38} stroke="#b83e75" strokeWidth="1.5" />
        <line x1={objRight} y1={20} x2={objRight} y2={38} stroke="#b83e75" strokeWidth="1.5" />
      </g>
      {/* Chizg'ich tanasi (iliq yog'och) */}
      <rect x="6" y="44" width="318" height="40" rx="6" fill="#e8c98a" stroke="#c9a45c" strokeWidth="1.5" />
      {ticks}
    </svg>
  );
};

export default function D34_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
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
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS.map((o) => `${o.n} ${t.unit}`), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3402" + (still ? " still" : "")}>
      <style>{`
        .pq3402.still *{animation:none !important;}
        .pq3402{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3402 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3402 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3402 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3402 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:34px 15px 20px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ead6 100%);border:2px solid #e6d3a8;overflow:hidden;}
        .pq3402 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79338,#a6772a);border:2.5px solid #8a621f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3402 .pq-scene{position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto;}
        .pq3402 .pq-obj{animation:pq3402float 2.6s ease-in-out infinite;transform-origin:center;}
        .pq3402 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3402 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #dccfa8;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(80,60,20,.12);font-size:19px;font-weight:800;color:#5a4a22;letter-spacing:.02em;}
        .pq3402 .pq-opt:hover:not(:disabled){background:#fffaf0;border-color:#e6c976;}
        .pq3402 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3402 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3402 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3402cele .5s ease;}
        .pq3402 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3402 .pq-opt:disabled{cursor:default;}
        .pq3402 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3402pop .45s ease both;}
        .pq3402.still .pq-tick{animation:none;opacity:1;}
        .pq3402 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3402tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3402 .pq-spark.s2{animation-delay:-.6s;} .pq3402 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3402.still .pq-spark{opacity:1;}
        .pq3402 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3402in .22s ease both;}
        .pq3402 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3402 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3402float{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}
        @keyframes pq3402pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3402tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3402cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3402in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Chizg'ich + lenta = DATA (halol ko'rsatiladi); javob = bolaning o'qishi */}
        <div className="pq-scene"><Ruler /></div>

        {/* Matnli variantlar: to'g'ri (8 sm) chapda emas; g'alabagacha yashil emas */}
        <div className="pq-opts">
          {OPTIONS.map((o) => {
            const sel = picked === o.n;
            const right = ok && o.n === CORRECT;
            const dim = ok && o.n !== CORRECT;
            return (
              <button
                key={o.n}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.n); setFeedback(null); }}
              >
                {o.n} {t.unit}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '20px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
