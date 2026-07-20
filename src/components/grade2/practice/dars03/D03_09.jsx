// Dars 3 · Amaliyot 09 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d03-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 23.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d03-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// razryad chip (kod/plitka)
const Chip = ({ children, on, tone, onClick, disabled, w = 62 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 52, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 21, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D09_CHIPS = [7, 70, 6, 1];
const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: 'Qism-butun', setup: 'Butun 67. Bir qismi 60. Yetishmagan qismni toping.',
    ask: 'Uchburchakdagi yetishmagan razryad qismini tanlang.',
    correct: "To'g'ri. 67 = 60 + 7. Yetishmagan qism — 7 (birliklar).",
    wrong: "Maslahat: 60 ga qancha qo'shsak 67 bo'ladi? Birlik raqamiga qarang.",
    rule: "67 = 60 + 7. Butun = o'nliklar qismi + birliklar qismi.",
  },
  ru: {
    eyebrow: 'Часть-целое', setup: 'Целое 67. Одна часть 60. Найди недостающую часть.',
    ask: 'Выбери недостающую разрядную часть в треугольнике.',
    correct: 'Верно. 67 = 60 + 7. Недостающая часть — 7 (единицы).',
    wrong: 'Подсказка: сколько прибавить к 60, чтобы вышло 67? Смотри на единицы.',
    rule: '67 = 60 + 7. Целое = часть десятков + часть единиц.',
  },
};
function D03_09Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D09_CHIPS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { idx: picked, label: String(D09_CHIPS[picked]) }, correctAnswer: { idx: 0, label: '7' }, correct, meta: { tag: 'numberbond', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const missCol = checked ? (fb?.correct ? C.ok : C.no) : (picked != null ? C.acc : C.sink2);
  const missTxt = picked != null ? D09_CHIPS[picked] : '?';
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 76, height: 62, borderRadius: 14, background: C.stile, border: '2px solid ' + C.ten, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: C.ten }}>67</div>
          <svg width="150" height="34" viewBox="0 0 150 34" aria-hidden="true"><path d="M75 2 L28 30 M75 2 L122 30" stroke={C.sink2} strokeWidth="2.5" fill="none" /></svg>
          <div style={{ display: 'flex', gap: 44 }}>
            <div style={{ width: 66, height: 56, borderRadius: 12, background: C.stile, border: '2px solid ' + C.one, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: C.one }}>60</div>
            <div style={{ width: 66, height: 56, borderRadius: 12, background: C.stile, border: '2px dashed ' + missCol, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: missCol }}>{missTxt}</div>
          </div>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D09_CHIPS.map((n, i) => {
          const on = picked === i;
          let tone = null;
          if (checked && on) tone = i === D09_CORRECT ? 'ok' : 'no';
          return <Chip key={i} on={on && !checked} tone={tone} disabled={isReview || checked} onClick={() => setPicked(i)} w={64}>{n}</Chip>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_09(props) {
  return (<><style>{FX_CSS}</style><D03_09Impl {...props} /></>);
}
