// Dars25 · Amaliyot 03 — Razryadli solishtirish · 🔴 · tag: compare_place
// 0,62 va 0,7. Markaziy xato: "62 > 7, demak 0,62 katta". To'g'ri: o'ndan 6 < 7 → 0,62 < 0,7.
// Hal qiluvchi xona OLDINDAN belgilanmaydi (hi=null) — o'quvchi o'zi topadi.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// Razryad taxtasi: butun , o'ndan yuzdan. deciding = 'o' (o'ndan xonasi hal qiladi)
function PlaceRow({ b, t, h, hi }) {
  const cell = (v, key, on) => (
    <div key={key} style={{ width: 40, height: 44, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 24, fontWeight: 800, color: on ? '#7c3aed' : '#1f2430', background: on ? '#f3e8ff' : '#f8fafc', border: '2px solid ' + (on ? '#c4b5fd' : '#e2e8f0') }}>{v}</div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {cell(b, 'b', false)}
      <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>,</span>
      {cell(t, 't', hi === 'o')}
      {cell(h == null ? '' : h, 'h', false)}
    </div>
  );
}

const D03_OPTS = ['<', '=', '>'];
const D03_CORRECT = 0; // 0,62 < 0,7
const D03_T = {
  uz: {
    eyebrow: 'Solishtir', setup: "Zaynab 0,62 va 0,7 sonlarini razryad taxtasiga yozdi. Endi ular orasiga to'g'ri belgini qo'yish kerak.",
    ask: "Kerakli belgini qo'y: 0,62 __ 0,7",
    correct: "To'g'ri. o'ndan xonasi: 6 < 7, shuning uchun 0,62 < 0,7. Raqamlar soni emas, xona qiymati muhim.",
    wrong: "Sonlarni qaysi xonadan boshlab solishtirdingiz? Eng katta xonadan qayta ko'ring.",
    rule: "Xonama-xona solishtir (o'ndandan boshla). 6 < 7 → 0,62 < 0,7.",
  },
  ru: {
    eyebrow: 'Сравни', setup: 'Зайнаб записала числа 0,62 и 0,7 в разрядную таблицу. Теперь между ними нужно поставить верный знак.',
    ask: 'Поставь нужный знак: 0,62 __ 0,7',
    correct: 'Верно. Разряд десятых: 6 < 7, поэтому 0,62 < 0,7. Важно значение разряда, а не число цифр.',
    wrong: 'С какого разряда ты начал сравнивать? Проверь снова, начиная со старшего.',
    rule: 'Сравнивай поразрядно (с десятых). 6 < 7 → 0,62 < 0,7.',
  },
};

export default function D25_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D03_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D03_CORRECT }, correct, meta: { tag: 'compare_place', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '10px 0' }}>
        <div style={{ display: 'flex', gap: 4, ...S.mono, fontSize: 11, fontWeight: 800, color: '#7c3aed', paddingLeft: 45 }}>
          <span style={{ width: 45 }}>{lang === 'uz' ? "o'ndan" : 'десят.'}</span><span style={{ width: 40 }}>{lang === 'uz' ? 'yuzdan' : 'сотые'}</span>
        </div>
        <PlaceRow b={0} t={6} h={2} hi={null} />
        <PlaceRow b={0} t={7} h={null} hi={null} />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {D03_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D03_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ width: 66, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 30, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
