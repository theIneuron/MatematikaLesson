// ============================================================================
// 7-sinf, Dars 6. O'XSHASH HADLARNI IXCHAMLASH.
// (Приведение подобных слагаемых)
//
// Kontrakt: src/books/grade7/ETALON_7SINF.md
// Namuna: Dars01.jsx (sinf ETALONI), Dars05.jsx.
//
// ATAMA (metodist qarori 2026-08-15, etalon §3.3): RU «подобные слагаемые»,
// UZ `o'xshash hadlar`, EN like terms. Ko'phad 6-darsda hali YO'Q -- u
// B4 blokida, 18-darsda, -- shuning uchun ruschada «слагаемое» ishlatiladi:
// «член» so'zini atash uchun ko'phad kerak, uni esa o'quvchi bilmaydi.
//
// DARSNING G'OYASI. O'xshash hadlarni ixchamlash -- YANGI qoida emas. Bu
// 3-darsdagi taqsimot xossasi teskari tomonga o'qilgani: 2a qo'shuv 3a bu
// qavs 2 qo'shuv 3 karra a. Shuning uchun koeffitsiyentlar QO'SHILADI,
// ko'paytirilmaydi -- ular qavs ichida turibdi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
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
  HistoryTape,
  Probe,
  ProbeChain,
  RuleBuilder,
  SlotFill,
  StairsReveal,
  SubstituteRows,
  TwoRoutes,
} from './tools.jsx'

const LESSON_ID = 'alg_7_06'
const LESSON_TITLE = L("O'xshash hadlarni ixchamlash", 'Приведение подобных слагаемых', 'Collecting like terms')
const LESSON_NO = L('6-dars', 'Урок 6', 'Lesson 6')
const TOTAL = 15

const BLOCK = { label: L('B1-blok', 'Блок Б1', 'Block B1'), from: 1, to: 6, current: 6 }

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
  Z1: L("koeffitsiyentlar ko'paytirildi", 'коэффициенты перемножили', 'the coefficients were multiplied'),
  Z2: L("o'xshash bo'lmagan hadlar qo'shildi", 'сложили неподобные слагаемые', 'unlike terms were added'),
  Z3: L("harfiy ko'paytuvchi yo'qoldi", 'буквенный множитель потерялся', 'the letter part got lost'),
  Z4: L("harf oldidagi bir ko'rinmadi", 'единица перед буквой не увидена', 'the one before the letter was missed'),
  Z5: L('manfiy koeffitsiyent ishorasi', 'знак отрицательного коэффициента', 'the sign of a negative coefficient'),
  Z6: L("teskari yo'l ko'rinmadi", 'обратный ход не увиден', 'the reverse move was not seen'),
  Z7: L("«ixchamlash» «hisoblash» deb tushunildi", '«упростить» понято как «посчитать»', 'simplify was taken to mean compute'),
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
// EKRAN 1. XUK. Bitta yozuv, ikki o'quvchi, ikki javob.
// Sahna KOEFFITSIYENTLAR bilan nima qilinganini ko'rsatadi: biri qo'shdi,
// ikkinchisi ko'paytirdi. Kim to'g'ri ekanini sahna AYTMAYDI (§8.1).
// ============================================================
const S1 = {
  eyebrow: L("O'XSHASH HADLARNI IXCHAMLASH", 'ПРИВЕДЕНИЕ ПОДОБНЫХ СЛАГАЕМЫХ', 'COLLECTING LIKE TERMS'),
  noBack: true,
  noNotes: true,
  title: L('Bitta yozuv, ikki javob', 'Одна запись, два ответа', 'One expression, two answers'),
  gate: {
    source: { kind: 'plain', tokens: ['2a', '+', '3a'] },
    rows: [
      { tokens: ['2', '·', '3'], value: '6' },
      { tokens: ['2', '+', '3'], value: '5' },
    ],
  },
  probe: {
    question: L(
      "Ikki o'quvchi 2a qo'shuv 3a ni ixchamladi. Biri 6a, ikkinchisi 5a deb yozdi. Kim to'g'ri qildi?",
      'Два ученика упростили 2a + 3a. Один написал 6a, другой 5a. Кто сделал верно?',
      'Two students simplified 2a + 3a. One wrote 6a, the other 5a. Who did it right?',
    ),
    items: [
      {
        id: 'add',
        label: L("Harf oldidagi sonlarni qo'shgani", 'Тот, кто сложил числа перед буквой', 'The one who added the numbers before the letter'),
        hint: L(
          "Taxminingiz qabul qilindi. Uni son qo'yib tekshiramiz.",
          'Прогноз принят. Проверим его подстановкой числа.',
          'Your prediction is taken. We will check it by substituting a number.',
        ),
      },
      {
        id: 'mul',
        label: L("Harf oldidagi sonlarni ko'paytirgani", 'Тот, кто перемножил числа перед буквой', 'The one who multiplied the numbers before the letter'),
        hint: L(
          "a o'rniga ikkini qo'ying va uchala yozuvni hisoblang. Ikkitasi bir xil son beradi, bittasi esa boshqa. Qaysi biri ajralib qoldi.",
          'Поставь вместо a двойку и посчитай все три записи. Две дадут одно число, а одна другое. Посмотри, какая осталась в стороне.',
          'Put two in place of a and work out all three. Two give the same number and one does not. See which one stands apart.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkalasi ham, ixchamlashning ikki yo'li bor", 'Оба верны, упростить можно по-разному', 'Both are right, there is more than one way'),
        hint: L(
          "Bitta yozuvning qiymati bitta. a o'rniga ikkini qo'ying: 2a qo'shuv 3a o'nga teng, 6a esa o'n ikkiga.",
          'У одной записи одно значение. Поставь вместо a двойку: 2a плюс 3a равно десяти, а 6a равно двенадцати.',
          'One expression has one value. Put two in place of a: 2a plus 3a is ten, while 6a is twelve.',
        ),
      },
      {
        id: 'none',
        label: L("Hech kim, bunday hadlar qo'shilmaydi", 'Никто, такие слагаемые не складываются', 'Neither, such terms cannot be added'),
        hint: L(
          "Ikkala hadda ham bitta xil harf turibdi. Ikkita olma va uchta olma qo'shiladi, va bu yerda ham shunday.",
          'В обоих слагаемых стоит одна и та же буква. Два яблока и три яблока складываются, и здесь так же.',
          'Both terms carry the same letter. Two apples and three apples do add up, and so do these.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Bugungi mavzu o'xshash hadlarni ixchamlash. Yozuv oddiy, ikki a qo'shuv uch a.", 'Сегодня тема урока приведение подобных слагаемых. Запись простая, два a плюс три a.', 'Today the topic is collecting like terms. The expression is simple, two a plus three a.'),
    A('mount', "Birinchi o'quvchi harf oldidagi sonlarni ko'paytirdi va olti oldi. Ikkinchisi qo'shdi va besh oldi.", 'Первый ученик перемножил числа перед буквой и получил шесть. Второй сложил и получил пять.', 'The first student multiplied the numbers before the letter and got six. The second added them and got five.'),
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
// EKRAN 2. TAYANCH. Uchtasi ham mashqni takrorlamaydi: mashqda hadlar
// ixchamlanadi, bu yerda esa faqat tayanch bilimlar tekshiriladi.
// KVOTA EKRANI (§4.2).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'WARM-UP'),
  title: L('Uchta narsa oldingi darslardan', 'Три вещи из прошлых уроков', 'Three things from earlier lessons'),
  question: ASK_VALUE,
  items: [
    {
      prompt: '5 · 3 + 5 · 2',
      ok: L("Beshlik ikkala qo'shiluvchida ham bor, uni tashqariga olsa bo'ladi.", 'Пятёрка есть в обеих частях, её можно вынести.', 'The five is in both parts, it can be taken out.'),
      items: [
        { id: 'a', label: '25', correct: true },
        { id: 'b', label: '17', hint: L("17 bu 5 karra 3 qo'shuv 2. Beshlik ikkinchi qo'shiluvchiga yetib bormagan.", '17 это 5 умножить на 3 плюс 2. Пятёрка не дошла до второго слагаемого.', '17 is 5 times 3 plus 2. The five never reached the second term.') },
        { id: 'c', label: '13', hint: L("13 bu 3 qo'shuv 5 karra 2. Beshlik birinchi qo'shiluvchiga yetib bormagan.", '13 это 3 плюс 5 умножить на 2. Пятёрка не дошла до первого слагаемого.', '13 is 3 plus 5 times 2. The five never reached the first term.') },
        { id: 'd', label: '10', hint: L("10 bu faqat 5 karra 2. Birinchi qism hisobga kirmagan.", '10 это только 5 умножить на 2. Первая часть не посчитана.', '10 is just 5 times 2. The first part was not counted.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("1 · a nechaga teng?", 'Чему равно 1 · a?', 'What is 1 · a?'),
      ok: L("Birga ko'paytirish sonni ham, harfni ham o'zgartirmaydi.", 'Умножение на единицу не меняет ни число, ни букву.', 'Multiplying by one changes neither a number nor a letter.'),
      items: [
        { id: 'a', label: 'a', correct: true },
        { id: 'b', label: '1', hint: L("Bu birning o'zi. Harf yo'qolib qolgan.", 'Это сама единица. Буква потерялась.', 'That is the one itself. The letter got lost.') },
        { id: 'c', label: L('a + 1', 'a + 1', 'a + 1'), hint: L("Yozuvdagi belgi ko'paytirish, qo'shish emas.", 'Знак в записи умножение, а не сложение.', 'The sign in the expression is a multiplication, not an addition.') },
        { id: 'd', label: L('1 : a', '1 : a', '1 : a'), hint: L("Bu bo'lish. Yozuvda esa ko'paytirish turibdi.", 'Это деление. А в записи умножение.', 'That is a division. The expression has a multiplication.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("b yozuvida harf oldida qanday son turibdi?", 'Какое число стоит перед буквой в записи b?', 'What number stands before the letter in the expression b?'),
      ok: L("Ko'rinmaydigan bir. U yozilmaydi, lekin turibdi.", 'Невидимая единица. Её не пишут, но она стоит.', 'An invisible one. It is not written, but it is there.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', tag: 'Z4', label: '0', hint: L("Nol bo'lganda butun had nolga aylanardi va harf yo'qolardi.", 'Если бы нуль, всё слагаемое обратилось бы в нуль и буква исчезла.', 'If it were zero, the whole term would be zero and the letter would vanish.') },
        { id: 'c', tag: 'Z4', label: L("Son yo'q", 'Числа нет', 'There is no number'), hint: L("Son bor, u shunchaki yozilmaydi. 1 karra b bu b.", 'Число есть, его просто не пишут. 1 умножить на b это b.', 'The number is there, it is simply not written. 1 times b is b.') },
        { id: 'd', tag: 'Z4', label: 'b', hint: L("b bu harfning o'zi. Savol harf OLDIDAGI son haqida.", 'b это сама буква. Вопрос о числе ПЕРЕД буквой.', 'b is the letter itself. The question is about the number BEFORE it.') },
      ],
    },
  ],
  audio: [
    A('mount', "Yangi mavzudan oldin uchta narsani eslaymiz. Ular bugun uchtasi ham kerak bo'ladi.", 'Прежде чем идти в новую тему, вспомним три вещи. Все три сегодня понадобятся.', 'Before the new topic let us recall three things. All three will be needed today.'),
    A('1', "Ikkinchisi. Birga ko'paytirish haqida.", 'Второе. Про умножение на единицу.', 'Second. About multiplying by one.'),
    A('2', "Uchinchisi. Bu savol bugun yana chiqadi.", 'Третье. Этот вопрос сегодня появится ещё раз.', 'Third. This question will come up again today.'),
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
// EKRAN 3. TUSHUNTIRISH 1. Ixchamlash YANGI qoida emas: bu 3-darsdagi
// taqsimot xossasi TESKARI tomonga o'qilgani. Koeffitsiyentlar qavs ichida
// turibdi, shuning uchun ular QO'SHILADI.
// ============================================================
const S3 = {
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Sonlar qavs ichiga tushadi', 'Числа уходят в скобку', 'The numbers move into a bracket'),
  template: ['2a + 3a  =  ( 2 ', { slot: 0 }, ' 3 ) · a  =  ', { slot: 1 }, 'a'],
  parts: [
    { id: 'plus', label: '+' },
    { id: 'mul', label: '·' },
    { id: 'p5', label: '5' },
    { id: 'p6', label: '6' },
  ],
  answer: ['plus', 'p5'],
  prompt: L(
    "Umumiy harfni qavsdan tashqariga oling. Qavs ichida qaysi belgi turadi va nima hosil bo'ladi?",
    'Вынеси общую букву за скобку. Какой знак встанет внутри и что получится?',
    'Take the common letter out of the bracket. Which sign goes inside and what comes out?',
  ),
  checkNote: L(
    "Qavs ichida qo'shuv turibdi, shuning uchun koeffitsiyentlar qo'shiladi",
    'Внутри скобки стоит сложение, поэтому коэффициенты складываются',
    'Inside the bracket there is an addition, so the coefficients add up',
  ),
  wrongs: [
    { key: 'mul|p6', tag: 'Z1', hint: L("Boshlang'ich yozuvda hadlar orasida qo'shuv turibdi. Qavsga chiqarganda u yo'qolmaydi.", 'В исходной записи между слагаемыми стоит сложение. При вынесении оно никуда не девается.', 'In the original the terms are joined by an addition. Taking the letter out does not remove it.') },
    { key: 'plus|p6', tag: 'Z1', hint: L("Qavs ichida 2 qo'shuv 3 turibdi. Uni hisoblang.", 'Внутри скобки стоит 2 плюс 3. Посчитай это.', 'Inside the bracket you have 2 plus 3. Work that out.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi katakka hadlar orasidagi belgi tushadi, ikkinchisiga esa qavs ichidagining natijasi.", 'В первую клетку идёт знак между слагаемыми, во вторую результат из скобки.', 'The first box takes the sign between the terms, the second the result from the bracket.') },
  ],
  reward: {
    title: L("Bu yangi qoida emas", 'Это не новое правило', 'This is not a new rule'),
    text: L(
      "Uchinchi darsda ko'paytuvchi qavsdan chiqib har bir qo'shiluvchiga borgandi. Bu yerda u teskari yo'l bilan qavsga qaytdi.",
      'В третьем уроке множитель выходил из скобки к каждому слагаемому. Здесь он тем же путём вернулся в скобку.',
      'In lesson three the factor came out of the bracket to every term. Here it goes back in by the same road.',
    ),
  },
  audio: [
    A('mount', "Ikkala hadda ham bitta xil harf turibdi. Uni qavsdan tashqariga olamiz.", 'В обоих слагаемых стоит одна и та же буква. Вынесем её за скобку.', 'Both terms carry the same letter. Let us take it out of the bracket.'),
    A('mount', "Qavs ichida nima qoladi va nima hosil bo'ladi, o'zingiz qo'ying.", 'Что останется в скобке и что получится, поставь сам.', 'What stays in the bracket and what comes out, put it in yourself.'),
    A('checked', "Koeffitsiyentlar qo'shildi, harf esa umumiy bo'lib qoldi. Ko'paytirish emas, qo'shish.", 'Коэффициенты сложились, а буква осталась общей. Не умножение, а сложение.', 'The coefficients added up and the letter stayed common. Addition, not multiplication.'),
  ],
}

function Screen3({ screen, onAnswer, ...rest }) {
  const lang = rest.lang
  const segments = useMemo(() => buildSegments(S3.audio, lang), [lang])
  const audio = useAudio(segments)
  const canAnswer = useInstructionGate(audio)
  const [done, setDone] = useState(false)
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
        wide
        disabled={!canAnswer}
        onStep={(s) => audio.step(s)}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2. FARQLASH: hamma had ham qo'shilavermaydi.
// Faqat HARFIY QISMI BIR XIL bo'lgan hadlar ixchamlanadi.
// ============================================================
const S4 = {
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Hammasi ham qo'shilavermaydi", 'Складывается не всё', 'Not everything adds up'),
  template: ['4p + 8t + 3p  =  ', { slot: 0 }, 'p + 8t'],
  parts: [
    { id: 'p7', label: '7' },
    { id: 'p12', label: '12' },
    { id: 'p15', label: '15' },
    { id: 'p4', label: '4' },
  ],
  answer: ['p7'],
  prompt: L(
    "4p qo'shuv 8t qo'shuv 3p. Faqat o'xshash hadlarni ixchamlang.",
    '4p + 8t + 3p. Приведи только подобные слагаемые.',
    '4p + 8t + 3p. Collect only the like terms.',
  ),
  checkNote: L(
    "p bilan p ixchamlandi, t esa o'z holicha qoldi",
    'p сложилось с p, а t осталось как было',
    'p joined with p, and t stayed as it was',
  ),
  wrongs: [
    { key: 'p12', tag: 'Z2', hint: L("12 bu 4 qo'shuv 8. Lekin 8 ning yonida t turibdi, 4 ning yonida esa p. Ular boshqa hadlar.", '12 это 4 плюс 8. Но рядом с 8 стоит t, а рядом с 4 стоит p. Это разные слагаемые.', '12 is 4 plus 8. But 8 carries a t and 4 carries a p. Those are different terms.') },
    { key: 'p15', tag: 'Z2', hint: L("15 bu uchala sonning yig'indisi. Uchtasining harfiy qismi bir xil emas.", '15 это сумма всех трёх чисел. Но буквенная часть у них не одна и та же.', '15 is the sum of all three. But their letter parts are not the same.') },
    { key: '*', tag: 'Z2', hint: L("Harfiy qismi BIR XIL bo'lgan hadlarni toping. Ularning koeffitsiyentlarini qo'shing.", 'Найди слагаемые с ОДИНАКОВОЙ буквенной частью. Сложи их коэффициенты.', 'Find the terms with the SAME letter part. Add their coefficients.') },
  ],
  reward: {
    title: L("Harfiy qism -- bu pasport", 'Буквенная часть это пропуск', 'The letter part is the pass'),
    text: L(
      "Hadlar faqat harfiy qismi bir xil bo'lganda ixchamlanadi. p bilan t hech qachon bitta had bo'lmaydi.",
      'Слагаемые приводятся только тогда, когда буквенная часть одинакова. p и t никогда не станут одним слагаемым.',
      'Terms combine only when the letter part is the same. p and t will never become one term.',
    ),
  },
  audio: [
    A('mount', "Uchta had bor, lekin harflar ikki xil. Faqat bir xil harfli hadlar ixchamlanadi.", 'Три слагаемых, но буквы две разные. Приводятся только слагаемые с одинаковой буквой.', 'Three terms but two different letters. Only terms with the same letter combine.'),
    A('mount', "Qaysilari o'xshash ekanini toping va koeffitsiyentlarini qo'shing.", 'Найди, какие из них подобны, и сложи их коэффициенты.', 'Find which of them are alike and add their coefficients.'),
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
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3. O'SHA g'oya BOSHQA ko'rinishda: had -- bu
// SANOQ. 3a bu a qo'shuv a qo'shuv a. Sonlar ketdi, sanash qoldi.
// ============================================================
const S5 = {
  eyebrow: L('SANAB CHIQAMIZ', 'ПРОСТО СЧИТАЕМ', 'JUST COUNTING'),
  title: L('Nechta harf bor', 'Сколько всего букв', 'How many letters in all'),
  template: ['a + a  +  a + a + a  =  ', { slot: 0 }, 'a'],
  parts: [
    { id: 'p5', label: '5' },
    { id: 'p6', label: '6' },
    { id: 'p2', label: '2' },
    { id: 'p3', label: '3' },
  ],
  answer: ['p5'],
  prompt: L(
    "2a bu a qo'shuv a, 3a esa a qo'shuv a qo'shuv a. Hammasi bo'lib nechta a bor?",
    '2a это a плюс a, а 3a это a плюс a плюс a. Сколько всего a?',
    '2a is a plus a, and 3a is a plus a plus a. How many a are there in all?',
  ),
  checkNote: L(
    "Beshta a. Koeffitsiyent -- bu shunchaki harflar SONI",
    'Пять a. Коэффициент это просто СКОЛЬКО букв',
    'Five a. A coefficient is simply HOW MANY letters',
  ),
  wrongs: [
    { key: 'p6', tag: 'Z1', hint: L("Harflarni birma-bir sanang. Ikkitasi va uchtasi, jami nechta.", 'Посчитай буквы по одной. Две и три, сколько всего.', 'Count the letters one by one. Two and three, how many in all.') },
    { key: '*', tag: 'Z1', hint: L("Yozuvdagi a harflarini sanang: chapda ikkita, o'ngda uchta.", 'Посчитай буквы a в записи: слева две, справа три.', 'Count the a letters in the line: two on the left, three on the right.') },
  ],
  reward: {
    title: L("Koeffitsiyent -- bu son emas, SANOQ", 'Коэффициент это не число, а счёт', 'A coefficient is not a number, it is a count'),
    text: L(
      "Ikkita olma va uchta olma beshta olma bo'ladi, oltita emas. Harf bilan ham xuddi shunday.",
      'Два яблока и три яблока это пять яблок, а не шесть. С буквой ровно так же.',
      'Two apples and three apples make five apples, not six. It works the same with a letter.',
    ),
  },
  audio: [
    A('mount', "O'sha yozuvni boshqacha yozamiz. Ikki a bu a qo'shuv a, uch a esa a qo'shuv a qo'shuv a.", 'Запишем то же самое иначе. Два a это a плюс a, а три a это a плюс a плюс a.', 'Let us write the same thing differently. Two a is a plus a, and three a is a plus a plus a.'),
    A('mount', "Endi shunchaki sanang, nechta a bor.", 'Теперь просто посчитай, сколько всего a.', 'Now simply count how many a there are.'),
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
      <SlotFill
        audio={audio}
        template={S5.template}
        parts={S5.parts}
        answer={S5.answer}
        prompt={S5.prompt}
        checkNote={S5.checkNote}
        wrongs={S5.wrongs}
        wide
        disabled={!canAnswer}
        onSolved={(r) => { setDone(true); onAnswer({ ...r, screen, role: 'explain' }) }}
      />
    </Frame>
  )
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4. O'ZINGIZ: KO'RINMAYDIGAN BIR.
// Harf yolg'iz turganda uning oldida bir turgan hisoblanadi.
// ============================================================
const S6 = {
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Harf yolg'iz turganda", 'Когда буква стоит одна', 'When the letter stands alone'),
  template: ['a + 3a  =  ( ', { slot: 0 }, ' + 3 ) · a  =  ', { slot: 1 }, 'a'],
  parts: [
    { id: 'p1', label: '1' },
    { id: 'p0', label: '0' },
    { id: 'p4', label: '4' },
    { id: 'p3', label: '3' },
  ],
  answer: ['p1', 'p4'],
  prompt: L(
    "Birinchi hadda harf oldida son ko'rinmaydi. Qavs ichiga qaysi son tushadi?",
    'В первом слагаемом перед буквой числа не видно. Какое число уйдёт в скобку?',
    'In the first term no number is visible before the letter. Which number goes into the bracket?',
  ),
  checkNote: L(
    "Ko'rinmaydigan bir ham qavsga tushadi, va 1 qo'shuv 3 to'rtga teng",
    'Невидимая единица тоже уходит в скобку, и 1 плюс 3 равно четырём',
    'The invisible one goes into the bracket too, and 1 plus 3 is four',
  ),
  wrongs: [
    { key: 'p0|p3', tag: 'Z4', hint: L("Nol bo'lganda birinchi had umuman yo'qolardi. Lekin u yozuvda turibdi.", 'Если бы там был нуль, первое слагаемое исчезло бы совсем. А оно в записи стоит.', 'If it were zero, the first term would vanish entirely. But it is there in the line.') },
    { key: 'p1|p3', tag: 'Z4', hint: L("Qavs ichida 1 qo'shuv 3 turibdi. Uni hisoblang.", 'Внутри скобки стоит 1 плюс 3. Посчитай.', 'Inside the bracket you have 1 plus 3. Work it out.') },
    { key: '*', tag: 'Z4', hint: L("Yolg'iz turgan harf bitta harf degani. Demak uning oldida bir turibdi.", 'Одинокая буква это одна буква. Значит перед ней стоит единица.', 'A lone letter means one letter. So a one stands before it.') },
  ],
  audio: [
    A('mount', "Birinchi hadda harf oldida hech qanday son yo'q. Bu nol degani emas.", 'В первом слагаемом перед буквой нет никакого числа. Это не значит нуль.', 'In the first term there is no number before the letter. That does not mean zero.'),
    A('mount', "Yolg'iz turgan harf bitta harf degani. Qavs ichiga qaysi son tushishini o'zingiz qo'ying.", 'Одинокая буква это одна буква. Поставь сам, какое число уйдёт в скобку.', 'A lone letter means one letter. Put in yourself which number goes into the bracket.'),
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
// EKRAN 7. TUSHUNTIRISH 5. CHEGARAVIY HOLAT: sof SON turgan had.
// Avval savol, isbot KEYIN (§8.1). KVOTA EKRANI.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Harfsiz had', 'Слагаемое без буквы', 'A term with no letter'),
  numbers: [2],
  rows: [
    { id: 'src', expr: '4p + 8 + 3p', sub: () => '4 · 2 + 8 + 3 · 2', val: () => 22 },
    { id: 'ok', expr: '7p + 8', sub: () => '7 · 2 + 8', val: () => 22 },
    { id: 'bad', expr: '15p', sub: () => '15 · 2', val: () => 30 },
  ],
  probe: {
    question: L("p teng 2 bo'lganda 4p qo'shuv 8 qo'shuv 3p nechaga teng?", 'Чему равно 4p + 8 + 3p при p = 2?', 'What is 4p + 8 + 3p when p = 2?'),
    items: [
      { id: 'a', label: '22', correct: true },
      { id: 'b', label: '30', tag: 'Z2', hint: L("30 uchala son qo'shilib, keyin 2 ga ko'paytirilganda chiqadi. Sakkizning yonida harf yo'q.", '30 получается, если сложить все три числа и умножить на 2. А у восьмёрки буквы нет.', '30 comes from adding all three numbers and multiplying by 2. But the eight has no letter.') },
      { id: 'c', label: '15', tag: 'Z2', hint: L("15 bu koeffitsiyentlar yig'indisi, son qo'yilmagan.", '15 это сумма коэффициентов, число ещё не подставлено.', '15 is the sum of the coefficients, no number was substituted.') },
      { id: 'd', label: '14', tag: 'Z3', hint: L("14 bu 7 karra 2. Sakkiz hisobga kirmay qolgan.", '14 это 7 умножить на 2. Восьмёрка не учтена.', '14 is 7 times 2. The eight was left out.') },
    ],
  },
  okText: L(
    "Harfsiz had hech kimga qo'shilmaydi. U o'z holicha qolib, javobda alohida turadi.",
    'Слагаемое без буквы ни с кем не складывается. Оно остаётся само по себе и стоит в ответе отдельно.',
    'A term with no letter joins nobody. It stays on its own and stands apart in the answer.',
  ),
  audio: [
    A('mount', "Endi yozuvda harfsiz had bor. Avval javob bering, keyin son bilan tekshiramiz.", 'Теперь в записи есть слагаемое без буквы. Сначала ответь, потом проверим числом.', 'Now the expression has a term with no letter. Answer first, then we check with a number.'),
    A('row1', "Uchta yozuvni yonma-yon qo'yamiz va uchalasiga ham ikkini qo'yamiz.", 'Поставим три записи рядом и подставим во все три двойку.', 'Let us put three expressions side by side and substitute two into all three.'),
    A('row3', "Yigirma ikki, yigirma ikki va o'ttiz. Birinchi ikkitasi bir xil son berdi, uchinchisi esa boshqa. Demak u boshlang'ich yozuvga teng emas.", 'Двадцать два, двадцать два и тридцать. Первые две дали одно число, третья другое. Значит она не равна исходной записи.', 'Twenty two, twenty two and thirty. The first two gave the same number, the third did not. So it is not equal to the original.'),
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
        letter="p"
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
    { id: 'f1', label: L("harfiy qismi bir xil hadlarni toping", 'найди слагаемые с одинаковой буквенной частью', 'find the terms with the same letter part') },
    { id: 'f2', label: L("ularning koeffitsiyentlarini qo'shing", 'сложи их коэффициенты', 'add up their coefficients') },
    { id: 'f3', label: L("natijani umumiy harfiy ko'paytuvchiga ko'paytiring", 'результат умножь на общий буквенный множитель', 'multiply the result by the common letter part') },
    { id: 'f4', label: L("qolgan hadlarni o'zgarishsiz ko'chiring", 'остальные слагаемые перепиши без изменений', 'copy the remaining terms unchanged') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Birinchi qadam har doim bitta: qaysi hadlar o'xshash ekanini ko'rish.",
    'Порядок нарушен. Первый шаг всегда один: увидеть, какие слагаемые подобны.',
    'The order is off. The first step is always the same: see which terms are alike.',
  ),
  lawChips: [
    { label: 'a a', tone: 'par' },
    { label: '+', tone: 's1' },
    { label: '· a', tone: 's2' },
    { label: '…', tone: 'off' },
  ],
  lawSweep: L(
    "toping, qo'shing, ko'paytiring, qolganini ko'chiring",
    'найди, сложи, умножь, остальное перепиши',
    'find, add, multiply, copy the rest',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Ifodani unga teng bo'lgan sodda ko'rinishdagi ifoda bilan almashtirish uchun: o'xshash hadlarning koeffitsiyentlari qo'shiladi, natija esa umumiy harfiy ko'paytuvchiga ko'paytiriladi.",
        'Чтобы заменить выражение более простым ему эквивалентным выражением: сложите коэффициенты подобных слагаемых, а результат умножьте на общий буквенный множитель.',
        'To replace an expression with a simpler equal one: add the coefficients of the like terms and multiply the result by the common letter part.',
      ),
      L(
        "Ifodani bunday soddalashtirish o'xshash hadlarni ixchamlash deyiladi.",
        'Такое упрощение выражения называют приведением подобных слагаемых.',
        'Simplifying an expression this way is called collecting like terms.',
      ),
    ],
  },
  hookCap: L("Koeffitsiyentlar qo'shiladi, harf umumiy qoladi", 'Коэффициенты складываются, буква остаётся общей', 'The coefficients add up, the letter stays common'),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("o'xshash -- harfiy qismi bir xil", 'подобные — одинаковая буквенная часть', 'alike means the same letter part'),
    L("yolg'iz harf oldida bir turadi", 'перед одинокой буквой стоит единица', 'a lone letter has a one before it'),
    L("harfsiz had o'z holicha qoladi", 'слагаемое без буквы остаётся само по себе', 'a term with no letter stays on its own'),
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
        tag="Z2"
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
// EKRAN 9. MASHQ 1. Uchtasi bir turdagi: uchta had, bittasi manfiy.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchtasi ketma-ket', 'Три подряд', 'Three in a row'),
  reward: {
    title: L('Uchtasi ham topildi', 'Все три найдены', 'All three found'),
    text: L(
      "Uchalasida ham ish bitta bo'ldi: koeffitsiyentlarni ishorasi bilan qo'shish. Harf esa hech qayerga ketmadi.",
      'Во всех трёх работа была одна: сложить коэффициенты вместе с их знаками. А буква никуда не делась.',
      'The same job in all three: add the coefficients with their signs. The letter never went anywhere.',
    ),
  },
  rounds: [
    {
      template: ['6a − 3a + 5a  =  ', { slot: 0 }, 'a'],
      parts: [{ id: 'p8', label: '8' }, { id: 'p14', label: '14' }, { id: 'p2', label: '2' }, { id: 'p90', label: '90' }],
      answer: ['p8'],
      prompt: L("6a ayirish 3a qo'shuv 5a. Ixchamlang.", '6a − 3a + 5a. Приведи подобные.', '6a − 3a + 5a. Collect the like terms.'),
      checkNote: L('6 ayirish 3 qo\'shuv 5 teng 8', '6 минус 3 плюс 5 равно 8', '6 minus 3 plus 5 is 8'),
      wrongs: [
        { key: 'p14', tag: 'Z5', hint: L("14 bu uchala sonning yig'indisi. Ikkinchi son oldida minus turibdi.", '14 это сумма всех трёх чисел. А перед вторым стоит минус.', '14 is the sum of all three. But the second one has a minus before it.') },
        { key: '*', tag: 'Z5', hint: L("Koeffitsiyentlarni ISHORASI bilan qo'shing: 6, minus 3, qo'shuv 5.", 'Складывай коэффициенты ВМЕСТЕ со знаками: 6, минус 3, плюс 5.', 'Add the coefficients WITH their signs: 6, minus 3, plus 5.') },
      ],
    },
    {
      template: ['14b − 8b + 4b  =  ', { slot: 0 }, 'b'],
      parts: [{ id: 'q10', label: '10' }, { id: 'q26', label: '26' }, { id: 'q2', label: '2' }, { id: 'q18', label: '18' }],
      answer: ['q10'],
      prompt: L("14b ayirish 8b qo'shuv 4b. Ixchamlang.", '14b − 8b + 4b. Приведи подобные.', '14b − 8b + 4b. Collect the like terms.'),
      checkNote: L('14 ayirish 8 qo\'shuv 4 teng 10', '14 минус 8 плюс 4 равно 10', '14 minus 8 plus 4 is 10'),
      wrongs: [
        { key: 'q26', tag: 'Z5', hint: L("Ikkinchi had oldida minus turibdi, uni qo'shib bo'lmaydi.", 'Перед вторым слагаемым стоит минус, его нельзя прибавлять.', 'The second term has a minus, it cannot be added.') },
        { key: '*', tag: 'Z5', hint: L("Ishoralarni yozuvdan ko'chiring: 14, minus 8, qo'shuv 4.", 'Перенеси знаки из записи: 14, минус 8, плюс 4.', 'Carry the signs across from the line: 14, minus 8, plus 4.') },
      ],
    },
    {
      template: ['2b − 3b + 8b  =  ', { slot: 0 }, 'b'],
      parts: [{ id: 'w7', label: '7' }, { id: 'w13', label: '13' }, { id: 'w3', label: '3' }, { id: 'w48', label: '48' }],
      answer: ['w7'],
      prompt: L("2b ayirish 3b qo'shuv 8b. Ixchamlang.", '2b − 3b + 8b. Приведи подобные.', '2b − 3b + 8b. Collect the like terms.'),
      checkNote: L('2 ayirish 3 minus bir beradi, keyin qo\'shuv 8 teng 7', '2 минус 3 даёт минус один, потом плюс 8 равно 7', '2 minus 3 gives minus one, then plus 8 is 7'),
      wrongs: [
        { key: 'w13', tag: 'Z5', hint: L("Bu uchala sonning yig'indisi. Ikkinchisi manfiy.", 'Это сумма всех трёх. Второе отрицательное.', 'That is the sum of all three. The second one is negative.') },
        { key: '*', tag: 'Z5', hint: L("2 dan 3 ni ayirsak minus bir chiqadi. Endi unga 8 ni qo'shing.", 'Из 2 вычесть 3 будет минус один. Теперь прибавь 8.', '2 minus 3 is minus one. Now add 8.') },
      ],
    },
  ],
  audio: [
    A('mount', "Qoida tayyor. Endi uni uchta yozuvda sinab ko'ramiz. Har birida ishoralarga diqqat qiling.", 'Правило готово. Проверим его на трёх записях. В каждой следи за знаками.', 'The rule is ready. Let us try it on three expressions. Watch the signs in each.'),
    A('r1', "Ikkinchisi.", 'Второе.', 'Second.'),
    A('r2', "Uchinchisi. Bu yerda oraliq natija manfiy bo'ladi.", 'Третье. Здесь промежуточный результат будет отрицательным.', 'Third. Here the intermediate result will be negative.'),
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
  const LABELS = ['6a − 3a + 5a  →  8a', '14b − 8b + 4b  →  10b', '2b − 3b + 8b  →  7b']
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
// EKRAN 10. MASHQ 2. Yo'naltirilgan: IKKI HARF va harfsiz had birga.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L('Ikki harf va bitta son', 'Две буквы и одно число', 'Two letters and one number'),
  template: ['=  ', { slot: 0 }, 'p − ', { slot: 1 }, 'q + ', { slot: 2 }],
  parts: [
    { id: 'p2', label: '2' },
    { id: 'p5', label: '5' },
    { id: 'p3', label: '3' },
    { id: 'p10', label: '10' },
    { id: 'p1', label: '1' },
  ],
  answer: ['p2', 'p5', 'p3'],
  prompt: L(
    "6p ayirish 3q qo'shuv 3 ayirish 4p ayirish 2q. Har bir harf uchun alohida ishlang, harfsiz had esa o'z joyida qoladi.",
    '6p − 3q + 3 − 4p − 2q. Работай с каждой буквой отдельно, а слагаемое без буквы остаётся на месте.',
    '6p − 3q + 3 − 4p − 2q. Work with each letter separately, and the term with no letter stays put.',
  ),
  checkNote: L(
    "p uchun 6 ayirish 4, q uchun minus 3 ayirish 2, uchlik esa tegilmadi",
    'Для p: 6 минус 4. Для q: минус 3 минус 2. Тройку не тронули',
    'For p: 6 minus 4. For q: minus 3 minus 2. The three was left alone',
  ),
  wrongs: [
    { key: 'p2|p1|p3', tag: 'Z5', hint: L("q uchun ikkala koeffitsiyent ham manfiy: minus 3 va minus 2. Ularni ishorasi bilan qo'shing.", 'У q оба коэффициента отрицательные: минус 3 и минус 2. Сложи их вместе со знаками.', 'Both coefficients of q are negative: minus 3 and minus 2. Add them with their signs.') },
    { key: 'p10|p5|p3', tag: 'Z5', hint: L("p uchun 6 va 4 orasida minus turibdi, qo'shuv emas.", 'Между 6 и 4 у p стоит минус, а не плюс.', 'Between the 6 and the 4 of p there is a minus, not a plus.') },
    { key: '*', tag: 'Z2', hint: L("Uchta katak, uchta ish: p ning koeffitsiyenti, q ning koeffitsiyenti va harfsiz had.", 'Три клетки, три работы: коэффициент у p, коэффициент у q и слагаемое без буквы.', 'Three boxes, three jobs: the coefficient of p, the coefficient of q, and the term with no letter.') },
  ],
  reward: {
    title: L('Har harf -- alohida ish', 'Каждая буква это отдельная работа', 'Each letter is a separate job'),
    text: L(
      "Yozuvda nechta har xil harf bo'lsa, shuncha alohida yig'indi bo'ladi. Harfsiz had esa ularning hech biriga qo'shilmaydi.",
      'Сколько в записи разных букв, столько и отдельных сумм. А слагаемое без буквы не входит ни в одну из них.',
      'As many different letters as there are, that many separate sums. And a term with no letter belongs to none of them.',
    ),
  },
  audio: [
    A('mount', "Endi yozuvda ikkita har xil harf va bitta harfsiz had bor.", 'Теперь в записи две разные буквы и одно слагаемое без буквы.', 'Now the expression has two different letters and one term with no letter.'),
    A('mount', "Har bir harf uchun alohida ishlang. Uchta katak uchta ishga to'g'ri keladi.", 'Работай с каждой буквой отдельно. Три клетки отвечают трём работам.', 'Work with each letter separately. Three boxes for three jobs.'),
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
      <SlotFill
        audio={audio}
        template={S10.template}
        parts={S10.parts}
        answer={S10.answer}
        prompt={S10.prompt}
        checkNote={S10.checkNote}
        wrongs={S10.wrongs}
        wide
        disabled={!canAnswer}
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
  title: L("Yozuvni o'zingiz yig'ing", 'Собери запись сам', 'Build the record yourself'),
  template: ['=  ', { slot: 0 }, 'x + ', { slot: 1 }],
  parts: [
    { id: 'p3', label: '3' },
    { id: 'p10', label: '10' },
    { id: 'p7', label: '7' },
    { id: 'p17', label: '17' },
  ],
  answer: ['p3', 'p10'],
  prompt: L(
    "5x qo'shuv 3 ayirish 2x qo'shuv 7. Ixchamlang, qadamlar ekranda ko'rinmaydi.",
    '5x + 3 − 2x + 7. Приведи подобные, шаги на экране не появятся.',
    '5x + 3 − 2x + 7. Collect the like terms, no steps will appear.',
  ),
  checkNote: L(
    "x uchun 5 ayirish 2, sonlar uchun 3 qo'shuv 7",
    'Для x: 5 минус 2. Для чисел: 3 плюс 7',
    'For x: 5 minus 2. For the numbers: 3 plus 7',
  ),
  wrongs: [
    { key: 'p7|p10', tag: 'Z5', hint: L("x oldidagi ikkinchi son minus bilan turibdi. 5 va 2 ni qo'shmang, ayiring.", 'Второе число при x стоит с минусом. Не складывай 5 и 2, а вычитай.', 'The second number at x has a minus. Do not add 5 and 2, subtract.') },
    { key: 'p3|p17', tag: 'Z2', hint: L("17 bu 3, 7 va 7 ning yig'indisi. Harfsiz hadlar faqat ikkita: 3 va 7.", '17 это сумма 3, 7 и ещё 7. А слагаемых без буквы всего два: 3 и 7.', '17 is 3 plus 7 plus another 7. But there are only two terms without a letter: 3 and 7.') },
    { key: '*', tag: 'Z2', hint: L("Ikkita ish bor: x li hadlar va harfsiz hadlar. Ularni aralashtirmang.", 'Работы две: слагаемые с x и слагаемые без буквы. Не смешивай их.', 'Two jobs: the terms with x and the terms without. Do not mix them.') },
  ],
  audio: [
    A('mount', "Endi yordamchisiz. Yozuvda x li ikkita had va harfsiz ikkita had bor.", 'Теперь без помощника. В записи два слагаемых с x и два без буквы.', 'Now with no helper. The expression has two terms with x and two without.'),
    A('mount', "Ishoralarga diqqat qiling va ikkala katakni to'ldiring.", 'Следи за знаками и заполни обе клетки.', 'Watch the signs and fill both boxes.'),
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
    { id: 'r1', text: '5x + 3 − 2x + 1' },
    { id: 'r2', text: '5x − 2x + 3 + 1' },
    { id: 'r3', text: '3x + 4' },
    { id: 'r4', text: '7x' },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv, unda hali hech nima ixchamlanmagan.", 'Это исходная запись, в ней ещё ничего не приведено.', 'That is the original expression, nothing has been collected yet.'),
    r2: L("Bu yerda hadlar faqat o'rin almashdi, va har biri O'Z ishorasi bilan ko'chdi. Tekshiring.", 'Здесь слагаемые только поменялись местами, и каждое переехало со СВОИМ знаком. Проверь.', 'Here the terms only swapped places, each moving with its OWN sign. Check it.'),
    r3: L("Bu qator ikkinchisidan to'g'ri kelib chiqadi: 5 ayirish 2 bu 3, va 3 qo'shuv 1 bu 4.", 'Эта строка верно следует из второй: 5 минус 2 это 3, а 3 плюс 1 это 4.', 'This line follows correctly from the second: 5 minus 2 is 3, and 3 plus 1 is 4.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r3: 'Z2' },
  proofFill: {
    template: ['x = 2:    3x + 4 = ', { slot: 0 }, ',    7x = ', { slot: 1 }],
    parts: [{ id: 'v10', label: '10' }, { id: 'v14', label: '14' }, { id: 'v7', label: '7' }, { id: 'v20', label: '20' }],
    answer: ['v10', 'v14'],
    prompt: L(
      "x o'rniga ikkini qo'ying va ikkala yozuvni hisoblang.",
      'Подставь вместо x двойку и посчитай обе записи.',
      'Put two in place of x and work out both expressions.',
    ),
    checkNote: L('10 va 14. Sonlar farq qildi, demak oxirgi qator oldingisiga teng emas', '10 и 14. Числа разошлись, значит последняя строка не равна предыдущей', '10 and 14. The numbers differ, so the last line is not equal to the one before'),
    wrongs: [
      { key: 'v10|v20', tag: 'Z3', hint: L("7x da x o'rniga ikkini qo'ying: 7 karra 2.", 'В 7x подставь вместо x двойку: 7 умножить на 2.', 'In 7x put two in place of x: 7 times 2.') },
      { key: '*', tag: 'Z3', hint: L("Birinchi katakka 3 karra 2 qo'shuv 4, ikkinchisiga 7 karra 2.", 'В первую клетку 3 умножить на 2 плюс 4, во вторую 7 умножить на 2.', 'The first box takes 3 times 2 plus 4, the second 7 times 2.') },
    ],
  },
  audio: [
    A('mount', "O'quvchi yechdi va xato qildi. Har bir qator to'g'ri ko'rinadi, javob esa noto'g'ri.", 'Ученик решил и ошибся. Каждая строка выглядит верной, а ответ неверен.', 'A student solved it and got it wrong. Every line looks right, yet the answer is wrong.'),
    A('mount', "Xato birinchi paydo bo'lgan qatorni toping. Har qanday noto'g'ri qatorni emas, aynan birinchisini.", 'Найди строку, где ошибка появилась впервые. Не любую неверную, а именно первую.', 'Find the line where the mistake first appears. Not any wrong line, the first one.'),
    A('proof', "Topdingiz. Endi isbotlang: x o'rniga son qo'ying va ikkala yozuvni hisoblang.", 'Нашёл. Теперь докажи: подставь число вместо x и посчитай обе записи.', 'You found it. Now prove it: substitute a number for x and work out both.'),
    A('done', "O'n va o'n to'rt. Sonlar farq qildi, demak x li had bilan harfsiz hadni qo'shib bo'lmaydi.", 'Десять и четырнадцать. Числа разошлись, значит слагаемое с x и слагаемое без буквы складывать нельзя.', 'Ten and fourteen. The numbers differ, so a term with x and a term without cannot be added.'),
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
// EKRAN 13. KO'CHIRISH. TESKARI ish: ixchamlash emas, UMUMIY
// KO'PAYTUVCHINI QAVSDAN TASHQARIGA CHIQARISH.
// ============================================================
const S13 = {
  eyebrow: L("TESKARI YO'L", 'ОБРАТНЫЙ ХОД', 'THE OTHER WAY ROUND'),
  title: L("Endi umumiyni tashqariga olamiz", 'Теперь выносим общее', 'Now we take the common part out'),
  rounds: [
    {
      template: ['4x + 4y  =  4 · ( ', { slot: 0 }, ' + ', { slot: 1 }, ' )'],
      parts: [{ id: 'px', label: 'x' }, { id: 'py', label: 'y' }, { id: 'p4', label: '4' }, { id: 'p8', label: '8' }],
      answer: ['px', 'py'],
      prompt: L(
        "Bu safar umumiy narsa SON. Uni tashqariga oldik, qavs ichida nima qoladi?",
        'На этот раз общее это ЧИСЛО. Мы вынесли его, что останется в скобке?',
        'This time the common part is a NUMBER. We took it out, what stays inside?',
      ),
      checkNote: L("Har haddan to'rtlik chiqib ketdi, harflar esa qoldi", 'Из каждого слагаемого ушла четвёрка, а буквы остались', 'The four left each term and the letters stayed'),
      wrongs: [
        { key: 'p4|p8', tag: 'Z6', hint: L("Bu sonlar tashqariga chiqdi. Qavs ichida esa har haddan QOLGANI turadi.", 'Эти числа ушли наружу. А в скобке стоит то, что ОСТАЛОСЬ от каждого слагаемого.', 'Those numbers went outside. Inside the bracket stands what is LEFT of each term.') },
        { key: '*', tag: 'Z6', hint: L("4x da to'rtlikni olib tashlasangiz, x qoladi. 4y da esa y.", 'Если в 4x убрать четвёрку, останется x. А в 4y останется y.', 'Remove the four from 4x and x is left. From 4y, y is left.') },
      ],
    },
    {
      template: ['ax + bx  =  ( ', { slot: 0 }, ' + ', { slot: 1 }, ' ) · x'],
      parts: [{ id: 'qa', label: 'a' }, { id: 'qb', label: 'b' }, { id: 'qx', label: 'x' }, { id: 'qab', label: 'ab' }],
      answer: ['qa', 'qb'],
      prompt: L(
        "Endi hamma narsa harf. Umumiy harf x tashqariga chiqdi, qavs ichida nima qoladi?",
        'Теперь всё буквенное. Общая буква x вышла наружу, что останется в скобке?',
        'Now everything is letters. The common x went outside, what stays inside?',
      ),
      checkNote: L("Bu darsning boshidagi ish, faqat teskari tomonga", 'Это работа с начала урока, только в обратную сторону', 'This is the job from the start of the lesson, only backwards'),
      wrongs: [
        { key: 'qx|qab', tag: 'Z6', hint: L("x allaqachon qavsdan tashqarida turibdi. Ichkarida har haddan qolgani bo'ladi.", 'x уже стоит за скобкой. Внутри останется то, что осталось от каждого слагаемого.', 'The x already stands outside. Inside goes what is left of each term.') },
        { key: '*', tag: 'Z6', hint: L("ax dan x ni olsangiz, a qoladi. bx dan olsangiz, b qoladi.", 'Если из ax убрать x, останется a. Из bx останется b.', 'Remove x from ax and a is left. From bx, b is left.') },
      ],
    },
  ],
  reward: {
    title: L("Ikki tomon, bitta ish", 'Две стороны, одна работа', 'Two directions, one job'),
    text: L(
      "Ixchamlash va qavsdan chiqarish -- bitta qoidaning ikki tomoni. Birinchisida harf qavsga kiradi, ikkinchisida chiqadi.",
      'Приведение подобных и вынесение за скобку это две стороны одного правила. В одном буква уходит в скобку, в другом выходит.',
      'Collecting like terms and taking a factor out are two sides of one rule. In one the letter goes into the bracket, in the other it comes out.',
    ),
  },
  audio: [
    A('mount', "Butun dars davomida hadlarni ixchamladik. Endi teskarisi: umumiy narsani qavsdan tashqariga chiqaramiz.", 'Весь урок мы приводили подобные. Теперь наоборот: выносим общее за скобку.', 'All lesson we collected like terms. Now the other way round: we take the common part out.'),
    A('r1', "Endi hamma narsa harf bilan.", 'Теперь всё буквенное.', 'Now everything is letters.'),
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
  const LABELS = ['4x + 4y  →  4(x + y)', 'ax + bx  →  (a + b)x']
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
      prompt: '4a + 5a',
      ok: L("Koeffitsiyentlar qo'shildi, harf umumiy qoldi.", 'Коэффициенты сложились, буква осталась общей.', 'The coefficients added up, the letter stayed common.'),
      items: [
        { id: 'a', label: '9a', correct: true },
        { id: 'b', label: '20a', tag: 'Z1', hint: L("20 bu 4 karra 5. Hadlar orasida qo'shuv turibdi.", '20 это 4 умножить на 5. Между слагаемыми стоит сложение.', '20 is 4 times 5. The terms are joined by an addition.') },
        { id: 'c', label: '9', tag: 'Z3', hint: L("Harf yo'qolib qolgan. To'rtta a va beshta a qo'shilsa, a hech qayerga ketmaydi.", 'Буква потерялась. Если сложить четыре a и пять a, буква никуда не денется.', 'The letter got lost. Adding four a and five a leaves the letter in place.') },
        { id: 'd', label: '45a', tag: 'Z1', hint: L("Sonlar yonma-yon yozilgan. Ular orasida amal bor.", 'Числа записали рядом. А между ними есть действие.', 'The numbers were written side by side. But there is an operation between them.') },
      ],
    },
    {
      prompt: '7b − b',
      ok: L("Yolg'iz harf oldida bir turadi.", 'Перед одинокой буквой стоит единица.', 'A lone letter has a one before it.'),
      items: [
        { id: 'a', label: '6b', correct: true },
        { id: 'b', label: '7b', tag: 'Z4', hint: L("Ikkinchi had hisobga kirmagan. Yolg'iz turgan b bu bitta b.", 'Второе слагаемое не учтено. Одинокое b это одно b.', 'The second term was left out. A lone b is one b.') },
        { id: 'c', label: '6', tag: 'Z3', hint: L("Harf yo'qolib qolgan.", 'Буква потерялась.', 'The letter got lost.') },
        { id: 'd', label: '7', tag: 'Z3', hint: L("Bu koeffitsiyentning o'zi, ikkinchi had ham hisobga kirmagan.", 'Это сам коэффициент, и второе слагаемое тоже не учтено.', 'That is the coefficient itself, and the second term was left out too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("3x qo'shuv 2y ni ixchamlash mumkinmi?", 'Можно ли привести 3x + 2y?', 'Can 3x + 2y be collected?'),
      ok: L("Harfiy qismlari har xil, demak ular o'xshash emas.", 'Буквенные части разные, значит слагаемые не подобны.', 'The letter parts differ, so the terms are not alike.'),
      items: [
        { id: 'a', correct: true, label: L("Yo'q, harflar har xil", 'Нет, буквы разные', 'No, the letters differ') },
        { id: 'b', tag: 'Z2', label: L("Ha, 5xy bo'ladi", 'Да, будет 5xy', 'Yes, it makes 5xy'), hint: L("x va y har xil harflar. Ularni qo'shsak, yangi harf paydo bo'lmaydi.", 'x и y разные буквы. От их сложения новая буква не появляется.', 'x and y are different letters. Adding them does not create a new letter.') },
        { id: 'c', tag: 'Z2', label: L('Ha, 5x bo\'ladi', 'Да, будет 5x', 'Yes, it makes 5x'), hint: L("Bu yerda y yo'qolib ketdi. Uni yo'qotib bo'lmaydi.", 'Здесь потерялся y. Его нельзя потерять.', 'Here the y got lost. It cannot be lost.') },
        { id: 'd', tag: 'Z7', label: L('Ha, 5 bo\'ladi', 'Да, будет 5', 'Yes, it makes 5'), hint: L("Ixchamlash bu hisoblash emas. Harflar joyida qoladi.", 'Приведение подобных это не вычисление. Буквы остаются на месте.', 'Collecting like terms is not computing. The letters stay.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L("O'xshash hadlarning koeffitsiyentlari bilan nima qilinadi?", 'Что делают с коэффициентами подобных слагаемых?', 'What is done with the coefficients of like terms?'),
      ok: L("Ular qo'shiladi, natija esa umumiy harfga ko'paytiriladi.", 'Их складывают, а результат умножают на общую букву.', 'They are added, and the result is multiplied by the common letter.'),
      items: [
        { id: 'a', correct: true, label: L("Qo'shiladi", 'Складывают', 'They are added') },
        { id: 'b', tag: 'Z1', label: L("Ko'paytiriladi", 'Перемножают', 'They are multiplied'), hint: L("Xukda shu yo'l oltini bergandi, to'g'ri javob esa besh.", 'На хуке этот путь дал шесть, а верный ответ пять.', 'On the hook that path gave six, and the right answer was five.') },
        { id: 'c', tag: 'Z3', label: L("O'zgarishsiz qoldiriladi", 'Оставляют без изменений', 'They are left unchanged'), hint: L("Unda yozuv qisqarmasdi, ixchamlashning ma'nosi esa aynan shunda.", 'Тогда запись не стала бы короче, а в этом весь смысл приведения.', 'Then the expression would not get shorter, and that is the whole point.') },
        { id: 'd', tag: 'Z1', label: L("Bo'linadi", 'Делят', 'They are divided'), hint: L("Hadlar orasida qo'shuv yoki ayirish turadi, bo'lish emas.", 'Между слагаемыми стоит сложение или вычитание, а не деление.', 'The terms are joined by addition or subtraction, not division.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Bu darsdagi yagona baholanadigan ekran, shuning uchun shoshilmang.", 'Блиц, четыре вопроса. Это единственный оцениваемый экран урока, поэтому не спеши.', 'Quick round, four questions. This is the only graded screen of the lesson, so take your time.'),
    A('1', "Ikkinchisi. Yolg'iz harf haqida.", 'Второй. Про одинокую букву.', 'Second. About a lone letter.'),
    A('2', "Uchinchisi. Ikki xil harf.", 'Третий. Две разные буквы.', 'Third. Two different letters.'),
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
// Sahna XUKNI YOPADI: yuqori tablo bosiladi va tuzatiladi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L("Koeffitsiyentlar qo'shiladi, harf qoladi", 'Коэффициенты складываются, буква остаётся', 'The coefficients add up, the letter stays'),
  gate: S1.gate,
  fix: {
    tokens: ['2', '+', '3'],
    value: '5',
    sign: '=',
    hint: L("Yuqori tabloni bosing", 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ko'paytirish qo'shishga almashdi, va olti beshga aylandi. Endi ikkala tablo bitta sonni ko'rsatadi. Siz uni tuzatdingiz.",
    'Умножение сменилось сложением, и шесть стало пятью. Теперь оба табло показывают одно число. Ты это исправил.',
    'The multiplication became an addition, and six became five. Now both boards show one number. You fixed it.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    add: L("sonlarni qo'shgani", 'тот, кто сложил числа', 'the one who added the numbers'),
    mul: L("sonlarni ko'paytirgani", 'тот, кто перемножил числа', 'the one who multiplied the numbers'),
    both: L('ikkalasi ham', 'оба верны', 'both are right'),
    none: L('hech kim', 'никто', 'neither'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['2a + 3a → 5a', '4p + 8t + 3p → 7p + 8t', 'a + 3a → 4a', '4x + 4y → 4(x + y)'],
  twoLabel: L('Ikki tomon', 'Две стороны', 'Two directions'),
  twoA: '2a + 3a = (2 + 3)a = 5a',
  twoB: 'ax + bx = (a + b)x',
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "tenglamalar: harf oldida javob emas, savol turadi",
    'уравнения: за буквой стоит не ответ, а вопрос',
    'equations: behind the letter stands a question, not an answer',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L('Kamchilik yo\'q', 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz va mana qanday chiqdi.", 'Вернёмся к началу. Вот что ты предполагал и вот как оказалось.', 'Back to the start. This is what you predicted and this is how it turned out.'),
    A('mount', "O'xshash hadlarni ixchamlash yangi qoida emas. Bu uchinchi darsdagi taqsimot xossasi teskari tomonga o'qilgani.", 'Приведение подобных это не новое правило. Это распределительное свойство из третьего урока, прочитанное в обратную сторону.', 'Collecting like terms is not a new rule. It is the distributive property from lesson three read backwards.'),
    A('mount', "Bu blok tugadi. Keyingi blokda tenglamalar boshlanadi.", 'Этот блок закончился. В следующем начинаются уравнения.', 'This block is done. The next one starts with equations.'),
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
      {/* Xuk sahnasi qaytadi va endi BOSILADI: o'quvchi yuqori tabloni
          tuzatadi. Bu yangi savol emas (§4.2). */}
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

export default function Grade7Dars06({
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
    else console.log('[Grade7 Dars06] onFinished', payload)
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
