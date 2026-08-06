// ============================================================================
// 4-SINF · Dars 6 amaliyoti — Sonlarning xonalari va sinflari
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 6. Практика: разряды и классы чисел', uz: "6-dars. Amaliyot: sonlarning xonalari va sinflari" },
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
    id: '01', kind: 'mc', level: '🟢', figure: '583 016',
    setup: { ru: 'Центру данных нужен полный пакет сведений о числе.', uz: "Ma'lumotlar markaziga son haqidagi to'liq paket kerak." },
    prompt: { ru: 'Какие действия входят в полный пакет?', uz: "To'liq paketga qaysi amallar kiradi?" },
    options: [
      { text: { ru: 'Прочитать, разложить, сравнить и округлить', uz: "O'qish, yoyish, taqqoslash va yaxlitlash" }, correct: true },
      { text: { ru: 'Только прочитать число', uz: "Faqat sonni o'qish" }, wrong: { ru: 'Чтение показывает название, но не проверяет состав, сравнение и нужную точность.', uz: "O'qish nomni ko'rsatadi, ammo tarkib, taqqoslash va kerakli aniqlikni tekshirmaydi." } },
      { text: { ru: 'Сложить все цифры', uz: "Barcha raqamlarni qo'shish" }, wrong: { ru: 'Сумма цифр теряет их разрядные значения и не заменяет пакет действий.', uz: "Raqamlar yig'indisi ularning xona qiymatini yo'qotadi va amallar paketini almashtirmaydi." } },
      { text: { ru: 'Удалить нули и записать короче', uz: "Nollarni olib tashlab, qisqaroq yozish" }, wrong: { ru: 'Удаление нуля сдвигает разряды и меняет число.', uz: "Nolni olib tashlash xonalarni siljitib, sonni o'zgartiradi." } },
    ],
    correctText: { ru: 'Верно. Полный пакет связывает чтение, разрядный состав, сравнение и округление.', uz: "To'g'ri. To'liq paket o'qish, xona tarkibi, taqqoslash va yaxlitlashni bog'laydi." },
    rule: { ru: 'Все действия с многозначным числом опираются на место цифры.', uz: "Ko'p xonali son bilan barcha amallar raqam o'rniga tayanadi." },
  },
  {
    id: '02', kind: 'gap', level: '🟢', number: 47085, correctGap: 3,
    setup: { ru: 'Перед обработкой число нужно разделить на классы.', uz: "Ishlov berishdan oldin sonni sinflarga ajratish kerak." },
    prompt: { ru: 'Поставь границу классов.', uz: "Sinflar chegarasini qo'ying." },
    gapWrong: {
      1: { ru: 'Справа отделена только единица. Класс содержит три разряда.', uz: "O'ngda faqat birlar ajratildi. Sinf uchta xonadan iborat." },
      2: { ru: 'Справа отделены два разряда. Добавь сотни.', uz: "O'ngda ikkita xona ajratildi. Yuzlarni ham qo'shing." },
      4: { ru: 'Справа осталось четыре цифры. Отсчитай три.', uz: "O'ngda to'rtta raqam qoldi. Uchtasini sanang." },
    },
    correctText: { ru: 'Верно: 47 085. Класс единиц записан тремя цифрами.', uz: "To'g'ri: 47 085. Birlar sinfi uchta raqam bilan yozildi." },
    rule: { ru: 'Разбор многозначного числа начинается с группировки справа.', uz: "Ko'p xonali sonni tahlil qilish o'ngdan guruhlash bilan boshlanadi." },
  },
  {
    id: '03', kind: 'match', level: '🟡', figure: '842 307',
    setup: { ru: 'Одно число можно описать несколькими связанными фактами.', uz: "Bitta sonni bir nechta bog'liq ma'lumot bilan tasvirlash mumkin." },
    prompt: { ru: 'Соедини вопрос и ответ.', uz: "Savolni javob bilan moslashtiring." },
    pairs: [
      { id: 'a', left: { ru: 'класс тысяч', uz: 'minglar sinfi' }, right: { ru: '842', uz: '842' } },
      { id: 'b', left: { ru: 'значение цифры 4', uz: '4 raqamining qiymati' }, right: { ru: '40 000', uz: '40 000' } },
      { id: 'c', left: { ru: 'класс единиц', uz: 'birlar sinfi' }, right: { ru: '307', uz: '307' } },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: классы — это группы, а значение цифры зависит от отдельного разряда.', uz: "Birinchi noto'g'ri juftlikni tekshiring: sinflar guruh, raqam qiymati esa alohida xonaga bog'liq." },
    correctText: { ru: 'Верно. Группы 842 и 307 образуют классы, а цифра 4 означает 40 000.', uz: "To'g'ri. 842 va 307 guruhlari sinflarni hosil qiladi, 4 raqami esa 40 000 ni bildiradi." },
    rule: { ru: 'Не смешивай класс, разряд и значение цифры.', uz: "Sinf, xona va raqam qiymatini aralashtirmang." },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '930504', maxLen: 6, figure: '900 000 + 30 000 + 500 + 4',
    setup: { ru: 'Восстанови стандартную запись по разрядным значениям.', uz: "Xona qiymatlari bo'yicha odatiy yozuvni tiklang." },
    prompt: { ru: 'Какое число получится?', uz: "Qaysi son hosil bo'ladi?" },
    hints: [
      { ru: 'Размести цифры 9, 3, 5 и 4 в названных разрядах, остальные места заполни нулями.', uz: "9, 3, 5 va 4 raqamlarini aytilgan xonalarga joylashtiring, qolgan o'rinlarni nol bilan to'ldiring." },
      { ru: 'Сотни тысяч — 9, десятки тысяч — 3, сотни — 5, единицы — 4.', uz: "Yuz minglar 9, o'n minglar 3, yuzlar 5, birlar 4." },
    ],
    correctText: { ru: 'Верно: 930 504. Нули сохранили разряды тысяч и десятков.', uz: "To'g'ri: 930 504. Nollar minglar va o'nlar xonalarini saqladi." },
    rule: { ru: 'Собирай число по шести фиксированным разрядным местам.', uz: "Sonni oltita qat'iy xona o'rni bo'yicha tuzing." },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '60000', maxLen: 5, figure: '461 208',
    setup: { ru: 'Определи значение одной цифры в коде.', uz: "Koddagi bitta raqam qiymatini aniqlang." },
    prompt: { ru: 'Каково значение цифры 6?', uz: '6 raqamining qiymati qancha?' },
    hints: [
      { ru: 'Посчитай места справа от цифры 6.', uz: "6 raqamidan o'ngdagi o'rinlarni sanang." },
      { ru: 'Справа четыре цифры, значит 6 стоит в десятках тысяч.', uz: "O'ngda to'rtta raqam bor, demak 6 o'n minglar xonasida." },
    ],
    correctText: { ru: 'Верно. Цифра 6 означает 60 000.', uz: "To'g'ri. 6 raqami 60 000 ni bildiradi." },
    rule: { ru: 'Значение цифры определяется разрядом, а не её видом.', uz: "Raqam qiymati uning ko'rinishiga emas, xonasiga bog'liq." },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '715 690  ·  715 409',
    setup: { ru: 'Выбери больший показатель и подготовь его для обзорного табло.', uz: "Katta ko'rsatkichni tanlang va uni umumiy tablo uchun tayyorlang." },
    prompt: { ru: 'Какой пакет действий верен?', uz: "Qaysi amallar paketi to'g'ri?" },
    options: [
      { text: { ru: '715 690 больше; до тысяч это 716 000', uz: '715 690 katta; minglikkacha 716 000' }, correct: true },
      { text: { ru: '715 409 больше; до тысяч это 715 000', uz: '715 409 katta; minglikkacha 715 000' }, wrong: { ru: 'Первая разница в сотнях: 6 больше 4, поэтому больше 715 690.', uz: "Birinchi farq yuzlarda: 6 soni 4 dan katta, shuning uchun 715 690 kattaroq." } },
      { text: { ru: '715 690 больше; до тысяч это 715 000', uz: '715 690 katta; minglikkacha 715 000' }, wrong: { ru: 'Сравнение верно, но округление нет: 6 сотен ведут к 716 000.', uz: "Taqqoslash to'g'ri, ammo yaxlitlash noto'g'ri: 6 yuzlik 716 000 ga olib boradi." } },
      { text: { ru: 'Числа равны; результат 716 000', uz: 'Sonlar teng; natija 716 000' }, wrong: { ru: 'Числа различаются в сотнях, поэтому не равны.', uz: "Sonlar yuzlar xonasida farq qiladi, shuning uchun teng emas." } },
    ],
    correctText: { ru: 'Верно. Сначала выбрано 715 690, затем оно округлено вверх до 716 000.', uz: "To'g'ri. Avval 715 690 tanlandi, keyin u 716 000 gacha yuqoriga yaxlitlandi." },
    rule: { ru: 'В составной задаче проверяй каждый шаг отдельно.', uz: "Murakkab vazifada har bir qadamni alohida tekshiring." },
  },
  {
    id: '07', kind: 'match', level: '🟡', figure: '206 784',
    setup: { ru: 'Подбери результат для трёх разных запросов.', uz: "Uch xil so'rov uchun natijani tanlang." },
    prompt: { ru: 'Соедини действие с результатом.', uz: "Amalni natija bilan moslashtiring." },
    pairs: [
      { id: 'a', left: { ru: 'класс тысяч', uz: 'minglar sinfi' }, right: { ru: '206', uz: '206' } },
      { id: 'b', left: { ru: 'значение цифры 8', uz: '8 raqamining qiymati' }, right: { ru: '80', uz: '80' } },
      { id: 'c', left: { ru: 'до сотен', uz: 'yuzlikkacha' }, right: { ru: '206 800', uz: '206 800' } },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: группа, значение цифры и округление отвечают на разные вопросы.', uz: "Birinchi noto'g'ri juftlikni tekshiring: guruh, raqam qiymati va yaxlitlash turli savollarga javob beradi." },
    correctText: { ru: 'Верно. Для каждого запроса выбрано подходящее представление числа.', uz: "To'g'ri. Har bir so'rov uchun sonning mos ko'rinishi tanlandi." },
    rule: { ru: 'Сначала определи задачу, затем выбирай модель числа.', uz: "Avval vazifani aniqlang, keyin son modelini tanlang." },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '809 995 → ?',
    setup: { ru: 'При округлении до десятков перенос проходит через несколько девяток.', uz: "O'nlikkacha yaxlitlashda ko'chirish bir nechta to'qqiz orqali o'tadi." },
    prompt: { ru: 'Каков результат?', uz: 'Natija qancha?' },
    options: [
      { text: { ru: '810 000', uz: '810 000' }, correct: true },
      { text: { ru: '809 990', uz: '809 990' }, wrong: { ru: 'В единицах стоит 5, поэтому десятки должны увеличиться.', uz: "Birlar xonasida 5, shuning uchun o'nlar oshishi kerak." } },
      { text: { ru: '809 100', uz: '809 100' }, wrong: { ru: 'Перенос не останавливается внутри цепочки девяток. Он достигает тысяч.', uz: "Ko'chirish to'qqizlar zanjiri ichida to'xtamaydi. U minglar xonasigacha yetadi." } },
      { text: { ru: '800 000', uz: '800 000' }, wrong: { ru: 'Так потерялись десятки тысяч. Перенос создаёт 810 000.', uz: "Bunda o'n minglar yo'qoldi. Ko'chirish 810 000 ni hosil qiladi." } },
    ],
    correctText: { ru: 'Верно. Пять округляет вверх, перенос проходит через 99 и даёт 810 000.', uz: "To'g'ri. Besh yuqoriga yaxlitlaydi, ko'chirish 99 orqali o'tib, 810 000 ni beradi." },
    rule: { ru: 'Перенос продолжается через все соседние девятки.', uz: "Ko'chirish barcha qo'shni to'qqizlar orqali davom etadi." },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '640 205 → 64 205',
    setup: { ru: 'При сокращении записи оператор удалил внутренний ноль.', uz: "Yozuvni qisqartirishda operator ichki nolni olib tashladi." },
    prompt: { ru: 'Что изменилось?', uz: "Nima o'zgardi?" },
    options: [
      { text: { ru: 'Старшие цифры сдвинулись вправо, и число стало в десять раз меньше', uz: "Katta raqamlar o'ngga siljib, son o'n marta kichraydi" }, correct: true },
      { text: { ru: 'Изменилась только запись, значение осталось тем же', uz: "Faqat yozuv o'zgardi, qiymat o'sha qoldi" }, wrong: { ru: 'После удаления нуля цифры 6 и 4 заняли другие разряды, поэтому значение изменилось.', uz: "Nol olib tashlangach, 6 va 4 boshqa xonalarni egalladi, shuning uchun qiymat o'zgardi." } },
      { text: { ru: 'Число стало в десять раз больше', uz: "Son o'n marta kattalashdi" }, wrong: { ru: 'Удаление разряда сдвигает цифры вправо и уменьшает их значения.', uz: "Xonani olib tashlash raqamlarni o'ngga siljitib, ularning qiymatini kamaytiradi." } },
      { text: { ru: 'Изменился только класс единиц', uz: "Faqat birlar sinfi o'zgardi" }, wrong: { ru: 'Сдвиг затронул старшие разряды: 640 тысяч превратились в 64 тысячи.', uz: "Siljish katta xonalarga ta'sir qildi: 640 ming 64 mingga aylandi." } },
    ],
    correctText: { ru: 'Верно. 640 205 превратилось в 64 205, потому что ноль удерживал разряд тысяч.', uz: "To'g'ri. Nol minglar xonasini saqlagani uchun 640 205 soni 64 205 ga aylandi." },
    rule: { ru: 'Внутренний ноль нельзя удалять: он сохраняет места цифр.', uz: "Ichki nolni olib tashlab bo'lmaydi: u raqamlar o'rnini saqlaydi." },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '307 450',
    setup: { ru: 'Выбери полностью согласованный пакет данных.', uz: "To'liq mos keladigan ma'lumotlar paketini tanlang." },
    prompt: { ru: 'Какой вариант верен во всех четырёх частях?', uz: "Qaysi variantning to'rtta qismi ham to'g'ri?" },
    options: [
      { text: { ru: '307 000 + 400 + 50; > 307 405; до сотен 307 500', uz: '307 000 + 400 + 50; > 307 405; yuzlikkacha 307 500' }, correct: true },
      { text: { ru: '300 000 + 7 000 + 450; < 307 405; до сотен 307 400', uz: '300 000 + 7 000 + 450; < 307 405; yuzlikkacha 307 400' }, wrong: { ru: 'Разложение равно исходному числу, но сравнение и округление неверны: 450 больше 405, а десятки 5 ведут вверх.', uz: "Yoyiq yozuv boshlang'ich songa teng, ammo taqqoslash va yaxlitlash noto'g'ri: 450 soni 405 dan katta, o'nlardagi 5 yuqoriga olib boradi." } },
      { text: { ru: '300 000 + 70 000 + 450; > 307 405; до сотен 307 500', uz: '300 000 + 70 000 + 450; > 307 405; yuzlikkacha 307 500' }, wrong: { ru: 'Цифра 7 стоит в тысячах, а не в десятках тысяч. Первое слагаемое пакета неверно.', uz: "7 raqami o'n minglarda emas, minglar xonasida turibdi. Paketdagi birinchi yoyiq yozuv noto'g'ri." } },
      { text: { ru: '307 000 + 45; > 307 405; до сотен 307 500', uz: '307 000 + 45; > 307 405; yuzlikkacha 307 500' }, wrong: { ru: 'Слагаемое 45 ставит цифры 4 и 5 в десятки и единицы, а нужны сотни и десятки.', uz: "45 qo'shiluvchisi 4 va 5 ni o'nlar va birlarga qo'yadi, yuzlar va o'nlar kerak." } },
    ],
    correctText: { ru: 'Верно. Разложение, сравнение и округление согласованы с разрядами числа 307 450.', uz: "To'g'ri. Yoyiq yozuv, taqqoslash va yaxlitlash 307 450 sonining xonalari bilan mos." },
    rule: { ru: 'Полный пакет верен только тогда, когда правильна каждая его часть.', uz: "To'liq paket faqat uning har bir qismi to'g'ri bo'lsa, to'g'ri hisoblanadi." },
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

export default function Grade4Dars06Practice({ lang: langProp, onFinished }) {
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
      onFinished?.({ lessonId: 'num-4-06-practice', totalQuestions: 10, correctAnswers: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100) });
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
