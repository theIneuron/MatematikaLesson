// Dars 7 (3-sinf) · Amaliyot 04 — mustaqil topshiriq fayli (grade2 naqshi).
// Ustun yozuvi qoidasi: xona xona OSTIDA — birlik birlik ostida, o'nlik o'nlik ostida.
// Variantlar mini-ustun ko'rinishida; xatolari — sonni surib yozish.
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Lumo — Bit shahri) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 24%, #4a2342 0%, #261335 58%, #130b23 100%)',
  stageBd: '#4A2A48', sink: '#F3E9F2', sink2: '#C9A9C6', stile: '#2a1530',
  glow: '#FFB84D', glowDk: '#E67E22', ribbon: '#1B2A4A', ribbonBd: '#3A4E78',
};
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 17, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 18.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="g3d7-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d7-pop { animation: g3d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 04 · Ustunda to'g'ri yozuv (436 + 345) · 🟡 · col_align =================== */
const D04_TAG = 'col_align', D04_LEVEL = '🟡', D04_CORRECT = 0;
const D04_OPTS = ['  436\n+ 345', '  436\n+345', '  436\n+  345'];
const D04_T = {
  uz: {
    eyebrow: "To'g'ri yozuv", setup: "436 + 345 ni ustunda yechmoqchimiz. Avval TO'G'RI yozib olish kerak.",
    ask: "Qaysi yozuvda xona xona OSTIDA turibdi? Uni tanlang.",
    correct: "To'g'ri! Birlik birlik ostida (6 va 5), o'nlik o'nlik ostida (3 va 4), yuzlik yuzlik ostida (4 va 3).",
    wrong: "Maslahat: har raqam O'Z xonasi ostida turishi kerak: 5 birligi 6 birligi ostida. Surilgan yozuvda razryadlar adashib ketadi.",
    rule: "Ustun yozuvining qoidasi: xona xona ostida — shunda har razryad o'zi bilan qo'shiladi.",
  },
  ru: {
    eyebrow: 'Правильная запись', setup: 'Хотим решить 436 + 345 в столбик. Сначала нужно ПРАВИЛЬНО записать.',
    ask: 'В какой записи разряд стоит ПОД разрядом? Выбери её.',
    correct: 'Верно! Единицы под единицами (6 и 5), десятки под десятками (3 и 4), сотни под сотнями (4 и 3).',
    wrong: 'Подсказка: каждая цифра должна стоять под СВОИМ разрядом: единица 5 — под единицей 6. В сдвинутой записи разряды перепутаются.',
    rule: 'Правило записи столбиком: разряд под разрядом — тогда каждый разряд складывается со своим.',
  },
};
const D04_ORDER = permFromSeed(3, D04_TAG);
function D07_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: D04_CORRECT }, correct, meta: { tag: D04_TAG, level: D04_LEVEL } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cardStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bd = C.line, bg = C.paper, col = C.ink;
    if (on) { bd = C.acc; bg = C.accSoft; }
    if (show) { const ok = i === D04_CORRECT; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
    return { flex: '1 1 30%', minWidth: 130, padding: '14px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer' };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {D04_ORDER.map((i) => (
          <button key={i} type="button" style={cardStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
            <pre style={{ margin: 0, ...S.mono, fontSize: 24, fontWeight: 800, lineHeight: 1.4, textAlign: 'left', display: 'inline-block' }}>{D04_OPTS[i]}</pre>
            <div style={{ borderTop: '2.5px solid currentColor', marginTop: 4, width: '80%', marginLeft: 'auto', marginRight: 'auto' }} />
          </button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_04(props) {
  return (<><style>{FX_CSS}</style><D07_04Impl {...props} /></>);
}
