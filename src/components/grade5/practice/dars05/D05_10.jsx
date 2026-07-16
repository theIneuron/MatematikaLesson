// Dars05 · Amaliyot 10 — Qoldiqni topshirish · 🔴 · tag: remainder_match
// To'rt qoldiqli bo'linish. Har biriga to'g'ri qoldiqni moslash. 6 karta (4+2 chalg'ituvchi).
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

const D10_ROWS = [
  { q: '47 : 5', rem: 2 },
  { q: '38 : 6', rem: 2 },
  { q: '29 : 4', rem: 1 },
  { q: '53 : 7', rem: 4 },
];
const D10_CARDS = [2, 1, 4, 2, 3, 5]; // 2,1,4,2 kerak (2 ikki marta) · 3,5 ortiqcha...
// diqqat: rem qiymatlari [2,2,1,4] — ikkita "2" kerak. Kartalar: iki 2, bitta 1, bitta 4, + 3,5 chalg'ituvchi
const D10_DATA = { tag: 'remainder_match', level: '🔴' };
const D10_T = {
  uz: {
    eyebrow: 'Qoldiqni moslash', setup: "Har bir bo'linishning qoldig'ini toping va mos kartani qatorga qo'ying.",
    bank: 'Qoldiqlar', hint: "Kartani bosing, keyin misol yonidagi katakni bosing. Bir xil qoldiq bir necha marta uchrashi mumkin.",
    correct: "To'g'ri. Barcha qoldiqlar to'g'ri.",
    wrong: "Maslahat: qoldiqni topish uchun bo'luvchining sondan oshmaydigan eng katta karralisini toping, so'ng sondan ayiring. Ayirma — qoldiq.",
  },
  ru: {
    eyebrow: 'Соедините остатки', setup: 'Найдите остаток каждого деления и поставьте нужную карточку.',
    bank: 'Остатки', hint: 'Нажмите карточку, затем клетку рядом. Один остаток может встретиться несколько раз.',
    correct: 'Верно. Все остатки правильные.',
    wrong: 'Подсказка: чтобы найти остаток, возьми наибольшее кратное делителя, не превышающее число, и вычти его из числа. Разность — остаток.',
  },
};
export default function D05_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]); // {v, ci}
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const slotTint = ['#fe5b1a', '#7c3aed', '#0f766e', '#c2410c'];
  const slotBg = ['#fff4ee', '#faf5ff', '#f0fdfa', '#fff7ed'];
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D10_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D10_ROWS[i].rem);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.setup, options: [], studentAnswer: { slots, label: slots.map((x) => x && x.v).join(',') }, correctAnswer: { slots: D10_ROWS.map((r) => r.rem) }, correct, meta: { tag: D10_DATA.tag, level: D10_DATA.level } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ margin: '10px 0 4px' }}>
        {D10_ROWS.map((r, i) => {
          const cell = slots[i]; const v = cell ? cell.v : null;
          let bd = slotTint[i], bg = slotBg[i], col = '#1f2430';
          // qisman to'g'ri = moslangan HAMMA katak qizil; faqat to'liq to'g'ri bo'lsa yashil
          if (checked && v != null) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, justifyContent: 'center' }}>
              <div style={{ width: 120, ...S.mono, fontSize: 21, fontWeight: 800, textAlign: 'right', color: '#374151' }}>{r.q} → {lang === 'uz' ? 'qoldiq' : 'ост.'}</div>
              <div onClick={clickSlot(i)} style={{ width: 62, height: 50, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 22, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12, marginTop: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {D10_CARDS.map((c, idx) => {
            if (usedSet.has(idx)) return <span key={idx} style={{ width: 54, height: 52, borderRadius: 12, border: '2px dashed #e5e7eb', background: '#fafafa' }} />;
            const on = pick === idx;
            return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)}
              style={{ width: 54, height: 52, borderRadius: 12, border: '2px solid ' + (on ? '#fe5b1a' : '#cbd5e1'), background: on ? '#fff0e8' : '#fff', ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #ffe7d8' : 'none' }}>{c}</button>;
          })}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: '#9aa1ad', fontWeight: 600, marginTop: 8 }}>{t.hint}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
