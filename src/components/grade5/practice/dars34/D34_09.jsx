// Dars34 · Amaliyot 09 — Perimetr yoki yuza · 🔴 · tag: peri_vs_area
// Chegara ishi → perimetr; ichini qoplash → yuza. Har vaziyatga to'g'ri turni tanlang.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0e7490', background: '#ecfeff', border: '1px solid #a5f3fc', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#ecfeff', border: '1.5px solid #a5f3fc', color: '#0e7490' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_KEY = [0, 1, 0, 1]; // 0 = perimetr, 1 = yuza
const D09_T = {
  uz: {
    eyebrow: 'Perimetr yoki yuza', setup: "Har bir ish uchun tanlang: chegara bilan ishlaymizmi (perimetr) yoki ichini qoplaymizmi (yuza)?",
    ask: 'Har vaziyatga mos turni tanlang:',
    rows: ["Bog'ga simto'r tortish", "Polni bo'yash", 'Rasm chetiga lenta yopishtirish', "Xonaga gilam to'shash"],
    peri: 'Perimetr', area: 'Yuza',
    correct: "To'g'ri. Chegara bo'ylab ish — perimetr; ichini qoplash — yuza.",
    wrong: "Chegara bo'ylab bo'lsa — perimetr; ichini to'ldirsa — yuza. Har birini shu savol bilan tekshiring.",
    rule: "Chegara → perimetr, ichi → yuza.",
  },
  ru: {
    eyebrow: 'Периметр или площадь', setup: 'Для каждого дела выбери: работаем с границей (периметр) или покрываем внутри (площадь)?',
    ask: 'Выбери подходящее для каждой ситуации:',
    rows: ['Натянуть сетку вокруг сада', 'Покрасить пол', 'Наклеить ленту по краю картины', 'Постелить ковёр в комнате'],
    peri: 'Периметр', area: 'Площадь',
    correct: 'Верно. Работа по границе — периметр; покрытие внутри — площадь.',
    wrong: 'По границе — периметр; заполнить внутри — площадь. Проверь каждую этим вопросом.',
    rule: 'Граница → периметр, внутри → площадь.',
  },
};

export default function D34_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [asg, setAsg] = useState([null, null, null, null]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.asg) { setAsg(sa.asg); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const complete = asg.every((v) => v !== null);
  useEffect(() => { onReady?.(complete && !checked); }, [complete, checked, onReady]);
  const locked = isReview || checked;
  const setRow = (r, v) => { if (locked) return; setAsg((a) => a.map((x, i) => (i === r ? v : x))); };
  const check = useCallback(() => {
    const correct = asg.every((v, i) => v === D09_KEY[i]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { asg }, correctAnswer: { asg: D09_KEY }, correct, meta: { tag: 'peri_vs_area', level: '🔴' } });
  }, [asg, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const pill = (r, v, label) => {
    const on = asg[r] === v;
    let bd = '#d6dae3', bg = '#fff', col = '#64748b';
    if (on) { bd = '#0e7490'; bg = '#ecfeff'; col = '#0e7490'; }
    if (checked && on) { const ok = fb?.correct === true; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={locked} onClick={() => setRow(r, v)} style={{ flex: 1, minWidth: 0, height: 40, borderRadius: 10, border: '2px solid ' + bd, background: bg, color: col, fontSize: 13.5, fontWeight: 800, cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d34-pop { animation: d34pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d34pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d34-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 14.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {t.rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '10px 12px', borderRadius: 13, background: '#f8fafc', border: '1px solid #eef2f7' }}>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: '#1f2430' }}>{r}</span>
            <div style={{ display: 'flex', gap: 8 }}>{pill(i, 0, t.peri)}{pill(i, 1, t.area)}</div>
          </div>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
