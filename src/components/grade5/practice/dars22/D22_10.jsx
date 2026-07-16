// Dars22 · Amaliyot 10 — Son o'qidagi nuqta · 🔴 · tag: convert_numberline
// Son o'qida 17/5 belgilangan (beshdanlarga bo'lingan, 0..4). Uni aralash son bilan yozing: 3⅖.
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
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D10 = { w: 3, n: 2, d: 5 }; // 17/5 = 3⅖
const D10_T = {
  uz: {
    eyebrow: "Son o'qi", setup: "Son o'qi 0 dan 4 gacha, beshdan bo'laklarga bo'lingan. Sariq nuqta 17/5 ni ko'rsatadi. Uni aralash son ko'rinishida yozing.",
    ask: '17/5 nuqtasini aralash son bilan yozing:',
    l1: 'Butun:', l2: 'Kasr surati:',
    correct: "To'g'ri. Nuqta 3 va 4 orasida — 3 dan keyingi 2-beshdanda. Demak 17/5 = 3⅖.",
    wrong: "Maslahat: nuqta qaysi ikki butun orasida? Undan keyingi butundan yana nechta beshdan uzoqda? Shu ikkisini birlashtiring.",
    rule: "Son o'qida noto'g'ri kasr = aralash son: 17/5 nuqtasi = 3⅖.",
  },
  ru: {
    eyebrow: 'Числовая ось', setup: 'Ось от 0 до 4, поделена на пятые. Жёлтая точка показывает 17/5. Запиши её смешанным числом.',
    ask: 'Запиши точку 17/5 смешанным числом:',
    l1: 'Целое:', l2: 'Числитель дроби:',
    correct: 'Верно. Точка между 3 и 4 — на 2-й пятой после 3. Значит 17/5 = 3⅖.',
    wrong: 'Подсказка: между какими двумя целыми точка? На сколько пятых она дальше предыдущего целого? Соедини это вместе.',
    rule: 'На оси неправильная дробь = смешанное число: точка 17/5 = 3⅖.',
  },
};

export default function D22_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.n != null) setN(String(s.n)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(n);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D10.w && parseInt(n, 10) === D10.n;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), n: parseInt(n, 10) }, correctAnswer: D10, correct, meta: { tag: 'convert_numberline', level: '🔴' } });
  }, [w, n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 344, mL = 22, mR = 322, base = 58, step = (mR - mL) / 20;
  const xAt = (i) => mL + i * step;
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 48, height: 42, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <svg width={W} height="80" viewBox={`0 0 ${W} 80`}>
          <line x1={mL} y1={base} x2={mR} y2={base} stroke="#94a3b8" strokeWidth="2" />
          {Array.from({ length: 21 }).map((_, i) => { const whole = i % 5 === 0; return (<g key={i}><line x1={xAt(i)} y1={base - (whole ? 10 : 5)} x2={xAt(i)} y2={base + (whole ? 10 : 5)} stroke="#94a3b8" strokeWidth={whole ? 2.5 : 1.5} />{whole && <text x={xAt(i)} y={base + 26} fontSize="13" fontWeight="800" textAnchor="middle" fill="#64748b" fontFamily="'JetBrains Mono', monospace">{i / 5}</text>}</g>); })}
          <circle cx={xAt(17)} cy={base} r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <text x={xAt(17)} y={base - 14} fontSize="11" textAnchor="middle" fontWeight="800" fill="#b45309" fontFamily="'JetBrains Mono', monospace">17/5</text>
        </svg>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>{t.l1}</div>{box(w, setW, D10.w)}</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>{t.l2}</div>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>{box(n, setN, D10.n)}<div style={{ width: 46, height: 3, background: '#1f2430' }} /><div style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#64748b' }}>5</div></div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
