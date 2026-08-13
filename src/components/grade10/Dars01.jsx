// ============================================================================
// 10-sinf, Dars 1. RADIANLAR.  (Радианы)
//
// Bu faylda FAQAT MA'LUMOT bor. O'ram `screens.jsx` da, mexanika `tools.jsx` da,
// yadro `core.jsx` da. Infratuzilma KO'CHIRILMAYDI.
//   reja:      src/books/grade10/DARSLAR_REJASI_10SINF.md, 1-dars
//   skelet:    src/books/grade10/DARS01_SKELET.md
//   kontrakt:  src/books/grade10/ETALON_10SINF.md
//
// DARSNING GUVOHI -- radiusni yoy bo'ylab yotqizish. To'liq aylanaga oltita
// radius sig'adi va ustiga radiusdan qisqa bo'lak qoladi. Shu bilan `pi` SON
// bo'lib qoladi: 360 emas, uch butun o'n to'rt.
//
// Tuzilishi: 15 ekran, rollar etalon §4.1 bo'yicha. Baholanadi FAQAT blits.
// Bu darsda «kosinus» va «sinus» so'zlari BIR MARTA ham aytilmaydi: ular
// 2-darsning temasi. Nuqta faqat YOYNING OXIRI sifatida kerak.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, Insight, L, Panel, Slot } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import { Carousel, ChordRace, RadiusBend, SweepArc } from './figures.jsx'
import {
  AuditRows,
  LayRadius,
  MatchPairs,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  PlaceAngle,
  ProbeChain,
  ScaleCircles,
  Scene,
  UnitCircle,
} from './tools.jsx'

// Метка урока (решение методиста 2026-08-12): `lesson_id` = grade10-<номер>,
// `lesson_name` = номер + тема ИЗ ПЛАНА дословно. Заголовок на экране другой.
const LESSON_NO = 1
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Radianlar`,
  `Урок ${LESSON_NO}. Радианы`,
  `Lesson ${LESSON_NO}. Radians`,
)

// Блок 1: Тригонометрические функции. Уроки 1–7 по плану класса.
// `B1` ЛАТИНСКОЙ буквой: на UZ и EN экране кириллицы быть не должно.
const BLOCK = { label: 'B1', from: 1, to: 7, current: 1 }

// Один радиан в градусах. Число нужно данным, а не только прибору: по нему
// ставятся цели на окружности.
const RAD = 57.29578

const UI = {
  rec1: L('birinchi yozuv', 'первая запись', 'first reading'),
  rec2: L('ikkinchi yozuv', 'вторая запись', 'second reading'),
}

// ============================================================
// 1. ХУК. `π` — это 180 или три с небольшим. Прогноз, не оценивается.
// ============================================================
const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('RADIANLAR', 'РАДИАНЫ', 'RADIANS'),
  title: L("Bu ikki yozuvdan qaysi biri to'g'ri?", 'Какая из двух записей верна?', 'Which of the two readings is correct?'),
  expr: 'π = ?',
  rows: [
    { id: 'a', name: UI.rec1, value: 'π = 180' },
    { id: 'b', name: UI.rec2, value: 'π ≈ 3,14' },
  ],
  motion: ['mount'],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi radiusning o'zi bilan tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его самим радиусом.',
      'Your answer is saved. Now the radius itself will check it.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  audio: [
    A('mount', "Aylanada yoy ajratilyapti: uning uzunligi radiusga teng.", 'На окружности откладывается дуга: её длина равна радиусу.', 'An arc is being laid on the circle: its length equals the radius.'),
    A('r1', "Birinchi yozuv mana shu.", 'Вот первая запись.', 'Here is the first reading.'),
    A('r2', "Ikkinchisi esa mana shu.", 'А вот вторая.', 'And here is the second one.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is correct? Just make a guess for now.'),
  ],
}

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={S1}
        // Дуга длиной в один радиус стоит на чертеже с первой секунды, а числа
        // нет: хук — прогноз, ответ до действия не выдаётся.
        // Дуга ЧЕРТИТСЯ при появлении экрана, а не стоит готовой: озвучка
        // говорит «на окружности отложена дуга», и это видно.
        fig={() => <Scene fig={<SweepArc to={RAD} laid ms={1100} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

// ============================================================
// 2. ОПОРА. Что уже знаем из 9 класса про окружность.
// ============================================================
const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Aylana haqida uch savol', 'Три вопроса про окружность', 'Three questions about the circle'),
  tag: 'support',
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Radiusi 1 bo'lgan aylananing uzunligi?", 'Длина окружности радиуса 1?', 'The circumference of a circle of radius 1?'),
      done: 'C = 2π',
      items: [
        { id: 'a', label: '2π', correct: true },
        { id: 'b', label: 'π', hint: L("Bu yarim aylana.", 'Это половина окружности.', 'That is half the circle.') },
        { id: 'c', label: 'π/2', hint: L("Bu chorak aylana.", 'Это четверть окружности.', 'That is a quarter of the circle.') },
        { id: 'd', label: '4π', hint: L("Formula ikki pi radius, radius esa bir.", 'Формула два пи радиус, а радиус равен единице.', 'The formula is two pi r, and r is one.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("2π taxminan qanday songa teng?", 'Чему примерно равно 2π числом?', 'What is 2π as a number, roughly?'),
      done: '2π ≈ 6,28',
      items: [
        { id: 'a', label: '6,28', correct: true },
        { id: 'b', label: '3,14', hint: L("Bu pi ning o'zi, ikki pi emas.", 'Это само пи, а не два пи.', 'That is pi itself, not two pi.') },
        { id: 'c', label: '1,57', hint: L("Bu pi ning yarmi.", 'Это половина пи.', 'That is half of pi.') },
        { id: 'd', label: '12,56', hint: L("Bu to'rt pi.", 'Это четыре пи.', 'That is four pi.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("90 gradus aylananing qanday qismi?", 'Какую часть окружности вырезает угол 90 градусов?', 'What part of the circle does a 90 degree angle cut?'),
      done: '90° → 1/4',
      items: [
        { id: 'a', label: '1/4', correct: true },
        { id: 'b', label: '1/2', hint: L("Yarmi bu 180 gradus.", 'Половина это 180 градусов.', 'Half is 180 degrees.') },
        { id: 'c', label: '1/3', hint: L("Uchdan bir bu 120 gradus.", 'Треть это 120 градусов.', 'A third is 120 degrees.') },
        { id: 'd', label: '1/6', hint: L("Oltidan bir bu 60 gradus.", 'Шестая это 60 градусов.', 'A sixth is 60 degrees.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol o'tgan yildan. Ular bugun kerak bo'ladi.", 'Три коротких вопроса из прошлого года. Они понадобятся сегодня.', 'Three short questions from last year. You will need them today.'),
  ],
}

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={null} locked ticks />} max={300} />
        </Col>
        <Col>
          <ProbeChain items={S2.items} cols={2} audio={audio} onSolved={solve} />
        </Col>
      </Cols>
    )}
  </Screen>
)

// ============================================================
// 3. ОБЪЯСНЕНИЕ 1. Радиус ложится на дугу. ГЛАВНЫЙ экран урока.
// ============================================================
const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Radius yoy bo'ylab yotadi", 'Радиус ложится на дугу', 'The radius lies along the arc'),
  tag: 'pi-kak-gradusy',
  // Три кадра ПОД ФИГУРУ `RadiusBend`: радиус поднимается, сгибается, ложится.
  // Раньше здесь стояли два кадра со статичной окружностью, а озвучка говорила
  // «отложим его длину» — обещание движения было, движения не было.
  show: [
    [
      L('radius = 1', 'радиус = 1', 'radius = 1'),
      L("uni aylanaga ko'taramiz", 'поднимаем его к окружности', 'we lift it to the circle'),
    ],
    [
      L("uzunligi O'SHA", 'длина ТА ЖЕ', 'the SAME length'),
      L('kesma egiladi', 'отрезок сгибается', 'the segment bends'),
    ],
    [
      L('yoy uzunligi = 1', 'длина дуги = 1', 'arc length = 1'),
      L('bu burchak bir radian deyiladi', 'этот угол называют один радиан', 'this angle is called one radian'),
    ],
  ],
  // Реплики, за которыми на экране ДЕЙСТВИТЕЛЬНО движется (проверяется машиной).
  motion: ['mount', 'bend'],
  prompt: L(
    "Radiusni yoy bo'ylab yotqizib boring: har yoy oldingisi tugagan joydan boshlanadi.",
    'Укладывай радиус по дуге дальше: каждая дуга начинается там, где кончилась прошлая.',
    'Keep laying the radius along the arc: each arc starts where the previous one ended.',
  ),
  ok: L(
    "Oltita radius sig'di va ustiga radiusdan qisqa bo'lak qoldi.",
    'Шесть радиусов уложились, и остался кусок короче радиуса.',
    'Six radii fitted, and a piece shorter than the radius was left.',
  ),
  // Две строки, не три: первая и вторая говорили одно и то же, а на компактном
  // телефоне лишняя строка вывода стоила 16 px и низ обрезался.
  notes: [
    L("to'liq aylana = 2π ≈ 6,28", 'полный оборот = 2π ≈ 6,28', 'a full turn = 2π ≈ 6,28'),
    L('yarim aylana = π ≈ 3,14', 'половина оборота = π ≈ 3,14', 'half a turn = π ≈ 3,14'),
  ],
  audio: [
    A('mount', "Radius birga teng. Uni aylananing o'ziga ko'taramiz.", 'Радиус равен единице. Поднимаем его к самой окружности.', 'The radius is one. We lift it to the circle itself.'),
    A('bend', "Endi qarang: kesma egiladi va aylanaga yotadi. Uzunligi o'sha, faqat egilgan.", 'Теперь смотри: отрезок сгибается и ложится на окружность. Длина та же, просто согнута.', 'Now watch: the segment bends and lies along the circle. The same length, only bent.'),
    A('one', "Yoy uzunligi bir bo'ldi. Shu burchak bir radian deyiladi.", 'Длина дуги стала единицей. Такой угол называют один радиан.', 'The arc length is now one. Such an angle is called one radian.'),
    A('work', "Endi o'zingiz davom ettiring. Butun aylanaga nechta radius sig'adi?", 'Теперь продолжи сам. Сколько радиусов уложится во весь круг?', 'Now continue yourself. How many radii will fit into the whole circle?'),
  ],
}

const Screen3 = (p) => (
  <Screen data={S3} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S3.show.length && !solved ? (
      /* Кадр фигуры на единицу больше фазы: нулевой кадр фигуры — это просто
         радиус, он виден ещё до первой реплики, а движение начинается с первой. */
      <Scene
        fig={<RadiusBend step={phase + 1} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <LayRadius prompt={S3.prompt} need={6} okText={S3.ok} notes={S3.notes} audio={audio} onSolved={solve} />
    ))}
  </Screen>
)

// ============================================================
// 4. ОБЪЯСНЕНИЕ 2. Разграничение: хорда — не дуга.
// ============================================================
const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Vatar bu yoy emas", 'Хорда — это не дуга', 'A chord is not an arc'),
  tag: 'xorda-vmesto-dugi',
  // Кадры ПОД ФИГУРУ `ChordRace`: две длины чертятся одновременно, и видно,
  // что дуга кончается раньше. Раньше здесь стояла статичная картинка.
  show: [
    [
      L("ikki uzunlik, ikkisi ham radiusga teng", 'две длины, обе равны радиусу', 'two lengths, both equal the radius'),
      L("punktir bu VATAR, to'liq chiziq esa YOY", 'пунктир — ХОРДА, сплошная — ДУГА', 'dashed is the CHORD, solid is the ARC'),
    ],
    [
      L('olti vatar aylanani YOPDI', 'шесть хорд ЗАМКНУЛИ круг', 'six chords CLOSED the circle'),
      L("olti yoy esa yopmadi: bo'lak qoldi", 'шесть дуг — нет: остался кусок', 'six arcs did not: a piece was left'),
    ],
  ],
  motion: ['mount', 'gap'],
  prompt: L(
    "Endi VATARLARNI yotqizing: har biri radius uzunligida, to'g'ri chiziq bilan.",
    'Теперь укладывай ХОРДЫ: каждая длиной в радиус, по прямой.',
    'Now lay CHORDS: each one a radius long, straight.',
  ),
  ok: L(
    "Oltita vatar aylanani AYNAN yopdi: qoldiq nol. Yoylarda esa qoldiq bor edi.",
    'Шесть хорд замкнули круг РОВНО: остаток ноль. А у дуг остаток был.',
    'Six chords closed the circle EXACTLY: the remainder is zero. With arcs there was a remainder.',
  ),
  notes: [
    L("vatar bo'ylab: aynan oltita", 'по хорде: ровно шесть', 'along the chord: exactly six'),
    L("yoy bo'ylab: olti va yana bir oz", 'по дуге: шесть и ещё немного', 'along the arc: six and a little more'),
    L('shuning uchun 2π 6 dan katta', 'поэтому 2π больше 6', 'that is why 2π is more than 6'),
  ],
  insight: L(
    "vatar to'g'ri yo'l, yoy esa aylana bo'ylab, va u uzunroq",
    'хорда — путь напрямую, дуга — по окружности, и она длиннее',
    'the chord goes straight, the arc goes along the circle, and it is longer',
  ),
  audio: [
    A('mount', "Ikki uzunlik, ikkisi ham radiusga teng: punktir vatar va aylana bo'ylab yoy. Ikkisini birga yotqizamiz.", 'Две длины, обе равны радиусу: пунктирная хорда и дуга по окружности. Уложим их одновременно.', 'Two lengths, both equal the radius: the dashed chord and the arc. We lay them together.'),
    A('gap', "Ikkisi birga o'sadi. Olti vatar aylanani aynan yopdi, olti yoy esa yopmadi: bo'lak qoldi.", 'Обе растут одновременно. Шесть хорд замкнули круг ровно, а шесть дуг не замкнули: остался кусок.', 'Both grow at once. Six chords closed the circle exactly, six arcs did not: a piece was left.'),
    A('work', "Endi vatarlarni o'zingiz yotqizing va sanang: nechtasi sig'adi?", 'Теперь уложи хорды сам и посчитай: сколько их поместится?', 'Now lay the chords yourself and count: how many will fit?'),
  ],
}

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve, t }) => (phase < S4.show.length && !solved ? (
      <Scene
        fig={<ChordRace step={phase + 1} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <>
        {/* Различение сделано СЧЁТОМ, а не точностью клика. Просить поставить
            точку туда, где дуга равна радиусу, нельзя: конец дуги (57,3°) и
            конец хорды (60°) отличаются на 2,7 градуса — попасть туда пальцем
            невозможно, а с любым разумным допуском клик по концу хорды молча
            зачёлся бы как верный, и экран перестал бы различать то, ради чего
            он сделан. Поэтому ученик укладывает ХОРДЫ: их ровно шесть, круг
            замкнулся, остаток ноль. Дуг было шесть с хвостиком. */}
        <LayRadius
          mode="chord"
          need={6}
          prompt={S4.prompt}
          okText={S4.ok}
          notes={S4.notes}
          audio={audio}
          onSolved={solve}
        />
        <Slot mh={44}>{solved ? <Insight label="≠">{t(S4.insight)}</Insight> : null}</Slot>
      </>
    ))}
  </Screen>
)

// ============================================================
// 5. ОБЪЯСНЕНИЕ 3. То же самое с другой стороны: от радиуса не зависит.
// ============================================================
const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Radiusga bog'liq emas", 'От радиуса не зависит', 'It does not depend on the radius'),
  tag: 'radian-zavisit-ot-r',
  prompt: L(
    "Kichik aylananing radiusini ikki tomonga ham suring va nisbatga qarang.",
    'Подвигай радиус маленькой окружности в обе стороны и следи за отношением.',
    'Drag the radius of the small circle both ways and watch the ratio.',
  ),
  ok: L(
    "Yoy o'zgardi, nisbat esa joyida. Burchak aylananing kattaligiga bog'liq emas.",
    'Дуга менялась, а отношение стояло. Угол не зависит от размера окружности.',
    'The arc changed while the ratio stood still. The angle does not depend on the size of the circle.',
  ),
  // Две строки, не три: первая («дуга ÷ радиус = угол») дословно повторяла
  // подпись в табло прямо над ней, а на 1366×615 стоила 13 px бюджета — экран
  // в конечном состоянии вылезал.
  notes: [
    L("radius 1 bo'lsa, bo'lishga hojat yo'q: shuning uchun «birlik» aylana", 'при радиусе 1 делить не на что: поэтому «единичная»', 'with radius 1 there is nothing to divide by: hence «unit»'),
  ],
  audio: [
    A('mount', "Ikkita aylana, burchak bitta. Yoylar boshqa uzunlikda.", 'Две окружности, угол один. Дуги разной длины.', 'Two circles, one angle. The arcs have different lengths.'),
    A('work', "Kichik aylananing radiusini suring. Nisbatga qarang: u qimirlaydimi?", 'Подвигай радиус маленькой окружности. Смотри на отношение: оно сдвинется?', 'Drag the radius of the small circle. Watch the ratio: will it move?'),
  ],
}

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, solve }) => (
      <ScaleCircles prompt={S5.prompt} angle={RAD} okText={S5.ok} notes={S5.notes} audio={audio} onSolved={solve} />
    )}
  </Screen>
)

// ============================================================
// 6. ОБЪЯСНЕНИЕ 4. Сам, на новом случае: доли оборота.
// Разобранный образец — половина — из задания УБРАН.
// ============================================================
const S6 = {
  role: 'explain4',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Aylananing qismlari', 'Доли оборота', 'Fractions of a turn'),
  tag: 'gradusy-i-radiany',
  motion: ['mount'],
  show: [
    [
      L("yarim aylana = π", 'половина оборота = π', 'half a turn = π'),
      'π = 180°',
      L('ikkita o\'lchov, bitta burchak', 'две меры, один угол', 'two measures, one angle'),
    ],
  ],
  prompts: [
    L("1-qadam. Chorak aylanaga nuqta qo'ying.", 'Шаг 1. Поставь точку на четверть оборота.', 'Step 1. Place the point at a quarter turn.'),
    L("2-qadam. Endi oltidan bir qismga.", 'Шаг 2. Теперь на шестую часть.', 'Step 2. Now at one sixth.'),
    L("3-qadam. Va uchdan bir qismga.", 'Шаг 3. И на треть.', 'Step 3. And at one third.'),
  ],
  steps: ['π/2 = 90°', 'π/3 = 60°', '2π/3 = 120°'],
  wrong: L(
    "Aylanani teng qismlarga bo'ling: to'liq aylana 360 gradus va ikki pi radian.",
    'Раздели оборот на равные части: полный оборот это 360 градусов и два пи радиан.',
    'Split the turn into equal parts: a full turn is 360 degrees and two pi radians.',
  ),
  ok: L(
    "Har bir burchak ikki o'lchovda ham yozildi.",
    'Каждый угол записан сразу в двух мерах.',
    'Each angle is written in both measures at once.',
  ),
  audio: [
    A('mount', "Nuqta yarim aylanani bosib o'tadi: bu pi radian va yuz sakson gradus. Bitta burchak, ikki o'lchov.", 'Точка проходит половину оборота: это пи радиан и сто восемьдесят градусов. Один угол, две меры.', 'The point travels half a turn: that is pi radians and one hundred eighty degrees. One angle, two measures.'),
    A('work', "Qolgan uchtasini o'zingiz qo'ying: chorak, oltidan bir, uchdan bir.", 'Остальные три поставь сам: четверть, шестая, треть.', 'Place the other three yourself: a quarter, a sixth, a third.'),
  ],
}

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* Точка ИДЁТ от нуля до 180, дуга растёт за ней: «половина оборота»
         становится путём, а не готовой картинкой. */
      <Scene
        fig={<SweepArc to={180} label="π" ms={1600} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <PlaceAngle
        prompt={S6.prompts}
        targets={[90, 60, 120]}
        steps={S6.steps}
        okText={S6.ok}
        wrongText={S6.wrong}
        audio={audio}
        extra={{ arcLive: true, ticks: true }}
        onSolved={solve}
      />
    ))}
  </Screen>
)

// ============================================================
// 7. ОБЪЯСНЕНИЕ 5. Граничный случай: мера не обязана быть кратной π/6.
// Показ на числе, которое проходит гладко; задание — на том, что не проходит.
// ============================================================
const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Gradusdan radianga", 'Из градусов в радианы', 'From degrees to radians'),
  tag: 'perevod-ne-v-tu-storonu',
  show: [
    [
      '30° = 30 · π/180',
      L('45 ga qisqartiramiz', 'сокращаем на 45', 'we reduce by 45'),
      '30 · π/180 = π/6',
    ],
    [
      L("har gradus π/180 radian", 'каждый градус это π/180 радиана', 'each degree is π/180 of a radian'),
      L("shuning uchun gradusni π/180 ga KO'PAYTIRAMIZ", 'поэтому градусы УМНОЖАЕМ на π/180', 'so we MULTIPLY degrees by π/180'),
    ],
  ],
  entry: {
    prompt: L('40° radianda qancha? Yuzdan birgacha yozing.', 'Сколько это 40° в радианах? Запиши до десятых.', 'How much is 40° in radians? Write it to one decimal place.'),
    answer: 0.7,
    hints: [
      L("Bir radian taxminan 57 gradus. Qirq undan kichik.", 'Один радиан примерно 57 градусов. Сорок меньше него.', 'One radian is about 57 degrees. Forty is less than that.'),
      L("Qirqni yuz saksonga bo'lib, pi ga ko'paytiring.", 'Раздели сорок на сто восемьдесят и умножь на пи.', 'Divide forty by one hundred eighty and multiply by pi.'),
      L("Ikki pi to'qqizdan taxminan nol butun etti.", 'Две пи девятых это примерно ноль целых семь.', 'Two pi ninths is about zero point seven.'),
    ],
    ok: L(
      "Qirq gradus bu ikki pi to'qqizdan, taxminan nol butun etti. O'lchov π/6 ga karrali bo'lishi shart emas.",
      'Сорок градусов это две пи девятых, примерно ноль целых семь. Мера не обязана быть кратной π/6.',
      'Forty degrees is two pi ninths, about zero point seven. The measure need not be a multiple of π/6.',
    ),
  },
  audio: [
    A('mount', "O'tkazishni ravon chiqadigan sonda ko'rsataman: o'ttiz gradus.", 'Покажу перевод на числе, которое проходит гладко: тридцать градусов.', 'I will show the conversion on a number that works out neatly: thirty degrees.'),
    A('rule', "Har gradus pi bo'lingan yuz sakson radian. Shuning uchun gradusni shu songa ko'paytiramiz.", 'Каждый градус это пи делить на сто восемьдесят радиана. Поэтому градусы умножаем на это число.', 'Each degree is pi over one hundred eighty of a radian. So we multiply degrees by that number.'),
    A('work', "Endi ravon chiqmaydigan son: qirq gradus. O'zingiz yozing.", 'Теперь число, которое гладко не проходит: сорок градусов. Запиши сам.', 'Now a number that does not work out neatly: forty degrees. Write it yourself.'),
  ],
}

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      <Scene
        fig={<UnitCircle angle={30} locked arc={{ to: 30 }} marks={[{ deg: 30, tone: 'graph', label: 'π/6' }]} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={null} locked ticks />} max={300} />
        </Col>
        <Col>
          <NumberEntry
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
// 8. ПРАВИЛО. Карточка открывается после чека различения.
// ============================================================
const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Radian nima', 'Что такое радиан', 'What a radian is'),
  tag: 'gradusy-i-radiany',
  probe: {
    question: L(
      "Gradusni radianga o'tkazish uchun nimaga ko'paytiriladi?",
      'На что умножить, чтобы перевести градусы в радианы?',
      'What do you multiply by to turn degrees into radians?',
    ),
    items: [
      { id: 'a', label: 'π/180', correct: true },
      {
        id: 'b',
        label: '180/π',
        hint: L(
          "Bu teskari yo'l. Shunday ko'paytirsangiz, qirq gradus mingdan oshib ketadi.",
          'Это обратный путь. Так сорок градусов превратятся в две с лишним тысячи.',
          'That is the reverse. Forty degrees would turn into over two thousand.',
        ),
      },
    ],
  },
  rule: {
    badge: L('QOIDA', 'ПРАВИЛО', 'RULE'),
    lawLabel: L("O'tkazish", 'Перевод', 'Conversion'),
    law: 'α_rad = α° · π/180',
    lines: [
      // Определение — словами учебника дословно, алгебра 2022, стр. 133.
      L(
        "α radian birlik aylanadagi uzunligi α bo'lgan yoy markaziy burchagining burchak kattaligidir.",
        'Угол в α радиан — это центральный угол, опирающийся на дугу длины α единичной окружности.',
        'An angle of α radians is the central angle on an arc of length α of the unit circle.',
      ),
      L(
        "Teskari yo'l: α° = α_rad · 180/π.",
        'Обратный путь: α° = α_rad · 180/π.',
        'The reverse: α° = α_rad · 180/π.',
      ),
      L(
        "To'liq aylana 2π radian, ya'ni taxminan 6,28. Bir radian taxminan 57°.",
        'Полный оборот 2π радиан, то есть около 6,28. Один радиан примерно 57°.',
        'A full turn is 2π radians, about 6,28. One radian is about 57°.',
      ),
    ],
  },
  audio: [
    A('mount', "Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.", 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Radian bu uzunligi radiusga teng yoyning burchagi. To'liq aylanada ularning oltitasi va yana bir oz.", 'Радиан это угол дуги, длина которой равна радиусу. В полном обороте их шесть и ещё немного.', 'A radian is the angle of an arc whose length equals the radius. A full turn holds six of them and a little more.'),
  ],
}

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        // Полный оборот ОБХОДИТСЯ, и границы радиусов появляются одна за
        // другой: карточка правила открывается на фоне того, что она описывает.
        fig={() => <Scene fig={<SweepArc to={359.99} laid ms={2200} />} max={330} />}
      />
    )}
  </Screen>
)

// ============================================================
// 9. ПРАКТИКА 1. Четыре угла: соединить меры.
// ============================================================
const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Ikki o'lchovni birlashtiring", 'Соедини две меры', 'Match the two measures'),
  tag: 'gradusy-i-radiany',
  match: {
    prompt: L(
      "Har bir gradusni o'z radian yozuvi bilan birlashtiring.",
      'Соедини каждый угол в градусах с его записью в радианах.',
      'Match each angle in degrees with its radian form.',
    ),
    left: [
      { id: 'd30', label: '30°' },
      { id: 'd45', label: '45°' },
      { id: 'd60', label: '60°' },
      { id: 'd90', label: '90°' },
    ],
    right: [
      { id: 'd30', label: 'π/6' },
      { id: 'd45', label: 'π/4' },
      {
        id: 'd60',
        label: 'π/3',
        hint: L(
          "Maxraj kichrayganda burchak KATTALASHADI: π/3 π/6 dan katta.",
          'Чем меньше знаменатель, тем БОЛЬШЕ угол: π/3 больше π/6.',
          'The smaller the denominator, the LARGER the angle: π/3 is bigger than π/6.',
        ),
      },
      { id: 'd90', label: 'π/2' },
    ],
    marks: [
      { deg: 30, tone: 'graph', label: 'π/6' },
      { deg: 45, tone: 'graph', label: 'π/4' },
      { deg: 60, tone: 'graph', label: 'π/3' },
      { deg: 90, tone: 'graph', label: 'π/2' },
    ],
    ok: L(
      "To'rt burchak, har biri ikki o'lchovda.",
      'Четыре угла, каждый в двух мерах.',
      'Four angles, each in two measures.',
    ),
  },
  audio: [
    A('mount', "To'rtta burchak. Har birini radian yozuvi bilan birlashtiring.", 'Четыре угла. Соедини каждый с записью в радианах.', 'Four angles. Match each with its radian form.'),
  ],
}

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={S9.match.left}
        right={S9.match.right}
        marks={S9.match.marks}
        okText={S9.match.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

// ============================================================
// 10. ПРАКТИКА 2. Направляемая: шаги перевода в жёстком порядке.
// ============================================================
const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("135° ni radianga o'tkazing", 'Переведи 135° в радианы', 'Convert 135° to radians'),
  tag: 'perevod-ne-v-tu-storonu',
  order: {
    prompt: L(
      "Yechim qadamlarini tartib bilan joylashtiring.",
      'Расставь шаги решения по порядку.',
      'Put the steps of the solution in order.',
    ),
    items: [
      { id: 's1', label: '135 · π/180' },
      { id: 's2', label: L("45 ga qisqartirish", 'сократить на 45', 'reduce by 45') },
      { id: 's3', label: '3π/4' },
    ],
    answer: ['s1', 's2', 's3'],
    marks: [{ deg: 135, tone: 'graph', label: '3π/4' }],
    ok: L(
      "Uch pi to'rtdan bu 135 gradus: to'g'ri burchak va yana yarmi.",
      'Три пи четвёртых это 135 градусов: прямой угол и ещё половина.',
      'Three pi quarters is 135 degrees: a right angle and a half.',
    ),
    bad: L(
      "Avval ko'paytirish yoziladi, keyin qisqartirish, keyin natija.",
      'Сначала записывается умножение, потом сокращение, потом результат.',
      'First the multiplication is written, then the reduction, then the result.',
    ),
  },
  audio: [
    A('mount', "Bir yuz o'ttiz besh gradus. Qadamlar nomlangan, tartibini o'zingiz qo'yasiz.", 'Сто тридцать пять градусов. Шаги названы, порядок ставишь ты.', 'One hundred thirty five degrees. The steps are named, you put them in order.'),
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
      prompt: 'π/5  →  ?°',
      answer: 36,
      ok: L("To'g'ri. Yuz saksonni beshga bo'ldingiz.", 'Верно. Сто восемьдесят разделить на пять.', 'Correct. One hundred eighty divided by five.'),
      hints: [
        L("π bu yuz sakson gradus.", 'Пи это сто восемьдесят градусов.', 'Pi is one hundred eighty degrees.'),
        L("Yuz saksonni beshga bo'ling.", 'Раздели сто восемьдесят на пять.', 'Divide one hundred eighty by five.'),
        L("O'ttiz olti.", 'Тридцать шесть.', 'Thirty six.'),
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
      { id: 'd50', label: '50°' },
      { id: 'p4', label: 'π/4' },
      { id: 'r1', label: '1 rad' },
      { id: 'p3', label: 'π/3' },
    ],
    answer: ['p4', 'd50', 'r1', 'p3'],
    ok: L(
      "Hammasini bir o'lchovga keltirdingiz: 45, 50, 57, 60.",
      'Ты привёл всё к одной мере: 45, 50, 57, 60.',
      'You brought them all to one measure: 45, 50, 57, 60.',
    ),
    bad: L(
      "Hammasini graduslarga keltiring: π/4 bu 45, bir radian esa 57.",
      'Приведи всё к градусам: π/4 это 45, а один радиан 57.',
      'Bring them all to degrees: π/4 is 45, and one radian is 57.',
    ),
    title: L("Qaysi burchak kattaroq?", 'Какой угол больше?', 'Which angle is larger?'),
  },
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle here. There will be none at the exam either.'),
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
        marks={S11.order.marks}
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
// 12. ЛОВУШКА. Все шаги выглядят верными, дуга вышла длиннее круга.
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
    { id: 'r1', text: 'l = α · R' },
    { id: 'r2', text: 'α = 60' },
    { id: 'r3', text: 'l = 60 · 2' },
    { id: 'r4', text: 'l = 120' },
  ],
  answerId: 'r2',
  hints: {
    r1: L(
      "Bu formula TO'G'RI, lekin u burchakni RADIANDA talab qiladi.",
      'Эта формула ВЕРНА, но она требует угол в РАДИАНАХ.',
      'This formula is CORRECT, but it needs the angle in RADIANS.',
    ),
    r3: L(
      "Bu qator oldingisidan to'g'ri kelib chiqadi. Xatoni yuqoriroqdan qidiring.",
      'Эта строка следует из предыдущей верно. Ищи ошибку выше.',
      'This line follows correctly. Look higher.',
    ),
    r4: L(
      "Bu ham to'g'ri hisoblangan. Birinchi xato qator yuqorida.",
      'Эта тоже посчитана верно. Первая неверная строка выше.',
      'This one is computed correctly too. The first wrong line is above.',
    ),
  },
  // Коротко: строка идёт в `Insight`, а на 393 px каждая вторая строка текста
  // стоит 23 px, и конечное состояние экрана в бюджет не влезало.
  proof: L(
    "Radian o'rniga gradus.",
    'Градусы вместо радиан.',
    'Degrees instead of radians.',
  ),
  entry: {
    // Коротко НАМЕРЕННО: на телефоне каждая лишняя строка подписи — это 20 px,
    // а конечное состояние экрана и без неё едва влезает.
    prompt: L(
      "BUTUN aylananing uzunligi, R = 2?",
      'Длина ВСЕЙ окружности, R = 2?',
      'The length of the WHOLE circle, R = 2?',
    ),
    answer: 12.6,
    hints: [
      L("Formula ikki pi radius.", 'Формула два пи радиус.', 'The formula is two pi r.'),
      L("Ikki pi taxminan 6,28, uni ikkiga ko'paytiring.", 'Два пи это примерно 6,28, умножь на два.', 'Two pi is about 6,28, multiply by two.'),
      L("O'n ikki butun olti.", 'Двенадцать целых шесть.', 'Twelve point six.'),
    ],
    ok: L(
      "Butun aylana 12,6, yoy esa 120 chiqdi. Yoy aylanadan o'n baravar uzun bo'lib qoldi.",
      'Вся окружность 12,6, а дуга получилась 120. Дуга вышла почти в десять раз длиннее круга.',
      'The whole circle is 12,6 while the arc came out as 120. The arc is almost ten times longer than the circle.',
    ),
  },
  audio: [
    A('mount', "Masala: radiusi ikki bo'lgan aylanada oltmish gradusli yoy uzunligi.", 'Задача: длина дуги в шестьдесят градусов на окружности радиуса два.', 'A task: the length of a sixty degree arc on a circle of radius two.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xatoni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую ошибку.', 'Four lines, all look right. Look for the first mistake.'),
  ],
}

const Screen12 = (p) => (
  <Screen data={S12} {...p}>
    {({ audio, stage, setStage, solve, t }) => (
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
            <>
              {/* Здесь НЕТ чертежа, и это не упущение.
                  Свидетель ловушки — ЧИСЛО: вся окружность 12,6, а дуга вышла
                  120. Картинка этого не добавляет, зато на телефоне стоит 120 px
                  (`.g10-scene-fig` держит `min-height: 120px` на узком экране,
                  меньше не сжимается). С ней конечное состояние экрана вылезало
                  за бюджет, а обрезка внутри карточки не даёт прокрутки —
                  строки просто исчезают.
                  Разбор тоже не дублируется: его показывает сам прибор рядом со
                  строками, где ошибка и найдена. */}
              <NumberEntry
                compact
                prompt={S12.entry.prompt}
                answer={S12.entry.answer}
                okText={S12.entry.ok}
                hints={S12.entry.hints}
                audio={audio}
                onSolved={solve}
              />
            </>
          ) : (
            /* Место под ввод забронировано с первой секунды (§5.2): иначе при
               появлении ввода раскладка прыгает. 170 — высота ввода с подписью
               и клавиатурой, измерено. */
            <Slot mh={170} />
          )}
        </Col>
      </Cols>
    )}
  </Screen>
)

// ============================================================
// 13. ПЕРЕНОС. Карусель: время → доля оборота → угол.
// ============================================================
const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Karusel', 'Карусель', 'The carousel'),
  tag: 'obratnoe',
  motion: ['mount'],
  show: [
    [
      L("karusel to'liq aylanani 30 sekundda aylanadi", 'карусель делает полный оборот за 30 секунд', 'the carousel makes a full turn in 30 seconds'),
      L('bitta kabina belgilangan', 'одна кабина отмечена', 'one cabin is marked'),
    ],
  ],
  tasks: [
    {
      prompt: L(
        "Karusel to'liq aylanani 30 sekundda aylanadi. 5 sekundda burilgan burchakka nuqta qo'ying.",
        'Карусель делает полный оборот за 30 секунд. Поставь точку на угол, пройденный за 5 секунд.',
        'The carousel makes a full turn in 30 seconds. Place the point at the angle covered in 5 seconds.',
      ),
      snap: [60],
      ok: L(
        "Besh sekund bu aylananing oltidan biri, ya'ni pi uchdan.",
        'Пять секунд это шестая часть оборота, то есть пи третьих.',
        'Five seconds is one sixth of a turn, that is pi thirds.',
      ),
    },
  ],
  steps: ['5/30 = 1/6  →  π/3'],
  wrong: L(
    "Aylananing oltidan bir qismi kerak: 360 ni oltiga bo'ling.",
    'Нужна шестая часть оборота: раздели 360 на шесть.',
    'You need one sixth of a turn: divide 360 by six.',
  ),
  multi: {
    prompt: L(
      "Shu burchakni beradigan HAMMA yozuvni belgilang.",
      'Отметь все записи, задающие этот же угол.',
      'Mark every reading that gives the same angle.',
    ),
    items: [
      { id: 'a', label: '60°', ok: true },
      { id: 'b', label: 'π/3', ok: true },
      { id: 'c', label: '2π/6', ok: true },
      {
        id: 'd',
        label: 'π/6',
        hint: L("Bu o'ttiz gradus: ikki baravar kichik.", 'Это тридцать градусов: вдвое меньше.', 'That is thirty degrees: twice smaller.'),
      },
      {
        id: 'e',
        label: '120°',
        hint: L("Bu ikki pi uchdan: ikki baravar katta.", 'Это две пи третьих: вдвое больше.', 'That is two pi thirds: twice larger.'),
      },
    ],
    ok: L(
      "Uchtasi ham bitta burchak: yozuvi boshqa, o'lchovi o'sha.",
      'Все три — один угол: запись другая, величина та же.',
      'All three are one angle: different writing, same size.',
    ),
    title: L("Qaysi yozuvlar bir xil burchak beradi?", 'Какие записи задают один угол?', 'Which readings give the same angle?'),
  },
  audio: [
    A('mount', "Endi hayotdan. Karusel to'liq aylanani o'ttiz sekundda aylanadi.", 'Теперь из жизни. Карусель делает полный оборот за тридцать секунд.', 'Now from life. The carousel makes a full turn in thirty seconds.'),
    // Вторая реплика ОБЯЗАТЕЛЬНА: фаза раскрытия считается по репликам, и при
    // одной реплике она никогда не дойдёт до второго кадра — показ не уступит
    // место рабочему кругу, и экран станет непроходимым (поймано проверкой).
    A('work', "Endi nuqtani o'zingiz qo'ying: besh sekundda qancha burchak?", 'Теперь поставь точку сам: какой угол за пять секунд?', 'Now place the point yourself: what angle in five seconds?'),
  ],
}

const Screen13 = (p) => (
  <Screen data={S13} {...p}>
    {({ audio, phase, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    ) : stage === 0 && phase < 1 ? (
      /* Карусель крутится РОВНО с названной скоростью: полный оборот за 30 с,
         то есть 12 градусов в секунду. Метки пяти секунд нет — иначе ответ
         был бы выдан до действия. */
      <Scene fig={<Carousel secPerTurn={30} />} note={<NoteList items={S13.show[0]} />} />
    ) : (
      <PlaceAngle
        prompt={S13.tasks[0].prompt}
        targets={[60]}
        steps={S13.steps}
        okText={S13.tasks[0].ok}
        wrongText={S13.wrong}
        audio={audio}
        extra={{ arcLive: true, ticks: true }}
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
  tag: 'pi-kak-gradusy',
  angles: [45, 270, 180, RAD],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: 'π/4  →  ?°',
      done: 'π/4 = 45°',
      items: [
        { id: 'a', label: '45°', correct: true },
        { id: 'b', label: '90°', hint: L("Bu π/2.", 'Это π/2.', 'That is π/2.') },
        { id: 'c', label: '4°', hint: L("Maxraj burchakni bo'ladi, gradusni emas.", 'Знаменатель делит оборот, а не градус.', 'The denominator divides the turn, not one degree.') },
        { id: 'd', label: '180°', hint: L("Bu π ning o'zi.", 'Это само π.', 'That is pi itself.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: '270°  →  ? rad',
      done: '270° = 3π/2',
      items: [
        { id: 'a', label: '3π/2', correct: true },
        { id: 'b', label: '2π/3', hint: L("Bu 120 gradus.", 'Это 120 градусов.', 'That is 120 degrees.') },
        { id: 'c', label: '3π/4', hint: L("Bu 135 gradus.", 'Это 135 градусов.', 'That is 135 degrees.') },
        { id: 'd', label: '270π', hint: L("π/180 ga ko'paytirish kerak, π ga emas.", 'Умножать надо на π/180, а не на π.', 'You multiply by π/180, not by π.') },
      ],
    },
    {
      // СТРАТЕГИЯ (приём 4 класса): выбирается ПУТЬ, а не ответ. Два варианта
      // намеренно: квота на выбор из четырёх не расходуется.
      id: 'q3',
      ask: true,
      prompt: L("Radiandan gradusga o'tish uchun nimaga ko'paytiriladi?", 'На что умножить, чтобы из радиан получить градусы?', 'What do you multiply by to turn radians into degrees?'),
      done: 'α° = α_rad · 180/π',
      items: [
        {
          id: 'a',
          label: '180/π',
          correct: true,
          ok: L("Ha. Bir radian 57 gradusdan katta, ya'ni son O'SISHI kerak.", 'Да. Один радиан больше 57 градусов, значит число должно ВЫРАСТИ.', 'Yes. One radian is over 57 degrees, so the number must GROW.'),
        },
        {
          id: 'b',
          label: 'π/180',
          hint: L("Bu teskari yo'l: son kichrayib ketadi.", 'Это обратный путь: число станет меньше.', 'That is the reverse: the number would shrink.'),
        },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Bir radian 60 gradusdan katta yoki kichik?", 'Угол в один радиан больше или меньше 60 градусов?', 'Is an angle of one radian more or less than 60 degrees?'),
      done: '1 rad ≈ 57°',
      items: [
        { id: 'a', label: L('kichik', 'меньше', 'less'), correct: true },
        { id: 'b', label: L('katta', 'больше', 'more'), hint: L("Yoy vatardan uzun, shuning uchun uning oxiri beriroqda.", 'Дуга длиннее хорды, поэтому её конец ближе.', 'The arc is longer than the chord, so its end is closer.') },
        { id: 'c', label: L('teng', 'столько же', 'the same'), hint: L("Oltmish gradus bu vatar, radian esa yoy.", 'Шестьдесят градусов это хорда, а радиан это дуга.', 'Sixty degrees is the chord, a radian is the arc.') },
        { id: 'd', label: L("aniqlash mumkin emas", 'нельзя сказать', 'cannot be said'), hint: L("Mumkin: bir radian taxminan 57 gradus.", 'Можно: один радиан примерно 57 градусов.', 'You can: one radian is about 57 degrees.') },
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
        fig={(round) => (
          <Scene
            fig={(
              <UnitCircle
                angle={S14.angles[Math.min(round, S14.angles.length - 1)]}
                locked
                arc={{ to: S14.angles[Math.min(round, S14.angles.length - 1)], laid: round === 3 ? 1 : 0 }}
              />
            )}
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
  hookLabels: { a: 'π = 180', b: 'π ≈ 3,14', both: '?', none: '?' },
  proved: 'π ≈ 3,14',
  law: 'α_rad = α° · π/180',
  can: [
    L("Burchakni yoy uzunligi bilan o'lchayman", 'Измеряю угол длиной дуги', 'I measure an angle by arc length'),
    L("Gradusni radianga va orqaga o'tkazaman", 'Перевожу градусы в радианы и обратно', 'I convert degrees to radians and back'),
    L("π son ekanini bilaman, 180 emas", 'Знаю, что π это число, а не 180', 'I know pi is a number, not 180'),
    L("To'liq aylana 2π ekanini eslayman", 'Помню, что полный оборот это 2π', 'I remember a full turn is 2π'),
  ],
  levels: {
    full: L("Bu turdagi masalalar yopildi.", 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: o'tkazish yo'nalishi.", 'Одно место требует повтора: направление перевода.', 'One place needs review: the direction of the conversion.'),
    back: L("Qoidaga va 3-ekranga qayting.", 'Вернись к правилу и к экрану 3.', 'Go back to the rule and to screen 3.'),
  },
  bridge: L(
    "2-dars: o'sha nuqtaning koordinatalari. Yoy uzunligi emas, ikki son.",
    'Урок 2: координаты той же точки. Уже не длина дуги, а два числа.',
    'Lesson 2: the coordinates of that same point. Not arc length any more, but two numbers.',
  ),
  sheetTitle: L('Radianlar · shpargalka', 'Радианы · шпаргалка', 'Radians · cheat sheet'),
  sheetSrc: L('10-sinf · 1-dars', '10 класс · урок 1', 'Grade 10 · lesson 1'),
  lifehack: L(
    "π ni 180 gradus deb O'QING, lekin son deb ESLANG: uch butun o'n to'rt.",
    'Читай π как сто восемьдесят градусов, но помни как число: три целых четырнадцать.',
    'Read pi as one hundred eighty degrees, but remember it as a number: three point one four.',
  ),
  sheetSteps: [
    '2π = 360°,   π = 180°,   π/2 = 90°',
    'π/6 = 30°,   π/4 = 45°,   π/3 = 60°',
    'α_rad = α° · π/180',
    'α° = α_rad · 180/π',
    '1 rad ≈ 57°',
  ],
  audio: [
    A('mount', "Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.", 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Pi son bo'lib qoldi: to'liq aylanaga oltita radius va yana bir oz.", 'Пи стало числом: в полном обороте шесть радиусов и ещё немного.', 'Pi became a number: a full turn holds six radii and a little more.'),
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
