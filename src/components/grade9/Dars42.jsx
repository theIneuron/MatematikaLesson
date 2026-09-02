// ============================================================================
// 9-sinf, Dars 42. AYLANADAGI PROPORSIONAL KESMALAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 52-dars (138-139-bet).
//   1-teorema (138-bet): AB va CD vatarlar K nuqtada kesishsa,
//       AK · KB = CK · KD. Isbot: ∠BAD = ∠BCD (bitta BD yoyiga
//       tiraladi), ∠AKD = ∠BKC (vertikal) → AKD va CKB uchburchaklar
//       BB alomati bo'yicha o'xshash → KD/KB = AK/CK.
//   2-teorema (138-bet): tashqi P nuqtadan urinma PA va kesuvchi PBC
//       o'tkazilsa, PA² = PB · PC. Isbot: ∠C = ∠BAP (ikkalasi ham
//       ADB yoyining yarmi), ∠P umumiy → ABP va CPA o'xshash.
//   52.1 (4-rasm): a) 5 · 2,5 = 2 · x → x = 6,25;  b) 9 · 16 = x² →
//       x = 12;  c) 0,5 · 0,2 = 0,4 · x → x = 0,25.
//   52.2: a) urinma 4, AC = 2 → AD = 8;  b) urinma 5, AD = 10 → AC = 2,5.
//   52.3a: AO = 10, BO = 6, DO = 15 → OC = 4.
//   52.4: AB diametr, CD ⊥ AB, AE = 2, EB = 8 → CE = 4, CD = 8.
//   52.6: R = 13, markazdan P gacha 5, vatar 25 → bo'laklar 16 va 9.
//
// BUTUN DARS BITTA G'OYAGA QURILGAN: nuqtadan chiqqan ikki chiziqning
// kesmalari KO'PAYTMASI o'zgarmaydi. Vatarlar uchun bu AK · KB, urinma
// uchun PA², kesuvchi uchun PB · PC — uchalasi bir xil sonni beradi.
// Shuning uchun ekran 5 va 7 bitta jumla bilan bog'lanadi.
//
// TAYANCH IKKITA VA IKKALASI HAM SHU HAFTADAN: 37-darsdan bitta yoyga
// tiralgan burchaklarning tengligi, 40-darsdan esa alomatlar. Isbot
// aynan shu ikkitasidan yig'iladi va boshqa hech narsa talab qilmaydi.
//
// TUZOQ (12-ekran): kesmalarni KO'PAYTIRISH o'rniga QO'SHISH yoki
// noto'g'ri juftlash (AK · KD). Ekran uni sonlar bilan yiqitadi:
// 5 + 2,5 = 7,5 va 2 + 6,25 = 8,25 — teng emas, ko'paytmalar esa teng.
//
// TRANSFER (13-ekran) — 52.6: radiusi 13 bo'lgan aylana, markazdan
// besh birlik uzoqlikdagi P nuqta, uzunligi 25 bo'lgan vatar. P orqali
// DIAMETR o'tkaziladi, uning bo'laklari 18 va 8, ko'paytmasi 144.
// Demak vatarning bo'laklari ko'paytmasi ham 144, yig'indisi 25, ya'ni
// 16 va 9. Bu «nuqtaning darajasi» tushunchasining birinchi ko'rinishi.
//
// CHIZMA: yangi `PowerFig` (7I) — asbob emas, chizma; ikkita rejimi bor.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, PowerFig, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-42',
  n: 42,
  row: 42,
  block: 'Б7',
  topic: L(
    'Aylanadagi proporsional kesmalar',
    'Пропорциональные отрезки в окружности',
    'Proportional segments in a circle',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Kesishgan vatarlarda AK · KB = CK · KD",
    'У пересекающихся хорд AK · KB = CK · KD',
    'For intersecting chords AK · KB = CK · KD',
  ),
  L(
    "Tashqi nuqtadan o'tkazilgan urinma va kesuvchi uchun PA² = PB · PC",
    'Для касательной и секущей из внешней точки PA² = PB · PC',
    'For a tangent and a secant from an outside point PA² = PB · PC',
  ),
  L(
    "Ikkala tenglik ham o'xshash uchburchaklardan kelib chiqadi",
    'Оба равенства следуют из подобия треугольников',
    'Both equalities follow from similar triangles',
  ),
]

export const MISS = {
  'qoshish-kopaytirish-orniga': {
    what: L(
      "kesmalar ko'paytirilmasdan qo'shildi",
      'отрезки сложены вместо умножения',
      'the segments were added instead of multiplied',
    ),
    wrong: null,
    at: 0,
  },
  'notogri-juftlash': {
    what: L(
      "bir vatarning ikkala bo'lagi o'rniga har xil vatarlarning bo'laklari juftlandi",
      'вместо двух частей одной хорды перемножены части разных хорд',
      'parts of different chords were paired instead of the two parts of one chord',
    ),
    wrong: null,
    at: 0,
  },
  'urinma-kvadratsiz': {
    what: L(
      "urinma kvadratga ko'tarilmadi",
      'касательная не возведена в квадрат',
      'the tangent was not squared',
    ),
    wrong: null,
    at: 0,
  },
  'kesuvchining-uzoq-nuqtasi': {
    what: L(
      "kesuvchida uzoq nuqtagacha bo'lgan masofa o'rniga ichki bo'lak olindi",
      'на секущей взят внутренний кусок вместо расстояния до дальней точки',
      'the inner piece was taken instead of the distance to the far point',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — to'rtta kesma, bittasi noma'lum.
// ============================================================
const S1 = {
  eyebrow: L('TO\'RTTA KESMA', 'ЧЕТЫРЕ ОТРЕЗКА', 'FOUR SEGMENTS'),
  title: L(
    "Uchtasi ma'lum, to'rtinchisi qidiriladi",
    'Три известны, четвёртый ищут',
    'Three are known, the fourth is wanted',
  ),
  audio: [
    A('mount',
      "Aylanada ikkita vatar K nuqtada kesishgan. Birinchisining bo'laklari besh va ikki butun besh o'ndan, ikkinchisiniki ikki va noma'lum x.",
      'В окружности две хорды пересеклись в точке K. Куски первой пять и две целых пять десятых, второй два и неизвестное x.',
      'Two chords meet at K. The first splits into five and two point five, the second into two and an unknown x.'),
    A('why',
      "Aylananing radiusi ham, vatarlarning burchagi ham berilmagan. Shunga qaramay x topiladi.",
      'Ни радиус окружности, ни угол между хордами не даны. И всё же x находится.',
      'Neither the radius nor the angle between the chords is given. Yet x can be found.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PowerFig mode="chords" degs={[271, 150, 193.5, 47]} labels={['5', '2,5', '2', 'x']} />}
      steps={[]}
      ask={L(
        "x ni topish uchun yetarli ma'lumot bormi?",
        'Хватает ли данных, чтобы найти x?',
        'Is there enough data to find x?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Ha: bo'laklar bir biri bilan bog'langan",
            'Да: куски связаны между собой',
            'Yes: the pieces are linked to one another',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Yo'q: radius ham kerak",
            'Нет: нужен ещё радиус',
            'No: the radius is needed too',
          ),
          hint: L(
            "Vatarlar aylanada yotgani K nuqtada burchaklarni tenglashtiradi. Tenglashgan burchaklar esa o'xshashlik beradi.",
            'То, что хорды лежат в окружности, уравнивает углы при точке K. А равные углы дают подобие.',
            'The chords lying in a circle equalise the angles at K. Equal angles then give similarity.',
          ),
        },
      ]}
      after={L(
        "Ha. Bugun shu bog'liqlikni chiqaramiz va x aynan olti butun yigirma besh yuzdanga teng bo'lib chiqadi.",
        'Да. Сегодня выведем эту связь, и x окажется равным шести целым двадцати пяти сотым.',
        'Yes. Today we derive that link, and x turns out to be six point two five.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — bitta yoyga tiralgan burchaklar.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Bitta yoyga tiralgan burchaklar",
    'Углы, опирающиеся на одну дугу',
    'Angles on the same arc',
  ),
  audio: [
    A('mount',
      "37-darsning natijasini eslaymiz. Bitta yoyga tiralgan ichki chizilgan burchaklar o'zaro teng edi.",
      'Вспомним результат 37 урока. Вписанные углы, опирающиеся на одну дугу, были равны между собой.',
      'Recall the result of lesson 37. Inscribed angles on the same arc were equal to one another.'),
    A('why',
      "Ularning uchi aylananing turli joyida turishi mumkin, tenglik esa saqlanadi.",
      'Их вершины могут стоять в разных местах окружности, а равенство сохраняется.',
      'Their vertices may sit anywhere on the circle and the equality still holds.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "∠BAD va ∠BCD burchaklar BD yoyiga tiralgan",
        'Углы ∠BAD и ∠BCD опираются на дугу BD',
        'The angles ∠BAD and ∠BCD rest on the arc BD',
      )}
      steps={[]}
      ask={L(
        "Bu burchaklar haqida nima deyish mumkin?",
        'Что можно сказать об этих углах?',
        'What can be said about these angles?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Teng', 'Равны', 'Equal') },
        {
          id: 'wrong',
          label: L("Yig'indisi 180°", 'В сумме 180°', 'They sum to 180°'),
          hint: L(
            "Yig'indisi bir yuz sakson bo'ladigan burchaklar QARAMA-QARSHI yoylarga tiralgan bo'lardi. Bu yerda esa yoy bitta.",
            'Сумму сто восемьдесят дают углы, опирающиеся на ПРОТИВОПОЛОЖНЫЕ дуги. А здесь дуга одна.',
            'A sum of one hundred eighty comes from angles on OPPOSITE arcs. Here the arc is one and the same.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu tenglik bugungi isbotning birinchi g'ishti bo'ladi.",
        'Верно. Это равенство станет первым кирпичом сегодняшнего доказательства.',
        'Correct. That equality will be the first brick of today proof.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ikkita uchburchak.
// ============================================================
const S3 = {
  eyebrow: L('IKKITA UCHBURCHAK', 'ДВА ТРЕУГОЛЬНИКА', 'TWO TRIANGLES'),
  title: L(
    "Kesishgan joyda uchburchaklar paydo bo'ladi",
    'В месте пересечения появляются треугольники',
    'Triangles appear at the crossing',
  ),
  audio: [
    A('mount',
      "Vatarlarning uchlarini juft juft qilib tutashtiramiz: A bilan D, hamda C bilan B.",
      'Соединим концы хорд попарно: A с D и C с B.',
      'Join the ends of the chords in pairs: A with D and C with B.'),
    A('why',
      "Ikkita uchburchak hosil bo'ldi va ular K nuqtada uchi bilan tegib turibdi.",
      'Получились два треугольника, и они касаются вершинами в точке K.',
      'Two triangles appear, meeting at their vertices in K.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PowerFig mode="chords" degs={[271, 150, 193.5, 47]} labels={[]} />}
      steps={[]}
      ask={L(
        "AKD va CKB uchburchaklarda K dagi burchaklar qanday?",
        'Каковы углы при K в треугольниках AKD и CKB?',
        'What about the angles at K in the triangles AKD and CKB?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Vertikal, demak teng', 'Вертикальные, значит равны', 'Vertical, hence equal') },
        {
          id: 'wrong',
          label: L("Qo'shni, yig'indisi 180°", 'Смежные, в сумме 180°', 'Adjacent, summing to 180°'),
          hint: L(
            "Qo'shni burchaklar bitta tomonni baham ko'radi. Bu yerda esa uchburchaklar K ning qarama-qarshi tomonlarida yotibdi.",
            'Смежные углы делят общую сторону. А здесь треугольники лежат по разные стороны от K.',
            'Adjacent angles share a side. Here the triangles lie on opposite sides of K.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi bizda ikkita teng burchak bor: biri yoy orqali, ikkinchisi vertikallik orqali.",
        'Верно. Теперь у нас два равных угла: один через дугу, другой через вертикальность.',
        'Correct. Now we have two equal angles: one from the arc, the other from being vertical.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — o'xshashlikdan tenglikka.
// ============================================================
const S4 = {
  eyebrow: L('PROPORSIYADAN TENGLIKKA', 'ОТ ПРОПОРЦИИ К РАВЕНСТВУ', 'FROM RATIO TO EQUALITY'),
  title: L(
    "O'xshashlik proporsiyani beradi",
    'Подобие даёт пропорцию',
    'Similarity yields a proportion',
  ),
  audio: [
    A('mount',
      "Ikkita burchagi teng, demak AKD va CKB uchburchaklar birinchi alomat bo'yicha o'xshash.",
      'Два угла равны, значит треугольники AKD и CKB подобны по первому признаку.',
      'Two angles agree, so the triangles AKD and CKB are similar by the first criterion.'),
    A('why',
      "O'xshash uchburchaklarning mos tomonlari proporsional edi. Proporsiyani yozamiz.",
      'У подобных треугольников соответственные стороны пропорциональны. Запишем пропорцию.',
      'In similar triangles corresponding sides are proportional. Let us write the proportion.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('KD : KB = AK : CK', 'KD : KB = AK : CK', 'KD : KB = AK : CK')}
      steps={[
        { id: 'a', head: L('Kesishma qoidasi', 'Правило креста', 'Cross multiplication'), lines: ['a : b = c : d   →   a · d = b · c'] },
      ]}
      ask={L(
        "Bu proporsiyadan qanday tenglik chiqadi?",
        'Какое равенство следует из этой пропорции?',
        'What equality follows from this proportion?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: 'AK · KB = CK · KD' },
        {
          id: 'wrong',
          label: 'AK · KD = CK · KB',
          hint: L(
            "Kesishma qoidasi chetki hadlarni chetkilarga, o'rtadagilarni o'rtadagilarga ko'paytiradi. KD va CK chetki, KB va AK esa o'rtada turibdi.",
            'Правило креста умножает крайние на крайние, а средние на средние. KD и CK крайние, KB и AK стоят в середине.',
            'Cross multiplication pairs the outer terms and the inner ones. KD and CK are outer, KB and AK are inner.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning birinchi teoremasi: kesishgan vatarlarda bo'laklarning ko'paytmalari teng.",
        'Верно. Это первая теорема учебника: у пересекающихся хорд произведения кусков равны.',
        'Correct. This is the first theorem of the textbook: for intersecting chords the products of the pieces agree.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — xukka qaytish.
// ============================================================
const S5 = {
  eyebrow: L('XUKKA QAYTAMIZ', 'ВОЗВРАЩАЕМСЯ К НАЧАЛУ', 'BACK TO THE START'),
  title: L(
    "Endi x hisoblanadi",
    'Теперь x вычисляется',
    'Now x can be computed',
  ),
  audio: [
    A('mount',
      "Birinchi ekranning chizmasiga qaytamiz. Bo'laklar besh va ikki butun besh o'ndan, hamda ikki va x.",
      'Вернёмся к чертежу первого экрана. Куски пять и две целых пять десятых, а также два и x.',
      'Back to the drawing of the first screen. The pieces are five and two point five, and two and x.'),
    A('why',
      "Teoremani qo'llaymiz: birinchi vatarning ko'paytmasi ikkinchisiniki bilan teng.",
      'Применим теорему: произведение по первой хорде равно произведению по второй.',
      'Apply the theorem: the product along the first chord equals that along the second.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PowerFig mode="chords" degs={[271, 150, 193.5, 47]} labels={['5', '2,5', '2', 'x']} />}
      steps={[
        { id: 'a', head: L('Tenglama', 'Уравнение', 'The equation'), lines: ['5 · 2,5 = 2 · x', '12,5 = 2x'] },
      ]}
      ask={L(
        "x nechaga teng?",
        'Чему равно x?',
        'What does x equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '6,25' },
        {
          id: 'wrong',
          label: '5,5',
          hint: L(
            "Besh butun besh o'ndan besh va ikki butun besh o'ndanni QO'SHGANDA chiqadi. Teoremada esa ko'paytma turibdi.",
            'Пять с половиной выходит при СЛОЖЕНИИ пяти и двух с половиной. А в теореме стоит произведение.',
            'Five and a half comes from ADDING five and two and a half. The theorem has a product.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning ellik ikki nuqta birinchi mashqi, birinchi chizma.",
        'Верно. Это задача пятьдесят два точка один учебника, первый чертёж.',
        'Correct. This is exercise fifty two point one, the first drawing.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — diametr va perpendikulyar vatar.
// ============================================================
const S6 = {
  eyebrow: L('XUSUSIY HOL', 'ЧАСТНЫЙ СЛУЧАЙ', 'A SPECIAL CASE'),
  title: L(
    "Diametrga perpendikulyar vatar",
    'Хорда, перпендикулярная диаметру',
    'A chord perpendicular to a diameter',
  ),
  audio: [
    A('mount',
      "Endi bitta vatar diametr bo'lsin, ikkinchisi esa unga perpendikulyar. Diametrning bo'laklari ikki va sakkiz.",
      'Пусть теперь одна хорда это диаметр, а вторая ему перпендикулярна. Куски диаметра два и восемь.',
      'Let one chord now be a diameter and the other perpendicular to it. The diameter splits into two and eight.'),
    A('why',
      "Perpendikulyarlik ikkinchi vatarni teng ikkiga bo'ladi, ya'ni ikkala bo'lagi bir xil.",
      'Перпендикулярность делит вторую хорду пополам, то есть оба куска одинаковы.',
      'The perpendicularity halves the second chord, so both its pieces are the same.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PowerFig mode="chords" degs={[180, 0, 126.87, 233.13]} labels={['2', '8', 'h', 'h']} />}
      steps={[
        { id: 'a', head: L('Tenglama', 'Уравнение', 'The equation'), lines: ['2 · 8 = h · h', 'h² = 16'] },
      ]}
      ask={L(
        "Ikkinchi vatarning uzunligi nechaga teng?",
        'Чему равна длина второй хорды?',
        'What is the length of the second chord?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '8' },
        {
          id: 'wrong',
          label: '4',
          hint: L(
            "To'rt bu YARIM vatar, ya'ni bitta bo'lak. Butun vatar ikkita shunday bo'lakdan iborat.",
            'Четыре это ПОЛОВИНА хорды, то есть один кусок. Вся хорда состоит из двух таких кусков.',
            'Four is HALF the chord, that is one piece. The whole chord is made of two such pieces.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, sakkiz. Bu ellik ikki nuqta to'rtinchi mashq. Bunday h ni ikki va sakkizning o'rta geometrigi deyishadi.",
        'Верно, восемь. Это задача пятьдесят два точка четыре. Такое h называют средним геометрическим двух и восьми.',
        'Correct, eight. This is exercise fifty two point four. Such an h is called the geometric mean of two and eight.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — urinma va kesuvchi.
// ============================================================
const S7 = {
  eyebrow: L('TASHQI NUQTA', 'ВНЕШНЯЯ ТОЧКА', 'AN OUTSIDE POINT'),
  title: L(
    "Nuqta aylanadan tashqarida bo'lsa",
    'Если точка вне окружности',
    'When the point lies outside',
  ),
  audio: [
    A('mount',
      "Endi P nuqta aylanadan tashqarida. Undan urinma PA va kesuvchi o'tkazildi, kesuvchi aylanani B va C nuqtalarda kesadi.",
      'Теперь точка P вне окружности. Из неё проведены касательная PA и секущая, пересекающая окружность в B и C.',
      'Now the point P lies outside. From it go a tangent PA and a secant meeting the circle at B and C.'),
    A('why',
      "Bu yerda ham ikkita o'xshash uchburchak bor va ular ham yoy orqali topiladi.",
      'Здесь тоже есть два подобных треугольника, и находят их тоже через дугу.',
      'Here too there are two similar triangles, again found through an arc.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PowerFig mode="tangent" degs={[132]} labels={['PA', 'PB', '']} />}
      steps={[
        { id: 'a', head: L('O\'xshashlik', 'Подобие', 'The similarity'), lines: ['PA : PC = PB : PA'] },
      ]}
      ask={L(
        "Bu proporsiyadan qanday tenglik chiqadi?",
        'Какое равенство следует из этой пропорции?',
        'What equality follows from this proportion?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'PA² = PB · PC' },
        {
          id: 'wrong',
          label: 'PA = PB · PC',
          hint: L(
            "Proporsiyada PA IKKI MARTA qatnashyapti: bir marta chapda, bir marta o'ngda. Ko'paytirganda u kvadratga aylanadi.",
            'В пропорции PA участвует ДВАЖДЫ: раз слева, раз справа. При перемножении оно даёт квадрат.',
            'PA appears TWICE in the proportion: once on the left, once on the right. Multiplying turns it into a square.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu ikkinchi teorema. Diqqat: PC bu P dan UZOQ nuqtagacha bo'lgan masofa, ichki bo'lak emas.",
        'Верно. Это вторая теорема. Внимание: PC это расстояние до ДАЛЬНЕЙ точки, а не внутренний кусок.',
        'Correct. This is the second theorem. Note: PC is the distance to the FAR point, not the inner piece.',
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
    'Geometriya 9, 52-dars (138-139-bet)',
    'Геометрия 9, урок 52 (стр. 138-139)',
    'Geometry 9, lesson 52 (p. 138-139)',
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
          "Ikkala teorema ham nimaga tayanadi?",
          'На что опираются обе теоремы?',
          'What do both theorems rest on?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Uchburchaklarning o'xshashligiga",
              'На подобие треугольников',
              'On the similarity of triangles',
            ),
          },
          {
            id: 'wrong',
            label: L('Aylananing radiusiga', 'На радиус окружности', 'On the radius of the circle'),
            hint: L(
              "Ikkala isbotda ham radius umuman ishtirok etmadi. Yoyga tiralgan burchaklar va o'xshashlik ishlatildi.",
              'В обоих доказательствах радиус вообще не участвовал. Работали углы, опирающиеся на дугу, и подобие.',
              'Neither proof used the radius at all. What worked were angles on an arc and similarity.',
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
    "Ko'paytma o'zgarmaydi",
    'Произведение не меняется',
    'The product does not change',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz ikkita teoremani chiqardingiz va ikkalasi ham bitta g'oyaga tayanadi.",
      'На семи экранах ты вывел две теоремы, и обе держатся на одной идее.',
      'On seven screens you derived two theorems, and both rest on one idea.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — vatarlar.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Darslikning to'rtinchi rasmi",
    'Четвёртый рисунок учебника',
    'The fourth figure of the textbook',
  ),
  audio: [
    A('mount',
      "Uchta chizma, uchtasida ham noma'lum kesma x deb belgilangan.",
      'Три чертежа, на всех трёх неизвестный отрезок обозначен через x.',
      'Three drawings, and in all three the unknown segment is marked x.'),
    A('why',
      "Ikkinchisida x ikki marta qatnashadi.",
      'Во втором x участвует дважды.',
      'In the second one x appears twice.'),
  ],
  props: {
    stepLabel: L('Chizma', 'Чертёж', 'Drawing'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham yechildi. Ikkinchi chizmada bo'laklar teng bo'lgani uchun kvadrat ildiz kerak bo'ldi, qolganlarida oddiy bo'lish yetdi.",
      'Все три решены. Во втором чертеже куски были равны, поэтому понадобился квадратный корень, в остальных хватило деления.',
      'All three are solved. In the second drawing the pieces were equal, so a square root was needed; elsewhere division sufficed.',
    ),
    tasks: [
      {
        expr: '9 · 16 = x · x',
        question: L('x nechaga teng?', 'Чему равно x?', 'What does x equal?'),
        ok: L("Ha, o'n ikki. Bir yuz qirq to'rtning kvadrat ildizi.", 'Да, двенадцать. Квадратный корень из ста сорока четырёх.', 'Yes, twelve. The square root of one hundred forty four.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '72', hint: L("Yetmish ikki bu bir yuz qirq to'rtning YARMI. Bu yerda esa ikkita teng ko'paytuvchi kerak, ya'ni ildiz.", 'Семьдесят два это ПОЛОВИНА ста сорока четырёх. А здесь нужны два равных множителя, то есть корень.', 'Seventy two is HALF of one hundred forty four. Here two equal factors are needed, that is a root.') },
        ],
        solution: ['x² = 144', 'x = 12'],
      },
      {
        expr: '0,5 · 0,2 = 0,4 · x',
        question: L('x nechaga teng?', 'Чему равно x?', 'What does x equal?'),
        ok: L("Ha, nol butun yigirma besh yuzdan. O'n dan bir bo'lingan nol butun to'rt o'ndan.", 'Да, ноль целых двадцать пять сотых. Одна десятая делить на ноль целых четыре десятых.', 'Yes, zero point two five. One tenth divided by zero point four.'),
        items: [
          { id: 'a', right: true, label: '0,25' },
          { id: 'b', label: '0,1', hint: L("Nol butun bir o'ndan bu chap tomondagi KO'PAYTMA. Uni yana nol butun to'rt o'ndanga bo'lish kerak.", 'Ноль целых одна десятая это ПРОИЗВЕДЕНИЕ слева. Его ещё нужно разделить на ноль целых четыре десятых.', 'Zero point one is the PRODUCT on the left. It must still be divided by zero point four.') },
        ],
        solution: ['0,1 = 0,4 · x', 'x = 0,25'],
      },
      {
        expr: 'AK = 10,  KB = 6,  KD = 15',
        question: L('CK nechaga teng?', 'Чему равно CK?', 'What does CK equal?'),
        ok: L("Ha, to'rt. Oltmish bo'lingan o'n besh.", 'Да, четыре. Шестьдесят на пятнадцать.', 'Yes, four. Sixty over fifteen.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '9', hint: L("Ko'paytmani hisoblang: o'n karra olti oltmish. Endi uni o'n beshga bo'ling.", 'Посчитай произведение: десять на шесть шестьдесят. Теперь раздели его на пятнадцать.', 'Compute the product: ten times six is sixty. Now divide it by fifteen.') },
        ],
        solution: ['10 · 6 = CK · 15', 'CK = 60 : 15 = 4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — urinma va kesuvchi.
// ============================================================
const S10 = {
  eyebrow: L('URINMA', 'КАСАТЕЛЬНАЯ', 'THE TANGENT'),
  title: L(
    "Kvadratni unutmang",
    'Не забывай про квадрат',
    'Do not forget the square',
  ),
  audio: [
    A('mount',
      "Ikkita masala, ikkalasida ham urinma va kesuvchi bor. Darslikning ellik ikki nuqta ikkinchi mashqi.",
      'Две задачи, в обеих есть касательная и секущая. Задача пятьдесят два точка два учебника.',
      'Two problems, both with a tangent and a secant. Exercise fifty two point two.'),
    A('why',
      "Urinma har doim kvadratga ko'tariladi.",
      'Касательная всегда возводится в квадрат.',
      'The tangent is always squared.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Urinma o'zi bilan o'zi ko'paytiriladi, chunki u aylanaga faqat bitta nuqtada tegadi va ikkinchi bo'lagi yo'q.",
      'Обе решены. Касательная умножается сама на себя, потому что она касается окружности в одной точке и второго куска у неё нет.',
      'Both are solved. The tangent multiplies by itself because it touches the circle at one point and has no second piece.',
    ),
    tasks: [
      {
        expr: 'PA = 4,   PB = 2',
        question: L('PC nechaga teng?', 'Чему равно PC?', 'What does PC equal?'),
        ok: L("Ha, sakkiz. O'n olti bo'lingan ikki.", 'Да, восемь. Шестнадцать на два.', 'Yes, eight. Sixteen over two.'),
        items: [
          { id: 'a', right: true, label: '8' },
          { id: 'b', label: '2', hint: L("Avval urinmani kvadratga ko'taring: to'rt karra to'rt o'n olti. Keyin ikkiga bo'ling.", 'Сначала возведи касательную в квадрат: четыре на четыре шестнадцать. Потом раздели на два.', 'First square the tangent: four times four is sixteen. Then divide by two.') },
        ],
        solution: ['PA² = PB · PC', '16 = 2 · PC', 'PC = 8'],
      },
      {
        expr: 'PA = 5,   PC = 10',
        question: L('PB nechaga teng?', 'Чему равно PB?', 'What does PB equal?'),
        ok: L("Ha, ikki butun besh o'ndan. Yigirma besh bo'lingan o'n.", 'Да, две целых пять десятых. Двадцать пять на десять.', 'Yes, two point five. Twenty five over ten.'),
        items: [
          { id: 'a', right: true, label: '2,5' },
          { id: 'b', label: '5', hint: L("Yigirma beshni o'nga bo'ling. Bu ikki butun besh o'ndan, besh emas.", 'Раздели двадцать пять на десять. Это две с половиной, а не пять.', 'Divide twenty five by ten. That is two and a half, not five.') },
        ],
        solution: ['25 = PB · 10', 'PB = 2,5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — diametr.
// ============================================================
const S11 = {
  eyebrow: L('DIAMETR', 'ДИАМЕТР', 'THE DIAMETER'),
  title: L(
    "Perpendikulyar vatar",
    'Перпендикулярная хорда',
    'A perpendicular chord',
  ),
  audio: [
    A('mount',
      "Diametrga perpendikulyar vatar uni teng ikkiga bo'ladi. Ikkita masala shu holatga.",
      'Хорда, перпендикулярная диаметру, делится им пополам. Две задачи на этот случай.',
      'A chord perpendicular to a diameter is halved by it. Two problems on that case.'),
    A('why',
      "Yarim vatar ikkita bo'lakning o'rta geometrigiga teng bo'ladi.",
      'Половина хорды равна среднему геометрическому двух кусков.',
      'Half the chord equals the geometric mean of the two pieces.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Bu holat 45-darsda to'g'ri burchakli uchburchakning balandligi sifatida yana uchraydi, chunki u ham o'rta geometrik beradi.",
      'Обе решены. Этот случай встретится снова на 45 уроке как высота прямоугольного треугольника, она тоже даёт среднее геометрическое.',
      'Both are solved. This case returns in lesson 45 as the altitude of a right triangle, which also gives a geometric mean.',
    ),
    tasks: [
      {
        expr: 'AE = 3,   EB = 12',
        question: L(
          "Diametrning bo'laklari uch va o'n ikki. Yarim vatar nechaga teng?",
          'Куски диаметра три и двенадцать. Чему равна половина хорды?',
          'The diameter splits into three and twelve. What is half the chord?',
        ),
        ok: L("Ha, olti. O'ttiz oltining ildizi.", 'Да, шесть. Корень из тридцати шести.', 'Yes, six. The root of thirty six.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '7,5', hint: L("Yetti butun besh o'ndan bu bo'laklarning O'RTA ARIFMETIGI. Bu yerda esa o'rta geometrik kerak, ya'ni ko'paytmaning ildizi.", 'Семь с половиной это СРЕДНЕЕ АРИФМЕТИЧЕСКОЕ кусков. А здесь нужно среднее геометрическое, то есть корень произведения.', 'Seven and a half is the ARITHMETIC mean of the pieces. Here the geometric mean is needed, the root of the product.') },
        ],
        solution: ['h² = 3 · 12 = 36', 'h = 6'],
      },
      {
        expr: 'AE = 3,   EB = 12',
        question: L(
          "Butun vatar nechaga teng?",
          'Чему равна вся хорда?',
          'What is the whole chord?',
        ),
        ok: L("Ha, o'n ikki. Ikkita olti.", 'Да, двенадцать. Два раза по шесть.', 'Yes, twelve. Two sixes.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '6', hint: L("Olti bu yarim vatar. Perpendikulyarlik uni teng ikkiga bo'lgan edi, demak butuni ikki barobar.", 'Шесть это половина хорды. Перпендикулярность делила её пополам, значит вся вдвое больше.', 'Six is half the chord. The perpendicularity halved it, so the whole is twice as long.') },
        ],
        solution: ['CD = 2 · 6 = 12'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — qo'shish va noto'g'ri juftlash.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Qo'shish o'rniga ko'paytirish",
    'Умножение, а не сложение',
    'Multiplying, not adding',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Bo'laklar besh va ikki butun besh o'ndan, hamda ikki va x. U besh qo'shuv ikki butun besh o'ndan teng ikki qo'shuv x deb yozgan va x ni besh butun besh o'ndan deb topgan.",
      'Решение Камрона. Куски пять и две с половиной, а также два и x. Он записал пять плюс две с половиной равно два плюс x и получил x равным пяти с половиной.',
      "Kamron's solution. The pieces are five and two and a half, and two and x. He wrote five plus two and a half equals two plus x and got x as five and a half."),
    A('why',
      "Uning tenglamasi ham chiroyli ko'rinadi. Lekin uni tekshirib ko'rish mumkin.",
      'Его уравнение тоже выглядит красиво. Но его можно проверить.',
      'His equation looks tidy too. But it can be checked.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamronning qoidasi bo'yicha bo'laklarning yig'indisi bir xil bo'lishi kerak edi, ya'ni har ikkala vatar ham bir xil uzunlikda bo'lardi. Aylanada esa vatarlar har xil uzunlikda bo'lishi mumkin, faqat ko'paytmalari teng qoladi.",
      'По правилу Камрона суммы кусков должны быть одинаковы, то есть обе хорды имели бы одну длину. А в окружности хорды бывают разной длины, равными остаются только произведения.',
      'By Kamron rule the sums of the pieces would agree, so both chords would have the same length. In a circle chords may differ in length; only the products stay equal.',
    ),
    tasks: [
      {
        expr: '5 + 2,5 = 7,5    2 + 6,25 = 8,25',
        question: L(
          "Kamronning qoidasi bo'yicha ikkita vatar qanday bo'lishi kerak edi?",
          'Какими по правилу Камрона должны были быть две хорды?',
          'By Kamron rule, what would the two chords have to be?',
        ),
        ok: L(
          "To'g'ri, bir xil uzunlikda. Bu esa har doim ham shunday emas, demak qoida noto'g'ri.",
          'Верно, одной длины. А так бывает не всегда, значит правило неверно.',
          'Correct, of the same length. That is not always so, hence the rule is wrong.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Bir xil uzunlikda", 'Одной длины', 'Of the same length'),
          },
          {
            id: 'b',
            label: L('Perpendikulyar', 'Перпендикулярными', 'Perpendicular'),
            hint: L(
              "Uning qoidasi yig'indilarni tenglashtiradi. Vatarning uzunligi esa aynan bo'laklarning yig'indisi.",
              'Его правило приравнивает суммы. А длина хорды это и есть сумма кусков.',
              'His rule equates the sums. And the length of a chord is exactly the sum of its pieces.',
            ),
          },
        ],
        solution: [
          '5 · 2,5 = 12,5',
          '2 · 6,25 = 12,5',
          L('kopaytmalar teng', 'произведения равны', 'the products agree'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — 52.6, diametr orqali.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ko'paytmani diametr aytib beradi",
    'Произведение подскажет диаметр',
    'The diameter tells the product',
  ),
  audio: [
    A('mount',
      "Radiusi o'n uch bo'lgan aylana. Markazdan besh birlik uzoqlikda P nuqta olingan va u orqali uzunligi yigirma besh bo'lgan vatar o'tkazilgan.",
      'Окружность радиуса тринадцать. На расстоянии пять от центра взята точка P, через неё проведена хорда длиной двадцать пять.',
      'A circle of radius thirteen. At distance five from the centre sits P, and through it runs a chord of length twenty five.'),
    A('why',
      "Vatarning bo'laklari noma'lum. Lekin P orqali yana bitta vatar o'tkazish mumkin, eng qulayi diametr.",
      'Куски хорды неизвестны. Но через P можно провести ещё одну хорду, удобнее всего диаметр.',
      'The pieces are unknown. But another chord may pass through P, and the handiest is a diameter.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Diametr hech qanday qo'shimcha ma'lumot talab qilmaydi, chunki uning bo'laklari radius va markazgacha bo'lgan masofa orqali darhol yoziladi. Shuning uchun u har doim ishlaydigan yordamchi chiziq.",
      'Диаметр не требует никаких дополнительных данных, ведь его куски сразу выписываются через радиус и расстояние до центра. Поэтому он всегда работающая вспомогательная линия.',
      'A diameter needs no extra data, since its pieces come at once from the radius and the distance to the centre. That makes it an auxiliary line that always works.',
    ),
    tasks: [
      {
        expr: 'R = 13,   OP = 5',
        question: L(
          "P orqali o'tgan diametrning bo'laklari ko'paytmasi nechaga teng?",
          'Чему равно произведение кусков диаметра, прошедшего через P?',
          'What is the product of the pieces of the diameter through P?',
        ),
        ok: L(
          "Ha, bir yuz qirq to'rt. Bo'laklar o'n sakkiz va sakkiz.",
          'Да, сто сорок четыре. Куски восемнадцать и восемь.',
          'Yes, one hundred forty four. The pieces are eighteen and eight.',
        ),
        items: [
          { id: 'a', right: true, label: '144' },
          {
            id: 'b',
            label: '169',
            hint: L(
              "Bir yuz oltmish to'qqiz bu radiusning kvadrati. Bo'laklar esa o'n uch qo'shuv besh va o'n uch ayirib besh, ya'ni o'n sakkiz va sakkiz.",
              'Сто шестьдесят девять это квадрат радиуса. А куски это тринадцать плюс пять и тринадцать минус пять, то есть восемнадцать и восемь.',
              'One hundred sixty nine is the radius squared. The pieces are thirteen plus five and thirteen minus five, that is eighteen and eight.',
            ),
          },
        ],
        solution: ['(13 + 5) · (13 − 5)', '18 · 8 = 144'],
      },
      {
        expr: 'a · b = 144,   a + b = 25',
        question: L(
          "Vatarning bo'laklari nechaga teng?",
          'Чему равны куски хорды?',
          'What are the pieces of the chord?',
        ),
        ok: L(
          "Ha, o'n olti va to'qqiz. Ularning yig'indisi yigirma besh, ko'paytmasi esa bir yuz qirq to'rt.",
          'Да, шестнадцать и девять. Их сумма двадцать пять, а произведение сто сорок четыре.',
          'Yes, sixteen and nine. They add to twenty five and multiply to one hundred forty four.',
        ),
        items: [
          { id: 'a', right: true, label: L('16 va 9', '16 и 9', '16 and 9') },
          {
            id: 'b',
            label: L('12 va 13', '12 и 13', '12 and 13'),
            hint: L(
              "O'n ikki karra o'n uch bir yuz ellik olti, bu bir yuz qirq to'rt emas. Yig'indisi to'g'ri, ko'paytmasi esa mos kelmadi.",
              'Двенадцать на тринадцать это сто пятьдесят шесть, а не сто сорок четыре. Сумма верна, произведение не сошлось.',
              'Twelve times thirteen is one hundred fifty six, not one hundred forty four. The sum fits, the product does not.',
            ),
          },
        ],
        solution: ['t² − 25t + 144 = 0', 't₁ = 16,   t₂ = 9'],
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
    "Blits: ko'paytma, kvadrat, uzoq nuqta",
    'Блиц: произведение, квадрат, дальняя точка',
    'Blitz: product, square, far point',
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
        tag: 'qoshish-kopaytirish-orniga',
        ask: L(
          "Kesishgan vatarlarda nima teng bo'ladi?",
          'Что равно у пересекающихся хорд?',
          'What is equal for intersecting chords?',
        ),
        options: [
          { id: 'r', right: true, label: L("Bo'laklarning ko'paytmalari", 'Произведения кусков', 'The products of the pieces') },
          { id: 'w', label: L("Bo'laklarning yig'indilari", 'Суммы кусков', 'The sums of the pieces') },
        ],
        ok: L(
          "To'g'ri. Yig'indilar teng bo'lganda vatarlar bir xil uzunlikda bo'lardi.",
          'Верно. Будь равны суммы, хорды имели бы одну длину.',
          'Correct. Were the sums equal, the chords would share a length.',
        ),
        hint: L(
          "12-ekranni eslang: yetti butun besh o'ndan va sakkiz butun yigirma besh yuzdan teng emas, ko'paytmalar esa ikkalasida o'n ikki butun besh o'ndan.",
          'Вспомни 12 экран: семь с половиной и восемь целых двадцать пять сотых не равны, а произведения в обоих двенадцать с половиной.',
          'Recall screen 12: seven and a half and eight point two five differ, while both products are twelve and a half.',
        ),
      },
      {
        id: 'q2',
        tag: 'urinma-kvadratsiz',
        ask: L(
          "Urinma PA uchun tenglik qanday yoziladi?",
          'Как записывается равенство для касательной PA?',
          'How is the equality written for the tangent PA?',
        ),
        options: [
          { id: 'r', right: true, label: 'PA² = PB · PC' },
          { id: 'w', label: 'PA = PB · PC' },
        ],
        ok: L(
          "To'g'ri. Urinmaning ikkinchi bo'lagi yo'q, shuning uchun u o'zi bilan ko'paytiriladi.",
          'Верно. У касательной нет второго куска, поэтому она умножается сама на себя.',
          'Correct. A tangent has no second piece, so it multiplies by itself.',
        ),
        hint: L(
          "7-ekranni eslang: proporsiyada PA ikki marta qatnashardi.",
          'Вспомни 7 экран: в пропорции PA участвовало дважды.',
          'Recall screen 7: PA appeared twice in the proportion.',
        ),
      },
      {
        id: 'q3',
        tag: 'kesuvchining-uzoq-nuqtasi',
        ask: L(
          "Kesuvchida PC nimani bildiradi?",
          'Что означает PC на секущей?',
          'What does PC mean on the secant?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L("P dan uzoq nuqtagacha", 'От P до дальней точки', 'From P to the far point'),
          },
          {
            id: 'w',
            label: L("Aylana ichidagi bo'lak", 'Кусок внутри окружности', 'The piece inside the circle'),
          },
        ],
        ok: L(
          "To'g'ri. Ikkala masofa ham P dan o'lchanadi, biri yaqin nuqtagacha, ikkinchisi uzog'igacha.",
          'Верно. Оба расстояния отмеряются от P: одно до ближней точки, другое до дальней.',
          'Correct. Both distances are measured from P: one to the near point, one to the far.',
        ),
        hint: L(
          "7-ekranni eslang: PB va PC ikkalasi ham P harfidan boshlanadi.",
          'Вспомни 7 экран: и PB, и PC начинаются с буквы P.',
          'Recall screen 7: both PB and PC start with the letter P.',
        ),
      },
      {
        id: 'q4',
        tag: 'notogri-juftlash',
        ask: L(
          "AK · KB nimaga teng?",
          'Чему равно AK · KB?',
          'What does AK · KB equal?',
        ),
        options: [
          { id: 'r', right: true, label: 'CK · KD' },
          { id: 'w', label: 'AK · KD' },
        ],
        ok: L(
          "To'g'ri. Har bir ko'paytmada bitta vatarning ikkala bo'lagi turadi.",
          'Верно. В каждом произведении стоят оба куска одной хорды.',
          'Correct. Each product holds both pieces of one chord.',
        ),
        hint: L(
          "4-ekranni eslang: proporsiyada chetki hadlar chetkilarga ko'paytirilgandi.",
          'Вспомни 4 экран: в пропорции крайние умножались на крайние.',
          'Recall screen 4: in the proportion the outer terms multiplied together.',
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
    "Bitta nuqta, o'zgarmas ko'paytma",
    'Одна точка, неизменное произведение',
    'One point, an unchanging product',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda radius ham, burchak ham berilmagandi, x esa baribir topildi.",
      'На первом экране не было ни радиуса, ни угла, а x всё равно нашёлся.',
      'On the first screen neither radius nor angle was given, yet x was found.'),
    A('s1',
      "Siz ikkita teoremani chiqardingiz va ikkalasi ham 37 hamda 40-darslarga tayandi.",
      'Ты вывел две теоремы, и обе опирались на 37 и 40 уроки.',
      'You derived two theorems, and both leaned on lessons 37 and 40.'),
    A('s2',
      "Keyingi darsda vektorlar orasidagi burchak va skalyar ko'paytma.",
      'В следующем уроке угол между векторами и скалярное произведение.',
      'The next lesson covers the angle between vectors and the scalar product.'),
  ],
  props: {
    mark: 'AK · KB = CK · KD',
    markNote: L(
      "urinma uchun: PA² = PB · PC",
      'для касательной: PA² = PB · PC',
      'for a tangent: PA² = PB · PC',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: vektorlar orasidagi burchak",
      'Следующий урок: угол между векторами',
      'Next lesson: the angle between vectors',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'notogri-juftlash', ...S2 },
  { role: 'explain',  tag: 'notogri-juftlash', ...S3 },
  { role: 'explain',  tag: 'notogri-juftlash', ...S4 },
  { role: 'explain',  tag: 'qoshish-kopaytirish-orniga', ...S5 },
  { role: 'explain',  tag: 'qoshish-kopaytirish-orniga', ...S6 },
  { role: 'explain',  tag: 'urinma-kvadratsiz', ...S7 },
  { role: 'rule',     tag: 'notogri-juftlash', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'notogri-juftlash', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'urinma-kvadratsiz', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-kopaytirish-orniga', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-kopaytirish-orniga', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'kesuvchining-uzoq-nuqtasi', ...S13 },
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
