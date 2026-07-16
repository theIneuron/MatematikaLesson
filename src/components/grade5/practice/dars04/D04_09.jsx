// Dars04 · Amaliyot 09 — Moslash · 🔴 · Bekzod · tag: match_product
// To'rt misol chap tomonda, har birining o'ng tomonida bo'sh katak. Pastda 7 ta
// javob kartasi (4 to'g'ri + 3 chalg'ituvchi). Kartani bosib, keyin katakni bosib
// juftlash. Distraktorlar to'g'ri javoblarga yaqin (tipik xato natijalar).
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

/* =================== 09 · Javoblarni moslash · 🔴 · match_product (interaktiv) =================== */

const D09_ROWS = [
  { q: '23 × 4', ans: 92 },
  { q: '31 × 3', ans: 93 },
  { q: '42 × 2', ans: 84 },
  { q: '14 × 5', ans: 70 },
];
const D09_CARDS = [84, 82, 92, 72, 70, 93, 90]; // 84,92,70,93 to'g'ri · 82,72,90 chalg'ituvchi
const D09_DATA = { tag: 'match_product', level: '🔴' };
const D09_T = {
  uz: {
    eyebrow: 'Moslash',
    setup: "Har bir ko'paytmani to'g'ri javobi bilan moslang. Javob kartasini bosing, keyin misol yonidagi katakni bosing.",
    bank: 'Javoblar',
    hint: "Qo'yilgan kartani bosib qaytarib olish mumkin. Bank'da ortiqcha kartalar bor.",
    correct: "To'g'ri. Barcha ko'paytmalar to'g'ri moslandi.",
    wrong: "Maslahat: har bir misolni ustunda hisoblang. Chalg'ituvchi kartalar to'g'ri javobga yaqin — diqqat qiling.",
  },
  ru: {
    eyebrow: 'Соедините',
    setup: 'Соедините каждое произведение с верным ответом. Нажмите карточку ответа, затем клетку рядом с примером.',
    bank: 'Ответы',
    hint: 'Поставленную карточку можно вернуть нажатием. В банке есть лишние карточки.',
    correct: 'Верно. Все произведения соединены правильно.',
    wrong: 'Подсказка: посчитайте каждый пример столбиком. Отвлекающие карточки близки к верному ответу — будьте внимательны.',
  },
};

export default function D04_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]); // {v, ci} yoki null
  const [pick, setPick] = useState(null); // tanlangan bank karta indeksi
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } }
  }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  // qisman to'g'ri = HAMMASI qizil: har juftni alohida emas, umumiy verdiktga bog'la
  const allOk = checked && slots.every((x, idx) => x && x.v === D09_ROWS[idx].ans);
  const slotTint = ['#fe5b1a', '#7c3aed', '#0f766e', '#c2410c'];
  const slotBg = ['#fff4ee', '#faf5ff', '#f0fdfa', '#fff7ed'];

  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) {
      setSlots((s) => { const n = s.slice(); n[i] = { v: D09_CARDS[pick], ci: pick }; return n; });
      setPick(null);
    } else if (slots[i] != null) {
      setSlots((s) => { const n = s.slice(); n[i] = null; return n; });
    }
  };

  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D09_ROWS[i].ans);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.setup, options: [], studentAnswer: { slots, label: slots.map((x) => x && x.v).join(',') }, correctAnswer: { slots: D09_ROWS.map((r) => r.ans) }, correct, meta: { tag: D09_DATA.tag, level: D09_DATA.level } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ margin: '10px 0 4px' }}>
        {D09_ROWS.map((r, i) => {
          const cell = slots[i]; const v = cell ? cell.v : null;
          let bd = '#cbd5e1', bg = '#f8fafc', col = '#1f2430';
          if (checked && v != null) { bd = allOk ? '#1a7f43' : '#c0392b'; bg = allOk ? '#e8f7ee' : '#fdecec'; col = allOk ? '#1a7f43' : '#c0392b'; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, justifyContent: 'center' }}>
              <div style={{ width: 110, ...S.mono, fontSize: 22, fontWeight: 800, textAlign: 'right', color: '#374151' }}>{r.q} =</div>
              <div onClick={clickSlot(i)} style={{ width: 72, height: 50, borderRadius: 12, border: '2px ' + (v != null ? 'solid ' + bd : 'dashed ' + slotTint[i]), background: v != null ? bg : slotBg[i], display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 22, fontWeight: 800, color: col }}>
                {v != null ? v : ''}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12, marginTop: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {D09_CARDS.map((c, idx) => {
            if (usedSet.has(idx)) return <span key={idx} style={{ width: 58, height: 52, borderRadius: 12, border: '2px dashed #e5e7eb', background: '#fafafa' }} />;
            const on = pick === idx;
            return (
              <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)}
                style={{ width: 58, height: 52, borderRadius: 12, border: '2px solid ' + (on ? '#fe5b1a' : '#cbd5e1'), background: on ? '#fff0e8' : '#fff', ...S.mono, fontSize: 21, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #ffe7d8' : 'none' }}>
                {c}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: '#9aa1ad', fontWeight: 600, marginTop: 8 }}>{t.hint}</div>

      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
