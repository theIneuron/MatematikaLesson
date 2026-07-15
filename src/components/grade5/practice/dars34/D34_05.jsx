// Dars34 · Amaliyot 05 — Beshburchak perimetri · 🟡 · tag: peri_assemble
// Beshburchak tomonlari matnda berilgan: 4, 2, 3, 3, 4 m. O'quvchi o'zi hisoblab kiritadi: P = 16 m.
// Chegara bo'ylab yurish chizmasi faqat to'g'ri javobdan keyin izoh sifatida ochiladi (NAQSH A).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1d4ed8' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Beshburchak (uy shakli) — chegara bo'ylab yurish izohi (faqat to'g'ri javobdan keyin)
function PentaReveal({ accent = '#1d4ed8' }) {
  return (
    <div className="d34-pop" style={{ margin: '6px auto 2px', width: 220, maxWidth: '100%' }}>
      <style>{`
        .d34p-s{stroke-dasharray:1;stroke-dashoffset:1;animation:d34pdraw .55s ease forwards;}
        .d34p-s2{animation-delay:.55s}.d34p-s3{animation-delay:1.1s}.d34p-s4{animation-delay:1.65s}.d34p-s5{animation-delay:2.2s}
        .d34p-l{opacity:0;animation:d34plab .4s ease forwards;}
        .d34p-l1{animation-delay:.4s}.d34p-l2{animation-delay:.95s}.d34p-l3{animation-delay:1.5s}.d34p-l4{animation-delay:2.05s}.d34p-l5{animation-delay:2.6s}
        .d34p-dot{animation:d34pdot 2.75s linear forwards;}
        @keyframes d34pdraw{to{stroke-dashoffset:0}}
        @keyframes d34plab{to{opacity:1}}
        @keyframes d34pdot{0%{transform:translate(0px,0px)}20%{transform:translate(140px,0px)}40%{transform:translate(140px,-70px)}60%{transform:translate(70px,-116px)}80%{transform:translate(0px,-70px)}100%{transform:translate(0px,0px)}}
        @media (prefers-reduced-motion: reduce){.d34p-s{stroke-dashoffset:0!important;animation:none!important}.d34p-l{opacity:1!important;animation:none!important}.d34p-dot{animation:none!important}}
      `}</style>
      <svg width="220" height="200" viewBox="0 0 220 200" style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <polygon points="40,150 180,150 180,80 110,34 40,80" fill="#eff6ff" stroke="#e5e7eb" strokeWidth="1" />
        <line className="d34p-s" pathLength="1" x1="40" y1="150" x2="180" y2="150" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34p-s d34p-s2" pathLength="1" x1="180" y1="150" x2="180" y2="80" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34p-s d34p-s3" pathLength="1" x1="180" y1="80" x2="110" y2="34" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34p-s d34p-s4" pathLength="1" x1="110" y1="34" x2="40" y2="80" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34p-s d34p-s5" pathLength="1" x1="40" y1="80" x2="40" y2="150" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <g fontFamily="'JetBrains Mono',monospace" fontWeight="800" fontSize="13" fill="#1f2430">
          <text className="d34p-l d34p-l1" x="110" y="169" textAnchor="middle">4</text>
          <text className="d34p-l d34p-l2" x="197" y="123" textAnchor="start">2</text>
          <text className="d34p-l d34p-l3" x="160" y="52" textAnchor="middle">3</text>
          <text className="d34p-l d34p-l4" x="60" y="52" textAnchor="middle">3</text>
          <text className="d34p-l d34p-l5" x="23" y="123" textAnchor="end">4</text>
        </g>
        <circle className="d34p-dot" cx="40" cy="150" r="6.5" fill={accent} stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

const D05_ANS = 16;
const D05_T = {
  uz: {
    eyebrow: 'Beshburchak', setup: "Oybek beshburchak maydonchani chizdi. Tomonlari: 4 m, 2 m, 3 m, 3 m va 4 m.",
    ask: 'Maydoncha perimetrini toping (m):', label: 'P =',
    correct: "To'g'ri. Chegara bo'ylab yursak: 4 + 2 + 3 + 3 + 4 = 16 m.",
    wrong: "Perimetr — chegara bo'ylab to'liq aylana. Bironta tomon tashlab ketilsa, chegara to'liq bo'lmaydi — beshta tomon ham hisobga olindimi?",
    rule: "Perimetr — barcha tomonlar yig'indisi (istalgan shakl uchun).",
  },
  ru: {
    eyebrow: 'Пятиугольник', setup: 'Ойбек нарисовал пятиугольную площадку. Стороны: 4 м, 2 м, 3 м, 3 м и 4 м.',
    ask: 'Найди периметр площадки (м):', label: 'P =',
    correct: 'Верно. Обходя по границе: 4 + 2 + 3 + 3 + 4 = 16 м.',
    wrong: 'Периметр — это полный обход по границе. Если пропустить сторону, граница неполная — все ли пять сторон учтены?',
    rule: 'Периметр — сумма всех сторон (для любой фигуры).',
  },
};

export default function D34_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const num = () => parseFloat(String(val).replace(',', '.'));
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val.trim() !== '' && !isNaN(num()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = Math.abs(num() - D05_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: num() }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'peri_assemble', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#1d4ed8';
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d34-pop { animation: d34pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        .d34-drop { animation: d34drop .5s ease both; }
        @keyframes d34pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d34drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d34-pop, .d34-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d34-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, margin: '6px 0 10px', padding: '10px 8px', borderRadius: 14, background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
          <PentaReveal />
          <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1d4ed8' }}>4 + 2 + 3 + 3 + 4 = 16 m</div>
        </div>
      )}
      <p className={revealed ? 'd34-drop' : ''} style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div className={revealed ? 'd34-drop' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>{t.label}</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 92, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 700, color: '#6b7280' }}>m</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
