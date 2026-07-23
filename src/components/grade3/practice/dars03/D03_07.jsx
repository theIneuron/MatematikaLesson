// Dars 3 (3-sinf) · Amaliyot 07 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 4-bet 4-mashq turi — sondan razryadlarni ayirish (427 − 400 − 20).
// Vizual: 4 panel va 2 lenta o'chadi (xira), faqat chiroqlar yonib qoladi.
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
      {STARS.map((s, i) => <span key={i} className="g3d3-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
// Lumo chiroqlari (dim=o'chirilgan holat)
const GlowDefs = () => (
  <defs>
    <radialGradient id="g3d3Glow" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stopColor="#FFE9B8" /><stop offset="55%" stopColor="#FFB84D" /><stop offset="100%" stopColor="#E67E22" />
    </radialGradient>
  </defs>
);
const Chiroq = ({ s = 17, delay = 0, dim = false }) => (
  <svg className="g3d3-drop" width={s} height={s} viewBox="0 0 16 16" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', animationDelay: delay + 's', opacity: dim ? 0.25 : 1, filter: dim ? 'grayscale(1)' : 'none' }}>
    <GlowDefs />
    <circle cx="8" cy="8" r="7.2" fill="#FF9A2E" opacity="0.35" />
    <circle cx="8" cy="8" r="4.6" fill="url(#g3d3Glow)" />
    <circle cx="6.4" cy="6.4" r="1.6" fill="rgba(255,255,255,0.9)" />
  </svg>
);
const Lenta = ({ w = 84, delay = 0, dim = false }) => (
  <svg className="g3d3-drop" width={w} height={Math.round(w * 20 / 92)} viewBox="0 0 92 20" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', animationDelay: delay + 's', opacity: dim ? 0.25 : 1, filter: dim ? 'grayscale(1)' : 'none' }}>
    <GlowDefs />
    <rect x="1" y="2" width="90" height="16" rx="6" fill={C.ribbon} stroke={C.ribbonBd} strokeWidth="1" />
    {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={9.5 + i * 8.1} cy="10" r="3" fill="url(#g3d3Glow)" />)}
  </svg>
);
const Panel = ({ s = 56, delay = 0, dim = false }) => (
  <svg className="g3d3-drop" width={s} height={s} viewBox="0 0 96 96" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', animationDelay: delay + 's', opacity: dim ? 0.25 : 1, filter: dim ? 'grayscale(1)' : 'none' }}>
    <GlowDefs />
    <rect x="1" y="1" width="94" height="94" rx="9" fill="#152342" stroke={C.ribbonBd} strokeWidth="1.4" />
    {Array.from({ length: 100 }).map((_, i) => {
      const col = i % 10; const row = Math.floor(i / 10);
      return <circle key={i} cx={9.5 + col * 8.5} cy={9.5 + row * 8.5} r="2.6" fill="url(#g3d3Glow)" />;
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
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d3-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function NumPad({ value, setValue, disabled, max = 3, tone = 'idle' }) {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  const keyStyle = { width: 62, height: 56, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: C.ink, cursor: disabled ? 'default' : 'pointer' };
  const dBd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.acc;
  const dBg = tone === 'ok' ? C.okSoft : tone === 'no' ? C.noSoft : C.paper;
  const dCol = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.ink;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 170, height: 62, borderRadius: 14, border: '2px solid ' + dBd, background: dBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: dCol, letterSpacing: 3 }}>{value || '–'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 62px)', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={keyStyle}>{d}</button>))}
        <span />
        <button type="button" disabled={disabled} onClick={() => push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize: 20, color: C.no }}>⌫</button>
      </div>
    </div>
  );
}

const FX_CSS = `.g3d3-pop { animation: g3d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d3-star { opacity: .3; animation: g3d3tw 3.4s ease-in-out infinite; }
@keyframes g3d3tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d3-drop { animation: g3d3drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d3drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 07 · Nima qoldi? (427 − 400 − 20) · 🟡 · strip_addends =================== */
const D07_ANS = '7';
const D07_T = {
  uz: {
    eyebrow: 'Nima qoldi?', setup: "Devorda 427 chiroq yonib turibdi: 4 panel, 2 lenta va 7 chiroq. Bit avval panellarni (400), keyin lentalarni (20) o'chirdi.",
    ask: "427 − 400 − 20 = ? Nechta chiroq yonib qoldi?",
    expr: '427 − 400 − 20',
    correct: "To'g'ri! 427 − 400 − 20 = 7: yuzlik va o'nlik o'chdi, faqat 7 birlik qoldi.",
    wrong: "Maslahat: 400 — bu barcha panellar, 20 — barcha lentalar. Ular o'chganda qaysi razryad yonib qoladi?",
    rule: "Sondan razryadni ayirsak, qolgan razryadlar o'zgarmaydi: 427 − 400 − 20 = 7.",
  },
  ru: {
    eyebrow: 'Что осталось?', setup: 'На стене горят 427 огней: 4 панели, 2 ленты и 7 лампочек. Бит выключил сначала панели (400), потом ленты (20).',
    ask: '427 − 400 − 20 = ? Сколько лампочек осталось гореть?',
    expr: '427 − 400 − 20',
    correct: 'Верно! 427 − 400 − 20 = 7: сотни и десятки погасли, остались только 7 единиц.',
    wrong: 'Подсказка: 400 — это все панели, 20 — все ленты. Когда они погасли, какой разряд остался гореть?',
    rule: 'Если вычесть из числа разряд, остальные разряды не меняются: 427 − 400 − 20 = 7.',
  },
};
function D03_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [value, setValue] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setValue(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(value.length > 0 && !checked); }, [value, checked, onReady]);
  const check = useCallback(() => {
    const correct = value === D07_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value }, correctAnswer: { value: D07_ANS }, correct, meta: { tag: 'strip_addends', level: '🟡' } });
  }, [value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {Array.from({ length: 4 }).map((_, i) => <Panel key={i} s={44} delay={i * 0.06} dim />)}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {Array.from({ length: 2 }).map((_, i) => <Lenta key={i} w={72} delay={0.25 + i * 0.06} dim />)}
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {Array.from({ length: 7 }).map((_, i) => <Chiroq key={i} s={17} delay={0.4 + i * 0.05} />)}
          </div>
          <div style={{ textAlign: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: C.glow, textShadow: '0 0 10px rgba(255,184,77,.7)' }}>{t.expr} = ?</div>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <NumPad value={value} setValue={setValue} disabled={locked} max={3} tone={checked ? (fb?.correct ? 'ok' : 'no') : 'idle'} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_07(props) {
  return (<><style>{FX_CSS}</style><D03_07Impl {...props} /></>);
}
