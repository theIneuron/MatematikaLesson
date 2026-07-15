// Dars12 · Amaliyot 08 — Qaysi qadam noto'g'ri · 🟡 · Farrux · tag: find_error (2 ta xato)
// Ikki xato qadam: «necha marta» chalkashligi (2-qadam) va butundan katta kasr (4-qadam).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- SHARED ---------- */
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const Bar = ({ n, k, color = '#2563eb', height = 40, onCell = null, disabled = false }) => (
  <div style={{ display: 'flex', width: '100%', border: '2px solid #1f2430', borderRadius: 8, overflow: 'hidden', height, background: '#fff' }}>
    {Array.from({ length: n }).map((_, i) => {
      const on = i < k;
      const base = {
        flex: 1, minWidth: 0, padding: 0, border: 'none',
        background: on ? color : '#fff',
        boxShadow: i < n - 1 ? 'inset -1.5px 0 0 0 #1f2430' : 'none',
        transition: 'background .18s',
      };
      if (!onCell) return <div key={i} style={base} />;
      return (
        <button key={i} type="button" disabled={disabled} aria-label={String(i + 1)} onClick={() => onCell(i)}
          style={{ ...base, minHeight: 44, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!on && !disabled && <span style={{ width: 5, height: 5, borderRadius: 999, background: '#cbd2dc' }} />}
        </button>
      );
    })}
  </div>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #2563eb; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pq-tag { font-size: 13px; font-weight: 700; color: #6b7280; min-width: 54px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;
/* ---------- /SHARED ---------- */

const D12_08_DATA = { wrong: [1, 3], tag: 'find_error', level: '🟡' };
const D12_08_T = {
  uz: {
    eyebrow: 'Tahlil', title: "Qaysi qadam noto'g'ri",
    setup: "Farrux 4/7 va 6/7 ni taqqosladi va shunday fikr yuritdi.",
    steps: [
      "Maxrajlar bir xil: 7 va 7. Demak har bir bo'lak bir xil kattalikda.",
      "6 dan 4 ni ayirsak 2 chiqadi. Demak 6/7, 4/7 dan 2 marta katta.",
      "4/7 dan 6/7 gacha yana 2 ta bo'lak qo'shiladi.",
      "Maxraji 7 bo'lgan eng katta kasr — 7/7. Undan katta kasr yo'q.",
    ],
    ask: "Qaysi qadam noto'g'ri? Ikkita qadam noto'g'ri — ikkalasini ham tanlang.",
    correct: "To'g'ri. 2-qadam: 2 ta bo'lakka ko'p — bu 2 marta katta degani emas. 4-qadam: 8/7 ham bor, u butundan katta.",
    wrongPartial: "Maslahat: bittasini topdingiz, lekin yana bittasi qoldi. Har bir qadamni alohida tekshiring.",
    wrongMsg: "Maslahat: bitta qadamda «ko'p» va «necha marta» chalkashtirilgan. Boshqasida esa kasr butundan katta bo'lishi mumkinligi unutilgan.",
  },
  ru: {
    eyebrow: 'Разбор', title: 'Какой шаг неверный',
    setup: 'Фаррух сравнил 4/7 и 6/7 и рассуждал так.',
    steps: [
      'Знаменатели одинаковые: 7 и 7. Значит каждая доля одного размера.',
      'Из 6 вычесть 4 будет 2. Значит 6/7 больше 4/7 в 2 раза.',
      'От 4/7 до 6/7 добавляется ещё 2 доли.',
      'Самая большая дробь со знаменателем 7 — это 7/7. Больше неё дробей нет.',
    ],
    ask: 'Какой шаг неверный? Неверных шага два — отметьте оба.',
    correct: 'Верно. Шаг 2: на 2 доли больше — это не «в 2 раза больше». Шаг 4: есть и 8/7, она больше целого.',
    wrongPartial: 'Подсказка: один нашли, остался ещё один. Проверьте каждый шаг отдельно.',
    wrongMsg: 'Подсказка: в одном шаге спутаны «больше на» и «больше во сколько раз». В другом забыто, что дробь может быть больше целого.',
  },
};

export default function D12_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D12_08_T[lang] || D12_08_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx) {
      setSel(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(sel.length > 0 && !checked); }, [sel, checked, onReady]);

  const toggle = (i) => setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const check = useCallback(() => {
    const want = D12_08_DATA.wrong;
    const got = sel.slice().sort();
    const correct = got.length === want.length && got.every((v, i) => v === want[i]);
    const partial = !correct && got.length > 0 && got.every((v) => want.includes(v));
    setFb({ correct, partial }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: got, label: got.map((i) => i + 1).join(', ') },
      correctAnswer: { idx: want, label: '2, 4' },
      correct, meta: { tag: D12_08_DATA.tag, level: D12_08_DATA.level, partial: partial ? 'one_of_two' : null },
    });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const stepStyle = (i) => {
    const on = sel.includes(i);
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (checked) {
      if (on) { const good = fb?.correct; bg = good ? '#e8f7ee' : '#fdecec'; bd = good ? '#1a7f43' : '#c0392b'; col = good ? '#1a7f43' : '#c0392b'; }
      else { bg = '#fff'; bd = '#e5e7eb'; col = '#9aa1ad'; }
    }
    return { display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%', textAlign: 'left', padding: '14px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, lineHeight: 1.42, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 52 };
  };

  const fbText = !fb ? '' : fb.correct ? t.correct : fb.partial ? t.wrongPartial : t.wrongMsg;

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <div className="pq-row"><Frac a={4} b={7} size={14} /><Bar n={7} k={4} height={26} /></div>
      <div className="pq-row"><Frac a={6} b={7} size={14} /><Bar n={7} k={6} height={26} color="#7c3aed" /></div>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ margin: '4px 0 10px' }}>
        {t.steps.map((st, i) => (
          <button key={i} type="button" style={stepStyle(i)} disabled={isReview || checked} onClick={() => toggle(i)}>
            <span style={{ minWidth: 26, height: 26, borderRadius: 8, background: sel.includes(i) && !checked ? '#2563eb' : '#eef1f6', color: sel.includes(i) && !checked ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{i + 1}</span>
            <span>{st}</span>
          </button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fbText} />}
    </div>
  );
}
