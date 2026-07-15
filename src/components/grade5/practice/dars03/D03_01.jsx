// Yig'indi. To'g'ri javobdan keyin misol gorizontaldan ustun shakliga o'tadi:
// javob joyi pastga tushadi, misol o'rtaga siljiydi, 1360 va + pastga tushadi,
// so'ng javob o'ngdan chapga raqamma-raqam ustunda "qo'shiladi".
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const grp3 = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const D01_A = 27330, D01_B = 1360, D01_SUM = 28690;
const D01_T = {
  uz: {
    eyebrow: "Qo'shish",
    setup: "Bekzod ikki sonni ustunda qo'shmoqchi:",
    label: "Yig'indini yozing:",
    correct: "To'g'ri. 27 330 + 1 360 = 28 690.",
    wrong: "Maslahat: har xil xonalarni aralashtirmang — birlik birlik bilan, o'nlik o'nlik bilan qo'shiladimi? Xonalar to'g'ri tizilganini tekshiring.",
  },
  ru: {
    eyebrow: 'Сложение',
    setup: 'Бекзод складывает два числа столбиком:',
    label: 'Запишите сумму:',
    correct: 'Верно. 27 330 + 1 360 = 28 690.',
    wrong: 'Подсказка: не смешивайте разряды — единицы складываются с единицами, десятки с десятками? Проверьте, верно ли выровнены разряды.',
  },
};
const D01_DIG_A = '27330'.split('');
const D01_DIG_B = ['', '', '1', '3', '6', '0']; // 5 xonaga tekislangan
const D01_DIG_A5 = ['2', '7', '3', '3', '0'];
const D01_DIG_S = '28690'.split('');

export default function D03_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ph, setPh] = useState(0); // 1 misol markazga · 2 ustunga o'tadi · 3 javob raqamlari
  const [sumShown, setSumShown] = useState(0);
  const [centerX, setCenterX] = useState(0);
  const rowWrapRef = useRef(null);
  const rowRef = useRef(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.value != null) {
      setVal(String(sa.value));
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) { setPh(3); setSumShown(5); } }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(String(val).replace(/[^0-9]/g, '') || '-1', 10);
    const correct = v === D01_SUM;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => {
        if (rowWrapRef.current && rowRef.current) {
          const w = rowWrapRef.current.offsetWidth, rw = rowRef.current.offsetWidth;
          setCenterX(Math.max(0, (w - rw) / 2));
        }
        setPh(1);
      }, 550));   // gorizontal misol markazga sekin siljiydi
      timers.current.push(setTimeout(() => setPh(2), 1600));  // ustunga o'tadi
      timers.current.push(setTimeout(() => setPh(3), 2700));  // javob boshlanadi
      [0, 1, 2, 3, 4].forEach((k) => timers.current.push(setTimeout(() => setSumShown(k + 1), 3000 + k * 480)));
    }
    onSubmit?.({
      questionText: t.setup, options: [],
      studentAnswer: { value: v }, correctAnswer: { value: D01_SUM },
      correct, meta: { tag: 'sum_input', level: '🟢' },
    });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cw = 30; // ustun katak eni
  const col = (arr, opts = {}) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      {arr.map((c, i) => (
        <span key={i} style={{ width: cw, textAlign: 'center', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 800, color: opts.color || '#1f2430', ...(opts.cell || {}) }}>{c}</span>
      ))}
    </div>
  );

  return (
    <div style={S.wrap}>
      <style>{`
        .d3-pop { animation: d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d3-drop { animation: d3drop .7s cubic-bezier(.22,1,.36,1) both; }
        @keyframes d3drop { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d3-pop, .d3-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      {/* gorizontal ko'rinish — ph 0 (chapda), ph 1 (markazga sekin siljiydi) */}
      {ph < 2 && (
        <div ref={rowWrapRef} style={{ position: 'relative', height: 48, margin: '18px 0 20px', overflow: 'hidden' }}>
          <span ref={rowRef} style={{
            position: 'absolute', left: 0, top: 6, whiteSpace: 'nowrap',
            transform: `translateX(${ph >= 1 ? centerX : 0}px)`,
            transition: 'transform 1.7s cubic-bezier(.45,0,.15,1)',
            fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 800, letterSpacing: 1,
          }}>
            {grp3(D01_A)} <span style={{ color: '#6b7280' }}>+</span> {grp3(D01_B)}
          </span>
        </div>
      )}

      {/* ustun ko'rinishi — ph >= 2 */}
      {ph >= 2 && (
        <div className="d3-drop" style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 20px' }}>
          <div style={{ minWidth: 6 * cw + 12 }}>
            {col(D01_DIG_A5)}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
              <span style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 800, marginRight: 'auto', paddingLeft: 4 }}>+</span>
              {D01_DIG_B.map((c, i) => (
                <span key={i} style={{ width: cw, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800 }}>{c}</span>
              ))}
            </div>
            <div style={{ height: 3, background: '#1f2430', borderRadius: 2, margin: '5px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {D01_DIG_S.map((c, i) => {
                const idxFromRight = 5 - i;
                const show = sumShown >= idxFromRight;
                return (
                  <span key={i} className={show ? 'd3-pop' : undefined}
                    style={{ width: cw, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: '#1a7f43', opacity: show ? 1 : 0 }}>{c}</span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700 }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
          disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 180, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
