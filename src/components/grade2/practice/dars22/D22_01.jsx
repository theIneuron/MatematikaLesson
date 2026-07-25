// Dars 22 · Amaliyot 01 — mustaqil topshiriq fayli (monolitdan bo'lindi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. PracticeHost "Tekshirish" beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED (Saturn) ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', ring: '#3A4A63', rail: '#5C6B86', blu: '#7fd0ff',
};
const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];
const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d22-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
const Crystal = ({ s = 16, cls = 'd22-drop', delay = 0 }) => (
  <span className={cls} style={{ width: s, height: s, background: 'linear-gradient(160deg,#FFE79E,#FFB524)', display: 'inline-block', transform: 'rotate(45deg)', borderRadius: 3, boxShadow: '0 0 6px rgba(255,194,60,.5)', animationDelay: delay + 's' }} />
);
const Cart = ({ n = 0, w = 76, tone }) => {
  const bd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : C.ring;
  const bg = tone === 'ok' ? 'rgba(31,122,77,.22)' : tone === 'no' ? 'rgba(192,57,43,.22)' : 'rgba(255,194,60,.06)';
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: w, minHeight: 40, borderRadius: '7px 7px 3px 3px', border: '2px solid ' + bd, borderTopWidth: 0, background: bg, padding: '5px 5px 4px', display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end', justifyContent: 'center', clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0 100%)' }}>
        {Array.from({ length: n }).map((_, i) => <Crystal key={i} s={12} cls="d22-pop2" delay={i * 0.03} />)}
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
  <div className="d22-pop2" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
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

/* ============ TABLE-FILL TASK (ko'p katakli jadval to'ldirish — imzo) ============ */
// cfg: { steps:[{step,count,blanks:[{idx,val}]}], pool:[values], tag, level, T }
function TableFillTask(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit, cfg } = props || {};
  const t = cfg.T[lang] || cfg.T.uz;
  const isReview = mode === 'review';
  const allBlanks = cfg.steps.flatMap((r, ri) => r.blanks.map((b) => ({ key: ri + '-' + b.idx, val: b.val })));
  const [filled, setFilled] = useState({}); // key -> value
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.filled) { setFilled(sa.filled); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = allBlanks.every((b) => filled[b.key] != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickCell = (key) => { if (locked) return; if (pick != null) { setFilled((f) => ({ ...f, [key]: pick })); setPick(null); } else if (filled[key] != null) { setFilled((f) => { const n = { ...f }; delete n[key]; return n; }); } };
  const check = useCallback(() => {
    const correct = allBlanks.every((b) => filled[b.key] === b.val);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { filled }, correctAnswer: { map: allBlanks }, correct, meta: { tag: cfg.tag, level: cfg.level } });
  }, [filled, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cellTone = (key, val) => { if (!checked) return filled[key] != null ? 'sel' : null; if (filled[key] == null) return null; return filled[key] === val ? 'ok' : 'no'; };
  const renderRow = (r, ri) => (
    <div key={ri} style={{ display: 'grid', gridTemplateColumns: `50px repeat(${r.count}, 40px)`, gap: 4, alignItems: 'center', marginBottom: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: C.goldSoft, textAlign: 'right' }}>÷{r.step}</div>
      {Array.from({ length: r.count }).map((_, i) => <div key={'m' + i} style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: C.gold, textAlign: 'center' }}>{(i + 1) * r.step}</div>)}
      <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, textAlign: 'right' }}>=</div>
      {Array.from({ length: r.count }).map((_, i) => {
        const b = r.blanks.find((x) => x.idx === i);
        if (!b) return <div key={'q' + i} style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: C.blu, textAlign: 'center' }}>{i + 1}</div>;
        const key = ri + '-' + i, tone = cellTone(key, b.val), v = filled[key];
        const bd = tone === 'ok' ? C.ok : tone === 'no' ? C.no : (v != null ? C.acc : C.sink2);
        const cl = tone === 'ok' ? '#9df0bd' : tone === 'no' ? '#ffb4a8' : (v != null ? '#fff' : C.sink2);
        return <button key={'q' + i} type="button" disabled={locked} onClick={() => clickCell(key)} style={{ height: 38, borderRadius: 8, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: v != null ? 'rgba(255,79,40,.18)' : 'transparent', ...S.mono, fontSize: 17, fontWeight: 800, color: cl, cursor: locked ? 'default' : 'pointer' }}>{v != null ? v : ''}</button>;
      })}
    </div>
  );
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><div style={{ display: 'inline-block', width: '100%', overflowX: 'auto' }}><div style={{ display: 'inline-block', background: C.stile, border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '10px 12px', margin: '0 auto' }}>{cfg.steps.map(renderRow)}</div></div></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {cfg.pool.map((v, i) => <button key={i} type="button" disabled={locked} onClick={() => setPick(pick === v ? null : v)} style={{ width: 58, height: 54, borderRadius: 12, border: '2px solid ' + (pick === v ? C.acc : C.line), background: pick === v ? C.accSoft : C.paper, ...S.mono, fontSize: 22, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: pick === v ? '0 0 0 4px #FFE0D6' : 'none' }}>{v}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

/* =================== 01 · Teng ulash (÷4) · 🟢 · share4 =================== */
const D01_CORRECT = 0;
const D01_T = {
  uz: { eyebrow: 'Teng ulash', setup: "20 kristalni 4 vagonchaga teng ulaymiz.", ask: 'Har vagonchada nechta kristal bo‘ladi?', opts: ['5', '4', '16', '6'], correct: "To'g'ri. 20 ÷ 4 = 5. Har vagonchada 5 tadan.", wrong: "Maslahat: 20 ni 4 ga teng ulang. 20 − 4 = 16 emas — bu ayirish.", rule: "20 ÷ 4 = 5. Yordam: 4 × 5 = 20." },
  ru: { eyebrow: 'Поровну', setup: '20 кристаллов делим в 4 вагонетки поровну.', ask: 'Сколько кристаллов в каждой вагонетке?', opts: ['5', '4', '16', '6'], correct: 'Верно. 20 ÷ 4 = 5. В каждой по 5.', wrong: 'Подсказка: раздели 20 на 4 поровну. 20 − 4 = 16 — вычитание.', rule: '20 ÷ 4 = 5. Подсказка: 4 × 5 = 20.' },
};
function D22_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz; const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); const [fb, setFb] = useState(null); const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => { const correct = picked === D01_CORRECT; setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.(); onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: '5' }, correct, meta: { tag: 'share4', level: '🟢' } }); }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div><p style={S.setup}>{t.setup}</p>
      <Stage><div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap' }}>{[5, 5, 5, 5].map((n, i) => <Cart key={i} n={n} w={58} />)}</div></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>{t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, D01_CORRECT, checked, isReview, { half: true, center: true, mono: true, fs: 22 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}{checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
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
        .d22-pop2 { animation: d22pop2 .4s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d22pop2 { 0% { opacity: 0; transform: scale(.3); } 100% { opacity: 1; transform: scale(1); } }
        .d22-star { opacity: .35; animation: d22tw 3.2s ease-in-out infinite; }
        @keyframes d22tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d22-drop { animation: d22drop .5s cubic-bezier(.34,1.56,.64,1) both, d22shine 3.4s ease-in-out infinite; }
        @keyframes d22drop { 0% { opacity: 0; transform: rotate(45deg) translateY(-6px) scale(.4); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d22shine { 0%, 100% { box-shadow: 0 0 5px rgba(255,194,60,.45); } 50% { box-shadow: 0 0 11px rgba(255,214,115,.95); } }
        .d22-float { animation: d22float 3s ease-in-out infinite; }
        @keyframes d22float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d22-pulse { animation: d22pulse 1.5s ease-in-out infinite; }
        @keyframes d22pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `;
export default function Task_22_01(props) {
  return (
    <React.Fragment>
      <style>{__FX_CSS}</style>
      <D22_01 {...props} />
    </React.Fragment>
  );
}
