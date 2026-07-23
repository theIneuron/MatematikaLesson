// Dars 1 (3-sinf) · Amaliyot 05 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 4-bet 4-mashq — 427 soni (100+60+2 turkumidagi razryad mashqlari qatoridan).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
// Mexanika: son o'qi (nazariy Dars01 s6 NumberLineAnim naqshining amaliyot varianti) — oraliqni bosish.
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
.g3d1-dot { animation: g3d1dot .6s cubic-bezier(.34,1.56,.64,1) both; transform-origin: center; transform-box: fill-box; }
@keyframes g3d1dot { 0% { opacity: 0; transform: scale(.2); } 100% { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 05 · Son o'qida oraliq (427) · 🟡 · numline_between =================== */
// Shkala 300–800, nishon 427 → to'g'ri oraliq 400–500 (indeks 1).
const D05_TICKS = [300, 400, 500, 600, 700, 800];
const D05_TARGET = 427, D05_CORRECT = 1;
const D05_T = {
  uz: {
    eyebrow: "Son o'qi", setup: "Shkalada yumaloq yuzliklar belgilangan: 300 dan 800 gacha.",
    ask: '427 soni qaysi oraliqda joylashgan? Oraliqni bosing.',
    target: 'Qidirilayotgan son:',
    correct: "To'g'ri! 427 — 400 bilan 500 orasida: to'rt yuzdan katta, besh yuzdan kichik.",
    wrong: "Maslahat: avval yuzligiga qarang: 427 sonida nechta yuzlik bor? Son o'sha yumaloq yuzlikdan keyin keladi.",
    rule: "427 = 4 yuzlik 2 o'nlik 7 birlik → son o'qida 400 bilan 500 orasida, 400 ga yaqinroq.",
  },
  ru: {
    eyebrow: 'Числовая прямая', setup: 'На шкале отмечены круглые сотни: от 300 до 800.',
    ask: 'В каком промежутке находится число 427? Нажми на промежуток.',
    target: 'Ищем число:',
    correct: 'Верно! 427 — между 400 и 500: больше четырёх сотен, меньше пяти.',
    wrong: 'Подсказка: сначала посмотри на сотни: сколько сотен в числе 427? Число идёт после этой круглой сотни.',
    rule: '427 = 4 сотни 2 десятка 7 единиц → на числовой прямой между 400 и 500, ближе к 400.',
  },
};
function D01_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    const segLbl = (i) => D05_TICKS[i] + '–' + D05_TICKS[i + 1];
    onSubmit?.({ questionText: t.ask, options: D05_TICKS.slice(0, -1).map((_, i) => ({ id: String(i), label: segLbl(i) })), studentAnswer: { idx: picked, label: picked != null ? segLbl(picked) : null }, correctAnswer: { idx: D05_CORRECT, label: segLbl(D05_CORRECT) }, correct, meta: { tag: 'numline_between', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  // SVG geometriya: 560×110, chiziq y=64, birinchi belgi x=30, oraliq kengligi 100px
  const X0 = 30, STEP = 100, LINE_Y = 64;
  const xOf = (v) => X0 + ((v - D05_TICKS[0]) / 100) * STEP;
  const segFill = (i) => {
    if (checked && picked === i) return fb?.correct ? 'rgba(31,122,77,.45)' : 'rgba(192,57,43,.45)';
    if (picked === i) return 'rgba(255,79,40,.4)';
    return 'rgba(255,255,255,.06)';
  };
  const segStroke = (i) => {
    if (checked && picked === i) return fb?.correct ? C.ok : C.no;
    if (picked === i) return C.acc;
    return 'rgba(255,255,255,.18)';
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center', marginBottom: 4, color: C.sink2, fontSize: 13, fontWeight: 700 }}>{t.target}</div>
        <div className="g3d1-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 36, fontWeight: 800, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)', marginBottom: 6 }}>{D05_TARGET}</div>
        <svg viewBox="0 0 560 110" style={{ width: '100%', display: 'block' }} role="group" aria-label="son o'qi">
          {/* bosiladigan oraliqlar */}
          {D05_TICKS.slice(0, -1).map((_, i) => (
            <rect key={i} x={X0 + i * STEP + 2} y={LINE_Y - 26} width={STEP - 4} height={52} rx={10}
              fill={segFill(i)} stroke={segStroke(i)} strokeWidth="2"
              style={{ cursor: locked ? 'default' : 'pointer' }}
              onClick={() => { if (!locked) setPicked(i); }} />
          ))}
          {/* asosiy chiziq va belgilar — bosishni to'sib qo'ymasligi uchun pointerEvents yo'q */}
          <g style={{ pointerEvents: 'none' }}>
            <line x1={X0 - 12} y1={LINE_Y} x2={X0 + 5 * STEP + 12} y2={LINE_Y} stroke={C.sink2} strokeWidth="2.5" />
            <polygon points={`${X0 + 5 * STEP + 20},${LINE_Y} ${X0 + 5 * STEP + 8},${LINE_Y - 5} ${X0 + 5 * STEP + 8},${LINE_Y + 5}`} fill={C.sink2} />
            {D05_TICKS.map((v) => (
              <g key={v}>
                <line x1={xOf(v)} y1={LINE_Y - 9} x2={xOf(v)} y2={LINE_Y + 9} stroke={C.sink} strokeWidth="2.5" />
                <text x={xOf(v)} y={LINE_Y + 30} textAnchor="middle" fill={C.sink} fontSize="15" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{v}</text>
              </g>
            ))}
          </g>
          {/* to'g'ri javobda 470 nuqtasi yonadi */}
          {checked && fb?.correct && (
            <g className="g3d1-dot">
              <circle cx={xOf(D05_TARGET)} cy={LINE_Y} r="11" fill="rgba(255,184,77,.35)" />
              <circle cx={xOf(D05_TARGET)} cy={LINE_Y} r="6" fill={C.glow} />
              <text x={xOf(D05_TARGET)} y={LINE_Y - 18} textAnchor="middle" fill={C.glow} fontSize="15" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{D05_TARGET}</text>
            </g>
          )}
        </svg>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_05(props) {
  return (<><style>{FX_CSS}</style><D01_05Impl {...props} /></>);
}
