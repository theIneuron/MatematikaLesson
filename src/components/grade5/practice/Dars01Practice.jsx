// Dars01 amaliyoti — 10 topshiriq. Mavzu: atrofimizdagi katta sonlar.
// Syujet: rasadxona (Bekzod, Madina, Nilufar, Sardor) + kundalik katta sonlar.
// Darslik §1 (o'qish / yozish / sinflar / xonalar) mashqlariga asoslangan.
// Qiyinlik: 2 oson (01, 02) · 4 o'rta (03–06) · 4 qiyin (07–10).
//
// BU FAYL — chatda ko'rish uchun yig'ma versiya. Har bir D01_xx ning kodi asl
// faylidan o'zgartirilmasdan olindi va o'z qamroviga (IIFE) o'raldi: fayllararo
// nom to'qnashuvi (T, DATA, IconOk, groupSpaces, TARGET) shu tarzda yechildi.
// Platformada ular baribir alohida fayllar bo'lib qoladi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const HIconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const HIconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <HIconOk /> : <HIconNo />}<span>{text}</span>
  </div>
);

const HIconRetry = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>);

// ---------------------------------------------------------------- D01_01
const D01_01 = (function () {
  // Dars01 · Amaliyot 01 — Katta sonni o'qish · 🟢 · Bekzod · tag: read_number
  // jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react importi.

  const DATA = { number: 30622000, correct: 0, tag: 'read_number', level: '🟢' };
  const T = {
    uz: {
      eyebrow: 'Atrofimizda', title: "Sonni o'qish",
      setup: "2015-yil boshida O'zbekiston aholisi shuncha kishiga yetdi:",
      ask: "Bu son qanday o'qiladi?",
      opts: ["o'ttiz million olti yuz yigirma ikki ming", "uch yuz million olti yuz yigirma ikki ming", "o'ttiz million olti yuz yigirma ikki"],
      correct: "To'g'ri. 30 622 000 — o'ttiz million olti yuz yigirma ikki ming.",
      wrongMsg: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
    },
    ru: {
      eyebrow: 'Вокруг нас', title: 'Чтение числа',
      setup: 'К началу 2015 года население Узбекистана достигло:',
      ask: 'Как читается это число?',
      opts: ['тридцать миллионов шестьсот двадцать две тысячи', 'триста миллионов шестьсот двадцать две тысячи', 'тридцать миллионов шестьсот двадцать два'],
      correct: 'Верно. 30 622 000 — тридцать миллионов шестьсот двадцать две тысячи.',
      wrongMsg: 'Пока неверно. Подумайте ещё раз.',
    },
  };

  const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
  const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
  const groupSpaces = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function Q(props) {
    const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
    const t = T[lang] || T.uz;
    const isReview = mode === 'review';
    const [picked, setPicked] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.idx != null) {
        setPicked(initialAnswer.studentAnswer.idx);
        if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
      }
    }, [initialAnswer]);
    useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

    const check = useCallback(() => {
      const correct = picked === DATA.correct;
      setFeedback({ correct }); setChecked(true);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
        studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: DATA.correct, label: t.opts[DATA.correct] },
        correct, meta: { tag: DATA.tag, level: DATA.level, number: DATA.number },
      });
    }, [picked, playCorrect, playWrong, onSubmit, t]);
    const checkRef = useRef(check); checkRef.current = check;
    useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

    const optStyle = (i) => {
      const active = picked === i; const show = checked && active;
      let bg = '#fff', bd = '#d6dae3', col = '#374151';
      if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
      if (show) { const ok = i === DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
      let anim;
      if (!checked) anim = `pqUp .45s cubic-bezier(.22,1,.36,1) ${(0.22 + i * 0.07).toFixed(2)}s both`;
      else if (i === DATA.correct) anim = 'pqPop .5s cubic-bezier(.34,1.56,.64,1) both';
      else if (active) anim = 'pqShake .4s both';
      else anim = 'none';
      return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', animation: anim, transition: 'background .3s, border-color .3s, color .3s' };
    };

    return (
      <div className="pq pq01">
        <style>{`
          .pq01 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
          .pq01 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
          .pq01 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 12px; color:#374151; }
          .pq01 .pq-num { text-align:center; font-size:40px; font-weight:800; color:#2563eb; letter-spacing:.04em; font-variant-numeric:tabular-nums; margin:6px 0 18px; }
          .pq01 .pq-ask { font-size:17px; font-weight:700; margin:0 0 12px; }
          .pq01 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
          .pq01 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
          .pq01 .pq-fb.no { background:#fdecec; color:#c0392b; }
          @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
          .pq01 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
          .pq01 .a2 { animation-delay:.08s; }
          .pq01 .a3 { animation-delay:.16s; }
          @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
          .pq01 .pq-num { animation:pqReveal .6s cubic-bezier(.22,1,.36,1) both; animation-delay:.1s; }
          @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
          @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
          @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
        `}</style>
        <div className="pq-eyebrow a">{t.eyebrow}</div>
        <p className="pq-setup a a2">{t.setup}</p>
        <div className="pq-num">{groupSpaces(DATA.number)}</div>
        <p className="pq-ask a a3">{t.ask}</p>
        {t.opts.map((o, i) => (
          <button key={i} type="button" style={optStyle(i)} onClick={() => { if (!isReview && !checked) setPicked(i); }} disabled={isReview || checked}>{o}</button>
        ))}
        {feedback && (
          <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
            {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrongMsg}</span>
          </div>
        )}
      </div>
    );
  }

  return Q;
})();

// ================================================================ D01_02
// Raqamning xonasi. To'g'ri javobdan keyin: variantlar pastga suriladi va
// bo'shagan joyda 5837 xona qo'shiluvchilariga bosqichma-bosqich yoyiladi.
//
// MUHIM: Row komponenti modul darajasida. Savol ichida e'lon qilinsa,
// har setState da React uni qayta mount qiladi va animatsiya boshidan ketadi.

const D02_ROWS = [
  { tail: '5837', done: '5000' },
  { tail: '837', done: '800' },
  { tail: '37', done: '30' },
  { tail: '7', done: '7' },
];
const D02_T = {
  uz: {
    eyebrow: 'Atrofimizda',
    setup: '5837 sonidagi qizil raqamga qarang:',
    ask: 'Qizil 8 raqami nechani anglatadi?',
    opts: ['8 ta yuzlik', "8 ta o'nlik", '8 ta birlik'],
    hundreds: 'yuzlar',
    correct: "To'g'ri. 5837 da 8 — yuzlar xonasida, ya'ni 8 ta yuzlik.",
    wrongMsg: "Maslahat: raqamning qiymati uning o'rniga bog'liq. O'ngdan sanang: birlik, o'nlik, yuzlik.",
  },
  ru: {
    eyebrow: 'Вокруг нас',
    setup: 'Посмотрите на красную цифру в числе 5837:',
    ask: 'Что обозначает красная цифра 8?',
    opts: ['8 сотен', '8 десятков', '8 единиц'],
    hundreds: 'сотни',
    correct: 'Верно. В 5837 цифра 8 — в разряде сотен, то есть 8 сотен.',
    wrongMsg: 'Подсказка: значение цифры зависит от её места. Считайте справа: единицы, десятки, сотни.',
  },
};

function D02_Row({ i, stage, label, showLabel }) {
  if (stage < i) return null;
  const collapsed = stage > i;
  const text = collapsed ? D02_ROWS[i].done : D02_ROWS[i].tail;
  const chars = text.split('');
  return (
    <div className={i > 0 ? 'd02-drop' : undefined} style={{ display: 'flex', alignItems: 'center', minHeight: 38 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, width: 100, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
        {chars.map((c, k) => {
          const isZero = collapsed && c === '0';
          return (
            <span key={k} className={isZero ? 'd02-zero' : undefined}
              style={{ width: 22, textAlign: 'center', color: isZero ? '#9aa1ad' : (k === 0 ? '#c0392b' : '#1f2430') }}>{c}</span>
          );
        })}
      </div>
      {/* xona nomi — faqat yuzlar qatorida, boshqa rangda */}
      <span className="d02-zero" style={{ width: 110, paddingLeft: 10, fontSize: 14.5, fontWeight: 800, color: '#7c3aed', visibility: (collapsed && label && showLabel) ? 'visible' : 'hidden' }}>
        — {label || ''}
      </span>
    </div>
  );
}

function D01_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') {
        setFb({ correct: initialAnswer.correct }); setChecked(true);
        if (initialAnswer.correct) { setOpen(true); setStage(4); }
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setOpen(true), 300));
      timers.current.push(setTimeout(() => setStage(1), 1300));
      timers.current.push(setTimeout(() => setStage(2), 2200));
      timers.current.push(setTimeout(() => setStage(3), 3100));
      timers.current.push(setTimeout(() => setStage(4), 3950)); // yoyish tugagach — xona nomi
    }
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: t.opts[0] },
      correct, meta: { tag: 'digit_place', level: '🟢' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister08(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      {!open && (
        <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 34, fontWeight: 700, letterSpacing: 3, margin: '10px 0 16px' }}>
          <span>5</span><span style={{ color: '#c0392b' }}>8</span><span>3</span><span>7</span>
        </div>
      )}

      {/* to'g'ri javobdan keyin ochiladi: variantlar pastga suriladi */}
      <div style={{ maxHeight: open ? 190 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .9s cubic-bezier(.33,1,.42,1), opacity .6s ease .15s' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 0 14px' }}>
          <div>
            {[0, 1, 2, 3].map((i) => <D02_Row key={i} i={i} stage={stage} label={i === 1 ? t.hundreds : null} showLabel={stage >= 4} />)}
          </div>
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      {t.opts.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
      ))}
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}

// ================================================================ D01_03
// Sinflarga ajratish. To'g'ri javobdan keyin 102812443 bo'shliqlarga bo'linadi
// va har sinf o'z rangini oladi — o'ngdan chapga, ketma-ket.

const D03_NUM = '102812443';
const D03_COLORS = ['#2563eb', '#7c3aed', '#0f766e']; // 102 · 812 · 443
const D03_T = {
  uz: {
    eyebrow: 'Atrofimizda',
    setup: "Sardor sonni bo'shliqsiz ko'chirib oldi:",
    ask: "Bu son sinflarga qanday to'g'ri ajratiladi?",
    opts: ['102 812 443', '1 028 124 43', '10 281 2443'],
    correct: "To'g'ri. O'ng tomondan har uch raqamdan ajratamiz: 102 812 443.",
    wrongMsg: "Maslahat: sinflar har doim o'ng tomondan sanaladi. Oxirgi raqamdan boshlab uchtadan ajrating.",
  },
  ru: {
    eyebrow: 'Вокруг нас',
    setup: 'Сардор переписал число без пробелов:',
    ask: 'Как правильно разбить число на классы?',
    opts: ['102 812 443', '1 028 124 43', '10 281 2443'],
    correct: 'Верно. Справа по три цифры: 102 812 443.',
    wrongMsg: 'Подсказка: классы всегда отсчитываются справа. Начните с последней цифры и отделяйте по три.',
  },
};

function D01_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [split, setSplit] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setSplit(!!initialAnswer.correct); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setSplit(true), 300);
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: t.opts[0] },
      correct, meta: { tag: 'class_group', level: '🟡' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister08(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 20px' }}>
        {D03_NUM.split('').map((c, i) => {
          const g = Math.floor(i / 3);                 // 0 · 1 · 2
          const delay = split ? (2 - g) * 320 : 0;     // o'ngdan chapga
          return (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 34, fontWeight: 700, lineHeight: 1,
              color: split ? D03_COLORS[g] : '#1f2430',
              marginLeft: split && i % 3 === 0 && i > 0 ? 16 : 0,
              transition: `color .45s ease ${delay}ms, margin-left .45s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }}>{c}</span>
          );
        })}
      </div>

      <p style={S.ask}>{t.ask}</p>
      {t.opts.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
      ))}
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}

// ---------------------------------------------------------------- D01_04
const D01_04 = (function () {
  // Dars01 · Amaliyot 04 — Sonlar konstruktori · 🟡 · Nilufar · tag: place_value_build
  // jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react importi.
  // Mexanika: 7 razryad-katak, +/− stepper; son jonli sinflar bo'yicha yig'iladi.

  const TARGET = 6072000; // 6 ta million, 7 ta o'n ming, 2 ta ming
  const CELLS = 7;
  const DATA = { tag: 'place_value_build', level: '🟡' };
  const T = {
    uz: {
      eyebrow: 'Atrofimizda', title: "Sonni yig'ish",
      setup: "Nilufar sonni xona birliklaridan yig'moqchi. Kataklarni +/− bilan sozlang:",
      words: "6 ta million · 7 ta o'n ming · 2 ta ming",
      live: "Yig'ilgan son:",
      correct: "To'g'ri. 6 ta million, 7 ta o'n ming, 2 ta ming — 6 072 000.",
      wrong: "Hali to'g'ri emas. Yana bir bor yig'ib ko'ring.",
    },
    ru: {
      eyebrow: 'Вокруг нас', title: 'Собери число',
      setup: 'Нилуфар собирает число из разрядных единиц. Настройте клетки кнопками +/−:',
      words: '6 миллионов · 7 десятков тысяч · 2 тысячи',
      live: 'Собранное число:',
      correct: 'Верно. 6 миллионов, 7 десятков тысяч, 2 тысячи — 6 072 000.',
      wrong: 'Пока неверно. Соберите ещё раз.',
    },
  };

  const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
  const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
  const IconUp = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>);
  const IconDown = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
  const digitsToNum = (d) => d.reduce((acc, x) => acc * 10 + x, 0);
  const groupSpaces = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function Q(props) {
    const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
    const t = T[lang] || T.uz;
    const isReview = mode === 'review';
    const [digits, setDigits] = useState(() => Array(CELLS).fill(0));
    const [feedback, setFeedback] = useState(null);
    const [checked, setChecked] = useState(false);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
      if (initialAnswer && initialAnswer.studentAnswer && Array.isArray(initialAnswer.studentAnswer.digits)) {
        setDigits(initialAnswer.studentAnswer.digits.slice(0, CELLS)); setTouched(true);
        if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
      }
    }, [initialAnswer]);
    useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

    const bump = (i, delta) => { if (isReview || checked) return; setTouched(true); setDigits((p) => { const n = p.slice(); n[i] = (n[i] + delta + 10) % 10; return n; }); };

    const check = useCallback(() => {
      const val = digitsToNum(digits);
      const correct = val === TARGET;
      setFeedback({ correct }); setChecked(true);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: t.setup + ' ' + t.words, options: [],
        studentAnswer: { digits: digits.slice(), value: val }, correctAnswer: { value: TARGET },
        correct, meta: { tag: DATA.tag, level: DATA.level },
      });
    }, [digits, playCorrect, playWrong, onSubmit, t.setup, t.words]);
    const checkRef = useRef(check); checkRef.current = check;
    useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

    const val = digitsToNum(digits);
    return (
      <div className="pq pq04">
        <style>{`
          .pq04 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
          .pq04 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
          .pq04 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 4px; color:#374151; }
          .pq04 .pq-words { font-size:19px; font-weight:800; color:#2563eb; margin:2px 0 16px; }
          .pq04 .pq-cells { display:flex; justify-content:center; gap:6px; flex-wrap:nowrap; }
          .pq04 .pq-clsgap { width:14px; }
          .pq04 .pq-cell { display:flex; flex-direction:column; align-items:center; gap:5px; }
          .pq04 .pq-step { width:44px; height:34px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:1.5px solid #d6dae3; background:#f8fafc; color:#2563eb; cursor:pointer; }
          .pq04 .pq-step:disabled { opacity:.5; cursor:default; }
          .pq04 .pq-digit { width:44px; height:52px; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:800; border-radius:12px; border:2px solid #d6dae3; background:#fff; font-variant-numeric:tabular-nums; }
          .pq04 .pq-live { text-align:center; margin:18px 0 4px; }
          .pq04 .pq-live-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
          .pq04 .pq-live-num { font-size:34px; font-weight:800; letter-spacing:.02em; font-variant-numeric:tabular-nums; }
          .pq04 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
          .pq04 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
          .pq04 .pq-fb.no { background:#fdecec; color:#c0392b; }
          @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
          .pq04 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
          .pq04 .a2 { animation-delay:.08s; }
          .pq04 .a3 { animation-delay:.16s; }
          @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
          @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.1);} 100%{transform:scale(1);} }
          .pq04 .pq-live-num.on { animation:pqPop .5s cubic-bezier(.34,1.56,.64,1); }
          @media (max-width:400px){ .pq04 .pq-cell,.pq04 .pq-step,.pq04 .pq-digit{width:38px;} .pq04 .pq-digit{font-size:26px;} }
        `}</style>
        <div className="pq-eyebrow a">{t.eyebrow}</div>
        <p className="pq-setup a a2">{t.setup}</p>
        <p className="pq-words a a3">{t.words}</p>
        <div className="pq-cells">
          {digits.map((d, i) => {
            const fromRight = CELLS - 1 - i;
            const gapBefore = i > 0 && fromRight % 3 === 2;
            return (
              <React.Fragment key={i}>
                {gapBefore && <div className="pq-clsgap" />}
                <div className="pq-cell" style={{ animation: `pqUp .4s cubic-bezier(.22,1,.36,1) ${(0.18 + i * 0.05).toFixed(2)}s both` }}>
                  <button type="button" className="pq-step" onClick={() => bump(i, +1)} disabled={isReview || checked}><IconUp /></button>
                  <div className="pq-digit">{d}</div>
                  <button type="button" className="pq-step" onClick={() => bump(i, -1)} disabled={isReview || checked}><IconDown /></button>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="pq-live">
          <div className="pq-live-lbl">{t.live}</div>
          <div className={`pq-live-num ${checked && feedback?.correct ? 'on' : ''}`} style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{groupSpaces(val)}</div>
        </div>
        {feedback && (
          <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
            {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
          </div>
        )}
      </div>
    );
  }

  return Q;
})();

// ---------------------------------------------------------------- D01_05
const D01_05 = (function () {
  // Dars01 · Amaliyot 05 — So'zdan songa · 🟡 · Bekzod · tag: words_to_number
  // Darslik §1, Mashq 11: "Sonlarni raqamlar bilan yozing" (o'n ikki million o'ttiz ming sakson besh).
  // jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react importi.

  const TARGET = 12030085; // o'n ikki million o'ttiz ming sakson besh
  const DATA = { tag: 'words_to_number', level: '🟡' };
  const T = {
    uz: {
      eyebrow: 'Atrofimizda', title: "So'zdan songa",
      setup: "Bekzod so'z bilan aytilgan sonni raqamlar bilan yozmoqchi:",
      words: "o'n ikki million o'ttiz ming sakson besh",
      label: 'Sonni yozing:',
      live: 'Sizning soningiz:',
      correct: "To'g'ri. O'n ikki million o'ttiz ming sakson besh — 12 030 085.",
      wrong: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
    },
    ru: {
      eyebrow: 'Вокруг нас', title: 'Из слов в число',
      setup: 'Бекзод хочет записать названное число цифрами:',
      words: 'двенадцать миллионов тридцать тысяч восемьдесят пять',
      label: 'Запишите число:',
      live: 'Ваше число:',
      correct: 'Верно. Двенадцать миллионов тридцать тысяч восемьдесят пять — 12 030 085.',
      wrong: 'Пока неверно. Подумайте ещё раз.',
    },
  };

  const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
  const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
  const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');
  const groupSpaces = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function Q(props) {
    const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
    const t = T[lang] || T.uz;
    const isReview = mode === 'review';
    const [val, setVal] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.value != null) {
        setVal(String(initialAnswer.studentAnswer.value));
        if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
      }
    }, [initialAnswer]);
    useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

    const check = useCallback(() => {
      const v = parseInt(cleanInt(val) || '-1', 10);
      const correct = v === TARGET;
      setFeedback({ correct }); setChecked(true);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: t.setup + ' ' + t.words, options: [],
        studentAnswer: { value: v }, correctAnswer: { value: TARGET },
        correct, meta: { tag: DATA.tag, level: DATA.level },
      });
    }, [val, playCorrect, playWrong, onSubmit, t.setup, t.words]);
    const checkRef = useRef(check); checkRef.current = check;
    useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

    const preview = cleanInt(val) ? groupSpaces(cleanInt(val)) : '—';
    return (
      <div className="pq pq05">
        <style>{`
          .pq05 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
          .pq05 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
          .pq05 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 6px; color:#374151; }
          .pq05 .pq-words { font-size:22px; font-weight:800; color:#2563eb; margin:2px 0 18px; }
          .pq05 .pq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
          .pq05 input.pq-input { width:100%; box-sizing:border-box; font-size:24px; font-weight:800; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
          .pq05 input.pq-input:focus { border-color:#5b8def; background:#fff; }
          .pq05 input.pq-input:disabled { opacity:.85; }
          .pq05 .pq-live { text-align:center; margin:12px 0 2px; }
          .pq05 .pq-live-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
          .pq05 .pq-live-num { font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; letter-spacing:.02em; }
          .pq05 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
          .pq05 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
          .pq05 .pq-fb.no { background:#fdecec; color:#c0392b; }
          @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
          .pq05 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
          .pq05 .a2 { animation-delay:.08s; }
          .pq05 .a3 { animation-delay:.16s; }
          @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
          @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
          @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
          @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
        `}</style>
        <div className="pq-eyebrow a">{t.eyebrow}</div>
        <p className="pq-setup a a2">{t.setup}</p>
        <p className="pq-words a a3">{t.words}</p>
        <label className="pq-label" htmlFor="pq05-in">{t.label}</label>
        <input id="pq05-in" className="pq-input" value={val} onChange={(e) => setVal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" disabled={isReview || checked} placeholder="0" />
        <div className="pq-live">
          <div className="pq-live-lbl">{t.live}</div>
          <div className="pq-live-num" style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{preview}</div>
        </div>
        {feedback && (
          <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
            {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
          </div>
        )}
      </div>
    );
  }

  return Q;
})();

// ---------------------------------------------------------------- D01_06
const D01_06 = (function () {
  // Dars01 · Amaliyot 06 — Xonalar munosabati · 🟡 · Nilufar · tag: magnitude_relation

  const DATA = { correct: 0, tag: 'magnitude_relation', level: '🟡' };
  const T = {
    uz: {
      eyebrow: 'Atrofimizda', title: 'Nechta ming',
      setup: 'Nilufar millionni minglarga ajratmoqchi.',
      ask: 'Bir millionda nechta ming bor?',
      opts: ['1000', '100', '10000', '100000'],
      correct: "To'g'ri. 1 000 000 = 1000 × 1000, demak millionda 1000 ta ming bor.",
      wrongMsg: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
    },
    ru: {
      eyebrow: 'Вокруг нас', title: 'Сколько тысяч',
      setup: 'Нилуфар делит миллион на тысячи.',
      ask: 'Сколько тысяч в одном миллионе?',
      opts: ['1000', '100', '10000', '100000'],
      correct: 'Верно. 1 000 000 = 1000 × 1000, значит в миллионе 1000 тысяч.',
      wrongMsg: 'Пока неверно. Подумайте ещё раз.',
    },
  };

  const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
  const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

  function Q(props) {
    const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
    const t = T[lang] || T.uz;
    const isReview = mode === 'review';
    const [picked, setPicked] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.idx != null) {
        setPicked(initialAnswer.studentAnswer.idx);
        if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
      }
    }, [initialAnswer]);
    useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

    const check = useCallback(() => {
      const correct = picked === DATA.correct;
      setFeedback({ correct }); setChecked(true);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
        studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: DATA.correct, label: t.opts[DATA.correct] },
        correct, meta: { tag: DATA.tag, level: DATA.level },
      });
    }, [picked, playCorrect, playWrong, onSubmit, t]);
    const checkRef = useRef(check); checkRef.current = check;
    useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

    const optStyle = (i) => {
      const active = picked === i; const show = checked && active;
      let bg = '#fff', bd = '#d6dae3', col = '#374151';
      if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
      if (show) { const ok = i === DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
      let anim;
      if (!checked) anim = `pqUp .45s cubic-bezier(.22,1,.36,1) ${(0.22 + i * 0.07).toFixed(2)}s both`;
      else if (i === DATA.correct) anim = 'pqPop .5s cubic-bezier(.34,1.56,.64,1) both';
      else if (active) anim = 'pqShake .4s both';
      else anim = 'none';
      return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', animation: anim, transition: 'background .3s, border-color .3s, color .3s' };
    };

    return (
      <div className="pq pq06">
        <style>{`
          .pq06 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
          .pq06 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
          .pq06 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 12px; color:#374151; }
          .pq06 .pq-ask { font-size:17px; font-weight:700; margin:0 0 12px; }
          .pq06 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
          .pq06 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
          .pq06 .pq-fb.no { background:#fdecec; color:#c0392b; }
          @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
          .pq06 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
          .pq06 .a2 { animation-delay:.08s; }
          .pq06 .a3 { animation-delay:.16s; }
          @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
          @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
          @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
          @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
        `}</style>
        <div className="pq-eyebrow a">{t.eyebrow}</div>
        <p className="pq-setup a a2">{t.setup}</p>
        <p className="pq-ask a a3">{t.ask}</p>
        {t.opts.map((o, i) => (
          <button key={i} type="button" style={optStyle(i)} onClick={() => { if (!isReview && !checked) setPicked(i); }} disabled={isReview || checked}>{o}</button>
        ))}
        {feedback && (
          <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
            {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrongMsg}</span>
          </div>
        )}
      </div>
    );
  }

  return Q;
})();

// ---------------------------------------------------------------- D01_07
const D01_07 = (function () {
  // Dars01 · Amaliyot 07 — Son topishmog'i · 🔴 · Sardor · tag: clue_number

  const DATA = { correct: 0, tag: 'clue_number', level: '🔴' };
  const T = {
    uz: {
      eyebrow: 'Topishmoq', title: "Son topishmog'i",
      setup: "Sardor yetti xonali sonni o'yladi. Faqat millionlar xonasida 2, minglar xonasida 5 bor — qolgan barcha xonalar nol.",
      ask: "Sardor qaysi sonni o'yladi?",
      opts: ['2 005 000', '2 500 000', '2 050 000', '2 005'],
      correct: "To'g'ri. Millionlar xonasida 2, minglar xonasida 5: 2 005 000.",
      wrongMsg: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
    },
    ru: {
      eyebrow: 'Загадка', title: 'Загадка числа',
      setup: 'Сардор задумал семизначное число. Только в разряде миллионов 2, в разряде тысяч 5 — все остальные разряды нули.',
      ask: 'Какое число задумал Сардор?',
      opts: ['2 005 000', '2 500 000', '2 050 000', '2 005'],
      correct: 'Верно. В разряде миллионов 2, в разряде тысяч 5: 2 005 000.',
      wrongMsg: 'Пока неверно. Подумайте ещё раз.',
    },
  };

  const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
  const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

  function Q(props) {
    const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
    const t = T[lang] || T.uz;
    const isReview = mode === 'review';
    const [picked, setPicked] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.idx != null) {
        setPicked(initialAnswer.studentAnswer.idx);
        if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
      }
    }, [initialAnswer]);
    useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

    const check = useCallback(() => {
      const correct = picked === DATA.correct;
      setFeedback({ correct }); setChecked(true);
      if (correct) playCorrect?.(); else playWrong?.();
      onSubmit?.({
        questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
        studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: DATA.correct, label: t.opts[DATA.correct] },
        correct, meta: { tag: DATA.tag, level: DATA.level },
      });
    }, [picked, playCorrect, playWrong, onSubmit, t]);
    const checkRef = useRef(check); checkRef.current = check;
    useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

    const optStyle = (i) => {
      const active = picked === i; const show = checked && active;
      let bg = '#fff', bd = '#d6dae3', col = '#374151';
      if (active) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
      if (show) { const ok = i === DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
      let anim;
      if (!checked) anim = `pqUp .45s cubic-bezier(.22,1,.36,1) ${(0.22 + i * 0.07).toFixed(2)}s both`;
      else if (i === DATA.correct) anim = 'pqPop .5s cubic-bezier(.34,1.56,.64,1) both';
      else if (active) anim = 'pqShake .4s both';
      else anim = 'none';
      return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', animation: anim, transition: 'background .3s, border-color .3s, color .3s' };
    };

    return (
      <div className="pq pq07">
        <style>{`
          .pq07 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
          .pq07 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
          .pq07 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 12px; color:#374151; }
          .pq07 .pq-ask { font-size:17px; font-weight:700; margin:0 0 12px; }
          .pq07 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
          .pq07 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
          .pq07 .pq-fb.no { background:#fdecec; color:#c0392b; }
          @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
          .pq07 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
          .pq07 .a2 { animation-delay:.08s; }
          .pq07 .a3 { animation-delay:.16s; }
          @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
          @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
          @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
          @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
        `}</style>
        <div className="pq-eyebrow a">{t.eyebrow}</div>
        <p className="pq-setup a a2">{t.setup}</p>
        <p className="pq-ask a a3">{t.ask}</p>
        {t.opts.map((o, i) => (
          <button key={i} type="button" style={optStyle(i)} onClick={() => { if (!isReview && !checked) setPicked(i); }} disabled={isReview || checked}>{o}</button>
        ))}
        {feedback && (
          <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
            {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrongMsg}</span>
          </div>
        )}
      </div>
    );
  }

  return Q;
})();

// ================================================================ D01_08
// Radiosignal — sonni so'zdan xona jadvaliga yozish. Nolli sinf tuzog'i.
// Eski versiya 3 ta variantdan tanlash edi; endi 12 ta katakni to'ldirish.

const D08_TARGET = '247108000394';
const D08_GROUPS = [
  { key: 'mlrd', from: 0 }, { key: 'mln', from: 3 }, { key: 'ming', from: 6 }, { key: 'bir', from: 9 },
];
const D01_08_T = {
  uz: {
    eyebrow: 'Rasadxona', title: 'Radiosignal',
    setup: "Rasadxona radiosignal qabul qildi. Bekzod uni quloq bilan eshitdi va daftariga yozmoqchi.",
    words: "ikki yuz qirq yetti milliard bir yuz sakkiz million uch yuz to'qson to'rt",
    ask: "Sonni xona jadvaliga yozing. Har bir sinfda uchtadan katak bor.",
    classes: { mlrd: 'MILLIARD', mln: 'MILLION', ming: 'MING', bir: 'BIRLIK' },
    correct: "To'g'ri. Minglar sinfi eshitilmadi, chunki u 000. Lekin jadvalda u bo'sh qolmaydi — nollar bilan to'ldiriladi.",
    wrongZeros: "Maslahat: qaysi sinf umuman eshitilmadi? Eshitilmagan sinf yo'q degani emas. Uning kataklariga nima yoziladi?",
    wrongOther: "Maslahat: har bir sinf o'z nomi bilan aytiladi. Sinf nomi aytilmasa, u sinfda nollar turadi.",
  },
  ru: {
    eyebrow: 'Обсерватория', title: 'Радиосигнал',
    setup: 'Обсерватория приняла радиосигнал. Бекзод услышал его и хочет записать в тетрадь.',
    words: 'двести сорок семь миллиардов сто восемь миллионов триста девяносто четыре',
    ask: 'Запишите число в разрядную таблицу. В каждом классе по три клетки.',
    classes: { mlrd: 'МИЛЛИАРД', mln: 'МИЛЛИОН', ming: 'ТЫСЯЧА', bir: 'ЕДИНИЦА' },
    correct: 'Верно. Класс тысяч не прозвучал, потому что он 000. Но в таблице он не остаётся пустым — заполняется нулями.',
    wrongZeros: 'Подсказка: какой класс вообще не прозвучал? Не прозвучал — не значит, что его нет. Что пишется в его клетках?',
    wrongOther: 'Подсказка: каждый класс называется своим именем. Если имя класса не звучит, в этом классе стоят нули.',
  },
};

function D01_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_08_T[lang] || D01_08_T.uz;
  const isReview = mode === 'review';
  const [d, setD] = useState(Array(12).fill(''));
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.digits) {
      setD(sa.digits);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  const full = d.every((x) => x !== '');
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);

  const setAt = (i, v) => {
    const c = v.replace(/[^\d]/g, '').slice(-1);
    setD((old) => { const n = old.slice(); n[i] = c; return n; });
    if (c && i < 11) refs.current[i + 1]?.focus();
  };

  const check = useCallback(() => {
    const got = d.join('');
    const correct = got === D08_TARGET;
    const zerosBad = d.slice(6, 9).join('') !== '000';
    setFb({ correct, zerosBad }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { digits: d, label: got },
      correctAnswer: { label: D08_TARGET },
      correct, meta: { tag: 'read_zero_class', level: '🔴' },
    });
  }, [d, t, playCorrect, playWrong, onSubmit]);
  useRegister08(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#cbd5e1';

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '13px 15px', borderRadius: 14, background: '#f1f5f9', border: '1.5px solid #e2e8f0', marginBottom: 16 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" style={{ flex: '0 0 auto', marginTop: 2 }}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
        <span style={{ fontSize: 15.5, lineHeight: 1.45, fontWeight: 600, color: '#374151', fontStyle: 'italic' }}>{t.words}</span>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'nowrap' }}>
        {D08_GROUPS.map((g) => (
          <div key={g.key} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.03em', marginBottom: 5 }}>{t.classes[g.key]}</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0, 1, 2].map((k) => {
                const i = g.from + k;
                return (
                  <input key={i} ref={(el) => (refs.current[i] = el)} value={d[i]} inputMode="numeric"
                    disabled={isReview || checked} onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !d[i] && i > 0) refs.current[i - 1]?.focus(); }}
                    style={{ width: 26, height: 42, textAlign: 'center', fontSize: 18, fontWeight: 800, borderRadius: 7, border: '2px solid ' + bd, background: '#fff', color: '#1f2430', fontFamily: 'inherit', padding: 0 }} />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : (fb.zerosBad ? t.wrongZeros : t.wrongOther)} />}
    </div>
  );
}
function useRegister08(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// ================================================================ D01_09
// Rasadxona kompyuteri sonni har bosishda 10 marta oshiradi.
// Ikki milliondan ikki milliardgacha — nechta bosish? Tuzoq: 200 000 000 da to'xtash.

const D09_START = 2000000, D09_TARGET = 2000000000;
const D01_09_T = {
  uz: {
    eyebrow: 'Rasadxona', title: 'Kattalashtirgich',
    setup: "Madina teleskop masshtabini boshqaradi. Har bosishda ekrandagi son 10 marta ortadi. Hozir ekranda ikki million turibdi.",
    ask: "Ekranda ikki milliard paydo bo'lguncha bosing.",
    x10: '×10', undo: 'orqaga',
    classes: ['MILLIARD', 'MILLION', 'MING', 'BIRLIK'],
    correct: "To'g'ri. Uch marta bosildi: million sinfidan milliard sinfiga o'tish uchun uchta nol qo'shiladi.",
    wrongLow: "Maslahat: sonni ovoz chiqarib o'qing. Bosh raqam qaysi sinfda turibdi — hali millionda emasmi?",
    wrongHigh: "Maslahat: milliarddan oshib ketdingiz. Orqaga qayting va har bosishdan keyin sinf nomini o'qing.",
    reading: 'Hozir:',
  },
  ru: {
    eyebrow: 'Обсерватория', title: 'Увеличитель',
    setup: 'Мадина управляет масштабом телескопа. При каждом нажатии число на экране растёт в 10 раз. Сейчас на экране два миллиона.',
    ask: 'Нажимайте, пока на экране не появится два миллиарда.',
    x10: '×10', undo: 'назад',
    classes: ['МИЛЛИАРД', 'МИЛЛИОН', 'ТЫСЯЧА', 'ЕДИНИЦА'],
    correct: 'Верно. Нажали три раза: чтобы перейти из класса миллионов в класс миллиардов, добавляются три нуля.',
    wrongLow: 'Подсказка: прочитайте число вслух. В каком классе стоит первая цифра — разве ещё не в миллионах?',
    wrongHigh: 'Подсказка: вы перешагнули миллиард. Вернитесь назад и после каждого нажатия читайте название класса.',
    reading: 'Сейчас:',
  },
};

function D01_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_09_T[lang] || D01_09_T.uz;
  const isReview = mode === 'review';
  const [p, setP] = useState(0);
  const [touched, setTouched] = useState(false);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.presses != null) {
      setP(sa.presses); setTouched(true);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);

  const value = D09_START * Math.pow(10, p);
  const locked = isReview || checked;

  const check = useCallback(() => {
    const correct = value === D09_TARGET;
    setFb({ correct, low: value < D09_TARGET }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { presses: p, value, label: String(value) },
      correctAnswer: { presses: 3, value: D09_TARGET, label: '2000000000' },
      correct, meta: { tag: 'scale_by_ten', level: '🔴' },
    });
  }, [p, value, t, playCorrect, playWrong, onSubmit]);
  useRegister08(check, registerCheck);

  // sinflar bo'yicha ajratilgan ko'rinish (o'ngdan chapga uchtadan)
  const raw = String(value);
  const pad = raw.padStart(12, ' ');
  const groups = [pad.slice(0, 3), pad.slice(3, 6), pad.slice(6, 9), pad.slice(9, 12)];

  const btn = (bg, dis) => ({ flex: 1, minHeight: 52, borderRadius: 14, border: 'none', background: dis ? '#e5e7eb' : bg, color: dis ? '#9aa1ad' : '#fff', fontSize: 17, fontWeight: 800, cursor: dis ? 'not-allowed' : 'pointer', fontFamily: 'inherit' });

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ background: '#0f172a', borderRadius: 16, padding: '16px 12px 12px', margin: '16px 0 14px' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {groups.map((g, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: g.trim() ? 1 : .28 }}>
              <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 26, fontWeight: 700, color: g.trim() ? '#7dd3fc' : '#334155', letterSpacing: 2, minWidth: 56 }}>
                {g.trim() || '···'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" disabled={locked || p === 0} onClick={() => setP(p - 1)} style={btn('#64748b', locked || p === 0)}>{t.undo}</button>
        <button type="button" disabled={locked || p >= 5} onClick={() => { setP(p + 1); setTouched(true); }} style={btn('#2563eb', locked || p >= 5)}>{t.x10}</button>
      </div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : (fb.low ? t.wrongLow : t.wrongHigh)} />}
    </div>
  );
}

// ================================================================ D01_10
// Raqam kartalaridan eng KICHIK yetti xonali sonni yasash. Nol boshida tura olmaydi.

const D10_CARDS = [{ id: 'a', d: 5 }, { id: 'b', d: 0 }, { id: 'c', d: 3 }, { id: 'e', d: 9 }, { id: 'f', d: 1 }, { id: 'g', d: 0 }, { id: 'h', d: 7 }];
const D10_TARGET = '1003579';
const D01_10_T = {
  uz: {
    eyebrow: 'Topishmoq', title: 'Eng kichik son',
    setup: "Nilufarda yettita raqamli karta bor. Ulardan yetti xonali son yasash kerak. Har bir karta bir marta ishlatiladi.",
    ask: "Eng kichik sonni yasang. Raqamli kartani bosing, keyin bo'sh katakni bosing.",
    classes: ['MILLION', 'MING', 'BIRLIK'],
    bank: 'Raqamli kartalar',
    hint: "Qo'yilgan raqamli kartani bosib qaytarib olish mumkin.",
    correct: "To'g'ri. Nol birinchi o'ringa tura olmaydi — u sonni olti xonali qilib qo'yadi. Shuning uchun oldin 1, keyin ikkala nol, keyin qolganlari o'sish tartibida.",
    wrongLeadZero: "Maslahat: birinchi katakda nol tursa, son yetti xonali bo'lib qolmaydi. Boshiga qaysi raqam kelishi kerak?",
    wrongOrder: "Maslahat: chapdagi katak eng qimmat — u millionni bildiradi. Kichik raqamlar chapga, katta raqamlar o'ngga.",
  },
  ru: {
    eyebrow: 'Загадка', title: 'Самое маленькое число',
    setup: 'У Нилуфар семь карточек с цифрами. Из них нужно составить семизначное число. Каждая карточка используется один раз.',
    ask: 'Составьте самое маленькое число. Нажмите числовую карточку, затем пустую клетку.',
    classes: ['МИЛЛИОН', 'ТЫСЯЧА', 'ЕДИНИЦА'],
    bank: 'Числовые карточки',
    hint: 'Поставленную числовую карточку можно вернуть нажатием.',
    correct: 'Верно. Ноль не может стоять первым — число станет шестизначным. Поэтому сначала 1, затем оба нуля, затем остальные по возрастанию.',
    wrongLeadZero: 'Подсказка: если в первой клетке ноль, число перестанет быть семизначным. Какая цифра должна стоять в начале?',
    wrongOrder: 'Подсказка: левая клетка самая дорогая — это миллионы. Маленькие цифры влево, большие вправо.',
  },
};

function D01_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_10_T[lang] || D01_10_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState(Array(7).fill(null)); // karta id
  const [pool, setPool] = useState(D10_CARDS.map((c) => c.id));
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const digitOf = (id) => D10_CARDS.find((c) => c.id === id).d;

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.slots) {
      setSlots(sa.slots); setPool([]);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;

  const clickSlot = (i) => () => {
    if (locked) return;
    if (picked != null) {
      const occ = slots[i];
      setSlots((s) => { const n = s.slice(); n[i] = picked; return n; });
      setPool((p) => (occ != null ? [...p.filter((x) => x !== picked), occ] : p.filter((x) => x !== picked)));
      setPicked(null);
    } else if (slots[i] != null) {
      const v = slots[i];
      setSlots((s) => { const n = s.slice(); n[i] = null; return n; });
      setPool((p) => [...p, v]);
    }
  };

  const check = useCallback(() => {
    const got = slots.map(digitOf).join('');
    const correct = got === D10_TARGET;
    setFb({ correct, leadZero: got[0] === '0' }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [],
      studentAnswer: { slots, label: got },
      correctAnswer: { label: D10_TARGET },
      correct, meta: { tag: 'build_smallest', level: '🔴' },
    });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useRegister08(check, registerCheck);

  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#cbd5e1';
  const box = { width: 34, height: 46, borderRadius: 9, border: '2px dashed ' + bd, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, cursor: locked ? 'default' : 'pointer' };
  const groups = [[0], [1, 2, 3], [4, 5, 6]];

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '10px 0 18px' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {g.map((i) => (
                <div key={i} onClick={clickSlot(i)} style={box}>
                  {slots[i] != null ? digitOf(slots[i]) : ''}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.03em', marginTop: 5 }}>{t.classes[gi]}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#9aa1ad', letterSpacing: '.04em', marginBottom: 8 }}>{t.bank.toUpperCase()}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 56, alignItems: 'center', flexWrap: 'wrap' }}>
          {pool.length === 0 && <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700 }}>—</span>}
          {pool.map((id) => (
            <button key={id} type="button" disabled={locked} onClick={() => setPicked(picked === id ? null : id)}
              style={{ width: 42, height: 54, borderRadius: 11, border: '2px solid ' + (picked === id ? '#2563eb' : '#cbd5e1'), background: picked === id ? '#eaf0fe' : '#fff', fontSize: 21, fontWeight: 800, color: '#1f2430', cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: picked === id ? '0 0 0 4px #dbeafe' : 'none' }}>
              {digitOf(id)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: '#9aa1ad', fontWeight: 600, marginTop: 8 }}>{t.hint}</div>

      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : (fb.leadZero ? t.wrongLeadZero : t.wrongOrder)} />}
    </div>
  );
}

/* ============================== MINI-HOST ============================== */

const TASKS = [
  { id: '01', label: "1 · O'qish", lvl: '🟢', C: D01_01 },
  { id: '02', label: "2 · Xona", lvl: '🟢', C: D01_02 },
  { id: '03', label: "3 · Sinflar", lvl: '🟡', C: D01_03 },
  { id: '04', label: "4 · Yig'ish", lvl: '🟡', C: D01_04 },
  { id: '05', label: "5 · So'zdan son", lvl: '🟡', C: D01_05 },
  { id: '06', label: "6 · Nechta ming", lvl: '🟡', C: D01_06 },
  { id: '07', label: "7 · Topishmoq", lvl: '🔴', C: D01_07 },
  { id: '08', label: "8 · Radiosignal", lvl: '🔴', C: D01_08 },
  { id: '09', label: "9 · Kattalashtirgich", lvl: '🔴', C: D01_09 },
  { id: '10', label: "10 · Eng kichik son", lvl: '🔴', C: D01_10 }
];

const UI = {
  uz: { check: 'Tekshirish', retry: 'Qayta urinish', correct: "To'g'ri", wrong: 'Maslahat', next: 'Keyingi', title: "Dars 1 · Ko'p xonali sonlar, xona va sinflar" },
  ru: { check: 'Проверить', retry: 'Заново', correct: 'Верно', wrong: 'Подсказка', next: 'Далее', title: 'Урок 1 · Многозначные числа, разряды и классы' },
};

function beep(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = ok ? 880 : 220; g.gain.value = 0.06;
    o.start(); o.stop(ctx.currentTime + 0.12);
  } catch (e) { /* preview-only */ }
}

export default function Dars01Practice() {
  const [lang, setLang] = useState('uz');
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [qKey, setQKey] = useState(0);
  const [done, setDone] = useState({});
  const checkFnRef = useRef(null);
  const ui = UI[lang];
  const task = TASKS[idx];

  const onReady = useCallback((v) => setReady(!!v), []);
  const registerCheck = useCallback((fn) => { checkFnRef.current = fn; }, []);
  const onSubmit = useCallback((res) => {
    setResult(res || { correct: false });
    setDone((d) => ({ ...d, [TASKS[idx].id]: !!res?.correct }));
  }, [idx]);

  const reset = useCallback(() => { setResult(null); setReady(false); checkFnRef.current = null; setQKey((k) => k + 1); }, []);
  useEffect(() => { reset(); }, [lang, idx, reset]);

  const chip = (active) => ({
    padding: '7px 13px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151', fontFamily: 'inherit', minHeight: 36,
  });
  const btn = { padding: '14px 22px', fontSize: 17, fontWeight: 700, borderRadius: 14, fontFamily: 'inherit', minHeight: 52 };

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: '#1f2430', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .tabs { display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px; border-bottom: 1px solid #eef0f4; }
        .tabs::-webkit-scrollbar { display: none; }
        .tab { flex: 0 0 auto; padding: 7px 11px; border-radius: 999px; font-size: 12.5px; font-weight: 700; white-space: nowrap; cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; min-height: 34px; }
        .tab.on { border-color: #1f2430; background: #1f2430; color: #fff; }
        .tab.ok { border-color: #1a7f43; color: #1a7f43; }
        .tab.on.ok { background: #1a7f43; border-color: #1a7f43; color: #fff; }
        .d02-drop { animation: d02drop .5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes d02drop { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
        .d02-zero { animation: d02zero .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02zero { 0% { opacity: 0; transform: scale(.4); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid #eef0f4' }}>
        <strong style={{ fontSize: 12.5, color: '#6b7280', flex: 1, lineHeight: 1.3 }}>{ui.title}</strong>
        <button type="button" style={chip(lang === 'uz')} onClick={() => setLang('uz')}>UZ</button>
        <button type="button" style={chip(lang === 'ru')} onClick={() => setLang('ru')}>RU</button>
      </div>

      <div className="tabs">
        {TASKS.map((tk, i) => (
          <button key={tk.id} type="button" className={'tab' + (i === idx ? ' on' : '') + (done[tk.id] ? ' ok' : '')} onClick={() => setIdx(i)}>{tk.lvl} {tk.id}</button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '16px 14px 24px' }}>
        <task.C
          key={qKey + '-' + lang + '-' + task.id}
          lang={lang} mode="answer" initialAnswer={null}
          onReady={onReady} registerCheck={registerCheck} onSubmit={onSubmit}
          playCorrect={() => beep(true)} playWrong={() => beep(false)}
          studentName="O'quvchi"
        />
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '12px', background: 'linear-gradient(rgba(255,255,255,0), #fff 28%)', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {result && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: result.correct ? '#1a7f43' : '#c0392b' }}>
            {result.correct ? <HIconOk /> : <HIconNo />}{result.correct ? ui.correct : ui.wrong}
          </div>
        )}
        {!result ? (
          <button type="button" disabled={!ready} onClick={() => checkFnRef.current && checkFnRef.current()}
            style={{ ...btn, minWidth: 200, border: 'none', cursor: ready ? 'pointer' : 'not-allowed', color: '#fff', background: ready ? '#2563eb' : '#c2c8d2' }}>
            {ui.check}
          </button>
        ) : (
          <>
            <button type="button" onClick={reset}
              style={{ ...btn, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #d6dae3', background: '#fff', color: '#374151', cursor: 'pointer' }}>
              <HIconRetry /> {ui.retry}
            </button>
            {idx < TASKS.length - 1 && (
              <button type="button" onClick={() => setIdx(idx + 1)}
                style={{ ...btn, fontSize: 15, border: 'none', background: '#1f2430', color: '#fff', cursor: 'pointer' }}>
                {ui.next}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
