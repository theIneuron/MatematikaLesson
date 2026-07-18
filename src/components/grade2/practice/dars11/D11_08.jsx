// Dars 11 · Amaliyot 08 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const DUST = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DUST.map((s, i) => <span key={i} className="d11-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 23.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

/* mini ustun (variant tanlash uchun) */
// addCols: har bir joylangan raqamning RANGI (raqamning haqiqiy xona-qiymati bo'yicha).
const MiniCol = ({ top, add, sign, addCols }) => {
  const c0 = (addCols && addCols[0]) || C.ten, c1 = (addCols && addCols[1]) || C.one;
  return (
    <div style={{ display: 'inline-block' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '18px 30px 30px', marginBottom: 2 }}><span /><div style={{ fontSize: 8.5, fontWeight: 800, color: C.ten, textAlign: 'center' }}>O‘N</div><div style={{ fontSize: 8.5, fontWeight: 800, color: C.one, textAlign: 'center' }}>BIR</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: '18px 30px 30px', alignItems: 'center' }}><span /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.ten, textAlign: 'center' }}>{top[0]}</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.one, textAlign: 'center' }}>{top[1]}</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '18px 30px 30px', alignItems: 'center' }}><span style={{ ...S.mono, fontSize: 18, color: C.sink2, textAlign: 'center' }}>{sign}</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: c0, textAlign: 'center' }}>{add[0]}</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: c1, textAlign: 'center' }}>{add[1]}</span></div>
      <div style={{ height: 2, background: C.sink2, margin: '3px 0 0 18px' }} />
    </div>
  );
};

const FX_CSS = `.d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-star { opacity: .4; animation: d11tw 3.4s ease-in-out infinite; }
        @keyframes d11tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 34 + 25: A) to'g'ri (2 o'nlik, 5 birlik) B) almashgan (5 o'nlik, 2 birlik)
// 25: 2 — o'nlik (sariq), 5 — birlik (ko'k). Rang raqamning haqiqiy xona-qiymati bo'yicha —
// almashgan variantda ko'k 5 o'nlik ustunida turgani darrov ko'rinadi.
const D08_SETUPS = [{ add: ['2', '5'], cols: [C.ten, C.one] }, { add: ['5', '2'], cols: [C.one, C.ten] }];
const D08_CORRECT = 0;
const D08_T = {
  uz: { eyebrow: 'Ustun almashishi', setup: '34 + 25 uchun ikki tuzilma.', ask: 'Qaysi tuzilma TO‘G‘RI? (birlik ostiga birlik, o‘nlik ostiga o‘nlik)', correct: "To'g'ri. 2 — o‘nlik (3 ostida), 5 — birlik (4 ostida).", wrong: "Maslahat: 25 da qaysi raqam birlik? Har raqam o‘z ustuni ostida turganini tekshiring.", rule: "Har raqam o‘z xonasi ustuniga: 2 → o‘nlik, 5 → birlik." },
  ru: { eyebrow: 'Перепутаны столбцы', setup: 'Две записи для 34 + 25.', ask: 'Какая запись ВЕРНА? (единицы под единицы, десятки под десятки)', correct: 'Верно. 2 — десятки (под 3), 5 — единицы (под 4).', wrong: 'Подсказка: какая цифра в 25 — единицы? Проверь, стоит ли каждая цифра под своим разрядом.', rule: 'Каждая цифра в свой разряд: 2 → десятки, 5 → единицы.' },
};
function D11_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); const [fb, setFb] = useState(null); const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_SETUPS.map((s, i) => ({ id: String(i), label: 'AB'[i] })), studentAnswer: { idx: picked }, correctAnswer: { idx: 0, label: 'A' }, correct, meta: { tag: 'swapcheck', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
          {D08_SETUPS.map((st, i) => {
            const on = picked === i, show = checked && on; let bd = C.stageBd, glow = 'none';
            if (on && !checked) { bd = C.acc; glow = '0 0 0 4px rgba(255,79,40,.25)'; }
            if (show) { const okv = i === D08_CORRECT; bd = okv ? C.ok : C.no; glow = '0 0 0 4px ' + (okv ? 'rgba(31,122,77,.3)' : 'rgba(192,57,43,.3)'); }
            return (
              <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ border: '2.5px solid ' + bd, borderRadius: 14, background: 'rgba(255,255,255,0.04)', padding: '12px 16px', cursor: (isReview || checked) ? 'default' : 'pointer', boxShadow: glow }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, marginBottom: 4 }}>{'AB'[i]}</div>
                <MiniCol top={['3', '4']} add={st.add} addCols={st.cols} sign="+" />
              </button>
            );
          })}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D11_08(props) {
  return (<><style>{FX_CSS}</style><D11_08Impl {...props} /></>);
}
