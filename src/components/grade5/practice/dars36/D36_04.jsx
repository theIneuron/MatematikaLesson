// Dars36 · Amaliyot 04 — Qaysi yuza · 🟡 · tag: tri_decimal
// Asos 5, balandlik 2,4 → 5×2,4=12; 12:2=6. O'tkir uchburchak (ichki balandlik). Tuzoqlar: 12 (:2 unut), 7,4 (qo'shdi).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: teal
const HUE = { d: '#0f766e', l: '#f0fdfa', m: '#99f6e4', deep: '#115e59', fill: '#14b8a6' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d36-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// O'tkir uchburchak: uch uchi asos ustida, balandlik ichkarida.
function AcuteTri({ bText, hText }) {
  const W = 240, H = 160, pad = 30;
  const A = [pad, H - pad], B = [W - pad, H - pad], T = [pad + (W - pad * 2) * 0.42, pad];
  const F = [T[0], H - pad];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${T[0]},${T[1]}`} fill={HUE.fill} fillOpacity="0.35" stroke={HUE.d} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={T[0]} y1={T[1]} x2={F[0]} y2={F[1]} stroke={HUE.deep} strokeWidth="1.8" strokeDasharray="4 3" />
      <path d={`M ${F[0] - 11} ${F[1]} L ${F[0] - 11} ${F[1] - 11} L ${F[0]} ${F[1] - 11}`} fill="none" stroke="#1f2430" strokeWidth="1.4" />
      <text x={(A[0] + B[0]) / 2} y={H - pad + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{bText}</text>
      <text x={F[0] + 8} y={(T[1] + F[1]) / 2 + 4} fontSize="14" fontWeight="800" fill={HUE.deep} stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{hText}</text>
    </svg>
  );
}

const D04_OPTS = ['6', '12', '7,4'];
const D04_CORRECT = 0; // 6; tuzoqlar: 12 (:2 unutildi), 7,4 (qo'shdi)
const D04_T = {
  uz: {
    eyebrow: 'Qaysi yuza', setup: "O'tkir uchburchakning asosi 5 sm, balandligi 2,4 sm.",
    ask: "Qaysi yuza to'g'ri (sm²)? Tanlang:", bText: '5 sm', hText: '2,4 sm',
    correct: "To'g'ri. 5 × 2,4 = 12, keyin 12 : 2 = 6 sm².",
    wrong: "Uchburchak — to'rtburchakning yarmi. To'rtburchak yuzasidan uchburchak yuzasi katta yoki kichik bo'ladi? O'nli balandlik qoidani o'zgartirmaydi.",
    rule: "O'nli balandlik ham xuddi shunday: ko'paytiring, keyin : 2.",
  },
  ru: {
    eyebrow: 'Какая площадь', setup: 'У остроугольного треугольника основание 5 см, высота 2,4 см.',
    ask: 'Какая площадь верна (см²)? Выбери:', bText: '5 sm', hText: '2,4 sm',
    correct: 'Верно. 5 × 2,4 = 12, затем 12 : 2 = 6 см².',
    wrong: 'Треугольник — половина прямоугольника. Площадь треугольника больше или меньше площади прямоугольника? Десятичная высота не меняет правило.',
    rule: 'С десятичной высотой так же: умножь, потом : 2.',
  },
};

export default function D36_04(props) {
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
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick, label: D04_OPTS[pick] }, correctAnswer: { idx: D04_CORRECT }, correct, meta: { tag: 'tri_decimal', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d36-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}><AcuteTri bText={t.bText} hText={t.hText} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        {D04_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = HUE.d; bg = HUE.l; }
          if (checked && on) { const ok = i === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ flex: 1, height: 62, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 24, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', ...S.mono }}>{o}</button>;
        })}
      </div>
      {revealed && (
        <div className="d36-pop" style={{ ...S.mono, textAlign: 'center', marginTop: 12, padding: '10px', borderRadius: 12, fontSize: 15, fontWeight: 800, color: HUE.d, background: HUE.l, border: '1.5px solid ' + HUE.m }}>5 × 2,4 = 12 → 12 : 2 = 6</div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
