// ============================================================================
// 4-SINF · Dars 2 amaliyoti — Ko'p xonali sonlarni o'qish va yozish
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 2. Практика: чтение и запись чисел', uz: "2-dars. Amaliyot: sonlarni o'qish va yozish" },
  task: { ru: 'Задание', uz: 'Topshiriq' }, check: { ru: 'Проверить', uz: 'Tekshirish' },
  next: { ru: 'Следующее', uz: 'Keyingisi' }, again: { ru: 'Пройти заново', uz: 'Qaytadan' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling' }, retry: { ru: 'Проверить ещё раз', uz: 'Yana bir tekshiring' },
  chooseGap: { ru: 'Нажми на место границы между классами', uz: 'Sinflar chegarasi joyiga bosing' },
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting' }, clear: { ru: 'Стереть', uz: "O'chirish" },
  matchHint: { ru: 'Сначала выбери строку слева, затем пару справа', uz: "Avval chapdagi qatorni, keyin o'ngdagi juftini tanlang" },
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
    id: '01', kind: 'mc', level: '🟢', figure: '583 204',
    setup: { ru: 'На табло появился новый адрес.', uz: "Tabloda yangi manzil paydo bo'ldi." },
    prompt: { ru: 'Как правильно прочитать это число?', uz: "Bu son qanday to'g'ri o'qiladi?" },
    options: [
      { text: { ru: 'Пятьсот восемьдесят три тысячи двести четыре', uz: "Besh yuz sakson uch ming ikki yuz to'rt" }, correct: true },
      { text: { ru: 'Пятьсот восемьдесят три тысячи двадцать четыре', uz: "Besh yuz sakson uch ming yigirma to'rt" }, wrong: { ru: 'В классе единиц потерялась сотня. Группа 204 читается как двести четыре.', uz: "Birlar sinfidagi yuzlik yo'qoldi. 204 guruhi ikki yuz to'rt deb o'qiladi." } },
      { text: { ru: 'Пятьдесят восемь тысяч триста двадцать четыре', uz: "Ellik sakkiz ming uch yuz yigirma to'rt" }, wrong: { ru: 'Граница классов сдвинута. Отдели справа ровно три цифры.', uz: "Sinflar chegarasi siljigan. O'ngdan aynan uchta raqamni ajrating." } },
      { text: { ru: 'Пятьсот восемь тысяч триста два', uz: 'Besh yuz sakkiz ming uch yuz ikki' }, wrong: { ru: 'Цифры внутри обоих классов переставлены. Читай каждую тройку слева направо.', uz: "Ikkala sinfdagi raqamlar o'rni almashgan. Har bir uchlikni chapdan o'ngga o'qing." } },
    ],
    correctText: { ru: 'Верно. Сначала читается 583, затем слово тысяч и группа 204.', uz: "To'g'ri. Avval 583, keyin ming so'zi va 204 guruhi o'qiladi." },
    rule: { ru: 'Читай число по классам слева направо.', uz: "Sonni sinflar bo'yicha chapdan o'ngga o'qing." },
  },
  {
    id: '02', kind: 'gap', level: '🟢', number: 76091, correctGap: 3,
    setup: { ru: 'Число записали без пробела.', uz: "Son bo'shliqsiz yozildi." },
    prompt: { ru: 'Поставь границу классов.', uz: "Sinflar chegarasini qo'ying." },
    gapWrong: {
      1: { ru: 'Справа отделена только единица. В классе должно быть три разряда.', uz: "O'ngda faqat birlar ajratildi. Sinfda uchta xona bo'lishi kerak." },
      2: { ru: 'Справа отделены два разряда. Добавь к ним ещё разряд сотен.', uz: "O'ngda ikkita xona ajratildi. Ularga yuzlar xonasini ham qo'shing." },
      4: { ru: 'Справа осталось четыре цифры. Отсчитай ровно три.', uz: "O'ngda to'rtta raqam qoldi. Aynan uchtasini sanang." },
    },
    correctText: { ru: 'Верно: 76 091. Справа сохранены три места класса единиц.', uz: "To'g'ri: 76 091. O'ngda birlar sinfining uchta o'rni saqlandi." },
    rule: { ru: 'Границы классов ставятся через три цифры справа.', uz: "Sinflar chegarasi o'ngdan har uchta raqamdan keyin qo'yiladi." },
  },
  {
    id: '03', kind: 'match', level: '🟡',
    setup: { ru: 'Система получила три числовых адреса.', uz: 'Tizim uchta sonli manzil oldi.' },
    prompt: { ru: 'Соедини число с его чтением.', uz: "Sonni uning o'qilishi bilan moslashtiring." },
    pairs: [
      { id: 'a', left: { ru: '420 017', uz: '420 017' }, right: { ru: 'Четыреста двадцать тысяч семнадцать', uz: "To'rt yuz yigirma ming o'n yetti" } },
      { id: 'b', left: { ru: '603 080', uz: '603 080' }, right: { ru: 'Шестьсот три тысячи восемьдесят', uz: "Olti yuz uch ming sakson" } },
      { id: 'c', left: { ru: '950 006', uz: '950 006' }, right: { ru: 'Девятьсот пятьдесят тысяч шесть', uz: "To'qqiz yuz ellik ming olti" } },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: нули удерживают места, но отдельно не читаются.', uz: "Birinchi noto'g'ri juftlikni tekshiring: nollar o'rinlarni saqlaydi, ammo alohida o'qilmaydi." },
    correctText: { ru: 'Верно. Все три числа прочитаны по классам без потери нулей.', uz: "To'g'ri. Uchala son ham nollarni yo'qotmasdan sinflar bo'yicha o'qildi." },
    rule: { ru: 'Внутренний ноль сохраняется в записи, но не называется отдельно.', uz: "Ichki nol yozuvda saqlanadi, ammo alohida aytilmaydi." },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '802049', maxLen: 6,
    figure: { ru: 'восемьсот две тысячи сорок девять', uz: "sakkiz yuz ikki ming qirq to'qqiz" },
    setup: { ru: 'Запиши голосовой адрес цифрами.', uz: 'Ovozli manzilni raqamlar bilan yozing.' },
    prompt: { ru: 'Какое число прозвучало?', uz: 'Qaysi son aytildi?' },
    hints: [
      { ru: 'Раздели название на класс тысяч и класс единиц.', uz: "Nomni minglar sinfi va birlar sinfiga ajrating." },
      { ru: 'Класс тысяч — 802. Сорок девять занимает в правой группе места 049.', uz: "Minglar sinfi 802. Qirq to'qqiz o'ng guruhda 049 o'rinlarini egallaydi." },
    ],
    correctText: { ru: 'Верно: 802 049. Ноль сохранил разряд сотен в классе единиц.', uz: "To'g'ri: 802 049. Nol birlar sinfidagi yuzlar xonasini saqladi." },
    rule: { ru: 'Каждый неполный правый класс дополняется нулями слева.', uz: "To'liq bo'lmagan o'ng sinf chapdan nollar bilan to'ldiriladi." },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '0', maxLen: 1, figure: '671 _05',
    setup: { ru: 'В записи числа 671 005 пропала одна цифра.', uz: "671 005 sonining yozuvida bitta raqam yo'qoldi." },
    prompt: { ru: 'Какую цифру нужно вернуть?', uz: 'Qaysi raqamni qaytarish kerak?' },
    hints: [
      { ru: 'Справа должно быть три места: сотни, десятки и единицы.', uz: "O'ngda uchta o'rin bo'lishi kerak: yuzlar, o'nlar va birlar." },
      { ru: 'Число оканчивается на пять единиц, поэтому группа единиц записывается как 005.', uz: "Son besh birlik bilan tugaydi, shuning uchun birlar sinfi 005 deb yoziladi." },
    ],
    correctText: { ru: 'Верно. Получилось 671 005, и цифра 5 осталась в единицах.', uz: "To'g'ri. 671 005 hosil bo'ldi va 5 raqami birlar xonasida qoldi." },
    rule: { ru: 'Пустое место внутри числа обозначается нулём.', uz: "Son ichidagi bo'sh o'rin nol bilan belgilanadi." },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: { ru: 'двести тридцать тысяч четырнадцать', uz: "ikki yuz o'ttiz ming o'n to'rt" },
    setup: { ru: 'Диспетчер передал код склада.', uz: 'Dispetcher ombor kodini aytdi.' },
    prompt: { ru: 'Как записать этот код цифрами?', uz: 'Bu kod raqamlar bilan qanday yoziladi?' },
    options: [
      { text: { ru: '230 014', uz: '230 014' }, correct: true },
      { text: { ru: '230 140', uz: '230 140' }, wrong: { ru: 'Группа 140 читается как сто сорок. Нужно сохранить четырнадцать в местах 014.', uz: "140 guruhi bir yuz qirq deb o'qiladi. O'n to'rtni 014 o'rinlarida saqlash kerak." } },
      { text: { ru: '23 014', uz: '23 014' }, wrong: { ru: 'Потерялся ноль в классе тысяч, поэтому двести тридцать превратилось в двадцать три.', uz: "Minglar sinfidagi nol yo'qoldi, shuning uchun ikki yuz o'ttiz yigirma uchga aylandi." } },
      { text: { ru: '203 014', uz: '203 014' }, wrong: { ru: 'Класс тысяч стал двести три. Проверь место десятков в группе 230.', uz: "Minglar sinfi ikki yuz uch bo'lib qoldi. 230 guruhidagi o'nlar o'rnini tekshiring." } },
    ],
    correctText: { ru: 'Верно: 230 014. В правом классе четырнадцать записано как 014.', uz: "To'g'ri: 230 014. O'ng sinfda o'n to'rt 014 ko'rinishida yozildi." },
    rule: { ru: 'После слова тысяч начинай новый класс из трёх мест.', uz: "Ming so'zidan keyin uch o'rinli yangi sinfni boshlang." },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'Проверь связь записи и чтения.', uz: "Yozuv bilan o'qilish orasidagi bog'lanishni tekshiring." },
    prompt: { ru: 'Собери правильные пары.', uz: "To'g'ri juftliklarni tuzing." },
    pairs: [
      { id: 'a', left: { ru: '81 306', uz: '81 306' }, right: { ru: 'Восемьдесят одна тысяча триста шесть', uz: "Sakson bir ming uch yuz olti" } },
      { id: 'b', left: { ru: '406 090', uz: '406 090' }, right: { ru: 'Четыреста шесть тысяч девяносто', uz: "To'rt yuz olti ming to'qson" } },
      { id: 'c', left: { ru: '700 008', uz: '700 008' }, right: { ru: 'Семьсот тысяч восемь', uz: 'Yetti yuz ming sakkiz' } },
    ],
    wrongText: { ru: 'Одна из пар меняет место ненулевой цифры. Прочитай отдельно левую и правую группы.', uz: "Juftliklardan biri noldan farqli raqam o'rnini o'zgartirgan. Chap va o'ng guruhlarni alohida o'qing." },
    correctText: { ru: 'Верно. Каждая запись совпала со своим чтением.', uz: "To'g'ri. Har bir yozuv o'z o'qilishi bilan mos tushdi." },
    rule: { ru: 'Для проверки снова прочитай записанное число по классам.', uz: "Tekshirish uchun yozilgan sonni sinflar bo'yicha qayta o'qing." },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '400 004',
    setup: { ru: 'Между двумя четвёрками стоят четыре нуля.', uz: "Ikki to'rt orasida to'rtta nol turibdi." },
    prompt: { ru: 'Как читается число?', uz: "Son qanday o'qiladi?" },
    options: [
      { text: { ru: 'Четыреста тысяч четыре', uz: "To'rt yuz ming to'rt" }, correct: true },
      { text: { ru: 'Четыреста четыре', uz: "To'rt yuz to'rt" }, wrong: { ru: 'Так читается трёхзначное число 404. Здесь есть отдельный класс тысяч.', uz: "Bunday 404 uch xonali son o'qiladi. Bu yerda alohida minglar sinfi bor." } },
      { text: { ru: 'Сорок тысяч четыре', uz: "Qirq ming to'rt" }, wrong: { ru: 'В классе тысяч цифра 4 стоит в сотнях, поэтому это четыреста тысяч.', uz: "Minglar sinfida 4 yuzlar xonasida turibdi, shuning uchun bu to'rt yuz ming." } },
      { text: { ru: 'Четыреста тысяч сорок', uz: "To'rt yuz ming qirq" }, wrong: { ru: 'Последняя 4 стоит в единицах, а не в десятках.', uz: "Oxirgi 4 o'nlar xonasida emas, birlar xonasida turibdi." } },
    ],
    correctText: { ru: 'Верно. Нули не произносятся, но удерживают цифру 4 в единицах.', uz: "To'g'ri. Nollar aytilmaydi, ammo 4 raqamini birlar xonasida saqlaydi." },
    rule: { ru: 'Нули внутри записи сохраняют разряды числа.', uz: "Yozuv ichidagi nollar son xonalarini saqlaydi." },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '92 370',
    setup: { ru: 'Оператор услышал девяносто две тысячи триста семь, но записал 92 370.', uz: "Operator to'qson ikki ming uch yuz yetti sonini eshitdi, ammo 92 370 deb yozdi." },
    prompt: { ru: 'В чём ошибка?', uz: 'Xato nimada?' },
    options: [
      { text: { ru: 'Цифру 7 сдвинули из единиц в десятки', uz: "7 raqami birlardan o'nlarga siljitilgan" }, correct: true },
      { text: { ru: 'Нужно убрать цифру 0', uz: "0 raqamini olib tashlash kerak" }, wrong: { ru: 'Ноль нужен, чтобы 7 осталась в единицах. Убирать его нельзя.', uz: "7 birlar xonasida qolishi uchun nol kerak. Uni olib tashlab bo'lmaydi." } },
      { text: { ru: 'Класс тысяч должен быть 920', uz: "Minglar sinfi 920 bo'lishi kerak" }, wrong: { ru: 'До слова тысяч прозвучало девяносто две, значит левый класс равен 92.', uz: "Ming so'zidan oldin to'qson ikki aytildi, demak chap sinf 92 ga teng." } },
      { text: { ru: 'Ошибки нет', uz: "Xato yo'q" }, wrong: { ru: 'Запись 92 370 читается как девяносто две тысячи триста семьдесят.', uz: "92 370 yozuvi to'qson ikki ming uch yuz yetmish deb o'qiladi." } },
    ],
    correctText: { ru: 'Верно. Правильная запись — 92 307: ноль удерживает десятки, а 7 остаётся в единицах.', uz: "To'g'ri. To'g'ri yozuv 92 307: nol o'nlar xonasini saqlaydi, 7 esa birlarda qoladi." },
    rule: { ru: 'Обратное чтение помогает заметить сдвиг цифры.', uz: "Qayta o'qish raqam siljishini aniqlashga yordam beradi." },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: { ru: 'пятьсот девять тысяч восемьдесят', uz: "besh yuz to'qqiz ming sakson" },
    setup: { ru: 'Нужно записать адрес и надёжно его проверить.', uz: 'Manzilni yozish va ishonchli tekshirish kerak.' },
    prompt: { ru: 'Какой способ даст правильную запись?', uz: "Qaysi usul to'g'ri yozuvni beradi?" },
    options: [
      { text: { ru: 'Разделить на классы, записать 509 080 и прочитать обратно', uz: "Sinflarga ajratish, 509 080 deb yozish va qayta o'qish" }, correct: true },
      { text: { ru: 'Записать 509 80 и проверить количество цифр', uz: '509 80 deb yozish va raqamlar sonini tekshirish' }, wrong: { ru: 'В правом классе должно быть три места. Проверка только количества цифр не восстанавливает ноль.', uz: "O'ng sinfda uchta o'rin bo'lishi kerak. Faqat raqamlar sonini tekshirish nolni tiklamaydi." } },
      { text: { ru: 'Записать 590 080 и сложить цифры', uz: "590 080 deb yozish va raqamlarni qo'shish" }, wrong: { ru: 'В классе тысяч переставлены 0 и 9. Сумма цифр не проверяет их места.', uz: "Minglar sinfida 0 va 9 o'rni almashgan. Raqamlar yig'indisi ularning o'rnini tekshirmaydi." } },
      { text: { ru: 'Убрать ноль и записать 50 980', uz: 'Nolni olib tashlab, 50 980 deb yozish' }, wrong: { ru: 'Удаление нуля меняет оба класса и значение адреса.', uz: "Nolni olib tashlash ikkala sinf va manzil qiymatini o'zgartiradi." } },
    ],
    correctText: { ru: 'Верно. Запись 509 080 и обратное чтение сохраняют все разряды.', uz: "To'g'ri. 509 080 yozuvi va qayta o'qish barcha xonalarni saqlaydi." },
    rule: { ru: 'Надёжная проверка записи — прочитать число обратно по классам.', uz: "Yozuvni ishonchli tekshirish usuli sonni sinflar bo'yicha qayta o'qishdir." },
  },
];

const NumberStrip = ({ value, picked, onPick, disabled, state }) => {
  const digits = String(value).split('');
  return (
    <div className="p4-strip">
      {digits.map((digit, index) => {
        const gap = digits.length - index - 1;
        return (
          <span className="p4-strip-part" key={`${digit}-${index}`}>
            <span className="p4-digit">{digit}</span>
            {gap > 0 && (
              <button
                type="button"
                className={`p4-gap ${picked === gap ? 'is-placed' : ''} ${picked === gap && state ? `is-${state}` : ''}`}
                disabled={disabled}
                aria-label={String(gap)}
                onClick={() => onPick(gap)}
              ><i /></button>
            )}
          </span>
        );
      })}
    </div>
  );
};

const NumPad = ({ value, setValue, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display">{value ? grouped(value) : '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
        <button key={n} type="button" className="p4-key" disabled={disabled} onClick={() => setValue((old) => old.length >= max ? old : old + n)}>{n}</button>
      ))}
      <button type="button" className="p4-key p4-key-del" disabled={disabled} aria-label={tx(UI.clear, lang)} onClick={() => setValue((old) => old.slice(0, -1))}>⌫</button>
    </div>
  </div>
);

const Feedback = ({ ok, text, rule, lang, feedbackRef }) => (
  <div ref={feedbackRef} className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`} role="status">
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>}
  </div>
);

function Task({ task, lang, onSolved }) {
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const feedbackRef = useRef(null);

  const solved = checked && (
    (task.kind === 'mc' && options[picked]?.correct === true)
    || (task.kind === 'gap' && gap === task.correctGap)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'gap' && gap !== null)
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
    if (task.kind === 'mc') return options[picked]?.wrong;
    if (task.kind === 'gap') return task.gapWrong?.[gap];
    if (task.kind === 'numpad') return task.hints[Math.min(Math.max(attempts - 1, 0), task.hints.length - 1)];
    return task.wrongText;
  })();

  const retry = () => {
    setChecked(false);
    if (task.kind === 'mc') setPicked(null);
    if (task.kind === 'gap') setGap(null);
    if (task.kind === 'numpad') setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
  };

  return (
    <div className="p4-task">
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      <p className="p4-setup">{tx(task.setup, lang)}</p>
      {(task.figure || task.number) && (
        <div className="p4-figure">
          {task.kind === 'gap'
            ? <NumberStrip value={task.number} picked={gap} onPick={(value) => { setGap(value); setChecked(false); }} disabled={solved} state={checked ? (solved ? 'ok' : 'no') : null} />
            : <span className={`p4-bignum ${typeof task.figure === 'object' ? 'is-words' : ''}`}>{tx(task.figure, lang)}</span>}
          {task.kind === 'gap' && <p className="p4-note">{tx(UI.chooseGap, lang)}</p>}
        </div>
      )}
      <h2 className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && <div className="p4-options">{options.map((option, i) => (
        <button
          key={`${task.id}-${i}`}
          type="button"
          className={`p4-option ${picked === i ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          onClick={() => { setPicked(i); setChecked(false); }}
        ><span className="p4-letter">{'ABCD'[i]}</span><span>{tx(option.text, lang)}</span></button>
      ))}</div>}

      {task.kind === 'numpad' && <NumPad value={typed} setValue={(fn) => { setTyped(fn); setChecked(false); }} max={task.maxLen} disabled={solved} lang={lang} />}

      {task.kind === 'match' && <div className="p4-match">
        <p className="p4-note">{tx(UI.matchHint, lang)}</p>
        <div className="p4-match-cols">
          <div className="p4-match-col">{task.pairs.map((pair, i) => (
            <button key={pair.id} type="button" className={`p4-match-item ${activeLeft === i ? 'is-active' : ''} ${pairs[i] ? 'is-tied' : ''} ${firstMatchWrong === i ? 'is-no' : ''}`} disabled={solved} onClick={() => { setActiveLeft(i); setChecked(false); }}>
              {tx(pair.left, lang)}{pairs[i] && <b className="p4-tie">{tx(rightPairs.find((right) => right.id === pairs[i])?.right, lang)}</b>}
            </button>
          ))}</div>
          <div className="p4-match-col">{rightPairs.map((pair) => (
            <button key={pair.id} type="button" className="p4-match-item p4-match-right" disabled={solved || activeLeft === null || Object.values(pairs).includes(pair.id)} onClick={() => {
              if (activeLeft === null) return;
              setPairs((old) => ({ ...old, [activeLeft]: pair.id })); setActiveLeft(null); setChecked(false);
            }}>{tx(pair.right, lang)}</button>
          ))}</div>
        </div>
      </div>}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={() => onSolved(attempts === 1)}>{tx(UI.next, lang)}</button>}
      </div>
    </div>
  );
}

export default function Grade4Dars02Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    if (wasFirstTry) setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      setFinished(true);
      onFinished?.({ lessonId: 'num-4-02-practice', totalQuestions: 10, correctAnswers: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100) });
    } else setIndex((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && <div className="p4-lang">{['ru', 'uz'].map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="p4-head">
        <div className="p4-progress"><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div>
        <div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <div className="p4-done">
          <h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{lang === 'uz' ? "Birinchi urinishda to'g'ri bajarilgan topshiriqlar soni." : 'Столько заданий решено с первой попытки.'}</p>
          <button type="button" className="p4-btn p4-btn-ready" onClick={() => { setIndex(0); setFirstTry(0); setFinished(false); }}>{tx(UI.again, lang)}</button>
        </div> : <Task key={task.id} task={task} lang={lang} onSolved={onSolved} />}
      </main>
    </div>
  );
}

const STYLES = `
.p4-root{position:relative;min-height:100%;padding:0 0 24px;font-family:'Manrope',system-ui,sans-serif;color:${T.ink};background:${T.bg}}
.p4-root *,.p4-root *::before,.p4-root *::after{box-sizing:border-box}.p4-root button:focus-visible{outline:3px solid rgba(22,143,163,.45);outline-offset:3px}
.p4-lang{position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:5}.p4-lang button{min-width:44px;min-height:44px;border:0;border-radius:99px;background:${T.paper};color:${T.ink2};font-weight:800;cursor:pointer;box-shadow:0 4px 12px -8px rgba(23,59,82,.4)}.p4-lang button.is-active{background:${T.accent};color:#fff}
.p4-head{padding:46px clamp(12px,4vw,24px) 8px}.p4-progress{height:6px;border-radius:99px;background:rgba(23,59,82,.12);overflow:hidden}.p4-progress-bar{height:100%;background:linear-gradient(90deg,${T.cyan},${T.accent});transition:width .4s ease}.p4-head-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:8px}.p4-title{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(15px,2.4vw,19px)}.p4-counter{white-space:nowrap;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:${T.ink3}}
.p4-main{max-width:720px;margin:0 auto;padding:4px clamp(12px,4vw,24px)}.p4-task{display:flex;flex-direction:column;gap:12px}.p4-eyebrow{margin:6px 0 0;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${T.accent}}.p4-setup{margin:0;font-size:clamp(14px,2vw,16px);line-height:1.5;color:${T.ink2}}.p4-ask{margin:2px 0 0;font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(17px,2.6vw,21px);line-height:1.25}.p4-note{margin:8px 0 0;font-size:13px;color:${T.ink3}}
.p4-figure{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;background:${T.paper};box-shadow:inset 0 0 0 1px rgba(23,59,82,.08)}.p4-bignum{font-family:'JetBrains Mono',monospace;font-weight:800;font-size:clamp(26px,6vw,40px);color:${T.navy};text-align:center}.p4-bignum.is-words{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(18px,4vw,28px)}
.p4-strip{display:flex;align-items:center;justify-content:center}.p4-strip-part{display:flex;align-items:center}.p4-digit{min-width:clamp(18px,4.5vw,34px);text-align:center;font-family:'JetBrains Mono',monospace;font-weight:800;font-size:clamp(26px,6vw,38px);color:${T.navy}}.p4-gap{display:inline-flex;align-items:center;justify-content:center;width:44px;min-height:46px;padding:0;border:0;background:transparent;cursor:pointer}.p4-gap i{width:3px;height:26px;border-radius:2px;background:rgba(23,59,82,.14)}.p4-gap.is-placed i{height:38px;background:${T.accent}}.p4-gap.is-ok i{background:${T.success}}.p4-gap.is-no i{background:${T.warn}}
.p4-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.p4-option{display:flex;align-items:center;gap:9px;min-height:56px;padding:10px 12px;text-align:left;font-family:inherit;font-weight:700;font-size:clamp(13px,1.9vw,15px);color:${T.ink};background:${T.paper};border:1px solid rgba(23,59,82,.12);border-radius:14px;cursor:pointer}.p4-option:hover:not(:disabled){border-color:rgba(22,143,163,.4);transform:translateY(-2px)}.p4-letter{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:${T.cyanSoft};color:${T.cyan};font:800 11px 'JetBrains Mono',monospace}.p4-option.is-on{border-color:${T.accent};background:${T.accentSoft}}.p4-option.is-ok{border-color:rgba(34,122,83,.4);background:${T.successSoft};color:${T.success}}.p4-option.is-no{border-color:rgba(169,111,19,.4);background:${T.warnSoft};color:${T.warn}}
.p4-pad{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(240px,100%);margin:0 auto;padding:12px;border-radius:18px;background:linear-gradient(155deg,#EDF1F3,#DDE4E8)}.p4-pad-display{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;border:2px solid ${T.accent};border-radius:13px;background:${T.paper};font:800 clamp(20px,4.4vw,26px) 'JetBrains Mono',monospace;color:${T.navy}}.p4-pad-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%}.p4-key{min-height:44px;border:1px solid rgba(23,59,82,.16);border-radius:12px;background:${T.paper};font:800 clamp(18px,3.6vw,22px) 'JetBrains Mono',monospace;color:${T.navy};cursor:pointer}.p4-key-del{background:${T.accentSoft};color:${T.accent}}
.p4-match-cols{display:flex;gap:10px;margin-top:8px}.p4-match-col{display:flex;flex-direction:column;gap:8px;flex:1}.p4-match-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:56px;padding:8px 10px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};font:800 clamp(12px,2.2vw,16px) 'Manrope',sans-serif;color:${T.navy};cursor:pointer}.p4-match-item.is-active{border-color:${T.accent};background:${T.accentSoft}}.p4-match-item.is-tied{border-color:rgba(34,122,83,.35)}.p4-match-item.is-no{border-color:${T.warn};background:${T.warnSoft}}.p4-tie{font-size:11px;color:${T.success}}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:12px;padding:7px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before{transition:none!important;animation:none!important}}
`;
