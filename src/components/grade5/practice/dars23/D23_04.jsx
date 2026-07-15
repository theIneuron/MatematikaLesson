// Dars23 · Amaliyot 04 — Sodda ayirish · 🟢 · tag: sub_mixed_simple
// 5 5/6 − 2 1/6 = 3 4/6 (zaymsiz). Butunlar: 5−2=3, kasrlar: 5/6−1/6=4/6.
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
  <div className="d23-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
const Mixed = ({ w, n, d, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 6, color }}>{w}</span><Frac num={n} den={d} size={size - 2} color={color} />
  </span>
);

const D04 = { w: 3, n: 4 }; // 3 4/6
const D04_T = {
  uz: {
    eyebrow: 'Masofa', setup: "Aziza dushanba kuni 5 5/6 km, seshanba kuni 2 1/6 km yugurdi. Dushanba kuni seshanbaga qaraganda qancha ko'p yugurgan?",
    ask: 'Farqni toping: 5 5/6 − 2 1/6 = ?', l1: 'Butun:', l2: 'Kasr:',
    correct: "To'g'ri. Butunlar: 5 − 2 = 3. Kasrlar: 5/6 − 1/6 = 4/6. Demak 5 5/6 − 2 1/6 = 3 4/6.",
    wrong: "Butun qism va kasr qismini alohida ko'rib chiqing, so'ng qayta urinib ko'ring.",
    rule: "Aralash sonlarni ayirganda butunni butundan, kasrni kasrdan ayiramiz (maxraj o'zgarmaydi).",
  },
  ru: {
    eyebrow: 'Дистанция', setup: 'Азиза в понедельник пробежала 5 5/6 км, во вторник 2 1/6 км. На сколько больше она пробежала в понедельник, чем во вторник?',
    ask: 'Найди разность: 5 5/6 − 2 1/6 = ?', l1: 'Целое:', l2: 'Дробь:',
    correct: 'Верно. Целые: 5 − 2 = 3. Дроби: 5/6 − 1/6 = 4/6. Значит 5 5/6 − 2 1/6 = 3 4/6.',
    wrong: 'Рассмотри целую и дробную части по отдельности и попробуй снова.',
    rule: 'Вычитание смешанных: вычти целые, вычти дроби (знаменатель не меняется).',
  },
};

export default function D23_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.n != null) setN(String(s.n)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(n);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D04.w && parseInt(n, 10) === D04.n;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), n: parseInt(n, 10) }, correctAnswer: D04, correct, meta: { tag: 'sub_mixed_simple', level: '🟢' } });
  }, [w, n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 48, height: 42, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-in { opacity: 0; animation: d23in .6s ease .1s forwards; }
        @keyframes d23in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-in { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d23-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '16px 0 10px', flexWrap: 'wrap' }}>
        <Mixed w={5} n={5} d={6} size={24} color="#2563eb" /><span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>−</span><Mixed w={2} n={1} d={6} size={24} color="#2563eb" /><span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{box(w, setW, D04.w)}<div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>{box(n, setN, D04.n)}<div style={{ width: 44, height: 2.5, background: '#1f2430' }} /><div style={{ ...S.mono, fontSize: 21, fontWeight: 800, color: '#64748b' }}>6</div></div></div>
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>{t.l1} · {t.l2}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
