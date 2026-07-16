// Dars13 · Amaliyot 05 — Bo'laklarni juftlash · 🟡 · match_piece (interaktiv)
// Uch bola bir xil nondan bittadan bo'lak oldi. Bo'laklar uzunligi ko'rsatilgan,
// lekin aralashtirilgan. Kasr chipini bosing, keyin mos bo'lakning katagini bosing.
// Mexanika: juftlash (tap -> tap). Surgich ham, sudrash ham emas.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
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
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #fe5b1a; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_05_PIECES = [
  { id: 'A', den: 5 },
  { id: 'B', den: 3 },
  { id: 'C', den: 8 },
];
const D13_05_CHIPS = [3, 8, 5]; // aralash tartib
const D13_05_DATA = { tag: 'match_piece', level: '🟡' };
const D13_05_T = {
  uz: {
    eyebrow: 'Juftlash',
    setup: "Nodira, Daler va Malika bir xil uzunlikdagi nondan bittadan bo'lak oldi. Bo'laklar rasmda, lekin qaysi biri kimniki ekani yozilmagan.",
    ask: "Kasrni bosing, keyin unga mos bo'lakni bosing.",
    chips: 'Kasrlar',
    correct: "To'g'ri. Maxraj qancha katta bo'lsa, bo'lak shuncha kalta. Eng uzun bo'lak — 1/3, eng kaltasi — 1/8.",
    wrongMsg: "Maslahat: nonning uzunligi hamma joyda bir xil. Maxraj katta bo'lsa, non ko'proq bo'lakka bo'lingan — demak bo'lak kalta.",
    hint: "Qo'yilgan kasrni bosib qaytarib olish mumkin.",
  },
  ru: {
    eyebrow: 'Соединение',
    setup: 'Нодира, Далер и Малика взяли по одному куску от одинаковых хлебов. Куски на рисунке, но не подписано, чей какой.',
    ask: 'Нажмите на дробь, затем на подходящий кусок.',
    chips: 'Дроби',
    correct: 'Верно. Чем больше знаменатель, тем короче кусок. Самый длинный кусок — 1/3, самый короткий — 1/8.',
    wrongMsg: 'Подсказка: длина хлеба везде одинаковая. Больше знаменатель — хлеб разделён на больше частей, значит кусок короче.',
    hint: 'Поставленную дробь можно вернуть нажатием.',
  },
};

export default function D13_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_05_T[lang] || D13_05_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState({ A: null, B: null, C: null });
  const [pool, setPool] = useState(D13_05_CHIPS);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.slots) {
      setSlots(sa.slots); setPool([]);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);

  const full = D13_05_PIECES.every((p) => slots[p.id] != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;

  const clickSlot = (id) => () => {
    if (locked) return;
    if (picked != null) {
      const occ = slots[id];
      setSlots((s) => ({ ...s, [id]: picked }));
      setPool((p) => (occ != null ? [...p.filter((x) => x !== picked), occ] : p.filter((x) => x !== picked)));
      setPicked(null);
    } else if (slots[id] != null) {
      const v = slots[id];
      setSlots((s) => ({ ...s, [id]: null }));
      setPool((p) => [...p, v]);
    }
  };

  const check = useCallback(() => {
    const correct = D13_05_PIECES.every((p) => slots[p.id] === p.den);
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask,
      options: D13_05_CHIPS.map((d) => ({ id: String(d), label: '1/' + d })),
      studentAnswer: { slots, label: D13_05_PIECES.map((p) => p.id + '=1/' + slots[p.id]).join(' ') },
      correctAnswer: { slots: { A: 5, B: 3, C: 8 }, label: 'A=1/5 B=1/3 C=1/8' },
      correct, meta: { tag: D13_05_DATA.tag, level: D13_05_DATA.level },
    });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const chipStyle = (d) => ({
    width: 58, height: 70, borderRadius: 13, border: '2px solid ' + (picked === d ? '#fe5b1a' : '#cbd5e1'),
    background: picked === d ? '#fff0e8' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit',
    boxShadow: picked === d ? '0 0 0 4px #ffe7d8' : 'none', transition: 'box-shadow .15s, border-color .15s',
  });

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>

      <div style={{ margin: '14px 0 6px' }}>
        {(() => { const correctAll = D13_05_PIECES.every((p) => slots[p.id] === p.den); return D13_05_PIECES.map((p) => {
          const v = slots[p.id];
          let bd = '#cbd5e1', bg = '#f8fafc';
          // Qisman to'g'ri = hammasi qizil: faqat to'liq to'g'ri bo'lsa yashil.
          if (checked && v != null) { const ok = correctAll; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#9aa1ad', minWidth: 16 }}>{p.id}</span>
              <div style={{ flex: 1, height: 34, position: 'relative', background: '#f1f5f9', borderRadius: 7, border: '1.5px dashed #e2e8f0' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (100 / p.den) + '%', background: '#7c3aed', borderRadius: '6px 3px 3px 6px', border: '2px solid #1f2430' }} />
              </div>
              <div onClick={clickSlot(p.id)}
                style={{ width: 62, height: 74, borderRadius: 14, border: '2px dashed ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', flex: '0 0 auto' }}>
                {v != null && <Frac a={1} b={v} size={19} />}
              </div>
            </div>
          );
        }); })()}
      </div>

      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.chips.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', minHeight: 74, alignItems: 'center' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {pool.map((d) => (
            <button key={d} type="button" disabled={locked} onClick={() => setPicked(picked === d ? null : d)} style={chipStyle(d)}>
              <Frac a={1} b={d} size={19} />
            </button>
          ))}
        </div>
      </div>

      <p className="pq-ask" style={{ fontSize: 14.5, fontWeight: 600, color: '#6b7280', marginTop: 10 }}>{t.ask}</p>
      <div style={{ fontSize: 12.5, color: '#9aa1ad', fontWeight: 600 }}>{t.hint}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
