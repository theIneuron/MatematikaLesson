// Dars 17 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D05_ROWS = [{ expr: '8 × 2', val: 16 }, { expr: '9 × 2', val: 18 }, { expr: '8 × 4', val: 32 }, { expr: '9 × 3', val: 27 }];
const D05_CARDS = [16, 32, 18, 27, 24, 36];
const D05_T = {
  uz: {
    eyebrow: 'Moslash', setup: "Bit ko'paytmalarni hisobladi. Har birini javobiga ulang.",
    ask: 'Kartani bosing, keyin mos ifodaning bo‘sh joyini bosing:',
    correct: "To'g'ri. 8×2=16, 9×2=18, 8×4=32, 9×3=27.",
    wrong: "Maslahat: har birini alohida sanang. 8×4 — 8,16,24,32. 9×3 — 9,18,27.",
    rule: "×8 va ×9 — har xil jadval. Har ifodani o'z jadvalidan sanang.",
  },
  ru: {
    eyebrow: 'Соответствие', setup: 'Бит посчитал произведения. Соедини каждое с ответом.',
    ask: 'Нажми карточку, затем пустое место нужного выражения:',
    correct: 'Верно. 8×2=16, 9×2=18, 8×4=32, 9×3=27.',
    wrong: 'Подсказка: считай каждое отдельно. 8×4 — 8,16,24,32. 9×3 — 9,18,27.',
    rule: '×8 и ×9 — разные таблицы. Считай каждое по своей таблице.',
  },
};
function D17_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
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
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D05_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D05_ROWS[i].val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: D05_ROWS.map((r) => r.val) }, correct, meta: { tag: 'mul_match89', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cols = ['#c2410c', '#017CA3', '#1F7A4D', '#B45309'];
  const bgs = [C.accSoft, '#E6F4FA', '#EAF7EF', '#FFF6E9'];
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', margin: '8px 0 14px', justifyItems: 'center' }}>
        {D05_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = cols[i], bg = bgs[i], col = cols[i];
          if (checked && v != null) { const ok = v === r.val; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <div style={{ width: 62, textAlign: 'right', ...S.mono, fontSize: 19, fontWeight: 800, color: cols[i] }}>{r.expr}</div>
              <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: C.ink3 }}>=</span>
              <div onClick={clickSlot(i)} style={{ width: 62, height: 52, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 21, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D05_CARDS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 60, height: 50, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 60, height: 50, borderRadius: 12, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 20, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D17_05(props) {
  return (<><style>{FX_CSS}</style><D17_05Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D17_05.audio = {
  uz: { intro: "Bit ko'paytmalarni hisobladi. Har birini javobiga ulang. Kartani bosing, keyin mos ifodaning bo'sh joyini bosing.", on_correct: "To'g'ri. 8 ko'paytirish 2 teng 16, 9 ko'paytirish 2 teng 18, 8 ko'paytirish 4 teng 32, 9 ko'paytirish 3 teng 27.", on_wrong: "Maslahat. Har birini alohida sanang. 8 ko'paytirish 4, 8,16,24,32. 9 ko'paytirish 3, 9,18,27." },
  ru: { intro: "Бит посчитал произведения. Соедини каждое с ответом. Нажми карточку, затем пустое место нужного выражения.", on_correct: "Верно. 8 умножить на 2 равно 16, 9 умножить на 2 равно 18, 8 умножить на 4 равно 32, 9 умножить на 3 равно 27.", on_wrong: "Подсказка. Считай каждое отдельно. 8 умножить на 4, 8,16,24,32. 9 умножить на 3, 9,18,27." },
};
