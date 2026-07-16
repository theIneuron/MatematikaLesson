// Dars05 · Amaliyot 02 — Qoldiqsizmi · 🟢 · tag: divides_evenly
// To'rt bo'linish. Har biriga "qoldiqsiz / qoldiqli" belgisini qo'yish kerak.
// Faqat bittasi qoldiqsiz. Bir nechta javobli emas — har qatorga toggle.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D02_ROWS = [
  { q: '96 : 6', rem: 0 },
  { q: '85 : 4', rem: 1 },
  { q: '70 : 3', rem: 1 },
  { q: '78 : 5', rem: 3 },
];
const D02_T = {
  uz: {
    eyebrow: "Bo'linish", setup: "Har bir bo'linish qoldiqsiz bajariladimi yoki qoldiq qoladimi — belgilang.",
    yes: 'qoldiqsiz', no: 'qoldiqli',
    correct: "To'g'ri. Faqat 96 : 6 = 16 qoldiqsiz. Qolganlarida qoldiq bor.",
    wrong: "Maslahat: har bir bo'linishni tekshiring — son bo'luvchining karralisimi? Karrali bo'lsa qoldiq qolmaydi.",
  },
  ru: {
    eyebrow: 'Деление', setup: 'Отметьте: каждое деление выполняется без остатка или с остатком.',
    yes: 'без остатка', no: 'с остатком',
    correct: 'Верно. Только 96 : 6 = 16 без остатка. В остальных есть остаток.',
    wrong: 'Подсказка: проверьте каждое — число кратно делителю? Если кратно, остатка нет.',
  },
};
export default function D05_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [marks, setMarks] = useState([null, null, null, null]); // 'yes'|'no'
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.marks) { setMarks(sa.marks); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = marks.every((m) => m != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = marks.every((m, i) => (m === 'yes') === (D02_ROWS[i].rem === 0));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.setup, options: [], studentAnswer: { marks }, correctAnswer: { marks: D02_ROWS.map((r) => r.rem === 0 ? 'yes' : 'no') }, correct, meta: { tag: 'divides_evenly', level: '🟢' } });
  }, [marks, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const seg = (i, kind) => {
    const on = marks[i] === kind;
    const good = kind === 'yes' ? '#0f766e' : '#c2410c';
    let bd = '#d6dae3', bg = '#fff', col = '#64748b';
    if (on) { bd = good; bg = kind === 'yes' ? '#f0fdfa' : '#fff7ed'; col = good; }
    if (checked && on) {
      // qisman to'g'ri = hammasi qizil; faqat to'liq to'g'ri bo'lsa hammasi yashil
      const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b';
    }
    return { flex: 1, padding: '9px 6px', borderRadius: 10, border: '2px solid ' + bd, background: bg, color: col, fontSize: 13, fontWeight: 800, cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 40 };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ margin: '12px 0 4px' }}>
        {D02_ROWS.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 96, ...S.mono, fontSize: 20, fontWeight: 800, color: '#1f2430' }}>{r.q}</div>
            <button type="button" style={seg(i, 'yes')} disabled={locked} onClick={() => setMarks((m) => { const n = m.slice(); n[i] = 'yes'; return n; })}>{t.yes}</button>
            <button type="button" style={seg(i, 'no')} disabled={locked} onClick={() => setMarks((m) => { const n = m.slice(); n[i] = 'no'; return n; })}>{t.no}</button>
          </div>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
