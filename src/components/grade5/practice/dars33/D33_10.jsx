// Dars33 · Amaliyot 10 — Kitob burchagi · 🔴 · tag: geo_realworld
// "Kitob varag'ining burchagi qanday burchak?" → To'g'ri burchak (90°). Kvadrat belgi YO'Q — shakl/tanishdan aniqlanadi (qiyinroq).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const CY = '#0891b2';
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: CY, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d33-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// Kitob varag'i, o'ng-past burchagi belgilangan
function Book() {
  return (
    <svg width="170" height="150" viewBox="0 0 170 150" style={{ display: 'block' }}>
      <rect x="34" y="18" width="104" height="120" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
      <rect x="28" y="22" width="104" height="120" rx="4" fill="#e0f2fe" stroke={CY} strokeWidth="2.5" />
      <line x1="42" y1="44" x2="118" y2="44" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="58" x2="118" y2="58" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="72" x2="100" y2="72" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
      <circle cx="132" cy="142" r="20" fill="#cffafe" opacity="0.7" />
      <path d="M 132 142 L 132 122 M 132 142 L 112 142" stroke="#0e7490" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

const D10_CORRECT = 0; // To'g'ri burchak
const D10_T = {
  uz: {
    eyebrow: 'Masala', setup: "Aziza kitobni ochib, uning varag'i burchagiga qaradi. Belgilangan burchak — o'ng-past burchak.",
    ask: "Kitob varag'ining burchagi qanday burchak?",
    opts: ["To'g'ri burchak (90°)", "O'tkir burchak", "O'tmas burchak"],
    correct: "To'g'ri. Kitob, daftar, stol burchagi — to'g'ri burchak, 90°.",
    wrong: "Belgilangan burchakning ochilishiga qarang — u to'g'ri, o'tkir yoki o'tmasmi? Kitob, daftar va stol burchaklarini eslang.",
    rule: "Atrofimizdagi ko'p burchaklar — to'g'ri burchak (kitob, daftar, stol).",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Азиза открыла книгу и посмотрела на угол страницы. Отмеченный угол — нижний правый.',
    ask: 'Какой угол у страницы книги?',
    opts: ['Прямой угол (90°)', 'Острый угол', 'Тупой угол'],
    correct: 'Верно. Угол книги, тетради, стола — прямой угол, 90°.',
    wrong: 'Посмотри на раствор отмеченного угла — он прямой, острый или тупой? Вспомни углы книги, тетради и стола.',
    rule: 'Многие углы вокруг нас — прямые (книга, тетрадь, стол).',
  },
};

export default function D33_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'geo_realworld', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d33-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 8px' }}><Book /></div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = CY; bg = '#ecfeff'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
