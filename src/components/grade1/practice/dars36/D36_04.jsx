// Dars36 · Amaliyot 04 — «Piktogramma va jadval» · Blok 7 ma'lumot · 🟡 · tag: which_least
// Piktogramma (1 rasm = 1 dona): Olma=5, Nok=6, Banan=3. Savol: qaysi meva kam?
// Variantlar (matn): 'Olma'(5), 'Nok'(6, eng uzun qator — M2 aldov), 'Banan'(3) TO'G'RI (eng kalta, chapda emas).
// Aldovlar: M1 rasmlarni noto'g'ri sanash; M2 uzun qator = ko'p (aksincha); M3 qatorlarni chalkashtirish.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint eng kalta qatorni topishni o'rgatadi.
// ANSWER-LEAK: piktogramma = DATA (halol ko'rsatiladi); javob = bolaning sanashi; to'g'ri variant g'alabagacha yashil emas.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Piktogramma qatorlari: 1 rasm = 1 dona. Eng kalta qator = eng kam.
const CHART = [
  { key: 'Olma', n: 5, kind: 'apple' },
  { key: 'Nok', n: 6, kind: 'pear' },
  { key: 'Banan', n: 3, kind: 'banana' },
];
const OPTIONS = ['Olma', 'Nok', 'Banan']; // TO'G'RI 'Banan' (index 2, chapda emas)
const CORRECT = 'Banan';
const DATA = { chart: CHART.map((r) => ({ fruit: r.key, count: r.n })), options: OPTIONS, correct: CORRECT, level: '🟡', tag: 'which_least' };

const T = {
  uz: {
    eyebrow: "Ma'lumot · Piktogramma", title: 'Piktogramma',
    setup: "Har bir rasm — 1 dona meva.",
    ask: "Qaysi meva eng kam?",
    labels: { Olma: 'Olma', Nok: 'Nok', Banan: 'Banan' },
    correct: "Barakalla! Banan qatori eng kalta — banan eng kam, 3 ta.",
    hint: "Eng kalta qatorni toping — unda rasm eng kam. O'sha meva javob.",
  },
  ru: {
    eyebrow: "Данные · Пиктограмма", title: "Пиктограмма",
    setup: "Одна картинка — один фрукт.",
    ask: "Каких фруктов меньше всего?",
    labels: { Olma: 'Яблоки', Nok: 'Груши', Banan: 'Бананы' },
    correct: "Молодец! Ряд бананов самый короткий — бананов меньше всего, 3.",
    hint: "Найди самый короткий ряд — там меньше всего картинок. Этот фрукт — ответ.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// ——— YAGONA MEVA PALITRASI (D36_01 kanoni): olma #e5484d, nok #b5cf3f, banan #f2c94c ———
// Bitta sanaladigan rasm = bitta dona; realistik: gradient soya, yaltirash, bandi va barg.
// Barcha koordinatalar — RAQAM (x={..}).
const PFX = 'g3604'; // gradient-id prefiksi (fayl-unikal)
const FruitDefs = () => (
  <defs>
    <radialGradient id={PFX + 'ap'} cx="35%" cy="30%" r="85%">
      <stop offset="0%" stopColor="#ff9a8f" /><stop offset="55%" stopColor="#e5484d" /><stop offset="100%" stopColor="#b7343c" />
    </radialGradient>
    <linearGradient id={PFX + 'lf'} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#7ed07f" /><stop offset="100%" stopColor="#4caf50" />
    </linearGradient>
    <radialGradient id={PFX + 'pe'} cx="38%" cy="60%" r="80%">
      <stop offset="0%" stopColor="#d3e46a" /><stop offset="60%" stopColor="#b5cf3f" /><stop offset="100%" stopColor="#93ab2c" />
    </radialGradient>
    <linearGradient id={PFX + 'ba'} x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stopColor="#ffe07a" /><stop offset="55%" stopColor="#f2c94c" /><stop offset="100%" stopColor="#e0ac2b" />
    </linearGradient>
  </defs>
);
const FruitIcon = ({ kind, x, y }) => {
  const cx = x, cy = y;
  if (kind === 'apple') {
    return (
      <g>
        <path d={`M${cx} ${cy - 7} Q${cx + 0.6} ${cy - 11} ${cx + 3.2} ${cy - 13.4}`} stroke="#6b4a2b" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <ellipse cx={cx + 5.6} cy={cy - 11.4} rx={4.2} ry={2.3} fill={`url(#${PFX}lf)`} stroke="#3d8c40" strokeWidth={0.6} transform={`rotate(28 ${cx + 5.6} ${cy - 11.4})`} />
        <path d={`M${cx} ${cy - 6.2} C ${cx - 1.6} ${cy - 8.6} ${cx - 8} ${cy - 9} ${cx - 9.2} ${cy - 3} C ${cx - 10.2} ${cy + 2.6} ${cx - 5.8} ${cy + 8.8} ${cx - 1.6} ${cy + 8.8} C ${cx - 0.6} ${cy + 8} ${cx + 0.6} ${cy + 8} ${cx + 1.6} ${cy + 8.8} C ${cx + 5.8} ${cy + 8.8} ${cx + 10.2} ${cy + 2.6} ${cx + 9.2} ${cy - 3} C ${cx + 8} ${cy - 9} ${cx + 1.6} ${cy - 8.6} ${cx} ${cy - 6.2} Z`} fill={`url(#${PFX}ap)`} stroke="#b7343c" strokeWidth={0.8} />
        <ellipse cx={cx - 3.4} cy={cy - 2.4} rx={2.2} ry={3.4} fill="#fff" opacity={0.5} transform={`rotate(-18 ${cx - 3.4} ${cy - 2.4})`} />
      </g>
    );
  }
  if (kind === 'pear') {
    return (
      <g>
        <path d={`M${cx} ${cy - 11} q1.4 -2.6 3.8 -3.2`} stroke="#6b4a2b" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d={`M${cx} ${cy - 10.6} C ${cx - 3.2} ${cy - 10.6} ${cx - 4.4} ${cy - 7.4} ${cx - 3.8} ${cy - 4.6} C ${cx - 3.4} ${cy - 2.4} ${cx - 7.2} ${cy - 0.6} ${cx - 7.9} ${cy + 3.2} C ${cx - 8.7} ${cy + 7.9} ${cx - 4.5} ${cy + 11} ${cx} ${cy + 11} C ${cx + 4.5} ${cy + 11} ${cx + 8.7} ${cy + 7.9} ${cx + 7.9} ${cy + 3.2} C ${cx + 7.2} ${cy - 0.6} ${cx + 3.4} ${cy - 2.4} ${cx + 3.8} ${cy - 4.6} C ${cx + 4.4} ${cy - 7.4} ${cx + 3.2} ${cy - 10.6} ${cx} ${cy - 10.6} Z`} fill={`url(#${PFX}pe)`} stroke="#93ab2c" strokeWidth={0.8} />
        <ellipse cx={cx - 3} cy={cy + 4.4} rx={2} ry={3.1} fill="#fff" opacity={0.45} transform={`rotate(-14 ${cx - 3} ${cy + 4.4})`} />
      </g>
    );
  }
  // banana — bitta realistik crescent
  return (
    <g>
      <path d={`M${cx - 9.4} ${cy - 6} C ${cx - 10} ${cy + 2.4} ${cx - 4.2} ${cy + 8.6} ${cx + 6} ${cy + 6.8} C ${cx + 8.2} ${cy + 6.4} ${cx + 9.8} ${cy + 5.2} ${cx + 10.2} ${cy + 3.4} C ${cx + 5} ${cy + 5.2} ${cx - 2.4} ${cy + 3.2} ${cx - 5.6} ${cy - 1.6} C ${cx - 6.9} ${cy - 3.6} ${cx - 7.4} ${cy - 5} ${cx - 7.5} ${cy - 6.3} Z`} fill={`url(#${PFX}ba)`} stroke="#d9a827" strokeWidth={0.9} strokeLinejoin="round" />
      <path d={`M${cx - 9.4} ${cy - 6} q-0.6 -1.6 0.4 -2.2 q1.2 -0.4 1.6 1.4 l-0.1 0.5 Z`} fill="#8a6512" />
      <circle cx={cx + 10} cy={cy + 3.7} r={1.2} fill="#8a6512" />
      <path d={`M${cx - 7.8} ${cy - 3} C ${cx - 7.4} ${cy + 2} ${cx - 3} ${cy + 6} ${cx + 3} ${cy + 6.6}`} stroke="#fff" strokeWidth={1} opacity={0.35} fill="none" strokeLinecap="round" />
    </g>
  );
};

// Piktogramma SVG: 3 qator, chapga tekislangan; uzunroq qator ko'zga uzunroq ko'rinadi.
const ROW_H = 44, ICON0 = 96, GAP = 30, TOP = 30;
const Pictogram = ({ t }) => (
  <svg viewBox="0 0 360 156" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
    <FruitDefs />
    {CHART.map((row, i) => {
      const cy = TOP + i * ROW_H;
      return (
        <g key={row.key}>
          <line x1={88} y1={cy + 16} x2={352} y2={cy + 16} stroke="#e7dcc0" strokeWidth={1} />
          <text x={8} y={cy + 4} fontSize={13} fontWeight={800} fill="#5a4a22" fontFamily="'Manrope',sans-serif">{t.labels[row.key]}</text>
          {Array.from({ length: row.n }).map((_, j) => (
            <FruitIcon key={j} kind={row.kind} x={ICON0 + j * GAP} y={cy} />
          ))}
        </g>
      );
    })}
    <line x1={88} y1={16} x2={88} y2={148} stroke="#d8c79c" strokeWidth={1.5} />
  </svg>
);

export default function D36_04(props) {
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
    onSubmit?.({ questionText: t.ask, options: OPTIONS.map((k) => t.labels[k]), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3604" + (still ? " still" : "")}>
      <style>{`
        .pq3604.still *{animation:none !important;}
        .pq3604{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3604 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3604 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3604 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3604 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3604 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:34px 15px 20px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ead6 100%);border:2px solid #e6d3a8;overflow:hidden;}
        .pq3604 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79338,#a6772a);border:2.5px solid #8a621f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3604 .pq-scene{position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto;}
        .pq3604 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3604 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #dccfa8;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(80,60,20,.12);font-size:17px;font-weight:800;color:#5a4a22;letter-spacing:.01em;}
        .pq3604 .pq-opt:hover:not(:disabled){background:#fffaf0;border-color:#e6c976;}
        .pq3604 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3604 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3604 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3604cele .5s ease;}
        .pq3604 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3604 .pq-opt:disabled{cursor:default;}
        .pq3604 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3604pop .45s ease both;}
        .pq3604.still .pq-tick{animation:none;opacity:1;}
        .pq3604 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3604tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3604 .pq-spark.s2{animation-delay:-.6s;} .pq3604 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3604.still .pq-spark{opacity:1;}
        .pq3604 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3604in .22s ease both;}
        .pq3604 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3604 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3604pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3604tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3604cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3604in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Piktogramma = DATA (halol ko'rsatiladi); javob = bolaning sanashi */}
        <div className="pq-scene"><Pictogram t={t} /></div>

        {/* Matnli variantlar: to'g'ri (Banan) chapda emas; g'alabagacha yashil emas */}
        <div className="pq-opts">
          {OPTIONS.map((k) => {
            const sel = picked === k;
            const right = ok && k === CORRECT;
            const dim = ok && k !== CORRECT;
            return (
              <button
                key={k}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(k); setFeedback(null); }}
              >
                {t.labels[k]}
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
