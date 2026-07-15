// Dars31 · Amaliyot 07 — Xatoni top · 🔴 · tag: of_error
// Kamol: "1200 ning 20% i = 20 × 1200 = 24000". Xato — 100 ga bo'lishni unutdi. To'g'ri: 240.
// Vizual: qadamli hisob (steps). Rang: cyan pill. jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#0e7490', light: '#ecfeff', mid: '#a5f3fc', fill: '#06b6d4', muted: '#4a8a99' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D07_CORRECT = 1; // xato qadam — 2-qadam
const D07_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Kamol 1200 ning 20% ini hisobladi. Bir qadamda xato qildi. Xato qadamni bosing.",
    ask: 'Qaysi qadam xato?',
    steps: ["20% olish kerak.", "20 × 1200 = 24000.", "Javob: 24000."],
    correct: "To'g'ri. Foizni avval 100 ga bo'lish kerak: 1200 : 100 = 12, ×20 = 240 (24000 emas).",
    wrong: "Foiz — yuzdan ulush. Har bir qadamni tekshiring: qaysida 100 ga bo'lish e'tibordan chetda qoldi?",
    rule: "Foiz — yuzdan ulush: doim avval : 100.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Камол вычислял 20% от 1200. В одном шаге ошибся. Нажми на неверный шаг.',
    ask: 'Какой шаг неверный?',
    steps: ['Нужно взять 20%.', '20 × 1200 = 24000.', 'Ответ: 24000.'],
    correct: 'Верно. Процент сначала делят на 100: 1200 : 100 = 12, ×20 = 240 (а не 24000).',
    wrong: 'Процент — доля от ста. Проверь каждый шаг: в каком из них забыли разделить на 100?',
    rule: 'Процент — доля от ста: всегда сначала : 100.',
  },
};

export default function D31_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: D07_CORRECT }, correct, meta: { tag: 'of_error', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((o, i) => {
          const on = picked === i;
          let bd = C.mid, bg = '#fff', col = '#1f2430';
          if (on) { bd = C.fill; bg = C.light; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', minHeight: 50 }}>
              <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: C.muted, width: 22, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: col }}>{o}</span>
            </button>
          );
        })}
      </div>
      {checked && fb?.correct && (
        <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 0' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#1a7f43' }}>1200 : 100 × 20 = 240</span>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
