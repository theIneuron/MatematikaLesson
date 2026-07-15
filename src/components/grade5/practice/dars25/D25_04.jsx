// Dars25 · Amaliyot 04 — Butungacha yaxlitla · 🟢 · tag: round_whole
// 3,6 ni eng yaqin butunga: o'ndan 6 ≥ 5 → 4. Son o'qida 3,6 ko'proq 4 ga yaqin.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D04_OPTS = ['3', '4'];
const D04_CORRECT = 1; // 4
const D04_T = {
  uz: {
    eyebrow: 'Yaxlitla', setup: "Madina 3,6 metr arqonni o'lchadi. Uni eng yaqin butun metrga yaxlitlamoqchi.",
    ask: '3,6 eng yaqin butun songa nechaga yaxlitlanadi?',
    correct: "To'g'ri. 3,6 son o'qida 4 ga yaqinroq. o'ndan 6 ≥ 5, shuning uchun butun bittaga oshadi: 3,6 ≈ 4.",
    wrong: "Son o'qida nuqta qayerda turibdi? U qaysi butun songa yaqinroq?",
    rule: "o'ndan ≥ 5 → yuqoriga yaxlit. 3,6 ≈ 4.",
  },
  ru: {
    eyebrow: 'Округли', setup: 'Мадина измерила верёвку 3,6 метра. Хочет округлить до ближайшего целого метра.',
    ask: 'До какого целого округляется 3,6?',
    correct: 'Верно. 3,6 на оси ближе к 4. Десятые 6 ≥ 5, поэтому целое увеличивается на один: 3,6 ≈ 4.',
    wrong: 'Где на оси стоит точка? К какому целому она ближе?',
    rule: 'Десятые ≥ 5 → вверх. 3,6 ≈ 4.',
  },
};

export default function D25_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D04_CORRECT }, correct, meta: { tag: 'round_whole', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 320, H = 96, x0 = 30, x1 = W - 30, y = 50;
  const xAt = (val) => x0 + (x1 - x0) * ((val - 3) / 1);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', height: 'auto' }}>
          <line x1={x0} y1={y} x2={x1} y2={y} stroke="#334155" strokeWidth="2.5" />
          {Array.from({ length: 11 }).map((_, i) => { const big = i === 0 || i === 5 || i === 10; return <line key={i} x1={xAt(3 + i / 10)} y1={y - (big ? 10 : 6)} x2={xAt(3 + i / 10)} y2={y + (big ? 10 : 6)} stroke="#334155" strokeWidth={big ? 2 : 1.2} />; })}
          <text x={xAt(3)} y={y + 28} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="800" fill="#475569">3</text>
          <text x={xAt(3.5)} y={y + 28} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700" fill="#94a3b8">3,5</text>
          <text x={xAt(4)} y={y + 28} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="800" fill="#475569">4</text>
          <circle cx={xAt(3.6)} cy={y} r="7" fill="#f59e0b" />
          <text x={xAt(3.6)} y={y - 16} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fontWeight="800" fill="#d97706">3,6</text>
        </svg>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {D04_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ width: 90, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 28, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
