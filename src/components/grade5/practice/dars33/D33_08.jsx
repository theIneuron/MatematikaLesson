// Dars33 · Amaliyot 08 — Ochilishi bo'yicha tartibla · 🔴 · tag: geo_angle_order
// To'rt burchakni kichikdan kattaga (ochilishi bo'yicha): 30° · 90° · 130° · 180°.
// Gradus yozilmagan — faqat ochilishga qarab tartiblanadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const CY = '#0891b2';
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: CY, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d33-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function Angle({ deg }) {
  const W = 88, H = 66, vx = 44, vy = 50, sideLen = 34, color = CY;
  const rad = deg * Math.PI / 180;
  const rx = vx + sideLen * Math.cos(rad), ry = vy - sideLen * Math.sin(rad);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <line x1={vx} y1={vy} x2={vx + sideLen} y2={vy} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <g className="d33-open" style={{ '--d33-a': deg + 'deg', transformOrigin: `${vx}px ${vy}px` }}>
        <line x1={vx} y1={vy} x2={rx} y2={ry} stroke={color} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx={vx} cy={vy} r="4" fill={color} />
    </svg>
  );
}

// Displey tartibi (aralash), n = ochilish darajasi
const D08_ITEMS = [{ id: 'c', deg: 130, n: 130 }, { id: 'a', deg: 30, n: 30 }, { id: 'd', deg: 180, n: 180 }, { id: 'b', deg: 90, n: 90 }];
const D08_T = {
  uz: {
    eyebrow: 'Tartibla', setup: "Sabina to'rt burchakni ochilishi bo'yicha kichikdan kattaga terib chiqmoqchi.",
    ask: 'Kichikdan kattaga bosing (eng tor ochilgan — birinchi):', reset: 'Boshidan',
    correct: "To'g'ri. Ochilish ortgani sari burchak kattalashadi.",
    wrong: "Burchak qanchalik keng ochilgan bo'lsa, shunchalik katta. Ochilishlarni bir-biri bilan solishtiring.",
    rule: "Ko'proq ochilish — katta burchak.",
  },
  ru: {
    eyebrow: 'Упорядочи', setup: 'Сабина хочет расставить четыре угла по раствору от меньшего к большему.',
    ask: 'Нажимай от меньшего к большему (самый узкий — первым):', reset: 'Сначала',
    correct: 'Верно. Чем больше раствор, тем больше угол.',
    wrong: 'Чем шире раскрыт угол, тем он больше. Сравни растворы углов между собой.',
    rule: 'Больше раствор — больше угол.',
  },
};

export default function D33_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [seq, setSeq] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.seq) { setSeq(sa.seq); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(seq.length === 4 && !checked); }, [seq, checked, onReady]);
  const locked = isReview || checked;
  const tap = (id) => { if (locked || seq.includes(id)) return; setSeq((s) => [...s, id]); };
  const check = useCallback(() => {
    const ns = seq.map((id) => D08_ITEMS.find((x) => x.id === id).n);
    const correct = ns.every((v, i) => i === 0 || ns[i - 1] < v);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { seq }, correctAnswer: { seq: ['a', 'b', 'c', 'd'] }, correct, meta: { tag: 'geo_angle_order', level: '🔴' } });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d33-open { animation: d33open .9s ease both; }
        @keyframes d33open { from { transform: rotate(var(--d33-a)); } to { transform: rotate(0deg); } }
        @media (prefers-reduced-motion: reduce) { .d33-pop, .d33-open { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '12px 0' }}>
        {D08_ITEMS.map((it) => {
          const order = seq.indexOf(it.id);
          const on = order >= 0;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = CY; bg = '#ecfeff'; }
          if (checked && on) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={it.id} type="button" disabled={locked || on} onClick={() => tap(it.id)} style={{ position: 'relative', width: 96, height: 74, borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (locked || on) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Angle deg={it.deg} />
              {on && <span style={{ position: 'absolute', top: -10, left: -10, width: 26, height: 26, borderRadius: '50%', background: CY, color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>{order + 1}</span>}
            </button>
          );
        })}
      </div>
      {!checked && seq.length > 0 && !isReview && (
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={() => setSeq([])} style={{ padding: '6px 14px', borderRadius: 999, border: '1.5px solid #d6dae3', background: '#fff', color: '#64748b', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t.reset}</button>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
