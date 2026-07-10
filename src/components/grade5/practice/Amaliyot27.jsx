// Amaliyot27 — Interaktiv столбик: burchak usulida bo'lish (bosqichli) · Blok 1 · daraja П · teg: column_div
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: bo'linuvchini razryadma-razryad tushirib, har qadamda bo'linma raqami VA qoldiqni kiritish.
// Jarayon tekshiriladi (faqat itog emas). Bosqichli — mobil uchun to'liq 2D-taxtadan yengilroq.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const DIVIDEND = 6384, DIVISOR = 4; // 6384 : 4 = 1596 (qoldiq 0)

const DATA = { tag: 'column_div', level: 'П', format: 'column', block: 1 };

const T = {
  uz: {
    title: "Burchak usulida bo'lish",
    body: "6384 ni 4 ga bo'ling. Har qadamda: joriy sonni 4 ga bo'ling — bo'linma raqamini va qoldiqni yozing. Qoldiqqa keyingi raqamni tushiring.",
    stepQ: "bo'linma",
    stepR: 'qoldiq',
    bringLbl: 'tushiramiz',
    quotient: "Bo'linma (javob):",
    hint: "6 : 4 = 1, qoldiq 2. Keyingi raqam 3 ni tushiramiz — 23 hosil bo'ladi. 23 : 4 = 5, qoldiq 3.",
    correct: "To'g'ri. 6384 : 4 = 1596, qoldiq 0. Har qadam joyida.",
    wrongStep: (s) => `Hali to'g'ri emas. ${s}-qadamni tekshiring: joriy sonni 4 ga to'g'ri bo'ldingizmi (bo'linma × 4 + qoldiq = joriy son)?`,
  },
  ru: {
    title: 'Деление уголком',
    body: 'Разделите 6384 на 4. На каждом шаге: разделите текущее число на 4 — запишите цифру частного и остаток. К остатку сносите следующую цифру.',
    stepQ: 'частное',
    stepR: 'остаток',
    bringLbl: 'сносим',
    quotient: 'Частное (ответ):',
    hint: '6 : 4 = 1, остаток 2. Сносим следующую цифру 3 — получаем 23. 23 : 4 = 5, остаток 3.',
    correct: 'Верно. 6384 : 4 = 1596, остаток 0. Каждый шаг на месте.',
    wrongStep: (s) => `Пока неверно. Проверьте шаг ${s}: правильно ли разделили текущее число на 4 (частное × 4 + остаток = текущее число)?`,
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const lastDigit = (raw) => { const s = String(raw).replace(/[^0-9]/g, ''); return s ? s[s.length - 1] : ''; };

// har razryad uchun bosqich: cur = oldingi qoldiq*10 + raqam; q = cur/divisor; rem = cur%divisor
function buildSteps(dividend, divisor) {
  const digs = String(dividend).split('').map(Number);
  const steps = []; let rem = 0;
  for (let i = 0; i < digs.length; i++) {
    const cur = rem * 10 + digs[i];
    const q = Math.floor(cur / divisor);
    rem = cur % divisor;
    steps.push({ digit: digs[i], cur, q, rem, first: i === 0 });
  }
  return steps;
}

export default function Amaliyot27(props) {
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
    let wrongStep = 0;
    for (let i = 0; i < N; i++) {
      if (Number(qv[i]) !== steps[i].q || Number(rv[i]) !== steps[i].rem) { wrongStep = i + 1; break; }
    }
    const correct = wrongStep === 0;
    setFeedback({ correct, wrongStep }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    const quotient = steps.map((s) => s.q).join('').replace(/^0+(?=\d)/, '');
    onSubmit?.({
      questionText: `${DIVIDEND} : ${DIVISOR}`, options: [],
      studentAnswer: { q: qv.slice(), r: rv.slice() },
      correctAnswer: { q: steps.map((s) => s.q), r: steps.map((s) => s.rem), quotient, remainder: steps[N - 1].rem },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, dividend: DIVIDEND, divisor: DIVISOR },
    });
  }, [qv, rv, steps, N, playCorrect, playWrong, onSubmit]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const stepState = (i) => { if (!checked) return ''; return (Number(qv[i]) === steps[i].q && Number(rv[i]) === steps[i].rem) ? 'ok' : 'no'; };
  const quotientStr = checked ? steps.map((s) => s.q).join('') : qv.map((x) => x === '' ? '·' : x).join('');

  return (
    <div className="aq aq27">
      <style>{`
        .aq27 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq27 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq27 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq27 .aq-head { display:flex; align-items:center; justify-content:center; gap:12px; font-size:26px; font-weight:800; margin:2px 0 16px; font-variant-numeric:tabular-nums; }
        .aq27 .aq-head .dv { color:#2563eb; }
        .aq27 .aq-steps { display:flex; flex-direction:column; gap:8px; }
        .aq27 .aq-step { display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding:9px 11px; border-radius:12px; border:1.5px solid #eef0f4; background:#fafbfc; }
        .aq27 .aq-step.ok { border-color:#bfe6cd; background:#f2fbf5; }
        .aq27 .aq-step.no { border-color:#f4c9c4; background:#fdf4f3; }
        .aq27 .aq-cur { font-size:19px; font-weight:800; min-width:52px; font-variant-numeric:tabular-nums; }
        .aq27 .aq-sep { color:#9aa1ad; font-weight:700; }
        .aq27 .aq-mini { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .aq27 .aq-mini span { font-size:10px; color:#9aa1ad; font-weight:700; text-transform:uppercase; }
        .aq27 input.aq-si { width:44px; height:44px; box-sizing:border-box; text-align:center; font-size:22px; font-weight:800; border-radius:10px; border:2px solid #d6dae3; background:#fff; outline:none; font-variant-numeric:tabular-nums; }
        .aq27 input.aq-si:focus { border-color:#5b8def; }
        .aq27 .aq-bring { font-size:12px; color:#c9a23a; font-weight:700; margin-left:auto; }
        .aq27 .aq-quot { text-align:center; margin:16px 0 4px; }
        .aq27 .aq-quot-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
        .aq27 .aq-quot-num { font-size:30px; font-weight:800; letter-spacing:.06em; font-variant-numeric:tabular-nums; }
        .aq27 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:10px; text-align:center; }
        .aq27 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq27 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq27 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-head"><span className="dv">{DIVIDEND}</span><span className="aq-sep">:</span><span>{DIVISOR}</span></div>

      <div className="aq-steps">
        {steps.map((s, i) => (
          <div key={i} className={`aq-step ${stepState(i)}`}>
            <span className="aq-cur">{s.cur}</span>
            <span className="aq-sep">: {DIVISOR} =</span>
            <div className="aq-mini">
              <span>{t.stepQ}</span>
              <input className="aq-si" value={qv[i]} onChange={(e) => setQ(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`${t.stepQ} ${i + 1}`} />
            </div>
            <div className="aq-mini">
              <span>{t.stepR}</span>
              <input className="aq-si" value={rv[i]} onChange={(e) => setR(i, e.target.value)} inputMode="numeric" maxLength={1} disabled={isReview || checked} aria-label={`${t.stepR} ${i + 1}`} />
            </div>
            {i < N - 1 && <span className="aq-bring">↓ {steps[i + 1].digit} {t.bringLbl}</span>}
          </div>
        ))}
      </div>

      <div className="aq-quot">
        <div className="aq-quot-lbl">{t.quotient}</div>
        <div className="aq-quot-num" style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{quotientStr}</div>
      </div>
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrongStep(feedback.wrongStep)}</span>
        </div>
      )}
    </div>
  );
}
