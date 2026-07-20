// Dars 4 · Amaliyot 02 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d04-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d04-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d04-pop { animation: d04pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d04pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d04-star { opacity: .35; animation: d04tw 3.2s ease-in-out infinite; }
        @keyframes d04tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d04-float { animation: d04float 3.4s ease-in-out infinite; }
        @keyframes d04float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D02_TARGET = 56, D02_CORRECT = 5; // segment [50,60]
const D02_T = {
  uz: {
    eyebrow: 'O‘nliklar orasi', setup: 'Marshrut 0 dan 100 gacha, o‘nliklarga bo‘lingan.',
    ask: '56 kodi qaysi ikki o‘nlik ORASIDA? To‘g‘ri bo‘lakni bosing.',
    correct: "To'g'ri. 56 — 50 va 60 orasida (5 o'nlik va biroz).",
    wrong: "Maslahat: 56 ning o'nlik raqamiga qarang. U qaysi ikki o'nlik orasiga tushadi?",
    rule: "Ikki xonali son o'z o'nligi va keyingi o'nlik orasida turadi: 56 → 50–60.",
  },
  ru: {
    eyebrow: 'Между десятками', setup: 'Маршрут от 0 до 100, разбит на десятки.',
    ask: '56 находится МЕЖДУ какими десятками? Нажми нужный отрезок.',
    correct: 'Верно. 56 — между 50 и 60 (5 десятков и немного).',
    wrong: 'Подсказка: посмотри на цифру десятков в 56. Между какими десятками оно?',
    rule: 'Двузначное число между своим десятком и следующим: 56 → 50–60.',
  },
};
function D04_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.seg != null) { setPicked(initialAnswer.studentAnswer.seg); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D02_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { seg: picked }, correctAnswer: { seg: D02_CORRECT }, correct, meta: { tag: 'interval', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div className="d04-float" style={{ textAlign: 'center', ...S.mono, fontSize: 44, fontWeight: 800, color: C.ten, marginBottom: 10 }}>56</div>
        <div style={{ display: 'flex', gap: 3, padding: '0 4px' }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const on = picked === i;
            let bd = C.stageBd, bg = C.stile;
            if (on) { bd = C.acc; bg = 'rgba(255,79,40,.22)'; }
            if (checked && on) { const ok = i === D02_CORRECT; bd = ok ? C.ok : C.no; bg = ok ? 'rgba(31,122,77,.25)' : 'rgba(192,57,43,.25)'; }
            return <button key={i} type="button" disabled={locked} onClick={() => setPicked(i)} style={{ flex: 1, height: 34, borderRadius: 7, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }} />;
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 2px 0' }}>
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => <span key={n} style={{ ...S.mono, fontSize: 10, fontWeight: 700, color: n === 50 || n === 60 ? C.ten : C.sink2 }}>{n}</span>)}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_02(props) {
  return (<><style>{FX_CSS}</style><D04_02Impl {...props} /></>);
}
