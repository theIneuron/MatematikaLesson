// Dars 17 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  sig: '#5BD6F2', sig2: '#7FE3F7', gold: '#FFC23C',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d17-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Dish = ({ s = 15, delay = 0 }) => (
  <span className="d17-ping" style={{ width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #cdf3ff, #5BD6F2 58%, #2196c4)', display: 'inline-block', boxShadow: '0 0 6px rgba(91,214,242,.55)', animationDelay: delay + 's' }} />
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#E6F6FC', border: '1.5px solid #B6E6F5', color: '#0A6E93' }}>
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

const FX_CSS = `.d17-pop { animation: d17pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d17-star { opacity: .35; animation: d17tw 3.2s ease-in-out infinite; }
        @keyframes d17tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d17-ping { animation: d17ping .5s cubic-bezier(.34,1.56,.64,1) both, d17glow 2.6s ease-in-out infinite; }
        @keyframes d17ping { 0% { opacity: 0; transform: scale(.2); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes d17glow { 0%, 100% { box-shadow: 0 0 4px rgba(91,214,242,.4); } 50% { box-shadow: 0 0 10px rgba(91,214,242,.95); } }
        .d17-float { animation: d17float 3s ease-in-out infinite; }
        @keyframes d17float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d17-cell { animation: d17cell .4s ease both; }
        @keyframes d17cell { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        .d17-pulse { animation: d17pulse 1.5s ease-in-out infinite; }
        @keyframes d17pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_ANS = 81;
const D10_T = {
  uz: {
    eyebrow: 'Javobni ter', setup: "To'liq jadval cho'qqisi: 9 ta blok, har birida 9 ta antenna.",
    ask: '9 × 9 nechaga teng? Raqamlarni bosib javobni tering:',
    correct: "To'g'ri. 9 × 9 = 81. (8 + 1 = 9 — to'qqiz sirri.)",
    wrong: "Maslahat: 9 ni 9 marta sanang — 9,18,27,36,45,54,63,72,81.",
    rule: "9 × 9 = 81. ×9 sirri: 8+1=9.",
  },
  ru: {
    eyebrow: 'Набери ответ', setup: 'Вершина таблицы: 9 блоков, в каждом по 9 антенн.',
    ask: 'Чему равно 9 × 9? Набери ответ, нажимая цифры:',
    correct: 'Верно. 9 × 9 = 81. (8 + 1 = 9 — секрет девятки.)',
    wrong: 'Подсказка: считай 9 девять раз — 9,18,27,36,45,54,63,72,81.',
    rule: '9 × 9 = 81. Секрет ×9: 8+1=9.',
  },
};
function D17_10Impl(props) {
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
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'mul_numpad99', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          {Array.from({ length: 9 }).map((_, r) => (
            <div key={r} style={{ display: 'flex', gap: 3 }}>{Array.from({ length: 9 }).map((_, c) => <Dish key={c} s={10} delay={(r * 9 + c) * 0.015} />)}</div>
          ))}
        </div>
        <div className="d17-float" style={{ textAlign: 'center', marginTop: 8, ...S.mono, fontSize: 30, fontWeight: 800, color: C.gold }}>9 × 9</div>
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

export default function D17_10(props) {
  return (<><style>{FX_CSS}</style><D17_10Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D17_10.audio = {
  uz: { intro: "To'liq jadval cho'qqisi. 9 ta blok, har birida 9 ta antenna. 9 ko'paytirish 9 nechaga teng? Raqamlarni bosib javobni tering.", on_correct: "To'g'ri. 9 ko'paytirish 9 teng 81. 8 qo'shish 1 teng 9, to'qqiz sirri.", on_wrong: "Maslahat. 9 ni 9 marta sanang, 9,18,27,36,45,54,63,72,81." },
  ru: { intro: "Вершина таблицы. 9 блоков, в каждом по 9 антенн. Чему равно 9 умножить на 9? Набери ответ, нажимая цифры.", on_correct: "Верно. 9 умножить на 9 равно 81. 8 плюс 1 равно 9, секрет девятки.", on_wrong: "Подсказка. Считай 9 девять раз, 9,18,27,36,45,54,63,72,81." },
};
