// Dars35 · Amaliyot 05 — Yuzalarni moslash · 🔴 · tag: area_match
// Uch to'rtburchakning PERIMETRI bir xil (16 m), lekin YUZASI har xil: 6×2=12, 5×3=15, 4×4=16.
// Perimetr/o'lcham bilan ayirib bo'lmaydi — har birini hisoblab yuzasiga ulash kerak (moslashtirish, all-or-nothing).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: rose
const C = { dark: '#be123c', lt: '#fff1f2', mid: '#fecdd3', tile: '#fda4af', tileLn: '#f43f5e', floor: '#fff6f7', floorLn: '#fda4af' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.lt, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d35-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.lt, border: '1.5px solid ' + C.mid, color: C.dark }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Kichik to'rtburchak (perimetri bir xil, o'lchami har xil) — javobni oshkor qilmaydi
function MiniRect({ a, b, on, state }) {
  const u = 7, w = a * u, h = b * u, W = 58, H = 50;
  const x = (W - w) / 2, y = (H - h) / 2;
  let fill = C.tile, stroke = C.tileLn;
  if (state === 'ok') { fill = '#bbf7d0'; stroke = '#1a7f43'; }
  else if (state === 'no') { fill = '#fecaca'; stroke = '#c0392b'; }
  else if (on) { fill = C.mid; stroke = C.dark; }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={fill} stroke={stroke} strokeWidth="1.8" />
    </svg>
  );
}

const FIGS = [
  { id: 'a', a: 6, b: 2, area: 12 },
  { id: 'b', a: 5, b: 3, area: 15 },
  { id: 'c', a: 4, b: 4, area: 16 },
];
const RIGHT_ORDER = [16, 12, 15]; // aralashtirilgan ko'rsatilish

const D05_T = {
  uz: {
    eyebrow: 'Yuzalarni moslang',
    setup: "Uch maydonchaning perimetri bir xil — 16 m, lekin yuzalari har xil.",
    ask: "Chapdan to'rtburchakni tanlang, keyin o'ngdan yuzasini bosing:",
    correct: "To'g'ri. Perimetr bir xil bo'lsa ham yuza har xil: 6 × 2 = 12, 5 × 3 = 15, 4 × 4 = 16.",
    wrong: "Perimetr hammada bir xil — u yuzalarni ajratmaydi. Har bir to'rtburchak ichiga nechta birlik katak sig'adi? Shuni o'ylab moslang.",
    rule: "Bir xil perimetr — har xil yuza. Yuza = a × b.",
  },
  ru: {
    eyebrow: 'Соотнесите площади',
    setup: 'У трёх площадок одинаковый периметр — 16 м, но площади разные.',
    ask: 'Выберите прямоугольник слева, затем нажмите его площадь справа:',
    correct: 'Верно. При одинаковом периметре площади разные: 6 × 2 = 12, 5 × 3 = 15, 4 × 4 = 16.',
    wrong: 'Периметр у всех одинаков — он не различает площади. Сколько единичных квадратов помещается внутри каждого? Соотнеси по этому.',
    rule: 'Одинаковый периметр — разные площади. Площадь = a × b.',
  },
};

export default function D35_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pickL, setPickL] = useState(null);
  const [map, setMap] = useState({});
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const usedR = new Set(Object.values(map));
  const full = Object.keys(map).length === FIGS.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const clickR = (v) => {
    if (locked) return;
    if (usedR.has(v)) { const l = Object.keys(map).find((k) => map[k] === v); setMap((m) => { const n = { ...m }; delete n[l]; return n; }); return; }
    if (pickL) { setMap((m) => ({ ...m, [pickL]: v })); setPickL(null); }
  };
  const check = useCallback(() => {
    const correct = FIGS.every((f) => map[f.id] === f.area);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    const pairs = {}; FIGS.forEach((f) => (pairs[f.id] = f.area));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: pairs, correct, meta: { tag: 'area_match', level: '🔴' } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d35-pop { animation: d35pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d35pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d35-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FIGS.map((f) => {
            const on = pickL === f.id, done = map[f.id] != null;
            const state = checked && done ? (fb?.correct ? 'ok' : 'no') : null;
            let bd = '#cbd5e1', bg = '#fff';
            if (on) { bd = C.dark; bg = C.lt; }
            if (done) { bd = C.tileLn; bg = C.floor; }
            if (state === 'ok') { bd = '#1a7f43'; bg = '#e8f7ee'; }
            if (state === 'no') { bd = '#c0392b'; bg = '#fdecec'; }
            return (
              <button key={f.id} type="button" disabled={locked} onClick={() => !done && setPickL(on ? null : f.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: 150, padding: '6px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: locked || done ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px ' + C.mid : 'none' }}>
                <MiniRect a={f.a} b={f.b} on={on} state={state} />
                <span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#1f2430' }}>{f.a} × {f.b}</span>
                {done ? <span style={{ marginLeft: 'auto', fontSize: 16, color: '#94a3b8' }}>→</span> : null}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          {RIGHT_ORDER.map((v) => {
            const used = usedR.has(v);
            const state = checked && used ? (fb?.correct ? 'ok' : 'no') : null;
            let bd = '#cbd5e1', bg = '#fff';
            if (used) { bd = C.tileLn; bg = C.floor; }
            if (state === 'ok') { bd = '#1a7f43'; bg = '#e8f7ee'; }
            if (state === 'no') { bd = '#c0392b'; bg = '#fdecec'; }
            return (
              <button key={v} type="button" disabled={locked} onClick={() => clickR(v)}
                style={{ minWidth: 96, height: 52, padding: '0 14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 20, fontWeight: 800, color: '#1f2430' }}>{v} m²</button>
            );
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
