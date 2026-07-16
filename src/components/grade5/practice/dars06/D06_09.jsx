// Dars06 · Amaliyot 09 — Oraliqdagi sonlar · 🔴 · between_count (interaktiv sanash)
// -4 va 3 orasida nechta butun son. Bola o'qdagi oraliq sonlarni bosib belgilaydi.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_LO = -6, D09_HI = 5, D09_A = -4, D09_B = 3;
const D09_BETWEEN = [-3, -2, -1, 0, 1, 2]; // -4 va 3 orasida (o'zlari kirmaydi), nol ham kiradi
const D09_T = {
  uz: {
    eyebrow: 'Oraliq', setup: "-4 va 3 son o'qida berilgan. Ular orasidagi barcha butun sonlarni belgilang (chegaralarni hisobga olmang).",
    ask: 'Oraliqdagi butun sonlarni bosib belgilang, keyin tekshiring:',
    correct: "To'g'ri. -4 va 3 orasida: -3, -2, -1, 0, 1, 2 — jami 6 ta son. Nol ham oraliqda.",
    wrong: "Maslahat: ikki chegara orasidagi har bir butun sonni ko'z oldingizga keltiring. Nol ham shu oraliqqa tushadimi?",
  },
  ru: {
    eyebrow: 'Промежуток', setup: '-4 и 3 даны на оси. Отметьте все целые числа между ними (границы не считаются).',
    ask: 'Отметьте целые числа промежутка, затем проверьте:',
    correct: 'Верно. Между -4 и 3: -3, -2, -1, 0, 1, 2 — всего 6 чисел. Ноль тоже входит.',
    wrong: 'Подсказка: представьте каждое целое число между двумя границами. А ноль тоже попадает в этот промежуток?',
  },
};
export default function D06_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(new Set());
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel) { setSel(new Set(sa.sel)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.size > 0 && !checked); }, [sel, checked, onReady]);
  const locked = isReview || checked;
  const nums = [];
  for (let v = D09_LO; v <= D09_HI; v++) nums.push(v);
  const target = new Set(D09_BETWEEN);
  // to'liq to'g'ri bo'lsagina yashil; qisman to'g'ri bo'lsa belgilangan HAMMA nuqta qizil
  const correctOverall = sel.size === target.size && [...sel].every((v) => target.has(v));
  const toggle = (v) => { if (locked || v === D09_A || v === D09_B) return; setSel((s) => { const n = new Set(s); n.has(v) ? n.delete(v) : n.add(v); return n; }); };
  const check = useCallback(() => {
    const correct = sel.size === target.size && [...sel].every((v) => target.has(v));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel: [...sel] }, correctAnswer: { sel: D09_BETWEEN }, correct, meta: { tag: 'between_count', level: '🔴' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 100 / (nums.length - 1);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ position: 'relative', height: 96, margin: '18px 6px 8px' }}>
        <div style={{ position: 'absolute', left: '3%', right: '3%', top: 44, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
        {nums.map((v, i) => {
          const isEnd = v === D09_A || v === D09_B;
          const on = sel.has(v);
          let dotBg = '#cbd5e1';
          if (isEnd) dotBg = '#94a3b8';
          if (on) dotBg = '#fe5b1a';
          if (checked && on) dotBg = correctOverall ? '#1a7f43' : '#c0392b';
          return (
            <div key={v} onClick={() => toggle(v)} style={{ position: 'absolute', left: `calc(3% + ${i * W * 0.94}%)`, top: 30, transform: 'translateX(-50%)', textAlign: 'center', cursor: (locked || isEnd) ? 'default' : 'pointer' }}>
              <div style={{ width: on || (isEnd) ? 18 : 13, height: on || (isEnd) ? 18 : 13, borderRadius: 999, background: dotBg, margin: '0 auto', transition: 'all .2s', border: isEnd ? '3px solid #1f2430' : 'none' }} />
              <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: 800, color: isEnd ? '#1f2430' : (on ? '#b83d0e' : '#94a3b8'), ...S.mono }}>{v}</div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{lang === 'uz' ? 'Qora halqali sonlar — chegaralar (sanalmaydi)' : 'Числа в чёрном кольце — границы (не считаются)'}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
