// ============================================================================
// 9-sinf, Dars 30. EHTIMOLLIKNING KLASSIK TA'RIFI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Algebra 9, 34-§ (186-189-bet) va
// 35-§ (190-193-bet).
//   34-§: hodisalarning uch turi — MUMKIN BO'LMAGAN (o'yin kubigida 8
//       tushishi), MUQARRAR (oltidan katta bo'lmagan raqam tushishi),
//       TASODIFIY (5 tushishi). Teng imkoniyatli natijalar tushunchasi.
//   35-§: Paskal va Ferma yozishmasi (1654-yil 28-oktabr). Paskalning
//       o'z mulohazasi darslikda keltirilgan: muqarrar hodisaning
//       imkoniyati 1 deb olinsa, oltita teng imkoniyatli natijadan
//       bittasi olti barobar kichik, ya'ni 1/6.
//   Ta'rif (192-bet): P(A) = m/n, bunda n — teng imkoniyatli, o'zaro
//       birgalikda bo'lmagan barcha natijalar soni, m — A hodisa uchun
//       QULAYLIK TUG'DIRUVCHI natijalar soni.
//   1-masala (191-bet): 1 dan 20 gacha yozilgan 20 ta kartochka,
//       7 chiqishi P = 1/20. Davomi: tub son chiqishi — 2, 3, 5, 7,
//       11, 13, 17, 19, ya'ni m = 8, P = 8/20 = 2/5.
//   2-masala (192-bet): kubikda toq ochko, m = 3, n = 6, P = 1/2.
//   3-masala (192-bet): 6 qizil va 4 ko'k shar, qizil P = 6/10 = 3/5.
//   Chegaralar (192-193-bet): muqarrar P = 1, mumkin bo'lmagan P = 0,
//       tasodifiy 0 < P < 1.
//   Mashqlar 467-470 amaliyot ekranlarida ishlatildi.
//
// BU DARS 29-DARSNI YOPADI. U yerda tanga 500 marta tashlanib, chastota
// 0,504 chiqqandi va savol ochiq qolgandi: nega aynan yarim atrofida.
// Bugungi xuk shu savoldan boshlanadi — o'sha sonni bitta ham tashlash
// qilmasdan olish mumkinmi. 13-ekran esa ikkala yo'lni yonma-yon qo'yadi:
// kubik uchun nazariya 1/6 ≈ 0,167 beradi, 29-darsdagi ikki ming
// tashlash esa 0,17 bergandi. Va darrov chegara ko'rsatiladi: lampochka
// «yaroqli yoki yaroqsiz» uchun teng imkoniyat YO'Q, u yerda faqat
// chastota ishlaydi. Ya'ni ikkita ta'rif raqib emas, ular boshqa
// vaziyatlar uchun.
//
// TUZOQ (12-ekran) 35-§ ning asosiy shartiga qurilgan: Kamron «qizil
// yoki qizil emas — ikkita natija, demak 1/2» deb hisoblagan. Natijalar
// ikkita bo'lishi yetarli emas, ular TENG IMKONIYATLI bo'lishi kerak.
// Bu 29-darsdagi tuzoqdan boshqa xato: u yerda maxraj noto'g'ri olingandi,
// bu yerda esa natijalarning o'zi noto'g'ri sanaladi.
//
// ASBOB: `Gate` (14-17-darslardan) — navbat kelib, ikkita savatga
// ajratiladi. Bu yerda savatlar «qulay / qulay emas». Asbob nusxa
// olinmadi: uning uchta yozuvi (`capYes`, `capNo`, `varLabel`)
// parametrga chiqarildi, eski darslar tegilmadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Gate, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-30',
  n: 30,
  row: 30,
  block: 'Б5',
  topic: L(
    "Ehtimollikning klassik ta'rifi",
    'Классическое определение вероятности',
    'The classical definition of probability',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Hodisaning ehtimolligi qulay natijalar sonini barcha teng imkoniyatli natijalar soniga bo'lish",
    'Вероятность события это деление числа благоприятных исходов на число всех равновозможных',
    'The probability of an event divides the favourable outcomes by all the equally likely ones',
  ),
  L(
    "Natijalar TENG IMKONIYATLI bo'lmasa, ularni shunchaki sanash mumkin emas",
    'Если исходы НЕ РАВНОВОЗМОЖНЫ, их нельзя просто пересчитать',
    'If the outcomes are NOT equally likely, they cannot simply be counted',
  ),
  L(
    "Muqarrar hodisaning ehtimolligi birga, mumkin bo'lmaganiniki nolga teng",
    'Вероятность достоверного события равна единице, невозможного нулю',
    'A certain event has probability one, an impossible one has zero',
  ),
]

export const MISS = {
  'teng-imkoniyat-shartsiz': {
    what: L(
      "natijalar teng imkoniyatli ekani tekshirilmasdan sanaldi",
      'исходы пересчитаны без проверки их равновозможности',
      'the outcomes were counted without checking they are equally likely',
    ),
    wrong: null,
    at: 0,
  },
  'qulay-natijani-sanamaslik': {
    what: L(
      "qulaylik tug'diruvchi natijalar soni noto'g'ri sanaldi",
      'неверно сосчитано число благоприятных исходов',
      'the number of favourable outcomes was counted wrongly',
    ),
    wrong: null,
    at: 0,
  },
  'chekka-qiymatlarni-adashtirish': {
    what: L(
      "muqarrar va mumkin bo'lmagan hodisaning ehtimolligi almashtirildi",
      'перепутаны вероятности достоверного и невозможного события',
      'the probabilities of a certain and an impossible event were swapped',
    ),
    wrong: null,
    at: 0,
  },
  'qaysi-yol-ishlashi': {
    what: L(
      "klassik ta'rif ishlamaydigan joyda ham u qo'llanildi",
      'классическое определение применено там, где оно не работает',
      'the classical definition was applied where it does not work',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — 29-darsning ochiq savoli.
// ============================================================
const S1 = {
  eyebrow: L('TASHLAMASDAN', 'НЕ БРОСАЯ', 'WITHOUT TOSSING'),
  title: L(
    "O'sha sonni hisoblab olish mumkinmi",
    'Можно ли получить то же число вычислением',
    'Can that number be reached by computing',
  ),
  audio: [
    A('mount',
      "O'tgan darsda tangani besh yuz marta tashlab, nol butun besh yuz to'rt mingdan degan chastotani oldik.",
      'На прошлом уроке мы бросили монету пятьсот раз и получили частоту ноль целых пятьсот четыре тысячных.',
      'Last lesson we tossed a coin five hundred times and got a frequency of zero point five zero four.'),
    A('why',
      "Bu ish uzoq davom etdi. Xuddi o'sha sonni bitta ham tashlashsiz bilish mumkinmidi?",
      'Это заняло много времени. А можно ли было узнать то же число, не сделав ни одного броска?',
      'That took a while. Could the same number have been found without a single toss?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Tangada ikkita tomon bor. Yarimni tajribasiz olish mumkinmi?",
      'У монеты две стороны. Можно ли получить половину без опыта?',
      'A coin has two sides. Can the half be found without an experiment?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Ha: ikkita tomondan bittasi kerak, demak yarim",
          'Да: из двух сторон нужна одна, значит половина',
          'Yes: one of two sides is wanted, so a half',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Yo'q: buni faqat tashlab bilish mumkin",
          'Нет: это можно узнать только бросая',
          'No: this can only be learned by tossing',
        ),
        hint: L(
          "Tanganing tomonlari bir xil, birortasi og'irroq emas. Shuning uchun ularni sanash yetarli.",
          'Стороны монеты одинаковы, ни одна не тяжелее. Поэтому их достаточно сосчитать.',
          'The sides of a coin are alike, neither is heavier. So counting them is enough.',
        ),
      },
    ],
    after: L(
      "Ha. Agar natijalar bir xil imkoniyatga ega bo'lsa, ularni sanash kifoya. Bugun shu yo'lni o'rganamiz.",
      'Да. Если исходы имеют одинаковые шансы, достаточно их сосчитать. Сегодня изучим этот путь.',
      'Yes. When the outcomes have equal chances, counting them is enough. Today we learn that route.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — hodisalarning uch turi (34-§).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Uch xil hodisa",
    'Три вида событий',
    'Three kinds of events',
  ),
  audio: [
    A('mount',
      "Hodisalar uch turga bo'linadi. Mumkin bo'lmagan, muqarrar va tasodifiy.",
      'События делятся на три вида. Невозможные, достоверные и случайные.',
      'Events fall into three kinds. Impossible, certain, and random.'),
    A('why',
      "O'yin kubigi tashlanmoqda. Uning tomonlarida birdan oltigacha raqamlar bor.",
      'Бросают игральный кубик. На его гранях числа от одного до шести.',
      'A die is being rolled. Its faces carry the numbers one to six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Kubikda 8 raqami tushishi",
        'Выпадение числа 8 на кубике',
        'Rolling the number 8 on a die',
      )}
      steps={[]}
      ask={L(
        "Bu qanday hodisa?",
        'Какое это событие?',
        'What kind of event is this?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Mumkin bo'lmagan hodisa", 'Невозможное событие', 'An impossible event'),
        },
        {
          id: 'wrong',
          label: L('Tasodifiy hodisa', 'Случайное событие', 'A random event'),
          hint: L(
            "Tasodifiy hodisa ro'y berishi ham, bermasligi ham mumkin. Sakkiz esa hech qachon tusha olmaydi, kubikda bunday tomon yo'q.",
            'Случайное событие может произойти, а может нет. А восьмёрка выпасть не может никогда, такой грани нет.',
            'A random event may or may not happen. An eight can never come up, there is no such face.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Oltidan katta bo'lmagan raqam tushishi esa muqarrar hodisa, u har safar ro'y beradi. Beshlik tushishi tasodifiy.",
        'Верно. А выпадение числа не больше шести это достоверное событие, оно происходит каждый раз. Выпадение пятёрки случайно.',
        'Correct. Rolling a number not above six is a certain event, it happens every time. Rolling a five is random.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — Paskalning mulohazasi.
// ============================================================
const S3 = {
  eyebrow: L('PASKALNING XATI', 'ПИСЬМО ПАСКАЛЯ', "PASCAL'S LETTER"),
  title: L(
    "Bir ming olti yuz ellik to'rtinchi yil",
    'Тысяча шестьсот пятьдесят четвёртый год',
    'The year sixteen fifty four',
  ),
  audio: [
    A('mount',
      "Blez Paskal Pyer Fermaga yozgan xatida shunday mulohaza yuritgan. O'yinchi kubikni tashlaganda qanday son tushishini bilmaydi.",
      'Блез Паскаль в письме Пьеру Ферма рассуждал так. Игрок не знает, какое число выпадет при броске кубика.',
      'Blaise Pascal reasoned this way in a letter to Pierre de Fermat. A player does not know which number a die will show.'),
    A('why',
      "Lekin u oltita sonning teng imkoniyat bilan tushishini biladi. Biror son tushishi esa muqarrar, uning imkoniyati bir.",
      'Но он знает, что шесть чисел выпадают с равными шансами. А выпадение какого-то числа достоверно, его возможность равна единице.',
      'But he knows the six numbers come up with equal chances. And that some number appears is certain, its possibility is one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Muqarrar hodisaning imkoniyati 1 ga teng",
        'Возможность достоверного события равна 1',
        'The possibility of a certain event equals 1',
      )}
      steps={[
        { id: 'a', head: L('Teng imkoniyatli natijalar', 'Равновозможные исходы', 'Equally likely outcomes'), lines: ['1, 2, 3, 4, 5, 6'] },
      ]}
      ask={L(
        "Bittasining, masalan oltilikning imkoniyati qanday bo'ladi?",
        'Какой будет возможность одного из них, например шестёрки?',
        'What is the possibility of one of them, say the six?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Olti barobar kichik', 'В шесть раз меньше', 'Six times smaller') },
        {
          id: 'wrong',
          label: L("O'sha bir", 'Такая же единица', 'The same one'),
          hint: L(
            "Bir bu BARCHA oltita natijaning birgalikdagi imkoniyati. Ular teng, demak bir oltita bo'lakka bo'linadi.",
            'Единица это возможность ВСЕХ шести исходов вместе. Они равны, значит единица делится на шесть частей.',
            'One is the possibility of ALL six outcomes together. They are equal, so the one splits into six parts.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir oltidan. Paskal xuddi shunday yozgan, va bu ehtimollik nazariyasining boshlanishi bo'lgan.",
        'Верно. Одна шестая. Именно так писал Паскаль, и с этого началась теория вероятностей.',
        'Correct. One sixth. That is exactly what Pascal wrote, and probability theory began there.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — ta'rif, darslikning 1-masalasi.
// ============================================================
const S4 = {
  eyebrow: L('BELGILASH', 'ОБОЗНАЧЕНИЕ', 'THE NOTATION'),
  title: L(
    "m bo'lingan n",
    'm делить на n',
    'm over n',
  ),
  audio: [
    A('mount',
      "Barcha teng imkoniyatli natijalar sonini n deb, hodisaga qulaylik tug'diruvchilarini m deb belgilaymiz.",
      'Число всех равновозможных исходов обозначим n, а благоприятствующих событию m.',
      'Call n the number of all equally likely outcomes and m those favourable to the event.'),
    A('why',
      "Yigirmata kartochkaga birdan yigirmagacha sonlar yozilgan. Tasodifan bittasi olinadi.",
      'На двадцати карточках написаны числа от одного до двадцати. Наугад берут одну.',
      'Twenty cards carry the numbers one to twenty. One is drawn at random.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1, 2, 3, ..., 20', '1, 2, 3, ..., 20', '1, 2, 3, ..., 20')}
      steps={[
        { id: 'a', head: L('Tarifga kora', 'По определению', 'By the definition'), lines: ['P = m : n'] },
      ]}
      ask={L(
        "Yettilik chiqishining ehtimolligi nechaga teng?",
        'Чему равна вероятность вытянуть семёрку?',
        'What is the probability of drawing the seven?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'P = 1/20' },
        {
          id: 'wrong',
          label: 'P = 7/20',
          hint: L(
            "Yetti bu kartochkadagi SON, qulay natijalarning soni emas. Yettilik yozilgan kartochka esa bitta.",
            'Семь это ЧИСЛО на карточке, а не количество благоприятных исходов. Карточка с семёркой одна.',
            'Seven is the NUMBER on the card, not the count of favourable outcomes. There is only one card with a seven.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qulay natija bitta, hammasi yigirmata. Bu yozuv P harfi bilan belgilanadi, lotincha probabilitas so'zidan.",
        'Верно. Благоприятный исход один, всего их двадцать. Обозначают это буквой P, от латинского probabilitas.',
        'Correct. One favourable outcome out of twenty. It is written with the letter P, from the Latin probabilitas.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — Gate: qulay natijalarni sanash.
// ============================================================
const S5 = {
  eyebrow: L('QULAYLARNI SANASH', 'СЧИТАЕМ БЛАГОПРИЯТНЫЕ', 'COUNTING THE FAVOURABLE'),
  title: L(
    "Qulay natija bittadan ko'p bo'lsa",
    'Когда благоприятных исходов больше одного',
    'When more than one outcome is favourable',
  ),
  audio: [
    A('mount',
      "O'sha yigirmata kartochka. Endi tub son chiqishining ehtimolligi kerak.",
      'Те же двадцать карточек. Теперь нужна вероятность вытянуть простое число.',
      'The same twenty cards. Now the probability of drawing a prime is wanted.'),
    A('why',
      "Har bir sonni ko'rib chiqing va tub bo'lsa qulay savatga yuboring.",
      'Просмотри каждое число и отправляй простые в корзину благоприятных.',
      'Look at each number and send the primes into the favourable basket.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Gate
      formula={L(
        'Tub son chiqishi',
        'Выпадение простого числа',
        'Drawing a prime number',
      )}
      f={(v) => {
        if (v < 2) return null
        for (let d = 2; d * d <= v; d += 1) if (v % d === 0) return null
        return 1
      }}
      queue={[
        { v: 1, hint: L("Bir tub son emas: tub sonning ikkita bo'luvchisi bo'ladi, birning esa faqat bitta.", 'Единица не простое число: у простого два делителя, а у единицы только один.', 'One is not prime: a prime has two divisors and one has only a single divisor.') },
        { v: 2, hint: L("Ikki tub son, ya'ni qulay natija. U yagona juft tub son.", 'Двойка простое число, то есть благоприятный исход. Это единственное чётное простое.', 'Two is prime and so a favourable outcome. It is the only even prime.') },
        { v: 9, hint: L("To'qqiz uchga bo'linadi, demak tub emas.", 'Девять делится на три, значит не простое.', 'Nine divides by three, so it is not prime.') },
        { v: 11, hint: L("O'n bir faqat birga va o'ziga bo'linadi, demak tub.", 'Одиннадцать делится только на единицу и себя, значит простое.', 'Eleven divides only by one and itself, so it is prime.') },
        { v: 15, hint: L("O'n besh uchga va beshga bo'linadi.", 'Пятнадцать делится на три и на пять.', 'Fifteen divides by three and by five.') },
        { v: 19, hint: L("O'n to'qqiz tub son, yigirmagacha bo'lgan oxirgisi.", 'Девятнадцать простое, последнее до двадцати.', 'Nineteen is prime, the last one below twenty.') },
      ]}
      ask={L(
        "Bu son qulay natijami?",
        'Этот исход благоприятный?',
        'Is this outcome favourable?',
      )}
      capYes={L('Qulay', 'Благоприятный', 'Favourable')}
      capNo={L('Qulay emas', 'Не благоприятный', 'Not favourable')}
      varLabel={L('son', 'число', 'number')}
      answer={L('P = 8/20 = 2/5', 'P = 8/20 = 2/5', 'P = 8/20 = 2/5')}
      after={L(
        "Yigirmata sondan sakkiztasi tub: ikki, uch, besh, yetti, o'n bir, o'n uch, o'n yetti, o'n to'qqiz. Demak ehtimollik sakkiz bo'lingan yigirma, ya'ni ikki beshdan.",
        'Из двадцати чисел восемь простых: два, три, пять, семь, одиннадцать, тринадцать, семнадцать, девятнадцать. Значит вероятность восемь на двадцать, то есть две пятых.',
        'Of twenty numbers eight are prime: two, three, five, seven, eleven, thirteen, seventeen, nineteen. So the probability is eight over twenty, that is two fifths.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — kubik va tanga, 29-dars bilan tutashuv.
// ============================================================
const S6 = {
  eyebrow: L('YARIM QAYERDAN', 'ОТКУДА ПОЛОВИНА', 'WHERE THE HALF COMES FROM'),
  title: L(
    "Endi o'tgan darsning javobi",
    'Теперь ответ прошлого урока',
    "Now the answer to last lesson",
  ),
  audio: [
    A('mount',
      "Kubikda toq ochko chiqishining ehtimolligini toping. Toq sonlar bir, uch va besh.",
      'Найди вероятность выпадения нечётного очка на кубике. Нечётные это один, три и пять.',
      'Find the probability of an odd score on a die. The odd ones are one, three, and five.'),
    A('why',
      "Qulay natijalar uchta, hammasi oltita.",
      'Благоприятных исходов три, всего шесть.',
      'Three outcomes are favourable out of six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('m = 3,   n = 6', 'm = 3,   n = 6', 'm = 3,   n = 6')}
      steps={[
        { id: 'a', head: L('Formulaga', 'В формулу', 'Into the formula'), lines: ['P = 3 : 6'] },
      ]}
      ask={L(
        "Ehtimollik nechaga teng?",
        'Чему равна вероятность?',
        'What does the probability equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'P = 1/2' },
        {
          id: 'wrong',
          label: 'P = 1/3',
          hint: L(
            "Bir uchdan uchta qulay natijaning bitta ekanini bildirardi. Bu yerda esa uchtasi ham qulay, ular oltitadan uchtasi.",
            'Одна третья означала бы, что из трёх благоприятен один. А здесь благоприятны все три, они три из шести.',
            'One third would mean one of three is favourable. Here all three are favourable, three out of six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, yarim. Tanga uchun ham xuddi shunday: ikkita tomondan bittasi, yarim. Mana o'tgan darsdagi nol butun besh yuz to'rt mingdan qayerga intilgani.",
        'Верно, половина. Для монеты так же: из двух сторон одна, половина. Вот к чему стремилось прошлое ноль целых пятьсот четыре тысячных.',
        'Correct, a half. The same holds for a coin: one of two sides, a half. That is what last lesson zero point five zero four was heading for.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — chegaraviy qiymatlar.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARALAR', 'ГРАНИЦЫ', 'THE BOUNDS'),
  title: L(
    "Ehtimollik noldan birgacha",
    'Вероятность от нуля до единицы',
    'Probability runs from zero to one',
  ),
  audio: [
    A('mount',
      "Muqarrar hodisada barcha natijalar qulay, ya'ni m va n teng. Formula birni beradi.",
      'В достоверном событии все исходы благоприятны, то есть m и n равны. Формула даёт единицу.',
      'For a certain event every outcome is favourable, so m equals n. The formula gives one.'),
    A('why',
      "Mumkin bo'lmagan hodisada esa qulay natija umuman yo'q.",
      'А в невозможном событии благоприятных исходов нет вовсе.',
      'For an impossible event there are no favourable outcomes at all.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Kubikda 8 tushishi",
        'Выпадение 8 на кубике',
        'Rolling an 8 on a die',
      )}
      steps={[
        { id: 'a', head: L('Qulay natijalar', 'Благоприятные исходы', 'Favourable outcomes'), lines: ['m = 0'] },
      ]}
      ask={L(
        "Bu hodisaning ehtimolligi nechaga teng?",
        'Чему равна вероятность этого события?',
        'What does the probability of this event equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'P = 0' },
        {
          id: 'wrong',
          label: 'P = 1',
          hint: L(
            "Bir MUQARRAR hodisaga tegishli, u har safar ro'y beradi. Sakkiz esa hech qachon tushmaydi.",
            'Единица относится к ДОСТОВЕРНОМУ событию, оно происходит каждый раз. А восьмёрка не выпадет никогда.',
            'One belongs to a CERTAIN event, which happens every time. An eight never comes up.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Nol bo'lingan olti nolga teng. Tasodifiy hodisada esa qulay natijalar bor, lekin hammasi emas, shuning uchun ehtimollik noldan katta va birdan kichik.",
        'Верно. Ноль делить на шесть равно нулю. У случайного события благоприятные исходы есть, но не все, поэтому вероятность больше нуля и меньше единицы.',
        'Correct. Zero over six is zero. A random event has some favourable outcomes but not all, so its probability is above zero and below one.',
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
    "Algebra 9, 34-35-§, hodisalar va ehtimollik ta'rifi (186-193-bet)",
    'Алгебра 9, §34-35, события и определение вероятности (стр. 186-193)',
    'Algebra 9, §34-35, events and the definition of probability (p. 186-193)',
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
          "Natijalarni sanashdan oldin nima tekshiriladi?",
          'Что проверяется перед подсчётом исходов?',
          'What is checked before counting the outcomes?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ular teng imkoniyatlimi", 'Равновозможны ли они', 'Whether they are equally likely'),
          },
          {
            id: 'wrong',
            label: L("Ular nechtaligi", 'Сколько их', 'How many there are'),
            hint: L(
              "Nechtaligi keyingi qadam. Avval ularning imkoniyati bir xilmi, shuni bilish kerak, aks holda sanash ma'nosini yo'qotadi.",
              'Сколько их это следующий шаг. Сначала нужно знать, одинаковы ли их шансы, иначе счёт теряет смысл.',
              'How many is the next step. First we must know their chances are equal, otherwise counting loses its meaning.',
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
    "Sanash, lekin shart bilan",
    'Считать, но при условии',
    'Count, but on a condition',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz hodisalarning turini ajratdingiz, Paskalning mulohazasini takrorladingiz va qulay natijalarni sanadingiz.",
      'На семи экранах ты различил виды событий, повторил рассуждение Паскаля и посчитал благоприятные исходы.',
      'On seven screens you told the kinds of events apart, retraced Pascal reasoning, and counted favourable outcomes.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: sharlar (467, 468-mashqlar).
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Qutidagi sharlar",
    'Шары в коробке',
    'Balls in a box',
  ),
  audio: [
    A('mount',
      "Uchta savol. Har birida avval hamma sharlarni sanang, keyin keraklilarini.",
      'Три вопроса. В каждом сначала сосчитай все шары, потом нужные.',
      'Three questions. In each, count all the balls first, then the ones wanted.'),
    A('why',
      "Sharlar bir xil, faqat rangi boshqa, demak ular teng imkoniyatli.",
      'Шары одинаковы, отличается только цвет, значит они равновозможны.',
      'The balls are alike apart from colour, so they are equally likely.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Rang bo'yicha savol berilganda maxraj o'zgarmaydi, faqat surat o'zgaradi.",
      'Все три найдены. При вопросах по цвету знаменатель не меняется, меняется только числитель.',
      'All three are found. For colour questions the denominator stays put, only the numerator changes.',
    ),
    tasks: [
      {
        expr: '4 + 5 = 9',
        question: L(
          "Qutida to'rtta qizil va beshta ko'k shar bor. Olingan shar qizil bo'lish ehtimolligi qanday?",
          'В коробке четыре красных и пять синих шаров. Какова вероятность, что вынутый шар красный?',
          'A box holds four red and five blue balls. What is the probability the drawn ball is red?',
        ),
        ok: L("Ha. Qizil sharlar to'rtta, hammasi to'qqizta.", 'Да. Красных шаров четыре, всего девять.', 'Yes. Four balls are red out of nine.'),
        items: [
          { id: 'a', right: true, label: 'P = 4/9' },
          { id: 'b', label: 'P = 4/5', hint: L("Maxrajga beshni qo'yish ko'k sharlarga bo'lish demakdir. Maxrajda esa BARCHA sharlar turishi kerak, ya'ni to'qqiz.", 'Поставить в знаменатель пять значит делить на синие. А в знаменателе должны стоять ВСЕ шары, то есть девять.', 'Putting five in the denominator divides by the blue ones. The denominator must hold ALL the balls, that is nine.') },
        ],
        solution: ['m = 4,  n = 9', 'P = 4/9'],
      },
      {
        expr: '4 + 5 = 9',
        question: L(
          "O'sha qutidan olingan shar yashil bo'lish ehtimolligi qanday?",
          'Какова вероятность, что вынутый из той же коробки шар зелёный?',
          'What is the probability that a ball drawn from the same box is green?',
        ),
        ok: L("Ha, nol. Qutida yashil shar yo'q, bu mumkin bo'lmagan hodisa.", 'Да, ноль. Зелёных шаров в коробке нет, это невозможное событие.', 'Yes, zero. There are no green balls in the box, this is an impossible event.'),
        items: [
          { id: 'a', right: true, label: 'P = 0' },
          { id: 'b', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be determined'), hint: L("Aniqlash mumkin. Qulay natijalar soni nolga teng, formula esa nolni to'qqizga bo'ladi.", 'Определить можно. Число благоприятных исходов равно нулю, а формула делит ноль на девять.', 'It can be determined. The favourable count is zero, and the formula divides zero by nine.') },
        ],
        solution: ['m = 0,  n = 9', 'P = 0'],
      },
      {
        expr: '3 + 4 + 5 = 12',
        question: L(
          "Qutida uchta ko'k, to'rtta sariq va beshta qizil shar bor. Olingan shar ko'k emas bo'lish ehtimolligi qanday?",
          'В коробке три синих, четыре жёлтых и пять красных шаров. Какова вероятность, что вынутый шар не синий?',
          'A box holds three blue, four yellow and five red balls. What is the probability the drawn ball is not blue?',
        ),
        ok: L("Ha. Ko'k bo'lmaganlar to'qqizta, hammasi o'n ikkita, ya'ni uch to'rtdan.", 'Да. Не синих девять, всего двенадцать, то есть три четвёртых.', 'Yes. Nine are not blue out of twelve, that is three quarters.'),
        items: [
          { id: 'a', right: true, label: 'P = 3/4' },
          { id: 'b', label: 'P = 1/4', hint: L("Bir to'rtdan bu KO'K shar chiqish ehtimolligi. Savol esa ko'k EMAS bo'lishi haqida, ular ancha ko'p.", 'Одна четвёртая это вероятность СИНЕГО шара. А вопрос про НЕ синий, таких намного больше.', 'One quarter is the probability of a BLUE ball. The question asks for NOT blue, and there are far more of those.') },
        ],
        solution: ['m = 4 + 5 = 9,  n = 12', 'P = 9/12 = 3/4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: kartochkalar (469-mashq).
// ============================================================
const S10 = {
  eyebrow: L('KARTOCHKALAR', 'КАРТОЧКИ', 'THE CARDS'),
  title: L(
    "Birdan o'n ikkigacha",
    'От одного до двенадцати',
    'From one to twelve',
  ),
  audio: [
    A('mount',
      "O'n ikkita kartochkaga birdan o'n ikkigacha sonlar yozilgan. Tasodifan bittasi olinadi.",
      'На двенадцати карточках написаны числа от одного до двенадцати. Наугад берут одну.',
      'Twelve cards carry the numbers one to twelve. One is drawn at random.'),
    A('why',
      "Har safar qulay natijalarni sanang. Maxraj o'zgarmaydi.",
      'Каждый раз считай благоприятные исходы. Знаменатель не меняется.',
      'Count the favourable outcomes each time. The denominator does not change.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Bir xil to'plamda turli hodisalar turli ehtimollikka ega, chunki qulay natijalar soni har xil.",
      'Все три найдены. В одном наборе разные события имеют разную вероятность, ведь число благоприятных исходов разное.',
      'All three are found. In one set different events have different probabilities, since the favourable counts differ.',
    ),
    tasks: [
      {
        expr: '1 ... 12',
        question: L('Juft son chiqish ehtimolligi qanday?', 'Какова вероятность вытянуть чётное число?', 'What is the probability of drawing an even number?'),
        ok: L("Ha. Juft sonlar oltita, hammasi o'n ikkita, ya'ni yarim.", 'Да. Чётных шесть, всего двенадцать, то есть половина.', 'Yes. Six are even out of twelve, that is a half.'),
        items: [
          { id: 'a', right: true, label: 'P = 1/2' },
          { id: 'b', label: 'P = 6/6', hint: L("Maxrajga oltini qo'yish faqat juft sonlarni hisobga olish demakdir. Toq sonlar ham to'plamda, ular ham chiqishi mumkin.", 'Поставить в знаменатель шесть значит учесть только чётные. Нечётные тоже в наборе и тоже могут выпасть.', 'Putting six in the denominator counts only the even ones. The odd ones are in the set too and can also come up.') },
        ],
        solution: ['m = 6,  n = 12', 'P = 1/2'],
      },
      {
        expr: '1 ... 12',
        question: L('Uchga karrali son chiqish ehtimolligi qanday?', 'Какова вероятность вытянуть число, кратное трём?', 'What is the probability of drawing a multiple of three?'),
        ok: L("Ha. Uch, olti, to'qqiz, o'n ikki, ya'ni to'rtta. To'rt bo'lingan o'n ikki bir uchdan.", 'Да. Три, шесть, девять, двенадцать, то есть четыре. Четыре на двенадцать это одна третья.', 'Yes. Three, six, nine, twelve, that is four. Four over twelve is one third.'),
        items: [
          { id: 'a', right: true, label: 'P = 1/3' },
          { id: 'b', label: 'P = 1/4', hint: L("Bir to'rtdan to'rtta qulay natijaning bittasini bildirardi. Bu yerda esa to'rttasi ham qulay, ular o'n ikkitadan to'rttasi.", 'Одна четвёртая означала бы один благоприятный из четырёх. А здесь благоприятны все четыре из двенадцати.', 'One quarter would mean one favourable in four. Here all four are favourable out of twelve.') },
        ],
        solution: ['3, 6, 9, 12', 'm = 4,  n = 12', 'P = 1/3'],
      },
      {
        expr: '1 ... 12',
        question: L('Tub son chiqish ehtimolligi qanday?', 'Какова вероятность вытянуть простое число?', 'What is the probability of drawing a prime?'),
        ok: L("Ha. Ikki, uch, besh, yetti, o'n bir, ya'ni beshta. Besh bo'lingan o'n ikki.", 'Да. Два, три, пять, семь, одиннадцать, то есть пять. Пять на двенадцать.', 'Yes. Two, three, five, seven, eleven, that is five. Five over twelve.'),
        items: [
          { id: 'a', right: true, label: 'P = 5/12' },
          { id: 'b', label: 'P = 6/12', hint: L("Oltita bo'lishi uchun birni ham tub deb sanash kerak edi. Bir tub son emas, uning bo'luvchisi bitta.", 'Чтобы вышло шесть, пришлось бы счесть простой и единицу. Единица не простое, у неё один делитель.', 'Six would require counting one as prime. One is not prime, it has a single divisor.') },
        ],
        solution: ['2, 3, 5, 7, 11', 'm = 5,  n = 12', 'P = 5/12'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — 470-mashq: telefon nomeri.
// ============================================================
const S11 = {
  eyebrow: L('TELEFON', 'ТЕЛЕФОН', 'THE PHONE'),
  title: L(
    "Ikkita raqamni unutib qo'yish",
    'Забыть две цифры',
    'Forgetting two digits',
  ),
  audio: [
    A('mount',
      "Nigora dugonasining telefon nomerining oxirgi ikkita raqamini esdan chiqargan va ularni tavakkaliga tergan.",
      'Нигора забыла две последние цифры номера подруги и набрала их наугад.',
      'Nigora forgot the last two digits of her friend number and dialled them at random.'),
    A('why',
      "Har bir raqam nolldan to'qqizgacha bo'lishi mumkin.",
      'Каждая цифра может быть от нуля до девяти.',
      'Each digit can be anything from zero to nine.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham to'g'ri. Bunday masalada avval natijalar sonini topish kerak, ular ko'p va sanab chiqib bo'lmaydi.",
      'Оба шага верны. В такой задаче сначала нужно найти число исходов, их много и перебрать нельзя.',
      'Both steps are right. In such a problem the outcome count comes first, since there are too many to list.',
    ),
    tasks: [
      {
        expr: '_ _',
        question: L(
          "Ikkita raqamni nechta xil usulda terish mumkin?",
          'Сколькими способами можно набрать две цифры?',
          'In how many ways can two digits be dialled?',
        ),
        ok: L(
          "Ha, yuzta. Birinchi raqam uchun o'nta imkoniyat, har biriga ikkinchi raqamning o'ntasi.",
          'Да, сто. Для первой цифры десять возможностей, к каждой десять для второй.',
          'Yes, a hundred. Ten choices for the first digit and ten for the second with each.',
        ),
        items: [
          { id: 'a', right: true, label: 'n = 100' },
          { id: 'b', label: 'n = 20', hint: L("Yigirma o'nta va o'ntani QO'SHGANDA chiqadi. Lekin har bir birinchi raqamga o'nta ikkinchi raqam mos keladi, demak ko'paytirish kerak.", 'Двадцать выходит при СЛОЖЕНИИ десяти и десяти. Но каждой первой цифре отвечают десять вторых, значит нужно умножать.', 'Twenty comes from ADDING ten and ten. But each first digit pairs with ten second digits, so multiply.') },
        ],
        solution: ['10 · 10 = 100'],
      },
      {
        expr: 'n = 100',
        question: L(
          "Nigora birinchi urinishda dugonasiga tushish ehtimolligi qanday?",
          'Какова вероятность, что Нигора с первой попытки попадёт к подруге?',
          'What is the probability Nigora reaches her friend on the first try?',
        ),
        ok: L(
          "Ha, bir yuzdan. To'g'ri juftlik faqat bitta, hammasi yuzta.",
          'Да, одна сотая. Верная пара только одна, всего сто.',
          'Yes, one hundredth. There is only one correct pair out of a hundred.',
        ),
        items: [
          { id: 'a', right: true, label: 'P = 1/100' },
          { id: 'b', label: 'P = 1/2', hint: L("Yarim ikkita teng imkoniyatli natijada bo'lardi, masalan tangada. Bu yerda esa yuzta natija bor.", 'Половина была бы при двух равновозможных исходах, как у монеты. А здесь исходов сто.', 'A half would need two equally likely outcomes, as with a coin. Here there are a hundred.') },
        ],
        solution: ['m = 1,  n = 100', 'P = 0,01'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — «ikkita natija, demak yarim».
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ikkita natija hali yarim degani emas",
    'Два исхода ещё не значат половину',
    'Two outcomes do not yet mean a half',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Qutida bitta qizil va to'qqizta ko'k shar bor. U shunday deb o'ylagan. Shar yo qizil, yo qizil emas, ikkita natija, demak ehtimollik yarim.",
      'Решение Камрона. В коробке один красный и девять синих шаров. Он рассудил так. Шар либо красный, либо нет, два исхода, значит вероятность половина.',
      "Kamron's solution. A box holds one red and nine blue balls. He reasoned this way. The ball is either red or not, two outcomes, so the probability is a half."),
    A('why',
      "Natijalar haqiqatan ham ikkita. Lekin formulaning sharti nima edi?",
      'Исходов действительно два. Но каким было условие формулы?',
      'There really are two outcomes. But what was the condition of the formula?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Formulaga natijalarni shunchaki sanab qo'yib bo'lmaydi, ular TENG IMKONIYATLI bo'lishi shart. Qizil bitta, ko'k to'qqizta — bu ikkita natijaning imkoniyati aslo teng emas.",
      'В формулу нельзя подставлять просто пересчитанные исходы, они обязаны быть РАВНОВОЗМОЖНЫМИ. Красный один, синих девять — шансы этих двух исходов совсем не равны.',
      'Outcomes cannot simply be counted into the formula, they must be EQUALLY LIKELY. One red against nine blue means these two outcomes are nowhere near equal.',
    ),
    tasks: [
      {
        expr: '1 + 9 = 10      P = 1/2 ?',
        question: L(
          "Kamron ikkita natijani sanadi. Xato qayerda?",
          'Камрон посчитал два исхода. Где ошибка?',
          'Kamron counted two outcomes. Where is the mistake?',
        ),
        ok: L(
          "To'g'ri. Bu ikkita natija teng imkoniyatli emas. Teng imkoniyatli natijalar bu o'nta sharning o'zi, qulaylari esa bitta. Javob bir o'ndan.",
          'Верно. Эти два исхода не равновозможны. Равновозможные исходы это сами десять шаров, благоприятный один. Ответ одна десятая.',
          'Correct. Those two outcomes are not equally likely. The equally likely outcomes are the ten balls themselves, one of them favourable. The answer is one tenth.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Natijalar teng imkoniyatli emas, javob 1/10", 'Исходы не равновозможны, ответ 1/10', 'The outcomes are not equally likely, the answer is 1/10'),
          },
          {
            id: 'b',
            label: L("Xato yo'q, javob yarim", 'Ошибки нет, ответ половина', 'There is no mistake, the answer is a half'),
            hint: L(
              "Kamronning usuli bilan yuzta ko'k va bitta qizil sharda ham yarim chiqadi. Bu esa aniq noto'g'ri: qizilni topish deyarli imkonsiz bo'lardi.",
              'По способу Камрона половина выйдет и при ста синих с одним красным. А это явно неверно: красный достать было бы почти невозможно.',
              "By Kamron's method a hundred blue with one red also gives a half. That is plainly wrong: finding the red would be next to impossible.",
            ),
          },
        ],
        solution: [
          'm = 1,  n = 10',
          'P = 1/10',
          L('Kamron: 1 : 2 = 0,5', 'Камрон: 1 : 2 = 0,5', 'Kamron: 1 : 2 = 0,5'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — ikki yo'l va ularning chegarasi.
// ============================================================
const S13 = {
  eyebrow: L("IKKI YO'L", 'ДВА ПУТИ', 'TWO ROUTES'),
  title: L(
    "Qachon sanaymiz, qachon o'lchaymiz",
    'Когда считаем, когда измеряем',
    'When to count and when to measure',
  ),
  audio: [
    A('mount',
      "Endi ikkala darsni yonma-yon qo'yamiz. Kubik uchun nazariya bir oltidan, ya'ni nol butun bir yuz oltmish yetti mingdan beradi.",
      'Теперь поставим оба урока рядом. Для кубика теория даёт одну шестую, то есть ноль целых сто шестьдесят семь тысячных.',
      'Now put both lessons side by side. For a die theory gives one sixth, that is zero point one six seven.'),
    A('why',
      "O'tgan darsda ikki ming tashlash nol butun o'n yetti yuzdan bergandi. Ikkala yo'l bir joyga olib keldi.",
      'На прошлом уроке две тысячи бросков дали ноль целых семнадцать сотых. Оба пути привели в одно место.',
      'Last lesson two thousand tosses gave zero point one seven. Both routes led to the same place.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkita ta'rif raqib emas. Natijalar teng imkoniyatli bo'lsa, sanash qulayroq va aniqroq. Bo'lmasa, faqat tajriba qoladi — aynan shuning uchun darslik chastotani ham kiritadi.",
      'Два определения не соперники. Если исходы равновозможны, считать удобнее и точнее. Если нет, остаётся только опыт — именно поэтому учебник вводит и частоту.',
      'The two definitions are not rivals. When the outcomes are equally likely, counting is easier and sharper. When they are not, only experiment remains — which is exactly why the textbook introduces frequency too.',
    ),
    tasks: [
      {
        expr: 'P = 1/6 ≈ 0,167      W = 0,17',
        question: L(
          "Nazariya va tajriba bir xil sonni berdi. Bu tasodifmi?",
          'Теория и опыт дали одно число. Это случайность?',
          'Theory and experiment gave the same number. Is that a coincidence?',
        ),
        ok: L(
          "To'g'ri. Katta sonlar qonuni aynan shuni va'da qilgandi: tajribalar ko'p bo'lganda chastota ehtimollikka yaqinlashadi.",
          'Верно. Закон больших чисел именно это и обещал: при многих опытах частота приближается к вероятности.',
          'Correct. The law of large numbers promised precisely this: with many trials the frequency closes in on the probability.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, katta sonlar qonuni shuni va'da qilgan", 'Нет, это обещал закон больших чисел', 'No, the law of large numbers promised it'),
          },
          {
            id: 'b',
            label: L('Ha, shunchaki tasodif', 'Да, просто совпадение', 'Yes, just a coincidence'),
            hint: L(
              "29-darsning oxirgi ekranini eslang. U yerda chastota barqarorlashadigan son statistik ehtimollik deb atalgandi.",
              'Вспомни последние экраны 29 урока. Там число, около которого устойчива частота, названо статистической вероятностью.',
              'Recall the closing screens of lesson 29. The number the frequency settles around was called the statistical probability.',
            ),
          },
        ],
        solution: ['1 : 6 ≈ 0,1667', 'W = 0,17'],
      },
      {
        expr: 'P = m : n ?',
        question: L(
          "Lampochka yaroqli yoki yaroqsiz. Ehtimollikni sanab topish mumkinmi?",
          'Лампочка годна или бракована. Можно ли найти вероятность подсчётом?',
          'A bulb is good or faulty. Can the probability be found by counting?',
        ),
        ok: L(
          "To'g'ri, mumkin emas. Ikkita natija bor, lekin ular teng imkoniyatli emas: yaroqli lampochkalar ancha ko'p. Bu yerda faqat chastota ishlaydi.",
          'Верно, нельзя. Исходов два, но они не равновозможны: годных лампочек намного больше. Здесь работает только частота.',
          'Correct, it cannot. There are two outcomes but they are not equally likely: good bulbs are far more common. Only frequency works here.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, natijalar teng imkoniyatli emas", 'Нет, исходы не равновозможны', 'No, the outcomes are not equally likely'),
          },
          {
            id: 'b',
            label: L('Ha, ikkita natija, demak yarim', 'Да, два исхода, значит половина', 'Yes, two outcomes, so a half'),
            hint: L(
              "Bu 12-ekrandagi Kamronning xatosining o'zi. Agar shunday bo'lganda, har ikkinchi lampochka yonmasdi.",
              'Это та же ошибка Камрона с 12 экрана. Если бы так было, каждая вторая лампочка не горела бы.',
              "This is the same mistake Kamron made on screen twelve. If it were so, every second bulb would fail.",
            ),
          },
        ],
        solution: [
          L('Teng imkoniyat yoq', 'Равновозможности нет', 'No equal likelihood'),
          L('Faqat chastota', 'Только частота', 'Frequency only'),
        ],
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
    "Blits: shart, sanoq, chegara",
    'Блиц: условие, счёт, граница',
    'Blitz: condition, count, bound',
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
        tag: 'teng-imkoniyat-shartsiz',
        ask: L(
          "Natijalar ikkita bo'lsa, ehtimollik har doim yarimmi?",
          'Если исходов два, вероятность всегда половина?',
          'If there are two outcomes, is the probability always a half?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Ular teng imkoniyatli bo'lgandagina yarim chiqadi.",
          'Верно. Половина выходит только когда они равновозможны.',
          'Correct. A half comes out only when they are equally likely.',
        ),
        hint: L(
          "12-ekranni eslang: bitta qizil va to'qqizta ko'k sharda ham natija ikkita edi.",
          'Вспомни 12 экран: при одном красном и девяти синих исходов тоже было два.',
          'Recall screen 12: one red and nine blue also gave two outcomes.',
        ),
      },
      {
        id: 'q2',
        tag: 'qulay-natijani-sanamaslik',
        ask: L(
          "Formulaning suratida nima turadi?",
          'Что стоит в числителе формулы?',
          'What stands in the numerator of the formula?',
        ),
        options: [
          { id: 'm', right: true, label: L('Qulay natijalar soni', 'Число благоприятных исходов', 'The count of favourable outcomes') },
          { id: 'n', label: L('Barcha natijalar soni', 'Число всех исходов', 'The count of all outcomes') },
        ],
        ok: L(
          "To'g'ri. Barcha natijalar maxrajda turadi.",
          'Верно. Все исходы стоят в знаменателе.',
          'Correct. All the outcomes go in the denominator.',
        ),
        hint: L(
          "5-ekranni eslang: sakkizta tub son suratga, yigirmata kartochka maxrajga tushgandi.",
          'Вспомни 5 экран: восемь простых пошли в числитель, двадцать карточек в знаменатель.',
          'Recall screen 5: eight primes went on top and twenty cards below.',
        ),
      },
      {
        id: 'q3',
        tag: 'chekka-qiymatlarni-adashtirish',
        ask: L(
          "Muqarrar hodisaning ehtimolligi nechaga teng?",
          'Чему равна вероятность достоверного события?',
          'What does the probability of a certain event equal?',
        ),
        options: [
          { id: 'one', right: true, label: '1' },
          { id: 'zero', label: '0' },
        ],
        ok: L(
          "To'g'ri. Barcha natijalar unga qulay, ya'ni m va n teng.",
          'Верно. Все исходы для него благоприятны, то есть m и n равны.',
          'Correct. Every outcome favours it, so m equals n.',
        ),
        hint: L(
          "7-ekranni eslang: nol MUMKIN BO'LMAGAN hodisaga tegishli edi.",
          'Вспомни 7 экран: ноль относился к НЕВОЗМОЖНОМУ событию.',
          'Recall screen 7: zero belonged to the IMPOSSIBLE event.',
        ),
      },
      {
        id: 'q4',
        tag: 'qaysi-yol-ishlashi',
        ask: L(
          "Natijalar teng imkoniyatli bo'lmasa, ehtimollik qanday topiladi?",
          'Как найти вероятность, если исходы не равновозможны?',
          'How is a probability found when the outcomes are not equally likely?',
        ),
        options: [
          { id: 'freq', right: true, label: L('Tajriba va chastota orqali', 'Через опыт и частоту', 'Through experiment and frequency') },
          { id: 'never', label: L("Uni umuman topib bo'lmaydi", 'Её вообще нельзя найти', 'It cannot be found at all') },
        ],
        ok: L(
          "To'g'ri. Aynan shuning uchun o'tgan darsda chastota kiritilgandi.",
          'Верно. Именно поэтому на прошлом уроке была введена частота.',
          'Correct. That is exactly why frequency was introduced last lesson.',
        ),
        hint: L(
          "13-ekranni eslang: lampochka uchun sanash yo'li yopiq edi, o'lchash esa ochiq.",
          'Вспомни 13 экран: для лампочки путь подсчёта был закрыт, а измерения открыт.',
          'Recall screen 13: for the bulb the counting route was closed and the measuring one open.',
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
    "Tashlamasdan ham bilish mumkin",
    'Узнать можно и не бросая',
    'It can be known without tossing',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda savol qo'yilgandi: o'tgan darsdagi yarimni tajribasiz olish mumkinmi. Bugun javob topildi.",
      'На первом экране был поставлен вопрос: можно ли получить прошлую половину без опыта. Сегодня ответ найден.',
      'On the first screen we asked whether last lesson half could be reached without an experiment. Today the answer came.'),
    A('s1',
      "Siz hodisalarning turini ajratdingiz, qulay natijalarni sanadingiz va ikkita ta'rif qayerda ishlashini bildingiz.",
      'Ты различил виды событий, посчитал благоприятные исходы и узнал, где работает каждое из двух определений.',
      'You told the kinds of events apart, counted favourable outcomes, and learned where each of the two definitions works.'),
    A('s2',
      "Keyingi darsda kombinatorika: natijalarni qanday sanash kerakligi haqida.",
      'В следующем уроке комбинаторика: о том, как считать сами исходы.',
      'Next lesson covers combinatorics: how to count the outcomes themselves.'),
  ],
  props: {
    mark: 'P = m : n',
    markNote: L(
      "natijalar teng imkoniyatli bo'lsa",
      'если исходы равновозможны',
      'when the outcomes are equally likely',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: kombinatorika',
      'Следующий урок: комбинаторика',
      'Next lesson: combinatorics',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'teng-imkoniyat-shartsiz', ...S2 },
  { role: 'explain',  tag: 'teng-imkoniyat-shartsiz', ...S3 },
  { role: 'explain',  tag: 'qulay-natijani-sanamaslik', ...S4 },
  { role: 'explain',  tool: 'gate', tag: 'qulay-natijani-sanamaslik', ...S5 },
  { role: 'explain',  tag: 'qulay-natijani-sanamaslik', ...S6 },
  { role: 'explain',  tag: 'chekka-qiymatlarni-adashtirish', ...S7 },
  { role: 'rule',     tag: 'teng-imkoniyat-shartsiz', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'qulay-natijani-sanamaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'qulay-natijani-sanamaslik', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'qulay-natijani-sanamaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'teng-imkoniyat-shartsiz', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'qaysi-yol-ishlashi', ...S13 },
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
