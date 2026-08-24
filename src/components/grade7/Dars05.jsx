// ============================================================================
// 7-sinf, Dars 5. QAVSLARNI OCHISH QOIDASI. (Раскрытие скобок)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// Namuna: Dars01.jsx (sinf ETALONI), Dars02.jsx, Dars03.jsx.
// Bu faylda FAQAT MA'LUMOT bor.
//
// DIQQAT, §1.3. Qavs oldidagi ISHORA va qavs oldidagi KO'PAYTUVCHI -- IKKI
// XIL holat, va dars ularni QO'SHIB YUBORMAYDI. Ko'paytuvchi 3-darsda
// (taqsimot xossasi) ko'rilgan. Bu darsda faqat ISHORA: qo'shuv yoki ayiruv.
// Shuning uchun bu darsda «taqsimot xossasi» degan gap YO'Q.
//
// DARSNING G'OYASI. Minus qavsni O'CHIRMAYDI, u qavs ichidagi HAR BIR
// qo'shiluvchining ishorasini ag'daradi. Eng qimmat xato -- faqat
// birinchisini ag'darish.
//
// 2-QOIDA UNUTILMAYDI: qavs ichidagi birinchi qo'shiluvchi ishorasiz
// yozilsa, uning oldida qo'shuv turgan hisoblanadi. Usiz o'quvchi
// qavs ichidagi birinchi sonni manfiy deb o'qiydi.
//
// METODIST QARORLARI 2026-08-15 (§3.4, §3.5): darslikka havola YO'Q.
//
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
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
  TwoRoutes,
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SignFlipDemo,
  SlotFill,
  StairsReveal,
  SubstituteRows,
  Transform,
} from './tools.jsx'

const LESSON_ID = 'alg_7_05'
const LESSON_TITLE = L('Qavslarni ochish qoidasi', 'Раскрытие скобок', 'Removing brackets')
const LESSON_NO = L('5-dars', 'Урок 5', 'Lesson 5')
const TOTAL = 15

const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 5 }

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
  Z1: L("qo'shuv oldidagi qavs ham ishorani ag'daradi", 'плюс перед скобкой тоже меняет знаки', 'a plus before a bracket also flips signs'),
  Z2: L('minus faqat birinchi qo\'shiluvchiga tegdi', 'минус дошёл только до первого слагаемого', 'the minus reached only the first term'),
  Z3: L('ishorasiz birinchi qo\'shiluvchi manfiy deb o\'qildi', 'первое слагаемое без знака прочитано как отрицательное', 'an unsigned first term was read as negative'),
  Z4: L("qavs shunchaki o'chirildi", 'скобку просто стёрли', 'the bracket was just erased'),
  Z5: L('ishora ko\'paytuvchi bilan chalkashdi', 'знак спутан с множителем', 'the sign was mistaken for a factor'),
  Z6: L('tenglik son bilan tekshirilmadi', 'равенство не проверено числом', 'the equality was not checked with a number'),
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

const ASK_VALUE = L('Qiymati nechaga teng?', 'Чему равно значение?', 'What is the value?')
const ASK_SIGNS = L(
  "Qavsni oching: bo'sh kataklarga ishoralarni qo'ying.",
  'Раскрой скобку: поставь знаки в пустые клетки.',
  'Remove the bracket: put the signs into the empty boxes.',
)

const ACTIONS = [
  { id: 'bracket', label: L('Qavs ichidagini hisoblash', 'Посчитать в скобках', 'Do what is inside the brackets') },
  { id: 'stage2', label: L('Ikkinchi bosqich amali', 'Действие второй ступени', 'A second-stage operation') },
  { id: 'stage1', label: L('Birinchi bosqich amali', 'Действие первой ступени', 'A first-stage operation') },
]

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
// EKRAN 1. XUK. Bitta qavs ikki xil ochildi va ikki xil son berdi.
// Baholanmaydi, teg ham yozmaydi.
// ============================================================
const S1 = {
  eyebrow: L('QAVSLARNI OCHISH', 'РАСКРЫТИЕ СКОБОК', 'REMOVING BRACKETS'),
  noBack: true,
  noNotes: true,
  title: L('Bitta qavs, ikki javob', 'Одна скобка, два ответа', 'One bracket, two answers'),
  // XUK SAHNASI (metodist talabi 2026-08-15): 1-darsdagi kabi -- bitta
  // manba, ikki yo'l, ikki tablo, ular orasida halqa. Ikkita oq kartochka
  // sinf etalonidan past edi.
  gate: {
    source: { kind: 'gate', outer: '12', sign: '−', inner: ['5', '+', '3'] },
    rows: [
      { tokens: ['12', '−', '5', '+', '3'], value: '10' },
      { tokens: ['12', '−', '5', '−', '3'], value: '4' },
    ],
  },
  probe: {
    question: L("Ikki o'quvchi 12 − (5 + 3) yozuvidan qavsni oldi. Kim to'g'ri qildi?", 'Два ученика сняли скобку в записи 12 − (5 + 3). Кто сделал верно?', 'Two students removed the bracket in 12 − (5 + 3). Who did it right?'),
    items: [
      {
        id: 'flip',
        // Variant KARTOCHKAGA tayanadi, o'quvchining NOMERIGA emas: ekranda
        // ular raqamlanmagan, va «birinchisi» degan so'z hech nimaga
        // ulanmasdi (surat 2026-08-15).
        label: L("To'rt chiqqani: minus har bir sonning ishorasini ag'dardi", 'Тот, где вышло четыре: минус поменял знак у каждого числа', 'The one that gave four: the minus flipped every sign'),
        hint: L(
          "Taxminingiz qabul qilindi. Uni qavsni hisoblab tekshiramiz.",
          'Прогноз принят. Проверим его, посчитав скобку.',
          'Your prediction is taken. We will check it by working the bracket out.',
        ),
      },
      {
        id: 'erase',
        label: L("O'n chiqqani: qavs o'chirildi, qolgani joyida qoldi", 'Тот, где вышло десять: скобку стёрли, остальное осталось', 'The one that gave ten: the bracket was erased'),
        hint: L(
          "Qavs ichidagini hisoblang: 5 qo'shuv 3 bu 8, keyin 12 dan 8 ni ayiring. Bu ikki javobdan qaysi biri chiqdi?",
          'Посчитай скобку: 5 плюс 3 это 8, потом из 12 вычти 8. Какой из двух ответов получился?',
          'Work the bracket out: 5 plus 3 is 8, then take 8 from 12. Which of the two answers came out?',
        ),
      },
      {
        id: 'first',
        label: L("Minus faqat beshlikka tegishli edi", 'Минус относился только к пятёрке', 'The minus belonged to the five only'),
        hint: L(
          "Qavs ichida ikkita son bor, va minus qavsning oldida turibdi, beshlikning oldida emas. Qavsni hisoblab tekshiring.",
          'В скобке два числа, и минус стоит перед скобкой, а не перед пятёркой. Проверь, посчитав скобку.',
          'The bracket holds two numbers, and the minus stands before the bracket, not before the five. Check by working the bracket out.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkalasi ham to'g'ri, yozuv noaniq", 'Оба верны, запись неоднозначная', 'Both are right, the expression is ambiguous'),
        hint: L(
          "Qavs ichidagini hisoblang va butun yozuvning qiymatini toping. U bitta chiqadi, demak javob ham bitta.",
          'Посчитай скобку и найди значение всей записи. Оно одно, значит и ответ один.',
          'Work the bracket out and find the value of the whole expression. It is one, so there is one answer.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bugungi mavzu qavslarni ochish. O'n ikki ayirish qavs besh qo'shuv uch qavs yopildi.", 'Сегодня тема урока раскрытие скобок. Двенадцать минус скобка пять плюс три скобка закрылась.', 'Today the topic is removing brackets. Twelve minus bracket five plus three bracket closed.'),
    A('mount', "Birinchi o'quvchi qavsni shunchaki o'chirdi va o'n ikki ayirish besh qo'shuv uch deb yozdi. Unda o'n chiqdi.", 'Первый ученик просто стёр скобку и записал двенадцать минус пять плюс три. У него вышло десять.', 'The first student just erased the bracket and wrote twelve minus five plus three. They got ten.'),
    A('mount', "Ikkinchisi o'n ikki ayirish besh ayirish uch deb yozdi va to'rt oldi.", 'Второй записал двенадцать минус пять минус три и получил четыре.', 'The second wrote twelve minus five minus three and got four.'),
    A('mount', "Yozuv bitta, javob esa ikkita. Bittasi noto'g'ri.", 'Запись одна, а ответа два. Один из них неверен.', 'One expression, two answers. One of them is wrong.'),
    A('mount', "Sizningcha kim to'g'ri qildi. Javobni tanlang, bu taxmin, uning uchun baho yo'q.", 'Как думаешь, кто сделал верно. Выбери ответ, это прогноз, оценки за него нет.', 'Who do you think got it right. Pick an answer, this is a prediction, it is not graded.'),
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
// EKRAN 2. TAYANCH. Uchtasi ham 6-sinfdan va hech biri MASHQNI
// takrorlamaydi: mashqda qavs ochiladi, bu yerda qavs umuman yo'q.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta narsa oltinchi sinfdan', 'Три вещи из шестого класса', 'Three things from grade six'),
  question: ASK_VALUE,
  items: [
    {
      prompt: '9 − 14',
      ok: L("Manfiy son. Ayiriladigan son kattaroq bo'lsa, natija noldan kichik.", 'Отрицательное число. Если вычитаемое больше, результат меньше нуля.', 'A negative number. If you take away more than you have, the result is below zero.'),
      items: [
        { id: 'a', label: '−5', correct: true },
        { id: 'b', label: '5', hint: L("Ishorani unutmang. 9 dan 14 ni ayirsak, noldan pastga tushamiz.", 'Не теряй знак. Если из 9 вычесть 14, мы уходим ниже нуля.', 'Do not lose the sign. Taking 14 from 9 goes below zero.') },
        { id: 'c', label: '23', hint: L("23 bu 9 qo'shuv 14. Belgiga qarang, u ayirish.", '23 это 9 плюс 14. Посмотри на знак, он вычитание.', '23 is 9 plus 14. Look at the sign, it is subtraction.') },
        { id: 'd', label: '−23', hint: L("Sonlar qo'shilgan va ishora ham qo'yilgan. Yozuvda esa faqat ayirish bor.", 'Числа сложили и ещё поставили знак. А в записи только вычитание.', 'The numbers were added and a sign was put on top. The expression only has a subtraction.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Minus 7 ga qarama-qarshi son qaysi?", 'Какое число противоположно минус семи?', 'Which number is the opposite of minus seven?'),
      ok: L("Qarama-qarshi son -- o'sha son, faqat ishorasi boshqa.", 'Противоположное число это то же число с другим знаком.', 'The opposite number is the same number with the other sign.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '−7', hint: L("Bu o'sha sonning o'zi. Qarama-qarshisining ishorasi boshqa bo'ladi.", 'Это то же самое число. У противоположного знак другой.', 'That is the same number. The opposite has the other sign.') },
        { id: 'c', label: '0', hint: L("Nol o'ziga qarama-qarshi. Bizga esa minus yettining jufti kerak.", 'Нуль противоположен сам себе. А нам нужна пара к минус семи.', 'Zero is its own opposite. We need the partner of minus seven.') },
        { id: 'd', label: L("1 : 7", '1 : 7', '1 : 7'), hint: L("Bu teskari son, qarama-qarshi emas. Qarama-qarshida faqat ishora almashadi.", 'Это обратное число, а не противоположное. У противоположного меняется только знак.', 'That is the reciprocal, not the opposite. The opposite only changes the sign.') },
      ],
    },
    {
      prompt: '12 − (5 + 3)',
      ok: L("Avval qavs ichidagi, keyin ayirish.", 'Сначала то, что в скобке, потом вычитание.', 'First what is inside the bracket, then the subtraction.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '10', tag: 'Z4', hint: L("10 qavs hisobga olinmaganda chiqadi. Avval 5 qo'shuv 3 ni hisoblang.", '10 получается, если скобку не учитывать. Сначала посчитай 5 плюс 3.', '10 comes out if the bracket is ignored. Work out 5 plus 3 first.') },
        { id: 'c', label: '20', hint: L("20 bu 12 qo'shuv 8. Qavs oldida ayirish turibdi.", '20 это 12 плюс 8. Перед скобкой стоит вычитание.', '20 is 12 plus 8. The sign before the bracket is a subtraction.') },
        { id: 'd', label: '14', hint: L("14 bu 12 qo'shuv 5 ayirish 3. Ikkala ishora ham almashib ketgan.", '14 это 12 плюс 5 минус 3. Оба знака поменялись местами.', '14 is 12 plus 5 minus 3. Both signs got swapped.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzudan oldin uchta narsani eslaymiz. Bu yerda qavs ochilmaydi, faqat hisoblanadi.", 'Прежде чем идти в новую тему, вспомним три вещи. Здесь скобку не раскрывают, её только считают.', 'Before the new topic let us recall three things. No bracket is removed here, only worked out.'),
    A('1', "Ikkinchisi. Qarama-qarshi son haqida.", 'Второе. Про противоположное число.', 'Second. About the opposite number.'),
    A('2', "Uchinchisi. Bu xukdagi o'sha yozuv.", 'Третье. Это та самая запись с хука.', 'Third. This is the very expression from the hook.'),
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
// EKRAN 3. TUSHUNTIRISH 1. MINUS oldidagi qavs. O'quvchi ishoralarni
// O'ZI qo'yadi -- tayyor yozuvdan tanlamaydi (§4.2), demak kvotaga
// kirmaydi.
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Minus oldida turganda', 'Когда впереди минус', 'When a minus stands before it'),
  template: ['12 ', { slot: 0 }, ' 5 ', { slot: 1 }, ' 3'],
  parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
  answer: ['minus', 'minus'],
  prompt: L(
    "12 − (5 + 3). Qavsni oching va ishoralarni qo'ying.",
    '12 − (5 + 3). Раскрой скобку и поставь знаки.',
    '12 − (5 + 3). Remove the bracket and put the signs in.',
  ),
  checkNote: L(
    'Ikkala ishora ham ag\'darildi, va qiymat 4 bo\'lib qoldi',
    'Оба знака перевернулись, и значение осталось равным 4',
    'Both signs flipped, and the value stayed 4',
  ),
  wrongs: [
    { key: 'minus|plus', tag: 'Z2', hint: L("Bu o'n beradi, qavsli yozuv esa to'rt. Minus qavsning oldida turibdi, ya'ni u ichidagi HAMMASIGA tegishli, faqat birinchisiga emas.", 'Это даёт десять, а запись со скобкой даёт четыре. Минус стоит перед скобкой, значит относится ко ВСЕМУ внутри, а не только к первому.', 'That gives ten, while the bracketed expression gives four. The minus stands before the bracket, so it belongs to EVERYTHING inside, not just the first term.') },
    { key: 'plus|plus', tag: 'Z4', hint: L("Bu yigirma beradi. Qavs oldidagi minus yo'qolib qolgan.", 'Это даёт двадцать. Минус перед скобкой потерялся.', 'That gives twenty. The minus before the bracket got lost.') },
    { key: '*', tag: 'Z2', hint: L("Qavs ichidagini hisoblang: 5 qo'shuv 3 bu 8, va 12 dan 8 ni ayirsak 4 chiqadi. Sizning yozuvingiz ham 4 berishi kerak.", 'Посчитай скобку: 5 плюс 3 это 8, и 12 минус 8 будет 4. Твоя запись тоже должна давать 4.', 'Work the bracket out: 5 plus 3 is 8, and 12 minus 8 is 4. Your line has to give 4 as well.') },
  ],
  flip: { before: '− ( 5 + 3 )', pairs: [['5', '−5'], ['+ 3', '− 3']] },
  reward: {
    title: L("Minus qavsni o'chirmaydi", 'Минус не стирает скобку', 'A minus does not erase the bracket'),
    text: L(
      "U qavs ichidagi har bir qo'shiluvchining ishorasini ag'daradi. Birinchisining ham, ikkinchisining ham.",
      'Он переворачивает знак у каждого слагаемого внутри. И у первого, и у второго.',
      'It flips the sign of every term inside. The first one and the second one.',
    ),
  },
  audio: [
    A('mount', "Xukdagi savolga qaytamiz. Qavs ichidagini hisoblasak, butun yozuvning qiymati to'rt.", 'Вернёмся к вопросу с хука. Если посчитать скобку, значение всей записи равно четырём.', 'Back to the hook question. Working the bracket out gives the whole expression the value four.'),
    A('mount', "Endi qavsni oching. Ishoralarni shunday qo'yingki, qiymat o'sha to'rt bo'lib qolsin.", 'Теперь раскрой скобку. Поставь знаки так, чтобы значение осталось тем же, четыре.', 'Now remove the bracket. Put the signs so the value stays the same, four.'),
    A('checked', "Ikkala ishora ham ag'darildi. Minus qavs ichidagi hammasiga tegdi.", 'Оба знака перевернулись. Минус дошёл до всего, что было внутри.', 'Both signs flipped. The minus reached everything that was inside.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [run, setRun] = useState(0)
  return (
    <Frame meta={S3} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S3.template}
        parts={S3.parts}
        answer={S3.answer}
        prompt={S3.prompt}
        checkNote={S3.checkNote}
        wrongs={S3.wrongs}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); setRun(1); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {/* Namoyish javobdan KEYIN: ishoralar birma-bir ag'dariladi.
          Javobdan oldin ko'rsatilsa, u javobni aytib qo'yardi (§8.1). */}
      {done ? <SignFlipDemo before={S3.flip.before} pairs={S3.flip.pairs} run={run} /> : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: qo'shuv oldida turganda ishoralar
// O'ZGARMAYDI. Bu darsning ikkinchi yarmi, va aynan shu yerda ko'p
// o'quvchi «qavs har doim ishorani ag'daradi» deb yanglishadi.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Qo'shuv oldida turganda", 'Когда впереди плюс', 'When a plus stands before it'),
  template: ['12 ', { slot: 0 }, ' 5 ', { slot: 1 }, ' 3'],
  parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
  answer: ['plus', 'minus'],
  prompt: L(
    "12 + (5 − 3). Qavsni oching va ishoralarni qo'ying.",
    '12 + (5 − 3). Раскрой скобку и поставь знаки.',
    '12 + (5 − 3). Remove the bracket and put the signs in.',
  ),
  checkNote: L(
    'Ishoralar o\'zgarmadi, va qiymat 14 bo\'lib qoldi',
    'Знаки не изменились, и значение осталось равным 14',
    'The signs did not change, and the value stayed 14',
  ),
  wrongs: [
    { key: 'minus|plus', tag: 'Z1', hint: L("Ikkala ishora ham ag'darilgan. Lekin qavs oldida qo'shuv turibdi, minus emas. Qavs ichidagini hisoblang: 5 ayirish 3 bu 2, va 12 qo'shuv 2 bu 14.", 'Оба знака перевернулись. Но перед скобкой стоит плюс, а не минус. Посчитай скобку: 5 минус 3 это 2, и 12 плюс 2 будет 14.', 'Both signs flipped. But the sign before the bracket is a plus, not a minus. Work the bracket out: 5 minus 3 is 2, and 12 plus 2 is 14.') },
    { key: 'minus|minus', tag: 'Z1', hint: L("Bu to'rt beradi, kerakli qiymat esa o'n to'rt. Qavs oldidagi ishoraga yana bir bor qarang.", 'Это даёт четыре, а нужное значение четырнадцать. Посмотри ещё раз на знак перед скобкой.', 'That gives four, and the value we need is fourteen. Look at the sign before the bracket again.') },
    { key: '*', tag: 'Z1', hint: L("Qo'shuv oldida turganda ichidagi ishoralar o'zgarmaydi. Ular qanday yozilgan bo'lsa, shundayligicha ko'chadi.", 'Когда впереди плюс, знаки внутри не меняются. Они переезжают такими, какими были записаны.', 'When a plus stands before it, the signs inside do not change. They move across as they were written.') },
  ],
  reward: {
    title: L("Ikki holat, ikki xil ish", 'Два случая, две разные работы', 'Two cases, two different jobs'),
    text: L(
      "Qavs oldidagi minus ishoralarni ag'daradi. Qo'shuv esa hech nimani o'zgartirmaydi, u qavsni shunchaki ochadi.",
      'Минус перед скобкой переворачивает знаки. Плюс не меняет ничего, он просто открывает скобку.',
      'A minus before a bracket flips the signs. A plus changes nothing, it simply opens the bracket.',
    ),
  },
  audio: [
    A('mount', "Endi o'sha sonlar, lekin qavs oldida qo'shuv turibdi.", 'Теперь те же числа, но перед скобкой стоит плюс.', 'Now the same numbers, but a plus stands before the bracket.'),
    A('mount', "Qavsni oching. Diqqat qiling, bu safar ish boshqacha.", 'Раскрой скобку. Обрати внимание, на этот раз работа другая.', 'Remove the bracket. Note that this time the job is different.'),
    A('checked', "Ishoralar o'zgarmadi. Qo'shuv oldida turganda qavs shunchaki ochiladi.", 'Знаки не изменились. Когда впереди плюс, скобка просто открывается.', 'The signs did not change. When a plus stands before it, the bracket simply opens.'),
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
      <SlotFill
        audio={audio}
        template={S4.template}
        parts={S4.parts}
        answer={S4.answer}
        prompt={S4.prompt}
        checkNote={S4.checkNote}
        wrongs={S4.wrongs}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. O'SHA g'oya HARFLAR bilan. Sonlar ketdi --
// qoladigan narsa faqat ISHORALARNING ishi.
// ============================================================
const S5 = {
  eyebrow: L('HARFLAR BILAN', 'НА БУКВАХ', 'WITH LETTERS'),
  title: L("Sonlarsiz ham o'sha ish", 'Без чисел работа та же', 'Without numbers the job is the same'),
  template: ['a ', { slot: 0 }, ' b ', { slot: 1 }, ' c'],
  parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
  answer: ['minus', 'plus'],
  prompt: L(
    "a − (b − c). Qavsni oching va ishoralarni qo'ying.",
    'a − (b − c). Раскрой скобку и поставь знаки.',
    'a − (b − c). Remove the bracket and put the signs in.',
  ),
  checkNote: L(
    'Har ikkala ishora ag\'darildi: qo\'shuv minusga, minus qo\'shuvga',
    'Оба знака перевернулись: плюс стал минусом, минус стал плюсом',
    'Both signs flipped: the plus became a minus, the minus became a plus',
  ),
  wrongs: [
    { key: 'minus|minus', tag: 'Z2', hint: L("Ikkinchi ishora ag'darilmadi. Qavs ichida u minus edi, demak tashqarida qo'shuv bo'lishi kerak.", 'Второй знак не перевернулся. Внутри скобки он был минусом, значит снаружи должен стать плюсом.', 'The second sign did not flip. Inside the bracket it was a minus, so outside it has to become a plus.') },
    { key: 'plus|minus', tag: 'Z4', hint: L("Hech narsa o'zgarmadi, ya'ni qavs shunchaki o'chirilgan. Uning oldida esa minus turibdi.", 'Ничего не изменилось, то есть скобку просто стёрли. А перед ней стоит минус.', 'Nothing changed, the bracket was just erased. But there is a minus before it.') },
    { key: '*', tag: 'Z2', hint: L("Harflar o'rniga son qo'yib ko'ring: a teng 10, b teng 4, c teng 1. Qavsli yozuv 7 beradi, sizniki ham 7 berishi kerak.", 'Подставь числа: a равно 10, b равно 4, c равно 1. Запись со скобкой даёт 7, твоя тоже должна дать 7.', 'Substitute numbers: a is 10, b is 4, c is 1. The bracketed expression gives 7, and yours has to give 7 too.') },
  ],
  flip: { before: '− ( b − c )', pairs: [['b', '−b'], ['− c', '+ c']] },
  reward: {
    title: L("Harf ham son kabi", 'Буква ведёт себя как число', 'A letter behaves like a number'),
    text: L(
      "Ishoralarning ishi qavs ichida nima turganiga bog'liq emas. Son ham, harf ham bir xil ag'dariladi.",
      'Работа знаков не зависит от того, что стоит в скобке. И число, и буква переворачиваются одинаково.',
      'What the signs do does not depend on what is inside. A number and a letter flip the same way.',
    ),
  },
  audio: [
    A('mount', "Endi sonlar o'rniga harflar. Ish esa o'zgarmaydi.", 'Теперь вместо чисел буквы. А работа не меняется.', 'Now letters instead of numbers. The job stays the same.'),
    A('mount', "Qavsni oching. Ikkala ishorani ham ko'rib chiqing.", 'Раскрой скобку. Посмотри на оба знака.', 'Remove the bracket. Look at both signs.'),
    A('checked', "Qo'shuv minusga aylandi, minus esa qo'shuvga. Har biri o'z qarama-qarshisiga o'tdi.", 'Плюс стал минусом, а минус стал плюсом. Каждый перешёл в свою противоположность.', 'The plus became a minus and the minus became a plus. Each turned into its opposite.'),
  ],
}

function Screen5({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S5.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  const [run, setRun] = useState(0)
  return (
    <Frame meta={S5} screen={screen} audio={audio} solved={done} {...rest}>
      <SlotFill
        audio={audio}
        template={S5.template}
        parts={S5.parts}
        answer={S5.answer}
        prompt={S5.prompt}
        checkNote={S5.checkNote}
        wrongs={S5.wrongs}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); setRun(1); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
      {done ? <SignFlipDemo before={S5.flip.before} pairs={S5.flip.pairs} run={run} /> : null}
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ: UCHTA qo'shiluvchi va BIRINCHISI
// ISHORASIZ. Ishorasiz yozilgan birinchi qo'shiluvchi oldida qo'shuv
// turgan hisoblanadi -- shusiz o'quvchi uni manfiy deb o'qiydi.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Birinchisi ishorasiz turibdi", 'Первое стоит без знака', 'The first one has no sign'),
  template: ['100 ', { slot: 0 }, ' 20 ', { slot: 1 }, ' 30 ', { slot: 2 }, ' 10'],
  parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
  answer: ['minus', 'minus', 'plus'],
  prompt: L(
    "100 − (20 + 30 − 10). Qavsni oching. Diqqat: 20 ishorasiz yozilgan.",
    '100 − (20 + 30 − 10). Раскрой скобку. Внимание: 20 записано без знака.',
    '100 − (20 + 30 − 10). Remove the bracket. Note: the 20 is written with no sign.',
  ),
  checkNote: L(
    'Uchala ishora ham ag\'darildi, va qiymat 60 bo\'lib qoldi',
    'Все три знака перевернулись, и значение осталось равным 60',
    'All three signs flipped, and the value stayed 60',
  ),
  wrongs: [
    { key: 'plus|minus|plus', tag: 'Z3', hint: L("Birinchi qo'shiluvchi ishorasiz yozilgan, va bu qo'shuv degani, minus emas. Demak u ham ag'dariladi.", 'Первое слагаемое записано без знака, а это значит плюс, а не минус. Значит оно тоже переворачивается.', 'The first term is written with no sign, and that means a plus, not a minus. So it flips as well.') },
    { key: 'minus|plus|minus', tag: 'Z2', hint: L("Faqat birinchi ishora ag'darilgan. Minus qavs ichidagi HAMMASIGA tegishli.", 'Перевернулся только первый знак. Минус относится ко ВСЕМУ внутри скобки.', 'Only the first sign flipped. The minus belongs to EVERYTHING inside the bracket.') },
    { key: '*', tag: 'Z2', hint: L("Qavs ichidagini hisoblang: 20 qo'shuv 30 ayirish 10 bu 40, va 100 dan 40 ni ayirsak 60 chiqadi. Sizning qatoringiz ham 60 berishi kerak.", 'Посчитай скобку: 20 плюс 30 минус 10 это 40, и 100 минус 40 будет 60. Твоя строка тоже должна дать 60.', 'Work the bracket out: 20 plus 30 minus 10 is 40, and 100 minus 40 is 60. Your line has to give 60 too.') },
  ],
  audio: [
    A('mount', "Endi qavs ichida uchta qo'shiluvchi, va birinchisining oldida hech qanday ishora yo'q.", 'Теперь в скобке три слагаемых, и перед первым нет никакого знака.', 'Now the bracket holds three terms, and the first one has no sign before it.'),
    A('mount', "Ishorasiz yozilgan qo'shiluvchi oldida qo'shuv turgan hisoblanadi. Buni yodda tuting va qavsni oching.", 'Слагаемое без знака считается со знаком плюс. Помни это и раскрой скобку.', 'A term with no sign counts as having a plus. Keep that in mind and remove the bracket.'),
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
      <SlotFill
        audio={audio}
        template={S6.template}
        parts={S6.parts}
        answer={S6.answer}
        prompt={S6.prompt}
        checkNote={S6.checkNote}
        wrongs={S6.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT va YILNING QIMMAT XATOSI:
// minus qavs oldida yolg'iz turganda. Avval savol, isbot KEYIN (§8.1).
// KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Minus yolg'iz turganda", 'Когда минус стоит один', 'When the minus stands alone'),
  numbers: [10],
  rows: [
    { id: 'right', expr: '−(a − 7)', sub: () => '−(10 − 7)', val: () => -3 },
    { id: 'wrong', expr: '−a − 7', sub: () => '−10 − 7', val: () => -17 },
  ],
  probe: {
    question: L("a teng 10 bo'lganda −(a − 7) nechaga teng?", 'Чему равно −(a − 7) при a = 10?', 'What is −(a − 7) when a = 10?'),
    items: [
      { id: 'a', label: '−3', correct: true },
      { id: 'b', label: '−17', tag: 'Z2', hint: L("Minus faqat a ga tegdi, yettilikka yetib bormadi. Qavs ichida ikkita qo'shiluvchi bor.", 'Минус дошёл только до a, до семёрки не добрался. В скобке два слагаемых.', 'The minus reached only the a, never the seven. The bracket holds two terms.') },
      { id: 'c', label: '3', tag: 'Z4', hint: L("Bu qavs ichidagining o'zi, minussiz. Qavs oldidagi minus yo'qolib qolgan.", 'Это то, что внутри скобки, без минуса. Минус перед скобкой потерялся.', 'That is what is inside the bracket, without the minus. The minus before it got lost.') },
      { id: 'd', label: '17', tag: 'Z2', hint: L("Ikkala son ham qo'shilgan. Qavs ichida esa ular orasida ayirish turibdi.", 'Оба числа сложены. А в скобке между ними стоит вычитание.', 'Both numbers were added. But inside the bracket there is a subtraction between them.') },
    ],
  },
  okText: L(
    "Qavs oldida yolg'iz turgan minus ham xuddi shunday ishlaydi: ichidagi har bir qo'shiluvchining ishorasini ag'daradi.",
    'Минус, стоящий перед скобкой один, работает так же: переворачивает знак каждого слагаемого внутри.',
    'A minus standing alone before a bracket works the same way: it flips the sign of every term inside.',
  ),
  audio: [
    A('mount', "Endi qavs oldida minusdan boshqa hech nima yo'q. Avval javob bering, keyin son bilan tekshiramiz.", 'Теперь перед скобкой нет ничего, кроме минуса. Сначала ответь, потом проверим числом.', 'Now there is nothing but a minus before the bracket. Answer first, then we check with a number.'),
    A('row1', "Ikkita yozuvni yonma-yon qo'yamiz va ikkalasiga ham o'nni qo'yamiz.", 'Поставим две записи рядом и подставим в обе десятку.', 'Let us put the two expressions side by side and substitute ten into both.'),
    A('row2', "Minus uch va minus o'n yetti. Sonlar farq qildi, demak bu ikki xil yozuv.", 'Минус три и минус семнадцать. Числа разошлись, значит это разные записи.', 'Minus three and minus seventeen. The numbers differ, so these are different expressions.'),
  ],
}

function Screen7({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S7.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
  return (
    <Frame meta={S7} screen={screen} audio={audio} solved={done} {...rest}>
      <SubstituteRows
        audio={audio}
        rows={S7.rows}
        numbers={S7.numbers}
        askFirst
        letter="a"
        question={S7.probe.question}
        options={S7.probe.items}
        okText={S7.okText}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
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
    { id: 'f1', label: L("qavs oldidagi ishoraga qarang", 'посмотри на знак перед скобкой', 'look at the sign before the bracket') },
    { id: 'f2', label: L("qo'shuv bo'lsa, ichidagi ishoralar o'zgarmaydi", 'если плюс, знаки внутри не меняются', 'if it is a plus, the signs inside stay') },
    { id: 'f3', label: L("minus bo'lsa, har bir ishora qarama-qarshisiga o'zgaradi", 'если минус, каждый знак меняется на противоположный', 'if it is a minus, every sign turns into its opposite') },
    { id: 'f4', label: L("ishorasiz yozilgan birinchi qo'shiluvchi oldida qo'shuv turgan hisoblanadi", 'слагаемое без знака считается со знаком плюс', 'a term with no sign counts as having a plus') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Birinchi qadam har doim bitta: qavs oldida nima turganini ko'rish.",
    'Порядок нарушен. Первый шаг всегда один: посмотреть, что стоит перед скобкой.',
    'The order is off. The first step is always the same: see what stands before the bracket.',
  ),
  lawChips: [
    { label: '+ ( )', tone: 's1' },
    { label: '= ', tone: 'off' },
    { label: '− ( )', tone: 's2' },
    { label: '↺', tone: 'par' },
  ],
  lawSweep: L(
    "qo'shuv saqlaydi, minus ag'daradi",
    'плюс сохраняет, минус переворачивает',
    'a plus keeps, a minus flips',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Qavs oldida qo'shuv tursa, qavs olib tashlanadi va ichidagi qo'shiluvchilarning ishoralari o'zgarmaydi.",
        'Если перед скобкой стоит знак плюс, скобку убирают, не меняя знаки слагаемых внутри скобки.',
        'If a plus stands before the bracket, the bracket is removed without changing the signs of the terms inside.',
      ),
      L(
        "Qavs oldida minus tursa, qavs tushiriladi va ichidagi har bir qo'shiluvchining ishorasi qarama-qarshisiga o'zgartiriladi.",
        'Если перед скобкой стоит знак минус, скобки опускают, изменив знак каждого слагаемого внутри скобки на противоположный.',
        'If a minus stands before the bracket, the brackets are dropped and the sign of every term inside is changed to its opposite.',
      ),
    ],
  },
  hookCap: L("Qavs o'chmaydi, u ishoralarni topshiradi", 'Скобка не стирается, она передаёт знаки', 'A bracket is not erased, it hands the signs over'),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("qo'shuv -- ishoralar o'sha-o'sha", 'плюс — знаки те же', 'plus keeps the signs'),
    L("minus -- har biri ag'dariladi", 'минус — каждый переворачивается', 'minus flips each one'),
    L("ishorasiz -- demak qo'shuv", 'без знака — значит плюс', 'no sign means a plus'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik. Endi qoidani so'z bilan yig'amiz.", 'Все случаи мы увидели. Теперь соберём правило словами.', 'We have seen all the cases. Now let us put the rule into words.'),
    A('mount', "Bo'laklarni to'g'ri tartibda joylashtiring.", 'Разложи фрагменты в верном порядке.', 'Put the pieces in the right order.'),
    A('ok', "To'g'ri. Oxirgi qator eng ko'p unutiladigan narsani aytadi.", 'Верно. Последняя строка говорит о том, что забывают чаще всего.', 'Correct. The last line names what gets forgotten most often.'),
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
// EKRAN 9. MASHQ 1. Uchtasi bir turdagi: qavs oldidagi ishorani
// o'qish va ishoralarni qo'yish.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchalasida ham birinchi qadam bir xil edi: qavs oldiga qarash. Qolgani shundan kelib chiqadi.",
      'Во всех трёх первый шаг был один и тот же: посмотреть, что перед скобкой. Остальное следует из этого.',
      'In all three the first step was the same: look at what stands before the bracket. The rest follows.',
    ),
  },
  rounds: [
    {
      template: ['a ', { slot: 0 }, ' b ', { slot: 1 }, ' 5'],
      parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
      answer: ['plus', 'minus'],
      prompt: L("a + (b − 5). Qavsni oching.", 'a + (b − 5). Раскрой скобку.', 'a + (b − 5). Remove the bracket.'),
      checkNote: L("Qo'shuv oldida turibdi, ishoralar o'zgarmadi", 'Впереди плюс, знаки не изменились', 'A plus stands before it, the signs stayed'),
      wrongs: [
        { key: 'minus|plus', tag: 'Z1', hint: L("Ishoralar ag'darilgan, lekin qavs oldida qo'shuv turibdi.", 'Знаки перевернулись, но перед скобкой стоит плюс.', 'The signs flipped, but the sign before the bracket is a plus.') },
        { key: '*', tag: 'Z1', hint: L("Qavs oldiga qarang. U qo'shuvmi yoki minusmi?", 'Посмотри на знак перед скобкой. Это плюс или минус?', 'Look at the sign before the bracket. Is it a plus or a minus?') },
      ],
    },
    {
      template: ['c ', { slot: 0 }, ' d ', { slot: 1 }, ' 4'],
      parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
      answer: ['minus', 'plus'],
      prompt: L("c − (d − 4). Qavsni oching.", 'c − (d − 4). Раскрой скобку.', 'c − (d − 4). Remove the bracket.'),
      checkNote: L('Minus oldida turibdi, ikkala ishora ham ag\'darildi', 'Впереди минус, оба знака перевернулись', 'A minus stands before it, both signs flipped'),
      wrongs: [
        { key: 'minus|minus', tag: 'Z2', hint: L("Ikkinchi ishora ag'darilmadi. Minus qavs ichidagi hammasiga tegishli.", 'Второй знак не перевернулся. Минус относится ко всему внутри.', 'The second sign did not flip. The minus belongs to everything inside.') },
        { key: '*', tag: 'Z2', hint: L("Minus oldida turganda ichidagi har bir ishora qarama-qarshisiga o'tadi.", 'Когда впереди минус, каждый знак внутри переходит в противоположный.', 'When a minus stands before it, every sign inside turns into its opposite.') },
      ],
    },
    {
      template: ['m ', { slot: 0 }, ' n ', { slot: 1 }, ' k'],
      parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
      answer: ['minus', 'minus'],
      prompt: L("m − (n + k). Qavsni oching.", 'm − (n + k). Раскрой скобку.', 'm − (n + k). Remove the bracket.'),
      checkNote: L('Ikkala ishora ham ag\'darildi', 'Оба знака перевернулись', 'Both signs flipped'),
      wrongs: [
        { key: 'minus|plus', tag: 'Z2', hint: L("Faqat birinchisi ag'darilgan. Ikkinchisi ham qavs ichida turgandi.", 'Перевернулся только первый. Второе слагаемое тоже было внутри скобки.', 'Only the first one flipped. The second term was inside the bracket too.') },
        { key: '*', tag: 'Z2', hint: L("Qavs ichidagi ikkala qo'shiluvchi ham minusning ishiga tushadi.", 'Оба слагаемых в скобке попадают под работу минуса.', 'Both terms in the bracket fall under the work of the minus.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uni uchta yozuvda sinab ko'ramiz.", 'Правило готово. Проверим его на трёх записях.', 'The rule is ready. Let us try it on three expressions.'),
    A('r1', "Ikkinchisi. Endi minus bilan.", 'Второе. Теперь с минусом.', 'Second. Now with a minus.'),
    A('r2', "Uchinchisi. Qavs ichida qo'shuv turibdi.", 'Третье. Внутри скобки стоит плюс.', 'Third. Inside the bracket there is a plus.'),
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
  const LABELS = ['a + (b − 5)  →  a + b − 5', 'c − (d − 4)  →  c − d + 4', 'm − (n + k)  →  m − n − k']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: qavs ichidagi hisoblanadi, keyin
// qatorlar ketma-ket yoziladi. Bu yerda qavs OCHILMAYDI, u HISOBLANADI --
// ikkinchi yo'l ham qonuniy va o'quvchi ikkalasini ham bilishi kerak.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L("Ikkinchi yo'l: qavsni hisoblash", 'Второй путь: посчитать скобку', 'The second path: work the bracket out'),
  start: '40 − (12 − 5) + 3',
  steps: [
    {
      part: '12 − 5', action: 'bracket', to: '40 − 7 + 3', parts: ['12 − 5', '40 − 12', '5 + 3'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage1', part: '40 − 12', tag: 'Z4', hint: L("Qavs ichidagi hali hisoblanmadi. Qavs oldidagi ayirish o'z navbatini kutadi.", 'То, что в скобке, ещё не посчитано. Вычитание перед скобкой ждёт своей очереди.', 'What is inside the bracket is not worked out yet. The subtraction before it waits its turn.') },
        { action: 'stage1', part: '5 + 3', tag: 'Z4', hint: L("Beshlik qavs ichida, uchlik esa tashqarida. Ular hozircha juft emas.", 'Пятёрка внутри скобки, а тройка снаружи. Пока они не пара.', 'The five is inside the bracket and the three is outside. They are not a pair yet.') },
        { action: 'stage2', hint: L("Yozuvda ko'paytirish ham, bo'lish ham yo'q.", 'В записи нет ни умножения, ни деления.', 'The expression has neither multiplication nor division.') },
      ],
    },
    {
      part: '40 − 7', action: 'stage1', to: '33 + 3', parts: ['40 − 7', '7 + 3'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage1', part: '7 + 3', tag: 'Z4', hint: L("Ikkalasi ham birinchi bosqichda, demak chapdan o'ngga. Qaysi biri chaproqda?", 'Оба на первой ступени, значит слева направо. Какое из них левее?', 'Both are first-stage, so left to right. Which one is further left?') },
        { action: 'bracket', hint: L("Qavs ishini tugatdi va yo'qoldi.", 'Скобка сделала своё дело и исчезла.', 'The bracket has done its job and is gone.') },
      ],
    },
    {
      part: '33 + 3', action: 'stage1', to: '36', parts: ['33 + 3'],
      needPart: L('Avval qismni tanlang.', 'Сначала выбери часть.', 'Pick a part first.'),
      wrongs: [
        { action: 'stage2', hint: L("Bu qo'shish, ya'ni birinchi bosqich.", 'Это сложение, то есть первая ступень.', 'This is an addition, the first stage.') },
      ],
    },
  ],
  footNote: L('Qiymat topildi', 'Значение найдено', 'The value is found'),
  reward: {
    title: L("Ikki yo'l, bitta javob", 'Два пути, один ответ', 'Two paths, one answer'),
    text: L(
      "Qavsni ochish ham, uni hisoblash ham bir xil songa olib keladi. Sonlar bo'lsa hisoblash qulay, harflar bo'lsa ochish kerak.",
      'И раскрыть скобку, и посчитать её приводит к одному числу. Когда внутри числа, удобнее посчитать; когда буквы, приходится раскрывать.',
      'Removing the bracket and working it out lead to the same number. With numbers inside it is easier to work it out; with letters you have to remove it.',
    ),
  },
  audio: [
    A('mount', "Qavsni ochish yagona yo'l emas. Ichida sonlar tursa, uni shunchaki hisoblash mumkin.", 'Раскрывать скобку не единственный путь. Если внутри числа, её можно просто посчитать.', 'Removing the bracket is not the only path. If numbers are inside, you can simply work it out.'),
    A('mount', "Har qadamda qismni tanlang va amalni ayting.", 'На каждом шаге выбирай часть и называй действие.', 'At each step pick a part and name the operation.'),
    A('step2', "Qavs hisoblandi va yo'qoldi. Qolgani birinchi bosqich, chapdan o'ngga.", 'Скобка посчитана и исчезла. Дальше первая ступень, слева направо.', 'The bracket is worked out and gone. What is left is first stage, left to right.'),
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
      <Transform
        audio={audio}
        start={S10.start}
        steps={S10.steps}
        actions={ACTIONS}
        footNote={S10.footNote}
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'practice' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 11. MASHQ 3. ASBOBSIZ (§4.2, §8.1).
// ============================================================
const S11 = {
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L("Ishoralarni o'zingiz qo'ying", 'Расставь знаки сам', 'Place the signs yourself'),
  template: ['x ', { slot: 0 }, ' y ', { slot: 1 }, ' z ', { slot: 2 }, ' 2'],
  parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
  answer: ['minus', 'plus', 'minus'],
  prompt: L(
    "x − (y − z + 2). Qavsni oching. Namoyish ham, qadamlar ham ekranda ko'rinmaydi.",
    'x − (y − z + 2). Раскрой скобку. Ни показа, ни шагов на экране не будет.',
    'x − (y − z + 2). Remove the bracket. No demonstration and no steps will appear.',
  ),
  checkNote: L(
    'Uchala ishora ham ag\'darildi: minus qo\'shuvga, qo\'shuv minusga, va birinchisi ham',
    'Все три знака перевернулись: минус в плюс, плюс в минус, и первый тоже',
    'All three signs flipped: minus to plus, plus to minus, and the first one as well',
  ),
  wrongs: [
    { key: 'plus|plus|minus', tag: 'Z3', hint: L("Birinchi qo'shiluvchi ishorasiz yozilgan, ya'ni oldida qo'shuv turibdi. Demak u ham ag'dariladi.", 'Первое слагаемое записано без знака, значит перед ним плюс. Значит оно тоже переворачивается.', 'The first term has no sign, so a plus stands before it. So it flips too.') },
    { key: 'minus|minus|plus', tag: 'Z2', hint: L("Ikkinchi va uchinchi ishora ag'darilmagan, ular qanday bo'lsa shundayligicha ko'chgan.", 'Второй и третий знаки не перевернулись, они переехали как были.', 'The second and third signs did not flip, they moved across as they were.') },
    { key: '*', tag: 'Z2', hint: L("Qavs oldida minus turibdi. Ichidagi uchta qo'shiluvchining har biri ishorasini almashtiradi.", 'Перед скобкой стоит минус. Каждое из трёх слагаемых внутри меняет свой знак.', 'A minus stands before the bracket. Each of the three terms inside changes its sign.') },
  ],
  audio: [
    A('mount', "Endi yordamchisiz. Uchta qo'shiluvchi, va birinchisi ishorasiz.", 'Теперь без помощника. Три слагаемых, и первое без знака.', 'Now with no helper. Three terms, and the first has no sign.'),
    A('mount', "Qavs oldiga qarang va ishoralarni qo'ying.", 'Посмотри на знак перед скобкой и поставь знаки.', 'Look at the sign before the bracket and put the signs in.'),
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
// EKRAN 12. TUZOQ (§8.2). Qarshi misolni O'QUVCHI hisoblaydi.
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
    { id: 'r1', text: '30 − (8 + 6 − 4)' },
    { id: 'r2', text: '30 − 8 + 6 − 4' },
    { id: 'r3', text: '22 + 6 − 4' },
    { id: 'r4', text: '24' },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich yozuv, unda hali qavs ochilmagan.", 'Это исходная запись, в ней скобка ещё не раскрыта.', 'That is the original expression, the bracket is not removed yet.'),
    r3: L("Bu qator ikkinchisini halol davom ettiradi: 30 dan 8 ni ayirsak, haqiqatan 22 chiqadi.", 'Эта строка честно продолжает вторую: 30 минус 8 и правда 22.', 'This line honestly continues the second: 30 minus 8 really is 22.'),
    r4: L("22 qo'shuv 6 ayirish 4 haqiqatan 24. Xato bundan oldin paydo bo'lgan.", 'Двадцать два плюс шесть минус четыре и правда 24. Ошибка появилась раньше.', 'Twenty two plus six minus four really is 24. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z2', r3: 'Z2', r4: 'Z2' },
  proofFill: {
    template: ['30 − 8 ', { slot: 0 }, ' 6 ', { slot: 1 }, ' 4  =  ', { slot: 2 }],
    parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }, { id: 'v20', label: '20' }, { id: 'v24', label: '24' }],
    answer: ['minus', 'plus', 'v20'],
    prompt: L(
      "Qavsni to'g'ri oching va qiymatni hisoblang.",
      'Раскрой скобку правильно и посчитай значение.',
      'Remove the bracket correctly and work out the value.',
    ),
    checkNote: L('20 va 24. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas', '20 и 24. Числа разошлись, значит вторая строка не равна первой', '20 and 24. The numbers differ, so the second line is not equal to the first'),
    wrongs: [
      { key: 'minus|plus|v24', tag: 'Z6', hint: L("Ishoralar to'g'ri qo'yildi. Endi hisoblang: 30 ayirish 8 ayirish 6 qo'shuv 4.", 'Знаки поставлены верно. Теперь посчитай: 30 минус 8 минус 6 плюс 4.', 'The signs are right. Now count: 30 minus 8 minus 6 plus 4.') },
      { key: '*', tag: 'Z2', hint: L("Qavs ichida uchta qo'shiluvchi bor, va ularning hammasi ishorasini almashtiradi.", 'В скобке три слагаемых, и все три меняют свой знак.', 'The bracket holds three terms, and all three change their sign.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi yechdi va xato qildi. Har bir qator to'g'ri ko'rinadi, javob esa noto'g'ri.", 'Ученик решил и ошибся. Каждая строка выглядит верной, а ответ неверен.', 'A student solved it and got it wrong. Every line looks right, yet the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.", 'Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую.', 'Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Topdingiz. Endi isbotlang: qavsni o'zingiz to'g'ri oching va qiymatni hisoblang.", 'Нашёл. Теперь докажи: раскрой скобку сам как надо и посчитай значение.', 'You found it. Now prove it: remove the bracket correctly yourself and work out the value.'),
    A('done', "Yigirma va yigirma to'rt. Sonlar farq qildi, demak ikkinchi qator birinchisiga teng emas.", 'Двадцать и двадцать четыре. Числа разошлись, значит вторая строка не равна первой.', 'Twenty and twenty four. The numbers differ, so the second line is not equal to the first.'),
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
// EKRAN 13. KO'CHIRISH. TESKARI ish: qavsni OCHISH emas, QO'YISH.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L("Endi qavsni o'zingiz qo'ying", 'Теперь скобку ставишь ты', 'Now you put the bracket in'),
  rounds: [
    {
      template: ['a − (b ', { slot: 0 }, ' c)'],
      parts: [{ id: 'plus', label: '+' }, { id: 'minus', label: '−' }],
      answer: ['plus'],
      prompt: L(
        "a − b − c yozuvidagi oxirgi ikki qo'shiluvchini qavsga oling. Ichkarida qaysi ishora turadi?",
        'Возьми в скобку два последних слагаемых записи a − b − c. Какой знак встанет внутри?',
        'Put the last two terms of a − b − c into a bracket. Which sign goes inside?',
      ),
      checkNote: L("Qavs oldida minus turibdi, demak ichkarida ishoralar teskarisiga yoziladi", 'Перед скобкой минус, значит внутри знаки записываются наоборот', 'A minus stands before the bracket, so inside the signs are written the other way'),
      wrongs: [
        { key: 'minus', tag: 'Z2', hint: L("Tekshiring: a ayirish qavs b ayirish c qavs ochilsa, a ayirish b qo'shuv c chiqadi. Bizga esa a ayirish b ayirish c kerak.", 'Проверь: если раскрыть a минус скобка b минус c, выйдет a минус b плюс c. А нам нужно a минус b минус c.', 'Check: removing the bracket from a minus bracket b minus c gives a minus b plus c. But we need a minus b minus c.') },
        { key: '*', tag: 'Z2', hint: L("Qavsni qo'yish -- ochishning teskarisi. Ochilganda ishora ag'darilsa, qo'yilganda ham ag'dariladi.", 'Поставить скобку это обратное к раскрытию. Если при раскрытии знак переворачивается, то и при постановке тоже.', 'Putting a bracket in is the reverse of removing it. If a sign flips on the way out, it flips on the way in.') },
      ],
    },
    {
      template: ['50 − (', { slot: 0 }, ' + ', { slot: 1 }, ')'],
      parts: [{ id: 'p12', label: '12' }, { id: 'p8', label: '8' }, { id: 'p30', label: '30' }, { id: 'p20', label: '20' }],
      answer: ['p12', 'p8'],
      prompt: L(
        "50 − 12 − 8 yozuvini qavs bilan yozing. Qavs ichiga qaysi sonlar tushadi?",
        'Запиши 50 − 12 − 8 со скобкой. Какие числа попадут внутрь?',
        'Write 50 − 12 − 8 using a bracket. Which numbers go inside?',
      ),
      checkNote: L('50 ayirish 20 teng 30, va boshlang\'ich yozuv ham 30 beradi', '50 минус 20 равно 30, и исходная запись тоже даёт 30', '50 minus 20 is 30, and the original expression gives 30 as well'),
      wrongs: [
        { key: 'p30|p20', tag: 'Z6', hint: L("Bu allaqachon hisoblangan sonlar. Qavs ichiga boshlang'ich yozuvdagi sonlar tushadi.", 'Это уже посчитанные числа. Внутрь скобки идут числа из исходной записи.', 'Those are already-computed numbers. The numbers from the original expression go inside.') },
        { key: '*', tag: 'Z6', hint: L("Ikkala son ham minus bilan turgandi, qavs ichida esa ular qo'shiluvchi bo'lib qoladi.", 'Оба числа стояли с минусом, а внутри скобки они становятся слагаемыми.', 'Both numbers stood with a minus, and inside the bracket they become terms of a sum.') },
      ],
    },
  ],
  reward: {
    title: L("Ochish va qo'yish -- bitta ishning ikki tomoni", 'Раскрыть и поставить это две стороны одной работы', 'Removing and putting in are two sides of one job'),
    text: L(
      "Ishoralar qaysi tomonga ketayotgani muhim emas: minus oldida turgan ekan, ular har safar ag'dariladi.",
      'Неважно, в какую сторону идут знаки: пока впереди минус, они переворачиваются каждый раз.',
      'It does not matter which way the signs travel: while a minus stands before them, they flip every time.',
    ),
  },
  audio: [
    A('mount', "Butun dars davomida qavsni ochardik. Endi teskarisi: qavsni o'zingiz qo'yasiz.", 'Весь урок мы раскрывали скобку. Теперь наоборот: скобку ставишь ты.', 'All lesson we removed brackets. Now the other way round: you put the bracket in.'),
    A('r1', "Endi sonlar bilan. Qaysi sonlar qavs ichiga tushadi?", 'Теперь с числами. Какие числа попадут внутрь скобки?', 'Now with numbers. Which numbers go inside the bracket?'),
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
  const LABELS = ['a − b − c  →  a − (b + c)', '50 − 12 − 8  →  50 − (12 + 8)']
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
  question: ASK_VALUE,
  items: [
    {
      prompt: '12 − (5 + 3)',
      ok: L("Minus ikkala qo'shiluvchining ham ishorasini ag'dardi.", 'Минус перевернул знак у обоих слагаемых.', 'The minus flipped the sign of both terms.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '10', tag: 'Z2', hint: L("10 minus faqat beshlikka tekkanda chiqadi. Uchlik ham qavs ichida edi.", '10 получается, если минус дошёл только до пятёрки. Тройка тоже была в скобке.', '10 comes out if the minus reached only the five. The three was in the bracket too.') },
        { id: 'c', label: '20', tag: 'Z4', hint: L("20 bu 12 qo'shuv 8. Qavs oldida ayirish turibdi.", '20 это 12 плюс 8. Перед скобкой стоит вычитание.', '20 is 12 plus 8. The sign before the bracket is a subtraction.') },
        { id: 'd', label: '14', hint: L("14 bu 12 qo'shuv 5 ayirish 3. Ikkala ishora ham noto'g'ri qo'yilgan.", '14 это 12 плюс 5 минус 3. Оба знака поставлены неверно.', '14 is 12 plus 5 minus 3. Both signs were put in wrongly.') },
      ],
    },
    {
      prompt: '12 + (5 − 3)',
      ok: L("Qo'shuv oldida turganda ishoralar o'zgarmaydi.", 'Когда впереди плюс, знаки не меняются.', 'When a plus stands before it, the signs do not change.'),
      items: [
        { id: 'a', label: '14', correct: true },
        { id: 'b', label: '10', tag: 'Z1', hint: L("10 ishoralar ag'darilganda chiqadi. Lekin qavs oldida qo'shuv turibdi.", '10 получается, если перевернуть знаки. Но перед скобкой стоит плюс.', '10 comes out if you flip the signs. But the sign before the bracket is a plus.') },
        { id: 'c', label: '4', tag: 'Z1', hint: L("4 bu 12 ayirish 8. Qavs oldida ayirish emas, qo'shuv turibdi.", '4 это 12 минус 8. Перед скобкой не вычитание, а сложение.', '4 is 12 minus 8. The sign before the bracket is not a subtraction but an addition.') },
        { id: 'd', label: '20', tag: 'Z1', hint: L("20 bu 12 qo'shuv 5 qo'shuv 3. Qavs ichida esa ayirish turibdi.", '20 это 12 плюс 5 плюс 3. А в скобке стоит вычитание.', '20 is 12 plus 5 plus 3. But inside the bracket there is a subtraction.') },
      ],
    },
    {
      prompt: L("−(a − 7), bunda a teng 10", '−(a − 7), где a равно 10', '−(a − 7), where a equals 10'),
      wrap: true,
      ok: L("Yolg'iz minus ham har bir ishorani ag'daradi.", 'Одинокий минус тоже переворачивает каждый знак.', 'A lone minus flips every sign as well.'),
      items: [
        { id: 'a', label: '−3', correct: true },
        { id: 'b', label: '−17', tag: 'Z2', hint: L("Minus yettilikka yetib bormagan. Qavs ichida ikkita qo'shiluvchi bor.", 'Минус не дошёл до семёрки. В скобке два слагаемых.', 'The minus never reached the seven. The bracket holds two terms.') },
        { id: 'c', label: '3', tag: 'Z4', hint: L("Bu qavs ichidagining o'zi. Oldidagi minus hisobga olinmagan.", 'Это то, что внутри скобки. Минус перед ней не учтён.', 'That is what is inside the bracket. The minus before it was not counted.') },
        { id: 'd', label: '17', tag: 'Z2', hint: L("Bu 10 qo'shuv 7. Qavs ichida ayirish turibdi.", 'Это 10 плюс 7. А в скобке стоит вычитание.', 'That is 10 plus 7. But inside the bracket there is a subtraction.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("Qavs oldidagi minus nima qiladi?", 'Что делает минус перед скобкой?', 'What does a minus before a bracket do?'),
      ok: L("Ichidagi har bir qo'shiluvchining ishorasini ag'daradi.", 'Меняет знак каждого слагаемого внутри.', 'It flips the sign of every term inside.'),
      items: [
        { id: 'a', correct: true, label: L("Har bir qo'shiluvchining ishorasini ag'daradi", 'Меняет знак каждого слагаемого внутри', 'Flips the sign of every term inside') },
        { id: 'b', tag: 'Z2', label: L("Faqat birinchisining ishorasini ag'daradi", 'Меняет знак только у первого', 'Flips the sign of the first one only'), hint: L("Ettinchi ekranda shu yo'l minus o'n yetti bergandi, to'g'ri javob esa minus uch.", 'На седьмом экране этот путь дал минус семнадцать, а верный ответ минус три.', 'On screen seven that path gave minus seventeen, and the right answer was minus three.') },
        { id: 'c', tag: 'Z4', label: L("Shunchaki yo'qoladi", 'Просто исчезает', 'It simply disappears'), hint: L("Unda 12 ayirish qavs 5 qo'shuv 3 yigirma berardi, haqiqiy qiymat esa to'rt.", 'Тогда 12 минус скобка 5 плюс 3 дало бы двадцать, а настоящее значение четыре.', 'Then 12 minus bracket 5 plus 3 would give twenty, and the real value is four.') },
        { id: 'd', tag: 'Z5', label: L("Qavsni songa ko'paytiradi", 'Умножает скобку на число', 'Multiplies the bracket by a number'), hint: L("Ko'paytuvchi bu boshqa holat, uni oldingi darsda ko'rgandik. Bu yerda qavs oldida faqat ishora turibdi.", 'Множитель это другой случай, мы видели его в прошлом уроке. Здесь перед скобкой стоит только знак.', 'A factor is a different case, we saw it in the previous lesson. Here only a sign stands before the bracket.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi. Endi qavs oldida qo'shuv.", 'Второй. Теперь перед скобкой плюс.', 'Second. Now a plus before the bracket.'),
    A('2', "Uchinchisi. Harf bilan.", 'Третий. С буквой.', 'Third. With a letter.'),
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
  title: L("Qavs o'chmaydi, u ishoralarni topshiradi", 'Скобка не стирается, она передаёт знаки', 'A bracket is not erased, it hands the signs over'),
  // XUK SAHNASI (metodist talabi 2026-08-15): 1-darsdagi kabi -- bitta
  // manba, ikki yo'l, ikki tablo, ular orasida halqa. Ikkita oq kartochka
  // sinf etalonidan past edi.
  gate: {
    source: { kind: 'gate', outer: '12', sign: '−', inner: ['5', '+', '3'] },
    rows: [
      { tokens: ['12', '−', '5', '+', '3'], value: '10' },
      { tokens: ['12', '−', '5', '−', '3'], value: '4' },
    ],
  },
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    flip: L("to'rt chiqqani, ishoralar ag'darildi", 'тот, где вышло четыре: знаки перевернулись', 'the one that gave four: the signs flipped'),
    erase: L("o'n chiqqani, qavs o'chirildi", 'тот, где вышло десять: скобку стёрли', 'the one that gave ten: the bracket was erased'),
    first: L('minus faqat beshlikka tegishli edi', 'минус относился только к пятёрке', 'the minus belonged to the five only'),
    both: L('ikkalasi ham to\'g\'ri', 'оба верны', 'both are right'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  // Plashkalar TO'RTTA: oltitasi ikkinchi qatorga o'tib, yakunni pastdan
  // kesib qo'yardi. Har biri darsning BOSHQA holatini eslatadi.
  chips: ['12 − (5 + 3) → 4', '12 + (5 − 3) → 14', 'a − (b − c) → a − b + c', '−(a − 7) → −3'],
  twoLabel: L("Ikki holat", 'Два случая', 'Two cases'),
  twoA: 'a + (b − c) = a + b − c',
  twoB: 'a − (b − c) = a − b + c',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "o'xshash qo'shiluvchilarni ixchamlash",
    'приведение подобных слагаемых',
    'collecting like terms',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "To'g'ri javob to'rt. Qavs oldidagi minus ichidagi har bir qo'shiluvchining ishorasini ag'daradi.", 'Верный ответ четыре. Минус перед скобкой переворачивает знак каждого слагаемого внутри.', 'The right answer is four. A minus before a bracket flips the sign of every term inside.'),
    A('mount', "Keyingi darsda o'xshash qo'shiluvchilarni ixchamlashni o'rganamiz.", 'В следующем уроке будем приводить подобные слагаемые.', 'In the next lesson we collect like terms.'),
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
      {/* Xuk sahnasi qaytadi, endi javob olingan: chapdagi so'nadi,
          o'ngdagi yashil bo'ladi. */}
      {/* Xuk sahnasi qaytadi va endi BOSILADI: o'quvchi yuqori tabloni
          tuzatadi. Bu yangi savol emas (§4.2) -- u allaqachon bilgan
          qoidani sahnaga qo'llaydi. */}
      <TwoRoutes source={S15.gate.source} rows={S15.gate.rows} fix={{ ...S15.fix, onFix }} />
      <HistoryTape items={S15.chips} label={S15.tapeLabel} />

      <div className="g7-sumcards g7-sumcards-one">
        <div className="g7-sumcard">
          <p className="g7-sumcard-h">{t(S15.twoLabel)}</p>
          <span className="g7-sumtwo-line"><Fx>{S15.twoA}</Fx></span>
          <span className="g7-sumtwo-line"><Fx>{S15.twoB}</Fx></span>
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

export default function Grade7Dars05({
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
    else console.log('[Grade7 Dars05] onFinished', payload)
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
