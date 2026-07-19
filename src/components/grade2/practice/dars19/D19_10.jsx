// Dars 19 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', ring: '#3A4A63',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d19-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Crystal = ({ s = 18, cls = 'd19-drop', delay = 0 }) => (
  <span className={cls} style={{ width: s, height: s, background: 'linear-gradient(160deg,#FFE79E,#FFB524)', display: 'inline-block', transform: 'rotate(45deg)', borderRadius: 3, boxShadow: '0 0 7px rgba(255,194,60,.55)', animationDelay: delay + 's' }} />
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
  <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function NumPad({ value, setValue, disabled, max = 2 }) {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  const keyStyle = { width: 62, height: 56, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: C.ink, cursor: disabled ? 'default' : 'pointer' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 150, height: 62, borderRadius: 14, border: '2px solid ' + C.acc, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: 3 }}>{value || '–'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 62px)', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={keyStyle}>{d}</button>))}
        <span />
        <button type="button" disabled={disabled} onClick={() => push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize: 20, color: C.no }}>⌫</button>
      </div>
    </div>
  );
}

const FX_CSS = `.d19-pop { animation: d19pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d19pop { 0% { opacity: 0; transform: rotate(45deg) scale(.3); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        .d19-star { opacity: .35; animation: d19tw 3.2s ease-in-out infinite; }
        @keyframes d19tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d19-drop { animation: d19drop .5s cubic-bezier(.34,1.56,.64,1) both, d19shine 3.4s ease-in-out infinite; }
        @keyframes d19drop { 0% { opacity: 0; transform: rotate(45deg) translateY(-6px) scale(.4); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d19shine { 0%, 100% { box-shadow: 0 0 5px rgba(255,194,60,.45); } 50% { box-shadow: 0 0 11px rgba(255,214,115,.95); } }
        .d19-float { animation: d19float 3s ease-in-out infinite; }
        @keyframes d19float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d19-pulse { animation: d19pulse 1.5s ease-in-out infinite; }
        @keyframes d19pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_ANS = 5;
const D10_T = {
  uz: {
    eyebrow: 'Javobni ter', setup: "20 ta kristal, 4 ta halqa-idish. Teng ulang.",
    ask: 'Har idishga nechtadan tegadi? Raqamni bosib tering:',
    correct: "To'g'ri. 20 ÷ 4 = 5. Har idishda 5 tadan.",
    wrong: "Maslahat: 20 ni 4 ga teng ulang. 5 tadan to'g'ri keladi.",
    rule: "20 ÷ 4 = 5. Yordam: 4 × 5 = 20.",
  },
  ru: {
    eyebrow: 'Набери ответ', setup: '20 кристаллов, 4 кольца-сосуда. Раздели поровну.',
    ask: 'Сколько в каждый сосуд? Набери, нажимая цифру:',
    correct: 'Верно. 20 ÷ 4 = 5. В каждом сосуде по 5.',
    wrong: 'Подсказка: раздели 20 на 4 поровну. Выходит по 5.',
    rule: '20 ÷ 4 = 5. Подсказка: 4 × 5 = 20.',
  },
};
function D19_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val !== '' && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'div_numpad', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 320, margin: '0 auto' }}>
          {Array.from({ length: 20 }).map((_, i) => <Crystal key={i} s={15} delay={i * 0.025} />)}
        </div>
        <div className="d19-float" style={{ textAlign: 'center', marginTop: 8, ...S.mono, fontSize: 30, fontWeight: 800, color: C.gold }}>20 ÷ 4</div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 16, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <NumPad value={val} setValue={setVal} disabled={isReview || checked} max={2} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D19_10(props) {
  return (<><style>{FX_CSS}</style><D19_10Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D19_10.audio = {
  uz: { intro: "20 ta kristal, 4 ta halqa-idish. Teng ulang. Har idishga nechtadan tegadi? Raqamni bosib tering.", on_correct: "To'g'ri. 20 bo'lish 4 teng 5. Har idishda 5 tadan.", on_wrong: "Maslahat. 20 ni 4 ga teng ulang. 5 tadan to'g'ri keladi." },
  ru: { intro: "20 кристаллов, 4 кольца-сосуда. Раздели поровну. Сколько в каждый сосуд? Набери, нажимая цифру.", on_correct: "Верно. 20 делить на 4 равно 5. В каждом сосуде по 5.", on_wrong: "Подсказка. Раздели 20 на 4 поровну. Выходит по 5." },
};
