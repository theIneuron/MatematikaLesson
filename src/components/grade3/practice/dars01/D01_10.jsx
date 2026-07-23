// Dars 1 (3-sinf) · Amaliyot 10 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 3-bet 2-mashq davomi — eng katta uch xonali son 999 dan keyin ming keladi.
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
// Umumlashtirish: 10 yuzlik = 1000 (nazariy Dars01 sMING kashfiyotining amaliyot varianti).
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
// Lumo chiroqlari: panel (10x10 chiroq) = 1 yuzlik
const GlowDefs = () => (
  <defs>
    <radialGradient id="g3d1Glow" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stopColor="#FFE9B8" /><stop offset="55%" stopColor="#FFB84D" /><stop offset="100%" stopColor="#E67E22" />
    </radialGradient>
  </defs>
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

const FX_CSS = `.g3d1-pop { animation: g3d1pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d1-star { opacity: .3; animation: g3d1tw 3.4s ease-in-out infinite; }
@keyframes g3d1tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d1-drop { animation: g3d1drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d1-float { animation: g3d1float 3s ease-in-out infinite; }
@keyframes g3d1float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 10 · Minglik blok (10 yuzlik = 1000) · 🔴 · thousand =================== */
const D10_ANS = 10;
const D10_T = {
  uz: {
    eyebrow: 'Minglik blok', setup: "Eng katta uch xonali son — 999. Unga 1 qo'shilsa, yangi xona ochiladi. Buni panellar bilan tekshiramiz.",
    ask: "Panellarni qo'shib boring: displeyda 1000 hosil bo'lsin.",
    count: 'Panellar:', formed: 'Displey:',
    correct: "To'g'ri! 10 ta yuzlik panel = 1000. 999 dan keyin ming aytiladi — bu to'rt xonali eng kichik son!",
    wrong: "Maslahat: har panel — 100. Yuzliklab sanang: yuz, ikki yuz, uch yuz... Displey ming bo'lguncha davom eting.",
    rule: "999 + 1 = 1000. 10 ta yuzlik = ming; xuddi 10 birlik = 1 o'nlik, 10 o'nlik = 1 yuzlik bo'lgani kabi.",
  },
  ru: {
    eyebrow: 'Блок тысячи', setup: 'Самое большое трёхзначное число — 999. Если прибавить 1, откроется новый разряд. Проверим это панелями.',
    ask: 'Добавляй панели: на дисплее должно получиться 1000.',
    count: 'Панели:', formed: 'Дисплей:',
    correct: 'Верно! 10 панелей-сотен = 1000. После 999 называют тысячу — это самое маленькое четырёхзначное число!',
    wrong: 'Подсказка: каждая панель — 100. Считай сотнями: сто, двести, триста... Продолжай, пока на дисплее не будет тысяча.',
    rule: '999 + 1 = 1000. 10 сотен = тысяча; так же, как 10 единиц = 1 десяток, а 10 десятков = 1 сотня.',
  },
};
function D01_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [n, setN] = useState(0);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.panels != null) { setN(sa.panels); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(n > 0 && !checked); }, [n, checked, onReady]);
  const check = useCallback(() => {
    const correct = n === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { panels: n, value: n * 100 }, correctAnswer: { panels: D10_ANS, value: 1000 }, correct, meta: { tag: 'thousand', level: '🔴' } });
  }, [n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const btn = (bg, dis) => ({ width: 46, height: 46, borderRadius: 12, border: 'none', background: dis ? '#3a2140' : bg, color: '#160a1c', fontSize: 24, fontWeight: 800, cursor: (locked || dis) ? 'default' : 'pointer' });
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ minHeight: 74, display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center', justifyContent: 'center', maxWidth: 360, margin: '0 auto' }}>
          {Array.from({ length: n }).map((_, i) => <Panel key={i} s={32} delay={0} />)}
          {n === 0 && <span style={{ ...S.mono, fontSize: 22, color: C.sink2 }}>?</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 10 }}>
          <button type="button" disabled={locked || n <= 0} onClick={() => setN((v) => Math.max(0, v - 1))} style={btn(C.sink2, n <= 0)}>−</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase' }}>{t.count} <span style={S.mono}>{n}</span></div>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase', marginTop: 4 }}>{t.formed}</div>
            <div className="g3d1-float" style={{ ...S.mono, fontSize: 38, fontWeight: 800, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)' }}>{n * 100}</div>
          </div>
          <button type="button" disabled={locked || n >= 12} onClick={() => setN((v) => Math.min(12, v + 1))} style={btn(C.glow, n >= 12)}>+</button>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_10(props) {
  return (<><style>{FX_CSS}</style><D01_10Impl {...props} /></>);
}
