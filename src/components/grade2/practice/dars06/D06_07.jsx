// Dars 6 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const Chip = ({ children, on, tone, onClick, disabled, w = 66 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 20, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

// --- son o'qi asosi ---
const TICKS = (max) => { const a = []; for (let v = 0; v <= max; v += 10) a.push(v); return a; };

const LineBase = ({ max = 100, children, h = 74 }) => (
  <div style={{ position: 'relative', height: h, margin: '14px 14px 8px' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.5, height: 5, borderRadius: 3, background: 'linear-gradient(90deg,#8ba0c8,#9fe7ff)' }} />
    {children}
  </div>
);

// belgilangan (o'qiladigan) ticklar
const StaticTicks = ({ max, labels, h = 74 }) => TICKS(max).map((v) => (
  <div key={v} style={{ position: 'absolute', left: (v / max * 100) + '%', top: h * 0.5 - 5, transform: 'translateX(-50%)' }}>
    <div style={{ width: labels.includes(v) ? 4 : 3, height: labels.includes(v) ? 12 : 8, background: labels.includes(v) ? C.ten : '#93a6cc', margin: '0 auto', borderRadius: 2 }} />
    {labels.includes(v) && <div style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: C.ten, marginTop: 3, textAlign: 'center' }}>{v}</div>}
  </div>
));

const FX_CSS = `.d06-pop { animation: d06pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d06pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d06-star { opacity: .35; animation: d06tw 3.2s ease-in-out infinite; }
        @keyframes d06tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d06-float { animation: d06float 3s ease-in-out infinite; }
        @keyframes d06float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D07_CHIPS = [20, 30, 60, 3], D07_CORRECT = 0;
const D07_T = {
  uz: {
    eyebrow: 'Sakrash uzunligi', setup: 'Kema 0 dan 60 gacha 3 ta TENG sakrashda yetdi.',
    ask: 'Har bir sakrash necha birlik? (0 → 60, 3 teng sakrash)',
    correct: "To'g'ri. 60 ni 3 ga bo‘lsak — har sakrash 20.",
    wrong: "Maslahat: 60 ni 3 teng bo‘lakka bo‘ling. Har bo‘lak necha birlik?",
    rule: "Teng sakrashlar: umumiy yo‘l ÷ sakrashlar soni. 60 ÷ 3 = 20.",
  },
  ru: {
    eyebrow: 'Длина прыжка', setup: 'Корабль дошёл от 0 до 60 за 3 РАВНЫХ прыжка.',
    ask: 'Сколько единиц каждый прыжок? (0 → 60, 3 равных прыжка)',
    correct: 'Верно. 60 делим на 3 — каждый прыжок 20.',
    wrong: 'Подсказка: раздели 60 на 3 равные части. Сколько в каждой?',
    rule: 'Равные прыжки: весь путь ÷ число прыжков. 60 ÷ 3 = 20.',
  },
};
function D06_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const order = React.useMemo(() => { const a = D07_CHIPS.map((_, i) => i); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; }, []);
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_CHIPS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { idx: picked, label: String(D07_CHIPS[picked]) }, correctAnswer: { idx: 0, label: '20' }, correct, meta: { tag: 'jumpsize', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <LineBase max={60} h={82}>
          <StaticTicks max={60} labels={[0, 60]} h={82} />
          {/* uch teng bo'lak: 0-20-40-60, oradagilar '?' */}
          {[20, 40].map((v) => <div key={v} style={{ position: 'absolute', left: (v / 60 * 100) + '%', top: 82 * 0.5 - 4, transform: 'translateX(-50%)', width: 3, height: 8, background: C.stageBd, borderRadius: 2 }} />)}
          {[[0, 20], [20, 40], [40, 60]].map(([a, b], i) => (
            <div key={i} style={{ position: 'absolute', left: (a / 60 * 100) + '%', width: ((b - a) / 60 * 100) + '%', top: 14, height: 22, borderTop: '3px solid ' + C.acc, borderRadius: '30px 30px 0 0' }}>
              <div style={{ position: 'absolute', left: '50%', top: -20, transform: 'translateX(-50%)', ...S.mono, fontSize: 14, fontWeight: 800, color: C.acc }}>?</div>
            </div>
          ))}
        </LineBase>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {order.map((i) => { const on = picked === i; let tone = null; if (checked && on) tone = i === D07_CORRECT ? 'ok' : 'no'; return <Chip key={i} on={on && !checked} tone={tone} disabled={isReview || checked} onClick={() => setPicked(i)} w={64}>{D07_CHIPS[i]}</Chip>; })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D06_07(props) {
  return (<><style>{FX_CSS}</style><D06_07Impl {...props} /></>);
}
