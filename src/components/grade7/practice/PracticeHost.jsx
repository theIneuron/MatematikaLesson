// ============================================================================
// 7-sinf AMALIYOTINING UMUMIY QOBIG'I. Bitta marta yozilgan obvyazka.
//
// JOYLASHUV -- 1, 2 va 5-sinflardagi kabi (metodist qarori 2026-08-20):
//   practice/PracticeHost.jsx        -- qobiq, sinfga BITTA
//   practice/darsNN/DNN_01..10.jsx   -- BITTA TOPSHIRIQ = BITTA FAYL
//   practice/darsNN/DarsNNPractice.jsx -- yig'uvchi: o'nta faylni ulaydi
// Ro'yxatga `practice/darsNN/DarsNNPractice.jsx` yoziladi.
//
// 7-SINFNING FARQI. 1, 2 va 5-sinfda har topshiriq fayli O'ZINING css va
// animatsiyasini olib yuradi. Bu yerda unday QILINMAYDI: mexanika `tools.jsx`
// da, vёrstka `core.jsx` da, topshiriq fayli esa faqat MA'LUMOT beradi va
// asbobni ulaydi (START_GRADE7.md §2). Aks holda bitta xatoni sinf bo'ylab
// o'nlab faylda tuzatishga to'g'ri keladi -- loyihada bu allaqachon bo'lgan.
//
// AMALIYOT JIM. Nazariya ovoz bilan tushuntiradi, amaliyot ishlaydi (4-sinf
// bilan bir xil qoida). Asboblarga `audio` UZATILMAYDI: razbor aytilmaydi,
// faqat YOZILADI. `useAudio` bo'sh ro'yxat bilan faqat tovush tugmasi uchun
// chaqiriladi. Ko'rsatma qulfi YO'Q -- to'sib turadigan ko'rsatma yo'q.
//
// BAHO. Nazariyada baho faqat blitsdan (etalon §8.5), amaliyotda har topshiriq
// baholanadi. Hisob BIRINCHI urinish bo'yicha.
//
// import React SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  L,
  LangProvider,
  LangSetProvider,
  LangSwitch,
  RingProgress,
  STYLES,
  T,
  Title,
  UI_TXT,
  configureLesson,
  tr,
  useAudio,
  useMobileZoom,
  useT,
} from '../core.jsx'
import { AuditRows, SlotFill } from '../tools.jsx'

// ============================================================
// UMUMIY MATNLAR
// ============================================================
const UI = {
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  next: L('Keyingisi', 'Дальше', 'Next'),
  finish: L('Yakunlash', 'Завершить', 'Finish'),
  again: L('Qaytadan', 'Пройти заново', 'Start over'),
  result: L('Natija', 'Результат', 'Result'),
  firstTry: L('birinchi urinishda', 'с первой попытки', 'on the first try'),
  levels: {
    easy: L('oson', 'простое', 'easy'),
    mid: L("o'rta", 'среднее', 'medium'),
    hard: L('qiyin', 'сложное', 'hard'),
  },
  // Tayyorlik SO'Z bilan aytiladi, foiz bilan emas (etalon §8.5).
  doneAll: L(
    'Bu turdagi topshiriqlar yopildi',
    'Этот тип задач закрыт',
    'This type of task is closed',
  ),
  doneMost: L(
    'Deyarli yopildi. Takrorni talab qiladigan joy',
    'Почти закрыто. Повтора требует вот что',
    'Almost closed. This is what needs another look',
  ),
  doneFew: L(
    'Darsga qaytish kerak. Takrorni talab qiladigan joylar',
    'Нужно вернуться к уроку. Повтора требуют эти места',
    'Go back to the lesson. These places need another look',
  ),
  noGaps: L(
    "Hamma topshiriq birinchi urinishda yechildi -- bo'sh joy yo'q",
    'Все задания решены с первой попытки — пробелов нет',
    'Every task was solved on the first try — no gaps',
  ),
}

// Qayta yozish amallari. Ro'yxat butun sinf uchun BIR XIL: o'quvchi har
// qadamda BOSQICHNI ataydi, «hisoblash» degan umumiy tugma yo'q.
export const REWRITE_ACTIONS = [
  { id: 'bracket', label: L('Qavs ichidagini hisoblash', 'Посчитать в скобках', 'Do what is inside the brackets') },
  { id: 'stage2', label: L('Ikkinchi bosqich amali', 'Действие второй ступени', 'A second-stage operation') },
  { id: 'stage1', label: L('Birinchi bosqich amali', 'Действие первой ступени', 'A first-stage operation') },
]

// StepOrder ning sinf bo'ylab BIR XIL matnlari. Topshiriq fayllarida
// takrorlanmaydi: bir xil matnning ikki nusxasi vaqt o'tib ikkiga ajraladi.
export const ASK_ORDER = L(
  "Amal belgilarini qaysi tartibda hisoblasangiz, shu tartibda bosing.",
  'Нажми на знаки действий в том порядке, в каком будешь считать.',
  'Tap the operation signs in the order you will work them out.',
)
export const YOURS_LABEL = L("sizning tartibingiz bo'yicha", 'по твоему порядку', 'by your order')
export const RULE_LABEL = L("qoida bo'yicha", 'по правилу', 'by the rule')
export const NEED_PART = L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.')

// Dvijok hech nima gapirmasligi uchun bo'sh ro'yxat. Havolasi O'ZGARMAS
// bo'lishi shart: `useAudio` uni deps sifatida ishlatadi.
const NO_SPEECH = []

// ============================================================
// AuditWithProof -- «birinchi xato qator» + QARSHI MISOL.
// Ikki qadam bitta topshiriqda: o'quvchi qatorni topadi, keyin xatoni SON
// bilan isbotlaydi (etalon §8.2: qarshi misolni dastur emas, O'QUVCHI
// qo'yadi). Mexanika shu yerda -- topshiriq faylida emas, chunki u bir necha
// darsda kerak bo'ladi.
//
// Isbot DARROV chiqmaydi: qatorlarning yig'ilishi ~0,5 s davom etadi va isbot
// o'sha paytda kelsa ekran oshib ketadi (Dars01, 12-ekran grabligi).
// ============================================================
export function AuditWithProof({ audit, proof, onSolved, disabled }) {
  const [found, setFound] = useState(null)
  const [proofIn, setProofIn] = useState(false)
  useEffect(() => {
    if (!found) return undefined
    const timer = setTimeout(() => setProofIn(true), 620)
    return () => clearTimeout(timer)
  }, [found])
  return (
    <>
      <AuditRows {...audit} disabled={disabled} onSolved={(r) => setFound(r)} />
      {proofIn ? (
        <SlotFill
          {...proof}
          tightAsk
          wide
          disabled={disabled}
          onSolved={(r) => {
            // Urinishlar IKKI qadamdan yig'iladi: topshiriq bitta, ya'ni
            // birinchi urinish ikkala qadamda ham toza bo'lishi kerak.
            const a1 = (found && found.attempts) || 1
            const t1 = (found && found.tags) || []
            const t2 = r.tags || []
            if (onSolved) {
              onSolved({
                correct: true,
                attempts: Math.max(a1, r.attempts || 1),
                tags: t1.concat(t2.filter((x) => t1.indexOf(x) === -1)),
              })
            }
          }}
        />
      ) : null}
    </>
  )
}

// ============================================================
// BITTA TOPSHIRIQ. Komponentni topshiriq FAYLI beradi (`task.Q`).
// ============================================================
function TaskView({ task, onSolved }) {
  const t = useT()
  const firedRef = useRef(false)
  const Q = task.Q

  const solve = useCallback((payload) => {
    if (firedRef.current) return
    firedRef.current = true
    const attempts = (payload && payload.attempts) || 1
    const tags = (payload && payload.tags) || []
    onSolved({
      taskId: task.id,
      level: task.level,
      skillTag: task.skillTag,
      attempts,
      // BIRINCHI URINISH. Ba'zi asboblarda «xato javob» tushunchasi yo'q
      // (StepOrder ikkala tartibni ham ko'rsatadi), lekin ular teg yozadi --
      // shuning uchun teg ham hisobga olinadi.
      firstTryCorrect: attempts <= 1 && tags.length === 0,
      tags,
    })
  }, [onSolved, task])

  if (!Q) return null

  return (
    <>
      {/* Brovkada TOPSHIRIQ so'zi YO'Q: u asbobning e'lonida turadi, raqam
          esa yuqori o'ngdagi hisoblagichda. Ilgari ekranda «6 TOPSHIRIQ» va
          «TOPSHIRIQ» yonma-yon turardi -- bitta fikr ikki marta (surat 390 px,
          2026-08-20). Brovkada faqat DARAJA qoldi. */}
      <div className="g7-pr-head">
        <span className="g7-pr-level">
          {t(UI.levels[task.level])}
          <span className="g7-pr-bars" aria-hidden="true">
            <i className="is-on" />
            <i className={task.level === 'mid' || task.level === 'hard' ? 'is-on' : ''} />
            <i className={task.level === 'hard' ? 'is-on' : ''} />
          </span>
        </span>
      </div>
      <Q onSolved={solve} />
    </>
  )
}

// ============================================================
// YAKUN. Baho -- birinchi urinishlar soni, bo'sh joy esa SO'Z bilan.
// ============================================================
function Result({ answers, total, tagNames }) {
  const t = useT()
  const firstTry = answers.filter((a) => a && a.firstTryCorrect).length
  const gaps = []
  answers.forEach((a) => {
    if (!a || a.firstTryCorrect) return
    const list = (a.tags && a.tags.length ? a.tags : [a.skillTag]).filter(Boolean)
    list.forEach((tag) => { if (gaps.indexOf(tag) === -1) gaps.push(tag) })
  })
  const verdict = firstTry >= total ? UI.doneAll : (firstTry >= total - 2 ? UI.doneMost : UI.doneFew)
  return (
    <>
      <Title>{t(UI.result)}</Title>
      <div className="g7-pr-result">
        <RingProgress value={firstTry} total={total} label={t(UI.result)} sub={t(UI.firstTry)} />
        <div className="g7-pr-verdict">
          <p className="g7-pr-verdict-text">{t(verdict)}</p>
          {gaps.length ? (
            <ul className="g7-pr-gaps">
              {gaps.map((tag) => (
                <li key={tag}>{tagNames && tagNames[tag] ? t(tagNames[tag]) : tag}</li>
              ))}
            </ul>
          ) : (
            <p className="g7-pr-clean">{t(UI.noGaps)}</p>
          )}
        </div>
      </div>
    </>
  )
}

// Tovush tugmasi. Amaliyotda GAPIRADIGAN narsa yo'q, lekin to'g'ri va xato
// javobning tovushi bor -- tugma aynan uni boshqaradi.
function SoundToggle() {
  const t = useT()
  const audio = useAudio(NO_SPEECH)
  return (
    <button
      type="button"
      className={'g7-tool g7-tool-sound' + (audio.muted ? ' is-off' : ' is-on')}
      onClick={audio.toggleMute}
      title={t(UI_TXT.sound)}
      aria-label={t(UI_TXT.sound)}
    >
      <b aria-hidden="true">{audio.muted ? '✕' : '♪'}</b>
    </button>
  )
}

// ============================================================
// HOST
// ============================================================
export default function PracticeHost({ meta, tasks, lang: langProp, onFinished }) {
  const initial = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz'
  const [lang, setLang] = useState(initial)
  // Til SAYTDAN keladi va dars ochilgandan KEYIN ham o'zgaradi (Dars01
  // grabligi: almashtirgich bosilardi, ekran esa eski tilda qolardi).
  useEffect(() => {
    if (langProp === 'uz' || langProp === 'ru' || langProp === 'en') setLang(langProp)
  }, [langProp])

  configureLesson({
    lessonId: meta.lessonId,
    voiceGender: 'm',
    freeNav: false, // amaliyotda o'tkazib yuborish YO'Q: har topshiriq yechiladi
  })
  useMobileZoom()

  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [done, setDone] = useState(false)
  const answersRef = useRef([])
  const [answers, setAnswers] = useState([])
  const startedAt = useRef(Date.now())
  const finishedRef = useRef(false)
  const total = tasks.length
  const last = index === total - 1

  const onSolved = useCallback((payload) => {
    const list = answersRef.current.slice()
    list[index] = payload
    answersRef.current = list
    setAnswers(list)
    setSolved(true)
  }, [index])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    const list = answersRef.current
    const firstTry = list.filter((a) => a && a.firstTryCorrect).length
    const percent = Math.round((firstTry / total) * 100)
    const tags = []
    list.forEach((a) => {
      if (!a) return
      const own = a.tags || []
      own.forEach((tag) => { if (tags.indexOf(tag) === -1) tags.push(tag) })
    })
    const levelBreakdown = ['easy', 'mid', 'hard'].reduce((acc, level) => {
      acc[level] = {
        total: tasks.filter((x) => x.level === level).length,
        firstTry: list.filter((a, i) => a && a.firstTryCorrect && tasks[i] && tasks[i].level === level).length,
      }
      return acc
    }, {})
    const payload = {
      lessonId: meta.lessonId,
      lessonTitle: tr(meta.title, lang),
      lessonTitleLocalized: meta.title,
      activityType: 'practice',
      lang,
      completed: true,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      totalQuestions: total,
      answeredQuestions: total,
      correctAnswers: firstTry,
      firstTryCorrect: firstTry,
      scorePercent: percent,
      finalScore: firstTry,
      finalTotal: total,
      // Chegara 70 % -- 4-sinf amaliyoti bilan bir xil (metodik profil
      // ≥60 % talab qiladi, sinf undan qat'iyroq turadi).
      passed: percent >= 70,
      firstTryStats: { total, firstTryCorrect: firstTry, percent },
      levelBreakdown,
      tags,
      answers: list,
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade7 practice] onFinished', payload)
  }, [lang, meta, onFinished, tasks, total])

  const next = useCallback(() => {
    if (!last) {
      setIndex((i) => i + 1)
      setSolved(false)
      return
    }
    setDone(true)
    finish()
  }, [finish, last])

  const restart = useCallback(() => {
    finishedRef.current = false
    startedAt.current = Date.now()
    answersRef.current = []
    setAnswers([])
    setIndex(0)
    setSolved(false)
    setDone(false)
  }, [])

  const t = useMemo(() => (value) => tr(value, lang), [lang])
  const pct = Math.round(((done ? total : index + 1) / total) * 100)

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
        <style>{STYLES}</style>
        <style>{PRACTICE_STYLES}</style>
        <div className="lesson-root" lang={lang}>
          <div className="stage">
            <div className="stage-header">
              <div className="g7-track" aria-hidden="true">
                <div className="g7-fill" style={{ width: pct + '%' }} />
              </div>
              <div className="g7-top">
                <span className="g7-top-eyebrow">
                  <i className="g7-top-dot" aria-hidden="true" />
                  {t(UI.eyebrow)}
                </span>
                <span className="g7-top-tools">
                  <SoundToggle />
                  {langProp ? null : <LangSwitch />}
                  <span className="g7-count g7-mono">{Math.min(index + 1, total)} / {total}</span>
                </span>
              </div>
            </div>
            <div className="stage-content">
              <div className="g7-stack">
                {done ? (
                  <Result answers={answers} total={total} tagNames={meta.tags} />
                ) : (
                  <TaskView key={tasks[index].id} task={tasks[index]} onSolved={onSolved} />
                )}
              </div>
            </div>
            {/* Tugma PASTKI panelda -- nazariy darsda ham shunday. Ish
                maydonidan 46px yemaydi va joyi doim bir xil. */}
            <div className="stage-nav">
              <span className="g7-nav-l" />
              <span className="g7-nav-c g7-mono">{t(meta.title)}</span>
              <span className="g7-nav-r">
                {done ? (
                  <Btn tone="ghost" onClick={restart}>{t(UI.again)}</Btn>
                ) : (
                  <Btn onClick={next} disabled={!solved} ready={solved} mark="go">
                    {t(last ? UI.finish : UI.next)}
                  </Btn>
                )}
              </span>
            </div>
          </div>
        </div>
      </LangSetProvider>
    </LangProvider>
  )
}

// ============================================================
// AMALIYOTNING O'Z USLUBLARI: topshiriq brovkasi, daraja shkalasi, yakun.
// Qolgan hamma narsa -- rang, shrift, panel, tugma -- `core.jsx` dan.
//
// DIQQAT: bu shablon satr. Ichida TESKARI APOSTROF bo'lmasin -- u satrni
// yopadi va sahifa 500 qaytaradi (START_GRADE7.md §8, yetti marta).
// ============================================================
export const PRACTICE_STYLES = `
.g7-pr-head { display: flex; align-items: center; justify-content: center; }
.g7-pr-level {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: clamp(10px, .88vw, 12px); font-weight: 800;
  letter-spacing: .12em; text-transform: uppercase; color: ${T.ink2};
}
/* Daraja RANG bilan emas, TO'LDIRISH bilan ko'rsatiladi: sinfning har rangi
   ma'noga band (accent -- bosish zonasi, ok -- to'g'ri, tip -- xato), va
   darajani ular bilan bo'yash «to'g'ri / xato» deb o'qilardi. */
.g7-pr-bars { display: inline-flex; gap: 3px; align-items: center; }
.g7-pr-bars i { width: 12px; height: 4px; border-radius: 999px; background: rgba(24,34,36,.14); }
.g7-pr-bars i.is-on { background: ${T.ink2}; }
.g7-pr-result {
  display: flex; align-items: center; justify-content: center;
  gap: clamp(14px, 3vw, 34px); flex-wrap: wrap;
}
.g7-pr-verdict { max-width: 420px; display: flex; flex-direction: column; gap: 8px; }
.g7-pr-verdict-text {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(15px, 1.4vw, 19px); line-height: 1.35; color: ${T.ink};
}
.g7-pr-gaps { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
.g7-pr-gaps li { font-size: clamp(13px, 1.1vw, 15px); color: ${T.ink2}; }
.g7-pr-clean { font-size: clamp(13px, 1.1vw, 15px); font-weight: 700; color: ${T.ok}; }
/* Yozuvning oxirgi belgisi -- tugma (fikridan qaytish). Ko'rinishi yozuvning
   o'zidan farq qilmaydi, faqat ostida punktir chiziq turadi. */
.g7-bv-last:hover:not(:disabled) { opacity: .72; }
@media (max-width: 639.98px) {
  .g7-pr-result { gap: 12px; }
  .g7-pr-verdict { max-width: 100%; }
}
`
