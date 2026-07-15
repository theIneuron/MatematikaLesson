// Dars29 · Amaliyot 01 — Katta yoki kichik · 🟢 · tag: div_size
// 6 : 0,5 — "necha marta sig'adi": 0,5 li stakan 6 litrga 12 marta. Natija 6 dan KATTA.
// Markaziy xato: "bo'lish har doim kichiklashtiradi". jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#b45309', background: '#fff7ed', border: '1px solid #fed7aa', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d29-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// 0,5 li stakan — birma-bir to'ladi (animation-delay bilan)
function Glass({ i, animate }) {
  const w = 24, h = 36;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="3" y="2" width={w - 6} height={h - 4} rx="4" fill="#fff" stroke="#d6dae3" strokeWidth="1.4" />
      <rect className={animate ? 'd29-fill' : ''} style={animate ? { animationDelay: (i * 0.3) + 's' } : undefined} x="4.4" y="3.4" width={w - 8.8} height={h - 6.8} rx="3" fill="#f59e0b" />
    </svg>
  );
}

const D01_OPTS = { uz: ['Katta (6 dan katta)', 'Kichik (6 dan kichik)', 'Teng (aynan 6)'], ru: ['Больше (больше 6)', 'Меньше (меньше 6)', 'Равно (ровно 6)'] };
const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Katta yoki kichik', setup: "Kamol aytdi: «6 : 0,5 — bu oltidan kichik son». 6 litr ichiga 0,5 litrli stakan necha marta sig'adi?",
    ask: "6 : 0,5 natijasi qanday bo'ladi?",
    correct: "To'g'ri. 0,5 li stakan 6 litrga 12 marta sig'adi — natija 6 dan KATTA.",
    wrong: "«Necha marta sig'adi» deb o'ylang: 0,5 litrli stakan 6 litr idishga bir martadan ko'p sig'adimi? Natija shunga bog'liq.",
    rule: "1 dan kichikka bo'lsangiz — natija kattalashadi.",
  },
  ru: {
    eyebrow: 'Больше или меньше', setup: 'Камол сказал: «6 : 0,5 — это меньше шести». Сколько раз стакан 0,5 литра помещается в 6 литров?',
    ask: 'Каким будет результат 6 : 0,5?',
    correct: 'Верно. Стакан 0,5 литра помещается в 6 литров 12 раз — результат БОЛЬШЕ 6.',
    wrong: 'Подумай «сколько раз помещается»: стакан 0,5 литра входит в 6 литров больше одного раза? От этого зависит результат.',
    rule: 'Если делишь на число меньше 1 — результат увеличивается.',
  },
};

export default function D29_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const opts = D01_OPTS[lang] || D01_OPTS.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'div_size', level: '🟢' } });
  }, [pick, t, opts, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d29-fill { transform-box: fill-box; transform-origin: bottom; animation: d29fill .5s ease both; }
        @keyframes d29fill { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { .d29-pop, .d29-fill { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '4px 0 8px', padding: '12px 10px', borderRadius: 14, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
        {checked && fb?.correct ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 380 }}>
              {Array.from({ length: 12 }).map((_, i) => <Glass key={i} i={i} animate={!isReview} />)}
            </div>
            <div className="d29-pop" style={{ ...S.mono, fontSize: 13.5, fontWeight: 700, color: '#b45309' }}>0,5 L × 12 = 6 L</div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <svg width="46" height="70" viewBox="0 0 46 70" style={{ display: 'block' }}>
                <rect x="4" y="3" width="38" height="64" rx="7" fill="#fff" stroke="#d6dae3" strokeWidth="1.6" />
                <rect x="6.5" y="24" width="33" height="40.5" rx="5" fill="#f59e0b" fillOpacity="0.55" />
              </svg>
              <span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#b45309' }}>6 L</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#b45309' }}>:</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Glass i={0} animate={false} />
              <span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#b45309' }}>0,5 L</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>= ?</span>
          </div>
        )}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
