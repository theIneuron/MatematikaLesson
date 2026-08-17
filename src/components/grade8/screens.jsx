// ============================================================================
// 8-sinf: EKRAN QATLAMI. Bir marta yozilgan o'ram, 55 dars uchun.
//
// NEGA BU FAYL BOR. Pilot darsda (`Dars03.jsx`, o'chirildi 2026-08-13) har
// ekran atrofida bir xil o'ram yotardi: `Frame`, `useAudio`, `solved`, tegni
// hisobotga uzatish, asbobni ulash — ekranga o'rtacha 30 satr, darsga 450.
// 55 darsda bu 25 mingdan ortiq satr, va har birida tegni yoki `onStep` ni
// unutish MUMKIN: 10-sinfda aynan shu «unutish» qoidani butunlay jim
// qoldirgan edi.
//
// Endi dars faylida faqat MA'LUMOT: 15 ekran, har birida rol, asbob nomi va
// asbobning proplari. Mexanika `tools.jsx` da, yadro `core.jsx` da, javobni
// tekshirish `mathcore.js` da (ETALON_8SINF.md §13.2).
//
// NIMA BU YERDA:
//   TOTAL, ROLE_ORDER, FIELD_OF -- ekran sxemasi §13, MA'LUMOT sifatida
//   A, W                        -- ovoz bo'laklari: A avtomatik, W qadamni kutadi
//   Frame                       -- sarlavha, progress, navigatsiya, maydon rangi
//   ScreenBody                  -- asbob nomi -> asbob, `onStep` ovozga ulangan
//   SummaryBody                 -- 15-ekran: ikki ustun, tayyorlik SO'Z bilan
//   makeLesson                  -- darsning ildizi: ekranlar, teglar, payload
//
// NIMA BU YERDA YO'Q: matematika. Yozuvlar, sonlar, razborlar — dars faylida.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useMemo, useState } from 'react'
import {
  Ask, Btn, L, LangProvider, Lead, Note, STYLES, Stage, Title, UI_TXT,
  configureLesson, tr, useAdvanceGate, useAudio, useMobileZoom, useT,
} from './core.jsx'
import { FEED_STYLES, Chain, Parts, FeedNumber, FormulaSlots, PickBroken, Steppers, TwoRecords, TwoWays } from './feed.jsx'
import { MATH_STYLES } from './math.jsx'
import { METHOD_STYLES, MethodCard, SolveTogether } from './method.jsx'
import { PLOT_STYLES } from './plot.jsx'
import { TWOSIDES_STYLES, TwoSides } from './twosides.jsx'
import {
  Audit, Blitz, Boundary, Fields, Film, Inverse, PlotVsTable, Reveal, RuleBlock,
  RuleBuilder, SoloTask, Substitute, TOOLS_STYLES, TapPart, TaskChain, Transform,
  TwoValues,
} from './tools.jsx'

export const TOTAL = 15

// Rollar §13 bo'yicha. TARTIB O'ZGARMAYDI: 1 xuk · 2 tayanch · 3-7 tushuntirish
// (7 — chegara) · 8 qoida · 9-12 mashq · 13 ko'chirish · 14 blits · 15 yakun.
// Ro'yxat `scripts/check-grade8.mjs` uchun ham manba: dars shu tartibga
// solishtiriladi, «15 ta ekran bor» degan tekshiruv yetarli emas.
export const ROLE_ORDER = [
  'hook', 'support',
  'explain', 'explain', 'explain', 'explain', 'explain',
  'rule',
  'practice', 'practice', 'practice', 'practice',
  'transfer', 'blitz', 'summary',
]

// Uchta maxsus ekranning maydon rangi (§14). O'zgaradigan narsa AYNAN BITTA —
// rang; shapka, pastki panel va shrift shkalasi bir xil qoladi.
export const FIELD_OF = { 0: 'hook', 7: 'rule', 14: 'summary' }

// ============================================================
// OVOZ. Bir bo'lak — bir fikr (§15).
//   A(on, ...) — oldingi bo'lakdan keyin O'ZI gapiradi
//   W(on, ...) — o'quvchining QADAMINI kutadi (on_event), o'zi boshlanmaydi
// `on` nomi asbob yuboradigan hodisa nomi bilan bir xil bo'lishi SHART,
// aks holda bo'lak MANGU jim turadi (10-sinf, 2026-08-12).
// ============================================================
export const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })
export const W = (on, uz, ru, en) => ({ on, wait: true, text: L(uz, ru, en) })

// ============================================================
// RAMKA. Xukda «Orqaga» YO'Q (§13). Oxirgi ekranda «Yakunlash».
// ============================================================
function Frame({
  scr, screen, audio, solved, onPrev, onNext, onFinish, finished, notes, onNotes, children,
}) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const back = screen === 0 ? null : (
    <Btn tone="ghost" onClick={onPrev}>
      <span aria-hidden="true">{'←'}</span>{'  '}{t(UI_TXT.back)}
    </Btn>
  )
  const next = last
    ? (
      <Btn tone="solid" onClick={onFinish} disabled={finished} ready={!finished}>
        {finished ? t(UI_TXT.saved) : t(UI_TXT.finish)}
      </Btn>
    )
    : <Btn tone="solid" onClick={onNext} disabled={!canNext} ready={solved}>{t(UI_TXT.next)}</Btn>

  return (
    <Stage
      eyebrow={t(scr.eyebrow)}
      right={scr.right ? t(scr.right) : null}
      screen={screen}
      total={TOTAL}
      audio={audio}
      back={back}
      next={next}
      field={FIELD_OF[screen]}
      notes={notes}
      onNotes={onNotes}
    >
      <Title>{t(scr.title)}</Title>
      {scr.lead ? <Lead>{t(scr.lead)}</Lead> : null}
      {/* СЦЕНА (§6): хук открывает вопрос, финал показывает ответ на том же
          объекте. Пропорцию держит SceneBand, урок даёт только фигуры. */}
      {scr.scene || null}
      {/* СПОСОБ РЯДОМ С ЗАДАНИЕМ (§4). Контент вертикальный (решение методиста
          2026-08-13), поэтому «рядом» — это НАД заданием: способ, потом задача,
          которая им решается. Карточка та же самая, импортированная, не копия. */}
      {scr.method ? <MethodCard {...scr.method} compact /> : null}
      {children}
    </Stage>
  )
}

// ============================================================
// 15-EKRAN. Ikki ustun (§13, «Ekran 15 batafsil»): noutbukda 400 pikselga
// to'rt blok vertikal SIG'MAYDI, 904 kenglik esa bo'sh turadi. 390 da ustun.
//
// Yangi matematika va yangi kiritish YO'Q. Foiz YO'Q: bo'shliq SO'Z bilan
// aytiladi (§2.2.5).
// ============================================================
export function SummaryBody({ data, statements, miss, readiness, predicted, notes, audio }) {
  const t = useT()
  const first = readiness ? readiness.first : null
  const total = readiness ? readiness.total : 4
  const tags = (readiness && readiness.tags) || []
  const named = tags.map((x) => t(miss[x] ? miss[x].what : x)).join(', ')
  const level = first === null
    ? null
    : first === total
      ? t(UI_TXT.readiness4)
      : first === total - 1
        ? t(UI_TXT.readiness3) + ': ' + named
        : t(UI_TXT.readiness2) + ' ' + t(data.screenRef)

  return (
    <Reveal
      audio={audio}
      blocks={[
        // VERTIKAL, bitta ustun (metodist, 2026-08-13). Ikki ustun bekor
        // qilindi, shuning uchun MATN QISQARDI: qoralama ko'chirmasi olib
        // tashlandi (u shapkadagi tugmada qoladi), «nima qila olaman» uchta
        // satr. Yangi matematika va yangi kiritish bu ekranda yo'q.
        <div className="g8-sum" key="a">
          <div className="g8-sum-row">
            <span className="g8-chip g8-chip-cool">
              {predicted ? t(predicted) : t(data.predictedLabel)}
            </span>
            <span className="g8-sum-arrow">{'→'}</span>
            <span className="g8-chip g8-chip-ok">{t(data.proved)}</span>
          </div>
          {level ? <Note kind="ok">{level}</Note> : null}
          {statements.map((s, i) => <Ask key={i}>{t(s)}</Ask>)}
        </div>,
        <div className="g8-sum" key="b">
          <div className="g8-sum-h">{t(data.canLabel)}</div>
          {data.can.map((c, i) => <Ask key={i}>{t(c)}</Ask>)}
        </div>,
        <div className="g8-sum" key="c">
          <Note kind="ok">{t(data.proofNote)}</Note>
          <Note>{t(data.bridge)}</Note>
          <button type="button" className="g8-cheat" onClick={() => window.print()}>
            {t(data.cheat)}
          </button>
        </div>,
      ]}
    />
  )
}

// ============================================================
// KADRLAR LENTASI + undan keyingi TOPSHIRIQ. Lenta tugagach ekran o'zi
// yopiladi (topshiriq yo'q bo'lsa) yoki pastda topshiriq ochiladi.
// ============================================================
function FilmScreen({ p, audio, onSolved, step }) {
  const [done, setDone] = useState(false)
  return (
    <>
      <Film
        {...p.film}
        done={done}
        audio={audio}
        onStep={step}
        onDone={() => { setDone(true); if (!p.task) onSolved({ correct: true }) }}
      />
      {done && p.task ? (
        <Fields {...p.task} audio={audio} onSolved={onSolved} onStep={step} />
      ) : null}
    </>
  )
}

// ============================================================
// ASBOB NOMI -> ASBOB. `onStep` HAR YERDA ovozga ulangan: bo'lak qadamni
// kutayotgan bo'lsa (W), uni faqat shu ulanish qo'zg'atadi.
// ============================================================
export function ScreenBody(props) {
  const { scr, audio, onSolved, onReady, readiness, notes, statements, miss, predicted } = props
  const step = useCallback((name) => audio.step(name), [audio])
  const p = scr.props || {}

  switch (scr.tool) {
    case 'substitute':
      return <Substitute {...p} audio={audio} onSolved={onSolved} />
    // XUK: bitta yozuv, ikki mashina (7-sinf urok 1 naqshi).
    case 'plot':
      return <PlotVsTable {...p} audio={audio} onSolved={onSolved} />
    // ХУК: ученик сам кормит запись числами и сам находит поломку.
    case 'feed':
      return <FeedNumber {...p} audio={audio} onSolved={onSolved} />
    // ОПОРА: найти запись, которая не при каждом значении считается.
    case 'pick':
      return <PickBroken {...p} audio={audio} onSolved={onSolved} />
    // ГРАНИЦА: две записи считаются рядом, расхождение ученик находит сам.
    case 'tworec':
      return <TwoRecords {...p} audio={audio} onSolved={onSolved} />
    // СОБЕРИ ЗАПИСЬ: две ячейки и кнопки, правило открывает ученик.
    case 'slots':
      return <FormulaSlots {...p} audio={audio} onSolved={onSolved} />
    // ДВА СПОСОБА СРАЗУ: сравнивать можно только то, что видно одновременно.
    case 'twoways':
      return <TwoWays {...p} onStep={step} />
    // СЧЁТЧИКИ: ученик крутит данные, приложение считает и падает на нуле.
    case 'steppers':
      return <Steppers {...p} audio={audio} onSolved={onSolved} />
    // ЦЕПОЧКА: меняется знаменатель — переезжает запрет.
    case 'chain':
      return <Chain {...p} onStep={step} />
    // РАЗБОР ЗАПИСИ ПО ЧАСТЯМ: подсветка едет по формуле, полосы копятся.
    case 'parts':
      return <Parts {...p} onStep={step} />
    // KADRLAR LENTASI: tepada bitta obyekt, pastda kadrlar (4-sinf naqshi).
    case 'film':
      return <FilmScreen p={p} audio={audio} onSolved={onSolved} step={step} />
    // ASOSIY ASBOB: qo'l yozuvning ichida.
    case 'tappart':
      return <TapPart {...p} audio={audio} onSolved={onSolved} onStep={step} />
    // QOIDANI O'QUVCHI YIG'ADI, keyin xuk ekranga QAYTADI.
    case 'rulebuild':
      return (
        <RuleBuilder
          {...p}
          audio={audio}
          onSolved={onSolved}
          onStep={step}
          after={p.recall ? <TwoValues {...p.recall} /> : null}
        />
      )
    // TaskChain ovozni O'ZI suradi (`audio.step('t' + n)`), `onStep` esa unga
    // RAQAM beradi — uni ovozga ulash «1» degan hodisani yuborardi.
    case 'chain':
      return <TaskChain {...p} audio={audio} onSolved={onSolved} />
    case 'fields':
      return <Fields {...p} audio={audio} onSolved={onSolved} onStep={step} />
    case 'transform':
      return <Transform {...p} audio={audio} onSolved={onSolved} onStep={step} />
    case 'solo':
      return <SoloTask {...p} audio={audio} onSolved={onSolved} />
    // РЕШАЕМ ВМЕСТЕ: образец полного решения, строки копятся, на двух шагах
    // решает ученик. Неудачный шаг в записи обязателен (§4).
    case 'solve':
      return <SolveTogether {...p} audio={audio} onSolved={onSolved} onStep={step} />
    // ДЕЙСТВИЕ СРАЗУ НАД ДВУМЯ ЧАСТЯМИ: корни, уравнения, неравенства.
    // Шестнадцать уроков класса стоят на нём.
    case 'twosides':
      return <TwoSides {...p} audio={audio} onSolved={onSolved} onStep={step} />
    case 'rule':
      return <RuleBlock {...p} audio={audio} onSolved={onSolved} onStep={step} />
    case 'audit':
      return <Audit {...p} audio={audio} onSolved={onSolved} onStep={step} />
    case 'boundary':
      return <Boundary {...p} audio={audio} onSolved={onSolved} />
    case 'inverse':
      return <Inverse {...p} audio={audio} onSolved={onSolved} />
    case 'blitz':
      return <Blitz {...p} audio={audio} onSolved={onSolved} onReady={onReady} />
    case 'summary':
      return (
        <SummaryBody
          data={p}
          statements={statements}
          miss={miss}
          readiness={readiness}
          predicted={predicted}
          notes={notes}
          audio={audio}
        />
      )
    default:
      return null
  }
}

// ============================================================
// DARSNING ILDIZI. LMS proplari, til, ovoz, ekranlar bo'yicha yurish,
// natijani yuborish. Hamma darsda bir xil — shuning uchun bu yerda.
//
// PAYLOADDA `score` va `total` YO'Q (§17): nazariy dars baholanmaydi.
// Ketadigan narsa: `tags`, `readiness`, `passed`.
// ============================================================
export function makeLesson({ META, STATEMENTS, MISS, SCREENS }) {
  return function Grade8Lesson({ lang = 'ru', ttsApiBase = '', onFinish, studentName = '' }) {
    const [screen, setScreen] = useState(0)
    const [solved, setSolved] = useState({})
    const [readiness, setReadiness] = useState(null)
    const [predicted, setPredicted] = useState(null)
    const [notes, setNotes] = useState('')
    const [finished, setFinished] = useState(false)

    useMobileZoom()
    useMemo(() => {
      configureLesson({
        ttsApiBase,
        studentName,
        voiceGender: META.voice,
        lessonId: META.id,
        lessonTitle: META.topic,
        lessonNo: META.n,   // yuqori panelda «урок N» — yadroda QOTMAYDI
      })
    }, [ttsApiBase, studentName])

    const scr = SCREENS[screen]
    const audio = useAudio(scr.audio)

    // Балла нет. Сбор тегов по экранам убран редакцией 3: в платформу они
    // больше не уезжают (§12), а внутри урока пробел называет блиц. Сам список
    // З1-З17 остаётся инструментом АВТОРА — поле `tag` в данных экрана держит
    // заблуждение, ради которого экран написан, и его читает check-grade8.
    const markSolved = useCallback((res) => {
      setSolved((prev) => ({ ...prev, [screen]: true }))
      // Прогноз хука не оценивается, но нужен экрану 15 (§13).
      if (SCREENS[screen].role === 'hook' && res && res.predicted) setPredicted(res.predicted)
    }, [screen])

    const finish = () => {
      setFinished(true)
      if (!onFinish) return
      // РЕДАКЦИЯ 3 (§12): урок отдаёт ТОЛЬКО ответы. Ни балла, ни процента, ни
      // тегов, ни уровня готовности: оценка живёт в практике. Теги и уровень
      // при этом считаются и показываются НА экране 15 — они инструмент
      // ученика и автора, а не данные платформы.
      onFinish({
        lessonId: META.id,
        lessonTitle: META.topic,
        topic: tr(META.topic, lang),
        totalQuestions: null,
        correctAnswers: null,
        scorePercent: null,
        finalScore: null,
        finalTotal: null,
        passed: null,
        answers: SCREENS.map((s, i) => ({ n: i + 1, role: s.role, solved: !!solved[i] })),
      })
    }

    return (
      <LangProvider value={lang}>
        <style>{STYLES}{MATH_STYLES}{TOOLS_STYLES}{PLOT_STYLES}{METHOD_STYLES}{TWOSIDES_STYLES}{FEED_STYLES}</style>
        <div className="lesson-root">
          <Frame
            key={screen}
            scr={scr}
            screen={screen}
            audio={audio}
            solved={scr.role === 'summary' || !!solved[screen]}
            finished={finished}
            notes={notes}
            onNotes={setNotes}
            onPrev={() => setScreen((s) => Math.max(0, s - 1))}
            onNext={() => setScreen((s) => Math.min(TOTAL - 1, s + 1))}
            onFinish={finish}
          >
            <ScreenBody
              scr={scr}
              audio={audio}
              onSolved={markSolved}
              onReady={setReadiness}
              readiness={readiness}
              predicted={predicted}
              statements={STATEMENTS}
              miss={MISS}
              notes={notes ? notes.split('\n').filter(Boolean) : null}
            />
          </Frame>
        </div>
      </LangProvider>
    )
  }
}
