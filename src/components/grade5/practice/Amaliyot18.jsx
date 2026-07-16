// Amaliyot18 — Kasr qo'shish (har xil maxraj) · Blok 3 · daraja С · teg: fraction_addsub
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: 1/2 + 1/3 ni umumiy maxrajga keltirib qo'shish; o'quvchi surat va maxrajni kiritadi.
// 2/5 xatosi (surat+surat, maxraj+maxraj) feedbackda ochiq qarshi olinadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = { n: 1, d: 2 }, B = { n: 1, d: 3 };
const ANS = { n: 5, d: 6 }; // 1/2 + 1/3 = 3/6 + 2/6 = 5/6

const DATA = { tag: 'fraction_addsub', level: 'С', format: 'input', block: 3 };

const T = {
  uz: {
    title: "Kasrlarni qo'shish",
    body: "1/2 + 1/3 ni hisoblang. Avval umumiy maxrajga keltiring, keyin suratlarni qo'shing.",
    numL: 'Surat', denL: 'Maxraj',
    hint: "Umumiy maxraj — 6. 1/2 = 3/6, 1/3 = 2/6. Endi suratlarni qo'shing.",
    correct: "To'g'ri. 1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
    wrong: "Hali to'g'ri emas. 2/5 bo'lmaydi — surat va maxrajni alohida qo'shib bo'lmaydi. Umumiy maxraj 6 ga keltiring.",
  },
  ru: {
    title: 'Сложение дробей',
    body: 'Вычислите 1/2 + 1/3. Сначала приведите к общему знаменателю, потом сложите числители.',
    numL: 'Числитель', denL: 'Знаменатель',
    hint: 'Общий знаменатель — 6. 1/2 = 3/6, 1/3 = 2/6. Теперь сложите числители.',
    correct: 'Верно. 1/2 + 1/3 = 3/6 + 2/6 = 5/6.',
    wrong: 'Пока неверно. Не 2/5 — числитель и знаменатель нельзя складывать отдельно. Приведите к общему знаменателю 6.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');

const Bar = ({ n, d, color = '#fe5b1a' }) => (
  <div style={{ display: 'flex', width: '100%', height: 34, borderRadius: 8, overflow: 'hidden', border: '2px solid #cfd6e4' }}>
    {Array.from({ length: d }).map((_, i) => (
      <div key={i} style={{ flex: 1, borderLeft: i === 0 ? 'none' : '2px solid #fff', background: i < n ? color : '#eef2f8' }} />
    ))}
  </div>
);
const Frac = ({ n, d }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, fontWeight: 800, fontSize: 18, color: '#1f2430' }}>
    <span>{n}</span><span style={{ borderTop: '2px solid #1f2430', padding: '2px 6px 0', marginTop: 2 }}>{d}</span>
  </span>
);

export default function Amaliyot18(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [num, setNum] = useState('');
  const [den, setDen] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      const sa = initialAnswer.studentAnswer;
      if (sa.n != null) setNum(String(sa.n));
      if (sa.d != null) setDen(String(sa.d));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(num.trim() !== '' && den.trim() !== '' && !checked); }, [num, den, checked, onReady]);

  const check = useCallback(() => {
    const n = parseInt(cleanInt(num) || '-1', 10);
    const d = parseInt(cleanInt(den) || '-1', 10);
    const correct = n === ANS.n && d === ANS.d;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body, options: [],
      studentAnswer: { n, d }, correctAnswer: ANS,
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, a: A, b: B },
    });
  }, [num, den, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const ip = { inputMode: 'numeric', pattern: '[0-9]*', disabled: isReview || checked, placeholder: '0' };

  return (
    <div className="aq aq18">
      <style>{`
        .aq18 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq18 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq18 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq18 .aq-row { display:flex; align-items:center; gap:12px; margin:10px 0; }
        .aq18 .aq-lbl { width:44px; flex-shrink:0; text-align:center; }
        .aq18 .aq-barwrap { flex:1; }
        .aq18 .aq-answer { display:flex; align-items:center; justify-content:center; gap:14px; margin:18px 0 6px; }
        .aq18 .aq-eq { font-size:26px; font-weight:800; color:#6b7280; }
        .aq18 .aq-fracin { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .aq18 input.aq-in { width:70px; box-sizing:border-box; font-size:22px; font-weight:800; text-align:center; padding:9px 6px; border-radius:12px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .aq18 input.aq-in:focus { border-color:#fb7a45; background:#fff; }
        .aq18 input.aq-in:disabled { opacity:.85; }
        .aq18 .aq-bardiv { width:74px; height:3px; background:#1f2430; border-radius:2px; }
        .aq18 .aq-inlbl { font-size:11px; color:#9aa1ad; font-weight:700; text-transform:uppercase; }
        .aq18 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:8px; text-align:center; }
        .aq18 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq18 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq18 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-row">
        <div className="aq-lbl"><Frac n={A.n} d={A.d} /></div>
        <div className="aq-barwrap"><Bar n={A.n} d={A.d} /></div>
      </div>
      <div className="aq-row">
        <div className="aq-lbl"><Frac n={B.n} d={B.d} /></div>
        <div className="aq-barwrap"><Bar n={B.n} d={B.d} color="#7c3aed" /></div>
      </div>

      <div className="aq-answer">
        <span style={{ fontSize: 20, fontWeight: 800 }}>1/2 + 1/3</span>
        <span className="aq-eq">=</span>
        <div className="aq-fracin">
          <span className="aq-inlbl">{t.numL}</span>
          <input className="aq-in" value={num} onChange={(e) => setNum(cleanInt(e.target.value))} {...ip} />
          <div className="aq-bardiv" />
          <input className="aq-in" value={den} onChange={(e) => setDen(cleanInt(e.target.value))} {...ip} />
          <span className="aq-inlbl">{t.denL}</span>
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
