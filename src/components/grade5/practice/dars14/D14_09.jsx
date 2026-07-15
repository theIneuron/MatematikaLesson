// Dars14 · Amaliyot 09 — Umumiy ulush + son o'qi · 🔴 · common_units_axis (bo'sh katak + o'q)
// 3/4 va 5/6 ni 12 ulushga keltiring: 3/4=9/12, 5/6=10/12. Bola suratlarni yozadi, keyin o'qda ko'rsatiladi.
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
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

const D09_A = 9, D09_B = 10; // 12 ulushda
const D09_T = {
  uz: {
    eyebrow: 'Umumiy ulush', setup: "Sabina 3/4 va 5/6 ni solishtirmoqchi.",
    ask: 'Ikkalasini 12 ta ulushga keltiring. Suratlarni yozing:',
    correct: "To'g'ri. 3/4 = 9/12, 5/6 = 10/12. Son o'qida 10/12 o'ngroqda — demak 5/6 katta.",
    wrong: "Maslahat: butun 12 teng ulushga bo'linsa, 3/4 nechta ulushni, 5/6 nechta ulushni egallaydi? Har bir ulushni sanab ko'ring.",
    rule: "Bir xil ulushga keltirib, son o'qida joyini yoki suratlarni solishtiring.",
  },
  ru: {
    eyebrow: 'Общие доли', setup: 'Сабина хочет сравнить 3/4 и 5/6.',
    ask: 'Приведите обе к 12 долям. Впишите числители:',
    correct: 'Верно. 3/4 = 9/12, 5/6 = 10/12. На оси 10/12 правее — значит 5/6 больше.',
    wrong: 'Подсказка: если целое разделить на 12 равных долей, сколько долей займёт 3/4, а сколько 5/6? Сосчитай доли.',
    rule: 'Приведи к одинаковым долям и сравни по оси или по числителям.',
  },
};
export default function D14_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showAxis, setShowAxis] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShowAxis(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D09_A && parseInt(b, 10) === D09_B;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShowAxis(true), 700);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: { a: 9, b: 10 }, correct, meta: { tag: 'common_units_axis', level: '🔴' } });
  }, [a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = (v, ok) => checked ? (v === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cell = (val, set, ok) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 54, height: 40, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd(parseInt(val, 10), ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      <div style={{ width: 60, height: 2, background: '#1f2430' }} />
      <div style={{ ...S.mono, fontSize: 19, fontWeight: 800, color: '#64748b' }}>12</div>
    </div>
  );
  // son o'qi 0..1, 12 ulush, markerlar 9/12 va 10/12
  const W = 100 / 12;
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '12px 0 8px' }}>
        <Frac num="3" den="4" size={24} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>=</span>
        {cell(a, setA, D09_A)}
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#cbd5e1', margin: '0 2px' }}>|</span>
        <Frac num="5" den="6" size={24} color="#14b8a6" />
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>=</span>
        {cell(b, setB, D09_B)}
      </div>
      {/* son o'qi to'g'ri javobdan keyin */}
      <div style={{ maxHeight: showAxis ? 90 : 0, opacity: showAxis ? 1 : 0, overflow: 'hidden', transition: 'max-height .7s ease, opacity .6s ease' }}>
        <div style={{ position: 'relative', height: 66, margin: '10px 10px 0' }}>
          <div style={{ position: 'absolute', left: '3%', right: '3%', top: 34, height: 3, background: '#bae6fd', borderRadius: 2 }} />
          {[0, 12].map((u) => <div key={u} style={{ position: 'absolute', left: `calc(3% + ${u * W * 0.94}%)`, top: 26, transform: 'translateX(-50%)', textAlign: 'center' }}><div style={{ width: 3, height: 16, background: '#64748b', margin: '0 auto' }} /><div style={{ ...S.mono, fontSize: 11, fontWeight: 800, color: '#64748b', marginTop: 3 }}>{u === 0 ? '0' : '1'}</div></div>)}
          {[{ u: 9, c: '#2563eb', l: '3/4' }, { u: 10, c: '#14b8a6', l: '5/6' }].map((m) => (
            <div key={m.l} style={{ position: 'absolute', left: `calc(3% + ${m.u * W * 0.94}%)`, top: 6, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ ...S.mono, fontSize: 11, fontWeight: 800, color: m.c, marginBottom: 2 }}>{m.l}</div>
              <div style={{ width: 15, height: 15, borderRadius: 999, background: m.c, margin: '0 auto', border: '2.5px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
          ))}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
