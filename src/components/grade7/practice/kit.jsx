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
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 9px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '10px 0 8px' },
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '5px 0', borderRadius: 12, background: C.bg, border: '1px solid #eef0f4', marginBottom: 4 }}>
      {data.givenLabel ? <span style={{ fontSize: 12, fontWeight: 800, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase' }}>{tr(data.givenLabel, lang)}</span> : null}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (data.optCols || 1) + ', minmax(0, 1fr))', gap: 7 }}>
        {order.map((i) => {
          const o = data.opts[i];
          const active = picked === i;
          const short = (data.optCols || 1) > 1;
          let bg = '#fff'; let bd = '#d6dae3'; let col = C.soft;
          if (active) { bg = C.hotBg; bd = C.hot; col = C.ink; }
          if (A.checked && active) { const good = i === data.correct; bg = good ? C.okBg : C.noBg; bd = good ? C.ok : C.no; col = good ? C.ok : C.no; }
          if (A.checked && !active && i === data.correct) { bd = C.ok; col = C.ok; }
          return (
            <button key={i} type="button" data-opt={i} disabled={A.locked} onClick={() => setPicked(i)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: short ? 'center' : 'flex-start', width: '100%', minHeight: short ? 50 : 0, padding: '11px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: short ? 'center' : 'left' }}>
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
        style={{ width: '100%', boxSizing: 'border-box', fontSize: 24, fontWeight: 800, textAlign: 'center', padding: '12px 14px', borderRadius: 14, border: '2px solid ' + (A.checked ? (A.fb?.correct ? C.ok : C.no) : '#d6dae3'), background: A.checked ? '#fff' : C.bg, outline: 'none', fontFamily: S.mono.fontFamily }} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 3. SLOTSBANK
// Uyalar va kartalar banki. `rows` — yozuvning qatorlari; qatorda tokenlar
// yoki `{ slot: n }`. Kartani bosasiz, keyin uyani bosasiz.
// «Hammasi yoki hech narsa»: uyalarning hammasi to'g'ri bo'lishi kerak.
export function SlotsBank({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const n = data.answer.length;
  const [slots, setSlots] = useState(Array(n).fill(null));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots); } });
  const used = slots.filter(Boolean);
  const pool = data.cards.map(cardKey).filter((c) => used.indexOf(c) === -1);
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
  const size = data.exprSize || 26;
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', margin: '8px 0 6px' }}>
        {data.rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {row.map((part, pi) => {
              if (part.slot != null) {
                const i = part.slot;
                return (
                  <button key={pi} type="button" data-slot={i} disabled={A.locked} onClick={() => tapSlot(i)}
                    style={{
                      minWidth: 74, height: 46, borderRadius: 10, margin: '0 5px',
                      border: '2px ' + (slots[i] ? 'solid' : 'dashed') + ' ' + (slots[i] ? bd : (picked ? C.hot : C.line)),
                      background: slots[i] ? '#fff' : (picked ? '#fff7f2' : C.bg),
                      ...S.mono, fontSize: 23, color: C.ink, cursor: A.locked ? 'default' : 'pointer',
                    }}>
                    <Sup s={slots[i] ? tr(cardLbl(data, slots[i]), lang) : ''} />
                  </button>
                );
              }
              return <Row key={pi} tokens={part.t} size={size} lang={lang} />;
            })}
          </div>
        ))}
      </div>
      <div style={S.note}><Sup s={tr(data.ask, lang)} /></div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 9 }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 46, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c} type="button" data-card={c} disabled={A.locked} onClick={() => setPicked(picked === c ? null : c)}
              style={{ minWidth: 62, padding: '0 10px', height: 46, borderRadius: 12, border: '2px solid ' + (picked === c ? C.hot : C.line), background: picked === c ? C.hotBg : '#fff', ...S.mono, fontSize: 22, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
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
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <p style={S.ask}><Sup s={tr(data.ask, lang)} /></p>
      {data.note ? <div style={S.note}><Sup s={tr(data.note, lang)} /></div> : null}
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
            const right = on === (data.want.indexOf(p.id) !== -1);
            if (on || data.want.indexOf(p.id) !== -1) { bd = right ? C.ok : C.no; bg = right ? C.okBg : C.noBg; col = right ? C.ok : C.no; }
            else { bd = C.pale; bg = '#fff'; }
          }
          return (
            <button key={i} type="button" aria-pressed={on} data-term={p.id} disabled={A.locked} onClick={() => toggle(p.id)}
              style={{ ...S.mono, fontSize: size, color: col, padding: '6px 10px', margin: '0 1px', borderRadius: 10, border: '2px ' + dash + ' ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(' + (data.col || 180) + 'px, 1fr))', gap: 7 }}>
        {data.items.map((it) => {
          const on = marked.indexOf(it.id) !== -1;
          let bd = '#d6dae3'; let bg = '#fff';
          if (on) { bd = C.hot; bg = C.hotBg; }
          if (A.checked) { const right = on === !!it.hit; bd = right ? C.ok : C.no; bg = right ? C.okBg : C.noBg; }
          return (
            <button key={it.id} type="button" aria-pressed={on} data-item={it.id} disabled={A.locked} onClick={() => toggle(it.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, padding: '5px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              {it.tokens ? <Row tokens={it.tokens} size={data.itemSize || 23} lang={lang} /> : <span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}><Sup s={tr(it.label, lang)} /></span>}
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
  const toneOf = (lab) => (lab === '·' || lab === ':' ? C.stage2 : (lab === '+' || lab === '−' ? C.stage1 : (lab === '(' || lab === ')' ? C.brace : C.ink)));

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
                  style={{ border: 0, background: 'none', padding: '0 2px', ...S.mono, fontSize: 27, color: toneOf(it && it.label), cursor: A.locked ? 'default' : 'pointer' }}>
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
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {data.cards.map((c) => {
          const used = seq.indexOf(c.id) !== -1;
          return (
            <button key={c.id} type="button" data-card={c.id} disabled={used || A.locked} onClick={() => put(c.id)}
              style={{ minWidth: 52, padding: '0 9px', height: 48, borderRadius: 13, border: '2px solid ' + (used ? '#eef0f4' : C.line), background: used ? C.bg : '#fff', ...S.mono, fontSize: 23, color: used ? C.line : toneOf(c.label), cursor: (used || A.locked) ? 'default' : 'pointer' }}>
              <Sup s={tr(c.label, lang)} />
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
  const [place, setPlace] = useState({});
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.place) setPlace(sa.place); } });
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '2px 0' }}>
        {data.zones.map((z) => (
          <div key={z.id} style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
            <div style={{ width: data.zoneLbl || 104, flex: '0 0 ' + (data.zoneLbl || 104) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 10.5, fontWeight: 800, color: C.mute, letterSpacing: '.03em', textAlign: 'right' }}><Sup s={tr(z.label, lang)} /></div>
            <div data-zone={z.id} onClick={() => tapZone(z.id)}
              style={{ flex: 1, minHeight: 42, borderRadius: 13, padding: 6, border: '2px dashed ' + (picked ? C.hot : C.pale), background: picked ? '#fff7f2' : C.bg, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'center', justifyContent: 'center', cursor: picked && !A.locked ? 'pointer' : 'default' }}>
              {data.items.filter((it) => place[it.id] === z.id).map(chip)}
            </div>
          </div>
        ))}
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
