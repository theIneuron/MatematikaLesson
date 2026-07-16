// Dars22 · Amaliyot 01 — Konversiya mashinasi · 🟢 · tag: to_improper_machine
// 2⅗ → noto'g'ri kasr. Mashina "qora quti": aralash son kiradi, noto'g'ri kasr chiqadi.
// To'g'risi 2×5+3 = 13 → 13/5. Formula setupda ochilmaydi; o'quvchi o'zi topadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
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

const D01_ANS = 13; // 2×5+3
const D01_T = {
  uz: {
    eyebrow: 'Mashina', setup: "Anvar aralash sonlarni noto'g'ri kasrga aylantiradigan mashina yasadi. Mashinaga 2⅗ kiritildi — u faqat noto'g'ri kasr suratini qaytaradi. Maxraj o'zgarmaydi, 5 bo'lib qoladi.",
    ask: "Mashinadan chiqadigan noto'g'ri kasrning suratini toping.", label: 'Yangi surat:',
    correct: "To'g'ri. Ikki butun beshdan bo'laklarga aylanganda 10 ta, ustiga bor 3 bo'lak — jami 13. Maxraj o'sha 5. Demak 2⅗ = 13/5.",
    wrong: "Bitta butun ichida nechta beshdan bo'lak bor? Ikki butunda-chi? Mavjud bo'laklarni ham unutmang.",
    rule: "Aralash → noto'g'ri: butun × maxraj + surat, maxraj o'zgarmaydi.",
  },
  ru: {
    eyebrow: 'Машина', setup: 'Анвар собрал машину, которая переводит смешанные числа в неправильные дроби. В машину ввели 2⅗ — она возвращает только числитель. Знаменатель не меняется, остаётся 5.',
    ask: 'Найди числитель неправильной дроби, которую выдаст машина.', label: 'Новый числитель:',
    correct: 'Верно. Два целых превращаются в 10 пятых, прибавим ещё 3 части — всего 13. Знаменатель тот же 5. Значит 2⅗ = 13/5.',
    wrong: 'Сколько пятых частей в одном целом? А в двух? Не забудь про уже имеющиеся части.',
    rule: 'Смешанное → неправильная: целое × знаменатель + числитель, знаменатель не меняется.',
  },
};

export default function D22_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D01_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'to_improper_machine', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      {/* qora quti mashina: kirish → mashina → chiqish */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '12px 0 6px', flexWrap: 'wrap' }}>
        <Mixed w={2} n={3} d={5} size={26} color="#fe5b1a" />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>→</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '9px 16px', borderRadius: 14, background: '#f8fbff', border: '2px solid #cfe0fb' }}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#64748b', letterSpacing: '.03em' }}>{lang === 'uz' ? 'MASHINA' : 'МАШИНА'}</span>
        </div>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>→</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 56, height: 44, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 60, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>5</div>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '6px 0 2px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      {reveal && <div style={{ display: 'flex', justifyContent: 'center' }}><span className="d22-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e' }}><Mixed w={2} n={3} d={5} size={17} color="#0f766e" /><span>=</span><Frac num="13" den="5" size={18} color="#0f766e" /></span></div>}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
