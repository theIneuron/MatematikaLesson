// Dars14 · Amaliyot 05 — Moslash · 🟡 · match_size (kasr ↔ tavsif)
// 3/4, 2/3, 5/6 ni "eng katta / o'rtacha / eng kichik" ga moslash.
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
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_PAIRS = { '5/6': 'big', '3/4': 'mid', '2/3': 'small' }; // to'g'ri moslik
const D05_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Sabina uch kasrni tartibga solmoqchi: 3/4, 2/3, 5/6.",
    ask: "Har bir kasrni to'g'ri tavsifga ulang:",
    big: 'Eng KATTA', mid: "O'RTAcha", small: 'Eng KICHIK', pick: 'Kasrni tanlang, keyin tavsifni bosing.',
    correct: "To'g'ri. 12 ulushga keltirsak: 2/3=8/12, 3/4=9/12, 5/6=10/12. Demak 5/6 > 3/4 > 2/3.",
    wrong: "Maslahat: uch kasrni bir xil ulushga keltirgach nimani solishtirasiz? Katta surat qaysi kasrni bildiradi?",
    rule: "Bir xil ulushga keltirib, suratlarni solishtiring: katta surat — katta kasr.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Сабина хочет упорядочить три дроби: 3/4, 2/3, 5/6.',
    ask: 'Соедините каждую дробь с верным описанием:',
    big: 'Самая БОЛЬШАЯ', mid: 'СРЕДНЯЯ', small: 'Самая МАЛЕНЬКАЯ', pick: 'Выберите дробь, затем нажмите описание.',
    correct: 'Верно. Приведём к 12 долям: 2/3=8/12, 3/4=9/12, 5/6=10/12. Значит 5/6 > 3/4 > 2/3.',
    wrong: 'Подсказка: после приведения к одинаковым долям что сравниваешь? Какую дробь означает больший числитель?',
    rule: 'Приведи к одинаковым долям и сравни числители: больше числитель — больше дробь.',
  },
};
export default function D14_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const fracs = ['3/4', '2/3', '5/6'];
  const slots = [{ k: 'big', label: t.big }, { k: 'mid', label: t.mid }, { k: 'small', label: t.small }];
  const [pickFrac, setPickFrac] = useState(null);
  const [map, setMap] = useState({}); // slotKey -> frac
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedFracs = new Set(Object.values(map));
  const full = Object.keys(map).length === 3;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickSlot = (k) => {
    if (locked) return;
    if (map[k]) { setMap((m) => { const n = { ...m }; delete n[k]; return n; }); return; }
    if (pickFrac) { setMap((m) => ({ ...m, [k]: pickFrac })); setPickFrac(null); }
  };
  const check = useCallback(() => {
    const correct = slots.every((s) => map[s.k] && D05_PAIRS[map[s.k]] === s.k);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: { big: '5/6', mid: '3/4', small: '2/3' }, correct, meta: { tag: 'match_size', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      {/* kasr kartalari */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '10px 0 14px' }}>
        {fracs.map((f) => {
          const used = usedFracs.has(f);
          const on = pickFrac === f;
          return <button key={f} type="button" disabled={locked || used} onClick={() => setPickFrac(on ? null : f)} style={{ ...S.mono, fontSize: 20, fontWeight: 800, width: 70, height: 54, borderRadius: 12, border: '2px solid ' + (on ? '#7c3aed' : used ? '#e5e7eb' : '#cbd5e1'), background: used ? '#fafafa' : (on ? '#f5f0ff' : '#fff'), color: used ? '#cbd5e1' : '#1f2430', cursor: (locked || used) ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #ede9fe' : 'none' }}>{f}</button>;
        })}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{t.pick}</div>
      {/* tavsif slotlari */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slots.map((s) => {
          const f = map[s.k];
          let bd = '#d6dae3', bg = '#fff';
          if (f) { bd = '#7c3aed'; bg = '#faf5ff'; }
          if (checked && f) { const allOk = fb?.correct; bd = allOk ? '#1a7f43' : '#c0392b'; bg = allOk ? '#e8f7ee' : '#fdecec'; }
          return (
            <div key={s.k} onClick={() => clickSlot(s.k)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', minHeight: 50 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#374151' }}>{s.label}</span>
              <span style={{ ...S.mono, fontSize: 19, fontWeight: 800, color: f ? '#7c3aed' : '#cbd5e1' }}>{f || '?'}</span>
            </div>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
