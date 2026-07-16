// Dars25 · Amaliyot 06 — O'sish tartibida joyla · 🟡 · tag: order_decimals
// 0,7 · 0,68 · 0,75 ni kichikdan kattaga (yuzdanli aralash). To'g'ri: 0,68 < 0,7 < 0,75.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_ITEMS = [{ id: 'a', v: '0,7', n: 70 }, { id: 'b', v: '0,68', n: 68 }, { id: 'c', v: '0,75', n: 75 }];
const D06_T = {
  uz: {
    eyebrow: 'Tartibla', setup: "Nilufar uch sonni kichikdan kattaga terib chiqmoqchi. Sonlarni eng kichigidan boshlab bosing.",
    ask: 'Kichikdan kattaga bosing (eng kichigi — birinchi):', reset: 'Boshidan',
    correct: "To'g'ri. 0,7 = 0,70. Yuzdangacha qarasak: 68 < 70 < 75, demak 0,68 < 0,7 < 0,75.",
    wrong: "Sonlarni diqqat bilan solishtiring — raqamlar soni har xil, lekin bu kattalikni belgilamaydi.",
    rule: "Solishtirishda 0,7 = 0,70. 0,68 < 0,70 < 0,75.",
  },
  ru: {
    eyebrow: 'Упорядочи', setup: 'Нилуфар хочет расставить три числа от меньшего к большему. Нажимай, начиная с самого маленького.',
    ask: 'Нажимай от меньшего к большему (сначала — самое маленькое):', reset: 'Сначала',
    correct: 'Верно. 0,7 = 0,70. По сотым: 68 < 70 < 75, значит 0,68 < 0,7 < 0,75.',
    wrong: 'Сравни числа внимательно — количество цифр разное, но не оно определяет величину.',
    rule: 'При сравнении 0,7 = 0,70. 0,68 < 0,70 < 0,75.',
  },
};

export default function D25_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [seq, setSeq] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.seq) { setSeq(sa.seq); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(seq.length === 3 && !checked); }, [seq, checked, onReady]);
  const locked = isReview || checked;
  const tap = (id) => { if (locked || seq.includes(id)) return; setSeq((s) => [...s, id]); };
  const check = useCallback(() => {
    const ns = seq.map((id) => D06_ITEMS.find((x) => x.id === id).n);
    const correct = ns[0] < ns[1] && ns[1] < ns[2];
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { seq }, correctAnswer: { seq: ['b', 'a', 'c'] }, correct, meta: { tag: 'order_decimals', level: '🟡' } });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '12px 0' }}>
        {D06_ITEMS.map((it) => {
          const order = seq.indexOf(it.id);
          const on = order >= 0;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; }
          if (checked && on) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={it.id} type="button" disabled={locked || on} onClick={() => tap(it.id)} style={{ position: 'relative', width: 88, height: 72, borderRadius: 16, border: '2px solid ' + bd, background: bg, cursor: (locked || on) ? 'default' : 'pointer', ...S.mono, fontSize: 28, fontWeight: 800, color: col }}>
              {it.v}
              {on && <span style={{ position: 'absolute', top: -10, left: -10, width: 26, height: 26, borderRadius: '50%', background: '#fe5b1a', color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>{order + 1}</span>}
            </button>
          );
        })}
      </div>
      {!checked && seq.length > 0 && !isReview && (
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={() => setSeq([])} style={{ padding: '6px 14px', borderRadius: 999, border: '1.5px solid #d6dae3', background: '#fff', color: '#64748b', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t.reset}</button>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
