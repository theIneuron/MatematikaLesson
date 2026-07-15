// Dars30 · Amaliyot 06 — 40% ni bo'yang · 🟡 · tag: pct_shade_construct
// Yuz katakda qatorlarni bosib 40 katak bo'yaladi. To'g'ri: 4 qator = 40 katak = 40%.
// Interaktiv 10×10 grid (grid-2). Eyebrow pill: red. Kontrakt: onReady/registerCheck/onSubmit. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#dc2626', l: '#fef2f2', m: '#fecaca', fill: '#f87171' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.d, background: C.l, border: '1px solid ' + C.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_ANS = 40;
const D06_T = {
  uz: {
    eyebrow: "Bo'yang", setup: "Aziza yuz katakli kvadratda 40% ni ko'rsatmoqchi. Qatorni bossangiz — o'sha qatordagi kataklar bo'yaladi.",
    ask: "40% ni bo'yang (qatorlarni bosing):", now: "Hozir bo'yalgan:", reset: 'Tozalash',
    correct: "To'g'ri. 4 qator = 40 katak = 40%.",
    wrong: "Grid 10 ta qatordan iborat — bitta qator necha foizni bildiradi? Kerakli foiz uchun nechta qator bo'yash kerak?",
    rule: "Bir qator (10 katak) = 10%.",
  },
  ru: {
    eyebrow: 'Закрась', setup: 'Азиза хочет показать 40% в квадрате из ста клеток. Нажмёшь на ряд — закрасятся его клетки.',
    ask: 'Закрась 40% (нажимай ряды):', now: 'Сейчас закрашено:', reset: 'Очистить',
    correct: 'Верно. 4 ряда = 40 клеток = 40%.',
    wrong: 'Сетка из 10 рядов — сколько процентов в одном ряду? Сколько рядов закрасить для нужного процента?',
    rule: 'Один ряд (10 клеток) = 10%.',
  },
};

export default function D30_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [rows, setRows] = useState([]); // bo'yalgan qatorlar (0..9)
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.rows) { setRows(sa.rows); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const count = rows.length * 10;
  useEffect(() => { onReady?.(count > 0 && !checked); }, [count, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (r) => { if (locked) return; setRows((s) => s.includes(r) ? s.filter((x) => x !== r) : [...s, r]); };
  const check = useCallback(() => {
    const correct = count === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { rows: [...rows].sort(), count }, correctAnswer: { count: D06_ANS }, correct, meta: { tag: 'pct_shade_construct', level: '🟡' } });
  }, [rows, count, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const chipCol = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.d;
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d30-cell6 { transition: background .5s ease; }
        @media (prefers-reduced-motion: reduce) { .d30-pop { animation: none !important; } .d30-cell6 { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2, width: 240, maxWidth: '100%', padding: 6, background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const r = Math.floor(i / 10);
            const on = rows.includes(r);
            return <button key={i} type="button" disabled={locked} onClick={() => toggle(r)} className="d30-cell6" style={{ aspectRatio: '1 / 1', borderRadius: 2, background: on ? C.d : '#fff', border: '1px solid #e2e8f0', padding: 0, cursor: locked ? 'default' : 'pointer' }} />;
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0' }}>
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 700 }}>{t.now}</span>
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: chipCol }}>{count}%</span>
      </div>
      {!checked && rows.length > 0 && !isReview && (
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={() => setRows([])} style={{ padding: '6px 14px', borderRadius: 999, border: '1.5px solid #d6dae3', background: '#fff', color: '#64748b', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t.reset}</button>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
