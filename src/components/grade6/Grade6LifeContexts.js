const L = (uz, ru) => ({ uz, ru });
const context = (titleUz, titleRu, steps, visual) => ({
  type: 'info',
  eyebrow: L('Hayotiy vaziyat', 'Жизненная ситуация'),
  title: L(titleUz, titleRu),
  steps: steps.map(([uz, ru]) => L(uz, ru)),
  audio: {
    uz: steps.map(([uz]) => uz),
    ru: steps.map(([, ru]) => ru),
  },
  visual,
  isLifeContext: true,
});
const cards = (...items) => ({ type: 'cards', items });
const panels = (...items) => ({ type: 'panels', panels: items });
const chain = (...items) => ({ type: 'chain', items });

export const GRADE6_LIFE_CONTEXTS = {
  frac_6_08: context("Pitsani teng bo'lish", 'Делим пиццу поровну', [
    ["Pitsa 8 teng bo'lakka bo'lindi, 6 bo'lagi qoldi.", 'Пиццу разделили на 8 равных частей, осталось 6.'],
    ["6/8 yozuvini 3/4 ga almashtirsak ham, qolgan pitsa miqdori o'zgarmaydi.", 'Если заменить 6/8 на 3/4, количество пиццы не изменится.'],
  ], { type: 'fractionBars', bars: [{ numerator: 6, denominator: 8 }, { numerator: 3, denominator: 4 }] }),

  frac_6_09: context('Ikki xil shokolad', 'Две плитки шоколада', [
    ["Bir bola shokoladning 1/2 qismini, ikkinchisi 2/3 qismini oldi.", 'Один ребёнок взял 1/2 плитки, другой — 2/3.'],
    ["Ulushlarni solishtirish uchun ikkala shokoladni bir xil kattalikdagi bo'laklarga ajratamiz.", 'Для сравнения делим обе плитки на одинаковые части.'],
  ], { type: 'fractionBars', bars: [{ numerator: 1, denominator: 2 }, { numerator: 2, denominator: 3 }] }),

  frac_6_10: context('Idishdagi sharbat', 'Сок в кувшине', [
    ["Idishda 2/5 litr olma va 1/5 litr uzum sharbati bor.", 'В кувшине 2/5 литра яблочного и 1/5 литра виноградного сока.'],
    ["Bo'laklar bir xil bo'lgani uchun suratlarni qo'shamiz: jami 3/5 litr.", 'Части одинаковы, поэтому складываем числители: всего 3/5 литра.'],
  ], chain('2/5 litr', '+ 1/5 litr', '3/5 litr')),

  frac_6_11: context("Bog'ning bir qismi", 'Часть сада', [
    ["Bog'ning 3/4 qismiga sabzavot ekildi, uning 2/3 qismiga pomidor ekildi.", 'Овощами заняли 3/4 сада, а помидорами — 2/3 этой части.'],
    ["Butunning bir qismining yana bir qismini topishda kasrlar ko'paytiriladi.", 'Чтобы найти часть от части, дроби умножают.'],
  ], chain("3/4 bog'", 'uning 2/3 qismi', "1/2 bog'")),

  frac_6_12: context("Tasmani bo'laklash", 'Разрезаем ленту', [
    ["3/4 metr tasmani 1/8 metrlik bo'laklarga kesamiz.", 'Ленту длиной 3/4 метра режем на части по 1/8 метра.'],
    ["Savol: tasma ichiga nechta 1/8 metrlik bo'lak sig'adi?", 'Вопрос: сколько частей по 1/8 метра получится?'],
  ], cards('3/4 m tasma', '1/8 m', "6 ta bo'lak")),

  frac_6_13: context("Kitobning o'qilgan qismi", 'Прочитанная часть книги', [
    ["Kitobning 3/5 qismi 90 bet bo'lsa, butun kitob necha bet?", 'Если 3/5 книги — это 90 страниц, сколько страниц во всей книге?'],
    ["Avval bir ulushni, keyin beshta ulushni topamiz.", 'Сначала найдём одну долю, затем все пять долей.'],
  ], chain('3/5 = 90 bet', '1/5 = 30 bet', '5/5 = 150 bet')),

  decimal_6_14: context('Bozordagi xarid', 'Покупка на рынке', [
    ["1 kilogramm olma 12,5 ming so'm. 2,4 kilogramm olma olindi.", 'Килограмм яблок стоит 12,5 тысячи сумов. Купили 2,4 килограмма.'],
    ["Umumiy narx massa bilan bir kilogramm narxining ko'paytmasidir.", 'Общая стоимость равна произведению массы и цены за килограмм.'],
  ], chain('12,5 ming', '× 2,4 kg', "30 ming so'm")),

  decimal_6_15: context('Ob-havo ilovasidagi harorat', 'Температура в приложении', [
    ["Ilova haroratni 18,746 daraja deb ko'rsatdi, lekin kundalik uchun 18,7 daraja yetarli.", 'Приложение показало 18,746 градуса, но для дневника достаточно 18,7.'],
    ["Aniqlik talabiga qarab sonni kerakli xonagacha yaxlitlaymiz.", 'В зависимости от нужной точности округляем число до выбранного разряда.'],
  ], chain('18,746°C', "o'ndan birgacha", '18,7°C')),

  word_6_16: context('Retseptni hisoblash', 'Расчёт рецепта', [
    ["Retseptga 1/2 litr sut va 0,25 litr qaymoq kerak.", 'Для рецепта нужно 1/2 литра молока и 0,25 литра сливок.'],
    ["Hisoblashdan oldin ikkala miqdorni bitta qulay ko'rinishga keltiramiz.", 'Перед вычислением приводим обе величины к одному удобному виду.'],
  ], chain('1/2 l = 0,5 l', '+ 0,25 l', '0,75 l')),

  ratio_6_17: context("Bo'yoq rangini tayyorlash", 'Смешиваем краску', [
    ["Yashil rang uchun 2 o'lchov ko'k va 3 o'lchov sariq bo'yoq aralashtirildi.", 'Для зелёной краски смешали 2 части синей и 3 части жёлтой.'],
    ["Ko'k va sariq miqdorlarining tartibli taqqoslanishi 2:3 nisbatdir.", 'Упорядоченное сравнение синей и жёлтой частей — отношение 2:3.'],
  ], { type: 'colorTiles', tiles: ['blue', 'blue', 'yellow', 'yellow', 'yellow'], caption: L("Ko'k : sariq = 2 : 3", 'Синий : жёлтый = 2 : 3') }),

  proportion_6_18: context('Bir xil narxdagi daftarlar', 'Тетради по одной цене', [
    ["2 ta daftar 12 ming so'm bo'lsa, 5 ta daftar narxini topmoqchimiz.", 'Если 2 тетради стоят 12 тысяч сумов, найдём цену 5 тетрадей.'],
    ["Daftarlar soni va narx bir xil nisbatda o'zgaradi.", 'Количество тетрадей и стоимость меняются в одном отношении.'],
  ], panels(
    { title: L('2 ta daftar', '2 тетради'), lines: ["12 000 so'm"], color: 'blue' },
    { title: L('5 ta daftar', '5 тетрадей'), lines: ["x so'm"], color: 'yellow' },
  )),

  proportional_6_19: context('Ishchilar va vaqt', 'Рабочие и время', [
    ["4 ishchi bir ishni 6 kunda tugatadi. Ishchilar ko'paysa, kerakli vaqt kamayadi.", '4 рабочих выполняют работу за 6 дней. Если рабочих больше, времени нужно меньше.'],
    ["Bu qarama-qarshi yo'nalishdagi o'zgarish teskari proporsionallikka misol.", 'Это пример обратной пропорциональности.'],
  ], panels(
    { title: L('4 ishchi', '4 рабочих'), lines: ['6 kun'], color: 'yellow' },
    { title: L('8 ishchi', '8 рабочих'), lines: ['3 kun'], color: 'green' },
  )),

  scale_6_20: context('Xaritadagi masofa', 'Расстояние на карте', [
    ["Xaritada ikki shahar orasidagi kesma 4 santimetr.", 'На карте расстояние между городами равно 4 сантиметрам.'],
    ["1:100 000 masshtabda xaritadagi 1 santimetr haqiqatda 1 kilometrga teng.", 'В масштабе 1:100 000 один сантиметр на карте равен одному километру.'],
  ], { type: 'mapRoute', from: 'A', to: 'B', mapDistance: '4 cm', realDistance: '4 km', scale: '1 : 100 000' }),

  percent_6_21: context("Chegirma yorlig'i", 'Ценник со скидкой', [
    ["100 ming so'mlik sumkaga 20 foiz chegirma yozilgan.", 'На сумку ценой 100 тысяч сумов действует скидка 20 процентов.'],
    ["20 foiz — narxning har yuz so'midan 20 so'm kamayishini bildiradi.", '20 процентов означает уменьшение на 20 сумов из каждой сотни.'],
  ], { type: 'priceTag', oldPrice: '100 000', percent: '−20%', newPrice: '80 000' }),

  percent_tasks_6_22: context("Do'kondagi yangi narx", 'Новая цена в магазине', [
    ["Krossovka narxi 400 ming so'm, chegirma 15 foiz.", 'Кроссовки стоят 400 тысяч сумов, скидка 15 процентов.'],
    ["Avval chegirma miqdorini, keyin yangi narxni topamiz.", 'Сначала найдём сумму скидки, затем новую цену.'],
  ], chain('400 000 × 15%', '60 000 chegirma', "340 000 so'm")),

  proportion_tasks_6_23: context("Retseptni ko'paytirish", 'Увеличиваем рецепт', [
    ["4 kishilik oshga 600 gramm guruch kerak. 10 kishi uchun miqdorni mos oshiramiz.", 'Для плова на 4 человек нужно 600 граммов риса. Найдём количество на 10 человек.'],
    ["Kishi soni va guruch miqdori to'g'ri proporsional.", 'Число людей и количество риса прямо пропорциональны.'],
  ], panels(
    { title: L('4 kishi', '4 человека'), lines: ['600 g'], color: 'blue' },
    { title: L('10 kishi', '10 человек'), lines: ['1500 g'], color: 'green' },
  )),

  number_line_6_24: context('Lift qavatlari', 'Этажи лифта', [
    ["Yer sathi nol deb olinadi. Yuqoridagi qavatlar musbat, yerto'la qavatlari manfiy sonlar bilan belgilanadi.", 'Уровень земли принимают за ноль. Этажи выше обозначают положительными, подвальные — отрицательными числами.'],
    ["Lift harakati koordinata chizig'idagi siljishga o'xshaydi.", 'Движение лифта похоже на перемещение по координатной прямой.'],
  ], { type: 'numberLine', points: [{ at: 18, label: '−2' }, { at: 50, label: '0' }, { at: 82, label: '+2' }] }),

  absolute_6_25: context('Noldan masofa', 'Расстояние от нуля', [
    ["Ertalab harorat −5 daraja, boshqa shaharda +5 daraja bo'ldi.", 'Утром в одном городе было −5 градусов, в другом +5.'],
    ["Ikkala harorat ham noldan 5 daraja uzoqda. Modul ishorasiz masofani ko'rsatadi.", 'Обе температуры удалены от нуля на 5 градусов. Модуль показывает расстояние без знака.'],
  ], { type: 'numberLine', points: [{ at: 18, label: '−5' }, { at: 50, label: '0' }, { at: 82, label: '+5' }] }),

  rational_compare_6_26: context('Shaharlar harorati', 'Температура в городах', [
    ["Toshkentda −2°C, Samarqandda +1°C, Nukusda −5°C qayd etildi.", 'В Ташкенте −2°C, Самарканде +1°C, Нукусе −5°C.'],
    ["Issiqroq shaharni topish uchun sonlarni koordinata chizig'ida taqqoslaymiz.", 'Чтобы найти более тёплый город, сравним числа на координатной прямой.'],
  ], { type: 'dataTable', caption: L('Ertalabki harorat', 'Утренняя температура'), columns: [L('Shahar', 'Город'), L('Harorat', 'Температура')], rows: [[L('Toshkent', 'Ташкент'), '−2°C'], [L('Samarqand', 'Самарканд'), '+1°C'], [L('Nukus', 'Нукус'), '−5°C']] }),

  grade6_theory_27: context('Kun davomidagi harorat', 'Температура за день', [
    ["Ertalab −3°C edi, kunduzi harorat 5°C ga ko'tarildi.", 'Утром было −3°C, днём температура повысилась на 5°C.'],
    ["Ko'tarilish musbat son qo'shish, pasayish esa manfiy son qo'shish bilan ifodalanadi.", 'Повышение выражают прибавлением положительного числа, понижение — отрицательного.'],
  ], chain('−3°C', '+5°C', '2°C')),

  grade6_theory_28: context('Lift pastga tushdi', 'Лифт спустился', [
    ["Lift 4-qavatda edi va 7 qavat pastga tushdi.", 'Лифт был на 4-м этаже и спустился на 7 этажей.'],
    ["Pastga harakatni ayirish yoki manfiy siljish bilan yozamiz.", 'Движение вниз записываем вычитанием или отрицательным перемещением.'],
  ], chain('4-qavat', '−7 qavat', '−3-qavat')),

  grade6_theory_29: context("Bank hisobidagi o'zgarish", 'Изменение банковского счёта', [
    ["Hisobdan har kuni 20 ming so'mlik qarz 3 kun davomida yozildi.", 'Три дня подряд на счёт записывали долг по 20 тысяч сумов.'],
    ["Uchta bir xil manfiy o'zgarish −20 000·3 ko'paytma bilan ifodalanadi.", 'Три одинаковых отрицательных изменения записываются произведением −20 000·3.'],
  ], chain('−20 000', '× 3 kun', '−60 000')),

  grade6_theory_30: context('Shahar xaritasi', 'Карта города', [
    ["Maktab va kutubxona katakli xaritada nuqtalar bilan belgilangan.", 'Школа и библиотека отмечены точками на клетчатой карте.'],
    ["Har bir joyni topish uchun avval gorizontal x, keyin vertikal y koordinatasi aytiladi.", 'Чтобы найти место, сначала называют горизонтальную координату x, затем вертикальную y.'],
  ], { type: 'coordinatePlane', points: [{ x: -3, y: 2, label: L('Maktab', 'Школа'), color: 'accent' }, { x: 2, y: -2, label: L('Kutubxona', 'Библиотека'), color: 'blue' }] }),

  grade6_theory_31: context('Taksi narxini yozish', 'Записываем стоимость такси', [
    ["Taksiga chiqish 6 ming so'm, har kilometr esa 2 ming so'm.", 'Посадка в такси стоит 6 тысяч сумов, каждый километр — 2 тысячи.'],
    ["x kilometr yo'l narxi 6000+2000x harfli ifoda bilan yoziladi.", 'Стоимость поездки на x километров записывается выражением 6000+2000x.'],
  ], chain('6 000', '+ 2 000·x', 'jami narx')),

  grade6_theory_32: context("Bir xil sovg'a qutilari", 'Одинаковые подарочные наборы', [
    ["Har bir qutida x ta daftar va 3 ta qalam bor. Shunday 4 ta quti tayyorlandi.", 'В каждой коробке x тетрадей и 3 карандаша. Подготовили 4 коробки.'],
    ["Jami buyumlar 4(x+3) bo'lib, qavsni ochsak 4x+12 hosil bo'ladi.", 'Всего 4(x+3) предметов, после раскрытия скобок получаем 4x+12.'],
  ], chain('4 ta (x+3)', '4x + 4·3', '4x+12')),

  grade6_theory_33: context('Bir xil mahsulotlarni jamlash', 'Собираем одинаковые товары', [
    ["Birinchi savatda 3x kilogramm, ikkinchisida 5x kilogramm olma bor.", 'В первой корзине 3x килограммов яблок, во второй — 5x.'],
    ["Bir xil x birlikli miqdorlar qo'shilib 8x bo'ladi.", 'Однородные величины с x складываются и дают 8x.'],
  ], chain('3x kg', '+ 5x kg', '8x kg')),

  grade6_theory_34: context('Tarozining muvozanati', 'Равновесие весов', [
    ["Tarozining ikki pallasi teng: noma'lum quti va 3 kilogramm bir tomonda, 10 kilogramm ikkinchi tomonda.", 'Весы уравновешены: неизвестная коробка и 3 килограмма с одной стороны, 10 килограммов — с другой.'],
    ["Ikki tomondan ham bir xil 3 kilogrammni olsak, muvozanat saqlanadi.", 'Если убрать по 3 килограмма с обеих сторон, равновесие сохранится.'],
  ], { type: 'balance', left: 'x + 3', right: '10' }),

  grade6_theory_35: context('Ikki savatdagi olmalar', 'Яблоки в двух корзинах', [
    ["Ikkinchi savatda birinchisidan 6 ta ko'p olma, jami esa 38 ta.", 'Во второй корзине на 6 яблок больше, всего 38.'],
    ["Birinchi savatni x desak, ikkinchisi x+6 bo'ladi va x+(x+6)=38 tenglama tuziladi.", 'Если в первой корзине x, то во второй x+6, получаем уравнение x+(x+6)=38.'],
  ], panels(
    { title: L('1-savat', '1-я корзина'), lines: ['x'], color: 'blue' },
    { title: L('2-savat', '2-я корзина'), lines: ['x+6'], color: 'yellow' },
  )),

  grade6_theory_36: context('Ustaxonaning ish unumdorligi', 'Производительность мастерской', [
    ["Usta 6 soatda 48 ta detal tayyorladi.", 'Мастер изготовил 48 деталей за 6 часов.'],
    ["Bir soatdagi unumdorlik ish hajmini vaqtga bo'lish bilan topiladi.", 'Производительность за час находят делением объёма работы на время.'],
  ], chain('48 detal', ': 6 soat', '8 detal/soat')),

  grade6_theory_37: context("Velosiped g'ildiragi", 'Колесо велосипеда', [
    ["G'ildirakning cheti aylana, uning ichki qismi esa doiraga o'xshaydi.", 'Обод колеса похож на окружность, а внутренняя область — на круг.'],
    ["Markazdan chetgacha bo'lgan kesma radius, markaz orqali o'tgan kesma diametrdir.", 'Отрезок от центра до края — радиус, через центр — диаметр.'],
  ], { type: 'circle', mode: 'radius', segmentLabel: 'r', caption: L("G'ildirak: markaz, radius va aylana", 'Колесо: центр, радиус и окружность') }),

  grade6_theory_38: context("G'ildirak bosib o'tgan yo'l", 'Путь колеса', [
    ["G'ildirak bir marta to'liq aylanganda uning cheti uzunligicha yo'l bosadi.", 'За один полный оборот колесо проходит путь, равный длине окружности.'],
    ["Shuning uchun aylana uzunligini bilish velosiped yo'lini hisoblashga yordam beradi.", 'Поэтому длина окружности помогает вычислить путь велосипеда.'],
  ], { type: 'circle', mode: 'diameter', segmentLabel: 'd', caption: L('Bir aylanish = aylana uzunligi', 'Один оборот = длина окружности') }),

  grade6_theory_39: context('Dumaloq gulzor', 'Круглая клумба', [
    ["Bog'dagi dumaloq gulzorga qancha maysa kerakligini bilish uchun uning yuzini topamiz.", 'Чтобы узнать, сколько травы нужно для круглой клумбы, находим её площадь.'],
    ["Radius ma'lum bo'lsa, doira yuzi πr² formula bilan hisoblanadi.", 'Если известен радиус, площадь круга вычисляют по формуле πr².'],
  ], { type: 'circle', mode: 'radius', segmentLabel: 'r=3 m', caption: L('Gulzor yuzi — doiraning ichki qismi', 'Площадь клумбы — внутренняя область круга') }),

  grade6_theory_40: context("Ko'zgudagi aks", 'Отражение в зеркале', [
    ["Ko'zgu oldidagi shaklning har bir nuqtasi ko'zguning narigi tomonida teng masofada ko'rinadi.", 'Каждая точка фигуры отражается на равном расстоянии по другую сторону зеркала.'],
    ["Ko'zgu chizig'i simmetriya o'qi vazifasini bajaradi.", 'Линия зеркала служит осью симметрии.'],
  ], { type: 'symmetry', left: '◀', right: '◀', caption: L("O'qdan ikki tomondagi masofalar teng", 'Расстояния по обе стороны оси равны') }),

  grade6_theory_41: context('Naqshni markaz atrofida aylantirish', 'Поворот узора вокруг центра', [
    ["Naqsh markaz atrofida 180 darajaga aylantirilsa, qarama-qarshi joyga tushadi.", 'При повороте узора на 180 градусов вокруг центра он переходит в противоположное положение.'],
    ["Markaz har bir nuqta bilan uning aksi orasidagi kesmaning o'rtasi bo'ladi.", 'Центр является серединой отрезка между точкой и её образом.'],
  ], { type: 'symmetry', left: '◆', right: '◆', caption: L('180° burilish — markaziy simmetriya', 'Поворот на 180° — центральная симметрия') }),

  grade6_theory_42: context('Uy tomining shakli', 'Форма крыши дома', [
    ["Uy tomining old ko'rinishi uchburchakka o'xshaydi.", 'Передняя часть крыши похожа на треугольник.'],
    ["Uning uchlari, tomonlari va burchaklarini nomlash orqali uchburchakni o'rganamiz.", 'Назовём вершины, стороны и углы этой треугольной формы.'],
  ], { type: 'triangle', base: 'asos', height: null, label: L("Tomning uchburchak ko'rinishi", 'Треугольная форма крыши') }),

  grade6_theory_43: context('Uchburchak bayroq uchun mato', 'Ткань для треугольного флага', [
    ["Uchburchak bayroq tikish uchun qancha mato kerakligini uning yuzi ko'rsatadi.", 'Площадь показывает, сколько ткани нужно для треугольного флага.'],
    ["Asos va unga tushirilgan balandlik ma'lum bo'lsa, S=ah/2 ishlatiladi.", 'Если известны основание и высота, используем S=ah/2.'],
  ], { type: 'triangle', base: 'a=8 cm', height: 'h=5 cm', label: L('Bayroq yuzini topamiz', 'Находим площадь флага') }),

  grade6_theory_44: context('Akvarium hajmi', 'Объём аквариума', [
    ["Akvariumga qancha suv sig'ishini bilish uchun uning uzunligi, eni va balandligi kerak.", 'Чтобы узнать вместимость аквариума, нужны длина, ширина и высота.'],
    ["To'g'ri burchakli idish hajmi V=a·b·c formula bilan topiladi.", 'Объём прямоугольного сосуда находят по формуле V=a·b·c.'],
  ], { type: 'cube', label: 'V = a · b · c' }),

  grade6_theory_45: context("Ranglar ichidagi eng ko'p rang", 'Самый частый цвет', [
    ["To'rtta kvadratga qarang: ikkita ko'k, bitta sariq va bitta yashil.", 'Посмотрите на четыре квадрата: два синих, один жёлтый и один зелёный.'],
    ["Eng ko'p ishlatilgan rang ko'k. Sonlar qatorida ham eng ko'p uchraydigan qiymat moda deyiladi.", 'Чаще всего встречается синий цвет. В числовом ряду самое частое значение называют модой.'],
  ], { type: 'colorTiles', tiles: ['blue', 'yellow', 'blue', 'green'], caption: L("Qaysi rang ko'proq ishlatilgan?", 'Какой цвет встречается чаще?'), highlightMost: true }),

  grade6_theory_46: context('Maktab hovlisi loyihasi', 'Проект школьного двора', [
    ["Hovli loyihasida dumaloq gulzor, uchburchak bayroq, suv idishi va o'quvchilar so'rovi bor.", 'В проекте двора есть круглая клумба, треугольный флаг, резервуар и опрос учеников.'],
    ["To'g'ri formula yoki ma'lumot ko'rsatkichini tanlash uchun vaziyatdagi kattalikni aniqlaymiz.", 'Чтобы выбрать формулу или показатель данных, определяем нужную величину.'],
  ], cards(L('gulzor — yuza', 'клумба — площадь'), L('idish — hajm', 'сосуд — объём'), L("so'rov — moda", 'опрос — мода'))),
};
