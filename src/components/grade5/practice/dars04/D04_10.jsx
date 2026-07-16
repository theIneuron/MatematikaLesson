// Dars04 · Amaliyot 10 — Ixchamlash · 🔴 · Sardor · tag: distributive
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

/* =================== 10 · Ixchamlash · 🔴 · distributive (vau-effekt) =================== */

const D10_DATA = { correct: 2, tag: 'distributive', level: '🔴' };
const D10_T = {
  uz: { eyebrow: 'Ixchamlash', setup: "Bir xil qo'shiluvchilarni ko'paytmaga aylantirsak, ifoda ixchamlashadi.", ask: '231 + 231 + 231 + 231 + 35 ni hisoblang.', opts: ['924', '994', '959', '1 359'], correct: "To'g'ri. To'rtta 231 — bu 231 × 4 = 924. So'ng 924 + 35 = 959.", wrong: "Maslahat: 231 necha marta takrorlangan? 35 esa alohida turibdi — u ko'paytmaga kiradimi?" },
  ru: { eyebrow: 'Упрощение', setup: 'Если одинаковые слагаемые заменить произведением, выражение упрощается.', ask: '231 + 231 + 231 + 231 + 35 вычислите.', opts: ['924', '994', '959', '1 359'], correct: 'Верно. Четыре 231 — это 231 × 4 = 924. Затем 924 + 35 = 959.', wrong: 'Подсказка: сколько раз повторяется 231? А 35 стоит отдельно — входит ли оно в произведение?' },
};
export default function D04_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(4); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 400], [2, 1500], [3, 2500], [4, 3300]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 2, label: '959' }, correct, meta: { tag: D10_DATA.tag, level: D10_DATA.level } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const conf = ['#f59e0b', '#fe5b1a', '#10b981', '#ec4899', '#7c3aed', '#ef4444'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d4-pop { animation: d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d4-fly { animation: d4fly .6s cubic-bezier(.22,1,.36,1) both; }
        @keyframes d4fly { from { opacity: 0; transform: translateX(60px) scale(.8); } to { opacity: 1; transform: none; } }
        .d4-confetti { animation: d4conf .9s ease-out both; }
        @keyframes d4conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d4-pop, .d4-fly, .d4-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* boshida ifoda markazda joyni to'ldiradi; to'g'ri javobdan keyin yuqoriga
          suriladi va pastda animatsiya uchun joy ochiladi */}
      <div style={{
        textAlign: 'center', ...S.mono, fontSize: 20, fontWeight: 800, color: '#374151',
        padding: ph >= 1 ? '6px 0' : '34px 0',
        transition: 'padding .6s cubic-bezier(.33,1,.42,1), color .4s ease, font-size .4s ease',
        color: ph >= 1 ? '#94a3b8' : '#374151', fontSize: ph >= 1 ? 15 : 20,
      }}>
        231 + 231 + 231 + 231 + 35
      </div>

      <div style={{ position: 'relative', maxHeight: ph >= 1 ? 150 : 0, opacity: ph >= 1 ? 1 : 0, overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.33,1,.42,1), opacity .5s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: ph >= 2 ? 0 : 8, height: 64, position: 'relative' }}>
          {ph >= 1 && [0, 1, 2, 3].map((i) => (
            <div key={i} className="d4-fly" style={{
              ...S.mono, fontSize: 22, fontWeight: 800, color: '#b83d0e',
              padding: '10px 12px', borderRadius: 11, background: '#fff0e8', border: '2px solid #bfd4fb',
              position: ph >= 2 ? 'absolute' : 'relative', left: ph >= 2 ? '50%' : 'auto',
              transform: ph >= 2 ? `translateX(-50%) translateY(${i * -3}px) rotate(${(i - 1.5) * 3}deg)` : 'none',
              animationDelay: (i * 0.15) + 's', transition: 'all .6s cubic-bezier(.34,1.56,.64,1)', zIndex: i,
            }}>231</div>
          ))}
        </div>
        <div style={{ textAlign: 'center', minHeight: 30, ...S.mono, fontSize: 22, fontWeight: 800 }}>
          {ph >= 2 && <span className="d4-pop" style={{ color: '#fe5b1a' }}>231 × 4 = 924</span>}
        </div>
        <div style={{ textAlign: 'center', minHeight: 30, ...S.mono, fontSize: 24, fontWeight: 800, position: 'relative' }}>
          {ph >= 3 && <span className="d4-pop" style={{ color: '#c2410c' }}>924 + 35 = </span>}
          {ph >= 3 && <span className="d4-pop" style={{ color: '#1a7f43', animationDelay: '.3s' }}> 959</span>}
          {ph >= 4 && Array.from({ length: 14 }).map((_, i) => {
            const ang = (i / 14) * Math.PI * 2;
            return <span key={i} className="d4-confetti" style={{ position: 'absolute', left: '50%', top: '50%', width: 7, height: 7, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 70 + 'px', '--dy': Math.sin(ang) * 45 + 'px', animationDelay: (i * 0.02) + 's' }} />;
          })}
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 2, checked, isReview, { half: true, center: true, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
