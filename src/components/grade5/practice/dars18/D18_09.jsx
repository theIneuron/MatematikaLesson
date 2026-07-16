// Dars18 · Amaliyot 09 — Xatoni tuzat · 🟡 · tag: sub_fix_error
// Karim yozgan: 10/12 − 4/12 = 5/12 (xato). To'g'ri surat 6. O'quvchi to'g'ri suratni kiritadi.
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
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D09_ANS = 6; // 10/12 − 4/12 = 6/12
const D09_T = {
  uz: {
    eyebrow: 'Xatoni tuzat', setup: "Karim daftariga shunday yozdi: 10/12 − 4/12 = 5/12. Ustoz javobda xato borligini aytdi.",
    ask: "To'g'ri suratni katakka yozing: 10/12 − 4/12 = ?/12", label: "To'g'ri surat:",
    correct: "To'g'ri. Maxraj 12 o'sha qoladi, surat esa 10 − 4 = 6. Demak to'g'ri javob 6/12.",
    wrong: "Maslahat: Karimning maxraji joyida. Xato faqat suratda — Karim ayirishda adashgan. Suratlarning ayirmasini qaytadan diqqat bilan tekshiring.",
    rule: "Ayirishda maxraj o'zgarmaydi, suratni to'g'ri ayirish kifoya: 10 − 4 = 6.",
  },
  ru: {
    eyebrow: 'Исправь ошибку', setup: 'Карим записал в тетради: 10/12 − 4/12 = 5/12. Учитель сказал, что в ответе есть ошибка.',
    ask: 'Впиши правильный числитель: 10/12 − 4/12 = ?/12', label: 'Верный числитель:',
    correct: 'Верно. Знаменатель 12 остаётся тем же, а числитель: 10 − 4 = 6. Значит правильный ответ 6/12.',
    wrong: 'Подсказка: знаменатель у Карима верный. Ошибка только в числителе — Карим ошибся при вычитании. Проверь разность числителей ещё раз внимательно.',
    rule: 'При вычитании знаменатель не меняется, достаточно верно вычесть числитель: 10 − 4 = 6.',
  },
};

export default function D18_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'sub_fix_error', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-in { opacity: 0; animation: d18in .7s ease .12s forwards; }
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-in, .d18-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d18-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 6px', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <Frac num="10" den="12" size={24} /><span style={{ ...S.mono, fontSize: 21, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <Frac num="4" den="12" size={24} /><span style={{ ...S.mono, fontSize: 21, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
          <Frac num="5" den="12" size={24} color="#c0392b" />
          <span style={{ position: 'absolute', left: -3, right: -3, top: '32%', height: 2.5, background: '#c0392b', transform: 'rotate(-8deg)' }} />
        </span>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Frac num="10" den="12" size={22} color="#334155" />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <Frac num="4" den="12" size={22} color="#334155" />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 54, height: 44, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 58, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 23, fontWeight: 800, color: '#64748b' }}>12</div>
        </div>
      </div>
      {checked && fb?.correct && (
        <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 0' }}>
          <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <Frac num="10" den="12" size={18} color="#1a7f43" /><span style={{ ...S.mono, fontWeight: 800, color: '#1a7f43' }}>−</span>
          <Frac num="4" den="12" size={18} color="#1a7f43" /><span style={{ ...S.mono, fontWeight: 800, color: '#1a7f43' }}>=</span>
          <Frac num="6" den="12" size={18} color="#1a7f43" />
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
