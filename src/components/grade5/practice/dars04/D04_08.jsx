// Dars04 · Amaliyot 08 — Katta ko'paytma · 🔴 · Sardor · tag: column_mul_big
// 872 × 314. Uch oraliq ko'paytma + yakun — hammasi katakchalarga yoziladi.
// p1 = 872×4 = 3488, p2 = 872×1 = 872 (1 shift), p3 = 872×3 = 2616 (2 shift), sum = 273808.
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

/* =================== 08 · Katta ko'paytma · 🔴 · column_mul_big (katakli ustun) =================== */

const D08_A = 872, D08_B = 314;
const D08_P1 = '3488', D08_P2 = '872', D08_P3 = '2616', D08_SUM = '273808';
const D08_T = {
  uz: {
    eyebrow: "Katta ko'paytma",
    setup: "872 × 314 ni ustunda yeching. Uch qatorni to'ldiring: 872×4, 872×1, 872×3. Har qator bir katak chapga suriladi. So'ng qo'shing.",
    correct: "To'g'ri. 872 × 314 = 273 808.",
    wrong: "Maslahat: har qator qaysi xona bilan ko'paytiryapti — birlik, o'nlik yoki yuzlik? Xonani bilsang, qator qancha suriladi ham ayon bo'ladi.",
    r1: '× 4', r2: '× 1', r3: '× 3',
  },
  ru: {
    eyebrow: 'Большое произведение',
    setup: 'Решите 872 × 314 столбиком. Заполните три строки: 872×4, 872×1, 872×3. Каждая сдвигается влево. Затем сложите.',
    correct: 'Верно. 872 × 314 = 273 808.',
    wrong: 'Подсказка: каким разрядом умножает каждая строка — единицами, десятками или сотнями? Знаешь разряд — знаешь и сдвиг.',
    r1: '× 4', r2: '× 1', r3: '× 3',
  },
};

export default function D04_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  // 6 ustun (o'ngdan 1..6). p1=4 katak(1..4), p2=3 katak(2..4), p3=4 katak(3..6), sum=6 katak(1..6)
  const [p1, setP1] = useState(['', '', '', '']);
  const [p2, setP2] = useState(['', '', '']);
  const [p3, setP3] = useState(['', '', '', '']);
  const [sum, setSum] = useState(['', '', '', '', '', '']);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa) { if (sa.p1) setP1(sa.p1); if (sa.p2) setP2(sa.p2); if (sa.p3) setP3(sa.p3); if (sa.sum) setSum(sa.sum); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } }
  }, [initialAnswer]);
  const full = [p1, p2, p3, sum].every((a) => a.every((x) => x !== ''));
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);

  const last = (v) => String(v).replace(/[^0-9]/g, '').slice(-1);
  const check = useCallback(() => {
    const correct = p1.join('') === D08_P1 && p2.join('') === D08_P2 && p3.join('') === D08_P3 && sum.join('') === D08_SUM;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: '872 × 314', options: [], studentAnswer: { p1, p2, p3, sum, label: sum.join('') }, correctAnswer: { value: 273808 }, correct, meta: { tag: 'column_mul_big', level: '🔴' } });
  }, [p1, p2, p3, sum, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);

  const cw = 34, NCOL = 7; // 1 label + 6 raqam
  const grid = { display: 'grid', gridTemplateColumns: `44px repeat(6, ${cw}px)`, gap: 5, justifyContent: 'center', alignItems: 'center' };
  const box = (val, arr, i, setter, correctStr, key, gridCol) => {
    const ok = val === correctStr[i];
    const st = checked ? (ok ? 'ok' : 'no') : '';
    const c = st === 'ok' ? '#1a7f43' : st === 'no' ? '#c0392b' : '#d6dae3';
    const bg = st === 'ok' ? '#e8f7ee' : st === 'no' ? '#fdecec' : '#f8fafc';
    return <input key={key} value={val} disabled={isReview || checked} inputMode="numeric" maxLength={1}
      onChange={(e) => { if (checked) return; const v = last(e.target.value); setter((p) => { const n = p.slice(); n[i] = v; return n; }); }}
      style={{ gridColumn: gridCol, width: cw, height: 44, textAlign: 'center', fontSize: 21, fontWeight: 800, borderRadius: 9, border: '2px solid ' + c, background: bg, color: st ? c : '#1f2430', outline: 'none', ...S.mono, boxSizing: 'border-box', justifySelf: 'center' }} />;
  };
  const stat = (ch, col, color = '#1f2430') => <div style={{ gridColumn: col, textAlign: 'center', ...S.mono, fontSize: 22, fontWeight: 800, color }}>{ch}</div>;
  // gridCol: ustun 1 (label) + 6 raqam. Eng o'ng = grid col 7 (birlik). raqamning o'ngdan indeksi r → grid col = 7 - r.
  // massiv chapdan o'ngga; arr length L, arr[i] ning o'ngdan indeksi = (L-1-i). grid col = 7 - (L-1-i).
  const gc = (L, i) => 7 - (L - 1 - i);

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ margin: '8px 0 6px', overflowX: 'auto' }}>
        <div style={grid}>{stat('8', gc(3, 0))}{stat('7', gc(3, 1))}{stat('2', gc(3, 2))}</div>
        <div style={grid}>{stat('×', 1, '#6b7280')}{stat('3', gc(3, 0))}{stat('1', gc(3, 1))}{stat('4', gc(3, 2))}</div>
        <div style={{ ...grid, margin: '3px 0' }}><div style={{ gridColumn: '2 / span 6', height: 3, background: '#1f2430', borderRadius: 2 }} /></div>
        <div style={{ ...grid, marginBottom: 4 }}><div style={{ gridColumn: 1, fontSize: 12, fontWeight: 800, color: '#2563eb', ...S.mono, textAlign: 'right' }}>{t.r1}</div>{[0, 1, 2, 3].map((i) => box(p1[i], p1, i, setP1, D08_P1, 'p1' + i, gc(4, i)))}</div>
        <div style={{ ...grid, marginBottom: 4 }}><div style={{ gridColumn: 1, fontSize: 12, fontWeight: 800, color: '#7c3aed', ...S.mono, textAlign: 'right' }}>{t.r2}</div>{[0, 1, 2].map((i) => box(p2[i], p2, i, setP2, D08_P2, 'p2' + i, gc(3, i) - 1))}</div>
        <div style={{ ...grid, marginBottom: 4 }}><div style={{ gridColumn: 1, fontSize: 12, fontWeight: 800, color: '#0f766e', ...S.mono, textAlign: 'right' }}>{t.r3}</div>{[0, 1, 2, 3].map((i) => box(p3[i], p3, i, setP3, D08_P3, 'p3' + i, gc(4, i) - 2))}</div>
        <div style={{ ...grid, margin: '3px 0' }}><div style={{ gridColumn: '2 / span 6', height: 3, background: '#1f2430', borderRadius: 2 }} /></div>
        <div style={grid}>{[0, 1, 2, 3, 4, 5].map((i) => box(sum[i], sum, i, setSum, D08_SUM, 'sum' + i, gc(6, i)))}</div>
      </div>

      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
