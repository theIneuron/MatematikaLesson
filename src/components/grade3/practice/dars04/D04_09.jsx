// Dars 4 (3-sinf) · Amaliyot 09 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 79-bet masalasi mavzusi — minoralar balandligi farqi (375 va 320).
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
const Towers = () => {
  const H = 120;
  const bar = (h, lbl, col) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800, color: C.glow, textShadow: '0 0 10px rgba(255,184,77,.7)' }}>{h} m</span>
      <div className="g3d4-grow" style={{ width: 44, height: Math.round(H * h / 400), borderRadius: '8px 8px 3px 3px', background: 'linear-gradient(180deg,' + col + ', #1B2A4A)', border: '1.5px solid ' + C.ribbonBd }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase' }}>{lbl}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 34, justifyContent: 'center', alignItems: 'flex-end' }}>
      {bar(375, 'Toshkent', '#FFB84D')}
      {bar(320, 'Eyfel', '#7fd0ff')}
    </div>
  );
};
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

const FX_CSS = `.g3d4-pop { animation: g3d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d4-star { opacity: .3; animation: g3d4tw 3.4s ease-in-out infinite; }
@keyframes g3d4tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d4-grow { transform-origin: bottom; animation: g3d4grow .7s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4grow { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 09 · Masala: necha metr baland? (375 va 320) · 🔴 · compare_diff =================== */
const D09_ANS = '55';
const D09_T = {
  uz: {
    eyebrow: 'Masala', setup: "Toshkent teleminorasi — 375 metr, Eyfel minorasi — 320 metr. Toshkent minorasi balandroq ekanini bilib oldik.",
    ask: 'Toshkent teleminorasi Eyfel minorasidan necha metr baland? Javobni tering.',
    correct: "To'g'ri! 375 − 320 = 55: Toshkent teleminorasi 55 metr baland.",
    wrong: "Maslahat: farqni topish uchun katta sondan kichigini ayiring. Razryadma-razryad: yuzliklar teng, o'nliklar 7 − 2, birliklar 5 − 0.",
    rule: "Farq = katta son − kichik son: 375 − 320 = 55.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Ташкентская телебашня — 375 метров, Эйфелева башня — 320 метров. Мы уже знаем, что ташкентская выше.',
    ask: 'На сколько метров Ташкентская телебашня выше Эйфелевой? Набери ответ.',
    correct: 'Верно! 375 − 320 = 55: Ташкентская телебашня выше на 55 метров.',
    wrong: 'Подсказка: чтобы найти разницу, вычти из большего числа меньшее. По разрядам: сотни равны, десятки 7 − 2, единицы 5 − 0.',
    rule: 'Разница = большее число − меньшее: 375 − 320 = 55.',
  },
};
function D04_09Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [value, setValue] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setValue(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(value.length > 0 && !checked); }, [value, checked, onReady]);
  const check = useCallback(() => {
    const correct = value === D09_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value }, correctAnswer: { value: D09_ANS }, correct, meta: { tag: 'compare_diff', level: '🔴' } });
  }, [value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><Towers /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <NumPad value={value} setValue={setValue} disabled={locked} max={3} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_09(props) {
  return (<><style>{FX_CSS}</style><D04_09Impl {...props} /></>);
}
