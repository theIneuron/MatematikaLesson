// Dars 1 (3-sinf) · Amaliyot 03 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 3-bet 1-mashq — jadvaldagi 307 soni (nol o'nlik) rasmda.
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Lumo — Bit shahri) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 24%, #4a2342 0%, #261335 58%, #130b23 100%)',
  stageBd: '#4A2A48', sink: '#F3E9F2', sink2: '#C9A9C6', stile: '#2a1530',
  glow: '#FFB84D', glowDk: '#E67E22', ribbon: '#1B2A4A', ribbonBd: '#3A4E78',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="g3d1-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
// Lumo chiroqlari: chiroq = 1 birlik · lenta (10 chiroq) = 1 o'nlik · panel (10x10) = 1 yuzlik
const GlowDefs = () => (
  <defs>
    <radialGradient id="g3d1Glow" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stopColor="#FFE9B8" /><stop offset="55%" stopColor="#FFB84D" /><stop offset="100%" stopColor="#E67E22" />
    </radialGradient>
  </defs>
);
const Chiroq = ({ s = 17, delay = 0 }) => (
  <svg className="g3d1-drop" width={s} height={s} viewBox="0 0 16 16" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', animationDelay: delay + 's' }}>
    <GlowDefs />
    <circle cx="8" cy="8" r="7.2" fill="#FF9A2E" opacity="0.35" />
    <circle cx="8" cy="8" r="4.6" fill="url(#g3d1Glow)" />
    <circle cx="6.4" cy="6.4" r="1.6" fill="rgba(255,255,255,0.9)" />
  </svg>
);
const Lenta = ({ w = 84, delay = 0 }) => (
  <svg className="g3d1-drop" width={w} height={Math.round(w * 20 / 92)} viewBox="0 0 92 20" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', animationDelay: delay + 's' }}>
    <GlowDefs />
    <rect x="1" y="2" width="90" height="16" rx="6" fill={C.ribbon} stroke={C.ribbonBd} strokeWidth="1" />
    {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={9.5 + i * 8.1} cy="10" r="3" fill="url(#g3d1Glow)" />)}
  </svg>
);
const Panel = ({ s = 56, delay = 0 }) => (
  <svg className="g3d1-drop" width={s} height={s} viewBox="0 0 96 96" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', animationDelay: delay + 's' }}>
    <GlowDefs />
    <rect x="1" y="1" width="94" height="94" rx="9" fill="#152342" stroke={C.ribbonBd} strokeWidth="1.4" />
    {Array.from({ length: 100 }).map((_, i) => {
      const col = i % 10; const row = Math.floor(i / 10);
      return <circle key={i} cx={9.5 + col * 8.5} cy={9.5 + row * 8.5} r="2.6" fill="url(#g3d1Glow)" />;
    })}
  </svg>
);
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 13, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 17, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 18.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div className="g3d1-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d1-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = C.paper, bd = C.line, col = '#374151';
  if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
  if (show) { const ok = i === correctIdx; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '14px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 66,
  };
}
// Variant tartibi — deterministik aralashtirish (tag seed, grade2 dars39 naqshi)
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d1-pop { animation: g3d1pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d1-star { opacity: .3; animation: g3d1tw 3.4s ease-in-out infinite; }
@keyframes g3d1tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d1-drop { animation: g3d1drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 03 · Rasmdagi son (307) · 🟢 · pv_read =================== */
// 3 panel + 0 lenta + 7 chiroq = 307. Chalg'ituvchilar: 37 (nol tushib qolgan), 370 (razryad almashgan).
const D03_TAG = 'pv_read', D03_LEVEL = '🟢', D03_CORRECT = 0;
const D03_T = {
  uz: {
    eyebrow: "Rasmni o'qing", setup: "Devorda chiroqlar guruhlangan: panellar va alohida chiroqlar bor, lentalar esa yo'q.",
    ask: 'Rasmda qanday son tasvirlangan?', opts: ['307', '37', '370'],
    correct: "To'g'ri! 3 panel — 300, lenta yo'q — 0 o'nlik, 7 chiroq — 7. Bu 307.",
    wrong: "Maslahat: panellarni sanang — har biri 100. Lentalar nechta? Yo'q bo'lsa, o'sha razryadda nima yoziladi?",
    rule: "O'nlik bo'lmasa, uning o'rnida 0 yoziladi — aks holda son 10 marta kichrayib qoladi: 307, 37 emas.",
  },
  ru: {
    eyebrow: 'Прочитай рисунок', setup: 'На стене огни сгруппированы: есть панели и отдельные лампочки, а лент нет.',
    ask: 'Какое число изображено на рисунке?', opts: ['307', '37', '370'],
    correct: 'Верно! 3 панели — 300, лент нет — 0 десятков, 7 лампочек — 7. Это 307.',
    wrong: 'Подсказка: посчитай панели — каждая по 100. Сколько лент? Если их нет, что пишется в этом разряде?',
    rule: 'Если десятков нет, на их месте пишется 0 — иначе число станет в 10 раз меньше: 307, а не 37.',
  },
};
const D03_ORDER = permFromSeed(3, D03_TAG);
function D01_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D03_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D03_CORRECT, label: t.opts[D03_CORRECT] }, correct, meta: { tag: D03_TAG, level: D03_LEVEL } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {Array.from({ length: 3 }).map((_, i) => <Panel key={i} s={52} delay={i * 0.08} />)}
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Array.from({ length: 7 }).map((_, i) => <Chiroq key={i} s={17} delay={0.3 + i * 0.05} />)}
          </div>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {D03_ORDER.map((i) => (
          <button key={i} type="button" style={optStyle(picked, i, D03_CORRECT, checked, isReview, { half: true, center: true, fs: 24, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{t.opts[i]}</button>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_03(props) {
  return (<><style>{FX_CSS}</style><D01_03Impl {...props} /></>);
}
