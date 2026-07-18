// Dars 19 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D04_ROWS = [{ expr: '10 ÷ 2', val: 5 }, { expr: '12 ÷ 3', val: 4 }, { expr: '8 ÷ 4', val: 2 }, { expr: '9 ÷ 3', val: 3 }];
const D04_CARDS = [5, 2, 4, 3, 6, 8];
const D04_T = {
  uz: {
    eyebrow: 'Moslash', setup: "Bit bo'linmalarni hisobladi. Har birini javobiga ulang.",
    ask: 'Kartani bosing, keyin mos ifodaning bo‘sh joyini bosing:',
    correct: "To'g'ri. 10÷2=5, 12÷3=4, 8÷4=2, 9÷3=3.",
    wrong: "Maslahat: har birini teng ulang. 10 ni 2 ga — 5, 8 ni 4 ga — 2.",
    rule: "Bo'lish — teng ulash. Har ifodani alohida ulab ko'ring.",
  },
  ru: {
    eyebrow: 'Соответствие', setup: 'Бит посчитал частные. Соедини каждое с ответом.',
    ask: 'Нажми карточку, затем пустое место нужного выражения:',
    correct: 'Верно. 10÷2=5, 12÷3=4, 8÷4=2, 9÷3=3.',
    wrong: 'Подсказка: раздели каждое поровну. 10 на 2 — 5, 8 на 4 — 2.',
    rule: 'Деление — раздать поровну. Проверь каждое отдельно.',
  },
};
function D19_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D04_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D04_ROWS[i].val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: D04_ROWS.map((r) => r.val) }, correct, meta: { tag: 'div_match', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cols = ['#c2410c', '#B45309', '#1F7A4D', '#017CA3'];
  const bgs = [C.accSoft, '#FFF6E9', '#EAF7EF', '#E6F4FA'];
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', margin: '8px 0 14px', justifyItems: 'center' }}>
        {D04_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = cols[i], bg = bgs[i], col = cols[i];
          if (checked && v != null) { const ok = v === r.val; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <div style={{ width: 68, textAlign: 'right', ...S.mono, fontSize: 18, fontWeight: 800, color: cols[i] }}>{r.expr}</div>
              <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: C.ink3 }}>=</span>
              <div onClick={clickSlot(i)} style={{ width: 58, height: 52, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 21, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D04_CARDS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 56, height: 50, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 56, height: 50, borderRadius: 12, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 20, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D19_04(props) {
  return (<><style>{FX_CSS}</style><D19_04Impl {...props} /></>);
}
