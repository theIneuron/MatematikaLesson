// ============================================================================
// 4-SINF · Dars 6 amaliyoti — Sonlarning xonalari va sinflari
// Dars01Practice vizual/texnik etaloni asosida: 10 topshiriq, UZ/RU/EN, ovozsiz.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { PRACTICE_FIX_CSS } from './grade4PracticeFixStyles.js';

const T = {
  bg: '#F5F5F0', paper: '#FFFFFF', ink: '#12212C', ink2: '#50616D', ink3: '#87949D',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', success: '#227A53', successSoft: '#E7F3EC', warn: '#A96F13', warnSoft: '#FFF5D9',
};

const UI = {
  title: { ru: 'Урок 6. Практика: разряды и классы чисел', uz: "6-dars. Amaliyot: sonlarning xonalari va sinflari", en: 'Lesson 6. Practice: place value and number classes' },
  task: { ru: 'Задание', uz: 'Topshiriq' , en: "Task"}, check: { ru: 'Проверить', uz: 'Tekshirish' , en: "Check"},
  next: { ru: 'Следующее', uz: 'Keyingisi' , en: "Next"}, again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Try again' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling' , en: "Remember"}, retry: { ru: 'Проверить ещё раз', uz: 'Yana bir tekshiring' , en: "Check again"},
  chooseGap: { ru: 'Нажми на место границы между классами', uz: 'Sinflar chegarasi joyiga bosing' , en: "Tap where the boundary between the three-digit groups belongs"},
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting' , en: "Enter your answer"}, clear: { ru: 'Стереть', uz: "O'chirish", en: 'Delete' },
  matchHint: { ru: 'Сначала выбери строку слева, затем пару справа', uz: "Avval chapdagi qatorni, keyin o'ngdagi juftini tanlang" , en: "First choose a row on the left, then its match on the right"},
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi' , en: "Practice complete"}, ofTen: { ru: 'из 10', uz: '10 dan' , en: "out of 10"},
};

const LESSON_META = {
  lessonId: 'num-4-06-practice',
  lessonTitle: UI.title,
  skillTags: ['place-value', 'number-comparison', 'rounding', 'expanded-form'],
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
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
    id: '01', kind: 'mc', level: '🟢', figure: '583 016',
    setup: { ru: 'Центру данных нужен полный пакет сведений о числе.', uz: "Ma'lumotlar markaziga son haqidagi to'liq paket kerak.", en: 'The data centre needs a complete set of information about the number.' },
    prompt: { ru: 'Какие действия входят в полный пакет?', uz: "To'liq paketga qaysi amallar kiradi?", en: 'Which actions belong in the complete set?' },
    options: [
      { text: { ru: 'Прочитать, разложить, сравнить и округлить', uz: "O'qish, yoyish, taqqoslash va yaxlitlash", en: 'Read, partition, compare and round it' }, correct: true },
      { text: { ru: 'Только прочитать число', uz: "Faqat sonni o'qish", en: 'Only read the number' }, wrong: { ru: 'Чтение показывает название, но не проверяет состав, сравнение и нужную точность.', uz: "O'qish nomni ko'rsatadi, ammo tarkib, taqqoslash va kerakli aniqlikni tekshirmaydi.", en: 'Reading gives the number name, but it does not check its parts, comparison or required precision.' } },
      { text: { ru: 'Сложить все цифры', uz: "Barcha raqamlarni qo'shish", en: 'Add all the digits' }, wrong: { ru: 'Сумма цифр теряет их разрядные значения и не заменяет пакет действий.', uz: "Raqamlar yig'indisi ularning xona qiymatini yo'qotadi va amallar paketini almashtirmaydi.", en: 'Adding the digits loses their place values and does not replace the complete set of actions.' } },
      { text: { ru: 'Удалить нули и записать короче', uz: "Nollarni olib tashlab, qisqaroq yozish", en: 'Remove the zeroes and write it more briefly' }, wrong: { ru: 'Удаление нуля сдвигает разряды и меняет число.', uz: "Nolni olib tashlash xonalarni siljitib, sonni o'zgartiradi.", en: 'Removing a zero shifts the place values and changes the number.' } },
    ],
    correctText: { ru: 'Верно. Полный пакет связывает чтение, разрядный состав, сравнение и округление.', uz: "To'g'ri. To'liq paket o'qish, xona tarkibi, taqqoslash va yaxlitlashni bog'laydi.", en: 'Correct. The complete set links reading, place-value partitioning, comparison and rounding.' },
    rule: { ru: 'Все действия с многозначным числом опираются на место цифры.', uz: "Ko'p xonali son bilan barcha amallar raqam o'rniga tayanadi.", en: 'Every action with a multi-digit number depends on each digit\'s place.' },
  },
  {
    id: '02', kind: 'gap', level: '🟢', number: 47085, correctGap: 3,
    setup: { ru: 'Перед обработкой число нужно разделить на классы.', uz: "Ishlov berishdan oldin sonni sinflarga ajratish kerak.", en: 'Before using the number, split it into three-digit groups.' },
    prompt: { ru: 'Поставь границу классов.', uz: "Sinflar chegarasini qo'ying." , en: "Mark the boundary between the three-digit groups."},
    gapWrong: {
      1: { ru: 'Справа отделена только единица. Класс содержит три разряда.', uz: "O'ngda faqat birlar ajratildi. Sinf uchta xonadan iborat.", en: 'Only the ones digit is separated on the right. A group contains three places.' },
      2: { ru: 'Справа отделены два разряда. Добавь сотни.', uz: "O'ngda ikkita xona ajratildi. Yuzlarni ham qo'shing.", en: 'Two places are separated on the right. Include the hundreds place too.' },
      4: { ru: 'Справа осталось четыре цифры. Отсчитай три.', uz: "O'ngda to'rtta raqam qoldi. Uchtasini sanang.", en: 'Four digits remain on the right. Count back three.' },
    },
    correctText: { ru: 'Верно: 47 085. Класс единиц записан тремя цифрами.', uz: "To'g'ri: 47 085. Birlar sinfi uchta raqam bilan yozildi.", en: 'Correct: 47 085. The ones group is written with three digits.' },
    rule: { ru: 'Разбор многозначного числа начинается с группировки справа.', uz: "Ko'p xonali sonni tahlil qilish o'ngdan guruhlash bilan boshlanadi.", en: 'Start analysing a multi-digit number by grouping from the right.' },
  },
  {
    id: '03', kind: 'match', level: '🟡', figure: '842 307',
    setup: { ru: 'Одно число можно описать несколькими связанными фактами.', uz: "Bitta sonni bir nechta bog'liq ma'lumot bilan tasvirlash mumkin.", en: 'One number can be described by several connected facts.' },
    prompt: { ru: 'Соедини вопрос и ответ.', uz: "Savolni javob bilan moslashtiring.", en: 'Match each question to its answer.' },
    pairs: [
      { id: 'a', left: { ru: 'класс тысяч', uz: 'minglar sinfi', en: 'thousands group' }, right: { ru: '842', uz: '842' , en: "842"} },
      { id: 'b', left: { ru: 'значение цифры 4', uz: '4 raqamining qiymati', en: 'value of the digit 4' }, right: { ru: '40 000', uz: '40 000' , en: "40 000"} },
      { id: 'c', left: { ru: 'класс единиц', uz: 'birlar sinfi', en: 'ones group' }, right: { ru: '307', uz: '307' , en: "307"} },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: классы — это группы, а значение цифры зависит от отдельного разряда.', uz: "Birinchi noto'g'ri juftlikni tekshiring: sinflar guruh, raqam qiymati esa alohida xonaga bog'liq.", en: 'Check the first incorrect match: groups contain digits, while a digit\'s value depends on its individual place.' },
    correctText: { ru: 'Верно. Группы 842 и 307 образуют классы, а цифра 4 означает 40 000.', uz: "To'g'ri. 842 va 307 guruhlari sinflarni hosil qiladi, 4 raqami esa 40 000 ni bildiradi.", en: 'Correct. The groups 842 and 307 form the number groups, and the digit 4 represents 40 000.' },
    rule: { ru: 'Не смешивай класс, разряд и значение цифры.', uz: "Sinf, xona va raqam qiymatini aralashtirmang.", en: 'Do not confuse a group, a place and a digit\'s value.' },
  },
  {
    id: '04', kind: 'numpad', level: '🟡', answer: '930504', maxLen: 6, figure: '900 000 + 30 000 + 500 + 4',
    setup: { ru: 'Восстанови стандартную запись по разрядным значениям.', uz: "Xona qiymatlari bo'yicha odatiy yozuvni tiklang.", en: 'Rebuild the standard form from the place values.' },
    prompt: { ru: 'Какое число получится?', uz: "Qaysi son hosil bo'ladi?", en: 'What number do they make?' },
    hints: [
      { ru: 'Размести цифры 9, 3, 5 и 4 в названных разрядах, остальные места заполни нулями.', uz: "9, 3, 5 va 4 raqamlarini aytilgan xonalarga joylashtiring, qolgan o'rinlarni nol bilan to'ldiring.", en: 'Put the digits 9, 3, 5 and 4 in the named places, then fill the remaining places with zeroes.' },
      { ru: 'Сотни тысяч — 9, десятки тысяч — 3, сотни — 5, единицы — 4.', uz: "Yuz minglar 9, o'n minglar 3, yuzlar 5, birlar 4.", en: 'There are 9 hundred thousands, 3 ten thousands, 5 hundreds and 4 ones.' },
    ],
    correctText: { ru: 'Верно: 930 504. Нули сохранили разряды тысяч и десятков.', uz: "To'g'ri: 930 504. Nollar minglar va o'nlar xonalarini saqladi.", en: 'Correct: 930 504. The zeroes keep the thousands and tens places.' },
    rule: { ru: 'Собирай число по шести фиксированным разрядным местам.', uz: "Sonni oltita qat'iy xona o'rni bo'yicha tuzing.", en: 'Build the number using all six fixed place-value positions.' },
  },
  {
    id: '05', kind: 'numpad', level: '🟡', answer: '60000', maxLen: 5, figure: '461 208',
    setup: { ru: 'Определи значение одной цифры в коде.', uz: "Koddagi bitta raqam qiymatini aniqlang.", en: 'Find the value of one digit in the code.' },
    prompt: { ru: 'Каково значение цифры 6?', uz: '6 raqamining qiymati qancha?', en: 'What is the value of the digit 6?' },
    hints: [
      { ru: 'Посчитай места справа от цифры 6.', uz: "6 raqamidan o'ngdagi o'rinlarni sanang.", en: 'Count the places to the right of the digit 6.' },
      { ru: 'Справа четыре цифры, значит 6 стоит в десятках тысяч.', uz: "O'ngda to'rtta raqam bor, demak 6 o'n minglar xonasida.", en: 'There are four digits to its right, so 6 is in the ten-thousands place.' },
    ],
    correctText: { ru: 'Верно. Цифра 6 означает 60 000.', uz: "To'g'ri. 6 raqami 60 000 ni bildiradi.", en: 'Correct. The digit 6 represents 60 000.' },
    rule: { ru: 'Значение цифры определяется разрядом, а не её видом.', uz: "Raqam qiymati uning ko'rinishiga emas, xonasiga bog'liq.", en: 'A digit\'s value is determined by its place, not by the digit alone.' },
  },
  {
    id: '06', kind: 'mc', level: '🟡', figure: '715 690  ·  715 409',
    setup: { ru: 'Выбери больший показатель и подготовь его для обзорного табло.', uz: "Katta ko'rsatkichni tanlang va uni umumiy tablo uchun tayyorlang.", en: 'Choose the greater value and prepare it for the summary display.' },
    prompt: { ru: 'Какой пакет действий верен?', uz: "Qaysi amallar paketi to'g'ri?", en: 'Which set of actions is correct?' },
    options: [
      { text: { ru: '715 690 больше; до тысяч это 716 000', uz: '715 690 katta; minglikkacha 716 000', en: '715 690 is greater; to the nearest thousand it is 716 000' }, correct: true },
      { text: { ru: '715 409 больше; до тысяч это 715 000', uz: '715 409 katta; minglikkacha 715 000', en: '715 409 is greater; to the nearest thousand it is 715 000' }, wrong: { ru: 'Первая разница в сотнях: 6 больше 4, поэтому больше 715 690.', uz: "Birinchi farq yuzlarda: 6 soni 4 dan katta, shuning uchun 715 690 kattaroq.", en: 'The first difference is in the hundreds: 6 is greater than 4, so 715 690 is greater.' } },
      { text: { ru: '715 690 больше; до тысяч это 715 000', uz: '715 690 katta; minglikkacha 715 000', en: '715 690 is greater; to the nearest thousand it is 715 000' }, wrong: { ru: 'Сравнение верно, но округление нет: 6 сотен ведут к 716 000.', uz: "Taqqoslash to'g'ri, ammo yaxlitlash noto'g'ri: 6 yuzlik 716 000 ga olib boradi.", en: 'The comparison is correct, but the rounding is not: 6 hundreds rounds the number up to 716 000.' } },
      { text: { ru: 'Числа равны; результат 716 000', uz: 'Sonlar teng; natija 716 000', en: 'The numbers are equal; the result is 716 000' }, wrong: { ru: 'Числа различаются в сотнях, поэтому не равны.', uz: "Sonlar yuzlar xonasida farq qiladi, shuning uchun teng emas.", en: 'The numbers differ in the hundreds place, so they are not equal.' } },
    ],
    correctText: { ru: 'Верно. Сначала выбрано 715 690, затем оно округлено вверх до 716 000.', uz: "To'g'ri. Avval 715 690 tanlandi, keyin u 716 000 gacha yuqoriga yaxlitlandi.", en: 'Correct. First 715 690 is selected, then it is rounded up to 716 000.' },
    rule: { ru: 'В составной задаче проверяй каждый шаг отдельно.', uz: "Murakkab vazifada har bir qadamni alohida tekshiring.", en: 'In a multi-step task, check each step separately.' },
  },
  {
    id: '07', kind: 'match', level: '🟡', figure: '206 784',
    setup: { ru: 'Подбери результат для трёх разных запросов.', uz: "Uch xil so'rov uchun natijani tanlang.", en: 'Choose the result for each of three different requests.' },
    prompt: { ru: 'Соедини действие с результатом.', uz: "Amalni natija bilan moslashtiring.", en: 'Match each action to its result.' },
    pairs: [
      { id: 'a', left: { ru: 'класс тысяч', uz: 'minglar sinfi', en: 'thousands group' }, right: { ru: '206', uz: '206' , en: "206"} },
      { id: 'b', left: { ru: 'значение цифры 8', uz: '8 raqamining qiymati', en: 'value of the digit 8' }, right: { ru: '80', uz: '80' , en: "80"} },
      { id: 'c', left: { ru: 'до сотен', uz: 'yuzlikkacha', en: 'to the nearest hundred' }, right: { ru: '206 800', uz: '206 800' , en: "206 800"} },
    ],
    wrongText: { ru: 'Проверь первую неверную пару: группа, значение цифры и округление отвечают на разные вопросы.', uz: "Birinchi noto'g'ri juftlikni tekshiring: guruh, raqam qiymati va yaxlitlash turli savollarga javob beradi.", en: 'Check the first incorrect match: a group, a digit\'s value and rounding answer different questions.' },
    correctText: { ru: 'Верно. Для каждого запроса выбрано подходящее представление числа.', uz: "To'g'ri. Har bir so'rov uchun sonning mos ko'rinishi tanlandi.", en: 'Correct. Each request is matched to the right representation of the number.' },
    rule: { ru: 'Сначала определи задачу, затем выбирай модель числа.', uz: "Avval vazifani aniqlang, keyin son modelini tanlang.", en: 'First identify the task, then choose the number model.' },
  },
  {
    id: '08', kind: 'mc', level: '🔴', figure: '809 995 → ?',
    setup: { ru: 'При округлении до десятков перенос проходит через несколько девяток.', uz: "O'nlikkacha yaxlitlashda ko'chirish bir nechta to'qqiz orqali o'tadi.", en: 'When rounding to the nearest ten, the regrouping passes through several nines.' },
    prompt: { ru: 'Каков результат?', uz: 'Natija qancha?', en: 'What is the result?' },
    options: [
      { text: { ru: '810 000', uz: '810 000' , en: "810 000"}, correct: true },
      { text: { ru: '809 990', uz: '809 990' , en: "809 990"}, wrong: { ru: 'В единицах стоит 5, поэтому десятки должны увеличиться.', uz: "Birlar xonasida 5, shuning uchun o'nlar oshishi kerak.", en: 'The ones digit is 5, so the tens must increase.' } },
      { text: { ru: '809 100', uz: '809 100' , en: "809 100"}, wrong: { ru: 'Перенос не останавливается внутри цепочки девяток. Он достигает тысяч.', uz: "Ko'chirish to'qqizlar zanjiri ichida to'xtamaydi. U minglar xonasigacha yetadi.", en: 'The regrouping does not stop inside the chain of nines. It reaches the thousands.' } },
      { text: { ru: '800 000', uz: '800 000' , en: "800 000"}, wrong: { ru: 'Так потерялись десятки тысяч. Перенос создаёт 810 000.', uz: "Bunda o'n minglar yo'qoldi. Ko'chirish 810 000 ni hosil qiladi.", en: 'This loses the ten thousands. The regrouping produces 810 000.' } },
    ],
    correctText: { ru: 'Верно. Пять округляет вверх, перенос проходит через 99 и даёт 810 000.', uz: "To'g'ri. Besh yuqoriga yaxlitlaydi, ko'chirish 99 orqali o'tib, 810 000 ni beradi.", en: 'Correct. Five rounds up, and the regrouping passes through both nines to give 810 000.' },
    rule: { ru: 'Перенос продолжается через все соседние девятки.', uz: "Ko'chirish barcha qo'shni to'qqizlar orqali davom etadi.", en: 'Regrouping continues through every neighbouring nine.' },
  },
  {
    id: '09', kind: 'mc', level: '🔴', figure: '640 205 → 64 205',
    setup: { ru: 'При сокращении записи оператор удалил внутренний ноль.', uz: "Yozuvni qisqartirishda operator ichki nolni olib tashladi.", en: 'While shortening the notation, an operator removed an internal zero.' },
    prompt: { ru: 'Что изменилось?', uz: "Nima o'zgardi?", en: 'What changed?' },
    options: [
      { text: { ru: 'Старшие цифры сдвинулись вправо, и число стало в десять раз меньше', uz: "Katta raqamlar o'ngga siljib, son o'n marta kichraydi", en: 'The leading digits shifted right, so the number became ten times smaller' }, correct: true },
      { text: { ru: 'Изменилась только запись, значение осталось тем же', uz: "Faqat yozuv o'zgardi, qiymat o'sha qoldi", en: 'Only the notation changed; the value stayed the same' }, wrong: { ru: 'После удаления нуля цифры 6 и 4 заняли другие разряды, поэтому значение изменилось.', uz: "Nol olib tashlangach, 6 va 4 boshqa xonalarni egalladi, shuning uchun qiymat o'zgardi.", en: 'After the zero was removed, the digits 6 and 4 moved to different places, so the value changed.' } },
      { text: { ru: 'Число стало в десять раз больше', uz: "Son o'n marta kattalashdi", en: 'The number became ten times greater' }, wrong: { ru: 'Удаление разряда сдвигает цифры вправо и уменьшает их значения.', uz: "Xonani olib tashlash raqamlarni o'ngga siljitib, ularning qiymatini kamaytiradi.", en: 'Removing a place shifts the digits right and reduces their values.' } },
      { text: { ru: 'Изменился только класс единиц', uz: "Faqat birlar sinfi o'zgardi", en: 'Only the ones group changed' }, wrong: { ru: 'Сдвиг затронул старшие разряды: 640 тысяч превратились в 64 тысячи.', uz: "Siljish katta xonalarga ta'sir qildi: 640 ming 64 mingga aylandi.", en: 'The shift affected the leading places: 640 thousand became 64 thousand.' } },
    ],
    correctText: { ru: 'Верно. 640 205 превратилось в 64 205, потому что ноль удерживал разряд тысяч.', uz: "To'g'ri. Nol minglar xonasini saqlagani uchun 640 205 soni 64 205 ga aylandi.", en: 'Correct. 640 205 became 64 205 because the zero had been holding the thousands place.' },
    rule: { ru: 'Внутренний ноль нельзя удалять: он сохраняет места цифр.', uz: "Ichki nolni olib tashlab bo'lmaydi: u raqamlar o'rnini saqlaydi.", en: 'Do not remove an internal zero: it preserves the digits\' places.' },
  },
  {
    id: '10', kind: 'mc', level: '🔴', figure: '307 450',
    setup: { ru: 'Выбери полностью согласованный пакет данных.', uz: "To'liq mos keladigan ma'lumotlar paketini tanlang.", en: 'Choose the completely consistent set of information.' },
    prompt: { ru: 'Какой вариант верен во всех четырёх частях?', uz: "Qaysi variantning to'rtta qismi ham to'g'ri?", en: 'Which option is correct in every part?' },
    options: [
      { text: { ru: '307 000 + 400 + 50; > 307 405; до сотен 307 500', uz: '307 000 + 400 + 50; > 307 405; yuzlikkacha 307 500', en: '307 000 + 400 + 50; > 307 405; to the nearest hundred: 307 500' }, correct: true },
      { text: { ru: '300 000 + 7 000 + 450; < 307 405; до сотен 307 400', uz: '300 000 + 7 000 + 450; < 307 405; yuzlikkacha 307 400', en: '300 000 + 7 000 + 450; < 307 405; to the nearest hundred: 307 400' }, wrong: { ru: 'Разложение равно исходному числу, но сравнение и округление неверны: 450 больше 405, а десятки 5 ведут вверх.', uz: "Yoyiq yozuv boshlang'ich songa teng, ammo taqqoslash va yaxlitlash noto'g'ri: 450 soni 405 dan katta, o'nlardagi 5 yuqoriga olib boradi.", en: 'The partition equals the original number, but the comparison and rounding are wrong: 450 is greater than 405, and 5 tens rounds up.' } },
      { text: { ru: '300 000 + 70 000 + 450; > 307 405; до сотен 307 500', uz: '300 000 + 70 000 + 450; > 307 405; yuzlikkacha 307 500', en: '300 000 + 70 000 + 450; > 307 405; to the nearest hundred: 307 500' }, wrong: { ru: 'Цифра 7 стоит в тысячах, а не в десятках тысяч. Первое слагаемое пакета неверно.', uz: "7 raqami o'n minglarda emas, minglar xonasida turibdi. Paketdagi birinchi yoyiq yozuv noto'g'ri.", en: 'The digit 7 is in the thousands place, not the ten-thousands place. The first partition in the set is wrong.' } },
      { text: { ru: '307 000 + 45; > 307 405; до сотен 307 500', uz: '307 000 + 45; > 307 405; yuzlikkacha 307 500', en: '307 000 + 45; > 307 405; to the nearest hundred: 307 500' }, wrong: { ru: 'Слагаемое 45 ставит цифры 4 и 5 в десятки и единицы, а нужны сотни и десятки.', uz: "45 qo'shiluvchisi 4 va 5 ni o'nlar va birlarga qo'yadi, yuzlar va o'nlar kerak.", en: 'The term 45 puts the digits 4 and 5 in the tens and ones places, but they belong in the hundreds and tens places.' } },
    ],
    correctText: { ru: 'Верно. Разложение, сравнение и округление согласованы с разрядами числа 307 450.', uz: "To'g'ri. Yoyiq yozuv, taqqoslash va yaxlitlash 307 450 sonining xonalari bilan mos.", en: 'Correct. The partition, comparison and rounding all match the place values of 307 450.' },
    rule: { ru: 'Полный пакет верен только тогда, когда правильна каждая его часть.', uz: "To'liq paket faqat uning har bir qismi to'g'ri bo'lsa, to'g'ri hisoblanadi.", en: 'A complete set is correct only when every part of it is correct.' },
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
  // Xato javobdan keyin qayta aralashadi: `wrongRound` o'sadi.
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const options = useMemo(() => (task.kind === 'mc' ? shuffle(task.options) : []), [task, wrongRound]);
  const rightPairs = useMemo(() => task.kind === 'match' ? shuffle(task.pairs) : [], [task]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const feedbackRef = useRef(null);

  // Javobning to'g'riligi `checked` dan ALOHIDA hisoblanadi: tekshirish
  // tugmasi bosilganda xato bo'lsa variantlarni qayta aralashtirish kerak.
  const answerCorrect = (
    (task.kind === 'mc' && picked?.correct === true)
    || (task.kind === 'gap' && gap === task.correctGap)
    || (task.kind === 'numpad' && typed === task.answer)
    || (task.kind === 'match' && task.pairs.every((pair, i) => pairs[i] === pair.id))
  );
  const solved = checked && answerCorrect;
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

      {checked && <Feedback feedbackRef={feedbackRef} ok={solved} text={tx(solved ? task.correctText : wrongText, lang)} rule={task.rule} lang={lang} />}

      <div className="p4-actions">
        {!solved && <button type="button" className="p4-btn" disabled={!canCheck} onClick={() => { setChecked(true); setAttempts((n) => n + 1); if (!answerCorrect) setWrongRound((old) => old + 1); }}>{tx(UI.check, lang)}</button>}
        {checked && !solved && <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>{tx(UI.retry, lang)}</button>}
        {solved && <button type="button" className="p4-btn p4-btn-ready" onClick={() => onSolved(attempts === 1)}>{tx(UI.next, lang)}</button>}
      </div>
    </div>
  );
}

export default function Grade4Dars06Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? previewLang : normalizeLang(langProp);
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
      onFinished?.({
        lessonId: LESSON_META.lessonId,
        lessonTitle: tx(LESSON_META.lessonTitle, lang),
        totalQuestions: 10,
        correctAnswers: nextFirstTry,
        scorePercent: Math.round((nextFirstTry / 10) * 100),
      });
    } else setIndex((old) => old + 1);
  };

  return (
    <div className="p4-root">
      <style>{STYLES + PRACTICE_FIX_CSS}</style>
      {preview && <div className="p4-lang">{SUPPORTED_LANGS.map((code) => <button key={code} type="button" className={code === lang ? 'is-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}
      <header className="p4-head">
        <div className="p4-progress"><div className="p4-progress-bar" style={{ width: `${percent}%` }} /></div>
        <div className="p4-head-row"><span className="p4-title">{tx(UI.title, lang)}</span><span className="p4-counter">{finished ? 10 : index + 1} / 10</span></div>
      </header>
      <main className="p4-main">
        {finished ? <div className="p4-done">
          <h2>{tx(UI.done, lang)}</h2><p className="p4-score"><b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span></p>
          <p className="p4-note">{tx({
            uz: "Birinchi urinishda to'g'ri bajarilgan topshiriqlar soni.",
            ru: 'Столько заданий решено с первой попытки.',
            en: 'The number of tasks answered correctly on the first attempt.',
          }, lang)}</p>
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
