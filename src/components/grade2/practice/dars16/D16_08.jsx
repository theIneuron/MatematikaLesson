// Dars 16 · Amaliyot 08 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // sahna (animatsiya) — to'q koinot
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  green: '#6EF29B', gold: '#FFC23C', sig: '#5BD6F2',
};

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
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d16-star { opacity: .35; animation: d16tw 3.2s ease-in-out infinite; }
        @keyframes d16tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d16-sprout { animation: d16sprout .5s cubic-bezier(.34,1.56,.64,1) both, d16sway 3.6s ease-in-out infinite; }
        @keyframes d16sprout { 0% { opacity: 0; transform: rotate(45deg) scale(.2); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d16sway { 0%, 100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(-1.5px); } }
        .d16-float { animation: d16float 3s ease-in-out infinite; }
        @keyframes d16float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d16-cell { animation: d16cell .4s ease both; }
        @keyframes d16cell { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        .d16-pulse { animation: d16pulse 1.5s ease-in-out infinite; }
        @keyframes d16pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D08_ITEMS = [{ n: 24, bin: 0 }, { n: 35, bin: 1 }, { n: 36, bin: 0 }, { n: 42, bin: 1 }];
const D08_T = {
  uz: {
    eyebrow: 'Savatlarga ajrat', setup: "Har son bitta jadvaldan. Sonni to'g'ri savatga joylang.",
    ask: 'Sonni bosing, keyin savatni bosing:',
    bin0: '×6 jadvali', bin1: '×7 jadvali',
    correct: "To'g'ri. 24=6×4, 36=6×6 — ×6 jadvali. 35=7×5, 42=7×6 — ×7 jadvali.",
    wrong: "Maslahat: 6 li sanoqda bormi (6,12,18,24,30,36) yoki 7 li (7,14,21,28,35,42)?",
    rule: "Son qaysi skip-sanoqda uchrasa — o'sha jadvaldan.",
  },
  ru: {
    eyebrow: 'Разложи по корзинам', setup: 'Каждое число из одной таблицы. Помести число в нужную корзину.',
    ask: 'Нажми число, затем корзину:',
    bin0: 'Таблица ×6', bin1: 'Таблица ×7',
    correct: 'Верно. 24=6×4, 36=6×6 — таблица ×6. 35=7×5, 42=7×6 — таблица ×7.',
    wrong: 'Подсказка: встречается в счёте по 6 (6,12,18,24,30,36) или по 7 (7,14,21,28,35,42)?',
    rule: 'В каком счёте встречается число — из той таблицы.',
  },
};
function D16_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [place, setPlace] = useState([null, null, null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = place.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const drop = (bin) => { if (locked || pick == null) return; setPlace((p) => { const n = p.slice(); n[pick] = bin; return n; }); setPick(null); };
  const check = useCallback(() => {
    const correct = place.every((v, i) => v === D08_ITEMS[i].bin);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: { bins: D08_ITEMS.map((x) => x.bin) }, correct, meta: { tag: 'sort_tables', level: '🔴' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bin = (b) => {
    const items = D08_ITEMS.map((it, i) => ({ it, i })).filter((x) => place[x.i] === b);
    const tint = b === 0 ? C.acc : C.ok;
    return (
      <div onClick={() => drop(b)} style={{ flex: 1, minHeight: 100, borderRadius: 14, border: '2px dashed ' + tint, background: b === 0 ? C.accSoft : C.okSoft, padding: 10, cursor: locked ? 'default' : 'pointer' }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: tint, marginBottom: 6, textAlign: 'center' }}>{b === 0 ? t.bin0 : t.bin1}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {items.map(({ it, i }) => {
            const ok = it.bin === b;
            const bd = checked ? (ok ? C.ok : C.no) : '#cbd5e1';
            const cl = checked ? (ok ? C.ok : C.no) : C.ink;
            return <span key={i} style={{ width: 50, height: 44, borderRadius: 10, border: '2px solid ' + bd, background: C.paper, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 19, fontWeight: 800, color: cl }}>{it.n}</span>;
          })}
        </div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', minHeight: 52, margin: '4px 0 12px' }}>
        {D08_ITEMS.map((it, i) => {
          if (place[i] != null) return null;
          const on = pick === i;
          return <button key={i} type="button" disabled={locked} onClick={() => setPick(on ? null : i)} style={{ width: 58, height: 50, borderRadius: 12, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 21, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{it.n}</button>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>{bin(0)}{bin(1)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D16_08(props) {
  return (<><style>{FX_CSS}</style><D16_08Impl {...props} /></>);
}
