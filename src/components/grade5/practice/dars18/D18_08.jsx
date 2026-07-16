// Dars18 · Amaliyot 08 — Kim haq? · 🟢 · tag: sub_who_right
// 6/8 − 2/8 = 4/8 (Nodira, to'g'ri). Aziza maxrajni ham ayirgan → 4/6 (xato). Rasm yordam beradi.
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
const Frac = ({ num, den, size = 18, color = '#1f2430' }) => (
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

function Bar({ w = 240, h = 34 }) {
  const n = 8, cw = w / n, shaded = 6, remove = new Set([4, 5]);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={'b' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      ))}
      {Array.from({ length: shaded }).map((_, i) => (
        <rect key={'s' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill={remove.has(i) ? '#fde0e0' : '#ffb488'} stroke={remove.has(i) ? '#f2b8b8' : '#ff8a52'} strokeWidth="1" strokeDasharray={remove.has(i) ? '3 2' : undefined} />
      ))}
    </svg>
  );
}

const D08_CORRECT = 0; // Nodira: 4/8
const D08_CARDS = [
  { name: { uz: 'Nodira', ru: 'Нодира' }, l: '6/8', r: '2/8', res: '4/8' },
  { name: { uz: 'Aziza', ru: 'Азиза' }, l: '6/8', r: '2/8', res: '4/6' },
];
const D08_T = {
  uz: {
    eyebrow: 'Kim haq?', setup: "Nodira va Aziza 6/8 − 2/8 ni hisoblashdi, lekin javoblari har xil chiqdi. Rasmda 6 ta bo'lakdan 2 tasi olib tashlangan.",
    ask: "Kim to'g'ri hisoblagan?",
    correct: "To'g'ri. Nodira haq: 6 − 2 = 4, maxraj 8 o'sha, ya'ni 4/8. Aziza maxrajni ham ayiribdi (8 − 2 = 6) — bu xato.",
    wrong: "Maslahat: ayirishda maxraj bilan nima bo'ladi? Rasmda maxraj (jami bo'laklar) o'zgardimi?",
    rule: "Ayirishda maxraj o'zgarmaydi: 6/8 − 2/8 = 4/8, 4/6 emas.",
  },
  ru: {
    eyebrow: 'Кто прав?', setup: 'Нодира и Азиза посчитали 6/8 − 2/8, но ответы вышли разные. На рисунке из 6 частей убрали 2.',
    ask: 'Кто посчитал верно?',
    correct: 'Верно. Права Нодира: 6 − 2 = 4, знаменатель 8 тот же, то есть 4/8. Азиза вычла и знаменатель (8 − 2 = 6) — это ошибка.',
    wrong: 'Подсказка: что происходит со знаменателем при вычитании? На рисунке знаменатель (всего частей) изменился?',
    rule: 'При вычитании знаменатель не меняется: 6/8 − 2/8 = 4/8, а не 4/6.',
  },
};

export default function D18_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_CARDS.map((c, i) => ({ id: String(i), label: c.name.uz + ': ' + c.l + '-' + c.r + '=' + c.res })), studentAnswer: { idx: picked }, correctAnswer: { idx: D08_CORRECT }, correct, meta: { tag: 'sub_who_right', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}><Bar /></div>
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D08_CARDS.map((c, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D08_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 44%', minWidth: 150, padding: '13px 12px', borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer' }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{c.name[lang] || c.name.uz}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Frac num="6" den="8" size={16} color={col} /><span style={{ ...S.mono, fontWeight: 800 }}>−</span><Frac num="2" den="8" size={16} color={col} /><span style={{ ...S.mono, fontWeight: 800 }}>=</span>{(() => { const [n, d] = c.res.split('/'); return <Frac num={n} den={d} size={16} color={col} />; })()}
            </span>
          </button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
