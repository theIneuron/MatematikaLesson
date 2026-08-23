// 8-SINF AMALIYOTINING UMUMIY QATLAMI — MEXANIKALAR BIR JOYDA.
//
// ASOS 7-sinf amaliyotidan olingan (qobiq, uslub, rang palitrasi
// o'zgartirilmagan), lekin tarkib 8-sinfning O'Z tasdiqlangan sakkiz tipiga
// moslashtirilgan (metodist qarori 2026-08-21). 7-sinfning o'z vazifasi
// endi boshqa tip tomonidan bajarilgan uchta mexanikasi — `Choice`,
// `TapTerms`, `MarkAll`, `BuildLine` (+ `evalSeq`) — O'CHIRILDI: ularning
// o'rnini `Abcd` va `Build` egalladi. `TypeValue` va `Zones` ATAYLAB
// qoldirildi: ishlatilmagan bo'lsa ham, ular keyingi darslarda kerak
// bo'ladigan tayyor zaxira (`TypeValue` — sof butun son so'ralganda
// `Input`dan yengilroq; `Zones` — ikkinchi to'lqinning `zones` tipi).
//
// NEGA UMUMIY QATLAM. Sinfda 55 dars, har darsda 10 topshiriq — 550 fayl.
// Agar har fayl o'z ichida uslub, razbor bloki, `registerCheck` ulanishini
// takrorlasa, bitta nuqsonni 550 joyda tuzatish kerak bo'ladi (CLAUDE.md §5).
//
// NIMA QOLADI TOPSHIRIQDA. Faqat MA'LUMOT: yozuv, variantlar, kartalar,
// to'g'ri javob, har xato yo'lga razbor va uch til. Ya'ni metodik ish.
//
// MUHIM QOIDA (7-sinfda 2026-08-20 da qimmatga tushgan xato): MATEMATIKA
// til blokining ICHIDA turmaydi. Yozuv, variant, karta -- bu tarjima emas,
// matematikaning o'zi. Uchta nusxa birinchi tahrirda ajralib ketadi va rus
// tilidagi topshiriq yechilmas bo'lib qoladi. Shuning uchun `expr`, `opts`,
// `cards`, `answer`, `excluded` -- til bloklaridan TASHQARIDA, `L()` esa
// faqat SO'ZLAR uchun.
//
// TASDIQLANGAN TIPLAR ("birinchi to'lqin", 2026-08-21, +Fix 2026-08-22):
//   TypeValue  -- javob klaviaturadan, manfiy son ham mumkin (zaxira, §yuqori)
//   SlotsBank  -- uyalar va kartalar banki; bir yoki bir necha qator (zaxira,
//                 sinfning O'Z `slots`/`fill` asbobi bilan bir xil shakl —
//                 shuning uchun amaliyotda hozircha ISHLATILMAYDI, §yuqori)
//   Zones      -- qiymatlarni ikki korzinaga taqsimlash (2026-08-22 dan
//                 ishlatiladi: TO'G'RI va NOTO'G'RI o'quvchi o'zi ajratadi)
//   Input      -- javobni yozadi: ifoda, son yoki ODZ (8-sinfning O'Z judge'i)
//   Build      -- teskari topshiriq: berilgan xossaga ega yozuv yig'iladi
//   Why        -- amal VA asos: ikkalasi birga tekshiriladi (zaxira,
//                 2026-08-22 dan ISHLATILMAYDI -- metodist: tayyor gaplardan
//                 tanlash qiziq emas, o'rnini Cancel egalladi)
//   Audit      -- birinchi noto'g'ri satr + kontrprimer
//   Counter    -- kontrprimer son bilan: da'vo qayerda buziladi
//   YesNo      -- ha/yo'q + dalil son bilan (50% dan chiqarish uchun)
//   Abcd       -- to'rttadan bittasi yoki ikkitasi, faqat isinish uchun
//   Fix        -- yozuv ICHIDAGI xato belgini topib, tuzatishni yozadi
//   Cancel     -- surat va maxrajda mos ko'paytuvchini QO'L bilan chizib
//                 tashlaydi (gap tanlamaydi), keyin shartni yozadi
//
// QABUL QILINGAN, LEKIN HALI YOZILMAGAN (metodist 2026-08-22 tasdiqladi,
// o'z darsi kelganda yoziladi — CLAUDE.md tekshirilmagan mexanika
// tekshirilmagan qolgan mexanikadan yomonroq degan qoidasiga ko'ra):
//   Bracket     -- javob ANIQ son emas, ikki CHEGARA (masalan «...dan tashqari»)
//   CounterBuild-- kontrprimer SON emas, kartalardan YIG'ILGAN butun misol
//   ProofOrder  -- tayyor gaplar mulohaza TARTIBIGA qo'yiladi
//
// YANGI QOIDA (metodist qarori, variant A): javob NOTO'G'RI bo'lganda
// TO'G'RI JAVOB HECH QACHON KO'RSATILMAYDI — faqat maslahat, u belgini
// yoki joyni ataydi, sonni yoki amalni bermaydi.
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
import { judgeExpr, judgeOdz } from '../math.jsx';
import { parse, evaluate, domainHoles } from '../mathcore.js';

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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
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
    <div style={S.eyebrow}>{tr(data.eyebrow, lang)}</div>
    {data.setup ? <p style={S.setup}>{tr(data.setup, lang)}</p> : null}
  </>
);

// Berilgan qiymatlar qatori (a = 4, b = −3). Matematika — `data.given`,
// so'z — `data.givenLabel`.
const Given = ({ data, lang }) => {
  if (!data.given || !data.given.length) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '5px 0', borderRadius: 12, background: C.bg, border: '1px solid #eef0f4', marginBottom: 4 }}>
      {data.givenLabel ? <span style={{ fontSize: 12, fontWeight: 800, color: C.mute, letterSpacing: '.04em', textTransform: 'uppercase' }}>{tr(data.givenLabel, lang)}</span> : null}
      {data.given.map((g, i) => <Row key={i} tokens={g} size={22} />)}
    </div>
  );
};

// ============================================================ 1. TYPEVALUE
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
      <Head data={data} lang={lang} />
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

// ============================================================ 2. SLOTSBANK
// Uyalar va kartalar banki. `rows` — yozuvning qatorlari; qatorda tokenlar
// yoki `{ slot: n }`. Kartani bosasiz, keyin uyani bosasiz.
// «Hammasi yoki hech narsa»: uyalarning hammasi to'g'ri bo'lishi kerak.
export function SlotsBank({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const n = data.answer.length;
  const [slots, setSlots] = useState(Array(n).fill(null));
  const [picked, setPicked] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.slots) setSlots(sa.slots); } });
  const used = slots.filter(Boolean);
  const pool = data.cards.filter((c) => used.indexOf(c) === -1);
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
                    {slots[i] || ''}
                  </button>
                );
              }
              return <Row key={pi} tokens={part.t} size={size} />;
            })}
          </div>
        ))}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ borderTop: '1px dashed ' + C.pale, paddingTop: 9 }}>
        <div style={S.bankLbl}>{String(tr(data.bank, lang)).toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 46, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: C.line, fontWeight: 700 }}>—</span>}
          {pool.map((c) => (
            <button key={c} type="button" data-card={c} disabled={A.locked} onClick={() => setPicked(picked === c ? null : c)}
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

// ============================================================ 3. ZONES
// Yozuvlarni zonalarga taqsimlash. BOSISH bilan, tortish bilan emas:
// telefonda barmoq zonadan chetga tushadi (3-sinf kanoni §3.6).
export function Zones({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [place, setPlace] = useState({});
  const [picked, setPicked] = useState(null);
  // Metodist so'rovi 2026-08-22: TORTIB TASHLASH (native HTML5 drag-and-drop)
  // qo'shildi kompyuter uchun. TAP eski yo'l SAQLANGAN va o'chirilmagan --
  // sensorli ekranlarda brauzerlararo drag ISHONCHSIZ (3-sinf kanoni §3.6:
  // barmoq zonadan chetga tushadi), shuning uchun telefon TAP orqali ishlaydi,
  // sichqoncha esa ikkisidan istaganini tanlaydi.
  const [dragOver, setDragOver] = useState(null);
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

  const dragStart = (id) => (e) => {
    if (A.locked) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };
  const dragOverZone = (key) => (e) => { e.preventDefault(); if (!A.locked) setDragOver(key); };
  const dragLeaveZone = (key) => () => setDragOver((d) => (d === key ? null : d));
  const dropOnZone = (zoneId) => (e) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (!id || A.locked) return;
    setPlace((p) => ({ ...p, [id]: zoneId }));
    setPicked(null);
  };
  const dropOnPool = (e) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (!id || A.locked) return;
    setPlace((p) => { const n = { ...p }; delete n[id]; return n; });
    setPicked(null);
  };

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

  // Metodist qarori 2026-08-22 (variant A): TO'G'RI joylashtirilgan chip
  // yashilga AYLANMAYDI -- faqat XATO chip qizil bo'ladi (Audit/Fix bilan
  // bir xil qoida). Aks holda qisman to'g'ri javobda qaysi chip to'g'ri
  // ekani ko'rinib, javob qisman oshkor bo'lardi.
  const chip = (it) => {
    const bad = A.checked && wrongIds.indexOf(it.id) !== -1;
    let bd = C.line; let bg = '#fff';
    if (picked === it.id) { bd = C.hot; bg = C.hotBg; }
    else if (A.checked && place[it.id] && !bad) { bd = C.mute; bg = C.bg; }
    if (bad) { bd = C.no; bg = C.noBg; }
    return (
      <button key={it.id} type="button" disabled={A.locked} data-item={it.id} onClick={(e) => tapItem(it.id, e)}
        draggable={!A.locked} onDragStart={dragStart(it.id)}
        style={{ padding: '5px 9px', borderRadius: 10, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'grab', lineHeight: 1 }}>
        <Row tokens={it.tokens} size={data.itemSize || 17} color={bad ? C.no : C.ink} tone={!bad} />
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '2px 0' }}>
        {data.zones.map((z) => {
          // Zona "nishonlangan" ko'rinadi ikki holatda: tap bilan bir dona
          // tanlangan (`picked`) YOKI ustidan tortib kelinayotgan bo'lsa
          // (`dragOver`) -- ikkisi bir xil "mumkin" belgisini beradi.
          const targetable = picked || dragOver === z.id;
          return (
            <div key={z.id} style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
              <div style={{ width: data.zoneLbl || 104, flex: '0 0 ' + (data.zoneLbl || 104) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 10.5, fontWeight: 800, color: C.mute, letterSpacing: '.03em', textAlign: 'right' }}>{tr(z.label, lang)}</div>
              <div data-zone={z.id} onClick={() => tapZone(z.id)}
                onDragOver={dragOverZone(z.id)} onDragLeave={dragLeaveZone(z.id)} onDrop={dropOnZone(z.id)}
                style={{ flex: 1, minHeight: 42, borderRadius: 13, padding: 6, border: '2px dashed ' + (targetable ? C.hot : C.pale), background: targetable ? '#fff7f2' : C.bg, display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'center', justifyContent: 'center', cursor: picked && !A.locked ? 'pointer' : 'default' }}>
                {data.items.filter((it) => place[it.id] === z.id).map(chip)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ borderTop: '1px dashed ' + (dragOver === 'pool' ? C.hot : C.pale), paddingTop: 8 }}
        onDragOver={dragOverZone('pool')} onDragLeave={dragLeaveZone('pool')} onDrop={dropOnPool}>
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

// ============================================================================
// 8-SINF UCHUN QO'SHILGAN SAKKIZ TIP (metodist 2026-08-21, "birinchi to'lqin").
// Dizayn va rang O'ZGARTIRILMAGAN: yuqoridagi S/C palitrasi, HFB, Head, Given
// aynan shu tiplarda ham ishlatiladi -- 7-sinf amaliyoti bilan bir xil ko'rinish.
//
// YANGI QOIDA (metodist qarori, variant A): javob NOTO'G'RI bo'lganda TO'G'RI
// JAVOB KO'RSATILMAYDI. Faqat maslahat -- belgi yoki joyni ataydi, sonni yoki
// amalni bermaydi. Shuning uchun bu yerda hech qanday "unpicked-correct"
// yashil bo'lib yonmaydi: faqat o'quvchi TANLAGAN narsa qizil yoki yashil.
//
// Matematikani baholash 8-sinfning O'Z judge'laridan olinadi (`judgeExpr`,
// `judgeOdz` -- math.jsx; `parse`/`evaluate`/`domainHoles` -- mathcore.js),
// UI esa 7-sinf uslubida yozilgan -- ikkisi mustaqil.

// ---- umumiy: bitta "son" maydoni, sinfning matematik yadrosi bilan ----
// `numeric` -- telefonda RAQAM klaviaturasi chiqadi (harf-belgi klaviaturasi
// emas). Faqat sof songa mo'ljallangan maydonlarda ishlatiladi.
//
// GOTCHA (metodist, 2026-08-23): bo'sh maydon -- necha xonali, ishorami,
// nima yozish kerakligi ko'rinmaydi. Shuning uchun `numeric` maydonda
// placeholder BERILMASA, umumiy "faqat son" ko'rsatmasi ko'rinadi -- javobni
// oshkor qilmaydi, lekin format nima ekanini aytadi.
const NUM_PLACEHOLDER = { uz: 'faqat son', ru: 'только число', en: 'number only' };
const NumField = ({ value, onChange, locked, placeholder, numeric, lang }) => (
  <input data-input="1" value={value} onChange={(e) => onChange(e.target.value)} disabled={locked}
    placeholder={placeholder || (numeric ? (NUM_PLACEHOLDER[lang] || NUM_PLACEHOLDER.uz) : '')} autoComplete="off" spellCheck="false"
    inputMode={numeric ? 'numeric' : 'text'} pattern={numeric ? '-?[0-9]*' : undefined}
    style={{ width: '100%', boxSizing: 'border-box', fontSize: 22, fontWeight: 800, textAlign: 'center', padding: '11px 14px', borderRadius: 14, border: '2px solid ' + C.line, background: locked ? '#fff' : C.bg, outline: 'none', fontFamily: S.mono.fontFamily, color: C.ink }} />
);

// ============================================================ 4. INPUT
// Javobni O'ZI yozadi: ifoda, son yoki ODZ. `kind`: 'expr' | 'number' | 'odz'.
// TypeValue (1) dan farqi -- javob FAQAT butun son emas, ifoda va shart ham
// bo'lishi mumkin (masalan `x != 3`, `(x+2)/(x-1)`).
export function Input({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.value != null) setVal(String(sa.value)); } });
  useEffect(() => { onReady?.(val.trim() !== '' && !A.checked); }, [val, A.checked, onReady]);
  const kind = data.kind || 'expr';

  const check = useCallback(() => {
    const res = kind === 'odz'
      ? judgeOdz(val, { excluded: data.excluded, varName: data.varName })
      : judgeExpr(val, { answer: data.answer });
    const correct = !!res.ok;
    const keyed = data.hints && data.hints[val.trim()];
    A.setFb({ correct, why: correct ? null : (keyed ? tr(keyed, lang) : pickWhy(data, { val, res }, lang)) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { value: val }, correct }));
  }, [val, kind, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      {data.expr ? <div style={{ textAlign: 'center', margin: '6px 0 12px' }}><Row tokens={data.expr} size={data.exprSize || 30} /></div> : null}
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }}>{tr(data.label, lang)}</label>
      <NumField value={val} onChange={setVal} locked={A.locked} placeholder={tr(data.placeholder, lang)} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 5. BUILD
// TESKARI topshiriq: berilgan XOSSAGA ega yozuv kartalardan yig'iladi.
// `wrap` -- '5 / (%s)' andozasi: o'quvchi faqat MAXRAJNI yig'adi, `want.holes`
// -- shu maxraj nolga aylanishi kerak bo'lgan qiymatlar ro'yxati.
export function Build({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [seq, setSeq] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.seq) setSeq(sa.seq); } });
  const built = seq.join(' ');
  useEffect(() => { onReady?.(seq.length > 0 && !A.checked); }, [seq, A.checked, onReady]);

  const check = useCallback(() => {
    const full = data.wrap ? data.wrap.replace('%s', built) : built;
    const P = parse(full);
    let correct = false; let why = null;
    if (P.error) { why = tr(data.parseWrong, lang) || null; }
    else {
      const holes = (domainHoles(full, data.varName).holes || []).slice().sort((a, b) => a - b);
      const want = (data.want.holes || []).slice().sort((a, b) => a - b);
      const isFrac = full.indexOf('/') !== -1;
      correct = isFrac && holes.length === want.length && holes.every((v, i) => Math.abs(v - want[i]) < 1e-9);
      if (!correct) why = pickWhy(data, { holes, isFrac, built }, lang);
    }
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { built }, correct }));
  }, [built, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <div style={{ minHeight: 56, borderRadius: 16, border: '2px solid ' + C.pale, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 12px', margin: '4px 0 8px' }}>
        {built ? <span style={{ ...S.mono, fontSize: 24 }}>{data.frame ? data.frame(built) : built}</span> : <span style={{ fontSize: 14, color: C.mute, fontWeight: 600 }}>{tr(data.placeholder, lang)}</span>}
      </div>
      <div style={S.note}>{tr(data.ask, lang)}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {data.cards.map((c, i) => (
          <button key={c + i} type="button" data-card={c} disabled={A.locked} onClick={() => setSeq((s) => s.concat(c))}
            style={{ minWidth: 52, padding: '0 12px', height: 46, borderRadius: 12, border: '2px solid ' + C.line, background: '#fff', ...S.mono, fontSize: 20, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
            {c}
          </button>
        ))}
        <button type="button" disabled={A.locked || !seq.length} onClick={() => setSeq((s) => s.slice(0, -1))}
          style={{ marginLeft: 6, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #d6dae3', background: '#fff', color: C.soft, fontSize: 13.5, fontWeight: 700, cursor: A.locked ? 'default' : 'pointer' }}>
          BACKSPACE
        </button>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 6. WHY
// Amal VA asos: ikkita tanlov birga tekshiriladi. 8-sinfning asosiy balosi --
// natija to'g'ri, ASOS noto'g'ri -- shuning uchun ikkisi ham kerak.
export function Why({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [act, setAct] = useState(null);
  const [reason, setReason] = useState(null);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setAct(sa.act); setReason(sa.reason); } } });
  useEffect(() => { onReady?.(act != null && reason != null && !A.checked); }, [act, reason, A.checked, onReady]);

  const check = useCallback(() => {
    const actOk = act === data.answerAction;
    const reasonOk = reason === data.answerReason;
    const correct = actOk && reasonOk;
    let why = null;
    if (!correct) {
      why = !actOk
        ? (tr(data.hintsAction && data.hintsAction[act], lang) || pickWhy(data, { act, reason }, lang))
        : (tr(data.hintsReason && data.hintsReason[reason], lang) || pickWhy(data, { act, reason }, lang));
    }
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { act, reason }, correct }));
  }, [act, reason, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const pillGroup = (items, val, setVal, answerKey) => (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center', margin: '4px 0 10px' }}>
      {items.map((o) => {
        const active = val === o.id;
        const bad = A.checked && active && val !== data[answerKey];
        const good = A.checked && active && !bad;
        let bg = '#fff'; let bd = C.line; let col = C.soft;
        if (active) { bg = C.hotBg; bd = C.hot; col = C.ink; }
        if (bad) { bg = C.noBg; bd = C.no; col = C.no; }
        if (good) { bg = C.okBg; bd = C.ok; col = C.ok; }
        return (
          <button key={o.id} type="button" data-opt={o.id} disabled={A.locked} onClick={() => setVal(o.id)}
            style={{ padding: '9px 14px', borderRadius: 12, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 700, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit' }}>
            {tr(o.label, lang)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      {data.expr ? <div style={{ textAlign: 'center', margin: '4px 0 10px' }}><Row tokens={data.expr} size={data.exprSize || 30} /></div> : null}
      <p style={S.ask}>{tr(data.ask, lang)}</p>
      {pillGroup(data.actions, act, setAct, 'answerAction')}
      <div style={S.note}>{tr(data.reasonAsk, lang)}</div>
      {pillGroup(data.reasons, reason, setReason, 'answerReason')}
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 7. AUDIT
// BIRINCHI noto'g'ri satr + kontrprimer. Har satr TO'G'RIDEK ko'rinadi.
// Ball FAQAT ikkisi ham to'g'ri bo'lsa: satr VA sonning ikkisi ham.
export function Audit({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [row, setRow] = useState(null);
  const [num, setNum] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setRow(sa.row); setNum(sa.num || ''); } } });
  useEffect(() => { onReady?.(row != null && num.trim() !== '' && !A.checked); }, [row, num, A.checked, onReady]);

  const check = useCallback(() => {
    const rowOk = row === data.answerId;
    const n = Number(String(num).replace(',', '.'));
    const but = data.proof.but || [];
    const already = but.some((v) => Math.abs(v - n) < 1e-9);
    let proofOk = false;
    if (Number.isFinite(n) && !already) {
      const P = parse(data.proof.of);
      if (!P.error) {
        const env = {}; env[data.proof.varName || 'x'] = n;
        proofOk = evaluate(P.node, env) === null;
      }
    }
    const correct = rowOk && proofOk;
    let why = null;
    if (!rowOk) why = tr(data.hints && data.hints[row], lang) || pickWhy(data, { row, n }, lang);
    else if (already) why = tr(data.proofAlready, lang);
    else if (!proofOk) why = tr(data.proofWrong, lang);
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { row, num }, correct }));
  }, [row, num, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      {data.expr ? <div style={{ textAlign: 'center', margin: '4px 0 10px' }}><Row tokens={data.expr} size={data.exprSize || 30} /></div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '4px 0 10px' }}>
        {data.rows.map((r, i) => {
          const active = row === r.id;
          const bad = A.checked && active && r.id !== data.answerId;
          let bd = C.line; let bg = '#fff';
          if (active) { bd = C.hot; bg = C.hotBg; }
          if (bad) { bd = C.no; bg = C.noBg; }
          return (
            <button key={r.id} type="button" data-row={r.id} disabled={A.locked} onClick={() => setRow(r.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', padding: '7px 12px', borderRadius: 11, border: '2px solid ' + bd, background: bg, cursor: A.locked ? 'default' : 'pointer' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.mute }}>{i + 1}</span>
              <span style={{ ...S.mono, fontSize: 17, color: C.ink }}>{React.isValidElement(r.show) ? r.show : tr(r.show, lang)}</span>
            </button>
          );
        })}
      </div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }}>{tr(data.proof.label, lang)}</label>
      <NumField value={num} onChange={setNum} locked={A.locked} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 8. COUNTER
// Da'vo umumiy holatda to'g'ri, biror qiymatda BUZILADI. Javob -- SON, u
// yerda ikki taraf teng bo'lmaydi (yoki bittasi qiymatga ega bo'lmaydi).
export function Counter({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [num, setNum] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.value != null) setNum(String(sa.value)); } });
  useEffect(() => { onReady?.(num.trim() !== '' && !A.checked); }, [num, A.checked, onReady]);

  const check = useCallback(() => {
    const n = Number(String(num).replace(',', '.'));
    let correct = false;
    if (Number.isFinite(n)) {
      const L = parse(data.left); const R = parse(data.right);
      if (!L.error && !R.error) {
        const env = {}; env[data.varName || 'x'] = n;
        const lv = evaluate(L.node, env); const rv = evaluate(R.node, env);
        correct = (lv === null) !== (rv === null) || (lv !== null && rv !== null && Math.abs(lv - rv) > 1e-9);
      }
    }
    const keyed = data.hints && data.hints[String(n)];
    A.setFb({ correct, why: correct ? null : (tr(keyed, lang) || pickWhy(data, { n }, lang)) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { value: n }, correct }));
  }, [num, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '6px 0 12px' }}>
        <Row tokens={data.leftShow} size={data.exprSize || 26} />
        <span style={{ ...S.mono, fontSize: 22, color: C.mute }}>=</span>
        <Row tokens={data.rightShow} size={data.exprSize || 26} />
      </div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }}>{tr(data.label, lang)}</label>
      <NumField value={num} onChange={setNum} locked={A.locked} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 9. YESNO
// Ha/Yo'q + DALIL: tanlov o'zi 50% dan chiqib ketishi mumkin, shuning uchun
// ikkinchi qadam har doim SON bilan tasdiqlanadi (Counter bilan bir xil yadro).
// `right` -- da'vo TO'G'RImi (bool). `proofRef` -- taqqoslanadigan ifoda.
export function YesNo({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [pick, setPick] = useState(null);
  const [num, setNum] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setPick(sa.pick); setNum(sa.value != null ? String(sa.value) : ''); } } });
  useEffect(() => { onReady?.(pick != null && num.trim() !== '' && !A.checked); }, [pick, num, A.checked, onReady]);

  const check = useCallback(() => {
    const pickOk = pick === data.right;
    const n = Number(String(num).replace(',', '.'));
    let proofOk = false;
    if (Number.isFinite(n)) {
      const L = parse(data.left);
      if (!L.error) {
        const env = {}; env[data.varName || 'x'] = n;
        const lv = evaluate(L.node, env);
        const P = parse(data.proofRef);
        const rv = P.error ? null : evaluate(P.node, env);
        proofOk = data.right
          ? (lv !== null && rv !== null && Math.abs(lv - rv) < 1e-9)
          : ((lv === null) !== (rv === null) || (lv !== null && rv !== null && Math.abs(lv - rv) > 1e-9));
      }
    }
    const correct = pickOk && proofOk;
    let why = null;
    if (!pickOk) why = tr(data.hintsPick && data.hintsPick[pick ? 'yes' : 'no'], lang) || pickWhy(data, { pick, n }, lang);
    else if (!proofOk) why = tr(data.proofWrong, lang);
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.claim, lang), studentAnswer: { pick, value: n }, correct }));
  }, [pick, num, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const btn = (val, label) => {
    const active = pick === val;
    const bad = A.checked && active && val !== data.right;
    const good = A.checked && active && !bad;
    let bg = '#fff'; let bd = C.line; let col = C.soft;
    if (active) { bg = C.hotBg; bd = C.hot; col = C.ink; }
    if (bad) { bg = C.noBg; bd = C.no; col = C.no; }
    if (good) { bg = C.okBg; bd = C.ok; col = C.ok; }
    return (
      <button type="button" data-pick={val ? 'yes' : 'no'} disabled={A.locked} onClick={() => setPick(val)}
        style={{ padding: '10px 22px', borderRadius: 12, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 800, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit' }}>
        {label}
      </button>
    );
  };

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      {data.expr ? <div style={{ textAlign: 'center', margin: '4px 0 8px' }}><Row tokens={data.expr} size={data.exprSize || 28} /></div> : null}
      <p style={S.ask}>{tr(data.claim, lang)}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '6px 0 12px' }}>
        {btn(true, tr(data.yesLabel, lang) || 'Ha')}
        {btn(false, tr(data.noLabel, lang) || "Yo'q")}
      </div>
      <div style={S.note}>{tr(data.proofAsk, lang)}</div>
      <NumField value={num} onChange={setNum} locked={A.locked} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}

// ============================================================ 10. ABCD
// To'rttadan bittasi yoki ikkitasi (`data.pickTwo`). Etalon §1.1: bu ZAIF
// tekshiruv, shuning uchun faqat "isinish" va usul nomini so'rash uchun.
// TO'G'RI JAVOB HECH QACHON KO'RSATILMAYDI: faqat tanlanganlar rangga kiradi.
export function Abcd({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [picked, setPicked] = useState([]);
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa?.picked) setPicked(sa.picked); } });
  const need = data.pickTwo ? 2 : 1;
  useEffect(() => { onReady?.(picked.length === need && !A.checked); }, [picked, need, A.checked, onReady]);

  const order = useMemo(() => {
    const idx = data.opts.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    return idx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const toggle = (i) => {
    if (A.locked) return;
    setPicked((p) => {
      if (p.indexOf(i) !== -1) return p.filter((x) => x !== i);
      if (need === 1) return [i];
      return p.length < need ? p.concat(i) : p;
    });
  };
  const check = useCallback(() => {
    const want = data.pickTwo ? data.correct.slice().sort() : [data.correct];
    const mine = picked.slice().sort();
    const correct = mine.length === want.length && mine.every((v, i) => v === want[i]);
    A.setFb({ correct, why: correct ? null : pickWhy(data, { picked: mine }, lang) });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { picked: mine.slice() }, correct }));
  }, [picked, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      {data.expr ? <div style={{ textAlign: 'center', margin: '4px 0 10px' }}><Row tokens={data.expr} size={data.exprSize || 30} /></div> : null}
      <p style={S.ask}>{tr(data.ask, lang)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (data.optCols || 1) + ', minmax(0, 1fr))', gap: 7 }}>
        {order.map((i) => {
          const o = data.opts[i];
          const active = picked.indexOf(i) !== -1;
          const want = data.pickTwo ? data.correct : [data.correct];
          const bad = A.checked && active && want.indexOf(i) === -1;
          const good = A.checked && active && !bad;
          let bg = '#fff'; let bd = '#d6dae3'; let col = C.soft;
          if (active) { bg = C.hotBg; bd = C.hot; col = C.ink; }
          if (bad) { bg = C.noBg; bd = C.no; col = C.no; }
          if (good) { bg = C.okBg; bd = C.ok; col = C.ok; }
          return (
            <button key={i} type="button" data-opt={i} disabled={A.locked} onClick={() => toggle(i)}
              style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: A.locked ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              {typeof o.label === 'object' && Array.isArray(o.label) ? <Row tokens={o.label} size={20} /> : tr(o.label, lang)}
            </button>
          );
        })}
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}


// ============================================================ 11. FIX
// Metodist qarori 2026-08-22: "birinchi to'lqin" ga qo'shildi, chunki
// sinfning O'Z asbob to'plamida (`screens.jsx` -> `slots`/`fill`) xuddi
// SHUNDAY "kartani bosib uyani to'ldirish" bor edi -- amaliyot uni
// takrorlagan bo'lardi. `Fix` esa BOSHQA ish qiladi: tayyor (NOTO'G'RI)
// yozuvning O'ZIDA xato joyni ko'rsatib, keyin TUZATISHNI yozadi. Bitta
// joyni tanlash (Audit kabi) EMAS -- yozuvning ICHIDAGI aniq belgi.
//
// data.statement: token qatori. Har biri `{ id, v }` -- bosiladi -- yoki
// oddiy satr/{n,d} -- bosilmaydi, kontekst uchun. `data.wrongId` -- xato
// TOKENNING id'si. `data.correct` -- o'sha joyga yozilishi kerak bo'lgan
// qiymat (SON yoki ifoda, `judgeExpr` bilan solishtiriladi).
export function Fix({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [picked, setPicked] = useState(null);
  const [val, setVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setPicked(sa.picked); setVal(sa.value || ''); } } });
  useEffect(() => { onReady?.(picked != null && val.trim() !== '' && !A.checked); }, [picked, val, A.checked, onReady]);

  const check = useCallback(() => {
    const pickOk = picked === data.wrongId;
    const res = pickOk ? judgeExpr(val, { answer: data.correct }) : { ok: false };
    const correct = pickOk && !!res.ok;
    let why = null;
    if (!pickOk) why = tr(data.hintsPick && data.hintsPick[picked], lang) || pickWhy(data, { picked }, lang);
    else if (!correct) why = tr(data.hints && data.hints[val.trim()], lang) || tr(data.fixWrong, lang);
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { picked, value: val }, correct }));
  }, [picked, val, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <Given data={data} lang={lang} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 2, margin: '8px 0 4px' }}>
        {data.statement.map((tok, i) => {
          if (typeof tok !== 'object' || tok.id === undefined) {
            return (typeof tok === 'string' || (tok && tok.n !== undefined))
              ? <Row key={i} tokens={[tok]} size={data.exprSize || 28} />
              : null;
          }
          const active = picked === tok.id;
          // Audit bilan bir xil qoida: FAQAT xato tanlov qizil bo'ladi.
          // To'g'ri tanlov -- hatto tekshirilgandan keyin ham -- shunchaki
          // "faol" (hot) rangda qoladi, yashilga aylanmaydi: aks holda
          // to'g'ri joy o'zi javobni ko'rsatib qo'yardi.
          const bad = A.checked && active && tok.id !== data.wrongId;
          let bd = C.line; let bg = C.bg; let dash = 'dashed';
          if (active) { bd = C.hot; bg = C.hotBg; dash = 'solid'; }
          if (bad) { bd = C.no; bg = C.noBg; }
          return (
            <button key={i} type="button" data-tok={tok.id} disabled={A.locked} onClick={() => setPicked(tok.id)}
              style={{ ...S.mono, fontSize: data.exprSize || 28, padding: '4px 9px', margin: '0 1px', borderRadius: 10, border: '2px ' + dash + ' ' + bd, background: bg, color: C.ink, cursor: A.locked ? 'default' : 'pointer' }}>
              {tok.v}
            </button>
          );
        })}
      </div>
      <p style={S.ask}>{tr(data.ask, lang)}</p>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }}>{tr(data.label, lang)}</label>
      <NumField value={val} onChange={setVal} locked={A.locked} placeholder={tr(data.placeholder, lang)} />
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}


// ============================================================ 13. CANCEL
// Metodist qarori 2026-08-22: `Why` (tayyor gaplardan tanlash) qiziqarli
// emas edi. `Cancel` boshqacha ishlaydi: o'quvchi TAYYOR GAPNI TANLAMAYDI,
// balki yozuvning O'ZIDA mos ko'paytuvchini SURAT va MAXRAJDA bosib
// ZACHYORKAYDI (chizib tashlaydi) -- keyin qolgan shartni yozadi. Bir
// gapni ham o'qimaydi, faqat qo'l bilan ishlaydi.
//
// data.numerator / data.denominator: `{ id, v }` ko'paytuvchilar qatori.
// `data.matchNum` / `data.matchDen` -- to'g'ri chizib tashlanadigan
// ko'paytuvchi. Ikkalasi tanlangach chiziq CHIQADI (to'g'ri yoki noto'g'ri
// bo'lsa ham -- tekshirish faqat "Tekshirish" bosilganda). Shundan keyin
// shart maydoni ochiladi.
// Chizib tashlangandan keyingi savol IKKI SON bilan (matn maydoni EMAS):
// metodist qarori 2026-08-23 -- "x != 2" kabi yozuv telefonda yozish
// noqulay (maxsus belgi kerak), ustiga u chizib tashlangan bo'lakning
// SONINI shunchaki KO'CHIRIB YOZISH bo'lib qolardi -- juda oddiy.
//   1. `forbid`   -- taqiqlangan qiymat, SON (chizib tashlangan ko'paytuvchi
//      qaysi qiymatda nolga aylarga TENGLASHTIRILADI, ko'chirib emas).
//   2. `checkAt` / `checkAnswer` -- SODDALASHTIRILGAN yozuvni berilgan x da
//      HISOBLASH: ekranda ko'rinmagan, hisoblash kerak bo'lgan son.
export function Cancel({ data, lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit }) {
  const [numPick, setNumPick] = useState(null);
  const [denPick, setDenPick] = useState(null);
  const [forbid, setForbid] = useState('');
  const [checkVal, setCheckVal] = useState('');
  const A = useAnswer({ mode, initialAnswer, restore: (sa) => { if (sa) { setNumPick(sa.numPick); setDenPick(sa.denPick); setForbid(sa.forbid || ''); setCheckVal(sa.checkVal || ''); } } });
  const bothPicked = numPick != null && denPick != null;
  const filled = forbid.trim() !== '' && checkVal.trim() !== '';
  useEffect(() => { onReady?.(bothPicked && filled && !A.checked); }, [bothPicked, filled, A.checked, onReady]);

  const check = useCallback(() => {
    const cutOk = numPick === data.matchNum && denPick === data.matchDen;
    // "3+7" ham TO'G'RI ish -- son ko'rinishida yozilmagan xolos. Avval
    // bevosita songa o'girishga urinadi, chiqmasa IFODA sifatida hisoblaydi
    // (metodist, 2026-08-23: "3+7" ni "javob emas" deb rad etish xato edi).
    const asNumber = (raw) => {
      const s = String(raw).trim();
      if (!s) return null;
      const n = Number(s.replace(',', '.'));
      if (Number.isFinite(n)) return n;
      const P = parse(s);
      if (P.error) return null;
      const v = evaluate(P.node, {});
      return v;
    };
    const forbidOk = asNumber(forbid) === data.forbid;
    const checkOk = asNumber(checkVal) === data.checkAnswer;
    const correct = cutOk && forbidOk && checkOk;
    let why = null;
    if (!cutOk) {
      why = tr((data.hintsNum && data.hintsNum[numPick]) || (data.hintsDen && data.hintsDen[denPick]), lang) || pickWhy(data, { numPick, denPick }, lang);
    } else if (!forbidOk) {
      why = tr(data.hintsForbid && data.hintsForbid[forbid.trim()], lang) || tr(data.forbidWrong, lang);
    } else if (!checkOk) {
      why = tr(data.hintsCheck && data.hintsCheck[checkVal.trim()], lang) || tr(data.checkWrong, lang);
    }
    A.setFb({ correct, why });
    A.setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.(submitPayload(data, { questionText: tr(data.ask, lang), studentAnswer: { numPick, denPick, forbid, checkVal }, correct }));
  }, [numPick, denPick, forbid, checkVal, data, lang, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const tok = (t, picked, setPicked) => {
    const active = picked === t.id;
    const cut = bothPicked && active; // ikkalasi tanlangach -- chiziq
    const bad = A.checked && active && (numPick !== data.matchNum || denPick !== data.matchDen);
    let bd = C.line; let bg = '#fff';
    if (active) { bd = C.hot; bg = C.hotBg; }
    if (bad) { bd = C.no; bg = C.noBg; }
    return (
      <button key={t.id} type="button" disabled={A.locked} data-tok={t.id}
        onClick={() => setPicked(picked === t.id ? null : t.id)}
        style={{ ...S.mono, fontSize: data.exprSize || 26, padding: '5px 10px', borderRadius: 10, border: '2px solid ' + bd, background: bg, color: C.ink, cursor: A.locked ? 'default' : 'pointer', position: 'relative' }}>
        {t.v}
        {cut ? <span style={{ position: 'absolute', left: 2, right: 2, top: '50%', height: 2, background: bad ? C.no : C.soft, transform: 'translateY(-50%) rotate(-6deg)' }} /> : null}
      </button>
    );
  };

  // BITTA BOSQICH (metodist qarori 2026-08-23): chizib tashlash va ikki
  // son maydoni BIR VAQTNING O'ZIDA ko'rinadi, biri ikkinchisini ochmaydi
  // -- xuddi Fix/Audit/YesNo da bo'lgani kabi. O'quvchi ularni istalgan
  // tartibda to'ldiradi, tekshirish esa BIR marta, hammasi birga.
  return (
    <div style={S.wrap}>
      <Head data={data} lang={lang} />
      <p style={S.ask}>{tr(data.ask, lang)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, margin: '6px 0 10px' }}>
        <div style={{ display: 'flex', gap: 4 }}>{data.numerator.map((t) => tok(t, numPick, setNumPick))}</div>
        <div style={{ width: '100%', maxWidth: 260, height: 2, background: C.ink, margin: '4px 0' }} />
        <div style={{ display: 'flex', gap: 4 }}>{data.denominator.map((t) => tok(t, denPick, setDenPick))}</div>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 160px' }}>
          <div style={S.note}>{tr(data.forbidAsk, lang)}</div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }}>{tr(data.forbidLabel, lang)}</label>
          <NumField value={forbid} onChange={setForbid} locked={A.locked} numeric lang={lang} placeholder={tr(data.forbidPlaceholder, lang)} />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <div style={S.note}>{tr(data.checkAsk, lang)}</div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.soft, marginBottom: 6 }}>{tr(data.checkLabel, lang)}</label>
          <NumField value={checkVal} onChange={setCheckVal} locked={A.locked} numeric lang={lang} placeholder={tr(data.checkPlaceholder, lang)} />
        </div>
      </div>
      {A.fb && <HFB ok={A.fb.correct} text={A.fb.correct ? tr(data.correctText, lang) : A.fb.why} />}
    </div>
  );
}
