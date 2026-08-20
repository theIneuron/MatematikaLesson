// Dars01 · Amaliyot 04 — Qavsni ochish · 🟡 · tag: open_bracket_signs
// Metodist qarori 2026-08-20 (ikkinchi tur): 3 va 4-topshiriqning tipi
// o'zgartirildi -- harfli ifodalar so'raldi, 4-si esa «murakkabroq
// variant» bo'lishi kerak. Ilgari bu yerda amallar navbati edi.
//
// (7m − 4) − (2m − 9). Ikkinchi qavs oldida MINUS turadi, shuning uchun
// o'sha qavs ichidagi HAMMA hadning ishorasi o'zgaradi:
//   7m − 4 − 2m + 9 = 5m + 5
// Birinchi qavs oldida minus yo'q, uning hadlari o'zgarmaydi.
//
// ENG KO'P UCHRAYDIGAN XATO: faqat birinchi hadning ishorasini o'zgartirib,
// ikkinchisini o'sha holda qoldirish (7m − 4 − 2m − 9). Shu sababli
// topshiriq javobni so'ramaydi, balki ISHORASI O'ZGARADIGAN hadlarni
// so'raydi: xato aynan shu joyda tug'iladi.
//
// HAMMASI YOKI HECH NARSA: ikki had ham belgilanishi kerak.
//
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.45, margin: '5px 0 10px', color: '#374151' },
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

// Yozuv qismlari: had -- bosiladigan, qolgani -- qotgan matn.
const PARTS = [
  { k: 'txt', v: '(' },
  { k: 'term', id: 'a1', v: '7m' },
  { k: 'term', id: 'a2', v: '− 4' },
  { k: 'txt', v: ')' },
  { k: 'minus', v: '−' },
  { k: 'txt', v: '(' },
  { k: 'term', id: 'b1', v: '2m' },
  { k: 'term', id: 'b2', v: '− 9' },
  { k: 'txt', v: ')' },
];
const WANT = ['b1', 'b2'];
const FIRST = ['a1', 'a2'];

const T = {
  uz: {
    eyebrow: "Qavsni ochish", title: "Qaysi ishora o'zgaradi",
    setup: "Yozuvda ikki qavs bor, ular orasida minus turadi. Qavslar ochilsa, ba'zi hadlarning ishorasi o'zgaradi, ba'zilari esa o'sha holda qoladi.",
    ask: "Ishorasi O'ZGARADIGAN hadlarni belgilang.",
    note: "Hadni bosib belgilanadi. Bir nechta had bo'lishi mumkin.",
    correct: "To'g'ri. Ikkinchi qavs oldida minus turadi, shuning uchun uning ichidagi hamma had ishorasini o'zgartiradi: 7m − 4 − 2m + 9, ya'ni 5m + 5.",
    wrongOnlyFirst: "Minus qavs ichidagi BITTA hadga emas, HAMMASIGA tegishli. Ikkinchi hadni ham tekshiring: minus 9 qanday bo'lib qoladi?",
    wrongFirstBracket: "Birinchi qavs oldida minus yo'q -- uning hadlari o'zgarmaydi. Minus faqat o'zidan keyin turgan qavsga ta'sir qiladi.",
    wrongOther: "Qavs oldidagi belgiga qarang: minus turgan qavsning hadlari ishorasini o'zgartiradi, plyus turgan qavsning hadlari esa o'sha holda qoladi.",
  },
  ru: {
    eyebrow: "Раскрытие скобок", title: "Где меняется знак",
    setup: "В записи две скобки, между ними стоит минус. При раскрытии у одних слагаемых знак меняется, у других остаётся тем же.",
    ask: "Отметь слагаемые, у которых знак МЕНЯЕТСЯ.",
    note: "Слагаемое отмечается нажатием. Их может быть несколько.",
    correct: "Верно. Перед второй скобкой стоит минус, поэтому все слагаемые внутри неё меняют знак: 7m − 4 − 2m + 9, то есть 5m + 5.",
    wrongOnlyFirst: "Минус относится не к ОДНОМУ слагаемому в скобке, а ко ВСЕМ. Проверь второе: во что превращается минус 9?",
    wrongFirstBracket: "Перед первой скобкой минуса нет — её слагаемые не меняются. Минус действует только на ту скобку, которая стоит после него.",
    wrongOther: "Смотри на знак перед скобкой: у скобки с минусом слагаемые меняют знак, у скобки с плюсом остаются теми же.",
  },
  en: {
    eyebrow: "Opening brackets", title: "Where the sign changes",
    setup: "The record has two brackets with a minus between them. When they are opened, some terms change sign and others stay as they are.",
    ask: "Mark the terms whose sign CHANGES.",
    note: "Tap a term to mark it. There can be several.",
    correct: "Correct. A minus stands before the second bracket, so every term inside it changes sign: 7m − 4 − 2m + 9, that is 5m + 5.",
    wrongOnlyFirst: "The minus applies not to ONE term in the bracket but to ALL of them. Check the second one: what does minus 9 become?",
    wrongFirstBracket: "There is no minus before the first bracket — its terms do not change. A minus acts only on the bracket that follows it.",
    wrongOther: "Look at the sign in front of the bracket: terms of a bracket with a minus change sign, terms of a bracket with a plus stay as they are.",
  },
};

export default function D01_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [marked, setMarked] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  const locked = isReview || checked;

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.marked) {
      setMarked(sa.marked);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(marked.length > 0 && !checked); }, [marked, checked, onReady]);

  const toggle = (id) => {
    if (locked) return;
    setMarked((m) => (m.indexOf(id) === -1 ? m.concat(id) : m.filter((x) => x !== id)));
  };

  const check = useCallback(() => {
    const extra = marked.filter((id) => WANT.indexOf(id) === -1);
    const miss = WANT.filter((id) => marked.indexOf(id) === -1);
    const correct = extra.length === 0 && miss.length === 0;
    let why = 'wrongOther';
    if (extra.some((id) => FIRST.indexOf(id) !== -1)) why = 'wrongFirstBracket';
    else if (miss.length === 1 && extra.length === 0) why = 'wrongOnlyFirst';
    setFb({ correct, why }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: PARTS.filter((p) => p.k === 'term').map((p) => ({ id: p.id, label: p.v })),
      studentAnswer: { marked: marked.slice() },
      correctAnswer: { marked: WANT },
      correct, meta: { tag: 'open_bracket_signs', level: '🟡' },
    });
  }, [marked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 800 };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ fontSize: 13, color: '#9aa1ad', fontWeight: 600, marginBottom: 10 }}>{t.note}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 2, margin: '6px 0 4px' }}>
        {PARTS.map((p, i) => {
          if (p.k === 'txt') return <span key={i} style={{ ...MONO, fontSize: 30, color: '#0f766e', padding: '0 3px' }}>{p.v}</span>;
          if (p.k === 'minus') return <span key={i} style={{ ...MONO, fontSize: 34, color: '#7A4FA3', padding: '2px 12px', margin: '0 4px', borderRadius: 9, background: '#f3eefa' }}>{p.v}</span>;
          const on = marked.indexOf(p.id) !== -1;
          let bd = '#cbd5e1'; let bg = '#f8fafc'; let col = '#1f2430'; let dash = 'dashed';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; dash = 'solid'; }
          if (checked) {
            const right = on === (WANT.indexOf(p.id) !== -1);
            dash = 'solid';
            if (on || WANT.indexOf(p.id) !== -1) {
              bd = right ? '#1a7f43' : '#c0392b';
              bg = right ? '#e8f7ee' : '#fdecec';
              col = right ? '#1a7f43' : '#c0392b';
            } else { bd = '#e2e8f0'; bg = '#fff'; }
          }
          return (
            <button key={i} type="button" aria-pressed={on} data-term={p.id} disabled={locked} onClick={() => toggle(p.id)}
              style={{ ...MONO, fontSize: 30, color: col, padding: '6px 10px', margin: '0 1px', borderRadius: 10, border: '2px ' + dash + ' ' + bd, background: bg, cursor: locked ? 'default' : 'pointer' }}>
              {p.v}
            </button>
          );
        })}
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t[fb.why]} />}
    </div>
  );
}
