/* eslint-disable react-refresh/only-export-components */
import { Grade3LessonShell } from './Dars19.jsx';

const T = (uz, ru) => ({ uz, ru });
const S = (type, title, text, visual, ask, options, correct, hint) => ({
  type, title: T(...title), text: T(...text), visual, ask: T(...ask),
  options: options.map(([uz, ru = uz]) => T(uz, ru)), correct, hint: T(...hint),
});

export const SCREENS = [
  S('hook', ["Qaysi bo'lak kattaroq?", "Какая часть больше?"],
    ["Bit bir xil kattalikdagi ikkita patirning birini 2 ga, ikkinchisini 4 ga teng bo'ldi. Ra'no bitta yarim, Anvar bitta chorak oldi.", "Бит разделил две одинаковые лепёшки: одну на 2, другую на 4 равные части. Рано взяла половину, Анвар — четверть."],
    '1/2  ?  1/4', ["Kim kattaroq bo'lak oldi?", "Кто получил большую часть?"],
    [["Ra'no — 1/2", "Рано — 1/2"], ["Anvar — 1/4", "Анвар — 1/4"], ["Bo'laklar teng", "Части равны"]], 0,
    ["Bir xil butunni kamroq bo'lakka ajratsak, har bo'lak kattaroq bo'ladi.", "Если одинаковое целое разделить на меньшее число частей, каждая часть будет больше."]),
  S('exploration', ["Bir xil butun sharti", "Условие одинакового целого"],
    ["Ulushlarni to'g'ri taqqoslash uchun butunlar bir xil kattalikda bo'lishi kerak. Katta patirning choragi kichik patirning yarmidan katta bo'lishi mumkin.", "Чтобы верно сравнивать доли, целые должны быть одинакового размера. Четверть большой лепёшки может быть больше половины маленькой."],
    'bir xil butun → adolatli taqqoslash', ["Avval nimani tekshiramiz?", "Что проверяем сначала?"],
    [["Butunlar bir xilmi", "Одинаковы ли целые"], ["Suratlar bir xilmi", "Одинаковы ли числители"], ["Ranglar bir xilmi", "Одинаковы ли цвета"]], 0,
    ["Taqqoslanayotgan ulushlarning boshlang'ich butunlariga qarang.", "Посмотри на исходные целые сравниваемых долей."]),
  S('exploration', ["Yarim va uchdan bir", "Половина и треть"],
    ["Bir xil tasmaning yarmi ikki katta bo'lakdan biri, uchdan biri esa uch kichikroq bo'lakdan biri.", "Половина одинаковой полоски — одна из двух крупных частей, треть — одна из трёх меньших частей."],
    '1/2  >  1/3', ["Qaysi ulush katta?", "Какая доля больше?"],
    [['1/2'], ['1/3'], ["Teng", "Равны"]], 0,
    ["Ikki teng qism uch teng qismdan kattaroq bo'ladi.", "Одна из двух равных частей больше одной из трёх."]),
  S('exploration', ["Uchdan bir va chorak", "Треть и четверть"],
    ["Butun 3 ga bo'linganda bo'laklar 4 ga bo'lingandagidan kattaroq.", "При делении целого на 3 части каждая часть больше, чем при делении на 4."],
    '1/3  >  1/4', ["Belgini tanlang: 1/3 □ 1/4.", "Выбери знак: 1/3 □ 1/4."],
    [['>'], ['<'], ['=']], 0,
    ["Bir xil butunda maxraji kichik birlik kasr kattaroq.", "Для одинакового целого единичная дробь с меньшим знаменателем больше."]),
  S('exploration', ["Maxraj nimani o'zgartiradi?", "Что меняет знаменатель?"],
    ["Maxraj kattalashsa, butun ko'proq teng qismlarga bo'linadi. Shuning uchun bitta qism kichrayadi.", "Чем больше знаменатель, тем на большее число равных частей делят целое. Поэтому одна часть становится меньше."],
    '2 qism → katta; 8 qism → kichik', ["1/8 va 1/5 dan qaysi biri kichik?", "Какая дробь меньше: 1/8 или 1/5?"],
    [['1/8'], ['1/5'], ["Teng", "Равны"]], 0,
    ["8 ta bo'lakning bittasi 5 ta bo'lakning bittasidan kichik.", "Одна из 8 частей меньше одной из 5."]),
  S('rule', ["Birlik kasrlarni taqqoslash", "Сравнение единичных дробей"],
    ["Bir xil butunda suratlari 1 bo'lgan kasrlardan maxraji kichigi kattaroq; maxraji kattasi kichikroq.", "Для одинакового целого среди дробей с числителем 1 дробь с меньшим знаменателем больше, а с большим — меньше."],
    'a < b bo‘lsa, 1/a > 1/b', ["1/6 □ 1/9 uchun qaysi belgi?", "Какой знак поставить: 1/6 □ 1/9?"],
    [['>'], ['<'], ['=']], 0,
    ["6 qismdan biri 9 qismdan biriga qaraganda kattaroq.", "Одна из 6 частей больше одной из 9."]),
  S('test', ["Belgini qo'ying", "Поставь знак"],
    ["Bir xil doiralarning yarimi va choragi taqqoslanadi.", "Сравниваются половина и четверть одинаковых кругов."],
    '1/2 □ 1/4', ["To'g'ri belgini tanlang.", "Выбери верный знак."],
    [['>'], ['<'], ['=']], 0,
    ["Yarim chorakdan katta.", "Половина больше четверти."]),
  S('test', ["Eng kichik ulush", "Наименьшая доля"],
    ["Uchala kasr ham bir xil butunning bitta ulushini bildiradi.", "Все три дроби обозначают одну долю одинакового целого."],
    '1/3 · 1/5 · 1/10', ["Eng kichik kasr qaysi?", "Какая дробь наименьшая?"],
    [['1/3'], ['1/5'], ['1/10']], 2,
    ["Eng ko'p bo'lakka ajratilgandagi bitta bo'lakni tanlang.", "Выбери одну часть при самом большом числе делений."]),
  S('test', ["Eng katta ulush", "Наибольшая доля"],
    ["Bir xil tasma 2, 6 va 8 ta teng bo'lakka bo'lingan.", "Одинаковую полоску разделили на 2, 6 и 8 равных частей."],
    '1/2 · 1/6 · 1/8', ["Eng katta kasr qaysi?", "Какая дробь наибольшая?"],
    [['1/2'], ['1/6'], ['1/8']], 0,
    ["Eng kam bo'lakka bo'lingan modelning bir qismi katta.", "Одна часть модели с наименьшим числом делений больше."]),
  S('exploration', ["Son o'qida ulushlar", "Доли на числовом луче"],
    ["0 dan 1 gacha bo'lgan kesmada katta ulush 1 ga yaqinroq joylashadi.", "На отрезке от 0 до 1 большая доля расположена ближе к 1."],
    '0 ─ 1/4 ─ 1/2 ─ 1', ["Qaysi nuqta 1 ga yaqinroq?", "Какая точка ближе к 1?"],
    [['1/4'], ['1/2'], ["Ikkalasi teng", "Обе одинаково"]], 1,
    ["Son o'qida o'ngroqda turgan musbat son kattaroq.", "На числовом луче положительное число правее — больше."]),
  S('test', ["Teng kasrlar", "Равные дроби"],
    ["Ikki bir xil butunning har biri 5 ta teng bo'lakka bo'lindi va bittadan bo'lak olindi.", "Два одинаковых целых разделили на 5 равных частей и взяли по одной части."],
    '1/5 □ 1/5', ["Qaysi belgi kerak?", "Какой знак нужен?"],
    [['>'], ['<'], ['=']], 2,
    ["Kasrlarning surat va maxraj yozuvlari bir xil.", "Числители и знаменатели дробей одинаковы."]),
  S('test', ["Tartiblang", "Расположи по порядку"],
    ["Birlik kasrlarni kattadan kichikka joylaymiz.", "Расположим единичные дроби от большей к меньшей."],
    '1/3 · 1/7 · 1/4', ["To'g'ri tartib qaysi?", "Какой порядок верный?"],
    [['1/3 > 1/4 > 1/7'], ['1/7 > 1/4 > 1/3'], ['1/4 > 1/3 > 1/7']], 0,
    ["Maxrajlarni kichikdan kattaga qarab o'qing.", "Рассмотри знаменатели от меньшего к большему."]),
  S('test', ["Xatoni toping", "Найди ошибку"],
    ["Jasur: «8 soni 5 dan katta, demak 1/8 ham 1/5 dan katta», dedi.", "Жасур сказал: «8 больше 5, значит 1/8 больше 1/5»."],
    '1/8 > 1/5 ✗', ["Jasurning xatosi nimada?", "В чём ошибка Жасура?"],
    [["Maxrajni bo'lak kattaligi deb o'ylagan", "Принял больший знаменатель за большую часть"], ["Suratlar har xil", "Числители разные"], ["Butunlar teng", "Целые одинаковы"]], 0,
    ["Ko'proq bo'lak — har bir bo'lak kichikroq.", "Больше частей — каждая часть меньше."]),
  S('case', ["Ikki likopcha", "Две тарелки"],
    ["Bir xil kattalikdagi ikkita patirning 1/3 qismi bir likopchada, 1/6 qismi ikkinchisida qoldi.", "На одной тарелке осталась 1/3 одинаковой лепёшки, на другой — 1/6."],
    '1/3  ?  1/6', ["Qaysi likopchada ko'proq patir bor?", "На какой тарелке больше лепёшки?"],
    [["1/3 qolganida", "Где осталось 1/3"], ["1/6 qolganida", "Где осталось 1/6"], ["Teng", "Одинаково"]], 0,
    ["Uchdan bir oltidan birdan katta.", "Одна треть больше одной шестой."]),
  S('test', ["Yakuniy diagnostika", "Итоговая диагностика"],
    ["Yangi vaziyatda bir xil uzunlikdagi tasmalarning 1/4 va 1/9 qismlari ishlatildi.", "В новой ситуации использовали 1/4 и 1/9 одинаковых по длине лент."],
    '1/4 □ 1/9', ["To'g'ri xulosa qaysi?", "Какой вывод верный?"],
    [["1/4 > 1/9, chunki 4 qismdan biri kattaroq", "1/4 > 1/9, потому что одна из 4 частей больше"], ["1/4 < 1/9, chunki 9 katta", "1/4 < 1/9, потому что 9 больше"], ["1/4 = 1/9", "1/4 = 1/9"]], 0,
    ["Modelda butunni 4 va 9 qismga bo'lib tasavvur qiling.", "Представь деление целого на 4 и на 9 частей."]),
  S('summary', ["Ulushlar tartiblandi", "Доли упорядочены"],
    ["Siz bir xil butun ulushlarini model va son o'qida taqqosladingiz, birlik kasrlar qoidasini qo'lladingiz va maxraj tuzog'ini tushuntirdingiz.", "Ты сравнил доли одинакового целого на модели и числовом луче, применил правило единичных дробей и объяснил ловушку знаменателя."],
    'maxraj ↑  →  bitta ulush ↓', ["Birlik kasrda maxraj oshsa nima bo'ladi?", "Что происходит с единичной дробью при увеличении знаменателя?"],
    [["Ulush kichrayadi", "Доля уменьшается"], ["Ulush kattalashadi", "Доля увеличивается"], ["Ulush o'zgarmaydi", "Доля не меняется"]], 0,
    ["Butun ko'proq teng qismlarga bo'linadi.", "Целое делят на большее число равных частей."]),
];

export default function Dars26(runtimeProps) {
  return (
    <Grade3LessonShell
      {...runtimeProps}
      screens={SCREENS}
      titleUz="26-dars. Ulushlarni taqqoslash"
      titleRu="Урок 26. Сравнение долей"
    />
  );
}
