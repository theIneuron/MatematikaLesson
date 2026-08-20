// Dars01 · Amaliyot 08 — Harf o'rniga son · 🔴 · tag: substitute_value
// Metodist qarori 2026-08-20 (ikkinchi tur): «ortiqcha qavs» topshirig'i
// TUSHUNARSIZ deb topildi va olib tashlandi. O'rniga harfli ifoda: harf
// o'rniga son qo'yiladi va qiymat hisoblanadi.
//
// Harf o'rniga son qo'yish 6-sinfda o'tilgan (shu kursning 31-darsi
// «Harfli ifodalar»), ya'ni bu yerda takrorlash va tekshiruv.
//
// a = 4, b = −3. Qiymati 12 ga teng yozuvlarni belgilash kerak.
// Hisob (tekshirilgan):
//   a − b + 5      = 4 + 3 + 5   = 12   HA
//   a · b + 24     = −12 + 24    = 12   HA
//   (a + b) · 12   = 1 · 12      = 12   HA
//   2 · a + b      = 8 − 3       =  5   yo'q
//   a − 4 · b      = 4 + 12      = 16   yo'q
//   a · (b + 5)    = 4 · 2       =  8   yo'q
//
// Uchta yozuv 12 beradi, uchtasi bermaydi. Xato javoblar 12 ga YAQIN
// (5, 16, 8), shuning uchun ko'z bilan taxmin qilib bo'lmaydi -- oltitasini
// ham hisoblash kerak. Har xato yozuvning O'Z razbori bor.
//
// KATAKCHA-BELGI YO'Q (3-sinf kanoni §3.3): tanlangan yozuv ramka va
// to'ldirish bilan ko'rinadi, `aria-pressed` esa ekran o'qish uchun.
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row } from './frac.jsx';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 8px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '9px 0 7px' },
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

const ITEMS = [
  { id: 'p1', tokens: ['a', '−', 'b', '+', '5'], hit: true },
  { id: 'p2', tokens: ['a', '·', 'b', '+', '24'], hit: true },
  { id: 'p3', tokens: ['(', 'a', '+', 'b', ')', '·', '12'], hit: true },
  { id: 'n1', tokens: ['2', '·', 'a', '+', 'b'], hit: false },
  { id: 'n2', tokens: ['a', '−', '4', '·', 'b'], hit: false },
  { id: 'n3', tokens: ['a', '·', '(', 'b', '+', '5', ')'], hit: false },
];

const T = {
  uz: {
    eyebrow: "Harf o'rniga son", title: "Qiymati 12 ga teng",
    setup: "Harf o'rniga son qo'yilsa, harfli ifoda oddiy sonli ifodaga aylanadi va qoida o'sha-o'sha bo'lib qoladi.",
    given: "Berilgan:",
    ask: "Qiymati 12 ga teng hamma yozuvni belgilang.",
    note: "Bir nechta yozuvni belgilash mumkin.",
    correct: "To'g'ri. Uchta yozuv 12 beradi: 4 dan minus 3 ayirib 5 qo'shsak 12, minus 12 ga 24 qo'shsak 12, qavs ichida 1 chiqib 1 ni 12 ga ko'paytirsak yana 12.",
    wrongN1: "Belgilanganlar orasida 2 · a + b bor: bu 8 minus 3, ya'ni 5. Bu 12 emas.",
    wrongN2: "Belgilanganlar orasida a − 4 · b bor: 4 · b bu minus 12, manfiy sonni ayirish esa qo'shishga aylanadi, 4 + 12 = 16. Bu 12 emas.",
    wrongN3: "Belgilanganlar orasida a · (b + 5) bor: qavs ichida minus 3 ga 5 qo'shilib 2 chiqadi, keyin 4 · 2 = 8. Bu 12 emas.",
    wrongMiss: "Bittasi belgilanmadi. Manfiy sonni ayirishga e'tibor bering: 4 dan minus 3 ayirilsa 7 bo'ladi, kamaymaydi.",
    wrongNone: "Har yozuvda harf o'rniga sonni qo'yib, oxirigacha hisoblang: avval qavs va ikkinchi bosqich, keyin qo'shish va ayirish.",
  },
  ru: {
    eyebrow: "Подстановка числа", title: "Значение равно 12",
    setup: "Если вместо буквы поставить число, буквенное выражение становится обычным числовым, и правило порядка действий остаётся тем же.",
    given: "Дано:",
    ask: "Отметь все записи, значение которых равно 12.",
    note: "Можно отметить несколько записей.",
    correct: "Верно. Двенадцать дают три записи: из 4 вычесть минус 3 и прибавить 5 — двенадцать; к минус 12 прибавить 24 — двенадцать; в скобке получается 1, и 1 умножить на 12 — снова двенадцать.",
    wrongN1: "Среди отмеченных есть 2 · a + b: это 8 минус 3, то есть 5. Не 12.",
    wrongN2: "Среди отмеченных есть a − 4 · b: 4 · b это минус 12, а вычитание отрицательного превращается в сложение, 4 + 12 = 16. Не 12.",
    wrongN3: "Среди отмеченных есть a · (b + 5): в скобке минус 3 плюс 5 даёт 2, затем 4 · 2 = 8. Не 12.",
    wrongMiss: "Одну пропустил. Обрати внимание на вычитание отрицательного: из 4 вычесть минус 3 — станет 7, а не меньше.",
    wrongNone: "В каждой записи подставь число вместо буквы и досчитай до конца: сначала скобка и вторая ступень, потом сложение и вычитание.",
  },
  en: {
    eyebrow: "Substituting a number", title: "Value equal to 12",
    setup: "Once a number replaces the letter, a letter expression becomes an ordinary numeric one, and the order of operations stays the same.",
    given: "Given:",
    ask: "Mark every record whose value equals 12.",
    note: "You can mark several records.",
    correct: "Correct. Three records give 12: 4 minus minus 3 plus 5 is twelve; minus 12 plus 24 is twelve; the bracket gives 1, and 1 times 12 is twelve again.",
    wrongN1: "Among the marked ones there is 2 · a + b: that is 8 minus 3, which is 5. Not 12.",
    wrongN2: "Among the marked ones there is a − 4 · b: 4 · b is minus 12, and subtracting a negative turns into adding, 4 + 12 = 16. Not 12.",
    wrongN3: "Among the marked ones there is a · (b + 5): inside the bracket minus 3 plus 5 gives 2, then 4 · 2 = 8. Not 12.",
    wrongMiss: "One is missing. Mind the subtraction of a negative: 4 minus minus 3 becomes 7, not less.",
    wrongNone: "In each record put the number in place of the letter and work it out to the end: bracket and second stage first, then addition and subtraction.",
  },
};

export default function D01_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [marked, setMarked] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  const locked = isReview || checked;

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.marked) {
      setMarked(sa.marked);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(marked.length > 0 && !checked); }, [marked, checked, onReady]);

  const toggle = (id) => {
    if (locked) return;
    setMarked((m) => (m.indexOf(id) === -1 ? m.concat(id) : m.filter((x) => x !== id)));
  };

  const check = useCallback(() => {
    const want = ITEMS.filter((i) => i.hit).map((i) => i.id);
    const extra = marked.filter((id) => want.indexOf(id) === -1);
    const miss = want.filter((id) => marked.indexOf(id) === -1);
    const correct = extra.length === 0 && miss.length === 0;
    // Razbor: belgilangan xato yozuvning O'ZI haqida, umumiy gap emas.
    let why = 'wrongNone';
    if (extra.indexOf('n1') !== -1) why = 'wrongN1';
    else if (extra.indexOf('n2') !== -1) why = 'wrongN2';
    else if (extra.indexOf('n3') !== -1) why = 'wrongN3';
    else if (miss.length && marked.length) why = 'wrongMiss';
    setFb({ correct, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: ITEMS.map((i) => ({ id: i.id })),
      studentAnswer: { marked: marked.slice() },
      correctAnswer: { marked: want },
      correct, meta: { tag: 'substitute_value', level: '🔴', given: 'a = 4, b = −3' },
    });
  }, [marked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '5px 0', borderRadius: 12, background: '#f8fafc', border: '1px solid #eef0f4' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', textTransform: 'uppercase' }}>{t.given}</span>
        <Row tokens={['a', '=', '4']} size={22} />
        <Row tokens={['b', '=', '−3']} size={22} />
      </div>

      <p style={S.ask}>{t.ask} <span style={{ fontSize: 13, color: '#9aa1ad', fontWeight: 600 }}>{t.note}</span></p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 7 }}>
        {ITEMS.map((it) => {
          const on = marked.indexOf(it.id) !== -1;
          let bd = '#d6dae3'; let bg = '#fff';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; }
          if (checked) {
            const right = on === it.hit;
            bd = right ? '#1a7f43' : '#c0392b';
            bg = right ? '#e8f7ee' : '#fdecec';
          }
          return (
            <button key={it.id} type="button" aria-pressed={on} data-item={it.id} disabled={locked} onClick={() => toggle(it.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, padding: '5px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}>
              <Row tokens={it.tokens} size={23} />
            </button>
          );
        })}
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
