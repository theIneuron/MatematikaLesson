// Dars01 · Amaliyot 10 — Eng kichik son · 🔴 · Nilufar · tag: build_smallest
// Raqam kartalaridan eng KICHIK yetti xonali sonni yasash. Nol boshida tura olmaydi.
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
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const CARDS = [{ id: 'a', d: 5 }, { id: 'b', d: 0 }, { id: 'c', d: 3 }, { id: 'e', d: 9 }, { id: 'f', d: 1 }, { id: 'g', d: 0 }, { id: 'h', d: 7 }];
const TARGET = '1003579';
const T = {
  uz: {
    eyebrow: 'Topishmoq', title: 'Eng kichik son',
    setup: "Nilufarda yettita raqamli karta bor. Ulardan yetti xonali son yasash kerak. Har bir karta bir marta ishlatiladi.",
    ask: "Eng kichik sonni yasang. Raqamli kartani bosing, keyin bo'sh katakni bosing.",
    classes: ['MILLION', 'MING', 'BIRLIK'],
    bank: 'Raqamli kartalar',
    hint: "Qo'yilgan raqamli kartani bosib qaytarib olish mumkin.",
    correct: "To'g'ri. Nol birinchi o'ringa tura olmaydi — u sonni olti xonali qilib qo'yadi. Shuning uchun oldin 1, keyin ikkala nol, keyin qolganlari o'sish tartibida.",
    wrongLeadZero: "Maslahat: birinchi katakda nol tursa, son yetti xonali bo'lib qolmaydi. Boshiga qaysi raqam kelishi kerak?",
    wrongOrder: "Maslahat: chapdagi katak eng qimmat — u millionni bildiradi. Kichik raqamlar chapga, katta raqamlar o'ngga.",
  },
  ru: {
    eyebrow: 'Загадка', title: 'Самое маленькое число',
    setup: 'У Нилуфар семь карточек с цифрами. Из них нужно составить семизначное число. Каждая карточка используется один раз.',
    ask: 'Составьте самое маленькое число. Нажмите числовую карточку, затем пустую клетку.',
    classes: ['МИЛЛИОН', 'ТЫСЯЧА', 'ЕДИНИЦА'],
    bank: 'Числовые карточки',
    hint: 'Поставленную числовую карточку можно вернуть нажатием.',
    correct: 'Верно. Ноль не может стоять первым — число станет шестизначным. Поэтому сначала 1, затем оба нуля, затем остальные по возрастанию.',
    wrongLeadZero: 'Подсказка: если в первой клетке ноль, число перестанет быть семизначным. Какая цифра должна стоять в начале?',
    wrongOrder: 'Подсказка: левая клетка самая дорогая — это миллионы. Маленькие цифры влево, большие вправо.',
  },
};

export default function D01_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState(Array(7).fill(null)); // karta id
  const [pool, setPool] = useState(CARDS.map((c) => c.id));
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const digitOf = (id) => CARDS.find((c) => c.id === id).d;

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.slots) {
      setSlots(sa.slots); setPool([]);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;

  const clickSlot = (i) => () => {
    if (locked) return;
    if (picked != null) {
      const occ = slots[i];
      setSlots((s) => { const n = s.slice(); n[i] = picked; return n; });
      setPool((p) => (occ != null ? [...p.filter((x) => x !== picked), occ] : p.filter((x) => x !== picked)));
      setPicked(null);
    } else if (slots[i] != null) {
      const v = slots[i];
      setSlots((s) => { const n = s.slice(); n[i] = null; return n; });
      setPool((p) => [...p, v]);
    }
  };

  const check = useCallback(() => {
    const got = slots.map(digitOf).join('');
    const correct = got === TARGET;
    setFb({ correct, leadZero: got[0] === '0' }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { slots, label: got },
      correctAnswer: { label: TARGET },
      correct, meta: { tag: 'build_smallest', level: '🔴' },
    });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#cbd5e1';
  const box = { width: 34, height: 46, borderRadius: 9, border: '2px dashed ' + bd, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  const groups = [[0], [1, 2, 3], [4, 5, 6]];

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '10px 0 18px' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {g.map((i) => (
                <div key={i} onClick={clickSlot(i)} style={box}>
                  {slots[i] != null ? digitOf(slots[i]) : ''}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.03em', marginTop: 5 }}>{t.classes[gi]}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 56, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {pool.map((id) => (
            <button key={id} type="button" disabled={locked} onClick={() => setPicked(picked === id ? null : id)}
              style={{ width: 42, height: 54, borderRadius: 11, border: '2px solid ' + (picked === id ? '#fe5b1a' : '#cbd5e1'), background: picked === id ? '#fff0e8' : '#fff', fontSize: 21, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: picked === id ? '0 0 0 4px #ffe7d8' : 'none' }}>
              {digitOf(id)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: '#9aa1ad', fontWeight: 600, marginTop: 8 }}>{t.hint}</div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : (fb.leadZero ? t.wrongLeadZero : t.wrongOrder)} />}
    </div>
  );
}
