// ============================================================================
// 9-sinf, Dars 29. TASODIFIY HODISANING NISBIY CHASTOTASI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Algebra 9, 36-§ (194-196-bet).
//   Ta'rif (195-bet): W(A) = M/N, bunda M — hodisa ro'y bergan
//       tajribalar soni (chastota), N — barcha tajribalar soni.
//   1-masala (195-bet): 30 o'quvchidan 6 tasi 5 baho oldi,
//       W = 6/30 = 1/5.
//   Byuffon (195-bet): 4040 tashlashdan 2048 marta gerb, W ≈ 0,5069.
//   Pirson (195-bet): 24000 tashlashdan 12012 marta gerb, W = 0,5005.
//   Katta sonlar qonuni, Yakob Bernulli (196-bet): tajribalar soni
//       katta bo'lganda nisbiy chastota ehtimollikdan amalda farq
//       qilmaydi.
//   2-masala (196-bet): sayyohlar jadvali, M = 1 766 970,
//       N = 5 531 951, W ≈ 0,3194.
//
// DARS REJADA §36 NI §34-35 DAN OLDIN OLADI, ya'ni darslikning
// tartibiga TESKARI: klassik ta'rif 30-darsda keladi. Bu ataylab.
// Darslik 36-§ ni «klassik ta'rif har doim ishlamaydi» degan
// e'tirozdan boshlaydi — bu e'tiroz hali klassik ta'rifni ko'rmagan
// bolaga tushunarsiz. Teskari tartibda esa tabiiy chiqadi: avval
// TAJRIBA (chastotani sanash mumkin, hech qanday nazariya kerak emas),
// keyin savol «nega u aynan bir ikkidan atrofida turibdi» — va
// 30-darsning klassik ta'rifi shu savolga javob bo'ladi. Yakuniy
// ko'prik shunga tayyorlaydi.
//
// YANGI ASBOB: `FreqRun` (asboblar.jsx, 7D). Katta sonlar qonunini
// GAPIRIB berish mumkin emas — «tajribalar ko'paygan sari chastota
// barqarorlashadi» degan jumla isbot emas, iltimos bo'lib qoladi.
// Asbobda bola tajribani o'zi o'tkazadi va siniq chiziq o'sib boradi:
// dastlabki 10 tashlashda chastota BIRGA teng chiqadi (o'nta ham
// gerb), keyin 0,7 ga tushadi, 100 da 0,54, 200 da 0,495, 500 da
// 0,504. Tasodif qat'iy berilgan (mulberry32, seed 513), shuning
// uchun rasm har safar bir xil va tushuntirish «bugun shunday chiqdi»
// ga aylanmaydi.
//
// XUK ayni shu traektoriyaning boshiga tayanadi: 10 tashlashdan 7
// marta gerb tushgani hali hech narsa demaydi. 4-ekranda bola buni
// o'z ko'zi bilan ko'radi, chunki asbobning birinchi o'nligi undan
// ham keskin — o'nta ham gerb.
//
// TUZOQ (12-ekran): Kamron 30 o'quvchidan 6 tasini 6/24 deb hisoblagan,
// ya'ni butunga emas, QOLDIQQA bo'lgan. Bu nisbat mavzusining eng
// qadimgi xatosi va u chastotada ayniqsa xavfli, chunki javob
// haqiqatga yaqin chiqadi (0,25 va 0,2) — ko'z bilan tutilmaydi.
//
// TRANSFER (13-ekran) darslikda yo'q: 200 lampochkadan 6 tasi yaroqsiz,
// 5000 talik partiyada taxminan nechtasi yaroqsiz. Chastota shu yerda
// o'lchovdan BASHORATGA aylanadi — statistikaning butun amaliy ma'nosi
// shunda.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { FreqRun, G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-29',
  n: 29,
  row: 29,
  block: 'Б5',
  topic: L(
    'Nisbiy chastota va ehtimollik',
    'Относительная частота и вероятность',
    'Relative frequency and probability',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Nisbiy chastota hodisa ro'y bergan tajribalar sonini BARCHA tajribalar soniga bo'lish",
    'Относительная частота это деление числа опытов с событием на ВСЕ проведённые опыты',
    'The relative frequency divides the trials where the event happened by ALL the trials',
  ),
  L(
    "Kam tajribada chastota keskin sakraydi, tajribalar ko'paygan sari u barqarorlashadi",
    'При малом числе опытов частота резко скачет, с ростом числа опытов она устойчива',
    'With few trials the frequency jumps sharply, with many trials it settles down',
  ),
  L(
    "Chastota barqarorlashadigan son hodisaning statistik ehtimolligi deb qabul qilinadi",
    'Число, около которого устойчива частота, принимают за статистическую вероятность события',
    'The number the frequency settles around is taken as the statistical probability of the event',
  ),
]

export const MISS = {
  'kam-tajribadan-xulosa': {
    what: L(
      "xulosa juda kam sondagi tajribadan chiqarildi",
      'вывод сделан по слишком малому числу опытов',
      'a conclusion was drawn from far too few trials',
    ),
    wrong: null,
    at: 0,
  },
  'butunga-emas-qoldiqqa': {
    what: L(
      "chastota butun tajribalar soniga emas, qolganiga bo'lindi",
      'частота поделена не на все опыты, а на остаток',
      'the frequency was divided by the remainder instead of all the trials',
    ),
    wrong: null,
    at: 0,
  },
  'chastota-ehtimollik-farqi': {
    what: L(
      "bitta tajribalar qatorining chastotasi ehtimollikning o'zi deb olindi",
      'частота одной серии опытов принята за саму вероятность',
      'the frequency of a single run was taken to be the probability itself',
    ),
    wrong: null,
    at: 0,
  },
  'bashoratga-kochirmaslik': {
    what: L(
      "topilgan chastota katta partiyaga ko'chirilmadi",
      'найденная частота не перенесена на большую партию',
      'the frequency found was not carried over to the large batch',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — o'nta tashlash, yettita gerb.
// ============================================================
const S1 = {
  eyebrow: L("O'NTA TASHLASH", 'ДЕСЯТЬ БРОСКОВ', 'TEN TOSSES'),
  title: L(
    "Yettita gerb nimani isbotlaydi",
    'Что доказывают семь гербов',
    'What seven heads prove',
  ),
  audio: [
    A('mount',
      "Tangani o'n marta tashladik. Yetti marta gerb tushdi, uch marta raqam.",
      'Мы бросили монету десять раз. Семь раз выпал герб, три раза цифра.',
      'We tossed a coin ten times. Heads came up seven times, tails three.'),
    A('why',
      "Demak, bu tanga gerb tomoni bilan ko'proq tushadimi?",
      'Значит ли это, что эта монета чаще падает гербом?',
      'Does this mean the coin favours heads?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "O'n tashlashdan yettitasi gerb. Bu tanga haqida nima deydi?",
      'Семь гербов из десяти бросков. Что это говорит о монете?',
      'Seven heads out of ten tosses. What does this say about the coin?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Deyarli hech narsa: o'nta tashlash juda kam",
          'Почти ничего: десять бросков это слишком мало',
          'Almost nothing: ten tosses is far too few',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Gerb tushish imkoniyati nol butun yetti o'ndan",
          'Шанс герба равен ноль целых семь десятых',
          'The chance of heads is zero point seven',
        ),
        hint: L(
          "Tangani yana o'n marta tashlasangiz, boshqa son chiqadi. Bir marta o'tkazilgan qisqa tajriba tangani tavsiflay olmaydi.",
          'Брось монету ещё десять раз, и выйдет другое число. Один короткий опыт не описывает монету.',
          'Toss it ten more times and a different number comes out. One short run cannot describe the coin.',
        ),
      },
    ],
    after: L(
      "Ha. Qisqa tajriba aldaydi. Bugun tajribani uzaytirsak nima bo'lishini ko'ramiz.",
      'Да. Короткий опыт обманывает. Сегодня посмотрим, что будет, если опыт продлить.',
      'Yes. A short run misleads. Today we see what happens when the run is made longer.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — ulush.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qism butunga qanday bo'linadi",
    'Как часть делится на целое',
    'How a part divides by the whole',
  ),
  audio: [
    A('mount',
      "Ulushni topish uchun qismni butunga bo'lish kerak. Bu 28-darsdagi chastota bilan bir xil fikr.",
      'Чтобы найти долю, нужно разделить часть на целое. Это та же мысль, что и частота на 28 уроке.',
      'To find a share, divide the part by the whole. This is the same idea as the frequency in lesson 28.'),
    A('why',
      "Yettita gerb va jami o'nta tashlash.",
      'Семь гербов и всего десять бросков.',
      'Seven heads and ten tosses in all.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('7 / 10', '7 / 10', '7 / 10')}
      steps={[]}
      ask={L(
        "Gerblarning ulushi nechaga teng?",
        'Чему равна доля гербов?',
        'What does the share of heads equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0,7' },
        {
          id: 'wrong',
          label: '0,3',
          hint: L(
            "Nol butun uch o'ndan bu RAQAM tomonining ulushi. Savol esa gerb haqida, u yetti marta tushgan.",
            'Ноль целых три десятых это доля стороны с цифрой. А вопрос про герб, он выпал семь раз.',
            'Zero point three is the share of tails. The question is about heads, which came up seven times.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu son nisbiy chastota deyiladi. Uni har qanday tajribada sanash mumkin, hech qanday nazariya kerak emas.",
        'Верно. Это число называют относительной частотой. Её можно посчитать в любом опыте, никакой теории не нужно.',
        'Correct. This number is called the relative frequency. It can be counted in any run, with no theory needed.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ta'rif, darslikning 1-masalasi.
// ============================================================
const S3 = {
  eyebrow: L('BELGILASH', 'ОБОЗНАЧЕНИЕ', 'THE NOTATION'),
  title: L(
    "M bo'lingan N",
    'M делить на N',
    'M over N',
  ),
  audio: [
    A('mount',
      "Hodisa ro'y bergan tajribalar sonini M deb, barcha tajribalar sonini N deb belgilaymiz.",
      'Число опытов, в которых событие произошло, обозначим M, а число всех опытов N.',
      'Call M the number of trials where the event happened, and N the number of all trials.'),
    A('why',
      "Sinfda o'ttizta o'quvchi bor, ulardan oltitasi besh baho oldi.",
      'В классе тридцать учеников, шестеро получили пятёрку.',
      'There are thirty students in the class and six of them got a five.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('M = 6,   N = 30', 'M = 6,   N = 30', 'M = 6,   N = 30')}
      steps={[
        { id: 'a', head: L('Tarifga kora', 'По определению', 'By the definition'), lines: ['W = M : N'] },
      ]}
      ask={L(
        "A'lo baholarning nisbiy chastotasi nechaga teng?",
        'Чему равна относительная частота отличных оценок?',
        'What does the relative frequency of top marks equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0,2' },
        {
          id: 'wrong',
          label: '5',
          hint: L(
            "Besh bu o'ttizni oltiga bo'lgan natija, ya'ni teskarisi. Chastotada suratda hodisa turadi, maxrajda esa barcha tajribalar.",
            'Пять это результат деления тридцати на шесть, то есть наоборот. В частоте сверху событие, снизу все опыты.',
            'Five is thirty over six, the other way round. In a frequency the event goes on top and all the trials below.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Olti bo'lingan o'ttiz bir beshdan, ya'ni nol butun ikki o'ndan. Chastota har doim noldan birgacha bo'ladi.",
        'Верно. Шесть на тридцать это одна пятая, то есть ноль целых две десятых. Частота всегда от нуля до единицы.',
        'Correct. Six over thirty is one fifth, that is zero point two. A frequency always lies between zero and one.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — FreqRun: tajribani o'zi o'tkazadi.
// ============================================================
const S4 = {
  eyebrow: L('TAJRIBA', 'ОПЫТ', 'THE EXPERIMENT'),
  title: L(
    "Tashlashni davom ettiring va chiziqqa qarang",
    'Продолжай бросать и смотри на линию',
    'Keep tossing and watch the line',
  ),
  audio: [
    A('mount',
      "Endi tajribani o'zingiz o'tkazasiz. Har bosishda navbatdagi partiya tashlanadi va nisbiy chastota chizmaga tushadi.",
      'Теперь опыт проведёшь сам. С каждым нажатием бросается очередная партия, и относительная частота ложится на график.',
      'Now you run the experiment. Each press tosses the next batch and the relative frequency lands on the chart.'),
    A('why',
      "Yashil punktir chiziq bir ikkidanda turibdi. Siniq chiziq unga nima qiladi?",
      'Зелёная пунктирная линия стоит на одной второй. Что сделает с ней ломаная?',
      'The green dashed line sits at one half. What will the broken line do with it?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <FreqRun
      p={0.5}
      plan={[10, 10, 10, 20, 50, 100, 150, 150]}
      seed={513}
      ask={L(
        "Tugmani bosib boring: har safar tajribalar soni ortadi",
        'Нажимай кнопку: с каждым разом число опытов растёт',
        'Keep pressing: each time the number of trials grows',
      )}
      runLabel={L('Tashlash', 'Бросить', 'Toss')}
      axisX={L('tajribalar soni', 'число опытов', 'trials')}
      axisY={L('W', 'W', 'W')}
      targetLabel={L('0,5', '0,5', '0.5')}
      after={L(
        "Boshida chastota bir chiqdi: o'nta tashlashning o'ntasi ham gerb. Keyin nol butun yetti o'ndan, nol butun olti o'ndan, nol butun besh yuz to'rt mingdan. Tajriba uzaygan sari siniq chiziq punktirga yopishib qoldi.",
        'В начале частота вышла единицей: все десять бросков гербом. Потом ноль целых семь десятых, ноль целых шесть десятых, ноль целых пятьсот четыре тысячных. Чем длиннее опыт, тем ближе ломаная к пунктиру.',
        'At the start the frequency came out as one: all ten tosses were heads. Then zero point seven, zero point six, zero point five zero four. The longer the run, the closer the line clings to the dashes.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — Byuffon va Pirson.
// ============================================================
const S5 = {
  eyebrow: L('IKKI TADQIQOTCHI', 'ДВА ИССЛЕДОВАТЕЛЯ', 'TWO RESEARCHERS'),
  title: L(
    "Ular tangani qo'lda tashlashgan",
    'Они бросали монету вручную',
    'They tossed a coin by hand',
  ),
  audio: [
    A('mount',
      "Fransuz olimi Byuffon tangani to'rt ming qirq marta tashlagan va ikki ming qirq sakkiz marta gerb olgan.",
      'Французский учёный Бюффон бросил монету четыре тысячи сорок раз и получил герб две тысячи сорок восемь раз.',
      'The French scholar Buffon tossed a coin four thousand forty times and got heads two thousand forty eight times.'),
    A('why',
      "Ingliz matematigi Pirson esa yigirma to'rt ming marta tashlagan va o'n ikki ming o'n ikki marta gerb olgan.",
      'А английский математик Пирсон бросил двадцать четыре тысячи раз и получил герб двенадцать тысяч двенадцать раз.',
      'The English mathematician Pearson tossed twenty four thousand times and got heads twelve thousand and twelve times.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'W₁ = 2048 : 4040     W₂ = 12012 : 24000',
        'W₁ = 2048 : 4040     W₂ = 12012 : 24000',
        'W₁ = 2048 : 4040     W₂ = 12012 : 24000',
      )}
      steps={[
        { id: 'a', head: L('Byuffon', 'Бюффон', 'Buffon'), lines: ['W₁ ≈ 0,5069'] },
        { id: 'b', head: L('Pirson', 'Пирсон', 'Pearson'), lines: ['W₂ = 0,5005'] },
      ]}
      ask={L(
        "Kimning natijasi yarimga yaqinroq va nega?",
        'Чей результат ближе к половине и почему?',
        'Whose result is closer to a half and why?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Pirsonniki, chunki u ko'proq tashlagan", 'Пирсона, потому что он бросал больше', "Pearson's, because he tossed more"),
        },
        {
          id: 'wrong',
          label: L("Byuffonniki, chunki uning soni kichikroq", 'Бюффона, потому что у него числа меньше', "Buffon's, because his numbers are smaller"),
          hint: L(
            "Sonlarning kattaligi emas, yarimdan uzoqligi muhim. Byuffonda oltmish to'qqiz o'n mingdan, Pirsonda esa faqat besh o'n mingdan farq bor.",
            'Важна не величина чисел, а удалённость от половины. У Бюффона разница шестьдесят девять десятитысячных, у Пирсона всего пять.',
            'What matters is not how big the numbers are but how far from a half. Buffon is off by sixty nine ten thousandths, Pearson by only five.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkalasi ham yarimga yaqin, lekin uzunroq tajriba aniqroq javob berdi. Bu 4-ekranda ko'rgan narsangizning o'zi.",
        'Верно. Оба близки к половине, но более длинный опыт дал более точный ответ. Это ровно то, что ты видел на 4 экране.',
        'Correct. Both are close to a half, but the longer run gave the sharper answer. This is exactly what you saw on screen four.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — katta sonlar qonuni.
// ============================================================
const S6 = {
  eyebrow: L('KATTA SONLAR QONUNI', 'ЗАКОН БОЛЬШИХ ЧИСЕЛ', 'THE LAW OF LARGE NUMBERS'),
  title: L(
    "Chastota qaysi sonni ko'rsatadi",
    'На какое число указывает частота',
    'Which number the frequency points to',
  ),
  audio: [
    A('mount',
      "Shveysariyalik olim Yakob Bernulli buni qonun sifatida asoslab bergan.",
      'Швейцарский учёный Якоб Бернулли обосновал это как закон.',
      'The Swiss scholar Jacob Bernoulli established this as a law.'),
    A('why',
      "Tajribalar soni katta bo'lganda chastota bitta sonning atrofida tebranib qoladi. O'sha son nima deyiladi?",
      'При большом числе опытов частота колеблется около одного числа. Как называют это число?',
      'With many trials the frequency hovers around one number. What is that number called?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'W → 0,5   (N ortganda)',
        'W → 0,5   (при росте N)',
        'W → 0.5   (as N grows)',
      )}
      steps={[]}
      ask={L(
        "Chastota barqarorlashadigan son nima deb ataladi?",
        'Как называется число, около которого устойчива частота?',
        'What is the number the frequency settles around called?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L('Hodisaning statistik ehtimolligi', 'Статистическая вероятность события', 'The statistical probability of the event'),
        },
        {
          id: 'wrong',
          label: L("Tajribalarning o'rtacha soni", 'Среднее число опытов', 'The average number of trials'),
          hint: L(
            "Bu son tajribalar soni haqida emas. U noldan birgacha bo'ladi va hodisaning o'zini tavsiflaydi.",
            'Это число не о количестве опытов. Оно лежит от нуля до единицы и характеризует само событие.',
            'This number is not about how many trials there were. It lies between zero and one and describes the event itself.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Tanga uchun bu son yarimga teng. Nega aynan yarim ekanini keyingi darsda hisoblab chiqaramiz, tashlamasdan.",
        'Верно. Для монеты это число равно половине. Почему именно половине, вычислим на следующем уроке, без бросков.',
        'Correct. For a coin that number is a half. Why exactly a half we will compute next lesson, without tossing.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — darslikning 2-masalasi.
// ============================================================
const S7 = {
  eyebrow: L('HAYOTDAN', 'ИЗ ЖИЗНИ', 'FROM LIFE'),
  title: L(
    "Chastota tajribasiz ham sanaladi",
    'Частоту считают и без опытов',
    'A frequency is counted without experiments too',
  ),
  audio: [
    A('mount',
      "Besh yil ichida mamlakatga bir million yetti yuz oltmish yetti mingga yaqin ichki sayyoh va uch million yetti yuz oltmish besh mingga yaqin xorijiy sayyoh kelgan.",
      'За пять лет по стране путешествовало около миллиона семисот шестидесяти семи тысяч внутренних туристов и около трёх миллионов семисот шестидесяти пяти тысяч иностранных.',
      'Over five years about one million seven hundred sixty seven thousand domestic tourists and about three million seven hundred sixty five thousand foreign ones travelled.'),
    A('why',
      "Ichki sayyohlarning nisbiy chastotasini toping. Aniq hisob shart emas, taxminni baholang.",
      'Найди относительную частоту внутренних туристов. Точный счёт не нужен, оцени приблизительно.',
      'Find the relative frequency of domestic tourists. No exact computing is needed, just estimate.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'M ≈ 1 767 000     N ≈ 5 532 000',
        'M ≈ 1 767 000     N ≈ 5 532 000',
        'M ≈ 1 767 000     N ≈ 5 532 000',
      )}
      steps={[
        { id: 'a', head: L('Taqqoslash', 'Сравнение', 'Comparison'), lines: ['5 532 000 : 3 ≈ 1 844 000'] },
      ]}
      ask={L(
        "Ichki sayyohlarning ulushi taxminan qanday?",
        'Какова примерно доля внутренних туристов?',
        'Roughly what is the share of domestic tourists?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Taxminan 0,32', 'Примерно 0,32', 'About 0.32') },
        {
          id: 'wrong',
          label: L('Taxminan 0,68', 'Примерно 0,68', 'About 0.68'),
          hint: L(
            "Nol butun oltmish sakkiz yuzdan bu XORIJIY sayyohlarning ulushi, ular ko'proq. Ichki sayyohlar esa uchdan biriga yaqin.",
            'Ноль целых шестьдесят восемь сотых это доля ИНОСТРАННЫХ туристов, их больше. А внутренних около трети.',
            'Zero point six eight is the share of FOREIGN tourists, who are more numerous. Domestic ones are about a third.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, uchdan birga yaqin. Aniq hisob nol butun uch ming bir yuz to'qson to'rt o'n mingdan beradi. Bu yerda hech kim tajriba o'tkazmadi, chastota tayyor ma'lumotdan sanaldi.",
        'Верно, около трети. Точный счёт даёт ноль целых три тысячи сто девяносто четыре десятитысячных. Здесь никто не ставил опыт, частота посчитана по готовым данным.',
        'Correct, about a third. The exact figure is zero point three one nine four. Nobody ran an experiment here, the frequency came from ready data.',
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
    "Algebra 9, 36-§, ta'rif, Byuffon va Pirson tajribalari (194-196-bet)",
    'Алгебра 9, §36, определение, опыты Бюффона и Пирсона (стр. 194-196)',
    'Algebra 9, §36, the definition and the Buffon and Pearson trials (p. 194-196)',
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
          "Chastotaga qachon ishonish mumkin?",
          'Когда частоте можно доверять?',
          'When can a frequency be trusted?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Tajribalar soni katta bo'lganda", 'Когда число опытов велико', 'When the number of trials is large'),
          },
          {
            id: 'wrong',
            label: L("Natija chiroyli son chiqqanda", 'Когда результат вышел красивым числом', 'When the result comes out a neat number'),
            hint: L(
              "4-ekranda birinchi o'nta tashlash chastotani BIRGA teng qilgandi. Bir chiroyli son, lekin u haqiqatdan juda uzoq edi.",
              'На 4 экране первые десять бросков дали частоту РАВНУЮ единице. Число красивое, а от истины очень далеко.',
              'On screen four the first ten tosses gave a frequency EQUAL to one. A neat number, and very far from the truth.',
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
    "Sanash oson, ishonish uchun esa ko'p kerak",
    'Посчитать легко, а чтобы доверять, нужно много',
    'Counting is easy, trusting takes many',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz chastotani sanadingiz, uni o'z tajribangizda kuzatdingiz va ikkita mashhur tajriba bilan solishtirdingiz.",
      'На семи экранах ты посчитал частоту, проследил её в собственном опыте и сравнил с двумя знаменитыми опытами.',
      'On seven screens you counted a frequency, watched it in your own run, and compared it with two famous experiments.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: chastotani sanash.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Chastotani sanang",
    'Посчитай частоту',
    'Count the frequency',
  ),
  audio: [
    A('mount',
      "Uchta holat. Har birida nisbiy chastotani toping.",
      'Три случая. В каждом найди относительную частоту.',
      'Three cases. Find the relative frequency in each.'),
    A('why',
      "Suratga hodisani, maxrajga esa barcha tajribalarni qo'ying.",
      'В числитель поставь событие, в знаменатель все опыты.',
      'Put the event in the numerator and all the trials in the denominator.'),
  ],
  props: {
    stepLabel: L('Holat', 'Случай', 'Case'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Chastota har doim noldan birgacha bo'ladi, chunki hodisa barcha tajribalardan ko'p bo'la olmaydi.",
      'Все три найдены. Частота всегда от нуля до единицы, ведь событие не может случиться чаще, чем было опытов.',
      'All three are found. A frequency always lies between zero and one, since an event cannot happen more often than there were trials.',
    ),
    tasks: [
      {
        expr: 'N = 20,   M = 3',
        question: L('Nisbiy chastota nechaga teng?', 'Чему равна относительная частота?', 'What does the relative frequency equal?'),
        ok: L("Ha. Uch bo'lingan yigirma, nol butun o'n besh yuzdan.", 'Да. Три делить на двадцать, ноль целых пятнадцать сотых.', 'Yes. Three over twenty is zero point one five.'),
        items: [
          { id: 'a', right: true, label: 'W = 0,15' },
          { id: 'b', label: 'W = 1,5', hint: L("Bir butun besh o'ndan birdan katta, chastota esa birdan katta bo'la olmaydi. Vergul o'rnini tekshiring.", 'Одна целая пять десятых больше единицы, а частота больше единицы не бывает. Проверь место запятой.', 'One point five exceeds one, and a frequency never does. Check where the point sits.') },
        ],
        solution: ['W = 3 : 20', 'W = 0,15'],
      },
      {
        expr: 'N = 50,   M = 8',
        question: L('Nisbiy chastota nechaga teng?', 'Чему равна относительная частота?', 'What does the relative frequency equal?'),
        ok: L("Ha. Sakkiz bo'lingan ellik, nol butun o'n olti yuzdan.", 'Да. Восемь делить на пятьдесят, ноль целых шестнадцать сотых.', 'Yes. Eight over fifty is zero point one six.'),
        items: [
          { id: 'a', right: true, label: 'W = 0,16' },
          { id: 'b', label: 'W = 0,08', hint: L("Nol butun sakkiz yuzdan sakkizni yuzga bo'lganda chiqadi. Bu yerda esa ellikka bo'linadi, demak natija ikki barobar katta.", 'Ноль целых восемь сотых выходит при делении восьми на сто. А здесь делим на пятьдесят, значит результат вдвое больше.', 'Zero point zero eight comes from eight over a hundred. Here we divide by fifty, so the result is twice as large.') },
        ],
        solution: ['W = 8 : 50', 'W = 0,16'],
      },
      {
        expr: 'N = 1000,   M = 30',
        question: L('Nisbiy chastota nechaga teng?', 'Чему равна относительная частота?', 'What does the relative frequency equal?'),
        ok: L("Ha. O'ttiz bo'lingan bir ming, nol butun uch yuzdan.", 'Да. Тридцать делить на тысячу, ноль целых три сотых.', 'Yes. Thirty over a thousand is zero point zero three.'),
        items: [
          { id: 'a', right: true, label: 'W = 0,03' },
          { id: 'b', label: 'W = 0,3', hint: L("Nol butun uch o'ndan uchni o'nga bo'lganda chiqadi. Bir mingda esa nollar uchta, natija o'n barobar kichik.", 'Ноль целых три десятых выходит при делении трёх на десять. А в тысяче три нуля, результат в десять раз меньше.', 'Zero point three comes from three over ten. A thousand has three zeros, so the result is ten times smaller.') },
        ],
        solution: ['W = 30 : 1000', 'W = 0,03'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — TESKARISIGA.
// ============================================================
const S10 = {
  eyebrow: L('TESKARISIGA', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER WAY ROUND'),
  title: L(
    "Chastota ma'lum, hodisalar soni yo'q",
    'Частота известна, числа событий нет',
    'The frequency is known, the count is not',
  ),
  audio: [
    A('mount',
      "Endi chastota berilgan, topish kerak bo'lgani esa hodisa necha marta ro'y bergani.",
      'Теперь дана частота, а найти нужно, сколько раз произошло событие.',
      'Now the frequency is given and what must be found is how many times the event happened.'),
    A('why',
      "Chastotani tajribalar soniga ko'paytiring.",
      'Умножь частоту на число опытов.',
      'Multiply the frequency by the number of trials.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Uchta kattalikdan ikkitasi ma'lum bo'lsa, uchinchisi har doim topiladi.",
      'Обе найдены. Если из трёх величин известны две, третья находится всегда.',
      'Both are found. When two of the three quantities are known, the third always follows.',
    ),
    tasks: [
      {
        expr: 'W = 0,2,   N = 45',
        question: L('Hodisa necha marta ro\'y bergan?', 'Сколько раз произошло событие?', 'How many times did the event happen?'),
        ok: L("Ha. Qirq beshning nol butun ikki o'ndan qismi to'qqizga teng.", 'Да. Ноль целых две десятых от сорока пяти равно девяти.', 'Yes. Zero point two of forty five is nine.'),
        items: [
          { id: 'a', right: true, label: 'M = 9' },
          { id: 'b', label: 'M = 225', hint: L("Ikki yuz yigirma besh qirq beshni nol butun ikki o'ndanga BO'LGANDA chiqadi. Bu yerda esa ko'paytirish kerak, chunki qism butundan kichik.", 'Двести двадцать пять выходит при ДЕЛЕНИИ сорока пяти на ноль целых две десятых. Здесь нужно умножать, ведь часть меньше целого.', 'Two hundred twenty five comes from DIVIDING forty five by zero point two. Here we multiply, since a part is smaller than the whole.') },
        ],
        solution: ['M = 0,2 · 45', 'M = 9'],
      },
      {
        expr: 'W = 0,25,   N = 80',
        question: L('Hodisa necha marta ro\'y bergan?', 'Сколько раз произошло событие?', 'How many times did the event happen?'),
        ok: L("Ha. Nol butun yigirma besh yuzdan bu chorak, saksonning choragi yigirma.", 'Да. Ноль целых двадцать пять сотых это четверть, четверть от восьмидесяти двадцать.', 'Yes. Zero point two five is a quarter, and a quarter of eighty is twenty.'),
        items: [
          { id: 'a', right: true, label: 'M = 20' },
          { id: 'b', label: 'M = 25', hint: L("Yigirma besh bu chastotaning raqamlari, hodisalar soni emas. Saksonni to'rtga bo'ling.", 'Двадцать пять это цифры из частоты, а не число событий. Раздели восемьдесят на четыре.', 'Twenty five is the digits of the frequency, not the count of events. Divide eighty by four.') },
        ],
        solution: ['M = 0,25 · 80', 'M = 20'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QAYSI QATORGA ISHONISH.
// ============================================================
const S11 = {
  eyebrow: L('QAYSINISIGA ISHONISH', 'КАКОЙ СЕРИИ ВЕРИТЬ', 'WHICH RUN TO TRUST'),
  title: L(
    "Ikkita qator, ikki xil javob",
    'Две серии, два разных ответа',
    'Two runs, two different answers',
  ),
  audio: [
    A('mount',
      "Bir xil o'yin kubigi bilan ikkita tajriba o'tkazildi. Ular boshqa natija berdi.",
      'С одним и тем же игральным кубиком провели два опыта. Они дали разные результаты.',
      'Two experiments were run with the very same die. They gave different results.'),
    A('why',
      "Qaysi biriga ko'proq ishonish mumkin?",
      'Какому из них можно доверять больше?',
      'Which of them can be trusted more?'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('IZOH', 'ПОЯСНЕНИЕ', 'EXPLANATION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uzun qator har doim ishonchliroq. Qisqa qator ham xato emas, u shunchaki hali hech narsani ko'rsatmaydi.",
      'Длинная серия всегда надёжнее. Короткая не ошибочна, она просто ещё ничего не показывает.',
      'A long run is always more reliable. A short one is not wrong, it simply shows nothing yet.',
    ),
    tasks: [
      {
        expr: 'N₁ = 20 → W = 0,30      N₂ = 2000 → W = 0,17',
        question: L(
          "Olti raqami tushishining ehtimolligi qaysi songa yaqinroq?",
          'К какому числу ближе вероятность выпадения шестёрки?',
          'Which number is the probability of rolling a six closer to?',
        ),
        ok: L(
          "To'g'ri. Ikki mingta tashlash yigirmatasidan ancha ishonchli. Nol butun o'n yetti yuzdan haqiqiy qiymatga juda yaqin.",
          'Верно. Две тысячи бросков намного надёжнее двадцати. Ноль целых семнадцать сотых очень близко к истинному значению.',
          'Correct. Two thousand tosses are far more reliable than twenty. Zero point one seven is very close to the true value.',
        ),
        items: [
          { id: 'a', right: true, label: '0,17' },
          {
            id: 'b',
            label: '0,30',
            hint: L(
              "Yigirmata tashlashda oltilik olti marta tushishi bemalol mumkin, bu hech narsani isbotlamaydi. Xukdagi tanga ham shunday aldagandi.",
              'На двадцати бросках шестёрка вполне может выпасть шесть раз, это ничего не доказывает. Монета из хука обманула так же.',
              'In twenty tosses a six can easily land six times, which proves nothing. The coin in the opening misled the same way.',
            ),
          },
        ],
        solution: ['N₁ = 20', 'N₂ = 2000', 'N₂ > N₁'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — butunga emas, qoldiqqa bo'lish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Maxrajga nima qo'yiladi",
    'Что ставится в знаменатель',
    'What goes in the denominator',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. O'ttizta o'quvchidan oltitasi besh baho oldi. U qolgan yigirma to'rttani sanab, olti bo'lingan yigirma to'rt deb yozgan.",
      'Решение Камрона. Из тридцати учеников шестеро получили пятёрку. Он посчитал оставшихся двадцать четыре и записал шесть делить на двадцать четыре.',
      "Kamron's solution. Six of thirty students got a five. He counted the remaining twenty four and wrote six over twenty four."),
    A('why',
      "Uning javobi nol butun yigirma besh yuzdan. To'g'ri javob nol butun ikki o'ndan. Ular juda yaqin, shuning uchun xato ko'zga tashlanmaydi.",
      'Его ответ ноль целых двадцать пять сотых. Верный ответ ноль целых две десятых. Они очень близки, поэтому ошибка не бросается в глаза.',
      'His answer is zero point two five. The right answer is zero point two. They are very close, so the mistake does not catch the eye.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Chastotaning maxrajida har doim BARCHA tajribalar turadi, qolganlari emas. Bu xato xavfli, chunki javob to'g'riga yaqin chiqadi va o'zini bildirmaydi.",
      'В знаменателе частоты всегда стоят ВСЕ опыты, а не оставшиеся. Эта ошибка опасна тем, что ответ выходит близким к верному и себя не выдаёт.',
      'The denominator of a frequency always holds ALL the trials, not the leftovers. The mistake is dangerous because the answer lands close to the right one and never announces itself.',
    ),
    tasks: [
      {
        expr: '30 → 6      W = 6 : 24 ?',
        question: L(
          "Maxrajda nima turishi kerak?",
          'Что должно стоять в знаменателе?',
          'What should stand in the denominator?',
        ),
        ok: L(
          "To'g'ri. Barcha tajribalar soni, ya'ni o'ttiz. Javob nol butun ikki o'ndan.",
          'Верно. Число всех опытов, то есть тридцать. Ответ ноль целых две десятых.',
          'Correct. The number of all the trials, that is thirty. The answer is zero point two.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Barcha o'quvchilar soni, o'ttiz", 'Число всех учеников, тридцать', 'The number of all students, thirty'),
          },
          {
            id: 'b',
            label: L("Qolgan o'quvchilar soni, yigirma to'rt", 'Число оставшихся учеников, двадцать четыре', 'The number of remaining students, twenty four'),
            hint: L(
              "Kamronning usuli bo'yicha hamma o'quvchi besh baho olsa nima chiqadi? Maxraj nolga aylanadi. Demak usul noto'g'ri.",
              'Что выйдет по способу Камрона, если пятёрку получат все? Знаменатель обратится в ноль. Значит способ неверен.',
              "What happens by Kamron's method if everyone gets a five? The denominator turns into zero. So the method is wrong.",
            ),
          },
        ],
        solution: [
          'W = 6 : 30 = 0,2',
          L('Kamron: 6 : 24 = 0,25', 'Камрон: 6 : 24 = 0,25', 'Kamron: 6 : 24 = 0,25'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — chastotadan bashoratga.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "O'lchov bashoratga aylanadi",
    'Измерение превращается в прогноз',
    'A measurement becomes a forecast',
  ),
  audio: [
    A('mount',
      "Zavodda ikki yuzta lampochka tekshirildi, ulardan oltitasi yaroqsiz chiqdi.",
      'На заводе проверили двести лампочек, шесть из них оказались бракованными.',
      'A factory tested two hundred bulbs and six of them turned out faulty.'),
    A('why',
      "Endi besh mingtalik partiya jo'natilmoqda. Uni butunlay tekshirish qimmat.",
      'Теперь отправляется партия в пять тысяч. Проверять её целиком дорого.',
      'Now a batch of five thousand is going out. Testing all of it is expensive.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Mana nima uchun chastota kerak. Uni bir marta o'lchab, katta partiyaga ko'chirish mumkin. Javob taxminiy, lekin hech narsadan ko'ra ancha yaxshi.",
      'Вот зачем нужна частота. Измерив её один раз, можно перенести её на большую партию. Ответ приблизительный, но это намного лучше, чем ничего.',
      'This is what a frequency is for. Measure it once and carry it over to the large batch. The answer is approximate, but far better than nothing.',
    ),
    tasks: [
      {
        expr: '200 → 6',
        question: L(
          "Yaroqsiz lampochkalarning chastotasi nechaga teng?",
          'Чему равна частота бракованных лампочек?',
          'What does the frequency of faulty bulbs equal?',
        ),
        ok: L(
          "Ha. Olti bo'lingan ikki yuz, nol butun uch yuzdan, ya'ni uch foiz.",
          'Да. Шесть делить на двести, ноль целых три сотых, то есть три процента.',
          'Yes. Six over two hundred is zero point zero three, that is three in a hundred.',
        ),
        items: [
          { id: 'a', right: true, label: 'W = 0,03' },
          { id: 'b', label: 'W = 0,3', hint: L("Nol butun uch o'ndan har uchinchi lampochka yaroqsiz degani bo'lardi. Ikki yuzdan oltitasi esa ancha kam.", 'Ноль целых три десятых означало бы, что бракована каждая третья лампочка. А шесть из двухсот это гораздо меньше.', 'Zero point three would mean every third bulb is faulty. Six out of two hundred is far fewer.') },
        ],
        solution: ['W = 6 : 200', 'W = 0,03'],
      },
      {
        expr: 'W = 0,03,   5000 ta',
        question: L(
          "Besh minglik partiyada taxminan nechta yaroqsiz lampochka bor?",
          'Сколько примерно бракованных лампочек в партии из пяти тысяч?',
          'About how many faulty bulbs are in a batch of five thousand?',
        ),
        ok: L(
          "Ha, taxminan bir yuz ellikta. Chastotani partiya hajmiga ko'paytirdik.",
          'Да, примерно сто пятьдесят. Мы умножили частоту на размер партии.',
          'Yes, about one hundred fifty. We multiplied the frequency by the batch size.',
        ),
        items: [
          { id: 'a', right: true, label: L('Taxminan 150 ta', 'Примерно 150', 'About 150') },
          {
            id: 'b',
            label: L('Aniq 6 ta', 'Ровно 6', 'Exactly 6'),
            hint: L(
              "Oltita bu TEKSHIRILGAN ikki yuztadagi son. Partiya yigirma besh barobar katta, demak yaroqsizlar ham taxminan shuncha marta ko'p.",
              'Шесть это число в ПРОВЕРЕННЫХ двухстах. Партия в двадцать пять раз больше, значит и брака примерно во столько же раз больше.',
              'Six is the count in the two hundred that were TESTED. The batch is twenty five times larger, so the faults are about that many times more.',
            ),
          },
        ],
        solution: ['0,03 · 5000 = 150'],
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
    "Blits: maxraj, uzunlik, bashorat",
    'Блиц: знаменатель, длина, прогноз',
    'Blitz: denominator, length, forecast',
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
        tag: 'butunga-emas-qoldiqqa',
        ask: L(
          "Nisbiy chastotaning maxrajida nima turadi?",
          'Что стоит в знаменателе относительной частоты?',
          'What stands in the denominator of a relative frequency?',
        ),
        options: [
          { id: 'all', right: true, label: L('Barcha tajribalar soni', 'Число всех опытов', 'The number of all trials') },
          { id: 'rest', label: L('Qolgan tajribalar soni', 'Число оставшихся опытов', 'The number of remaining trials') },
        ],
        ok: L(
          "To'g'ri. Butun, qoldiq emas.",
          'Верно. Целое, а не остаток.',
          'Correct. The whole, not the leftovers.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron o'ttiz o'rniga yigirma to'rtni qo'ygandi.",
          'Вспомни 12 экран: Камрон поставил двадцать четыре вместо тридцати.',
          'Recall screen 12: Kamron put twenty four instead of thirty.',
        ),
      },
      {
        id: 'q2',
        tag: 'kam-tajribadan-xulosa',
        ask: L(
          "Qaysi tajribaga ko'proq ishonish mumkin?",
          'Какому опыту можно доверять больше?',
          'Which experiment can be trusted more?',
        ),
        options: [
          { id: 'long', right: true, label: L('Tajribalar soni ko\'p bo\'lganiga', 'Тому, где опытов больше', 'The one with more trials') },
          { id: 'short', label: L('Natijasi chiroyliroq bo\'lganiga', 'Тому, где результат красивее', 'The one with the neater result') },
        ],
        ok: L(
          "To'g'ri. Qator uzaygan sari chastota barqarorlashadi.",
          'Верно. Чем длиннее серия, тем устойчивее частота.',
          'Correct. The longer the run, the steadier the frequency.',
        ),
        hint: L(
          "4-ekranni eslang: birinchi o'nlikda chastota birga teng chiqqandi.",
          'Вспомни 4 экран: на первом десятке частота вышла равной единице.',
          'Recall screen 4: on the first ten the frequency came out as one.',
        ),
      },
      {
        id: 'q3',
        tag: 'chastota-ehtimollik-farqi',
        ask: L(
          "Chastota va ehtimollik bir xil narsami?",
          'Частота и вероятность это одно и то же?',
          'Are frequency and probability the same thing?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, chastota tajribadan chiqadi", 'Нет, частота выходит из опыта', 'No, a frequency comes from a run') },
          { id: 'yes', label: L('Ha, bir xil', 'Да, одно и то же', 'Yes, the same') },
        ],
        ok: L(
          "To'g'ri. Har bir tajriba qatori o'z chastotasini beradi, ehtimollik esa bitta.",
          'Верно. Каждая серия опытов даёт свою частоту, а вероятность одна.',
          'Correct. Each run gives its own frequency, while the probability is one.',
        ),
        hint: L(
          "5-ekranni eslang: Byuffon va Pirson bir xil tangani tashlab, ikki xil son olishgandi.",
          'Вспомни 5 экран: Бюффон и Пирсон бросали одинаковую монету и получили разные числа.',
          'Recall screen 5: Buffon and Pearson tossed the same kind of coin and got different numbers.',
        ),
      },
      {
        id: 'q4',
        tag: 'bashoratga-kochirmaslik',
        ask: L(
          "Chastota nol butun bir o'ndan bo'lsa, ikki mingtalik partiyada taxminan nechta bo'ladi?",
          'Если частота ноль целых одна десятая, сколько примерно будет в партии из двух тысяч?',
          'If the frequency is zero point one, about how many will there be in a batch of two thousand?',
        ),
        options: [
          { id: 'r', right: true, label: '200' },
          { id: 'w', label: '20' },
        ],
        ok: L(
          "To'g'ri. Ikki mingning o'ndan bir qismi ikki yuzta.",
          'Верно. Десятая часть от двух тысяч это двести.',
          'Correct. A tenth of two thousand is two hundred.',
        ),
        hint: L(
          "13-ekranni eslang: chastotani partiya hajmiga ko'paytirish kerak edi.",
          'Вспомни 13 экран: нужно было умножить частоту на размер партии.',
          'Recall screen 13: the frequency had to be multiplied by the batch size.',
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
    "Uzun tajriba haqiqatni ko'rsatadi",
    'Длинный опыт показывает истину',
    'A long run shows the truth',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda o'nta tashlashdan yettitasi gerb chiqqandi va bu hech narsani isbotlamagandi.",
      'На первом экране семь гербов из десяти бросков ничего не доказали.',
      'On the first screen seven heads out of ten proved nothing.'),
    A('s1',
      "Siz tajribani o'zingiz uzaytirdingiz va chastota yarimga yopishganini ko'rdingiz. Keyin uni bashorat uchun ishlatdingiz.",
      'Ты сам продлил опыт и увидел, как частота прижалась к половине. Потом применил её для прогноза.',
      'You extended the run yourself and saw the frequency cling to a half. Then you used it to forecast.'),
    A('s2',
      "Keyingi darsda ehtimollikni tajribasiz, hisoblab topamiz.",
      'В следующем уроке найдём вероятность без опытов, вычислением.',
      'Next lesson we find the probability without experiments, by computing.'),
  ],
  props: {
    mark: 'W = M : N',
    markNote: L(
      "maxrajda BARCHA tajribalar",
      'в знаменателе ВСЕ опыты',
      'the denominator holds ALL the trials',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: ehtimollikning klassik ta'rifi",
      'Следующий урок: классическое определение вероятности',
      'Next lesson: the classical definition of probability',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'kam-tajribadan-xulosa', ...S2 },
  { role: 'explain',  tag: 'butunga-emas-qoldiqqa', ...S3 },
  { role: 'explain',  tool: 'freqrun', tag: 'kam-tajribadan-xulosa', ...S4 },
  { role: 'explain',  tag: 'chastota-ehtimollik-farqi', ...S5 },
  { role: 'explain',  tag: 'chastota-ehtimollik-farqi', ...S6 },
  { role: 'explain',  tag: 'butunga-emas-qoldiqqa', ...S7 },
  { role: 'rule',     tag: 'kam-tajribadan-xulosa', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'butunga-emas-qoldiqqa', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'butunga-emas-qoldiqqa', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'kam-tajribadan-xulosa', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'butunga-emas-qoldiqqa', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'bashoratga-kochirmaslik', ...S13 },
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
