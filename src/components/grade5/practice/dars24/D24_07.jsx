// Dars24 · Amaliyot 07 — Butun va yuzdan · 🔴 · tag: whole_plus_decimal
// Masala: 2 butun 5/100 kg = 2,05 kg. Butun qism verguldan oldin; o'ndan xonasi bo'sh → nol.
// Javob: raqamlarni razryad xonalariga bosib qo'yish (klaviatura yo'q).
// Setup usulni oshkor qilmaydi; wrong = turtki; qoida faqat to'g'ridan keyin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d24-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 18, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
function DigitPad({ onTap, disabled }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', maxWidth: 280, margin: '12px auto 0' }}>
      {PAD.map((d) => (
        <button key={d} type="button" disabled={disabled} onClick={() => onTap(d)} style={{ width: 44, height: 44, borderRadius: 11, border: '1.5px solid #cbd5e1', background: disabled ? '#f1f5f9' : '#fff', color: '#1f2430', fontSize: 19, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", cursor: disabled ? 'default' : 'pointer' }}>{d}</button>
      ))}
    </div>
  );
}

const D07 = { w: 2, t: 0, h: 5 }; // 2,05
const D07_T = {
  uz: {
    eyebrow: 'Masala', setup: "Malika do'kondan 2 kg guruch, ustiga yana 5/100 kg guruch tortib oldi. Hammasi bo'lib 2 butun 5/100 kg.",
    ask: "Malika jami qancha guruch oldi? Sonni o'nli kasr ko'rinishida yozing.", lw: 'butun (kg)', l1: "o'ndan", l2: 'yuzdan',
    correct: "To'g'ri. Butun qism 2, kasr qismi 5/100. O'ndan xonasi bo'sh — u yerda nol turadi: 2,05 kg.",
    wrong: "Butun qism nechta? 5/100 — bu yuzdan bo'laklar. Unda o'ndan xonasida nima bo'ladi?",
    rule: "Aralash son → butun qism verguldan oldin, kasr qismi keyin. 2 butun 5/100 = 2,05.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Малика купила в магазине 2 кг риса и ещё довесила 5/100 кг риса. Всего 2 целых 5/100 кг.',
    ask: 'Сколько всего риса взяла Малика? Запишите число десятичной дробью.', lw: 'целое (кг)', l1: 'десятые', l2: 'сотые',
    correct: 'Верно. Целая часть 2, дробная 5/100. Разряд десятых пуст — там ноль: 2,05 кг.',
    wrong: 'Какая целая часть? 5/100 — это сотые. Тогда что в разряде десятых?',
    rule: 'Смешанное число → целая часть до запятой, дробная после. 2 целых 5/100 = 2,05.',
  },
};

export default function D24_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const order = ['w', 't', 'h'];
  const [vals, setVals] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { const nx = {}; if (s.w != null) nx.w = String(s.w); if (s.t != null) nx.t = String(s.t); if (s.h != null) nx.h = String(s.h); setVals(nx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = order.every((k) => vals[k] != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const tapDigit = (d) => { if (locked) return; const k = order.find((o) => vals[o] == null); if (k == null) return; setVals((v) => ({ ...v, [k]: String(d) })); };
  const clearSlot = (k) => { if (locked) return; setVals((v) => { const n = { ...v }; delete n[k]; return n; }); };
  const check = useCallback(() => {
    const correct = parseInt(vals.w, 10) === D07.w && parseInt(vals.t, 10) === D07.t && parseInt(vals.h, 10) === D07.h;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: vals.w != null ? parseInt(vals.w, 10) : null, t: vals.t != null ? parseInt(vals.t, 10) : null, h: vals.h != null ? parseInt(vals.h, 10) : null }, correctAnswer: D07, correct, meta: { tag: 'whole_plus_decimal', level: '🔴' } });
  }, [vals, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (k, ok) => checked ? (parseInt(vals[k], 10) === ok ? '#1a7f43' : '#c0392b') : (vals[k] != null ? '#fe5b1a' : '#cbd5e1');
  const slot = (k, ok, lbl) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button type="button" onClick={() => clearSlot(k)} disabled={locked} style={{ width: 48, height: 50, borderRadius: 11, border: '2px solid ' + bdOf(k, ok), background: '#fff', color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", fontSize: 25, fontWeight: 800, cursor: locked || vals[k] == null ? 'default' : 'pointer' }}>{vals[k] != null ? vals[k] : '?'}</button>
      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 700 }}>{lbl}</span>
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d24-pop { animation: d24pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d24pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d24-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '6px 0' }}>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#fe5b1a' }}>2</span><Frac num={5} den={100} size={16} color="#fe5b1a" /><span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>kg</span>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 6 }}>
        {slot('w', D07.w, t.lw)}
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: '#1f2430', marginTop: 10 }}>,</span>
        {slot('t', D07.t, t.l1)}{slot('h', D07.h, t.l2)}
      </div>
      {!locked && <DigitPad onTap={tapDigit} disabled={locked} />}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
