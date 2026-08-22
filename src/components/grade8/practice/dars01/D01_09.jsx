// Dars01 · Amaliyot 09 — Yozuvni yig'ish · 🔴 · tag: build_value
// Metodist qarori 2026-08-20: oldingi «qadam bosish» topshirig'i MASHQQA
// o'xshab qolgan edi -- o'quvchi tugmani bosib o'ynardi, bilim esa
// tekshirilmasdi. Amaliyot TOPSHIRIQ va BILIM TEKSHIRUVI bo'lishi kerak.
// Shu sababli u yerga eski amaliyotning 9-topshirig'i keldi: kartalardan
// berilgan qiymatli yozuv YIG'ILADI.
//
// Kartalar: −15 60 20 − · ( ). Hammasi ishlatiladi. Javob: −15 · (60 − 20)
// yoki (60 − 20) · −15 -- ikkalasi ham minus olti yuzni beradi. Qavssiz bunday
// qiymat chiqmaydi: qavsni matematikaning O'ZI talab qiladi.
//
// MISOLNING DARAJASI ko'tarildi (metodist qarori 2026-08-20): manfiy son
// kartada turadi, javob ham manfiy. Manfiy sonlar 6-sinf materiali, ya'ni
// bu takrorlash, lekin misol boshlang'ich sinf darajasidan chiqadi.
//
// KARTA ISTALGAN JOYGA TUSHADI: yozuvda kursor bor, uni belgini bosib
// ko'chirasiz. Aks holda «(5 − 2)» ni olish uchun qavsni BESHDAN OLDIN
// bosish kerak bo'lardi -- odam esa avval «5 − 2» ni yozadi.
//
// QIYMAT TEKSHIRISHDAN KEYIN KO'RINADI (etalon §8.1): jonli o'lchagich
// topshiriqni «sonni tutib olish» ga aylantirardi.
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

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

const CARDS = [
  { id: 'nm15', label: '−15', kind: 'num', value: -15 },
  { id: 'n60', label: '60', kind: 'num', value: 60 },
  { id: 'n20', label: '20', kind: 'num', value: 20 },
  { id: 'minus', label: '−', kind: 'op' },
  { id: 'mul', label: '·', kind: 'op' },
  { id: 'op', label: '(', kind: 'open' },
  { id: 'cl', label: ')', kind: 'close' },
];
const TARGET = -600;
const PREC = { '·': 2, ':': 2, '+': 1, '−': 1 };

// Yig'ilgan yozuvni hisoblaydi. Yozuv tugallanmagan bo'lsa null -- bu «xato»
// emas, «hali yozuv emas» degani.
const evalSeq = (items) => {
  const out = []; const ops = [];
  let expectNum = true;
  const apply = () => {
    const op = ops.pop(); const b = out.pop(); const a = out.pop();
    if (op === undefined || a === undefined || b === undefined) return false;
    if (op === '+') { out.push(a + b); return true; }
    if (op === '−') { out.push(a - b); return true; }
    if (op === '·') { out.push(a * b); return true; }
    if (op === ':') { if (b === 0) return false; out.push(a / b); return true; }
    return false;
  };
  for (const it of items) {
    if (!it) return null;
    if (it.kind === 'num') { if (!expectNum) return null; out.push(it.value !== undefined ? it.value : Number(it.label)); expectNum = false; }
    else if (it.kind === 'op') {
      if (expectNum) return null;
      while (ops.length && PREC[ops[ops.length - 1]] >= PREC[it.label]) { if (!apply()) return null; }
      ops.push(it.label); expectNum = true;
    } else if (it.kind === 'open') { if (!expectNum) return null; ops.push('('); }
    else if (it.kind === 'close') {
      if (expectNum) return null;
      while (ops.length && ops[ops.length - 1] !== '(') { if (!apply()) return null; }
      if (ops.pop() !== '(') return null;
      expectNum = false;
    } else return null;
  }
  if (expectNum) return null;
  while (ops.length) { if (ops[ops.length - 1] === '(') return null; if (!apply()) return null; }
  return out.length === 1 ? out[0] : null;
};

const T = {
  uz: {
    eyebrow: 'Yozuvni yig\'ish', title: 'Qiymati −600',
    setup: 'Hamma kartadan foydalanib, qiymati −600 ga teng yozuv yig\'ing.',
    ask: 'Kartani bosing. Kursorni ko\'chirish uchun yozuvdagi belgini bosing.',
    empty: 'Kartalarni bosib yozuv yig\'ing',
    left: 'qoldi',
    undo: 'Bitta orqaga',
    value: 'Sizda chiqdi:',
    answer: 'Javob:',
    correct: 'To\'g\'ri. Qavs ayirishni birinchi qildi: 60 − 20 = 40, keyin −15 · 40 = −600.',
    wrongNegSub: "Manfiy sonni AYIRISH uni qo'shish bilan bir xil: 60 − (−15) = 75. Shuning uchun qiymat kattalashib ketdi. Qavs ichida ayirish qaysi ikki son orasida turishi kerak.",
    wrongProduct: 'Qavs ko\'paytirishga tushdi, u esa qavssiz ham birinchi bajariladi -- bunday qavs ORTIQCHA, qiymat o\'zgarmadi.',
    wrongPair: 'Qavs joyida -- u ayirishni birinchi qildi. Lekin ayrilgan sonlar boshqa: nimaga ko\'paytirayotganingizga qarang.',
    wrongRev: "Ayirish teskari tomonga ketdi: kichikdan katta ayrildi va qiymat ijobiy chiqdi. Ayirishda tartib ishorani ag'daradi.",
    wrongOther: "Yozuv minus olti yuzni bermadi. Olti yuz bu qirq marta o'n besh -- qirqni qaysi amal beradi.",
  },
  ru: {
    eyebrow: 'Сборка записи', title: 'Значение −600',
    setup: 'Собери запись со значением −600, использовав все карточки.',
    ask: 'Нажми карточку. Чтобы перенести курсор, нажми на символ в записи.',
    empty: 'Собери запись, нажимая карточки',
    left: 'осталось',
    undo: 'На шаг назад',
    value: 'У тебя вышло:',
    answer: 'Ответ:',
    correct: 'Верно. Скобка сделала вычитание первым: 60 − 20 = 40, затем −15 · 40 = −600.',
    wrongNegSub: 'Вычесть отрицательное — то же, что прибавить: 60 − (−15) = 75. Поэтому значение выросло. Подумай, между какими двумя числами должно стоять вычитание в скобке.',
    wrongProduct: 'Скобка попала на умножение, а оно и без скобки идёт первым — такая скобка ЛИШНЯЯ, значение не изменилось.',
    wrongPair: 'Скобка на месте — она сделала вычитание первым. Но вычитались другие числа: посмотри, на что ты умножаешь.',
    wrongRev: 'Вычитание пошло в другую сторону: из меньшего вычли большее, и значение вышло положительным. В вычитании порядок переворачивает знак.',
    wrongOther: 'Запись не дала минус шестисот. Шестьсот это сорок раз по пятнадцать — какое действие даёт сорок?',
  },
  en: {
    eyebrow: 'Building a record', title: 'Value −600',
    setup: 'Use every card to build an expression whose value is −600.',
    ask: 'Tap a card. To move the caret, tap a symbol in the record.',
    empty: 'Build the expression by tapping cards',
    left: 'left',
    undo: 'One step back',
    value: 'You got:',
    answer: 'Answer:',
    correct: 'Correct. The bracket made the subtraction go first: 60 − 20 = 40, then −15 · 40 = −600.',
    wrongNegSub: 'Subtracting a negative is the same as adding: 60 − (−15) = 75. That is why the value grew. Think about which two numbers the subtraction should stand between.',
    wrongProduct: 'The bracket landed on the multiplication, which goes first anyway — that bracket is REDUNDANT and the value did not change.',
    wrongPair: 'The bracket is right, it made the subtraction go first. But the wrong pair was subtracted: look at what you are multiplying by.',
    wrongRev: 'The subtraction ran the other way: the larger was taken from the smaller and the value came out positive. In subtraction the order flips the sign.',
    wrongOther: 'The record did not give minus six hundred. Six hundred is forty times fifteen — which operation gives forty?',
  },
};

// Bosqich rangi -- sinf tili: ikkinchi bosqich ko'k, birinchi binafsha,
// qavs feruza.
const toneOf = (c) => {
  if (!c) return '#1f2430';
  if (c.kind === 'open' || c.kind === 'close') return '#0f766e';
  if (c.label === '·' || c.label === ':') return '#2C5FA8';
  if (c.label === '+' || c.label === '−') return '#7A4FA3';
  return '#1f2430';
};

export default function D01_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [seq, setSeq] = useState([]);
  const [pos, setPos] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(null);

  const byId = (id) => CARDS.find((c) => c.id === id);
  const items = seq.map(byId);
  const value = evalSeq(items);
  const hasBr = items.some((x) => x && x.kind === 'open');
  const left = CARDS.length - seq.length;
  const locked = isReview || checked;
  const ready = value !== null && left === 0 && !checked;

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.seq) {
      setSeq(sa.seq);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShown(sa.value ?? null); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(ready); }, [ready, onReady]);

  const put = (id) => {
    if (locked) return;
    setSeq((p) => p.slice(0, pos).concat(id, p.slice(pos)));
    setPos((p) => p + 1);
    setShown(null);
  };
  const undo = () => {
    if (locked || pos === 0) return;
    setSeq((p) => p.slice(0, pos - 1).concat(p.slice(pos)));
    setPos((p) => Math.max(0, p - 1));
    setShown(null);
  };

  const check = useCallback(() => {
    const val = evalSeq(seq.map(byId));
    const br = seq.map(byId).some((x) => x && x.kind === 'open');
    const correct = val === TARGET;
    let why = 'wrongOther';
    if (val === 600) why = 'wrongRev';
    else if ([1125, 1500].indexOf(val) !== -1) why = 'wrongNegSub';
    else if ([1260, -1215, 360].indexOf(val) !== -1) why = 'wrongProduct';
    else if ([-1500, -1125].indexOf(val) !== -1) why = 'wrongPair';
    setShown(val);
    setFb({ correct, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.setup, options: [],
      studentAnswer: { seq: seq.slice(), value: val, label: seq.map((id) => byId(id).label).join(' ') },
      correctAnswer: { value: TARGET, label: '−15 · ( 60 − 20 )' },
      correct, meta: { tag: 'build_value', level: '🔴' },
    });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const caret = (i) => (
    <button key={'c' + i} type="button" disabled={locked} onClick={() => setPos(i)}
      aria-label="caret"
      style={{ width: 10, minHeight: 34, border: 0, background: 'none', padding: 0, cursor: locked ? 'default' : 'pointer', position: 'relative' }}>
      <span style={{ position: 'absolute', left: '50%', top: '12%', bottom: '12%', width: 2, transform: 'translateX(-50%)', borderRadius: 2, background: pos === i && !locked ? '#fe5b1a' : 'transparent' }} />
    </button>
  );

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      {/* BO'SH MAYDON: yozuv shu yerda yig'iladi. */}
      <div style={{ minHeight: 96, borderRadius: 16, border: '2px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 12px', margin: '4px 0 14px', flexWrap: 'wrap' }}>
        {items.length === 0 ? (
          <>
            {caret(0)}
            <span style={{ fontSize: 15, fontWeight: 600, color: '#9aa1ad' }}>{t.empty}</span>
          </>
        ) : (
          <>
            {items.map((it, i) => (
              <React.Fragment key={i}>
                {caret(i)}
                <button type="button" disabled={locked} onClick={() => setPos(i)}
                  style={{ border: 0, background: 'none', padding: '0 2px', font: 'inherit', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 30, fontWeight: 800, color: toneOf(it), cursor: locked ? 'default' : 'pointer' }}>
                  {it.label}
                </button>
              </React.Fragment>
            ))}
            {caret(items.length)}
          </>
        )}
      </div>

      {shown !== null && (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#9aa1ad', letterSpacing: '.05em', textTransform: 'uppercase' }}>{fb?.correct ? t.answer : t.value}</div>
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 30, fontWeight: 800, color: fb?.correct ? '#1a7f43' : '#c0392b' }}>{shown}</div>
        </div>
      )}

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {CARDS.map((c) => {
          const used = seq.indexOf(c.id) !== -1;
          return (
            <button key={c.id} type="button" disabled={used || locked} onClick={() => put(c.id)}
              style={{ minWidth: 52, padding: '0 9px', height: 58, borderRadius: 13, border: '2px solid ' + (used ? '#eef0f4' : '#cbd5e1'), background: used ? '#f8fafc' : '#fff', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 25, fontWeight: 800, color: used ? '#cbd5e1' : toneOf(c), cursor: (used || locked) ? 'default' : 'pointer' }}>
              {c.label}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: left ? '#b45309' : '#1a7f43' }}>{t.left} {left}</span>
        <button type="button" disabled={locked || pos === 0} onClick={undo}
          style={{ padding: '10px 16px', borderRadius: 12, border: '1.5px solid #d6dae3', background: '#fff', color: (locked || pos === 0) ? '#c2c8d2' : '#374151', fontSize: 14.5, fontWeight: 700, cursor: (locked || pos === 0) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {t.undo}
        </button>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
