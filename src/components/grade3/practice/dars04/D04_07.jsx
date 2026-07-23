// Dars 4 (3-sinf) · Amaliyot 07 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 79-bet 1-mashq sonlari (267, 348, 523) — o'sish tartibida saralash.
// Mexanika: karta-slot — kartani bosganda birinchi bo'sh slotga tushadi; slotni bosganda qaytadi.
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
      {STARS.map((s, i) => <span key={i} className="g3d4-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
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
  <div className="g3d4-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d4-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.g3d4-pop { animation: g3d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d4-star { opacity: .3; animation: g3d4tw 3.4s ease-in-out infinite; }
@keyframes g3d4tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d4-drop { animation: g3d4drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d4drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 07 · O'sish tartibida (267, 348, 523) · 🟡 · sort_asc =================== */
const D07_CARDS = [348, 523, 267]; // aralash tartibda ko'rsatiladi
const D07_ANS = [267, 348, 523];
const D07_T = {
  uz: {
    eyebrow: 'Tartibga soling', setup: "Uchta son berilgan. Ularni KICHIGIDAN KATTASIGA qarab joylashtiring.",
    ask: "Kartalarni o'sish tartibida bosing: avval eng kichigi.",
    slots: "O'sish tartibi:", tray: 'Kartalar:',
    correct: "To'g'ri! 267 < 348 < 523: yuzliklar 2 < 3 < 5.",
    wrong: "Maslahat: avval har sonning yuzligiga qarang: 2, 3 va 5 yuzlik. Eng kichik yuzlikdan boshlang.",
    rule: "O'sish tartibi — kichikdan kattaga: 267, 348, 523.",
  },
  ru: {
    eyebrow: 'Расставь по порядку', setup: 'Даны три числа. Расставь их ОТ МЕНЬШЕГО К БОЛЬШЕМУ.',
    ask: 'Нажимай карточки по возрастанию: сначала самое маленькое.',
    slots: 'По возрастанию:', tray: 'Карточки:',
    correct: 'Верно! 267 < 348 < 523: сотни 2 < 3 < 5.',
    wrong: 'Подсказка: сначала посмотри на сотни каждого числа: 2, 3 и 5 сотен. Начни с наименьших сотен.',
    rule: 'Порядок возрастания — от меньшего к большему: 267, 348, 523.',
  },
};
function D04_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (Array.isArray(sa?.slots)) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((s) => s != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = slots.every((v, i) => v === D07_ANS[i]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_CARDS.map(String), studentAnswer: { slots }, correctAnswer: { slots: D07_ANS }, correct, meta: { tag: 'sort_asc', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const inTray = D07_CARDS.filter((v) => !slots.includes(v));
  const putCard = (v) => { if (locked) return; setSlots((sl) => { const i = sl.indexOf(null); if (i === -1) return sl; const n = [...sl]; n[i] = v; return n; }); };
  const popSlot = (i) => { if (locked) return; setSlots((sl) => { const n = [...sl]; n[i] = null; return n; }); };
  const slotRing = (i) => { if (!checked) return 'none'; const ok = slots[i] === D07_ANS[i]; return '0 0 0 2.5px ' + (ok ? C.ok : C.no); };
  const cardStyle = { minWidth: 84, height: 58, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, color: C.ink, ...S.mono, fontSize: 22, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center', marginBottom: 6, color: C.sink2, fontSize: 13, fontWeight: 700 }}>{t.slots}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          {slots.map((v, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ ...S.mono, fontSize: 22, color: C.sink2, fontWeight: 800 }}>&lt;</span>}
              <button type="button" onClick={() => popSlot(i)} disabled={locked || v == null}
                style={{ minWidth: 90, height: 64, borderRadius: 12, background: v != null ? '#152342' : 'rgba(255,255,255,.05)', border: v != null ? '1.5px solid ' + C.ribbonBd : '2px dashed ' + C.stageBd, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: C.glow, textShadow: v != null ? '0 0 12px rgba(255,184,77,.8)' : 'none', cursor: (locked || v == null) ? 'default' : 'pointer', boxShadow: slotRing(i) }}>
                {v != null ? v : ''}
              </button>
            </React.Fragment>
          ))}
        </div>
      </Stage>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0', minHeight: 62 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.ink2 }}>{t.tray}</span>
        {inTray.map((v) => (
          <button key={v} type="button" className="g3d4-drop" disabled={locked} onClick={() => putCard(v)} style={cardStyle}>{v}</button>
        ))}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_07(props) {
  return (<><style>{FX_CSS}</style><D04_07Impl {...props} /></>);
}
