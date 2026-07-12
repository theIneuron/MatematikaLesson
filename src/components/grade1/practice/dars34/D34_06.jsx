// Dars34 · Amaliyot 06 — «Qaysi uzunroq?» · Blok 7 uzunlik · Uzunlikni solishtir · 🟡 · tag: compare_len
// Ikki predmet chizg'ich ustida: A = 6 sm (qisqa qalam), B = 1 dm = 10 sm (uzun lenta). To'g'ri = '1 dm' (index 1, chapdan emas).
// Distraktor M1: bola 6 va 1 sonlarini solishtirib '6 sm' ni tanlaydi (sm/dm birlik aralashtirish). '2 dm' distraktor ham yo'q — 3 variant.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint birlikni o'rgatadi («1 dm — o'nta sm»).
// ANSWER-LEAK: chizg'ich+predmet DATA (halol ko'rsatiladi); javob = bolaning solishtirishi. G'alabagacha variantlar neytral.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); yashil holat statik ham beriladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Ikki predmet: A=6 sm, B=1 dm(=10 sm). To'g'ri variant '1 dm' — NOT-first (index 1).
const A_CM = 6, B_CM = 10;
const OPTS = [
  { id: '6 sm' },  // M1 tuzoq: 6 > 1 deb sonlarni solishtirish
  { id: '1 dm' },  // TO'G'RI: 10 sm > 6 sm (index 1)
  { id: 'teng' },  // teng emas
];
const TARGET = '1 dm';
const DATA = { a_cm: A_CM, b_cm: B_CM, target: TARGET, options: OPTS.map((o) => o.id), level: '🟡', tag: 'compare_len' };

const T = {
  uz: {
    eyebrow: "Uzunlik · Solishtirish", title: "Qaysi uzunroq?",
    ask: "Qaysi uzunroq?",
    a: "A — qalam", b: "B — lenta",
    correct: "Barakalla! 1 dm = 10 sm, 6 sm dan uzun.",
    hint: "1 dm — o'nta sm. O'nta bittadan uzun.",
    l_teng: "teng",
  },
  ru: {
    eyebrow: "Длина · Сравнение", title: "Что длиннее?",
    ask: "Что длиннее?",
    a: "A — карандаш", b: "B — лента",
    correct: "Молодец! 1 дм = 10 см, длиннее 6 см.",
    hint: "1 дм — это десять см. Десять длиннее одного.",
    l_teng: "равны",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizg'ich + predmet. Kanon: 0-belgi x=16, har sm=20px, belgi N = 16+N*20. dm belgilari (0 va 10) uzunroq/qalinroq.
// obj: 'pencil' | 'ribbon'; cm=uzunlik; won=g'alabada yashil.
const RulerScene = ({ cm, obj, color, won }) => {
  const x0 = 16, step = 20;
  const objRight = x0 + cm * step;
  const ticks = [];
  for (let n = 0; n <= 16; n++) {
    const x = x0 + n * step;
    if (x > 322) break;
    const isDm = n % 10 === 0; // dm belgisi: 0 va 10
    ticks.push(
      <g key={n}>
        <line x1={x} y1={isDm ? 40 : 50} x2={x} y2={70} stroke="#7a5a2a" strokeWidth={isDm ? 2.2 : 1} />
        <text x={x} y={82} textAnchor="middle" fontSize={isDm ? 10 : 9} fontWeight={isDm ? 800 : 600} fill="#6a4a1f">{n}</text>
      </g>
    );
  }
  const oStroke = won ? '#1a7f43' : color.s;
  const oFill = won ? '#dcf3e5' : color.f;
  return (
    <svg viewBox="0 0 330 96" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {/* Predmet — chizg'ich ustida, chap uchi 0-belgida */}
      {obj === 'pencil' && (<g>
        <rect x={x0} y={12} width={cm * step - 12} height={14} rx={3} fill={oFill} stroke={oStroke} strokeWidth={2} />
        <polygon points={`${objRight - 12},12 ${objRight},19 ${objRight - 12},26`} fill={won ? '#1a7f43' : '#d99a3c'} stroke={oStroke} strokeWidth={1.5} strokeLinejoin="round" />
      </g>)}
      {obj === 'ribbon' && (<g>
        <rect x={x0} y={12} width={cm * step} height={14} rx={4} fill={oFill} stroke={oStroke} strokeWidth={2} />
        <line x1={x0 + 6} y1={19} x2={objRight - 6} y2={19} stroke={oStroke} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
      </g>)}
      {/* Chizg'ich tanasi */}
      <rect x={4} y={34} width={322} height={38} rx={5} fill="#f2e2be" stroke="#c9a86a" strokeWidth={1.5} />
      {ticks}
    </svg>
  );
};

export default function D34_06(props) {
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
    <div className={"pq pq3406" + (still ? " still" : "")}>
      <style>{`
        .pq3406.still *{animation:none !important;}
        .pq3406{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3406 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c78a2a;text-transform:uppercase;}
        .pq3406 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3406 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3406 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:38px 14px 16px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f5ecd8 100%);border:2px solid #e6d6ac;overflow:hidden;}
        .pq3406 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#d79a3c,#b87a24);border:2.5px solid #9a6418;color:#fff8ec;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3406 .pq-row{position:relative;z-index:3;display:flex;align-items:center;gap:8px;margin-bottom:10px;}
        .pq3406 .pq-tag{flex:0 0 62px;font-size:12px;font-weight:800;color:#6a4a1f;line-height:1.25;}
        .pq3406 .pq-ruler{flex:1;min-width:0;height:74px;}
        .pq3406 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:4px;}
        .pq3406 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:13px 4px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #e0cfa4;cursor:pointer;transition:.12s;font-size:18px;font-weight:800;color:#5a4a2f;box-shadow:0 3px 8px rgba(80,60,20,.1);}
        .pq3406 .pq-opt:hover:not(:disabled){background:#fdf7e8;border-color:#d5b878;}
        .pq3406 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3406 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);}
        .pq3406 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3406cele .5s ease;}
        .pq3406 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3406 .pq-opt:disabled{cursor:default;}
        .pq3406 .pq-tick{position:absolute;top:-10px;right:-7px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3406pop .45s ease both;}
        .pq3406.still .pq-tick{animation:none;}
        .pq3406 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3406tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3406 .pq-spark.s2{animation-delay:-.6s;} .pq3406 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3406.still .pq-spark{opacity:1;}
        .pq3406 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3406in .22s ease both;}
        .pq3406 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3406 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3406pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3406tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3406cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3406in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Ikki predmet chizg'ich ustida — DATA (halol ko'rsatiladi). A=6 sm qalam, B=1 dm lenta. */}
        <div className="pq-row">
          <span className="pq-tag">{t.a}</span>
          <span className="pq-ruler"><RulerScene cm={A_CM} obj="pencil" color={{ s: '#c0791f', f: '#f6d79a' }} won={false} /></span>
        </div>
        <div className="pq-row">
          <span className="pq-tag">{t.b}</span>
          <span className="pq-ruler"><RulerScene cm={B_CM} obj="ribbon" color={{ s: '#3f6b8c', f: '#cfe0f2' }} won={ok} /></span>
        </div>

        {/* Variantlar — matn ('6 sm' / '1 dm' / teng). G'alabagacha neytral (javob-leak yo'q). */}
        <div className="pq-opts">
          {OPTS.map((o) => {
            const sel = picked === o.id;
            const right = ok && o.id === TARGET;
            const dim = ok && o.id !== TARGET;
            const label = o.id === 'teng' ? t.l_teng : uL(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(o.id); setFeedback(null); }}
              >
                {label}
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
