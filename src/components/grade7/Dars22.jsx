// ============================================================================
// 7-sinf, Dars 22. UMUMIY KO'PAYTUVCHINI QAVSDAN CHIQARISH.
// (Вынесение общего множителя за скобки)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// 21-DARS OLDINGA BORDI, BU ORQAGA. Ko'paytuvchi ko'z bilan tanlanmaydi:
// u ENG KATTA bo'lishi kerak -- koeffitsiyentlarning eng katta umumiy
// bo'luvchisi va har harfning ENG KICHIK ko'rsatkichi. Blokning ikki
// xatosi shundan chiqadi: eng katta bo'lmagan ko'paytuvchi chiqarildi, va
// BIRLIK yo'qoldi (`ab + a` ni `a(b)` deb yozish).
//
// ASBOBLAR, HAMMASI TAYYOR:
//   1 -- qadamma-qadam qayta yozish: chiqarish BITTA qadam bo'ladi
//        (asbob yozuvni amal belgilari bo'yicha bo'ladi, qavs paydo
//        bo'lgandan keyin unda bosiladigan narsa qolmaydi);
//   3 -- yuza to'rtburchagi: TESKARI rejimi yo'q va yozilmaydi. Teskari
//        yo'l o'quvchining O'Z javobini KO'PAYTIRIB tekshirishi bilan
//        beriladi -- metodik jihatdan ham to'g'ri: ajratma ko'paytirilganda
//        boshlang'ich yozuvni qaytarishi SHART.
//
// BIRLIK 6-EKRANDA KO'RINADI: `ab + a` da yuqori yorliq `b` va `+1`, ya'ni
// birlik katakda TURADI va uni tashlab ketish mumkin emas.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_22'
const LESSON_TITLE = L("Umumiy ko'paytuvchini qavsdan chiqarish", 'Вынесение общего множителя за скобки', 'Taking a common factor out of the brackets')
const LESSON_NO = L('22-dars', 'Урок 22', 'Lesson 22')
const BLOCK = { label: L('B4-blok', 'Блок Б4', 'Block B4'), from: 18, to: 24, current: 22 }

const TAGS = {
  Z1: L("ko'paytuvchi eng katta emas", 'множитель не наибольший', 'the factor is not the greatest one'),
  Z2: L('birlik yo\'qoldi', 'единица потеряна', 'the one was lost'),
  Z3: L('ishora yo\'qoldi', 'знак потерян', 'the sign was lost'),
  Z4: L("ko'rsatkich bilan ish", 'работа с показателями', 'work with the exponents'),
  Z5: L("ko'paytuvchi hamma hadga bormadi", 'множитель дошёл не до всех членов', 'the factor did not reach every term'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ikki o'quvchi bitta yozuvdan ko'paytuvchi chiqardi.
// TABLODA: qavs ichida YANA nechta umumiy ko'paytuvchi qoldi.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L("UMUMIY KO'PAYTUVCHINI CHIQARISH", 'ВЫНЕСЕНИЕ ОБЩЕГО МНОЖИТЕЛЯ', 'TAKING OUT A COMMON FACTOR'),
  noBack: true,
  noNotes: true,
  title: L('Kim oxirigacha chiqardi', 'Кто вынес до конца', 'Who took it out all the way'),
  gate: {
    source: { kind: 'plain', tokens: ['12a²', '−', '18a'] },
    rows: [
      { tokens: ['2a'], value: '1' },
      { tokens: ['6a'], value: '0' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikkovi bitta yozuvdan umumiy ko'paytuvchi chiqardi. Tabloda qavs ichida yana nechta umumiy ko'paytuvchi qolgani turadi. Kim oxirigacha chiqardi?",
      'Двое вынесли общий множитель из одной записи. На табло стоит, сколько общих множителей ещё осталось внутри скобки. Кто вынес до конца?',
      'Two students took a common factor out of the same record. The boards show how many common factors are still left inside the bracket. Who went all the way?',
    ),
    items: [
      {
        id: 'six',
        label: L("Olti a ni chiqargan: qavsda chiqaradigan narsa qolmadi", 'Тот, кто вынес 6a: в скобке выносить больше нечего', 'The one who took out 6a: nothing is left to take out'),
        hint: L(
          "Taxminingiz qabul qilindi. To'rtburchakda tekshiramiz.",
          'Прогноз принят. Проверим на прямоугольнике.',
          'Your prediction is taken. We will check it on the rectangle.',
        ),
      },
      {
        id: 'two',
        label: L("Ikki a ni chiqargan: kichik ko'paytuvchini chiqarish oson", 'Тот, кто вынес 2a: множитель поменьше вынести проще', 'The one who took out 2a: a smaller factor is easier'),
        hint: L(
          "Uning qavsiga qarang: olti a ham, to'qqiz ham uchga bo'linadi.",
          'Посмотри на его скобку: и шесть a, и девять делятся на три.',
          'Look at that bracket: both six a and nine divide by three.',
        ),
      },
      {
        id: 'both',
        label: L("Ikkovi ham: ikki yozuv ham to'g'ri", 'Оба: обе записи верны', 'Both: the two records are both right'),
        hint: L(
          "Ko'paytirsak ikkovi ham boshlang'ich yozuvni qaytaradi, lekin oxirigacha chiqarish bitta.",
          'Умножением обе вернут исходное, но вынесение до конца только одно.',
          'Multiplying gives the original back in both, but only one goes all the way.',
        ),
      },
      {
        id: 'none',
        label: L('Hech kim: bu yerda chiqaradigan narsa yo\'q', 'Ни один: тут вообще нечего выносить', 'Neither: there is nothing to take out here'),
        hint: L(
          "O'n ikki bilan o'n sakkizning umumiy bo'luvchisi bor, va a harfi ikkala hadda ham turibdi.",
          'У двенадцати и восемнадцати есть общий делитель, и буква a стоит в обоих членах.',
          'Twelve and eighteen have a common divisor, and the letter a stands in both terms.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta yozuvdan umumiy ko'paytuvchi chiqardi va boshqa javob oldi.", 'Два ученика вынесли общий множитель из одной записи и получили разное.', 'Two students took a common factor out of the same record and got different results.'),
    A('mount', "Tabloda qavs ichida yana nechta umumiy ko'paytuvchi qolgani ko'rinadi.", 'На табло видно, сколько общих множителей ещё осталось внутри скобки.', 'The boards show how many common factors are still left inside the bracket.'),
    A('mount', "Kim oxirigacha chiqardi deb taxmin qilasiz.", 'Кто, по-твоему, вынес до конца.', 'Who do you predict went all the way.'),
  ],
}

// ============================================================
// 2. TAYANCH. Uchta qisqa savol: eng katta umumiy bo'luvchi, qavsni
// ochish (20-dars) va ENG KICHIK ko'rsatkich. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "12 va 18 ning eng katta umumiy bo'luvchisi nechchi?",
        'Каков наибольший общий делитель 12 и 18?',
        'What is the greatest common divisor of 12 and 18?',
      ),
      ok: L("Oltiga ikkalasi ham bo'linadi, va oltidan katta umumiy bo'luvchi yo'q.", 'На шесть делятся оба, и общего делителя больше шести нет.', 'Both divide by six, and there is no common divisor above six.'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Ikki ikkalasini bo'ladi, lekin kattarog'i ham bor.", 'Два делит оба, но есть делитель побольше.', 'Two divides both, but there is a bigger one.') },
        { id: 'c', label: '3', tag: 'Z1', hint: L("Uch ikkalasini bo'ladi, olti ham ikkalasini bo'ladi.", 'Три делит оба, но шесть тоже делит оба.', 'Three divides both, but six divides both as well.') },
        { id: 'd', label: '36', tag: 'Z6', hint: L("Umumiy bo'luvchi sonlarning o'zidan katta bo'lmaydi.", 'Общий делитель не бывает больше самих чисел.', 'A common divisor is never larger than the numbers themselves.') },
      ],
    },
    {
      wrap: false,
      prompt: '2a(x − 3)',
      ok: L("Ko'paytuvchi qavsdagi har hadga bordi.", 'Множитель дошёл до каждого члена скобки.', 'The factor reached every term of the bracket.'),
      items: [
        { id: 'a', label: '2ax − 6a', correct: true },
        { id: 'b', label: '2ax − 3', tag: 'Z5', hint: L("Uchlik ham ikki a ga ko'paytiriladi.", 'Тройка тоже умножается на два a.', 'The three is multiplied by two a as well.') },
        { id: 'c', label: '2ax + 6a', tag: 'Z3', hint: L("Qavs ichida ayirish turgan edi.", 'Внутри скобки было вычитание.', 'The bracket had a subtraction.') },
        { id: 'd', label: '2ax − 6', tag: 'Z4', hint: L("Ikki a karra uch da a harfi qoladi.", 'В два a на три буква a остаётся.', 'In two a times three the letter a stays.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "a² va a da a ning eng kichik ko'rsatkichi nechchi?",
        'Каков наименьший показатель a в a² и a?',
        'What is the smallest exponent of a in a² and a?',
      ),
      ok: L("Ikkinchi hadda a bitta, shuning uchun chiqariladigani ham bitta.", 'Во втором члене a одна, поэтому и вынести можно одну.', 'The second term has one a, so only one can be taken out.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '2', tag: 'Z4', hint: L("Ikkinchi hadda a bitta, undan ikkitasini olib bo'lmaydi.", 'Во втором члене a одна, две оттуда не взять.', 'The second term has one a, two cannot be taken from it.') },
        { id: 'c', label: '3', tag: 'Z4', hint: L("Ko'rsatkichlar qo'shilmaydi, eng kichigi tanlanadi.", 'Показатели не складываются, выбирается наименьший.', 'The exponents are not added, the smallest is chosen.') },
        { id: 'd', label: '0', tag: 'Z2', hint: L("a harfi ikkala hadda ham bor, demak uni chiqarish mumkin.", 'Буква a есть в обоих членах, значит её можно вынести.', 'The letter a is in both terms, so it can be taken out.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Bugun ikkitasi birga ishlaydi: sonlarning bo'luvchisi va harfning ko'rsatkichi.", 'Три коротких вопроса. Сегодня два из них работают вместе: делитель чисел и показатель буквы.', 'Three short questions. Today two of them work together: the divisor of the numbers and the exponent of the letter.'),
    A('1', "Ikkinchisi o'tgan darsdan.", 'Второй из прошлого урока.', 'The second is from the last lesson.'),
    A('2', "Uchinchisiga diqqat: eng KICHIK ko'rsatkich so'raladi.", 'Внимание на третий: спрашивают НАИМЕНЬШИЙ показатель.', 'Watch the third: it asks for the SMALLEST exponent.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. QAYTA YOZISH, BITTA QADAM. Asbob nazoratchi:
// eng katta bo'lmagan ko'paytuvchi qatorni QO'SHMAYDI.
// ============================================================
const S3 = {
  kind: 'transform',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Qaysi ko\'paytuvchini chiqaramiz', 'Какой множитель вынесем', 'Which factor do we take out'),
  start: '12a² − 18a',
  ask: L(
    "Yozuvdagi amal belgisini bosing va ko'paytuvchini tanlang.",
    'Нажми на знак действия в записи и выбери множитель.',
    'Tap the operation sign in the record and choose a factor.',
  ),
  askAct: L('Qaysi ko\'paytuvchi?', 'Какой множитель?', 'Which factor?'),
  actions: [
    { id: 'f2a', label: L('2a ni chiqarish', 'Вынести 2a', 'Take out 2a') },
    { id: 'f6a', label: L('6a ni chiqarish', 'Вынести 6a', 'Take out 6a') },
    { id: 'f6a2', label: L('6a² ni chiqarish', 'Вынести 6a²', 'Take out 6a²') },
  ],
  steps: [
    {
      part: '12a² − 18a',
      action: 'f6a',
      to: '6a(2a − 3)',
      parts: ['12a² − 18a'],
      needPart: L('Yozuvdagi amal belgisini bosing.', 'Нажми на знак действия в записи.', 'Tap the operation sign in the record.'),
      wrongs: [
        { action: 'f2a', tag: 'Z1', hint: L("Ikki a ikkala hadni bo'ladi, lekin qavsda olti a minus to'qqiz qoladi va ularda yana uchlik bor.", 'Два a делит оба члена, но в скобке останется шесть a минус девять, а там ещё сидит тройка.', 'Two a divides both terms, but the bracket would keep six a minus nine, and a three still sits there.') },
        { action: 'f6a2', tag: 'Z4', hint: L("Ikkinchi hadda a bitta, undan a kvadratni chiqarib bo'lmaydi.", 'Во втором члене a одна, вынести оттуда a в квадрате нельзя.', 'The second term has one a, a squared cannot be taken from it.') },
      ],
    },
  ],
  footNote: L(
    "Oxirigacha chiqarildi: qavs ichida umumiy ko'paytuvchi qolmadi.",
    'Вынесено до конца: внутри скобки общих множителей больше нет.',
    'Taken out all the way: no common factors are left inside the bracket.',
  ),
  audio: [
    A('mount', "Uchta ko'paytuvchi taklif qilinadi, ularning hammasi ikkala hadni bo'ladi.", 'Предложены три множителя, и все они делят оба члена.', 'Three factors are offered, and all of them divide both terms.'),
    A('mount', "Lekin bittasi ENG KATTA. Asbob boshqasini qabul qilmaydi.", 'Но один из них НАИБОЛЬШИЙ. Другой прибор не примет.', 'But one of them is the GREATEST. The tool will not accept another.'),
  ],
}

// ============================================================
// 4. FARQLASH. `2a` chiqarilgan yozuv HAM to'g'ri ko'paytma beradi --
// lekin ish TUGAMAGAN. Bu 20-darsning to'rtburchagi, faqat teskari
// tomondan o'qiladi.
// ============================================================
const S4 = {
  kind: 'grid',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('To\'g\'ri, lekin tugamagan', 'Верно, но не окончено', 'Right, but not finished'),
  caption: L(
    "Bu yerda 2a chiqarilgan. Kataklarni ochib, nima qaytishini ko'ring.",
    'Здесь вынесли 2a. Открой клетки и посмотри, что вернётся.',
    'Here 2a was taken out. Open the cells and see what comes back.',
  ),
  left: ['2a'],
  top: ['6a', '−9'],
  options: [
    { id: 'a', label: '12a² − 18a' },
    { id: 'b', label: '12a² − 9' },
    { id: 'c', label: '12a² + 18a' },
    { id: 'd', label: '12a² − 18' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Ikkinchi katakda ham ko'paytma turibdi: ikki a karra to'qqiz.", 'Во второй клетке тоже произведение: два a на девять.', 'The second cell holds a product too: two a times nine.') },
    { key: 'c', tag: 'Z3', hint: L("Qavs ichida ayirish turgan edi.", 'Внутри скобки было вычитание.', 'The bracket had a subtraction.') },
    { key: 'd', tag: 'Z4', hint: L("Ikki a karra to'qqiz da a harfi qoladi.", 'В два a на девять буква a остаётся.', 'In two a times nine the letter a stays.') },
  ],
  note: L(
    "Ko'paytirish boshlang'ich yozuvni qaytardi, ya'ni yozuv to'g'ri. Lekin qavsda olti a va to'qqiz ikkalasi uchga bo'linadi -- demak chiqarish TUGAMAGAN.",
    'Умножение вернуло исходное, значит запись верна. Но в скобке и шесть a, и девять делятся на три — значит вынесение НЕ ОКОНЧЕНО.',
    'Multiplying gave the original back, so the record is right. But in the bracket both six a and nine divide by three, so the job is NOT finished.',
  ),
  audio: [
    A('mount', "Ikki a chiqarilgan yozuvni ko'paytirib tekshiramiz.", 'Проверим умножением запись, где вынесли два a.', 'Let us check by multiplying the record where two a was taken out.'),
    A('mount', "Ko'paytma to'g'ri qaytadi. Savol boshqada: qavsda yana chiqaradigan narsa bormi.", 'Произведение вернётся верно. Вопрос в другом: осталось ли в скобке что выносить.', 'The product comes back right. The question is different: is there anything left in the bracket.'),
    A('cell-all', "Ikki katak ochildi va boshlang'ich yozuv qaytdi.", 'Две клетки открыты, и исходная запись вернулась.', 'Both cells are open and the original record is back.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Asbob yo'q: o'quvchi ko'paytuvchini HAM,
// qavsni HAM o'zi yig'adi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Ko\'paytuvchi ham, qavs ham', 'И множитель, и скобка', 'Both the factor and the bracket'),
  template: ['15x³ + 25x²  =  ', { slot: 0 }, '(', { slot: 1 }, ' + 5)'],
  parts: [
    { id: 'a', label: '5x²' },
    { id: 'b', label: '3x' },
    { id: 'c', label: '5x' },
    { id: 'd', label: '3x²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ko'paytuvchini va qavsning birinchi hadini yozing.",
    'Впиши множитель и первый член скобки.',
    'Write the factor and the first term of the bracket.',
  ),
  checkNote: L(
    "O'n besh bilan yigirma beshning eng katta umumiy bo'luvchisi besh, x ning eng kichik ko'rsatkichi esa ikki.",
    'Наибольший общий делитель пятнадцати и двадцати пяти это пять, а наименьший показатель x это два.',
    'The greatest common divisor of fifteen and twenty five is five, and the smallest exponent of x is two.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Ikkala hadda ham x kamida ikkinchi darajada, demak x kvadrat chiqadi.", 'В обоих членах x не ниже второй степени, значит выносится x в квадрате.', 'In both terms x is at least squared, so x squared comes out.') },
    { key: 'd', tag: 'Z6', hint: L("O'n beshni beshga bo'lsak uch chiqadi, va bitta x qoladi.", 'Пятнадцать разделить на пять это три, и один x остаётся.', 'Fifteen divided by five is three, and one x stays.') },
    { key: '*', tag: 'Z1', hint: L("Ko'paytuvchi eng katta olinadi: sonlarning bo'luvchisi va harfning eng kichik ko'rsatkichi.", 'Множитель берётся наибольшим: делитель чисел и наименьший показатель буквы.', 'The factor is taken greatest: the divisor of the numbers and the smallest exponent of the letter.') },
  ],
  audio: [
    A('mount', "Endi to'rtburchak yo'q. Ko'paytuvchini o'zingiz topasiz.", 'Теперь прямоугольника нет. Множитель находишь сам.', 'Now there is no rectangle. You find the factor yourself.'),
    A('mount', "Sonlarga va x ning ko'rsatkichlariga alohida qarang.", 'Посмотри отдельно на числа и отдельно на показатели x.', 'Look at the numbers and at the exponents of x separately.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. BIRLIK. Yuqorida `b` va `+1`: birlik KATAKDA turadi.
// ============================================================
const S6 = {
  kind: 'grid',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Qavsdagi birlik', 'Единица в скобке', 'The one inside the bracket'),
  caption: L(
    "Qavsning ikkinchi hadi birlik. Ikkala katakni ham bosing.",
    'Второй член скобки это единица. Нажми на обе клетки.',
    'The second term of the bracket is one. Tap both cells.',
  ),
  left: ['a'],
  top: ['b', '+1'],
  options: [
    { id: 'a', label: 'ab + a' },
    { id: 'b', label: 'ab' },
    { id: 'c', label: 'ab + 1' },
    { id: 'd', label: 'ab + a²' },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Ikkinchi katak bo'sh emas: a karra bir a beradi.", 'Вторая клетка не пуста: a на единицу даёт a.', 'The second cell is not empty: a times one gives a.') },
    { key: 'c', tag: 'Z2', hint: L("Ikkinchi katakda a birga ko'paytiriladi, ya'ni a chiqadi, birlik emas.", 'Во второй клетке a умножается на единицу, значит выйдет a, а не единица.', 'In the second cell a is multiplied by one, so a comes out, not one.') },
    { key: 'd', tag: 'Z4', hint: L("Birlik a emas, ikkinchi katakda a bitta.", 'Единица это не a, во второй клетке a одна.', 'One is not a, the second cell holds a single a.') },
  ],
  note: L(
    "Birlik katagi joyida qoladi. Shuning uchun qavsda ikki had bo'ladi, bitta emas: a b qo'shuv a ni a qavs b qo'shuv bir deb yozamiz.",
    'Клетка с единицей остаётся на месте. Поэтому в скобке два члена, а не один: a b плюс a это a на скобку b плюс один.',
    'The cell with the one stays. So the bracket has two terms, not one: a b plus a is a times the bracket b plus one.',
  ),
  audio: [
    A('mount', "Yuqorida b va birlik turibdi. Birlik ham had.", 'Сверху стоят b и единица. Единица тоже член.', 'On top stand b and one. One is a term too.'),
    A('mount', "Ikkala katakni bosing va ikkinchisida nima chiqishini ko'ring.", 'Нажми на обе клетки и посмотри, что выйдет во второй.', 'Tap both cells and see what comes out in the second.'),
    A('cell-all', "Ikkinchi katakda a turibdi. Uni tashlab ketish mumkin emas.", 'Во второй клетке стоит a. Её нельзя потерять.', 'The second cell holds a. It cannot be dropped.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT, SON BILAN TEKSHIRISH: MINUSNI chiqarish.
// Qavs ichidagi HAR ishora almashadi.
// ============================================================
const S7 = {
  kind: 'substitute',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Minusni chiqarsak', 'Если вынести минус', 'When a minus is taken out'),
  letter: 'x',
  numbers: [1, 3, 5],
  rows: [
    { id: 'r1', role: 'source', expr: '−4x + 12', sub: (n) => '−4 · ' + n + ' + 12', val: (n) => -4 * n + 12 },
    { id: 'r2', expr: '−4(x − 3)', sub: (n) => '−4 · (' + n + ' − 3)', val: (n) => -4 * (n - 3) },
  ],
  probe: {
    question: L(
      "Minus qavsdan chiqarildi. Qavs ichidagi ishoralar bilan nima bo'ldi?",
      'Минус вынесли за скобку. Что стало со знаками внутри?',
      'The minus was taken out. What happened to the signs inside?',
    ),
    items: [
      {
        id: 'flip',
        correct: true,
        label: L('Ikkala ishora ham almashdi', 'Оба знака перевернулись', 'Both signs flipped'),
      },
      {
        id: 'keep',
        tag: 'Z3',
        label: L("Ishoralar o'z holida qoldi", 'Знаки остались как были', 'The signs stayed as they were'),
        hint: L(
          "Unda qavsda x qo'shuv uch turardi, va beshda u minus o'ttiz ikki berardi.",
          'Тогда в скобке стояло бы x плюс три, и при пяти это дало бы минус тридцать два.',
          'Then the bracket would hold x plus three, and at five that would give minus thirty two.',
        ),
      },
      {
        id: 'first',
        tag: 'Z3',
        label: L('Faqat birinchisi almashdi', 'Перевернулся только первый', 'Only the first one flipped'),
        hint: L(
          "Minus to'rt qavsdagi har hadga ko'paytiriladi, demak har birining ishorasini almashtiradi.",
          'Минус четыре умножается на каждый член скобки, значит меняет знак каждого.',
          'Minus four multiplies every term of the bracket, so it flips the sign of each.',
        ),
      },
      {
        id: 'no',
        tag: 'Z5',
        label: L('Minusni chiqarib bo\'lmaydi', 'Минус вынести нельзя', 'A minus cannot be taken out'),
        hint: L(
          "Minus to'rt ikkala hadni bo'ladi: minus to'rt x ni ham, o'n ikkini ham.",
          'Минус четыре делит оба члена: и минус четыре x, и двенадцать.',
          'Minus four divides both terms: minus four x and twelve.',
        ),
      },
    ],
  },
  okText: L(
    "Minusni chiqarish qavsdagi har hadning ishorasini almashtiradi. Bu o'sha ko'paytirish qoidasi, faqat teskari o'qilgan.",
    'Вынесение минуса переворачивает знак каждого члена скобки. Это то же правило умножения, прочитанное назад.',
    'Taking out a minus flips the sign of every term in the bracket. It is the same multiplication rule read backwards.',
  ),
  audio: [
    A('mount', "Yuqorida boshlang'ich yozuv, pastda minus chiqarilgan yozuv.", 'Сверху исходная запись, снизу запись с вынесенным минусом.', 'Above the original record, below the one with the minus taken out.'),
    A('mount', "Sonni o'zingiz tanlang. Uch marta, har safar boshqasi.", 'Выбери число сам. Три раза, каждый раз другое.', 'Choose a number yourself. Three times, a different one each time.'),
    A('sub', "Ikki qatorni solishtiring.", 'Сравни две строки.', 'Compare the two rows.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("koeffitsiyentlarning eng katta umumiy bo'luvchisi", 'наибольший общий делитель коэффициентов', 'the greatest common divisor of the coefficients') },
    { id: 'f2', label: L("va har harfning eng kichik ko'rsatkichi", 'и наименьший показатель каждой буквы', 'and the smallest exponent of each letter') },
    { id: 'f3', label: L('qavsdan tashqariga chiqadi', 'выносятся за скобку', 'are taken outside the bracket') },
    { id: 'f4', label: L("qavs ichida esa bo'linmalar qoladi", 'а в скобке остаются частные', 'and the quotients stay inside') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval sonlar, keyin harflar, keyin chiqarish, oxirida qavs ichi.",
    'Порядок нарушен. Сначала числа, потом буквы, потом вынесение, в конце содержимое скобки.',
    'The order is off. Numbers first, then letters, then taking out, and the bracket last.',
  ),
  lawChips: [
    { label: '( )', tone: 'par' },
    { label: '·', tone: 's2' },
    { label: '1', tone: 'off' },
    { label: '−', tone: 's1' },
  ],
  lawSweep: L(
    "qavs, ko'paytuvchi, birlik, ishora",
    'скобка, множитель, единица, знак',
    'bracket, factor, one, sign',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Umumiy ko'paytuvchini qavsdan chiqarish uchun hamma hadning umumiy ko'paytuvchisini topib, har hadni unga bo'lish kerak: ko'paytuvchi qavs oldiga chiqadi, bo'linmalar esa qavs ichida qoladi.",
        'Чтобы вынести общий множитель за скобки, надо найти общий множитель всех членов и разделить на него каждый член: множитель встанет перед скобкой, а частные останутся внутри.',
        'To take a common factor out, find the common factor of all the terms and divide each term by it: the factor goes before the bracket and the quotients stay inside.',
      ),
      L(
        "Ko'paytuvchi ENG KATTA olinadi: koeffitsiyentlarning eng katta umumiy bo'luvchisi va har harfning eng kichik ko'rsatkichi. Agar hadning o'zi ko'paytuvchiga teng bo'lsa, qavsda undan BIRLIK qoladi.",
        'Множитель берётся НАИБОЛЬШИМ: наибольший общий делитель коэффициентов и наименьший показатель каждой буквы. Если член сам равен множителю, в скобке от него остаётся ЕДИНИЦА.',
        'The factor is taken as the GREATEST one: the greatest common divisor of the coefficients and the smallest exponent of each letter. If a term equals the factor, a ONE is left from it inside the bracket.',
      ),
    ],
  },
  hookCap: L(
    "Oxirigacha chiqarilgan bo'lsa, qavsda umumiy ko'paytuvchi qolmaydi",
    'Если вынесено до конца, в скобке общих множителей не остаётся',
    'When it is taken out all the way, no common factor stays in the bracket',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L("sonlarning bo'luvchisi", 'делитель чисел', 'the divisor of the numbers'),
    L("eng kichik ko'rsatkich", 'наименьший показатель', 'the smallest exponent'),
    L('birlik yo\'qolmaydi', 'единица не теряется', 'the one is not lost'),
  ],
  audio: [
    A('mount', "Hamma holatni ko'rdik: eng katta ko'paytuvchi, birlik va minus. Endi qoidani yig'amiz.", 'Все случаи мы увидели: наибольший множитель, единица и минус. Теперь соберём правило.', 'We have seen all the cases: the greatest factor, the one and the minus. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda shu ish to'rt hadga tarqaladi.", 'Верно. На следующем уроке эта работа расходится на четыре члена.', 'Correct. Next lesson this work spreads to four terms.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Javobni toping', 'Найди ответ', 'Find the answer'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "8x³ + 12x² dan qaysi ko'paytuvchi chiqariladi?",
        'Какой множитель вынести из 8x³ + 12x²?',
        'Which factor comes out of 8x³ + 12x²?',
      ),
      ok: L("To'rt ikkala sonni bo'ladi, x kvadrat esa ikkala hadda bor.", 'Четыре делит оба числа, а x в квадрате есть в обоих членах.', 'Four divides both numbers, and x squared is in both terms.'),
      items: [
        { id: 'a', label: '4x²', correct: true },
        { id: 'b', label: '2x', tag: 'Z1', hint: L("To'rt ham ikkalasini bo'ladi, va x kvadrat ikkala hadda bor.", 'Четыре тоже делит оба, и x в квадрате есть в обоих членах.', 'Four divides both as well, and x squared is in both terms.') },
        { id: 'c', label: '4x³', tag: 'Z4', hint: L("Ikkinchi hadda x ikkinchi darajada.", 'Во втором члене x во второй степени.', 'In the second term x is squared.') },
        { id: 'd', label: '8x²', tag: 'Z6', hint: L("O'n ikki sakkizga bo'linmaydi.", 'Двенадцать на восемь не делится.', 'Twelve does not divide by eight.') },
      ],
    },
    {
      wrap: false,
      prompt: '9y⁵ − 6y³',
      ok: L("Uch ikkala sonni bo'ladi, y ning eng kichik ko'rsatkichi uch.", 'Три делит оба числа, а наименьший показатель y это три.', 'Three divides both numbers, and the smallest exponent of y is three.'),
      items: [
        { id: 'a', label: '3y³(3y² − 2)', correct: true },
        { id: 'b', label: '3y³(3y² − 2y)', tag: 'Z6', hint: L("Olti y kubni uch y kubga bo'lsak ikki chiqadi, harf qolmaydi.", 'Шесть y в кубе разделить на три y в кубе это два, буквы не остаётся.', 'Six y cubed divided by three y cubed is two, no letter is left.') },
        { id: 'c', label: 'y³(9y² − 6)', tag: 'Z1', hint: L("To'qqiz va olti uchga bo'linadi, uchlikni ham chiqarish kerak.", 'Девять и шесть делятся на три, тройку тоже надо вынести.', 'Nine and six divide by three, the three must come out too.') },
        { id: 'd', label: '3y⁵(3 − 2y²)', tag: 'Z4', hint: L("y ning eng kichik ko'rsatkichi uch, besh emas.", 'Наименьший показатель y это три, а не пять.', 'The smallest exponent of y is three, not five.') },
      ],
    },
    {
      wrap: false,
      prompt: '5a² + 5a',
      ok: L("Ikkinchi had ko'paytuvchiga teng, shuning uchun qavsda birlik qoldi.", 'Второй член равен множителю, поэтому в скобке осталась единица.', 'The second term equals the factor, so a one is left in the bracket.'),
      items: [
        { id: 'a', label: '5a(a + 1)', correct: true },
        { id: 'b', label: '5a(a)', tag: 'Z2', hint: L("Ikkinchi hadni o'ziga bo'lsak birlik chiqadi, nol emas.", 'Второй член, разделённый на себя, даёт единицу, а не ноль.', 'The second term divided by itself gives one, not zero.') },
        { id: 'c', label: '5(a² + a)', tag: 'Z1', hint: L("a harfi ikkala hadda ham bor, uni ham chiqarish kerak.", 'Буква a есть в обоих членах, её тоже надо вынести.', 'The letter a is in both terms, it must come out too.') },
        { id: 'd', label: '5a(a + a)', tag: 'Z6', hint: L("Besh a ni besh a ga bo'lsak birlik chiqadi.", 'Пять a разделить на пять a это единица.', 'Five a divided by five a is one.') },
      ],
    },
    {
      wrap: false,
      prompt: '−6x² − 9x',
      ok: L("Ikkala had manfiy, shuning uchun minus ham chiqadi va qavsda ishoralar almashadi.", 'Оба члена отрицательны, поэтому минус тоже выносится, и знаки в скобке меняются.', 'Both terms are negative, so the minus comes out too and the signs inside flip.'),
      items: [
        { id: 'a', label: '−3x(2x + 3)', correct: true },
        { id: 'b', label: '−3x(2x − 3)', tag: 'Z3', hint: L("Minus chiqarilgan bo'lsa, ikkinchi ishora ham almashadi.", 'Если минус вынесен, второй знак тоже переворачивается.', 'When the minus is taken out, the second sign flips as well.') },
        { id: 'c', label: '3x(2x + 3)', tag: 'Z3', hint: L("Ikkala had manfiy, minus uchlik bilan birga chiqadi.", 'Оба члена отрицательны, минус выносится вместе с тройкой.', 'Both terms are negative, the minus comes out with the three.') },
        { id: 'd', label: '−3x(2x² + 3)', tag: 'Z4', hint: L("Olti x kvadratni uch x ga bo'lsak ikki x chiqadi.", 'Шесть x в квадрате разделить на три x это два x.', 'Six x squared divided by three x is two x.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Birinchisida faqat ko'paytuvchi so'raladi.", 'Четыре вопроса. В первом спрашивают только множитель.', 'Four questions. The first asks only for the factor.'),
    A('1', "Ikkinchisida ko'rsatkichlar katta.", 'Во втором большие показатели.', 'The second has big exponents.'),
    A('2', "Uchinchisida birlik bor.", 'В третьем есть единица.', 'The third has a one in it.'),
    A('3', "Oxirgisida ikkala had manfiy.", 'В последнем оба члена отрицательны.', 'In the last one both terms are negative.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: avval ko'paytuvchi, keyin qavs.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki harf birga', 'Две буквы вместе', 'Two letters at once'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['18a³b − 24a²b²  =  ', { slot: 0 }, '(3a − ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '6a²b' },
    { id: 'b', label: '4b' },
    { id: 'c', label: '6ab' },
    { id: 'd', label: '4b²' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Avval ko'paytuvchi, keyin qavsning ikkinchi hadi.",
    'Сначала множитель, потом второй член скобки.',
    'The factor first, then the second term of the bracket.',
  ),
  checkNote: L(
    "O'n sakkiz bilan yigirma to'rtning eng katta umumiy bo'luvchisi olti, a ning eng kichik ko'rsatkichi ikki, b ning eng kichik ko'rsatkichi bir.",
    'Наибольший общий делитель восемнадцати и двадцати четырёх это шесть, наименьший показатель a это два, наименьший показатель b это один.',
    'The greatest common divisor of eighteen and twenty four is six, the smallest exponent of a is two, and of b is one.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("a ning eng kichik ko'rsatkichi ikki, shuning uchun a kvadrat chiqadi.", 'Наименьший показатель a это два, поэтому выносится a в квадрате.', 'The smallest exponent of a is two, so a squared comes out.') },
    { key: 'd', tag: 'Z6', hint: L("Yigirma to'rt a kvadrat b kvadratni olti a kvadrat b ga bo'lsak to'rt b chiqadi.", 'Двадцать четыре a в квадрате b в квадрате разделить на шесть a в квадрате b это четыре b.', 'Twenty four a squared b squared divided by six a squared b is four b.') },
    { key: '*', tag: 'Z1', hint: L("Har harf alohida qaraladi: eng kichik ko'rsatkich olinadi.", 'Каждая буква рассматривается отдельно: берётся наименьший показатель.', 'Each letter is taken separately: the smallest exponent is used.') },
  ],
  probe: {
    question: L("Tekshirish: 6a²b karra 3a nechchi bo'ladi?", 'Проверка: чему равно 6a²b на 3a?', 'A check: what is 6a²b times 3a?'),
    items: [
      { id: 'a', correct: true, label: '18a³b' },
      { id: 'b', tag: 'Z4', label: '18a²b', hint: L("Ikkinchi ko'paytuvchida ham a bor, ko'rsatkichlar qo'shiladi.", 'Во втором множителе тоже есть a, показатели складываются.', 'The second factor has an a too, and the exponents add.') },
      { id: 'c', tag: 'Z4', label: '18a³b²', hint: L("b faqat birinchi ko'paytuvchida bor.", 'b есть только в первом множителе.', 'b is only in the first factor.') },
      { id: 'd', tag: 'Z6', label: '9a³b', hint: L("Olti karra uch o'n sakkiz beradi.", 'Шесть на три даёт восемнадцать.', 'Six times three gives eighteen.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval chiqarish, keyin ko'paytirib tekshirish.", 'Два шага. Сначала вынесение, потом проверка умножением.', 'Two steps. Taking out first, then a check by multiplying.'),
    A('mount', "Bu yerda ikki harf bor, va har biriga alohida qaraladi.", 'Здесь две буквы, и на каждую смотрят отдельно.', 'There are two letters here, and each is looked at separately.'),
    A('two', "Endi tekshirish: ko'paytuvchini qavsdagi hadga ko'paytiring.", 'Теперь проверка: умножь множитель на член скобки.', 'Now the check: multiply the factor by the bracket term.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. BIRLIK yana, lekin asbobsiz.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Ikkinchi had -- eng qizig\'i', 'Второй член самый интересный', 'The second term is the interesting one'),
  template: ['7x⁵ − 7x³  =  7x³(', { slot: 0 }, ' ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: 'x²' },
    { id: 'b', label: '− 1' },
    { id: 'c', label: '− 0' },
    { id: 'd', label: 'x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Qavsni to'ldiring. Ikkinchi had ko'paytuvchiga teng.",
    'Заполни скобку. Второй член равен множителю.',
    'Fill the bracket. The second term equals the factor.',
  ),
  checkNote: L(
    "Yetti x beshinchini yetti x kubga bo'lsak x kvadrat chiqadi, yetti x kubni esa o'ziga bo'lsak birlik chiqadi.",
    'Семь x в пятой разделить на семь x в кубе это x в квадрате, а семь x в кубе на себя это единица.',
    'Seven x to the fifth divided by seven x cubed is x squared, and seven x cubed by itself is one.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Hadni o'ziga bo'lsak birlik chiqadi, nol emas.", 'Член, разделённый на себя, даёт единицу, а не ноль.', 'A term divided by itself gives one, not zero.') },
    { key: 'd', tag: 'Z4', hint: L("Beshdan uchni ayirsak ikki chiqadi, ya'ni x kvadrat.", 'Пять минус три это два, значит x в квадрате.', 'Five minus three is two, so x squared.') },
    { key: '*', tag: 'Z2', hint: L("Har hadni ko'paytuvchiga bo'lib ko'ring.", 'Раздели каждый член на множитель.', 'Divide each term by the factor.') },
  ],
  audio: [
    A('mount', "To'rtburchak yo'q. Ikkinchi had ko'paytuvchining o'zi, va bu eng qiziq joyi.", 'Прямоугольника нет. Второй член это сам множитель, и это самое интересное место.', 'No rectangle. The second term is the factor itself, and that is the interesting part.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Birinchi bo'linma to'g'ri, ikkinchisida esa had
// O'ZIGA bo'linib NOL berib qo'yilgan -- birlik yo'qoldi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ko'paytuvchi to'g'ri topilgan, birinchi bo'linma ham to'g'ri. Shunday bo'lsa ham, qaysi qator xato?",
    'Множитель найден верно, первое частное тоже верно. И всё же какая строка ошибочна?',
    'The factor is found right and the first quotient is right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '4a³ + 4a²' },
    { id: 'r2', text: '4a³ : 4a² = a' },
    { id: 'r3', text: '4a² : 4a² = 0' },
    { id: 'r4', text: L('javob: 4a²(a)', 'ответ: 4a²(a)', 'answer: 4a²(a)') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: to'rtliklar qisqaradi, uchta a dan bittasi qoladi.", 'Верно: четвёрки сокращаются, из трёх a остаётся одна.', 'Right: the fours cancel, and one a is left out of three.'),
    r4: L("Bu qator oldingisidan chiqadi. Xato undan oldin paydo bo'lgan.", 'Эта строка следует из предыдущей. Ошибка появилась раньше.', 'This line follows from the previous one. The mistake appeared earlier.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r4: 'Z2' },
  proofFill: {
    template: ['4a² : 4a²  =  ', { slot: 0 }, '   →   4a² (a ', { slot: 1 }, ')'],
    parts: [
      { id: 'a', label: '1' },
      { id: 'b', label: '+ 1' },
      { id: 'c', label: '0' },
      { id: 'd', label: '+ 0' },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Bo'linmani hisoblang va qavsni to'ldiring.",
      'Посчитай частное и дострой скобку.',
      'Work out the quotient and complete the bracket.',
    ),
    checkNote: L(
      "Har qanday ifodani o'ziga bo'lsak birlik chiqadi. Shuning uchun qavsda ikki had bo'ladi.",
      'Любое выражение, разделённое на себя, даёт единицу. Поэтому в скобке два члена.',
      'Any expression divided by itself gives one. So the bracket has two terms.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("Nol ayirishda chiqadi, bu yerda esa bo'lish.", 'Ноль получается при вычитании, а здесь деление.', 'Zero comes from subtracting, and here we divide.') },
      { key: 'd', tag: 'Z2', hint: L("Qavsdagi ikkinchi had birlik bo'ladi.", 'Второй член в скобке это единица.', 'The second term in the bracket is one.') },
      { key: '*', tag: 'Z2', hint: L("Hadni o'ziga bo'lsak birlik chiqadi.", 'Член, разделённый на себя, даёт единицу.', 'A term divided by itself gives one.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ko'paytuvchi to'g'ri topilgan.", 'В этой ловушке множитель найден верно.', 'In this trap the factor is found correctly.'),
    A('mount', "Shunday bo'lsa ham javobda qavsda bitta had turibdi. Xato birinchi qaysi qatorda.", 'И всё же в ответе в скобке один член. В какой строке ошибка впервые.', 'And yet the answer bracket holds a single term. Which line has the mistake first.'),
    A('proof', "Topdingiz. Hadni o'ziga bo'lsak nol emas, birlik chiqadi.", 'Нашёл. Член, разделённый на себя, даёт не ноль, а единицу.', 'You found it. A term divided by itself gives one, not zero.'),
    A('done', "Shuning uchun qavsda ikki had bo'ladi.", 'Поэтому в скобке два члена.', 'That is why the bracket has two terms.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. YUZA MASALASI: bir tomon ma'lum, ikkinchisi
// izlanadi. Darslik yuza modelini o'zi so'raydi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ikkinchi tomon', 'Вторая сторона', 'The other side'),
  given: L(
    "To'rtburchakning yuzasi 6x² + 9x ga teng, bir tomoni 3x. Ikkinchi tomoni qanday?",
    'Площадь прямоугольника равна 6x² + 9x, одна сторона 3x. Какая вторая?',
    'A rectangle has area 6x² + 9x and one side 3x. What is the other side?',
  ),
  template: ['6x² + 9x  =  3x(', { slot: 0 }, ' + ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '2x' },
    { id: 'b', label: '3' },
    { id: 'c', label: '2' },
    { id: 'd', label: '3x' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Har hadni 3x ga bo'ling.",
    'Раздели каждый член на 3x.',
    'Divide each term by 3x.',
  ),
  checkNote: L(
    "Olti x kvadratni uch x ga bo'lsak ikki x, to'qqiz x ni uch x ga bo'lsak uch chiqadi.",
    'Шесть x в квадрате на три x это два x, а девять x на три x это три.',
    'Six x squared by three x is two x, and nine x by three x is three.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Olti x kvadratni uch x ga bo'lganda bitta x qoladi.", 'При делении шести x в квадрате на три x один x остаётся.', 'Dividing six x squared by three x leaves one x.') },
    { key: 'd', tag: 'Z4', hint: L("To'qqiz x ni uch x ga bo'lsak son chiqadi, harf qolmaydi.", 'Девять x разделить на три x даёт число, буквы не остаётся.', 'Nine x divided by three x gives a number, no letter is left.') },
    { key: '*', tag: 'Z4', hint: L("Har hadni ko'paytuvchiga bo'lish kerak.", 'Каждый член нужно разделить на множитель.', 'Each term must be divided by the factor.') },
  ],
  audio: [
    A('mount', "Yuza ma'lum, bir tomon ham ma'lum. Ikkinchi tomon qavsda turadi.", 'Площадь известна, одна сторона тоже. Вторая сторона стоит в скобке.', 'The area is known and one side too. The other side stands in the bracket.'),
    A('mount', "Har hadni ma'lum tomonga bo'lib ko'ring.", 'Раздели каждый член на известную сторону.', 'Divide each term by the known side.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  items: [
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '10x³ − 15x²',
      ok: L("Besh ikkala sonni bo'ladi, x kvadrat ikkala hadda bor.", 'Пять делит оба числа, x в квадрате есть в обоих членах.', 'Five divides both numbers, x squared is in both terms.'),
      items: [
        { id: 'a', label: '5x²(2x − 3)', correct: true },
        { id: 'b', label: '5x(2x² − 3x)', tag: 'Z1', hint: L("Qavsda ikki x kvadrat va uch x yana x ga bo'linadi.", 'В скобке два x в квадрате и три x ещё делятся на x.', 'In the bracket two x squared and three x still divide by x.') },
        { id: 'c', label: '5x²(2x − 3x)', tag: 'Z6', hint: L("O'n besh x kvadratni besh x kvadratga bo'lsak uch chiqadi.", 'Пятнадцать x в квадрате разделить на пять x в квадрате это три.', 'Fifteen x squared divided by five x squared is three.') },
        { id: 'd', label: '5x²(2x + 3)', tag: 'Z3', hint: L("Ikkinchi had manfiy edi.", 'Второй член был отрицательным.', 'The second term was negative.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '3a + 3',
      ok: L("Ikkinchi had ko'paytuvchiga teng, qavsda birlik qoldi.", 'Второй член равен множителю, в скобке осталась единица.', 'The second term equals the factor, a one is left in the bracket.'),
      items: [
        { id: 'a', label: '3(a + 1)', correct: true },
        { id: 'b', label: '3(a)', tag: 'Z2', hint: L("Uchni uchga bo'lsak birlik chiqadi.", 'Три разделить на три это единица.', 'Three divided by three is one.') },
        { id: 'c', label: '3(a + 3)', tag: 'Z6', hint: L("Uchni uchga bo'lsak uch emas, bir chiqadi.", 'Три разделить на три это не три, а один.', 'Three divided by three is not three but one.') },
        { id: 'd', label: 'a(3 + 3)', tag: 'Z5', hint: L("Ikkinchi hadda a harfi yo'q, uni chiqarib bo'lmaydi.", 'Во втором члене буквы a нет, её вынести нельзя.', 'The second term has no a, it cannot be taken out.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "16y⁴ + 24y² dan qaysi ko'paytuvchi chiqariladi?",
        'Какой множитель вынести из 16y⁴ + 24y²?',
        'Which factor comes out of 16y⁴ + 24y²?',
      ),
      ok: L("Sakkiz ikkala sonning eng katta umumiy bo'luvchisi, y ning eng kichik ko'rsatkichi ikki.", 'Восемь это наибольший общий делитель обоих чисел, наименьший показатель y это два.', 'Eight is the greatest common divisor of both numbers, and the smallest exponent of y is two.'),
      items: [
        { id: 'a', label: '8y²', correct: true },
        { id: 'b', label: '4y²', tag: 'Z1', hint: L("Sakkiz ham ikkala sonni bo'ladi.", 'Восемь тоже делит оба числа.', 'Eight divides both numbers as well.') },
        { id: 'c', label: '8y⁴', tag: 'Z4', hint: L("Ikkinchi hadda y ikkinchi darajada.", 'Во втором члене y во второй степени.', 'In the second term y is squared.') },
        { id: 'd', label: '8y', tag: 'Z4', hint: L("Ikkala hadda ham y kamida ikkinchi darajada.", 'В обоих членах y не ниже второй степени.', 'In both terms y is at least squared.') },
      ],
    },
    {
      wrap: false,
      question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
      prompt: '−5x² + 10x',
      ok: L("Birinchi had manfiy, shuning uchun minus ham chiqadi va qavsda ishora almashadi.", 'Первый член отрицательный, поэтому минус тоже выносится и знак в скобке меняется.', 'The first term is negative, so the minus comes out and the sign inside flips.'),
      items: [
        { id: 'a', label: '−5x(x − 2)', correct: true },
        { id: 'b', label: '−5x(x + 2)', tag: 'Z3', hint: L("Minus chiqarilganda ikkinchi ishora almashadi.", 'При вынесении минуса второй знак меняется.', 'When the minus is taken out the second sign flips.') },
        { id: 'c', label: '5x(x − 2)', tag: 'Z3', hint: L("Birinchi had manfiy, minus qavs oldiga chiqadi.", 'Первый член отрицательный, минус выходит перед скобку.', 'The first term is negative, the minus goes before the bracket.') },
        { id: 'd', label: '−5x(x² − 2)', tag: 'Z4', hint: L("Besh x kvadratni besh x ga bo'lsak bitta x qoladi.", 'Пять x в квадрате разделить на пять x оставляет один x.', 'Five x squared divided by five x leaves one x.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida birlik bor.", 'Во втором есть единица.', 'The second has a one.'),
    A('2', "Uchinchisida faqat ko'paytuvchi so'raladi.", 'В третьем спрашивают только множитель.', 'The third asks only for the factor.'),
    A('3', "Oxirgisida birinchi had manfiy.", 'В последнем первый член отрицательный.', 'In the last one the first term is negative.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Oxirigacha chiqarildi', 'Вынесено до конца', 'Taken out all the way'),
  gate: S1.gate,
  fix: {
    tokens: ['6a'],
    value: '0',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Ko'paytuvchi eng katta olinadi: o'n ikki bilan o'n sakkizning eng katta umumiy bo'luvchisi olti, va a harfi ikkala hadda bor. Olti a dan keyin qavsda umumiy ko'paytuvchi qolmaydi.",
    'Множитель берётся наибольшим: наибольший общий делитель двенадцати и восемнадцати это шесть, и буква a есть в обоих членах. После шести a в скобке общих множителей не остаётся.',
    'The factor is taken greatest: the greatest common divisor of twelve and eighteen is six, and the letter a is in both terms. After six a no common factor is left in the bracket.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    six: L('olti a ni chiqargan', 'тот, кто вынес 6a', 'the one who took out 6a'),
    two: L('ikki a ni chiqargan', 'тот, кто вынес 2a', 'the one who took out 2a'),
    both: L('ikkovi ham', 'оба', 'both of them'),
    none: L('hech kim', 'ни один', 'neither'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['12a² − 18a → 6a', '15x³ + 25x² → 5x²', 'ab + a → a(b + 1)', '−4x + 12 → −4(x − 3)'],
  twoLabel: L('B4 bloki davom etadi', 'Блок Б4 продолжается', 'Block B4 continues'),
  twoA: L(
    "ko'paytuvchi  →  eng katta bo'luvchi va eng kichik ko'rsatkich",
    'множитель  →  наибольший делитель и наименьший показатель',
    'the factor  →  greatest divisor and smallest exponent',
  ),
  twoB: L(
    "birlik  →  yo'qolmaydi",
    'единица  →  не теряется',
    'the one  →  is never lost',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'guruhlash usuli',
    'способ группировки',
    'the grouping method',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish uch narsadan chiqdi: eng katta ko'paytuvchi, birlik va minus.", 'Вся сегодняшняя работа вышла из трёх вещей: наибольший множитель, единица и минус.', 'All of today came from three things: the greatest factor, the one and the minus.'),
    A('mount', "Keyingi darsda hadlar to'rtta bo'ladi va ular guruhlarga bo'linadi.", 'На следующем уроке членов станет четыре, и они разойдутся по группам.', 'Next lesson there will be four terms, and they will split into groups.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
