// Dars 2 (3-sinf) · Amaliyot 03 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi sonlari — 680 (4-bet, kitob do'koni), 430 (4-bet, gul do'koni), 903 (4-bet, 4-mashq).
// Mexanika: moslash (grade2 D01_07 naqshi) — sonni bos, o'qilishini bos. Hammasi-yoki-hech.
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
  <div className="g3d2-pop" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 16, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="g3d2-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function _hash(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function permFromSeed(n, seedStr) { const a = Array.from({ length: n }, (_, i) => i); let s = (_hash(seedStr) || 1) >>> 0; for (let i = n - 1; i > 0; i--) { s = (Math.imul(s, 1103515245) + 12345) >>> 0; const j = s % (i + 1); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

const FX_CSS = `.g3d2-pop { animation: g3d2pop .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d2pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 03 · Moslashtiring · 🟢 · match_read =================== */
// Chap: sonlar. O'ng: o'qilishlari (seeded aralash). picked-left -> tap-right juftlaydi.
const D03_TAG = 'match_read', D03_LEVEL = '🟢';
const D03_NUMS = ['680', '430', '903'];
const D03_T = {
  uz: {
    eyebrow: 'Moslashtiring', setup: "Do'kon displeylarida sonlar, kartochkalarda esa o'qilishlari. Har sonni o'z o'qilishiga ulang.",
    ask: "Sonni bosing, keyin mos o'qilishini bosing.",
    words: { '680': 'olti yuz sakson', '430': "to'rt yuz o'ttiz", '903': "to'qqiz yuz uch" },
    correct: "To'g'ri! 680 — olti yuz sakson, 430 — to'rt yuz o'ttiz, 903 — to'qqiz yuz uch.",
    wrong: "Maslahat: har sonni razryadlab o'qing: avval yuzligi, keyin o'nligi, oxirida birligi. Nol o'qilmaydi, lekin joyni saqlaydi.",
    rule: "O'qishda nol tushib qolmasin: 903 — to'qqiz yuz uch (o'nlik yo'q).",
  },
  ru: {
    eyebrow: 'Соедини пары', setup: 'На дисплеях магазинов — числа, на карточках — их чтение. Соедини каждое число с его чтением.',
    ask: 'Нажми число, потом его чтение.',
    words: { '680': 'шестьсот восемьдесят', '430': 'четыреста тридцать', '903': 'девятьсот три' },
    correct: 'Верно! 680 — шестьсот восемьдесят, 430 — четыреста тридцать, 903 — девятьсот три.',
    wrong: 'Подсказка: читай каждое число по разрядам: сначала сотни, потом десятки, в конце единицы. Ноль не читается, но сохраняет место.',
    rule: 'При чтении ноль не должен теряться: 903 — девятьсот три (десятков нет).',
  },
};
const D03_RIGHT_ORDER = permFromSeed(3, D03_TAG);
function D02_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const words = D03_NUMS.map((n) => t.words[n]); // asl indeks = D03_NUMS indeksi
  const [map, setMap] = useState({});   // { leftIdx: rightIdx }
  const [sel, setSel] = useState(null); // tanlangan chap indeks
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.map) { setMap(sa.map); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = Object.keys(map).length === D03_NUMS.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = D03_NUMS.every((_, li) => map[li] === li); // to'g'ri juft: chap i <-> o'ng i (asl indeks)
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { map }, correctAnswer: { map: Object.fromEntries(D03_NUMS.map((_, i) => [i, i])) }, correct, meta: { tag: D03_TAG, level: D03_LEVEL } });
  }, [map, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const usedRight = new Set(Object.values(map));
  const pickLeft = (li) => { if (locked) return; if (map[li] != null) { setMap((m) => { const n = { ...m }; delete n[li]; return n; }); setSel(null); return; } setSel(sel === li ? null : li); };
  const pickRight = (ri) => {
    if (locked || sel == null) return;
    setMap((m) => {
      const n = { ...m };
      for (const k of Object.keys(n)) if (n[k] === ri) delete n[k]; // band bo'lsa bo'shatamiz
      n[sel] = ri; return n;
    });
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
    flex: 1, minHeight: 54, padding: '10px 12px', borderRadius: 13, fontWeight: 700, fontSize: 16, textAlign: 'left',
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
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: 13, border: '2px dashed ' + (map[li] != null ? C.ribbonBd : C.line), background: map[li] != null ? '#F6F1FA' : '#fbfaf7', fontWeight: 700, fontSize: 16, color: map[li] != null ? C.ink : C.ink3 }}>
              {map[li] != null ? words[map[li]] : '...'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {D03_RIGHT_ORDER.map((ri) => (
          <button key={ri} type="button" style={rightStyle(ri)} disabled={locked} onClick={() => pickRight(ri)}>{words[ri]}</button>
        ))}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_03(props) {
  return (<><style>{FX_CSS}</style><D02_03Impl {...props} /></>);
}
