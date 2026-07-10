// Amaliyot20 — O'nli kasrlarni solishtirish · Blok 4 · daraja Б · teg: decimal_compare
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: 0,45 va 0,5 ni solishtirish; razryadlar bo'yicha tekislangan jadval ko'rsatiladi
// (0,45 vs 0,50), o'quvchi >/=/< tanlaydi. "Uzunroq = kattaroq" xatosi qarshi olinadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const LEFT = 0.45, RIGHT = 0.5;
const REL = LEFT > RIGHT ? '>' : (LEFT < RIGHT ? '<' : '=');
// tekislash uchun razryadlar (birlar, o'ndan, yuzdan)
const ROWS = [
  { lbl: { uz: 'birlar', ru: 'единицы' }, l: '0', r: '0' },
  { lbl: { uz: "o'ndan", ru: 'десятые' }, l: '4', r: '5' },
  { lbl: { uz: 'yuzdan', ru: 'сотые' }, l: '5', r: '0' },
];

const DATA = { tag: 'decimal_compare', level: 'Б', format: 'compare', block: 4 };

const T = {
  uz: {
    title: "O'nli kasrlarni solishtirish",
    body: "0,45 va 0,5 ni solishtiring. Qaysi biri katta?",
    hint: "Razryadlar bo'yicha tekislang: 0,45 va 0,50. O'ndan razryadi: 4 va 5 — 5 katta.",
    correct: "To'g'ri. O'ndan razryadida 4 < 5, shuning uchun 0,45 < 0,5.",
    wrong: "Hali to'g'ri emas. Ko'proq raqam — kattaroq degani emas. 0,45 = 0,45, 0,5 = 0,50; o'ndan razryadida 4 < 5.",
    pick: 'Belgini tanlang',
  },
  ru: {
    title: 'Сравнение десятичных дробей',
    body: 'Сравните 0,45 и 0,5. Какая из них больше?',
    hint: 'Выровняйте по разрядам: 0,45 и 0,50. Разряд десятых: 4 и 5 — 5 больше.',
    correct: 'Верно. В разряде десятых 4 < 5, поэтому 0,45 < 0,5.',
    wrong: 'Пока неверно. Больше цифр — не значит больше. 0,45 = 0,45, 0,5 = 0,50; в десятых 4 < 5.',
    pick: 'Выберите знак',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const fmt = (x) => String(x).replace('.', ',');

export default function Amaliyot20(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';

  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.rel) {
      setPicked(initialAnswer.studentAnswer.rel);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const pick = (r) => { if (isReview || checked) return; setPicked(r); };

  const check = useCallback(() => {
    const correct = picked === REL;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.body,
      options: [{ id: '>', label: '>' }, { id: '=', label: '=' }, { id: '<', label: '<' }],
      studentAnswer: { rel: picked }, correctAnswer: { rel: REL },
      correct,
      meta: { tag: DATA.tag, level: DATA.level, format: DATA.format, block: DATA.block, left: LEFT, right: RIGHT },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t.body]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const relBtn = (r) => {
    const active = picked === r;
    const showState = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#2563eb'; bd = '#2563eb'; col = '#fff'; }
    if (showState) { const ok = r === REL; bg = ok ? '#1a7f43' : '#c0392b'; bd = bg; col = '#fff'; }
    return { width: 64, height: 64, borderRadius: 16, fontSize: 30, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', border: '2px solid ' + bd, background: bg, color: col, fontFamily: 'inherit' };
  };

  return (
    <div className="aq aq20">
      <style>{`
        .aq20 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq20 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq20 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 16px; }
        .aq20 .aq-nums { display:flex; justify-content:center; gap:26px; margin:6px 0 14px; }
        .aq20 .aq-num { font-size:36px; font-weight:800; color:#2563eb; font-variant-numeric:tabular-nums; }
        .aq20 .aq-tbl { max-width:320px; margin:0 auto; border-collapse:collapse; width:100%; }
        .aq20 .aq-tbl th { font-size:11px; color:#9aa1ad; font-weight:700; text-transform:uppercase; padding:4px 6px; }
        .aq20 .aq-tbl td { text-align:center; font-size:22px; font-weight:800; padding:6px; border:1px solid #eef0f4; font-variant-numeric:tabular-nums; }
        .aq20 .aq-tbl td.rowlbl { font-size:12px; font-weight:600; color:#6b7280; text-transform:none; text-align:right; border:none; }
        .aq20 .aq-rels { display:flex; justify-content:center; gap:14px; margin:20px 0 4px; }
        .aq20 .aq-pick { text-align:center; font-size:13px; color:#9aa1ad; font-weight:600; }
        .aq20 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:10px; text-align:center; }
        .aq20 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq20 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq20 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-nums">
        <span className="aq-num">{fmt(LEFT)}</span>
        <span className="aq-num" style={{ color: '#7c3aed' }}>{fmt(RIGHT)}</span>
      </div>

      <table className="aq-tbl">
        <thead><tr><th></th><th>{fmt(LEFT)}</th><th>{fmt(RIGHT)}</th></tr></thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={i}>
              <td className="rowlbl">{row.lbl[lang] || row.lbl.uz}</td>
              <td>{row.l}</td>
              <td>{row.r}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="aq-pick" style={{ marginTop: 16 }}>{t.pick}</div>
      <div className="aq-rels">
        {['>', '=', '<'].map((r) => (
          <button key={r} type="button" style={relBtn(r)} onClick={() => pick(r)} disabled={isReview || checked}>{r}</button>
        ))}
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
