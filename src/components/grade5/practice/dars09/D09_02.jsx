// Dars09 · Amaliyot 02 — Surat va maxraj · 🟢 · surat_maxraj (belgilash)
// 3/4. Bola qaysi surat, qaysi maxraj ekanini belgilaydi (toggle).
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
const RuleChip = ({ text }) => (
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// kasr belgisi (surat/maxraj chiziqcha bilan)
const Frac = ({ num, den, size = 26, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

const D02_NUM = 3, D02_DEN = 4;
const D02_T = {
  uz: {
    eyebrow: 'Surat-maxraj', setup: "3/4 kasriga qarang.",
    qSurat: 'Qaysi son SURAT?', qMaxraj: 'Qaysi son MAXRAJ?',
    correct: "To'g'ri. Tepadagi 3 — surat, pastdagi 4 — maxraj.",
    wrong: "Maslahat: kasrdagi sonlardan biri butun nechaga bo'linganini, boshqasi nechta ulush olinganini bildiradi. Qaysi biri nechta olinganini sanaydi?",
    rule: "Kasrda: tepadagi son — surat, pastdagi son — maxraj.",
  },
  ru: {
    eyebrow: 'Числитель-знаменатель', setup: 'Посмотрите на дробь 3/4.',
    qSurat: 'Какое число ЧИСЛИТЕЛЬ?', qMaxraj: 'Какое число ЗНАМЕНАТЕЛЬ?',
    correct: 'Верно. Верхнее 3 — числитель, нижнее 4 — знаменатель.',
    wrong: 'Подсказка: одно из чисел дроби говорит, на сколько частей разделено целое, другое — сколько долей взято. Какое из них считает, сколько взято?',
    rule: 'В дроби: верхнее число — числитель, нижнее — знаменатель.',
  },
};
export default function D09_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [suratCh, setSuratCh] = useState(null);
  const [maxrajCh, setMaxrajCh] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.suratCh != null) setSuratCh(sa.suratCh); if (sa.maxrajCh != null) setMaxrajCh(sa.maxrajCh); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = suratCh != null && maxrajCh != null;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = suratCh === '3' && maxrajCh === '4';
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 350);
    onSubmit?.({ questionText: t.qSurat, options: [], studentAnswer: { suratCh, maxrajCh }, correctAnswer: { surat: '3', maxraj: '4' }, correct, meta: { tag: 'surat_maxraj', level: '🟢' } });
  }, [suratCh, maxrajCh, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const chipStyle = (val, choice, correctVal) => {
    const on = choice === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1e40af'; }
    if (checked && on) { const ok = suratCh === '3' && maxrajCh === '4'; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, padding: '11px 6px', borderRadius: 11, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 19, fontWeight: 800, cursor: locked ? 'default' : 'pointer', minHeight: 46 };
  };
  const suratLbl = lang === 'uz' ? 'surat' : 'числитель';
  const maxrajLbl = lang === 'uz' ? 'maxraj' : 'знаменатель';
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* kasr — to'g'ri javobdan keyin surat/maxraj yorliqlari yon tomondan chiqadi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '12px 0 18px', minHeight: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20, opacity: reveal ? 1 : 0, transform: reveal ? 'none' : 'translateX(-10px)', transition: 'all .5s ease' }}>
          {reveal && <span className="d9-pop" style={{ fontSize: 13, fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: 999, border: '1.5px solid #bfdbfe' }}>{suratLbl} →</span>}
          {reveal && <span className="d9-pop" style={{ fontSize: 13, fontWeight: 800, color: '#c2410c', background: '#fff7ed', padding: '4px 10px', borderRadius: 999, border: '1.5px solid #fed7aa' }}>{maxrajLbl} →</span>}
        </div>
        <Frac num="3" den="4" size={48} color={reveal ? '#1f2430' : '#1f2430'} />
      </div>
      <p style={{ ...S.ask, fontSize: 14.5, margin: '4px 0 7px' }}>{t.qSurat}</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button type="button" style={chipStyle('3', suratCh, '3')} disabled={locked} onClick={() => setSuratCh('3')}>3</button>
        <button type="button" style={chipStyle('4', suratCh, '3')} disabled={locked} onClick={() => setSuratCh('4')}>4</button>
      </div>
      <p style={{ ...S.ask, fontSize: 14.5, margin: '4px 0 7px' }}>{t.qMaxraj}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" style={chipStyle('3', maxrajCh, '4')} disabled={locked} onClick={() => setMaxrajCh('3')}>3</button>
        <button type="button" style={chipStyle('4', maxrajCh, '4')} disabled={locked} onClick={() => setMaxrajCh('4')}>4</button>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
