// Dars16 · Amaliyot 03 (poz. 7) — Tug'ilgan kun torti · 🟡 · tag: cake_equal
// Sanjar 2/8, Javohir 2/16(=1/8), Umid 3/24(=1/8). Bir xil maxrajga (8) keltirib solishtiriladi.
// Sanjar 2/8, boshqalari 1/8 dan — teng emas. Javob: Yo'q. Tort 8 bo'lakka bo'linadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// matn ichidagi kasrlarni ikki qatorli ko'rsatish (a/b, ?/b, ?/? tokenlari)
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// 8 bo'lakli tort. Egalar: Sanjar 2 bo'lak, Javohir 1, Umid 1, boshqalar 4.
const D03_CORRECT = 2; // "Yo'q, Sanjar ko'proq (Javohir va Umid teng)"
const D03_OWNERS = ['sanjar', 'sanjar', 'javohir', 'umid', 'other', 'other', 'other', 'other'];
const D03_COLORS = { sanjar: '#3b82f6', javohir: '#22c55e', umid: '#a855f7', other: null };
const D03_T = {
  uz: {
    eyebrow: "Tug'ilgan kun torti",
    setup: "Sanjar tug'ilgan kunida tortni do'stlari bilan teng bo'lishish uchun bo'laklarga bo'ldi. Sanjar 2/8 qismini, Javohir 2/16 qismini, Umid 3/24 qismini oldi. Qolganini boshqa do'stlariga berdi.",
    ask: 'Sanjar, Javohir va Umid teng qismdan tort olishdimi?',
    opts: ['Ha, uchalasi teng oldi', "Yo'q, uchalasi ham har xil oldi", "Yo'q, Sanjar ko'proq oldi (Javohir va Umid teng)"],
    names: { sanjar: 'Sanjar', javohir: 'Javohir', umid: 'Umid', other: 'Boshqalar' },
    correct: "To'g'ri. Barchasini 8 ulushga keltiramiz: Sanjar 2/8, Javohir 2/16 = 1/8, Umid 3/24 = 1/8. Sanjar ikki baravar ko'p oldi — teng emas.",
    wrong: "Maslahat: har xil ko'rinishdagi ulushlarni to'g'ridan-to'g'ri solishtirib bo'lmaydi. Ularni qanday qilib bir xil o'lchovga keltirsangiz, kim ko'proq olgani ko'rinadi?",
    rule: "Kasrlarni solishtirish uchun ularni bir xil (sodda) holga keltiring.",
  },
  ru: {
    eyebrow: 'Праздничный торт',
    setup: 'На день рождения Санжар разрезал торт, чтобы поделить с друзьями поровну. Санжар взял 2/8, Джавохир — 2/16, Умид — 3/24. Остальное отдал другим друзьям.',
    ask: 'Санжар, Джавохир и Умид получили равные части торта?',
    opts: ['Да, все трое поровну', 'Нет, все трое по-разному', 'Нет, Санжар взял больше (Джавохир и Умид поровну)'],
    names: { sanjar: 'Санжар', javohir: 'Джавохир', umid: 'Умид', other: 'Другие' },
    correct: 'Верно. Приведём всё к 8 долям: Санжар 2/8, Джавохир 2/16 = 1/8, Умид 3/24 = 1/8. Санжар взял вдвое больше — не поровну.',
    wrong: 'Подсказка: доли разного вида нельзя сравнивать напрямую. Как привести их к одной мерке, чтобы стало видно, кто взял больше?',
    rule: 'Чтобы сравнить дроби, приведи их к одному (простому) виду.',
  },
};
// legenda qatorlari
const D03_LEG = [
  { who: 'sanjar', frac: '2/8', red: '2/8' },
  { who: 'javohir', frac: '2/16', red: '1/8' },
  { who: 'umid', frac: '3/24', red: '1/8' },
];
// ikki qatorli kasr (qoida bo'yicha yozuv)
const Frac = ({ num, den, size = 14, color = '#334155' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 2px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 1.5, background: color }} />
    <span style={{ fontSize: size, padding: '1px 2px 0' }}>{den}</span>
  </span>
);
const FracStr = ({ s, size = 14 }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} />; };

// Tort — ustidan ko'rinish (Dars13/04 uslubi): tarelka, biskvit po'stlog'i, krem yuzasi,
// har bo'lakda krem gulchasi + gilos, markazda gul va gilos. To'g'ri javobda egalar
// bo'yicha bo'laklar yengil rangga bo'yaladi (Sanjar/Javohir/Umid).
const D03_Cake = ({ owners, reveal }) => {
  const n = owners.length;
  const C = 72, R = 52, SS = 0.82;
  const pt = (ang, r) => [C + r * Math.cos(ang), C + r * Math.sin(ang)];
  const sliceD = (i, r) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    return `M${C} ${C} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
  };
  const mid = (i) => ((i + 0.5) / n) * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width="150" height="150" viewBox="0 0 144 144" aria-hidden="true">
      {/* tarelka */}
      <ellipse cx={C} cy={C + 3} rx={R + 15} ry={R + 13} fill="#f7f5f1" stroke="#e3ded4" strokeWidth="1.5" />
      <ellipse cx={C} cy={C + 3} rx={R + 8} ry={R + 7} fill="none" stroke="#ece7dd" strokeWidth="1" />
      {owners.map((w, i) => {
        const m = mid(i);
        const [dx, dy] = pt(m, R * 0.86);
        const tint = reveal ? D03_COLORS[w] : null;
        return (
          <g key={i}>
            {/* po'stloq (biskvit) */}
            <path d={sliceD(i, R)} fill="#e3c493" stroke="#9a7440" strokeWidth="1.5" strokeLinejoin="round" />
            {/* krem yuzasi */}
            <path d={sliceD(i, R * SS)} fill="#fbf1dc" stroke="#c9a86f" strokeWidth="1" strokeLinejoin="round" />
            {/* egasi bo'yicha yengil rang (faqat to'g'ri javobda) */}
            {tint && <path className="d16-tint" d={sliceD(i, R * SS)} fill={tint} fillOpacity="0.4" stroke={tint} strokeWidth="1.4" strokeLinejoin="round" />}
            {/* krem gulchasi + gilos */}
            <circle cx={dx} cy={dy} r="4.6" fill="#fff8e7" stroke="#c9a86f" strokeWidth="1" />
            <circle cx={dx} cy={dy} r="2.1" fill="#a8474a" opacity=".85" />
          </g>
        );
      })}
      {/* markaz: krem gul va gilos */}
      <circle cx={C} cy={C} r="9" fill="#fff8e7" stroke="#c9a86f" strokeWidth="1.2" />
      <circle cx={C} cy={C} r="5.4" fill="#fdf3df" stroke="#c9a86f" strokeWidth=".8" />
      <circle cx={C} cy={C - 0.5} r="3.4" fill="#a8474a" />
      <path d={`M${C} ${C - 3.6} q 2 -4 5 -4.6`} fill="none" stroke="#4d7c3a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};

export default function D16_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D03_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D03_CORRECT, label: t.opts[D03_CORRECT] }, correct, meta: { tag: 'cake_equal', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d16-tint { animation: d16fade .5s ease both; }
        @keyframes d16fade { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop, .d16-tint { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
        <D03_Cake owners={D03_OWNERS} reveal={reveal} />
      </div>
      {reveal && (
        <div className="d16-pop" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', margin: '2px 0 8px' }}>
          {D03_LEG.map((l) => (
            <span key={l.who} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: '#f8fafc', border: '1.5px solid #e2e8f0', fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
              <span style={{ width: 11, height: 11, borderRadius: 3, background: D03_COLORS[l.who] }} />
              <span>{t.names[l.who]}:</span>
              <FracStr s={l.frac} size={14} />
              {l.red !== l.frac && <><span style={{ fontWeight: 800 }}>=</span><FracStr s={l.red} size={14} /></>}
            </span>
          ))}
        </div>
      )}
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D03_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 50 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
