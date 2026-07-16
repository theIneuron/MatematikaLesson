// Dars14 · Amaliyot 06 — Pie solishtirish · 🟡 · pie_compare (belgi + vizual)
// 2/3 va 3/4. Pie yonma-yon. Belgi <.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
function SignPicker({ value, onPick, disabled, correct, checked, tint }) {
  const signs = ['<', '=', '>'];
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {signs.map((s) => {
        const on = value === s;
        let bd = tint ? '#ffd6bd' : '#d6dae3', bg = tint ? '#fff4ee' : '#fff', col = tint ? '#fe5b1a' : '#374151';
        if (on) { bd = '#fe5b1a'; bg = '#ffe7d8'; col = '#b83d0e'; }
        if (checked && on) { const ok = s === correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
        return <button key={s} type="button" disabled={disabled} onClick={() => onPick(s)} style={{ width: 64, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 30, fontWeight: 800, cursor: disabled ? 'default' : 'pointer' }}>{s}</button>;
      })}
    </div>
  );
}
const Pie6 = ({ den, shaded, size = 110, fill, light }) => {
  const R = size / 2, C = R;
  const seg = [];
  for (let k = 0; k < den; k++) {
    const a0 = (k / den) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((k + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x0 = C + R * Math.cos(a0), y0 = C + R * Math.sin(a0);
    const x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    seg.push({ d: `M${C},${C} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`, on: k < shaded });
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{seg.map((s, k) => <path key={k} d={s.d} fill={s.on ? fill : light} stroke="#fff" strokeWidth="2.5" />)}</svg>;
};

const D06_CORRECT = '<';
const D06_T = {
  uz: {
    eyebrow: 'Solishtiring', setup: "Ikki bir xil doira: biri 2/3 ga, biri 3/4 ga bo'yalgan.",
    ask: "2/3 va 3/4 orasiga qaysi belgi to'g'ri keladi?",
    correct: "To'g'ri. 12 ulushga keltirsak: 2/3=8/12, 3/4=9/12. Demak 2/3 < 3/4.",
    wrong: "Maslahat: doiralarga qara — qaysi birida ko'proq bo'yalgan? Yoki ikkalasini bir xil ulushga keltirib solishtiring.",
    rule: "Vizual yoki bir xil ulushga keltirib solishtiring. 2/3 < 3/4.",
  },
  ru: {
    eyebrow: 'Сравните', setup: 'Два одинаковых круга: один закрашен на 2/3, другой на 3/4.',
    ask: 'Какой знак верен между 2/3 и 3/4?',
    correct: 'Верно. К 12 долям: 2/3=8/12, 3/4=9/12. Значит 2/3 < 3/4.',
    wrong: 'Подсказка: посмотри на круги — где закрашено больше? Или приведи обе к одинаковым долям и сравни.',
    rule: 'Сравни визуально или приведи к одинаковым долям. 2/3 < 3/4.',
  },
};
export default function D14_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [sign, setSign] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sign) { setSign(sa.sign); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sign != null && !checked); }, [sign, checked, onReady]);
  const check = useCallback(() => {
    const correct = sign === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sign }, correctAnswer: { sign: '<' }, correct, meta: { tag: 'pie_compare', level: '🟡' } });
  }, [sign, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '10px 0' }}>
        <div style={{ textAlign: 'center' }}><Pie6 den={3} shaded={2} fill="#ffb488" light="#fff4ee" /><div style={{ ...S.mono, fontWeight: 800, color: '#fe5b1a', marginTop: 4 }}>2/3</div></div>
        <div style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: sign ? '#1f2430' : '#cbd5e1' }}>{sign || '?'}</div>
        <div style={{ textAlign: 'center' }}><Pie6 den={4} shaded={3} fill="#fca5a5" light="#fef2f2" /><div style={{ ...S.mono, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>3/4</div></div>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <SignPicker value={sign} onPick={(s) => !checked && !isReview && setSign(s)} disabled={isReview || checked} correct={D06_CORRECT} checked={checked} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
