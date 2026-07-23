// Dars 7 (3-sinf) · Amaliyot 02 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 5-bet 2/4-mashqlar — 140+440, 780−650, 920−410.
// Mexanika: moslash — misol ↔ javob. Hammasi-yoki-hech.
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
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 02 · Moslashtiring (misol ↔ javob) · 🟢 · match_calc =================== */
const D03_TAG = 'match_calc', D03_LEVEL = '🟢';
const D03_NUMS = ['140 + 440', '780 − 650', '920 − 410'];
const D03_EXP = { '140 + 440': '580', '780 − 650': '130', '920 − 410': '510' };
const D03_T = {
  uz: {
    eyebrow: 'Moslashtiring', setup: "Har misolni o'z javobiga ulang. Yumaloq o'nliklar bilan hisoblash oson!",
    ask: "Misolni bosing, keyin uning javobini bosing.",
    correct: "To'g'ri! 140 + 440 = 580, 780 − 650 = 130, 920 − 410 = 510.",
    wrong: "Maslahat: har misolni xonama-xona hisoblang: avval yuzliklar, keyin o'nliklar. Yumaloq sonlarda birliklar nol.",
    rule: "Yumaloq sonlarni xonama-xona qo'shish/ayirish oson: 140 + 440 = 580.",
  },
  ru: {
    eyebrow: 'Соедини пары', setup: 'Соедини каждый пример с его ответом. С круглыми десятками считать легко!',
    ask: 'Нажми пример, потом его ответ.',
    correct: 'Верно! 140 + 440 = 580, 780 − 650 = 130, 920 − 410 = 510.',
    wrong: 'Подсказка: считай каждый пример поразрядно: сначала сотни, потом десятки. У круглых чисел единицы — ноль.',
    rule: 'Круглые числа складывать и вычитать легко поразрядно: 140 + 440 = 580.',
  },
};
const D03_RIGHT_ORDER = permFromSeed(3, D03_TAG);
function D07_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const exps = D03_NUMS.map((n) => D03_EXP[n]);
  const [map, setMap] = useState({});
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = Object.keys(map).length === D03_NUMS.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = D03_NUMS.every((_, li) => map[li] === li);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: { map: Object.fromEntries(D03_NUMS.map((_, i) => [i, i])) }, correct, meta: { tag: D03_TAG, level: D03_LEVEL } });
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
  const leftStyle = (li) => ({
    minWidth: 96, padding: '12px 14px', borderRadius: 13, fontWeight: 800, ...S.mono, fontSize: 24,
    border: '2px solid ' + (sel === li ? C.acc : map[li] != null ? C.ribbonBd : C.line),
    background: sel === li ? C.accSoft : map[li] != null ? '#152342' : C.paper,
    color: map[li] != null ? C.glow : C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: ring(li),
  });
  const rightStyle = (ri) => ({
    flex: 1, minHeight: 54, padding: '10px 12px', borderRadius: 13, fontWeight: 800, fontSize: 18, textAlign: 'center', ...S.mono,
    border: '2px solid ' + (usedRight.has(ri) ? C.ribbonBd : C.line),
    background: usedRight.has(ri) ? '#EFE7F5' : C.paper, color: '#374151',
    cursor: (locked || sel == null) ? 'default' : 'pointer', opacity: usedRight.has(ri) && sel != null ? 0.7 : 1,
  });
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '12px 0' }}>
        {D03_NUMS.map((num, li) => (
          <div key={num} style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            <button type="button" style={leftStyle(li)} disabled={locked} onClick={() => pickLeft(li)}>{num}</button>
            <div style={{ display: 'flex', alignItems: 'center', color: C.ink3, fontWeight: 800 }}>→</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px', borderRadius: 13, border: '2px dashed ' + (map[li] != null ? C.ribbonBd : C.line), background: map[li] != null ? '#F6F1FA' : '#fbfaf7', fontWeight: 800, fontSize: 18, ...S.mono, color: map[li] != null ? C.ink : C.ink3 }}>
              {map[li] != null ? exps[map[li]] : '...'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {D03_RIGHT_ORDER.map((ri) => (
          <button key={ri} type="button" style={rightStyle(ri)} disabled={locked} onClick={() => pickRight(ri)}>{exps[ri]}</button>
        ))}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D07_02(props) {
  return (<><style>{FX_CSS}</style><D07_02Impl {...props} /></>);
}
