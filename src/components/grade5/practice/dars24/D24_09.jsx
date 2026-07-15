// Dars24 · Amaliyot 09 — Xatoni top · 🟡 · tag: decimal_find_error
// Zarina: 3/4 = 0,34 (surat/maxrajni vergul bilan yozgan). To'g'risi: 3/4 = 75/100 = 0,75.
// Setup usulni oshkor qilmaydi; wrong = turtki; qoida faqat to'g'ridan keyin.
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
  <div className="d24-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 18, color = '#1f2430' }) => (
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

const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Zarina 3/4 kasrini o'nli ko'rinishda 0,34 deb yozdi. Ustoz bu yerda xato borligini aytdi.",
    ask: 'Xato nimada?',
    opts: [
      "3/4 ni avval maxraji 100 bo'lgan kasrga keltirish kerak: 3/4 = 75/100 = 0,75. Demak to'g'risi 0,75.",
      "Vergul noto'g'ri joyda, aslida javob 3,4 bo'lishi kerak.",
      "Xato yo'q, 3/4 chindan ham 0,34 ga teng.",
    ],
    correct: "To'g'ri. 3/4 = 75/100, ya'ni 0,75. Surat va maxrajni shunchaki vergul bilan yozib bo'lmaydi.",
    wrong: "Surat va maxrajni shunchaki vergul bilan yozib bo'ladimi? Kasrni o'nliga aylantirish uchun maxraj qanday bo'lishi kerak?",
    rule: "Kasrni o'nliga aylantirish uchun maxrajni 10 yoki 100 ga keltiring. 3/4 = 75/100 = 0,75.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Зарина записала дробь 3/4 десятичной как 0,34. Учитель сказал, что здесь ошибка.',
    ask: 'В чём ошибка?',
    opts: [
      'Сначала 3/4 нужно привести к знаменателю 100: 3/4 = 75/100 = 0,75. Значит правильно 0,75.',
      'Запятая не на месте, на самом деле ответ должен быть 3,4.',
      'Ошибки нет, 3/4 действительно равно 0,34.',
    ],
    correct: 'Верно. 3/4 = 75/100, то есть 0,75. Нельзя просто записать числитель и знаменатель через запятую.',
    wrong: 'Можно ли просто записать числитель и знаменатель через запятую? Каким должен быть знаменатель, чтобы перевести дробь в десятичную?',
    rule: 'Чтобы перевести дробь в десятичную, приведи знаменатель к 10 или 100. 3/4 = 75/100 = 0,75.',
  },
};

export default function D24_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D09_CORRECT }, correct, meta: { tag: 'decimal_find_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d24-pop { animation: d24pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d24pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d24-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 4px', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <Frac num={3} den={4} size={19} /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span><span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#c0392b' }}>0,34</span>
      </div>
      {checked && fb?.correct && (
        <div className="d24-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1a7f43' }}>0,75</span>
        </div>
      )}
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D09_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{renderFr(o)}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
