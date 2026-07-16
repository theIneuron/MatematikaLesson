// Amaliyot21 — Interaktiv столбик: qo'shish (perenos/dilda) · Blok 1 · daraja С · teg: column_add
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika (reja «Интерактивный столбик»): o'quvchi ustunni kletka-kletka to'ldiradi —
// natija raqamlari VA perenos (dilda) kataklari. Oraliq qadamlar tekshiriladi, faqat itog emas.
// Mobil-birinchi: yirik kataklar, raqamli klaviatura. Sonlar data-driven (a, b) — almashtirish oson.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const A_NUM = 2748, B_NUM = 1375; // 2748 + 1375 = 4123

const DATA = { tag: 'column_add', level: 'С', format: 'column', block: 1 };

const T = {
  uz: {
    title: "Ustun shaklida qo'shish",
    body: "2748 + 1375 ni ustunda yeching. O'ngdan chapga: har ustunni qo'shing, o'nlikka o'tsa — perenosni yuqoridagi katakka yozing.",
    carryHint: 'perenos (dilda)',
    hint: "O'ngdan boshlang: 8 + 5 = 13 — 3 yoziladi, 1 keyingi ustunga. Perenosni qo'shishni unutmang.",
    correct: "To'g'ri. 2748 + 1375 = 4123. Perenoslar ham joyida.",
    correctNoCarry: "Javob to'g'ri: 4123. Lekin perenos kataklarini ham to'ldirish qadamni ko'rsatadi.",
    wrongCol: (c) => `Hali to'g'ri emas. ${c}-ustunni (o'ngdan) qayta tekshiring — perenosni qo'shdingizmi?`,
  },
  ru: {
    title: 'Сложение столбиком',
    body: 'Решите 2748 + 1375 столбиком. Справа налево: складывайте каждый столбец, при переходе через десяток пишите перенос в верхнюю клетку.',
    carryHint: 'перенос (в уме)',
    hint: 'Начните справа: 8 + 5 = 13 — пишем 3, 1 в следующий столбец. Не забывайте прибавлять перенос.',
    correct: 'Верно. 2748 + 1375 = 4123. Переносы тоже на месте.',
    correctNoCarry: 'Ответ верный: 4123. Но заполните и клетки переноса — это показывает шаг.',
    wrongCol: (c) => `Пока неверно. Проверьте столбец ${c} (справа) — прибавили перенос?`,
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const lastDigit = (raw) => { const s = String(raw).replace(/[^0-9]/g, ''); return s ? s[s.length - 1] : ''; };

// a + b ni ustun-model sifatida hisoblash
function buildGrid(a, b) {
  const da = String(a).split('').map(Number);
  const db = String(b).split('').map(Number);
  const W = Math.max(da.length, db.length, String(a + b).length);
  const A = Array(W).fill(null), B = Array(W).fill(null);
  for (let i = 0; i < da.length; i++) A[W - da.length + i] = da[i];
  for (let i = 0; i < db.length; i++) B[W - db.length + i] = db[i];
  const sum = Array(W).fill(0), carryInto = Array(W).fill(0);
  let c = 0;
  for (let i = W - 1; i >= 0; i--) {
    const s = (A[i] || 0) + (B[i] || 0) + c;
    sum[i] = s % 10;
    c = Math.floor(s / 10);
    if (i - 1 >= 0) carryInto[i - 1] = c; // perenos chap ustun ustiga yoziladi
  }
  return { W, A, B, sum, carryInto };
}

export default function Amaliyot21(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const grid = useMemo(() => buildGrid(A_NUM, B_NUM), []);
  const { W, A, B, sum, carryInto } = grid;

  const [res, setRes] = useState(() => Array(W).fill(''));
  const [carry, setCarry] = useState(() => Array(W).fill(''));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (Array.isArray(sa.res)) setRes(sa.res.slice(0, W));
      if (Array.isArray(sa.carry)) setCarry(sa.carry.slice(0, W));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, kind: initialAnswer.correct ? 'ok' : 'no' }); setChecked(true); }
    }
  }, [initialAnswer, W]);

  useEffect(() => { onReady?.(res.every((x) => x !== '') && !checked); }, [res, checked, onReady]);

  const setResAt = (i, v) => { if (isReview || checked) return; setRes((p) => { const n = p.slice(); n[i] = lastDigit(v); return n; }); };
  const setCarryAt = (i, v) => { if (isReview || checked) return; setCarry((p) => { const n = p.slice(); n[i] = lastDigit(v); return n; }); };

  const check = useCallback(() => {
    const resultOK = res.every((x, i) => Number(x) === sum[i]);
    const carryOK = carry.every((x, i) => (x === '' ? 0 : Number(x)) === carryInto[i]);
    const correct = resultOK;
    // eng o'ng xato ustun (o'ngdan 1-indeks)
    let wrongCol = 0;
    for (let i = W - 1; i >= 0; i--) { if (Number(res[i]) !== sum[i]) { wrongCol = W - i; break; } }
    const kind = correct ? (carryOK ? 'ok' : 'okNoCarry') : 'no';
    setFeedback({ correct, kind, wrongCol }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A_NUM} + ${B_NUM}`, options: [],
      studentAnswer: { res: res.slice(), carry: carry.slice() },
      correctAnswer: { sum: sum.join(''), carryInto },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, a: A_NUM, b: B_NUM, resultOK, carryOK },
    });
  }, [res, carry, sum, carryInto, W, playCorrect, playWrong, onSubmit]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const cellState = (i) => {
    if (!checked) return '';
    return Number(res[i]) === sum[i] ? 'ok' : 'no';
  };

  const fbText = feedback
    ? (feedback.kind === 'ok' ? t.correct : feedback.kind === 'okNoCarry' ? t.correctNoCarry : t.wrongCol(feedback.wrongCol))
    : '';

  return (
    <div className="aq aq21">
      <style>{`
        .aq21 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq21 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq21 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 18px; }
        .aq21 .aq-board { display:inline-block; margin:0 auto; }
        .aq21 .aq-boardwrap { display:flex; justify-content:center; }
        .aq21 .aq-grid { display:grid; gap:5px; }
        .aq21 .aq-cell { width:46px; height:52px; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; font-variant-numeric:tabular-nums; }
        .aq21 .aq-op { color:#1f2430; }
        .aq21 .aq-sign { color:#6b7280; font-size:26px; }
        .aq21 input.aq-cin { width:46px; height:52px; box-sizing:border-box; text-align:center; font-size:28px; font-weight:800; border-radius:11px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; color:#1f2430; }
        .aq21 input.aq-cin:focus { border-color:#fb7a45; background:#fff; }
        .aq21 input.aq-cin.ok { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .aq21 input.aq-cin.no { border-color:#c0392b; background:#fdecec; color:#c0392b; }
        .aq21 input.aq-carry { width:30px; height:30px; box-sizing:border-box; text-align:center; font-size:16px; font-weight:800; border-radius:8px; border:1.5px dashed #c9a23a; background:#fffdf5; color:#c9a23a; outline:none; }
        .aq21 input.aq-carry:focus { border-style:solid; background:#fff; }
        .aq21 .aq-carrylbl { font-size:11px; color:#c9a23a; font-weight:700; text-align:right; padding-right:6px; }
        .aq21 .aq-line { height:3px; background:#1f2430; border-radius:2px; margin:3px 0; }
        .aq21 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:16px; text-align:center; }
        .aq21 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq21 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq21 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @media (max-width:400px){ .aq21 .aq-cell,.aq21 input.aq-cin{width:40px;height:48px;font-size:24px;} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-boardwrap">
        <div className="aq-board">
          {/* perenos qatori */}
          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)`, alignItems: 'end', marginBottom: 2 }}>
            <div className="aq-carrylbl">{t.carryHint}</div>
            {Array.from({ length: W }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                {i < W - 1 ? (
                  <input className="aq-carry" value={carry[i]} onChange={(e) => setCarryAt(i, e.target.value)}
                    inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`perenos ${W - i}`} />
                ) : <span style={{ width: 30 }} />}
              </div>
            ))}
          </div>

          {/* birinchi qo'shiluvchi */}
          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            {A.map((d, i) => (<div key={i} className="aq-cell aq-op">{d == null ? '' : d}</div>))}
          </div>
          {/* ikkinchi qo'shiluvchi + ishora */}
          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)`, alignItems: 'center' }}>
            <div className="aq-cell aq-sign" style={{ justifySelf: 'end', width: 'auto', paddingRight: 4 }}>+</div>
            {B.map((d, i) => (<div key={i} className="aq-cell aq-op">{d == null ? '' : d}</div>))}
          </div>

          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            <div style={{ gridColumn: `2 / span ${W}` }}><div className="aq-line" /></div>
          </div>

          {/* natija qatori — kiritiladi */}
          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            {Array.from({ length: W }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                <input className={`aq-cin ${cellState(i)}`} value={res[i]} onChange={(e) => setResAt(i, e.target.value)}
                  inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`natija ${W - i}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{fbText}</span>
        </div>
      )}
    </div>
  );
}
