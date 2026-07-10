// Dars04 · Amaliyot 04 — Ustunda ko'paytirish (bir xonaliga) · 🟡 · Madina · tag: column_mul
// Darslik §13, Mashq 269: 125 × 8. jsx-question kontrakti. Maslahat yo'q.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const A_NUM = 125, M = 8; // 125 × 8 = 1000
const DATA = { tag: 'column_mul', level: '🟡' };
const T = {
  uz: {
    eyebrow: "Ko'paytirish",
    setup: "125 × 8 ni ustunda yeching. Har razryadni 8 ga ko'paytiring; perenosni yuqoridagi katakka yozib, keyingi ko'paytmaga qo'shing.",
    carryHint: 'perenos',
    correct: "To'g'ri. 125 × 8 = 1000.",
    wrong: "Hali to'g'ri emas. Yana bir bor tekshiring.",
  },
  ru: {
    eyebrow: 'Умножение',
    setup: 'Решите 125 × 8 столбиком. Умножайте каждый разряд на 8; перенос пишите в верхнюю клетку и прибавляйте к следующему произведению.',
    carryHint: 'перенос',
    correct: 'Верно. 125 × 8 = 1000.',
    wrong: 'Пока неверно. Проверьте ещё раз.',
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
    res[i] = p % 10; c = Math.floor(p / 10);
    if (i - 1 >= 0) carryInto[i - 1] = c;
  }
  return { W, A, res, carryInto };
}

export default function D04_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const { W, A, res: answer } = useMemo(() => buildGridMul(A_NUM, M), []);

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
    const correct = res.every((x, i) => Number(x) === answer[i]);
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${A_NUM} × ${M}`, options: [],
      studentAnswer: { res: res.slice(), carry: carry.slice() },
      correctAnswer: { res: answer.join('') }, correct,
      meta: { tag: DATA.tag, level: DATA.level, a: A_NUM, m: M },
    });
  }, [res, carry, answer, playCorrect, playWrong, onSubmit]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const cellState = (i) => { if (!checked) return ''; return Number(res[i]) === answer[i] ? 'ok' : 'no'; };

  return (
    <div className="pq pq04">
      <style>{`
        .pq04 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq04 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq04 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 18px; color:#374151; }
        .pq04 .pq-boardwrap { display:flex; justify-content:center; }
        .pq04 .pq-grid { display:grid; gap:5px; }
        .pq04 .pq-cell { width:46px; height:52px; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; font-variant-numeric:tabular-nums; }
        .pq04 .pq-sign { color:#6b7280; font-size:26px; }
        .pq04 input.pq-cin { width:46px; height:52px; box-sizing:border-box; text-align:center; font-size:28px; font-weight:800; border-radius:11px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; color:#1f2430; }
        .pq04 input.pq-cin:focus { border-color:#5b8def; background:#fff; }
        .pq04 input.pq-cin.ok { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; }
        .pq04 input.pq-cin.no { border-color:#c0392b; background:#fdecec; color:#c0392b; }
        .pq04 input.pq-carry { width:30px; height:30px; box-sizing:border-box; text-align:center; font-size:16px; font-weight:800; border-radius:8px; border:1.5px dashed #c9a23a; background:#fffdf5; color:#c9a23a; outline:none; }
        .pq04 input.pq-carry:focus { border-style:solid; background:#fff; }
        .pq04 .pq-carrylbl { font-size:11px; color:#c9a23a; font-weight:700; text-align:right; padding-right:6px; }
        .pq04 .pq-line { height:3px; background:#1f2430; border-radius:2px; margin:3px 0; }
        .pq04 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq04 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq04 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq04 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq04 .a2 { animation-delay:.08s; }
        .pq04 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.09);} 100%{transform:scale(1);} }
        .pq04 input.pq-cin.ok { animation:pqPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @media (max-width:400px){ .pq04 .pq-cell,.pq04 input.pq-cin{width:40px;height:48px;font-size:24px;} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>

      <div className="pq-boardwrap a a3">
        <div>
          <div className="pq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)`, alignItems: 'end', marginBottom: 2 }}>
            <div className="pq-carrylbl">{t.carryHint}</div>
            {Array.from({ length: W }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                {i < W - 1 ? (<input className="pq-carry" value={carry[i]} onChange={(e) => setCarryAt(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`perenos ${W - i}`} />) : <span style={{ width: 30 }} />}
              </div>
            ))}
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            {A.map((d, i) => (<div key={i} className="pq-cell">{d == null ? '' : d}</div>))}
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)`, alignItems: 'center' }}>
            <div className="pq-cell pq-sign" style={{ justifySelf: 'end', width: 'auto', paddingRight: 4 }}>×</div>
            {Array.from({ length: W }).map((_, i) => (<div key={i} className="pq-cell">{i === W - 1 ? M : ''}</div>))}
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
            <div />
            <div style={{ gridColumn: `2 / span ${W}` }}><div className="pq-line" /></div>
          </div>
          <div className="pq-grid" style={{ gridTemplateColumns: `48px repeat(${W}, 46px)` }}>
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
