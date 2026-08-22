// ============================================================================
// 8-SINF AMALIYOTINING QOBIG'I — SINFGA BITTA.
// Kontrakt: src/books/grade8/TIPLAR_AMALIYOT_8SINF.md §4
//
// `makePractice({ META, ITEMS })` amaliyot komponentini qaytaradi — xuddi
// `screens.jsx` dagi `makeLesson` kabi. Dars fayli faqat MA'LUMOT bo'ladi:
// o'nta topshiriq ro'yxati va sarlavha.
//
// NIMA UCHUN BAHO SHU YERDA. Amaliyot — 8-sinfda BAHO QO'YILADIGAN YAGONA
// joy (ETALON_8SINF.md §13). Ball BIRINCHI urinish uchun beriladi, ya'ni
// hisob topshiriqning ichida emas, qobiqda turishi kerak: aks holda har
// topshiriq o'z ballini o'zi hisoblardi va 550 joyda bir xil xato bo'lardi.
//
// XATTI-HARAKAT (metodist qarori 2026-08-21):
//   1. «Tekshirish» BIR marta bosiladi, keyin topshiriq YOPILADI;
//   2. razbor darrov chiqadi, «maslahat» tugmasi YO'Q.
// Shuning uchun javob berilgan topshiriqqa qaytish TIRIK vidjetni emas,
// YOZUVNI ko'rsatadi: qayta javob berish yo'li yopiq bo'lishi kerak.
//
// OVOZ YO'Q. Amaliyot jim ishlaydi; to'g'ri/xato signali — `useSfx`, ya'ni
// darsdagi bilan bir xil (yangi dvijok yozilmagan).
// ============================================================================
// eslint-disable-next-line no-unused-vars -- LMS xom jsx ni KLASSIK rejimda yuklaydi
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { L, LangProvider, Note, STYLES, tr, useMobileZoom } from '../core.jsx'
import { MATH_STYLES } from '../math.jsx'
import { TOOLS_STYLES } from '../tools.jsx'
import { PRACTICE_STYLES } from './kit.jsx'

const UI = {
  check: L('Tekshirish', 'Проверить', 'Check'),
  next: L('Keyingisi', 'Дальше', 'Next'),
  finish: L('Yakunlash', 'Завершить', 'Finish'),
  score: L('ball', 'балл', 'points'),
  yourAnswer: L('Sizning javobingiz', 'Твой ответ', 'Your answer'),
  noAnswer: L('javob berilmagan', 'ответа нет', 'no answer'),
  passed: L("O'tdi", 'Зачёт', 'Passed'),
  failed: L("O'tmadi", 'Не зачтено', 'Not passed'),
  again: L(
    "Mavzuni qaytadan o'qib, amaliyotni yangidan boshlang.",
    'Прочитай тему заново и пройди практику ещё раз.',
    'Read the topic again and take the practice once more.',
  ),
  well: L(
    'Mavzu qo\'lda. Keyingi darsga o\'tsa bo\'ladi.',
    'Тема в руках. Можно идти на следующий урок.',
    'The topic is in hand. You can move to the next lesson.',
  ),
}

const PASS = 0.6

export function makePractice({ META, ITEMS }) {
  function Practice({ lang: langProp = 'uz', onFinished }) {
    const lang = ['uz', 'ru', 'en'].indexOf(langProp) === -1 ? 'uz' : langProp
    const t = useCallback((v) => tr(v, lang), [lang])
    useMobileZoom()

    const [idx, setIdx] = useState(0)
    const [res, setRes] = useState({})          // idx -> { correct, studentAnswer, tag, level }
    const [ready, setReady] = useState(false)
    // Shu tashrifda tekshirilgan topshiriq. Kerak, chunki javobdan KEYIN
    // ekranda RAZBOR turishi shart (metodist qarori 2026-08-21): agar host
    // darrov yozuvga o'tsa, razbor ko'rinmay qoladi. Yozuv — QAYTGANDA.
    const [checkedNow, setCheckedNow] = useState(null)
    const [done, setDone] = useState(false)     // yakuniy ekran
    const checkRef = useRef(null)

    const item = ITEMS[idx]
    const answered = res[idx] !== undefined
    const total = ITEMS.length
    const score = Object.keys(res).filter((k) => res[k].correct).length
    const allAnswered = Object.keys(res).length === total

    // Tip hostga o'z tekshiruvini beradi; javob berilgan topshiriqda
    // vidjet yo'q, ya'ni tekshiruv ham yo'q.
    const registerCheck = useCallback((fn) => { checkRef.current = fn }, [])
    const onReady = useCallback((v) => setReady(!!v), [])
    const onSubmit = useCallback((r) => {
      setRes((prev) => (prev[idx] !== undefined ? prev : { ...prev, [idx]: r }))
    }, [idx])

    // Topshiriq almashganda tayyorlik va tekshiruv nolga tushadi. Bu EFFEKTDA
    // qilinmaydi: bola effekti ota effektidan OLDIN ishlaydi, ya'ni effekt
    // birinchi montajda topshiriq allaqachon bergan tekshiruvni o'chirib
    // tashlardi va «Tekshirish» hech narsa qilmasdi (topildi stendda).
    const goTo = (i) => {
      checkRef.current = null
      setReady(false)
      setDone(false)
      setCheckedNow(null)
      setIdx(i)
    }

    const press = () => {
      if (!answered) { checkRef.current?.(); setCheckedNow(idx); return }
      if (idx + 1 < total) { goTo(idx + 1); return }
      finish()
    }

    const finish = () => {
      setDone(true)
      const answers = ITEMS.map((it, i) => ({
        n: i + 1,
        tag: res[i] ? res[i].tag : it.tag,
        level: it.level,
        correct: res[i] ? !!res[i].correct : false,
      }))
      onFinished?.({
        lessonId: META.id,
        lessonTitle: META.topic,
        topic: tr(META.topic, lang),
        totalQuestions: total,
        correctAnswers: score,
        scorePercent: Math.round((score / total) * 100),
        finalScore: score,
        finalTotal: total,
        passed: score / total >= PASS,
        answers,
      })
    }

    const btnLabel = !answered ? UI.check : (idx + 1 < total ? UI.next : UI.finish)
    const btnOn = !answered ? ready : true

    const Q = item.C
    const body = useMemo(() => (Q ? <Q onReady={onReady} registerCheck={registerCheck} onSubmit={onSubmit} /> : null),
      // Til almashsa ham, topshiriq almashsa ham — yangi nusxa.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [idx, lang])

    return (
      <LangProvider value={lang}>
        <style>{STYLES}{MATH_STYLES}{TOOLS_STYLES}{PRACTICE_STYLES}</style>
        <div className="pq-root">
          <div className="pq-top">
            <div className="pq-head">
              <span className="pq-title">{t(META.topic)}</span>
              <span className="pq-score">{score} / {total} {t(UI.score)}</span>
            </div>
            <div className="pq-chips">
              {ITEMS.map((it, i) => {
                let cls = 'pq-tab'
                if (res[i] !== undefined) cls += res[i].correct ? ' is-ok' : ' is-no'
                if (i === idx && !done) cls += ' is-now'
                return (
                  <button
                    type="button"
                    key={it.id}
                    className={cls}
                    data-tab={it.id}
                    onClick={() => goTo(i)}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pq-body">
            {done ? (
              <div className="pq-final">
                <div className="pq-final-n">{score} / {total}</div>
                <div className="pq-final-t">
                  {score / total >= PASS ? t(UI.passed) : t(UI.failed)}
                </div>
                <Note kind={score / total >= PASS ? 'ok' : 'no'}>
                  {score / total >= PASS ? t(UI.well) : t(UI.again)}
                </Note>
              </div>
            ) : answered && checkedNow !== idx ? (
              // Javob berilgan topshiriq: YOZUV, tirik vidjet emas.
              <div className="pq-wrap">
                <div className="pq-eyebrow">{t(item.label)}</div>
                <div className="pq-said">
                  <span className="pq-said-lbl">{t(UI.yourAnswer)}</span>
                  <span className="pq-said-v">{showAnswer(res[idx].studentAnswer, t)}</span>
                </div>
                <Note kind={res[idx].correct ? 'ok' : 'no'}>
                  {res[idx].feedback ? t(res[idx].feedback) : t(res[idx].correct ? UI.well : UI.again)}
                </Note>
              </div>
            ) : body}
          </div>

          <div className="pq-foot">
            {allAnswered && !done ? (
              <button type="button" className="pq-btn pq-btn-2" onClick={finish}>{t(UI.finish)}</button>
            ) : null}
            {!done ? (
              <button type="button" className="pq-btn" disabled={!btnOn} onClick={press} data-go="1">
                {t(btnLabel)}
              </button>
            ) : null}
          </div>
        </div>
      </LangProvider>
    )
  }
  return Practice
}

// O'quvchi yozgani: satr, son, kartalar ro'yxati yoki zonalar jadvali.
function showAnswer(a, t) {
  if (a === null || a === undefined || a === '') return t(UI.noAnswer)
  if (a === 'none') return t(L("taqiq yo'q", 'запрета нет', 'no restriction'))
  if (Array.isArray(a)) return a.map((x) => (x === '' ? '—' : x)).join('   ·   ')
  if (typeof a === 'object') {
    if (a.row !== undefined) return String(a.row) + '   ·   ' + (a.num || '—')
    return Object.keys(a).map((k) => k + ' → ' + a[k]).join('   ·   ')
  }
  return String(a)
}
