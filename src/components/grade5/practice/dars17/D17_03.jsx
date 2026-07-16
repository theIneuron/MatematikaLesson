// Dars17 · Amaliyot 03 — Nishonni yig' · 🔴 · tag: add_construct
// bo'laklardan IKKITASINI tanlab 3/4 (=6/8) ni yig'. Faqat 1+5=6 juftligi to'g'ri (yagona).
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

// mini tasma: 8 katakdan k tasi bo'yalgan
function MiniBar({ k, color = '#ffb488', w = 96, h = 18 }) {
  const cw = w / 8;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={i * cw + 0.5} y="0.5" width={cw - 1} height={h - 1} rx="2" fill={i < k ? color : '#eef2f7'} stroke="#cbd5e1" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

const D03_TILES = [1, 2, 3, 5, 7]; // suratlar, maxraj 8; faqat 1+5=6 juftligi to'g'ri (yagona)
const D03_TARGET = 6; // 6/8 = 3/4
const D03_T = {
  uz: {
    eyebrow: "Yig'ib chiqar", setup: "Karimga qutini bezash uchun aynan 3/4 uzunlikdagi tasma kerak. Uyda faqat kichikroq bo'laklar (sakkizdan) bor. Ikkitasini ulab, kerakli uzunlikni hosil qiling.",
    ask: "Birga 3/4 beradigan IKKI bo'lakni tanlang:",
    correct: "To'g'ri. Ikki bo'lak birga 6/8 beradi, bu eng sodda holda 3/4: 1/8 + 5/8 = 6/8 = 3/4.",
    wrong: "Maslahat: 3/4 — bu sakkizdan nechta? Tanlagan ikki bo'lagingiz birga o'shancha katak bersin.",
    rule: "Avval qo'shib, so'ng eng sodda holga keltiring: 6/8 = 3/4.",
  },
  ru: {
    eyebrow: 'Собери', setup: 'Кариму нужна лента длиной ровно 3/4, чтобы украсить коробку. Дома есть только части поменьше (в восьмых). Соедини две, чтобы получить нужную длину.',
    ask: 'Выберите ДВЕ части, которые вместе дают 3/4:',
    correct: 'Верно. Две части вместе дают 6/8, а это в простейшем виде 3/4: 1/8 + 5/8 = 6/8 = 3/4.',
    wrong: 'Подсказка: 3/4 — это сколько восьмых? Пусть две выбранные части дадут вместе столько клеток.',
    rule: 'Сначала сложи, потом упрости: 6/8 = 3/4.',
  },
};

export default function D17_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length === 2 && !checked); }, [sel, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (k) => { if (locked) return; setSel((s) => s.includes(k) ? s.filter((x) => x !== k) : (s.length < 2 ? [...s, k] : s)); };
  const sum = sel.reduce((a, b) => a + b, 0);
  const check = useCallback(() => {
    const correct = sel.length === 2 && sum === D03_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 350);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel, sum }, correctAnswer: { target: '3/4' }, correct, meta: { tag: 'add_construct', level: '🔴' } });
  }, [sel, sum, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d17-pop { animation: d17pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d17-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      {/* nishon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '4px 0 10px' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#7c3aed' }}>{lang === 'uz' ? 'Nishon:' : 'Цель:'}</span>
        <Frac num="3" den="4" size={24} color="#7c3aed" />
        <MiniBar k={6} color="#c4b5fd" w={120} h={20} />
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '8px 0' }}>
        {D03_TILES.map((k) => {
          const on = sel.includes(k);
          let bd = '#cbd5e1', bg = '#fff';
          if (on) { bd = '#fe5b1a'; bg = '#fff4ee'; }
          if (checked && on) { const ok = !!fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return <button key={k} type="button" disabled={locked} onClick={() => toggle(k)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 12px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #ffe7d8' : 'none' }}><Frac num={String(k)} den="8" size={19} /><MiniBar k={k} /></button>;
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', fontWeight: 700 }}>{sel.length}/2 {lang === 'uz' ? 'tanlandi' : 'выбрано'}</div>
      {reveal && (
        <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, ...S.mono, fontSize: 17, fontWeight: 800, color: '#0f766e' }}>
          <Frac num={String(sel[0])} den="8" size={18} color="#0f766e" /><span>+</span><Frac num={String(sel[1])} den="8" size={18} color="#0f766e" /><span>=</span><Frac num="6" den="8" size={18} color="#0f766e" /><span>=</span><Frac num="3" den="4" size={18} color="#0f766e" />
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
