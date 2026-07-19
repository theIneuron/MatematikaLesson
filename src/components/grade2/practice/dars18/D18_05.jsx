// Dars 18 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  box: '#F0B978', gold: '#FFC23C',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d18-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

function BoxArray({ r, c, s = 18, anim = true }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + c + ', ' + s + 'px)', gap: 4, justifyContent: 'center' }}>
      {Array.from({ length: r * c }).map((_, i) => <span key={i} className={anim ? 'd18-drop' : undefined} style={{ width: s, height: s, borderRadius: 4, background: 'linear-gradient(160deg,#F5C88E,#D9944B)', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.22)', animationDelay: (i * 0.03) + 's' }} />)}
    </div>
  );
}

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = C.paper, bd = C.line, col = '#374151';
  if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
  if (show) { const ok = i === correctIdx; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '14px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 66,
  };
}

const FX_CSS = `.d18-pop { animation: d18pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d18-star { opacity: .35; animation: d18tw 3.2s ease-in-out infinite; }
        @keyframes d18tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d18-drop { animation: d18drop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d18drop { 0% { opacity: 0; transform: translateY(-8px) scale(.4); } 100% { opacity: 1; transform: none; } }
        .d18-turn { animation: d18turn .5s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18turn { 0% { opacity: .3; transform: rotate(-14deg) scale(.85); } 100% { opacity: 1; transform: none; } }
        .d18-float { animation: d18float 3s ease-in-out infinite; }
        @keyframes d18float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d18-pulse { animation: d18pulse 1.5s ease-in-out infinite; }
        @keyframes d18pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_CORRECT = 0;
const D05_T = {
  uz: {
    eyebrow: 'Aylantir', setup: "Ombordagi 6 × 2 quti massivini aylantiring.",
    ask: 'Aylantirgach, qutilar soni o‘zgaradimi?',
    rotate: 'Aylantir', back: 'Ortga',
    opts: ["O'zgarmaydi", "O'zgaradi"],
    hint6x2: '6 × 2', hint2x6: '2 × 6',
    correct: "To'g'ri. 6 × 2 = 12 va 2 × 6 = 12. Aylantirdik, soni o'zgarmadi.",
    wrong: "Maslahat: aylantirishda faqat ko'rinish o'zgaradi. Qutilar soni o'sha — 12.",
    rule: "Massivni aylantirsangiz, jami o'zgarmaydi: a × b = b × a.",
  },
  ru: {
    eyebrow: 'Поверни', setup: 'Поверни массив ящиков 6 × 2 на складе.',
    ask: 'После поворота число ящиков изменится?',
    rotate: 'Повернуть', back: 'Назад',
    opts: ['Не изменится', 'Изменится'],
    hint6x2: '6 × 2', hint2x6: '2 × 6',
    correct: 'Верно. 6 × 2 = 12 и 2 × 6 = 12. Повернули, число не изменилось.',
    wrong: 'Подсказка: при повороте меняется только вид. Ящиков столько же — 12.',
    rule: 'Если повернуть массив, итог не меняется: a × b = b × a.',
  },
};
function D18_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [rot, setRot] = useState(false);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); setRot(true); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: t.opts[0] }, correct, meta: { tag: 'rotate_same', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="d18-turn" key={rot ? 'a' : 'b'}>{rot ? <BoxArray r={2} c={6} anim={false} /> : <BoxArray r={6} c={2} anim={false} />}</div>
          <div style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: C.gold }}>{rot ? t.hint2x6 : t.hint6x2}</div>
          <button type="button" disabled={locked} onClick={() => setRot((r) => !r)} style={{ padding: '10px 20px', borderRadius: 12, border: '2px solid ' + C.box, background: 'rgba(240,185,120,.14)', color: C.box, fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: locked ? 'default' : 'pointer', minHeight: 46 }}>↻ {rot ? t.back : t.rotate}</button>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, D05_CORRECT, checked, isReview, { half: true, center: true, fs: 16 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D18_05(props) {
  return (<><style>{FX_CSS}</style><D18_05Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D18_05.audio = {
  uz: { intro: "Ombordagi 6 ko'paytirish 2 quti massivini aylantiring. Aylantirgach, qutilar soni o'zgaradimi?", on_correct: "To'g'ri. 6 ko'paytirish 2 teng 12 va 2 ko'paytirish 6 teng 12. Aylantirdik, soni o'zgarmadi.", on_wrong: "Maslahat. Aylantirishda faqat ko'rinish o'zgaradi. Qutilar soni o'sha, 12." },
  ru: { intro: "Поверни массив ящиков 6 умножить на 2 на складе. После поворота число ящиков изменится?", on_correct: "Верно. 6 умножить на 2 равно 12 и 2 умножить на 6 равно 12. Повернули, число не изменилось.", on_wrong: "Подсказка. При повороте меняется только вид. Ящиков столько же, 12." },
};
