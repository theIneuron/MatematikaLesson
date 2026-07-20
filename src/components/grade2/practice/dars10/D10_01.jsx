// Dars 10 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // MARS sahna (to'q qizg'ish)
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const DUST = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DUST.map((s, i) => <span key={i} className="d10-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Cassette = ({ s = 26, dim, lit = true }) => (
  <svg width={s} height={s * 66 / 48} viewBox="0 0 48 66" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', opacity: dim ? 0.28 : 1, transition: 'opacity .2s' }}>
    <defs><linearGradient id="d10cass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5E82" /><stop offset="52%" stopColor="#8C9EC4" /><stop offset="100%" stopColor="#4E5E82" /></linearGradient></defs>
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#d10cass)" stroke="#33415F" strokeWidth="1.4" />
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" /><circle cx="24" cy="9.2" r="2" fill={dim || !lit ? '#3A4A66' : '#6EF29B'} />
    {Array.from({ length: 10 }).map((_, i) => { const col = i % 2; const row = Math.floor(i / 2); return <rect key={i} x={7.5 + col * 19.5} y={17 + row * 9.4} width="13" height="5.4" rx="1.8" fill="#2FA0CC" stroke="#093F55" strokeWidth="0.4" />; })}
  </svg>
);

const Battery = ({ s = 18, dim }) => (
  <svg width={s * 0.66} height={s} viewBox="0 0 22 34" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', opacity: dim ? 0.28 : 1, transition: 'opacity .2s' }}>
    <defs><linearGradient id="d10batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96" /><stop offset="50%" stopColor="#8FE0F4" /><stop offset="100%" stopColor="#0A5876" /></linearGradient></defs>
    <rect x="8" y="0.6" width="6" height="3.4" rx="1.4" fill="#8FA0AE" /><rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="url(#d10batt)" stroke="#093F55" strokeWidth="1" />
    <rect x="1.4" y="12.5" width="19.2" height="7" fill="#C7401F" opacity="0.9" />
  </svg>
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
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d10-star { opacity: .4; animation: d10tw 3.4s ease-in-out infinite; }
        @keyframes d10tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 52 = 5 kasseta + 2 batareya. Bitta kassetani ochish -> 12 batareya.
const D01_T = {
  uz: {
    eyebrow: 'Kassetani oching', setup: '52 = 5 kasseta + 2 batareya. Birlikdan 7 ni ayirish kerak, ammo faqat 2 batareya bor.',
    ask: 'Birlik yetmadi. Bitta kassetani bosib oching — u 10 batareyaga aylanadi.',
    batt: 'Batareya', cass: 'Kasseta',
    correct: "To'g'ri. Bitta o‘nlik (kasseta) ochildi: 10 + 2 = 12 batareya. Endi 12 − 7 mumkin.",
    wrong: "Maslahat: faqat BITTA kassetani oching. U 10 batareyaga bo‘linadi va birlik yetadi.",
    rule: "Birlik yetmasa, 1 o‘nlik (kasseta) ochiladi: birlik 10 taga ko‘payadi.",
  },
  ru: {
    eyebrow: 'Открой кассету', setup: '52 = 5 кассет + 2 батарейки. Нужно вычесть 7 единиц, но батареек только 2.',
    ask: 'Единиц не хватает. Нажми одну кассету — она станет 10 батарейками.',
    batt: 'Батарейки', cass: 'Кассеты',
    correct: 'Верно. Один десяток (кассета) открыт: 10 + 2 = 12 батареек. Теперь можно 12 − 7.',
    wrong: 'Подсказка: открой только ОДНУ кассету. Она разложится на 10 батареек, и единиц хватит.',
    rule: 'Если единиц мало, открываем 1 десяток (кассету): единиц становится на 10 больше.',
  },
};
function D10_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [opened, setOpened] = useState([]); // opened cassette indices
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.opened) { setOpened(sa.opened); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const touched = opened.length > 0;
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);
  const locked = isReview || checked;
  const tap = (i) => { if (locked) return; setOpened((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i]); };
  const battCount = 2 + opened.length * 10;
  const cassCount = 5 - opened.length;
  const check = useCallback(() => {
    const correct = opened.length === 1;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { opened, batt: battCount }, correctAnswer: { opened: 1, batt: 12 }, correct, meta: { tag: 'unbundle', level: '🟢' } });
  }, [opened, battCount, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const battCol = checked ? (fb?.correct ? C.ok : C.no) : C.mars;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => <button key={'c' + i} type="button" disabled={locked} onClick={() => tap(i)} style={{ border: 'none', background: 'transparent', padding: 0, cursor: locked ? 'default' : 'pointer' }}><Cassette s={40} dim={opened.includes(i)} /></button>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', minHeight: 34 }}>
          {Array.from({ length: battCount }).map((_, i) => <span key={i} className={i >= 2 ? 'd10-pop' : ''}><Battery s={30} /></span>)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 13, fontWeight: 700, color: C.sink2 }}>{t.cass}: <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: C.sink }}>{cassCount}</span> &nbsp;·&nbsp; {t.batt}: <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: battCol }}>{battCount}</span></div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D10_01(props) {
  return (<><style>{FX_CSS}</style><D10_01Impl {...props} /></>);
}
