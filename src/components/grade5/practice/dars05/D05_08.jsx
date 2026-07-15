// Dars05 · Amaliyot 08 — Ikki amal · 🔴 · Bekzod · tag: word_two_step
// Bekzod 8 daftar, 1000 so'm berdi, 200 qaytdi. Bitta daftar narxi?
// (1000 - 200) : 8 = 100. Bosqichli yechim + salyut.
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
  if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

const D08_DATA = { correct: 0, tag: 'word_two_step', level: '🔴' };
const D08_T = {
  uz: {
    eyebrow: 'Ikki amal', setup: "Bekzod 8 ta bir xil daftar sotib oldi. Kassaga 1000 so'm berdi, 200 so'm qaytim oldi.",
    ask: "Bitta daftar necha so'm?",
    opts: ["100 so'm", "125 so'm", "150 so'm", "80 so'm"],
    correct: "To'g'ri. Avval xarajat: 1000 − 200 = 800. Keyin 800 : 8 = 100.",
    wrong: "Maslahat: 1000 so'mning hammasi daftarga ketmadi — qaytim bor. Daftarlarga aslida qancha pul ketdi, keyin uni nechta daftarga bo'lish kerak? Qaysi ikki amal?",
    step1: 'Sarflandi', step2: 'Bitta daftar',
  },
  ru: {
    eyebrow: 'Два действия', setup: 'Бекзод купил 8 одинаковых тетрадей. Дал в кассу 1000 сум, получил 200 сдачи.',
    ask: 'Сколько стоит одна тетрадь?',
    opts: ['100 сум', '125 сум', '150 сум', '80 сум'],
    correct: 'Верно. Сначала расход: 1000 − 200 = 800. Затем 800 : 8 = 100.',
    wrong: 'Подсказка: не все 1000 сум ушли на тетради — есть сдача. Сколько денег на самом деле ушло на тетради и на сколько тетрадей его делить? Какие два действия?',
    step1: 'Потрачено', step2: 'Одна тетрадь',
  },
};
export default function D05_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1 sarf · 2 bo'lish · 3 salyut
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(3); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 500], [2, 1600], [3, 2600]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setPh(v), ms)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: "100 so'm" }, correct, meta: { tag: D08_DATA.tag, level: D08_DATA.level } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const conf = ['#f59e0b', '#2563eb', '#10b981', '#ec4899', '#7c3aed'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d5-pop { animation: d5pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d5pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d5-confetti { animation: d5conf .9s ease-out both; }
        @keyframes d5conf { 0% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @media (prefers-reduced-motion: reduce) { .d5-pop, .d5-confetti { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <p style={S.ask}>{t.ask}</p>

      {/* animatsiya savol bilan variantlar orasida ochiladi — variantlar pastga suriladi */}
      <div style={{ position: 'relative', maxHeight: ph >= 1 ? 130 : 0, opacity: ph >= 1 ? 1 : 0, overflow: 'hidden', transition: 'max-height .6s cubic-bezier(.33,1,.42,1), opacity .5s ease', marginBottom: ph >= 1 ? 14 : 0 }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', minHeight: 44 }}>
          {ph >= 1 && (
            <div className="d5-pop" style={{ padding: '8px 14px', borderRadius: 12, background: '#fff7ed', border: '2px solid #fed7aa', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#c2410c' }}>{t.step1}</div>
              <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#9a3412' }}>1000 − 200 = 800</div>
            </div>
          )}
          {ph >= 2 && (
            <div className="d5-pop" style={{ padding: '8px 14px', borderRadius: 12, background: '#eff6ff', border: '2px solid #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#2563eb' }}>{t.step2}</div>
              <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#1e40af' }}>800 : 8 = 100</div>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', minHeight: 34, ...S.mono, fontSize: 24, fontWeight: 800, color: '#1a7f43', position: 'relative' }}>
          {ph >= 3 && <span className="d5-pop">100 so'm</span>}
          {ph >= 3 && Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2;
            return <span key={i} className="d5-confetti" style={{ position: 'absolute', left: '50%', top: '50%', width: 7, height: 7, borderRadius: 2, background: conf[i % conf.length], '--dx': Math.cos(ang) * 60 + 'px', '--dy': Math.sin(ang) * 40 + 'px', animationDelay: (i * 0.02) + 's' }} />;
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 0, checked, isReview, { half: true, center: true, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
