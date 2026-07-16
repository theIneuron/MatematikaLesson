// Dars05 · Amaliyot 06 — Burchakda bo'lish · 🟡 · tag: long_div
// 3080 : 5. Bo'linma raqamlarini katakchalarga yozadi. Qadam-qadam yordam ostida.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function D06_buildQ(dividend, divisor) {
  const digs = String(dividend).split('').map(Number);
  const q = []; let rem = 0;
  for (let i = 0; i < digs.length; i++) { const cur = rem * 10 + digs[i]; q.push(Math.floor(cur / divisor)); rem = cur % divisor; }
  return { digs, q, rem };
}
const D06_DIVIDEND = 3080, D06_DIVISOR = 5;
const D06_T = {
  uz: {
    eyebrow: "Burchak usuli", setup: "3080 ni 5 ga burchak usulida bo'ling. Bo'linmaning har raqamini katakka yozing. O'ngdan chapga emas — chapdan o'ngga, xonama-xona.",
    correct: "To'g'ri. 3080 : 5 = 616, qoldiq 0.",
    wrong: "Maslahat: eng chapdagi raqam bo'luvchi 5 dan kichik bo'lsa, bo'linmaning o'sha birinchi katagida qanday raqam turadi? So'ng uni qaysi raqam bilan birga qarash kerak?",
  },
  ru: {
    eyebrow: 'Уголком', setup: 'Разделите 3080 на 5 уголком. Впишите каждую цифру частного в клетку. Слева направо, разряд за разрядом.',
    correct: 'Верно. 3080 : 5 = 616, остаток 0.',
    wrong: 'Подсказка: если самая левая цифра меньше делителя 5, какая цифра встанет в первой клетке частного? С какой цифрой её тогда рассмотреть вместе?',
  },
};
export default function D05_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const { digs, q } = D06_buildQ(D06_DIVIDEND, D06_DIVISOR);
  // bo'linma = '616' — lekin katak soni bo'linuvchi raqamlariga teng (4), yetakchi 0 bilan: 0616
  const qStr = q.join(''); // '0616'
  const N = digs.length;
  const [qv, setQv] = useState(() => Array(N).fill(''));
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.q) { setQv(sa.q.slice(0, N)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer, N]);
  // yetakchi nol katagini majburiy qilmaymiz: 0 yoki bo'sh qabul
  const filled = qv.every((x, i) => qStr[i] === '0' ? true : x !== '');
  useEffect(() => { onReady?.(filled && !checked); }, [filled, checked, onReady]);
  const last = (v) => String(v).replace(/[^0-9]/g, '').slice(-1);
  const check = useCallback(() => {
    const correct = qv.every((x, i) => (qStr[i] === '0' ? (x === '' || x === '0') : x === qStr[i]));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: '3080 : 5', options: [], studentAnswer: { q: qv }, correctAnswer: { q: qStr }, correct, meta: { tag: 'long_div', level: '🟡' } });
  }, [qv, qStr, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cw = 44;
  const cin = (i) => {
    const lead = qStr[i] === '0';
    const st = checked ? ((lead ? (qv[i] === '' || qv[i] === '0') : qv[i] === qStr[i]) ? 'ok' : 'no') : '';
    const c = st === 'ok' ? '#1a7f43' : st === 'no' ? '#c0392b' : '#ffb488';
    const bg = st === 'ok' ? '#e8f7ee' : st === 'no' ? '#fdecec' : '#fff4ee';
    return { width: cw, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 10, border: '2px solid ' + c, background: bg, color: st ? c : '#b83d0e', outline: 'none', ...S.mono, boxSizing: 'border-box' };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* bo'linuvchi | bo'luvchi burchagi */}
          <div style={{ ...S.mono, fontSize: 28, fontWeight: 800, paddingTop: 4 }}>{D06_DIVIDEND}</div>
          <div style={{ borderLeft: '3px solid #1f2430', borderBottom: '3px solid #1f2430', paddingLeft: 10, marginLeft: 6, paddingBottom: 6 }}>
            <div style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: '#c2410c' }}>{D06_DIVISOR}</div>
          </div>
        </div>
      </div>
      {/* bo'linma kataklari */}
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#6b7280', alignSelf: 'center', marginRight: 4 }}>{lang === 'uz' ? "bo'linma:" : 'частное:'}</div>
        {Array.from({ length: N }).map((_, i) => (
          <input key={i} value={qv[i]} onChange={(e) => !checked && setQv((p) => { const n = p.slice(); n[i] = last(e.target.value); return n; })} inputMode="numeric" maxLength={1} disabled={isReview || checked} placeholder={qStr[i] === '0' ? '0' : ''} style={cin(i)} />
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
