// ============================================================================
// 9-sinf, Dars 34. TRIGONOMETRIK FORMULALAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: 24-§ (121-125-bet), 25-§ (126-128),
// 26-§ (129-134), 27-§ (135-137).
//
// TO'RTTA PARAGRAF BITTA DARSDA. 33-darsda umurtqa BITTA CHIZMA edi,
// bu yerda esa BITTA FORMULA — qo'shish formulasi. Qolgan uchtasi
// uning to'g'ridan-to'g'ri natijasi, va dars ularni aynan shunday
// chiqaradi, ro'yxat qilib bermaydi:
//   25-§ ikkilangan burchak — qo'shish formulasida β o'rniga α
//        qo'yiladi: sin2α = sin(α + α) = 2sinαcosα;
//   26-§ keltirish — qo'shish formulasi π/2, π kabi tanish burchaklar
//        bilan: cos(π/2 − α) = sinα, hech qanday «jadval» kerak emas;
//   27-§ yig'indi formulalari — o'sha qo'shish, faqat teskari tomonga
//        o'qilgan.
// Bu yodlash hajmini to'rt barobar kamaytiradi va, muhimi, unutilgan
// formulani QAYTA CHIQARISH imkonini beradi.
//
// XUK darslikning 1-masalasidan (122-bet): cos75° ni hisoblash.
// Bolaning birinchi harakati — cos45° + cos30° qo'shish. Bu javob
// bahssiz yiqiladi: yig'indi bir butun ellik yetti yuzdan chiqadi,
// kosinus esa birdan katta bo'lolmaydi. Ya'ni xato «formulani
// bilmaslik» emas, tekshirish odatining yo'qligi.
//
// TUZOQ (12-ekran) shu chiziqni davom ettiradi: qo'shish formulasida
// MINUS o'rniga plyus qo'yish. Bu eng ko'p uchraydigan xato va uni
// yodlash bilan emas, TEKSHIRISH bilan yengish kerak: α = β = 45°
// olsak, chap tomonda cos90° = 0, plyusli formula esa 1 beradi.
// Bitta almashtirish butun formulani hal qiladi.
//
// TRANSFER (13-ekran) darslikning 300-mashqi: sinα + cosα = 1/2 dan
// sin2α ni topish. Ikkala tomonni kvadratga ko'tarish kerak, va u
// yerda 33-darsning asosiy ayniyati bilan bugungi ikkilangan burchak
// birga ishlaydi: (sin + cos)² = 1 + sin2α. Javob manfiy: −3/4.
//
// YANGI ASBOB YO'Q. Mavzu formulaviy, uning «harakati» — almashtirib
// tekshirish, va u `RecallMC` bilan to'liq beriladi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-34',
  n: 34,
  row: 34,
  block: 'Б6',
  topic: L(
    'Trigonometrik formulalar',
    'Тригонометрические формулы',
    'The trigonometric formulas',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Yig'indining kosinusi: cosα·cosβ − sinα·sinβ",
    'Косинус суммы: cosα·cosβ − sinα·sinβ',
    'The cosine of a sum: cosα·cosβ − sinα·sinβ',
  ),
  L(
    "Ikkilangan burchak: o'sha formulada β o'rniga α qo'yiladi",
    'Двойной угол: в той же формуле вместо β ставится α',
    'The double angle: in the same formula α replaces β',
  ),
  L(
    "Esdan chiqqan formulani tanish burchaklarda tekshirib ko'rish mumkin",
    'Забытую формулу можно проверить на знакомых углах',
    'A forgotten formula can be checked on familiar angles',
  ),
]

export const MISS = {
  'funksiyani-tarqatish': {
    what: L(
      "kosinus qavs ichidagi yig'indi bo'yicha tarqatildi",
      'косинус раскрыт по сумме как множитель',
      'the cosine was distributed over the sum',
    ),
    wrong: null,
    at: 0,
  },
  'qoshish-formulasida-ishora': {
    what: L(
      "qo'shish formulasida minus o'rniga plyus qo'yildi",
      'в формуле сложения поставлен плюс вместо минуса',
      'a plus was put in place of the minus in the addition formula',
    ),
    wrong: null,
    at: 0,
  },
  'ikkilangan-burchakda-koeffitsient': {
    what: L(
      "ikkilangan burchak formulasida ikki koeffitsienti tushib qoldi",
      'в формуле двойного угла потерян коэффициент два',
      'the factor two was dropped in the double angle formula',
    ),
    wrong: null,
    at: 0,
  },
  'keltirishni-yodlash': {
    what: L(
      "keltirish formulasi chiqarilmasdan yoddan olindi",
      'формула приведения взята по памяти, а не выведена',
      'the reduction formula was recalled instead of derived',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — darslikning 1-masalasi.
// ============================================================
const S1 = {
  eyebrow: L('JADVALDA YO\'Q', 'В ТАБЛИЦЕ НЕТ', 'NOT IN THE TABLE'),
  title: L(
    "Yetmish besh gradusning kosinusi",
    'Косинус семидесяти пяти градусов',
    'The cosine of seventy five degrees',
  ),
  audio: [
    A('mount',
      "Yetmish besh gradus jadvalda yo'q. Lekin uni qirq besh qo'shuv o'ttiz deb yozish mumkin, ikkalasi ham tanish.",
      'Семидесяти пяти градусов в таблице нет. Но их можно записать как сорок пять плюс тридцать, оба знакомы.',
      'Seventy five degrees is not in the table. But it can be written as forty five plus thirty, and both are familiar.'),
    A('why',
      "Kosinuslarni ham shunchaki qo'shib qo'ysa bo'ladimi?",
      'А косинусы можно просто сложить?',
      'Can the cosines simply be added?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "cos 45 taxminan 0,71, cos 30 taxminan 0,87. cos 75 ularning yig'indisiga tengmi?",
      'cos 45 примерно 0,71, cos 30 примерно 0,87. Равен ли cos 75 их сумме?',
      'cos 45 is about 0.71 and cos 30 about 0.87. Is cos 75 their sum?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L(
          "Yo'q: yig'indi birdan katta, kosinus esa bunday bo'lolmaydi",
          'Нет: сумма больше единицы, а косинус таким не бывает',
          'No: the sum exceeds one, and a cosine cannot',
        ),
      },
      {
        id: 'wrong',
        show: L(
          "Ha: burchaklar qo'shilsa, kosinuslar ham qo'shiladi",
          'Да: если углы складываются, то и косинусы тоже',
          'Yes: if the angles add, so do the cosines',
        ),
        hint: L(
          "Yig'indini hisoblang: nol butun yetmish bir yuzdan qo'shuv nol butun sakson yetti yuzdan. Bir butun ellik yetti yuzdan chiqadi. Kosinus esa aylananing abssissasi, u birdan katta bo'lolmaydi.",
          'Посчитай сумму: ноль целых семьдесят одна сотая плюс ноль целых восемьдесят семь сотых. Выйдет одна целая пятьдесят семь сотых. А косинус это абсцисса на окружности, больше единицы он быть не может.',
          'Add them up: zero point seven one plus zero point eight seven gives one point five seven. But a cosine is an abscissa on the circle and can never exceed one.',
        ),
      },
    ],
    after: L(
      "Ha. Kosinusni qavs ichidagi yig'indi bo'yicha tarqatib bo'lmaydi. Buning o'rniga alohida formula bor, bugun shu bilan tanishamiz.",
      'Да. Косинус нельзя раскрыть по сумме в скобках. Для этого есть отдельная формула, с ней сегодня и познакомимся.',
      'Yes. A cosine cannot be distributed over the sum in the bracket. There is a separate formula for that, and today we meet it.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — tanish burchaklar.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "O'tgan darsning uchta burchagi",
    'Три угла из прошлого урока',
    'Three angles from last lesson',
  ),
  audio: [
    A('mount',
      "O'tgan darsda birlik aylanadan qiymatlarni o'qigandik. O'ttiz gradusda sinus bir ikkidan, kosinus ildiz uch bo'lingan ikki.",
      'На прошлом уроке мы читали значения с единичной окружности. При тридцати градусах синус одна вторая, косинус корень из трёх на два.',
      'Last lesson we read values off the unit circle. At thirty degrees the sine is one half and the cosine root three over two.'),
    A('why',
      "Qirq besh gradusda ikkalasi teng edi.",
      'При сорока пяти градусах они были равны.',
      'At forty five degrees the two were equal.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('α = 45°', 'α = 45°', 'α = 45°')}
      steps={[]}
      ask={L(
        "sin 45 va cos 45 nechaga teng?",
        'Чему равны sin 45 и cos 45?',
        'What do sin 45 and cos 45 equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '√2/2' },
        {
          id: 'wrong',
          label: '1/2',
          hint: L(
            "Bir ikkidan bu o'ttiz gradusdagi sinus. Qirq besh gradusda nuqta chorakning o'rtasida turadi va ikkala koordinata ham nol butun yetmish bir yuzdanga yaqin.",
            'Одна вторая это синус при тридцати градусах. При сорока пяти точка стоит посередине четверти, и обе координаты около нуля целых семидесяти одной сотой.',
            'One half is the sine at thirty degrees. At forty five the point halves the quadrant and both coordinates are about zero point seven one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun shu uchta burchak yordamida jadvalda yo'q burchaklarning qiymatini topamiz.",
        'Верно. Сегодня с помощью этих трёх углов найдём значения углов, которых в таблице нет.',
        'Correct. Today these three angles will give us the values of angles missing from the table.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — qo'shish formulasi.
// ============================================================
const S3 = {
  eyebrow: L('QO\'SHISH FORMULASI', 'ФОРМУЛА СЛОЖЕНИЯ', 'THE ADDITION FORMULA'),
  title: L(
    "Bugungi darsning yagona formulasi",
    'Единственная формула сегодняшнего урока',
    "Today's only formula",
  ),
  audio: [
    A('mount',
      "Darslik uni birlik aylanadagi ikki nuqta orasidagi masofa orqali isbotlaydi. Natija shunday.",
      'Учебник доказывает её через расстояние между двумя точками на единичной окружности. Результат такой.',
      'The textbook proves it through the distance between two points on the unit circle. The result is this.'),
    A('why',
      "Endi uni yetmish besh gradusga qo'llaymiz.",
      'Теперь применим её к семидесяти пяти градусам.',
      'Now apply it to seventy five degrees.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'cos(α + β) = cos α · cos β − sin α · sin β',
        'cos(α + β) = cos α · cos β − sin α · sin β',
        'cos(α + β) = cos α · cos β − sin α · sin β',
      )}
      steps={[
        { id: 'a', head: L('Almashtiramiz', 'Подставляем', 'Substituting'), lines: ['cos75° = cos(45° + 30°)'] },
      ]}
      ask={L(
        "Formulaga qo'yilganda nima hosil bo'ladi?",
        'Что получится при подстановке в формулу?',
        'What arises from the substitution?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: 'cos45·cos30 − sin45·sin30' },
        {
          id: 'wrong',
          label: 'cos45·cos30 + sin45·sin30',
          hint: L(
            "Formulada ayirish turibdi. Plyus bilan javob birdan katta chiqib qolardi, xuddi xukdagidek.",
            'В формуле стоит вычитание. С плюсом ответ вышел бы больше единицы, как в хуке.',
            'The formula has a subtraction. With a plus the answer would exceed one, just as in the opening.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Hisoblasak, ildiz olti minus ildiz ikki bo'lingan to'rt, taxminan nol butun yigirma olti yuzdan. Bu birdan kichik va yetmish besh gradus uchun ishonarli.",
        'Верно. Посчитав, получим корень из шести минус корень из двух на четыре, примерно ноль целых двадцать шесть сотых. Это меньше единицы и правдоподобно для семидесяти пяти градусов.',
        'Correct. Working it out gives root six minus root two over four, about zero point two six. That is under one and plausible for seventy five degrees.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — ikkilangan burchak sinusi.
// ============================================================
const S4 = {
  eyebrow: L('BIRINCHI NATIJA', 'ПЕРВОЕ СЛЕДСТВИЕ', 'THE FIRST COROLLARY'),
  title: L(
    "Beta o'rniga alfa qo'ysak",
    'Если вместо бета подставить альфа',
    'Putting alpha in place of beta',
  ),
  audio: [
    A('mount',
      "Sinus uchun ham qo'shish formulasi bor: sinus alfa qo'shuv beta teng sinus alfa karra kosinus beta qo'shuv kosinus alfa karra sinus beta.",
      'Для синуса тоже есть формула сложения: синус альфа плюс бета равен синус альфа на косинус бета плюс косинус альфа на синус бета.',
      'The sine has an addition formula too: sine of alpha plus beta equals sine alpha times cosine beta plus cosine alpha times sine beta.'),
    A('why',
      "Endi beta o'rniga alfaning o'zini qo'ying. Ikki alfa chiqadi.",
      'Теперь подставь вместо бета саму альфу. Получится два альфа.',
      'Now put alpha itself in place of beta. Two alpha appears.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'sin(α + β) = sin α · cos β + cos α · sin β',
        'sin(α + β) = sin α · cos β + cos α · sin β',
        'sin(α + β) = sin α · cos β + cos α · sin β',
      )}
      steps={[
        { id: 'a', head: L('β = α', 'β = α', 'β = α'), lines: ['sin2α = sinα·cosα + cosα·sinα'] },
      ]}
      ask={L(
        "Sodalashtirilganda nima chiqadi?",
        'Что получится после упрощения?',
        'What does this simplify to?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'sin2α = 2 sinα cosα' },
        {
          id: 'wrong',
          label: 'sin2α = sinα cosα',
          hint: L(
            "Ikkita bir xil qo'shiluvchi bor, ular qo'shilganda ikkitasi hosil bo'ladi. Tekshiring: alfa qirq besh bo'lsa, chap tomonda sinus to'qson, ya'ni bir.",
            'Есть два одинаковых слагаемых, при сложении получается удвоенное. Проверь: при альфа сорок пять слева синус девяноста, то есть единица.',
            'There are two identical summands and adding them doubles. Check: at alpha forty five the left side is sine of ninety, which is one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkilangan burchak formulasi yangi kashfiyot emas, u qo'shish formulasining o'zi. Yodlash shart emas, bir soniyada chiqariladi.",
        'Верно. Формула двойного угла не новое открытие, это та же формула сложения. Заучивать не нужно, она выводится за секунду.',
        'Correct. The double angle formula is no new discovery, it is the addition formula itself. No memorising needed, it derives in a second.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — ikkilangan burchak kosinusi.
// ============================================================
const S5 = {
  eyebrow: L('IKKINCHI NATIJA', 'ВТОРОЕ СЛЕДСТВИЕ', 'THE SECOND COROLLARY'),
  title: L(
    "Xuddi shunday kosinus uchun",
    'То же самое для косинуса',
    'The same for the cosine',
  ),
  audio: [
    A('mount',
      "Kosinus uchun qo'shish formulasida ham beta o'rniga alfa qo'yamiz.",
      'В формуле сложения для косинуса тоже подставим альфу вместо беты.',
      'In the cosine addition formula put alpha in place of beta as well.'),
    A('why',
      "Kosinus alfa karra kosinus alfa minus sinus alfa karra sinus alfa.",
      'Косинус альфа на косинус альфа минус синус альфа на синус альфа.',
      'Cosine alpha times cosine alpha minus sine alpha times sine alpha.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('cos2α = cos²α − sin²α', 'cos2α = cos²α − sin²α', 'cos2α = cos²α − sin²α')}
      steps={[
        { id: 'a', head: L('Asosiy ayniyat', 'Основное тождество', 'The main identity'), lines: ['sin²α = 1 − cos²α'] },
      ]}
      ask={L(
        "Sinusni yo'qotsak, formula qanday ko'rinishga keladi?",
        'Если убрать синус, какой вид примет формула?',
        'Removing the sine, what form does the formula take?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: 'cos2α = 2cos²α − 1' },
        {
          id: 'wrong',
          label: 'cos2α = 2cos²α + 1',
          hint: L(
            "Bir minus kosinus kvadrat ayiriladi, ya'ni qavs ochilganda minus bir qoladi. Tekshiring: alfa nol bo'lsa, chap tomon bir, o'ng tomon ikki minus bir.",
            'Вычитается один минус косинус в квадрате, значит при раскрытии скобки остаётся минус один. Проверь: при альфа ноль слева единица, справа два минус один.',
            'One minus cosine squared is subtracted, so opening the bracket leaves minus one. Check: at alpha zero the left is one and the right is two minus one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu darslikning uch yuz birinchi mashqidagi tenglikning o'zi. Uni teskari o'qisak, bir qo'shuv kosinus ikki alfa teng ikki kosinus kvadrat alfa bo'ladi.",
        'Верно. Это то же равенство, что в упражнении триста один учебника. Прочитав его обратно, получим один плюс косинус два альфа равно двум косинусам в квадрате.',
        'Correct. This is the same identity as in exercise three hundred one. Read backwards it gives one plus cosine two alpha equals two cosine squared.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — keltirish formulalari.
// ============================================================
const S6 = {
  eyebrow: L('UCHINCHI NATIJA', 'ТРЕТЬЕ СЛЕДСТВИЕ', 'THE THIRD COROLLARY'),
  title: L(
    "Keltirish formulalarini yodlash shart emas",
    'Формулы приведения не нужно заучивать',
    'The reduction formulas need no memorising',
  ),
  audio: [
    A('mount',
      "Keltirish formulalari ham o'sha qo'shish formulasi, faqat bitta burchak tanish: π ikkidan yoki π.",
      'Формулы приведения это та же формула сложения, просто один из углов знакомый: π вторых или π.',
      'The reduction formulas are the same addition formula with one familiar angle: π over two or π.'),
    A('why',
      "π ikkidanning kosinusi nol, sinusi bir. Shu ikkita sonni formulaga qo'ying.",
      'Косинус π вторых ноль, синус один. Подставь эти два числа в формулу.',
      'The cosine of π over two is zero and its sine is one. Put these two numbers into the formula.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('cos(π/2 − α)', 'cos(π/2 − α)', 'cos(π/2 − α)')}
      steps={[
        { id: 'a', head: L('Formula bo\'yicha', 'По формуле', 'By the formula'), lines: ['cos(π/2)·cosα + sin(π/2)·sinα'] },
        { id: 'b', head: L('Qiymatlarni qo\'yamiz', 'Подставляем значения', 'Substituting the values'), lines: ['0 · cosα + 1 · sinα'] },
      ]}
      ask={L(
        "Natija nimaga teng?",
        'Чему равен результат?',
        'What does the result equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'sin α' },
        {
          id: 'wrong',
          label: 'cos α',
          hint: L(
            "Birinchi qo'shiluvchi nolga ko'paytirilyapti, demak yo'qoladi. Qoladigan qismda esa sinus turibdi.",
            'Первое слагаемое умножается на ноль и исчезает. А в оставшейся части стоит синус.',
            'The first summand is multiplied by zero and vanishes. What remains holds the sine.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Kosinus sinusga aylandi. Barcha keltirish formulalari xuddi shu yo'l bilan bir necha soniyada chiqariladi, jadval yodlash kerak emas.",
        'Верно. Косинус превратился в синус. Все формулы приведения выводятся так же за несколько секунд, заучивать таблицу не нужно.',
        'Correct. The cosine turned into the sine. Every reduction formula derives this way in seconds, with no table to memorise.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — sinuslar yig'indisi.
// ============================================================
const S7 = {
  eyebrow: L('TESKARI TOMONGA', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER WAY'),
  title: L(
    "Yig'indini ko'paytmaga aylantirish",
    'Превратить сумму в произведение',
    'Turning a sum into a product',
  ),
  audio: [
    A('mount',
      "Qo'shish formulasini teskari tomonga o'qisak, sinuslar yig'indisining formulasi chiqadi.",
      'Если прочитать формулу сложения в обратную сторону, получится формула суммы синусов.',
      'Read the addition formula backwards and the sum of sines formula appears.'),
    A('why',
      "Sinus alfa qo'shuv sinus beta teng ikki karra yarim yig'indining sinusi karra yarim ayirmaning kosinusi.",
      'Синус альфа плюс синус бета равно двум на синус полусуммы и косинус полуразности.',
      'Sine alpha plus sine beta equals two times the sine of the half sum times the cosine of the half difference.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'sinα + sinβ = 2 sin((α+β)/2) · cos((α−β)/2)',
        'sinα + sinβ = 2 sin((α+β)/2) · cos((α−β)/2)',
        'sinα + sinβ = 2 sin((α+β)/2) · cos((α−β)/2)',
      )}
      steps={[
        { id: 'a', head: L('Yarim yigindi', 'Полусумма', 'The half sum'), lines: ['(70° + 50°) : 2 = 60°'] },
      ]}
      ask={L(
        "sin 70 qo'shuv sin 50 nimaga teng?",
        'Чему равно sin 70 плюс sin 50?',
        'What does sin 70 plus sin 50 equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '2 sin60 · cos10' },
        {
          id: 'wrong',
          label: 'sin 120',
          hint: L(
            "Sinus yig'indi bo'yicha tarqalmaydi, bu xukdagi xatoning o'zi. Yig'indi ko'paytmaga aylanadi, boshqa burchakning sinusiga emas.",
            'Синус не раскрывается по сумме, это та же ошибка, что в хуке. Сумма превращается в произведение, а не в синус другого угла.',
            'A sine does not distribute over a sum, that is the same mistake as in the opening. The sum becomes a product, not the sine of another angle.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Yarim yig'indi oltmish, yarim ayirma o'n. Bunday almashtirish keyinchalik tenglamalarni yechishda kerak bo'ladi.",
        'Верно. Полусумма шестьдесят, полуразность десять. Такое преобразование понадобится дальше при решении уравнений.',
        'Correct. The half sum is sixty and the half difference ten. This conversion will be needed later when solving equations.',
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
    'Algebra 9, 24-27-§ (121-137-bet)',
    'Алгебра 9, §24-27 (стр. 121-137)',
    'Algebra 9, §24-27 (p. 121-137)',
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
          "Ikkilangan burchak formulasi qayerdan olinadi?",
          'Откуда берётся формула двойного угла?',
          'Where does the double angle formula come from?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Qo'shish formulasidan, beta o'rniga alfa qo'yib",
              'Из формулы сложения, подстановкой альфы вместо беты',
              'From the addition formula, with alpha in place of beta',
            ),
          },
          {
            id: 'wrong',
            label: L('Uni alohida yodlash kerak', 'Её нужно заучить отдельно', 'It must be memorised separately'),
            hint: L(
              "4-ekranni eslang: u yerda formula bitta almashtirish bilan chiqarilgandi. Yodlangan formula esa unutiladi va tiklab bo'lmaydi.",
              'Вспомни 4 экран: там формула вывелась одной подстановкой. А заученная формула забывается, и восстановить её нечем.',
              'Recall screen 4: the formula came out of one substitution. A memorised formula is forgotten with no way to rebuild it.',
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
    "Bitta formula, uchta natija",
    'Одна формула, три следствия',
    'One formula, three corollaries',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz qo'shish formulasidan ikkilangan burchakni, keltirishni va yig'indi formulasini chiqardingiz.",
      'На семи экранах ты вывел из формулы сложения двойной угол, приведение и формулу суммы.',
      'On seven screens you derived the double angle, the reduction, and the sum formula from the addition formula.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: qo'shish formulasi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Jadvalda yo'q burchaklar",
    'Углы, которых нет в таблице',
    'Angles missing from the table',
  ),
  audio: [
    A('mount',
      "Uchta burchak. Har birini tanish ikkita burchakning yig'indisi yoki ayirmasi shaklida yozing.",
      'Три угла. Каждый запиши как сумму или разность двух знакомых.',
      'Three angles. Write each as the sum or difference of two familiar ones.'),
    A('why',
      "Tanish burchaklar o'ttiz, qirq besh va oltmish.",
      'Знакомые углы это тридцать, сорок пять и шестьдесят.',
      'The familiar angles are thirty, forty five, and sixty.'),
  ],
  props: {
    stepLabel: L('Burchak', 'Угол', 'Angle'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Bitta burchakni bir necha xil yo'l bilan yozish mumkin, javob esa baribir bir xil chiqadi.",
      'Все три найдены. Один угол можно записать несколькими способами, а ответ всё равно выйдет одинаковым.',
      'All three are found. One angle can be written several ways and the answer still comes out the same.',
    ),
    tasks: [
      {
        expr: '15° = 45° − 30°',
        question: L('cos 15 formulaga qanday qo\'yiladi?', 'Как cos 15 подставляется в формулу?', 'How is cos 15 put into the formula?'),
        ok: L("Ha. Ayirma uchun formulada ishora almashadi, ya'ni plyus bo'ladi.", 'Да. Для разности знак в формуле меняется, то есть становится плюсом.', 'Yes. For a difference the sign in the formula flips, so it becomes a plus.'),
        items: [
          { id: 'a', right: true, label: 'cos45·cos30 + sin45·sin30' },
          { id: 'b', label: 'cos45·cos30 − sin45·sin30', hint: L("Minusli variant yig'indi uchun edi va u yetmish besh gradusni bergandi. O'n besh gradus esa ayirma, uning kosinusi katta bo'lishi kerak.", 'Вариант с минусом был для суммы и дал семьдесят пять градусов. А пятнадцать это разность, её косинус должен быть большим.', 'The minus version was for the sum and gave seventy five degrees. Fifteen is a difference and its cosine must be large.') },
        ],
        solution: ['cos15° = cos(45° − 30°)', 'cos15° ≈ 0,97'],
      },
      {
        expr: '75° = 45° + 30°',
        question: L('sin 75 formulaga qanday qo\'yiladi?', 'Как sin 75 подставляется в формулу?', 'How is sin 75 put into the formula?'),
        ok: L("Ha. Sinus uchun formulada har doim plyus, ayirmada esa minus bo'ladi.", 'Да. Для синуса в формуле всегда плюс, а при разности минус.', 'Yes. For the sine the formula has a plus, and a minus for a difference.'),
        items: [
          { id: 'a', right: true, label: 'sin45·cos30 + cos45·sin30' },
          { id: 'b', label: 'sin45·sin30 + cos45·cos30', hint: L("Sinus formulasida funksiyalar ALMASHIB keladi: sinus bilan kosinus. Bir xil funksiyalarning ko'paytmasi esa kosinus formulasiniki.", 'В формуле синуса функции ЧЕРЕДУЮТСЯ: синус с косинусом. А произведения одинаковых функций это формула косинуса.', 'The sine formula ALTERNATES the functions: sine with cosine. Products of like functions belong to the cosine formula.') },
        ],
        solution: ['sin75° = sin(45° + 30°)', 'sin75° ≈ 0,97'],
      },
      {
        expr: '2·15°',
        question: L('cos 30 ni cos 15 orqali qanday yozish mumkin?', 'Как записать cos 30 через cos 15?', 'How can cos 30 be written through cos 15?'),
        ok: L("Ha. Bu ikkilangan burchak formulasi, chunki o'ttiz bu o'n beshning ikkilangani.", 'Да. Это формула двойного угла, ведь тридцать это удвоенные пятнадцать.', 'Yes. This is the double angle formula, since thirty is twice fifteen.'),
        items: [
          { id: 'a', right: true, label: '2cos²15° − 1' },
          { id: 'b', label: '2cos15°', hint: L("Burchak ikkilanganda funksiya ikkilanmaydi. Tekshiring: ikki karra nol butun to'qson yetti yuzdan bir butun to'qson to'rt yuzdan bo'ladi, kosinus esa birdan katta bo'lolmaydi.", 'При удвоении угла функция не удваивается. Проверь: два на ноль целых девяносто семь сотых даст одну целую девяносто четыре сотых, а косинус больше единицы не бывает.', 'Doubling the angle does not double the function. Check: two times zero point nine seven is one point nine four, and a cosine never exceeds one.') },
        ],
        solution: ['cos30° = cos(2 · 15°)', 'cos30° = 2cos²15° − 1'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: ikkilangan burchak.
// ============================================================
const S10 = {
  eyebrow: L('IKKILANGAN BURCHAK', 'ДВОЙНОЙ УГОЛ', 'THE DOUBLE ANGLE'),
  title: L(
    "Teskari tomonga o'qish",
    'Читаем в обратную сторону',
    'Reading it backwards',
  ),
  audio: [
    A('mount',
      "Formulani teskari tomonga o'qish ham foydali. Uchta ifodani soddalashtiring.",
      'Читать формулу в обратную сторону тоже полезно. Упрости три выражения.',
      'Reading the formula backwards is useful too. Simplify three expressions.'),
    A('why',
      "Ifodaning shakliga qarang va qaysi formulaga o'xshashini toping.",
      'Посмотри на вид выражения и найди, на какую формулу оно похоже.',
      'Look at the shape of the expression and find which formula it matches.'),
  ],
  props: {
    stepLabel: L('Ifoda', 'Выражение', 'Expression'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Formulani ikkala tomonga o'qish kerak: chapdan o'ngga yoyish uchun, o'ngdan chapga yig'ish uchun.",
      'Все три найдены. Формулу нужно читать в обе стороны: слева направо чтобы раскрыть, справа налево чтобы свернуть.',
      'All three are found. A formula must be read both ways: left to right to expand, right to left to collapse.',
    ),
    tasks: [
      {
        expr: '2 sin5α cos5α',
        question: L('Bu ifoda nimaga teng?', 'Чему равно это выражение?', 'What does this expression equal?'),
        ok: L("Ha. Bu ikkilangan burchak sinusi, burchak esa besh alfa, demak javob o'n alfa.", 'Да. Это синус двойного угла, а угол пять альфа, значит ответ десять альфа.', 'Yes. This is the sine of a double angle, and the angle is five alpha, so the answer is ten alpha.'),
        items: [
          { id: 'a', right: true, label: 'sin 10α' },
          { id: 'b', label: 'sin 5α', hint: L("Besh alfa bu ichkaridagi burchak. Formula esa uni IKKILANTIRADI, ya'ni javobda ikki karra besh alfa turadi.", 'Пять альфа это внутренний угол. А формула его УДВАИВАЕТ, значит в ответе два на пять альфа.', 'Five alpha is the inner angle. The formula DOUBLES it, so the answer holds two times five alpha.') },
        ],
        solution: ['2 sin5α · cos5α', '= sin(2 · 5α)', '= sin10α'],
      },
      {
        expr: '2cos²15° − 1',
        question: L('Bu ifoda nimaga teng?', 'Чему равно это выражение?', 'What does this expression equal?'),
        ok: L("Ha, kosinus o'ttiz, ya'ni ildiz uch bo'lingan ikki.", 'Да, косинус тридцати, то есть корень из трёх на два.', 'Yes, the cosine of thirty, that is root three over two.'),
        items: [
          { id: 'a', right: true, label: 'cos 30°' },
          { id: 'b', label: 'cos 15°', hint: L("Formulada burchak ikkilanadi. O'n beshning ikkilangani o'ttiz.", 'В формуле угол удваивается. Удвоенные пятнадцать это тридцать.', 'The formula doubles the angle. Twice fifteen is thirty.') },
        ],
        solution: ['2cos²15° − 1', '= cos(2 · 15°)', '= cos30°'],
      },
      {
        expr: '1 − 2sin²22,5°',
        question: L('Bu ifoda nimaga teng?', 'Чему равно это выражение?', 'What does this expression equal?'),
        ok: L("Ha, kosinus qirq besh, ya'ni ildiz ikki bo'lingan ikki.", 'Да, косинус сорока пяти, то есть корень из двух на два.', 'Yes, the cosine of forty five, that is root two over two.'),
        items: [
          { id: 'a', right: true, label: 'cos 45°' },
          { id: 'b', label: 'sin 45°', hint: L("Bu formulaning chap tomonida kosinus turibdi, sinus emas. Qirq besh gradusda ular tasodifan teng, lekin formula baribir kosinusniki.", 'В левой части этой формулы стоит косинус, а не синус. При сорока пяти они случайно равны, но формула всё же косинуса.', 'The left side of this formula holds a cosine, not a sine. At forty five they happen to be equal, but the formula is the cosine one.') },
        ],
        solution: ['1 − 2sin²22,5°', '= cos(2 · 22,5°)', '= cos45°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — keltirish.
// ============================================================
const S11 = {
  eyebrow: L('KELTIRISH', 'ПРИВЕДЕНИЕ', 'REDUCTION'),
  title: L(
    "Har birini chiqarib ko'ring",
    'Выведи каждую',
    'Derive each one',
  ),
  audio: [
    A('mount',
      "Uchta keltirish formulasi. Ularni yoddan emas, qo'shish formulasidan chiqaring.",
      'Три формулы приведения. Выводи их не по памяти, а из формулы сложения.',
      'Three reduction formulas. Derive them from the addition formula, not from memory.'),
    A('why',
      "π ning kosinusi minus bir, sinusi nol.",
      'Косинус π минус один, синус ноль.',
      'The cosine of π is minus one and its sine zero.'),
  ],
  props: {
    stepLabel: L('Formula', 'Формула', 'Formula'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham chiqarildi. Keltirish jadvalini yodlash o'rniga tanish burchakning ikkita qiymatini bilish yetarli.",
      'Все три выведены. Вместо заучивания таблицы приведения достаточно знать два значения знакомого угла.',
      'All three are derived. Instead of memorising a reduction table, two values of the familiar angle suffice.',
    ),
    tasks: [
      {
        expr: 'sin(π/2 + α)',
        question: L('Bu nimaga teng?', 'Чему это равно?', 'What does this equal?'),
        ok: L("Ha. Sinus formulasiga qo'ysak, bir karra kosinus alfa qoladi.", 'Да. Подставив в формулу синуса, останется один на косинус альфа.', 'Yes. Putting it into the sine formula leaves one times cosine alpha.'),
        items: [
          { id: 'a', right: true, label: 'cos α' },
          { id: 'b', label: 'sin α', hint: L("Sinus formulasida sin(π ikkidan) karra kosinus alfa turadi, sinus π ikkidan esa birga teng. Ikkinchi qo'shiluvchi nolga ko'payadi.", 'В формуле синуса стоит sin(π вторых) на косинус альфа, а синус π вторых равен единице. Второе слагаемое умножается на ноль.', 'The sine formula has sin of π over two times cosine alpha, and that sine is one. The second summand is multiplied by zero.') },
        ],
        solution: ['sin(π/2)cosα + cos(π/2)sinα', '1 · cosα + 0 · sinα = cosα'],
      },
      {
        expr: 'cos(π + α)',
        question: L('Bu nimaga teng?', 'Чему это равно?', 'What does this equal?'),
        ok: L("Ha. Kosinus π minus birga teng, shuning uchun minus kosinus alfa chiqadi.", 'Да. Косинус π равен минус единице, поэтому выходит минус косинус альфа.', 'Yes. The cosine of π is minus one, so minus cosine alpha comes out.'),
        items: [
          { id: 'a', right: true, label: '−cos α' },
          { id: 'b', label: 'cos α', hint: L("Kosinus π ning qiymati minus bir. Minus bir kosinus alfaga ko'paytirilsa, ishora almashadi.", 'Значение косинуса π равно минус единице. Умножение минус единицы на косинус альфа меняет знак.', 'The cosine of π is minus one. Multiplying minus one by cosine alpha flips the sign.') },
        ],
        solution: ['cosπ·cosα − sinπ·sinα', '(−1)·cosα − 0 = −cosα'],
      },
      {
        expr: 'sin(π − α)',
        question: L('Bu nimaga teng?', 'Чему это равно?', 'What does this equal?'),
        ok: L("Ha, sinus alfa. Ishora saqlanadi, chunki minus bir sinusning oldida emas, kosinusning oldida turadi.", 'Да, синус альфа. Знак сохраняется, ведь минус единица оказывается не перед синусом, а перед косинусом.', 'Yes, sine alpha. The sign survives, since the minus one lands before the cosine, not the sine.'),
        items: [
          { id: 'a', right: true, label: 'sin α' },
          { id: 'b', label: '−sin α', hint: L("Yozib chiqing: sinus π karra kosinus alfa minus kosinus π karra sinus alfa. Birinchi qo'shiluvchi nol, ikkinchisida esa ikkita minus bor.", 'Распиши: синус π на косинус альфа минус косинус π на синус альфа. Первое слагаемое ноль, а во втором два минуса.', 'Write it out: sine π times cosine alpha minus cosine π times sine alpha. The first summand is zero and the second has two minuses.') },
        ],
        solution: ['sinπ·cosα − cosπ·sinα', '0 − (−1)·sinα = sinα'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — ishora va tekshirish odati.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Unutilgan ishorani tiklash",
    'Восстановить забытый знак',
    'Recovering a forgotten sign',
  ),
  audio: [
    A('mount',
      "Kamron formulani eslay olmadi va kosinus alfa qo'shuv beta teng kosinus alfa kosinus beta QO'SHUV sinus alfa sinus beta deb yozdi.",
      'Камрон не смог вспомнить формулу и написал косинус альфа плюс бета равно косинус альфа косинус бета ПЛЮС синус альфа синус бета.',
      'Kamron could not recall the formula and wrote cosine of alpha plus beta equals cosine alpha cosine beta PLUS sine alpha sine beta.'),
    A('why',
      "Uni yodlab olishga urinish o'rniga tekshirish mumkin. Alfa va beta o'rniga qirq besh gradusni qo'ying.",
      'Вместо попыток вспомнить её можно проверить. Подставь вместо альфы и беты сорок пять градусов.',
      'Instead of trying to recall it, test it. Put forty five degrees for both alpha and beta.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('TEKSHIRUV', 'ПРОВЕРКА', 'THE CHECK'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bitta almashtirish butun formulani hal qildi. Trigonometriyada formulani yodlash shart emas, uni tanish burchakda TEKSHIRISH yetarli: chap tomon bilan o'ng tomon mos kelmasa, formula noto'g'ri.",
      'Одна подстановка решила судьбу всей формулы. В тригонометрии формулу не обязательно помнить, достаточно ПРОВЕРИТЬ её на знакомом угле: если левая часть не совпала с правой, формула неверна.',
      'One substitution settled the whole formula. In trigonometry a formula need not be remembered, only TESTED on a familiar angle: if the sides disagree, the formula is wrong.',
    ),
    tasks: [
      {
        expr: 'α = β = 45°',
        question: L(
          "Chap tomonda cos 90 turadi, ya'ni nol. Kamronning o'ng tomoni nima beradi?",
          'Слева стоит cos 90, то есть ноль. Что даёт правая часть Камрона?',
          'The left side is cos 90, that is zero. What does Kamron right side give?',
        ),
        ok: L(
          "To'g'ri, bir. Nol bilan bir teng emas, demak plyusli formula noto'g'ri va u yerda minus turishi kerak.",
          'Верно, единица. Ноль и единица не равны, значит формула с плюсом неверна и там должен стоять минус.',
          'Correct, one. Zero and one differ, so the plus version is wrong and a minus belongs there.',
        ),
        items: [
          { id: 'a', right: true, label: '1' },
          {
            id: 'b',
            label: '0',
            hint: L(
              "Hisoblang: kosinus qirq besh karra kosinus qirq besh bu nol butun besh, sinuslarniki ham nol butun besh. Plyus bilan ular qo'shiladi.",
              'Посчитай: косинус сорока пяти на косинус сорока пяти это ноль целых пять, у синусов тоже ноль целых пять. С плюсом они складываются.',
              'Compute: cosine forty five times cosine forty five is zero point five, and the sines give zero point five too. With a plus they add.',
            ),
          },
        ],
        solution: [
          'cos90° = 0',
          '0,5 + 0,5 = 1',
          L('0 ≠ 1, formula notogri', '0 ≠ 1, формула неверна', '0 ≠ 1, the formula is wrong'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning 300-mashqi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ikkita darsning formulasi birga",
    'Формулы двух уроков вместе',
    'The formulas of two lessons at once',
  ),
  audio: [
    A('mount',
      "Sinus alfa qo'shuv kosinus alfa bir ikkidanga teng. Sinus ikki alfani toping.",
      'Синус альфа плюс косинус альфа равно одной второй. Найди синус двух альфа.',
      'Sine alpha plus cosine alpha equals one half. Find the sine of two alpha.'),
    A('why',
      "Alfaning o'zi noma'lum va uni topib bo'lmaydi. Lekin ikkala tomonni kvadratga ko'tarish mumkin.",
      'Сама альфа неизвестна и найти её нельзя. Но обе части можно возвести в квадрат.',
      'Alpha itself is unknown and cannot be found. But both sides can be squared.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bu yerda 33-darsning asosiy ayniyati bugungi ikkilangan burchak bilan birga ishladi. Alfa topilmadi, lekin javob topildi — masalada har doim ham noma'lumni topish shart emas.",
      'Здесь основное тождество 33 урока сработало вместе с сегодняшним двойным углом. Альфа не найдена, а ответ найден — в задаче не всегда нужно находить неизвестное.',
      'Here the main identity from lesson 33 worked together with today double angle. Alpha was never found, yet the answer was — a problem does not always require finding the unknown.',
    ),
    tasks: [
      {
        expr: '(sinα + cosα)²',
        question: L(
          "Qavsni ochsak, nima hosil bo'ladi?",
          'Что получится при раскрытии скобки?',
          'What arises when the bracket is opened?',
        ),
        ok: L(
          "Ha. Kvadratlar yig'indisi birga teng, o'rtadagi qo'shiluvchi esa aynan sinus ikki alfa.",
          'Да. Сумма квадратов равна единице, а средний член это и есть синус двух альфа.',
          'Yes. The sum of the squares is one, and the middle term is exactly the sine of two alpha.',
        ),
        items: [
          { id: 'a', right: true, label: '1 + sin2α' },
          {
            id: 'b',
            label: 'sin²α + cos²α',
            hint: L(
              "Qavs ochilganda o'rtada ikki karra sinus alfa karra kosinus alfa ham paydo bo'ladi, uni tushirib qoldirib bo'lmaydi. Bu esa aynan bugungi formula.",
              'При раскрытии скобки посередине появляется ещё два на синус альфа на косинус альфа, его нельзя опустить. А это и есть сегодняшняя формула.',
              'Opening the bracket also produces two times sine alpha times cosine alpha in the middle, which cannot be dropped. And that is today formula.',
            ),
          },
        ],
        solution: [
          'sin²α + 2sinαcosα + cos²α',
          '1 + sin2α',
        ],
      },
      {
        expr: '1 + sin2α = 1/4',
        question: L(
          "sin 2α nechaga teng?",
          'Чему равен sin 2α?',
          'What does sin 2α equal?',
        ),
        ok: L(
          "Ha, minus uch to'rtdan. Sinus manfiy bo'lishi mumkin, bu javobga xalaqit bermaydi.",
          'Да, минус три четвёртых. Синус может быть отрицательным, это ответу не мешает.',
          'Yes, minus three quarters. A sine may be negative, which does not spoil the answer.',
        ),
        items: [
          { id: 'a', right: true, label: '−3/4' },
          {
            id: 'b',
            label: '3/4',
            hint: L(
              "Bir to'rtdan birdan KICHIK, demak birga qo'shilgan son manfiy bo'lishi kerak. Bir to'rtdan minus bir hisoblang.",
              'Одна четвёртая МЕНЬШЕ единицы, значит прибавленное к единице число отрицательно. Посчитай одну четвёртую минус один.',
              'One quarter is LESS than one, so the number added to one must be negative. Compute one quarter minus one.',
            ),
          },
        ],
        solution: ['sin2α = 1/4 − 1', 'sin2α = −3/4'],
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
    "Blits: ishora, koeffitsient, tekshiruv",
    'Блиц: знак, коэффициент, проверка',
    'Blitz: sign, factor, check',
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
        tag: 'funksiyani-tarqatish',
        ask: L(
          "cos(α + β) kosinuslarning yig'indisiga tengmi?",
          'Равен ли cos(α + β) сумме косинусов?',
          'Does cos(α + β) equal the sum of the cosines?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Kosinus qavsni yig'indi bo'yicha tarqatmaydi, uning o'z formulasi bor.",
          'Верно. Косинус не раскрывается по сумме, у него своя формула.',
          'Correct. A cosine does not distribute over a sum, it has its own formula.',
        ),
        hint: L(
          "1-ekranni eslang: yig'indi bir butun ellik yetti yuzdan chiqqandi, kosinus esa birdan katta bo'lolmaydi.",
          'Вспомни 1 экран: сумма вышла одна целая пятьдесят семь сотых, а косинус больше единицы не бывает.',
          'Recall screen 1: the sum came to one point five seven, and a cosine never exceeds one.',
        ),
      },
      {
        id: 'q2',
        tag: 'ikkilangan-burchakda-koeffitsient',
        ask: L(
          "sin 2α nimaga teng?",
          'Чему равен sin 2α?',
          'What does sin 2α equal?',
        ),
        options: [
          { id: 'r', right: true, label: '2 sinα cosα' },
          { id: 'w', label: 'sinα cosα' },
        ],
        ok: L(
          "To'g'ri. Qo'shish formulasida ikkita bir xil qo'shiluvchi chiqadi, ular ikkitani beradi.",
          'Верно. В формуле сложения выходят два одинаковых слагаемых, они дают двойку.',
          'Correct. The addition formula yields two identical summands, and they give the two.',
        ),
        hint: L(
          "4-ekranni eslang: sinus alfa kosinus alfa qo'shuv kosinus alfa sinus alfa.",
          'Вспомни 4 экран: синус альфа косинус альфа плюс косинус альфа синус альфа.',
          'Recall screen 4: sine alpha cosine alpha plus cosine alpha sine alpha.',
        ),
      },
      {
        id: 'q3',
        tag: 'keltirishni-yodlash',
        ask: L(
          "Keltirish formulalarini bilish uchun nima kerak?",
          'Что нужно, чтобы знать формулы приведения?',
          'What is needed to know the reduction formulas?',
        ),
        options: [
          {
            id: 'derive', right: true,
            label: L("Qo'shish formulasi va tanish burchak qiymatlari", 'Формула сложения и значения знакомого угла', 'The addition formula and the familiar angle values'),
          },
          { id: 'table', label: L('Ularning jadvalini yodlash', 'Заучить их таблицу', 'To memorise their table') },
        ],
        ok: L(
          "To'g'ri. Har bir keltirish formulasi bir necha soniyada chiqariladi.",
          'Верно. Каждая формула приведения выводится за несколько секунд.',
          'Correct. Every reduction formula derives in a few seconds.',
        ),
        hint: L(
          "6-ekranni eslang: π ikkidanning kosinusi nol, sinusi bir, va hammasi shundan chiqqandi.",
          'Вспомни 6 экран: косинус π вторых ноль, синус один, и всё вышло из этого.',
          'Recall screen 6: the cosine of π over two is zero and the sine one, and everything followed.',
        ),
      },
      {
        id: 'q4',
        tag: 'qoshish-formulasida-ishora',
        ask: L(
          "Formulaning ishorasi esdan chiqsa, nima qilish kerak?",
          'Что делать, если забыт знак в формуле?',
          'What is to be done when the sign in a formula is forgotten?',
        ),
        options: [
          {
            id: 'check', right: true,
            label: L("Tanish burchakda tekshirib ko'rish", 'Проверить на знакомом угле', 'Test it on a familiar angle'),
          },
          { id: 'guess', label: L('Tavakkaliga tanlash', 'Выбрать наугад', 'Guess at random') },
        ],
        ok: L(
          "To'g'ri. Bitta almashtirish formulani bir qiymatli hal qiladi.",
          'Верно. Одна подстановка решает вопрос однозначно.',
          'Correct. One substitution settles the matter for good.',
        ),
        hint: L(
          "12-ekranni eslang: qirq besh gradus Kamronning formulasini darrov yiqitgandi.",
          'Вспомни 12 экран: сорок пять градусов сразу опровергли формулу Камрона.',
          'Recall screen 12: forty five degrees demolished Kamron formula at once.',
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
    "To'rtta paragraf, bitta formula",
    'Четыре параграфа, одна формула',
    'Four sections, one formula',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda kosinuslarni qo'shib bo'lmasligini ko'rdingiz: yig'indi birdan katta chiqqandi.",
      'На первом экране ты увидел, что косинусы складывать нельзя: сумма вышла больше единицы.',
      'On the first screen you saw the cosines cannot be added: the sum exceeded one.'),
    A('s1',
      "Keyin qo'shish formulasidan ikkilangan burchakni, keltirishni va yig'indi formulasini chiqardingiz. Yodlash o'rniga chiqarish va tekshirish.",
      'Потом ты вывел из формулы сложения двойной угол, приведение и формулу суммы. Вместо заучивания вывод и проверка.',
      'Then you derived the double angle, the reduction, and the sum formula from the addition one. Deriving and testing instead of memorising.'),
    A('s2',
      "Trigonometriya bloki tugadi. Keyingi darsdan geometriya boshlanadi.",
      'Блок тригонометрии завершён. Со следующего урока начинается геометрия.',
      'The trigonometry block is complete. Geometry begins with the next lesson.'),
  ],
  props: {
    mark: 'cos(α + β) = cosαcosβ − sinαsinβ',
    markNote: L(
      "qolgan uchta formula shundan chiqadi",
      'остальные три формулы выходят отсюда',
      'the other three formulas come from this one',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: figuralarning oxshashligi',
      'Следующий урок: подобие фигур',
      'Next lesson: similarity of figures',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'funksiyani-tarqatish', ...S2 },
  { role: 'explain',  tag: 'qoshish-formulasida-ishora', ...S3 },
  { role: 'explain',  tag: 'ikkilangan-burchakda-koeffitsient', ...S4 },
  { role: 'explain',  tag: 'ikkilangan-burchakda-koeffitsient', ...S5 },
  { role: 'explain',  tag: 'keltirishni-yodlash', ...S6 },
  { role: 'explain',  tag: 'funksiyani-tarqatish', ...S7 },
  { role: 'rule',     tag: 'ikkilangan-burchakda-koeffitsient', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-formulasida-ishora', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'ikkilangan-burchakda-koeffitsient', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'keltirishni-yodlash', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-formulasida-ishora', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ikkilangan-burchakda-koeffitsient', ...S13 },
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
