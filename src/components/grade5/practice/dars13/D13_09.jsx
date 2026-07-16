// Dars13 · Amaliyot 09 — Dalerning kasri · 🔴 · two_sided_constraint
// To'rtta ishora. Distraktorlarda maxraji to'g'ri, lekin surati boshqa kartalar bor —
// birinchi ishorani o'qimagan bola aynan shu yerda qoqiladi. Javob: 3/6.
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
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_09_CARDS = [
  { a: 3, b: 4 }, { a: 2, b: 6 }, { a: 3, b: 5 }, { a: 3, b: 6 },
  { a: 3, b: 7 }, { a: 3, b: 8 }, { a: 4, b: 6 },
];
const D13_09_DATA = { a: 3, b: 6, tag: 'two_sided_constraint', level: '🔴' };
const D13_09_T = {
  uz: {
    eyebrow: 'Topish', setup: "Daler bitta kasrni o'yladi va to'rtta ishora berdi.",
    hints: [
      "Men uchta bo'lak oldim.",
      "Mening kasrim 3/8 dan katta.",
      "Mening kasrim 3/5 dan kichik.",
      "Maxrajim juft son.",
    ],
    ask: "Daler qaysi kasrni o'yladi? Kartani bosing.",
    correct: "To'g'ri. Surat 3. 3/8 dan katta va 3/5 dan kichik kasrlar: 3/6 va 3/7. Ulardan maxraji juft bo'lgani — 3/6.",
    wrongNum: "Maslahat: birinchi ishorani qayta o'qing. Nechta bo'lak olingani kasrning qaysi qismini belgilaydi?",
    wrongRange: "Maslahat: surat to'g'ri. Ikkinchi va uchinchi ishoralar kasrni ikki tomondan chegaralaydi — qaysi kartalar shu oraliqqa tushadi?",
    wrongParity: "Maslahat: deyarli topdingiz — oraliqda ikkita nomzod qoldi. To'rtinchi ishora ulardan qaysi birini qoldiradi?",
  },
  ru: {
    eyebrow: 'Поиск', setup: 'Далер загадал дробь и дал четыре подсказки.',
    hints: [
      'Я взял три доли.',
      'Моя дробь больше 3/8.',
      'Моя дробь меньше 3/5.',
      'Мой знаменатель — чётное число.',
    ],
    ask: 'Какую дробь загадал Далер? Нажмите на карточку.',
    correct: 'Верно. Числитель 3. Больше 3/8 и меньше 3/5 — это 3/6 и 3/7. Из них чётный знаменатель у 3/6.',
    wrongNum: 'Подсказка: перечитайте первую подсказку. Сколько взято долей — это какая часть дроби?',
    wrongRange: 'Подсказка: числитель верный. Вторая и третья подсказки ограничивают дробь с двух сторон — какие карточки попадают в этот промежуток?',
    wrongParity: 'Подсказка: почти нашли — в промежутке осталось два кандидата. Какого из них оставляет четвёртая подсказка?',
  },
};

export default function D13_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_09_T[lang] || D13_09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); // indeks
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const correctIdx = D13_09_CARDS.findIndex((c) => c.a === D13_09_DATA.a && c.b === D13_09_DATA.b);

  const check = useCallback(() => {
    const c = D13_09_CARDS[picked];
    const numOk = c.a === 3;
    const rangeOk = numOk && c.b > 5 && c.b < 8;
    const correct = picked === correctIdx;
    setFb({ correct, numOk, rangeOk }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: D13_09_CARDS.map((k, i) => ({ id: String(i), label: k.a + '/' + k.b })),
      studentAnswer: { idx: picked, label: c.a + '/' + c.b },
      correctAnswer: { idx: correctIdx, label: '3/6' },
      correct, meta: { tag: D13_09_DATA.tag, level: D13_09_DATA.level, partial: !correct ? (rangeOk ? 'range_ok' : numOk ? 'num_ok' : null) : null },
    });
  }, [picked, correctIdx, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // Xato javobda to'g'ri karta yoritilmaydi — faqat tanlangani qizil bo'ladi.
  const cardStyle = (i) => {
    const on = picked === i;
    let bd = '#cbd5e1', bg = '#fff';
    if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; }
    if (checked) {
      if (on) { const ok = i === correctIdx; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
      else { bd = '#e5e7eb'; bg = '#fff'; }
    }
    return { width: 60, height: 78, borderRadius: 14, border: '2px solid ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' };
  };

  const wrongText = !fb || fb.correct ? '' : fb.rangeOk ? t.wrongParity : fb.numOk ? t.wrongRange : t.wrongNum;

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div style={{ margin: '12px 0 16px' }}>
        {t.hints.map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 13px', borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0', marginBottom: 6, fontSize: 14.5, fontWeight: 600, color: '#374151' }}>
            <span style={{ minWidth: 23, height: 23, borderRadius: 999, background: '#e0e7ff', color: '#4338ca', fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{i + 1}</span>
            <span>{h}</span>
          </div>
        ))}
      </div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D13_09_CARDS.map((c, i) => (
          <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={cardStyle(i)}>
            <Frac a={c.a} b={c.b} size={19} />
          </button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : wrongText} />}
    </div>
  );
}
