// ============================================================================
// 4-SINF · Dars 4 amaliyoti — Ko'p xonali sonlarni taqqoslash
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, RU/UZ, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 4. Практика: сравнение чисел', uz: "4-dars. Amaliyot: sonlarni taqqoslash", en: 'Lesson 4. Practice: comparing numbers' },
  task: { ru: 'Задание', uz: 'Topshiriq' , en: "Task"}, check: { ru: 'Проверить', uz: 'Tekshirish' , en: "Check"},
  next: { ru: 'Следующее', uz: 'Keyingisi' , en: "Next"}, again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Start again' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling' , en: "Remember"}, retry: { ru: 'Проверить ещё раз', uz: 'Yana bir tekshiring' , en: "Check again"},
  chooseGap: { ru: 'Нажми на место границы между классами', uz: 'Sinflar chegarasi joyiga bosing' , en: "Tap where the boundary between the three-digit groups belongs"},
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting' , en: "Enter your answer"}, clear: { ru: 'Стереть', uz: "O'chirish", en: 'Clear' },
  matchHint: { ru: 'Сначала выбери строку слева, затем пару справа', uz: "Avval chapdagi qatorni, keyin o'ngdagi juftini tanlang" , en: "First choose a row on the left, then its match on the right"},
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi' , en: "Practice complete"}, ofTen: { ru: 'из 10', uz: '10 dan' , en: "out of 10"},
};

const LESSON_META = {
  lessonId: 'num-4-04-practice',
  lessonTitle: UI.title,
  skillTags: ['number-comparison', 'ordering', 'number-line'],
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const tx = (node, lang) => (node && typeof node === 'object' ? (node[lang] ?? node.uz) : node);
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
    id: '01', kind: 'mc', level: '🟢', figure: '384 729 ? 384 692',
    setup: { ru: 'Сравни два близких показания.', uz: "Bir-biriga yaqin ikkita ko'rsatkichni taqqoslang.", en: 'Compare two close readings.' },
    prompt: { ru: 'Какой знак нужно поставить?', uz: "Qaysi belgini qo'yish kerak?", en: 'Which sign should be used?' },
    options: [
      { text: { ru: '>', uz: '>' , en: ">"}, correct: true },
      { text: { ru: '<', uz: '<' , en: "<"}, wrong: { ru: 'Сотни тысяч, десятки тысяч и тысячи равны. В сотнях 7 больше 6.', uz: "Yuz minglar, o'n minglar va minglar teng. Yuzlar xonasida 7 soni 6 dan katta.", en: 'The hundred thousands, ten thousands and thousands are equal. In the hundreds place, 7 is greater than 6.' } },
      { text: { ru: '=', uz: '=' , en: "="}, wrong: { ru: 'Числа отличаются в разряде сотен: 7 и 6.', uz: "Sonlar yuzlar xonasida farq qiladi: 7 va 6.", en: 'The numbers differ in the hundreds place: 7 and 6.' } },
      { text: { ru: 'Сравнить нельзя', uz: "Taqqoslab bo'lmaydi", en: 'They cannot be compared' }, wrong: { ru: 'У чисел одинаковое количество разрядов, их можно сравнить слева направо.', uz: "Sonlarning xonalari soni teng, ularni chapdan o'ngga taqqoslash mumkin.", en: 'The numbers have the same number of digits, so they can be compared from left to right.' } },
    ],
    correctText: { ru: 'Верно: 384 729 > 384 692. Первая разница находится в сотнях.', uz: "To'g'ri: 384 729 > 384 692. Birinchi farq yuzlar xonasida.", en: 'Correct: 384,729 > 384,692. The first difference is in the hundreds place.' },
    rule: { ru: 'При равном количестве цифр найди первую разницу слева.', uz: "Raqamlar soni teng bo'lsa, chapdan birinchi farqni toping.", en: 'When numbers have the same number of digits, find the first difference from the left.' },
  },
  {
    id: '02', kind: 'mc', level: '🟢', figure: '99 845 ? 100 102',
    setup: { ru: 'Одно число пятизначное, другое шестизначное.', uz: "Bir son besh xonali, ikkinchisi olti xonali.", en: 'One number has five digits and the other has six.' },
    prompt: { ru: 'Какое сравнение верно?', uz: "Qaysi taqqoslash to'g'ri?", en: 'Which comparison is correct?' },
    options: [
      { text: { ru: '99 845 < 100 102', uz: '99 845 < 100 102' , en: "99 845 < 100 102"}, correct: true },
      { text: { ru: '99 845 > 100 102', uz: '99 845 > 100 102' , en: "99 845 > 100 102"}, wrong: { ru: 'Большее первое число не определяется цифрой 9. Шестизначное число больше любого пятизначного.', uz: "Birinchi sondagi 9 uning kattaligini bildirmaydi. Olti xonali son har qanday besh xonali sondan katta.", en: 'The first digit 9 does not make the first number greater. Any six-digit number is greater than any five-digit number.' } },
      { text: { ru: '99 845 = 100 102', uz: '99 845 = 100 102' , en: "99 845 = 100 102"}, wrong: { ru: 'У чисел разное количество разрядов, поэтому они не равны.', uz: "Sonlarning xonalari soni turlicha, shuning uchun ular teng emas.", en: 'The numbers have different numbers of digits, so they are not equal.' } },
      { text: { ru: 'Нужно сравнить последние цифры', uz: "Oxirgi raqamlarni taqqoslash kerak", en: 'Compare the last digits' }, wrong: { ru: 'Последние цифры не решают сравнение, когда количество разрядов разное.', uz: "Xonalar soni turlicha bo'lganda oxirgi raqamlar taqqoslashni hal qilmaydi.", en: 'The last digits do not decide the comparison when the numbers have different numbers of digits.' } },
    ],
    correctText: { ru: 'Верно. Шестизначное число 100 102 больше пятизначного 99 845.', uz: "To'g'ri. 100 102 olti xonali son 99 845 besh xonali sondan katta.", en: 'Correct. The six-digit number 100,102 is greater than the five-digit number 99,845.' },
    rule: { ru: 'Сначала сравни количество цифр.', uz: "Avval raqamlar sonini taqqoslang.", en: 'Compare the number of digits first.' },
  },
  {
    id: '03', kind: 'mc', level: '🟡', figure: '250 980  ─────  251 003',
    setup: { ru: 'На числовой линии большее число находится правее.', uz: "Sonlar chizig'ida katta son o'ngroqda joylashadi.", en: 'The greater number is farther right on a number line.' },
    prompt: { ru: 'Какое число будет правее?', uz: "Qaysi son o'ngroqda bo'ladi?", en: 'Which number will be farther right?' },
    options: [
      { text: { ru: '251 003', uz: '251 003' , en: "251 003"}, correct: true },
      { text: { ru: '250 980', uz: '250 980' , en: "250 980"}, wrong: { ru: 'В тысячах у второго числа 1, а у первого 0. Первая разница делает второе число больше.', uz: "Ikkinchi sonda minglar xonasida 1, birinchisida 0 turibdi. Birinchi farq ikkinchi sonni katta qiladi.", en: 'The second number has 1 in the thousands place, while the first has 0. This first difference makes the second number greater.' } },
      { text: { ru: 'Они займут одно место', uz: "Ular bir joyni egallaydi", en: 'They will occupy the same point' }, wrong: { ru: 'Числа отличаются в разряде тысяч, поэтому точки не совпадут.', uz: "Sonlar minglar xonasida farq qiladi, shuning uchun nuqtalar ustma-ust tushmaydi.", en: 'The numbers differ in the thousands place, so their points will not coincide.' } },
      { text: { ru: 'Положение зависит от последней цифры', uz: "Joylashuv oxirgi raqamga bog'liq", en: 'The position depends on the last digit' }, wrong: { ru: 'Положение определяет всё число, а сравнение начинается со старших разрядов.', uz: "Joylashuvni butun son belgilaydi, taqqoslash katta xonalardan boshlanadi.", en: 'The whole number determines the position, and comparison starts with the highest places.' } },
    ],
    correctText: { ru: 'Верно. 251 003 больше 250 980 и находится правее.', uz: "To'g'ri. 251 003 soni 250 980 dan katta va o'ngroqda joylashadi.", en: 'Correct. 251,003 is greater than 250,980 and lies farther right.' },
    rule: { ru: 'Правее на числовой линии находится большее число.', uz: "Sonlar chizig'ida katta son o'ngroqda joylashadi.", en: 'The greater number is farther right on a number line.' },
  },
  {
    id: '04', kind: 'order', level: '🟡',
    setup: { ru: 'Городские показатели нужно расположить от большего к меньшему.', uz: "Shahar ko'rsatkichlarini kattadan kichikka joylashtirish kerak.", en: 'Arrange the city readings from greatest to least.' },
    prompt: { ru: 'Составь порядок убывания.', uz: "Kamayish tartibini tuzing.", en: 'Build the descending order.' },
    items: [
      { id: 'a', text: { ru: '641 205', uz: '641 205' , en: "641 205"} },
      { id: 'b', text: { ru: '641 250', uz: '641 250' , en: "641 250"} },
      { id: 'c', text: { ru: '640 999', uz: '640 999' , en: "640 999"} },
    ],
    answer: ['b', 'a', 'c'],
    wrongText: { ru: 'Проверь первую неверную позицию: сравни тысячи, затем сотни, десятки и единицы.', uz: "Birinchi noto'g'ri o'rinni tekshiring: minglar, keyin yuzlar, o'nlar va birlarni taqqoslang.", en: 'Check the first incorrect position: compare thousands, then hundreds, tens and ones.' },
    correctText: { ru: 'Верно: 641 250, 641 205, 640 999. На каждой позиции использована первая разница слева.', uz: "To'g'ri: 641 250, 641 205, 640 999. Har bir o'rinda chapdan birinchi farq ishlatildi.", en: 'Correct: 641,250, 641,205, 640,999. Each position was decided by the first difference from the left.' },
    rule: { ru: 'Для порядка повторяй сравнение первой различающейся цифры.', uz: "Tartiblashda birinchi farqli raqam bo'yicha taqqoslashni takrorlang.", en: 'To order numbers, repeatedly compare the first differing digit.' },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '8', maxLen: 1, figure: '587 420 < 58□ 420 < 589 420',
    setup: { ru: 'В среднем числе пропущена одна цифра.', uz: "O'rtadagi sonda bitta raqam tushib qolgan.", en: 'One digit is missing from the middle number.' },
    prompt: { ru: 'Какая цифра подходит?', uz: "Qaysi raqam mos keladi?", en: 'Which digit fits?' },
    hints: [
      { ru: 'Все числа начинаются одинаково. Сравни пропущенный разряд тысяч.', uz: "Barcha sonlar bir xil boshlanadi. Tushib qolgan minglar xonasini taqqoslang.", en: 'All the numbers start the same way. Compare the missing thousands digit.' },
      { ru: 'Цифра должна быть больше 7 и меньше 9. Между ними только одно целое число.', uz: "Raqam 7 dan katta va 9 dan kichik bo'lishi kerak. Ularning orasida faqat bitta butun son bor.", en: 'The digit must be greater than 7 and less than 9. There is only one whole number between them.' },
    ],
    correctText: { ru: 'Верно. Получается 588 420, и оно находится между двумя границами.', uz: "To'g'ri. 588 420 hosil bo'ladi va u ikki chegara orasida joylashadi.", en: 'Correct. The number is 588,420, which lies between the two boundaries.' },
    rule: { ru: 'В двойном неравенстве проверь обе границы.', uz: "Qo'sh tengsizlikda ikkala chegarani tekshiring.", en: 'Check both boundaries in a double inequality.' },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '305 608  ·  305 680',
    setup: { ru: 'Две станции передали объём запаса воды.', uz: "Ikki stansiya suv zaxirasi hajmini yubordi.", en: 'Two stations reported their water reserves.' },
    prompt: { ru: 'На какой станции показатель больше?', uz: "Qaysi stansiyada ko'rsatkich katta?", en: 'Which station has the greater reading?' },
    options: [
      { text: { ru: 'На второй: 305 680', uz: 'Ikkinchisida: 305 680', en: 'The second: 305,680' }, correct: true },
      { text: { ru: 'На первой: 305 608', uz: 'Birinchisida: 305 608', en: 'The first: 305,608' }, wrong: { ru: 'Последняя цифра 8 больше 0, но сравнение решается раньше: в десятках 0 меньше 8.', uz: "Oxirgi 8 raqami 0 dan katta, ammo taqqoslash oldinroq hal bo'ladi: o'nlarda 0 soni 8 dan kichik.", en: 'The final digit 8 is greater than 0, but the comparison is decided earlier: in the tens place, 0 is less than 8.' } },
      { text: { ru: 'Показатели равны', uz: "Ko'rsatkichlar teng", en: 'The readings are equal' }, wrong: { ru: 'Числа отличаются в десятках: 0 и 8.', uz: "Sonlar o'nlar xonasida farq qiladi: 0 va 8.", en: 'The numbers differ in the tens place: 0 and 8.' } },
      { text: { ru: 'Нужно сложить цифры', uz: "Raqamlarni qo'shish kerak", en: 'Add the digits' }, wrong: { ru: 'Сумма цифр не сохраняет разрядное значение. Сравни числа слева направо.', uz: "Raqamlar yig'indisi xona qiymatini saqlamaydi. Sonlarni chapdan o'ngga taqqoslang.", en: 'The sum of the digits does not preserve place value. Compare the numbers from left to right.' } },
    ],
    correctText: { ru: 'Верно. Первая разница — в десятках: 8 больше 0, значит 305 680 больше.', uz: "To'g'ri. Birinchi farq o'nlarda: 8 soni 0 dan katta, demak 305 680 kattaroq.", en: 'Correct. The first difference is in the tens place: 8 is greater than 0, so 305,680 is greater.' },
    rule: { ru: 'После первой разницы младшие разряды уже не меняют результат.', uz: "Birinchi farqdan keyin kichik xonalar natijani o'zgartirmaydi.", en: 'After the first difference, lower places cannot change the result.' },
  },
  {
    id: '07', kind: 'match', level: '🟡',
    setup: { ru: 'Распредели три числа по местам от большего к меньшему.', uz: "Uchta sonni kattadan kichikka o'rinlarga ajrating.", en: 'Assign the three numbers positions from greatest to least.' },
    prompt: { ru: 'Соедини число с его местом.', uz: "Sonni uning o'rni bilan moslashtiring.", en: 'Match each number to its position.' },
    pairs: [
      { id: 'a', left: { ru: '720 041', uz: '720 041' , en: "720 041"}, right: { ru: '1-е место', uz: "1-o'rin", en: '1st place' } },
      { id: 'b', left: { ru: '720 014', uz: '720 014' , en: "720 014"}, right: { ru: '2-е место', uz: "2-o'rin", en: '2nd place' } },
      { id: 'c', left: { ru: '719 998', uz: '719 998' , en: "719 998"}, right: { ru: '3-е место', uz: "3-o'rin", en: '3rd place' } },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: сначала отдели число с классом тысяч 719, затем сравни 041 и 014.', uz: "Birinchi noto'g'ri juftlikni tekshiring: avval minglar sinfi 719 bo'lgan sonni ajrating, keyin 041 va 014 ni taqqoslang.", en: 'Check the first incorrect pair: separate the number in the 719-thousand group, then compare 041 and 014.' },
    correctText: { ru: 'Верно. 720 041 > 720 014 > 719 998.', uz: "To'g'ri. 720 041 > 720 014 > 719 998.", en: 'Correct. 720,041 > 720,014 > 719,998.' },
    rule: { ru: 'При сортировке сравнивай каждую соседнюю пару.', uz: "Tartiblashda har bir qo'shni juftlikni taqqoslang.", en: 'When ordering numbers, compare each neighbouring pair.' },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '430 070 ? 430 070',
    setup: { ru: 'Все шесть разрядов двух чисел совпадают.', uz: "Ikki sonning barcha olti xonasi bir xil.", en: 'All six places of the two numbers match.' },
    prompt: { ru: 'Какой знак нужен?', uz: "Qaysi belgi kerak?", en: 'Which sign is needed?' },
    options: [
      { text: { ru: '=', uz: '=' , en: "="}, correct: true },
      { text: { ru: '>', uz: '>' , en: ">"}, wrong: { ru: 'Ни в одном разряде первое число не больше второго.', uz: "Hech bir xonada birinchi son ikkinchisidan katta emas.", en: 'The first number is not greater in any place.' } },
      { text: { ru: '<', uz: '<' , en: "<"}, wrong: { ru: 'Ни в одном разряде первое число не меньше второго.', uz: "Hech bir xonada birinchi son ikkinchisidan kichik emas.", en: 'The first number is not smaller in any place.' } },
      { text: { ru: 'Знак не нужен', uz: "Belgi kerak emas", en: 'No sign is needed' }, wrong: { ru: 'Равные числа обозначаются знаком равенства.', uz: "Teng sonlar tenglik belgisi bilan ko'rsatiladi.", en: 'Equal numbers are shown with the equals sign.' } },
    ],
    correctText: { ru: 'Верно. Все разряды совпадают, поэтому числа равны.', uz: "To'g'ri. Barcha xonalar bir xil, shuning uchun sonlar teng.", en: 'Correct. Every place matches, so the numbers are equal.' },
    rule: { ru: 'Если различий нет ни в одном разряде, числа равны.', uz: "Hech bir xonada farq bo'lmasa, sonlar teng.", en: 'If no place differs, the numbers are equal.' },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '612 408 > 612 490',
    setup: { ru: 'Бит выбрал знак по последней цифре: 8 больше 0.', uz: "Bit belgini oxirgi raqam bo'yicha tanladi: 8 soni 0 dan katta.", en: 'Bit chose the sign using the last digit: 8 is greater than 0.' },
    prompt: { ru: 'Почему вывод неверен?', uz: "Nega xulosa noto'g'ri?", en: 'Why is the conclusion incorrect?' },
    options: [
      { text: { ru: 'Нужно остановиться на первой разнице слева: 0 < 9 в десятках', uz: "Chapdan birinchi farqda to'xtash kerak: o'nlarda 0 < 9", en: 'Stop at the first difference from the left: 0 < 9 in the tens place' }, correct: true },
      { text: { ru: 'Нужно сложить цифры обоих чисел', uz: "Ikkala son raqamlarini qo'shish kerak", en: 'Add the digits of both numbers' }, wrong: { ru: 'Сумма цифр не учитывает их места и не является правилом сравнения.', uz: "Raqamlar yig'indisi ularning o'rnini hisobga olmaydi va taqqoslash qoidasi emas.", en: 'The sum of the digits ignores their positions and is not a comparison rule.' } },
      { text: { ru: 'Числа равны, потому что первые три цифры одинаковы', uz: "Birinchi uchta raqam teng bo'lgani uchun sonlar teng", en: 'The numbers are equal because the first three digits match' }, wrong: { ru: 'После одинаковых старших разрядов сравнение продолжается до первой разницы.', uz: "Katta xonalar teng bo'lsa, taqqoslash birinchi farqqacha davom etadi.", en: 'After equal higher places, continue comparing until the first difference.' } },
      { text: { ru: 'Знак выбран правильно', uz: "Belgi to'g'ri tanlangan", en: 'The sign is correct' }, wrong: { ru: 'Число 612 408 меньше 612 490, потому что в десятках 0 меньше 9.', uz: "612 408 soni 612 490 dan kichik, chunki o'nlarda 0 soni 9 dan kichik.", en: '612,408 is less than 612,490 because 0 is less than 9 in the tens place.' } },
    ],
    correctText: { ru: 'Верно. Правильная запись: 612 408 < 612 490.', uz: "To'g'ri. To'g'ri yozuv: 612 408 < 612 490.", en: 'Correct. The correct comparison is 612,408 < 612,490.' },
    rule: { ru: 'Последняя цифра учитывается только если все старшие разряды равны.', uz: "Oxirgi raqam faqat barcha katta xonalar teng bo'lsa hisobga olinadi.", en: 'The final digit matters only if all higher places are equal.' },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '808 090  ·  808 009  ·  807 999',
    setup: { ru: 'Выбери полный порядок городских данных.', uz: "Shahar ma'lumotlarining to'liq tartibini tanlang.", en: 'Choose the complete order of the city data.' },
    prompt: { ru: 'Какая последовательность убывает?', uz: "Qaysi ketma-ketlik kamayib boradi?", en: 'Which sequence is descending?' },
    options: [
      { text: { ru: '808 090 > 808 009 > 807 999', uz: '808 090 > 808 009 > 807 999' , en: "808 090 > 808 009 > 807 999"}, correct: true },
      { text: { ru: '807 999 > 808 009 > 808 090', uz: '807 999 > 808 009 > 808 090' , en: "807 999 > 808 009 > 808 090"}, wrong: { ru: 'Это возрастающий порядок. Сначала должно стоять число с большим классом тысяч.', uz: "Bu o'sish tartibi. Avval minglar sinfi katta bo'lgan son turishi kerak.", en: 'This is ascending order. The number with the greater thousands group should come first.' } },
      { text: { ru: '808 009 > 808 090 > 807 999', uz: '808 009 > 808 090 > 807 999' , en: "808 009 > 808 090 > 807 999"}, wrong: { ru: 'У первых двух чисел сравни десятки: 9 больше 0, поэтому 808 090 больше.', uz: "Birinchi ikki sonda o'nlarni taqqoslang: 9 soni 0 dan katta, shuning uchun 808 090 kattaroq.", en: 'Compare the tens in the first two numbers: 9 is greater than 0, so 808,090 is greater.' } },
      { text: { ru: '808 090 > 807 999 > 808 009', uz: '808 090 > 807 999 > 808 009' , en: "808 090 > 807 999 > 808 009"}, wrong: { ru: 'Число 808 009 больше любого числа из группы 807 тысяч.', uz: "808 009 soni 807 minglar guruhidagi har qanday sondan katta.", en: '808,009 is greater than any number in the 807-thousand group.' } },
    ],
    correctText: { ru: 'Верно. Сначала сравнились классы тысяч, затем десятки в группе 808.', uz: "To'g'ri. Avval minglar sinfi, keyin 808 guruhidagi o'nlar taqqoslandi.", en: 'Correct. First compare the thousands groups, then the tens within the 808 group.' },
    rule: { ru: 'Для полного порядка последовательно применяй один алгоритм сравнения.', uz: "To'liq tartib uchun bir xil taqqoslash algoritmini izchil qo'llang.", en: 'Use the same comparison algorithm consistently to build the complete order.' },
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
  // Xato javobdan keyin variantlar qayta aralashadi (metodist qarori 2026-08-21).
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => task.kind === 'mc' ? shuffle(task.options) : [], [task, wrongRound]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
  const orderItems = useMemo(() => task.kind === 'order' ? shuffle(task.items) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [order, setOrder] = useState([]);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const feedbackRef = useRef(null);

  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirishda
  // xato bo'lsa variantlar qayta aralashtiriladi.
  const answerCorrect = (
    (task.kind === 'mc' && picked?.correct === true)
    || (task.kind === 'gap' && gap === task.correctGap)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
    || (task.kind === 'order' && task.answer.every((id, i) => order[i] === id))
  );
  const solved = checked && answerCorrect;
  const canCheck = (task.kind === 'mc' && picked !== null)
    || (task.kind === 'gap' && gap !== null)
    || (task.kind === 'numpad' && typed !== '')
    || (task.kind === 'match' && Object.keys(pairs).length === task.pairs.length)
    || (task.kind === 'order' && order.length === task.items.length);
  const firstMatchWrong = task.kind === 'match' && checked
    ? task.pairs.findIndex((pair, i) => pairs[i] !== pair.id)
    : -1;
  const firstOrderWrong = task.kind === 'order' && checked
    ? task.answer.findIndex((id, i) => order[i] !== id)
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
    if (task.kind === 'mc') return picked?.wrong;
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
    if (task.kind === 'order') setOrder([]);
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
          className={`p4-option ${picked === option ? (checked ? (option.correct ? 'is-ok' : 'is-no') : 'is-on') : ''}`}
          disabled={solved}
          onClick={() => { setPicked(option); setChecked(false); }}
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

      {task.kind === 'order' && <div className="p4-order">
        <div className="p4-order-pool">{orderItems.map((item) => (
          <button key={item.id} type="button" className="p4-order-item" disabled={solved || order.includes(item.id)} onClick={() => { setOrder((old) => [...old, item.id]); setChecked(false); }}>{tx(item.text, lang)}</button>
        ))}</div>
        <div className="p4-order-row" aria-label={tx(task.prompt, lang)}>{task.items.map((_, index) => {
          const id = order[index];
          const item = task.items.find((entry) => entry.id === id);
          const wrong = firstOrderWrong === index;
          return <button key={index} type="button" className={`p4-order-slot ${wrong ? 'is-no' : id ? 'is-filled' : ''}`} disabled={!id || solved} onClick={() => { setOrder((old) => old.filter((entry) => entry !== id)); setChecked(false); }}><small>{index + 1}</small>{item ? tx(item.text, lang) : '—'}</button>;
        })}</div>
      </div>}

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); if (!answerCorrect) setWrongRound((old) => old + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={() => onSolved(attempts === 1)}>{tx(UI.next, lang)}</button>}
      </div>
    </div>
  );
}

export default function Grade4Dars04Practice({ lang: langProp, onFinished }) {
  const normalizedLang = normalizeLang(langProp);
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? previewLang : normalizedLang;
  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const advancedRef = useRef(-1);
  const finishedRef = useRef(false);
  const task = TASKS[index];
  const percent = Math.round(((finished ? TASKS.length : index) / TASKS.length) * 100);

  const onSolved = (wasFirstTry) => {
    if (finishedRef.current || advancedRef.current === index) return;
    advancedRef.current = index;
    const nextFirstTry = firstTry + (wasFirstTry ? 1 : 0);
    if (wasFirstTry) setFirstTry(nextFirstTry);
    if (index + 1 === TASKS.length) {
      finishedRef.current = true;
      setFinished(true);
      onFinished?.({ lessonId: LESSON_META.lessonId, lessonTitle: tx(LESSON_META.lessonTitle, lang), totalQuestions: 10, correctAnswers: nextFirstTry, scorePercent: Math.round((nextFirstTry / 10) * 100) });
    } else setIndex((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && <div className="p4-lang">{SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="p4-head">
        <div className="p4-progress"><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div>
        <div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <div className="p4-done">
          <h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{tx({ uz: "Birinchi urinishda to'g'ri bajarilgan topshiriqlar soni.", ru: 'Столько заданий решено с первой попытки.', en: 'Tasks solved correctly on the first try.' }, lang)}</p>
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
.p4-order{display:flex;flex-direction:column;gap:10px}.p4-order-pool,.p4-order-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.p4-order-item,.p4-order-slot{min-height:52px;padding:8px;border:1px solid rgba(23,59,82,.12);border-radius:12px;background:${T.paper};color:${T.navy};font:800 clamp(13px,2.5vw,17px) 'JetBrains Mono',monospace;cursor:pointer}.p4-order-item:disabled{opacity:.35;cursor:default}.p4-order-slot{display:flex;align-items:center;justify-content:center;gap:7px;border-style:dashed}.p4-order-slot small{display:grid;place-items:center;width:22px;height:22px;border-radius:7px;background:${T.cyanSoft};color:${T.cyan}}.p4-order-slot.is-filled{border-style:solid;border-color:${T.accent};background:${T.accentSoft}}.p4-order-slot.is-no{border-color:${T.warn};background:${T.warnSoft}}
.p4-fb{padding:12px 14px;border-radius:14px}.p4-fb.is-ok{background:${T.successSoft};box-shadow:inset 4px 0 0 ${T.success}}.p4-fb.is-no{background:${T.warnSoft};box-shadow:inset 4px 0 0 ${T.warn}}.p4-fb-txt{margin:0;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(14px,2.1vw,16px);line-height:1.45}.p4-rule{margin:8px 0 0;font-size:13px;color:${T.ink2}}
.p4-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px;margin-top:4px}.p4-btn{min-height:46px;padding:10px 22px;border:0;border-radius:12px;background:${T.paper};color:${T.accent};font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 8px 20px -10px rgba(255,91,53,.5),inset 0 0 0 1px rgba(255,91,53,.2)}.p4-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.p4-btn-ready{background:${T.accent};color:#fff}.p4-btn-ghost{background:transparent;color:${T.ink2};box-shadow:none}.p4-done{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 12px;text-align:center}.p4-done h2{margin:0;font-family:'Source Serif 4',Georgia,serif}.p4-score{margin:0;font-family:'JetBrains Mono',monospace}.p4-score b{font-size:clamp(32px,7vw,44px);color:${T.success}}.p4-score span{font-size:14px;color:${T.ink3}}
@media(max-width:520px){.p4-options{grid-template-columns:1fr}.p4-match-cols{gap:8px}.p4-match-item{font-size:12px;padding:7px}}
@media(prefers-reduced-motion:reduce){.p4-root *,.p4-root *::before{transition:none!important;animation:none!important}}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
`;
