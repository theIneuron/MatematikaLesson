// Dars36 · Amaliyot 06 — «Piktogramma va jadval» · Blok 7 · Jadval o'qish · 🟡 · tag: read_table
// Jadval «Meva | Soni»: Olma 4, Nok 6, Banan 3, Uzum 5 (DATA — halol ko'rsatiladi). Savol: jadvalda nechta uzum?
// Variantlar (matn): '4' (Olma qatoriga adashish), '5' TO'G'RI (index 1, chapda emas), '6' (Nok qatoriga adashish) — M3 qator adashishi.
// VEDI-DO-VERNOGO: noto'g'rida qulf/retry yo'q; setChecked FAQAT to'g'rida; hint qator o'qishni o'rgatadi (Uzum qatoriga qarang).
// ANSWER-LEAK: jadval = DATA; javob = bolaning o'qishi; to'g'ri variant g'alabagacha yashil emas; g'alabada Uzum qatori yoritiladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROWS = [
  { key: 'olma', n: 4 },
  { key: 'nok', n: 6 },
  { key: 'banan', n: 3 },
  { key: 'uzum', n: 5 },
];
const TARGET = 'uzum';
const OPTIONS = [{ n: 4 }, { n: 5 }, { n: 6 }]; // TO'G'RI n=5 (index 1, chapda emas)
const CORRECT = 5;
const DATA = { rows: ROWS.map((r) => ({ ...r })), target: TARGET, options: OPTIONS.map((o) => o.n), correct: CORRECT, level: '🟡', tag: 'read_table' };

const T = {
  uz: {
    eyebrow: "Ma'lumot · Jadval", title: 'Jadvalni o\'qing',
    ask: 'Jadvalda nechta uzum?',
    colName: 'Meva', colNum: 'Soni',
    names: { olma: 'Olma', nok: 'Nok', banan: 'Banan', uzum: 'Uzum' },
    correct: "Barakalla! Uzum qatoridagi son 5 — demak 5 ta uzum.",
    hint: "Uzum qatorini toping. O'sha qatordagi son — javob.",
  },
  ru: {
    eyebrow: 'Данные · Таблица', title: 'Прочитай таблицу',
    ask: 'Сколько винограда в таблице?',
    colName: 'Фрукт', colNum: 'Кол-во',
    names: { olma: 'Яблоко', nok: 'Груша', banan: 'Банан', uzum: 'Виноград' },
    correct: "Молодец! В строке винограда число 5 — значит 5 виноградин.",
    hint: "Найди строку винограда. Число в этой строке — ответ.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// ——— YAGONA MEVA PALITRASI (D36_01 kanoni): olma #e5484d, nok #b5cf3f, banan #f2c94c, uzum #8e5bc4 ———
// Bitta sanaladigan meva ikonasi (1 ikona = 1 dona) — jadval yorlig'i yonida; realistik: gradient soya, yaltirash, bandi.
const PFX = 'g3606'; // gradient-id prefiksi (fayl-unikal; nusxa-deflar bir xil — xavfsiz)
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
const FruitIcon = ({ kind }) => {
  if (kind === 'olma') return (
    <svg width="22" height="24" viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
      <FruitDefs />
      <path d="M14 9 Q14.6 5 17.2 2.6" fill="none" stroke="#6b4a2b" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="19.6" cy="4.6" rx="4.2" ry="2.3" fill={`url(#${PFX}lf)`} stroke="#3d8c40" strokeWidth=".6" transform="rotate(28 19.6 4.6)" />
      <path d="M14 9.8 C 12.4 7.4 6 7 4.8 13 C 3.8 18.6 8.2 24.8 12.4 24.8 C 13.4 24 14.6 24 15.6 24.8 C 19.8 24.8 24.2 18.6 23.2 13 C 22 7 15.6 7.4 14 9.8 Z" fill={`url(#${PFX}ap)`} stroke="#b7343c" strokeWidth=".8" />
      <ellipse cx="10.6" cy="13.6" rx="2.2" ry="3.4" fill="#fff" opacity=".5" transform="rotate(-18 10.6 13.6)" />
    </svg>
  );
  if (kind === 'nok') return (
    <svg width="22" height="24" viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
      <FruitDefs />
      <path d="M14 5 q1.4 -2.6 3.8 -3.2" fill="none" stroke="#6b4a2b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 5.4 C 10.8 5.4 9.6 8.6 10.2 11.4 C 10.6 13.6 6.8 15.4 6.1 19.2 C 5.3 23.9 9.5 27 14 27 C 18.5 27 22.7 23.9 21.9 19.2 C 21.2 15.4 17.4 13.6 17.8 11.4 C 18.4 8.6 17.2 5.4 14 5.4 Z" fill={`url(#${PFX}pe)`} stroke="#93ab2c" strokeWidth=".8" />
      <ellipse cx="11" cy="20.4" rx="2" ry="3.1" fill="#fff" opacity=".45" transform="rotate(-14 11 20.4)" />
    </svg>
  );
  if (kind === 'banan') return (
    <svg width="22" height="24" viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
      <FruitDefs />
      <path d="M4.6 10 C 4 18.4 9.8 24.6 20 22.8 C 22.2 22.4 23.8 21.2 24.2 19.4 C 19 21.2 11.6 19.2 8.4 14.4 C 7.1 12.4 6.6 11 6.5 9.7 Z" fill={`url(#${PFX}ba)`} stroke="#d9a827" strokeWidth=".9" strokeLinejoin="round" />
      <path d="M4.6 10 q-0.6 -1.6 0.4 -2.2 q1.2 -0.4 1.6 1.4 l-0.1 0.5 Z" fill="#8a6512" />
      <circle cx="24" cy="19.7" r="1.2" fill="#8a6512" />
      <path d="M6.2 13 C 6.6 18 11 22 17 22.6" stroke="#fff" strokeWidth="1" opacity=".35" fill="none" strokeLinecap="round" />
    </svg>
  );
  // uzum — bitta rezavor (klaster emas, sanaladigan dona)
  return (
    <svg width="22" height="24" viewBox="0 0 28 30" aria-hidden="true" style={{ display: 'block' }}>
      <FruitDefs />
      <path d="M14 8 q0.4 -3 2.6 -4.2" fill="none" stroke="#6b4a2b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14" cy="16.5" r="8.8" fill={`url(#${PFX}gr)`} stroke="#6d4fae" strokeWidth=".8" />
      <ellipse cx="10.8" cy="13.4" rx="2.2" ry="3.2" fill="#c9a6e6" opacity=".8" transform="rotate(-16 10.8 13.4)" />
    </svg>
  );
};

export default function D36_06(props) {
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
    onSubmit?.({ questionText: t.ask, options: OPTIONS.map((o) => String(o.n)), studentAnswer: { value: picked }, correctAnswer: { value: CORRECT }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className={"pq pq3606" + (still ? " still" : "")}>
      <style>{`
        .pq3606.still *{animation:none !important;}
        .pq3606{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq3606 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3f7ac0;text-transform:uppercase;}
        .pq3606 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq3606 .pq-ask{display:block;font-size:20px;font-weight:800;}
        .pq3606 .pq-board{box-sizing:border-box;position:relative;width:390px;max-width:100%;margin:0 auto;padding:34px 15px 20px;border-radius:20px;background:linear-gradient(#eef4fb 0%,#dfeaf7 100%);border:2px solid #bcd2ea;overflow:hidden;}
        .pq3606 .pq-badge{position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:6;padding:3px 14px 4px;border-radius:9px;background:linear-gradient(#4a89cf,#3a6fac);border:2.5px solid #2f5c90;color:#f2f8ff;font-size:12px;font-weight:800;letter-spacing:.02em;white-space:nowrap;pointer-events:none;box-shadow:0 3px 6px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.28);}
        .pq3606 .pq-scene{position:relative;z-index:3;width:100%;max-width:352px;margin:0 auto;}
        .pq3606 .pq-tbl{box-sizing:border-box;width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 9px rgba(40,70,110,.12);font-size:17px;}
        .pq3606 .pq-tbl th,.pq3606 .pq-tbl td{box-sizing:border-box;border:1px solid #d5e0ee;padding:10px 12px;text-align:left;}
        .pq3606 .pq-tbl thead th{background:#3a6fac;color:#f2f8ff;font-weight:800;font-size:14px;letter-spacing:.02em;text-transform:uppercase;}
        .pq3606 .pq-tbl td.num{text-align:right;font-weight:800;font-variant-numeric:tabular-nums;font-family:'JetBrains Mono',monospace;color:#274a72;width:76px;}
        .pq3606 .pq-tbl td.name{font-weight:700;color:#2b3550;}
        .pq3606 .pq-tbl td.name .ico{display:inline-flex;vertical-align:middle;margin-right:8px;}
        .pq3606 .pq-tbl tbody tr:nth-child(even) td{background:#f6faff;}
        .pq3606 .pq-tbl tbody tr.hit td{background:#e8f7ee;color:#1a7f43;animation:pq3606flash .55s ease;}
        .pq3606 .pq-tbl tbody tr.hit td.num{color:#1a7f43;}
        .pq3606 .pq-opts{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:16px;}
        .pq3606 .pq-opt{box-sizing:border-box;position:relative;display:flex;align-items:center;justify-content:center;padding:14px 6px;border-radius:14px;background:rgba(255,255,255,.97);border:3px solid #c7d8ec;cursor:pointer;transition:.12s;box-shadow:0 3px 8px rgba(40,70,110,.12);font-size:20px;font-weight:800;color:#2b4a72;letter-spacing:.02em;}
        .pq3606 .pq-opt:hover:not(:disabled){background:#f4f9ff;border-color:#8fb6e0;}
        .pq3606 .pq-opt:active:not(:disabled){transform:scale(.98);}
        .pq3606 .pq-opt.sel{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.18);color:#1f2430;}
        .pq3606 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;box-shadow:0 0 0 3px rgba(26,127,67,.18);animation:pq3606cele .5s ease;}
        .pq3606 .pq-opt.dim{opacity:.4;filter:saturate(.6);}
        .pq3606 .pq-opt:disabled{cursor:default;}
        .pq3606 .pq-tick{position:absolute;top:-9px;right:-6px;z-index:7;width:24px;height:24px;border-radius:50%;background:#1a7f43;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 7px rgba(0,0,0,.22);animation:pq3606pop .45s ease both;}
        .pq3606.still .pq-tick{animation:none;opacity:1;}
        .pq3606 .pq-spark{position:absolute;z-index:5;color:#ffc93f;opacity:0;line-height:0;pointer-events:none;animation:pq3606tw 1.7s ease-in-out infinite;filter:drop-shadow(0 0 3px rgba(255,201,63,.6));}
        .pq3606 .pq-spark.s2{animation-delay:-.6s;} .pq3606 .pq-spark.s3{animation-delay:-1.15s;}
        .pq3606.still .pq-spark{opacity:1;}
        .pq3606 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pq3606in .22s ease both;}
        .pq3606 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq3606 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pq3606flash{0%{background:#fff;}45%{background:#c9efd6;}100%{background:#e8f7ee;}}
        @keyframes pq3606pop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pq3606tw{0%,100%{opacity:0;transform:scale(.3) rotate(0);}50%{opacity:1;transform:scale(1.1) rotate(45deg);}}
        @keyframes pq3606cele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.99);}100%{transform:scale(1);}}
        @keyframes pq3606in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-board">
        <div className="pq-badge">{t.title}</div>

        {/* Jadval = DATA (halol ko'rsatiladi); javob = bolaning o'qishi; g'alabada Uzum qatori yoritiladi */}
        <div className="pq-scene">
          <table className="pq-tbl">
            <thead>
              <tr><th>{t.colName}</th><th style={{ textAlign: 'right' }}>{t.colNum}</th></tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.key} className={ok && r.key === TARGET ? 'hit' : ''}>
                  <td className="name"><span className="ico"><FruitIcon kind={r.key} /></span>{t.names[r.key]}</td>
                  <td className="num">{r.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Matnli variantlar: to'g'ri (5) chapda emas; g'alabagacha yashil emas */}
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
                {o.n}
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
