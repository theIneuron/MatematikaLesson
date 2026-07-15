// Ayirib bo'lmaydigan misolni topish. To'g'ri javobdan keyin: 342 va 424 ustunlar
// bilan taqqoslanadi, 342 kalta ekani ko'rinadi — "yetmaydi" belgisi chiqadi.
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

const D02_OPTS = [
  { l: 654, r: 444, bad: false },
  { l: 342, r: 424, bad: true },
  { l: 500, r: 200, bad: false },
  { l: 399, r: 0, bad: false },
];
const D02_CORRECT = 1;
const D02_T = {
  uz: {
    eyebrow: 'Ayirish',
    setup: "Quyida to'rtta ayirish berilgan. Har birini diqqat bilan ko'rib chiqing.",
    ask: "Qaysi ayirishni bajarib bo'lmaydi?",
    correct: "To'g'ri. 342 < 424 — kamayuvchi ayiriluvchidan kichik, natural sonlarda bunday ayirib bo'lmaydi.",
    wrong: "Maslahat: har bir misolda birinchi son ikkinchisidan katta yoki tengmi, tekshiring. Qayerda kichik?",
    notEnough: 'yetmaydi',
  },
  ru: {
    eyebrow: 'Вычитание',
    setup: 'Ниже даны четыре вычитания. Рассмотрите каждое внимательно.',
    ask: 'Какое вычитание выполнить нельзя?',
    correct: 'Верно. 342 < 424 — уменьшаемое меньше вычитаемого, у натуральных чисел так вычесть нельзя.',
    wrong: 'Подсказка: проверьте, в каждом ли примере первое число больше или равно второму. Где меньше?',
    notEnough: 'не хватает',
  },
};

export default function D03_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) { setPicked(sa.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D02_CORRECT;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 350);
    onSubmit?.({ questionText: t.ask, options: D02_OPTS.map((o, i) => ({ id: String(i), label: o.l + ' - ' + o.r })), studentAnswer: { idx: picked }, correctAnswer: { idx: D02_CORRECT }, correct, meta: { tag: 'can_subtract', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === D02_CORRECT; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: "'JetBrains Mono', monospace", minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      {/* taqqoslash paneli — faqat to'g'ri javobdan keyin */}
      <div style={{ maxHeight: reveal ? 120 : 0, opacity: reveal ? 1 : 0, overflow: 'hidden', transition: 'max-height .7s cubic-bezier(.33,1,.42,1), opacity .5s ease' }}>
        <div style={{ padding: '10px 4px 14px' }}>
          {[{ v: 342, c: '#c0392b', lbl: 'kamayuvchi' }, { v: 424, c: '#64748b', lbl: 'ayiriluvchi' }].map((row, k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 52, fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800, color: row.c }}>{row.v}</span>
              <div style={{ height: 20, borderRadius: 6, background: row.c, width: (row.v / 424 * 70) + '%', transform: reveal ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: `transform .8s cubic-bezier(.33,1,.42,1) ${k * 0.25}s` }} />
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 6, fontSize: 14, fontWeight: 800, color: '#c0392b', opacity: reveal ? 1 : 0, transition: 'opacity .5s ease .9s' }}>
            342 &lt; 424 — {t.notEnough}
          </div>
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {D02_OPTS.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o.l} − {o.r}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
