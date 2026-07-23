// Dars 6 (3-sinf) · Amaliyot 07 — mustaqil topshiriq fayli (grade2 naqshi).
// Mexanika: moslash — son ↔ o'qdagi harfli nuqta (A/B/C). Hammasi-yoki-hech.
// Nuqtalar: A=205, B=250, C=295 (shkala 200-300); joylashuvni belgilar bo'yicha aniqlash.
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
      {STARS.map((s, i) => <span key={i} className="g3d6-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#ffd9e0', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
// Son o'qi: A/B/C harfli nuqtalar bilan
function MarkLine({ lo, hi, marks }) {
  const W = 560, X0 = 40, X1 = 520, LINE_Y = 56;
  const xOf = (v) => X0 + (X1 - X0) * ((v - lo) / (hi - lo));
  return (
    <svg viewBox={`0 0 ${W} 96`} style={{ width: '100%', display: 'block' }} aria-hidden="true">
      <line x1={X0 - 14} y1={LINE_Y} x2={X1 + 14} y2={LINE_Y} stroke={C.sink2} strokeWidth="2.5" />
      <polygon points={`${X1 + 22},${LINE_Y} ${X1 + 10},${LINE_Y - 5} ${X1 + 10},${LINE_Y + 5}`} fill={C.sink2} />
      {Array.from({ length: Math.round((hi - lo) / 10) + 1 }).map((_, i) => {
        const v = lo + i * 10;
        const big = v % 100 === 0;
        return <line key={i} x1={xOf(v)} y1={LINE_Y - (big ? 12 : 6)} x2={xOf(v)} y2={LINE_Y + (big ? 12 : 6)} stroke={big ? C.sink : 'rgba(243,233,242,.5)'} strokeWidth={big ? 3 : 1.5} />;
      })}
      {[lo, hi].map((v) => (
        <text key={v} x={xOf(v)} y={LINE_Y + 32} textAnchor="middle" fill={C.sink} fontSize="16" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{v}</text>
      ))}
      {marks.map(([v, lbl]) => (
        <g key={lbl} className="g3d6-pop">
          <circle cx={xOf(v)} cy={LINE_Y} r="7" fill="#7fd0ff" stroke="#0b1428" strokeWidth="1.5" />
          <text x={xOf(v)} y={LINE_Y - 18} textAnchor="middle" fill="#7fd0ff" fontSize="18" fontWeight="800" fontFamily="'JetBrains Mono', monospace">{lbl}</text>
        </g>
      ))}
    </svg>
  );
}
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
  <div className="g3d6-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d6-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d6-pop { animation: g3d6pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d6pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
.g3d6-star { opacity: .3; animation: g3d6tw 3.4s ease-in-out infinite; }
@keyframes g3d6tw { 0%, 100% { opacity: .15; transform: scale(1); } 50% { opacity: .85; transform: scale(1.6); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 07 · Nuqtalarni moslashtiring (A/B/C) · 🟡 · match_points =================== */
const D07_TAG = 'match_points', D07_LEVEL = '🟡';
const D07_NUMS = ['205', '250', '295'];   // asl indeks: 0->A, 1->B, 2->C
const D07_MARKS = [[205, 'A'], [250, 'B'], [295, 'C']];
const D07_LETTERS = ['A', 'B', 'C'];
const D07_T = {
  uz: {
    eyebrow: 'Nuqtalarni toping', setup: "O'qda uchta nuqta belgilangan: A, B va C. Har son o'z nuqtasini topishi kerak.",
    ask: "Sonni bosing, keyin o'qdagi mos harfni bosing.",
    correct: "To'g'ri! A = 205 (200 ga yaqin), B = 250 (o'rtada), C = 295 (300 ga yaqin).",
    wrong: "Maslahat: 205 — 200 dan sal keyin, 295 — 300 dan sal oldin, 250 — aynan o'rtada. Nuqtalarning joyiga qarang.",
    rule: "O'qdagi joy sonni aytib beradi: chap chetga yaqin — kichik, o'ng chetga yaqin — katta.",
  },
  ru: {
    eyebrow: 'Найди точки', setup: 'На прямой отмечены три точки: A, B и C. Каждое число должно найти свою точку.',
    ask: 'Нажми число, потом соответствующую букву на прямой.',
    correct: 'Верно! A = 205 (около 200), B = 250 (посередине), C = 295 (около 300).',
    wrong: 'Подсказка: 205 — чуть после 200, 295 — чуть до 300, 250 — ровно посередине. Смотри на положение точек.',
    rule: 'Место на прямой подсказывает число: ближе к левому краю — меньше, к правому — больше.',
  },
};
const D07_RIGHT_ORDER = permFromSeed(3, D07_TAG);
function D06_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [map, setMap] = useState({});   // { leftIdx(son): rightIdx(harf) }
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = Object.keys(map).length === D07_NUMS.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = D07_NUMS.every((_, li) => map[li] === li);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: { map: Object.fromEntries(D07_NUMS.map((_, i) => [i, i])) }, correct, meta: { tag: D07_TAG, level: D07_LEVEL } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const usedRight = new Set(Object.values(map));
  const pickLeft = (li) => { if (locked) return; if (map[li] != null) { setMap((m) => { const n = { ...m }; delete n[li]; return n; }); setSel(null); return; } setSel(sel === li ? null : li); };
  const pickRight = (ri) => {
    if (locked || sel == null) return;
    setMap((m) => { const n = { ...m }; for (const k of Object.keys(n)) if (n[k] === ri) delete n[k]; n[sel] = ri; return n; });
    setSel(null);
  };
  const ring = (li) => { if (!checked) return 'none'; const ok = map[li] === li; return '0 0 0 2.5px ' + (ok ? C.ok : C.no); };
  const numStyle = (li) => ({
    minWidth: 96, padding: '12px 14px', borderRadius: 13, fontWeight: 800, ...S.mono, fontSize: 24,
    border: '2px solid ' + (sel === li ? C.acc : map[li] != null ? C.ribbonBd : C.line),
    background: sel === li ? C.accSoft : map[li] != null ? '#152342' : C.paper,
    color: map[li] != null ? C.glow : C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: ring(li),
  });
  const letterStyle = (ri) => ({
    width: 64, height: 58, borderRadius: 13, fontWeight: 800, fontSize: 22, ...S.mono,
    border: '2px solid ' + (usedRight.has(ri) ? C.ribbonBd : C.line),
    background: usedRight.has(ri) ? '#EFE7F5' : C.paper, color: '#374151',
    cursor: (locked || sel == null) ? 'default' : 'pointer', opacity: usedRight.has(ri) && sel != null ? 0.7 : 1,
  });
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><MarkLine lo={200} hi={300} marks={D07_MARKS} /></Stage>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '12px 0' }}>
        {D07_NUMS.map((num, li) => (
          <div key={num} style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            <button type="button" style={numStyle(li)} disabled={locked} onClick={() => pickLeft(li)}>{num}</button>
            <div style={{ display: 'flex', alignItems: 'center', color: C.ink3, fontWeight: 800 }}>→</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px', borderRadius: 13, border: '2px dashed ' + (map[li] != null ? C.ribbonBd : C.line), background: map[li] != null ? '#F6F1FA' : '#fbfaf7', fontWeight: 800, fontSize: 20, ...S.mono, color: map[li] != null ? C.ink : C.ink3 }}>
              {map[li] != null ? D07_LETTERS[map[li]] : '...'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {D07_RIGHT_ORDER.map((ri) => (
          <button key={ri} type="button" style={letterStyle(ri)} disabled={locked} onClick={() => pickRight(ri)}>{D07_LETTERS[ri]}</button>
        ))}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D06_07(props) {
  return (<><style>{FX_CSS}</style><D06_07Impl {...props} /></>);
}
