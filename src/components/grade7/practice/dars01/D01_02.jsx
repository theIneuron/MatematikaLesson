// Dars01 · Amaliyot 02 — Birinchi amal · 🟢 · tag: first_step
// 5-sinf amaliyotidan ko'chirilgan fayl, matematikasi 7-sinfga o'tkazildi.
// Mexanika va animatsiya O'ZGARMADI: to'g'ri javobdan keyin panel ochiladi va
// qatorlar birma-bir tushadi. 5-sinfda 5837 xona qo'shiluvchilariga yoyilardi,
// bu yerda esa YOZUV qadamba-qadam qisqaradi: 48 : 8 + 5 · 2 -> 6 + 5 · 2 ->
// 6 + 10 -> 16. Shakl bir xil, mazmun 7-sinfning.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 8px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '10px 0 9px' },
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

const EXPR = '−1440 : 24 + 35 · (−6)';
// Har qator: `tail` -- hisoblashdan OLDIN, `done` -- keyin. Qatorlar birma-bir
// tushadi va yozuv qisqaradi -- daftardagi yechim kabi.
const ROWS = [
  { tail: '−1440 : 24 + 35 · (−6)', done: '−60 + 35 · (−6)' },
  { tail: '−60 + 35 · (−6)', done: '−60 + (−210)' },
  { tail: '−60 + (−210)', done: '−270' },
];
// Variantlar uch tilda BIR XIL: bu matn emas, yozuvning bo'laklari.
// (Nusxada ru va en da 5-sinfning variantlari qolib ketgan edi.)
const OPTS = ['−1440 : 24', '24 + 35', '35 · (−6)'];
const T = {
  uz: {
    eyebrow: 'Amallar tartibi',
    setup: 'Yozuvda uchta amal bor, lekin ular bir vaqtda bajarilmaydi:',
    ask: 'Qaysi amal BIRINCHI bajariladi?',
    stage: 'ikkinchi bosqich',
    correct: "To'g'ri. Bo'lish va ko'paytirish ikkinchi bosqich, chapdagisi oldin: −1440 : 24 = −60. Keyin 35 · (−6) = −210, oxirida −60 + (−210) = −270.",
    wrongMsg: "Maslahat: qo'shish birinchi bosqich, u oxirida turadi. Ikkinchi bosqichda ikki amal bor -- ular orasida yozuvdagi O'RIN hal qiladi.",
  },
  ru: {
    eyebrow: 'Порядок действий',
    setup: 'В записи три действия, но выполняются они не одновременно:',
    ask: 'Какое действие выполняется ПЕРВЫМ?',
    stage: 'вторая ступень',
    correct: 'Верно. Деление и умножение — вторая ступень, левое идёт раньше: −1440 : 24 = −60. Затем 35 · (−6) = −210, и в конце −60 + (−210) = −270.',
    wrongMsg: 'Подсказка: сложение — первая ступень, оно стоит последним. На второй ступени два действия, и между ними решает МЕСТО в записи.',
  },
  en: {
    eyebrow: 'Order of operations',
    setup: 'There are three operations in the record, but they do not run at once:',
    ask: 'Which operation runs FIRST?',
    stage: 'second stage',
    correct: 'Correct. Division and multiplication are the second stage, and the left one goes first: −1440 : 24 = −60. Then 35 · (−6) = −210, and finally −60 + (−210) = −270.',
    wrongMsg: 'Hint: addition is the first stage, it comes last. The second stage has two operations, and POSITION in the record decides between them.',
  },
};

// Row komponenti modul darajasida — savol ichida e'lon qilinsa, har setState da
// React uni qayta mount qiladi va animatsiya boshidan ketadi.
function Row({ i, stage, label, showLabel }) {
  if (stage < i) return null;
  const collapsed = stage > i;
  const text = collapsed ? ROWS[i].done : ROWS[i].tail;
  return (
    <div className={i > 0 ? 'd02-drop' : undefined} style={{ display: 'flex', alignItems: 'center', minHeight: 38 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: 190, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 24, fontWeight: 700, letterSpacing: 1, color: '#1f2430' }}>
        {text}
      </div>
      <span className="d02-zero" style={{ width: 130, paddingLeft: 10, fontSize: 14.5, fontWeight: 800, color: '#7c3aed', visibility: (collapsed && label && showLabel) ? 'visible' : 'hidden' }}>
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
      timers.current.push(setTimeout(() => setStage(4), 3950)); // yoyish tugagach — bosqich nomi
    }
    onSubmit?.({
      questionText: t.ask, options: OPTS.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: OPTS[picked] },
      correctAnswer: { idx: 0, label: OPTS[0] },
      correct, meta: { tag: 'first_step', level: '🟢', expr: EXPR },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '10px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 7, fontFamily: "'JetBrains Mono', ui-monospace, monospace", minHeight: 44 };
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
        <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 30, fontWeight: 700, letterSpacing: 2, margin: '10px 0 16px', color: '#1f2430' }}>
          {EXPR}
        </div>
      )}

      {/* to'g'ri javobdan keyin ochiladi: variantlar pastga suriladi */}
      <div style={{ maxHeight: open ? 190 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .9s cubic-bezier(.33,1,.42,1), opacity .6s ease .15s' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0 10px' }}>
          <div>
            {[0, 1, 2].map((i) => <Row key={i} i={i} stage={stage} label={i === 0 ? t.stage : null} showLabel={stage >= 4} />)}
          </div>
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      {OPTS.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
      ))}
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
