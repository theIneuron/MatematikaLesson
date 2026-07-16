// Dars25 · Amaliyot 01 — Qaysi kichik · 🟢 · tag: compare_visual
// 0,7 va 0,4 ni lenta orqali solishtirish. KICHIGINI tanla → 0,4 (yo'nalish o'zgargan — diqqat).
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
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
function TenStrip({ k, color = '#ff8a52' }) {
  const w = 200, h = 34, cw = w / 10;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="5" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1.5" />
      {Array.from({ length: 10 }).map((_, i) => i < k && <rect key={i} x={i * cw + 2} y="3" width={cw - 4} height={h - 6} rx="2.5" fill={color} />)}
      {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="2" x2={(i + 1) * cw} y2={h - 2} stroke="#fff" strokeWidth="1.6" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

const D01_OPTS = [{ v: '0,7', k: 7 }, { v: '0,4', k: 4 }];
const D01_CORRECT = 1; // 0,4 — kichigi
const D01_T = {
  uz: {
    eyebrow: 'Solishtir', setup: "Bekzod ikki lentani bo'yadi: birini 0,7 gacha, ikkinchisini 0,4 gacha.",
    ask: 'Qaysi son kichik? Kichigini bos:',
    correct: "To'g'ri. 0,4 da 4 ta o'ndan, 0,7 da 7 ta. 4 < 7, demak 0,4 < 0,7.",
    wrong: "Savolni yana bir bor o'qing: bu yerda kichigi so'ralyapti. Ikkala lentaga qarang.",
    rule: "O'ndan bilan solishtiring: 0,4 < 0,7 (4 < 7).",
  },
  ru: {
    eyebrow: 'Сравни', setup: 'Бекзод закрасил две ленты: одну до 0,7, другую до 0,4.',
    ask: 'Какое число меньше? Нажми меньшее:',
    correct: 'Верно. В 0,4 четыре десятых, в 0,7 семь. 4 < 7, значит 0,4 < 0,7.',
    wrong: 'Перечитай вопрос: здесь спрашивают меньшее. Посмотри на обе ленты.',
    rule: 'Сравнивай по десятым: 0,4 < 0,7 (4 < 7).',
  },
};

export default function D25_01(props) {
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
    onSubmit?.({ questionText: t.ask, options: D01_OPTS.map((o, i) => ({ id: String(i), label: o.v })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'compare_visual', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '8px 0' }}>
        {D01_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}>
              <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430', minWidth: 54 }}>{o.v}</span>
              <TenStrip k={o.k} />
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
