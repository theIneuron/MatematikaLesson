// Dars37 · Amaliyot 07 — Xatoni top (yuza↔hajm) · 🔴 · tag: vol_error
// Oybek 3 × 2 × 4 qutini hisoblab, 3 × 2 = 6 ni HAJM deb yozdi (bir qatlamda to'xtadi). To'g'ri = 24.
// Vizual: 4 qatlamli quti, bitta qatlam yoritilgan — "bir qatlam ≠ butun quti".
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#4338ca', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d37-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// 4 qatlamli quti — bitta (asos) qatlami yoritilgan, qolgani "ghost"
function GhostBox({ a, b, c, solidLayer = 0, u = 22, dp = 0.5 }) {
  const list = [];
  for (let k = 0; k < c; k++) for (let j = 0; j < b; j++) for (let i = 0; i < a; i++) list.push({ i, j, k });
  list.sort((p, q) => (q.j - p.j) || (p.k - q.k) || (p.i - q.i));
  const px = (i, j, k) => [i * u + j * u * dp, -(j * u * dp) - k * u];
  const tx = 4, ty = b * u * dp + c * u + 4;
  const W = a * u + b * u * dp + 8, H = c * u + b * u * dp + 8;
  const SOLID = { TOP: '#c7d2fe', FRONT: '#818cf8', RIGHT: '#4f46e5', LN: '#3730a3' };
  const GHOST = { TOP: '#eef2ff', FRONT: '#e0e7ff', RIGHT: '#c7d2fe', LN: '#a5b4fc' };
  const poly = (pts, fill, ln) => <polygon points={pts.map(([x, y]) => `${(x + tx).toFixed(1)},${(y + ty).toFixed(1)}`).join(' ')} fill={fill} stroke={ln} strokeWidth="0.8" strokeLinejoin="round" />;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      {list.map(({ i, j, k }, idx) => {
        const P = k === solidLayer ? SOLID : GHOST;
        const c000 = px(i, j, k), c100 = px(i + 1, j, k), c110 = px(i + 1, j + 1, k);
        const c001 = px(i, j, k + 1), c101 = px(i + 1, j, k + 1), c011 = px(i, j + 1, k + 1), c111 = px(i + 1, j + 1, k + 1);
        return (
          <g key={idx}>
            {poly([c001, c101, c111, c011], P.TOP, P.LN)}
            {poly([c000, c100, c101, c001], P.FRONT, P.LN)}
            {poly([c100, c110, c111, c101], P.RIGHT, P.LN)}
          </g>
        );
      })}
    </svg>
  );
}

const D07_CORRECT = 1; // 2-qadam noto'g'ri
const D07_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Oybek 3 × 2 × 4 sm qutining hajmini hisobladi. Bir qadamda xato qildi.",
    ask: "Qaysi qadam noto'g'ri?",
    steps: ["Asos: 3 × 2 = 6", "Hajm = 6 sm³", "Demak javob 6 sm³"],
    correct: "To'g'ri. 6 — bu faqat bir qatlam (yuza). Hajm uchun × 4 qatlam: 6 × 4 = 24 sm³.",
    wrong: "6 — bu butun hajmmi yoki faqat bitta qatlammi (yuza)? Butun hajm uchun qatlamlar soniga ham ko'paytirish kerak. Qaysi qadamda shu tashlab ketilgan?",
    rule: "Yuza — 2 o'lcham; hajm — 3 o'lcham (× balandlik).",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Ойбек считал объём коробки 3 × 2 × 4 см. В одном шаге он ошибся.',
    ask: 'Какой шаг неверный?',
    steps: ['Основание: 3 × 2 = 6', 'Объём = 6 см³', 'Значит ответ 6 см³'],
    correct: 'Верно. 6 — это лишь один слой (площадь). Для объёма × 4 слоя: 6 × 4 = 24 см³.',
    wrong: '6 — это весь объём или только один слой (площадь)? Для объёма нужно ещё умножить на число слоёв. На каком шаге это пропущено?',
    rule: 'Площадь — 2 измерения; объём — 3 измерения (× высота).',
  },
};

export default function D37_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.steps[picked] }, correctAnswer: { idx: D07_CORRECT }, correct, meta: { tag: 'vol_error', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
        <GhostBox a={3} b={2} c={4} solidLayer={0} />
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 46 }}><span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#94a3b8', minWidth: 20 }}>{i + 1}.</span><span style={S.mono}>{o}</span></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
