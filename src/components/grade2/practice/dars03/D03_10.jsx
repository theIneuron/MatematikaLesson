// Dars 3 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d03-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d03-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_CODES = [54, 27, 45, 40];
const D10_SORTED = [27, 40, 45, 54];
const D10_T = {
  uz: {
    eyebrow: 'Tartiblash', setup: 'Kodlar aralashib ketdi.',
    ask: 'Kodlarni KICHIGIDAN kattasiga qarab, ketma-ket bosing.',
    correct: "To'g'ri. 27 < 40 < 45 < 54. Avval o'nlikka, keyin birlikka qaraymiz.",
    wrong: "Maslahat: avval o'nlikni solishtiring. 27 (2 o'nlik) eng kichik, 54 (5 o'nlik) eng katta.",
    rule: "Tartiblashda avval o'nlik, teng bo'lsa birlik solishtiriladi.",
  },
  ru: {
    eyebrow: 'Упорядочи', setup: 'Коды перемешались.',
    ask: 'Нажимай коды по порядку от МЕНЬШЕГО к большему.',
    correct: 'Верно. 27 < 40 < 45 < 54. Сначала десятки, потом единицы.',
    wrong: 'Подсказка: сначала сравни десятки. 27 (2 дес.) — меньший, 54 (5 дес.) — больший.',
    rule: 'При упорядочивании сначала десятки, при равенстве — единицы.',
  },
};
function D03_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [seq, setSeq] = useState([]); // indices into D10_CODES in tapped order
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.seq) { setSeq(sa.seq); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = seq.length === D10_CODES.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const tap = (i) => { if (locked || seq.includes(i)) return; setSeq((s) => [...s, i]); };
  const undo = () => { if (locked) return; setSeq((s) => s.slice(0, -1)); };
  const check = useCallback(() => {
    const vals = seq.map((i) => D10_CODES[i]);
    const correct = vals.every((v, k) => v === D10_SORTED[k]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { seq, vals }, correctAnswer: { order: D10_SORTED }, correct, meta: { tag: 'ordering', level: '🔴' } });
  }, [seq, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, textAlign: 'center', marginBottom: 6, letterSpacing: '.06em' }}>{lang === 'uz' ? 'KICHIK → KATTA' : 'МЕНЬШЕ → БОЛЬШЕ'}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 56, alignItems: 'center' }}>
          {D10_SORTED.map((_, k) => {
            const idx = seq[k];
            const v = idx != null ? D10_CODES[idx] : null;
            let bd = C.stageBd, col = C.sink2;
            if (v != null) { bd = C.acc; col = C.sink; }
            if (checked && v != null) { const ok = v === D10_SORTED[k]; bd = ok ? C.ok : C.no; col = ok ? '#8ff0bd' : '#ffb4a8'; }
            return <span key={k} style={{ width: 60, height: 52, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: C.stile, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 24, fontWeight: 800, color: col }}>{v != null ? v : k + 1}</span>;
          })}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D10_CODES.map((n, i) => {
          const used = seq.includes(i);
          return <button key={i} type="button" disabled={locked || used} onClick={() => tap(i)} style={{ width: 66, height: 56, borderRadius: 12, border: '2px solid ' + (used ? C.line : C.acc), background: used ? '#f2f2f2' : C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: used ? C.ink3 : C.ink, cursor: (locked || used) ? 'default' : 'pointer' }}>{n}</button>;
        })}
      </div>
      {seq.length > 0 && !locked && <div style={{ textAlign: 'center', marginTop: 10 }}><button type="button" onClick={undo} style={{ padding: '8px 16px', borderRadius: 10, border: '1.5px solid ' + C.line, background: C.paper, color: '#374151', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>↩ {lang === 'uz' ? 'Orqaga' : 'Назад'}</button></div>}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_10(props) {
  return (<><style>{FX_CSS}</style><D03_10Impl {...props} /></>);
}
