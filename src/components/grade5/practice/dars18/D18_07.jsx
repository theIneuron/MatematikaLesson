// Dars18 · Amaliyot 07 — Qadamba-qadam · 🔴 · tag: sub_two_step
// 8/9 − 2/9 − 3/9. O'quvchi ikki qadamni ketma-ket to'ldiradi: 8−2=6, 6−3=3. Natija 3/9.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// 8/9: 9 katak, 8 bo'yalgan. Ikki bosqich: 2 ta (havorang) + 3 ta (pushti) chiqadi → 3 qoladi.
const D07_REMOVE = { 3: 0, 4: 0, 5: 1, 6: 1, 7: 1 }; // indeks → bosqich (0/1)
function Bar({ stage, w = 288, h = 38 }) {
  const n = 9, cw = w / n;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={'b' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => {
        const st = D07_REMOVE[i]; // undefined = qoladi
        const gone = st != null && stage > st; // stage 0=hech, 1=1-qadam ketdi, 2=hammasi
        const col = st === 0 ? '#ffb488' : st === 1 ? '#c4b5fd' : '#86efac';
        return <rect key={'s' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill={col} stroke="#94a3b8" strokeWidth="0.8"
          style={{ transform: gone ? 'translateY(-16px)' : 'none', opacity: gone ? 0 : 1, transition: 'transform .5s ease, opacity .5s ease' }} />;
      })}
    </svg>
  );
}

const D07_S1 = 6, D07_S2 = 3; // 8−2=6 ; 6−3=3
const D07_T = {
  uz: {
    eyebrow: 'Ulashdi', setup: "Javohirda 8/9 quti pechenye bor edi. Sinfda do'sti Umidga 2/9 qismini, ukasiga esa 3/9 qismini berdi.",
    ask: "Har bir qadamni to'ldiring:",
    s1: 'Umidga bergandan keyin:', s2: 'Ukasiga bergandan keyin:',
    correct: "To'g'ri. Avval 8 − 2 = 6, keyin 6 − 3 = 3. Maxraj 9 barcha qadamda o'sha. Javohirda 3/9 qoldi.",
    wrong: "Maslahat: hammasini birdan ayirmang. Avval birinchi qadamni bajaring, chiqqan natijadan ikkinchisini ayiring.",
    rule: "Ketma-ket ayirganda ham har qadamda faqat suratlar ayriladi, maxraj o'sha qoladi.",
  },
  ru: {
    eyebrow: 'Поделился', setup: 'У Джавохира было 8/9 коробки печенья. В классе он дал другу Умиду 2/9, а брату — 3/9.',
    ask: 'Заполни каждый шаг:',
    s1: 'После Умида:', s2: 'После брата:',
    correct: 'Верно. Сначала 8 − 2 = 6, потом 6 − 3 = 3. Знаменатель 9 на всех шагах тот же. У Джавохира осталось 3/9.',
    wrong: 'Подсказка: не вычитай всё сразу. Сначала сделай первый шаг, из полученного вычти второе число.',
    rule: 'При последовательном вычитании на каждом шаге вычитаются только числители, знаменатель тот же.',
  },
};

export default function D18_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [stage, setStage] = useState(0);
  const timer = useRef([]);
  useEffect(() => () => timer.current.forEach(clearTimeout), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.v1 != null) setV1(String(s.v1)); if (s.v2 != null) setV2(String(s.v2)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStage(2); } } }, [initialAnswer]);
  const full = /^\d+$/.test(v1) && /^\d+$/.test(v2);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(v1, 10) === D07_S1 && parseInt(v2, 10) === D07_S2;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) { timer.current.push(setTimeout(() => setStage(1), 300)); timer.current.push(setTimeout(() => setStage(2), 1000)); }
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { v1: parseInt(v1, 10), v2: parseInt(v2, 10) }, correctAnswer: { v1: D07_S1, v2: D07_S2 }, correct, meta: { tag: 'sub_two_step', level: '🔴' } });
  }, [v1, v2, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const cell = (border) => ({ width: 46, height: 40, textAlign: 'center', fontSize: 21, fontWeight: 800, borderRadius: 10, border: '2px solid ' + border, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' });
  const StepRow = ({ from, minus, val, setVal, okv, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Frac num={String(from)} den="9" size={20} color="#334155" />
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <Frac num={String(minus)} den="9" size={20} color="#334155" />
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={cell(bdOf(val, okv))} />
          <div style={{ width: 48, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>9</div>
        </div>
      </div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d18-pop { animation: d18pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d18-pop { animation: none !important; } svg [style] { transition: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0 6px' }}>
        <Bar stage={stage} />
        {stage >= 2 && <span className="d18-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...S.mono, fontSize: 17, fontWeight: 800, color: '#0f766e' }}>=<Frac num="3" den="9" size={19} color="#0f766e" /></span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: 4 }}>
        <StepRow from={8} minus={2} val={v1} setVal={setV1} okv={D07_S1} label={t.s1} />
        <StepRow from={/^\d+$/.test(v1) ? v1 : '?'} minus={3} val={v2} setVal={setV2} okv={D07_S2} label={t.s2} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
