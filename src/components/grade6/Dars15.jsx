import FractionTheoryLesson from './FractionTheoryLesson.jsx';

const L = (uz, ru) => ({ uz, ru });

const LESSON = {
  id: 'decimal_6_15',
  title: L("Davriy o'nli kasrlar va yaxlitlash", 'Периодические десятичные дроби и округление'),
  scoredScreens: [5, 7, 8, 10, 11, 12, 13],
  decorations: ['0,5', '0,(3)', '0,1(6)', '2,75', '3,46', '0,(27)'],
  slides: [
    {
      type: 'title',
      eyebrow: L('Yangi mavzu', 'Новая тема'),
      title: L("Davriy o'nli kasrlar va yaxlitlash", 'Периодические десятичные дроби и округление'),
      subtitle: L(
        "Bugun takrorlanuvchi raqamlar davrini yozish va o'nli kasrlarni kerakli xonagacha yaxlitlashni o'rganamiz.",
        'Сегодня научимся записывать период повторяющихся цифр и округлять десятичные дроби до нужного разряда.',
      ),
      audio: L(
        "Bugungi mavzu davriy o'nli kasrlar va yaxlitlash. Bugun takrorlanuvchi raqamlar davrini yozish va o'nli kasrlarni kerakli xonagacha yaxlitlashni o'rganamiz.",
        'Тема урока — периодические десятичные дроби и округление. Сегодня научимся записывать период повторяющихся цифр и округлять десятичные дроби до нужного разряда.',
      ),
      visual: { type: 'equation', expression: '1/3 = 0,(3)' },
    },
    {
      type: 'question',
      scored: false,
      eyebrow: L('Kuzatamiz', 'Наблюдаем'),
      title: L("Qaysi yozuvda raqamlar takrorlanmoqda?", 'В какой записи цифры повторяются?'),
      prompt: L("Cheksiz bir xil davom etadigan yozuvni tanlang.", 'Выберите запись, которая бесконечно продолжается одинаково.'),
      intro: L(
        "Nol butun o'ndan besh yozuvi tugaydi. Nol butun, davrda uch yozuvida esa uch raqami to'xtamasdan takrorlanadi. Takrorlanuvchi yozuvni tanlang.",
        'Запись ноль целых пять десятых заканчивается. В записи ноль целых, три в периоде цифра три повторяется без конца. Выберите повторяющуюся запись.',
      ),
      options: ['0,5', '0,(3)', '1,25', '2,4'],
      correct: 1,
      why: [
        L("0,(3) yozuvi 0,3333 va hokazo ketma-ketlikni bildiradi.", 'Запись 0,(3) означает 0,3333 и так далее.'),
        L("Qavs ichidagi 3 raqami cheksiz takrorlanadigan davrdir.", 'Цифра 3 в скобках — бесконечно повторяющийся период.'),
      ],
      wrong: L("Qavs ichida yozilgan raqamlar takrorlanishini eslang.", 'Вспомните, что цифры в скобках повторяются.'),
      visual: {
        type: 'panels',
        panels: [
          { title: L('Tugaydigan', 'Конечная'), lines: ['0,5'] },
          { title: L('Takrorlanadigan', 'Повторяющаяся'), lines: ['0,(3)'] },
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Ta’rif', 'Определение'),
      title: L("Davriy o'nli kasr nima?", 'Что такое периодическая десятичная дробь?'),
      steps: [
        L("Verguldan keyin bir yoki bir nechta raqam cheksiz takrorlansa, bunday yozuv davriy o'nli kasr deyiladi.", 'Если после запятой одна или несколько цифр бесконечно повторяются, такую запись называют периодической десятичной дробью.'),
        L("Takrorlanuvchi raqamlar guruhi kasrning davri deyiladi.", 'Группу повторяющихся цифр называют периодом дроби.'),
        L("Masalan, 0,(27) yozuvida 27 guruhi takrorlanadi: 0,272727 va hokazo.", 'Например, в записи 0,(27) повторяется группа 27: 0,272727 и так далее.'),
      ],
      visual: { type: 'chain', items: ['0,(27)', '0,2727', '0,272727'] },
    },
    {
      type: 'rule',
      eyebrow: L('Yozish qoidasi', 'Правило записи'),
      title: L("Davrni qavs ichida yozamiz", 'Записываем период в скобках'),
      steps: [
        L("Takrorlanish boshlanguncha bo'lgan raqamlar qavsdan oldin yoziladi.", 'Цифры до начала повторения записывают перед скобками.'),
        L("Eng qisqa takrorlanuvchi raqamlar guruhi qavs ichiga olinadi.", 'Наименьшую повторяющуюся группу цифр заключают в скобки.'),
        L("0,1666 va hokazo yozuvi 0,1(6) ko'rinishida yoziladi: 1 takrorlanmaydi, 6 esa davr.", 'Запись 0,1666 и так далее записывают как 0,1(6): цифра 1 не повторяется, а 6 является периодом.'),
      ],
      visual: {
        type: 'steps',
        items: [
          L('Takrorlanish boshlanishini toping', 'Найдите начало повторения'),
          L('Eng qisqa davrni ajrating', 'Выделите кратчайший период'),
          L('Davrni qavsga oling', 'Заключите период в скобки'),
        ],
      },
    },
    {
      type: 'info',
      eyebrow: L('Oddiy kasrdan', 'Из обыкновенной дроби'),
      title: L("Bo'lish tugashi yoki takrorlanishi mumkin", 'Деление может завершиться или повторяться'),
      steps: [
        L("1/4 ni o'nli kasrga aylantirsak 0,25 hosil bo'ladi; bu tugaydigan o'nli kasr.", 'При переводе 1/4 в десятичную дробь получаем 0,25; это конечная десятичная дробь.'),
        L("1/3 ni bo'lishda qoldiq yana takrorlanadi va 0,3333 davom etadi.", 'При делении 1/3 остаток повторяется и запись 0,3333 продолжается.'),
        L("Shuning uchun 1/3 = 0,(3), 1/6 = 0,1(6).", 'Поэтому 1/3 = 0,(3), а 1/6 = 0,1(6).'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('Tugaydi', 'Конечная'), lines: ['1/4 = 0,25'] },
          { title: L('Davriy', 'Периодическая'), lines: ['1/3 = 0,(3)', '1/6 = 0,1(6)'] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Davrni toping', 'Найдите период'),
      title: L("0,272727... sonining davri qaysi?", 'Каков период числа 0,272727...?'),
      prompt: L("Eng qisqa takrorlanuvchi guruhni tanlang.", 'Выберите кратчайшую повторяющуюся группу.'),
      intro: L(
        "Nol butun, yigirma yetti takrorlanadigan yozuvda ikki va yetti raqamlari juft holda qayta kelmoqda. Eng qisqa takrorlanuvchi guruhni tanlang.",
        'В записи ноль целых, где повторяется двадцать семь, цифры два и семь снова появляются парой. Выберите кратчайшую повторяющуюся группу.',
      ),
      options: ['2', '7', '27', '272'],
      correct: 2,
      why: [
        L("Yozuv 27, 27, 27 guruhlaridan tuzilgan.", 'Запись состоит из групп 27, 27, 27.'),
        L("Eng qisqa takrorlanuvchi guruh 27, demak yozuv 0,(27).", 'Кратчайшая повторяющаяся группа — 27, значит запись имеет вид 0,(27).'),
      ],
      wrong: L("Raqamlarni eng qisqa bir xil guruhlarga ajrating.", 'Разбейте цифры на кратчайшие одинаковые группы.'),
      fact: L("Davr bitta raqamdan ham, bir nechta raqamdan ham iborat bo'lishi mumkin.", 'Период может состоять как из одной, так и из нескольких цифр.'),
      factVisual: '0,(27) = 0,272727...',
      visual: { type: 'cards', items: ['27', '27', '27'], highlight: 1 },
    },
    {
      type: 'info',
      eyebrow: L('Yaxlitlash g‘oyasi', 'Идея округления'),
      title: L("Yaxlitlash — yaqin qulay sonni tanlash", 'Округление — выбор близкого удобного числа'),
      steps: [
        L("Yaxlitlashda qaysi xonagacha sonni saqlash kerakligini aniqlaymiz.", 'При округлении определяем разряд, до которого нужно сохранить число.'),
        L("Saqlanadigan xonaning o'ngidagi birinchi raqamga qaraymiz.", 'Смотрим на первую цифру справа от сохраняемого разряда.'),
        L("Bu raqam 0 dan 4 gacha bo'lsa saqlangan raqam o'zgarmaydi, 5 dan 9 gacha bo'lsa birga oshadi.", 'Если эта цифра от 0 до 4, сохраняемая цифра не меняется; если от 5 до 9 — увеличивается на один.'),
      ],
      visual: {
        type: 'panels',
        panels: [
          { title: L('0, 1, 2, 3, 4', '0, 1, 2, 3, 4'), lines: [L('O‘zgarmaydi', 'Не меняется')] },
          { title: L('5, 6, 7, 8, 9', '5, 6, 7, 8, 9'), lines: [L('Birga oshadi', 'Увеличивается на 1')] },
        ],
      },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L("O'ndan birlargacha", 'До десятых'),
      title: L("3,46 ni o'ndan birlargacha yaxlitlang", 'Округлите 3,46 до десятых'),
      prompt: L("O'ndan birlar xonasidagi 4 dan keyingi raqamni tekshiring.", 'Проверьте цифру после 4 в разряде десятых.'),
      intro: L(
        "Uch butun yuzdan qirq olti sonini o'ndan birlargacha yaxlitlaymiz. O'ndan birlar xonasida to'rt turibdi, undan keyingi raqam olti. Olti beshdan katta bo'lgani uchun to'rtni birga oshiring.",
        'Округлим три целых сорок шесть сотых до десятых. В разряде десятых стоит четыре, следующая цифра — шесть. Поскольку шесть не меньше пяти, увеличьте четыре на один.',
      ),
      options: ['3,4', '3,5', '3,46', '4,0'],
      correct: 1,
      why: [
        L("Saqlanadigan xona o'ndan birlar, undagi raqam 4.", 'Сохраняемый разряд — десятые, в нём стоит цифра 4.'),
        L("Keyingi raqam 6 bo'lgani uchun 4 birga oshadi: 3,46 ≈ 3,5.", 'Следующая цифра 6, поэтому 4 увеличивается на один: 3,46 ≈ 3,5.'),
      ],
      wrong: L("O'ndan birlar xonasidan keyingi yuzdan birlar raqami 6 ga qarang.", 'Посмотрите на цифру 6 в разряде сотых, следующую за десятыми.'),
      visual: { type: 'chain', items: ['3,46', '6 ≥ 5', '3,5'] },
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yuzdan birlargacha', 'До сотых'),
      title: L("2,374 ni yuzdan birlargacha yaxlitlang", 'Округлите 2,374 до сотых'),
      prompt: L("Yuzdan birlar xonasidagi 7 dan keyingi raqamni tekshiring.", 'Проверьте цифру после 7 в разряде сотых.'),
      intro: L(
        "Ikki butun mingdan uch yuz yetmish to'rt sonini yuzdan birlargacha yaxlitlaymiz. Yuzdan birlar xonasida yetti, keyingi raqam to'rt. To'rt beshdan kichik, shuning uchun yetti raqami o'zgarmaydi.",
        'Округлим две целых триста семьдесят четыре тысячных до сотых. В разряде сотых стоит семь, следующая цифра — четыре. Четыре меньше пяти, поэтому семь не меняется.',
      ),
      options: ['2,37', '2,38', '2,4', '2,374'],
      correct: 0,
      why: [
        L("Yuzdan birlar xonasidagi raqam 7.", 'В разряде сотых стоит цифра 7.'),
        L("Keyingi raqam 4 bo'lgani uchun 7 o'zgarmaydi: 2,374 ≈ 2,37.", 'Следующая цифра 4, поэтому 7 не меняется: 2,374 ≈ 2,37.'),
      ],
      wrong: L("Yaxlitlashni belgilaydigan keyingi raqam 4; u 5 dan kichik.", 'Решающая следующая цифра — 4; она меньше 5.'),
      visual: { type: 'chain', items: ['2,374', '4 < 5', '2,37'] },
    },
    {
      type: 'info',
      eyebrow: L('Davriy kasrni yaxlitlash', 'Округление периодической дроби'),
      title: L("Takrorlanuvchi raqamlardan foydalanamiz", 'Используем повторяющиеся цифры'),
      steps: [
        L("1/3 = 0,(3) yozuvi 0,3333 va hokazo davom etadi.", 'Запись 1/3 = 0,(3) продолжается как 0,3333 и так далее.'),
        L("Yuzdan birlargacha yaxlitlashda 0,33 ni saqlab, keyingi uchinchi raqam 3 ga qaraymiz.", 'При округлении до сотых сохраняем 0,33 и смотрим на следующую третью цифру 3.'),
        L("3 soni 5 dan kichik, demak 0,(3) ≈ 0,33.", 'Число 3 меньше 5, значит 0,(3) ≈ 0,33.'),
      ],
      visual: { type: 'chain', items: ['0,(3)', '0,333', '0,33'] },
    },
    {
      type: 'multi',
      scored: true,
      eyebrow: L('Bir nechta javob', 'Несколько ответов'),
      title: L("To'g'ri yaxlitlangan tengliklarni belgilang", 'Отметьте верные округления'),
      intro: L(
        "Har bir son qaysi xonagacha yaxlitlanganini va undan keyingi raqamni tekshiring.",
        'Для каждого числа проверьте разряд округления и следующую за ним цифру.',
      ),
      options: [
        L("4,26 o'ndan birlargacha 4,3", '4,26 до десятых равно 4,3'),
        L("7,134 yuzdan birlargacha 7,13", '7,134 до сотых равно 7,13'),
        L("0,875 yuzdan birlargacha 0,88", '0,875 до сотых равно 0,88'),
        L("5,49 o'ndan birlargacha 5,4", '5,49 до десятых равно 5,4'),
      ],
      correctSet: [0, 1, 2],
      why: [
        L("Birinchi uchta yozuvda keyingi raqamga qarab yaxlitlash to'g'ri bajarilgan.", 'В первых трёх записях округление по следующей цифре выполнено верно.'),
        L("5,49 o'ndan birlargacha 5,5 bo'ladi, chunki keyingi raqam 9.", '5,49 до десятых равно 5,5, потому что следующая цифра — 9.'),
      ],
      wrong: L("Saqlanadigan xonadan keyingi birinchi raqamga qarang.", 'Смотрите на первую цифру после сохраняемого разряда.'),
    },
    {
      type: 'match',
      scored: true,
      eyebrow: L('Moslashtirish', 'Соответствие'),
      title: L("Sonlarni yaxlitlangan qiymatlari bilan juftlang", 'Соедините числа с округлёнными значениями'),
      prompt: L("Barcha sonlarni o'ndan birlargacha yaxlitlang.", 'Округлите все числа до десятых.'),
      intro: L(
        "Har bir sonda o'ndan birlar xonasini saqlang va yuzdan birlar raqamiga qarab mos javobni tanlang.",
        'В каждом числе сохраните разряд десятых и по цифре сотых выберите подходящий ответ.',
      ),
      rows: [
        { left: '2,34', correct: L('2,3', '2,3') },
        { left: '5,67', correct: L('5,7', '5,7') },
        { left: '8,05', correct: L('8,1', '8,1') },
      ],
      why: [
        L("2,34 da keyingi raqam 4, shuning uchun 2,3 qoladi.", 'В числе 2,34 следующая цифра 4, поэтому остаётся 2,3.'),
        L("5,67 va 8,05 da keyingi raqam kamida 5, shuning uchun o'ndan birlar birga oshadi.", 'В числах 5,67 и 8,05 следующая цифра не меньше 5, поэтому десятые увеличиваются на один.'),
      ],
      wrong: L("Yuzdan birlar raqami 5 yoki katta bo'lsa, o'ndan birlar raqamini birga oshiring.", 'Если цифра сотых не меньше 5, увеличьте цифру десятых на один.'),
    },
    {
      type: 'classify',
      scored: true,
      eyebrow: L('Tasniflash', 'Классификация'),
      title: L("O'nli yozuvlarni tugaydigan va davriy guruhga ajrating", 'Разделите записи на конечные и периодические'),
      prompt: L("Qavsli yoki cheksiz takrorlanuvchi yozuvlarni davriy guruhga joylang.", 'Записи со скобками или бесконечным повторением поместите в периодическую группу.'),
      intro: L(
        "O'nli yozuv ma'lum raqamdan keyin tugasa birinchi guruhni, raqamlar cheksiz takrorlansa ikkinchi guruhni tanlang.",
        'Если десятичная запись заканчивается, выберите первую группу; если цифры повторяются бесконечно — вторую.',
      ),
      binA: L('Tugaydigan', 'Конечная'),
      binB: L('Davriy', 'Периодическая'),
      cards: [
        { label: '0,75', value: true },
        { label: '0,(6)', value: false },
        { label: '1,125', value: true },
        { label: '2,1(4)', value: false },
      ],
      why: [
        L("0,75 va 1,125 yozuvlari ma'lum xonada tugaydi.", 'Записи 0,75 и 1,125 заканчиваются.'),
        L("0,(6) va 2,1(4) yozuvlarida qavs ichidagi raqamlar cheksiz takrorlanadi.", 'В записях 0,(6) и 2,1(4) цифры в скобках повторяются бесконечно.'),
      ],
      wrong: L("Qavs ichidagi raqamlar davrni, ya'ni cheksiz takrorlanishni bildiradi.", 'Цифры в скобках обозначают период, то есть бесконечное повторение.'),
    },
    {
      type: 'question',
      scored: true,
      eyebrow: L('Yakuniy masala', 'Итоговая задача'),
      title: L("5/6 ni yuzdan birlargacha yaxlitlang", 'Округлите 5/6 до сотых'),
      prompt: L("5/6 = 0,8(3) ekanidan foydalaning.", 'Используйте равенство 5/6 = 0,8(3).'),
      intro: L(
        "Oltidan besh kasri nol butun o'ndan sakkiz, davrda uchga teng. Yuzdan birlar xonasigacha nol butun yuzdan sakson uchni saqlaymiz. Keyingi raqam ham uch bo'lgani uchun javob o'zgarmaydi.",
        'Пять шестых равны нулю целых восьми десятым, три в периоде. До сотых сохраняем ноль целых восемьдесят три сотых. Следующая цифра тоже три, поэтому ответ не меняется.',
      ),
      options: ['0,8', '0,83', '0,84', '0,86'],
      correct: 1,
      why: [
        L("5/6 = 0,8333 va hokazo.", '5/6 = 0,8333 и так далее.'),
        L("Yuzdan birlardan keyingi raqam 3, u 5 dan kichik. Shuning uchun 5/6 ≈ 0,83.", 'Цифра после сотых равна 3 и меньше 5. Поэтому 5/6 ≈ 0,83.'),
      ],
      wrong: L("0,83 dan keyingi takrorlanuvchi raqam 3; u yaxlitlashda sonni oshirmaydi.", 'После 0,83 идёт повторяющаяся цифра 3; при округлении она не увеличивает число.'),
      fact: L("Davriy kasrni yaxlitlash uchun kerakli xonadan keyingi takrorlanuvchi raqamga qaraladi.", 'Для округления периодической дроби смотрят на повторяющуюся цифру после нужного разряда.'),
      factVisual: '5/6 = 0,8(3) ≈ 0,83',
      visual: { type: 'chain', items: ['5/6', '0,8(3)', '0,83'] },
    },
    {
      type: 'summary',
      eyebrow: L('Dars yakuni', 'Итог урока'),
      title: L("Davriy kasrlar va yaxlitlashni o'rgandingiz", 'Вы изучили периодические дроби и округление'),
      points: [
        L("Cheksiz takrorlanuvchi raqamlar guruhi davr deyiladi va qavs ichida yoziladi.", 'Бесконечно повторяющуюся группу цифр называют периодом и записывают в скобках.'),
        L("Yaxlitlashda saqlanadigan xonadan keyingi birinchi raqam tekshiriladi.", 'При округлении проверяют первую цифру после сохраняемого разряда.'),
        L("Keyingi raqam 5 dan kichik bo'lsa raqam saqlanadi, aks holda birga oshiriladi.", 'Если следующая цифра меньше 5, разряд сохраняется, иначе увеличивается на один.'),
      ],
      close: L(
        "Endi davriy o'nli kasrni tanib, uning davrini yozishingiz va sonni kerakli xonagacha yaxlitlashingiz mumkin.",
        'Теперь вы умеете распознавать периодическую дробь, записывать её период и округлять число до нужного разряда.',
      ),
      audio: L(
        "Davriy kasrlar va yaxlitlashni o'rgandingiz. Cheksiz takrorlanuvchi raqamlar guruhi davr deyiladi va qavs ichida yoziladi. Yaxlitlashda saqlanadigan xonadan keyingi birinchi raqam tekshiriladi. Keyingi raqam beshdan kichik bo'lsa raqam saqlanadi, aks holda birga oshiriladi. Endi davriy o'nli kasrni tanib, uning davrini yozishingiz va sonni kerakli xonagacha yaxlitlashingiz mumkin.",
        'Вы изучили периодические дроби и округление. Бесконечно повторяющаяся группа цифр называется периодом и записывается в скобках. При округлении проверяется первая цифра после сохраняемого разряда. Если следующая цифра меньше пяти, сохраняемая цифра не меняется, иначе увеличивается на один. Теперь вы умеете распознавать периодическую дробь, записывать её период и округлять число до нужного разряда.',
      ),
    },
  ],
};

export default function Dars15(props) {
  return <FractionTheoryLesson lesson={LESSON} {...props}/>;
}
