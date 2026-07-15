// Dars26 · Amaliyot 08 — Vergulni joyla · 🔴 · tag: dec_place_comma
// 3,4 + 0,75 = ? Natija raqamlari 4 1 5. Vergul 4 dan keyin → 4,15 (yuzdanlargacha bor).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 8px', textAlign: 'center' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d26-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_DIGITS = ['4', '1', '5'];
const D08_CORRECT = 1; // vergul 4 dan keyin (slot 1) → 4,15
const D08_T = {
  uz: {
    eyebrow: 'Vergulni joyla', setup: "Rustam 3,4 + 0,75 ni qo'shdi va raqamlari 4, 1, 5 chiqdi. Endi vergul kerak.",
    ask: "Vergulni to'g'ri joyga qo'ying:", hint: 'Raqamlar orasidagi katakni bosing',
    correct: "To'g'ri: 4,15. Yuzdanlargacha bor, demak vergul ikki raqam oldida.",
    wrong: "Qo'shiluvchilarda eng ko'p nechta kasr xonasi bor? Natijada ham shuncha kasr xonasi qoladi — shunga qarab vergulni joylang.",
    rule: "Natijadagi kasr xonasi — eng ko'p kasr xonaga teng.",
  },
  ru: {
    eyebrow: 'Поставь запятую', setup: 'Рустам сложил 3,4 + 0,75 и получил цифры 4, 1, 5. Теперь нужна запятая.',
    ask: 'Поставь запятую в правильное место:', hint: 'Нажми на ячейку между цифрами',
    correct: 'Верно: 4,15. Есть сотые, значит запятая перед двумя цифрами.',
    wrong: 'Сколько знаков после запятой у слагаемого с наибольшим их числом? Столько же будет в ответе — по этому и ставь запятую.',
    rule: 'Число знаков после запятой в ответе — как у слагаемого с наибольшим числом знаков.',
  },
};

export default function D26_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [slot, setSlot] = useState(null); // 0..3 (raqamlar orasidagi bo'shliq)
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slot != null) { setSlot(sa.slot); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(slot != null && !checked); }, [slot, checked, onReady]);
  const check = useCallback(() => {
    const correct = slot === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slot }, correctAnswer: { slot: D08_CORRECT, value: '4,15' }, correct, meta: { tag: 'dec_place_comma', level: '🔴' } });
  }, [slot, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  // slotlar: 0 (4dan oldin), 1 (4|1), 2 (1|5). Chekka slotlar (3) mantiqsiz — 3 ta ichki/oldingi slot
  const slots = [0, 1, 2];
  const commaColor = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        .d26-comma { animation: d26comma .6s ease both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d26comma { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop, .d26-comma { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, margin: '10px 0 4px' }}>
        {D08_DIGITS.map((d, i) => (
          <React.Fragment key={i}>
            {slots.includes(i) && (
              <button type="button" disabled={locked} onClick={() => setSlot(i)} style={{ width: slot === i ? 26 : 20, height: 56, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: locked ? 'default' : 'pointer', padding: 0 }}>
                {slot === i
                  ? <span className="d26-comma" style={{ fontFamily: MONO, fontSize: 40, fontWeight: 800, color: commaColor, lineHeight: 1 }}>,</span>
                  : <span style={{ width: 10, height: 34, borderRadius: 3, background: locked ? 'transparent' : '#e2e8f0' }} />}
              </button>
            )}
            <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 800, color: '#1f2430' }}>{d}</span>
          </React.Fragment>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700, textAlign: 'center', margin: '2px 0 0' }}>{t.hint}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
