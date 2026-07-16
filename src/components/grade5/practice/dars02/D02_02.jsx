// Dars02 · Amaliyot 02 — O'nlargacha yaxlitlash · 🟢 · Bekzod · tag: round_ten
// To'g'ri javobdan keyin son o'qi bosqichma-bosqich quriladi: nuqta → chiziq →
// chegaralar 230/240 → 238 o'z joyiga siljiydi → 238 dan 240 gacha yashil bo'ladi.
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

const D02_T2 = {
  uz: {
    eyebrow: 'Yaxlitlash',
    setup: 'Bekzod 238 sonini yaxlitlamoqchi.',
    ask: "238 ni o'nlar xonasigacha yaxlitlang.",
    opts: ['240', '230', '200', '250'],
    correct: "To'g'ri. 238 dan 240 gacha atigi 2 qadam, 230 gacha esa 8 qadam. Yaqinrog'iga yaxlitlanadi.",
    wrongMsg: "Maslahat: 238 son o'qida 230 va 240 orasida turibdi. Qaysi biriga yaqinroq?",
  },
  ru: {
    eyebrow: 'Округление',
    setup: 'Бекзод округляет число 238.',
    ask: 'Округлите 238 до разряда десятков.',
    opts: ['240', '230', '200', '250'],
    correct: 'Верно. От 238 до 240 всего 2 шага, а до 230 — восемь. Округляем к ближнему.',
    wrongMsg: 'Подсказка: 238 стоит на числовой оси между 230 и 240. К какому из них ближе?',
  },
};

export default function D02_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T2[lang] || D02_T2.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1 nuqta · 2 chiziq · 3 chegaralar · 4 siljish · 5 yashil
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPh(5); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      [[1, 450], [2, 1350], [3, 2500], [4, 3500], [5, 5200]].forEach(([v, ms]) =>
        timers.current.push(setTimeout(() => setPh(v), ms)));
    }
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: '240' },
      correct, meta: { tag: 'round_ten', level: '🟢' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 };
  };

  const at = ph >= 4 ? '80%' : '50%';
  const dot = (color) => ({ width: 13, height: 13, borderRadius: 999, background: color, border: '2.5px solid #fff', boxShadow: '0 0 0 2px ' + color });

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ maxHeight: ph >= 1 ? 130 : 0, opacity: ph >= 1 ? 1 : 0, overflow: 'hidden', transition: 'max-height .8s cubic-bezier(.33,1,.42,1), opacity .6s ease' }}>
        <div style={{ position: 'relative', height: 108, margin: '10px 30px 0' }}>
          {/* asosiy chiziq — markazdan ikki tomonga o'sadi */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 58, height: 3, background: '#cbd5e1', transform: `scaleX(${ph >= 2 ? 1 : 0})`, transition: 'transform 1.1s cubic-bezier(.33,1,.42,1)' }} />
          {/* 238 → 240 masofasi */}
          <div style={{ position: 'absolute', left: '80%', width: '20%', top: 58, height: 3, background: '#1a7f43', opacity: ph >= 5 ? 1 : 0, transition: 'opacity .8s ease' }} />

          {/* chekka nuqtalar va yozuvlar */}
          {[{ x: '0%', label: '230', tone: '#94a3b8' }, { x: '100%', label: '240', tone: '#94a3b8' }].map((e, k) => (
            <div key={k} style={{ position: 'absolute', left: e.x, top: 53, transform: 'translateX(-50%)', opacity: ph >= 2 ? 1 : 0, transition: 'opacity .6s ease .3s', textAlign: 'center' }}>
              <div style={dot(ph >= 5 && k === 1 ? '#1a7f43' : '#94a3b8')} />
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 800, color: ph >= 5 && k === 1 ? '#1a7f43' : '#64748b', opacity: ph >= 3 ? 1 : 0, transition: 'opacity .7s ease, color .7s ease' }}>{e.label}</div>
            </div>
          ))}

          {/* 238 — siljiydigan nuqta */}
          <div style={{ position: 'absolute', left: at, top: 53, transform: 'translateX(-50%)', transition: 'left 1.4s cubic-bezier(.33,1,.42,1)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fe5b1a', marginTop: -34, marginBottom: 6 }}>238</div>
            <div style={dot('#fe5b1a')} />
          </div>
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
