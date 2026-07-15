// Dars22 · Amaliyot 02 — Butunlarga qadoqla · 🟡 · tag: to_mixed_pack
// 11/3 → uchtadan guruhlang: 11 = 3 + 3 + 3 + 2 → 3 butun va 2/3 = 3⅔. Bo'laklar sekin guruhlanadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
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
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D02 = { w: 3, r: 2 }; // 11/3 = 3 butun va 2/3
const D02_T = {
  uz: {
    eyebrow: 'Qadoqla', setup: "Zaynab 11/3 ni uchdan bo'laklar bilan chizib qo'ydi. Har uchta bo'lak bitta butunni to'ldiradi.",
    ask: '11/3 ni aralash songa aylantiring. Necha butun va nechta uchdan qoladi?',
    l1: 'Butun:', l2: 'Qoldiq (uchdan):',
    correct: "To'g'ri. 11 = 3 + 3 + 3 + 2: uchta to'liq guruh (3 butun) va 2 ta bo'lak ortadi. Demak 11/3 = 3⅔.",
    wrong: "Maslahat: bo'laklarni uchtadan ajrating. Nechta to'liq guruh hosil bo'ladi va nechta bo'lak ortib qoladi?",
    rule: "Noto'g'ri → aralash: maxrajga bo'l; butun sonlar = butun qism, qoldiq = surat.",
  },
  ru: {
    eyebrow: 'Упакуй', setup: 'Зайнаб нарисовала 11/3 третями. Каждые три части заполняют одно целое.',
    ask: 'Переведи 11/3 в смешанное число. Сколько целых и сколько третей останется?',
    l1: 'Целых:', l2: 'Остаток (третей):',
    correct: 'Верно. 11 = 3 + 3 + 3 + 2: три полные группы (3 целых) и 2 части в остатке. Значит 11/3 = 3⅔.',
    wrong: 'Подсказка: раздели части по три. Сколько полных групп получится и сколько частей останется?',
    rule: 'Неправильная → смешанное: раздели на знаменатель; целые = целая часть, остаток = числитель.',
  },
};

export default function D22_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [w, setW] = useState('');
  const [r, setR] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.r != null) setR(String(s.r)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setGrouped(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(r);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D02.w && parseInt(r, 10) === D02.r;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setGrouped(true), 300);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), r: parseInt(r, 10) }, correctAnswer: D02, correct, meta: { tag: 'to_mixed_pack', level: '🟡' } });
  }, [w, r, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 50, height: 44, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  // 11 bo'lak: guruhlanmaganda qatorda; guruhlanganda 3+3+3+2 oraliq bilan
  const GROUP_COL = ['#93c5fd', '#86efac', '#a5b4fc']; // uchta to'liq guruh ranglari
  const piece = (i) => {
    const grp = grouped ? Math.floor(i / 3) : -1; // 0..2 to'liq, 3 = qoldiq
    const isRem = i >= 9;
    const gapLeft = grouped ? (i % 3 === 0 && i > 0 ? 15 : 3) : 3;
    const col = grouped ? (isRem ? '#fcd34d' : GROUP_COL[grp]) : '#c4b5fd';
    return <div key={i} style={{ width: 26, height: 32, borderRadius: 5, background: col, border: '1.5px solid ' + (grouped ? '#94a3b8' : '#a78bfa'), marginLeft: gapLeft, transition: 'margin .5s ease, background .5s ease' }} />;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } div { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '10px 0 4px', flexWrap: 'wrap' }}>
        <Frac num="11" den="3" size={26} color="#7c3aed" /><span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'flex' }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(piece)}</div>
      </div>
      {grouped && <div className="d22-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 13, fontWeight: 800, color: '#0f766e', marginBottom: 4 }}>{lang === 'uz' ? "3 butun + 2 bo'lak → 3⅔" : '3 целых + 2 части → 3⅔'}</div>}
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>{box(w, setW, D02.w)}</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div>{box(r, setR, D02.r)}</div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
