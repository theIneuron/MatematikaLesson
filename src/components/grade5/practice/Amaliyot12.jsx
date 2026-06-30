// Amaliyot12 — Interaktiv: kasr konstruktori (3/4 ni yig'ish) · Blok 2 · daraja Б · teg: fraction_build
// Manba: MathPraktikums «Фабрика дробей». jsx-question kontraktiga keltirilgan, Amaliyot dizayni. Audio yo'q.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const DENS = [2, 3, 4, 6, 8];
const DATA = { value: 0.75, num: 3, den: 4, tag: 'fraction_build', level: 'Б', format: '2.8' };

const T = {
  uz: {
    title: 'Kasr konstruktori',
    body: "Madina kasr fabrikasida ishlamoqda. 3/4 kasrini yig'ing: ulushlar sonini tanlang va kerakli ulushlarni bo'yang.",
    densLabel: 'Ulushlar soni:',
    densUnit: 'ulush',
    shaded: "Bo'yaldi",
    correctExact: "To'g'ri — bu 3/4.",
    correctEq: 'To\'g\'ri! Bu uchdan to\'rtga teng — ekvivalent kasr.',
    wrong: "Bu uchdan to'rt emas. Ko'proq bo'yang yoki ulushlar sonini o'zgartiring.",
  },
  ru: {
    title: 'Конструктор дробей',
    body: 'Мадина работает на фабрике дробей. Соберите дробь 3/4: выберите число долей и закрасьте нужные.',
    densLabel: 'Число долей:',
    densUnit: 'доли',
    shaded: 'Закрашено',
    correctExact: 'Верно — это 3/4.',
    correctEq: 'Верно! Это равно трём четвертям — эквивалентная дробь.',
    wrong: 'Это не три четверти. Закрасьте больше или поменяйте число долей.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot12(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [den, setDen] = useState(4);
  const [shaded, setShaded] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  const count = Object.values(shaded).filter(Boolean).length;

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.den != null) setDen(sa.den);
      if (sa.num != null) {
        const next = {};
        for (let i = 0; i < sa.num; i += 1) next[i] = true;
        setShaded(next);
      }
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(count > 0 && !checked); }, [count, checked, onReady]);

  const pickDen = (d) => { if (checked || isReview) return; setDen(d); setShaded({}); setFeedback(null); };
  const toggle = (i) => { if (checked || isReview) return; setShaded((s) => ({ ...s, [i]: !s[i] })); setFeedback(null); };

  const check = useCallback(() => {
    const value = count / den;
    const correct = Math.abs(value - DATA.value) < 1e-9;
    const exact = den === DATA.den && count === DATA.num;
    const msg = correct ? (exact ? t.correctExact : t.correctEq) : t.wrong;
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: DENS.map((d) => `${d} ${t.densUnit}`),
      studentAnswer: { num: count, den }, correctAnswer: { num: DATA.num, den: DATA.den },
      correct, meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, value },
    });
  }, [count, den, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;

  return (
    <div className="aq aq12">
      <style>{`
        .aq12 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq12 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq12 .aq-body { font-size:16px; line-height:1.5; margin:6px 0 16px; }
        .aq12 .aq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin:14px 0 8px; }
        .aq12 .aq-dens { display:flex; gap:8px; flex-wrap:wrap; }
        .aq12 .aq-den { padding:8px 14px; font-size:14px; font-weight:700; border-radius:10px; cursor:pointer;
          border:2px solid #d6dae3; background:#fff; color:#374151; transition:border-color .12s, background .12s; }
        .aq12 .aq-den:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq12 .aq-den.sel { border-color:#2563eb; background:#e8eefc; color:#1f2430; }
        .aq12 .aq-den:disabled { cursor:default; }
        .aq12 .aq-bar { display:flex; border:2px solid #cdd4df; border-radius:12px; overflow:hidden; height:72px; margin-top:14px; }
        .aq12 .aq-cell { flex:1; border:none; cursor:pointer; background:#f8fafc; transition:background .12s; }
        .aq12 .aq-cell + .aq-cell { border-left:1.5px solid #cdd4df; }
        .aq12 .aq-cell.on { background:#5b8def; }
        .aq12 .aq-cell:disabled { cursor:default; }
        .aq12 .aq-count { margin-top:12px; font-size:15px; color:#374151; }
        .aq12 .aq-count b { font-variant-numeric:tabular-nums; }
        .aq12 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq12 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq12 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <label className="aq-label">{t.densLabel}</label>
      <div className="aq-dens">
        {DENS.map((d) => (
          <button key={d} type="button" className={`aq-den ${den === d ? 'sel' : ''}`} disabled={lock}
            onClick={() => pickDen(d)}>{d} {t.densUnit}</button>
        ))}
      </div>

      <div className="aq-bar">
        {Array.from({ length: den }).map((_, i) => (
          <button key={i} type="button" className={`aq-cell ${shaded[i] ? 'on' : ''}`} disabled={lock}
            onClick={() => toggle(i)} aria-label={`ulush ${i + 1}`} />
        ))}
      </div>

      <div className="aq-count">{t.shaded}: <b>{count}/{den}</b></div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg || (feedback.correct ? t.correctExact : t.wrong)}</span>
        </div>
      )}
    </div>
  );
}
