// Dars11 · Amaliyot 05 — Bo'lishni hisobla · 🟡 · div_compute (kiritish + vau)
// 12/4 = 12 : 4 = 3. Butun son chiqadi. Kiritish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

const D05_ANS = 3;
const D05_T = {
  uz: {
    eyebrow: "Bo'lishni hisobla", setup: "Ba'zi kasrlar butun songa teng bo'ladi.",
    ask: "12/4 ni bo'linma sifatida hisoblang:", label: 'Javobni yozing:',
    correct: "To'g'ri. 12/4 = 12 : 4 = 3 — butun son chiqdi.",
    wrong: "Maslahat: kasr chizig'i — bo'lish. 12 : 4 nechaga teng?",
    rule: "Surat maxrajga bo'linsa, kasr butun songa teng bo'ladi.",
  },
  ru: {
    eyebrow: 'Вычисли деление', setup: 'Некоторые дроби равны целому числу.',
    ask: 'Вычислите 12/4 как частное:', label: 'Запишите ответ:',
    correct: 'Верно. 12/4 = 12 : 4 = 3 — получилось целое число.',
    wrong: 'Подсказка: дробная черта — деление. Чему равно 12 : 4?',
    rule: 'Если числитель делится на знаменатель, дробь равна целому числу.',
  },
};
export default function D11_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1: 12:4  2: =3 salyut
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 450], [2, 1250]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'div_compute', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const conf = ['#f59e0b', '#fe5b1a', '#10b981', '#ec4899', '#7c3aed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-confetti { animation: d11conf .9s ease-out both; }
        @keyframes d11conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d11-pop, .d11-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '14px 0 6px', minHeight: 60, position: 'relative' }}>
        <Frac num="12" den="4" size={32} color="#fe5b1a" />
        {ph >= 1 && <span className="d11-pop" style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>= 12 : 4</span>}
        {ph >= 2 && <span className="d11-pop" style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1a7f43' }}>= 3</span>}
        {ph >= 2 && <div style={{ position: 'absolute', right: 20, top: 10 }}>{Array.from({ length: 10 }).map((_, i) => { const ang = (i / 10) * Math.PI * 2; return <span key={i} className="d11-confetti" style={{ position: 'absolute', width: 6, height: 6, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 36 + 'px', '--dy': Math.sin(ang) * 28 + 'px', animationDelay: (i * 0.02) + 's' }} />; })}</div>}
      </div>
      <p style={{ ...S.ask, fontSize: 16, margin: '8px 0' }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
