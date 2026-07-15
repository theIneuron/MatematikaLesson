// Dars24 · Amaliyot 03 — Yuzdan katak to'r · 🔴 · tag: hundgrid_to_decimal
// 100 katakli to'rning 85 tasi bo'yalgan → 85/100 = 0,85. Javob: raqamlarni bosib razryad xonalariga qo'yish.
// Setup usulni oshkor qilmaydi; wrong = turtki; qoida faqat to'g'ridan keyin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
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
const Frac = ({ num, den, size = 16, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 2px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 1.6, background: color }} />
    <span style={{ fontSize: size, padding: '1px 2px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
// 10x10 to'r, n tasi bo'yalgan (qatorma-qator)
function HundGrid({ n, color = '#60a5fa' }) {
  const cell = 22, W = cell * 10;
  return (
    <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} style={{ display: 'block', maxWidth: '100%', height: 'auto' }}>
      {Array.from({ length: 100 }).map((_, i) => { const r = Math.floor(i / 10), c = i % 10; return <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} fill={i < n ? color : '#eef2f7'} stroke="#cbd5e1" strokeWidth="1" />; })}
      {Array.from({ length: 9 }).map((_, i) => <line key={'v' + i} x1={(i + 1) * cell} y1="0" x2={(i + 1) * cell} y2={W} stroke="#94a3b8" strokeWidth={(i + 1) % 5 === 0 ? 1.6 : 0.6} />)}
      {Array.from({ length: 9 }).map((_, i) => <line key={'h' + i} x1="0" y1={(i + 1) * cell} x2={W} y2={(i + 1) * cell} stroke="#94a3b8" strokeWidth={(i + 1) % 5 === 0 ? 1.6 : 0.6} />)}
      <rect x="0.5" y="0.5" width={W - 1} height={W - 1} fill="none" stroke="#64748b" strokeWidth="1.5" />
    </svg>
  );
}
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

const D03 = { t: 8, h: 5 }; // 0,85
const D03_T = {
  uz: {
    eyebrow: "Yuzdan to'r", setup: "Bekzod 100 katakli to'rning 85 katagini bo'yadi.",
    ask: "Bo'yalgan qismni o'nli kasr ko'rinishida yozing. Raqamlarni tanlab, xonalarga qo'ying.", l1: "o'ndan", l2: 'yuzdan',
    correct: "To'g'ri. To'rning 85/100 qismi bo'yalgan, bu 0,85.",
    wrong: "Maxraji 100 bo'lgan kasr o'nli yozuvda verguldan keyin nechta xona egallaydi?",
    rule: "Maxraji 100 → verguldan keyin ikkita raqam: o'ndan va yuzdan. 85/100 = 0,85.",
  },
  ru: {
    eyebrow: 'Сотые', setup: 'Бекзод закрасил 85 клеток сетки из 100 клеток.',
    ask: 'Запишите закрашенную часть десятичной дробью. Выберите цифры и поставьте в разряды.', l1: 'десятые', l2: 'сотые',
    correct: 'Верно. Закрашено 85/100 сетки, это 0,85.',
    wrong: 'Сколько разрядов после запятой занимает дробь со знаменателем 100?',
    rule: 'Знаменатель 100 → две цифры после запятой: десятые и сотые. 85/100 = 0,85.',
  },
};

export default function D24_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const order = ['t', 'h'];
  const [vals, setVals] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { const nx = {}; if (s.t != null) nx.t = String(s.t); if (s.h != null) nx.h = String(s.h); setVals(nx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = order.every((k) => vals[k] != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const tapDigit = (d) => { if (locked) return; const k = order.find((o) => vals[o] == null); if (k == null) return; setVals((v) => ({ ...v, [k]: String(d) })); };
  const clearSlot = (k) => { if (locked) return; setVals((v) => { const n = { ...v }; delete n[k]; return n; }); };
  const check = useCallback(() => {
    const correct = parseInt(vals.t, 10) === D03.t && parseInt(vals.h, 10) === D03.h;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { t: vals.t != null ? parseInt(vals.t, 10) : null, h: vals.h != null ? parseInt(vals.h, 10) : null }, correctAnswer: D03, correct, meta: { tag: 'hundgrid_to_decimal', level: '🔴' } });
  }, [vals, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (k, ok) => checked ? (parseInt(vals[k], 10) === ok ? '#1a7f43' : '#c0392b') : (vals[k] != null ? '#2563eb' : '#cbd5e1');
  const slot = (k, ok, lbl) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button type="button" onClick={() => clearSlot(k)} disabled={locked} style={{ width: 50, height: 50, borderRadius: 11, border: '2px solid ' + bdOf(k, ok), background: '#fff', color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", fontSize: 25, fontWeight: 800, cursor: locked || vals[k] == null ? 'default' : 'pointer' }}>{vals[k] != null ? vals[k] : '?'}</button>
      <span style={{ fontSize: 11.5, color: '#6b7280', fontWeight: 700 }}>{lbl}</span>
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px 0' }}>
        <div style={{ width: 200 }}><HundGrid n={85} /></div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: '#1f2430', marginTop: 10 }}>0,</span>
        {slot('t', D03.t, t.l1)}{slot('h', D03.h, t.l2)}
      </div>
      {!locked && <DigitPad onTap={tapDigit} disabled={locked} />}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
