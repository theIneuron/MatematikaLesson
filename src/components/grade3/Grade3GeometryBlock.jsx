/* eslint-disable react-refresh/only-export-components */
import { Grade3LessonShell } from './Dars21.jsx';

const T = (uz, ru) => ({ uz, ru });
const O = (value) => Array.isArray(value) ? T(value[0], value[1]) : value;

const STAGES = [
  ['hook', 'Kirish diagnostikasi', 'Входная диагностика'],
  ['exploration', 'Tayanch bilim', 'Опорные знания'],
  ['case', 'Kristall shahardagi muammo', 'Задача в Кристальном городе'],
  ['exploration', 'Konkret model', 'Предметная модель'],
  ['exploration', 'Ikkinchi model', 'Вторая модель'],
  ['exploration', 'Qonuniyatni kashf etamiz', 'Открываем закономерность'],
  ['rule', 'Yangi qoida', 'Новое правило'],
  ['test', 'Birga bajaramiz', 'Решаем вместе'],
  ['test', "Yo'naltirilgan mashq", 'Задание с подсказкой'],
  ['test', 'Mustaqil mashq', 'Самостоятельная работа'],
  ['test', 'Teskari topshiriq', 'Обратное задание'],
  ['test', 'Xatoni toping', 'Найди ошибку'],
  ['case', 'Qurilish masalasi', 'Задача строительства'],
  ['test', 'Yakuniy diagnostika', 'Итоговая диагностика'],
  ['summary', 'Kristall kaliti ochildi', 'Кристальный ключ открыт'],
];

const STAGE_TEXT = [
  T("Avvalgi bilimingizni yangi qoidasiz sinab ko'ring.", 'Проверь прежние знания без нового правила.'),
  T("Yangi mavzu uchun kerak bo'ladigan bilimni eslang.", 'Вспомни знание, нужное для новой темы.'),
  T("Bit va do'stlariga inshootni aniq o'lchashda yordam bering.", 'Помоги Биту и друзьям точно измерить сооружение.'),
  T("Shaklni ko'rinadigan qismlar orqali tekshiring.", 'Исследуй фигуру через видимые части.'),
  T("Xuddi shu fikrni boshqa tasvirda ko'ring.", 'Рассмотри ту же идею на другой модели.'),
  T("Misollardan umumiy bog'lanishni o'zingiz toping.", 'Сам найди общую связь в примерах.'),
  T("Kashf qilgan bog'lanishingizni qisqa qoida bilan mustahkamlang.", 'Закрепи найденную связь коротким правилом.'),
  T("Vizual tayanch bilan bir qadamni bajaring.", 'Выполни один шаг с визуальной опорой.'),
  T("Endi tayanch kamayadi: kerakli amalni tanlang.", 'Теперь опоры меньше: выбери нужное действие.'),
  T("Yangi misolni mustaqil yeching.", 'Реши новый пример самостоятельно.'),
  T("Natijadan yetishmayotgan o'lchovni tiklang.", 'Восстанови неизвестную величину по результату.'),
  T("Noto'g'ri fikr qayerda buzilganini aniqlang.", 'Определи, где нарушено рассуждение.'),
  T("Matematikani haqiqiy qurilish vazifasiga qo'llang.", 'Примени математику в настоящей строительной задаче.'),
  T("Yangi vaziyatda usulni izohlab qo'llang.", 'Примени и объясни способ в новой ситуации.'),
  T("Muammo yechildi. Eng muhim xulosani belgilang.", 'Задача решена. Отметь главный вывод.'),
];

const q = (visual, uz, ru, options, correct, hintUz, hintRu) => ({
  visual,
  ask: T(uz, ru),
  options: options.map(O),
  correct,
  hint: T(hintUz, hintRu),
});

function buildScreens(config) {
  return STAGES.map(([type, uzTitle, ruTitle], index) => {
    const check = config.checks[index];
    return {
      type,
      title: T(uzTitle, ruTitle),
      text: index === 2
        ? config.story
        : index === 6
          ? config.rule
          : index === 14
            ? config.finish
            : STAGE_TEXT[index],
      ...check,
    };
  });
}

export const GEOMETRY_LESSONS = {
  37: {
    titleUz: '37-dars. Perimetr',
    titleRu: 'Урок 37. Периметр',
    story: T("Kristall bog'ining himoya panjarasi uchun uning butun chegarasi uzunligini topish kerak.", 'Для ограды кристального сада нужно найти длину всей границы.'),
    rule: T("Perimetr — shakl barcha tomonlari uzunliklarining yig'indisi. To'g'ri to'rtburchak uchun P = (a + b) × 2.", 'Периметр — сумма длин всех сторон фигуры. Для прямоугольника P = (a + b) × 2.'),
    finish: T("Chegara aniq hisoblandi va bog' panjarasi yopildi. Keyingi bekatda shakl egallagan joy — yuzani o'rganasiz.", 'Граница вычислена, ограда сада замкнулась. На следующей остановке ты изучишь площадь.'),
    checks: [
      q('3 cm + 4 cm', "Ikki kesmaning jami uzunligi qancha?", 'Какова общая длина двух отрезков?', ['7 cm', '12 cm', '1 cm'], 0, "Uzunliklarni qo'shing.", 'Сложи длины.'),
      q('□  tomonlari: 5, 5, 5, 5 cm', "Kvadratning nechta tomoni bor?", 'Сколько сторон у квадрата?', ['3', '4', '5'], 1, "Kvadrat chegarasini aylanib chiqing.", 'Обойди границу квадрата.'),
      q('6 m ─ 3 m ─ 6 m ─ 3 m', "Panjaraning butun uzunligini qaysi amal topadi?", 'Какое действие найдёт всю длину ограды?', ['6 + 3', '6 + 3 + 6 + 3', '6 × 3'], 1, "Barcha tomonlar kerak.", 'Нужны все стороны.'),
      q('△  4 cm, 5 cm, 6 cm', "Uchburchak perimetri qancha?", 'Чему равен периметр треугольника?', ['11 cm', '15 cm', '24 cm'], 1, "Uch tomon uzunligini qo'shing.", 'Сложи длины трёх сторон.'),
      q('▭  a=7 cm, b=2 cm', "Modeldagi barcha tomonlar yig'indisi qaysi?", 'Какая сумма описывает все стороны?', ['7 + 2', '7 + 2 + 7 + 2', '7 × 2'], 1, "Qarama-qarshi tomonlar teng.", 'Противоположные стороны равны.'),
      q('(8 + 3) × 2', "Bu yozuv qaysi shakl perimetriga mos?", 'Периметру какой фигуры соответствует запись?', [['To\'g\'ri to\'rtburchak', 'Прямоугольник'], ['Uchburchak', 'Треугольник'], ['Aylana', 'Круг']], 0, "Ikki xil tomon ikki martadan olinmoqda.", 'Две разные стороны взяты по два раза.'),
      q('P = a + b + c + …', "Perimetr nimani bildiradi?", 'Что показывает периметр?', [['Barcha tomonlar yig\'indisini', 'Сумму всех сторон'], ['Shakl ichidagi kataklarni', 'Клетки внутри фигуры'], ['Bitta tomon uzunligini', 'Одну сторону']], 0, "Chegara bo'ylab yuring.", 'Двигайся по границе.'),
      q('▭  9 cm × 4 cm', "P ni toping.", 'Найди P.', ['13 cm', '26 cm', '36 cm'], 1, "(9 + 4) × 2 ni hisoblang.", 'Вычисли (9 + 4) × 2.'),
      q('□  a=6 dm', "Kvadrat perimetri qancha?", 'Чему равен периметр квадрата?', ['12 dm', '24 dm', '36 dm'], 1, "To'rtta teng tomon bor.", 'Есть четыре равные стороны.'),
      q('△  7 m, 8 m, 9 m', "Perimetrni mustaqil toping.", 'Найди периметр самостоятельно.', ['15 m', '24 m', '504 m'], 1, "7 + 8 + 9.", 'Сложи 7, 8 и 9.'),
      q('P=30 cm; tomonlar 8, 8, 7, ?', "Yetishmagan tomon qancha?", 'Чему равна неизвестная сторона?', ['7 cm', '15 cm', '23 cm'], 0, "Ma'lum tomonlar yig'indisini 30 dan ayiring.", 'Вычти сумму известных сторон из 30.'),
      q('5 cm × 3 cm → P=15 cm', "Xato nimada?", 'В чём ошибка?', [['Yuza hisoblangan', 'Вычислена площадь'], ['Birlik noto\'g\'ri', 'Неверная единица'], ['Javob to\'g\'ri', 'Ответ верный']], 0, "Perimetr uchun tomonlar qo'shiladi.", 'Для периметра стороны складывают.'),
      q('Bog‘: 12 m × 5 m', "Necha metr panjara kerak?", 'Сколько метров ограды нужно?', ['17 m', '34 m', '60 m'], 1, "Butun tashqi chegarani toping.", 'Найди всю внешнюю границу.'),
      q('Shakl tomonlari 11, 6, 11, 6 cm', "Yangi panel perimetri qancha?", 'Каков периметр новой панели?', ['17 cm', '34 cm', '66 cm'], 1, "To'rtta tomonning hammasini oling.", 'Учти все четыре стороны.'),
      q('P ↔ chegara', "Eng muhim xulosa qaysi?", 'Какой вывод главный?', [['Perimetr — chegara uzunligi', 'Периметр — длина границы'], ['Perimetr — kataklar soni', 'Периметр — число клеток'], ['Perimetr — faqat uzun tomon', 'Периметр — только длинная сторона']], 0, "Shakl tashqarisini tasavvur qiling.", 'Представь внешний контур фигуры.'),
    ],
  },
  38: {
    titleUz: '38-dars. Yuza birliklari',
    titleRu: 'Урок 38. Единицы площади',
    story: T("Kristall maydonini qoplash uchun uning ichiga nechta teng kvadrat plitka sig'ishini aniqlash kerak.", 'Чтобы покрыть кристальную площадку, нужно узнать, сколько одинаковых квадратных плиток поместится внутри.'),
    rule: T("Yuza shakl egallagan joyni bildiradi. Uni birlik kvadratlar bilan o'lchaymiz: cm², dm², m².", 'Площадь показывает место, занимаемое фигурой. Её измеряют единичными квадратами: см², дм², м².'),
    finish: T("Maydon teng kvadratlar bilan aniq qoplandi. Keyingi darsda to'g'ri to'rtburchak yuzasini tez hisoblashni topasiz.", 'Площадка точно покрыта равными квадратами. На следующем уроке ты научишься быстро вычислять площадь прямоугольника.'),
    checks: [
      q('■■■', "Nechta teng kvadrat ko'rinyapti?", 'Сколько одинаковых квадратов видно?', ['2', '3', '4'], 1, "Kvadratlarni bittalab sanang.", 'Посчитай квадраты.'),
      q('1 cm × 1 cm', "Birlik kvadratning tomoni qancha?", 'Какова сторона единичного квадрата?', ['1 cm', '2 cm', '1 dm'], 0, "Nomining o'zi bir birlikni ko'rsatadi.", 'Название указывает на одну единицу.'),
      q('▦  3 qator × 4 katak', "Panel ichiga nechta plitka sig'adi?", 'Сколько плиток помещается внутри панели?', ['7', '12', '14'], 1, "Har qatordagi kataklarni barcha qatorlar soniga ko'paytiring.", 'Умножь клетки в ряду на число рядов.'),
      q('▦ = 8 ta birlik kvadrat', "Shakl yuzasi qancha?", 'Какова площадь фигуры?', ['8 cm', '8 cm²', '16 cm²'], 1, "Yuza kvadrat birlikda yoziladi.", 'Площадь записывают в квадратных единицах.'),
      q('A: ▦▦▦▦▦▦   B: ▦▦▦▦', "Qaysi shaklning yuzasi katta?", 'Площадь какой фигуры больше?', ['A', 'B', 'Teng'], 0, "Ichki birlik kvadratlarni solishtiring.", 'Сравни число единичных квадратов.'),
      q('2 qator × 5 katak = 10 katak', "Kataklarni sanashning tez usuli qaysi?", 'Как быстро посчитать клетки?', [['Qator × ustun', 'Ряды × столбцы'], ['Faqat qator', 'Только ряды'], ['Chegarani qo\'shish', 'Сложить границу']], 0, "Teng qatorlar takrorlanadi.", 'Одинаковые ряды повторяются.'),
      q('S = birlik kvadratlar soni', "Yuza nimani o'lchaydi?", 'Что измеряет площадь?', [['Shakl ichidagi joyni', 'Место внутри фигуры'], ['Tashqi chegarani', 'Внешнюю границу'], ['Burchaklar sonini', 'Число углов']], 0, "Shaklning ichiga qarang.", 'Смотри внутрь фигуры.'),
      q('▦  4 × 3', "Yuzani kataklarda toping.", 'Найди площадь в клетках.', ['7', '12', '14'], 1, "4 × 3.", 'Вычисли 4 × 3.'),
      q('1 dm²', "Qaysi model 1 dm² ni bildiradi?", 'Какая модель означает 1 дм²?', [['1 dm × 1 dm kvadrat', 'Квадрат 1 дм × 1 дм'], ['1 dm kesma', 'Отрезок 1 дм'], ['1 cm × 1 dm tasma', 'Полоска 1 см × 1 дм']], 0, "Yuza ikki o'lchamli kvadrat bilan o'lchanadi.", 'Площадь измеряют двумерным квадратом.'),
      q('▦  6 × 2', "Yuza nechta birlik kvadrat?", 'Сколько единичных квадратов составляет площадь?', ['8', '12', '16'], 1, "Olti ustun ikki qatorda.", 'Шесть столбцов в двух рядах.'),
      q('S=15 cm²; 3 qator', "Har qatorda nechta katak?", 'Сколько клеток в каждом ряду?', ['5', '12', '45'], 0, "15 ni 3 ga bo'ling.", 'Раздели 15 на 3.'),
      q('4 × 4 katak → 16 cm', "Xato nimada?", 'В чём ошибка?', [['Birlik cm² bo\'lishi kerak', 'Нужна единица см²'], ['16 noto\'g\'ri', 'Число 16 неверно'], ['Ko\'paytirish mumkin emas', 'Нельзя умножать']], 0, "Yuza birligi kvadrat bo'ladi.", 'Единица площади должна быть квадратной.'),
      q('Pol: 5 qator × 7 plitka', "Jami nechta plitka kerak?", 'Сколько плиток нужно всего?', ['12', '30', '35'], 2, "Teng qatorlarni ko'paytirish bilan sanang.", 'Посчитай равные ряды умножением.'),
      q('Panel: 8 × 3 birlik kvadrat', "Yangi panel yuzasi qancha?", 'Какова площадь новой панели?', ['11 birlik²', '24 birlik²', '48 birlik²'], 1, "Qator va ustunni ko'paytiring.", 'Умножь ряды и столбцы.'),
      q('S ↔ ichki joy', "Eng muhim xulosa qaysi?", 'Какой вывод главный?', [['Yuza birlik kvadratlarda o\'lchanadi', 'Площадь измеряют единичными квадратами'], ['Yuza faqat tomonlarni qo\'shadi', 'Площадь складывает только стороны'], ['Yuza uzunlik birligida yoziladi', 'Площадь записывают единицей длины']], 0, "Kvadrat plitkalarni eslang.", 'Вспомни квадратные плитки.'),
    ],
  },
  39: {
    titleUz: "39-dars. To'g'ri to'rtburchak yuzasi",
    titleRu: 'Урок 39. Площадь прямоугольника',
    story: T("Kristall panelga qancha yorug'lik qoplamasi kerakligini kataklarni bittalab sanamasdan topish kerak.", 'Нужно узнать площадь светового покрытия панели, не пересчитывая клетки по одной.'),
    rule: T("To'g'ri to'rtburchak yuzasi uning bo'yi va enining ko'paytmasiga teng: S = a × b.", 'Площадь прямоугольника равна произведению его длины и ширины: S = a × b.'),
    finish: T("Panel yuzasi hisoblandi va qoplama yetarli bo'ldi. Keyingi darsda kvadratning maxsus yuzasi ochiladi.", 'Площадь панели вычислена, покрытия хватило. На следующем уроке откроется особый случай площади квадрата.'),
    checks: [
      q('3 + 3 + 3 + 3', "Takroriy qo'shishni ko'paytirish bilan yozing.", 'Запиши повторное сложение умножением.', ['3 × 3', '4 × 3', '4 + 3'], 1, "To'rtta guruhda uchtadan.", 'Четыре группы по три.'),
      q('▦  2 qator, har birida 6 katak', "Jami kataklar qancha?", 'Сколько клеток всего?', ['8', '12', '26'], 1, "2 × 6.", 'Вычисли 2 × 6.'),
      q('Panel: 8 m × 3 m', "Qoplama uchun qaysi miqdor kerak?", 'Какая величина нужна для покрытия?', [['Yuza', 'Площадь'], ['Perimetr', 'Периметр'], ['Burchak', 'Угол']], 0, "Qoplama shaklning ichini egallaydi.", 'Покрытие занимает внутреннюю часть.'),
      q('▦  5 ustun × 4 qator', "Modelda nechta birlik kvadrat bor?", 'Сколько единичных квадратов в модели?', ['9', '18', '20'], 2, "Har qatordagi beshta katakni to'rt marta oling.", 'Возьми пять клеток четыре раза.'),
      q('5 + 5 + 5 + 5 = 5 × 4', "Qaysi ikki o'lcham ko'paytirildi?", 'Какие два измерения умножили?', [['Bo\'yi va eni', 'Длину и ширину'], ['To\'rtta burchak', 'Четыре угла'], ['Perimetr va yuza', 'Периметр и площадь']], 0, "Qator va ustun soniga qarang.", 'Смотри на ряды и столбцы.'),
      q('a=7 cm, b=3 cm', "Katak sanamasdan S ni qanday topamiz?", 'Как найти S без пересчёта клеток?', ['7 + 3', '7 × 3', '(7 + 3) × 2'], 1, "Yuza uchun bo'yi eniga ko'payadi.", 'Для площади длину умножают на ширину.'),
      q('S = a × b', "Formuladagi S nimani bildiradi?", 'Что означает S в формуле?', [['Yuzani', 'Площадь'], ['Tomonni', 'Сторону'], ['Perimetrni', 'Периметр']], 0, "S — yuza belgisi.", 'S — обозначение площади.'),
      q('▭  9 cm × 2 cm', "Yuzani toping.", 'Найди площадь.', ['11 cm²', '18 cm²', '22 cm²'], 1, "9 × 2.", 'Вычисли 9 × 2.'),
      q('▭  6 dm × 5 dm', "Yuza qancha?", 'Чему равна площадь?', ['11 dm²', '22 dm²', '30 dm²'], 2, "Ikki o'lchamni ko'paytiring.", 'Умножь два измерения.'),
      q('▭  12 m × 4 m', "Mustaqil hisoblang.", 'Вычисли самостоятельно.', ['16 m²', '32 m²', '48 m²'], 2, "12 × 4.", 'Вычисли 12 × 4.'),
      q('S=35 cm², a=7 cm', "Eni qancha?", 'Чему равна ширина?', ['5 cm', '28 cm', '42 cm'], 0, "35 ni 7 ga bo'ling.", 'Раздели 35 на 7.'),
      q('8 m × 3 m → S=22 m²', "Hisobdagi xatoni toping.", 'Найди ошибку в вычислении.', [['8 × 3 = 24', '8 × 3 = 24'], ['Birlik m bo\'lishi kerak', 'Нужна единица м'], ['Yuza qo\'shish bilan topiladi', 'Площадь находят сложением']], 0, "Ko'paytmani qayta tekshiring.", 'Проверь произведение.'),
      q('Devor: 10 m × 3 m', "Necha m² qoplama kerak?", 'Сколько м² покрытия нужно?', ['13 m²', '26 m²', '30 m²'], 2, "Devorning ichki yuzini toping.", 'Найди внутреннюю площадь стены.'),
      q('Panel: 11 cm × 4 cm', "Yangi vaziyatda S ni toping.", 'Найди S в новой ситуации.', ['15 cm²', '30 cm²', '44 cm²'], 2, "Bo'yi bilan enini ko'paytiring.", 'Умножь длину на ширину.'),
      q('S = a × b', "Eng muhim xulosa qaysi?", 'Какой вывод главный?', [['Yuza — bo\'yi × eni', 'Площадь — длина × ширина'], ['Yuza — barcha tomonlar yig\'indisi', 'Площадь — сумма всех сторон'], ['Yuza — bo\'yi + eni', 'Площадь — длина + ширина']], 0, "Kataklarning qator va ustunlarini eslang.", 'Вспомни ряды и столбцы клеток.'),
    ],
  },
  40: {
    titleUz: '40-dars. Kvadrat yuzasi',
    titleRu: 'Урок 40. Площадь квадрата',
    story: T("Bit simmetrik kvadrat panelga qancha kristall qoplama kerakligini hisoblamoqchi.", 'Бит хочет вычислить, сколько кристального покрытия нужно для симметричной квадратной панели.'),
    rule: T("Kvadratning barcha tomonlari teng. Uning yuzasi tomonning o'ziga ko'paytmasi bilan topiladi: S = a × a.", 'Все стороны квадрата равны. Его площадь равна произведению стороны на себя: S = a × a.'),
    finish: T("Kvadrat panel qoplandi. Endi bir xil perimetrli shakllarning yuzasi har xil bo'lishini tekshirasiz.", 'Квадратная панель покрыта. Теперь ты сравнишь площади фигур с одинаковым периметром.'),
    checks: [
      q('□  4 teng tomon', "Kvadratning tomonlari haqida qaysi fikr to'g'ri?", 'Какое утверждение о сторонах квадрата верно?', [["Barchasi teng", "Все равны"], ["Faqat ikkitasi teng", "Равны только две"], ["Hech biri teng emas", "Ни одна не равна"]], 0, "Kvadratning to'rtta tomonini solishtiring.", 'Сравни четыре стороны квадрата.'),
      q('▦  3 qator × 3 ustun', "Nechta katak bor?", 'Сколько клеток?', ['6', '9', '12'], 1, "3 × 3 ni hisoblang.", 'Вычисли 3 × 3.'),
      q('Panel tomoni 6 m', "Yuza uchun qaysi o'lchamlar kerak?", 'Какие размеры нужны для площади?', ['6 va 6', '6 va 4', 'Faqat perimetr'], 0, "Kvadratning bo'yi ham, eni ham 6.", 'Длина и ширина квадрата равны 6.'),
      q('▦  4 × 4', "Model yuzasi qancha?", 'Какова площадь модели?', ['8 birlik²', '16 birlik²', '20 birlik²'], 1, "To'rtta qatorda to'rttadan.", 'Четыре ряда по четыре.'),
      q('S = 5 × 5', "Kvadrat tomoni qancha?", 'Чему равна сторона квадрата?', ['5', '10', '25'], 0, "Bir xil son ikki marta ko'paytirilgan.", 'Одно число умножено само на себя.'),
      q('a=7 cm', "Qaysi yozuv kvadrat yuzasini topadi?", 'Какая запись находит площадь квадрата?', ['7 + 7', '7 × 4', '7 × 7'], 2, "Bo'yi va eni teng.", 'Длина равна ширине.'),
      q('S = a × a', "Nega a ikki marta yoziladi?", 'Почему a записано дважды?', [["Bo'yi va eni teng", "Длина и ширина равны"], ["Ikki kvadrat bor", "Есть два квадрата"], ["Perimetr topiladi", "Находят периметр"]], 0, "Kvadrat — maxsus to'g'ri to'rtburchak.", 'Квадрат — особый прямоугольник.'),
      q('□  a=8 cm', "Yuzani toping.", 'Найди площадь.', ['16 cm²', '32 cm²', '64 cm²'], 2, "8 × 8.", 'Вычисли 8 × 8.'),
      q('□  a=9 dm', "Yuza qancha?", 'Чему равна площадь?', ['18 dm²', '36 dm²', '81 dm²'], 2, "Tomonni o'ziga ko'paytiring.", 'Умножь сторону на себя.'),
      q('□  a=12 m', "Mustaqil hisoblang.", 'Вычисли самостоятельно.', ['24 m²', '48 m²', '144 m²'], 2, "12 × 12.", 'Вычисли 12 × 12.'),
      q('S=49 cm²', "Kvadrat tomoni qancha?", 'Чему равна сторона квадрата?', ['6 cm', '7 cm', '8 cm'], 1, "Qaysi son o'ziga ko'paytirilsa 49 bo'ladi?", 'Какое число при умножении на себя даёт 49?'),
      q('a=6 m → S=24 m²', "Xatoni toping.", 'Найди ошибку.', [["6 × 6 = 36", "6 × 6 = 36"], ["Birlik m bo'lishi kerak", "Нужна единица м"], ["24 to'g'ri", "24 верно"]], 0, "6 × 4 perimetrga tegishli.", '6 × 4 относится к периметру.'),
      q('Kvadrat sahna: a=10 m', "Necha m² qoplama kerak?", 'Сколько м² покрытия нужно?', ['20 m²', '40 m²', '100 m²'], 2, "10 × 10.", 'Вычисли 10 × 10.'),
      q('Kristall: a=11 cm', "Yangi vaziyatda yuzani toping.", 'Найди площадь в новой ситуации.', ['22 cm²', '44 cm²', '121 cm²'], 2, "11 ni o'ziga ko'paytiring.", 'Умножь 11 на 11.'),
      q('□  S = a²', "Asosiy xulosa qaysi?", 'Какой вывод главный?', [["Kvadrat yuzasi a × a", "Площадь квадрата a × a"], ["Kvadrat yuzasi 4 × a", "Площадь квадрата 4 × a"], ["Kvadrat yuzasi a + a", "Площадь квадрата a + a"]], 0, "Yuza bilan perimetr formulasini adashtirmang.", 'Не путай формулы площади и периметра.'),
    ],
  },
  41: {
    titleUz: '41-dars. Perimetr va yuzani taqqoslash',
    titleRu: 'Урок 41. Сравнение периметра и площади',
    story: T("Ikki kristall panelning tashqi romi va ichki qoplamasini alohida taqqoslash kerak.", 'Нужно отдельно сравнить внешнюю рамку и внутреннее покрытие двух кристальных панелей.'),
    rule: T("Perimetr chegarani uzunlik birliklarida, yuza ichki joyni kvadrat birliklarda o'lchaydi. Bir xil perimetr har doim bir xil yuza bermaydi.", 'Периметр измеряет границу единицами длины, площадь — внутреннее место квадратными единицами. Одинаковый периметр не всегда означает одинаковую площадь.'),
    finish: T("Rom va qoplama hisoblari ajratildi. Endi ikkala o'lchovni qurilish masalalarida birga qo'llaysiz.", 'Расчёты рамки и покрытия разделены. Теперь ты применишь обе величины в строительных задачах.'),
    checks: [
      q('shakl tashqarisi ↔ shakl ichi', "Chegara qaysi tushunchaga tegishli?", 'Какое понятие относится к границе?', [['Perimetr', 'Периметр'], ['Yuza', 'Площадь'], ['Hajm', 'Объём']], 0, "Shakl tashqarisini aylanib chiqing.", 'Обойди внешний контур.'),
      q('cm va cm²', "Qaysi birlik yuzaga tegishli?", 'Какая единица относится к площади?', ['cm', 'cm²', 'm'], 1, "Yuza kvadrat birlikda yoziladi.", 'Площадь записывают в квадратных единицах.'),
      q('Rom + ichki qoplama', "Rom uchun nima, qoplama uchun nima topiladi?", 'Что находят для рамки и покрытия?', [["P va S", "P и S"], ["S va P", "S и P"], ["Faqat P", "Только P"]], 0, "Rom — chegara, qoplama — ichki joy.", 'Рамка — граница, покрытие — внутреннее место.'),
      q('A: 6×2   B: 4×4', "Qaysi shakl yuzasi katta?", 'У какой фигуры площадь больше?', ['A', 'B', 'Teng'], 1, "12 va 16 ni solishtiring.", 'Сравни 12 и 16.'),
      q('A: 6×2   B: 4×4', "Qaysi shakl perimetri katta?", 'У какой фигуры периметр больше?', ['A', 'B', 'Teng'], 2, "Ikkalasida ham P=16.", 'У обеих фигур P=16.'),
      q('P teng, S har xil', "Qanday qonuniyat ko'rindi?", 'Какая закономерность обнаружена?', [["Bir xil P da S har xil bo'lishi mumkin", "При одинаковом P площади могут различаться"], ["P va S doim teng", "P и S всегда равны"], ["S birliksiz yoziladi", "S пишут без единицы"]], 0, "Oldingi ikki panelni eslang.", 'Вспомни две предыдущие панели.'),
      q('P → cm; S → cm²', "To'g'ri moslikni tanlang.", 'Выбери верное соответствие.', [["P — chegara, S — ichki joy", "P — граница, S — внутреннее место"], ["P — ichki joy, S — chegara", "P — внутреннее место, S — граница"], ["Ikkalasi bir xil", "Они одинаковы"]], 0, "Birliklarga qarang.", 'Смотри на единицы.'),
      q('▭  7 cm × 3 cm', "P va S juftligini toping.", 'Найди пару P и S.', ['P=20 cm, S=21 cm²', 'P=10 cm, S=21 cm²', 'P=21 cm, S=20 cm²'], 0, "P=(7+3)×2; S=7×3.", 'P=(7+3)×2; S=7×3.'),
      q('□  a=5 dm', "P va S qancha?", 'Чему равны P и S?', ['P=20 dm, S=25 dm²', 'P=25 dm, S=20 dm²', 'P=10 dm, S=25 dm²'], 0, "P=4×5; S=5×5.", 'P=4×5; S=5×5.'),
      q('▭  9 m × 4 m', "Qaysi natija yuzani bildiradi?", 'Какой результат означает площадь?', ['13 m', '26 m', '36 m²'], 2, "Yuza kvadrat birlikda.", 'Площадь в квадратных единицах.'),
      q('S=24 cm², a=6 cm', "Eni va keyin P ni toping.", 'Найди ширину, затем P.', ['b=4 cm, P=20 cm', 'b=18 cm, P=48 cm', 'b=4 cm, P=10 cm'], 0, "24:6=4, so'ng (6+4)×2.", '24:6=4, затем (6+4)×2.'),
      q('8×3 → P=24 cm', "Xato nimada?", 'В чём ошибка?', [["24 — yuza, perimetr 22", "24 — площадь, периметр 22"], ["24 — to'g'ri perimetr", "24 — верный периметр"], ["Birlik cm² bo'lishi kerak", "Нужна единица см²"]], 0, "Ko'paytma bu yerda yuzani berdi.", 'Произведение здесь дало площадь.'),
      q('Pol 6×5 m, atrofiga tasma', "Qoplama va tasma uchun nima kerak?", 'Что нужно для покрытия и ленты?', ['S=30 m², P=22 m', 'S=22 m², P=30 m', 'S=11 m², P=30 m'], 0, "Ichki joy va chegarani alohida hisoblang.", 'Отдельно вычисли внутреннюю часть и границу.'),
      q('A: 8×2; B: 5×5', "Qaysi panel yuzasi katta?", 'Площадь какой панели больше?', ['A', 'B', 'Teng'], 1, "16 va 25 ni solishtiring.", 'Сравни 16 и 25.'),
      q('P ≠ S', "Eng muhim xulosa qaysi?", 'Какой вывод главный?', [["Perimetr va yuza turli miqdorlar", "Периметр и площадь — разные величины"], ["P va S doim bir xil", "P и S всегда одинаковы"], ["Ikkalasi cm² da yoziladi", "Обе пишутся в см²"]], 0, "Chegara va ichki joyni farqlang.", 'Различай границу и внутреннее место.'),
    ],
  },
  42: {
    titleUz: '42-dars. Perimetr va yuzaga oid masalalar',
    titleRu: 'Урок 42. Задачи на периметр и площадь',
    story: T("Kristall ustaxonada rom, qoplama va noma'lum o'lchamlar qatnashgan qurilish rejasini tugatish kerak.", 'В кристальной мастерской нужно завершить строительный план с рамкой, покрытием и неизвестными размерами.'),
    rule: T("Masalada avval chegara yoki ichki joy so'ralganini aniqlang. So'ng mos formula, birlik, hisob va tekshiruvni tanlang.", 'Сначала определи, спрашивается граница или внутреннее место. Затем выбери формулу, единицу, вычисление и проверку.'),
    finish: T("Qurilish loyihasi hisoblari tugadi. Keyingi darsda karkas chiziqlari va uchburchak turlarini o'rganasiz.", 'Расчёты строительного проекта завершены. На следующем уроке ты изучишь линии каркаса и виды треугольников.'),
    checks: [
      q('atrofi / ichi', "«Atrofini o'rash» qaysi miqdorni so'raydi?", 'Какую величину требует «огородить вокруг»?', [['Perimetr', 'Периметр'], ['Yuza', 'Площадь'], ['Massa', 'Масса']], 0, "Atrof — chegara.", 'Вокруг — это граница.'),
      q('qoplash / romlash', "«Qoplash» qaysi miqdorni so'raydi?", 'Какую величину требует «покрыть»?', [['Yuza', 'Площадь'], ['Perimetr', 'Периметр'], ['Vaqt', 'Время']], 0, "Qoplama ichki joyni egallaydi.", 'Покрытие занимает внутреннюю часть.'),
      q('Zal 9 m × 6 m', "Pol va chet tasmasi uchun qaysi ikki miqdor kerak?", 'Какие две величины нужны для пола и окантовки?', ['S va P', 'Faqat S', 'Faqat P'], 0, "Pol — yuza, tasma — perimetr.", 'Пол — площадь, лента — периметр.'),
      q('▭  8 m × 5 m', "Avval pol yuzasini toping.", 'Сначала найди площадь пола.', ['13 m²', '26 m²', '40 m²'], 2, "8 × 5.", 'Вычисли 8 × 5.'),
      q('▭  8 m × 5 m', "Endi chet uzunligini toping.", 'Теперь найди длину края.', ['13 m', '26 m', '40 m'], 1, "(8 + 5) × 2.", 'Вычисли (8 + 5) × 2.'),
      q('savol → formula → birlik', "Masala yechish tartibi qaysi?", 'Каков порядок решения задачи?', [["Savolni aniqlash, formula, hisob, birlik", "Определить вопрос, формула, вычисление, единица"], ["Avval javob, keyin savol", "Сначала ответ, потом вопрос"], ["Faqat sonlarni ko'paytirish", "Только умножить числа"]], 0, "Miqdor turini birinchi aniqlang.", 'Сначала определи вид величины.'),
      q('P=(a+b)×2; S=a×b', "Qaysi formula ichki joyga tegishli?", 'Какая формула относится к внутреннему месту?', ['P=(a+b)×2', 'S=a×b', 'a+b'], 1, "Ichki joy — yuza.", 'Внутреннее место — площадь.'),
      q('Gilam: 7 m × 4 m', "Gilam yuzasi qancha?", 'Какова площадь ковра?', ['11 m²', '22 m²', '28 m²'], 2, "7 × 4.", 'Вычисли 7 × 4.'),
      q('Ramka: 12 cm × 3 cm', "Ramka uchun nechta cm tasma?", 'Сколько см ленты нужно для рамки?', ['15 cm', '30 cm', '36 cm'], 1, "Barcha tomonlarni qo'shing.", 'Сложи все стороны.'),
      q('Devor: 11 m × 3 m', "Bo'yoq uchun yuzani toping.", 'Найди площадь для покраски.', ['14 m²', '28 m²', '33 m²'], 2, "11 × 3.", 'Вычисли 11 × 3.'),
      q('S=48 m², a=8 m', "Noma'lum eni qancha?", 'Чему равна неизвестная ширина?', ['6 m', '40 m', '56 m'], 0, "48 ni 8 ga bo'ling.", 'Раздели 48 на 8.'),
      q('Bog‘ 10×4 m; panjara=40 m', "Xatoni toping.", 'Найди ошибку.', [["P=28 m bo'lishi kerak", "P должен быть 28 м"], ["40 m to'g'ri", "40 м верно"], ["P=14 m", "P=14 м"]], 0, "40 — bog'ning yuzasi soni.", '40 — числовое значение площади сада.'),
      q('Sahna 6×6 m; qoplama va tasma', "To'g'ri juftlikni tanlang.", 'Выбери верную пару.', ['S=36 m², P=24 m', 'S=24 m², P=36 m', 'S=12 m², P=36 m'], 0, "Kvadrat uchun ikki formulani qo'llang.", 'Примени две формулы квадрата.'),
      q('Panel S=54 cm², a=9 cm', "Eni va perimetrni toping.", 'Найди ширину и периметр.', ['b=6 cm, P=30 cm', 'b=45 cm, P=108 cm', 'b=6 cm, P=15 cm'], 0, "54:9=6; (9+6)×2=30.", '54:9=6; (9+6)×2=30.'),
      q('savol → P yoki S', "Eng muhim strategiya qaysi?", 'Какая стратегия главная?', [["Avval nimani topish so'ralganini bilish", "Сначала понять, что требуется найти"], ["Har doim ko'paytirish", "Всегда умножать"], ["Birlikni yozmaslik", "Не писать единицу"]], 0, "Formula savolga bog'liq.", 'Формула зависит от вопроса.'),
    ],
  },
  43: {
    titleUz: '43-dars. Uchburchak turlari. Parallel va perpendikulyar chiziqlar',
    titleRu: 'Урок 43. Виды треугольников. Параллельные и перпендикулярные прямые',
    story: T("Kristall ko'prik karkasida uchburchak tayanchlar va turli yo'nalishdagi chiziqlarni to'g'ri ajratish kerak.", 'В каркасе кристального моста нужно правильно различить треугольные опоры и линии разных направлений.'),
    rule: T("Uchburchaklar tomonlariga ko'ra teng tomonli, teng yonli va turli tomonli bo'ladi. Parallel chiziqlar kesishmaydi, perpendikulyar chiziqlar to'g'ri burchak ostida kesishadi.", 'По сторонам треугольники бывают равносторонними, равнобедренными и разносторонними. Параллельные прямые не пересекаются, перпендикулярные пересекаются под прямым углом.'),
    finish: T("Ko'prik karkasi to'g'ri tasniflandi. Keyingi darsda kristall naqshning simmetriya o'qi va burchak o'lchovi ochiladi.", 'Каркас моста правильно классифицирован. На следующем уроке откроются ось симметрии и измерение угла.'),
    checks: [
      q('△', "Uchburchakning nechta tomoni bor?", 'Сколько сторон у треугольника?', ['2', '3', '4'], 1, "Shakl chegaralarini sanang.", 'Посчитай стороны фигуры.'),
      q('90° └', "To'g'ri burchak nimaga o'xshaydi?", 'На что похож прямой угол?', [["Daftar katagi burchagiga", "На угол клетки тетради"], ["Yoyiq chiziqqa", "На развёрнутую линию"], ["Aylanaga", "На круг"]], 0, "Katakning burchagini eslang.", 'Вспомни угол клетки.'),
      q('3 cm, 3 cm, 3 cm', "Bu tayanch qaysi uchburchak?", 'Какой это треугольник?', [["Teng tomonli", "Равносторонний"], ["Teng yonli", "Равнобедренный"], ["Turli tomonli", "Разносторонний"]], 0, "Uchala tomon ham teng.", 'Все три стороны равны.'),
      q('5 cm, 5 cm, 3 cm', "Qaysi tur ko'rsatilgan?", 'Какой вид показан?', [["Teng yonli", "Равнобедренный"], ["Teng tomonli", "Равносторонний"], ["Turli tomonli", "Разносторонний"]], 0, "Ikkita teng tomonni toping.", 'Найди две равные стороны.'),
      q('4 cm, 5 cm, 6 cm', "Bu uchburchak qaysi tur?", 'Какой это треугольник?', [["Turli tomonli", "Разносторонний"], ["Teng yonli", "Равнобедренный"], ["Teng tomonli", "Равносторонний"]], 0, "Barcha tomonlar har xil.", 'Все стороны разные.'),
      q('────────\n────────', "Chiziqlar orasidagi bog'lanish qanday?", 'Как расположены прямые?', [["Parallel", "Параллельно"], ["Perpendikulyar", "Перпендикулярно"], ["Ustma-ust", "Совпадают"]], 0, "Ular davom ettirilsa ham kesishmaydi.", 'Они не пересекутся при продолжении.'),
      q('parallel ∥   perpendikulyar ⟂', "Perpendikulyar chiziqlarning belgisi qaysi?", 'Какой знак у перпендикулярных прямых?', ['∥', '⟂', '='], 1, "To'g'ri burchak hosil qiluvchi belgini tanlang.", 'Выбери знак прямого угла.'),
      q('△  7, 7, 4 cm', "Uchburchak turini toping.", 'Определи вид треугольника.', [["Teng yonli", "Равнобедренный"], ["Turli tomonli", "Разносторонний"], ["Teng tomonli", "Равносторонний"]], 0, "Ikki tomon teng.", 'Две стороны равны.'),
      q('┼', "Kesishgan chiziqlar qanday burchak hosil qildi?", 'Какой угол образовали прямые?', [["To'g'ri burchak", "Прямой угол"], ["O'tkir burchak", "Острый угол"], ["Burchak yo'q", "Угла нет"]], 0, "Katak burchagi bilan solishtiring.", 'Сравни с углом клетки.'),
      q('△  8, 6, 5 cm', "Mustaqil tasniflang.", 'Классифицируй самостоятельно.', [["Turli tomonli", "Разносторонний"], ["Teng yonli", "Равнобедренный"], ["Teng tomonli", "Равносторонний"]], 0, "Uchala o'lchamni solishtiring.", 'Сравни все три длины.'),
      q('ikki tomoni 9 cm', "Uchinchi tomon ham 9 cm bo'lsa, tur qanday o'zgaradi?", 'Если третья сторона тоже 9 см, каким станет треугольник?', [["Teng tomonli", "Равносторонним"], ["Turli tomonli", "Разносторонним"], ["To'rtburchak", "Четырёхугольником"]], 0, "Endi uchala tomon teng.", 'Теперь все три стороны равны.'),
      q("Temir yo'l relslari kesishadi", "Fikrdagi xatoni toping.", 'Найди ошибку в утверждении.', [["Parallel relslar kesishmaydi", "Параллельные рельсы не пересекаются"], ["Har qanday chiziq kesishadi", "Любые прямые пересекаются"], ["Relslar perpendikulyar", "Рельсы перпендикулярны"]], 0, "Parallel so'zining belgisini eslang.", 'Вспомни свойство параллельных.'),
      q('Karkas: 6, 6, 10 m', "Tayanch turi qaysi?", 'Какой вид у опоры?', [["Teng yonli", "Равнобедренный"], ["Teng tomonli", "Равносторонний"], ["Turli tomonli", "Разносторонний"]], 0, "Ikki bir xil uzunlik bor.", 'Есть две одинаковые длины.'),
      q("Yo'l va tik ustun: ⟂", "Ular qanday kesishadi?", 'Как они пересекаются?', [["To'g'ri burchak ostida", "Под прямым углом"], ["Kesishmaydi", "Не пересекаются"], ["Ustma-ust", "Совпадают"]], 0, "⟂ belgisini o'qing.", 'Прочитай знак ⟂.'),
      q('△ + ∥ + ⟂', "Asosiy xulosa qaysi?", 'Какой вывод главный?', [["Tomonlar uchburchak turini, kesishish chiziq turini bildiradi", "Стороны определяют вид треугольника, пересечение — вид прямых"], ["Barcha uchburchaklar bir xil", "Все треугольники одинаковы"], ["Parallel chiziqlar to'g'ri burchakda kesishadi", "Параллельные прямые пересекаются под прямым углом"]], 0, "Ikki tasnif belgisini ajrating.", 'Раздели два признака классификации.'),
    ],
  },
  44: {
    titleUz: "44-dars. O'q simmetriyasi va burchak gradusi",
    titleRu: 'Урок 44. Осевая симметрия и градусная мера угла',
    story: T("Kristall darvozaning ikki yarmi aynan mos tushishi va burilish burchagi aniq o'lchanishi kerak.", 'Две половины кристальных ворот должны точно совпасть, а угол поворота нужно измерить.'),
    rule: T("Simmetriya o'qi shaklni ustma-ust tushadigan ikki qismga bo'ladi. Burchak gradusda o'lchanadi: to'g'ri burchak 90°.", 'Ось симметрии делит фигуру на две совмещающиеся части. Угол измеряют в градусах: прямой угол равен 90°.'),
    finish: T("Darvoza naqshi simmetrik bo'ldi va burilish sozlandi. Keyingi darsda hajmli kristall shakllarni taniysiz.", 'Узор ворот стал симметричным, поворот настроен. На следующем уроке ты узнаешь объёмные кристаллические тела.'),
    checks: [
      q('◀│▶', "Ikki yarim haqida nima deyish mumkin?", 'Что можно сказать о двух половинах?', [["Bir-birining aksi", "Зеркальные отражения"], ["Har xil o'lchamda", "Разного размера"], ["Bog'lanmagan", "Не связаны"]], 0, "Oynadagi aksni tasavvur qiling.", 'Представь отражение в зеркале.'),
      q('└', "To'g'ri burchak necha gradus?", 'Сколько градусов в прямом угле?', ['45°', '90°', '180°'], 1, "Daftar katagi burchagini eslang.", 'Вспомни угол клетки.'),
      q('◇│◇', "O'qning vazifasi nima?", 'Какова роль оси?', [["Mos ikki qismga bo'lish", "Разделить на две совпадающие части"], ["Yuzani topish", "Найти площадь"], ["Perimetrni uzaytirish", "Увеличить периметр"]], 0, "Buklaganda qismlar ustma-ust tushishi kerak.", 'При сгибе части должны совпасть.'),
      q('□', "Kvadratning nechta simmetriya o'qi bor?", 'Сколько осей симметрии у квадрата?', ['2', '4', '8'], 1, "Ikki o'rta va ikki diagonal o'qni tekshiring.", 'Проверь две средние и две диагональные оси.'),
      q('▭', "Kvadrat bo'lmagan to'g'ri to'rtburchakda nechta o'q bor?", 'Сколько осей у неквадратного прямоугольника?', ['1', '2', '4'], 1, "Vertikal va gorizontal o'rtadan buklang.", 'Сложи пополам вертикально и горизонтально.'),
      q('45° < 90°', "45° qanday burchak?", 'Какой угол равен 45°?', [["O'tkir", "Острый"], ["To'g'ri", "Прямой"], ["O'tmas", "Тупой"]], 0, "U 90° dan kichik.", 'Он меньше 90°.'),
      q('<90° | =90° | >90°', "O'tmas burchak qaysi shartga mos?", 'Какому условию соответствует тупой угол?', ['<90°', '=90°', '>90° va <180°'], 2, "To'g'ri burchakdan kengroq.", 'Он шире прямого угла.'),
      q('∠ = 90°', "Burchak turini toping.", 'Определи вид угла.', [["To'g'ri", "Прямой"], ["O'tkir", "Острый"], ["O'tmas", "Тупой"]], 0, "90° — tayanch qiymat.", '90° — опорное значение.'),
      q('∠ = 120°', "Bu qanday burchak?", 'Какой это угол?', [["O'tmas", "Тупой"], ["O'tkir", "Острый"], ["To'g'ri", "Прямой"]], 0, "120° 90° dan katta.", '120° больше 90°.'),
      q('∠ = 35°', "Mustaqil tasniflang.", 'Классифицируй самостоятельно.', [["O'tkir", "Острый"], ["O'tmas", "Тупой"], ["Yoyiq", "Развёрнутый"]], 0, "35° 90° dan kichik.", '35° меньше 90°.'),
      q("yarim shakl + o'q", "Ikkinchi yarimni qanday tiklaysiz?", 'Как восстановить вторую половину?', [["Har nuqtani o'qdan teng masofada akslantirib", "Отразить каждую точку на равном расстоянии от оси"], ["Tasodifiy chizib", "Нарисовать случайно"], ["Faqat kattalashtirib", "Только увеличить"]], 0, "O'q oynadek ishlaydi.", 'Ось работает как зеркало.'),
      q("100° — o'tkir", "Xatoni toping.", 'Найди ошибку.', [["100° o'tmas burchak", "100° — тупой угол"], ["100° to'g'ri", "100° — прямой угол"], ["Fikr to'g'ri", "Утверждение верно"]], 0, "100° ni 90° bilan solishtiring.", 'Сравни 100° с 90°.'),
      q('Darvoza: chap naqsh │ ?', "O'ng qism qanday quriladi?", 'Как построить правую часть?', [["O'q bo'yicha akslantiriladi", "Отражается относительно оси"], ["90° ga tenglashtiriladi", "Приравнивается к 90°"], ["Perimetri qo'shiladi", "Складывается периметр"]], 0, "Simmetriya o'qi oynadir.", 'Ось симметрии — зеркало.'),
      q('Burilish 135°', "Bu burchak qaysi tur?", 'Какой это угол?', [["O'tmas", "Тупой"], ["O'tkir", "Острый"], ["To'g'ri", "Прямой"]], 0, "135° 90° va 180° orasida.", '135° между 90° и 180°.'),
      q("o'q ↔ aks; ° ↔ o'lchov", "Asosiy xulosa qaysi?", 'Какой вывод главный?', [["O'q mos qismlarni, gradus burchak kattaligini bildiradi", "Ось задаёт совпадающие части, градус — величину угла"], ["O'q yuzani hisoblaydi", "Ось вычисляет площадь"], ["Barcha burchaklar 90°", "Все углы равны 90°"]], 0, "Ikki yangi tushunchaning vazifasini ajrating.", 'Раздели роли двух новых понятий.'),
    ],
  },
  45: {
    titleUz: '45-dars. Piramida va konus',
    titleRu: 'Урок 45. Пирамида и конус',
    story: T("Kristall muzeyidagi hajmli modellarni asoslari, yoqlari, qirralari va uchlariga qarab joylashtirish kerak.", 'В кристальном музее нужно распределить объёмные модели по основаниям, граням, рёбрам и вершинам.'),
    rule: T("Piramidaning ko'pburchak asosi va bitta cho'qqida tutashgan uchburchak yon yoqlari bor. Konusning doira asosi, egri sirti va bitta uchi bor.", 'У пирамиды многоугольное основание и треугольные боковые грани, сходящиеся в вершине. У конуса круглое основание, криволинейная поверхность и одна вершина.'),
    finish: T("Muzey modellari to'g'ri joylashtirildi. Geometriya hududining asosiy kristall kalitlari yig'ildi.", 'Модели музея размещены верно. Главные кристальные ключи геометрической области собраны.'),
    checks: [
      q('□ va ◇', "Qaysi biri tekis shakl?", 'Какая фигура плоская?', [["Ikkalasi ham", "Обе"], ["Faqat kub", "Только куб"], ["Faqat konus", "Только конус"]], 0, "Ular qog'ozda ichki hajmsiz yotadi.", 'Они лежат на бумаге без объёма.'),
      q('kub', "Hajmli shakl nimasi bilan tekis shakldan farq qiladi?", 'Чем объёмная фигура отличается от плоской?', [["Joy egallaydi va uch o'lchamli", "Занимает пространство и имеет три измерения"], ["Faqat rangli", "Только цветом"], ["Tomoni yo'q", "Не имеет сторон"]], 0, "Uni turli tomondan ko'rish mumkin.", 'Её можно рассматривать с разных сторон.'),
      q("△ yon yoqlar → ● cho'qqi", "Qaysi jism tasvirlangan?", 'Какое тело описано?', [["Piramida", "Пирамида"], ["Konus", "Конус"], ["Silindr", "Цилиндр"]], 0, "Uchburchak yoqlar bitta cho'qqida uchrashadi.", 'Треугольные грани сходятся в вершине.'),
      q('doira asos + egri sirt', "Bu qaysi jism?", 'Какое это тело?', [["Konus", "Конус"], ["Piramida", "Пирамида"], ["Kub", "Куб"]], 0, "Muzqaymoq qalpog'ini eslang.", 'Вспомни рожок мороженого.'),
      q('kvadrat asosli piramida', "Uning yon yoqlari qanday shaklda?", 'Какой формы боковые грани?', [["Uchburchak", "Треугольники"], ["Doira", "Круги"], ["Kvadrat", "Квадраты"]], 0, "Yon yoqlar cho'qqida tutashadi.", 'Боковые грани сходятся в вершине.'),
      q('piramida ↔ konus', "Ikkalasining umumiy belgisi qaysi?", 'Какой общий признак?', [["Bitta yuqori uchi bor", "Есть одна верхняя вершина"], ["Asosi doira", "Основание — круг"], ["Barcha sirtlari tekis", "Все поверхности плоские"]], 0, "Yuqori qismlarini solishtiring.", 'Сравни верхние части.'),
      q('piramida: tekis yoqlar; konus: egri sirt', "Asosiy farq qaysi?", 'Какое главное различие?', [["Yon sirtining turi", "Вид боковой поверхности"], ["Ikkalasi tekis shakl", "Обе плоские"], ["Uchi soni", "Число вершин"]], 0, "Sirtlarni qo'l bilan tasavvur qiling.", 'Представь поверхности на ощупь.'),
      q('Misr inshooti', "Qaysi modelga mos?", 'Какой модели соответствует?', [["Piramida", "Пирамида"], ["Konus", "Конус"], ["Shar", "Шар"]], 0, "Ko'pburchak asos va cho'qqi bor.", 'Есть многоугольное основание и вершина.'),
      q("yo'l belgisi konusi", "Asosi qanday shakl?", 'Какой формы основание?', [["Doira", "Круг"], ["Uchburchak", "Треугольник"], ["Kvadrat", "Квадрат"]], 0, "Pastki tekis qismini ko'ring.", 'Посмотри на нижнюю плоскую часть.'),
      q('4 uchburchak yon yoq + kvadrat asos', "Jismni aniqlang.", 'Определи тело.', [["Kvadrat asosli piramida", "Пирамида с квадратным основанием"], ["Konus", "Конус"], ["Kub", "Куб"]], 0, "Yon yoqlar cho'qqida birlashadi.", 'Боковые грани сходятся в вершине.'),
      q("to'r: doira + doira bo'lagi", "Yig'ilganda qaysi jism chiqadi?", 'Какое тело получится после сборки?', [["Konus", "Конус"], ["Piramida", "Пирамида"], ["To'g'ri to'rtburchak", "Прямоугольник"]], 0, "Doira asos, doira bo'lagi egri sirt bo'ladi.", 'Круг станет основанием, сектор — боковой поверхностью.'),
      q("Konusda to'rtta tekis yon yoq bor", "Xatoni toping.", 'Найди ошибку.', [["Konusning yon sirti egri", "Боковая поверхность конуса кривая"], ["Konusda uch yoq bor", "У конуса три грани"], ["Fikr to'g'ri", "Утверждение верно"]], 0, "Konus piramida emas.", 'Конус — не пирамида.'),
      q('Muzey tokchasi: chodir va voronka', "Qaysi moslik to'g'ri?", 'Какое соответствие верно?', [["Chodir—piramida, voronka—konus", "Шатёр—пирамида, воронка—конус"], ["Chodir—konus, voronka—kub", "Шатёр—конус, воронка—куб"], ["Ikkalasi shar", "Оба — шары"]], 0, "Asos va sirtga qarang.", 'Смотри на основание и поверхность.'),
      q('doira asos, bitta uch, egri sirt', "Yangi model qaysi jism?", 'Какое тело описывает новая модель?', [["Konus", "Конус"], ["Piramida", "Пирамида"], ["Prizma", "Призма"]], 0, "Uchta belgining hammasini tekshiring.", 'Проверь все три признака.'),
      q('asos + sirt + uch', "Eng muhim tasnif usuli qaysi?", 'Какой способ классификации главный?', [["Jismning asos, sirt va uchlarini tekshirish", "Проверить основание, поверхность и вершины тела"], ["Faqat rangiga qarash", "Смотреть только на цвет"], ["Faqat balandligini o'lchash", "Измерить только высоту"]], 0, "Geometrik belgilar rangdan muhim.", 'Геометрические признаки важнее цвета.'),
    ],
  },
};

export function GeometryLesson({ number }) {
  const config = GEOMETRY_LESSONS[number];
  return (
    <Grade3LessonShell
      lessonId={`num-3-${number}`}
      screens={buildScreens(config)}
      titleUz={config.titleUz}
      titleRu={config.titleRu}
    />
  );
}
