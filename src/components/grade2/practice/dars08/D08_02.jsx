// Dars 8 · Amaliyot 02 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {DUST.map((s, i) => <span key={i} className="d08-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
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
  <div className="d08-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d08-pop { animation: d08pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d08pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d08-star { opacity: .4; animation: d08tw 3.4s ease-in-out infinite; }
        @keyframes d08tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D02_NUMS = [59, 24, 35];
const D02_T = {
  uz: {
    eyebrow: 'Rollar', setup: 'Ayirishning uch qismi: kamayuvchi − ayriluvchi = ayirma.',
    ask: 'Yorliqni bosing, keyin mos son ostiga qo‘ying.',
    roles: ['kamayuvchi', 'ayriluvchi', 'ayirma'],
    correct: "To'g'ri. 59 — kamayuvchi, 24 — ayriluvchi, 35 — ayirma.",
    wrong: "Maslahat: yuqoridagi (birinchi) son — kamayuvchi, olinadigan — ayriluvchi, natija — ayirma.",
    rule: "kamayuvchi − ayriluvchi = ayirma. 59 − 24 = 35.",
  },
  ru: {
    eyebrow: 'Роли', setup: 'Три части вычитания: уменьшаемое − вычитаемое = разность.',
    ask: 'Нажми метку, затем поставь под нужное число.',
    roles: ['уменьшаемое', 'вычитаемое', 'разность'],
    correct: 'Верно. 59 — уменьшаемое, 24 — вычитаемое, 35 — разность.',
    wrong: 'Подсказка: первое число — уменьшаемое, которое вычитают — вычитаемое, результат — разность.',
    rule: 'уменьшаемое − вычитаемое = разность. 59 − 24 = 35.',
  },
};
function D08_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null]); // per number -> role idx
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedRoles = new Set(slots.filter((x) => x != null));
  const clickSlot = (k) => { if (locked) return; if (pick != null) { setSlots((s) => { const n = s.map((v) => v === pick ? null : v); n[k] = pick; return n; }); setPick(null); } else if (slots[k] != null) { setSlots((s) => { const n = s.slice(); n[k] = null; return n; }); } };
  const check = useCallback(() => {
    const correct = slots.every((v, i) => v === i);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { map: [0, 1, 2] }, correct, meta: { tag: 'roles', level: '🟢' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const numCol = [C.mars, C.one, C.ten];
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'flex-start' }}>
          {D02_NUMS.map((n, k) => {
            const rl = slots[k];
            let bd = rl != null ? C.acc : C.stageBd, colr = C.sink;
            if (checked) { const okv = rl === k; bd = okv ? C.ok : C.no; colr = okv ? '#9df0bd' : '#ffb4a8'; }
            return (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ ...S.mono, fontSize: 40, fontWeight: 800, color: numCol[k] }}>{n}{k < 2 && <span style={{ color: C.sink2, fontSize: 26 }}>{k === 0 ? ' −' : ' ='}</span>}</div>
                <div onClick={() => clickSlot(k)} style={{ minWidth: 92, height: 40, borderRadius: 10, border: '2px ' + (rl != null ? 'solid' : 'dashed') + ' ' + bd, background: rl != null ? C.stile : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800, color: colr, cursor: locked ? 'default' : 'pointer', padding: '0 6px', textAlign: 'center' }}>{rl != null ? t.roles[rl] : '⬇'}</div>
              </div>
            );
          })}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {t.roles.map((r, i) => usedRoles.has(i)
          ? <span key={i} style={{ minWidth: 96, height: 46, borderRadius: 999, border: '2px dashed ' + C.line, background: '#fafafa' }} />
          : <button key={i} type="button" disabled={locked} onClick={() => setPick(pick === i ? null : i)} style={{ padding: '10px 16px', borderRadius: 999, border: '2px solid ' + (pick === i ? C.acc : C.line), background: pick === i ? C.accSoft : '#fff', color: C.ink, fontSize: 14, fontWeight: 800, cursor: locked ? 'default' : 'pointer', boxShadow: pick === i ? '0 0 0 4px #FFE0D6' : 'none' }}>{r}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D08_02(props) {
  return (<><style>{FX_CSS}</style><D08_02Impl {...props} /></>);
}
