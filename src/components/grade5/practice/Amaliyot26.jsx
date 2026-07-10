// Amaliyot26 — Interaktiv столбик: ko'paytirish (ko'p xonali × bir xonali) · Blok 1 · daraja С · teg: column_mul
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: har razryadni ko'paytiruvchiga ko'paytirib, perenos bilan natijani kletka-kletka yozish.
// Perenos katagi 0..9 (ko'paytirishda 1 dan katta ham bo'ladi). Oraliq qadamlar tekshiriladi.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const A_NUM = 245, M = 4; // 245 × 4 = 980

const DATA = { tag: 'column_mul', level: 'С', format: 'column', block: 1 };

const T = {
  uz: {
    title: "Ustun shaklida ko'paytirish",
    body: "245 × 4 ni ustunda yeching. O'ngdan chapga: har razryadni 4 ga ko'paytiring, o'nlikdan katta bo'lsa — perenosni yuqoridagi katakka yozing va keyingi ko'paytmaga qo'shing.",
    carryHint: 'perenos',
    hint: "O'ngdan: 5 × 4 = 20 — 0 yoziladi, 2 perenos. Keyin 4 × 4 = 16, perenos 2 ni qo'shing: 18.",
    correct: "To'g'ri. 245 × 4 = 980. Perenoslar ham joyida.",
    correctNoCarry: "Javob to'g'ri: 980. Perenos kataklarini ham to'ldirish qadamni ko'rsatadi.",
    wrongCol: (c) => `Hali to'g'ri emas. ${c}-ustunni (o'ngdan) qayta tekshiring — perenosni qo'shdingizmi?`,
  },
  ru: {
    title: 'Умножение столбиком',
    body: 'Решите 245 × 4 столбиком. Справа налево: умножайте каждый разряд на 4, если больше десяти — пишите перенос в верхнюю клетку и прибавляйте к следующему произведению.',
    carryHint: 'перенос',
    hint: 'Справа: 5 × 4 = 20 — пишем 0, 2 в перенос. Затем 4 × 4 = 16, прибавьте перенос 2: 18.',
    correct: 'Верно. 245 × 4 = 980. Переносы тоже на месте.',
    correctNoCarry: 'Ответ верный: 980. Заполните и клетки переноса — это показывает шаг.',
    wrongCol: (c) => `Пока неверно. Проверьте столбец ${c} (справа) — прибавили перенос?`,
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const lastDigit = (raw) => { const s = String(raw).replace(/[^0-9]/g, ''); return s ? s[s.length - 1] : ''; };

function buildGridMul(a, m) {
  const da = String(a).split('').map(Number);
  const W = Math.max(da.length, String(a * m).length);
  const A = Array(W).fill(null);
  for (let i = 0; i < da.length; i++) A[W - da.length + i] = da[i];
  const res = Array(W).fill(0), carryInto = Array(W).fill(0);
  let c = 0;
  for (let i = W - 1; i >= 0; i--) {
    const p = (A[i] || 0) * m + c;
    res[i] = p % 10;
    c = Math.floor(p / 10);
    if (i - 1 >= 0) carryInto[i - 1] = c;
  }
  return { W, A, res, carryInto };
}

export default function Amaliyot26(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const grid = useMemo(() => buildGridMul(A_NUM, M), []);
  const { W, A, res: answer, carryInto } = grid;

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
    const resultOK = res.every((x, i) => Number(x) === answer[i]);
    const carryOK = carry.every((x, i) => (x === '' ? 0 : Number(x)) === carryInto[i]);
    const correct = resultOK;
    let wrongCol = 0;
    for (let i = W - 1; i >= 0; i--) { if (Number(res[i]) !== answer[i]) { wrongCol = W - i; break; } }
    const kind = correct ? (carryOK ? 'ok' : 'okNoCarry') : 'no';
    setFeedback({ correct, kind, wrongCol }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A_NUM} × ${M}`, options: [],
      studentAnswer: { res: res.slice(), carry: carry.slice() },
      correctAnswer: { res: answer.join(''), carryInto },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, a: A_NUM, m: M, resultOK, carryOK },
    });
  }, [res, carry, answer, carryInto, W, playCorrect, playWrong, onSubmit]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const cellState = (i) => { if (!checked) return ''; return Number(res[i]) === answer[i] ? 'ok' : 'no'; };
  const fbText = feedback
    ? (feedback.kind === 'ok' ? t.correct : feedback.kind === 'okNoCarry' ? t.correctNoCarry : t.wrongCol(feedback.wrongCol))
    : '';

  return (
    <div className="aq aq26">
      <style>{`
        .aq26 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq26 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq26 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 18px; }
        .aq26 .aq-board { display:inline-block; margin:0 auto; }
        .aq26 .aq-boardwrap { display:flex; justify-content:center; }
        .aq26 .aq-grid { display:grid; gap:5px; }
        .aq26 .aq-cell { width:46px; height:52px; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; font-variant-numeric:tabular-nums; }
        .aq26 .aq-op { color:#1f2430; }
        .aq26 .aq-sign { color:#6b7280; font-size:26px; }
        .aq26 input.aq-cin { width:46px; height:52px; box-sizing:border-box; text-align:center; font-size:28px; font-weight:800; border-radius:11px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; color:#1f2430; }
        .aq26 input.aq-cin:focus { border-color:#5b8def; background:#fff; }
        .aq26 input.aq-cin.ok { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .aq26 input.aq-cin.no { border-color:#c0392b; background:#fdecec; color:#c0392b; }
        .aq26 input.aq-carry { width:30px; height:30px; box-sizing:border-box; text-align:center; font-size:16px; font-weight:800; border-radius:8px; border:1.5px dashed #c9a23a; background:#fffdf5; color:#c9a23a; outline:none; }
        .aq26 input.aq-carry:focus { border-style:solid; background:#fff; }
        .aq26 .aq-carrylbl { font-size:11px; color:#c9a23a; font-weight:700; text-align:right; padding-right:6px; }
        .aq26 .aq-line { height:3px; background:#1f2430; border-radius:2px; margin:3px 0; }
        .aq26 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:16px; text-align:center; }
        .aq26 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq26 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq26 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @media (max-width:400px){ .aq26 .aq-cell,.aq26 input.aq-cin{width:40px;height:48px;font-size:24px;} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-boardwrap">
        <div className="aq-board">
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

          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            {A.map((d, i) => (<div key={i} className="aq-cell aq-op">{d == null ? '' : d}</div>))}
          </div>
          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)`, alignItems: 'center' }}>
            <div className="aq-cell aq-sign" style={{ justifySelf: 'end', width: 'auto', paddingRight: 4 }}>×</div>
            {Array.from({ length: W }).map((_, i) => (<div key={i} className="aq-cell aq-op">{i === W - 1 ? M : ''}</div>))}
          </div>

          <div className="aq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            <div style={{ gridColumn: `2 / span ${W}` }}><div className="aq-line" /></div>
          </div>

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
