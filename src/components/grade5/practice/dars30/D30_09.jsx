// Dars30 · Amaliyot 09 — O'sish tartibida · 🔴 · tag: pct_order_mixed
// Aralash yozuv: 25% · 1/2 · 0,25 · 60% ni kichikdan kattaga. 0,25 = 25% (teng).
// Tap-order plitkalar. Eyebrow pill: cyan. Kontrakt: onReady/registerCheck/onSubmit. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#0e7490', l: '#ecfeff', m: '#a5f3fc', fill: '#22d3ee' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.d, background: C.l, border: '1px solid ' + C.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 15, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 2px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 1.6, background: color }} />
    <span style={{ fontSize: size, padding: '1px 2px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// id · ko'rinishi · foizdagi qiymati (n)
const D09_ITEMS = [{ id: 'a', kind: 'pct', v: '25%', n: 25 }, { id: 'b', kind: 'frac', num: '1', den: '2', n: 50 }, { id: 'c', kind: 'dec', v: '0,25', n: 25 }, { id: 'd', kind: 'pct', v: '60%', n: 60 }];
const D09_SORTED = [{ kind: 'dec', v: '0,25' }, { kind: 'pct', v: '25%' }, { kind: 'frac', num: '1', den: '2' }, { kind: 'pct', v: '60%' }];
const D09_T = {
  uz: {
    eyebrow: 'Tartibla', setup: "Temur to'rt yozuvni kichikdan kattaga terib chiqmoqchi. Eng kichigidan boshlab bosing.",
    ask: 'Kichikdan kattaga bosing (0,25 va 25% teng):', reset: 'Boshidan',
    correct: "To'g'ri. 0,25 = 25% < 1/2 (50%) < 60%.",
    wrong: "Turli ko'rinishdagi (kasr, o'nli, foiz) sonlarni solishtirish uchun ularni qaysi bitta ko'rinishga keltirish qulay?",
    rule: "Solishtirishdan oldin bir ko'rinishga (foizga) keltiring.",
  },
  ru: {
    eyebrow: 'Упорядочи', setup: 'Темур хочет расставить четыре записи от меньшего к большему. Нажимай, начиная с самого маленького.',
    ask: 'Нажимай от меньшего к большему (0,25 и 25% равны):', reset: 'Сначала',
    correct: 'Верно. 0,25 = 25% < 1/2 (50%) < 60%.',
    wrong: 'К какому одному виду удобно привести дроби, десятичные и проценты, чтобы их сравнить?',
    rule: 'Перед сравнением приведи к одному виду (к процентам).',
  },
};

export default function D30_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [seq, setSeq] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.seq) { setSeq(sa.seq); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(seq.length === 4 && !checked); }, [seq, checked, onReady]);
  const locked = isReview || checked;
  const tap = (id) => { if (locked || seq.includes(id)) return; setSeq((s) => [...s, id]); };
  const check = useCallback(() => {
    const ns = seq.map((id) => D09_ITEMS.find((x) => x.id === id).n);
    const correct = ns.every((v, i) => i === 0 || ns[i - 1] <= v);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { seq }, correctAnswer: { rule: 'non-decreasing by percent' }, correct, meta: { tag: 'pct_order_mixed', level: '🔴' } });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const view = (it, col, size = 24) => it.kind === 'frac' ? <Frac num={it.num} den={it.den} size={size} color={col} /> : <span style={{ ...S.mono, fontSize: size, fontWeight: 800, color: col }}>{it.v}</span>;
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '12px 0' }}>
        {D09_ITEMS.map((it) => {
          const order = seq.indexOf(it.id);
          const on = order >= 0;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = C.d; bg = C.l; }
          if (checked && on) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={it.id} type="button" disabled={locked || on} onClick={() => tap(it.id)} style={{ position: 'relative', width: 82, height: 72, borderRadius: 16, border: '2px solid ' + bd, background: bg, cursor: (locked || on) ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {view(it, col)}
              {on && <span style={{ position: 'absolute', top: -10, left: -10, width: 26, height: 26, borderRadius: '50%', background: C.d, color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>{order + 1}</span>}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '2px 0 6px', padding: '10px 12px', borderRadius: 12, background: C.l, border: '1.5px solid ' + C.m }}>
          {D09_SORTED.map((it, i) => (
            <React.Fragment key={i}>
              {view(it, C.d, 18)}
              {i < D09_SORTED.length - 1 && <span style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: '#94a3b8' }}>{i === 0 ? '=' : '<'}</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      {!checked && seq.length > 0 && !isReview && (
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={() => setSeq([])} style={{ padding: '6px 14px', borderRadius: 999, border: '1.5px solid #d6dae3', background: '#fff', color: '#64748b', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t.reset}</button>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
