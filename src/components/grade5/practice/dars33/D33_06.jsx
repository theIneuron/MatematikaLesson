// Dars33 · Amaliyot 06 — Xato gapni top · 🟡 · tag: geo_error
// Alisher uch gap yozdi; XATO gap — "uzun tomonli burchak katta". Kattalik ochilishga bog'liq.
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

const D06_CORRECT = 1; // xato gap — 2-si
const D06_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Alisher geometriya haqida uch gap yozdi. Ulardan bittasi noto'g'ri.",
    ask: 'Xato gapni bosing:',
    opts: ["Kesmaning ikki uchi bor.", "Tomoni uzun bo'lsa, burchak katta bo'ladi.", "To'g'ri burchak — 90 gradus."],
    correct: "To'g'ri. Xato — 2-gapda. Burchak kattaligi tomon uzunligiga emas, ochilishga bog'liq.",
    wrong: "Uch gapni yana o'qing — qaysi biri geometrik qoidaga zid?",
    rule: "Burchak — ochilish bilan o'lchanadi, tomon uzunligi bilan emas.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Алишер написал три утверждения про геометрию. Одно из них неверное.',
    ask: 'Нажмите на ошибочное утверждение:',
    opts: ['У отрезка два конца.', 'Если сторона длиннее, угол будет больше.', 'Прямой угол — 90 градусов.'],
    correct: 'Верно. Ошибка — во 2-м утверждении. Величина угла зависит от раствора, а не от длины сторон.',
    wrong: 'Перечитай три утверждения — какое из них противоречит правилу?',
    rule: 'Угол измеряется раствором, а не длиной сторон.',
  },
};

export default function D33_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D06_CORRECT }, correct, meta: { tag: 'geo_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
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
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = CY; bg = '#ecfeff'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D06_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>
              <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: '#f1f5f9', color: '#64748b', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
