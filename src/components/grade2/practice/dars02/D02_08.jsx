// Dars 2 · Amaliyot 08 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d02-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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

const D08_TARGET = 34, D08_TICKS = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
const D08_T = {
  uz: {
    eyebrow: 'Marshrut', setup: 'Marshrutning 30 dan 40 gacha bo‘lagi. Har belgi — bitta son.',
    ask: '34 kodini marshrutdagi to‘g‘ri joyiga qo‘ying:',
    correct: "To'g'ri. 34 — 30 dan keyin 4-belgi. 30 va 40 orasida.",
    wrong: "Maslahat: 30 dan boshlab 4 ta oldinga sanang: 31, 32, 33, 34.",
    rule: "34 = 30 + 4. Marshrutda 30 dan keyingi to'rtinchi belgi.",
  },
  ru: {
    eyebrow: 'Маршрут', setup: 'Участок маршрута от 30 до 40. Каждая метка — одно число.',
    ask: 'Поставь код 34 на нужное место маршрута:',
    correct: 'Верно. 34 — четвёртая метка после 30. Между 30 и 40.',
    wrong: 'Подсказка: отсчитай от 30 четыре вперёд: 31, 32, 33, 34.',
    rule: '34 = 30 + 4. На маршруте четвёртая метка после 30.',
  },
};
function D02_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.value != null) { setPicked(initialAnswer.studentAnswer.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_TICKS.map((n) => ({ id: String(n), label: String(n) })), studentAnswer: { value: picked }, correctAnswer: { value: D08_TARGET }, correct, meta: { tag: 'numberline', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div className="d02-float" style={{ textAlign: 'center', ...S.mono, fontSize: 40, fontWeight: 800, color: C.ten, marginBottom: 8 }}>34</div>
        <div style={{ position: 'relative', height: 60, margin: '8px 4px 2px' }}>
          <div style={{ position: 'absolute', left: 6, right: 6, top: 26, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#3a4a63,#5BD6F2)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 6, display: 'flex', justifyContent: 'space-between' }}>
            {D08_TICKS.map((n) => {
              const on = picked === n;
              const isEnd = n === 30 || n === 40;
              const isT = checked && n === D08_TARGET;
              const bd = on ? (checked ? (n === D08_TARGET ? C.ok : C.no) : C.acc) : C.stageBd;
              const bg = on ? (checked ? (n === D08_TARGET ? C.ok : C.no) : C.acc) : C.stile;
              return (
                <button key={n} type="button" disabled={locked} onClick={() => setPicked(n)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', cursor: locked ? 'default' : 'pointer', width: 24 }}>
                  <span style={{ width: on ? 18 : (isEnd ? 12 : 9), height: on ? 18 : (isEnd ? 12 : 9), borderRadius: '50%', background: bg, border: '2px solid ' + bd, transition: 'all .12s' }} />
                  <span style={{ ...S.mono, fontSize: 10, fontWeight: 800, color: isT ? C.ok : (isEnd ? C.sink : C.sink2) }}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_08(props) {
  return (<><style>{FX_CSS}</style><D02_08Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D02_08.audio = {
  uz: { intro: "Marshrutning 30 dan 40 gacha bo'lagi. Har belgi, bitta son. 34 kodini marshrutdagi to'g'ri joyiga qo'ying.", on_correct: "To'g'ri. 34, 30 dan keyin 4-belgi. 30 va 40 orasida.", on_wrong: "Maslahat. 30 dan boshlab 4 ta oldinga sanang. 31, 32, 33, 34." },
  ru: { intro: "Участок маршрута от 30 до 40. Каждая метка, одно число. Поставь код 34 на нужное место маршрута.", on_correct: "Верно. 34, четвёртая метка после 30. Между 30 и 40.", on_wrong: "Подсказка. Отсчитай от 30 четыре вперёд. 31, 32, 33, 34." },
};
