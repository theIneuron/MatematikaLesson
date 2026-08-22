// ============================================================================
// 8-sinf, Dars 1 (v2). RATSIONAL IFODALAR VA RATSIONAL KASRLAR.
//
// Maket: artifacts/grade8-dars01-design (preview.html + DESIGN_SPEC.md),
// metodist 2026-08-11. 15 ekran, 1366x768 asosiy o'lcham.
// Ko'rinish qatlami `labkit.jsx` da, dvijok (ovoz, til, zoom) `core.jsx` da.
// Rasm YO'Q: hamma narsa CSS va JSX bilan chizilgan (maket sharti).
//
// Eski `Dars01.jsx` TEGILMAGAN: bu boshqa konsepsiya, registrda alohida yozuv.
//
// Ekran mantiqi (DESIGN_SPEC §Ekran mantiqi):
//   1 xuk · 2 skaner · 3 sekin qo'yish · 4 uch tushuncha · 5 nol tajribasi
//   6-7 tekshiruv (yechim faqat to'g'ri javobdan keyin) · 8 ODZ qoidasi
//   9-12 beshlik zanjirlar · 13 ko'chirish va fakt-karta · 14 aralash beshlik
//   15 yakun
//
// Barcha ekranlar BIR VAQTDA mount qilinadi va `is-active` bilan almashadi:
// javoblar, ochilgan qadamlar va qulflar ekranlar orasida yurganda SAQLANADI
// (JSON talabi: state). `import React` SHART -- LMS klassik rejim.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { L, LangProvider, configureLesson, tr, useAudio, useMobileZoom, useT } from './core.jsx'
import {
  Caption, Cursor, Feedback, Frac, Head, LAB_STYLES, LAB_UI, LabShell, LockedList,
  LT, Options, Reveal, Sequence, Tag, useStaged,
} from './labkit.jsx'

export const META = {
  id: 'alg-8-01-v2',
  n: 1,
  voice: 'm',
  total: 15,
  lessonLabel: L('8-SINF · 1-DARS', '8 КЛАСС · УРОК 1', 'GRADE 8 · LESSON 1'),
  topic: L(
    'Ratsional ifodalar va ratsional kasrlar',
    'Рациональные выражения и рациональные дроби',
    'Rational expressions and rational fractions',
  ),
}

const TOTAL = META.total
// Birinchi urinishdan to'g'ri javob hisoblanadigan topshiriqlar soni:
// 6, 7, 13 ekranlar bittadan va 9, 10, 11, 12, 14 ekranlar beshtadan.
const SCORED = 28

const MINUS = '−'
const NE = '≠'

// ============================================================
// 1-EKRAN. XUK: formula-turniket.
// ============================================================
const HOOK_VALUES = [
  { v: 0, num: '1', den: MINUS + '3', out: MINUS + '1/3' },
  { v: 2, num: '5', den: MINUS + '1', out: MINUS + '5' },
  { v: 3, blocked: true },
  { v: 4, num: '9', den: '1', out: '9' },
]

const S1 = {
  gate: true,
  hint: L(
    "uchni bosing: formula qayerda yopilishini ko'rasiz",
    'нажми число 3 — увидишь, где формула закрывается',
    'tap 3 and see where the formula closes',
  ),
  audio: [
    { on: 'mount', text: L(
      "Bu formula sonni qabul qiladi va javob qaytaradi. Istalgan sonni bosing.",
      'Эта формула принимает число и возвращает ответ. Нажми любое число.',
      'This formula takes a number and returns an answer. Tap any number.',
    ) },
    { on: 'pick', wait: true, text: L(
      "Son x o'rniga turdi. Endi maxrajga qarang.",
      'Число встало вместо x. Теперь посмотри на знаменатель.',
      'The number took the place of x. Now look at the denominator.',
    ) },
    { on: 'block', wait: true, text: L(
      "Uchda maxraj nolga aylandi. Nolga bo'lish amali yo'q, shuning uchun formula yopildi.",
      'При трёх знаменатель стал нулём. Деления на ноль не существует, поэтому формула закрылась.',
      'At three the denominator became zero. Division by zero does not exist, so the formula closed.',
    ) },
  ],
  C: function Screen1({ active, audio, done }) {
    const t = useT()
    const [pick, setPick] = useState(null)
    const [phase, setPhase] = useState(0) // 0 kutish, 1 qo'yilmoqda, 2 natija
    const [launch, setLaunch] = useState(null)
    const timers = useRef([])
    useEffect(() => () => timers.current.forEach(clearTimeout), [])

    const choose = (item) => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      setPick(item.v)
      setPhase(1)
      setLaunch(item.v)
      if (active) audio.step('pick')
      timers.current.push(setTimeout(() => setLaunch(null), 700))
      timers.current.push(setTimeout(() => {
        setPhase(2)
        if (item.blocked) {
          done()
          if (active) audio.step('block')
        }
      }, 520))
    }

    const cur = HOOK_VALUES.find((h) => h.v === pick)
    const tok = pick === null
      ? <i className="d1-x">x</i>
      : <b className={'d1-tok' + (pick === 3 ? ' is-bad' : '')}>{pick}</b>

    return (
      <>
        <Head
          eyebrow={L('Xuk · matematik turniket', 'Хук · математический турникет', 'Hook · the formula turnstile')}
          title={L('Formula qayerda', 'Где формула', 'Where does the formula')}
          em={L("ishlashdan to'xtaydi?", 'перестаёт работать?', 'stop working?')}
          lead={L(
            "Sonni bosing va uni formuladan o'tkazing.",
            'Нажми число и пропусти его через формулу.',
            'Tap a number and send it through the formula.',
          )}
        />
        <div className="g8l-body d1-hook">
          <div className="g8l-card d1-machine">
            <div className="d1-rings" aria-hidden="true"><i /><s /></div>
            <Tag>K(x)</Tag>
            <div className="g8l-f is-hero d1-formula">
              <Frac
                num={<span>2{tok}{' + 1'}</span>}
                den={<span>{tok}{' ' + MINUS + ' 3'}</span>}
                blocked={pick === 3 && phase === 2}
              />
            </div>
            <p className={'d1-guide' + (phase === 2 ? ' is-done' : '')}>
              {t(phase === 0
                ? L('SONNI BOSING ↓', 'НАЖМИ НА ЧИСЛО ↓', 'TAP A NUMBER ↓')
                : phase === 1
                  ? L("SON FORMULAGA QO'YILMOQDA…", 'ЧИСЛО ПОДСТАВЛЯЕТСЯ В ФОРМУЛУ…', 'THE NUMBER IS GOING IN…')
                  : L('NATIJA TAYYOR ✓', 'РЕЗУЛЬТАТ ГОТОВ ✓', 'RESULT READY ✓'))}
            </p>
            <div className="d1-values">
              {HOOK_VALUES.map((item) => (
                <button
                  type="button"
                  key={item.v}
                  className={
                    'd1-val' + (pick === item.v ? ' is-on' : '')
                    + (launch === item.v ? ' is-launch' : '')
                    + (item.v === 3 && pick !== 3 ? ' g8l-pulse' : '')
                  }
                  onClick={() => choose(item)}
                  aria-label={t(L(
                    'x ni ' + item.v + ' deb oling',
                    'подставить x = ' + item.v,
                    'substitute x = ' + item.v,
                  ))}
                >
                  {item.v}
                </button>
              ))}
            </div>
          </div>

          <div className="d1-side">
            <div className="g8l-card d1-instr">
              <Cursor />
              <div>
                <strong>{t(L('1. Sonni tanlang', '1. Выбери число', '1. Choose a number'))}</strong>
                <span>{t(L("Uni x o'rniga qo'yamiz.", 'Мы подставим его вместо x.', 'We substitute it for x.'))}</span>
              </div>
            </div>
            <div className={'d1-result' + (phase === 2 ? (pick === 3 ? ' is-bad' : ' is-ok') : '')}>
              {phase < 2 ? (
                <div>
                  <p className="d1-status">{t(L('SON KUTILMOQDA', 'ОЖИДАЮ ЧИСЛО', 'WAITING FOR A NUMBER'))}</p>
                  <p className="d1-out">?</p>
                  <Caption>
                    {t(L(
                      "Bosgandan keyin formula bu qiymatni o'tkazadimi yoki yo'qmi, ko'rsatadi.",
                      'После нажатия формула покажет, пропускает ли она это значение.',
                      'After the tap the formula shows whether it accepts this value.',
                    ))}
                  </Caption>
                </div>
              ) : pick === 3 ? (
                <Reveal show>
                  <p className="d1-status">{t(L('KIRISH YOPILDI', 'ДОСТУП ЗАБЛОКИРОВАН', 'ACCESS BLOCKED'))}</p>
                  <p className="d1-out">x = 3</p>
                  <Caption>
                    {t(L(
                      'Maxraj: 3 ' + MINUS + ' 3 = 0. Formula bu qiymatni qabul qilmaydi.',
                      'Знаменатель: 3 ' + MINUS + ' 3 = 0. Формула не принимает это значение.',
                      'Denominator: 3 ' + MINUS + ' 3 = 0. The formula does not accept this value.',
                    ))}
                  </Caption>
                </Reveal>
              ) : (
                <Reveal show>
                  <p className="d1-status">{t(L('FORMULA ISHLAYDI', 'ФОРМУЛА РАБОТАЕТ', 'THE FORMULA WORKS'))}</p>
                  <p className="d1-out">K({pick}) = {cur.out}</p>
                  <Caption>
                    {t(L(
                      'Maxraj: ' + pick + ' ' + MINUS + ' 3 = ' + cur.den + '. Nol emas, qiymat mumkin.',
                      'Знаменатель: ' + pick + ' ' + MINUS + ' 3 = ' + cur.den + '. Не ноль, значение допустимо.',
                      'Denominator: ' + pick + ' ' + MINUS + ' 3 = ' + cur.den + '. Not zero, the value is allowed.',
                    ))}
                  </Caption>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </>
    )
  },
}

// ============================================================
// 2-EKRAN. SKANER: to'rt qadam FAQAT navbat bilan.
// ============================================================
const SCAN_STEPS = [
  {
    title: L("Kasr chizig'ini toping", 'Найди дробную черту', 'Find the fraction bar'),
    body: L(
      "Chiziq yozuvni ikkiga bo'ladi.",
      'Черта делит запись на две части.',
      'The bar splits the record in two.',
    ),
  },
  {
    title: L('Maxrajga qarang', 'Посмотри на знаменатель', 'Look at the denominator'),
    body: L('Faqat pastki qismga qaraymiz.', 'Смотрим только на нижнюю часть.', 'We look only at the lower part.'),
  },
  {
    title: L('Unda x bormi?', 'Есть ли там x?', 'Is x in there?'),
    body: L('C va D da chiziq ostida x bor.', 'У C и D под чертой есть x.', 'C and D have x under the bar.'),
  },
  {
    title: L('Xulosa chiqaring', 'Сделай вывод', 'Draw the conclusion'),
    body: L(
      "Demak, ularda taqiqlangan qiymat bo'lishi mumkin.",
      'Значит, у них могут быть запрещённые значения.',
      'So they may have forbidden values.',
    ),
  },
]

const S2 = {
  gate: true,
  hint: L(
    'qadamlar navbat bilan ochiladi, birinchisidan boshlang',
    'шаги открываются по очереди, начни с первого',
    'the steps open in order, start with the first',
  ),
  audio: [
    { on: 'mount', text: L(
      "Ifodani ko'rikdan o'tkazishning tartibi bor. To'rt qadam, birinchisini bosing.",
      'У осмотра выражения есть порядок. Четыре шага, нажми первый.',
      'Scanning an expression has an order. Four steps, tap the first one.',
    ) },
    { on: 's1', wait: true, text: L(
      "Kasr chizig'i yozuvni ikkiga bo'ladi. Yuqorisi surat, pastkisi maxraj.",
      'Дробная черта делит запись на две части. Сверху числитель, снизу знаменатель.',
      'The fraction bar splits the record in two. The numerator is above, the denominator below.',
    ) },
    { on: 's2', wait: true, text: L(
      "Surat hozir muhim emas. Taqiq faqat pastda tug'iladi, chunki bo'lish maxrajga bajariladi.",
      'Числитель сейчас не важен. Запрет рождается только внизу, потому что делить приходится на знаменатель.',
      'The numerator does not matter now. The restriction is born below, because we divide by the denominator.',
    ) },
    { on: 's3', wait: true, text: L(
      "Birinchi ikki ifodada chiziq ostida son turadi. Uchinchi va to'rtinchisida esa iks turadi.",
      'У первых двух выражений под чертой стоит число. У третьего и четвёртого там стоит икс.',
      'The first two have a number under the bar. The third and fourth have x there.',
    ) },
    { on: 's4', wait: true, text: L(
      "Chiziq ostida o'zgaruvchi bo'lsa, maxrajni nolga aylantiradigan qiymatlar paydo bo'ladi. Ularni taqiqlangan qiymat deymiz.",
      'Если под чертой есть переменная, появляются значения, которые обращают знаменатель в ноль. Их называют запрещёнными.',
      'If a variable is under the bar, some values turn the denominator into zero. These are the forbidden ones.',
    ) },
  ],
  C: function Screen2({ active, audio, done }) {
    const t = useT()
    const [opened, setOpened] = useState(0)

    const open = (i) => {
      if (i !== opened) return
      const next = i + 1
      setOpened(next)
      if (active) audio.step('s' + next)
      if (next === SCAN_STEPS.length) done()
    }

    const marked = opened >= 3
    return (
      <>
        <Head
          eyebrow={L('Tadqiqot · ovoz bilan bir vaqtda', 'Исследование · синхронно с озвучкой', 'Investigation · in sync with the voice')}
          title={L('Avval qarang', 'Сначала смотри', 'First look')}
          em={L("kasr chizig'i ostiga", 'под дробную черту', 'below the fraction bar')}
          lead={L(
            "Chapdagi qadamlarni bosing. Yoritish izoh bilan bir vaqtda paydo bo'ladi.",
            'Нажимай шаги слева. Подсветка появляется ровно в момент объяснения.',
            'Tap the steps on the left. The highlight appears exactly with the explanation.',
          )}
        />
        <div className="g8l-body d2-scan">
          <div className="g8l-card d2-list">
            <LockedList items={SCAN_STEPS} opened={opened} onOpen={open} />
          </div>
          <div className="g8l-card d2-view">
            <div className={'d2-grid' + (opened >= 1 ? ' is-bars' : '') + (opened >= 2 ? ' is-dens' : '')}>
              {[
                { id: 'A', node: <span>3x + 1</span>, frac: false },
                { id: 'B', node: <span>x² {MINUS} 4</span>, frac: false },
                { id: 'C', node: <Frac num="5" den={<span>x {MINUS} 2</span>} hot={marked} />, frac: true },
                { id: 'D', node: <Frac num={<span>x + 1</span>} den={<span>2x {MINUS} 3</span>} hot={marked} />, frac: true },
              ].map((e) => (
                <div key={e.id} className={'d2-exp' + (e.frac ? ' is-frac' : '')}>
                  <span className="d2-lab" aria-hidden="true">{e.id}</span>
                  <span className="g8l-f is-big">{e.node}</span>
                  {e.frac && opened >= 4 ? (
                    <span className="d2-need">{t(L('cheklov kerak', 'нужно ограничение', 'needs a restriction'))}</span>
                  ) : null}
                </div>
              ))}
            </div>
            {opened >= 4 ? (
              <Reveal show className="d2-concl">
                {t(L(
                  "Maxrajda o'zgaruvchi faqat C va D da bor. Cheklov aynan ularga kerak.",
                  'Переменная в знаменателе есть только у C и D — именно они требуют ограничения.',
                  'Only C and D have the variable in the denominator, so only they need a restriction.',
                ))}
              </Reveal>
            ) : (
              <p className="d2-wait">
                {t(L(
                  "Qadam ochilganda shu yerda xulosa paydo bo'ladi.",
                  'Вывод появится здесь, когда откроются все шаги.',
                  'The conclusion appears here once all steps are open.',
                ))}
              </p>
            )}
          </div>
        </div>
      </>
    )
  },
}

// ============================================================
// 3-EKRAN. SEKIN QO'YISH: surat, maxraj, bo'lish, xulosa.
// ============================================================
const SUB_VALUES = {
  0: {
    rows: ['2 · 0 + 1 = 1', '0 ' + MINUS + ' 3 = ' + MINUS + '3', '1 : (' + MINUS + '3)'],
    fin: L(
      'K(0) = ' + MINUS + '1/3. Formula ishlaydi.',
      'K(0) = ' + MINUS + '1/3. Формула работает.',
      'K(0) = ' + MINUS + '1/3. The formula works.',
    ),
  },
  2: {
    rows: ['2 · 2 + 1 = 5', '2 ' + MINUS + ' 3 = ' + MINUS + '1', '5 : (' + MINUS + '1)'],
    fin: L(
      'K(2) = ' + MINUS + '5. Formula ishlaydi.',
      'K(2) = ' + MINUS + '5. Формула работает.',
      'K(2) = ' + MINUS + '5. The formula works.',
    ),
  },
  3: {
    rows: ['2 · 3 + 1 = 7', '3 ' + MINUS + ' 3 = 0', '7 : 0'],
    fin: L(
      "Nolga bo'lish mumkin emas → K(3) aniqlanmagan.",
      'Делить на 0 нельзя → K(3) не определено.',
      'Division by 0 is impossible → K(3) is undefined.',
    ),
    bad: true,
  },
  4: {
    rows: ['2 · 4 + 1 = 9', '4 ' + MINUS + ' 3 = 1', '9 : 1'],
    fin: L('K(4) = 9. Formula ishlaydi.', 'K(4) = 9. Формула работает.', 'K(4) = 9. The formula works.'),
  },
}

const SUB_LABELS = [
  L('Avval surat', 'Сначала числитель', 'The numerator first'),
  L('Endi maxraj', 'Теперь знаменатель', 'Now the denominator'),
  L("Bo'lishni tekshiramiz", 'Проверяем деление', 'We check the division'),
]

// Ikki tekshiruvning natijasi yonma-yon qoladi: taqqoslash bo'lmasa,
// «nolga bo'lish mumkin emas» degan xulosa havoda qoladi (metodist, 2026-08-11).
const SUB_COMPARE = {
  4: L(
    'x = 4 → maxraj 1 → K(4) = 9',
    'x = 4 → знаменатель 1 → K(4) = 9',
    'x = 4 → denominator 1 → K(4) = 9',
  ),
  3: L(
    "x = 3 → maxraj 0 → qiymat yo'q",
    'x = 3 → знаменатель 0 → значения нет',
    'x = 3 → denominator 0 → no value',
  ),
}

const S3 = {
  gate: true,
  hint: L(
    'avval 4 ni, keyin 3 ni bosing',
    'сначала нажми 4, потом 3',
    'first tap 4, then 3',
  ),
  audio: [
    { on: 'mount', text: L(
      "Uchni qo'yamiz va shoshilmasdan hisoblaymiz.",
      'Подставим три и посчитаем не торопясь.',
      'Let us substitute three and compute slowly.',
    ) },
    { on: 'r1', wait: true, text: L(
      "Suratda ikki karra uch qo'shuv bir. Yetti chiqadi.",
      'В числителе два умножить на три плюс один. Получается семь.',
      'In the numerator, two times three plus one. That gives seven.',
    ) },
    { on: 'r2', wait: true, text: L(
      'Maxrajda uch ayirish uch. Nol chiqadi.',
      'В знаменателе три минус три. Получается ноль.',
      'In the denominator, three minus three. That gives zero.',
    ) },
    { on: 'r3', wait: true, text: L(
      "Yettini nolga bo'lish qoldi. Bunday amal yo'q.",
      'Осталось разделить семь на ноль. Такого действия нет.',
      'It remains to divide seven by zero. There is no such operation.',
    ) },
    { on: 'fin', wait: true, text: L(
      "Demak, uchda formula hech qanday qiymat bermaydi. Ka uchdan aniqlanmagan deyiladi.",
      'Значит, при трёх формула не даёт никакого значения. Говорят, что K от трёх не определено.',
      'So at three the formula gives no value at all. We say that K of three is undefined.',
    ) },
    { on: 'alt', wait: true, text: L(
      "Bu yerda maxraj nol emas, shuning uchun qiymat chiqadi.",
      'Здесь знаменатель не ноль, поэтому значение получается.',
      'Here the denominator is not zero, so a value comes out.',
    ) },
    { on: 'cmp', wait: true, text: L(
      "Ikki holat yonma-yon turibdi. Farq faqat maxrajda: birida bir, ikkinchisida nol. Demak qiymat maxraj nolga aylanmaguncha bor.",
      'Два случая стоят рядом. Разница только в знаменателе: в одном единица, в другом ноль. Значит, значение есть, пока знаменатель не ноль.',
      'The two cases stand side by side. The only difference is the denominator: one and zero. So a value exists while the denominator is not zero.',
    ) },
  ],
  C: function Screen3({ active, audio, done }) {
    const t = useT()
    const [pick, setPick] = useState(null)
    const [seen, setSeen] = useState([])
    const data = pick === null ? null : SUB_VALUES[pick]
    // Metodik tartib: AVVAL ishlaydigan holat (4), KEYIN buziladigan holat (3).
    // Ko'rsatgich shu tartibda siljiydi va vazifa bajarilgach o'chadi.
    const need = seen.indexOf(4) === -1 ? 4 : (seen.indexOf(3) === -1 ? 3 : null)
    const bothDone = seen.indexOf(4) !== -1 && seen.indexOf(3) !== -1

    const onStep = useCallback((i) => {
      if (!active) return
      if (i <= 3) audio.step('r' + i)
      else audio.step(pick === 3 ? 'fin' : 'alt')
    }, [active, audio, pick])

    const shown = useStaged(4, pick, 520, onStep)

    const choose = (v) => {
      setPick(v)
      if (seen.indexOf(v) !== -1) return
      const next = seen.concat([v])
      setSeen(next)
      if (next.indexOf(4) !== -1 && next.indexOf(3) !== -1) {
        done()
        if (active) setTimeout(() => audio.step('cmp'), 2600)
      }
    }

    return (
      <>
        <Head
          eyebrow={L("Sekin qo'yish", 'Медленная подстановка', 'Slow substitution')}
          title={L("x = 3 bo'lganda", 'Что происходит при', 'What happens at')}
          em={L("nima bo'ladi?", 'x = 3?', 'x = 3?')}
          lead={L(
            "Avval 4 ni bosing: formula ishlaydi. Keyin 3 ni bosing va farq qayerda tug'ilganini ko'ring.",
            'Сначала нажми 4 — формула работает. Потом нажми 3 и увидишь, где рождается разница.',
            'First tap 4, the formula works. Then tap 3 and see where the difference is born.',
          )}
        />
        <div className="g8l-body d3-sub">
          <div className="g8l-card d3-panel">
            <h2 className="d3-h">{t(L('x qiymatini tanlang', 'Выбери значение x', 'Choose a value of x'))}</h2>
            <div className="d3-chips">
              {[0, 2, 3, 4].map((v) => (
                <button
                  type="button"
                  key={v}
                  className={
                    'd3-chip' + (pick === v ? ' is-on' : '')
                    + (seen.indexOf(v) !== -1 ? ' is-seen' : '')
                    + (v === need ? ' g8l-pulse' : '')
                  }
                  onClick={() => choose(v)}
                  aria-label={t(L('x ni ' + v + ' deb oling', 'подставить x = ' + v, 'substitute x = ' + v))}
                >
                  {v}
                </button>
              ))}
            </div>
            {/* Ikki majburiy tekshiruvning natijasi shu yerda YONMA-YON qoladi. */}
            <div className="d3-cmp">
              {[4, 3].map((v) => (
                <div key={v} className={'d3-cmp-row' + (seen.indexOf(v) !== -1 ? ' is-on' : '') + (v === 3 ? ' is-bad' : '')}>
                  <span className="d3-cmp-n" aria-hidden="true">{seen.indexOf(v) !== -1 ? '✓' : '·'}</span>
                  <span>{seen.indexOf(v) !== -1
                    ? t(SUB_COMPARE[v])
                    : t(L('x = ' + v + ' ni tekshiring', 'проверь x = ' + v, 'check x = ' + v))}</span>
                </div>
              ))}
            </div>
            {bothDone ? (
              <Reveal show className="d3-take">
                {t(L(
                  "Xulosa: maxraj nolga aylanmaguncha qiymat bor. Nolda qiymat yo'q.",
                  'Вывод: значение есть, пока знаменатель не ноль. При нуле значения нет.',
                  'Conclusion: a value exists while the denominator is not zero. At zero there is none.',
                ))}
              </Reveal>
            ) : null}
          </div>
          <div className="g8l-card d3-box">
            <div className="g8l-f is-big d3-formula">
              K(x) = <Frac num={<span>2x + 1</span>} den={<span>x {MINUS} 3</span>} blocked={pick === 3 && shown >= 2} />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className={'d3-row' + (shown > i ? ' is-on' : '')}>
                <span className="d3-dot" aria-hidden="true">{'0' + (i + 1)}</span>
                <span>
                  <strong>{data ? data.rows[i] : '—'}</strong>
                  <small>{t(SUB_LABELS[i])}</small>
                </span>
              </div>
            ))}
            {data && shown >= 4 ? (
              <Reveal show className={'d3-final' + (data.bad ? ' is-bad' : ' is-ok')}>
                {t(data.fin)}
              </Reveal>
            ) : (
              <p className="d3-hold">
                {t(L(
                  "Xulosa uchinchi qadamdan keyin chiqadi.",
                  'Вывод появится после третьего шага.',
                  'The conclusion appears after the third step.',
                ))}
              </p>
            )}
          </div>
        </div>
      </>
    )
  },
}

// ============================================================
// 4-EKRAN. UCH TUSHUNCHA: butun, kasrli, ratsional kasr.
// ============================================================
const CONCEPTS = [
  {
    title: L('Butun ratsional ifoda', 'Целое рациональное выражение', 'Whole rational expression'),
    short: L(
      "O'zgaruvchili ifodaga bo'lish yo'q.",
      'Деления на выражение с переменной нет.',
      'No division by an expression with a variable.',
    ),
    sample: <span>3x² {MINUS} 2</span>,
    sign: L(
      "Harf bo'lishi mumkin, lekin kasr chizig'i ostida emas.",
      'Буква может быть, но не под дробной чертой.',
      'A letter may appear, but not under the fraction bar.',
    ),
    how: L("bo'luvchi faqat son", 'делитель — только число', 'the divisor is a number only'),
    mark: L("bo'linmaydi, harf shunchaki bor", 'делить не на что, буква просто есть', 'nothing to divide by, the letter is just there'),
    odz: L("cheklov paydo bo'lmaydi", 'ограничений не возникает', 'no restrictions appear'),
  },
  {
    title: L('Kasrli ratsional ifoda', 'Дробное рациональное выражение', 'Fractional rational expression'),
    short: L(
      "O'zgaruvchili ifodaga bo'lish bor.",
      'Есть деление на выражение с переменной.',
      'There is division by an expression with a variable.',
    ),
    sample: <Frac num="5" den={<span>x {MINUS} 2</span>} />,
    sign: L(
      "O'zgaruvchi bo'luvchida turadi.",
      'Переменная стоит в делителе.',
      'The variable stands in the divisor.',
    ),
    how: L("x kasr chizig'i ostida", 'x под дробной чертой', 'x under the fraction bar'),
    mark: L("x " + MINUS + " 2 ga bo'linadi", 'делим на x ' + MINUS + ' 2', 'we divide by x ' + MINUS + ' 2'),
    odz: L('maxrajning nollari topiladi', 'нужно найти нули знаменателя', 'find the zeros of the denominator'),
  },
  {
    title: L('Ratsional kasr', 'Рациональная дробь', 'Rational fraction'),
    short: L(
      'A(x)/B(x) shakli, B(x) ' + NE + ' 0.',
      'Форма A(x)/B(x), где B(x) ' + NE + ' 0.',
      'The form A(x)/B(x), where B(x) ' + NE + ' 0.',
    ),
    sample: <Frac num="A(x)" den="B(x)" />,
    sign: L(
      "A(x) va B(x) ko'phadlar, maxraj nolga teng emas.",
      'A(x) и B(x) — многочлены, знаменатель не равен нулю.',
      'A(x) and B(x) are polynomials, the denominator is not zero.',
    ),
    how: L('surat va maxraj yozuvi', 'запись числитель и знаменатель', 'a numerator over a denominator'),
    mark: L("B(x) ga bo'linadi, B(x) " + NE + " 0", 'делим на B(x), и B(x) ' + NE + ' 0', 'we divide by B(x), and B(x) ' + NE + ' 0'),
    odz: L('B(x) ning ildizlari chiqariladi', 'корни B(x) исключаются', 'the roots of B(x) are excluded'),
  },
]

const S4 = {
  gate: true,
  hint: L(
    'uchta kartochkaning hammasini oching',
    'открой все три карточки',
    'open all three cards',
  ),
  audio: [
    { on: 'mount', text: L(
      "Uch nom bir xil eshitiladi, lekin boshqa narsani anglatadi. Uchtasini ham oching.",
      'Три названия звучат похоже, но означают разное. Открой все три карточки.',
      'Three names sound alike but mean different things. Open all three cards.',
    ) },
    { on: 'c1', wait: true, text: L(
      "Butun ratsional ifodada harf bo'lishi mumkin, lekin bo'lish faqat songa bajariladi.",
      'В целом рациональном выражении буква может быть, но делить в нём приходится только на число.',
      'A whole rational expression may contain a letter, but division there is only by a number.',
    ) },
    { on: 'c2', wait: true, text: L(
      "Kasrli ratsional ifoda o'zgaruvchili ifodaga bo'ladi. Aynan shuning uchun unda taqiqlangan qiymatlar paydo bo'ladi.",
      'Дробное рациональное выражение делит на выражение с переменной. Именно поэтому у него появляются запрещённые значения.',
      'A fractional rational expression divides by an expression with a variable. That is why forbidden values appear.',
    ) },
    { on: 'c3', wait: true, text: L(
      "Ratsional kasr bu shunday yozuv: yuqorida ko'phad, pastda ko'phad va maxraj nolga teng emas.",
      'Рациональная дробь это запись, где сверху многочлен, снизу многочлен, и знаменатель не равен нулю.',
      'A rational fraction is a record with a polynomial above, a polynomial below, and a non zero denominator.',
    ) },
  ],
  C: function Screen4({ active, audio, done }) {
    const t = useT()
    const [open, setOpen] = useState(null)
    const [seen, setSeen] = useState([])

    const choose = (i) => {
      setOpen(i)
      if (seen.indexOf(i) === -1) {
        const next = seen.concat([i])
        setSeen(next)
        if (active) audio.step('c' + (i + 1))
        if (next.length === CONCEPTS.length) done()
      }
    }

    const c = open === null ? null : CONCEPTS[open]
    return (
      <>
        <Head
          eyebrow={L('Metodik tayanch', 'Методическая опора', 'Method support')}
          title={L('Uch tushuncha', 'Три понятия —', 'Three notions —')}
          em={L('bir xil narsa emas', 'не одно и то же', 'not the same thing')}
          lead={L(
            "Kartochkani bosing: pastda aniq farq va tanish usuli chiqadi.",
            'Нажми карточку: внизу появится точное различие и способ распознавания.',
            'Tap a card: the exact difference and the way to recognise it appear below.',
          )}
        />
        <div className="g8l-body d4-wrap">
          <div className="d4-grid">
            {CONCEPTS.map((item, i) => (
              <button
                type="button"
                key={i}
                className={
                  'g8l-card d4-card' + (open === i ? ' is-on' : '')
                  + (open === null && i === 0 ? ' g8l-pulse' : '')
                }
                onClick={() => choose(i)}
                aria-pressed={open === i}
              >
                <span className="d4-id" aria-hidden="true">{'0' + (i + 1)}</span>
                <span className="d4-t">{t(item.title)}</span>
                <span className="d4-p">{t(item.short)}</span>
                <span className="g8l-f d4-sample">{item.sample}</span>
                <span className="d4-mark">{t(item.mark)}</span>
                {seen.indexOf(i) !== -1 ? <span className="d4-seen">✓</span> : null}
              </button>
            ))}
          </div>
          <div className="g8l-card d4-panel">
            <div className="d4-badge">
              {c
                ? <>{'0' + (open + 1)}<br />{t(L('BELGI', 'ПРИЗНАК', 'SIGN'))}</>
                : <>{t(L("BO'LISHGA", 'СМОТРИ НА', 'LOOK AT THE'))}<br />{t(L('QARANG', 'ДЕЛЕНИЕ', 'DIVISION'))}</>}
            </div>
            <div className="d4-text">
              <h3>{c ? t(c.title) : t(L('Asosiy savol', 'Главный вопрос', 'The main question'))}</h3>
              <p>
                {c
                  ? t(c.sign)
                  : t(L(
                    "Nimaga bo'linayotganini tekshiring, harf borligini emas.",
                    'Проверяй выражение, на которое делят, а не наличие буквы вообще.',
                    'Check the expression you divide by, not just the presence of a letter.',
                  ))}
              </p>
              <div className="d4-facts">
                <div className="d4-fact">
                  <b>{t(L('Qanday tanish kerak', 'Как распознать', 'How to recognise'))}</b>
                  {c ? t(c.how) : t(L("x kasr chizig'i ostida", 'x под дробной чертой', 'x under the fraction bar'))}
                </div>
                <div className="d4-fact">
                  <b>{t(L('ODZ bilan nima', 'Что с ОДЗ', 'What about the domain'))}</b>
                  {c ? t(c.odz) : t(L("cheklov paydo bo'ladi", 'появляется ограничение', 'a restriction appears'))}
                </div>
              </div>
            </div>
          </div>
          {seen.length === CONCEPTS.length ? (
            <Reveal show className="d4-take">
              {t(L(
                "Xulosa: turni BO'LUVCHI belgilaydi. Bo'luvchi son bo'lsa butun, o'zgaruvchili ifoda bo'lsa kasrli. Ratsional kasr esa A(x)/B(x) yozuvi, unda B(x) " + NE + " 0.",
                'Вывод: тип определяет ДЕЛИТЕЛЬ. Делитель число — целое, делитель с переменной — дробное. Рациональная дробь это запись A(x)/B(x) с условием B(x) ' + NE + ' 0.',
                'Conclusion: the DIVISOR decides the type. A number means whole, an expression with a variable means fractional. A rational fraction is A(x) / B(x) with B(x) ' + NE + ' 0.',
              ))}
            </Reveal>
          ) : null}
        </div>
      </>
    )
  },
}

// ============================================================
// 5-EKRAN. NOL SURATDA VA NOL MAXRAJDA.
// ============================================================
const S5 = {
  gate: true,
  hint: L(
    'ikkinchi tugma birinchi izohdan keyin ochiladi',
    'вторая кнопка откроется после первого объяснения',
    'the second button opens after the first explanation',
  ),
  audio: [
    { on: 'mount', text: L(
      "Nol yuqorida va pastda o'zini boshqacha tutadi. Avval suratni tekshiramiz.",
      'Ноль ведёт себя по-разному сверху и снизу. Сначала проверим числитель.',
      'Zero behaves differently above and below. First we check the numerator.',
    ) },
    { on: 'good', wait: true, text: L(
      "Nolni to'rtga bo'ldik. Javob nol, ya'ni qiymat bor. Suratdagi nol ruxsat etiladi. Endi ikkinchi tugmani bosing.",
      'Ноль разделили на четыре. Ответ ноль, значение есть. Ноль в числителе разрешён. Теперь нажми вторую кнопку.',
      'Zero divided by four. The answer is zero, the value exists. Zero on top is allowed. Now tap the second button.',
    ) },
    { on: 'bad', wait: true, text: L(
      "To'rtni nolga bo'lish mumkin emas: bunday son yo'q. Shuning uchun kasr bu nuqtada aniqlanmagan.",
      'Четыре разделить на ноль нельзя: такого числа нет. Поэтому дробь в этой точке не определена.',
      'Four divided by zero is impossible: there is no such number. So the fraction is undefined here.',
    ) },
  ],
  C: function Screen5({ active, audio, done }) {
    const t = useT()
    const [good, setGood] = useState(false)
    const [bad, setBad] = useState(false)

    const check = (which) => {
      if (which === 'good') {
        setGood(true)
        if (active) audio.step('good')
        return
      }
      setBad(true)
      done()
      if (active) audio.step('bad')
    }

    return (
      <>
        <Head
          eyebrow={L("Ko'rgazmali tajriba", 'Визуальный эксперимент', 'Visual experiment')}
          title={L('Yuqoridagi nol va pastdagi nol', 'Ноль сверху и ноль снизу дают', 'Zero above and zero below give')}
          em={L('boshqa natija beradi', 'разный результат', 'different results')}
          lead={L(
            "Har kartochkada «Tekshirish» ni bosing. Ovoz ularni ketma-ket tushuntiradi.",
            'Нажми «Проверить» на каждой карточке. Озвучка объясняет их последовательно.',
            'Tap «Check» on each card. The voice explains them one after another.',
          )}
        />
        <div className="g8l-body">
          <div className="d5-lab">
            <div className="g8l-card d5-card">
              <div className="d5-head">
                <h3>{t(L('1. Suratdagi nol', '1. Ноль в числителе', '1. Zero in the numerator'))}</h3>
                <button
                  type="button"
                  className={'d5-btn' + (good ? ' is-done' : ' g8l-pulse')}
                  onClick={() => check('good')}
                  disabled={good}
                >
                  {t(good
                    ? L('Tekshirildi ✓', 'Проверено ✓', 'Checked ✓')
                    : L('Tekshirish', 'Проверить', 'Check'))}
                </button>
              </div>
              <div className="g8l-f is-big d5-formula">
                P(3) = <Frac num={<span>3 {MINUS} 3</span>} den={<span>3 + 1</span>} />
              </div>
              <div className={'d5-res' + (good ? ' is-ok' : '')}>
                {good ? (
                  <Reveal show>
                    <strong>0 : 4 = 0</strong>
                    <span>{t(L('Kasr aniqlangan', 'Дробь определена', 'The fraction is defined'))}</span>
                  </Reveal>
                ) : t(L('Tugmani bosing, hisob chiqadi', 'Нажми кнопку — появится вычисление', 'Tap the button and the computation appears'))}
              </div>
            </div>

            <div className="g8l-card d5-card is-danger">
              <div className="d5-head">
                <h3>{t(L('2. Maxrajdagi nol', '2. Ноль в знаменателе', '2. Zero in the denominator'))}</h3>
                <button
                  type="button"
                  className={'d5-btn' + (good && !bad ? ' g8l-pulse' : '') + (bad ? ' is-done' : '')}
                  onClick={() => check('bad')}
                  disabled={!good || bad}
                >
                  {t(bad
                    ? L('Tekshirildi ✓', 'Проверено ✓', 'Checked ✓')
                    : !good
                      ? L('Yopiq', 'Закрыто', 'Locked')
                      : L('Tekshirish', 'Проверить', 'Check'))}
                </button>
              </div>
              <div className="g8l-f is-big d5-formula">
                Q(3) = <Frac num={<span>3 + 1</span>} den={<span>3 {MINUS} 3</span>} blocked />
              </div>
              <div className={'d5-res' + (bad ? ' is-bad' : '')}>
                {bad ? (
                  <Reveal show>
                    <strong>4 : 0</strong>
                    <span>{t(L("Bunday amal yo'q, kasr aniqlanmagan", 'Такого действия нет, дробь не определена', 'No such operation, the fraction is undefined'))}</span>
                  </Reveal>
                ) : good
                  ? t(L('Endi bu yerni bosing', 'Теперь нажми здесь', 'Now tap here'))
                  : t(L('Birinchi izohdan keyin ochiladi', 'Откроется после первого объяснения', 'Opens after the first explanation'))}
              </div>
            </div>
          </div>

          <div className={'d5-track' + (bad ? ' is-final' : '')}>
            <span className="d5-track-n" aria-hidden="true">{bad ? '✓' : good ? '02' : '01'}</span>
            <span>
              {t(bad
                ? L(
                  "0 : 4 = 0, ammo 4 : 0 aniqlanmagan. Suratdagi nol qiymat beradi, maxrajdagi nol bo'lishni taqiqlaydi.",
                  '0 : 4 = 0, а 4 : 0 не определено. Ноль в числителе даёт значение, ноль в знаменателе запрещает деление.',
                  '0 : 4 = 0, but 4 : 0 is undefined. Zero on top gives a value, zero below forbids the division.',
                )
                : good
                  ? L(
                    'Suratdagi nol ruxsat etiladi. Endi pastdagi nolni tekshiring.',
                    'Ноль сверху допустим. Теперь проверь ноль снизу.',
                    'Zero on top is allowed. Now check zero below.',
                  )
                  : L(
                    'Avval suratda nol ruxsat etilganini tekshiramiz.',
                    'Сначала проверим, разрешён ли ноль в числителе.',
                    'First we check whether zero is allowed in the numerator.',
                  ))}
            </span>
          </div>
        </div>
      </>
    )
  },
}

// ============================================================
// 6 va 7-EKRANLAR uchun umumiy shakl: savol + har variantga O'Z izohi.
// Yechim FAQAT to'g'ri javobdan keyin, qadamba-qadam ochiladi.
// ============================================================
const Question = ({ active, audio, done, mark, id, figure, ask, items, correct, hints, okText, steps }) => {
  const t = useT()
  const [picked, setPicked] = useState(null)
  const [wrongs, setWrongs] = useState([])
  const [fb, setFb] = useState(null)

  const shown = useStaged(steps.length, picked, 540)

  const pick = (i) => {
    if (picked !== null) return
    if (i === correct) {
      setPicked(i)
      setFb({ kind: 'ok', text: okText })
      mark(id, wrongs.length === 0)
      done()
      if (active) audio.step('ok')
      return
    }
    setWrongs(wrongs.concat([i]))
    setFb({ kind: 'bad', text: hints[i] })
    if (active) audio.step('no')
  }

  return (
    <div className="g8l-body d6-q">
      <div className="g8l-card d6-fig">{figure}</div>
      <div className="g8l-card d6-ans">
        <h2 className="d6-ask">{t(ask)}</h2>
        <Options items={items} picked={picked} wrongs={wrongs} onPick={pick} />
        <Feedback kind={fb ? fb.kind : 'plain'}>
          {fb ? t(fb.text) : t(L(
            "Javobni tanlang: har bir variantga o'z izohi bor.",
            'Выбери ответ: у каждого варианта свой комментарий.',
            'Choose an answer: each option has its own comment.',
          ))}
        </Feedback>
        {picked !== null ? (
          <div className="d6-sol">
            {steps.map((s, i) => (
              <span key={i} className={'d6-step' + (shown > i ? ' is-on' : '')}>{s}</span>
            ))}
          </div>
        ) : (
          <p className="d6-locked">
            {t(L(
              "Yechim to'g'ri javobdan keyin ochiladi.",
              'Решение откроется только после правильного ответа.',
              'The solution opens only after the correct answer.',
            ))}
          </p>
        )}
      </div>
    </div>
  )
}

const S6 = {
  gate: true,
  hint: L(
    "yechim to'g'ri javobdan keyin ochiladi",
    'решение откроется после правильного ответа',
    'the solution opens after the correct answer',
  ),
  audio: [
    { on: 'mount', text: L(
      "Ikki formula, bitta nuqta. Uchda qaysi biri qiymat beradi?",
      'Две формулы, одна точка. Какая из них даёт значение при трёх?',
      'Two formulas, one point. Which one gives a value at three?',
    ) },
    { on: 'no', wait: true, text: L(
      "Nol qayerda paydo bo'lganiga yana bir qarang.",
      'Посмотри ещё раз, где именно оказался ноль.',
      'Look again at where exactly the zero appeared.',
    ) },
    { on: 'ok', wait: true, text: L(
      "Pe da nol suratda paydo bo'ladi, bu ruxsat etiladi. Ku da nol maxrajda paydo bo'ladi, bu esa taqiq.",
      'В P нулём становится числитель, и это разрешено. В Q нулём становится знаменатель, а это запрет.',
      'In P the numerator becomes zero, and that is allowed. In Q the denominator becomes zero, and that is forbidden.',
    ) },
  ],
  C: function Screen6(props) {
    const t = useT()
    return (
      <>
        <Head
          eyebrow={L('Tushunishni tekshirish · har javobga izoh', 'Проверка понимания · комментарий к каждому ответу', 'Comprehension check · a comment for every answer')}
          title={L('x = 3 da qaysi formula', 'Какая формула определена при', 'Which formula is defined at')}
          em={L('aniqlangan?', 'x = 3?', 'x = 3?')}
          lead={L(
            "Yechim faqat to'g'ri javobdan keyin ochiladi.",
            'Решение откроется только после правильного ответа.',
            'The solution opens only after the correct answer.',
          )}
        />
        <Question
          {...props}
          id="s6"
          figure={
            <>
              <div className="g8l-f is-big">
                P(x) = <Frac num={<span>x {MINUS} 3</span>} den={<span>x + 1</span>} />
              </div>
              <div className="g8l-f is-big d6-second">
                Q(x) = <Frac num={<span>x + 1</span>} den={<span>x {MINUS} 3</span>} />
              </div>
              <p className="d6-note">{t(L('Nolning joyini solishtiring.', 'Сравни положение нуля.', 'Compare where the zero lands.'))}</p>
            </>
          }
          ask={L('Bitta javobni tanlang', 'Выбери один ответ', 'Choose one answer')}
          items={[
            L('ikkala formula', 'обе формулы', 'both formulas'),
            L('faqat P(x)', 'только P(x)', 'only P(x)'),
            L('faqat Q(x)', 'только Q(x)', 'only Q(x)'),
            L('birortasi ham emas', 'ни одна', 'neither'),
          ]}
          correct={1}
          hints={[
            L(
              "Q aniqlanmagan: uning maxraji nolga aylanadi.",
              'Q не определена: её знаменатель становится нулём.',
              'Q is undefined: its denominator becomes zero.',
            ),
            null,
            L(
              "Yuqoridagi nol ruxsat etiladi, Q da esa nol pastda turadi.",
              'Ноль сверху допустим, а у Q ноль находится снизу.',
              'Zero on top is allowed, but in Q the zero is below.',
            ),
            L(
              "P aniqlangan: nolni to'rtga bo'lish mumkin.",
              'P определена: ноль можно делить на четыре.',
              'P is defined: zero may be divided by four.',
            ),
          ]}
          okText={L(
            "To'g'ri. Endi yechim qadamba-qadam ochiladi.",
            'Верно. Теперь решение открывается по шагам.',
            'Correct. Now the solution opens step by step.',
          )}
          steps={['P(3)', '0 : 4 = 0', 'Q(3) = 4 : 0']}
        />
      </>
    )
  },
}

const S7 = {
  gate: true,
  hint: L(
    "har bir noto'g'ri variantga o'z izohi bor",
    'у каждого неверного варианта своя подсказка',
    'every wrong option has its own hint',
  ),
  audio: [
    { on: 'mount', text: L(
      "Taqiqlangan qiymatni topish tartibi bor. Birinchi qadamni tanlang.",
      'У поиска запрещённого значения есть порядок. Выбери первый шаг.',
      'Finding a forbidden value has an order. Choose the first step.',
    ) },
    { on: 'no', wait: true, text: L(
      "Taqiqni nima tug'dirishini eslang: bo'lish maxrajga bajariladi.",
      'Вспомни, что создаёт запрет: делить приходится на знаменатель.',
      'Recall what creates the restriction: we divide by the denominator.',
    ) },
    { on: 'ok', wait: true, text: L(
      "Maxrajni nolga tenglashtiramiz, tenglamani yechamiz va topilgan qiymatni chiqarib tashlaymiz.",
      'Приравниваем знаменатель к нулю, решаем уравнение и вычёркиваем найденное значение.',
      'We set the denominator to zero, solve the equation and cross out the value we found.',
    ) },
  ],
  C: function Screen7(props) {
    const t = useT()
    return (
      <>
        <Head
          eyebrow={L("Algoritm · to'g'ri javobga qadar", 'Алгоритм · ведём до верного', 'Algorithm · we lead to the correct answer')}
          title={L('Taqiqlangan qiymatni', 'Как найти', 'How to find')}
          em={L('qanday topamiz?', 'запрещённое значение?', 'a forbidden value?')}
          lead={L(
            "Har bir noto'g'ri variant o'z izohini oladi. To'g'risidan keyin yechim qadamba-qadam ochiladi.",
            'Каждый неверный вариант получает свою подсказку. После верного — решение по шагам.',
            'Every wrong option gets its own hint. After the correct one, the solution opens step by step.',
          )}
        />
        <Question
          {...props}
          id="s7"
          figure={
            <>
              <Tag>R(x)</Tag>
              <div className="g8l-f is-hero d6-hero">
                <Frac num={<span>x + 5</span>} den={<span>2x {MINUS} 6</span>} />
              </div>
              <p className="d6-note">
                {t(L(
                  "Kasr ma'nosini yo'qotadigan qiymatni toping.",
                  'Найди значение, при котором дробь теряет смысл.',
                  'Find the value at which the fraction loses its meaning.',
                ))}
              </p>
            </>
          }
          ask={L('Avval nima qilish kerak?', 'Что нужно сделать первым?', 'What should be done first?')}
          items={[
            L('x + 5 = 0', 'x + 5 = 0', 'x + 5 = 0'),
            L('2x ' + MINUS + ' 6 = 1', '2x ' + MINUS + ' 6 = 1', '2x ' + MINUS + ' 6 = 1'),
            L('2x ' + MINUS + ' 6 = 0', '2x ' + MINUS + ' 6 = 0', '2x ' + MINUS + ' 6 = 0'),
            L('2x ' + MINUS + ' 6 = x + 5', '2x ' + MINUS + ' 6 = x + 5', '2x ' + MINUS + ' 6 = x + 5'),
          ]}
          correct={2}
          hints={[
            L(
              "Taqiqni maxraj tug'diradi, surat emas.",
              'Запрет создаёт знаменатель, а не числитель.',
              'The restriction comes from the denominator, not the numerator.',
            ),
            L(
              "Maxrajning nolini izlash kerak, birini emas.",
              'Нужно найти ноль знаменателя, а не единицу.',
              'We need the zero of the denominator, not one.',
            ),
            null,
            L(
              "Suratni maxraj bilan solishtirish talab qilinmaydi.",
              'Сравнивать числитель и знаменатель не требуется.',
              'Comparing numerator and denominator is not required.',
            ),
          ]}
          okText={L(
            "To'g'ri. Endi yechim qadamba-qadam ochiladi.",
            'Верно. Теперь решение открывается по шагам.',
            'Correct. Now the solution opens step by step.',
          )}
          steps={['2x ' + MINUS + ' 6 = 0', '2x = 6', 'x = 3']}
        />
      </>
    )
  },
}

// ============================================================
// 8-EKRAN. ODZ QOIDASI: uch qadam navbat bilan + misolga qo'llash.
// ============================================================
const RULES = [
  {
    title: L('Maxraj B(x) ni toping', 'Найди знаменатель B(x)', 'Find the denominator B(x)'),
    body: L(
      "Faqat kasr chizig'i ostiga qarang. Surat taqiq yaratmaydi.",
      'Смотри только под дробную черту. Числитель запрета не создаёт.',
      'Look only under the fraction bar. The numerator creates no restriction.',
    ),
    line: 'B(x) = x² ' + MINUS + ' 4',
  },
  {
    title: L('B(x) ' + NE + ' 0 deb yozing', 'Запиши B(x) ' + NE + ' 0', 'Write B(x) ' + NE + ' 0'),
    body: L(
      "Maxraj nolga teng bo'lmasligi shart, aks holda nolga bo'lish paydo bo'ladi.",
      'Знаменатель обязан быть ненулевым, иначе возникает деление на ноль.',
      'The denominator must be non zero, otherwise division by zero appears.',
    ),
    line: 'x² ' + MINUS + ' 4 ' + NE + ' 0',
  },
  {
    title: L('Yechib, ildizlarni chiqaring', 'Реши и исключи корни', 'Solve and exclude the roots'),
    body: L(
      "Maxrajning barcha ildizlari mumkin bo'lgan qiymatlardan chiqarib tashlanadi.",
      'Все корни знаменателя вычёркиваются из допустимых значений.',
      'All roots of the denominator are crossed out of the allowed values.',
    ),
    line: 'x ' + NE + ' ' + MINUS + '2, x ' + NE + ' 2',
  },
]

const S8 = {
  gate: true,
  hint: L(
    'qoidalar faqat navbat bilan ochiladi',
    'правила открываются строго по очереди',
    'the rules open strictly in order',
  ),
  audio: [
    { on: 'mount', text: L(
      "ODZ uch harakatdan iborat. Birinchi qoidani bosing.",
      'ОДЗ это три действия. Нажми первое правило.',
      'The domain takes three actions. Tap the first rule.',
    ) },
    { on: 'r1', wait: true, text: L(
      "Birinchi harakat: maxrajni ajratib olish. Bu yerda u iks kvadrat ayirish to'rt.",
      'Первое действие: выделить знаменатель. Здесь это икс в квадрате минус четыре.',
      'First action: single out the denominator. Here it is x squared minus four.',
    ) },
    { on: 'r2', wait: true, text: L(
      "Ikkinchi harakat: maxraj nolga teng emas degan shartni yozish.",
      'Второе действие: записать условие, что знаменатель не равен нулю.',
      'Second action: write the condition that the denominator is not zero.',
    ) },
    { on: 'r3', wait: true, text: L(
      "Uchinchi harakat: shartni yechish. Ikkita ildiz chiqadi va ikkisi ham chiqarib tashlanadi.",
      'Третье действие: решить условие. Получаются два корня, и оба исключаются.',
      'Third action: solve the condition. Two roots appear, and both are excluded.',
    ) },
  ],
  C: function Screen8({ active, audio, done }) {
    const t = useT()
    const [opened, setOpened] = useState(0)

    const open = (i) => {
      if (i !== opened) return
      const next = i + 1
      setOpened(next)
      if (active) audio.step('r' + next)
      if (next === RULES.length) done()
    }

    return (
      <>
        <Head
          eyebrow={L("Qoida yakuni · to'liq qo'llash", 'Итог правила · полное применение', 'The rule · full application')}
          title={L('Ratsional kasrning ODZ si —', 'ОДЗ рациональной дроби —', 'The domain of a rational fraction —')}
          em={L('uch harakat', 'три действия', 'three actions')}
          lead={L(
            "Har bir qoidani bosing. O'ng tomonda u darhol misolga qo'llanadi.",
            'Нажми каждое правило. Справа оно сразу применяется к примеру.',
            'Tap each rule. On the right it is applied to the example at once.',
          )}
        />
        <div className="g8l-body d8-rule">
          <div className="d8-list">
            <LockedList items={RULES} opened={opened} onOpen={open} />
          </div>
          <div className="g8l-card d8-apply">
            <h3>
              {t(L("Qo'llaymiz:", 'Применяем к', 'Applied to'))}{' '}
              <span className="g8l-f"><Frac num={<span>x + 1</span>} den={<span>x² {MINUS} 4</span>} /></span>
            </h3>
            <div className="d8-chain">
              {RULES.map((r, i) => (
                <div key={i} className={'d8-line' + (opened > i ? ' is-on' : '') + (i === 2 ? ' is-last' : '')}>
                  <span className="g8l-f">{r.line}</span>
                </div>
              ))}
            </div>
            <Caption>
              {t(L(
                "O'quvchi qoidaning yozuvini emas, uning aniq ifodadagi ta'sirini ko'radi.",
                'Видно не только формулу правила, но и её действие на конкретном выражении.',
                'You see not just the rule, but its effect on a concrete expression.',
              ))}
            </Caption>
          </div>
        </div>
      </>
    )
  },
}

// ============================================================
// 9-12 va 14-EKRANLAR. BESHLIK ZANJIRLAR.
// Keyingi topshiriq faqat to'g'ri javob va izohdan keyin ochiladi.
// ============================================================

// O'quvchining mulohazasi (12-ekran): qo'shtirnoq ichidagi da'vo.
// `math` -- yozuvning matematik qismi (ikki qavatli kasr): metodist talabi
// 2026-08-11 «uravneniya i formuly pishi pravilno kak v matematike».
const Claim = ({ text, pre, math, post }) => {
  const t = useT()
  if (math) {
    return (
      <span className="d12-claim">
        {'«'}{pre ? t(pre) + ' ' : ''}
        <span className="d12-claim-m">{math}</span>
        {post ? ' ' + t(post) : ''}{'»'}
      </span>
    )
  }
  return <span className="d12-claim">{'«' + t(text) + '»'}</span>
}

// Zanjir ekranining umumiy tanasi: sarlavha + `Sequence`.
const SeqScreen = ({ head, tasks, helpNote, method, active, audio, done, mark, id }) => (
  <>
    <Head {...head} />
    <div className="g8l-body">
      <Sequence
        tasks={tasks}
        helpNote={helpNote}
        method={method}
        onFirstTry={(i, first) => mark(id + ':' + i, first)}
        onDone={done}
        onOpen={() => { if (active) audio.step('open') }}
      />
    </div>
  </>
)

const ASK_FORBIDDEN = L('Qaysi x taqiqlangan?', 'Какое x запрещено?', 'Which x is forbidden?')
const V = (s) => L(s, s, s)

const S9_TASKS = [
  {
    micro: ASK_FORBIDDEN,
    body: <Frac num="5" den={<span>x {MINUS} 4</span>} />,
    options: [V('x = 4'), V('x = ' + MINUS + '4'), V('x = 0'), V('x = 5')],
    correct: 0,
    ok: L(
      "To'rtda maxraj nolga aylanadi.",
      'При x = 4 знаменатель равен нулю.',
      'At x = 4 the denominator equals zero.',
    ),
    hints: [
      null,
      L(
        "Minus to'rtda maxraj minus sakkizga teng.",
        'При минус четырёх знаменатель равен минус восьми.',
        'At minus four the denominator equals minus eight.',
      ),
      L(
        "Nolda maxraj minus to'rtga teng.",
        'При нуле знаменатель равен минус четырём.',
        'At zero the denominator equals minus four.',
      ),
      L(
        "Beshda maxraj birga teng, bo'lish mumkin.",
        'При пяти знаменатель равен одному, деление возможно.',
        'At five the denominator equals one, division is possible.',
      ),
    ],
  },
  {
    micro: ASK_FORBIDDEN,
    body: <Frac num={<span>x + 1</span>} den="2x" />,
    options: [V('x = 2'), V('x = ' + MINUS + '2'), V('x = 0'), V('x = 1')],
    correct: 2,
    ok: L('2x = 0 faqat x = 0 da.', '2x = 0 только при x = 0.', '2x = 0 only at x = 0.'),
    hints: [
      L("Ikkida maxraj to'rtga teng.", 'При двух знаменатель равен четырём.', 'At two the denominator equals four.'),
      L(
        "Minus ikkida maxraj minus to'rtga teng.",
        'При минус двух знаменатель равен минус четырём.',
        'At minus two the denominator equals minus four.',
      ),
      null,
      L('Birda maxraj ikkiga teng.', 'При одном знаменатель равен двум.', 'At one the denominator equals two.'),
    ],
  },
  {
    micro: ASK_FORBIDDEN,
    body: <Frac num="3" den={<span>x + 6</span>} />,
    options: [V('x = 6'), V('x = ' + MINUS + '6'), V('x = 3'), V('x = 0')],
    correct: 1,
    ok: L(
      'x + 6 = 0, demak x = ' + MINUS + '6.',
      'x + 6 = 0, поэтому x = ' + MINUS + '6.',
      'x + 6 = 0, hence x = ' + MINUS + '6.',
    ),
    hints: [
      L("Oltida maxraj o'n ikkiga teng.", 'При шести знаменатель равен двенадцати.', 'At six the denominator equals twelve.'),
      null,
      L("Uchda maxraj to'qqizga teng.", 'При трёх знаменатель равен девяти.', 'At three the denominator equals nine.'),
      L('Nolda maxraj oltiga teng.', 'При нуле знаменатель равен шести.', 'At zero the denominator equals six.'),
    ],
  },
  {
    micro: L('Qaysi x lar taqiqlangan?', 'Какие x запрещены?', 'Which values of x are forbidden?'),
    body: <Frac num="x" den={<span>x² {MINUS} 9</span>} />,
    options: [
      L('faqat 3', 'только 3', 'only 3'),
      L(MINUS + '3 va 3', MINUS + '3 и 3', MINUS + '3 and 3'),
      L('faqat ' + MINUS + '3', 'только ' + MINUS + '3', 'only ' + MINUS + '3'),
      L('0 va 9', '0 и 9', '0 and 9'),
    ],
    correct: 1,
    ok: L(
      'x² ' + MINUS + ' 9 = 0 ning ikkita ildizi bor: ' + MINUS + '3 va 3.',
      'x² ' + MINUS + ' 9 = 0 имеет два корня: ' + MINUS + '3 и 3.',
      'x² ' + MINUS + ' 9 = 0 has two roots: ' + MINUS + '3 and 3.',
    ),
    hints: [
      L("Uch to'g'ri, lekin ildiz bitta emas.", 'Три подходит, но корень не один.', 'Three works, but it is not the only root.'),
      null,
      L("Minus uch to'g'ri, lekin ildiz bitta emas.", 'Минус три подходит, но корень не один.', 'Minus three works, but it is not the only root.'),
      L(
        "Nol va to'qqiz maxrajni nolga aylantirmaydi.",
        'Ноль и девять знаменатель в ноль не обращают.',
        'Zero and nine do not turn the denominator into zero.',
      ),
    ],
  },
  {
    micro: L('Taqiq bormi?', 'Есть запреты?', 'Are there restrictions?'),
    body: <Frac num="2" den={<span>x² + 1</span>} />,
    options: [
      V('x ' + NE + ' 1'),
      V('x ' + NE + ' ' + MINUS + '1'),
      L("taqiq yo'q", 'запретов нет', 'no restrictions'),
      V('x ' + NE + ' 0'),
    ],
    correct: 2,
    ok: L(
      "x² + 1 birdan kichik emas, shuning uchun taqiq yo'q.",
      'x² + 1 всегда не меньше одного, поэтому запретов нет.',
      'x² + 1 is never less than one, so there are no restrictions.',
    ),
    hints: [
      L('Birda maxraj ikkiga teng.', 'При одном знаменатель равен двум.', 'At one the denominator equals two.'),
      L('Minus birda maxraj ham ikkiga teng.', 'При минус одном знаменатель тоже равен двум.', 'At minus one the denominator also equals two.'),
      null,
      L('Nolda maxraj birga teng.', 'При нуле знаменатель равен одному.', 'At zero the denominator equals one.'),
    ],
  },
]

const S9 = {
  gate: true,
  hint: L(
    "keyingi misol to'g'ri javobdan keyin ochiladi",
    'следующий пример откроется после верного ответа',
    'the next example opens after a correct answer',
  ),
  audio: [
    { on: 'mount', text: L(
      "Besh misol. Har birida maxrajni nolga tenglashtirib, taqiqlangan qiymatni toping.",
      'Пять примеров. В каждом приравняй знаменатель к нулю и найди запрещённое значение.',
      'Five examples. In each one set the denominator to zero and find the forbidden value.',
    ) },
    { on: 'open', wait: true, text: L(
      'Keyingi misol ochildi. Yana maxrajdan boshlang.',
      'Следующий пример открыт. Снова начинай со знаменателя.',
      'The next example is open. Start from the denominator again.',
    ) },
  ],
  C: function Screen9(props) {
    return (
      <SeqScreen
        {...props}
        id="s9"
        method={[
          L("Maxrajni nolga tenglashtiring", 'Приравняй знаменатель к нулю', 'Set the denominator to zero'),
          L('Tenglamani yeching', 'Реши уравнение', 'Solve the equation'),
          L("Topilgan qiymatni chiqarib tashlang", 'Найденное значение исключи', 'Exclude the value you found'),
        ]}
        head={{
          eyebrow: L('Mashq 1 · beshlik zanjir', 'Практика 1 · пять заданий по цепочке', 'Practice 1 · five linked tasks'),
          title: L('Taqiqlangan qiymatni', 'Найди', 'Find the'),
          em: L('toping', 'запрещённое значение', 'forbidden value'),
          lead: L(
            "Keyingi misol faqat to'g'ri javobdan keyin ochiladi.",
            'Следующий пример откроется только после верного ответа.',
            'The next example opens only after a correct answer.',
          ),
        }}
        helpNote={L(
          "Taqiq shunday topiladi: maxraj nolga tenglashtiriladi va tenglama yechiladi.",
          'Запрет ищут так: знаменатель приравнивают к нулю и решают уравнение.',
          'The restriction is found like this: set the denominator to zero and solve.',
        )}
        tasks={S9_TASKS}
      />
    )
  },
}

const ASK_TYPE = L('Ifoda turi', 'Тип выражения', 'Type of expression')
const TYPE_OPTIONS = [
  L('butun', 'целое', 'whole'),
  L('kasrli', 'дробное', 'fractional'),
]

const S10_TASKS = [
  {
    micro: ASK_TYPE,
    body: <span>4x {MINUS} 7</span>,
    options: TYPE_OPTIONS,
    correct: 0,
    ok: L("x li ifodaga bo'lish yo'q.", 'Деления на выражение с x нет.', 'There is no division by an expression with x.'),
    hints: [
      null,
      L(
        "Harf bor, lekin bo'lish faqat songa bajariladi.",
        'Буква есть, но делить приходится только на число.',
        'A letter is there, but division is only by a number.',
      ),
    ],
  },
  {
    micro: ASK_TYPE,
    body: <Frac num="5" den={<span>x {MINUS} 1</span>} />,
    options: TYPE_OPTIONS,
    correct: 1,
    ok: L("O'zgaruvchi maxrajda turadi.", 'Переменная стоит в знаменателе.', 'The variable stands in the denominator.'),
    hints: [
      L(
        "Chiziq ostida x turadi, ya'ni o'zgaruvchili ifodaga bo'linadi.",
        'Под чертой стоит x, значит делим на выражение с переменной.',
        'x is under the bar, so we divide by an expression with a variable.',
      ),
      null,
    ],
  },
  {
    micro: ASK_TYPE,
    body: <Frac num={<span>x + 2</span>} den="3" />,
    options: TYPE_OPTIONS,
    correct: 0,
    ok: L("Bo'luvchi o'zgarmas son, uchga teng.", 'Делитель постоянное число 3.', 'The divisor is the constant number 3.'),
    hints: [
      null,
      L(
        "Kasr chizig'i bor, lekin ostida son turadi, x emas.",
        'Дробная черта есть, но под ней число, а не x.',
        'There is a bar, but a number is under it, not x.',
      ),
    ],
  },
  {
    micro: ASK_TYPE,
    body: <span>7 {MINUS} <Frac num="2" den="x" /></span>,
    options: TYPE_OPTIONS,
    correct: 1,
    ok: L("x ga bo'lish bor.", 'Есть деление на переменную x.', 'There is division by the variable x.'),
    hints: [
      L(
        "Ikkinchi qo'shiluvchi x ga bo'linadi, shu yetarli.",
        'Второе слагаемое делит на x, этого достаточно.',
        'The second term divides by x, and that is enough.',
      ),
      null,
    ],
  },
  {
    micro: ASK_TYPE,
    body: <Frac num={<span>x² + 1</span>} den={<span>x + 4</span>} />,
    options: TYPE_OPTIONS,
    correct: 1,
    ok: L('Maxrajda x bor.', 'В знаменателе есть x.', 'There is x in the denominator.'),
    hints: [
      L(
        "Chiziq ostida x qo'shuv to'rt turadi, bu o'zgaruvchili ifoda.",
        'Под чертой стоит x плюс четыре, это выражение с переменной.',
        'Under the bar is x plus four, an expression with a variable.',
      ),
      null,
    ],
  },
]

const S10 = {
  gate: true,
  hint: L(
    "bo'luvchiga qarang, harf borligiga emas",
    'смотри на делитель, а не на наличие буквы',
    'look at the divisor, not at the letter',
  ),
  audio: [
    { on: 'mount', text: L(
      "Besh ifoda. Har birida bo'luvchiga qarang: unda o'zgaruvchi bormi.",
      'Пять выражений. В каждом смотри на делитель: есть в нём переменная или нет.',
      'Five expressions. In each one look at the divisor: does it contain a variable.',
    ) },
    { on: 'open', wait: true, text: L(
      "Keyingi ifoda. Yana bo'luvchidan boshlang.",
      'Следующее выражение. Снова начинай с делителя.',
      'The next expression. Start from the divisor again.',
    ) },
  ],
  C: function Screen10(props) {
    return (
      <SeqScreen
        {...props}
        id="s10"
        method={[
          L("Bo'luvchini toping", 'Найди делитель', 'Find the divisor'),
          L('Unda x bormi?', 'Есть ли в нём x?', 'Is there an x in it?'),
          L("x bor bo'lsa, ifoda kasrli", 'Если x есть, выражение дробное', 'If x is there, it is fractional'),
        ]}
        head={{
          eyebrow: L('Mashq 2 · beshlik zanjir', 'Практика 2 · пять заданий по цепочке', 'Practice 2 · five linked tasks'),
          title: L('Butun yoki', 'Целое или', 'Whole or'),
          em: L('kasrli?', 'дробное?', 'fractional?'),
          lead: L(
            "Ifodaning tuzilishiga qarang, shunchaki harf borligiga emas.",
            'Смотри на структуру выражения, а не просто на наличие буквы.',
            'Look at the structure of the expression, not just at the letter.',
          ),
        }}
        helpNote={L(
          "Bo'luvchiga qarang: chiziq ostida x bo'lsa, ifoda kasrli.",
          'Смотри на делитель: если под чертой есть x, выражение дробное.',
          'Look at the divisor: if x is under the bar, the expression is fractional.',
        )}
        tasks={S10_TASKS}
      />
    )
  },
}

const ASK_DEF = L('Aniqlanganmi?', 'Определено?', 'Is it defined?')
const YES_NO = [
  L('ha', 'да', 'yes'),
  L("yo'q", 'нет', 'no'),
]

const S11_TASKS = [
  {
    micro: ASK_DEF,
    body: <span>A(x) = <Frac num="3" den={<span>x {MINUS} 2</span>} /></span>,
    at: <span>x = 2</span>,
    options: YES_NO,
    correct: 1,
    ok: L('Maxraj nolga teng.', 'Знаменатель равен нулю.', 'The denominator equals zero.'),
    hints: [
      L(
        "Ikkini maxrajga qo'ying: nol chiqadi.",
        'Подставь два в знаменатель: получится ноль.',
        'Substitute two into the denominator: you get zero.',
      ),
      null,
    ],
  },
  {
    micro: ASK_DEF,
    body: <span>B(x) = <Frac num="x" den={<span>x + 1</span>} /></span>,
    at: <span>x = 0</span>,
    options: YES_NO,
    correct: 0,
    ok: L('Maxraj birga teng, qiymat nol.', 'Знаменатель равен одному, значение ноль.', 'The denominator equals one, the value is zero.'),
    hints: [
      null,
      L(
        'Suratdagi nol taqiqlanmagan, maxraj esa birga teng.',
        'Ноль в числителе не запрещён, а знаменатель равен одному.',
        'Zero in the numerator is allowed, and the denominator equals one.',
      ),
    ],
  },
  {
    micro: ASK_DEF,
    body: <span>C(x) = <Frac num={<span>x {MINUS} 5</span>} den={<span>x + 5</span>} /></span>,
    at: <span>x = 5</span>,
    options: YES_NO,
    correct: 0,
    ok: L(
      "Nol surat ruxsat etiladi, maxraj o'nga teng.",
      'Нулевой числитель разрешён, знаменатель равен десяти.',
      'A zero numerator is allowed, the denominator equals ten.',
    ),
    hints: [
      null,
      L('Nol yuqorida chiqdi, bu esa ruxsat etiladi.', 'Ноль оказался сверху, а это разрешено.', 'The zero landed on top, and that is allowed.'),
    ],
  },
  {
    micro: ASK_DEF,
    body: <span>D(x) = <Frac num="1" den={<span>x² {MINUS} 4</span>} /></span>,
    at: <span>x = {MINUS}2</span>,
    options: YES_NO,
    correct: 1,
    ok: L(
      "Minus ikkining kvadrati to'rt, maxraj nolga teng.",
      'Минус два в квадрате даёт четыре, знаменатель равен нулю.',
      'Minus two squared gives four, the denominator equals zero.',
    ),
    hints: [
      L(
        "Minus ikkini kvadratga ko'tarib, to'rtni ayiring.",
        'Возведи минус два в квадрат и вычти четыре.',
        'Square minus two and subtract four.',
      ),
      null,
    ],
  },
  {
    micro: ASK_DEF,
    body: <span>E(x) = <Frac num="2" den={<span>x² + 3</span>} /></span>,
    at: <span>x = 10</span>,
    options: YES_NO,
    correct: 0,
    ok: L('x² + 3 nolga aylanmaydi.', 'x² + 3 в ноль не обращается.', 'x² + 3 never becomes zero.'),
    hints: [
      null,
      L(
        "Yuz qo'shuv uch bu yuz uch, bo'lish mumkin.",
        'Сто плюс три это сто три, деление возможно.',
        'One hundred plus three is one hundred three, division is possible.',
      ),
    ],
  },
]

const S11 = {
  gate: true,
  hint: L(
    "sonni avval maxrajga qo'ying",
    'подставь число сначала в знаменатель',
    'substitute the number into the denominator first',
  ),
  audio: [
    { on: 'mount', text: L(
      "Besh formula va besh qiymat. Sonni avval maxrajga qo'ying.",
      'Пять формул и пять значений. Подставляй число сначала в знаменатель.',
      'Five formulas and five values. Substitute the number into the denominator first.',
    ) },
    { on: 'open', wait: true, text: L(
      'Keyingi formula. Maxrajni tekshiring.',
      'Следующая формула. Проверь знаменатель.',
      'The next formula. Check the denominator.',
    ) },
  ],
  C: function Screen11(props) {
    return (
      <SeqScreen
        {...props}
        id="s11"
        method={[
          L("Sonni MAXRAJGA qo'ying", 'Подставь число в ЗНАМЕНАТЕЛЬ', 'Substitute the number into the DENOMINATOR'),
          L('Nol chiqdimi?', 'Получился ноль?', 'Did zero come out?'),
          L("Nol bo'lsa, aniqlanmagan", 'Ноль значит не определено', 'Zero means undefined'),
        ]}
        head={{
          eyebrow: L('Mashq 3 · beshlik zanjir', 'Практика 3 · пять заданий по цепочке', 'Practice 3 · five linked tasks'),
          title: L('Formula', 'Формула', 'Is the formula'),
          em: L('aniqlanganmi?', 'определена?', 'defined?'),
          lead: L(
            "Sonni avval maxrajga qo'ying, bu eng tez tekshiruv.",
            'Подставь число сначала в знаменатель — это самый быстрый тест.',
            'Substitute the number into the denominator first, that is the fastest test.',
          ),
        }}
        helpNote={L(
          "Eng tez tekshiruv: sonni maxrajga qo'ying va nol chiqmasligini ko'ring.",
          'Самый быстрый тест: подставь число в знаменатель и посмотри, не вышел ли ноль.',
          'The fastest test: substitute into the denominator and see whether zero comes out.',
        )}
        tasks={S11_TASKS}
      />
    )
  },
}

const ASK_ERR = L('Xato qayerda?', 'Где ошибка?', 'Where is the mistake?')

const S12_TASKS = [
  {
    micro: ASK_ERR,
    body: <Claim text={L(
      "Surat nol bo'lsa, kasr taqiqlangan",
      'Если числитель 0, дробь запрещена',
      'If the numerator is 0, the fraction is forbidden',
    )} />,
    options: [
      L('yuqoridagi nol ruxsat etiladi', 'ноль сверху разрешён', 'zero on top is allowed'),
      L('nol har doim taqiqlangan', 'ноль запрещён всегда', 'zero is always forbidden'),
    ],
    correct: 0,
    ok: L(
      "Nolni noldan farqli songa bo'lish mumkin, natija nol.",
      'Ноль можно делить на ненулевое число, получится ноль.',
      'Zero may be divided by a non zero number, the result is zero.',
    ),
    hints: [
      null,
      L(
        "Taqiqni faqat maxrajdagi nol tug'diradi.",
        'Запрет создаёт только ноль в знаменателе.',
        'Only zero in the denominator creates a restriction.',
      ),
    ],
  },
  {
    micro: ASK_ERR,
    body: <Claim
      pre={L('Bu kasr uchun', 'Для дроби', 'For the fraction')}
      math={<Frac num="1" den={<span>x {MINUS} 5</span>} />}
      post={L('x = ' + MINUS + '5 taqiqlangan', 'запрещено x = ' + MINUS + '5', 'the value x = ' + MINUS + '5 is forbidden')}
    />,
    options: [
      L("xato yo'q", 'нет ошибки', 'no mistake'),
      L("x = 5 bo'lishi kerak", 'нужно x = 5', 'it should be x = 5'),
    ],
    correct: 1,
    ok: L(
      'x ' + MINUS + ' 5 = 0 dan x = 5 chiqadi.',
      'Решаем x ' + MINUS + ' 5 = 0 и получаем 5.',
      'Solving x ' + MINUS + ' 5 = 0 gives 5.',
    ),
    hints: [
      L(
        "Minus beshni qo'ying: maxraj minus o'n, qiymat bor.",
        'Подставь минус пять: знаменатель равен минус десяти, значение есть.',
        'Substitute minus five: the denominator is minus ten, the value exists.',
      ),
      null,
    ],
  },
  {
    micro: ASK_ERR,
    body: <Claim text={L(
      "ODZ surat bo'yicha topiladi",
      'ОДЗ ищут по числителю',
      'The domain is found from the numerator',
    )} />,
    options: [
      L("maxraj bo'yicha topiladi", 'нужно по знаменателю', 'it must come from the denominator'),
      L("hammasi to'g'ri", 'всё верно', 'everything is correct'),
    ],
    correct: 0,
    ok: L(
      "Taqiq nolga bo'lishdan tug'iladi, bo'lish esa maxrajga bajariladi.",
      'Запрет рождается из деления на ноль, а делят на знаменатель.',
      'The restriction comes from division by zero, and we divide by the denominator.',
    ),
    hints: [
      null,
      L(
        "Surat istalgan bo'lishi mumkin, nol ham.",
        'Числитель может быть любым, в том числе нулём.',
        'The numerator may be anything, even zero.',
      ),
    ],
  },
  {
    micro: ASK_ERR,
    body: <Claim text={L(
      'x² ' + MINUS + ' 4 = 0 ning bitta ildizi bor, 2',
      'x² ' + MINUS + ' 4 = 0 имеет один корень 2',
      'x² ' + MINUS + ' 4 = 0 has one root, 2',
    )} />,
    options: [
      L("ildiz yo'q", 'корней нет', 'there are no roots'),
      L(MINUS + '2 ham ildiz', 'есть ещё ' + MINUS + '2', 'there is also ' + MINUS + '2'),
    ],
    correct: 1,
    ok: L(
      "Ikki va minus ikkining kvadratlari to'rtga teng.",
      'Квадраты двух и минус двух равны четырём.',
      'The squares of two and minus two both equal four.',
    ),
    hints: [
      L(
        "Ikkining kvadrati ayirish to'rt nolga teng, demak ildiz bor.",
        'Два в квадрате минус четыре равно нулю, значит корень есть.',
        'Two squared minus four equals zero, so a root exists.',
      ),
      null,
    ],
  },
  {
    micro: ASK_ERR,
    body: <Claim
      pre={L('Bu kasr uchun', 'У дроби', 'For the fraction')}
      math={<Frac num="2" den={<span>x² + 1</span>} />}
      post={L('x = 1 taqiqlangan', 'запрещён x = 1', 'the value x = 1 is forbidden')}
    />,
    options: [
      L("taqiq yo'q", 'запретов нет', 'there are no restrictions'),
      L('x = ' + MINUS + '1 taqiqlangan', 'запрещён x = ' + MINUS + '1', 'x = ' + MINUS + '1 is forbidden'),
    ],
    correct: 0,
    ok: L(
      'x² + 1 birdan kichik emas, nolga aylanmaydi.',
      'x² + 1 не меньше одного, в ноль не обращается.',
      'x² + 1 is at least one, it never becomes zero.',
    ),
    hints: [
      null,
      L(
        "Minus birning kvadrati qo'shuv bir ikkiga teng.",
        'Минус один в квадрате плюс один равно двум.',
        'Minus one squared plus one equals two.',
      ),
    ],
  },
]

const S12 = {
  gate: true,
  hint: L(
    "har bir xato o'z izohini oladi",
    'каждая ошибка получает объяснение',
    'every mistake gets an explanation',
  ),
  audio: [
    { on: 'mount', text: L(
      "Besh mulohaza va har birida bitta xato. Uni son qo'yib tutish mumkin.",
      'Пять рассуждений, и в каждом одна ошибка. Её можно поймать подстановкой.',
      'Five arguments, each with one mistake. Substitution catches it.',
    ) },
    { on: 'open', wait: true, text: L(
      "Keyingi mulohaza. Qaysi joyi noto'g'ri?",
      'Следующее рассуждение. Где оно ломается?',
      'The next argument. Where does it break?',
    ) },
  ],
  C: function Screen12(props) {
    return (
      <SeqScreen
        {...props}
        id="s12"
        method={[
          L("Nol qayerda: suratda yoki maxrajda?", 'Где ноль: в числителе или в знаменателе?', 'Where is the zero: numerator or denominator?'),
          L("Son qo'yib tekshiring", 'Проверь подстановкой числа', 'Check by substituting a number'),
          L("Da'vo bilan solishtiring", 'Сравни с утверждением', 'Compare with the claim'),
        ]}
        head={{
          eyebrow: L('Mashq 4 · beshlik zanjir', 'Практика 4 · пять заданий по цепочке', 'Practice 4 · five linked tasks'),
          title: L('Mulohazadagi', 'Поймай', 'Catch the'),
          em: L('xatoni toping', 'ошибку в рассуждении', 'mistake in the argument'),
          lead: L(
            "Har bir to'g'ri tahlil keyingi kartochkani ochadi.",
            'Каждый верный разбор открывает следующую карточку.',
            'Every correct analysis opens the next card.',
          ),
        }}
        helpNote={L(
          "Mulohazani son qo'yib tekshiring: son xatoni darhol ko'rsatadi.",
          'Проверяй рассуждение подстановкой: число сразу показывает ошибку.',
          'Test the argument by substitution: a number shows the mistake at once.',
        )}
        tasks={S12_TASKS}
      />
    )
  },
}

// ============================================================
// 13-EKRAN. KO'CHIRISH: kerakli taqiqni beradigan maxrajni tanlash,
// keyin bonus fakt-karta.
// ============================================================
const S13 = {
  gate: true,
  hint: L(
    "fakt-karta to'g'ri javobdan keyin ochiladi",
    'факт-карта появится после правильного выбора',
    'the fact card appears after the correct choice',
  ),
  audio: [
    { on: 'mount', text: L(
      "Endi teskari yo'l. Taqiq berilgan, maxrajni o'zingiz tanlaysiz.",
      'Теперь обратный ход. Запрет дан, знаменатель выбираешь сам.',
      'Now the reverse move. The restriction is given, you choose the denominator.',
    ) },
    { on: 'no', wait: true, text: L(
      "Tanlagan maxrajingizni nolga tenglashtirib ko'ring va qanday qiymat chiqishini solishtiring.",
      'Приравняй выбранный знаменатель к нулю и сравни, какое значение получается.',
      'Set the chosen denominator to zero and compare which value comes out.',
    ) },
    { on: 'ok', wait: true, text: L(
      "x qo'shuv ikki nolga aylanadi, faqat x minus ikkiga teng bo'lganda. Aynan shu taqiq kerak edi.",
      'x плюс два обращается в ноль только при минус двух. Именно этот запрет и требовался.',
      'x plus two becomes zero only at minus two. That is exactly the restriction we needed.',
    ) },
    { on: 'fact', wait: true, text: L(
      "Bonus. Ikki formula soddalashtirgandan keyin bir xil ko'rinishi mumkin, lekin ularning mumkin bo'lgan qiymatlari boshqacha bo'lishi mumkin.",
      'Бонус. Две формулы после упрощения могут выглядеть одинаково, а допустимые значения у них разные.',
      'Bonus. Two formulas may look the same after simplifying, yet their allowed values differ.',
    ) },
  ],
  C: function Screen13({ active, audio, done, mark }) {
    const t = useT()
    const [picked, setPicked] = useState(null)
    const [wrongs, setWrongs] = useState([])
    const [fb, setFb] = useState(null)
    const [fact, setFact] = useState(false)
    const timer = useRef(null)
    useEffect(() => () => clearTimeout(timer.current), [])

    const steps = ['x + 2 = 0', 'x = ' + MINUS + '2', 'x ' + NE + ' ' + MINUS + '2']
    const shown = useStaged(steps.length, picked, 520)

    const items = [
      V('x ' + MINUS + ' 2'),
      V('x + 2'),
      V('2x'),
      V('x² + 2'),
    ]
    const hints = [
      L(
        'x ' + MINUS + ' 2 = 0 dan x = 2 chiqadi, bizga esa minus ikki kerak.',
        'x ' + MINUS + ' 2 = 0 даёт x = 2, а нужен минус два.',
        'x ' + MINUS + ' 2 = 0 gives x = 2, but we need minus two.',
      ),
      null,
      L('2x = 0 dan x = 0 chiqadi.', '2x = 0 даёт x = 0.', '2x = 0 gives x = 0.'),
      L(
        "x² + 2 hech qachon nolga teng bo'lmaydi, taqiq yo'q.",
        'x² + 2 никогда не равно нулю, запрета нет.',
        'x² + 2 is never zero, so there is no restriction.',
      ),
    ]

    const pick = (i) => {
      if (picked !== null) return
      if (i === 1) {
        setPicked(i)
        setFb({ kind: 'ok', text: L(
          "To'g'ri: x + 2 = 0 faqat x = " + MINUS + '2 da.',
          'Верно: x + 2 = 0 только при x = ' + MINUS + '2.',
          'Correct: x + 2 = 0 only at x = ' + MINUS + '2.',
        ) })
        mark('s13', wrongs.length === 0)
        done()
        if (active) audio.step('ok')
        timer.current = setTimeout(() => {
          setFact(true)
          if (active) audio.step('fact')
        }, 1600)
        return
      }
      setWrongs(wrongs.concat([i]))
      setFb({ kind: 'bad', text: hints[i] })
      if (active) audio.step('no')
    }

    return (
      <>
        <Head
          eyebrow={L("Bilimni ko'chirish · javobdan keyin bonus", 'Перенос знания · бонус после ответа', 'Transfer · a bonus after the answer')}
          title={L("Shartli kasrni yig'ing:", 'Собери дробь с условием', 'Build a fraction with')}
          em={L('x ' + NE + ' ' + MINUS + '2', 'x ' + NE + ' ' + MINUS + '2', 'x ' + NE + ' ' + MINUS + '2')}
          lead={L(
            "Fakt-karta faqat maxraj to'g'ri tanlangandan keyin ochiladi.",
            'Факт-карта появится только после правильного выбора знаменателя.',
            'The fact card appears only after the denominator is chosen correctly.',
          )}
        />
        <div className="g8l-body d13-transfer">
          <div className="g8l-card d13-build">
            <h3>
              {t(L(
                'Qaysi maxraj kerakli taqiqni beradi?',
                'Какой знаменатель создаст нужный запрет?',
                'Which denominator creates the required restriction?',
              ))}
            </h3>
            <div className="g8l-f is-big d13-formula">
              <Frac num={<span>x + 7</span>} den={<span className="d13-slot">{picked === null ? '?' : 'x + 2'}</span>} />
            </div>
            <Options items={items} picked={picked} wrongs={wrongs} onPick={pick} compact />
            <Feedback kind={fb ? fb.kind : 'plain'}>
              {fb ? t(fb.text) : t(L(
                "Har bir maxraj o'z taqiqini beradi.",
                'Каждый знаменатель создаёт свой запрет.',
                'Every denominator creates its own restriction.',
              ))}
            </Feedback>
            {picked !== null ? (
              <div className="d13-steps">
                {steps.map((s, i) => (
                  <span key={i} className={'d6-step' + (shown > i ? ' is-on' : '')}>{s}</span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={'d13-fact' + (fact ? ' is-on' : '')} aria-hidden={!fact}>
            <span className="d13-fact-i" aria-hidden="true">Ω</span>
            <span className="d13-fact-l">{t(L('FAKT-KARTA · BONUS', 'ФАКТ-КАРТА · БОНУС', 'FACT CARD · BONUS'))}</span>
            <h3>{t(L(
              'ODZ bu formulaning passporti',
              'ОДЗ это «паспорт» формулы',
              'The domain is the passport of a formula',
            ))}</h3>
            <p>{t(L(
              "Soddalashtirgandan keyin bir xil ko'rinadigan ikki formulaning mumkin bo'lgan qiymatlari boshqacha bo'lishi mumkin. Cheklovlar doim boshlang'ich yozuvdan olinadi.",
              'Две одинаково выглядящие после упрощения формулы могут иметь разные допустимые значения. Ограничения всегда сохраняют из исходной записи.',
              'Two formulas that look alike after simplifying may have different allowed values. Restrictions are always kept from the original record.',
            ))}</p>
          </div>
        </div>
      </>
    )
  },
}

// ============================================================
// 14-EKRAN. ARALASH BESHLIK. Baho haqida so'z YO'Q (maket sharti).
// ============================================================
const S14_TASKS = [
  {
    micro: L('Taqiqni toping', 'Найди запрет', 'Find the restriction'),
    body: <Frac num={<span>x + 4</span>} den={<span>x {MINUS} 7</span>} />,
    options: [
      V('x ' + NE + ' 7'),
      V('x ' + NE + ' ' + MINUS + '7'),
      L("taqiq yo'q", 'запретов нет', 'no restrictions'),
    ],
    correct: 0,
    ok: L('x ' + MINUS + ' 7 = 0 faqat x = 7 da.', 'x ' + MINUS + ' 7 = 0 при x = 7.', 'x ' + MINUS + ' 7 = 0 at x = 7.'),
    hints: [
      null,
      L(
        "Minus yetti maxrajni minus o'n to'rt qiladi.",
        'Минус семь даёт знаменатель минус четырнадцать.',
        'Minus seven makes the denominator minus fourteen.',
      ),
      L(
        'Chiziq ostida x bor, demak taqiq topiladi.',
        'Под чертой есть x, значит запрет обязательно найдётся.',
        'There is x under the bar, so a restriction must exist.',
      ),
    ],
  },
  {
    micro: L('Turini aniqlang', 'Определи тип', 'Determine the type'),
    body: <span>3x + 5</span>,
    options: [
      L('butun', 'целое', 'whole'),
      L('kasrli', 'дробное', 'fractional'),
      L("aniqlanmaydi", 'нельзя определить', 'cannot be determined'),
    ],
    correct: 0,
    ok: L("x li ifodaga bo'lish yo'q.", 'Деления на выражение с x нет.', 'There is no division by an expression with x.'),
    hints: [
      null,
      L(
        "O'zgaruvchili kasr chizig'i bu yerda yo'q.",
        'Дробной черты с переменной здесь нет.',
        'There is no fraction bar with a variable here.',
      ),
      L(
        "Tur bo'luvchidan ko'rinadi, u esa bu yerda yo'q.",
        'Тип виден по делителю, а его здесь нет.',
        'The type is seen from the divisor, and there is none here.',
      ),
    ],
  },
  {
    micro: L('Qiymatni toping', 'Найди значение', 'Find the value'),
    body: <Frac num={<span>x {MINUS} 2</span>} den={<span>x + 2</span>} />,
    at: <span>x = 2</span>,
    options: [
      V('0'),
      L('aniqlanmagan', 'не определено', 'undefined'),
      V('1'),
    ],
    correct: 0,
    ok: L(
      "Surat nol, maxraj to'rt, qiymat nolga teng.",
      'Числитель 0, знаменатель 4, значение равно нулю.',
      'The numerator is 0, the denominator is 4, the value is zero.',
    ),
    hints: [
      null,
      L('Nol yuqorida chiqdi, pastda emas.', 'Ноль оказался сверху, а не снизу.', 'The zero landed on top, not below.'),
      L(
        "Nolni to'rtga bo'lsak nol chiqadi, bir emas.",
        'Ноль разделить на четыре это ноль, а не один.',
        'Zero divided by four is zero, not one.',
      ),
    ],
  },
  {
    micro: L('ODZ ni tanlang', 'Выбери ОДЗ', 'Choose the domain'),
    body: <Frac num="1" den={<span>x² {MINUS} 16</span>} />,
    options: [
      V('x ' + NE + ' 4'),
      V('x ' + NE + ' ' + MINUS + '4'),
      V('x ' + NE + ' ' + MINUS + '4, x ' + NE + ' 4'),
    ],
    correct: 2,
    ok: L(
      "Maxrajning ikkita ildizi bor, ikkisi ham chiqariladi.",
      'У знаменателя два корня, оба исключаются.',
      'The denominator has two roots, both are excluded.',
    ),
    hints: [
      L("Minus to'rt ham o'n oltini beradi.", 'Минус четыре тоже даёт шестнадцать.', 'Minus four also gives sixteen.'),
      L("To'rt ham o'n oltini beradi.", 'Четыре тоже даёт шестнадцать.', 'Four also gives sixteen.'),
      null,
    ],
  },
  {
    micro: L('Asosiy shart', 'Главное условие', 'The main condition'),
    body: <Frac num="A(x)" den="B(x)" />,
    options: [
      V('A(x) ' + NE + ' 0'),
      V('B(x) ' + NE + ' 0'),
      V('A(x) = B(x)'),
    ],
    correct: 1,
    ok: L(
      "Nolga teng bo'lmasligi shart bo'lgan narsa maxraj.",
      'Ненулевым обязан быть знаменатель.',
      'It is the denominator that must be non zero.',
    ),
    hints: [
      L(
        "Surat nol bo'lishi mumkin, bu ruxsat etiladi.",
        'Числитель может быть нулём, это разрешено.',
        'The numerator may be zero, that is allowed.',
      ),
      null,
      L(
        "Surat va maxrajning tengligi hech narsani talab qilmaydi.",
        'Равенство числителя и знаменателя ничего не требует.',
        'Equality of numerator and denominator requires nothing.',
      ),
    ],
  },
]

const S14 = {
  gate: true,
  hint: L(
    'har bir javobdan keyin qisqa izoh chiqadi',
    'после каждого ответа появляется короткое объяснение',
    'a short explanation appears after every answer',
  ),
  audio: [
    { on: 'mount', text: L(
      "Oxirgi beshlik darsning hamma qismini bir joyga yig'adi. Har javobdan keyin qisqa izoh chiqadi.",
      'Последняя пятёрка собирает вместе все части урока. После каждого ответа будет короткое объяснение.',
      'The last five tasks bring together every part of the lesson. A short explanation follows each answer.',
    ) },
    { on: 'open', wait: true, text: L(
      'Keyingi topshiriq. Yana maxrajdan boshlang.',
      'Следующее задание. Снова начинай со знаменателя.',
      'The next task. Start from the denominator again.',
    ) },
  ],
  C: function Screen14(props) {
    return (
      <SeqScreen
        {...props}
        id="s14"
        method={[
          L('Maxrajga qarang', 'Смотри на знаменатель', 'Look at the denominator'),
          L('Nolga tenglashtiring', 'Приравняй к нулю', 'Set it to zero'),
          L('Ildizlarni chiqarib tashlang', 'Исключи корни', 'Exclude the roots'),
        ]}
        head={{
          eyebrow: L('Yakuniy aralash · darsning hamma bilimi', 'Финальный микс · все знания урока', 'Final mix · everything from the lesson'),
          title: L('Besh masala:', 'Пять задач:', 'Five tasks:'),
          em: L("tuzilish, ODZ, qo'yish", 'структура, ОДЗ, подстановка', 'structure, domain, substitution'),
          lead: L(
            "Har bir misol qoidani, formulani va qisqa izohni birlashtiradi.",
            'Каждый пример соединяет правило, формулу и короткое объяснение.',
            'Every example combines a rule, a formula and a short explanation.',
          ),
        }}
        helpNote={L(
          "Har bir savol bitta harakat bilan yechiladi: maxrajga qarang.",
          'Каждый вопрос решается одним движением: посмотри на знаменатель.',
          'Every question is solved by one move: look at the denominator.',
        )}
        tasks={S14_TASKS}
      />
    )
  },
}

// ============================================================
// 15-EKRAN. QISQA YAKUN. Qoralama YO'Q, uzun matn YO'Q.
// ============================================================
const SKILLS = [
  {
    t: L('Ikki turni farqlayman', 'Отличаю два типа выражений', 'I tell the two types apart'),
    s: L('butun va kasrli ratsional', 'целое и дробное рациональное', 'whole and fractional rational'),
  },
  {
    t: L('Maxrajni topaman', 'Нахожу знаменатель', 'I find the denominator'),
    s: L("kasr chizig'i ostiga qarayman", 'смотрю под дробную черту', 'I look under the fraction bar'),
  },
  {
    t: L('ODZ ni yozaman', 'Записываю ОДЗ', 'I write the domain'),
    s: L('B(x) ' + NE + ' 0', 'B(x) ' + NE + ' 0', 'B(x) ' + NE + ' 0'),
  },
  {
    t: L('Qiymatni tekshiraman', 'Проверяю значение', 'I check a value'),
    s: L("x ni maxrajga qo'yaman", 'подставляю x в знаменатель', 'I substitute x into the denominator'),
  },
]

const S15 = {
  gate: false,
  hint: L(
    'darsni yakunlash uchun tugmani bosing',
    'нажми кнопку, чтобы завершить урок',
    'tap the button to finish the lesson',
  ),
  audio: [
    { on: 'mount', text: L(
      "Ratsional kasr faqat maxraji nolga teng bo'lmagan joyda ma'noga ega.",
      'Рациональная дробь имеет смысл только там, где её знаменатель не равен нулю.',
      'A rational fraction makes sense only where its denominator is not zero.',
    ) },
  ],
  C: function Screen15({ hits }) {
    const t = useT()
    return (
      <>
        <Head
          eyebrow={L('Dars yakuni', 'Итог урока', 'Lesson summary')}
          title={L('Endi formula siz uchun', 'Теперь формула для тебя', 'Now the formula is')}
          em={L('shaffof', 'прозрачна', 'transparent to you')}
          lead={L(
            "Qisqa yakun yakuniy ovoz bilan bir vaqtda chiqadi.",
            'Короткий итог появляется синхронно с финальной озвучкой.',
            'The short summary appears together with the final voice line.',
          )}
        />
        {/* Metodist 2026-08-11: yakun VERTIKAL oqadi -- yuqorida tor sarlavha
            tasmasi, ostida to'rt natija, eng pastda ovoz satri. */}
        <div className="g8l-body d15-sum">
          <div className="g8l-card d15-hero">
            <span className="d15-seal" aria-hidden="true">x</span>
            <div className="d15-hero-t">
              <h2>{t(L('Ratsional ifodalar', 'Рациональные выражения', 'Rational expressions'))}</h2>
              <p>{t(L(
                "Siz kasrning tuzilishini ko'ryapsiz va u ma'noga ega bo'ladigan qiymatlarni topasiz.",
                'Ты видишь структуру дроби и находишь значения, при которых она имеет смысл.',
                'You see the structure of a fraction and find the values where it makes sense.',
              ))}</p>
            </div>
            <p className="d15-count">
              {t(L('Birinchi urinishda', 'С первой попытки', 'Right on the first try'))}
              {': '}{hits} / {SCORED}
            </p>
          </div>
          <div className="d15-skills">
            {SKILLS.map((s, i) => (
              <div key={i} className="g8l-card d15-skill">
                <span className="d15-check" aria-hidden="true">✓</span>
                <span>
                  <strong>{t(s.t)}</strong>
                  <small>{t(s.s)}</small>
                </span>
              </div>
            ))}
            <div className="d15-voice">
              <span className="d15-waves" aria-hidden="true"><i /><i /><i /></span>
              <span>
                <b>{t(L('Ovoz', 'Озвучка', 'Voice'))}:</b>{' '}
                {t(L(
                  "«Ratsional kasr faqat maxraji nolga teng bo'lmagan joyda ma'noga ega».",
                  '«Рациональная дробь имеет смысл только там, где её знаменатель не равен нулю».',
                  '«A rational fraction makes sense only where its denominator is not zero».',
                ))}
              </span>
            </div>
          </div>
        </div>
      </>
    )
  },
}

const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

// ============================================================
// DARS. Barcha ekranlar mount qilinadi, `is-active` almashadi:
// javoblar va ochilgan qadamlar orqaga yurganda ham saqlanadi.
// ============================================================
export default function Dars01v2({
  lang = 'ru',
  ttsApiBase = '',
  studentName = '',
  onFinished,
  onFinish,
}) {
  useMobileZoom()
  const [screen, setScreen] = useState(0)
  const [ready, setReady] = useState({})
  const [marks, setMarks] = useState({})
  const [finished, setFinished] = useState(false)

  useMemo(() => {
    configureLesson({ ttsApiBase, studentName, voiceGender: META.voice, lessonId: META.id, lessonTitle: META.topic })
  }, [ttsApiBase, studentName])

  const cur = SCREENS[screen]
  const audio = useAudio(cur.audio)

  const done = useCallback(() => {
    setReady((prev) => (prev[screen] ? prev : { ...prev, [screen]: true }))
  }, [screen])

  // Ball FAQAT birinchi urinishga beriladi (metodist qarori).
  const mark = useCallback((key, first) => {
    setMarks((prev) => (key in prev ? prev : { ...prev, [key]: !!first }))
  }, [])

  const hits = useMemo(
    () => Object.keys(marks).reduce((n, k) => n + (marks[k] ? 1 : 0), 0),
    [marks],
  )

  const finish = () => {
    setFinished(true)
    const payload = {
      lessonId: META.id,
      topic: tr(META.topic, lang),
      score: hits,
      total: SCORED,
      // Agregat: 60 foizdan kam bo'lsa dars o'zlashtirilmagan (metodik profil §1).
      passed: hits / SCORED >= 0.6,
      screens: SCREENS.length,
    }
    const cb = onFinished || onFinish
    if (cb) cb(payload)
    else console.log('[Dars01v2] onFinished', payload)
  }

  const isLast = screen === TOTAL - 1
  const gateOpen = !cur.gate || !!ready[screen]

  return (
    <LangProvider value={lang}>
      <style>{LAB_STYLES}{DARS_STYLES}</style>
      <div className="g8l-root">
        <div className="g8l-grain" aria-hidden="true" />
        <LabShell
          lessonLabel={META.lessonLabel}
          topic={META.topic}
          screen={screen}
          total={TOTAL}
          audio={audio}
          hint={finished ? LAB_UI.finish : cur.hint}
          nextReady={gateOpen && !finished}
          nextLabel={isLast ? LAB_UI.finish : LAB_UI.next}
          onPrev={() => setScreen((s) => Math.max(0, s - 1))}
          onNext={() => {
            if (isLast) { finish(); return }
            setScreen((s) => Math.min(TOTAL - 1, s + 1))
          }}
        >
          {SCREENS.map((s, i) => {
            const Body = s.C
            return (
              <div
                key={i}
                className={'g8l-screen' + (i === screen ? ' is-active' : '')}
                aria-hidden={i !== screen}
              >
                <Body
                  active={i === screen}
                  audio={audio}
                  done={done}
                  mark={mark}
                  hits={hits}
                />
              </div>
            )
          })}
        </LabShell>
      </div>
    </LangProvider>
  )
}

// ============================================================
// EKRANGA XOS RAZMETKA. Dizayn tizimi `labkit.jsx` da, bu yerda faqat
// shu darsning maketlari.
// ============================================================
const DARS_STYLES = `
.g8l-screen { display: none; }
.g8l-screen.is-active { display: flex; }

/* BOKS O'LCHAMI (metodist 2026-08-11: «боксы очень большие»).
   Sahna gridlarining qatori KONTENT bo'yicha o'lchanadi, ya'ni kartochkalar
   ekran balandligini to'ldirib cho'zilmaydi. Ichkarida bo'sh joy qolmaydi. */
.d1-hook, .d2-scan, .d3-sub, .d5-lab, .d6-q, .d8-rule, .d13-transfer {
  grid-template-rows: min-content;
  align-content: start;
}

/* ---- 1-ekran ---- */
.d1-hook { display: grid; grid-template-columns: 1.06fr .94fr; gap: clamp(9px, 1.3vw, 20px); }
.d1-machine {
  position: relative;
  overflow: clip;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, .8vh, 10px);
  padding: clamp(10px, 1.8vh, 22px);
}
/* Ikki klass ATAYLAB: pastdagi «.d1-machine > *» qoidasi bir xil salmoqda
   bo'lsa, halqalar oqimga tushib ketadi va kartochkani 340px cho'zadi. */
.d1-machine > .d1-rings { position: absolute; inset: 0; display: grid; place-items: center; }
.d1-rings i {
  height: 96%;
  aspect-ratio: 1;
  border: 1px dashed #BBB2A4;
  border-radius: 50%;
}
.d1-rings s {
  position: absolute;
  height: 70%;
  aspect-ratio: 1;
  border: 1px solid ${LT.tealSoft};
  border-radius: 50%;
}
.d1-machine > * { position: relative; z-index: 2; }
.d1-formula { margin-top: clamp(3px, .7vh, 9px); }
.d1-x { font-style: italic; color: ${LT.teal}; }
.d1-tok {
  display: inline-block;
  padding: 0 .1em;
  color: ${LT.teal};
  animation: d1-pop .42s cubic-bezier(.2,.8,.2,1);
}
.d1-tok.is-bad { color: ${LT.red}; }
@keyframes d1-pop { from { transform: scale(1.5); opacity: .3; } }
.d1-guide {
  margin-top: clamp(4px, .9vh, 12px);
  padding: 6px 12px;
  border-radius: 99px;
  background: ${LT.coralSoft};
  color: #A54530;
  font: 800 clamp(9px, .78vw, 11px) 'JetBrains Mono', monospace;
  letter-spacing: .06em;
}
.d1-guide.is-done { background: ${LT.tealSoft}; color: ${LT.teal}; animation: none; }
.d1-values { display: flex; gap: clamp(6px, .8vw, 12px); margin-top: clamp(4px, .9vh, 12px); }
.d1-val {
  width: clamp(40px, 4.2vw, 58px);
  height: clamp(40px, 4.2vw, 58px);
  border: 1px solid ${LT.line};
  border-radius: 16px;
  background: ${LT.paper};
  font: 700 clamp(15px, 1.6vw, 22px) 'JetBrains Mono', monospace;
  cursor: pointer;
  transition: transform .2s cubic-bezier(.2,.8,.2,1), background .2s, color .2s;
}
.d1-val:hover, .d1-val.is-on { background: ${LT.teal}; color: #fff; border-color: ${LT.teal}; transform: translateY(-4px); }
.d1-val.is-launch { animation: d1-launch .65s cubic-bezier(.2,.8,.2,1); }
@keyframes d1-launch { 45% { transform: translateY(-28px) scale(1.14); } 100% { transform: none; } }
.d1-side { display: flex; flex-direction: column; gap: clamp(7px, 1.1vh, 12px); min-height: 0; }
.d1-instr { display: flex; align-items: center; gap: 12px; padding: clamp(9px, 1.4vh, 17px) clamp(11px, 1vw, 19px); }
.d1-instr strong { display: block; font-size: clamp(12px, 1.05vw, 16px); }
.d1-instr span { font-size: clamp(10px, .85vw, 13px); color: ${LT.muted}; }
.d1-result {
  flex: 0 0 auto;
  min-height: clamp(120px, 22vh, 190px);
  display: grid;
  place-items: center;
  text-align: center;
  padding: clamp(10px, 1.8vh, 24px);
  border: 1px dashed #BBB2A4;
  border-radius: clamp(14px, 1.4vw, 22px);
  background: ${LT.paper};
}
.d1-result.is-bad { border-style: solid; border-color: ${LT.red}; background: ${LT.redSoft}; }
.d1-result.is-ok { border-style: solid; border-color: ${LT.green}; background: ${LT.greenSoft}; }
.d1-status { font: 800 clamp(9px, .78vw, 12px) 'JetBrains Mono', monospace; letter-spacing: .12em; color: ${LT.muted}; }
.d1-out {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(22px, 2.7vw, 42px);
  font-weight: 600;
  margin: clamp(4px, .8vh, 10px) 0;
}
.d1-result.is-bad .d1-out { color: ${LT.red}; }
.d1-result.is-ok .d1-out { color: ${LT.green}; }

/* ---- 2-ekran ---- */
.d2-scan { display: grid; grid-template-columns: clamp(220px, 24vw, 330px) 1fr; gap: clamp(9px, 1.2vw, 18px); }
.d2-list { padding: clamp(9px, 1.4vh, 16px); overflow: clip; }
.d2-view { padding: clamp(9px, 1.4vh, 18px); display: flex; flex-direction: column; gap: clamp(7px, 1.1vh, 13px); min-height: 0; }
.d2-grid { flex: 0 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(7px, 1.1vh, 13px); }
.d2-exp { min-height: clamp(64px, 11vh, 96px); }
.d2-exp {
  position: relative;
  border: 1px solid ${LT.line};
  border-radius: 16px;
  background: ${LT.paper};
  display: grid;
  place-items: center;
  min-height: 0;
  transition: border-color .3s, box-shadow .3s;
}
.d2-lab { position: absolute; top: 7px; left: 9px; font: 700 10px 'JetBrains Mono', monospace; color: ${LT.muted}; }
.d2-need {
  position: absolute;
  bottom: 7px;
  right: 9px;
  font: 700 9px 'JetBrains Mono', monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: ${LT.coral};
}
.d2-grid.is-bars .d2-exp.is-frac .g8l-frac-n { border-bottom-color: ${LT.coral}; border-bottom-width: 3px; }
.d2-grid.is-dens .d2-exp.is-frac .g8l-frac-d {
  background: ${LT.coralSoft};
  border-radius: 6px;
}
.d2-grid.is-dens .d2-exp.is-frac { border-color: ${LT.coral}; box-shadow: 0 0 0 2px rgba(231,102,71,.14); }
.d2-concl {
  padding: clamp(8px, 1.2vh, 13px) 15px;
  border-radius: 14px;
  background: ${LT.violetSoft};
  color: #4C3E80;
  font-weight: 800;
  font-size: clamp(10px, .9vw, 14px);
  line-height: 1.35;
}
.d2-wait {
  padding: clamp(8px, 1.2vh, 13px) 15px;
  border-radius: 14px;
  background: #EEE9E1;
  color: ${LT.muted};
  font-size: clamp(10px, .85vw, 13px);
  font-weight: 700;
}

/* ---- 3-ekran ---- */
.d3-sub { display: grid; grid-template-columns: clamp(210px, 24vw, 330px) 1fr; gap: clamp(9px, 1.2vw, 18px); }
.d3-panel { padding: clamp(10px, 1.6vh, 20px); display: flex; flex-direction: column; gap: clamp(8px, 1.2vh, 15px); }
.d3-h { font-family: 'Fraunces', Georgia, serif; font-size: clamp(14px, 1.4vw, 21px); font-weight: 600; }
.d3-chips { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(6px, .9vh, 10px); }
.d3-chip {
  height: clamp(44px, 5.6vh, 66px);
  border: 1px solid ${LT.line};
  border-radius: 16px;
  background: ${LT.paper};
  font: 700 clamp(15px, 1.6vw, 22px) 'JetBrains Mono', monospace;
  cursor: pointer;
  transition: background .2s, color .2s, transform .2s cubic-bezier(.2,.8,.2,1);
}
.d3-chip:hover { transform: translateY(-2px); border-color: ${LT.teal}; }
.d3-chip.is-on { background: ${LT.teal}; color: #fff; border-color: ${LT.teal}; }
.d3-box { padding: clamp(10px, 1.6vh, 20px); display: flex; flex-direction: column; justify-content: center; gap: clamp(4px, .8vh, 9px); }
.d3-formula { text-align: center; margin-bottom: clamp(2px, .5vh, 7px); }
.d3-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: clamp(38px, 6vh, 62px);
  opacity: .22;
  transform: translateX(14px);
  transition: opacity .5s, transform .5s;
}
.d3-row.is-on { opacity: 1; transform: none; }
.d3-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${LT.violetSoft};
  color: ${LT.violet};
  font: 700 11px 'JetBrains Mono', monospace;
  flex: 0 0 auto;
}
.d3-row strong { font: 700 clamp(14px, 1.5vw, 22px) 'JetBrains Mono', monospace; }
.d3-row small { display: block; color: ${LT.muted}; font-size: clamp(9px, .8vw, 12px); margin-top: 2px; }
.d3-final {
  padding: clamp(8px, 1.2vh, 13px) 15px;
  border-radius: 14px;
  font-weight: 800;
  font-size: clamp(10px, .9vw, 14px);
}
.d3-final.is-bad { background: ${LT.redSoft}; color: ${LT.red}; }
.d3-final.is-ok { background: ${LT.greenSoft}; color: ${LT.green}; }
/* Ikki majburiy tekshiruvning natijasi: yonma-yon, o'chib ketmaydi. */
.d3-cmp { display: flex; flex-direction: column; gap: 5px; margin-top: auto; }
.d3-cmp-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 12px;
  background: #EEE9E1;
  color: ${LT.muted};
  font-size: clamp(9px, .82vw, 12px);
  font-weight: 700;
  line-height: 1.3;
}
.d3-cmp-row.is-on { background: ${LT.greenSoft}; color: #215B40; }
.d3-cmp-row.is-on.is-bad { background: ${LT.redSoft}; color: #7C342F; }
.d3-cmp-n {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.7);
  font: 700 10px 'JetBrains Mono', monospace;
  flex: 0 0 auto;
}
.d3-take, .d4-take {
  flex-shrink: 0;
  padding: clamp(8px, 1.2vh, 13px) 14px;
  border-radius: 14px;
  background: ${LT.violetSoft};
  color: #4C3E80;
  font-weight: 800;
  font-size: clamp(10px, .88vw, 13px);
  line-height: 1.35;
}
.d3-chip.is-seen { border-color: ${LT.green}; }
.d3-hold {
  padding: clamp(8px, 1.2vh, 13px) 15px;
  border-radius: 14px;
  background: #EEE9E1;
  color: ${LT.muted};
  font-size: clamp(9px, .85vw, 13px);
  font-weight: 700;
}

/* ---- 4-ekran ---- */
/* Kartochkalar butun balandlikni EGALLAMAYDI: aks holda ichida katta bo'sh
   joy qoladi. Kartochkalar yuqorida, panel pastda.
   MARKAZLASHTIRISH ATAYLAB ishlatilmaydi: kartochka ochilganda panel o'sadi
   va markazlashgan ustun YUQORIGA chiqib, sarlavha ostiga kirib ketadi. */
.d4-wrap { justify-content: flex-start; }
.d4-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(8px, 1vw, 14px);
  flex: 0 0 auto;
  min-height: 0;
}
/* Kartochka balandligi cheklangan: ichida bo'sh maydon qolmaydi. */
.d4-card { min-height: clamp(120px, 21vh, 170px); }
.d4-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, .7vh, 8px);
  padding: clamp(10px, 1.5vh, 18px);
  text-align: left;
  cursor: pointer;
  transition: transform .24s cubic-bezier(.2,.8,.2,1), background .24s, border-color .24s;
}
.d4-card:hover, .d4-card.is-on { transform: translateY(-4px); border-color: ${LT.violet}; }
.d4-card.is-on { background: ${LT.violetSoft}; }
.d4-id { font: 700 10px 'JetBrains Mono', monospace; color: ${LT.violet}; }
.d4-t { font-family: 'Fraunces', Georgia, serif; font-size: clamp(13px, 1.3vw, 20px); font-weight: 600; line-height: 1.1; }
.d4-p { font-size: clamp(9px, .82vw, 13px); line-height: 1.35; color: ${LT.muted}; }
/* Misol kartochkaning BO'SH joyida markazda turadi: ekran katta bo'lganda
   kartochka ichida quruq oraliq qolmaydi. */
.d4-sample { margin: auto 0 0; align-self: center; font-size: clamp(16px, 1.9vw, 30px); }
.d4-seen { position: absolute; top: 10px; right: 12px; color: ${LT.green}; font-weight: 900; }
/* «Nimaga bo'linadi» -- kartochkaning ASOSIY fikri, shuning uchun misol ostida
   alohida satr bo'lib turadi. */
.d4-mark {
  align-self: center;
  margin-top: 4px;
  padding: 4px 9px;
  border-radius: 99px;
  background: ${LT.coralSoft};
  color: #A54530;
  font: 800 clamp(8px, .72vw, 11px) 'Manrope', sans-serif;
  letter-spacing: .02em;
  text-align: center;
}
.d4-panel {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: clamp(110px, 13vw, 175px) 1fr;
  gap: clamp(10px, 1.4vw, 20px);
  align-items: center;
  padding: clamp(9px, 1.4vh, 16px) clamp(11px, 1.2vw, 19px);
}
.d4-badge {
  background: ${LT.violet};
  color: #fff;
  border-radius: 16px;
  padding: clamp(10px, 1.5vh, 18px) 8px;
  text-align: center;
  font: 700 clamp(10px, .9vw, 14px) 'JetBrains Mono', monospace;
  line-height: 1.25;
}
.d4-text h3 { font-size: clamp(12px, 1.1vw, 17px); margin-bottom: 4px; }
.d4-text p { font-size: clamp(9px, .85vw, 13px); line-height: 1.4; color: ${LT.muted}; }
.d4-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 7px; }
.d4-fact {
  padding: 7px 10px;
  border-radius: 10px;
  background: rgba(255,255,255,.68);
  font-size: clamp(8px, .74vw, 11px);
  line-height: 1.3;
  color: #514674;
}
.d4-fact b { display: block; color: ${LT.violet}; margin-bottom: 2px; }

/* ---- 5-ekran ---- */
.d5-lab { flex: 0 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(9px, 1.2vw, 18px); }
.d5-card { padding: clamp(10px, 1.6vh, 20px); display: flex; flex-direction: column; justify-content: space-between; gap: clamp(7px, 1vh, 12px); }
.d5-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.d5-head h3 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(13px, 1.3vw, 21px); font-weight: 600; }
/* Qoida .g8l-root button (color: inherit) salmog'i 0,1,1 -- bitta klassli
   qoidadan kuchli, shu sababli matn qora fonda qora bo'lib ko'rinmay qolgan
   edi. Ikki klass bilan yozamiz. Rang: HARAKAT firuzasi (qora rang
   navigatsiya uchun band). */
.d5-card .d5-btn {
  border: 0;
  border-radius: 13px;
  background: ${LT.teal};
  color: #FFFFFF;
  padding: clamp(7px, 1.1vh, 11px) clamp(9px, 1vw, 15px);
  font-weight: 800;
  font-size: clamp(10px, .85vw, 13px);
  cursor: pointer;
  flex-shrink: 0;
}
/* Qulflangan tugmani SHAFFOF qilish mumkin emas: oq matn kulrang fonda
   yo'qoladi. Shuning uchun alohida rang juftligi. */
.d5-card .d5-btn:disabled { background: #E7E1D7; color: #6E7679; cursor: not-allowed; }
.d5-card .d5-btn.is-done:disabled { background: ${LT.greenSoft}; color: ${LT.green}; }
.d5-card .d5-btn:not(:disabled):hover { background: #10645F; }
.d5-formula { text-align: center; }
.d5-res {
  min-height: clamp(52px, 8vh, 78px);
  border-radius: 15px;
  background: #ECE7DE;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 10px;
  color: ${LT.muted};
  font-size: clamp(9px, .85vw, 13px);
  font-weight: 700;
}
.d5-res strong { display: block; font: 700 clamp(14px, 1.5vw, 22px) 'JetBrains Mono', monospace; margin-bottom: 3px; }
.d5-res.is-ok { background: ${LT.greenSoft}; color: ${LT.green}; }
.d5-res.is-bad { background: ${LT.redSoft}; color: ${LT.red}; }
.d5-track {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(7px, 1vh, 11px) 13px;
  border: 1px dashed #BEB4A7;
  border-radius: 14px;
  color: ${LT.muted};
  font-size: clamp(9px, .85vw, 13px);
  font-weight: 700;
  line-height: 1.35;
}
.d5-track.is-final { border-style: solid; border-color: ${LT.teal}; color: #385556; background: rgba(221,237,234,.5); }
.d5-track-n {
  width: 26px;
  height: 26px;
  border-radius: 9px;
  background: ${LT.teal};
  color: #fff;
  display: grid;
  place-items: center;
  font: 700 10px 'JetBrains Mono', monospace;
  flex: 0 0 auto;
}

/* ---- 6 va 7-ekranlar ---- */
.d6-q { display: grid; grid-template-columns: .82fr 1.18fr; gap: clamp(9px, 1.2vw, 18px); }
.d6-fig {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 1vh, 14px);
  padding: clamp(10px, 1.6vh, 22px);
  text-align: center;
}
.d6-hero { margin-top: clamp(3px, .8vh, 10px); }
.d6-note { font-size: clamp(9px, .82vw, 13px); color: ${LT.muted}; line-height: 1.4; }
.d6-ans { padding: clamp(10px, 1.5vh, 17px); display: flex; flex-direction: column; gap: clamp(6px, .9vh, 10px); justify-content: center; }
.d6-ask { font-size: clamp(11px, 1vw, 16px); font-weight: 800; }
.d6-sol {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  padding: clamp(8px, 1.1vh, 12px) 12px;
  border: 1px solid #BFD8C9;
  background: ${LT.greenSoft};
  border-radius: 14px;
}
.d6-step {
  font: 700 clamp(10px, .95vw, 15px) 'JetBrains Mono', monospace;
  padding: 4px 9px;
  border-radius: 9px;
  background: rgba(255,255,255,.7);
  color: #215B40;
  opacity: 0;
  transform: translateX(7px);
  transition: opacity .4s, transform .4s;
}
.d6-step.is-on { opacity: 1; transform: none; }
.d6-locked {
  padding: clamp(8px, 1.1vh, 12px) 12px;
  border-radius: 14px;
  background: #EEE9E1;
  color: ${LT.muted};
  font-size: clamp(9px, .85vw, 13px);
  font-weight: 700;
}
.d6-second { margin-top: clamp(6px, 1.4vh, 20px); }

/* ---- 8-ekran ---- */
.d8-rule { display: grid; grid-template-columns: clamp(260px, 31vw, 420px) 1fr; gap: clamp(9px, 1.2vw, 18px); }
.d8-list { display: flex; flex-direction: column; justify-content: center; }
.d8-apply { padding: clamp(10px, 1.6vh, 20px); display: flex; flex-direction: column; justify-content: center; gap: clamp(8px, 1.2vh, 14px); }
.d8-apply h3 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(13px, 1.35vw, 21px); font-weight: 600; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.d8-chain { display: flex; flex-direction: column; gap: clamp(5px, .9vh, 9px); }
.d8-line {
  padding: clamp(8px, 1.2vh, 12px) 13px;
  background: #EEE9E1;
  border-radius: 12px;
  opacity: .24;
  transform: translateX(11px);
  transition: opacity .4s, transform .4s, background .4s;
}
.d8-line.is-on { opacity: 1; transform: none; }
.d8-line.is-last.is-on { background: ${LT.coralSoft}; color: #A2422F; }

/* ---- 12-ekran ---- */
.d12-claim {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(11px, 1.05vw, 17px);
  font-weight: 800;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}
.d12-claim-m { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 1.5vw, 24px); letter-spacing: -.03em; }

/* ---- 13-ekran ---- */
.d13-transfer { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(9px, 1.2vw, 18px); }
.d13-build { padding: clamp(10px, 1.6vh, 20px); display: flex; flex-direction: column; gap: clamp(6px, 1vh, 12px); }
.d13-build h3 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(13px, 1.3vw, 20px); font-weight: 600; }
.d13-formula { text-align: center; margin: clamp(4px, 1vh, 14px) 0; }
.d13-slot { color: ${LT.teal}; }
.d13-steps { display: flex; gap: 7px; flex-wrap: wrap; }
.d13-fact {
  padding: clamp(12px, 1.9vh, 23px);
  border-radius: clamp(14px, 1.4vw, 22px);
  background: ${LT.violet};
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(5px, .9vh, 11px);
  opacity: .14;
  transform: scale(.965) rotate(1deg);
  transition: opacity .6s, transform .6s;
}
.d13-fact.is-on { opacity: 1; transform: none; }
.d13-fact-i {
  width: clamp(38px, 4vw, 56px);
  height: clamp(38px, 4vw, 56px);
  border-radius: 18px;
  background: #8372BF;
  display: grid;
  place-items: center;
  font: 700 clamp(18px, 2vw, 27px) 'JetBrains Mono', monospace;
}
.d13-fact-l { font: 700 10px 'JetBrains Mono', monospace; letter-spacing: .15em; color: #CEC5F1; }
.d13-fact h3 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(15px, 1.8vw, 27px); font-weight: 600; line-height: 1.1; }
.d13-fact p { font-size: clamp(9px, .9vw, 14px); line-height: 1.5; color: #EEEAFB; }

/* ---- 15-ekran: VERTIKAL oqim ---- */
.d15-sum { display: flex; flex-direction: column; justify-content: center; gap: clamp(8px, 1.2vh, 14px); }
.d15-hero {
  position: relative;
  overflow: clip;
  flex: 0 0 auto;
  padding: clamp(11px, 1.7vh, 20px) clamp(13px, 1.5vw, 24px);
  background: ${LT.ink};
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(11px, 1.4vw, 22px);
}
.d15-hero-t { min-width: 0; flex: 1; }
.d15-hero:after {
  content: "B(x) ≠ 0";
  position: absolute;
  right: 16px;
  bottom: -14px;
  font: 700 clamp(26px, 3.4vw, 46px) 'JetBrains Mono', monospace;
  color: rgba(255,255,255,.06);
  transform: rotate(-4deg);
  pointer-events: none;
}
.d15-seal {
  width: clamp(42px, 4.6vw, 66px);
  height: clamp(42px, 4.6vw, 66px);
  border: 1px solid #546163;
  border-radius: 20px;
  display: grid;
  place-items: center;
  font: 700 clamp(16px, 1.8vw, 24px) 'JetBrains Mono', monospace;
  color: #72D1C9;
  font-style: italic;
}
.d15-hero h2 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(16px, 2vw, 28px); font-weight: 600; }
.d15-hero p { font-size: clamp(9px, .9vw, 14px); color: #B8C2C3; line-height: 1.45; margin-top: 3px; }
.d15-count {
  flex: 0 0 auto;
  align-self: center;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(114,209,201,.12);
  font: 700 clamp(9px, .85vw, 13px) 'JetBrains Mono', monospace;
  color: #72D1C9;
  letter-spacing: .04em;
  white-space: nowrap;
}
.d15-skills { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(7px, 1vh, 11px); align-content: start; flex: 0 0 auto; }
.d15-skill { display: flex; gap: 11px; align-items: center; padding: clamp(9px, 1.4vh, 16px); }
.d15-check {
  width: clamp(28px, 3vw, 38px);
  height: clamp(28px, 3vw, 38px);
  border-radius: 12px;
  background: ${LT.greenSoft};
  color: ${LT.green};
  display: grid;
  place-items: center;
  font-weight: 900;
  flex: 0 0 auto;
}
.d15-skill strong { display: block; font-size: clamp(10px, .92vw, 14px); }
.d15-skill small { display: block; font-size: clamp(8px, .74vw, 11px); color: ${LT.muted}; margin-top: 2px; }
.d15-voice {
  grid-column: 1 / -1;
  border: 1px dashed #B9B0A3;
  border-radius: 15px;
  padding: clamp(8px, 1.2vh, 13px) 14px;
  display: flex;
  gap: 11px;
  align-items: center;
  color: ${LT.muted};
  font-size: clamp(9px, .85vw, 13px);
  line-height: 1.4;
}
.d15-voice b { color: ${LT.teal}; }
.d15-waves { display: flex; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.d15-waves i { width: 3px; background: ${LT.teal}; border-radius: 2px; }
.d15-waves i:nth-child(1) { height: 8px; }
.d15-waves i:nth-child(2) { height: 16px; }
.d15-waves i:nth-child(3) { height: 11px; }

/* Izoh maydonlarining balandligi: joy OLDINDAN band qilinadi, shuning uchun
   javob berilganda ekran sakramaydi. Inline style EMAS -- past telefonda
   media-so'rov bilan kichraytirish kerak. */
.d6-ans .g8l-fb { min-height: clamp(40px, 7vh, 56px); }
.g8l-seq-answer .g8l-fb { min-height: clamp(58px, 12vh, 96px); }
.d13-build .g8l-fb { min-height: clamp(36px, 6.5vh, 48px); }

/* ---- Desktop: maket sharti «katta shrift, kam matn». 768px balandlikda
   joy bor, shuning uchun matematika va variantlar kattaroq teriladi.
   Mobilga tegmaydi: u yerda balandlik tanqis. ---- */
@media (min-width: 900px) {
  .g8l-seq-formula { font-size: clamp(22px, 2.4vw, 38px); }
  .g8l-seq-micro { font-size: clamp(11px, .95vw, 14px); }
  .g8l-opt { font-size: clamp(12px, 1.05vw, 16px); }
  .g8l-opts.is-compact .g8l-opt { padding: 13px 14px; }
  .g8l-fb { font-size: clamp(11px, .95vw, 14px); }
  .g8l-seq-tab { padding: clamp(9px, 1.4vh, 14px) 4px; }
  .d1-machine { gap: clamp(6px, 1.6vh, 18px); }
  .d1-machine { min-height: clamp(210px, 34vh, 300px); }
  .d6-fig .g8l-f.is-big { font-size: clamp(22px, 2.3vw, 36px); }
  .d13-build { justify-content: center; }
  .d13-formula { font-size: clamp(24px, 2.6vw, 42px); }
  .d13-steps { margin-top: 4px; }
  .d15-skill { padding: clamp(13px, 2.4vh, 26px); }
}

/* ---- Mobil: barcha ikki ustunli maketlar bitta ustunga ---- */
@media (max-width: 700px) {
  .d1-hook, .d2-scan, .d3-sub, .d5-lab, .d6-q, .d8-rule, .d13-transfer, .d15-sum,
  .g8l-seq-card {
    grid-template-columns: 1fr;
  }
  /* Telefonda uch kartochka bitta ustunda turadi: ular ZICH satrga aylanadi,
     to'liq tavsif esa pastdagi panelda ochiladi. */
  .d4-grid { grid-template-columns: 1fr; gap: 5px; }
  .d4-panel { padding: 7px 9px; gap: 8px; }
  .d4-facts { gap: 5px; margin-top: 5px; }
  .d4-fact { padding: 5px 7px; }
  .d4-mark { margin-top: 2px; padding: 3px 7px; }
  /* Zanjir kartochkasi ham zichlashadi: kontent balandligi bo'yicha o'lchanadi,
     shuning uchun har piksel ko'rinadi. */
  .g8l-seq-card { padding: 8px; gap: 8px; }
  .g8l-seq-problem { padding: 7px; gap: 6px; }
  .g8l-seq-formula { font-size: 15px; }
  .g8l-seq-at { margin-top: 3px; font-size: 12px; }
  .d4-card { min-height: 0; padding: 7px 10px; gap: 1px; }
  .d4-t { line-height: 1.05; }
  .d4-take { padding: 5px 8px; }
  .d4-t { font-size: 13px; }
  .d4-p { display: none; }
  .d4-sample { align-self: flex-start; margin: 2px 0 0; font-size: 13px; }
  .d4-panel { grid-template-columns: 1fr; }
  .d4-badge { padding: 7px; font-size: 10px; }
  .d15-skills { grid-template-columns: 1fr; }
  .g8l-opts { grid-template-columns: 1fr !important; gap: 5px; }
  .d2-grid { grid-template-columns: 1fr 1fr; }
  /* 390px da balandlik tanqisligi: 6, 7 va 13-ekranlar javobdan keyin
     o'sadi, shuning uchun aynan o'sadigan bloklar zichlashtiriladi. */
  .d6-fig { padding: 8px; gap: 5px; }
  .d6-fig .g8l-f.is-big { font-size: 17px; }
  .d6-second { margin-top: 5px; }
  .d6-sol { padding: 7px 9px; gap: 5px; }
  .d6-step { font-size: 11px; padding: 3px 7px; }
  /* 8-ekran: uchinchi qoida ochilganda ustun o'sadi. Izoh matni kichrayadi,
     metodik sharh (caption) telefonda yashiriladi. */
  /* 4-ekran past telefonda: kartochka bir satrga yig'iladi, panel zichlashadi. */
  .d4-card { padding: 5px 8px; }
  .d4-t { font-size: 11.5px; }
  .d4-sample { font-size: 12px; }
  .d4-mark { font-size: 8px; padding: 2px 6px; }
  .d4-panel { padding: 6px 8px; }
  .d4-text h3 { font-size: 11px; }
  .d4-badge { padding: 5px; font-size: 9px; }
  .d3-h { font-size: 11.5px; }
  .d3-chip { height: 32px; font-size: 14px; }
  .d3-panel { padding: 8px; gap: 6px; }
  .d3-box { padding: 8px; gap: 3px; }
  .d3-formula { font-size: 16px; }
  .d3-cmp-row { padding: 4px 7px; font-size: 8.5px; }
  .d3-take, .d4-take { padding: 6px 9px; font-size: 9px; }
  .d3-row { min-height: 34px; }
  .d8-apply { padding: 9px; gap: 6px; }
  .d8-apply h3 { font-size: 12px; }
  .d8-apply .g8l-caption { display: none; }
  .d8-line { padding: 7px 10px; }
  .g8l-lock-b { font-size: 10px; margin-left: 34px; }
  .d13-build { padding: 8px; gap: 4px; }
  .d13-fact { padding: 8px; }
  .d13-steps .d6-step { font-size: 10px; padding: 2px 6px; }
  .d13-build h3 { font-size: 12px; }
  .d13-formula { margin: 2px 0; }
  .d13-fact { padding: 10px; gap: 4px; }
  .d13-fact-i { width: 30px; height: 30px; font-size: 16px; border-radius: 12px; }
  .d13-fact h3 { font-size: 15px; }
  .d13-fact p { font-size: 10px; line-height: 1.35; }
}
`
