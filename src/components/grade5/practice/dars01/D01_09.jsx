// Dars01 · Amaliyot 09 — Kattalashtirgich · 🔴 · Madina · tag: scale_by_ten
// Rasadxona kompyuteri sonni har bosishda 10 marta oshiradi. Ikki milliondan
// ikki milliardgacha — nechta bosish? Tuzoq: 200 000 000 da to'xtash.
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

const START = 2000000, TARGET = 2000000000;
const T = {
  uz: {
    eyebrow: 'Rasadxona', title: 'Kattalashtirgich',
    setup: "Madina teleskop masshtabini boshqaradi. Har bosishda ekrandagi son 10 marta ortadi. Hozir ekranda ikki million turibdi.",
    ask: "Ekranda ikki milliard paydo bo'lguncha bosing.",
    x10: '×10', undo: 'orqaga',
    classes: ['MILLIARD', 'MILLION', 'MING', 'BIRLIK'],
    correct: "To'g'ri. Uch marta bosildi: million sinfidan milliard sinfiga o'tish uchun uchta nol qo'shiladi.",
    wrongLow: "Maslahat: sonni ovoz chiqarib o'qing. Bosh raqam qaysi sinfda turibdi — hali millionda emasmi?",
    wrongHigh: "Maslahat: milliarddan oshib ketdingiz. Orqaga qayting va har bosishdan keyin sinf nomini o'qing.",
    reading: 'Hozir:',
  },
  ru: {
    eyebrow: 'Обсерватория', title: 'Увеличитель',
    setup: 'Мадина управляет масштабом телескопа. При каждом нажатии число на экране растёт в 10 раз. Сейчас на экране два миллиона.',
    ask: 'Нажимайте, пока на экране не появится два миллиарда.',
    x10: '×10', undo: 'назад',
    classes: ['МИЛЛИАРД', 'МИЛЛИОН', 'ТЫСЯЧА', 'ЕДИНИЦА'],
    correct: 'Верно. Нажали три раза: чтобы перейти из класса миллионов в класс миллиардов, добавляются три нуля.',
    wrongLow: 'Подсказка: прочитайте число вслух. В каком классе стоит первая цифра — разве ещё не в миллионах?',
    wrongHigh: 'Подсказка: ты перешагнул миллиард. Вернись назад и после каждого нажатия читай название класса.',
    reading: 'Сейчас:',
  },
};

export default function D01_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [p, setP] = useState(0);
  const [touched, setTouched] = useState(false);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.presses != null) {
      setP(sa.presses); setTouched(true);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const value = START * Math.pow(10, p);
  const locked = isReview || checked;

  const check = useCallback(() => {
    const correct = value === TARGET;
    setFb({ correct, low: value < TARGET }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { presses: p, value, label: String(value) },
      correctAnswer: { presses: 3, value: TARGET, label: '2000000000' },
      correct, meta: { tag: 'scale_by_ten', level: '🔴' },
    });
  }, [p, value, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // sinflar bo'yicha ajratilgan ko'rinish (o'ngdan chapga uchtadan)
  const raw = String(value);
  const pad = raw.padStart(12, ' ');
  const groups = [pad.slice(0, 3), pad.slice(3, 6), pad.slice(6, 9), pad.slice(9, 12)];

  const btn = (bg, dis) => ({ flex: 1, minHeight: 52, borderRadius: 14, border: 'none', background: dis ? '#e5e7eb' : bg, color: dis ? '#9aa1ad' : '#fff', fontSize: 17, fontWeight: 800, cursor: dis ? 'not-allowed' : 'pointer', fontFamily: 'inherit' });

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ background: '#0f172a', borderRadius: 16, padding: '16px 12px 12px', margin: '16px 0 14px' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {groups.map((g, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: g.trim() ? 1 : .28 }}>
              <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 26, fontWeight: 700, color: g.trim() ? '#7dd3fc' : '#334155', letterSpacing: 2, minWidth: 56 }}>
                {g.trim() || '···'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" disabled={locked || p === 0} onClick={() => setP(p - 1)} style={btn('#64748b', locked || p === 0)}>{t.undo}</button>
        <button type="button" disabled={locked || p >= 5} onClick={() => { setP(p + 1); setTouched(true); }} style={btn('#fe5b1a', locked || p >= 5)}>{t.x10}</button>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : (fb.low ? t.wrongLow : t.wrongHigh)} />}
    </div>
  );
}
