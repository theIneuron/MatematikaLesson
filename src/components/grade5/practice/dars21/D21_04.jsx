// Dars21 · Amaliyot 04 — Moslang · 🟢 · tag: match_pic_num
// 3 ta rasmni 3 ta songa moslash: 3/5 (to'g'ri), 7/6 (noto'g'ri), 2 va 1/3 (aralash).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d21-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const Mixed = ({ w, n, d, size = 18, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle' }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 5, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);
function Bar({ parts, shaded, color = '#93c5fd', w = 70, h = 26 }) {
  const cw = w / parts;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="1" y="1" width={Math.max(0, (w * shaded) / parts - 1)} height={h - 2} rx="4" fill={color} />
      {Array.from({ length: parts - 1 }).map((_, i) => <line key={i} x1={(i + 1) * cw} y1="1" x2={(i + 1) * cw} y2={h - 1} stroke="#fff" strokeWidth="2" />)}
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}
const PicViz = ({ id }) => {
  if (id === 'p1') return <Bar parts={5} shaded={3} color="#93c5fd" />;
  if (id === 'p2') return <div style={{ display: 'flex', gap: 5 }}><Bar parts={6} shaded={6} color="#a855f7" /><Bar parts={6} shaded={1} color="#a855f7" /></div>;
  return <div style={{ display: 'flex', gap: 5 }}><Bar parts={3} shaded={3} color="#f59e0b" /><Bar parts={3} shaded={3} color="#f59e0b" /><Bar parts={3} shaded={1} color="#fcd34d" /></div>;
};

const D04_PICS = [
  { id: 'p1', ans: 'c1' },
  { id: 'p2', ans: 'c2' },
  { id: 'p3', ans: 'c3' },
];
const D04_CHIPS = [ // ko'rsatilish tartibi rasmga mos kelmaydi
  { id: 'c2', frac: [7, 6] },
  { id: 'c3', mix: [2, 1, 3] },
  { id: 'c1', frac: [3, 5] },
];
const chipViz = (c, color) => c.mix ? <Mixed w={c.mix[0]} n={c.mix[1]} d={c.mix[2]} size={17} color={color} /> : <Frac num={c.frac[0]} den={c.frac[1]} size={18} color={color} />;
const D04_T = {
  uz: {
    eyebrow: 'Moslang', setup: "Malika uchta rasm chizdi va yoniga uchta son yozdi, lekin qaysi son qaysi rasmga tegishli ekanini belgilamadi.",
    ask: 'Har bir rasmni mos son bilan moslang:',
    slot: 'son',
    correct: "To'g'ri. Birinchi rasm — 3/5 (to'g'ri kasr), ikkinchisi — 7/6 (noto'g'ri kasr), uchinchisi — 2 va 1/3 (aralash son).",
    wrong: "Har bir rasmda nechta shakl to'la bo'yalgan va yana qancha bo'lak qolganini sanang.",
    rule: "Rasmni songa aylantirish: to'la bo'yalganlar butun qism, qolgan bo'laklar kasr qism.",
  },
  ru: {
    eyebrow: 'Сопоставьте', setup: 'Малика нарисовала три рисунка и рядом записала три числа, но не отметила, какое число к какому рисунку относится.',
    ask: 'Сопоставь каждый рисунок с числом:',
    slot: 'число',
    correct: 'Верно. Первый рисунок — 3/5 (правильная дробь), второй — 7/6 (неправильная), третий — 2 и 1/3 (смешанное число).',
    wrong: 'В каждом рисунке сосчитай, сколько фигур закрашено полностью и сколько частей осталось.',
    rule: 'Как превратить рисунок в число: полностью закрашенные — целая часть, остальные части — дробная.',
  },
};

export default function D21_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null); // tanlangan chip id
  const [place, setPlace] = useState({}); // picId -> chipId
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = D04_PICS.every((p) => place[p.id]);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedChip = (cid) => Object.values(place).includes(cid);
  const assign = (picId) => { if (locked || !sel) return; setPlace((m) => { const n = { ...m }; Object.keys(n).forEach((k) => { if (n[k] === sel) delete n[k]; }); n[picId] = sel; return n; }); setSel(null); };
  const clearPic = (picId) => { if (locked) return; setPlace((m) => { const n = { ...m }; delete n[picId]; return n; }); };
  const check = useCallback(() => {
    const correct = D04_PICS.every((p) => place[p.id] === p.ans);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: Object.fromEntries(D04_PICS.map((p) => [p.id, p.ans])), correct, meta: { tag: 'match_pic_num', level: '🟢' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const chipById = (id) => D04_CHIPS.find((c) => c.id === id);
  return (
    <div style={S.wrap}>
      <style>{`
        .d21-pop { animation: d21pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d21pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d21-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      {/* son chiplari */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', minHeight: 46, padding: '2px 0 12px' }}>
        {D04_CHIPS.map((c) => {
          const used = usedChip(c.id);
          if (used) return null;
          const on = sel === c.id;
          return <button key={c.id} type="button" disabled={locked} onClick={() => setSel(on ? null : c.id)} style={{ minWidth: 58, height: 44, borderRadius: 11, border: '2px solid ' + (on ? '#2563eb' : '#cbd5e1'), background: on ? '#eff6ff' : '#fff', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}>{chipViz(c, '#1f2430')}</button>;
        })}
        {full && <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700, alignSelf: 'center' }}>{lang === 'uz' ? 'Barcha sonlar joylandi' : 'Все числа размещены'}</span>}
      </div>
      {/* rasm qatorlari */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {D04_PICS.map((p) => {
          const cid = place[p.id];
          const c = cid ? chipById(cid) : null;
          const ok = checked && cid ? (fb?.correct === true) : null; // to'liq to'g'ri bo'lmasa — barcha moslangan slot qizil
          const slotBd = ok === true ? '#1a7f43' : ok === false ? '#c0392b' : (sel ? '#2563eb' : '#d6dae3');
          const slotBg = ok === true ? '#e8f7ee' : ok === false ? '#fdecec' : (sel ? '#f5f9ff' : '#fbfcfe');
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 14, border: '1.5px solid #eef0f4', background: '#fff' }}>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><PicViz id={p.id} /></div>
              <div onClick={() => (c ? clearPic(p.id) : assign(p.id))} style={{ width: 78, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: '2px dashed ' + slotBd, background: slotBg, cursor: (locked ? 'default' : (c || sel) ? 'pointer' : 'default') }}>
                {c ? chipViz(c, '#1f2430') : <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{t.slot}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
