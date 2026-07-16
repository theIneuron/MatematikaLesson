// Dars17 · Amaliyot 01 — Tasmalarni qo'sh · 🟢 · tag: add_bar_fill
// Rasm + bo'sh katak: 2/6 + 3/6 = ?/6 → 5. Ikki tasma sekin natija tasmasiga oqib qo'shiladi.
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// ikki qatorli kasr (qoida bo'yicha yozuv)
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

// bo'lingan tasma: n katak, shaded tasi bo'yalgan; reveal → kataklar birma-bir sekin chiqadi
function Bar({ n, shaded, color = '#ffb488', reveal = false, w = 240, h = 34 }) {
  const cw = w / n;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3"
          fill={i < shaded ? color : '#eef2f7'} stroke="#cbd5e1" strokeWidth="1"
          style={reveal && i < shaded ? { opacity: 0, animation: `d17cell .55s ease ${(0.15 + i * 0.16).toFixed(2)}s forwards` } : undefined} />
      ))}
    </svg>
  );
}

const D01_ANS = 5;
const D01_T = {
  uz: {
    eyebrow: 'Shirinlik', setup: "Bekzod shokolad plitkasini 6 teng bo'lakka sindirdi. Nonushtada 2 bo'lagini, tushlikda yana 3 bo'lagini yedi.",
    ask: 'Bekzod jami qancha plitka yedi? 2/6 + 3/6 = ?/6', label: 'Suratni yozing:',
    correct: "To'g'ri. Suratlarni qo'shdik: 2 + 3 = 5, maxraj 6 o'sha. Demak 2/6 + 3/6 = 5/6.",
    wrong: "Maslahat: maxrajlar bir xil. Qo'shganda qaysi qism o'zgaradi — surat yoki maxraj?",
    rule: "Bir xil maxrajli kasrlarni qo'shish: suratlarni qo'shing, maxrajni o'zgartirma.",
  },
  ru: {
    eyebrow: 'Сладкое', setup: 'Бекзод разломил плитку шоколада на 6 равных частей. На завтрак съел 2 части, на обед ещё 3.',
    ask: 'Сколько всего плитки съел Бекзод? 2/6 + 3/6 = ?/6', label: 'Впиши числитель:',
    correct: 'Верно. Сложили числители: 2 + 3 = 5, знаменатель 6 тот же. Значит 2/6 + 3/6 = 5/6.',
    wrong: 'Подсказка: знаменатели одинаковы. Что меняется при сложении — числитель или знаменатель?',
    rule: 'Сложение дробей с равным знаменателем: сложи числители, знаменатель не меняй.',
  },
};

export default function D17_01(props) {
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
    if (correct) timer.current = setTimeout(() => setReveal(true), 350);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'add_bar_fill', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d17cell { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '10px 0 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Bar n={6} shaded={2} color="#ffb488" />
          <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>+</span>
          <Bar n={6} shaded={3} color="#86efac" />
        </div>
        {reveal && (
          <>
            <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#14b8a6' }}>↓</span>
            <Bar n={6} shaded={5} color="#7dd3fc" reveal />
            <span className="d17-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 17, fontWeight: 800, color: '#0f766e' }}>=<Frac num="5" den="6" size={19} color="#0f766e" /></span>
          </>
        )}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ ...S.mono, fontSize: 16, fontWeight: 700, color: '#64748b' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 56, height: 44, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 60, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>6</div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
