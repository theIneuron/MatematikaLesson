// Dars10 · Amaliyot 10 — Ulushlar soni · 🔴 · count_units (kiritish + o'q yuradi + vau)
// 1/5 dan 4/5 gacha necha 1/5 qadam? 3. Token o'qda yuradi + salyut.
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
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D10_ANS = 3;
const D10_T = {
  uz: {
    eyebrow: 'Ulushlar soni', setup: "Chumoli 1/5 nuqtadan 4/5 nuqtagacha yuradi (har qadam 1/5 ulush).",
    ask: 'Necha marta 1/5 ulushga siljiydi?', label: 'Javobni yozing:',
    correct: "To'g'ri. 1/5 → 2/5 → 3/5 → 4/5: jami 3 ta 1/5 qadam.",
    wrong: "Maslahat: har qadam bitta 1/5 ulush. Boshlanish va tugash suratlarini solishtiring — qadamlar sonini nima belgilaydi?",
    rule: "Bir maxrajli kasrlar orasidagi qadam = suratlar farqi.",
  },
  ru: {
    eyebrow: 'Число долей', setup: 'Муравей идёт от точки 1/5 до точки 4/5 (каждый шаг 1/5 доли).',
    ask: 'Сколько раз он сдвинется на 1/5?', label: 'Запишите ответ:',
    correct: 'Верно. 1/5 → 2/5 → 3/5 → 4/5: всего 3 шага по 1/5.',
    wrong: 'Подсказка: каждый шаг — одна доля 1/5. Сравни числители начала и конца — что задаёт число шагов?',
    rule: 'Число шагов между дробями с одним знаменателем = разность числителей.',
  },
};
export default function D10_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [pos, setPos] = useState(1); // ant pozitsiyasi (1/5 dan boshlaydi)
  const [salut, setSalut] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) { setPos(4); setSalut(true); } } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) { [2, 3, 4].forEach((v, k) => timers.current.push(setTimeout(() => setPos(v), 700 + k * 850))); timers.current.push(setTimeout(() => setSalut(true), 700 + 3 * 850)); }
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'count_units', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const DEN = 5, W = 100 / DEN;
  const conf = ['#f59e0b', '#fe5b1a', '#10b981', '#ec4899', '#7c3aed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d10-confetti { animation: d10conf .9s ease-out both; }
        @keyframes d10conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d10-pop, .d10-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* o'q + chumoli token */}
      <div style={{ position: 'relative', height: 82, margin: '14px 10px 6px' }}>
        <div style={{ position: 'absolute', left: '3%', right: '3%', top: 48, height: 3, background: '#bae6fd', borderRadius: 2 }} />
        {Array.from({ length: DEN + 1 }).map((_, u) => {
          const isInt = u === 0 || u === DEN;
          const active = u === 1 || u === 4;
          return (
            <div key={u} style={{ position: 'absolute', left: `calc(3% + ${u * W * 0.94}%)`, top: 34, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ width: active ? 12 : 8, height: active ? 12 : 8, borderRadius: 999, background: active ? '#0f766e' : (isInt ? '#64748b' : '#cbd5e1'), margin: '0 auto' }} />
              <div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: active ? '#0f766e' : '#94a3b8', ...S.mono }}>{isInt ? (u === 0 ? '0' : '1') : `${u}/${DEN}`}</div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: `calc(3% + ${pos * W * 0.94}%)`, top: 10, transform: 'translateX(-50%)', transition: 'left .8s cubic-bezier(.34,1.56,.64,1)' }}>
          <div style={{ fontSize: 18 }}>🐜</div>
        </div>
        {salut && <div style={{ position: 'absolute', left: `calc(3% + ${4 * W * 0.94}%)`, top: 20 }}>{Array.from({ length: 10 }).map((_, i) => { const ang = (i / 10) * Math.PI * 2; return <span key={i} className="d10-confetti" style={{ position: 'absolute', width: 6, height: 6, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 40 + 'px', '--dy': Math.sin(ang) * 30 + 'px', animationDelay: (i * 0.02) + 's' }} />; })}</div>}
      </div>
      <p style={{ ...S.ask, fontSize: 16, margin: '6px 0' }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
