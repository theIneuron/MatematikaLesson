// Dars36 · Amaliyot 09 — To'g'ri yuza · 🔴 · tag: tri_check
// Asos 8, balandlik 5. 8×5=40, :2=20. Tuzoqlar: 40 (:2 unut), 13 (qo'shdi), 26. Taqqoslash ustunlari reveal.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: cyan
const HUE = { d: '#0e7490', l: '#ecfeff', m: '#a5f3fc', deep: '#155e75', fill: '#06b6d4' };
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
// Javobdan OLDIN: to'g'ri uchburchak, asos/balandlik labellari.
function TriFig({ base = 8, height = 5, bText, hText }) {
  const scale = Math.min(180 / base, 104 / height);
  const w = base * scale, h = height * scale;
  const pad = 30, x0 = pad, y0 = pad, W = w + pad * 2 + 16, H = h + pad * 2;
  const A = [x0, y0 + h], B = [x0 + w, y0 + h], C = [x0 + w, y0];
  const m = 12;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={HUE.fill} fillOpacity="0.35" stroke={HUE.d} strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={C[0]} y1={A[1]} x2={C[0]} y2={C[1]} stroke={HUE.deep} strokeWidth="1.6" strokeDasharray="3 3" />
      <path d={`M ${B[0] - m} ${B[1]} L ${B[0] - m} ${B[1] - m} L ${B[0]} ${B[1] - m}`} fill="none" stroke="#1f2430" strokeWidth="1.5" />
      <text x={x0 + w / 2} y={y0 + h + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{bText}</text>
      <text x={x0 + w + 8} y={y0 + h / 2 + 4} fontSize="14" fontWeight="800" fill="#374151" stroke="#fff" strokeWidth="3.5" paintOrder="stroke" strokeLinejoin="round" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{hText}</text>
    </svg>
  );
}

const D09_OPTS = [20, 40, 13, 26];
const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: "To'g'ri yuza", setup: "Uchburchakning asosi 8 sm, balandligi 5 sm. To'rt o'quvchi to'rt xil javob berdi.",
    ask: "Qaysi javob to'g'ri (sm²)?", bText: '8 sm', hText: '5 sm',
    correct: "To'g'ri. 8 × 5 = 40, keyin : 2 = 20. 40 — bu 2 ga bo'lishni unutgan xato.",
    wrong: "Uchburchak — to'rtburchakning yarmi. Javoblardan biri — butun to'rtburchak yuzasi. Uchburchak yuzasi undan katta yoki kichik bo'ladi?",
    rule: "Ko'paytiring, keyin albatta : 2.",
  },
  ru: {
    eyebrow: 'Верная площадь', setup: 'Основание треугольника 8 см, высота 5 см. Четыре ученика дали четыре ответа.',
    ask: 'Какой ответ верный (см²)?', bText: '8 sm', hText: '5 sm',
    correct: 'Верно. 8 × 5 = 40, затем : 2 = 20. 40 — это ошибка без деления на 2.',
    wrong: 'Треугольник — половина прямоугольника. Один из ответов — площадь всего прямоугольника. Площадь треугольника больше или меньше?',
    rule: 'Умножь, потом обязательно : 2.',
  },
};

export default function D36_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D09_OPTS.map((v, i) => ({ id: String(i), label: String(v) })), studentAnswer: { idx: pick, value: D09_OPTS[pick] }, correctAnswer: { idx: D09_CORRECT, value: 20 }, correct, meta: { tag: 'tri_check', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const maxV = 40;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d36-bar { transform-origin: bottom; animation: d36grow .55s ease both; }
        @keyframes d36grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { .d36-pop,.d36-bar { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}><TriFig bText={t.bText} hText={t.hText} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {D09_OPTS.map((v, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = HUE.d; bg = HUE.l; }
          if (checked && on) { const ok = i === D09_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ height: 62, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 24, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', ...S.mono }}>{v}</button>;
        })}
      </div>
      {revealed && (
        <div className="d36-pop" style={{ marginTop: 12, padding: '14px 12px 10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, height: 96 }}>
            {D09_OPTS.map((v, i) => {
              const ok = i === D09_CORRECT;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: ok ? '#1a7f43' : '#9ca3af' }}>{v}</span>
                  <div className="d36-bar" style={{ width: 30, height: Math.max(6, (v / maxV) * 76), borderRadius: '4px 4px 0 0', background: ok ? '#1a7f43' : '#cbd5e1' }} />
                </div>
              );
            })}
          </div>
          <div style={{ ...S.mono, textAlign: 'center', marginTop: 6, fontSize: 13.5, fontWeight: 800, color: HUE.d }}>8 × 5 = 40 → 40 : 2 = 20</div>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
