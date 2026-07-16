// Dars09 · Amaliyot 03 — Bo'yash · 🟡 · shade_fraction (interaktiv bo'yash)
// 2/5 ni bo'yash. Polosa 5 ulush, bola 2 tasini bosib bo'yaydi.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// kasr belgisi (surat/maxraj chiziqcha bilan)
const Frac = ({ num, den, size = 26, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

const D03_DEN = 5, D03_NUM = 2;
const D03_T = {
  uz: {
    eyebrow: "Bo'yash", setup: "Yo'lak teng ulushlarga bo'lingan.",
    ask: "2/5 ni ko'rsatish uchun kerakli ulushlarni bosib bo'yang:",
    correct: "To'g'ri. 5 ulushdan 2 tasi bo'yalgan — bu 2/5.",
    wrong: "Maslahat: bo'yaladigan ulushlar sonini kasrning qaysi qismi belgilaydi — yuqoridagimi yoki pastdagimi?",
    rule: "Kasrni bo'yash: surat qancha bo'lsa, shuncha ulush bo'yaladi (maxrajdan).",
  },
  ru: {
    eyebrow: 'Закрашивание', setup: 'Дорожка разделена на равные доли.',
    ask: 'Закрасьте нужные доли, чтобы показать 2/5:',
    correct: 'Верно. Из 5 долей закрашено 2 — это 2/5.',
    wrong: 'Подсказка: какая часть дроби задаёт, сколько долей закрасить — верхняя или нижняя?',
    rule: 'Закрашивание дроби: закрашиваем столько долей, сколько в числителе.',
  },
};
export default function D09_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(new Set());
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(new Set(sa.sel)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.size > 0 && !checked); }, [sel, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (i) => { if (locked) return; setSel((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; }); };
  const check = useCallback(() => {
    const correct = sel.size === D03_NUM;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel: [...sel], count: sel.size }, correctAnswer: { count: D03_NUM }, correct, meta: { tag: 'shade_fraction', level: '🟡' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ textAlign: 'center', margin: '4px 0 12px' }}><Frac num="2" den="5" size={34} color="#fe5b1a" /></div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', margin: '8px 0' }}>
        {Array.from({ length: D03_DEN }).map((_, i) => {
          const on = sel.has(i);
          let bg = on ? '#fe5b1a' : '#fff4ee', bd = on ? '#e24e12' : '#ffd6bd';
          if (checked) { if (on) { const ok = sel.size === D03_NUM; bg = ok ? '#1a7f43' : '#c0392b'; bd = bg; } }
          return <button key={i} type="button" disabled={locked} onClick={() => toggle(i)} style={{ width: 56, height: 76, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', borderRadius: i === 0 ? '12px 0 0 12px' : i === D03_DEN - 1 ? '0 12px 12px 0' : 0, transition: 'background .2s' }} />;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
