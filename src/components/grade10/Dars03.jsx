// ============================================================================
// 10-sinf, Dars 3. TRIGONOMETRIK DOIRA.  (Тригонометрический круг)
//
// PILOT dars. Yig'ilishi 11-sinf pilotining qolipi bo'yicha (metodist qarori
// 2026-08-06): yuqori panel, bo'lim xaritasi, ikki ustun, qoralama, halqa,
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
  NotesInline,
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
  ExploreCircle,
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
  lifehackLabel: L('LAYFXAK', 'ЛАЙФХАК', 'LIFEHACK'),
  lifehack: L(
    "Jadvalni yodlamang. Nuqtani qo'ying va ikki sonni o'qing: o'ngga qancha -- kosinus, yuqoriga qancha -- sinus.",
    'Не заучивай таблицу. Поставь точку и прочитай два числа: сколько вправо — косинус, сколько вверх — синус.',
    'Do not memorise the table. Place the point and read two numbers: how far right is cosine, how far up is sine.',
  ),
  sheetTitle: L('Trigonometrik doira · shpargalka', 'Тригонометрический круг · шпаргалка', 'The unit circle · cheat sheet'),
  sheetSrc: L(
    "10-sinf, 3-dars · Algebra 10 (2022), 4-bob, 133-134-bet",
    '10 класс, урок 3 · Алгебра 10 (2022), глава 4, стр. 133–134',
    'Grade 10, lesson 3 · Algebra 10 (2022), chapter 4, pp. 133–134',
  ),
  goesToResult: L('Natijaga kiradi', 'Идёт в результат', 'Counts towards the result'),
}

// ============================================================
// Umumiy ramka: sarlavha, bo'lim xaritasi, navigatsiya.
// ============================================================
function Frame({ meta, right, screen, audio, solved, onPrev, onNext, onFinish, finished, navCenter, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = {
    back: <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>{t(UI.back)}</Btn>,
    next: last ? (
      <Btn tone="accent" ready={!finished} onClick={onFinish} disabled={finished}>
        {finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={solved}>{t(UI.next)}</Btn>
    ),
  }
  return (
    <Stage eyebrow={t(meta.eyebrow)} right={right} block={BLOCK} screen={screen} total={TOTAL} audio={audio} nav={nav} navCenter={navCenter}>
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
  title: L('Bitta nuqta, ikki xil o‘qish', 'Одна точка, два прочтения', 'One point, two readings'),
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
            <Scene fig={<UnitCircle angle={60} readout={false} locked values={!!picked} />} max={168} h={168} />
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
  title: L('Radianni eslaymiz', 'Вспоминаем радиан', 'Recalling the radian'),
  tag: 'support',
  prompts: [
    L("Nuqtani π/6 burchagiga qo'ying.", 'Поставь точку в угол π/6.', 'Place the point at π/6.'),
    L("Endi π/2 -- eng tepaga.", 'Теперь π/2 — в самый верх.', 'Now π/2, at the very top.'),
  ],
  steps: ['π/6 = 30°', 'π/2 = 90°'],
  wrong: L("Bu boshqa burchak. π butun yarim aylana.", 'Это другой угол. π — половина окружности.', 'That is a different angle. π is half the circle.'),
  ok: L("Radian -- yoy uzunligi, gradus emas.", 'Радиан — это длина дуги, а не градус.', 'A radian is an arc length, not a degree.'),
  audio: [
    A('mount', "Ikki dars oldin radian bilan tanishgan edingiz. Radian -- yoy uzunligi.", 'Два урока назад ты познакомился с радианом. Радиан — это длина дуги.', 'Two lessons ago you met the radian. A radian is an arc length.'),
    A('next', "Nuqtani o'zingiz qo'ying: yodlash shart emas, aylanaga qarab toping.", 'Поставь точку сам: помнить наизусть не надо, найди по окружности.', 'Place the point yourself: no need to recall it, find it on the circle.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S2.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S2} screen={screen} audio={audio} solved={solved} {...rest}>
      <PlaceAngle
        prompt={S2.prompts}
        targets={[30, 90]}
        steps={S2.steps}
        okText={S2.ok}
        wrongText={S2.wrong}
        audio={audio}
        extra={{ marks: [{ deg: 0, tone: T.ink3, label: '0' }] }}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S2.tag }) }}
      />
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
  audio: [
    A('mount', "Hisoblagich ikkala koordinataning kvadratlarini qo'shadi.", 'Счётчик складывает квадраты обеих координат.', 'The counter adds the squares of both coordinates.'),
    A('next', "Uni birdan uzishga harakat qiling. Turli choraklarga boring.", 'Попробуй увести его с единицы. Пройди по разным четвертям.', 'Try to move it off one. Go through different quadrants.'),
    A('next', "Koordinatalar o'zgaradi, hisoblagich esa qimirlamaydi. Sababi radius.", 'Координаты меняются, а счётчик не двигается. Причина — радиус.', 'The coordinates change but the counter does not move. The reason is the radius.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S3.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
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
  audio: [
    A('mount', "Ko'pchilik bu yerda bir ikkidanni kutadi: burchak yarmi, demak koordinata ham yarmi.", 'Многие ждут здесь одну вторую: угол пополам, значит и координата пополам.', 'Many expect one half here: half the angle, so half the coordinate.'),
    A('next', "Nuqtani o'rtaga qo'ying va sonni ko'ring.", 'Поставь точку посередине и посмотри на число.', 'Place the point in the middle and look at the number.'),
    A('next', "Ikkala koordinata teng, demak kvadratlar yig'indisi ikkilangan kvadrat. Nol butun yetmish bir chiqdi.", 'Обе координаты равны, значит сумма квадратов — удвоенный квадрат. Получилось ноль целых семьдесят одна.', 'Both coordinates are equal, so the sum of squares is twice one square. We got zero point seven one.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S4.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
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
  audio: [
    A('mount', "O'ttiz gradus uchun katet gipotenuzaning yarmi, ya'ni sinus bir ikkidan.", 'Для тридцати градусов катет — половина гипотенузы, то есть синус равен одной второй.', 'For thirty degrees the leg is half the hypotenuse, so the sine is one half.'),
    A('next', "Nuqtani o'zingiz qo'ying.", 'Поставь точку сам.', 'Place the point yourself.'),
    A('next', "Endi uni bissektrisadan aks ettiring va ikki qatorni solishtiring.", 'Теперь отрази её через биссектрису и сравни две строки.', 'Now reflect it in the bisector and compare the two lines.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S5.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={solved} {...rest}>
      <PlaceAngle
        prompt={S5.prompts}
        targets={[30, 60]}
        steps={S5.steps}
        okText={S5.ok}
        wrongText={S5.wrong}
        audio={audio}
        extra={{ bisector: true, values: true }}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S5.tag }) }}
      />
    </Frame>
  )
}

// ============================================================
// 6. TUSHUNTIRISH 4. O'zi, yangi holatda: to'rtta o'q nuqtasi.
// ============================================================
const S6 = {
  eyebrow: L("O'Q BURCHAKLARI", 'ОСЕВЫЕ УГЛЫ', 'AXIS ANGLES'),
  title: L('To‘rtta o‘q nuqtasi', 'Четыре осевые точки', 'The four axis points'),
  tag: 'osevoy-po-sosedu',
  prompts: [
    L("Nuqtani o'ngga, 0° ga qo'ying.", 'Поставь точку справа, в 0°.', 'Place the point on the right, at 0°.'),
    L('Endi eng tepaga.', 'Теперь в самый верх.', 'Now at the very top.'),
    L('Endi chapga.', 'Теперь налево.', 'Now to the left.'),
    L('Va pastga.', 'И вниз.', 'And down.'),
  ],
  steps: ['cos 0 = 1,  sin 0 = 0', 'cos 90° = 0,  sin 90° = 1', 'cos 180° = −1', 'sin 270° = −1'],
  wrong: L("Bu o'qda emas. O'q nuqtalarida bitta koordinata nolga teng.", 'Это не на оси. У осевых точек одна координата равна нулю.', 'That is not on an axis. At axis points one coordinate is zero.'),
  ok: L("To'rttasini yod olish shart emas: nuqta qayerda turganini ko'rish kifoya.", 'Все четыре помнить не нужно: достаточно видеть, где стоит точка.', 'You do not need all four by heart: it is enough to see where the point is.'),
  audio: [
    A('mount', "Endi o'q nuqtalari. Ularni o'zingiz aylanib chiqasiz.", 'Теперь осевые точки. Ты обойдёшь их сам.', 'Now the axis points. You will walk through them yourself.'),
    A('next', "Har bir nuqtada bitta koordinata nolga, ikkinchisi birga teng.", 'В каждой точке одна координата равна нулю, вторая единице.', 'At each point one coordinate is zero and the other is one.'),
    A('next', "Chapda kosinus minus bir, pastda sinus minus bir.", 'Слева косинус минус один, внизу синус минус один.', 'On the left the cosine is minus one, at the bottom the sine is minus one.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S6.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={solved} {...rest}>
      <PlaceAngle
        prompt={S6.prompts}
        targets={[0, 90, 180, 270]}
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
  audio: [
    A('mount', "Kimdir sinus bir butun ikkidan teng deb yozdi. Buni o'zingiz tekshiring.", 'Кто-то написал, что синус равен одной целой двум десятым. Проверь это сам.', 'Someone wrote that the sine equals one point two. Check it yourself.'),
    A('next', "Nuqtani ko'tarib ko'ring.", 'Попробуй поднять точку.', 'Try to raise the point.'),
    A('next', "Endi shu yozuv bo'yicha nuqta qo'yaman: u aylanadan yuqorida qoldi. Kosinusning kvadratini o'zingiz hisoblang.", 'Теперь я ставлю точку по этой записи: она осталась выше окружности. Посчитай квадрат косинуса сам.', 'Now I place the point from that reading: it stayed above the circle. Compute the square of the cosine yourself.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S7.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
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
    example: L('Algebra 10 (2022), 4-bob, 133-134-bet', 'Алгебра 10 (2022), глава 4, стр. 133–134', 'Algebra 10 (2022), ch. 4, pp. 133–134'),
  },
  audio: [
    A('mount', "Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.", 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Koordinatalar — kosinus va sinus, aynan shu tartibda. Kvadratlari yig'indisi birga teng, darslikda ham shunday yozilgan.", 'Координаты — это косинус и синус, именно в таком порядке. Сумма их квадратов равна единице, в учебнике записано так же.', 'The coordinates are the cosine and the sine, in that order. The sum of their squares is one, and the textbook says the same.'),
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
          <Scene fig={<UnitCircle angle={60} marks={[{ deg: 30, tone: T.graph, label: '30°' }]} readout={false} locked values={solved} />} max={330} />
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
  audio: [
    A('mount', "Endi teskarisi: son ma'lum, burchak esa yo'q.", 'Теперь наоборот: число известно, а угол нет.', 'Now the other way round: the number is known, the angle is not.'),
    A('next', "Gorizontal chiziq o'tkazildi. Nuqtalarni o'zingiz qo'ying, birma-bir.", 'Горизонталь проведена. Ставь точки сам, по очереди.', 'The horizontal line is drawn. Place the points yourself, one at a time.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const segments = useMemo(() => buildAuto(S10.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [solved, setSolved] = useState(false)
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={solved} {...rest}>
      <PlaceAngle
        prompt={S10.prompts}
        targets={[30, 150]}
        steps={S10.steps}
        okText={S10.ok}
        wrongText={S10.wrong}
        audio={audio}
        extra={{ chord: { y: 0.5 }, values: true }}
        onSolved={(r) => { setSolved(true); onAnswer({ ...r, screen, tag: S10.tag }) }}
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
    {
      prompt: 'sin 45° · cos 45°',
      answer: 0.5,
      ok: L("To'g'ri. Ildiz kvadratga aylandi: 2 bo'linadi 4 ga.", 'Верно. Корень возвёлся в квадрат: два делить на четыре.', 'Correct. The root got squared: two over four.'),
      hints: [
        L("Ikkala ko'paytuvchi bir xil.", 'Оба множителя одинаковы.', 'Both factors are the same.'),
        L("Ikkidan ildizning kvadrati ikkiga teng.", 'Квадрат корня из двух равен двум.', 'The square of root two is two.'),
        L("Ikki bo'linsin to'rt. O'nlik kasr bilan yozing.", 'Два делить на четыре. Запиши десятичной дробью.', 'Two over four. Write it as a decimal.'),
      ],
    },
  ],
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle here. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(S11.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)
  const [round, setRound] = useState(0)
  const [solved, setSolved] = useState(false)
  const task = S11.tasks[Math.min(round, S11.tasks.length - 1)]
  return (
    <Frame meta={S11} screen={screen} audio={audio} solved={solved} {...rest}>
      <Cols l={1} r={1}>
        <Col>
          {S11.tasks.map((x, i) => (
            <Panel key={i} tone={i === round ? 'paper' : 'quiet'} style={{ opacity: i <= round ? 1 : 0.4 }}>
              <Expr size={i === round ? 'big' : 'mid'} style={{ textAlign: 'left' }}>
                {x.prompt + (i < round ? '  =  ' + String(x.answer).replace('.', ',') : '')}
              </Expr>
            </Panel>
          ))}
        </Col>
        <Col>
          <NumberEntry
            key={round}
            answer={task.answer}
            okText={task.ok}
            hints={task.hints}
            audio={audio}
            onSolved={(r) => {
              if (round + 1 < S11.tasks.length) setTimeout(() => setRound((x) => x + 1), 1400)
              else { setSolved(true); onAnswer({ ...r, screen, tag: S11.tag }) }
            }}
          />
        </Col>
      </Cols>
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
              <Scene fig={<UnitCircle angle={60} marks={[{ deg: 120, tone: T.ok, label: '120°' }]} readout={false} locked />} max={140} h={140} />
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
    {
      prompt: L("Endi ikkala koordinatasi ham manfiy bo'lgan nuqta qo'ying.",
        'Теперь поставь точку, у которой обе координаты отрицательны.',
        'Now place a point whose coordinates are both negative.'),
      snap: [210, 225, 240],
      ok: L("Ha. Nuqta pastda va chapda.", 'Да. Точка внизу и слева.', 'Yes. The point is at the bottom left.'),
    },
  ],
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
  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={solved} {...rest}>
      <BuildPoint
        key={round}
        prompt={task.prompt}
        test={first ? ((c, sv) => c < -0.02 && sv > 0.02) : ((c, sv) => c < -0.02 && sv < -0.02)}
        hints={hints}
        okText={task.ok}
        audio={audio}
        snap={task.snap}
        onSolved={() => {
          if (round + 1 < S13.tasks.length) setTimeout(() => setRound((r) => r + 1), 1500)
          else { setSolved(true); onAnswer({ screen, tag: S13.tag, correct: true }) }
        }}
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
  angles: [45, 180, 270, 30],
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
      id: 'q2',
      prompt: 'cos 180°',
      done: 'cos 180° = −1',
      items: [
        { id: 'a', label: '−1', correct: true },
        { id: 'b', label: '1', hint: L("Bu o'ngdagi nuqta, 0°.", 'Это точка справа, 0°.', 'That is the point on the right, 0°.') },
        { id: 'c', label: '0', hint: L("Nol yuqoridagi va pastdagi nuqtalarda.", 'Ноль — у верхней и нижней точек.', 'Zero belongs to the top and bottom points.') },
        { id: 'd', label: '−1/2', hint: L("Bunday qiymat 120° da.", 'Такое значение у 120°.', 'That value belongs to 120°.') },
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
                readout={false}
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
// 15. YAKUN. Prognoz va natija, tayyorlik SO'Z bilan, qoralama,
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
    A('mount', "Dars boshida siz ikki yozuvdan birini tanlagan edingiz. Mana natija.", 'В начале урока ты выбрал одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
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
          <NotesInline rows={2} />
          <Btn tone="soft" onClick={() => { if (typeof window !== 'undefined') window.print() }}>
            {t(UI.lifehackLabel)}
          </Btn>
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
