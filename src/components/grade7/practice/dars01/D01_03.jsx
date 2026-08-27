// Dars01 · Amaliyot 03 — Harfli ifodalarni qo'shish · 🟡 · tag: add_expressions
// Metodist qarori 2026-08-20 (ikkinchi tur): 3 va 4-topshiriqning tipi
// o'zgartirildi -- «harfli ifodalarni qo'shish yoki ayirish» so'raldi.
// Ilgari bu yerda qavs qo'yish topshirig'i edi.
//
// NEGA 1-DARSDA HARF BOR. Bu yangi material emas: o'xshash hadlarni yig'ish
// 6-sinfda o'tilgan (shu kursning 33-darsi). 1-dars amaliyotida u
// TAKRORLASH bo'lib turadi -- metodist shunday qaror qildi 2026-08-20.
//
// (3a + 5) + (2a − 8). Qavslar ochiladi, o'xshash hadlar yig'iladi:
//   harfli hadlar: 3a + 2a = 5a   (koeffitsientlar QO'SHILADI)
//   ozod hadlar:   5 + (−8) = −3  (minus yo'qolmaydi)
//   javob: 5a − 3
//
// Kartalar ATAYLAB qo'yilgan xatolarni tutadi:
//   6a  -- koeffitsientlarni ko'paytirgan
//   a   -- qo'shish o'rniga ayirgan
//   +13 -- 5 va 8 ni qo'shib, minusni tashlab ketgan
//   +3  -- ayirmaning ishorasini teskari olgan
//
// HAMMASI YOKI HECH NARSA: ikki bo'sh katak ham to'g'ri bo'lishi kerak.
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Row } from '../frac.jsx';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 10px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '12px 0 10px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, lineHeight: 1.4, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const EXPR = ['(', '3a', '+', '5', ')', '+', '(', '2a', '−', '8', ')'];
const ANSWER = ['5a', '−3'];
// KARTALAR TARTIBI ARALASHTIRILADI (metodist qarori 2026-08-22): bank
// javob tartibida turardi va topshiriqni chapdan o'ngga bosib yechish
// mumkin edi. Aralashtirish faqat KO'RSATISHGA tegadi -- javob va razbor
// shartlari o'zgarmaydi. 1-dars amaliyoti umumiy qatlamdan tashqarida,
// shuning uchun `shuffled` shu yerda ham kerak.
const shuffled = (n) => {
  const idx = [];
  for (let i = 0; i < n; i++) idx.push(i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = idx[i]; idx[i] = idx[j]; idx[j] = x;
  }
  return idx;
};

const CARDS = ['5a', '6a', 'a', '−3', '+13', '+3'];

const T = {
  uz: {
    eyebrow: "Harfli ifodalarni qo'shish", title: "O'xshash hadlar",
    setup: "Ikki ifoda qo'shiladi. O'xshash hadlar yig'iladi: harfli hadlar harflilar bilan, sonlar sonlar bilan.",
    ask: "Natijani kartalardan yig'ing: kartani bosing, keyin bo'sh katakni bosing.",
    bank: "Kartalar",
    correct: "To'g'ri. 3a va 2a o'xshash hadlar, koeffitsientlari qo'shiladi va 5a chiqadi. Sonlar ham qo'shiladi: 5 ga minus 8 qo'shilsa minus 3 bo'ladi.",
    wrongCoefMul: "Koeffitsientlar qo'shiladi, ko'paytirilmaydi: 3a ga 2a qo'shilsa 5a bo'ladi, 6a emas.",
    wrongCoefSub: "Bu qo'shish, ayirish emas: 3a va 2a ning koeffitsientlari qo'shiladi.",
    wrongFreeSign: "Sonlarga qarang: ikkinchi qavsda minus 8 turadi. 5 ga minus 8 qo'shilsa minus 3 chiqadi, minus yo'qolmaydi.",
    wrongOther: "Ikki narsani alohida yig'ing: harfli hadlarni harfli hadlar bilan, sonlarni sonlar bilan. Harfsiz sonni harfli hadga qo'shib bo'lmaydi.",
  },
  ru: {
    eyebrow: "Сложение буквенных выражений", title: "Подобные слагаемые",
    setup: "Складываются два выражения. Собираются подобные слагаемые: буквенные с буквенными, числа с числами.",
    ask: "Собери результат из карточек: нажми карточку, затем клетку.",
    bank: "Карточки",
    correct: "Верно. 3a и 2a подобные, их коэффициенты складываются и получается 5a. Числа тоже складываются: 5 плюс минус 8 даёт минус 3.",
    wrongCoefMul: "Коэффициенты складываются, а не умножаются: 3a плюс 2a это 5a, а не 6a.",
    wrongCoefSub: "Это сложение, а не вычитание: коэффициенты 3a и 2a складываются.",
    wrongFreeSign: "Посмотри на числа: во второй скобке стоит минус 8. Пять плюс минус восемь даёт минус три, минус не исчезает.",
    wrongOther: "Собирай отдельно: буквенные слагаемые с буквенными, числа с числами. Число без буквы к буквенному слагаемому не прибавляется.",
  },
  en: {
    eyebrow: "Adding letter expressions", title: "Like terms",
    setup: "Two expressions are added. Like terms are collected: letter terms with letter terms, numbers with numbers.",
    ask: "Assemble the result from the cards: tap a card, then tap a cell.",
    bank: "Cards",
    correct: "Correct. 3a and 2a are like terms, their coefficients add up to 5a. The numbers add up too: 5 plus minus 8 gives minus 3.",
    wrongCoefMul: "Coefficients are added, not multiplied: 3a plus 2a is 5a, not 6a.",
    wrongCoefSub: "This is addition, not subtraction: the coefficients of 3a and 2a are added.",
    wrongFreeSign: "Look at the numbers: the second bracket holds minus 8. Five plus minus eight gives minus three — the minus does not disappear.",
    wrongOther: "Collect the two parts separately: letter terms with letter terms, numbers with numbers. A number without a letter is not added to a letter term.",
  },
};

export default function D01_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  const locked = isReview || checked;
  const used = slots.filter(Boolean);
  const bank = useMemo(() => shuffled(CARDS.length).map((i) => CARDS[i]), []);
  const pool = bank.filter((c) => used.indexOf(c) === -1);
  const full = slots.every(Boolean);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.slots) {
      setSlots(sa.slots);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);

  const tapSlot = (i) => {
    if (locked) return;
    if (picked) { setSlots((s) => { const n = s.slice(); n[i] = picked; return n; }); setPicked(null); return; }
    if (slots[i]) setSlots((s) => { const n = s.slice(); n[i] = null; return n; });
  };

  const check = useCallback(() => {
    const correct = slots.join('|') === ANSWER.join('|');
    let why = 'wrongOther';
    if (slots[0] === '6a') why = 'wrongCoefMul';
    else if (slots[0] === 'a') why = 'wrongCoefSub';
    else if (slots[1] === '+13' || slots[1] === '+3') why = 'wrongFreeSign';
    setFb({ correct, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: CARDS.map((c) => ({ id: c, label: c })),
      studentAnswer: { slots: slots.slice() },
      correctAnswer: { slots: ANSWER },
      correct, meta: { tag: 'add_expressions', level: '🟡' },
    });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#cbd5e1';
  const slotBox = (i) => (
    <button type="button" disabled={locked} data-slot={i} onClick={() => tapSlot(i)}
      style={{
        minWidth: 74, height: 46, borderRadius: 11, margin: '0 5px',
        border: '2px ' + (slots[i] ? 'solid' : 'dashed') + ' ' + (slots[i] ? bd : (picked ? '#fe5b1a' : '#cbd5e1')),
        background: slots[i] ? '#fff' : (picked ? '#fff7f2' : '#f8fafc'),
        fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 24, fontWeight: 800,
        color: '#1f2430', cursor: locked ? 'default' : 'pointer',
      }}>
      {slots[i] || ''}
    </button>
  );

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0 4px' }}>
        <Row tokens={EXPR} size={25} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0 8px' }}>
        <Row tokens={['=']} size={25} />
        {slotBox(0)}
        {slotBox(1)}
      </div>

      <div style={{ fontSize: 13, color: '#9aa1ad', fontWeight: 600, margin: '4px 0 6px' }}>{t.ask}</div>
      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 7 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 46, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c} type="button" disabled={locked} data-card={c} onClick={() => setPicked(picked === c ? null : c)}
              style={{ minWidth: 62, padding: '0 10px', height: 46, borderRadius: 12, border: '2px solid ' + (picked === c ? '#fe5b1a' : '#cbd5e1'), background: picked === c ? '#fff0e8' : '#fff', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 22, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
