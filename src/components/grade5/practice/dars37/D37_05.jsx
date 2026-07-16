// Dars37 · Amaliyot 05 — Birliklarni moslash · 🟡 · tag: vol_units
// sm→uzunlik(1 o'lcham), sm²→yuza(2 o'lcham), sm³→hajm(3 o'lcham), litr→suyuqlik hajmi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#e24e12', background: '#fff4ee', border: '1px solid #ffd6bd', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d37-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// O'lcham narvoni: chiziq (sm), to'r (sm²), kub (sm³) + idish (litr) — darajaning ma'nosi
function DimStrip() {
  const B = '#fb7233', D = '#e24e12', L = '#ffd6bd', T = '#ffe7d8';
  return (
    <svg width="300" height="72" viewBox="0 0 300 72" style={{ display: 'block', maxWidth: '100%' }}>
      {/* sm — chiziq */}
      <line x1="12" y1="46" x2="52" y2="46" stroke={D} strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="42" x2="12" y2="50" stroke={D} strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="42" x2="52" y2="50" stroke={D} strokeWidth="3" strokeLinecap="round" />
      <text x="32" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill={D} fontFamily="'JetBrains Mono', monospace">sm</text>
      {/* sm² — to'r 2×2 */}
      {[0, 1].map((i) => [0, 1].map((j) => <rect key={i + '' + j} x={86 + i * 16} y={26 + j * 16} width="15" height="15" rx="2" fill={T} stroke={D} strokeWidth="1.3" />))}
      <text x="102" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill={D} fontFamily="'JetBrains Mono', monospace">sm²</text>
      {/* sm³ — kub */}
      <g transform="translate(158,20)">
        <polygon points="6,10 22,10 30,2 14,2" fill={T} stroke={D} strokeWidth="1.3" strokeLinejoin="round" />
        <polygon points="22,10 30,2 30,20 22,28" fill={B} stroke={D} strokeWidth="1.3" strokeLinejoin="round" />
        <polygon points="6,10 22,10 22,28 6,28" fill={L} stroke={D} strokeWidth="1.3" strokeLinejoin="round" />
      </g>
      <text x="180" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill={D} fontFamily="'JetBrains Mono', monospace">sm³</text>
      {/* litr — idish */}
      <g transform="translate(238,18)">
        <path d="M4 2 L28 2 L25 34 Q24 40 18 40 L14 40 Q8 40 7 34 Z" fill="#fff" stroke={D} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 22 L25 22 L24 34 Q23.5 38 18 38 L14 38 Q8.5 38 8 34 Z" fill={B} />
      </g>
      <text x="254" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill={D} fontFamily="'JetBrains Mono', monospace">litr</text>
    </svg>
  );
}

// left keys: units; correct value = right label key
const D05_UNITS = ['sm', 'sm²', 'sm³', 'litr'];
const D05_RIGHT_ORDER = ['hajm', 'uzunlik', 'suyuqlik', 'yuza']; // aralashtirilgan ko'rsatilish
const D05_PAIRS = { sm: 'uzunlik', 'sm²': 'yuza', 'sm³': 'hajm', litr: 'suyuqlik' };
const D05_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Kamol birliklarni nimani o'lchashiga qarab ajratmoqchi. Har birlikni to'g'ri ta'rifiga ulang.",
    ask: "Chapdan birlikni tanlang, keyin o'ngdan mos ta'rifini bosing:",
    labels: { uzunlik: 'uzunlik', yuza: 'yuza', hajm: 'hajm', suyuqlik: 'suyuqlik hajmi' },
    correct: "To'g'ri. O'lcham soni ortsa, daraja ham ortadi: sm, sm², sm³.",
    wrong: "Birlikdagi daraja o'lcham sonini bildiradi: darajasiz — bitta o'lcham, kvadrat — ikkita, kub — uchta. Litr esa quyiladigan narsani o'lchaydi. Shu qoida bilan moslang.",
    rule: "sm = uzunlik, sm² = yuza, sm³ = hajm.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Камол хочет разложить единицы по тому, что они измеряют. Соедини каждую единицу с верным описанием.',
    ask: 'Выберите единицу слева, затем нажмите верное описание справа:',
    labels: { uzunlik: 'длина', yuza: 'площадь', hajm: 'объём', suyuqlik: 'объём жидкости' },
    correct: 'Верно. Чем больше измерений, тем выше степень: см, см², см³.',
    wrong: 'Степень единицы показывает число измерений: без степени — одно, квадрат — два, куб — три. А литр измеряет то, что наливают. Соотнеси по этому правилу.',
    rule: 'см = длина, см² = площадь, см³ = объём.',
  },
};

export default function D37_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === D05_UNITS.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = D05_UNITS.every((l) => map[l] === D05_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D05_PAIRS, correct, meta: { tag: 'vol_units', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 8px' }}>
        <DimStrip />
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {D05_UNITS.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = '#fe5b1a'; bg = '#fff4ee'; }
            if (done) { bd = '#ffb488'; bg = '#fff5ef'; }
            if (checked && done) { bd = fb?.correct ? '#1a7f43' : '#c0392b'; bg = fb?.correct ? '#e8f7ee' : '#fdecec'; }
            return <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ width: 88, height: 50, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #ffe7d8' : 'none', ...S.mono, fontSize: 20, fontWeight: 800, color: '#1f2430', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{l}{done ? <span style={{ fontSize: 15, color: '#94a3b8' }}>→</span> : null}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {D05_RIGHT_ORDER.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; }
            if (checked && used) { bd = fb?.correct ? '#1a7f43' : '#c0392b'; bg = fb?.correct ? '#e8f7ee' : '#fdecec'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ minWidth: 132, height: 50, padding: '0 12px', borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, color: '#1f2430' }}>{t.labels[r]}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
