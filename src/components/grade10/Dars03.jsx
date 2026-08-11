// ============================================================================
// 10-sinf, Dars 3. TRIGONOMETRIK DOIRA.  (Тригонометрический круг)
//
// PILOT dars. Yig'ilishi 11-sinf pilotining qolipi bo'yicha (metodist qarori
// 2026-08-06): yuqori panel, bo'lim xaritasi, ikki ustun, halqa,
// chop etiladigan shpargalka. Bu faylda FAQAT MA'LUMOT bor.
//   yadro:   src/components/grade10/core.jsx
//   asboblar: src/components/grade10/tools.jsx
//   kontrakt: src/books/grade10/ETALON_10SINF.md
//
// 15 ekran: 1 xuk · 2 tayanch · 3-7 tushuntirish · 8 QOIDA · 9-13 mashq ·
// 14 blits (YAGONA baholanadigan) · 15 yakun.
//
// 2-8 da PASSIV ekran YO'Q: kadrlarni ovoz ochadi, lekin ekran o'quvchi
// qo'li bilan harakat qilmaguncha yopilmaydi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  BgCurves,
  Btn,
  Col,
  Cols,
  Expr,
  Fx,
  Insight,
  L,
  LangProvider,
  LangSetProvider,
  Panel,
  PrintSheet,
  RingProgress,
  STYLES,
  Slot,
  Stage,
  T,
  Tag,
  Title,
  configureLesson,
  tr,
  useAdvanceGate,
  useAudio,
  useMobileZoom,
  useNarratedSteps,
  useT,
} from './core.jsx'
import {
  AuditRows,
  BuildPoint,
  EquiFig,
  ExploreCircle,
  MatchPairs,
  MultiPick,
  NoteLine,
  NoteList,
  OrderRow,
  RightTriangleLimit,
  WheelBridge,
  NumberEntry,
  PlaceAngle,
  Probe,
  ProbeChain,
  ReachLimit,
  RuleGate,
  Scene,
  TableFill,
  UnitCircle,
} from './tools.jsx'

const LESSON_ID = 'alg_10_03'
const LESSON_TITLE = L('Trigonometrik doira', 'Тригонометрический круг', 'The unit circle')
const TOTAL = 15

// B1 bloki: 1-6-darslar, hozir 3-si. Manba: DARSLAR_REJASI_10SINF.md.
// `B1` LOTIN harfi bilan: UZ va EN ekranida kirill bo'lmasligi kerak.
const BLOCK = { label: 'B1', from: 1, to: 6, current: 3 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildAuto = (list, lang, waitFor = []) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: waitFor.indexOf(s.on) !== -1
      ? 'on_event:' + s.on
      : (i === 0 ? 'on_mount' : 'after_previous'),
    waits_for: null,
  }))

const textsOf = (list, lang) => list.map((s) => tr(s.text, lang))

const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  reading1: L('birinchi yozuv', 'первая запись', 'first reading'),
  reading2: L('ikkinchi yozuv', 'вторая запись', 'second reading'),
  predictToProved: L('Boshdagi taxmin → tekshirilgan javob', 'Прогноз в начале → проверенный ответ', 'Initial guess → verified answer'),
  learned: L("Nimani o'rgandingiz", 'Что ты узнал', 'What you learned'),
  readiness: L('Tayyorlik', 'Готовность', 'Readiness'),
  weakSpot: L('Takrorlash kerak', 'Требует повтора', 'Needs review'),
  bridge: L('Keyingi dars', 'Следующий урок', 'Next lesson'),
  lifehack: L(
    "Jadvalni yodlamang. Nuqtani qo'ying va ikki sonni o'qing: o'ngga qancha -- kosinus, yuqoriga qancha -- sinus.",
    'Не заучивай таблицу. Поставь точку и прочитай два числа: сколько вправо — косинус, сколько вверх — синус.',
    'Do not memorise the table. Place the point and read two numbers: how far right is cosine, how far up is sine.',
  ),
  sheetTitle: L('Trigonometrik doira · shpargalka', 'Тригонометрический круг · шпаргалка', 'The unit circle · cheat sheet'),
  sheetSrc: L('10-sinf · 3-dars', '10 класс · урок 3', 'Grade 10 · lesson 3'),
  // Ingliz varianti qisqa: brovkada o'ng tomonda blok xaritasi ham turadi,
  // uzun yozuv telefonda chap yozuvni («BLITZ») siqib qo'yardi.
  goesToResult: L('Natijaga kiradi', 'Идёт в результат', 'Counts to result'),
}

// ============================================================
// Umumiy ramka: sarlavha, bo'lim xaritasi, navigatsiya.
// ============================================================
function Frame({ meta, right, screen, audio, solved, onPrev, onNext, onFinish, finished, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = {
    // 1-4-sinf naqshi (metodist, 2026-08-11): yorliqda STRELKA bor, birinchi
    // ekranda tugma umuman chizilmaydi -- kulrang «bosilmaydigan» tugma emas,
    // shunchaki bo'sh joy.
    back: screen === 0 ? null : (
      <Btn tone="ghost" onClick={onPrev}>
        <span aria-hidden="true">{'←'}</span>{'  '}{t(UI.back)}
      </Btn>
    ),
    next: last ? (
      <Btn tone="accent" ready={!finished} onClick={onFinish} disabled={finished}>
        {finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={solved}>{t(UI.next)}</Btn>
    ),
  }
  return (
    <Stage eyebrow={t(meta.eyebrow)} right={right} block={BLOCK} screen={screen} total={TOTAL} audio={audio} nav={nav}>
      <Title>{t(meta.title)}</Title>
      {children}
    </Stage>
  )
}

// ============================================================
// 1. XUK. Ikki yozuv, bittasi to'g'ri. Baholanmaydi.
// ============================================================
const S1 = {
  eyebrow: L('TRIGONOMETRIK DOIRA', 'ТРИГОНОМЕТРИЧЕСКИЙ КРУГ', 'THE UNIT CIRCLE'),
  title: L('Qaysi yozuv shu nuqtani tasvirlaydi?', 'Какая запись описывает эту точку?', 'Which reading describes this point?'),
  expr: '60°  →  (?; ?)',
  rows: [
    { id: 'a', name: UI.reading1, value: '(1/2; √3/2)' },
    { id: 'b', name: UI.reading2, value: '(√3/2; 1/2)' },
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi uni aylananing o'zi bilan tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его самой окружностью.',
      'Your answer is saved. Now the circle itself will check it.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi oltmish gradus uchun nuqta qo'ydi va koordinatalarini o'qidi.", 'Двое учеников поставили точку для шестидесяти градусов и прочитали её координаты.', 'Two students marked the point for sixty degrees and read its coordinates.'),
    A('r1', 'Birinchi yozuv mana shu.', 'Вот первая запись.', 'Here is the first reading.'),
    A('r2', "Ikkinchisi esa mana shu. Sonlar bir xil, faqat o'rni almashgan.", 'А вот вторая. Числа те же, только местами.', 'And here is the second one. The same numbers, only swapped.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is correct? Just make a guess for now.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S1.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S1.audio, rest.lang))
  const [picked, setPicked] = useState(null)
  const open = Math.min(phase, S1.rows.length)

  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <Cols l={1} r={1}>
        <Col>
          <Tag tone="accent">{t(S1.eyebrow)}</Tag>
          <Expr size="hero" style={{ textAlign: 'left' }}>{S1.expr}</Expr>
          {phase >= 2 ? (
            <div className="g10-in">
              <Probe audio={audio} data={S1.probe} cols={2} fbSlot={52} noShuffle unscored dense
                onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen }) }} />
            </div>
          ) : null}
        </Col>
        <Col>
          {S1.rows.map((r, i) => (
            <Panel
              key={r.id}
              tone={i < open ? 'paper' : 'quiet'}
              className={i < open ? 'g10-reveal' : undefined}
              style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: i < open ? 1 : 0.32 }}
            >
              <Tag tone={i === 0 ? 'graph' : 'quiet'}>{t(r.name)}</Tag>
              <Expr size="big" style={{ textAlign: 'left' }}>{i < open ? r.value : '?'}</Expr>
            </Panel>
          ))}
          <Panel tone="quiet" style={{ padding: 4 }}>
            {/* Tanlov RASMDAN o'qilishi kerak: o'qlar podpisangan, proyeksiyalar
                chizilgan, sonlar esa javobdan KEYIN (metodist, 2026-08-07). */}
            <Scene fig={<UnitCircle angle={60} locked drop values={!!picked} />} max={172} h={172} />
          </Panel>
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// 2. TAYANCH. O'tgan ikki dars: radian = yoy uzunligi, kosinus = abssissa.
// Qo'l bilan: nuqtani RADIAN bo'yicha qo'yish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Uchburchakdan aylanaga', 'Из треугольника в окружность', 'From the triangle to the circle'),
  tag: 'support',
  prompts: [
    L("Nuqtani π/6 burchagiga qo'ying.", 'Поставь точку в угол π/6.', 'Place the point at π/6.'),
    L("Endi π/2 -- eng tepaga.", 'Теперь π/2 — в самый верх.', 'Now π/2, at the very top.'),
  ],
  steps: ['π/6 = 30°', 'π/2 = 90°'],
  // Daftar ustuni: har kadrda o'sib boradigan chiqarish. Formula CHIZMADA
  // takrorlanmaydi -- qolgan slaydlardagi naqsh bilan bir xil.
  // Chiqarish TO'LIQ ko'rinadi: har qadamda satr qo'shiladi, oldingilari
  // joyida qoladi. O'rniga qo'yish qadami (a / 1, b / 1) ham yozilgan -- aks
  // holda «a / c» dan «a» ga sakrash sehr bo'lib qoladi.
  // `ok: true` -- chiqarilgan XULOSA, u yashil bo'ladi.
  // Satr SO'Z bilan bo'lsa uchala tilda beriladi; formula bir xil qoladi.
  notes: [
    [L('balandlik = sin α', 'высота = sin α', 'height = sin α')],
    ['sin α = a / c'],
    ['sin α = a / c', 'c = 1', 'sin α = a / 1'],
    ['sin α = a / c', 'c = 1', 'sin α = a / 1', { v: 'sin α = a', ok: true }],
    // Yashil rang -- SHU kadrning xulosasi. Oldingi kadrda chiqarilgan
    // `sin α = a` bu yerda oddiy satrga aylanadi: u endi tayanch, xulosa emas.
    ['sin α = a', 'cos α = b / c', 'cos α = b / 1', { v: 'cos α = b', ok: true }],
    [
      'cos α = b',
      'sin α = a',
      {
        v: L('nuqta = (cos α; sin α)', 'точка = (cos α; sin α)', 'point = (cos α; sin α)'),
        ok: true,
      },
    ],
  ],
  wrong: L("Bu boshqa burchak. π butun yarim aylana.", 'Это другой угол. π — половина окружности.', 'That is a different angle. π is half the circle.'),
  ok: L("Radian -- yoy uzunligi, gradus emas.", 'Радиан — это длина дуги, а не градус.', 'A radian is an arc length, not a degree.'),
  // Kadrlar: 0 charx (hayotiy kontekst, darslik 133-bet), 1-3 ko'prik
  // (8-9-sinf ta'rifidan aylanaga), 4 -- o'quvchining ishi.
  audio: [
    A('mount', "Charx kabinasi ko'tarilmoqda. Uning markazdan balandligi -- burilish burchagining sinusi.", 'Кабинка колеса обозрения поднимается. Её высота над серединой — это и есть синус угла поворота.', 'The Ferris wheel cabin rises. Its height above the centre is the sine of the turn angle.'),
    A('next', "Sakkizinchi sinfda sinus NISBAT edi: burchak qarshisidagi katet bo'linadi gipotenuzaga.", 'В восьмом классе синус был отношением: катет против угла делить на гипотенузу.', 'In grade eight the sine was a ratio: the opposite leg over the hypotenuse.'),
    A('next', "Uchburchakni shunday kichraytiramizki, gipotenuza birga aylansin. Maxraj yo'qoldi.", 'Сожмём треугольник так, чтобы гипотенуза стала единицей. Знаменатель исчез.', 'Shrink the triangle so the hypotenuse becomes one. The denominator is gone.'),
    A('next', "Sinus shunchaki nuqtaning balandligi bo'lib qoldi. Ta'rif YANGI emas -- radiusi bir bo'lgan o'sha ta'rif.", 'Синус стал просто высотой точки. Определение не новое — это то же самое, с радиусом единица.', 'The sine is simply the height of the point. The definition is not new: it is the same one, with radius one.'),
    A('next', "O'sha uchburchak. Endi asos bo'ylab qaraymiz. Kosinus yondosh katet, u yana o'sha birga bo'linadi, shuning uchun kosinus asosning o'ziga teng.", 'Тот же треугольник. Теперь смотрим вдоль основания. Косинус это прилежащий катет, делённый на ту же единицу, поэтому косинус равен самому основанию.', 'The same triangle. Now look along the base. The cosine is the adjacent leg over that same one, so the cosine equals the base itself.'),
    A('next', "Ikki son tayyor. Aylanadagi nuqta doim juftlik bilan yoziladi. Avval kosinus, keyin sinus.", 'Два числа готовы. Точка на окружности всегда записывается парой. Сначала косинус, потом синус.', 'Two numbers are ready. A point on the circle is always written as a pair. Cosine first, then sine.'),
    A('next', "Endi nuqtani o'zingiz qo'ying. Radian -- yoy uzunligi, gradus emas.", 'Теперь поставь точку сам. Радиан — это длина дуги, а не градус.', 'Now place the point yourself. A radian is an arc length, not a degree.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S2.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S2} screen={screen} audio={audio} solved={solved} {...rest}>
      {phase < S2.notes.length ? (
        <Scene
          fig={<WheelBridge step={phase} />}
          note={<NoteList items={S2.notes[phase]} />}
        />
      ) : (
        <PlaceAngle
          prompt={S2.prompts}
          targets={[30, 90]}
          steps={S2.steps}
          okText={S2.ok}
          wrongText={S2.wrong}
          audio={audio}
          extra={{ marks: [{ deg: 0, tone: T.ink3, label: '0' }], meaning: true }}
          onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S2.tag }) }}
        />
      )}
    </Frame>
  )
}

// ============================================================
// 3. TUSHUNTIRISH 1. Radius birga teng: hisoblagichni uzishga urinish.
// ============================================================
const S3 = {
  eyebrow: L('KASHFIYOT', 'ОТКРЫТИЕ', 'DISCOVERY'),
  title: L('Hisoblagichni birdan uzib bo‘ladimi?', 'Можно ли увести счётчик с единицы?', 'Can the counter leave one?'),
  tag: 'bolshe-odnogo',
  prompt: L("Nuqtani aylana bo'ylab yurgizing va hisoblagichga qarang.",
    'Проведи точку по окружности и следи за счётчиком.',
    'Drag the point around the circle and watch the counter.'),
  notes: ['x² + y² = 1', '−1 ≤ cos α ≤ 1', '−1 ≤ sin α ≤ 1'],
  ok: L("Uzilmadi. Nuqta radiusi birga teng aylanada, demak koordinata birdan uzun bo'lolmaydi.",
    'Не уводится. Точка на окружности радиуса один, значит координата не бывает длиннее единицы.',
    'It does not move. The point is on a circle of radius one, so no coordinate can exceed one.'),
  // KO'RSATISH qismi: hisoblagich nega qimirlamasligi ISBOTLANADI, keyin
  // o'quvchi buni qo'li bilan tekshiradi. Avval isbot yo'q edi -- hisoblagich
  // qora quti bo'lib turardi va «radius shunday» degan javob berilardi.
  show: [
    ['b = cos α', 'a = sin α', 'c = 1'],
    ['b = cos α', 'a = sin α', 'c = 1', 'b² + a² = c²'],
    [
      'b² + a² = c²',
      'b² + a² = 1²',
      { v: 'cos²α + sin²α = 1', ok: true },
    ],
  ],
  audio: [
    A('mount', "O'sha uchburchakka qaytamiz. Katetlari kosinus bilan sinus, gipotenuzasi esa radius, ya'ni bir.", 'Вернёмся к тому же треугольнику. Его катеты это косинус и синус, а гипотенуза это радиус, то есть единица.', 'Back to the same triangle. Its legs are the cosine and the sine, and its hypotenuse is the radius, that is one.'),
    A('next', "Uchburchak to'g'ri burchakli, demak Pifagor teoremasi ishlaydi: katetlar kvadratlarining yig'indisi gipotenuza kvadratiga teng.", 'Треугольник прямоугольный, значит работает теорема Пифагора: сумма квадратов катетов равна квадрату гипотенузы.', 'The triangle is right angled, so the Pythagorean theorem works: the squares of the legs add up to the square of the hypotenuse.'),
    A('next', "O'rniga qo'yamiz. Bir kvadrati bir. Shunday qilib kosinus kvadrati qo'shiladi sinus kvadrati doim birga teng.", 'Подставим. Единица в квадрате это единица. Так и получается: квадрат косинуса плюс квадрат синуса всегда равен единице.', 'Substitute. One squared is one. That gives it: the square of the cosine plus the square of the sine is always one.'),
    A('next', "Endi buni qo'lingiz bilan tekshiring. Nuqtani turli choraklarga olib boring va hisoblagichga qarang.", 'Теперь проверь это руками. Проведи точку по разным четвертям и следи за счётчиком.', 'Now check it by hand. Drag the point through different quadrants and watch the counter.'),
    A('next', "Koordinatalar o'zgaradi, hisoblagich esa qimirlamaydi. Sababini hozirgina chiqardik.", 'Координаты меняются, а счётчик не двигается. Причину мы только что вывели.', 'The coordinates change but the counter does not move. We have just derived the reason.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S3.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  if (phase < S3.show.length && !solved) {
    return (
      <Frame meta={S3} screen={screen} audio={audio} solved={false} {...rest}>
        {/* Chizma har kadrda ISHLAYDI: 5 -- o'sha uchburchak, 6 -- katetlar
            va gipotenuza ustida kvadratlar, 7 -- o'rniga qo'yish (c² -> 1²).
            Avval bu yerda step=5 muzlab turardi va Pifagor faqat o'ng
            ustunda yozilardi (metodist, 2026-08-11). */}
        <Scene fig={<WheelBridge step={5 + phase} />} note={<NoteList items={S3.show[phase]} />} />
      </Frame>
    )
  }
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={solved} {...rest}>
      <ExploreCircle
        prompt={S3.prompt}
        need={3}
        notes={S3.notes}
        okText={S3.ok}
        audio={audio}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S3.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 4. TUSHUNTIRISH 2. O'xshash, lekin bu emas: burchakning yarmi
// koordinataning yarmi EMAS.
// ============================================================
const S4 = {
  eyebrow: L('CHIQARAMIZ', 'ВЫВОДИМ', 'DERIVING'),
  title: L('Burchak yarmi — koordinata yarmimi?', 'Половина угла — половина координаты?', 'Half the angle, half the coordinate?'),
  tag: 'oba-rastut',
  prompt: L("Nuqtani o'qlar orasining aynan o'rtasiga qo'ying.",
    'Поставь точку ровно посередине между осями.',
    'Place the point exactly midway between the axes.'),
  steps: ['x = y', 'x² + x² = 1', '2x² = 1', 'x = √2/2 ≈ 0,71'],
  wrong: L("Hali o'rtasi emas: o'ngga va yuqoriga har xil masofa.", 'Это ещё не середина: вправо и вверх отложено по-разному.', 'Not the middle yet: the distances right and up differ.'),
  ok: L("Ikkala koordinata teng, lekin ular yarim emas.", 'Обе координаты равны, но они не одна вторая.', 'Both coordinates are equal, but they are not one half.'),
  insight: L(
    "Yarim burchak yarim koordinata bermaydi: nol butun yetmish bir chiqdi, nol butun besh emas.",
    'Половина угла не даёт половину координаты: получилось 0,71, а не 0,5.',
    'Half the angle does not give half the coordinate: we got 0.71, not 0.5.',
  ),
  // KO'RSATISH: taxmin hozirgina chiqarilgan ayniyat bilan TEKSHIRILADI va
  // rad etiladi. To'g'ri javob aytilmaydi -- uni o'quvchining o'zi topadi.
  // Shu sababli issiq rangdagi satrlar (`bad`) -- ular yozuv emas, taxmin.
  show: [
    [{ v: L('taxmin: cos 45° = 1/2', 'догадка: cos 45° = 1/2', 'guess: cos 45° = 1/2'), bad: true },
      { v: L('taxmin: sin 45° = 1/2', 'догадка: sin 45° = 1/2', 'guess: sin 45° = 1/2'), bad: true }],
    [{ v: L('taxmin: cos 45° = sin 45° = 1/2', 'догадка: cos 45° = sin 45° = 1/2', 'guess: cos 45° = sin 45° = 1/2'), bad: true },
      '(1/2)² + (1/2)² = 1/4 + 1/4',
      '= 1/2'],
    [{ v: L('taxmin: cos 45° = sin 45° = 1/2', 'догадка: cos 45° = sin 45° = 1/2', 'guess: cos 45° = sin 45° = 1/2'), bad: true },
      '(1/2)² + (1/2)² = 1/2',
      { v: '1/2 ≠ 1', bad: true }],
  ],
  audio: [
    A('mount', "Ko'pchilik bu yerda bir ikkidanni kutadi: burchak yarmi, demak koordinata ham yarmi.", 'Многие ждут здесь одну вторую: угол пополам, значит и координата пополам.', 'Many expect one half here: half the angle, so half the coordinate.'),
    A('next', "Taxminni tekshirib ko'ramiz. O'tgan ekrandagi qoida bo'yicha kvadratlarni qo'shamiz: chorak qo'shiladi chorak, ya'ni bir ikkidan.", 'Проверим догадку. По правилу с прошлого экрана сложим квадраты: одна четвёртая плюс одна четвёртая, то есть одна вторая.', 'Let us test the guess. By the rule from the previous screen we add the squares: one quarter plus one quarter, that is one half.'),
    A('next', "Bir ikkidan chiqdi, bir kerak edi. Demak bir ikkidan bu yerda bo'lolmaydi. To'g'ri sonni o'zingiz topasiz.", 'Получилась одна вторая, а нужна единица. Значит одна вторая здесь невозможна. Верное число ты найдёшь сам.', 'We got one half, but we need one. So one half is impossible here. You will find the right number yourself.'),
    A('next', "Nuqtani o'qlar orasining aynan o'rtasiga qo'ying va sonni ko'ring.", 'Поставь точку ровно посередине между осями и посмотри на число.', 'Place the point exactly midway between the axes and look at the number.'),
    A('next', "Ikkala koordinata teng, demak kvadratlar yig'indisi ikkilangan kvadrat. Nol butun yetmish bir chiqdi.", 'Обе координаты равны, значит сумма квадратов это удвоенный квадрат. Получилось ноль целых семьдесят одна.', 'Both coordinates are equal, so the sum of squares is twice one square. We got zero point seven one.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S4.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  if (phase < S4.show.length && !solved) {
    return (
      <Frame meta={S4} screen={screen} audio={audio} solved={false} {...rest}>
        {/* Taxmin CHIZMADA turadi: (1/2; 1/2) nuqtasi bissektrisada, lekin
            aylanaga yetmaydi -- rad etish ko'z bilan ko'rinadi, faqat
            ustundagi arifmetika bilan emas (metodist, 2026-08-11). */}
        <Scene
          fig={(
            <UnitCircle
              angle={null} bisector locked ticks
              ghost={{ x: 0.5, y: 0.5, drop: true, label: '(1/2; 1/2)' }}
            />
          )}
          note={<NoteList items={S4.show[phase]} />}
        />
      </Frame>
    )
  }
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={solved} {...rest}>
      <PlaceAngle
        prompt={S4.prompt}
        targets={[45]}
        steps={S4.steps}
        okText={S4.ok}
        wrongText={S4.wrong}
        audio={audio}
        extra={{ bisector: true }}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S4.tag }) }}
      />
      <Slot mh={46}>
        {solved ? <Insight label="≠">{t(S4.insight)}</Insight> : null}
      </Slot>
    </Frame>
  )
}

// ============================================================
// 5. TUSHUNTIRISH 3. O'sha g'oyaning ikkinchi ko'rinishi: 30 va 60.
// ============================================================
const S5 = {
  eyebrow: L('AKS ETTIRAMIZ', 'ОТРАЖАЕМ', 'REFLECTING'),
  title: L('O‘ttiz va oltmish: o‘sha ikki son', 'Тридцать и шестьдесят: те же два числа', 'Thirty and sixty: the same two numbers'),
  tag: 'koordinaty-mestami',
  prompts: [
    L("Avval nuqtani 30° ga qo'ying.", 'Сначала поставь точку на 30°.', 'First place the point at 30°.'),
    L("Endi uni bissektrisadan aks ettiring: 60° ga oling.", 'Теперь отрази её через биссектрису: переведи на 60°.', 'Now reflect it in the bisector: move it to 60°.'),
  ],
  steps: ['30° → (√3/2; 1/2)', '60° → (1/2; √3/2)'],
  wrong: L("Bu boshqa burchak. Aks ettirishda 30 oltmishga o'tadi.", 'Это другой угол. При отражении тридцать переходит в шестьдесят.', 'That is a different angle. Reflection sends thirty to sixty.'),
  ok: L("Sonlar o'sha, faqat o'rni almashdi.", 'Числа те же, только поменялись местами.', 'The same numbers, only swapped.'),
  // «Kosinus -- to'ldiruvchining sinusi»: 30 va 60 nega o'rin almashishining
  // SABABI, bezak emas (metodist qarori 2026-08-07).
  complement: L(
    "cos α = sin(90° − α). Kosinus -- to'ldiruvchi burchakning sinusi, shuning uchun 30 va 60 o'rin almashadi.",
    'cos α = sin(90° − α). Косинус — это синус дополнения, поэтому 30 и 60 меняются местами.',
    'cos α = sin(90° − α). The cosine is the sine of the complement, which is why 30 and 60 swap.',
  ),
  // KO'RSATISH: teng tomonli uchburchakdan `√3/2` QAYERDAN kelishi
  // chiqariladi. Avval bu faqat ovozda edi, ekranda esa rasm turardi.
  show: [
    [L('tomoni 1 bo‘lgan teng tomonli uchburchak', 'равносторонний треугольник со стороной 1', 'equilateral triangle with side 1'),
      L('h asosni teng ikkiga bo‘ladi', 'h делит основание пополам', 'h splits the base in half'),
      '1/2 + 1/2 = 1'],
    [L('tomoni 1 bo‘lgan teng tomonli uchburchak', 'равносторонний треугольник со стороной 1', 'equilateral triangle with side 1'),
      'h² + (1/2)² = 1²',
      'h² = 1 − 1/4 = 3/4',
      { v: 'h = √3/2', ok: true }],
  ],
  audio: [
    A('mount', "Bir ikkidan va uchdan ildizning yarmi qayerdan keladi? Tomoni bir bo'lgan teng tomonli uchburchakdan: balandlik uni ikkiga bo'ladi.", 'Откуда берутся одна вторая и корень из трёх пополам? Из равностороннего треугольника со стороной один: высота делит его пополам.', 'Where do one half and root three over two come from? From an equilateral triangle with side one: the height cuts it in half.'),
    A('next', "Balandlikni Pifagor bo'yicha topamiz: bir ayirilsin chorak, uchdan to'rt qoladi. Ildiz olsak, uchdan ildizning yarmi chiqadi.", 'Высоту находим по Пифагору: единица минус одна четвёртая, остаётся три четвёртых. Извлекаем корень и получаем корень из трёх пополам.', 'We find the height by Pythagoras: one minus one quarter leaves three quarters. Take the root and get root three over two.'),
    A('next', "Nuqtani o'zingiz qo'ying.", 'Поставь точку сам.', 'Place the point yourself.'),
    A('next', "Endi uni bissektrisadan aks ettiring va ikki qatorni solishtiring.", 'Теперь отрази её через биссектрису и сравни две строки.', 'Now reflect it in the bisector and compare the two lines.'),
    A('done', "Sabab nomida: kosinus -- to'ldiruvchi burchakning sinusi. O'ttiz va oltmish to'qsongacha to'ldiradi, shuning uchun sonlar o'rin almashadi.", 'Причина в самом названии: косинус — это синус дополнения. Тридцать и шестьдесят дополняют друг друга до девяноста, поэтому числа меняются местами.', 'The reason is in the name: cosine is the sine of the complement. Thirty and sixty complete each other to ninety, so the numbers swap.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S5.audio, rest.lang, ['done']), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S5.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={solved} {...rest}>
      {phase < S5.show.length && !solved ? (
        /* `√3/2` chizmada FAQAT chiqarilgandan keyin paydo bo'ladi: birinchi
           kadrda balandlik `h` deb turadi (metodist, 2026-08-11). */
        <Scene fig={<EquiFig step={phase} />} note={<NoteList items={S5.show[phase]} />} />
      ) : (
        <PlaceAngle
          prompt={S5.prompts}
          targets={[30, 60]}
          steps={S5.steps}
          okText={S5.ok}
          wrongText={S5.wrong}
          audio={audio}
          extra={{ bisector: true, values: true, meaning: true }}
          onSolved={(r) => { setSolved(true); audio.step('done'); onAnswer({ ...r, screen, tag: S5.tag }) }}
        />
      )}
      <Slot mh={44}>
        {solved ? <Insight label="=">{t(S5.complement)}</Insight> : null}
      </Slot>
    </Frame>
  )
}

// ============================================================
// 6. TUSHUNTIRISH 4. O'zi, yangi holatda: to'rtta o'q nuqtasi.
// ============================================================
const S6 = {
  eyebrow: L("O'Q BURCHAKLARI", 'ОСЕВЫЕ УГЛЫ', 'AXIS ANGLES'),
  title: L('Uchburchak tugadi, nuqta esa yuradi', 'Треугольник кончился. Точка едет дальше', 'The triangle ends. The point keeps going'),
  tag: 'osevoy-po-sosedu',
  prompts: [
    L("Nuqtani o'ngga, 0° ga qo'ying.", 'Поставь точку справа, в 0°.', 'Place the point on the right, at 0°.'),
    L('Endi eng tepaga.', 'Теперь в самый верх.', 'Now at the very top.'),
    L('Va pastga.', 'И вниз.', 'And down.'),
  ],
  steps: ['cos 0 = 1,  sin 0 = 0', 'cos 90° = 0,  sin 90° = 1', 'cos 270° = 0,  sin 270° = −1'],
  // NAMUNA: eng chap nuqta oxirigacha o'qib beriladi. Qolgan uchtasi
  // o'quvchida -- shuning uchun namuna aynan ULARDAN BIRI EMAS.
  show: [
    null,
    null,
    [L('eng chap nuqta', 'самая левая точка', 'the leftmost point'),
      L('o‘ngga siljish: butun radius, chapga', 'сдвиг вправо: целый радиус, влево', 'shift right: a whole radius, to the left'),
      'cos 180° = −1',
      { v: 'sin 180° = 0', ok: true }],
  ],
  wrong: L("Bu o'qda emas. O'q nuqtalarida bitta koordinata nolga teng.", 'Это не на оси. У осевых точек одна координата равна нулю.', 'That is not on an axis. At axis points one coordinate is zero.'),
  ok: L("To'rttasini yod olish shart emas: nuqta qayerda turganini ko'rish kifoya.", 'Все четыре помнить не нужно: достаточно видеть, где стоит точка.', 'You do not need all four by heart: it is enough to see where the point is.'),
  // Kadr 0-1: NEGA aylana kerak. Uchburchak ta'rifi 90° da tugaydi, nuqta esa
  // yuradi. Shusiz o'q burchaklari sababsiz fakt bo'lib qolardi.
  audio: [
    A('mount', "Uchburchakdan olingan ta'rif to'qson gradusgacha ishlaydi: to'g'ri burchakli uchburchakda o'tkir burchak to'g'ridan kichik.", 'Определение из треугольника работает только до девяноста градусов: в прямоугольном треугольнике острый угол меньше прямого.', 'The triangle definition works only up to ninety degrees: in a right triangle the acute angle is smaller than the right one.'),
    A('next', "Nuqtaga esa hech narsa xalaqit bermaydi -- mana yuz yigirma gradus. Balandligi bor, uchburchagi yo'q. Aylana shuning uchun kerak.", 'А точке ничто не мешает уехать дальше — вот сто двадцать градусов. Высота у неё есть, а треугольника нет. Вот зачем понадобилась окружность.', 'But nothing stops the point from going further: here is one hundred twenty degrees. It has a height but no triangle. That is why the circle is needed.'),
    A('next', "Bitta o'q nuqtasini birga o'qiymiz. Eng chap nuqta: o'ngga siljish butun radiusga teng, faqat chapga qarab. Demak kosinus minus bir, balandlik esa nol.", 'Одну осевую точку прочитаем вместе. Самая левая: сдвиг вправо равен целому радиусу, только влево. Значит косинус минус один, а высота ноль.', 'Let us read one axis point together. The leftmost one: the shift right equals a whole radius, only leftwards. So the cosine is minus one and the height is zero.'),
    A('next', "Qolgan uchtasini o'zingiz aylanib chiqasiz. Har bir nuqtada bitta koordinata nolga, ikkinchisi birga teng.", 'Остальные три обойдёшь сам. В каждой точке одна координата равна нулю, вторая единице.', 'You will walk through the other three yourself. At each point one coordinate is zero and the other is one.'),
    A('next', "Pastda sinus minus bir. Ishorani nuqta qayerda turganidan ko'rasiz.", 'Внизу синус минус один. Знак видно по тому, где стоит точка.', 'At the bottom the sine is minus one. The sign follows from where the point stands.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S6.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  if (phase < S6.show.length && !solved) {
    return (
      <Frame meta={S6} screen={screen} audio={audio} solved={false} {...rest}>
        {S6.show[phase] ? (
          <Scene
            fig={<UnitCircle angle={180} values locked />}
            note={<NoteList items={S6.show[phase]} />}
          />
        ) : (
          <Scene fig={<RightTriangleLimit step={phase} />} />
        )}
      </Frame>
    )
  }
  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={solved} {...rest}>
      <PlaceAngle
        prompt={S6.prompts}
        targets={[0, 90, 270]}
        steps={S6.steps}
        okText={S6.ok}
        wrongText={S6.wrong}
        audio={audio}
        extra={{ values: true }}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S6.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 7. TUSHUNTIRISH 5. Chegaraviy hol: SON bilan tekshirish.
// ============================================================
const S7 = {
  eyebrow: L("BO'LISHI MUMKIN EMAS", 'ЧЕГО НЕ БЫВАЕТ', 'WHAT CANNOT HAPPEN'),
  title: L('sin α = 1,2 bo‘la oladimi?', 'Может ли sin α = 1,2?', 'Can sin α = 1.2?'),
  tag: 'bolshe-odnogo',
  prompt: L("Nuqtani shunday ko'taringki, sinus 1,2 bo'lsin.",
    'Подними точку так, чтобы синус стал 1,2.',
    'Raise the point so that the sine becomes 1.2.'),
  tryText: L("Eng baland nuqtada ham sinus birga teng. Aylanadan yuqorisi yo'q.",
    'Даже в самой высокой точке синус равен единице. Выше окружности ничего нет.',
    'Even at the highest point the sine is one. There is nothing above the circle.'),
  entry: {
    prompt: L('Hisoblang: 1 − 1,44', 'Посчитай: 1 − 1,44', 'Compute: 1 − 1,44'),
    answer: -0.44,
    hints: [
      L("Birdan katta sonni ayirdik. Ishora qanday?", 'Вычли число больше единицы. Какой знак?', 'We subtracted more than one. What sign?'),
      L("Nol butun qirq to'rt qoladi, ishorasi bilan.", 'Останется ноль целых сорок четыре, со знаком.', 'Zero point four four remains, with a sign.'),
      L("Manfiy nol butun qirq to'rt.", 'Минус ноль целых сорок четыре.', 'Minus zero point four four.'),
    ],
  },
  ok: L("Kvadrat manfiy bo'lmaydi — bunday burchak yo'q.",
    'Квадрат не бывает отрицательным — такого угла нет.',
    'A square is never negative, so there is no such angle.'),
  // KO'RSATISH: tekshirish USULI ISHLAYDIGAN son ustida ko'rsatiladi.
  // Shundan keyin o'quvchi o'sha usulni ishlamaydigan songa qo'llaydi --
  // ya'ni javob emas, YO'L beriladi.
  //
  // Kadrlar TARTIBI: avval yozuv, keyin usul, keyin topshiriq. Avval nol-kadr
  // bo'sh edi (`null`) va o'quvchi ishchi asbobni birinchi kadrda olardi,
  // ikkinchi kadrda esa asbob ko'rsatishga ALMASHARDI: urinishlar yo'qolardi
  // (metodist, 2026-08-11).
  show: [
    [{ v: L("yozuv: sin α = 1,2", 'запись: sin α = 1,2', 'record: sin α = 1,2'), bad: true }],
    ['sin α = 0,6',
      'cos²α = 1 − 0,36',
      'cos²α = 0,64',
      { v: 'cos α = ± 0,8', ok: true }],
  ],
  audio: [
    A('mount', "Kimdir sinus bir butun ikkidan teng deb yozdi. Buni o'zingiz tekshiring.", 'Кто-то написал, что синус равен одной целой двум десятым. Проверь это сам.', 'Someone wrote that the sine equals one point two. Check it yourself.'),
    A('next', "Avval usulni ishlaydigan son ustida ko'rsataman. Sinus nol butun oltidan bo'lsin. Kosinus kvadrati birdan nol butun o'ttiz olti ayirilgani, ya'ni nol butun oltmish to'rt. Bunday kosinus bor.", 'Сначала покажу способ на числе, которое подходит. Пусть синус ноль целых шесть. Квадрат косинуса это единица минус ноль целых тридцать шесть, то есть ноль целых шестьдесят четыре. Такой косинус есть.', 'First the method on a number that works. Let the sine be zero point six. The square of the cosine is one minus zero point three six, that is zero point six four. Such a cosine exists.'),
    A('next', "Nuqtani ko'tarib ko'ring.", 'Попробуй поднять точку.', 'Try to raise the point.'),
    A('next', "Endi shu yozuv bo'yicha nuqta qo'yaman: u aylanadan yuqorida qoldi. Kosinusning kvadratini o'zingiz hisoblang.", 'Теперь я ставлю точку по этой записи: она осталась выше окружности. Посчитай квадрат косинуса сам.', 'Now I place the point from that reading: it stayed above the circle. Compute the square of the cosine yourself.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(S7.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  if (phase < S7.show.length && !solved) {
    return (
      <Frame meta={S7} screen={screen} audio={audio} solved={false} {...rest}>
        {/* Nol-kadr: asbob O'CHIQ (shkala bor, ko'rsatkich yo'q) -- tekshirilishi
            kerak bo'lgan yozuv o'qiladi. Nuqtani bu yerda ko'rsatib bo'lmaydi:
            u javobni harakatdan oldin berib qo'yardi. */}
        <Scene
          fig={phase === 0
            ? <UnitCircle angle={null} locked ticks />
            : <UnitCircle angle={37} chord={{ y: 0.6, dots: false }} locked />}
          note={<NoteList items={S7.show[phase]} />}
        />
      </Frame>
    )
  }
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={solved} {...rest}>
      <ReachLimit
        prompt={S7.prompt}
        tryText={S7.tryText}
        entry={S7.entry}
        okText={S7.ok}
        audio={audio}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S7.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 8. QOIDA. Kartochka FARQLASH savolidan keyin ochiladi.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Nuqtaning koordinatalari', 'Координаты точки', 'The coordinates of the point'),
  tag: 'koordinaty-mestami',
  probe: {
    question: L('60° nuqtasining koordinatalari qaysi?', 'Какие координаты у точки 60°?', 'Which coordinates belong to the point 60°?'),
    items: [
      { id: 'a', label: '(1/2; √3/2)', correct: true },
      { id: 'b', label: '(√3/2; 1/2)', hint: L("Bu 30°: u yerda nuqta pastroq.", 'Это 30°: там точка ниже.', 'That is 30°: the point sits lower.') },
      { id: 'c', label: '(1/2; 1/2)', hint: L("Teng koordinatalar faqat bissektrisada, ya'ni 45° da.", 'Равные координаты только на биссектрисе, то есть при 45°.', 'Equal coordinates occur only on the bisector, at 45°.') },
      { id: 'd', label: '(√3/2; √3/2)', hint: L("Kvadratlarni qo'shing: bir yarim chiqadi, bir emas.", 'Сложи квадраты: получится полтора, а не единица.', 'Add the squares: you get one and a half, not one.') },
    ],
  },
  rule: {
    badge: L('QOIDA', 'ПРАВИЛО', 'RULE'),
    lawLabel: L('Asosiy ayniyat', 'Основное тождество', 'The fundamental identity'),
    law: 'cos²α + sin²α = 1',
    lines: [
      L('Birlik aylanadagi α burchak nuqtasiga (cos α; sin α) koordinatalar mos keladi.',
        'Точке угла α на единичной окружности отвечают координаты (cos α; sin α).',
        'The point of angle α on the unit circle has coordinates (cos α; sin α).'),
      L("Shuning uchun ikkala qiymat ham −1 dan 1 gacha yotadi.",
        'Поэтому оба значения лежат от −1 до 1.',
        'So both values lie between −1 and 1.'),
      L("π/6, π/4, π/3 uchun qiymatlar — uchta nuqtaning koordinatalari, yodlash ro'yxati emas.",
        'Значения для π/6, π/4, π/3 — это координаты трёх точек, а не список для заучивания.',
        'The values for π/6, π/4, π/3 are the coordinates of three points, not a list to memorise.'),
    ],
    // Darslik havolasi EKRANDAN olib tashlandi (metodist 2026-08-07):
    // manba hujjatda turadi, o'quvchiga bet raqami kerak emas.
  },
  audio: [
    A('mount', "Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.", 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Koordinatalar — kosinus va sinus, aynan shu tartibda. Kvadratlari yig'indisi esa doim birga teng.", 'Координаты — это косинус и синус, именно в таком порядке. А сумма их квадратов всегда равна единице.', 'The coordinates are the cosine and the sine, in that order. And the sum of their squares is always one.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S8.audio, rest.lang, ['rule']), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1} r={1.05}>
        <Col>
          <Scene fig={<UnitCircle angle={60} marks={[{ deg: 30, tone: T.graph, label: '30°' }]} locked values={solved} />} max={330} />
        </Col>
        <Col>
          <RuleGate
            probe={S8.probe}
            rule={S8.rule}
            audio={audio}
            onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S8.tag }) }}
          />
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// 9. MASHQ 1. Uch burchak jadvali: har qator RADIUS bilan tekshiriladi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uch burchak jadvali', 'Таблица трёх углов', 'The table of three angles'),
  tag: 'koordinaty-mestami',
  rows: [
    { deg: 30, label: 'π/6', cos: 'r3', sin: 'h' },
    { deg: 45, label: 'π/4', cos: 'r2', sin: 'r2' },
    { deg: 60, label: 'π/3', cos: 'h', sin: 'r3' },
  ],
  chips: [
    { id: 'h', label: '1/2', value: 0.5 },
    { id: 'r2', label: '√2/2', value: Math.SQRT2 / 2 },
    { id: 'r3', label: '√3/2', value: Math.sqrt(3) / 2 },
    { id: 'one', label: '1', value: 1 },
    { id: 'zero', label: '0', value: 0 },
  ],
  okText: L("Uchala nuqta ham aylanada. Jadval o'zi yig'ildi.", 'Все три точки на окружности. Таблица собралась сама.', 'All three points lie on the circle. The table built itself.'),
  wrongNote: L("Sonlaringiz bo'yicha nuqta qo'ydim: u aylanadan chiqib ketdi.", 'Ставлю точку по твоим числам: она сошла с окружности.', 'I placed the point from your numbers: it left the circle.'),
  swapNote: L("Sonlar to'g'ri, lekin o'rni almashgan: nuqta boshqa burchakka ketdi.", 'Числа верные, но местами: точка ушла на другой угол.', 'The numbers are right but swapped: the point moved to another angle.'),
  audio: [
    A('mount', "Uch burchak, uch nuqta. Juftlikni to'ldiring.", 'Три угла, три точки. Заполни пару.', 'Three angles, three points. Fill in the pair.'),
    A('next', "Agar juftlik noto'g'ri bo'lsa, nuqta aylanadan chiqadi va siz buni ko'rasiz.", 'Если пара неверная, точка сойдёт с окружности, и ты это увидишь.', 'If the pair is wrong, the point leaves the circle and you will see it.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S9.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={solved} {...rest}>
      <TableFill
        rows={S9.rows}
        chips={S9.chips}
        okText={S9.okText}
        wrongNote={S9.wrongNote}
        swapNote={S9.swapNote}
        audio={audio}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S9.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 10. MASHQ 2. Yo'naltirilgan: qadamlar NOMLANGAN. Teskari masala.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ordinata 1/2. Nechta nuqta?', 'Ордината 1/2. Сколько точек?', 'The y-coordinate is 1/2. How many points?'),
  tag: 'odin-koren',
  prompts: [
    L("1-qadam. O'NG tomondagi nuqtani qo'ying.", 'Шаг 1. Поставь точку справа.', 'Step 1. Place the point on the right.'),
    L("2-qadam. Endi shu chiziqdagi IKKINCHI nuqtani toping.", 'Шаг 2. Теперь найди вторую точку на той же горизонтали.', 'Step 2. Now find the second point on the same line.'),
  ],
  steps: ['y = 1/2  →  30°', 'y = 1/2  →  150°'],
  wrong: L("Bu nuqtaning ordinatasi boshqa. Chiziq aylanani qayerda kesganiga qarang.", 'У этой точки другая ордината. Смотри, где горизонталь пересекает окружность.', 'That point has a different y-coordinate. Look where the line crosses the circle.'),
  ok: L("Ikkita nuqta. Bitta son — ikkita burchak, va ikkalasi ham javob.", 'Две точки. Одно число — два угла, и оба являются ответом.', 'Two points. One number gives two angles, and both are answers.'),
  // Ikkinchi bosqich -- MOSLASHTIRISH (`match`): burchak <-> koordinatalar.
  match: {
    prompt: L(
      "Endi har bir burchakni o'z koordinatalari bilan birlashtiring.",
      'Теперь соедини каждый угол с его координатами.',
      'Now match each angle with its coordinates.',
    ),
    left: [
      { id: 'p6', label: 'π/6' },
      { id: 'p4', label: 'π/4' },
      { id: 'p3', label: 'π/3' },
      { id: 'p2', label: 'π/2' },
    ],
    right: [
      { id: 'p6', label: '(√3/2; 1/2)' },
      { id: 'p4', label: '(√2/2; √2/2)' },
      { id: 'p3', label: '(1/2; √3/2)', hint: L("Bu nuqta balandroq: uning ordinatasi katta.", 'Эта точка выше: у неё большая ордината.', 'This point sits higher: its y-coordinate is larger.') },
      { id: 'p2', label: '(0; 1)' },
    ],
    ok: L(
      "Jadval yig'ildi: har bir burchak — bitta nuqta.",
      'Таблица собралась: каждый угол — это одна точка.',
      'The table is assembled: each angle is one point.',
    ),
    title: L('Burchak va koordinatalar', 'Угол и его координаты', 'The angle and its coordinates'),
    marks: [
      { deg: 30, tone: T.graph, label: 'π/6' },
      { deg: 45, tone: T.graph, label: 'π/4' },
      { deg: 60, tone: T.graph, label: 'π/3' },
      { deg: 90, tone: T.graph, label: 'π/2' },
    ],
  },
  audio: [
    A('mount', "Endi teskarisi: son ma'lum, burchak esa yo'q.", 'Теперь наоборот: число известно, а угол нет.', 'Now the other way round: the number is known, the angle is not.'),
    A('next', "Gorizontal chiziq o'tkazildi. Nuqtalarni o'zingiz qo'ying, birma-bir.", 'Горизонталь проведена. Ставь точки сам, по очереди.', 'The horizontal line is drawn. Place the points yourself, one at a time.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [stage, setStage] = useState(0)
  const [solved, setSolved] = useState(false)
  if (stage === 1) {
    return (
      <Frame meta={{ ...S10, title: S10.match.title }} screen={screen} audio={audio} solved={solved} {...rest}>
        <MatchPairs
          prompt={S10.match.prompt}
          left={S10.match.left}
          right={S10.match.right}
          marks={S10.match.marks}
          okText={S10.match.ok}
          audio={audio}
          onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S10.tag }) }}
        />
      </Frame>
    )
  }
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={false} {...rest}>
      <PlaceAngle
        prompt={S10.prompts}
        targets={[30, 150]}
        steps={S10.steps}
        okText={S10.ok}
        wrongText={S10.wrong}
        audio={audio}
        extra={{ chord: { y: 0.5, dots: false }, values: true }}
        onSolved={() => setTimeout(() => setStage(1), 1600)}
      />
    </Frame>
  )
}

// ============================================================
// 11. MASHQ 3. O'ZI, ASBOBSIZ. Aylana YO'Q: DTM da ham bo'lmaydi.
// ============================================================
const S11 = {
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz hisoblang', 'Посчитай без чертежа', 'Compute without a drawing'),
  tag: 'bumaga',
  tasks: [
    {
      prompt: 'cos 60° + sin 30°',
      answer: 1,
      ok: L("To'g'ri. Ikkala qiymat ham 1/2.", 'Верно. Оба значения равны 1/2.', 'Correct. Both values are 1/2.'),
      hints: [
        L("Ikkala qo'shiluvchi bir xil songa teng. Qaysi songa?", 'Оба слагаемых равны одному числу. Какому?', 'Both terms equal the same number. Which one?'),
        L("60° ning kosinusi nuqtaning birinchi koordinatasi, u 1/2.", 'Косинус 60° — первая координата точки, она 1/2.', 'The cosine of 60° is the first coordinate, one half.'),
        L("Bir ikkidan qo'shuv bir ikkidan.", 'Одна вторая плюс одна вторая.', 'One half plus one half.'),
      ],
    },
  ],
  // Ikkinchi topshiriq -- TARTIBLASH turi (1-4-sinf amaliyotidagi `order`).
  // Variant tanlashda taxmin ishlaydi, bu yerda ishlamaydi.
  order: {
    prompt: L(
      'Kamayish tartibida joylashtiring.',
      'Расставь по убыванию.',
      'Arrange in decreasing order.',
    ),
    items: [
      { id: 'c0', label: 'cos 0' },
      { id: 'c60', label: 'cos 60°' },
      { id: 'c90', label: 'cos 90°' },
      { id: 'c180', label: 'cos 180°' },
    ],
    answer: ['c0', 'c60', 'c90', 'c180'],
    marks: [
      { deg: 0, tone: T.graph, label: '0' },
      { deg: 60, tone: T.graph, label: '60°' },
      { deg: 90, tone: T.graph, label: '90°' },
      { deg: 180, tone: T.graph, label: '180°' },
    ],
    ok: L(
      "Burchak o'sdi, kosinus esa KAMAYDI. Ikkalasi birga o'smaydi.",
      'Угол рос, а косинус убывал. Вместе они не растут.',
      'The angle grew while the cosine fell. They do not grow together.',
    ),
    bad: L(
      "Har bir qiymatni nuqtadan o'qing: nuqta chapga siljigan sari birinchi koordinata kamayadi.",
      'Читай каждое значение по точке: чем левее точка, тем меньше первая координата.',
      'Read each value from its point: the further left the point, the smaller the first coordinate.',
    ),
    title: L('Burchak o‘sdi — kosinus ham o‘sdimi?', 'Угол вырос — вырос ли косинус?', 'The angle grew: did the cosine grow too?'),
  },
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle here. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [stage, setStage] = useState(0) // 0 -- son kiritish, 1 -- tartiblash
  const [solved, setSolved] = useState(false)
  const task = S11.tasks[0]
  if (stage === 0) {
    return (
      <Frame meta={S11} screen={screen} audio={audio} solved={false} {...rest}>
        <Cols l={1} r={1}>
          <Col>
            <Panel tone="paper">
              <Expr size="big" style={{ textAlign: 'left' }}>{task.prompt}</Expr>
            </Panel>
          </Col>
          <Col>
            <NumberEntry
              answer={task.answer}
              okText={task.ok}
              hints={task.hints}
              audio={audio}
              onSolved={() => setTimeout(() => setStage(1), 1400)}
            />
          </Col>
        </Cols>
      </Frame>
    )
  }
  return (
    <Frame meta={{ ...S11, title: S11.order.title }} screen={screen} audio={audio} solved={solved} {...rest}>
      <OrderRow
        prompt={S11.order.prompt}
        items={S11.order.items}
        answer={S11.order.answer}
        marks={S11.order.marks}
        okText={S11.order.ok}
        badText={S11.order.bad}
        audio={audio}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S11.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 12. MASHQ 4. TUZOQ. Hamma qadam to'g'ri ko'rinadi, javob noto'g'ri.
// Kontrsonni o'quvchi kiritadi -- shusiz topshiriq yopilmaydi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Javob noto‘g‘ri. Qayerda?', 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  rows: [
    { id: 'r1', text: '120° = 180° − 60°' },
    { id: 'r2', text: 'cos 120° = cos 60° = 1/2' },
    { id: 'r3', text: 'cos²120° = 1/4' },
    { id: 'r4', text: 'sin²120° = 1 − 1/4 = 3/4' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu qator to'g'ri: 180 dan 60 ni ayirsak 120 chiqadi.", 'Эта строка верна: 180 минус 60 даёт 120.', 'This line is right: 180 minus 60 gives 120.'),
    r3: L("Bu qator oldingisidan TO'G'RI kelib chiqadi. Xatoni yuqoriroqdan qidiring.", 'Эта строка следует из предыдущей верно. Ищи ошибку выше.', 'This line follows correctly. Look higher.'),
    r4: L("Bu ham to'g'ri kelib chiqqan. Birinchi xato qator yuqorida.", 'Эта тоже выведена верно. Первая неверная строка выше.', 'This one is derived correctly too. The first wrong line is above.'),
  },
  proof: L("Nuqta 60° ga tushdi, 120° ga emas.", 'Точка села на 60°, а не на 120°.', 'The point landed on 60°, not 120°.'),
  entry: {
    prompt: L('120° nuqtasining birinchi koordinatasi?', 'Первая координата точки 120°?', 'First coordinate of the point 120°?'),
    answer: -0.5,
    hints: [
      L("Nuqta chapda. Ishora qanday?", 'Точка слева. Какой там знак?', 'The point is on the left. What sign?'),
      L("Uzunligi o'sha, ishorasi boshqa.", 'Длина та же, знак другой.', 'Same length, different sign.'),
      L("Manfiy nol butun besh.", 'Минус ноль целых пять.', 'Minus zero point five.'),
    ],
    ok: L("Ikkinchi chorakda birinchi koordinata manfiy.", 'Во второй четверти первая координата отрицательна.', 'In the second quadrant the first coordinate is negative.'),
  },
  audio: [
    A('mount', "To'rt qator. Hammasi to'g'ri ko'rinadi, lekin javob noto'g'ri.", 'Четыре строки. Все выглядят верными, но ответ неверный.', 'Four lines. All look right, but the answer is wrong.'),
    A('next', "Keyingi qatorlar oldingisidan to'g'ri kelib chiqadi, shuning uchun BIRINCHI xatoni qidiring.", 'Следующие строки выводятся верно, поэтому ищи первую ошибку.', 'Later lines follow correctly, so look for the first mistake.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S12.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [found, setFound] = useState(false)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S12} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1.1} r={1}>
        <Col>
          <AuditRows
            rows={S12.rows}
            answerId={S12.answerId}
            hints={S12.hints}
            proof={S12.proof}
            hideProof
            audio={audio}
            onSolved={() => setFound(true)}
          />
        </Col>
        <Col>
          {found ? (
            <>
              <Tag tone="graph">{t(S12.proof)}</Tag>
              <Scene fig={<UnitCircle angle={60} marks={[{ deg: 120, tone: T.ok, label: '120°' }]} locked />} max={140} h={140} />
              <NumberEntry
                compact
                prompt={S12.entry.prompt}
                answer={S12.entry.answer}
                okText={S12.entry.ok}
                hints={S12.entry.hints}
                audio={audio}
                onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S12.tag }) }}
              />
            </>
          ) : (
            <Slot mh={200} />
          )}
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// 13. KO'CHIRISH. Teskari masala: shart berilgan, nuqtani O'ZI yasaydi.
// «Chorak» so'zi YO'Q -- u 4-darsda kiritiladi.
// ============================================================
const S13 = {
  eyebrow: L('YASANG', 'СОБЕРИ САМ', 'BUILD IT'),
  title: L('Shart bo‘yicha nuqta', 'Точка по условию', 'A point from a condition'),
  tag: 'obratnoe',
  tasks: [
    {
      prompt: L("Kosinusi manfiy, sinusi musbat bo'lgan nuqta qo'ying.",
        'Поставь точку, у которой косинус отрицательный, а синус положительный.',
        'Place a point whose cosine is negative and whose sine is positive.'),
      snap: [120, 135, 150],
      ok: L("Ha. Birinchi son manfiy, ikkinchisi musbat.", 'Да. Первое число отрицательное, второе положительное.', 'Yes. The first number is negative, the second positive.'),
    },
  ],
  // Ikkinchi topshiriq -- KO'P TANLOV (`multi`): hammasini belgilash kerak,
  // shuning uchun taxmin ishlamaydi. 7-slaydning davomi.
  multi: {
    prompt: L(
      "Mumkin bo'lgan HAMMA yozuvni belgilang.",
      'Отметь все возможные записи.',
      'Mark every possible statement.',
    ),
    items: [
      { id: 'a', label: 'sin α = 0,9', ok: true },
      { id: 'b', label: 'cos α = −1,2', hint: L("Birdan katta: nuqta aylanadan chiqib ketadi.", 'Больше единицы по длине: точка уходит с окружности.', 'Longer than one: the point leaves the circle.') },
      { id: 'c', label: 'sin α = −1', ok: true },
      { id: 'd', label: 'cos α = 3/2', hint: L("Uch ikkidan birdan katta.", 'Три вторых больше единицы.', 'Three halves is greater than one.') },
      { id: 'e', label: 'sin α = √2/2', ok: true },
    ],
    ok: L(
      "Uchtasi ham mumkin: ularning uzunligi birdan oshmaydi.",
      'Все три возможны: их длина не превышает единицу.',
      'All three are possible: none exceeds one in length.',
    ),
    title: L('Qaysi yozuvlar bo‘lishi mumkin?', 'Какие записи вообще бывают?', 'Which statements can exist at all?'),
  },
  audio: [
    A('mount', "Endi shartni o'zingiz bajarasiz. Nuqtani belgilarga qarab qo'ying.", 'Теперь условие выполняешь ты. Ставь точку по знакам координат.', 'Now you satisfy the condition. Place the point by the signs.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S13.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [round, setRound] = useState(0)
  const [solved, setSolved] = useState(false)
  const task = S13.tasks[Math.min(round, S13.tasks.length - 1)]
  const first = round === 0
  const hints = [
    { when: (c) => c > 0, text: L("Nuqta o'ng tomonda: birinchi son musbat.", 'Точка справа: первое число положительное.', 'The point is on the right: the first number is positive.') },
    { when: (c, sv) => first && sv < 0, text: L("Nuqta pastga tushdi, ikkinchi son manfiy bo'ldi.", 'Точка ниже оси, второе число стало отрицательным.', 'The point is below the axis, the second number turned negative.') },
    { when: (c, sv) => !first && sv > 0, text: L("Ikkinchi son hali musbat. Nuqtani pastroqqa oling.", 'Второе число ещё положительное. Опусти точку ниже.', 'The second number is still positive. Move the point lower.') },
    { when: (c, sv) => Math.abs(c) < 0.02 || Math.abs(sv) < 0.02, text: L("O'qda sonlardan biri nolga teng.", 'На оси одно из чисел равно нулю.', 'On the axis one of the numbers is zero.') },
    { when: () => true, text: L('Belgilarni tekshiring.', 'Проверь знаки.', 'Check the signs.') },
  ]
  if (round === 0) {
    return (
      <Frame meta={S13} screen={screen} audio={audio} solved={false} {...rest}>
        <BuildPoint
          prompt={task.prompt}
          test={(c, sv) => c < -0.02 && sv > 0.02}
          hints={hints}
          okText={task.ok}
          audio={audio}
          snap={task.snap}
          onSolved={() => setTimeout(() => setRound(1), 1500)}
        />
      </Frame>
    )
  }
  return (
    <Frame meta={{ ...S13, title: S13.multi.title }} screen={screen} audio={audio} solved={solved} {...rest}>
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S13.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 14. BLITS. To'rt savol bitta panelda. YAGONA baholanadigan ekran.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L('To‘rt savol · natijaga kiradi', 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'blitz',
  angles: [45, 150, 270, 30],
  items: [
    {
      id: 'q1',
      prompt: 'sin 45°',
      done: 'sin 45° = √2/2',
      items: [
        { id: 'a', label: '√2/2', correct: true },
        { id: 'b', label: '√3/2', hint: L("Bu 60°, nuqta balandroq.", 'Это 60°, точка выше.', 'That is 60°, the point sits higher.') },
        { id: 'c', label: '1/2', hint: L("Bu 30° ning ordinatasi.", 'Это ордината 30°.', 'That is the y-coordinate of 30°.') },
        { id: 'd', label: '1', hint: L("Bir faqat o'qdagi nuqtada.", 'Единица бывает только на оси.', 'One occurs only on an axis.') },
      ],
    },
    {
      // STRATEGIYA savoli (4-sinf naqshi): javob emas, YO'L tanlanadi.
      // Ataylab IKKI variant: «to'rttadan tanlash» kvotasi buzilmasin.
      id: 'q2',
      ask: true,
      prompt: L('cos 150° ni qanday tezroq topasiz?', 'Как быстрее найти cos 150°?', 'What is the faster way to find cos 150°?'),
      done: L("cos 150° — 30° ning aksi", 'cos 150° — отражение 30°', 'cos 150° — the reflection of 30°'),
      items: [
        {
          id: 'a',
          label: L("30° nuqtasini vertikal o'qdan aks ettirish", 'Отразить точку 30° через вертикальную ось', 'Reflect the point 30° in the vertical axis'),
          correct: true,
          ok: L(
            "Ha. Aks ettirishda uzunlik saqlanadi, ishora almashadi: cos 150° = −cos 30°.",
            'Да. При отражении длина сохраняется, знак меняется: cos 150° = −cos 30°.',
            'Yes. Reflection keeps the length and flips the sign: cos 150° = −cos 30°.',
          ),
        },
        {
          id: 'b',
          label: L("150° li to'g'ri burchakli uchburchak qurish", 'Построить прямоугольный треугольник с углом 150°', 'Build a right triangle with a 150° angle'),
          hint: L(
            "Bunday uchburchak yo'q: to'g'ri burchakli uchburchakda o'tkir burchak 90° dan kichik.",
            'Такого треугольника нет: в прямоугольном треугольнике острый угол меньше 90°.',
            'There is no such triangle: in a right triangle the acute angle is less than 90°.',
          ),
        },
      ],
    },
    {
      id: 'q3',
      prompt: L('(0; −1) qaysi burchak?', 'Какой угол даёт (0; −1)?', 'Which angle gives (0; −1)?'),
      done: '(0; −1) = 3π/2',
      items: [
        { id: 'a', label: '3π/2', correct: true },
        { id: 'b', label: 'π/2', hint: L("U yerda nuqta tepada.", 'Там точка вверху.', 'There the point is at the top.') },
        { id: 'c', label: 'π', hint: L("Bu chapdagi nuqta.", 'Это точка слева.', 'That is the point on the left.') },
        { id: 'd', label: '0', hint: L("Bu o'ngdagi nuqta.", 'Это точка справа.', 'That is the point on the right.') },
      ],
    },
    {
      id: 'q4',
      prompt: L('0° dan 360° gacha nechta burchak sin x = 1/2 beradi?', 'Сколько углов от 0° до 360° дают sin x = 1/2?', 'How many angles from 0° to 360° give sin x = 1/2?'),
      done: 'sin x = 1/2  →  2',
      items: [
        { id: 'a', label: L('ikkita', 'два', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'один', 'one'), hint: L("Chiziqni chapga davom ettiring.", 'Продолжи горизонталь влево.', 'Extend the line to the left.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L("To'g'ri chiziq aylanani ko'pi bilan ikki joyda kesadi.", 'Прямая пересекает окружность не более чем в двух точках.', 'A line meets a circle at most twice.') },
        { id: 'd', label: L('birorta ham', 'ни одного', 'none'), hint: L("1/2 birdan kichik, chiziq aylanaga yetadi.", 'Одна вторая меньше единицы, прямая достаёт.', 'One half is less than one, the line reaches it.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S14.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  const [round, setRound] = useState(0)
  const first = useRef([])
  return (
    <Frame meta={S14} screen={screen} audio={audio} solved={solved} right={t(UI.goesToResult)} {...rest}>
      <Cols l={1} r={1}>
        <Col>
          <Scene
            fig={(
              <UnitCircle
                angle={S14.angles[Math.min(round, S14.angles.length - 1)]}
                chord={round === 3 ? { y: 0.5 } : null}
               
                locked
                values={round > 0 && round < 3}
              />
            )}
            max={300}
          />
        </Col>
        <Col>
          <ProbeChain
            items={S14.items}
            cols={2}
            audio={audio}
            onStep={() => setRound((r) => r + 1)}
            onEach={(r) => { first.current = first.current.concat(r.attempts === 1) }}
            onSolved={() => {
              setSolved(true)
              onAnswer({
                screen,
                tag: S14.tag,
                correct: true,
                blitz: { total: S14.items.length, first: first.current.filter(Boolean).length },
              })
            }}
          />
        </Col>
      </Cols>
    </Frame>
  )
}

// ============================================================
// 15. YAKUN. Prognoz va natija, tayyorlik SO'Z bilan,
// chop etiladigan shpargalka. Yangi matematika YO'Q.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  can: [
    L("Burchak bo'yicha nuqta qo'yaman", 'Ставлю точку по углу', 'I place the point for an angle'),
    L("Koordinatani kosinus va sinus deb o'qiyman", 'Читаю координату как косинус и синус', 'I read a coordinate as cosine and sine'),
    L("Jadvalni radiusdan tiklayman", 'Восстанавливаю таблицу из радиуса', 'I rebuild the table from the radius'),
    L("Bitta son ikki burchak berishini bilaman", 'Знаю, что одно число даёт два угла', 'I know one number gives two angles'),
  ],
  levels: {
    full: L("Bu turdagi masalalar yopildi.", 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: koordinatalar tartibi.", 'Одно место требует повтора: порядок координат.', 'One place needs review: the order of the coordinates.'),
    back: L("Qoidaga va 5-ekranga qayting.", 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen 5.'),
  },
  bridge: L("4-dars: chorak bo'yicha ishora. Nuqta qayerda tursa, ishora shundan.",
    'Урок 4: знак по четверти. Где стоит точка — оттуда и знак.',
    'Lesson 4: the sign by quadrant. Where the point stands is where the sign comes from.'),
  sheetSteps: [
    'cos α = x,  sin α = y,  x² + y² = 1',
    'π/6 → (√3/2; 1/2)',
    'π/4 → (√2/2; √2/2)',
    'π/3 → (1/2; √3/2)',
    'π/2 → (0; 1),  π → (−1; 0),  3π/2 → (0; −1)',
  ],
  audio: [
    A('mount', "Dars boshida siz ikki yozuvdan birini tanlagan edingiz. Mana natija.", 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Jadvalni yodlash shart emas: nuqta qo'ying va ikki sonni o'qing.", 'Таблицу можно не помнить: поставь точку и прочитай два числа.', 'You do not have to remember the table: place the point and read two numbers.'),
  ],
}

const HOOK_LABEL = { a: '(1/2; √3/2)', b: '(√3/2; 1/2)', both: '?', none: '?' }

function Screen15({ screen, answers, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S15.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const hook = answers && answers[0] ? answers[0].picked : null
  const blitz = (answers || []).reduce((acc, a) => (a && a.blitz ? a.blitz : acc), null)
  const got = blitz ? blitz.first : 0
  const total = blitz ? blitz.total : 4
  const level = got >= total ? S15.levels.full : got >= total - 1 ? S15.levels.gap : S15.levels.back

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <Cols l={1} r={1}>
        <Col>
          <Panel style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Tag tone="graph">{t(UI.predictToProved)}</Tag>
            <Expr size="mid" style={{ textAlign: 'left', color: T.ink2 }}>
              {(hook ? HOOK_LABEL[hook] : '—') + '   →   (1/2; √3/2)'}
            </Expr>
          </Panel>
          <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <RingProgress value={got} total={total} label={t(UI.readiness)} size={76} />
            <span className="g10-hint" style={{ textAlign: 'left' }}>{t(level)}</span>
          </Panel>
          <Insight label="→">{t(S15.bridge)}</Insight>
        </Col>
        <Col>
          <Panel style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Tag tone="ok">{t(UI.learned)}</Tag>
            {S15.can.map((c, i) => (
              <span key={i} className="g10-hint" style={{ textAlign: 'left', fontSize: 13, lineHeight: 1.34 }}>{'✓  ' + t(c)}</span>
            ))}
          </Panel>
          {/* Qoralama bloki va «LAYFXAK» tugmasi olib tashlandi (metodist,
              2026-08-11). Chop etiladigan shpargalka (PrintSheet) joyida
              qoladi: uni brauzerning o'z chop etish buyrug'i chiqaradi. */}
        </Col>
      </Cols>
      <PrintSheet
        title={t(UI.sheetTitle)}
        law={'cos²α + sin²α = 1'}
        steps={S15.sheetSteps}
        lifehack={t(UI.lifehack)}
        source={t(UI.sheetSrc)}
      />
    </Frame>
  )
}

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default function Grade10Dars03({
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  studentName,
  onFinished,
}) {
  useMobileZoom()
  const preview = langProp === undefined || langProp === null
  const [previewLang, setPreviewLang] = useState('ru')
  const lang = langProp || previewLang

  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: studentName || '',
    voiceGender: voiceGender || 'm',
  })

  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const record = useCallback((data) => {
    setAnswers((prev) => {
      const next = prev.slice()
      next[data.screen] = data
      return next
    })
  }, [])

  const next = useCallback(() => setScreen((s) => Math.min(TOTAL - 1, s + 1)), [])
  const prev = useCallback(() => setScreen((s) => Math.max(0, s - 1)), [])

  const finish = useCallback(() => {
    setFinished(true)
    if (!onFinished) return
    // Baholanadigan YAGONA ekran -- blits. Son ma'lumotdan hisoblanadi.
    const blitz = answers.reduce((acc, a) => (a && a.blitz ? a.blitz : acc), null)
    const tags = answers
      .filter((a) => a && a.tag && (a.correct === false || (a.attempts || 1) > 1))
      .map((a) => a.tag)
    onFinished({
      lessonId: LESSON_ID,
      lessonTitle: tr(LESSON_TITLE, lang),
      totalQuestions: blitz ? blitz.total : 0,
      correctAnswers: blitz ? blitz.first : 0,
      tags,
      answers: answers.filter(Boolean),
    })
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={preview ? setPreviewLang : null}>
        <div className="lesson-root">
          <style>{STYLES}</style>
          <BgCurves />
          <Current
            key={screen}
            lang={lang}
            screen={screen}
            answers={answers}
            onAnswer={record}
            onNext={next}
            onPrev={prev}
            onFinish={finish}
            finished={finished}
          />
        </div>
      </LangSetProvider>
    </LangProvider>
  )
}
