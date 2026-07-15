// Dars18 · Amaliyot 03 — Yo'qolgan son · 🔴 · tag: sub_missing
// 5/9 − ?/9 = 2/9 → ? = 3. Teskari amal (nechta olib tashlangan). Bar + bo'sh katak.
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

function Bar({ n, shaded, remove = [], reveal = false, w = 270, h = 40 }) {
  const cw = w / n, rm = new Set(remove);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={'b' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      ))}
      {Array.from({ length: shaded }).map((_, i) => {
        const gone = reveal && rm.has(i);
        return <rect key={'s' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"
          style={{ transform: gone ? 'translateY(-16px)' : 'none', opacity: gone ? 0 : 1, transition: `transform .7s ease ${(rm.has(i) ? 0.2 + i * 0.18 : 0).toFixed(2)}s, opacity .7s ease ${(rm.has(i) ? 0.2 + i * 0.18 : 0).toFixed(2)}s` }} />;
      })}
    </svg>
  );
}

const D03_ANS = 5; // 9/11 − 5/11 = 4/11
const D03_T = {
  uz: {
    eyebrow: "Yo'qolgan son", setup: "Sardorda 9/11 quti bo'yoq bor edi. Devorni bo'yab bo'lgach, quti ichida 4/11 qismi qoldi.",
    ask: "Sardor nechadan o'n birdan ishlatgan? 9/11 − ?/11 = 4/11", label: 'Ayrilgan suratni yozing:',
    correct: "To'g'ri. 9 − 5 = 4, maxraj 11 o'sha: 9/11 − 5/11 = 4/11. Sardor 5/11 quti ishlatgan.",
    wrong: "Maslahat: boshidagi 9 ta bo'lak 4 taga tushdi. Boshi bilan oxirini solishtiring — necha bo'lak ketdi?",
    rule: "Yo'qolgan sonni topish: 9 dan qancha ayirsangiz 4 qoladi — o'shani izlang.",
  },
  ru: {
    eyebrow: 'Пропавшее число', setup: 'У Сардора было 9/11 банки краски. Покрасив стену, он увидел, что в банке осталось 4/11.',
    ask: 'Сколько одиннадцатых потратил Сардор? 9/11 − ?/11 = 4/11', label: 'Впиши вычтенный числитель:',
    correct: 'Верно. 9 − 5 = 4, знаменатель 11 тот же: 9/11 − 5/11 = 4/11. Сардор потратил 5/11 банки.',
    wrong: 'Подсказка: было 9 частей, стало 4. Сравни начало и конец — сколько частей ушло?',
    rule: 'Найти пропавшее число: сколько вычесть из 9, чтобы осталось 4 — то и найди.',
  },
};

export default function D18_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D03_ANS }, correct, meta: { tag: 'sub_missing', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } svg [style] { transition: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0 6px' }}>
        <Bar n={11} shaded={9} remove={[4, 5, 6, 7, 8]} reveal={reveal} />
        <div style={{ display: 'flex', gap: 18, ...S.mono, fontSize: 12.5, fontWeight: 700, color: '#94a3b8' }}>
          <span>{lang === 'uz' ? 'Boshida 9/11' : 'Было 9/11'}</span>
          <span>{lang === 'uz' ? 'Qoldi 4/11' : 'Осталось 4/11'}</span>
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Frac num="9" den="11" size={26} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 50, height: 42, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 54, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 23, fontWeight: 800, color: '#64748b' }}>11</div>
        </div>
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <Frac num="4" den="11" size={26} color="#0f766e" />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
