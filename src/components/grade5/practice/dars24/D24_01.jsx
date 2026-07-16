// Dars24 · Amaliyot 01 — Lentadan o'nli kasr · 🟢 · tag: strip_to_decimal
// 10 bo'lakli lentaning 7 tasi bo'yalgan → 7/10 = 0,7. Javob: raqamni bosib katakka qo'yish (klaviatura yo'q).
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
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
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
// 10 bo'lakli lenta, k tasi bo'yalgan
function TenStrip({ k, color = '#ff8a52' }) {
  const w = 280, h = 42, cw = w / 10;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="7" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1.5" />
      {Array.from({ length: 10 }).map((_, i) => i < k && <rect key={i} className="d24-fill" style={{ animationDelay: (i * 0.08) + 's' }} x={i * cw + 2} y="3" width={cw - 4} height={h - 6} rx="4" fill={color} />)}
      {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="2" x2={(i + 1) * cw} y2={h - 2} stroke="#fff" strokeWidth="2" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="7" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}
const PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
function DigitPad({ onTap, disabled }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', maxWidth: 280, margin: '14px auto 0' }}>
      {PAD.map((d) => (
        <button key={d} type="button" disabled={disabled} onClick={() => onTap(d)} style={{ width: 46, height: 46, borderRadius: 11, border: '1.5px solid #cbd5e1', background: disabled ? '#f1f5f9' : '#fff', color: '#1f2430', fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", cursor: disabled ? 'default' : 'pointer' }}>{d}</button>
      ))}
    </div>
  );
}

const D01_ANS = 7; // 7/10 = 0,7
const D01_T = {
  uz: {
    eyebrow: "O'nli kasr", setup: "Madina uzun qog'oz lentani 10 ta teng bo'lakka bo'lib, ulardan 7 tasini bo'yadi.",
    ask: "Bo'yalgan qismni o'nli kasr (vergul bilan) ko'rinishida yozing. Raqamni tanlab, katakka qo'ying.",
    correct: "To'g'ri. Lentaning 7/10 qismi bo'yalgan, bu 0,7.",
    wrong: "Lentaning nechta bo'lagi bo'yalganini yana bir bor sanang.",
    rule: "O'ndan bo'lak — verguldan keyingi birinchi raqam. 7/10 = 0,7.",
  },
  ru: {
    eyebrow: 'Десятичная дробь', setup: 'Мадина разделила длинную бумажную ленту на 10 равных частей и закрасила 7 из них.',
    ask: 'Запишите закрашенную часть десятичной дробью (с запятой). Выберите цифру и поставьте в клетку.',
    correct: 'Верно. Закрашено 7/10 ленты, это 0,7.',
    wrong: 'Ещё раз сосчитайте, сколько частей ленты закрашено.',
    rule: 'Десятая доля — первая цифра после запятой. 7/10 = 0,7.',
  },
};

export default function D24_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [slot, setSlot] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setSlot(sa.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(slot != null && !checked); }, [slot, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = slot === D01_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: slot }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'strip_to_decimal', level: '🟢' } });
  }, [slot, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : (slot != null ? '#fe5b1a' : '#cbd5e1');
  return (
    <div style={S.wrap}>
      <style>{`
        .d24-fill { opacity: 0; animation: d24fill .5s ease forwards; }
        .d24-pop { animation: d24pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d24fill { from { opacity: 0; transform: scaleY(.3); } to { opacity: 1; transform: none; } }
        @keyframes d24pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d24-fill, .d24-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px 0' }}>
        <TenStrip k={7} />
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ ...S.mono, fontSize: 32, fontWeight: 800, color: '#1f2430' }}>0,</span>
        <button type="button" onClick={() => !locked && setSlot(null)} disabled={locked} style={{ width: 56, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: '#fff', color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, cursor: locked || slot == null ? 'default' : 'pointer' }}>{slot != null ? slot : '?'}</button>
      </div>
      {!locked && <DigitPad onTap={(d) => setSlot(d)} disabled={locked} />}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
