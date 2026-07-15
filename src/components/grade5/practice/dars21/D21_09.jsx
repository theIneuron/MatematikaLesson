// Dars21 · Amaliyot 09 — Aralash sonni tuz · 🟡 · tag: build_mixed
// Rasm: 2 to'la to'rtdan + 3/4 → 2¾. Chiplarni bosib butun/surat/maxrajni tuzadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d21-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
function FourBar({ shaded, color = '#34d399', w = 96, h = 30 }) {
  const cw = w / 4;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="1" y="1" width={Math.max(0, (w * shaded) / 4 - 1)} height={h - 2} rx="4" fill={color} />
      {Array.from({ length: 3 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="1" x2={(i + 1) * cw} y2={h - 1} stroke="#fff" strokeWidth="2" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

const D09 = { w: 2, n: 3, d: 4 };
const D09_ORDER = ['w', 'n', 'd'];
const D09_CHIPS = [1, 2, 3, 4, 5, 6];
const D09_T = {
  uz: {
    eyebrow: 'Aralash sonni tuz', setup: "Nilufar bir xil tortlarni to'rtta teng bo'lakka bo'ldi. Rasmda unga tegishli tort bo'laklari ko'rsatilgan.",
    ask: "Rasmdagi miqdorni aralash son ko'rinishida tuzing (chiplarni bosing):",
    lw: 'Butun', lf: 'Kasr',
    correct: "To'g'ri. Ikki to'la tort va yana 3 ta to'rtdan bo'lak — bu 2 va 3/4.",
    wrong: "Aralash sonda butun qism nimani, kasr qism nimani bildiradi? Rasmda to'la va to'liqsiz tortlarni ajrating.",
    rule: "Aralash son = butun qism + kasr qism: 2 to'la va 3/4 = 2 va 3/4.",
  },
  ru: {
    eyebrow: 'Собери смешанное', setup: 'Нилуфар разделила одинаковые торты на четыре равные части. На рисунке показаны доставшиеся ей куски.',
    ask: 'Собери показанное количество в виде смешанного числа (нажимай фишки):',
    lw: 'Целое', lf: 'Дробь',
    correct: 'Верно. Два целых торта и ещё 3 четверти — это 2 и 3/4.',
    wrong: 'Что показывает целая часть смешанного числа, а что — дробная? Раздели на рисунке полные и неполные торты.',
    rule: 'Смешанное число = целая часть + дробная: 2 целых и 3/4 = 2 и 3/4.',
  },
};

export default function D21_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [vals, setVals] = useState({ w: null, n: null, d: null });
  const [active, setActive] = useState('w');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s?.vals) { setVals(s.vals); setActive(null); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = vals.w != null && vals.n != null && vals.d != null;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const fillChip = (v) => {
    if (locked || active == null) return;
    const nv = { ...vals, [active]: v };
    setVals(nv);
    const nextEmpty = D09_ORDER.find((k) => nv[k] == null);
    setActive(nextEmpty || null);
  };
  const tapSlot = (k) => { if (locked) return; setVals((m) => ({ ...m, [k]: null })); setActive(k); };
  const check = useCallback(() => {
    const correct = vals.w === D09.w && vals.n === D09.n && vals.d === D09.d;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { vals }, correctAnswer: D09, correct, meta: { tag: 'build_mixed', level: '🟡' } });
  }, [vals, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slotStyle = (k) => {
    const filled = vals[k] != null;
    let bd = active === k ? '#2563eb' : filled ? '#94a3b8' : '#cbd5e1';
    if (checked && filled) bd = fb?.correct ? '#1a7f43' : '#c0392b'; // to'liq to'g'ri bo'lmasa — barcha to'ldirilgan katak qizil
    return { width: 46, height: 44, borderRadius: 10, border: '2px solid ' + bd, background: active === k && !checked ? '#eff6ff' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', boxShadow: active === k && !checked ? '0 0 0 4px #dbeafe' : 'none' };
  };
  const slotTxt = (k) => (vals[k] != null ? <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>{vals[k]}</span> : <span style={{ fontSize: 20, color: '#c0c7d2', fontWeight: 800 }}>?</span>);
  return (
    <div style={S.wrap}>
      <style>{`
        .d21-pop { animation: d21pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d21pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d21-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0 6px', alignItems: 'center', justifyContent: 'center' }}>
        <FourBar shaded={4} /><FourBar shaded={4} /><FourBar shaded={3} color="#6ee7b7" />
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      {/* tuzuvchi slotlar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '4px 0 10px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>{t.lw}</div>
          <div onClick={() => tapSlot('w')} style={{ ...slotStyle('w'), width: 50, height: 50 }}>{slotTxt('w')}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>{t.lf}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div onClick={() => tapSlot('n')} style={slotStyle('n')}>{slotTxt('n')}</div>
            <div style={{ width: 48, height: 3, background: '#1f2430' }} />
            <div onClick={() => tapSlot('d')} style={slotStyle('d')}>{slotTxt('d')}</div>
          </div>
        </div>
      </div>
      {/* chiplar */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D09_CHIPS.map((v) => (
          <button key={v} type="button" disabled={locked || active == null} onClick={() => fillChip(v)} style={{ width: 46, height: 44, borderRadius: 11, border: '2px solid #cbd5e1', background: (locked || active == null) ? '#f1f5f9' : '#fff', color: '#1f2430', fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", cursor: (locked || active == null) ? 'default' : 'pointer' }}>{v}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
