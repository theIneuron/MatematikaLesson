// ============================================================================
// 4-SINF · Dars 8 amaliyoti — Ko'p xonali sonlarni qo'shish va ayirish
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 8. Практика: сложение и вычитание', uz: "8-dars. Amaliyot: qo'shish va ayirish" },
  task: { ru: 'Задание', uz: 'Topshiriq' }, check: { ru: 'Проверить', uz: 'Tekshirish' },
  next: { ru: 'Следующее', uz: 'Keyingisi' }, finish: { ru: 'Завершить', uz: 'Yakunlash' },
  again: { ru: 'Пройти заново', uz: 'Qaytadan' }, rule: { ru: 'Запомни', uz: 'Eslab qoling' },
  retry: { ru: 'Попробовать ещё', uz: "Yana urinib ko'ring" }, typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting' },
  clear: { ru: 'Стереть', uz: "O'chirish" },
  matchHint: { ru: 'Сначала выбери карточку слева, затем её пару справа', uz: "Avval chapdagi kartani, keyin uning o'ngdagi juftini tanlang" },
  digitHint: { ru: 'Выбери одну цифру', uz: 'Bitta raqamni tanlang' },
  stateHint: { ru: 'Выбери состояние верхней строки', uz: 'Yuqori qator holatini tanlang' },
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi' }, ofTen: { ru: 'из 10', uz: '10 dan' },
};

const tx = (node, lang) => (node && typeof node === 'object' ? (node[lang] ?? node.ru) : node);
const grouped = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const TASKS = [
  {
    id: '01', kind: 'mc', level: '🟢', figure: '47 306 + 5 482',
    setup: { ru: 'Числа имеют разное количество цифр.', uz: 'Sonlardagi raqamlar soni har xil.' },
    prompt: { ru: 'Как правильно расположить их столбиком?', uz: "Ularni ustun shaklida qanday to'g'ri joylashtirish kerak?" },
    options: [
      { visual: ' 47306\n+ 5482', text: { ru: 'Единицы стоят под единицами', uz: 'Birliklar birliklar ostida turibdi' }, correct: true },
      { visual: ' 47306\n+5482 ', text: { ru: 'Числа выровнены слева', uz: 'Sonlar chap tomondan tekislangan' }, wrong: { ru: 'Так одинаковые разряды оказались не друг под другом. Найди единицы обоих чисел.', uz: "Bunday joylashuvda bir xil xonalar ustma-ust kelmadi. Ikkala sonning birlar xonasini toping." } },
      { visual: ' 47306\n+  5482', text: { ru: 'Второе число сдвинуто вправо', uz: "Ikkinchi son o'ngga siljitilgan" }, wrong: { ru: 'Единицы второго числа ушли правее единиц первого. Совмести последние цифры.', uz: "Ikkinchi sonning birliklari birinchi son birliklaridan o'ngga o'tib ketdi. Oxirgi raqamlarni tekislang." } },
    ],
    correctText: { ru: 'Верно. Последние цифры 6 и 2 стоят в одном разряде единиц.', uz: "To'g'ri. Oxirgi 6 va 2 raqamlari birlar xonasida ustma-ust turibdi." },
    rule: { ru: 'При записи столбиком выравнивай числа по разряду единиц.', uz: "Ustun shaklida yozganda sonlarni birlar xonasi bo'yicha tekislang." },
  },
  {
    id: '02', kind: 'numpad', level: '🟢', answer: '77887', maxLen: 5, figure: '54 673 + 23 214',
    setup: { ru: 'Разряды уже выровнены.', uz: 'Xonalar allaqachon tekislangan.' },
    prompt: { ru: 'Найди сумму.', uz: "Yig'indini toping." },
    hints: [
      { ru: 'Начни с единиц и складывай цифры одного разряда.', uz: "Birlar xonasidan boshlang va bir xil xona raqamlarini qo'shing." },
      { ru: 'В этом примере ни в одном разряде не требуется перенос. Проверь каждую колонку отдельно.', uz: "Bu misolda hech bir xonada ko'chirish kerak emas. Har bir ustunni alohida tekshiring." },
    ],
    correctText: { ru: 'Верно: 54 673 + 23 214 = 77 887.', uz: "To'g'ri: 54 673 + 23 214 = 77 887." },
    rule: { ru: 'Складывай только единицы одинаковых разрядов.', uz: "Faqat bir xil xona birliklarini qo'shing." },
  },
  {
    id: '03', kind: 'match', level: '🟡',
    setup: { ru: 'Каждый результат не меньше десяти нужно обменять.', uz: "10 yoki undan katta har bir natijani almashtirish kerak." },
    prompt: { ru: 'Соедини количество с правильным обменом.', uz: "Miqdorni to'g'ri almashtirish bilan moslashtiring." },
    pairs: [
      { id: 'a', left: { ru: '13 единиц', uz: '13 birlik' }, right: { ru: '1 десяток + 3 единицы', uz: "1 o'nlik + 3 birlik" } },
      { id: 'b', left: { ru: '14 десятков', uz: "14 o'nlik" }, right: { ru: '1 сотня + 4 десятка', uz: "1 yuzlik + 4 o'nlik" } },
      { id: 'c', left: { ru: '12 сотен', uz: '12 yuzlik' }, right: { ru: '1 тысяча + 2 сотни', uz: '1 minglik + 2 yuzlik' } },
      { id: 'd', left: { ru: '11 тысяч', uz: '11 minglik' }, right: { ru: '1 десяток тысяч + 1 тысяча', uz: "1 o'n minglik + 1 minglik" } },
    ],
    wrongText: { ru: 'Одна пара меняет величину. Десять единиц данного разряда дают одну единицу следующего разряда.', uz: "Juftliklardan biri miqdorni o'zgartirib yubordi. Bir xonaning 10 birligi keyingi xonaning 1 birligini beradi." },
    correctText: { ru: 'Верно. В каждой паре десять меньших единиц обменены на одну большую.', uz: "To'g'ri. Har bir juftlikda 10 ta kichik birlik 1 ta katta birlikka almashtirildi." },
    rule: { ru: 'Перенос означает обмен 10 единиц на 1 единицу следующего разряда.', uz: "Ko'chirish 10 birlikni keyingi xonaning 1 birligiga almashtirishni bildiradi." },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '62335', maxLen: 5, figure: '37 586 + 24 749',
    setup: { ru: 'В нескольких разрядах появится перенос.', uz: "Bir nechta xonada ko'chirish paydo bo'ladi." },
    prompt: { ru: 'Вычисли сумму.', uz: "Yig'indini hisoblang." },
    hints: [
      { ru: 'Записывай единицы результата, а десяток переноси в следующую колонку.', uz: "Natijaning birliklarini yozing, o'nlikni esa keyingi ustunga ko'chiring." },
      { ru: 'Проверь цепочку переносов из единиц в десятки и из десятков в сотни.', uz: "Birliklardan o'nliklarga va o'nliklardan yuzliklarga ko'chirish zanjirini tekshiring." },
    ],
    correctText: { ru: 'Верно: 37 586 + 24 749 = 62 335.', uz: "To'g'ri: 37 586 + 24 749 = 62 335." },
    rule: { ru: 'Каждый перенос прибавляется при вычислении следующего разряда.', uz: "Har bir ko'chirilgan qiymat keyingi xonani hisoblashda qo'shiladi." },
  },
  {
    id: '05', kind: 'digit', level: '🟡', answer: '0', figure: '26 438 + 17 596 = 44 □34',
    setup: { ru: 'Из результата исчезла одна цифра.', uz: "Natijadan bitta raqam yo'qoldi." },
    prompt: { ru: 'Какую цифру нужно вернуть?', uz: 'Qaysi raqamni qaytarish kerak?' },
    wrongText: { ru: 'Проверь сотни, затем учти перенос в разряд тысяч. Пропуск должен сохранить все места результата.', uz: "Yuzliklarni tekshiring, keyin minglar xonasiga ko'chirishni hisobga oling. Bo'sh joy natijadagi barcha xonalarni saqlashi kerak." },
    correctText: { ru: 'Верно. Получилось 44 034: ноль сохраняет разряд сотен.', uz: "To'g'ri. 44 034 hosil bo'ldi: nol yuzlar xonasini saqlaydi." },
    rule: { ru: 'Ноль внутри ответа нельзя пропускать: он сохраняет разряд.', uz: "Javob ichidagi nolni tashlab ketmang: u xonani saqlaydi." },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '43 875 + 8 946',
    setup: { ru: 'У Мадины было 43 875 книг, затем привезли ещё 8 946.', uz: "Madinada 43 875 ta kitob bor edi, keyin yana 8 946 ta kitob keltirildi." },
    prompt: { ru: 'Сколько книг стало?', uz: "Kitoblar soni nechta bo'ldi?" },
    options: [
      { text: { ru: '52 821', uz: '52 821' }, correct: true },
      { text: { ru: '34 929', uz: '34 929' }, wrong: { ru: 'Ты нашёл разность. Слово ещё означает, что количество увеличилось.', uz: "Siz ayirmani topdingiz. Yana so'zi miqdor ko'payganini bildiradi." } },
      { text: { ru: '43 883', uz: '43 883' }, wrong: { ru: 'К исходному числу прибавлена только последняя цифра. Нужно прибавить всё число 8 946 по разрядам.', uz: "Boshlang'ich songa faqat oxirgi raqam qo'shilgan. 8 946 sonining barcha xonalarini qo'shish kerak." } },
      { text: { ru: '438 758 946', uz: '438 758 946' }, wrong: { ru: 'Числа записаны рядом, а задача требует найти их сумму.', uz: "Sonlar yonma-yon yozilgan, masalada esa ularning yig'indisini topish kerak." } },
    ],
    correctText: { ru: 'Верно. После поступления стало 52 821 книга.', uz: "To'g'ri. Kitoblar kelgach, jami 52 821 ta kitob bo'ldi." },
    rule: { ru: 'Если количество увеличилось на несколько единиц, используй сложение.', uz: "Miqdor biror songa ko'paygan bo'lsa, qo'shish amalidan foydalaning." },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'Каждое вычисление можно проверить обратным действием.', uz: "Har bir hisobni teskari amal bilan tekshirish mumkin." },
    prompt: { ru: 'Соедини вычисление с подходящей проверкой.', uz: "Hisobni mos tekshiruv bilan bog'lang." },
    pairs: [
      { id: 'a', left: '31 748 + 6 925 = 38 673', right: '38 673 − 6 925 = 31 748' },
      { id: 'b', left: '72 410 − 18 265 = 54 145', right: '54 145 + 18 265 = 72 410' },
      { id: 'c', left: '49 320 + 24 608 = 73 928', right: '73 928 − 24 608 = 49 320' },
    ],
    wrongText: { ru: 'Одна проверка не возвращает исходное число. Сумму проверяй вычитанием, а разность — сложением.', uz: "Tekshiruvlardan biri boshlang'ich sonni qaytarmaydi. Yig'indini ayirish, ayirmani esa qo'shish bilan tekshiring." },
    correctText: { ru: 'Верно. Каждая проверка вернула известное исходное число.', uz: "To'g'ri. Har bir tekshiruv ma'lum boshlang'ich sonni qaytardi." },
    rule: { ru: 'Сложение и вычитание являются обратными действиями.', uz: "Qo'shish va ayirish o'zaro teskari amallardir." },
  },
  {
    id: '08', kind: 'state', level: '🔴', figure: '50 004 − 18 729',
    setup: { ru: 'Для вычитания из 4 числа 9 нужно пройти через цепочку нулей.', uz: "4 dan 9 ni ayirish uchun nollar zanjiri orqali maydalash kerak." },
    prompt: { ru: 'Как выглядит верхняя строка после обмена?', uz: "Almashtirishdan keyin yuqori qator qanday ko'rinadi?" },
    options: [
      { value: '4 | 9 | 9 | 9 | 14', correct: true },
      { value: '5 | 0 | 0 | 0 | 14', wrong: { ru: 'Единицы получили десяток, но ни один разряд слева не уменьшился. Найди первый ненулевой разряд.', uz: "Birliklar o'nlik oldi, ammo chapdagi hech bir xona kamaymadi. Chapdagi birinchi noldan farqli xonani toping." } },
      { value: '4 | 10 | 10 | 10 | 14', wrong: { ru: 'После передачи единицы вправо каждый промежуточный разряд должен уменьшиться на один.', uz: "Birlik o'ngga uzatilgach, har bir oraliq xona bittaga kamayishi kerak." } },
      { value: '4 | 9 | 9 | 10 | 14', wrong: { ru: 'Разряд десятков отдал один десяток единицам, поэтому в нём не может остаться десять.', uz: "O'nlar xonasi birliklarga bir o'nlik berdi, shuning uchun unda o'nta qolmaydi." } },
    ],
    correctText: { ru: 'Верно. Получается 4 | 9 | 9 | 9 | 14, а разность равна 31 275.', uz: "To'g'ri. 4 | 9 | 9 | 9 | 14 holati hosil bo'ladi, ayirma esa 31 275 ga teng." },
    rule: { ru: 'Через цепочку нулей занимай у первого ненулевого разряда слева.', uz: "Nollar zanjirida chapdagi birinchi noldan farqli xonadan maydalang." },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '47 685 + 28 796 = 75 481',
    setup: { ru: 'В вычислении потерялся один перенос.', uz: "Hisoblashda bitta ko'chirish yo'qolgan." },
    prompt: { ru: 'Какой разряд вычислен неверно первым?', uz: "Birinchi bo'lib qaysi xona noto'g'ri hisoblangan?" },
    options: [
      { text: { ru: 'Тысячи', uz: 'Mingliklar' }, correct: true },
      { text: { ru: 'Единицы', uz: 'Birliklar' }, wrong: { ru: 'Пять и шесть дают одиннадцать: единица записана верно, а перенос отправлен дальше.', uz: "Besh va olti o'n bir bo'ladi: bir raqami to'g'ri yozilgan, ko'chirish esa keyingi xonaga o'tgan." } },
      { text: { ru: 'Десятки', uz: "O'nliklar" }, wrong: { ru: 'Восемь, девять и перенос дают восемнадцать. Цифра 8 в ответе верна.', uz: "Sakkiz, to'qqiz va ko'chirilgan bir o'n sakkiz bo'ladi. Javobdagi 8 raqami to'g'ri." } },
      { text: { ru: 'Сотни', uz: 'Yuzliklar' }, wrong: { ru: 'Шесть, семь и перенос дают четырнадцать. Цифра 4 записана верно, но следующий перенос нужно сохранить.', uz: "Olti, yetti va ko'chirilgan bir o'n to'rt bo'ladi. 4 raqami to'g'ri yozilgan, ammo keyingi ko'chirishni saqlash kerak." } },
    ],
    correctText: { ru: 'Верно. В тысячах забыли перенос из сотен. Правильная сумма — 76 481.', uz: "To'g'ri. Mingliklarda yuzliklardan ko'chirilgan bir unutildi. To'g'ri yig'indi 76 481." },
    rule: { ru: 'Ищи первую ошибку справа налево, начиная с единиц.', uz: "Birinchi xatoni o'ngdan chapga, birlar xonasidan boshlab qidiring." },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '62 540 − 17 865',
    setup: { ru: 'На складе было 62 540 единиц товара, 17 865 единиц использовали.', uz: "Omborda 62 540 birlik mahsulot bor edi, 17 865 birligi ishlatildi." },
    prompt: { ru: 'Какой план полностью решает и проверяет задачу?', uz: "Qaysi reja masalani to'liq yechadi va tekshiradi?" },
    options: [
      { text: { ru: 'Оценить ≈ 45 000; вычислить 44 675; проверить 44 675 + 17 865 = 62 540', uz: "≈45 000 deb baholash; 44 675 ni hisoblash; 44 675 + 17 865 = 62 540 bilan tekshirish" }, correct: true },
      { text: { ru: 'Сложить и получить 80 405, потому что количество использовали', uz: "Miqdor ishlatilgani uchun qo'shib, 80 405 ni olish" }, wrong: { ru: 'Использованная часть уменьшает остаток. Сначала выбери действие по смыслу задачи.', uz: "Ishlatilgan qism qoldiqni kamaytiradi. Avval masala mazmuniga mos amalni tanlang." } },
      { text: { ru: 'Оценить ≈ 45 000 и записать это как точный ответ', uz: "≈45 000 deb baholab, uni aniq javob sifatida yozish" }, wrong: { ru: 'Оценка показывает только величину результата. Для точного ответа нужно выполнить вычитание.', uz: "Taxmin faqat natijaning kattaligini ko'rsatadi. Aniq javob uchun ayirishni bajarish kerak." } },
      { text: { ru: 'Получить 44 675 и проверить ещё одним вычитанием', uz: "44 675 ni topib, yana bir ayirish bilan tekshirish" }, wrong: { ru: 'Результат найден верно, но проверка должна вернуть исходное количество обратным действием.', uz: "Natija to'g'ri topilgan, ammo tekshiruv teskari amal bilan boshlang'ich miqdorni qaytarishi kerak." } },
    ],
    correctText: { ru: 'Верно. Осталось 44 675 единиц, и обратное действие возвращает 62 540.', uz: "To'g'ri. 44 675 birlik qoldi va teskari amal 62 540 ni qaytardi." },
    rule: { ru: 'Оценка проверяет величину ответа, а обратное действие — его точность.', uz: "Taxmin javob kattaligini, teskari amal esa uning aniqligini tekshiradi." },
  },
];

const NumPad = ({ value, setValue, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display" aria-live="polite">{value ? grouped(value) : '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
        <button key={n} type="button" className="p4-key" disabled={disabled} onClick={() => setValue((old) => old.length >= max ? old : old + n)}>{n}</button>
      ))}
      <button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => setValue((old) => old.slice(0, -1))}>⌫</button>
    </div>
  </div>
);

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status" aria-live="polite">
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

function Task({ task, lang, last, onSolved }) {
  const choices = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : (task.options || []), [task]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const advancedRef = useRef(false);
  const feedbackRef = useRef(null);

  const pickedChoice = picked === null ? null : choices[picked];
  const solved = checked && (
    ((task.kind === 'mc' || task.kind === 'state') && pickedChoice?.correct === true)
    || (task.kind === 'digit' && String(picked) === task.answer)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const canCheck = ((task.kind === 'mc' || task.kind === 'state' || task.kind === 'digit') && picked !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && Object.keys(pairs).length === task.pairs.length);
  const firstMatchWrong = task.kind === 'match' && checked
    ? task.pairs.findIndex((pair, i) => pairs[i] !== pair.id)
    : -1;

  useEffect(() => {
    if (!checked || !feedbackRef.current) return undefined;
    let timeout;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      timeout = setTimeout(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      }, 180);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout); };
  }, [checked]);

  const wrongText = (() => {
    if (task.kind === 'mc' || task.kind === 'state') return pickedChoice?.wrong;
    if (task.kind === 'numpad') return task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    return task.wrongText;
  })();

  const retry = () => {
    setChecked(false);
    setPicked(null);
    setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
  };

  return (
    <div className="p4-task">
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {task.figure && <div className="p4-figure"><span className="p4-bignum">{tx(task.figure, lang)}</span></div>}
      <h2 className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{choices.map((option, i) => (
        <button
          key={`${task.id}-${i}`}
          type="button"
          className={`p4-option ${picked === i ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          aria-pressed={picked === i}
          onClick={() => { setPicked(i); setChecked(false); }}
        >
          <span className="p4-letter">{'ABCD'[i]}</span>
          <span className="p4-option-copy">{option.visual && <span className="p4-column" aria-hidden="true">{option.visual}</span>}<span>{tx(option.text, lang)}</span></span>
        </button>
      ))}</div>}

      {task.kind === 'numpad' && <NumPad value={typed} setValue={(fn) => { setTyped(fn); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {task.kind === 'digit' && <div className="p4-digits" role="group" aria-label={tx(UI.digitHint, lang)}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <button key={digit} type="button" className={`p4-digit-choice ${picked === digit ? (checked ? (String(digit) === task.answer ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-pressed={picked === digit} onClick={() => { setPicked(digit); setChecked(false); }}>{digit}</button>
      ))}</div>}

      {task.kind === 'state' && <div className="p4-state" role="group" aria-label={tx(UI.stateHint, lang)}>{choices.map((option, i) => (
        <button key={option.value} type="button" className={`p4-state-option ${picked === i ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`} disabled={solved} aria-pressed={picked === i} onClick={() => { setPicked(i); setChecked(false); }}>{option.value}</button>
      ))}</div>}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair, i) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === i ? 'is-active' : ''} ${pairs[i] ? 'is-tied' : ''} ${firstMatchWrong === i ? 'is-no' : ''}`} disabled={solved} aria-pressed={activeLeft === i} onClick={() => { setActiveLeft(i); setChecked(false); }}>
              {tx(pair.left, lang)}{pairs[i] && <b className="p4-tie">{tx(rightPairs.find((right) => right.id === pairs[i])?.right, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightPairs.map((pair) => {
            const used = Object.values(pairs).includes(pair.id);
            return <button key={pair.id} type="button" className="p4-match-item p4-match-right" disabled={solved || activeLeft === null || used} aria-pressed={used} onClick={() => {
              if (activeLeft === null || used) return;
              setPairs((old) => ({ ...old, [activeLeft]: pair.id })); setActiveLeft(null); setChecked(false);
            }}>{tx(pair.right, lang)}</button>;
          })}</div>
        </div>
      </div>}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button
          type="button"
          className="p4-btn p4-btn-ready"
          disabled={advancing}
          onClick={() => {
            if (advancedRef.current) return;
            advancedRef.current = true;
            setAdvancing(true);
            onSolved(attempts === 1);
          }}
        >{tx(last ? UI.finish : UI.next, lang)}</button>}
      </div>
    </div>
  );
}

export default function Grade4Dars08Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishCalledRef = useRef(false);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      if (finishCalledRef.current) return;
      finishCalledRef.current = true;
      setFinished(true);
      onFinished?.({ lessonId: 'num-4-08-practice', totalQuestions: 10, correctAnswers: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100) });
    } else setIndex((old) => old + 1);
  };

  const restart = () => {
    finishCalledRef.current = false;
    setIndex(0); setFirstTry(0); setFinished(false);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && <div className="p4-lang">{['ru', 'uz'].map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} aria-pressed={code === lang} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="p4-head">
        <div className="p4-progress" role="progressbar" aria-label={tx(UI.title, lang)} aria-valuemin="0" aria-valuemax="10" aria-valuenow={finished ? 10 : index}><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div>
        <div className="p4-head-row"><h1 className="p4-title">{tx(UI.title, lang)}</h1><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <div className="p4-done" role="status" aria-live="polite">
          <h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{lang === 'uz' ? "Birinchi urinishda to'g'ri bajarilgan topshiriqlar soni." : 'Столько заданий решено с первой попытки.'}</p>
          <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
        </div> : <Task key={task.id} task={task} lang={lang} last={index === TASKS.length - 1} onSolved={onSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100%;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{margin:0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:${T.ink3}}
.p4-main{max-width:720px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{margin:2px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}.p4-note{margin:8px 0 0;font-size:13px;color:${T.ink3}}
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{font:800 clamp(22px,5.4vw,36px) 'JetBrains Mono',monospace;color:${T.navy};text-align:center}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer;transition:transform .2s ease,border-color .2s ease}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option-copy{display:flex;flex-direction:column;gap:5px;min-width:0}.p4-column{white-space:pre;font:800 15px/1.15 'JetBrains Mono',monospace;color:${T.navy}}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok,.p4-state-option.is-ok,.p4-digit-choice.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-no,.p4-state-option.is-no,.p4-digit-choice.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-digits{display:grid;grid-template-columns:repeat(5,minmax(44px,1fr));gap:8px;width:min(360px,100%);margin:0 auto}.p4-digit-choice{min-height:48px;border:1px solid rgba(23,59,82,.14);border-radius:12px;background:${T.paper};font:800 20px 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-digit-choice.is-on,.p4-state-option.is-on{border-color:${T.accent};background:${T.accentSoft}}
.p4-state{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-state-option{min-height:56px;padding:10px;border:1px solid rgba(23,59,82,.12);border-radius:14px;background:${T.paper};font:800 clamp(13px,3vw,17px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(11px,2vw,15px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer;overflow-wrap:anywhere}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:10px;color:${T.success};text-align:center}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font:600 clamp(24px,5vw,34px) 'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options,.p4-state{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:11px;padding:7px}.p4-head{padding-top:54px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before,.p4-root *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;
