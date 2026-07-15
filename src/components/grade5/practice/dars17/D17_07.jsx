// Dars17 · Amaliyot 07 — Uch kasr · 🔴 · tag: add_three
// 1/9 + 3/9 + 2/9 = ?/9 → 6. Uch tasma ketma-ket natija tasmasiga qo'shiladi.
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
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

// natija tasmasi: 9 katak, dastlab bo'sh; reveal → 6 katak birma-bir (uch guruh rangda) chiqadi
const D07_SEG = [{ n: 1, c: '#93c5fd' }, { n: 3, c: '#86efac' }, { n: 2, c: '#c4b5fd' }]; // 1+3+2 = 6
function ResultBar({ reveal, w = 288, h = 32 }) {
  const cw = w / 9;
  let idx = 0;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {D07_SEG.flatMap((seg) => Array.from({ length: seg.n }).map(() => { const i = idx++; return { i, c: seg.c }; })).map(({ i, c }) => (
        <rect key={i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill={reveal ? c : '#eef2f7'} stroke="#cbd5e1" strokeWidth="1"
          style={reveal ? { opacity: 0, animation: `d17cell .5s ease ${(0.2 + i * 0.18).toFixed(2)}s forwards` } : undefined} />
      ))}
      {Array.from({ length: 3 }).map((_, k) => <rect key={'e' + k} x={(6 + k) * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />)}
    </svg>
  );
}

const D07_ANS = 6, D07_D = 9, D07_A = 2, D07_B = 3; // 6/9 = 2/3 (maxraj ham bo'sh katak)
const D07_T = {
  uz: {
    eyebrow: "Bo'lishdi", setup: "Sardor, Madina va Karim bitta katta bo'g'irsoqni 9 teng bo'lakka bo'lishdi. Sardorga 1 bo'lak, Madinaga 3 bo'lak, Karimga 2 bo'lak tegdi.",
    ask: "Uchalasi birga qancha bo'g'irsoq oldi? Yig'indini va eng sodda holini yozing.", l1: "Yig'indi:", l2: 'Eng sodda:',
    correct: "To'g'ri. 1 + 3 + 2 = 6 → 6/9. Eng sodda holda: 6/9 = 2/3.",
    wrong: "Maslahat: maxraj bir xil bo'lsa, faqat suratlar qo'shiladi. Natija kasrini yana qisqartirib bo'ladimi?",
    rule: "Avval qo'sh (suratlar), keyin natijani eng sodda holga keltiring: 6/9 = 2/3.",
  },
  ru: {
    eyebrow: 'Разделили', setup: 'Сардор, Мадина и Карим разделили один большой бублик на 9 равных частей. Сардору 1 часть, Мадине 3, Кариму 2.',
    ask: 'Сколько всего взяли трое? Запиши сумму и её простейший вид.', l1: 'Сумма:', l2: 'Простейший:',
    correct: 'Верно. 1 + 3 + 2 = 6 → 6/9. В простейшем виде: 6/9 = 2/3.',
    wrong: 'Подсказка: при равном знаменателе складываются только числители. Можно ли полученную дробь ещё сократить?',
    rule: 'Сначала сложи (числители), потом упрости результат: 6/9 = 2/3.',
  },
};

export default function D17_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [vd, setVd] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.value != null) setVal(String(sa.value)); if (sa.vd != null) setVd(String(sa.vd)); if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(val) && /^\d+$/.test(vd) && /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D07_ANS && parseInt(vd, 10) === D07_D && parseInt(a, 10) === D07_A && parseInt(b, 10) === D07_B;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 350);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10), vd: parseInt(vd, 10), a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: { value: D07_ANS, vd: D07_D, a: D07_A, b: D07_B }, correct, meta: { tag: 'add_three', level: '🔴' } });
  }, [val, vd, a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cellStyle = (border) => ({ width: 52, height: 42, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + border, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' });
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d17cell { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 6px', flexWrap: 'wrap' }}>
        <Frac num="1" den="9" size={22} color="#2563eb" /><span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>+</span>
        <Frac num="3" den="9" size={22} color="#16a34a" /><span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>+</span>
        <Frac num="2" den="9" size={22} color="#7c3aed" />
      </div>
      {reveal && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '4px 0' }}>
          <ResultBar reveal />
          <span className="d17-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 17, fontWeight: 800, color: '#0f766e' }}>=<Frac num="6" den="9" size={19} color="#0f766e" /><span>=</span><Frac num="2" den="3" size={19} color="#0f766e" /></span>
        </div>
      )}
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 22, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 4 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(val, D07_ANS))} />
            <div style={{ width: 54, height: 3, background: '#1f2430' }} />
            <input value={vd} onChange={(e) => setVd(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(vd, D07_D))} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <input value={a} onChange={(e) => setA(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(a, D07_A))} />
            <div style={{ width: 54, height: 3, background: '#1f2430' }} />
            <input value={b} onChange={(e) => setB(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cellStyle(bdOf(b, D07_B))} />
          </div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
