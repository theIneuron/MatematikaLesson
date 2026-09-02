// ============================================================================
// 9-sinf, Dars 44. AYLANA UZUNLIGI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 42-dars (116-117-bet).
//   Faollashtiruvchi mashq (116-bet): quvurni ip bilan bir marta o'rash,
//       ipni chizg'ich bilan o'lchash, uzunlikning diametrga nisbatini
//       hisoblash va turli quvurlarda takrorlash.
//   Teorema (116-bet): aylana uzunligining diametrga nisbati radiusga
//       bog'liq emas. Isbot ichki chizilgan muntazam n-burchak orqali:
//       P = n · 2R · sin(180°/n), demak P₁/P₂ = R₁/R₂ har qanday n da,
//       n o'sganda esa P aylana uzunligiga yaqinlashadi.
//   π (117-bet): nisbatning o'zi. Belgini Leonard Eyler kiritgan,
//       son irratsional, amaliyotda 3,1416. Shundan C = 2πR.
//   Masala (117-bet): tomoni 6 bo'lgan muntazam uchburchakka tashqi
//       chizilgan aylana: R = 6/√3 = 2√3, C = 4π√3.
//   42.2: a) R uch marta ortsa, C ham uch marta ortadi; b) R ga 3
//       QO'SHILSA, C ga 6π qo'shiladi — bu boshqa hodisa.
//   42.3: Yer ekvatorining qirq milliondan bir qismi 1 m bo'lsa,
//       C = 40 000 km va R ≈ 6369 km.
//   42.6: teplovoz 1413 m yurdi, g'ildirak 300 marta aylandi →
//       C = 4,71 m, diametr 1,5 m.
//   42.7: g'ildirak radiusi 24 cm, yo'l 100 km → 66 348 marta aylanadi.
//
// DARS 41-DARSGA TAYANADI. U yerda chiqarilgandi: BARCHA aylanalar
// o'zaro o'xshash, chunki aylanani bitta son belgilaydi. O'xshashlikda
// esa mos uzunliklarning nisbati o'zgarmas. Aynan shu sabab π ni
// tug'diradi: uzunlikni diametrga bo'lganda hamma aylanada bir xil son
// chiqadi. Ya'ni π tajribadan emas, o'xshashlikdan kelib chiqadi, va
// 2-ekran shu bog'lanishni ochiq ko'rsatadi.
//
// XUK darslikning tajribasini takrorlaydi: ingichka shisha va katta
// bochka, ikkalasi ham ip bilan o'ralgan. Sonlar butunlay boshqa,
// nisbat esa bir xil.
//
// TUZOQ (12-ekran): radius ORTTIRILGANDA uzunlik necha marta ortadi
// degan savolni radius KO'PAYTIRILGAN holat bilan aralashtirish.
// R uch marta ortsa C ham uch marta ortadi, lekin R ga 3 qo'shilsa
// C ga 6π qo'shiladi — bu ko'paytirish emas.
//
// TRANSFER (13-ekran): 42.3 dan Yer radiusi, keyin mashhur arqon
// masalasi. Ekvator bo'ylab tortilgan arqonga 6,28 metr qo'shilsa,
// arqon yerdan bir metr ko'tariladi — va bu javob Yerning radiusiga
// umuman bog'liq emas, chunki ΔC = 2π · ΔR da R qatnashmaydi.
//
// CHIZMA: `PiStrip` SHU FAYLDA, umumiy qatlamda emas. Sabab: u faqat
// shu darsning bitta g'oyasini ko'rsatadi — diametr aylana uzunligiga
// uch butun bir necha marta joylashishini. Boshqa darsda ishlatilmaydi,
// shuning uchun umumiy qatlamga chiqarilmadi. Uslublar esa sinfning
// mavjud g9-cf- klasslaridan olinadi, yangi CSS yozilmadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-44',
  n: 44,
  row: 44,
  block: 'Б7',
  topic: L('Aylana uzunligi', 'Длина окружности', 'The circumference of a circle'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Aylana uzunligining diametriga nisbati barcha aylanalarda bir xil va u π deb belgilanadi",
    'Отношение длины окружности к диаметру одинаково у всех окружностей и обозначается π',
    'The ratio of circumference to diameter is the same for every circle and is denoted π',
  ),
  L(
    "Radiusi R bo'lgan aylananing uzunligi C = 2πR",
    'Длина окружности радиуса R равна C = 2πR',
    'A circle of radius R has circumference C = 2πR',
  ),
  L(
    "Radius necha marta ortsa, uzunlik ham shuncha marta ortadi",
    'Во сколько раз растёт радиус, во столько же растёт длина',
    'The circumference grows by the same factor as the radius',
  ),
]

export const MISS = {
  'radius-diametr-almashish': {
    what: L(
      "formulaga radius o'rniga diametr qo'yildi",
      'в формулу вместо радиуса подставлен диаметр',
      'the diameter was put into the formula in place of the radius',
    ),
    wrong: null,
    at: 0,
  },
  'qoshish-kopaytirish-farqi': {
    what: L(
      "radiusga son QO'SHILGANI uni KO'PAYTIRISH bilan aralashtirildi",
      'ПРИБАВЛЕНИЕ числа к радиусу перепутано с УМНОЖЕНИЕМ',
      'ADDING to the radius was confused with MULTIPLYING it',
    ),
    wrong: null,
    at: 0,
  },
  'pi-taxminiy-emas': {
    what: L(
      "π aniq son deb olindi, uch butun o'n to'rt yuzdan esa taqribiy qiymat",
      'π принято за точное число, а три и четырнадцать сотых лишь приближение',
      'π was taken as exact, while three point one four is only an approximation',
    ),
    wrong: null,
    at: 0,
  },
  'nisbat-radiusga-bogliq': {
    what: L(
      "nisbat aylananing kattaligiga bog'liq deb o'ylandi",
      'решено, что отношение зависит от размера окружности',
      'the ratio was thought to depend on the size of the circle',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// CHIZMA (faqat shu dars uchun): diametr aylana uzunligiga necha
// marta joylashishi. Chapda aylana, o'ngda yoyilgan uzunlik va uning
// tagida uchta to'liq diametr hamda kichkina qoldiq.
// ============================================================
function PiStrip({ showParts = true }) {
  const W = 300, H = 150
  const R = 26, CX = 44, CY = 46
  const d = 2 * R                 // diametr
  const x0 = 18, y = 104
  const total = 3.1416 * d        // yoyilgan uzunlik
  const k = 254 / total           // ekranga sig'dirish
  const seg = d * k
  const parts = [0, 1, 2].map((i) => ({ x: x0 + i * seg, w: seg }))
  const tail = { x: x0 + 3 * seg, w: 0.1416 * d * k }
  return (
    <div className="g9-cf-wrap">
      <svg className="g9-cf-svg" viewBox={'0 0 ' + W + ' ' + H} role="img">
        <circle cx={CX} cy={CY} r={R} className="g9-cf-circle" />
        <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} className="g9-cf-chord" />
        <text x={CX} y={CY - 5} className="g9-pf-seg" textAnchor="middle">d</text>
        <line x1={x0} y1={y - 16} x2={x0 + total * k} y2={y - 16} className="g9-cf-chord" />
        <text x={x0 + (total * k) / 2} y={y - 21} className="g9-pf-seg" textAnchor="middle">C</text>
        {showParts ? (
          <g>
            {parts.map((p, i) => (
              <g key={'p' + i}>
                <line x1={p.x} y1={y} x2={p.x + p.w - 2} y2={y} className="g9-af-vec" />
                <text x={p.x + p.w / 2} y={y + 12} className="g9-pf-seg" textAnchor="middle">d</text>
              </g>
            ))}
            <line x1={tail.x} y1={y} x2={tail.x + tail.w} y2={y} className="g9-af-arc" />
            <text x={tail.x + tail.w / 2 + 12} y={y + 12} className="g9-pf-seg" textAnchor="middle">0,14 d</text>
          </g>
        ) : null}
      </svg>
    </div>
  )
}

// ============================================================
// EKRAN 1. XUK — ikkita idish, bitta nisbat.
// ============================================================
const S1 = {
  eyebrow: L('IP BILAN O\'LCHASH', 'ИЗМЕРЕНИЕ НИТКОЙ', 'MEASURING WITH A THREAD'),
  title: L(
    "Ikkita idish, ikkita ip, bitta son",
    'Два сосуда, две нитки, одно число',
    'Two vessels, two threads, one number',
  ),
  audio: [
    A('mount',
      "Shisha diametri sakkiz santimetr, uni o'ragan ip yigirma besh butun bir o'ndan santimetr. Bochka diametri oltmish, ipi bir yuz sakson sakkiz butun besh o'ndan.",
      'Диаметр бутылки восемь сантиметров, обмотавшая её нитка двадцать пять целых одна десятая. У бочки диаметр шестьдесят, нитка сто восемьдесят восемь целых пять десятых.',
      'The bottle is eight centimetres across and its thread twenty five point one. The barrel is sixty across and its thread one hundred eighty eight point five.'),
    A('why',
      "Sonlar butunlay boshqa. Endi har birini o'z diametriga bo'lib ko'ring.",
      'Числа совсем разные. Теперь раздели каждое на свой диаметр.',
      'The numbers are wholly different. Now divide each by its own diameter.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PiStrip />}
      intro={L(
        '25,1 : 8      va      188,5 : 60',
        '25,1 : 8      и      188,5 : 60',
        '25.1 : 8      and      188.5 : 60',
      )}
      steps={[]}
      ask={L(
        "Bu ikkita nisbat haqida nima deyish mumkin?",
        'Что можно сказать об этих двух отношениях?',
        'What can be said about these two ratios?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L(
            "Ikkalasi ham uch butun o'n to'rt yuzdanga teng",
            'Оба равны трём целым четырнадцати сотым',
            'Both equal three point one four',
          ),
        },
        {
          id: 'wrong',
          label: L(
            "Bochkaniki kattaroq, chunki bochka katta",
            'У бочки больше, ведь бочка больше',
            'The barrel gives more, since the barrel is bigger',
          ),
          hint: L(
            "Ip ham, diametr ham birdek ortgan. Bo'linmada esa ikkala son ham ortsa, natija o'zgarmaydi.",
            'И нитка, и диаметр выросли одинаково. А в частном рост обоих чисел результат не меняет.',
            'Both the thread and the diameter grew alike. In a quotient a matching growth leaves the result alone.',
          ),
        },
      ]}
      after={L(
        "Ha, ikkalasi ham bir xil. Bu son shunchalik muhimki, unga alohida harf berilgan. Bugun nega u har doim bir xil ekanini ko'ramiz.",
        'Да, оба одинаковы. Это число настолько важно, что ему дали отдельную букву. Сегодня увидим, почему оно всегда одно и то же.',
        'Yes, both are the same. That number matters so much it was given its own letter. Today we see why it never changes.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — 41-darsdan: barcha aylanalar o'xshash.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Barcha aylanalar o'xshash edi",
    'Все окружности были подобны',
    'All circles were similar',
  ),
  audio: [
    A('mount',
      "41-darsda chiqargandik: istalgan ikkita aylana gomotetik, ya'ni o'xshash. Koeffitsient radiuslar nisbatiga teng edi.",
      'На 41 уроке мы вывели: любые две окружности гомотетичны, то есть подобны. Коэффициент равнялся отношению радиусов.',
      'In lesson 41 we found any two circles are homothetic, hence similar. The factor equalled the ratio of the radii.'),
    A('why',
      "O'xshashlikda barcha uzunliklar bitta koeffitsientga ko'paytiriladi.",
      'При подобии все длины умножаются на один и тот же коэффициент.',
      'Under similarity every length is multiplied by the same factor.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Ikkinchi aylana birinchisidan k marta katta",
        'Вторая окружность в k раз больше первой',
        'The second circle is k times the first',
      )}
      steps={[]}
      ask={L(
        "Uning uzunligi necha marta katta bo'ladi?",
        'Во сколько раз больше будет её длина?',
        'By what factor is its circumference larger?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('k marta', 'В k раз', 'By k') },
        {
          id: 'wrong',
          label: L('k kvadrat marta', 'В k квадрат раз', 'By k squared'),
          hint: L(
            "k kvadrat yuzlarga tegishli edi. Uzunlik esa bir o'lchamli, u oddiy k marta o'zgaradi.",
            'k квадрат относился к площадям. А длина одномерна, она меняется просто в k раз.',
            'k squared belonged to areas. A length is one dimensional and changes simply by k.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Demak uzunlik ham, diametr ham bir xil k marta ortadi, ularning nisbati esa o'zgarmaydi. Bugungi darsning butun siri shu.",
        'Верно. Значит и длина, и диаметр растут в одно и то же k раз, а их отношение не меняется. В этом весь секрет сегодняшнего урока.',
        'Correct. So both the circumference and the diameter grow by the same k, and their ratio stays put. That is the whole secret of today.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — teorema va uning isboti.
// ============================================================
const S3 = {
  eyebrow: L('ICHKI KO\'PBURCHAK', 'ВПИСАННЫЙ МНОГОУГОЛЬНИК', 'AN INSCRIBED POLYGON'),
  title: L(
    "Aylanani ko'pburchak bilan yaqinlashtirish",
    'Приближение окружности многоугольником',
    'Approximating a circle by a polygon',
  ),
  audio: [
    A('mount',
      "Darslik nisbatning o'zgarmasligini ichki chizilgan muntazam ko'pburchak orqali isbotlaydi. Uning perimetri n karra ikki R karra sinus yuz sakson bo'lingan n ga teng.",
      'Учебник доказывает постоянство отношения через вписанный правильный многоугольник. Его периметр равен n на два R на синус ста восьмидесяти делить на n.',
      'The textbook proves the ratio constant through an inscribed regular polygon. Its perimeter is n times two R times the sine of one hundred eighty over n.'),
    A('why',
      "Bu ifodada R faqat ko'paytuvchi sifatida turibdi, qolgani esa faqat n ga bog'liq.",
      'В этом выражении R стоит только множителем, а остальное зависит только от n.',
      'In that expression R appears only as a factor, while the rest depends only on n.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('P = n · 2R · sin (180° / n)', 'P = n · 2R · sin (180° / n)', 'P = n · 2R · sin (180° / n)')}
      steps={[]}
      ask={L(
        "Ikkita aylanaga bir xil n bilan ko'pburchak chizilsa, perimetrlarning nisbati nimaga teng?",
        'Если в две окружности вписать многоугольники с одинаковым n, чему равно отношение периметров?',
        'With the same n inscribed in two circles, what is the ratio of the perimeters?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Radiuslar nisbatiga', 'Отношению радиусов', 'The ratio of the radii') },
        {
          id: 'wrong',
          label: L("n ga bog'liq", 'Зависит от n', 'It depends on n'),
          hint: L(
            "Nisbatni yozib ko'ring: n ham, sinus ham ikkala perimetrda bir xil, demak ular qisqaradi. Faqat R lar qoladi.",
            'Запиши отношение: и n, и синус одинаковы в обоих периметрах, значит они сократятся. Останутся только R.',
            'Write the ratio: n and the sine are the same in both perimeters, so they cancel. Only the radii remain.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. n o'sganda perimetr aylana uzunligiga yaqinlashadi, nisbat esa o'zgarmagani uchun uzunliklar uchun ham o'sha nisbat qoladi.",
        'Верно. При росте n периметр приближается к длине окружности, а отношение не менялось, поэтому оно остаётся и для длин.',
        'Correct. As n grows the perimeter approaches the circumference, and since the ratio never changed it carries over to the circumferences.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — π va formula.
// ============================================================
const S4 = {
  eyebrow: L('SON π', 'ЧИСЛО π', 'THE NUMBER π'),
  title: L(
    "Nisbatga harf berildi",
    'Отношению дали букву',
    'The ratio was given a letter',
  ),
  audio: [
    A('mount',
      "Uzunlikning diametrga nisbati yunon harfi pi bilan belgilanadi. Bu belgini Leonard Eyler kiritgan.",
      'Отношение длины к диаметру обозначают греческой буквой пи. Это обозначение ввёл Леонард Эйлер.',
      'The ratio of circumference to diameter is written with the Greek letter pi. Leonhard Euler brought in that notation.'),
    A('why',
      "Pi irratsional son, ya'ni uni oddiy kasr bilan yozib bo'lmaydi. Hisobda uch butun bir to'rt bir olti ishlatiladi.",
      'Пи иррационально, то есть обычной дробью его не записать. В счёте берут три целых одна тысяча четыреста шестнадцать десятитысячных.',
      'Pi is irrational, so no ordinary fraction writes it. In practice three point one four one six is used.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={<PiStrip />}
      intro={L('C : 2R = π', 'C : 2R = π', 'C : 2R = π')}
      steps={[]}
      ask={L(
        "Bundan uzunlik uchun qanday formula chiqadi?",
        'Какая формула для длины отсюда следует?',
        'What formula for the circumference follows?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'C = 2πR' },
        {
          id: 'wrong',
          label: 'C = πR',
          hint: L(
            "Nisbatning maxrajida ikki R turibdi, ya'ni diametr. Uni chap tomonga o'tkazganda ikkilik ham ko'chadi.",
            'В знаменателе отношения стоит два R, то есть диаметр. При переносе влево двойка идёт вместе с ним.',
            'The denominator holds two R, the diameter. Moving it across carries the two along.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Diametr orqali esa bu yanada qisqa: C teng pi karra d. Chizmada diametr uzunlikka uch marta va yana biroz joylashgani ko'rinib turibdi.",
        'Верно. Через диаметр это ещё короче: C равно пи на d. На чертеже видно, что диаметр укладывается в длину три раза и ещё немного.',
        'Correct. Through the diameter it is shorter still: C equals pi times d. The drawing shows the diameter fitting three times and a little more.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — to'g'ri va teskari hisob.
// ============================================================
const S5 = {
  eyebrow: L('IKKI TOMONGA', 'В ОБЕ СТОРОНЫ', 'BOTH WAYS'),
  title: L(
    "Radiusdan uzunlikka va aksincha",
    'От радиуса к длине и обратно',
    'From radius to circumference and back',
  ),
  audio: [
    A('mount',
      "Formula ikki tomonga ham ishlaydi. Radius berilsa uzunlik chiqadi, uzunlik berilsa radius.",
      'Формула работает в обе стороны. Дан радиус получаем длину, дана длина получаем радиус.',
      'The formula works both ways. Given the radius we get the circumference, given the circumference the radius.'),
    A('why',
      "Ikkinchi holatda ikki pi ga bo'lish kerak bo'ladi.",
      'Во втором случае придётся делить на два пи.',
      'In the second case we divide by two pi.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('C = 18π', 'C = 18π', 'C = 18π')}
      steps={[
        { id: 'a', head: L('Tenglama', 'Уравнение', 'The equation'), lines: ['2πR = 18π'] },
      ]}
      ask={L(
        "Radius nechaga teng?",
        'Чему равен радиус?',
        'What does the radius equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '9' },
        {
          id: 'wrong',
          label: '18',
          hint: L(
            "Ikkala tomonni pi ga qisqartiring, keyin ikkiga bo'ling. O'n sakkizning yarmi to'qqiz.",
            'Сократи обе части на пи, потом раздели на два. Половина восемнадцати это девять.',
            'Cancel pi on both sides, then divide by two. Half of eighteen is nine.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Pi qisqarib ketdi va javob aniq son bo'lib chiqdi, taqribiy emas. Bu darslikning qirq ikki nuqta birinchi jadvalidan.",
        'Верно. Пи сократилось, и ответ вышел точным, а не приближённым. Это из таблицы сорок два точка один учебника.',
        'Correct. Pi cancelled and the answer came out exact, not approximate. This is from table forty two point one.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — ko'paytirish va qo'shish farqi.
// ============================================================
const S6 = {
  eyebrow: L('IKKI XIL O\'ZGARISH', 'ДВА РАЗНЫХ ИЗМЕНЕНИЯ', 'TWO KINDS OF CHANGE'),
  title: L(
    "Uch marta ortdi yoki uchga ortdi",
    'Выросло в три раза или на три',
    'Grew threefold or grew by three',
  ),
  audio: [
    A('mount',
      "Darslikning qirq ikki nuqta ikkinchi mashqi ikkita o'xshash savol beradi va ular butunlay boshqa javob talab qiladi.",
      'Задача сорок два точка два учебника задаёт два похожих вопроса, а ответы у них совершенно разные.',
      'Exercise forty two point two asks two similar questions whose answers differ entirely.'),
    A('why',
      "Birinchisida radius ko'paytiriladi, ikkinchisida esa unga son qo'shiladi.",
      'В первом радиус умножают, во втором к нему прибавляют число.',
      'In the first the radius is multiplied, in the second a number is added to it.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "Radiusga 3 QO'SHILDI",
        'К радиусу ПРИБАВИЛИ 3',
        'Three was ADDED to the radius',
      )}
      steps={[
        { id: 'a', head: L('Hisob', 'Счёт', 'The count'), lines: ['2π(R + 3) = 2πR + 6π'] },
      ]}
      ask={L(
        "Uzunlik qanday o'zgardi?",
        'Как изменилась длина?',
        'How did the circumference change?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("6π ga ortdi", 'Выросла на 6π', 'It grew by 6π'),
        },
        {
          id: 'wrong',
          label: L('Uch marta ortdi', 'Выросла в три раза', 'It grew threefold'),
          hint: L(
            "Uch marta ortishi uchun radiusning O'ZI uchga ko'paytirilishi kerak edi. Bu yerda esa unga uch qo'shildi.",
            'Чтобы вырасти втрое, САМ радиус нужно было умножить на три. А здесь к нему прибавили три.',
            'To grow threefold the radius ITSELF had to be multiplied by three. Here three was added to it.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qo'shimcha olti pi radiusning kattaligiga umuman bog'liq emas. Bu fakt o'n uchinchi ekranda kutilmagan natija beradi.",
        'Верно. Прибавка шесть пи совсем не зависит от величины радиуса. Этот факт даст неожиданный результат на тринадцатом экране.',
        'Correct. The extra six pi does not depend on the size of the radius at all. That fact gives a surprise on screen thirteen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — teplovoz.
// ============================================================
const S7 = {
  eyebrow: L('G\'ILDIRAK', 'КОЛЕСО', 'A WHEEL'),
  title: L(
    "Bir aylanish bir uzunlik",
    'Один оборот одна длина',
    'One turn, one circumference',
  ),
  audio: [
    A('mount',
      "Teplovoz bir ming to'rt yuz o'n uch metr yo'l yurdi va uning g'ildiragi uch yuz marta aylandi.",
      'Тепловоз проехал тысячу четыреста тринадцать метров, и его колесо сделало триста оборотов.',
      'A locomotive travelled one thousand four hundred thirteen metres and its wheel turned three hundred times.'),
    A('why',
      "G'ildirak bir marta aylanganda yo'lda o'z uzunligicha masofa qoldiradi.",
      'За один оборот колесо оставляет на пути расстояние, равное своей длине.',
      'In one turn a wheel lays down a distance equal to its own circumference.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('1413 : 300 = 4,71', '1413 : 300 = 4,71', '1413 : 300 = 4.71')}
      steps={[
        { id: 'a', head: L('Diametr', 'Диаметр', 'The diameter'), lines: ['C = πd', '4,71 = 3,14 · d'] },
      ]}
      ask={L(
        "G'ildirakning diametri nechaga teng?",
        'Чему равен диаметр колеса?',
        'What is the diameter of the wheel?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('1,5 m', '1,5 м', '1.5 m') },
        {
          id: 'wrong',
          label: L('4,71 m', '4,71 м', '4.71 m'),
          hint: L(
            "To'rt butun yetmish bir yuzdan bu bitta aylanishning UZUNLIGI. Diametr uchun uni pi ga bo'lish kerak.",
            'Четыре целых семьдесят одна сотая это ДЛИНА одного оборота. Для диаметра её нужно разделить на пи.',
            'Four point seven one is the LENGTH of one turn. For the diameter divide it by pi.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, bir butun besh o'ndan metr. Bu darslikning qirq ikki nuqta oltinchi mashqi.",
        'Верно, полтора метра. Это задача сорок два точка шесть учебника.',
        'Correct, one and a half metres. This is exercise forty two point six.',
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
    'Geometriya 9, 42-dars (116-117-bet)',
    'Геометрия 9, урок 42 (стр. 116-117)',
    'Geometry 9, lesson 42 (p. 116-117)',
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
          "π ning qiymati aylananing kattaligiga bog'liqmi?",
          'Зависит ли значение π от размера окружности?',
          'Does the value of π depend on the size of the circle?',
        )}
        cols={2}
        items={[
          { id: 'right', right: true, label: L("Yo'q", 'Нет', 'No') },
          {
            id: 'wrong',
            label: L('Ha', 'Да', 'Yes'),
            hint: L(
              "1-ekranni eslang: shisha ham, bochka ham bir xil son bergandi, garchi o'lchamlari yetti barobar farq qilsa ham.",
              'Вспомни 1 экран: и бутылка, и бочка дали одно число, хотя размеры отличались в семь раз.',
              'Recall screen 1: the bottle and the barrel gave the same number though their sizes differed sevenfold.',
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
    "Bitta son barcha aylanalar uchun",
    'Одно число на все окружности',
    'One number for every circle',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz π ning qayerdan kelib chiqishini va formulaning ikkala tomonga ishlashini ko'rdingiz.",
      'На семи экранах ты увидел, откуда берётся π и как формула работает в обе стороны.',
      'On seven screens you saw where π comes from and how the formula works both ways.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — jadval.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Jadvalni to'ldirish",
    'Заполняем таблицу',
    'Filling the table',
  ),
  audio: [
    A('mount',
      "Uchta katak. Ba'zilarida radius berilgan, ba'zilarida uzunlik.",
      'Три клетки. В одних дан радиус, в других длина.',
      'Three cells. Some give the radius, others the circumference.'),
    A('why',
      "Pi ni uch butun o'n to'rt yuzdan deb hisoblang.",
      'Считай пи равным трём целым четырнадцати сотым.',
      'Take pi as three point one four.'),
  ],
  props: {
    stepLabel: L('Katak', 'Клетка', 'Cell'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham to'ldirildi. Javob pi bilan qoldirilsa aniq bo'ladi, o'nli kasrga aylantirilsa esa taqribiy: pi ning o'zi cheksiz davom etadi.",
      'Все три заполнены. Ответ с пи точен, а переведённый в десятичную дробь приближён: само пи продолжается бесконечно.',
      'All three are filled. An answer left with pi is exact; turned into a decimal it is approximate, since pi itself runs on forever.',
    ),
    tasks: [
      {
        expr: 'R = 4',
        question: L('Uzunlik nechaga teng?', 'Чему равна длина?', 'What is the circumference?'),
        ok: L("Ha, sakkiz pi, taxminan yigirma besh butun bir o'ndan.", 'Да, восемь пи, примерно двадцать пять целых одна десятая.', 'Yes, eight pi, about twenty five point one.'),
        items: [
          { id: 'a', right: true, label: L('8π ≈ 25,1', '8π ≈ 25,1', '8π ≈ 25.1') },
          { id: 'b', label: L('4π ≈ 12,6', '4π ≈ 12,6', '4π ≈ 12.6'), hint: L("Formulada ikkilikni unutmang: uzunlik ikki pi karra R ga teng, pi karra R ga emas.", 'Не забудь двойку в формуле: длина равна два пи на R, а не пи на R.', 'Do not lose the two: the circumference is two pi R, not pi R.') },
        ],
        solution: ['C = 2π · 4 = 8π', '8 · 3,14 = 25,12'],
      },
      {
        expr: 'C = 6,28',
        question: L('Radius nechaga teng?', 'Чему равен радиус?', 'What is the radius?'),
        ok: L("Ha, bir. Olti butun yigirma sakkiz yuzdan bu ikki pi ning o'zi.", 'Да, единица. Шесть целых двадцать восемь сотых это и есть два пи.', 'Yes, one. Six point two eight is exactly two pi.'),
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '2', hint: L("Olti butun yigirma sakkiz yuzdanni olti butun yigirma sakkiz yuzdanga bo'ling, bir chiqadi.", 'Раздели шесть целых двадцать восемь сотых на шесть целых двадцать восемь сотых, получится один.', 'Divide six point two eight by six point two eight and you get one.') },
        ],
        solution: ['2 · 3,14 · R = 6,28', 'R = 1'],
      },
      {
        expr: 'C = 82',
        question: L('Radius nechaga teng?', 'Чему равен радиус?', 'What is the radius?'),
        ok: L("Ha, taxminan o'n uch butun bir o'ndan.", 'Да, примерно тринадцать целых одна десятая.', 'Yes, about thirteen point one.'),
        items: [
          { id: 'a', right: true, label: '≈ 13,1' },
          { id: 'b', label: '≈ 26,1', hint: L("Sakson ikkini ikki pi ga, ya'ni olti butun yigirma sakkiz yuzdanga bo'ling. Faqat pi ga bo'lsangiz javob ikki barobar katta chiqadi.", 'Раздели восемьдесят два на два пи, то есть на шесть целых двадцать восемь сотых. Деление только на пи даст вдвое больше.', 'Divide eighty two by two pi, that is by six point two eight. Dividing by pi alone doubles the answer.') },
        ],
        solution: ['R = 82 : 6,28', 'R ≈ 13,06'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — o'zgarishlar.
// ============================================================
const S10 = {
  eyebrow: L('O\'ZGARISH', 'ИЗМЕНЕНИЕ', 'THE CHANGE'),
  title: L(
    "Radius o'zgarsa uzunlik qanday o'zgaradi",
    'Как меняется длина, если меняется радиус',
    'How the circumference follows the radius',
  ),
  audio: [
    A('mount',
      "Darslikning qirq ikki nuqta ikkinchi mashqi to'liq holda. To'rtta band, ikkitasi ko'paytirish, ikkitasi qo'shish haqida.",
      'Задача сорок два точка два учебника целиком. Четыре пункта, два про умножение, два про сложение.',
      'Exercise forty two point two in full. Four items, two about multiplying, two about adding.'),
    A('why',
      "Har safar formulaga qo'yib ko'ring.",
      'Каждый раз подставляй в формулу.',
      'Substitute into the formula each time.'),
  ],
  props: {
    stepLabel: L('Band', 'Пункт', 'Item'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi. Ko'paytirish uzunlikni ham ko'paytiradi, qo'shish esa unga qo'shadi. Bu ikkisi bir xil emas va ularni chalkashtirish eng ko'p uchraydigan xato.",
      'Все три проверены. Умножение умножает и длину, сложение к ней прибавляет. Это не одно и то же, и путаница здесь самая частая ошибка.',
      'All three are checked. Multiplying multiplies the circumference, adding adds to it. They are not the same, and mixing them up is the commonest slip.',
    ),
    tasks: [
      {
        expr: 'R   →   3R',
        question: L('Uzunlik qanday o\'zgaradi?', 'Как изменится длина?', 'How does the circumference change?'),
        ok: L("Ha, uch marta ortadi.", 'Да, вырастет втрое.', 'Yes, it grows threefold.'),
        items: [
          { id: 'a', right: true, label: L('3 marta ortadi', 'Вырастет в 3 раза', 'Grows 3 times') },
          { id: 'b', label: L('6π ga ortadi', 'Вырастет на 6π', 'Grows by 6π'), hint: L("Olti pi ga ortish radiusga UCH QO'SHILGANDA bo'lardi. Bu yerda esa radius uchga ko'paytirilgan.", 'Рост на шесть пи был бы при ПРИБАВЛЕНИИ трёх к радиусу. А здесь радиус умножен на три.', 'A growth of six pi would come from ADDING three to the radius. Here the radius is multiplied by three.') },
        ],
        solution: ['2π · 3R = 3 · (2πR)'],
      },
      {
        expr: 'R   →   R − 3',
        question: L('Uzunlik qanday o\'zgaradi?', 'Как изменится длина?', 'How does the circumference change?'),
        ok: L("Ha, olti pi ga kamayadi.", 'Да, уменьшится на шесть пи.', 'Yes, it shrinks by six pi.'),
        items: [
          { id: 'a', right: true, label: L('6π ga kamayadi', 'Уменьшится на 6π', 'Shrinks by 6π') },
          { id: 'b', label: L('3 marta kamayadi', 'Уменьшится в 3 раза', 'Shrinks 3 times'), hint: L("Uch marta kamayishi uchun radius uchga BO'LINISHI kerak edi. Bu yerda esa undan uch ayirilgan.", 'Чтобы уменьшиться втрое, радиус нужно было РАЗДЕЛИТЬ на три. А здесь из него вычли три.', 'To shrink threefold the radius had to be DIVIDED by three. Here three was subtracted from it.') },
        ],
        solution: ['2π(R − 3) = 2πR − 6π'],
      },
      {
        expr: 'R   →   R : 3',
        question: L('Uzunlik qanday o\'zgaradi?', 'Как изменится длина?', 'How does the circumference change?'),
        ok: L("Ha, uch marta kamayadi.", 'Да, уменьшится втрое.', 'Yes, it shrinks threefold.'),
        items: [
          { id: 'a', right: true, label: L('3 marta kamayadi', 'Уменьшится в 3 раза', 'Shrinks 3 times') },
          { id: 'b', label: L("O'zgarmaydi", 'Не изменится', 'Stays the same'), hint: L("Uzunlik radiusga to'g'ri proporsional. Radius kamaysa, uzunlik ham o'sha nisbatda kamayadi.", 'Длина прямо пропорциональна радиусу. Уменьшился радиус, в том же отношении уменьшится и длина.', 'The circumference is directly proportional to the radius. A smaller radius shrinks it in the same ratio.') },
        ],
        solution: ['2π · (R : 3) = (2πR) : 3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — g'ildirak.
// ============================================================
const S11 = {
  eyebrow: L('YO\'LDA', 'В ПУТИ', 'ON THE ROAD'),
  title: L(
    "Aylanishlar sonini hisoblash",
    'Считаем число оборотов',
    'Counting the turns',
  ),
  audio: [
    A('mount',
      "Yengil avtomobil g'ildiragining radiusi yigirma to'rt santimetr. Avtomobil yuz kilometr yo'l yurdi.",
      'Радиус колеса легкового автомобиля двадцать четыре сантиметра. Автомобиль проехал сто километров.',
      'A car wheel has radius twenty four centimetres. The car drove one hundred kilometres.'),
    A('why',
      "Avval o'lchov birliklarini bir xil qilib oling.",
      'Сначала приведи единицы измерения к одной.',
      'First bring the units to a common one.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkala qadam ham bajarildi. Bu darslikning qirq ikki nuqta yettinchi mashqi. Diqqat qilinadigan yagona joy o'lchov birliklari: santimetr va kilometr bitta masalada uchraydi.",
      'Оба шага сделаны. Это задача сорок два точка семь учебника. Единственное место, требующее внимания, это единицы: сантиметры и километры в одной задаче.',
      'Both steps are done. This is exercise forty two point seven. The one place needing care is the units: centimetres and kilometres in a single problem.',
    ),
    tasks: [
      {
        expr: 'R = 24 sm = 0,24 m',
        question: L(
          "Bitta aylanishda g'ildirak qancha masofa bosadi?",
          'Какое расстояние проходит колесо за один оборот?',
          'How far does the wheel travel in one turn?',
        ),
        ok: L("Ha, taxminan bir butun besh o'ndan bir metr.", 'Да, примерно один и пять десятых метра.', 'Yes, about one point five metres.'),
        items: [
          { id: 'a', right: true, label: L('≈ 1,51 m', '≈ 1,51 м', '≈ 1.51 m') },
          { id: 'b', label: L('≈ 0,75 m', '≈ 0,75 м', '≈ 0.75 m'), hint: L("Nol butun yetmish besh yuzdan bu pi karra radius. Formulada esa ikki pi karra radius turibdi.", 'Ноль целых семьдесят пять сотых это пи на радиус. А в формуле два пи на радиус.', 'Zero point seven five is pi times the radius. The formula has two pi times the radius.') },
        ],
        solution: ['C = 2 · 3,14 · 0,24', 'C ≈ 1,5072 m'],
      },
      {
        expr: '100 km = 100 000 m',
        question: L(
          "G'ildirak necha marta aylanadi?",
          'Сколько оборотов сделает колесо?',
          'How many turns does the wheel make?',
        ),
        ok: L("Ha, taxminan oltmish olti ming marta.", 'Да, примерно шестьдесят шесть тысяч раз.', 'Yes, about sixty six thousand times.'),
        items: [
          { id: 'a', right: true, label: L('≈ 66 000', '≈ 66 000', '≈ 66 000') },
          { id: 'b', label: L('≈ 6 600', '≈ 6 600', '≈ 6 600'), hint: L("Yuz mingni bir butun besh yuzdan ikki mingdanga bo'ling. Javob oltmish olti mingga yaqin chiqadi.", 'Раздели сто тысяч на одну целую пять тысяч семьдесят две десятитысячных. Выйдет около шестидесяти шести тысяч.', 'Divide one hundred thousand by one point five zero seven two. That gives about sixty six thousand.') },
        ],
        solution: ['100 000 : 1,5072', '≈ 66 348'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — radius o'rniga diametr.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Formulada R turibdi, d emas",
    'В формуле стоит R, а не d',
    'The formula holds R, not d',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Aylananing diametri o'nga teng. U formulaga o'nni qo'ygan va uzunlikni oltmish ikki butun sakkiz o'ndan deb topgan.",
      'Решение Камрона. Диаметр окружности равен десяти. Он подставил десять в формулу и получил длину шестьдесят два целых восемь десятых.',
      "Kamron's solution. The circle is ten across. He put ten into the formula and got a circumference of sixty two point eight."),
    A('why',
      "Formulada ikki pi karra R yozilgan. R nima ekanini eslang.",
      'В формуле написано два пи на R. Вспомни, что такое R.',
      'The formula says two pi times R. Recall what R is.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamron diametrni radius o'rniga qo'ygan va javob aynan ikki barobar katta chiqqan. Tekshirishning oson yo'li bor: uzunlik diametrdan taxminan uch barobar katta bo'lishi kerak, oltmish ikki esa o'ndan olti barobar katta.",
      'Камрон подставил диаметр вместо радиуса, и ответ вышел ровно вдвое больше. Есть простая проверка: длина должна быть примерно втрое больше диаметра, а шестьдесят два больше десяти в шесть раз.',
      'Kamron put the diameter where the radius belongs and the answer came out exactly double. There is an easy check: the circumference should be about three times the diameter, while sixty two is six times ten.',
    ),
    tasks: [
      {
        expr: 'd = 10   →   C = 2π · 10 = 62,8 ?',
        question: L(
          "Bu aylananing uzunligi aslida nechaga teng?",
          'Чему на самом деле равна длина этой окружности?',
          'What is the circumference of this circle really?',
        ),
        ok: L(
          "To'g'ri, o'ttiz bir butun to'rt o'ndan. Diametr o'n bo'lsa, radius besh.",
          'Верно, тридцать один целый четыре десятых. Если диаметр десять, то радиус пять.',
          'Correct, thirty one point four. If the diameter is ten, the radius is five.',
        ),
        items: [
          { id: 'a', right: true, label: '31,4' },
          {
            id: 'b',
            label: '62,8',
            hint: L(
              "Uzunlik diametrdan pi barobar, ya'ni taxminan uch barobar katta bo'ladi. Oltmish ikki esa o'ndan olti barobar katta, demak javob juda katta.",
              'Длина больше диаметра в пи раз, то есть примерно втрое. А шестьдесят два больше десяти в шесть раз, значит ответ слишком велик.',
              'The circumference exceeds the diameter by pi, about threefold. Sixty two exceeds ten sixfold, so the answer is far too big.',
            ),
          },
        ],
        solution: [
          'R = 10 : 2 = 5',
          'C = 2π · 5 = 10π ≈ 31,4',
          L('yoki C = πd = 3,14 · 10', 'или C = πd = 3,14 · 10', 'or C = πd = 3.14 · 10'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — Yer va arqon.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ekvator bo'ylab tortilgan arqon",
    'Верёвка вдоль экватора',
    'A rope along the equator',
  ),
  audio: [
    A('mount',
      "Yer ekvatorining qirq milliondan bir qismi bir metrga teng. Bu metrning eski ta'rifi edi.",
      'Одна сорокамиллионная экватора Земли равна одному метру. Таким было старое определение метра.',
      'One forty millionth of the equator equals one metre. That was the old definition of the metre.'),
    A('why',
      "Demak ekvatorning uzunligi qirq million metr, ya'ni qirq ming kilometr.",
      'Значит длина экватора сорок миллионов метров, то есть сорок тысяч километров.',
      'So the equator is forty million metres long, that is forty thousand kilometres.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkinchi javob deyarli hech kimni ishontirmaydi, lekin u formuladan to'g'ridan to'g'ri kelib chiqadi: uzunlikning ortishi ikki pi karra radiusning ortishiga teng va bu tenglikda radiusning O'ZI umuman qatnashmaydi. Shuning uchun javob futbol to'pi uchun ham, Yer uchun ham bir xil.",
      'Второй ответ почти никого не убеждает, но он прямо следует из формулы: прирост длины равен два пи на прирост радиуса, и сам радиус в это равенство не входит. Поэтому ответ одинаков и для футбольного мяча, и для Земли.',
      'The second answer convinces almost nobody, yet it follows straight from the formula: the growth in circumference is two pi times the growth in radius, and the radius itself never enters. So the answer is the same for a football and for the Earth.',
    ),
    tasks: [
      {
        expr: 'C = 40 000 km',
        question: L(
          "Yerning radiusi taxminan nechaga teng?",
          'Чему примерно равен радиус Земли?',
          'What is the radius of the Earth roughly?',
        ),
        ok: L(
          "Ha, taxminan olti ming uch yuz yetmish kilometr. Bu haqiqiy qiymatga juda yaqin.",
          'Да, примерно шесть тысяч триста семьдесят километров. Это очень близко к настоящему значению.',
          'Yes, about six thousand three hundred seventy kilometres. That is very close to the true value.',
        ),
        items: [
          { id: 'a', right: true, label: L('≈ 6370 km', '≈ 6370 км', '≈ 6370 km') },
          {
            id: 'b',
            label: L('≈ 12 740 km', '≈ 12 740 км', '≈ 12 740 km'),
            hint: L(
              "O'n ikki ming yetti yuz qirq bu Yerning DIAMETRI. Radius uchun uni yana ikkiga bo'lish kerak.",
              'Двенадцать тысяч семьсот сорок это ДИАМЕТР Земли. Для радиуса его нужно ещё разделить на два.',
              'Twelve thousand seven hundred forty is the DIAMETER of the Earth. For the radius halve it.',
            ),
          },
        ],
        solution: ['R = 40 000 : 6,28', 'R ≈ 6369 km'],
      },
      {
        expr: 'ΔC = 6,28 m',
        question: L(
          "Ekvator bo'ylab tortilgan arqonga olti butun yigirma sakkiz yuzdan metr qo'shildi. Arqon yerdan qancha ko'tariladi?",
          'К верёвке вдоль экватора добавили шесть целых двадцать восемь сотых метра. На сколько она поднимется над землёй?',
          'Six point two eight metres were added to a rope along the equator. How far does it rise above the ground?',
        ),
        ok: L(
          "Ha, bir metrga. Yerning radiusi javobga umuman ta'sir qilmaydi.",
          'Да, на один метр. Радиус Земли на ответ вообще не влияет.',
          'Yes, by one metre. The radius of the Earth does not affect the answer at all.',
        ),
        items: [
          { id: 'a', right: true, label: L('1 m ga', 'На 1 м', 'By 1 m') },
          {
            id: 'b',
            label: L("Deyarli nolga, Yer juda katta", 'Почти на ноль, Земля слишком велика', 'By almost nothing, the Earth is too big'),
            hint: L(
              "6-ekranni eslang: radiusga qo'shilgan son uzunlikni ikki pi karra o'sha songa oshirardi. Bu yerda teskarisi: uzunlikka olti butun yigirma sakkiz yuzdan qo'shildi, demak radius bir metrga oshadi.",
              'Вспомни 6 экран: прибавка к радиусу увеличивала длину на два пи такой прибавки. Здесь наоборот: к длине добавили шесть двадцать восемь, значит радиус вырастет на метр.',
              'Recall screen 6: adding to the radius raised the circumference by two pi times that amount. Here it is reversed: the circumference gained six point two eight, so the radius gains a metre.',
            ),
          },
        ],
        solution: ['ΔC = 2π · ΔR', '6,28 = 6,28 · ΔR', 'ΔR = 1 m'],
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
    "Blits: π, ikkilik, marta va ga",
    'Блиц: π, двойка, в разы и на сколько',
    'Blitz: π, the two, times and by',
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
        tag: 'nisbat-radiusga-bogliq',
        ask: L(
          "Katta aylanada uzunlikning diametrga nisbati qanday bo'ladi?",
          'Каким будет отношение длины к диаметру у большой окружности?',
          'What is the ratio of circumference to diameter for a large circle?',
        ),
        options: [
          { id: 'r', right: true, label: L("O'sha π", 'То же π', 'The same π') },
          { id: 'w', label: L('Kattaroq', 'Больше', 'Larger') },
        ],
        ok: L(
          "To'g'ri. Nisbat barcha aylanalarda bir xil, chunki ular o'zaro o'xshash.",
          'Верно. Отношение одинаково у всех окружностей, потому что они подобны.',
          'Correct. The ratio is the same for every circle because they are all similar.',
        ),
        hint: L(
          "1-ekranni eslang: shisha va bochka bir xil son bergandi.",
          'Вспомни 1 экран: бутылка и бочка дали одно число.',
          'Recall screen 1: the bottle and the barrel gave one number.',
        ),
      },
      {
        id: 'q2',
        tag: 'radius-diametr-almashish',
        ask: L(
          "Diametri d bo'lgan aylananing uzunligi qanday yoziladi?",
          'Как записать длину окружности диаметра d?',
          'How is the circumference of a circle of diameter d written?',
        ),
        options: [
          { id: 'r', right: true, label: 'πd' },
          { id: 'w', label: '2πd' },
        ],
        ok: L(
          "To'g'ri. Ikkilik radiusni diametrga aylantirish uchun kerak edi, diametr esa tayyor.",
          'Верно. Двойка нужна была, чтобы превратить радиус в диаметр, а диаметр уже готов.',
          'Correct. The two was there to turn the radius into the diameter, and the diameter is already given.',
        ),
        hint: L(
          "12-ekranni eslang: u yerda ikkilik ikki marta qo'llanib, javob ikki barobar katta chiqqandi.",
          'Вспомни 12 экран: там двойку применили дважды, и ответ вышел вдвое больше.',
          'Recall screen 12: the two was applied twice there and the answer doubled.',
        ),
      },
      {
        id: 'q3',
        tag: 'qoshish-kopaytirish-farqi',
        ask: L(
          "Radius ikki marta ortsa, uzunlik qanday o'zgaradi?",
          'Как изменится длина, если радиус вырастет вдвое?',
          'How does the circumference change if the radius doubles?',
        ),
        options: [
          { id: 'r', right: true, label: L('Ikki marta ortadi', 'Вырастет вдвое', 'It doubles') },
          { id: 'w', label: L('4π ga ortadi', 'Вырастет на 4π', 'It grows by 4π') },
        ],
        ok: L(
          "To'g'ri. Ko'paytirishga ko'paytirish javob beradi.",
          'Верно. На умножение отвечают умножением.',
          'Correct. Multiplication answers multiplication.',
        ),
        hint: L(
          "10-ekranni eslang: radius uchga ko'paytirilganda uzunlik ham uch marta ortgandi.",
          'Вспомни 10 экран: радиус умножили на три, и длина выросла втрое.',
          'Recall screen 10: the radius was tripled and the circumference grew threefold.',
        ),
      },
      {
        id: 'q4',
        tag: 'pi-taxminiy-emas',
        ask: L(
          "Uch butun o'n to'rt yuzdan π ning aniq qiymatimi?",
          'Является ли три целых четырнадцать сотых точным значением π?',
          'Is three point one four the exact value of π?',
        ),
        options: [
          { id: 'r', right: true, label: L("Yo'q, taqribiy", 'Нет, приближённое', 'No, approximate') },
          { id: 'w', label: L('Ha, aniq', 'Да, точное', 'Yes, exact') },
        ],
        ok: L(
          "To'g'ri. π irratsional son, uning o'nli yozuvi cheksiz davom etadi.",
          'Верно. π иррационально, его десятичная запись бесконечна.',
          'Correct. π is irrational and its decimal expansion never ends.',
        ),
        hint: L(
          "4-ekranni eslang: u yerda π ni oddiy kasr bilan yozib bo'lmasligi aytilgandi.",
          'Вспомни 4 экран: там сказано, что π нельзя записать обычной дробью.',
          'Recall screen 4: it said π cannot be written as an ordinary fraction.',
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
    "Nisbat o'zgarmaydi, chunki aylanalar o'xshash",
    'Отношение не меняется, ведь окружности подобны',
    'The ratio holds because circles are similar',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda shisha va bochka bir xil son bergandi, garchi o'lchamlari yetti barobar farq qilsa ham.",
      'На первом экране бутылка и бочка дали одно число, хотя размеры отличались в семь раз.',
      'On the first screen the bottle and the barrel gave one number though their sizes differed sevenfold.'),
    A('s1',
      "Siz π ning kelib chiqishini o'xshashlikdan chiqardingiz, formulani ikki tomonga ishlatdingiz va arqon masalasini yechdingiz.",
      'Ты вывел происхождение π из подобия, применил формулу в обе стороны и решил задачу о верёвке.',
      'You traced π back to similarity, used the formula both ways, and solved the rope problem.'),
    A('s2',
      "Keyingi darsda uchburchakdagi metrik munosabatlar.",
      'В следующем уроке метрические соотношения в треугольнике.',
      'The next lesson covers metric relations in a triangle.'),
  ],
  props: {
    mark: 'C = 2πR = πd',
    markNote: L(
      "π har qanday aylanada bir xil",
      'π одинаково у любой окружности',
      'π is the same for every circle',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: metrik munosabatlar',
      'Следующий урок: метрические соотношения',
      'Next lesson: metric relations',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'nisbat-radiusga-bogliq', ...S2 },
  { role: 'explain',  tag: 'nisbat-radiusga-bogliq', ...S3 },
  { role: 'explain',  tag: 'radius-diametr-almashish', ...S4 },
  { role: 'explain',  tag: 'radius-diametr-almashish', ...S5 },
  { role: 'explain',  tag: 'qoshish-kopaytirish-farqi', ...S6 },
  { role: 'explain',  tag: 'radius-diametr-almashish', ...S7 },
  { role: 'rule',     tag: 'nisbat-radiusga-bogliq', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'radius-diametr-almashish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-kopaytirish-farqi', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'radius-diametr-almashish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'radius-diametr-almashish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'qoshish-kopaytirish-farqi', ...S13 },
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
