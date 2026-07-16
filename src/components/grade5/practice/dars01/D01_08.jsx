// Dars01 · Amaliyot 08 — Radiosignal (nolli sinf) · 🔴 · Bekzod · tag: read_zero_class
// Sonni so'zdan xona jadvaliga yozish. Minglar sinfi eshitilmaydi (000) — lekin
// jadvalda bo'sh qolmaydi, nollar bilan to'ldiriladi. 12 katakni to'ldirish.
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

const TARGET = '247108000394';
const GROUPS = [
  { key: 'mlrd', from: 0 }, { key: 'mln', from: 3 }, { key: 'ming', from: 6 }, { key: 'bir', from: 9 },
];
const T = {
  uz: {
    eyebrow: 'Rasadxona', title: 'Radiosignal',
    setup: "Rasadxona radiosignal qabul qildi. Bekzod uni quloq bilan eshitdi va daftariga yozmoqchi.",
    words: "ikki yuz qirq yetti milliard bir yuz sakkiz million uch yuz to'qson to'rt",
    ask: "Sonni xona jadvaliga yozing. Har bir sinfda uchtadan katak bor.",
    classes: { mlrd: 'MILLIARD', mln: 'MILLION', ming: 'MING', bir: 'BIRLIK' },
    correct: "To'g'ri. Minglar sinfi eshitilmadi, chunki u 000. Lekin jadvalda u bo'sh qolmaydi — nollar bilan to'ldiriladi.",
    wrongZeros: "Maslahat: qaysi sinf umuman eshitilmadi? Eshitilmagan sinf yo'q degani emas. Uning kataklariga nima yoziladi?",
    wrongOther: "Maslahat: har bir sinf o'z nomi bilan aytiladi. Sinf nomi aytilmasa, u sinfda nollar turadi.",
  },
  ru: {
    eyebrow: 'Обсерватория', title: 'Радиосигнал',
    setup: 'Обсерватория приняла радиосигнал. Бекзод услышал его и хочет записать в тетрадь.',
    words: 'двести сорок семь миллиардов сто восемь миллионов триста девяносто четыре',
    ask: 'Запишите число в разрядную таблицу. В каждом классе по три клетки.',
    classes: { mlrd: 'МИЛЛИАРД', mln: 'МИЛЛИОН', ming: 'ТЫСЯЧА', bir: 'ЕДИНИЦА' },
    correct: 'Верно. Класс тысяч не прозвучал, потому что он 000. Но в таблице он не остаётся пустым — заполняется нулями.',
    wrongZeros: 'Подсказка: какой класс вообще не прозвучал? Не прозвучал — не значит, что его нет. Что пишется в его клетках?',
    wrongOther: 'Подсказка: каждый класс называется своим именем. Если имя класса не звучит, в этом классе стоят нули.',
  },
};

export default function D01_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [d, setD] = useState(Array(12).fill(''));
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.digits) {
      setD(sa.digits);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  const full = d.every((x) => x !== '');
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);

  const setAt = (i, v) => {
    const c = v.replace(/[^\d]/g, '').slice(-1);
    setD((old) => { const n = old.slice(); n[i] = c; return n; });
    if (c && i < 11) refs.current[i + 1]?.focus();
  };

  const check = useCallback(() => {
    const got = d.join('');
    const correct = got === TARGET;
    const zerosBad = d.slice(6, 9).join('') !== '000';
    setFb({ correct, zerosBad }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { digits: d, label: got },
      correctAnswer: { label: TARGET },
      correct, meta: { tag: 'read_zero_class', level: '🔴' },
    });
  }, [d, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#cbd5e1';

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '13px 15px', borderRadius: 14, background: '#f1f5f9', border: '1.5px solid #e2e8f0', marginBottom: 16 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe5b1a" strokeWidth="2" strokeLinecap="round" style={{ flex: '0 0 auto', marginTop: 2 }}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
        <span style={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: 600, color: '#374151', fontStyle: 'italic' }}>{t.words}</span>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'nowrap' }}>
        {GROUPS.map((g) => (
          <div key={g.key} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.03em', marginBottom: 5 }}>{t.classes[g.key]}</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0, 1, 2].map((k) => {
                const i = g.from + k;
                return (
                  <input key={i} ref={(el) => (refs.current[i] = el)} value={d[i]} inputMode="numeric"
                    disabled={isReview || checked} onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus(); }}
                    style={{ width: 26, height: 42, textAlign: 'center', fontSize: 18, fontWeight: 800, borderRadius: 7, border: '2px solid ' + bd, background: '#fff', color: '#1f2430', fontFamily: 'inherit', padding: 0 }} />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : (fb.zerosBad ? t.wrongZeros : t.wrongOther)} />}
    </div>
  );
}
