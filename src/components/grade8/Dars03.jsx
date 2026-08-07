// ============================================================================
// 8-sinf, Dars 3. RATSIONAL KASRLARNI QISQARTIRISH.
//
// PILOT dars: ETALON_8SINF.md bo'yicha birinchi dars.
// Bu faylda FAQAT MA'LUMOT va asboblarni ulash bor (§13.2).
// Mexanika `tools.jsx` da, maydon `math.jsx` da, yadro `core.jsx` da,
// javobni tekshirish `mathcore.js` da.
//
// Raskadrovka: src/books/grade8/DARS03_SKELET.md
// Tuzilishi (§13): 1 xuk · 2-8 tushuntirish · 9-14 amaliyot · 15 yakun
//
// Ovoz bo'laklari qadamlarga bog'langan (§13.3): `on` — hodisa nomi.
// Ovoz yoniq bo'lsa keyingi qadam O'ZI ochiladi, o'chiq bo'lsa «keyingi» bilan.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useCallback, useMemo, useState } from 'react'
import {
  Ask, Btn, Frac, L, LangProvider, Lead, Note, Row,
  STYLES, Slot, Stage, Title, UI_TXT, configureLesson, tr, useAdvanceGate, useAudio,
  useMobileZoom, useT,
} from './core.jsx'
import { MATH_STYLES } from './math.jsx'
import {
  Audit, Blitz, Boundary, Fields, Inverse, Reveal, RuleBlock, SoloTask, Substitute, TOOLS_STYLES,
  TaskChain, Transform,
} from './tools.jsx'

export const META = {
  id: 'alg-8-03',
  n: 3,
  row: 3,
  block: 'Б1',
  topic: L('Ratsional kasrlarni qisqartirish', 'Сокращение рациональных дробей', 'Reducing rational fractions'),
  voice: 'm',
  total: 15,
}

const TOTAL = META.total

// Darsning uchta tasdig'i: 8-ekrandagi kartochka va 15-ekrandagi jamlanma.
// §13.2 invariant: BIRDAN UCHGACHA. Redaksiya 1 da to'rtta edi — birinchi
// ikkitasi bitta fikr, shuning uchun qo'shildi.
export const STATEMENTS = [
  L(
    "Faqat umumiy KO'PAYTUVCHIGA qisqartiriladi: yig'indi avval ko'paytuvchilarga ajratiladi",
    'Сокращают только на общий множитель: сумму сначала разлагают на множители',
    'Cancel only a common factor: factorise a sum first',
  ),
  L(
    "ODZ boshlang'ich maxrajdan olinadi va yo'qolmaydi",
    'ОДЗ берут по исходному знаменателю и не теряют',
    'The domain comes from the original denominator and is never dropped',
  ),
  L(
    'Son qo\'yish RAD ETADI, lekin ISBOTLAMAYDI',
    'Подстановка опровергает, но не доказывает',
    'Substitution refutes but does not prove',
  ),
]

// Darsning adashishlari (§11). `at` — kontrprimer uchun SON, «xato haqida
// matn» emas: tahlil son qo'yish bilan quriladi (§10.1).
// Natijada BALL YO'Q, TEG bor (§0 p. 6): nazariy dars baholanmaydi.
export const MISS = {
  'З1': {
    what: L(
      "hadga qisqartirish, ko'paytuvchiga emas",
      'сокращение по слагаемому, а не по множителю',
      'cancelling a term instead of a factor',
    ),
    wrong: '(a+3)/3 = a',
    at: 3,
  },
  'З2': {
    what: L(
      "qisqartirishda ODZ yo'qoldi",
      'при сокращении потеряна ОДЗ',
      'the domain was lost while reducing',
    ),
    wrong: '(a*a-4)/(a-2) = a+2',
    at: 2,
  },
  'З15': {
    what: L(
      "qadamlar tartibi: ajratmasdan qisqartirdi",
      'порядок шагов: сократил до разложения на множители',
      'step order: cancelled before factorising',
    ),
    wrong: '(2*x+6)/(x*x-9)',
    at: 1,
  },
  'З16': {
    what: L(
      "javob son bilan tekshirilmadi",
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 1,
  },
}

// ============================================================
// Umumiy ramka
// ============================================================
function Frame({
  meta, screen, audio, solved, onPrev, onNext, onFinish, finished, field,
  notes, onNotes, children,
}) {
  const t = useT()
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === TOTAL - 1
  const hook = screen === 0
  // Xukda «Orqaga» tugmasi YO'Q (§13, «Ekran 1 va 8 batafsil»).
  const back = hook ? null : <Btn tone="ghost" onClick={onPrev}>{t(UI_TXT.back)}</Btn>
  const next = last
    ? (
      <Btn tone="solid" onClick={onFinish} disabled={finished} ready={!finished}>
        {finished ? t(UI_TXT.saved) : t(UI_TXT.finish)}
      </Btn>
    )
    : <Btn tone="solid" onClick={onNext} disabled={!canNext} ready={solved}>{t(UI_TXT.next)}</Btn>
  return (
    <Stage
      eyebrow={t(meta.eyebrow)}
      right={meta.right ? t(meta.right) : null}
      screen={screen}
      total={TOTAL}
      audio={audio}
      back={back}
      next={next}
      field={field}
      notes={notes}
      onNotes={onNotes}
    >
      <Title>{t(meta.title)}</Title>
      {meta.lead ? <Lead>{t(meta.lead)}</Lead> : null}
      {children}
    </Stage>
  )
}

// ============================================================
// EKRAN 1. XUK. Ikki yozuv: qaysi biri aynan teng?
// Baholanadi: XULOSA, taxmin emas.
// ============================================================
const S1 = {
  eyebrow: L('RATSIONAL KASRLARNI QISQARTIRISH', 'СОКРАЩЕНИЕ РАЦИОНАЛЬНЫХ ДРОБЕЙ', 'REDUCING RATIONAL FRACTIONS'),
  title: L(
    "Bitta kasrdan ikki yozuv olindi. Ikkisi ham ishonarli",
    'Из одной дроби получили две записи. Обе выглядят правдоподобно',
    'Two records were obtained from one fraction. Both look plausible',
  ),
  audio: [
    { on: 'mount', text: L(
      "Bitta kasrdan ikki yozuv olindi. Ikkisi ham qisqartirish natijasiga o'xshaydi.",
      'Из одной дроби получили две записи. Обе похожи на результат сокращения.',
      'Two records came from one fraction. Both look like the result of reducing.',
    ) },
    { on: 'sub1', wait: true, text: L(
      "a o'rniga istalgan son qo'ying va qiymatlarga qarang.",
      'Подставь любое число вместо a и посмотри на значения.',
      'Substitute any number for a and look at the values.',
    ) },
    { on: 'sub2', wait: true, text: L(
      'Yana bitta son bilan tekshiring.',
      'Проверь ещё одним числом.',
      'Check with one more number.',
    ) },
    { on: 'ask', wait: true, text: L(
      "Qaysi yozuv boshlang'ich kasrga aynan teng?",
      'Какая запись тождественно равна исходной?',
      'Which record is identically equal to the original?',
    ) },
  ],
  rows: [
    { id: 'src', expr: '(a+3)/3', show: <><Frac num="a + 3" den="3" /></> },
    { id: 'v1', expr: 'a', show: <>(1)&nbsp;&nbsp;a</> },
    { id: 'v2', expr: 'a/3+1', show: <>(2)&nbsp;&nbsp;<Frac num="a" den="3" /> + 1</> },
  ],
  ask: {
    question: L(
      "Qaysi yozuv boshlang'ich kasrga aynan teng?",
      'Какая запись тождественно равна исходной?',
      'Which record is identically equal to the original?',
    ),
    items: [
      { id: 'v1', label: L('birinchisi', 'первая', 'the first'), hint: L(
        "a = 5 da boshlang'ich kasr 2,67 berdi, birinchi yozuv esa 5. Bitta shunday son yetarli.",
        'При a = 5 исходная дала 2,67, а первая запись 5. Одного такого числа достаточно.',
        'At a = 5 the original gave 2.67 and the first record 5. One such number is enough.',
      ) },
      { id: 'v2', label: L('ikkinchisi', 'вторая', 'the second'), correct: true },
    ],
  },
  after: L(
    "Bitta sondagi farq masalani yopadi. Uchta sonda mos kelishi esa hech narsani isbotlamaydi: isbot — bu almashtirish, biz uni hozir qilamiz.",
    'Расхождение при одном числе закрывает вопрос. Совпадение при трёх ничего не доказывает: доказательство это преобразование, и мы его сделаем.',
    'One mismatch closes the question. Three matches prove nothing: a proof is a transformation, and we will do it.',
  ),
}

function Screen1({ audio, onSolved }) {
  return (
    <Substitute
      rows={S1.rows}
      varName="a"
      ask={S1.ask}
      minChecked={2}
      tone="cool"
      audio={audio}
      after={S1.after}
      onSolved={onSolved}
    />
  )
}

// ============================================================
// EKRAN 2. TAYANCH. Baholanmaydi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L('Uch yozuv. Javobni o\'zingiz yozing', 'Три записи. Ответ набери сам', 'Three records. Type the answer yourself'),
  audio: [
    { on: 'mount', text: L(
      "Yangi mavzudan oldin uch yozuv. Javobni o'zingiz yozing.",
      'Три записи перед новой темой. Ответ набирай сам.',
      'Three records before the new topic. Type the answers yourself.',
    ) },
    { on: 't1', wait: true, text: L(
      "Ikkinchisi: ko'paytuvchilarga ajratish.",
      'Второе: разложи на множители.',
      'Second: factorise.',
    ) },
    { on: 't2', wait: true, text: L(
      "Uchinchisi: kasr qachon ma'noga ega bo'lmaydi.",
      'Третье: когда у дроби нет смысла.',
      'Third: when a fraction has no meaning.',
    ) },
  ],
  items: [
    {
      prompt: L('Qisqartiring:', 'Сократи:', 'Reduce:'),
      show: <Frac num="12" den="18" />,
      answer: '2/3',
      closed: '12/18 = 2/3',
      hints: {
        '4/6': L(
          "To'g'ri tenglik, lekin 4 va 6 yana 2 ga bo'linadi. Oxirigacha qisqartiring.",
          'Это верное равенство, но 4 и 6 ещё делятся на 2. Сократи до конца.',
          'A true equality, but 4 and 6 still divide by 2. Reduce fully.',
        ),
        '6/9': L('6 ham, 9 ham 3 ga bo\'linadi.', 'И 6, и 9 делятся на 3.', 'Both 6 and 9 divide by 3.'),
      },
    },
    {
      prompt: L("Ko'paytuvchilarga ajrating:  5a + 15", 'Разложи на множители:  5a + 15', 'Factorise:  5a + 15'),
      answer: '5*(a+3)',
      closed: '5a + 15 = 5(a + 3)',
      hints: {
        '5(a+15)': L('Qavsni oching: 5a + 75 chiqadi.', 'Раскрой обратно: выйдет 5a + 75.', 'Expand it back: you get 5a + 75.'),
      },
    },
    {
      prompt: L(
        "Qanday a da  1/(a - 2)  kasr ma'noga ega emas",
        'При каких a дробь  1/(a − 2)  не имеет смысла',
        'For which a does  1/(a − 2)  have no meaning',
      ),
      kind: 'odz',
      excluded: [2],
      varName: 'a',
      closed: 'a != 2',
      hints: {
        'a!=0': L(
          "Nolni qo'ying: maxrajda -2 chiqadi, bo'lish mumkin.",
          'Подставь нуль: в знаменателе −2. Делить можно.',
          'Substitute zero: the denominator is −2. Division is fine.',
        ),
      },
    },
  ],
}

function Screen2({ audio, onSolved }) {
  return <TaskChain items={S2.items} audio={audio} onSolved={onSolved} />
}

// ============================================================
// EKRAN 3. BIRINCHI MODEL: kasrning asosiy xossasi ishda.
// ============================================================
const S3 = {
  eyebrow: L('KASRNING ASOSIY XOSSASI', 'ОСНОВНОЕ СВОЙСТВО ДРОБИ', 'THE BASIC PROPERTY OF A FRACTION'),
  title: L(
    'Qisqartirish — surat va maxrajni umumiy ko\'paytuvchiga bo\'lish',
    'Сократить — значит разделить числитель и знаменатель на их общий множитель',
    'To reduce means to divide numerator and denominator by their common factor',
  ),
  audio: [
    { on: 'mount', text: L(
      "Kasrning asosiy xossasini o'tgan darsdan bilasiz. Qisqartirish — xuddi o'sha, faqat bo'lish bilan.",
      'Основное свойство дроби ты знаешь с прошлого урока. Сокращение это оно же, только делением.',
      'You know the basic property from the last lesson. Reducing is the same thing, by division.',
    ) },
    { on: 'f1', text: L(
      "Suratni ko'paytma shaklida yozing.",
      'Запиши числитель в виде произведения.',
      'Write the numerator as a product.',
    ) },
    { on: 'f2', wait: true, text: L(
      "Endi umumiy ko'paytuvchiga bo'lgandan keyin nima qolishini yozing.",
      'Теперь запиши, что останется после деления на общий множитель.',
      'Now write what remains after dividing by the common factor.',
    ) },
  ],
  fields: [
    {
      ask: L('1. Suratni ko\'paytma shaklida yozing', '1. Запиши числитель в виде произведения', '1. Write the numerator as a product'),
      answer: '5*a+15',
      hints: {
        '5(a+15)': L('a = 1 da sizda 80, suratda esa 20.', 'Проверь при a = 1: у тебя 80, в числителе 20.', 'At a = 1 yours gives 80, the numerator gives 20.'),
        'a+3': L(
          'Bu allaqachon natija. Avval surat ko\'paytma shaklida kerak.',
          'Это уже результат. Сначала нужен числитель в виде произведения.',
          'That is already the result. First the numerator as a product.',
        ),
      },
    },
    {
      ask: L('2. Qisqartirish natijasini yozing', '2. Запиши результат сокращения', '2. Write the result of reducing'),
      answer: 'a+3',
      hints: {
        'a+15': L('a = 1 da boshlang\'ich kasr 4, sizning yozuvingiz 16.', 'Проверь при a = 1: исходная дробь даёт 4, твоя запись 16.', 'At a = 1 the original gives 4, yours 16.'),
        '5a+3': L(
          "Ko'paytmaning ikki ko'paytuvchisini ham bo'lish kerak, bittasini emas.",
          'Разделить надо оба множителя произведения, а не один.',
          'Both factors of the product must be divided, not one.',
        ),
      },
    },
  ],
  show: (
    <>
      <Row size="row">(a · c) / (b · c) = a / b,&nbsp;&nbsp;c ≠ 0</Row>
      <Row size="big" align="center"><Frac num="5a + 15" den="5" size="big" /></Row>
    </>
  ),
}

function Screen3({ audio, onSolved }) {
  return <Fields show={S3.show} fields={S3.fields} audio={audio} onSolved={onSolved} />
}

// ============================================================
// EKRAN 4. FARQLASH: qisqartirish va HADLAB bo'lish — boshqa amallar.
// Bu yerda З4 yashaydi va xuk yopiladi.
// ============================================================
const S4 = {
  eyebrow: L('IKKI XIL AMAL', 'ДВА РАЗНЫХ ДЕЙСТВИЯ', 'TWO DIFFERENT OPERATIONS'),
  title: L(
    'Birinchi ekrandagi kasrga qaytamiz',
    'Вернёмся к дроби с первого экрана',
    'Back to the fraction from the first screen',
  ),
  audio: [
    { on: 'mount', text: L(
      "Birinchi ekrandagi kasrga qaytamiz. Unda umumiy ko'paytuvchi yo'q: suratda yig'indi turadi.",
      'Вернёмся к дроби с первого экрана. Общего множителя в ней нет: в числителе сумма.',
      'Back to the first fraction. There is no common factor: the numerator is a sum.',
    ) },
    { on: 'f1', text: L(
      "Lekin har bir qo'shiluvchini uchga alohida bo'lish mumkin. Nima chiqishini yozing.",
      'Но разделить на три можно каждое слагаемое по отдельности. Запиши, что получится.',
      'But each term can be divided by three separately. Write what you get.',
    ) },
    { on: 'done', wait: true, text: L(
      "Faqat bu qisqartirish emas. Qisqartirish — umumiy ko'paytuvchiga bo'lish, bu yerda esa har bir qo'shiluvchini bo'ldik.",
      'Только это не сокращение. Сокращение это деление на общий множитель, а здесь мы делили каждое слагаемое.',
      'But this is not reducing. Reducing divides by a common factor; here we divided each term.',
    ) },
  ],
  show: (
    <>
      <Row size="big" align="center"><Frac num="a + 3" den="3" size="big" /></Row>
      <Row size="sm" tone="ink2">
        {' '}
      </Row>
    </>
  ),
  fields: [
    {
      ask: L(
        'Suratni 3 ga hadlab bo\'ling',
        'Раздели числитель на 3 почленно',
        'Divide the numerator by 3 term by term',
      ),
      answer: 'a/3+1',
      hints: {
        a: L(
          "a = 5 da boshlang'ich kasr 2,67, a esa 5. Suratdagi uchlik ko'paytuvchi emas.",
          'При a = 5 исходная дробь даёт 2,67, а a даёт 5. Тройка в числителе не множитель.',
          'At a = 5 the original gives 2.67, while a gives 5. The three is not a factor.',
        ),
        'a+1': L('a = 5 da boshlang\'ich 2,67, sizning yozuvingiz 6.', 'Проверь при a = 5: исходная 2,67, твоя запись 6.', 'At a = 5 the original is 2.67, yours is 6.'),
        'a/3+3': L(
          "Suratdagi uchlikni ham uchga bo'lish kerak.",
          'Тройку в числителе тоже надо разделить на три.',
          'The three in the numerator must also be divided by three.',
        ),
      },
    },
  ],
  note: L(
    "Bu yerda qisqartirish BO'LMADI: umumiy ko'paytuvchini emas, har bir qo'shiluvchini bo'ldik.",
    'Сокращения здесь не было: делили каждое слагаемое, а не общий множитель.',
    'There was no reducing here: we divided each term, not a common factor.',
  ),
}

function Screen4({ audio, onSolved }) {
  return <Fields show={S4.show} fields={S4.fields} note={S4.note} audio={audio} onSolved={onSolved} />
}

// ============================================================
// EKRAN 5. IKKINCHI TASVIR: ANIQLANISH SOHASI (ODZ).
// ============================================================
const S5 = {
  eyebrow: L('ANIQLANISH SOHASI', 'ОБЛАСТЬ ДОПУСТИМЫХ ЗНАЧЕНИЙ', 'DOMAIN OF ADMISSIBLE VALUES'),
  title: L(
    "O'zgaruvchining ifoda ma'noga ega bo'ladigan qiymatlari — aniqlanish sohasi, ODZ",
    'Значения переменной, при которых выражение имеет смысл, называют областью допустимых значений — ОДЗ',
    'The values for which an expression makes sense are its domain',
  ),
  audio: [
    { on: 'mount', text: L(
      "O'zgaruvchining ifoda ma'noga ega bo'ladigan qiymatlari aniqlanish sohasi deyiladi. Qisqacha ODZ.",
      'Значения переменной, при которых выражение имеет смысл, называют областью допустимых значений. Сокращённо ОДЗ.',
      'The values of the variable for which the expression makes sense are called its domain.',
    ) },
    { on: 'f1', text: L(
      'Bu kasrning ODZ ini yozing.',
      'Запиши ОДЗ этой дроби.',
      'Write the domain of this fraction.',
    ) },
    { on: 'done', wait: true, text: L(
      "Bu satr endi darsning oxirigacha har yozuv ostida turadi.",
      'Эта строка теперь стоит под каждой записью до конца урока.',
      'This line now stays under every record until the end of the lesson.',
    ) },
  ],
  show: <Row size="big" align="center"><Frac num="a² − 4" den="a − 2" size="big" /></Row>,
  fields: [
    {
      ask: L('Bu kasrning ODZ i:', 'ОДЗ этой дроби:', 'The domain of this fraction:'),
      kind: 'odz',
      of: '(a*a-4)/(a-2)',
      varName: 'a',
      hints: {
        'a!=-2': L(
          "Ma'no MAXRAJ tufayli yo'qoladi. Unda nima nolga aylanadi?",
          'Смысл теряется из-за знаменателя. Что в нём обращается в нуль?',
          'Meaning is lost because of the denominator. What makes it zero?',
        ),
        'a!=2,a!=-2': L(
          "Minus ikkini qo'ying: maxraj minus to'rtga teng, kasr hisoblanadi.",
          'Подставь минус два: знаменатель равен минус четырём, дробь считается.',
          'Substitute minus two: the denominator is minus four, the fraction works.',
        ),
      },
    },
  ],
  note: L(
    "ODZ ni siz o'zingiz qo'ydingiz. Endi uni ushlab turish ham sizning ishingiz.",
    'ОДЗ ты поставил сам. Дальше удерживать её — тоже твоя работа.',
    'You wrote the domain yourself. Keeping it is your job too.',
  ),
}

function Screen5({ audio, onSolved }) {
  return <Fields show={S5.show} fields={S5.fields} note={S5.note} audio={audio} onSolved={onSolved} />
}

// ============================================================
// EKRAN 6. O'QUVCHI O'ZI QISQARTIRADI. ODZ o'zgarmaydi.
// ============================================================
const S6 = {
  eyebrow: L('QISQARTIRISH', 'СОКРАЩЕНИЕ', 'REDUCING'),
  title: L(
    'Qisqartiring. Yozuv ostidagi ODZ satri — sizning',
    'Сократи. Строка ОДЗ под записью — твоя',
    'Reduce it. The domain line below is yours',
  ),
  audio: [
    { on: 'mount', text: L(
      "Bu kasrni qisqartiring. Ajratishni o'zingiz yozing.",
      'Сократи эту дробь. Разложение набери сам.',
      'Reduce this fraction. Type the factorisation yourself.',
    ) },
    { on: 's1', wait: true, text: L(
      "Endi umumiy ko'paytuvchi ikki qavatda ham ko'rinadi. Unga bo'ling.",
      'Теперь общий множитель виден в обоих этажах. Раздели на него.',
      'Now the common factor is visible in both levels. Divide by it.',
    ) },
    { on: 's2', wait: true, text: L(
      'ODZ satriga qarang. U o\'zgardimi?',
      'Посмотри на строку ОДЗ. Она изменилась?',
      'Look at the domain line. Did it change?',
    ) },
  ],
  odz: 'a ≠ 2',
  start: <Frac num="a² − 4" den="a − 2" />,
  actions: [
    { id: 'fact', label: L('suratni ajratish', 'разложить числитель', 'factorise the numerator') },
    { id: 'cancel', label: L('qisqartirish', 'сократить', 'cancel') },
  ],
  steps: [
    {
      action: 'fact',
      ask: L('Ajratishni yozing', 'Запиши разложение', 'Type the factorisation'),
      answer: '(a-2)*(a+2)',
      show: <Frac num="(a − 2)(a + 2)" den="a − 2" />,
      wrongs: [
        { action: 'cancel', hint: L(
          "Umumiy ko'paytuvchi hozircha yo'q: suratda yig'indi. Ajratish kerak.",
          'Общего множителя пока нет: в числителе сумма. Разложи.',
          'There is no common factor yet: the numerator is a sum. Factorise.',
        ) },
      ],
      hints: {
        '(a-2)(a-2)': L('a = 0 da sizda 4, suratda esa -4.', 'Проверь при a = 0: у тебя 4, в числителе −4.', 'At a = 0 yours gives 4, the numerator −4.'),
      },
    },
    {
      action: 'cancel',
      ask: L('Natijani yozing', 'Запиши результат', 'Type the result'),
      answer: 'a+2',
      show: <>a + 2</>,
      wrongs: [
        { action: 'fact', hint: L(
          'Surat allaqachon ajratilgan.',
          'Числитель уже разложен.',
          'The numerator is already factorised.',
        ) },
      ],
      hints: {
        'a*a-2': L('a = 3 da boshlang\'ich kasr 5, sizning yozuvingiz 7.', 'Проверь при a = 3: исходная дробь даёт 5, твоя запись 7.', 'At a = 3 the original gives 5, yours 7.'),
        'a-2': L(
          "Maxrajdagi ko'paytuvchi qisqardi. Suratda nima qoldi?",
          'Множитель знаменателя сократился. Что осталось в числителе?',
          'The denominator factor cancelled. What is left in the numerator?',
        ),
      },
    },
  ],
  foot: L(
    "ODZ o'zgarmadi: shart boshlang'ich maxrajdan olingan.",
    'ОДЗ не изменилась: условие взято по исходному знаменателю.',
    'The domain did not change: it came from the original denominator.',
  ),
}

function Screen6({ audio, onSolved }) {
  return (
    <Transform
      start={S6.start}
      steps={S6.steps}
      actions={S6.actions}
      odz={S6.odz}
      foot={S6.foot}
      audio={audio}
      onSolved={onSolved}
    />
  )
}

// ============================================================
// EKRAN 7. KASHFIYOT: chegara nuqtasi. Darsning ma'no burilishi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA NUQTASIDA TEKSHIRISH', 'ПРОВЕРКА В ГРАНИЧНОЙ ТОЧКЕ', 'CHECKING AT THE BOUNDARY POINT'),
  title: L(
    'Ikki yozuvni a = 3 va a = 2 da solishtiramiz',
    'Сравним обе записи при a = 3 и при a = 2',
    'Compare both records at a = 3 and at a = 2',
  ),
  audio: [
    { on: 'mount', text: L(
      "Ikki yozuvni ikki nuqtada solishtiramiz. Avval a uchga teng bo'lganda.",
      'Сравним обе записи в двух точках. Сначала при a равном трём.',
      'Compare both records at two points. First at a equal to three.',
    ) },
    { on: 'sub1', wait: true, text: L(
      'Qiymatlar mos keldi.',
      'Значения совпали.',
      'The values matched.',
    ) },
    { on: 'sub2', wait: true, text: L(
      "Endi a ikkiga teng bo'lganda. Chapda nol bo'linadi nolga: qiymat yo'q, nolga bo'linmaydi. O'ngda esa to'rt, va u bor.",
      'Теперь при a равном двум. Слева нуль делить на нуль: значения нет, на нуль не делят. Справа четыре, и оно есть.',
      'Now at a equal to two. On the left zero over zero: no value, division by zero is impossible. On the right four, and it exists.',
    ) },
    { on: 'ask', text: L(
      "Demak tenglik hamma a da emas, balki boshlang'ich kasrning ODZ ida to'g'ri. Qanday a da yozuvlar teng emas — yozing.",
      'Значит равенство верно не при всех a, а на ОДЗ исходной дроби. Запиши, при каком a записи не равны.',
      'So the equality holds not for all a but on the domain of the original fraction. Write for which a the records differ.',
    ) },
  ],
  // Redaksiya 2: bu ekranning asbobi — Boundary (§13). Chegara AYNAN shu yerda
  // bo'lishi kerak: u tushuntirish, mashq emas. Qoida shuning uchun kerak.
  left: <Frac num="a² − 4" den="a − 2" />,
  right: <>a + 2</>,
  odzLeft: 'a ≠ 2',
  odzRight: '—',
  question: L(
    'Qanday a da yozuvlar boshqa natija beradi?',
    'При каком a записи дают разные результаты?',
    'For which a do the records give different results?',
  ),
  answer: [2],
  hints: {
    '-2': L(
      "Minus ikkini qo'ying: chapda nol, o'ngda ham nol. Yozuvlar mos keldi.",
      'Подставь минус два: слева нуль, справа нуль. Записи совпали.',
      'Substitute minus two: zero on the left, zero on the right. They matched.',
    ),
    '0': L(
      "Nolni qo'ying: chapda ikki, o'ngda ikki.",
      'Подставь нуль: слева два, справа два.',
      'Substitute zero: two and two.',
    ),
    '*': L(
      "ODZ satrlarini solishtiring: chapda taqiq bor, o'ngda yo'q.",
      'Сравни строки ОДЗ: слева запрет есть, справа его нет.',
      'Compare the domain lines: the left has a restriction, the right does not.',
    ),
  },
  note: L(
    "a = 2 da chapda nol bo'linadi nolga: bu nol ham, bir ham emas, bu qiymatning YO'QLIGI. O'ngda esa to'rt.",
    'При a = 2 слева нуль делить на нуль: это не нуль и не единица, это отсутствие значения. А справа четыре.',
    'At a = 2 the left is zero over zero: neither zero nor one, but the absence of a value. The right gives four.',
  ),
}

function Screen7({ audio, onSolved }) {
  return (
    <Boundary
      left={S7.left}
      right={S7.right}
      odzLeft={S7.odzLeft}
      odzRight={S7.odzRight}
      question={S7.question}
      answer={S7.answer}
      hints={S7.hints}
      note={S7.note}
      audio={audio}
      onSolved={onSolved}
    />
  )
}

// ============================================================
// EKRAN 8. QOIDA. Tushuntirishning OXIRGI ekrani (§13).
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Darsning uch tasdig\'i', 'Три утверждения урока', 'The three statements of the lesson'),
  audio: [
    { on: 'mount', text: L(
      "Chegara nuqtasini o'zingiz topdingiz. Endi shu ishning nomini o'qiymiz, lekin avval bitta savol.",
      'Граничную точку ты нашёл сам. Сейчас прочитаем название того, что ты сделал, но сначала один вопрос.',
      'You found the boundary point yourself. Now we will read the name of what you did, but first one question.',
    ) },
    { on: 'ask', text: L(
      "Qisqartirish bilan olingan tengliklarni belgilang. Ular bittadan ko'p.",
      'Отметь равенства, которые получены сокращением. Их больше одного.',
      'Mark the equalities obtained by reducing. There is more than one.',
    ) },
    { on: 'card', wait: true, text: L(
      "Endi qoida. Faqat umumiy ko'paytuvchiga qisqartiriladi, yig'indi avval ko'paytuvchilarga ajratiladi. Qisqartirish ODZ ni o'zgartirmaydi: u boshlang'ich maxrajdan olinadi. Va uchinchisi: son qo'yish rad etadi, lekin isbotlamaydi.",
      'Теперь правило. Сокращают только на общий множитель, сумму сначала разлагают на множители. Сокращение не меняет ОДЗ: её берут по исходному знаменателю. И третье: подстановка опровергает, но не доказывает.',
      'Now the rule. Cancel only a common factor; factorise a sum first. Reducing does not change the domain. And third: substitution refutes but does not prove.',
    ) },
  ],
  card: {
    title: L('QOIDA', 'ПРАВИЛО', 'RULE'),
    lines: [
      L('(a · c)/(b · c) = a/b,   c ≠ 0', '(a · c)/(b · c) = a/b,   c ≠ 0', '(a · c)/(b · c) = a/b,   c ≠ 0'),
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    source: L(
      'Algebra 8-sinf, ratsional kasrlar bo\'limi — bet va parag\'raf kontent bosqichida',
      'Алгебра 8 класс, параграф о рациональных дробях — номер и страница на этапе контента',
      'Algebra 8, section on rational fractions — page and number at the content stage',
    ),
    locked: L(
      "Qoida to'g'ri javobdan keyin ochiladi",
      'Правило откроется после верного ответа',
      'The rule opens after a correct answer',
    ),
  },
  check: {
    question: L(
      'Qisqartirish bilan olingan tengliklarni belgilang',
      'Отметь равенства, полученные сокращением',
      'Mark the equalities obtained by reducing',
    ),
    items: [
      { id: 'a', label: '(5a + 15)/5 = a + 3', right: true },
      { id: 'b', label: '(a + 3)/3 = a/3 + 1', hint: L(
        "Tenglik to'g'ri, lekin bu hadlab bo'lish, qisqartirish emas. 4-ekran.",
        'Равенство верное, но это почленное деление, а не сокращение. Экран 4.',
        'The equality is true, but that is term-by-term division, not reducing. Screen 4.',
      ) },
      { id: 'c', label: '(2a)/(2b) = a/b', right: true },
    ],
    more: L(
      "Qisqartirish bilan olingani bitta emas. Qolganini ham tekshiring.",
      'Сокращением получено не одно равенство. Проверь остальные.',
      'More than one equality was obtained by reducing. Check the rest.',
    ),
    done: L(
      "Ikkisida ham umumiy ko'paytuvchiga bo'lindi.",
      'В обоих делили на общий множитель.',
      'In both, a common factor was divided out.',
    ),
  },
}

function Screen8({ audio, onSolved }) {
  return <RuleBlock card={S8.card} check={S8.check} audio={audio} onSolved={onSolved} />
}

// ============================================================
// EKRAN 9. AMALIYOT: birgalikda. To'rt qisqa topshiriq.
// ============================================================
const S9 = {
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Qisqartiring. Qisqartirish mumkin bo'lmasa — shunday deng",
    'Сократи. Если сокращать нечего — скажи это',
    'Reduce. If there is nothing to cancel, say so',
  ),
  audio: [
    { on: 'mount', text: L(
      "Kasrni qisqartiring. Umumiy ko'paytuvchi bo'lmasa, shunday deng.",
      'Сократи дробь. Если общего множителя нет, так и скажи.',
      'Reduce the fraction. If there is no common factor, say so.',
    ) },
    { on: 't3', wait: true, text: L(
      'Bu yerda maxrajda ham harf bor. ODZ satriga qarang.',
      'Здесь в знаменателе тоже буква. Посмотри на строку ОДЗ.',
      'Here the denominator has a letter too. Look at the domain line.',
    ) },
  ],
  items: [
    {
      show: <Frac num="4x + 8" den="4" />,
      answer: 'x+2',
      none: false,
      closed: '(4x + 8)/4 = x + 2',
      hints: {
        'x+8': L('x = 1 da boshlang\'ich 3, sizda 9.', 'Подставь x = 1: у исходной 3, у тебя 9.', 'At x = 1 the original gives 3, yours 9.'),
        '4x+2': L('x = 1 da boshlang\'ich 3, sizda 6.', 'Подставь x = 1: у исходной 3, у тебя 6.', 'At x = 1 the original gives 3, yours 6.'),
      },
    },
    {
      show: <Frac num="10a − 5" den="5" />,
      answer: '2*a-1',
      none: false,
      closed: '(10a − 5)/5 = 2a − 1',
      hints: {
        '2a-5': L('a = 1 da boshlang\'ich 1, sizda -3.', 'Подставь a = 1: у исходной 1, у тебя −3.', 'At a = 1 the original gives 1, yours −3.'),
        '2a': L("Besh bo'linadi beshga — bu bir, nol emas.", 'Пять на пять это единица, а не нуль.', 'Five over five is one, not zero.'),
      },
    },
    {
      show: <Frac num="7 + b" den="7" />,
      answer: '(7+b)/7',
      none: true,
      closed: L('(7 + b)/7 — qisqartirish mumkin emas', '(7 + b)/7 — сократить нельзя', '(7 + b)/7 — cannot be reduced'),
      hints: {
        b: L('b = 7 da boshlang\'ich 2, sizda 7.', 'Подставь b = 7: у исходной 2, у тебя 7.', 'At b = 7 the original gives 2, yours 7.'),
        '1+b': L('b = 7 da boshlang\'ich 2, sizda 8.', 'Подставь b = 7: у исходной 2, у тебя 8.', 'At b = 7 the original gives 2, yours 8.'),
      },
    },
    {
      show: <Frac num="3a² − 6a" den="3a" />,
      answer: 'a-2',
      none: false,
      closed: '(3a² − 6a)/(3a) = a − 2,  a ≠ 0',
      hints: {
        'a*a-2*a': L(
          "Bo'lish kerak edi, ko'paytirish emas.",
          'Здесь надо делить, а не умножать.',
          'Here you divide, not multiply.',
        ),
        'a-6*a': L(
          "Ikki ko'paytuvchini ham bo'ling: 3a² ni ham, 6a ni ham.",
          'Раздели оба слагаемых: и 3a², и 6a.',
          'Divide both terms: 3a² and 6a.',
        ),
      },
    },
  ],
}

function Screen9({ audio, onSolved }) {
  return (
    <>
      <TaskChain items={S9.items} audio={audio} onSolved={onSolved} />
    </>
  )
}

// ============================================================
// EKRAN 10. AMALIYOT: yo'naltirilgan. Maxrajda ikki ko'paytuvchi.
// ============================================================
const S10 = {
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qisqartiring va ODZ ni yozing', 'Сократи и запиши ОДЗ', 'Reduce and write the domain'),
  audio: [
    { on: 'mount', text: L(
      "Bu yerda ikki qavatni ham ajratish kerak. ODZ dan boshlang.",
      'Здесь раскладывать надо оба этажа. Начни с ОДЗ.',
      'Here both levels must be factorised. Start with the domain.',
    ) },
    { on: 'f1', text: L(
      "ODZ da shartlar bittadan ko'p bo'lishi mumkin.",
      'Условий в ОДЗ может быть больше одного.',
      'The domain may have more than one condition.',
    ) },
    { on: 's1', wait: true, text: L(
      'Endi ajratib qisqartiring.',
      'Теперь разложи и сократи.',
      'Now factorise and cancel.',
    ) },
  ],
  odzField: {
    ask: L('Boshlang\'ich kasrning ODZ i', 'ОДЗ исходной дроби', 'Domain of the original fraction'),
    kind: 'odz',
    of: '(a*a-9)/(a*a+3*a)',
    varName: 'a',
    hints: {
      'a!=0': L(
        "Maxraj ikki ko'paytuvchiga ajraladi. Ikkinchisi ham nolga aylanadi.",
        'Знаменатель разложен на два множителя. Второй тоже обращается в нуль.',
        'The denominator has two factors. The second also becomes zero.',
      ),
      'a!=3': L(
        "Uchni qo'ying: maxraj o'n sakkizga teng, hisoblanadi.",
        'Подставь тройку: знаменатель равен восемнадцати. Считается.',
        'Substitute three: the denominator is eighteen. It works.',
      ),
    },
  },
  start: <Frac num="a² − 9" den="a² + 3a" />,
  actions: [
    { id: 'fact', label: L('ikki qavatni ajratish', 'разложить оба этажа', 'factorise both levels') },
    { id: 'cancel', label: L('qisqartirish', 'сократить', 'cancel') },
  ],
  steps: [
    {
      action: 'fact',
      ask: L('Ajratishni yozing', 'Запиши разложение', 'Type the factorisation'),
      answer: '(a-3)*(a+3)/(a*(a+3))',
      show: <Frac num="(a − 3)(a + 3)" den="a(a + 3)" />,
      wrongs: [
        { action: 'cancel', hint: L(
          "Umumiy ko'paytuvchi hozircha ko'rinmaydi. Avval ajratish.",
          'Общего множителя пока не видно. Сначала разложи.',
          'No common factor yet. Factorise first.',
        ) },
      ],
      hints: {},
    },
    {
      action: 'cancel',
      ask: L('Natijani yozing', 'Запиши результат', 'Type the result'),
      answer: '(a-3)/a',
      show: <Frac num="a − 3" den="a" />,
      wrongs: [],
      hints: {
        '(a+3)/a': L(
          "Qisqargan ko'paytuvchi a plus uch edi. Suratda nima qoldi?",
          'Сократился множитель a плюс три. Что осталось в числителе?',
          'The factor a plus three cancelled. What is left in the numerator?',
        ),
      },
    },
  ],
  foot: L(
    "a plus uch ko'paytuvchisi yozuvdan chiqdi, ODZ dan esa chiqmadi.",
    'Множитель a плюс три ушёл из записи, а из ОДЗ нет.',
    'The factor a plus three left the record but not the domain.',
  ),
}

function Screen10({ audio, onSolved }) {
  const [odzOk, setOdzOk] = useState(false)
  return (
    <>
      <Slot mh={66}>
        {!odzOk ? <Fields fields={[S10.odzField]} audio={audio} onSolved={() => setOdzOk(true)} /> : null}
      </Slot>
      {odzOk ? (
        <Transform
          start={S10.start}
          steps={S10.steps}
          actions={S10.actions}
          odz="a ≠ 0,  a ≠ −3"
          foot={S10.foot}
          audio={audio}
          onSolved={onSolved}
        />
      ) : null}
    </>
  )
}

// ============================================================
// EKRAN 11. MUSTAQIL. Yordam YO'Q.
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМОСТОЯТЕЛЬНО', 'ON YOUR OWN'),
  title: L(
    'Qisqartiring va ODZ ni yozing. Oraliq qadamlar — o\'zingiz uchun',
    'Сократи дробь и запиши ОДЗ. Промежуточные шаги — как удобно',
    'Reduce and write the domain. Intermediate steps are up to you',
  ),
  audio: [
    { on: 'mount', text: L(
      "Endi mustaqil, yordamsiz. Qisqartiring va ODZ ni yozing.",
      'Теперь сам, без подсказок. Сократи и запиши ОДЗ.',
      'Now on your own, without prompts. Reduce and write the domain.',
    ) },
    { on: 'f1', text: L(
      "Oraliq qadamlarni ko'rsatish shart emas: natija tekshiriladi.",
      'Промежуточные шаги можешь не показывать. Проверяется результат.',
      'You need not show the intermediate steps. The result is what is checked.',
    ) },
  ],
  show: <Row size="big" align="center"><Frac num="x² − 4x" den="x² − 16" size="big" /></Row>,
  result: {
    label: L('natija', 'результат', 'result'),
    answer: 'x/(x+4)',
    hints: {
      'x/(x-4)': L('x = 1 da boshlang\'ich 0,2, sizda -0,33.', 'Проверь при x = 1: исходная даёт 0,2, твоя запись −0,33.', 'At x = 1 the original gives 0.2, yours −0.33.'),
    },
  },
  odz: {
    label: L('ODZ', 'ОДЗ', 'domain'),
    of: '(x*x-4*x)/(x*x-16)',
    varName: 'x',
    hints: {
      'x!=4': L(
        "Maxraj ikki ko'paytuvchiga ajraladi. Ikkinchisi ham nolga aylanadi.",
        'Знаменатель разлагается на два множителя. Второй тоже обращается в нуль.',
        'The denominator has two factors. The second also becomes zero.',
      ),
      'x!=-4': L(
        "ODZ boshlang'ich maxrajdan olinadi, unda ikki ko'paytuvchi bor edi.",
        'ОДЗ берут по исходному знаменателю, а в нём было два множителя.',
        'The domain comes from the original denominator, which had two factors.',
      ),
      'x!=0': L(
        "Nolni qo'ying: maxraj minus o'n oltiga teng, hisoblanadi.",
        'Подставь нуль: знаменатель равен минус шестнадцати. Считается.',
        'Substitute zero: the denominator is minus sixteen. It works.',
      ),
    },
  },
  // Redaksiya 2: ekran 11 ASBOBSIZ, va javobni o'quvchi O'ZI tekshiradi (З16).
  // Bu «xohlasang bos» tugmasi emas: son qo'yilmaguncha topshiriq yopilmaydi.
  proof: {
    ask: L(
      "Javobingizni tekshiring: ODZ dan bitta son qo'ying",
      'Проверь свой ответ: поставь одно число из ОДЗ',
      'Check your answer: put in one number from the domain',
    ),
    from: '(x*x-4*x)/(x*x-16)',
    to: 'x/(x+4)',
    varName: 'x',
    done: L('son bilan tekshirildi:', 'проверено числом:', 'checked with:'),
    diff: L(
      "Bu sonda qiymatlar mos kelmadi. Natijani qaytadan qarang.",
      'При этом числе значения не совпали. Посмотри результат ещё раз.',
      'At this number the values did not match. Look at the result again.',
    ),
    hole: L(
      "Bu son ODZ dan tashqarida: unda qiymat yo'q. Boshqa son oling.",
      'Это число вне ОДЗ: значения при нём нет. Возьми другое.',
      'This number is outside the domain: there is no value at it. Take another one.',
    ),
  },
  note: L(
    "Ikkita yozuv ham sizniki, ikkalasi ham tekshirildi.",
    'Обе записи твои, и обе проверены.',
    'Both records are yours, and both are checked.',
  ),
}

function Screen11({ audio, onSolved }) {
  return (
    <SoloTask
      show={S11.show}
      result={S11.result}
      odz={S11.odz}
      proof={S11.proof}
      note={S11.note}
      audio={audio}
      onSolved={onSolved}
    />
  )
}

// ============================================================
// EKRAN 12. BEGONA XATO: birinchi noto'g'ri satr + KONTRPRIMER.
// ============================================================
const S12 = {
  eyebrow: L('TAYYOR YECHIM', 'ГОТОВОЕ РЕШЕНИЕ', 'A FINISHED SOLUTION'),
  title: L(
    'Xato birinchi bo\'lib qaysi satrda paydo bo\'lgan?',
    'Найди строку, в которой ошибка появилась впервые',
    'Find the line where the error first appears',
  ),
  audio: [
    { on: 'mount', text: L(
      "Tayyor yechim. Xato birinchi bo'lib qaysi satrda paydo bo'lganini toping, istalgan noto'g'risini emas.",
      'Вот готовое решение. Найди строку, где ошибка появилась впервые, а не любую неверную.',
      'Here is a finished solution. Find where the error first appears, not any wrong line.',
    ) },
    { on: 'proof', wait: true, text: L(
      "Endi oxirgi satrni o'zingiz rad eting: u noto'g'ri bo'ladigan sonni ayting.",
      'Теперь опровергни последнюю строку сам: назови число, при котором она неверна.',
      'Now refute the last line yourself: give a number for which it fails.',
    ) },
  ],
  rows: [
    { id: 'r1', show: <Frac num="a² − 4" den="a − 2" size="sm" /> },
    { id: 'r2', show: <Frac num="(a − 2)(a + 2)" den="a − 2" size="sm" /> },
    { id: 'r3', show: <>a + 2&nbsp;&nbsp;<i style={{ fontStyle: 'normal', opacity: 0.7 }}>— har qanday a da / при любом a</i></> },
    { id: 'r4', show: <>a = 2 da qiymat 4 ga teng / при a = 2 значение равно 4</> },
  ],
  answerId: 'r3',
  hints: {
    r1: L(
      "Bu boshlang'ich kasr, unda xato bo'lishi mumkin emas.",
      'Это исходная дробь, ошибки в ней быть не может.',
      'This is the original fraction; it cannot contain an error.',
    ),
    r2: L(
      "Ajratish to'g'ri: istalgan son qo'yib tekshiring.",
      'Разложение верное: проверь подстановкой любого числа.',
      'The factorisation is correct: check with any number.',
    ),
    r4: L(
      'Uchinchi satrdan bu to\'g\'ri hisoblangan. Xato oldin paydo bo\'lgan.',
      'Из строки 3 это посчитано правильно. Ошибка появилась раньше.',
      'From line 3 this is computed correctly. The error came earlier.',
    ),
  },
  ask: {
    label: L('Kontrprimer', 'Контрпример', 'Counterexample'),
    of: '(a*a-4)/(a-2)',
    varName: 'a',
    note: L(
      "a = 2 da boshlang'ich kasrda qiymat yo'q, to'rtinchi satr esa uni aytadi.",
      'При a = 2 у исходной дроби значения нет, а строка 4 его называет.',
      'At a = 2 the original has no value, yet line 4 names one.',
    ),
    wrong: L(
      "Bu sonda ikki yozuv ham bir xil qiymat beradi. Ular ajraladigan son kerak.",
      'При этом числе обе записи дают одно и то же. Нужно число, при котором они расходятся.',
      'At this number both records agree. You need one where they differ.',
    ),
  },
}

function Screen12({ audio, onSolved }) {
  return <Audit rows={S12.rows} answerId={S12.answerId} hints={S12.hints} ask={S12.ask} audio={audio} onSolved={onSolved} />
}

// ============================================================
// EKRAN 13. PERENOS: TESKARI topshiriq (redaksiya 2, §13).
//    Teskari topshiriq to'g'ridan KUCHLIROQ ishlaydi va uni TAXMIN QILIB
//    BO'LMAYDI: to'g'ri javob ko'p, shuning uchun ikki xossa tekshiriladi —
//    berilgan natijaga qisqaradimi va ODZ mos keldimi.
// ============================================================
const S13 = {
  eyebrow: L('PERENOS', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    'Endi teskari tomonga: kasrni o\'zingiz quring',
    'Теперь в обратную сторону: построй дробь сам',
    'Now the other way round: build the fraction yourself',
  ),
  audio: [
    { on: 'mount', text: L(
      "Shu paytgacha kasr berilgan edi, siz qisqartirdingiz. Endi teskari: natija va ODZ berilgan, kasrni o'zingiz yozing.",
      'До сих пор дробь давали, а ты сокращал. Теперь наоборот: дан результат и дана ОДЗ, дробь запиши сам.',
      'Until now the fraction was given and you reduced it. Now the reverse: the result and the domain are given, you write the fraction.',
    ) },
    { on: 's1', text: L(
      "To'g'ri javob ko'p, shuning uchun ikki xossa tekshiriladi: qisqarishi va ODZ i.",
      'Верных ответов много, поэтому проверяются два свойства: сокращение и ОДЗ.',
      'Many answers are correct, so two properties are checked: the reduction and the domain.',
    ) },
  ],
  prompt: L(
    "a + 1 ga qisqaradigan va ODZ i  a ≠ 0  bo'lgan kasr yozing",
    'Запиши дробь, которая сокращается до a + 1 и имеет ОДЗ  a ≠ 0',
    'Write a fraction that reduces to a + 1 and has domain a ≠ 0',
  ),
  reduceTo: 'a+1',
  excluded: [0],
  varName: 'a',
  hints: {
    '((a+1)(a-3))/(a-3)': L(
      "Qisqartirish to'g'ri, lekin ODZ  a ≠ 3  chiqdi, kerakligi  a ≠ 0.",
      'Сокращается верно, но ОДЗ вышла a ≠ 3, а нужна a ≠ 0.',
      'It reduces correctly, but the domain came out a ≠ 3 instead of a ≠ 0.',
    ),
    '(a+1)/a': L(
      "ODZ to'g'ri, lekin bu kasr a + 1 ga qisqarmaydi.",
      'ОДЗ верная, но до a + 1 эта дробь не сводится.',
      'The domain is right, but this fraction does not reduce to a + 1.',
    ),
    '(3a+3)/3': L(
      "Bu yerda ODZ bo'sh: uchlik hech qachon nolga aylanmaydi.",
      'Здесь ОДЗ пустая: тройка никогда не обращается в нуль.',
      'Here the domain is empty: three never becomes zero.',
    ),
  },
  note: L(
    "Ikki xossa ham bajarildi: a + 1 ga qisqaradi va ODZ  a ≠ 0.",
    'Оба свойства выполнены: сокращается до a + 1 и ОДЗ a ≠ 0.',
    'Both properties hold: it reduces to a + 1 and the domain is a ≠ 0.',
  ),
}

function Screen13({ audio, onSolved }) {
  return (
    <Inverse
      prompt={S13.prompt}
      reduceTo={S13.reduceTo}
      excluded={S13.excluded}
      varName={S13.varName}
      hints={S13.hints}
      note={S13.note}
      audio={audio}
      onSolved={onSolved}
    />
  )
}

// ============================================================
// EKRAN 14. BLITZ (redaksiya 2, §13). To'rt savol BITTA panelda.
//
//    Savollar BELGINI so'raydi, yozuvni emas: hisoblashni o'quvchi 9-13
//    ekranlarda qildi. Bu yerda tekshiriladigan narsa — U QAYERGA QARAYDI.
//
//    BALL YO'Q (§0 p. 6): nazariy dars baholanmaydi, baho amaliyotda.
//    Birinchi urinishlardan TAYYORLIK DARAJASI yig'iladi (ekran 15).
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L('To\'rt savol — belgi haqida', 'Четыре вопроса — про признак', 'Four questions about the sign'),
  audio: [
    { on: 'mount', text: L(
      "Hisoblashni siz qildingiz. Oxirgi to'rt savol boshqa narsani so'raydi: qayerga qarash kerakligini. Baho yo'q.",
      'Считать ты уже умеешь. Последние четыре вопроса про другое: куда надо смотреть. Оценки здесь нет.',
      'You can already compute. The last four questions ask something else: where to look. There is no grade here.',
    ) },
  ],
  items: [
    {
      id: 'q1',
      tag: 'З1',
      ask: L(
        "Qaysi yozuvni qisqartirish MUMKIN?",
        'Какую запись сократить МОЖНО?',
        'Which record CAN be reduced?',
      ),
      options: [
        { id: 'a', label: L('(a + 3)/3', '(a + 3)/3', '(a + 3)/3') },
        { id: 'b', label: L('3a/3', '3a/3', '3a/3'), right: true },
      ],
      hint: L(
        "a ga uchni qo'ying: birinchi yozuv ikki beradi, a esa uch. Yig'indini qisqartirib bo'lmaydi.",
        'Подставь в a три: первая запись даёт два, а a равно трём. Сумму сокращать нельзя.',
        'Substitute three for a: the first record gives two while a is three. A sum cannot be cancelled.',
      ),
    },
    {
      id: 'q2',
      tag: 'З2',
      ask: L(
        "ODZ qaysi maxrajdan olinadi?",
        'По какому знаменателю берут ОДЗ?',
        'Which denominator gives the domain?',
      ),
      options: [
        { id: 'a', label: L("boshlang'ich", 'по исходному', 'the original one'), right: true },
        { id: 'b', label: L('qisqargandan keyingi', 'по сокращённому', 'the reduced one') },
      ],
      hint: L(
        "Ikkini qo'ying: boshlang'ich kasrda qiymat yo'q, qisqargandan keyin bor. Taqiq qayerdan kelgan?",
        'Подставь два: у исходной дроби значения нет, у сокращённой есть. Откуда взялся запрет?',
        'Substitute two: the original has no value, the reduced one does. Where did the restriction come from?',
      ),
    },
    {
      id: 'q3',
      tag: 'З15',
      ask: L(
        "(2x + 6)/(x² − 9) da BIRINCHI qadam qaysi?",
        'Какой ПЕРВЫЙ шаг в (2x + 6)/(x² − 9)?',
        'What is the FIRST step in (2x + 6)/(x² − 9)?',
      ),
      options: [
        { id: 'a', label: L("ko'paytuvchilarga ajratish", 'разложить на множители', 'factorise'), right: true },
        { id: 'b', label: L('darhol qisqartirish', 'сразу сократить', 'cancel right away') },
      ],
      hint: L(
        "Ajratmasdan umumiy ko'paytuvchi ko'rinmaydi: qisqartirishga hali hech narsa yo'q.",
        'Пока не разложил, общий множитель не виден: сокращать ещё нечего.',
        'Until you factorise, the common factor is not visible: there is nothing to cancel yet.',
      ),
    },
    {
      id: 'q4',
      tag: 'З16',
      ask: L(
        "Son qo'yish nimani qiladi?",
        'Что делает подстановка числа?',
        'What does substituting a number do?',
      ),
      options: [
        { id: 'a', label: L('rad etadi', 'опровергает', 'refutes'), right: true },
        { id: 'b', label: L('isbotlaydi', 'доказывает', 'proves') },
      ],
      hint: L(
        "Bitta son mos kelsa, yozuvlar hamma yerda teng degani emas. Isbot — almashtirish.",
        'Если при одном числе сошлось, это не значит, что записи равны везде. Доказательство — преобразование.',
        'One matching number does not mean the records are equal everywhere. The proof is the transformation.',
      ),
    },
  ],
}

function Screen14({ audio, onSolved, onReady }) {
  return <Blitz items={S14.items} audio={audio} onSolved={onSolved} onReady={onReady} />
}

// ============================================================
// EKRAN 15. YAKUN. Topshiriq YO'Q. Keyingi darsga ko'prik.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Darsning uch tasdig\'i', 'Три утверждения урока', 'The three statements of the lesson'),
  audio: [
    { on: 's0', text: L(
      "Darsning uch tasdig'i.",
      'Три утверждения урока.',
      'The three statements of the lesson.',
    ) },
    { on: 's1', text: L(
      "Siz ularni sonlar bilan tekshirdingiz va almashtirish bilan isbotladingiz. Bu ikki xil narsa, ikkinchisi kuchliroq.",
      'Ты проверил их числами и доказал преобразованием. Это разные вещи, и доказательство сильнее.',
      'You checked them with numbers and proved them by transformation. These differ, and the proof is stronger.',
    ) },
    { on: 's2', text: L(
      "Keyingi darsda kasrlar qo'shiladi, va ODZ ikki maxrajdan birdan keladi.",
      'В следующем уроке дроби складывают, и ОДЗ придёт сразу из двух знаменателей.',
      'In the next lesson fractions are added, and the domain will come from two denominators at once.',
    ) },
  ],
  bridge: L(
    "Keyingisi: 4-dars, kasrlarni qo'shish va ayirish. ODZ ikki maxrajdan keladi.",
    'Дальше: урок 4, сложение и вычитание дробей. ОДЗ придёт из двух знаменателей.',
    'Next: lesson 4, adding and subtracting fractions. The domain comes from two denominators.',
  ),
  proof: L(
    "Siz sonlar bilan tekshirdingiz va almashtirish bilan isbotladingiz. Ikkinchisi kuchliroq.",
    'Ты проверил числами и доказал преобразованием. Второе сильнее.',
    'You checked with numbers and proved by transformation. The second is stronger.',
  ),
  // «Endi nima qila olaman» — BIRINCHI SHAXSDA, o'quvchining o'z tili bilan.
  can: [
    L("Umumiy ko'paytuvchini ko'raman", 'Вижу общий множитель', 'I can see the common factor'),
    L("Yig'indini avval ajrataman", 'Сначала разлагаю сумму', 'I factorise a sum first'),
    L("ODZ ni boshlang'ich maxrajdan olaman", 'Беру ОДЗ по исходному знаменателю', 'I take the domain from the original denominator'),
    L("Javobimni son bilan tekshiraman", 'Проверяю свой ответ числом', 'I check my answer with a number'),
  ],
  predicted: L('Ekran 1 dagi taxminingiz', 'Твой прогноз с экрана 1', 'Your prediction from screen 1'),
  gotLabel: L('Natija', 'Результат', 'Result'),
  readyLabel: L('Tayyorlik', 'Готовность', 'Readiness'),
  canLabel: L('Endi nima qila olaman', 'Что теперь умею', 'What I can do now'),
  notesLabel: L('Sizning yozuvlaringiz', 'Твои записи', 'Your notes'),
  cheat: L('Shpargalkani chiqarish', 'Печать шпаргалки', 'Print the cheat sheet'),
  screenRef: L('7-ekran', 'экран 7', 'screen 7'),
}

// Ikki ustun (§13, «Ekran 15 batafsil»): noutbukda 400 pikselga to'rt blok
// vertikal SIG'MAYDI, kenglik 904 esa bo'sh turadi. 390 da ustun bo'lib qoladi.
function Screen15({ audio, readiness, notes }) {
  const t = useT()
  const first = readiness ? readiness.first : null
  const total = readiness ? readiness.total : 4
  const tags = (readiness && readiness.tags) || []
  const level = first === null
    ? null
    : first === total
      ? t(UI_TXT.readiness4)
      : first === total - 1
        ? t(UI_TXT.readiness3) + ': ' + tags.map((x) => t(MISS[x] ? MISS[x].what : x)).join(', ')
        : t(UI_TXT.readiness2) + ' ' + t(S15.screenRef)

  return (
    <Reveal
      audio={audio}
      blocks={[
        <div className="g8-sum" key="a">
          <div className="g8-sum-col">
            <div className="g8-sum-h">{t(S15.readyLabel)}</div>
            {/* Taxmin FIRUZA, natija YASHIL: ekran 1 dagi rang bilan bir xil. */}
            <div className="g8-chip g8-chip-cool">{t(S15.predicted)}</div>
            <div className="g8-chip g8-chip-ok">
              {t(S15.gotLabel)}: {first === null ? '—' : first + '/' + total}
            </div>
            {level ? <Note kind="ok">{level}</Note> : null}
            {/* Tasdiqlar — PROZA, monoshirinali EMAS: nowrap ustundan chiqib
                ketadi va o'ng ustun ostiga kirib qoladi (§14). */}
            {STATEMENTS.map((s, i) => <Ask key={i}>{t(s)}</Ask>)}
          </div>
          <div className="g8-sum-col">
            <div className="g8-sum-h">{t(S15.canLabel)}</div>
            {S15.can.map((c, i) => <Ask key={i}>{t(c)}</Ask>)}
            <div className="g8-sum-h">{t(S15.notesLabel)}</div>
            <div className="g8-notes">
              {notes && notes.length
                ? notes.map((n, i) => <div className="g8-note-line" key={i}>{n}</div>)
                : <span className="g8-t-dim">—</span>}
            </div>
            <button type="button" className="g8-cheat" onClick={() => window.print()}>
              {t(S15.cheat)}
            </button>
          </div>
        </div>,
        <Note key="b" kind="ok">{t(S15.proof)}</Note>,
        <Note key="c">{t(S15.bridge)}</Note>,
      ]}
    />
  )
}

// ============================================================
// SCREENS: rollar §13 bo'yicha
// ============================================================
// `scored` maydoni YO'Q (§13.2, redaksiya 2): nazariy dars baholanmaydi.
// `tag` — xato yoki bittadan ko'p urinish bo'lsa natijaga yoziladigan teg.
// `field` — uchta maxsus ekranning maydon rangi (§14): boshqa hech nima
// o'zgarmaydi, faqat rang.
export const SCREENS = [
  { meta: S1,  audio: S1.audio,  role: 'hook',     field: 'hook',    C: Screen1 },
  { meta: S2,  audio: S2.audio,  role: 'support',                    C: Screen2 },
  { meta: S3,  audio: S3.audio,  role: 'explain',  tag: 'З1',        C: Screen3 },
  { meta: S4,  audio: S4.audio,  role: 'explain',  tag: 'З1',        C: Screen4 },
  { meta: S5,  audio: S5.audio,  role: 'explain',  tag: 'З2',        C: Screen5 },
  { meta: S6,  audio: S6.audio,  role: 'explain',  tag: 'З15',       C: Screen6 },
  { meta: S7,  audio: S7.audio,  role: 'explain',  tag: 'З2',        C: Screen7 },
  { meta: S8,  audio: S8.audio,  role: 'rule',     field: 'rule',    tag: 'З1',  C: Screen8 },
  { meta: S9,  audio: S9.audio,  role: 'practice', tag: 'З1',        C: Screen9 },
  { meta: S10, audio: S10.audio, role: 'practice', tag: 'З15',       C: Screen10 },
  { meta: S11, audio: S11.audio, role: 'practice', tag: 'З16',       C: Screen11 },
  { meta: S12, audio: S12.audio, role: 'practice', tag: 'З16',       C: Screen12 },
  { meta: S13, audio: S13.audio, role: 'transfer', tag: 'З2',        C: Screen13 },
  { meta: S14, audio: S14.audio, role: 'blitz',                      C: Screen14 },
  { meta: S15, audio: S15.audio, role: 'summary',  field: 'summary', C: Screen15 },
]

// ============================================================
// DARS
// ============================================================
export default function Dars03({ lang = 'ru', ttsApiBase = '', onFinish, studentName = '' }) {
  const [screen, setScreen] = useState(0)
  const [solved, setSolved] = useState({})
  const [tags, setTags] = useState({})        // ekran -> teg (BALL EMAS)
  const [readiness, setReadiness] = useState(null)
  const [notes, setNotes] = useState('')      // qoralama -> 15-ekranga chiqadi
  const [finished, setFinished] = useState(false)

  useMobileZoom()
  useMemo(() => { configureLesson({ ttsApiBase, studentName, voiceGender: META.voice }) }, [ttsApiBase, studentName])

  const cur = SCREENS[screen]
  const audio = useAudio(cur.audio)

  // BALL YO'Q (§0 p. 6, §17). Birinchi urinishdan keyin javob berilgan bo'lsa,
  // ekranning TEGI yoziladi: nima takrorlanishi kerakligi shundan ko'rinadi.
  const markSolved = useCallback((res) => {
    setSolved((prev) => ({ ...prev, [screen]: true }))
    const missed = res && res.tries && res.tries > 1
    const tag = SCREENS[screen].tag
    if (missed && tag) setTags((prev) => ({ ...prev, [screen]: tag }))
  }, [screen])

  const finish = () => {
    setFinished(true)
    if (onFinish) {
      // score va total YO'Q: nazariy dars baholanmaydi, baho amaliyotda (§13.1).
      onFinish({
        lessonId: META.id,
        topic: tr(META.topic, lang),
        passed: true,
        readiness,
        tags: Object.keys(tags).map((k) => ({ screen: Number(k) + 1, tag: tags[k] })),
        screens: SCREENS.map((s, i) => ({ n: i + 1, role: s.role, solved: !!solved[i] })),
      })
    }
  }

  const Body = cur.C

  return (
    <LangProvider value={lang}>
      <style>{STYLES}{MATH_STYLES}{TOOLS_STYLES}</style>
      <div className="lesson-root">
        <Frame
          meta={cur.meta}
          screen={screen}
          audio={audio}
          solved={cur.role === 'support' || cur.role === 'summary' || !!solved[screen]}
          finished={finished}
          field={cur.field}
          notes={notes}
          onNotes={setNotes}
          onPrev={() => setScreen((s) => Math.max(0, s - 1))}
          onNext={() => setScreen((s) => Math.min(TOTAL - 1, s + 1))}
          onFinish={finish}
        >
          <Body
            audio={audio}
            onSolved={markSolved}
            onReady={setReadiness}
            readiness={readiness}
            notes={notes ? notes.split('\n').filter(Boolean) : null}
          />
        </Frame>
      </div>
    </LangProvider>
  )
}
