// Dars 2 (3-sinf) · Amaliyot 08 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 15-bet kombinatorika 1-mashq — 9, 0, 4 raqamlaridan uch xonali son yasash.
// Mexanika: karta-slot — kartani bosganda birinchi bo'sh slotga tushadi; slotni bosganda qaytadi.
// Tuzoq: 0 birinchi o'rinda turolmaydi; eng katta son uchun raqamlar kamayish tartibida.
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Lumo — Bit shahri) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 24%, #4a2342 0%, #261335 58%, #130b23 100%)',
  stageBd: '#4A2A48', sink: '#F3E9F2', sink2: '#C9A9C6', stile: '#2a1530',
  glow: '#FFB84D', glowDk: '#E67E22', ribbon: '#1B2A4A', ribbonBd: '#3A4E78',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="g3d2-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 17, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 18.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="g3d2-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d2-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.g3d2-pop { animation: g3d2pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d2pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d2-star { opacity: .3; animation: g3d2tw 3.4s ease-in-out infinite; }
@keyframes g3d2tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d2-drop { animation: g3d2drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d2drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 08 · Eng katta son yasang (9,0,4 → 940) · 🔴 · digits_max =================== */
const D08_DIGITS = [9, 0, 4];
const D08_ANS = '940';
const D08_T = {
  uz: {
    eyebrow: 'Kombinatorika', setup: "Uchta raqam-karta berilgan: 9, 0 va 4. Ulardan uch xonali sonlar yasash mumkin.",
    ask: 'Shu kartalardan ENG KATTA uch xonali sonni yasang.',
    tray: 'Kartalar:', slots: 'Son:',
    correct: "To'g'ri! Eng katta son — 940: eng katta raqam yuzlikka, keyingisi o'nlikka.",
    wrong: "Maslahat: son katta bo'lishi uchun ENG KATTA raqam eng qimmat joyga — yuzlikka turishi kerak. Nol birinchi o'rinda turolmaydi.",
    rule: "Raqamlarni kamayish tartibida teramiz: 9, 4, 0 → 940.",
  },
  ru: {
    eyebrow: 'Комбинаторика', setup: 'Даны три карточки с цифрами: 9, 0 и 4. Из них можно составлять трёхзначные числа.',
    ask: 'Составь из этих карточек САМОЕ БОЛЬШОЕ трёхзначное число.',
    tray: 'Карточки:', slots: 'Число:',
    correct: 'Верно! Самое большое число — 940: самая большая цифра — в сотни, следующая — в десятки.',
    wrong: 'Подсказка: чтобы число было большим, САМАЯ БОЛЬШАЯ цифра должна стоять на самом дорогом месте — в сотнях. Ноль не может стоять первым.',
    rule: 'Цифры ставим по убыванию: 9, 4, 0 → 940.',
  },
};
function D02_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (Array.isArray(sa?.slots)) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((s) => s != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const made = slots.map((s) => (s == null ? '' : String(s))).join('');
  const check = useCallback(() => {
    const correct = made === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots, value: made }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'digits_max', level: '🔴' } });
  }, [made, slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const inTray = D08_DIGITS.filter((d) => !slots.includes(d));
  const putCard = (d) => { if (locked) return; setSlots((sl) => { const i = sl.indexOf(null); if (i === -1) return sl; const n = [...sl]; n[i] = d; return n; }); };
  const popSlot = (i) => { if (locked) return; setSlots((sl) => { const n = [...sl]; n[i] = null; return n; }); };
  const cardStyle = { width: 58, height: 58, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, color: C.ink, ...S.mono, fontSize: 26, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  const slotStyle = (i) => ({
    width: 62, height: 70, borderRadius: 12, background: slots[i] != null ? '#152342' : 'rgba(255,255,255,.05)',
    border: slots[i] != null ? '1.5px solid ' + C.ribbonBd : '2px dashed ' + C.stageBd,
    display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 34, fontWeight: 800,
    color: C.glow, textShadow: slots[i] != null ? '0 0 12px rgba(255,184,77,.8)' : 'none',
    cursor: (locked || slots[i] == null) ? 'default' : 'pointer',
    boxShadow: checked ? '0 0 0 2.5px ' + (fb?.correct ? C.ok : C.no) : 'none',
  });
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center', marginBottom: 6, color: C.sink2, fontSize: 13, fontWeight: 700 }}>{t.slots}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {slots.map((s, i) => (
            <button key={i} type="button" style={slotStyle(i)} onClick={() => popSlot(i)} disabled={locked || slots[i] == null}>
              {s != null ? s : ''}
            </button>
          ))}
        </div>
      </Stage>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0', minHeight: 62 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.ink2 }}>{t.tray}</span>
        {inTray.map((d) => (
          <button key={d} type="button" className="g3d2-drop" disabled={locked} onClick={() => putCard(d)} style={cardStyle}>{d}</button>
        ))}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_08(props) {
  return (<><style>{FX_CSS}</style><D02_08Impl {...props} /></>);
}
