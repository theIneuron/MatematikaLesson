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
//   SlotsBank  -- kataklar va kartalar banki; bir yoki bir necha qator
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
import { Frac, Row, Sup } from './frac.jsx';

export { Frac, Row, Sup };

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
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 9px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 600, margin: '10px 0 8px' },
  note: { fontSize: 13, color: '#9aa1ad', fontWeight: 600, margin: '0 0 8px' },
  bankLbl: { fontSize: 12, fontWeight: 700, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 6 },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 700 },
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
export const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, lineHeight: 1.4, fontWeight: 600, background: ok ? C.okBg : C.noBg, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span><Sup s={text} /></span>
  </div>
);

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

// Karta SO'Z bo'lsa, u tarjima qilinadi. Lekin javob TEKSHIRUVI o'zbekcha
// satr bo'yicha qoladi: `answer` va razbor shartlari o'zgarmasin (QA 2026-08-22).
// JAVOB KARTALARINING O'LCHAMI BITTA (metodist QA si, 2026-08-22): ilgari
// shrift yozuv uzunligiga qarab kichrayardi va bitta topshiriqda kartalar
// har xil bo'lib qolardi. Endi hamma javob kartasi bir xil kegl bilan
// chiziladi, uzun yozuv esa karta ICHIDA ko'chadi.
const CARD_FS = 18;   // javob kartasi: bank, katak, so'zli had
const LINE_FS = 22;   // yig'ilgan javob qatori

// Karta yozuvi hech qachon chegaradan chiqmasin: uzun yozuv ichida ko'chadi,
// bo'shliqsiz uzun yozuv esa oxirgi chora sifatida bo'linadi. Kenglik ham
// bankdan oshmaydi -- telefonda karta ekrandan chiqib ketmaydi.
const WRAP = { whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.15,
  maxWidth: 'min(250px, 100%)', overflowWrap: 'break-word' };

// KARTALAR TARTIBI ARALASHTIRILADI (metodist QA si, 2026-08-22): bank javob
// tartibida turardi va topshiriqni kartalarni chapdan o'ngga bosib yechish
// mumkin edi -- bu bilimni emas, tartibni tekshirish. Aralashtirish faqat
// KO'RSATISHGA tegadi: `id`, `answer` va razbor shartlari o'z joyida qoladi.
// `data.noShuffle` -- yozuvning o'zi tartibli bo'lgan topshiriqlar uchun.
const shuffled = (n) => {
  const idx = [];
  for (let i = 0; i < n; i++) idx.push(i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = idx[i]; idx[i] = idx[j]; idx[j] = x;
  }
  return idx;
};

// Qatorni «yozuv + katak» bo'laklariga bo'ladi: bo'lak ichida ko'chirish yo'q.
const groupRow = (row) => {
  const out = []; let cur = [];
  row.forEach((part) => { cur.push(part); if (part.slot != null) { out.push(cur); cur = []; } });
  if (cur.length) out.push(cur);
  return out;
};

// Ustun bo'lib turish sharti (metodist qarori 2026-08-22, «global»): karta
// yozuvida SO'Z bo'lsa yoki u uzun bo'lsa -- tor ekranda karta butun kenglikni
// oladi. Faqat qisqa sonli kartalar yonma-yon qoladi: ulardan ustun yasash
// balandlikni behuda yeydi, u esa bizda tanqis.
const wordCard = (s) => /[A-Za-z]{3,}/.test(String(s)) || String(s).length > 10;

const cardKey = (c) => (c && typeof c === 'object' ? (c.uz || '') : c);
const cardLbl = (data, key) => {
  const c = (data.cards || []).find((x) => cardKey(x) === key);
  return c === undefined ? key : c;
};

const submitPayload = (data, extra) => ({
  questionText: extra.questionText || '',
  options: extra.options || [],
  studentAnswer: extra.studentAnswer,
  correctAnswer: extra.correctAnswer,
  correct: extra.correct,
  meta: { tag: data.tag, level: data.level, ...(data.meta || {}) },
});

// TELEFON QOIDALARI BIR JOYDA (metodist QA si, 2026-08-22). 640px dan tor
// ekranda: variantlar bitta ustunda, zona nomi zonaning USTIDA (yon ustun
// kenglikning choragini yeb qo'yardi), «hammasini belgilash» esa ikki ustunda
// qoladi -- bitta ustunda oltita yozuv balandlikka sig'maydi.
const MobileCss = () => (
  <style>{`
    @media (max-width: 639.98px) {
      .pq-opts { grid-template-columns: 1fr !important; }
      .pq-items { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      .pq-items-1 { grid-template-columns: 1fr !important; }
      .pq-zrow { flex-direction: column !important; align-items: stretch !important; gap: 2px !important; }
      .pq-zlbl { width: auto !important; flex: none !important; justify-content: flex-start !important; text-align: left !important; }
      .pq-expr { gap: 0 !important; }
      .pq-expr > * { font-size: 17px !important; padding-left: 4px !important; padding-right: 4px !important; margin-left: 0 !important; margin-right: 0 !important; }
    }
  `}</style>
);

// TOR EKRANNI BILISH (metodist QA si, 2026-08-22): amaliyot ildizi 640px dan
// tor ekranda 390px qilib qotiriladi, ya'ni ichkarida joy oz. Yozuv kegli va
// katak kengligi shu holatda kichrayadi -- aks holda qator ko'chib ketadi.
export function useNarrow() {
  const [narrow, setNarrow] = useState(typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 640);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return narrow;
}

// Sarlavha qismi: hamma mexanikada bir xil tartib -- eyebrow, shart, savol.
const Head = ({ data, lang }) => (
  <>
    <div style={S.eyebrow}><Sup s={tr(data.eyebrow, lang)} /></div>
    {data.setup ? <p style={S.setup}><Sup s={tr(data.setup, lang)} /></p> : null}
  </>
);

// Berilgan qiymatlar qatori (a = 4, b = −3). Matematika — `data.given`,
// so'z — `data.givenLabel`.
const Given = ({ data, lang }) => {
  if (!data.given || !data.given.length) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14, padding: '5px 0', borderRadius: 12, background: C.bg, border: '1px solid #eef0f4', marginBottom: 4 }}>
      {data.givenLabel ? <span style={{ fontSize: 12, fontWeight: 700, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase' }}>{tr(data.givenLabel, lang)}</span> : null}
      {data.given.map((g, i) => <Row key={i} tokens={g} size={22} lang={lang} />)}
    </div>
  );
};

// ============================================================ 1. CHOICE
// Tayyor javobni tanlash. Etalon §1.1 ga ko'ra bu KUCHSIZ tekshiruv,
// shuning uchun faqat isinish uchun (amaliyotda bir-ikkitasi).
export function Choice({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
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
      <Head data={data} lang={lang} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '4px 0 10px' }}>
          <Row tokens={data.expr} size={data.exprSize || 30} lang={lang} />
        </div>
      ) : null}
      <Given data={data} lang={lang} />
      <p style={S.ask}><Sup s={tr(data.ask, lang)} /></p>
      <MobileCss />
      <div className="pq-opts" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (data.optCols || 1) + ', minmax(0, 1fr))', gap: 7 }}>
        {order.map((i) => {
          const o = data.opts[i];
          const active = picked === i;
          const short = (data.optCols || 1) > 1;
          // Qisqa yozuv («(x + 7)²») ko'chmasin, uzun gap esa ko'chsin:
          // aks holda uzun variant qatordan chiqib ketadi.
          const lbl = Array.isArray(o.label) ? '' : String(tr(o.label, lang));
          const keepWhole = lbl.length > 0 && lbl.length <= 24;
          let bg = '#fff'; let bd = '#d6dae3'; let col = C.soft;
          if (active) { bg = C.hotBg; bd = C.hot; col = C.ink; }
          if (A.checked && active) { const good = i === data.correct; bg = good ? C.okBg : C.noBg; bd = good ? C.ok : C.no; col = good ? C.ok : C.no; }
          if (A.checked && !active && i === data.correct) { bd = C.ok; col = C.ok; }
          return (
            <button key={i} type="button" data-opt={i} disabled={A.locked} onClick={() => setPicked(i)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: short ? 'center' : 'flex-start', width: '100%', minHeight: short ? 50 : 0, padding: '11px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: short ? 'center' : 'left', whiteSpace: keepWhole ? 'nowrap' : 'normal' }}>
              {typeof o.label === 'object' && Array.isArray(o.label) ? <Row tokens={o.label} size={20} lang={lang} /> : <Sup s={tr(o.label, lang)} />}
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
// Daraja ko'rinishidagi javob (metodist QA si, 2026-08-22): «3⁴ · 3² = 3⁶»
// javobi ham qabul qilinishi kerak, lekin klaviaturadan yuqori indeks
// yozib bo'lmaydi. Shuning uchun `^` kiritishga ruxsat berilgan va javob
// HISOBLANADI: `3^6` ham, `729` ham bir xil son beradi.
const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const POW_RE = /[⁰¹²³⁴⁵⁶⁷⁸⁹]|\^/;
// `3^6` -> 729; oddiy son o'zgarmaydi; noto'g'ri yozuv NaN beradi.
const evalTyped = (raw) => {
  const s = String(raw).trim();
  const m = s.match(/^(-?\d+)\^(\d+)$/);
  if (m) return Math.pow(parseInt(m[1], 10), parseInt(m[2], 10));
  return /^-?\d+$/.test(s) ? parseInt(s, 10) : NaN;
};

export function TypeValue({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.value != null) setVal(String(sa.value)); } });
  // Topshiriqda daraja bormi -- shuni yozuvning O'ZIDAN bilamiz, ya'ni
  // topshiriq fayllariga yangi kalit qo'shilmaydi.
  const power = useMemo(() => POW_RE.test(JSON.stringify([data.expr || [], data.given || []])), [data]);
  const clean = (raw) => {
    // Yuqori indeksli raqamlar `^` ko'rinishiga o'tadi: 3⁶ -> 3^6.
    let s = String(raw).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,
      (m) => '^' + m.split('').map((c) => SUP[c]).join(''));
    s = s.replace(/[^0-9\-−^]/g, '').replace(/−/g, '-');
    const neg = data.allowNeg !== false && s.startsWith('-');
    s = s.replace(/-/g, '');
    const parts = s.split('^');
    s = parts.length > 1 ? parts[0] + '^' + parts.slice(1).join('') : s;
    return (neg ? '-' : '') + s;
  };
  useEffect(() => { onReady?.(!Number.isNaN(evalTyped(val)) && !A.checked); }, [val, A.checked, onReady]);

  const check = useCallback(() => {
    const v = evalTyped(val);
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
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      {data.expr ? (
        <div style={{ textAlign: 'center', margin: '6px 0 14px' }}>
          <Row tokens={data.expr} size={data.exprSize || 30} lang={lang} />
        </div>
      ) : null}
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }} htmlFor="kit-in">
        {tr(data.label, lang)}
        {power ? (
          <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#8a8f9a', marginTop: 2 }}>
            {tr(L("Darajani ^ bilan yozish mumkin: 3^6", 'Степень можно записать через ^: 3^6', 'A power can be typed with ^: 3^6'), lang)}
          </span>
        ) : null}
      </label>
      <input id="kit-in" data-input="1" value={val} onChange={(e) => setVal(clean(e.target.value))}
        inputMode={data.allowNeg === false && !power ? 'numeric' : 'text'} disabled={A.locked} placeholder="0"
        style={{ width: '100%', boxSizing: 'border-box', fontSize: 24, fontWeight: 700, textAlign: 'center', padding: '12px 14px', borderRadius: 14, border: '2px solid ' + (A.checked ? (A.fb?.correct ? C.ok : C.no) : '#d6dae3'), background: A.checked ? '#fff' : C.bg, outline: 'none', fontFamily: S.mono.fontFamily }} />
      {/* EKRAN KLAVIATURASI (metodist qarori 2026-08-22): javobni telefonda
          ham, kompyuterda ham bir xil kiritish kerak. Tizim klaviaturasi
          telefonda `^` ni bermaydi va raqamli rejimda belgilar yashiringan,
          shuning uchun kalitlar ekranda turadi. Yozish ham ishlaydi. */}
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) => (
            <button key={d} type="button" data-key={d} disabled={A.locked} onClick={() => setVal((v) => clean(v + d))}
              style={PADKEY(A.locked)}>{d}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {data.allowNeg === false ? null : (
            <button type="button" data-key="neg" disabled={A.locked} onClick={() => setVal((v) => clean(v.startsWith('-') ? v.slice(1) : '-' + v))}
              style={PADKEY(A.locked, 46)}>−</button>
          )}
          {power ? (
            <button type="button" data-key="pow" disabled={A.locked} onClick={() => setVal((v) => clean(v + '^'))}
              style={PADKEY(A.locked, 46)}>x^n</button>
          ) : null}
          <button type="button" data-key="del" disabled={A.locked} onClick={() => setVal((v) => v.slice(0, -1))}
            style={PADKEY(A.locked, 46)}>{'⌫'}</button>
        </div>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 3. SLOTSBANK
// Kataklar va kartalar banki. `rows` — yozuvning qatorlari; qatorda tokenlar
// yoki `{ slot: n }`. Kartani bosasiz, keyin katakni bosasiz.
// «Hammasi yoki hech narsa»: kataklarning hammasi to'g'ri bo'lishi kerak.
export function SlotsBank({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const n = data.answer.length;
  const [slots, setSlots] = useState(Array(n).fill(null));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots); } });
  const used = slots.filter(Boolean);
  const bank = useMemo(() => {
    const keys = data.cards.map(cardKey);
    return data.noShuffle ? keys : shuffled(keys.length).map((i) => keys[i]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const pool = bank.filter((c) => used.indexOf(c) === -1);
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
      questionText: tr(data.ask, lang), options: data.cards.map((c) => ({ id: c, label: c })),
      studentAnswer: { slots: slots.slice() }, correctAnswer: { slots: data.answer }, correct,
    }));
  }, [slots, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const bd = A.checked ? (A.fb?.correct ? C.ok : C.no) : C.line;
  const narrow = useNarrow();
  const stackBank = narrow && data.cards.some((c) => wordCard(String(tr(cardLbl(data, cardKey(c)), lang))));
  // Yozuvda SO'Z bo'lsa (masalan «ikkinchi o'tkir burchak»), tor ekranda kegl
  // yana kichrayadi: so'zli podpis raqamdan uzun va qatorni ko'chirib yuboradi.
  const wordyRow = (data.rows || []).some((row) => row.some((part) => (part.t || []).some((x) => /[A-Za-z']{3,}/.test(String(tr(x, lang))))));
  const size = narrow ? (wordyRow ? 16 : 20) : (data.exprSize || 26);
  // Qatorni «=» bo'yicha ikkiga bo'lamiz: chap tomon, belgi, o'ng tomon.
  // Ustunni AJRATUVCHI belgi bo'yicha topamiz: «=» dan tashqari «--» va «→»
  // ham ishlatiladi («eng katta tomon -- [katak]»). Ilgari faqat «=» qaralardi
  // va bunday qator butunlay chap ustunga tushib, tekislanmay qolardi.
  const SEPS = ['=', '--', '→', '->'];
  const isSep = (x) => SEPS.indexOf(String(x)) !== -1;
  // Bitta qatorda BIR NECHTA juftlik bo'lishi mumkin: «birinchi burchak = [katak]
  // ikkinchisi = [katak]». Bunday qator ALOHIDA setka qatorlariga bo'linadi,
  // aks holda ikkinchi juftlik birinchisining o'ng ustuniga tushib qolardi
  // (metodist QA si, 2026-08-22).
  const splitRow = (row) => {
    let seps = 0; let slots = 0;
    row.forEach((part) => {
      if (part.slot != null) { slots += 1; return; }
      (part.t || []).forEach((x) => { if (isSep(x)) seps += 1; });
    });
    const out = [];
    let cur = { left: [], eq: null, right: [] };
    const flush = () => { out.push(cur); cur = { left: [], eq: null, right: [] }; };
    // Qatorda ajratuvchi belgi BO'LMASA, lekin katak bo'lsa («yechim [katak]»),
    // podpis chap ustunda, katak esa o'ng ustunda turadi -- shunda u yuqoridagi
    // qator katagi bilan bir vertikalda bo'ladi (metodist QA si, 2026-08-22).
    if (seps === 0 && slots > 0) {
      const i = row.findIndex((part) => part.slot != null);
      return [{ left: row.slice(0, i), eq: null, right: row.slice(i) }];
    }
    const pairMode = seps >= 2 && slots >= 2;
    row.forEach((part) => {
      if (part.slot != null) {
        (cur.eq ? cur.right : cur.left).push(part);
        if (pairMode && cur.eq) flush();
        return;
      }
      const toks = part.t || [];
      let buf = [];
      toks.forEach((x) => {
        if (isSep(x) && (!cur.eq || pairMode)) {
          if (buf.length) { (cur.eq ? cur.right : cur.left).push({ t: buf }); buf = []; }
          if (cur.eq && pairMode) flush();
          cur.eq = String(x);
          return;
        }
        buf.push(x);
      });
      if (buf.length) (cur.eq ? cur.right : cur.left).push({ t: buf });
    });
    if (cur.left.length || cur.right.length || cur.eq) out.push(cur);
    return out;
  };
  const gridRows = data.rows.reduce((acc, row) => acc.concat(splitRow(row)), []);
  const hasEq = gridRows.some((g) => g.eq);
  // Bir tomonni chizish. «Yozuv + katak» juftligi bitta bo'lak bo'lib ko'chadi.
  const renderSide = (parts, ri, side) => groupRow(parts).map((grp, gi) => (
    <span key={side + ri + '-' + gi} style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', margin: '2px 2px' }}>
      {grp.map((part, pi) => {
        if (part.slot != null) {
          const i = part.slot;
          return (
            <button key={pi} type="button" data-slot={i} disabled={A.locked} onClick={() => tapSlot(i)}
              style={{
                minWidth: narrow ? (wordyRow ? 46 : 54) : 74, borderRadius: 10, margin: narrow ? '0 2px' : '0 5px',
                border: '2px ' + (slots[i] ? 'solid' : 'dashed') + ' ' + (slots[i] ? bd : (picked ? C.hot : C.line)),
                background: slots[i] ? '#fff' : (picked ? '#fff7f2' : C.bg),
                ...S.mono, fontSize: narrow ? 18 : LINE_FS, color: C.ink, cursor: A.locked ? 'default' : 'pointer',
                ...WRAP, height: 'auto', minHeight: narrow ? 40 : 46, padding: narrow ? '3px 6px' : '4px 8px',
              }}>
              <Sup s={slots[i] ? tr(cardLbl(data, slots[i]), lang) : ''} />
            </button>
          );
        }
        return <Row key={pi} tokens={part.t} size={size} lang={lang} align={side === 'l' ? 'end' : (side === 'r' ? 'start' : 'center')} />;
      })}
    </span>
  ));
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      {/* USTUNLAR BO'YICHA TEKISLASH (metodist qarori 2026-08-22): qadamlar
          daftardagidek ustma-ust tursin. Ustunlar YOZUVNING O'ZIDAN olinadi:
          birinchi «=» belgisi qatorni ikkiga bo'ladi -- chap tomon, tenglik
          belgisi, o'ng tomon. Shuning uchun topshiriq fayllarini o'zgartirish
          kerak bo'lmadi. «=» umuman yo'q topshiriqlarda (masalan «qavs ochiladi
          -- katak») qatorlar avvalgidek yonma-yon chiziladi. */}
      <div style={{ display: 'grid', gridTemplateColumns: hasEq ? 'auto auto auto' : 'auto', columnGap: 4, rowGap: 6, justifyContent: 'center', alignItems: 'center', width: 'fit-content', maxWidth: '100%', margin: '8px auto 6px' }}>
        {gridRows.map((g, ri) => (hasEq ? (
          <React.Fragment key={ri}>
            <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end', textAlign: 'right', minWidth: 0 }}>{renderSide(g.left, ri, 'l')}</div>
            <div style={{ justifySelf: 'center', ...S.mono, fontSize: size, color: C.ink, padding: '0 4px' }}>{g.eq || ''}</div>
            <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, minWidth: 0 }}>{renderSide(g.right, ri, 'r')}</div>
          </React.Fragment>
        ) : (
          <div key={ri} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>{renderSide(g.left, ri, 'o')}</div>
        )))}
      </div>
      <div style={S.note}><Sup s={tr(data.ask, lang)} /></div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 9 }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: stackBank ? 6 : 8, justifyContent: 'center', minHeight: 46, alignItems: stackBank ? 'stretch' : 'center', flexDirection: stackBank ? 'column' : 'row', flexWrap: 'wrap', width: '100%', maxWidth: '100%' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c} type="button" data-card={c} disabled={A.locked} onClick={() => setPicked(picked === c ? null : c)}
              style={{ minWidth: stackBank ? 0 : 62, width: stackBank ? '100%' : undefined, padding: '0 10px', height: 'auto', minHeight: stackBank ? 42 : 46, borderRadius: 12, border: '2px solid ' + (picked === c ? C.hot : C.line), background: picked === c ? C.hotBg : '#fff', ...S.mono, fontSize: CARD_FS, color: C.ink, cursor: A.locked ? 'default' : 'pointer' , ...WRAP, maxWidth: stackBank ? '100%' : 'min(250px, 100%)' }}>
              <Sup s={tr(cardLbl(data, c), lang)} />
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
  // Hadlar SO'Z bo'lsa (xulosalar ro'yxati), yozuv kegli kartalar bilan bir xil
  // bo'ladi: aks holda bir topshiriqda uch xil o'lcham chiqadi.
  const wordy = (data.parts || []).some((p) => p.k === 'term' && /\s/.test(String(tr(p.v, lang))));
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <p style={S.ask}><Sup s={tr(data.ask, lang)} /></p>
      {data.note ? <div style={S.note}><Sup s={tr(data.note, lang)} /></div> : null}
      <MobileCss />
      {/* Formula bitta qatorda tursin (metodist QA si, 2026-08-22): telefonda
          «(7m − 4) − (2m − 9)» ikki qatorga bo'linib, qavs pastda qolardi.
          Tor ekranda kegl va ichki bo'shliqlar kichrayadi -- yozuv butun
          ko'rinadi. So'zlar ro'yxatiga bu tegmaydi: u ko'chishi kerak. */}
      {/* SO'ZLI RO'YXAT USTUN BO'LIB TURADI (metodist QA si, 2026-08-22):
          uch xulosa qatorga sig'masa, ikkitasi yonma-yon, uchinchisi pastda
          qolardi -- ro'yxat emas, tasodifiy joylashuv ko'rinardi. Formula esa
          bitta qator bo'lib qoladi: uning bo'laklari yozuvning o'zi. */}
      <div className={wordy ? undefined : 'pq-expr'} style={{
        display: 'flex', alignItems: 'center', margin: '8px 0 4px',
        flexDirection: wordy ? 'column' : 'row',
        justifyContent: 'center', flexWrap: 'wrap', gap: wordy ? 6 : 2,
      }}>
        {data.parts.map((p, i) => {
          if (p.k === 'txt') return <span key={i} style={{ ...S.mono, fontSize: wordy ? CARD_FS : size, color: C.ink, padding: '0 3px' }}>{p.v}</span>;
          if (p.k === 'op') return <span key={i} style={{ ...S.mono, fontSize: wordy ? CARD_FS : size + 4, color: C.ink, padding: '2px 12px', margin: '0 4px', borderRadius: 9, background: '#f3eefa' }}>{p.v}</span>;
          // 'sign' — oddiy amal belgisi: bosilmaydi, lekin ta'kidlanmaydi ham.
          if (p.k === 'sign') return <span key={i} style={{ ...S.mono, fontSize: wordy ? CARD_FS : size, color: C.ink, padding: '0 7px' }}>{p.v}</span>;
          const on = marked.indexOf(p.id) !== -1;
          let bd = C.line; let bg = C.bg; let col = C.ink; let dash = 'dashed';
          if (on) { bd = C.hot; bg = C.hotBg; dash = 'solid'; }
          if (A.checked) {
            dash = 'solid';
            const right = on === (data.want.indexOf(p.id) !== -1);
            if (on || data.want.indexOf(p.id) !== -1) { bd = right ? C.ok : C.no; bg = right ? C.okBg : C.noBg; col = right ? C.ok : C.no; }
            else { bd = C.pale; bg = '#fff'; }
          }
          return (
            <button key={i} type="button" aria-pressed={on} data-term={p.id} disabled={A.locked} onClick={() => toggle(p.id)}
              style={{ ...S.mono, fontSize: wordy ? CARD_FS : size, ...WRAP, color: col, padding: '6px 10px', margin: '0 1px', borderRadius: 10, border: '2px ' + dash + ' ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              <Sup s={tr(p.v, lang)} />
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
  const itemOrder = useMemo(() => (data.noShuffle ? data.items.map((_, i) => i) : shuffled(data.items.length)), [data]);
  // Yozuvlarida so'z bo'lsa, tor ekranda ular bitta ustunda turadi.
  const wordItems = (data.items || []).some((it) => wordCard(tr(it.label, lang) || (it.tokens || []).map((x) => tr(x, lang)).join(' ')));
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
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <p style={S.ask}><Sup s={tr(data.ask, lang)} /> {data.note ? <span style={{ fontSize: 13, color: C.mute, fontWeight: 600 }}>{tr(data.note, lang)}</span> : null}</p>
      <MobileCss />
      <div className={wordItems ? 'pq-items-1' : 'pq-items'} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(' + (data.col || 180) + 'px, 1fr))', gap: 7 }}>
        {data.items.map((it) => {
          const on = marked.indexOf(it.id) !== -1;
          let bd = '#d6dae3'; let bg = '#fff';
          if (on) { bd = C.hot; bg = C.hotBg; }
          let bs = 'solid';
          // Tekshiruvdan keyin rang JAVOBNI ko'rsatadi: yashil -- javobga
          // kirgan yozuv, qizil -- ortiqcha belgilangan, qizil punktir --
          // o'tkazib yuborilgan. Belgilanmagan va javobga kirmagan yozuv
          // betaraf qoladi (ilgari u ham yashil bo'lardi va javob o'qilmasdi).
          // Tekshiruvdan keyin faqat O'QUVCHI belgilagan yozuvlar bo'yaladi:
          // yashil -- to'g'ri belgilangan, qizil -- ortiqcha. O'tkazib
          // yuborilgan yozuv KO'RSATILMAYDI (metodist qarori 2026-08-22:
          // javobni ochib berish -- tayyor maslahat, o'quvchi o'zi topishi
          // kerak). Razbor esa belgiga ishora qiladi, javobga emas.
          if (A.checked) {
            if (on && it.hit) { bd = C.ok; bg = C.okBg; }
            else if (on && !it.hit) { bd = C.no; bg = C.noBg; }
            else { bd = C.pale; bg = '#fff'; }
          }
          return (
            <button key={it.id} type="button" aria-pressed={on} data-item={it.id} disabled={A.locked} onClick={() => toggle(it.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, padding: '5px 10px', borderRadius: 13, border: '2px ' + bs + ' ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              {it.tokens ? <Row tokens={it.tokens} size={data.itemSize || 23} lang={lang} /> : <span style={{ fontSize: CARD_FS, fontWeight: 600, color: C.ink }}><Sup s={tr(it.label, lang)} /></span>}
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
  const cardOrder = useMemo(() => (data.noShuffle ? data.cards.map((_, i) => i) : shuffled(data.cards.length)), [data]);
  // TELEFONDA UZUN KARTALAR USTUN BO'LIB TURADI (metodist qarori 2026-08-22):
  // variantlar kabi -- har biri butun kenglikda, bittadan qatorda. Qisqa
  // kartalar (son, bir had) avvalgidek yonma-yon qoladi.
  const narrow = useNarrow();
  const stackCards = narrow && data.cards.some((c) => wordCard(String(tr(c.label, lang))));
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
    A.setFb({ correct, why: correct ? null : pickWhy(data, { seq, value, line: items.map((i) => (i ? tr(i.label, lang) : '')).join(' ') }, lang) });
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
  // Yig'ilgan javobda ham bitta rang: son va amal belgisi farq qilmaydi.
  const toneOf = () => C.ink;

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
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
                  style={{ border: 0, background: 'none', padding: '0 2px', ...S.mono, fontSize: LINE_FS, color: toneOf(it && it.label), cursor: A.locked ? 'default' : 'pointer' }}>
                  <Sup s={it && it.label ? tr(it.label, lang) : ''} />
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
      <div style={S.note}><Sup s={tr(data.ask, lang)} /></div>
      <div style={{ display: 'flex', gap: stackCards ? 6 : 8, justifyContent: 'center', flexWrap: 'wrap', alignItems: stackCards ? 'stretch' : 'center', flexDirection: stackCards ? 'column' : 'row', width: '100%', maxWidth: '100%' }}>
        {data.cards.map((c) => {
          const used = seq.indexOf(c.id) !== -1;
          return (
            <button key={c.id} type="button" data-card={c.id} disabled={used || A.locked} onClick={() => put(c.id)}
              style={{ minWidth: stackCards ? 0 : 52, width: stackCards ? '100%' : undefined, padding: '0 9px', height: 'auto', minHeight: stackCards ? 42 : 48, borderRadius: 13, border: '2px solid ' + (used ? '#eef0f4' : C.line), background: used ? C.bg : '#fff', ...S.mono, fontSize: CARD_FS, color: used ? C.line : toneOf(c.label), cursor: (used || A.locked) ? 'default' : 'pointer' , ...WRAP, maxWidth: stackCards ? '100%' : 'min(250px, 100%)' }}>
              <Sup s={tr(c.label, lang)} />
            </button>
          );
        })}
        <button type="button" disabled={A.locked || pos === 0} onClick={undo}
          style={{ marginLeft: 6, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #d6dae3', background: '#fff', color: (A.locked || pos === 0) ? '#c2c8d2' : C.soft, fontSize: 13.5, fontWeight: 700, cursor: (A.locked || pos === 0) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
          {tr(data.undo || L('Orqaga', 'Назад', 'Undo'), lang)}
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
  const [place, setPlace] = useState({});
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.place) setPlace(sa.place); } });
  // ZONALAR TARTIBI ARALASHTIRILADI, YOZUVLARNIKI EMAS (metodist QA si,
  // 2026-08-22 dagi tahlil). Sabab: yozuvlar ma'lumotda zonalar bilan bir
  // tartibda turardi -- birinchisini birinchi zonaga qo'yib ketish yetardi.
  // Yozuvlar tartibi esa RAZBORGA kerak: ba'zi izohlar «uchinchi tenglamada»
  // deb murojaat qiladi. Zonalarni aralashtirish teshikni yopadi va izohni
  // buzmaydi -- zonalar NOMI bilan atalgan, tartibi bilan emas.
  const zoneOrder = useMemo(() => (data.noShuffle ? data.zones.map((_, i) => i) : shuffled(data.zones.length)), [data]);
  const pool = data.items.filter((it) => !place[it.id]);
  const all = data.items.every((it) => place[it.id]);
  const wrongIds = data.items.filter((it) => place[it.id] && place[it.id] !== it.zone).map((it) => it.id);
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
    const bad = A.checked && wrongIds.indexOf(it.id) !== -1;
    const good = A.checked && place[it.id] && !bad;
    let bd = C.line; let bg = '#fff';
    if (picked === it.id) { bd = C.hot; bg = C.hotBg; }
    if (bad) { bd = C.no; bg = C.noBg; }
    if (good) { bd = C.ok; bg = C.okBg; }
    return (
      <button key={it.id} type="button" disabled={A.locked} data-item={it.id} onClick={(e) => tapItem(it.id, e)}
        style={{ padding: '5px 9px', borderRadius: 10, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer', lineHeight: 1 }}>
        <Row tokens={it.tokens} size={data.itemSize || 17} color={bad ? C.no : C.ink} tone={!bad} lang={lang} />
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <MobileCss />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '2px 0' }}>
        {zoneOrder.map((zi) => { const z = data.zones[zi]; return (
          <div key={z.id} className="pq-zrow" style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
            <div className="pq-zlbl" style={{ width: data.zoneLbl || 104, flex: '0 0 ' + (data.zoneLbl || 104) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 10.5, fontWeight: 700, color: C.mute, letterSpacing: '.03em', textAlign: 'right' }}><Sup s={tr(z.label, lang)} /></div>
            <div data-zone={z.id} onClick={() => tapZone(z.id)}
              style={{ flex: 1, minHeight: 42, borderRadius: 13, padding: 6, border: '2px dashed ' + (picked ? C.hot : C.pale), background: picked ? '#fff7f2' : C.bg, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'center', justifyContent: 'center', cursor: picked && !A.locked ? 'pointer' : 'default' }}>
              {data.items.filter((it) => place[it.id] === z.id).map(chip)}
            </div>
          </div>
        ); })}
      </div>
      <div style={S.note}><Sup s={tr(data.ask, lang)} /></div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 8 }}>
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
