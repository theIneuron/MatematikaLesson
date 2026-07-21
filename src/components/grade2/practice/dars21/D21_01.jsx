// Dars 21 · Amaliyot 01 — mustaqil topshiriq fayli (monolitdan bo'lindi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. PracticeHost "Tekshirish" beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Saturn) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', ring: '#3A4A63', rail: '#5C6B86',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d21-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const Crystal = ({ s = 16, cls = 'd21-drop', delay = 0 }) => (
  <span className={cls} style={{ width: s, height: s, background: 'linear-gradient(160deg,#FFE79E,#FFB524)', display: 'inline-block', transform: 'rotate(45deg)', borderRadius: 3, boxShadow: '0 0 6px rgba(255,194,60,.5)', animationDelay: delay + 's' }} />
);
// VAGONCHA (kon aravasi) — n ta kristal ko'rinadi
const Cart = ({ n = 0, w = 76, tone }) => {
  const bd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : '#9fb4dc';
  const bg = tone === 'ok' ? 'rgba(31,122,77,.22)' : tone === 'no' ? 'rgba(192,57,43,.22)' : 'rgba(159,180,220,.16)';
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: w, minHeight: 40, borderRadius: '7px 7px 3px 3px', border: '2px solid ' + bd, borderTopWidth: 0, background: bg, padding: '5px 5px 4px', display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end', justifyContent: 'center', clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)' }}>
        {Array.from({ length: n }).map((_, i) => <Crystal key={i} s={13} cls="d21-pop2" delay={i * 0.03} />)}
      </div>
      <div style={{ display: 'flex', gap: w - 34, marginTop: 1 }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#2A3A5A', border: '2px solid ' + C.rail }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#2A3A5A', border: '2px solid ' + C.rail }} />
      </div>
    </div>
  );
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);
const IconRetry = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d21-pop2" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
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
function NumPad({ value, setValue, disabled, max = 2, tone = 'idle' }) {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  const keyStyle = { width: 62, height: 56, borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, ...S.mono, fontSize: 24, fontWeight: 800, color: C.ink, cursor: disabled ? 'default' : 'pointer' };
  const dBd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.acc;
  const dBg = tone === 'ok' ? C.okSoft : tone === 'no' ? C.noSoft : C.paper;
  const dCol = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.ink;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 150, height: 62, borderRadius: 14, border: '2px solid ' + dBd, background: dBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 30, fontWeight: 800, color: dCol, letterSpacing: 3 }}>{value || '–'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 62px)', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (<button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={keyStyle}>{d}</button>))}
        <span />
        <button type="button" disabled={disabled} onClick={() => push('0')} style={keyStyle}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...keyStyle, fontSize: 20, color: C.no }}>⌫</button>
      </div>
    </div>
  );
}
// SON O'QI — 0..max, step bo'yicha belgilar; bitta orqaga sakrash ko'rsatiladi (javobni ochmaydi)
const NumberLine = ({ max, step }) => {
  const n = max / step; const W = Math.max(260, n * 46 + 40); const H = 74;
  const xs = (i) => 20 + i * (W - 40) / n;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, display: 'block', margin: '0 auto' }} aria-hidden="true">
      <line x1={20} y1={48} x2={W - 20} y2={48} stroke={C.sink2} strokeWidth="2.5" />
      {Array.from({ length: n + 1 }).map((_, i) => {
        const val = i * step, x = xs(i);
        return (
          <g key={i}>
            <line x1={x} y1={42} x2={x} y2={54} stroke={C.sink2} strokeWidth="2.5" />
            <text x={x} y={68} fill={C.sink} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="monospace">{val}</text>
            {i === n && <g className="d21-float"><rect x={x - 7} y={22} width={14} height={14} rx={2} transform={`rotate(45 ${x} 29)`} fill="url(#d21cg)" /></g>}
          </g>
        );
      })}
      <defs><linearGradient id="d21cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFE79E" /><stop offset="100%" stopColor="#FFB524" /></linearGradient></defs>
      {n >= 1 && (<g>
        <path d={`M ${xs(n)} 40 Q ${(xs(n) + xs(n - 1)) / 2} 18 ${xs(n - 1)} 40`} fill="none" stroke={C.acc} strokeWidth="2.5" />
        <text x={(xs(n) + xs(n - 1)) / 2} y={14} fill={C.acc} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="monospace">{step}</text>
      </g>)}
    </svg>
  );
};
// BO'LISH JADVALI QATORI: yuqorida ko'paytmalar, pastda bo'linma; bitta katak bo'sh
// Har ustunda "N:step" (bo'linish) → pastga strelka → bo'linma (javob). Bittasi bo'sh.
const TableRow = ({ step, count, blankIdx, filled, tone }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', background: C.stile, border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '10px 12px' }}>
    {Array.from({ length: count }).map((_, i) => {
      const isBlank = i === blankIdx;
      const bd = isBlank ? (tone === 'ok' ? C.ok : tone === 'no' ? C.no : (filled != null ? C.acc : C.sink2)) : C.stageBd;
      const cl = isBlank ? (tone === 'ok' ? '#9df0bd' : tone === 'no' ? '#ffb4a8' : (filled != null ? '#fff' : C.sink2)) : '#7fd0ff';
      return (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: C.gold }}>{(i + 1) * step}:{step}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.acc, lineHeight: 1 }}>↓</div>
          {isBlank
            ? <div style={{ width: 40, height: 34, borderRadius: 8, border: '2px ' + (filled != null ? 'solid' : 'dashed') + ' ' + bd, background: filled != null ? 'rgba(255,79,40,.18)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 18, fontWeight: 800, color: cl }}>{filled != null ? filled : ''}</div>
            : <div style={{ width: 40, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 18, fontWeight: 800, color: cl }}>{i + 1}</div>}
        </div>
      );
    })}
  </div>
);

/* =================== 01 · Son o'qi (÷2) · 🟢 · nline2 =================== */
const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Son o‘qi', setup: "12 kristal. Har vagonchaga 2 tadan solamiz.",
    ask: '12 dan 0 gacha 2 tadan orqaga sakraymiz. Nechta sakrash bo‘ladi?',
    opts: ['6', '10', '4', '5'],
    correct: "To'g'ri. 12 dan 2 talab 6 marta sakraladi: 12 ÷ 2 = 6.",
    wrong: "Maslahat: har sakrash 2 ta orqaga. 12, 10, 8, 6, 4, 2, 0 — sakrashlarni sanang.",
    rule: "Orqaga 2 talik sakrashlar soni = 12 ÷ 2 = 6.",
  },
  ru: {
    eyebrow: 'Числовая ось', setup: '12 кристаллов. В каждую вагонетку по 2.',
    ask: 'Прыгаем назад от 12 к 0 по 2. Сколько прыжков?',
    opts: ['6', '10', '4', '5'],
    correct: 'Верно. От 12 по 2 — 6 прыжков: 12 ÷ 2 = 6.',
    wrong: 'Подсказка: каждый прыжок 2 назад. 12, 10, 8, 6, 4, 2, 0 — считай прыжки.',
    rule: 'Число прыжков назад по 2 = 12 ÷ 2 = 6.',
  },
};
function D21_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); const [fb, setFb] = useState(null); const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: '6' }, correct, meta: { tag: 'nline2', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><NumberLine max={12} step={2} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, D01_CORRECT, checked, isReview, { half: true, center: true, mono: true, fs: 22 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

const __FX_CSS = `
        .tabs { display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px; border-bottom: 1px solid #eef0f4; }
        .tabs::-webkit-scrollbar { display: none; }
        .tab { flex: 0 0 auto; padding: 7px 11px; border-radius: 999px; font-size: 12.5px; font-weight: 700; white-space: nowrap; cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; min-height: 34px; }
        .tab.on { border-color: #0E0E10; background: #0E0E10; color: #fff; }
        .tab.ok { border-color: #1F7A4D; color: #1F7A4D; }
        .tab.on.ok { background: #1F7A4D; border-color: #1F7A4D; color: #fff; }
        .d21-pop2 { animation: d21pop2 .4s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d21pop2 { 0% { opacity: 0; transform: scale(.3); } 100% { opacity: 1; transform: scale(1); } }
        .d21-star { opacity: .35; animation: d21tw 3.2s ease-in-out infinite; }
        @keyframes d21tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d21-drop { animation: d21drop .5s cubic-bezier(.34,1.56,.64,1) both, d21shine 3.4s ease-in-out infinite; }
        @keyframes d21drop { 0% { opacity: 0; transform: rotate(45deg) translateY(-6px) scale(.4); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d21shine { 0%, 100% { box-shadow: 0 0 5px rgba(255,194,60,.45); } 50% { box-shadow: 0 0 11px rgba(255,214,115,.95); } }
        .d21-float { animation: d21float 3s ease-in-out infinite; }
        @keyframes d21float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d21-pulse { animation: d21pulse 1.5s ease-in-out infinite; }
        @keyframes d21pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `;
export default function Task_21_01(props) {
  return (
    <React.Fragment>
      <style>{__FX_CSS}</style>
      <D21_01 {...props} />
    </React.Fragment>
  );
}
