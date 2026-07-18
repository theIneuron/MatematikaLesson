// Dars 3 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_LEFT = [{ id: 'L0', val: 45, label: '45' }, { id: 'L1', val: 28, label: '28' }];
const D05_RIGHT = [{ id: 'R0', val: 28, label: '20 + 8' }, { id: 'R1', val: 45, label: '40 + 5' }];
const D05_ALL = [...D05_LEFT, ...D05_RIGHT];
const D05_PAIRCOL = [{ bd: '#2563EB', bg: '#E4ECFC' }, { bd: '#8B5CF6', bg: '#EFE8FC' }];
const D05_T = {
  uz: {
    eyebrow: 'Teng juftlar', setup: 'Chapda kodlar, o‘ngda razryad yozuvlari.',
    ask: 'Bir-biriga teng sonlarni juftlang.',
    correct: "To'g'ri. 45 = 40 + 5, 28 = 20 + 8.",
    wrong: "Maslahat: har kodni razryadga yoying. 45 = 40 + 5, 28 = 20 + 8.",
    rule: "Kod razryad yig'indisiga teng: 45 = 40 + 5.",
  },
  ru: {
    eyebrow: 'Равные пары', setup: 'Слева коды, справа записи разрядов.',
    ask: 'Соедини равные между собой числа.',
    correct: 'Верно. 45 = 40 + 5, 28 = 20 + 8.',
    wrong: 'Подсказка: разложи каждый код. 45 = 40 + 5, 28 = 20 + 8.',
    rule: 'Код равен сумме разрядов: 45 = 40 + 5.',
  },
};
function D03_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null);
  const [pairs, setPairs] = useState({}); // cardId -> pairIdx (0/1)
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pairs) { setPairs(sa.pairs); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const allPaired = Object.keys(pairs).length === 4;
  useEffect(() => { onReady?.(allPaired && !checked); }, [allPaired, checked, onReady]);
  const locked = isReview || checked;
  const valOf = (id) => D05_ALL.find((c) => c.id === id).val;
  const partnerOf = (id) => { const idx = pairs[id]; return Object.keys(pairs).find((k) => k !== id && pairs[k] === idx); };
  const tap = (id) => {
    if (locked) return;
    if (pairs[id] != null) { const idx = pairs[id]; setPairs((pr) => { const n = { ...pr }; Object.keys(n).forEach((k) => { if (n[k] === idx) delete n[k]; }); return n; }); setSel(null); return; }
    if (sel == null) { setSel(id); return; }
    if (sel[0] === id[0]) { setSel(id); return; }
    const used = new Set(Object.values(pairs)); let idx = 0; while (used.has(idx)) idx++;
    setPairs((pr) => ({ ...pr, [sel]: idx, [id]: idx })); setSel(null);
  };
  const check = useCallback(() => {
    const groups = {}; Object.entries(pairs).forEach(([id, idx]) => { (groups[idx] = groups[idx] || []).push(id); });
    const gvals = Object.values(groups);
    const correct = gvals.length === 2 && gvals.every((g) => g.length === 2 && valOf(g[0]) === valOf(g[1]));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { pairs }, correctAnswer: { by: 'equal-value' }, correct, meta: { tag: 'matchpairs', level: '🟡' } });
  }, [pairs, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cardStyle = (id) => {
    const idx = pairs[id];
    let bd = C.stageBd, bg = C.stile, col = C.sink;
    if (idx != null) { bd = D05_PAIRCOL[idx].bd; bg = D05_PAIRCOL[idx].bg; col = D05_PAIRCOL[idx].bd; }
    if (sel === id) { bd = C.acc; bg = C.accSoft; col = C.ink; }
    if (checked && idx != null) { const ok = valOf(id) === valOf(partnerOf(id)); bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
    return { width: '100%', height: 62, borderRadius: 14, border: '2.5px solid ' + bd, background: bg, ...S.mono, fontSize: 24, fontWeight: 800, color: col, cursor: locked ? 'default' : 'pointer', boxShadow: sel === id ? '0 0 0 4px #FFE0D6' : 'none' };
  };
  const badge = (id) => { const idx = pairs[id]; if (idx == null || checked) return null; return <span style={{ position: 'absolute', top: 6, right: 8, width: 16, height: 16, borderRadius: '50%', background: D05_PAIRCOL[idx].bd }} />; };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <Stage>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {D05_LEFT.map((c) => <button key={c.id} type="button" disabled={locked} onClick={() => tap(c.id)} style={{ position: 'relative', ...cardStyle(c.id) }}>{badge(c.id)}{c.label}</button>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {D05_RIGHT.map((c) => <button key={c.id} type="button" disabled={locked} onClick={() => tap(c.id)} style={{ position: 'relative', ...cardStyle(c.id) }}>{badge(c.id)}{c.label}</button>)}
          </div>
        </div>
      </Stage>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_05(props) {
  return (<><style>{FX_CSS}</style><D03_05Impl {...props} /></>);
}
