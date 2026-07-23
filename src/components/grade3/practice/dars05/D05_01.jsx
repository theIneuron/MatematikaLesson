// Dars 5 (3-sinf) · Amaliyot 01 — mustaqil topshiriq fayli (grade2 naqshi).
// Sonlar darslik poolidan: 427 (4-bet). Terminologiya: «eng yaqin yumaloq son» (metodist qarori).
// Mexanika: son o'qida ikki yumaloq son orasidan yaqinini tanlash (nazariy Dars05 RoundLine naqshi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Lumo — Bit shahri) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 24%, #4a2342 0%, #261335 58%, #130b23 100%)',
  stageBd: '#4A2A48', sink: '#F3E9F2', sink2: '#C9A9C6', stile: '#2a1530',
  glow: '#FFB84D', glowDk: '#E67E22', ribbon: '#1B2A4A', ribbonBd: '#3A4E78',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="g3d5-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 17, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 18.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="g3d5-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d5-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Yumaloq-son chizig'i: chapda va o'ngda yumaloq sonlar (bosiladi), o'rtada sonning nuqtasi.
function RoundLine({ lo, hi, value, picked, setPicked, locked, checked, correctIdx, fbOk }) {
  const W = 560, X0 = 70, X1 = 490, LINE_Y = 58;
  const frac = (value - lo) / (hi - lo);
  const xVal = X0 + (X1 - X0) * frac;
  const endStyle = (i) => {
    const on = picked === i;
    let fill = '#152342', stroke = C.ribbonBd;
    if (on) { stroke = C.acc; fill = '#2a1a30'; }
    if (checked && on) { stroke = (i === correctIdx) ? C.ok : C.no; }
    return { fill, stroke };
  };
  return (
    <svg viewBox={`0 0 ${W} 100`} style={{ width: '100%', display: 'block' }} role="group" aria-label="yumaloq son chizig'i">
      <g style={{ pointerEvents: 'none' }}>
        <line x1={X0 - 26} y1={LINE_Y} x2={X1 + 26} y2={LINE_Y} stroke={C.sink2} strokeWidth="2.5" />
        {/* oraliq kichik belgilar */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = X0 + (X1 - X0) * ((i + 1) / 10);
          return <line key={i} x1={x} y1={LINE_Y - 5} x2={x} y2={LINE_Y + 5} stroke="rgba(243,233,242,.4)" strokeWidth="1.5" />;
        })}
        {/* sonning nuqtasi */}
        <circle cx={xVal} cy={LINE_Y} r="10" fill="rgba(255,184,77,.3)" />
        <circle cx={xVal} cy={LINE_Y} r="5.5" fill={C.glow} />
        <text x={xVal} y={LINE_Y - 18} textAnchor="middle" fill={C.glow} fontSize="17" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{value}</text>
      </g>
      {/* bosiladigan yumaloq sonlar */}
      {[[0, X0, lo], [1, X1, hi]].map(([i, x, v]) => {
        const st = endStyle(i);
        return (
          <g key={i} style={{ cursor: locked ? 'default' : 'pointer' }} onClick={() => { if (!locked) setPicked(i); }}>
            <rect x={x - 44} y={LINE_Y + 12} width="88" height="34" rx="10" fill={st.fill} stroke={st.stroke} strokeWidth="2.5" />
            <text x={x} y={LINE_Y + 35} textAnchor="middle" fill={C.glow} fontSize="18" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{v}</text>
            <line x1={x} y1={LINE_Y - 10} x2={x} y2={LINE_Y + 10} stroke={C.sink} strokeWidth="3" style={{ pointerEvents: 'none' }} />
          </g>
        );
      })}
    </svg>
  );
}

const FX_CSS = `.g3d5-pop { animation: g3d5pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d5pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d5-star { opacity: .3; animation: g3d5tw 3.4s ease-in-out infinite; }
@keyframes g3d5tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 01 · Eng yaqin yumaloq o'nlik (427) · 🟢 · round_ten_line =================== */
// 427 chiziqda 420 bilan 430 orasida; 430 ga yaqinroq (7 > 5).
const D01_LO = 420, D01_HI = 430, D01_VAL = 427, D01_CORRECT = 1;
const D01_T = {
  uz: {
    eyebrow: 'Eng yaqin yumaloq son', setup: "427 soni chiziqda 420 bilan 430 orasida turibdi.",
    ask: "427 ga eng yaqin yumaloq son qaysi? Uni chiziqda bosing.",
    correct: "To'g'ri! 427 → 430: nuqta 430 ga yaqinroq turibdi (7 qadam o'tilgan, 3 qadam qolgan).",
    wrong: "Maslahat: nuqta qaysi tomonga yaqinroq turganiga qarang: 420 gachami yo 430 gachami yo'l qisqaroq?",
    rule: "Oxiri 5 dan katta bo'lsa, son keyingi yumaloq songa yaqin: 427 → 430.",
  },
  ru: {
    eyebrow: 'Ближайшее круглое число', setup: 'Число 427 стоит на линии между 420 и 430.',
    ask: 'Какое круглое число ближе к 427? Нажми его на линии.',
    correct: 'Верно! 427 → 430: точка ближе к 430 (пройдено 7 шагов, осталось 3).',
    wrong: 'Подсказка: посмотри, к какой стороне точка ближе: до 420 или до 430 путь короче?',
    rule: 'Если на конце больше 5, число ближе к следующему круглому: 427 → 430.',
  },
};
function D05_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [String(D01_LO), String(D01_HI)].map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: picked === 0 ? String(D01_LO) : String(D01_HI) }, correctAnswer: { idx: D01_CORRECT, label: String(D01_HI) }, correct, meta: { tag: 'round_ten_line', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <RoundLine lo={D01_LO} hi={D01_HI} value={D01_VAL} picked={picked} setPicked={setPicked} locked={locked} checked={checked} correctIdx={D01_CORRECT} fbOk={fb?.correct} />
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_01(props) {
  return (<><style>{FX_CSS}</style><D05_01Impl {...props} /></>);
}
