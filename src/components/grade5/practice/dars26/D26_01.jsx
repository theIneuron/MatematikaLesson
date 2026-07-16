// Dars26 · Amaliyot 01 — Qaysi yozuv to'g'ri · 🟢 · tag: dec_align_pick
// 3,4 + 1,25 uchun ikki terish: A vergul ustma-ust (to'g'ri), B o'ng chekka bo'yicha (xato). To'g'risini tanla → A.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d26-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// Vergul bo'yicha ustma-ust (to'g'ri terish)
function AlignStack({ accent }) {
  const cw = 20, fs = 28, opW = 22, intW = cw, commaW = 9, fracW = 2 * cw;
  const rows = [{ i: '3', f: '4', op: '' }, { i: '1', f: '25', op: '+' }];
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', height: 36 }}>
          <div style={{ width: opW, textAlign: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>{r.op}</div>
          <div style={{ width: intW, textAlign: 'right', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: '#1f2430' }}>{r.i}</div>
          <div style={{ width: commaW, textAlign: 'center', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: accent }}>,</div>
          <div style={{ width: fracW, textAlign: 'left', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: '#1f2430' }}>{r.f}</div>
        </div>
      ))}
    </div>
  );
}
// O'ng chekka bo'yicha (xato terish): oxirgi raqamlar bir chiziqda, vergul siljigan
function RightStack() {
  const rows = ['3,4', '1,25'];
  return (
    <div style={{ display: 'inline-block', textAlign: 'right' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 36 }}>
          <div style={{ width: 22, textAlign: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>{i === 1 ? '+' : ''}</div>
          <div style={{ width: 66, textAlign: 'right', fontFamily: MONO, fontSize: 28, fontWeight: 800, color: '#1f2430' }}>{r}</div>
        </div>
      ))}
    </div>
  );
}

const D01_CORRECT = 0; // A — vergul ustma-ust
const D01_T = {
  uz: {
    eyebrow: "To'g'ri terish", setup: "Aziza 3,4 + 1,25 ni ustun qilib terdi. Ikki yozuv chiqdi.",
    ask: "Qaysi yozuv TO'G'RI terilgan?",
    correct: "To'g'ri. Vergul vergul ostiga tushadi — shunda o'ndan o'ndan bilan, yuzdan yuzdan bilan qo'shiladi.",
    wrong: "Ikki yozuvni solishtiring: qaysida vergul aniq vergul ostida turibdi? O'ndan xonalar bitta ustunda bo'lsin.",
    rule: "O'nli kasrlarni vergul bo'yicha ustma-ust ter.",
  },
  ru: {
    eyebrow: 'Верная запись', setup: 'Азиза записала 3,4 + 1,25 столбиком. Получились две записи.',
    ask: 'Какая запись составлена ВЕРНО?',
    correct: 'Верно. Запятая под запятой — тогда десятые складываются с десятыми, сотые с сотыми.',
    wrong: 'Сравни две записи: в какой запятая точно под запятой? Десятые должны стоять в одном столбце.',
    rule: 'Десятичные записывай столбиком по запятой.',
  },
};

export default function D26_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: '0', label: 'A' }, { id: '1', label: 'B' }], studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'dec_align_pick', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const card = (i, label, node) => {
    const on = pick === i;
    let bd = '#d6dae3', bg = '#fff';
    if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; }
    if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
    return (
      <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px 16px', borderRadius: 16, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#64748b', fontFamily: 'inherit' }}>{label}</span>
        {node}
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, margin: '10px 0' }}>
        {card(0, 'A', <AlignStack accent="#fe5b1a" />)}
        {card(1, 'B', <RightStack />)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
