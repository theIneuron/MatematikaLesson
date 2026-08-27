// Dars01 · Amaliyot 07 — Qadamlar zanjiri · 🔴 · tag: value_chain
// Metodist qarori 2026-08-20: tip o'zgartirildi -- ilgari bu «to'rt
// variantdan bittasi» edi. Endi o'quvchi ORALIQ qiymatlarni to'ldiradi.
//
// NEGA KERAK. Qolgan topshiriqlar YAKUNIY javobni so'raydi, va yakuniy
// javobni ba'zan taxmin bilan ham topib olish mumkin. Bu topshiriq
// qadamlarni so'raydi: o'quvchi hisoblab chiqqanini KO'RSATADI.
//
// −2100 : 30 + (3/5) · 250. Qoida: avval ikkinchi bosqich chapdan o'ngga
// (−2100 : 30 = −70, keyin uch beshdan ikki yuz ellik = 150), so'ng
// birinchi bosqich: −70 + 150 = 80.
//
// Kartalar orasida 70 va −150 turadi -- ishorani chalkashtirganning javobi,
// hamda 220: bu −70 ni +70 deb olganda chiqadi.
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row } from '../frac.jsx';
import { useNarrow } from '../kit.jsx';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
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

const F35 = { n: 3, d: 5 };
// Uch qator: har birida bitta bo'sh katak. Katak to'ldirilgach yozuv qisqaradi.
const LINES = [
  { before: ['−2100', ':', '30', '+', F35, '·', '250', '='], after: ['+', F35, '·', '250'] },
  { before: [], after: [] },   // ikkinchi qator: −70 + [katak]
  { before: [], after: [] },   // uchinchi qator: [katak]
];
const ANSWER = ['−70', '150', '80'];
const CARDS = ['−70', '150', '80', '70', '−150', '220'];

const T = {
  uz: {
    eyebrow: 'Qadamlar zanjiri', title: 'Oraliq qiymatlar',
    setup: 'Yechim uch qadamda yoziladi. Har qatorda BITTA amal hisoblanadi.',
    ask: "Bo'sh kataklarni to'ldiring: kartani bosing, keyin bo'sh katakni bosing.",
    slot: 'katak', bank: 'Kartalar',
    correct: 'To\'g\'ri. Avval ikkinchi bosqich: −2100 : 30 = −70 va uch beshdan ikki yuz ellik 150. So\'ng −70 + 150 = 80.',
    wrongSign: 'Ishoraga qarang: −2100 ni 30 ga bo\'lganda manfiy son chiqadi. Manfiy va musbat sonni qo\'shganda katta modul yutadi.',
    wrongFrac: 'Uch beshdan ikki yuz ellikni hisoblang: ikki yuz ellikni beshga bo\'lib, uchga ko\'paytirasiz.',
    wrongOther: 'Birinchi qatorda eng chapdagi ikkinchi bosqich amali hisoblanadi -- bu bo\'lish. Uchinchi qatorda esa oldingi ikki natija qo\'shiladi.',
  },
  ru: {
    eyebrow: 'Цепочка шагов', title: 'Промежуточные значения',
    setup: 'Решение записывается в три шага. В каждой строке считается ОДНО действие.',
    ask: 'Заполни клетки: нажми карточку, затем клетку.',
    slot: 'клетка', bank: 'Карточки',
    correct: 'Верно. Сначала вторая ступень: −2100 : 30 = −70 и три пятых от двухсот пятидесяти — 150. Затем −70 + 150 = 80.',
    wrongSign: 'Посмотри на знак: −2100 разделить на 30 даёт отрицательное число. При сложении числа с разными знаками побеждает большее по модулю.',
    wrongFrac: 'Посчитай три пятых от двухсот пятидесяти: делишь на пять и умножаешь на три.',
    wrongOther: 'В первой строке считается самое левое действие второй ступени — это деление. А в третьей строке складываются два предыдущих результата.',
  },
  en: {
    eyebrow: 'Chain of steps', title: 'Intermediate values',
    setup: 'The solution is written in three steps. ONE operation is worked out in each line.',
    ask: 'Fill the cells: tap a card, then tap a cell.',
    slot: 'cell', bank: 'Cards',
    correct: 'Correct. Second stage first: −2100 : 30 = −70 and three fifths of two hundred fifty is 150. Then −70 + 150 = 80.',
    wrongSign: 'Look at the sign: −2100 divided by 30 gives a negative number. When adding numbers of different signs, the larger magnitude wins.',
    wrongFrac: 'Work out three fifths of two hundred fifty: divide by five and multiply by three.',
    wrongOther: 'In the first line the leftmost second-stage operation is worked out — the division. And in the third line the two previous results are added.',
  },
};

export default function D01_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  // Tor ekranda yozuv kichrayadi, aks holda birinchi qator ko'chib ketadi.
  const narrow = useNarrow();
  const EXPR = narrow ? 20 : 26;
  const [slots, setSlots] = useState([null, null, null]);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  const locked = isReview || checked;
  const used = slots.filter(Boolean);
  const pool = CARDS.filter((c) => used.indexOf(c) === -1);
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
    if (slots[0] === '70' || slots[2] === '220') why = 'wrongSign';
    else if (slots[1] === '−150' || (slots[1] && slots[1] !== '150')) why = 'wrongFrac';
    setFb({ correct, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { slots: slots.slice() },
      correctAnswer: { slots: ANSWER },
      correct, meta: { tag: 'value_chain', level: '🔴' },
    });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#cbd5e1';
  const slotBox = (i) => (
    <button type="button" disabled={locked} data-slot={i} onClick={() => tapSlot(i)}
      style={{
        minWidth: narrow ? 54 : 74, height: 48, borderRadius: 10, margin: '0 4px',
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

      {/* USTUNLAR BO'YICHA TEKISLASH (metodist qarori 2026-08-22): uch qadam
          ustma-ust turadi, «=» belgisi bitta ustunda. Ilgari yozuv BITTA
          uzun qator edi va ekranda ixtiyoriy joydan ko'chib ketardi.
          DIQQAT: 1-dars amaliyoti umumiy qatlamdan (kit.jsx) TASHQARIDA
          yozilgan -- u 5-sinfdan ko'chirilgan. Shuning uchun tekislash shu
          faylda takrorlanadi; qatlamdagi tuzatish bu yerga yetib kelmaydi. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', columnGap: 4, rowGap: 8, justifyContent: 'center', alignItems: 'center', width: 'fit-content', maxWidth: '100%', margin: '14px auto 10px' }}>
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Row tokens={['−2100', ':', '30', '+', F35, '·', '250']} size={EXPR} />
        </div>
        <div style={{ justifySelf: 'center' }}><Row tokens={['=']} size={EXPR} /></div>
        <div />

        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {slotBox(0)}
          <Row tokens={['+']} size={EXPR} />
          {slotBox(1)}
        </div>
        <div style={{ justifySelf: 'center' }}><Row tokens={['=']} size={EXPR} /></div>
        <div style={{ justifySelf: 'start' }}>{slotBox(2)}</div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 52, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c} type="button" disabled={locked} onClick={() => setPicked(picked === c ? null : c)}
              style={{ minWidth: 70, height: 52, borderRadius: 12, border: '2px solid ' + (picked === c ? '#fe5b1a' : '#cbd5e1'), background: picked === c ? '#fff0e8' : '#fff', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 22, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
