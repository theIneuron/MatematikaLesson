// Dars31 · Amaliyot 09 — Tasmada belgila (marker) · 🔴 · tag: of_arbitrary_mark
// "400 ning 15% ini tasmada belgilang." → 60. 1% = 400 : 100 = 4, 15% = 4 × 15 = 60.
// Imzo-mexanika saqlangan: 0..400 tasma, marker qo'yilganda qism to'ladi. Rang: fuchsia pill.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#a21caf', light: '#fdf4ff', mid: '#f5d0fe', fill: '#d946ef', faint: '#fdf4ff', soft: '#f0abfc', muted: '#9a5aa0' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_TOTAL = 400, D09_STEP = 20, D09_ANS = 60; // 15% dan 400 = 60; qadam 20 (5%)
const D09_T = {
  uz: {
    eyebrow: 'Foizni belgila', setup: "Fermada 400 tup pomidor bor. Ularning 15% i pishib qoldi.",
    ask: "400 ning 15% ini tasmada belgilang — markerni to'g'ri joyga qo'ying:",
    hint: 'tasmani bosing', live: 'belgilangan miqdor',
    correct: "To'g'ri. 400 : 100 = 4, 4 × 15 = 60.",
    wrong: "Sonning 1% i qancha? Undan kerakli foizga o'tib, o'sha joyni belgilang.",
    rule: "1% = A : 100, keyin foizga ko'paytiring.",
  },
  ru: {
    eyebrow: 'Отметь процент', setup: 'На ферме 400 кустов помидоров. Из них 15% созрели.',
    ask: 'Отметь на полосе 15% от 400 — поставь маркер в нужное место:',
    hint: 'нажми на полосу', live: 'отмеченное количество',
    correct: 'Верно. 400 : 100 = 4, 4 × 15 = 60.',
    wrong: 'Сколько 1% от числа? Перейди от него к нужному проценту и отметь это место.',
    rule: '1% = A : 100, затем умножь на процент.',
  },
};

export default function D31_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(sa.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val != null && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = val === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: val }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'of_arbitrary_mark', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);

  const w = 300, h = 46, x0 = 3, x1 = w - 3, span = x1 - x0;
  const locked = isReview || checked;
  const svgRef = useRef(null);
  const xOf = (v) => x0 + span * v / D09_TOTAL;
  const place = (clientX) => {
    if (locked) return;
    const el = svgRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const rel = (clientX - r.left) / r.width * w;       // viewBox koordinatasi
    let v = (rel - x0) / span * D09_TOTAL;
    v = Math.round(v / D09_STEP) * D09_STEP;
    v = Math.max(0, Math.min(D09_TOTAL, v));
    setVal(v);
  };
  const markX = val != null ? xOf(val) : null;
  const markCol = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.fill;

  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d31-fill { transition: width .5s ease, x .5s ease; }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } .d31-fill { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>

      <div style={{ margin: '10px auto 4px', maxWidth: w }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...S.mono, fontSize: 12.5, fontWeight: 700, color: C.muted, marginBottom: 3 }}>
          <span>0</span><span>200</span><span>400</span>
        </div>
        <svg ref={svgRef} width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%', cursor: locked ? 'default' : 'pointer', touchAction: 'none' }}
          onClick={(e) => place(e.clientX)}>
          <rect x="1" y="12" width={w - 2} height={h - 24} rx="6" fill={C.faint} stroke={C.soft} strokeWidth="1.5" />
          {markX != null && <rect className="d31-fill" x={x0} y="14" width={Math.max(0, markX - x0)} height={h - 28} rx="5" fill={markCol} opacity="0.9" />}
          {[0, 1, 2, 3, 4, 5].map((i) => { const gx = x0 + span * i / 5; return <line key={i} x1={gx} y1="12" x2={gx} y2={h - 12} stroke={C.mid} strokeWidth="1" />; })}
          {markX != null && (
            <g className="d31-fill" style={{ transition: 'none' }}>
              <line x1={markX} y1="4" x2={markX} y2={h - 4} stroke={markCol} strokeWidth="2.5" strokeDasharray="4 3" />
              <circle cx={markX} cy={h / 2} r="8" fill="#fff" stroke={markCol} strokeWidth="3" />
            </g>
          )}
        </svg>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: C.muted, marginTop: 4 }}>{val == null ? t.hint : ''}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.muted }}>{t.live}</span>
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: markCol }}>{val == null ? '—' : val}</span>
      </div>

      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
