// ============================================================================
// 9-sinf, Dars 49. UCHBURCHAKLARNI YECHISH.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 32-dars (94-95-bet).
//   Ta'rif (94-bet): uchburchakning tomonlari va burchaklari uning
//       ELEMENTLARI. Berilgan elementlardan qolganlarini topish
//       «uchburchakni yechish» deyiladi.
//   1-masala (bir tomon va unga yopishgan ikkita burchak): a = 6,
//       β = 60°, γ = 45° → α = 75°, b ≈ 5,4, c ≈ 4,4.
//   2-masala (ikki tomon va ular orasidagi burchak): a = 6, b = 4,
//       γ = 120° → c = √76 ≈ 8,7, α ≈ 36°, β ≈ 24°.
//   3-masala (uchta tomon): a = 10, b = 6, c = 13 → cos C = −0,275,
//       ya'ni C o'tmas, C ≈ 106°, keyin sin A ≈ 0,7396 → A ≈ 47°,
//       B ≈ 26°.
//   32.1-32.4: uchala tipdagi mashqlar.
//
// DARSNING O'ZAGI — TARTIB, FORMULA EMAS. Ikkala teorema ham 47 va
// 48-darslarda chiqarilgan. Bugungi yangilik shundaki, ularni QAYSI
// KETMA-KETLIKDA ishlatish kerak, va bu ketma-ketlik 47-darsda
// topilgan kamchilikdan kelib chiqadi: sinus o'tkir va o'tmas
// burchakni ajratmaydi. Darslikning 3-masalasi shu sababli ENG KATTA
// tomondan boshlaydi — uning qarshisidagi burchakni kosinus orqali
// topsak, ishora o'tmaslikni darhol ko'rsatadi. Bitta o'tmas burchak
// topilgach, qolgan ikkitasi albatta o'tkir va sinus xavfsiz bo'ladi.
//
// XUK: uchta tomon berilgan (10, 6, 13), birorta burchak yo'q.
// Sinuslar teoremasi umuman ishga tushmaydi, chunki unga kamida
// bitta burchak kerak. Ya'ni qurolni ma'lumot tanlaydi.
//
// TUZOQ (12-ekran): uchta tomon berilganda KICHIK tomondan boshlash.
// Kamron avval B ni topgan (26°), keyin sinuslar teoremasi bilan C ni
// izlagan: sin C = 0,9614 va kalkulyator 74° bergan. Aslida C = 106°.
// Xato hisobda emas — sinus ikkala javobni ham beradi, tanlashni esa
// hech narsa aytmaydi. Tekshiruv: eng katta tomonga eng katta burchak
// qarshi turishi kerak, 74° esa A dan ham kichik chiqadi.
//
// TRANSFER (13-ekran): yerdagi o'lchov. Daryoning narigi qirg'og'idagi
// nuqtagacha bo'lgan masofa o'lchanmaydi, lekin qirg'oqda yuz metrli
// bazis olib, ikkita burchakni o'lchash mumkin. Bu 1-masalaning aynan
// o'zi va «trigonometriya» so'zining ma'nosini yakunlaydi.
//
// CHIZMA: `TriFig` (7K), yangisi yasalmadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, TriFig } from './asboblar.jsx'

export const META = {
  id: 'grade9-49',
  n: 49,
  row: 49,
  block: 'Б7',
  topic: L('Uchburchaklarni yechish', 'Решение треугольников', 'Solving triangles'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Uchburchakni yechish deb berilgan elementlardan qolganlarini topishga aytiladi",
    'Решить треугольник значит найти остальные элементы по данным',
    'To solve a triangle is to find its remaining elements from the given ones',
  ),
  L(
    "Qurolni ma'lumot tanlaydi: burchak yo'q bo'lsa, faqat kosinuslar teoremasi ishlaydi",
    'Инструмент выбирают данные: если углов нет, работает только теорема косинусов',
    'The data choose the tool: with no angle given only the law of cosines works',
  ),
  L(
    "Uchta tomon berilganda eng katta tomonning qarshisidagi burchakdan boshlanadi",
    'При трёх сторонах начинают с угла против наибольшей стороны',
    'With three sides, start from the angle opposite the largest one',
  ),
]

export const MISS = {
  'kichik-tomondan-boshlash': {
    what: L(
      "uchta tomon berilganda kichik tomondan boshlandi va o'tmas burchak yo'qoldi",
      'при трёх сторонах начали с малой стороны и потеряли тупой угол',
      'with three sides the start was from a small side and the obtuse angle was lost',
    ),
    wrong: null,
    at: 0,
  },
  'notogri-teoremani-tanlash': {
    what: L(
      "berilgan ma'lumotga mos kelmaydigan teorema tanlandi",
      'выбрана теорема, не подходящая к данным',
      'a theorem was chosen that does not fit the data',
    ),
    wrong: null,
    at: 0,
  },
  'uchinchi-burchakni-unutish': {
    what: L(
      "uchinchi burchak burchaklar yig'indisidan topilmadi",
      'третий угол не найден из суммы углов',
      'the third angle was not found from the angle sum',
    ),
    wrong: null,
    at: 0,
  },
  'javobni-tekshirmaslik': {
    what: L(
      "javob tomonlar va burchaklar tartibiga qarab tekshirilmadi",
      'ответ не проверен по порядку сторон и углов',
      'the answer was not checked against the order of sides and angles',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — birorta burchak yo'q.
// ============================================================
const S1 = {
  eyebrow: L('BURCHAK YO\'Q', 'УГЛОВ НЕТ', 'NO ANGLES'),
  title: L(
    "Uchta tomon, uchta noma'lum burchak",
    'Три стороны, три неизвестных угла',
    'Three sides, three unknown angles',
  ),
  audio: [
    A('mount',
      "Uchburchakning tomonlari o'n, olti va o'n uch. Uchala burchagini ham topish kerak.",
      'Стороны треугольника десять, шесть и тринадцать. Нужно найти все три угла.',
      'A triangle has sides ten, six and thirteen. Find all three angles.'),
    A('why',
      "Ikkita teoremamiz bor. Ulardan qaysi biri shu ma'lumot bilan ishga tushadi.",
      'У нас две теоремы. Какая из них запускается с такими данными.',
      'We have two theorems. Which of them starts with such data.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[10, 6, 13]}
          names={['A', 'B', 'C']}
          edges={{ a: '10', b: '6', c: '13' }}
        />
      }
      steps={[]}
      ask={L(
        "Qaysi teorema bilan boshlash mumkin?",
        'С какой теоремы можно начать?',
        'Which theorem can start here?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Kosinuslar', 'Косинусов', 'Of cosines') },
        {
          id: 'wrong',
          label: L('Sinuslar', 'Синусов', 'Of sines'),
          hint: L(
            "Sinuslar teoremasining har bir kasrida bitta tomon va bitta burchak turadi. Bu yerda esa birorta burchak berilmagan, ya'ni hamma kasrda ikkita noma'lum bo'lardi.",
            'В каждой дроби теоремы синусов стоят сторона и угол. А здесь не дано ни одного угла, значит в каждой дроби было бы по два неизвестных.',
            'Each fraction in the law of sines holds a side and an angle. Here no angle is given, so every fraction would hold two unknowns.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun shunday tanlovni har bir holat uchun o'rganamiz va tartibning o'zi ham muhim bo'lib chiqadi.",
        'Верно. Сегодня разберём такой выбор для каждого случая, и сам порядок действий тоже окажется важным.',
        'Correct. Today we sort out that choice for every case, and the order of steps will matter too.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — har bir teorema nima talab qiladi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Har bir teoremaning talabi",
    'Что требует каждая теорема',
    'What each theorem demands',
  ),
  audio: [
    A('mount',
      "47-darsning teoremasi tomon va uning qarshisidagi burchak juftligini talab qilardi.",
      'Теорема 47 урока требовала пары из стороны и противолежащего ей угла.',
      'The theorem of lesson 47 needed a side paired with the angle facing it.'),
    A('why',
      "48-darsning teoremasi esa ikkita tomon va ular orasidagi burchakni.",
      'А теорема 48 урока требовала двух сторон и угла между ними.',
      'The theorem of lesson 48 needed two sides and the angle between them.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Ikkita tomon va ular orasidagi burchak berilgan",
        'Даны две стороны и угол между ними',
        'Two sides and the angle between them are given',
      )}
      steps={[]}
      ask={L(
        "Qaysi teorema ishlaydi?",
        'Какая теорема работает?',
        'Which theorem works?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Kosinuslar', 'Косинусов', 'Of cosines') },
        {
          id: 'wrong',
          label: L('Sinuslar', 'Синусов', 'Of sines'),
          hint: L(
            "Berilgan burchak noma'lum uchinchi tomonga qarshi turibdi, demak sinuslar teoremasining kasrida ikkita noma'lum bo'lib qoladi.",
            'Данный угол лежит против неизвестной третьей стороны, значит в дроби теоремы синусов окажется два неизвестных.',
            'The given angle faces the unknown third side, so a fraction of the law of sines would hold two unknowns.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchta asosiy holat bor va bugun uchalasini ham ko'rib chiqamiz.",
        'Верно. Основных случаев три, и сегодня разберём все три.',
        'Correct. There are three main cases and today we work through all of them.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — birinchi tip.
// ============================================================
const S3 = {
  eyebrow: L('BIRINCHI TIP', 'ПЕРВЫЙ ТИП', 'THE FIRST TYPE'),
  title: L(
    "Tomon va unga yopishgan ikkita burchak",
    'Сторона и два прилежащих угла',
    'A side and its two adjacent angles',
  ),
  audio: [
    A('mount',
      "Darslikning birinchi masalasi. a olti, beta oltmish daraja, gamma qirq besh daraja.",
      'Первая задача учебника. a шесть, бета шестьдесят градусов, гамма сорок пять.',
      'The first problem of the textbook. a is six, beta sixty degrees, gamma forty five.'),
    A('why',
      "Ikkita burchak ma'lum bo'lsa, uchinchisi o'z-o'zidan chiqadi.",
      'Если известны два угла, третий получается сам собой.',
      'With two angles known the third comes on its own.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[6, 5.4, 4.4]}
          names={['A', 'B', 'C']}
          edges={{ a: '6' }}
          angles={{ B: '60°', C: '45°' }}
        />
      }
      steps={[]}
      ask={L(
        "Birinchi qadam qanday bo'ladi?",
        'Каким будет первый шаг?',
        'What is the first step?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Uchinchi burchakni yig'indidan topish",
            'Найти третий угол из суммы',
            'Find the third angle from the sum',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Kosinuslar teoremasini yozish",
            'Записать теорему косинусов',
            'Write the law of cosines',
          ),
          hint: L(
            "Kosinuslar teoremasi uchun ikkita TOMON kerak, bu yerda esa tomon bitta. Burchaklar yig'indisi bir yuz sakson ekani esa hech narsa talab qilmaydi.",
            'Теореме косинусов нужны две СТОРОНЫ, а здесь сторона одна. А сумма углов сто восемьдесят не требует ничего.',
            'The law of cosines needs two SIDES and here there is one. The angle sum of one hundred eighty asks for nothing.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Alfa bir yuz sakson ayirib oltmish ayirib qirq besh, ya'ni yetmish besh daraja. Endi a va alfa juftligi bor va sinuslar teoremasi qolgan ikkita tomonni beradi.",
        'Верно. Альфа это сто восемьдесят минус шестьдесят минус сорок пять, то есть семьдесят пять градусов. Теперь есть пара a и альфа, и теорема синусов даст две другие стороны.',
        'Correct. Alpha is one hundred eighty minus sixty minus forty five, that is seventy five degrees. Now the pair a and alpha exists and the law of sines gives the other two sides.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — ikkinchi tip.
// ============================================================
const S4 = {
  eyebrow: L('IKKINCHI TIP', 'ВТОРОЙ ТИП', 'THE SECOND TYPE'),
  title: L(
    "Ikki tomon va ular orasidagi burchak",
    'Две стороны и угол между ними',
    'Two sides and the angle between them',
  ),
  audio: [
    A('mount',
      "Darslikning ikkinchi masalasi. a olti, b to'rt, gamma bir yuz yigirma daraja.",
      'Вторая задача учебника. a шесть, b четыре, гамма сто двадцать градусов.',
      'The second problem. a is six, b is four, gamma one hundred twenty degrees.'),
    A('why',
      "Kosinuslar teoremasi uchinchi tomonni beradi, keyin uchta tomon ham ma'lum bo'ladi.",
      'Теорема косинусов даст третью сторону, и тогда станут известны все три.',
      'The law of cosines gives the third side and then all three are known.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('c² = 36 + 16 − 48 · (−0,5)', 'c² = 36 + 16 − 48 · (−0,5)', 'c² = 36 + 16 − 48 · (−0.5)')}
      steps={[]}
      ask={L(
        "c nechaga teng?",
        'Чему равно c?',
        'What does c equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '√76 ≈ 8,7' },
        {
          id: 'wrong',
          label: '√28 ≈ 5,3',
          hint: L(
            "Bir yuz yigirma o'tmas burchak, uning kosinusi manfiy. Manfiyni ayirish qo'shishga aylanadi, ya'ni yigirma to'rt qo'shiladi.",
            'Сто двадцать это тупой угол, его косинус отрицателен. Вычитание отрицательного превращается в сложение, то есть двадцать четыре прибавляется.',
            'One hundred twenty is obtuse and its cosine is negative. Subtracting a negative adds, so twenty four is added.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi uchta tomon ham ma'lum. Qolgan burchaklarni yana kosinuslar teoremasi bilan topamiz.",
        'Верно. Теперь известны все три стороны. Остальные углы найдём снова теоремой косинусов.',
        'Correct. Now all three sides are known and the remaining angles come again from the law of cosines.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — uchinchi tip va tartib.
// ============================================================
const S5 = {
  eyebrow: L('UCHINCHI TIP', 'ТРЕТИЙ ТИП', 'THE THIRD TYPE'),
  title: L(
    "Qaysi burchakdan boshlash kerak",
    'С какого угла начинать',
    'Which angle to start with',
  ),
  audio: [
    A('mount',
      "Xukning uchburchagiga qaytamiz: o'n, olti, o'n uch. Uchala burchakni ham kosinuslar teoremasi bilan topish mumkin.",
      'Вернёмся к треугольнику из хука: десять, шесть, тринадцать. Все три угла можно найти теоремой косинусов.',
      'Back to the hook triangle: ten, six, thirteen. All three angles can come from the law of cosines.'),
    A('why',
      "Lekin darslik aniq bir burchakdan boshlashni maslahat beradi.",
      'Но учебник советует начинать с определённого угла.',
      'But the textbook advises starting from one particular angle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[10, 6, 13]}
          names={['A', 'B', 'C']}
          edges={{ a: '10', b: '6', c: '13' }}
        />
      }
      steps={[
        { id: 'a', head: L('Eng katta tomon', 'Наибольшая сторона', 'The largest side'), lines: ['c = 13'] },
      ]}
      ask={L(
        "Nega aynan eng katta tomonning burchagidan boshlanadi?",
        'Почему начинают именно с угла наибольшей стороны?',
        'Why start from the angle of the largest side?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Faqat o'sha burchak o'tmas bo'lishi mumkin",
            'Только этот угол может быть тупым',
            'Only that angle can be obtuse',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Katta sonlar bilan hisoblash oson",
            'С большими числами считать проще',
            'Big numbers are easier to compute with',
          ),
          hint: L(
            "Uchburchakda ikkita o'tmas burchak bo'lishi mumkin emas, chunki yig'indi bir yuz saksondan oshib ketardi. O'tmas burchak esa eng uzun tomonga qarshi yotadi.",
            'В треугольнике не может быть двух тупых углов, иначе сумма превысит сто восемьдесят. А тупой угол лежит против самой длинной стороны.',
            'A triangle cannot hold two obtuse angles, or the sum would pass one hundred eighty. And an obtuse angle faces the longest side.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Kosinusning ishorasi shu burchak o'tmasmi yoki o'tkirmi degan savolga darhol javob beradi, va bu keyingi qadamlarni xavfsiz qiladi.",
        'Верно. Знак косинуса сразу отвечает, тупой этот угол или острый, и это делает следующие шаги безопасными.',
        'Correct. The sign of the cosine answers at once whether that angle is obtuse or acute, and that makes the next steps safe.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — ishora ishlaydi.
// ============================================================
const S6 = {
  eyebrow: L('ISHORA', 'ЗНАК', 'THE SIGN'),
  title: L(
    "Manfiy kosinus nimani aytadi",
    'О чём говорит отрицательный косинус',
    'What a negative cosine says',
  ),
  audio: [
    A('mount',
      "Eng katta tomon o'n uch, unga C burchagi qarshi turadi. Kosinusni hisoblaymiz.",
      'Наибольшая сторона тринадцать, против неё лежит угол C. Посчитаем косинус.',
      'The largest side is thirteen and the angle C faces it. Compute the cosine.'),
    A('why',
      "Surat yuz qo'shuv o'ttiz olti ayirib bir yuz oltmish to'qqiz, ya'ni minus o'ttiz uch.",
      'Числитель сто плюс тридцать шесть минус сто шестьдесят девять, то есть минус тридцать три.',
      'The numerator is one hundred plus thirty six minus one hundred sixty nine, that is minus thirty three.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('cos C = −33 : 120 = −0,275', 'cos C = −33 : 120 = −0,275', 'cos C = −33 : 120 = −0.275')}
      steps={[]}
      ask={L(
        "C burchak qanday burchak?",
        'Каким является угол C?',
        'What kind of angle is C?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("O'tmas", 'Тупой', 'Obtuse') },
        {
          id: 'wrong',
          label: L("O'tkir", 'Острый', 'Acute'),
          hint: L(
            "46-darsni eslang: o'tkir burchakning kosinusi musbat edi. Bu yerda esa natija manfiy chiqdi.",
            'Вспомни 46 урок: у острого угла косинус был положительным. А здесь результат отрицательный.',
            'Recall lesson 46: an acute angle had a positive cosine. Here the result is negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Jadval kosinusi nol butun ikki yuz yetmish besh mingdan bo'lgan burchakni yetmish to'rt daraja deb beradi, manfiy ishora esa uni bir yuz sakson ayirib yetmish to'rtga, ya'ni bir yuz oltiga aylantiradi.",
        'Верно. Таблица даёт для косинуса ноль целых двести семьдесят пять тысячных угол семьдесят четыре градуса, а минус превращает его в сто восемьдесят минус семьдесят четыре, то есть сто шесть.',
        'Correct. The table gives seventy four degrees for a cosine of zero point two seven five, and the minus turns it into one hundred eighty minus seventy four, that is one hundred six.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — endi sinus xavfsiz.
// ============================================================
const S7 = {
  eyebrow: L('ENDI SINUS XAVFSIZ', 'ТЕПЕРЬ СИНУС БЕЗОПАСЕН', 'NOW THE SINE IS SAFE'),
  title: L(
    "O'tmas burchak topilgach",
    'Когда тупой угол найден',
    'Once the obtuse angle is found',
  ),
  audio: [
    A('mount',
      "C burchagi bir yuz olti daraja. Qolgan ikkita burchakni endi sinuslar teoremasi bilan topamiz.",
      'Угол C равен ста шести градусам. Остальные два угла найдём теоремой синусов.',
      'The angle C is one hundred six degrees. The other two come from the law of sines.'),
    A('why',
      "47-darsda sinus ikkita javob berardi. Endi esa ikkinchi javob mumkin emas.",
      'На 47 уроке синус давал два ответа. А теперь второй ответ невозможен.',
      'In lesson 47 the sine gave two answers. Now the second is impossible.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('sin A ≈ 0,7396', 'sin A ≈ 0,7396', 'sin A ≈ 0.7396')}
      steps={[
        { id: 'a', head: L('Ikkita nomzod', 'Два кандидата', 'Two candidates'), lines: ['A ≈ 47°', 'A ≈ 133°'] },
      ]}
      ask={L(
        "Qaysi javob to'g'ri?",
        'Какой ответ верен?',
        'Which answer is right?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '47°' },
        {
          id: 'wrong',
          label: '133°',
          hint: L(
            "C burchagi allaqachon bir yuz olti daraja. Unga bir yuz o'ttiz uchni qo'shsak, bir yuz saksondan oshib ketadi.",
            'Угол C уже сто шесть градусов. Если прибавить сто тридцать три, выйдем за сто восемьдесят.',
            'The angle C is already one hundred six. Adding one hundred thirty three passes one hundred eighty.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bitta o'tmas burchak topilgach, qolganlari albatta o'tkir bo'ladi va sinusning ikkinchi javobi o'z-o'zidan yo'qoladi. Uchinchi burchak esa yig'indidan chiqadi: yigirma olti daraja.",
        'Верно. Как только найден тупой угол, остальные обязательно острые, и второй ответ синуса отпадает сам. А третий угол выходит из суммы: двадцать шесть градусов.',
        'Correct. Once the obtuse angle is found the others must be acute and the second answer of the sine falls away. The third angle comes from the sum: twenty six degrees.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    'Geometriya 9, 32-dars (94-95-bet)',
    'Геометрия 9, урок 32 (стр. 94-95)',
    'Geometry 9, lesson 32 (p. 94-95)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        steps={[]}
        ask={L(
          "Bugun yangi formula chiqdimi?",
          'Появилась ли сегодня новая формула?',
          'Did a new formula appear today?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Yo'q, yangisi tartib bo'ldi",
              'Нет, новым стал порядок действий',
              'No, what is new is the order of steps',
            ),
          },
          {
            id: 'wrong',
            label: L(
              "Ha, uchburchakni yechish formulasi",
              'Да, формула решения треугольника',
              'Yes, a formula for solving a triangle',
            ),
            hint: L(
              "Barcha hisoblar 47 va 48-darslarning ikkita teoremasi bilan bajarildi. Bugun ularni qanday ketma-ketlikda ishlatish o'rganildi.",
              'Все вычисления сделаны двумя теоремами с 47 и 48 уроков. Сегодня изучили, в каком порядке их применять.',
              'Every computation used the two theorems of lessons 47 and 48. Today taught the order to use them in.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Yangi formula emas, yangi tartib",
    'Не новая формула, а новый порядок',
    'No new formula, a new order',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz uchta holatni va ular uchun tartibni ko'rdingiz.",
      'На семи экранах ты увидел три случая и порядок действий для них.',
      'On seven screens you met three cases and the order of steps for them.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — birinchi tip.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tomon va ikkita burchak",
    'Сторона и два угла',
    'A side and two angles',
  ),
  audio: [
    A('mount',
      "Darslikning o'ttiz ikki nuqta birinchi mashqi. Har safar uchinchi burchakdan boshlang.",
      'Задача тридцать два точка один учебника. Каждый раз начинай с третьего угла.',
      'Exercise thirty two point one. Each time start from the third angle.'),
    A('why',
      "Keyin sinuslar teoremasi qolgan tomonlarni beradi.",
      'Затем теорема синусов даст остальные стороны.',
      'Then the law of sines gives the remaining sides.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Birinchi tipda hech qachon ikki xil javob chiqmaydi: burchaklar to'liq ma'lum bo'ladi va sinuslar teoremasi faqat tomonlarni topadi.",
      'Обе решены. В первом типе двух ответов не бывает никогда: углы известны полностью, а теорема синусов ищет только стороны.',
      'Both are solved. The first type never gives two answers: the angles are fully known and the law of sines only finds sides.',
    ),
    tasks: [
      {
        expr: 'a = 5,   β = 45°,   γ = 45°',
        question: L(
          "Uchinchi burchak nechaga teng?",
          'Чему равен третий угол?',
          'What is the third angle?',
        ),
        ok: L("Ha, to'qson daraja. Bu to'g'ri burchakli uchburchak ekan.", 'Да, девяносто градусов. Это оказался прямоугольный треугольник.', 'Yes, ninety degrees. The triangle turns out to be right angled.'),
        items: [
          { id: 'a', right: true, label: '90°' },
          { id: 'b', label: '45°', hint: L("Uchala burchakning yig'indisi bir yuz sakson. Qirq besh qo'shuv qirq besh to'qson, qolgani ham to'qson.", 'Сумма всех трёх углов сто восемьдесят. Сорок пять плюс сорок пять девяносто, остаётся тоже девяносто.', 'The three angles sum to one hundred eighty. Forty five plus forty five is ninety, leaving ninety.') },
        ],
        solution: ['α = 180° − 45° − 45°', 'α = 90°'],
      },
      {
        expr: 'a = 5,   α = 90°,   β = 45°',
        question: L(
          "b tomon nechaga teng?",
          'Чему равна сторона b?',
          'What is the side b?',
        ),
        ok: L(
          "Ha, taxminan uch butun besh o'ndan. Besh karra sinus qirq besh bo'lingan sinus to'qson.",
          'Да, примерно три целых пять десятых. Пять на синус сорока пяти делить на синус девяноста.',
          'Yes, about three point five. Five times the sine of forty five over the sine of ninety.',
        ),
        items: [
          { id: 'a', right: true, label: '≈ 3,5' },
          { id: 'b', label: '5', hint: L("Besh bu gipotenuza, u to'qson darajaga qarshi turibdi. Qirq besh darajaga qarshi tomon esa undan qisqaroq.", 'Пять это гипотенуза, она лежит против девяноста градусов. А сторона против сорока пяти короче.', 'Five is the hypotenuse facing ninety degrees. The side facing forty five is shorter.') },
        ],
        solution: ['b = 5 · sin 45° : sin 90°', 'b ≈ 3,54'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ikkinchi tip.
// ============================================================
const S10 = {
  eyebrow: L('IKKINCHI TIP', 'ВТОРОЙ ТИП', 'THE SECOND TYPE'),
  title: L(
    "Avval uchinchi tomon",
    'Сначала третья сторона',
    'The third side first',
  ),
  audio: [
    A('mount',
      "Darslikning o'ttiz ikki nuqta ikkinchi mashqi. Ikkita tomon va ular orasidagi burchak berilgan.",
      'Задача тридцать два точка два учебника. Даны две стороны и угол между ними.',
      'Exercise thirty two point two. Two sides and the angle between them are given.'),
    A('why',
      "Kosinuslar teoremasi bilan uchinchi tomonni topamiz.",
      'Теоремой косинусов найдём третью сторону.',
      'The law of cosines gives the third side.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Uchinchi tomon topilgach, masala uchinchi tipga aylanadi va qolgan burchaklar ham kosinuslar teoremasi bilan topiladi.",
      'Обе найдены. Как только найдена третья сторона, задача превращается в третий тип, и остальные углы тоже находят теоремой косинусов.',
      'Both are found. Once the third side is known the problem becomes the third type and the remaining angles come from the law of cosines too.',
    ),
    tasks: [
      {
        expr: 'a = 6,   b = 4,   γ = 60°',
        question: L('c nechaga teng?', 'Чему равно c?', 'What does c equal?'),
        ok: L("Ha, ildiz yigirma sakkiz, taxminan besh butun uch o'ndan.", 'Да, корень из двадцати восьми, примерно пять целых три десятых.', 'Yes, root twenty eight, about five point three.'),
        items: [
          { id: 'a', right: true, label: '√28' },
          { id: 'b', label: '√76', hint: L("Ildiz yetmish olti bir yuz yigirma darajadagi javob edi. Oltmish darajada esa kosinus musbat va yigirma to'rt ayiriladi.", 'Корень из семидесяти шести был ответом при ста двадцати градусах. А при шестидесяти косинус положителен и двадцать четыре вычитается.', 'Root seventy six was the answer at one hundred twenty degrees. At sixty the cosine is positive and twenty four is subtracted.') },
        ],
        solution: ['c² = 36 + 16 − 48 · 0,5', 'c² = 28'],
      },
      {
        expr: 'b = 14,   c = 10,   α = 145°',
        question: L(
          "a tomon yigirma to'rtdan katta bo'ladimi?",
          'Будет ли сторона a больше двадцати четырёх?',
          'Will the side a be more than twenty four?',
        ),
        ok: L(
          "Yo'q, kichik. Uchburchak tengsizligi bo'yicha tomon qolgan ikkitasining yig'indisidan har doim kichik.",
          'Нет, меньше. По неравенству треугольника сторона всегда меньше суммы двух других.',
          'No, less. By the triangle inequality a side is always less than the sum of the other two.',
        ),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          {
            id: 'b',
            label: L('Ha', 'Да', 'Yes'),
            hint: L(
              "Burchak qanchalik katta bo'lmasin, uchburchak tengsizligi kuchda qoladi: a o'n to'rt qo'shuv o'ndan kichik bo'lishi shart.",
              'Каким бы большим ни был угол, неравенство треугольника остаётся в силе: a обязана быть меньше четырнадцати плюс десять.',
              'However large the angle, the triangle inequality holds: a must be less than fourteen plus ten.',
            ),
          },
        ],
        solution: ['a² = 196 + 100 − 280 · cos 145°', 'a ≈ 22,9  <  24'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — uchinchi tip.
// ============================================================
const S11 = {
  eyebrow: L('UCHINCHI TIP', 'ТРЕТИЙ ТИП', 'THE THIRD TYPE'),
  title: L(
    "Uchta tomon, eng kattasidan boshlaymiz",
    'Три стороны, начинаем с наибольшей',
    'Three sides, starting with the largest',
  ),
  audio: [
    A('mount',
      "Darslikning o'ttiz ikki nuqta uchinchi mashqi. Har safar eng katta tomonning burchagini birinchi tekshiring.",
      'Задача тридцать два точка три учебника. Каждый раз первым проверяй угол наибольшей стороны.',
      'Exercise thirty two point three. Each time check the angle of the largest side first.'),
    A('why',
      "Ishora uchburchakning turini aytib beradi.",
      'Знак сообщит тип треугольника.',
      'The sign will name the type of triangle.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham aniqlandi va hisobning o'zi deyarli kerak bo'lmadi: faqat suratning ishorasiga qarash yetdi. Bu tez tekshiruv har qanday masalada birinchi qadam bo'lishi mumkin.",
      'Оба определены, и сам счёт почти не понадобился: хватило взгляда на знак числителя. Такая быстрая проверка может быть первым шагом в любой задаче.',
      'Both are settled and almost no computing was needed: a glance at the sign of the numerator sufficed. That quick check can open any problem.',
    ),
    tasks: [
      {
        expr: 'a = 2,   b = 3,   c = 4',
        question: L(
          "Eng katta burchak o'tkirmi yoki o'tmas?",
          'Наибольший угол острый или тупой?',
          'Is the largest angle acute or obtuse?',
        ),
        ok: L(
          "Ha, o'tmas. To'rt qo'shuv to'qqiz ayirib o'n olti minus uchga teng, ya'ni kosinus manfiy.",
          'Да, тупой. Четыре плюс девять минус шестнадцать это минус три, значит косинус отрицателен.',
          'Yes, obtuse. Four plus nine minus sixteen is minus three, so the cosine is negative.',
        ),
        items: [
          { id: 'a', right: true, label: L("O'tmas", 'Тупой', 'Obtuse') },
          { id: 'b', label: L("O'tkir", 'Острый', 'Acute'), hint: L("Suratni hisoblang: kichik ikkita tomonning kvadratlari yig'indisi to'rt qo'shuv to'qqiz o'n uch, eng katta tomonning kvadrati esa o'n olti. Yig'indi kichik chiqdi.", 'Посчитай числитель: сумма квадратов двух меньших сторон четыре плюс девять тринадцать, а квадрат наибольшей шестнадцать. Сумма оказалась меньше.', 'Compute the numerator: the squares of the two smaller sides give four plus nine, thirteen, while the largest squared is sixteen. The sum came out smaller.') },
        ],
        solution: ['cos C = (4 + 9 − 16) : 12', 'cos C = −0,25'],
      },
      {
        expr: 'a = 4,   b = 5,   c = 7',
        question: L(
          "Eng katta burchak o'tkirmi yoki o'tmas?",
          'Наибольший угол острый или тупой?',
          'Is the largest angle acute or obtuse?',
        ),
        ok: L(
          "Ha, o'tmas. O'n olti qo'shuv yigirma besh ayirib qirq to'qqiz minus sakkiz.",
          'Да, тупой. Шестнадцать плюс двадцать пять минус сорок девять это минус восемь.',
          'Yes, obtuse. Sixteen plus twenty five minus forty nine is minus eight.',
        ),
        items: [
          { id: 'a', right: true, label: L("O'tmas", 'Тупой', 'Obtuse') },
          { id: 'b', label: L("To'g'ri", 'Прямой', 'Right'), hint: L("To'g'ri burchak uchun surat aynan nolga teng bo'lishi kerak edi, ya'ni Pifagor tengligi bajarilardi. Bu yerda esa minus sakkiz chiqdi.", 'Для прямого угла числитель должен был равняться нулю, то есть выполнялось бы равенство Пифагора. А здесь вышло минус восемь.', 'A right angle needs the numerator to be exactly zero, that is Pythagoras holding. Here it came out minus eight.') },
        ],
        solution: ['cos C = (16 + 25 − 49) : 40', 'cos C = −0,2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — kichik tomondan boshlash.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tartib buzilsa, burchak yo'qoladi",
    'Нарушишь порядок — потеряешь угол',
    'Break the order and lose an angle',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Tomonlar o'n, olti, o'n uch. U kichik tomondan boshlagan va B burchagini yigirma olti daraja deb to'g'ri topgan.",
      'Решение Камрона. Стороны десять, шесть, тринадцать. Он начал с малой стороны и верно нашёл угол B, двадцать шесть градусов.',
      "Kamron's solution. The sides are ten, six, thirteen. He started from the small side and correctly found the angle B, twenty six degrees."),
    A('why',
      "Keyin sinuslar teoremasi bilan C ni izlagan. Sinus C nol butun to'qqiz ming olti yuz o'n to'rt o'n mingdan chiqqan va kalkulyator yetmish to'rt daraja bergan.",
      'Затем теоремой синусов искал C. Синус C вышел ноль целых девять тысяч шестьсот четырнадцать десятитысячных, и калькулятор дал семьдесят четыре градуса.',
      'Then he sought C by the law of sines. The sine of C came out zero point nine six one four and the calculator said seventy four degrees.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kalkulyator har doim o'tkir javobni beradi, chunki sinus ikkala burchakda ham bir xil. Kamronning javobida C yetmish to'rt, A esa yetmish to'qqiz daraja bo'lib qoladi — ya'ni eng katta burchak eng katta tomonga qarshi turmaydi. Aynan shuning uchun uchta tomon berilganda eng katta tomondan boshlanadi: kosinusning ishorasi ikkilanishni umuman qoldirmaydi.",
      'Калькулятор всегда даёт острый ответ, ведь синус у обоих углов одинаков. В ответе Камрона C семьдесят четыре, а A семьдесят девять градусов — то есть наибольший угол лежит не против наибольшей стороны. Именно поэтому при трёх сторонах начинают с наибольшей: знак косинуса не оставляет неоднозначности.',
      'A calculator always returns the acute answer, since the sine is the same for both angles. In Kamron answer C is seventy four and A seventy nine, so the largest angle does not face the largest side. That is why three sides call for starting with the largest: the sign of the cosine leaves no ambiguity.',
    ),
    tasks: [
      {
        expr: 'a = 10,   b = 6,   c = 13',
        question: L(
          "Eng katta burchak qaysi tomonga qarshi turishi kerak?",
          'Против какой стороны должен лежать наибольший угол?',
          'Which side must the largest angle face?',
        ),
        ok: L(
          "To'g'ri, o'n uchga. Demak yetmish to'rt daraja bo'lishi mumkin emas, chunki A yetmish to'qqiz chiqib ketardi.",
          'Верно, против тринадцати. Значит семьдесят четыре быть не может, ведь A вышел бы семьдесят девять.',
          'Correct, the thirteen. So seventy four is impossible, since A would come out seventy nine.',
        ),
        items: [
          { id: 'a', right: true, label: L('c = 13 ga', 'Против c = 13', 'The side c = 13') },
          {
            id: 'b',
            label: L('b = 6 ga', 'Против b = 6', 'The side b = 6'),
            hint: L(
              "Uchburchakda katta tomonga katta burchak qarshi yotadi. O'n uch eng uzun tomon, demak unga eng katta burchak tegishli.",
              'В треугольнике против большей стороны лежит больший угол. Тринадцать самая длинная сторона, значит ей принадлежит наибольший угол.',
              'In a triangle the larger side faces the larger angle. Thirteen is the longest side, so the largest angle belongs to it.',
            ),
          },
        ],
        solution: [
          'cos C = −0,275   →   C ≈ 106°',
          'A ≈ 47°,   B ≈ 26°',
          L('Kamron: C ≈ 74°', 'Камрон: C ≈ 74°', 'Kamron: C ≈ 74°'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — daryoning kengligi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "O'lchab bo'lmaydigan masofa",
    'Расстояние, которое не измерить',
    'A distance you cannot measure',
  ),
  audio: [
    A('mount',
      "Daryoning narigi qirg'og'idagi daraxtgacha bo'lgan masofani ruletka bilan o'lchab bo'lmaydi.",
      'Расстояние до дерева на другом берегу реки рулеткой не измерить.',
      'The distance to a tree on the far bank cannot be measured with a tape.'),
    A('why',
      "Lekin o'z qirg'og'ida yuz metrli bazis olib, ikkita burchakni o'lchash mumkin.",
      'Но на своём берегу можно отложить базис в сто метров и измерить два угла.',
      'But on your own bank you can lay a base of one hundred metres and measure two angles.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bu darslikning birinchi masalasining aynan o'zi, faqat sonlar boshqa. Yer o'lchash ishlari asrlar davomida shu usulda bajarilgan va «trigonometriya» so'zi yunonchada aynan uchburchaklarni yechish degani.",
      'Это в точности первая задача учебника, только числа другие. Землемерные работы веками велись именно так, и слово тригонометрия по-гречески означает решение треугольников.',
      'This is exactly the first textbook problem with other numbers. Land surveying worked this way for centuries, and trigonometry in Greek means solving triangles.',
    ),
    tasks: [
      {
        expr: 'c = 100 m,   ∠A = 60°,   ∠B = 45°',
        question: L(
          "Daraxt turgan uchdagi burchak nechaga teng?",
          'Чему равен угол при вершине, где стоит дерево?',
          'What is the angle at the vertex where the tree stands?',
        ),
        ok: L("Ha, yetmish besh daraja.", 'Да, семьдесят пять градусов.', 'Yes, seventy five degrees.'),
        items: [
          { id: 'a', right: true, label: '75°' },
          { id: 'b', label: '105°', hint: L("Burchaklar yig'indisi bir yuz sakson. Oltmish qo'shuv qirq besh bir yuz besh, qolgani yetmish besh.", 'Сумма углов сто восемьдесят. Шестьдесят плюс сорок пять сто пять, остаётся семьдесят пять.', 'The angles sum to one hundred eighty. Sixty plus forty five is one hundred five, leaving seventy five.') },
        ],
        solution: ['∠C = 180° − 60° − 45°', '∠C = 75°'],
      },
      {
        expr: 'c = 100,   ∠C = 75°,   ∠A = 60°',
        question: L(
          "Daraxtgacha bo'lgan masofa nechaga teng?",
          'Чему равно расстояние до дерева?',
          'What is the distance to the tree?',
        ),
        ok: L(
          "Ha, taxminan sakson to'qqiz butun yetti o'ndan metr. Yuz karra sinus oltmish bo'lingan sinus yetmish besh.",
          'Да, примерно восемьдесят девять целых семь десятых метра. Сто на синус шестидесяти делить на синус семидесяти пяти.',
          'Yes, about eighty nine point seven metres. One hundred times the sine of sixty over the sine of seventy five.',
        ),
        items: [
          { id: 'a', right: true, label: L('≈ 89,7 m', '≈ 89,7 м', '≈ 89.7 m') },
          {
            id: 'b',
            label: L('≈ 100 m', '≈ 100 м', '≈ 100 m'),
            hint: L(
              "Qidirilayotgan tomon oltmish darajaga qarshi turibdi, bazis esa yetmish besh darajaga. Kichik burchakka qarshi tomon qisqaroq bo'ladi.",
              'Искомая сторона лежит против шестидесяти градусов, а базис против семидесяти пяти. Против меньшего угла сторона короче.',
              'The wanted side faces sixty degrees while the base faces seventy five. The smaller angle faces the shorter side.',
            ),
          },
        ],
        solution: ['a = 100 · sin 60° : sin 75°', 'a ≈ 89,7'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: qaysi teorema, qaysi burchakdan",
    'Блиц: какая теорема, с какого угла',
    'Blitz: which theorem, which angle first',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'notogri-teoremani-tanlash',
        ask: L(
          "Uchta tomon berilgan. Qaysi teorema bilan boshlanadi?",
          'Даны три стороны. С какой теоремы начинают?',
          'Three sides are given. Which theorem starts?',
        ),
        options: [
          { id: 'r', right: true, label: L('Kosinuslar', 'Косинусов', 'Of cosines') },
          { id: 'w', label: L('Sinuslar', 'Синусов', 'Of sines') },
        ],
        ok: L(
          "To'g'ri. Sinuslar teoremasi uchun kamida bitta burchak kerak edi.",
          'Верно. Теореме синусов нужен был хотя бы один угол.',
          'Correct. The law of sines needed at least one angle.',
        ),
        hint: L(
          "1-ekranni eslang: birorta burchak berilmagandi, ya'ni har bir kasrda ikkita noma'lum bo'lardi.",
          'Вспомни 1 экран: ни одного угла не дано, значит в каждой дроби было бы по два неизвестных.',
          'Recall screen 1: no angle was given, so every fraction would hold two unknowns.',
        ),
      },
      {
        id: 'q2',
        tag: 'kichik-tomondan-boshlash',
        ask: L(
          "Uchta tomon berilganda qaysi burchakdan boshlanadi?",
          'С какого угла начинают при трёх сторонах?',
          'Which angle comes first with three sides?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Eng katta tomonning burchagidan", 'С угла наибольшей стороны', 'The angle of the largest side'),
          },
          {
            id: 'w',
            label: L('Istalganidan', 'С любого', 'Any of them'),
          },
        ],
        ok: L(
          "To'g'ri. Faqat o'sha burchak o'tmas bo'lishi mumkin, va uni birinchi topsak, qolgani xavfsiz.",
          'Верно. Только этот угол может быть тупым, и найдя его первым, дальше действуешь безопасно.',
          'Correct. Only that angle can be obtuse, and finding it first makes the rest safe.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron kichigidan boshlagan va o'tmas burchakni butunlay yo'qotgan.",
          'Вспомни 12 экран: Камрон начал с малой стороны и полностью потерял тупой угол.',
          'Recall screen 12: Kamron started small and lost the obtuse angle entirely.',
        ),
      },
      {
        id: 'q3',
        tag: 'uchinchi-burchakni-unutish',
        ask: L(
          "Tomon va unga yopishgan ikkita burchak berilgan. Birinchi qadam?",
          'Даны сторона и два прилежащих угла. Первый шаг?',
          'A side and its two adjacent angles are given. First step?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Uchinchi burchakni yig'indidan topish", 'Найти третий угол из суммы', 'Find the third angle from the sum'),
          },
          {
            id: 'w',
            label: L('Kosinuslar teoremasini yozish', 'Записать теорему косинусов', 'Write the law of cosines'),
          },
        ],
        ok: L(
          "To'g'ri. Shundan keyin tomon va uning qarshi burchagi juftligi paydo bo'ladi.",
          'Верно. После этого появится пара из стороны и её противолежащего угла.',
          'Correct. After that a side appears paired with the angle facing it.',
        ),
        hint: L(
          "3-ekranni eslang: kosinuslar teoremasi uchun ikkita tomon kerak edi, bu yerda esa tomon bitta.",
          'Вспомни 3 экран: теореме косинусов нужны две стороны, а здесь сторона одна.',
          'Recall screen 3: the law of cosines needs two sides and here there is one.',
        ),
      },
      {
        id: 'q4',
        tag: 'javobni-tekshirmaslik',
        ask: L(
          "Javobni qanday tez tekshirish mumkin?",
          'Как быстро проверить ответ?',
          'How can an answer be checked quickly?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L(
              "Katta tomonga katta burchak qarshi turibdimi",
              'Лежит ли больший угол против большей стороны',
              'Does the larger angle face the larger side',
            ),
          },
          {
            id: 'w',
            label: L("Barcha tomonlar butun sonmi", 'Целые ли все стороны', 'Are all the sides whole numbers'),
          },
        ],
        ok: L(
          "To'g'ri. Bu tekshiruv hisobni takrorlamasdan xatoni topadi.",
          'Верно. Такая проверка находит ошибку, не повторяя вычислений.',
          'Correct. That check finds the error without redoing the computation.',
        ),
        hint: L(
          "12-ekranni eslang: aynan shu tekshiruv Kamronning javobini yiqitgandi.",
          'Вспомни 12 экран: именно эта проверка обрушила ответ Камрона.',
          'Recall screen 12: that very check brought down Kamron answer.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Ikkita teorema, uchta holat",
    'Две теоремы, три случая',
    'Two theorems, three cases',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda uchta tomon bor edi va sinuslar teoremasi umuman ishga tushmasdi.",
      'На первом экране были три стороны, и теорема синусов вообще не запускалась.',
      'On the first screen three sides were given and the law of sines would not start at all.'),
    A('s1',
      "Siz uchta holatni ajratdingiz, tartibni o'rgandingiz va daryoning narigi qirg'og'igacha bo'lgan masofani hisobladingiz.",
      'Ты различил три случая, освоил порядок и вычислил расстояние до другого берега.',
      'You told the three cases apart, learned the order, and computed a distance to the far bank.'),
    A('s2',
      "Keyingi darsda uchburchak yuzini burchak sinusi orqali topish.",
      'В следующем уроке площадь треугольника через синус угла.',
      'The next lesson finds the area of a triangle through the sine of an angle.'),
  ],
  props: {
    mark: 'a, b, c   →   α, β, γ',
    markNote: L(
      "eng katta tomondan boshlanadi",
      'начинают с наибольшей стороны',
      'start from the largest side',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: uchburchak yuzi',
      'Следующий урок: площадь треугольника',
      'Next lesson: the area of a triangle',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'notogri-teoremani-tanlash', ...S2 },
  { role: 'explain',  tag: 'uchinchi-burchakni-unutish', ...S3 },
  { role: 'explain',  tag: 'notogri-teoremani-tanlash', ...S4 },
  { role: 'explain',  tag: 'kichik-tomondan-boshlash', ...S5 },
  { role: 'explain',  tag: 'kichik-tomondan-boshlash', ...S6 },
  { role: 'explain',  tag: 'javobni-tekshirmaslik', ...S7 },
  { role: 'rule',     tag: 'notogri-teoremani-tanlash', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'uchinchi-burchakni-unutish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'notogri-teoremani-tanlash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'kichik-tomondan-boshlash', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'javobni-tekshirmaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'uchinchi-burchakni-unutish', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
