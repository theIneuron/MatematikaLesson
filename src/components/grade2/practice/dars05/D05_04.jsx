// Dars 5 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d05-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d05-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const Chip = ({ children, on, tone, onClick, disabled, w = 62 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d05-pop { animation: d05pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d05pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d05-star { opacity: .35; animation: d05tw 3.2s ease-in-out infinite; }
        @keyframes d05tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D04_SEQ = [90, 80, null, 60, null], D04_BANK = [70, 50, 65, 55, 40], D04_OK = [70, 50];
const D04_T = {
  uz: {
    eyebrow: 'Teskari', setup: 'Orqaga o‘nlab sanaymiz — har qadam 10 ga kamayadi.',
    ask: 'Plitkani bosing, keyin bo‘sh joyni bosing. Ikkalasini to‘ldiring.',
    correct: "To'g'ri. 90, 80, 70, 60, 50 — orqaga o'nlab.",
    wrong: "Maslahat: orqaga o'nlab — har safar 10 ga kamayadi. 80 dan keyin?",
    rule: "Orqaga o'nlab sanash: 90, 80, 70, 60, 50 (har qadam −10).",
  },
  ru: {
    eyebrow: 'Обратно', setup: 'Считаем назад десятками — каждый шаг −10.',
    ask: 'Нажми плитку, затем пустое место. Заполни обе.',
    correct: 'Верно. 90, 80, 70, 60, 50 — назад десятками.',
    wrong: 'Подсказка: назад десятками — каждый раз −10. Что после 80?',
    rule: 'Счёт назад десятками: 90, 80, 70, 60, 50 (каждый шаг −10).',
  },
};
function D05_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const gaps = D04_SEQ.map((n, i) => n == null ? i : -1).filter((x) => x >= 0); // positions of gaps
  const [slots, setSlots] = useState([null, null]); // slots[k] -> bank index for gap k
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter((x) => x != null));
  const clickGap = (k) => { if (locked) return; if (pick != null) { setSlots((s) => { const n = s.slice(); n[k] = pick; return n; }); setPick(null); } else if (slots[k] != null) { setSlots((s) => { const n = s.slice(); n[k] = null; return n; }); } };
  const check = useCallback(() => {
    const vals = slots.map((bi) => bi == null ? null : D04_BANK[bi]);
    const correct = vals[0] === D04_OK[0] && vals[1] === D04_OK[1];
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { vals }, correctAnswer: { vals: D04_OK }, correct, meta: { tag: 'descfill', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  let gk = -1;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {D04_SEQ.map((n, i) => {
            if (n != null) return <span key={i} style={{ minWidth: 56, height: 58, borderRadius: 12, background: C.stile, border: '1px solid ' + C.stageBd, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 25, fontWeight: 800, color: C.sink }}>{n}</span>;
            gk += 1; const k = gk; const bi = slots[k]; const v = bi == null ? null : D04_BANK[bi];
            let bd = v != null ? C.acc : C.sink2, col = C.sink;
            if (checked) { const ok = v === D04_OK[k]; bd = ok ? C.ok : C.no; col = ok ? '#8ff0bd' : '#ffb4a8'; }
            return <span key={i} onClick={() => clickGap(k)} style={{ minWidth: 56, height: 58, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: C.stile, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 25, fontWeight: 800, color: col, cursor: locked ? 'default' : 'pointer' }}>{v != null ? v : '?'}</span>;
          })}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 18 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D04_BANK.map((n, i) => usedSet.has(i)
          ? <span key={i} style={{ minWidth: 60, height: 54, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />
          : <Chip key={i} on={pick === i} disabled={locked} onClick={() => setPick(pick === i ? null : i)} w={60}>{n}</Chip>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_04(props) {
  return (<><style>{FX_CSS}</style><D05_04Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D05_04.audio = {
  uz: { intro: "Orqaga o'nlab sanaymiz, har qadam 10 ga kamayadi. Plitkani bosing, keyin bo'sh joyni bosing. Ikkalasini to'ldiring.", on_correct: "To'g'ri. 90, 80, 70, 60, 50, orqaga o'nlab.", on_wrong: "Maslahat. Orqaga o'nlab, har safar 10 ga kamayadi. 80 dan keyin?" },
  ru: { intro: "Считаем назад десятками, каждый шаг минус 10. Нажми плитку, затем пустое место. Заполни обе.", on_correct: "Верно. 90, 80, 70, 60, 50, назад десятками.", on_wrong: "Подсказка. Назад десятками, каждый раз минус 10. Что после 80?" },
};
