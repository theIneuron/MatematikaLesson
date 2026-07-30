/* eslint-disable react-refresh/only-export-components */
import { Grade3LessonShell } from './Dars19.jsx';

const T = (uz, ru) => ({ uz, ru });
const S = (type, title, text, visual, ask, options, correct, hint) => ({
  type, title: T(...title), text: T(...text), visual, ask: T(...ask),
  options: options.map(([uz, ru = uz]) => T(uz, ru)), correct, hint: T(...hint),
});

export const SCREENS = [
  S('hook', ["Ulushlarni birlashtiramiz", "Объединяем доли"],
    ["Bir xil patirning 2/8 qismi bir likopchada, yana 3/8 qismi ikkinchisida. Barcha bo'laklar bir xil — sakkizdan ulushlar.", "На одной тарелке 2/8 одинаковой лепёшки, на другой ещё 3/8. Все части одинаковы — это восьмые доли."],
    '2/8 + 3/8 = ?', ["Jami nechta sakkizdan ulush bor?", "Сколько всего восьмых долей?"],
    [['4/8'], ['5/8'], ['5/16']], 1,
    ["2 ta va 3 ta bir xil bo'lakni sanang.", "Сосчитай 2 и 3 одинаковые части."]),
  S('exploration', ["Bo'lak nomi o'zgarmaydi", "Название доли не меняется"],
    ["Sakkizdan ulushlarni qo'shganda bo'laklarning kattaligi o'zgarmaydi. Faqat ularning soni ortadi.", "При сложении восьмых размер частей не меняется. Увеличивается только их количество."],
    '2 ta sakkizdan + 3 ta sakkizdan = 5 ta sakkizdan', ["Nega maxraj 8 bo'lib qoldi?", "Почему знаменатель остался 8?"],
    [["Butun hamon 8 teng qismga bo'lingan", "Целое всё ещё разделено на 8 равных частей"], ["8 + 8 hisoblanmaydi", "8 + 8 не вычисляется"], ["Surat kichik", "Числитель маленький"]], 0,
    ["Bo'lak o'lchami va nomi o'zgarmadi.", "Размер и название доли не изменились."]),
  S('exploration', ["Suratlarni qo'shamiz", "Складываем числители"],
    ["Bir xil maxrajli kasrlarni qo'shishda suratlar qo'shiladi, umumiy maxraj saqlanadi.", "При сложении дробей с одинаковыми знаменателями числители складывают, общий знаменатель сохраняют."],
    'a/n + b/n = (a + b)/n', ["1/7 + 4/7 natijasi?", "Результат 1/7 + 4/7?"],
    [['5/7'], ['5/14'], ['4/7']], 0,
    ["1 + 4 ni suratga yozib, 7 ni saqlang.", "Запиши 1 + 4 в числитель, сохрани 7."]),
  S('exploration', ["Ulushlarni olib tashlaymiz", "Убираем доли"],
    ["6/9 qismdan 2/9 qism olib tashlansa, to'qqizdan bo'laklarning 4 tasi qoladi.", "Если из 6/9 убрать 2/9, останутся 4 девятых доли."],
    '6/9 − 2/9 = 4/9', ["Qaysi sonlar ayirildi?", "Какие числа вычли?"],
    [["Suratlar", "Числители"], ["Maxrajlar", "Знаменатели"], ["Surat va maxraj", "Числитель и знаменатель"]], 0,
    ["Bir xil bo'laklarning soni kamaydi.", "Уменьшилось число одинаковых частей."]),
  S('rule', ["Qo'shish va ayirish qoidasi", "Правило сложения и вычитания"],
    ["Maxrajlar bir xil bo'lsa, suratlarni qo'shamiz yoki ayiramiz, maxrajni o'zgartirmaymiz. Natija ayni o'lchamdagi ulushlarni bildiradi.", "Если знаменатели одинаковы, числители складываем или вычитаем, знаменатель не меняем. Результат обозначает доли того же размера."],
    'a/n ± b/n = (a ± b)/n', ["3/10 + 5/10 da qaysi son saqlanadi?", "Какое число сохраняется в 3/10 + 5/10?"],
    [['3'], ['5'], ['10']], 2,
    ["Umumiy maxraj o'zgarmaydi.", "Общий знаменатель не меняется."]),
  S('test', ["Kasrlarni qo'shing", "Сложи дроби"],
    ["Oltidan ulushlarning 2 tasi va yana 3 tasi birlashtiriladi.", "Объединяем 2 шестых доли и ещё 3."],
    '2/6 + 3/6', ["Natijani toping.", "Найди результат."],
    [['5/6'], ['5/12'], ['1/6']], 0,
    ["Suratlar: 2 + 3; maxraj: 6.", "Числители: 2 + 3; знаменатель: 6."]),
  S('test', ["Kasrlarni ayiring", "Вычти дроби"],
    ["Sakkizdan 7 ulushdan sakkizdan 4 ulush olib tashlanadi.", "Из 7 восьмых убирают 4 восьмых."],
    '7/8 − 4/8', ["Natijani toping.", "Найди результат."],
    [['3/8'], ['3/0'], ['11/8']], 0,
    ["7 − 4 = 3, maxraj 8.", "7 − 4 = 3, знаменатель 8."]),
  S('test', ["Butun hosil bo'ldi", "Получилось целое"],
    ["Beshdan 2 ulushga beshdan 3 ulush qo'shilsa, barcha 5 bo'lak yig'iladi.", "Если к 2 пятым прибавить 3 пятых, соберутся все 5 частей."],
    '2/5 + 3/5 = 5/5', ["5/5 nimaga teng?", "Чему равно 5/5?"],
    [["1 butun", "1 целому"], ["5 butun", "5 целым"], ["0", "0"]], 0,
    ["Surat maxrajga teng bo'lsa, barcha qismlar olingan.", "Если числитель равен знаменателю, взяты все части."]),
  S('test', ["Nol hosil bo'ldi", "Получился ноль"],
    ["Kasrdan o'zini ayirsak, hech qanday ulush qolmaydi.", "Если из дроби вычесть её саму, долей не останется."],
    '4/7 − 4/7 = 0/7', ["Natijaning qiymati?", "Значение результата?"],
    [['0'], ['1'], ['4']], 0,
    ["Nol ta ulush — nol.", "Ноль долей — это ноль."]),
  S('exploration', ["Noto'g'ri kasrli natija", "Результат — неправильная дробь"],
    ["Qo'shish natijasida surat maxrajdan katta bo'lishi mumkin. Bunday natijadan butun qismini ajratamiz.", "После сложения числитель может стать больше знаменателя. Из такого результата выделяем целую часть."],
    '4/6 + 5/6 = 9/6 = 1 3/6', ["9/6 da nechta to'liq butun bor?", "Сколько полных целых в 9/6?"],
    [['1'], ['2'], ['3']], 0,
    ["6 ta oltidan ulush bitta butun.", "6 шестых долей составляют одно целое."]),
  S('test', ["Noma'lum qo'shiluvchi", "Неизвестное слагаемое"],
    ["Uchdan 2 ulushga noma'lum ulush qo'shilganda bir butun, ya'ni 3/3 hosil bo'ldi.", "К 2 третьим прибавили неизвестную долю и получили целое, то есть 3/3."],
    '2/3 + □/3 = 3/3', ["Katakka qaysi surat?", "Какой числитель в клетке?"],
    [['1'], ['2'], ['3']], 0,
    ["3 − 2 = 1 ta uchdan ulush yetishmaydi.", "Не хватает 3 − 2 = 1 третьей доли."]),
  S('test', ["Teskari tekshiruv", "Обратная проверка"],
    ["3/8 + 4/8 = 7/8 natijasini ayirish bilan tekshiramiz.", "Проверим результат 3/8 + 4/8 = 7/8 вычитанием."],
    '7/8 − 4/8 = ?', ["Qaysi kasr qaytadi?", "Какая дробь вернётся?"],
    [['3/8'], ['4/8'], ['11/8']], 0,
    ["Yig'indidan ikkinchi qo'shiluvchini ayiring.", "Вычти из суммы второе слагаемое."]),
  S('test', ["Xatoni toping", "Найди ошибку"],
    ["Jasur 2/9 + 4/9 = 6/18 deb yozdi. U suratlar bilan birga maxrajlarni ham qo'shdi.", "Жасур записал 2/9 + 4/9 = 6/18. Он сложил не только числители, но и знаменатели."],
    '2/9 + 4/9 = 6/18 ✗', ["To'g'ri javob qaysi?", "Какой ответ верный?"],
    [['6/9'], ['6/18'], ['2/9']], 0,
    ["To'qqizdan bo'laklarning o'lchami o'zgarmaydi.", "Размер девятых долей не меняется."]),
  S('case', ["Ziyofat masalasi", "Задача о празднике"],
    ["Patirning 3/10 qismi ertalab, 4/10 qismi tushlikda yeyildi.", "Утром съели 3/10 лепёшки, в обед — 4/10."],
    '3/10 + 4/10 = 7/10; 10/10 − 7/10 = ?', ["Patirning qanday qismi qoldi?", "Какая часть лепёшки осталась?"],
    [['3/10'], ['7/10'], ['3/20']], 0,
    ["Butundan yeyilgan 7/10 qismini ayiring.", "Вычти съеденные 7/10 из целого."]),
  S('test', ["Yakuniy diagnostika", "Итоговая диагностика"],
    ["Yangi vaziyat: idish 5/12 gacha to'la edi, unga yana 4/12 hajm quyildi, so'ng 2/12 ishlatildi.", "Новая ситуация: сосуд был заполнен на 5/12, добавили ещё 4/12, затем использовали 2/12."],
    '5/12 + 4/12 − 2/12', ["Qancha qism qoldi?", "Какая часть осталась?"],
    [['7/12'], ['9/12'], ['7/24']], 0,
    ["Suratlar bilan ketma-ket 5 + 4 − 2 ni bajaring.", "Выполни с числителями 5 + 4 − 2."]),
  S('summary', ["Ulushlar hisobi yakunlandi", "Вычисление долей завершено"],
    ["Siz bir xil o'lchamdagi ulushlarni qo'shdingiz va ayirdingiz, maxrajni saqladingiz, butun va nol holatini ko'rdingiz hamda natijani teskari amal bilan tekshirdingiz.", "Ты складывал и вычитал доли одинакового размера, сохранял знаменатель, рассмотрел целое и ноль и проверил результат обратным действием."],
    'suratlar ±; umumiy maxraj saqlanadi', ["Nega maxraj o'zgarmaydi?", "Почему знаменатель не меняется?"],
    [["Bo'laklarning o'lchami o'zgarmaydi", "Размер частей не меняется"], ["Suratlar kichik", "Числители маленькие"], ["Amal qisqa", "Действие короткое"]], 0,
    ["Bir xil nomdagi ulushlar sanalmoqda.", "Считаются доли одного размера."]),
];

export default function Dars30(runtimeProps) {
  return (
    <Grade3LessonShell
      {...runtimeProps}
      screens={SCREENS}
      titleUz="30-dars. Bir xil maxrajli kasrlarni qo'shish va ayirish"
      titleRu="Урок 30. Сложение и вычитание дробей с одинаковыми знаменателями"
    />
  );
}
