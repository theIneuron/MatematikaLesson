// Dars 7 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c', boxBd: '#8ba0c8',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

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
  <div className="d07-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d07-pop { animation: d07pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d07pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d07-star { opacity: .35; animation: d07tw 3.2s ease-in-out infinite; }
        @keyframes d07tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_ROWS = [{ expr: '34 + 25', val: 59 }, { expr: '41 + 16', val: 57 }, { expr: '23 + 52', val: 75 }, { expr: '60 + 30', val: 90 }];
const D10_CARDS = [59, 57, 75, 90, 95, 65];
const D10_T = {
  uz: {
    eyebrow: 'Moslash', setup: 'Har stolbik misolni o‘z javobiga ulang.',
    ask: 'Javob kartasini bosing, keyin mos misolning bo‘sh joyini bosing:',
    correct: "To'g'ri. 34+25=59, 41+16=57, 23+52=75, 60+30=90.",
    wrong: "Maslahat: har misolni ustunlab qo‘shing — birlik + birlik, o‘nlik + o‘nlik.",
    rule: "Stolbik: birliklar va o‘nliklar alohida qo‘shiladi.",
  },
  ru: {
    eyebrow: 'Соответствие', setup: 'Соедини каждый пример-столбик с его ответом.',
    ask: 'Нажми карточку ответа, затем пустое место нужного примера:',
    correct: 'Верно. 34+25=59, 41+16=57, 23+52=75, 60+30=90.',
    wrong: 'Подсказка: складывай каждый пример столбиком — единицы + единицы, десятки + десятки.',
    rule: 'Столбик: единицы и десятки складывают отдельно.',
  },
};
function D07_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const clickSlot = (i) => () => { if (locked) return; if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D10_CARDS[pick], ci: pick }; return n; }); setPick(null); } else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); } };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D10_ROWS[i].val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: D10_ROWS.map((r) => r.val) }, correct, meta: { tag: 'matchsum', level: '🔴' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cols = ['#c2410c', '#017CA3', '#1F7A4D', '#B45309'];
  const bgs = [C.accSoft, '#E6F4FA', '#EAF7EF', '#FFF6E9'];
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', margin: '8px 0 14px', justifyItems: 'center' }}>
        {D10_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = cols[i], bg = bgs[i], col = cols[i];
          if (checked && v != null) { const ok = v === r.val; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <div style={{ width: 92, textAlign: 'right', ...S.mono, fontSize: 18, fontWeight: 800, color: cols[i] }}>{r.expr}</div>
              <span style={{ color: C.ink3, fontWeight: 800 }}>=</span>
              <div onClick={clickSlot(i)} style={{ width: 58, height: 50, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 21, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D10_CARDS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 58, height: 50, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 58, height: 50, borderRadius: 12, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 20, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_10(props) {
  return (<><style>{FX_CSS}</style><D07_10Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D07_10.audio = {
  uz: { intro: "Har stolbik misolni o'z javobiga ulang. Javob kartasini bosing, keyin mos misolning bo'sh joyini bosing.", on_correct: "To'g'ri. 34 qo'shish 25 teng 59, 41 qo'shish 16 teng 57, 23 qo'shish 52 teng 75, 60 qo'shish 30 teng 90.", on_wrong: "Maslahat. Har misolni ustunlab qo'shing, birlik qo'shish birlik, o'nlik qo'shish o'nlik." },
  ru: { intro: "Соедини каждый пример-столбик с его ответом. Нажми карточку ответа, затем пустое место нужного примера.", on_correct: "Верно. 34 плюс 25 равно 59, 41 плюс 16 равно 57, 23 плюс 52 равно 75, 60 плюс 30 равно 90.", on_wrong: "Подсказка. Складывай каждый пример столбиком, единицы плюс единицы, десятки плюс десятки." },
};
