// Dars 1 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d01-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

// o'nlik = KASSETA (10-slotli magazin, LED bilan) · birlik = BATAREYA (sanoat elementi)
// — etalon Dars01_2.jsx dagi BatterySvg / CassetteSvg dan aynan ko'chirildi.
const Battery = ({ s = 20, delay = 0, anim = true }) => (
  <svg className={anim ? 'd01-drop' : undefined} width={s * 0.66} height={s} viewBox="0 0 22 34" aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.28))', animationDelay: delay + 's' }}>
    <defs>
      <linearGradient id="d2batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96" /><stop offset="22%" stopColor="#43B6E0" /><stop offset="50%" stopColor="#8FE0F4" /><stop offset="74%" stopColor="#2FA0CC" /><stop offset="100%" stopColor="#0A5876" /></linearGradient>
      <linearGradient id="d2battcap" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8FA0AE" /><stop offset="35%" stopColor="#EEF3F7" /><stop offset="65%" stopColor="#C6D2DB" /><stop offset="100%" stopColor="#7E93A2" /></linearGradient>
      <linearGradient id="d2battband" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B23A26" /><stop offset="30%" stopColor="#FF7A5E" /><stop offset="100%" stopColor="#C7401F" /></linearGradient>
    </defs>
    <rect x="8" y="0.6" width="6" height="3.6" rx="1.5" fill="url(#d2battcap)" stroke="#6E828F" strokeWidth="0.6" />
    <rect x="9.4" y="0.2" width="3.2" height="1.4" rx="0.7" fill="#F4F8FA" />
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="url(#d2batt)" stroke="#093F55" strokeWidth="1" />
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
    <rect x="1.4" y="12.5" width="19.2" height="9" fill="url(#d2battband)" opacity="0.95" />
    <path d="M12.6 14 L8.8 20.4 L11.2 20.4 L9.8 25.6 L14.4 18.4 L11.8 18.4 Z" fill="#FFE9A6" stroke="#D89A18" strokeWidth="0.4" />
    <rect x="3.4" y="6" width="2.4" height="25" rx="1.2" fill="rgba(255,255,255,0.4)" />
    <rect x="16.4" y="6" width="1.4" height="25" rx="0.7" fill="rgba(0,0,0,0.18)" />
  </svg>
);

const Cassette = ({ s = 26, delay = 0, anim = true, lit = true }) => (
  <svg className={anim ? 'd01-drop' : undefined} width={s} height={s * 66 / 48} viewBox="0 0 48 66" aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.3))', animationDelay: delay + 's' }}>
    <defs>
      <linearGradient id="d2cass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5E82" /><stop offset="24%" stopColor="#7385AB" /><stop offset="52%" stopColor="#8C9EC4" /><stop offset="76%" stopColor="#63739A" /><stop offset="100%" stopColor="#4E5E82" /></linearGradient>
      <linearGradient id="d2batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96" /><stop offset="22%" stopColor="#43B6E0" /><stop offset="50%" stopColor="#8FE0F4" /><stop offset="74%" stopColor="#2FA0CC" /><stop offset="100%" stopColor="#0A5876" /></linearGradient>
    </defs>
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#d2cass)" stroke="#33415F" strokeWidth="1.4" />
    <rect x="1" y="4" width="46" height="61" rx="7" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
    <g fill="rgba(0,0,0,0.22)"><rect x="3.4" y="18" width="2" height="30" rx="1" /><rect x="42.6" y="18" width="2" height="30" rx="1" /></g>
    <g fill="#8494AE"><circle cx="6" cy="9.5" r="1.3" /><circle cx="42" cy="9.5" r="1.3" /><circle cx="6" cy="60" r="1.3" /><circle cx="42" cy="60" r="1.3" /></g>
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" stroke="#2A3550" strokeWidth="0.6" />
    <circle cx="24" cy="9.2" r="2" fill={lit ? '#6EF29B' : '#3A4A66'} stroke="#10182A" strokeWidth="0.6" />
    {lit && <circle cx="24" cy="9.2" r="4.4" fill="rgba(110,242,155,0.4)" />}
    {Array.from({ length: 10 }).map((_, i) => {
      const col = i % 2; const row = Math.floor(i / 2);
      return (
        <g key={i} transform={`translate(${6.5 + col * 19.5} ${16 + row * 9.4})`}>
          <rect x="0" y="0" width="15" height="7.4" rx="2.4" fill="#33415F" stroke="#5A6B8840" strokeWidth="0.5" />
          <rect x="1" y="1" width="13" height="5.4" rx="1.8" fill="url(#d2batt)" stroke="#093F55" strokeWidth="0.4" />
          <rect x="1.8" y="1.6" width="11.4" height="1.5" rx="0.7" fill="rgba(255,255,255,0.3)" />
        </g>
      );
    })}
  </svg>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d01-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d01-pop { animation: d01pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-star { opacity: .35; animation: d01tw 3.2s ease-in-out infinite; }
        @keyframes d01tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d01-drop { animation: d01drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-float { animation: d01float 3s ease-in-out infinite; }
        @keyframes d01float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d01-pulse { animation: d01pulse 1.5s ease-in-out infinite; }
        @keyframes d01pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D04_ITEMS = [{ type: 'ten' }, { type: 'one' }, { type: 'ten' }, { type: 'one' }, { type: 'ten' }, { type: 'one' }, { type: 'one' }];
const D04_T = {
  uz: {
    eyebrow: 'Turiga ajrating', setup: "Elementlar aralashib ketgan.",
    ask: 'Har elementni turiga qarab joylang: kasseta → O‘nlik, batareya → Birlik.',
    bin0: "O'nlik savati", bin1: 'Birlik savati',
    correct: "To'g'ri. Kassetalar — o'nlik, batareyalar — birlik. Har xil razryad!",
    wrong: "Maslahat: kasseta (magazin) — o'nlik (10), yakka batareya — birlik (1).",
    rule: "O'nlik va birlik — har xil razryad. Kasseta = 10, batareya = 1.",
  },
  ru: {
    eyebrow: 'Разбери по виду', setup: 'Элементы перемешались.',
    ask: 'Помести каждый элемент по виду: кассета → Десятки, батарейка → Единицы.',
    bin0: 'Корзина десятков', bin1: 'Корзина единиц',
    correct: 'Верно. Кассеты — десятки, батарейки — единицы. Разные разряды!',
    wrong: 'Подсказка: кассета (магазин) — десяток (10), одиночная батарейка — единица (1).',
    rule: 'Десятки и единицы — разные разряды. Кассета = 10, батарейка = 1.',
  },
};
function D01_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [place, setPlace] = useState(D04_ITEMS.map(() => null));
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = place.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const drop = (bin) => { if (locked || pick == null) return; setPlace((p) => { const n = p.slice(); n[pick] = bin; return n; }); setPick(null); };
  const check = useCallback(() => {
    const correct = place.every((v, i) => v === (D04_ITEMS[i].type === 'ten' ? 0 : 1));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: { bins: D04_ITEMS.map((x) => x.type === 'ten' ? 0 : 1) }, correct, meta: { tag: 'pv_sort', level: '🟡' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const tok = (it, key) => it.type === 'ten' ? <Cassette key={key} s={48} anim={false} /> : <Battery key={key} s={40} anim={false} />;
  const bin = (b) => {
    const items = D04_ITEMS.map((it, i) => ({ it, i })).filter((x) => place[x.i] === b);
    const tint = b === 0 ? C.ten : C.one;
    return (
      <div onClick={() => drop(b)} style={{ flex: 1, minHeight: 90, borderRadius: 14, border: '2px dashed ' + tint, background: C.stile, padding: 10, cursor: locked ? 'default' : 'pointer' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: tint, marginBottom: 8, textAlign: 'center' }}>{b === 0 ? t.bin0 : t.bin1}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {items.map(({ it, i }) => {
            const good = (it.type === 'ten' ? 0 : 1) === b;
            return <span key={i} style={{ padding: 2, borderRadius: 6, boxShadow: checked ? ('0 0 0 2px ' + (good ? C.ok : C.no)) : 'none' }}>{tok(it, i)}</span>;
          })}
        </div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <Stage style={{ margin: '8px 0' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', minHeight: 40, alignItems: 'center' }}>
          {D04_ITEMS.map((it, i) => {
            if (place[i] != null) return null;
            const on = pick === i;
            return <button key={i} type="button" disabled={locked} onClick={() => setPick(on ? null : i)} style={{ padding: 6, borderRadius: 10, border: '2px solid ' + (on ? C.acc : 'transparent'), background: on ? 'rgba(255,79,40,.18)' : 'transparent', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 3px rgba(255,79,40,.25)' : 'none', lineHeight: 0 }}>{tok(it, i)}</button>;
          })}
        </div>
      </Stage>
      <div style={{ display: 'flex', gap: 10 }}>{bin(0)}{bin(1)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_04(props) {
  return (<><style>{FX_CSS}</style><D01_04Impl {...props} /></>);
}
