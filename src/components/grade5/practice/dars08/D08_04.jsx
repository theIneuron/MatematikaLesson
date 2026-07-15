// Dars08 · Amaliyot 04 — Kvadratlarni moslash · 🟡 · Bekzod · tag: square_match
// 4 ta kvadratni qiymatiga ulash: 4²=16, 6²=36, 7²=49, 9²=81. Kartani bosib slotga qo'yish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
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
  <div className="d8-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// daraja ko'rsatkichini yuqori indeks qilib chizish
const Pow = ({ base, exp, size = 30, color = '#1f2430' }) => (
  <span style={{ ...S.mono, fontWeight: 800, color }}>
    <span style={{ fontSize: size }}>{base}</span><sup style={{ fontSize: size * 0.6 }}>{exp}</sup>
  </span>
);

const D04_ROWS = [
  { base: 4, exp: 2, val: 16 },
  { base: 6, exp: 2, val: 36 },
  { base: 7, exp: 2, val: 49 },
  { base: 9, exp: 2, val: 81 },
];
const D04_CARDS = [16, 49, 36, 81, 64, 42]; // 4 to'g'ri + 2 chalg'ituvchi
const D04_T = {
  uz: {
    eyebrow: 'Moslash', setup: "Bekzod kvadratlarni hisobladi. Har bir kvadratni javobiga ulang.",
    ask: "Kartani bosing, keyin mos kvadratning bo'sh joyini bosing:",
    correct: "To'g'ri. 4²=16, 6²=36, 7²=49, 9²=81. Har birini o'ziga ko'paytirib topdik.",
    wrong: "Maslahat: har kvadratni alohida hisoblang — sonni o'ziga ko'paytiring. 4² = 4×4, 6² = 6×6 va hokazo.",
    rule: "Kvadrat — sonni o'ziga ko'paytirish. Har xil son — har xil kvadrat.",
  },
  ru: {
    eyebrow: 'Соответствие', setup: 'Бекзод посчитал квадраты. Соедините каждый квадрат с ответом.',
    ask: 'Нажмите карточку, затем пустое место нужного квадрата:',
    correct: 'Верно. 4²=16, 6²=36, 7²=49, 9²=81. Каждое умножили на себя.',
    wrong: 'Подсказка: считайте каждый квадрат отдельно — умножьте число на себя. 4²=4×4, 6²=6×6 и т.д.',
    rule: 'Квадрат — умножение числа на себя. Разные числа — разные квадраты.',
  },
};
export default function D08_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]); // {v, ci}
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D04_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D04_ROWS[i].val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: D04_ROWS.map((r) => r.val) }, correct, meta: { tag: 'square_match', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const allCorrect = slots.every((x, i) => x && x.v === D04_ROWS[i].val);
  const slotColors = ['#2563eb', '#7c3aed', '#0f766e', '#c2410c'];
  const slotBg = ['#eff6ff', '#faf5ff', '#f0fdfa', '#fff7ed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d8-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      {/* kvadratlar + slotlar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, margin: '8px 0 14px' }}>
        {D04_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = slotColors[i], bg = slotBg[i], col = slotColors[i];
          if (checked && v != null) { const ok = allCorrect; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <div style={{ width: 66, textAlign: 'right' }}><Pow base={String(r.base)} exp="2" size={24} color={slotColors[i]} /></div>
              <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#cbd5e1' }}>=</span>
              <div onClick={clickSlot(i)} style={{ width: 74, height: 50, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 21, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      {/* javob kartalari */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D04_CARDS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 60, height: 48, borderRadius: 12, border: '2px dashed #e5e7eb', background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 60, height: 48, borderRadius: 12, border: '2px solid ' + (on ? '#2563eb' : '#cbd5e1'), background: on ? '#eaf0fe' : '#fff', ...S.mono, fontSize: 19, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
