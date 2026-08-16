// ============================================================================
// 11-sinf: EKRAN QATLAMI. Bir marta yozilgan o'ram, hamma darslar uchun.
//
// NEGA BU FAYL BOR. `Dars12.jsx` da har ekran atrofida bir xil o'ram yotardi:
// ovoz bo'laklari, `useAudio`, `useNarratedSteps`, `solved` holati, `Frame`,
// tegni hisobotga uzatish. Ekranga o'rtacha 30 satr, darsga ~450 satr. 50
// darsda bu 22 mingdan ortiq satr, va har birida tegni yoki ovozni unutish
// MUMKIN. Endi dars faylida FAQAT MA'LUMOT va matematika qoladi.
//
// EKRAN ROLI. Metodist qarori 2026-08-14: yangi dars 12-darsdan ko'pi bilan
// 10% farq qiladi. Ya'ni 15 ta rolning ketma-ketligi -- sinfning qolipi, va
// har rolning TANASI shu yerda bir marta yoziladi:
//
//   hook     ikki raqib javob va taxmin        (1-ekran)
//   support  uch tayanch, keyin uch topshiriq  (2-ekran)
//   points   sonni qo'yib tekshirish           (3-ekran)
//   graph    chizma va uning o'qdagi soyasi    (4-ekran)
//   rule     savol-oldin-qoida                 (5 va 8-ekran)
//   newcase  yangi holat va prognoz            (6-ekran)
//   twoway   ikki nuqta, ikki javob            (7-ekran)
//   sign     belgini o'zi qo'yadi              (9-ekran)
//   chain    qadamba-qadam qayta yozish        (10 va 11-ekran)
//   blitz    olti savol, YAGONA baholanadigan  (12-ekran)
//   audit    birinchi xato qadamni topish      (13-ekran)
//   build    teskari masala                    (14-ekran)
//   summary  yakun va DTM tayyorligi           (15-ekran)
//
// QOLIP QOTIB QOLMASIN uchun har tanada zaxira eshigi bor: `data.render`
// berilsa, dars ekranni O'ZI chizadi. 7-sinf xatosi (tayyor qolipga har
// qanday matematikani solish) shu bilan chetlanadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  SoftTimer,
  Stage,
  T,
  Tag,
  Title,
  UI_TXT,
  configureLesson,
  sectionOfRole,
  tr,
  useAdvanceGate,
  useAudio,
  useMobileZoom,
  useNarratedSteps,
  useT,
} from './core.jsx'
import {
  AnswerInterval,
  AnswerValue,
  AreaBoard,
  AuditRows,
  BuildExpr,
  CurveBoard,
  FrequencyBoard,
  GraphProjection,
  OutcomeTree,
  Probe,
  ProbeChain,
  RuleGate,
  SignFill,
  SolutionLine,
  SupportCards,
  SpinBoard,
  TestPointRows,
  TransformChain,
} from './tools.jsx'

// ============================================================
// OVOZ. `A(on, uz, ru, en)` -- bitta bo'lak, `on` -- uning nomi.
//
// IKKI REJIM:
//   led: 'audio'   -- bo'laklar O'ZI zanjirlanadi, kadr ovoz ortidan ochiladi
//                     (tushuntirish ekranlari). `waitFor` dagilar javobni kutadi.
//   led: 'student' -- bo'lak o'quvchining qadamini kutadi (`on_event`),
//                     `on: 'mount'` va `on: 'next'` esa o'zi ketadi.
// ============================================================
export const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

export const buildAuto = (list, lang, waitFor = []) =>
  (list || []).map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: waitFor.indexOf(s.on) !== -1
      ? 'on_event:' + s.on
      : (i === 0 ? 'on_mount' : 'after_previous'),
    waits_for: null,
  }))

export const buildSegments = (list, lang) =>
  (list || []).map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount'
      ? (i === 0 ? 'on_mount' : 'after_previous')
      : s.on === 'next' ? 'after_previous' : 'on_event:' + s.on,
    waits_for: null,
  }))

export const textsOf = (list, lang) => (list || []).map((s) => tr(s.text, lang))

// ============================================================
// HAMMA DARSDA BIR XIL YOZUVLAR. Darsga tegishli yozuvlar (shpargalka
// sarlavhasi, bonus, layfxak) dars faylida qoladi.
// ============================================================
export const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  substitute: L("Qo'yish:", 'Подставить', 'Substitute'),
  mock: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  answerA: L('A varianti', 'Вариант A', 'Option A'),
  answerB: L('B varianti', 'Вариант B', 'Option B'),
  was: L('Edi', 'Было', 'Before'),
  now: L("Bo'ldi", 'Стало', 'Now'),
  target: L("Maqsad oralig'i", 'Целевой интервал', 'Target interval'),
  learned: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  predictToProved: L('Boshdagi taxmin → isbotlangan javob', 'Прогноз в начале → доказанный ответ', 'Initial guess → proved answer'),
  dtmReady: L('DTM ga tayyorlik', 'Готовность к ДТМ', 'Exam readiness'),
  weakSpot: L('Takrorlash kerak', 'Требует повтора', 'Needs review'),
  yourPick: L('sizning taxminingiz', 'твой прогноз', 'your guess'),
  agrees: L('mos keldi', 'сходится', 'consistent'),
  breaks: L('ZIDDIYAT', 'ПРОТИВОРЕЧИЕ', 'CONTRADICTION'),
  breakHas: L(
    'ichida {v} bor, {v} esa yechim emas',
    'содержит {v}, а {v} — не решение',
    'contains {v}, but {v} is not a solution',
  ),
  breakMiss: L(
    "{v} yo'q, lekin {v} yechim",
    'нет {v}, хотя {v} — решение',
    'lacks {v}, although {v} is a solution',
  ),
  headPut: L("qo'ydik", 'подставили', 'substituted'),
  headGot: L('chapda chiqdi', 'слева получилось', 'left side gives'),
  need: L('kerak', 'нужно', 'needed'),
  soAnswer: L('Demak javob', 'Значит ответ', 'So the answer is'),
  bonusLabel: L('BONUS', 'БОНУС', 'BONUS'),
  goesToResult: L('Natijaga kiradi', 'Идёт в результат', 'Counts towards the result'),
  isIn: L('kiradi', 'входит', 'is a solution'),
  isNotIn: L('kirmaydi', 'не входит', 'is not a solution'),
}

// Diagnostik teglarning NOMI: yakun ekranida «nima takrorlash kerak» shu
// yerdan o'qiladi. Yangi teg qo'shilsa -- SHU YERGA, darsga emas.
export const TAG_NAMES = {
  log_domain: L('argumentga shart', 'условие на аргумент', 'the condition on the argument'),
  base_direction: L("asosga qarab ishora yo'nalishi", 'направление знака по основанию', 'the sign direction from the base'),
  check_by_point: L('nuqta bilan tekshirish', 'проверка точкой', 'checking with a point'),
  intersection: L('ikki shartning kesishmasi', 'пересечение двух условий', 'the intersection of two conditions'),
  neg_exponent: L("manfiy ko'rsatkich", 'отрицательный показатель', 'the negative exponent'),
  equal_roots: L('begona ildiz', 'посторонний корень', 'the extraneous root'),
  // B2 bloki. Bu oltitasi YO'Q edi: yakun ekranida «takrorlash kerak»
  // yonida bo'sh joy chiqardi, ya'ni diagnostika ishlamasdi.
  same_base: L('bitta asosga keltirish', 'приведение к одному основанию', 'reducing to one base'),
  positive_power: L("daraja musbatligi", 'положительность степени', 'the positivity of a power'),
  substitution: L('almashtirish', 'замена', 'the substitution'),
  factor_out: L("umumiy ko'paytuvchini chiqarish", 'вынесение общего множителя', 'factoring out'),
  word_model: L('shartdan yozuvga', 'перевод условия в запись', 'turning the problem into a record'),
  // B1 bloki.
  plus_c: L("o'zgarmas + C", 'постоянная + C', 'the constant + C'),
  power_rule: L('daraja qoidasi', 'правило степени', 'the power rule'),
  check_by_diff: L('differensiallab tekshirish', 'проверка дифференцированием', 'checking by differentiating'),
  linearity: L("ko'paytuvchi va qo'shiluvchilar", 'множитель и слагаемые', 'factors and terms'),
  inner_k: L("qavs ko'paytuvchisi", 'множитель из скобки', 'the bracket factor'),
  trig_sign: L('sinus va kosinus ishorasi', 'знак синуса и косинуса', 'the sign of sine and cosine'),
  accumulation: L("yuzaning to'planishi", 'накопление площади', 'the accumulation of area'),
  signed_area: L('integral ishorasi', 'знак интеграла', 'the sign of the integral'),
  bounds_order: L('chegaralar tartibi', 'порядок границ', 'the order of the bounds'),
  frequency_vs_prob: L('chastota va ehtimollik', 'частота и вероятность', 'frequency and probability'),
  mean_vs_median: L("o'rtacha va mediana", 'среднее и медиана', 'mean and median'),
  bell_middle: L("qo'ng'iroq o'rtasi", 'середина колокола', 'the middle of the bell'),
  corr_vs_cause: L("bog'liqlik va sabab", 'связь и причина', 'link and cause'),
  axis_matters: L("qaysi o'q, shunday jism", 'какая ось, такое тело', 'the axis decides the solid'),
  axial_section: L("o'q kesimi", 'осевое сечение', 'the axial section'),
  slant_vs_height: L("yasovchi va balandlik", 'образующая и высота', 'generator and height'),
  section_radius: L('kesim radiusi', 'радиус сечения', 'the section radius'),
  ball_vs_sphere: L('shar va sfera', 'шар и сфера', 'ball and sphere'),
  sector_not_circle: L("yoyilma sektor", 'развёртка это сектор', 'the net is a sector'),
  lateral_vs_total: L("yon va to'liq sirt", 'боковая и полная', 'side and total'),
  order_matters: L('tartib muhimmi', 'важен ли порядок', 'whether the order matters'),
  sum_vs_product: L('VA yoki YOKI', 'И или ИЛИ', 'AND or OR'),
  cross_section: L('kesim yuzasi', 'площадь сечения', 'the section area'),
  between_curves: L('ikki chiziq orasidagi yuza', 'площадь между линиями', 'the area between the lines'),
}

// ============================================================
// EKRAN O'RAMI. Sarlavha, blok xaritasi, navigatsiya, ovoz va faza --
// va ekranning o'z tanasi roldan olinadi.
//
// Tanaga beriladigan narsalar (`ctx`):
//   data     -- ekran ma'lumoti
//   audio    -- ovoz dvijoki (asboblarga uzatiladi)
//   phase    -- ochilish fazasi: ovoz bo'lagi tugagach o'sadi
//   solved   -- ekran yopildimi
//   solve    -- yopish: `solved` ni qo'yadi VA tegni hisobotga uzatadi
//   record   -- yopmasdan javob yozish (prognoz, blits savoli)
//   setRight -- brovkaning o'ng burchagidagi hisoblagich
//   answers  -- oldingi ekranlarning javoblari (prognoz shundan o'qiladi)
//   t, lang
// ============================================================
export function Screen({ data, block, screen, total, answers, onAnswer, onNext, onPrev, onFinish, finished, lang }) {
  const t = useT()
  const led = data.led || 'audio'
  const segments = useMemo(
    () => (led === 'student' ? buildSegments(data.audio, lang) : buildAuto(data.audio, lang, data.waitFor)),
    [lang], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const audio = useAudio(segments)
  const texts = useMemo(() => textsOf(data.audio, lang), [lang]) // eslint-disable-line react-hooks/exhaustive-deps
  const phase = useNarratedSteps(audio, texts, data.holds)
  const [solved, setSolved] = useState(false)
  const [right, setRight] = useState(null)
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === total - 1

  // Teg hisobotga SHU yerdan ketadi. Ekran tanasi uni unutishi mumkin emas.
  const record = useCallback((r) => {
    if (onAnswer) onAnswer({ ...(r || {}), screen, tag: (r && r.tag) || data.tag })
  }, [onAnswer, screen, data.tag])

  const solve = useCallback((r) => {
    setSolved(true)
    record(r)
  }, [record])

  const nav = {
    // 1-4-sinf naqshi: birinchi ekranda tugma UMUMAN chizilmaydi (kulrang
    // faolsiz emas), yorlig'ida strelka turadi.
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

  const Body = data.render || BODIES[data.role]
  const ctx = { data, audio, phase, solved, solve, record, setRight, answers, t, lang, screen }

  return (
    <Stage
      eyebrow={t(data.eyebrow)}
      right={right || (data.right ? t(data.right) : undefined)}
      block={block}
      screen={screen}
      total={total}
      section={sectionOfRole(data.role)}
      audio={audio}
      nav={nav}
    >
      <Title>{t(data.title)}</Title>
      {Body ? <Body {...ctx} /> : null}
    </Stage>
  )
}

// ============================================================
// 1. XUK. Ikki raqib javob, orasida umumiy son YO'Q. Baho YO'Q, yashil YO'Q:
// bu taxmin. O'ng ustunda har javobning to'plami son o'qida.
//
// Ma'lumot: expr, rows[{id, name, value, set|mark}], axis, probe.
// ============================================================
export function HookBody({ data, phase, solve, t }) {
  const open = Math.min(phase, data.rows.length)
  const askAt = data.askAt !== undefined ? data.askAt : (data.audio || []).length - 1
  return (
    <Cols l={1.05} r={1}>
      <Col>
        <Tag tone="accent">{t(data.badge || UI.mock)}</Tag>
        <Expr size="hero" style={{ textAlign: 'left' }}>{t(data.expr)}</Expr>
        {phase >= askAt ? (
          <div className="g11-in">
            <Probe
              data={data.probe}
              cols={2}
              fbSlot={data.fbSlot || 58}
              noShuffle
              unscored
              dense
              onSolved={(r) => solve({ ...r, predict: true })}
            />
          </div>
        ) : null}
      </Col>
      <Col>
        {data.rows.map((r, i) => (
          <Panel
            key={r.id}
            tone={i < open ? 'paper' : 'quiet'}
            className={i < open ? 'g11-reveal' : undefined}
            style={{ display: 'flex', flexDirection: 'column', gap: 5, opacity: i < open ? 1 : 0.32 }}
          >
            <Tag tone={i === 0 ? 'graph' : 'quiet'}>{t(r.name)}</Tag>
            <Expr size="big" style={{ textAlign: 'left' }} className={i < open ? 'g11-drop' : undefined}>
              {i < open ? t(r.value) : '?'}
            </Expr>
            {/* To'plam yoki NUQTALAR. Tengsizlikda javob oraliq (`set`),
                tenglamada esa ildizlar (`marks`) -- bitta o'q ikkalasini ham
                ko'rsatadi, chunki savol bir xil: qaysi sonlar javobda. */}
            {/* O'q FAQAT dars uni bergan bo'lsa. B1 blokida javob to'plam
                ham, nuqta ham emas -- u FUNKSIYA, va bo'sh o'q shov-shuv. */}
            {i < open && data.axis ? (
              <SolutionLine axis={data.axis} sets={r.set ? [r.set] : []} marks={r.marks || (r.mark ? [r.mark] : [])} />
            ) : null}
          </Panel>
        ))}
      </Col>
    </Cols>
  )
}

// ============================================================
// 2. TAYANCH. AVVAL uch kartochka (ovoz ochadi), KEYIN uch topshiriq.
// Kartochkalar yig'ilib bitta tugmaga aylanadi -- balandlik o'smaydi.
// ============================================================
export function SupportBody({ data, phase, audio, solve, t }) {
  const tasksAt = data.tasksAt !== undefined ? data.tasksAt : (data.audio || []).length - 1
  return (
    <>
      {/* Kirish gapi savollar ochilgunga qadar turadi: o'quvchi NIMA UCHUN
          eslayotganini bilishi kerak. */}
      {phase < tasksAt && data.lead ? <p className="g11-lead g11-drop">{t(data.lead)}</p> : null}
      <SupportCards
        cards={data.cards}
        tasks={data.tasks}
        open={Math.min(phase, data.cards.length)}
        showTasks={phase >= tasksAt}
        audio={audio}
        onStep={audio.step}
        onSolved={() => solve({ correct: null })}
      />
    </>
  )
}

// ============================================================
// 3. NUQTA BILAN TEKSHIRISH. O'quvchi sonni BOSHLANG'ICH yozuvga qo'yadi.
// Da'vogar javoblarning xulosasi FAQAT o'quvchi javob bergandan keyin
// bosiladi -- aks holda savol tekin bo'lib qoladi.
//
// Ma'lumot: expr, goal, rule, claims[{id, name, value, key}], points, axis,
//           sets, pick, probe.
// ============================================================
export function PointsBody({ data, phase, audio, solved, solve, answers, t, lang }) {
  const [shown, setShown] = useState([])
  const [marked, setMarked] = useState(false)
  const all = shown.length >= data.points.length
  const marks = data.points
    .filter((p) => shown.indexOf(p.id) !== -1 && p.mark !== undefined)
    .map((p) => ({ v: p.mark, tone: 'accent' }))

  // Xuk ekranidagi taxmin: qaysi javobni tanlagan edi.
  const rec = (answers || []).find((a) => a && a.predict && a.picked)
  const predicted = rec ? rec.picked : null

  // Xulosa ovozi UCHINCHI hisob TUGAGACH aytiladi. Ilgari u taymer bilan
  // chaqirilardi va oxirgi hisobning ustidan gapirib ketardi.
  useEffect(() => {
    if (!all || marked || audio.muted || audio.isPlaying) return undefined
    const id = setTimeout(() => { setMarked(true); audio.step(data.markStep || 'mark') }, 300)
    return () => clearTimeout(id)
  }, [all, marked, audio.muted, audio.isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  const breachOf = (key) => data.points.find(
    (p) => shown.indexOf(p.id) !== -1 && p.sol !== p[key],
  ) || null

  return (
    <>
      <Panel tone="teal" pad={8} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Expr size="row" style={{ textAlign: 'left' }}>{t(data.expr)}</Expr>
        {data.goal ? <Tag tone="graph">{t(data.goal)}</Tag> : null}
      </Panel>

      {/* MEZON bir gapda: nima uchun son qo'yayotganimiz. */}
      <Slot mh={20}>
        {phase >= 1 && data.rule ? <p className="g11-ask g11-drop">{t(data.rule)}</p> : null}
      </Slot>

      {phase >= 1 ? (
        <div className="g11-claims g11-reveal">
          {data.claims.map((c) => {
            const bad = solved ? breachOf(c.key) : null
            const why = bad
              ? tr(bad.sol ? UI.breakMiss : UI.breakHas, lang).replace(/\{v\}/g, bad.num)
              : null
            return (
              <Panel key={c.id} tone={solved && !bad ? 'paper' : 'quiet'} pad={8} className="g11-claim">
                <Tag tone="quiet">{t(c.name)}</Tag>
                <span className="g11-claim-v"><Fx>{t(c.value)}</Fx></span>
                {predicted === c.id ? <Tag tone="quiet">{t(UI.yourPick)}</Tag> : null}
                {solved
                  ? <Tag tone={bad ? 'tip' : 'ok'} className="g11-drop">{bad ? t(UI.breaks) : t(UI.agrees)}</Tag>
                  : <span className="g11-claim-q">?</span>}
                {why ? <span className="g11-hint g11-wrap">{why}</span> : null}
              </Panel>
            )
          })}
        </div>
      ) : <Slot mh={44} />}

      <Cols l={1} r={0.82}>
        <Col>
          {/* `label` va `num` FORMULA bo'lishi ham, SO'Z bo'lishi ham mumkin
              («ширина полосы»). So'z bo'lsa u uch tilli obyekt, va uni shu
              yerda tarjima qilmasak ekran yiqiladi. Asbob ichida `t` yo'q. */}
          <TestPointRows
            points={data.points.map((p) => (
              p.label !== undefined && typeof p.label === 'object'
                ? { ...p, label: t(p.label), num: typeof p.num === 'object' ? t(p.num) : p.num }
                : p
            ))}
            sequential
            /* Tugma ko'rsatma TUGAGACH ochiladi: aks holda o'quvchi birinchi
               soniyada bosib yuboradi va tekshirish MEZONI aytilmay qoladi. */
            lock={phase < (data.unlockAt !== undefined ? data.unlockAt : 2)}
            pickLabel={data.pick}
            subLabel={UI.substitute}
            onStep={audio.step}
            onRevealed={({ id }) => setShown((v) => (v.indexOf(id) === -1 ? v.concat(id) : v))}
          />
        </Col>
        <Col>
          {all ? (
            <div className="g11-in">
              {/* O'q FAQAT dars uni bergan bo'lsa: B1 blokida javob to'plam
                  emas, FUNKSIYA -- va bo'sh o'q asbobni yiqitardi. */}
              {data.axis ? <SolutionLine axis={data.axis} sets={data.sets} marks={marks} /> : null}
              <Probe audio={audio} data={data.probe} cols={2} fbSlot={data.fbSlot || 46} dense
                onSolved={solve} />
            </div>
          ) : null}
        </Col>
      </Cols>
    </>
  )
}

// ============================================================
// 4. CHIZMA va uning O'QDAGI SOYASI. Chegaradan chapda kirivi YO'Q --
// bu qoida emas, ekranda ko'rinadigan fakt.
//
// Ma'lumot: graph{fn, xDomain, yDomain, asymptote, hline, cross, shade,
// shadeLabel, xTicks, yTicks, height}, chip, probe, bonus.
// ============================================================
export function GraphBody({ data, phase, audio, solve, t }) {
  const [pt, setPt] = useState(null)
  const g = data.graph
  // B1 blokining 4-7 darslari: o'ng chegara O'QUVCHI qo'lida. Holat shu yerda
  // yashaydi, darsda emas -- dars faqat ma'lumot beradi.
  const [bx, setBx] = useState(g && g.bStart !== undefined ? g.bStart : (g ? g.a : 0))
  const lastPhase = (data.audio || []).length - 1
  const graphPhase = Math.min(phase, data.graphSteps || lastPhase)

  return (
    <>
      <Cols l={1.9} r={1} align="start">
        <Col>
          <Panel tone="paper" pad={10} style={{ minWidth: 0 }}>
            {/* B1 blokida `graph` roli boshqa asbobni chizadi: bir necha egri
              chiziq va urinmalar. Rol o'zgarmaydi -- MA'LUMOT o'zgaradi. */}
          {/* `note` MA'LUMOTDAN keladi va to'g'ridan to'g'ri `Fx` ga tushadi:
              uch tilli obyekt bo'lsa, ekran yiqiladi. Shuning uchun shu yerda
              tarjima qilinadi, asbob ichida emas. */}
          {/* B3 bloki: `graph` roli natijalar daraxtini chizadi. Rol
              o'zgarmaydi -- MA'LUMOT o'zgaradi, xuddi B1 dagidek. */}
          {data.solid
            ? (
              <SpinBoard
                {...data.solid}
                spin={data.solid.spin !== undefined ? data.solid.spin : Math.min(1, (graphPhase + 1) / (data.spinSteps || 3))}
                cut={data.solid.cuts ? data.solid.cuts[Math.min(graphPhase, data.solid.cuts.length - 1)] : data.solid.cut}
                disks={data.solid.diskSteps ? data.solid.diskSteps[Math.min(graphPhase, data.solid.diskSteps.length - 1)] : data.solid.disks}
                fill={data.solid.fills ? data.solid.fills[Math.min(graphPhase, data.solid.fills.length - 1)] : data.solid.fill}
                tilt0={data.solid.tilt0}
                interactive={data.solid.interactive}
                caption={data.solid.caption !== undefined ? t(data.solid.caption) : undefined}
                note={data.solid.note !== undefined ? t(data.solid.note) : undefined}
                vLabel={data.solid.vLabel !== undefined ? t(data.solid.vLabel) : undefined}
                rLabel={data.solid.rLabel !== undefined ? t(data.solid.rLabel) : undefined}
              />
            )
            : data.cells
            ? (
              <FrequencyBoard
                {...data.cells}
                filled={data.cellSteps ? Math.round((data.cells.total || 100) * Math.min(1, (graphPhase + 1) / data.cellSteps)) : undefined}
                caption={data.cells.caption !== undefined ? t(data.cells.caption) : undefined}
                note={data.cells.note !== undefined ? t(data.cells.note) : undefined}
                lineLabel={data.cells.lineLabel !== undefined ? t(data.cells.lineLabel) : undefined}
                xLabel={data.cells.xLabel !== undefined ? t(data.cells.xLabel) : undefined}
                yLabel={data.cells.yLabel !== undefined ? t(data.cells.yLabel) : undefined}
                groups={(data.cells.groups || []).map((g) => (
                  g.label !== undefined && typeof g.label === 'object' ? { ...g, label: t(g.label) } : g
                ))}
                bars={(data.cells.bars || []).map((b, bi) => {
                  // SINOV MASHINASI. `steps` bo'lsa, ustun balandligi
                  // ochilish qadamidan olinadi: 24-darsda o'quvchi seriyalar
                  // to'planib qo'ng'iroqqa aylanishini KO'RADI. Sonlarni dars
                  // beradi, tasodifiy generator emas -- aks holda har
                  // yuklanishda boshqa rasm chiqadi va o'lchov tekshiruvi
                  // hech narsani ushlamaydi.
                  const st = data.cells.steps
                  const n = st ? (st[Math.min(graphPhase, st.length - 1)] || [])[bi] : b.n
                  const lab = b.label !== undefined && typeof b.label === 'object' ? t(b.label) : b.label
                  return { ...b, label: lab, n: n === undefined ? b.n : n }
                })}
              />
            )
            : data.tree
            ? (
              <OutcomeTree
                {...data.tree}
                depth={graphPhase}
                sumLabel={data.tree.sumLabel !== undefined ? t(data.tree.sumLabel) : undefined}
                prodLabel={data.tree.prodLabel !== undefined ? t(data.tree.prodLabel) : undefined}
                leafLabel={data.tree.leafLabel !== undefined ? t(data.tree.leafLabel) : undefined}
                note={data.tree.note !== undefined ? t(data.tree.note) : undefined}
              />
            )
            : !g
              ? null
              : g.a !== undefined && g.fn
            ? (
              <AreaBoard
                {...g}
                b={bx}
                onB={data.drag === false ? undefined : setBx}
                areaLabel={g.areaLabel !== undefined ? t(g.areaLabel) : undefined}
                note={g.note !== undefined ? t(g.note) : undefined}
                fLabel={g.fLabel !== undefined ? t(g.fLabel) : undefined}
                sLabel={g.sLabel !== undefined ? t(g.sLabel) : undefined}
                phase={graphPhase}
              />
            )
            : g.curves
              ? <CurveBoard {...g} note={g.note !== undefined ? t(g.note) : undefined} phase={graphPhase} />
              : <GraphProjection {...g} phase={graphPhase} probe={data.drag !== false} onProbe={setPt} />}
          </Panel>
        </Col>
        <Col>
          {/* Yorliq emas, FORMULA: `Tag` uni katta harfga ko'taradi va
              «Y = LOG₅(X − 3)» bo'lib chiqadi. Matematika kaps bo'lmaydi. */}
          {data.chip ? <span className="g11-formula-chip"><Fx>{t(data.chip)}</Fx></span> : null}
          {/* Tortiladigan nuqta faqat ORALIQ javobli darsda ma'noli: u
              «bu yerda kirivi to'g'ri chiziqdan past» degan savolga javob
              beradi. Tenglamada javob nuqta, va surish chalg'itadi. */}
          {data.drag !== false && phase >= (data.dragAt !== undefined ? data.dragAt : 3) ? (
            <Panel tone="quiet" pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Tag tone="quiet">{t(UI_TXT.dragMe)}</Tag>
              {pt && isFinite(pt.y) ? (
                <span className="g11-expr g11-expr-sm">
                  {'x = ' + pt.x.toFixed(1).replace('.', ',') + '   →   ' + pt.y.toFixed(2).replace('.', ',') + '   '}
                  <span className={pt.y < g.hline ? 'g11-ok-text' : 'g11-tip-text'}>
                    {pt.y < g.hline ? '< ' + g.hline : '≥ ' + g.hline}
                  </span>
                </span>
              ) : (
                <span className="g11-expr g11-expr-sm g11-dim">{'x = ?'}</span>
              )}
            </Panel>
          ) : null}
          {phase >= lastPhase && data.bonus ? (
            <Insight label={t(UI.bonusLabel)} tone="graph">{t(data.bonus)}</Insight>
          ) : null}
        </Col>
      </Cols>
      {phase >= lastPhase ? (
        <div className="g11-in">
          <Probe audio={audio} data={data.probe} cols={2} fbSlot={data.fbSlot || 52} dense onSolved={solve} />
        </div>
      ) : null}
    </>
  )
}

// ============================================================
// 5 va 8. QOIDA. Savol OLDIN, kartochka KEYIN -- qoida kuzatishdan keyin
// keladi, yodlanmaydi. `swap` bo'lsa kartochka O'RNIGA jamlanma keladi.
//
// Ma'lumot: rows (ish yozuvi), cases (ixtiyoriy ikki holat paneli),
//           probe, rule, swap, gateAt, layout: 'cols' | 'stack'.
// ============================================================
export function RuleBody({ data, phase, audio, solve, t }) {
  const open = Math.min(phase + 1, data.rows.length)
  const gateAt = data.gateAt !== undefined ? data.gateAt : (data.audio || []).length - 1

  const notebook = (
    <Panel>
      <div className="g11-note-lines">
        {data.rows.map((r, i) => (
          <div
            key={i}
            className={'g11-expr g11-expr-row' + (i === open - 1 && i > 0 ? ' g11-drop' : '')}
            style={{ minHeight: data.numbered ? 34 : 32, opacity: i < open ? 1 : 0.16, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            {data.numbered ? (
              <span className="g11-mono" style={{ fontSize: '.6em', color: T.ink3, minWidth: 14, fontWeight: 700 }}>{i + 1}</span>
            ) : null}
            <span className={i === (data.pulseRow !== undefined ? data.pulseRow : 1) && open >= 2 ? 'g11-accent-pulse' : undefined}>
              <Expr size="row" style={{ textAlign: 'left' }}>{i < open ? t(r) : '?'}</Expr>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )

  const gate = phase >= gateAt ? (
    <RuleGate probe={data.probe} rule={data.rule} swap={data.swap} audio={audio} onStep={audio.step} onSolved={solve} />
  ) : (
    <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
      <Tag tone="quiet">{'…'}</Tag>
    </Panel>
  )

  const cases = data.cases ? (
    <Cols l={1} r={1} align="start">
      {data.cases.map((c, i) => (
        <Col key={i}>
          <Panel tone="quiet" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Tag tone={c.tone || (i === 0 ? 'graph' : 'accent')}>{t(c.label)}</Tag>
            <span className="g11-expr g11-expr-sm g11-wrap"><Fx>{t(c.text)}</Fx></span>
          </Panel>
        </Col>
      ))}
    </Cols>
  ) : null

  if (data.layout === 'stack') {
    return (
      <>
        {cases}
        {notebook}
        {phase >= gateAt ? <div className="g11-reveal">{gate}</div> : <Slot mh={44} />}
      </>
    )
  }

  return (
    <>
      {cases}
      <Cols l={1} r={1} align="start">
        <Col>{notebook}</Col>
        <Col>{gate}</Col>
      </Cols>
    </>
  )
}

// ============================================================
// 6. YANGI HOLAT. Chapda «edi», o'ngda «bo'ldi». Farqni o'quvchi topadi,
// keyin natijani TAXMIN qiladi -- taxminning to'g'riligi AYTILMAYDI, u
// yakun ekranigacha saqlanadi.
//
// Ma'lumot: was{label, expr, fig}, now{label, expr, fig}, probe1, probe2.
// `fig` -- ixtiyoriy chizma (masalan asos polzunogi): ({on}) => JSX.
// ============================================================
export function NewCaseBody({ data, phase, audio, record, solve, t }) {
  const [q1done, setQ1done] = useState(false)
  const shown = phase >= (data.showAt !== undefined ? data.showAt : 1)

  return (
    <>
      <Cols l={1} r={1} align="start">
        <Col>
          <Panel tone="quiet" pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Tag tone="quiet">{t(data.was.label || UI.was)}</Tag>
            <Expr size="big" style={{ textAlign: 'left' }}>{t(data.was.expr)}</Expr>
            {shown && data.was.fig ? data.was.fig(t) : null}
          </Panel>
        </Col>
        <Col>
          <Panel
            tone={shown ? 'paper' : 'quiet'}
            className={shown ? 'g11-reveal' : undefined}
            style={{ display: 'flex', flexDirection: 'column', gap: 7, opacity: shown ? 1 : 0.3 }}
          >
            <Tag tone="accent">{t(data.now.label || UI.now)}</Tag>
            <span className={shown ? 'g11-accent-pulse' : undefined}>
              <Expr size="big" style={{ textAlign: 'left' }}>{shown ? t(data.now.expr) : '?'}</Expr>
            </span>
            {shown && data.now.fig ? data.now.fig(t) : null}
          </Panel>
        </Col>
      </Cols>
      {phase >= (data.askAt !== undefined ? data.askAt : 2) && !q1done ? (
        <Probe audio={audio} data={data.probe1} cols={data.probe1.cols || 2} fbSlot={50} dense
          onSolved={(r) => { setQ1done(true); audio.step(data.predictStep || 'q2'); record(r) }} />
      ) : null}
      {q1done ? (
        <div className="g11-in">
          {/* Ustunlar soni MA'LUMOTDAN: uzun formulali variant to'rt ustunda
              telefonda chetdan chiqib ketadi. Berilmasa -- oldingidek to'rt. */}
          <Probe audio={audio} data={data.probe2} cols={data.probe2.cols || 4} fbSlot={54} unscored dense
            onSolved={(r) => solve({ ...r, predict: true })} />
        </div>
      ) : null}
    </>
  )
}

// ============================================================
// 7. IKKI NUQTA -- IKKI JAVOB. Har javobdan bitta son olinadi va
// BOSHLANG'ICH yozuvga qo'yiladi. XULOSA yorlig'i javob YOZILGANDAN keyin
// chiqadi: aks holda yashil yorliq kerakli kartochkani ko'rsatib qo'yadi va
// o'quvchiga ko'chirish qoladi.
//
// Ma'lumot: expr, axis, cards[{tag, set, txt, point{label, calc, verdict}}],
//           need, answer{numbers, value, wrongs, prompt}, answerLabel.
// ============================================================
export function TwoWayBody({ data, phase, audio, solved, solve, t }) {
  return (
    <>
      <Expr size="sm" className="g11-s7-expr">{t(data.expr)}</Expr>
      <Cols l={1} r={1} align="start">
        {data.cards.map((c, i) => {
          const on = phase >= i + 1
          return (
            <Col key={i}>
              <Panel tone={on ? 'paper' : 'quiet'} className={on ? 'g11-reveal' : undefined} pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: on ? 1 : 0.32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Tag tone={i === 0 ? 'graph' : 'quiet'}>{t(c.tag || (i === 0 ? UI.answerA : UI.answerB))}</Tag>
                  <span className="g11-expr g11-expr-row g11-graph-text">{t(c.txt)}</span>
                </div>
                {/* O'q FAQAT javob to'plam bo'lganda. Tenglama darsida
                    nomzod bu SON, va uni o'qqa qo'yish yolg'on ma'no beradi:
                    o'qda javob turadi, nomzod esa hali javob emas. */}
                {data.axis ? (
                  <SolutionLine axis={data.axis} sets={c.set ? [c.set] : []} marks={on && c.mark !== undefined ? [{ v: c.mark, tone: 'accent' }] : []} />
                ) : null}
                {/* Qo'yish AJRATILGAN satrlarda: nima qo'ydik, nima chiqdi,
                    nima kerak, xulosa. */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Sarlavha ham, qiymat ham PROZA bo'lishi mumkin («chapda
                      chiqdi» / «tanga eslamaydi»), formula esa emas. `g11-expr`
                      nowrap qo'yadi, va telefonda ikki ustunda satr chetdan
                      chiqib ketardi -- jim, chunki `.stage-content` clip qiladi.
                      Shuning uchun aynan bu ikki satrga wrap ruxsat berilgan. */}
                  <div className="g11-expr g11-expr-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="g11-wrap" style={{ color: T.ink3, flex: '0 1 auto', minWidth: 0 }}>{t(UI.headPut)}</span>
                    <span className={`g11-wrap ${on ? 'g11-drop' : 'g11-dim'}`} style={{ flex: '1 1 auto', minWidth: 0, textAlign: 'right' }}>{on ? t(c.point.label) : '?'}</span>
                  </div>
                  <div className="g11-expr g11-expr-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="g11-wrap" style={{ color: T.ink3, flex: '0 1 auto', minWidth: 0 }}>{t(UI.headGot)}</span>
                    <span className={`g11-wrap ${on ? 'g11-drop' : 'g11-dim'}`} style={{ flex: '1 1 auto', minWidth: 0, textAlign: 'right' }}>{on ? t(c.point.calc) : '?'}</span>
                  </div>
                  <div className="g11-expr g11-expr-sm" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: T.ink3 }}>{t(UI.need)}</span>
                    {/* «kerak» ustuni FORMULA ham (`> −1`), SO'Z ham
                        (`ikkala tenglama ham`) bo'lishi mumkin. */}
                    <span className="g11-graph-text">{t(data.need)}</span>
                    <Slot mh={0}>
                      {solved ? (
                        <Tag tone={c.point.verdict === 'in' ? 'ok' : 'tip'} className="g11-drop">
                          {c.point.verdict === 'in' ? t(UI.isIn) : t(UI.isNotIn)}
                        </Tag>
                      ) : null}
                    </Slot>
                  </div>
                </div>
              </Panel>
            </Col>
          )
        })}
      </Cols>
      {phase >= (data.writeAt !== undefined ? data.writeAt : 3) ? (
        <div className="g11-in" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {solved && data.answerLabel ? (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
              <span className="g11-expr g11-expr-sm g11-ok-text g11-drop">{t(UI.soAnswer) + ': ' + t(data.answerLabel)}</span>
            </div>
          ) : null}
          {data.answer.kind === 'value' ? (
            <AnswerValue
              numbers={data.answer.numbers}
              answer={data.answer.value}
              wrongs={data.answer.wrongs}
              prompt={data.answer.prompt}
              slots={data.answer.slots || 1}
              label={data.answer.label !== undefined ? t(data.answer.label) : undefined}
              padSlot={20}
              fbSlot={54}
              audio={audio}
              onSolved={(r) => { if (r.correct) solve({ correct: true }) }}
            />
          ) : (
            <AnswerInterval
              numbers={data.answer.numbers}
              answer={data.answer.value}
              wrongs={data.answer.wrongs}
              prompt={data.answer.prompt}
              padSlot={20}
              fbSlot={54}
              audio={audio}
              onSolved={(r) => { if (r.correct) solve({ correct: true }) }}
            />
          )}
        </div>
      ) : null}
    </>
  )
}

// ============================================================
// 9. BELGINI O'ZI QO'YADI. Kuzatishdan harakatga o'tish: tekshiruv SON
// QO'YIB bajariladi, «to'g'ri/xato» degan so'z bilan emas.
// ============================================================
export function SignBody({ data, audio, solve, t }) {
  const [placed, setPlaced] = useState(false)
  return (
    <Cols l={1.2} r={1} align="start">
      <Col>
        <Expr size="mid" style={{ textAlign: 'left' }}>{t(data.left)}</Expr>
        <SignFill
          template={data.template}
          signs={data.signs}
          answer={data.answer}
          checkNote={data.checkNote}
          wrongs={data.wrongs}
          audio={audio}
          onStep={(n) => { audio.step(n); if (n === 'checked') setPlaced(true) }}
          onSolved={() => setPlaced(true)}
        />
      </Col>
      <Col>
        {placed ? (
          <div className="g11-in">
            <Probe audio={audio} data={data.probe} cols={1} fbSlot={58} dense onSolved={solve} />
          </div>
        ) : (
          <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
            <Tag tone="quiet">{'…'}</Tag>
          </Panel>
        )}
      </Col>
    </Cols>
  )
}

// ============================================================
// 10 va 11. QADAMBA-QADAM QAYTA YOZISH. Son o'qi FAQAT xato qadamda va
// javob yozilgandan keyin yonadi. `noLine` -- o'q umuman yo'q (imtihondagidek).
// ============================================================
export function ChainBody({ data, audio, solve, t }) {
  return (
    <>
      {/* DTM da funksiya ko'pincha FORMULA bilan emas, CHIZMA bilan beriladi:
          «rasmga qarab integralni hisoblang». Shuning uchun zanjir ekrani ham
          chizma qabul qiladi -- `fig(t)`, xuddi 6-ekrandagidek. */}
      {data.fig ? data.fig(t) : null}
      <TransformChain
      split={data.split !== false}
      noLine={data.noLine}
      solo={data.solo}
      start={data.start}
      steps={data.steps}
      actions={data.actions}
      axis={data.axis}
      correctSet={data.correctSet}
      answer={data.answer}
      hintText={data.hint}
      audio={audio}
      onStep={audio.step}
      onSolved={() => solve({ correct: true })}
      />
    </>
  )
}

// ============================================================
// 12. BLITS. YAGONA baholanadigan ekran. Ballga BIRINCHI urinish kiradi.
// Savollar SONI ma'lumotdan hisoblanadi, songa yozilmaydi.
// ============================================================
export function BlitzBody({ data, audio, record, solve, setRight, t }) {
  const [n, setN] = useState(0)
  const first = useRef([])
  const len = data.items.length

  // Brovkadagi hisoblagich: joriy savolning raqami, oxirida `6/6`.
  // Son MA'LUMOTDAN olinadi -- ilgari u darsda qo'lda yozilgan edi va
  // savol qo'shilganda eskirib qolardi.
  useEffect(() => { setRight((n >= len ? len : n + 1) + '/' + len) }, [n, len]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', gap: 6 }}>
          {data.items.map((q, i) => (
            <span
              key={q.id}
              className="g11-mono"
              style={{
                width: 22, height: 22, borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                background: i < n ? T.okSoft : i === n ? T.accentSoft : 'rgba(23,26,29,.05)',
                color: i < n ? T.ok : i === n ? T.accent : T.ink3,
                boxShadow: i === n ? 'inset 0 0 0 1px rgba(201,84,44,.35)' : 'none',
                transition: 'background .24s cubic-bezier(.22,.61,.36,1), color .24s',
              }}
            >
              {i < n ? '✓' : i + 1}
            </span>
          ))}
        </span>
        <SoftTimer running={n < data.items.length} />
        <Tag tone="quiet">{t(UI.goesToResult)}</Tag>
      </div>
      <Panel>
        <ProbeChain
          items={data.items}
          cols={2}
          audio={audio}
          onStep={audio.step}
          onEach={(r) => {
            setN((prev) => prev + 1)
            first.current = first.current.concat((r.attempts || 1) === 1 && r.correct)
            record({ blitz: true, id: r.id, tag: r.tag, correct: r.correct, attempts: r.attempts })
          }}
          onSolved={() => solve({
            correct: true,
            blitzTotal: data.items.length,
            blitzFirst: first.current.filter(Boolean).length,
          })}
        />
      </Panel>
    </>
  )
}

// ============================================================
// 13. XATONI TOPISH. Hamma qadam to'g'ri KO'RINADI, javob esa xato.
// Har darsda MAJBURIY: javobni tekshirmaslik -- KUCHLILARNING xatosi
// (Ganesan & Dindyal: yuqori uchdan birda 26,9%, pastda 7,9%).
// ============================================================
export function AuditBody({ data, audio, record, solve, t }) {
  const [found, setFound] = useState(false)
  return (
    <Cols l={1} r={0.92} align="start">
      <Col>
        <AuditRows
          hideProof
          rows={data.rows}
          answerId={data.answerId}
          hints={data.hints}
          proof={data.proof}
          audio={audio}
          onStep={(nm) => {
            audio.step(nm)
            if (nm === 'proof') { setFound(true); setTimeout(() => audio.step(data.ruleStep || 'q2'), 900) }
          }}
          onSolved={(r) => record({ ...r, tag: 'check_by_point' })}
        />
      </Col>
      <Col>
        {found ? (
          <>
            <Panel tone="teal" className="g11-in" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span className="g11-formula-chip"><Fx>{t(data.proofPoint)}</Fx></span>
              <span className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.ink }}><Fx>{t(data.proof)}</Fx></span>
            </Panel>
            <Probe audio={audio} data={data.probe} cols={1} fbSlot={40} dense onSolved={solve} />
          </>
        ) : (
          <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
            <Tag tone="quiet">{'…'}</Tag>
          </Panel>
        )}
      </Col>
    </Cols>
  )
}

// ============================================================
// 14. TESKARI MASALA. Berilgan javob bo'yicha yozuvni yig'ish -- strukturani
// tushunganini to'g'ridan-to'g'ri hisoblashdan yaxshiroq ko'rsatadi.
// ============================================================
export function BuildBody({ data, audio, solve, t }) {
  return (
    <Cols l={1.15} r={1} align="start">
      <Col>
        <BuildExpr tasks={data.tasks} audio={audio} onStep={audio.step} onSolved={() => solve({ correct: true })} />
      </Col>
      <Col>
        <Panel tone="teal" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Tag tone="graph">{t(data.targetLabel || UI.target)}</Tag>
          <Expr size="big" style={{ textAlign: 'left' }}>{t(data.targetValue)}</Expr>
          {/* O'q ixtiyoriy: teskari masalada maqsad to'plam ham, funksiya ham
              bo'lishi mumkin. */}
          {data.axis ? <SolutionLine axis={data.axis} sets={data.sets} marks={data.marks} /> : null}
        </Panel>
      </Col>
    </Cols>
  )
}

// ============================================================
// 15. YAKUN. Taxmin -> isbotlangan javob, darsning qoidasi, DTM tayyorligi.
// Medal, konfetti, maskot YO'Q: 11-sinf -- bu 17-18 yosh va bir yildan keyin
// imtihon.
// ============================================================
export function SummaryBody({ data, phase, audio, answers, solve, t }) {
  const blitz = (answers || []).filter((a) => a && a.blitz)
  const firstTry = blitz.filter((a) => a.correct && (a.attempts || 1) === 1)
  const total = blitz.length || data.blitzTotal || 6
  const level = firstTry.length >= total ? 'full' : firstTry.length >= total - 2 ? 'one' : 'low'
  const weak = blitz.find((a) => !a.correct || (a.attempts || 1) > 1)
  const predicts = (answers || []).filter((a) => a && a.predict)

  return (
    <>
      <Cols l={1.25} r={1} align="start">
        <Col>
          <span className="g11-hide-tight"><Tag tone="quiet">{t(UI.learned)}</Tag></span>
          <Panel tone="quiet" pad={9} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.ruleLines.map((l, i) => (
              <div
                key={i}
                className={phase >= 2 ? 'g11-reveal' : undefined}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 9, minHeight: 22,
                  opacity: phase >= 2 ? 1 : 0.22, animationDelay: i * 0.09 + 's',
                }}
              >
                <span className="g11-mono" style={{ fontSize: 11, fontWeight: 800, color: T.accent, minWidth: 14 }}>
                  {'0' + (i + 1)}
                </span>
                <span className="g11-expr g11-expr-sm g11-wrap" style={{ color: T.ink }}><Fx>{t(l)}</Fx></span>
              </div>
            ))}
          </Panel>

          <Tag tone="accent">{t(UI.predictToProved)}</Tag>
          {/* pad 8, gap 2: yakun ekrani eng tor noutbukda 5 px oshib ketardi
              (prokliklash topdi). Balandlik shu ikki sondan yig'iladi. */}
          <Panel pad={8} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.predicts.map((pr) => {
              const rec = predicts.find((a) => a.screen === pr.screen)
              const mine = rec ? pr.map[rec.picked] || '—' : '—'
              const hit = mine === pr.right
              return (
                <div
                  key={pr.screen}
                  className="g11-expr g11-expr-sm"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) auto 14px auto', gap: 8, alignItems: 'center', minHeight: 26, opacity: phase >= 1 ? 1 : 0.16 }}
                >
                  <span><Fx>{t(pr.expr)}</Fx></span>
                  <span style={{ color: hit ? T.ok : T.ink2 }}>{phase >= 1 ? t(mine) : '?'}</span>
                  <span style={{ color: T.ink3, textAlign: 'center' }}>{'→'}</span>
                  <span className={phase >= 1 ? 'g11-ok-text' : undefined}>{phase >= 1 ? t(pr.right) : '?'}</span>
                </div>
              )
            })}
            {/* «Biz shundan boshlagan edik»: xuk masalasi endi bir satrda
                yechiladi. ALOHIDA panel emas -- 1366x615 da ekran 15 px
                oshib ketardi (prokliklash topdi). Yorliq ham yo'q: uni ovoz
                aytadi, ekranda esa faqat yechim turadi. */}
            {data.backToHook ? (
              <div
                className="g11-expr g11-expr-sm g11-wrap"
                style={{
                  borderTop: '1px solid ' + T.line,
                  paddingTop: 3,
                  marginTop: 0,
                  color: T.ink2,
                  opacity: phase >= 2 ? 1 : 0.16,
                }}
              >
                <Fx>{t(data.backToHook.line)}</Fx>
              </div>
            ) : null}
          </Panel>

          {phase >= 3 ? (
            <Probe audio={audio} data={data.probe} cols={2} fbSlot={38} dense onSolved={solve} />
          ) : null}
        </Col>

        <Col>
          <Panel style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <RingProgress
              value={firstTry.length}
              total={total}
              size={84}
              label={t(UI.dtmReady)}
              sub={phase >= 3 ? t(data.levels[level]) : ''}
            />
            {phase >= 3 && level === 'one' && weak && weak.tag ? (
              <Tag tone="tip">{t(UI.weakSpot) + ': ' + t(TAG_NAMES[weak.tag] || '')}</Tag>
            ) : null}
          </Panel>
        </Col>
      </Cols>
      <PrintSheet
        title={t(data.sheetTitle)}
        law={t(data.law)}
        steps={data.ruleLines.map((l) => t(l))}
        lifehack={t(data.lifehack)}
        source={t(data.sheetSrc)}
      />
    </>
  )
}

const BODIES = {
  hook: HookBody,
  support: SupportBody,
  points: PointsBody,
  graph: GraphBody,
  rule: RuleBody,
  newcase: NewCaseBody,
  twoway: TwoWayBody,
  sign: SignBody,
  chain: ChainBody,
  blitz: BlitzBody,
  audit: AuditBody,
  build: BuildBody,
  summary: SummaryBody,
}

// ============================================================
// DARSNING ILDIZI. LMS proplari, til, ovoz sozlamasi, ekranlar bo'yicha
// yurish, natijani yuborish. Hamma darsda bir xil, shuning uchun bu yerda.
//
// `meta` = { id, title } -- dars belgisi: `lesson_id` va uch tildagi
// `lesson_name` OVOZ so'roviga ham, LMS ga ham shundan ketadi.
// `block` = { label, from, to, current } -- shapkadagi dars RAQAMI ham
// shundan olinadi (`current`).
// ============================================================
export function makeLesson({ meta, block, screens, voice = 'm' }) {
  const TOTAL = screens.length

  return function Grade11Lesson({
    studentName,
    lang: langProp,
    ttsApiBase,
    voiceGender,
    correctSoundUrl,
    wrongSoundUrl,
    aiGradingEndpoint,
    onFinished,
  }) {
    const [lang, setLang] = useState(
      langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz',
    )
    useEffect(() => {
      if (langProp === 'uz' || langProp === 'ru' || langProp === 'en') setLang(langProp)
    }, [langProp])

    configureLesson({
      ttsApiBase: ttsApiBase || '',
      correctSoundUrl: correctSoundUrl || '',
      wrongSoundUrl: wrongSoundUrl || '',
      aiGradingEndpoint: aiGradingEndpoint || '',
      studentName: studentName || '',
      voiceGender: voiceGender || voice,
      lessonId: meta.id,
      lessonTitle: meta.title,
    })
    useMobileZoom()

    const [screen, setScreen] = useState(0)
    const [answers, setAnswers] = useState([])
    const [finished, setFinished] = useState(false)
    // Vaqtni renderda emas, effektda olamiz: render toza qolishi kerak.
    const startedAt = useRef(0)
    useEffect(() => { startedAt.current = Date.now() }, [])

    const onAnswer = useCallback((payload) => {
      setAnswers((prev) => prev.concat(payload))
    }, [])

    const next = useCallback(() => setScreen((s) => Math.min(s + 1, TOTAL - 1)), [])
    const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])

    const finish = useCallback(() => {
      setFinished(true)
      // Baholanadi FAQAT blits. Qolgan ekranlar diagnostik teg beradi.
      const blitz = answers.filter((a) => a && a.blitz)
      const firstTry = blitz.filter((a) => a.correct && (a.attempts || 1) === 1)
      const gaps = {}
      answers.forEach((a) => {
        if (!a || !a.tag) return
        if (a.correct === false || (a.attempts && a.attempts > 1)) gaps[a.tag] = (gaps[a.tag] || 0) + 1
      })
      const blitzScreen = screens.findIndex((s) => s.role === 'blitz')
      const payload = {
        lessonId: meta.id,
        lessonTitle: tr(meta.title, lang),
        lang,
        completed: true,
        durationSec: startedAt.current ? Math.floor((Date.now() - startedAt.current) / 1000) : 0,
        scoredScreen: blitzScreen === -1 ? null : blitzScreen + 1,
        totalQuestions: blitz.length,
        correctAnswers: blitz.filter((a) => a.correct).length,
        firstTryStats: { total: blitz.length, firstTryCorrect: firstTry.length },
        gaps,
        answers,
      }
      if (onFinished) onFinished(payload)
      else console.log('[Grade11 ' + meta.id + '] onFinished', payload)
    }, [answers, lang, onFinished])

    return (
      <LangProvider value={lang}>
        <LangSetProvider value={setLang}>
          <style>{STYLES}</style>
          <div className="lesson-root" lang={lang}>
            <BgCurves />
            {/* `key` SHART: hamma ekran BITTA `Screen` komponenti, kalitsiz
                React uni qayta yaratmaydi va oldingi ekranning holati
                (javob berilgan, faza oxirida) yangisiga o'tib qolardi. */}
            <Screen
              key={screen}
              data={screens[screen]}
              block={block}
              screen={screen}
              total={TOTAL}
              lang={lang}
              answers={answers}
              onAnswer={onAnswer}
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
}
