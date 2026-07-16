// Dars09 · Amaliyot 05 — Kitobning qismi · 🟡 · part_of_book (kiritish + qadam)
// 320 betlik kitobning 3/8 qismi = necha bet? 320:8=40, 40×3=120. Bosqichli reveal.
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
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_TOTAL = 320, D05_NUM = 3, D05_DEN = 8, D05_ANS = 120;
const D05_T = {
  uz: {
    eyebrow: 'Kitob qismi', setup: "Aziza 320 betlik kitobning 3/8 qismini o'qidi.",
    ask: "Aziza necha bet o'qidi?", label: 'Javobni yozing:',
    correct: "To'g'ri. 320 : 8 = 40 (bitta ulush); 40 × 3 = 120 bet.",
    wrong: "Maslahat: butunning bitta ulushi qancha? Uni topish uchun qaysi amal kerak? Surat esa nechta ulush olinganini bildiradi.",
    rule: "Butunning kasr qismi: butunni maxrajga bo'ling, natijani suratga ko'paytiring.",
  },
  ru: {
    eyebrow: 'Часть книги', setup: 'Азиза прочитала 3/8 книги в 320 страниц.',
    ask: 'Сколько страниц прочитала Азиза?', label: 'Запишите ответ:',
    correct: 'Верно. 320 : 8 = 40 (одна доля); 40 × 3 = 120 страниц.',
    wrong: 'Подсказка: сколько в одной доле целого? Каким действием её найти? А числитель показывает, сколько долей взято.',
    rule: 'Часть целого: целое делим на знаменатель, результат умножаем на числитель.',
  },
};
export default function D09_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [rev, setRev] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setRev(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 500], [2, 1300]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setRev(v), ms)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'part_of_book', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* 8 ulushli kitob polosasi, 3 bo'yalgan */}
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '8px 0' }}>
        {Array.from({ length: D05_DEN }).map((_, i) => (
          <div key={i} style={{ width: 30, height: 40, borderRadius: 4, background: i < D05_NUM ? '#0f766e' : '#ccfbf1', border: '1.5px solid ' + (i < D05_NUM ? '#0f766e' : '#99f6e4'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{i < D05_NUM ? '📖' : ''}</div>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', fontWeight: 700 }}>{lang === 'uz' ? 'Jami 320 bet · 8 ulush' : 'Всего 320 стр. · 8 долей'}</div>
      {/* bosqichli yechim */}
      <div style={{ maxHeight: rev > 0 ? 90 : 0, opacity: rev > 0 ? 1 : 0, overflow: 'hidden', transition: 'max-height .5s ease, opacity .4s ease', margin: '4px 0' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          {rev >= 1 && <span className="d9-pop" style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#fe5b1a', background: '#fff4ee', padding: '6px 11px', borderRadius: 10, border: '1.5px solid #ffd6bd' }}>320 : 8 = 40</span>}
          {rev >= 2 && <span className="d9-pop" style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43', background: '#e8f7ee', padding: '6px 11px', borderRadius: 10, border: '1.5px solid #a7f3d0' }}>40 × 3 = 120</span>}
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 16, margin: '8px 0' }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 150, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
