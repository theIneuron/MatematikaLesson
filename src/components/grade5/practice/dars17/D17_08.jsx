// Dars17 · Amaliyot 08 — Bo'sh katak · 🟢 · tag: add_fill
// Sodda: 1/4 + 2/4 = ?/4 → 3. Yengil kirish animatsiyasi.
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D08_ANS = 3;
const D08_T = {
  uz: {
    eyebrow: 'Sharbat', setup: "Nilufar bir shisha sharbatni 4 teng stakanga quydi. Ertalab 1 stakan, kunduzi yana 2 stakan ichdi.",
    ask: 'Nilufar jami qancha sharbat ichdi? 1/4 + 2/4 = ?/4', label: 'Suratni yozing:',
    correct: "To'g'ri. 1 + 2 = 3, maxraj 4 o'sha: 1/4 + 2/4 = 3/4.",
    wrong: "Maslahat: maxraj bir xil bo'lsa, qo'shishda u o'zgaradimi yoki o'sha qoladimi?",
    rule: "Suratlarni qo'shing, maxrajni o'zgartirma.",
  },
  ru: {
    eyebrow: 'Сок', setup: 'Нилуфар разлила бутылку сока на 4 равных стакана. Утром выпила 1 стакан, днём ещё 2.',
    ask: 'Сколько всего сока выпила Нилуфар? 1/4 + 2/4 = ?/4', label: 'Впиши числитель:',
    correct: 'Верно. 1 + 2 = 3, знаменатель 4 тот же: 1/4 + 2/4 = 3/4.',
    wrong: 'Подсказка: при равном знаменателе он меняется или остаётся тем же?',
    rule: 'Складывай числители, знаменатель не меняй.',
  },
};

export default function D17_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'add_fill', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-in { opacity: 0; animation: d17in .6s ease .1s forwards; }
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-in, .d17-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d17-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '16px 0 10px' }}>
        <Frac num="1" den="4" size={34} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>+</span>
        <Frac num="2" den="4" size={34} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 52, height: 42, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 56, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>4</div>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 4px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
