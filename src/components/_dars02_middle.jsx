
// ============================================================
// SCREEN-КОМПОНЕНТЫ (nat_5_02 — keep-visible rebuild, Dars28 infra, 14 ekran)
// ============================================================
const LESSON_META = {
  lessonId: 'nat-5-02-v2',
  lessonTitle: { ru: 'Сравнение и округление больших чисел', uz: "Katta sonlarni taqqoslash va yaxlitlash" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        scored: false, scope: 'hook' },      // 0
  { id: 's1',  type: 'exploration', scored: false, scope: null },        // 1  разрядная таблица
  { id: 's2',  type: 'rule',        scored: false, scope: null },        // 2  правило сравнения
  { id: 's3',  type: 'test',        scored: true,  scope: 'practice' },   // 3  сравнение разной длины
  { id: 's4',  type: 'test',        scored: true,  scope: 'practice' },   // 4  сравнение равной длины
  { id: 's5',  type: 'exploration', scored: false, scope: null },        // 5  slider-ось
  { id: 's6',  type: 'rule',        scored: false, scope: null },        // 6  правило округления
  { id: 's7',  type: 'exploration', scored: false, scope: null },        // 7  округление по разрядам (tap)
  { id: 's8',  type: 'test',        scored: true,  scope: 'practice' },   // 8  SEQ округление (3 misol)
  { id: 's9',  type: 'case',        scored: false, scope: null },        // 9  case setup (планеты)
  { id: 's10', type: 'test',        scored: true,  scope: 'practice' },   // 10 SEQ случай+итог (4 misol)
  { id: 's11', type: 'test',        scored: true,  scope: 'practice' },   // 11 SEQ qiyin yaxlitlash 1 (3 misol)
  { id: 's12', type: 'test',        scored: true,  scope: 'final' },      // 12 SEQ qiyin yaxlitlash 2 (3 misol)
  { id: 's13', type: 'summary',     scored: false, scope: null }         // 13 итог
];
const TOTAL_SCREENS = SCREEN_META.length;

// ── Bloklar uchun o'ram matni (sarlavha/lead/yakun) ──
const W_ROUND = {
  eyebrow: { ru: 'Тренировка · округление', uz: 'Mashq · yaxlitlash' },
  title: { ru: 'Округли числа по очереди', uz: 'Sonlarni navbat bilan yaxlitlang' },
  lead: { ru: 'Реши три примера один за другим. Где написано — введи ответ сам.', uz: "Uch misolni birin-ketin yech. Yozish kerak bo'lsa, javobni o'zing kirit." },
  done_text: { ru: 'Все три числа округлены верно. Разряд решает, куда округлять.', uz: "Uchala son to'g'ri yaxlitlandi. Qaysi tomonga yaxlitlashni xona hal qiladi." }
};
const W_MIX = {
  eyebrow: { ru: 'Случай и итог', uz: 'Holat va yakun' },
  title: { ru: 'Расставь планеты и проверь себя', uz: "Sayyoralarni tartibla va o'zingni tekshir" },
  lead: { ru: 'Четыре задания подряд: округление, порядок и сравнение.', uz: "To'rt topshiriq ketma-ket: yaxlitlash, tartib va taqqoslash." },
  done_text: { ru: 'Готово. Ты округлил, расставил по размеру и сравнил близкие числа.', uz: "Tayyor. Yaxlitlading, o'lchami bo'yicha tartiblading va yaqin sonlarni taqqoslading." }
};
const W_HARD1 = {
  eyebrow: { ru: 'Сложные примеры · 1', uz: 'Qiyin misollar · 1' },
  title: { ru: 'Округление с переносом', uz: "Ko'tarish bilan yaxlitlash" },
  lead: { ru: 'Здесь округление поднимает соседний разряд. Реши по очереди.', uz: "Bu yerda yaxlitlash qo'shni xonani ko'taradi. Navbat bilan yech." },
  done_text: { ru: 'Отлично. Когда цифра 5 или больше, перенос может дойти до старшего класса.', uz: "Zo'r. Raqam 5 yoki katta bo'lsa, ko'tarish katta sinfgacha yetishi mumkin." }
};
const W_HARD2 = {
  eyebrow: { ru: 'Сложные примеры · 2', uz: 'Qiyin misollar · 2' },
  title: { ru: 'Середина и цепной перенос', uz: "O'rta holat va zanjirli ko'tarish" },
  lead: { ru: 'Серединное число округляем вверх, а перенос идёт цепочкой. Реши все три.', uz: "O'rtadagi sonni yuqoriga yaxlitlaymiz, ko'tarish esa zanjir bo'lib boradi. Uchalasini yech." },
  done_text: { ru: 'Ты справился со сложными случаями округления — переносом и серединой.', uz: "Yaxlitlashning qiyin holatlarini — ko'tarish va o'rtani — uddalading." }
};

// ── Yangi qiyin misollar (draft, RU+UZ, TTS-toza) ──
const HARD1_ITEMS = [
  { type: 'mc', correct: 1, optKeys: ['opt0', 'opt1', 'opt2'], order: [1, 0, 2], c: {
    question: { ru: 'Округли 2 999 500 до тысяч.', uz: "2 999 500 ni minglar xonasigacha yaxlitlang." },
    opt0: { ru: '2 999 000', uz: '2 999 000' }, opt1: { ru: '3 000 000', uz: '3 000 000' }, opt2: { ru: '2 990 000', uz: '2 990 000' },
    hint_0: { ru: 'В разряде сотен 5, округляем вверх, а перенос идёт дальше.', uz: "Yuzlar xonasida 5, yuqoriga yaxlitlaymiz, ko'tarish davom etadi." },
    hint_2: { ru: 'Смотри на сотни, а не на десятки тысяч.', uz: "O'n minglarga emas, yuzlarga qara." },
    audio: { intro: { ru: 'Округли два миллиона девятьсот девяносто девять тысяч пятьсот до тысяч.', uz: "Ikki million to'qqiz yuz to'qson to'qqiz ming besh yuzni minglar xonasigacha yaxlitlang." },
      on_correct: { ru: 'Верно. В сотнях пять, округляем вверх, перенос проходит через все девятки и даёт три миллиона.', uz: "To'g'ri. Yuzlarda besh, yuqoriga yaxlitlaymiz, ko'tarish hamma to'qqizlardan o'tib uch million beradi." },
      on_wrong: { ru: 'Посмотри на разряд сотен.', uz: "Yuzlar xonasiga qara." } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [2, 0, 1], c: {
    question: { ru: 'Округли 149 600 000 до миллионов.', uz: "149 600 000 ni millionlar xonasigacha yaxlitlang." },
    opt0: { ru: '150 000 000', uz: '150 000 000' }, opt1: { ru: '149 000 000', uz: '149 000 000' }, opt2: { ru: '140 000 000', uz: '140 000 000' },
    hint_1: { ru: 'Смотри на разряд сотен тысяч: там 6, это вверх.', uz: "Yuz minglar xonasiga qara: u yerda 6, bu yuqoriga." },
    hint_2: { ru: 'Это округление до десятков миллионов. А нужно до миллионов.', uz: "Bu o'n millionlargacha yaxlitlash. Kerak esa millionlargacha." },
    audio: { intro: { ru: 'Округли сто сорок девять миллионов шестьсот тысяч до миллионов.', uz: "Bir yuz qirq to'qqiz million olti yuz mingni millionlar xonasigacha yaxlitlang." },
      on_correct: { ru: 'Верно. В разряде сотен тысяч шесть, это больше пяти, округляем вверх до ста пятидесяти миллионов.', uz: "To'g'ri. Yuz minglar xonasida olti, bu beshdan katta, bir yuz ellik milliongacha yuqoriga yaxlitlaymiz." },
      on_wrong: { ru: 'Найди разряд после миллионов.', uz: "Millionlardan keyingi xonani top." } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [1, 2, 0], c: {
    question: { ru: 'Округли 45 678 до тысяч.', uz: "45 678 ni minglar xonasigacha yaxlitlang." },
    opt0: { ru: '46 000', uz: '46 000' }, opt1: { ru: '45 000', uz: '45 000' }, opt2: { ru: '45 700', uz: '45 700' },
    hint_1: { ru: 'В сотнях 6, это больше пяти, значит вверх.', uz: "Yuzlarda 6, bu beshdan katta, demak yuqoriga." },
    hint_2: { ru: 'Это округление до сотен, а нужно до тысяч.', uz: "Bu yuzlargacha yaxlitlash, kerak esa minglargacha." },
    audio: { intro: { ru: 'Округли сорок пять тысяч шестьсот семьдесят восемь до тысяч.', uz: "Qirq besh ming olti yuz yetmish sakkizni minglar xonasigacha yaxlitlang." },
      on_correct: { ru: 'Верно. В сотнях шесть, округляем вверх до сорока шести тысяч.', uz: "To'g'ri. Yuzlarda olti, qirq olti minggacha yuqoriga yaxlitlaymiz." },
      on_wrong: { ru: 'Посмотри на сотни.', uz: "Yuzlarga qara." } } } }
];
const HARD2_ITEMS = [
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [2, 1, 0], c: {
    question: { ru: 'Округли 8 500 до тысяч.', uz: "8 500 ni minglar xonasigacha yaxlitlang." },
    opt0: { ru: '9 000', uz: '9 000' }, opt1: { ru: '8 000', uz: '8 000' }, opt2: { ru: '8 500', uz: '8 500' },
    hint_1: { ru: 'Это ровно середина. Серединное число округляют вверх.', uz: "Bu aynan o'rta. O'rtadagi son yuqoriga yaxlitlanadi." },
    hint_2: { ru: 'Округление убирает младшие разряды, они становятся нулями.', uz: "Yaxlitlash kichik xonalarni olib tashlaydi, ular nolga aylanadi." },
    audio: { intro: { ru: 'Округли восемь тысяч пятьсот до тысяч.', uz: "Sakkiz ming besh yuzni minglar xonasigacha yaxlitlang." },
      on_correct: { ru: 'Верно. Это ровно посередине, серединное округляем вверх, до девяти тысяч.', uz: "To'g'ri. Bu aynan o'rtada, o'rtadagini yuqoriga, to'qqiz minggacha yaxlitlaymiz." },
      on_wrong: { ru: 'Вспомни правило про середину.', uz: "O'rta haqidagi qoidani esla." } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [1, 0, 2], c: {
    question: { ru: 'Округли 199 950 до сотен.', uz: "199 950 ni yuzlar xonasigacha yaxlitlang." },
    opt0: { ru: '200 000', uz: '200 000' }, opt1: { ru: '199 900', uz: '199 900' }, opt2: { ru: '199 000', uz: '199 000' },
    hint_1: { ru: 'В десятках 5, это вверх. Перенос пройдёт цепочкой через девятки.', uz: "O'nlarda 5, yuqoriga. Ko'tarish to'qqizlar orqali zanjir bo'lib o'tadi." },
    hint_2: { ru: 'Это округление до тысяч, а нужно до сотен.', uz: "Bu minglargacha yaxlitlash, kerak esa yuzlargacha." },
    audio: { intro: { ru: 'Округли сто девяносто девять тысяч девятьсот пятьдесят до сотен.', uz: "Bir yuz to'qson to'qqiz ming to'qqiz yuz ellikni yuzlar xonasigacha yaxlitlang." },
      on_correct: { ru: 'Верно. В десятках пять, округляем вверх, и цепной перенос даёт двести тысяч.', uz: "To'g'ri. O'nlarda besh, yuqoriga yaxlitlaymiz, zanjirli ko'tarish ikki yuz ming beradi." },
      on_wrong: { ru: 'Посмотри на разряд десятков.', uz: "O'nlar xonasiga qara." } } } },
  { type: 'mc', correct: 0, optKeys: ['opt0', 'opt1', 'opt2'], order: [2, 0, 1], c: {
    question: { ru: 'Округли 6 449 до сотен.', uz: "6 449 ni yuzlar xonasigacha yaxlitlang." },
    opt0: { ru: '6 400', uz: '6 400' }, opt1: { ru: '6 500', uz: '6 500' }, opt2: { ru: '6 000', uz: '6 000' },
    hint_1: { ru: 'Смотри на десятки: там 4, это меньше пяти, значит вниз.', uz: "O'nlarga qara: u yerda 4, bu beshdan kichik, demak pastga." },
    hint_2: { ru: 'Это округление до тысяч, а нужно до сотен.', uz: "Bu minglargacha yaxlitlash, kerak esa yuzlargacha." },
    audio: { intro: { ru: 'Округли шесть тысяч четыреста сорок девять до сотен.', uz: "Olti ming to'rt yuz qirq to'qqizni yuzlar xonasigacha yaxlitlang." },
      on_correct: { ru: 'Верно. В десятках четыре, это меньше пяти, округляем вниз до шести тысяч четырёхсот.', uz: "To'g'ri. O'nlarda to'rt, bu beshdan kichik, olti ming to'rt yuzgacha pastga yaxlitlaymiz." },
      on_wrong: { ru: 'Посмотри на десятки.', uz: "O'nlarga qara." } } } }
];

// ============================================================
const shuffleMC = (c, options, correctIdx, order) => {
  const content = { ...c };
  order.forEach((oldI, newI) => { content[`wrong_${newI}`] = c[`wrong_${oldI}`]; content[`hint_${newI}`] = c[`hint_${oldI}`]; content[`audio_hint_${newI}`] = c[`audio_hint_${oldI}`]; });
  return { options: order.map(i => options[i]), correctIdx: order.indexOf(correctIdx), content };
};
const Title = ({ node }) => { const t = useT(); return <h2 className="title h-title fade-up" style={{ margin: 0 }}>{mt(t(node))}</h2>; };
const Floaters = () => (<div className="amb" aria-hidden="true"><span className="amb-o amb-o1"/><span className="amb-o amb-o2"/><span className="amb-o amb-o3"/></div>);
const HintBlock = ({ show, children }) => {
  const lang = useLang();
  if (!show) return null;
  return (
    <div className="frame-tip fade-up" style={{ padding: 'clamp(12px, 2vw, 16px)' }}>
      <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✗</span>{lang === 'uz' ? 'Maslahat' : 'Подсказка'}</p>
      <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
    </div>
  );
};
// Taqqoslanayotgan sonlar — katta, markazda, urg'uli (slayd 3 aksenti).
const CompareFigure = ({ a, b }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(14px, 5vw, 40px)', flexWrap: 'wrap' }}>
    <span className="display" style={{ fontSize: 'clamp(28px, 7vw, 48px)', color: T.ink, letterSpacing: '0.02em' }}>{a}</span>
    <span className="mono" style={{ fontSize: 'clamp(22px, 4.5vw, 32px)', color: T.accent, fontWeight: 700 }}>?</span>
    <span className="display" style={{ fontSize: 'clamp(28px, 7vw, 48px)', color: T.ink, letterSpacing: '0.02em' }}>{b}</span>
  </div>
);

// MC ekran (keep-visible infra QuestionScreen + shuffleMC), ixtiyoriy figura.
const mcOf = (props, c, optKeys, correctIndex, order, figure) => {
  const t = props.t;
  const base = optKeys.map(k => t(c[k]));
  const { options, correctIdx, content } = shuffleMC(c, base, correctIndex, order);
  const question = (<><p className="eyebrow" style={{ color: T.accent }}>{t(c.label)}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{mt(t(c.question))}</h2></>);
  return <QuestionScreen {...props} idx={props.screen} totalScreens={TOTAL_SCREENS} screenMeta={SCREEN_META[props.screen]} screenContent={content} question={question} options={options} correctIdx={correctIdx} figure={figure}/>;
};

// ============================================================
// SeqSolve — ketma-ket misollar bitta ekranda (tap MC + o'zi yozish aralash).
// Веди-до-верного, javob berilgani ✓ qatorga buklanadi, mobil-do'st, scrollsiz.
// ============================================================
const SeqSolve = ({ screen, totalScreens, screenContent, items, scope, storedAnswer, onAnswer, onNext, onPrev }) => {
  const w = screenContent; const t = useT(); const lang = useLang();
  const n = items.length;
  const wasSolved = storedAnswer?.solved === true;
  const audio = useAudio([{ id: `s${screen}_i0`, text: items[0].c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [idx, setIdx] = useState(wasSolved ? n : 0);
  const [results, setResults] = useState(() => (wasSolved ? items.map(() => true) : []));
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [picked, setPicked] = useState(null);
  const [value, setValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [lastWrong, setLastWrong] = useState(null);
  const wrongRef = useRef(false);
  const advancedRef = useRef(wasSolved);
  const done = idx >= n;
  const cur = done ? null : items[idx];
  const sh = (cur && cur.type === 'mc') ? shuffleMC(cur.c, cur.optKeys.map(k => t(cur.c[k])), cur.correct, cur.order || cur.optKeys.map((_, i) => i)) : null;
  const speak = (txt) => { if (txt && !audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };

  const advance = (firstTry) => {
    const nr = [...results]; nr[idx] = firstTry;
    const ni = idx + 1;
    setResults(nr); setWrongSet(new Set()); setPicked(null); setValue(''); setShowHint(false); setLastWrong(null); wrongRef.current = false;
    setIdx(ni);
    if (ni >= n) {
      const allOk = nr.every(Boolean);
      onAnswer({ stage: scope, screenIdx: screen, correctAnswer: 'seq', studentAnswer: JSON.stringify(nr), correct: allOk, firstTry: allOk, solved: true });
      speak(w.done_text[lang]);
    } else {
      speak(items[ni].c.audio.intro[lang]);
    }
  };

  const pickMC = (i) => {
    if (done || wrongSet.has(i) || picked !== null) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    if (i === sh.correctIdx) {
      setPicked(i);
      speak(cur.c.audio.on_correct && cur.c.audio.on_correct[lang]);
      const ft = !wrongRef.current;
      setTimeout(() => advance(ft), 700);
    } else {
      wrongRef.current = true;
      setWrongSet(prev => { const s = new Set(prev); s.add(i); return s; });
      setLastWrong(i);
      setShowHint(true);
      speak((sh.content[`hint_${i}`] && sh.content[`hint_${i}`][lang]) || (cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]));
    }
  };
  const submitInput = () => {
    if (done) return;
    const v = String(value).replace(/[^0-9]/g, ''); if (!v) return;
    if (!advancedRef.current) { advancedRef.current = true; audio.triggerEvent('option_picked'); }
    const ok = parseInt(v, 10) === parseInt(String(cur.answer).replace(/\s/g, ''), 10);
    if (ok) {
      setPicked(0);
      speak(cur.c.audio.on_correct && cur.c.audio.on_correct[lang]);
      const ft = !wrongRef.current;
      setTimeout(() => advance(ft), 700);
    } else {
      wrongRef.current = true; setShowHint(true);
      speak((cur.c.hint && cur.c.hint[lang]) || (cur.c.audio.on_wrong && cur.c.audio.on_wrong[lang]));
    }
  };

  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!done} onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={w.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
        <div className="fade-up">
          <h2 className="title h-title" style={{ margin: 0 }}>{t(w.title)}</h2>
          {!done && <p className="small" style={{ marginTop: 6, color: T.ink3 }}>{t(w.lead)}</p>}
        </div>
        {/* progress nuqtalar */}
        <div className="fade-up" style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {items.map((_, k) => (<span key={k} style={{ width: 9, height: 9, borderRadius: '50%', background: k < idx ? T.success : (k === idx ? T.accent : `${T.ink3}55`), transition: 'background 0.3s' }}/>))}
          <span className="small mono" style={{ marginLeft: 6, color: T.ink3 }}>{Math.min(idx + (done ? 0 : 1), n)} / {n}</span>
        </div>
        {/* javob berilgan misollar — ixcham yashil qator */}
        {results.length > 0 && results.slice(0, idx).map((ft, k) => (
          <div key={k} className="frame-success fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'clamp(9px, 1.6vw, 12px) clamp(12px, 2vw, 16px)' }}>
            <span className="mono small" style={{ color: T.success, fontWeight: 700 }} aria-hidden="true">✓</span>
            <span className="small" style={{ color: T.ink2 }}>{(lang === 'uz' ? 'Misol ' : 'Пример ') + (k + 1) + (lang === 'uz' ? " — to'g'ri" : ' — верно')}</span>
          </div>
        ))}
        {/* joriy misol */}
        {cur && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }} key={idx}>
            <h3 className="title h-sub" style={{ margin: 0 }}>{mt(t(cur.c.question))}</h3>
            {cur.type === 'mc' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {sh.options.map((opt, i) => {
                  const isWrong = wrongSet.has(i);
                  const isC = picked !== null && i === sh.correctIdx;
                  let cls = 'option'; if (isC) cls += ' option-correct'; else if (isWrong) cls += ' option-picked-wrong';
                  return (
                    <button key={i} className={cls} disabled={picked !== null || isWrong} onClick={() => pickMC(i)} style={{ padding: 'clamp(12px, 1.7vw, 14px) clamp(12px, 2vw, 16px)', minHeight: 'clamp(50px, 7vw, 60px)', fontSize: 'clamp(14px, 1.8vw, 16px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="mono small" style={{ minWidth: 18, color: isC ? T.success : (isWrong ? T.accent : T.ink3) }}>{isC ? '✓' : (isWrong ? '✗' : String.fromCharCode(65 + i))}</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {cur.type === 'input' && (
              <>
                <div className="frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 16px)', flexWrap: 'wrap' }}>
                  <span className="display" style={{ fontSize: 'clamp(24px, 5vw, 36px)' }}>{cur.base}</span>
                  <Op size="mid">{'≈'}</Op>
                  <input type="text" inputMode="numeric" className={`answer-input ${picked !== null ? 'correct' : (showHint ? 'wrong' : '')}`} value={value} placeholder={lang === 'uz' ? '0' : '0'} onChange={e => { if (picked === null) { setValue(e.target.value); setShowHint(false); } }} disabled={picked !== null} onKeyDown={e => e.key === 'Enter' && submitInput()} style={{ width: 'clamp(110px, 26vw, 150px)' }}/>
                </div>
                {picked === null && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-white-accent" disabled={!value} onClick={submitInput} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(20px, 2.5vw, 27px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? 'Tekshirish' : 'Проверить'}</button>
                  </div>
                )}
              </>
            )}
            <HintBlock show={showHint && picked === null}>{t(cur.type === 'mc' ? ((lastWrong !== null && sh.content[`hint_${lastWrong}`]) || cur.c.audio.on_wrong) : (cur.c.hint || cur.c.audio.on_wrong))}</HintBlock>
          </div>
        )}
        {/* blok yakuni */}
        {done && (
          <FeedbackBlock show={true} isCorrect={true}>
            <p className="small mono" style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}><span aria-hidden="true">✓</span>{lang === 'uz' ? 'Tayyor' : 'Готово'}</p>
            <p className="body" style={{ margin: 0 }}>{t(w.done_text)}</p>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// ЭКРАНЫ
// ============================================================
const Screen0 = ({ screen, totalScreens, onAnswer, onNext }) => {
  const c = CONTENT.s0; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's0_intro', text: c.audio.intro[lang], trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const startedRef = useRef(false);
  useEffect(() => {
    if (audio.muted) { setShowOptions(true); return; }
    if (audio.isPlaying) startedRef.current = true;
    if (startedRef.current && !audio.isPlaying) setShowOptions(true);
  }, [audio.isPlaying, audio.muted]);
  useEffect(() => {
    const words = (c.audio.intro[lang] || '').trim().split(/\s+/).filter(Boolean).length;
    const ms = Math.max(4000, Math.min(Math.round(words / 2.3 * 1000) + 1500, 16000));
    const tmr = setTimeout(() => setShowOptions(true), ms);
    return () => clearTimeout(tmr);
  }, [lang]);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer({ stage: 'hook', screenIdx: screen, studentAnswer: v, correct: true }); audio.triggerEvent('option_picked'); setTimeout(onNext, 300); };
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <Floaters/>
        <p className="eyebrow fade-up" style={{ position: 'relative', color: T.accent }}>{t(c.eyebrow)}</p>
        <h1 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.global_q)}</h1>
        <p className="body fade-up delay-1" style={{ position: 'relative', color: T.ink2, margin: 0, maxHeight: showOptions ? 0 : 200, opacity: showOptions ? 0 : 1, marginBottom: showOptions ? 'calc(-1 * clamp(14px, 2.4vw, 20px))' : 0, overflow: 'hidden', transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1), max-height 0.6s cubic-bezier(0.4,0,0.2,1), margin-bottom 0.6s cubic-bezier(0.4,0,0.2,1)' }}>{t(c.claim_lead)} <span className="italic" style={{ color: T.accent }}>{t(c.claim_em)}</span></p>
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(24px, 8vw, 64px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="planet pulse" style={{ width: 'clamp(44px, 11vw, 64px)', height: 'clamp(44px, 11vw, 64px)', background: 'linear-gradient(135deg, #C75B39, #8f3a20)' }}/>
            <span className="mono small" style={{ color: T.ink2 }}>{t(c.planet_mars)}</span>
            <span className="display" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: T.accent }}>6 779</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="planet pulse pulse-slow" style={{ width: 'clamp(74px, 18vw, 104px)', height: 'clamp(74px, 18vw, 104px)', background: 'linear-gradient(135deg, #2E7DBE, #1F9A6B)' }}/>
            <span className="mono small" style={{ color: T.ink2 }}>{t(c.planet_earth)}</span>
            <span className="display" style={{ fontSize: 'clamp(18px, 3vw, 24px)' }}>12 742</span>
          </div>
        </div>
        <h2 className="title h-sub fade-up delay-3" style={{ position: 'relative', margin: 0 }}>{t(c.question)}</h2>
        {showOptions && (
          <div className="fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ id: 'yes', label: c.opt_yes }, { id: 'no', label: c.opt_no }, { id: 'idk', label: c.opt_idk }].map(o => (
              <button key={o.id} className="option" disabled={picked !== null} onClick={() => pick(o.id)} style={{ padding: 'clamp(14px, 2vw, 15px) clamp(16px, 2.5vw, 20px)', fontSize: 'clamp(15px, 1.9vw, 15px)' }}>{t(o.label)}</button>
            ))}
          </div>
        )}
      </div>
    </Stage>
  );
};

const Screen1 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s1; const t = useT(); const lang = useLang();
  const lines = c.audio[lang]; const last = lines.length - 1;
  const audio = useAudio([{ id: 's1_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const [step, setStep] = useState(0);
  const speak = (txt) => { if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const handleStep = () => { if (step < last) { const ns = step + 1; setStep(ns); speak(lines[ns]); } else { onNext(); } };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={step < last ? t(c.btn_step) : <NextLabel/>} onClick={handleStep}/></>);
  const cellBase = { width: 'clamp(36px, 7.5vw, 52px)', height: 'clamp(42px, 8.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 4vw, 28px)', borderRadius: 10, background: T.paper, boxShadow: `0 3px 9px -4px rgba(${T.shadowBase}, 0.16)` };
  const ghost = { ...cellBase, background: 'transparent', boxShadow: 'none' };
  const renderRow = (digits, hiFirst) => (
    <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)' }}>
      {digits.map((dg, i) => {
        if (dg === '') return <div key={i} style={ghost}/>;
        const hi = hiFirst && i === 0;
        return <div key={i} className="cell-anim" style={{ ...cellBase, animationDelay: `${(digits.length - 1 - i) * 0.08}s`, background: hi ? T.accentSoft : T.paper, color: hi ? T.accent : T.ink, fontWeight: hi ? 700 : 400 }}>{dg}</div>;
      })}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="fade-up delay-2">
          <p className="mono small" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.step1_label)}</p>
          {renderRow(['', '6', '7', '7', '9'], false)}
          <p className="small" style={{ color: T.ink3, marginTop: 8 }}>{t(c.step1_text)}</p>
        </div>
        {step >= 1 && (<div className="fade-up">
          <p className="mono small" style={{ color: T.ink2, marginBottom: 8 }}>{t(c.step2_label)}</p>
          {renderRow(['1', '2', '7', '4', '2'], true)}
          <p className="small" style={{ color: T.ink3, marginTop: 8 }}>{t(c.step2_text)}</p>
        </div>)}
        {step >= 2 && (<div className="fade-up frame-tip">
          <p className="small mono" style={{ margin: 0, marginBottom: 6, fontWeight: 600, color: '#D8A93A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(c.step3_label)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.step3_text)}</p>
        </div>)}
      </div>
    </Stage>
  );
};

// s2 — qoida (taqqoslash) + AKSENT: misol sonlari katta, markazda
const Screen2 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s2; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's2_a', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.3vw, 20px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[c.rule_1, c.rule_2].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'start' }}>
              <span className="mono small" style={{ color: T.accent, fontWeight: 600 }}>{i + 1}</span>
              <p className="body" style={{ margin: 0 }}>{t(r)}</p>
            </div>
          ))}
        </div>
        {/* AKSENT: katta markazlashtirilgan taqqoslash misollari */}
        <div className="frame fade-up delay-2" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 18px)', alignItems: 'center' }}>
          <CompareFigure a="4 879" b="139 820"/>
          <CompareFigure a="50 724" b="49 244"/>
        </div>
      </div>
    </Stage>
  );
};

const Screen3 = (props) => mcOf({ ...props, t: useT() }, CONTENT.s3, ['opt0', 'opt1', 'opt2'], 0, [1, 2, 0], () => <CompareFigure a="4 879" b="139 820"/>);
const Screen4 = (props) => mcOf({ ...props, t: useT() }, CONTENT.s4, ['opt0', 'opt1', 'opt2'], 1, [1, 0, 2], () => <CompareFigure a="49 244" b="50 724"/>);

// s5 — округление на оси (slider, без скролла)
const Screen5 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s5; const t = useT(); const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's5_a0', text: lines[0], trigger: 'on_mount', waits_for: { type: 'check_pressed' } }]);
  const MIN = 12000, MAX = 13000, MID = 12500;
  const [value, setValue] = useState(12742);
  const [checked, setChecked] = useState(false);
  const playedRef = useRef(false);
  const dLeft = value - MIN, dRight = MAX - value, nearer = value < MID ? MIN : MAX;
  const handleChange = (v) => { setValue(v); if (checked) setChecked(false); if (!playedRef.current && !audio.muted) { playedRef.current = true; const e = getAudioEngine(); if (e && lines[1]) e.pushOneOff(lines[1]); } };
  const handleCheck = () => { setChecked(true); audio.triggerEvent('check_pressed'); };
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!checked} label={<NextLabel/>} onClick={onNext}/></>);
  const barRow = (labelNode, dist, isNear) => (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
      <span className="mono small" style={{ color: T.ink3, minWidth: 'clamp(48px, 12vw, 64px)' }}>{labelNode}</span>
      <div style={{ flex: 1, height: 10, background: `${T.ink3}33`, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(dist / 1000) * 100}%`, background: isNear ? T.accent : T.ink3, borderRadius: 99, transition: 'width 0.2s ease-out' }}/>
      </div>
      <span className="mono small" style={{ color: isNear ? T.accent : T.ink2, minWidth: 38, textAlign: 'right' }}>{dist}</span>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="frame fade-up delay-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '44%' }}>
              <span className="mono small" style={{ color: nearer === MIN ? T.accent : T.ink3, fontWeight: nearer === MIN ? 700 : 400 }}>{t(c.axis_left)}</span>
              <span className="small" style={{ color: T.ink3, fontSize: 'clamp(10px, 1.3vw, 11px)', lineHeight: 1.2, marginTop: 2 }}>{t(c.axis_left_note)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '44%', textAlign: 'right' }}>
              <span className="mono small" style={{ color: nearer === MAX ? T.accent : T.ink3, fontWeight: nearer === MAX ? 700 : 400 }}>{t(c.axis_right)}</span>
              <span className="small" style={{ color: T.ink3, fontSize: 'clamp(10px, 1.3vw, 11px)', lineHeight: 1.2, marginTop: 2 }}>{t(c.axis_right_note)}</span>
            </div>
          </div>
          <div style={{ position: 'relative', height: 30, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: `${T.ink3}55`, borderRadius: 99 }}/>
            <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 24, height: 24, borderRadius: '50%', background: 'radial-gradient(circle at 32% 30%, #5BB0E8, #1F6FB0 72%)', boxShadow: '0 0 12px 0 rgba(1,154,203,0.55), inset -3px -3px 6px rgba(0,0,0,0.25)' }}/>
            <div className="display" style={{ position: 'absolute', left: `${pct}%`, top: -26, transform: 'translateX(-50%)', fontSize: 'clamp(15px, 2.4vw, 19px)', color: T.ink, whiteSpace: 'nowrap' }}>{value}</div>
          </div>
          <Slider value={value} min={MIN} max={MAX} step={1} onChange={handleChange}/>
          {barRow(t(c.axis_left), dLeft, nearer === MIN)}
          {barRow(t(c.axis_right), dRight, nearer === MAX)}
        </div>
        {!checked && (
          <div className="fade-up delay-3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-white-accent" onClick={handleCheck}>{t(c.btn_check)}</button>
          </div>
        )}
        {checked && (<div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t({ ru: `${value} ближе к ${nearer}.${value === MID ? ' Ровно посередине — берём большее.' : ''}`, uz: `${value} ${nearer} ga yaqinroq.${value === MID ? " Aynan o'rtada — kattasini olamiz." : ''}` })}</p>
        </div>)}
      </div>
    </Stage>
  );
};

const Screen6 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s6; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's6_a', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext onClick={onNext} label={<NextLabel/>}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.4vw, 20px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className="frame fade-up delay-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="mono small" style={{ color: T.ink3 }}>12 000</span>
            <span className="mono small" style={{ color: T.accent, fontWeight: 700 }}>13 000</span>
          </div>
          <div style={{ position: 'relative', height: 34, display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: `${T.ink3}55`, borderRadius: 99 }}/>
            <div style={{ position: 'absolute', left: '74.2%', top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: T.ink, boxShadow: '0 0 10px 0 rgba(58,53,48,0.35)' }}/>
            <div style={{ position: 'absolute', left: '83%', top: '50%', transform: 'translate(-50%, -50%)', color: T.accent, fontSize: 20, fontWeight: 700 }}>{'→'}</div>
            <div className="mono small" style={{ position: 'absolute', left: '74.2%', top: -22, transform: 'translateX(-50%)', color: T.ink }}>12 742</div>
          </div>
          <p className="small mono" style={{ color: T.ink2, marginTop: 10, marginBottom: 0, textAlign: 'center' }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '1.3em' }}>12 742</span> <Op size="sm">{'≈'}</Op> <span style={{ fontFamily: "'Fraunces', serif", fontSize: '1.3em', color: T.accent }}>13 000</span>
          </p>
        </div>
        <div className="frame-tip fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="body" style={{ margin: 0 }}>{t(c.rule_meaning)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.rule_trick)}</p>
          <p className="body" style={{ margin: 0 }}>{t(c.rule_mid)}</p>
        </div>
      </div>
    </Stage>
  );
};

const Screen7 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s7; const t = useT(); const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's7_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const rows = [
    { key: 'tens', label: c.r_tens, result: '12 740', why: c.why_tens },
    { key: 'hundreds', label: c.r_hundreds, result: '12 700', why: c.why_hundreds },
    { key: 'thousands', label: c.r_thousands, result: '13 000', why: c.why_thousands },
    { key: 'tenK', label: c.r_tenK, result: '10 000', why: c.why_tenK }
  ];
  const [opened, setOpened] = useState([]);
  const [sel, setSel] = useState(null);
  const allOpen = opened.length === rows.length;
  const cur = rows.find(r => r.key === sel);
  const speak = (txt) => { if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(txt); } };
  const open = (r, i) => {
    if (i < opened.length) { setSel(r.key); return; }
    if (i !== opened.length) return;
    setOpened(prev => prev.includes(r.key) ? prev : [...prev, r.key]); setSel(r.key);
    if (lines[i + 1]) speak(lines[i + 1]);
  };
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext disabled={!allOpen} label={<NextLabel/>} onClick={onNext}/></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 18px)' }}>
        <h2 className="title h-title fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{t(c.intro)}</p>
        <div className="frame fade-up delay-2" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 'clamp(30px, 6.4vw, 50px)', letterSpacing: '0.04em' }}>12 742</div>
        </div>
        {!allOpen && <p className="small" style={{ textAlign: 'center', color: T.accent, fontWeight: 600, margin: 0 }}>{t(c.tap_prompt)}</p>}
        <div className="fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {rows.map((r, i) => {
            const isNext = i === opened.length; const locked = i > opened.length;
            return (
              <button key={r.key} disabled={locked} className={`option${isNext && !allOpen ? ' tap-pulse' : ''}`} onClick={() => open(r, i)} style={{ padding: 'clamp(12px, 1.7vw, 15px)', fontSize: 'clamp(13px, 1.6vw, 14px)', textAlign: 'center', background: sel === r.key ? T.accentSoft : T.paper, color: sel === r.key ? T.accent : (locked ? T.ink3 : T.ink), opacity: locked ? 0.45 : 1 }}>{t(r.label)}</button>
            );
          })}
        </div>
        {cur && (
          <div className="frame-success fade-up" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 14px)', flexWrap: 'wrap' }}>
              <span className="display" style={{ fontSize: 'clamp(20px, 4vw, 28px)', color: T.ink2 }}>12 742</span>
              <Op size="mid">{'≈'}</Op>
              <span className="display" style={{ fontSize: 'clamp(24px, 5vw, 34px)', color: T.accent }}>{cur.result}</span>
            </div>
            <p className="small" style={{ margin: 0, marginTop: 8, color: T.ink2 }}>{t(cur.why)}</p>
          </div>
        )}
        <div className="frame-tip fade-up delay-4"><p className="body" style={{ margin: 0 }}>{t(c.conclusion)}</p></div>
      </div>
    </Stage>
  );
};

// s8 — SEQ: yaxlitlash mashqi (eski s8 MC + s9, s10 input)
const Screen8 = (props) => {
  const items = [
    { type: 'mc', c: CONTENT.s8, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s8.correctIndex, order: [0, 2, 1] },
    { type: 'input', c: CONTENT.s9, base: '12 104', answer: CONTENT.s9.correctValue },
    { type: 'input', c: CONTENT.s10, base: '750', answer: CONTENT.s10.correctValue }
  ];
  return <SeqSolve {...props} items={items} scope="practice" screenContent={W_ROUND}/>;
};

// s9 — kosmik holat (case setup)
const Screen9 = ({ screen, totalScreens, onNext, onPrev }) => {
  const c = CONTENT.s11; const t = useT(); const lang = useLang();
  const audio = useAudio([{ id: 's_case_a', text: c.audio[lang], trigger: 'on_mount', waits_for: null }]);
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><NavNext label={t(c.cta)} onClick={onNext}/></>);
  const facts = [c.fact_1, c.fact_2, c.fact_3];
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.6vw, 22px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0, color: T.ink }}>{t(c.intro)}</p></div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {facts.map((f, i) => (
            <div key={i} className={`frame fade-up delay-${i + 2}`} style={{ padding: 'clamp(14px, 2.5vw, 18px)', textAlign: 'center' }}>
              <p className="body" style={{ margin: 0 }}>{t(f)}</p>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s10 — SEQ: случай+итог (eski s12, s13, s14, s15)
const Screen10 = (props) => {
  const items = [
    { type: 'mc', c: CONTENT.s12, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s12.correctIndex, order: [2, 0, 1] },
    { type: 'mc', c: CONTENT.s13, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s13.correctIndex, order: [0, 2, 1] },
    { type: 'mc', c: CONTENT.s14, optKeys: ['opt0', 'opt1', 'opt2'], correct: CONTENT.s14.correctIndex, order: [1, 2, 0] },
    { type: 'mc', c: CONTENT.s15, optKeys: ['opt0', 'opt1', 'opt2', 'opt3'], correct: CONTENT.s15.correctIndex, order: [0, 3, 1, 2] }
  ];
  return <SeqSolve {...props} items={items} scope="practice" screenContent={W_MIX}/>;
};

// s11, s12 — SEQ: yangi qiyin yaxlitlash
const Screen11 = (props) => <SeqSolve {...props} items={HARD1_ITEMS} scope="practice" screenContent={W_HARD1}/>;
const Screen12 = (props) => <SeqSolve {...props} items={HARD2_ITEMS} scope="final" screenContent={W_HARD2}/>;

// s13 — yakun
const Screen13 = ({ screen, totalScreens, answers, onReset, onPrev, finishLesson }) => {
  const c = CONTENT.s16; const t = useT(); const lang = useLang();
  const lines = c.audio[lang];
  const audio = useAudio([{ id: 's_sum_a0', text: lines[0], trigger: 'on_mount', waits_for: null }]);
  const voicedRef = useRef(false);
  useEffect(() => {
    finishLesson();
    if (!audio.muted && !voicedRef.current) { voicedRef.current = true; const e = getAudioEngine(); if (e) lines.slice(1).forEach(l => e.pushOneOff(l)); }
    /* eslint-disable-next-line */
  }, []);
  const scoredIdx = SCREEN_META.map((m, i) => (m.scored ? i : -1)).filter(i => i >= 0);
  const correct = scoredIdx.filter(i => answers[i]?.correct).length;
  const total = scoredIdx.length;
  const navContent = (<><NavBack onPrev={onPrev} label={<BackLabel/>}/><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(10px, 1.7vw, 12px) clamp(15px, 2.1vw, 20px)', fontSize: 'clamp(12px, 1.5vw, 14px)' }}>{lang === 'uz' ? "Qaytadan o'tish" : 'Пройти заново'}</button></>);
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)', justifyContent: 'center' }}>
        <Floaters/>
        <h2 className="title h-title fade-up" style={{ position: 'relative', margin: 0 }}>{t(c.title)}</h2>
        <div className="frame-tip fade-up delay-1" style={{ position: 'relative' }}><p className="body" style={{ margin: 0 }}>{t(c.ring_back)}</p></div>
        <div className="frame-success fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: T.success, lineHeight: 1, flexShrink: 0 }}>{correct} / {total}</span>
          <span className="body" style={{ margin: 0, color: T.ink2 }}>{lang === 'uz' ? "blok birinchi urinishda to'g'ri" : 'блоков решено с первой попытки'}</span>
        </div>
        <div className="frame fade-up delay-2" style={{ position: 'relative' }}>
          <ul className="body" style={{ paddingLeft: 20, color: T.ink2, display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
            <li>{t(c.learned_1)}</li>
            <li>{t(c.learned_2)}</li>
          </ul>
        </div>
        <div className="frame-tip fade-up delay-3" style={{ position: 'relative' }}>
          <p className="small" style={{ margin: 0 }}><span style={{ fontWeight: 700, color: T.accent }}>➡️ {lang === 'uz' ? 'Keyingi' : 'Дальше'}:</span> {t(c.teaser)}</p>
        </div>
      </div>
    </Stage>
  );
};

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13];

// ============================================================
const STYLES = `
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: #0E0E10; background: #F6F4EF; height: 100dvh; overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4, .lesson-root h5, .lesson-root h6, .lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }

.title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; font-variation-settings: "opsz" 60; }
.display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; font-variation-settings: "opsz" 60; }
.italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; font-variation-settings: "opsz" 60; }
.mono { font-family: 'JetBrains Mono', monospace; }
.mop { font-family: 'Manrope', sans-serif; font-weight: 600; color: #0E0E10; display: inline-block; padding: 0 0.06em; }

.frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; margin: 0 0.08em; font-family: 'Fraunces', serif; font-variation-settings: "opsz" 144; font-weight: 400; }
.frac .n, .frac .d { padding: 0 0.12em; }
.frac .bar { height: 0.08em; background: currentColor; width: 100%; margin: 0.08em 0; border-radius: 2px; }

@keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }

.feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
.feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px, 2vw, 20px); }

.btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #0E0E10; color: #F6F4EF; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 6px 18px -4px rgba(58, 53, 48, 0.32); }
.btn:hover:not(:disabled) { background: #FF4F28; box-shadow: 0 10px 24px -4px rgba(255, 79, 40, 0.45); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #FFFFFF; color: #FF4F28; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: 0 8px 22px -4px rgba(255, 79, 40, 0.35), 0 0 0 1px rgba(255, 79, 40, 0.12); }
.btn-white-accent:hover:not(:disabled) { background: #FF4F28; color: #FFFFFF; box-shadow: 0 12px 28px -6px rgba(255, 79, 40, 0.55); }
.btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(58, 53, 48, 0.14); }
.btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: #0E0E10; letter-spacing: 0.01em; border-radius: 12px; border: none; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: #FFFFFF; box-shadow: 0 6px 18px -6px rgba(58, 53, 48, 0.18); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

.option { background: #FFFFFF; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: #0E0E10; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(58, 53, 48, 0.22); }
.option:disabled { cursor: default; }
.option-correct { background: #E3F0E8 !important; color: #1F7A4D !important; box-shadow: 0 8px 22px -6px rgba(31, 122, 77, 0.32) !important; }
.option-wrong { background: #FFFFFF !important; color: #A7A6A2 !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(58, 53, 48, 0.08) !important; }
.option-picked-wrong { background: #FFE8E1 !important; color: #FF4F28 !important; box-shadow: 0 8px 22px -6px rgba(255, 79, 40, 0.38) !important; }

.h-title { font-size: clamp(22px, 4vw, 38px); }
.h-sub { font-size: clamp(17px, 2.5vw, 20px); }
.body { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.5; }
.eyebrow { font-size: clamp(11px, 1.3vw, 11px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
.small { font-size: clamp(13px, 1.5vw, 13px); }
.frac-display { font-size: clamp(45px, 9vw, 75px); }
.frac-mid { font-size: clamp(26px, 5vw, 38px); }
.frac-sm { font-size: clamp(16px, 2.5vw, 20px); }

.stage { max-width: 936px; margin: 0 auto; height: 100dvh; display: flex; flex-direction: column; }
.stage-header { flex-shrink: 0; background: #F6F4EF; padding-top: clamp(12px, 2vw, 18px); padding-bottom: clamp(8px, 1.5vw, 12px); }
.stage-content { flex: 1; padding-top: clamp(10px, 1.7vw, 16px); padding-bottom: clamp(17px, 3.4vw, 34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
.stage-nav { flex-shrink: 0; background: #F6F4EF; border-top: 1px solid rgba(167, 166, 162, 0.25); padding-top: clamp(12px, 2vw, 15px); padding-bottom: clamp(12px, 2vw, 15px); display: flex; gap: 12px; }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.chrome-left { display: flex; align-items: center; gap: 10px; color: #5A5A60; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #FF4F28; box-shadow: 0 0 8px rgba(255, 79, 40, 0.55); }

.progress-track { height: 6px; background: rgba(167, 166, 162, 0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; overflow: visible; }
.progress-bar { height: 100%; background: #FF4F28; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px; box-shadow: 0 0 10px rgba(255, 79, 40, 0.55), 0 0 3px rgba(255, 79, 40, 0.40); }

.track-wrap { position: relative; height: 26px; margin: 18px 0; display: flex; align-items: center; }
.track-bg { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 4px; background: rgba(167, 166, 162, 0.30); border-radius: 99px; pointer-events: none; }
.track-fill { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 4px; background: #FF4F28; border-radius: 99px; pointer-events: none; box-shadow: 0 0 8px rgba(255, 79, 40, 0.50), 0 0 2px rgba(255, 79, 40, 0.40); transition: width 0.15s ease-out; }
.slider-input { -webkit-appearance: none; appearance: none; position: relative; width: 100%; height: 24px; background: transparent; outline: none; margin: 0; cursor: grab; z-index: 2; }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; transition: transform 0.1s; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-moz-range-thumb { width: 24px; height: 24px; background: #FF4F28; border-radius: 50%; cursor: grab; border: none; box-shadow: 0 0 0 4px #F6F4EF, 0 0 12px 0 rgba(255, 79, 40, 0.55); }
.slider-input::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.12); }
.slider-input:disabled { cursor: not-allowed; }
.slider-input:disabled::-webkit-slider-thumb { opacity: 0.5; cursor: not-allowed; }

.answer-input { font-family: 'Fraunces', serif; font-size: clamp(22px, 4vw, 27px); font-weight: 400; text-align: center; border-radius: 12px; background: #FFFFFF; padding: 8px 12px; outline: none; border: none; color: #0E0E10; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); }
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255, 79, 40, 0.30), 0 0 0 1px rgba(255, 79, 40, 0.20); }
.answer-input.correct { background: #E3F0E8; color: #1F7A4D; box-shadow: 0 8px 20px -6px rgba(31, 122, 77, 0.30); }
.answer-input.wrong { background: #FFE8E1; color: #FF4F28; box-shadow: 0 8px 20px -6px rgba(255, 79, 40, 0.36); }

.frame { background: #FFFFFF; border-radius: 16px; padding: clamp(17px, 3.4vw, 30px); border: none; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.14); }
.frame-soft { background: #FFE8E1; border-left: 4px solid #FF4F28; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(255, 79, 40, 0.22); }
.frame-success { background: #E3F0E8; border-left: 4px solid #1F7A4D; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(31, 122, 77, 0.22); }
.frame-tip { background: #FBF3D6; border-left: 4px solid #D8A93A; border-radius: 12px; padding: clamp(14px, 2.5vw, 20px); box-shadow: 0 6px 16px -6px rgba(180, 138, 30, 0.22); }

/* ===== УРОК-СПЕЦИФИЧНЫЙ CSS (nat_5_02 — космос) ===== */
@keyframes slide-in-right { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
.cell-anim { animation: slide-in-right 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
@keyframes soft-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
.pulse { animation: soft-pulse 2.4s ease-in-out infinite; display: inline-block; }
.pulse-slow { animation-duration: 3.2s; }
.planet { border-radius: 50%; box-shadow: 0 8px 22px -6px rgba(58, 53, 48, 0.30), inset -6px -6px 16px rgba(0, 0, 0, 0.18); flex-shrink: 0; }
@keyframes tap-pulse { 0%, 100% { box-shadow: 0 6px 16px -6px rgba(58, 53, 48, 0.14); } 50% { box-shadow: 0 8px 20px -4px rgba(255, 79, 40, 0.45); } }
.tap-pulse { animation: tap-pulse 1.4s ease-in-out infinite; }

.amb { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.amb-o { position: absolute; border-radius: 50%; opacity: 0.7; animation: ambFloat 15s ease-in-out infinite; background: radial-gradient(circle at 30% 30%, rgba(255, 79, 40, 0.10), rgba(255, 79, 40, 0.02)); }
.amb-o1 { width: 90px; height: 90px; left: 5%; top: 10%; animation-delay: 0s; }
.amb-o2 { width: 130px; height: 130px; right: 3%; bottom: 6%; animation-delay: -5s; background: radial-gradient(circle at 30% 30%, rgba(1, 154, 203, 0.10), rgba(1, 154, 203, 0.02)); }
.amb-o3 { width: 58px; height: 58px; left: 42%; top: 62%; animation-delay: -9s; }
@keyframes ambFloat { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-14px) translateX(8px); } 66% { transform: translateY(8px) translateX(-10px); } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (platform_contract §1)
// ============================================================
export default function NumbersLesson_5_02({
  studentName, lang: langProp, ttsApiBase,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  const lang = langProp || 'ru';
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const nextArr = [...prev]; nextArr[screenIdx] = data; return nextArr; });
  }, []);
  const reset = useCallback(() => { setAnswers([]); setCurrent(0); startTimeRef.current = Date.now(); }, []);
  const finishLesson = useCallback(() => {
    const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
    safeOnFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
      answers: answers.filter(Boolean)
    });
  }, [answers, safeOnFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));
  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <CurrentScreen
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
