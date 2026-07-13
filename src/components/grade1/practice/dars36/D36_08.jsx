// Dars36 · Amaliyot 08 — «Piktogramma va jadval» · Blok 7 ma'lumot · 🔴 · tag: multi_5
// Piktogramma: 4 qator (Olma=5, Nok=3, Banan=5, Uzum=5), har rasm = 1 dona. Qatorlar bosiladi.
// Savol: soni 5 bo'lgan BARCHA mevani belgilang. TO'G'RI to'plam = {Olma, Banan, Uzum}; Nok=3 tuzoq (M2 uzun-qator).
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint har qatordagi rasmni sanashni o'rgatadi.
// ANSWER-LEAK: piktogramma = DATA (halol); javob = bolaning sanashi; to'g'ri qatorlar g'alabagacha yashil emas.
// G'alaba-anim review'da qayta o'ynamaydi (.still gate); tanlangan holat statik.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 5;
// Piktogramma kanoni: har rasm = 1 dona; qatorlar chapga tekislangan (uzunroq qator = ko'proq).
const ROWS = [
  { key: 'olma', uz: 'Olma', ru: 'Яблоки', n: 5, icon: 'apple' }, // 5 — to'g'ri
  { key: 'nok', uz: 'Nok', ru: 'Груши', n: 3, icon: 'pear' },     // 3 — tuzoq
  { key: 'banan', uz: 'Banan', ru: 'Бананы', n: 5, icon: 'banana' }, // 5 — to'g'ri
  { key: 'uzum', uz: 'Uzum', ru: 'Виноград', n: 5, icon: 'berry' }, // 5 — to'g'ri
];
const GOOD = ROWS.map((r, i) => (r.n === TARGET ? i : -1)).filter((i) => i >= 0); // [0,2,3]
const DATA = { rows: ROWS.map((r) => ({ key: r.key, n: r.n })), target: TARGET, good: GOOD, level: '🔴', tag: 'multi_5' };

const T = {
  uz: {
    eyebrow: "Ma'lumot · Piktogramma", title: "Diagrammani o'qing",
    setup: "Har qatordagi rasmlarni sanang.",
    ask: "Soni 5 ta bo'lgan barcha mevalarni belgilang.",
    correct: "Barakalla! Olma, banan va uzum — har birida 5 tadan.",
    hint: "Har qatorni alohida sanang: unda rosa 5 ta rasm bormi?",
    head1: 'Meva', head2: 'Soni',
  },
  ru: {
    eyebrow: 'Данные · Пиктограмма', title: 'Прочитай диаграмму',
    setup: "Сосчитай картинки в каждом ряду.",
    ask: "Отметь все фрукты, которых ровно по 5.",
    correct: "Молодец! Яблоки, бананы и виноград — по 5 в каждом ряду.",
    hint: "Сосчитай каждый ряд отдельно: там ровно 5 картинок?",
    head1: 'Фрукт', head2: 'Кол-во',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// ——— YAGONA MEVA PALITRASI (D36_01 kanoni): olma #e5484d, nok #b5cf3f, banan #f2c94c, uzum #8e5bc4 ———
// Bitta sanaladigan meva ikonkasi (1 rasm = 1 dona); realistik: gradient soya, yaltirash, bandi va barg.
const PFX = 'g3608'; // gradient-id prefiksi (fayl-unikal; nusxa-deflar bir xil — xavfsiz)
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
    <radialGradient id={PFX + 'gr'} cx="35%" cy="32%" r="85%">
      <stop offset="0%" stopColor="#b697e0" /><stop offset="55%" stopColor="#8e5bc4" /><stop offset="100%" stopColor="#6d4fae" />
    </radialGradient>
  </defs>
);
function Fruit({ type }) {
  if (type === 'apple') {
    return (
      <svg width={24} height={26} viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
        <FruitDefs />
        <path d="M14 9 Q14.6 5 17.2 2.6" fill="none" stroke="#6b4a2b" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="19.6" cy="4.6" rx="4.2" ry="2.3" fill={`url(#${PFX}lf)`} stroke="#3d8c40" strokeWidth=".6" transform="rotate(28 19.6 4.6)" />
        <path d="M14 9.8 C 12.4 7.4 6 7 4.8 13 C 3.8 18.6 8.2 24.8 12.4 24.8 C 13.4 24 14.6 24 15.6 24.8 C 19.8 24.8 24.2 18.6 23.2 13 C 22 7 15.6 7.4 14 9.8 Z" fill={`url(#${PFX}ap)`} stroke="#b7343c" strokeWidth=".8" />
        <ellipse cx="10.6" cy="13.6" rx="2.2" ry="3.4" fill="#fff" opacity=".5" transform="rotate(-18 10.6 13.6)" />
      </svg>
    );
  }
  if (type === 'pear') {
    return (
      <svg width={24} height={26} viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
        <FruitDefs />
        <path d="M14 5 q1.4 -2.6 3.8 -3.2" fill="none" stroke="#6b4a2b" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 5.4 C 10.8 5.4 9.6 8.6 10.2 11.4 C 10.6 13.6 6.8 15.4 6.1 19.2 C 5.3 23.9 9.5 27 14 27 C 18.5 27 22.7 23.9 21.9 19.2 C 21.2 15.4 17.4 13.6 17.8 11.4 C 18.4 8.6 17.2 5.4 14 5.4 Z" fill={`url(#${PFX}pe)`} stroke="#93ab2c" strokeWidth=".8" />
        <ellipse cx="11" cy="20.4" rx="2" ry="3.1" fill="#fff" opacity=".45" transform="rotate(-14 11 20.4)" />
      </svg>
    );
  }
  if (type === 'banana') {
    return (
      <svg width={24} height={26} viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
        <FruitDefs />
        <path d="M4.6 10 C 4 18.4 9.8 24.6 20 22.8 C 22.2 22.4 23.8 21.2 24.2 19.4 C 19 21.2 11.6 19.2 8.4 14.4 C 7.1 12.4 6.6 11 6.5 9.7 Z" fill={`url(#${PFX}ba)`} stroke="#d9a827" strokeWidth=".9" strokeLinejoin="round" />
        <path d="M4.6 10 q-0.6 -1.6 0.4 -2.2 q1.2 -0.4 1.6 1.4 l-0.1 0.5 Z" fill="#8a6512" />
        <circle cx="24" cy="19.7" r="1.2" fill="#8a6512" />
        <path d="M6.2 13 C 6.6 18 11 22 17 22.6" stroke="#fff" strokeWidth="1" opacity=".35" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  // berry (uzum donasi) — bitta binafsha meva (klaster emas)
  return (
    <svg width={24} height={26} viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
      <FruitDefs />
      <path d="M14 8 q0.4 -3 2.6 -4.2" fill="none" stroke="#6b4a2b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14" cy="16.5" r="8.8" fill={`url(#${PFX}gr)`} stroke="#6d4fae" strokeWidth=".8" />
      <ellipse cx="10.8" cy="13.4" rx="2.2" ry="3.2" fill="#c9a6e6" opacity=".8" transform="rotate(-16 10.8 13.4)" />
    </svg>
  );
}

// 2 ustunli toza jadval «Meva | Soni» (piktogramma bilan bir xil DATA).
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

export default function D36_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const still = isReview || !!(initialAnswer && initialAnswer.studentAnswer);
  const [pickedSet, setPickedSet] = useState(() => new Set());
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  // RESTORE: qayta ochilishda tanlangan qatorlar + feedback (DOIM msg bilan) tiklanadi; setChecked FAQAT to'g'rida.
  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.values)) {
      setPickedSet(new Set(initialAnswer.studentAnswer.values));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); if (initialAnswer.correct) setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(pickedSet.size > 0 && !checked); }, [pickedSet, checked, onReady]);

  const lock = isReview || checked;
  const toggle = (i) => {
    if (lock) return;
    setPickedSet((prev) => { const ns = new Set(prev); if (ns.has(i)) ns.delete(i); else ns.add(i); return ns; });
    setFeedback(null);
  };

  const check = useCallback(() => {
    if (pickedSet.size === 0) return;
    const correct = GOOD.every((i) => pickedSet.has(i)) && [...pickedSet].every((i) => ROWS[i].n === TARGET);
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: ROWS.map((r) => `${r.uz}=${r.n}`), studentAnswer: { values: [...pickedSet] }, correctAnswer: { values: GOOD }, correct, meta: { ...DATA } });
  }, [pickedSet, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3608" + (still ? " still" : "")}>
      <style>{`
        .pq3608.still *{animation:none !important;}
        .pq3608{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3608 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3608 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3608 .pq-setup{color:#5c6672;font-weight:500;}
        .pq3608 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq3608 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:34px 15px 20px;border-radius:20px;background:linear-gradient(#fbf6ec 0%,#f3ead6 100%);border:2px solid #e6d3a8;overflow:hidden;}
        .pq3608 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#c79338,#a6772a);border:2.5px solid #8a621f;color:#fff6e6;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3608 .pq-rows{box-sizing:border-box;position:relative;z-index:3;width:100%;max-width:360px;margin:0 auto;display:flex;flex-direction:column;gap:8px;}
        .pq3608 .pq-row{box-sizing:border-box;position:relative;display:flex;align-items:center;gap:6px;width:100%;padding:7px 8px 7px 10px;border-radius:13px;background:rgba(255,255,255,.92);border:2.5px solid #e0d0a6;cursor:pointer;transition:.12s;box-shadow:0 2px 5px rgba(80,60,20,.1);font-family:inherit;text-align:left;}
        .pq3608 .pq-row:hover:not(:disabled){border-color:#e6c976;background:#fffaf0;}
        .pq3608 .pq-row:active:not(:disabled){transform:scale(.99);}
        .pq3608 .pq-row:disabled{cursor:default;}
        .pq3608 .pq-row.sel{border-color:#2563eb;background:#eef3fe;box-shadow:0 0 0 3px rgba(37,99,235,.14);}
        .pq3608 .pq-row.won{border-color:#1a7f43;background:#eaf8ef;box-shadow:0 0 0 3px rgba(26,127,67,.16);animation:pq3608cele .5s ease;}
        .pq3608 .pq-row.dim{opacity:.42;filter:grayscale(.3);}
        .pq3608 .pq-rlabel{flex:0 0 46px;font-size:13px;font-weight:800;color:#6b5220;letter-spacing:.01em;}
        .pq3608 .pq-row.won .pq-rlabel{color:#1a7f43;}
        .pq3608 .pq-icons{flex:1 1 auto;display:flex;align-items:center;gap:3px;min-width:0;}
        .pq3608 .pq-tick{position:absolute;top:-8px;right:-6px;z-index:7;width:22px;height:22px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3608pop .45s ease both;}
        .pq3608.still .pq-tick{animation:none;opacity:1;}
        .pq3608 .pq-tbl{width:100%;max-width:360px;margin:14px auto 0;border-collapse:collapse;font-size:14px;background:rgba(255,255,255,.9);border-radius:12px;overflow:hidden;}
        .pq3608 .pq-tbl th,.pq3608 .pq-tbl td{border:1px solid #e6d3a8;padding:6px 12px;text-align:left;color:#5a4a22;}
        .pq3608 .pq-tbl th{background:#f2e6c8;font-weight:800;font-size:12px;letter-spacing:.02em;text-transform:uppercase;}
        .pq3608 .pq-tbl td.num{text-align:right;font-weight:800;font-variant-numeric:tabular-nums;}
        .pq3608 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3608tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3608 .pq-spark.s2{animation-delay:-.6s;} .pq3608 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3608.still .pq-spark{opacity:1;}
        .pq3608 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3608in .22s ease both;}
        .pq3608 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3608 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3608pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3608tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3608cele{0%{transform:scale(1);}30%{transform:scale(1.03);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3608in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Piktogramma qatorlari = DATA + bosiladigan tanlov; g'alabagacha yashil emas */}
        <div className="pq-rows">
          {ROWS.map((r, i) => {
            const good = r.n === TARGET;
            const sel = pickedSet.has(i);
            const cls = ok ? (good ? ' won' : ' dim') : (sel ? ' sel' : '');
            return (
              <button key={r.key} type="button" className={'pq-row' + cls} disabled={lock}
                onClick={() => toggle(i)} aria-label={`${r[lang] || r.uz} ${r.n}`}>
                <span className="pq-rlabel">{r[lang] || r.uz}</span>
                <span className="pq-icons">
                  {Array.from({ length: r.n }).map((_, k) => <Fruit key={k} type={r.icon} />)}
                </span>
                {ok && good && <span className="pq-tick"><IconOk /></span>}
              </button>
            );
          })}
        </div>

        <DataTable lang={lang} />

        {ok && (<>
          <span className="pq-spark" style={{ left: '12%', top: '30px' }}>{'✦'}</span>
          <span className="pq-spark s2" style={{ left: '84%', top: '40px' }}>{'✦'}</span>
          <span className="pq-spark s3" style={{ left: '50%', top: '22px' }}>{'✦'}</span>
        </>)}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
