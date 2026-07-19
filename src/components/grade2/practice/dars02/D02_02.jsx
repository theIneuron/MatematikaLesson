// Dars 2 · Amaliyot 02 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d02-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d02-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function NumPad({ value, setValue, disabled, max = 2, tone = 'idle' }) {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  const keyStyle = { width: 62, height: 56, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: C.ink, cursor: disabled ? 'default' : 'pointer' };
  const dispBd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.acc;
  const dispBg = tone === 'ok' ? C.okSoft : tone === 'no' ? C.noSoft : C.paper;
  const dispCol = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.ink;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 160, height: 62, borderRadius: 14, border: '2px solid ' + dispBd, background: dispBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: dispCol, letterSpacing: 3 }}>{value || '–'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 62px)', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={keyStyle}>{d}</button>))}
        <span />
        <button type="button" disabled={disabled} onClick={() => push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize: 20, color: C.no }}>⌫</button>
      </div>
    </div>
  );
}

const FX_CSS = `.d02-pop { animation: d02pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-star { opacity: .35; animation: d02tw 3.2s ease-in-out infinite; }
        @keyframes d02tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d02-drop { animation: d02drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-float { animation: d02float 3s ease-in-out infinite; }
        @keyframes d02float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d02-pulse { animation: d02pulse 1.5s ease-in-out infinite; }
        @keyframes d02pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D02_ANS = 53;
const D02_T = {
  uz: {
    eyebrow: 'Kodni yozing', setup: 'Dispetcher kodni ovoz bilan uzatdi: «ellik uch».',
    ask: 'Dispetcher aytgan kodni raqamlar bilan yozing: «ellik uch».',
    correct: "To'g'ri. Ellik = 5 o'nlik = 50, uch = 3 birlik. 50 + 3 = 53.",
    wrong: "Maslahat: «ellik» — 5 o'nlik (50), «uch» — 3 birlik. Ularni yopishtirmang: 503 emas, 53.",
    rule: "«Ellik uch» = 50 + 3 = 53. Nomni raqamlarga aylantiramiz, yopishtirmaymiz.",
  },
  ru: {
    eyebrow: 'Запиши код', setup: 'Диспетчер передал код голосом: «пятьдесят три».',
    ask: 'Запиши код цифрами: «пятьдесят три».',
    correct: 'Верно. Пятьдесят = 5 десятков = 50, три = 3 единицы. 50 + 3 = 53.',
    wrong: 'Подсказка: «пятьдесят» — 5 десятков (50), «три» — 3 единицы. Не склеивай: не 503, а 53.',
    rule: '«Пятьдесят три» = 50 + 3 = 53. Название переводим в цифры, не склеиваем.',
  },
};
function D02_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val !== '' && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'write_numpad', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span className="d02-pulse" style={{ fontSize: 34 }}>📡</span>
          <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: C.sink, background: C.stile, border: '1px solid ' + C.stageBd, borderRadius: 10, padding: '8px 16px' }}>{lang === 'uz' ? '«ellik uch»' : '«пятьдесят три»'}</span>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 17, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <NumPad value={val} setValue={setVal} disabled={isReview || checked} max={3} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_02(props) {
  return (<><style>{FX_CSS}</style><D02_02Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D02_02.audio = {
  uz: { intro: "Dispetcher kodni ovoz bilan uzatdi. Ellik uch. Dispetcher aytgan kodni raqamlar bilan yozing. Ellik uch.", on_correct: "To'g'ri. Ellik teng 5 o'nlik teng 50, uch teng 3 birlik. 50 qo'shish 3 teng 53.", on_wrong: "Maslahat. Ellik, 5 o'nlik 50, uch, 3 birlik. Ularni yopishtirmang. 503 emas, 53." },
  ru: { intro: "Диспетчер передал код голосом. Пятьдесят три. Запиши код цифрами. Пятьдесят три.", on_correct: "Верно. Пятьдесят равно 5 десятков равно 50, три равно 3 единицы. 50 плюс 3 равно 53.", on_wrong: "Подсказка. Пятьдесят, 5 десятков 50, три, 3 единицы. Не склеивай. Не 503, а 53." },
};
