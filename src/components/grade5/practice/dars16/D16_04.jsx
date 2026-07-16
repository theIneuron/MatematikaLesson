// Dars16 · Amaliyot 04 (poz. 2) — Bo'laklarni guruhla · 🟡 · tag: group_reduce
// Vizual qisqartirish: 12 katakli lenta, 8 bo'yalgan (8/12). Har 4 katakni birlashtir → 2/3.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// matn ichidagi kasrlarni ikki qatorli ko'rsatish (a/b, ?/b, ?/? tokenlari)
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// ikki qatorli kasr (qoida bo'yicha yozuv)
const Frac = ({ num, den, size = 18, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);

// 8/12: 12 katak, 8 bo'yalgan. Har 4 katakni guruhlash → 3 ta blok, 2 tasi bo'yalgan = 2/3.
const D04_TOTAL = 12, D04_SHADED = 8, D04_CORRECT = 4;
const D04_OPTS = [2, 3, 4, 6, 8];
const D04_T = {
  uz: {
    eyebrow: 'Guruhlab qisqartir', setup: "Shokolad plitkasi 12 ta bo'lakka bo'lingan, 8 tasi bo'yalgan — bu 8/12.",
    ask: "Bir xil bo'yalgan miqdorni kamroq, kattaroq bo'lakda ko'rsataylik. Bo'laklarni nechtadan guruhlasak, kasr eng sodda holga keladi?",
    unit: 'tadan',
    correct: "To'g'ri. Har 4 bo'lakni birlashtirsak, 12 katak 3 ta katta bo'lak bo'ladi, 8 bo'yalgan esa 2 ta bo'ladi: 8/12 = 2/3.",
    wrong: "Maslahat: guruh o'lchovi bo'yalgan bo'laklarni ham, jamini ham butun guruhlarga ajratishi kerak — hech bir bo'lak bo'linib qolmasin. Qaysi o'lcham eng kam, eng yirik bo'lak beradi?",
    rule: "Eng katta umumiy bo'luvchiga guruhlasangiz, bir zarbda eng sodda holga kelasiz.",
  },
  ru: {
    eyebrow: 'Сократи группировкой', setup: 'Плитка шоколада разделена на 12 частей, 8 закрашено — это 8/12.',
    ask: 'Покажем то же закрашенное количество бо́льшими частями. По сколько частей сгруппировать, чтобы дробь стала простейшей?',
    unit: 'по',
    correct: 'Верно. Если объединить по 4 части, 12 клеток станут 3 большими частями, а 8 закрашенных — 2: 8/12 = 2/3.',
    wrong: 'Подсказка: размер группы должен разбивать и закрашенные, и все части на целые группы — ни одна часть не должна разрезаться. Какой размер даёт меньше всего, но крупнее части?',
    rule: 'Сгруппируй по наибольшему общему делителю — сократишь до конца за раз.',
  },
};

// bo'lingan lenta (n bo'lak, shaded tasi bo'yalgan)
function Bar({ n, shaded, w = 300, h = 46, pop }) {
  const cw = w / n;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={pop ? 'd16-pop' : undefined} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={i * cw} y="1" width={cw} height={h - 2} rx="3"
          fill={i < shaded ? '#ffb488' : '#eef2f7'} stroke="#fff" strokeWidth="2" />
      ))}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="6" fill="none" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}

export default function D16_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pick != null) { setPick(sa.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 450);
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((n) => ({ id: String(n), label: String(n) })), studentAnswer: { pick }, correctAnswer: { group: D04_CORRECT, result: '2/3' }, correct, meta: { tag: 'group_reduce', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0 4px' }}>
        <Bar n={D04_TOTAL} shaded={D04_SHADED} />
        <Frac num="8" den="12" size={19} color="#fe5b1a" />
        {reveal && (
          <>
            <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#14b8a6' }}>↓ ÷4</span>
            <Bar n={3} shaded={2} pop />
            <span className="d16-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 17, fontWeight: 800, color: '#0f766e', ...S.mono }}>=<Frac num="2" den="3" size={19} color="#0f766e" /></span>
          </>
        )}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D04_OPTS.map((n) => {
          const on = pick === n;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#b83d0e'; }
          if (checked && on) { const ok = n === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={n} type="button" disabled={isReview || checked} onClick={() => setPick(n)} style={{ minWidth: 72, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 15, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{lang === 'uz' ? `${n} ${t.unit}` : `${t.unit} ${n}`}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
