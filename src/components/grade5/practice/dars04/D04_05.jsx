// Dars04 · Amaliyot 05 — Natijani top · 🟡 · Madina · tag: product_input
// 37 × 59. Ikki xonali × ikki xonali. Bola oraliq ko'paytmalarni VA yakuniy
// natijani katakchalarga yozadi. Ikkinchi qator bir xona chapga suriladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

/* =================== 05 · Natijani top · 🟡 · product_input (katakli ustun) =================== */

const D05_A = 37, D05_B = 59;
const D05_P1 = '333';   // 37 × 9
const D05_P2 = '185';   // 37 × 5 (o'nlar → bir xona chapga)
const D05_SUM = '2183';
const D05_T = {
  uz: {
    eyebrow: 'Natijani top',
    setup: "37 × 59 ni ustunda yeching. Avval 37 ni 9 ga, keyin 37 ni 5 ga ko'paytiring. Ikkinchi qator bir katak chapga suriladi. So'ng ustunda qo'shing.",
    correct: "To'g'ri. 37 × 9 = 333, 37 × 5 = 185 (o'nlar). Yig'indi 2183.",
    wrong: "Maslahat: ikkinchi qator birlik emas, o'nlarni ko'paytiryapti — shuning uchun u qayerdan boshlanadi? Har qatorni qaytadan tekshiring.",
    r1: '37 × 9', r2: '37 × 5',
  },
  ru: {
    eyebrow: 'Найдите результат',
    setup: 'Решите 37 × 59 столбиком. Сначала 37 на 9, затем 37 на 5. Вторая строка сдвигается на клетку влево. Затем сложите.',
    correct: 'Верно. 37 × 9 = 333, 37 × 5 = 185 (десятки). Сумма 2183.',
    wrong: 'Подсказка: вторая строка умножает не единицы, а десятки — откуда тогда она начинается? Проверьте каждую строку заново.',
    r1: '37 × 9', r2: '37 × 5',
  },
};

export default function D04_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  // W = 4 ustun (o'ngdan): birlik..minglar. p1 = 3 katak (o'ngdan), p2 = 3 katak (1 shift), sum = 4 katak
  const [p1, setP1] = useState(['', '', '']);
  const [p2, setP2] = useState(['', '', '']);
  const [sum, setSum] = useState(['', '', '', '']);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const refs = useRef({});

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa) { if (sa.p1) setP1(sa.p1); if (sa.p2) setP2(sa.p2); if (sa.sum) setSum(sa.sum); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } }
  }, [initialAnswer]);
  const full = p1.every((x) => x !== '') && p2.every((x) => x !== '') && sum.every((x) => x !== '');
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);

  const last = (v) => String(v).replace(/[^0-9]/g, '').slice(-1);
  const okP1 = (i) => p1[i] === D05_P1[i];
  const okP2 = (i) => p2[i] === D05_P2[i];
  const okSum = (i) => sum[i] === D05_SUM[i];

  const check = useCallback(() => {
    const correct = p1.join('') === D05_P1 && p2.join('') === D05_P2 && sum.join('') === D05_SUM;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: '37 × 59', options: [], studentAnswer: { p1, p2, sum, label: sum.join('') }, correctAnswer: { value: 2183 }, correct, meta: { tag: 'product_input', level: '🟡' } });
  }, [p1, p2, sum, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);

  const cw = 40;
  const box = (val, okFn, i, setter, arr, key, colStart) => {
    const st = checked ? (okFn(i) ? 'ok' : 'no') : '';
    const c = st === 'ok' ? '#1a7f43' : st === 'no' ? '#c0392b' : '#d6dae3';
    const bg = st === 'ok' ? '#e8f7ee' : st === 'no' ? '#fdecec' : '#f8fafc';
    return (
      <input key={key} value={val} disabled={isReview || checked} inputMode="numeric" maxLength={1}
        onChange={(e) => { if (checked) return; const v = last(e.target.value); setter((p) => { const n = p.slice(); n[i] = v; return n; }); }}
        style={{ gridColumn: colStart, width: cw, height: 48, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 10, border: '2px solid ' + c, background: bg, color: st ? c : '#1f2430', outline: 'none', ...S.mono, boxSizing: 'border-box', justifySelf: 'center' }} />
    );
  };
  const staticCell = (ch, col, color = '#1f2430') => <div style={{ gridColumn: col, textAlign: 'center', ...S.mono, fontSize: 24, fontWeight: 800, color }}>{ch}</div>;
  const grid = { display: 'grid', gridTemplateColumns: `repeat(5, ${cw}px)`, gap: 6, justifyContent: 'center', alignItems: 'center' };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ margin: '8px 0 6px' }}>
        {/* 37 — ustun 4,5 */}
        <div style={grid}>{staticCell('3', 4)}{staticCell('7', 5)}</div>
        {/* × 59 — ustun 3,4,5 */}
        <div style={grid}>{staticCell('×', 3, '#6b7280')}{staticCell('5', 4)}{staticCell('9', 5)}</div>
        <div style={{ ...grid, margin: '3px 0' }}><div style={{ gridColumn: '2 / span 4', height: 3, background: '#1f2430', borderRadius: 2 }} /></div>
        {/* p1 = 333 → ustun 3,4,5 */}
        <div style={{ ...grid, marginBottom: 4 }}>
          <div style={{ gridColumn: 1, fontSize: 10.5, fontWeight: 800, color: '#2563eb', textAlign: 'right', ...S.mono }}>{t.r1}</div>
          {[0, 1, 2].map((i) => box(p1[i], okP1, i, setP1, p1, 'p1' + i, 3 + i))}
        </div>
        {/* p2 = 185 → bir xona chapga: ustun 2,3,4 */}
        <div style={{ ...grid, marginBottom: 4 }}>
          <div style={{ gridColumn: 1, fontSize: 10.5, fontWeight: 800, color: '#7c3aed', textAlign: 'right', ...S.mono }}>{t.r2}</div>
          {[0, 1, 2].map((i) => box(p2[i], okP2, i, setP2, p2, 'p2' + i, 2 + i))}
        </div>
        <div style={{ ...grid, margin: '3px 0' }}><div style={{ gridColumn: '2 / span 4', height: 3, background: '#1f2430', borderRadius: 2 }} /></div>
        {/* sum = 2183 → ustun 2,3,4,5 */}
        <div style={grid}>{[0, 1, 2, 3].map((i) => box(sum[i], okSum, i, setSum, sum, 'sum' + i, 2 + i))}</div>
      </div>

      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
