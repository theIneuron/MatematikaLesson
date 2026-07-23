// Dars 10 (3-sinf) · Amaliyot 04 — mustaqil topshiriq fayli (grade5 dars04 formati).
// Manba: darslik 17-bet qoidasi (o'rin almashtirish) + 12-bet uzum sonlari · grade5 commutative formati.
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
      {STARS.map((s, i) => <span key={i} className="g3d3-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const Neon = ({ text, size = 32 }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ padding: '10px 22px', borderRadius: 14, background: '#152342', border: '1.5px solid ' + C.ribbonBd, boxShadow: 'inset 0 0 18px rgba(255,184,77,.22)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: size, fontWeight: 800, letterSpacing: 3, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)' }}>{text}</span>
    </div>
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
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function NumPad({ value, setValue, disabled, max = 3, tone = 'idle' }) {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  const keyStyle = { width: 62, height: 56, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: C.ink, cursor: disabled ? 'default' : 'pointer' };
  const dBd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.acc;
  const dBg = tone === 'ok' ? C.okSoft : tone === 'no' ? C.noSoft : C.paper;
  const dCol = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.ink;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 170, height: 62, borderRadius: 14, border: '2px solid ' + dBd, background: dBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: dCol, letterSpacing: 3 }}>{value || '–'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 62px)', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={keyStyle}>{d}</button>))}
        <span />
        <button type="button" disabled={disabled} onClick={() => push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize: 20, color: C.no }}>⌫</button>
      </div>
    </div>
  );
}

const FX_CSS = `.g3d3-pop { animation: g3d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d3-star { opacity: .3; animation: g3d3tw 3.4s ease-in-out infinite; }
@keyframes g3d3tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 04 · O'rin almashtirish (8 × 9) · 🟡 · commutative =================== */
const D02_ANS = '72';
const D02_T = {
  uz: {
    eyebrow: "O'rin almashtirish", setup: "Ma'lum: 9 × 8 = 72. Endi displeyda ko'paytuvchilar o'rni almashgan.",
    ask: "8 × 9 = ? (Qayta hisoblamasdan ham topish mumkin!)",
    expr: '9 × 8 = 72 → 8 × 9 = ?',
    correct: "To'g'ri! 8 × 9 = 72. Ko'paytuvchilar o'rni almashsa, ko'paytma O'ZGARMAYDI — qayta hisoblash shart emas.",
    wrong: "Maslahat: 9 × 8 bilan 8 × 9 — o'sha savatlarning o'zi, faqat boshqacha sanalgan. Ko'paytma o'zgaradimi?",
    rule: "Ko'paytuvchilar o'rni almashtirilsa, ko'paytma o'zgarmaydi: 8 × 9 = 9 × 8 = 72.",
  },
  ru: {
    eyebrow: 'Перестановка', setup: 'Известно: 9 × 8 = 72. Теперь на дисплее множители поменялись местами.',
    ask: '8 × 9 = ? (Можно найти даже без пересчёта!)',
    expr: '9 × 8 = 72 → 8 × 9 = ?',
    correct: 'Верно! 8 × 9 = 72. От перестановки множителей произведение НЕ МЕНЯЕТСЯ — пересчитывать не нужно.',
    wrong: 'Подсказка: 9 × 8 и 8 × 9 — те же корзины, просто посчитаны по-другому. Меняется ли произведение?',
    rule: 'От перестановки множителей произведение не меняется: 8 × 9 = 9 × 8 = 72.',
  },
};
function D10_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [value, setValue] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setValue(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(value.length > 0 && !checked); }, [value, checked, onReady]);
  const check = useCallback(() => {
    const correct = value === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'commutative', level: '🟡' } });
  }, [value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><Neon text={t.expr} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <NumPad value={value} setValue={setValue} disabled={locked} max={2} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D10_04(props) {
  return (<><style>{FX_CSS}</style><D10_04Impl {...props} /></>);
}
