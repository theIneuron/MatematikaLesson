// Dars26 · Amaliyot 02 — Natijani to'ldir · 🟢 · tag: dec_add_tenths
// 2,5 + 1,3 ustun. O'ndan: 5+3=8, butun 2+1=3 → 3,8. Bitta o'nli input (3,8 yoki 3.8 qabul).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px', textAlign: 'center' },
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
function OpStack({ rows, accent = '#fe5b1a', cw = 22, fs = 30 }) {
  const R = rows.map((r) => { const p = String(r.n).split(','); return { i: p[0] || '', f: p[1] || '', op: r.op || '' }; });
  const maxI = Math.max(...R.map((p) => p.i.length), 1);
  const maxF = Math.max(...R.map((p) => p.f.length), 1);
  const opW = 24, commaW = 10, intW = maxI * cw, fracW = maxF * cw, bodyW = intW + commaW + fracW;
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {R.map((r, ri) => (
        <div key={ri} style={{ display: 'flex', alignItems: 'center', height: Math.round(fs * 1.3) }}>
          <div style={{ width: opW, textAlign: 'center', fontFamily: MONO, fontSize: Math.round(fs * .8), fontWeight: 800, color: '#94a3b8' }}>{r.op}</div>
          <div style={{ width: intW, textAlign: 'right', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: '#1f2430' }}>{r.i}</div>
          <div style={{ width: commaW, textAlign: 'center', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: accent }}>,</div>
          <div style={{ width: fracW, textAlign: 'left', fontFamily: MONO, fontSize: fs, fontWeight: 800, color: '#1f2430' }}>{r.f}</div>
        </div>
      ))}
      <div style={{ height: 3, background: '#1f2430', marginLeft: opW, width: bodyW, borderRadius: 2, marginTop: 2 }} />
    </div>
  );
}

const D02_ANS = 3.8;
const decNum = (s) => parseFloat(String(s).replace(',', '.').trim());
const decValid = (s) => /^\d+([.,]\d+)?$/.test(String(s).trim());
const D02_T = {
  uz: {
    eyebrow: "O'ndanlarni qo'sh", setup: "Kamol 2,5 litr suvga yana 1,3 litr qo'shdi. Ustunni to'ldiring.",
    ask: '2,5 + 1,3 = ?',
    correct: "To'g'ri: 5 o'ndan + 3 o'ndan = 8 o'ndan, butunlar 2+1=3 → 3,8.",
    wrong: "Qo'shishdan oldin ikki sonda vergul bitta ustunda turibdimi? Qaysi xona qaysi xona bilan qo'shilishiga qarang.",
    rule: "Xona-xona: o'ndan+o'ndan, butun+butun.",
  },
  ru: {
    eyebrow: 'Сложи десятые', setup: 'Камол долил к 2,5 литра ещё 1,3 литра. Заполни столбик.',
    ask: '2,5 + 1,3 = ?',
    correct: 'Верно: 5 десятых + 3 десятых = 8 десятых, целые 2+1=3 → 3,8.',
    wrong: 'Стоят ли запятые в одном столбце перед сложением? Смотри, какой разряд с каким складывается.',
    rule: 'Разряд к разряду: десятые+десятые, целые+целые.',
  },
};

export default function D26_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(decValid(val) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = Math.abs(decNum(val) - D02_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: val.replace('.', ',') }, correctAnswer: { value: '3,8' }, correct, meta: { tag: 'dec_add_tenths', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
        <OpStack rows={[{ n: '2,5' }, { n: '1,3', op: '+' }]} />
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 96, height: 50, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: MONO, background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
