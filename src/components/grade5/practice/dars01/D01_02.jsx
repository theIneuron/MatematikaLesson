// Dars01 · Amaliyot 02 — Raqamning xonasi · 🟢 · Madina · tag: digit_place
// To'g'ri javobdan keyin: variantlar pastga suriladi va bo'shagan joyda 5837
// xona qo'shiluvchilariga bosqichma-bosqich yoyiladi (5000 · 800 · 30 · 7).
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

const ROWS = [
  { tail: '5837', done: '5000' },
  { tail: '837', done: '800' },
  { tail: '37', done: '30' },
  { tail: '7', done: '7' },
];
const T = {
  uz: {
    eyebrow: 'Atrofimizda',
    setup: '5837 sonidagi qizil raqamga qarang:',
    ask: 'Qizil 8 raqami nechani anglatadi?',
    opts: ['8 ta yuzlik', "8 ta o'nlik", '8 ta birlik'],
    hundreds: 'yuzlar',
    correct: "To'g'ri. 5837 da 8 — yuzlar xonasida, ya'ni 8 ta yuzlik.",
    wrongMsg: "Maslahat: bir xil raqam turgan o'rniga qarab har xil qiymatga ega. 8 shu sonda qaysi xonani egallab turibdi?",
  },
  ru: {
    eyebrow: 'Вокруг нас',
    setup: 'Посмотрите на красную цифру в числе 5837:',
    ask: 'Что обозначает красная цифра 8?',
    opts: ['8 сотен', '8 десятков', '8 единиц'],
    hundreds: 'сотни',
    correct: 'Верно. В 5837 цифра 8 — в разряде сотен, то есть 8 сотен.',
    wrongMsg: 'Подсказка: одна и та же цифра имеет разное значение в зависимости от места. Какой разряд занимает 8 в этом числе?',
  },
};

// Row komponenti modul darajasida — savol ichida e'lon qilinsa, har setState da
// React uni qayta mount qiladi va animatsiya boshidan ketadi.
function Row({ i, stage, label, showLabel }) {
  if (stage < i) return null;
  const collapsed = stage > i;
  const text = collapsed ? ROWS[i].done : ROWS[i].tail;
  const chars = text.split('');
  return (
    <div className={i > 0 ? 'd02-drop' : undefined} style={{ display: 'flex', alignItems: 'center', minHeight: 38 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, width: 100, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
        {chars.map((c, k) => {
          const isZero = collapsed && c === '0';
          return (
            <span key={k} className={isZero ? 'd02-zero' : undefined}
              style={{ width: 22, textAlign: 'center', color: isZero ? '#9aa1ad' : (k === 0 ? '#c0392b' : '#1f2430') }}>{c}</span>
          );
        })}
      </div>
      <span className="d02-zero" style={{ width: 110, paddingLeft: 10, fontSize: 14.5, fontWeight: 800, color: '#7c3aed', visibility: (collapsed && label && showLabel) ? 'visible' : 'hidden' }}>
        — {label || ''}
      </span>
    </div>
  );
}

export default function D01_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') {
        setFb({ correct: initialAnswer.correct }); setChecked(true);
        if (initialAnswer.correct) { setOpen(true); setStage(4); }
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setOpen(true), 300));
      timers.current.push(setTimeout(() => setStage(1), 1300));
      timers.current.push(setTimeout(() => setStage(2), 2200));
      timers.current.push(setTimeout(() => setStage(3), 3100));
      timers.current.push(setTimeout(() => setStage(4), 3950)); // yoyish tugagach — xona nomi
    }
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: t.opts[0] },
      correct, meta: { tag: 'digit_place', level: '🟢' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <style>{`
        .d02-drop { animation: d02drop .5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes d02drop { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
        .d02-zero { animation: d02zero .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02zero { 0% { opacity: 0; transform: scale(.4); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d02-drop, .d02-zero { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      {!open && (
        <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 34, fontWeight: 700, letterSpacing: 3, margin: '10px 0 16px' }}>
          <span>5</span><span style={{ color: '#c0392b' }}>8</span><span>3</span><span>7</span>
        </div>
      )}

      {/* to'g'ri javobdan keyin ochiladi: variantlar pastga suriladi */}
      <div style={{ maxHeight: open ? 190 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .9s cubic-bezier(.33,1,.42,1), opacity .6s ease .15s' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 0 14px' }}>
          <div>
            {[0, 1, 2, 3].map((i) => <Row key={i} i={i} stage={stage} label={i === 1 ? t.hundreds : null} showLabel={stage >= 4} />)}
          </div>
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      {t.opts.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
      ))}
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
