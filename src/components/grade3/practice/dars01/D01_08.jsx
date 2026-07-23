// Dars 1 (3-sinf) · Amaliyot 08 — mustaqil topshiriq fayli (grade2 naqshi).
// Manba: 3-sinf darsligi, 4-bet 8-mashq — kitob do'konidagi 680 soni (shart moslab qayta yozilgan).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
// Mexanika: tap-to-bin (nazariy Dars01 Screen9 naqshining amaliyot varianti) — kartani bos, savatni bos.
// Baholash hammasi-yoki-hech: bitta raqam noto'g'ri savatda bo'lsa — butun topshiriq xato.
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
const Neon = ({ text, size = 40 }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ padding: '8px 20px', borderRadius: 14, background: '#152342', border: '1.5px solid ' + C.ribbonBd, boxShadow: 'inset 0 0 18px rgba(255,184,77,.22)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: size, fontWeight: 800, letterSpacing: 6, color: C.glow, textShadow: '0 0 12px rgba(255,184,77,.8)' }}>{text}</span>
    </div>
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
.g3d1-drop { animation: g3d1drop .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes g3d1drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

/* =================== 08 · Razryad savatlari (680) · 🔴 · pv_bins =================== */
// Nol karta bilan: 680 da birlik yo'q — 0 kartani birlik savatiga qo'yish kerak.
const D08_NUM = '680';
const D08_ANS = { h: 6, t: 8, o: 0 };
const D08_TRAY = [8, 0, 6]; // kartalar aralash tartibda — sonning o'zini takrorlamaydi
const D08_T = {
  uz: {
    eyebrow: 'Masala · Razryad savatlari', setup: "Kitob do'konida 680 ta ertak kitobi bor. Shu sonning raqamlarini razryadlarga ajratamiz.",
    ask: "Kartani bosing, keyin savatni bosing: har raqam o'z razryadiga.",
    bins: { h: 'Yuzlik', t: "O'nlik", o: 'Birlik' }, tray: 'Kartalar:',
    correct: "To'g'ri! 680: 6 — yuzlik, 8 — o'nlik, 0 — birlik. Nol ham o'z joyini egallaydi.",
    wrong: "Maslahat: sonni chapdan o'qing: birinchi raqam yuzlik savatiga, ikkinchisi o'nlikka, oxirgisi birlikka tushadi. Nol ham raqam!",
    rule: "680 = 6 yuzlik, 8 o'nlik, 0 birlik — nolsiz son 68 bo'lib qolar edi.",
  },
  ru: {
    eyebrow: 'Задача · Корзины разрядов', setup: 'В книжном магазине 680 книг со сказками. Разложим цифры этого числа по разрядам.',
    ask: 'Нажми карточку, потом корзину: каждая цифра — в свой разряд.',
    bins: { h: 'Сотни', t: 'Десятки', o: 'Единицы' }, tray: 'Карточки:',
    correct: 'Верно! 680: 6 — сотни, 8 — десятки, 0 — единицы. Ноль тоже занимает своё место.',
    wrong: 'Подсказка: читай число слева направо: первая цифра идёт в корзину сотен, вторая — в десятки, последняя — в единицы. Ноль — тоже цифра!',
    rule: '680 = 6 сотен, 8 десятков, 0 единиц — без ноля число стало бы 68.',
  },
};
function D01_08Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [bins, setBins] = useState({ h: null, t: null, o: null });
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.h != null) { setBins({ h: sa.h, t: sa.t, o: sa.o }); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = bins.h != null && bins.t != null && bins.o != null;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = bins.h === D08_ANS.h && bins.t === D08_ANS.t && bins.o === D08_ANS.o;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { ...bins }, correctAnswer: { ...D08_ANS }, correct, meta: { tag: 'pv_bins', level: '🔴' } });
  }, [bins, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const inTray = D08_TRAY.filter((d) => bins.h !== d && bins.t !== d && bins.o !== d);
  const placeTo = (k) => {
    if (locked) return;
    if (sel == null) {
      // savatdagi kartani bossangiz — qaytib chiqadi
      if (bins[k] != null) setBins((b) => ({ ...b, [k]: null }));
      return;
    }
    setBins((b) => ({ ...b, [k]: sel }));
    setSel(null);
  };
  const binRing = (k) => {
    if (checked) { const ok = bins[k] === D08_ANS[k]; return '0 0 0 2.5px ' + (ok ? C.ok : C.no); }
    return 'none';
  };
  const cardStyle = (on) => ({
    width: 58, height: 58, borderRadius: 13, border: '2px solid ' + (on ? C.acc : C.line),
    background: on ? C.accSoft : C.paper, color: C.ink, ...S.mono, fontSize: 26, fontWeight: 800,
    cursor: locked ? 'default' : 'pointer',
  });
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <Neon text={D08_NUM} size={34} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          {['h', 't', 'o'].map((k) => (
            <button key={k} type="button" onClick={() => placeTo(k)} disabled={locked && bins[k] == null}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 12px', borderRadius: 12, border: '2px dashed ' + (sel != null && !locked ? C.glow : C.stageBd), background: C.stile, minWidth: 92, cursor: locked ? 'default' : 'pointer', boxShadow: binRing(k) }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.sink2, textTransform: 'uppercase', letterSpacing: '.04em' }}>{t.bins[k]}</span>
              <span style={{ width: 50, height: 50, borderRadius: 11, background: bins[k] != null ? '#152342' : 'rgba(255,255,255,.05)', border: '1.5px solid ' + C.ribbonBd, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: C.glow, textShadow: bins[k] != null ? '0 0 10px rgba(255,184,77,.8)' : 'none' }}>
                {bins[k] != null ? bins[k] : ''}
              </span>
            </button>
          ))}
        </div>
      </Stage>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0', minHeight: 62 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.ink2 }}>{t.tray}</span>
        {inTray.map((d) => (
          <button key={d} type="button" className="g3d1-drop" disabled={locked} onClick={() => setSel((s) => (s === d ? null : d))} style={cardStyle(sel === d)}>{d}</button>
        ))}
      </div>
      <p style={S.ask}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_08(props) {
  return (<><style>{FX_CSS}</style><D01_08Impl {...props} /></>);
}
