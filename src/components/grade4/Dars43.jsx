// ============================================================================
// 4-SINF · Dars 43 · Tenglamalarni yechish va tekshirish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri:
//   37-39-bet "Natijani tekshirish usullari" — tekshirish g'oyasi;
//   101-104-bet "Tenglamalarni yechish" — ko'paytirish va bo'lishli
//   tenglamalar, 104-betdagi namuna (13 900 - x) : 80 = 140 dosloven.
// Syujet: boshqaruv markazining TEKSHIRUV POSTI (SYUJET_4SINF.md, 6-blok).
// 42-darsdan ko'prik: muhr ochildi, endi post javobni tekshirmasdan qabul
// qilmaydi.
//
// YADRO. Javob topilgani bilan ish tugamaydi: uni harf o'rniga qo'yib,
// ikki tomon bir xil son berishini ko'rsatish kerak. Noma'lum ko'paytuvchi
// ko'paytmani ma'lum ko'paytuvchiga bo'lish bilan, noma'lum bo'linuvchi esa
// bo'linmani bo'luvchiga ko'paytirish bilan topiladi.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, Plate, RecordRow,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TableFill, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'eqsolve-4-43-v2',
  slug: 'dars43-tenglamalarni-yechish-va-tekshirish',
  lessonTitle: {
    uz: '43-dars. Tenglamalarni yechish va tekshirish',
    ru: 'Урок 43. Решение уравнений с проверкой',
    en: 'Lesson 43. Solving and checking equations',
  },
  skillTags: ['unknown_factor', 'unknown_dividend', 'compound_equation', 'substitution_check', 'inverse_operation'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Tekshiruv posti', ru: 'Пост проверки', en: 'The verification desk' },
    title: {
      uz: 'Post javobni qaytardi',
      ru: 'Пост вернул ответ',
      en: 'The desk sent the answer back',
    },
    question: {
      uz: 'Javob xatoligini qanday bilamiz?',
      ru: 'Как узнать, что ответ неверный?',
      en: 'How can we tell the answer is wrong?',
    },
    options: [
      { uz: "Javobni tenglamaga qo'yib ko'ramiz", ru: 'Подставим ответ в уравнение', en: 'We put the answer back into the equation' },
      { uz: 'Tenglamani yana bir bor yechamiz', ru: 'Решим уравнение ещё раз', en: 'We solve the equation once more' },
      { uz: 'Javobni yaxlitlaymiz', ru: 'Округлим ответ', en: 'We round the answer' },
      { uz: 'Boshqa tenglamani olamiz', ru: 'Возьмём другое уравнение', en: 'We take another equation' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Javobni harf o'rniga qo'ysak, tenglik to'g'ri chiqadimi yoki yo'qmi, darrov ko'rinadi.",
      ru: 'Верно. Подставив ответ вместо буквы, сразу видно, верно равенство или нет.',
      en: 'Correct. Put the answer in place of the letter and you see at once whether the equality holds.',
    },
    wrong: [
      null,
      {
        uz: "Qayta yechish uzoq va xato takrorlanishi mumkin. Tekshirish bir qadamda javob beradi.",
        ru: 'Решать заново долго, и ошибка может повториться. Проверка отвечает за один шаг.',
        en: 'Solving again takes long and the error may repeat. A check answers in one step.',
      },
      {
        uz: "Yaxlitlash javobni o'zgartiradi, lekin to'g'ri yoki noto'g'riligini ko'rsatmaydi.",
        ru: 'Округление меняет ответ, но не показывает, верен он или нет.',
        en: 'Rounding changes the answer but does not show whether it is right.',
      },
      {
        uz: "Boshqa tenglama bu javobni tekshirmaydi. Tekshiruv aynan shu tenglamada bo'ladi.",
        ru: 'Другое уравнение не проверит этот ответ. Проверка идёт по тому же уравнению.',
        en: 'Another equation will not check this answer. The check is done in the same equation.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Buyurtma muhri ochildi va ish tekshiruv postiga o'tdi.",
          "Post oddiy tenglama berdi: iks ko'paytiriladi sakkizga, natija bir ming uch yuz to'qson ikki.",
          "Bit javob yubordi: o'n bir ming bir yuz o'ttiz olti. Post uni qabul qilmadi.",
          "Javobni qayta yechmasdan tekshirish mumkinmi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Печать заказа снята, и работа перешла на пост проверки.',
          'Пост дал простое уравнение: икс умножить на восемь, получается тысяча триста девяносто два.',
          'Bit отправил ответ: одиннадцать тысяч сто тридцать шесть. Пост его не принял.',
          'Можно ли проверить ответ, не решая заново? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The order seal is lifted and the work has moved to the verification desk.',
          'The desk gave a simple equation: x multiplied by eight gives one thousand three hundred and ninety two.',
          'Bit sent an answer: eleven thousand one hundred and thirty six. The desk did not accept it.',
          'Can we check the answer without solving again? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tekshirish nima', ru: 'Что такое проверка', en: 'What a check is' },
    title: {
      uz: 'Javobni joyiga qaytaramiz',
      ru: 'Возвращаем ответ на место',
      en: 'We put the answer back in place',
    },
    lead: {
      uz: "Topilgan sonni harf o'rniga qo'yamiz va ikki tomonni hisoblaymiz.",
      ru: 'Ставим найденное число вместо буквы и считаем обе стороны.',
      en: 'We put the found number in place of the letter and work out both sides.',
    },
    note: {
      uz: 'Ikki tomon bir xil son bergandagina javob qabul qilinadi.',
      ru: 'Ответ принимают только тогда, когда обе стороны дают одно число.',
      en: 'The answer is accepted only when both sides give the same number.',
    },
    audio: {
      intro: {
        uz: [
          "Bitning javobini tenglamaga qo'yamiz: o'n bir ming bir yuz o'ttiz olti ko'paytiriladi sakkizga.",
          "Chap tomon juda katta son berdi. O'ng tomonda esa bir ming uch yuz to'qson ikki.",
          "Ikki tomon teng emas. Demak javob noto'g'ri, va buni hisobsiz ham ko'rish mumkin.",
          "Tekshirish shu: sonni joyiga qo'yamiz va ikki tomonni solishtiramiz.",
        ],
        ru: [
          'Подставим ответ Bit в уравнение: одиннадцать тысяч сто тридцать шесть умножить на восемь.',
          'Левая сторона дала очень большое число. А справа тысяча триста девяносто два.',
          'Стороны не равны. Значит, ответ неверный, и это видно почти без вычислений.',
          'Проверка в этом и состоит: ставим число на место и сравниваем стороны.',
        ],
        en: [
          'Let us put Bit answer into the equation: eleven thousand one hundred and thirty six multiplied by eight.',
          'The left side gave a very large number. On the right there is one thousand three hundred and ninety two.',
          'The sides are not equal. So the answer is wrong, and that is visible almost without calculation.',
          'That is what a check is: put the number in place and compare the sides.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Tekshiruv qatori', ru: 'Строка проверки', en: 'The check line' },
    title: {
      uz: 'Qaysi qator tekshiruv?',
      ru: 'Какая строка — проверка?',
      en: 'Which line is the check?',
    },
    question: {
      uz: 'x · 8 = 1392 va x = 174. Qaysi qator tekshiruv bo\'ladi?',
      ru: 'x · 8 = 1392 и x = 174. Какая строка будет проверкой?',
      en: 'x · 8 = 1392 and x = 174. Which line is the check?',
    },
    options: [
      { uz: '174 · 8 = 1392', ru: '174 · 8 = 1392', en: '174 · 8 = 1392' },
      { uz: '174 + 8 = 182', ru: '174 + 8 = 182', en: '174 + 8 = 182' },
      { uz: '1392 · 8 = 11136', ru: '1392 · 8 = 11136', en: '1392 · 8 = 11136' },
      { uz: '1392 + 174 = 1566', ru: '1392 + 174 = 1566', en: '1392 + 174 = 1566' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Iks o'rniga bir yuz yetmish to'rt qo'yildi va tenglama aynan tiklandi.",
      ru: 'Верно. Вместо икса поставили сто семьдесят четыре, и уравнение восстановилось точно.',
      en: 'Correct. One hundred and seventy four was put in place of x and the equation came back exactly.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda qo'shish bajarilgan. Tenglamada esa ko'paytirish turibdi.",
        ru: 'Здесь выполнено сложение. А в уравнении стоит умножение.',
        en: 'Addition was done here. But the equation has multiplication.',
      },
      {
        uz: "Bu javobni emas, natijani ko'paytiryapti. Harf o'rniga javob qo'yilishi kerak.",
        ru: 'Здесь умножают результат, а не ответ. Вместо буквы нужно поставить ответ.',
        en: 'This multiplies the result, not the answer. The answer must go in place of the letter.',
      },
      {
        uz: "Bu ikkita natijani qo'shadi. Tekshiruvda tenglamaning o'zi takrorlanishi kerak.",
        ru: 'Здесь складывают два результата. В проверке должно повториться само уравнение.',
        en: 'This adds two results. A check must repeat the equation itself.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Post to'g'ri javobni aytdi: iks bir yuz yetmish to'rtga teng.",
          "Endi tekshiruv qatorini tanlash kerak. U tenglamani aynan tiklashi shart.",
          "Qaysi qator tekshiruv bo'ladi? Javobni tanlang.",
        ],
        ru: [
          'Пост назвал верный ответ: икс равен ста семидесяти четырём.',
          'Теперь нужно выбрать строку проверки. Она должна точно восстановить уравнение.',
          'Какая строка будет проверкой? Выбери ответ.',
        ],
        en: [
          'The desk named the right answer: x equals one hundred and seventy four.',
          'Now we must choose the check line. It has to restore the equation exactly.',
          'Which line is the check? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: "Noma'lum ko'paytuvchi", ru: 'Неизвестный множитель', en: 'Unknown factor' },
    title: {
      uz: "Ko'paytuvchini qanday topamiz?",
      ru: 'Как найти множитель?',
      en: 'How do we find a factor?',
    },
    lead: {
      uz: "Ko'paytmani ma'lum ko'paytuvchiga bo'lsak, ikkinchi ko'paytuvchi chiqadi.",
      ru: 'Разделив произведение на известный множитель, получим второй множитель.',
      en: 'Dividing the product by the known factor gives the other factor.',
    },
    note: {
      uz: "Bo'lish ko'paytirishning teskarisi: u ko'paytuvchini qaytarib beradi.",
      ru: 'Деление обратно умножению: оно возвращает множитель.',
      en: 'Division is the inverse of multiplication: it gives the factor back.',
    },
    audio: {
      intro: {
        uz: [
          "Tenglamada uchta o'rin bor: ikki ko'paytuvchi va ko'paytma.",
          "Bizda ko'paytma va bitta ko'paytuvchi bor: bir ming uch yuz to'qson ikki va sakkiz.",
          "Ikkinchi ko'paytuvchini topish uchun ko'paytmani ma'lum ko'paytuvchiga bo'lamiz.",
          "Bir ming uch yuz to'qson ikkini sakkizga bo'lsak, bir yuz yetmish to'rt chiqadi.",
        ],
        ru: [
          'В уравнении три места: два множителя и произведение.',
          'У нас есть произведение и один множитель: тысяча триста девяносто два и восемь.',
          'Чтобы найти второй множитель, разделим произведение на известный множитель.',
          'Тысячу триста девяносто два разделить на восемь, получится сто семьдесят четыре.',
        ],
        en: [
          'The equation has three places: two factors and the product.',
          'We have the product and one factor: one thousand three hundred and ninety two and eight.',
          'To find the other factor we divide the product by the known factor.',
          'One thousand three hundred and ninety two divided by eight gives one hundred and seventy four.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Postning ikkinchi tenglamasi',
      ru: 'Второе уравнение поста',
      en: 'The second equation of the desk',
    },
    question: {
      uz: 'x · 6 = 4512. Iks nechaga teng?',
      ru: 'x · 6 = 4512. Чему равен x?',
      en: 'x · 6 = 4512. What does x equal?',
    },
    answer: 752,
    correctText: {
      uz: "To'g'ri. To'rt ming besh yuz o'n ikkini oltiga bo'lsak, yetti yuz ellik ikki chiqadi.",
      ru: 'Верно. Четыре тысячи пятьсот двенадцать разделить на шесть — семьсот пятьдесят два.',
      en: 'Correct. Four thousand five hundred and twelve divided by six is seven hundred and fifty two.',
    },
    wrong: {
      uz: "Hali emas. Noma'lum ko'paytuvchi kerak: ko'paytmani ma'lum ko'paytuvchiga bo'ling.",
      ru: 'Пока нет. Нужен неизвестный множитель: раздели произведение на известный множитель.',
      en: 'Not yet. The unknown factor is needed: divide the product by the known factor.',
    },
    hintAfter: {
      uz: "Burchak usulida bo'ling: to'rt ming besh yuz o'n ikkini oltiga.",
      ru: 'Раздели уголком: четыре тысячи пятьсот двенадцать на шесть.',
      en: 'Divide in a column: four thousand five hundred and twelve by six.',
    },
    audio: {
      intro: {
        uz: [
          "Post ikkinchi tenglamani berdi: iks ko'paytiriladi oltiga, natija to'rt ming besh yuz o'n ikki.",
          "Bu ham noma'lum ko'paytuvchi masalasi.",
          "Iks nechaga teng? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Пост дал второе уравнение: икс умножить на шесть, получается четыре тысячи пятьсот двенадцать.',
          'Это тоже задача про неизвестный множитель.',
          'Чему равен икс? Набери ответ и подтверди.',
        ],
        en: [
          'The desk gave a second equation: x multiplied by six gives four thousand five hundred and twelve.',
          'This is an unknown factor task as well.',
          'What does x equal? Type the answer and confirm.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: "Bo'linuvchi va bo'luvchi", ru: 'Делимое и делитель', en: 'Dividend and divisor' },
    title: {
      uz: 'Iks bo\'lishda tursa',
      ru: 'Когда икс в делении',
      en: 'When x stands in a division',
    },
    lead: {
      uz: "Iks bo'linuvchi bo'lsa ko'paytiramiz, bo'luvchi bo'lsa bo'lamiz.",
      ru: 'Если икс делимое — умножаем, если делитель — делим.',
      en: 'If x is the dividend we multiply, if x is the divisor we divide.',
    },
    note: {
      uz: "Iks qaysi o'rinda turganini aniqlash — birinchi qadam.",
      ru: 'Определить, на каком месте стоит икс, — первый шаг.',
      en: 'Finding out which place x stands in is the first step.',
    },
    audio: {
      intro: {
        uz: [
          "Ikkita yangi yozuv keldi. Birinchisi: iks bo'linadi qirqqa, natija ikki ming uch yuz.",
          "Bu yerda iks bo'linuvchi. Uni tiklash uchun bo'linmani bo'luvchiga ko'paytiramiz.",
          "Ikkinchisi: uch yuz ellik yetti ming bo'linadi iksga, natija uch yuz ellik yetti.",
          "Bu yerda iks bo'luvchi. Uni topish uchun bo'linuvchini bo'linmaga bo'lamiz.",
        ],
        ru: [
          'Пришли две новые записи. Первая: икс разделить на сорок, получается две тысячи триста.',
          'Здесь икс это делимое. Чтобы его восстановить, умножим частное на делитель.',
          'Вторая: триста пятьдесят семь тысяч разделить на икс, получается триста пятьдесят семь.',
          'Здесь икс это делитель. Чтобы его найти, разделим делимое на частное.',
        ],
        en: [
          'Two new records have arrived. The first: x divided by forty gives two thousand three hundred.',
          'Here x is the dividend. To restore it we multiply the quotient by the divisor.',
          'The second: three hundred and fifty seven thousand divided by x gives three hundred and fifty seven.',
          'Here x is the divisor. To find it we divide the dividend by the quotient.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Amalni tanlang', ru: 'Выбери действие', en: 'Choose the action' },
    title: {
      uz: 'Bo\'linuvchini tiklaymiz',
      ru: 'Восстанавливаем делимое',
      en: 'We restore the dividend',
    },
    question: {
      uz: 'x : 35 = 16800. Iksni topish uchun nima qilamiz?',
      ru: 'x : 35 = 16800. Что сделаем, чтобы найти x?',
      en: 'x : 35 = 16800. What do we do to find x?',
    },
    options: [
      { uz: "16800 ni 35 ga ko'paytiramiz", ru: 'Умножим 16800 на 35', en: 'Multiply 16800 by 35' },
      { uz: "16800 ni 35 ga bo'lamiz", ru: 'Разделим 16800 на 35', en: 'Divide 16800 by 35' },
      { uz: "35 ni 16800 ga bo'lamiz", ru: 'Разделим 35 на 16800', en: 'Divide 35 by 16800' },
      { uz: "16800 ga 35 ni qo'shamiz", ru: 'Прибавим 35 к 16800', en: 'Add 35 to 16800' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bo'linmani bo'luvchiga ko'paytiramiz: iks besh yuz sakson sakkiz mingga teng.",
      ru: 'Верно. Умножаем частное на делитель: икс равен пятистам восьмидесяти восьми тысячам.',
      en: 'Correct. We multiply the quotient by the divisor: x equals five hundred and eighty eight thousand.',
    },
    wrong: [
      null,
      {
        uz: "Bo'lsak, son yana kichrayadi. Bo'linuvchi esa eng katta son bo'lishi kerak.",
        ru: 'При делении число станет ещё меньше. А делимое должно быть самым большим.',
        en: 'Dividing makes the number smaller still. But the dividend has to be the largest.',
      },
      {
        uz: "Sonlar o'rin almashgan: kichik sonni katta songa bo'lish bu yerda ma'no bermaydi.",
        ru: 'Числа поменялись местами: делить меньшее на большее здесь бессмысленно.',
        en: 'The numbers swapped places: dividing the smaller by the larger makes no sense here.',
      },
      {
        uz: "Tenglamada qo'shish yo'q. Bo'lishning teskarisi ko'paytirish.",
        ru: 'В уравнении нет сложения. Обратное делению — умножение.',
        en: 'There is no addition in the equation. The inverse of division is multiplication.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Post uchinchi tenglamani berdi: iks bo'linadi o'ttiz beshga, natija o'n olti ming sakkiz yuz.",
          "Iks bu yerda bo'linuvchi.",
          "Uni qaysi amal tiklaydi? Javobni tanlang.",
        ],
        ru: [
          'Пост дал третье уравнение: икс разделить на тридцать пять, получается шестнадцать тысяч восемьсот.',
          'Икс здесь делимое.',
          'Какое действие его восстановит? Выбери ответ.',
        ],
        en: [
          'The desk gave a third equation: x divided by thirty five gives sixteen thousand eight hundred.',
          'Here x is the dividend.',
          'Which action restores it? Choose an answer.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Ikki qadamli', ru: 'В два шага', en: 'In two steps' },
    title: {
      uz: 'Qavs ichida noma\'lum',
      ru: 'Неизвестное внутри скобок',
      en: 'The unknown inside brackets',
    },
    lead: {
      uz: 'Avval qavsning butun qiymatini topamiz, keyin ichidagi iksni.',
      ru: 'Сначала находим значение всей скобки, затем икс внутри неё.',
      en: 'First we find the value of the whole bracket, then the x inside it.',
    },
    note: {
      uz: 'Darslik namunasi: qavs bitta son kabi qaraladi.',
      ru: 'Образец из учебника: скобку рассматривают как одно число.',
      en: 'The textbook model: the bracket is treated as a single number.',
    },
    audio: {
      intro: {
        uz: [
          "Post murakkabroq yozuv berdi. Qavs ichidagi ayirma sakson ga bo'linadi va bir yuz qirq chiqadi.",
          "Qavsni bitta son deb qaraymiz. U bo'linuvchi, demak bo'linmani bo'luvchiga ko'paytiramiz.",
          "Bir yuz qirqni sakson ga ko'paytirsak, o'n bir ming ikki yuz chiqadi. Qavsning qiymati shu.",
          "Endi oddiy tenglama qoldi: o'n uch ming to'qqiz yuzdan iks ayirilsa, o'n bir ming ikki yuz. Iks ikki ming yetti yuz.",
        ],
        ru: [
          'Пост дал запись посложнее. Разность в скобках делится на восемьдесят и получается сто сорок.',
          'Будем считать скобку одним числом. Она делимое, значит умножим частное на делитель.',
          'Сто сорок умножить на восемьдесят, получится одиннадцать тысяч двести. Это и есть значение скобки.',
          'Остаётся простое уравнение: из тринадцати тысяч девятисот вычесть икс, получится одиннадцать тысяч двести. Икс равен двум тысячам семистам.',
        ],
        en: [
          'The desk gave a harder record. The difference in the brackets is divided by eighty and gives one hundred and forty.',
          'We treat the bracket as one number. It is the dividend, so we multiply the quotient by the divisor.',
          'One hundred and forty multiplied by eighty is eleven thousand two hundred. That is the value of the bracket.',
          'A simple equation is left: thirteen thousand nine hundred minus x gives eleven thousand two hundred. So x is two thousand seven hundred.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Birinchi qadam', ru: 'Первый шаг', en: 'The first step' },
    title: {
      uz: 'Qaysi qadam birinchi?',
      ru: 'Какой шаг первый?',
      en: 'Which step comes first?',
    },
    question: {
      uz: '(8700 - x) : 900 = 9. Birinchi qadam qanday yoziladi?',
      ru: '(8700 - x) : 900 = 9. Как записать первый шаг?',
      en: '(8700 - x) : 900 = 9. How is the first step written?',
    },
    options: [
      { uz: '8700 - x = 9 · 900', ru: '8700 - x = 9 · 900', en: '8700 - x = 9 · 900' },
      { uz: '8700 - x = 9 : 900', ru: '8700 - x = 9 : 900', en: '8700 - x = 9 : 900' },
      { uz: 'x = 8700 : 900', ru: 'x = 8700 : 900', en: 'x = 8700 : 900' },
      { uz: 'x - 8700 = 9 · 900', ru: 'x - 8700 = 9 · 900', en: 'x - 8700 = 9 · 900' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Qavs bo'linuvchi edi: to'qqizni to'qqiz yuzga ko'paytiramiz, sakkiz ming yuz chiqadi.",
      ru: 'Верно. Скобка была делимым: девять умножить на девятьсот — восемь тысяч сто.',
      en: 'Correct. The bracket was the dividend: nine multiplied by nine hundred is eight thousand one hundred.',
    },
    wrong: [
      null,
      {
        uz: "Bo'lsak, qavsning qiymati juda kichik chiqadi. Bo'linuvchini tiklash uchun ko'paytirish kerak.",
        ru: 'При делении значение скобки станет слишком маленьким. Чтобы восстановить делимое, нужно умножение.',
        en: 'Dividing makes the bracket value far too small. Restoring a dividend needs multiplication.',
      },
      {
        uz: "Bu qavsni butunlay e'tiborsiz qoldiradi. Avval qavsning qiymatini topish kerak.",
        ru: 'Здесь скобка вовсе не учтена. Сначала нужно найти значение скобки.',
        en: 'This ignores the bracket completely. The value of the bracket has to be found first.',
      },
      {
        uz: "Qavs ichidagi ayirma teskari yozilgan. Katta son oldinda turadi.",
        ru: 'Разность в скобках записана наоборот. Большее число стоит впереди.',
        en: 'The difference in the brackets is written the other way round. The larger number comes first.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Yangi murakkab tenglama: qavs ichidagi ayirma to'qqiz yuzga bo'linadi va to'qqiz chiqadi.",
          "Qavsni bitta son deb qarang va uning qiymatini toping.",
          "Birinchi qadam qanday yoziladi? Javobni tanlang.",
        ],
        ru: [
          'Новое сложное уравнение: разность в скобках делится на девятьсот и получается девять.',
          'Считай скобку одним числом и найди её значение.',
          'Как записать первый шаг? Выбери ответ.',
        ],
        en: [
          'A new compound equation: the difference in the brackets is divided by nine hundred and gives nine.',
          'Treat the bracket as one number and find its value.',
          'How is the first step written? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'To\'liq tekshiruv', ru: 'Полная проверка', en: 'The full check' },
    title: {
      uz: 'Murakkab yozuvni tekshirish',
      ru: 'Проверка сложной записи',
      en: 'Checking a compound record',
    },
    lead: {
      uz: 'Topilgan sonni asl yozuvga qo\'yamiz va butun zanjirni bosib chiqamiz.',
      ru: 'Ставим найденное число в исходную запись и проходим всю цепочку.',
      en: 'We put the found number into the original record and walk the whole chain.',
    },
    note: {
      uz: 'Tekshiruv oxirgi qadamdan emas, boshidan boshlanadi.',
      ru: 'Проверку начинают не с последнего шага, а с начала.',
      en: 'A check starts from the beginning, not from the last step.',
    },
    audio: {
      intro: {
        uz: [
          "Iks ikki ming yetti yuzga teng chiqdi. Endi uni asl yozuvga qo'yamiz.",
          "O'n uch ming to'qqiz yuzdan ikki ming yetti yuzni ayiramiz: o'n bir ming ikki yuz.",
          "Uni sakson ga bo'lamiz: bir yuz qirq chiqadi.",
          "O'ng tomonda ham bir yuz qirq. Ikki tomon teng, javob qabul qilindi.",
        ],
        ru: [
          'Икс получился равным двум тысячам семистам. Теперь поставим его в исходную запись.',
          'Из тринадцати тысяч девятисот вычтем две тысячи семьсот: одиннадцать тысяч двести.',
          'Разделим на восемьдесят: получается сто сорок.',
          'Справа тоже сто сорок. Стороны равны, ответ принят.',
        ],
        en: [
          'The x came out equal to two thousand seven hundred. Now we put it into the original record.',
          'From thirteen thousand nine hundred we take two thousand seven hundred: eleven thousand two hundred.',
          'Divide that by eighty: it gives one hundred and forty.',
          'On the right there is one hundred and forty too. The sides are equal and the answer is accepted.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Jadvalni to\'ldiring', ru: 'Заполни таблицу', en: 'Fill in the table' },
    title: {
      uz: 'Yetishmagan ko\'paytuvchi',
      ru: 'Недостающий множитель',
      en: 'The missing factor',
    },
    question: {
      uz: 'Bo\'sh katakka qaysi son turadi?',
      ru: 'Какое число встанет в пустую клетку?',
      en: 'Which number goes into the empty cell?',
    },
    columns: [
      { uz: "Ko'paytuvchi", ru: 'Множитель', en: 'Factor' },
      { uz: "Ko'paytuvchi", ru: 'Множитель', en: 'Factor' },
      { uz: "Ko'paytma", ru: 'Произведение', en: 'Product' },
    ],
    rows: [
      [{ uz: '160', ru: '160', en: '160' }, { uz: '8', ru: '8', en: '8' }, { uz: '1280', ru: '1280', en: '1280' }],
      [null, { uz: '7', ru: '7', en: '7' }, { uz: '630', ru: '630', en: '630' }],
    ],
    chips: [
      { uz: '90', ru: '90', en: '90' },
      { uz: '80', ru: '80', en: '80' },
      { uz: '900', ru: '900', en: '900' },
      { uz: '4410', ru: '4410', en: '4410' },
    ],
    correctChip: 0,
    correctText: {
      uz: "To'g'ri. Olti yuz o'ttizni yettiga bo'lsak, to'qson chiqadi. Tekshirish: to'qson ko'paytiriladi yettiga.",
      ru: 'Верно. Шестьсот тридцать разделить на семь — девяносто. Проверка: девяносто умножить на семь.',
      en: 'Correct. Six hundred and thirty divided by seven is ninety. Check: ninety multiplied by seven.',
    },
    wrong: [
      null,
      {
        uz: "Sakson ko'paytiriladi yettiga besh yuz oltmish beradi, olti yuz o'ttiz emas.",
        ru: 'Восемьдесят умножить на семь — пятьсот шестьдесят, а не шестьсот тридцать.',
        en: 'Eighty multiplied by seven is five hundred and sixty, not six hundred and thirty.',
      },
      {
        uz: "Bu son o'n marta katta. Ko'paytmani bo'luvchiga bo'lganda nol qo'shilib qolgan.",
        ru: 'Это число в десять раз больше. При делении произведения добавился лишний ноль.',
        en: 'This number is ten times too big. An extra zero crept in when dividing the product.',
      },
      {
        uz: "Bu ko'paytma bo'lib chiqdi: olti yuz o'ttiz yettiga ko'paytirilgan. Bizga esa bo'lish kerak.",
        ru: 'Это произведение: шестьсот тридцать умножили на семь. А нужно было разделить.',
        en: 'That is a product: six hundred and thirty was multiplied by seven. But we needed to divide.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Post komponentlar jadvalini berdi. Birinchi qator to'liq, ikkinchisida bitta katak bo'sh.",
          "Ma'lum ko'paytuvchi yetti, ko'paytma olti yuz o'ttiz.",
          "Bo'sh katakka qaysi son turadi? Javobni tanlang.",
        ],
        ru: [
          'Пост дал таблицу компонентов. Первая строка полная, во второй одна клетка пустая.',
          'Известный множитель равен семи, а произведение шестистам тридцати.',
          'Какое число встанет в пустую клетку? Выбери ответ.',
        ],
        en: [
          'The desk gave a table of components. The first row is complete, the second has one empty cell.',
          'The known factor is seven and the product is six hundred and thirty.',
          'Which number goes into the empty cell? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Uch amal, bitta tekshiruv',
      ru: 'Три действия, одна проверка',
      en: 'Three actions, one check',
    },
    lead: {
      uz: 'Iks qaysi o\'rinda tursa, teskari amal shuni qaytaradi.',
      ru: 'На каком месте стоит икс, то и вернёт обратное действие.',
      en: 'Whatever place x stands in, the inverse action gives it back.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Noma'lum ko'paytuvchini topish uchun ko'paytmani ma'lum ko'paytuvchiga bo'lamiz.",
          "Noma'lum bo'linuvchini topish uchun bo'linmani bo'luvchiga ko'paytiramiz, noma'lum bo'luvchi uchun esa bo'linuvchini bo'linmaga bo'lamiz.",
          "Va oxirgi qadam har doim bir xil: javobni asl yozuvga qo'yib tekshiramiz.",
        ],
        ru: [
          'Соберём правило. Чтобы найти неизвестный множитель, делим произведение на известный множитель.',
          'Чтобы найти неизвестное делимое, умножаем частное на делитель, а для неизвестного делителя делим делимое на частное.',
          'И последний шаг всегда один: подставляем ответ в исходную запись и проверяем.',
        ],
        en: [
          'Let us put the rule together. To find an unknown factor we divide the product by the known factor.',
          'To find an unknown dividend we multiply the quotient by the divisor, and for an unknown divisor we divide the dividend by the quotient.',
          'And the last step is always the same: put the answer into the original record and check.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi yo\'l tez?', ru: 'Какой путь быстрее?', en: 'Which way is quicker?' },
    title: {
      uz: 'Ustunsiz bo\'ladimi?',
      ru: 'Можно ли без столбика?',
      en: 'Can we do without a column?',
    },
    question: {
      uz: 'x : 100 = 46. Bu tenglamani qanday yechgan qulay?',
      ru: 'x : 100 = 46. Как удобнее решить это уравнение?',
      en: 'x : 100 = 46. What is the convenient way to solve it?',
    },
    options: [
      { uz: "Og'zaki: 46 ga ikkita nol qo'shamiz", ru: 'Устно: припишем к 46 два нуля', en: 'Mentally: add two zeros to 46' },
      { uz: 'Ustunda ko\'paytiramiz', ru: 'Умножим столбиком', en: 'Multiply in a column' },
      { uz: 'Sonlarni birma-bir sinaymiz', ru: 'Переберём числа по одному', en: 'Try numbers one by one' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yuzga ko'paytirish ikkita nol qo'shadi: iks to'rt ming olti yuzga teng.",
      ru: 'Верно. Умножение на сто добавляет два нуля: икс равен четырём тысячам шестистам.',
      en: 'Correct. Multiplying by one hundred adds two zeros: x equals four thousand six hundred.',
    },
    wrong: [
      null,
      {
        uz: "Ustun ham to'g'ri javob beradi, lekin yuzga ko'paytirishda u ortiqcha ish.",
        ru: 'Столбик тоже даст верный ответ, но при умножении на сто это лишняя работа.',
        en: 'A column also gives the right answer, but it is extra work when multiplying by one hundred.',
      },
      {
        uz: "Sinash uzoq yo'l. Bu yerda amalning o'zi javobni darrov beradi.",
        ru: 'Перебор — долгий путь. Здесь само действие сразу даёт ответ.',
        en: 'Trying numbers is a long road. Here the action itself gives the answer at once.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Post oxirgi tenglamani berdi: iks bo'linadi yuzga, natija qirq olti.",
          "Ba'zan yozib o'tirish shart emas: amalning o'zi javobni beradi.",
          "Bu tenglamani qanday yechgan qulay? Javobni tanlang.",
        ],
        ru: [
          'Пост дал последнее уравнение: икс разделить на сто, получается сорок шесть.',
          'Иногда записывать не нужно: само действие даёт ответ.',
          'Как удобнее решить это уравнение? Выбери ответ.',
        ],
        en: [
          'The desk gave a last equation: x divided by one hundred gives forty six.',
          'Sometimes there is no need to write: the action itself gives the answer.',
          'What is the convenient way to solve it? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit qaysi qadamda adashdi?',
      ru: 'На каком шаге ошибся Bit?',
      en: 'At which step did Bit go wrong?',
    },
    question: {
      uz: 'Bit yozuvida bitta qadam noto\'g\'ri. Xato nimada?',
      ru: 'В записи Bit один шаг неверен. В чём ошибка?',
      en: 'One step in Bit record is wrong. What is the error?',
    },
    steps: [
      { uz: '(13900 - x) : 80 = 140', ru: '(13900 - x) : 80 = 140', en: '(13900 - x) : 80 = 140' },
      { uz: '13900 - x = 140 · 80', ru: '13900 - x = 140 · 80', en: '13900 - x = 140 · 80' },
      { uz: '13900 - x = 11200', ru: '13900 - x = 11200', en: '13900 - x = 11200' },
      { uz: 'x = 11200 - 13900', ru: 'x = 11200 - 13900', en: 'x = 11200 - 13900' },
    ],
    options: [
      { uz: "Oxirgi qadamda sonlar o'rin almashgan", ru: 'В последнем шаге числа поменялись местами', en: 'In the last step the numbers swapped places' },
      { uz: "Ikkinchi qadamda bo'lish kerak edi", ru: 'На втором шаге нужно было деление', en: 'Division was needed at the second step' },
      { uz: 'Birinchi qadam noto\'g\'ri ko\'chirilgan', ru: 'Первый шаг переписан неверно', en: 'The first step was copied wrongly' },
      { uz: 'Xato yo\'q, javob to\'g\'ri', ru: 'Ошибки нет, ответ верный', en: 'There is no error, the answer is right' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Iks kamayuvchidan ayiriladi, shuning uchun katta son oldinda turishi kerak: ikki ming yetti yuz.",
      ru: 'Верно. Икс вычитают из уменьшаемого, поэтому большее число должно стоять впереди: две тысячи семьсот.',
      en: 'Correct. The x is taken from the minuend, so the larger number has to come first: two thousand seven hundred.',
    },
    wrong: [
      null,
      {
        uz: "Ikkinchi qadam to'g'ri: qavs bo'linuvchi edi, uni ko'paytirish bilan tiklaymiz.",
        ru: 'Второй шаг верен: скобка была делимым, её восстанавливают умножением.',
        en: 'The second step is right: the bracket was the dividend and is restored by multiplication.',
      },
      {
        uz: "Birinchi qadam asl yozuvni aynan takrorlaydi. Xato keyinroq.",
        ru: 'Первый шаг точно повторяет исходную запись. Ошибка дальше.',
        en: 'The first step repeats the original record exactly. The error comes later.',
      },
      {
        uz: "Bunday yozuvda javob manfiy chiqadi. Bu yerda esa iks musbat son bo'lishi kerak.",
        ru: 'При такой записи ответ выйдет отрицательным. А икс здесь должен быть положительным.',
        en: 'Such a record gives a negative answer. But x here must be a positive number.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit murakkab tenglamani yechdi va yozuvni postga yubordi.",
          "Uning to'rt qadami ekranda. Bitta qadam noto'g'ri.",
          "Xato nimada? Javobni tanlang.",
        ],
        ru: [
          'Bit решил сложное уравнение и отправил запись на пост.',
          'Его четыре шага на экране. Один шаг неверен.',
          'В чём ошибка? Выбери ответ.',
        ],
        en: [
          'Bit solved the compound equation and sent the record to the desk.',
          'His four steps are on the screen. One step is wrong.',
          'What is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi javob postdan o\'tadi?',
      ru: 'Какой ответ пройдёт пост?',
      en: 'Which answer passes the desk?',
    },
    question: {
      uz: 'x · 8 = 1392. Qaysi topshiriq qabul qilinadi?',
      ru: 'x · 8 = 1392. Какую сдачу примут?',
      en: 'x · 8 = 1392. Which submission is accepted?',
    },
    options: [
      { uz: 'Javob va tekshiruv birga', ru: 'Ответ вместе с проверкой', en: 'The answer together with the check' },
      { uz: 'Faqat javob', ru: 'Только ответ', en: 'The answer only' },
      { uz: 'Boshqa javob va tekshiruv', ru: 'Другой ответ с проверкой', en: 'A different answer with a check' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Javob ham, tekshiruv ham joyida: post yozuvni qabul qildi va zanjir yopildi.",
      ru: 'Верно. И ответ, и проверка на месте: пост принял запись и цепочка закрылась.',
      en: 'Correct. Both the answer and the check are in place: the desk accepted the record.',
    },
    wrong: [
      null,
      {
        uz: "Javob to'g'ri, lekin tekshiruvsiz post uni qabul qilmaydi.",
        ru: 'Ответ верный, но без проверки пост его не примет.',
        en: 'The answer is right, but without a check the desk will not accept it.',
      },
      {
        uz: "Tekshiruv bor, lekin u tenglamani tiklamayapti: ikki tomon teng emas.",
        ru: 'Проверка есть, но она не восстанавливает уравнение: стороны не равны.',
        en: 'There is a check, but it does not restore the equation: the sides are not equal.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Post uchta topshiriqni ko'rib chiqmoqda. Faqat bittasi to'liq.",
          "Qabul qilinishi uchun javob ham, tekshiruv ham bo'lishi kerak.",
          "Qaysi topshiriq o'tadi? Javobni tanlang.",
        ],
        ru: [
          'Пост рассматривает три сдачи. Полная только одна.',
          'Чтобы её приняли, нужны и ответ, и проверка.',
          'Какая сдача пройдёт? Выбери ответ.',
        ],
        en: [
          'The desk is looking at three submissions. Only one is complete.',
          'To be accepted it needs both the answer and the check.',
          'Which submission passes? Choose an answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Mukofot', ru: 'Награда', en: 'Reward' },
    stageLabel: { uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Qoidani tanlang va tekshirishni tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь проверку.',
      en: 'Choose the rule and show that you understand the check.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Tenglama javobi qachon to\'g\'ri hisoblanadi?',
      ru: 'Когда ответ уравнения считают верным?',
      en: 'When is the answer to an equation counted as right?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Uni qo'yganda ikki tomon bir xil son bersa", ru: 'Если при подстановке обе стороны дают одно число', en: 'If putting it in makes both sides give the same number' },
      { uz: 'Agar u butun son bo\'lsa', ru: 'Если оно целое число', en: 'If it is a whole number' },
      { uz: 'Agar u tez topilgan bo\'lsa', ru: 'Если его нашли быстро', en: 'If it was found quickly' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Tekshiruv javobni tasdiqlaydi, tezlik esa emas.',
      ru: 'Именно так. Ответ подтверждает проверка, а не скорость.',
      en: 'Exactly. The check confirms the answer, not the speed.',
    },
    reflectionWrong: {
      uz: "Hali emas. Postni eslang: u faqat tekshiruvi bor javobni qabul qiladi.",
      ru: 'Пока нет. Вспомни пост: он принимает только ответ с проверкой.',
      en: 'Not yet. Remember the desk: it accepts only an answer with a check.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning to\'rt qoidasi', ru: 'Четыре правила урока', en: 'The four rules of the lesson' },
    main: [
      { uz: "Noma'lum ko'paytuvchi: ko'paytmani ma'lumiga bo'lamiz.", ru: 'Неизвестный множитель: делим произведение на известный.', en: 'Unknown factor: divide the product by the known one.' },
      { uz: "Noma'lum bo'linuvchi: bo'linmani bo'luvchiga ko'paytiramiz.", ru: 'Неизвестное делимое: умножаем частное на делитель.', en: 'Unknown dividend: multiply the quotient by the divisor.' },
      { uz: "Noma'lum bo'luvchi: bo'linuvchini bo'linmaga bo'lamiz.", ru: 'Неизвестный делитель: делим делимое на частное.', en: 'Unknown divisor: divide the dividend by the quotient.' },
      { uz: 'Qavs bitta son kabi qaraladi, tekshiruv esa oxirida.', ru: 'Скобку считают одним числом, а проверка идёт в конце.', en: 'A bracket counts as one number, and the check comes last.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Tekshiruv ustasi', ru: 'Мастер проверки', en: 'Master of the check' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Teskari amal muhandisi', ru: 'Инженер обратных действий', en: 'Engineer of inverse actions' },
        text: { uz: "Siz iks qaysi o'rinda turganini ishonchli aniqlaysiz.", ru: 'Ты уверенно определяешь, на каком месте стоит икс.', en: 'You can tell which place x stands in with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Post xodimi', ru: 'Сотрудник поста', en: 'Desk clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Post yopildi. Endi markazga bir necha qadamli hisob keladi: javob birdan chiqmaydi.",
      ru: 'Пост закрыт. Теперь в центр приходит многошаговый расчёт: ответ не получается сразу.',
      en: 'The desk is closed. Now a multi-step calculation reaches the centre: the answer does not come at once.',
    },
    audio: {
      intro: {
        uz: [
          "Post yopildi: barcha javoblar tekshiruvi bilan qabul qilindi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Javob qachon to'g'ri hisoblanadi? Javobni tanlang.",
        ],
        ru: [
          'Пост закрыт: все ответы приняты вместе с проверкой.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Когда ответ считают верным? Выбери ответ.',
        ],
        en: [
          'The desk is closed: all answers were accepted together with their checks.',
          'One question is left. Choose the rule and claim your title.',
          'When is an answer counted as right? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — YOZUV: tenglama plitalarga ajraladi, javob harf o'rniga
// tushadi, ikki tomon yonma-yon solishtiriladi. Animatsiya faqat matematik
// holat o'zgarishini ko'rsatadi: qadam ochiladi, tomon hisoblanadi, hukm
// chiqadi.
// ---------------------------------------------------------------------------

// s0: tekshiruv posti (to'q sahna).
const CheckPost = ({ accepted }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d43panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d43panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'TEKSHIRUV POSTI', ru: 'ПОСТ ПРОВЕРКИ', en: 'VERIFICATION DESK' })}
      </text>

      <rect x="72" y="78" width="360" height="80" rx="14" fill="rgba(121,211,218,.12)" stroke="rgba(144,228,235,.4)" strokeWidth="1.6" />
      <text x="252" y="110" textAnchor="middle" fill="#9DE3E7" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'post tenglamasi', ru: 'уравнение поста', en: 'equation of the desk' })}
      </text>
      <text x="252" y="142" textAnchor="middle" fill="#EAF9FB" fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        x · 8 = 1392
      </text>

      <rect x="472" y="78" width="360" height="80" rx="14" fill="rgba(255,91,53,.16)" stroke="#FFB39B" strokeWidth="1.8" />
      <text x="652" y="110" textAnchor="middle" fill="#FFB39B" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'Bit yuborgan javob', ru: 'ответ, отправленный Bit', en: 'the answer Bit sent' })}
      </text>
      <text x="652" y="142" textAnchor="middle" fill="#EAF9FB" fontSize="26" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        x = 11136
      </text>

      <rect
        x="72"
        y="182"
        width="760"
        height="72"
        rx="14"
        fill="rgba(1,13,22,.5)"
        stroke={accepted ? 'rgba(149,201,61,.5)' : 'rgba(255,179,155,.45)'}
        strokeWidth="1.6"
        strokeDasharray={accepted ? undefined : '9 7'}
      />
      <text
        x="452"
        y={accepted ? 214 : 226}
        textAnchor="middle"
        fill={accepted ? '#EAF9FB' : '#FFB39B'}
        fontSize={accepted ? 24 : 16}
        fontWeight="800"
        fontFamily={accepted ? 'JetBrains Mono, monospace' : 'Manrope, sans-serif'}
      >
        {accepted
          ? '11136 · 8 = 89088'
          : t({ uz: 'POST JAVOBNI QAYTARDI', ru: 'ПОСТ ВЕРНУЛ ОТВЕТ', en: 'THE DESK SENT IT BACK' })}
      </text>
      {accepted && (
        <text x="452" y="244" textAnchor="middle" fill="#FFB39B" fontSize="15" fontWeight="750" fontFamily="Manrope, sans-serif">
          {t({ uz: 'bu 1392 emas', ru: 'это не 1392', en: 'that is not 1392' })}
        </text>
      )}
    </FitSvg>
  );
};

// s1: javobni harf o'rniga qo'yish va ikki tomonni solishtirish.
const SubstituteBoard = ({ frame = 0 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 640 210">
      <Plate x={40} y={30} w={150} h={66} text={frame >= 1 ? '11136' : 'x'} kind={frame >= 1 ? 'unknown' : 'unknown'} lit={frame >= 1} size={frame >= 1 ? 22 : 27} />
      <Plate x={190} y={30} w={44} h={66} text="·" kind="sign" />
      <Plate x={234} y={30} w={92} h={66} text="8" kind="known" />
      <Plate x={326} y={30} w={44} h={66} text="=" kind="sign" />
      <Plate x={370} y={30} w={170} h={66} text="1392" kind="known" />

      {frame >= 2 && (
        <g>
          <rect x={40} y={112} width={286} height={44} rx="13" fill={T.warnSoft} stroke={T.warn} strokeWidth="1.8" />
          <text x={183} y={141} textAnchor="middle" fill={T.warn} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            89088
          </text>
          <rect x={370} y={112} width={170} height={44} rx="13" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="1.8" />
          <text x={455} y={141} textAnchor="middle" fill={T.cyan} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            1392
          </text>
          <Caption x={183} y={168} text={t({ uz: 'chap tomon', ru: 'левая сторона', en: 'left side' })} />
          <Caption x={455} y={168} text={t({ uz: "o'ng tomon", ru: 'правая сторона', en: 'right side' })} />
        </g>
      )}
      {frame >= 3 && (
        <g>
          <rect x={150} y={178} width={340} height={28} rx="14" fill={T.warnSoft} />
          <text x={320} y={198} textAnchor="middle" fill={T.warn} fontSize="14" fontWeight="800" fontFamily="Manrope, sans-serif">
            {t({ uz: 'ikki tomon teng emas — javob rad etildi', ru: 'стороны не равны — ответ отклонён', en: 'the sides are not equal — the answer is rejected' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s3, s4: ko'paytirish komponentlari.
const FactorTriple = ({ known, product, frame = 4, solvedValue = null }) => {
  const t = useT();
  const done = solvedValue !== null;
  return (
    <FitSvg viewBox="0 0 640 210">
      <Plate x={44} y={34} w={150} h={70} text={done ? String(solvedValue) : 'x'} kind={done ? 'result' : 'unknown'} lit={frame >= 1} size={done ? 24 : 27} />
      <Plate x={194} y={34} w={44} h={70} text="·" kind="sign" />
      <Plate x={238} y={34} w={116} h={70} text={known} kind="known" />
      <Plate x={354} y={34} w={44} h={70} text="=" kind="sign" />
      <Plate x={398} y={34} w={182} h={70} text={product} kind="known" lit={frame >= 2} size={24} />
      {frame >= 1 && (
        <g>
          <Caption x={119} y={124} text={t({ uz: "ko'paytuvchi", ru: 'множитель', en: 'factor' })} tone={T.accent} />
          <Caption x={296} y={124} text={t({ uz: "ko'paytuvchi", ru: 'множитель', en: 'factor' })} />
          <Caption x={489} y={124} text={t({ uz: "ko'paytma", ru: 'произведение', en: 'product' })} />
        </g>
      )}
      {frame >= 3 && (
        <g>
          <rect x={120} y={146} width={400} height={44} rx="13" fill={done ? T.successSoft : '#FBFDF7'} stroke={done ? T.success : 'rgba(23,59,82,.12)'} strokeWidth="1.6" />
          <text x={320} y={175} textAnchor="middle" fill={done ? T.success : T.ink2} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {`x = ${product} : ${known}${done ? ` = ${solvedValue}` : ''}`}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s5, s6: iks bo'linuvchi yoki bo'luvchi bo'lgan yozuvlar.
const DivisionPair = ({ frame = 4, single = null, solvedValue = null }) => {
  const t = useT();
  const rows = single
    ? [single]
    : [
      { left: 'x', op: ':', right: '40', result: '2300', role: t({ uz: "iks — bo'linuvchi", ru: 'икс — делимое', en: 'x is the dividend' }), fix: 'x = 2300 · 40' },
      { left: '357000', op: ':', right: 'x', result: '357', role: t({ uz: "iks — bo'luvchi", ru: 'икс — делитель', en: 'x is the divisor' }), fix: 'x = 357000 : 357' },
    ];
  const done = solvedValue !== null;
  return (
    <FitSvg viewBox={`0 0 660 ${rows.length > 1 ? 220 : 170}`}>
      {rows.map((row, index) => {
        const y = 26 + index * 96;
        const open = frame >= index + 1;
        return (
          <g key={index} opacity={open ? 1 : 0.28}>
            <Plate x={44} y={y} w={row.left === 'x' ? 96 : 170} h={58} text={row.left} kind={row.left === 'x' ? 'unknown' : 'known'} size={21} />
            <Plate x={row.left === 'x' ? 140 : 214} y={y} w={40} h={58} text={row.op} kind="sign" size={22} />
            <Plate x={row.left === 'x' ? 180 : 254} y={y} w={row.right === 'x' ? 96 : 116} h={58} text={row.right} kind={row.right === 'x' ? 'unknown' : 'known'} size={21} />
            <Plate x={370} y={y} w={40} h={58} text="=" kind="sign" size={22} />
            <Plate x={410} y={y} w={176} h={58} text={row.result} kind="known" size={21} />
            {open && <Caption x={315} y={y + 78} text={row.role} tone={T.ink2} size={12} />}
          </g>
        );
      })}
      {frame >= rows.length + 1 && (
        <g>
          <rect x={130} y={rows.length > 1 ? 176 : 108} width={400} height={40} rx="12" fill={done ? T.successSoft : '#FBFDF7'} stroke={done ? T.success : 'rgba(23,59,82,.12)'} strokeWidth="1.6" />
          <text x={330} y={rows.length > 1 ? 203 : 135} textAnchor="middle" fill={done ? T.success : T.ink2} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {done ? `${rows[0].fix} = ${solvedValue}` : rows[0].fix}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s7, s8: qavsli tenglama qadamlari.
const TwoStepBoard = ({ lines, frame = 4, highlight = -1 }) => (
  <FitSvg viewBox="0 0 660 220">
    {lines.map((line, index) => {
      const y = 22 + index * 48;
      const open = frame >= index;
      const hot = highlight === index;
      return (
        <g key={index} opacity={open ? 1 : 0.22}>
          <rect
            x={70}
            y={y}
            width={520}
            height={40}
            rx="12"
            fill={hot ? T.accentSoft : '#FBFDF7'}
            stroke={hot ? T.accent : 'rgba(23,59,82,.12)'}
            strokeWidth={hot ? 2.4 : 1.5}
          />
          <text x={330} y={y + 27} textAnchor="middle" fill={hot ? T.accent : T.ink} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {line}
          </text>
        </g>
      );
    })}
  </FitSvg>
);

// s9: to'liq tekshiruv zanjiri.
const CheckChain = ({ frame = 0 }) => {
  const t = useT();
  const lines = ['(13900 - 2700) : 80', '11200 : 80', '140'];
  return (
    <FitSvg viewBox="0 0 660 200">
      {lines.map((line, index) => {
        const x = 46 + index * 200;
        return (
          <g key={index} opacity={frame >= index + 1 ? 1 : 0.22}>
            <rect x={x} y={40} width={172} height={64} rx="14" fill={index === 2 ? T.successSoft : T.cyanSoft} stroke={index === 2 ? T.success : T.cyan} strokeWidth="1.8" />
            <text x={x + 86} y={80} textAnchor="middle" fill={index === 2 ? T.success : T.cyan} fontSize={index === 0 ? 16 : 20} fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {line}
            </text>
            {index < 2 && frame >= index + 2 && (
              <text x={x + 186} y={80} textAnchor="middle" fill={T.ink3} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">=</text>
            )}
          </g>
        );
      })}
      {frame >= 3 && (
        <g>
          <rect x={170} y={128} width={320} height={44} rx="14" fill={T.successSoft} stroke={T.success} strokeWidth="1.8" />
          <text x={330} y={157} textAnchor="middle" fill={T.success} fontSize="19" fontWeight="800" fontFamily="Manrope, sans-serif">
            {t({ uz: '140 = 140 — javob qabul qilindi', ru: '140 = 140 — ответ принят', en: '140 = 140 — the answer is accepted' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// s12: sodda yozuv (og'zaki yechish uchun).
const SimpleEq = ({ solvedValue = null }) => {
  const done = solvedValue !== null;
  return (
    <FitSvg viewBox="0 0 620 170">
      <Plate x={70} y={40} w={140} h={70} text={done ? String(solvedValue) : 'x'} kind={done ? 'result' : 'unknown'} lit size={done ? 24 : 27} />
      <Plate x={210} y={40} w={44} h={70} text=":" kind="sign" />
      <Plate x={254} y={40} w={140} h={70} text="100" kind="known" />
      <Plate x={394} y={40} w={44} h={70} text="=" kind="sign" />
      <Plate x={438} y={40} w={116} h={70} text="46" kind="known" />
    </FitSvg>
  );
};

// QOIDA kartasi: umumiy `RuleRows` bloki, mazmuni darsniki.
const RuleCard = ({ frame }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: "Noma'lum ko'paytuvchi", ru: 'Неизвестный множитель', en: 'Unknown factor' }),
          body: t({ uz: "ko'paytmani ma'lum ko'paytuvchiga bo'lamiz", ru: 'делим произведение на известный множитель', en: 'divide the product by the known factor' }),
          formula: 'x = c : b',
        },
        {
          tone: T.accent,
          head: t({ uz: "Noma'lum bo'linuvchi", ru: 'Неизвестное делимое', en: 'Unknown dividend' }),
          body: t({ uz: "bo'linmani bo'luvchiga ko'paytiramiz", ru: 'умножаем частное на делитель', en: 'multiply the quotient by the divisor' }),
          formula: 'x = c · b',
        },
        {
          tone: T.success,
          head: t({ uz: 'Tekshirish', ru: 'Проверка', en: 'The check' }),
          body: t({ uz: "javobni asl yozuvga qo'yib, ikki tomonni solishtiramiz", ru: 'подставляем ответ в исходную запись и сравниваем стороны', en: 'put the answer into the original record and compare the sides' }),
          formula: null,
        },
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => (
  <ChoiceScreen
    {...props}
    plain
    ratio="30 / 11"
    ordinal={3}
    figure={({ solved }) => (
      <div className="hero-scene">
        <div className="hero-head">
          <span>LUMO CITY · BOSHQARUV MARKAZI · TEKSHIRUV POSTI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'TEKSHIRILDI' : 'QAYTARILDI'}
          </span>
        </div>
        <div className="hero-body">
          <CheckPost accepted={solved} />
        </div>
        <div className="d43-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => <RevealScreen {...props} ratio="64 / 21" figure={({ frame }) => <SubstituteBoard frame={frame} />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="78 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['174 · 8 = 1392', '174 + 8 = 182', '1392 · 8 = 11136', '1392 + 174 = 1566']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={780}
        cardW={174}
        cardH={84}
        gap={16}
        top={30}
        size={15}
      />
    )}
  />
);
const Screen3 = (props) => (
  <RevealScreen {...props} ratio="64 / 21" figure={({ frame }) => <FactorTriple known="8" product="1392" frame={frame} />} />
);
const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    ratio="64 / 21"
    figure={({ solved }) => <FactorTriple known="6" product="4512" frame={3} solvedValue={solved ? 752 : null} />}
  />
);
const Screen5 = (props) => <RevealScreen {...props} ratio="66 / 22" figure={({ frame }) => <DivisionPair frame={frame} />} />;
const Screen6 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={2}
      ratio="66 / 17"
      figure={({ solved }) => (
        <DivisionPair
          frame={2}
          solvedValue={solved ? 588000 : null}
          single={{
            left: 'x',
            op: ':',
            right: '35',
            result: '16800',
            role: t({ uz: "iks — bo'linuvchi", ru: 'икс — делимое', en: 'x is the dividend' }),
            fix: 'x = 16800 · 35',
          }}
        />
      )}
    />
  );
};
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    ratio="66 / 22"
    figure={({ frame }) => (
      <TwoStepBoard frame={frame} lines={['(13900 - x) : 80 = 140', '13900 - x = 140 · 80', '13900 - x = 11200', 'x = 13900 - 11200 = 2700']} />
    )}
  />
);
const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="66 / 15"
    figure={({ solved }) => (
      <TwoStepBoard
        frame={solved ? 2 : 1}
        highlight={solved ? 1 : -1}
        lines={solved ? ['(8700 - x) : 900 = 9', '8700 - x = 9 · 900'] : ['(8700 - x) : 900 = 9', '?']}
      />
    )}
  />
);
const Screen9 = (props) => <RevealScreen {...props} ratio="66 / 20" figure={({ frame }) => <CheckChain frame={frame} />} />;
const Screen10 = (props) => <TableFill {...props} />;
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={5} ratio="62 / 17" figure={({ solved }) => <SimpleEq solvedValue={solved ? 4600 : null} />} />
);
const Screen13 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="auto"
      ordinal={6}
      figure={({ solved, picked }) => (
        <StepList
          steps={CONTENT.s13.steps.map((step) => t(step))}
          badIndex={3}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: "Har qadamni tenglamaga solishtiring: qaysi biri mantiqqa zid?",
            ru: 'Сравни каждый шаг с уравнением: какой из них противоречит смыслу?',
            en: 'Compare each step with the equation: which one contradicts the sense?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={7}
      ratio="72 / 23"
      figure={({ solved, picked }) => (
        <RecordRow
          records={[
            `x = 174\n174 · 8 = 1392`,
            `x = 174\n${t({ uz: 'tekshirilmagan', ru: 'без проверки', en: 'no check' })}`,
            `x = 11136\n11136 · 8 = 89088`,
          ]}
          picked={picked}
          solved={solved}
          correctIndex={0}
          width={720}
          cardW={216}
          cardH={108}
          gap={24}
          size={16}
        />
      )}
    />
  );
};
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
.d43-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d43-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars43(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES + LESSON_STYLES}
    />
  );
}
