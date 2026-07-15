// Dars22 · Amaliyot 04 — Yashirin surat · 🟢 · tag: to_improper_fill
// 4¼ = ?/4. Aralash → noto'g'ri: 4×4+1 = 17 → 17/4.
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
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
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
const Mixed = ({ w, n, d, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle' }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 6, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);

const D04_ANS = 17; // 4×4+1
const D04_T = {
  uz: {
    eyebrow: 'Yashirin surat', setup: "Aziza 4¼ ni noto'g'ri kasr shaklida yozmoqchi. Maxraj o'sha 4 bo'lib qoladi.",
    ask: "4¼ ni noto'g'ri kasr qilib yozing. Suratini toping.", label: 'Surat:',
    correct: "To'g'ri. To'rt butun to'rtdan bo'laklarga aylanganda 16 ta, ustiga 1 — jami 17. Maxraj o'sha 4. Demak 4¼ = 17/4.",
    wrong: "Bitta butun ichida nechta to'rtdan bo'lak bor? To'rt butunda-chi? Mavjud bo'lakni ham unutmang.",
    rule: "Aralash → noto'g'ri: butun × maxraj + surat = yangi surat. 4×4+1 = 17.",
  },
  ru: {
    eyebrow: 'Скрытый числитель', setup: 'Азиза хочет записать 4¼ неправильной дробью. Знаменатель остаётся 4.',
    ask: 'Запиши 4¼ неправильной дробью. Найди числитель.', label: 'Числитель:',
    correct: 'Верно. Четыре целых превращаются в 16 четвертей, прибавим 1 — всего 17. Знаменатель тот же 4. Значит 4¼ = 17/4.',
    wrong: 'Сколько четвертей в одном целом? А в четырёх? Не забудь про имеющуюся часть.',
    rule: 'Смешанное → неправильная: целое × знаменатель + числитель = новый числитель. 4×4+1 = 17.',
  },
};

export default function D22_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D04_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D04_ANS }, correct, meta: { tag: 'to_improper_fill', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-in { opacity: 0; animation: d22in .6s ease .1s forwards; }
        @keyframes d22in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-in { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d22-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '16px 0 10px' }}>
        <Mixed w={4} n={1} d={4} size={30} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 56, height: 46, textAlign: 'center', fontSize: 25, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 60, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 25, fontWeight: 800, color: '#64748b' }}>4</div>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 4px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
