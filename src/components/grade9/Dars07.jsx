// ============================================================================
// 9-sinf, Dars 7. BUTUN TENGLAMALAR.
//
// REDAKSIYA 1, 2026-08-27. Bu mavzu Algebra 9 da alohida bobga ega emas
// (DARSLAR_REJASI_9SINF.md), manba — Algebra 8: ta'rif §1 «Ratsional
// ifodalar» dan (8-bet: «bir necha ko'phaddan qo'shish, ayirish va
// ko'paytirish belgilari bilan tuzilgan ifoda BUTUN IFODA deyiladi»),
// texnika — «7-sinf algebra kursini takrorlash» bo'limidan (3-bet, 5-6
// mashqlar: qavs ochish va had ko'chirish orqali chiziqli tenglamalar).
//
// BLOK 2 BOSHLANDI (Б2, 7-13-darslar). BIRINCHI MARTA: `Track` — sinfning
// ikkinchi umumiy asbobi («Prибор 4», PODXOD_9SINF.md §7, 7 darsda
// ishlatiladi). Bu yerda uning BIRINCHI, SODDA holati: maxrajda harf yo'q,
// begona ildiz xavfi yo'q, shuning uchun ⚠ belgisi hali ishlatilmaydi —
// uni 8-dars (kasr-ratsional tenglamalar) qo'shadi, asbobning o'zi emas,
// faqat ma'lumot.
//
// TEGLAR (o'zining):
//   qavs-ochish-ishorasi     — qavs oldida minus bo'lganda ichidagi
//                               hadlarning ishorasini teskarilamaslik
//   had-kochirish-ishorasi   — hadni tenglamaning narigi tomoniga
//                               o'tkazishda ishorasini almashtirmaslik
//   tekshirish-otkazib-yuborish — topilgan ildizni asl tenglamaga
//                               qo'yib tekshirishni o'tkazib yuborish
//   butun-vs-kasr-tenglama   — maxrajida harf bor tenglamani ham
//                               butun tenglama deb hisoblash
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, Track } from './asboblar.jsx'

export const META = {
  id: 'grade9-07',
  n: 7,
  row: 7,
  block: 'Б2',
  topic: L('Butun tenglamalar', 'Целые уравнения', 'Whole equations'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Bir necha ko'phaddan qo'shish, ayirish va ko'paytirish belgilari bilan tuzilgan ifoda butun ifoda deyiladi. Ikki tomoni ham butun ifoda bo'lgan tenglama butun tenglama deyiladi",
    'Алгебраическое выражение, состоящее из нескольких многочленов, соединённых знаками сложения, вычитания и умножения, называют целым выражением. Уравнение, обе части которого целые выражения, называют целым уравнением',
    'An algebraic expression made of several polynomials joined by addition, subtraction, and multiplication is called a whole expression. An equation whose both sides are whole expressions is called a whole equation',
  ),
  L(
    "Qavs oldida minus turganda, qavs ichidagi HAR bir hadning ishorasi qavs ochilganda teskariga aylanadi",
    'Когда перед скобкой стоит минус, знак КАЖДОГО слагаемого внутри скобки при раскрытии меняется на противоположный',
    "When there is a minus before the parentheses, the sign of EVERY term inside flips to the opposite when the parentheses open",
  ),
  L(
    "Topilgan ildiz asl tenglamaga qo'yib tekshiriladi, shundagina yechim yakunlangan hisoblanadi",
    'Найденный корень подставляется в исходное уравнение для проверки, только тогда решение считается завершённым',
    'The found root is substituted into the original equation to check it, only then is the solution considered complete',
  ),
]

export const MISS = {
  'qavs-ochish-ishorasi': {
    what: L(
      "qavs oldidagi minus faqat birinchi hadga ta'sir qildi deb o'ylandi",
      'предполагалось, что минус перед скобкой влияет только на первое слагаемое',
      'it was assumed that the minus before the parentheses affects only the first term',
    ),
    wrong: null,
    at: 0,
  },
  'had-kochirish-ishorasi': {
    what: L(
      "had narigi tomonga ishorasini o'zgartirmasdan o'tkazildi",
      'слагаемое перенесено на другую сторону без смены знака',
      'a term was moved to the other side without changing its sign',
    ),
    wrong: null,
    at: 0,
  },
  'tekshirish-otkazib-yuborish': {
    what: L(
      "topilgan ildiz asl tenglamaga qo'yib tekshirilmadi",
      'найденный корень не был подставлен в исходное уравнение для проверки',
      'the found root was not substituted into the original equation to check it',
    ),
    wrong: null,
    at: 0,
  },
  'butun-vs-kasr-tenglama': {
    what: L(
      "maxrajida harf bor tenglama ham butun tenglama deb hisoblandi",
      'уравнение с буквой в знаменателе тоже принято за целое уравнение',
      'an equation with a letter in the denominator was also taken to be a whole equation',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKI TENGLAMA', 'ДВА УРАВНЕНИЯ', 'TWO EQUATIONS'),
  title: L(
    "Qaysi birini darrov yechish mumkin",
    'Какое из них можно решать сразу',
    'Which one can be solved right away',
  ),
  audio: [
    A('mount',
      "Ikkita tenglama. Birinchisida faqat sonlar va harflar ko'paytirilgan, ikkinchisida esa harf maxrajda turibdi.",
      'Два уравнения. В первом только числа и буквы перемножены, во втором буква стоит в знаменателе.',
      'Two equations. In the first, only numbers and letters are multiplied together; in the second, a letter stands in the denominator.'),
    A('why',
      "Maxrajda harf bo'lsa, u nolga teng bo'lib qolishi mumkin, va bu taqiqlangan holat. Qaysi tenglamada bunday xavf yo'q?",
      'Если в знаменателе буква, она может оказаться равной нулю, а это запрещённый случай. В каком уравнении такого риска нет?',
      'If a letter is in the denominator, it might turn out to equal zero, and that is forbidden. Which equation has no such risk?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Qaysi tenglamada maxrajga harf tushib qolish xavfi yo'q?",
      'В каком уравнении нет риска, что буква попадёт в знаменатель?',
      'In which equation is there no risk of a letter landing in the denominator?',
    ),
    items: [
      { id: 'right', right: true, show: L('minus uch, qavs ochilgan to\'rt minus x teng ikki, qavs ochilgan x minus besh', 'минус три, скобка четыре минус x, равно два, скобка x минус пять', 'minus three, bracket four minus x, equals two, bracket x minus five') },
      {
        id: 'wrong',
        show: L("besh, bo'lingan x minus bir, teng ikki", 'пять, делённое на x минус один, равно двум', 'five, divided by x minus one, equals two'),
        hint: L(
          "Bu yerda x aynan maxrajda turibdi: x bir bo'lib qolsa, bo'lish nolga bo'linadi, bu taqiqlangan.",
          'Здесь x стоит прямо в знаменателе: если x окажется равным единице, деление будет на нуль, это запрещено.',
          'Here x stands right in the denominator: if x turns out to equal one, the division is by zero, which is forbidden.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Birinchisi butun tenglama, maxrajida hech qanday harf yo'q. Bugun aynan shunday tenglamalarni yechamiz.",
      'Верно. Первое, целое уравнение, в знаменателе вообще нет буквы. Сегодня решаем именно такие.',
      'Correct. The first is a whole equation, there is no letter in a denominator at all. Today we solve exactly this kind.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — qavs ochish qoidasi (7-sinfdan tanish).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qavs ochishni eslash",
    'Вспоминаем раскрытие скобок',
    'Recalling how to open parentheses',
  ),
  audio: [
    A('mount',
      "7-sinfdan savol: ikki karra, qavs ochilgan x qo'shi uch qanday ochiladi?",
      'Вопрос с 7 класса: как раскрывается два, умноженное на скобку x плюс три?',
      'A question from grade 7: how does two times the bracket x plus three open up?'),
    A('why',
      "Qavs oldidagi son har ikkala hadga ham ko'paytiriladi, birinchisiga ham, ikkinchisiga ham.",
      'Число перед скобкой умножается на оба слагаемых, и на первое, и на второе.',
      'The number before the parentheses multiplies both terms, the first and the second.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2(x + 3)', '2(x + 3)', '2(x + 3)')}
      steps={[]}
      ask={L(
        "Qavs qanday ochiladi?",
        'Как раскрывается скобка?',
        'How does the bracket open?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: '2x + 6' },
        {
          id: 'wrong',
          label: '2x + 3',
          hint: L(
            "Ikki faqat x ga emas, uchga ham ko'paytirilishi kerak: ikki karra uch, olti.",
            'Двойка должна умножаться не только на x, но и на тройку: два, умноженное на три, шесть.',
            'The two must multiply not only x but also the three: two times three is six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun bunga yana bir qoida qo'shiladi: qavs oldida MINUS bo'lsa nima bo'ladi.",
        'Верно. Сегодня добавится ещё одно правило: что происходит, когда перед скобкой МИНУС.',
        "Correct. Today one more rule is added: what happens when there is a MINUS before the bracket.",
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — Track BIRINCHI ISHLASH:
// −3(4 − x) = 2(x − 5), ikki qadam.
// ============================================================
const S3 = {
  eyebrow: L('BOSH ASBOB', 'ГЛАВНЫЙ ПРИБОР', 'THE MAIN TOOL'),
  title: L(
    "Tenglama: har ikki tomonga birdan qadam",
    'Уравнение: шаг сразу по обеим частям',
    'The equation: a step across both sides at once',
  ),
  audio: [
    A('mount',
      "Yangi tenglama: minus uch, qavs ochilgan to'rt minus x, teng ikki, qavs ochilgan x minus besh.",
      'Новое уравнение: минус три, скобка четыре минус x, равно два, скобка x минус пять.',
      'A new equation: minus three, bracket four minus x, equals two, bracket x minus five.'),
    W('a1',
      "Avval ikkala tomondagi qavsni oching, keyin harflarni bir tomonga, sonlarni ikkinchi tomonga o'tkazib x ni toping.",
      'Сначала раскрой скобки в обеих частях, потом перенеси буквы в одну сторону, числа в другую и найди x.',
      'First open the brackets on both sides, then move the letters to one side, the numbers to the other, and find x.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Track
      start={{ left: '−3(4 − x)', right: '2(x − 5)', set: [] }}
      steps={[
        {
          ask: L(
            "Ikkala tomonda ham qavsni oching",
            'Раскрой скобки в обеих частях',
            'Open the brackets on both sides',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: '−12 + 3x = 2x − 10',
              to: { left: '−12 + 3x', right: '2x − 10', set: [] },
              note: L(
                "To'g'ri. Minus uch har ikkala hadga ham ko'paytirildi: minus uch karra to'rt, minus o'n ikki, minus uch karra minus x, plyus uch x.",
                'Верно. Минус три умножился на оба слагаемых: минус три на четыре, минус двенадцать, минус три на минус x, плюс три x.',
                'Correct. Minus three multiplied both terms: minus three times four is minus twelve, minus three times minus x is plus three x.',
              ),
            },
            {
              id: 'wrong1',
              label: '−12 − 3x = 2x − 10',
              hint: L(
                "Minus uch minus x ga ko'paytirilsa, ikkala minus bir-birini yo'qotadi: natija plyus uch x, minus uch x emas.",
                'Если минус три умножить на минус x, два минуса гасят друг друга: получается плюс три x, а не минус три x.',
                'If minus three is multiplied by minus x, the two minuses cancel: the result is plus three x, not minus three x.',
              ),
            },
            {
              id: 'wrong2',
              label: '12 + 3x = 2x − 10',
              hint: L(
                "Birinchi hadni tekshiring: minus uch to'rtga ko'paytirilsa, minus o'n ikki chiqadi, plyus o'n ikki emas.",
                'Проверь первое слагаемое: минус три, умноженное на четыре, даёт минус двенадцать, а не плюс двенадцать.',
                'Check the first term: minus three times four gives minus twelve, not plus twelve.',
              ),
            },
          ],
        },
        {
          ask: L(
            "Endi harflarni bir tomonga, sonlarni ikkinchi tomonga o'tkazing",
            'Теперь перенеси буквы в одну сторону, числа в другую',
            'Now move the letters to one side, the numbers to the other',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: 'x = 2',
              to: { left: 'x', right: '2', set: [{ value: '2' }] },
              note: L(
                "To'g'ri. Uch x ikkinchi tomonga o'tkazilganda minus ikki x bo'ldi: uch x minus ikki x, x. Minus o'n narigi tomonga o'tganda plyus o'n ikki bo'ldi: minus o'n plyus o'n ikki, ikki.",
                'Верно. Три x при переносе стало минус два x: три x минус два x, x. Минус десять при переносе стало плюс двенадцать: минус десять плюс двенадцать, два.',
                'Correct. Three x, when moved, became minus two x: three x minus two x is x. Minus ten, when moved, became plus twelve: minus ten plus twelve is two.',
              ),
            },
            {
              id: 'wrong1',
              label: 'x = −22',
              hint: L(
                "Ikkala tomonni ham qayta ko'chiring: harflar ayirilishi kerak (uch x minus ikki x), sonlar ham ayirilishi kerak (minus o'n plyus o'n ikki), qo'shilishi emas.",
                'Перенеси обе стороны заново: буквы должны вычитаться (три x минус два x), числа тоже должны вычитаться (минус десять плюс двенадцать), а не складываться.',
                'Redo both transpositions: the letters should subtract (three x minus two x), the numbers should also combine as minus ten plus twelve, not add as if signs stayed the same.',
              ),
            },
            {
              id: 'wrong2',
              label: '5x = −22',
              hint: L(
                "Ikki x narigi tomonga o'tganda ishorasi almashadi: uch x plyus ikki x emas, uch x minus ikki x bo'ladi.",
                'При переносе двух x знак меняется: не три x плюс два x, а три x минус два x.',
                'When two x moves across, its sign flips: not three x plus two x, but three x minus two x.',
              ),
            },
          ],
        },
      ]}
      note={L(
        "Ana xolos. X ikkiga teng chiqdi.",
        'Вот и всё. x получился равным двум.',
        'That is all it takes. x came out equal to two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — TEKSHIRISH: topilgan ildizni asl
// tenglamaga qo'yib tasdiqlash.
// ============================================================
const S4 = {
  eyebrow: L('TEKSHIRISH', 'ПРОВЕРКА', 'VERIFICATION'),
  title: L(
    "Ildizni asl tenglamaga qo'yamiz",
    'Подставляем корень в исходное уравнение',
    'We substitute the root into the original equation',
  ),
  audio: [
    A('mount',
      "X ikkiga teng deb topdik. Endi shu ikkini ASL, hali qavs ochilmagan tenglamaga qo'ying.",
      'Мы нашли, что x равен двум. Теперь подставь эту двойку в ИСХОДНОЕ, ещё не раскрытое уравнение.',
      'We found x equals two. Now substitute that two into the ORIGINAL equation, before the brackets were opened.'),
    A('why',
      "Agar ikkala tomon ham bir xil songa aylansa, ildiz to'g'ri topilgan.",
      'Если обе части превратятся в одно и то же число, корень найден верно.',
      'If both sides turn into the same number, the root was found correctly.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('−3(4 − x) = 2(x − 5),  x = 2', '−3(4 − x) = 2(x − 5),  x = 2', '−3(4 − x) = 2(x − 5),  x = 2')}
      steps={[
        { id: 'left', head: L('Chap tomon', 'Левая часть', 'Left side'), lines: ['−3(4 − 2)', '−3 · 2 = −6'] },
        { id: 'right', head: L('O\'ng tomon', 'Правая часть', 'Right side'), lines: ['2(2 − 5)', '2 · (−3) = −6'] },
      ]}
      ask={L(
        "Ikkala tomon ham qanday songa aylandi?",
        'В какое число превратились обе части?',
        'What number did both sides turn into?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '−6' },
        {
          id: 'wrong',
          label: L('Ikkalasi har xil chiqdi', 'Обе получились разными', 'Both came out different'),
          hint: L(
            "Hisoblarni qaytadan tekshiring: ikkalasi ham minus oltiga teng chiqadi.",
            'Перепроверь вычисления: обе части получаются равными минус шести.',
            'Recheck the computation: both sides come out equal to minus six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkalasi ham minus olti, demak x ikkiga teng, bu ildiz to'g'ri.",
        'Верно. Обе части равны минус шести, значит x равно двум, этот корень верен.',
        'Correct. Both sides equal minus six, so x equals two, and this root is correct.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — QAVS OCHISH CHUQURROQ:
// 5 − (2x − 3) = x + 8, "yolg'iz minus" holati.
// ============================================================
const S5 = {
  eyebrow: L('YOLG\'IZ MINUS', 'ОДИНОКИЙ МИНУС', 'THE LONE MINUS'),
  title: L(
    "Raqamsiz minus ham ikkalasiga ta'sir qiladi",
    'Минус без числа тоже действует на оба слагаемых',
    'A minus with no number still acts on both terms',
  ),
  audio: [
    A('mount',
      "Yangi tenglama: besh minus, qavs ochilgan ikki x minus uch, teng x qo'shi sakkiz.",
      'Новое уравнение: пять минус, скобка два x минус три, равно x плюс восемь.',
      'A new equation: five minus, bracket two x minus three, equals x plus eight.'),
    A('why',
      "Qavs oldida son yozilmagan, faqat minus turibdi. Bu minus uni minus bir deb hisoblang.",
      'Перед скобкой не написано число, только минус. Считай этот минус как минус единицу.',
      'There is no number before the bracket, only a minus. Treat that minus as minus one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5 − (2x − 3)', '5 − (2x − 3)', '5 − (2x − 3)')}
      steps={[]}
      ask={L(
        "Qavs qanday ochiladi?",
        'Как раскрывается скобка?',
        'How does the bracket open?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: '5 − 2x + 3' },
        {
          id: 'wrong',
          label: '5 − 2x − 3',
          hint: L(
            "Minus uch ham ishorasini o'zgartirishi kerak: minus, qavs oldidagi minusga ko'paytirilsa, plyus bo'ladi.",
            'Минус три тоже должен поменять знак: минус, умноженный на минус перед скобкой, даёт плюс.',
            'Minus three must also flip sign: minus times the minus in front of the bracket gives plus.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yozilmagan minus ham ikkala hadga birdek ta'sir qiladi: ikki x ishorasi o'zgaradi, minus uch ham plyus uchga aylanadi.",
        'Верно. Незаписанный минус тоже действует на оба слагаемых: знак двух x меняется, и минус три превращается в плюс три.',
        'Correct. The unwritten minus also acts on both terms: the sign of two x flips, and minus three becomes plus three.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — HAD KO'CHIRISH: 4x − 7 = 2x + 5.
// ============================================================
const S6 = {
  eyebrow: L('HAD KO\'CHIRISH', 'ПЕРЕНОС СЛАГАЕМОГО', 'MOVING A TERM'),
  title: L(
    "Tenglik belgisidan o'tganda ishora almashadi",
    'При переходе через знак равенства знак меняется',
    'Crossing the equals sign flips the sign',
  ),
  audio: [
    A('mount',
      "Yangi tenglama: to'rt x minus yetti, teng ikki x qo'shi besh.",
      'Новое уравнение: четыре x минус семь, равно два x плюс пять.',
      'A new equation: four x minus seven, equals two x plus five.'),
    A('why',
      "Ikki x ni chap tomonga, minus yettini o'ng tomonga o'tkazing. Ikkalasi ham ishorasini almashtiradi.",
      'Перенеси два x влево, минус семь вправо. Оба меняют знак.',
      'Move two x to the left, minus seven to the right. Both flip sign.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('4x − 7 = 2x + 5', '4x − 7 = 2x + 5', '4x − 7 = 2x + 5')}
      steps={[
        { id: 'letters', head: L('Harflar', 'Буквы', 'Letters'), lines: ['4x − 2x = 2x'] },
        { id: 'nums', head: L('Sonlar', 'Числа', 'Numbers'), lines: ['5 + 7 = 12'] },
        { id: 'x', head: 'x', lines: ['2x = 12', 'x = 6'] },
      ]}
      ask={L(
        "Ikki x chapga, minus yetti o'ngga o'tkazilganda ishoralari qanday bo'ladi?",
        'Каким становится знак у двух x при переносе влево и у минус семи при переносе вправо?',
        'What sign do two x get when moved left, and minus seven when moved right?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ikkalasi ham teskariga aylanadi: minus ikki x va plyus yetti", 'Оба меняются на противоположные: минус два x и плюс семь', 'Both flip to the opposite: minus two x and plus seven'),
        },
        {
          id: 'wrong',
          label: L("Ishora o'zgarmaydi, faqat joy almashadi", 'Знак не меняется, меняется только место', 'The sign does not change, only the place'),
          hint: L(
            "Tenglik belgisidan o'tgan har bir had ishorasini almashtiradi: bu qoida hammaga bir xil ishlaydi.",
            'Каждое слагаемое, переходя через знак равенства, меняет знак: это правило действует одинаково для всех.',
            'Every term, when it crosses the equals sign, flips its sign: this rule works the same for everyone.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki x minus ikki x bo'ldi, minus yetti plyus yetti bo'ldi: natijada ikki x o'n ikkiga, x oltiga teng.",
        'Верно. Два x стало минус два x, минус семь стало плюс семь: в итоге два x равно двенадцати, x равно шести.',
        'Correct. Two x became minus two x, minus seven became plus seven: so two x equals twelve, x equals six.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — BUTUN VA KASR-RATSIONAL TENGLAMA FARQI.
// ============================================================
const S7 = {
  eyebrow: L('IKKI TUR', 'ДВА ВИДА', 'TWO KINDS'),
  title: L(
    "Maxrajga qarab ajratamiz",
    'Различаем по знаменателю',
    'Telling them apart by the denominator',
  ),
  audio: [
    A('mount',
      "Uchta tenglama beriladi. Ular orasida bittasi boshqacha: undagi harf maxrajda turibdi.",
      'Даны три уравнения. Среди них одно особенное: в нём буква стоит в знаменателе.',
      'Three equations are given. One of them is different: in it, the letter stands in the denominator.'),
    A('why',
      "Maxrajda harf bo'lsa, tenglama kasr-ratsional deyiladi, va u boshqacha ehtiyotkorlik talab qiladi, buni keyingi darsda ko'ramiz.",
      'Если в знаменателе буква, уравнение называется дробно-рациональным, и оно требует другой осторожности, это увидим на следующем уроке.',
      'If there is a letter in the denominator, the equation is called fractional-rational, and it requires different care, which we will see next lesson.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Uchtasidan qaysi biri butun tenglama EMAS: uch x qo'shi besh teng ikki x minus bir; x kvadrat minus to'rt teng nol; besh bo'lingan x minus uch teng ikki?",
        'Какое из трёх НЕ является целым уравнением: три x плюс пять равно два x минус один; x в квадрате минус четыре равно нулю; пять, делённое на x минус три, равно двум?',
        'Which of the three is NOT a whole equation: three x plus five equals two x minus one; x squared minus four equals zero; five divided by x minus three equals two?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Besh bo'lingan x minus uch teng ikki, chunki x minus uch maxrajda turibdi", 'Пять, делённое на x минус три, равно двум, потому что x минус три стоит в знаменателе', 'Five divided by x minus three equals two, because x minus three stands in the denominator'),
        },
        {
          id: 'wrong',
          label: L("X kvadrat minus to'rt teng nol, chunki unda daraja bor", 'x в квадрате минус четыре равно нулю, потому что там есть степень', 'x squared minus four equals zero, because it has a power'),
          hint: L(
            "Daraja borligi tenglamani kasr qilmaydi: bu ham ko'phad, hech qanday bo'lish yo'q, demak butun tenglama.",
            'Наличие степени не делает уравнение дробным: это тоже многочлен, деления нет, значит уравнение целое.',
            'Having a power does not make the equation fractional: it is still a polynomial, there is no division, so it is a whole equation.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Faqat maxrajda harf borligi tenglamani kasr-ratsional qiladi, daraja emas.",
        'Верно. Уравнение делает дробно-рациональным только буква в знаменателе, а не степень.',
        'Correct. Only a letter in the denominator makes an equation fractional-rational, not a power.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    "Algebra 8, 1-§ (8-bet), 7-sinf kursini takrorlash (3-bet)",
    'Алгебра 8, §1 (стр. 8), повторение курса 7 класса (стр. 3)',
    'Algebra 8, §1 (p. 8), grade 7 course review (p. 3)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        steps={[]}
        ask={L(
          "Butun tenglamani yechishning nechta bosqichi bo'ldi bugun?",
          'Сколько этапов было сегодня в решении целого уравнения?',
          'How many stages were there today in solving a whole equation?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Uchta: qavs ochish, had ko'chirish, tekshirish", 'Три: раскрытие скобок, перенос слагаемых, проверка', 'Three: opening brackets, moving terms, verification'),
          },
          {
            id: 'wrong',
            label: L('Ikkita: qavs ochish va had ko\'chirish', 'Два: раскрытие скобок и перенос слагаемых', 'Two: opening brackets and moving terms'),
            hint: L(
              "4-ekranni eslang: ildizni asl tenglamaga qo'yib tekshirish ham alohida, muhim bosqich edi.",
              'Вспомни 4 экран: подстановка корня в исходное уравнение для проверки тоже была отдельным, важным этапом.',
              'Recall screen 4: substituting the root into the original equation to check it was also a separate, important stage.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Butun tenglama va uni yechish qoidasi",
    'Целое уравнение и правило его решения',
    'The whole equation and the rule for solving it',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz qavs ochishni, had ko'chirishni va tekshirishni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам раскрывал скобки, переносил слагаемые и проверял. Теперь они в виде правила.',
      'On six screens you opened brackets, moved terms, and checked with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — Track TAKRORI: 2(3x−1) = 5(x+2) − 3, x = 9.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana bir marta: qavs, ko'chirish, tekshirish",
    'Ещё раз: скобки, перенос, проверка',
    'One more time: brackets, transposition, checking',
  ),
  audio: [
    A('mount',
      "Yangi tenglama, xuddi shu ikki qadam: qavs ochish, keyin harf va sonlarni ajratib x ni topish.",
      'Новое уравнение, те же два шага: раскрыть скобки, потом разделить буквы и числа и найти x.',
      'A new equation, the same two steps: open the brackets, then separate the letters and numbers and find x.'),
    A('why',
      "Ikkala tomonda ham qavs bor, biri ikkiga, biri beshga ko'paytirilgan.",
      'В обеих частях есть скобки, одна умножена на два, другая на пять.',
      'Both sides have brackets, one multiplied by two, the other by five.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Track
      start={{ left: '2(3x − 1)', right: '5(x + 2) − 3', set: [] }}
      steps={[
        {
          ask: L(
            "Ikkala tomonda ham qavsni oching",
            'Раскрой скобки в обеих частях',
            'Open the brackets on both sides',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: '6x − 2 = 5x + 10 − 3',
              to: { left: '6x − 2', right: '5x + 10 − 3', set: [] },
              note: L(
                "To'g'ri. Ikki har ikkala hadga, besh ham har ikkala hadga ko'paytirildi.",
                'Верно. Двойка умножена на оба слагаемых, пятёрка тоже на оба слагаемых.',
                'Correct. Two multiplied both terms, five also multiplied both terms.',
              ),
            },
            {
              id: 'wrong1',
              label: '6x − 1 = 5x + 10 − 3',
              hint: L(
                "Chap tomonni tekshiring: ikki minus birga emas, ikki minus birning o'ziga emas, ikkiga ko'paytirilgan minus bir, ya'ni minus ikkiga teng.",
                'Проверь левую часть: два умножается и на минус один тоже, два на минус один даёт минус два, а не минус один.',
                'Check the left side: two multiplies minus one too, two times minus one gives minus two, not minus one.',
              ),
            },
            {
              id: 'wrong2',
              label: '6x − 2 = 5x + 10 + 3',
              hint: L(
                "O'ng tomonda qavsdan tashqarida minus uch turibdi, u qavs ochilishiga aralashmaydi, o'zgarmasdan qoladi.",
                'Справа снаружи скобки стоит минус три, он не участвует в раскрытии скобки и остаётся без изменений.',
                'On the right, minus three stands outside the bracket, it takes no part in opening it and stays unchanged.',
              ),
            },
          ],
        },
        {
          ask: L(
            "Endi harflarni bir tomonga, sonlarni ikkinchi tomonga o'tkazing",
            'Теперь перенеси буквы в одну сторону, числа в другую',
            'Now move the letters to one side, the numbers to the other',
          ),
          actions: [
            {
              id: 'right', right: true,
              label: 'x = 9',
              to: { left: 'x', right: '9', set: [{ value: '9' }] },
              note: L(
                "To'g'ri. Olti x minus besh x, x. O'n minus uch minus ikki, ya'ni yetti qo'shi ikki, to'qqiz.",
                'Верно. Шесть x минус пять x, x. Десять минус три минус два, то есть семь плюс два, девять.',
                'Correct. Six x minus five x is x. Ten minus three minus two, that is seven plus two, nine.',
              ),
            },
            {
              id: 'wrong1',
              label: 'x = 5',
              hint: L(
                "Sonlarni qayta hisoblang: o'ng tomondagi o'n, minus uch va ko'chirilgan ikki bilan birga qo'shiladi, ayirilmaydi.",
                'Пересчитай числа: десять справа складывается с минус три и с перенесённым минус два, а не вычитается.',
                'Recompute the numbers: the ten on the right combines with minus three and with the transposed minus two by adding, not subtracting.',
              ),
            },
            {
              id: 'wrong2',
              label: '11x = 5',
              hint: L(
                "Besh x narigi tomonga o'tganda ishorasi almashadi: olti x plyus besh x emas, olti x minus besh x bo'ladi.",
                'При переносе пяти x знак меняется: не шесть x плюс пять x, а шесть x минус пять x.',
                'When five x crosses over, its sign flips: not six x plus five x, but six x minus five x.',
              ),
            },
          ],
        },
      ]}
      note={L(
        "Ana xolos. X to'qqizga teng chiqdi.",
        'Вот и всё. x получился равным девяти.',
        'That is all it takes. x came out equal to nine.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: qavs ochish, to'rtta misol.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Qavsni tez ochish",
    'Быстро раскрываем скобки',
    'Quickly opening brackets',
  ),
  audio: [
    A('mount',
      "To'rtta ifoda ketma-ket. Har birida qavsni to'g'ri oching.",
      'Четыре выражения подряд. В каждом правильно раскрой скобку.',
      'Four expressions in a row. In each, open the bracket correctly.'),
    A('why',
      "Qavs oldidagi ishoraga qarang: plyusmi, minusmi, yolg'iz minusmi.",
      'Смотри на знак перед скобкой: плюс, минус или одинокий минус.',
      'Look at the sign before the bracket: plus, minus, or a lone minus.'),
  ],
  props: {
    stepLabel: L('Ifoda', 'Выражение', 'Expression'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham ochildi. Qoida bir xil: qavs oldidagi ishora ICHKARIDAGI HAR bir hadga ta'sir qiladi.",
      'Все четыре раскрыты. Правило одно: знак перед скобкой действует на КАЖДОЕ слагаемое внутри.',
      'All four are opened. The rule is the same: the sign before the bracket acts on EVERY term inside.',
    ),
    tasks: [
      {
        expr: '−4(x − 2)',
        question: L('Qavs qanday ochiladi?', 'Как раскрывается скобка?', 'How does the bracket open?'),
        ok: L("Ha. Minus to'rt karra x, minus to'rt x. Minus to'rt karra minus ikki, plyus sakkiz.", 'Да. Минус четыре на x, минус четыре x. Минус четыре на минус два, плюс восемь.', 'Yes. Minus four times x is minus four x. Minus four times minus two is plus eight.'),
        items: [
          { id: 'a', right: true, label: '−4x + 8' },
          { id: 'b', label: '−4x − 8', hint: L("Ikkinchi hadni qayta hisoblang: minus to'rt karra minus ikki, ikkala minus bir-birini yo'qotadi.", 'Пересчитай второе слагаемое: минус четыре на минус два, оба минуса гасят друг друга.', 'Recompute the second term: minus four times minus two, the two minuses cancel.') },
        ],
        solution: ['−4 · x = −4x', '−4 · (−2) = 8', '−4x + 8'],
      },
      {
        expr: '−(5x + 1)',
        question: L('Qavs qanday ochiladi?', 'Как раскрывается скобка?', 'How does the bracket open?'),
        ok: L("Ha. Yolg'iz minus ham har ikki hadga ta'sir qiladi: besh x manfiy, bir ham manfiy bo'ladi.", 'Да. Одинокий минус тоже действует на оба слагаемых: пять x и единица становятся отрицательными.', 'Yes. The lone minus also acts on both terms: five x and one both become negative.'),
        items: [
          { id: 'a', right: true, label: '−5x − 1' },
          { id: 'b', label: '−5x + 1', hint: L("Ikkinchi had ham ishorasini o'zgartirishi kerak, faqat birinchisi emas.", 'Второе слагаемое тоже должно поменять знак, а не только первое.', 'The second term must flip sign too, not only the first.') },
        ],
        solution: [L("Minus bir deb hisoblang", 'Считай это как минус один', 'Treat it as minus one'), '−1 · 5x = −5x', '−1 · 1 = −1'],
      },
      {
        expr: '3(2x − 4)',
        question: L('Qavs qanday ochiladi?', 'Как раскрывается скобка?', 'How does the bracket open?'),
        ok: L("Ha. Uch karra ikki x, olti x. Uch karra minus to'rt, minus o'n ikki.", 'Да. Три на два x, шесть x. Три на минус четыре, минус двенадцать.', 'Yes. Three times two x is six x. Three times minus four is minus twelve.'),
        items: [
          { id: 'a', right: true, label: '6x − 12' },
          { id: 'b', label: '6x − 4', hint: L("Ikkinchi hadga ham uch ko'paytirilishi kerak: uch karra to'rt, o'n ikki.", 'На второе слагаемое тоже нужно умножить три: три на четыре, двенадцать.', 'The second term must also be multiplied by three: three times four is twelve.') },
        ],
        solution: ['3 · 2x = 6x', '3 · (−4) = −12'],
      },
      {
        expr: '−2(−x + 6)',
        question: L('Qavs qanday ochiladi?', 'Как раскрывается скобка?', 'How does the bracket open?'),
        ok: L("Ha. Minus ikki karra minus x, plyus ikki x. Minus ikki karra olti, minus o'n ikki.", 'Да. Минус два на минус x, плюс два x. Минус два на шесть, минус двенадцать.', 'Yes. Minus two times minus x is plus two x. Minus two times six is minus twelve.'),
        items: [
          { id: 'a', right: true, label: '2x − 12' },
          { id: 'b', label: '−2x − 12', hint: L("Birinchi hadni tekshiring: minus ikki minus x ga ko'paytirilsa, ikkala minus bir-birini yo'qotadi.", 'Проверь первое слагаемое: минус два на минус x, оба минуса гасят друг друга.', 'Check the first term: minus two times minus x, the two minuses cancel.') },
        ],
        solution: ['−2 · (−x) = 2x', '−2 · 6 = −12'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: had ko'chirish va tekshirish.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: ko'chirish va tekshirish",
    'Только счёт: перенос и проверка',
    'Just computation: transposition and checking',
  ),
  audio: [
    A('mount',
      "Bu safar qavs yo'q, faqat had ko'chirish va tekshirish.",
      'На этот раз без скобок, только перенос слагаемых и проверка.',
      'This time there are no brackets, only moving terms and checking.'),
    A('why',
      "Har safar ishorani almashtirishni unutmang, oxirida esa ildizni asl tenglamaga qo'yib tekshiring.",
      'Каждый раз не забывай менять знак, а в конце подставь корень в исходное уравнение для проверки.',
      "Every time, don't forget to flip the sign, and at the end substitute the root into the original equation to check."),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hal bo'ldi: ko'chirish, hisoblash va tekshirish, hammasi bir xil qoidadan.",
      'Все три решены: перенос, вычисление и проверка, всё из одного правила.',
      'All three are solved: transposition, computation, and checking, all from the same rule.',
    ),
    tasks: [
      {
        expr: '5x + 3 = 2x + 12',
        question: L('X nechiga teng?', 'Чему равен x?', 'What does x equal?'),
        ok: L("Ha. Besh x minus ikki x, uch x. O'n ikki minus uch, to'qqiz. Uch x to'qqiz, x uch.", 'Да. Пять x минус два x, три x. Двенадцать минус три, девять. Три x равно девяти, x равно трём.', 'Yes. Five x minus two x is three x. Twelve minus three is nine. Three x equals nine, x equals three.'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '5', hint: L("Sonlarni qayta ko'chiring: uch narigi tomonga o'tganda ishorasi almashadi, o'n ikki minus uch bo'ladi, o'n ikki qo'shi uch emas.", 'Перенеси числа заново: тройка при переносе меняет знак, получается двенадцать минус три, а не двенадцать плюс три.', 'Redo the number transposition: three flips sign when moved, giving twelve minus three, not twelve plus three.') },
        ],
        solution: ['5x − 2x = 12 − 3', '3x = 9', 'x = 3'],
      },
      {
        expr: '7 − 2x = 3x − 8',
        question: L('X nechiga teng?', 'Чему равен x?', 'What does x equal?'),
        ok: L("Ha. Minus ikki x minus uch x, minus besh x. Minus sakkiz minus yetti, minus o'n besh. X uch.", 'Да. Минус два x минус три x, минус пять x. Минус восемь минус семь, минус пятнадцать. x равно трём.', 'Yes. Minus two x minus three x is minus five x. Minus eight minus seven is minus fifteen. x equals three.'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '−3', hint: L("Ishoralarni qayta tekshiring: minus besh x teng minus o'n beshga, ikkalasi ham manfiy, x esa musbat uchga teng chiqadi.", 'Перепроверь знаки: минус пять x равно минус пятнадцати, обе части отрицательны, а x получается положительным, равным трём.', 'Recheck the signs: minus five x equals minus fifteen, both sides negative, and x comes out positive, equal to three.') },
        ],
        solution: ['−2x − 3x = −8 − 7', '−5x = −15', 'x = 3'],
      },
      {
        expr: '2x − 1 = x + 4, x = 5',
        question: L("Bu ildiz to'g'rimi? Asl tenglamaga qo'yib tekshiring", 'Верен ли этот корень? Проверь подстановкой в исходное уравнение', 'Is this root correct? Check by substituting into the original equation'),
        ok: L("Ha, to'g'ri. Chap tomon to'qqiz, o'ng tomon ham to'qqiz.", 'Да, верен. Левая часть девять, правая часть тоже девять.', 'Yes, correct. The left side is nine, the right side is also nine.'),
        items: [
          { id: 'a', right: true, label: L("To'g'ri, ikkala tomon ham to'qqiz", 'Верен, обе части равны девяти', 'Correct, both sides equal nine') },
          { id: 'b', label: L("Noto'g'ri, tomonlar har xil chiqadi", 'Неверен, части получаются разными', 'Incorrect, the sides come out different'), hint: L("Qo'yib hisoblang: ikki karra besh minus bir, to'qqiz. Besh qo'shi to'rt, to'qqiz. Ikkalasi teng.", 'Подставь и посчитай: два на пять минус один, девять. Пять плюс четыре, девять. Обе равны.', 'Substitute and compute: two times five minus one is nine. Five plus four is nine. Both equal.') },
        ],
        solution: ['2 · 5 − 1 = 9', '5 + 4 = 9', L("To'g'ri: 9 = 9", 'Верно: 9 = 9', 'Correct: 9 = 9')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Sardorning "yechimida" tekshirish o'tkazib
// yuborilgan, xato ildiz qoldi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tekshirmasdan qoldirilgan ildiz",
    'Корень, оставленный без проверки',
    'A root left unchecked',
  ),
  audio: [
    A('mount',
      "Sardorning yechimi. U uch, qavs ochilgan x minus bir, teng ikki x qo'shi to'rt tenglamasini yechib, x besh chiqdi, deb yozdi va tekshirmadi.",
      'Решение Сардора. Он решил уравнение три, скобка x минус один, равно два x плюс четыре, получил x равным пяти, и записал это без проверки.',
      "Sardor's solution. He solved the equation three, bracket x minus one, equals two x plus four, got x equals five, and wrote it down without checking."),
    A('why',
      "Uning hisobini qayta ko'ring: qavs to'g'ri ochilganmi, hadlar to'g'ri ko'chirilganmi?",
      'Пересмотри его вычисления: правильно ли раскрыта скобка, правильно ли перенесены слагаемые?',
      "Review his computation: was the bracket opened correctly, were the terms moved correctly?"),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Sardor qavsni ochishda ikkinchi hadning ishorasini unutgan edi, shuning uchun ildiz noto'g'ri chiqqan.",
      'Сардор при раскрытии скобки забыл про знак второго слагаемого, поэтому корень получился неверным.',
      "Sardor forgot the sign of the second term when opening the bracket, so the root came out wrong.",
    ),
    tasks: [
      {
        expr: '3(x − 1) = 2x + 4',
        question: L(
          "Sardor javobni x besh deb yozdi. Besh sonini asl tenglamaga qo'ying: to'g'ri chiqadimi?",
          'Сардор записал ответ как x равно пяти. Подставь число пять в исходное уравнение: получается верно?',
          "Sardor wrote the answer as x equals five. Substitute five into the original equation: does it come out right?",
        ),
        ok: L(
          "Yo'q, to'g'ri emas. Chap tomon o'n ikki, o'ng tomon o'n to'rt, ular teng emas, demak x besh emas.",
          'Нет, неверно. Левая часть двенадцать, правая часть четырнадцать, они не равны, значит x не пять.',
          'No, it is not correct. The left side is twelve, the right side is fourteen, they are not equal, so x is not five.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Noto'g'ri, chap va o'ng tomon teng chiqmaydi", 'Неверно, левая и правая части не совпадают', 'Incorrect, the left and right sides do not match'),
          },
          {
            id: 'b',
            label: L("To'g'ri, tomonlar teng chiqadi", 'Верно, части совпадают', 'Correct, the sides match'),
            hint: L("Qo'yib hisoblang: uch karra besh minus bir, o'n ikki. Ikki karra besh qo'shi to'rt, o'n to'rt. Bular teng emas.", 'Подставь и посчитай: три на пять минус один, двенадцать. Два на пять плюс четыре, четырнадцать. Они не равны.', 'Substitute and compute: three times five minus one is twelve. Two times five plus four is fourteen. They are not equal.'),
          },
        ],
        solution: [
          '3(x − 1) = 3x − 3',
          '3x − 3 = 2x + 4',
          '3x − 2x = 4 + 3',
          L("To'g'ri javob: x = 7", 'Верный ответ: x = 7', 'Correct answer: x = 7'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — javobdan tenglamaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Javobdan tenglamaga",
    'От ответа к уравнению',
    'From the answer to the equation',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: x ning qiymati berilgan, qaysi tenglama shu qiymatni berishini siz tanlaysiz.",
      'На этот раз наоборот: дано значение x, а какое уравнение даёт это значение, выбираешь ты.',
      'This time it is the other way round: the value of x is given, you choose which equation gives that value.'),
    A('why',
      "Har bir nomzodda qavsni oching, had ko'chiring va x ni hisoblang.",
      'В каждом кандидате раскрой скобку, перенеси слагаемые и вычисли x.',
      'In each candidate, open the bracket, move the terms, and compute x.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: javobdan orqaga qaytib, mos tenglamani tanlash ham xuddi shu qoidaga tayanadi.",
      'Найдено: путь от ответа назад к уравнению опирается на то же самое правило.',
      'Found: going backward from the answer to the equation relies on the same rule.',
    ),
    tasks: [
      {
        expr: 'x = 4',
        question: L(
          "X to'rtga teng bo'lishi kerak. Qaysi tenglama mos keladi?",
          'x должен быть равен четырём. Какое уравнение подходит?',
          'x must equal four. Which equation fits?',
        ),
        ok: L("Ha. Qavs ochilsa: uch x minus olti, teng x qo'shi olti. Uch x minus x, ikki x. Olti qo'shi olti, o'n ikki. X to'rt.", 'Да. Раскрыв скобку: три x минус шесть, равно x плюс шесть. Три x минус x, два x. Шесть плюс шесть, двенадцать. x равен четырём.', 'Yes. Opening the bracket: three x minus six equals x plus six. Three x minus x is two x. Six plus six is twelve. x equals four.'),
        items: [
          { id: 'a', right: true, label: '3(x − 2) = x + 6' },
          { id: 'b', label: '3(x − 2) = x − 6', hint: L("Bu tenglamani yeching: x nol chiqadi, to'rt emas.", 'Реши это уравнение: x получается равным нулю, а не четырём.', 'Solve this equation: x comes out equal to zero, not four.') },
        ],
        solution: ['3x − 6 = x + 6', '3x − x = 6 + 6', '2x = 12', 'x = 4'],
      },
      {
        expr: 'x = −1',
        question: L(
          "X minus birga teng bo'lishi kerak. Qaysi tenglama mos keladi?",
          'x должен быть равен минус одному. Какое уравнение подходит?',
          'x must equal minus one. Which equation fits?',
        ),
        ok: L("Ha. Qavs ochilsa: minus ikki x qo'shi to'rt, teng x qo'shi yetti. Minus ikki x minus x, minus uch x. Yetti minus to'rt, uch. X minus bir.", 'Да. Раскрыв скобку: минус два x плюс четыре, равно x плюс семь. Минус два x минус x, минус три x. Семь минус четыре, три. x равен минус одному.', 'Yes. Opening the bracket: minus two x plus four equals x plus seven. Minus two x minus x is minus three x. Seven minus four is three. x equals minus one.'),
        items: [
          { id: 'a', right: true, label: '−2(x − 2) = x + 7' },
          { id: 'b', label: '2(x − 2) = x + 7', hint: L("Bu tenglamani yeching: x uch chiqadi, minus bir emas.", 'Реши это уравнение: x получается равным трём, а не минус одному.', 'Solve this equation: x comes out equal to three, not minus one.') },
        ],
        solution: ['−2x + 4 = x + 7', '−2x − x = 7 − 4', '−3x = 3', 'x = −1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: qavs, ko'chirish, tekshirish, tur",
    'Блиц: скобки, перенос, проверка, вид',
    'Blitz: brackets, transposition, checking, kind',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'qavs-ochish-ishorasi',
        ask: L(
          "Minus besh, qavs ochilgan x minus ikki. Qavs ichidagi ikkinchi had qanday ishora oladi?",
          'Минус пять, скобка x минус два. Какой знак получает второе слагаемое внутри скобки?',
          'Minus five, bracket x minus two. What sign does the second term inside the bracket get?',
        ),
        options: [
          { id: 'plus', right: true, label: L('Plyus', 'Плюс', 'Plus') },
          { id: 'minus', label: L('Minus', 'Минус', 'Minus') },
        ],
        ok: L(
          "To'g'ri. Minus besh minus ikkiga ko'paytirilsa, ikkala minus bir-birini yo'qotadi, plyus o'n chiqadi.",
          'Верно. Минус пять на минус два, оба минуса гасят друг друга, получается плюс десять.',
          'Correct. Minus five times minus two, the two minuses cancel, giving plus ten.',
        ),
        hint: L(
          "Qavs oldidagi minusni ikkinchi hadning o'z minusi bilan birga ko'paytiring: ikkala minus bir-birini yo'qotadi.",
          'Перемножь минус перед скобкой со своим минусом второго слагаемого: два минуса гасят друг друга.',
          'Multiply the minus before the bracket by the term\'s own minus: two minuses cancel.',
        ),
      },
      {
        id: 'q2',
        tag: 'had-kochirish-ishorasi',
        ask: L(
          "Plyus olti had tenglamaning narigi tomoniga o'tkazilmoqda. U qanday ishora oladi?",
          'Слагаемое плюс шесть переносится на другую сторону уравнения. Какой знак оно получает?',
          'The term plus six is moved to the other side of the equation. What sign does it get?',
        ),
        options: [
          { id: 'minus', right: true, label: L('Minus', 'Минус', 'Minus') },
          { id: 'plus', label: L('Plyus, o\'zgarmaydi', 'Плюс, не меняется', 'Plus, unchanged') },
        ],
        ok: L(
          "To'g'ri. Tenglik belgisidan o'tgan har bir had ishorasini almashtiradi.",
          'Верно. Каждое слагаемое, переходя через знак равенства, меняет знак.',
          'Correct. Every term flips its sign when it crosses the equals sign.',
        ),
        hint: L(
          "Had ko'chirish qoidasini eslang: narigi tomonga o'tganda ishora doim teskariga aylanadi.",
          'Вспомни правило переноса: при переходе на другую сторону знак всегда меняется на противоположный.',
          'Recall the transposition rule: crossing to the other side always flips the sign to the opposite.',
        ),
      },
      {
        id: 'q3',
        tag: 'tekshirish-otkazib-yuborish',
        ask: L(
          "Tenglamani yechib x ni topdingiz. Yechim shu yerda tugaydimi?",
          'Ты решил уравнение и нашёл x. На этом решение заканчивается?',
          'You solved the equation and found x. Does the solution end there?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, tekshirish kerak", 'Нет, нужна проверка', 'No, checking is needed') },
          { id: 'yes', label: L('Ha, tugaydi', 'Да, заканчивается', 'Yes, it ends') },
        ],
        ok: L(
          "To'g'ri. Topilgan ildiz asl tenglamaga qo'yib tekshiriladi, shundagina yechim yakunlanadi.",
          'Верно. Найденный корень подставляется в исходное уравнение для проверки, только тогда решение завершено.',
          'Correct. The found root is substituted into the original equation to check it, only then is the solution complete.',
        ),
        hint: L(
          "4-ekranni eslang: x ikkiga teng topilgandan keyin ham uni asl tenglamaga qo'yib ko'rgan edingiz.",
          'Вспомни 4 экран: даже после того как x получился равным двум, ты подставил его в исходное уравнение.',
          'Recall screen 4: even after finding x equals two, you substituted it back into the original equation.',
        ),
      },
      {
        id: 'q4',
        tag: 'butun-vs-kasr-tenglama',
        ask: L(
          "To'rt bo'lingan x, qo'shi bir, teng ikki tenglamasi butun tenglamami?",
          'Уравнение четыре, делённое на x, плюс один, равно двум, целое?',
          'Is the equation four divided by x, plus one, equal to two, a whole equation?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. X maxrajda turibdi, demak bu kasr-ratsional tenglama, keyingi darsning mavzusi.",
          'Верно. x стоит в знаменателе, значит это дробно-рациональное уравнение, тема следующего урока.',
          'Correct. x stands in the denominator, so this is a fractional-rational equation, the topic of the next lesson.',
        ),
        hint: L(
          "Maxrajga qarang: u yerda harf bormi? Bo'lsa, tenglama butun emas.",
          'Посмотри в знаменатель: есть ли там буква? Если есть, уравнение не целое.',
          'Look at the denominator: is there a letter there? If so, the equation is not whole.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Butun tenglama: uch bosqich",
    'Целое уравнение: три этапа',
    'The whole equation: three stages',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda maxrajda harf bor tenglamani ajrata olishni sinab ko'rdingiz. Bugun aynan shu farqdan boshlab, butun tenglamani to'liq yechishni o'rgandingiz.",
      'На первом экране ты пробовал отличить уравнение с буквой в знаменателе. Сегодня, начав именно с этого различия, ты освоил полное решение целого уравнения.',
      'On the first screen you tried to tell apart an equation with a letter in the denominator. Today, starting from exactly that distinction, you learned the full solution of a whole equation.'),
    A('s1',
      "Siz qavs ochishni, ishorani ehtiyot qilib had ko'chirishni va ildizni asl tenglamaga qo'yib tekshirishni o'rgandingiz.",
      'Ты освоил раскрытие скобок, перенос слагаемых с вниманием к знаку и проверку корня подстановкой в исходное уравнение.',
      'You learned opening brackets, moving terms with care for the sign, and checking the root by substituting into the original equation.'),
    A('s2',
      "Keyingi darsda kasr-ratsional tenglamalar: maxrajda harf bo'lganda yana bir qadam qo'shiladi.",
      'В следующем уроке дробно-рациональные уравнения: когда в знаменателе буква, добавляется ещё один шаг.',
      'The next lesson covers fractional-rational equations: when there is a letter in the denominator, one more step is added.'),
  ],
  props: {
    mark: '−3(4 − x) = 2(x − 5)',
    markNote: L(
      "bugungi tenglama",
      'сегодняшнее уравнение',
      "today's equation",
    ),
    lines: [
      STATEMENTS[1],
      L(
        "Had tenglik belgisidan o'tganda ishorasi teskariga aylanadi",
        'Слагаемое, переходя через знак равенства, меняет знак на противоположный',
        'A term flips its sign to the opposite when it crosses the equals sign',
      ),
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: kasr-ratsional tenglamalar',
      'Следующий урок: дробно-рациональные уравнения',
      'Next lesson: fractional-rational equations',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'qavs-ochish-ishorasi', ...S2 },
  { role: 'explain',  tag: 'qavs-ochish-ishorasi', ...S3 },
  { role: 'explain',  tag: 'tekshirish-otkazib-yuborish', ...S4 },
  { role: 'explain',  tag: 'qavs-ochish-ishorasi', ...S5 },
  { role: 'explain',  tag: 'had-kochirish-ishorasi', ...S6 },
  { role: 'explain',  tag: 'butun-vs-kasr-tenglama', ...S7 },
  { role: 'rule',     tag: 'tekshirish-otkazib-yuborish', ...S8 },
  { role: 'practice', tool: 'track', tag: 'had-kochirish-ishorasi', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'qavs-ochish-ishorasi', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'tekshirish-otkazib-yuborish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'tekshirish-otkazib-yuborish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'had-kochirish-ishorasi', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
