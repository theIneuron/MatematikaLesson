// Dars 4 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d04-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d04-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d04-pop { animation: d04pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d04pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d04-star { opacity: .35; animation: d04tw 3.2s ease-in-out infinite; }
        @keyframes d04tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d04-float { animation: d04float 3.4s ease-in-out infinite; }
        @keyframes d04float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_SIGNS = ['<', '=', '>'];
const D05_OK = [0, 2]; // 27 < 54 , 54 > 40
const D05_T = {
  uz: {
    eyebrow: 'Belgi zanjiri', setup: 'Uch kod: 27, 54, 40. Ular orasiga belgi qo‘yiladi.',
    ask: 'Pastdagi belgini bosing, keyin uni bo‘sh joyga qo‘ying.',
    correct: "To'g'ri. 27 < 54 va 54 > 40.",
    wrong: "Maslahat: har juftni alohida, chapdan o‘ngga solishtiring. Belgi kattaga qaraydi.",
    rule: "Har juftni alohida solishtiring: 27 < 54, 54 > 40.",
  },
  ru: {
    eyebrow: 'Цепочка знаков', setup: 'Три кода: 27, 54, 40. Между ними ставят знаки.',
    ask: 'Нажми знак внизу, затем поставь его в пустое место.',
    correct: 'Верно. 27 < 54 и 54 > 40.',
    wrong: 'Подсказка: сравнивай каждую пару отдельно, слева направо. Знак смотрит на большее.',
    rule: 'Сравни каждую пару отдельно: 27 < 54, 54 > 40.',
  },
};
function D04_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickSlot = (i) => { if (locked) return; if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = pick; return n; }); setPick(null); } else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); } };
  const check = useCallback(() => {
    const correct = slots[0] === D05_OK[0] && slots[1] === D05_OK[1];
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D05_SIGNS.map((s, i) => ({ id: String(i), label: s })), studentAnswer: { signs: slots.map((x) => x == null ? null : D05_SIGNS[x]) }, correctAnswer: { signs: ['<', '>'] }, correct, meta: { tag: 'signchain', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const signSlot = (i) => {
    const v = slots[i];
    let bd = v != null ? C.acc : C.sink2, col = C.sink;
    if (checked) { const ok = v === D05_OK[i]; bd = ok ? C.ok : C.no; col = ok ? '#8ff0bd' : '#ffb4a8'; }
    return <button key={i} type="button" disabled={locked} onClick={() => clickSlot(i)} style={{ width: 54, height: 62, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: C.stile, ...S.mono, fontSize: 32, fontWeight: 800, color: col, cursor: locked ? 'default' : 'pointer' }}>{v != null ? D05_SIGNS[v] : '?'}</button>;
  };
  const num = (n, c) => <span style={{ ...S.mono, fontSize: 40, fontWeight: 800, color: c }}>{n}</span>;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {num(27, C.ten)}{signSlot(0)}{num(54, C.one)}{signSlot(1)}{num(40, C.ten)}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
        {D05_SIGNS.map((sgn, i) => (
          <button key={i} type="button" disabled={locked} onClick={() => setPick(pick === i ? null : i)}
            style={{ width: 64, height: 60, borderRadius: 14, border: '2px solid ' + (pick === i ? C.acc : C.line), background: pick === i ? C.accSoft : C.paper, ...S.mono, fontSize: 34, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: pick === i ? '0 0 0 4px #FFE0D6' : 'none' }}>{sgn}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_05(props) {
  return (<><style>{FX_CSS}</style><D04_05Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D04_05.audio = {
  uz: { intro: "Uch kod. 27, 54, 40. Ular orasiga belgi qo'yiladi. Pastdagi belgini bosing, keyin uni bo'sh joyga qo'ying.", on_correct: "To'g'ri. 27 kichik 54 va 54 katta 40.", on_wrong: "Maslahat. Har juftni alohida, chapdan o'ngga solishtiring. Belgi kattaga qaraydi." },
  ru: { intro: "Три кода. 27, 54, 40. Между ними ставят знаки. Нажми знак внизу, затем поставь его в пустое место.", on_correct: "Верно. 27 меньше 54 и 54 больше 40.", on_wrong: "Подсказка. Сравнивай каждую пару отдельно, слева направо. Знак смотрит на большее." },
};
