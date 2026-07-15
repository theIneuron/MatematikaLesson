// Dars16 · Amaliyot 01 (poz. 1) — Bir qadam qisqartirish · 🟢 · tag: reduce_one
// 6/8 ni oxirigacha qisqartirish: surat VA maxrajni yozadi → 3/4 (scaffold yo'q).
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// matn ichidagi kasrlarni ikki qatorli ko'rsatish (a/b, ?/b, ?/? tokenlari)
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
// ikki qatorli kasr (qoida bo'yicha yozuv)
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

// 6/8 ni oxirigacha qisqartiring: 6:2 = 3, 8:2 = 4 → 3/4. Ikkala katak ham to'ldiriladi.
const D01_A = 3, D01_B = 4;
const D01_T = {
  uz: {
    eyebrow: 'Qisqartiring', setup: "Aziza 6/8 ni oxirigacha (qisqarmaydigan holgacha) yozmoqchi.",
    ask: '6/8 ni oxirigacha qisqartiring: 6/8 = ?/?', label: 'Surat va maxrajni yozing:',
    correct: "To'g'ri. Surat va maxraj 2 ga bo'lindi: 6:2 = 3, 8:2 = 4. Demak 6/8 = 3/4.",
    wrong: "Maslahat: qisqartirilgan kasr o'sha miqdorni bildiradi — qiymati o'zgarmasligi kerak. Surat va maxrajga bir xil amal qilyapsanmi, va yana qisqartirish qoldimi?",
    rule: "Qisqartirish: surat va maxrajni BIR XIL songa bo'ling.",
  },
  ru: {
    eyebrow: 'Сократите', setup: 'Азиза хочет записать 6/8 до конца (до несократимого вида).',
    ask: 'Сократи 6/8 до конца: 6/8 = ?/?', label: 'Впишите числитель и знаменатель:',
    correct: 'Верно. Числитель и знаменатель поделены на 2: 6:2 = 3, 8:2 = 4. Значит 6/8 = 3/4.',
    wrong: 'Подсказка: сокращённая дробь означает то же количество — её значение не должно меняться. Одинаково ли ты действуешь с числителем и знаменателем, и можно ли ещё сократить?',
    rule: 'Сокращение: раздели числитель и знаменатель на одно число.',
  },
};
export default function D16_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D01_A && parseInt(b, 10) === D01_B;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: { a: D01_A, b: D01_B }, correct, meta: { tag: 'reduce_one', level: '🟢' } });
  }, [a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // all-or-nothing: to'liq to'g'ri bo'lmasa ikkala katak ham qizil (per-katak yashil emas)
  const bd = (v, ok) => checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cell = (val, set, ok) => (
    <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 60, height: 44, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd(parseInt(val, 10), ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '18px 0 8px' }}>
        <Frac num="6" den="8" size={38} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {cell(a, setA, D01_A)}
          <div style={{ width: 66, height: 3, background: '#1f2430' }} />
          {cell(b, setB, D01_B)}
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '6px 0 4px', textAlign: 'center' }}>{t.label}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
