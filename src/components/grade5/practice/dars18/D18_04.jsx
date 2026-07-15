// Dars18 · Amaliyot 04 — Barchasini tanla · 🟢 · tag: sub_select_all
// Qaysi ayirmalar 2/5 ga teng? To'g'ri: 4/5−2/5 va 3/5−1/5. Xato: 4/5−3/5=1/5, 4/5−1/5=3/5.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// Har karta: [surat1, surat2], maxraj 5. correct = ayirma 2/5 ga tengmi.
const D04_CARDS = [
  { a: 4, b: 2, correct: true },  // 4/5 − 2/5 = 2/5
  { a: 4, b: 3, correct: false }, // 4/5 − 3/5 = 1/5
  { a: 3, b: 1, correct: true },  // 3/5 − 1/5 = 2/5
  { a: 4, b: 1, correct: false }, // 4/5 − 1/5 = 3/5
];
const D04_T = {
  uz: {
    eyebrow: 'Belgilang', setup: "Bekzod daftariga to'rtta ayirma yozib chiqdi. Ular orasida bir xil natija beradiganlari bor.",
    ask: "Natijasi 2/5 ga teng bo'lgan barcha ayirmalarni belgilang:",
    correct: "To'g'ri. 4/5 − 2/5 = 2/5 va 3/5 − 1/5 = 2/5. Qolgan ikkitasi 1/5 va 3/5 chiqadi.",
    wrong: "Maslahat: har bir ayirmani alohida hisoblang — hammasi ham 2/5 ga teng emas. Bittasini o'tkazib yubormang.",
    rule: "Suratlarni ayiring, maxrajni o'zgartirma. Faqat natijasi 2/5 chiqqanlarini belgilang.",
  },
  ru: {
    eyebrow: 'Отметьте', setup: 'Бекзод записал в тетради четыре разности. Среди них есть те, что дают одинаковый результат.',
    ask: 'Отметь все разности, результат которых равен 2/5:',
    correct: 'Верно. 4/5 − 2/5 = 2/5 и 3/5 − 1/5 = 2/5. Остальные две дают 1/5 и 3/5.',
    wrong: 'Подсказка: посчитай каждую разность отдельно — не все равны 2/5. Не пропусти ни одной.',
    rule: 'Вычитай числители, знаменатель не меняй. Отметь только те, где вышло 2/5.',
  },
};

export default function D18_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]); // tanlangan indekslar
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);
  const toggle = (i) => { if (isReview || checked) return; setSel((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]); };
  const check = useCallback(() => {
    const want = D04_CARDS.map((c, i) => (c.correct ? i : -1)).filter((i) => i >= 0);
    const correct = sel.length === want.length && want.every((i) => sel.includes(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_CARDS.map((c, i) => ({ id: String(i), label: c.a + '/5 - ' + c.b + '/5' })), studentAnswer: { sel }, correctAnswer: { sel: want }, correct, meta: { tag: 'sub_select_all', level: '🟢' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 340, margin: '4px auto 0' }}>
        {D04_CARDS.map((c, i) => {
          const on = sel.includes(i);
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; }
          if (checked && on) { const allOk = fb?.correct; bd = allOk ? '#1a7f43' : '#c0392b'; bg = allOk ? '#e8f7ee' : '#fdecec'; }
          return <button key={i} type="button" disabled={locked} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}>
            <Frac num={String(c.a)} den="5" size={18} /><span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#64748b' }}>−</span><Frac num={String(c.b)} den="5" size={18} />
          </button>;
        })}
      </div>
      <p style={{ fontSize: 12.5, color: '#94a3b8', textAlign: 'center', margin: '8px 0 0' }}>{lang === 'uz' ? "Bir nechta javob bo'lishi mumkin" : 'Ответов может быть несколько'}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
