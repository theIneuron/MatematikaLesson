// ============================================================================
// 9-sinf, Dars 47. SINUSLAR TEOREMASI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 28-dars (84-85-bet).
//   Teorema (84-bet): uchburchakning tomonlari qarshisidagi
//       burchaklarning sinuslariga proporsional,
//       a / sin A = b / sin B = c / sin C.
//   1-masala (84-bet): AB = 14 dm, ∠A = 30°, ∠C = 65° → BC ≈ 7,78 dm
//       (darslikning 153-betidagi jadvalda sin65° ≈ 0,9).
//   2-masala (84-85-bet): shu nisbat TASHQI CHIZILGAN AYLANANING
//       DIAMETRIGA teng, ya'ni a/sin A = 2R. Isbot: BD diametr
//       o'tkaziladi, BCD to'g'ri burchakli (BD diametrga tiralgan),
//       BC = BD · sin D = 2R · sin D, va ∠D = ∠A, chunki ikkalasi
//       bitta BC yoyiga tiralgan.
//   28.2 (3-rasm): a) 6√2, 30°, 45° → 6;  b) 8√3, 60°, 45° → 8√2;
//       d) ∠A = 30°, ∠C = 105°, BC = 7 → AC = 7√2.
//   28.4: burchak 30°, qarshi tomon 4,8 → R = 4,8.
//   28.5: tomon tashqi aylananing radiusiga teng → sin A = 1/2, ya'ni
//       burchak 30° YOKI 150° — darslik ikkala holni ko'rishni
//       alohida so'raydi.
//
// ISBOT DARSLIKNING BIRINCHI YO'LI BILAN EMAS, IKKINCHISI BILAN.
// Darslik teoremani YUZ orqali isbotlaydi (S = ½ab·sinC), yuz esa
// 27-darsda, ya'ni bizning rejamizda hali oldinda. Ikkinchi yo'l —
// tashqi chizilgan aylana — bugun to'liq ochiq: 37-darsdan bitta
// yoyga tiralgan burchaklarning tengligi, 38-darsdan diametrga
// tiralgan burchakning to'g'riligi. Shuning uchun isbot shu yo'ldan
// yuradi va darhol KUCHLIROQ natija beradi: nisbat 2R ga teng.
//
// XUK 46-DARSNING CHEGARASINI KO'RSATADI. Kecha sinus katetning
// gipotenuzaga nisbati edi — ya'ni faqat TO'G'RI BURCHAKLI
// uchburchakda ishlardi. Darslikning 1-masalasida esa to'g'ri burchak
// yo'q: AB = 14, ∠A = 30°, ∠C = 65°. Eski qurol ishlamaydi, javob esa
// bor.
//
// TUZOQ (12-ekran): nisbatda tomonni O'ZIGA YONDOSH burchak bilan
// juftlash. AB tomoniga qarshi C burchagi turadi, A emas. Xato
// hisobda emas, juftlashda, va u javobni 7,78 o'rniga 25,4 qiladi —
// ya'ni topilgan tomon berilganidan uzun chiqadi, garchi u kichikroq
// burchakka qarshi tursa ham. Razbor aynan shu tekshiruvni beradi.
//
// TRANSFER (13-ekran) — 28.5: tomon tashqi aylananing radiusiga teng
// bo'lsa, sin A = 1/2 chiqadi va bu YAGONA javob bermaydi: 30° ham,
// 150° ham to'g'ri. Sinus ikkita burchakni ajratmaydi (46-dars,
// sin(180° − α) = sin α), shuning uchun sinuslar teoremasi burchak
// qidirilganda ikkita holni beradi. Bu 48-darsda kosinuslar
// teoremasiga o'tishning sababi ham bo'ladi: kosinus ishorasi bilan
// holni ajratadi.
//
// CHIZMA: `TriFig` (7K) va `CircleFig` (7H) — ikkalasi ham tayyor.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { CircleFig, G9_RECOLOR, G9_STYLES, RecallMC, TriFig } from './asboblar.jsx'

export const META = {
  id: 'grade9-47',
  n: 47,
  row: 47,
  block: 'Б7',
  topic: L('Sinuslar teoremasi', 'Теорема синусов', 'The law of sines'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Uchburchakning tomonlari qarshisidagi burchaklarning sinuslariga proporsional",
    'Стороны треугольника пропорциональны синусам противолежащих углов',
    'The sides of a triangle are proportional to the sines of the opposite angles',
  ),
  L(
    "Bu nisbat tashqi chizilgan aylananing diametriga teng: a / sin A = 2R",
    'Это отношение равно диаметру описанной окружности: a / sin A = 2R',
    'That ratio equals the diameter of the circumscribed circle: a / sin A = 2R',
  ),
  L(
    "Har bir tomon o'ziga QARSHI turgan burchak bilan juftlanadi",
    'Каждая сторона идёт в паре с ПРОТИВОЛЕЖАЩИМ ей углом',
    'Each side pairs with the angle OPPOSITE it',
  ),
]

export const MISS = {
  'yondosh-burchak-bilan-juftlash': {
    what: L(
      "tomon qarshi burchak o'rniga yondosh burchak bilan juftlandi",
      'сторона сопоставлена с прилежащим углом вместо противолежащего',
      'the side was paired with an adjacent angle instead of the opposite one',
    ),
    wrong: null,
    at: 0,
  },
  'ikkinchi-holni-unutish': {
    what: L(
      "sinus bo'yicha burchak qidirilganda ikkinchi hol unutildi",
      'при поиске угла по синусу упущен второй случай',
      'the second case was missed when finding an angle from its sine',
    ),
    wrong: null,
    at: 0,
  },
  'uchinchi-burchakni-hisoblamaslik': {
    what: L(
      "uchinchi burchak yig'indi orqali topilmadi",
      'третий угол не найден через сумму углов',
      'the third angle was not found from the angle sum',
    ),
    wrong: null,
    at: 0,
  },
  'tomon-burchakka-proporsional': {
    what: L(
      "tomon burchakning o'ziga proporsional deb olindi, sinusiga emas",
      'сторона принята пропорциональной самому углу, а не его синусу',
      'the side was taken proportional to the angle itself, not to its sine',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — to'g'ri burchak yo'q.
// ============================================================
const S1 = {
  eyebrow: L('TO\'G\'RI BURCHAK YO\'Q', 'ПРЯМОГО УГЛА НЕТ', 'NO RIGHT ANGLE'),
  title: L(
    "Kechagi qurol bu yerda ishlamaydi",
    'Вчерашний инструмент здесь не работает',
    'Yesterday tool does not work here',
  ),
  audio: [
    A('mount',
      "ABC uchburchakda AB o'n to'rt detsimetr, A burchagi o'ttiz daraja, C burchagi esa oltmish besh daraja. BC tomonni topish kerak.",
      'В треугольнике ABC сторона AB четырнадцать дециметров, угол A тридцать градусов, угол C шестьдесят пять. Нужно найти сторону BC.',
      'In ABC the side AB is fourteen decimetres, the angle A thirty degrees and the angle C sixty five. Find the side BC.'),
    A('why',
      "46-darsda sinus katetning gipotenuzaga nisbati edi. Bu yerda esa katet ham, gipotenuza ham yo'q.",
      'На 46 уроке синус был отношением катета к гипотенузе. А здесь нет ни катета, ни гипотенузы.',
      'In lesson 46 the sine was a leg over the hypotenuse. Here there is neither leg nor hypotenuse.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[7.7, 13.2, 14]}
          names={['A', 'B', 'C']}
          edges={{ c: '14', a: '?' }}
          angles={{ A: '30°', C: '65°' }}
        />
      }
      steps={[]}
      ask={L(
        "Bu uchburchakda BC ni topish mumkinmi?",
        'Можно ли найти BC в этом треугольнике?',
        'Can BC be found in this triangle?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Mumkin, lekin yangi bog'lanish kerak",
            'Можно, но нужна новая связь',
            'It can, but a new link is needed',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Mumkin emas: sinus faqat to'g'ri burchakda ishlaydi",
            'Нельзя: синус работает только в прямоугольном',
            'It cannot: the sine works only in a right triangle',
          ),
          hint: L(
            "Sinusning ta'rifi to'g'ri burchakli uchburchakda berilgan edi, lekin uni istalgan burchak uchun hisoblash mumkin. Savol shu sonlarni tomonlar bilan qanday bog'lashda.",
            'Определение синуса дали в прямоугольном треугольнике, но вычислить его можно для любого угла. Вопрос в том, как связать эти числа со сторонами.',
            'The sine was defined in a right triangle, but it can be computed for any angle. The question is how to link those numbers to the sides.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun shunday bog'lanishni chiqaramiz va u istalgan uchburchakda ishlaydi.",
        'Верно. Сегодня выведем такую связь, и она работает в любом треугольнике.',
        'Correct. Today we derive that link, and it works in any triangle.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — 37 va 38-darslar.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Aylanadan ikkita fakt",
    'Два факта об окружности',
    'Two facts about a circle',
  ),
  audio: [
    A('mount',
      "37-darsda bitta yoyga tiralgan ichki chizilgan burchaklar teng edi.",
      'На 37 уроке вписанные углы, опирающиеся на одну дугу, были равны.',
      'In lesson 37 inscribed angles on the same arc were equal.'),
    A('why',
      "38-darsda esa diametrga tiralgan burchak to'g'ri burchak bo'lib chiqqandi.",
      'А на 38 уроке угол, опирающийся на диаметр, оказался прямым.',
      'And in lesson 38 an angle on a diameter turned out to be right.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <CircleFig
          pts={[{ deg: 130, label: 'B' }, { deg: 205, label: 'C' }, { deg: 350, label: 'A' }, { deg: 310, label: 'D' }]}
          chords={[[0, 1], [1, 2], [2, 0], [0, 3], [3, 1]]}
          showCenter
          cap={L(
            "∠A va ∠D bitta BC yoyiga tiralgan",
            '∠A и ∠D опираются на одну дугу BC',
            '∠A and ∠D rest on the same arc BC',
          )}
        />
      }
      steps={[]}
      ask={L(
        "A va D nuqtalardagi burchaklar bitta BC yoyiga tiralgan. Ular haqida nima deyish mumkin?",
        'Углы при A и D опираются на одну дугу BC. Что можно о них сказать?',
        'The angles at A and D rest on the same arc BC. What can be said of them?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Teng', 'Равны', 'Equal') },
        {
          id: 'wrong',
          label: L("Yig'indisi 180°", 'В сумме 180°', 'They sum to 180°'),
          hint: L(
            "Bir yuz sakson beradigan burchaklar QARAMA-QARSHI yoylarga tiralgan bo'lardi. Bu yerda esa ikkalasi bitta yoyga tiralgan.",
            'Сумму сто восемьдесят дают углы, опирающиеся на ПРОТИВОПОЛОЖНЫЕ дуги. А здесь оба опираются на одну.',
            'A sum of one hundred eighty comes from angles on OPPOSITE arcs. Here both rest on one and the same.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu ikkita fakt bugungi isbotning butun quroli bo'ladi.",
        'Верно. Эти два факта и есть весь инструмент сегодняшнего доказательства.',
        'Correct. Those two facts are the entire tool of today proof.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — diametr o'tkazamiz.
// ============================================================
const S3 = {
  eyebrow: L('DIAMETR', 'ДИАМЕТР', 'A DIAMETER'),
  title: L(
    "Uchburchakka aylana chizamiz",
    'Опишем вокруг треугольника окружность',
    'Circumscribe a circle about the triangle',
  ),
  audio: [
    A('mount',
      "ABC uchburchakka tashqi aylana chizamiz va B nuqtadan diametr o'tkazamiz. Uning ikkinchi uchini D deb belgilaymiz.",
      'Опишем вокруг ABC окружность и проведём из точки B диаметр. Второй его конец обозначим D.',
      'Circumscribe a circle about ABC and draw a diameter from B. Call its other end D.'),
    A('why',
      "Endi C nuqtani D bilan tutashtiramiz va yangi uchburchakka qaraymiz.",
      'Теперь соединим точку C с D и посмотрим на новый треугольник.',
      'Now join C to D and look at the new triangle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <CircleFig
          pts={[{ deg: 130, label: 'B' }, { deg: 205, label: 'C' }, { deg: 350, label: 'A' }, { deg: 310, label: 'D' }]}
          chords={[[0, 1], [1, 2], [2, 0], [0, 3], [3, 1]]}
          showCenter
          cap={L('BD — diametr', 'BD — диаметр', 'BD is a diameter')}
        />
      }
      steps={[]}
      ask={L(
        "BCD uchburchakdagi C burchagi nechaga teng?",
        'Чему равен угол при C в треугольнике BCD?',
        'What is the angle at C in the triangle BCD?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '90°' },
        {
          id: 'wrong',
          label: L("Berilganlardan topib bo'lmaydi", 'По данным не найти', 'It cannot be found from the data'),
          hint: L(
            "BD kesma diametr, C burchagi esa unga tiralgan. 38-darsning natijasini eslang.",
            'Отрезок BD это диаметр, а угол C на него опирается. Вспомни результат 38 урока.',
            'The segment BD is a diameter and the angle C rests on it. Recall the result of lesson 38.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Demak BCD to'g'ri burchakli uchburchak, va unda 46-darsning sinusi to'liq ishlaydi.",
        'Верно. Значит BCD прямоугольный, и в нём синус с 46 урока работает в полную силу.',
        'Correct. So BCD is right angled, and there the sine of lesson 46 works in full.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — BC = 2R sin A.
// ============================================================
const S4 = {
  eyebrow: L('BURCHAKNI ALMASHTIRAMIZ', 'МЕНЯЕМ УГОЛ', 'SWAPPING THE ANGLE'),
  title: L(
    "D burchagi A burchagining o'rniga",
    'Угол D вместо угла A',
    'The angle D in place of A',
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli BCD uchburchakda BC qarshi katet, BD esa gipotenuza va u diametrga, ya'ni ikki R ga teng.",
      'В прямоугольном треугольнике BCD сторона BC противолежащий катет, а BD гипотенуза и она равна диаметру, то есть двум R.',
      'In the right triangle BCD the side BC is the opposite leg and BD is the hypotenuse, equal to the diameter, that is two R.'),
    A('why',
      "Demak BC teng ikki R karra sinus D. Endi D burchagi haqida nima bilamiz.",
      'Значит BC равно двум R на синус D. А что мы знаем об угле D.',
      'So BC equals two R times the sine of D. And what do we know about the angle D.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('BC = 2R · sin D', 'BC = 2R · sin D', 'BC = 2R · sin D')}
      steps={[
        { id: 'a', head: L('Bitta yoy', 'Одна дуга', 'One arc'), lines: ['∠D = ∠A'] },
      ]}
      ask={L(
        "Tenglik qanday ko'rinishga keladi?",
        'Каким станет равенство?',
        'What does the equality become?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'BC = 2R · sin A' },
        {
          id: 'wrong',
          label: 'BC = 2R · sin B',
          hint: L(
            "D va A burchaklar bitta BC yoyiga tiralgan, shuning uchun ular teng. B burchagi esa boshqa yoyga tiraladi.",
            'Углы D и A опираются на одну дугу BC, поэтому они равны. А угол B опирается на другую дугу.',
            'The angles D and A rest on the same arc BC, so they are equal. The angle B rests on another arc.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkala tomonni sinus A ga bo'lsak, BC bo'lingan sinus A teng ikki R chiqadi. Bu yerda o'ng tomonda burchak umuman qolmadi.",
        'Верно. Разделив обе части на синус A, получим BC на синус A равно два R. Справа угла не осталось вовсе.',
        'Correct. Dividing both sides by the sine of A gives BC over sine A equals two R. No angle is left on the right.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — uchala tomon uchun.
// ============================================================
const S5 = {
  eyebrow: L('UCHALASI UCHUN', 'ДЛЯ ВСЕХ ТРЁХ', 'FOR ALL THREE'),
  title: L(
    "O'ng tomonda burchak yo'q",
    'Справа угла не осталось',
    'No angle remains on the right',
  ),
  audio: [
    A('mount',
      "Isbotda B uchidan diametr o'tkazgandik. Xuddi shu ishni A va C uchlaridan ham qilish mumkin.",
      'В доказательстве мы провели диаметр из вершины B. То же самое можно сделать из A и из C.',
      'In the proof we drew the diameter from B. The same can be done from A and from C.'),
    A('why',
      "Har safar natijaning o'ng tomonida bir xil son turadi.",
      'Каждый раз справа оказывается одно и то же число.',
      'Each time the same number stands on the right.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'a : sin A = 2R,   b : sin B = 2R,   c : sin C = 2R',
        'a : sin A = 2R,   b : sin B = 2R,   c : sin C = 2R',
        'a : sin A = 2R,   b : sin B = 2R,   c : sin C = 2R',
      )}
      steps={[]}
      ask={L(
        "Bundan qanday xulosa chiqadi?",
        'Какой вывод отсюда следует?',
        'What conclusion follows?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Uchala nisbat ham o'zaro teng",
            'Все три отношения равны между собой',
            'All three ratios are equal to one another',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Har bir tomon uchun o'z radiusi bor",
            'У каждой стороны свой радиус',
            'Each side has its own radius',
          ),
          hint: L(
            "Aylana bitta va uning radiusi ham bitta. Tomon o'zgarganda o'ng tomondagi son o'zgarmaydi.",
            'Окружность одна, и радиус у неё один. Меняется сторона, а число справа остаётся прежним.',
            'There is one circle with one radius. The side changes, the number on the right does not.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu sinuslar teoremasi: tomonlar qarshisidagi burchaklarning sinuslariga proporsional, va umumiy nisbat tashqi aylananing diametriga teng.",
        'Верно. Это теорема синусов: стороны пропорциональны синусам противолежащих углов, а общее отношение равно диаметру описанной окружности.',
        'Correct. This is the law of sines: the sides are proportional to the sines of the opposite angles, and the common ratio is the diameter of the circumscribed circle.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning masalasi.
// ============================================================
const S6 = {
  eyebrow: L('XUKKA JAVOB', 'ОТВЕТ НА ХУК', 'ANSWERING THE HOOK'),
  title: L(
    "Endi birinchi masala yechiladi",
    'Теперь первая задача решается',
    'Now the first problem gives way',
  ),
  audio: [
    A('mount',
      "Birinchi ekranga qaytamiz. AB o'n to'rt, A burchagi o'ttiz, C burchagi oltmish besh daraja.",
      'Вернёмся к первому экрану. AB четырнадцать, угол A тридцать, угол C шестьдесят пять градусов.',
      'Back to the first screen. AB is fourteen, the angle A thirty and the angle C sixty five degrees.'),
    A('why',
      "AB tomonga qarshi C burchagi, BC tomonga esa A burchagi turibdi.",
      'Против стороны AB лежит угол C, а против BC угол A.',
      'The angle C lies opposite AB, and the angle A opposite BC.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[7.7, 13.2, 14]}
          names={['A', 'B', 'C']}
          edges={{ c: '14', a: '?' }}
          angles={{ A: '30°', C: '65°' }}
        />
      }
      steps={[
        { id: 'a', head: L('Nisbat', 'Отношение', 'The ratio'), lines: ['AB : sin C = BC : sin A'] },
      ]}
      ask={L(
        "BC nechaga teng?",
        'Чему равно BC?',
        'What does BC equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '≈ 7,78' },
        {
          id: 'wrong',
          label: '≈ 25,4',
          hint: L(
            "Yigirma besh butun to'rt o'ndan o'n to'rtdan UZUN. Lekin BC o'ttiz darajaga, AB esa oltmish besh darajaga qarshi turibdi: kichik burchakka qarshi qisqaroq tomon yotadi.",
            'Двадцать пять целых четыре десятых ДЛИННЕЕ четырнадцати. Но BC лежит против тридцати градусов, а AB против шестидесяти пяти: против меньшего угла лежит меньшая сторона.',
            'Twenty five point four is LONGER than fourteen. But BC lies opposite thirty degrees and AB opposite sixty five: the smaller angle faces the shorter side.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. O'n to'rt karra nol butun besh o'ndan bo'lingan nol butun to'qqiz o'ndan, taxminan yetti butun yetmish sakkiz yuzdan. Sinus oltmish beshning qiymati darslikning bir yuz ellik uchinchi betidagi jadvaldan olinadi.",
        'Верно. Четырнадцать на ноль целых пять десятых делить на ноль целых девять десятых, примерно семь целых семьдесят восемь сотых. Значение синуса шестидесяти пяти берут из таблицы на сто пятьдесят третьей странице учебника.',
        'Correct. Fourteen times zero point five over zero point nine, about seven point seven eight. The sine of sixty five comes from the table on page one hundred fifty three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — radiusni topish.
// ============================================================
const S7 = {
  eyebrow: L('RADIUS', 'РАДИУС', 'THE RADIUS'),
  title: L(
    "Bitta tomon va bitta burchak yetadi",
    'Хватает одной стороны и одного угла',
    'One side and one angle suffice',
  ),
  audio: [
    A('mount',
      "Teorema ikki R ni ham beradi. Demak tashqi chizilgan aylananing radiusini topish uchun bitta tomon va unga qarshi burchak yetarli.",
      'Теорема даёт и два R. Значит для радиуса описанной окружности хватает одной стороны и противолежащего ей угла.',
      'The theorem also gives two R. So the radius of the circumscribed circle needs just one side and its opposite angle.'),
    A('why',
      "Darslikning yigirma sakkiz nuqta to'rtinchi mashqi: burchak o'ttiz daraja, qarshi tomon to'rt butun sakkiz o'ndan.",
      'Задача двадцать восемь точка четыре учебника: угол тридцать градусов, противолежащая сторона четыре целых восемь десятых.',
      'Exercise twenty eight point four: an angle of thirty degrees with the opposite side four point eight.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('a = 4,8,   ∠A = 30°', 'a = 4,8,   ∠A = 30°', 'a = 4.8,   ∠A = 30°')}
      steps={[
        { id: 'a', head: L('Teorema', 'Теорема', 'The theorem'), lines: ['2R = a : sin A', '2R = 4,8 : 0,5'] },
      ]}
      ask={L(
        "Radius nechaga teng?",
        'Чему равен радиус?',
        'What is the radius?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '4,8' },
        {
          id: 'wrong',
          label: '9,6',
          hint: L(
            "To'qqiz butun olti o'ndan bu DIAMETR, chunki nisbat ikki R ga teng edi. Radius uchun uni yana ikkiga bo'ling.",
            'Девять целых шесть десятых это ДИАМЕТР, ведь отношение равнялось двум R. Для радиуса раздели его на два.',
            'Nine point six is the DIAMETER, since the ratio equalled two R. Halve it for the radius.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qiziq holat: radius qarshi tomonning uzunligiga teng bo'lib chiqdi, chunki sinus o'ttiz aynan bir ikkidanga teng.",
        'Верно. Любопытно: радиус совпал с длиной противолежащей стороны, потому что синус тридцати равен как раз одной второй.',
        'Correct. Curiously the radius came out equal to the opposite side, because the sine of thirty is exactly one half.',
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
    'Geometriya 9, 28-dars (84-85-bet)',
    'Геометрия 9, урок 28 (стр. 84-85)',
    'Geometry 9, lesson 28 (p. 84-85)',
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
          "Isbotda qaysi ikkita fakt ishlatildi?",
          'Какие два факта работали в доказательстве?',
          'Which two facts did the proof use?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Diametrga tiralgan burchak va bitta yoydagi burchaklar",
              'Угол на диаметр и углы на одной дуге',
              'The angle on a diameter and angles on one arc',
            ),
          },
          {
            id: 'wrong',
            label: L(
              "Pifagor teoremasi va o'xshashlik",
              'Теорема Пифагора и подобие',
              'The theorem of Pythagoras and similarity',
            ),
            hint: L(
              "Isbotda uchburchaklar solishtirilmadi va kvadratlar qatnashmadi. U butunlay aylananing ikkita xossasiga tayandi.",
              'В доказательстве не сравнивали треугольники и не было квадратов. Оно целиком опиралось на два свойства окружности.',
              'The proof compared no triangles and used no squares. It rested entirely on two properties of the circle.',
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
    "Tomon va uning qarshisidagi burchak",
    'Сторона и её противолежащий угол',
    'A side and the angle facing it',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz teoremani aylana orqali chiqardingiz va uni ikkita masalada ishlatdingiz.",
      'На семи экранах ты вывел теорему через окружность и применил её в двух задачах.',
      'On seven screens you derived the theorem through the circle and used it in two problems.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — darslikning 3-rasmi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Uchta uchburchak, uchta noma'lum",
    'Три треугольника, три неизвестных',
    'Three triangles, three unknowns',
  ),
  audio: [
    A('mount',
      "Darslikning uchinchi rasmi. Har bir uchburchakda ikkita burchak va bitta tomon berilgan.",
      'Третий рисунок учебника. В каждом треугольнике даны два угла и одна сторона.',
      'The third figure of the textbook. Each triangle gives two angles and one side.'),
    A('why',
      "Har safar tomonni o'ziga qarshi burchak bilan juftlang.",
      'Каждый раз сопоставляй сторону с противолежащим ей углом.',
      'Each time pair a side with the angle opposite it.'),
  ],
  props: {
    stepLabel: L('Chizma', 'Чертёж', 'Drawing'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Uchinchisida uchinchi burchakni oldin hisoblash kerak bo'ldi: bir yuz sakson ayirib o'ttiz ayirib bir yuz besh, ya'ni qirq besh daraja.",
      'Все три найдены. В третьем сначала пришлось посчитать третий угол: сто восемьдесят минус тридцать минус сто пять, то есть сорок пять градусов.',
      'All three are found. The third needed the remaining angle first: one hundred eighty minus thirty minus one hundred five, that is forty five degrees.',
    ),
    tasks: [
      {
        expr: 'c = 6√2,   ∠A = 30°,   ∠C = 45°',
        question: L(
          "BC tomon nechaga teng?",
          'Чему равна сторона BC?',
          'What is the side BC?',
        ),
        ok: L("Ha, olti.", 'Да, шесть.', 'Yes, six.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '12', hint: L("Nisbatni yozing: BC bo'lingan sinus o'ttiz teng olti ildiz ikki bo'lingan sinus qirq besh. Sinus qirq besh ildiz ikki bo'lingan ikkiga teng.", 'Запиши отношение: BC на синус тридцати равно шесть корней из двух на синус сорока пяти. Синус сорока пяти это корень из двух пополам.', 'Write the ratio: BC over sine thirty equals six root two over sine forty five. The sine of forty five is root two over two.') },
        ],
        solution: ['BC = 6√2 · sin 30° : sin 45°', 'BC = 6√2 · 0,5 : (√2/2) = 6'],
      },
      {
        expr: 'a = 8√3,   ∠A = 60°,   ∠C = 45°',
        question: L(
          "AB tomon nechaga teng?",
          'Чему равна сторона AB?',
          'What is the side AB?',
        ),
        ok: L("Ha, sakkiz ildiz ikki, taxminan o'n bir butun uch o'ndan.", 'Да, восемь корней из двух, примерно одиннадцать целых три десятых.', 'Yes, eight root two, about eleven point three.'),
        items: [
          { id: 'a', right: true, label: '8√2' },
          { id: 'b', label: '8√3', hint: L("Sakkiz ildiz uch bu BERILGAN tomon. Uni sinus qirq beshga ko'paytirib, sinus oltmishga bo'lish kerak.", 'Восемь корней из трёх это ДАННАЯ сторона. Её нужно умножить на синус сорока пяти и разделить на синус шестидесяти.', 'Eight root three is the GIVEN side. Multiply it by the sine of forty five and divide by the sine of sixty.') },
        ],
        solution: ['AB = 8√3 · sin 45° : sin 60°', 'AB = 8√2'],
      },
      {
        expr: 'a = 7,   ∠A = 30°,   ∠C = 105°',
        question: L(
          "AC tomon nechaga teng?",
          'Чему равна сторона AC?',
          'What is the side AC?',
        ),
        ok: L("Ha, yetti ildiz ikki, taxminan to'qqiz butun to'qqiz o'ndan.", 'Да, семь корней из двух, примерно девять целых девять десятых.', 'Yes, seven root two, about nine point nine.'),
        items: [
          { id: 'a', right: true, label: '7√2' },
          { id: 'b', label: '14', hint: L("AC tomonga B burchagi qarshi turadi, uni esa oldin topish kerak: bir yuz sakson ayirib o'ttiz ayirib bir yuz besh qirq beshga teng.", 'Против стороны AC лежит угол B, его сначала нужно найти: сто восемьдесят минус тридцать минус сто пять это сорок пять.', 'The angle B faces AC and must be found first: one hundred eighty minus thirty minus one hundred five is forty five.') },
        ],
        solution: ['∠B = 45°', 'AC = 7 · sin 45° : sin 30° = 7√2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — burchakni topish.
// ============================================================
const S10 = {
  eyebrow: L('BURCHAKNI TOPISH', 'ИЩЕМ УГОЛ', 'FINDING AN ANGLE'),
  title: L(
    "Teskari yo'nalish",
    'В обратную сторону',
    'The other direction',
  ),
  audio: [
    A('mount',
      "Endi ikkita tomon va bitta burchakning sinusi berilgan, ikkinchi burchakning sinusini topish kerak.",
      'Теперь даны две стороны и синус одного угла, а найти нужно синус второго.',
      'Now two sides and the sine of one angle are given; find the sine of the other.'),
    A('why',
      "Darslikning yigirma sakkiz nuqta uchinchi mashqi.",
      'Задача двадцать восемь точка три учебника.',
      'Exercise twenty eight point three.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Diqqat: teorema burchakning SINUSINI beradi, burchakning o'zini emas. Bu farq o'n uchinchi ekranda hal qiluvchi bo'lib chiqadi.",
      'Обе найдены. Внимание: теорема даёт СИНУС угла, а не сам угол. Эта разница окажется решающей на тринадцатом экране.',
      'Both are found. Note: the theorem gives the SINE of the angle, not the angle itself. That difference turns decisive on screen thirteen.',
    ),
    tasks: [
      {
        expr: 'sin A = 0,4,   a = 6,   c = 5',
        question: L(
          "sin C nechaga teng?",
          'Чему равен sin C?',
          'What is sin C?',
        ),
        ok: L("Ha, taxminan nol butun o'ttiz uch yuzdan. Besh karra nol butun to'rt o'ndan bo'lingan olti.", 'Да, примерно ноль целых тридцать три сотых. Пять на ноль целых четыре десятых делить на шесть.', 'Yes, about zero point three three. Five times zero point four over six.'),
        items: [
          { id: 'a', right: true, label: '≈ 0,33' },
          { id: 'b', label: '≈ 0,48', hint: L("Nisbatni to'g'ri yozing: a bo'lingan sinus A teng c bo'lingan sinus C. Bundan sinus C teng c karra sinus A bo'lingan a.", 'Запиши отношение верно: a на синус A равно c на синус C. Отсюда синус C равен c на синус A делить на a.', 'Write the ratio correctly: a over sine A equals c over sine C. Hence sine C is c times sine A over a.') },
        ],
        solution: ['sin C = c · sin A : a', 'sin C = 5 · 0,4 : 6 ≈ 0,33'],
      },
      {
        expr: 'sin B = 0,5,   b = 8,   a = 7',
        question: L(
          "sin A nechaga teng?",
          'Чему равен sin A?',
          'What is sin A?',
        ),
        ok: L("Ha, taxminan nol butun qirq to'rt yuzdan. Yetti karra nol butun besh o'ndan bo'lingan sakkiz.", 'Да, примерно ноль целых сорок четыре сотых. Семь на ноль целых пять десятых делить на восемь.', 'Yes, about zero point four four. Seven times zero point five over eight.'),
        items: [
          { id: 'a', right: true, label: '≈ 0,44' },
          { id: 'b', label: '≈ 0,57', hint: L("Kasrni ag'darib yubormang: sinus A teng a karra sinus B bo'lingan b, ya'ni yetti karra nol butun besh o'ndan bo'lingan sakkiz.", 'Не переверни дробь: синус A равен a на синус B делить на b, то есть семь на ноль целых пять десятых делить на восемь.', 'Do not flip the fraction: sine A is a times sine B over b, that is seven times zero point five over eight.') },
        ],
        solution: ['sin A = a · sin B : b', 'sin A = 7 · 0,5 : 8 ≈ 0,44'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — radius.
// ============================================================
const S11 = {
  eyebrow: L('TASHQI AYLANA', 'ОПИСАННАЯ ОКРУЖНОСТЬ', 'THE CIRCUMSCRIBED CIRCLE'),
  title: L(
    "Radius bitta juftlikdan chiqadi",
    'Радиус выходит из одной пары',
    'The radius comes from one pair',
  ),
  audio: [
    A('mount',
      "Ikkita masala. Ularda tashqi chizilgan aylananing radiusini topish kerak.",
      'Две задачи. В них нужно найти радиус описанной окружности.',
      'Two problems. Both ask for the radius of the circumscribed circle.'),
    A('why',
      "Buning uchun bitta tomon va unga qarshi burchak yetadi.",
      'Для этого хватает одной стороны и противолежащего угла.',
      'One side with its opposite angle is enough.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. To'g'ri burchakli uchburchakda javob mashhur natijaga aylandi: gipotenuza tashqi aylananing diametri, chunki sinus to'qson birga teng.",
      'Обе найдены. В прямоугольном треугольнике ответ превратился в известный результат: гипотенуза это диаметр описанной окружности, ведь синус девяноста равен единице.',
      'Both are found. In a right triangle the answer became a familiar result: the hypotenuse is the diameter of the circumscribed circle, since the sine of ninety is one.',
    ),
    tasks: [
      {
        expr: 'a = 10,   ∠A = 30°',
        question: L('Radius nechaga teng?', 'Чему равен радиус?', 'What is the radius?'),
        ok: L("Ha, o'n. O'n bo'lingan nol butun besh o'ndan yigirma, uning yarmi o'n.", 'Да, десять. Десять на ноль целых пять десятых двадцать, половина двадцати десять.', 'Yes, ten. Ten over zero point five is twenty, and half of twenty is ten.'),
        items: [
          { id: 'a', right: true, label: '10' },
          { id: 'b', label: '20', hint: L("Yigirma bu diametr. Nisbat ikki R ga teng edi, demak javobni yana ikkiga bo'ling.", 'Двадцать это диаметр. Отношение равнялось двум R, значит ответ надо ещё разделить на два.', 'Twenty is the diameter. The ratio equalled two R, so halve the answer.') },
        ],
        solution: ['2R = 10 : 0,5 = 20', 'R = 10'],
      },
      {
        expr: 'c = 26,   ∠C = 90°',
        question: L('Radius nechaga teng?', 'Чему равен радиус?', 'What is the radius?'),
        ok: L("Ha, o'n uch. Sinus to'qson birga teng, demak gipotenuzaning o'zi diametr bo'lib chiqadi.", 'Да, тринадцать. Синус девяноста равен единице, значит сама гипотенуза и есть диаметр.', 'Yes, thirteen. The sine of ninety is one, so the hypotenuse itself is the diameter.'),
        items: [
          { id: 'a', right: true, label: '13' },
          { id: 'b', label: '26', hint: L("Yigirma olti bu diametr, chunki sinus to'qson birga teng. Radius uchun uni ikkiga bo'ling.", 'Двадцать шесть это диаметр, ведь синус девяноста равен единице. Для радиуса раздели на два.', 'Twenty six is the diameter, since the sine of ninety is one. Halve it for the radius.') },
        ],
        solution: ['2R = 26 : 1 = 26', 'R = 13'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — yondosh burchak bilan juftlash.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tomon o'z burchagini tanlaydi",
    'Сторона выбирает свой угол',
    'A side chooses its own angle',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. AB o'n to'rt, A burchagi o'ttiz, C burchagi oltmish besh. U AB ni sinus A ga bo'lgan va javobni yigirma besh butun to'rt o'ndan deb topgan.",
      'Решение Камрона. AB четырнадцать, угол A тридцать, угол C шестьдесят пять. Он поделил AB на синус A и получил двадцать пять целых четыре десятых.',
      "Kamron's solution. AB is fourteen, the angle A thirty, the angle C sixty five. He divided AB by the sine of A and got twenty five point four."),
    A('why',
      "Javobni hisoblamasdan ham tekshirish mumkin.",
      'Этот ответ можно проверить, не считая.',
      'That answer can be checked without any computing.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "AB tomoniga C burchagi qarshi turadi, A burchagi esa unga YONDOSH. Kamron juftlikni buzgan va shuning uchun javobi kattaroq chiqqan. Bunday xatoni doim bir xil tekshiruv tutadi: katta burchakka qarshi katta tomon yotishi kerak.",
      'Против стороны AB лежит угол C, а угол A ей ПРИЛЕЖИТ. Камрон нарушил пару, поэтому ответ вышел больше. Такую ошибку всегда ловит одна проверка: против большего угла должна лежать большая сторона.',
      'The angle C faces AB while the angle A is ADJACENT to it. Kamron broke the pairing, so his answer came out too large. One check always catches this: the larger angle must face the larger side.',
    ),
    tasks: [
      {
        expr: 'AB = 14,   ∠A = 30°,   ∠C = 65°',
        question: L(
          "Qaysi tomon uzunroq: BC yoki AB?",
          'Какая сторона длиннее: BC или AB?',
          'Which side is longer: BC or AB?',
        ),
        ok: L(
          "To'g'ri, AB uzunroq. U kattaroq burchakka qarshi turibdi, demak BC o'n to'rtdan kichik bo'lishi shart.",
          'Верно, AB длиннее. Она лежит против большего угла, значит BC обязана быть меньше четырнадцати.',
          'Correct, AB is longer. It faces the larger angle, so BC must be under fourteen.',
        ),
        items: [
          { id: 'a', right: true, label: 'AB' },
          {
            id: 'b',
            label: 'BC',
            hint: L(
              "BC ga o'ttiz daraja, AB ga esa oltmish besh daraja qarshi turibdi. Katta burchakka qarshi katta tomon yotadi.",
              'Против BC лежит тридцать градусов, а против AB шестьдесят пять. Против большего угла лежит большая сторона.',
              'BC faces thirty degrees and AB faces sixty five. The larger angle faces the larger side.',
            ),
          },
        ],
        solution: [
          'BC : sin A = AB : sin C',
          'BC = 14 · 0,5 : 0,9 ≈ 7,78',
          L('Kamron: 14 · 0,9 : 0,5 = 25,4', 'Камрон: 14 · 0,9 : 0,5 = 25,4', 'Kamron: 14 · 0.9 : 0.5 = 25.4'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — ikkita hol.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Bitta sinus, ikkita burchak",
    'Один синус, два угла',
    'One sine, two angles',
  ),
  audio: [
    A('mount',
      "Uchburchakning bir tomoni tashqi chizilgan aylananing radiusiga teng. Shu tomon qarshisidagi burchakni topish kerak.",
      'Одна сторона треугольника равна радиусу описанной окружности. Нужно найти противолежащий ей угол.',
      'One side of a triangle equals the radius of its circumscribed circle. Find the angle opposite it.'),
    A('why',
      "Darslik bu yerda ikkita holni ko'rishni alohida so'raydi.",
      'Учебник здесь особо просит рассмотреть два случая.',
      'The textbook here asks specially for both cases.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Sinuslar teoremasi burchakning sinusini beradi, sinus esa ikkita burchakni ajratmaydi: 46-darsda sin(180° − α) = sin α edi. Shuning uchun burchak qidirilganda javob ikkita bo'lishi mumkin va ikkalasi ham haqiqiy uchburchak beradi. 48-darsda kosinuslar teoremasi shu kamchilikni yopadi: kosinus o'tkir va o'tmas burchakni ISHORASI bilan ajratadi.",
      'Теорема синусов даёт синус угла, а синус двух углов не различает: на 46 уроке было sin(180° − α) = sin α. Поэтому при поиске угла ответов может быть два, и оба дают настоящий треугольник. На 48 уроке теорема косинусов закроет этот пробел: косинус различает острый и тупой угол ЗНАКОМ.',
      'The law of sines gives the sine of an angle, and a sine cannot tell two angles apart: lesson 46 had sin(180° − α) = sin α. So a search for an angle may end with two answers, both giving a genuine triangle. Lesson 48 closes the gap: the cosine tells acute from obtuse by its SIGN.',
    ),
    tasks: [
      {
        expr: 'a = R',
        question: L(
          "Bu tomon qarshisidagi burchakning sinusi nechaga teng?",
          'Чему равен синус угла, противолежащего этой стороне?',
          'What is the sine of the angle opposite that side?',
        ),
        ok: L(
          "Ha, bir ikkidan. R bo'lingan ikki R bir ikkidanga teng.",
          'Да, одной второй. R делить на два R это одна вторая.',
          'Yes, one half. R over two R is one half.',
        ),
        items: [
          { id: 'a', right: true, label: '0,5' },
          {
            id: 'b',
            label: '1',
            hint: L(
              "Teoremaga qo'ying: sinus A teng a bo'lingan ikki R. Bu yerda a ning o'rniga R turibdi, ikki R esa maxrajda.",
              'Подставь в теорему: синус A равен a на два R. Здесь вместо a стоит R, а два R в знаменателе.',
              'Substitute into the theorem: sine A equals a over two R. Here a is R while two R sits below.',
            ),
          },
        ],
        solution: ['sin A = a : 2R', 'sin A = R : 2R = 0,5'],
      },
      {
        expr: 'sin A = 0,5',
        question: L(
          "Burchakning o'zi nechaga teng?",
          'Чему равен сам угол?',
          'What is the angle itself?',
        ),
        ok: L(
          "Ha, ikkita javob bor: o'ttiz daraja va bir yuz ellik daraja. Ikkalasi ham uchburchakda bo'lishi mumkin.",
          'Да, ответов два: тридцать градусов и сто пятьдесят. Оба возможны в треугольнике.',
          'Yes, there are two answers: thirty degrees and one hundred fifty. Both can occur in a triangle.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('30° yoki 150°', '30° или 150°', '30° or 150°'),
          },
          {
            id: 'b',
            label: L('Faqat 30°', 'Только 30°', 'Only 30°'),
            hint: L(
              "46-darsni eslang: sin(180° − α) sin α ga teng edi. Demak bir yuz ellik darajaning sinusi ham nol butun besh o'ndan.",
              'Вспомни 46 урок: sin(180° − α) равнялся sin α. Значит синус ста пятидесяти тоже ноль целых пять десятых.',
              'Recall lesson 46: sin(180° − α) equalled sin α. So the sine of one hundred fifty is zero point five too.',
            ),
          },
        ],
        solution: ['sin 30° = 0,5', 'sin 150° = 0,5'],
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
    "Blits: juftlik, diametr, ikkita hol",
    'Блиц: пара, диаметр, два случая',
    'Blitz: the pair, the diameter, two cases',
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
        tag: 'yondosh-burchak-bilan-juftlash',
        ask: L(
          "Nisbatda tomon qaysi burchak bilan juftlanadi?",
          'С каким углом сторона идёт в паре?',
          'Which angle does a side pair with?',
        ),
        options: [
          { id: 'r', right: true, label: L("Qarshisidagi burchak bilan", 'С противолежащим', 'With the opposite one') },
          { id: 'w', label: L('Yondosh burchak bilan', 'С прилежащим', 'With an adjacent one') },
        ],
        ok: L(
          "To'g'ri. Juftlik buzilsa, javob boshqa chiqadi.",
          'Верно. Стоит нарушить пару, и ответ будет другим.',
          'Correct. Break the pairing and the answer changes.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron aynan shu joyda adashib, yetti butun sakson o'rniga yigirma besh olgandi.",
          'Вспомни 12 экран: Камрон ошибся именно здесь и получил двадцать пять вместо семи целых восьми.',
          'Recall screen 12: Kamron slipped exactly there and got twenty five instead of seven point eight.',
        ),
      },
      {
        id: 'q2',
        tag: 'tomon-burchakka-proporsional',
        ask: L(
          "Tomonlar nimaga proporsional?",
          'Чему пропорциональны стороны?',
          'What are the sides proportional to?',
        ),
        options: [
          { id: 'r', right: true, label: L('Burchaklarning sinuslariga', 'Синусам углов', 'To the sines of the angles') },
          { id: 'w', label: L('Burchaklarning o\'ziga', 'Самим углам', 'To the angles themselves') },
        ],
        ok: L(
          "To'g'ri. Burchak ikki barobar ortsa, tomon ikki barobar ortmaydi.",
          'Верно. Если угол вырос вдвое, сторона вдвое не растёт.',
          'Correct. Doubling an angle does not double the side.',
        ),
        hint: L(
          "46-darsning tuzog'ini eslang: sinus burchakka proporsional emas edi.",
          'Вспомни ловушку 46 урока: синус не был пропорционален углу.',
          'Recall the trap of lesson 46: the sine was not proportional to the angle.',
        ),
      },
      {
        id: 'q3',
        tag: 'ikkinchi-holni-unutish',
        ask: L(
          "sin A = 0,5 dan burchak yagona topiladimi?",
          'Однозначно ли находится угол из sin A = 0,5?',
          'Does sin A = 0.5 pin the angle down?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q, ikkita javob bor", 'Нет, ответа два', 'No, there are two answers') },
          { id: 'w', label: L('Ha, faqat 30°', 'Да, только 30°', 'Yes, only 30°') },
        ],
        ok: L(
          "To'g'ri. O'ttiz ham, bir yuz ellik ham mos keladi.",
          'Верно. Подходят и тридцать, и сто пятьдесят.',
          'Correct. Both thirty and one hundred fifty fit.',
        ),
        hint: L(
          "13-ekranni eslang: sinus o'tkir va o'tmas burchakni ajratmaydi.",
          'Вспомни 13 экран: синус не различает острый и тупой угол.',
          'Recall screen 13: the sine cannot tell acute from obtuse.',
        ),
      },
      {
        id: 'q4',
        tag: 'uchinchi-burchakni-hisoblamaslik',
        ask: L(
          "Nisbatning umumiy qiymati nimaga teng?",
          'Чему равно общее значение отношения?',
          'What does the common value of the ratio equal?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("Tashqi aylananing diametriga", 'Диаметру описанной окружности', 'The diameter of the circumscribed circle'),
          },
          {
            id: 'w',
            label: L("Uchburchakning perimetriga", 'Периметру треугольника', 'The perimeter of the triangle'),
          },
        ],
        ok: L(
          "To'g'ri, ikki R ga. Shuning uchun bitta tomon va bitta burchak radiusni beradi.",
          'Верно, двум R. Поэтому одна сторона и один угол дают радиус.',
          'Correct, two R. That is why one side and one angle give the radius.',
        ),
        hint: L(
          "4-ekranni eslang: isbotda gipotenuza aynan diametr edi.",
          'Вспомни 4 экран: в доказательстве гипотенузой был именно диаметр.',
          'Recall screen 4: in the proof the hypotenuse was the diameter itself.',
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
    "Aylana uchburchakni yechdi",
    'Окружность решила треугольник',
    'The circle solved the triangle',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda to'g'ri burchak yo'q edi va 46-darsning quroli ishlamasdi.",
      'На первом экране не было прямого угла, и инструмент 46 урока не работал.',
      'On the first screen there was no right angle and the tool of lesson 46 failed.'),
    A('s1',
      "Siz tashqi aylanani chizib, diametr o'tkazdingiz va shu bilan istalgan uchburchakni to'g'ri burchakli holga keltirdingiz.",
      'Ты описал окружность, провёл диаметр и тем свёл любой треугольник к прямоугольному.',
      'You circumscribed a circle, drew a diameter, and thus reduced any triangle to a right one.'),
    A('s2',
      "Keyingi darsda kosinuslar teoremasi.",
      'В следующем уроке теорема косинусов.',
      'The next lesson covers the law of cosines.'),
  ],
  props: {
    mark: 'a : sin A = b : sin B = c : sin C = 2R',
    markNote: L(
      "har bir tomon o'z qarshi burchagi bilan",
      'каждая сторона со своим противолежащим углом',
      'each side with the angle facing it',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: kosinuslar teoremasi',
      'Следующий урок: теорема косинусов',
      'Next lesson: the law of cosines',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'yondosh-burchak-bilan-juftlash', ...S2 },
  { role: 'explain',  tag: 'yondosh-burchak-bilan-juftlash', ...S3 },
  { role: 'explain',  tag: 'yondosh-burchak-bilan-juftlash', ...S4 },
  { role: 'explain',  tag: 'tomon-burchakka-proporsional', ...S5 },
  { role: 'explain',  tag: 'yondosh-burchak-bilan-juftlash', ...S6 },
  { role: 'explain',  tag: 'uchinchi-burchakni-hisoblamaslik', ...S7 },
  { role: 'rule',     tag: 'tomon-burchakka-proporsional', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'uchinchi-burchakni-hisoblamaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'yondosh-burchak-bilan-juftlash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'uchinchi-burchakni-hisoblamaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yondosh-burchak-bilan-juftlash', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ikkinchi-holni-unutish', ...S13 },
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
