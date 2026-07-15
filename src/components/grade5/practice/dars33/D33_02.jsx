// Dars33 · Amaliyot 02 — Qaysi biri nur · 🟢 · tag: geo_pick_ray
// Kesma/Nur/To'g'ri chiziq ichidan NURni tanlash. Nur — bir uchi bor, ikkinchi tomoni cheksiz.
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

const Seg = () => (<svg width="128" height="34" viewBox="0 0 128 34"><line x1="16" y1="17" x2="112" y2="17" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><circle cx="16" cy="17" r="5.5" fill={CY} /><circle cx="112" cy="17" r="5.5" fill={CY} /></svg>);
const Ray = () => (<svg width="128" height="34" viewBox="0 0 128 34"><line x1="16" y1="17" x2="108" y2="17" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><circle cx="16" cy="17" r="5.5" fill={CY} /><polyline points="102,11 112,17 102,23" fill="none" stroke={CY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const Lin = () => (<svg width="128" height="34" viewBox="0 0 128 34"><line x1="18" y1="17" x2="110" y2="17" stroke={CY} strokeWidth="3.5" strokeLinecap="round" /><polyline points="26,11 16,17 26,23" fill="none" stroke={CY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="102,11 112,17 102,23" fill="none" stroke={CY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);

// Variantlar: 0=kesma, 1=nur (to'g'ri), 2=to'g'ri chiziq
const D02_OPTS = [Seg, Ray, Lin];
const D02_CORRECT = 1;
const D02_T = {
  uz: {
    eyebrow: 'Tanlang', setup: "Alisher uch xil chiziq chizdi. Ulardan biri — nur.",
    ask: 'Qaysi biri NUR? Uni bosing:',
    names: ['Kesma', 'Nur', "To'g'ri chiziq"],
    correct: "To'g'ri. Nurning bitta boshi (uchi) bor, ikkinchi tomoni cheksiz davom etadi.",
    wrong: "Har figurada nechta uchi (chekkasi) borligini sanang — nur boshqalardan uchlari soni bilan farq qiladi.",
    rule: "Nur — 1 uchli chiziq.",
  },
  ru: {
    eyebrow: 'Выберите', setup: 'Алишер начертил три разные линии. Одна из них — луч.',
    ask: 'Какая из них ЛУЧ? Нажмите на неё:',
    names: ['Отрезок', 'Луч', 'Прямая'],
    correct: 'Верно. У луча одно начало (конец), другая сторона продолжается бесконечно.',
    wrong: 'Сосчитай, сколько концов у каждой фигуры — луч отличается от других числом концов.',
    rule: 'Луч — линия с 1 концом.',
  },
};

export default function D33_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D02_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.names.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D02_CORRECT }, correct, meta: { tag: 'geo_pick_ray', level: '🟢' } });
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
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, margin: '8px 0' }}>
        {D02_OPTS.map((Fig, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = CY; bg = '#ecfeff'; }
          if (checked && on) { const ok = i === D02_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          const showName = checked && on;
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, border: '2px solid ' + (on ? bd : '#cbd5e1'), background: on ? bd : '#fff' }} />
              <Fig />
              {showName && <span style={{ fontSize: 13, fontWeight: 800, color: 'inherit', fontFamily: 'inherit' }}>{t.names[i]}</span>}
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
