// Dars 6 · Amaliyot 08 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d06-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d06-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// --- son o'qi asosi ---
const TICKS = (max) => { const a = []; for (let v = 0; v <= max; v += 10) a.push(v); return a; };

const LineBase = ({ max = 100, children, h = 74 }) => (
  <div style={{ position: 'relative', height: h, margin: '14px 14px 8px' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.5, height: 5, borderRadius: 3, background: 'linear-gradient(90deg,#8ba0c8,#9fe7ff)' }} />
    {children}
  </div>
);

const FX_CSS = `.d06-pop { animation: d06pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d06pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d06-star { opacity: .35; animation: d06tw 3.2s ease-in-out infinite; }
        @keyframes d06tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d06-float { animation: d06float 3s ease-in-out infinite; }
        @keyframes d06float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D08_A = 30, D08_B = 60;
const D08_T = {
  uz: {
    eyebrow: 'Bo‘lakni belgilang', setup: 'O‘nlik belgilarni bosib, bo‘lak hosil qilinadi.',
    ask: 'Trassada 30 dan 60 gacha bo‘lakni belgilang (boshi va oxirini bosing).',
    correct: "To'g'ri. 30 dan 60 gacha bo‘lak — 3 ta o‘nlik uzunlikda.",
    wrong: "Maslahat: bo‘lakning boshi 30, oxiri 60. Shu ikki belgini bosing.",
    rule: "Bo‘lak — ikki nuqta orasidagi qism: 30 dan 60 gacha.",
  },
  ru: {
    eyebrow: 'Отметь отрезок', setup: 'Нажимая отметки десятков, создаём отрезок.',
    ask: 'Отметь на трассе отрезок от 30 до 60 (нажми начало и конец).',
    correct: 'Верно. Отрезок от 30 до 60 — длиной 3 десятка.',
    wrong: 'Подсказка: начало отрезка 30, конец 60. Нажми эти две отметки.',
    rule: 'Отрезок — часть между двумя точками: от 30 до 60.',
  },
};
function D06_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [ends, setEnds] = useState([]); // up to 2 values
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.ends) { setEnds(sa.ends); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = ends.length === 2;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const tap = (v) => { if (locked) return; setEnds((e) => e.includes(v) ? e.filter((x) => x !== v) : (e.length >= 2 ? [v] : [...e, v])); };
  const lo = ends.length ? Math.min(...ends) : null, hi = ends.length === 2 ? Math.max(...ends) : null;
  const check = useCallback(() => {
    const correct = ends.length === 2 && Math.min(...ends) === D08_A && Math.max(...ends) === D08_B;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { ends }, correctAnswer: { a: D08_A, b: D08_B }, correct, meta: { tag: 'segment', level: '🔴' } });
  }, [ends, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bandCol = checked ? (fb?.correct ? C.ok : C.no) : C.acc;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <LineBase max={100} h={80}>
          {lo != null && hi != null && <div style={{ position: 'absolute', left: lo + '%', width: (hi - lo) + '%', top: 80 * 0.5 - 3, height: 10, background: bandCol, opacity: .55, borderRadius: 5 }} />}
          {TICKS(100).map((v) => {
            const on = ends.includes(v);
            let bd = '#93a6cc', bg = '#44577f';
            if (on) { bd = bandCol; bg = bandCol; }
            return (
              <button key={v} type="button" disabled={locked} onClick={() => tap(v)} style={{ position: 'absolute', left: v + '%', top: 80 * 0.5 - 15, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: locked ? 'default' : 'pointer' }}>
                <span style={{ width: on ? 18 : 12, height: on ? 18 : 12, borderRadius: '50%', border: '2px solid ' + bd, background: bg }} />
                <span style={{ ...S.mono, fontSize: 10, fontWeight: 800, color: (v === 30 || v === 60) ? C.sink2 : C.sink2 }}>{v}</span>
              </button>
            );
          })}
        </LineBase>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D06_08(props) {
  return (<><style>{FX_CSS}</style><D06_08Impl {...props} /></>);
}
