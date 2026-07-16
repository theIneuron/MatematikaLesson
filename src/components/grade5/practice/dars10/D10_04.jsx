// Dars10 · Amaliyot 04 — Kasrni moslash · 🟡 · label_axis (o'qqa kartalarni joylash)
// Son o'qi 0-1, 6 bo'lak. 3 nuqta ostida bo'sh katak. Pastda 6 karta (3 to'g'ri).
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
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D04_DEN = 6;
const D04_SLOTS = [2, 3, 5]; // qaysi ulushlarga nuqta qo'yilgan (2/6, 3/6, 5/6)
const D04_CARDS = ['2/6', '3/6', '5/6', '4/6', '1/6', '6/6']; // 3 to'g'ri + 3 chalg'ituvchi
const D04_T = {
  uz: {
    eyebrow: 'Kasrni moslash', setup: "Son o'qi 0 dan 1 gacha 6 teng ulushga bo'lingan. Uch nuqta belgilangan.",
    ask: "Har bir nuqta ostidagi bo'sh katakka to'g'ri kasrni joylang:",
    correct: "To'g'ri. Nuqtalar 2/6, 3/6 va 5/6 da turibdi — 0 dan sanaganda nechinchi ulush.",
    wrong: "Maslahat: har nuqta uchun 0 dan nechta ulush borligini sanang. Maxraj hamma joyda 6.",
    rule: "Nuqta kasri = 0 dan nuqtagacha ulushlar / jami ulushlar (6).",
  },
  ru: {
    eyebrow: 'Соотнеси дробь', setup: 'Ось от 0 до 1 разделена на 6 равных долей. Отмечены три точки.',
    ask: 'Поместите верную дробь в пустую клетку под каждой точкой:',
    correct: 'Верно. Точки стоят на 2/6, 3/6 и 5/6 — сколько долей от 0.',
    wrong: 'Подсказка: для каждой точки сосчитайте доли от 0. Знаменатель везде 6.',
    rule: 'Дробь точки = доли от 0 до точки / всего долей (6).',
  },
};
export default function D10_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null]); // {v, ci}
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D04_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const correctLabel = (i) => `${D04_SLOTS[i]}/${D04_DEN}`;
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === correctLabel(i));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { labels: D04_SLOTS.map((k) => `${k}/${D04_DEN}`) }, correct, meta: { tag: 'label_axis', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 100 / D04_DEN;
  return (
    <div style={S.wrap}>
      <style>{`
        .d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d10-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      {/* son o'qi: 6 ulush, 3 nuqta + ostida bo'sh katak */}
      <div style={{ position: 'relative', height: 108, margin: '14px 12px 8px' }}>
        <div style={{ position: 'absolute', left: '2%', right: '2%', top: 30, height: 3, background: '#bae6fd', borderRadius: 2 }} />
        {Array.from({ length: D04_DEN + 1 }).map((_, u) => {
          const isInt = u === 0 || u === D04_DEN;
          const isMarked = D04_SLOTS.includes(u);
          return (
            <div key={u} style={{ position: 'absolute', left: `calc(2% + ${u * W * 0.96}%)`, top: 22, transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ width: isMarked ? 15 : (isInt ? 4 : 3), height: isMarked ? 15 : (isInt ? 16 : 11), borderRadius: isMarked ? 999 : 2, background: isMarked ? '#0ea5e9' : (isInt ? '#64748b' : '#cbd5e1'), margin: '0 auto', border: isMarked ? '2px solid #fff' : 'none', boxShadow: isMarked ? '0 1px 3px rgba(0,0,0,.2)' : 'none' }} />
              {isInt && <div style={{ marginTop: 20, fontSize: 12, fontWeight: 800, color: '#64748b', ...S.mono }}>{u === 0 ? '0' : '1'}</div>}
            </div>
          );
        })}
        {/* bo'sh kataklar nuqtalar ostida */}
        {D04_SLOTS.map((u, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = '#7dd3fc', bg = '#f0f9ff', col = '#0369a1';
          if (checked && v != null) { const ok = !!fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <div key={'s' + i} onClick={clickSlot(i)} style={{ position: 'absolute', left: `calc(2% + ${u * W * 0.96}%)`, top: 54, transform: 'translateX(-50%)', width: 48, height: 42, borderRadius: 10, border: '2px ' + (v ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 15, fontWeight: 800, color: col }}>{v || ''}</div>
          );
        })}
      </div>
      {/* kartalar */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
        {D04_CARDS.map((c, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 58, height: 46, borderRadius: 11, border: '2px dashed #e5e7eb', background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 58, height: 46, borderRadius: 11, border: '2px solid ' + (on ? '#0ea5e9' : '#cbd5e1'), background: on ? '#e0f2fe' : '#fff', ...S.mono, fontSize: 17, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #bae6fd' : 'none' }}>{c}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
