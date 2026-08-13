#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src/components/grade4');
const FRAME_VECTOR = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const SCORED = [8, 9, 10, 12, 13];
const LANGS = ['uz', 'ru', 'en'];
const EXPECTED = {
  31: 'dars31-kattaliklarga-doir-masalalar',
  32: 'dars32-hajm-birliklari',
  33: 'dars33-burchak-turlari',
  34: 'dars34-burchaklarni-yasash',
  35: 'dars35-uchburchak-turlari',
  36: 'dars36-togri-tortburchak-va-kvadrat',
  37: 'dars37-perimetr-va-yuza',
  38: 'dars38-geometrik-yasashlar',
  39: 'dars39-nuqta-koordinatalari',
  40: 'dars40-fazoviy-shakllar-va-yoyilmalar',
  41: 'dars41-simmetriya-va-burilish-simmetriyasi',
  42: 'dars42-tenglamalar',
  43: 'dars43-tenglamalarni-yechish-va-tekshirish',
  44: 'dars44-murakkab-masalalar',
  45: 'dars45-harakatga-doir-masalalar',
  46: 'dars46-qism-va-butunni-topish',
  47: 'dars47-tengsizliklarni-tanlash-usuli',
  48: 'dars48-qoshish-xossalari',
  49: 'dars49-mulohazalar-va-hukmlar',
  50: 'dars50-grafiklar-va-malumotlar',
  51: 'dars51-yakuniy-takrorlash',
};
const EXPECTED_LESSON_TITLES = {
  31: { uz: 'Kattaliklarga doir masalalar', ru: 'Задачи с величинами', en: 'Problems with measurements' },
  32: { uz: 'Hajm birliklari', ru: 'Единицы объёма', en: 'Units of volume' },
  33: { uz: 'Burchak turlari', ru: 'Виды углов', en: 'Types of angles' },
  34: { uz: 'Burchaklarni yasash', ru: 'Построение углов', en: 'Constructing angles' },
  35: { uz: 'Uchburchak turlari', ru: 'Виды треугольников', en: 'Types of triangles' },
  36: { uz: "To'g'ri to'rtburchak va kvadrat", ru: 'Прямоугольник и квадрат', en: 'Rectangle and square' },
  37: { uz: 'Figuralarning perimetri va yuzi', ru: 'Периметр и площадь фигур', en: 'Perimeter and area' },
  38: { uz: 'Geometrik yasashlar', ru: 'Геометрические построения', en: 'Geometric constructions' },
  39: { uz: 'Nuqta koordinatalari va koordinata burchagi', ru: 'Координаты точки и координатный угол', en: 'Point coordinates and the coordinate plane' },
  40: { uz: 'Fazoviy shakllar va yoyilmalar', ru: 'Пространственные фигуры и развёртки', en: 'Solid shapes and nets' },
  41: { uz: 'Simmetriya va burilish simmetriyasi', ru: 'Симметрия и поворотная симметрия', en: 'Line and rotational symmetry' },
  42: { uz: 'Tenglamalar', ru: 'Уравнения', en: 'Equations' },
  43: { uz: 'Tenglamalarni yechish va tekshirish', ru: 'Решение уравнений с проверкой', en: 'Solving and checking equations' },
  44: { uz: 'Murakkab masalalar', ru: 'Составные задачи', en: 'Multi-step problems' },
  45: { uz: 'Harakatga doir masalalar', ru: 'Задачи на движение', en: 'Motion problems' },
  46: { uz: 'Qism va butunni topishga doir masalalar', ru: 'Задачи на нахождение части и целого', en: 'Problems finding a part or a whole' },
  47: { uz: 'Tengsizliklarni tanlash usulida yechish', ru: 'Решение неравенств подбором', en: 'Solving inequalities by systematic trial' },
  48: { uz: "Qo'shishning o'rin almashtirish va guruhlash xossalari", ru: 'Переместительное и сочетательное свойства сложения', en: 'Commutative and associative properties of addition' },
  49: { uz: 'Mulohazalar va hukmlar', ru: 'Высказывания и суждения', en: 'Mathematical statements and judgements' },
  50: { uz: "Grafiklar va ma'lumotlarni tasvirlash usullari", ru: 'Графики и способы представления данных', en: 'Graphs and ways to represent data' },
  51: { uz: "O'rganilgan mavzularni yakuniy takrorlash", ru: 'Итоговое повторение изученных тем', en: 'Final connected review' },
};
const EXPECTED_UZ_TITLES = {
  31: [
    'Yashirin metr', 'Masala xaritasi', 'Qismlar birlashsa', 'Butundan qism ajralsa',
    "Vaqt chegarasidan o'tish", 'Bir xil qismlar takrorlansa', 'Yechish algoritmi',
    'Kabel hisobi tuzatildi', "Uzunliklar yig'indisi", 'Qolgan massa', 'Tadbir davomiyligi',
    'Standart yozuv', 'Bitning ortiqcha birligi', "Ta'mirlash kabeli", "O'lchash masalalari navigatori",
  ],
  32: [
    'Faqat old qatlammi?', 'Uzunlik, yuza, hajm', 'Birlik kub', 'Qatlamlarni sanaymiz',
    'Qaysi birlik qulay?', 'Bir kub detsimetr', 'Kub detsimetr va litr', 'Hajmni topish',
    'Mos birlik', 'Kubchalarni sanang', 'dm³ dan cm³ ga', 'Litr bilan teng hajm',
    "Bit uchinchi o'lchamni unutdi", 'Suv baki', 'Hajm xaritasi',
  ],
  33: [
    'Uzun nur - katta burchakmi?', 'Burchakning qismlari', '90° etalon', '90° dan kichik',
    '90° va 180° orasida', '180°', 'Burchaklar shkalasi', "Ko'cha burilishlari",
    '35° qaysi tur?', '90° qaysi tur?', '125° qaysi tur?', '180° qaysi tur?',
    "Bit nurlarni o'lchadi", "Yo'l chorrahasi", 'Burchaklar kompassi',
  ],
  34: [
    '60° yoki 120°?', 'Transportir qismlari', 'Nol qayerdan boshlanadi?', 'Birinchi nur',
    'Belgi va ikkinchi nur', "O'tmas burchak", 'Tekshiruv', 'Yasash algoritmi',
    'Markaz qayerda?', 'Qaysi 70°?', "115° qanday bo'ladi?", "To'g'ri tartib",
    "Bit noto'g'ri nolni oldi", "135° ko'cha burilishi", 'Aniq burchak quruvchisi',
  ],
  35: [
    'Bitta uchburchak - ikki nom', 'Uchburchak anatomiyasi', 'Teng tomonli', 'Teng yonli',
    'Turli tomonli', "Burchaklariga ko'ra", 'Ikki tasnif', "Ko'prik tayanchi pasporti",
    '6-6-6', '5-5-8', '4-5-6', '45°-45°-90°', "Bit rasmning burilishiga ishondi",
    'Ferma tayanchi', 'Uchburchaklar katalogi',
  ],
  36: [
    'Kvadrat qaysi oilada?', "To'rtburchak", "To'rtta to'g'ri burchak", 'Qarama-qarshi tomonlar',
    "Kvadratning qo'shimcha xossasi", 'Umumiy va farqli', 'Har bir qoidasi', 'Fasad katalogi',
    'Xossadan figuraga', "Yo'qolgan tomon", "Doim to'g'ri gap", 'Qiya turgan kvadrat',
    "To'rtta teng tomon yetarlimi?", 'Oyna loyihasi', "To'rtburchaklar oilasi",
  ],
  37: [
    '26 m yoki 40 m²?', 'Chegara va ichki qism', "To'g'ri to'rtburchak perimetri", 'Kvadrat perimetri',
    "To'g'ri to'rtburchak yuzi", 'Kvadrat yuzi', 'Qaysi kattalik kerak?', 'Tom loyihasi',
    '7×4 perimetri', '7×4 yuzi', "Tomoni 6 bo'lgan kvadrat", 'Bir xil perimetr, boshqa yuza',
    "Bit ko'paytirdi", "Bog', panjara va hovuz", 'Chegara yoki ichki qism?',
  ],
  38: [
    'Bitta asbob yetadimi?', "Chizg'ichning ikki vazifasi", '7 cm kesma', "Go'niya", 'Perpendikulyar',
    'Parallel', 'Transportirni joylashtirish', '65° yasash', '7 cm uchun asbob', 'Transportir markazi',
    '65° tartibi', 'Nuqtadan perpendikulyar', 'Parallel chiziqda nima saqlanadi?', 'Chizma rejasi',
    'Yasash ustasining tekshiruvlari',
  ],
  39: [
    '(4; 3) yoki (3; 4)?', 'Koordinata burchagi', 'Sanash qayerdan boshlanadi?', 'Avval x, keyin y',
    "Koordinatani o'qish", 'Bir xil x va bir xil y', 'Masshtab', 'Koordinata algoritmi',
    'A(2; 5)', "x o'qidagi nuqta", 'Bir balandlikda', "4 birlik o'ngga", 'Bit kataklarni sanadimi?',
    "Yo'qolgan uch", 'Koordinata navigatori',
  ],
  40: [
    "Har olti kvadrat kub bo'ladimi?", 'Yassi va fazoviy', 'Yoq, qirra, uch', "To'g'ri burchakli parallelepiped",
    'Kub - maxsus parallelepiped', '6-12-8', 'Yoyilma qanday buklanadi?', 'Yoyilma tekshiruvi',
    'Olti kvadrat yoq', 'Parallelepiped pasporti', 'Kub yoyilmasi', 'Qaysi yoyilma buklanadi?',
    'Kubmi yoki parallelepipedmi?', 'Bitning 2×3 yoyilmasi', 'Fazoviy shakl inspektori',
  ],
  41: [
    'Oynada va burilganda', "Simmetriya o'qi", "Vertikal va gorizontal o'qlar", "Teng bo'lish yetarli emas",
    'Burilish simmetriyasi', "Kvadrat va to'g'ri to'rtburchak", 'Ikki simmetriya birga', 'Simmetriya algoritmi',
    "Aynan ikkita o'q", 'Kvadratning eng kichik burilishi', "To'g'ri to'rtburchak", "O'qli, ammo burilishsiz",
    "Bit to'rtta o'q berdi", 'Logo talabi', 'Simmetriya detektori',
  ],
  42: [
    "Bo'sh katakdagi son", 'Ifoda va tenglama', "Noma'lum va ildiz", 'Tarozi modeli',
    "Qo'shish va ayirish", "Ko'paytirish va bo'lish", "Noma'lum qayerda?", 'Tenglama kompassi',
    'Qaysi yozuv tenglama?', 'x+37=82', 'x-46=29', '96-x=38', '8x=72', 'x÷8=36', "Tenglama yo'li",
  ],
  43: [
    '42 yoki 52?', 'Tekshiruv nima qiladi?', 'x+245=700', '900-x=376', 'x-268=457', '8x=376',
    "Bo'lishning ikki ko'rinishi", 'Yechim va tekshiruv protokoli', 'x+245=700', '900-x=376',
    'x-268=457', '8x=376', 'x÷9=64', '864÷x=12', 'Ildiz nazoratchisi',
  ],
  44: [
    'Bitta savol, ikkita amal', 'Sodda va murakkab', 'Yashirin oraliq savol', 'Qism-butun modeli',
    "Ko'paytirish, so'ng ayirish", "Qo'shish, so'ng bo'lish", 'Tekshiruv', 'Murakkab masala marshruti',
    'Birinchi amal', 'Mos ifoda', 'Qutilar va sarflangan buyumlar', 'Teng taqsimlash',
    "Bit oraliq natijada to'xtadi", 'Uch amalli masala', 'Matndan yechimgacha',
  ],
  45: [
    'Ikki transport qachon uchrashadi?', 'S-v-t tayanchi', 'Masofa bir soatda', 'Uchrashuv jadvali',
    'Yaqinlashish tezligi', 'Ikki tomonga uzoqlashish', 'Quvib yetish', "Kechroq yo'lga chiqish",
    'Uchrashuv vaqti', 'Uzoqlashish masofasi', 'Quvib yetish vaqti', "Yig'indimi yoki ayirmami?",
    'Bit ayirmani tanladi', 'Kechikib chiqqan mashina', "Yo'nalishdan vaqtgacha",
  ],
  46: [
    "3/5 qism 18 bo'lsa", 'Maxraj nimani aytadi?', 'Surat nimani aytadi?', 'Bitta ulush', 'Butunni tiklash',
    'Butundan qismga', 'Qolgan qism', 'Qism-butun algoritmi', '4/6 qismi', '3/4 qism 21',
    'Qolgan miqdor', 'Qaysi ifoda?', 'Bit suratni unutdi', 'Energiya zaxirasi', 'Qism va butun navigatori',
  ],
  47: [
    'Bitta emas, bir nechta yechim', 'Tenglik va tengsizlik', 'Tartibli tekshiruv', 'Chegarani topamiz',
    "Yechimlar to'plami", 'Nega keyingilari mos emas?', "Qat'iy va noqat'iy chegara", 'Tanlash algoritmi',
    '2x+1<10', 'x+6≤10', '18-2x>8', 'Chegara qiymati', "Bit bitta yechimda to'xtadi",
    'Ikki shartli kod', 'Tengsizlik navigatori',
  ],
  48: [
    '47+26+53 ni tez hisoblash', "O'rin almashtirish", "Yig'indi saqlanadi", 'Guruhlash',
    'Ikki xossa birga', 'Qulay juftlar', 'Xossaning chegarasi', 'Qulay hisoblash strategiyasi',
    '36+27+64', "O'rin almashtirish formulasi", 'Guruhlash formulasi', '398+127+2',
    'Bit 2 ni ikki marta ishlatdi', 'Lumo xarajatlari', 'Almashtir, guruhla, hisobla',
  ],
  49: [
    "Har bir to'g'ri to'rtburchak kvadrat", 'Mulohazaning ikki belgisi', "Rost, yolg'on yoki mulohaza emas",
    'Qanday tekshiramiz?', 'Qarshi misol', 'Ochiq gap', 'Va va yoki', 'Mulohazani tekshirish',
    'Rost mulohaza', 'Mulohaza emas', "Qiymat qo'ying", 'Va mulohazasi',
    'Bit ikki misol bilan isbotladi', 'Lumo kodi', 'Gapdan dalilgacha',
  ],
  50: [
    'Jadval va grafik nega farq qildi?', 'Jadval manzillari', 'Ustunli diagramma', 'Masshtab',
    'Taqqoslash', 'Chiziqli grafik', 'Jadvaldan grafikka', "Grafikni o'qish algoritmi", 'Eng katta ustun',
    'Masshtabdagi nuqta', 'Ikki kun farqi', 'Tendensiya', 'Bit kataklarni sanadimi?',
    'Yetti kunlik suv sarfi', "Ma'lumot navigatori",
  ],
  51: [
    'Lumo shahrini qayta ishga tushirish', 'Universal fikrlash sikli', "Ko'p xonali sonlar", 'Qulay hisoblash',
    'Kasr, qism va qoldiq', 'Kattalik va geometriya', 'Tenglama va tengsizlik', "Ma'lumotdan xulosagacha",
    'Razryadli yozuv', "Qulay yig'indi", 'Kasr va birlik', 'Devor yoki maydon?', 'Ikki transport',
    'Grafik asosidagi mulohaza', 'Kursning yagona xaritasi',
  ],
};
const EXPECTED_RU_TITLES = {
  31: [
    'Скрытый метр', 'Карта задачи', 'Когда части объединяются', 'Когда часть убирают',
    'Переход через час', 'Когда равные части повторяются', 'Алгоритм решения',
    'Расчёт кабеля исправлен', 'Сумма длин', 'Оставшаяся масса', 'Продолжительность события',
    'Стандартная запись', 'Лишняя единица Бита', 'Кабель для ремонта', 'Навигатор задач с величинами',
  ],
  32: [
    'Только передний слой?', 'Длина, площадь, объём', 'Единичный куб', 'Считаем слои',
    'Какая единица удобна?', 'Один кубический дециметр', 'Кубический дециметр и литр', 'Находим объём',
    'Подходящая единица', 'Посчитайте кубики', 'Из дм³ в см³', 'Равный объём в литрах',
    'Бит забыл третье измерение', 'Бак для воды', 'Карта объёма',
  ],
  33: [
    'Длинный луч — большой угол?', 'Части угла', 'Эталон 90°', 'Меньше 90°',
    'Между 90° и 180°', '180°', 'Шкала углов', 'Уличные повороты',
    'Какой вид у 35°?', 'Какой вид у 90°?', 'Какой вид у 125°?', 'Какой вид у 180°?',
    'Бит измерил лучи', 'Дорожный перекрёсток', 'Компас углов',
  ],
  34: [
    '60° или 120°?', 'Части транспортира', 'Где начинается ноль?', 'Первый луч',
    'Отметка и второй луч', 'Тупой угол', 'Проверка', 'Алгоритм построения',
    'Где должен быть центр?', 'Какие 70°?', 'Каким будет 115°?', 'Правильный порядок',
    'Бит начал не с того нуля', 'Уличный поворот 135°', 'Мастер точных углов',
  ],
  35: [
    'Один треугольник — два названия', 'Строение треугольника', 'Равносторонний', 'Равнобедренный',
    'Разносторонний', 'По углам', 'Две классификации', 'Паспорт опоры моста',
    '6–6–6', '5–5–8', '4–5–6', '45°–45°–90°', 'Бит поверил положению рисунка',
    'Опора фермы', 'Каталог треугольников',
  ],
  36: [
    'К какому семейству относится квадрат?', 'Четырёхугольник', 'Четыре прямых угла', 'Противоположные стороны',
    'Дополнительное свойство квадрата', 'Общее и различное', 'Правило «каждый»', 'Каталог фасада',
    'От свойства к фигуре', 'Пропавшая сторона', 'Всегда верное утверждение', 'Наклонённый квадрат',
    'Достаточно ли четырёх равных сторон?', 'Проект окна', 'Семейство четырёхугольников',
  ],
  37: [
    '26 м или 40 м²?', 'Граница и внутренняя часть', 'Периметр прямоугольника', 'Периметр квадрата',
    'Площадь прямоугольника', 'Площадь квадрата', 'Какая величина нужна?', 'Проект крыши',
    'Периметр 7×4', 'Площадь 7×4', 'Квадрат со стороной 6', 'Одинаковый периметр, разная площадь',
    'Бит умножил', 'Сад, забор и пруд', 'Граница или внутренняя часть?',
  ],
  38: [
    'Достаточно одного инструмента?', 'Две функции линейки', 'Отрезок 7 см', 'Угольник', 'Перпендикуляр',
    'Параллель', 'Размещение транспортира', 'Построение 65°', 'Инструмент для 7 см', 'Центр транспортира',
    'Порядок для 65°', 'Перпендикуляр через точку', 'Что сохраняется при построении параллели?',
    'План построения', 'Проверки мастера построений',
  ],
  39: [
    '(4; 3) или (3; 4)?', 'Координатный угол', 'Откуда начинаем считать?', 'Сначала x, затем y',
    'Чтение координаты', 'Одинаковые x и y', 'Масштаб', 'Алгоритм координат',
    'A(2; 5)', 'Точка на оси x', 'На одной высоте', 'На 4 единицы вправо',
    'Бит посчитал клетки?', 'Пропавшая вершина', 'Координатный навигатор',
  ],
  40: [
    'Любые шесть квадратов образуют куб?', 'Плоское и пространственное', 'Грань, ребро, вершина',
    'Прямоугольный параллелепипед', 'Куб — особый параллелепипед', '6–12–8',
    'Как складывается развёртка?', 'Проверка развёртки', 'Шесть квадратных граней',
    'Паспорт параллелепипеда', 'Развёртка куба', 'Какая развёртка складывается?',
    'Куб или параллелепипед?', 'Развёртка Бита 2×3', 'Инспектор объёмных фигур',
  ],
  41: [
    'В зеркале и при повороте', 'Ось симметрии', 'Вертикальная и горизонтальная оси',
    'Разделить поровну недостаточно', 'Поворотная симметрия', 'Квадрат и прямоугольник',
    'Два вида симметрии вместе', 'Алгоритм симметрии', 'Ровно две оси',
    'Наименьший поворот квадрата', 'Прямоугольник', 'Осевая, но не поворотная',
    'Бит отметил четыре оси', 'Требование к логотипу', 'Детектор симметрии',
  ],
  42: [
    'Число в пустой клетке', 'Выражение и уравнение', 'Неизвестное и корень', 'Модель весов',
    'Сложение и вычитание', 'Умножение и деление', 'Где неизвестное?', 'Компас уравнения',
    'Какая запись — уравнение?', 'x+37=82', 'x−46=29', '96−x=38', '8x=72', 'x÷8=36',
    'Путь уравнения',
  ],
  43: [
    '42 или 52?', 'Что делает проверка?', 'x+245=700', '900−x=376', 'x−268=457', '8x=376',
    'Два вида деления', 'Протокол решения и проверки', 'x+245=700', '900−x=376',
    'x−268=457', '8x=376', 'x÷9=64', '864÷x=12', 'Контролёр корня',
  ],
  44: [
    'Один вопрос, два действия', 'Простая и составная', 'Скрытый промежуточный вопрос',
    'Модель «часть–целое»', 'Умножение, затем вычитание', 'Сложение, затем деление',
    'Проверка', 'Маршрут составной задачи', 'Первое действие', 'Подходящее выражение',
    'Коробки и использованные предметы', 'Равное распределение',
    'Бит остановился на промежуточном результате', 'Задача в три действия', 'От текста к решению',
  ],
  45: [
    'Когда встретятся два транспорта?', 'Связь S–v–t', 'Расстояние за один час', 'Таблица встречи',
    'Скорость сближения', 'Удаление в разные стороны', 'Догоняющее движение', 'Поздний старт',
    'Время встречи', 'Расстояние удаления', 'Время догоняния', 'Сумма или разность?',
    'Бит выбрал разность', 'Машина выехала позже', 'От направления ко времени',
  ],
  46: [
    'Если 3/5 равны 18', 'Что показывает знаменатель?', 'Что показывает числитель?', 'Одна доля',
    'Восстанавливаем целое', 'От целого к части', 'Оставшаяся часть', 'Алгоритм «часть–целое»',
    '4/6 часть', '3/4 равны 21', 'Оставшееся количество', 'Какое выражение?',
    'Бит забыл числитель', 'Запас энергии', 'Навигатор части и целого',
  ],
  47: [
    'Не одно, а несколько решений', 'Равенство и неравенство', 'Проверяем по порядку',
    'Находим границу', 'Множество решений', 'Почему следующие не подходят?',
    'Строгая и нестрогая граница', 'Алгоритм подбора', '2x+1<10', 'x+6≤10',
    '18−2x>8', 'Граничное значение', 'Бит остановился на одном решении',
    'Код с двумя условиями', 'Навигатор неравенств',
  ],
  48: [
    'Быстро вычисляем 47+26+53', 'Переместительное свойство', 'Сумма сохраняется',
    'Сочетательное свойство', 'Оба свойства вместе', 'Удобные пары', 'Граница свойства',
    'Стратегия удобного счёта', '36+27+64', 'Формула переместительного свойства',
    'Формула сочетательного свойства', '398+127+2', 'Бит использовал 2 дважды',
    'Расходы Lumo', 'Переставьте, сгруппируйте, вычислите',
  ],
  49: [
    '«Каждый прямоугольник — квадрат»', 'Два признака высказывания',
    'Истина, ложь или не высказывание', 'Как проверяем?', 'Контрпример', 'Открытое предложение',
    '«И» и «или»', 'Проверка высказывания', 'Истинное высказывание', 'Не является высказыванием',
    'Подставьте значение', 'Высказывание с «и»', 'Бит доказал двумя примерами', 'Код Lumo',
    'От предложения к доказательству',
  ],
  50: [
    'Почему таблица и график различаются?', 'Адреса таблицы', 'Столбчатая диаграмма', 'Масштаб',
    'Сравнение', 'Линейный график', 'Из таблицы в график', 'Алгоритм чтения графика',
    'Самый высокий столбец', 'Точка по масштабу', 'Разница между днями', 'Тенденция',
    'Бит посчитал клетки?', 'Расход воды за семь дней', 'Навигатор данных',
  ],
  51: [
    'Перезапуск города Lumo', 'Универсальный цикл мышления', 'Многозначные числа',
    'Удобные вычисления', 'Дробь, часть и остаток', 'Величины и геометрия',
    'Уравнение и неравенство', 'От данных к выводу', 'Разрядная запись', 'Удобная сумма',
    'Дробь и единица', 'Стена или площадь?', 'Два транспорта', 'Высказывание по графику',
    'Единая карта курса',
  ],
};
const EXPECTED_EN_TITLES = {
  31: [
    'The hidden metre', 'Problem map', 'When parts combine', 'When a part is removed',
    'Crossing an hour boundary', 'When equal parts repeat', 'Solving algorithm',
    'The cable calculation is fixed', 'Adding lengths', 'Remaining mass', 'Event duration',
    'Standard form', "Bit's unconverted unit", 'Repair cable', 'Measurement problem navigator',
  ],
  32: [
    'Only the front layer?', 'Length, area, volume', 'Unit cube', 'Counting layers',
    'Which unit is suitable?', 'One cubic decimetre', 'Cubic decimetre and litre', 'Finding volume',
    'Suitable unit', 'Count the cubes', 'From dm³ to cm³', 'Equal volume in litres',
    'Bit forgot the third dimension', 'Water tank', 'Volume map',
  ],
  33: [
    'Does a longer ray mean a larger angle?', 'Parts of an angle', 'The 90° benchmark', 'Less than 90°',
    'Between 90° and 180°', '180°', 'Angle scale', 'Street turns',
    'What type is 35°?', 'What type is 90°?', 'What type is 125°?', 'What type is 180°?',
    'Bit measured the rays', 'Road junction', 'Angle compass',
  ],
  34: [
    '60° or 120°?', 'Parts of a protractor', 'Where does zero begin?', 'The first ray',
    'Mark and second ray', 'An obtuse angle', 'Check', 'Construction algorithm',
    'Where should the centre be?', 'Which 70° mark?', 'What type will 115° be?', 'Correct order',
    'Bit used the wrong zero', 'A 135° street turn', 'Precise angle builder',
  ],
  35: [
    'One triangle — two names', 'Triangle anatomy', 'Equilateral', 'Isosceles',
    'Scalene', 'By angles', 'Two classifications', 'Bridge support profile',
    '6–6–6', '5–5–8', '4–5–6', '45°–45°–90°', "Bit trusted the picture's orientation",
    'Truss support', 'Triangle catalogue',
  ],
  36: [
    'Which family does a square belong to?', 'Quadrilateral', 'Four right angles', 'Opposite sides',
    "The square's extra property", 'Shared and different', 'The “every” rule', 'Façade catalogue',
    'From property to shape', 'Missing side', 'Always true statement', 'A tilted square',
    'Are four equal sides enough?', 'Window design', 'Quadrilateral family',
  ],
  37: [
    '26 m or 40 m²?', 'Boundary and inside', 'Rectangle perimeter', 'Square perimeter',
    'Rectangle area', 'Square area', 'Which measure do we need?', 'Roof project',
    'Perimeter of 7×4', 'Area of 7×4', 'Square with side 6', 'Same perimeter, different area',
    'Bit multiplied', 'Garden, fence and pond', 'Boundary or inside?',
  ],
  38: [
    'Is one tool enough?', 'Two jobs of a ruler', 'A 7 cm segment', 'Set square', 'Perpendicular',
    'Parallel', 'Positioning a protractor', 'Constructing 65°', 'Tool for 7 cm', 'Protractor centre',
    'Order for 65°', 'Perpendicular through a point', 'What stays unchanged when drawing a parallel?',
    'Construction plan', "Construction master's checks",
  ],
  39: [
    '(4, 3) or (3, 4)?', 'Coordinate plane', 'Where do we start counting?', 'First x, then y',
    'Reading coordinates', 'Equal x and equal y', 'Scale', 'Coordinate algorithm',
    'A(2, 5)', 'Point on the x-axis', 'At the same height', '4 units right',
    'Did Bit count squares?', 'Missing vertex', 'Coordinate navigator',
  ],
  40: [
    'Do any six squares make a cube?', 'Flat and solid', 'Face, edge, vertex', 'Cuboid',
    'A cube is a special cuboid', '6–12–8', 'How does a net fold?', 'Net check',
    'Six square faces', 'Cuboid profile', 'Cube net', 'Which net folds?',
    'Cube or cuboid?', "Bit's 2×3 net", 'Solid shape inspector',
  ],
  41: [
    'In a mirror and after a turn', 'Line of symmetry', 'Vertical and horizontal lines',
    'Equal halves are not enough', 'Rotational symmetry', 'Square and rectangle',
    'Both kinds together', 'Symmetry algorithm', 'Exactly two lines',
    'Smallest turn of a square', 'Rectangle', 'Line but not rotational symmetry',
    'Bit marked four lines', 'Logo requirement', 'Symmetry detector',
  ],
  42: [
    'The number in the box', 'Expression and equation', 'Unknown and root', 'Balance model',
    'Addition and subtraction', 'Multiplication and division', 'Where is the unknown?', 'Equation compass',
    'Which is an equation?', 'x+37=82', 'x−46=29', '96−x=38', '8x=72', 'x÷8=36',
    'Equation route',
  ],
  43: [
    '42 or 52?', 'What does checking do?', 'x+245=700', '900−x=376', 'x−268=457', '8x=376',
    'Two division forms', 'Solve-and-check protocol', 'x+245=700', '900−x=376',
    'x−268=457', '8x=376', 'x÷9=64', '864÷x=12', 'Root checker',
  ],
  44: [
    'One question, two operations', 'One-step and multi-step', 'Hidden intermediate question',
    'Part–whole model', 'Multiply, then subtract', 'Add, then divide', 'Check',
    'Multi-step problem route', 'First operation', 'Matching expression', 'Boxes and used items',
    'Equal sharing', 'Bit stopped at the intermediate result', 'Three-step problem', 'From text to solution',
  ],
  45: [
    'When will the two vehicles meet?', 'The S–v–t relationship', 'Distance in one hour', 'Meeting table',
    'Closing speed', 'Moving apart', 'Catching up', 'A delayed start', 'Meeting time',
    'Distance apart', 'Catch-up time', 'Sum or difference?', 'Bit chose the difference',
    'The car left later', 'From direction to time',
  ],
  46: [
    'If 3/5 equals 18', 'What does the denominator tell us?', 'What does the numerator tell us?',
    'One share', 'Rebuilding the whole', 'From whole to part', 'Remaining part',
    'Part–whole algorithm', '4/6 of a whole', '3/4 equals 21', 'Amount remaining',
    'Which expression?', 'Bit forgot the numerator', 'Energy reserve', 'Part–whole navigator',
  ],
  47: [
    'More than one solution', 'Equality and inequality', 'Check in order', 'Finding the boundary',
    'Solution set', 'Why do later values fail?', 'Strict and inclusive boundaries',
    'Systematic trial algorithm', '2x+1<10', 'x+6≤10', '18−2x>8', 'Boundary value',
    'Bit stopped after one solution', 'Two-condition code', 'Inequality navigator',
  ],
  48: [
    'Calculating 47+26+53 quickly', 'Commutative property', 'The sum stays the same',
    'Associative property', 'Both properties together', 'Friendly pairs', 'Property boundary',
    'Efficient addition strategy', '36+27+64', 'Commutative formula', 'Associative formula',
    '398+127+2', 'Bit used 2 twice', 'Lumo expenses', 'Reorder, group, calculate',
  ],
  49: [
    '“Every rectangle is a square”', 'Two features of a statement', 'True, false or not a statement',
    'How do we check?', 'Counterexample', 'Open sentence', '“And” and “or”', 'Checking a statement',
    'True statement', 'Not a statement', 'Substitute a value', 'An “and” statement',
    'Bit proved it with two examples', 'Lumo code', 'From sentence to evidence',
  ],
  50: [
    'Why do the table and graph disagree?', 'Table locations', 'Bar chart', 'Scale', 'Comparing',
    'Line graph', 'From table to graph', 'Graph-reading algorithm', 'Highest bar',
    'Point on the scale', 'Difference between two days', 'Trend', 'Did Bit count squares?',
    'Seven-day water use', 'Data navigator',
  ],
  51: [
    'Restarting Lumo City', 'Universal thinking cycle', 'Multi-digit numbers', 'Efficient calculation',
    'Fraction, part and remainder', 'Measures and geometry', 'Equation and inequality',
    'From data to conclusion', 'Place-value form', 'Efficient sum', 'Fraction and unit',
    'Boundary or area?', 'Two vehicles', 'Graph-based statement', 'One map of the course',
  ],
};
const REQUIRED_UZ_VISUAL = {
  31: ['3 m 45 cm + 2 m 80 cm', '5 m 125 cm', '6 m 25 cm', '1 t 550 kg', '2 h 20 min', '175 + 240 + 85'],
  32: ['1 cm³', '4 × 3 × 2 = 24', '1 dm³ = 1000 cm³', '1 dm³ = 1 l', '2 dm³ = ? cm³'],
  33: ['35° < 90°', '90° < 125° < 180°', '180°', '110°'],
  34: ['60°', '120°', '75°', '70°', '135°'],
  35: ['a = b = c', 'a = b', 'a ≠ b, b ≠ c, a ≠ c', '5 va 5', '45°-45°-90°'],
  36: ['4 ta 90°', 'Barcha tomonlar teng', '8 cm', '6 dm'],
  37: ['P = 2 × (a + b)', 'P = 4a', 'S = a × b', 'S = a²', '54 m²'],
  38: ['AB = 7 cm', '90°', '65°', 'AB=6 cm'],
  39: ['O = (0; 0)', 'A(4; 3)', 'B(2; 5)', '1 katak = 2 birlik', 'A(2;2)'],
  40: ['6 yoq', '12 qirra', '8 uch', '2×3'],
  41: ['360° dan kichik', '90°', '180°', "2 ta o'q"],
  42: ['□ + 28 = 65', 'x=37', '8x=72', '96-x=38', 'x÷8=36'],
  43: ['x+158=210', '455+245', '900-524', '47×8', '864÷72'],
  44: ['6 × 24', '320+4×45-96', '(5×28+20)÷8', '(200-76)÷4'],
  45: ['240 km', '50 km/h', '70 km/h', '50+70=120', '420÷(60+45)', '40÷20=2'],
  46: ['3/5', '18÷3', '6×5', '45÷5×3', '18÷3×8=48'],
  47: ['3x+4<20', 'x=5', 'x=6', '{0,1,2,3,4,5}', '2x+1<12'],
  48: ['47+26+53', 'a+b=b+a', '(a+b)+c=a+(b+c)', '398+127+2', '700'],
  49: ['7×8=56', "6 soni 4 ga bo'linmaydi", 'x+3=8', '18 juft'],
  50: ['1 katak 10 birlik', 'A=50', 'B=30', '55 va 35', '20, 30, 30, 45'],
  51: ['507 042', '398+127+2', '1200 g', '360 km', "15 birlik ko'p"],
};
const requested = new Set(process.argv.slice(2).map((value) => value.replace(/\.jsx$/, '')));
const selectedEntries = Object.entries(EXPECTED).filter(([lesson]) => (
  requested.size === 0 || requested.has(`Dars${lesson}`)
));

const failures = [];
const notes = [];
const fail = (lesson, message) => failures.push(`Dars${lesson}: ${message}`);
const note = (lesson, message) => notes.push(`Dars${lesson}: ${message}`);
const NUMERIC_ASSERTIONS = [
  [31, 'kabel santimetrda', 345 + 280, 625],
  [31, 'qolgan massa', 2300 - 750, 1550],
  [31, 'minutlar', 45 + 35, 80],
  [31, 'takroriy kesma', 125 * 4, 500],
  [31, "ta'mirlash kabeli", 175 + 240 + 85, 500],
  [32, 'kuboid hajmi', 4 * 3 * 2, 24],
  [32, 'ikki kub detsimetr', 2 * 1000, 2000],
  [37, 'yetti va to‘rt perimetri', 2 * (7 + 4), 22],
  [37, 'yetti va to‘rt yuzi', 7 * 4, 28],
  [37, 'maysa yuzi', 10 * 6 - 2 * 3, 54],
  [42, 'x plus o‘ttiz yetti', 82 - 37, 45],
  [42, 'noma’lum ayiriluvchi', 96 - 38, 58],
  [42, 'noma’lum bo‘linuvchi', 36 * 8, 288],
  [43, 'x plus ikki yuz qirq besh', 700 - 245, 455],
  [43, 'sakkiz x', 376 / 8, 47],
  [43, 'x bo‘lingan to‘qqiz', 64 * 9, 576],
  [43, 'sakkiz yuz oltmish to‘rt bo‘lingan x', 864 / 12, 72],
  [44, 'ifoda', 320 + 4 * 45 - 96, 404],
  [44, 'qutilar', 6 * 24 - 37, 107],
  [44, 'teng taqsimlash', (5 * 28 + 20) / 8, 20],
  [44, 'uch amal', (8 * 25 - 76) / 4, 31],
  [45, 'uchrashuv', 420 / (60 + 45), 4],
  [45, 'uzoqlashish', (35 + 45) * 3, 240],
  [45, 'quvib yetish', 60 / (70 - 50), 3],
  [45, 'kech start', 40 / (60 - 40), 2],
  [46, 'to‘rtdan olti qism', 30 * 4 / 6, 20],
  [46, 'butunni tiklash', 21 / 3 * 4, 28],
  [46, 'qoldiq', 45 - 45 * 2 / 5, 27],
  [46, 'energiya butuni', 18 / 3 * 8, 48],
  [48, 'birinchi qulay yig‘indi', 47 + 26 + 53, 126],
  [48, 'ikkinchi qulay yig‘indi', 36 + 27 + 64, 127],
  [48, 'uchinchi qulay yig‘indi', 398 + 127 + 2, 527],
  [48, 'Lumo xarajatlari', 450 + 175 + 50 + 25, 700],
  [50, 'ikki kun farqi', 55 - 35, 20],
  [51, 'ikki kilogrammning uchdan beshi grammda', 2000 * 3 / 5, 1200],
  [51, 'yakuniy uchrashuv vaqti', 360 / (50 + 40), 4],
];
for (const [lesson, label, actual, expected] of NUMERIC_ASSERTIONS) {
  if (actual !== expected) fail(lesson, `${label}: ${actual}, kutilgan ${expected}`);
}
const DIGITS = Array.from({ length: 10 }, (_, value) => value);
const INEQUALITY_ASSERTIONS = [
  ['3x+4<20', DIGITS.filter((x) => 3 * x + 4 < 20), [0, 1, 2, 3, 4, 5]],
  ['2x+1<10', DIGITS.filter((x) => 2 * x + 1 < 10), [0, 1, 2, 3, 4]],
  ['x+6<=10', DIGITS.filter((x) => x + 6 <= 10), [0, 1, 2, 3, 4]],
  ['18-2x>8', DIGITS.filter((x) => 18 - 2 * x > 8), [0, 1, 2, 3, 4]],
  ['2x+1<12 va x>2', DIGITS.filter((x) => 2 * x + 1 < 12 && x > 2), [3, 4, 5]],
];
for (const [label, actual, expected] of INEQUALITY_ASSERTIONS) {
  if (actual.join(',') !== expected.join(',')) fail(47, `${label}: {${actual}}, kutilgan {${expected}}`);
}

function extractBalanced(source, startToken, open = '{', close = '}') {
  const start = source.indexOf(startToken);
  if (start < 0) return null;
  let index = source.indexOf(open, start);
  if (index < 0) return null;
  const from = index;
  let depth = 0;
  let quote = null;
  for (; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === '\\') index += 1;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '/' && source[index + 1] === '/') {
      index = source.indexOf('\n', index);
      if (index < 0) break;
      continue;
    }
    if (char === open) depth += 1;
    if (char === close) {
      depth -= 1;
      if (depth === 0) return source.slice(from, index + 1);
    }
  }
  return null;
}

function extractLiteral(source, name, open = '{', close = '}') {
  const raw = extractBalanced(source, `const ${name} =`, open, close);
  if (!raw) return null;
  try {
    return vm.runInNewContext(`(${raw})`, {
      bi: (uz, ru, en) => ({ uz, ru, en }),
      b: (uz, ru, en) => ({ uz, ru, en }),
      B: (ru, uz, en) => ({ uz, ru, en }),
    }, { timeout: 3000 });
  } catch (error) {
    return { __parseError: error.message };
  }
}

function isLocalised(node) {
  return node && typeof node === 'object' && !Array.isArray(node)
    && LANGS.some((lang) => Object.prototype.hasOwnProperty.call(node, lang));
}

function walk(node, at = '', activeLang = null, inAudio = false, output = []) {
  if (typeof node === 'string') {
    output.push({ at, lang: activeLang, value: node, inAudio });
    return output;
  }
  if (Array.isArray(node)) {
    node.forEach((value, index) => walk(value, `${at}[${index}]`, activeLang, inAudio, output));
    return output;
  }
  if (!node || typeof node !== 'object') return output;
  if (isLocalised(node)) {
    for (const lang of LANGS) {
      if (node[lang] == null || (typeof node[lang] === 'string' && !node[lang].trim())) {
        output.push({ at, lang, missing: true, inAudio });
      }
    }
  }
  Object.entries(node).forEach(([key, value]) => {
    const lang = LANGS.includes(key) ? key : activeLang;
    const spoken = inAudio || /audio/i.test(key) || key === 'feedbackAudio' || key === 'neutralAudio';
    walk(value, at ? `${at}.${key}` : key, lang, spoken, output);
  });
  return output;
}

function numericTokens(value, output = []) {
  if (typeof value === 'string') {
    output.push(...(value.match(/\d+/g) ?? []));
  } else if (Array.isArray(value)) {
    value.forEach((item) => numericTokens(item, output));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => numericTokens(item, output));
  }
  return output;
}

function validateVisibleNumericParity(lesson, node, at = '', inAudio = false) {
  if (!node || typeof node !== 'object') return;
  if (isLocalised(node)) {
    if (!inAudio) {
      const signatures = LANGS.map((lang) => numericTokens(node[lang]).sort((a, b) => Number(a) - Number(b)).join(','));
      if (signatures.some(Boolean) && !signatures.every((signature) => signature === signatures[0])) {
        fail(lesson, `${at || 'localized node'} numeric parity buzilgan: uz=[${signatures[0]}], ru=[${signatures[1]}], en=[${signatures[2]}]`);
      }
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((value, index) => validateVisibleNumericParity(lesson, value, `${at}[${index}]`, inAudio));
    return;
  }
  Object.entries(node).forEach(([key, value]) => {
    validateVisibleNumericParity(lesson, value, at ? `${at}.${key}` : key, inAudio || /audio/i.test(key));
  });
}

function introSegments(screen, lang) {
  const source = screen?.audio?.intro ?? screen?.audio;
  const value = source?.[lang];
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function normaliseTitle(value) {
  return String(value ?? '')
    .replace(/[‘’ʻʼ]/g, "'")
    .replace(/[–—−]/g, '-')
    .replace(/[«»“”„‟"']/g, '')
    .replace(/\s+/g, '')
    .toLocaleLowerCase('uz');
}

function normaliseVisual(value) {
  return String(value ?? '')
    .replace(/[‘’ʻʼ]/g, "'")
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, '')
    .toLocaleLowerCase('uz');
}

function normaliseFeedback(value) {
  return String(value ?? '')
    .trim()
    .replace(/[‘’ʻʼ]/g, "'")
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('uz');
}

const BANNED_GENERIC_FEEDBACK = [
  "bu tanlovda asosiy xossa e'tibordan chetda qolgan",
  'в этом выборе не учтено главное свойство',
  'this choice misses the key property',
  "modelni yana tekshiring",
  'снова проверьте модель',
  'check the model again',
  'birinchi variant mos emas',
  'ikkinchi variant mos emas',
  'uchinchi variant mos emas',
  'первый вариант не подходит',
  'второй вариант не подходит',
  'третий вариант не подходит',
  'option one does not fit',
  'option two does not fit',
  'option three does not fit',
];

const AMERICAN_ENGLISH = /\b(?:meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers|liter|liters|center|color|neighbor|neighbors)\b/i;

const CORRUPTED_TEXT = /to'gramm'ri|rost to'rtburchak|rost burchak|rost tanlov|rost joy|Yo'litr|Рассмотритем|\bIkkia\b|\bikkib\b|\bДваa\b|\bдваb\b|\bTwoa\b|\btwob\b|\bTo'rta\b|\bЧетыреa\b|\bFoura\b|\b(?:one|a|first|second|four) ninety degrees (?:angle|angles|marker|rotation)\b/i;
const CORRUPTED_RU_IMPERATIVE = /\b(?:Выберитете|Выделитете|Вычислитете|Запишитете|Измерьтете|Назовитете|Найдитете|Начнитете|Определитете|Поместитете|Поставьтете|Проведитете|Проверьтете|Прочитайтете|Совместитете|Сохраняйтете|Сравнитете|Выполнитеть)\b/i;
const RU_SINGULAR_IMPERATIVE = /(?:^|[^А-Яа-яЁё])(?:начни|выбери|найди|проверь|поверни|посчитай|сравни|определи|запиши|посмотри|вспомни|подставь|вычисли|раздели|умножь|сложи|отними|используй|расположи|измерь|проведи|совмести|помести|поставь|прочитай|сохраняй|назови|соедини|двигайся|пройди|построй|возьми|отметь)(?![А-Яа-яЁё])/i;
const UZ_SEPARATED_CASE_SUFFIX = /\b(?:bir|ikki|uch|to'rt|besh|olti|yetti|sakkiz|to'qqiz|o'n|yigirma|o'ttiz|qirq|ellik|oltmish|yetmish|sakson|to'qson|yuz|ming|daraja|metr|santimetr|kilometr|gramm|kilogramm|litr|soat|minut|katak|nuqta)\s+(?:ga|ni|ning|dan|da)\b/i;
const UZ_DETACHED_COUNT_SUFFIX = /\b(?:bir|ikki|uch|to'rt|besh|olti|yetti|sakkiz|to'qqiz|o'n|yigirma|o'ttiz|qirq|ellik|oltmish|yetmish|sakson|to'qson|yuz|ming)\s+ta\b/i;
const AUDIO_PUNCTUATION_GARBAGE = /[,.;]\s*,|\.\s*,|,\./;
const CORRUPTED_RU_AGREEMENT = /\b(?:один клетка|одна клетка (?:равно|равна) (?:два|две) единицам|два единицы|на два единицы|по один сантиметр|по тридцать один предмету)\b/i;

const BANNED_AUDIO_STEMS = [
  'birinchi tayanch',
  'navbatdagi kuzatuv',
  'buning sababi',
  'bu natija tanlangan amal yoki xossani tasdiqlaydi',
  "natija masala ma'nosiga mos kelishi kerak",
  'bu xulosa keyingi',
  'shu xulosa keyingi',
  'первый ориентир',
  'далее наблюдаем',
  'это важно, потому что',
  'проверка показывает',
  'этот результат подтверждает выбранное действие или свойство',
  'результат должен соответствовать смыслу задачи',
  'этот вывод',
  'first reference point',
  'next observation',
  'this follows because',
  'the check shows',
  'this result confirms the chosen operation or property',
  'the result must fit the meaning of the problem',
  'this conclusion supports',
  "to'gramm'ri",
  'ayiruv rost',
  "ayiruv yolg'on",
  'ayiruv chiziq',
  'ayiruv sirt',
  'минус истина',
  'минус ложь',
  'минус линия',
  'минус поверхность',
  'minus true',
  'minus false',
  'minus line',
  'minus surface',
  "holati ko'rsatiladi",
  'modelida endi',
  "degan fikrni ochadi",
  'yozuvi natijani tekshiradi',
  'xulosasi mustahkamlanadi',
  'в разделе',
  'проследите связь',
  'раскрывает мысль',
  'запись проверяет результат',
  'в конце темы',
  'this frame shows',
  'follow the relationship',
  'reveals the idea',
  'checks the result',
  'consolidate the conclusion',
];

const RUSSIAN_UNIT_AGREEMENT_ERRORS = /\b(?:один|два|три|четыре)\s+(?:метров|сантиметров|миллиметров|километров|литров|тонн|часов|минут)\b/i;
const ENGLISH_UNIT_AGREEMENT_ERRORS = /\bone\s+(?:metres|centimetres|millimetres|kilometres|litres|tonnes|hours|minutes|kilograms|grams)\b/i;

function validateContent(lesson, content) {
  if (!content || content.__parseError) {
    fail(lesson, `CONTENT parse bo'lmadi${content?.__parseError ? `: ${content.__parseError}` : ''}`);
    return;
  }
  validateVisibleNumericParity(lesson, content);
  const keys = Object.keys(content).filter((key) => /^s\d+$/.test(key));
  if (keys.length !== 15) fail(lesson, `CONTENT ekranlari ${keys.length}, kutilgan 15`);
  FRAME_VECTOR.forEach((count, screen) => {
    const item = content[`s${screen}`];
    if (!item) {
      fail(lesson, `s${screen} topilmadi`);
      return;
    }
    const expectedTitles = {
      uz: EXPECTED_UZ_TITLES[lesson]?.[screen],
      ru: EXPECTED_RU_TITLES[lesson]?.[screen],
      en: EXPECTED_EN_TITLES[lesson]?.[screen],
    };
    for (const lang of LANGS) {
      const expectedTitle = expectedTitles[lang];
      if (expectedTitle && normaliseTitle(item.title?.[lang]) !== normaliseTitle(expectedTitle)) {
        fail(lesson, `s${screen}.title.${lang} rejadan chetga chiqqan: "${item.title?.[lang] ?? ''}"; kutilgan "${expectedTitle}"`);
      }
    }
    if (!Array.isArray(item.frames) || item.frames.length !== count) {
      fail(lesson, `s${screen} visible frame ${item.frames?.length ?? 0}, kutilgan ${count}`);
    }
    if (typeof item.math === 'string') {
      const mathNumbers = new Set(numericTokens(item.math));
      const visibleNumbers = new Set(numericTokens({
        title: item.title,
        frames: item.frames,
        question: item.question,
        options: item.options,
        proof: item.proof,
      }));
      const staleNumbers = [...mathNumbers].filter((token) => !visibleNumbers.has(token));
      if (visibleNumbers.size > 0 && staleNumbers.length > 0) {
        fail(lesson, `s${screen}.math visual prop approved kontentga mos emas; begona sonlar [${staleNumbers.join(', ')}]`);
      }
    }
    LANGS.forEach((lang) => {
      const segments = introSegments(item, lang);
      if (segments.length !== count) {
        fail(lesson, `s${screen}.${lang} avtomatik audio beat ${segments.length}, kutilgan ${count}`);
      }
    });
    if (!SCORED.includes(screen)) return;
    if (!Array.isArray(item.options) || item.options.length < 3 || item.options.length > 4) {
      fail(lesson, `s${screen} variantlari ${item.options?.length ?? 0}, kutilgan 3 yoki 4`);
      return;
    }
    if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= item.options.length) {
      fail(lesson, `s${screen} correctIndex noto'g'ri`);
    } else {
      const correctNumbers = new Set(numericTokens(item.options[item.correctIndex]));
      const proofNumbers = new Set(numericTokens(item.proof));
      const missingFromProof = [...correctNumbers].filter((token) => !proofNumbers.has(token));
      if (correctNumbers.size > 0 && missingFromProof.length > 0) {
        fail(lesson, `s${screen}.proof to'g'ri variant sonlarini isbotlamaydi; yetishmaydi [${missingFromProof.join(', ')}]`);
      }
    }
    const visibleFeedback = item.feedback ?? item.audio?.on_wrong;
    if (!Array.isArray(visibleFeedback) || visibleFeedback.length !== item.options.length) {
      fail(lesson, `s${screen} har variant uchun visible feedback yo'q`);
    }
    if (!Array.isArray(item.feedbackAudio) || item.feedbackAudio.length !== item.options.length) {
      fail(lesson, `s${screen} har variant uchun TTS-safe feedbackAudio yo'q`);
    } else {
      for (const lang of LANGS) {
        const messages = item.feedbackAudio.map((entry) => normaliseFeedback(entry?.[lang]));
        if (messages.some((message) => !message)) {
          fail(lesson, `s${screen}.${lang} feedbackAudio ichida bo'sh matn bor`);
          continue;
        }
        if (new Set(messages).size !== messages.length) {
          fail(lesson, `s${screen}.${lang} variant feedbacklari takrorlangan; har misconception uchun alohida izoh kerak`);
        }
        for (const message of messages) {
          const banned = BANNED_GENERIC_FEEDBACK.find((phrase) => message.includes(phrase));
          if (banned) {
            fail(lesson, `s${screen}.${lang} generic feedback ishlatilgan: "${banned}"`);
          }
        }
        item.feedbackAudio.forEach((entry, index) => {
          const wordCount = String(entry?.[lang] ?? '').trim().split(/\s+/).filter(Boolean).length;
          if (wordCount > 28) {
            fail(lesson, `s${screen}.${lang} feedbackAudio[${index}] ${wordCount} so'z; maksimal 28`);
          }
        });
        const correctPrefixes = { uz: "to'g'ri.", ru: 'верно.', en: 'correct.' };
        const wrongPrefixes = { uz: 'yana bir qarang:', ru: 'посмотрите ещё раз:', en: 'look again:' };
        messages.forEach((message, index) => {
          const prefix = index === item.correctIndex ? correctPrefixes[lang] : wrongPrefixes[lang];
          if (!message.startsWith(prefix)) {
            fail(lesson, `s${screen}.${lang} ${index === item.correctIndex ? "to'g'ri" : 'xato'} feedback approved shablon bilan boshlanmagan: "${prefix}"`);
          }
        });
      }
    }
  });

  for (const lang of LANGS) {
    const allIntro = FRAME_VECTOR.flatMap((_, screen) => introSegments(content[`s${screen}`], lang));
    const normalised = allIntro.map((segment) => String(segment).trim().toLocaleLowerCase(lang));
    const frequencies = new Map();
    normalised.forEach((segment) => frequencies.set(segment, (frequencies.get(segment) ?? 0) + 1));
    const highestRepeat = Math.max(0, ...frequencies.values());
    if (frequencies.size < 35) {
      fail(lesson, `${lang} intro audio juda shablonli: 50 beat ichida faqat ${frequencies.size} noyob gap`);
    }
    if (highestRepeat > 3) {
      fail(lesson, `${lang} intro audioda bitta generic gap ${highestRepeat} marta takrorlangan`);
    }
  }

  const visibleUz = walk(content)
    .filter((item) => !item.inAudio && (item.lang === 'uz' || item.lang === null))
    .map((item) => item.value)
    .join('\n');
  const normalisedVisibleUz = normaliseVisual(visibleUz);
  for (const snippet of REQUIRED_UZ_VISUAL[lesson] ?? []) {
    if (!normalisedVisibleUz.includes(normaliseVisual(snippet))) {
      fail(lesson, `approved UZ visual dalili topilmadi: "${snippet}"`);
    }
  }

  for (const item of walk(content)) {
    if (item.missing) fail(lesson, `${item.at}.${item.lang} bo'sh yoki yo'q`);
    if (CORRUPTED_TEXT.test(item.value ?? '')) fail(lesson, `${item.at}: buzilgan token qolgan: "${item.value}"`);
    if (item.lang === 'ru' && CORRUPTED_RU_IMPERATIVE.test(item.value ?? '')) {
      fail(lesson, `${item.at}: RU buyruq fe'lida takrorlangan qo'shimcha bor: "${item.value}"`);
    }
    if (item.lang === 'ru' && RU_SINGULAR_IMPERATIVE.test(item.value ?? '')) {
      fail(lesson, `${item.at}: RU bola murojaatida birlik buyruq fe'li ishlatilgan: "${item.value}"`);
    }
    if (item.lang === 'ru' && CORRUPTED_RU_AGREEMENT.test(item.value ?? '')) {
      fail(lesson, `${item.at}: RU son va ot kelishigi buzilgan: "${item.value}"`);
    }
    if (item.lang === 'uz' && UZ_DETACHED_COUNT_SUFFIX.test(item.value ?? '')) {
      fail(lesson, `${item.at}: UZ sanoq qo'shimchasi ajratib yozilgan: "${item.value}"`);
    }
    if (/[‘’ʻʼ]/.test(item.value ?? '')) fail(lesson, `${item.at}: ASCII bo'lmagan apostrof`);
    if (item.lang === 'uz' && /[Ѐ-ӿ]/.test(item.value ?? '')) fail(lesson, `${item.at}: UZ ichida kirill bor`);
    if (item.lang === 'en' && AMERICAN_ENGLISH.test(item.value ?? '')) {
      fail(lesson, `${item.at}: British English o'rniga American spelling ishlatilgan: "${item.value}"`);
    }
    if (item.lang === 'ru' && RUSSIAN_UNIT_AGREEMENT_ERRORS.test(item.value ?? '')) {
      fail(lesson, `${item.at}: RU son va o'lchov birligi kelishigi noto'g'ri: "${item.value}"`);
    }
    if (item.lang === 'en' && ENGLISH_UNIT_AGREEMENT_ERRORS.test(item.value ?? '')) {
      fail(lesson, `${item.at}: EN singular/plural mos emas: "${item.value}"`);
    }
    if (item.lang === 'en' && /[Ѐ-ӿ]/.test(item.value ?? '')) fail(lesson, `${item.at}: EN ichida kirill bor`);
    if (item.lang === 'uz' && /\b(sen|senga|sening|seni|senda|sendan)\b/i.test(item.value ?? '')) fail(lesson, `${item.at}: UZ sen ishlatilgan`);
    if (!item.inAudio) continue;
    const audioText = String(item.value ?? '').toLocaleLowerCase(item.lang ?? 'uz');
    if (AUDIO_PUNCTUATION_GARBAGE.test(item.value ?? '')) {
      fail(lesson, `${item.at}: audioda ketma-ket yoki joysiz tinish belgisi bor`);
    }
    if (item.lang === 'uz' && UZ_SEPARATED_CASE_SUFFIX.test(item.value ?? '')) {
      fail(lesson, `${item.at}: UZ audioda son bilan kelishik qo'shimchasi ajratib yozilgan`);
    }
    const bannedStem = BANNED_AUDIO_STEMS.find((stem) => audioText.includes(stem));
    if (bannedStem) fail(lesson, `${item.at}: mazmunsiz audio shabloni ishlatilgan: "${bannedStem}"`);
    if (/\d/.test(item.value)) fail(lesson, `${item.at}: audio ichida raqam bor`);
    if (/[=<>≥≤×÷+−/%$€°²³←→↔⊂⊃∠□·]/.test(item.value) || /\s-\s/.test(item.value)) fail(lesson, `${item.at}: audio ichida formula belgisi bor`);
    const abbreviatedMultiUnit = item.lang === 'ru'
      ? /(?:^|[^А-Яа-яЁё])(?:мм|см|дм|км|кг|мин)(?=$|[^А-Яа-яЁё])/i
      : /(?:^|[^A-Za-z])(?:mm|cm|dm|km|kg|min)(?=$|[^A-Za-z])/i;
    const abbreviatedSingleUnit = item.lang === 'ru'
      ? /(?:^|\s)(?:м|г|л|ч)(?=$|[\s,.;:!?])/i
      : /(?:^|\s)(?:m|g|l|h)(?=$|[\s,.;:!?])/i;
    if (abbreviatedMultiUnit.test(item.value) || abbreviatedSingleUnit.test(item.value)) {
      fail(lesson, `${item.at}: audioda o'lchov qisqartmasi yozib qoldirilgan`);
    }
    if (/[—–«»“”„‟‘’ʻʼ✓✔✗✘]/.test(item.value)) fail(lesson, `${item.at}: audioda TTS uchun taqiqlangan belgi bor`);
  }
}

for (const [lessonText, slug] of selectedEntries) {
  const lesson = Number(lessonText);
  const filename = path.join(GRADE4_DIR, `Dars${lesson}.jsx`);
  let source;
  try {
    source = await readFile(filename, 'utf8');
  } catch (error) {
    fail(lesson, `fayl o'qilmadi: ${error.message}`);
    continue;
  }

  const frames = extractLiteral(source, 'FRAME_COUNTS', '[', ']');
  if (!Array.isArray(frames) || frames.join(',') !== FRAME_VECTOR.join(',')) {
    fail(lesson, `FRAME_COUNTS noto'g'ri: ${JSON.stringify(frames)}`);
  } else {
    note(lesson, `${frames.length} slayd, ${frames.reduce((sum, value) => sum + value, 0)} avtomatik frame`);
  }
  const lessonMeta = extractLiteral(source, 'LESSON_META');
  if (!lessonMeta || lessonMeta.__parseError) {
    fail(lesson, `LESSON_META parse bo'lmadi${lessonMeta?.__parseError ? `: ${lessonMeta.__parseError}` : ''}`);
  } else {
    if (lessonMeta.slug !== slug) fail(lesson, `LESSON_META slug ${lessonMeta.slug ?? ''}, kutilgan ${slug}`);
    for (const lang of LANGS) {
      const expectedTitle = EXPECTED_LESSON_TITLES[lesson]?.[lang];
      if (normaliseTitle(lessonMeta.lessonTitle?.[lang]) !== normaliseTitle(expectedTitle)) {
        fail(lesson, `LESSON_META.lessonTitle.${lang} "${lessonMeta.lessonTitle?.[lang] ?? ''}", kutilgan "${expectedTitle}"`);
      }
    }
  }
  const content = extractLiteral(source, 'CONTENT');
  validateContent(lesson, content);
  if (lesson === 31 && ![
    /standart/i.test(content?.s10?.question?.uz ?? ''),
    /стандарт/i.test(content?.s10?.question?.ru ?? ''),
    /standard/i.test(content?.s10?.question?.en ?? ''),
  ].every(Boolean)) {
    fail(lesson, 's10 teng qiymatli nostandart variant sabab savol uch tilda standart yozuvni so‘ramayapti');
  }
  if (lesson === 35 && ![
    /aniq/i.test(content?.s8?.question?.uz ?? ''),
    /точн/i.test(content?.s8?.question?.ru ?? ''),
    /precise/i.test(content?.s8?.question?.en ?? ''),
  ].every(Boolean)) {
    fail(lesson, 's8 teng tomonli/teng yonli kesishmasini bartaraf etuvchi eng aniq nom savoli yo‘q');
  }
  if (lesson === 33 && !LANGS.every((lang) => (
    (content?.s6?.frames?.[0]?.[lang] ?? '').includes('0° < α < 90°')
    && (content?.s6?.frames?.[2]?.[lang] ?? '').includes('90° < α < 180°')
    && (content?.s14?.frames?.[3]?.[lang] ?? '').includes('90° < α < 180°')
  ))) {
    fail(lesson, 's6/s14 o‘tkir va o‘tmas burchak oraliqlarida chegara qiymatlar qat’iy ajratilmagan');
  }
  if (lesson === 36 && !LANGS.every((lang) => (content?.s9?.options ?? []).every((option) => /(?:cm|см)/i.test(option?.[lang] ?? '')))) {
    fail(lesson, 's9 yo‘qolgan tomon variantlarida uzunlik birligi yo‘q');
  }
  if (lesson === 37 && !LANGS.every((lang) => /(?:cm|см)/i.test(content?.s12?.proof?.[lang] ?? ''))) {
    fail(lesson, 's12 tuzatilgan perimetr isbotida santimetr birligi yo‘q');
  }
  if (lesson === 32) {
    if (!/function VolumeDmScene\(\{\s*frame\s*,\s*screen\s*\}\)/.test(source)) {
      fail(lesson, 'volume-dm uchun alohida 10×10 qatlam modeli topilmadi');
    }
    if (!/const blocks\s*=\s*screen\s*===\s*10\s*\?\s*2\s*:\s*1/.test(source)) {
      fail(lesson, 's5 bitta va s10 ikkita kub detsimetr blokini aniq ajratmayapti');
    }
    if (!/const unitCubeCount\s*=\s*10\s*\*\s*10\s*\*\s*10/.test(source) || !/const totalCubeCount\s*=\s*blocks\s*\*\s*unitCubeCount/.test(source)) {
      fail(lesson, 'volume-dm semantikasi 10×10×10=1000 va ikki blok=2000 sifatida kodlanmagan');
    }
    if (!/Array\.from\(\{\s*length\s*:\s*100\s*\}/.test(source)) {
      fail(lesson, 'volume-dm old qatlamida aniq 10×10 katak yo‘q');
    }
    for (const label of ['Har blok: 10 qatlam (sxema)', 'Каждый блок: 10 слоёв (схема)', 'Each block: 10 layers (schematic)']) {
      if (!source.includes(label)) fail(lesson, `volume-dm sxematik qatlam yorlig‘i topilmadi: "${label}"`);
    }
    if (/scene\s*===\s*['"]volume-dm['"]\s*\|\|\s*scene\s*===\s*['"]volume-layers-30['"]/.test(source)) {
      fail(lesson, 'volume-dm hali 30 ta umumiy tile modeliga ulangan');
    }
    const layerModel = source.match(/function VolumeLayers30Scene[\s\S]*?const columns\s*=\s*(\d+);[\s\S]*?const rows\s*=\s*(\d+);[\s\S]*?const layers\s*=\s*(\d+);/);
    if (!layerModel) {
      fail(lesson, 's9 uchun alohida 5×2×3 qatlam modeli topilmadi');
    } else {
      const [, columns, rows, layers] = layerModel.map(Number);
      if (columns !== 5 || rows !== 2 || layers !== 3 || columns * rows * layers !== 30) {
        fail(lesson, `s9 qatlam geometriyasi xato: ${columns}×${rows}×${layers}`);
      }
    }
    if (!/const cubesPerLayer\s*=\s*columns\s*\*\s*rows/.test(source) || !/const totalCubes\s*=\s*cubesPerLayer\s*\*\s*layers/.test(source)) {
      fail(lesson, 's9 kub soni qatlam o‘lchamlaridan hisoblanmayapti');
    }
    if (!/const col\s*=\s*index\s*%\s*columns/.test(source) || !/const row\s*=\s*Math\.floor\(index\s*\/\s*columns\)/.test(source)) {
      fail(lesson, 's9 har qatlamda besh ustun va ikki qatorga joylashmayapti');
    }
    if (!/scene\s*===\s*['"]volume-layers-30['"]\)\s*return\s*<VolumeLayers30Scene/.test(source)) {
      fail(lesson, 'volume-layers-30 sahnasi exact qatlam komponentiga ulanmagan');
    }
  }
  if (lesson === 33 && !/'angle-payoff'\s*:\s*frame\s*=>\s*\[\s*35\s*,\s*90\s*,\s*125\s*,\s*180\s*\]/.test(source)) {
    fail(lesson, 'angle-payoff vizuali 35, 90, 125, 180 darajalarni frame bo‘yicha aniq ko‘rsatmayapti');
  }
  if (lesson === 34) {
    if (!/'protractor-hook'\s*:\s*\(\)\s*=>\s*60/.test(source)) fail(lesson, 'protractor hook bitta 60/120 belgini siljitmasdan ko‘rsatmayapti');
    if (!/'protractor-zero'\s*:\s*\(_frame\s*,\s*screen\)\s*=>\s*screen\s*===\s*2\s*\?\s*75\s*:\s*70/.test(source)) fail(lesson, 's2 protractor-zero vizuali 75 darajaga mos emas');
    if (!/'protractor-obtuse'\s*:\s*\(_frame\s*,\s*screen\)\s*=>\s*screen\s*===\s*10\s*\?\s*115\s*:\s*120/.test(source)) fail(lesson, 's5 va s10 protractor vizuallari 120 va 115 darajalarni ajratmayapti');
    if (!/'protractor-rule'\s*:\s*\(\)\s*=>\s*60/.test(source)) fail(lesson, 's7 protractor payoff vizuali 60 darajaga mos emas');
  }
  if (lesson === 35) {
    const coordinateMatch = source.match(/const RIGHT_ISOSCELES_VERTICES\s*=\s*\[\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\],\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\],\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]\]/);
    if (!coordinateMatch) {
      fail(lesson, 'right-isosceles uchburchak koordinatalari topilmadi');
    } else {
      const [, ax, ay, bx, by, cx, cy] = coordinateMatch.map(Number);
      const ab = [bx - ax, by - ay];
      const ac = [cx - ax, cy - ay];
      const dot = ab[0] * ac[0] + ab[1] * ac[1];
      const abSquared = ab[0] ** 2 + ab[1] ** 2;
      const acSquared = ac[0] ** 2 + ac[1] ** 2;
      if (dot !== 0 || abSquared !== acSquared || abSquared === 0) {
        fail(lesson, `right-isosceles koordinatalari xato: dot=${dot}, AB²=${abSquared}, AC²=${acSquared}`);
      }
      const markerPattern = new RegExp(`d=["']M${ax}\\s+${ay - 20}h20v20["']`);
      if (!markerPattern.test(source)) fail(lesson, '90° belgisi right-angle uchining ikki katetiga aniq ulanmagan');
    }
    for (const scene of ['triangle-hook', 'triangle-payoff', 'triangle-right', 'triangle-case']) {
      if (!new RegExp(`RIGHT_ISOSCELES_SCENES[^;]+['"]${scene}['"]`).test(source)) {
        fail(lesson, `${scene} right-isosceles koordinata modeliga ulanmagan`);
      }
    }
  }
  if (lesson === 41) {
    const squareTurnUsesEqualSides = /width=\{rectangle\s*\?\s*210\s*:\s*square\s*\?\s*140\s*:\s*160\}[\s\S]{0,160}height=\{rectangle\s*\?\s*112\s*:\s*140\}/.test(source);
    if (!squareTurnUsesEqualSides) fail(lesson, 'square-turn vizualida boshlang\'ich figura aniq kvadrat emas');
  }
  if (lesson === 48) {
    const expectedChoiceBeat = {
      uz: "Variantlardan to'g'ri yig'indini tanlang",
      ru: 'Выберите верную сумму из вариантов',
      en: 'Choose the correct sum from the options',
    };
    if (!LANGS.every((lang) => content?.s8?.frames?.[1]?.[lang] === expectedChoiceBeat[lang]
      && content?.s8?.audio?.intro?.[lang]?.[1] === expectedChoiceBeat[lang])) {
      fail(lesson, 's8 ikkinchi beat javobdan oldin guruhlashni oshkor qilmaydigan variant tanlash prompti emas');
    }
    if (!/function ConversionVisual\(\{\s*c,\s*frame,\s*revealed\s*=\s*false\s*\}\)/.test(source)
      || !/'addition-test-sum'\s*:\s*\{[^\n]+revealOnly:\s*true/.test(source)
      || !/const moved\s*=\s*plan\.revealOnly\s*\?\s*revealed\s*:\s*frame\s*>=\s*plan\.moveAt/.test(source)) {
      fail(lesson, 's8 qulay juft strategiyasi answer-state orqali revealed bilan bloklanmagan');
    }
    if (!/const swapped\s*=\s*testScene\s*\?\s*revealed\s*:\s*frame\s*>=\s*1/.test(source)
      || !/<ConversionVisual\s+c=\{c\}\s+frame=\{audio\.frame\}\s+revealed=\{revealed\}\s*\/>/.test(source)) {
      fail(lesson, 's9 o‘rin almashtirish vizuali javobdan oldin revealed bilan bloklanmagan');
    }
    if (!/const boundaryFrames\s*=\s*\['9−4=5',\s*'4−9≠5',\s*'\(12−5\)−2=5',\s*'12−\(5−2\)=9'\]/.test(source)
      || !/boundaryFrames\[boundaryIndex\]/.test(source)) {
      fail(lesson, 's6 ayirish chegarasi to‘rtta alohida va tartibli visual beat bilan berilmagan');
    }
  }

  const metaRows = extractBalanced(source, 'const SCREEN_META =', '[', ']')?.match(/\{\s*['"]?id['"]?\s*:\s*['"]s\d+['"][\s\S]*?\}/g) ?? [];
  if (metaRows.length !== 15) fail(lesson, `SCREEN_META qatorlari ${metaRows.length}, kutilgan 15`);
  const allowedScopes = new Set(['hook', 'module-mikro', 'final', 'null']);
  metaRows.forEach((row, index) => {
    const scope = row.match(/scope\s*:\s*(?:['"]([^'"]+)['"]|(null))/)?.[1] ?? (row.includes('scope: null') ? 'null' : 'missing');
    if (!allowedScopes.has(scope)) fail(lesson, `s${index} scope kontraktdan tashqari: ${scope}`);
  });
  const scored = metaRows.map((row, index) => (/['"]?scored['"]?\s*:\s*true/.test(row) ? index : null)).filter((value) => value !== null);
  const expectedScored = lesson === 34 ? [8, 9, 10, 11, 12, 13] : SCORED;
  if (scored.join(',') !== expectedScored.join(',')) fail(lesson, `scored slaydlar [${scored}], kutilgan [${expectedScored}]`);
  if (!/['"]?type['"]?\s*:\s*['"]hook['"]/.test(metaRows[0] ?? '')) fail(lesson, 'birinchi ekran hook emas');
  if (!/['"]?type['"]?\s*:\s*['"]summary['"]/.test(metaRows[14] ?? '')) fail(lesson, 'oxirgi ekran summary emas');
  if (lesson === 51 && (!metaRows.slice(8, 13).every((row) => /scope\s*:\s*['"]module-mikro['"]/.test(row))
    || !/scope\s*:\s*['"]final['"]/.test(metaRows[13] ?? ''))) {
    fail(lesson, 'yakuniy review s8-s12 module-mikro va s13 final scope kontraktidan foydalanmayapti');
  }

  const screens = extractBalanced(source, 'const SCREENS', '[', ']')?.match(/Screen\d+/g) ?? [];
  if (screens.length !== 15) fail(lesson, `SCREENS komponentlari ${screens.length}, kutilgan 15`);
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`slug\\s*:\\s*['"]${escapedSlug}['"]`).test(source)) fail(lesson, `LESSON_META slug ${slug} emas`);
  if (!source.includes("['uz', 'ru', 'en']") && !source.includes("['uz','ru','en']")) fail(lesson, 'UZ/RU/EN selector topilmadi');
  if (!/["']en-GB["']/.test(source)) fail(lesson, 'Web Speech uchun en-GB topilmadi');
  if (/\bFREE_NAV\b|setTimeout\([^)]*(?:advance|onNext|finish)/.test(source)) fail(lesson, 'activity gate-ni chetlab o‘tadigan navigatsiya topildi');
  if (/\bFREE_NAV\b/.test(source)) fail(lesson, 'FREE_NAV flagi topildi');
  if (/\boverflow(?:-[xy])?\s*:\s*(?:auto|scroll)\b/i.test(source) || /\boverflow(?:X|Y)?\s*:\s*["'](?:auto|scroll)["']/i.test(source)) fail(lesson, 'scroll beruvchi overflow qoidasi qolgan');
  if (/\b(?:scrollTo|scrollIntoView)(?:\?\.)?\s*\(/.test(source)) fail(lesson, 'scrollTo/scrollIntoView chaqiruvi qolgan');
  if (/scrollbar-(?:gutter|width|color)|::-webkit-scrollbar/i.test(source)) fail(lesson, 'scrollbar CSS qolgan');
  if (!/function QuestionScreen[\s\S]{0,8000}<Stage[^>]*\bonNext=\{onNext\}/.test(source)) fail(lesson, 'test slaydida javobsiz erkin davom etish kontrakti topilmadi');
  if (!/window\.setTimeout\(\(\) => engine\.start\(\),\s*120\)/.test(source) || !/active\s*>=\s*0\s*\?\s*active\s*:\s*0/.test(source)) {
    fail(lesson, 'audio beatlardan frame autoplay kontrakti topilmadi');
  }
  if (!/nextAttempts\s*===\s*1\s*&&\s*ok/.test(source)) fail(lesson, 'savol javobida birinchi urinish hisoblanmayapti');
  const immutableFirstTry = /firstTry:\s*(?:old\s*\?\s*old\.firstTry\s*:\s*answer\.firstTry|old\?\.firstTry\s*\?\?\s*answer\.firstTry)/;
  if (!immutableFirstTry.test(source)) fail(lesson, 'LMS recordAnswer birinchi urinish natijasini o\'zgarmas saqlamayapti');
  if (/firstTry:\s*old\?\.firstTry\s*===\s*false\s*\?\s*false\s*:\s*answer\.firstTry/.test(source)) {
    fail(lesson, 'birinchi to\'g\'ri javob keyingi bosishda yo\'qoladigan eski firstTry formulasi ishlatilgan');
  }
  if (/\bdraggable=|onDragStart=|onDrop=/.test(source)) fail(lesson, 'majburiy drag topildi');
  if (/from\s+['"]\.\//.test(source)) fail(lesson, 'LMS single-file kontraktini buzuvchi relative import topildi');
  if (/<img\b|https?:\/\/[^'"`)]+\.(?:png|jpe?g|webp|gif)/i.test(source)) fail(lesson, 'tasdiqlanmagan raster rasm topildi');
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(source)) fail(lesson, "prefers-reduced-motion yo'q");
  if (!/usePrefersReducedMotion/.test(source) || !/\bframe\s*=\s*reduced\s*\|\|/.test(source)) {
    fail(lesson, 'reduced-motion holatida avtomatik final frame kontrakti topilmadi');
  }
  if (!/role=['"]status['"]|aria-live=/.test(source)) fail(lesson, "feedback aria-live/status yo'q");
  if (!/:focus-visible/.test(source)) fail(lesson, "keyboard focus-visible yo'q");
  if (!/min-height:\s*(?:4[4-9]|[5-9]\d)px/.test(source)) fail(lesson, '44px touch target dalili yoq');
  if (!/width:min\(936px,100%\)/.test(source)) fail(lesson, '936px stage kontrakti topilmadi');
  if (!/const BitSVG/.test(source)) fail(lesson, 'tasdiqlangan BitSVG topilmadi');
  if (!/function HookScreen[\s\S]{0,8000}data-g4-role=['"]hook-bit['"][\s\S]{0,300}<BitSVG[^>]*state=['"]think['"]/.test(source)) fail(lesson, 'S1 dark frame ichida Bit think holati topilmadi');
  if (!/screen\s*===\s*7\s*\?\s*['"]happy['"]/.test(source) || !/\[['"]focus['"],\s*['"]point['"],\s*['"]idea['"]\]/.test(source)) {
    fail(lesson, 'S2-S8 Bit focus/point/idea/happy holatlari topilmadi');
  }
  if (!/screen\s*===\s*12\s*\?\s*['"]awkward['"]/.test(source) || !/screen\s*===\s*13\s*\?\s*['"]point['"]/.test(source)) {
    fail(lesson, 'S9-S14 Bit focus/awkward/point holatlari topilmadi');
  }
  if (!/(?:function Screen14[\s\S]{0,5000}(?:state=['"](?:happy|wave)['"]|G4TitleCard)|function G4TitleCard[\s\S]{0,1200}state=['"]happy['"])/.test(source)) fail(lesson, 'S15 Bit happy/wave holati topilmadi');
  if (!/const AudioIndicator/.test(source)) fail(lesson, 'audio paneli topilmadi');
  if (!/pushOneOff/.test(source) || !/feedbackAudio/.test(source)) fail(lesson, 'TTS-safe per-option feedback ishlatilmagan');
  if (!/this\.audio\.onended\s*=\s*null/.test(source) || !/this\.audio\.onerror\s*=\s*null/.test(source) || !/this\.audio\.removeAttribute\(['"]src['"]\)/.test(source)) {
    fail(lesson, 'navigatsiyada eski HTTP audio callbacklarini uzuvchi cleanup topilmadi');
  }
  if (!/this\.previewUtterance\.onend\s*=\s*null/.test(source) || !/this\.previewUtterance\.onerror\s*=\s*null/.test(source)) {
    fail(lesson, 'navigatsiyada eski Web Speech callbacklarini uzuvchi cleanup topilmadi');
  }
  if (!/studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode/.test(source)) fail(lesson, 'platform props toliq emas');
  if (lesson === 51) {
    if (!/assessment:\s*true/.test(source)) fail(lesson, 'yakuniy review payloadida assessment:true yoq');
    if (!/totalQuestions:\s*(?:5|scored\.length)/.test(source)) fail(lesson, 'yakuniy review payloadida totalQuestions:5 yoq');
    if (!/correctAnswers:\s*firstTryCorrect/.test(source)) fail(lesson, 'yakuniy review correctAnswers first-try emas');
    if (!/scorePercent:\s*Math\.round\(firstTryCorrect\s*\/\s*5\s*\*\s*100\)/.test(source)) fail(lesson, 'yakuniy review scorePercent first-try/5 emas');
    if (!/finalScore:\s*firstTryCorrect/.test(source) || !/finalTotal:\s*5/.test(source)) fail(lesson, 'yakuniy review finalScore/finalTotal noto‘g‘ri');
    if (!/passed:\s*firstTryCorrect\s*\/\s*5\s*>=\s*0\.6/.test(source)) fail(lesson, 'yakuniy review passed 60% gate emas');
    if (!/firstTryStats:\s*\{\s*total:\s*5,\s*firstTryCorrect\s*\}/.test(source)) fail(lesson, 'yakuniy review firstTryStats yoq');
    if (!/data-medal-tier=\{medalTier\}/.test(source)
      || !/(?:['"]gold['"]|oltin)/i.test(source)
      || !/(?:['"]silver['"]|kumush)/i.test(source)
      || !/(?:['"]bronze['"]|bronza)/i.test(source)) {
      fail(lesson, 'yakuniy review gold/silver/bronze medal tier kontrakti topilmadi');
    }
    if (/function Screen14[\s\S]{0,1800}<G4TitleReward/.test(source)) fail(lesson, 'yakuniy review ekranida ball ko‘rsatuvchi reward card bor');
  }
}

const registry = await readFile(path.join(ROOT, 'src/lessons/grade4.js'), 'utf8');
for (const [lesson, slug] of selectedEntries) {
  if (!registry.includes(`slug: '${slug}'`)) fail(lesson, 'registry slug topilmadi');
  if (!registry.includes(`components/grade4/Dars${lesson}.jsx`)) fail(lesson, 'registry lazy import topilmadi');
}

notes.forEach((message) => console.log(`✓ ${message}`));
if (failures.length) {
  console.error(`\n${failures.length} ta audit xatosi:`);
  failures.forEach((message) => console.error(`  - ${message}`));
  process.exitCode = 1;
} else {
  const lessonCount = selectedEntries.length;
  console.log(`\nGrade4 Dars31-51 audit: ${lessonCount * 15} slayd va ${lessonCount * 50} frame bo'yicha barcha deterministik tekshiruvlar o'tdi.`);
}
