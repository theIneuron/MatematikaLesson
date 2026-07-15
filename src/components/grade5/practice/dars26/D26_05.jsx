// Dars26 · Amaliyot 05 — Xato qadamni top · 🟡 · tag: dec_align_error
// Bekzod 4,2 − 1,15 ni vergul bo'yicha emas, o'ng chekka bo'yicha terdi → 3,7 (xato). To'g'ri: 4,20 − 1,15 = 3,05.
// Xato qadam — moslash (2-qadam). jsx-question kontrakti: onReady/registerCheck/onSubmit. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 10px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d26-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_CORRECT = 1; // moslash qadami xato
const D05_T = {
  uz: {
    eyebrow: 'Xato qadamni top', setup: "Bekzod 4,2 − 1,15 ni ustunda yechdi va 3,7 chiqardi. Bir qadamda xato bor.",
    ask: 'Bekzod qayerda xato qildi? Xato qadamni bosing:',
    steps: [
      "1. 4,2 va 1,15 ni ustunga yozdi.",
      "2. Sonlarni o'ng chekka bo'yicha terdi — vergulni vergul ostiga qo'ymadi.",
      "3. Ayirdi va 3,7 deb yozdi.",
    ],
    correct: "To'g'ri. Xato — moslashda: u vergulni emas, o'ng chekkani tekislagan. To'g'risi: 4,20 − 1,15 = 3,05.",
    wrong: "Har qadamni qaytadan tekshiring: sonlar qaysi chiziq bo'yicha terilganiga qarang.",
    rule: "Ayirishda ham vergul vergul ostida.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Бекзод решал 4,2 − 1,15 столбиком и получил 3,7. В одном шаге ошибка.',
    ask: 'Где Бекзод ошибся? Нажми на неверный шаг:',
    steps: [
      '1. Записал 4,2 и 1,15 столбиком.',
      '2. Выровнял числа по правому краю — не поставил запятую под запятой.',
      '3. Вычел и записал 3,7.',
    ],
    correct: 'Верно. Ошибка в выравнивании: он выровнял по правому краю, а не по запятой. Правильно: 4,20 − 1,15 = 3,05.',
    wrong: 'Проверь каждый шаг заново: посмотри, по какому краю выровнены числа.',
    rule: 'При вычитании тоже запятая под запятой.',
  },
};

export default function D26_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: D05_CORRECT }, correct, meta: { tag: 'dec_align_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>4,2 − 1,15 =</span>
        <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 800, color: '#c0392b' }}>3,7</span>
      </div>
      {checked && fb?.correct && (
        <div className="d26-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '2px 0 8px' }}>
          <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: '#1a7f43' }}>4,20 − 1,15 = 3,05</span>
        </div>
      )}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D05_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
