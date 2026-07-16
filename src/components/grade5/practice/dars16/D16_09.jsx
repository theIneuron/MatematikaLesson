// Dars16 · Amaliyot 09 — Eng katta bo'luvchi (usul B) · 🔴 · tag: reduce_gcd
// 12/16 = ?/? bir zarbda ÷4. Bola surat va maxraj yozadi.
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
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

// 12/16 = ?/? bir zarbda ÷4. Bola surat va maxraj yozadi.
const D09_A = 3, D09_B = 4;
const D09_T = {
  uz: {
    eyebrow: 'Bir zarbda', setup: "Matematika ustozi Sabinaga kasrni bir amalda oxirigacha qisqartirishni topshirdi. Sabinaga 12/16 ni oxirigacha qisqartirishga yordam bering.",
    ask: 'Bir amalda oxirigacha qisqartiring: 12/16 = ?/?', label: 'Surat va maxrajni yozing:',
    correct: "To'g'ri. 12:4 = 3, 16:4 = 4. Demak 12/16 = 3/4 — bir amalda oxirigacha qisqardi.",
    wrong: "Maslahat: kichik songa bo'lsangiz, keyin yana qisqartirish qoladi. Bir amalda tugashi uchun 12 va 16 ni bog'laydigan qanday son kerak — eng kattasimi yoki kichigi?",
    rule: "Eng katta umumiy bo'luvchiga bo'lsangiz, bir amalda oxirigacha qisqaradi.",
  },
  ru: {
    eyebrow: 'За один раз', setup: 'Учитель математики дал Сабине задание сократить дробь до конца за одно действие. Помоги Сабине сократить 12/16 до конца.',
    ask: 'Сократи до конца за одно действие: 12/16 = ?/?', label: 'Впишите числитель и знаменатель:',
    correct: 'Верно. 12:4 = 3, 16:4 = 4. Значит 12/16 = 3/4 — сократили до конца за раз.',
    wrong: 'Подсказка: если делить на маленькое число, останется что сокращать ещё. Чтобы закончить за раз, какое общее число нужно для 12 и 16 — самое большое или поменьше?',
    rule: 'Разделив на наибольший общий делитель, сокращаешь до конца за один раз.',
  },
};
export default function D16_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShow(!!initialAnswer.correct); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D09_A && parseInt(b, 10) === D09_B;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShow(true), 700);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: { a: 3, b: 4 }, correct, meta: { tag: 'reduce_gcd', level: '🔴' } });
  }, [a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // all-or-nothing: to'liq to'g'ri bo'lmasa ikkala katak ham qizil (per-katak yashil emas)
  const bd = (v, ok) => checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  const cell = (val, set, ok) => (
    <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 56, height: 42, textAlign: 'center', fontSize: 23, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd(parseInt(val, 10), ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '16px 0 6px' }}>
        <Frac num="12" den="16" size={36} color="#7c3aed" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {cell(a, setA, D09_A)}
          <div style={{ width: 62, height: 3, background: '#1f2430' }} />
          {cell(b, setB, D09_B)}
        </div>
      </div>
      <div style={{ height: show ? 28 : 0, opacity: show ? 1 : 0, overflow: 'hidden', transition: 'height .5s ease, opacity .5s ease', display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center' }}>
        {show && <span className="d16-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#7c3aed', background: '#faf5ff', padding: '4px 10px', borderRadius: 9 }}>12 : 4 = 3</span>}
        {show && <span className="d16-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#7c3aed', background: '#faf5ff', padding: '4px 10px', borderRadius: 9 }}>16 : 4 = 4</span>}
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '6px 0 4px', textAlign: 'center' }}>{t.label}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
