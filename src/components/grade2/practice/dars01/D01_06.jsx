// Dars 1 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d01-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

// o'nlik = KASSETA (10-slotli magazin, LED bilan) · birlik = BATAREYA (sanoat elementi)
// — etalon Dars01_2.jsx dagi BatterySvg / CassetteSvg dan aynan ko'chirildi.
const Battery = ({ s = 20, delay = 0, anim = true }) => (
  <svg className={anim ? 'd01-drop' : undefined} width={s * 0.66} height={s} viewBox="0 0 22 34" aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.28))', animationDelay: delay + 's' }}>
    <defs>
      <linearGradient id="d2batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96" /><stop offset="22%" stopColor="#43B6E0" /><stop offset="50%" stopColor="#8FE0F4" /><stop offset="74%" stopColor="#2FA0CC" /><stop offset="100%" stopColor="#0A5876" /></linearGradient>
      <linearGradient id="d2battcap" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8FA0AE" /><stop offset="35%" stopColor="#EEF3F7" /><stop offset="65%" stopColor="#C6D2DB" /><stop offset="100%" stopColor="#7E93A2" /></linearGradient>
      <linearGradient id="d2battband" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B23A26" /><stop offset="30%" stopColor="#FF7A5E" /><stop offset="100%" stopColor="#C7401F" /></linearGradient>
    </defs>
    <rect x="8" y="0.6" width="6" height="3.6" rx="1.5" fill="url(#d2battcap)" stroke="#6E828F" strokeWidth="0.6" />
    <rect x="9.4" y="0.2" width="3.2" height="1.4" rx="0.7" fill="#F4F8FA" />
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="url(#d2batt)" stroke="#093F55" strokeWidth="1" />
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
    <rect x="1.4" y="12.5" width="19.2" height="9" fill="url(#d2battband)" opacity="0.95" />
    <path d="M12.6 14 L8.8 20.4 L11.2 20.4 L9.8 25.6 L14.4 18.4 L11.8 18.4 Z" fill="#FFE9A6" stroke="#D89A18" strokeWidth="0.4" />
    <rect x="3.4" y="6" width="2.4" height="25" rx="1.2" fill="rgba(255,255,255,0.4)" />
    <rect x="16.4" y="6" width="1.4" height="25" rx="0.7" fill="rgba(0,0,0,0.18)" />
  </svg>
);

const Cassette = ({ s = 26, delay = 0, anim = true, lit = true }) => (
  <svg className={anim ? 'd01-drop' : undefined} width={s} height={s * 66 / 48} viewBox="0 0 48 66" aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.3))', animationDelay: delay + 's' }}>
    <defs>
      <linearGradient id="d2cass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5E82" /><stop offset="24%" stopColor="#7385AB" /><stop offset="52%" stopColor="#8C9EC4" /><stop offset="76%" stopColor="#63739A" /><stop offset="100%" stopColor="#4E5E82" /></linearGradient>
      <linearGradient id="d2batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96" /><stop offset="22%" stopColor="#43B6E0" /><stop offset="50%" stopColor="#8FE0F4" /><stop offset="74%" stopColor="#2FA0CC" /><stop offset="100%" stopColor="#0A5876" /></linearGradient>
    </defs>
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#d2cass)" stroke="#33415F" strokeWidth="1.4" />
    <rect x="1" y="4" width="46" height="61" rx="7" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
    <g fill="rgba(0,0,0,0.22)"><rect x="3.4" y="18" width="2" height="30" rx="1" /><rect x="42.6" y="18" width="2" height="30" rx="1" /></g>
    <g fill="#8494AE"><circle cx="6" cy="9.5" r="1.3" /><circle cx="42" cy="9.5" r="1.3" /><circle cx="6" cy="60" r="1.3" /><circle cx="42" cy="60" r="1.3" /></g>
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" stroke="#2A3550" strokeWidth="0.6" />
    <circle cx="24" cy="9.2" r="2" fill={lit ? '#6EF29B' : '#3A4A66'} stroke="#10182A" strokeWidth="0.6" />
    {lit && <circle cx="24" cy="9.2" r="4.4" fill="rgba(110,242,155,0.4)" />}
    {Array.from({ length: 10 }).map((_, i) => {
      const col = i % 2; const row = Math.floor(i / 2);
      return (
        <g key={i} transform={`translate(${6.5 + col * 19.5} ${16 + row * 9.4})`}>
          <rect x="0" y="0" width="15" height="7.4" rx="2.4" fill="#33415F" stroke="#5A6B8840" strokeWidth="0.5" />
          <rect x="1" y="1" width="13" height="5.4" rx="1.8" fill="url(#d2batt)" stroke="#093F55" strokeWidth="0.4" />
          <rect x="1.8" y="1.6" width="11.4" height="1.5" rx="0.7" fill="rgba(255,255,255,0.3)" />
        </g>
      );
    })}
  </svg>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d01-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d01-pop { animation: d01pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-star { opacity: .35; animation: d01tw 3.2s ease-in-out infinite; }
        @keyframes d01tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d01-drop { animation: d01drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-float { animation: d01float 3s ease-in-out infinite; }
        @keyframes d01float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d01-pulse { animation: d01pulse 1.5s ease-in-out infinite; }
        @keyframes d01pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D06_CORRECT = 1;
const D06_T = {
  uz: {
    eyebrow: 'To‘g‘rimi?', setup: "Ekranda 3 kasseta, 6 batareya va «63» yozuvi.",
    ask: '3 kasseta va 6 batareya — bu 63mi?',
    yes: 'Ha, to‘g‘ri', no: 'Yo‘q, xato',
    correct: "To'g'ri! Bu 63 emas, 36. O'nlik oldinda: 3 o'nlik 6 birlik = 36.",
    wrong: "Maslahat: o'nlik (kasseta) birinchi raqam. 3 o'nlik 6 birlik = 36, 63 emas.",
    rule: "O'rin muhim: 36 va 63 — har xil son. O'nlik oldinda turadi.",
  },
  ru: {
    eyebrow: 'Верно ли?', setup: 'На экране 3 кассеты, 6 батареек и надпись «63».',
    ask: '3 кассеты и 6 батареек — это 63?',
    yes: 'Да, верно', no: 'Нет, ошибка',
    correct: 'Верно! Это не 63, а 36. Десятки впереди: 3 десятка 6 единиц = 36.',
    wrong: 'Подсказка: десятки (кассета) — первая цифра. 3 десятка 6 единиц = 36, не 63.',
    rule: 'Порядок важен: 36 и 63 — разные числа. Десятки впереди.',
  },
};
function D01_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: '0', label: t.yes }, { id: '1', label: t.no }], studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'pv_tf', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (i, label) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = C.ink;
    if (on) { bg = C.accSoft; bd = C.acc; }
    if (show) { const ok = i === D06_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: 1, minHeight: 66, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 800, fontFamily: 'inherit', cursor: (isReview || checked) ? 'default' : 'pointer' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: 3 }).map((_, i) => <Cassette key={i} s={50} delay={i * 0.05} />)}</div>
          <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: 6 }).map((_, i) => <Battery key={i} s={42} delay={(3 + i) * 0.05} />)}</div>
          <div style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#FF9A82', border: '2px solid #FF9A82', borderRadius: 10, padding: '2px 12px' }}>63</div>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>{btn(0, t.yes)}{btn(1, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_06(props) {
  return (<><style>{FX_CSS}</style><D01_06Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D01_06.audio = {
  uz: { intro: "Ekranda 3 kasseta, 6 batareya va 63 yozuvi. 3 kasseta va 6 batareya, bu 63mi?", on_correct: "To'g'ri! Bu 63 emas, 36. O'nlik oldinda. 3 o'nlik 6 birlik teng 36.", on_wrong: "Maslahat. O'nlik kasseta birinchi raqam. 3 o'nlik 6 birlik teng 36, 63 emas." },
  ru: { intro: "На экране 3 кассеты, 6 батареек и надпись 63. 3 кассеты и 6 батареек, это 63?", on_correct: "Верно! Это не 63, а 36. Десятки впереди. 3 десятка 6 единиц равно 36.", on_wrong: "Подсказка. Десятки кассета, первая цифра. 3 десятка 6 единиц равно 36, не 63." },
};
