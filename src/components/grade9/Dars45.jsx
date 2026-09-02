// ============================================================================
// 9-sinf, Dars 45. TO'G'RI BURCHAKLI UCHBURCHAKDAGI PROPORSIONAL KESMALAR.
//
// REDAKSIYA 1, 2026-08-28. Darslik: Geometriya 9, 50-dars (134-135-bet).
//   Xossa (134-bet): to'g'ri burchak uchidan tushirilgan balandlik
//       uchburchakni O'ZIGA O'XSHASH ikkita uchburchakka ajratadi.
//       Isbot: ACD va ABC da to'g'ri burchak bor va A umumiy;
//       CBD va ABC da to'g'ri burchak bor va B umumiy.
//   Ta'rif (134-bet): a : b = b : c bo'lsa, b kesma a va c orasidagi
//       O'RTA PROPORSIONAL kesma, ya'ni b² = ac.
//   1-teorema: balandlik proyeksiyalar orasida o'rta proporsional,
//       CD² = AD · BD.
//   2-teorema: katet gipotenuza bilan o'z proyeksiyasi orasida o'rta
//       proporsional, AC² = AB · AD va BC² = AB · BD.
//   Natija (135-bet): ikkala tenglikni qo'shsak, AC² + BC² =
//       AB · (AD + BD) = AB² — bu PIFAGORNING O'ZI yozib qoldirgan
//       isboti.
//   Masala (134-bet): katetlar 15 va 20 → AB = 25, AD = 225 : 25 = 9.
//   50.2: proyeksiyalar 9 va 16 → h = 12, katetlar 15 va 20.
//   50.3: gipotenuza 15, katet 9 → ikkinchi katet 12, proyeksiyasi 9,6.
//   50.7: proyeksiyalar 2 va 18 → h = 6, gipotenuza 20, yuz 60.
//
// 42-DARSDA BERILGAN VA'DA SHU YERDA BAJARILADI. U yerda diametrga
// perpendikulyar vatarning yarmi bo'laklar orasidagi o'rta geometrik
// bo'lib chiqqandi va «bu 45-darsda balandlik sifatida qaytadi»
// deyilgandi. Transfer aynan shuni ko'rsatadi: bo'laklari 9 va 16
// bo'lgan diametr ham, proyeksiyalari 9 va 16 bo'lgan gipotenuza ham
// bir xil 12 ni beradi — chunki yarim aylanaga ichki chizilgan
// uchburchak to'g'ri burchakli va o'sha vatar uning balandligi.
//
// XUK: bitta kesma uchta uchburchak hosil qiladi va uchalasi ham BIR
// XIL SHAKLDA. Buni ko'z bilan ilg'ash qiyin, chunki ular har xil
// tomonga burilgan — shuning uchun savol burchaklar orqali beriladi.
//
// TUZOQ (12-ekran): balandlikni proyeksiyalarning O'RTA ARIFMETIGI
// deb hisoblash. 9 va 16 uchun bu 12,5 beradi, to'g'ri javob esa 12.
// Farq atigi yarim birlik, ya'ni xato «deyarli to'g'ri» ko'rinadi va
// shuning uchun xavfli. Ekran uni Pifagor bilan tekshirtiradi.
//
// CHIZMA: yangi `TriFig` (7K) UMUMIY QATLAMDA. 44-darsning `PiStrip`
// idan farqi shunda: uchburchak 45-49-darslarning hammasida kerak
// bo'ladi (sinus, kosinus, sinuslar va kosinuslar teoremasi), ya'ni
// bu chizma bir martalik emas.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, TriFig } from './asboblar.jsx'

export const META = {
  id: 'grade9-45',
  n: 45,
  row: 45,
  block: 'Б7',
  topic: L(
    "To'g'ri burchakli uchburchakdagi proporsional kesmalar",
    'Пропорциональные отрезки в прямоугольном треугольнике',
    'Proportional segments in a right triangle',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "To'g'ri burchak uchidan tushirilgan balandlik uchburchakni o'ziga o'xshash ikkitaga ajratadi",
    'Высота из прямого угла делит треугольник на два подобных ему',
    'The altitude from the right angle splits the triangle into two similar to it',
  ),
  L(
    "Balandlik proyeksiyalar orasida o'rta proporsional: h² = AD · BD",
    'Высота есть среднее пропорциональное проекций: h² = AD · BD',
    'The altitude is the mean proportional of the projections: h² = AD · BD',
  ),
  L(
    "Katetning kvadrati gipotenuza bilan uning proyeksiyasi ko'paytmasiga teng",
    'Квадрат катета равен произведению гипотенузы на его проекцию',
    'A leg squared equals the hypotenuse times its projection',
  ),
]

export const MISS = {
  'orta-arifmetik-olish': {
    what: L(
      "o'rta proporsional o'rniga o'rta arifmetik olindi",
      'вместо среднего пропорционального взято среднее арифметическое',
      'the arithmetic mean was taken instead of the mean proportional',
    ),
    wrong: null,
    at: 0,
  },
  'gipotenuza-proyeksiya-almashish': {
    what: L(
      "katet formulasida gipotenuza o'rniga ikkinchi proyeksiya qo'yildi",
      'в формуле катета вместо гипотенузы подставлена вторая проекция',
      'the other projection was used in place of the hypotenuse in the leg formula',
    ),
    wrong: null,
    at: 0,
  },
  'kvadratni-unutish': {
    what: L(
      "tenglikda kvadrat unutildi",
      'в равенстве потерян квадрат',
      'the square was dropped from the equality',
    ),
    wrong: null,
    at: 0,
  },
  'mos-tomonlarni-adashtirish': {
    what: L(
      "o'xshash uchburchaklarda mos bo'lmagan tomonlar juftlashtirildi",
      'в подобных треугольниках сопоставлены не соответственные стороны',
      'non corresponding sides were paired in the similar triangles',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — bitta kesma, uchta bir xil shakl.
// ============================================================
const S1 = {
  eyebrow: L('BITTA KESMA', 'ОДИН ОТРЕЗОК', 'ONE SEGMENT'),
  title: L(
    "Uchta uchburchak, bitta shakl",
    'Три треугольника, одна форма',
    'Three triangles, one shape',
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchakning to'g'ri burchagidan gipotenuzaga balandlik tushirildi. Endi chizmada uchta uchburchak bor: kattasi va ikkita kichigi.",
      'Из прямого угла треугольника опущена высота на гипотенузу. Теперь на чертеже три треугольника: большой и два маленьких.',
      'An altitude drops from the right angle to the hypotenuse. Now the drawing holds three triangles: the large one and two small ones.'),
    A('why',
      "Ular har xil tomonga burilgan, shuning uchun ko'z bilan solishtirish qiyin. Burchaklar esa hammasini aytib beradi.",
      'Они повёрнуты в разные стороны, поэтому глазом их не сравнить. А углы говорят всё.',
      'They face different ways, so the eye cannot compare them. The angles tell everything.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[20, 15, 25]}
          names={['A', 'B', 'C']}
          altitude
          right="C"
          altLab="h"
        />
      }
      steps={[
        { id: 'a', head: L('Kichik uchburchak ACD', 'Малый треугольник ACD', 'The small triangle ACD'), lines: ['∠D = 90°', L('∠A — umumiy', '∠A — общий', '∠A is shared')] },
      ]}
      ask={L(
        "ACD uchburchak kattasiga o'xshashmi?",
        'Подобен ли треугольник ACD большому?',
        'Is the triangle ACD similar to the large one?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ha', 'Да', 'Yes') },
        {
          id: 'wrong',
          label: L("Yo'q", 'Нет', 'No'),
          hint: L(
            "Ikkita burchak yetarli edi. Bittasi to'g'ri burchak, ikkinchisi esa A, u ikkala uchburchakda ham bir xil.",
            'Двух углов было достаточно. Один прямой, второй это A, он общий у обоих треугольников.',
            'Two angles sufficed. One is the right angle, the other is A, shared by both triangles.',
          ),
        },
      ]}
      after={L(
        "Ha. Xuddi shu sabab bilan ikkinchi kichik uchburchak ham kattasiga o'xshash. Demak uchalasi bir xil shaklda, faqat o'lchamlari va burilishi boshqa.",
        'Да. По той же причине и второй малый треугольник подобен большому. Значит все три одной формы, отличаются только размером и поворотом.',
        'Yes. For the same reason the other small triangle is similar too. So all three share a shape and differ only in size and turn.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 2. TAYANCH — o'xshashlik nima berardi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "O'xshashlikdan nima olinardi",
    'Что давало подобие',
    'What similarity gave',
  ),
  audio: [
    A('mount',
      "35-darsdan beri o'xshashlik bizga bitta narsani berardi: mos tomonlarning proporsiyasini.",
      'С 35 урока подобие давало нам одно: пропорцию соответственных сторон.',
      'Since lesson 35 similarity has given us one thing: a proportion of corresponding sides.'),
    A('why',
      "42-darsda esa shu proporsiyadan ko'paytmalar tengligi chiqqandi.",
      'А на 42 уроке из этой пропорции получилось равенство произведений.',
      'And in lesson 42 that proportion produced an equality of products.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('m : n = n : k', 'm : n = n : k', 'm : n = n : k')}
      steps={[]}
      ask={L(
        "Bu proporsiyadan qanday tenglik chiqadi?",
        'Какое равенство следует из этой пропорции?',
        'What equality follows from this proportion?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'n² = m · k' },
        {
          id: 'wrong',
          label: 'n = m · k',
          hint: L(
            "Kesishma qoidasi o'rtadagi hadlarni bir biriga ko'paytiradi. Bu yerda esa o'rtada ikkita bir xil harf turibdi.",
            'Правило креста перемножает средние члены. А в середине здесь стоят две одинаковые буквы.',
            'Cross multiplication multiplies the inner terms. Here the two inner terms are the same letter.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bunday n ni m va k orasidagi o'rta proporsional kesma deyishadi. Bugun u to'rt marta uchraydi.",
        'Верно. Такое n называют средним пропорциональным между m и k. Сегодня оно встретится четыре раза.',
        'Correct. Such an n is called the mean proportional between m and k. Today it appears four times.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ikkita kichik uchburchak o'zaro.
// ============================================================
const S3 = {
  eyebrow: L('IKKITA KICHIGI', 'ДВА МАЛЫХ', 'THE TWO SMALL ONES'),
  title: L(
    "Ular o'zaro ham o'xshash",
    'Они подобны и между собой',
    'They are similar to each other too',
  ),
  audio: [
    A('mount',
      "Ikkala kichik uchburchak ham kattasiga o'xshash edi. Bundan yana bitta natija chiqadi.",
      'Оба малых треугольника были подобны большому. Отсюда следует ещё один вывод.',
      'Both small triangles were similar to the large one. One more conclusion follows.'),
    A('why',
      "Bitta shaklga o'xshash ikkita narsa o'zaro ham o'xshash bo'ladi.",
      'Две фигуры, подобные одной и той же, подобны и между собой.',
      'Two figures similar to the same one are similar to each other.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[20, 15, 25]}
          names={['A', 'B', 'C']}
          altitude
          right="C"
          segs={{ left: 'AD', right: 'BD' }}
          altLab="h"
        />
      }
      steps={[
        { id: 'a', head: L('Zanjir', 'Цепочка', 'The chain'), lines: ['ACD ~ ABC', 'CBD ~ ABC'] },
      ]}
      ask={L(
        "ACD va CBD uchburchaklar haqida nima deyish mumkin?",
        'Что можно сказать о треугольниках ACD и CBD?',
        'What can be said about the triangles ACD and CBD?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Ular ham o'xshash", 'Они тоже подобны', 'They are similar too') },
        {
          id: 'wrong',
          label: L('Ular teng', 'Они равны', 'They are congruent'),
          hint: L(
            "Teng bo'lishlari uchun o'lchamlari ham bir xil bo'lishi kerak edi. Chizmada esa biri ikkinchisidan kattaroq.",
            'Для равенства нужны и одинаковые размеры. А на чертеже один больше другого.',
            'Congruence would need equal sizes as well. On the drawing one is larger than the other.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, o'xshash. Aynan shu o'xshashlik balandlik haqidagi teoremani beradi.",
        'Верно, подобны. Именно это подобие даст теорему о высоте.',
        'Correct, similar. That very similarity will give the theorem about the altitude.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — balandlik.
// ============================================================
const S4 = {
  eyebrow: L('BALANDLIK', 'ВЫСОТА', 'THE ALTITUDE'),
  title: L(
    "Balandlik proyeksiyalar orasida",
    'Высота между проекциями',
    'The altitude between the projections',
  ),
  audio: [
    A('mount',
      "ACD va CBD uchburchaklarda mos tomonlarni juftlaymiz. AD ga CD mos keladi, CD ga esa BD.",
      'В треугольниках ACD и CBD сопоставим соответственные стороны. AD отвечает CD, а CD отвечает BD.',
      'Pair the corresponding sides in ACD and CBD. AD matches CD, and CD matches BD.'),
    A('why',
      "Proporsiyaning o'rtasida ikkita bir xil kesma turibdi.",
      'В середине пропорции стоят два одинаковых отрезка.',
      'The middle of the proportion holds two equal segments.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('AD : CD = CD : BD', 'AD : CD = CD : BD', 'AD : CD = CD : BD')}
      steps={[
        { id: 'a', head: L('Sonlar', 'Числа', 'The numbers'), lines: ['AD = 9,   BD = 16'] },
      ]}
      ask={L(
        "Balandlik nechaga teng?",
        'Чему равна высота?',
        'What does the altitude equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '12' },
        {
          id: 'wrong',
          label: '12,5',
          hint: L(
            "O'n ikki butun besh o'ndan bu to'qqiz va o'n oltining YARIM YIG'INDISI. Teorema esa ko'paytmani so'raydi: to'qqiz karra o'n olti, keyin ildiz.",
            'Двенадцать с половиной это ПОЛУСУММА девяти и шестнадцати. А теорема требует произведения: девять на шестнадцать, потом корень.',
            'Twelve and a half is the HALF SUM of nine and sixteen. The theorem asks for the product: nine times sixteen, then a root.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Balandlikning kvadrati proyeksiyalar ko'paytmasiga teng: bir yuz qirq to'rtning ildizi o'n ikki.",
        'Верно. Квадрат высоты равен произведению проекций: корень из ста сорока четырёх это двенадцать.',
        'Correct. The altitude squared equals the product of the projections: the root of one hundred forty four is twelve.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — katet.
// ============================================================
const S5 = {
  eyebrow: L('KATET', 'КАТЕТ', 'A LEG'),
  title: L(
    "Katet gipotenuza bilan o'z proyeksiyasi orasida",
    'Катет между гипотенузой и своей проекцией',
    'A leg between the hypotenuse and its own projection',
  ),
  audio: [
    A('mount',
      "Endi katta uchburchak bilan kichigini solishtiramiz. ABC va ACD uchburchaklarda AB ga AC mos keladi, AC ga esa AD.",
      'Теперь сравним большой треугольник с малым. В ABC и ACD стороне AB отвечает AC, а AC отвечает AD.',
      'Now compare the large triangle with a small one. In ABC and ACD the side AB matches AC, and AC matches AD.'),
    A('why',
      "Bu yerda ham o'rtada ikkita bir xil kesma turibdi.",
      'Здесь тоже в середине стоят два одинаковых отрезка.',
      'Here too the middle holds two equal segments.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      figure={
        <TriFig
          sides={[20, 15, 25]}
          names={['A', 'B', 'C']}
          altitude
          right="C"
          edges={{ c: '25', b: '15' }}
          segs={{ left: '9' }}
        />
      }
      steps={[
        { id: 'a', head: L('Proporsiya', 'Пропорция', 'The proportion'), lines: ['AB : AC = AC : AD'] },
      ]}
      ask={L(
        "AC katet uchun qanday tenglik chiqadi?",
        'Какое равенство получается для катета AC?',
        'What equality comes out for the leg AC?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'AC² = AB · AD' },
        {
          id: 'wrong',
          label: 'AC² = AD · BD',
          hint: L(
            "AD karra BD bu BALANDLIKNING kvadrati edi. Katet uchun esa gipotenuzaning o'zi kerak.",
            'AD на BD это был квадрат ВЫСОТЫ. А для катета нужна сама гипотенуза.',
            'AD times BD was the square of the ALTITUDE. A leg needs the hypotenuse itself.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sonlar bilan tekshiramiz: yigirma besh karra to'qqiz ikki yuz yigirma besh, uning ildizi o'n besh. Chizmadagi AC ham o'n beshga teng.",
        'Верно. Проверим числами: двадцать пять на девять двести двадцать пять, корень из него пятнадцать. И AC на чертеже равен пятнадцати.',
        'Correct. Check with numbers: twenty five times nine is two hundred twenty five, whose root is fifteen. And AC on the drawing is fifteen.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — darslikning masalasi.
// ============================================================
const S6 = {
  eyebrow: L('IKKI QADAM', 'ДВА ШАГА', 'TWO STEPS'),
  title: L(
    "Katetlardan proyeksiyaga",
    'От катетов к проекции',
    'From the legs to a projection',
  ),
  audio: [
    A('mount',
      "Katetlari o'n besh va yigirma bo'lgan uchburchak berilgan. Kichik katetning gipotenuzadagi proyeksiyasini topish kerak.",
      'Дан треугольник с катетами пятнадцать и двадцать. Нужно найти проекцию меньшего катета на гипотенузу.',
      'A triangle has legs fifteen and twenty. Find the projection of the smaller leg on the hypotenuse.'),
    A('why',
      "Formulada gipotenuza qatnashadi, demak avval uni topamiz.",
      'В формуле участвует гипотенуза, значит сначала найдём её.',
      'The formula uses the hypotenuse, so we find it first.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('AC = 15,   BC = 20', 'AC = 15,   BC = 20', 'AC = 15,   BC = 20')}
      steps={[
        { id: 'a', head: L('Gipotenuza', 'Гипотенуза', 'The hypotenuse'), lines: ['AB² = 225 + 400 = 625', 'AB = 25'] },
      ]}
      ask={L(
        "AD proyeksiya nechaga teng?",
        'Чему равна проекция AD?',
        'What does the projection AD equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '9' },
        {
          id: 'wrong',
          label: '15',
          hint: L(
            "O'n besh bu KATETNING o'zi. Proyeksiya esa uning kvadratini gipotenuzaga bo'lgan natija: ikki yuz yigirma besh bo'lingan yigirma besh.",
            'Пятнадцать это САМ катет. А проекция это его квадрат, делённый на гипотенузу: двести двадцать пять на двадцать пять.',
            'Fifteen is the LEG itself. The projection is its square over the hypotenuse: two hundred twenty five over twenty five.',
          ),
        },
      ]}
      after={L(
        "To'g'ri, to'qqiz. Bu darslikning o'sha masalasi va u ikkita qadamda yechildi: Pifagor, keyin ikkinchi teorema.",
        'Верно, девять. Это та самая задача учебника, решена в два шага: Пифагор, затем вторая теорема.',
        'Correct, nine. This is that textbook problem, solved in two steps: Pythagoras, then the second theorem.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — Pifagorning isboti.
// ============================================================
const S7 = {
  eyebrow: L('PIFAGORNING O\'ZI', 'САМ ПИФАГОР', 'PYTHAGORAS HIMSELF'),
  title: L(
    "Ikkita tenglikni qo'shsak",
    'Если сложить два равенства',
    'Adding the two equalities',
  ),
  audio: [
    A('mount',
      "Ikkinchi teorema ikkala katet uchun ham yoziladi. Bittasi AC kvadrat teng AB karra AD, ikkinchisi BC kvadrat teng AB karra BD.",
      'Вторая теорема пишется для обоих катетов. Одна: AC квадрат равно AB на AD, вторая: BC квадрат равно AB на BD.',
      'The second theorem holds for both legs. One says AC squared equals AB times AD, the other BC squared equals AB times BD.'),
    A('why',
      "Endi ularni qo'shamiz va o'ng tomondan AB ni qavsdan chiqaramiz.",
      'Теперь сложим их и вынесем AB за скобку справа.',
      'Now add them and take AB out of the bracket on the right.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        'AC² + BC² = AB · (AD + BD)',
        'AC² + BC² = AB · (AD + BD)',
        'AC² + BC² = AB · (AD + BD)',
      )}
      steps={[]}
      ask={L(
        "Qavs ichidagi yig'indi nimaga teng?",
        'Чему равна сумма в скобке?',
        'What does the sum in the bracket equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'AB' },
        {
          id: 'wrong',
          label: 'h',
          hint: L(
            "AD va BD gipotenuzaning ikkita bo'lagi edi. Ikkita bo'lakni qo'shsangiz butun gipotenuza chiqadi.",
            'AD и BD были двумя кусками гипотенузы. Сложив два куска, получишь всю гипотенузу.',
            'AD and BD were the two pieces of the hypotenuse. Adding both gives the whole hypotenuse.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Demak AC kvadrat qo'shuv BC kvadrat teng AB kvadrat. Pifagor teoremasi shu yerda o'zidan o'zi chiqdi, va darslikning aytishicha, aynan shu Pifagorning o'zi yozib qoldirgan isboti.",
        'Верно. Значит AC квадрат плюс BC квадрат равно AB квадрат. Теорема Пифагора вышла сама собой, и по учебнику это доказательство оставил сам Пифагор.',
        'Correct. So AC squared plus BC squared equals AB squared. The theorem of Pythagoras came out by itself, and by the textbook this is the proof Pythagoras left behind.',
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
    'Geometriya 9, 50-dars (134-135-bet)',
    'Геометрия 9, урок 50 (стр. 134-135)',
    'Geometry 9, lesson 50 (p. 134-135)',
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
          "Uchala tenglik ham qayerdan kelib chiqdi?",
          'Откуда взялись все три равенства?',
          'Where did all three equalities come from?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Bitta balandlik hosil qilgan o'xshashlikdan",
              'Из подобия, созданного одной высотой',
              'From the similarity created by one altitude',
            ),
          },
          {
            id: 'wrong',
            label: L('Pifagor teoremasidan', 'Из теоремы Пифагора', 'From the theorem of Pythagoras'),
            hint: L(
              "Aksincha bo'ldi: 7-ekranda Pifagor teoremasining O'ZI shu tengliklardan chiqdi.",
              'Вышло наоборот: на 7 экране САМА теорема Пифагора получилась из этих равенств.',
              'It went the other way: on screen 7 the theorem of Pythagoras ITSELF came out of these equalities.',
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
    "Bitta balandlik, uchta tenglik",
    'Одна высота, три равенства',
    'One altitude, three equalities',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz bitta chizmadan uchta tenglikni va Pifagor teoremasini oldingiz.",
      'На семи экранах ты получил из одного чертежа три равенства и теорему Пифагора.',
      'On seven screens one drawing yielded three equalities and the theorem of Pythagoras.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — proyeksiyalardan tomonlarga.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Proyeksiyalar ma'lum, qolgani topiladi",
    'Проекции известны, остальное находится',
    'The projections are known, the rest follows',
  ),
  audio: [
    A('mount',
      "Balandlik gipotenuzani to'qqiz va o'n olti santimetrga ajratdi. Uchburchakning tomonlarini topish kerak.",
      'Высота разделила гипотенузу на девять и шестнадцать сантиметров. Нужно найти стороны треугольника.',
      'The altitude split the hypotenuse into nine and sixteen centimetres. Find the sides of the triangle.'),
    A('why',
      "Darslikning ellik nuqta ikkinchi mashqi.",
      'Задача пятьдесят точка два учебника.',
      'Exercise fifty point two.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi: o'n besh, yigirma, yigirma besh. Bu mashhur uchlik va uni Pifagor teoremasi bilan tekshirish mumkin: ikki yuz yigirma besh qo'shuv to'rt yuz olti yuz yigirma besh.",
      'Все три найдены: пятнадцать, двадцать, двадцать пять. Это известная тройка, и её можно проверить теоремой Пифагора: двести двадцать пять плюс четыреста шестьсот двадцать пять.',
      'All three are found: fifteen, twenty, twenty five. A famous triple, checkable by Pythagoras: two hundred twenty five plus four hundred is six hundred twenty five.',
    ),
    tasks: [
      {
        expr: 'AD = 9,   BD = 16',
        question: L('Balandlik nechaga teng?', 'Чему равна высота?', 'What is the altitude?'),
        ok: L("Ha, o'n ikki. Bir yuz qirq to'rtning ildizi.", 'Да, двенадцать. Корень из ста сорока четырёх.', 'Yes, twelve. The root of one hundred forty four.'),
        items: [
          { id: 'a', right: true, label: '12' },
          { id: 'b', label: '25', hint: L("Yigirma besh bu ikkita bo'lakning YIG'INDISI, ya'ni gipotenuza. Balandlik uchun ko'paytmadan ildiz olinadi.", 'Двадцать пять это СУММА кусков, то есть гипотенуза. Для высоты берут корень из произведения.', 'Twenty five is the SUM of the pieces, the hypotenuse. The altitude is the root of the product.') },
        ],
        solution: ['h² = 9 · 16 = 144', 'h = 12'],
      },
      {
        expr: 'AB = 25,   AD = 9',
        question: L('AC katet nechaga teng?', 'Чему равен катет AC?', 'What is the leg AC?'),
        ok: L("Ha, o'n besh. Ikki yuz yigirma beshning ildizi.", 'Да, пятнадцать. Корень из двухсот двадцати пяти.', 'Yes, fifteen. The root of two hundred twenty five.'),
        items: [
          { id: 'a', right: true, label: '15' },
          { id: 'b', label: '9', hint: L("To'qqiz bu katetning PROYEKSIYASI, katetning o'zi emas. Yigirma besh karra to'qqizdan ildiz oling.", 'Девять это ПРОЕКЦИЯ катета, а не сам катет. Возьми корень из двадцати пяти на девять.', 'Nine is the PROJECTION of the leg, not the leg. Take the root of twenty five times nine.') },
        ],
        solution: ['AC² = 25 · 9 = 225', 'AC = 15'],
      },
      {
        expr: 'AB = 25,   BD = 16',
        question: L('BC katet nechaga teng?', 'Чему равен катет BC?', 'What is the leg BC?'),
        ok: L("Ha, yigirma. To'rt yuzning ildizi.", 'Да, двадцать. Корень из четырёхсот.', 'Yes, twenty. The root of four hundred.'),
        items: [
          { id: 'a', right: true, label: '20' },
          { id: 'b', label: '16', hint: L("O'n olti bu proyeksiya. Katet uchun yigirma besh karra o'n oltini hisoblang va ildiz oling.", 'Шестнадцать это проекция. Для катета посчитай двадцать пять на шестнадцать и возьми корень.', 'Sixteen is the projection. For the leg compute twenty five times sixteen and take the root.') },
        ],
        solution: ['BC² = 25 · 16 = 400', 'BC = 20'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — teskari yo'nalish.
// ============================================================
const S10 = {
  eyebrow: L('TESKARI YO\'NALISH', 'В ОБРАТНУЮ СТОРОНУ', 'THE OTHER DIRECTION'),
  title: L(
    "Tomonlar ma'lum, proyeksiya qidiriladi",
    'Стороны известны, ищут проекцию',
    'The sides are known, a projection is wanted',
  ),
  audio: [
    A('mount',
      "Ikkita masala. Ularda tomonlar berilgan, proyeksiyani esa topish kerak.",
      'Две задачи. В них даны стороны, а найти нужно проекцию.',
      'Two problems. The sides are given and a projection is wanted.'),
    A('why',
      "Formulani teskari o'girish kerak. Proyeksiya katetning kvadratini gipotenuzaga bo'lgan natija.",
      'Формулу нужно развернуть. Проекция это квадрат катета, делённый на гипотенузу.',
      'Turn the formula around. A projection is the leg squared over the hypotenuse.'),
  ],
  props: {
    stepLabel: L('Masala', 'Задача', 'Problem'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham yechildi. Ikkinchisi darslikning ellik nuqta uchinchi mashqi va u ikkita qadamni talab qildi: avval Pifagor, keyin proyeksiya.",
      'Обе решены. Вторая это задача пятьдесят точка три учебника, и она потребовала двух шагов: сначала Пифагор, потом проекция.',
      'Both are solved. The second is exercise fifty point three and it needed two steps: Pythagoras first, then the projection.',
    ),
    tasks: [
      {
        expr: 'AB = 20,   AC = 10',
        question: L('AD proyeksiya nechaga teng?', 'Чему равна проекция AD?', 'What is the projection AD?'),
        ok: L("Ha, besh. Yuz bo'lingan yigirma.", 'Да, пять. Сто на двадцать.', 'Yes, five. One hundred over twenty.'),
        items: [
          { id: 'a', right: true, label: '5' },
          { id: 'b', label: '10', hint: L("O'n bu katetning o'zi. Proyeksiya uchun uning kvadratini gipotenuzaga bo'ling: yuz bo'lingan yigirma.", 'Десять это сам катет. Для проекции раздели его квадрат на гипотенузу: сто на двадцать.', 'Ten is the leg itself. For the projection divide its square by the hypotenuse: one hundred over twenty.') },
        ],
        solution: ['AD = 10² : 20', 'AD = 5'],
      },
      {
        expr: 'AB = 15,   AC = 9',
        question: L(
          "Ikkinchi katetning proyeksiyasi nechaga teng?",
          'Чему равна проекция второго катета?',
          'What is the projection of the other leg?',
        ),
        ok: L(
          "Ha, to'qqiz butun olti o'ndan. Ikkinchi katet o'n ikkiga teng, uning kvadrati bir yuz qirq to'rt.",
          'Да, девять целых шесть десятых. Второй катет равен двенадцати, его квадрат сто сорок четыре.',
          'Yes, nine point six. The other leg is twelve and its square is one hundred forty four.',
        ),
        items: [
          { id: 'a', right: true, label: '9,6' },
          { id: 'b', label: '5,4', hint: L("Besh butun to'rt o'ndan bu BIRINCHI katetning proyeksiyasi: sakson bir bo'lingan o'n besh. Savol esa ikkinchisi haqida.", 'Пять целых четыре десятых это проекция ПЕРВОГО катета: восемьдесят один на пятнадцать. А вопрос про второй.', 'Five point four is the projection of the FIRST leg: eighty one over fifteen. The question is about the other one.') },
        ],
        solution: ['BC² = 225 − 81 = 144', 'BD = 144 : 15 = 9,6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — yuz.
// ============================================================
const S11 = {
  eyebrow: L('YUZ', 'ПЛОЩАДЬ', 'THE AREA'),
  title: L(
    "Proyeksiyalardan yuzgacha",
    'От проекций до площади',
    'From the projections to the area',
  ),
  audio: [
    A('mount',
      "Katetlarning gipotenuzadagi proyeksiyalari ikki va o'n sakkiz santimetr. Uchburchakning yuzini topish kerak.",
      'Проекции катетов на гипотенузу равны двум и восемнадцати сантиметрам. Нужно найти площадь треугольника.',
      'The projections of the legs on the hypotenuse are two and eighteen centimetres. Find the area.'),
    A('why',
      "Yuz uchun asos va balandlik kerak, ikkalasi ham shu ikkita sondan chiqadi.",
      'Для площади нужны основание и высота, и оба получаются из этих двух чисел.',
      'The area needs a base and an altitude, and both come from those two numbers.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Yuz oltmishga teng. Bu darslikning ellik nuqta yettinchi mashqi. Diqqat: bu yerda gipotenuza asos, balandlik esa unga tushirilgan, ya'ni katetlarni umuman hisoblash shart emas edi.",
      'Площадь равна шестидесяти. Это задача пятьдесят точка семь учебника. Обрати внимание: основанием здесь служит гипотенуза, а высота опущена на неё, то есть катеты считать было вовсе не нужно.',
      'The area is sixty. This is exercise fifty point seven. Note: the hypotenuse serves as the base with the altitude on it, so the legs never had to be computed.',
    ),
    tasks: [
      {
        expr: 'AD = 2,   BD = 18',
        question: L('Balandlik nechaga teng?', 'Чему равна высота?', 'What is the altitude?'),
        ok: L("Ha, olti. O'ttiz oltining ildizi.", 'Да, шесть. Корень из тридцати шести.', 'Yes, six. The root of thirty six.'),
        items: [
          { id: 'a', right: true, label: '6' },
          { id: 'b', label: '10', hint: L("O'n bu ikki va o'n sakkizning yarim yig'indisi, ya'ni o'rta arifmetik. Bu yerda esa ko'paytmadan ildiz olinadi.", 'Десять это полусумма двух и восемнадцати, то есть среднее арифметическое. А здесь берут корень из произведения.', 'Ten is the half sum of two and eighteen, the arithmetic mean. Here we take the root of the product.') },
        ],
        solution: ['h² = 2 · 18 = 36', 'h = 6'],
      },
      {
        expr: 'AB = 20,   h = 6',
        question: L('Uchburchakning yuzi nechaga teng?', 'Чему равна площадь треугольника?', 'What is the area of the triangle?'),
        ok: L("Ha, oltmish. Yigirma karra olti bo'lingan ikki.", 'Да, шестьдесят. Двадцать на шесть пополам.', 'Yes, sixty. Twenty times six over two.'),
        items: [
          { id: 'a', right: true, label: '60' },
          { id: 'b', label: '120', hint: L("Yuz formulasida ikkiga bo'lish bor: asos karra balandlik bo'lingan ikki.", 'В формуле площади есть деление на два: основание на высоту пополам.', 'The area formula halves the product: base times height over two.') },
        ],
        solution: ['S = 20 · 6 : 2', 'S = 60'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — o'rta arifmetik.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Javob deyarli to'g'ri, lekin noto'g'ri",
    'Ответ почти верный, но неверный',
    'The answer is nearly right, and wrong',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Proyeksiyalar to'qqiz va o'n olti. U balandlikni ularning o'rtasi deb olgan va o'n ikki butun besh o'ndan deb yozgan.",
      'Решение Камрона. Проекции девять и шестнадцать. Он взял высоту как середину между ними и записал двенадцать с половиной.',
      "Kamron's solution. The projections are nine and sixteen. He took the altitude as the middle between them and wrote twelve and a half."),
    A('why',
      "To'g'ri javob o'n ikki. Farq atigi yarim birlik, shuning uchun xato ko'zga tashlanmaydi.",
      'Верный ответ двенадцать. Разница всего пол единицы, поэтому ошибка не бросается в глаза.',
      'The right answer is twelve. The gap is only half a unit, so the slip does not catch the eye.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamronning javobi bilan uchburchak umuman mavjud bo'lmaydi. Bu yerda tekshirishning ishonchli yo'li bor: topilgan balandlik bilan katetlarni hisoblab, Pifagor teoremasiga qo'yib ko'rish. O'n ikki bilan hammasi joyiga tushadi, o'n ikki butun besh o'ndan bilan esa yo'q.",
      'С ответом Камрона такого треугольника вообще не существует. Здесь есть надёжная проверка: посчитать катеты по найденной высоте и подставить в теорему Пифагора. С двенадцатью всё сходится, с двенадцатью с половиной нет.',
      'With Kamron answer no such triangle exists at all. There is a reliable check: compute the legs from the altitude and test them by Pythagoras. Twelve fits, twelve and a half does not.',
    ),
    tasks: [
      {
        expr: 'AD = 9,   BD = 16   →   h = 12,5 ?',
        question: L(
          "Balandlik qanday topiladi?",
          'Как находят высоту?',
          'How is the altitude found?',
        ),
        ok: L(
          "To'g'ri, ko'paytmadan ildiz olinadi. To'qqiz karra o'n olti bir yuz qirq to'rt, ildizi o'n ikki.",
          'Верно, берут корень из произведения. Девять на шестнадцать сто сорок четыре, корень двенадцать.',
          'Correct, take the root of the product. Nine times sixteen is one hundred forty four, whose root is twelve.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ko'paytmadan ildiz olinadi", 'Берут корень из произведения', 'Take the root of the product'),
          },
          {
            id: 'b',
            label: L("Yarim yig'indi olinadi", 'Берут полусумму', 'Take the half sum'),
            hint: L(
              "Proporsiya AD ga CD teng CD ga BD ko'rinishida edi. Bunda CD ikki marta qatnashadi, ya'ni kvadratga chiqadi, yig'indi esa umuman paydo bo'lmaydi.",
              'Пропорция была AD к CD как CD к BD. В ней CD участвует дважды, то есть выходит в квадрат, а сумма не появляется вовсе.',
              'The proportion was AD to CD as CD to BD. There CD appears twice and becomes a square, while no sum ever shows up.',
            ),
          },
        ],
        solution: [
          'h² = 9 · 16 = 144',
          'h = 12',
          L('Kamron: (9 + 16) : 2 = 12,5', 'Камрон: (9 + 16) : 2 = 12,5', 'Kamron: (9 + 16) : 2 = 12.5'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — 42-darsga qaytish.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Bu sonni biz allaqachon ko'rganmiz",
    'Это число мы уже видели',
    'We have met this number before',
  ),
  audio: [
    A('mount',
      "42-darsda aylana bor edi. Diametrga perpendikulyar vatar uni bo'laklarga ajratardi va yarim vatar bo'laklarning o'rta geometrigiga teng edi.",
      'На 42 уроке была окружность. Перпендикулярная диаметру хорда делила его на куски, и половина хорды равнялась среднему геометрическому кусков.',
      'In lesson 42 there was a circle. A chord perpendicular to the diameter split it, and half the chord equalled the geometric mean of the pieces.'),
    A('why',
      "Bugun esa balandlik uchun aynan o'sha qoida chiqdi. Bu tasodifmi.",
      'А сегодня то же правило вышло для высоты. Случайность ли это.',
      'And today the same rule came out for the altitude. Is that a coincidence.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkita dars bitta chizmaga tayangan ekan. Yarim aylanaga ichki chizilgan uchburchakning uchidagi burchak to'g'ri burchak, demak diametr uning gipotenuzasi, perpendikulyar vatarning yarmi esa balandligi. Shuning uchun 42-darsning vatar qoidasi va bugungi balandlik qoidasi bitta va o'sha tenglik.",
      'Два урока опирались на один чертёж. Угол при вершине треугольника, вписанного в полуокружность, прямой, значит диаметр это его гипотенуза, а половина перпендикулярной хорды это высота. Поэтому правило хорд с 42 урока и сегодняшнее правило высоты это одно и то же равенство.',
      'Two lessons rested on one drawing. A triangle inscribed in a semicircle has a right angle, so the diameter is its hypotenuse and half the perpendicular chord is its altitude. Hence the chord rule of lesson 42 and today altitude rule are one equality.',
    ),
    tasks: [
      {
        expr: 'd = 25,   9   |   16',
        question: L(
          "42-darsning qoidasi bo'yicha yarim vatar nechaga teng?",
          'Чему равна половина хорды по правилу 42 урока?',
          'By the rule of lesson 42, what is half the chord?',
        ),
        ok: L(
          "Ha, o'n ikki. Bugungi balandlik bilan bir xil son.",
          'Да, двенадцать. То же число, что и сегодняшняя высота.',
          'Yes, twelve. The same number as today altitude.',
        ),
        items: [
          { id: 'a', right: true, label: '12' },
          {
            id: 'b',
            label: '12,5',
            hint: L(
              "42-darsda ham ko'paytma ishlatilgandi: to'qqiz karra o'n olti. Yig'indi u yerda ham paydo bo'lmagan.",
              'На 42 уроке тоже работало произведение: девять на шестнадцать. Сумма и там не появлялась.',
              'Lesson 42 also used the product: nine times sixteen. No sum appeared there either.',
            ),
          },
        ],
        solution: ['h² = 9 · 16', 'h = 12'],
      },
      {
        expr: '∠C = 90°',
        question: L(
          "Nega ikkala qoida bir xil chiqdi?",
          'Почему оба правила совпали?',
          'Why did the two rules coincide?',
        ),
        ok: L(
          "Ha. Yarim aylanaga ichki chizilgan uchburchak to'g'ri burchakli, demak bu bitta chizmaning ikkita nomi.",
          'Да. Треугольник, вписанный в полуокружность, прямоугольный, значит это один чертёж под двумя именами.',
          'Yes. A triangle inscribed in a semicircle is right angled, so this is one drawing under two names.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L(
              "Yarim aylanadagi uchburchak to'g'ri burchakli",
              'Треугольник в полуокружности прямоугольный',
              'A triangle in a semicircle is right angled',
            ),
          },
          {
            id: 'b',
            label: L('Tasodif', 'Совпадение', 'A coincidence'),
            hint: L(
              "Diametrga tiralgan ichki chizilgan burchak yarim aylanaga tiraladi, ya'ni to'qson daraja. Buni 37-darsda ko'rgandik.",
              'Вписанный угол, опирающийся на диаметр, опирается на полуокружность, то есть девяносто градусов. Мы видели это на 37 уроке.',
              'An inscribed angle on a diameter rests on a semicircle, that is ninety degrees. We saw it in lesson 37.',
            ),
          },
        ],
        solution: [
          L('diametr = gipotenuza', 'диаметр = гипотенуза', 'diameter = hypotenuse'),
          L('yarim vatar = balandlik', 'половина хорды = высота', 'half the chord = the altitude'),
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
    "Blits: ko'paytma, gipotenuza, kvadrat",
    'Блиц: произведение, гипотенуза, квадрат',
    'Blitz: product, hypotenuse, square',
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
        tag: 'orta-arifmetik-olish',
        ask: L(
          "Balandlik proyeksiyalar bilan qanday bog'langan?",
          'Как высота связана с проекциями?',
          'How is the altitude linked to the projections?',
        ),
        options: [
          { id: 'r', right: true, label: L("Kvadrati ko'paytmaga teng", 'Её квадрат равен произведению', 'Its square equals the product') },
          { id: 'w', label: L("O'zi yarim yig'indiga teng", 'Она равна полусумме', 'It equals the half sum') },
        ],
        ok: L(
          "To'g'ri. Bu o'rta geometrik, o'rta arifmetik emas.",
          'Верно. Это среднее геометрическое, а не арифметическое.',
          'Correct. That is the geometric mean, not the arithmetic one.',
        ),
        hint: L(
          "12-ekranni eslang: to'qqiz va o'n olti uchun yarim yig'indi o'n ikki butun besh o'ndan bergandi, to'g'ri javob esa o'n ikki.",
          'Вспомни 12 экран: для девяти и шестнадцати полусумма дала двенадцать с половиной, а верный ответ двенадцать.',
          'Recall screen 12: for nine and sixteen the half sum gave twelve and a half while the answer was twelve.',
        ),
      },
      {
        id: 'q2',
        tag: 'gipotenuza-proyeksiya-almashish',
        ask: L(
          "Katetning kvadrati nimaga teng?",
          'Чему равен квадрат катета?',
          'What does a leg squared equal?',
        ),
        options: [
          {
            id: 'r', right: true,
            label: L(
              "Gipotenuza karra o'z proyeksiyasi",
              'Гипотенуза на его проекцию',
              'The hypotenuse times its projection',
            ),
          },
          {
            id: 'w',
            label: L("Ikkita proyeksiyaning ko'paytmasi", 'Произведение двух проекций', 'The product of the two projections'),
          },
        ],
        ok: L(
          "To'g'ri. Ikkita proyeksiyaning ko'paytmasi balandlikning kvadrati edi.",
          'Верно. Произведение двух проекций было квадратом высоты.',
          'Correct. The product of the two projections was the altitude squared.',
        ),
        hint: L(
          "5-ekranni eslang: proporsiya AB ga AC teng AC ga AD ko'rinishida edi.",
          'Вспомни 5 экран: пропорция была AB к AC как AC к AD.',
          'Recall screen 5: the proportion was AB to AC as AC to AD.',
        ),
      },
      {
        id: 'q3',
        tag: 'kvadratni-unutish',
        ask: L(
          "Proyeksiyalar 4 va 9 bo'lsa, balandlik nechaga teng?",
          'Если проекции 4 и 9, чему равна высота?',
          'If the projections are 4 and 9, what is the altitude?',
        ),
        options: [
          { id: 'r', right: true, label: '6' },
          { id: 'w', label: '36' },
        ],
        ok: L(
          "To'g'ri. O'ttiz olti bu balandlikning KVADRATI, balandlikning o'zi esa olti.",
          'Верно. Тридцать шесть это КВАДРАТ высоты, а сама высота шесть.',
          'Correct. Thirty six is the altitude SQUARED, while the altitude itself is six.',
        ),
        hint: L(
          "Ko'paytmani hisoblang, keyin ildiz olishni unutmang.",
          'Посчитай произведение, а потом не забудь взять корень.',
          'Compute the product, then do not forget the root.',
        ),
      },
      {
        id: 'q4',
        tag: 'mos-tomonlarni-adashtirish',
        ask: L(
          "Balandlik uchburchakni nechta o'ziga o'xshash bo'lakka ajratadi?",
          'На сколько подобных ему частей высота делит треугольник?',
          'Into how many parts similar to itself does the altitude split the triangle?',
        ),
        options: [
          { id: 'r', right: true, label: L('Ikkitaga', 'На две', 'Into two') },
          { id: 'w', label: L('Bittasi o\'xshash, ikkinchisi yo\'q', 'Одна подобна, вторая нет', 'One is similar, the other is not') },
        ],
        ok: L(
          "To'g'ri, ikkalasi ham. Har birida to'g'ri burchak va kattasining bitta o'tkir burchagi bor.",
          'Верно, обе. В каждой есть прямой угол и один острый угол большого треугольника.',
          'Correct, both. Each has a right angle and one acute angle of the large triangle.',
        ),
        hint: L(
          "1-ekranni eslang: A burchagi birinchi bo'lakda, B burchagi esa ikkinchisida umumiy bo'lib qolgandi.",
          'Вспомни 1 экран: угол A остался общим в первой части, а угол B во второй.',
          'Recall screen 1: the angle A stayed shared in one part and the angle B in the other.',
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
    "Bitta balandlik uchta tenglik berdi",
    'Одна высота дала три равенства',
    'One altitude gave three equalities',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda bitta kesma chizmani uchta bir xil shaklga ajratgandi.",
      'На первом экране один отрезок разделил чертёж на три фигуры одной формы.',
      'On the first screen one segment split the drawing into three shapes of one form.'),
    A('s1',
      "Siz balandlik va katetlar uchun tengliklarni chiqardingiz, Pifagor teoremasini ulardan oldingiz va 42-dars bilan bog'lanishni topdingiz.",
      'Ты вывел равенства для высоты и катетов, получил из них теорему Пифагора и нашёл связь с 42 уроком.',
      'You derived the equalities for the altitude and the legs, got Pythagoras out of them, and found the link with lesson 42.'),
    A('s2',
      "Keyingi darsda o'tkir burchakning sinusi, kosinusi va tangensi.",
      'В следующем уроке синус, косинус и тангенс острого угла.',
      'The next lesson covers the sine, cosine and tangent of an acute angle.'),
  ],
  props: {
    mark: 'h² = AD · BD',
    markNote: L(
      "katet uchun: AC² = AB · AD",
      'для катета: AC² = AB · AD',
      'for a leg: AC² = AB · AD',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: sinus, kosinus, tangens',
      'Следующий урок: синус, косинус, тангенс',
      'Next lesson: sine, cosine, tangent',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     ...S1 },
  { role: 'support',  tag: 'mos-tomonlarni-adashtirish', ...S2 },
  { role: 'explain',  tag: 'mos-tomonlarni-adashtirish', ...S3 },
  { role: 'explain',  tag: 'orta-arifmetik-olish', ...S4 },
  { role: 'explain',  tag: 'gipotenuza-proyeksiya-almashish', ...S5 },
  { role: 'explain',  tag: 'gipotenuza-proyeksiya-almashish', ...S6 },
  { role: 'explain',  tag: 'kvadratni-unutish', ...S7 },
  { role: 'rule',     tag: 'mos-tomonlarni-adashtirish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'gipotenuza-proyeksiya-almashish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'gipotenuza-proyeksiya-almashish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'orta-arifmetik-olish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'orta-arifmetik-olish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'orta-arifmetik-olish', ...S13 },
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
