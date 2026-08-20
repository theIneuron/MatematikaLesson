// Dars01 · Amaliyot 06 — Xato qatorni tuzatish · 🟡 · tag: fix_line
// Metodist qarori 2026-08-20: 3-8 topshiriqlarning tiplari o'zgartirildi.
// Ilgari bu yerda «to'rt variantdan bittasi» edi; endi o'quvchi to'g'ri
// qatorni O'ZI yig'adi -- «xatoni topish» janrining KUCHLI shakli
// (3-sinf kanoni §4.1: variantdan tanlash kuchsiz shakl).
//
// ODDIY KASR ham qo'shildi (metodist qarori 2026-08-20): 5/6 ikki qavatli
// yoziladi, o'nli kasr esa 5-topshiriqda. O'quvchi 6-sinfda kasrni yaxshi
// biladi, shuning uchun bu takrorlash, lekin misolning darajasi ko'tariladi.
//
// Yozuv: 5/6 · 720 − 90. Qoida: avval ko'paytirish (5/6 · 720 = 600),
// keyin ayirish (600 − 90 = 510).
// Boshqa o'quvchining xatosi: ayirish OLDIN bajarilgan -- 720 − 90 = 630, va
// qatorga «5/6 · 630» yozilgan.
// To'g'ri keyingi qator: 600 − 90.
//
// TEKSHIRUV YOZUV BO'YICHA (`answerSeq`), qiymat bo'yicha emas: «510» ham
// 510 ni beradi, lekin u KEYINGI emas, oxirgi qator.
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row } from '../frac.jsx';

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

const GIVEN = [
  { tokens: [{ n: 5, d: 6 }, '·', '720', '−', '90'] },
  { tokens: [{ n: 5, d: 6 }, '·', '630'], bad: true },
];
const CARDS = [
  { id: 'c600', label: '600' },
  { id: 'c90', label: '90' },
  { id: 'cminus', label: '−' },
  { id: 'c630', label: '630' },
  { id: 'c510', label: '510' },
  { id: 'c720', label: '720' },
];
const ANSWER = ['600', '−', '90'];

const T = {
  uz: {
    eyebrow: 'Xatoni tuzatish', title: 'Ikkinchi qator',
    setup: "Boshqa o'quvchining yechimi. Ikkinchi qator xato.",
    ask: "To'g'ri ikkinchi qatorni kartalardan yig'ing.",
    empty: "Kartalarni bosib qator yig'ing",
    undo: 'Bitta orqaga',
    yours: 'Sizda:', answer: 'To\'g\'ri:',
    correct: "To'g'ri. Avval ko'paytirish bajariladi: besh oltidan yetti yuz yigirma -- olti yuz. Ayirish esa keyingi qatorda.",
    wrongSub: "Ayirish OLDIN bajarilgan: yetti yuz yigirmadan to'qsonni ayirib olti yuz o'ttiz chiqarilgan. Lekin ko'paytirish ikkinchi bosqich, u birinchi bajariladi.",
    wrongLast: "Bu allaqachon OXIRGI qator: siz ikki qadamni birga bajardingiz. Ikkinchi qatorda faqat ko'paytirish hisoblanadi.",
    wrongOther: "Ikkinchi qatorda BITTA amal bajariladi -- ikkinchi bosqichdagi ko'paytirish. Besh oltidan yetti yuz yigirmani hisoblang.",
  },
  ru: {
    eyebrow: 'Исправь ошибку', title: 'Вторая строка',
    setup: 'Решение другого ученика. Вторая строка неверна.',
    ask: 'Собери из карточек верную вторую строку.',
    empty: 'Собери строку, нажимая карточки',
    undo: 'На шаг назад',
    yours: 'У тебя:', answer: 'Верно:',
    correct: 'Верно. Первым выполняется умножение: пять шестых от семисот двадцати — шестьсот. А вычитание идёт в следующей строке.',
    wrongSub: 'Вычитание выполнено РАНЬШЕ: из семисот двадцати вычли девяносто и получили шестьсот тридцать. Но умножение — вторая ступень, оно идёт первым.',
    wrongLast: 'Это уже ПОСЛЕДНЯЯ строка: ты выполнил два шага сразу. Во второй строке считается только умножение.',
    wrongOther: 'Во второй строке выполняется ОДНО действие — умножение второй ступени. Посчитай пять шестых от семисот двадцати.',
  },
  en: {
    eyebrow: 'Fix the mistake', title: 'The second line',
    setup: "Another person's solution. The second line is wrong.",
    ask: 'Build the correct second line from the cards.',
    empty: 'Build the line by tapping cards',
    undo: 'One step back',
    yours: 'You:', answer: 'Correct:',
    correct: 'Correct. The multiplication runs first: five sixths of seven hundred twenty is six hundred. The subtraction comes in the next line.',
    wrongSub: 'The subtraction ran FIRST: ninety was taken from seven hundred twenty giving six hundred thirty. But multiplication is the second stage, it goes first.',
    wrongLast: 'That is already the LAST line: you did two steps at once. In the second line only the multiplication is worked out.',
    wrongOther: 'In the second line ONE operation runs — the second-stage multiplication. Work out five sixths of seven hundred twenty.',
  },
};

export default function D01_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [seq, setSeq] = useState([]);
  const [pos, setPos] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  const locked = isReview || checked;
  const labelOf = (id) => CARDS.find((c) => c.id === id).label;
  const line = seq.map(labelOf);
  const ready = seq.length > 0 && !checked;

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.seq) {
      setSeq(sa.seq);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct, line: sa.label }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(ready); }, [ready, onReady]);

  const put = (id) => { if (locked) return; setSeq((p) => p.slice(0, pos).concat(id, p.slice(pos))); setPos((p) => p + 1); };
  const undo = () => { if (locked || pos === 0) return; setSeq((p) => p.slice(0, pos - 1).concat(p.slice(pos))); setPos((p) => Math.max(0, p - 1)); };

  const check = useCallback(() => {
    const got = seq.map(labelOf);
    const correct = got.join('|') === ANSWER.join('|');
    let why = 'wrongOther';
    const j = got.join(' ');
    if (j === '630' || j.indexOf('630') !== -1) why = 'wrongSub';
    else if (j === '510') why = 'wrongLast';
    setFb({ correct, line: j, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { seq: seq.slice(), label: j },
      correctAnswer: { label: ANSWER.join(' ') },
      correct, meta: { tag: 'fix_line', level: '🟡' },
    });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const caret = (i) => (
    <button key={'c' + i} type="button" disabled={locked} onClick={() => setPos(i)} aria-label="caret"
      style={{ width: 10, minHeight: 34, border: 0, background: 'none', padding: 0, cursor: locked ? 'default' : 'pointer', position: 'relative' }}>
      <span style={{ position: 'absolute', left: '50%', top: '12%', bottom: '12%', width: 2, transform: 'translateX(-50%)', borderRadius: 2, background: pos === i && !locked ? '#fe5b1a' : 'transparent' }} />
    </button>
  );

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      {/* BERILGAN: chet kishining yechimi. O'qiladi, bosilmaydi. */}
      <div style={{ borderRadius: 14, background: '#f1f5f9', border: '1.5px solid #e2e8f0', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10 }}>
        {GIVEN.map((r, i) => (
          <Row key={i} tokens={r.tokens} size={23} color={r.bad ? '#b45309' : '#5c6672'} tone={!r.bad} />
        ))}
      </div>

      {/* BO'SH MAYDON */}
      <div style={{ minHeight: 62, borderRadius: 16, border: '2px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 12px', marginBottom: 8, flexWrap: 'wrap' }}>
        {seq.length === 0 ? (
          <>{caret(0)}<span style={{ fontSize: 15, fontWeight: 600, color: '#9aa1ad' }}>{t.empty}</span></>
        ) : (
          <>
            {line.map((lab, i) => (
              <React.Fragment key={i}>
                {caret(i)}
                <button type="button" disabled={locked} onClick={() => setPos(i)}
                  style={{ border: 0, background: 'none', padding: '0 2px', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 26, fontWeight: 800, color: lab === '−' ? '#7A4FA3' : '#1f2430', cursor: locked ? 'default' : 'pointer' }}>
                  {lab}
                </button>
              </React.Fragment>
            ))}
            {caret(line.length)}
          </>
        )}
      </div>

      <div style={{ fontSize: 13, color: '#9aa1ad', fontWeight: 600, margin: '2px 0 6px' }}>{t.ask}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {CARDS.map((c) => {
          const used = seq.indexOf(c.id) !== -1;
          return (
            <button key={c.id} type="button" disabled={used || locked} onClick={() => put(c.id)}
              style={{ minWidth: 56, height: 48, borderRadius: 13, border: '2px solid ' + (used ? '#eef0f4' : '#cbd5e1'), background: used ? '#f8fafc' : '#fff', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 22, fontWeight: 800, color: used ? '#cbd5e1' : (c.label === '−' ? '#7A4FA3' : '#1f2430'), cursor: (used || locked) ? 'default' : 'pointer' }}>
              {c.label}
            </button>
          );
        })}
        <button type="button" disabled={locked || pos === 0} onClick={undo}
          style={{ marginLeft: 6, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #d6dae3', background: '#fff', color: (locked || pos === 0) ? '#c2c8d2' : '#374151', fontSize: 13.5, fontWeight: 700, cursor: (locked || pos === 0) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {t.undo}
        </button>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
