// Dars12 · Amaliyot 06 — O'sish tartibi · 🟡 · tag: order_asc (drag + tap)
// Maxraj bir xil (6): kasrlarni suratlari bo'yicha kichikdan kattaga joylashtirish.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- SHARED ---------- */
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #2563eb; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;
/* ---------- /SHARED ---------- */

const D12_06_DATA = { den: 6, bank: [5, 1, 4, 2], correct: [1, 2, 4, 5], tag: 'order_asc', level: '🟡' };
const CARD_TINT = { 1: '#e0f2fe', 2: '#dcfce7', 4: '#fef9c3', 5: '#fae8ff' };
const D12_06_T = {
  uz: {
    eyebrow: 'Tartib', title: "O'sish tartibi",
    setup: "Kasrlarni kichikdan kattaga joylashtiring.",
    ask: "Kartani bo'sh joyga sudrang. Yoki kartani bosing, keyin bo'sh joyni bosing.",
    slotHint: "Joylashtirilgan kartani bosib qaytarib olish mumkin.",
    correct: "To'g'ri. Maxrajlar bir xil, demak tartibni suratlar belgilaydi.",
    wrongMsg: "Maslahat: maxrajlar bir xil — 6. Unda kasrning kattaligini nima belgilaydi?",
    bank: 'Kartalar',
  },
  ru: {
    eyebrow: 'Порядок', title: 'По возрастанию',
    setup: 'Расставьте дроби от меньшей к большей.',
    ask: 'Перетащите карточку в пустое место. Или нажмите карточку, затем пустое место.',
    slotHint: 'Поставленную карточку можно вернуть нажатием.',
    correct: 'Верно. Знаменатели одинаковые, значит порядок задают числители.',
    wrongMsg: 'Подсказка: знаменатели одинаковые — 6. Тогда что задаёт величину дроби?',
    bank: 'Карточки',
  },
};

export default function D12_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_06_T[lang] || D12_06_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]);
  const [bank, setBank] = useState(D12_06_DATA.bank);
  const [picked, setPicked] = useState(null);
  const [drag, setDrag] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const slotRefs = useRef([]);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.order) {
      setSlots(sa.order); setBank([]);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  const full = slots.every((v) => v != null);
  const correctOrder = full && slots.join(',') === D12_06_DATA.correct.join(',');
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;

  // v ni i-slotga joylashtirish. from: 'bank' yoki slot indeksi.
  const place = useCallback((v, from, i) => {
    setSlots((prev) => {
      const ns = prev.slice();
      const occupant = ns[i];
      ns[i] = v;
      if (typeof from === 'number') ns[from] = occupant;            // slot ↔ slot almashinuvi
      else if (occupant != null) setBank((b) => [...b, occupant]);  // siqib chiqarilgan karta bankka
      return ns;
    });
    if (from === 'bank') setBank((b) => b.filter((x) => x !== v));
    setPicked(null);
  }, []);

  const toBank = useCallback((i) => {
    setSlots((prev) => { const ns = prev.slice(); const v = ns[i]; ns[i] = null; if (v != null) setBank((b) => [...b, v]); return ns; });
    setPicked(null);
  }, []);

  const hitSlot = (x, y) => slotRefs.current.findIndex((el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  });

  const down = (v, from) => (e) => {
    if (locked) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
    setDrag({ v, from, dx: 0, dy: 0, moved: false });
  };
  const move = (e) => {
    if (!drag || locked) return;
    const dx = e.clientX - origin.current.x, dy = e.clientY - origin.current.y;
    setDrag((d) => ({ ...d, dx, dy, moved: d.moved || Math.hypot(dx, dy) > 6 }));
  };
  const up = (e) => {
    if (!drag || locked) { setDrag(null); return; }
    const { v, from, moved } = drag;
    if (moved) {
      const i = hitSlot(e.clientX, e.clientY);
      if (i >= 0) place(v, from, i);
      else if (typeof from === 'number') toBank(from);
    } else {
      if (typeof from === 'number') toBank(from);
      else setPicked(picked === v ? null : v);
    }
    setDrag(null);
  };

  const clickSlot = (i) => () => {
    if (locked) return;
    if (picked != null) place(picked, 'bank', i);
    else if (slots[i] != null) toBank(i);
  };

  const check = useCallback(() => {
    const correct = slots.join(',') === D12_06_DATA.correct.join(',');
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.setup,
      options: D12_06_DATA.bank.map((n) => ({ id: String(n), label: n + '/6' })),
      studentAnswer: { order: slots, label: slots.map((n) => n + '/6').join(' < ') },
      correctAnswer: { order: D12_06_DATA.correct, label: D12_06_DATA.correct.map((n) => n + '/6').join(' < ') },
      correct, meta: { tag: D12_06_DATA.tag, level: D12_06_DATA.level },
    });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const cardBox = (v, dragging, sel) => ({
    width: 68, height: 84, borderRadius: 14, background: CARD_TINT[v] || '#f1f5f9',
    border: '2px solid ' + (sel ? '#2563eb' : '#cbd5e1'),
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: locked ? 'default' : 'grab', userSelect: 'none', touchAction: 'none',
    transform: dragging ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.06)` : 'none',
    boxShadow: dragging ? '0 12px 24px rgba(31,36,48,.2)' : sel ? '0 0 0 4px #dbeafe' : 'none',
    zIndex: dragging ? 20 : 1, position: 'relative',
    transition: dragging ? 'none' : 'transform .16s, box-shadow .16s, border-color .16s',
  });

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'flex-end', margin: '18px 0 4px' }}>
        {slots.map((v, i) => {
          let bd = '#cbd5e1', bg = '#f8fafc';
          if (checked && v != null) { const ok = correctOrder; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <div key={i} style={{ textAlign: 'center' }}>
              <div ref={(el) => (slotRefs.current[i] = el)} onClick={clickSlot(i)}
                style={{ width: 72, height: 88, borderRadius: 15, border: '2px dashed ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer' }}>
                {v != null && (
                  <div {...(locked ? {} : { onPointerDown: down(v, i), onPointerMove: move, onPointerUp: up, onPointerCancel: () => setDrag(null) })}
                    style={cardBox(v, drag && drag.from === i && drag.moved, false)}>
                    <Frac a={v} b={D12_06_DATA.den} size={21} />
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#9aa1ad', marginTop: 4 }}>{i + 1}</div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: '#9aa1ad', letterSpacing: '.05em', marginBottom: 18 }}>
        {lang === 'uz' ? "KICHIK  →  KATTA" : 'МЕНЬШЕ  →  БОЛЬШЕ'}
      </div>

      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', minHeight: 88, alignItems: 'center', flexWrap: 'wrap' }}>
          {bank.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {bank.map((v) => (
            <div key={v} role="button" tabIndex={locked ? -1 : 0}
              {...(locked ? {} : { onPointerDown: down(v, 'bank'), onPointerMove: move, onPointerUp: up, onPointerCancel: () => setDrag(null) })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPicked(picked === v ? null : v); } }}
              style={cardBox(v, drag && drag.from === 'bank' && drag.v === v && drag.moved, picked === v)}>
              <Frac a={v} b={D12_06_DATA.den} size={21} />
            </div>
          ))}
        </div>
      </div>

      <p className="pq-ask" style={{ fontSize: 14, fontWeight: 600, color: '#6b7280', marginTop: 12 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
