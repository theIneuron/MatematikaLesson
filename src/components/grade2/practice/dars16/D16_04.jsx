// Dars 16 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // sahna (animatsiya) — to'q koinot
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  green: '#6EF29B', gold: '#FFC23C', sig: '#5BD6F2',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d16-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = C.paper, bd = C.line, col = '#374151';
  if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
  if (show) { const ok = i === correctIdx; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '14px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 66,
  };
}

const FX_CSS = `.d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d16-star { opacity: .35; animation: d16tw 3.2s ease-in-out infinite; }
        @keyframes d16tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d16-sprout { animation: d16sprout .5s cubic-bezier(.34,1.56,.64,1) both, d16sway 3.6s ease-in-out infinite; }
        @keyframes d16sprout { 0% { opacity: 0; transform: rotate(45deg) scale(.2); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d16sway { 0%, 100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(-1.5px); } }
        .d16-float { animation: d16float 3s ease-in-out infinite; }
        @keyframes d16float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d16-cell { animation: d16cell .4s ease both; }
        @keyframes d16cell { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        .d16-pulse { animation: d16pulse 1.5s ease-in-out infinite; }
        @keyframes d16pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D04_SEQ = [7, 14, null, 28, 35], D04_CORRECT = 1;
const D04_T = {
  uz: {
    eyebrow: '×7 · skip-sanash', setup: "Bit 7 tadan sanayapti, lekin bir son tushib qolgan.",
    ask: 'Bo‘sh katakka qaysi son tushadi?',
    opts: ['20', '21', '22', '24'],
    correct: "To'g'ri. 14 dan keyin yana 7: 14 + 7 = 21.",
    wrong: "Maslahat: har qadamda 7 qo'shiladi. 14 + 7 = ?",
    rule: "Skip-sanashda har qadam bir xil: ×7 da +7, +7, +7...",
  },
  ru: {
    eyebrow: '×7 · счёт', setup: 'Бит считает по 7, но одно число пропущено.',
    ask: 'Какое число встанет в пустую клетку?',
    opts: ['20', '21', '22', '24'],
    correct: 'Верно. После 14 ещё 7: 14 + 7 = 21.',
    wrong: 'Подсказка: на каждом шаге прибавляем 7. 14 + 7 = ?',
    rule: 'В счёте шаг одинаковый: для ×7 это +7, +7, +7...',
  },
};
function D16_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 1, label: '21' }, correct, meta: { tag: 'skip7_fill', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const chosen = picked != null ? t.opts[picked] : null;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {D04_SEQ.map((n, i) => {
            const blank = n === null;
            const bd = blank ? (checked ? (fb?.correct ? C.green : '#FF9A82') : C.gold) : C.stageBd;
            return (
              <div key={i} className={blank ? (checked ? undefined : 'd16-pulse') : 'd16-cell'} style={{ width: 56, height: 56, borderRadius: 12, border: '2px ' + (blank ? 'dashed' : 'solid') + ' ' + bd, background: C.stile, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 22, fontWeight: 800, color: blank ? C.gold : C.sink, animationDelay: (i * 0.08) + 's' }}>{blank ? (chosen || '?') : n}</div>
            );
          })}
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, D04_CORRECT, checked, isReview, { half: true, center: true, mono: true, fs: 22 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D16_04(props) {
  return (<><style>{FX_CSS}</style><D16_04Impl {...props} /></>);
}
