// Dars10 · Amaliyot 03 — Nuqta qo'yish · 🟡 · place_fraction (interaktiv)
// 3/4 ni son o'qida bosib belgilash. 0-1, 4 ulush.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D03_DEN = 4, D03_NUM = 3, D03_TARGET_U = 3;
const D03_T = {
  uz: {
    eyebrow: "Nuqta qo'yish", setup: "Son o'qida 0 bilan 1 orasi 4 ta teng ulushga bo'lingan.",
    ask: '3/4 turgan joyni bosib belgilang:',
    correct: "To'g'ri. 3/4 — 4 ulushdan 3-si, 1 gacha atigi 1 ulush qoldi.",
    wrong: "Maslahat: surat 0 dan sanaladigan ulushlar sonini bildiradi. Nuqta 1 gacha yetadimi yoki bir oz oldinmi?",
    rule: "Kasrni qo'yish: 0 dan surat qancha bo'lsa, shuncha ulush sanang.",
  },
  ru: {
    eyebrow: 'Поставь точку', setup: 'На оси отрезок от 0 до 1 разделён на 4 равные доли.',
    ask: 'Отметьте, где стоит 3/4:',
    correct: 'Верно. 3/4 — 3-я из 4 долей, до 1 осталась 1 доля.',
    wrong: 'Подсказка: числитель — число долей, отсчитанных от 0. Точка дошла до 1 или чуть раньше?',
    rule: 'Постановка дроби: от 0 отсчитай столько долей, сколько в числителе.',
  },
};
export default function D10_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null); // ulush indeksi 0..4
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.u != null) { setPick(initialAnswer.studentAnswer.u); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_TARGET_U;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { u: pick }, correctAnswer: { u: D03_TARGET_U }, correct, meta: { tag: 'place_fraction', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 100 / D03_DEN;
  return (
    <div style={S.wrap}>
      <style>{`
        .d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d10-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ position: 'relative', height: 90, margin: '18px 8px 8px' }}>
        <div style={{ position: 'absolute', left: '3%', right: '3%', top: 44, height: 3, background: '#bae6fd', borderRadius: 2 }} />
        {Array.from({ length: D03_DEN + 1 }).map((_, u) => {
          const on = pick === u;
          const isInt = u === 0 || u === D03_DEN;
          let dot = isInt ? '#64748b' : '#cbd5e1';
          if (on) dot = '#0ea5e9';
          if (checked && fb?.correct && u === D03_TARGET_U) dot = '#1a7f43';
          if (checked && on && u !== D03_TARGET_U) dot = '#c0392b';
          return (
            <div key={u} onClick={() => { if (!checked && !isReview) setPick(u); }} style={{ position: 'absolute', left: `calc(3% + ${u * W * 0.94}%)`, top: 28, transform: 'translateX(-50%)', textAlign: 'center', cursor: (checked || isReview) ? 'default' : 'pointer' }}>
              <div style={{ width: on || (checked && fb?.correct && u === D03_TARGET_U) ? 20 : 13, height: on || (checked && fb?.correct && u === D03_TARGET_U) ? 20 : 13, borderRadius: 999, background: dot, margin: '0 auto', transition: 'all .45s ease', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.15)' }} />
              {isInt && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, color: '#64748b', ...S.mono }}>{u === 0 ? '0' : '1'}</div>}
            </div>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
