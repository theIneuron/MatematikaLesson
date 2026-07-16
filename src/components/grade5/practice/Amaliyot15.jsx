// Amaliyot15 — Kasrlarni solishtirish: polosa-model + >/=/< · Blok 2 · daraja Б · teg: fraction_compare
// jsx-question kontrakti. Audio yo'q. Faqat react importi.
// Mexanika: ikki kasr polosa (ulushlarga bo'lingan, surat qismi bo'yalgan) sifatida ko'rsatiladi;
// o'quvchi chap kasr o'ng kasrga nisbatan >, =, yoki < ekanini tanlaydi. Har xil maxrajli holat.

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Chap 2/3, o'ng 3/4 → 2/3 < 3/4
const LEFT = { n: 2, d: 3 };
const RIGHT = { n: 3, d: 4 };
const REL = LEFT.n * RIGHT.d < RIGHT.n * LEFT.d ? '<' : (LEFT.n * RIGHT.d > RIGHT.n * LEFT.d ? '>' : '=');

const DATA = { tag: 'fraction_compare', level: 'Б', format: 'compare', block: 2 };

const T = {
  uz: {
    title: 'Kasrlarni solishtirish',
    body: "Ikki kasrni solishtiring. Chap kasr o'ng kasrdan katta, teng yoki kichikmi?",
    hint: "Maxrajlar har xil. Ulushlarni umumiy o'lchamga keltirib, bo'yalgan qismni taqqoslang.",
    correct: "To'g'ri. Umumiy ulushda 2/3 = 8/12, 3/4 = 9/12, demak 2/3 < 3/4.",
    wrong: "Hali to'g'ri emas. Bo'yalgan polosalarga qarang: qaysi biri ko'proq to'lgan?",
    pick: 'Belgini tanlang',
  },
  ru: {
    title: 'Сравнение дробей',
    body: 'Сравните две дроби. Левая дробь больше, равна или меньше правой?',
    hint: 'Знаменатели разные. Приведите доли к общему размеру и сравните закрашенную часть.',
    correct: 'Верно. В общих долях 2/3 = 8/12, 3/4 = 9/12, значит 2/3 < 3/4.',
    wrong: 'Пока неверно. Посмотрите на закрашенные полосы: какая заполнена больше?',
    pick: 'Выберите знак',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Bar = ({ n, d }) => (
  <div style={{ display: 'flex', width: '100%', height: 46, borderRadius: 10, overflow: 'hidden', border: '2px solid #cfd6e4' }}>
    {Array.from({ length: d }).map((_, i) => (
      <div key={i} style={{
        flex: 1,
        borderLeft: i === 0 ? 'none' : '2px solid #fff',
        background: i < n ? '#fe5b1a' : '#eef2f8',
      }} />
    ))}
  </div>
);

const Frac = ({ n, d, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, color, fontWeight: 800, fontSize: 20, verticalAlign: 'middle' }}>
    <span>{n}</span>
    <span style={{ borderTop: '2px solid ' + color, padding: '2px 7px 0', marginTop: 2 }}>{d}</span>
  </span>
);

export default function Amaliyot15(props) {
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
      questionText: t.body + ` ${LEFT.n}/${LEFT.d} ? ${RIGHT.n}/${RIGHT.d}`,
      options: [{ id: '>', label: '>' }, { id: '=', label: '=' }, { id: '<', label: '<' }],
      studentAnswer: { rel: picked },
      correctAnswer: { rel: REL },
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
    if (active) { bg = '#fe5b1a'; bd = '#fe5b1a'; col = '#fff'; }
    if (showState) { const ok = r === REL; bg = ok ? '#1a7f43' : '#c0392b'; bd = bg; col = '#fff'; }
    return {
      width: 64, height: 64, borderRadius: 16, fontSize: 30, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer',
      border: '2px solid ' + bd, background: bg, color: col, fontFamily: 'inherit',
    };
  };

  return (
    <div className="aq aq15">
      <style>{`
        .aq15 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq15 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq15 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq15 .aq-row { display:flex; align-items:center; gap:12px; margin:12px 0; }
        .aq15 .aq-barwrap { flex:1; }
        .aq15 .aq-fraclbl { width:52px; flex-shrink:0; text-align:center; }
        .aq15 .aq-rels { display:flex; justify-content:center; gap:14px; margin:20px 0 4px; }
        .aq15 .aq-pick { text-align:center; font-size:13px; color:#9aa1ad; font-weight:600; }
        .aq15 .aq-hint { font-size:13px; color:#9aa1ad; margin-top:10px; text-align:center; }
        .aq15 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq15 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq15 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body">{t.body}</p>

      <div className="aq-row">
        <div className="aq-fraclbl"><Frac n={LEFT.n} d={LEFT.d} color="#fe5b1a" /></div>
        <div className="aq-barwrap"><Bar n={LEFT.n} d={LEFT.d} /></div>
      </div>
      <div className="aq-row">
        <div className="aq-fraclbl"><Frac n={RIGHT.n} d={RIGHT.d} color="#fe5b1a" /></div>
        <div className="aq-barwrap"><Bar n={RIGHT.n} d={RIGHT.d} /></div>
      </div>

      <div className="aq-pick">{t.pick}</div>
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
