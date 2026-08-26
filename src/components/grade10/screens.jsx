// ============================================================================
// 10-sinf: EKRAN QATLAMI. Bir marta yozilgan o'ram, hamma darslar uchun.
//
// NEGA BU FAYL BOR. `Dars03.jsx` da har ekran atrofida bir xil o'ram yotardi:
// segmentlar, `useAudio`, `useNarratedSteps`, `solved` holati, `Frame`, tegni
// hisobotga uzatish -- ekranga o'rtacha 35 satr, darsga 570 satr. 53 darsda bu
// 30 mingdan ortiq satr, va har birida tegni yoki ovozni unutish MUMKIN.
//
// Endi dars faylida faqat MA'LUMOT va matematika qoladi (etalon §5.3).
//
// NIMA BU YERDA:
//   A, buildAuto, textsOf   -- ovoz bo'laklari
//   UI                      -- hamma darsda bir xil yozuvlar (Davom, Orqaga, ...)
//   Screen                  -- o'ram: ovoz, faza, solved, Frame, teg
//   HookBody, RuleBody, BlitzBody, SummaryBody -- to'rt rolning TAYYOR tanasi:
//       ular matematikaga bog'liq emas, faqat ma'lumotga
//   makeLesson              -- darsning ildiz komponenti
//   DtmClock, DtmBody, DtmMapBody -- DTM REJIMI (§11), pastda alohida bo'lim
//
// NIMA BU YERDA YO'Q: tushuntirish va mashq ekranlarining tanasi. Ularda
// matematika har darsda boshqa, tayyor qolipga solish -- 7-sinf xatosi.
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
  Insight,
  L,
  LangProvider,
  LangSetProvider,
  Options,
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
import { NumberEntry, Probe, ProbeChain, RuleGate, Scene } from './tools.jsx'

export const TOTAL = 15

// ============================================================
// OVOZ. `A(on, uz, ru, en)` -- bitta bo'lak. `on` -- nomi: shu nom
// `waitFor` ro'yxatida bo'lsa, bo'lak ekran hodisasini KUTADI.
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

export const textsOf = (list, lang) => (list || []).map((s) => tr(s.text, lang))

// ============================================================
// HAMMA DARSDA BIR XIL YOZUVLAR. Darsga tegishli yozuvlar (shpargalka
// sarlavhasi, layfxak) dars faylida qoladi.
// ============================================================
export const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  predictToProved: L('Boshdagi taxmin → tekshirilgan javob', 'Прогноз в начале → проверенный ответ', 'Initial guess → verified answer'),
  learned: L("Nimani o'rgandingiz", 'Что ты узнал', 'What you learned'),
  readiness: L('Tayyorlik', 'Готовность', 'Readiness'),
  // Inglizcha qisqa: brovkada o'ngda blok xaritasi ham turadi, uzun yozuv
  // telefonda chapdagini siqib qo'yardi (etalon §6.4).
  goesToResult: L('Natijaga kiradi', 'Идёт в результат', 'Counts to result'),
}

// ============================================================
// EKRAN O'RAMI. Sarlavha, blok xaritasi, navigatsiya -- va ekranning
// o'z tanasi funksiya sifatida beriladi.
//
// Tanaga beriladigan narsalar:
//   audio  -- ovoz dvijoki (asboblarga uzatiladi)
//   phase  -- ochilish fazasi: ovoz bo'lagi tugagach o'sadi
//   solved -- topshiriq yopildimi
//   solve  -- yopish: `solved` ni qo'yadi VA tegni hisobotga uzatadi
//   stage  -- bir ekranda ikki qadam bo'lganda (masalan son, keyin tartib)
//   setStage, setTitle
// ============================================================
export function Screen({ data, block, waitFor, right, screen, sect, onAnswer, children, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildAuto(data.audio, rest.lang, waitFor), [rest.lang]) // eslint-disable-line react-hooks/exhaustive-deps
  const audio = useAudio(segments)
  const phase = useNarratedSteps(audio, textsOf(data.audio, rest.lang))
  const [solved, setSolved] = useState(false)
  const [stage, setStage] = useState(0)
  const [title, setTitle] = useState(null)
  const canNext = useAdvanceGate(data.role === 'summary' ? true : solved, audio)
  const last = screen === TOTAL - 1

  // Teg hisobotga SHU yerdan ketadi. Ekran tanasi uni unutishi mumkin emas.
  const solve = useCallback((r) => {
    setSolved(true)
    if (onAnswer) onAnswer({ ...(r || {}), screen, tag: data.tag })
  }, [onAnswer, screen, data.tag])

  const nav = {
    // 1-4-sinf naqshi (metodist, 2026-08-11): yorliqda STRELKA bor, birinchi
    // ekranda tugma umuman chizilmaydi -- bo'sh joy, kulrang tugma emas.
    back: screen === 0 ? null : (
      <Btn tone="ghost" onClick={rest.onPrev}>
        <span aria-hidden="true">{'←'}</span>{'  '}{t(UI.back)}
      </Btn>
    ),
    next: last ? (
      <Btn tone="accent" ready={!rest.finished} onClick={rest.onFinish} disabled={rest.finished}>
        {rest.finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={rest.onNext} disabled={!canNext} ready={solved}>{t(UI.next)}</Btn>
    ),
  }

  return (
    <Stage
      eyebrow={t(data.eyebrow)}
      // «Идёт в результат» ставит ОБЩИЙ слой: оценивается ровно один экран
      // (§4.2), и это правило класса, а не решение автора урока.
      // `right` FUNKSIYA ham bo'ladi: DTM rejimida bu yerda yumshoq soat
      // turadi, va u javob berilgach to'xtashi kerak, ya'ni `solved` ni
      // ko'rishi kerak. `solved` esa shu komponentning ichida yashaydi.
      right={(typeof right === 'function' ? right({ solved }) : right)
        || (data.role === 'blitz' ? t(UI.goesToResult) : undefined)}
      block={block}
      sect={sect}
      screen={screen}
      total={TOTAL}
      audio={audio}
      nav={nav}
    >
      <Title>{t(title || data.title)}</Title>
      {children({ audio, phase, solved, solve, stage, setStage, setTitle, t })}
    </Stage>
  )
}

// ============================================================
// XUK (1-ekran). Ikki raqib yozuv, orasida `≠`, plus «ikkisi ham» va
// «hech qaysi». Baho YO'Q, yashil YO'Q: bu taxmin (etalon §4.4).
// Matematikaga bog'liq emas -- shuning uchun tanasi shu yerda.
//
// Ma'lumot: rows[{id, name, value}], probe, expr, fig (ixtiyoriy).
// ============================================================
export function HookBody({ data, phase, solve, fig, t }) {
  const [picked, setPicked] = useState(null)
  const open = Math.min(phase, data.rows.length)
  return (
    <Cols l={1} r={1}>
      <Col>
        <Tag tone="accent">{t(data.eyebrow)}</Tag>
        {data.expr ? <Expr size="hero" style={{ textAlign: 'left' }}>{data.expr}</Expr> : null}
        {phase >= 2 ? (
          <div className="g10-in">
            <Probe
              data={data.probe}
              cols={2}
              fbSlot={52}
              noShuffle
              unscored
              dense
              onSolved={(r) => { setPicked(r.picked); solve(r) }}
            />
          </div>
        ) : null}
      </Col>
      <Col>
        {data.rows.map((r, i) => (
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
        {fig ? <Panel tone="quiet" style={{ padding: 4 }}>{fig(!!picked)}</Panel> : null}
      </Col>
    </Cols>
  )
}

// ============================================================
// QOIDA (8-ekran). Chapda chizma, o'ngda farqlash savoli va uning
// ortidagi qoida kartochkasi. Kartochka javobdan KEYIN ochiladi,
// gacha o'sha balandlikda qulf turadi.
// ============================================================
export function RuleBody({ data, audio, solved, solve, fig }) {
  return (
    <Cols l={1} r={1.05}>
      <Col>{fig ? fig(solved) : null}</Col>
      <Col>
        {/* `onStep` SHART. Qoida ekranining ikkinchi replikasi `on_event:rule`
            ni kutadi, ya'ni kartochka ochilishini. Bu hodisani `RuleGate`
            `onStep` orqali yuboradi, va u uzatilmasa replika HECH QACHON
            aytilmaydi -- straj ham yordam bermaydi, chunki hodisani kutayotgan
            bo'lak taymer bilan siljimaydi. 3-darsda shu sababli qoida jim
            turgan edi (topildi 2026-08-12). */}
        <RuleGate
          probe={data.probe}
          rule={data.rule}
          audio={audio}
          onStep={(name) => audio.step(name)}
          onSolved={solve}
        />
      </Col>
    </Cols>
  )
}

// ============================================================
// BLITS (14-ekran). To'rt savol bitta panelda, YAGONA baholanadigan ekran.
// Ballga BIRINCHI urinish kiradi. Savollar soni MA'LUMOTDAN hisoblanadi,
// son bilan yozilmaydi (etalon §4.2).
// ============================================================
export function BlitzBody({ data, audio, solve, fig, screen, onAnswer }) {
  const [round, setRound] = useState(0)
  const first = useRef([])
  return (
    <Cols l={1} r={1}>
      <Col>{fig ? fig(round) : null}</Col>
      <Col>
        <ProbeChain
          items={data.items}
          cols={2}
          audio={audio}
          onStep={() => setRound((r) => r + 1)}
          onEach={(r) => { first.current = first.current.concat(r.attempts === 1) }}
          onSolved={() => solve({
            correct: true,
            blitz: { total: data.items.length, first: first.current.filter(Boolean).length },
          })}
        />
      </Col>
    </Cols>
  )
}

// ============================================================
// YAKUN (15-ekran). Ikki ustun: chapda taxmin va natija, tayyorlik SO'Z
// bilan; o'ngda «endi nima qilaman» va chop etiladigan shpargalka.
// Yangi matematika va yangi kiritish YO'Q. Qoralama bloki OLIB TASHLANDI
// (metodist, 2026-08-11).
// ============================================================
export function SummaryBody({ data, answers, t }) {
  const hook = answers && answers[0] ? answers[0].picked : null
  const blitz = (answers || []).reduce((acc, a) => (a && a.blitz ? a.blitz : acc), null)
  const got = blitz ? blitz.first : 0
  const total = blitz ? blitz.total : (data.blitzTotal || 4)
  const level = got >= total ? data.levels.full : got >= total - 1 ? data.levels.gap : data.levels.back
  const guess = hook && data.hookLabels ? data.hookLabels[hook] : null

  return (
    <>
      <Cols l={1} r={1}>
        <Col>
          <Panel style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Tag tone="graph">{t(UI.predictToProved)}</Tag>
            <Expr size="mid" style={{ textAlign: 'left', color: T.ink2 }}>
              {(guess || '?') + '   →   ' + data.proved}
            </Expr>
          </Panel>
          <Panel tone="quiet" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <RingProgress value={got} total={total} label={t(UI.readiness)} size={76} />
            <span className="g10-hint" style={{ textAlign: 'left' }}>{t(level)}</span>
          </Panel>
          <Insight label="→">{t(data.bridge)}</Insight>
        </Col>
        <Col>
          <Panel style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Tag tone="ok">{t(UI.learned)}</Tag>
            {data.can.map((c, i) => (
              <span key={i} className="g10-hint" style={{ textAlign: 'left', fontSize: 13, lineHeight: 1.34 }}>
                {'✓  ' + t(c)}
              </span>
            ))}
          </Panel>
        </Col>
      </Cols>
      <PrintSheet
        title={t(data.sheetTitle)}
        law={data.law}
        steps={data.sheetSteps}
        lifehack={t(data.lifehack)}
        source={t(data.sheetSrc)}
      />
    </>
  )
}

// ============================================================
// DARSNING ILDIZI. LMS proplari, til, ovoz sozlamasi, ekranlar bo'yicha
// yurish, natijani yuborish. Hamma darsda bir xil, shuning uchun bu yerda.
//
// `meta` = { id, no, title } -- dars belgisi. `lesson_id` va uch tildagi
// `lesson_name` ovoz so'roviga ham, LMS ga ham shundan ketadi.
// ============================================================
// ============================================================
// REJIM DTM (PODXOD_10SINF.md §11). Bu ALOHIDA ASBOB EMAS, tayyor
// asboblarning ISHLASH REJIMI: kurs shu yerda ikkiga bo'linadi -- asosiy
// chiziq programma bo'yicha boradi, DTM tarmog'i esa o'sha asboblarda
// imtihonga tayyorlaydi.
//
// TO'RT FARQI, hammasi §11 dan:
//   1. topshiriq DARROV beriladi, tushuntirishsiz;
//   2. ekranda YUMSHOQ soat: vaqtni ko'rsatadi, lekin urinishni olmaydi;
//   3. javobdan keyin razbor OCHILMAYDI -- o'rniga bu YIL qaysi darsda
//      ko'rilgani aytiladi va o'sha darsga o'tish beriladi;
//   4. natija bitta foizga emas, BLOKLAR bo'yicha bo'shliqlar xaritasiga
//      yig'iladi.
//
// NEGA REJIM BIR MARTA YOZILADI. Agar uni B8 ning birinchi darsidan oldin
// yozmasak, blokning yetti darsi yettita BIR MARTALIK darsga aylanadi --
// 7-sinfda aynan shu bo'lgan (§11 ning oxirgi jumlasi).
//
// NEGA RAZBOR YO'Q. Razbor -- o'qish materiali, imtihonda esa vaqt kam va
// bo'shliq boshqa joyda: o'quvchi mavzuni BILMAYDI, va unga bir ekranlik
// izoh emas, o'sha DARS kerak. Shuning uchun bu yerda manzil beriladi.
// ============================================================

export const DTM_UI = {
  time: L('Vaqt', 'Время', 'Time'),
  where: L("Bu yil qaysi darsda", 'В каком уроке года это было', 'Where in the year this was'),
  lesson: L('dars', 'Урок', 'Lesson'),
  open: L("Darsni ochish", 'Открыть урок', 'Open the lesson'),
  map: L("Bo'shliqlar xaritasi", 'Карта пробелов', 'The gap map'),
  ofTotal: L('dan', 'из', 'of'),
  again: L("Qaytish kerak", 'Нужно вернуться', 'Needs a return'),
  clean: L('Mustahkam', 'Твёрдо', 'Solid'),
  noData: L("Bu blokdan topshiriq bo'lmadi", 'По этому блоку заданий не было', 'No tasks from this block'),
  whatNext: L('Nima qilish kerak', 'Что делать', 'What to do'),
}

// YUMSHOQ SOAT. Vaqtni ko'rsatadi va TO'XTATMAYDI: urinish olinmaydi,
// muddat yo'q. Javob berilgach hisob to'xtaydi -- topshiriqqa ketgan vaqt
// ekranda qoladi.
//
// `running` REF da ushlanadi. Uni `useEffect` ning ro'yxatiga qo'yish taymerni
// har o'zgarishda qaytadan boshlardi -- bu 8-sinfda bo'lgan grabli
// («onStep in deps otmenyaet taymer»), va u bir xil ko'rinadi.
export function DtmClock({ running }) {
  const t = useT()
  const [sec, setSec] = useState(0)
  const runRef = useRef(running)
  runRef.current = running
  useEffect(() => {
    const id = setInterval(() => { if (runRef.current) setSec((v) => v + 1) }, 1000)
    return () => clearInterval(id)
  }, [])
  const mm = Math.floor(sec / 60)
  const ss = sec % 60
  return (
    <Tag tone={running ? 'quiet' : 'ok'}>
      {t(DTM_UI.time) + ' ' + mm + ':' + (ss < 10 ? '0' + ss : ss)}
    </Tag>
  )
}

// DTM TOPSHIRIG'I. Ma'lumot:
//   task     -- savol matni (L)
//   expr     -- yozuv (ixtiyoriy, formulalar jadvalidan)
//   options  -- [{id, label, ok}] to'rtta variant, YOKI
//   answer   -- son (o'quvchi yozadi)
//   source   -- { no, title, slug } -- bu yil qaysi darsda ko'rilgan
//   block    -- 'B5' kabi: natija shu blokka yoziladi
//
// RAZBOR YO'Q va YASHIL TUSHUNTIRISH YO'Q. Javobdan keyin faqat manzil.
export function DtmBody({ data, solved, solve, fig, audio, t }) {
  const [picked, setPicked] = useState(null)
  const [wrong, setWrong] = useState([])

  const pick = (o) => {
    if (!o || solved) return
    if (o.ok) {
      setPicked(o.id)
      solve({ correct: wrong.length === 0, attempts: wrong.length + 1, block: data.block })
      return
    }
    // `picked` NOTO'G'RI javobga qo'yilmaydi: `Options` uni «yopildi» deb
    // o'qiydi va qolgan variantlarni yig'ib qo'yadi, ya'ni ikkinchi urinish
    // imkonsiz bo'lib qolardi.
    setWrong((w) => (w.indexOf(o.id) === -1 ? w.concat(o.id) : w))
  }

  const href = data.source && data.source.slug
    ? '/10-sinf/matematika/nazariy/' + data.source.slug
    : null

  return (
    <Cols l={1} r={1}>
      <Col>
        <Panel tone="paper">
          {data.expr ? <Expr size="big" style={{ textAlign: 'left' }}>{data.expr}</Expr> : null}
          <div className="g10-ask">{t(data.task)}</div>
        </Panel>
        {fig ? fig(solved) : null}
      </Col>
      <Col>
        {data.options ? (
          <Options
            items={data.options.map((o) => ({ id: o.id, label: t(o.label) }))}
            picked={picked}
            wrong={wrong}
            onPick={(item) => pick(data.options.find((o) => o.id === item.id))}
            disabled={solved}
            cols={1}
          />
        ) : (
          <NumberEntry
            compact
            prompt={data.entryPrompt}
            answer={data.answer}
            okText={null}
            hints={[]}
            audio={audio}
            onSolved={(r) => solve({ ...(r || {}), block: data.block })}
          />
        )}
        {/* MANZIL, razbor emas. Faqat javobdan keyin. */}
        {solved && data.source ? (
          <Panel tone="paper" style={{ marginTop: 8 }}>
            <Tag tone="graph">{t(DTM_UI.where)}</Tag>
            <div className="g10-hint" style={{ marginTop: 4 }}>
              {t(DTM_UI.lesson) + ' ' + data.source.no + '. ' + t(data.source.title)}
            </div>
            {href ? (
              <a
                className="g10-btn g10-btn-ghost"
                href={href}
                style={{ display: 'inline-block', marginTop: 6, textDecoration: 'none' }}
              >
                {t(DTM_UI.open)}
              </a>
            ) : null}
          </Panel>
        ) : <Slot mh={96} />}
      </Col>
    </Cols>
  )
}

// BO'SHLIQLAR XARITASI. Bitta foiz YO'Q: har blok o'z satrida, va satr
// javoblardan HISOBLANADI, dars ma'lumotidan emas -- aks holda xarita
// o'quvchi nima qilganini emas, muallif nimani kutganini ko'rsatardi.
export function DtmMapBody({ data, answers, t }) {
  const rows = (data.blocks || []).map((b) => {
    const mine = (answers || []).filter((a) => a && a.block === b.id)
    const right = mine.filter((a) => a.correct !== false).length
    return { ...b, total: mine.length, right }
  })
  return (
    <Cols l={1} r={1}>
      <Col>
        {rows.map((r) => (
          <div key={r.id} className="g10-dtm-row">
            <span className="g10-dtm-blk">{t(r.label)}</span>
            {r.total === 0 ? (
              <span className="g10-dtm-none">{t(DTM_UI.noData)}</span>
            ) : (
              <>
                <span className="g10-dtm-num">
                  {r.right + ' ' + t(DTM_UI.ofTotal) + ' ' + r.total}
                </span>
                <Tag tone={r.right === r.total ? 'ok' : 'tip'}>
                  {r.right === r.total ? t(DTM_UI.clean) : t(DTM_UI.again)}
                </Tag>
              </>
            )}
          </div>
        ))}
      </Col>
      <Col>
        {data.note ? <Insight label={t(DTM_UI.whatNext)}>{t(data.note)}</Insight> : null}
      </Col>
    </Cols>
  )
}

export function makeLesson({ meta, block, screens, voice = 'm', mode = 'lesson' }) {
  return function Grade10Lesson({
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
      voiceGender: voiceGender || voice,
      lessonId: meta.id,
      lessonTitle: meta.title,
    })

    const [screen, setScreen] = useState(0)
    const [answers, setAnswers] = useState([])
    const [finished, setFinished] = useState(false)

    const record = useCallback((data) => {
      setAnswers((prev) => {
        const nextAns = prev.slice()
        nextAns[data.screen] = data
        return nextAns
      })
    }, [])

    const next = useCallback(() => setScreen((s) => Math.min(TOTAL - 1, s + 1)), [])
    const prev = useCallback(() => setScreen((s) => Math.max(0, s - 1)), [])

    const finish = useCallback(() => {
      setFinished(true)
      if (!onFinished) return
      // Baholanadigan YAGONA ekran -- blits. Son MA'LUMOTDAN hisoblanadi.
      const blitz = answers.reduce((acc, a) => (a && a.blitz ? a.blitz : acc), null)
      const tags = answers
        .filter((a) => a && a.tag && (a.correct === false || (a.attempts || 1) > 1))
        .map((a) => a.tag)
      // DTM REJIMIDA baho bitta ekranda emas: har topshiriq hisobga kiradi,
      // va natija BLOKLAR bo'yicha yig'iladi (§11). Platformaning maydonlari
      // ham to'ldiriladi -- shartnoma o'zgarmaydi, ustiga `gaps` qo'shiladi.
      const done = answers.filter(Boolean)
      if (mode === 'dtm') {
        const withBlock = done.filter((a) => a.block)
        const byBlock = {}
        withBlock.forEach((a) => {
          const cell = byBlock[a.block] || { block: a.block, total: 0, correct: 0 }
          cell.total += 1
          if (a.correct !== false) cell.correct += 1
          byBlock[a.block] = cell
        })
        onFinished({
          lessonId: meta.id,
          lessonTitle: tr(meta.title, lang),
          mode: 'dtm',
          totalQuestions: withBlock.length,
          correctAnswers: withBlock.filter((a) => a.correct !== false).length,
          gaps: Object.keys(byBlock).map((k) => byBlock[k]),
          tags,
          answers: done,
        })
        return
      }
      onFinished({
        lessonId: meta.id,
        lessonTitle: tr(meta.title, lang),
        totalQuestions: blitz ? blitz.total : 0,
        correctAnswers: blitz ? blitz.first : 0,
        tags,
        answers: done,
      })
    }, [answers, lang, onFinished, mode])

    const Current = screens[screen]

    return (
      <LangProvider value={lang}>
        <LangSetProvider value={preview ? setPreviewLang : null}>
          <div className="lesson-root">
            <style>{STYLES}</style>
            <BgCurves />
            <Current
              key={screen}
              lang={lang}
              block={block}
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
}

// Scene bu yerda ham kerak bo'ladi: rol tanalari chizmani `fig` sifatida oladi.
export { Scene }
