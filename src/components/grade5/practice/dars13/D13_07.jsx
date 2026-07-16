// Dars13 · Amaliyot 07 — Eng kichigi · 🟡 · smallest_greater
// Surati 1 bo'lgan kasrlar. 1/5 dan katta eng kichigi -> 1/4. Yagona javob.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

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
      const base = { flex: 1, minWidth: 0, padding: 0, border: 'none', background: on ? color : '#fff', boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none', transition: 'background .18s' };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer' }} />
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
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_07_DATA = { limit: 5, correct: 4, tag: 'smallest_greater', level: '🟡' };
const D13_07_T = {
  uz: {
    eyebrow: 'Kiritish', setup: "Surati 1 bo'lgan kasrlarni ko'ramiz: 1/2, 1/3, 1/4 va hokazo.",
    ask: "1/5 dan katta bo'lgan eng kichik kasrni yozing. Surat 1 bo'lib qoladi.",
    correct: "To'g'ri. 1/4 — 1/5 dan katta kasrlar ichida eng kichigi. Undan keyingisi 1/3, u yanada yirikroq.",
    wrongNotGreater: "Maslahat: sizning kasringiz 1/5 dan katta emas — u yo teng, yo kichik. Kasr kattaroq bo'lishi uchun bo'lak qanday bo'lishi kerak?",
    wrongTooBig: "Maslahat: 1/5 dan katta kasrlar ko'p, lekin sizga eng kichigi kerak — ya'ni 1/5 dan atigi bir pog'ona yirikrog'i. Qaysi bo'lak 1/5 ga eng yaqin?",
    label: "Maxrajni yozing",
  },
  ru: {
    eyebrow: 'Ввод', setup: 'Рассматриваем дроби с числителем 1: 1/2, 1/3, 1/4 и так далее.',
    ask: 'Запишите самую маленькую дробь, которая больше 1/5. Числитель остаётся 1.',
    correct: 'Верно. 1/4 — самая маленькая среди дробей больше 1/5. Следующая, 1/3, ещё крупнее.',
    wrongNotGreater: 'Подсказка: ваша дробь не больше 1/5 — она равна или меньше. Чтобы дробь была больше, какой должна быть доля?',
    wrongTooBig: 'Подсказка: дробей больше 1/5 много, но нужна самая маленькая — та, что лишь чуть крупнее 1/5. Какая доля ближе всего к 1/5?',
    label: 'Впишите знаменатель',
  },
};

export default function D13_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_07_T[lang] || D13_07_T.uz;
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
  const valid = /^\d+$/.test(val.trim()) && parseInt(val, 10) >= 2;
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);

  const check = useCallback(() => {
    const d = parseInt(val, 10);
    const correct = d === D13_07_DATA.correct;
    setFb({ correct, d }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { value: d, label: '1/' + d },
      correctAnswer: { value: 4, label: '1/4' },
      correct, meta: { tag: D13_07_DATA.tag, level: D13_07_DATA.level },
    });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const wrongText = fb && !fb.correct ? (fb.d >= 5 ? t.wrongNotGreater : t.wrongTooBig) : '';

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div className="pq-row"><Frac a={1} b={5} size={14} /><Bar n={5} k={1} height={32} /></div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '14px 0 6px' }}>
        <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>1</span>
          <span style={{ width: 56, height: 2, background: '#1f2430', margin: '4px 0' }} />
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))}
            disabled={isReview || checked} inputMode="numeric" placeholder="0"
            style={{ width: 56, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff' }} />
        </span>
        <span style={{ fontSize: 26, fontWeight: 800, color: '#6b7280' }}>{'>'}</span>
        <Frac a={1} b={5} size={22} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 13.5, color: '#9aa1ad', fontWeight: 700, margin: 0 }}>{t.label}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : wrongText} />}
    </div>
  );
}
