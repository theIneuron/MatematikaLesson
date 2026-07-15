// Dars34 · Amaliyot 06 — Xatoni top · 🟡 · tag: peri_error
// Kontekst: maydon chetidan aylanib yugurish (yo'l = perimetr). Sardor perimetr o'rniga ko'paytirdi (8 × 5 = 40 — bu yuza). To'g'ri P = 2 × (8 + 5) = 26 m.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_CORRECT = 1; // xato qadam — u ko'paytirdi
const D06_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Sardor to'rtburchak maydon chetidan bir marta aylanib yuguradi: tomonlari 8 m va 5 m. U bosib o'tgan yo'lni shunday hisobladi. Xato qadamni bosing.",
    ask: 'Qaysi qadam xato?',
    steps: ['Tomonlar: 8 m va 5 m', '8 × 5 = 40', "Yo'l = 40 m"],
    correct: "To'g'ri. Chegara bo'ylab yo'l = perimetr: 2 × (8 + 5) = 26 m. Ko'paytirish 8 × 5 esa yuzani beradi.",
    wrong: "Aylanib yugurish — chegara bo'ylab yo'l. Chegara uzunligini topishda tomonlar qo'shiladimi yoki ko'paytiriladimi? Har bir qadamni shu savol bilan tekshiring.",
    rule: "Perimetr — qo'shish; ko'paytirish — yuza.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Сардор один раз обегает прямоугольное поле по краю: стороны 8 м и 5 м. Пройденный путь он посчитал так. Нажми ошибочный шаг.',
    ask: 'Какой шаг ошибочный?',
    steps: ['Стороны: 8 м и 5 м', '8 × 5 = 40', 'Путь = 40 м'],
    correct: 'Верно. Путь по границе = периметр: 2 × (8 + 5) = 26 м. А 8 × 5 даёт площадь.',
    wrong: 'Бег по кругу — путь по границе. Чтобы найти длину границы, стороны складывают или умножают? Проверь каждый шаг этим вопросом.',
    rule: 'Периметр — сложение; умножение — площадь.',
  },
};

export default function D34_06(props) {
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
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.steps[picked] }, correctAnswer: { idx: D06_CORRECT }, correct, meta: { tag: 'peri_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d34-pop { animation: d34pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d34pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d34-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t.steps.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#dc2626'; bg = '#fef2f2'; }
          if (checked && on) { const ok = i === D06_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#eef2f7', color: '#64748b', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: col }}>{o}</span>
            </button>
          );
        })}
      </div>
      {checked && fb?.correct && (
        <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 0' }}>
          <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#1a7f43' }}>2 × (8 + 5) = 26 m</span>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
