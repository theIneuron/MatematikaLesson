// Dars06 · Amaliyot 05 — Harorat o'zgardi · 🟡 · temp_change (javob kiritish)
// Ertalab -8, tushda +3. Necha gradusga isidi? Son o'qida siljish ko'rsatiladi.
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

const D05_FROM = -8, D05_TO = 3, D05_ANS = 11;
const D05_T = {
  uz: {
    eyebrow: 'Harorat', setup: "Ertalab -8°C edi, tushga borib +3°C bo'ldi.",
    ask: 'Havo necha gradusga ISIDI?', label: 'Farqni yozing:',
    correct: "To'g'ri. -8 dan 0 gacha 8, keyin 0 dan 3 gacha 3. Jami 8 + 3 = 11 gradus.",
    wrong: "Maslahat: harorat manfiydan musbatga o'tdi — yo'l nol chizig'idan o'tadi. Nolgacha va noldan keyingi qismlarni alohida o'ylab ko'ring.",
  },
  ru: {
    eyebrow: 'Температура', setup: 'Утром было -8°C, к обеду стало +3°C.',
    ask: 'На сколько градусов ПОТЕПЛЕЛО?', label: 'Запишите разницу:',
    correct: 'Верно. От -8 до 0 восемь, затем от 0 до 3 три. Всего 8 + 3 = 11 градусов.',
    wrong: 'Подсказка: температура перешла из минуса в плюс — путь идёт через ноль. Продумайте отдельно часть до нуля и часть после.',
  },
};
export default function D06_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [pos, setPos] = useState(D05_FROM); // yuruvchi token pozitsiyasi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPos(D05_TO); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^-?\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) { [-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3].forEach((v, k) => timers.current.push(setTimeout(() => setPos(v), 400 + k * 320))); }
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'temp_change', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const nums = [-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4];
  const NR = nums.length - 1;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* harorat o'qi: token -5 dan -2 gacha o'ngga yuradi */}
      <div style={{ position: 'relative', height: 84, margin: '14px 12px 6px' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 46, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
        {nums.map((v, i) => {
          const hl = v === D05_FROM || v === D05_TO;
          const c = v === D05_TO ? '#f59e0b' : v === D05_FROM ? '#fe5b1a' : '#94a3b8';
          return (
            <div key={v} style={{ position: 'absolute', left: (i / (nums.length - 1) * 100) + '%', top: 34, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ width: hl ? 13 : 9, height: hl ? 13 : 9, borderRadius: 999, background: hl ? c : '#cbd5e1', margin: '0 auto' }} />
              <div style={{ marginTop: 5, fontSize: 11, fontWeight: 800, color: c, ...S.mono }}>{v}°</div>
            </div>
          );
        })}
        {/* yuruvchi termometr token */}
        <div style={{ position: 'absolute', left: ((pos - nums[0]) / NR * 100) + '%', top: 6, transform: 'translateX(-50%)', transition: 'left .55s cubic-bezier(.34,1.56,.64,1)' }}>
          <div style={{ fontSize: 18 }}>🌡️</div>
        </div>
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^-\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
