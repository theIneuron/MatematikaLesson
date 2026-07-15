// Dars29 · Amaliyot 06 — Xatoni top · 🟡 · tag: div_error
// Sabina: 6 : 0,5 = 3 (yarmini oldi — bu ×0,5). To'g'ri: 6 : 0,5 = 12. Xato qadam — 2-qadam.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d29-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_CORRECT = 1; // 2-qadam — yarmini olish
const D06_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Sabina 6 : 0,5 ni hisobladi va 3 deb yozdi. Qaysi qadam xato?",
    ask: "Noto'g'ri qadamni bosing:",
    steps: ['6 ni oldi', 'Yarmini oldi: 6 → 3', "Javob: 3 deb yozdi"],
    correct: "To'g'ri. U yarmini olgan — bu ×0,5. Bo'lishda esa «necha marta sig'adi»: 6 : 0,5 = 12.",
    wrong: "Har bir qadamni ko'rib chiqing: bo'lish «necha marta sig'adi»ni bildiradi. Qaysi qadamda shu ma'no buzilgan?",
    rule: ":0,5 kattalashtiradi, ×0,5 kichiklashtiradi.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Сабина вычислила 6 : 0,5 и написала 3. Какой шаг неверный?',
    ask: 'Нажмите на неверный шаг:',
    steps: ['Взяла 6', 'Взяла половину: 6 → 3', 'Ответ: написала 3'],
    correct: 'Верно. Она взяла половину — это ×0,5. А при делении «сколько раз помещается»: 6 : 0,5 = 12.',
    wrong: 'Проверь каждый шаг: деление — это «сколько раз помещается». На каком шаге этот смысл нарушен?',
    rule: ':0,5 увеличивает, ×0,5 уменьшает.',
  },
};

export default function D29_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D06_CORRECT }, correct, meta: { tag: 'div_error', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d29-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t.steps.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D06_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              <span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#94a3b8', minWidth: 20 }}>{i + 1}.</span>
              <span style={S.mono}>{o}</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
