// Dars19 · Amaliyot 08 — Yetmaganini top · 🟢 · tag: add_missing_addend
// Teskari tenglama: 1/4 + ?/8 = 3/8. 1/4 = 2/8, 3/8 gacha yana 1/8 kerak → javob 1.
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
  <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

function Bar({ parts, shaded, color, w = 200, h = 26 }) {
  const cw = w / parts;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="1" y="1" width={Math.max(0, (w * shaded) / parts - 1)} height={h - 2} rx="4" fill={color} />
      {Array.from({ length: parts - 1 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="1" x2={(i + 1) * cw} y2={h - 1} stroke="#fff" strokeWidth="2" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

const D08_ANS = 1; // 1/4 + 1/8 = 3/8, yetmaydigan qo'shiluvchi 1/8
const D08_T = {
  uz: {
    eyebrow: 'Shirinlik', setup: "Retsept bo'yicha tortga jami 3/8 stakan shakar kerak. Umid allaqachon 1/4 stakan solib qo'ydi.",
    ask: 'Umid tenglikni bajarish uchun yana qancha shakar solishi kerak?', label: 'Suratni yozing:', b1: 'Solingan: 1/4', b2: 'Kerak: 3/8',
    correct: "To'g'ri. 1/4 = 2/8, 3/8 gacha yana 1/8 kerak: 2/8 + 1/8 = 3/8.",
    wrong: "Solingan miqdorni ham, kerakli miqdorni ham bir xil bo'lakda o'lchang — orasidagi farq shunda ko'rinadi.",
    rule: "Yetmaydigan qo'shiluvchini topish uchun avval kasrlarni bir xil maxrajga keltiring.",
  },
  ru: {
    eyebrow: 'Сладкое', setup: 'По рецепту в торт нужно всего 3/8 стакана сахара. Умид уже положил 1/4 стакана.',
    ask: 'Сколько сахара Умиду нужно добавить, чтобы равенство выполнилось?', label: 'Впиши числитель:', b1: 'Положено: 1/4', b2: 'Нужно: 3/8',
    correct: 'Верно. 1/4 = 2/8, до 3/8 нужно ещё 1/8: 2/8 + 1/8 = 3/8.',
    wrong: 'Измерь и то, что положено, и то, что нужно, одинаковыми долями — тогда разница станет видна.',
    rule: 'Чтобы найти недостающее слагаемое, сначала приведи дроби к общему знаменателю.',
  },
};

export default function D19_08(props) {
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'add_missing_addend', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d19-pop { animation: d19pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d19pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d19-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0 4px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 74, ...S.mono, fontWeight: 800, color: '#16a34a', fontSize: 12 }}>{renderFr(t.b1)}</span><Bar parts={4} shaded={1} color="#86efac" /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 74, ...S.mono, fontWeight: 800, color: '#2563eb', fontSize: 12 }}>{renderFr(t.b2)}</span><Bar parts={8} shaded={3} color="#93c5fd" /></div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Frac num="1" den="4" size={22} color="#16a34a" />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>+</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 52, height: 42, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 56, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 23, fontWeight: 800, color: '#64748b' }}>8</div>
        </div>
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <Frac num="3" den="8" size={22} color="#2563eb" />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
