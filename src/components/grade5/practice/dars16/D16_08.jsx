// Dars16 · Amaliyot 08 — Provokatsiya · 🔴 · tag: trap_one
// "6/8 ni qisqartirdim: 6:2=3, 3/8" — to'g'rimi? Yo'q, 3/4.
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
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

// "6/8 ni qisqartirdim: 6:2=3, 3/8" — to'g'rimi? Yo'q, 3/4.
const D08_CORRECT = 1; // "Yo'q, 6/8 = 3/4"
const D08_T = {
  uz: {
    eyebrow: 'Aldanmang', setup: "Javohir aytadi: «6/8 ni qisqartirdim: 6:2 = 3, javob 3/8».",
    ask: 'Javohir haqmi?',
    opts: ["Ha, 6/8 = 3/8", "Yo'q, kasrlar teng emas", "6/8 = 6/4", "Qisqarmaydi"],
    correct: "To'g'ri. Javohir faqat suratni bo'ldi. Maxrajni ham ÷2 qilish kerak: 8:2 = 4. Demak 6/8 = 3/4.",
    wrong: "Maslahat: qisqartirishda surat VA maxraj bir xil songa bo'linishi shart. Javohir har ikkisini ham bo'ldimi — shuni tekshiring.",
    rule: "Suratni bo'lsangiz, maxrajni ham o'sha songa bo'ling. Aks holda kasr o'zgaradi.",
  },
  ru: {
    eyebrow: 'Не обманись', setup: 'Джавохир говорит: «я сократил 6/8: 6:2 = 3, ответ 3/8».',
    ask: 'Прав ли Джавохир?',
    opts: ['Да, 6/8 = 3/8', 'Нет, дроби не равны', '6/8 = 6/4', 'Не сокращается'],
    correct: 'Верно. Джавохир поделил только числитель. Знаменатель тоже ÷2: 8:2 = 4. Значит 6/8 = 3/4.',
    wrong: 'Подсказка: при сокращении и числитель, И знаменатель делят на одно число. Проверь, поделил ли Джавохир оба.',
    rule: 'Делишь числитель — дели и знаменатель на то же число. Иначе дробь меняется.',
  },
};
export default function D16_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'trap_one', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '10px 0 6px' }}>
        <Frac num="6" den="8" size={30} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#f97316' }}>=?</span>
        <Frac num="3" den="8" size={30} color="#c0392b" />
      </div>
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => (
          <button key={i} type="button" style={optStyle(picked, i, D08_CORRECT, checked, isReview, { fs: 16 })} disabled={isReview || checked} onClick={() => setPicked(i)}>
            {i === 0 ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{lang === 'uz' ? 'Ha,' : 'Да,'}<Frac num="6" den="8" size={16} /><span style={{ fontWeight: 800 }}>=</span><Frac num="3" den="8" size={16} /></span>)
              : i === 2 ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Frac num="6" den="8" size={16} /><span style={{ fontWeight: 800 }}>=</span><Frac num="6" den="4" size={16} /></span>)
                : o}
          </button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
