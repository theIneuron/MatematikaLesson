// Dars18 · Amaliyot 10 — Masala + qisqartirish · 🔴 · tag: sub_story_reduce
// Nilufar: 5/6 − 1/6 = 4/6, eng sodda holda 2/3. Shisha suvi sekin pasayadi.
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
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

// shisha: 6 ga bo'lingan; suv `level` (oltidan) sathigacha. Sekin pasayadi.
function Bottle({ level, w = 76, h = 148 }) {
  const pad = 10, xl = 15, xr = w - 15, yTop = pad, yBot = h - pad, usable = yBot - yTop;
  const yFor = (u) => yBot - usable * (u / 6);
  return (
    <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} aria-hidden="true">
      <defs><clipPath id="d18btl"><rect x={xl} y={yTop} width={xr - xl} height={usable} rx="10" /></clipPath></defs>
      <rect x={xl} y={yTop} width={xr - xl} height={usable} rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <rect x={xl} y={yFor(level)} width={xr - xl} height={usable} fill="#fcd9a8" clipPath="url(#d18btl)" style={{ transition: 'y .85s ease' }} />
      {[1, 2, 3, 4, 5].map((u) => { const y = yFor(u), third = (u === 2 || u === 4); return <line key={u} x1={xl} y1={y} x2={xr} y2={y} stroke={third ? '#f59e0b' : '#cbd5e1'} strokeWidth={third ? 1.5 : 1} strokeDasharray="3 2" />; })}
      <rect x={xl} y={yTop} width={xr - xl} height={usable} rx="10" fill="none" stroke="#94a3b8" strokeWidth="2" />
    </svg>
  );
}

const D10_A = 4, D10_SA = 2, D10_SB = 3; // 4/6 = 2/3
const D10_T = {
  uz: {
    eyebrow: 'Sharbat', setup: "Nilufarning idishida 5/6 litr olma sharbati bor edi. U do'stiga 2 ta olma sovg'a qildi, keyin idishdan 1/6 litr sharbatni to'kib yubordi.",
    ask: 'Idishda qancha sharbat qoldi? Ayirmani va eng sodda holini yozing.',
    l1: 'Ayirma:', l2: 'Eng sodda:',
    correct: "To'g'ri. Olmalar soni bu yerda kerak emas edi. 5 − 1 = 4 → 4/6, eng sodda holda 4/6 = 2/3.",
    wrong: "Maslahat: masaladagi barcha sonlar javob uchun kerak emas. Qaysilari sharbat miqdoriga tegishli — faqat o'shalar bilan ishlang.",
    rule: "Avval ayir (suratlar), keyin natijani eng sodda holga keltiring: 4/6 = 2/3.",
  },
  ru: {
    eyebrow: 'Сок', setup: 'В сосуде у Нилуфар было 5/6 литра яблочного сока. Она подарила подруге 2 яблока, а потом пролила 1/6 литра сока из сосуда.',
    ask: 'Сколько сока осталось в сосуде? Запиши разность и её простейший вид.',
    l1: 'Разность:', l2: 'Простейший:',
    correct: 'Верно. Число яблок здесь не нужно. 5 − 1 = 4 → 4/6, в простейшем виде 4/6 = 2/3.',
    wrong: 'Подсказка: не все числа в задаче нужны для ответа. Определи, какие относятся к количеству сока — работай только с ними.',
    rule: 'Сначала вычти (числители), потом упрости результат: 4/6 = 2/3.',
  },
};

export default function D18_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [sa, setSa] = useState('');
  const [sb, setSb] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [level, setLevel] = useState(5); // suv sathi (oltidan), boshida 5/6
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.a != null) setA(String(s.a)); if (s.sa != null) setSa(String(s.sa)); if (s.sb != null) setSb(String(s.sb)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setLevel(4); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(sa) && /^\d+$/.test(sb);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D10_A && parseInt(sa, 10) === D10_SA && parseInt(sb, 10) === D10_SB;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setLevel(4), 350);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), sa: parseInt(sa, 10), sb: parseInt(sb, 10) }, correctAnswer: { a: D10_A, sa: D10_SA, sb: D10_SB }, correct, meta: { tag: 'sub_story_reduce', level: '🔴' } });
  }, [a, sa, sb, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cellStyle = (border) => ({ width: 50, height: 42, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + border, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' });
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } svg rect[style] { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '6px 0' }}>
        <Bottle level={level} />
        {checked && fb?.correct && level === 4 && <span className="d18-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e' }}><Frac num="4" den="6" size={18} color="#0f766e" /><span>=</span><Frac num="2" den="3" size={18} color="#0f766e" /></span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 4 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={a} onChange={(e) => setA(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(a, D10_A))} />
            <div style={{ width: 52, height: 3, background: '#1f2430' }} />
            <div style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#64748b' }}>6</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={sa} onChange={(e) => setSa(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(sa, D10_SA))} />
            <div style={{ width: 52, height: 3, background: '#1f2430' }} />
            <input value={sb} onChange={(e) => setSb(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(sb, D10_SB))} />
          </div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
