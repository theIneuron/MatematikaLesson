// Dars 5 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d05-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d05-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d05-pop { animation: d05pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d05pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d05-star { opacity: .35; animation: d05tw 3.2s ease-in-out infinite; }
        @keyframes d05tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D06_TENS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90], D06_TARGET = 30;
const D06_T = {
  uz: {
    eyebrow: 'Dial', setup: 'Aylana bo‘ylab yaxlit o‘nliklar. Strelka markazda.',
    ask: 'Dialni 30 ga burang (mos o‘nlikni bosing).',
    correct: "To'g'ri. Strelka 30 ga qaradi.",
    wrong: "Maslahat: 30 — uchinchi o'nlik. 0, 10, 20, 30 deb sanang.",
    rule: "Yaxlit o'nliklar: 0, 10, 20, 30 … 30 uchinchi o'nlik.",
  },
  ru: {
    eyebrow: 'Циферблат', setup: 'По кругу круглые десятки. Стрелка в центре.',
    ask: 'Поверни циферблат на 30 (нажми нужный десяток).',
    correct: 'Верно. Стрелка указала на 30.',
    wrong: 'Подсказка: 30 — третий десяток. Считай 0, 10, 20, 30.',
    rule: 'Круглые десятки: 0, 10, 20, 30 … 30 — третий десяток.',
  },
};
function D05_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked != null && D06_TENS[picked] === D06_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D06_TENS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { idx: picked, label: picked != null ? String(D06_TENS[picked]) : null }, correctAnswer: { value: D06_TARGET }, correct, meta: { tag: 'dial', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const R = 82, cx = 100, cy = 100;
  const needleDeg = picked != null ? picked * 36 : null;
  const needleCol = checked ? (fb?.correct ? C.ok : C.no) : C.acc;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid ' + C.stageBd, background: 'radial-gradient(circle,#1b2b4d,#101c38)' }} />
          {needleDeg != null && <div style={{ position: 'absolute', left: cx - 2, top: cy - 64, width: 4, height: 64, background: needleCol, borderRadius: 2, transformOrigin: '2px 64px', transform: 'rotate(' + needleDeg + 'deg)', transition: 'transform .3s' }} />}
          <div style={{ position: 'absolute', left: cx - 6, top: cy - 6, width: 12, height: 12, borderRadius: '50%', background: needleCol }} />
          {D06_TENS.map((n, i) => {
            const rad = (i * 36 - 90) * Math.PI / 180;
            const x = cx + R * Math.cos(rad), y = cy + R * Math.sin(rad);
            const on = picked === i;
            let bd = C.stageBd, bg = C.stile, col = C.sink2;
            if (on && !checked) { bd = C.acc; bg = C.acc; col = '#08111f'; }
            if (checked && on) { const ok = D06_TENS[i] === D06_TARGET; bd = ok ? C.ok : C.no; bg = ok ? C.ok : C.no; col = '#fff'; }
            return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ position: 'absolute', left: x - 17, top: y - 17, width: 34, height: 34, borderRadius: '50%', border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 12, fontWeight: 800, color: col, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{n}</button>;
          })}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21, textAlign: 'center' }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_06(props) {
  return (<><style>{FX_CSS}</style><D05_06Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D05_06.audio = {
  uz: { intro: "Aylana bo'ylab yaxlit o'nliklar. Strelka markazda. Dialni 30 ga burang mos o'nlikni bosing.", on_correct: "To'g'ri. Strelka 30 ga qaradi.", on_wrong: "Maslahat. 30, uchinchi o'nlik. 0, 10, 20, 30 deb sanang." },
  ru: { intro: "По кругу круглые десятки. Стрелка в центре. Поверни циферблат на 30 нажми нужный десяток.", on_correct: "Верно. Стрелка указала на 30.", on_wrong: "Подсказка. 30, третий десяток. Считай 0, 10, 20, 30." },
};
