// Dars01 · Amaliyot 10 — Zonalarga ajratish · 🔴 · tag: sort_by_sign
// Metodist qarori 2026-08-20: mexanika qoladi (bosish bilan zonaga
// joylashtirish), lekin YOZUVLAR o'zgardi. Ilgari «qiymati 20 / 24 /
// boshqa» edi -- bu 7-sinf uchun juda oson. Endi zona QIYMAT ISHORASI
// bo'yicha, yozuvlarda manfiy sonlar va oddiy kasrlar bor.
//
// Metodist qarori 2026-08-20 (ikkinchi tur): oltita emas, UCHTA yozuv --
// har zonaga bittasi. Ish hajmi kamaydi, fikr esa o'sha qoldi: uchtasini
// ham oxirigacha hisoblash kerak, aks holda joyini topib bo'lmaydi.
//
// Hisob (tekshirilgan, har zonaga bitta):
//   −1800 : 45 + 20   = −40 + 20    = −20   MANFIY
//   2/3 · 900 − 600   = 600 − 600   =   0   NOL
//   5/8 · 640 − 300   = 400 − 300   = 100   MUSBAT
//
// NEGA ISHORA. Yakuniy javobni so'ramaydi, lekin uni topmasdan javob
// berolmaysiz: ishora ikkinchi bosqichning natijasi birinchi bosqichdagi
// sondan katta yoki kichikligiga bog'liq. Ya'ni oltita yozuvni oxirigacha
// hisoblash kerak, taxmin ishlamaydi.
//
// NOL ZONASI ataylab bor: o'quvchi «manfiy yoki musbat» deb ikkiga
// bo'lishga o'rgangan, nol esa uchinchi holat va u ko'pincha e'tibordan
// chetda qoladi.
//
// BOSISH BILAN ishlaydi, tortish bilan emas: telefonda barmoq zonadan chetga
// tushadi va tortish bilan topshiriq o'tolmaydigan bo'lib qoladi (3-sinf
// kanoni §3.6). Kartani bosasiz -- tanlanadi; zonani bosasiz -- tushadi.
// Zonadagi kartani bosish uni qaytarib oladi.
//
// HAMMASI YOKI HECH NARSA: yarim to'g'ri javob butunlay noto'g'ri, xato
// joylashganlar belgilanadi (amaliyot qoidasi).
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row } from './frac.jsx';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 8px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '12px 0 10px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 14.5, lineHeight: 1.4, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const F23 = { n: 2, d: 3 };
const F58 = { n: 5, d: 8 };
// Zonalar tepadan pastga: manfiy, nol, musbat -- son o'qidagi tartib.
const ZONES = ['zneg', 'zzero', 'zpos'];
const ITEMS = [
  { id: 'i1', tokens: ['−1800', ':', '45', '+', '20'], zone: 'zneg' },
  { id: 'i2', tokens: [F23, '·', '900', '−', '600'], zone: 'zzero' },
  { id: 'i3', tokens: [F58, '·', '640', '−', '300'], zone: 'zpos' },
];
const ZERO_IDS = ['i2'];
const FRAC_IDS = ['i2', 'i3'];

const T = {
  uz: {
    eyebrow: "Zonalarga ajratish", title: "Qiymat ishorasi",
    setup: "Ekranda uchta yozuv bor. Har birini oxirigacha hisoblab, qiymat ISHORASI bo'yicha zonaga qo'ying. Har zonaga bitta yozuv tushadi.",
    ask: "Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.",
    zones: { zneg: "MANFIY", zzero: "NOL", zpos: "MUSBAT" },
    bank: "Yozuvlar",
    correct: "To'g'ri. Ishora oxirgi amalda hal bo'ladi: ikkinchi bosqichdan chiqqan son ikkinchi songa yetsa nol, yetmasa manfiy, oshsa musbat.",
    wrongZero: "Bitta yozuv aynan NOL beradi: u yerda ikkinchi bosqichdan chiqqan son ayiriladigan son bilan bir xil. Yaqin emas, aynan teng. Shuning uchun ikkovini ham hisoblang, ko'z bilan taxmin qilmang.",
    wrongFrac: "Kasrni aniq hisoblang: sonni maxrajga bo'lib, suratga ko'paytirasiz. Ikki uchdan to'qqiz yuz bu olti yuz, besh sakkizdan olti yuz qirq bu to'rt yuz.",
    wrongOther: "Ba'zi yozuvlar noto'g'ri zonada. Har birini qoidaga qarab qayta hisoblang: avval ikkinchi bosqich, keyin birinchisi. Manfiy sonni bo'lganda natija manfiy bo'ladi.",
  },
  ru: {
    eyebrow: "Разложи по зонам", title: "Знак значения",
    setup: "На экране три записи. Посчитай каждую до конца и положи в зону по ЗНАКУ значения. В каждую зону попадает одна запись.",
    ask: "Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.",
    zones: { zneg: "ОТРИЦАТЕЛЬНОЕ", zzero: "НОЛЬ", zpos: "ПОЛОЖИТЕЛЬНОЕ" },
    bank: "Записи",
    correct: "Верно. Знак решается на последнем действии: если результат второй ступени дошёл ровно до второго числа — ноль, не дошёл — минус, перешёл — плюс.",
    wrongZero: "Одна запись даёт ровно НОЛЬ: там результат второй ступени совпал с вычитаемым. Не близко, а точно совпал. Поэтому считай оба числа, а не сравнивай на глаз.",
    wrongFrac: "Посчитай дробь точно: делишь число на знаменатель и умножаешь на числитель. Две третьих от девятисот — шестьсот, пять восьмых от шестисот сорока — четыреста.",
    wrongOther: "Некоторые записи стоят не в своей зоне. Пересчитай каждую по правилу: сначала вторая ступень, потом первая. При делении отрицательного числа результат отрицательный.",
  },
  en: {
    eyebrow: "Sort into zones", title: "Sign of the value",
    setup: "There are three records on the screen. Work each one out to the end and put it in a zone by the SIGN of its value. Each zone takes one record.",
    ask: "Tap a card, then tap a zone. Tapping a card inside a zone takes it back.",
    zones: { zneg: "NEGATIVE", zzero: "ZERO", zpos: "POSITIVE" },
    bank: "Records",
    correct: "Correct. The sign is decided by the last operation: if the second-stage result reaches exactly the second number the value is zero, below it the value is negative, above it positive.",
    wrongZero: "One record gives exactly ZERO: there the second-stage result matched the number being subtracted. Not close to it — equal to it. So work both numbers out instead of comparing by eye.",
    wrongFrac: "Work the fraction out exactly: divide the number by the denominator and multiply by the numerator. Two thirds of nine hundred is six hundred, five eighths of six hundred forty is four hundred.",
    wrongOther: "Some records are in the wrong zone. Work each one out by the rule: second stage first, then the first one. Dividing a negative number gives a negative result.",
  },
};

export default function D01_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [place, setPlace] = useState({});
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  const locked = isReview || checked;
  const pool = ITEMS.filter((it) => !place[it.id]);
  const all = ITEMS.every((it) => place[it.id]);
  const wrongIds = ITEMS.filter((it) => place[it.id] && place[it.id] !== it.zone).map((it) => it.id);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.place) {
      setPlace(sa.place);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(all && !checked); }, [all, checked, onReady]);

  const tapItem = (id, e) => {
    if (e) e.stopPropagation();
    if (locked) return;
    if (place[id] && picked) { const z = place[id]; setPlace((p) => ({ ...p, [picked]: z })); setPicked(null); return; }
    if (place[id]) { setPlace((p) => { const n = { ...p }; delete n[id]; return n; }); setPicked(null); return; }
    setPicked(picked === id ? null : id);
  };
  const tapZone = (z) => {
    if (locked || !picked) return;
    setPlace((p) => ({ ...p, [picked]: z }));
    setPicked(null);
  };

  const check = useCallback(() => {
    const bad = ITEMS.filter((it) => place[it.id] !== it.zone).map((it) => it.id);
    const correct = bad.length === 0;
    // Razbor o'quvchi qaysi joyda yanglishganiga qarab tanlanadi.
    let why = 'wrongOther';
    if (bad.some((id) => ZERO_IDS.indexOf(id) !== -1)) why = 'wrongZero';
    else if (bad.some((id) => FRAC_IDS.indexOf(id) !== -1)) why = 'wrongFrac';
    setFb({ correct, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.setup, options: [],
      studentAnswer: { place: { ...place } },
      correctAnswer: { place: ITEMS.reduce((a, it) => ({ ...a, [it.id]: it.zone }), {}) },
      correct, meta: { tag: 'sort_by_sign', level: '🔴' },
    });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const chip = (it) => {
    const bad = checked && wrongIds.indexOf(it.id) !== -1;
    const good = checked && place[it.id] && !bad;
    let bd = '#cbd5e1'; let bg = '#fff';
    if (picked === it.id) { bd = '#fe5b1a'; bg = '#fff0e8'; }
    if (bad) { bd = '#c0392b'; bg = '#fdecec'; }
    if (good) { bd = '#1a7f43'; bg = '#e8f7ee'; }
    return (
      <button key={it.id} type="button" disabled={locked} data-item={it.id} onClick={(e) => tapItem(it.id, e)}
        style={{ padding: '5px 9px', borderRadius: 10, border: '2px solid ' + bd, background: bg, cursor: locked ? 'default' : 'pointer', lineHeight: 1 }}>
        <Row tokens={it.tokens} size={17} color={bad ? '#c0392b' : '#1f2430'} tone={!bad} />
      </button>
    );
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '2px 0 2px' }}>
        {ZONES.map((z) => (
          <div key={z} style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
            <div style={{ width: 104, flex: '0 0 104px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 10.5, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.03em', textAlign: 'right' }}>{t.zones[z]}</div>
            <div data-zone={z} onClick={() => tapZone(z)}
              style={{ flex: 1, minHeight: 44, borderRadius: 13, padding: 6, border: '2px dashed ' + (picked ? '#fe5b1a' : '#e2e8f0'), background: picked ? '#fff7f2' : '#f8fafc', display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'center', justifyContent: 'center', cursor: picked && !locked ? 'pointer' : 'default' }}>
              {ITEMS.filter((it) => place[it.id] === z).map(chip)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: '#9aa1ad', fontWeight: 600, margin: '6px 0 6px' }}>{t.ask}</div>
      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 5 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', minHeight: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {pool.map(chip)}
        </div>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
