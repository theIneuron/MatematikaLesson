// Amaliyot19 — Noto'g'ri kasrni aralash songa o'tkazish · Blok 3 · daraja С · teg: mixed_improper
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: 7/4 → butun + surat/maxraj (1 3/4). Vizual: to'la bo'laklar + qoldiq. Maxraj berilgan.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const IMP = { n: 7, d: 4 };
const WHOLE = Math.floor(IMP.n / IMP.d); // 1
const REM = IMP.n % IMP.d;               // 3

const DATA = { tag: 'mixed_improper', level: 'С', format: 'input', block: 3 };

const T = {
  uz: {
    title: "Aralash songa o'tkazish",
    body: "7/4 noto'g'ri kasrni aralash songa o'tkazing. To'rtdan nechta butun chiqadi, qancha qoladi?",
    wholeL: 'Butun', numL: 'Surat',
    hint: "7 ni 4 ga bo'ling: 7 : 4 = 1 (qoldiq 3). Butun — 1, qoldiq surat — 3, maxraj o'zgarmaydi.",
    correct: "To'g'ri. 7/4 = 1 butun va 3/4, ya'ni 1 3/4.",
    wrong: "Hali to'g'ri emas. 7 : 4 = 1 va qoldiq 3. Butun 1, surat 3, maxraj 4.",
  },
  ru: {
    title: 'Перевод в смешанное число',
    body: 'Переведите неправильную дробь 7/4 в смешанное число. Сколько целых из четвертей и сколько остаётся?',
    wholeL: 'Целое', numL: 'Числитель',
    hint: 'Разделите 7 на 4: 7 : 4 = 1 (остаток 3). Целое — 1, числитель остатка — 3, знаменатель тот же.',
    correct: 'Верно. 7/4 = 1 целое и 3/4, то есть 1 3/4.',
    wrong: 'Пока неверно. 7 : 4 = 1 и остаток 3. Целое 1, числитель 3, знаменатель 4.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

// n dan d ta ulush to'ldirilgan bitta "butun" polosa
const WholeBar = ({ fill, d }) => (
  <div style={{ display: 'flex', width: 120, height: 34, borderRadius: 8, overflow: 'hidden', border: '2px solid #cfd6e4' }}>
    {Array.from({ length: d }).map((_, i) => (
      <div key={i} style={{ flex: 1, borderLeft: i === 0 ? 'none' : '2px solid #fff', background: i < fill ? '#2563eb' : '#eef2f8' }} />
    ))}
  </div>
);

export default function Amaliyot19(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [whole, setWhole] = useState('');
  const [num, setNum] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.whole != null) setWhole(String(sa.whole));
      if (sa.num != null) setNum(String(sa.num));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(whole.trim() !== '' && num.trim() !== '' && !checked); }, [whole, num, checked, onReady]);

  const check = useCallback(() => {
    const w = parseInt(cleanInt(whole) || '-1', 10);
    const n = parseInt(cleanInt(num) || '-1', 10);
    const correct = w === WHOLE && n === REM;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { whole: w, num: n, den: IMP.d },
      correctAnswer: { whole: WHOLE, num: REM, den: IMP.d },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, imp: IMP },
    });
  }, [whole, num, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ip = { inputMode: 'numeric', pattern: '[0-9]*', disabled: isReview || checked, placeholder: '0' };

  return (
    <div className="aq aq19">
      <style>{`
        .aq19 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq19 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq19 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq19 .aq-vis { display:flex; align-items:center; justify-content:center; gap:10px; margin:6px 0 20px; flex-wrap:wrap; }
        .aq19 .aq-plus { font-size:22px; font-weight:800; color:#6b7280; }
        .aq19 .aq-answer { display:flex; align-items:center; justify-content:center; gap:16px; margin:8px 0 6px; }
        .aq19 .aq-big { font-size:22px; font-weight:800; }
        .aq19 .aq-fracin { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .aq19 input.aq-in { width:66px; box-sizing:border-box; font-size:22px; font-weight:800; text-align:center; padding:9px 6px; border-radius:12px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq19 input.aq-in:focus { border-color:#5b8def; background:#fff; }
        .aq19 input.aq-in:disabled { opacity:.85; }
        .aq19 .aq-den { font-size:22px; font-weight:800; width:66px; text-align:center; }
        .aq19 .aq-bardiv { width:66px; height:3px; background:#1f2430; border-radius:2px; }
        .aq19 .aq-inlbl { font-size:11px; color:#9aa1ad; font-weight:700; text-transform:uppercase; }
        .aq19 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:8px; text-align:center; }
        .aq19 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq19 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq19 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-vis">
        <WholeBar fill={IMP.d} d={IMP.d} />
        <span className="aq-plus">+</span>
        <WholeBar fill={REM} d={IMP.d} />
        <span style={{ fontSize: 15, color: '#9aa1ad', fontWeight: 700 }}>= 7/4</span>
      </div>

      <div className="aq-answer">
        <span className="aq-big">7/4 =</span>
        <div className="aq-fracin">
          <span className="aq-inlbl">{t.wholeL}</span>
          <input className="aq-in" value={whole} onChange={(e) => setWhole(cleanInt(e.target.value))} {...ip} />
        </div>
        <div className="aq-fracin">
          <span className="aq-inlbl">{t.numL}</span>
          <input className="aq-in" value={num} onChange={(e) => setNum(cleanInt(e.target.value))} {...ip} />
          <div className="aq-bardiv" />
          <div className="aq-den">{IMP.d}</div>
        </div>
      </div>
      <div className="aq-hint">{t.hint}</div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
