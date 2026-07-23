// Dars 4 (3-sinf) · Amaliyot 01 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 79-bet qoidasi — 643 = 643 (barcha razryadlar teng).
// Mexanika: belgi qo'yish (> < =) — nazariy Dars04 CompareViz naqshining amaliyot varianti.
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
      {STARS.map((s, i) => <span key={i} className="g3d4-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
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
  <div className="g3d4-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d4-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Belgi qo'yish sahnasi: A [?] B + uchta belgi tugmasi
function SignBoard({ a, b, sign, setSign, locked, checked, correctSign, fbOk }) {
  const cell = (txt) => (
    <div style={{ minWidth: 96, height: 70, borderRadius: 12, background: '#152342', border: '1.5px solid ' + C.ribbonBd, boxShadow: 'inset 0 0 14px rgba(255,184,77,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}>
      <span style={{ ...S.mono, fontSize: 32, fontWeight: 800, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)' }}>{txt}</span>
    </div>
  );
  const slotBd = checked ? (fbOk ? C.ok : C.no) : sign ? C.glow : C.stageBd;
  const btnStyle = (s) => {
    const on = sign === s;
    let bd = on ? C.acc : C.line, bg = on ? C.accSoft : C.paper, col = C.ink;
    if (checked && on) { const good = s === correctSign; bd = good ? C.ok : C.no; bg = good ? C.okSoft : C.noSoft; col = good ? C.ok : C.no; }
    return { width: 74, height: 64, borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 30, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  };
  return (
    <>
      <Stage>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          {cell(a)}
          <div style={{ width: 64, height: 64, borderRadius: 12, border: '2px dashed ' + slotBd, background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: C.glow }}>
            {sign || '?'}
          </div>
          {cell(b)}
        </div>
      </Stage>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '10px 0' }}>
        {['>', '<', '='].map((s) => (
          <button key={s} type="button" style={btnStyle(s)} disabled={locked} onClick={() => setSign(s)}>{s}</button>
        ))}
      </div>
    </>
  );
}

const FX_CSS = `.g3d4-pop { animation: g3d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d4-star { opacity: .3; animation: g3d4tw 3.4s ease-in-out infinite; }
@keyframes g3d4tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 05 · Belgini qo'ying (643 va 643) · 🟡 · compare_equal =================== */
const D01_A = '643', D01_B = '643', D01_SIGN = '=';
const D01_T = {
  uz: {
    eyebrow: "Belgini qo'ying", setup: "Ikki tuman displeyida sonlar. Ular orasiga mos belgini qo'yamiz.",
    ask: "643 va 643 orasiga qaysi belgi qo'yiladi?",
    correct: "To'g'ri! 643 = 643: barcha razryadlar bir xil — sonlar teng.",
    wrong: "Maslahat: razryadma-razryad solishtiring: yuzliklar tengmi? O'nliklar-chi? Birliklar-chi? Hammasi teng bo'lsa, sonlar qanday?",
    rule: "Barcha razryad birliklari teng bo'lsa, sonlar teng: 643 = 643.",
  },
  ru: {
    eyebrow: 'Поставь знак', setup: 'На дисплеях двух районов — числа. Поставим между ними верный знак.',
    ask: 'Какой знак ставится между 643 и 643?',
    correct: 'Верно! 643 = 643: все разряды одинаковы — числа равны.',
    wrong: 'Подсказка: сравни по разрядам: сотни равны? А десятки? А единицы? Если всё равно — какие это числа?',
    rule: 'Если все разрядные единицы равны, числа равны: 643 = 643.',
  },
};
function D04_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [sign, setSign] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sign != null) { setSign(sa.sign); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sign != null && !checked); }, [sign, checked, onReady]);
  const check = useCallback(() => {
    const correct = sign === D01_SIGN;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: ['>', '<', '='].map((s, i) => ({ id: String(i), label: s })), studentAnswer: { sign }, correctAnswer: { sign: D01_SIGN }, correct, meta: { tag: 'compare_equal', level: '🟡' } });
  }, [sign, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <SignBoard a={D01_A} b={D01_B} sign={sign} setSign={setSign} locked={locked} checked={checked} correctSign={D01_SIGN} fbOk={fb?.correct} />
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_05(props) {
  return (<><style>{FX_CSS}</style><D04_05Impl {...props} /></>);
}
