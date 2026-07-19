// Dars 5 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d05-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d05-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d05-pop { animation: d05pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d05pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d05-star { opacity: .35; animation: d05tw 3.2s ease-in-out infinite; }
        @keyframes d05tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D01_TARGET = 70;
const D01_T = {
  uz: {
    eyebrow: 'Sakrash', setup: 'Raketa 0 da. Har bosishda o‘nta oldinga sakraydi.',
    ask: 'Raketani o‘nlab sakratib, aynan 70 ga yetkazing.',
    hop: '+10 sakrang', reset: 'Boshdan',
    correct: "To'g'ri! 10, 20, 30, 40, 50, 60, 70 — yetti sakrash, 70.",
    wrong: "Maslahat: har sakrash +10. 70 ga yetish uchun 0 dan necha marta sakrash kerak?",
    rule: "O'nlab sanash: 10, 20, 30 … har qadam 10 ga ortadi.",
  },
  ru: {
    eyebrow: 'Прыжки', setup: 'Ракета на 0. Каждое нажатие — прыжок на десять вперёд.',
    ask: 'Прыгай десятками и попади ровно на 70.',
    hop: '+10 прыжок', reset: 'Сначала',
    correct: 'Верно! 10, 20, 30, 40, 50, 60, 70 — семь прыжков, 70.',
    wrong: 'Подсказка: каждый прыжок +10. Сколько прыжков от 0 до 70?',
    rule: 'Счёт десятками: 10, 20, 30 … каждый шаг +10.',
  },
};
function D05_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pos, setPos] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pos != null) { setPos(sa.pos); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pos > 0 && !checked); }, [pos, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = pos === D01_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { pos }, correctAnswer: { value: D01_TARGET }, correct, meta: { tag: 'hop', level: '🟢' } });
  }, [pos, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const posCol = checked ? (fb?.correct ? C.ok : C.no) : C.ten;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center', ...S.mono, fontSize: 40, fontWeight: 800, color: posCol, marginBottom: 6 }}>{pos}</div>
        <div style={{ position: 'relative', height: 60, margin: '4px 8px' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 40, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#3a4a63,#5BD6F2)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 46, display: 'flex', justifyContent: 'space-between' }}>
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => <span key={n} style={{ ...S.mono, fontSize: 9, fontWeight: 700, color: n === D01_TARGET ? C.ten : C.sink2 }}>{n}</span>)}
          </div>
          <div style={{ position: 'absolute', left: pos + '%', top: 6, transform: 'translateX(-50%)', fontSize: 30, transition: 'left .28s cubic-bezier(.34,1.4,.64,1)' }}>🚀</div>
          <div style={{ position: 'absolute', left: (D01_TARGET) + '%', top: 30, transform: 'translateX(-50%)', width: 3, height: 16, background: C.ten }} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
          <button type="button" disabled={locked || pos >= 100} onClick={() => setPos((p) => Math.min(100, p + 10))} style={{ padding: '12px 22px', borderRadius: 12, border: 'none', background: pos >= 100 ? '#2a3a58' : C.one, color: '#08111f', fontSize: 17, fontWeight: 800, cursor: (locked || pos >= 100) ? 'default' : 'pointer' }}>{t.hop}</button>
          <button type="button" disabled={locked || pos === 0} onClick={() => setPos(0)} style={{ padding: '12px 16px', borderRadius: 12, border: '2px solid ' + C.stageBd, background: C.stile, color: C.sink, fontSize: 14, fontWeight: 800, cursor: (locked || pos === 0) ? 'default' : 'pointer' }}>{t.reset}</button>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21, textAlign: 'center' }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_01(props) {
  return (<><style>{FX_CSS}</style><D05_01Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D05_01.audio = {
  uz: { intro: "Raketa 0 da. Har bosishda o'nta oldinga sakraydi. Raketani o'nlab sakratib, aynan 70 ga yetkazing.", on_correct: "To'g'ri! 10, 20, 30, 40, 50, 60, 70, yetti sakrash, 70.", on_wrong: "Maslahat. Har sakrash qo'shish 10. 70 ga yetish uchun 0 dan necha marta sakrash kerak?" },
  ru: { intro: "Ракета на 0. Каждое нажатие, прыжок на десять вперёд. Прыгай десятками и попади ровно на 70.", on_correct: "Верно! 10, 20, 30, 40, 50, 60, 70, семь прыжков, 70.", on_wrong: "Подсказка. Каждый прыжок плюс 10. Сколько прыжков от 0 до 70?" },
};
