// Dars 1 (3-sinf) · Amaliyot 02 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 3-bet 2-mashq — tarkibi berilgan sonni yozish (9 ta yuzlik 3 ta o'nlik = 930).
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
// Razryad-stepper (grade2 Stepper naqshi, Lumo belgilar bilan)
const Stepper = ({ label, color, value, set, max, locked, render }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12, border: '2px solid ' + C.stageBd, background: C.stile, minWidth: 108, flex: '1 1 30%' }}>
    <div style={{ fontSize: 12, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.04em', textAlign: 'center' }}>{label}</div>
    <div style={{ minHeight: 44, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', justifyContent: 'center', maxWidth: 150 }}>{render(value)}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button type="button" disabled={locked || value <= 0} onClick={() => set(Math.max(0, value - 1))} style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: value <= 0 ? '#3a2140' : color, color: '#160a1c', fontSize: 20, fontWeight: 800, cursor: (locked || value <= 0) ? 'default' : 'pointer' }}>−</button>
      <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.sink, minWidth: 22, textAlign: 'center' }}>{value}</span>
      <button type="button" disabled={locked || value >= max} onClick={() => set(Math.min(max, value + 1))} style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: value >= max ? '#3a2140' : color, color: '#160a1c', fontSize: 20, fontWeight: 800, cursor: (locked || value >= max) ? 'default' : 'pointer' }}>+</button>
    </div>
  </div>
);

const FX_CSS = `.g3d1-pop { animation: g3d1pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d1-star { opacity: .3; animation: g3d1tw 3.4s ease-in-out infinite; }
@keyframes g3d1tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d1-drop { animation: g3d1drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d1-float { animation: g3d1float 3s ease-in-out infinite; }
@keyframes g3d1float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 02 · Tarkibli sonni yig'ing (930) · 🟢 · pv_build =================== */
const D02_H = 9, D02_TN = 3, D02_O = 0, D02_NUM = 930;
const D02_T = {
  uz: {
    eyebrow: "Sonni yig'ing", setup: "Quyidagicha tarkibli sonni yig'ing: 9 ta yuzlik va 3 ta o'nlik. Panel — yuzlik, lenta — o'nlik, chiroq — birlik.",
    ask: "9 ta yuzlik va 3 ta o'nlikdan qanday son hosil bo'ladi?",
    h: 'Yuzlik', t: "O'nlik", o: 'Birlik', formed: "Hosil bo'lgan son:",
    correct: "To'g'ri! 9 yuzlik va 3 o'nlik — bu 930. Birlik yo'q, uning o'rnida 0 turadi.",
    wrong: "Maslahat: shartni o'qing: nechta yuzlik, nechta o'nlik aytilgan? Birlik haqida hech narsa deyilmagan — demak birliklar nechta?",
    rule: "Bo'sh razryadda 0 yoziladi: 9 yuzlik 3 o'nlik = 930.",
  },
  ru: {
    eyebrow: 'Собери число', setup: 'Собери число такого состава: 9 сотен и 3 десятка. Панель — сотня, лента — десяток, лампочка — единица.',
    ask: 'Какое число получится из 9 сотен и 3 десятков?',
    h: 'Сотни', t: 'Десятки', o: 'Единицы', formed: 'Полученное число:',
    correct: 'Верно! 9 сотен и 3 десятка — это 930. Единиц нет, на их месте стоит 0.',
    wrong: 'Подсказка: перечитай условие: сколько названо сотен, сколько десятков? Про единицы ничего не сказано — значит, сколько единиц?',
    rule: 'В пустом разряде пишется 0: 9 сотен 3 десятка = 930.',
  },
};
function D01_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [h, setH] = useState(0);
  const [tn, setTn] = useState(0);
  const [o, setO] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.h != null) { setH(sa.h); setTn(sa.t); setO(sa.o); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(!checked); }, [checked, onReady]);
  const num = h * 100 + tn * 10 + o;
  const check = useCallback(() => {
    const correct = h === D02_H && tn === D02_TN && o === D02_O;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { h, t: tn, o, value: num }, correctAnswer: { h: D02_H, t: D02_TN, o: D02_O, value: D02_NUM }, correct, meta: { tag: 'pv_build', level: '🟢' } });
  }, [h, tn, o, num, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Stepper label={t.h} color={C.glow} value={h} set={setH} max={9} locked={locked} render={(v) => Array.from({ length: v }).map((_, i) => <Panel key={i} s={30} delay={i * 0.04} />)} />
          <Stepper label={t.t} color="#7fd0ff" value={tn} set={setTn} max={9} locked={locked} render={(v) => Array.from({ length: v }).map((_, i) => <Lenta key={i} w={56} delay={i * 0.04} />)} />
          <Stepper label={t.o} color="#7CE0A3" value={o} set={setO} max={9} locked={locked} render={(v) => Array.from({ length: v }).map((_, i) => <Chiroq key={i} s={15} delay={i * 0.04} />)} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, color: C.sink2, fontSize: 13, fontWeight: 700 }}>{t.formed}</div>
        <div className="g3d1-float" style={{ textAlign: 'center', ...S.mono, fontSize: 40, fontWeight: 800, color: C.glow }}>{num}</div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_02(props) {
  return (<><style>{FX_CSS}</style><D01_02Impl {...props} /></>);
}
