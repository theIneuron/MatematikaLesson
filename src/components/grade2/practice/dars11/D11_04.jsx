// Dars 11 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

// ustun yordamchilari (tuzish)
const ColHeader = ({ w = 46 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `28px ${w}px ${w}px`, marginBottom: 4 }}>
    <span /><div style={{ fontSize: 10, fontWeight: 800, color: C.ten, textAlign: 'center', letterSpacing: '.04em' }}>O‘N</div><div style={{ fontSize: 10, fontWeight: 800, color: C.one, textAlign: 'center', letterSpacing: '.04em' }}>BIR</div>
  </div>
);

const Colon = ({ children }) => (
  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '12px 18px' }}>{children}</div>
);

const Fixed = ({ ch, c, w = 46, dim }) => <div style={{ width: w, height: 50, ...S.mono, fontSize: 32, fontWeight: 800, color: c, opacity: dim ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</div>;

const slotColors = (tone) => {
  if (tone === 'sel') return { bd: C.acc, bg: 'rgba(255,79,40,.2)', col: '#fff', dash: 'solid' };
  if (tone === 'ok') return { bd: C.ok, bg: 'rgba(31,122,77,.3)', col: '#9df0bd', dash: 'solid' };
  if (tone === 'no') return { bd: C.no, bg: 'rgba(192,57,43,.32)', col: '#ffb4a8', dash: 'solid' };
  return { bd: C.boxBd, bg: 'rgba(255,255,255,0.03)', col: C.sink2, dash: 'dashed' };
};

const Slot = ({ ch, tone, onClick, disabled, w = 46 }) => {
  const s = slotColors(tone);
  const st = { width: w, height: 50, borderRadius: 10, border: '2.5px ' + s.dash + ' ' + s.bd, background: s.bg, ...S.mono, fontSize: 32, fontWeight: 800, color: s.col, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onClick && !disabled ? 'pointer' : 'default' };
  return onClick ? <button type="button" disabled={disabled} onClick={onClick} style={st}>{ch}</button> : <div style={st}>{ch}</div>;
};

const RowG = ({ sign, ten, one, w = 46 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `28px ${w}px ${w}px`, alignItems: 'center', margin: '3px 0' }}>
    <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: C.sink2, textAlign: 'center' }}>{sign || ''}</span>{ten}{one}
  </div>
);

const HR = ({ w = 46 }) => <div style={{ height: 3, background: C.sink2, borderRadius: 2, margin: '5px 0', marginLeft: 28, width: w * 2 }} />;

const FX_CSS = `.d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-star { opacity: .4; animation: d11tw 3.4s ease-in-out infinite; }
        @keyframes d11tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D04_OPTS = { uz: ['Bo‘sh qoladi', '0 yoziladi', '6 yoziladi'], ru: ['Остаётся пустой', 'Пишется 0', 'Пишется 6'] };
const D04_CORRECT = 0;
const D04_T = {
  uz: { eyebrow: 'Bo‘sh katak', setup: '64 + 3 ni ustunlab tuzdik. 3 — bir xonali son, u birlik ustunida.', ask: '3 ning yonidagi bo‘sh O‘NLIK katagiga (?) nima qo‘yiladi?', correct: "To'g'ri. 3 — bir xonali son, o‘nligi yo‘q — o‘nlik katak bo‘sh qoladi.", wrong: "Maslahat: 3 sonining o‘nligi bormi? Bo‘lmasa, o‘nlik katakka nima qo‘yamiz?", rule: "Bir xonali sonning o‘nlik katagi bo‘sh qoladi (0 yozilmaydi)." },
  ru: { eyebrow: 'Пустая ячейка', setup: 'Записали 64 + 3 столбиком. 3 — однозначное число, в столбце единиц.', ask: 'Что ставится в пустую ячейку ДЕСЯТКОВ (?) рядом с 3?', correct: 'Верно. У 3 нет десятков — ячейка десятков остаётся пустой.', wrong: 'Подсказка: есть ли у числа 3 десятки? Если нет, что ставим в ячейку десятков?', rule: 'Ячейка десятков однозначного числа пуста (0 не пишем).' },
};
function D11_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz; const opts = D04_OPTS[lang] || D04_OPTS.uz;
  const order = React.useMemo(() => { const a = opts.map((_, i) => i); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; }, []);
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); const [fb, setFb] = useState(null); const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: opts[picked] }, correctAnswer: { idx: 0, label: opts[0] }, correct, meta: { tag: 'emptycol', level: '🟡' } });
  }, [picked, opts, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Colon>
            <ColHeader />
            <RowG sign="" ten={<Fixed ch="6" c={C.ten} />} one={<Fixed ch="4" c={C.one} />} />
            <RowG sign="+" ten={<Slot ch="?" tone={null} w={46} />} one={<Fixed ch="3" c={C.acc} />} />
            <HR />
          </Colon>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {order.map((i) => {
          const on = picked === i, show = checked && on; let bd = C.line, bg = C.paper, col = C.ink;
          if (on && !checked) { bd = C.acc; bg = C.accSoft; }
          if (show) { const okv = i === D04_CORRECT; bd = okv ? C.ok : C.no; bg = okv ? C.okSoft : C.noSoft; col = okv ? C.ok : C.no; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ minHeight: 56, borderRadius: 13, border: '2px solid ' + bd, background: bg, fontSize: 18, fontWeight: 800, fontFamily: 'inherit', color: col, cursor: (isReview || checked) ? 'default' : 'pointer', padding: '0 16px' }}>{opts[i]}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D11_04(props) {
  return (<><style>{FX_CSS}</style><D11_04Impl {...props} /></>);
}
