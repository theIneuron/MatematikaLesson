// ============================================================================
// 10-sinf, Dars 2. SINUS, KOSINUS, TANGENS.
//
// Bu faylda FAQAT MA'LUMOT bor. O'ram `screens.jsx` da, mexanika `tools.jsx` da,
// pokadr figuralar `figures.jsx` da, yadro `core.jsx` da. Infratuzilma
// KO'CHIRILMAYDI.
//   reja:      src/books/grade10/DARSLAR_REJASI_10SINF.md, 2-dars
//   skelet:    src/books/grade10/DARS02_SKELET.md
//   kontrakt:  src/books/grade10/ETALON_10SINF.md
//
// DARSNING GUVOHLARI -- uchta, va uchtasi ham KO'RINADI:
//   1) MAXRAJ YO'QOLADI. Gipotenuza birga qadar siqiladi, `a/c` `a/1` ga,
//      keyin `a` ga aylanadi. Ya'ni sakkizinchi sinf ta'rifi yo'qolmadi.
//   2) UCHBURCHAK YO'QOLADI, NUQTA QOLADI. Nuqta 120 gradusga borganda o'tkir
//      burchak yo'q, balandlik esa bor. Aylana shu uchun kerak edi.
//   3) NISBAT UZILADI. Nuqta tepaga borganda abscissa nolga aylanadi va
//      tangens ko'rsatkichi CHIZIQCHAGA aylanadi. Nol emas, cheksizlik emas.
//
// 3-DARS BILAN CHEGARA (metodist qarori 2026-08-13, «б» varianti). 3-dars
// pilot bo'lgani uchun ta'rifni o'zi ham chiqaradi va u TEGILMAYDI. Bu darsga
// esa 3-darsda YO'Q narsa tegishli: HAR QANDAY burchak uchun ta'rif (jumladan
// uchburchak yo'q burchak) va TANGENS. Uch burchakning jadvali, `cos²α + sin²α`
// ayniyati va teskari masala 3-darsda qoladi.
//
// KOTANGENS bu darsga KIRMAYDI: rejada u yo'q, va ekranda u o'z guvohisiz
// to'rtinchi ta'rif bo'lib qolardi (skelet §5).
//
// «Chorak» va «davr» so'zlari BIR MARTA ham aytilmaydi: ular 4 va 5-darsning
// temasi. 120 gradus esa ATAYIN olindi -- usiz koordinata orqali ta'rif
// sakkizinchi sinf ta'rifidan farq qilmaydi va dars ma'nosini yo'qotadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import { BoundBars, HypShrink, PairBothWays, RatioRise, SweepArc, TriangleVanish } from './figures.jsx'
import {
  AuditRows,
  BuildPoint,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  PlaceAngle,
  ProbeChain,
  Readout,
  Scene,
  TableFill,
  UnitCircle,
} from './tools.jsx'

// Метка урока (решение методиста 2026-08-12): `lesson_id` = grade10-<номер>,
// `lesson_name` = номер + тема ИЗ ПЛАНА дословно. Заголовок на экране другой.
const LESSON_NO = 2
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. sin/cos/tg`,
  `Урок ${LESSON_NO}. sin/cos/tg`,
  `Lesson ${LESSON_NO}. sin/cos/tg`,
)

// Блок 1: Тригонометрические функции. Уроки 1–7 по плану класса.
// `B1` ЛАТИНСКОЙ буквой: на UZ и EN экране кириллицы быть не должно.
const BLOCK = { label: 'B1', from: 1, to: 7, current: 2 }

// ============================================================
// 1. ХУК. Бывает ли косинус у тупого угла. Прогноз, не оценивается.
// ============================================================
const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('SINUS VA KOSINUS', 'СИНУС И КОСИНУС', 'SINE AND COSINE'),
  title: L(
    "120 gradusning kosinusi bormi?",
    'Бывает ли косинус у 120 градусов?',
    'Does 120 degrees have a cosine?',
  ),
  expr: 'cos 120° = ?',
  // Da'vo YORLIQDA, yozuv esa QIYMATDA. Yozuvni tilga bog'lab bo'lmaydi
  // (u uch tilda ham bir xil), shuning uchun «bunday kosinus yo'q» degan
  // gap yorliqqa chiqadi -- u `L(...)` bo'lib tarjima qilinadi.
  rows: [
    {
      id: 'a',
      name: L("bunday kosinus YO'Q", 'такого косинуса НЕТ', 'there is NO such cosine'),
      value: 'cos 120°',
    },
    {
      id: 'b',
      name: L('kosinus bor va manfiy', 'косинус есть, и он отрицателен', 'the cosine exists and is negative'),
      value: 'cos 120° = −1/2',
    },
  ],
  motion: ['mount'],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi asbobning o'zi bilan tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его самим прибором.',
      'Your answer is saved. Now the instrument itself will check it.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  audio: [
    A('mount', "Nuqta yuz yigirma gradusga suriladi.", 'Точка едет на сто двадцать градусов.', 'The point moves to one hundred twenty degrees.'),
    A('r1', "Sakkizinchi sinf ta'rifi bo'yicha bu yerda o'tkir burchak yo'q, demak kosinus ham yo'q.", 'По определению восьмого класса острого угла здесь нет, значит нет и косинуса.', 'By the grade eight definition there is no acute angle here, so there is no cosine.'),
    A('r2', "Ikkinchi yozuv esa aytadi, kosinus bor va u manfiy.", 'Вторая запись говорит, что косинус есть и он отрицателен.', 'The second reading says the cosine exists and is negative.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
}

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={S1}
        // Nuqta 120 gradusga O'ZI boradi. Koordinatalari esa podpisanmagan va
        // o'qlar ham podpisanmagan (`axes` bu yerda kerak emas): xuk bu taxmin,
        // javob harakatdan oldin berilmaydi. `x = cos α` yozuvi o'qda turgan
        // bo'lsa, butun darsning javobi birinchi ekranda ochilgan bo'lardi.
        fig={() => <Scene fig={<SweepArc to={120} ms={1300} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

// ============================================================
// 2. ОПОРА. Что уже знаем из 8 и 9 класса.
// ============================================================
const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Sakkizinchi sinfdan uch savol', 'Три вопроса из восьмого класса', 'Three questions from grade eight'),
  tag: 'support',
  items: [
    {
      id: 'q1',
      ask: true,
      // Variantlar CHIZMADAN o'qiladi: yonida turgan uchburchakda `a`, `b` va
      // `c` allaqachon podpisangan. Nima uchun shunday, so'z bilan emas: rus
      // tilida «противолежащего» bitta uzun so'z, u 390 px li telefonda
      // kartochkadan 16 px chiqib ketardi va JIMGINA kesilardi (tekshiruv
      // ushladi 2026-08-13). Formula esa uch belgidan iborat va uch tilda ham
      // bir xil. Bundan tashqari savol yaxshilanadi: o'quvchi rus jumlasini
      // emas, CHIZMANI o'qiydi -- bugungi darsning butun ishi shu.
      prompt: L(
        "Sinus qanday nisbat beradi? Chizmaga qarang.",
        'Какое отношение даёт синус? Смотри на чертёж.',
        'Which ratio gives the sine? Look at the drawing.',
      ),
      done: 'sin α = a/c',
      items: [
        { id: 'a', label: 'a/c', correct: true },
        {
          id: 'b',
          label: 'b/c',
          hint: L(
            "Bu yon katetning gipotenuzaga nisbati, ya'ni kosinus.",
            'Это отношение прилежащего катета к гипотенузе, то есть косинус.',
            'That is the adjacent leg over the hypotenuse, that is the cosine.',
          ),
        },
        {
          id: 'c',
          label: 'a/b',
          hint: L(
            "Bu ikki katetning nisbati, ya'ni tangens. Bugun u ham bo'ladi.",
            'Это отношение двух катетов, то есть тангенс. Он сегодня тоже будет.',
            'That is one leg over the other, that is the tangent. It will come up today too.',
          ),
        },
        {
          id: 'd',
          label: 'c/a',
          hint: L(
            "Surat va maxraj joy almashgan. Gipotenuza pastda turadi.",
            'Числитель и знаменатель поменялись местами. Гипотенуза стоит внизу.',
            'The numerator and denominator are swapped. The hypotenuse goes below.',
          ),
        },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L(
        "Birlik aylananing radiusi qancha?",
        'Чему равен радиус единичной окружности?',
        'What is the radius of the unit circle?',
      ),
      done: 'R = 1',
      items: [
        { id: 'a', label: '1', correct: true },
        {
          id: 'b',
          label: '2',
          hint: L(
            "Birlik degani radius birga teng degani.",
            'Единичная значит радиус равен единице.',
            'Unit means the radius equals one.',
          ),
        },
        {
          id: 'c',
          label: 'π',
          hint: L(
            "Pi bu aylana uzunligi bilan bog'liq son, radius emas.",
            'Пи это число, связанное с длиной окружности, а не радиус.',
            'Pi is a number tied to the circumference, not the radius.',
          ),
        },
        {
          id: 'd',
          label: '0',
          hint: L(
            "Radiusi nol bo'lgan aylana bu nuqta.",
            'Окружность радиуса ноль это точка.',
            'A circle of radius zero is a point.',
          ),
        },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L(
        "Nuqtaning birinchi koordinatasi qanday ataladi?",
        'Как называется первая координата точки?',
        'What is the first coordinate of a point called?',
      ),
      done: '(x;  y)',
      items: [
        { id: 'a', label: L('abscissa', 'абсцисса', 'the abscissa'), correct: true },
        {
          id: 'b',
          label: L('ordinata', 'ордината', 'the ordinate'),
          hint: L(
            "Ordinata ikkinchi koordinata, ya'ni balandlik.",
            'Ордината это вторая координата, то есть высота.',
            'The ordinate is the second coordinate, that is the height.',
          ),
        },
        {
          id: 'c',
          label: L('radius', 'радиус', 'the radius'),
          hint: L(
            "Radius bu markazdan nuqtagacha uzunlik, koordinata emas.",
            'Радиус это длина от центра до точки, а не координата.',
            'The radius is the length from the centre to the point, not a coordinate.',
          ),
        },
        {
          id: 'd',
          label: L('vatar', 'хорда', 'the chord'),
          hint: L(
            "Vatar ikki nuqtani tutashtiradi.",
            'Хорда соединяет две точки.',
            'A chord joins two points.',
          ),
        },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Bugun ular ta'rifning yarmini beradi.", 'Три коротких вопроса. Сегодня они дадут половину определения.', 'Three short questions. Today they give half of the definition.'),
  ],
}

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve, stage, setStage }) => (
      <Cols l={1} r={1}>
        <Col>
          {/* Aylana EMAS, UCHBURCHAK: savollar ham aynan sakkizinchi sinfning
              uchburchagi haqida. Birlik aylana ikkinchi javobdan keyin chiqadi
              va uchburchak undan CHIQIB turadi -- 3-ekranning siqilishi shu
              tirqishdan boshlanadi.
              Chizma JAVOB BERIB boradi: `focus` har javobdan keyin bir pog'ona
              o'sadi va so'ralgan narsa yonadi. Ilgari uchta savol uchburchak
              haqida edi, uchburchak esa qimirlamay turardi. */}
          <Scene fig={<HypShrink step={0} focus={stage} tight />} max={300} />
        </Col>
        <Col>
          <ProbeChain
            items={S2.items}
            cols={2}
            audio={audio}
            onStep={() => setStage((s) => s + 1)}
            onSolved={solve}
          />
        </Col>
      </Cols>
    )}
  </Screen>
)

// ============================================================
// 3. ОБЪЯСНЕНИЕ 1. Знаменатель исчезает. ГЛАВНЫЙ экран урока.
// ============================================================
const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Maxraj yo'qoladi", 'Знаменатель исчезает', 'The denominator disappears'),
  tag: 'koordinaty-mestami',
  // Uch kadr, figura BITTA (`HypShrink`): uchburchak siqiladi. Oradagi `a/1`
  // satri SHART (etalon §5.1): usiz o'tish fokusga o'xshaydi.
  show: [
    [
      'sin α = a/c',
      L('gipotenuza c', 'гипотенуза c', 'the hypotenuse is c'),
    ],
    [
      'sin α = a/1',
      L("gipotenuza birga qadar SIQILDI", 'гипотенуза СЖАЛАСЬ до единицы', 'the hypotenuse SHRANK to one'),
    ],
    [
      'sin α = a',
      L('balandlik bu ikkinchi koordinata', 'высота — это вторая координата', 'the height is the second coordinate'),
    ],
  ],
  motion: ['shrink', 'cast'],
  audio: [
    A('mount', "Sakkizinchi sinfning to'g'ri burchakli uchburchagi. Sinus qarshi katetning gipotenuzaga nisbati.", 'Прямоугольный треугольник из восьмого класса. Синус это отношение противолежащего катета к гипотенузе.', 'A right triangle from grade eight. The sine is the ratio of the opposite leg to the hypotenuse.'),
    A('shrink', "Endi qarang. Gipotenuza birga qadar siqiladi va maxraj yo'qoladi, chunki birga bo'lish hech narsani o'zgartirmaydi.", 'Теперь смотри. Гипотенуза сжимается до единицы, и знаменатель исчезает, ведь деление на единицу ничего не меняет.', 'Now watch. The hypotenuse shrinks to one and the denominator disappears, since dividing by one changes nothing.'),
    A('cast', "Sinus nuqtaning balandligi bo'lib qoldi, ya'ni uning ikkinchi koordinatasi.", 'Синус стал высотой точки, то есть её второй координатой.', 'The sine became the height of the point, that is its second coordinate.'),
    A('work', "Endi o'zingiz. Balandligi bir ikkidan bo'lgan nuqtani qo'ying.", 'Теперь сам. Поставь точку, у которой высота равна одной второй.', 'Now you. Place a point whose height equals one half.'),
  ],
  work: {
    prompt: L(
      "Balandligi bir ikkidan bo'ladigan nuqtani qo'ying.",
      'Поставь точку так, чтобы её высота была равна одной второй.',
      'Place the point so that its height equals one half.',
    ),
    ok: L(
      "Balandlik bir ikkidan. Shu burchakning sinusi ham bir ikkidan, chunki birlik aylanada maxraj yo'q.",
      'Высота одна вторая. Синус этого угла тоже одна вторая, ведь на единичной окружности знаменателя нет.',
      'The height is one half. The sine of this angle is one half too, because on the unit circle there is no denominator.',
    ),
    hints: [
      {
        when: (c, s) => Math.abs(s - 0.866) < 0.07,
        text: L(
          "Bu balandlik uch ildizining yarmi, bir ikkidan emas. Pastroq nuqta kerak.",
          'Это высота корень из трёх на два, а не одна вторая. Нужна точка ниже.',
          'That height is root three over two, not one half. You need a lower point.',
        ),
      },
      {
        when: (c, s) => s < 0,
        text: L(
          "Balandlik o'qdan pastga tushdi. Pastda u manfiy.",
          'Высота ушла ниже оси. Там она отрицательна.',
          'The height went below the axis. There it is negative.',
        ),
      },
      {
        when: () => true,
        text: L(
          "Tabloga qarang. Sinus qatori aynan balandlikni ko'rsatadi.",
          'Смотри на табло. Строка синуса показывает как раз высоту.',
          'Look at the readout. The sine row shows exactly the height.',
        ),
      },
    ],
  },
}

const Screen3 = (p) => (
  <Screen data={S3} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S3.show.length && !solved ? (
      /* Kadr raqami fazaga TENG: nol kadr bu sakkizinchi sinf uchburchagi va u
         birinchi replikada ko'rinishi kerak. 1-darsda boshqacha edi (`phase + 1`),
         chunki u yerda nol kadr shunchaki radius edi. */
      <Scene
        fig={<HypShrink step={phase} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* Nishon IKKITA: 30 va 150 gradus. Ikkisining ham balandligi bir ikkidan,
         va ikkisi ham TO'G'RI javob -- shuning uchun ikkisi ham qabul qilinadi.
         Bittasini rad etish matematik jihatdan yolg'on bo'lardi. */
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => Math.abs(s - 0.5) < 0.035}
        hints={S3.work.hints}
        okText={S3.work.ok}
        snap={[30, 150]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

// ============================================================
// 4. ОБЪЯСНЕНИЕ 2. Треугольник исчезает, точка остаётся.
// Здесь же закрывается «оба значения растут вместе с углом».
// ============================================================
const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L(
    "Uchburchak yo'qoladi, nuqta qoladi",
    'Треугольник исчезает, точка остаётся',
    'The triangle disappears, the point remains',
  ),
  tag: 'oba-rastut',
  show: [
    [
      L('60 gradus: uchburchak bor', '60 градусов: треугольник есть', '60 degrees: there is a triangle'),
      'sin 60° = √3/2',
    ],
    [
      L("120 gradus: o'tkir burchak yo'q", '120 градусов: острого угла нет', '120 degrees: no acute angle'),
      L('balandlik esa joyida', 'а высота осталась', 'but the height stayed'),
    ],
    [
      'sin 120° = sin 60°',
      'cos 120° = −cos 60°',
    ],
  ],
  motion: ['mount', 'ride', 'compare'],
  audio: [
    A('mount', "Nuqta noldan chiqib, oltmish gradusga boradi. Uchburchak bor, chunki burchak o'tkir.", 'Точка едет от нуля и встаёт на шестьдесят градусов. Треугольник есть, потому что угол острый.', 'The point moves from zero and stops at sixty degrees. There is a triangle, because the angle is acute.'),
    A('ride', "Endi nuqta oldinga, to'qsondan o'tib boradi. Uchburchak yo'qoladi, chunki o'tkir burchak qolmadi. Balandlik esa qoladi.", 'Теперь точка едет дальше, за девяносто. Треугольник исчезает, ведь острого угла больше нет. А высота остаётся.', 'Now the point moves on, past ninety. The triangle disappears, since there is no acute angle any more. But the height remains.'),
    A('compare', "Qarang. Ikki nuqtaning balandligi bir xil, siljishlari esa qarama-qarshi. Burchak kattalashdi, sinus esa o'zgarmadi.", 'Смотри. У двух точек высота одинаковая, а сдвиги противоположные. Угол стал больше, а синус остался тем же.', 'Look. The two points have the same height, but opposite shifts. The angle grew larger while the sine stayed the same.'),
    A('work', "Endi o'zingiz nuqtani yuz yigirma gradusga olib boring.", 'Теперь сам доведи точку до ста двадцати градусов.', 'Now bring the point to one hundred twenty degrees yourself.'),
  ],
  work: {
    prompt: L(
      "Nuqtani yuz yigirma gradusga olib boring: balandligi oltmish gradusdagidek, siljishi esa chapga.",
      'Доведи точку до ста двадцати градусов: высота как у шестидесяти, а сдвиг влево.',
      'Bring the point to one hundred twenty degrees: the height as at sixty, and the shift to the left.',
    ),
    ok: L(
      "Siljish manfiy bo'ldi, minus bir ikkidan. Balandlik esa o'zgarmadi. Uchburchak yo'q, ikki koordinata bor.",
      'Сдвиг стал отрицательным, минус одна вторая. А высота не изменилась. Треугольника нет, а обе координаты есть.',
      'The shift became negative, minus one half. The height did not change. There is no triangle, but both coordinates are there.',
    ),
    hints: [
      {
        when: (c, s) => c > 0.1,
        text: L(
          "Siljish hali ham o'ngga, ya'ni musbat. Nuqtani eng tepadan o'tkazib yuboring.",
          'Сдвиг всё ещё вправо, то есть положителен. Веди точку дальше, за самый верх.',
          'The shift still goes right, so it is positive. Drive the point further, past the very top.',
        ),
      },
      {
        when: (c, s) => s < 0,
        text: L(
          "Balandlik o'qdan pastga tushdi. Kerakli nuqta o'qdan yuqorida, lekin chap tomonda.",
          'Высота ушла ниже оси. Нужная точка выше оси, но левее.',
          'The height went below the axis. The point you need is above the axis, but to the left.',
        ),
      },
      {
        when: () => true,
        text: L(
          "Balandligi oltmish gradusdagidek bo'lgan, siljishi esa chapga qaragan nuqta kerak.",
          'Нужна точка, у которой высота такая же, как у шестидесяти градусов, а сдвиг направлен влево.',
          'You need the point whose height matches sixty degrees and whose shift points left.',
        ),
      },
    ],
  },
}

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      <Scene
        fig={<TriangleVanish step={phase} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => Math.abs(c + 0.5) < 0.06 && s > 0.5}
        hints={S4.work.hints}
        okText={S4.work.ok}
        snap={[120]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

// ============================================================
// 5. ОБЪЯСНЕНИЕ 3. Пара читается в обе стороны. Показа нет: тот же
// прибор, обратное действие. Экран закрыт, когда сделано и то и другое.
// ============================================================
const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Juftlik ikki tomonga ham o'qiladi", 'Пара читается в обе стороны', 'The pair reads both ways'),
  tag: 'koordinaty-mestami',
  // Uch kadr: nuqta keladi, sonlar YOZUVGA yig'iladi, sonlar QAYTIB o'qlarga
  // tushadi va nuqta ular kesishgan joyda yonadi. Ya'ni sarlavha ekranda
  // bajariladi, keyin esa o'quvchi o'sha ikki yo'lni o'zi bosib o'tadi.
  show: [
    [
      '135°',
      L('nuqta va uning ikki izi', 'точка и два её следа', 'the point and its two traces'),
    ],
    [
      // Juftlikning O'ZI bu yerda yozilmaydi: u endi CHIZMADA yig'iladi, va
      // ko'chishning borish joyi ham o'sha. Ikki joyda bir xil yozuv turganda
      // harakatning ma'nosi yo'qoladi -- daftar figuradan oldin javob berib
      // qo'yardi (surat, 2026-08-13).
      L("sonlar o'qlardan yozuvga ko'chdi", 'числа перешли с осей в запись', 'the numbers moved from the axes into the record'),
      L("juftlik chizmada yig'ildi", 'пара собралась на чертеже', 'the pair assembled on the drawing'),
    ],
    [
      L("teskari yo'l", 'обратный путь', 'the reverse way'),
      L("yozuvdan o'qlarga, keyin nuqtaga", 'из записи на оси, потом в точку', 'from the record to the axes, then to the point'),
    ],
  ],
  motion: ['mount', 'read', 'back'],
  place: {
    prompt: L(
      "Nuqtani bir yuz o'ttiz besh gradusga qo'ying va juftlikni o'qing.",
      'Поставь точку на 135 градусов и прочитай пару.',
      'Place the point at 135 degrees and read the pair.',
    ),
    steps: ['(cos 135°;  sin 135°) = (−√2/2;  √2/2)'],
    ok: L(
      "Birinchi son manfiy, ikkinchisi musbat. Siljish chapga, balandlik yuqoriga.",
      'Первое число отрицательно, второе положительно. Сдвиг влево, высота вверх.',
      'The first number is negative, the second positive. The shift goes left, the height goes up.',
    ),
    wrong: L(
      "Bir yuz o'ttiz besh gradus to'g'ri burchakdan yarim to'g'ri burchak uzoqda.",
      'Сто тридцать пять градусов это прямой угол и ещё половина прямого.',
      'One hundred thirty five degrees is a right angle plus half of one.',
    ),
  },
  back: {
    title: L(
      "Endi teskarisi: juftlik berilgan",
      'Теперь наоборот: дана пара',
      'Now the reverse: the pair is given',
    ),
    prompt: L(
      "Ikki soni ham ikki ildizining yarmiga teng bo'lgan nuqtani qo'ying.",
      'Поставь точку, у которой оба числа равны корню из двух на два.',
      'Place the point whose two numbers both equal root two over two.',
    ),
    ok: L(
      "Ikki son teng. Nol bilan bir yuz sakson oradasida bunday nuqta bittagina, qirq besh gradusda.",
      'Оба числа равны. Между нулём и ста восьмьюдесятью такая точка ровно одна, на сорока пяти градусах.',
      'Both numbers are equal. Between zero and one hundred eighty there is exactly one such point, at forty five degrees.',
    ),
    hints: [
      {
        when: (c, s) => s > 0.9,
        text: L(
          "Eng tepada balandlik deyarli birga teng, siljish esa deyarli nol. Ular teng bo'lgan joy kerak.",
          'Наверху высота почти единица, а сдвиг почти ноль. Нужно место, где они равны.',
          'At the top the height is nearly one and the shift nearly zero. You need where they are equal.',
        ),
      },
      {
        when: (c, s) => c > 0.9,
        text: L(
          "O'ng tomonda siljish deyarli birga teng, balandlik esa deyarli nol.",
          'Справа сдвиг почти единица, а высота почти ноль.',
          'On the right the shift is nearly one and the height nearly zero.',
        ),
      },
      {
        when: (c, s) => c < 0 || s < 0,
        text: L(
          "Ikki son ham musbat bo'lishi kerak, ya'ni nuqta o'ngda va yuqorida.",
          'Оба числа должны быть положительны, то есть точка справа и сверху.',
          'Both numbers must be positive, so the point is on the right and above.',
        ),
      },
      {
        when: () => true,
        text: L(
          "Tabloga qarang. Kosinus va sinus qatorlari bir xil sonni ko'rsatishi kerak.",
          'Смотри на табло. Строки косинуса и синуса должны показать одно и то же число.',
          'Look at the readout. The cosine and sine rows must show the same number.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Nuqta noldan chiqib, bir yuz o'ttiz besh gradusga boradi. Undan ikki iz tushadi.", 'Точка едет от нуля и встаёт на сто тридцать пять градусов. От неё падают два следа.', 'The point moves from zero and stops at one hundred thirty five degrees. Two traces fall from it.'),
    A('read', "To'g'ri o'qish. Ikki son o'qlardan ko'chib, bitta yozuvga yig'iladi.", 'Прямое чтение. Два числа переезжают с осей и собираются в одну запись.', 'The direct reading. The two numbers move off the axes and gather into one record.'),
    A('back', "Endi teskarisi. O'sha sonlar yozuvdan qaytib o'qlarga tushadi, va ular kesishgan joyda nuqta yonadi.", 'Теперь наоборот. Те же числа возвращаются из записи на оси, и в месте их пересечения загорается точка.', 'Now the other way. The same numbers move back from the record onto the axes, and the point lights up where they meet.'),
    A('work', "Endi ikki yo'lni ham o'zingiz bosib o'ting. Ikkisini ham bajarish kerak.", 'Теперь пройди оба пути сам. Надо сделать и то, и другое.', 'Now walk both ways yourself. You need to do both.'),
  ],
}

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, stage, setStage, setTitle, solve }) => (stage === 0 && phase < S5.show.length ? (
      /* Ko'rsatish: sarlavha ekranda BAJARILADI -- sonlar yozuvga boradi va
         qaytadi. Undan keyingina o'quvchi o'sha ikki yo'lni o'zi bosib o'tadi. */
      <Scene
        fig={<PairBothWays step={phase} deg={135} labels={['−√2/2', '√2/2']} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : stage === 1 ? (
      <BuildPoint
        prompt={S5.back.prompt}
        test={(c, s) => Math.abs(c - 0.7071) < 0.05 && Math.abs(s - 0.7071) < 0.05}
        hints={S5.back.hints}
        okText={S5.back.ok}
        snap={[45]}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <PlaceAngle
        prompt={S5.place.prompt}
        targets={[135]}
        steps={S5.place.steps}
        okText={S5.place.ok}
        wrongText={S5.place.wrong}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={() => setTimeout(() => { setTitle(S5.back.title); setStage(1) }, 1500)}
      />
    ))}
  </Screen>
)

// ============================================================
// 6. ОБЪЯСНЕНИЕ 4. Тангенс и место, где его нет.
// ============================================================
const S6 = {
  role: 'explain4',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Tangens va u yo'q joy", 'Тангенс и место, где его нет', 'The tangent and where it does not exist'),
  tag: 'tangens-bez-nulya',
  show: [
    [
      'tg α = y/x',
      L('nisbat, yangi kattalik emas', 'отношение, а не новая величина', 'a ratio, not a new quantity'),
    ],
    [
      L("x qisqaradi", 'x сокращается', 'x is shrinking'),
      L("nisbat esa o'sadi", 'а отношение растёт', 'and the ratio is growing'),
    ],
    [
      'x = 0',
      L("bo'lish yo'q, qiymat ham yo'q", 'деления нет, значения тоже нет', 'no division, no value either'),
    ],
  ],
  motion: ['mount', 'rise', 'top'],
  audio: [
    A('mount', "Nuqta qirq besh gradusga chiqadi. Tangens bu allaqachon o'qilgan ikki sonning nisbati, ordinatani abscissaga bo'lamiz. Bu yerda ular teng, demak nisbat bir.", 'Точка едет на сорок пять градусов. Тангенс это отношение двух уже прочитанных чисел, ординаты к абсциссе. Здесь они равны, значит отношение равно единице.', 'The point moves to forty five degrees. The tangent is the ratio of two numbers you have already read, the ordinate to the abscissa. Here they are equal, so the ratio is one.'),
    A('rise', "Endi qarang. Nuqta yuqoriga suriladi, abscissa qisqaradi, nisbat esa o'sadi.", 'Теперь смотри. Точка едет к верху, абсцисса сокращается, а отношение растёт.', 'Now watch. The point moves toward the top, the abscissa shrinks, and the ratio grows.'),
    A('top', "Eng tepada abscissa nolga aylandi. Nolga bo'lish mumkin emas, va asbob ko'rsatkichi uziladi. Qiymat yo'q.", 'На самом верху абсцисса стала нулём. На ноль делить нельзя, и показание прибора обрывается. Значения нет.', 'At the very top the abscissa became zero. You cannot divide by zero, so the reading breaks off. There is no value.'),
    A('work', "Endi o'zingiz nuqtani eng tepaga olib boring va tangens qatoriga qarang.", 'Теперь сам доведи точку до самого верха и посмотри на строку тангенса.', 'Now bring the point to the very top yourself and look at the tangent row.'),
  ],
  work: {
    prompt: L(
      "Nuqtani eng tepaga olib boring va tangens qatoriga qarang.",
      'Доведи точку до самого верха и следи за строкой тангенса.',
      'Bring the point to the very top and watch the tangent row.',
    ),
    ok: L(
      "Abscissa nol. Tangens qatorida chiziqcha turadi. Bu nol emas va cheksizlik ham emas, qiymat shunchaki yo'q.",
      'Абсцисса ноль. В строке тангенса стоит прочерк. Это не ноль и не бесконечность, значения просто нет.',
      'The abscissa is zero. The tangent row shows a dash. It is not zero and not infinity, there simply is no value.',
    ),
    hints: [
      {
        when: (c, s) => s < 0,
        text: L(
          "Siz o'qdan pastdasiz. Nuqtani yuqoriga, eng tepaga olib boring.",
          'Ты ниже оси. Веди точку вверх, к самому верху.',
          'You are below the axis. Drive the point up, to the very top.',
        ),
      },
      {
        when: (c, s) => Math.abs(c) > 0.3,
        text: L(
          "Abscissa hali katta. Yuqoriroq boring, u nolga yaqinlashishi kerak.",
          'Абсцисса ещё большая. Веди выше, она должна подойти к нулю.',
          'The abscissa is still large. Go higher, it has to approach zero.',
        ),
      },
      {
        when: () => true,
        text: L(
          "Yana bir oz. Abscissa nolga aylanishi kerak.",
          'Ещё немного. Абсцисса должна стать нулём.',
          'A little more. The abscissa has to become zero.',
        ),
      },
    ],
  },
}

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Scene
        fig={<RatioRise step={phase} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      /* Tablo TANGENS qatori bilan: uzilish aynan shu yerda ko'rinadi.
         `snap` 90 gradusda -- barmoq bilan aynan tepaga tushib bo'lmaydi, va
         usiz ekran o'tib bo'lmaydigan bo'lardi. */
      <BuildPoint
        prompt={S6.work.prompt}
        test={(c, s) => Math.abs(c) < 0.02 && s > 0.5}
        hints={S6.work.hints}
        okText={S6.work.ok}
        snap={[90]}
        readout={{ tan: true }}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

// ============================================================
// 7. ОБЪЯСНЕНИЕ 5. Граничный случай: у отношения границы нет.
// Синус и косинус — координаты точки на окружности радиуса 1, поэтому
// больше единицы не бывают. Тангенс — не координата.
// ============================================================
const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L(
    "Qaysi biri birdan katta bo'la oladi?",
    'Что из трёх может быть больше единицы?',
    'Which of the three can exceed one?',
  ),
  tag: 'bolshe-odnogo',
  // Uch kadr: ikki ustun bir belgidan past, nuqta AYLANIB chiqadi va ular
  // baribir o'tmaydi, keyin tangens ustuni yonib belgidan o'tib ketadi.
  // Nima uchun aylanib chiqish kerak: bitta burchakda «shu yerda kichik ekan»
  // deb o'ylash mumkin, butun aylanada esa istisno yo'qligi ko'rinadi.
  show: [
    [
      L('ikki ustun, bitta shkala', 'два столбика, одна шкала', 'two bars, one scale'),
      L("ikkisi ham BIR belgisidan past", 'оба ниже отметки ОДИН', 'both below the ONE mark'),
    ],
    [
      L("nuqta butun aylanani aylanib chiqadi", 'точка обходит весь круг', 'the point goes all the way round'),
      L("belgidan biron marta ham o'tmadi", 'ни разу не перешли отметку', 'they never crossed the mark'),
    ],
    [
      'tg 60° = (√3/2) : (1/2)',
      L("nisbat esa koordinata emas", 'а отношение — не координата', 'but a ratio is not a coordinate'),
    ],
  ],
  motion: ['round', 'over'],
  audio: [
    A('mount', "Nuqta oltmish gradusda. Yonida bitta shkalada ikki ustun turadi, kosinus va sinus, va shkalada BIR belgisi bor.", 'Точка на шестидесяти градусах. Рядом на одной шкале два столбика, косинус и синус, и на шкале есть отметка ОДИН.', 'The point is at sixty degrees. Beside it two bars on one scale, the cosine and the sine, and the scale has a ONE mark.'),
    A('round', "Endi nuqta butun aylanani aylanib chiqadi. Ustunlar u bilan birga o'sadi va kichrayadi, lekin belgidan biron marta ham o'tmaydi. Nuqta radiusi bir bo'lgan aylanada, undan uzoqroqqa chiqa olmaydi.", 'Теперь точка обходит весь круг. Столбики растут и убывают вместе с ней, но ни разу не переходят отметку. Точка лежит на окружности радиуса один и дальше неё уйти не может.', 'Now the point goes all the way round. The bars grow and shrink with it, but never cross the mark. The point lies on the circle of radius one and cannot go further.'),
    A('over', "Endi tangens ustuni yonadi. U belgidan o'tib ketdi. Tangens koordinata emas, u nisbat, va nisbat aylanada yotmaydi.", 'Теперь загорается столбик тангенса. Он ушёл за отметку. Тангенс не координата, он отношение, а отношение на окружности не лежит.', 'Now the tangent bar switches on. It went past the mark. The tangent is not a coordinate, it is a ratio, and a ratio does not lie on the circle.'),
    A('work', "Hisoblang. Oltmish gradusda balandlik siljishdan necha marta katta? Yuzdan birgacha yozing.", 'Посчитай. Во сколько раз высота больше сдвига на шестидесяти градусах? Запиши до сотых.', 'Compute. How many times larger is the height than the shift at sixty degrees? Write it to two decimals.'),
  ],
  entry: {
    prompt: L(
      "Balandlik siljishdan necha marta katta? Yuzdan birgacha.",
      'Во сколько раз высота больше сдвига? До сотых.',
      'How many times larger is the height than the shift? To two decimals.',
    ),
    answer: 1.73,
    hints: [
      L(
        "Balandlik uch ildizining yarmi, siljish esa bir ikkidan.",
        'Высота корень из трёх на два, а сдвиг одна вторая.',
        'The height is root three over two, the shift is one half.',
      ),
      L(
        "Bir ikkidanga bo'lish bu ikkiga ko'paytirish. Ya'ni javob uch ildizining o'zi.",
        'Делить на одну вторую это умножать на два. Значит ответ это сам корень из трёх.',
        'Dividing by one half is multiplying by two. So the answer is root three itself.',
      ),
      L(
        "Uch ildizi taxminan bir butun yetmish uch.",
        'Корень из трёх это примерно один целый семьдесят три.',
        'Root three is about one point seven three.',
      ),
    ],
    // Qisqa ATAYIN: 393 px da har qo'shimcha satr 30 px, va yakuniy holat
    // budjetga sig'ishi kerak. Ma'no to'liq qoladi.
    ok: L(
      "Bir butun yetmish uch, birdan katta. Tangens koordinata emas, nisbat, nisbatda esa chegara yo'q.",
      'Один целый семьдесят три, больше единицы. Тангенс не координата, а отношение, и у отношения границы нет.',
      'One point seven three, more than one. The tangent is a ratio, not a coordinate, and a ratio has no bound.',
    ),
  },
}

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      <Scene
        fig={<BoundBars step={phase} deg={60} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          {/* Ish paytida shkala QOLADI: tangens ustuni belgidan yuqorida
              turibdi, va o'quvchi aynan o'sha sonni yozadi. */}
          <Scene fig={<BoundBars step={2} deg={60} />} max={300} />
        </Col>
        <Col>
          {/* Tablo TANGENS qatorisiz va BURCHAK qatorisiz. Ikki sabab.
              Birinchisi mazmuniy: bu ekranda o'quvchi nisbatni O'ZI hisoblaydi,
              va tayyor `√3` tabloda turgan bo'lsa, ish yozib olishga aylanadi.
              Ikkinchisi budjet: to'rt qatorli tablo 171 px, va yakuniy holat
              393 px li telefonda 61 px ga chiqib ketardi (tekshiruv ko'rsatdi).
              Burchak esa chizmada allaqachon belgilangan. */}
          <Readout angle={60} hide={['angle']} />
          <NumberEntry
            compact
            prompt={S7.entry.prompt}
            answer={S7.entry.answer}
            okText={S7.entry.ok}
            hints={S7.entry.hints}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

// ============================================================
// 8. ПРАВИЛО. Карточка словами учебника, после чека различения.
// ============================================================
const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L("Uch ta'rif", 'Три определения', 'Three definitions'),
  tag: 'koordinaty-mestami',
  probe: {
    question: L(
      "(x; y) nuqtaga qaysi juftlik mos keladi?",
      'Какая пара отвечает точке (x; y)?',
      'Which pair corresponds to the point (x; y)?',
    ),
    items: [
      { id: 'a', label: '(cos α;  sin α)', correct: true },
      {
        id: 'b',
        label: '(sin α;  cos α)',
        hint: L(
          "Unda o'ttiz gradusning balandligi uch ildizining yarmi bo'lib qolardi, aslida esa u bir ikkidan.",
          'Тогда у тридцати градусов высота была бы корень из трёх на два, а она одна вторая.',
          'Then thirty degrees would have height root three over two, but it is one half.',
        ),
      },
    ],
  },
  rule: {
    badge: L('QOIDA', 'ПРАВИЛО', 'RULE'),
    lawLabel: L('Juftlik', 'Пара', 'The pair'),
    law: '(x;  y) = (cos α;  sin α)',
    // Ta'riflar DARSLIK so'zlari bilan: algebra 2022, 134-bet.
    lines: [
      L(
        "x kattalik α burchakning kosinusi deyiladi va cos α orqali belgilanadi.",
        'Величина x называется косинусом угла α и обозначается cos α.',
        'The value x is called the cosine of the angle α and is written cos α.',
      ),
      L(
        "y kattalik α burchakning sinusi deyiladi va sin α orqali belgilanadi.",
        'Величина y называется синусом угла α и обозначается sin α.',
        'The value y is called the sine of the angle α and is written sin α.',
      ),
      L(
        "y/x nisbat α burchakning tangensi deyiladi va tg α orqali belgilanadi, bunda x ≠ 0.",
        'Отношение y/x называется тангенсом угла α и обозначается tg α, при x ≠ 0.',
        'The ratio y/x is called the tangent of the angle α and is written tg α, where x ≠ 0.',
      ),
    ],
  },
  motion: ['rule'],
  audio: [
    A('mount', "Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.", 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Nuqta yuz yigirma gradusga boradi va uchburchak yo'qoladi, koordinatalar esa qoladi. Kosinus juftlikning birinchi soni, sinus ikkinchisi, tangens esa ularning nisbati. So'zlar darslikdan olingan.", 'Точка едет на сто двадцать градусов, треугольник исчезает, а координаты остаются. Косинус это первое число пары, синус второе, а тангенс их отношение. Слова взяты из учебника.', 'The point moves to one hundred twenty degrees, the triangle disappears and the coordinates remain. The cosine is the first number of the pair, the sine the second, and the tangent their ratio. The words are taken from the textbook.'),
  ],
}

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        // Chizma javobdan KEYIN yig'iladi: farqlash savoliga javob berilgan
        // zahoti nuqta oltmishdan yuz yigirmaga boradi, uchburchak so'nadi va
        // ikki balandlik solishtiriladi. Ilgari bu yerda tayyor rasm turardi --
        // qoida ochilardi, chizma esa qimirlamasdi.
        fig={(solved) => <Scene fig={<TriangleVanish step={solved ? 2 : 0} />} max={330} />}
      />
    )}
  </Screen>
)

// ============================================================
// 9. ПРАКТИКА 1. Таблица осевых углов. Именно там живёт ошибка
// «читаю по соседней точке».
// ============================================================
const S9 = {
  role: 'drill',
  answer: 'build',
  format: 'table',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("O'q ustidagi uch burchak", 'Три угла на осях', 'Three angles on the axes'),
  tag: 'osevoy-po-sosedu',
  table: {
    rows: [
      { deg: 0, label: '0°', cos: 'p1', sin: 'z' },
      { deg: 90, label: '90°', cos: 'z', sin: 'p1' },
      { deg: 180, label: '180°', cos: 'm1', sin: 'z' },
    ],
    chips: [
      { id: 'm1', label: '−1', value: -1 },
      { id: 'z', label: '0', value: 0 },
      { id: 'p1', label: '1', value: 1 },
    ],
    wrongNote: L(
      "Chizmaga qarang, nuqta belgilangan. Birinchi son o'ngga yoki chapga siljish, ikkinchisi balandlik.",
      'Смотри на чертёж, точка отмечена. Первое число это сдвиг вправо или влево, второе высота.',
      'Look at the drawing, the point is marked. The first number is the shift right or left, the second is the height.',
    ),
    swapNote: L(
      "Sonlar joy almashgan. Birinchisi siljish, ikkinchisi balandlik.",
      'Числа перепутаны местами. Первое это сдвиг, второе высота.',
      'The numbers are swapped. The first is the shift, the second the height.',
    ),
    // Uch qatorli javob 393 px da budjetni 4 px ga oshirardi. Qisqartirildi:
    // «qo'shni nuqta» xatosining razbori `swapNote` da qoladi, ya'ni AYNAN
    // xato qilgan o'quvchi eshitadigan joyda.
    ok: L(
      "Siljish nol, balandlik esa bir. Qo'shni nuqta bo'yicha bu o'qilmaydi.",
      'Сдвиг ноль, а высота единица. По соседней точке это не прочитать.',
      'The shift is zero, the height is one. A neighbouring point will not tell you that.',
    ),
  },
  audio: [
    A('mount', "O'q ustidagi uch burchak. Aynan shu yerda qo'shni nuqta bo'yicha o'qish xatosi ko'rinadi.", 'Три угла на осях. Именно здесь видна ошибка чтения по соседней точке.', 'Three angles on the axes. This is where reading off a neighbouring point shows itself.'),
  ],
}

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <TableFill
        rows={S9.table.rows}
        chips={S9.table.chips}
        wrongNote={S9.table.wrongNote}
        swapNote={S9.table.swapNote}
        okText={S9.table.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

// ============================================================
// 10. ПРАКТИКА 2. Тангенс по шагам. ПЕРВЫЙ шаг метода — проверка
// абсциссы: именно её пропуск даёт `tg 90° = 0`.
// ============================================================
const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("tg 120° ni qadamlar bilan toping", 'Найди tg 120° по шагам', 'Find tg 120° step by step'),
  tag: 'tangens-bez-nulya',
  order: {
    prompt: L(
      "Yechim qadamlarini tartib bilan joylashtiring.",
      'Расставь шаги решения по порядку.',
      'Put the steps of the solution in order.',
    ),
    items: [
      { id: 's1', label: '(−1/2;  √3/2)' },
      { id: 's2', label: L("abscissa nol emas", 'абсцисса не ноль', 'abscissa is not zero') },
      { id: 's3', label: L("y ni x ga", 'ординату на абсциссу', 'ordinate by abscissa') },
      { id: 's4', label: '−√3' },
    ],
    answer: ['s1', 's2', 's3', 's4'],
    marks: [{ deg: 120, tone: 'graph', label: '120°' }],
    ok: L(
      "Minus uch ildizi. Balandlikni siljishga bo'ldik, teskarisiga emas, aks holda javob boshqa chiqardi.",
      'Минус корень из трёх. Делили высоту на сдвиг, а не наоборот, иначе ответ вышел бы другой.',
      'Minus root three. We divided the height by the shift, not the other way round, or the answer would differ.',
    ),
    bad: L(
      "Avval juftlik yoziladi, keyin abscissa tekshiriladi, keyin bo'lish, keyin natija.",
      'Сначала выписывается пара, потом проверяется абсцисса, потом деление, потом результат.',
      'First the pair is written, then the abscissa is checked, then the division, then the result.',
    ),
  },
  audio: [
    A('mount', "Yuz yigirma gradus. Qadamlar nomlangan, tartibini o'zingiz qo'yasiz. Birinchi qadam abscissani tekshirish, chunki aynan shu qadam tashlab ketiladi.", 'Сто двадцать градусов. Шаги названы, порядок ставишь ты. Первый шаг это проверка абсциссы, потому что именно его и пропускают.', 'One hundred twenty degrees. The steps are named, you put them in order. The first step is checking the abscissa, because that is the step people skip.'),
  ],
}

const Screen10 = (p) => (
  <Screen data={S10} {...p}>
    {({ audio, solve }) => (
      <OrderRow
        prompt={S10.order.prompt}
        items={S10.order.items}
        answer={S10.order.answer}
        marks={S10.order.marks}
        okText={S10.order.ok}
        badText={S10.order.bad}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

// ============================================================
// 11. ПРАКТИКА 3. БЕЗ ПРИБОРА. На ДТМ чертежа не будет.
// `tg 180°` намеренно: ноль стоит в ЧИСЛИТЕЛЕ, и ответ — ноль.
// Рядом с экраном 12, где ноль в знаменателе и ответа нет.
// ============================================================
const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz hisoblang', 'Посчитай без чертежа', 'Compute without a drawing'),
  tag: 'bumaga',
  tasks: [
    {
      prompt: 'tg 180°  =  ?',
      answer: 0,
      ok: L(
        "Nol. Bu yerda nol suratda, maxrajda emas, shuning uchun bo'lish mumkin va natija nol.",
        'Ноль. Здесь ноль в числителе, а не в знаменателе, поэтому делить можно и результат ноль.',
        'Zero. Here the zero is in the numerator, not the denominator, so division works and the result is zero.',
      ),
      hints: [
        L(
          "Bir yuz sakson gradusda balandlik nol, siljish esa minus bir.",
          'У ста восьмидесяти градусов высота ноль, а сдвиг минус один.',
          'At one hundred eighty degrees the height is zero and the shift is minus one.',
        ),
        L(
          "Nolni minus birga bo'ling.",
          'Раздели ноль на минус один.',
          'Divide zero by minus one.',
        ),
        L('Nol.', 'Ноль.', 'Zero.'),
      ],
    },
  ],
  order: {
    prompt: L(
      "O'sish tartibida joylashtiring.",
      'Расставь по возрастанию.',
      'Arrange in increasing order.',
    ),
    items: [
      { id: 'c0', label: 'cos 0' },
      { id: 'c60', label: 'cos 60°' },
      { id: 'c90', label: 'cos 90°' },
      { id: 'c180', label: 'cos 180°' },
    ],
    answer: ['c180', 'c90', 'c60', 'c0'],
    ok: L(
      "Hammasini songa o'tkazdingiz: minus bir, nol, bir ikkidan, bir.",
      'Ты привёл всё к числам: минус один, ноль, одна вторая, один.',
      'You turned them all into numbers: minus one, zero, one half, one.',
    ),
    bad: L(
      "Har yozuvni songa o'tkazing. Bir yuz saksonda siljish minus bir, nol gradusda esa bir.",
      'Переведи каждую запись в число. У ста восьмидесяти сдвиг минус один, а у нуля градусов единица.',
      'Turn each reading into a number. At one hundred eighty the shift is minus one, at zero degrees it is one.',
    ),
    title: L("Qaysi kosinus kichikroq?", 'Какой косинус меньше?', 'Which cosine is smaller?'),
  },
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
}

const Screen11 = (p) => (
  <Screen data={S11} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <OrderRow
        prompt={S11.order.prompt}
        items={S11.order.items}
        answer={S11.order.answer}
        okText={S11.order.ok}
        badText={S11.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big" style={{ textAlign: 'left' }}>{S11.tasks[0].prompt}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            answer={S11.tasks[0].answer}
            okText={S11.tasks[0].ok}
            hints={S11.tasks[0].hints}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

// ============================================================
// 12. ЛОВУШКА. Первые три строки ВЕРНЫ, и это делает ловушку честной.
// Неверна четвёртая: «делитель ноль, значит и ответ ноль».
// Контрпример вводит ученик — без него задание не закрыто.
// ============================================================
const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob noto'g'ri. Qayerda?", 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  rows: [
    { id: 'r1', text: 'tg α = sin α / cos α' },
    { id: 'r2', text: 'sin 90° = 1' },
    { id: 'r3', text: 'cos 90° = 0' },
    { id: 'r4', text: 'tg 90° = 1/0 = 0' },
  ],
  answerId: 'r4',
  hints: {
    r1: L(
      "Bu formula TO'G'RI. Lekin u maxraj nol bo'lmasligini talab qiladi.",
      'Эта формула ВЕРНА. Но она требует, чтобы знаменатель не был нулём.',
      'This formula is CORRECT. But it requires the denominator not to be zero.',
    ),
    r2: L(
      "Eng tepada balandlik birga teng. Qator to'g'ri, xatoni pastda qidiring.",
      'Наверху высота равна единице. Строка верна, ищи ошибку ниже.',
      'At the top the height equals one. This line is right, look lower.',
    ),
    r3: L(
      "Eng tepada siljish nolga teng. Qator to'g'ri, xatoni pastda qidiring.",
      'Наверху сдвиг равен нулю. Строка верна, ищи ошибку ниже.',
      'At the top the shift equals zero. This line is right, look lower.',
    ),
  },
  // Qisqa: satr `Insight` ga tushadi, va 393 px da har qo'shimcha satr 23 px.
  proof: L(
    "Nolga bo'lish yo'q.",
    'На ноль делить нельзя.',
    'You cannot divide by zero.',
  ),
  entry: {
    prompt: L(
      "1 ni 0,1 ga bo'lsak, qancha?",
      'Сколько будет 1 разделить на 0,1?',
      'What is 1 divided by 0,1?',
    ),
    answer: 10,
    hints: [
      L(
        "Bir butunda nechta o'ndan bir bor?",
        'Сколько десятых укладывается в одном целом?',
        'How many tenths fit into one whole?',
      ),
      L("O'n marta.", 'Десять раз.', 'Ten times.'),
      L("O'n.", 'Десять.', 'Ten.'),
    ],
    ok: L(
      "O'n. Bo'luvchi qancha kichik bo'lsa, natija shuncha katta. Demak nol chiqishi mumkin emas. To'qson gradusda tangensning qiymati yo'q.",
      'Десять. Чем меньше делитель, тем больше результат. Значит ноль получиться не может. У девяноста градусов значения тангенса нет.',
      'Ten. The smaller the divisor, the larger the result. So zero is impossible. At ninety degrees the tangent has no value.',
    ),
  },
  audio: [
    A('mount', "Masala. To'qson gradusning tangensini topish kerak.", 'Задача. Надо найти тангенс девяноста градусов.', 'A task. We need to find the tangent of ninety degrees.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную строку.', 'Four lines, all look right. Look for the first wrong line.'),
  ],
}

const Screen12 = (p) => (
  <Screen data={S12} {...p}>
    {({ audio, stage, setStage, solve }) => (
      <Cols l={1.1} r={1}>
        <Col>
          <AuditRows
            rows={S12.rows}
            answerId={S12.answerId}
            hints={S12.hints}
            proof={S12.proof}
            audio={audio}
            onSolved={() => setStage(1)}
          />
        </Col>
        <Col>
          {stage === 1 ? (
            /* Chizma bu yerda YO'Q va bu kamchilik emas: tuzoqning guvohi SON.
               Bir butunni o'ndan birga bo'lsak o'n chiqadi, ya'ni bo'luvchi
               kichrayganda natija O'SADI. Rasm bunga hech narsa qo'shmaydi,
               telefonda esa 120 px turadi va yakuniy holat budjetdan chiqadi. */
            <NumberEntry
              compact
              prompt={S12.entry.prompt}
              answer={S12.entry.answer}
              okText={S12.entry.ok}
              hints={S12.entry.hints}
              audio={audio}
              onSolved={solve}
            />
          ) : (
            /* Joy oldindan band (§5.2): aks holda kiritish paydo bo'lganda
               raskladka sakraydi. 170 -- kiritishning podpis va klaviatura
               bilan o'lchangan balandligi. */
            <Slot mh={170} />
          )}
        </Col>
      </Cols>
    )}
  </Screen>
)

// ============================================================
// 13. ПЕРЕНОС. Обратная задача: по паре назвать угол, потом отметить
// все верные записи. Тангенс здесь по величине МЕНЬШЕ единицы —
// после экрана 7, где он был больше.
// ============================================================
const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Juftlik berilgan, burchak kerak', 'Дана пара, нужен угол', 'The pair is given, the angle is needed'),
  tag: 'obratnoe',
  place: {
    prompt: L(
      "Juftlik (−√3/2; 1/2) berilgan. Shu burchakka nuqta qo'ying.",
      'Дана пара (−√3/2; 1/2). Поставь точку на этот угол.',
      'The pair (−√3/2; 1/2) is given. Place the point at this angle.',
    ),
    steps: ['(−√3/2;  1/2)  →  150°'],
    ok: L(
      "Bir yuz ellik gradus. Chapga siljish balandlikdan kattaroq, demak burchak bir yuz saksonga yaqinroq.",
      'Сто пятьдесят градусов. Сдвиг влево больше высоты, значит угол ближе к ста восьмидесяти.',
      'One hundred fifty degrees. The shift left is larger than the height, so the angle is closer to one hundred eighty.',
    ),
    wrong: L(
      "Birinchi son chapga siljish, ikkinchisi yuqoriga balandlik. Siljish kattaligi bo'yicha kattaroq.",
      'Первое число это сдвиг влево, второе высота вверх. Сдвиг по величине больше.',
      'The first number is the shift left, the second the height up. The shift is larger in size.',
    ),
  },
  multi: {
    prompt: L(
      "Shu nuqta uchun TO'G'RI bo'lgan hamma yozuvni belgilang.",
      'Отметь все записи, верные для этой точки.',
      'Mark every reading that is true for this point.',
    ),
    items: [
      { id: 'a', label: 'cos α = −√3/2', ok: true },
      { id: 'b', label: 'sin α = 1/2', ok: true },
      { id: 'c', label: 'tg α = −√3/3', ok: true },
      {
        id: 'd',
        label: 'sin α = −1/2',
        hint: L(
          "Balandlik o'qdan yuqorida, demak u musbat.",
          'Высота выше оси, значит она положительна.',
          'The height is above the axis, so it is positive.',
        ),
      },
      {
        id: 'e',
        label: 'tg α = −√3',
        hint: L(
          "Bu teskari nisbat: bu yerda siljish balandlikka bo'lingan.",
          'Это перевёрнутое отношение: здесь сдвиг поделён на высоту.',
          'That is the ratio upside down: here the shift is divided by the height.',
        ),
      },
    ],
    ok: L(
      "Beshtadan uchtasi. Bu yerda tangens kattaligi bo'yicha birdan kichik, chunki balandlik siljishdan kichik.",
      'Три записи из пяти. Здесь тангенс по величине меньше единицы, ведь высота меньше сдвига.',
      'Three readings out of five. Here the tangent is smaller than one in size, since the height is less than the shift.',
    ),
    title: L(
      "Qaysi yozuvlar shu nuqta uchun to'g'ri?",
      'Какие записи верны для этой точки?',
      'Which readings are true for this point?',
    ),
  },
  audio: [
    A('mount', "Endi teskari masala. Burchak berilmagan, juftlik berilgan.", 'Теперь обратная задача. Угол не дан, дана пара.', 'Now the inverse task. The angle is not given, the pair is.'),
    A('work', "Nuqtani qo'ying, keyin hamma to'g'ri yozuvni belgilaysiz.", 'Поставь точку, потом отметишь все верные записи.', 'Place the point, then you will mark every true reading.'),
  ],
}

const Screen13 = (p) => (
  <Screen data={S13} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <PlaceAngle
        prompt={S13.place.prompt}
        targets={[150]}
        steps={S13.place.steps}
        okText={S13.place.ok}
        wrongText={S13.place.wrong}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
      />
    ))}
  </Screen>
)

// ============================================================
// 14. БЛИЦ. Четыре вопроса, ЕДИНСТВЕННЫЙ оцениваемый экран.
// ============================================================
const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'koordinaty-mestami',
  angles: [180, 120, 120, 90],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: 'cos 180°  =  ?',
      done: 'cos 180° = −1',
      items: [
        { id: 'a', label: '−1', correct: true },
        {
          id: 'b',
          label: '0',
          hint: L(
            "Nol bu bir yuz sakson gradusning balandligi, siljishi emas.",
            'Ноль это высота ста восьмидесяти градусов, а не сдвиг.',
            'Zero is the height at one hundred eighty degrees, not the shift.',
          ),
        },
        {
          id: 'c',
          label: '1',
          hint: L(
            "Bir bu nol gradusning siljishi, bir yuz saksonning emas.",
            'Единица это сдвиг нуля градусов, а не ста восьмидесяти.',
            'One is the shift at zero degrees, not at one hundred eighty.',
          ),
        },
        {
          id: 'd',
          label: L("bunday kosinus yo'q", 'такого косинуса нет', 'no such cosine'),
          hint: L(
            "Kosinus har qanday burchakda bor: bu juftlikning birinchi soni.",
            'Косинус есть у любого угла: это первое число пары.',
            'Every angle has a cosine: it is the first number of the pair.',
          ),
        },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L(
        "Yuz yigirma gradusning birinchi koordinatasi qanday?",
        'Первая координата точки 120 градусов какая?',
        'The first coordinate of the point at 120 degrees is which?',
      ),
      done: 'cos 120° = −1/2',
      items: [
        { id: 'a', label: L('manfiy', 'отрицательна', 'negative'), correct: true },
        {
          id: 'b',
          label: L('musbat', 'положительна', 'positive'),
          hint: L(
            "Bu nuqtaning siljishi chapga qaragan, chapga esa bu minus.",
            'Сдвиг у этой точки направлен влево, а влево это минус.',
            'This point shifts to the left, and left means minus.',
          ),
        },
        {
          id: 'c',
          label: L('nol', 'ноль', 'zero'),
          hint: L(
            "Nol eng tepada bo'lardi, aynan to'qson gradusda.",
            'Ноль был бы наверху, ровно на девяноста градусах.',
            'Zero would be at the top, exactly at ninety degrees.',
          ),
        },
        {
          id: 'd',
          label: L("aniqlash mumkin emas", 'нельзя сказать', 'cannot be said'),
          hint: L(
            "Mumkin: siljish qaysi tomonga qaraganiga qarang.",
            'Можно: смотри, в какую сторону направлен сдвиг.',
            'You can: look at which way the shift points.',
          ),
        },
      ],
    },
    {
      // СТРАТЕГИЯ: выбирается ПУТЬ, а не ответ. Два варианта намеренно —
      // квота на выбор из четырёх не расходуется (§4.6).
      id: 'q3',
      ask: true,
      prompt: L(
        "Tangensni topish uchun nimani nimaga bo'lamiz?",
        'Чтобы найти тангенс, что делим на что?',
        'To find the tangent, what do we divide by what?',
      ),
      done: 'tg α = y/x',
      items: [
        {
          id: 'a',
          label: L("ordinatani abscissaga", 'ординату на абсциссу', 'the ordinate by the abscissa'),
          correct: true,
          ok: L(
            "Ha. Balandlikni siljishga bo'lamiz.",
            'Да. Высоту делим на сдвиг.',
            'Yes. We divide the height by the shift.',
          ),
        },
        {
          id: 'b',
          label: L("abscissani ordinataga", 'абсциссу на ординату', 'the abscissa by the ordinate'),
          hint: L(
            "Bu teskari nisbat. Yuz yigirma gradusda minus uch ildizi o'rniga boshqa son chiqardi.",
            'Это перевёрнутое отношение. У ста двадцати градусов вместо минус корня из трёх вышло бы другое число.',
            'That is the ratio upside down. At one hundred twenty degrees it would give a different number instead of minus root three.',
          ),
        },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L(
        "Nol bilan bir yuz sakson orasida qaysi burchakda tangens yo'q?",
        'При каком угле от 0 до 180 градусов тангенса нет?',
        'At which angle from 0 to 180 degrees does the tangent not exist?',
      ),
      done: 'tg 90°  —',
      items: [
        { id: 'a', label: '90°', correct: true },
        {
          id: 'b',
          label: '0°',
          hint: L(
            "Nol gradusda siljish birga teng, bo'lish mumkin va tangens nol.",
            'У нуля градусов сдвиг равен единице, делить можно и тангенс ноль.',
            'At zero degrees the shift equals one, division works and the tangent is zero.',
          ),
        },
        {
          id: 'c',
          label: '180°',
          hint: L(
            "Bir yuz saksonda siljish minus birga teng, bo'lish mumkin va tangens nol.",
            'У ста восьмидесяти сдвиг равен минус одному, делить можно и тангенс ноль.',
            'At one hundred eighty the shift equals minus one, division works and the tangent is zero.',
          ),
        },
        {
          id: 'd',
          label: L("bunday burchak yo'q", 'такого угла нет', 'no such angle'),
          hint: L(
            "Bunday burchak bor: siljish nolga aylanadigan joyda.",
            'Такой угол есть: там, где сдвиг обращается в ноль.',
            'Such an angle exists: where the shift turns into zero.',
          ),
        },
      ],
    },
  ],
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
}

const Screen14 = (p) => (
  <Screen data={S14} {...p}>
    {(s) => (
      <BlitzBody
        {...s}
        data={S14}
        // Chizmada nuqta va uning proyeksiyalari bor, SONLAR esa yo'q: chizmani
        // o'qish o'quvchining ishi, javob undan olinmaydi.
        fig={(round) => (
          <Scene
            fig={<UnitCircle angle={S14.angles[Math.min(round, S14.angles.length - 1)]} locked drop />}
            max={300}
          />
        )}
      />
    )}
  </Screen>
)

// ============================================================
// 15. ИТОГ. Прогноз против результата. Новой математики нет.
// ============================================================
const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  hookLabels: { a: 'cos 120°  ✗', b: 'cos 120° = −1/2', both: '?', none: '?' },
  proved: 'cos 120° = −1/2',
  law: '(x;  y) = (cos α;  sin α)',
  can: [
    L(
      "Har qanday burchakda kosinus va sinusni o'qiyman",
      'Читаю косинус и синус у любого угла',
      'I read the cosine and sine of any angle',
    ),
    L(
      "Birinchi son siljish, ikkinchisi balandlik ekanini adashtirmayman",
      'Не путаю: первое число сдвиг, второе высота',
      'I do not mix up: the first number is the shift, the second the height',
    ),
    L(
      "Tangensni juftlikdan topaman",
      'Нахожу тангенс по паре координат',
      'I find the tangent from the pair of coordinates',
    ),
    L(
      "Tangens qayerda yo'qligini bilaman",
      'Знаю, где тангенса не существует',
      'I know where the tangent does not exist',
    ),
  ],
  levels: {
    full: L("Bu turdagi masalalar yopildi.", 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L(
      "Bitta joy takrorlashni talab qiladi: qaysi son birinchi turadi.",
      'Одно место требует повтора: какое число стоит первым.',
      'One place needs review: which number comes first.',
    ),
    back: L("Qoidaga va 3-ekranga qayting.", 'Вернись к правилу и к экрану 3.', 'Go back to the rule and to screen 3.'),
  },
  bridge: L(
    "3-dars: o'sha koordinatalar, lekin aniq qiymatlari radiusdan chiqariladi.",
    'Урок 3: те же координаты, но их точные значения выводятся из радиуса.',
    'Lesson 3: the same coordinates, but their exact values come from the radius.',
  ),
  sheetTitle: L('sin, cos, tg · shpargalka', 'sin, cos, tg · шпаргалка', 'sin, cos, tg · cheat sheet'),
  sheetSrc: L('10-sinf · 2-dars', '10 класс · урок 2', 'Grade 10 · lesson 2'),
  lifehack: L(
    "Birinchi son SILJISH, ikkinchisi BALANDLIK. Tangens esa ularning nisbati.",
    'Первое число — СДВИГ, второе — ВЫСОТА. Тангенс — их отношение.',
    'The first number is the SHIFT, the second the HEIGHT. The tangent is their ratio.',
  ),
  sheetSteps: [
    'cos α = x,    sin α = y',
    'tg α = y/x,    x ≠ 0',
    'cos 0 = 1,   cos 90° = 0,   cos 180° = −1',
    'sin 0 = 0,   sin 90° = 1,   sin 180° = 0',
    'tg 0 = 0,   tg 90° —,   tg 180° = 0',
  ],
  audio: [
    A('mount', "Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.", 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Yuz yigirma gradusning kosinusi bor va u minus bir ikkidan. Uchburchak yo'q edi, koordinata esa bor.", 'У ста двадцати градусов косинус есть и он минус одна вторая. Треугольника не было, а координата есть.', 'One hundred twenty degrees does have a cosine and it is minus one half. There was no triangle, but the coordinate is there.'),
  ],
}

const Screen15 = (p) => (
  <Screen data={S15} {...p}>
    {(s) => <SummaryBody {...s} data={S15} answers={p.answers} />}
  </Screen>
)

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default makeLesson({
  meta: { id: LESSON_ID, no: LESSON_NO, title: LESSON_TITLE },
  block: BLOCK,
  screens: SCREENS,
  voice: 'm',
})
