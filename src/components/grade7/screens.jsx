// ============================================================================
// 7-sinf: EKRAN QATLAMI (konveyer). Metodist savoli 2026-08-21: «bitta
// skelet ostida blokni tez qilib bo'ladimi, faqat kontent almashsa».
//
// JAVOB SHU FAYL. Ilgari har dars 15 ta bir xil o'ram yozardi:
// `function Screen7({ screen, onAnswer, ...rest }) { const segments = ... }`
// -- darsga taxminan 150 qator, va u 15 joyda bir xil. Aynan shu qatorlarda
// men bir kunda IKKI MARTA xato qildim: `Transform` ga mos kelmaydigan
// ma'lumot berdim (ekranda bosiladigan narsa qolmadi) va prop uzatishni
// tashlab ketdim. Endi o'ram BITTA joyda turadi.
//
// DARS FAYLI = MA'LUMOT. Har ekran obyekti `kind` maydonini yozadi, va shu
// `kind` qaysi asbob qo'yilishini belgilaydi. Ekranning ROLI, formasi va
// razmetkasi shu yerda, matematika esa darsda.
//
// NIMA KO'CHMAYDI (metodistga aytilgan, ETALON_7SINF.md §4.1):
// xuk, farqlash, «o'zingiz», chegaraviy holat, tuzoq va ko'chirish -- bu
// MATN emas, MATEMATIKA. Ular har darsda qaytadan topiladi. Konveyer
// faqat o'ramni oladi.
//
// TEKSHIRUV BILAN KELISHILGAN: `grade7-lesson-audit.mjs` konveyer rejimida
// asbobni JSX dan emas, `kind` dan o'qiydi. Ya'ni kvota va «javobni
// yig'adi» hisoblari ishlashda qoladi.
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Expr,
  Fx,
  Hint,
  LessonFrame,
  Tag,
  collectLessonTags,
  createLesson,
  levelFromFirstTry,
  tr,
  useAudio,
  useInstructionGate,
  useT,
} from './core.jsx'
import {
  AreaGrid,
  AuditRows,
  FactorTape,
  Figure,
  HistoryTape,
  Plane,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  SortZones,
  StairsReveal,
  SubstituteRows,
  TermColumns,
  TermStrip,
  Transform,
  TwoRoutes,
} from './tools.jsx'

// Ovoz segmenti: `A('mount', uz, ru, en)` -- darslar shu yordamchini
// import qiladi, ya'ni har faylda qaytadan yozilmaydi.
export const A = (on, uz, ru, en) => ({ on, text: { uz, ru, en } })

const buildSegments = (list, lang) =>
  (list || []).map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

// Har ekranning umumiy boshi: ovoz, javob qulfi, «yechildi» holati.
const useShell = (S, lang) => {
  const segments = useMemo(() => buildSegments(S.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  return { audio, canAnswer }
}

// ============================================================
// 1. XUK. Sahna (ikki yo'l) va prognoz. Baholanmaydi.
// ============================================================
const hookScreen = (S) => function ScreenHook({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [picked, setPicked] = useState(null)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <TwoRoutes source={S.gate.source} rows={S.gate.rows} sign={S.gate.sign} />
      <Probe
        data={S.probe}
        cols={S.cols || 2}
        unscored
        fbSlot={0}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, role: 'hook' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 2. ZANJIR. Qisqa bir xil savollar: tayanch va mashq.
// ============================================================
const chainScreen = (S) => function ScreenChain({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S.items}
        question={S.question}
        cols={S.cols || 4}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'practice' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 3. BLITS. Yagona BAHOLANADIGAN ekran (§4.1).
// ============================================================
const blitzScreen = (S) => function ScreenBlitz({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  const resRef = useRef([])
  const total = S.items.length
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S.items}
        question={S.question}
        cols={S.cols || 2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onItem={(r) => { resRef.current = resRef.current.concat(r) }}
        onSolved={(r) => {
          const list = resRef.current
          const firstTry = list.filter((x) => x.attempts === 1).length
          setDone(true)
          onAnswer({ ...r, screen, role: 'blitz', scored: true, total, firstTry, level: levelFromFirstTry(firstTry, total) })
        }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 4. HADLAR LENTASI (B4).
// ============================================================
const stripScreen = (S) => function ScreenStrip({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <TermStrip
        audio={audio}
        strips={S.strips}
        caption={S.caption}
        options={S.options}
        answer={S.answer}
        wrongs={S.wrongs}
        note={S.note}
        cols={S.cols || 4}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 5. HADLAR USTUNI (B4).
// ============================================================
const columnsScreen = (S) => function ScreenColumns({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <TermColumns
        audio={audio}
        rows={S.rows}
        caption={S.caption}
        options={S.options}
        answer={S.answer}
        wrongs={S.wrongs}
        note={S.note}
        cols={S.cols || 4}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 6. YUZA TO'RTBURCHAGI (B4).
// ============================================================
const gridScreen = (S) => function ScreenGrid({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <AreaGrid
        audio={audio}
        left={S.left}
        top={S.top}
        caption={S.caption}
        options={S.options}
        answer={S.answer}
        wrongs={S.wrongs}
        note={S.note}
        cols={S.cols || 2}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 7. SON QO'YISH (B1 asbobi, chegaraviy holatlar).
// ============================================================
const substituteScreen = (S) => function ScreenSub({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <SubstituteRows
        audio={audio}
        rows={S.rows}
        numbers={S.numbers}
        runs={S.runs || 3}
        letter={S.letter || 'a'}
        question={S.probe.question}
        options={S.probe.items}
        okText={S.okText}
        askFirst={S.askFirst}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 8. ZONALARGA TARQATISH.
// ============================================================
const sortScreen = (S) => function ScreenSort({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <SortZones
        audio={audio}
        zones={S.zones}
        items={S.cards}
        prompt={S.prompt}
        wrongs={S.wrongs}
        okNote={S.okNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 9. YOZUVNI YIG'ISH. `given` bo'lsa, ustida topshiriq satri turadi.
// ============================================================
const slotScreen = (S) => function ScreenSlot({ screen, onAnswer, ...rest }) {
  const t = useT()
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      {S.given ? <Hint>{t(S.given)}</Hint> : null}
      {S.lines ? S.lines.map((line, i) => <Expr size="sm" key={i}>{line}</Expr>) : null}
      <SlotFill
        audio={audio}
        template={S.template}
        parts={S.parts}
        answer={S.answer}
        prompt={S.prompt}
        promptCap={S.promptCap}
        checkNote={S.checkNote}
        wrongs={S.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'practice' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 10. IKKI QADAM: yozuvni yig'ish, keyin savol. Qadamlar ATALGAN.
// ============================================================
const slot2Screen = (S) => function ScreenSlot2({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [first, setFirst] = useState(false)
  const [done, setDone] = useState(false)
  const [twoIn, setTwoIn] = useState(false)
  useEffect(() => {
    if (!first) return undefined
    const tmr = setTimeout(() => setTwoIn(true), 620)
    return () => clearTimeout(tmr)
  }, [first])
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S.template}
        parts={S.parts}
        answer={S.answer}
        prompt={S.prompt}
        promptCap={S.step1Cap}
        checkNote={S.checkNote}
        wrongs={S.wrongs}
        tightAsk
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setFirst(true); audio.step('two'); onAnswer({ ...r, screen, role: S.role || 'practice', part: 'one' }) }}
      />
      {twoIn ? (
        <Probe
          data={S.probe}
          cols={S.cols || 4}
          fbSlot={0}
          audio={audio}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'practice', part: 'two' }) }}
        />
      ) : null}
    </LessonFrame>
  )
}

// ============================================================
// 11. QOIDA. Yig'iladi, keyin karta ochiladi.
// ============================================================
const ruleScreen = (S) => function ScreenRule({ screen, onAnswer, ...rest }) {
  const t = useT()
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  const rule = useMemo(() => ({ badge: t(S.rule.badge), lines: S.rule.lines.map(t) }), [t])
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <RuleBuilder
        audio={audio}
        fragments={S.fragments}
        answer={S.answer}
        wrongHint={S.wrongHint}
        tag={S.tag || 'Z1'}
        rule={rule}
        help={S.helpRows ? (
          <div className="g7-helpstrip">
            <Tag tone="quiet">{t(S.helpLabel)}</Tag>
            {S.helpRows.map((r, i) => <span key={i}>{t(r)}</span>)}
          </div>
        ) : null}
        after={(
          <>
            {S.lawChips ? <StairsReveal items={S.lawChips} sweep={t(S.lawSweep)} /> : null}
            {S.hookCap ? <Hint>{t(S.hookCap)}</Hint> : null}
          </>
        )}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'rule' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 12. TUZOQ. Birinchi xato qator, keyin ISBOT (§8.2).
// ============================================================
const trapScreen = (S) => function ScreenTrap({ screen, onAnswer, ...rest }) {
  const t = useT()
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [found, setFound] = useState(false)
  const [done, setDone] = useState(false)
  const [proofIn, setProofIn] = useState(false)
  useEffect(() => {
    if (!found) return undefined
    const tmr = setTimeout(() => setProofIn(true), 620)
    return () => clearTimeout(tmr)
  }, [found])
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      {S.task ? <Hint>{t(S.task)}</Hint> : null}
      <AuditRows
        audio={audio}
        rows={S.rows}
        answerId={S.answerId}
        hints={S.hints}
        tags={S.tags}
        prompt={S.ask}
        promptCap={S.step1Cap}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setFound(true); onAnswer({ ...r, screen, role: 'trap', part: 'line' }) }}
      />
      {proofIn ? (
        <SlotFill
          audio={audio}
          template={S.proofFill.template}
          parts={S.proofFill.parts}
          answer={S.proofFill.answer}
          prompt={S.proofFill.prompt}
          promptCap={S.step2Cap}
          tightAsk
          wide
          checkNote={S.proofFill.checkNote}
          wrongs={S.proofFill.wrongs}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); audio.step('done'); onAnswer({ ...r, screen, role: 'trap', part: 'proof' }) }}
        />
      ) : null}
    </LessonFrame>
  )
}

// ============================================================
// 13. QADAMMA-QADAM QAYTA YOZISH (B1 asbobi).
// ============================================================
const transformScreen = (S) => function ScreenTransform({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <Transform
        audio={audio}
        start={S.start}
        steps={S.steps}
        actions={S.actions}
        footNote={S.footNote}
        ask={S.ask}
        askAct={S.askAct}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

// ============================================================
// 14. YAKUN. Yangi matematika YO'Q (§4.2): xuk sahnasi, bosib o'tilgan
// yo'l va prognoz. Kamchilik satri teglardan yig'iladi.
// ============================================================
const wrapScreen = (S, tagDict) => function ScreenWrap({ screen, answers, ...rest }) {
  const t = useT()
  const segments = useMemo(() => buildSegments(S.audio, rest.lang), [rest.lang])
  const audio = useAudio(segments)

  const tags = collectLessonTags(answers, tagDict)
  const hook = (answers || []).find((a) => a && a.role === 'hook')
  const predict = hook && hook.picked ? S.predictMap[hook.picked] : null

  const named = tags.slice(0, 2).map((code) => t(tagDict[code])).join(', ')
  const more = tags.length - 2
  const gapLine = tags.length
    ? t(S.gapPrefix) + ': ' + named + (more > 0 ? ', ' + t(S.moreGaps) + ' ' + more : '')
    : t(S.noGap)

  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved {...rest}>
      <TwoRoutes
        source={S.gate.source}
        rows={S.gate.rows}
        sign={S.gate.sign}
        fix={S.fix ? { ...S.fix, onFix: () => audio.say(t(S.fixSay)) } : undefined}
      />

      <HistoryTape items={S.chips} label={S.tapeLabel} />

      <div className="g7-sumcards g7-sumcards-one">
        <div className="g7-sumcard">
          <p className="g7-sumcard-h">{t(S.twoLabel)}</p>
          <span className="g7-sumtwo-line"><Fx>{t(S.twoA)}</Fx></span>
          <span className="g7-sumtwo-line"><Fx>{t(S.twoB)}</Fx></span>
          <p className="g7-sumcard-note">
            <b>{t(S.predictLabel)}:</b> {predict ? t(predict) : t(S.noAnswer)}
          </p>
          <p className="g7-sumcard-note">
            <b>{t(S.nextLabel)}:</b> {t(S.nextTopic)}
          </p>
          <p className="g7-sumcard-note g7-readyline">{gapLine}</p>
        </div>
      </div>
    </LessonFrame>
  )
}

// `kind` -> ekran. Yangi forma kerak bo'lsa, u SHU YERGA qo'shiladi, darsga
// emas: aks holda o'ram yana darslar bo'ylab ko'chib ketadi.
const figureScreen = (S) => function ScreenFigure({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <Figure
        audio={audio}
        pts={S.pts}
        seg={S.seg}
        move={S.move}
        pick={S.pick}
        show={S.show}
        mark={S.mark}
        dim={S.dim}
        guess={S.guess}
        notes={S.notes}
        caption={S.caption}
        options={S.options}
        answer={S.answer}
        wrongs={S.wrongs}
        note={S.note}
        cols={S.cols || 2}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

const planeScreen = (S) => function ScreenPlane({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <Plane
        audio={audio}
        range={S.range}
        fn={S.fn}
        dots={S.dots}
        pick={S.pick}
        labels={S.labels}
        caption={S.caption}
        options={S.options}
        answer={S.answer}
        wrongs={S.wrongs}
        note={S.note}
        cols={S.cols || 2}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

const tapeScreen = (S) => function ScreenTape({ screen, onAnswer, ...rest }) {
  const { audio, canAnswer } = useShell(S, rest.lang)
  const [done, setDone] = useState(false)
  return (
    <LessonFrame meta={S} screen={screen} audio={audio} solved={done} {...rest}>
      <FactorTape
        audio={audio}
        expr={S.expr}
        item={S.item}
        count={S.count}
        join={S.join}
        outside={S.outside}
        groups={S.groups}
        cross={S.cross}
        mixed={S.mixed}
        options={S.options}
        answer={S.answer}
        wrongs={S.wrongs}
        note={S.note}
        cols={S.cols || 4}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: S.role || 'explain' }) }}
      />
    </LessonFrame>
  )
}

const KINDS = {
  hook: hookScreen,
  chain: chainScreen,
  blitz: blitzScreen,
  strip: stripScreen,
  columns: columnsScreen,
  grid: gridScreen,
  substitute: substituteScreen,
  sort: sortScreen,
  slot: slotScreen,
  slot2: slot2Screen,
  rule: ruleScreen,
  trap: trapScreen,
  figure: figureScreen,
  plane: planeScreen,
  tape: tapeScreen,
  transform: transformScreen,
  wrap: wrapScreen,
}

// ============================================================
// DARS = MA'LUMOT. `screens` -- 15 ta obyekt, har birida `kind`.
// ============================================================
export function makeLesson({ id, title, no, block, tags, screens, ruleScreen: ruleIdx = 7 }) {
  const comps = screens.map((S, i) => {
    const make = KINDS[S.kind]
    if (!make) throw new Error('7-sinf konveyeri: nomalum kind «' + S.kind + '» (ekran ' + (i + 1) + ')')
    return make(S, tags)
  })
  return createLesson({ id, title, no, block, tags, screens: comps, ruleScreen: ruleIdx })
}
