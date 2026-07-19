// Dars 1 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d01-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d01-pop { animation: d01pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-star { opacity: .35; animation: d01tw 3.2s ease-in-out infinite; }
        @keyframes d01tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d01-drop { animation: d01drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-float { animation: d01float 3s ease-in-out infinite; }
        @keyframes d01float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d01-pulse { animation: d01pulse 1.5s ease-in-out infinite; }
        @keyframes d01pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D07_ROWS = [{ expr: '2 o‘nlik 5 birlik', val: 25 }, { expr: '5 o‘nlik 2 birlik', val: 52 }, { expr: '3 o‘nlik 4 birlik', val: 34 }, { expr: '4 o‘nlik 0 birlik', val: 40 }];
const D07_CARDS = [25, 52, 34, 40, 43, 24];
const D07_T = {
  uz: {
    eyebrow: 'Moslash', setup: "Har razryad tarkibini o'z soniga ulang.",
    ask: 'Kartani bosing, keyin mos yozuvning bo‘sh joyini bosing:',
    correct: "To'g'ri. 2o'nlik5birlik=25, 5o'nlik2birlik=52, 3o'nlik4birlik=34, 4o'nlik0birlik=40.",
    wrong: "Maslahat: o'nlik — birinchi raqam. «5 o'nlik 2 birlik» = 52, 25 emas.",
    rule: "O'nlik birinchi, birlik ikkinchi raqam. O'rin almashsa — boshqa son.",
  },
  ru: {
    eyebrow: 'Соответствие', setup: 'Соедини разрядный состав с его числом.',
    ask: 'Нажми карточку, затем пустое место нужной записи:',
    correct: 'Верно. 2дес5ед=25, 5дес2ед=52, 3дес4ед=34, 4дес0ед=40.',
    wrong: 'Подсказка: десятки — первая цифра. «5 десятков 2 единицы» = 52, не 25.',
    rule: 'Десятки первая, единицы вторая цифра. Поменял местами — другое число.',
  },
};
function D01_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
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
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D07_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D07_ROWS[i].val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: D07_ROWS.map((r) => r.val) }, correct, meta: { tag: 'pv_match', level: '🟡' } });
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
        {D07_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = cols[i], bg = bgs[i], col = cols[i];
          if (checked && v != null) { const ok = v === r.val; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <div style={{ width: 96, textAlign: 'right', fontSize: 12.5, fontWeight: 800, color: cols[i], lineHeight: 1.15 }}>{r.expr}</div>
              <div onClick={clickSlot(i)} style={{ width: 56, height: 50, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 21, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D07_CARDS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 56, height: 50, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 56, height: 50, borderRadius: 12, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 20, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_07(props) {
  return (<><style>{FX_CSS}</style><D01_07Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D01_07.audio = {
  uz: { intro: "Har razryad tarkibini o'z soniga ulang. Kartani bosing, keyin mos yozuvning bo'sh joyini bosing.", on_correct: "To'g'ri. 2o'nlik5birlik teng 25, 5o'nlik2birlik teng 52, 3o'nlik4birlik teng 34, 4o'nlik0birlik teng 40.", on_wrong: "Maslahat. O'nlik, birinchi raqam. 5 o'nlik 2 birlik teng 52, 25 emas." },
  ru: { intro: "Соедини разрядный состав с его числом. Нажми карточку, затем пустое место нужной записи.", on_correct: "Верно. 2дес5ед равно 25, 5дес2ед равно 52, 3дес4ед равно 34, 4дес0ед равно 40.", on_wrong: "Подсказка. Десятки, первая цифра. 5 десятков 2 единицы равно 52, не 25." },
};
