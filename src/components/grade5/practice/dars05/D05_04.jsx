// Dars05 · Amaliyot 04 — Burchak usulida bo'lish (bosqichli) · 🟡 · Madina · tag: long_div
// Darslik §14, Mashq 302: 1072 : 8. jsx-question kontrakti. Maslahat yo'q.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const DIVIDEND = 1072, DIVISOR = 8; // 1072 : 8 = 134 (qoldiq 0)
const DATA = { tag: 'long_div', level: '🟡' };
const T = {
  uz: {
    eyebrow: "Bo'lish",
    setup: "1072 ni 8 ga burchak usulida bo'ling. Har qadamda joriy sonni 8 ga bo'ling — bo'linma raqamini va qoldiqni yozing; qoldiqqa keyingi raqamni tushiring.",
    stepQ: "bo'linma", stepR: 'qoldiq', bringLbl: 'tushiramiz',
    quotient: "Bo'linma (javob):",
    correct: "To'g'ri. 1072 : 8 = 134, qoldiq 0.",
    wrong: "Hali to'g'ri emas. Yana bir bor tekshiring.",
  },
  ru: {
    eyebrow: 'Деление',
    setup: 'Разделите 1072 на 8 уголком. На каждом шаге делите текущее число на 8 — запишите цифру частного и остаток; к остатку сносите следующую цифру.',
    stepQ: 'частное', stepR: 'остаток', bringLbl: 'сносим',
    quotient: 'Частное (ответ):',
    correct: 'Верно. 1072 : 8 = 134, остаток 0.',
    wrong: 'Пока неверно. Проверьте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const lastDigit = (raw) => { const s = String(raw).replace(/[^0-9]/g, ''); return s ? s[s.length - 1] : ''; };

function buildSteps(dividend, divisor) {
  const digs = String(dividend).split('').map(Number);
  const steps = []; let rem = 0;
  for (let i = 0; i < digs.length; i++) {
    const cur = rem * 10 + digs[i];
    const q = Math.floor(cur / divisor); rem = cur % divisor;
    steps.push({ digit: digs[i], cur, q, rem });
  }
  return steps;
}

export default function D05_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const steps = useMemo(() => buildSteps(DIVIDEND, DIVISOR), []);
  const N = steps.length;

  const [qv, setQv] = useState(() => Array(N).fill(''));
  const [rv, setRv] = useState(() => Array(N).fill(''));
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (Array.isArray(sa.q)) setQv(sa.q.slice(0, N));
      if (Array.isArray(sa.r)) setRv(sa.r.slice(0, N));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer, N]);
  useEffect(() => { onReady?.(qv.every((x) => x !== '') && rv.every((x) => x !== '') && !checked); }, [qv, rv, checked, onReady]);

  const setQ = (i, v) => { if (isReview || checked) return; setQv((p) => { const n = p.slice(); n[i] = lastDigit(v); return n; }); };
  const setR = (i, v) => { if (isReview || checked) return; setRv((p) => { const n = p.slice(); n[i] = lastDigit(v); return n; }); };

  const check = useCallback(() => {
    const correct = steps.every((s, i) => Number(qv[i]) === s.q && Number(rv[i]) === s.rem);
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    const quotient = steps.map((s) => s.q).join('').replace(/^0+(?=\d)/, '');
    onSubmit?.({
      questionText: `${DIVIDEND} : ${DIVISOR}`, options: [],
      studentAnswer: { q: qv.slice(), r: rv.slice() },
      correctAnswer: { quotient, remainder: steps[N - 1].rem }, correct,
      meta: { tag: DATA.tag, level: DATA.level, dividend: DIVIDEND, divisor: DIVISOR },
    });
  }, [qv, rv, steps, N, playCorrect, playWrong, onSubmit]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const stepState = (i) => { if (!checked) return ''; return (Number(qv[i]) === steps[i].q && Number(rv[i]) === steps[i].rem) ? 'ok' : 'no'; };
  const quotientStr = checked ? steps.map((s) => s.q).join('') : qv.map((x) => x === '' ? '·' : x).join('');

  return (
    <div className="pq pq04">
      <style>{`
        .pq04 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq04 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq04 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 16px; color:#374151; }
        .pq04 .pq-head { display:flex; align-items:center; justify-content:center; gap:12px; font-size:26px; font-weight:800; margin:2px 0 16px; font-variant-numeric:tabular-nums; }
        .pq04 .pq-head .dv { color:#2563eb; }
        .pq04 .pq-steps { display:flex; flex-direction:column; gap:8px; }
        .pq04 .pq-step { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:9px 11px; border-radius:12px; border:1.5px solid #eef0f4; background:#fafbfc; }
        .pq04 .pq-step.ok { border-color:#bfe6cd; background:#f2fbf5; }
        .pq04 .pq-step.no { border-color:#f4c9c4; background:#fdf4f3; }
        .pq04 .pq-cur { font-size:19px; font-weight:800; min-width:48px; font-variant-numeric:tabular-nums; }
        .pq04 .pq-sep { color:#9aa1ad; font-weight:700; }
        .pq04 .pq-mini { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .pq04 .pq-mini span { font-size:10px; color:#9aa1ad; font-weight:700; text-transform:uppercase; }
        .pq04 input.pq-si { width:44px; height:44px; box-sizing:border-box; text-align:center; font-size:22px; font-weight:800; border-radius:10px; border:2px solid #d6dae3; background:#fff; outline:none; font-variant-numeric:tabular-nums; }
        .pq04 input.pq-si:focus { border-color:#5b8def; }
        .pq04 .pq-bring { font-size:12px; color:#c9a23a; font-weight:700; margin-left:auto; }
        .pq04 .pq-quot { text-align:center; margin:16px 0 4px; }
        .pq04 .pq-quot-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
        .pq04 .pq-quot-num { font-size:30px; font-weight:800; letter-spacing:.06em; font-variant-numeric:tabular-nums; }
        .pq04 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq04 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq04 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq04 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq04 .a2 { animation-delay:.08s; }
        .pq04 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <div className="pq-head a a3"><span className="dv">{DIVIDEND}</span><span className="pq-sep">:</span><span>{DIVISOR}</span></div>

      <div className="pq-steps">
        {steps.map((s, i) => (
          <div key={i} className={`pq-step ${stepState(i)}`} style={{ animation: `pqUp .4s cubic-bezier(.22,1,.36,1) ${(0.2 + i * 0.1).toFixed(2)}s both` }}>
            <span className="pq-cur">{s.cur}</span>
            <span className="pq-sep">: {DIVISOR} =</span>
            <div className="pq-mini">
              <span>{t.stepQ}</span>
              <input className="pq-si" value={qv[i]} onChange={(e) => setQ(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`${t.stepQ} ${i + 1}`} />
            </div>
            <div className="pq-mini">
              <span>{t.stepR}</span>
              <input className="pq-si" value={rv[i]} onChange={(e) => setR(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`${t.stepR} ${i + 1}`} />
            </div>
            {i < N - 1 && <span className="pq-bring">↓ {steps[i + 1].digit} {t.bringLbl}</span>}
          </div>
        ))}
      </div>

      <div className="pq-quot">
        <div className="pq-quot-lbl">{t.quotient}</div>
        <div className="pq-quot-num" style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{quotientStr}</div>
      </div>

      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
