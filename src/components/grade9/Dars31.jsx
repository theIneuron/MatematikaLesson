// ============================================================================
// 9-sinf, Dars 31. KOMBINATORIKA.
//
// REDAKSIYA 1, 2026-08-28.
//
// DARSLIKDA BU MAVZU YO'Q. Tekshirildi: 9-sinf «Algebra» darsligining
// mundarijasi (237-238-bet) bo'yicha V bob faqat 34-38-§ dan iborat,
// kombinatorikaga alohida paragraf ajratilmagan. Reja esa uni 31-dars
// sifatida talab qiladi va bu o'rinli: 30-darsda ehtimollik m/n bo'lib
// chiqdi, ya'ni ikkita SONNI sanash kerak — kombinatorika aynan shu
// sanashning usuli. Shuning uchun dars darslikning o'z materialidan
// o'sib chiqadi, tashqaridan olinmaydi.
//
// TAYANCH NUQTA — 30-DARSNING 11-EKRANI: telefon nomerining oxirgi
// ikkita raqami, 10 · 10 = 100 (darslikning 470-mashqi). U yerda
// ko'paytirish qoidasi ATALMASDAN ishlatilgan edi. Bugun u nom oladi.
// Xuk esa ataylab boshqa sonlar bilan: 3 futbolka va 4 yubka. Bolaning
// birinchi javobi ko'pincha 7 bo'ladi — qo'shish. Chizma bu javobni
// bahssiz sindiradi.
//
// YANGI ASBOB: `TreeBranch` (asboblar.jsx, 7E). Ko'paytirish qoidasini
// aytib berish mumkin, lekin «nega ko'paytiriladi, qo'shilmaydi» degan
// savolga so'z javob bermaydi. Javob chizmada: birinchi tanlovning HAR
// BIR shoxidan ikkinchi tanlovning HAMMA shoxlari chiqadi. Bola
// darajalarni birma-bir ochadi, hisoblagich esa ko'paytmani yozib
// boradi. Ikkitadan ko'p daraja berilmaydi — uchinchisi telefonga
// sig'maydi.
//
// TUZOQ (12-ekran) ikkita kombinatorik holatni ajratadi: 1, 2, 3
// raqamlaridan uch xonali son tuzishda raqamlar TAKRORLANSA 3³ = 27,
// takrorlanmasa 3! = 6. Kamron o'rin almashtirishlarni olib, 6 degan.
// Bu xato «formulani eslash» xatosi emas — SHARTNI o'qimaslik xatosi,
// va shuning uchun u kombinatorikada eng ko'p uchraydigani.
//
// TRANSFER (13-ekran) darsni 30-darsga qaytaradi: kombinatorika
// ehtimollik uchun kerak edi. Uchta raqamni tasodifan terganda 123
// chiqishi 1/6, takror bilan esa 111 chiqishi 1/27 — ikkala son ham
// aynan hozir sanalgan natijalar soni.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, TreeBranch } from './asboblar.jsx'

export const META = {
  id: 'grade9-31',
  n: 31,
  row: 31,
  block: 'Б5',
  topic: L('Kombinatorika', 'Комбинаторика', 'Combinatorics'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Tanlovlar ketma-ket kelsa, ularning imkoniyatlari KO'PAYTIRILADI",
    'Если выборы идут один за другим, их возможности УМНОЖАЮТСЯ',
    'When choices come one after another, their counts are MULTIPLIED',
  ),
  L(
    "n ta narsani qatorga terish usullari soni n faktorialga teng",
    'Число способов расставить n предметов в ряд равно n факториал',
    'The number of ways to arrange n items in a row is n factorial',
  ),
  L(
    "Takrorlanish mumkinmi yoki yo'qmi — javobni aynan shu shart hal qiladi",
    'Можно ли повторять или нет — именно это условие решает ответ',
    'Whether repeats are allowed decides the answer',
  ),
]

export const MISS = {
  'qoshish-korpaytirish-orniga': {
    what: L(
      "tanlovlarning imkoniyatlari ko'paytirilmasdan qo'shildi",
      'возможности выборов сложены вместо умножения',
      'the counts of the choices were added instead of multiplied',
    ),
    wrong: null,
    at: 0,
  },
  'takror-shartini-oqimaslik': {
    what: L(
      "takrorlanishga ruxsat bor yoki yo'qligi hisobga olinmadi",
      'не учтено, разрешены повторения или нет',
      'whether repeats are allowed was not taken into account',
    ),
    wrong: null,
    at: 0,
  },
  'faktorialni-notogri': {
    what: L(
      "faktorial noto'g'ri hisoblandi yoki noto'rin ishlatildi",
      'факториал вычислен неверно или применён не к месту',
      'the factorial was computed wrongly or applied where it does not belong',
    ),
    wrong: null,
    at: 0,
  },
  'sanoqni-ehtimollikka-ulamaslik': {
    what: L(
      "sanalgan natijalar soni ehtimollik formulasiga qo'yilmadi",
      'сосчитанное число исходов не подставлено в формулу вероятности',
      'the counted number of outcomes was not put into the probability formula',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — qo'shish yoki ko'paytirish.
// ============================================================
const S1 = {
  eyebrow: L('KIYIM TANLASH', 'ВЫБОР ОДЕЖДЫ', 'CHOOSING AN OUTFIT'),
  title: L(
    "Uchta futbolka va to'rtta yubka",
    'Три футболки и четыре юбки',
    'Three tops and four skirts',
  ),
  audio: [
    A('mount',
      "Dilnoraning uchta futbolkasi va to'rtta yubkasi bor. U bittadan futbolka va bittadan yubka kiyadi.",
      'У Дильноры три футболки и четыре юбки. Она надевает одну футболку и одну юбку.',
      'Dilnora has three tops and four skirts. She puts on one top and one skirt.'),
    A('why',
      "Nechta har xil kiyim to'plami chiqadi? Ikkita son bor, ular bilan nima qilish kerak?",
      'Сколько получится разных нарядов? Есть два числа, что с ними делать?',
      'How many different outfits are there? There are two numbers, what do we do with them?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "3 ta futbolka va 4 ta yubka. Nechta har xil to'plam chiqadi?",
      '3 футболки и 4 юбки. Сколько разных нарядов получится?',
      '3 tops and 4 skirts. How many different outfits are there?',
    ),
    items: [
      { id: 'right', right: true, show: L('12 ta', '12', '12') },
      {
        id: 'wrong',
        show: L('7 ta', '7', '7'),
        hint: L(
          "Yettita bu narsalarning umumiy soni, to'plamlarning soni emas. Bitta futbolkani sanang: unga to'rtta yubkaning har biri mos keladi, ya'ni faqat shu futbolkadan to'rtta to'plam chiqadi.",
          'Семь это общее число вещей, а не число нарядов. Возьми одну футболку: к ней подходит каждая из четырёх юбок, значит только с ней уже четыре наряда.',
          'Seven is the total count of garments, not of outfits. Take one top: each of the four skirts goes with it, so that top alone gives four outfits.',
        ),
      },
    ],
    after: L(
      "Ha, o'n ikkita. Har bir futbolkaga to'rtta yubka, uchta futbolka bor, demak uch karra to'rt. Bugun shu qoidani o'rganamiz.",
      'Да, двенадцать. К каждой футболке четыре юбки, футболок три, значит три на четыре. Сегодня изучим это правило.',
      'Yes, twelve. Four skirts with each top and three tops, so three times four. Today we learn this rule.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 30-darsning telefoni.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Buni o'tgan darsda ishlatgansiz",
    'Ты уже пользовался этим на прошлом уроке',
    'You already used this last lesson',
  ),
  audio: [
    A('mount',
      "O'tgan darsda Nigora telefon nomerining oxirgi ikkita raqamini tergan edi. U yerda yuzta variant chiqqandi.",
      'На прошлом уроке Нигора набирала две последние цифры номера. Там вышло сто вариантов.',
      'Last lesson Nigora dialled the last two digits of a number. A hundred options came out there.'),
    A('why',
      "Yuz qayerdan chiqqan edi? Har bir raqam nolldan to'qqizgacha, ya'ni o'nta imkoniyat.",
      'Откуда взялась сотня? Каждая цифра от нуля до девяти, то есть десять возможностей.',
      'Where did the hundred come from? Each digit runs zero to nine, so ten possibilities.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('10 · 10 = 100', '10 · 10 = 100', '10 · 10 = 100')}
      steps={[]}
      ask={L(
        "Nega o'n va o'n qo'shilmadi, balki ko'paytirildi?",
        'Почему десять и десять не сложили, а умножили?',
        'Why were ten and ten multiplied rather than added?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Birinchi raqamning har bir qiymatiga ikkinchisining o'ntasi mos keladi",
            'Каждому значению первой цифры отвечают десять значений второй',
            'Each value of the first digit pairs with ten values of the second',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Chunki raqamlar ikkita",
            'Потому что цифр две',
            'Because there are two digits',
          ),
          hint: L(
            "Raqamlar soni amalni tanlamaydi. Muhimi shundaki, birinchi raqamni tanlagandan keyin ikkinchisini tanlash imkoniyati YO'QOLMAYDI, u to'liq qoladi.",
            'Количество цифр не выбирает действие. Важно, что после выбора первой цифры возможность выбрать вторую НЕ пропадает, она остаётся целиком.',
            'The number of digits does not pick the operation. What matters is that choosing the first digit does not use up the choices for the second.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Xukdagi kiyimda ham shunday edi: futbolkani tanlash yubkalarni kamaytirmaydi. Bu qoidaning nomi bor.",
        'Верно. С одеждой из хука так же: выбор футболки не уменьшает число юбок. У этого правила есть имя.',
        'Correct. The same held for the outfits: picking a top does not reduce the skirts. This rule has a name.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — TreeBranch: daraxt.
// ============================================================
const S3 = {
  eyebrow: L('DARAXT', 'ДЕРЕВО', 'THE TREE'),
  title: L(
    "Har bir shoxdan hamma shoxlar chiqadi",
    'Из каждой ветви выходят все ветви',
    'Every branch grows all the branches',
  ),
  audio: [
    A('mount',
      "Uchta taom va ikkita ichimlik bor. Tanlovni daraxt ko'rinishida chizamiz.",
      'Есть три блюда и два напитка. Нарисуем выбор в виде дерева.',
      'There are three dishes and two drinks. Let us draw the choice as a tree.'),
    A('why',
      "Avval taomni tanlaymiz, keyin har bir taomdan ikkita ichimlik shoxi chiqadi.",
      'Сначала выбираем блюдо, потом от каждого блюда отходят две ветви напитков.',
      'First the dish, then two drink branches grow from each dish.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <TreeBranch
      levels={[
        {
          cap: L('taom', 'блюдо', 'dish'),
          items: [
            L('osh', 'плов', 'pilaf'),
            L('sho\'rva', 'суп', 'soup'),
            L('manti', 'манты', 'manti'),
          ],
        },
        {
          cap: L('ichimlik', 'напиток', 'drink'),
          items: [L('choy', 'чай', 'tea'), L('suv', 'вода', 'water')],
        },
      ]}
      ask={L(
        "Darajalarni birma-bir oching va yo'llar sonini kuzating",
        'Открывай уровни по одному и следи за числом путей',
        'Open the levels one by one and watch the number of paths',
      )}
      openLabel={L('Ochish', 'Открыть', 'Open')}
      after={L(
        "Oltita yo'l chiqdi. Uchta taomning har biriga ikkita ichimlik, ya'ni uch karra ikki. Daraxt qo'shishni emas, ko'paytirishni ko'rsatadi.",
        'Получилось шесть путей. К каждому из трёх блюд два напитка, то есть три на два. Дерево показывает умножение, а не сложение.',
        'Six paths appeared. Two drinks with each of three dishes, that is three times two. The tree shows multiplication, not addition.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — qoidaning o'zi.
// ============================================================
const S4 = {
  eyebrow: L("KO'PAYTIRISH QOIDASI", 'ПРАВИЛО УМНОЖЕНИЯ', 'THE MULTIPLICATION RULE'),
  title: L(
    "Uchta tanlov bo'lsa ham shunday",
    'При трёх выборах так же',
    'The same holds for three choices',
  ),
  audio: [
    A('mount',
      "Qoida ikkita tanlov bilan cheklanmaydi. Uchta, to'rtta tanlov bo'lsa ham ularning imkoniyatlari ko'paytiriladi.",
      'Правило не ограничено двумя выборами. При трёх, четырёх выборах их возможности так же умножаются.',
      'The rule is not limited to two choices. With three or four, their counts multiply just the same.'),
    A('why',
      "Bir xonalik qulfda uchta g'ildirak bor, har birida beshta raqam.",
      'В одном замке три колёсика, на каждом по пять цифр.',
      'A lock has three wheels with five digits on each.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('5,  5,  5', '5,  5,  5', '5,  5,  5')}
      steps={[
        { id: 'a', head: L('Ikkita gildirak', 'Два колёсика', 'Two wheels'), lines: ['5 · 5 = 25'] },
      ]}
      ask={L(
        "Uchta g'ildirakda nechta kod bor?",
        'Сколько кодов на трёх колёсиках?',
        'How many codes do three wheels give?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '125' },
        {
          id: 'wrong',
          label: '15',
          hint: L(
            "O'n besh beshni uchga ko'paytirganda chiqadi, ya'ni g'ildiraklar SONIGA. Ko'paytirish kerak bo'lgani esa har bir g'ildirakning imkoniyatlari.",
            'Пятнадцать выходит при умножении пяти на три, то есть на ЧИСЛО колёсиков. А перемножать нужно возможности каждого колёсика.',
            'Fifteen comes from five times three, that is by the COUNT of wheels. What must be multiplied are the options on each wheel.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Besh karra besh karra besh, bir yuz yigirma besh. Har bir yangi tanlov javobni yana besh barobar oshiradi.",
        'Верно. Пять на пять на пять, сто двадцать пять. Каждый новый выбор увеличивает ответ ещё в пять раз.',
        'Correct. Five times five times five is one hundred twenty five. Each new choice multiplies the answer by five again.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — o'rin almashtirishlar.
// ============================================================
const S5 = {
  eyebrow: L('QATORGA TERISH', 'РАССТАВИТЬ В РЯД', 'ARRANGING IN A ROW'),
  title: L(
    "Endi tanlangan narsa qaytmaydi",
    'Теперь выбранное не возвращается',
    'Now what is taken does not come back',
  ),
  audio: [
    A('mount',
      "Uchta kitobni javonga qatorga terish kerak. Birinchi joyga uchta kitobdan birini qo'yamiz.",
      'Три книги нужно расставить на полке в ряд. На первое место ставим одну из трёх книг.',
      'Three books are to stand in a row on a shelf. Any of the three goes in the first place.'),
    A('why',
      "Ikkinchi joyga esa nechta kitob qoldi? Bu kiyim tanlashdan farq qiladi.",
      'А сколько книг осталось на второе место? Здесь отличие от выбора одежды.',
      'And how many books remain for the second place? Here it differs from choosing an outfit.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3 ta kitob', '3 книги', '3 books')}
      steps={[
        { id: 'a', head: L('Birinchi joy', 'Первое место', 'First place'), lines: ['3'] },
      ]}
      ask={L(
        "Ikkinchi joyga nechta imkoniyat qoladi?",
        'Сколько возможностей остаётся на второе место?',
        'How many possibilities remain for the second place?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '2' },
        {
          id: 'wrong',
          label: '3',
          hint: L(
            "Bitta kitob allaqachon javonda turibdi, uni ikkinchi joyga ham qo'yib bo'lmaydi. Kiyimda yubka joyida qolardi, bu yerda esa kitob ketdi.",
            'Одна книга уже стоит на полке, её нельзя поставить и на второе место. С одеждой юбка оставалась на месте, а здесь книга ушла.',
            'One book already stands on the shelf and cannot take the second place too. With clothes the skirt stayed available, here the book is gone.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch karra ikki karra bir, ya'ni oltita usul. Bunday ko'paytma faktorial deyiladi va undov belgisi bilan yoziladi.",
        'Верно. Три на два на один, то есть шесть способов. Такое произведение называют факториалом и пишут с восклицательным знаком.',
        'Correct. Three times two times one is six ways. Such a product is called a factorial and written with an exclamation mark.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — faktorial qanchalik tez o'sadi.
// ============================================================
const S6 = {
  eyebrow: L('TEZ O\'SADI', 'РАСТЁТ БЫСТРО', 'IT GROWS FAST'),
  title: L(
    "Faktorial darajadan ham tez o'sadi",
    'Факториал растёт быстрее степени',
    'A factorial outgrows a power',
  ),
  audio: [
    A('mount',
      "Uch faktorial olti, to'rt faktorial yigirma to'rt, besh faktorial bir yuz yigirma.",
      'Три факториал шесть, четыре факториал двадцать четыре, пять факториал сто двадцать.',
      'Three factorial is six, four factorial is twenty four, five factorial is one hundred twenty.'),
    A('why',
      "O'nta odamni qatorga terish usullari nechta bo'lar ekan?",
      'А сколько способов расставить в ряд десять человек?',
      'And how many ways are there to line up ten people?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('3! = 6,  4! = 24,  5! = 120', '3! = 6,  4! = 24,  5! = 120', '3! = 6,  4! = 24,  5! = 120')}
      steps={[
        { id: 'a', head: L('Oltita odam', 'Шесть человек', 'Six people'), lines: ['6! = 720'] },
      ]}
      ask={L(
        "O'nta odam uchun javob taxminan qanday bo'ladi?",
        'Каким будет ответ примерно для десяти человек?',
        'Roughly what is the answer for ten people?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Uch milliondan ortiq', 'Больше трёх миллионов', 'Over three million') },
        {
          id: 'wrong',
          label: L('Bir necha mingta', 'Несколько тысяч', 'A few thousand'),
          hint: L(
            "Oltita odam uchun yetti yuz yigirma edi. Yettinchi odam uni yetti barobar, sakkizinchisi yana sakkiz barobar oshiradi. To'rtta qadamda son tez o'sib ketadi.",
            'Для шести было семьсот двадцать. Седьмой человек умножит это на семь, восьмой ещё на восемь. За четыре шага число разгоняется очень сильно.',
            'Six people gave seven hundred twenty. A seventh multiplies that by seven, an eighth by eight again. Four steps send the number far up.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. O'n faktorial uch million olti yuz yigirma sakkiz ming sakkiz yuzga teng. Shuning uchun bunday masalalarni sanab chiqib bo'lmaydi, faqat hisoblash mumkin.",
        'Верно. Десять факториал равно трём миллионам шестистам двадцати восьми тысячам восьмистам. Поэтому такие задачи нельзя перебрать, только вычислить.',
        'Correct. Ten factorial is three million six hundred twenty eight thousand eight hundred. Such problems cannot be listed out, only computed.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — takror bor yoki yo'q.
// ============================================================
const S7 = {
  eyebrow: L('SHARTNI O\'QING', 'ЧИТАЙ УСЛОВИЕ', 'READ THE CONDITION'),
  title: L(
    "Bitta so'z javobni to'rt barobar o'zgartiradi",
    'Одно слово меняет ответ в четыре раза',
    'One word changes the answer fourfold',
  ),
  audio: [
    A('mount',
      "Bir, ikki va uch raqamlaridan uch xonali son tuziladi. Ikkita shart bo'lishi mumkin.",
      'Из цифр один, два и три составляют трёхзначное число. Условие может быть двояким.',
      'A three digit number is formed from the digits one, two and three. The condition can go two ways.'),
    A('why',
      "Birinchi holda raqamlar takrorlanmaydi, ikkinchisida takrorlanishi mumkin.",
      'В первом случае цифры не повторяются, во втором могут повторяться.',
      'In the first case the digits do not repeat, in the second they may.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1, 2, 3', '1, 2, 3', '1, 2, 3')}
      steps={[
        { id: 'a', head: L('Takrorsiz', 'Без повторений', 'No repeats'), lines: ['3 · 2 · 1 = 6'] },
      ]}
      ask={L(
        "Raqamlar takrorlanishi mumkin bo'lsa, nechta son chiqadi?",
        'Сколько чисел получится, если цифры могут повторяться?',
        'How many numbers arise if the digits may repeat?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '27' },
        {
          id: 'wrong',
          label: '6',
          hint: L(
            "Oltita takrorsiz holatning javobi. Takror bo'lsa har uch o'rinda ham uchta raqamning hammasi qoladi, ya'ni imkoniyat kamaymaydi.",
            'Шесть это ответ для случая без повторений. При повторениях на каждом из трёх мест доступны все три цифры, возможности не убывают.',
            'Six answers the no-repeat case. With repeats all three digits stay available in each of the three places, the options never shrink.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch karra uch karra uch, yigirma yetti. Bir xil raqamlar, bir xil savol, lekin shart boshqa va javob to'rt barobardan ham ko'proq farq qiladi.",
        'Верно. Три на три на три, двадцать семь. Те же цифры, тот же вопрос, но условие другое, и ответ отличается больше чем в четыре раза.',
        'Correct. Three times three times three is twenty seven. Same digits, same question, but a different condition and an answer over four times larger.',
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
    "Reja bo'yicha 31-dars; darslikda alohida paragraf yo'q, tayanch 35-§ (470-mashq)",
    'Урок 31 по плану; отдельного параграфа в учебнике нет, опора на §35 (упр. 470)',
    'Lesson 31 by the plan; the textbook has no separate section, based on §35 (ex. 470)',
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
          "Ketma-ket tanlovlar imkoniyatlari bilan nima qilinadi?",
          'Что делают с возможностями последовательных выборов?',
          'What is done with the counts of successive choices?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ular ko'paytiriladi", 'Их умножают', 'They are multiplied'),
          },
          {
            id: 'wrong',
            label: L("Ular qo'shiladi", 'Их складывают', 'They are added'),
            hint: L(
              "3-ekrandagi daraxtni eslang: uchta taom va ikkita ichimlikda beshta emas, oltita yo'l chiqqandi.",
              'Вспомни дерево с 3 экрана: при трёх блюдах и двух напитках вышло не пять путей, а шесть.',
              'Recall the tree on screen three: three dishes and two drinks gave six paths, not five.',
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
    "Ko'paytirish, faktorial va shart",
    'Умножение, факториал и условие',
    'Multiplying, the factorial, and the condition',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz daraxtni ochdingiz, qoidani uchta tanlovga kengaytirdingiz va takror shartining kuchini ko'rdingiz.",
      'На семи экранах ты раскрыл дерево, распространил правило на три выбора и увидел силу условия о повторениях.',
      'On seven screens you opened the tree, extended the rule to three choices, and saw how much the repeat condition matters.'),
    W('card',
      "Qoida ochildi.",
      'Правило открылось.',
      'The rule is open.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: ko'paytirish qoidasi.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Ko'paytirish qoidasi",
    'Правило умножения',
    'The multiplication rule',
  ),
  audio: [
    A('mount',
      "Uchta masala. Har birida ketma-ket tanlovlar bor.",
      'Три задачи. В каждой есть последовательные выборы.',
      'Three problems. Each has successive choices.'),
    A('why',
      "Har bir tanlovning imkoniyatini alohida sanang, keyin ko'paytiring.",
      'Сосчитай возможности каждого выбора отдельно, потом перемножь.',
      'Count the options of each choice separately, then multiply.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Tanlovlar soni ortgan sari javob tez o'sadi, chunki har biri ko'paytuvchi bo'lib qo'shiladi.",
      'Все три найдены. Чем больше выборов, тем быстрее растёт ответ, ведь каждый добавляется множителем.',
      'All three are found. The more choices, the faster the answer grows, since each joins as a factor.',
    ),
    tasks: [
      {
        expr: '5,  3',
        question: L(
          "Oshxonada beshta salat va uchta sho'rva bor. Bittadan salat va sho'rva nechta usulda tanlanadi?",
          'В столовой пять салатов и три супа. Сколькими способами выбрать один салат и один суп?',
          'A canteen has five salads and three soups. In how many ways can one of each be chosen?',
        ),
        ok: L("Ha. Besh karra uch, o'n besh.", 'Да. Пять на три, пятнадцать.', 'Yes. Five times three is fifteen.'),
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '8', hint: L("Sakkiz bu taomlarning umumiy soni. Savol esa juftliklar haqida, ularning soni ko'proq.", 'Восемь это общее число блюд. А вопрос про пары, их больше.', 'Eight is the total number of dishes. The question asks about pairs, and there are more of those.') },
        ],
        solution: ['5 · 3 = 15'],
      },
      {
        expr: '2,  6',
        question: L(
          "Tanga tashlanadi va kubik otiladi. Nechta har xil natija bo'lishi mumkin?",
          'Бросают монету и кубик. Сколько разных исходов возможно?',
          'A coin is tossed and a die is rolled. How many different outcomes are possible?',
        ),
        ok: L("Ha. Ikki karra olti, o'n ikki.", 'Да. Два на шесть, двенадцать.', 'Yes. Two times six is twelve.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '8', hint: L("Sakkiz ikki va oltini qo'shganda chiqadi. Lekin tanganing har bir tomoniga kubikning oltita natijasi mos keladi.", 'Восемь выходит при сложении двух и шести. Но каждой стороне монеты отвечают шесть исходов кубика.', 'Eight comes from adding two and six. But each side of the coin pairs with six die outcomes.') },
        ],
        solution: ['2 · 6 = 12'],
      },
      {
        expr: '4,  3,  2',
        question: L(
          "Shahardan qishloqqa to'rtta yo'l, qishloqdan ko'lga uchta, ko'ldan tog'ga ikkita yo'l bor. Nechta marshrut chiqadi?",
          'Из города в село ведут четыре дороги, из села к озеру три, от озера к горе две. Сколько выйдет маршрутов?',
          'Four roads run from the town to the village, three from the village to the lake, two from the lake to the mountain. How many routes are there?',
        ),
        ok: L("Ha. To'rt karra uch karra ikki, yigirma to'rt.", 'Да. Четыре на три на два, двадцать четыре.', 'Yes. Four times three times two is twenty four.'),
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '9', hint: L("To'qqiz uchta sonni qo'shganda chiqadi. Marshrut esa uchta qismdan iborat va har bir qism ko'paytuvchi bo'ladi.", 'Девять выходит при сложении трёх чисел. А маршрут состоит из трёх участков, и каждый становится множителем.', 'Nine comes from adding the three numbers. A route has three legs and each becomes a factor.') },
        ],
        solution: ['4 · 3 · 2 = 24'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: faktorial.
// ============================================================
const S10 = {
  eyebrow: L('FAKTORIAL', 'ФАКТОРИАЛ', 'THE FACTORIAL'),
  title: L(
    "Qatorga terish",
    'Расставить в ряд',
    'Lining things up',
  ),
  audio: [
    A('mount',
      "Uchta masala. Har birida narsalar qatorga teriladi va takrorlanish yo'q.",
      'Три задачи. В каждой предметы ставятся в ряд, и повторений нет.',
      'Three problems. In each, items are lined up and there are no repeats.'),
    A('why',
      "Har qadamda imkoniyat bittaga kamayadi.",
      'На каждом шаге возможностей становится на одну меньше.',
      'At each step there is one option fewer.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Faktorial ko'paytmasi birgacha tushib boradi, chunki har qadamda bitta narsa o'z joyini egallaydi.",
      'Все три найдены. Произведение факториала спускается до единицы, ведь на каждом шаге один предмет занимает своё место.',
      'All three are found. The factorial product runs down to one, since each step fixes one item in place.',
    ),
    tasks: [
      {
        expr: '4!',
        question: L(
          "To'rtta kitobni javonga nechta usulda terish mumkin?",
          'Сколькими способами расставить четыре книги на полке?',
          'In how many ways can four books be arranged on a shelf?',
        ),
        ok: L("Ha. To'rt karra uch karra ikki karra bir, yigirma to'rt.", 'Да. Четыре на три на два на один, двадцать четыре.', 'Yes. Four times three times two times one is twenty four.'),
        items: [
          { id: 'a', right: true, label: '24' },
          { id: 'b', label: '16', hint: L("O'n olti to'rtni to'rtga ko'paytirganda chiqadi, ya'ni takrorlanishga ruxsat berilganda. Kitob esa bitta, uni ikki joyga qo'yib bo'lmaydi.", 'Шестнадцать выходит при умножении четырёх на четыре, то есть если разрешить повторения. А книга одна, на два места её не поставить.', 'Sixteen comes from four times four, that is with repeats allowed. A book is single and cannot occupy two places.') },
        ],
        solution: ['4! = 4 · 3 · 2 · 1', '4! = 24'],
      },
      {
        expr: '5!',
        question: L(
          "Beshta yuguruvchi marradan o'tdi. Ular nechta xil tartibda kelishi mumkin edi?",
          'Пять бегунов пришли к финишу. В скольких разных порядках они могли прийти?',
          'Five runners crossed the finish. In how many different orders could they arrive?',
        ),
        ok: L("Ha. Bir yuz yigirma. Beshinchi yuguruvchi javobni besh barobar oshirdi.", 'Да. Сто двадцать. Пятый бегун увеличил ответ в пять раз.', 'Yes. One hundred twenty. The fifth runner multiplied the answer by five.'),
        items: [
          { id: 'a', right: true, label: '120' },
          { id: 'b', label: '25', hint: L("Yigirma besh beshni beshga ko'paytirganda chiqadi. Faktorialda esa ko'paytuvchilar kamayib boradi va ularning soni beshta.", 'Двадцать пять выходит при умножении пяти на пять. А в факториале множители убывают, и их пять.', 'Twenty five comes from five times five. In a factorial the factors descend and there are five of them.') },
        ],
        solution: ['5! = 5 · 4 · 3 · 2 · 1', '5! = 120'],
      },
      {
        expr: '6! : 5!',
        question: L(
          "Olti faktorialni besh faktorialga bo'lsak, nima chiqadi?",
          'Что получится, если шесть факториал разделить на пять факториал?',
          'What comes out of six factorial divided by five factorial?',
        ),
        ok: L("Ha, olti. Olti faktorial bu besh faktorialni oltiga ko'paytirgan, demak bo'lganda faqat olti qoladi.", 'Да, шесть. Шесть факториал это пять факториал на шесть, значит при делении остаётся только шесть.', 'Yes, six. Six factorial is five factorial times six, so dividing leaves just six.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '1', hint: L("Bir ular teng bo'lganda chiqardi. Olti faktorial esa besh faktorialdan olti barobar katta.", 'Единица вышла бы при их равенстве. А шесть факториал в шесть раз больше пяти факториал.', 'One would need them to be equal. Six factorial is six times larger than five factorial.') },
        ],
        solution: ['6! = 6 · 5!', '6! : 5! = 6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — takror bor yoki yo'q.
// ============================================================
const S11 = {
  eyebrow: L('IKKI XIL SHART', 'ДВА РАЗНЫХ УСЛОВИЯ', 'TWO DIFFERENT CONDITIONS'),
  title: L(
    "Bir xil raqamlar, boshqa javoblar",
    'Одинаковые цифры, разные ответы',
    'The same digits, different answers',
  ),
  audio: [
    A('mount',
      "Ikkita masala bir xil ko'rinadi, lekin shartlari boshqa.",
      'Две задачи выглядят одинаково, но условия у них разные.',
      'Two problems look the same but their conditions differ.'),
    A('why',
      "Har safar shuni so'rang. Tanlangan narsa qaytadimi yoki yo'qmi.",
      'Каждый раз спрашивай себя. Возвращается выбранное или нет.',
      'Each time ask whether what is chosen comes back or not.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi. Takrorlanishga ruxsat bo'lsa har o'rinda imkoniyat to'liq qoladi, bo'lmasa u har qadamda kamayadi.",
      'Обе найдены. Если повторения разрешены, на каждом месте возможности сохраняются целиком, иначе они убывают с каждым шагом.',
      'Both are found. With repeats allowed the options stay whole at every place, otherwise they drop with each step.',
    ),
    tasks: [
      {
        expr: '1, 2, 3, 4',
        question: L(
          "Bu raqamlardan ikki xonali, raqamlari TAKRORLANMAYDIGAN son nechta tuziladi?",
          'Сколько двузначных чисел с НЕПОВТОРЯЮЩИМИСЯ цифрами можно составить из этих цифр?',
          'How many two digit numbers with NO REPEATED digits can be formed from these?',
        ),
        ok: L("Ha. Birinchi o'ringa to'rtta, ikkinchisiga uchta, jami o'n ikkita.", 'Да. На первое место четыре, на второе три, всего двенадцать.', 'Yes. Four for the first place, three for the second, twelve in all.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '16', hint: L("O'n olti takrorga ruxsat berilganda chiqadi. Bu masalada esa raqam ikkinchi marta ishlatilmaydi.", 'Шестнадцать выходит при разрешённых повторениях. А здесь цифра второй раз не используется.', 'Sixteen arises when repeats are allowed. Here a digit cannot be used twice.') },
        ],
        solution: ['4 · 3 = 12'],
      },
      {
        expr: '1, 2, 3, 4',
        question: L(
          "O'sha raqamlardan ikki xonali, raqamlari TAKRORLANISHI MUMKIN bo'lgan son nechta tuziladi?",
          'Сколько двузначных чисел с ВОЗМОЖНЫМИ повторениями цифр можно составить из тех же цифр?',
          'How many two digit numbers WITH repeats allowed can be formed from the same digits?',
        ),
        ok: L("Ha. Har ikkala o'ringa ham to'rttadan, jami o'n oltita.", 'Да. На оба места по четыре, всего шестнадцать.', 'Yes. Four for each of the two places, sixteen in all.'),
        items: [
          { id: 'a', right: true, label: '16' },
          { id: 'b', label: '12', hint: L("O'n ikki takrorsiz holatning javobi edi. Endi esa o'n bir yoki yigirma ikki kabi sonlar ham hisobga olinadi.", 'Двенадцать было ответом для случая без повторений. Теперь считаются и числа вроде одиннадцати или двадцати двух.', 'Twelve answered the no-repeat case. Now numbers like eleven or twenty two count too.') },
        ],
        solution: ['4 · 4 = 16'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — shartni o'qimaslik.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Formula to'g'ri, shart o'qilmagan",
    'Формула верна, условие не прочитано',
    'The formula is right, the condition unread',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Bir, ikki, uch raqamlaridan uch xonali son tuziladi va raqamlar takrorlanishi mumkin. U uch faktorialni olib, oltita deb javob bergan.",
      'Решение Камрона. Из цифр один, два, три составляют трёхзначное число, и цифры могут повторяться. Он взял три факториал и ответил шесть.',
      "Kamron's solution. A three digit number is formed from one, two, three, and the digits may repeat. He took three factorial and answered six."),
    A('why',
      "Uch faktorial haqiqatan ham oltiga teng. Lekin bu formula qaysi holat uchun edi?",
      'Три факториал действительно равно шести. Но для какого случая была эта формула?',
      'Three factorial really is six. But which case was that formula for?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamron hisobda emas, o'qishda xato qilgan. Kombinatorikada eng ko'p uchraydigan xato aynan shunday: formula to'g'ri eslanadi, lekin boshqa shart uchun.",
      'Камрон ошибся не в счёте, а в чтении. Самая частая ошибка в комбинаторике именно такая: формула вспомнена верно, но для другого условия.',
      'Kamron erred in reading, not in arithmetic. The commonest slip in combinatorics is exactly this: the formula is recalled correctly but for another condition.',
    ),
    tasks: [
      {
        expr: '1, 2, 3   →   3! = 6 ?',
        question: L(
          "Raqamlar takrorlanishi mumkin. To'g'ri javob qanday?",
          'Цифры могут повторяться. Каков верный ответ?',
          'The digits may repeat. What is the right answer?',
        ),
        ok: L(
          "To'g'ri, yigirma yetti. Faktorial takrorlanmaydigan holat uchun, bu yerda esa har o'rinda uchta raqamning hammasi qoladi.",
          'Верно, двадцать семь. Факториал для случая без повторений, а здесь на каждом месте доступны все три цифры.',
          'Correct, twenty seven. The factorial is for the no-repeat case, while here all three digits stay available in each place.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L('27, chunki takrorga ruxsat bor', '27, ведь повторения разрешены', '27, since repeats are allowed'),
          },
          {
            id: 'b',
            label: L("6, Kamron to'g'ri qilgan", '6, Камрон прав', '6, Kamron is right'),
            hint: L(
              "Bir yuz o'n bir soni ham shartga to'g'ri keladi. U oltitalik ro'yxatda bormi? Yo'q, chunki u yerda raqamlar takrorlanmasligi kerak edi.",
              'Число сто одиннадцать тоже подходит под условие. Есть ли оно в списке из шести? Нет, ведь там цифры не должны повторяться.',
              'The number one hundred eleven also fits the condition. Is it in the list of six? No, because there the digits could not repeat.',
            ),
          },
        ],
        solution: [
          '3 · 3 · 3 = 27',
          L('Kamron: 3! = 6 (takrorsiz)', 'Камрон: 3! = 6 (без повторений)', 'Kamron: 3! = 6 (no repeats)'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — kombinatorika ehtimollikka qaytadi.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Nima uchun bularni sanagandik",
    'Зачем мы всё это считали',
    'Why all this counting was for',
  ),
  audio: [
    A('mount',
      "O'tgan darsda ehtimollik m bo'lingan n edi. Endi n ni sanashni bilamiz.",
      'На прошлом уроке вероятность была m делить на n. Теперь мы умеем считать n.',
      'Last lesson the probability was m over n. Now we can count n.'),
    A('why',
      "Bir, ikki, uch raqamlari tasodifiy tartibda teriladi.",
      'Цифры один, два, три расставляют в случайном порядке.',
      'The digits one, two, three are put in a random order.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Mana nima uchun kombinatorika kerak edi. Ehtimollik formulasining maxrajida turgan son ko'pincha shunchaki berilmaydi, uni sanab topish kerak.",
      'Вот зачем нужна комбинаторика. Число в знаменателе формулы вероятности часто просто не дано, его нужно сосчитать.',
      'This is what combinatorics was for. The number in the denominator of the probability formula is often not given at all and has to be counted.',
    ),
    tasks: [
      {
        expr: '1, 2, 3   →   P(123) = ?',
        question: L(
          "Aynan 123 soni chiqish ehtimolligi qanday?",
          'Какова вероятность получить ровно число 123?',
          'What is the probability of getting exactly 123?',
        ),
        ok: L(
          "Ha, bir oltidan. Qulay natija bitta, hammasi olti faktorialdan olti.",
          'Да, одна шестая. Благоприятный исход один, всего шесть по факториалу.',
          'Yes, one sixth. One favourable outcome out of the six the factorial gives.',
        ),
        items: [
          { id: 'a', right: true, label: 'P = 1/6' },
          { id: 'b', label: 'P = 1/3', hint: L("Bir uchdan uchta natija bo'lganda chiqardi. Raqamlar esa oltita xil tartibda terilishi mumkin.", 'Одна третья вышла бы при трёх исходах. А цифры можно расставить шестью разными способами.', 'One third would need three outcomes. The digits can be ordered in six different ways.') },
        ],
        solution: ['n = 3! = 6,  m = 1', 'P = 1/6'],
      },
      {
        expr: '1, 2, 3   →   P(111) = ?',
        question: L(
          "Endi raqamlar takrorlanishi mumkin. 111 chiqish ehtimolligi qanday?",
          'Теперь цифры могут повторяться. Какова вероятность получить 111?',
          'Now the digits may repeat. What is the probability of getting 111?',
        ),
        ok: L(
          "Ha, bir yigirma yettidan. Natijalar soni o'zgardi, shuning uchun ehtimollik ham o'zgardi.",
          'Да, одна двадцать седьмая. Число исходов изменилось, поэтому изменилась и вероятность.',
          'Yes, one twenty seventh. The number of outcomes changed, so the probability changed with it.',
        ),
        items: [
          { id: 'a', right: true, label: 'P = 1/27' },
          { id: 'b', label: 'P = 1/6', hint: L("Bir oltidan avvalgi shartning javobi. Takrorga ruxsat berilgach natijalar yigirma yettita bo'ldi, maxraj esa aynan shu son.", 'Одна шестая это ответ прошлого условия. С разрешёнными повторениями исходов стало двадцать семь, и знаменатель именно это число.', 'One sixth answered the previous condition. With repeats there are twenty seven outcomes, and that is the denominator.') },
        ],
        solution: ['n = 3³ = 27,  m = 1', 'P = 1/27'],
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
    "Blits: amal, faktorial, shart",
    'Блиц: действие, факториал, условие',
    'Blitz: operation, factorial, condition',
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
        tag: 'qoshish-korpaytirish-orniga',
        ask: L(
          "Ketma-ket ikkita tanlov bor. Imkoniyatlar bilan nima qilinadi?",
          'Есть два выбора подряд. Что делают с возможностями?',
          'There are two successive choices. What is done with the counts?',
        ),
        options: [
          { id: 'mul', right: true, label: L("Ko'paytiriladi", 'Умножают', 'They are multiplied') },
          { id: 'add', label: L("Qo'shiladi", 'Складывают', 'They are added') },
        ],
        ok: L(
          "To'g'ri. Birinchi tanlovning har bir shoxidan ikkinchisining hammasi chiqadi.",
          'Верно. Из каждой ветви первого выбора выходят все ветви второго.',
          'Correct. Every branch of the first choice grows all the branches of the second.',
        ),
        hint: L(
          "1-ekranni eslang: uchta futbolka va to'rtta yubkada yettita emas, o'n ikkita to'plam chiqqandi.",
          'Вспомни 1 экран: три футболки и четыре юбки дали не семь нарядов, а двенадцать.',
          'Recall screen 1: three tops and four skirts gave twelve outfits, not seven.',
        ),
      },
      {
        id: 'q2',
        tag: 'faktorialni-notogri',
        ask: L(
          "To'rt faktorial nechaga teng?",
          'Чему равно четыре факториал?',
          'What does four factorial equal?',
        ),
        options: [
          { id: 'r', right: true, label: '24' },
          { id: 'w', label: '16' },
        ],
        ok: L(
          "To'g'ri. To'rt karra uch karra ikki karra bir.",
          'Верно. Четыре на три на два на один.',
          'Correct. Four times three times two times one.',
        ),
        hint: L(
          "10-ekranni eslang: o'n olti to'rtni to'rtga ko'paytirganda chiqadi, faktorialda esa ko'paytuvchilar kamayib boradi.",
          'Вспомни 10 экран: шестнадцать выходит при умножении четырёх на четыре, а в факториале множители убывают.',
          'Recall screen 10: sixteen comes from four times four, while a factorial descends.',
        ),
      },
      {
        id: 'q3',
        tag: 'takror-shartini-oqimaslik',
        ask: L(
          "Takrorlanishga ruxsat berilsa, javob qanday o'zgaradi?",
          'Как меняется ответ, если разрешить повторения?',
          'How does the answer change when repeats are allowed?',
        ),
        options: [
          { id: 'more', right: true, label: L('Kattalashadi', 'Увеличивается', 'It grows') },
          { id: 'same', label: L("O'zgarmaydi", 'Не меняется', 'It stays the same') },
        ],
        ok: L(
          "To'g'ri. Har o'rinda imkoniyatlar kamaymaydi, shuning uchun ko'paytma kattaroq chiqadi.",
          'Верно. На каждом месте возможности не убывают, поэтому произведение выходит больше.',
          'Correct. The options never drop at any place, so the product comes out larger.',
        ),
        hint: L(
          "7-ekranni eslang: bir, ikki, uch raqamlarida takrorsiz oltita, takror bilan yigirma yettita son chiqqandi.",
          'Вспомни 7 экран: из цифр один, два, три без повторений вышло шесть чисел, с повторениями двадцать семь.',
          'Recall screen 7: the digits one, two, three gave six numbers without repeats and twenty seven with them.',
        ),
      },
      {
        id: 'q4',
        tag: 'sanoqni-ehtimollikka-ulamaslik',
        ask: L(
          "Kombinatorika ehtimollikda qaysi son uchun kerak?",
          'Для какого числа комбинаторика нужна в вероятности?',
          'Which number in a probability does combinatorics supply?',
        ),
        options: [
          { id: 'both', right: true, label: L('Ikkalasi uchun ham', 'Для обоих', 'For both of them') },
          { id: 'm', label: L('Faqat surat uchun', 'Только для числителя', 'For the numerator only') },
        ],
        ok: L(
          "To'g'ri. Qulay natijalarni ham, barcha natijalarni ham sanash kerak bo'ladi.",
          'Верно. Считать приходится и благоприятные исходы, и все исходы.',
          'Correct. Both the favourable outcomes and all the outcomes need counting.',
        ),
        hint: L(
          "13-ekranni eslang: u yerda maxraj olti va yigirma yetti kombinatorika bilan topilgandi.",
          'Вспомни 13 экран: там знаменатели шесть и двадцать семь были найдены комбинаторикой.',
          'Recall screen 13: the denominators six and twenty seven came from combinatorics.',
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
    "Sanashning o'z qoidalari bor",
    'У счёта есть свои правила',
    'Counting has its own rules',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda uchta futbolka va to'rtta yubka yettita emas, o'n ikkita to'plam bergandi.",
      'На первом экране три футболки и четыре юбки дали не семь нарядов, а двенадцать.',
      'On the first screen three tops and four skirts gave twelve outfits, not seven.'),
    A('s1',
      "Siz ko'paytirish qoidasini daraxtda ko'rdingiz, faktorialni chiqardingiz va takror shartining kuchini sinadingiz.",
      'Ты увидел правило умножения на дереве, вывел факториал и проверил силу условия о повторениях.',
      'You saw the multiplication rule on a tree, derived the factorial, and tested the weight of the repeat condition.'),
    A('s2',
      "Keyingi darsda ehtimollikka oid masalalar.",
      'В следующем уроке задачи на вероятность.',
      'The next lesson covers probability problems.'),
  ],
  props: {
    mark: 'n! = n · (n − 1) · ... · 1',
    markNote: L(
      "takrorlanmaydigan holat uchun",
      'для случая без повторений',
      'for the case without repeats',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: ehtimollikka oid masalalar',
      'Следующий урок: задачи на вероятность',
      'Next lesson: probability problems',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'qoshish-korpaytirish-orniga', ...S2 },
  { role: 'explain',  tool: 'tree', tag: 'qoshish-korpaytirish-orniga', ...S3 },
  { role: 'explain',  tag: 'qoshish-korpaytirish-orniga', ...S4 },
  { role: 'explain',  tag: 'faktorialni-notogri', ...S5 },
  { role: 'explain',  tag: 'faktorialni-notogri', ...S6 },
  { role: 'explain',  tag: 'takror-shartini-oqimaslik', ...S7 },
  { role: 'rule',     tag: 'qoshish-korpaytirish-orniga', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-korpaytirish-orniga', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'faktorialni-notogri', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'takror-shartini-oqimaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'takror-shartini-oqimaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'sanoqni-ehtimollikka-ulamaslik', ...S13 },
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
