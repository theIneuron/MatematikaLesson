// Dars 2 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
  <div className="d02-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d02-pop { animation: d02pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-star { opacity: .35; animation: d02tw 3.2s ease-in-out infinite; }
        @keyframes d02tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d02-drop { animation: d02drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-float { animation: d02float 3s ease-in-out infinite; }
        @keyframes d02float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d02-pulse { animation: d02pulse 1.5s ease-in-out infinite; }
        @keyframes d02pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_ROWS = [{ expr: "o'ttiz to'rt", val: 34 }, { expr: 'qirq', val: 40 }, { expr: 'yigirma besh', val: 25 }, { expr: 'ellik uch', val: 53 }];
const D05_ROWS_RU = ['тридцать четыре', 'сорок', 'двадцать пять', 'пятьдесят три'];
const D05_CARDS = [34, 40, 25, 53, 43, 35];
const D05_T = {
  uz: {
    eyebrow: 'Moslash', setup: 'Har kodni uning nomi bilan tutashtiring.',
    ask: 'Kod kartasini bosing, keyin mos nomning bo‘sh joyini bosing:',
    correct: "To'g'ri. o'ttiz to'rt=34, qirq=40, yigirma besh=25, ellik uch=53.",
    wrong: "Maslahat: avval o'nlikni, keyin birlikni o'qing. «o'ttiz to'rt» = 34, 43 emas.",
    rule: "Nom o'nlikdan boshlanadi: «o'ttiz to'rt» = 3 o'nlik 4 birlik = 34.",
  },
  ru: {
    eyebrow: 'Соответствие', setup: 'Соедини каждый код с его названием.',
    ask: 'Нажми карточку кода, затем пустое место нужного названия:',
    correct: 'Верно. тридцать четыре=34, сорок=40, двадцать пять=25, пятьдесят три=53.',
    wrong: 'Подсказка: сначала десятки, потом единицы. «тридцать четыре» = 34, не 43.',
    rule: 'Название с десятков: «тридцать четыре» = 3 десятка 4 единицы = 34.',
  },
};
function D02_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
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
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D05_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D05_ROWS[i].val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: D05_ROWS.map((r) => r.val) }, correct, meta: { tag: 'read_match', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cols = ['#c2410c', '#017CA3', '#1F7A4D', '#B45309'];
  const bgs = [C.accSoft, '#E6F4FA', '#EAF7EF', '#FFF6E9'];
  const names = lang === 'uz' ? D05_ROWS.map((r) => r.expr) : D05_ROWS_RU;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', margin: '8px 0 14px', justifyItems: 'center' }}>
        {D05_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = cols[i], bg = bgs[i], col = cols[i];
          if (checked && v != null) { const ok = v === r.val; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <div style={{ width: 104, textAlign: 'right', fontSize: 13, fontWeight: 800, color: cols[i], lineHeight: 1.15 }}>{names[i]}</div>
              <div onClick={clickSlot(i)} style={{ width: 56, height: 50, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 21, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D05_CARDS.map((n, idx) => {
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

export default function D02_05(props) {
  return (<><style>{FX_CSS}</style><D02_05Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D02_05.audio = {
  uz: { intro: "Har kodni uning nomi bilan tutashtiring. Kod kartasini bosing, keyin mos nomning bo'sh joyini bosing.", on_correct: "To'g'ri. O'ttiz to'rt teng 34, qirq teng 40, yigirma besh teng 25, ellik uch teng 53.", on_wrong: "Maslahat. Avval o'nlikni, keyin birlikni o'qing. O'ttiz to'rt teng 34, 43 emas." },
  ru: { intro: "Соедини каждый код с его названием. Нажми карточку кода, затем пустое место нужного названия.", on_correct: "Верно. Тридцать четыре равно 34, сорок равно 40, двадцать пять равно 25, пятьдесят три равно 53.", on_wrong: "Подсказка. Сначала десятки, потом единицы. Тридцать четыре равно 34, не 43." },
};
