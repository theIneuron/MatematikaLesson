// Dars30 · Amaliyot 08 — Qaysida ko'proq · 🔴 · tag: pct_relative
// Telefon 50% (butun 4000 mAh) va powerbank 50% (butun 10000 mAh). Qaysida ko'proq mAh? → Powerbank.
// NAQSH A: chizma (tasmalar) faqat to'g'ri javobdan keyin ochiladi, savol tepada. Eyebrow pill: green.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#15803d', l: '#f0fdf4', m: '#bbf7d0', fill: '#4ade80' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.d, background: C.l, border: '1px solid ' + C.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Sig'im tasmasi: umumiy uzunlik = full (butun nisbati), yarmi (50%) bo'yalgan
function CapBar({ full, mah, color, label, labelCol }) {
  const W = 260, h = 40;
  const bw = (W - 4) * full;
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: labelCol, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} style={{ display: 'block', maxWidth: '100%' }}>
          <rect x="1" y="1" width={bw + 2} height={h - 2} rx="6" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect className="d30-bar" x="2" y="2" width={bw / 2} height={h - 4} rx="5" fill={color} />
          <line x1={2 + bw / 2} y1="1" x2={2 + bw / 2} y2={h - 1} stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
        <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#1a7f43', whiteSpace: 'nowrap' }}>{mah}</span>
      </div>
    </div>
  );
}

const D08_CORRECT = 0; // Powerbank
const D08_T = {
  uz: {
    eyebrow: 'Foiz nisbiy', setup: "Rustam telefoni 50% zaryadda (butun 4000 mAh), powerbank ham 50% zaryadda (butun 10000 mAh).",
    ask: "Qaysida KO'PROQ mAh bor?",
    opts: ['Powerbankda', 'Telefonda', 'Teng'],
    phone: 'Telefon 50%', pbank: 'Powerbank 50%', phoneMah: '2000 mAh', pbankMah: '5000 mAh',
    correct: "To'g'ri. Foiz teng, lekin butunlar har xil: 50% dan 10000 = 5000 > 50% dan 4000 = 2000.",
    wrong: "Foiz bir xil, lekin butunlar (sig'imlar) har xil. Har birida 50% qancha mAh beradi — butuniga qarab solishtiring.",
    rule: "Foiz o'z butuniga nisbatan — bir xil % har xil miqdor bo'lishi mumkin.",
  },
  ru: {
    eyebrow: 'Процент относителен', setup: 'Телефон Рустама заряжен на 50% (всего 4000 мА·ч), повербанк тоже на 50% (всего 10000 мА·ч).',
    ask: 'Где БОЛЬШЕ мА·ч?',
    opts: ['В повербанке', 'В телефоне', 'Поровну'],
    phone: 'Телефон 50%', pbank: 'Повербанк 50%', phoneMah: '2000 мА·ч', pbankMah: '5000 мА·ч',
    correct: 'Верно. Проценты равны, но целые разные: 50% от 10000 = 5000 > 50% от 4000 = 2000.',
    wrong: 'Проценты равны, но целые (ёмкости) разные. Прикинь, сколько мА·ч даёт 50% у каждого, и сравни.',
    rule: 'Процент — доля от своего целого: одинаковый % может дать разную величину.',
  },
};

export default function D30_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D08_CORRECT }, correct, meta: { tag: 'pct_relative', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d30-drop { animation: d30drop .5s ease both; }
        @keyframes d30drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .d30-bar { animation: d30bar .8s ease both; transform-origin: left center; }
        @keyframes d30bar { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .d30-pop, .d30-drop, .d30-bar { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d30-pop" style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0 12px', padding: '12px', borderRadius: 14, background: C.l, border: '1.5px solid ' + C.m }}>
          <CapBar full={0.4} mah={t.phoneMah} color="#22d3ee" label={t.phone} labelCol="#0891b2" />
          <CapBar full={1} mah={t.pbankMah} color={C.fill} label={t.pbank} labelCol={C.d} />
        </div>
      )}
      <p className={revealed ? 'd30-drop' : ''} style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div className={revealed ? 'd30-drop' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = C.d; bg = C.l; col = '#1f2430'; }
          if (checked && on) { const ok = i === D08_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
