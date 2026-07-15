// Dars16 · Amaliyot 10 — Qaysi ikki kasr teng · 🔴 · tag: which_two_equal
// 6/8, 9/12, 2/3, 3/5 dan → 6/8 va 9/12 ikkalasi 3/4 ga qisqaradi = teng.
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
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const FracStr = ({ s, size = 22, color }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} color={color} />; };

// 6/8, 9/12, 2/3, 3/5 dan → 6/8 va 9/12 ikkalasi 3/4 ga qisqaradi = teng.
const D10_ITEMS = ['2/3', '6/8', '3/5', '9/12'];
const D10_CORRECT = new Set(['6/8', '9/12']); // ikkalasi 3/4
const D10_T = {
  uz: {
    eyebrow: 'Teng juftni top', setup: "Aziza dugonalari bilan o'yin o'ynadi: har biri kartochkaga bitta kasr yozadi. Bir-biriga teng kasr yozgan ishtirokchilar o'yindan chiqadi.",
    ask: "Kartochkalardagi sonlar quyidagicha. Bir-biriga teng bo'lgan kasrlarni toping (ikkalasini bosing):",
    correct: "To'g'ri. 6/8 = 3/4 va 9/12 = 3/4. Ikkalasi bir xil sodda shaklga qisqaradi — demak teng.",
    wrong: "Maslahat: ikki kasr qachon teng bo'ladi? Ularning eng sodda ko'rinishi haqida o'yla — qaysi ikkitasi bir xil bo'lib chiqadi?",
    rule: "Ikki kasr teng, agar ular bir xil sodda shaklga qisqarsa.",
  },
  ru: {
    eyebrow: 'Найди равную пару', setup: 'Азиза играла с подругами: каждая пишет на карточке одну дробь. Участницы с равными дробями выбывают из игры.',
    ask: 'Числа на карточках такие. Найдите равные дроби (нажмите обе):',
    correct: 'Верно. 6/8 = 3/4 и 9/12 = 3/4. Обе сокращаются к одному виду — значит равны.',
    wrong: 'Подсказка: когда две дроби равны? Подумай об их простейшем виде — какие две окажутся одинаковыми?',
    rule: 'Две дроби равны, если сокращаются к одному простому виду.',
  },
};
export default function D16_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length === 2 && !checked); }, [sel, checked, onReady]);
  const locked = isReview || checked;
  const toggle = (f) => { if (locked) return; setSel((s) => s.includes(f) ? s.filter((x) => x !== f) : (s.length < 2 ? [...s, f] : s)); };
  const check = useCallback(() => {
    const correct = sel.length === 2 && sel.every((f) => D10_CORRECT.has(f));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel }, correctAnswer: { pair: ['6/8', '9/12'] }, correct, meta: { tag: 'which_two_equal', level: '🔴' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
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
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', margin: '12px 0' }}>
        {D10_ITEMS.map((f) => {
          const on = sel.includes(f);
          let bd = '#cbd5e1', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#2563eb'; bg = '#eff6ff'; col = '#1e40af'; }
          // qisman to'g'ri ham xato hisoblanadi: tanlanganlar javob to'liq to'g'ri bo'lsagina yashil
          if (checked && on) { const ok = !!fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={f} type="button" disabled={locked} onClick={() => toggle(f)} style={{ width: 92, height: 66, borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}><FracStr s={f} size={22} color={col} /></button>;
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', fontWeight: 700 }}>{sel.length}/2 {lang === 'uz' ? 'tanlandi' : 'выбрано'}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
