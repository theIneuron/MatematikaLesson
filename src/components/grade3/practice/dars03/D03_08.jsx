// Dars 3 (3-sinf) · Amaliyot 08 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 4-bet 7-mashq qatoridagi 800 + 4 yig'indisi (o'nlik qo'shiluvchisi yo'q).
// Mexanika: plita-tanlash — to'g'ri qo'shiluvchi plitalarni tanlab 804 ni yig'ish.
// Tuzoq: chalg'ituvchi plitalar 40 va 8 (o'xshash, lekin boshqa razryad qiymatlari).
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
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d3-pop { animation: g3d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d3-star { opacity: .3; animation: g3d3tw 3.4s ease-in-out infinite; }
@keyframes g3d3tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
.g3d3-float { animation: g3d3float 3s ease-in-out infinite; }
@keyframes g3d3float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 08 · Plitalardan yig'ing (804) · 🔴 · build_plates =================== */
// Plitalar havzasi (seeded aralash): to'g'ri {800, 4} + chalg'ituvchilar {40, 8, 400}.
const D08_TARGET = 804;
const D08_POOL = [800, 40, 4, 8, 400];
const D08_NEED = [800, 4];
const D08_T = {
  uz: {
    eyebrow: "Plitalardan yig'ing", setup: "Displeyda nishon: 804. Pastdagi qiymat-plitalardan KERAKLILARINI tanlab sonni yig'ing.",
    ask: "804 ni yig'ish uchun qaysi plitalar kerak? Ularni bosing.",
    target: 'Nishon:', sum: "Yig'indi:",
    correct: "To'g'ri! 804 = 800 + 4. O'nlik plitasi kerak emas — o'nliklar o'rnida 0.",
    wrong: "Maslahat: 804 da nechta yuzlik, nechta o'nlik, nechta birlik bor? Faqat bor razryadlarning plitalarini oling.",
    rule: "804 = 800 + 4: nol razryadga plita olinmaydi.",
  },
  ru: {
    eyebrow: 'Собери из плиток', setup: 'На дисплее цель: 804. Выбери из плиток-значений внизу только НУЖНЫЕ и собери число.',
    ask: 'Какие плитки нужны, чтобы собрать 804? Нажми на них.',
    target: 'Цель:', sum: 'Сумма:',
    correct: 'Верно! 804 = 800 + 4. Плитка десятков не нужна — на месте десятков 0.',
    wrong: 'Подсказка: сколько в 804 сотен, десятков и единиц? Бери плитки только тех разрядов, которые есть.',
    rule: '804 = 800 + 4: для нулевого разряда плитка не берётся.',
  },
};
const D08_ORDER = permFromSeed(D08_POOL.length, 'build_plates');
function D03_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [selSet, setSelSet] = useState([]); // tanlangan plita qiymatlari
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (Array.isArray(sa?.plates)) { setSelSet(sa.plates); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(selSet.length > 0 && !checked); }, [selSet, checked, onReady]);
  const sum = selSet.reduce((a, b) => a + b, 0);
  const check = useCallback(() => {
    const correct = selSet.length === D08_NEED.length && D08_NEED.every((v) => selSet.includes(v));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_POOL.map(String), studentAnswer: { plates: selSet, sum }, correctAnswer: { plates: D08_NEED, sum: D08_TARGET }, correct, meta: { tag: 'build_plates', level: '🔴' } });
  }, [selSet, sum, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const toggle = (v) => { if (locked) return; setSelSet((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v])); };
  const plateStyle = (v) => {
    const on = selSet.includes(v);
    let bd = on ? C.acc : C.line, bg = on ? C.accSoft : C.paper, col = C.ink;
    if (checked && on) { const good = D08_NEED.includes(v); bd = good ? C.ok : C.no; bg = good ? C.okSoft : C.noSoft; col = good ? C.ok : C.no; }
    if (checked && !on && D08_NEED.includes(v) && !fb?.correct) { /* to'g'ri plita ochilmaydi — faqat tanlanganlar bo'yaladi */ }
    return { minWidth: 84, padding: '14px 12px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 22, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase' }}>{t.target}</div>
            <div style={{ ...S.mono, fontSize: 38, fontWeight: 800, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)' }}>{D08_TARGET}</div>
          </div>
          <div style={{ ...S.mono, fontSize: 26, color: C.sink2 }}>←</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase' }}>{t.sum}</div>
            <div className="g3d3-float" style={{ ...S.mono, fontSize: 38, fontWeight: 800, color: sum === D08_TARGET ? '#7CE0A3' : C.sink }}>{sum}</div>
          </div>
        </div>
      </Stage>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center', margin: '10px 0' }}>
        {D08_ORDER.map((oi) => {
          const v = D08_POOL[oi];
          return <button key={v} type="button" style={plateStyle(v)} disabled={locked} onClick={() => toggle(v)}>{v}</button>;
        })}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_08(props) {
  return (<><style>{FX_CSS}</style><D03_08Impl {...props} /></>);
}
