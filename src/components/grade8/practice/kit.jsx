// 7-SINF AMALIYOTINING UMUMIY QATLAMI — MEXANIKALAR BIR JOYDA.
//
// NEGA. 1-dars amaliyotida har topshiriq fayli o'z ichida bir xil 60 satrni
// takrorlaydi: uslublar, razbor bloki, `registerCheck` ulanishi, ikonkalar.
// Bitta darsda bu ko'rinmaydi, 13 darsda esa 130 fayl va bitta nuqsonni 130
// joyda tuzatish degani. CLAUDE.md §5: umumiy kod ko'chirilmaydi, umumiy
// modulga chiqariladi.
//
// NIMA QOLADI TOPSHIRIQDA. Faqat MA'LUMOT: yozuv, variantlar, kartalar,
// to'g'ri javob, har xato yo'lga razbor va uch til. Ya'ni metodik ish.
//
// MUHIM QOIDA (2026-08-20 da qimmatga tushgan xato): MATEMATIKA til blokining
// ICHIDA turmaydi. Yozuv, variant, karta -- bu tarjima emas, matematikaning
// o'zi. Uchta nusxa birinchi tahrirda ajralib ketadi va rus tilidagi
// topshiriq yechilmas bo'lib qoladi. Shuning uchun `expr`, `opts`, `cards`,
// `items` -- til bloklaridan TASHQARIDA, `L()` esa faqat SO'ZLAR uchun.
//
// MEXANIKALAR (1-dars amaliyotidan olindi, xatti-harakati o'sha):
//   Choice     -- uchta-to'rtta o'qishdan bittasi (faqat 1-2 «isinish» uchun)
//   TypeValue  -- javob klaviaturadan, manfiy son ham mumkin
//   SlotsBank  -- uyalar va kartalar banki; bir yoki bir necha qator
//   TapTerms   -- yozuvning O'ZIDA hadlarni belgilash
//   MarkAll    -- bir nechta yozuvni belgilash, «hammasi yoki hech narsa»
//   BuildLine  -- kartalardan yozuv yig'ish, kursor istalgan joyga
//   Zones      -- yozuvlarni zonalarga taqsimlash
//
// HAR MEXANIKA jsx-question kontraktini bajaradi: `onReady`, `registerCheck`,
// `onSubmit`. O'z «Tekshirish» tugmasi YO'Q -- uni PracticeHost beradi.
// Javob BITTA marta tekshiriladi, keyin ekran yopiladi (amaliyot qoidasi).
//
// BALANDLIK: 1366x615 da ishchi maydon 487px, tepada til qatori, pastda
// tugma. Topshiriq 363px dan oshmasligi kerak -- uslublar shu hisobda
// ixcham qilingan (`practice/PracticeHost.jsx` dagi izohga qarang).
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Frac, Row } from './frac.jsx';
// Matematik sud SINFNING yadrosidan olinadi, qayta yozilmaydi (CLAUDE.md §5).
// checkIdentity qiymatni ham, ANIQLANISH SOHASINI ham solishtiradi -- З2 shu yerda tutiladi.
// checkReduction esa teskari topshiriq uchun: tekshiruv O'QUVCHI yozuvining sohasida boradi.
import { checkIdentity, checkOdz, checkReduction, domainHoles, valueAt } from '../mathcore.js';

export { Frac, Row };

// ============================================================ TIL
// L() faqat SO'ZLAR uchun. Matematika uchun emas.
export const L = (uz, ru, en) => ({ uz, ru, en });
export const tr = (v, lang) => {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return v;
  return v[lang] || v.uz || '';
};

// ============================================================ USLUBLAR
export const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '3px 2px 6px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '4px 0 7px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '7px 0 6px' },
  note: { fontSize: 13, color: '#9aa1ad', fontWeight: 600, margin: '0 0 8px' },
  bankLbl: { fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 6 },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 800 },
};
export const C = {
  ink: '#1f2430', soft: '#374151', mute: '#9aa1ad', line: '#cbd5e1', pale: '#e2e8f0',
  hot: '#fe5b1a', hotBg: '#fff0e8', ok: '#1a7f43', okBg: '#e8f7ee', no: '#c0392b', noBg: '#fdecec',
  bg: '#f8fafc', stage2: '#2C5FA8', stage1: '#7A4FA3', brace: '#0f766e',
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Razbor bloki. O'lchamlari 615px balandlikka hisoblangan: razbor topshiriq
// bilan birga sig'ishi kerak, aks holda o'quvchi uni ko'rmaydi.
// Razbor bloki. Telefonda ixchamroq: u eng oxirida chiqadi va aynan u
// kontentni kadrdan chiqarib yuborardi (o'lchov 2026-08-22).
export const HFB = ({ ok, text }) => {
  const phone = useIsPhone();
  return (
    <div data-razbor="1" style={{ display: 'flex', alignItems: 'flex-start', gap: phone ? 7 : 9, marginTop: phone ? 6 : 8, padding: phone ? '6px 9px' : '8px 11px', borderRadius: 11, fontSize: phone ? 12 : 13.5, lineHeight: phone ? 1.3 : 1.35, fontWeight: 600, background: ok ? C.okBg : C.noBg, color: ok ? C.ok : C.no }}>
      {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
    </div>
  );
};

// ============================================================ UMUMIY HOLAT
// Har mexanikada bir xil: javob bir marta tekshiriladi, keyin qulflanadi.
function useAnswer({ mode, initialAnswer, restore }) {
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const isReview = mode === 'review';
  useEffect(() => {
    if (!initialAnswer) return;
    restore?.(initialAnswer.studentAnswer);
    if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAnswer]);
  return { fb, setFb, checked, setChecked, locked: isReview || checked };
}

// `registerCheck` HOSTGA funksiya beradi. Funksiya har renderda yangilanadi,
// lekin hostga bir marta uzatiladi -- shuning uchun ref orqali.
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
export { useRegister, useAnswer };

// Razborni TANLASH. `data.wrongs` — tartib bilan tekshiriladigan shartlar:
// birinchi mos kelgani chiqadi. Har xato YO'LGA o'z razbori bo'lishi kerak
// (etalon §8.3), «noto'g'ri» so'zi razbor emas.
const pickWhy = (data, state, lang) => {
  for (const w of data.wrongs || []) {
    try { if (w.when(state)) return tr(w.text, lang); } catch (e) { /* shart bajarilmadi */ }
  }
  return tr(data.wrongText, lang);
};

const submitPayload = (data, extra) => ({
  questionText: extra.questionText || '',
  options: extra.options || [],
  studentAnswer: extra.studentAnswer,
  correctAnswer: extra.correctAnswer,
  correct: extra.correct,
  meta: { tag: data.tag, level: data.level, ...(data.meta || {}) },
});

// Sarlavha qismi: hamma mexanikada bir xil tartib -- eyebrow, shart, savol.
//
// TELEFONDA SHART IXCHAMROQ TERILADI (o'lchov 2026-08-25). 390x745 kadrda
// ishchi maydon 516px: sarlavha bilan chiplar 229px, tugma qatori 70px
// oladi. Shartning o'zi 16px/1.45 da to'rt qatorga 93px yeyardi, ya'ni
// razborga joy qolmasdi va razborni QISQARTIRISH kerak bo'lardi. Endi
// telefonda shart 14.5px/1.34 — razborning uzunligi metodik qaror bo'lib
// qoladi, kadrning o'lchovi emas. Kompyuterda hech narsa o'zgarmaydi.
// Bu razbor bloki bilan bir xil naqsh: HFB da ham telefon uchun alohida
// o'lcham turadi (izoh o'sha yerda).
const FOLD_LBL = L('Shart', 'Условие', 'Statement');

const Head = ({ data, lang, done }) => {
  const phone = useIsPhone();
  const [open, setOpen] = useState(false);
  // TELEFONDA JAVOBDAN KEYIN SHART YIG'ILADI. Sabab o'lchovda: 390x745 da
  // ishchi maydon 516px, shart 16px/1.45 da 93px yeydi, va razbor kadrdan
  // chiqadi. Ilgari bu razborni QISQARTIRISH bilan hal qilingan edi — ya'ni
  // kadr o'lchovi metodik matnni kesardi. Endi teskari: javob berilgandan
  // keyin shart bir qatorga yig'iladi (o'quvchi uni allaqachon o'qigan),
  // razbor esa to'liq turadi. Bir teginish shartni qaytaradi.
  // Kompyuterda hech narsa yig'ilmaydi.
  const foldable = phone && done;
  const seen = !foldable || open;
  const line = phone ? { ...S.setup, fontSize: 14.5, lineHeight: 1.34, margin: '4px 0 7px' } : S.setup;
  return (
    <>
      <div style={S.eyebrow}>{tr(data.eyebrow, lang)}</div>
      {data.setup ? (
        <>
          {foldable ? (
            <button type="button" data-setup-fold="1" aria-expanded={open} onClick={() => setOpen(!open)}
              style={{ display: 'block', margin: '2px 0 5px', padding: 0, border: 0, background: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 800, letterSpacing: '.03em', color: C.mute, cursor: 'pointer' }}>
              {tr(FOLD_LBL, lang)} {open ? '▴' : '▾'}
            </button>
          ) : null}
          {seen ? <p style={foldable ? { ...line, margin: '0 0 6px' } : line}>{tr(data.setup, lang)}</p> : null}
        </>
      ) : null}
    </>
  );
};

// Berilgan qiymatlar qatori (a = 4, b = −3). Matematika — `data.given`,
// so'z — `data.givenLabel`.
const Given = ({ data, lang }) => {
  // `fig` — TAYYOR TUGUN (chizma, grafik, o'q). 9-sinf amaliyoti uchun
  // qo'shildi (2026-08-26): `TrueFalse`, `Choice` va boshqalarga rasm
  // kerak bo'lgani uchun ularni nusxalash noto'g'ri bo'lardi. 8-sinfning
  // 550 topshirig'idan birortasi `fig` bermaydi, shuning uchun bu
  // qo'shimcha ularning xatti-harakatini o'zgartirmaydi.
  if (data.fig) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0 4px' }}>{data.fig}</div>
        {data.given && data.given.length ? <GivenRow data={data} lang={lang} /> : null}
      </>
    );
  }
  if (!data.given || !data.given.length) return null;
  return <GivenRow data={data} lang={lang} />;
};

const GivenRow = ({ data, lang }) => {
  return (
    // `flexWrap` va gorizontal padding (QA 2026-08-26): uzun yorliq bilan
    // chizma bir qatorga sig'masa, ular ko'chadi, chetga tiralmaydi.
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14, padding: '5px 8px', borderRadius: 12, background: C.bg, border: '1px solid #eef0f4', marginBottom: 4 }}>
      {data.givenLabel ? <span style={{ fontSize: 12, fontWeight: 800, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase' }}>{tr(data.givenLabel, lang)}</span> : null}
      {data.given.map((g, i) => <Row key={i} tokens={g} size={22} />)}
    </div>
  );
};

// 9-SINF AMALIYOTI SHU YERDAN OLADI (2026-08-26). Sinfning o'z mexanikalari
// `grade9/practice/asboblar9.jsx` da yoziladi, lekin shapka, razborni
// tanlash va javob paketi umumiy bo'lib qolishi kerak — aks holda ular
// nusxalanardi (CLAUDE.md §5). Faqat `export` qo'shildi, kod tegilmadi.
// eslint-disable-next-line react-refresh/only-export-components
export { Head, Given, pickWhy, submitPayload, useIsPhone, useIsShort, parseSet, num, near, Cell, ExprPad };

// ============================================================ 1. CHOICE
// Tayyor javobni tanlash. Etalon §1.1 ga ko'ra bu KUCHSIZ tekshiruv,
// shuning uchun faqat isinish uchun (amaliyotda bir-ikkitasi).
export function Choice({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.idx != null) setPicked(sa.idx); } });
  useEffect(() => { onReady?.(picked != null && !A.checked); }, [picked, A.checked, onReady]);

  // AMALIYOT_GLOBAL_STANDART.md 5-band: variantlar har ochilganda
  // aralashtiriladi, to'g'ri javob doimiy joyda turmaydi. Aralashtirish faqat
  // KO'RSATISH tartibini o'zgartiradi: `data-opt`, `picked` va razbor shartlari
  // (`s.picked === 1`) ma'lumotdagi ASL raqamda qoladi, ya'ni topshiriq
  // fayllarini va tekshiruvlarni o'zgartirish kerak emas.
  const order = useMemo(() => {
    const idx = (data.opts || []).map((_, i) => i);
    if (data.noShuffle) return idx;
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return idx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const check = useCallback(() => {
    const correct = picked === data.correct;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { picked }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang),
      options: data.opts.map((o, i) => ({ id: String(i), label: tr(o.label, lang) })),
      studentAnswer: { idx: picked }, correctAnswer: { idx: data.correct }, correct,
    }));
  }, [picked, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '4px 0 10px' }}>
          <Row tokens={data.expr} size={data.exprSize || 30} />
        </div>
      ) : null}
      <Given data={data} lang={lang} />
      <p style={S.ask}>{tr(data.ask, lang)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (data.optCols || 1) + ', minmax(0, 1fr))', gap: 5 }}>
        {order.map((i) => {
          const o = data.opts[i];
          const active = picked === i;
          const short = (data.optCols || 1) > 1;
          let bg = '#fff'; let bd = '#d6dae3'; let col = C.soft;
          if (active) { bg = C.hotBg; bd = C.hot; col = C.ink; }
          if (A.checked && active) { const good = i === data.correct; bg = good ? C.okBg : C.noBg; bd = good ? C.ok : C.no; col = good ? C.ok : C.no; }
          return (
            <button key={i} type="button" data-opt={i} disabled={A.locked} onClick={() => setPicked(i)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: short ? 'center' : 'flex-start', width: '100%', minHeight: short ? 44 : 0, padding: phone ? '4px 9px' : '6px 12px', borderRadius: 12, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: short ? 'center' : 'left', minWidth: 0, overflowWrap: 'break-word' }}>
              {typeof o.label === 'object' && Array.isArray(o.label) ? <Row tokens={o.label} size={(data.optSize || 20) - (phone ? 2 : 0)} /> : tr(o.label, lang)}
            </button>
          );
        })}
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 2. TYPEVALUE
// Javob klaviaturadan. Manfiy son ham kiritiladi (`allowNeg`), aks holda
// 7-sinf misollarining yarmi kiritib bo'lmaydigan bo'lib qolardi.
export function TypeValue({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.value != null) setVal(String(sa.value)); } });
  const clean = (raw) => {
    let s = String(raw).replace(/[^0-9\-−]/g, '').replace(/−/g, '-');
    const neg = data.allowNeg !== false && s.startsWith('-');
    s = s.replace(/-/g, '');
    return (neg ? '-' : '') + s;
  };
  useEffect(() => { onReady?.(val.trim() !== '' && val.trim() !== '-' && !A.checked); }, [val, A.checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(val, 10);
    const correct = v === data.target;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { value: v }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.setup, lang), studentAnswer: { value: v }, correctAnswer: { value: data.target }, correct,
    }));
  }, [val, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '6px 0 14px' }}>
          <Row tokens={data.expr} size={data.exprSize || 30} />
        </div>
      ) : null}
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }} htmlFor="kit-in">{tr(data.label, lang)}</label>
      <input id="kit-in" data-input="1" value={val} onChange={(e) => setVal(clean(e.target.value))}
        inputMode={data.allowNeg === false ? 'numeric' : 'text'} disabled={A.locked} placeholder="0"
        style={{ width: '100%', boxSizing: 'border-box', fontSize: 24, fontWeight: 800, textAlign: 'center', padding: '12px 14px', borderRadius: 14, border: '2px solid ' + (A.checked ? (A.fb?.correct ? C.ok : C.no) : '#d6dae3'), background: A.checked ? '#fff' : C.bg, outline: 'none', fontFamily: S.mono.fontFamily }} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 3. SLOTSBANK
// Uyalar va kartalar banki. `rows` — yozuvning qatorlari; qatorda tokenlar
// yoki `{ slot: n }`. Kartani bosasiz, keyin uyani bosasiz.
// «Hammasi yoki hech narsa»: uyalarning hammasi to'g'ri bo'lishi kerak.
// Zanjirning bitta qismi: tokenlar, uya yoki kasr. Kasr o'z ichida yana
// shu funksiyani chaqiradi, shuning uchun uya suratda ham, maxrajda ham
// tura oladi (8-sinf: bo'shliq ko'pincha aynan qavatda bo'ladi).
function SlotPart({ part, size, slots, bd, picked, locked, onTap, small }) {
  if (part.slot != null) {
    const i = part.slot;
    return (
      <button type="button" data-slot={i} disabled={locked} onClick={() => onTap(i)}
        style={{
          minWidth: small ? 52 : 74, height: small ? 34 : 46, borderRadius: 10, margin: small ? '0 3px' : '0 5px',
          border: '2px ' + (slots[i] ? 'solid' : 'dashed') + ' ' + (slots[i] ? bd : (picked ? C.hot : C.line)),
          background: slots[i] ? '#fff' : (picked ? '#fff7f2' : C.bg),
          ...S.mono, fontSize: small ? 17 : 23, color: C.ink, cursor: locked ? 'default' : 'pointer',
        }}>
        {slots[i] || ''}
      </button>
    );
  }
  if (part.frac) {
    const floor = (list) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1px 4px' }}>
        {list.map((p, i) => <SlotPart key={i} part={p} size={Math.round(size * 0.8)} slots={slots} bd={bd} picked={picked} locked={locked} onTap={onTap} small />)}
      </span>
    );
    return (
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', margin: '0 5px', verticalAlign: 'middle' }}>
        {floor(part.frac.n)}
        <span style={{ height: 2.5, background: C.ink, borderRadius: 2 }} />
        {floor(part.frac.d)}
      </span>
    );
  }
  return <Row tokens={part.t} size={size} />;
}

export function SlotsBank({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const n = data.answer.length;
  const [slots, setSlots] = useState(Array(n).fill(null));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots); } });
  // Karta SONI bo'yicha sarflanadi, qiymati bo'yicha emas: bankda ikkita
  // bir xil karta bo'lishi mumkin (bitta ko'paytuvchi ikkala qavatga).
  const pool = (() => {
    const rest = data.cards.slice();
    slots.filter(Boolean).forEach((v) => { const i = rest.indexOf(v); if (i !== -1) rest.splice(i, 1); });
    return rest;
  })();
  const full = slots.every(Boolean);
  useEffect(() => { onReady?.(full && !A.checked); }, [full, A.checked, onReady]);

  const tapSlot = (i) => {
    if (A.locked) return;
    if (picked) { setSlots((s) => { const x = s.slice(); x[i] = picked; return x; }); setPicked(null); return; }
    if (slots[i]) setSlots((s) => { const x = s.slice(); x[i] = null; return x; });
  };
  const check = useCallback(() => {
    // `anyOrder` — uyalar guruhi, ularning ICHIDA tartib muhim emas
    // (ikki shart: qaysi biri oldin yozilgani javobni o'zgartirmaydi).
    const mine = slots.slice(); const want = data.answer.slice();
    (data.anyOrder || []).forEach((g) => {
      const a = g.map((i) => mine[i]).slice().sort(); const b = g.map((i) => want[i]).slice().sort();
      g.forEach((idx, k) => { mine[idx] = a[k]; want[idx] = b[k]; });
    });
    const correct = mine.join('|') === want.join('|');
    A.setFb({ correct, why: correct ? null : pickWhy(data, { slots }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), options: data.cards.map((c) => ({ id: c, label: c })),
      studentAnswer: { slots: slots.slice() }, correctAnswer: { slots: data.answer }, correct,
    }));
  }, [slots, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.line;
  const size = data.exprSize || 26;
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', margin: '8px 0 6px' }}>
        {/* QISM uch xil bo'ladi: `{ t }` — tayyor tokenlar, `{ slot }` — uya,
            `{ frac: { n, d } }` — IKKI QAVATLI kasr, uning qavatlarida ham
            tokenlar ham uyalar turishi mumkin. Uchinchisi 8-sinf uchun
            qo'shildi: bu kasrlar sinfi, va zanjirning bo'shligi ko'pincha
            aynan surat yoki maxrajda bo'ladi. Chiziqli qatorga tekislash
            («6 : (m + 5)») yaramaydi — kasr kasrday ko'rinishi kerak. */}
        {data.rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {row.map((part, pi) => <SlotPart key={pi} part={part} size={size} slots={slots} bd={bd} picked={picked} locked={A.locked} onTap={tapSlot} />)}
          </div>
        ))}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 9, display: A.locked ? 'none' : 'block' }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 46, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c, ci) => (
            <button key={c + '#' + ci} type="button" data-card={c} disabled={A.locked} onClick={() => setPicked(picked === c ? null : c)}
              style={{ minWidth: 62, padding: '0 10px', height: 46, borderRadius: 12, border: '2px solid ' + (picked === c ? C.hot : C.line), background: picked === c ? C.hotBg : '#fff', ...S.mono, fontSize: 22, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 4. TAPTERMS
// Yozuvning O'ZIDA belgilash. `parts`: `{ k: 'txt'|'op'|'term', v, id }`.
// Bosiladigan joy KO'RINIB turishi kerak (METODIK_PROFIL: «видимая зона
// клика») -- shuning uchun had punktir ramkada turadi.
export function TapTerms({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [marked, setMarked] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.marked) setMarked(sa.marked); } });
  useEffect(() => { onReady?.(marked.length > 0 && !A.checked); }, [marked, A.checked, onReady]);

  const toggle = (id) => { if (!A.locked) setMarked((m) => (m.indexOf(id) === -1 ? m.concat(id) : m.filter((x) => x !== id))); };
  const check = useCallback(() => {
    const extra = marked.filter((id) => data.want.indexOf(id) === -1);
    const miss = data.want.filter((id) => marked.indexOf(id) === -1);
    const correct = !extra.length && !miss.length;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { marked, extra, miss }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { marked: marked.slice() }, correctAnswer: { marked: data.want }, correct,
    }));
  }, [marked, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const size = data.exprSize || 30;
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <p style={S.ask}>{tr(data.ask, lang)}</p>
      {data.note ? <div style={S.note}>{tr(data.note, lang)}</div> : null}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 2, margin: '8px 0 4px' }}>
        {data.parts.map((p, i) => {
          if (p.k === 'txt') return <span key={i} style={{ ...S.mono, fontSize: size, color: C.brace, padding: '0 3px' }}>{p.v}</span>;
          if (p.k === 'op') return <span key={i} style={{ ...S.mono, fontSize: size + 4, color: C.stage1, padding: '2px 12px', margin: '0 4px', borderRadius: 9, background: '#f3eefa' }}>{p.v}</span>;
          // 'sign' — oddiy amal belgisi: bosilmaydi, lekin ta'kidlanmaydi ham.
          if (p.k === 'sign') return <span key={i} style={{ ...S.mono, fontSize: size, color: (p.v === '·' || p.v === ':') ? C.stage2 : C.stage1, padding: '0 7px' }}>{p.v}</span>;
          const on = marked.indexOf(p.id) !== -1;
          let bd = C.line; let bg = C.bg; let col = C.ink; let dash = 'dashed';
          if (on) { bd = C.hot; bg = C.hotBg; dash = 'solid'; }
          if (A.checked) {
            dash = 'solid';
            const ok2 = A.fb?.correct;
            if (on) { bd = ok2 ? C.ok : C.no; bg = ok2 ? C.okBg : C.noBg; col = ok2 ? C.ok : C.no; }
            else { bd = C.pale; bg = '#fff'; }
          }
          return (
            <button key={i} type="button" aria-pressed={on} data-term={p.id} disabled={A.locked} onClick={() => toggle(p.id)}
              style={{ ...S.mono, fontSize: size, color: col, padding: '6px 10px', margin: '0 1px', borderRadius: 10, border: '2px ' + dash + ' ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              {p.v}
            </button>
          );
        })}
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 5. MARKALL
// Bir nechta yozuvni belgilash. Katakcha-belgi YO'Q (3-sinf kanoni §3.3):
// tanlangan yozuv ramka va to'ldirish bilan ko'rinadi.
export function MarkAll({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [marked, setMarked] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.marked) setMarked(sa.marked); } });
  useEffect(() => { onReady?.(marked.length > 0 && !A.checked); }, [marked, A.checked, onReady]);

  const want = data.items.filter((i) => i.hit).map((i) => i.id);
  const toggle = (id) => { if (!A.locked) setMarked((m) => (m.indexOf(id) === -1 ? m.concat(id) : m.filter((x) => x !== id))); };
  const check = useCallback(() => {
    const extra = marked.filter((id) => want.indexOf(id) === -1);
    const miss = want.filter((id) => marked.indexOf(id) === -1);
    const correct = !extra.length && !miss.length;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { marked, extra, miss }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), options: data.items.map((i) => ({ id: i.id })),
      studentAnswer: { marked: marked.slice() }, correctAnswer: { marked: want }, correct,
    }));
  }, [marked, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <p style={S.ask}>{tr(data.ask, lang)} {data.note ? <span style={{ fontSize: 13, color: C.mute, fontWeight: 600 }}>{tr(data.note, lang)}</span> : null}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(' + (data.col || 180) + 'px, 1fr))', gap: 7 }}>
        {data.items.map((it) => {
          const on = marked.indexOf(it.id) !== -1;
          let bd = '#d6dae3'; let bg = '#fff';
          if (on) { bd = C.hot; bg = C.hotBg; }
          if (A.checked && on) { const ok2 = A.fb?.correct; bd = ok2 ? C.ok : C.no; bg = ok2 ? C.okBg : C.noBg; }
          return (
            <button key={it.id} type="button" aria-pressed={on} data-item={it.id} disabled={A.locked} onClick={() => toggle(it.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, padding: '5px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              {it.tokens ? <Row tokens={it.tokens} size={data.itemSize || 23} /> : <span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{tr(it.label, lang)}</span>}
            </button>
          );
        })}
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 6. BUILDLINE
// Kartalardan yozuv yig'ish. KURSOR istalgan joyga ko'chadi: aks holda
// «(60 − 20)» ni olish uchun qavsni oldin bosish kerak bo'lardi, odam esa
// avval «60 − 20» ni yozadi.
//
// Ikki rejim:
//   target     -- yig'ilgan yozuvning QIYMATI berilgan songa teng bo'lsin
//   answerSeq  -- karta id lari aynan shu KETMA-KETLIKDA bo'lsin (harfli
//                 yozuvda qiymatni hisoblab bo'lmaydi)
// QIYMAT faqat tekshirishdan keyin ko'rinadi (etalon §8.1): jonli o'lchagich
// topshiriqni «sonni tutib olish» ga aylantirardi.
const PREC = { '·': 2, ':': 2, '+': 1, '−': 1 };
export const evalSeq = (items) => {
  const out = []; const ops = [];
  let expectNum = true;
  const apply = () => {
    const op = ops.pop(); const b = out.pop(); const a = out.pop();
    if (op === undefined || a === undefined || b === undefined) return false;
    if (op === '+') { out.push(a + b); return true; }
    if (op === '−') { out.push(a - b); return true; }
    if (op === '·') { out.push(a * b); return true; }
    if (op === ':') { if (b === 0) return false; out.push(a / b); return true; }
    return false;
  };
  for (const it of items) {
    if (!it) return null;
    if (it.kind === 'num') { if (!expectNum) return null; out.push(it.value !== undefined ? it.value : Number(it.label)); expectNum = false; }
    else if (it.kind === 'op') {
      if (expectNum) return null;
      while (ops.length && PREC[ops[ops.length - 1]] >= PREC[it.label]) { if (!apply()) return null; }
      ops.push(it.label); expectNum = true;
    } else if (it.kind === 'open') { if (!expectNum) return null; ops.push('('); }
    else if (it.kind === 'close') {
      if (expectNum) return null;
      while (ops.length && ops[ops.length - 1] !== '(') { if (!apply()) return null; }
      if (!ops.length) return null;
      ops.pop(); expectNum = false;
    }
  }
  if (expectNum) return null;
  while (ops.length) { if (ops[ops.length - 1] === '(') return null; if (!apply()) return null; }
  return out.length === 1 ? out[0] : null;
};

export function BuildLine({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [seq, setSeq] = useState([]);      // karta id lari
  const [pos, setPos] = useState(0);       // kursor o'rni
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.seq) { setSeq(sa.seq); setPos(sa.seq.length); } } });
  const byId = (id) => data.cards.find((c) => c.id === id);
  const items = seq.map(byId);
  const left = data.cards.length - seq.length;
  const value = evalSeq(items);
  const ready = data.answerSeq ? seq.length > 0 : value !== null;
  const enough = data.useAll ? (left === 0 && ready) : ready;
  useEffect(() => { onReady?.(enough && !A.checked); }, [enough, A.checked, onReady]);

  const put = (id) => { if (A.locked) return; setSeq((s) => { const x = s.slice(); x.splice(pos, 0, id); return x; }); setPos((p) => p + 1); };
  const undo = () => { if (A.locked || pos === 0) return; setSeq((s) => { const x = s.slice(); x.splice(pos - 1, 1); return x; }); setPos((p) => p - 1); };
  const check = useCallback(() => {
    const correct = data.answerSeq ? seq.join('|') === data.answerSeq.join('|') : value === data.target;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { seq, value, line: items.map((i) => i && i.label).join(' ') }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.setup, lang), studentAnswer: { seq: seq.slice(), value },
      correctAnswer: data.answerSeq ? { seq: data.answerSeq } : { value: data.target }, correct,
    }));
  }, [seq, value, items, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const caret = (i) => (
    <button key={'c' + i} type="button" disabled={A.locked} onClick={() => setPos(i)} aria-label="kursor"
      style={{ width: 10, minHeight: 32, border: 0, background: 'none', padding: 0, cursor: A.locked ? 'default' : 'pointer', position: 'relative' }}>
      <span style={{ position: 'absolute', left: '50%', top: '12%', bottom: '12%', width: 2, transform: 'translateX(-50%)', borderRadius: 2, background: pos === i && !A.locked ? C.hot : 'transparent' }} />
    </button>
  );
  const toneOf = (lab) => (lab === '·' || lab === ':' ? C.stage2 : (lab === '+' || lab === '−' ? C.stage1 : (lab === '(' || lab === ')' ? C.brace : C.ink)));

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <div style={{ minHeight: data.fieldH || 68, borderRadius: 16, border: '2px solid ' + C.pale, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 12px', margin: '4px 0 8px', flexWrap: 'wrap' }}>
        {seq.length === 0 ? (
          <>{caret(0)}<span style={{ fontSize: 15, fontWeight: 600, color: C.mute }}>{tr(data.empty, lang)}</span></>
        ) : (
          <>
            {items.map((it, i) => (
              <React.Fragment key={i}>
                {caret(i)}
                <button type="button" disabled={A.locked} onClick={() => setPos(i)}
                  style={{ border: 0, background: 'none', padding: '0 2px', ...S.mono, fontSize: 27, color: toneOf(it && it.label), cursor: A.locked ? 'default' : 'pointer' }}>
                  {it && it.label}
                </button>
              </React.Fragment>
            ))}
            {caret(items.length)}
          </>
        )}
      </div>
      {A.checked && !data.answerSeq ? (
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.mute, letterSpacing: '.05em', textTransform: 'uppercase' }}>{tr(data.valueLabel, lang)} </span>
          <span style={{ ...S.mono, fontSize: 26, color: A.fb?.correct ? C.ok : C.no }}>{value === null ? '—' : value}</span>
        </div>
      ) : null}
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {data.cards.map((c) => {
          const used = seq.indexOf(c.id) !== -1;
          return (
            <button key={c.id} type="button" data-card={c.id} disabled={used || A.locked} onClick={() => put(c.id)}
              style={{ minWidth: 52, padding: '0 9px', height: 48, borderRadius: 13, border: '2px solid ' + (used ? '#eef0f4' : C.line), background: used ? C.bg : '#fff', ...S.mono, fontSize: 23, color: used ? C.line : toneOf(c.label), cursor: (used || A.locked) ? 'default' : 'pointer' }}>
              {c.label}
            </button>
          );
        })}
        <button type="button" disabled={A.locked || pos === 0} onClick={undo}
          style={{ marginLeft: 6, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #d6dae3', background: '#fff', color: (A.locked || pos === 0) ? '#c2c8d2' : C.soft, fontSize: 13.5, fontWeight: 700, cursor: (A.locked || pos === 0) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {tr(data.undo, lang)}
        </button>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 7. ZONES
// Yozuvlarni zonalarga taqsimlash. BOSISH bilan, tortish bilan emas:
// telefonda barmoq zonadan chetga tushadi (3-sinf kanoni §3.6).
export function Zones({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const zw = phone ? 74 : (data.zoneLbl || 104);
  const [place, setPlace] = useState({});
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.place) setPlace(sa.place); } });
  // ARALASHTIRISH (AMALIYOT_GLOBAL_STANDART.md 5-band): yozuvlar har
  // ochilganda boshqa tartibda turadi, ya'ni «birinchi to'rttasi bitta
  // zonaga» degan naqsh yodlanmaydi. Aralashtirish faqat KO'RSATISH
  // tartibini o'zgartiradi: `id`, `zone` va razbor shartlari tegilmaydi.
  const shown = useMemo(() => {
    const a = data.items.slice();
    if (data.noShuffle) return a;
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const pool = shown.filter((it) => !place[it.id]);
  const all = data.items.every((it) => place[it.id]);
  useEffect(() => { onReady?.(all && !A.checked); }, [all, A.checked, onReady]);

  const tapItem = (id, e) => {
    if (e) e.stopPropagation();
    if (A.locked) return;
    if (place[id] && picked) { const z = place[id]; setPlace((p) => ({ ...p, [picked]: z })); setPicked(null); return; }
    if (place[id]) { setPlace((p) => { const n = { ...p }; delete n[id]; return n; }); setPicked(null); return; }
    setPicked(picked === id ? null : id);
  };
  const tapZone = (z) => { if (!A.locked && picked) { setPlace((p) => ({ ...p, [picked]: z })); setPicked(null); } };
  const check = useCallback(() => {
    const bad = data.items.filter((it) => place[it.id] !== it.zone).map((it) => it.id);
    const correct = bad.length === 0;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { place, bad }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.setup, lang), studentAnswer: { place: { ...place } },
      correctAnswer: { place: data.items.reduce((a, it) => ({ ...a, [it.id]: it.zone }), {}) }, correct,
    }));
  }, [place, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const chip = (it) => {
    // Qaysi yozuv noto'g'ri joyda ekani KO'RSATILMAYDI: ikki zonali
    // topshiriqda bu to'g'ri javobni aytib qo'yish bilan barobar.
    const bad = A.checked && place[it.id] && !A.fb?.correct;
    const good = A.checked && place[it.id] && A.fb?.correct;
    let bd = C.line; let bg = '#fff';
    if (picked === it.id) { bd = C.hot; bg = C.hotBg; }
    if (bad) { bd = C.no; bg = C.noBg; }
    if (good) { bd = C.ok; bg = C.okBg; }
    return (
      <button key={it.id} type="button" disabled={A.locked} data-item={it.id} onClick={(e) => tapItem(it.id, e)}
        style={{ padding: phone ? '3px 6px' : '5px 9px', borderRadius: 9, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer', lineHeight: 1 }}>
        <Row tokens={it.tokens} size={(data.itemSize || 17) - (phone ? 2 : 0)} color={bad ? C.no : C.ink} tone={!bad} />
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '2px 0' }}>
        {data.zones.map((z) => (
          <div key={z.id} style={{ display: 'flex', alignItems: 'stretch', gap: phone ? 5 : 8 }}>
            {/* Zona sarlavhasi so'z ham, KASR ham bo'lishi mumkin (1-dars
                amaliyoti, 02): guruhni «birinchi» deb atash emas, guruhning
                o'z kasrini ko'rsatish kerak edi. */}
            <div style={{ width: zw, flex: '0 0 ' + zw + 'px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 10.5, fontWeight: 800, color: C.mute, letterSpacing: '.03em', textAlign: 'right' }}>
              {z.tokens ? <Row tokens={z.tokens} size={data.zoneSize || (phone ? 17 : 20)} /> : tr(z.label, lang)}
            </div>
            <div data-zone={z.id} onClick={() => tapZone(z.id)}
              style={{ flex: 1, minHeight: phone ? 34 : 42, borderRadius: 13, padding: phone ? 4 : 6, border: '2px dashed ' + (picked ? C.hot : C.pale), background: picked ? '#fff7f2' : C.bg, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'center', justifyContent: 'center', cursor: picked && !A.locked ? 'pointer' : 'default' }}>
              {shown.filter((it) => place[it.id] === z.id).map(chip)}
            </div>
          </div>
        ))}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 8, display: A.locked ? 'none' : 'block' }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', minHeight: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map(chip)}
        </div>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ############################################################################
// 8-SINF, 2-DARS AMALIYOTI UCHUN QO'SHILGAN MEXANIKALAR.
//
// NEGA YANGI. Yuqoridagi yettitasi 7-sinfdan keldi va u yerda javob SON edi.
// 8-sinfda javob IFODA, SHART va ASOS bo'ladi, shuning uchun yetti mexanika
// yetmaydi. Qo'shilganlari `TIPLAR_AMALIYOT_8SINF.md` §5 ro'yxatidan:
//   TypeExpr    -- 5.1 input      javob ifoda, matn emas
//   OdzTwo      -- 5.2 odz        natija va shart, ikki maydon, alohida sud
//   StepsReason -- 5.3 steps      qadamda amal VA asos
//   Boundary    -- 5.7 boundary   ikki yozuv qayerda ajraladi
//   AuditRows   -- 5.6 audit      birinchi xato satr VA kontrprimer
//   BuildFrac   -- 5.5 build      xossalar bo'yicha yig'ish, satr solishtirish yo'q
//   TapFrac     -- kasr ICHIDA belgilash (TapTerms chiziqli qatorni biladi)
//
// USLUB O'ZGARMAYDI: hammasi `S`, `C`, `HFB`, `Head`, `Given` dan foydalanadi,
// ya'ni 7-sinf amaliyotining ranglari va o'lchamlari (metodist, 2026-08-22).
// Balandlik byudjeti o'sha: 1366x615 da 363px.
// ############################################################################

// Telefon aniqlanishi: OdzTwo da ikki maydon ikki klaviatura ochardi va
// kontent ishchi maydondan chiqib ketardi (TIPLAR §4).
// PAST EKRAN. Kenglik emas, BALANDLIK cheklaydigan holat: 1366x615
// noutbukda ishchi maydon 487px, ya'ni 390x745 telefondagidan ham kichik.
// Ixchamlik faqat kenglikka qarab berilsa, bu ekran chetda qolib ketadi.
function useIsShort(bp = 660) {
  const [short, setShort] = useState(() => (typeof window !== 'undefined' ? window.innerHeight < bp : false));
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const f = () => setShort(window.innerHeight < bp);
    f(); window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return short;
}

function useIsPhone(bp = 640) {
  const [phone, setPhone] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < bp : false));
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const f = () => setPhone(window.innerWidth < bp);
    f(); window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [bp]);
  return phone;
}

// Ifodalarning TENGLIGI. Har ikkisi ham bo'sh bo'lmasa checkIdentity beradi.
// Matn solishtirilmaydi: «20y», «20·y» va «y·20» bitta javob.
const sameExpr = (a, b) => {
  if (!a || !b) return false;
  try { return !!checkIdentity(String(a), String(b)).ok; } catch { return false; }
};

// ============================================================ EKRAN KLAVIATURASI
// Telefonning O'Z klaviaturasi ko'tarilmaydi (`inputMode="none"`): u ishchi
// maydonning yarmini yeydi va razbor ekrandan chiqib ketadi. Kompyuterda
// oddiy klaviatura ishlayveradi -- input haqiqiy input bo'lib qoladi.
// RAQAM QATORI MEXANIKANING O'ZIDA, topshiriq ma'lumotida emas.
// 2026-08-22 da qimmatga tushgan xato: 1-topshiriqning klaviaturasida
// `y · ( ) + − ^ 2` bor edi, RAQAM esa yo'q. Kompyuterda bilinmagan --
// u yerda oddiy klaviatura ishlaydi; telefonda esa tizim klaviaturasi
// ataylab yopilgani uchun javobni umuman kiritib bo'lmasdi.
// Endi 0-9 har doim turadi va uni topshiriq unuta olmaydi; `pad` esa
// faqat SHU topshiriqning belgilarini beradi (harf, amal, ≠, vergul).
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const PAD_BASE = ['(', ')', '·', '+', '−', '/'];
function ExprPad({ keys, onKey, onBack, disabled }) {
  const k = (label, fn, wide) => (
    <button key={label} type="button" disabled={disabled} onClick={fn} data-pad={label}
      style={{
        minWidth: wide ? 44 : 30, height: 30, padding: '0 6px', borderRadius: 8,
        border: '1.5px solid ' + C.line, background: disabled ? C.bg : '#fff',
        ...S.mono, fontSize: 15, color: disabled ? C.line : C.ink,
        cursor: disabled ? 'default' : 'pointer',
      }}>{label}</button>
  );
  const row = (items, top) => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: top }}>{items}</div>
  );
  return (
    <>
      {row(DIGITS.map((d) => k(d, () => onKey(d))), 6)}
      {row([...(keys || []).map((x) => k(x, () => onKey(x))), k('⌫', onBack, true)], 4)}
    </>
  );
}

function ExprField({ value, onChange, onBack, disabled, state, pad, placeholder, label, lang, big, name }) {
  const bd = state === 'ok' ? C.ok : (state === 'no' ? C.no : '#d6dae3');
  return (
    <div>
      {label ? <div style={{ fontSize: 12.5, fontWeight: 800, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 4 }}>{tr(label, lang)}</div> : null}
      <input data-input={name || '1'} value={value} disabled={disabled} placeholder={placeholder || ''}
        inputMode="none" autoComplete="off" spellCheck="false"
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', fontSize: big ? 23 : 20, fontWeight: 800,
          textAlign: 'center', padding: big ? '11px 12px' : '9px 12px', borderRadius: 13,
          border: '2px solid ' + bd, background: disabled ? '#fff' : C.bg, outline: 'none',
          fontFamily: S.mono.fontFamily, color: C.ink,
        }} />
      {pad && !disabled ? <ExprPad keys={pad} onKey={(x) => onChange(value + x)} onBack={onBack} disabled={disabled} /> : null}
    </div>
  );
}

// ============================================================ 8. TYPEEXPR
// Javob IFODA. `data.answer` — etalon yozuv, `data.hints` — noto'g'ri
// yozuvlar; har biri o'z razbori bilan va QIYMAT bo'yicha tanib olinadi,
// ya'ni «4+5y» ni qanday yozgani muhim emas.
export function TypeExpr({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.text != null) setVal(String(sa.text)); } });
  useEffect(() => { onReady?.(val.trim() !== '' && !A.checked); }, [val, A.checked, onReady]);

  const check = useCallback(() => {
    const correct = sameExpr(val, data.answer);
    let why = null;
    if (!correct) {
      const hit = (data.hints || []).find((h) => sameExpr(val, h.expr));
      why = hit ? tr(hit.text, lang) : pickWhy(data, { text: val }, lang);
    }
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { text: val },
      correctAnswer: { text: data.answer }, correct,
    }));
  }, [val, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '4px 0 10px' }}>
          <Row tokens={data.expr} size={data.exprSize || 28} />
        </div>
      ) : null}
      <p style={{ ...S.ask, margin: '4px 0 8px' }}>{tr(data.ask, lang)}</p>
      <ExprField value={val} onChange={(v) => !A.locked && setVal(v)} onBack={() => !A.locked && setVal(val.slice(0, -1))}
        disabled={A.locked} state={A.checked ? (A.fb?.correct ? 'ok' : 'no') : null}
        pad={data.pad || PAD_BASE} label={data.label} lang={lang} name="answer" big />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 9. ODZTWO
// Natija VA shart. Ikkalasi ALOHIDA sudlanadi va razbor ham alohida:
// «kasr to'g'ri, shart yo'qoldi» va «shart to'g'ri, kasr yo'q» — ikki xil
// xato (TIPLAR §5.2). Telefonda bitta maydon ochiq turadi.
export function OdzTwo({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [res, setRes] = useState('');
  const [odz, setOdz] = useState('');
  const [tab, setTab] = useState(0);
  const phone = useIsPhone();
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setRes(sa.res || ''); setOdz(sa.odz || ''); } } });
  useEffect(() => { onReady?.(res.trim() !== '' && odz.trim() !== '' && !A.checked); }, [res, odz, A.checked, onReady]);

  const judge = useCallback(() => {
    const resOk = sameExpr(res, data.answer);
    // Bitta sud, bitta natija: ikki marta chaqirilsa ikkovi ajralib ketardi.
    const p = (() => { try { return checkOdz(odz, data.odz, data.varName); } catch { return { ok: false, excluded: [] }; } })();
    return { resOk, odzOk: !!p.ok, res, odz, mine: p.mine || p.excluded || [] };
  }, [res, odz, data]);

  const check = useCallback(() => {
    const st = judge();
    const correct = st.resOk && st.odzOk;
    A.setFb({ correct, why: correct ? null : pickWhy(data, st, lang), st });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { res, odz },
      correctAnswer: { res: data.answer, odz: data.odz }, correct,
    }));
  }, [judge, res, odz, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const st = A.fb?.st;
  const tone = (ok) => (A.checked ? (ok ? 'ok' : 'no') : null);
  const fieldRes = (
    <ExprField value={res} onChange={(v) => !A.locked && setRes(v)} onBack={() => !A.locked && setRes(res.slice(0, -1))}
      disabled={A.locked} state={tone(st?.resOk)} pad={data.padRes || PAD_BASE} label={data.labelResult} lang={lang} name="res" />
  );
  const fieldOdz = (
    <ExprField value={odz} onChange={(v) => !A.locked && setOdz(v)} onBack={() => !A.locked && setOdz(odz.slice(0, -1))}
      disabled={A.locked} state={tone(st?.odzOk)} pad={data.padOdz || [data.varName, '≠', ',', '−', '0']} label={data.labelOdz} lang={lang} name="odz" />
  );
  const folded = (i, label, value) => (
    <button type="button" data-fold={i === 0 ? 'res' : 'odz'} onClick={() => setTab(i)} disabled={A.locked}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 12, border: '1.5px dashed ' + C.line, background: '#fff', cursor: A.locked ? 'default' : 'pointer', textAlign: 'left' }}>
      <span style={{ fontSize: 11.5, fontWeight: 800, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase' }}>{tr(label, lang)}</span>
      <span style={{ ...S.mono, fontSize: 16, color: value ? C.ink : C.line, flex: 1, textAlign: 'right' }}>{value || '—'}</span>
    </button>
  );

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '2px 0 8px' }}>
          <Row tokens={data.expr} size={data.exprSize || 26} />
        </div>
      ) : null}
      <p style={{ ...S.ask, margin: '2px 0 7px' }}>{tr(data.ask, lang)}</p>
      {phone && !A.checked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {tab === 0 ? fieldRes : folded(0, data.labelResult, res)}
          {tab === 1 ? fieldOdz : folded(1, data.labelOdz, odz)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{fieldRes}{fieldOdz}</div>
      )}
      {data.note && !A.locked ? <div style={{ ...S.note, marginTop: 7 }}>{tr(data.note, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 10. STEPSREASON
// Har qadamda IKKI slot: amal va uning ASOSI. Qadam faqat ikkalasi to'g'ri
// bo'lgandagina sanaladi -- aks holda javobni bilib, asosni taxmin qilib
// bo'lardi. Asoslar darsdagi USUL nomlari bilan ataladi (etalon §5).
export function StepsReason({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const n = data.steps.length;
  const [pick, setPick] = useState({ a: Array(n).fill(null), r: Array(n).fill(null) });
  const [held, setHeld] = useState(null); // { col: 'a'|'r', id }
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.pick) setPick(sa.pick); } });
  const full = pick.a.every(Boolean) && pick.r.every(Boolean);
  useEffect(() => { onReady?.(full && !A.checked); }, [full, A.checked, onReady]);

  const tapSlot = (col, i) => {
    if (A.locked) return;
    if (held && held.col === col) { setPick((p) => { const x = { a: p.a.slice(), r: p.r.slice() }; x[col][i] = held.id; return x; }); setHeld(null); return; }
    if (pick[col][i]) setPick((p) => { const x = { a: p.a.slice(), r: p.r.slice() }; x[col][i] = null; return x; });
  };
  const check = useCallback(() => {
    const okA = data.steps.every((s, i) => pick.a[i] === s.action);
    const okR = data.steps.every((s, i) => pick.r[i] === s.reason);
    const correct = okA && okR;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { a: pick.a, r: pick.r, okA, okR }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { pick },
      correctAnswer: { a: data.steps.map((s) => s.action), r: data.steps.map((s) => s.reason) }, correct,
    }));
  }, [pick, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const labelOf = (col, id) => {
    const src = col === 'a' ? data.actions : data.reasons;
    const f = src.find((x) => x.id === id);
    return f ? tr(f.label, lang) : '';
  };
  const slot = (col, i) => {
    const id = pick[col][i];
    const want = col === 'a' ? data.steps[i].action : data.steps[i].reason;
    let bd = id ? C.line : (held && held.col === col ? C.hot : C.line);
    let bg = id ? '#fff' : (held && held.col === col ? '#fff7f2' : C.bg);
    let col2 = C.ink;
    if (A.checked && id) { const good = id === want; bd = good ? C.ok : C.no; bg = good ? C.okBg : C.noBg; col2 = good ? C.ok : C.no; }
    return (
      <button type="button" data-slot={col + i} disabled={A.locked} onClick={() => tapSlot(col, i)}
        style={{ flex: 1, minHeight: 32, padding: '4px 7px', borderRadius: 10, border: '2px ' + (id ? 'solid' : 'dashed') + ' ' + bd, background: bg, color: col2, fontSize: 11.5, fontWeight: 700, lineHeight: 1.2, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
        {id ? labelOf(col, id) : ''}
      </button>
    );
  };
  const bank = (col, items) => {
    const usedIds = pick[col];
    return (
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {items.filter((x) => usedIds.indexOf(x.id) === -1).map((x) => (
          <button key={x.id} type="button" data-card={x.id} disabled={A.locked} onClick={() => setHeld(held && held.id === x.id ? null : { col, id: x.id })}
            style={{ padding: '4px 8px', borderRadius: 9, border: '1.5px solid ' + (held && held.id === x.id ? C.hot : C.line), background: held && held.id === x.id ? C.hotBg : '#fff', fontSize: 11.5, fontWeight: 700, color: C.soft, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit', maxWidth: 300, textAlign: 'left', lineHeight: 1.2 }}>
            {tr(x.label, lang)}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.start ? (
        <div style={{ textAlign: 'center', margin: '2px 0 7px' }}><Row tokens={data.start} size={data.exprSize || 26} /></div>
      ) : null}
      <div style={{ display: 'flex', gap: 7, marginBottom: 3 }}>
        <div style={{ width: 22 }} />
        <div style={{ flex: 1, ...S.bankLbl, marginBottom: 0 }}>{String(tr(data.colAction, lang)).toUpperCase()}</div>
        <div style={{ flex: 1, ...S.bankLbl, marginBottom: 0 }}>{String(tr(data.colReason, lang)).toUpperCase()}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {data.steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'stretch' }}>
            <div style={{ width: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 15, color: C.mute }}>{i + 1}</div>
            {slot('a', i)}{slot('r', i)}
          </div>
        ))}
      </div>
      {A.locked ? null : <div style={{ ...S.note, margin: '8px 0 5px' }}>{tr(data.ask, lang)}</div>}
      <div style={{ display: A.locked ? 'none' : 'flex', flexDirection: 'column', gap: 6, borderTop: '1px dashed ' + C.pale, paddingTop: 7 }}>
        {bank('a', data.actions)}
        {bank('r', data.reasons)}
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 11. BOUNDARY
// Ikki yozuv qayerda ajraladi. Javob — QIYMATLAR TO'PLAMI, ya'ni «hech
// qachon» ham javob (bo'sh to'plam). Tekshiruvdan keyin yozuvlarning o'sha
// nuqtadagi holati ochiladi: З16 mexanikaning ichida turadi, maslahat emas.
const NEVER_RE = /^(hech qachon|yo'q|yoq|нет|никогда|never|none|-|—|∅)$/i;
const parseSet = (raw, varName) => {
  const s = String(raw || '').trim();
  if (!s) return null;
  if (NEVER_RE.test(s)) return [];
  const body = s.replace(new RegExp('(^|[,\\s])' + varName + '\\s*=\\s*', 'g'), '$1');
  const out = [];
  for (const part of body.split(',')) {
    const t = part.trim();
    if (!t) continue;
    const r = (() => { try { return valueAt(t, {}); } catch { return { error: true }; } })();
    const v = r && !r.error ? r.value : null;
    if (v === null || v === undefined || !Number.isFinite(v)) return null;
    if (!out.some((x) => Math.abs(x - v) < 1e-9)) out.push(v);
  }
  return out.sort((a, b) => a - b);
};

export function Boundary({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.text != null) setVal(String(sa.text)); } });
  useEffect(() => { onReady?.(val.trim() !== '' && !A.checked); }, [val, A.checked, onReady]);

  const check = useCallback(() => {
    const set = parseSet(val, data.varName);
    const want = data.answer.slice().sort((a, b) => a - b);
    const correct = !!set && set.length === want.length && set.every((v, i) => Math.abs(v - want[i]) < 1e-9);
    A.setFb({ correct, why: correct ? null : pickWhy(data, { set, text: val, none: set !== null && set.length === 0 }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { text: val, set },
      correctAnswer: { set: want }, correct,
    }));
  }, [val, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const side = (tokens, label) => (
    <div style={{ flex: 1, minWidth: 0, textAlign: 'center', padding: '7px 4px', borderRadius: 12, background: C.bg, border: '1px solid #eef0f4' }}>
      {label ? <div style={{ fontSize: 10.5, fontWeight: 800, color: C.mute, letterSpacing: '.04em', marginBottom: 2 }}>{label}</div> : null}
      <Row tokens={tokens} size={data.exprSize || 22} />
    </div>
  );
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch', margin: '4px 0 8px' }}>
        {side(data.left)}
        <div style={{ display: 'flex', alignItems: 'center', ...S.mono, fontSize: 20, color: C.mute }}>?</div>
        {side(data.right)}
      </div>
      <p style={{ ...S.ask, margin: '2px 0 7px' }}>{tr(data.ask, lang)}</p>
      <ExprField value={val} onChange={(v) => !A.locked && setVal(v)} onBack={() => !A.locked && setVal(val.slice(0, -1))}
        disabled={A.locked} state={A.checked ? (A.fb?.correct ? 'ok' : 'no') : null}
        pad={data.pad || ['0', '1', '2', '3', '7', '−', ',']} label={data.label} lang={lang} name="value" />
      {A.checked && data.show ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {data.show.map((row, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 11, background: row.none ? C.noBg : C.okBg }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: row.none ? C.no : C.ok, marginBottom: 2 }}>{tr(row.cap, lang)}</div>
              <div style={{ ...S.mono, fontSize: 18, color: row.none ? C.no : C.ok }}>{row.v}</div>
            </div>
          ))}
        </div>
      ) : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 12. TAPFRAC
// Kasrning ICHIDA belgilash: qismlar ikki qavatda turadi. `TapTerms` chiziqli
// qatorni biladi, kasrni esa yo'q -- shuning uchun alohida.
export function TapFrac({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [marked, setMarked] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.marked) setMarked(sa.marked); } });
  useEffect(() => { onReady?.(marked.length > 0 && !A.checked); }, [marked, A.checked, onReady]);

  const toggle = (id) => { if (!A.locked) setMarked((m) => (m.indexOf(id) === -1 ? m.concat(id) : m.filter((x) => x !== id))); };
  const check = useCallback(() => {
    const extra = marked.filter((id) => data.want.indexOf(id) === -1);
    const miss = data.want.filter((id) => marked.indexOf(id) === -1);
    const correct = !extra.length && !miss.length;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { marked, extra, miss }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { marked: marked.slice() },
      correctAnswer: { marked: data.want }, correct,
    }));
  }, [marked, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const size = data.exprSize || 24;
  const chip = (p) => {
    const on = marked.indexOf(p.id) !== -1;
    let bd = C.line; let bg = C.bg; let col = C.ink; let dash = 'dashed';
    if (on) { bd = C.hot; bg = C.hotBg; dash = 'solid'; }
    if (A.checked) {
      dash = 'solid';
      const ok2 = A.fb?.correct;
      if (on) { bd = ok2 ? C.ok : C.no; bg = ok2 ? C.okBg : C.noBg; col = ok2 ? C.ok : C.no; }
      else { bd = C.pale; bg = '#fff'; }
    }
    return (
      <button key={p.id} type="button" aria-pressed={on} data-term={p.id} disabled={A.locked} onClick={() => toggle(p.id)}
        style={{ ...S.mono, fontSize: size, color: col, padding: '4px 8px', margin: '0 2px', borderRadius: 9, border: '2px ' + dash + ' ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
        {p.v}
      </button>
    );
  };
  const floor = (parts) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', padding: '3px 6px' }}>
      {parts.map(chip)}
    </div>
  );
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <p style={{ ...S.ask, margin: '4px 0 6px' }}>{tr(data.ask, lang)}</p>
      {data.note ? <div style={S.note}>{tr(data.note, lang)}</div> : null}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {floor(data.num)}
          <div style={{ height: 3, borderRadius: 2, background: C.ink, margin: '2px 0' }} />
          {floor(data.den)}
        </div>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 13. AUDITROWS
// Birinchi xato satr VA kontrprimer. Ikkinchi shartsiz bu «beshtadan
// bittasini tanlash» bo'lib qolardi (TIPLAR §5.6).
export function AuditRows({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [picked, setPicked] = useState(null);
  const [cnt, setCnt] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setPicked(sa.row ?? null); setCnt(sa.cnt || ''); } } });
  useEffect(() => { onReady?.(picked != null && cnt.trim() !== '' && !A.checked); }, [picked, cnt, A.checked, onReady]);

  const check = useCallback(() => {
    const rowOk = picked === data.answerId;
    const set = parseSet(cnt, data.varName);
    const v = set && set.length === 1 ? set[0] : null;
    const cntOk = v !== null && data.counter.some((c) => Math.abs(c - v) < 1e-9);
    const correct = rowOk && cntOk;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { picked, cnt, value: v, rowOk, cntOk }, lang), rowOk, cntOk });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { row: picked, cnt },
      correctAnswer: { row: data.answerId, cnt: data.counter }, correct,
    }));
  }, [picked, cnt, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Given data={data} lang={lang} />
      <p style={{ ...S.ask, margin: '2px 0 6px' }}>{tr(data.ask, lang)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 6 }}>
        {data.rows.map((r, i) => {
          const on = picked === r.id;
          let bd = '#d6dae3'; let bg = '#fff';
          if (on) { bd = C.hot; bg = C.hotBg; }
          if (A.checked && on) { const ok2 = A.fb?.correct; bd = ok2 ? C.ok : C.no; bg = ok2 ? C.okBg : C.noBg; }
          return (
            <button key={r.id} type="button" data-row={r.id} disabled={A.locked} onClick={() => setPicked(r.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 9px', borderRadius: 10, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer', textAlign: 'left' }}>
              <span style={{ ...S.mono, fontSize: 13, color: C.mute, flex: '0 0 16px' }}>{i + 1}</span>
              <LineBody l={{ label: r.text, tokens: r.tokens }} data={data} lang={lang} size={data.exprSize || 20} />
            </button>
          );
        })}
      </div>
      <ExprField value={cnt} onChange={(v) => !A.locked && setCnt(v)} onBack={() => !A.locked && setCnt(cnt.slice(0, -1))}
        disabled={A.locked} state={A.checked ? (A.fb?.cntOk ? 'ok' : 'no') : null}
        pad={data.pad || ['0', '1', '2', '−']} label={data.labelCounter} lang={lang} name="counter" />
      {data.note && !A.locked ? <div style={{ ...S.note, marginTop: 6 }}>{tr(data.note, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 14. BUILDFRAC
// Teskari masala: kasr XOSSALARI bo'yicha tekshiriladi, satr solishtirilmaydi
// (TIPLAR §5.5). Ikki maydon: surat va maxraj; karta faol maydonga tushadi.
//
// Uch shart, va uchtasi ham kerak:
//   value   -- yozuv `want.equalsTo` ga teng (checkReduction: tekshiruv
//              O'QUVCHI yozuvining sohasida boradi, aks holda yangi teshik
//              «xato» bo'lib chiqardi)
//   holes   -- taqiqlar to'plami aynan `want.holes`
//   parse   -- yozuv umuman razbor bo'lsin
export function BuildFrac({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [num, setNum] = useState([]);
  const [den, setDen] = useState([]);
  const [area, setArea] = useState('num');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setNum(sa.num || []); setDen(sa.den || []); } } });
  const lab = (id) => { const c = data.cards.find((x) => x.id === id); return c ? c.label : ''; };
  const text = (arr) => arr.map(lab).join('');
  const ready = num.length > 0 && den.length > 0;
  useEffect(() => { onReady?.(ready && !A.checked); }, [ready, A.checked, onReady]);

  const put = (id) => { if (A.locked) return; (area === 'num' ? setNum : setDen)((s) => s.concat(id)); };
  const back = () => { if (A.locked) return; (area === 'num' ? setNum : setDen)((s) => s.slice(0, -1)); };

  const judge = useCallback(() => {
    const built = '(' + text(num) + ')/(' + text(den) + ')';
    const red = (() => { try { return checkReduction(built, data.want.equalsTo); } catch { return { ok: false, why: 'parse' }; } })();
    const holes = (() => { try { const h = domainHoles(built, data.want.varName); return h.error ? null : h.holes; } catch { return null; } })();
    const want = data.want.holes.slice().sort((a, b) => a - b);
    const holesOk = !!holes && holes.length === want.length && holes.slice().sort((a, b) => a - b).every((v, i) => Math.abs(v - want[i]) < 1e-9);
    return { built, valueOk: !!red.ok, why: red.why, holes, holesOk };
  }, [num, den, data]);

  const check = useCallback(() => {
    const st = judge();
    const correct = st.valueOk && st.holesOk;
    A.setFb({ correct, why: correct ? null : pickWhy(data, st, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { num: num.slice(), den: den.slice(), text: st.built },
      correctAnswer: { equalsTo: data.want.equalsTo, holes: data.want.holes }, correct,
    }));
  }, [judge, num, den, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const floor = (key, arr) => {
    const on = area === key && !A.locked;
    return (
      <button type="button" data-area={key} disabled={A.locked} onClick={() => setArea(key)}
        style={{ display: 'block', width: '100%', minHeight: 42, padding: '4px 8px', border: 0, background: 'none', cursor: A.locked ? 'default' : 'pointer' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 120, minHeight: 34, padding: '2px 8px', borderRadius: 9, border: '2px ' + (on ? 'solid' : 'dashed') + ' ' + (on ? C.hot : C.pale), background: on ? '#fff7f2' : '#fff', ...S.mono, fontSize: 22, color: C.ink }}>
          {arr.length ? text(arr) : <span style={{ fontSize: 13, fontWeight: 700, color: C.mute }}>{tr(data.empty, lang)}</span>}
        </span>
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '2px 0 6px' }}><Row tokens={data.expr} size={data.exprSize || 24} /></div>
      ) : null}
      <p style={{ ...S.ask, margin: '2px 0 6px' }}>{tr(data.ask, lang)}</p>
      <div style={{ borderRadius: 15, border: '2px solid ' + (A.checked ? (A.fb?.correct ? C.ok : C.no) : C.pale), background: '#fff', padding: '3px 6px', margin: '0 0 7px' }}>
        {floor('num', num)}
        <div style={{ height: 3, borderRadius: 2, background: C.ink, margin: '1px 10px' }} />
        {floor('den', den)}
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {data.cards.map((c) => (
          <button key={c.id} type="button" data-card={c.id} disabled={A.locked} onClick={() => put(c.id)}
            style={{ minWidth: 40, padding: '0 9px', height: 40, borderRadius: 11, border: '2px solid ' + C.line, background: '#fff', ...S.mono, fontSize: 20, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
            {c.label}
          </button>
        ))}
        <button type="button" disabled={A.locked} onClick={back}
          style={{ marginLeft: 4, padding: '7px 12px', borderRadius: 11, border: '1.5px solid #d6dae3', background: '#fff', color: C.soft, fontSize: 13, fontWeight: 700, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {tr(data.undo, lang)}
        </button>
      </div>
      {data.note ? <div style={{ ...S.note, marginTop: 7 }}>{tr(data.note, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ############################################################################
// 2-DARS AMALIYOTINING YETTI MEXANIKASI (4-10 topshiriqlar).
//
// Metodist qarori 2026-08-22: 4-dan 10-gacha hammasi tubdan almashtirildi.
// Tanlash mezoni bitta: HAR BIRIDA BARMOQ BOSHQACHA ISH QILSIN. Oldingi
// to'plamda yettitadan to'rttasi «kartani bosib joyga qo'yish» edi va ular
// o'quvchi uchun bir xil ko'rinardi.
//
//   ValueTable  4   katakni to'ldiradi va buzilgan QATORNI belgilaydi
//   MatchPairs  5   chapdan yozuvni, o'ngdan shartni bosadi
//   HoleSlider  6   surgichni siljitadi, ikki yozuv jonli hisoblanadi
//   OrderLines  7   yechim satrlarini ketma-ketlikka qo'yadi
//   StrikeOut   8   qisqaradigan ko'paytuvchini CHIZIB tashlaydi
//   NumberLine  9   son o'qiga taqiqlangan nuqtalarni qo'yadi
//   RepairPart 10   noto'g'ri yozuvning bitta qismini almashtiradi
//
// USLUB O'ZGARMAYDI: `S`, `C`, `HFB`, `Head` -- 7-sinfning ranglari va
// o'lchamlari. Balandlik byudjeti 1366x615 da 363px.
//
// TORTISH YO'Q, faqat BOSISH (3-sinf kanoni §3.6) -- bitta istisno bilan:
// `HoleSlider` da surgich BUTUN SONLI qadamlar bilan yuradi, ya'ni barmoq
// oraliq qiymatga tushib qolmaydi.
// ############################################################################

// Kichik kiritish katagi: jadval va tuzatish uchun. `ExprField` dan farqi --
// bitta qatorga sig'adi va o'z klaviaturasini ko'tarmaydi.
function Cell({ value, onChange, disabled, state, name, w = 74 }) {
  const bd = state === 'ok' ? C.ok : (state === 'no' ? C.no : '#d6dae3');
  return (
    <input data-input={name} value={value} disabled={disabled} inputMode="none"
      autoComplete="off" spellCheck="false" onChange={(e) => onChange(e.target.value)}
      style={{
        width: w, boxSizing: 'border-box', textAlign: 'center', padding: '5px 4px',
        borderRadius: 9, border: '2px solid ' + bd, background: disabled ? '#fff' : C.bg,
        outline: 'none', ...S.mono, fontSize: 16, color: C.ink,
      }} />
  );
}

// Sonli javobni o'qish: «3», «−3», «1/2», «0,5» -- hammasi son.
const num = (raw) => {
  const t = String(raw || '').trim().replace(',', '.');
  if (!t) return null;
  try { const r = valueAt(t, {}); return r && !r.error && Number.isFinite(r.value) ? r.value : null; }
  catch { return null; }
};
const near = (a, b) => a !== null && b !== null && Math.abs(a - b) < 1e-9;

const shuffled = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
};

// ============================================================ 15. VALUETABLE
// Javobni SON bilan tekshirish (З16) mexanikaning o'zida.
// Chap ustun to'ldirilgan, o'ngini o'quvchi hisoblaydi, so'ng ikki yozuv
// AJRALGAN qatorni belgilaydi (metodist tanlovi 2026-08-22).
// Teshik qatorida kiritish maydoni YO'Q: u yerda javob son emas, «qiymat yo'q».
export function ValueTable({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const inputRows = data.rows.filter((r) => !r.hole);
  const [cells, setCells] = useState(() => Object.fromEntries(inputRows.map((r) => [r.id, ''])));
  const [row, setRow] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setCells(sa.cells || {}); setRow(sa.row ?? null); } } });
  const filled = inputRows.every((r) => String(cells[r.id] || '').trim() !== '');
  useEffect(() => { onReady?.(filled && row != null && !A.checked); }, [filled, row, A.checked, onReady]);

  const cellOk = (r) => near(num(cells[r.id]), r.right);
  const check = useCallback(() => {
    const bad = inputRows.filter((r) => !cellOk(r)).map((r) => r.id);
    const rowOk = row === data.answerRow;
    const correct = !bad.length && rowOk;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { cells, row, bad, rowOk, cellsOk: !bad.length }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { cells: { ...cells }, row },
      correctAnswer: { row: data.answerRow }, correct,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, row, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const head = (t) => <div style={{ ...S.bankLbl, marginBottom: 0, textAlign: 'center' }}>{t}</div>;
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr 1fr', gap: 5, alignItems: 'center', margin: '6px 0 4px' }}>
        {head(data.varName)}
        <div style={{ textAlign: 'center' }}><Row tokens={data.leftHead} size={data.exprSize || 19} /></div>
        <div style={{ textAlign: 'center' }}><Row tokens={data.rightHead} size={data.exprSize || 19} /></div>
        {data.rows.map((r, i) => {
          const on = row === i;
          const bad = A.checked && on && !A.fb?.correct;
          const good = A.checked && on && A.fb?.correct;
          const bg = bad ? C.noBg : (good ? C.okBg : (on ? C.hotBg : 'transparent'));
          const bd = bad ? C.no : (good ? C.ok : (on ? C.hot : C.pale));
          const cellStyle = { padding: '4px 2px', borderTop: '1.5px solid ' + bd, borderBottom: '1.5px solid ' + bd, background: bg, textAlign: 'center', cursor: A.locked ? 'default' : 'pointer' };
          const tap = () => { if (!A.locked) setRow(on ? null : i); };
          return (
            <React.Fragment key={r.id}>
              <div data-row={r.id} onClick={tap} style={{ ...cellStyle, borderLeft: '1.5px solid ' + bd, borderRadius: '9px 0 0 9px', ...S.mono, fontSize: 16, color: C.ink }}>{r.v}</div>
              <div onClick={tap} style={{ ...cellStyle, ...S.mono, fontSize: 15, color: r.hole ? C.no : C.soft }}>{r.left}</div>
              <div style={{ ...cellStyle, borderRight: '1.5px solid ' + bd, borderRadius: '0 9px 9px 0', cursor: 'default' }}>
                {r.hole
                  ? <span onClick={tap} style={{ ...S.mono, fontSize: 16, color: C.mute, cursor: A.locked ? 'default' : 'pointer' }}>?</span>
                  : <Cell name={'c' + r.id} value={cells[r.id] || ''} disabled={A.locked} w={64}
                      state={A.checked ? (cellOk(r) ? 'ok' : 'no') : null}
                      onChange={(v) => setCells((c) => ({ ...c, [r.id]: v }))} />}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {!A.locked ? <div style={S.note}>{tr(data.ask, lang)}</div> : null}
      {!A.locked ? <ExprPad keys={data.pad || ['−', '/']} onKey={(x) => {
        const t = inputRows.find((r) => String(cells[r.id] || '').trim() === '') || inputRows[inputRows.length - 1];
        setCells((c) => ({ ...c, [t.id]: (c[t.id] || '') + x }));
      }} onBack={() => {
        const rev = inputRows.slice().reverse();
        const t = rev.find((r) => String(cells[r.id] || '').trim() !== '') || inputRows[0];
        setCells((c) => ({ ...c, [t.id]: String(c[t.id] || '').slice(0, -1) }));
      }} disabled={A.locked} /> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 16. MATCHPAIRS
// Chapdan yozuvni, o'ngdan shartni bosadi. Juftlik raqam bilan belgilanadi.
//
// `connect: true` bo'lsa, juftlik ustiga EGRI CHIZIQ ham tortiladi (metodist,
// 2026-08-22, 1-dars 10-topshirig'i). Ilgari bu yerda «chiziq tortilmaydi»
// deb yozilgan edi va sabab haqiqiy: to'g'ri chiziqlar ikki ustun orasidagi
// tor joyda bir-birining ustiga tushardi. Endi ikki ustun orasida ALOHIDA
// yo'lak bor va chiziq egri (kubik Bezye) — shuning uchun chiziqlar ajralib
// turadi. Ikki ustunli eski ko'rinish tegilmagan: `connect` yo'q darslarda
// (2, 3, 4, 6) hamma narsa o'sha-o'sha.
//
// O'lchov DOM dan olinadi (qatorlarning balandligi matnga qarab o'zgaradi),
// lekin `requestAnimationFrame` ichida: effektning O'ZIDA setState qilinmaydi.
// `ResizeObserver` — til almashganda va telefonda zoom o'zgarganda qayta o'lchash.
export function MatchPairs({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [pair, setPair] = useState({});          // itemId -> targetId
  const [held, setHeld] = useState(null);
  const [lines, setLines] = useState([]);
  const wrapRef = useRef(null);
  const cellRef = useRef({});
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.pair) setPair(sa.pair); } });
  const right = useMemo(() => (data.noShuffle ? data.targets : shuffled(data.targets)), [data]);
  const all = data.items.every((it) => pair[it.id]);
  useEffect(() => { onReady?.(all && !A.checked); }, [all, A.checked, onReady]);

  const tapLeft = (id) => {
    if (A.locked) return;
    if (pair[id]) { setPair((p) => { const n = { ...p }; delete n[id]; return n; }); setHeld(null); return; }
    setHeld(held === id ? null : id);
  };
  const tapRight = (tid) => {
    if (A.locked || !held) return;
    setPair((p) => {
      const n = { ...p };
      Object.keys(n).forEach((k) => { if (n[k] === tid) delete n[k]; });
      n[held] = tid; return n;
    });
    setHeld(null);
  };
  const check = useCallback(() => {
    const bad = data.items.filter((it) => pair[it.id] !== data.answer[it.id]).map((it) => it.id);
    const correct = !bad.length;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { pair, bad }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { pair: { ...pair } },
      correctAnswer: { pair: data.answer }, correct,
    }));
  }, [pair, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // Egri chiziqlar. Boshi — chap kataknning o'ng qirrasi, oxiri — o'ng
  // kataknning chap qirrasi; nazorat nuqtalari gorizontal, ya'ni chiziq
  // katakdan TO'G'RI chiqadi va to'g'ri kiradi, o'rtasi esa egiladi.
  useEffect(() => {
    const el = wrapRef.current;
    if (!data.connect || !el) return undefined;
    let raf = 0;
    const measure = () => {
      raf = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const out = [];
        data.items.forEach((it) => {
          const tid = pair[it.id];
          const l = cellRef.current['L' + it.id];
          const rr = tid ? cellRef.current['R' + tid] : null;
          if (!l || !rr) return;
          const a = l.getBoundingClientRect();
          const b = rr.getBoundingClientRect();
          const x1 = a.right - box.left; const y1 = a.top + a.height / 2 - box.top;
          const x2 = b.left - box.left; const y2 = b.top + b.height / 2 - box.top;
          const dx = Math.max(14, (x2 - x1) * 0.62);
          // TO'G'RISIDAGI qator bilan juftlansa — chiziq TO'G'RI (metodist,
          // 2026-08-24; bu 2026-08-22 dagi «kamon» qarorini bekor qiladi).
          // Ikki katakning markazi bir balandlikda bo'lsa, egishga sabab yo'q.
          // Qolgan juftliklarda chiziq avvalgidek egri: katakdan gorizontal
          // chiqadi, o'rtasida esa ko'tariladi yoki tushadi.
          const flat = Math.abs(y2 - y1) < 6;
          out.push({ id: it.id, d: flat
            ? `M${x1},${y1} L${x2},${y2}`
            : `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}` });
        });
        setLines(out);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [pair, data, lang, A.checked]);

  const badgeOf = (tid) => {
    const it = data.items.find((x) => pair[x.id] === tid);
    return it ? data.items.indexOf(it) + 1 : null;
  };
  const ch = data.connect ? (phone ? 34 : 52) : 0;
  const lineCol = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.stage2;
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {/* IKKI USTUN BITTA PANJARADA. Ilgari ular ikki alohida ustun edi va
          freymlar balandligi mos tushmasdi: chapda kasr baland, o'ngda matn
          past. Endi har qator panjaraning BITTA qatori, ya'ni ikkala tomon
          birga cho'ziladi va vertikal o'lchamlari teng (metodist, 2026-08-22). */}
      <div ref={wrapRef} style={{ position: 'relative', margin: '6px 0 4px' }}>
        {data.connect ? (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {lines.map((l) => (
              <path key={l.id} d={l.d} fill="none" stroke={lineCol} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            ))}
          </svg>
        ) : null}
        <div style={{ display: 'grid', gridTemplateColumns: data.connect ? `1fr ${ch}px 1fr` : '1fr 1fr', gap: 5, alignItems: 'stretch' }}>
          {data.items.map((it, i) => {
            const t = right[i];
            const linked = !!pair[it.id];
            const lBad = A.checked && !A.fb?.correct;
            let lBd = C.line; let lBg = '#fff';
            if (held === it.id) { lBd = C.hot; lBg = C.hotBg; }
            else if (linked) { lBd = A.checked ? (lBad ? C.no : C.ok) : C.stage2; lBg = A.checked ? (lBad ? C.noBg : C.okBg) : '#fff'; }

            const b = badgeOf(t.id);
            const rBad = A.checked && !A.fb?.correct;
            let rBd = held ? C.hot : C.line; let rBg = held ? '#fff7f2' : '#fff';
            if (b) { rBd = A.checked ? (rBad ? C.no : C.ok) : C.stage2; rBg = A.checked ? (rBad ? C.noBg : C.okBg) : '#fff'; }

            const cell = { display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 10, height: '100%', boxSizing: 'border-box', cursor: A.locked ? 'default' : 'pointer', position: 'relative', zIndex: 1 };
            return (
              <React.Fragment key={it.id}>
                <button type="button" data-left={it.id} disabled={A.locked} onClick={() => tapLeft(it.id)}
                  ref={(n) => { cellRef.current['L' + it.id] = n; }}
                  style={{ ...cell, border: '2px solid ' + lBd, background: lBg }}>
                  <span style={{ ...S.mono, fontSize: 11, color: C.mute, flex: '0 0 12px' }}>{i + 1}</span>
                  {/* Chap ustunda yozuv ham, SO'Z ham turishi mumkin (1-dars
                      amaliyoti, 10): u yerda chapda ma'lumot, o'ngda kasr. */}
                  {it.tokens
                    ? <Row tokens={it.tokens} size={data.itemSize || 16} />
                    : <span style={{ fontSize: phone ? 11.5 : 12.5, fontWeight: 600, color: C.soft, lineHeight: 1.2, textAlign: 'left' }}>{tr(it.label, lang)}</span>}
                </button>
                {data.connect ? <span aria-hidden="true" /> : null}
                <button type="button" data-right={t.id} disabled={A.locked} onClick={() => tapRight(t.id)}
                  ref={(n) => { cellRef.current['R' + t.id] = n; }}
                  style={{ ...cell, border: '2px solid ' + rBd, background: rBg }}>
                  <span style={{ ...S.mono, fontSize: 11, color: b ? C.stage2 : C.pale, flex: '0 0 12px' }}>{b || '·'}</span>
                  {t.tokens
                    ? <Row tokens={t.tokens} size={data.targetSize || 17} />
                    : <span style={{ ...S.mono, fontSize: 15, color: C.ink }}>{tr(t.label, lang)}</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {!A.locked ? <div style={S.note}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 17. HOLESLIDER
// Surgich BUTUN SONLI qadamlar bilan yuradi: uzluksiz surgichda barmoq
// kerakli qiymatga tushmaydi va topshiriq epchillikka aylanardi.
// Ikki yozuvning qiymati JONLI hisoblanadi -- «son bilan tekshirish» shu
// yerda ko'z bilan ko'rinadi.
export function HoleSlider({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [v, setV] = useState(data.start ?? data.from);
  const [moved, setMoved] = useState(false);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.v != null) { setV(sa.v); setMoved(true); } } });
  useEffect(() => { onReady?.(moved && !A.checked); }, [moved, A.checked, onReady]);

  const valOf = (expr) => {
    try {
      const env = {}; env[data.varName] = v;
      const r = valueAt(expr, env);
      if (!r || r.error || r.value === null || !Number.isFinite(r.value)) return null;
      return Math.round(r.value * 1000) / 1000;
    } catch { return null; }
  };
  const lv = valOf(data.leftExpr);
  const rv = valOf(data.rightExpr);

  const check = useCallback(() => {
    const correct = v === data.answer;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { v, lv, rv }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { v },
      correctAnswer: { v: data.answer }, correct,
    }));
  }, [v, lv, rv, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // JAVOBNI AYTIB QO'YMAYDI (metodist, 2026-08-22). Ilgari qiymat yo'q
  // bo'lganda panel «qiymat yo'q» deb QIZIL yozardi -- ya'ni o'quvchi
  // surgichni surib, yozuvni o'qimasdan, qizil matn chiqqan joyda to'xtardi.
  // Endi panel faqat QO'YILGAN SONLARNI ko'rsatadi: surat va maxraj alohida.
  // Nolga bo'lishni o'quvchining O'ZI tanishi kerak -- bu darsning mazmuni.
  // Ranglar ham tekshirishdan keyin paydo bo'ladi, undan oldin emas.
  const sub = (numExpr, denExpr) => {
    const n = valOf(numExpr);
    const d = valOf(denExpr);
    return { n, d };
  };
  const pane = (tokens, value, numExpr, denExpr) => {
    const parts = numExpr && denExpr ? sub(numExpr, denExpr) : null;
    const tone = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.ink;
    return (
      <div style={{ flex: 1, minWidth: 0, textAlign: 'center', padding: '6px 4px', borderRadius: 12, background: C.bg, border: '1px solid #eef0f4' }}>
        <Row tokens={tokens} size={data.exprSize || 18} />
        <div style={{ ...S.mono, fontSize: 19, marginTop: 3, color: tone }}>
          {parts
            ? <Frac n={parts.n === null ? '—' : parts.n} d={parts.d === null ? '—' : parts.d} size={22} />
            : (value === null ? tr(data.noValue, lang) : value)}
        </div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <div style={{ display: 'flex', gap: 7, margin: '5px 0 7px', alignItems: 'stretch' }}>
        {pane(data.left, lv, data.leftNum, data.leftDen)}
        {pane(data.right, rv, data.rightNum, data.rightDen)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ ...S.mono, fontSize: 17, color: C.hot, minWidth: 54, textAlign: 'right' }}>{data.varName} = {v}</span>
        <input type="range" data-slider="1" min={data.from} max={data.to} step={1} value={v} disabled={A.locked}
          onChange={(e) => { setV(Number(e.target.value)); setMoved(true); }}
          style={{ flex: 1, accentColor: C.hot, cursor: A.locked ? 'default' : 'pointer' }} />
      </div>
      {!A.locked ? <div style={{ ...S.note, marginTop: 6 }}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 18. ORDERLINES
// Yechim satrlarini ketma-ketlikka qo'yadi. TORTISH YO'Q: bankdan satrni
// bosasiz -- u ro'yxat oxiriga tushadi; ro'yxatdagini bosasiz -- qaytib chiqadi.
// Qadam kartasi. `tokens` — matematika, `label` — SO'Z (9-sinf amaliyoti uchun
// qo'shildi 2026-08-26: yechim zanjirida «Ildiz ostida manfiy son bo'lmaydi»
// kabi so'z qadamlari ham bor). Ikkalasi bir kartada ham tura oladi: shunda
// so'z uch tilda, matematika esa bitta nusxada qoladi. 8-sinfning hamma
// kartalarida faqat `tokens` bor — ular uchun hech nima o'zgarmaydi.
const LineBody = ({ l, data, lang, size }) => (
  <>
    {l.label ? <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.25, textAlign: 'left' }}>{tr(l.label, lang)}</span> : null}
    {l.tokens ? <Row tokens={l.tokens} size={size || data.itemSize || 17} /> : null}
  </>
);

export function OrderLines({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [seq, setSeq] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.seq) setSeq(sa.seq); } });
  const pool = useMemo(() => (data.noShuffle ? data.lines : shuffled(data.lines)), [data]);
  const rest = pool.filter((l) => seq.indexOf(l.id) === -1);
  useEffect(() => { onReady?.(seq.length === data.lines.length && !A.checked); }, [seq, data.lines.length, A.checked, onReady]);

  const check = useCallback(() => {
    const correct = seq.join('|') === data.answer.join('|');
    const firstBad = seq.findIndex((id, i) => id !== data.answer[i]);
    A.setFb({ correct, why: correct ? null : pickWhy(data, { seq, firstBad }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { seq: seq.slice() },
      correctAnswer: { seq: data.answer }, correct,
    }));
  }, [seq, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const lineOf = (id) => data.lines.find((l) => l.id === id);
  return (
    <div style={S.wrap}>
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '5px 0 6px', minHeight: 40 }}>
        {seq.map((id, i) => {
          const good = A.checked && A.fb?.correct;
          const bd = A.checked ? (good ? C.ok : C.no) : C.stage2;
          const bg = A.checked ? (good ? C.okBg : C.noBg) : '#fff';
          return (
            <button key={id} type="button" data-line={id} disabled={A.locked}
              onClick={() => setSeq((s) => s.filter((x) => x !== id))}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 8px', borderRadius: 10, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer', textAlign: 'left' }}>
              <span style={{ ...S.mono, fontSize: 12, color: C.mute, flex: '0 0 14px' }}>{i + 1}</span>
              <LineBody l={lineOf(id)} data={data} lang={lang} />
            </button>
          );
        })}
        {seq.length === 0 ? <div style={{ ...S.note, textAlign: 'center', padding: '10px 0', margin: 0 }}>{tr(data.empty, lang)}</div> : null}
      </div>
      {!A.locked ? (
        <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rest.map((l) => (
            <button key={l.id} type="button" data-card={l.id} disabled={A.locked} onClick={() => setSeq((s) => s.concat(l.id))}
              style={{ display: 'flex', alignItems: 'center', padding: '3px 8px', borderRadius: 10, border: '1.5px solid ' + C.line, background: '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <LineBody l={l} data={data} lang={lang} />
            </button>
          ))}
        </div>
      ) : null}
      {!A.locked ? <div style={{ ...S.note, marginTop: 5 }}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 19. STRIKEOUT
// Qisqaradigan ko'paytuvchini CHIZIB tashlaydi. Metodist qarori 2026-08-22:
// bu yerda faqat BELGILAYDI, natijani yozmaydi -- qisqartirishning o'zi
// 3-darsning ishi (Dars02.jsx: «3-DARS BILAN CHEGARA»).
// Ikkinchi yozuvda hech narsa chizilmaydi: u yerda bir xil ko'ringan narsa
// KO'PAYTUVCHI emas, QO'SHILUVCHI (З1).
export function StrikeOut({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [cut, setCut] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.cut) setCut(sa.cut); } });
  useEffect(() => { onReady?.(cut.length > 0 && !A.checked); }, [cut, A.checked, onReady]);

  const toggle = (id) => { if (!A.locked) setCut((c) => (c.indexOf(id) === -1 ? c.concat(id) : c.filter((x) => x !== id))); };
  const check = useCallback(() => {
    const extra = cut.filter((id) => data.want.indexOf(id) === -1);
    const miss = data.want.filter((id) => cut.indexOf(id) === -1);
    const correct = !extra.length && !miss.length;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { cut, extra, miss }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { cut: cut.slice() },
      correctAnswer: { cut: data.want }, correct,
    }));
  }, [cut, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const size = data.exprSize || 20;
  const part = (p) => {
    const on = cut.indexOf(p.id) !== -1;
    let col = C.ink; let bd = 'transparent';
    if (on) col = C.hot;
    if (A.checked && on) { const ok2 = A.fb?.correct; col = ok2 ? C.ok : C.no; bd = ok2 ? C.ok : C.no; }
    return (
      <button key={p.id} type="button" data-part={p.id} disabled={A.locked} onClick={() => toggle(p.id)}
        style={{ position: 'relative', ...S.mono, fontSize: size, color: col, padding: '2px 5px', border: '1.5px dashed ' + bd, borderRadius: 7, background: 'none', cursor: A.locked ? 'default' : 'pointer' }}>
        {p.v}
        {on ? <span style={{ position: 'absolute', left: 3, right: 3, top: '50%', height: 2.5, background: col, borderRadius: 2, transform: 'rotate(-8deg)' }} /> : null}
      </button>
    );
  };
  const frac = (rec) => (
    <div key={rec.id} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', margin: '0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 4px' }}>{rec.num.map(part)}</div>
      <div style={{ height: 2.5, background: C.ink, borderRadius: 2 }} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 4px' }}>{rec.den.map(part)}</div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 4, margin: '8px 0 6px' }}>
        {data.recs.map(frac)}
      </div>
      {!A.locked ? <div style={S.note}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 20. NUMBERLINE
// Son o'qiga taqiqlangan qiymatlarni qo'yadi. Nuqta BO'SH: 2-darsda
// «to'la/bo'sh» farqi hali ma'no bermaydi, u tengsizliklarda (25-29-darslar)
// paydo bo'ladi. Ishlatilmaydigan mexanikani oldindan yozmaymiz.
export function NumberLine({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [marks, setMarks] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.marks) setMarks(sa.marks); } });
  useEffect(() => { onReady?.(marks.length > 0 && !A.checked); }, [marks, A.checked, onReady]);

  const ticks = [];
  for (let x = data.from; x <= data.to; x += 1) ticks.push(x);
  const toggle = (x) => { if (!A.locked) setMarks((m) => (m.indexOf(x) === -1 ? m.concat(x) : m.filter((y) => y !== x))); };
  const check = useCallback(() => {
    const want = data.answer.slice().sort((a, b) => a - b);
    const mine = marks.slice().sort((a, b) => a - b);
    const extra = mine.filter((x) => want.indexOf(x) === -1);
    const miss = want.filter((x) => mine.indexOf(x) === -1);
    const correct = !extra.length && !miss.length;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { marks: mine, extra, miss }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { marks: mine },
      correctAnswer: { marks: want }, correct,
    }));
  }, [marks, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const pct = (x) => ((x - data.from) / (data.to - data.from)) * 100;
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? <div style={{ textAlign: 'center', margin: '4px 0 8px' }}><Row tokens={data.expr} size={data.exprSize || 24} /></div> : null}
      <div style={{ position: 'relative', height: 62, margin: '4px 0 2px' }}>
        <div style={{ position: 'absolute', left: 6, right: 6, top: 22, height: 2, background: C.line, borderRadius: 2 }} />
        {ticks.map((x) => {
          const on = marks.indexOf(x) !== -1;
          let col = C.line;
          if (on) col = C.hot;
          if (A.checked && on) col = A.fb?.correct ? C.ok : C.no;
          return (
            <button key={x} type="button" data-tick={x} disabled={A.locked} onClick={() => toggle(x)}
              style={{ position: 'absolute', left: `calc(${pct(x)}% - 15px)`, top: 4, width: 30, height: 54, border: 0, background: 'none', padding: 0, cursor: A.locked ? 'default' : 'pointer' }}>
              <span style={{ display: 'block', width: 2, height: 10, margin: '0 auto', background: C.line }} />
              <span style={{ display: 'block', width: on ? 13 : 7, height: on ? 13 : 7, margin: '-6px auto 0', borderRadius: '50%', background: on ? '#fff' : 'transparent', border: on ? '2.5px solid ' + col : 'none' }} />
              <span style={{ display: 'block', marginTop: 4, ...S.mono, fontSize: 11, color: on ? C.hot : C.mute }}>{x}</span>
            </button>
          );
        })}
      </div>
      {!A.locked ? <div style={S.note}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 21. REPAIRPART
// Tayyor, lekin NOTO'G'RI yozuvning BITTA qismini almashtiradi.
// Ikki qadam: avval buzuq qismni bosadi, so'ng almashtiruvchini tanlaydi.
// Ikkalasi ham to'g'ri bo'lishi shart -- aks holda bu «to'rttadan bittasi».
export function RepairPart({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [spot, setSpot] = useState(null);
  const [pick, setPick] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setSpot(sa.spot ?? null); setPick(sa.pick ?? null); } } });
  useEffect(() => { onReady?.(spot != null && pick != null && !A.checked); }, [spot, pick, A.checked, onReady]);

  const check = useCallback(() => {
    const spotOk = spot === data.wrongId;
    const pickOk = pick === data.answerId;
    const correct = spotOk && pickOk;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { spot, pick, spotOk, pickOk }, lang), spotOk });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { spot, pick },
      correctAnswer: { spot: data.wrongId, pick: data.answerId }, correct,
    }));
  }, [spot, pick, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const size = data.exprSize || 21;
  const part = (p) => {
    const on = spot === p.id;
    let bd = C.pale; let bg = C.bg; let col = C.ink;
    if (on) { bd = C.hot; bg = C.hotBg; }
    if (A.checked && on) { const ok2 = A.fb?.correct; bd = ok2 ? C.ok : C.no; bg = ok2 ? C.okBg : C.noBg; col = ok2 ? C.ok : C.no; }
    const shown = (on && pick && !A.checked) || (A.checked && on && p.id === data.wrongId)
      ? (data.options.find((o) => o.id === pick) || {}).v || p.v : p.v;
    return (
      <button key={p.id} type="button" data-part={p.id} disabled={A.locked} onClick={() => { setSpot(on ? null : p.id); setPick(null); }}
        style={{ ...S.mono, fontSize: size, color: col, padding: '3px 7px', margin: '0 2px', borderRadius: 8, border: '2px dashed ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
        {shown}
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.target ? (
        <div style={{ textAlign: 'center', margin: '2px 0 6px' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase', marginRight: 8 }}>{tr(data.targetLabel, lang)}</span>
          <Row tokens={data.target} size={data.exprSize ? data.exprSize - 3 : 18} />
        </div>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 6px' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 4px' }}>{data.num.map(part)}</div>
          <div style={{ height: 2.5, background: C.ink, borderRadius: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 4px' }}>{data.den.map(part)}</div>
        </div>
      </div>
      {spot != null && !A.locked ? (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', borderTop: '1px dashed ' + C.pale, paddingTop: 7 }}>
          {data.options.map((o) => (
            <button key={o.id} type="button" data-opt={o.id} onClick={() => setPick(o.id)}
              style={{ minWidth: 52, padding: '0 10px', height: 40, borderRadius: 11, border: '2px solid ' + (pick === o.id ? C.hot : C.line), background: pick === o.id ? C.hotBg : '#fff', ...S.mono, fontSize: 19, color: C.ink, cursor: 'pointer' }}>
              {o.v}
            </button>
          ))}
        </div>
      ) : null}
      {!A.locked ? <div style={{ ...S.note, marginTop: 6 }}>{tr(spot == null ? data.ask : data.ask2, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ############################################################################
// 8-SINF, 1-DARS AMALIYOTI UCHUN QO'SHILGAN MEXANIKALAR (metodist, 2026-08-22).
//
// NEGA YANGI. 1-dars amaliyoti qayta yaratildi va metodist o'nta topshiriqning
// har birida BARMOQ NIMA QILISHINI aniq ko'rsatdi. Beshtasi yuqoridagi 21
// mexanikaning hech biriga tushmadi:
//   TrueFalse  -- har mulohaza yonida «Ha» va «Yo'q» (bir nechta qaror birga)
//   PairSlots  -- oltita KVADRAT kartani juftlab uchta bo'sh kartaga qo'yish
//   CodeLock   -- seyf kodi: uch uya, tartib muhim
//   ClozeBank  -- MATNDAGI bo'shliqqa so'z qo'yish (SlotsBank yozuvni biladi,
//                 matnni emas; kartalar ham so'z, ya'ni L() ichida)
//   SwapOrder  -- bir qatordagi ikki kartani bosib JOYINI ALMASHTIRISH
//                 (OrderLines bankdan ro'yxatga yig'adi, bu boshqa harakat)
//
// USLUB O'ZGARMAYDI: hammasi `S`, `C`, `HFB`, `Head` dan foydalanadi -- ya'ni
// 7-sinf amaliyotining ranglari va o'lchamlari. Balandlik byudjeti o'sha:
// 1366x615 da 363px, shuning uchun telefon va past ekran uchun `useIsPhone`.
//
// XATO JAVOBDAN KEYIN YASHIL RANG QOLMAYDI (metodist, 2026-08-22): javob
// noto'g'ri bo'lsa, o'quvchi tanlagan HAMMA joy qizil bo'ladi -- qaysi biri
// noto'g'ri ekani ko'rsatilmaydi, aks holda bu to'g'ri javobni aytib qo'yish.
// ############################################################################

// ============================================================ 22. TRUEFALSE
// To'rt mulohaza, to'rt qaror. Har qatorda: kasr, tekshiriladigan qiymat
// (`at` -- matematika), da'vo (`claim` -- so'z) va ikki tugma.
export function TrueFalse({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [ans, setAns] = useState({});
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.ans) setAns(sa.ans); } });
  const all = data.items.every((it) => typeof ans[it.id] === 'boolean');
  useEffect(() => { onReady?.(all && !A.checked); }, [all, A.checked, onReady]);

  const check = useCallback(() => {
    const bad = data.items.filter((it) => ans[it.id] !== it.yes).map((it) => it.id);
    const correct = bad.length === 0;
    A.setFb({ correct, why: correct ? null : pickWhy(data, { ans, bad }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { ans: { ...ans } },
      correctAnswer: { ans: data.items.reduce((a, it) => ({ ...a, [it.id]: it.yes }), {}) }, correct,
    }));
  }, [ans, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const btn = (it, val) => {
    const on = ans[it.id] === val;
    let bd = C.line; let bg = '#fff'; let col = C.soft;
    if (on) { bd = C.hot; bg = C.hotBg; col = C.ink; }
    if (A.checked && on) { const g = A.fb?.correct; bd = g ? C.ok : C.no; bg = g ? C.okBg : C.noBg; col = g ? C.ok : C.no; }
    return (
      <button key={val ? 'y' : 'n'} type="button" data-tf={it.id + ':' + (val ? 'yes' : 'no')} disabled={A.locked}
        onClick={() => !A.locked && setAns((s) => ({ ...s, [it.id]: val }))}
        style={{ minWidth: phone ? 42 : 50, height: phone ? 28 : 31, borderRadius: 9, border: '2px solid ' + bd, background: bg, color: col, fontSize: phone ? 12 : 12.5, fontWeight: 800, fontFamily: 'inherit', cursor: A.locked ? 'default' : 'pointer' }}>
        {tr(val ? data.yesLabel : data.noLabel, lang)}
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {/* DASTLABKI yozuv qatori: 2-dars amaliyotida mulohaza «shu kasrdan
          yasalgan» degan ma'noni tashiydi, ya'ni asl kasr ko'rinishi kerak.
          `given` bo'lmasa `Given` hech narsa chizmaydi. */}
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '4px 0 5px' }}>
        {data.items.map((it) => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: phone ? 5 : 7, padding: phone ? '2px 3px 2px 6px' : '2px 4px 2px 8px', borderRadius: 10, border: '1.5px solid ' + C.pale, background: '#fff' }}>
            <Row tokens={it.tokens} size={data.itemSize || (phone ? 15 : 17)} />
            {it.at ? <span style={{ ...S.mono, fontSize: phone ? 11.5 : 13, color: C.soft, whiteSpace: 'nowrap' }}>{it.at}</span> : null}
            <span style={{ flex: 1, fontSize: phone ? 11 : 12.5, fontWeight: 600, color: C.soft, lineHeight: 1.2 }}>{tr(it.claim, lang)}</span>
            {btn(it, true)}
            {btn(it, false)}
          </div>
        ))}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 23. PAIRSLOTS
// PAZL: ikki bo'lak tishi bilan bir-biriga kirishadi (metodist rasmi,
// 2026-08-22). CHAP bo'lak — faqat IFODA, tishi o'ngga chiqadi; O'NG bo'lak —
// faqat JAVOB, chap qirrasida uya bor. Shu sababli karta noto'g'ri tomonga
// umuman tushmaydi: xato faqat MAZMUNDA bo'ladi, boshqaruvda emas.
// Kontur SVG bilan chiziladi: ramka tishning shaklini takrorlashi kerak,
// `border` esa buni qila olmaydi.
// Uyalarning O'ZARO tartibi ahamiyatsiz — juftlikning o'zi tekshiriladi.
export function PairSlots({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [slots, setSlots] = useState(() => data.answer.map(() => [null, null]));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots.map((p) => p.slice())); } });
  const order = useMemo(() => (data.noShuffle ? data.cards : shuffled(data.cards)), [data]);
  const used = slots.reduce((a, p) => a.concat(p.filter(Boolean)), []);
  const pool = order.filter((c) => used.indexOf(c.id) === -1);
  const full = slots.every((p) => p[0] && p[1]);
  useEffect(() => { onReady?.(full && !A.checked); }, [full, A.checked, onReady]);

  // Tomonni KARTANING O'ZI aytadi: ifodada tokenlar, javobda matn.
  //
  // `side` — ochiq ko'rsatilgan tomon (2026-08-24, 8-dars amaliyoti). Sabab:
  // u yerda IKKI tomon ham matematika — chapda kasr ko'rsatkichli daraja,
  // o'ngda esa ustki chiziqli ILDIZ. Ildizni `v` matniga aylantirsak, chiziq
  // yo'qoladi (metodist qarori: ildiz ustki chiziq bilan). Shuning uchun
  // ikkala tomon ham `tokens` bilan berila oladi, tomonni esa `side` aytadi.
  // `side` yo'q bo'lsa xatti-harakat o'sha: tokenlar — chap, matn — o'ng.
  const byId = (id) => data.cards.find((c) => c.id === id);
  const sideOf = (c) => (c && c.side !== undefined ? c.side : (c && c.tokens ? 0 : 1));

  const tapSocket = (i, k) => {
    if (A.locked) return;
    if (picked) {
      const kk = sideOf(byId(picked));
      setSlots((s) => {
        const x = s.map((p) => p.slice());
        x.forEach((p) => { if (p[kk] === picked) p[kk] = null; });   // boshqa uyadan ko'chirish
        x[i][kk] = picked;
        return x;
      });
      setPicked(null);
      return;
    }
    if (slots[i][k]) setSlots((s) => { const x = s.map((p) => p.slice()); x[i][k] = null; return x; });
  };
  const key = (p) => p.slice().sort().join('+');
  const check = useCallback(() => {
    const want = data.answer.map(key).sort().join('|');
    const mine = slots.map(key).sort().join('|');
    const correct = want === mine;
    // `mate` -- razbor shartlari uchun: har karta kim bilan juft bo'ldi.
    const mate = {};
    slots.forEach((p) => { if (p[0] && p[1]) { mate[p[0]] = p[1]; mate[p[1]] = p[0]; } });
    A.setFb({ correct, why: correct ? null : pickWhy(data, { slots, mate }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { slots: slots.map((p) => p.slice()) },
      correctAnswer: { slots: data.answer }, correct,
    }));
  }, [slots, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  // O'lcham TELEFONDA alohida beriladi: 8-dars amaliyotining 04-topshirig'ida
  // kartada kasr ko'rsatkichli daraja turadi va u 54px da o'qilmaydi. Bitta
  // `cardSize` ni ikki ekranga qo'yish esa telefonda bankni tugma tagiga
  // surib qo'yardi (o'lchov 2026-08-24: karta bosilmay qoldi).
  //
  // BANK BIR QATORDA TURADI (metodist, 2026-08-25: «olti pazl ikki qatorga
  // yozilib qolgan, bir qatorga sig'dir»). O'lchamni ma'lumot fayli so'raydi,
  // lekin oxirgi so'z bank qatorining kenida: ishchi maydon 636px (S.wrap 640
  // minus paddingi), telefonda 362px (390px etalon kenglikdan host va wrap
  // paddinglari olingan). Bir bo'lakning keni sz + 0,17·sz (tish), orasida
  // gap. Shundan eng katta ruxsat etilgan o'lcham chiqadi va SO'RALGANI shu
  // bilan cheklanadi — ya'ni ma'lumot fayli qatorni buzolmaydi.
  // TELEFONDA cheklov yo'q va bu ataylab: 390px etalon kenglikda olti karta
  // bir qatorga faqat 48px da sig'adi, «9 … 10» kabi olti belgili yozuv esa
  // bunday kartada o'qilmaydi. Telefonda ikki qator — to'g'ri javob.
  const nCards = (data.cards || []).length || 1;
  const fit = phone ? Infinity
    : Math.max(40, Math.floor((636 - 6 * (nCards - 1)) / nCards / 1.17));
  const sz = Math.min(phone ? (data.cardSizePhone || 54) : (data.cardSize || 76), fit);
  const r = Math.round(sz * 0.17);
  // Yozuv karta chegarasiga ham, UYAGA ham tegib qolmasin (metodist,
  // 2026-08-25: avval «sonlar pazl chegarasiga tegib qolgan», keyin «9» javob
  // bo'lagining uyasiga kirib turgani ko'rsatildi). Javob bo'lagining chap
  // qirrasida botiq uya bor va u tanaga `r` piksel kiradi, ya'ni yozuvga
  // qoladigan joy `sz − r`. Shrift shu TOR joyga qarab cheklanadi: JetBrains
  // Mono da bir belgi taxminan 0,6em, 0,23 koeffitsiyent olti belgili
  // «9 … 10» ga ham yetadi. Ikki tomonda shrift bir xil bo'lishi kerak —
  // juftlikning yarmi mayda, yarmi yirik bo'lsa, ko'zga xato ko'rinadi.
  // Uchinchi cheklov (QA 2026-08-26): ENG UZUN yozuv bo'lakka sig'sin.
  // 0,23 koeffitsiyenti olti belgiga mo'ljallangan edi, «p − a = 11»,
  // «∠O = 160°», «146 ≠ 144» esa undan uzun va tanadan chiqib ketardi.
  // Yozuvga qoladigan joy `sz − r − 5` (uya va padding olingan), JetBrains
  // Mono da belgi taxminan 0,55em. To'qqiz pikseldan kichraymaydi — undan
  // narisi o'qilmaydi, qolgani yozuvning ko'chishi bilan hal bo'ladi.
  // Tokenning KO'RINADIGAN eni belgida: kasrda surat va maxrajning
  // uzunrog'i (ular ustma-ust turadi), ildizda belgi qo'shiladi, darajada
  // asos va ko'rsatkich yonma-yon. Oddiy `join('')` kasrni «[object
  // Object]» deb o'lchab, shriftni bekordan kichraytirardi.
  const tokLen = (t) => {
    if (typeof t === 'string') return t.length;
    if (!t || typeof t !== 'object') return 1;
    if (t.n !== undefined) return Math.max(String(t.n).length, String(t.d).length);
    if (t.r !== undefined) return String(t.r).length + 1;
    if (t.b !== undefined) return String(t.b).length + String(t.e).length;
    return 2;
  };
  const longest = Math.max(6, ...(data.cards || []).map((c) => (
    c.v !== undefined ? String(c.v).length
      : (c.tokens || []).reduce((s, t) => s + tokLen(t), 0))));
  const face = Math.min(
    (phone ? data.faceSizePhone : data.faceSize) || (phone ? 12 : 15),
    Math.max(9, Math.round((sz - r) * 0.23)),
    Math.max(9, Math.floor((sz - r - 5) / (0.55 * longest))),
  );
  const cy = sz / 2;
  const W = sz + r;              // CHAP bo'lakning svg keni: tana + tish
  const OV = r + 2;              // o'ng bo'lak shu qadar chapga suriladi
  // BIR-BIRINI TO'LDIRUVCHI IKKI BO'LAK (metodist, 2026-08-24). Ilgari
  // ikkala konturning yoyi ham TASHQARIGA qaragan edi: ikki tish yonma-yon
  // turib, uya hech qayerda paydo bo'lmagan. Endi bitta aylana ikki konturni
  // chizadi: chapda u tanadan CHIQADI (qavariq tish), o'ngda tanaga KIRADI
  // (botiq uya). Markazlari ustma-ust tushishi uchun o'ng bo'lak `OV` piksel
  // chapga suriladi — shunda tish uyaga aynan o'tiradi, orada bo'sh joy ham,
  // ortiqcha ustma-ust tushish ham qolmaydi.
  //   chap tana: x = 1..sz-1,   tish markazi  (sz-1, cy)
  //   o'ng tana: x = r+1..W-1,  uya markazi   (r+1,  cy) -> surilgach (sz-1, cy)
  // IKKI BO'LAK BIR-BIRINI TO'LDIRADI (metodist, 2026-08-25: «pazllar
  // bir-birini to'ldirishi kerak, bu yerda ular kesishib qolyabdi»).
  // O'lchov ko'rsatgani: ikkala konturning yoyi ham tanadan TASHQARIGA
  // chiqardi, ya'ni ikki tish yuzma-yuz turib bir-birining ustiga tushardi —
  // ranglar bir xil bo'lgani uchun bu faqat uzuq chiziqda ko'rinardi.
  // Endi chapda TISH (tanadan chiqadi), o'ngda UYA (tanaga kiradi):
  //   chap tana  x = 1..sz-1,  tish markazi (sz-1, cy), tashqariga r piksel
  //   o'ng tana  x = 1..sz-1,  uya markazi  (1, cy),    ichkariga r piksel
  // O'ng bo'lak `OV = r + 2` piksel chapga suriladi — shunda uya markazi
  // tish markazi ustiga tushadi va ular ustma-ust tushmasdan, orada bo'sh
  // joy ham qoldirmasdan qovushadi.
  // TISH TASHQARIGA, UYA ICHKARIGA (QA 2026-08-26). Ikkala yoyning ham
  // sweep bayrog'i 1 edi, ya'ni ikkalasi ham tanadan TASHQARIGA bo'rtardi:
  // chap bo'lakning tishi o'ngga (u ko'rinardi, chunki viewBox W = sz + r),
  // o'ng bo'lakning «uyasi» esa CHAPGA, x = 1 − r ga — u viewBox dan
  // tashqarida qolib, SVG uni kesib tashlardi. Natijada uya umuman
  // ko'rinmasdi va ikki bo'lak bir-biriga kirmasdi. O'ng bo'lakning yoyi
  // endi sweep 0 bilan tanaga BOTADI: uya ko'rinadigan bo'ldi va chap
  // bo'lakning tishi aynan shu joyga o'tiradi.
  const PATH = [
    `M1,1 H${sz - 1} V${cy - r} A${r},${r} 0 0,1 ${sz - 1},${cy + r} V${sz - 1} H1 Z`,
    `M1,1 H${sz - 1} V${sz - 1} H1 V${cy + r} A${r},${r} 0 0,0 1,${cy - r} Z`,
  ];
  // UYADA CHEGARA BIR MARTA CHIZILADI (metodist, 2026-08-25: «pazllar
  // bir-birini to'ldirishi kerak, bu yerda ular kesishib qolyabdi»). Ilgari
  // ikkala bo'lak ham O'Z to'liq konturini chizardi va umumiy chegara ikki
  // marta tushardi: uzuq chiziqda ikki qatorning nuqtalari mos kelmaydi,
  // ko'zga esa kesishgan chiziq bo'lib ko'rinadi. Endi uyada chap bo'lak
  // faqat UCHTA tashqi qirrasini chizadi, umumiy chegarani (tish va uya)
  // o'ng bo'lakning konturi beradi. Bankda esa har bo'lak to'liq konturda
  // turadi — u yerda ular yonma-yon emas va tish ko'rinishi kerak.
  const EDGE_L = `M${sz - 1},1 H1 V${sz - 1} H${sz - 1}`;
  const Piece = ({ card, k, dash, bd, bg, join, edge, attrs, onTap }) => (
    <button type="button" {...attrs} disabled={A.locked} onClick={onTap}
      style={{ position: 'relative', width: W, height: sz, padding: 0, border: 'none', background: 'none',
        marginLeft: join ? -OV : 0, cursor: A.locked ? 'default' : 'pointer',
        // Surilgan bo'lakning ramkasi chap tishning ustiga tushadi. Bosishni
        // KONTURNING O'ZI qabul qilsin, ramka emas: aks holda tish ustidagi
        // bosish o'ng uyaga ketardi.
        pointerEvents: join ? 'none' : undefined }}>
      <svg width={W} height={sz} viewBox={`0 0 ${W} ${sz}`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
        {/* To'ldirish alohida yotadi: bosishni SHU qabul qiladi, chunki
            chegara chizig'i faqat ikki piksel keladi. */}
        <path d={PATH[k]} fill={bg} stroke="none" style={{ pointerEvents: 'auto' }} />
        <path d={edge || PATH[k]} fill="none" stroke={bd} strokeWidth="2"
          strokeDasharray={dash ? '5 4' : undefined} strokeLinecap="square" />
      </svg>
      {/* YOZUV TANANING ICHIDA turadi. Ikkala bo'lakning tanasi ham
          x = 1..sz-1 (PATH ga qarang), tish va uya esa tanadan TASHQARIDA
          yoy bilan chiziladi. Ilgari javob bo'lagining yozuvi `left: r` bilan
          o'ngga surilgan edi va tanadan chiqib ketardi (QA 2026-08-26:
          dars46-04 da o'n piksel). Endi span tanaga tekislangan, uyaga
          tegmaslik esa `paddingLeft` bilan ta'minlanadi.
          Javob bo'lagida (k = 1) yozuv UYADAN keyin boshlanadi: uya tananing
          chap qirrasidan `r` piksel ichkariga kiradi va aynan yozuv turadigan
          balandlikda. Shu sababli chapdan `r + 3` bo'sh joy qoldiriladi, ya'ni
          yozuv uyadan qolgan joyning o'rtasiga tushadi. Chap bo'lakda tish
          tanadan TASHQARIGA chiqadi, u yerda yozuvga xalal yo'q. */}
      <span style={{ position: 'absolute', top: 0, height: sz, left: 0, width: sz, boxSizing: 'border-box', padding: 2, paddingLeft: k === 1 ? r + 3 : 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {card ? (card.tokens
          ? <Row tokens={card.tokens} size={face} />
          : <span style={{ ...S.mono, fontSize: Math.min(phone ? 12 : 13.5, face), color: C.ink, textAlign: 'center', lineHeight: 1.15, overflowWrap: 'anywhere' }}>{card.v}</span>) : null}
      </span>
    </button>
  );
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', gap: phone ? 4 : 8, justifyContent: 'center', flexWrap: 'wrap', margin: '4px 0 6px' }}>
        {slots.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {[0, 1].map((k) => {
              const card = p[k] ? byId(p[k]) : null;
              const wait = !card && picked && sideOf(byId(picked)) === k;
              const bd = card ? (A.checked ? (A.fb?.correct ? C.ok : C.no) : C.line) : (wait ? C.hot : C.line);
              const bg = card ? '#fff' : (wait ? '#fff7f2' : C.bg);
              return (
                <Piece key={k} card={card} k={k} dash={!card} bd={bd} bg={bg} join={k === 1}
                  edge={k === 0 ? EDGE_L : undefined}
                  attrs={{ 'data-slot': i, 'data-side': k === 0 ? 'expr' : 'val' }} onTap={() => tapSocket(i, k)} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 7, display: A.locked ? 'none' : 'block' }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: phone ? 3 : 6, justifyContent: 'center', flexWrap: 'wrap', minHeight: sz }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <Piece key={c.id} card={c} k={sideOf(c)} dash={false} join={false}
              bd={picked === c.id ? C.hot : C.line} bg={picked === c.id ? C.hotBg : '#fff'}
              attrs={{ 'data-card': c.id }} onTap={() => setPicked(picked === c.id ? null : c.id)} />
          ))}
        </div>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 24. CODELOCK
// Seyf kodi: uch uya, bank kartalari, TARTIB MUHIM. SlotsBank dan farqi
// shundaki, uyalar yozuvning ichida emas -- ular alohida panelda turadi va
// javob KETMA-KETLIK bo'ladi («o'sish tartibida yozing»).
export function CodeLock({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const short = useIsShort();
  const n = data.answer.length;
  const [slots, setSlots] = useState(Array(n).fill(null));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots); } });
  const pool = data.cards.filter((c) => slots.indexOf(c) === -1);
  const full = slots.every(Boolean);
  useEffect(() => { onReady?.(full && !A.checked); }, [full, A.checked, onReady]);

  const tapSlot = (i) => {
    if (A.locked) return;
    if (picked) { setSlots((s) => { const x = s.slice(); x[i] = picked; return x; }); setPicked(null); return; }
    if (slots[i]) setSlots((s) => { const x = s.slice(); x[i] = null; return x; });
  };
  const check = useCallback(() => {
    const correct = slots.join('|') === data.answer.join('|');
    const set = slots.slice().sort().join('|') === data.answer.slice().sort().join('|');
    A.setFb({ correct, why: correct ? null : pickWhy(data, { slots, set }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { slots: slots.slice() },
      correctAnswer: { slots: data.answer }, correct,
    }));
  }, [slots, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.line;
  const sz = phone ? 48 : (short ? 54 : 62);
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '2px 0 7px' }}>
          <Row tokens={data.expr} size={data.exprSize || (phone ? 19 : 23)} />
        </div>
      ) : null}
      {/* SEYF ESHIGI: panel, uch uya va ikki murvat. Ranglar palitradan. */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: phone ? 7 : 10, padding: phone ? '5px 9px' : (short ? '6px 11px' : '9px 13px'), borderRadius: 16, border: '2.5px solid ' + C.line, background: C.bg }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: C.line }} />
            <span style={{ width: 6, height: 6, borderRadius: 999, background: C.line }} />
          </span>
          {slots.map((v, i) => (
            <button key={i} type="button" data-slot={i} disabled={A.locked} onClick={() => tapSlot(i)}
              style={{ width: sz, height: sz, borderRadius: 12, boxSizing: 'border-box',
                border: '2px ' + (v ? 'solid' : 'dashed') + ' ' + (v ? bd : (picked ? C.hot : C.line)),
                background: v ? '#fff' : (picked ? '#fff7f2' : '#fff'),
                ...S.mono, fontSize: phone ? 19 : 22, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
              {v || ''}
            </button>
          ))}
          <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: C.line }} />
            <span style={{ width: 6, height: 6, borderRadius: 999, background: C.line }} />
          </span>
        </div>
      </div>
      <div style={{ ...S.note, textAlign: 'center', margin: (phone || short) ? '0 0 5px' : S.note.margin }}>{tr(data.slotLabel, lang)}</div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: (phone || short) ? 5 : 7, display: A.locked ? 'none' : 'block' }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: phone ? 5 : 7, justifyContent: 'center', flexWrap: 'wrap', minHeight: 40 }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c} type="button" data-card={c} disabled={A.locked} onClick={() => setPicked(picked === c ? null : c)}
              style={{ minWidth: 50, padding: '0 9px', height: 40, borderRadius: 11, border: '2px solid ' + (picked === c ? C.hot : C.line), background: picked === c ? C.hotBg : '#fff', ...S.mono, fontSize: 19, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {!A.locked ? <div style={{ ...S.note, marginTop: 5 }}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 25. CLOZEBANK
// MATNDA bo'shliqlar, pastda so'z kartalari. Bu yerda kartalar SO'Z, ya'ni
// `L()` ichida turadi (SlotsBank da karta -- matematika, `L()` dan tashqarida).
// `parts` uch tilda BIR XIL shaklda bo'lishi kerak: matn, uya, matn, uya...
export function ClozeBank({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [slots, setSlots] = useState(Array(data.answer.length).fill(null));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots); } });
  const order = useMemo(() => (data.noShuffle ? data.cards : shuffled(data.cards)), [data]);
  const pool = order.filter((c) => slots.indexOf(c.id) === -1);
  const full = slots.every(Boolean);
  useEffect(() => { onReady?.(full && !A.checked); }, [full, A.checked, onReady]);

  const tapSlot = (i) => {
    if (A.locked) return;
    if (picked) { setSlots((s) => { const x = s.slice(); x[i] = picked; return x; }); setPicked(null); return; }
    if (slots[i]) setSlots((s) => { const x = s.slice(); x[i] = null; return x; });
  };
  const check = useCallback(() => {
    const correct = slots.join('|') === data.answer.join('|');
    A.setFb({ correct, why: correct ? null : pickWhy(data, { slots }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { slots: slots.slice() },
      correctAnswer: { slots: data.answer }, correct,
    }));
  }, [slots, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.line;
  const word = (id) => tr((data.cards.find((c) => c.id === id) || {}).label, lang);
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      <p style={{ fontSize: phone ? 14.5 : 16.5, lineHeight: 1.9, color: C.ink, fontWeight: 600, margin: '6px 0 8px' }}>
        {data.parts.map((p, i) => {
          if (p.text) return <span key={i}>{tr(p.text, lang)}</span>;
          const k = p.slot;
          return (
            <button key={i} type="button" data-slot={k} disabled={A.locked} onClick={() => tapSlot(k)}
              style={{ margin: '0 3px', padding: phone ? '2px 7px' : '3px 10px', borderRadius: 9, verticalAlign: 'middle',
                border: '2px ' + (slots[k] ? 'solid' : 'dashed') + ' ' + (slots[k] ? bd : (picked ? C.hot : C.line)),
                background: slots[k] ? '#fff' : (picked ? '#fff7f2' : C.bg),
                minWidth: phone ? 58 : 74, fontSize: phone ? 13.5 : 15, fontWeight: 700, fontFamily: 'inherit', color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
              {slots[k] ? word(slots[k]) : ' '}
            </button>
          );
        })}
      </p>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 7, display: A.locked ? 'none' : 'block' }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', minHeight: 36 }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c.id} type="button" data-card={c.id} disabled={A.locked} onClick={() => setPicked(picked === c.id ? null : c.id)}
              style={{ padding: phone ? '5px 9px' : '6px 12px', borderRadius: 11, border: '2px solid ' + (picked === c.id ? C.hot : C.line), background: picked === c.id ? C.hotBg : '#fff', fontSize: phone ? 13 : 14.5, fontWeight: 700, fontFamily: 'inherit', color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
              {tr(c.label, lang)}
            </button>
          ))}
        </div>
      </div>
      {!A.locked ? <div style={{ ...S.note, marginTop: 5 }}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 26. SWAPORDER
// Kartalar BIR QATORDA turadi va joyini almashtirish bilan tartibga solinadi:
// almashtirish kerak bo'lgan ikkita kartani ketma-ket bosasiz. OrderLines dan
// farqi -- u bankdan ro'yxatga YIG'ADI, bu yerda esa hamma karta boshidan
// ko'rinib turadi va faqat o'rni o'zgaradi.
export function SwapOrder({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const phone = useIsPhone();
  const [seq, setSeq] = useState(() => (data.start || data.answer).slice());
  const [held, setHeld] = useState(null);
  const [moves, setMoves] = useState(0);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.seq) { setSeq(sa.seq); setMoves(1); } } });
  useEffect(() => { onReady?.(moves > 0 && !A.checked); }, [moves, A.checked, onReady]);

  const tap = (id) => {
    if (A.locked) return;
    if (held === null) { setHeld(id); return; }
    if (held === id) { setHeld(null); return; }
    setSeq((s) => {
      const x = s.slice();
      const i = x.indexOf(held); const j = x.indexOf(id);
      x[i] = id; x[j] = held;
      return x;
    });
    setHeld(null);
    setMoves((m) => m + 1);
  };
  const check = useCallback(() => {
    const correct = seq.join('|') === data.answer.join('|');
    const pos = {}; seq.forEach((id, i) => { pos[id] = i; });
    A.setFb({ correct, why: correct ? null : pickWhy(data, { seq, pos }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, {
      questionText: tr(data.ask, lang), studentAnswer: { seq: seq.slice() },
      correctAnswer: { seq: data.answer }, correct,
    }));
  }, [seq, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const cardOf = (id) => data.cards.find((c) => c.id === id);
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} done={A.checked} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '2px 0 7px' }}>
          <Row tokens={data.expr} size={data.exprSize || (phone ? 20 : 24)} />
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: phone ? 4 : 6, alignItems: 'stretch', margin: '2px 0 6px' }}>
        {seq.map((id, i) => {
          const c = cardOf(id);
          const on = held === id;
          let bd = C.line; let bg = '#fff';
          if (on) { bd = C.hot; bg = C.hotBg; }
          if (A.checked) { const g = A.fb?.correct; bd = g ? C.ok : C.no; bg = g ? C.okBg : C.noBg; }
          return (
            <button key={id} type="button" data-card={id} disabled={A.locked} onClick={() => tap(id)}
              style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 3, padding: phone ? '4px 3px' : '5px 5px', borderRadius: 11, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              <span style={{ ...S.mono, fontSize: 11, color: C.mute }}>{i + 1}</span>
              {/* `maxWidth` bo'lmasa, `alignItems: center` dagi flex bola
                  o'z kengligini oladi va kartadan oshib ketadi — shunda
                  `overflowWrap` ham ishga tushmaydi (QA 2026-08-26). */}
              <span style={{ fontSize: phone ? 10.5 : 11.5, fontWeight: 700, color: C.soft, lineHeight: 1.2, textAlign: 'center', overflowWrap: 'break-word', minWidth: 0, maxWidth: '100%' }}>{tr(c.label, lang)}</span>
              {c.tokens ? <Row tokens={c.tokens} size={data.itemSize || (phone ? 13 : 15)} /> : null}
            </button>
          );
        })}
      </div>
      {!A.locked ? <div style={S.note}>{tr(data.ask, lang)}</div> : null}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}
