const L = (uz, ru) => ({ uz, ru });

const bridge = (titleUz, titleRu, steps, visual, eyebrowUz = 'Chizmadan tushunchaga') => ({
  type: 'info',
  eyebrow: L(eyebrowUz, 'От рисунка к понятию'),
  title: L(titleUz, titleRu),
  steps: steps.map(([uz, ru]) => L(uz, ru)),
  audio: {
    uz: steps.map(([uz]) => uz),
    ru: steps.map(([, ru]) => ru),
  },
  visual,
  isConceptBridge: true,
});

export const GRADE6_CONCEPT_BRIDGES = {
  // 1-navbat: formula va qoida chizma yoki kuzatuvdan hosil qilinadi.
  frac_6_11: [
    bridge('Qismning qismini kataklarda ko‘ramiz', 'Видим часть от части на клетках', [
      ["Bog'ni 12 teng katakka ajratamiz. Uning to'rtdan uch qismi 9 ta katak bo'ladi.", 'Разделим сад на 12 равных клеток. Три четверти сада занимают 9 клеток.'],
      ["Shu 9 katakning uchdan ikki qismi 6 ta katak. 6/12 qisqarib 1/2 bo'ladi, demak 3/4 · 2/3 = 1/2.", 'Две трети от этих 9 клеток равны 6 клеткам. Дробь 6/12 сокращается до 1/2, значит 3/4 · 2/3 = 1/2.'],
    ], {
      type: 'fractionArea',
      rows: 3,
      columns: 4,
      baseColumns: 3,
      overlapRows: 2,
      caption: L('6 ta kesishgan katak / 12 ta jami katak = 1/2', '6 общих клеток / 12 клеток = 1/2'),
    }),
  ],

  frac_6_12: [
    bridge('Bo‘lish — nechta bo‘lak sig‘ishini topish', 'Деление показывает число помещающихся частей', [
      ["Uch to'rtdan metr tasmani sakkizdan bir metrlik bo'laklarga moslab belgilaymiz. Uch to'rtdan metr — sakkizdan olti metrga teng.", 'Размечаем три четверти метра ленты на части по одной восьмой. Три четверти метра равны шести восьмым.'],
      ["Ranglangan tasmada 6 ta sakkizdan bir bor. Shuning uchun 3/4 : 1/8 = 6; teskari kasrga ko'paytirish ham shu sanoqni beradi.", 'В закрашенной ленте помещаются 6 частей по одной восьмой. Поэтому 3/4 : 1/8 = 6; умножение на обратную дробь даёт тот же результат.'],
    ], {
      type: 'ribbonCut',
      total: 8,
      filled: 6,
      segmentLabel: '1/8 m',
      caption: L('3/4 m = 6/8 m, demak 6 ta bo‘lak', '3/4 м = 6/8 м, значит 6 частей'),
    }),
  ],

  decimal_6_14: [
    bridge('Xarid narxini qismlarga ajratamiz', 'Разбиваем стоимость покупки на части', [
      ["Bir kilogramm olma 12,5 ming so'm bo'lsa, 2 kilogramm narxi 25 ming so'm bo'ladi.", 'Если килограмм яблок стоит 12,5 тысячи сумов, то 2 килограмма стоят 25 тысяч.'],
      ["0,4 kilogramm narxi 5 ming so'm. Ikki qismni qo'shsak, 2,4 kilogramm uchun 30 ming so'm chiqadi.", 'Стоимость 0,4 килограмма равна 5 тысячам сумов. Складываем две части и получаем 30 тысяч сумов за 2,4 килограмма.'],
    ], {
      type: 'dataTable',
      caption: L('Olma xaridi', 'Покупка яблок'),
      columns: [L('Massa', 'Масса'), L('Hisob', 'Вычисление'), L('Narx', 'Стоимость')],
      rows: [
        ['2 kg', '12,5 · 2', L('25 ming so‘m', '25 тысяч сумов')],
        ['0,4 kg', '12,5 · 0,4', L('5 ming so‘m', '5 тысяч сумов')],
        ['2,4 kg', '25 + 5', L('30 ming so‘m', '30 тысяч сумов')],
      ],
      highlightRow: 2,
    }),
  ],

  proportional_6_19: [
    bridge('Bir yo‘nalishda o‘zgaradigan miqdorlar', 'Величины меняются в одном направлении', [
      ["Bitta daftar 6 ming so'm. Daftarlar soni 1, 2, 3, 4 marta oshganda jami narx ham xuddi shuncha marta oshadi.", 'Одна тетрадь стоит 6 тысяч сумов. Когда число тетрадей увеличивается в 1, 2, 3, 4 раза, общая стоимость увеличивается во столько же раз.'],
      ["Ikki ustun bir xil yo'nalishda va bir xil marta o'zgargani uchun daftarlar soni bilan narx to'g'ri proporsional.", 'Оба столбца меняются в одном направлении и во столько же раз, поэтому число тетрадей и стоимость прямо пропорциональны.'],
    ], {
      type: 'dataTable',
      caption: L('Daftarlar soni va narxi', 'Количество и стоимость тетрадей'),
      columns: [L('Daftarlar soni', 'Число тетрадей'), '1', '2', '3', '4'],
      rows: [[L('Narx, ming so‘m', 'Стоимость, тыс. сум'), '6', '12', '18', '24']],
    }),
    bridge('Qarama-qarshi yo‘nalishda o‘zgaradigan miqdorlar', 'Величины меняются в противоположных направлениях', [
      ["Bir xil ishni 2 ishchi 12 kunda, 4 ishchi 6 kunda, 8 ishchi 3 kunda bajaradi.", 'Одну работу 2 рабочих выполняют за 12 дней, 4 рабочих — за 6 дней, 8 рабочих — за 3 дня.'],
      ["Ishchilar soni ikki marta oshganda vaqt ikki marta kamaymoqda. Bu teskari proporsionallikdir; har bir ustunda ko'paytma 24 ga teng.", 'При удвоении числа рабочих время уменьшается вдвое. Это обратная пропорциональность; произведение в каждом столбце равно 24.'],
    ], {
      type: 'dataTable',
      caption: L('Ishchilar soni va vaqt', 'Число рабочих и время'),
      columns: [L('Ishchilar', 'Рабочие'), '2', '4', '8'],
      rows: [
        [L('Kunlar', 'Дни'), '12', '6', '3'],
        [L('Ko‘paytma', 'Произведение'), '2·12=24', '4·6=24', '8·3=24'],
      ],
      highlightRow: 1,
    }),
  ],

  percent_6_21: [
    bridge('Foizni yuzta katakdan hosil qilamiz', 'Получаем процент из ста клеток', [
      ["Kvadrat 100 ta teng katakka bo'lingan. Bitta katak butunning yuzdan bir qismi, ya'ni 1 foizidir.", 'Квадрат разделён на 100 равных клеток. Одна клетка — одна сотая целого, то есть 1 процент.'],
      ["25 ta ranglangan katak 25/100 yoki 25 foizni bildiradi. Bu kasr qisqarib 1/4 ga, o'nli yozuvda 0,25 ga teng.", '25 закрашенных клеток означают 25/100 или 25 процентов. Эта дробь сокращается до 1/4 и равна 0,25.'],
    ], {
      type: 'percentGrid',
      filled: 25,
      caption: L('25/100 = 25% = 1/4 = 0,25', '25/100 = 25% = 1/4 = 0,25'),
    }),
  ],

  grade6_theory_29: [
    bridge('Ishora qoidasini ketma-ketlikdan topamiz', 'Находим правило знаков по закономерности', [
      ["Ikkinchi ko'paytuvchi −2 bo'lib qolsin. Birinchi ko'paytuvchi har safar 1 ga kamayganda natija 2 ga oshadi.", 'Пусть второй множитель равен −2. Когда первый множитель каждый раз уменьшается на 1, результат увеличивается на 2.'],
      ["Noldan keyin ham tartib davom etadi: (−1)·(−2)=2 va (−2)·(−2)=4. Shuning uchun ikki manfiy son ko'paytmasi musbat.", 'Закономерность продолжается после нуля: (−1)·(−2)=2 и (−2)·(−2)=4. Поэтому произведение двух отрицательных чисел положительно.'],
    ], {
      type: 'dataTable',
      caption: L('Natijalar har safar 2 ga oshadi', 'Результат каждый раз увеличивается на 2'),
      columns: [L('Ifoda', 'Выражение'), L('Natija', 'Результат')],
      rows: [['3·(−2)', '−6'], ['2·(−2)', '−4'], ['1·(−2)', '−2'], ['0·(−2)', '0'], ['(−1)·(−2)', '2'], ['(−2)·(−2)', '4']],
      highlightRow: 4,
    }),
    bridge('Qarzni olib tashlash nimani bildiradi?', 'Что означает убрать долг?', [
      ["Hisobdagi 20 ming so'mlik qarz manfiy 20 ming bilan yoziladi.", 'Долг в 20 тысяч сумов записывается числом минус 20 тысяч.'],
      ["Uchta shunday qarzni olib tashlash balansni 60 mingga oshiradi: (−3)·(−20 000)=+60 000.", 'Удаление трёх таких долгов увеличивает баланс на 60 тысяч: (−3)·(−20 000)=+60 000.'],
    ], {
      type: 'chain',
      items: [L('3 ta qarz', '3 долга'), L('olib tashlandi', 'убрали'), '+60 000'],
    }),
  ],

  grade6_theory_32: [
    bridge('Qavs tashqarisidagi son har bir qutiga tegishli', 'Множитель относится к каждой коробке', [
      ["To'rtta qutining har birida x ta daftar va 3 ta qalam bor. Daftarlar jami 4 ta x, ya'ni 4x bo'ladi.", 'В каждой из четырёх коробок x тетрадей и 3 карандаша. Всего тетрадей 4x.'],
      ["Qalamlar 4·3=12 ta. Shuning uchun 4(x+3)=4x+12; tashqi 4 qavs ichidagi ikkala hadga ham ko'paytirildi.", 'Карандашей 4·3=12. Поэтому 4(x+3)=4x+12; внешний множитель 4 умножен на оба слагаемых в скобках.'],
    ], {
      type: 'groupBoxes',
      groups: 4,
      variable: 'x',
      fixed: 3,
      result: '4(x+3) = 4x+12',
    }),
  ],

  grade6_theory_38: [
    bridge('π sonini o‘lchash orqali topamiz', 'Находим число π измерением', [
      ["Dumaloq buyum chetini ip bilan o'lchab aylana uzunligini, markazidan o'tkazib diametrini topamiz.", 'Измеряем край круглого предмета нитью, чтобы найти длину окружности, а через центр — диаметр.'],
      ["Har bir buyumda aylana uzunligini diametrga bo'lsak taxminan 3,14 chiqadi. Shu o'zgarmas nisbat π soni deyiladi.", 'Для каждого предмета отношение длины окружности к диаметру примерно равно 3,14. Это постоянное отношение называют числом π.'],
    ], {
      type: 'dataTable',
      caption: L('Dumaloq buyumlarni o‘lchash', 'Измерение круглых предметов'),
      columns: [L('Buyum', 'Предмет'), L('Diametr d', 'Диаметр d'), L('Aylana uzunligi C', 'Длина C'), 'C:d'],
      rows: [
        [L('Qopqoq', 'Крышка'), '10 cm', '31,4 cm', '3,14'],
        [L('Tarelka', 'Тарелка'), '20 cm', '62,8 cm', '3,14'],
        [L('G‘ildirak', 'Колесо'), '50 cm', '157 cm', '3,14'],
      ],
      highlightColumn: 3,
    }),
  ],

  grade6_theory_39: [
    bridge('Doirani bo‘laklab qayta joylaymiz', 'Разрезаем круг и перекладываем части', [
      ["Doirani teng sektorlarga bo'lib, ularni navbat bilan yuqoriga va pastga qaratib joylashtiramiz.", 'Делим круг на равные секторы и укладываем их попеременно вверх и вниз.'],
      ["Hosil bo'lgan shakl parallelogrammga yaqin: balandligi r, asosi esa aylana uzunligining yarmi πr. Demak S=πr·r=πr².", 'Полученная фигура близка к параллелограмму: высота равна r, а основание — половине длины окружности πr. Значит S=πr·r=πr².'],
    ], {
      type: 'circleRearrange',
      caption: L('asos ≈ πr, balandlik = r, yuza = πr²', 'основание ≈ πr, высота = r, площадь = πr²'),
    }),
  ],

  grade6_theory_42: [
    bridge('Uchta burchak bir to‘g‘ri burchak emas, to‘g‘ri chiziq hosil qiladi', 'Три угла образуют развёрнутый угол', [
      ["Qog'oz uchburchakning uchta burchagini ajratib olamiz va uchlarini bitta nuqtaga tutashtiramiz.", 'Отделяем три угла бумажного треугольника и совмещаем их вершины в одной точке.'],
      ["Ular birgalikda to'g'ri chiziq, ya'ni 180 darajali yoy hosil qiladi. Demak har qanday uchburchak burchaklari yig'indisi 180 daraja.", 'Вместе они образуют развёрнутый угол в 180 градусов. Значит сумма углов любого треугольника равна 180 градусам.'],
    ], {
      type: 'angleSum',
      angles: ['A', 'B', 'C'],
      caption: L('∠A + ∠B + ∠C = 180°', '∠A + ∠B + ∠C = 180°'),
    }),
  ],

  grade6_theory_43: [
    bridge('Nega asos va balandlik ko‘paytmasini ikkiga bo‘lamiz?', 'Почему произведение основания и высоты делим на два?', [
      ["Bir xil ikkita uchburchakni yonma-yon qo'ysak, asosi a va balandligi h bo'lgan parallelogramm hosil bo'ladi.", 'Если сложить два одинаковых треугольника, получится параллелограмм с основанием a и высотой h.'],
      ["Parallelogramm yuzi a·h. Bitta uchburchak uning teng yarmi bo'lgani uchun uchburchak yuzi S=a·h/2.", 'Площадь параллелограмма равна a·h. Один треугольник составляет его половину, поэтому S=a·h/2.'],
    ], {
      type: 'trianglePair',
      base: 'a',
      height: 'h',
      caption: L('2 ta uchburchak = a·h, 1 ta uchburchak = a·h/2', '2 треугольника = a·h, 1 треугольник = a·h/2'),
    }),
  ],

  grade6_theory_44: [
    bridge('Hajmni birlik kublar bilan sanaymiz', 'Считаем объём единичными кубами', [
      ["Qutining bir qatlamida uzunlik bo'ylab 4 ta va en bo'ylab 3 ta birlik kub joylashadi: bitta qatlamda 4·3=12 kub.", 'В одном слое коробки помещаются 4 куба по длине и 3 по ширине: в одном слое 4·3=12 кубов.'],
      ["Uchinchi qirra bo'ylab 3 ta shunday qatlam bor. Jami 12·3=36 kub, demak V=a·b·c.", 'Вдоль третьего ребра помещаются 3 таких слоя. Всего 12·3=36 кубов, значит V=a·b·c.'],
    ], {
      type: 'cubeLayers',
      columns: 4,
      rows: 3,
      layers: 3,
      caption: L('4 · 3 · 3 = 36 birlik kub', '4 · 3 · 3 = 36 единичных кубов'),
    }),
  ],

  // 2-navbat: mavjud hayotiy misol bilan ta'rif yoki algoritm orasidagi bog'lanish kuchaytiriladi.
  frac_6_09: [
    bridge('Shokolad bo‘laklarini bir xil qilamiz', 'Делаем кусочки шоколада одинаковыми', [
      ["Yarim shokoladni oltita teng bo'lak modelida yozsak, 1/2 = 3/6 bo'ladi. Miqdor o'zgarmaydi, faqat bo'laklar maydalashadi.", 'Если представить половину шоколада шестью равными частями, получим 1/2 = 3/6. Количество не меняется, части становятся мельче.'],
      ["Ikki uchdan ham oltidan to'rtga teng: 2/3 = 4/6. Endi bo'laklar bir xil, shuning uchun 3/6 va 4/6 ni suratlari orqali taqqoslaymiz.", 'Две трети равны четырём шестым: 2/3 = 4/6. Теперь части одинаковы, поэтому сравниваем 3/6 и 4/6 по числителям.'],
    ], {
      type: 'equivalentFractions',
      pairs: [
        [{ numerator: 1, denominator: 2, label: '1/2' }, { numerator: 3, denominator: 6, label: '3/6' }],
        [{ numerator: 2, denominator: 3, label: '2/3' }, { numerator: 4, denominator: 6, label: '4/6' }],
      ],
    }),
  ],

  decimal_6_15: [
    bridge('Yaqin sonni sonlar chizig‘ida tanlaymiz', 'Выбираем ближайшее число на числовой прямой', [
      ["18,746 soni 18,7 bilan 18,8 orasida joylashadi.", 'Число 18,746 расположено между 18,7 и 18,8.'],
      ["18,746 dan 18,7 gacha masofa 0,046, 18,8 gacha esa 0,054. U 18,7 ga yaqinroq, shuning uchun o'ndan birgacha 18,7 deb yaxlitlanadi.", 'Расстояние от 18,746 до 18,7 равно 0,046, а до 18,8 — 0,054. Число ближе к 18,7, поэтому при округлении до десятых получаем 18,7.'],
    ], {
      type: 'numberLine',
      points: [{ at: 10, label: '18,7' }, { at: 48, label: '18,746' }, { at: 90, label: '18,8' }],
    }),
  ],

  proportion_6_18: [
    bridge('Bir dona narx o‘zgarmasa, nisbatlar teng bo‘ladi', 'Если цена одной штуки постоянна, отношения равны', [
      ["2 ta daftar 12 ming so'm turadi, demak bitta daftar 6 ming so'm.", '2 тетради стоят 12 тысяч сумов, значит одна тетрадь стоит 6 тысяч.'],
      ["5 ta daftar 30 ming so'm turadi. Har ikki ustunda narxni daftarlar soniga bo'lsak 6 chiqadi; shuning uchun 2:5 = 12:30 proporsiya hosil bo'ladi.", '5 тетрадей стоят 30 тысяч сумов. В обоих столбцах стоимость одной тетради равна 6; поэтому получаем пропорцию 2:5 = 12:30.'],
    ], {
      type: 'dataTable',
      caption: L('Daftarlar soni va jami narx', 'Количество тетрадей и общая стоимость'),
      columns: [L('Daftarlar', 'Тетради'), '2', '5'],
      rows: [
        [L('Narx, ming so‘m', 'Стоимость, тыс. сум'), '12', '30'],
        [L('Bir dona narx', 'Цена одной'), '12:2=6', '30:5=6'],
      ],
      highlightRow: 1,
    }),
  ],

  grade6_theory_31: [
    bridge('Taksi chekidan harfli ifodaga', 'От чека такси к буквенным выражениям', [
      ["Taksiga chiqish narxi doim 6 ming so'm. Har bir kilometr esa jami narxga yana 2 ming so'm qo'shadi.", 'Посадка в такси всегда стоит 6 тысяч сумов. Каждый километр добавляет к стоимости ещё 2 тысячи.'],
      ["Masofa oldindan noma'lum bo'lsa, uni x bilan belgilaymiz. Jadvaldagi qonuniyat barcha masofalar uchun 6000+2000x ifodasini beradi.", 'Если расстояние заранее неизвестно, обозначаем его x. Закономерность таблицы даёт выражение 6000+2000x для любого расстояния.'],
    ], {
      type: 'dataTable',
      caption: L('Taksi cheki', 'Чек такси'),
      columns: [L('Masofa x, km', 'Расстояние x, км'), '0', '1', '2', '5', 'x'],
      rows: [[L('Narx, so‘m', 'Стоимость, сум'), '6000', '8000', '10000', '16000', '6000+2000x']],
      highlightColumn: 5,
    }),
  ],

  grade6_theory_34: [
    bridge('Tarozini tenglamaga aylantiramiz', 'Превращаем весы в уравнение', [
      ["Chap pallada noma'lum quti va 3 kilogramm, o'ng pallada 10 kilogramm turibdi. Tarozining tengligi x+3=10 tenglamasi bilan yoziladi.", 'На левой чаше неизвестная коробка и 3 килограмма, на правой — 10 килограммов. Равновесие записывается уравнением x+3=10.'],
      ["Tenglama — noma'lum qatnashgan tenglik. Hozircha x ning qiymatini aytmaymiz; avval muvozanatni saqlab uni ajratamiz.", 'Уравнение — это равенство с неизвестным. Пока не называем значение x; сначала сохраним равновесие и отделим неизвестное.'],
    ], { type: 'balance', left: 'x+3', right: '10' }),
    bridge('Ikki tomondan bir xil miqdorni olamiz', 'Убираем одинаковую величину с обеих сторон', [
      ["Chap tomondagi 3 kilogrammni olib tashlasak, muvozanat buzilmasligi uchun o'ng tomondan ham 3 kilogrammni olamiz.", 'Если убрать 3 килограмма слева, для сохранения равновесия убираем 3 килограмма и справа.'],
      ["Chap tomonda x, o'ng tomonda 10−3=7 qoladi. Demak x=7; tekshiruvda 7+3=10.", 'Слева остаётся x, справа 10−3=7. Значит x=7; проверка: 7+3=10.'],
    ], { type: 'balance', left: 'x', right: '7', result: '7+3=10' }),
  ],

  grade6_theory_35: [
    bridge('Masala shartidan kesmali modelga', 'От условия задачи к модели отрезками', [
      ["Birinchi savatdagi olmalarni noma'lum x uzunlikdagi kesma bilan ko'rsatamiz.", 'Покажем яблоки в первой корзине отрезком неизвестной длины x.'],
      ["Ikkinchi savatda x ga qo'shimcha 6 ta olma bor. Ikki kesmaning jami 38 bo'lgani uchun x+(x+6)=38 tenglamasi hosil bo'ladi.", 'Во второй корзине к x добавлены ещё 6 яблок. Сумма двух отрезков равна 38, поэтому получаем уравнение x+(x+6)=38.'],
    ], {
      type: 'barModel',
      bars: [
        { label: L('1-savat', '1-я корзина'), parts: [{ value: 'x', tone: 'blue', size: 5 }] },
        { label: L('2-savat', '2-я корзина'), parts: [{ value: 'x', tone: 'blue', size: 5 }, { value: '+6', tone: 'yellow', size: 2 }] },
      ],
      total: L('Jami 38 ta olma', 'Всего 38 яблок'),
    }),
  ],

  grade6_theory_36: [
    bridge('Do‘kon cheki narx formulasini beradi', 'Чек магазина даёт формулу стоимости', [
      ["Bir dona daftar 4 ming so'm. Chekda 1, 2 va 3 ta daftar narxi miqdor bilan birlik narx ko'paytmasidan hosil bo'ladi.", 'Одна тетрадь стоит 4 тысячи сумов. В чеке стоимость 1, 2 и 3 тетрадей получается умножением количества на цену одной.'],
      ["Miqdorni n, birlik narxni p desak, jami qiymat C=p·n bo'ladi. Formula jadvaldagi barcha ustunlar uchun ishlaydi.", 'Обозначим количество n, цену одной p, тогда общая стоимость C=p·n. Формула работает для каждого столбца таблицы.'],
    ], {
      type: 'dataTable',
      caption: L('Daftar xaridi', 'Покупка тетрадей'),
      columns: [L('Miqdor n', 'Количество n'), '1', '2', '3', 'n'],
      rows: [[L('Jami narx C', 'Общая стоимость C'), '4', '8', '12', '4·n']],
      highlightColumn: 4,
    }),
    bridge('Ish hajmi ham jadvaldan formulaga o‘tadi', 'Объём работы также переходит из таблицы в формулу', [
      ["Usta har soatda 8 ta detal tayyorlasa, 1, 2 va 3 soatda tayyorlangan detallar soni 8, 16 va 24 bo'ladi.", 'Если мастер делает 8 деталей в час, за 1, 2 и 3 часа он изготовит 8, 16 и 24 детали.'],
      ["Unumdorlikni r, vaqtni t desak, bajarilgan ish A=r·t. Bu narx formulasidagi kabi bir xil miqdorni takroriy qo'shishdan keladi.", 'Обозначим производительность r, время t, тогда работа A=r·t. Как и формула стоимости, она возникает из повторного сложения одной величины.'],
    ], {
      type: 'dataTable',
      caption: L('Ustaning ish jadvali', 'График работы мастера'),
      columns: [L('Vaqt t, soat', 'Время t, ч'), '1', '2', '3', 't'],
      rows: [[L('Ish A, detal', 'Работа A, деталей'), '8', '16', '24', '8·t']],
      highlightColumn: 4,
    }),
  ],

  grade6_theory_37: [
    bridge('Chegara — aylana, ichki soha — doira', 'Граница — окружность, внутренняя область — круг', [
      ["Velosiped g'ildiragining faqat tashqi gardishi aylana modelidir. Aylana chiziq bo'lgani uchun uning uzunligi o'lchanadi.", 'Только внешний обод велосипедного колеса является моделью окружности. Окружность — линия, поэтому измеряют её длину.'],
      ["Tanganing butun yuzi, ya'ni chegara bilan birga ichki qismi doira modelidir. Doiraning yuzi o'lchanadi.", 'Вся поверхность монеты вместе с границей и внутренней частью является моделью круга. У круга измеряют площадь.'],
    ], {
      type: 'circleCompare',
      leftLabel: L('Aylana — chegara', 'Окружность — граница'),
      rightLabel: L('Doira — ichki soha', 'Круг — внутренняя область'),
    }),
  ],

  grade6_theory_40: [
    bridge('Qog‘ozni buklab simmetriya o‘qini topamiz', 'Находим ось симметрии складыванием бумаги', [
      ["Shaklni chiziq bo'ylab buklaganimizda chap va o'ng qismlar aynan ustma-ust tushsa, bu chiziq simmetriya o'qi bo'ladi.", 'Если при сгибании фигуры по линии левая и правая части точно совпадают, эта линия является осью симметрии.'],
      ["Mos A va A′ nuqtalar buklanish chizig'idan teng masofada turadi. Ularni tutashtirgan kesma o'qqa perpendikulyar.", 'Соответствующие точки A и A′ находятся на равных расстояниях от линии сгиба. Соединяющий их отрезок перпендикулярен оси.'],
    ], {
      type: 'foldSymmetry',
      left: 'A',
      right: 'A′',
      caption: L('A dan o‘qqacha masofa = A′ dan o‘qqacha masofa', 'Расстояние от A до оси = расстоянию от A′ до оси'),
    }),
  ],

  grade6_theory_41: [
    bridge('Shaklni markaz atrofida yarim buramiz', 'Поворачиваем фигуру на пол-оборота', [
      ["Shaffof qog'ozdagi A nuqtani O markaz atrofida 180 darajaga aylantiramiz.", 'Поворачиваем точку A на прозрачной бумаге вокруг центра O на 180 градусов.'],
      ["A nuqta O ning qarama-qarshi tomonidagi A′ nuqtaga tushadi. O nuqta AA′ kesmaning o'rtasi, OA va OA′ masofalar teng.", 'Точка A переходит в A′ на противоположной стороне от O. Точка O — середина AA′, расстояния OA и OA′ равны.'],
    ], {
      type: 'centralRotation',
      caption: L('180° burilish: A → A′ va OA=OA′', 'Поворот на 180°: A → A′ и OA=OA′'),
    }),
  ],
};
