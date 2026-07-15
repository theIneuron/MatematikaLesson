// Dars33 · Amaliyot 07 — Aylana yoki doira · 🔴 · tag: geo_circle
// "Markazdan bir xil uzoqlikdagi nuqtalar chizig'i nima?" → Aylana (faqat chiziq).
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

const D07_CORRECT = 0; // Aylana
const D07_T = {
  uz: {
    eyebrow: 'Tanlang', setup: "Oybek markazni belgiladi va undan bir xil uzoqlikdagi nuqtalarni birlashtirib chiziq chizdi.",
    ask: "Markazdan bir xil uzoqlikdagi nuqtalar chizig'i nima deb ataladi?",
    labels: { c1: 'aylana', c2: 'doira' },
    opts: ['Aylana', 'Doira', 'Burchak', 'Kesma'],
    correct: "To'g'ri. Aylana — markaz atrofidagi chiziq. Doira — aylana va uning ichi birga.",
    wrong: "Ikki tushuncha bor: bittasi — faqat chiziq, ikkinchisi — chiziq va uning ichi birga. Savolda qaysi biri so'ralyapti?",
    rule: "Aylana — chiziq; doira — chiziq va uning ichi.",
  },
  ru: {
    eyebrow: 'Выберите', setup: 'Ойбек отметил центр и провёл линию через точки, равноудалённые от него.',
    ask: 'Как называется линия из точек, равноудалённых от центра?',
    labels: { c1: 'окружность', c2: 'круг' },
    opts: ['Окружность', 'Круг', 'Угол', 'Отрезок'],
    correct: 'Верно. Окружность — линия вокруг центра. Круг — окружность вместе с её внутренностью.',
    wrong: 'Есть два понятия: одно — только линия, другое — линия вместе с внутренностью. О чём спрашивают в вопросе?',
    rule: 'Окружность — линия; круг — линия и её внутренность.',
  },
};

export default function D33_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D07_CORRECT }, correct, meta: { tag: 'geo_circle', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d33-draw { stroke-dasharray: 320; stroke-dashoffset: 320; animation: d33draw 1s ease both; }
        @keyframes d33draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { .d33-pop { animation: none !important; } .d33-draw { animation: none !important; stroke-dashoffset: 0; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', gap: 26, justifyContent: 'center', margin: '4px 0 8px' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="96" height="96" viewBox="0 0 96 96"><circle className="d33-draw" cx="48" cy="48" r="38" fill="none" stroke={CY} strokeWidth="4" /><circle cx="48" cy="48" r="3.5" fill="#0e7490" /><line x1="48" y1="48" x2="86" y2="48" stroke="#0e7490" strokeWidth="1.6" strokeDasharray="3 3" /></svg>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0e7490', marginTop: 2 }}>{checked && fb?.correct ? t.labels.c1 : ' '}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="38" fill="#a5f3fc" stroke={CY} strokeWidth="4" /><circle cx="48" cy="48" r="3.5" fill="#0e7490" /></svg>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0e7490', marginTop: 2 }}>{checked && fb?.correct ? t.labels.c2 : ' '}</div>
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = CY; bg = '#ecfeff'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ padding: '13px 12px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
