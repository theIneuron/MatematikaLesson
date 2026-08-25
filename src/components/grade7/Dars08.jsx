// ============================================================================
// 7-sinf, Dars 8. BIR NOMA'LUMLI CHIZIQLI TENGLAMA.
// (Линейное уравнение с одной переменной)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// BLOKNING ASBOBI: `EquationBalance` -- «tenglama va yechimlar to'plami»
// (etalon §2, 2-asbob). Uning bosh xossasi: «faqat chap tomonga» degan
// tugma YO'Q, amal IKKALA tomonga birdan qo'llanadi. Shu sababli o'quvchi
// tenglikni buza olmaydi -- u faqat qulay yoki noqulay amal tanlaydi.
//
// 7-DARS BILAN BOG'LANISH. U yerda ildizni TANLAB topardik: sonni qo'yib,
// ikkala tomonni solishtirardik. Bu yerda ildiz HISOBLANADI: tenglamani
// bosqichma-bosqich soddalashtiramiz, va oxirgi qatorda x ning o'zi qoladi.
//
// UCH HOLAT (§1.5, §1.6). Chiziqli tenglama uch xil bo'ladi: bitta ildiz,
// ildizi yo'q, cheksiz ko'p ildiz. Ular SO'Z bilan emas, `SolutionSet`
// tablichkasi bilan farqlanadi, va tablichka butun dars bo'ylab turadi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Btn,
  DoneRow,
  Fx,
  HackNote,
  Hint,
  L,
  LangProvider,
  LangSetProvider,
  STYLES,
  Stage,
  Tag,
  Title,
  configureLesson,
  getFreeNav,
  tr,
  useAdvanceGate,
  useAudio,
  useInstructionGate,
  useMobileZoom,
  useT,
} from './core.jsx'
import {
  AuditRows,
  EquationBalance,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  SolutionSet,
  StairsReveal,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_08'
const LESSON_TITLE = L("Bir noma'lumli chiziqli tenglama", 'Линейное уравнение с одной переменной', 'A linear equation in one unknown')
const LESSON_NO = L('8-dars', 'Урок 8', 'Lesson 8')
const TOTAL = 15

const BLOCK = { label: L('B2-blok', 'Блок Б2', 'Block B2'), from: 7, to: 12, current: 8 }

const A = (on, uz, ru, en) => ({ on, text: L(uz, ru, en) })

const buildSegments = (list, lang) =>
  list.map((s, i) => ({
    id: 'a' + i,
    text: tr(s.text, lang),
    trigger: s.on === 'mount' ? (i === 0 ? 'on_mount' : 'after_previous') : 'on_event:' + s.on,
    waits_for: null,
  }))

const UI = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
}

const TAGS = {
  Z1: L('amal faqat bitta tomonga qo\'llandi', 'действие применили к одной части', 'the operation was applied to one side only'),
  Z2: L('noqulay amal tanlandi', 'выбрано неудобное действие', 'an unhelpful operation was chosen'),
  Z3: L("ildiz tekshirilmadi", 'корень не проверен', 'the root was not checked'),
  Z4: L("ildizi yo'q holat tushunilmadi", 'случай без корней не понят', 'the no-root case was misread'),
  Z5: L('cheksiz ko\'p ildiz holati tushunilmadi', 'случай с бесконечным числом корней не понят', 'the every-number case was misread'),
  Z6: L('amallar tartibi buzildi', 'нарушен порядок действий', 'the order of operations broke'),
}

const uniqueTags = (answers) => {
  const out = []
  ;(answers || []).forEach((a) => {
    ;((a && a.tags) || []).forEach((tag) => {
      if (TAGS[tag] && out.indexOf(tag) === -1) out.push(tag)
    })
  })
  return out
}

const SET_CAP = L("Nechta son to'g'ri qiladi", 'Сколько чисел делают верным', 'How many numbers make it true')

const levelOf = (firstTry, total) => {
  if (firstTry === null || firstTry === undefined) return 'none'
  if (firstTry >= total) return 'closed'
  if (firstTry === total - 1) return 'one'
  return 'back'
}

function Frame({ meta, screen, audio, solved, onPrev, onNext, onFinish, finished, children }) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const nav = {
    back: meta.noBack ? null : (
      <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>{t(UI.back)}</Btn>
    ),
    next: last ? (
      <Btn tone="accent" onClick={onFinish} disabled={finished}>
        {finished ? t(UI.saved) : t(UI.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={canNext}>{t(UI.next)}</Btn>
    ),
  }
  return (
    <Stage
      eyebrow={t(meta.eyebrow)}
      block={{ ...BLOCK, label: t(BLOCK.label) }}
      screen={screen}
      total={TOTAL}
      audio={audio}
      nav={nav}
      field={meta.field}
      noNotes={meta.noNotes}
    >
      {meta.method ? <Tag tone="accent">{t(meta.method)}</Tag> : null}
      {meta.ownTitle ? null : <Title>{t(meta.title)}</Title>}
      {children}
      {meta.reward && solved ? (
        <HackNote tone="ok" bottom title={t(meta.reward.title)}>{t(meta.reward.text)}</HackNote>
      ) : null}
      {meta.hack && solved ? <HackNote bottom>{t(meta.hack)}</HackNote> : null}
      {meta.bonus && solved ? (
        <HackNote bottom title={t(meta.bonus.title)}>{t(meta.bonus.text)}</HackNote>
      ) : null}
    </Stage>
  )
}

// ============================================================
// EKRAN 1. XUK. Ikkalasi ham to'rtni ayirdi, javob esa boshqa chiqdi.
// Farq shunda: biri FAQAT CHAPDAN ayirdi. Sahna kim to'g'ri ekanini
// aytmaydi (§8.1), u faqat ikki natijani yonma-yon qo'yadi.
// ============================================================
const S1 = {
  eyebrow: L("CHIZIQLI TENGLAMA", 'ЛИНЕЙНОЕ УРАВНЕНИЕ', 'A LINEAR EQUATION'),
  noBack: true,
  noNotes: true,
  title: L("Ikkalasi ham to'rtni ayirdi", 'Оба вычли четвёрку', 'Both took away a four'),
  gate: {
    source: { kind: 'plain', tokens: ['x', '+', '4', '=', '9'] },
    rows: [
      { tokens: ['x', '=', '9'], value: '13' },
      { tokens: ['x', '=', '5'], value: '9' },
    ],
  },
  probe: {
    question: L(
      "Ikkala o'quvchi ham to'rtni ayirdi, lekin javob boshqa chiqdi. Nega?",
      'Оба ученика вычли четвёрку, а ответы вышли разные. Почему?',
      'Both students took away a four, yet the answers came out different. Why?',
    ),
    items: [
      {
        id: 'both',
        label: L(
          "Biri faqat chap tomondan ayirdi, ikkinchisi ikkala tomondan",
          'Один вычел только слева, другой из обеих частей',
          'One took it from the left only, the other from both sides',
        ),
        hint: L(
          "Taxminingiz qabul qilindi. Uni tarozida o'z qo'lingiz bilan tekshiramiz.",
          'Прогноз принят. Проверим его на весах своими руками.',
          'Your prediction is taken. We will check it on the balance by hand.',
        ),
      },
      {
        id: 'order',
        label: L("Biri boshqa tartibda hisobladi", 'Один считал в другом порядке', 'One counted in a different order'),
        hint: L(
          "Bu yerda bitta amal bor, tartib tanlashga o'rin yo'q. Gap amal QAYERGA qo'llanganida.",
          'Здесь всего одно действие, порядок выбирать негде. Дело в том, КУДА его применили.',
          'There is only one operation here, no order to choose. It is about WHERE it was applied.',
        ),
      },
      {
        id: 'both_ok',
        label: L("Ikkalasi ham to'g'ri", 'Оба верны', 'Both are right'),
        hint: L(
          "Ikkala javobni ham tekshiring: to'qqiz qo'shuv to'rt bu o'n uch, besh qo'shuv to'rt esa to'qqiz. Faqat bittasi to'g'ri.",
          'Проверь оба ответа: девять плюс четыре это тринадцать, а пять плюс четыре это девять. Верен только один.',
          'Check both answers: nine plus four is thirteen, five plus four is nine. Only one is right.',
        ),
      },
      {
        id: 'noroot',
        label: L("Bunday tenglamaning ildizi bitta emas", 'У такого уравнения не один корень', 'Such an equation has more than one root'),
        hint: L(
          "Tekshirib ko'ring: faqat bitta son to'qqizni beradi. Ikkinchisi o'n uchni beradi, bu esa boshqa son.",
          'Проверь: только одно число даёт девять. Второе даёт тринадцать, а это другое число.',
          'Check: only one number gives nine. The other gives thirteen, which is a different number.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ettinchi darsda ildizni tanlab topardik. Endi uni hisoblashni o'rganamiz.", 'В седьмом уроке корень мы подбирали. Теперь научимся его вычислять.', 'In lesson seven we guessed the root. Now we learn to compute it.'),
    A('mount', "Tenglama oddiy, x qo'shuv to'rt teng to'qqiz. Ikkala o'quvchi ham to'rtni ayirdi.", 'Уравнение простое, x плюс четыре равно девяти. Оба ученика вычли четвёрку.', 'The equation is simple, x plus four is nine. Both students took away a four.'),
    A('mount', "Biri x teng to'qqiz deb yozdi, ikkinchisi x teng besh. Tabloda ularning javoblari tekshirilgan.", 'Один написал x равно девяти, другой x равно пяти. На табло их ответы проверены.', 'One wrote x equals nine, the other x equals five. The boards show their answers checked.'),
    A('mount', "Sizningcha nega javob boshqa chiqdi. Javobni tanlang, bu taxmin, uning uchun baho yo'q.", 'Как думаешь, почему ответы разные. Выбери ответ, это прогноз, оценки за него нет.', 'Why do you think the answers differ. Pick an answer, this is a prediction, it is not graded.'),
  ],
}

function Screen1({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S1.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [picked, setPicked] = useState(null)
  return (
    <Frame meta={S1} screen={screen} audio={audio} solved={!!picked} {...rest}>
      <TwoRoutes source={S1.gate.source} rows={S1.gate.rows} />
      <Probe
        data={S1.probe}
        cols={2}
        unscored
        fbSlot={0}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setPicked(r.picked); onAnswer({ ...r, screen, role: 'hook' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 2. TAYANCH. KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L("5 soni x qo'shuv 4 teng 9 tenglamaning ildizimi?", 'Является ли 5 корнем уравнения x + 4 = 9?', 'Is 5 a root of the equation x + 4 = 9?'),
      ok: L("Ikkala tomon ham to'qqiz berdi.", 'Обе части дали девять.', 'Both sides gave nine.'),
      items: [
        { id: 'a', correct: true, label: L('Ha', 'Да', 'Yes') },
        { id: 'b', tag: 'Z3', label: L("Yo'q", 'Нет', 'No'), hint: L("Beshni qo'ying: 5 qo'shuv 4. Chiqqan son o'ngdagi bilan bir xilmi?", 'Подставь пятёрку: 5 плюс 4. Совпало ли это число с правым?', 'Substitute five: 5 plus 4. Does it match the right side?') },
        { id: 'c', tag: 'Z3', label: L("Tenglamani yechmasdan bilib bo'lmaydi", 'Нельзя узнать, не решив', 'There is no way to tell without solving'), hint: L("Ettinchi darsda buni qilgandik: sonni qo'yish va ikkala tomonni hisoblash yetarli.", 'В седьмом уроке мы это делали: достаточно подставить и посчитать обе части.', 'We did this in lesson seven: substitute and work out both sides.') },
        { id: 'd', tag: 'Z3', label: L("Faqat chap tomonni hisoblash kerak", 'Достаточно посчитать левую часть', 'It is enough to work out the left side'), hint: L("Chapni hisoblab, uni nima bilan solishtirasiz.", 'Посчитав левую часть, с чем ты её сравнишь.', 'Once the left side is worked out, what will you compare it with.') },
      ],
    },
    {
      prompt: '18 : 3',
      ok: L("Bu son bugun yana kerak bo'ladi.", 'Это число сегодня понадобится ещё раз.', 'This number will be needed again today.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '15', hint: L("15 bu 18 ayirish 3. Belgi bo'lish.", '15 это 18 минус 3. Знак деление.', '15 is 18 minus 3. The sign is a division.') },
        { id: 'c', label: '54', hint: L("54 bu 18 karra 3. Belgi bo'lish.", '54 это 18 умножить на 3. Знак деление.', '54 is 18 times 3. The sign is a division.') },
        { id: 'd', label: '21', hint: L("21 bu 18 qo'shuv 3. Belgi bo'lish.", '21 это 18 плюс 3. Знак деление.', '21 is 18 plus 3. The sign is a division.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Tenglik to'g'ri bo'lib qolishi uchun amal qayerga qo'llanishi kerak?", 'Куда надо применить действие, чтобы равенство осталось верным?', 'Where must an operation be applied for the equality to stay true?'),
      ok: L("Ikkala tomonga birdan. Bir tomonga qo'llansa, tenglik buziladi.", 'Сразу к обеим частям. К одной нельзя, равенство сломается.', 'To both sides at once. Applying it to one breaks the equality.'),
      items: [
        { id: 'a', correct: true, label: L('Ikkala tomonga', 'К обеим частям', 'To both sides') },
        { id: 'b', tag: 'Z1', label: L('Chap tomonga', 'К левой части', 'To the left side'), hint: L("Unda chap tomon o'zgaradi, o'ng esa qoladi. Tenglik buziladi.", 'Тогда левая часть изменится, а правая останется. Равенство сломается.', 'Then the left side changes and the right stays. The equality breaks.') },
        { id: 'c', tag: 'Z1', label: L("O'ng tomonga", 'К правой части', 'To the right side'), hint: L("Xuddi shunday: bitta tomon o'zgarsa, tenglik buziladi.", 'То же самое: если меняется одна часть, равенство ломается.', 'The same: change one side and the equality breaks.') },
        { id: 'd', tag: 'Z1', label: L("Harf turgan tomonga", 'К той части, где буква', 'To the side with the letter'), hint: L("Harf qayerda turganining ahamiyati yo'q. Amal ikkala tomonga ketadi.", 'Неважно, где стоит буква. Действие идёт к обеим частям.', 'It does not matter where the letter is. The operation goes to both sides.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzudan oldin uchta savolga javob beramiz.", 'Прежде чем идти в новую тему, ответим на три вопроса.', 'Before the new topic let us answer three questions.'),
    A('1', "Ikkinchisi. Oddiy hisob.", 'Второе. Простой счёт.', 'Second. Simple arithmetic.'),
    A('2', "Uchinchisi. Bu bugungi darsning kaliti.", 'Третье. Это ключ к сегодняшнему уроку.', 'Third. This is the key to today.'),
  ],
}

function Screen2({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S2.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S2} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S2.items}
        question={S2.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'support' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1. TAROZI. Amal IKKALA tomonga qo'llanadi --
// boshqacha qilishning imkoni yo'q, chunki bunday tugma mavjud emas.
// ============================================================
const S3 = {
  eyebrow: L('TAROZI', 'ВЕСЫ', 'THE BALANCE'),
  title: L("Amal ikkala tomonga ketadi", 'Действие идёт к обеим частям', 'The operation goes to both sides'),
  start: { a: 1, b: 4, c: 9 },
  actions: [
    { id: 's4', kind: 'sub', n: 4, label: '−4' },
    { id: 'a4', kind: 'add', n: 4, label: '+4', tag: 'Z2', hint: L("To'rtni qo'shsak, chapda sakkiz paydo bo'ladi. Bizga esa x yolg'iz qolishi kerak.", 'Если прибавить четыре, слева появится восемь. А нам нужно, чтобы x остался один.', 'Adding four makes an eight on the left. We need the x to be left alone.') },
    { id: 'd4', kind: 'div', n: 4, label: ':4', tag: 'Z2', hint: L("Bo'lish bu yerda yordam bermaydi: chap tomonda qo'shish turibdi, ko'paytirish emas.", 'Деление здесь не поможет: в левой части стоит сложение, а не умножение.', 'Division does not help here: the left side has an addition, not a multiplication.') },
    { id: 'm4', kind: 'mul', n: 4, label: '·4', tag: 'Z2', hint: L("Ko'paytirish sonlarni kattalashtiradi. x ni yolg'iz qoldirish uchun to'rtni YO'QOTISH kerak.", 'Умножение только увеличит числа. Чтобы оставить x одного, четвёрку надо УБРАТЬ.', 'Multiplying only makes the numbers bigger. To leave x alone the four must GO.') },
  ],
  done: L("x yolg'iz qoldi. Uning yonidagi son -- ildiz.", 'x остался один. Число рядом с ним и есть корень.', 'The x is left alone. The number beside it is the root.'),
  reward: {
    title: L("Bir tomonga qo'llash mumkin emas", 'К одной части применить нельзя', 'It cannot be applied to one side'),
    text: L(
      "Bunday tugma yo'q. Har qanday amal ikkala tomonda bir vaqtda ko'rinadi, shuning uchun tenglik hech qachon buzilmaydi.",
      'Такой кнопки нет. Любое действие появляется сразу на обеих частях, поэтому равенство не ломается никогда.',
      'There is no such button. Every operation appears on both sides at once, so the equality never breaks.',
    ),
  },
  audio: [
    A('mount', "Bu tarozi. Chapda tenglamaning chap tomoni, o'ngda o'ng tomoni.", 'Это весы. Слева левая часть уравнения, справа правая.', 'This is a balance. The left side of the equation on the left, the right side on the right.'),
    A('mount', "Amalni tanlang. Diqqat qiling: u ikkala tomonda bir vaqtda paydo bo'ladi. Faqat bitta tomonga qo'llash uchun tugma yo'q.", 'Выбери действие. Обрати внимание: оно появится сразу на обеих частях. Кнопки, чтобы применить только к одной, нет.', 'Pick an operation. Note that it appears on both sides at once. There is no button to apply it to one side only.'),
    A('step2', "x yolg'iz qoldi. Uning yonidagi son ildiz.", 'x остался один. Число рядом с ним и есть корень.', 'The x is left alone. The number beside it is the root.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <EquationBalance
        audio={audio}
        start={S3.start}
        actions={S3.actions}
        done={S3.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* Tablichka BIRINCHI soniyadan turadi, javob kelgach kerakli katak
          yonadi. Bo'sh joy ham qolmaydi, natija ham kutilib turadi. */}
      <SolutionSet kind={done ? 'one' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: bu yerda AYIRISH emas, BO'LISH kerak.
// Amal turi chap tomonda nima turganiga qarab tanlanadi.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Endi ayirish yordam bermaydi", 'Теперь вычитание не поможет', 'Now subtraction will not help'),
  start: { a: 5, b: 0, c: 20 },
  actions: [
    { id: 'd5', kind: 'div', n: 5, label: ':5' },
    { id: 's5', kind: 'sub', n: 5, label: '−5', tag: 'Z2', hint: L("Beshni ayirsak, chapda 5x ayirish 5 chiqadi. x hali ham yolg'iz emas: uning oldida beshlik turibdi.", 'Если вычесть пять, слева выйдет 5x минус 5. x всё ещё не один: перед ним стоит пятёрка.', 'Taking away five gives 5x minus 5 on the left. The x is still not alone: a five stands before it.') },
    { id: 'm5', kind: 'mul', n: 5, label: '·5', tag: 'Z2', hint: L("Ko'paytirish koeffitsiyentni yanada kattalashtiradi: 25x bo'lib qoladi.", 'Умножение только увеличит коэффициент: станет 25x.', 'Multiplying makes the coefficient bigger still: it becomes 25x.') },
    { id: 'a5', kind: 'add', n: 5, label: '+5', tag: 'Z2', hint: L("Qo'shish chap tomonga ortiqcha son qo'shadi. x oldidagi beshlikni YO'QOTISH kerak.", 'Сложение добавит слева лишнее число. А убрать надо пятёрку ПЕРЕД x.', 'Adding puts an extra number on the left. What must go is the five BEFORE the x.') },
  ],
  done: L("Ikkala tomon ham beshga bo'lindi, va x yolg'iz qoldi.", 'Обе части разделили на пять, и x остался один.', 'Both sides were divided by five, and the x is left alone.'),
  reward: {
    title: L("Amalni chap tomon aytadi", 'Действие подсказывает левая часть', 'The left side tells you the operation'),
    text: L(
      "x oldida qo'shiluvchi tursa -- uni ayiramiz. x oldida ko'paytuvchi tursa -- unga bo'lamiz. Ikkala holatda ham ikkala tomonga.",
      'Если рядом с x стоит слагаемое — вычитаем его. Если множитель — делим на него. В обоих случаях к обеим частям.',
      'If a term sits beside x we take it away. If a factor does, we divide by it. In both cases on both sides.',
    ),
  },
  audio: [
    A('mount', "Endi boshqa tenglama. Chap tomonda qo'shish yo'q, x oldida ko'paytuvchi turibdi.", 'Теперь другое уравнение. Слева нет сложения, перед x стоит множитель.', 'Now a different equation. No addition on the left, a factor stands before the x.'),
    A('mount', "Qaysi amal x ni yolg'iz qoldiradi.", 'Какое действие оставит x одного.', 'Which operation will leave the x alone.'),
  ],
}

function Screen4({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S4.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S4} screen={screen} audio={audio} solved={done} {...rest}>
      <EquationBalance
        audio={audio}
        start={S4.start}
        actions={S4.actions}
        done={S4.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* Tablichka BIRINCHI soniyadan turadi, javob kelgach kerakli katak
          yonadi. Bo'sh joy ham qolmaydi, natija ham kutilib turadi. */}
      <SolutionSet kind={done ? 'one' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. IKKI QADAM. Avval qo'shiluvchi ketadi,
// keyin ko'paytuvchi. Tartib teskari bo'lsa, asbob qatorni qo'shmaydi.
// ============================================================
const S5 = {
  eyebrow: L('IKKI QADAM', 'ДВА ШАГА', 'TWO STEPS'),
  title: L('Avval son, keyin koeffitsiyent', 'Сначала число, потом коэффициент', 'First the number, then the coefficient'),
  start: { a: 2, b: 3, c: 11 },
  actions: [
    { id: 's3', kind: 'sub', n: 3, label: '−3' },
    { id: 'd2', kind: 'div', n: 2, label: ':2' },
    { id: 'a3', kind: 'add', n: 3, label: '+3', tag: 'Z2', hint: L("Qo'shish uchlikni yo'qotmaydi, aksincha oltiga aylantiradi.", 'Сложение не уберёт тройку, а превратит её в шестёрку.', 'Adding will not remove the three, it turns it into a six.') },
    { id: 'd3', kind: 'div', n: 3, label: ':3', tag: 'Z6', hint: L("Uchga bo'lsak, koeffitsiyent ham, ozod had ham kasrga aylanadi. Avval qo'shiluvchini yo'qotish qulayroq.", 'Если делить на три, и коэффициент, и свободное число станут дробными. Сначала удобнее убрать слагаемое.', 'Dividing by three turns both the coefficient and the free number into fractions. It is easier to remove the term first.') },
  ],
  done: L("Ikki qadam: avval uchlik ketdi, keyin ikkiga bo'ldik.", 'Два шага: сначала ушла тройка, потом разделили на два.', 'Two steps: the three went first, then we divided by two.'),
  reward: {
    title: L('Tartib bor', 'Порядок есть', 'There is an order'),
    text: L(
      "Avval x dan uzoqdagi son ketadi, keyin unga yopishgan koeffitsiyent. Bu amallar tartibining teskarisi.",
      'Сначала уходит число, стоящее от x дальше, потом прилипший к нему коэффициент. Это порядок действий наоборот.',
      'First the number further from x goes, then the coefficient stuck to it. That is the order of operations in reverse.',
    ),
  },
  audio: [
    A('mount', "Endi chap tomonda ikkita narsa bor: koeffitsiyent va qo'shiluvchi.", 'Теперь слева две вещи: коэффициент и слагаемое.', 'Now there are two things on the left: a coefficient and a term.'),
    A('mount', "Ikki qadam kerak bo'ladi. Qaysi biri birinchi ketishini o'zingiz tanlang.", 'Понадобится два шага. Какой из них первый, выбери сам.', 'Two steps will be needed. Which one goes first is your choice.'),
    A('step2', "Uchlik ketdi. Endi x oldidagi ikkilikni yo'qotamiz.", 'Тройка ушла. Теперь уберём двойку перед x.', 'The three is gone. Now let us remove the two before the x.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <EquationBalance
        audio={audio}
        start={S5.start}
        actions={S5.actions}
        done={S5.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* Tablichka BIRINCHI soniyadan turadi, javob kelgach kerakli katak
          yonadi. Bo'sh joy ham qolmaydi, natija ham kutilib turadi. */}
      <SolutionSet kind={done ? 'one' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ: manfiy ozod had.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Endi ozod had manfiy", 'Теперь свободное число отрицательное', 'Now the free number is negative'),
  start: { a: 3, b: -5, c: 7 },
  actions: [
    { id: 'a5', kind: 'add', n: 5, label: '+5' },
    { id: 'd3', kind: 'div', n: 3, label: ':3' },
    { id: 's5', kind: 'sub', n: 5, label: '−5', tag: 'Z6', hint: L("Chap tomonda minus besh turibdi. Uni yo'qotish uchun besh QO'SHISH kerak, ayirish emas.", 'Слева стоит минус пять. Чтобы его убрать, надо пять ПРИБАВИТЬ, а не вычесть.', 'The left side has a minus five. To remove it you must ADD five, not subtract.') },
    { id: 'm3', kind: 'mul', n: 3, label: '·3', tag: 'Z2', hint: L("Ko'paytirish koeffitsiyentni to'qqizga aylantiradi. Bizga esa u bir bo'lishi kerak.", 'Умножение превратит коэффициент в девять. А нам нужно, чтобы он стал единицей.', 'Multiplying turns the coefficient into nine. We need it to become one.') },
  ],
  done: L("Ikki qadam, va x yolg'iz qoldi.", 'Два шага, и x остался один.', 'Two steps, and the x is left alone.'),
  audio: [
    A('mount', "Endi o'zingiz. Diqqat qiling: chap tomonda minus turibdi.", 'Теперь сам. Обрати внимание: слева стоит минус.', 'Now on your own. Note the minus on the left.'),
    A('mount', "Manfiy sonni yo'qotish uchun qaysi amal kerak.", 'Какое действие нужно, чтобы убрать отрицательное число.', 'Which operation removes a negative number.'),
  ],
}

function Screen6({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S6.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S6} screen={screen} audio={audio} solved={done} {...rest}>
      <EquationBalance
        audio={audio}
        start={S6.start}
        actions={S6.actions}
        done={S6.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* Tablichka BIRINCHI soniyadan turadi, javob kelgach kerakli katak
          yonadi. Bo'sh joy ham qolmaydi, natija ham kutilib turadi. */}
      <SolutionSet kind={done ? 'one' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT: koeffitsiyent NOL.
// Bu yerda tarozi ishlamaydi -- bo'linadigan narsa yo'q. Uch holatning
// ikkinchisi va uchinchisi shu yerda ochiladi. KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Koeffitsiyent nol bo'lsa", 'Когда коэффициент нуль', 'When the coefficient is zero'),
  expr: '0 · x = 5',
  probe: {
    question: L("0 karra x teng 5 tenglikni nechta son to'g'ri qiladi?", 'Сколько чисел делают верным равенство 0 · x = 5?', 'How many numbers make 0 · x = 5 true?'),
    items: [
      { id: 'none', correct: true, label: L("Bittasi ham yo'q", 'Ни одного', 'None') },
      { id: 'zero', tag: 'Z4', label: L("Bitta, nol", 'Одно, нуль', 'One, zero'), hint: L("Nolni qo'ying: nol karra nol bu nol, o'ngda esa besh. Ildiz nol bo'lish va ildiz yo'q bo'lish -- ikki boshqa narsa.", 'Поставь нуль: нуль умножить на нуль это нуль, а справа пять. Корень нуль и отсутствие корней это разное.', 'Put in zero: zero times zero is zero, and the right side is five. A root of zero and no root are different things.') },
      { id: 'five', tag: 'Z4', label: L('Bitta, besh', 'Одно, пять', 'One, five'), hint: L("Beshni qo'ying: nol karra besh baribir nol. Nolga ko'paytirilgan har qanday son nol beradi.", 'Поставь пятёрку: нуль умножить на пять всё равно нуль. Любое число, умноженное на нуль, даёт нуль.', 'Put in five: zero times five is still zero. Any number times zero gives zero.') },
      { id: 'all', tag: 'Z5', label: L('Hamma son', 'Все числа', 'Every number'), hint: L("Chap tomon har doim nol chiqadi, o'ng tomon esa besh. Nol hech qachon beshga teng bo'lmaydi.", 'Левая часть всегда нуль, а правая пять. Нуль никогда не равен пяти.', 'The left side is always zero and the right is five. Zero is never five.') },
    ],
  },
  okText: L(
    "Chap tomon har qanday sonda nol chiqadi. Bunday tenglamaning ildizi yo'q.",
    'Левая часть при любом числе даёт нуль. У такого уравнения корней нет.',
    'The left side gives zero for any number. Such an equation has no roots.',
  ),
  bonus: {
    title: L('Uchinchi holat ham bor', 'Есть и третий случай', 'There is a third case too'),
    text: L(
      "Agar o'ng tomonda ham nol tursa, ya'ni nol karra x teng nol bo'lsa, tenglik HAR QANDAY sonda to'g'ri bo'ladi. Chiziqli tenglama uch xil bo'ladi: bitta ildiz, ildizi yo'q, cheksiz ko'p ildiz.",
      'Если справа тоже нуль, то есть 0 · x = 0, равенство верно при ЛЮБОМ числе. Линейных уравнения три вида: один корень, нет корней, бесконечно много корней.',
      'If the right side is zero too, that is 0 · x = 0, the equality is true for ANY number. There are three kinds of linear equation: one root, no roots, infinitely many roots.',
    ),
  },
  audio: [
    A('mount', "Endi tarozi ishlamaydi. Chap tomonda x oldida nol turibdi.", 'Теперь весы не работают. Слева перед x стоит нуль.', 'Now the balance does not work. A zero stands before the x on the left.'),
    A('mount', "Nolga bo'lish mumkin emas, demak x ni yolg'iz qoldirib bo'lmaydi. Avval javob bering.", 'На нуль делить нельзя, значит x одного не оставить. Сначала ответь.', 'You cannot divide by zero, so the x cannot be left alone. Answer first.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S7.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <div className="g7-eqb-lone"><Fx>{S7.expr}</Fx></div>
      <Probe
        data={{ ...S7.probe, ok: S7.okText }}
        cols={2}
        audio={audio}
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      <SolutionSet kind={done ? 'none' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 8. QOIDA. Maydon TO'Q SARIQ. DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("amal ikkala tomonga birdan qo'llanadi", 'действие применяют сразу к обеим частям', 'an operation is applied to both sides at once') },
    { id: 'f2', label: L("avval x dan uzoqdagi son ketadi", 'сначала уходит число, стоящее дальше от x', 'first the number further from x goes') },
    { id: 'f3', label: L("keyin koeffitsiyentga bo'linadi", 'потом делят на коэффициент', 'then you divide by the coefficient') },
    { id: 'f4', label: L("koeffitsiyent nol bo'lsa, bo'lish mumkin emas", 'если коэффициент нуль, делить нельзя', 'if the coefficient is zero, division is impossible') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Birinchi qator butun blokning qoidasi, oxirgisi esa chegaraviy holat.",
    'Порядок нарушен. Первая строка это правило всего блока, последняя граничный случай.',
    'The order is off. The first line is the rule of the whole block, the last is the edge case.',
  ),
  lawChips: [
    { label: '⇄', tone: 'par' },
    { label: '±', tone: 's1' },
    { label: ': a', tone: 's2' },
    { label: 'a = 0', tone: 'off' },
  ],
  lawSweep: L(
    "ikkala tomonga, so'ng son, so'ng koeffitsiyent",
    'к обеим частям, потом число, потом коэффициент',
    'to both sides, then the number, then the coefficient',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "ax teng b ko'rinishidagi tenglama bir noma'lumli chiziqli tenglama deyiladi. Bu yerda x noma'lum, a va b esa ixtiyoriy sonlar.",
        'Уравнение вида ax = b называют линейным уравнением с одним неизвестным. Здесь x неизвестная, a и b произвольные числа.',
        'An equation of the form ax = b is called a linear equation in one unknown. Here x is the unknown and a and b are any numbers.',
      ),
      L(
        "Ildizlar soniga qarab uch xil bo'ladi: bitta ildizli, ildizi yo'q, cheksiz ko'p ildizli.",
        'По числу корней они бывают трёх видов: с одним корнем, без корней, с бесконечным числом корней.',
        'By root count they come in three kinds: one root, no roots, infinitely many roots.',
      ),
    ],
  },
  hookCap: L("Uch holat, va ular tablichka bilan farqlanadi", 'Три случая, и различает их табличка', 'Three cases, and the table tells them apart'),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("bir tomonga qo'llash tugmasi yo'q", 'кнопки «только к одной части» нет', 'there is no one-side button'),
    L("x dan uzoqdagi son birinchi ketadi", 'дальнее от x число уходит первым', 'the number further from x goes first'),
    L("nolga bo'lish mumkin emas", 'на нуль делить нельзя', 'you cannot divide by zero'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani so'z bilan yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило словами.', 'We have seen all the cases. Now let us put the rule into words.'),
    A('mount', "Bo'laklarni to'g'ri tartibda joylashtiring.", 'Разложи фрагменты в верном порядке.', 'Put the pieces in the right order.'),
    A('ok', "To'g'ri. Uch holat butun blok bo'ylab kerak bo'ladi.", 'Верно. Три случая понадобятся во всём блоке.', 'Correct. The three cases will be needed across the whole block.'),
  ],
}

function Screen8({ screen, onAnswer, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S8.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const rule = useMemo(() => ({ badge: t(S8.rule.badge), lines: S8.rule.lines.map(t) }), [t])
  return (
    <Frame meta={S8} screen={screen} audio={audio} solved={done} {...rest}>
      <RuleBuilder
        audio={audio}
        fragments={S8.fragments}
        answer={S8.answer}
        wrongHint={S8.wrongHint}
        tag="Z1"
        rule={rule}
        help={(
          <div className="g7-helpstrip">
            <Tag tone="quiet">{t(S8.helpLabel)}</Tag>
            {S8.helpRows.map((r, i) => <span key={i}>{t(r)}</span>)}
          </div>
        )}
        after={(
          <>
            <StairsReveal items={S8.lawChips} sweep={t(S8.lawSweep)} />
            <Hint>{t(S8.hookCap)}</Hint>
          </>
        )}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'rule' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 9. MASHQ 1. Uchta tenglama, javob bo'laklardan yig'iladi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchalasida ham bitta yo'l: amalni ikkala tomonga qo'llash va x ni yolg'iz qoldirish.",
      'Во всех трёх один путь: применить действие к обеим частям и оставить x одного.',
      'The same path in all three: apply the operation to both sides and leave the x alone.',
    ),
  },
  rounds: [
    {
      template: ['x + 6 = 15,     x = ', { slot: 0 }],
      parts: [{ id: 'p9', label: '9' }, { id: 'p21', label: '21' }, { id: 'p6', label: '6' }, { id: 'p90', label: '90' }],
      answer: ['p9'],
      prompt: L("x qo'shuv 6 teng 15. Ildizni toping.", 'x + 6 = 15. Найди корень.', 'x + 6 = 15. Find the root.'),
      checkNote: L("Ikkala tomondan 6 ayirildi: 9 qo'shuv 6 teng 15", 'Из обеих частей вычли 6: 9 плюс 6 равно 15', 'Six was taken from both sides: 9 plus 6 is 15'),
      wrongs: [
        { key: 'p21', tag: 'Z1', hint: L("21 bu 15 qo'shuv 6. Oltilikni qo'shish emas, AYIRISH kerak edi.", '21 это 15 плюс 6. Шестёрку надо было не прибавить, а ВЫЧЕСТЬ.', '21 is 15 plus 6. The six had to be TAKEN AWAY, not added.') },
        { key: '*', tag: 'Z1', hint: L("Ikkala tomondan oltini ayiring va nima qolishini ko'ring.", 'Вычти шесть из обеих частей и посмотри, что останется.', 'Take six from both sides and see what is left.') },
      ],
    },
    {
      template: ['7x = 42,     x = ', { slot: 0 }],
      parts: [{ id: 'q6', label: '6' }, { id: 'q35', label: '35' }, { id: 'q49', label: '49' }, { id: 'q294', label: '294' }],
      answer: ['q6'],
      prompt: L("7x teng 42. Ildizni toping.", '7x = 42. Найди корень.', '7x = 42. Find the root.'),
      checkNote: L("Ikkala tomon 7 ga bo'lindi: 7 karra 6 teng 42", 'Обе части разделили на 7: 7 умножить на 6 равно 42', 'Both sides were divided by 7: 7 times 6 is 42'),
      wrongs: [
        { key: 'q35', tag: 'Z2', hint: L("35 bu 42 ayirish 7. x oldida ko'paytirish turibdi, demak BO'LISH kerak.", '35 это 42 минус 7. Перед x умножение, значит нужно ДЕЛЕНИЕ.', '35 is 42 minus 7. There is a multiplication before x, so DIVISION is needed.') },
        { key: '*', tag: 'Z2', hint: L("Ikkala tomonni yettiga bo'ling.", 'Раздели обе части на семь.', 'Divide both sides by seven.') },
      ],
    },
    {
      template: ['4x − 3 = 17,     x = ', { slot: 0 }],
      parts: [{ id: 'w5', label: '5' }, { id: 'w20', label: '20' }, { id: 'w14', label: '14' }, { id: 'w3', label: '3' }],
      answer: ['w5'],
      prompt: L("4x ayirish 3 teng 17. Ildizni toping.", '4x − 3 = 17. Найди корень.', '4x − 3 = 17. Find the root.'),
      checkNote: L("Avval 3 qo'shildi, keyin 4 ga bo'lindi: 4 karra 5 ayirish 3 teng 17", 'Сначала прибавили 3, потом разделили на 4: 4 умножить на 5 минус 3 равно 17', 'First 3 was added, then divided by 4: 4 times 5 minus 3 is 17'),
      wrongs: [
        { key: 'w14', tag: 'Z6', hint: L("14 bu 17 ayirish 3. Uchlik chap tomonda MINUS bilan turibdi, demak uni qo'shish kerak.", '14 это 17 минус 3. Тройка стоит слева с МИНУСОМ, значит её надо прибавить.', '14 is 17 minus 3. The three stands on the left with a MINUS, so it must be added.') },
        { key: '*', tag: 'Z6', hint: L("Ikki qadam: avval uchlikni yo'qoting, keyin to'rtga bo'ling.", 'Два шага: сначала убери тройку, потом раздели на четыре.', 'Two steps: remove the three first, then divide by four.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uchta tenglama.", 'Правило готово. Теперь три уравнения.', 'The rule is ready. Now three equations.'),
    A('r1', "Ikkinchisi. Bu safar ko'paytuvchi.", 'Второе. На этот раз множитель.', 'Second. This time a factor.'),
    A('r2', "Uchinchisi. Bu yerda ikki qadam kerak.", 'Третье. Здесь понадобится два шага.', 'Third. This one needs two steps.'),
  ],
}

function Screen9({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S9.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S9.rounds.length
  const r = S9.rounds[idx]
  const LABELS = ['x + 6 = 15   →   x = 9', '7x = 42   →   x = 6', '4x − 3 = 17   →   x = 5']
  return (
    <Frame meta={S9} screen={screen} audio={audio} solved={done} {...rest}>
      {rows.map((row, i) => <DoneRow key={i}>{row}</DoneRow>)}
      {!done ? (
        <SlotFill
          key={idx}
          audio={audio}
          template={r.template}
          parts={r.parts}
          answer={r.answer}
          prompt={r.prompt}
          checkNote={r.checkNote}
          wrongs={r.wrongs}
          wide
          disabled={!canAnswer}
          onSolved={(res) => {
            setRows((prev) => prev.concat(LABELS[idx]))
            const next = idx + 1
            setIdx(next)
            audio.step('r' + next)
            onAnswer({ ...res, screen, role: 'practice', part: 'r' + (idx + 1) })
          }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 10. MASHQ 2. Yo'naltirilgan: tarozi, uch qadamli tenglama.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Tarozida to'liq yechim", 'Полное решение на весах', 'A full solution on the balance'),
  start: { a: 6, b: 8, c: 32 },
  actions: [
    { id: 's8', kind: 'sub', n: 8, label: '−8' },
    { id: 'd6', kind: 'div', n: 6, label: ':6' },
    { id: 'd8', kind: 'div', n: 8, label: ':8', tag: 'Z6', hint: L("Sakkizga bo'lsak, oltilik ham, o'ttiz ikki ham kasrga aylanadi. Avval qo'shiluvchini yo'qotish qulayroq.", 'Если делить на восемь, и шестёрка, и тридцать два станут дробными. Сначала удобнее убрать слагаемое.', 'Dividing by eight makes both the six and the thirty two fractional. It is easier to remove the term first.') },
    { id: 'a8', kind: 'add', n: 8, label: '+8', tag: 'Z2', hint: L("Sakkizni qo'shsak, chapda o'n olti paydo bo'ladi. Uni YO'QOTISH kerak.", 'Если прибавить восемь, слева появится шестнадцать. А его надо УБРАТЬ.', 'Adding eight makes a sixteen on the left. It has to GO.') },
  ],
  done: L("Ikki qadam, va ildiz topildi.", 'Два шага, и корень найден.', 'Two steps, and the root is found.'),
  reward: {
    title: L("Tarozi tenglikni saqlaydi", 'Весы удерживают равенство', 'The balance keeps the equality'),
    text: L(
      "Har qadamda ikkala tomon birdan o'zgardi, shuning uchun har bir qator oldingisiga teng. Oxirgi qator esa javobni beradi.",
      'На каждом шаге обе части менялись сразу, поэтому каждая строка равна предыдущей. А последняя даёт ответ.',
      'At every step both sides changed together, so each line equals the one before. And the last one gives the answer.',
    ),
  },
  audio: [
    A('mount', "Uch qadamli tenglama. Tarozi bilan yeching.", 'Уравнение посложнее. Реши его на весах.', 'A harder equation. Solve it on the balance.'),
    A('step2', "Sakkizlik ketdi. Endi koeffitsiyent qoldi.", 'Восьмёрка ушла. Остался коэффициент.', 'The eight is gone. The coefficient is left.'),
  ],
}

function Screen10({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S10.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S10} screen={screen} audio={audio} solved={done} {...rest}>
      <EquationBalance
        audio={audio}
        start={S10.start}
        actions={S10.actions}
        done={S10.done}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
      {/* Tablichka BIRINCHI soniyadan turadi, javob kelgach kerakli katak
          yonadi. Bo'sh joy ham qolmaydi, natija ham kutilib turadi. */}
      <SolutionSet kind={done ? 'one' : null} caption={SET_CAP} />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2, §8.1). Tarozi yo'q.
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Tarozisiz', 'Без весов', 'Without the balance'),
  template: ['9x + 4 = 40,     x = ', { slot: 0 }],
  parts: [
    { id: 'p4', label: '4' },
    { id: 'p36', label: '36' },
    { id: 'p5', label: '5' },
    { id: 'p44', label: '44' },
  ],
  answer: ['p4'],
  prompt: L(
    "9x qo'shuv 4 teng 40. Tarozi ham, qadamlar ham ekranda ko'rinmaydi.",
    '9x + 4 = 40. Ни весов, ни шагов на экране не будет.',
    '9x + 4 = 40. Neither the balance nor the steps will appear.',
  ),
  checkNote: L(
    "Ikkala tomondan 4 ayirildi, keyin 9 ga bo'lindi: 9 karra 4 qo'shuv 4 teng 40",
    'Из обеих частей вычли 4, потом разделили на 9: 9 умножить на 4 плюс 4 равно 40',
    'Four was taken from both sides, then divided by 9: 9 times 4 plus 4 is 40',
  ),
  wrongs: [
    { key: 'p36', tag: 'Z6', hint: L("36 bu 40 ayirish 4, ya'ni faqat birinchi qadam. To'qqizga bo'lish qolib ketdi.", '36 это 40 минус 4, то есть только первый шаг. Разделить на девять осталось несделанным.', '36 is 40 minus 4, only the first step. Dividing by nine was left undone.') },
    { key: 'p44', tag: 'Z1', hint: L("44 bu 40 qo'shuv 4. To'rtlikni qo'shish emas, ayirish kerak edi.", '44 это 40 плюс 4. Четвёрку надо было не прибавить, а вычесть.', '44 is 40 plus 4. The four had to be taken away, not added.') },
    { key: '*', tag: 'Z6', hint: L("Ikki qadam: avval to'rtlikni ikkala tomondan ayiring, keyin to'qqizga bo'ling.", 'Два шага: сначала вычти четвёрку из обеих частей, потом раздели на девять.', 'Two steps: take the four from both sides, then divide by nine.') },
  ],
  audio: [
    A('mount', "Endi tarozisiz. Qadamlarni o'zingiz o'ylaysiz.", 'Теперь без весов. Шаги держишь в голове.', 'Now without the balance. You hold the steps in your head.'),
    A('mount', "Ikki qadam kerak bo'ladi.", 'Понадобится два шага.', 'Two steps will be needed.'),
  ],
}

function Screen11({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S11.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S11} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S11.template}
        parts={S11.parts}
        answer={S11.answer}
        prompt={S11.prompt}
        checkNote={S11.checkNote}
        wrongs={S11.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 12. TUZOQ (§8.2). Amal FAQAT BITTA tomonga qo'llangan --
// blokning eng qimmat xatosi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Yuqoridagi qatordan kelib chiqmagan qatorni toping.",
    'Найди строку, которая не следует из строки над ней.',
    'Find the line that does not follow from the line above it.',
  ),
  rows: [
    { id: 'r1', text: '3x + 7 = 22' },
    { id: 'r2', text: '3x = 22' },
    { id: 'r3', text: 'x = 22 : 3' },
    { id: 'r4', text: 'x ≈ 7,33' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich tenglama, unda hali hech nima qilinmagan.", 'Это исходное уравнение, в нём ещё ничего не сделано.', 'That is the original equation, nothing has been done to it yet.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: ikkala tomon uchga bo'lingan. Xato yuqoriroqda.", 'Эта строка верно следует из второй: обе части разделили на три. Ошибка выше.', 'This line follows correctly from the second: both sides were divided by three. The mistake is higher up.'),
    r4: L("Bu shunchaki bo'lishning natijasi. Xato ancha oldin paydo bo'lgan.", 'Это просто результат деления. Ошибка появилась намного раньше.', 'That is just the result of the division. The mistake appeared much earlier.'),
  },
  tags: { r1: 'Z1', r3: 'Z1', r4: 'Z1' },
  proofFill: {
    // Shablonda SO'Z YO'Q: u uch tilga bo'linmaydi. Boshlang'ich yozuv ham
    // bu yerda emas, TOPSHIRIQDA turadi -- proza ko'chadi, shablon esa yo'q
    // va 390 da chetga chiqadi.
    template: ['3x = ', { slot: 0 },  ',     x = ', { slot: 1 }],
    parts: [{ id: 'v15', label: '15' }, { id: 'v5', label: '5' }, { id: 'v22', label: '22' }, { id: 'v29', label: '29' }],
    answer: ['v15', 'v5'],
    prompt: L(
      "3x qo'shuv 7 teng 22. Yettini IKKALA tomondan ayiring va yechimni oxirigacha olib boring.",
      '3x + 7 = 22. Вычти семь из ОБЕИХ частей и доведи решение до конца.',
      '3x + 7 = 22. Take the seven from BOTH sides and finish the solution.',
    ),
    checkNote: L("3 karra 5 qo'shuv 7 teng 22. Ildiz butun son ekan, kasr emas", '3 умножить на 5 плюс 7 равно 22. Корень оказался целым, а не дробным', '3 times 5 plus 7 is 22. The root turned out whole, not fractional'),
    wrongs: [
      { key: 'v15|v22', tag: 'Z1', hint: L("Chap tomonda 3x qoldi. Uni uchga bo'ling.", 'Слева осталось 3x. Раздели его на три.', 'The left side is 3x. Divide it by three.') },
      { key: '*', tag: 'Z1', hint: L("22 dan 7 ni ayiring, keyin chiqqan sonni 3 ga bo'ling.", 'Вычти из 22 семёрку, потом раздели полученное на 3.', 'Take seven from 22, then divide the result by 3.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi tenglamani yechdi va kasr javob oldi. Aslida ildiz butun son.", 'Ученик решил уравнение и получил дробный ответ. На самом деле корень целый.', 'A student solved the equation and got a fractional answer. In fact the root is whole.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping.", 'Найди строку, где ошибка появилась впервые.', 'Find the line where the mistake first appears.'),
    A('proof', "Topdingiz. O'quvchi yettini faqat chapdan ayirdi. Endi to'g'ri qiling.", 'Нашёл. Ученик вычел семь только слева. Теперь сделай верно.', 'You found it. The student took the seven from the left only. Now do it right.'),
    A('done', "Ildiz besh ekan. Yettini ikkala tomondan ayirish yetardi.", 'Корень оказался пятёркой. Достаточно было вычесть семь из обеих частей.', 'The root is five. Taking the seven from both sides was all it needed.'),
  ],
}

function Screen12({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S12.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [found, setFound] = useState(false)
  const [done, setDone] = useState(false)
  const [proofIn, setProofIn] = useState(false)
  useEffect(() => {
    if (!found) return undefined
    const tmr = setTimeout(() => setProofIn(true), 620)
    return () => clearTimeout(tmr)
  }, [found])
  return (
    <Frame meta={S12} screen={screen} audio={audio} solved={done} {...rest}>
      <AuditRows
        audio={audio}
        rows={S12.rows}
        answerId={S12.answerId}
        hints={S12.hints}
        tags={S12.tags}
        prompt={S12.ask}
        promptCap={S12.step1Cap}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setFound(true); onAnswer({ ...r, screen, role: 'trap', part: 'line' }) }}
      />
      {proofIn ? (
        <SlotFill
          audio={audio}
          template={S12.proofFill.template}
          parts={S12.proofFill.parts}
          answer={S12.proofFill.answer}
          prompt={S12.proofFill.prompt}
          promptCap={S12.step2Cap}
          tightAsk
          wide
          checkNote={S12.proofFill.checkNote}
          wrongs={S12.proofFill.wrongs}
          disabled={!canAnswer}
          onSolved={(r) => { setDone(true); audio.step('done'); onAnswer({ ...r, screen, role: 'trap', part: 'proof' }) }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 13. KO'CHIRISH. Vaziyatdan tenglamaga va ildizga.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L('Vaziyatdan tenglamaga', 'Из ситуации в уравнение', 'From a situation to an equation'),
  rounds: [
    {
      template: [{ slot: 0 }, 'x + ', { slot: 1 }, ' = 50'],
      parts: [{ id: 'p3', label: '3' }, { id: 'p20', label: '20' }, { id: 'p50', label: '50' }, { id: 'p10', label: '10' }],
      answer: ['p3', 'p20'],
      prompt: L(
        "Anvarda 3 ta bir xil daftar va 20 so'mlik ruchka bor, hammasi 50 so'm. Tenglamani yig'ing.",
        'У Анвара три одинаковые тетради и ручка за 20 сумов, всё вместе 50 сумов. Собери уравнение.',
        'Anvar has three identical notebooks and a pen for 20 sums, fifty sums in all. Build the equation.',
      ),
      checkNote: L("x -- bitta daftarning narxi, u noma'lum", 'x это цена одной тетради, она неизвестна', 'x is the price of one notebook, and it is unknown'),
      wrongs: [
        { key: 'p20|p3', tag: 'Z2', hint: L("Uchta daftar bor, ya'ni x uch marta olinadi. Yigirma esa ruchkaning narxi.", 'Тетрадей три, значит x берётся три раза. А двадцать это цена ручки.', 'There are three notebooks, so x is taken three times. Twenty is the price of the pen.') },
        { key: '*', tag: 'Z2', hint: L("Birinchi katakka daftarlar soni, ikkinchisiga ruchkaning narxi tushadi.", 'В первую клетку идёт число тетрадей, во вторую цена ручки.', 'The first box takes the number of notebooks, the second the price of the pen.') },
      ],
    },
    {
      template: ['x = ', { slot: 0 }],
      parts: [{ id: 'q10', label: '10' }, { id: 'q30', label: '30' }, { id: 'q70', label: '70' }, { id: 'q17', label: '17' }],
      answer: ['q10'],
      prompt: L(
        "Endi tenglamani yeching: bitta daftar necha so'm?",
        'Теперь реши уравнение: сколько стоит одна тетрадь?',
        'Now solve the equation: how much is one notebook?',
      ),
      checkNote: L("3 karra 10 qo'shuv 20 teng 50. Javob to'g'ri", '3 умножить на 10 плюс 20 равно 50. Ответ верный', '3 times 10 plus 20 is 50. The answer is right'),
      wrongs: [
        { key: 'q30', tag: 'Z6', hint: L("30 bu 50 ayirish 20, ya'ni uchta daftarning narxi. Bittasi esa uch marta kam.", '30 это 50 минус 20, то есть цена трёх тетрадей. А одна втрое дешевле.', '30 is 50 minus 20, the price of three notebooks. One is three times less.') },
        { key: '*', tag: 'Z6', hint: L("Avval yigirmani ikkala tomondan ayiring, keyin uchga bo'ling.", 'Сначала вычти двадцать из обеих частей, потом раздели на три.', 'First take twenty from both sides, then divide by three.') },
      ],
    },
  ],
  reward: {
    title: L("Noma'lum -- bu savol, harf esa uning nomi", 'Неизвестное это вопрос, а буква его имя', 'The unknown is the question, the letter is its name'),
    text: L(
      "Vaziyatdagi savolni harf bilan belgilaymiz, shartni tenglik qilib yozamiz, keyin tarozida yechamiz.",
      'Вопрос из ситуации обозначаем буквой, условие записываем равенством, а дальше решаем на весах.',
      'The question from the situation gets a letter, the condition becomes an equality, and then we solve on the balance.',
    ),
  },
  audio: [
    A('mount', "Butun dars davomida tenglama tayyor edi. Endi uni o'zingiz yozasiz.", 'Весь урок уравнение было готовым. Теперь ты запишешь его сам.', 'All lesson the equation was given. Now you write it yourself.'),
    A('r1', "Tenglama tayyor. Endi uni yeching.", 'Уравнение готово. Теперь реши его.', 'The equation is ready. Now solve it.'),
  ],
}

function Screen13({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S13.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [idx, setIdx] = useState(0)
  const [rows, setRows] = useState([])
  const done = idx >= S13.rounds.length
  const r = S13.rounds[idx]
  const LABELS = ['3x + 20 = 50', 'x = 10']
  return (
    <Frame meta={S13} screen={screen} audio={audio} solved={done} {...rest}>
      {rows.map((row, i) => <DoneRow key={i}>{row}</DoneRow>)}
      {!done ? (
        <SlotFill
          key={idx}
          audio={audio}
          template={r.template}
          parts={r.parts}
          answer={r.answer}
          prompt={r.prompt}
          checkNote={r.checkNote}
          wrongs={r.wrongs}
          wide
          disabled={!canAnswer}
          onSolved={(res) => {
            setRows((prev) => prev.concat(LABELS[idx]))
            const next = idx + 1
            setIdx(next)
            audio.step('r' + next)
            onAnswer({ ...res, screen, role: 'transfer', part: 'r' + (idx + 1) })
          }}
        />
      ) : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 14. BLITS. Darsdagi YAGONA baholanadigan ekran (§8.5).
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  question: L('Nimaga teng?', 'Чему равно?', 'What does it equal?'),
  items: [
    {
      wrap: true,
      question: null,
      prompt: L("x qo'shuv 8 teng 20 tenglamaning ildizi?", 'Корень уравнения x + 8 = 20?', 'The root of the equation x + 8 = 20?'),
      ok: L("Ikkala tomondan sakkiz ayirildi.", 'Из обеих частей вычли восемь.', 'Eight was taken from both sides.'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '28', tag: 'Z1', hint: L("28 bu 20 qo'shuv 8. Sakkizni ayirish kerak edi.", '28 это 20 плюс 8. Восьмёрку надо было вычесть.', '28 is 20 plus 8. The eight had to be taken away.') },
        { id: 'c', label: '8', tag: 'Z2', hint: L("8 bu yozuvdagi son, ildiz emas.", '8 это число из записи, а не корень.', '8 is a number from the line, not the root.') },
        { id: 'd', label: '160', tag: 'Z2', hint: L("160 bu 20 karra 8. Yozuvda ko'paytirish yo'q.", '160 это 20 умножить на 8. В записи нет умножения.', '160 is 20 times 8. There is no multiplication in the line.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("6x teng 18 tenglamaning ildizi?", 'Корень уравнения 6x = 18?', 'The root of the equation 6x = 18?'),
      ok: L("Ikkala tomon oltiga bo'lindi.", 'Обе части разделили на шесть.', 'Both sides were divided by six.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '12', tag: 'Z2', hint: L("12 bu 18 ayirish 6. x oldida ko'paytirish turibdi.", '12 это 18 минус 6. Перед x стоит умножение.', '12 is 18 minus 6. There is a multiplication before x.') },
        { id: 'c', label: '24', tag: 'Z2', hint: L("24 bu 18 qo'shuv 6. Bo'lish kerak edi.", '24 это 18 плюс 6. Нужно было деление.', '24 is 18 plus 6. Division was needed.') },
        { id: 'd', label: '108', tag: 'Z2', hint: L("108 bu 18 karra 6. Bo'lish kerak edi.", '108 это 18 умножить на 6. Нужно было деление.', '108 is 18 times 6. Division was needed.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("0 karra x teng 0 tenglamani nechta son to'g'ri qiladi?", 'Сколько чисел делают верным 0 · x = 0?', 'How many numbers make 0 · x = 0 true?'),
      ok: L("Nolga ko'paytirilgan har qanday son nol beradi.", 'Любое число, умноженное на нуль, даёт нуль.', 'Any number times zero gives zero.'),
      items: [
        { id: 'a', correct: true, label: L('Hamma son', 'Все числа', 'Every number') },
        { id: 'b', tag: 'Z5', label: L('Bitta, nol', 'Одно, нуль', 'One, zero'), hint: L("Beshni ham qo'yib ko'ring: nol karra besh baribir nol, va tenglik to'g'ri.", 'Подставь и пятёрку: нуль умножить на пять всё равно нуль, и равенство верное.', 'Try five as well: zero times five is still zero, and the equality holds.') },
        { id: 'c', tag: 'Z4', label: L("Bittasi ham yo'q", 'Ни одного', 'None'), hint: L("Bitta sonni qo'yib ko'ring: ikkala tomon ham nol chiqadi.", 'Подставь хоть одно число: обе части выйдут нулём.', 'Substitute even one number: both sides come out zero.') },
        { id: 'd', tag: 'Z5', label: L('Bitta, bir', 'Одно, единица', 'One, the number one'), hint: L("Bir ham yaraydi, lekin faqat u emas. Boshqa sonlarni ham sinab ko'ring.", 'Единица подходит, но не только она. Попробуй и другие числа.', 'One does fit, but not only it. Try other numbers too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Tenglamada amal qayerga qo'llanadi?", 'Куда применяют действие в уравнении?', 'Where is an operation applied in an equation?'),
      ok: L("Ikkala tomonga birdan, boshqacha bo'lsa tenglik buziladi.", 'Сразу к обеим частям, иначе равенство ломается.', 'To both sides at once, otherwise the equality breaks.'),
      items: [
        { id: 'a', correct: true, label: L('Ikkala tomonga birdan', 'Сразу к обеим частям', 'To both sides at once') },
        { id: 'b', tag: 'Z1', label: L('Harf turgan tomonga', 'К той части, где буква', 'To the side with the letter'), hint: L("Xukda aynan shu xato bo'lgandi: javob to'qqiz chiqib, tekshirishda o'n uch bergandi.", 'На хуке была ровно эта ошибка: ответ вышел девять, а проверка дала тринадцать.', 'That was exactly the hook mistake: the answer came out nine and the check gave thirteen.') },
        { id: 'c', tag: 'Z1', label: L("Son turgan tomonga", 'К той части, где число', 'To the side with the number'), hint: L("Bitta tomonni o'zgartirsak, tenglik buziladi. Ikkala tomon birga o'zgaradi.", 'Если менять одну часть, равенство ломается. Обе части меняются вместе.', 'Change one side and the equality breaks. Both sides change together.') },
        { id: 'd', tag: 'Z1', label: L("Qayerga qulay bo'lsa", 'Куда удобнее', 'Wherever is handier'), hint: L("Qulaylik amalni TANLASHDA bor, uni QAYERGA qo'llashda emas.", 'Удобство есть в ВЫБОРЕ действия, а не в том, КУДА его применить.', 'Convenience is in CHOOSING the operation, not in WHERE to apply it.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi. Bu safar ko'paytuvchi.", 'Второй. На этот раз множитель.', 'Second. This time a factor.'),
    A('2', "Uchinchisi. Uchinchi holat.", 'Третий. Третий случай.', 'Third. The third case.'),
    A('3', "Oxirgisi so'z bilan.", 'Последний вопрос словами.', 'The last one is in words.'),
  ],
}

function Screen14({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S14.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const resRef = useRef([])
  const total = S14.items.length
  return (
    <Frame meta={S14} screen={screen} audio={audio} solved={done} {...rest}>
      <ProbeChain
        audio={audio}
        items={S14.items}
        question={S14.question}
        cols={2}
        disabled={!canAnswer}
        onStep={(i) => audio.step(String(i))}
        onItem={(r) => { resRef.current = resRef.current.concat(r) }}
        onSolved={(r) => {
          const list = resRef.current
          const firstTry = list.filter((x) => x.attempts === 1).length
          setDone(true)
          onAnswer({ ...r, screen, role: 'blitz', scored: true, total, firstTry, level: levelOf(firstTry, total) })
        }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika ham, yangi savol ham YO'Q (§4.2).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Amal ikkala tomonga ketadi", 'Действие идёт к обеим частям', 'The operation goes to both sides'),
  gate: S1.gate,
  fix: {
    tokens: ['x', '=', '5'],
    value: '9',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Endi to'rtlik ikkala tomondan ayirildi, va ildiz besh chiqdi. Ikkala tablo bitta sonni ko'rsatadi.",
    'Теперь четвёрку вычли из обеих частей, и корень вышел пять. Оба табло показывают одно число.',
    'Now the four was taken from both sides and the root came out five. Both boards show one number.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    both: L("biri faqat chapdan ayirdi", 'один вычел только слева', 'one took it from the left only'),
    order: L('boshqa tartibda hisoblagan', 'считал в другом порядке', 'counted in a different order'),
    both_ok: L('ikkalasi ham to\'g\'ri', 'оба верны', 'both are right'),
    noroot: L("ildiz bitta emas", 'корень не один', 'more than one root'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['x + 4 = 9 → x = 5', '5x = 20 → x = 4', '2x + 3 = 11 → x = 4', '0 · x = 5  ≠'],
  twoLabel: L('Uch holat', 'Три случая', 'Three cases'),
  twoA: 'ax = b,  a ≠ 0  →  x = b : a',
  twoB: '0 · x = 0  |  0 · x = 5',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "hadlarni bir tomondan ikkinchisiga ko'chirish",
    'перенос слагаемых из одной части в другую',
    'moving terms from one side to the other',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "Tarozining butun ma'nosi shu: amal ikkala tomonga birdan ketadi, shuning uchun tenglik buzilmaydi.", 'Весь смысл весов в этом: действие идёт сразу к обеим частям, поэтому равенство не ломается.', 'That is the whole point of the balance: the operation goes to both sides at once, so the equality never breaks.'),
    A('mount', "Keyingi darsda hadlarni bir tomondan ikkinchisiga ko'chirishni o'rganamiz.", 'В следующем уроке научимся переносить слагаемые из одной части в другую.', 'In the next lesson we learn to move terms from one side to the other.'),
  ],
}

function Screen15({ screen, answers, ...rest }) {
  const t = useT()
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S15.audio, lang), [lang])
  const audio = useAudio(segments)

  const tags = uniqueTags(answers)
  const hook = (answers || []).find((a) => a && a.role === 'hook')
  const predict = hook && hook.picked ? S15.predictMap[hook.picked] : null

  const named = tags.slice(0, 2).map((code) => t(TAGS[code])).join(', ')
  const more = tags.length - 2
  const gapLine = tags.length
    ? t(S15.gapPrefix) + ': ' + named + (more > 0 ? ', ' + t(S15.moreGaps) + ' ' + more : '')
    : t(S15.noGap)

  const onFix = useCallback(() => { audio.say(t(S15.fixSay)) }, [audio, t])

  return (
    <Frame meta={S15} screen={screen} audio={audio} solved {...rest}>
      <TwoRoutes source={S15.gate.source} rows={S15.gate.rows} fix={{ ...S15.fix, onFix }} />

      <HistoryTape items={S15.chips} label={S15.tapeLabel} />

      <div className="g7-sumcards g7-sumcards-one">
        <div className="g7-sumcard">
          <p className="g7-sumcard-h">{t(S15.twoLabel)}</p>
          <span className="g7-sumtwo-line"><Fx>{t(S15.twoA)}</Fx></span>
          <span className="g7-sumtwo-line"><Fx>{t(S15.twoB)}</Fx></span>
          <p className="g7-sumcard-note">
            <b>{t(S15.predictLabel)}:</b> {predict ? t(predict) : t(S15.noAnswer)}
          </p>
          <p className="g7-sumcard-note">
            <b>{t(S15.nextLabel)}:</b> {t(S15.nextTopic)}
          </p>
          <p className="g7-sumcard-note g7-readyline">{gapLine}</p>
        </div>
      </div>
    </Frame>
  )
}

// ============================================================
// ILDIZ KOMPONENT
// ============================================================
const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
  Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default function Grade7Dars08({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  aiGradingEndpoint,
  onFinished,
}) {
  const initial = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz'
  const [lang, setLang] = useState(initial)
  useEffect(() => {
    if (langProp === 'uz' || langProp === 'ru' || langProp === 'en') setLang(langProp)
  }, [langProp])
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: studentName || '',
    voiceGender: voiceGender || 'm',
    lessonId: LESSON_ID,
    lessonNo: LESSON_NO,
    freeNav: true,
  })
  useMobileZoom()

  const [screen, setScreen] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  const onAnswer = useCallback((payload) => { setAnswers((prev) => prev.concat(payload)) }, [])
  const next = useCallback(() => setScreen((s) => Math.min(s + 1, TOTAL - 1)), [])
  const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])

  const finish = useCallback(() => {
    setFinished(true)
    const blitz = answers.find((a) => a && a.role === 'blitz')
    const total = blitz ? blitz.total : 0
    const firstTry = blitz ? blitz.firstTry : 0
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(LESSON_TITLE, lang),
      lang,
      completed: true,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      totalQuestions: total,
      correctAnswers: firstTry,
      firstTryStats: { total, firstTryCorrect: firstTry },
      level: blitz ? blitz.level : 'none',
      tags: uniqueTags(answers),
      freeNav: getFreeNav(),
      answers,
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade7 Dars08] onFinished', payload)
  }, [answers, lang, onFinished])

  const Current = SCREENS[screen]

  return (
    <LangProvider value={lang}>
      <LangSetProvider value={setLang}>
        <style>{STYLES}</style>
        <div className={'lesson-root' + (screen === 7 ? ' is-rule' : '')} lang={lang}>
          <Current
            screen={screen}
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
