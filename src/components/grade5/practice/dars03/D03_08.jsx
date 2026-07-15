// Dars03 · Amaliyot 08 — Ustunda qo'shish (yangi razryad) · 🔴 · Bekzod · tag: column_add
// Darslik §7, Mashq 137g: 977 200 + 127 033 — natija yangi (millionlar) razryadiga o'tadi.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const A_NUM = 977200, B_NUM = 127033; // 977200 + 127033 = 1104233
const DATA = { tag: 'column_add', level: '🔴' };
const T = {
  uz: {
    eyebrow: "Qo'shish",
    setup: "977 200 + 127 033 ni ustunda yeching. Diqqat: yig'indi yangi — millionlar razryadiga o'tadi.",
    carryHint: "o'tkazma",
    correct: "To'g'ri. 977 200 + 127 033 = 1 104 233.",
    wrong: "Hali to'g'ri emas. Yana bir bor tekshiring.",
  },
  ru: {
    eyebrow: 'Сложение',
    setup: 'Решите 977 200 + 127 033 столбиком. Внимание: сумма переходит в новый разряд — миллионы.',
    carryHint: 'перенос',
    correct: 'Верно. 977 200 + 127 033 = 1 104 233.',
    wrong: 'Пока неверно. Проверьте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const lastDigit = (raw) => { const s = String(raw).replace(/[^0-9]/g, ''); return s ? s[s.length - 1] : ''; };

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
    sum[i] = s % 10; c = Math.floor(s / 10);
    if (i - 1 >= 0) carryInto[i - 1] = c;
  }
  return { W, A, B, sum, carryInto };
}

export default function D03_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const { W, A, B, sum, carryInto } = useMemo(() => buildGrid(A_NUM, B_NUM), []);

  const [res, setRes] = useState(() => Array(W).fill(''));
  const [carry, setCarry] = useState(() => Array(W).fill(''));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (Array.isArray(sa.res)) setRes(sa.res.slice(0, W));
      if (Array.isArray(sa.carry)) setCarry(sa.carry.slice(0, W));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer, W]);
  useEffect(() => { onReady?.(res.every((x) => x !== '') && !checked); }, [res, checked, onReady]);

  const setResAt = (i, v) => { if (isReview || checked) return; setRes((p) => { const n = p.slice(); n[i] = lastDigit(v); return n; }); };
  const setCarryAt = (i, v) => { if (isReview || checked) return; setCarry((p) => { const n = p.slice(); n[i] = lastDigit(v); return n; }); };

  const check = useCallback(() => {
    const correct = res.every((x, i) => Number(x) === sum[i]);
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A_NUM} + ${B_NUM}`, options: [],
      studentAnswer: { res: res.slice(), carry: carry.slice() },
      correctAnswer: { sum: sum.join('') }, correct,
      meta: { tag: DATA.tag, level: DATA.level, a: A_NUM, b: B_NUM },
    });
  }, [res, carry, sum, playCorrect, playWrong, onSubmit]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const cellState = (i) => { if (!checked) return ''; return Number(res[i]) === sum[i] ? 'ok' : 'no'; };

  return (
    <div className="pq pq08">
      <style>{`
        .pq08 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq08 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq08 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 18px; color:#374151; }
        .pq08 .pq-boardwrap { display:flex; justify-content:center; }
        .pq08 .pq-grid { display:grid; gap:5px; }
        .pq08 .pq-cell { width:44px; height:50px; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; }
        .pq08 .pq-sign { color:#6b7280; font-size:24px; }
        .pq08 input.pq-cin { width:44px; height:50px; box-sizing:border-box; text-align:center; font-size:26px; font-weight:800; border-radius:11px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; color:#1f2430; }
        .pq08 input.pq-cin:focus { border-color:#5b8def; background:#fff; }
        .pq08 input.pq-cin.ok { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .pq08 input.pq-cin.no { border-color:#c0392b; background:#fdecec; color:#c0392b; }
        .pq08 input.pq-carry { width:28px; height:28px; box-sizing:border-box; text-align:center; font-size:15px; font-weight:800; border-radius:8px; border:1.5px dashed #c9a23a; background:#fffdf5; color:#c9a23a; outline:none; }
        .pq08 input.pq-carry:focus { border-style:solid; background:#fff; }
        .pq08 .pq-carrylbl { font-size:11px; color:#c9a23a; font-weight:700; text-align:right; padding-right:6px; }
        .pq08 .pq-line { height:3px; background:#1f2430; border-radius:2px; margin:3px 0; }
        .pq08 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .45s ease both; }
        .pq08 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq08 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq08 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq08 .a2 { animation-delay:.08s; }
        .pq08 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.09);} 100%{transform:scale(1);} }
        .pq08 input.pq-cin.ok { animation:pqPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @media (max-width:400px){ .pq08 .pq-cell,.pq08 input.pq-cin{width:38px;height:46px;font-size:22px;} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>

      <div className="pq-boardwrap a a3">
        <div>
          <div className="pq-grid" style={{ gridTemplateColumns: `40px repeat(${W}, 44px)`, alignItems: 'end', marginBottom: 2 }}>
            <div className="pq-carrylbl">{t.carryHint}</div>
            {Array.from({ length: W }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                {i < W - 1 ? (<input className="pq-carry" value={carry[i]} onChange={(e) => setCarryAt(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`o'tkazma ${W - i}`} />) : <span style={{ width: 28 }} />}
              </div>
            ))}
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `40px repeat(${W}, 44px)` }}>
            <div />
            {A.map((d, i) => (<div key={i} className="pq-cell">{d == null ? '' : d}</div>))}
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `40px repeat(${W}, 44px)`, alignItems: 'center' }}>
            <div className="pq-cell pq-sign" style={{ justifySelf: 'end', width: 'auto', paddingRight: 4 }}>+</div>
            {B.map((d, i) => (<div key={i} className="pq-cell">{d == null ? '' : d}</div>))}
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `40px repeat(${W}, 44px)` }}>
            <div />
            <div style={{ gridColumn: `2 / span ${W}` }}><div className="pq-line" /></div>
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `40px repeat(${W}, 44px)` }}>
            <div />
            {Array.from({ length: W }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                <input className={`pq-cin ${cellState(i)}`} value={res[i]} onChange={(e) => setResAt(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`natija ${W - i}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
