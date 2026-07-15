// Dars33 · Amaliyot 05 — Burchak turini mosla · 🟡 · tag: geo_angle_type
// To'g'ri(90) / O'tkir(<90) / O'tmas(>90) / Yoyilgan(180) burchak figurasini nomiga ulash.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const CY = '#0891b2';
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: CY, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d33-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function Angle({ deg, right = false }) {
  const W = 118, H = 78, vx = 59, vy = 60, sideLen = 44, color = CY;
  const rad = deg * Math.PI / 180;
  const rx = vx + sideLen * Math.cos(rad), ry = vy - sideLen * Math.sin(rad);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <line x1={vx} y1={vy} x2={vx + sideLen} y2={vy} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <g className="d33-open" style={{ '--d33-a': deg + 'deg', transformOrigin: `${vx}px ${vy}px` }}>
        <line x1={vx} y1={vy} x2={rx} y2={ry} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {right && <path d={`M ${vx + 15} ${vy} L ${vx + 15} ${vy - 15} L ${vx} ${vy - 15}`} fill="none" stroke="#0e7490" strokeWidth="2" />}
      <circle cx={vx} cy={vy} r="4.5" fill={color} />
    </svg>
  );
}
const FIGS = { rt: { deg: 90, right: true }, ac: { deg: 48 }, ob: { deg: 132 }, st: { deg: 180 } };

const D05_PAIRS = { rt: 'nRt', ac: 'nAc', ob: 'nOb', st: 'nSt' };
const LEFT = ['rt', 'ac', 'ob', 'st'];
const RIGHT = ['nAc', 'nSt', 'nRt', 'nOb'];
const D05_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Kamol to'rt burchakni turi bilan juftlamoqchi. Har burchakning ochilishiga qarang.",
    ask: "Chapdagi figurani tanlang, keyin uning nomini o'ngdan bosing:",
    defs: { nRt: "To'g'ri (90°)", nAc: "O'tkir (<90°)", nOb: "O'tmas (>90°)", nSt: 'Yoyilgan (180°)' },
    correct: "To'g'ri. O'tkir 90 dan kichik, o'tmas 90 dan katta, yoyilgan — tekis, 180.",
    wrong: "Har burchakni to'g'ri burchak (90°) bilan solishtiring — undan tor ochilganmi, keng ochilganmi yoki tekis chiziqmi?",
    rule: "O'tkir < 90° < o'tmas; yoyilgan = 180°.",
  },
  ru: {
    eyebrow: 'Соотнесите', setup: 'Камол хочет соединить четыре угла с их видом. Смотри на раствор каждого угла.',
    ask: 'Выберите фигуру слева, затем нажмите её название справа:',
    defs: { nRt: 'Прямой (90°)', nAc: 'Острый (<90°)', nOb: 'Тупой (>90°)', nSt: 'Развёрнутый (180°)' },
    correct: 'Верно. Острый меньше 90, тупой больше 90, развёрнутый — прямая, 180.',
    wrong: 'Сравни каждый угол с прямым (90°) — он раскрыт уже, шире или это прямая линия?',
    rule: 'Острый < 90° < тупой; развёрнутый = 180°.',
  },
};

export default function D33_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === 4;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (r) => {
    if (locked) return;
    if (usedR.has(r)) { const l = Object.keys(map).find((k) => map[k] === r); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: r })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = LEFT.every((l) => map[l] === D05_PAIRS[l]);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: D05_PAIRS, correct, meta: { tag: 'geo_angle_type', level: '🟡' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d33-open { animation: d33open .9s ease both; }
        @keyframes d33open { from { transform: rotate(var(--d33-a)); } to { transform: rotate(0deg); } }
        @media (prefers-reduced-motion: reduce) { .d33-pop, .d33-open { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {LEFT.map((l) => {
            const on = pickL === l, done = map[l];
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = CY; bg = '#ecfeff'; }
            if (done) { bd = '#67e8f9'; bg = '#f0fdff'; }
            if (checked && done) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
            return (
              <button key={l} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : l)} style={{ width: 130, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #cffafe' : 'none', padding: '4px 2px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Angle deg={FIGS[l].deg} right={FIGS[l].right} />
                {done ? <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }}>→</span> : null}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, justifyContent: 'space-between' }}>
          {RIGHT.map((r) => {
            const used = usedR.has(r);
            let bd = '#cbd5e1', bg = '#fff', col = '#374151';
            if (used) { bd = '#a78bfa'; bg = '#f5f0ff'; col = '#1f2430'; }
            if (checked && used) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
            return <button key={r} type="button" disabled={locked} onClick={() => clickR(r)} style={{ width: 150, height: 66, borderRadius: 12, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', fontSize: 14, fontWeight: 700, color: col, fontFamily: 'inherit', padding: '4px 8px' }}>{t.defs[r]}</button>;
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
