# DARS03_AMALIYOT_KONTENT — 9-sinf, 3-dars amaliyoti, o'nta topshiriqning to'liq matni

> **2-bosqich (KONTENT).** Kirish: `DARS02_04_AMALIYOT_SKELET.md` (metodist tasdiqlagan,
> 2026-08-27), `TIPLAR_AMALIYOT_9SINF.md`, `src/components/grade9/Dars03.jsx`.
> Chiqish: `src/components/grade9/practice/dars03/D03_01…10.jsx`.
>
> Qoidalar `DARS01_AMALIYOT_KONTENT.md` §0 bilan bir xil.

## 0. SARLAVHA VA CHIP QATORI

```
HEAD = {
  uz: "Dars 3 amaliyoti — 10 topshiriq (kvadrat funksiya)",
  ru: "Практика урока 3 — 10 заданий (квадратичная функция)",
  en: "Lesson 3 practice — 10 tasks (the quadratic function)",
}
```

| № | Mexanika | uz | ru | en |
|---:|---|---|---|---|
| 01 | TrueFalse | Ha yoki yo'q | Да или нет | Yes or no |
| 02 | Choice | Yozuv | Запись | Record |
| 03 | RowTable | Jadval | Таблица | Table |
| 04 | TypeSet | Nollar | Нули | Zeros |
| 05 | Zones | Guruhlar | Группы | Groups |
| 06 | PlacePoint | Uchi | Вершина | Vertex |
| 07 | DomainAxis | O'q | Ось | Axis |
| 08 | ClozeBank | So'zlar | Слова | Words |
| 09 | OrderLines | Tartib | Порядок | Order |
| 10 | AuditLines | Xato qator | Ошибочная строка | Wrong line |

---

# 01 · `TrueFalse` · 🟢 · teg `tenglama-vs-funksiya`

**MA'LUMOT.**

```
given: y = 3x² − 12
items: s1 yes: true   — belgilar: y = 3x² − 12
       s2 yes: false  — belgilar: 3x² − 12 = 0
       s3 yes: false  — belgilar: a = 0
```

**UZ.**
- eyebrow: `Ha yoki yo'q`
- setup: `Bitta yozuv berilgan, uch mulohaza esa uning haqida.`
- ask: `Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.`
- s1: `bu yozuv kvadrat funksiya.`
- s2: `bu yozuv ham kvadrat funksiya.`
- s3: `bo'lganda ham funksiya kvadrat bo'lib qolaveradi.`
- correctText: `To'g'ri, uchtasi ham. Funksiyada har bir iks ga igrek mos keladi, tenglamada esa igrek yo'q: u faqat ma'lum iks larda bajariladi. Ikkinchisi birinchisidan chiqadi — tenglama funksiyaning nollarini topayotganda paydo bo'ladi. a nolga teng bo'lsa esa iks kvadrat butunlay yo'qoladi va chiziqli funksiya qoladi.`
- wrong (s2): `Bu yozuvda igrek yo'q. Tenglama faqat ayrim iks larda bajariladi, funksiya esa har bir iks ga qiymat beradi.`
- wrong (s3): `a ni nolga tenglashtiring va yozuvni qaytadan o'qing: iks kvadrat qoladimi? Uchni nolga ko'paytiring.`
- wrong (s1): `Yozuvda iks kvadrat bor, uning oldidagi son nolga teng emas. Kvadrat funksiyaning ta'rifi shundan boshqa narsa talab qilmaydi.`
- wrongText: `Ikkita savol bering: yozuvda igrek bormi, va iks kvadrat oldidagi son nolga teng emasmi?`

**RU.**
- eyebrow: `Да или нет`
- setup: `Дана одна запись, а три суждения — про неё.`
- ask: `Для каждого суждения выбери «Да» или «Нет».`
- s1: `эта запись — квадратичная функция.`
- s2: `эта запись тоже квадратичная функция.`
- s3: `даже при этом функция останется квадратичной.`
- correctText: `Верно, все три. У функции каждому икс отвечает игрек, а в уравнении игрека нет: оно выполняется лишь при некоторых икс. Второе получается из первого — уравнение появляется, когда ищут нули функции. А если a равно нулю, икс в квадрате исчезает совсем и остаётся линейная функция.`
- wrong (s2): `В этой записи нет игрека. Уравнение выполняется лишь при отдельных икс, а функция даёт значение при каждом икс.`
- wrong (s3): `Приравняй a к нулю и перечитай запись: останется ли икс в квадрате? Умножь тройку на нуль.`
- wrong (s1): `В записи есть икс в квадрате, и число перед ним не равно нулю. Больше определение квадратичной функции ничего не требует.`
- wrongText: `Задай два вопроса: есть ли в записи игрек и не равно ли нулю число перед икс в квадрате?`

**EN.**
- eyebrow: `Yes or no`
- setup: `One record is given, and three claims are about it.`
- ask: `Choose "Yes" or "No" for each claim.`
- s1: `this record is a quadratic function.`
- s2: `this record is a quadratic function too.`
- s3: `even then the function stays quadratic.`
- correctText: `Correct, all three. A function gives a y for every x, while an equation has no y: it holds only at particular x. The second comes out of the first — an equation appears when the zeros of the function are being found. And if a is zero, x squared disappears altogether and a linear function is left.`
- wrong (s2): `This record has no y. An equation holds only at particular x, while a function gives a value at every x.`
- wrong (s3): `Set a to zero and read the record again: is x squared still there? Multiply the three by zero.`
- wrong (s1): `The record has x squared and the number in front of it is not zero. The definition of a quadratic function asks for nothing more.`
- wrongText: `Ask two questions: does the record have a y, and is the number in front of x squared non-zero?`

---

# 02 · `Choice` · 🟢 · teg `nol-koeff-a`

**MA'LUMOT.**

```
correct: 2 ; optCols: 1 ; optSize: 18
opts: 0: y = x² − 7
      1: y = 5x² + x
      2: y = 0·x² + 4x − 1      ← kvadrat funksiya EMAS
      3: y = −x² + 2x + 9
```

Variantlar MATEMATIKA, `L()` dan tashqarida.

**UZ.**
- eyebrow: `Yozuv`
- setup: `To'rtta yozuv. Uchtasi kvadrat funksiya, bittasi esa yo'q.`
- ask: `Qaysi yozuv kvadrat funksiya emas?`
- correctText: `To'g'ri. Iks kvadrat oldidagi son nolga teng, demak butun had yo'qoladi va to'rt iks minus bir qoladi — bu chiziqli funksiya. Ta'rifdagi a nolga teng emas degan shart aynan shuning uchun turibdi.`
- wrong (0): `Bu yerda iks kvadrat oldida bir turibdi, u yozilmagan xolos. Bir esa nolga teng emas.`
- wrong (1): `Iks kvadrat oldida besh turibdi. b va c ning qanday bo'lishi ta'rifda cheklanmagan: c umuman bo'lmasligi ham mumkin.`
- wrong (3): `Iks kvadrat oldida minus bir turibdi. Manfiy son ham nolga teng emas — u faqat parabolani pastga buradi.`
- wrongText: `Har yozuvda iks kvadrat oldidagi songa qarang. Ulardan qaysi biri nolga teng?`

**RU.**
- eyebrow: `Запись`
- setup: `Четыре записи. Три из них — квадратичные функции, а одна нет.`
- ask: `Какая запись не является квадратичной функцией?`
- correctText: `Верно. Число перед икс в квадрате равно нулю, значит всё слагаемое исчезает и остаётся четыре икс минус один — это линейная функция. Условие «a не равно нулю» в определении стоит именно поэтому.`
- wrong (0): `Здесь перед икс в квадрате стоит единица, просто она не написана. А единица нулю не равна.`
- wrong (1): `Перед икс в квадрате стоит пятёрка. На b и c определение ограничений не ставит: c может и вовсе отсутствовать.`
- wrong (3): `Перед икс в квадрате стоит минус единица. Отрицательное число тоже не равно нулю — оно лишь разворачивает параболу вниз.`
- wrongText: `Посмотри в каждой записи на число перед икс в квадрате. Какое из них равно нулю?`

**EN.**
- eyebrow: `Record`
- setup: `Four records. Three of them are quadratic functions, one is not.`
- ask: `Which record is not a quadratic function?`
- correctText: `Correct. The number in front of x squared is zero, so the whole term disappears and four x minus one is left — a linear function. That is exactly why the definition says a is not zero.`
- wrong (0): `Here the number in front of x squared is one, it is simply not written. And one is not zero.`
- wrong (1): `In front of x squared there is a five. The definition puts no limits on b and c: c may be missing altogether.`
- wrong (3): `In front of x squared there is minus one. A negative number is not zero either — it only turns the parabola downward.`
- wrongText: `Look at the number in front of x squared in each record. Which of them is zero?`

---

# 03 · `RowTable` · 🟢 · teg `nol-vs-vershina`

**Nima tekshiriladi.** Jadvalda nollar ham (`−3` va `3`), uchi ham (`0`) ko'rinib turadi.
Teskari katak ATAYIN uchiga qo'yilgan: qolgan qiymatlar ikkita `x` da uchraydi, uchining
qiymati esa bitta `x` da — shuning uchun katak bir qiymatli.

**MA'LUMOT.**

```
expr: y = x² − 9
cols:  x : −3   ?    2    3
       y :  0  −9    ?    0
javob: x = 0 ; y(2) = −5
hints: 9 | −9 x katagida | 3 yoki −3 | −13
```

**UZ.**
- eyebrow: `Jadval`
- setup: `Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.`
- ask: `Ikkita bo'sh katakni to'ldiring.`
- correctText: `To'g'ri. Minus to'qqiz qiymati faqat bitta joyda, nolda chiqadi — bu parabolaning uchi. Nol qiymati esa ikki joyda: minus uchda va uchda. Ular funksiyaning nollari. Jadvalning o'zi uchini nollardan ajratib turibdi.`
- wrong (bo'sh `x` katagida −9): `Bu katak yuqori qatorda, u yerga argument yoziladi. Minus to'qqiz — qiymat; savol esa u qaysi iks da chiqishi haqida.`
- wrong (bo'sh `x` katagida 3 yoki −3): `Uch va minus uchda qiymat nolga teng, minus to'qqizga emas. Ular funksiyaning nollari, uchi esa boshqa joyda.`
- wrong (`y(2)` = 13 yoki −13): `Ikkining kvadrati to'rt. Undan to'qqizni ayiring: natija musbat bo'ladimi yoki manfiy?`
- wrong (`y(2)` = 5): `Ishora teskari olindi: to'rtdan to'qqiz ayrilyapti, teskarisi emas.`
- wrongText: `To'ldirgan katagingizni formulaga qo'yib tekshiring: shu sonning kvadratidan to'qqiz ayirilsa nima chiqadi?`

**RU.**
- eyebrow: `Таблица`
- setup: `Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.`
- ask: `Заполни две пустые клетки.`
- correctText: `Верно. Значение минус девять получается только в одном месте, при нуле — это вершина параболы. А значение нуль — в двух: при минус трёх и при трёх. Это нули функции. Сама таблица отделяет вершину от нулей.`
- wrong (в пустой `x` стоит −9): `Эта клетка в верхней строке, туда пишут аргумент. Минус девять — это значение; вопрос в том, при каком икс оно получается.`
- wrong (в пустой `x` стоит 3 или −3): `При трёх и минус трёх значение равно нулю, а не минус девяти. Это нули функции, а вершина в другом месте.`
- wrong (`y(2)` = 13 или −13): `Два в квадрате — четыре. Вычти из неё девять: результат будет положительным или отрицательным?`
- wrong (`y(2)` = 5): `Знак взят наоборот: из четырёх вычитают девять, а не наоборот.`
- wrongText: `Проверь заполненную клетку подстановкой: что выйдет, если из квадрата этого числа вычесть девять?`

**EN.**
- eyebrow: `Table`
- setup: `The top row is the argument, the bottom row is the value. The table is filled from the formula.`
- ask: `Fill in the two empty cells.`
- correctText: `Correct. The value minus nine appears in one place only, at zero — that is the vertex of the parabola. The value zero appears in two: at minus three and at three. Those are the zeros of the function. The table itself separates the vertex from the zeros.`
- wrong (−9 in the empty `x`): `This cell is in the top row, and the argument goes there. Minus nine is a value; the question is at which x it appears.`
- wrong (3 or −3 in the empty `x`): `At three and minus three the value is zero, not minus nine. Those are the zeros of the function; the vertex is elsewhere.`
- wrong (`y(2)` = 13 or −13): `Two squared is four. Subtract nine from it: is the result positive or negative?`
- wrong (`y(2)` = 5): `The sign was taken the other way: nine is subtracted from four, not the reverse.`
- wrongText: `Check the cell you filled by substitution: what do you get if you subtract nine from the square of that number?`

---

# 04 · `TypeSet` · 🟡 · teg `nol-vs-vershina`

**MA'LUMOT.**

```
expr: y = x² − 6x
answer: { 0 ; 6 }
hints: 6 | 0 | 3 | −6
```

**UZ.**
- eyebrow: `Nollar`
- setup: `Funksiyaning noli — y nolga aylanadigan x qiymati.`
- ask: `Funksiyaning barcha nollarini yozing.`
- correctText: `To'g'ri, ikkita nol. Iksni qavsdan chiqarsak, iks ko'paytiruv iks minus olti hosil bo'ladi. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi kifoya, shuning uchun nollar ham ikkita.`
- wrong (faqat 6): `Bitta nol topildi, ikkinchisi qoldi. Iksni qavsdan chiqaring: ikkita ko'paytuvchi hosil bo'ladi, va ularning har biri alohida nolga aylanishi mumkin.`
- wrong (faqat 0): `Ikkinchi ko'paytuvchi qaysi sonda nolga aylanadi? Iks minus oltini nolga tenglashtiring.`
- wrong (3): `Uch — parabolaning uchi turgan joy, undagi qiymat esa nolga teng emas. Nol so'ralyapti, uchi emas.`
- wrong (−6): `Belgi teskari olindi. Iks minus olti nolga teng bo'lsa, iks nimaga teng?`
- wrongText: `Topgan har bir soningizni formulaga qo'ying. Igrek nol chiqdimi? Chiqmagan bo'lsa, u son nol emas.`

**RU.**
- eyebrow: `Нули`
- setup: `Нуль функции — это значение x, при котором y обращается в нуль.`
- ask: `Выпиши все нули функции.`
- correctText: `Верно, два нуля. Если вынести икс за скобку, получится икс умножить на икс минус шесть. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя, поэтому и нулей два.`
- wrong (только 6): `Один нуль найден, второй остался. Вынеси икс за скобку: получатся два множителя, и каждый может обратиться в нуль отдельно.`
- wrong (только 0): `При каком числе обращается в нуль второй множитель? Приравняй икс минус шесть к нулю.`
- wrong (3): `Три — это место вершины параболы, и значение там нулю не равно. Спрашивают нули, а не вершину.`
- wrong (−6): `Знак взят наоборот. Если икс минус шесть равно нулю, чему равен икс?`
- wrongText: `Подставь каждое найденное число в формулу. Получился ли игрек нуль? Если нет, это число не нуль функции.`

**EN.**
- eyebrow: `Zeros`
- setup: `A zero of a function is a value of x at which y becomes zero.`
- ask: `Write all the zeros of the function.`
- correctText: `Correct, two zeros. Taking x out as a factor gives x times x minus six. A product becomes zero as soon as one factor is zero, so there are two zeros as well.`
- wrong (only 6): `One zero found, the other left behind. Take x out as a factor: two factors appear, and each can become zero on its own.`
- wrong (only 0): `At which number does the second factor become zero? Set x minus six equal to zero.`
- wrong (3): `Three is where the vertex of the parabola stands, and the value there is not zero. Zeros are asked for, not the vertex.`
- wrong (−6): `The sign was taken the other way. If x minus six equals zero, what does x equal?`
- wrongText: `Put each number you found into the formula. Did y come out zero? If not, that number is not a zero.`

---

# 05 · `Zones` · 🟡 · teg `a-kattaligi-ishorasi`

**MA'LUMOT.**

```
zones: A «y = x² dan tor, yuqoriga» | B «y = x² dan keng, yuqoriga» | C «pastga qaragan»
items:  i1 y = 4x²     → A      i4 y = 0,5x²   → B
        i2 y = 3x²     → A      i5 y = −5x²    → C
        i3 y = 0,2x²   → B      i6 y = −0,5x²  → C
```

Solishtirish asosi `y = x²` — shartda aytiladi.

**UZ.**
- eyebrow: `Guruhlar`
- zona A: `y = x² dan tor, yuqoriga` · zona B: `y = x² dan keng, yuqoriga` · zona C: `Pastga qaragan`
- setup: `Hamma yozuv y = x² bilan solishtiriladi. Guruhni a soni hal qiladi: uning ishorasi ham, kattaligi ham.`
- ask: `Har bir yozuvni o'z guruhiga qo'ying.`
- correctText: `To'g'ri. a ning ISHORASI tarmoqlar qayoqqa qarashini hal qiladi, KATTALIGI esa parabola qanchalik tor ekanini. Birdan katta son parabolani toraytiradi, birdan kichigi kengaytiradi. Bu ikki narsa alohida: manfiy son ham tor, ham keng parabola berishi mumkin.`
- wrong (i3 yoki i4 → A): `Nol butun bir necha son bilan ko'paytirilgan qiymat kichrayadi, ya'ni parabola pastroq va KENGROQ bo'ladi. Bir nechta iks ga qiymatni hisoblab solishtiring.`
- wrong (i5 yoki i6 → A yoki B): `Bu guruhni kattalik emas, ISHORA hal qiladi: a manfiy bo'lsa, tarmoqlar pastga qaraydi.`
- wrong (i6 → A): `Minus nol butun besh manfiy, demak parabola pastga qaraydi. Kengligi esa boshqa savol.`
- wrong (i1 yoki i2 → B): `To'rt va uch birdan katta, ya'ni qiymatlar tezroq o'sadi va parabola torayadi.`
- wrongText: `Har yozuvga ikkita savol bering: a musbatmi yoki manfiy, va u birdan kattami yoki kichik?`

**RU.**
- eyebrow: `Группы`
- зона A: `Уже, чем y = x², вверх` · зона B: `Шире, чем y = x², вверх` · зона C: `Направлена вниз`
- setup: `Все записи сравниваются с y = x². Группу решает число a: и его знак, и его величина.`
- ask: `Разложи каждую запись в свою группу.`
- correctText: `Верно. ЗНАК a решает, куда смотрят ветви, а ВЕЛИЧИНА — насколько парабола узкая. Число больше единицы сужает параболу, меньше единицы — расширяет. Это две отдельные вещи: отрицательное число может дать и узкую, и широкую параболу.`
- wrong (i3 или i4 → A): `При умножении на число меньше единицы значения уменьшаются, то есть парабола становится ниже и ШИРЕ. Посчитай значения при нескольких икс и сравни.`
- wrong (i5 или i6 → A или B): `Эту группу решает не величина, а ЗНАК: если a отрицательно, ветви смотрят вниз.`
- wrong (i6 → A): `Минус ноль целых пять — отрицательное число, значит парабола направлена вниз. Ширина — отдельный вопрос.`
- wrong (i1 или i2 → B): `Четыре и три больше единицы, значит значения растут быстрее и парабола сужается.`
- wrongText: `Задай каждой записи два вопроса: a положительное или отрицательное, и оно больше единицы или меньше?`

**EN.**
- eyebrow: `Groups`
- zone A: `Narrower than y = x², upward` · zone B: `Wider than y = x², upward` · zone C: `Opening downward`
- setup: `Every record is compared with y = x². The group is decided by a: both its sign and its size.`
- ask: `Put each record into its own group.`
- correctText: `Correct. The SIGN of a decides which way the branches point, and its SIZE decides how narrow the parabola is. A number bigger than one narrows the parabola, a number smaller than one widens it. These are two separate things: a negative number can give either a narrow or a wide parabola.`
- wrong (i3 or i4 → A): `Multiplying by a number smaller than one makes the values smaller, so the parabola gets lower and WIDER. Compute values at a few x and compare.`
- wrong (i5 or i6 → A or B): `This group is decided not by size but by SIGN: if a is negative, the branches point downward.`
- wrong (i6 → A): `Minus nought point five is negative, so the parabola opens downward. Its width is a separate question.`
- wrong (i1 or i2 → B): `Four and three are bigger than one, so the values grow faster and the parabola narrows.`
- wrongText: `Ask two questions of every record: is a positive or negative, and is it bigger or smaller than one?`

---

# 06 · `PlacePoint` + parabola · 🟡 · teg `nol-vs-vershina`

**MA'LUMOT.**

```
curve:  y = x² − 2x − 3   (nollari −1 va 3, uchi (1; −4))
plane:  x ∈ [−3; 5], y ∈ [−5; 4]
answer: (1; −4)
table:  YO'Q
zonalar: (−1; 0) va (3; 0) — nollar ; (1; 0) — uchining faqat abssissasi
```

**UZ.**
- eyebrow: `Uchi`
- setup: `Tekislikda parabola chizilgan. Uchi — grafikning burilish nuqtasi.`
- ask: `Parabolaning uchini belgilang.`
- correctText: `To'g'ri. Uchi — grafik pastga tushishdan to'xtab, ko'tarila boshlaydigan nuqta. Uning ikkala soni ham bor: abssissasi bir, ordinatasi minus to'rt. Nollar esa boshqa nuqtalar — ular grafik gorizontal o'qni kesgan joyda turibdi.`
- wrong (−1; 0) yoki (3; 0): `Bu nuqtalar funksiyaning NOLLARI: u yerda qiymat nolga teng. Uchi esa grafikning eng past nuqtasi, u gorizontal o'qdan pastda.`
- wrong (1; 0): `Abssissa to'g'ri topildi, ordinata esa gorizontal o'qdan olindi. Shu abssissada grafik qaysi balandlikda turibdi?`
- wrong (boshqa nuqta): `Grafikni chapdan o'ngga kuzating: u qaysi nuqtada tushishdan to'xtab, ko'tarila boshlaydi?`
- wrongText: `Uchi — burilish nuqtasi, va u grafikning O'ZIDA yotadi. Uni gorizontal o'qdan emas, chiziqdan qidiring.`

**RU.**
- eyebrow: `Вершина`
- setup: `На плоскости построена парабола. Вершина — это точка поворота графика.`
- ask: `Отметь вершину параболы.`
- correctText: `Верно. Вершина — точка, где график перестаёт опускаться и начинает подниматься. У неё есть оба числа: абсцисса единица, ордината минус четыре. А нули — другие точки, они там, где график пересекает горизонтальную ось.`
- wrong (−1; 0) или (3; 0): `Это НУЛИ функции: там значение равно нулю. А вершина — самая нижняя точка графика, она ниже горизонтальной оси.`
- wrong (1; 0): `Абсцисса найдена верно, а ордината взята с горизонтальной оси. На какой высоте стоит график при этой абсциссе?`
- wrong (другая точка): `Проследи график слева направо: в какой точке он перестаёт опускаться и начинает подниматься?`
- wrongText: `Вершина — точка поворота, и лежит она на САМОМ графике. Ищи её не на горизонтальной оси, а на линии.`

**EN.**
- eyebrow: `Vertex`
- setup: `A parabola is drawn on the plane. The vertex is the turning point of the graph.`
- ask: `Mark the vertex of the parabola.`
- correctText: `Correct. The vertex is where the graph stops falling and starts rising. It has both numbers: abscissa one, ordinate minus four. The zeros are different points — they sit where the graph crosses the horizontal axis.`
- wrong (−1; 0) or (3; 0): `These are the ZEROS of the function: the value there is zero. The vertex is the lowest point of the graph, below the horizontal axis.`
- wrong (1; 0): `The abscissa is right, but the ordinate was taken from the horizontal axis. At what height does the graph stand at that abscissa?`
- wrong (another point): `Follow the graph from left to right: at which point does it stop falling and start rising?`
- wrongText: `The vertex is the turning point, and it lies on the GRAPH itself. Look for it on the line, not on the horizontal axis.`

---

# 07 · `DomainAxis` · 🟡 · teg `nol-vs-vershina`

**MA'LUMOT.**

```
expr: y = x² − 4
axis: [−6; 6]
answer: { at: 2, closed: false, dir: right }
```

Nuqta BO'SH: `x = 2` da qiymat nolga teng, nol esa musbat emas.

**UZ.**
- eyebrow: `O'q`
- setup: `O'qda uchta narsa ko'rsatiladi: chegara qayerda, u oraliqqa kiradimi va oraliq qaysi tomonga ketadi.`
- ask: `Funksiya qaysi x lardan boshlab musbat qiymat oladi? O'qda ko'rsating.`
- correctText: `To'g'ri. Chegara ikkida, nuqta bo'sh, oraliq o'ngga ketadi. Ikkida qiymat nolga teng, nol esa musbat emas — shuning uchun chegaraning o'zi oraliqqa kirmaydi. Undan o'ngda esa iks kvadrat to'rtdan katta bo'lib qoladi.`
- wrong (chegara to'g'ri, nuqta bo'yalgan): `Ikkini formulaga qo'ying: to'rt minus to'rt, ya'ni nol. Nol musbat sonmi?`
- wrong (chegara 4 da): `Chegara iks ning qiymati, iks kvadratniki emas. Iks kvadrat to'rtga teng bo'lsa, iks nimaga teng?`
- wrong (yo'nalish chapga): `Uchni qo'yib ko'ring: to'qqiz minus to'rt, ya'ni besh — musbat. Uch chegaradan qaysi tomonda turibdi?`
- wrongText: `Ikkita savol: qiymat qaysi sonda nolga aylanadi, va o'sha sonning o'zi javobga kiradimi?`

**RU.**
- eyebrow: `Ось`
- setup: `На оси показывают три вещи: где граница, входит ли она в промежуток и в какую сторону промежуток идёт.`
- ask: `Начиная с каких x функция принимает положительные значения? Отметь на оси.`
- correctText: `Верно. Граница в двойке, точка пустая, промежуток идёт вправо. При двух значение равно нулю, а нуль не положителен — поэтому сама граница в промежуток не входит. Правее икс в квадрате становится больше четырёх.`
- wrong (граница верна, точка закрашена): `Подставь двойку в формулу: четыре минус четыре, то есть нуль. Является ли нуль положительным числом?`
- wrong (граница в 4): `Граница — это значение икс, а не икс в квадрате. Если икс в квадрате равен четырём, чему равен икс?`
- wrong (направление влево): `Подставь тройку: девять минус четыре, то есть пять — положительно. С какой стороны от границы стоит тройка?`
- wrongText: `Два вопроса: при каком числе значение обращается в нуль и входит ли само это число в ответ?`

**EN.**
- eyebrow: `Axis`
- setup: `The axis shows three things: where the boundary is, whether it belongs to the interval, and which way the interval runs.`
- ask: `From which x on does the function take positive values? Mark it on the axis.`
- correctText: `Correct. The boundary is at two, the point is hollow, the interval runs to the right. At two the value is zero, and zero is not positive — so the boundary itself does not belong. To the right of it x squared becomes greater than four.`
- wrong (boundary right, point filled): `Put two into the formula: four minus four, that is zero. Is zero a positive number?`
- wrong (boundary at 4): `The boundary is a value of x, not of x squared. If x squared equals four, what does x equal?`
- wrong (direction left): `Try three: nine minus four is five, which is positive. On which side of the boundary does three stand?`
- wrongText: `Two questions: at which number does the value become zero, and does that number itself belong to the answer?`

---

# 08 · `ClozeBank` · 🔴 · teg `nol-koeff-a`

**MA'LUMOT.**

```
answer: w1 w2 w3
cards:  w1 «nolga teng emas»  w2 «noli»  w3 «torayadi»   ← to'g'ri
        w4 «birga teng»       w5 «uchi»  w6 «kengayadi»  ← tuzoqlar
```

**UZ.**
- eyebrow: `So'zlar`
- setup: `Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.`
- ask: `Kartani bosing, keyin bo'sh kartochkani bosing.`
- bank: `Kartalar`
- qoida: `y = ax² + bx + c ko'rinishidagi funksiya kvadrat funksiya deyiladi, bunda a [nolga teng emas]. Funksiyaning [noli] — y nolga aylanadigan x qiymati. a soni kattalashsa parabola [torayadi].`
- kartalar: `nolga teng emas · noli · torayadi · birga teng · uchi · kengayadi`
- correctText: `To'g'ri, uchala so'z ham joyida. Qoidaning uchta gapi darsning uchta ishini yopadi: birinchisi kvadrat funksiyani chiziqlisidan ajratadi, ikkinchisi nolni ta'riflaydi, uchinchisi a ning kattaligi grafikka qanday ta'sir qilishini aytadi.`
- wrong (0 = birga teng): `a birga teng bo'lishi SHART emas, u faqat nolga teng bo'lmasligi kerak. Besh iks kvadrat ham, minus iks kvadrat ham kvadrat funksiya.`
- wrong (1 = uchi): `Uchi — grafikning burilish nuqtasi, undagi qiymat esa nolga teng bo'lishi shart emas. Ta'rifda qiymat nolga aylanadigan joy so'ralyapti.`
- wrong (2 = kengayadi): `Ikki iks kvadrat bilan iks kvadratni bir necha iks da solishtiring: kattaroq a da qiymatlar tezroq o'sadi, demak parabola torroq bo'ladi.`
- wrongText: `Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi a ga shart qo'yadi, ikkinchisi nomni ta'riflaydi, uchinchisi grafikning shaklini aytadi.`

**RU.**
- eyebrow: `Слова`
- setup: `Правило урока записано, но три слова выпали. Поставь их из карточек снизу.`
- ask: `Нажми карточку, потом пустую клетку.`
- bank: `Карточки`
- правило: `Функция вида y = ax² + bx + c называется квадратичной, где a [не равно нулю]. [Нуль] функции — это значение x, при котором y обращается в нуль. Чем больше число a, тем парабола [уже].`
- карточки: `не равно нулю · Нуль · уже · равно единице · Вершина · шире`
- correctText: `Верно, все три слова на месте. Три предложения правила закрывают три дела урока: первое отделяет квадратичную функцию от линейной, второе определяет нуль, третье говорит, как величина a влияет на график.`
- wrong (0 = равно единице): `a не ОБЯЗАНО равняться единице, оно лишь не должно быть нулём. И пять икс в квадрате, и минус икс в квадрате — квадратичные функции.`
- wrong (1 = Вершина): `Вершина — точка поворота графика, и значение там не обязано быть нулём. В определении спрашивают место, где значение обращается в нуль.`
- wrong (2 = шире): `Сравни два икс в квадрате и икс в квадрате при нескольких икс: при большем a значения растут быстрее, значит парабола становится уже.`
- wrongText: `Проверяй каждую клетку самим предложением: первое ставит условие на a, второе определяет название, третье говорит про форму графика.`

**EN.**
- eyebrow: `Words`
- setup: `The rule of the lesson is written down, but three words fell out. Put them back from the cards below.`
- ask: `Tap a card, then tap an empty cell.`
- bank: `Cards`
- rule: `A function of the form y = ax² + bx + c is called quadratic, where a [is not zero]. A [zero] of the function is a value of x at which y becomes zero. The bigger the number a, the [narrower] the parabola.`
- cards: `is not zero · zero · narrower · equals one · vertex · wider`
- correctText: `Correct, all three words are in place. The three sentences of the rule cover the three jobs of the lesson: the first separates a quadratic function from a linear one, the second defines a zero, the third says how the size of a affects the graph.`
- wrong (0 = equals one): `a is not REQUIRED to equal one, it only must not be zero. Five x squared and minus x squared are quadratic functions too.`
- wrong (1 = vertex): `The vertex is the turning point of the graph, and the value there need not be zero. The definition asks for the place where the value becomes zero.`
- wrong (2 = wider): `Compare two x squared with x squared at a few x: with a bigger a the values grow faster, so the parabola gets narrower.`
- wrongText: `Check each blank against the sentence itself: the first puts a condition on a, the second defines a name, the third describes the shape of the graph.`

---

# 09 · `OrderLines` · 🔴 · teg `tenglama-vs-funksiya`

**MA'LUMOT.**

```
given: y = x² + 2x − 8
lines (to'g'ri tartibda):
  c1  [so'z] Funksiyaning noli — y nolga aylanadigan x
  c2  x² + 2x − 8 = 0
  c3  x₁ = −4 , x₂ = 2
  c4  [so'z] Javob: nollar + −4 va 2
  c5  [so'z] Tekshirish: + x = 2 → 4 + 4 − 8 = 0
answer: c1 c2 c3 c4 c5
```

**UZ.**
- eyebrow: `Tartib`
- setup: `Beshta qadam aralashtirilgan. Ular bitta zanjir hosil qiladi.`
- ask: `Qadamlarni to'g'ri tartibga soling.`
- c1: `Funksiyaning noli — y nolga aylanadigan x`
- c4: `Javob: nollar` · c5: `Tekshirish:`
- correctText: `To'g'ri. Zanjirning ikkinchi qadamiga e'tibor bering: tenglama shu yerda paydo bo'ldi, oldin emas. Funksiya berilgan edi, tenglama esa uning nollarini qidirish uchun yozildi. Oxirida javob son bilan tekshiriladi — bu ham qadamning o'zi.`
- wrong (c2 birinchi): `Tenglama qayerdan paydo bo'ldi? Avval nima izlanayotganini aytish kerak, tenglama shundan keyin yoziladi.`
- wrong (c3 c2 dan oldin): `Bu qator tenglamani yechish natijasi. Yechilmagan tenglamadan ildiz chiqmaydi.`
- wrong (c5 c4 dan oldin): `Tekshirish nimani tekshiradi? Javob hali yozilmagan bo'lsa, solishtiradigan narsa yo'q.`
- wrong (c4 oxirgi): `Javob yozilgandan keyin ham bitta ish qoladi: uni son bilan tekshirish.`
- wrongText: `Zanjirni yuqoridan pastga o'qing. Har qator o'zidan oldingisidan kelib chiqadimi?`

**RU.**
- eyebrow: `Порядок`
- setup: `Пять шагов перемешаны. Вместе они составляют одну цепочку.`
- ask: `Расставь шаги по порядку.`
- c1: `Нуль функции — это x, при котором y обращается в нуль`
- c4: `Ответ: нули` · c5: `Проверка:`
- correctText: `Верно. Обрати внимание на второй шаг: уравнение появилось именно здесь, а не раньше. Дана была функция, а уравнение записали, чтобы найти её нули. В конце ответ проверяется числом — это тоже сам шаг.`
- wrong (c2 первый): `Откуда взялось уравнение? Сначала надо сказать, что ищется, и только потом записывать уравнение.`
- wrong (c3 раньше c2): `Эта строка — результат решения уравнения. Из нерешённого уравнения корни не появятся.`
- wrong (c5 раньше c4): `Что проверяет проверка? Если ответ ещё не записан, сравнивать не с чем.`
- wrong (c4 последний): `После того как ответ записан, остаётся ещё одно дело: проверить его числом.`
- wrongText: `Прочитай цепочку сверху вниз. Следует ли каждая строка из предыдущей?`

**EN.**
- eyebrow: `Order`
- setup: `Five steps are shuffled. Together they make one chain.`
- ask: `Put the steps in the right order.`
- c1: `A zero of a function is an x at which y becomes zero`
- c4: `Answer: the zeros` · c5: `Check:`
- correctText: `Correct. Look at the second step: the equation appeared exactly there, not earlier. A function was given, and the equation was written in order to find its zeros. At the end the answer is checked with a number — that is a step too.`
- wrong (c2 first): `Where did the equation come from? First you say what is being looked for, and only then write the equation.`
- wrong (c3 before c2): `This line is the result of solving the equation. An unsolved equation gives no roots.`
- wrong (c5 before c4): `What does the check check? If the answer is not written yet, there is nothing to compare with.`
- wrong (c4 last): `Once the answer is written, one job remains: to check it with a number.`
- wrongText: `Read the chain from top to bottom. Does every line follow from the one above it?`

---

# 10 · `AuditLines` · 🔴 · teg `nol-koeff-a`

**MA'LUMOT.**

```
given: y = 5 − 2x²  funksiyasining a koeffitsientini toping
rows:
  r1  [so'z] Yozuvni y = ax² + bx + c ko'rinishiga solishtiramiz
  r2  [so'z] Birinchi had 5, demak + a = 5      ← birinchi xato
  r3  a = 5 ≠ 0
  r4  [so'z] Javob: + a = 5
answerId: r2
```

**UZ.**
- eyebrow: `Xato qator`
- setup: `Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.`
- ask: `Birinchi xato qatorni bosing.`
- r1: `Yozuvni y = ax² + bx + c ko'rinishiga solishtiramiz` · r2: `Birinchi had besh, demak` · r4: `Javob:`
- correctText: `To'g'ri, xato ikkinchi qatorda. a — birinchi had emas, iks kvadrat OLDIDAGI son. Bu yozuvda hadlar boshqa tartibda turibdi: avval ozod had, keyin iks kvadratli had. Uni standart ko'rinishga keltirsak, minus ikki iks kvadrat qo'shuv besh chiqadi, ya'ni a minus ikkiga teng.`
- wrong (r1): `Bu qator to'g'ri: yechim aynan shu solishtirishdan boshlanadi. Xatoni undan pastda qidiring.`
- wrong (r3): `Bu qator ikkinchisidan kelib chiqadi: agar a beshga teng bo'lganida, u haqiqatan ham nolga teng bo'lmasdi. Xato undan yuqorida.`
- wrong (r4): `To'rtinchi qator ikkinchisining natijasini takrorlaydi. Bizga BIRINCHI xato kerak, oxirgisi emas.`
- wrongText: `Yozuvdagi hadlarni standart tartibga soling: iks kvadratli had qayerda va uning oldida qaysi son turibdi?`

**RU.**
- eyebrow: `Ошибочная строка`
- setup: `Решение готово, но ответ неверный. Каждая строка выглядит правильной.`
- ask: `Нажми первую ошибочную строку.`
- r1: `Сравниваем запись с видом y = ax² + bx + c` · r2: `Первое слагаемое — пять, значит` · r4: `Ответ:`
- correctText: `Верно, ошибка во второй строке. a — не первое слагаемое, а число ПЕРЕД икс в квадрате. В этой записи слагаемые стоят в другом порядке: сначала свободный член, потом член с икс в квадрате. Если привести к стандартному виду, получится минус два икс в квадрате плюс пять, то есть a равно минус двум.`
- wrong (r1): `Эта строка верна: решение как раз с этого сравнения и начинается. Ищи ошибку ниже.`
- wrong (r3): `Эта строка следует из второй: если бы a равнялось пяти, оно и правда не было бы нулём. Ошибка выше.`
- wrong (r4): `Четвёртая строка повторяет результат второй. Нам нужна ПЕРВАЯ ошибка, а не последняя.`
- wrongText: `Расставь слагаемые записи в стандартном порядке: где член с икс в квадрате и какое число стоит перед ним?`

**EN.**
- eyebrow: `Wrong line`
- setup: `The solution is finished, but the answer is wrong. Every line looks right.`
- ask: `Tap the first wrong line.`
- r1: `Compare the record with the form y = ax² + bx + c` · r2: `The first term is five, so` · r4: `Answer:`
- correctText: `Correct, the error is in the second line. a is not the first term but the number IN FRONT of x squared. In this record the terms stand in a different order: the constant first, then the x squared term. Put in standard form it reads minus two x squared plus five, so a equals minus two.`
- wrong (r1): `This line is right: the solution does start from that comparison. Look for the error below.`
- wrong (r3): `This line follows from the second: if a were five, it really would not be zero. The error is above it.`
- wrong (r4): `The fourth line repeats the result of the second. We need the FIRST error, not the last one.`
- wrongText: `Put the terms of the record in standard order: where is the x squared term and which number stands in front of it?`
