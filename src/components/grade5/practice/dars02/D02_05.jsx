// Dars02 · Amaliyot 05 — Minglargacha yaxlitlash · 🟡 · Sardor · tag: round_thousand
// To'g'ri javobdan keyin 1 120 738 hisoblagich kabi 1 121 000 ga aylanadi:
// raqamlar o'ngdan chapga, ketma-ket, sekin dumalaydi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
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

const D05_DIGITS = ['1', '1', '2', '0', '7', '3', '8'];   // 1 120 738
// bo'shliq — orqadan uchtadan sanab: 1 | 120 | 738. Indeks 0 va 3 dan keyin.
const D05_GAPS = [0, 3];
// o'zgarish tartibi: o'ngdan chapga. [indeks, yangi qiymat]
const D05_ROLL = [[6, 0], [5, 0], [4, 0], [3, 1]];
const D05_STEP = 480, D05_DUR = 900, D05_H = 42;

function D05_Digit({ value, target, delay, rolling }) {
  // 0..9 va yana 0 — oldinga dumalab nolga o'tish uchun
  const to = rolling ? (target >= value ? target : target + 10) : value;
  return (
    <span style={{ display: 'inline-block', width: 24, height: D05_H, overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{
        display: 'block',
        transform: `translateY(${-to * D05_H}px)`,
        transition: `transform ${D05_DUR}ms cubic-bezier(.4,0,.2,1) ${delay}ms`,
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
          <span key={i} style={{ display: 'block', height: D05_H, lineHeight: D05_H + 'px', textAlign: 'center' }}>{d}</span>
        ))}
      </span>
    </span>
  );
}

const D05_T = {
  uz: {
    eyebrow: 'Yaxlitlash',
    setup: 'Sardor 1 120 738 sonini yaxlitlamoqchi.',
    ask: '1 120 738 ni minglar xonasigacha yaxlitlang.',
    opts: ['1 121 000', '1 120 000', '1 200 000', '1 121 738'],
    correct: "To'g'ri. Minglardan keyingi raqam 7 (5 dan katta), shuning uchun minglarga bir qo'shiladi.",
    wrongMsg: "Maslahat: yaxlitlangan son oshadimi yoki o'zgarishsiz qoladimi — buni minglardan keyingi raqam belgilaydi. U yetarli kattami?",
  },
  ru: {
    eyebrow: 'Округление',
    setup: 'Сардор округляет число 1 120 738.',
    ask: 'Округлите 1 120 738 до разряда тысяч.',
    opts: ['1 121 000', '1 120 000', '1 200 000', '1 121 738'],
    correct: 'Верно. После тысяч стоит 7 (больше 5), поэтому тысячи увеличиваются на единицу.',
    wrongMsg: 'Подсказка: увеличится ли округлённое число или останется прежним — решает цифра после тысяч. Достаточно ли она велика?',
  },
};

export default function D02_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [roll, setRoll] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setRoll(!!initialAnswer.correct); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setRoll(true), 500);
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: '1 121 000' },
      correct, meta: { tag: 'round_thousand', level: '🟡' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const rollOf = (i) => D05_ROLL.findIndex(([idx]) => idx === i);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 20px', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 30, fontWeight: 700, color: '#1f2430' }}>
        {D05_DIGITS.map((d, i) => {
          const r = rollOf(i);
          const changing = roll && r >= 0;
          return (
            <React.Fragment key={i}>
              <span style={{ color: changing ? '#2563eb' : '#1f2430', transition: 'color .5s ease' }}>
                <D05_Digit value={Number(d)} target={r >= 0 ? D05_ROLL[r][1] : Number(d)} delay={r >= 0 ? r * D05_STEP : 0} rolling={roll && r >= 0} />
              </span>
              {D05_GAPS.includes(i) && <span style={{ width: 12, display: 'inline-block' }} />}
            </React.Fragment>
          );
        })}
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
