// Dars36 · Amaliyot 09 — «Piktogramma va jadval» · Blok 7 ma'lumot · 🔴 · tag: two_rows_sum
// Piktogramma: 3 qator (Olma=4, Nok=6, Banan=3), har rasm = 1 dona. Savol: olma va nok jami nechta? (4+6=10)
// Variantlar (son): '2' (ayirma tuzog'i M2), '10' TO'G'RI (index 1, chapda emas), '8' (adashib sanash M1).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint ikki qatorni qo'shishni o'rgatadi.
// ANSWER-LEAK: piktogramma = DATA (halol ko'rsatiladi); javob = bolaning sanashi; to'g'ri variant g'alabagacha yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); to'g'ri variant statik yashil holatini ham oladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Piktogramma kanoni: har rasm = 1 dona; qatorlar chapga tekislangan (uzunroq qator = ko'proq).
const ROWS = [
  { key: 'olma', uz: 'Olma', ru: 'Яблоки', n: 4, icon: 'apple' },
  { key: 'nok', uz: 'Nok', ru: 'Груши', n: 6, icon: 'pear' },
  { key: 'banan', uz: 'Banan', ru: 'Бананы', n: 3, icon: 'banana' },
];
const OPTIONS = ['2', '10', '8']; // TO'G'RI '10' (index 1, chapda emas)
const CORRECT = '10';
const DATA = { rows: ROWS.map((r) => ({ key: r.key, n: r.n })), question: 'olma+nok', options: OPTIONS, correct: CORRECT, level: '🔴', tag: 'two_rows_sum' };

const T = {
  uz: {
    eyebrow: "Ma'lumot · Piktogramma", title: "Diagrammani o'qing",
    ask: 'Olma va nok jami nechta?',
    correct: 'Barakalla! 4 va 6 — jami 10 ta.',
    hint: "Olma va nok qatorlarini qo'shing.",
    head1: 'Meva', head2: 'Soni',
  },
  ru: {
    eyebrow: 'Данные · Пиктограмма', title: 'Прочитай диаграмму',
    ask: 'Сколько всего яблок и груш?',
    correct: 'Молодец! 4 и 6 — всего 10.',
    hint: 'Сложи ряды яблок и груш.',
    head1: 'Фрукт', head2: 'Кол-во',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bitta sanaladigan meva ikonkasi (1 rasm = 1 dona). Koordinatalar SON (arifmetika string-concat bermasin).
function Fruit({ type, cx, cy }) {
  if (type === 'apple') {
    return (
      <g>
        <path d={`M${cx} ${cy - 8} q0 -4 3 -6`} stroke="#6b4a2b" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <ellipse cx={cx + 5} cy={cy - 11} rx={4} ry={2.4} fill="#4caf50" transform={`rotate(28 ${cx + 5} ${cy - 11})`} />
        <circle cx={cx} cy={cy} r={9} fill="#e5484d" />
        <ellipse cx={cx - 3} cy={cy - 3} rx={2.4} ry={3.4} fill="#ff9a9a" opacity={0.6} />
      </g>
    );
  }
  if (type === 'pear') {
    return (
      <g>
        <path d={`M${cx} ${cy - 11} l1 3`} stroke="#6b4a2b" strokeWidth={1.6} strokeLinecap="round" />
        <circle cx={cx} cy={cy + 3} r={8} fill="#b5cf3f" />
        <circle cx={cx} cy={cy - 5} r={4.6} fill="#c6db54" />
        <ellipse cx={cx - 3} cy={cy + 1} rx={2} ry={3} fill="#e2eea0" opacity={0.6} />
      </g>
    );
  }
  // banana — bitta qiyshiq banan
  return (
    <path d={`M${cx - 9} ${cy - 5} Q ${cx - 4} ${cy + 9} ${cx + 9} ${cy + 3} Q ${cx + 2} ${cy + 6} ${cx - 9} ${cy - 5} Z`} fill="#f2c94c" stroke="#d9a827" strokeWidth={1} />
  );
}

// Piktogramma SVG: 3 qator, chapda yorliq + o'ngda N ta bir xil ikonka.
const LX = 8;        // yorliq x
const IX0 = 96;      // birinchi ikonka x
const ISTEP = 33;    // ikonkalar orasidagi qadam
const RY = [30, 74, 118]; // qatorlar markazi y
// Eng uzun qator: nok=6 → IX0 + 5*ISTEP = 96 + 165 = 261 < 340 (viewBox), 390px kartaga sig'adi.
function Pictogram({ lang }) {
  return (
    <svg viewBox="0 0 340 150" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {ROWS.map((r, ri) => {
        const cy = RY[ri];
        const icons = [];
        for (let i = 0; i < r.n; i++) {
          icons.push(<Fruit key={i} type={r.icon} cx={IX0 + i * ISTEP} cy={cy} />);
        }
        return (
          <g key={r.key}>
            <line x1={LX} y1={cy + 18} x2={334} y2={cy + 18} stroke="#ecdfbd" strokeWidth={1} />
            <text x={LX} y={cy + 4} fontSize={14} fontWeight={800} fill="#6b5220" fontFamily="'Manrope',sans-serif">{r[lang] || r.uz}</text>
            {icons}
          </g>
        );
      })}
    </svg>
  );
}

// 2 ustunli toza jadval «Meva | Soni».
function DataTable({ lang }) {
  const tt = T[lang] || T.uz;
  return (
    <table className="pq-tbl">
      <thead><tr><th>{tt.head1}</th><th>{tt.head2}</th></tr></thead>
      <tbody>
        {ROWS.map((r) => (<tr key={r.key}><td>{r[lang] || r.uz}</td><td className="num">{r.n}</td></tr>))}
      </tbody>
    </table>
  );
}

export default function D36_09(props) {
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
    onSubmit?.({ questionText: t.ask, options: OPTIONS.slice(), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3609" + (still ? " still" : "")}>
      <style>{`
        .pq3609.still *{animation:none !important;}
        .pq3609{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3609 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3609 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3609 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3609 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:34px 15px 20px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ead6 100%);border:2px solid #e6d3a8;overflow:hidden;}
        .pq3609 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79338,#a6772a);border:2.5px solid #8a621f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3609 .pq-card{box-sizing:border-box;position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto;padding:10px 10px 6px;border-radius:14px;background:rgba(255,255,255,.9);border:1.5px solid #e6d3a8;}
        .pq3609 .pq-tbl{width:100%;max-width:360px;margin:12px auto 0;border-collapse:collapse;font-size:14px;background:rgba(255,255,255,.9);border-radius:12px;overflow:hidden;}
        .pq3609 .pq-tbl th,.pq3609 .pq-tbl td{border:1px solid #e6d3a8;padding:7px 12px;text-align:left;color:#5a4a22;}
        .pq3609 .pq-tbl th{background:#f2e6c8;font-weight:800;font-size:12px;letter-spacing:.02em;text-transform:uppercase;}
        .pq3609 .pq-tbl td.num{text-align:right;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3609 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3609 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:16px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #dccfa8;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(80,60,20,.12);font-size:22px;font-weight:800;color:#5a4a22;letter-spacing:.02em;}
        .pq3609 .pq-opt:hover:not(:disabled){background:#fffaf0;border-color:#e6c976;}
        .pq3609 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3609 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3609 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3609cele .5s ease;}
        .pq3609 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3609 .pq-opt:disabled{cursor:default;}
        .pq3609 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3609pop .45s ease both;}
        .pq3609.still .pq-tick{animation:none;opacity:1;}
        .pq3609 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3609tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3609 .pq-spark.s2{animation-delay:-.6s;} .pq3609 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3609.still .pq-spark{opacity:1;}
        .pq3609 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3609in .22s ease both;}
        .pq3609 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3609 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3609pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3609tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3609cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3609in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Piktogramma + jadval = DATA (halol ko'rsatiladi); javob = bolaning sanashi */}
        <div className="pq-card"><Pictogram lang={lang} /></div>
        <DataTable lang={lang} />

        {/* Sonli variantlar: to'g'ri (10) chapda emas; g'alabagacha yashil emas */}
        <div className="pq-opts">
          {OPTIONS.map((v) => {
            const sel = picked === v;
            const right = ok && v === CORRECT;
            const dim = ok && v !== CORRECT;
            return (
              <button
                key={v}
                type="button"
                className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '') + (dim ? ' dim' : '')}
                disabled={lock}
                onClick={() => { setPicked(v); setFeedback(null); }}
              >
                {v}
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
