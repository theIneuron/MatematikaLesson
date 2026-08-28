// ============================================================================
// 9-sinf, Dars 15. ORALIQLAR USULI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: Algebra 9, 8-§ «Intervallar usuli»
// (32-35-bet). 1-masala (32-33-bet) — kvadrat uchhad, 6-darsning o'zi,
// darslikda ham qisqa takror sifatida beriladi. 2-masala (34-bet) —
// x³ − x < 0, BIRINCHI MARTA uchta ildizli ko'paytma (kub, parabola
// emas). 3-masala (34-35-bet, rus nashri; 34-bet, o'zbek nashri) —
// (x² − 9)(x + 3)(x − 2) > 0 = (x + 3)²(x − 2)(x − 3) > 0, TAKRORIY
// ildiz uch omilli ko'paytmada. 4-masala (kasr-ratsional, "выколотая
// точка") BU DARSGA KIRMAYDI — u 17-darsning o'z mavzusi
// (PODXOD_9SINF.md §12, Шаг 2: "17 — выколотая точка"). Bu darsda
// faqat BUTUN (ko'phad) ko'paytmalar.
//
// ASBOB: `SignAxis` (Dars06, Dars14) — BU DARSDA ILK MARTA UCH ILDIZ
// BILAN sinovdan o'tkaziladi (ilgari faqat 0/1/2). Umumlashtirish
// Dars14da tayyorlangan edi, aynan shu daraja uchun: `roots.length`
// ga qarab ishlaydi, qattiq yozilgan son yo'q. Qo'shimcha kod
// o'zgarishi TALAB QILINMADI — sinov Playwright orqali o'tkazildi.
//
// Darslikning o'z mexanizmi ("nega ishora almashadi"): oddiy ildizdan
// o'tishda ko'paytmadagi FAQAT BITTA ko'paytuvchi ishorasini
// o'zgartiradi, qolganlari o'zgartirmaydi — shu sabab butun ko'paytma
// ishorasi almashadi. Takroriy (juft darajali) ildizda ko'paytuvchi
// o'zi ikki marta qatnashadi, ikkalasi ham birga ishora o'zgartiradi,
// natijada ko'paytma ishorasi saqlanadi. Bu Dars14dagi "kvadrat hech
// qachon manfiy emas" tushuntirishning UMUMIY versiyasi.
//
// TEGLAR (o'zining):
//   toliq-korpaytirmaslik          — ifoda oxirigacha ko'paytuvchilarga
//                                     ajratilmasdan, bitta ildiz unutiladi
//   har-safar-almashadi-deb-oylash — har bir nuqtada ishora albatta
//                                     almashadi deb o'ylash, takroriy
//                                     ildizni hisobga olmaslik
//   qatiy-tengsizlikda-ildizni-qoshish — qat'iy tengsizlik javobiga
//                                     ildiz nuqtasini qo'shib yuborish
//   nechta-oraliq-notogri-hisoblash — ildizlar sonidan oraliqlar sonini
//                                     noto'g'ri hisoblash
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SignAxis } from './asboblar.jsx'

export const META = {
  id: 'grade9-15',
  n: 15,
  row: 15,
  block: 'Б3',
  topic: L('Oraliqlar usuli', 'Метод интервалов', 'The interval method'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "To'liq ko'paytuvchilarga ajratib, barcha haqiqiy ildizlarni topish kerak: birortasi tushib qolsa, oraliqlar noto'g'ri chiqadi",
    'Нужно полностью разложить на множители и найти все действительные корни: если хоть один пропущен, промежутки получатся неверными',
    'You must factor completely and find all real roots: if even one is missed, the intervals come out wrong',
  ),
  L(
    "Har bir oddiy ildizdan o'tishda ishora almashadi, takroriy ildizda esa ishora saqlanadi",
    'При переходе через каждый простой корень знак меняется, а при повторяющемся корне знак сохраняется',
    'The sign changes at every simple root, but stays the same at a repeated root',
  ),
  L(
    "Qat'iy tengsizlikda har bir ildiz, oddiy ham, takroriy ham, javobdan chiqarib tashlanadi",
    'В строгом неравенстве каждый корень, и простой, и повторяющийся, исключается из ответа',
    'In a strict inequality every root, simple or repeated, is excluded from the answer',
  ),
]

export const MISS = {
  'toliq-korpaytirmaslik': {
    what: L(
      "ifoda oxirigacha ko'paytuvchilarga ajratilmadi, bitta ildiz unutildi",
      'выражение не разложено на множители до конца, один корень пропущен',
      'the expression was not factored all the way, one root was missed',
    ),
    wrong: null,
    at: 0,
  },
  'har-safar-almashadi-deb-oylash': {
    what: L(
      "har bir nuqtada ishora albatta almashadi deb o'ylandi, takroriy ildiz hisobga olinmadi",
      'предполагалось, что знак обязательно меняется в каждой точке, повторяющийся корень не был учтён',
      'it was assumed the sign always changes at every point, the repeated root was not taken into account',
    ),
    wrong: null,
    at: 0,
  },
  'qatiy-tengsizlikda-ildizni-qoshish': {
    what: L(
      "qat'iy tengsizlik javobiga ildiz nuqtasi qo'shib yuborildi",
      'в ответ строгого неравенства добавлена точка корня',
      'the root point was added into the answer of a strict inequality',
    ),
    wrong: null,
    at: 0,
  },
  'nechta-oraliq-notogri-hisoblash': {
    what: L(
      "ildizlar sonidan oraliqlar soni noto'g'ri hisoblandi",
      'по числу корней неверно посчитано число промежутков',
      'the number of intervals was miscounted from the number of roots',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const CUB = (x) => x * x * x - x               // x(x-1)(x+1), ildizlar -1,0,1 (2-masala)
// eslint-disable-next-line react-refresh/only-export-components
const REP = (x) => (x + 1) * (x + 1) * (x - 2)  // (x+1)²(x-2), ildizlar -1 (takroriy), 2
// eslint-disable-next-line react-refresh/only-export-components
const PR2 = (x) => (x + 1) * (x - 1) * (x - 3)  // (x+1)(x-1)(x-3), ildizlar -1,1,3

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('UCHTA KO\'PAYTUVCHI', 'ТРИ МНОЖИТЕЛЯ', 'THREE FACTORS'),
  title: L(
    "Bitta parabola endi yetarli emas",
    'Одной параболы теперь недостаточно',
    'One parabola is no longer enough',
  ),
  audio: [
    A('mount',
      "X ko'paytirilgan x minus bir ko'paytirilgan x qo'shi bir, nolga qaraganda kichik. Bu funksiya kub, ikki emas, uch ko'paytuvchidan.",
      'X умножить на x минус один умножить на x плюс один, меньше нуля. Эта функция кубическая, из трёх множителей, а не двух.',
      'X times x minus one times x plus one, less than zero. This function is cubic, made of three factors, not two.'),
    A('why',
      "Oldingi darslarda bitta parabola chizib ishorani o'qidingiz. Uch ko'paytuvchili ifoda uchun parabola yetarlimi?",
      'На прошлых уроках ты читал знак по одной параболе. Достаточно ли параболы для выражения из трёх множителей?',
      'In past lessons you read the sign from one parabola. Is a parabola enough for an expression with three factors?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Uch ko'paytuvchili ifoda uchun ham bitta parabola chizish yetarlimi?",
      'Достаточно ли одной параболы для выражения из трёх множителей?',
      'Is one parabola enough for an expression with three factors?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Yo'q, kerakli usul umumiyroq bo'lishi kerak", 'Нет, нужен более общий способ', 'No, a more general method is needed'),
      },
      {
        id: 'wrong',
        show: L("Ha, oldingidek parabola chizsa bo'ladi", 'Да, можно так же, как раньше', 'Yes, a parabola works the same as before'),
        hint: L(
          "Parabola ikki daraja uchun. Uch ko'paytuvchi ko'paytirilsa, funksiya kub bo'ladi, uning grafigi parabola emas.",
          'Парабола нужна для второй степени. Если перемножить три множителя, функция становится кубической, её график не парабола.',
          'A parabola is for the second degree. Multiplying three factors gives a cubic function, whose graph is not a parabola.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun oraliqlar usuli: ildizlar soni istalgancha bo'lsa ham ishlaydigan yo'l.",
      'Верно. Сегодня метод интервалов: способ, который работает при любом числе корней.',
      'Correct. Today, the interval method: a way that works no matter how many roots there are.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — to'liq ko'paytuvchilarga ajratish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Oxirigacha ko'paytuvchilarga ajratish",
    'Разложение на множители до конца',
    'Factoring all the way',
  ),
  audio: [
    A('mount',
      "X kub minus x ifodasini ko'paytuvchilarga ajrating. Avval umumiy ko'paytuvchini chiqaring, keyin davom eting.",
      'Разложи на множители выражение x в кубе минус x. Сначала вынеси общий множитель, потом продолжи.',
      'Factor the expression x cubed minus x. First take out the common factor, then continue.'),
    A('why',
      "X ni qavsdan chiqarsangiz, ichkarida ayirmalar kvadrati qoladi, u yana ikkiga ajraladi.",
      'Если вынести x за скобку, внутри останется разность квадратов, она раскладывается ещё раз.',
      'If you take x outside the brackets, a difference of squares remains inside, which factors once more.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x³ − x', 'x³ − x', 'x³ − x')}
      steps={[
        { id: 'a', head: '1', lines: ['x³ − x = x(x² − 1)'] },
        { id: 'b', head: '2', lines: ['x² − 1 = (x − 1)(x + 1)'] },
      ]}
      ask={L(
        "Oxirigacha ajratilgan ko'rinishda nechta chiziqli ko'paytuvchi bor?",
        'Сколько линейных множителей в разложении до конца?',
        'How many linear factors are there in the complete factoring?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Uchta: x, x − 1, x + 1', 'Три: x, x − 1, x + 1', 'Three: x, x − 1, x + 1') },
        {
          id: 'wrong',
          label: L('Ikkita: x, x² − 1', 'Два: x, x² − 1', 'Two: x, x² − 1'),
          hint: L(
            "X kvadrat minus bir hali ham ko'paytuvchilarga ajraladi: bu ayirmalar kvadrati. Oxirigacha ajratmasangiz, bitta ildiz ko'rinmay qoladi.",
            'X в квадрате минус один ещё раскладывается: это разность квадратов. Если не разложить до конца, один корень останется незамеченным.',
            'X squared minus one still factors further: it is a difference of squares. Without factoring all the way, one root stays hidden.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchta ko'paytuvchi, uchta ildiz: minus bir, nol, bir. Endi buni o'qqa qo'yamiz.",
        'Верно. Три множителя, три корня: минус один, ноль, один. Теперь поставим их на ось.',
        'Correct. Three factors, three roots: minus one, zero, one. Now let us place them on the axis.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — SignAxis: UCH ILDIZ, BIRINCHI MARTA.
// ============================================================
const S3 = {
  eyebrow: L('BOSH ASBOB, UCH ILDIZ', 'ГЛАВНЫЙ ПРИБОР, ТРИ КОРНЯ', 'THE MAIN TOOL, THREE ROOTS'),
  title: L(
    "Uchta ildiz — to'rtta oraliq",
    'Три корня — четыре промежутка',
    'Three roots — four intervals',
  ),
  audio: [
    A('mount',
      "Uchala ildizni o'qqa qo'ying. Ular o'qni to'rtta oraliqqa bo'ladi.",
      'Поставь все три корня на ось. Они разбивают ось на четыре промежутка.',
      'Place all three roots on the axis. They split the axis into four intervals.'),
    W('sign',
      "Eng o'ng oraliqni sonni qo'yib isbotlang, keyin qolgan uchtasini birma-bir tanlang.",
      'Докажи знак самого правого промежутка числом, потом выбери оставшиеся три по очереди.',
      'Prove the sign of the rightmost interval with a number, then pick the remaining three one by one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={CUB}
      from={-2} to={2} yFrom={-7} yTo={7}
      roots={[-1, 0, 1]} strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "X kub minus x manfiy qachon: uchala ildizni qo'ying va oraliqlarni o'qing",
        'Когда x в кубе минус x отрицательно: поставь все три корня и прочитай промежутки',
        'When is x cubed minus x negative: place all three roots and read the intervals',
      )}
      after={L(
        "Ana xolos. Ishora chapdan o'ngga minus, plyus, minus, plyus tartibida almashdi: javob ikki ajralgan oraliqdan iborat.",
        'Вот и всё. Знак слева направо чередовался: минус, плюс, минус, плюс: ответ состоит из двух отдельных промежутков.',
        'That is all it takes. The sign alternated left to right: minus, plus, minus, plus: the answer is two separate intervals.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — NEGA ISHORA ALMASHADI (mexanizm).
// ============================================================
const S4 = {
  eyebrow: L('NEGA ALMASHADI', 'ПОЧЕМУ МЕНЯЕТСЯ', 'WHY IT CHANGES'),
  title: L(
    "Har bir ildizda faqat bitta ko'paytuvchi ishorasini o'zgartiradi",
    'В каждом корне знак меняет только один множитель',
    'At each root, only one factor changes sign',
  ),
  audio: [
    A('mount',
      "X birdan o'tishda x minus bir ko'paytuvchisi ishorasini o'zgartiradi, x va x qo'shi bir esa o'sha nuqtada ishorasini o'zgartirmaydi.",
      'При переходе через x равное одному множитель x минус один меняет знак, а x и x плюс один в этой точке знак не меняют.',
      'Crossing x equal to one, the factor x minus one changes sign, while x and x plus one do not change sign there.'),
    A('why',
      "Ko'paytmaning ishorasi omillar ishoralarining ko'paytmasi. Faqat bitta omil ishorasini o'zgartirsa, butun ko'paytma ham o'zgaradi.",
      'Знак произведения равен произведению знаков множителей. Если знак меняет только один из них, меняется и знак всего произведения.',
      "The sign of a product is the product of the factors' signs. If only one of them changes sign, the whole product's sign changes too."),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X bir nuqtasidan o'tishda x va x qo'shi bir ko'paytuvchilari o'sha nuqtada nolga tenga qanday munosabatda?",
        'В точке x равном одному, как множители x и x плюс один относятся к нулю в этой точке?',
        'At the point x equal to one, how do the factors x and x plus one relate to zero there?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ular nolga teng emas, shuning uchun ishorasini o'zgartirmaydi", 'Они не равны нулю, поэтому знак не меняют', 'They are not zero there, so they do not change sign'),
        },
        {
          id: 'wrong',
          label: L('Ular ham nolga aylanadi', 'Они тоже обращаются в ноль', 'They also become zero'),
          hint: L(
            "X faqat nolda, x qo'shi bir esa faqat minus birda nolga aylanadi. Birda ikkalasi ham nolga tengmas.",
            'X обращается в ноль только при нуле, а x плюс один только при минус одном. При единице ни один из них не ноль.',
            'X becomes zero only at zero, and x plus one only at minus one. At one, neither of them is zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shu sabab har bir oddiy ildizda ko'paytmaning ishorasi albatta almashadi: aynan bitta omil nolni kesib o'tadi.",
        'Верно. Поэтому в каждом простом корне знак произведения обязательно меняется: через ноль проходит ровно один множитель.',
        'Correct. That is why the sign of the product always changes at every simple root: exactly one factor crosses zero there.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — SignAxis: TAKRORIY ILDIZ,
// UCH OMILLI KO'PAYTMADA.
// ============================================================
const S5 = {
  eyebrow: L('TAKRORIY ILDIZ QAYTADI', 'ПОВТОРЯЮЩИЙСЯ КОРЕНЬ СНОВА', 'THE REPEATED ROOT AGAIN'),
  title: L(
    "Endi takroriy ildiz ko'paytmaning ichida",
    'Теперь повторяющийся корень внутри произведения',
    'Now the repeated root is inside a product',
  ),
  audio: [
    A('mount',
      "Yangi ko'paytma: x qo'shi bir, butun kvadratga, ko'paytirilgan x minus ikki, noldan kichik. X qo'shi bir ko'paytuvchisi ikki marta qatnashadi.",
      'Новое произведение: x плюс один, в полном квадрате, умножить на x минус два, меньше нуля. Множитель x плюс один участвует дважды.',
      'A new product: x plus one, squared, times x minus two, less than zero. The factor x plus one appears twice.'),
    A('why',
      "14-darsni eslang: kvadrat hech qachon manfiy emas. Bu yerda ham xuddi shu omil ikki marta qatnashib, o'zining ishorasini o'ziga bekor qiladi.",
      'Вспомни 14 урок: квадрат никогда не отрицателен. И здесь тот же множитель дважды меняет знак и гасит сам себя.',
      'Recall lesson 14: a square is never negative. Here too, the same factor changes sign twice and cancels itself out.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={REP}
      from={-2.2} to={2.6} yFrom={-7} yTo={8}
      roots={[-1, 2]} strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "X qo'shi bir butun kvadratga, ko'paytirilgan x minus ikki, manfiy qachon: ikkala ildizni qo'ying va tekshiring",
        'Когда x плюс один в квадрате, умноженное на x минус два, отрицательно: поставь оба корня и проверь',
        'When is x plus one squared, times x minus two, negative: place both roots and check',
      )}
      after={L(
        "Ana xolos. Minus bir nuqtasidan o'tganda ishora saqlanib qoldi: chap va o'rta oraliq ikkalasi ham manfiy chiqdi, faqat nuqtaning o'zi bo'yalmadi.",
        'Вот и всё. В точке минус один знак сохранился: левый и средний промежутки оба оказались отрицательными, не закрашена только сама точка.',
        'That is all it takes. At the point minus one the sign stayed the same: both the left and middle intervals came out negative, only the point itself is not painted.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — XUDDI SHU FUNKSIYA, QAT'IY EMAS
// TENGSIZLIK: takroriy ildiz JAVOBGA KIRADI.
// ============================================================
const S6 = {
  eyebrow: L("QAT'IY EMAS BO'LSA", 'ЕСЛИ НЕ СТРОГО', 'IF NOT STRICT'),
  title: L(
    "Tenglik ruxsat etilsa, ildiz javobga kiradi",
    'Если равенство разрешено, корень входит в ответ',
    'If equality is allowed, the root enters the answer',
  ),
  audio: [
    A('mount',
      "Xuddi shu ko'paytma, endi kichik yoki teng, nol so'ralsa. Minus bir nuqtasida ko'paytma aynan nolga teng.",
      'То же произведение, теперь спрашивается меньше или равно нулю. В точке минус один произведение равно ровно нулю.',
      'The same product, now less than or equal to zero is asked. At the point minus one the product equals exactly zero.'),
    A('why',
      "Kichik yoki teng belgisi tenglikni ham qabul qiladi. Nolga teng bo'lgan nuqta endi tashlab yuborilmaydi.",
      'Знак меньше или равно допускает и равенство. Точка, где значение равно нулю, теперь не выбрасывается.',
      'The less-than-or-equal sign also allows equality. The point where the value equals zero is no longer thrown out.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X qo'shi bir butun kvadratga, ko'paytirilgan x minus ikki, kichik yoki nolga teng bo'lsa, minus bir nuqtasi javobga kiradimi?",
        'Если x плюс один в квадрате, умноженное на x минус два, меньше или равно нулю, входит ли точка минус один в ответ?',
        'If x plus one squared, times x minus two, is less than or equal to zero, does the point minus one enter the answer?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ha, chunki bu nuqtada ko'paytma aynan nolga teng, tenglik esa ruxsat etilgan", 'Да, ведь в этой точке произведение равно ровно нулю, а равенство разрешено', 'Yes, because at this point the product equals exactly zero, and equality is allowed'),
        },
        {
          id: 'wrong',
          label: L("Yo'q, u avvalgidek chiqarib tashlanadi", 'Нет, она по-прежнему исключается', 'No, it is still excluded as before'),
          hint: L(
            "5-ekranda qat'iy tengsizlik edi, shuning uchun nuqta ochiq qoldi. Endi belgi teng bo'lishga ruxsat beradi.",
            'На 5 экране неравенство было строгим, поэтому точка оставалась открытой. Теперь знак допускает равенство.',
            'On screen 5 the inequality was strict, so the point stayed open. Now the sign allows equality.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Belgi qat'iy emasligi ildiz nuqtasini ham, oddiy, ham takroriy bo'lsin, javobga qo'shadi.",
        'Верно. Нестрогий знак добавляет точку корня в ответ, будь он простым или повторяющимся.',
        'Correct. A non-strict sign adds the root point into the answer, whether it is simple or repeated.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — UMUMIY QOIDA: n ILDIZ, n+1 ORALIQ.
// ============================================================
const S7 = {
  eyebrow: L('UMUMIY SANOQ', 'ОБЩИЙ СЧЁТ', 'THE GENERAL COUNT'),
  title: L(
    "Ildizlar sonidan oraliqlar soniga",
    'От числа корней к числу промежутков',
    'From the number of roots to the number of intervals',
  ),
  audio: [
    A('mount',
      "3-ekranda uchta ildiz to'rtta oraliq berdi. Bu tasodif emas: har bir yangi ildiz o'qni bitta qo'shimcha bo'lakka bo'ladi.",
      'На 3 экране три корня дали четыре промежутка. Это не случайность: каждый новый корень делит ось на один дополнительный кусок.',
      'On screen 3, three roots gave four intervals. This is not a coincidence: each new root splits the axis into one additional piece.'),
    A('why',
      "Bitta nuqta o'qni ikkiga bo'ladi. Har qo'shimcha nuqta yana bittaga ko'paytiradi.",
      'Одна точка делит ось на две части. Каждая дополнительная точка добавляет ещё одну.',
      'One point splits the axis into two parts. Each additional point adds one more.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "To'rtta har xil ildizli ko'paytma uchun nechta oraliq hosil bo'ladi?",
        'Сколько промежутков получится у произведения с четырьмя разными корнями?',
        'How many intervals result from a product with four different roots?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Beshta', 'Пять', 'Five') },
        {
          id: 'wrong',
          label: L("To'rtta", 'Четыре', 'Four'),
          hint: L(
            "Uchta ildiz to'rtta oraliq bergan edi: ildizlar sonidan bittaga ko'p. To'rtta ildiz demak beshta oraliq.",
            'Три корня дали четыре промежутка: на один больше числа корней. Четыре корня значит пять промежутков.',
            'Three roots gave four intervals: one more than the number of roots. Four roots means five intervals.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qoida: har xil ildizlar soniga bitta qo'shiladi. Bu istalgan darajadagi ko'phad uchun ishlaydi.",
        'Верно. Правило: к числу разных корней прибавляется один. Это работает для многочлена любой степени.',
        'Correct. The rule: add one to the number of different roots. This works for a polynomial of any degree.',
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
    "Algebra 9, 8-§, 2- va 3-masalalar (34-35-bet)",
    'Алгебра 9, §8, задачи 2 и 3 (стр. 34-35)',
    'Algebra 9, §8, problems 2 and 3 (p. 34-35)',
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
          "Ko'phadni o'qqa qo'yishdan oldin nima qilish shart?",
          'Что обязательно нужно сделать перед тем, как ставить многочлен на ось?',
          'What must be done before placing a polynomial on the axis?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Uni oxirigacha chiziqli ko'paytuvchilarga ajratish, hamma ildizni topish", 'Разложить его до конца на линейные множители, найти все корни', 'Factor it all the way into linear factors, find every root'),
          },
          {
            id: 'wrong',
            label: L("To'g'ridan-to'g'ri son qo'yib ko'rish", 'Сразу подставлять числа', 'Just substitute numbers right away'),
            hint: L(
              "2-ekranni eslang: ko'paytuvchilarga ajratmasangiz, bitta ildiz, masalan nol, butunlay ko'rinmay qoladi.",
              'Вспомни 2 экран: без разложения на множители один корень, например ноль, остаётся незамеченным.',
              'Recall screen 2: without factoring, one root, for example zero, stays completely hidden.',
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
    "Oraliqlar usuli: to'liq qadamlar",
    'Метод интервалов: полные шаги',
    'The interval method: the full steps',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz uch ildizli ko'paytmani, ishora almashish sababini va takroriy ildizni o'z qo'lingiz bilan ko'rdingiz. Endi ular qoida sifatida.",
      'На семи экранах ты сам увидел произведение с тремя корнями, причину смены знака и повторяющийся корень. Теперь они в виде правила.',
      'On seven screens you saw with your own hands a product with three roots, the reason for the sign change, and the repeated root. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SignAxis TAKRORI: yana uch ildiz, boshqa sonlar.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana uchta ildiz, endi mustaqil",
    'Снова три корня, теперь самостоятельно',
    'Three roots again, now on your own',
  ),
  audio: [
    A('mount',
      "Yangi ko'paytma: x qo'shi bir, ko'paytirilgan x minus bir, ko'paytirilgan x minus uch, noldan kichik. Uchala ildizni toping va o'qqa qo'ying.",
      'Новое произведение: x плюс один, умножить на x минус один, умножить на x минус три, меньше нуля. Найди все три корня и поставь их на ось.',
      'A new product: x plus one, times x minus one, times x minus three, less than zero. Find all three roots and place them on the axis.'),
    A('why',
      "Har bir ko'paytuvchi nolga aylanadigan nuqta ildiz bo'ladi.",
      'Корнем является та точка, где каждый множитель обращается в ноль.',
      'A root is the point where each factor becomes zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={PR2}
      from={-1.5} to={3.5} yFrom={-6} yTo={6}
      roots={[-1, 1, 3]} strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "X qo'shi bir, x minus bir, x minus uchning ko'paytmasi manfiy qachon: ildizlarni qo'ying va oraliqlarni o'qing",
        'Когда произведение x плюс один, x минус один, x минус три отрицательно: поставь корни и прочитай промежутки',
        'When is the product of x plus one, x minus one, x minus three negative: place the roots and read the intervals',
      )}
      after={L(
        "Ana xolos. Ishora yana to'liq almashdi: javob ikki ajralgan oraliqdan iborat.",
        'Вот и всё. Знак снова полностью чередовался: ответ состоит из двух отдельных промежутков.',
        'That is all it takes. The sign fully alternated again: the answer is two separate intervals.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: to'liq ko'paytuvchilarga ajratish
// va ildizlarni sanash.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Ko'phaddan ildizlar ro'yxatiga",
    'От многочлена к списку корней',
    'From a polynomial to a list of roots',
  ),
  audio: [
    A('mount',
      "To'rtta ko'phad. Har birini oxirigacha ko'paytuvchilarga ajrating va nechta har xil ildiz borligini ayting.",
      'Четыре многочлена. Каждый разложи до конца на множители и скажи, сколько разных корней.',
      'Four polynomials. Factor each one all the way and say how many different roots there are.'),
    A('why',
      "Umumiy ko'paytuvchini avval chiqaring, keyin qolganini ayirmalar kvadrati yoki boshqa usul bilan ajrating.",
      'Сначала вынеси общий множитель, потом разложи оставшееся: разностью квадратов или другим способом.',
      'First take out the common factor, then factor what remains: as a difference of squares or another way.'),
  ],
  props: {
    stepLabel: L('Ko\'phad', 'Многочлен', 'Polynomial'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham ajratildi. Ba'zan ko'phadning darajasi ildizlar sonidan katta chiqadi: sabab — takroriy ildiz.",
      'Все четыре разложены. Иногда степень многочлена больше числа корней: причина — повторяющийся корень.',
      'All four are factored. Sometimes the degree of the polynomial is greater than the number of roots: the reason is a repeated root.',
    ),
    tasks: [
      {
        expr: 'x³ − 9x',
        question: L('Nechta har xil ildiz bor?', 'Сколько разных корней?', 'How many different roots are there?'),
        ok: L("Ha. X ni chiqarsangiz, x kvadrat minus to'qqiz qoladi, u yana ikkiga ajraladi: uchta ildiz.", 'Да. Вынеся x, остаётся x в квадрате минус девять, оно раскладывается ещё раз: три корня.', 'Yes. Taking out x leaves x squared minus nine, which factors once more: three roots.'),
        items: [
          { id: 'a', right: true, label: L('Uchta: 0, 3, minus uch', 'Три: 0, 3, минус три', 'Three: 0, 3, minus three') },
          { id: 'b', label: L('Ikkita: 3, minus uch', 'Два: 3, минус три', 'Two: 3, minus three'), hint: L("Umumiy ko'paytuvchi x ni unutmang: u ham nolga aylanadigan nuqta beradi.", 'Не забудь про общий множитель x: он тоже даёт точку, где значение равно нулю.', 'Do not forget the common factor x: it also gives a point where the value is zero.') },
        ],
        solution: ['x³ − 9x = x(x² − 9) = x(x − 3)(x + 3)', L('Ildizlar: 0, 3, −3', 'Корни: 0, 3, −3', 'Roots: 0, 3, −3')],
      },
      {
        expr: 'x³ + x² − 6x',
        question: L('Nechta har xil ildiz bor?', 'Сколько разных корней?', 'How many different roots are there?'),
        ok: L("Ha. X ni chiqarsangiz, x kvadrat qo'shi x minus olti qoladi, u ikki ildizli kvadrat uchhad.", 'Да. Вынеся x, остаётся x в квадрате плюс x минус шесть, это квадратный трёхчлен с двумя корнями.', 'Yes. Taking out x leaves x squared plus x minus six, a quadratic trinomial with two roots.'),
        items: [
          { id: 'a', right: true, label: L('Uchta: 0, 2, minus uch', 'Три: 0, 2, минус три', 'Three: 0, 2, minus three') },
          { id: 'b', label: L('Ikkita: 2, minus uch', 'Два: 2, минус три', 'Two: 2, minus three'), hint: L("Bu yerda ham x umumiy ko'paytuvchi: u nol ildizini beradi, uni tashlab ketmang.", 'Здесь тоже x общий множитель: он даёт корень ноль, его нельзя пропускать.', 'Here too x is the common factor: it gives the root zero, do not skip it.') },
        ],
        solution: ['x³ + x² − 6x = x(x² + x − 6) = x(x + 3)(x − 2)', L('Ildizlar: 0, −3, 2', 'Корни: 0, −3, 2', 'Roots: 0, −3, 2')],
      },
      {
        expr: '(x² − 4)(x − 1)',
        question: L('Nechta har xil ildiz bor?', 'Сколько разных корней?', 'How many different roots are there?'),
        ok: L("Ha. X kvadrat minus to'rt ikkiga ajraladi, plyus tayyor ko'paytuvchi: uchta ildiz.", 'Да. X в квадрате минус четыре раскладывается ещё раз, плюс готовый множитель: три корня.', 'Yes. X squared minus four factors once more, plus the ready-made factor: three roots.'),
        items: [
          { id: 'a', right: true, label: L('Uchta: 2, minus ikki, bir', 'Три: 2, минус два, один', 'Three: 2, minus two, one') },
          { id: 'b', label: L('Ikkita: 2, bir', 'Два: 2, один', 'Two: 2, one'), hint: L("X kvadrat minus to'rt ham ayirmalar kvadrati: u x minus ikki va x qo'shi ikkiga ajraladi.", 'X в квадрате минус четыре тоже разность квадратов: раскладывается на x минус два и x плюс два.', 'X squared minus four is also a difference of squares: it factors into x minus two and x plus two.') },
        ],
        solution: ['(x² − 4)(x − 1) = (x − 2)(x + 2)(x − 1)', L('Ildizlar: 2, −2, 1', 'Корни: 2, −2, 1', 'Roots: 2, −2, 1')],
      },
      {
        expr: 'x⁴ − x²',
        question: L('Nechta har xil ildiz bor?', 'Сколько разных корней?', 'How many different roots are there?'),
        ok: L("Ha. X kvadrat umumiy ko'paytuvchi, u takroriy ildiz nol beradi: shu sabab uch ildiz, garchi daraja to'rt bo'lsa ham.", 'Да. X в квадрате общий множитель, он даёт повторяющийся корень ноль: поэтому три корня, хотя степень четыре.', 'Yes. X squared is the common factor, giving the repeated root zero: so three roots, even though the degree is four.'),
        items: [
          { id: 'a', right: true, label: L('Uchta: 0 (takroriy), 1, minus bir', 'Три: 0 (повторяющийся), 1, минус один', 'Three: 0 (repeated), 1, minus one') },
          { id: 'b', label: L("To'rtta: 0, 0, 1, minus bir", 'Четыре: 0, 0, 1, минус один', 'Four: 0, 0, 1, minus one'), hint: L("Nol ikki marta qatnashsa ham, o'qda u FAQAT BITTA nuqta: har xil ildizlar sanaladi, takrorlanganlari emas.", 'Хоть ноль и участвует дважды, на оси это ТОЛЬКО ОДНА точка: считаются разные корни, а не повторения.', 'Even though zero appears twice, on the axis it is only ONE point: different roots are counted, not repetitions.') },
        ],
        solution: ['x⁴ − x² = x²(x² − 1) = x²(x − 1)(x + 1)', L("Ildizlar: 0 (ikki marta), 1, −1 — o'qda uchta nuqta", 'Корни: 0 (дважды), 1, −1, на оси три точки', 'Roots: 0 (twice), 1, −1, three points on the axis')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: oraliqlar soni va ishora almashishi.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat mantiq: chizmasiz sanash",
    'Только логика: счёт без чертежа',
    'Just logic: counting without a drawing',
  ),
  audio: [
    A('mount',
      "Har savolda tayyor ko'paytma berilgan. Grafik chizmasdan, faqat mantiq bilan javob bering.",
      'В каждом вопросе дано готовое произведение. Ответь без графика, только с помощью логики.',
      'Each question gives a ready-made product. Answer without a graph, using logic alone.'),
    A('why',
      "Har xil ildizlar sonini va qaysi ildiz takrorlanganini ajratib ko'ring.",
      'Отдели число разных корней от того, какой корень повторяется.',
      'Separate the number of different roots from which root is repeated.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: oraliqlar soni har xil ildizlar soniga, ishora almashishi esa takrorlanishga bog'liq.",
      'Все три определены: число промежутков зависит от числа разных корней, а смена знака — от повторения.',
      'All three are determined: the number of intervals depends on the number of different roots, and the sign change depends on repetition.',
    ),
    tasks: [
      {
        expr: '(x − 1)(x − 2)(x − 3)(x − 4) > 0',
        question: L('Nechta oraliq hosil bo\'ladi?', 'Сколько получится промежутков?', 'How many intervals result?'),
        ok: L("Ha. To'rtta har xil ildiz beshta oraliq beradi: ildizlar sonidan bittaga ko'p.", 'Да. Четыре разных корня дают пять промежутков: на один больше числа корней.', 'Yes. Four different roots give five intervals: one more than the number of roots.'),
        items: [
          { id: 'a', right: true, label: L('Beshta', 'Пять', 'Five') },
          { id: 'b', label: L("To'rtta", 'Четыре', 'Four'), hint: L("To'rtta ildiz o'qni beshta bo'lakka bo'ladi, to'rtta emas: har bir yangi ildiz bitta qo'shimcha bo'lak beradi.", 'Четыре корня делят ось на пять частей, а не на четыре: каждый новый корень даёт один дополнительный кусок.', 'Four roots split the axis into five pieces, not four: each new root gives one additional piece.') },
        ],
        solution: [L("To'rtta har xil ildiz", 'Четыре разных корня', 'Four different roots'), L("Oraliqlar soni: to'rt qo'shi bir teng besh", 'Промежутков: четыре плюс один равно пять', 'Intervals: four plus one equals five')],
      },
      {
        expr: '(x + 2)² (x − 5) < 0',
        question: L('Minus ikki nuqtasidan o\'tishda ishora almashadimi?', 'При переходе через точку минус два знак меняется?', 'Does the sign change when crossing the point minus two?'),
        ok: L("Ha. X qo'shi ikki ko'paytuvchisi ikki marta qatnashadi, demak o'zining ishorasini o'ziga bekor qiladi: ishora saqlanadi.", 'Да. Множитель x плюс два участвует дважды, поэтому гасит собственную смену знака: знак сохраняется.', 'Yes. The factor x plus two appears twice, so it cancels its own sign change: the sign stays the same.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, ishora saqlanadi", 'Нет, знак сохраняется', 'No, the sign stays the same') },
          { id: 'b', label: L('Ha, har doimgidek almashadi', 'Да, меняется, как обычно', 'Yes, it changes as usual'), hint: L("Bu ko'paytuvchi kvadratga ko'tarilgan, ya'ni ikki marta takrorlangan: 5-ekranni eslang, u yerda ham xuddi shunday edi.", 'Этот множитель возведён в квадрат, то есть повторяется дважды: вспомни 5 экран, там было то же самое.', 'This factor is squared, that is, repeated twice: recall screen 5, it was the same there.') },
        ],
        solution: [L("X qo'shi ikki, kvadratga ko'tarilgan", 'X плюс два, возведён в квадрат', 'X plus two, squared'), L("Bu nuqtada ishora o'zgarmaydi", 'В этой точке знак не меняется', 'The sign does not change here')],
      },
      {
        expr: '(x + 1)(x − 3)² (x − 6) < 0',
        question: L('Nechta oraliq hosil bo\'ladi?', 'Сколько получится промежутков?', 'How many intervals result?'),
        ok: L("Ha. O'qda uchta nuqta bor: minus bir, uch, olti. X minus uch ikki marta qatnashsa ham, o'qda u bitta nuqta.", 'Да. На оси три точки: минус один, три, шесть. Хоть x минус три и участвует дважды, на оси это одна точка.', 'Yes. There are three points on the axis: minus one, three, six. Even though x minus three appears twice, it is one point on the axis.'),
        items: [
          { id: 'a', right: true, label: L("To'rtta oraliq, uchta nuqta", 'Четыре промежутка, три точки', 'Four intervals, three points') },
          { id: 'b', label: L("Beshta oraliq, to'rtta nuqta", 'Пять промежутков, четыре точки', 'Five intervals, four points'), hint: L("X minus uch ko'paytuvchisi ikki marta yozilgan bo'lsa ham, o'qqa FAQAT BIR marta qo'yiladi: nuqtalar soni takrorlanishga emas, har xil ildizlarga bog'liq.", 'Хоть множитель x минус три и записан дважды, на ось он ставится ТОЛЬКО ОДИН раз: число точек зависит от разных корней, а не от повторений.', 'Even though the factor x minus three is written twice, it is placed on the axis only ONCE: the number of points depends on different roots, not repetitions.') },
        ],
        solution: [L('Nuqtalar: minus bir, uch, olti', 'Точки: минус один, три, шесть', 'Points: minus one, three, six'), L("To'rt oraliq (uchta nuqta, bittasi takroriy)", 'Четыре промежутка (три точки, одна повторная)', 'Four intervals (three points, one repeated)')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Kamola takroriy ildizni javobga qat'iy holda
// qo'shib yuborgan (Dars14 S5 misolining o'zi).
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Qat'iy tengsizlikka takroriy ildizni qo'shish",
    'Добавление повторяющегося корня в строгое неравенство',
    'Adding a repeated root into a strict inequality',
  ),
  audio: [
    A('mount',
      "Kamolaning yechimi. X qo'shi bir butun kvadratga, ko'paytirilgan x minus ikki, noldan kichik tengsizlik uchun u javobga minus bir nuqtasini ham qo'shib yozgan.",
      'Решение Камолы. Для неравенства x плюс один в квадрате, умноженное на x минус два, меньше нуля, она добавила в ответ и точку минус один.',
      "Kamola's solution. For the inequality x plus one squared, times x minus two, less than zero, she also added the point minus one into the answer."),
    A('why',
      "5-ekranda shu funksiyaning aynan shu nuqtadagi qiymatini hisoblagan edingiz. U nolgami yoki manfiygami?",
      'На 5 экране ты уже считал значение этой же функции в этой же точке. Оно равно нулю или отрицательно?',
      'On screen 5 you already computed this same function at this same point. Is it zero or negative?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Minus bir nuqtasida qiymat nolga teng, tengsizlik esa qat'iy: shuning uchun bu nuqta javobga kirmaydi, Kamolaning yechimi xato.",
      'В точке минус один значение равно нулю, а неравенство строгое: поэтому эта точка не входит в ответ, у Камолы ошибка.',
      "At the point minus one the value equals zero, and the inequality is strict: so this point is not in the answer, Kamola's solution is wrong.",
    ),
    tasks: [
      {
        expr: '(x + 1)² (x − 2) < 0',
        question: L(
          "Kamola javobga minus bir nuqtasini ham qo'shgan. Shu nuqtada qiymat nolgami, manfiygami?",
          'Камола добавила в ответ и точку минус один. Значение в этой точке нулевое или отрицательное?',
          'Kamola also added the point minus one into the answer. Is the value at this point zero, or negative?',
        ),
        ok: L(
          "Ha, aynan nolga teng. Tengsizlik qat'iy (kichik, teng emas), demak nol qiymat beruvchi nuqta javobga kirmaydi: Kamola xato qildi.",
          'Да, ровно нулю. Неравенство строгое (меньше, а не меньше или равно), значит точка с нулевым значением не входит в ответ: у Камолы ошибка.',
          "Yes, exactly zero. The inequality is strict (less than, not less than or equal), so the point giving a zero value is not in the answer: Kamola made a mistake.",
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Nolga teng, shuning uchun javobga kirmaydi", 'Равно нулю, поэтому не входит в ответ', 'Equal to zero, so it does not belong in the answer'),
          },
          {
            id: 'b',
            label: L("Manfiy, shuning uchun Kamola to'g'ri yozgan", 'Отрицательное, поэтому Камола права', 'Negative, so Kamola is correct'),
            hint: L("X qo'shi bir nuqtasida x qo'shi bir ko'paytuvchisining o'zi nolga aylanadi, demak butun ko'paytma ham nolga teng bo'ladi.", 'В точке минус один сам множитель x плюс один обращается в ноль, значит и всё произведение равно нулю.', 'At the point minus one, the factor x plus one itself becomes zero, so the whole product is zero too.'),
          },
        ],
        solution: [
          L("x = −1 da (x + 1)²(x − 2) = 0, tengsizlik esa qat'iy", 'при x = −1 (x + 1)²(x − 2) = 0, а неравенство строгое', 'at x = −1 (x + 1)²(x − 2) = 0, and the inequality is strict'),
          L("To'g'ri javob: x = −1 kirmaydi", 'Верный ответ: x = −1 не входит', 'Correct answer: x = −1 does not belong'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — TO'RT ILDIZLI KO'PAYTMA (usul kengayadi).
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Usul istalgan sonli ko'paytuvchi bilan ishlaydi",
    'Способ работает при любом числе множителей',
    'The method works with any number of factors',
  ),
  audio: [
    A('mount',
      "Endi to'rtta ko'paytuvchi. Usulning o'zi o'zgarmaydi: ko'paytuvchilarga ajratish, ildizlarni qo'yish, eng o'ngdan boshlab almashtirish.",
      'Теперь четыре множителя. Сам способ не меняется: разложить на множители, поставить корни, чередовать начиная справа.',
      'Now four factors. The method itself does not change: factor, place the roots, alternate starting from the right.'),
    A('why',
      "Faqat oraliqlar soni ortadi: to'rtta ildiz beshta oraliq beradi.",
      'Меняется только число промежутков: четыре корня дают пять промежутков.',
      'Only the number of intervals grows: four roots give five intervals.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: ildizlar soni ikkidan to'rtga ko'tarilsa ham, xuddi shu qadamlar ishlayveradi.",
      'Найдено: даже если число корней выросло с двух до четырёх, те же самые шаги продолжают работать.',
      'Found: even when the number of roots grows from two to four, the same steps keep working.',
    ),
    tasks: [
      {
        expr: '(x + 2)(x + 1)(x − 1)(x − 3) > 0',
        question: L(
          "Eng o'ng oraliqda (x to'rtala ildizdan ham katta) ko'paytma qanday ishorada?",
          'Какой знак у произведения в самом правом промежутке (x больше всех четырёх корней)?',
          'What is the sign of the product in the rightmost interval (x greater than all four roots)?',
        ),
        ok: L(
          "Ha, musbat. Bu oraliqda barcha to'rtta ko'paytuvchi ham musbat, shuning uchun ko'paytma ham musbat.",
          'Да, положительный. В этом промежутке все четыре множителя положительны, поэтому и произведение положительно.',
          'Yes, positive. In this interval all four factors are positive, so the product is positive too.',
        ),
        items: [
          { id: 'a', right: true, label: L('Musbat', 'Положительный', 'Positive') },
          { id: 'b', label: L('Manfiy', 'Отрицательный', 'Negative'), hint: L("To'rtga teng qiymatni qo'yib ko'ring: to'rtta ko'paytuvchining hammasi musbat chiqadi, ko'paytma ham musbat bo'ladi.", 'Подставь значение четыре: все четыре множителя окажутся положительными, и произведение тоже.', 'Substitute the value four: all four factors come out positive, and so does the product.') },
        ],
        solution: [
          L("Eng o'ngda: musbat (isbotlangan)", 'Крайний справа: положительный (доказано)', 'Far right: positive (proved)'),
          L('Chapga almashtirib: minus, plyus, minus, plyus, minus', 'Чередуя влево: минус, плюс, минус, плюс, минус', 'Alternating leftwards: minus, plus, minus, plus, minus'),
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
    "Blits: ko'paytuvchilar, almashish, chegara",
    'Блиц: множители, чередование, граница',
    'Blitz: factors, alternation, boundary',
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
        tag: 'toliq-korpaytirmaslik',
        ask: L(
          "X kub minus to'qqiz x ifodasini x kvadrat minus to'qqiz ko'rinishida to'xtatib qo'ysa, bitta ildiz ko'rinmay qoladimi?",
          'Если остановиться на виде x в квадрате минус девять для x в кубе минус девять x, один корень останется незамеченным?',
          'If you stop at x squared minus nine for x cubed minus nine x, does one root stay hidden?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Umumiy ko'paytuvchi x chiqarilmasa, uning berg an nol ildizi butunlay yo'qolib qoladi.",
          'Верно. Если не вынести общий множитель x, его корень ноль полностью теряется.',
          'Correct. If the common factor x is not taken out, the root it gives, zero, is lost entirely.',
        ),
        hint: L(
          "2-ekranni eslang: x kub minus x ni ajratganda x ni chiqarish birinchi qadam edi, u nol ildizini berdi.",
          'Вспомни 2 экран: при разложении x в кубе минус x первым шагом было вынести x, он дал корень ноль.',
          'Recall screen 2: when factoring x cubed minus x, the first step was taking out x, which gave the root zero.',
        ),
      },
      {
        id: 'q2',
        tag: 'nechta-oraliq-notogri-hisoblash',
        ask: L(
          "Beshta har xil ildizli ko'paytma nechta oraliq hosil qiladi?",
          'На сколько промежутков делит произведение с пятью разными корнями?',
          'How many intervals does a product with five different roots create?',
        ),
        options: [
          { id: 'six', right: true, label: L('Oltita', 'Шесть', 'Six') },
          { id: 'five', label: L('Beshta', 'Пять', 'Five') },
        ],
        ok: L(
          "To'g'ri. Har xil ildizlar soniga bitta qo'shiladi: besh qo'shi bir teng olti.",
          'Верно. К числу разных корней прибавляется один: пять плюс один равно шесть.',
          'Correct. Add one to the number of different roots: five plus one equals six.',
        ),
        hint: L(
          "7-ekranni eslang: bitta nuqta o'qni ikkiga bo'ladi, har qo'shimcha nuqta yana bittaga ko'paytiradi.",
          'Вспомни 7 экран: одна точка делит ось на две части, каждая дополнительная точка добавляет ещё одну.',
          'Recall screen 7: one point splits the axis into two parts, each additional point adds one more.',
        ),
      },
      {
        id: 'q3',
        tag: 'har-safar-almashadi-deb-oylash',
        ask: L(
          "Ko'paytuvchi ko'paytmada ikki marta (kvadratga ko'tarilgan holda) qatnashsa, o'sha ildizda ishora almashadimi?",
          'Если множитель участвует в произведении дважды (в квадрате), меняется ли знак в этом корне?',
          'If a factor appears twice in the product (squared), does the sign change at that root?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Ikki marta ishora o'zgarishi bir-birini bekor qiladi: butun ko'paytmaning ishorasi saqlanadi.",
          'Верно. Двойная смена знака гасит сама себя: знак всего произведения сохраняется.',
          'Correct. Two sign changes cancel each other out: the sign of the whole product stays the same.',
        ),
        hint: L(
          "5-ekranni eslang: x qo'shi bir nuqtasidan o'tganda chap va o'rta oraliq ikkalasi ham manfiy chiqqan edi.",
          'Вспомни 5 экран: при переходе через точку минус один и левый, и средний промежутки оказались отрицательными.',
          'Recall screen 5: crossing the point minus one, both the left and middle intervals came out negative.',
        ),
      },
      {
        id: 'q4',
        tag: 'qatiy-tengsizlikda-ildizni-qoshish',
        ask: L(
          "Qat'iy tengsizlikda ildiz nuqtasidagi qiymat aynan nolga teng bo'lsa, bu nuqta javobga kiradimi?",
          'Если в строгом неравенстве значение в точке корня равно ровно нулю, входит ли эта точка в ответ?',
          'In a strict inequality, if the value at the root point is exactly zero, does that point belong in the answer?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Qat'iy belgi tenglikni qabul qilmaydi, shuning uchun nol qiymat beruvchi nuqta har doim chiqarib tashlanadi.",
          'Верно. Строгий знак не допускает равенства, поэтому точка с нулевым значением всегда исключается.',
          'Correct. A strict sign does not allow equality, so the point giving a zero value is always excluded.',
        ),
        hint: L(
          "12-ekranni eslang: Kamolaning xatosi aynan shu edi, u qat'iy tengsizlikka nol qiymatli nuqtani qo'shib yuborgan.",
          'Вспомни 12 экран: именно в этом была ошибка Камолы, она добавила в строгое неравенство точку с нулевым значением.',
          "Recall screen 12: this was exactly Kamola's mistake, she added a zero-value point into a strict inequality.",
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
    "Ko'paytuvchilar, almashish, chegara nuqtasi",
    'Множители, чередование, граничная точка',
    'Factors, alternation, the boundary point',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda uch ko'paytuvchili ifoda uchun bitta parabola yetarli emasligini taxmin qildingiz. Bugun aynan shunday ifodalarni yechadigan umumiy usulni to'liq egalladingiz.",
      'На первом экране ты предположил, что для выражения из трёх множителей одной параболы недостаточно. Сегодня ты полностью освоил общий способ решения таких выражений.',
      'On the first screen you guessed that one parabola is not enough for a three-factor expression. Today you fully mastered the general method for solving such expressions.'),
    A('s1',
      "Siz oxirigacha ko'paytuvchilarga ajratishni, ildizlar sonidan oraliqlar sonini topishni, va takroriy ildizda ishora nima uchun saqlanishini o'rgandingiz.",
      'Ты освоил разложение на множители до конца, вычисление числа промежутков по числу корней, и понял, почему в повторяющемся корне знак сохраняется.',
      'You learned to factor all the way, to find the number of intervals from the number of roots, and why the sign stays the same at a repeated root.'),
    A('s2',
      "Keyingi darsda kasr-ratsional tengsizliklar: maxrajning nol nuqtasi hech qachon javobga kirmaydi, sonning nol nuqtasidan farqli o'laroq.",
      'В следующем уроке дробно-рациональные неравенства: нуль знаменателя никогда не входит в ответ, в отличие от нуля числителя.',
      'The next lesson covers fractional-rational inequalities: a zero of the denominator never belongs in the answer, unlike a zero of the numerator.'),
  ],
  props: {
    mark: 'x(x − 1)(x + 1) < 0',
    markNote: L(
      "uchta ildiz, to'rtta oraliq",
      'три корня, четыре промежутка',
      'three roots, four intervals',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: kasr-ratsional tengsizliklar',
      'Следующий урок: дробно-рациональные неравенства',
      'Next lesson: fractional-rational inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'toliq-korpaytirmaslik', ...S2 },
  { role: 'explain',  tag: 'nechta-oraliq-notogri-hisoblash', ...S3 },
  { role: 'explain',  tag: 'har-safar-almashadi-deb-oylash', ...S4 },
  { role: 'explain',  tag: 'qatiy-tengsizlikda-ildizni-qoshish', ...S5 },
  { role: 'explain',  tag: 'qatiy-tengsizlikda-ildizni-qoshish', ...S6 },
  { role: 'explain',  tag: 'nechta-oraliq-notogri-hisoblash', ...S7 },
  { role: 'rule',     tag: 'har-safar-almashadi-deb-oylash', ...S8 },
  { role: 'practice', tool: 'signaxis', tag: 'nechta-oraliq-notogri-hisoblash', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'toliq-korpaytirmaslik', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nechta-oraliq-notogri-hisoblash', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'qatiy-tengsizlikda-ildizni-qoshish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'nechta-oraliq-notogri-hisoblash', ...S13 },
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
