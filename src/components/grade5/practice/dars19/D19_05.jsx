// Dars19 · Amaliyot 05 — Umumiy ulushni tanla · 🔴 · tag: add_reslice_pick
// 1/2 + 1/3. O'quvchi nechaga bo'lishni tanlaydi; ikkala bar ham teng bo'linsa — umumiy maxraj.
// Eng kichigi = 6 (12 ham bo'linadi, lekin eng kichik emas). Etalon "qayta bo'lish" mexanikasi.
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
  <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

// bar: den asosidagi kasr, pick ga bo'lingan (agar pick % den === 0). w bir xil (taqqoslash uchun).
function Bar({ den, pick, color, w = 240, h = 32 }) {
  const parts = pick && pick % den === 0 ? pick : den;
  const shaded = parts / den; // bo'yalgan bo'laklar soni (kasr o'zgarmaydi)
  const cw = w / parts;
  const valid = !pick || pick % den === 0;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="#eef2f7" stroke={valid ? '#cbd5e1' : '#f2b8b8'} strokeWidth="1" />
      <rect x="1" y="1" width={Math.max(0, (w * shaded) / parts - 1)} height={h - 2} rx="4" fill={color} />
      {Array.from({ length: parts - 1 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="1" x2={(i + 1) * cw} y2={h - 1} stroke="#fff" strokeWidth="2" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="none" stroke={valid ? '#cbd5e1' : '#f2b8b8'} strokeWidth="1.5" />
    </svg>
  );
}

const D05_PICKS = [2, 3, 4, 6, 12];
const D05_CORRECT = 6;
const D05_T = {
  uz: {
    eyebrow: 'Umumiy ulush', setup: "Madina 1/2 va 1/3 ni qo'shmoqchi. Ikkala lentaning bo'laklari hozircha har xil kattalikda.",
    ask: "Lentalarni nechaga bo'lsak, ikkalasi ham teng bo'linadi? Shunday sonlarning eng kichigini tanlang:",
    correct: "To'g'ri. 6 ta bo'lakka bo'lsak, ikkalasi ham teng bo'linadi: 1/2 = 3/6, 1/3 = 2/6 → 3/6 + 2/6 = 5/6.",
    wrong: "Lentaga qarang: qaysi bo'linishda ikkala lenta ham iz qoldirmay bo'lindi? Eng kichigini toping.",
    rule: "Umumiy maxraj — ikkala maxrajga bo'linadigan son; eng kichigini tanlash qulay.",
  },
  ru: {
    eyebrow: 'Общие доли', setup: 'Мадина хочет сложить 1/2 и 1/3. Доли обеих лент пока разного размера.',
    ask: 'На сколько поделить ленты, чтобы обе поделились ровно? Выбери наименьшее из таких чисел:',
    correct: 'Верно. При делении на 6 обе делятся ровно: 1/2 = 3/6, 1/3 = 2/6 → 3/6 + 2/6 = 5/6.',
    wrong: 'Посмотри на ленту: при каком делении обе ленты поделились без остатка? Найди наименьшее.',
    rule: 'Общий знаменатель — число, делящееся на оба знаменателя; удобно брать наименьшее.',
  },
};

export default function D19_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pick != null) { setPick(sa.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D05_PICKS.map((p) => ({ id: String(p), label: String(p) })), studentAnswer: { pick }, correctAnswer: { value: D05_CORRECT }, correct, meta: { tag: 'add_reslice_pick', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const bothValid = pick && pick % 2 === 0 && pick % 3 === 0;
  return (
    <div style={S.wrap}>
      <style>{`
        .d19-pop { animation: d19pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d19pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d19-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '10px 0 6px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 34, ...S.mono, fontWeight: 800, color: '#fe5b1a', fontSize: 13 }}>1/2</span><Bar den={2} pick={pick} color="#ffb488" />{pick && pick % 2 !== 0 && <span style={{ fontSize: 12, fontWeight: 800, color: '#c0392b' }}>✗</span>}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 34, ...S.mono, fontWeight: 800, color: '#16a34a', fontSize: 13 }}>1/3</span><Bar den={3} pick={pick} color="#86efac" />{pick && pick % 3 !== 0 && <span style={{ fontSize: 12, fontWeight: 800, color: '#c0392b' }}>✗</span>}</div>
      </div>
      {checked && fb?.correct && <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e' }}><Frac num="3" den="6" size={18} color="#0f766e" /><span>+</span><Frac num="2" den="6" size={18} color="#0f766e" /><span>=</span><Frac num="5" den="6" size={18} color="#0f766e" /></div>}
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D05_PICKS.map((p) => {
          const on = pick === p;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#b83d0e'; }
          if (checked && on) { const ok = p === D05_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={p} type="button" disabled={locked} onClick={() => setPick(p)} style={{ width: 52, height: 52, borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 21, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>{p}</button>;
        })}
      </div>
      {!checked && bothValid && <div style={{ textAlign: 'center', fontSize: 12.5, color: '#16a34a', fontWeight: 700, marginTop: 6 }}>{lang === 'uz' ? "Ikkalasi teng bo'lindi ✓" : 'Обе поделились ровно ✓'}</div>}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
