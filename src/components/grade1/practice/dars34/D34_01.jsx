// Dars34 · Amaliyot 01 — «Detsimetr va metr» · Blok 7 · Chizg'ich bilan o'lchash (measure_cm) · 🟢
// Chizg'ich (sm shkalasi 0..15, dm belgilari 0/10 uzunroq) ustida qalam 0 dan 6 gacha yotibdi. «Qalam necha sm?»
// Variantlar (matn): 5 sm / 6 sm / 7 sm — to'g'ri = 6 sm (index 1, chapdan emas). Distraktorlar: 5/7 (bir birlik xato o'qish).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint «Chizg'ich raqamiga qarang».
// ANSWER-LEAK: chizg'ich+qalam — DATA (ko'rsatish adolatli), javob bola o'qishi; g'alabagacha variant yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri variant statik yashil holatini ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEN = 6;                 // qalam uzunligi (sm)
const MARKS = 15;              // chizg'ich shkalasi 0..15 sm
const OPTIONS = ['5 sm', '6 sm', '7 sm']; // to'g'ri = index 1
const CORRECT = '6 sm';
const DATA = { len: LEN, options: OPTIONS, correct: CORRECT, level: '🟢', tag: 'measure_cm' };

const T = {
  uz: {
    eyebrow: "O'lchash · Uzunlik", title: "Chizg'ich",
    ask: "Qalam necha sm?",
    correct: "Barakalla! Qalam — 6 sm.",
    hint: "Chizg'ich raqamiga qarang.",
  },
  ru: {
    eyebrow: "Измерение · Длина", title: "Линейка",
    ask: "Сколько см карандаш?",
    correct: "Молодец! Карандаш — 6 см.",
    hint: "Смотри на цифру линейки.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// RULER-SVG kanon: viewBox 0 0 330 96, 0-belgi x=16, har sm = 20px, N-belgi x=16+N*20.
// dm belgilari (0 va 10) uzunroq/qalinroq. Qalam chizg'ich USTIDA, chap uchi 0-belgida, o'ng uchi 16+LEN*20 da.
const X0 = 16, STEP = 20;
const xAt = (n) => X0 + n * STEP;

const RulerScene = ({ on }) => {
  const ticks = [];
  for (let n = 0; n <= MARKS; n++) {
    const x = xAt(n);
    const isDm = n % 10 === 0;               // dm belgisi (0, 10)
    const h = isDm ? 22 : 12;                 // uzunroq tik
    ticks.push(<line key={'t' + n} x1={x} y1={54} x2={x} y2={54 + h} stroke="#7a5a2b" strokeWidth={isDm ? 2.4 : 1.1} />);
    ticks.push(<text key={'n' + n} x={x} y={90} textAnchor="middle" fontSize="9" fontWeight={isDm ? 800 : 600} fill="#5c421f" fontFamily="'JetBrains Mono',monospace">{n}</text>);
  }
  const pencilX = xAt(LEN);
  return (
    <svg viewBox="0 0 330 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* Qalam: chap uchi 0-belgida (x=16), o'ng uchi 6-belgida (x=136). Uzunligi qiymatga mos. */}
      <g className="pq-pencil">
        <rect x={X0} y={22} width={pencilX - X0 - 14} height={16} rx={2} fill="#f6c445" stroke="#c99a1e" strokeWidth="1.2" />
        <rect x={X0} y={22} width={10} height={16} fill="#e8a63c" />
        <polygon points={`${pencilX - 14},22 ${pencilX},30 ${pencilX - 14},38`} fill="#f2d3a0" stroke="#c99a1e" strokeWidth="1.2" strokeLinejoin="round" />
        <polygon points={`${pencilX - 5},27 ${pencilX},30 ${pencilX - 5},33`} fill="#3a3a3a" />
      </g>
      {/* Chizg'ich tanasi */}
      <rect x="4" y="50" width="322" height="30" rx="5" fill={on ? '#f2e2be' : '#e8c98a'} stroke="#b98a3e" strokeWidth="1.4" />
      {ticks}
    </svg>
  );
};

export default function D34_01(props) {
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
    const correct = picked === CORRECT;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: t.ask, options: OPTIONS, studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3401" + (still ? " still" : "")}>
      <style>{`
        .pq3401.still *{animation:none !important;}
        .pq3401.still .pq-spark{opacity:1;}
        .pq3401{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3401 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3401 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3401 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3401 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:40px 14px 18px;border-radius:20px;background:linear-gradient(#fbf7ef 0%,#f2ead8 100%);border:2px solid #e6d6b4;overflow:hidden;}
        .pq3401 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79a4a,#a97e34);border:2.5px solid #8c6626;color:#fff8ec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3401 .pq-scene{box-sizing:border-box;position:relative;z-index:3;width:100%;margin:0 auto 6px;padding:6px 6px 2px;border-radius:14px;background:rgba(255,255,255,.72);border:2px solid #e2d3af;}
        .pq3401 .pq-ruler{width:100%;height:104px;}
        .pq3401 .pq-pencil{animation:pq3401lay .5s ease both;}
        .pq3401 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px;}
        .pq3401 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:15px;background:rgba(255,255,255,.97);border:3px solid #e0d3b4;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(90,70,30,.12);font-size:19px;font-weight:800;color:#5c421f;letter-spacing:.01em;}
        .pq3401 .pq-opt:hover:not(:disabled){background:#fdf7e8;border-color:#d3bd85;}
        .pq3401 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3401 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3401 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3401cele .5s ease;}
        .pq3401 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3401 .pq-opt:disabled{cursor:default;}
        .pq3401 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3401pop .45s ease both;}
        .pq3401 .pq-spark{position:absolute;z-index:5;color:#ffd13f;opacity:0;line-height:0;pointer-events:none;animation:pq3401tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,209,63,.6));}
        .pq3401 .pq-spark.s2{animation-delay:-.6s;} .pq3401 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3401 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3401in .22s ease both;}
        .pq3401 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3401 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3401lay{from{opacity:0;transform:translateX(-14px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pq3401pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3401tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3401cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3401in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Chizg'ich + qalam (DATA: bola o'zi o'qiydi). Chap uch 0-belgida, o'ng uch 6-belgida. */}
        <div className="pq-scene">
          <div className="pq-ruler"><RulerScene on={ok} /></div>
        </div>

        {/* Matn-variantlar: to'g'ri = 6 sm (index 1). G'alabagacha neytral (yashil emas). */}
        <div className="pq-opts">
          {OPTIONS.map((o) => {
            const sel = picked === o;
            const right = ok && o === CORRECT;
            const dim = ok && o !== CORRECT;
            return (
              <button
                key={o}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o); setFeedback(null); }}
              >
                {uL(o)}
                {right && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '52px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '64px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '48%', top: '40px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
