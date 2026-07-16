// Dars12 · Amaliyot 09 — Malikaning kasri · 🔴 · Malika · tag: two_sided_constraint
// Uch ishora (>3/10, <6/10, surat juft): yagona javob — 4/10.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- SHARED ---------- */
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const Bar = ({ n, k, color = '#fe5b1a', height = 40, onCell = null, disabled = false }) => (
  <div style={{ display: 'flex', width: '100%', border: '2px solid #1f2430', borderRadius: 8, overflow: 'hidden', height, background: '#fff' }}>
    {Array.from({ length: n }).map((_, i) => {
      const on = i < k;
      const base = {
        flex: 1, minWidth: 0, padding: 0, border: 'none',
        background: on ? color : '#fff',
        boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none',
        transition: 'background .18s',
      };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!on && !disabled && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#cbd2dc' }} />}
        </button>
      );
    })}
  </div>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #fe5b1a; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;
/* ---------- /SHARED ---------- */

const D12_09_DATA = { den: 10, lo: 3, hi: 6, correct: 4, tag: 'two_sided_constraint', level: '🔴' };
const D12_09_T = {
  uz: {
    eyebrow: 'Topish', title: 'Malikaning kasri',
    setup: "Malika maxraji 10 bo'lgan bitta kasrni o'yladi va uchta ishora berdi.",
    hints: [
      "Mening kasrim 3/10 dan katta.",
      "Mening kasrim 6/10 dan kichik.",
      "Suratim juft son.",
    ],
    ask: "Malika qaysi kasrni o'yladi?",
    correct: "To'g'ri. 3/10 va 6/10 orasida 4/10 va 5/10 bor. Ulardan surati juft bo'lgani — 4/10.",
    wrongRange: "Maslahat: kasr 3/10 dan katta va 6/10 dan kichik bo'lishi kerak. Sizniki bu oraliqdan tashqarida.",
    wrongParity: "Maslahat: oraliqqa tushdingiz. Endi uchinchi ishorani qo'llang — surat juft son bo'lishi kerak.",
    label: 'Suratni yozing',
  },
  ru: {
    eyebrow: 'Поиск', title: 'Дробь Малики',
    setup: 'Малика загадала дробь со знаменателем 10 и дала три подсказки.',
    hints: [
      'Моя дробь больше 3/10.',
      'Моя дробь меньше 6/10.',
      'Мой числитель — чётное число.',
    ],
    ask: 'Какую дробь загадала Малика?',
    correct: 'Верно. Между 3/10 и 6/10 стоят 4/10 и 5/10. Из них чётный числитель у 4/10.',
    wrongRange: 'Подсказка: дробь должна быть больше 3/10 и меньше 6/10. Ваша вне этого промежутка.',
    wrongParity: 'Подсказка: в промежуток вы попали. Теперь примените третью подсказку — числитель чётный.',
    label: 'Впишите числитель',
  },
};

export default function D12_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_09_T[lang] || D12_09_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.value != null) {
      setVal(String(sa.value));
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  const valid = /^\d+$/.test(val.trim());
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);

  const check = useCallback(() => {
    const n = parseInt(val, 10);
    const inRange = n > D12_09_DATA.lo && n < D12_09_DATA.hi;
    const correct = n === D12_09_DATA.correct;
    setFb({ correct, inRange }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { value: n, label: n + '/10' },
      correctAnswer: { value: 4, label: '4/10' },
      correct, meta: { tag: D12_09_DATA.tag, level: D12_09_DATA.level, partial: !correct && inRange ? 'range_ok' : null },
    });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const wrongText = fb && !fb.correct ? (fb.inRange ? t.wrongParity : t.wrongRange) : '';

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div style={{ margin: '12px 0 16px' }}>
        {t.hints.map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '11px 14px', borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0', marginBottom: 7, fontSize: 15, fontWeight: 600, color: '#374151' }}>
            <span style={{ minWidth: 24, height: 24, borderRadius: 999, background: '#e0e7ff', color: '#4338ca', fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            <span>{h}</span>
          </div>
        ))}
      </div>
      <div className="pq-row"><Frac a={3} b={10} size={14} /><Bar n={10} k={3} height={26} /></div>
      <div className="pq-row"><Frac a={6} b={10} size={14} /><Bar n={10} k={6} height={26} color="#7c3aed" /></div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '10px 0 4px' }}>
        <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))}
            disabled={isReview || checked} inputMode="numeric" placeholder="0"
            style={{ width: 56, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff' }} />
          <span style={{ width: 56, height: 2, background: '#1f2430', margin: '4px 0' }} />
          <span style={{ fontSize: 22, fontWeight: 700 }}>10</span>
        </span>
      </div>
      <p style={{ textAlign: 'center', fontSize: 13.5, color: '#9aa1ad', fontWeight: 700, margin: 0 }}>{t.label}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : wrongText} />}
    </div>
  );
}
