// Dars18 · Amaliyot 05 — Ayir va qisqartir · 🔴 · tag: sub_reduce
// 7/8 − 1/8 = 6/8, eng sodda holda 3/4. Ikki maydon: ayirma va eng sodda hol.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
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

function Bar({ n, shaded, remove = [], reveal = false, w = 260, h = 38 }) {
  const cw = w / n, rm = new Set(remove);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={'b' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      ))}
      {Array.from({ length: shaded }).map((_, i) => {
        const gone = reveal && rm.has(i);
        return <rect key={'s' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#ffb488" stroke="#ff8a52" strokeWidth="1"
          style={{ transform: gone ? 'translateY(-16px)' : 'none', opacity: gone ? 0 : 1, transition: `transform .7s ease ${(rm.has(i) ? 0.25 : 0)}s, opacity .7s ease ${(rm.has(i) ? 0.25 : 0)}s` }} />;
      })}
    </svg>
  );
}

const D05_A = 6, D05_SA = 3, D05_SB = 4; // 6/8 = 3/4
const D05_T = {
  uz: {
    eyebrow: "Bog'", setup: "Madina bog'idagi 7/8 gulzorni sug'orishi kerak edi. Ertalab 1/8 qismini sug'ordi.",
    ask: "Yana qancha sug'orish qoldi? Ayirmani va eng sodda holini yozing.",
    l1: 'Ayirma:', l2: 'Eng sodda:',
    correct: "To'g'ri. 7 − 1 = 6 → 6/8. Eng sodda holda: 6/8 = 3/4.",
    wrong: "Maslahat: ayirmani topib bo'ldingizmi? Endi natijaga qarang — surat va maxrajni bir xil songa bo'lib bo'ladimi?",
    rule: "Avval ayir (suratlar), keyin natijani eng sodda holga keltiring: 6/8 = 3/4.",
  },
  ru: {
    eyebrow: 'Сад', setup: 'Мадине нужно было полить 7/8 клумбы. Утром она полила 1/8.',
    ask: 'Сколько ещё осталось полить? Запиши разность и её простейший вид.',
    l1: 'Разность:', l2: 'Простейший:',
    correct: 'Верно. 7 − 1 = 6 → 6/8. В простейшем виде: 6/8 = 3/4.',
    wrong: 'Подсказка: разность посчитал? Теперь посмотри на результат — можно ли числитель и знаменатель разделить на одно число?',
    rule: 'Сначала вычти (числители), потом упрости результат: 6/8 = 3/4.',
  },
};

export default function D18_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [sa, setSa] = useState('');
  const [sb, setSb] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.a != null) setA(String(s.a)); if (s.sa != null) setSa(String(s.sa)); if (s.sb != null) setSb(String(s.sb)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(sa) && /^\d+$/.test(sb);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D05_A && parseInt(sa, 10) === D05_SA && parseInt(sb, 10) === D05_SB;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), sa: parseInt(sa, 10), sb: parseInt(sb, 10) }, correctAnswer: { a: D05_A, sa: D05_SA, sb: D05_SB }, correct, meta: { tag: 'sub_reduce', level: '🔴' } });
  }, [a, sa, sb, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const cellStyle = (border) => ({ width: 50, height: 42, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + border, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' });
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } svg [style] { transition: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0 4px' }}>
        <Bar n={8} shaded={7} remove={[6]} reveal={reveal} />
        {reveal && <span className="d18-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e' }}><Frac num="6" den="8" size={18} color="#0f766e" /><span>=</span><Frac num="3" den="4" size={18} color="#0f766e" /></span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 4 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={a} onChange={(e) => setA(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(a, D05_A))} />
            <div style={{ width: 52, height: 3, background: '#1f2430' }} />
            <div style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#64748b' }}>8</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={sa} onChange={(e) => setSa(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(sa, D05_SA))} />
            <div style={{ width: 52, height: 3, background: '#1f2430' }} />
            <input value={sb} onChange={(e) => setSb(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(sb, D05_SB))} />
          </div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
