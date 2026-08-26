# DARS01_AMALIYOT_KONTENT — 9-sinf, 1-dars amaliyoti, o'nta topshiriqning to'liq matni

> **2-bosqich (KONTENT).** Kirish: `DARS01_AMALIYOT_SKELET.md` (metodist tomonidan
> tasdiqlangan, 2026-08-26), `TIPLAR_AMALIYOT_9SINF.md`,
> `src/components/grade9/Dars01.jsx` (`STATEMENTS`, `MISS`).
> Chiqish: `src/components/grade9/practice/dars01/D01_01…10.jsx` uchun ma'lumot.

---

## 0. QOIDALAR, ULARSIZ BU FAYL O'QILMAYDI

1. **Matematika til blokidan TASHQARIDA.** «MA'LUMOT» bo'limidagi juftliklar, jadval
   sonlari, formulalar, sohalar va grafik — tarjima emas, matematikaning o'zi.
   `UZ / RU / EN` bo'limlarida faqat SO'ZLAR.
2. **Har noto'g'ri YO'LGA o'z razbori.** «Noto'g'ri» — razbor emas. `wrongs[]` tartib
   bilan tekshiriladi, birinchi mos kelgani chiqadi, oxirgisi `wrongText`.
3. **Razbor javobni bermaydi, BELGINI ko'rsatadi** va son qo'yib tekshirishga yuboradi
   (`tekshirilmagan` shu yerda o'ladi).
4. **Razbor matnida matematika SO'Z bilan yoziladi** («iks kvadrat minus yetti iks»),
   chunki razbor gap, formula emas. Topshiriqning o'zidagi matematika esa belgilar bilan
   va ma'lumot blokida turadi.
5. **Javob bir marta tekshiriladi**, keyin topshiriq qulflanadi. Maslahat tugmasi yo'q.
6. UZ — `siz`, apostrof ASCII `'`. RU — `ты`, jinssiz shakl. Kirillcha UZ satrda yo'q.
7. **Personaj va turmush sahnasi yo'q** (metodist qarori 2026-08-26): masala
   to'g'ridan-to'g'ri aytiladi.
8. Amaliyotda ovoz YO'Q.

---

## 0a. TEXNIKA: NIMA IMPORT QILINADI, NIMA YOZILADI

`grade8/practice/kit.jsx` kodi o'qib chiqildi. Holat:

| Topshiriq | Mexanika | Manba |
|---:|---|---|
| 01 | `Choice` | import. `opts[].label` massiv bo'lsa `Row tokens` bilan chiziladi — juftliklar matematik shriftda chiqadi |
| 03 | `TrueFalse` | import (grafik `Given` ning `fig` sloti orqali) |
| 05 | `Zones` | import |
| 08 | `OrderLines` | import |
| 10 | `ClozeBank` | import (8-sinf amaliyotining 25-tipi) |
| 02 | Jadval | `ValueTable` BOSHQA SHAKL: uning jadvali «bitta qator = bitta x, ikkita ustun» va u qator TANLASHNI ham talab qiladi (`answerRow`). Bizga gorizontal ikki qatorli jadval kerak, bo'sh katak esa ARGUMENT qatorida ham turadi |
| 04 | Belgilash | umumiy qatlamda YO'Q |
| 06 | Javobni kiritish | `TypeValue` faqat BITTA butun son o'qiydi (`parseInt`). Bu topshiriqning javobi ikkita son |
| 07 | Sonlar o'qi | `NumberLine` bor, lekin u faqat butun bo'linmalarni belgilaydi: nuqta turi (bo'yalgan / bo'sh) ham, yo'nalish ham yo'q |
| 09 | Xato qator | `AuditRows` IKKITA shartni talab qiladi (qator VA qarshi misol). Metodist 2026-08-26 da qarshi misolni olib tashladi — bu boshqa xatti-harakat |

**BESHTA YANGI mexanika `src/components/grade9/practice/asboblar9.jsx` ga.** Skelet
bosqichida ikkitasi ko'zda tutilgan edi; kodni o'qib chiqqach 02 va 06 qo'shildi,
metodistning ikkinchi tuzatishidan keyin esa 09 ham:

| Nomi | Nima qiladi |
|---|---|
| `RowTable` | gorizontal ikki qatorli jadvalning kataklarini to'ldiradi; bo'sh katak argument qatorida ham bo'ladi |
| `PlacePoint` | to'rli tekislikda tugunlarni bosadi (bir yoki bir nechta nuqta); noto'g'ri javob ZONA bo'yicha baholanadi |
| `TypeSet` | javobga bir nechta sonni yozadi; ular TO'PLAM sifatida solishtiriladi, tartib ahamiyatsiz |
| `DomainAxis` | o'qqa chegara qo'yadi, nuqta turini almashtiradi (bo'yalgan / bo'sh) va yo'nalishni tanlaydi; uchalasi ham to'g'ri bo'lsagina zachot |
| `AuditLines` | tayyor yechimning birinchi xato qatorini bosadi, qo'shimcha savolsiz |

Bundan tashqari `FuncGraph` — grafikning O'ZI. U mexanika emas, RASM: `Given` ning `fig`
sloti orqali istalgan mexanikaga tushadi (3-topshiriqda `TrueFalse` ga).

**Buzmaydigan qo'shimchalar `kit.jsx` ga.** 8-sinfning 550 topshirig'idan birortasi bu
maydonlarni ishlatmaydi, demak ularning xatti-harakati o'zgarmaydi (tekshirildi:
`grade8-practice-check.mjs` 1, 30 va 55-darslarda yashil):

1. `Given` — `data.fig` bo'lsa, uni chizadi.
2. `LineBody` — qadam kartasida `tokens` (matematika) bilan birga `label` (SO'Z) ham
   tura oladi. 8-sinfning hamma kartalarida faqat `tokens` bor. 08-topshiriqdagi
   `OrderLines` shundan foydalanadi.
3. `Given` endi `OrderLines` da ham chiziladi — 08-topshiriqda masalaning yozuvi
   ko'rinib turishi kerak.

   Ikkala qo'shimcha `AuditRows` ga ham tegdi (u ham shu naqshni oladi). 9-sinfning
   09-topshirig'i metodist tuzatishidan keyin `AuditRows` ni ishlatmaydi, lekin
   qo'shimchalar joyida qoldirildi: ular 8-sinf uchun ham to'g'ri va uning tekshiruvi
   ular bilan yashil o'tdi.
4. Bir nechta `export` qo'shildi (`Head`, `Given`, `pickWhy`, `submitPayload`, `Cell`,
   `ExprPad`, `useIsPhone`, `num`, ...) — 9-sinfning mexanikalari shapkani, razbor
   tanlashni va klaviaturani nusxalamasligi uchun.

`TIPLAR_AMALIYOT_9SINF.md` §4 shu bilan aniqlashtirildi: xatti-harakatni o'zgartiradigan
narsa `asboblar9.jsx` ga, 8-sinf ishlatmaydigan QO'SHIMCHA maydon esa `kit.jsx` ga
yoziladi.

**O'ram ham bir marta yozildi.** 8-sinfda chip qatori va host har darsning
`DarsNNPractice.jsx` faylida qaytadan turadi — 55 nusxa. 9-sinfda u
`grade9/practice/Amaliyot.jsx` da bitta: `makePractice({ HEAD, ITEMS })`. Dars fayli
faqat sarlavha va o'nta topshiriqni beradi.

---

## 1. SARLAVHA VA CHIP QATORI

```
HEAD = {
  uz: "Dars 1 amaliyoti — 10 topshiriq (funksiya va aniqlanish sohasi)",
  ru: "Практика урока 1 — 10 заданий (функция и область определения)",
  en: "Lesson 1 practice — 10 tasks (function and domain)",
}
```

| № | uz | ru | en |
|---:|---|---|---|
| 01 | Juftliklar | Пары | Pairs |
| 02 | Jadval | Таблица | Table |
| 03 | Ha yoki yo'q | Да или нет | Yes or no |
| 04 | Nuqta | Точка | Point |
| 05 | Guruhlar | Группы | Groups |
| 06 | Taqiq | Запрет | Ban |
| 07 | O'q | Ось | Axis |
| 08 | Tartib | Порядок | Order |
| 09 | Xato qator | Ошибочная строка | Wrong line |
| 10 | So'zlar | Слова | Words |

---

# 01 · `Choice` · 🟢 · teg `not_a_function`

**Nima tekshiriladi.** Ta'rif shart argumentga qo'yilishini: bitta argumentga ikkita qiymat
mumkin emas, bitta qiymatga ikkita argument esa mumkin. Uchta noto'g'ri variant — uchta
adashish yo'li.

**MA'LUMOT (matematika, til blokidan tashqarida).**

```
optCols: 1
correct: 2
opts: [
  0: (1; 3), (2; 5), (3; 7), (4; 9)
  1: (−2; 4), (−1; 1), (0; 0), (1; 1), (2; 4)
  2: (0; 0), (1; 1), (1; −1), (4; 2)
  3: (1; 5), (2; 5), (3; 5)
]
```

**UZ.**
- eyebrow: `Juftliklar`
- setup: `To'rtta to'plam. Har juftlikda birinchi son — argument, ikkinchisi — qiymat.`
- ask: `Qaysi to'plam funksiya emas?`
- correctText: `To'g'ri. Bu to'plamda bir sonining ikkita qiymati bor: bir va minus bir. Bitta argument ikki marta uchradi, demak ta'rif buzildi. Qolgan to'plamlarda birinchi sonlar takrorlanmaydi.`
- wrong (0): `Bu yerda birinchi sonlar bir, ikki, uch, to'rt — har biri bir martadan. Shart bajarilgan. Boshqa to'plamlarda ham birinchi sonlarni sanab chiqing.`
- wrong (1): `Bu yerda takrorlanayotgan narsa qiymat: to'rt ikki marta va bir ikki marta uchradi. Shart esa qiymatga emas, argumentga qo'yiladi. Birinchi sonlarni alohida yozib chiqing.`
- wrong (3): `Hamma qiymat beshga teng, lekin argumentlar har xil: bir, ikki, uch. Har bir argumentga bittadan qiymat mos kelyapti, ta'rif buzilmagan.`
- wrongText: `Har to'plamda faqat BIRINCHI sonlarni yozib chiqing. Qaysinisida bitta son ikki marta uchradi?`

**RU.**
- eyebrow: `Пары`
- setup: `Четыре набора. В каждой паре первое число — аргумент, второе — значение.`
- ask: `Какой набор не является функцией?`
- correctText: `Верно. Здесь у числа один два значения: один и минус один. Один аргумент встретился дважды, значит определение нарушено. В остальных наборах первые числа не повторяются.`
- wrong (0): `Здесь первые числа один, два, три, четыре — каждое по разу. Условие выполнено. Пересчитай первые числа и в остальных наборах.`
- wrong (1): `Здесь повторяется значение: четыре дважды и один дважды. А условие ставится не на значение, а на аргумент. Выпиши первые числа отдельно.`
- wrong (3): `Все значения равны пяти, но аргументы разные: один, два, три. Каждому аргументу отвечает одно значение, определение не нарушено.`
- wrongText: `Выпиши в каждом наборе только ПЕРВЫЕ числа. В каком из них одно число встретилось дважды?`

**EN.**
- eyebrow: `Pairs`
- setup: `Four sets. In each pair the first number is the argument, the second is the value.`
- ask: `Which set is not a function?`
- correctText: `Correct. Here the number one has two values: one and minus one. One argument appeared twice, so the definition is broken. In the other sets the first numbers do not repeat.`
- wrong (0): `Here the first numbers are one, two, three, four — each once. The condition holds. Count the first numbers in the other sets too.`
- wrong (1): `What repeats here is the value: four twice and one twice. But the condition is placed on the argument, not on the value. Write the first numbers out separately.`
- wrong (3): `All the values equal five, but the arguments differ: one, two, three. Each argument gets one value, the definition is not broken.`
- wrongText: `Write out only the FIRST numbers in each set. In which one did a number appear twice?`

---

# 02 · `ValueTable` (qatorsiz) · 🟢 · teg `table_both_ways`

**Nima tekshiriladi.** Jadval ikki tomonga o'qiladi. Ikkita katakda argument berilgan va
qiymat hisoblanadi, bittasida esa teskarisi. Shu bitta katak argument bilan qiymatni
ajratishni majbur qiladi.

**MA'LUMOT.**

```
expr: y = 3x − 5
head: [ x , y ]
cols:
  1 → −2      (berilgan)
  2 →  1      (berilgan)
  3 →  ?      javob 4
  ? → 10      javob 5
  6 →  ?      javob 13
klaviatura: 0-9 va `−` (kasr kiritib bo'lmaydi, shuning uchun `5/3` yo'li yo'q)
hints:  '10' | '15' | '9' | '14' | '23' | '18'
```

**UZ.**
- eyebrow: `Jadval`
- setup: `Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.`
- ask: `Uchta bo'sh katakni to'ldiring.`
- correctText: `To'g'ri. Ikkita katakda argument berilgan edi va qiymat hisoblandi, bitta katakda esa teskarisi: qiymat berilgan, argument tenglamadan topildi. Jadval ikki tomonga ham o'qiladi.`
- wrong (bo'sh `x` katagida 10): `Bu katak yuqori qatorda turibdi, u yerga argument yoziladi. O'n — bu qiymat; undan argumentga o'tish uchun uch iks minus besh o'nga teng degan tenglamani yeching.`
- wrong (`x` = 15): `Minus besh o'ng tomonga to'g'ri o'tkazildi, lekin uchga bo'lish qolib ketdi. Uch iks o'n beshga teng bo'lsa, iks nimaga teng?`
- wrong (`y(3)` = 9): `Ko'paytirish bajarildi, ayirish qolib ketdi. Formulada uchga ko'paytirishdan keyin yana bitta amal bor.`
- wrong (`y(3)` = 14): `Belgi teskari olindi: formulada besh qo'shilmaydi, ayriladi.`
- wrong (`y(6)` = 16): `Katak oldingi katakka qarab emas, formulaga qarab to'ldiriladi. Oltini formulaga qo'ying.`
- wrongText: `To'ldirgan har bir katagingizni formulaga qo'yib tekshiring: shu songa uchni ko'paytirib, besh ayirsangiz nima chiqadi?`

**RU.**
- eyebrow: `Таблица`
- setup: `Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.`
- ask: `Заполни три пустые клетки.`
- correctText: `Верно. В двух клетках был дан аргумент и вычислялось значение, а в одной наоборот: дано значение, а аргумент найден из уравнения. Таблица читается в обе стороны.`
- wrong (в пустой `x` стоит 10): `Эта клетка в верхней строке, туда пишут аргумент. Десять — это значение; чтобы перейти к аргументу, реши уравнение три икс минус пять равно десяти.`
- wrong (`x` = 15): `Минус пять перенесено верно, но деление на три пропущено. Если три икс равно пятнадцати, чему равен икс?`
- wrong (`y(3)` = 9): `Умножение сделано, вычитание пропущено. После умножения на три в формуле есть ещё одно действие.`
- wrong (`y(3)` = 14): `Знак взят наоборот: в формуле пять не прибавляется, а вычитается.`
- wrong (`y(6)` = 16): `Клетка заполняется по формуле, а не по предыдущей клетке. Подставь шесть в формулу.`
- wrongText: `Проверь каждую заполненную клетку подстановкой: что даёт это число, умноженное на три, минус пять?`

**EN.**
- eyebrow: `Table`
- setup: `The top row is the argument, the bottom row is the value. The table is filled from the formula.`
- ask: `Fill in the three empty cells.`
- correctText: `Correct. In two cells the argument was given and the value was computed; in one cell it was the other way round: the value was given and the argument came from an equation. The table reads both ways.`
- wrong (10 in the empty `x`): `This cell is in the top row, and the argument goes there. Ten is a value; to get to the argument, solve three x minus five equals ten.`
- wrong (`x` = 15): `The minus five was moved correctly, but the division by three was skipped. If three x equals fifteen, what does x equal?`
- wrong (`y(3)` = 9): `The multiplication was done, the subtraction was skipped. After multiplying by three the formula has one more operation.`
- wrong (`y(3)` = 14): `The sign was taken the other way: the formula subtracts five, it does not add it.`
- wrong (`y(6)` = 16): `A cell is filled from the formula, not from the previous cell. Put six into the formula.`
- wrongText: `Check every cell you filled by substitution: what does this number times three, minus five, give?`

---

# 03 · `TrueFalse` + grafik · 🟢 · teg `graph_claims`

**Nima tekshiriladi.** Grafik ikkita chiziq bilan o'qiladi: tik chiziq bitta argumentga
nechta qiymat borligini, gorizontal chiziq bitta qiymatga nechta argument borligini
ko'rsatadi. Ikkinchi hukm `grafik-rasm` ni tekshiradi, birinchisi bilan uchinchisi esa
juft bo'lib ishlaydi: shart argumentga qo'yiladi, teskarisiga emas.

**MA'LUMOT.**

```
fig: y = f(x) grafigi, aniqlanish sohasi [0; 6]
     (0; 1) dan ko'tarilib (3; 7) ga yetadi, so'ng (6; 1) gacha tushadi
     o'qlar imzolangan: x , y ; to'r bir birlikda
items:
  s1  yes: true    — matn UZ/RU/EN da
  s2  yes: false
  s3  yes: true    — belgilar: y = 4

Uchta hukm, to'rtta emas (metodist, 2026-08-26). «x = 8 da funksiya aniqlangan»
olib tashlandi: u T2 ni tekshirardi, T2 ni esa 07 va 10-topshiriqlar ham yopadi.
```

**UZ.**
- eyebrow: `Ha yoki yo'q`
- setup: `Grafikda y = f(x) chizilgan, aniqlanish sohasi 0 dan 6 gacha.`
- ask: `Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.`
- s1: `Har bir x ga aynan bitta y mos keladi.`
- s2: `Grafikning eng yuqori nuqtasi funksiyaning eng katta argumentini ko'rsatadi.`
- s3: `y = 4 qiymati ikki xil x da uchraydi.`
- correctText: `To'g'ri, uchtasi ham. Grafikni ikki chiziq bilan o'qidingiz: tik chiziq bitta argumentga nechta qiymat borligini, gorizontal chiziq bitta qiymatga nechta argument borligini ko'rsatadi. Bu ikki savolning javobi bir xil bo'lishi shart emas.`
- wrong (s1): `Grafikning istalgan nuqtasidan tik chiziq o'tkazing. U grafikni necha marta kesadi? Bitta x dan ikkita nuqta chiqqanda funksiya buzilgan bo'lardi.`
- wrong (s2): `Eng yuqori nuqta — uch va yetti. Ulardan qaysi biri argument? Argument gorizontal o'qdan o'qiladi, va bu funksiyada eng katta argument oltiga teng.`
- wrong (s3): `Igrek to'rtga teng gorizontal chiziqni o'tkazing va u grafikni necha joyda kesishini sanang. Ta'rif bir xil qiymatning ikki marta uchrashini taqiqlamaydi.`
- wrongText: `Ikki chiziq bilan tekshiring: tik chiziq — bitta argumentga nechta qiymat, gorizontal chiziq — bitta qiymatga nechta argument.`

**RU.**
- eyebrow: `Да или нет`
- setup: `На графике построена y = f(x), область определения от 0 до 6.`
- ask: `Для каждого суждения выбери «Да» или «Нет».`
- s1: `Каждому x отвечает ровно один y.`
- s2: `Самая высокая точка графика показывает наибольший аргумент функции.`
- s3: `Значение y = 4 встречается при двух разных x.`
- correctText: `Верно, все три. Ты прочитал график двумя линиями: вертикальная показывает, сколько значений у одного аргумента, горизонтальная — сколько аргументов у одного значения. Ответы на эти два вопроса не обязаны совпадать.`
- wrong (s1): `Проведи вертикальную линию через любую точку графика. Сколько раз она пересечёт график? Если бы из одного x выходили две точки, функция была бы нарушена.`
- wrong (s2): `Самая высокая точка — три и семь. Что из них аргумент? Аргумент читается с горизонтальной оси, и наибольший здесь равен шести.`
- wrong (s3): `Проведи горизонтальную линию игрек равно четырём и посчитай, в скольких местах она пересекает график. Определение не запрещает одному значению встречаться дважды.`
- wrongText: `Проверяй двумя линиями: вертикальная — сколько значений у одного аргумента, горизонтальная — сколько аргументов у одного значения.`

**EN.**
- eyebrow: `Yes or no`
- setup: `The graph shows y = f(x), the domain runs from 0 to 6.`
- ask: `Choose "Yes" or "No" for each claim.`
- s1: `Each x gets exactly one y.`
- s2: `The highest point of the graph shows the largest argument of the function.`
- s3: `The value y = 4 occurs at two different x.`
- correctText: `Correct, all three. You read the graph with two lines: the vertical one shows how many values one argument has, the horizontal one shows how many arguments one value has. The two answers need not agree.`
- wrong (s1): `Draw a vertical line through any point of the graph. How many times does it cross the graph? If one x gave two points, the function would be broken.`
- wrong (s2): `The highest point is three and seven. Which of them is the argument? The argument is read off the horizontal axis, and the largest one here equals six.`
- wrong (s3): `Draw the horizontal line y equals four and count how many places it crosses the graph. The definition does not forbid one value from occurring twice.`
- wrongText: `Check with two lines: vertical — how many values one argument has, horizontal — how many arguments one value has.`

---

# 04 · `PlacePoint` (yangi) · 🟡 · teg `place_point`

**Nima tekshiriladi.** Nuqta ikkita sondan yig'iladi va ularning tartibi ahamiyatli.
Metodist qarori 2026-08-26 (ikkinchi) bilan topshiriq kuchaytirildi: jadval GORIZONTAL
yoziladi va funksiyaning O'ZI ham beriladi, lekin OZOD HADI noma'lum. Shu bilan
topshiriq «jadvaldan ko'chirish» bo'lib qolmaydi — avval ozod hadni topish kerak.

Noto'g'ri javob ZONA bo'yicha baholanadi, shuning uchun har xato o'z razborini oladi.

**MA'LUMOT.**

```
expr:   y = 3x + b            (b JADVALDAN topiladi, yozilmagan)
table (gorizontal):
        x : −1    0    ?
        y :  0    ?   −3
plane:  x ∈ [−4; 4], y ∈ [−4; 4], qadam 1, nuqtalar CHIZILMAGAN
        joylashuv: CHAPDA formula va jadval, O'NGDA chizma (metodist, 2026-08-26)
        o'q imzolari HAR bo'linmada; qo'yilgan nuqta o'z koordinatasi bilan turadi;
        to'lganda ortiqcha bosish hech nimani o'chirmaydi
answer: (0; 3) va (−2; −3)    — ikkalasi ham qo'yiladi, ikkalasi ham to'g'ri bo'lsagina zachot

Yechim yo'li:  to'liq ustun → 3·(−1) + b = 0 → b = 3
               x = 0  → y = 3            → nuqta (0; 3)
               y = −3 → 3x + 3 = −3      → nuqta (−2; −3)

zonalar (tuzoqlar tekislikda BOR, ya'ni o'quvchi ularni qila oladi):
  (0; 0)   ozod had nol deb olindi
  (−3; −3) qiymat argument deb olindi
  (3; 0) va (−3; −2)  koordinatalar almashtirildi
```

**Bag-report 2026-08-26 bo'yicha uchta tuzatish** (metodist «shunaqa javoblarni bossam
xato deyapti» dedi; mexanikaning o'zi to'g'ri ishlayotgan edi, muammo boshqarishda):

1. **To'lganda ortiqcha bosish hech nimani o'chirmaydi.** Ilgari uchinchi bosish eng
   birinchi qo'yilgan nuqtani JIMGINA olib tashlardi — to'g'ri javob yo'qolardi va
   o'quvchi buni ko'rmasdi. Endi nuqtani olib tashlash uchun uning O'ZINI qayta bosish
   kerak.
2. **O'q imzolari har bo'linmada.** Ilgari faqat juft sonlar imzolangan edi, javob esa
   toq sonda turadi (`y = 3`): to'r chiziqlarini sanashga to'g'ri kelardi.
3. **Qo'yilgan nuqta o'z koordinatasi bilan turadi** — `(0; 3)`. O'quvchi nimani
   qo'yganini ko'radi, tekshirishdan oldin.

Bosish zonasi ham kattalashtirildi: 19px dan 22px ga (telefonda 20px).

**UZ.**
- eyebrow: `Nuqta`
- setup: `Funksiya formula bilan berilgan, lekin ozod hadi noma'lum. Uni jadvalning to'liq ustunidan toping.`
- ask: `x = 0 ga mos nuqtani va y = −3 ga mos nuqtani tekislikka qo'ying.`
- correctText: `To'g'ri, ikkala nuqta ham. To'liq ustun ozod hadni berdi: minus birda qiymat nolga teng, demak uch marta minus bir qo'shuv b nolga teng va b uchga teng. Shundan keyin nolda qiymat uchga teng bo'ldi, minus uch qiymati esa minus ikkida chiqdi.`
- wrong (0; 0): `x nolga teng bo'lganda qiymat ham nol bo'lishi shart emas: formulada ozod had bor. Uni to'liq ustundan toping — minus birda qiymat nolga teng.`
- wrong (−3; −3): `Minus uch — bu QIYMAT, argument emas. Uni formulaning chap tomoniga qo'ying va tenglamani yeching.`
- wrong (almashtirilgan): `Koordinatalar o'rin almashdi. Birinchi son har doim gorizontal o'qda, ikkinchisi tik o'qda o'lchanadi.`
- wrong (birinchisi to'g'ri): `Birinchi nuqta joyida. Ikkinchisi uchun minus uchni QIYMAT sifatida formulaga qo'ying: uch iks qo'shuv uch minus uchga teng.`
- wrong (ikkinchisi to'g'ri): `Ikkinchi nuqta joyida. Birinchisi uchun formulaga nolni qo'ying: uch marta nol nolga teng, demak qiymatni nima beradi?`
- wrongText: `Avval ozod hadni toping: to'liq ustunni formulaga qo'ying. Keyin qolgan ikkita katakni hisoblang va har nuqtaning ikkala sonini ham tekshiring.`

**RU.**
- eyebrow: `Точка`
- setup: `Функция задана формулой, но свободный член неизвестен. Найди его по полному столбцу таблицы.`
- ask: `Поставь на плоскости точку, отвечающую x = 0, и точку, отвечающую y = −3.`
- correctText: `Верно, обе точки. Полный столбец дал свободный член: при минус единице значение равно нулю, значит три умножить на минус один плюс b равно нулю и b равно трём. После этого при нуле значение оказалось равным трём, а значение минус три получилось при минус двух.`
- wrong (0; 0): `При x, равном нулю, значение не обязано быть нулём: в формуле есть свободный член. Найди его по полному столбцу — при минус единице значение равно нулю.`
- wrong (−3; −3): `Минус три — это ЗНАЧЕНИЕ, а не аргумент. Подставь его в левую часть формулы и реши уравнение.`
- wrong (перепутаны): `Координаты поменялись местами. Первое число всегда откладывают по горизонтальной оси, второе — по вертикальной.`
- wrong (первая верна): `Первая точка на месте. Для второй подставь минус три как ЗНАЧЕНИЕ: три икс плюс три равно минус трём.`
- wrong (вторая верна): `Вторая точка на месте. Для первой подставь в формулу нуль: три умножить на нуль равно нулю, а что тогда даёт значение?`
- wrongText: `Сначала найди свободный член: подставь в формулу полный столбец. Потом вычисли две оставшиеся клетки и проверь у каждой точки оба числа.`

**EN.**
- eyebrow: `Point`
- setup: `The function is given by a formula, but the constant term is unknown. Find it from the full column of the table.`
- ask: `Place the point that matches x = 0 and the point that matches y = −3.`
- correctText: `Correct, both points. The full column gave the constant term: at minus one the value is zero, so three times minus one plus b equals zero and b equals three. After that the value at zero came out as three, and the value minus three came out at minus two.`
- wrong (0; 0): `When x is zero the value need not be zero: the formula has a constant term. Find it from the full column — at minus one the value is zero.`
- wrong (−3; −3): `Minus three is the VALUE, not the argument. Put it on the left-hand side of the formula and solve the equation.`
- wrong (swapped): `The coordinates changed places. The first number always goes along the horizontal axis, the second along the vertical one.`
- wrong (first one right): `The first point is right. For the second one put minus three in as the VALUE: three x plus three equals minus three.`
- wrong (second one right): `The second point is right. For the first one put zero into the formula: three times zero is zero, so what gives the value then?`
- wrongText: `First find the constant term: put the full column into the formula. Then compute the two remaining cells and check both numbers of each point.`

---

# 05 · `Zones` · 🟡 · teg `three_zones`

**Nima tekshiriladi.** Taqiqning UCH xil holati: maxraj bitta sonni kesadi, ildiz butun bir
qismni kesadi, ba'zi formulalar esa hech nimani kesmaydi. Maxrajning borligi o'zi hali
taqiq degani emas — bu darsning asosiy tuzog'i.

**MA'LUMOT.**

```
zones: A | B | C   (nomlari — so'z, L() ichida)
items:
  i1  y = 4x + 9        → A
  i2  y = 6/(x² + 4)    → A
  i3  y = 1/(x − 6)     → B
  i4  y = 15/(x + 8)    → B
  i5  y = √(x + 2)      → C
  i6  y = √(10 − x)     → C
```

**UZ.**
- eyebrow: `Guruhlar`
- zona A: `Hamma sonlarda aniqlangan`
- zona B: `Bitta son chiqarib tashlanadi`
- zona C: `Butun bir qism chiqarib tashlanadi`
- setup: `Guruh nomi emas, xossa: formula qaysi sonlarda hisoblanmay qoladi.`
- ask: `Har bir yozuvni o'z guruhiga qo'ying.`
- correctText: `To'g'ri. Uchta xil holat bor: maxraj bitta sonni kesadi, ildiz butun bir qismni kesadi, ba'zi formulalar esa hech nimani kesmaydi. Maxrajning borligining o'zi hali taqiq degani emas.`
- wrong (i2 → B): `Maxraj bor, lekin u nolga aylanadimi? Kvadrat manfiy bo'lmaydi, ustiga to'rt qo'shiladi. Bu yig'indi eng kichik holatda nechchiga teng?`
- wrong (i4 → A): `Maxraj nolga aylanadigan sonni qidiring. U musbat emas, lekin bor.`
- wrong (i6 → B): `Ildiz bitta sonni emas, sonlarning butun bir qismini kesadi. O'n ikkini qo'yib ko'ring: ildiz ostida nima chiqadi?`
- wrong (i5 → A): `Minus beshni qo'ying. Ildiz ostida qanday son hosil bo'ladi va bunday ildiz bormi?`
- wrong (i1 → B yoki C): `Bu yozuvda na maxraj bor, na ildiz. Unda kesiladigan narsa qayerdan chiqadi?`
- wrong (i3 → C): `Maxraj oltida nolga aylanadi. Nolga aylanadigan maxraj bitta sonni kesadi, butun bir qismni emas.`
- wrongText: `Har yozuvga bitta savol bering: bu formula qaysi sonda hisoblanmay qoladi? Javob uch xil bo'ladi — hech qaysida, bitta sonda yoki butun bir qismda.`

**RU.**
- eyebrow: `Группы`
- зона A: `Определена при всех числах`
- зона B: `Исключается одно число`
- зона C: `Исключается целая часть чисел`
- setup: `Группа — не название, а свойство: где формула перестаёт считаться.`
- ask: `Разложи каждую запись в свою группу.`
- correctText: `Верно. Случаев три: знаменатель вырезает одно число, корень вырезает целую часть, а некоторые формулы не вырезают ничего. Наличие знаменателя само по себе ещё не запрет.`
- wrong (i2 → B): `Знаменатель есть, но обращается ли он в нуль? Квадрат неотрицателен, к нему прибавляют четыре. Чему равна эта сумма в самом малом случае?`
- wrong (i4 → A): `Поищи число, при котором знаменатель обращается в нуль. Оно не положительное, но оно есть.`
- wrong (i6 → B): `Корень вырезает не одно число, а целую часть чисел. Подставь двенадцать: что получится под корнем?`
- wrong (i5 → A): `Подставь минус пять. Какое число окажется под корнем и существует ли такой корень?`
- wrong (i1 → B или C): `В этой записи нет ни знаменателя, ни корня. Откуда тогда взяться запрету?`
- wrong (i3 → C): `Знаменатель обращается в нуль при шести. Такой знаменатель вырезает одно число, а не целую часть.`
- wrongText: `Задай каждой записи один вопрос: при каком числе эта формула перестаёт считаться? Ответов три — ни при каком, при одном числе, при целой части.`

**EN.**
- eyebrow: `Groups`
- zone A: `Defined for every number`
- zone B: `One number is excluded`
- zone C: `A whole part of the numbers is excluded`
- setup: `A group is not a name but a property: where the formula stops computing.`
- ask: `Put each record into its own group.`
- correctText: `Correct. There are three cases: a denominator cuts out one number, a root cuts out a whole part, and some formulas cut out nothing. Having a denominator is not yet a ban.`
- wrong (i2 → B): `There is a denominator, but does it become zero? A square is never negative, and four is added to it. What is the smallest this sum can be?`
- wrong (i4 → A): `Look for the number that makes the denominator zero. It is not positive, but it exists.`
- wrong (i6 → B): `A root cuts out not one number but a whole part of the numbers. Try twelve: what appears under the root?`
- wrong (i5 → A): `Put in minus five. What number ends up under the root, and does such a root exist?`
- wrong (i1 → B or C): `This record has neither a denominator nor a root. Where would a ban come from?`
- wrong (i3 → C): `The denominator becomes zero at six. Such a denominator cuts out one number, not a whole part.`
- wrongText: `Ask every record one question: at which number does this formula stop computing? There are three answers — at none, at one number, at a whole part.`

---

# 06 · `TypeValue` · 🟡 · teg `both_bans`

**Nima tekshiriladi.** Maxraj ko'paytma bo'lganda taqiq bitta emas. `x` ni qavsdan
chiqarish — bu darsdagi yagona qadam, u bilan ikkinchi taqiq ko'rinadi.

**MA'LUMOT.**

```
expr: y = 8/(x² − 7x)
kind: set          (bir nechta son, tartib ahamiyatsiz)
answer: { 0 ; 7 }
allowNeg: true
hints: '7' | '0' | '7; −7' | '−7' | '8' | '49'
```

**UZ.**
- eyebrow: `Taqiq`
- setup: `Funksiya aniqlanmagan sonlar maxrajdan chiqadi.`
- ask: `Funksiya qaysi x larda aniqlanmagan? Hammasini yozing.`
- correctText: `To'g'ri, ikkita son. Maxrajdan iksni qavsdan chiqarsak, iks ko'paytiruv iks minus yetti hosil bo'ladi. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi kifoya, shuning uchun taqiq ikkita.`
- wrong ('7'): `Bitta son topildi, ikkinchisi qoldi. Maxrajdan iksni qavsdan chiqaring: ikkita ko'paytuvchi hosil bo'ladi va ularning har biri alohida nolga aylanishi mumkin.`
- wrong ('0'): `Ikkinchi ko'paytuvchi qaysi sonda nolga aylanadi? Iks minus yettini nolga tenglashtiring.`
- wrong ('7; −7'): `Maxraj iks kvadrat minus qirq to'qqiz emas, iks kvadrat minus yetti iks. Ikkinchi hadda ham iks bor, shuning uchun uni qavsdan chiqarish mumkin.`
- wrong ('−7'): `Belgi teskari olindi. Iks minus yetti nolga teng bo'lsa, iks nimaga teng?`
- wrong ('8'): `Sakkiz — surat. Surat qiymatni nolga aylantirishi mumkin, lekin qiymatni yo'qota olmaydi.`
- wrong ('49'): `Qirq to'qqiz bu yozuvda umuman yo'q. Maxrajni yana bir marta o'qing.`
- wrongText: `Topgan har bir soningizni maxrajga qo'ying. Nol chiqdimi? Chiqmagan bo'lsa, u son taqiq emas.`

**RU.**
- eyebrow: `Запрет`
- setup: `Числа, при которых функция не определена, ищут в знаменателе.`
- ask: `При каких x функция не определена? Выпиши все.`
- correctText: `Верно, два числа. Если вынести икс за скобку, знаменатель станет икс умножить на икс минус семь. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя, поэтому запретов два.`
- wrong ('7'): `Одно число найдено, второе осталось. Вынеси икс за скобку: получатся два множителя, и каждый может обратиться в нуль отдельно.`
- wrong ('0'): `При каком числе обращается в нуль второй множитель? Приравняй икс минус семь к нулю.`
- wrong ('7; −7'): `Знаменатель не икс в квадрате минус сорок девять, а икс в квадрате минус семь икс. Во втором слагаемом тоже есть икс, поэтому его можно вынести.`
- wrong ('−7'): `Знак взят наоборот. Если икс минус семь равно нулю, чему равен икс?`
- wrong ('8'): `Восемь — числитель. Числитель может обратить значение в нуль, но не может его убрать.`
- wrong ('49'): `Сорока девяти в этой записи нет вовсе. Перечитай знаменатель.`
- wrongText: `Подставь каждое найденное число в знаменатель. Получился нуль? Если нет, это число не запрет.`

**EN.**
- eyebrow: `Ban`
- setup: `The numbers where the function is undefined come from the denominator.`
- ask: `At which x is the function undefined? Write them all.`
- correctText: `Correct, two numbers. Taking x out as a factor turns the denominator into x times x minus seven. A product becomes zero as soon as one factor is zero, so there are two bans.`
- wrong ('7'): `One number found, the other left behind. Take x out as a factor: two factors appear, and each can become zero on its own.`
- wrong ('0'): `At which number does the second factor become zero? Set x minus seven equal to zero.`
- wrong ('7; −7'): `The denominator is not x squared minus forty-nine, it is x squared minus seven x. The second term has an x as well, so it can be taken out.`
- wrong ('−7'): `The sign was taken the other way. If x minus seven equals zero, what does x equal?`
- wrong ('8'): `Eight is the numerator. A numerator can make the value zero, but it cannot remove the value.`
- wrong ('49'): `There is no forty-nine in this record at all. Read the denominator again.`
- wrongText: `Put each number you found into the denominator. Did you get zero? If not, that number is not a ban.`

---

# 07 · `DomainAxis` (yangi) · 🟡 · teg `domain_on_axis`

**Nima tekshiriladi.** Aniqlanish sohasi o'qda uchta narsa bilan beriladi: chegara qayerda,
u sohaga kiradimi, va soha qaysi tomonga ketadi. Uchalasi ham tekshiriladi.

**MA'LUMOT.**

```
expr: y = √(x + 5)
axis: [−9; 3], qadam 1
answer: { at: −5, closed: true, dir: right }
```

**UZ.**
- eyebrow: `O'q`
- setup: `O'qda uchta narsa ko'rsatiladi: chegara qayerda, u sohaga kiradimi va soha qaysi tomonga ketadi.`
- ask: `Funksiyaning aniqlanish sohasini o'qda belgilang.`
- correctText: `To'g'ri. Chegara minus beshda, nuqta bo'yalgan, soha o'ngga ketadi. Minus beshda ildiz ostida nol turadi, noldan ildiz esa bor va u nolga teng — shuning uchun chegaraning o'zi ham sohaga kiradi.`
- wrong (chegara to'g'ri, nuqta bo'sh): `Chegara topildi, lekin nuqta bo'sh qoldi. Minus beshni ildiz ostiga qo'ying: nol hosil bo'ladi. Noldan ildiz bormi?`
- wrong (chegara +5 da): `Ildiz ostidagi ifoda nolga aylanadigan sonni toping: iks qo'shuv besh nolga teng bo'lsa, iks nimaga teng?`
- wrong (yo'nalish chapga): `Nolni qo'yib ko'ring: ildiz ostida besh chiqadi, demak nol sohaga kiradi. Nol chegaradan qaysi tomonda turibdi?`
- wrong (chegara boshqa sonda): `Chegara ildiz ostidagi ifodadan chiqadi, formulaning ko'rinishidan emas. Iks qo'shuv beshni nolga tenglashtiring.`
- wrongText: `Ikki savolga javob bering: ildiz ostidagi ifoda qayerda nolga aylanadi va o'sha nuqtaning o'zi sohaga kiradimi?`

**RU.**
- eyebrow: `Ось`
- setup: `На оси показывают три вещи: где граница, входит ли она в область и в какую сторону область идёт.`
- ask: `Отметь на оси область определения функции.`
- correctText: `Верно. Граница в минус пяти, точка закрашена, область идёт вправо. При минус пяти под корнем стоит нуль, а корень из нуля существует и равен нулю — поэтому сама граница тоже входит в область.`
- wrong (граница верна, точка пустая): `Граница найдена, но точка осталась пустой. Подставь минус пять под корень: получится нуль. Существует ли корень из нуля?`
- wrong (граница в +5): `Найди число, при котором подкоренное выражение обращается в нуль: если икс плюс пять равно нулю, чему равен икс?`
- wrong (направление влево): `Подставь нуль: под корнем получится пять, значит нуль входит в область. С какой стороны от границы стоит нуль?`
- wrong (граница в другом числе): `Граница берётся из подкоренного выражения, а не из вида формулы. Приравняй икс плюс пять к нулю.`
- wrongText: `Ответь на два вопроса: где подкоренное выражение обращается в нуль и входит ли сама эта точка в область.`

**EN.**
- eyebrow: `Axis`
- setup: `The axis shows three things: where the boundary is, whether it belongs to the domain, and which way the domain runs.`
- ask: `Mark the domain of the function on the axis.`
- correctText: `Correct. The boundary is at minus five, the point is filled, the domain runs to the right. At minus five the expression under the root is zero, and the root of zero exists and equals zero — so the boundary itself belongs to the domain as well.`
- wrong (boundary right, point hollow): `The boundary was found, but the point was left hollow. Put minus five under the root: you get zero. Does the root of zero exist?`
- wrong (boundary at +5): `Find the number that makes the expression under the root zero: if x plus five equals zero, what does x equal?`
- wrong (direction left): `Try zero: five appears under the root, so zero belongs to the domain. On which side of the boundary does zero stand?`
- wrong (boundary elsewhere): `The boundary comes from the expression under the root, not from the look of the formula. Set x plus five equal to zero.`
- wrongText: `Answer two questions: where does the expression under the root become zero, and does that very point belong to the domain?`

---

# 08 · `OrderLines` · 🔴 · teg `order_domain`

**Nima tekshiriladi.** Yechim zanjirining tartibi: shart avval so'z bilan aytiladi, keyin
tengsizlik bo'lib yoziladi, keyin yechiladi, keyin javob, va oxirida son bilan
tekshiriladi. Tekshirish — qadamning o'zi, qo'shimcha emas: `tekshirilmagan` shu yerda
o'ladi.

**MA'LUMOT.**

```
expr: y = √(12 − x)
lines (to'g'ri tartibda, ekranda ARALASHTIRILADI):
  c1  [so'z]              → UZ/RU/EN
  c2  12 − x ≥ 0
  c3  x ≤ 12
  c4  [so'z] + x ≤ 12
  c5  [so'z] + x = 15 ; 12 − 15 = −3
answer: c1 c2 c3 c4 c5
```

**UZ.**
- eyebrow: `Tartib`
- setup: `Beshta qadam aralashtirilgan. Ular bitta zanjir hosil qiladi.`
- ask: `Qadamlarni to'g'ri tartibga soling.`
- c1: `Ildiz ostida manfiy son bo'lmaydi`
- c4: `Javob: aniqlanish sohasi`
- c5: `Tekshirish: 15 sohaga kirmaydi`
- correctText: `To'g'ri. Zanjir shunday yuradi: avval shart so'z bilan aytiladi, keyin tengsizlik bo'lib yoziladi, keyin yechiladi, keyin javob yoziladi va oxirida javob son bilan tekshiriladi. Tekshirish — qadamning o'zi, qo'shimcha emas.`
- wrong (tekshirish javobdan oldin): `Tekshirish nimani tekshiradi? Javob hali yozilmagan bo'lsa, solishtiradigan narsa yo'q.`
- wrong (`x ≤ 12` tengsizlikdan oldin): `Bu qator tengsizlikni yechish natijasi. Yechilmagan tengsizlikdan natija chiqmaydi.`
- wrong (so'z bilan aytilgan shart birinchi emas): `Nega umuman tengsizlik yozildi? Shu savolning javobi zanjirning boshida turishi kerak.`
- wrong (javob oxirida): `Javob yozilgandan keyin ham bitta ish qoladi: uni son bilan tekshirish.`
- wrongText: `Zanjirni yuqoridan pastga o'qing. Har bir qator o'zidan oldingisidan kelib chiqadimi?`

**RU.**
- eyebrow: `Порядок`
- setup: `Пять шагов перемешаны. Вместе они составляют одну цепочку.`
- ask: `Расставь шаги по порядку.`
- c1: `Под корнем не бывает отрицательного числа`
- c4: `Ответ: область определения`
- c5: `Проверка: 15 в область не входит`
- correctText: `Верно. Цепочка идёт так: сначала условие проговаривается словами, потом записывается неравенством, потом решается, потом пишется ответ, и в конце ответ проверяется числом. Проверка — сам шаг, а не добавка.`
- wrong (проверка раньше ответа): `Что проверяет проверка? Если ответ ещё не записан, сравнивать не с чем.`
- wrong (`x ≤ 12` раньше неравенства): `Эта строка — результат решения неравенства. Из нерешённого неравенства результат не появится.`
- wrong (условие словами не первое): `Почему вообще было записано неравенство? Ответ на этот вопрос должен стоять в начале цепочки.`
- wrong (ответ в конце): `После того как ответ записан, остаётся ещё одно дело: проверить его числом.`
- wrongText: `Прочитай цепочку сверху вниз. Следует ли каждая строка из предыдущей?`

**EN.**
- eyebrow: `Order`
- setup: `Five steps are shuffled. Together they make one chain.`
- ask: `Put the steps in the right order.`
- c1: `A negative number cannot stand under a root`
- c4: `Answer: the domain`
- c5: `Check: 15 does not belong to the domain`
- correctText: `Correct. The chain runs like this: the condition is first said in words, then written as an inequality, then solved, then the answer is written, and at the end the answer is checked with a number. The check is a step itself, not an extra.`
- wrong (check before the answer): `What does the check check? If the answer is not written yet, there is nothing to compare with.`
- wrong (`x ≤ 12` before the inequality): `This line is the result of solving the inequality. An unsolved inequality gives no result.`
- wrong (the spoken condition is not first): `Why was an inequality written at all? The answer to that stands at the head of the chain.`
- wrong (answer last): `Once the answer is written, one job remains: to check it with a number.`
- wrongText: `Read the chain from top to bottom. Does every line follow from the one above it?`

---

# 09 · `AuditLines` (yangi) · 🔴 · teg `first_wrong_line`

**Nima tekshiriladi.** Har qator to'g'riday ko'rinadi, javob esa noto'g'ri. O'quvchi
BIRINCHI xato qatorni topadi.

**Metodist qarori 2026-08-26 (ikkinchi):** pastdagi «qaysi sonda buziladi» maydoni olib
tashlandi, faqat to'rt qatorli ketma-ketlik qoladi. Tushuntirish — minus to'rtning
yo'qolgani — javobdan keyin `correctText` da beriladi. Umumiy qatlamdagi `AuditRows`
ikkita shartni talab qiladi, ya'ni bu boshqa xatti-harakat: mexanika sinfning o'z
faylida (`TIPLAR_AMALIYOT_9SINF.md` §2.1 p. 9 dagi eslatma).

**MA'LUMOT.**

```
given: y = 1/(x² − 16)
rows:
  r1  [so'z] + x² − 16 ≠ 0
  r2  x² ≠ 16
  r3  x ≠ 4                  ← birinchi xato
  r4  [so'z] + x ≠ 4         (uchinchisining takrori)
answerId: r3
```

**UZ.**
- eyebrow: `Xato qator`
- setup: `Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.`
- ask: `Birinchi xato qatorni bosing.`
- r1: `Maxraj nolga teng bo'lmasligi kerak:`
- r4: `Javob:`
- correctText: `To'g'ri, xato uchinchi qatorda. Kvadrati o'n oltiga teng bo'lgan son bitta emas, IKKITA: to'rt va minus to'rt. Uchinchi qatorda ulardan faqat bittasi yozilgan, ikkinchisi yo'qolgan. Minus to'rtni maxrajga qo'ying: minus to'rtning kvadrati o'n olti, o'n olti minus o'n olti nolga teng — demak minus to'rtda ham qiymat yo'q va uni ham chiqarib tashlash kerak edi. To'rtinchi qator shunchaki uchinchisini takrorlaydi, shuning uchun birinchi xato aynan uchinchisida.`
- wrong (r1): `Bu qator to'g'ri: maxraj haqiqatan ham nolga aylanmasligi kerak. Xatoni undan pastda qidiring.`
- wrong (r2): `Bu ham to'g'ri: o'n oltini o'ng tomonga o'tkazish xato emas. Keyingi qadamga qarang — kvadratdan qanday qutulindi va shunda nechta son chiqishi kerak edi?`
- wrong (r4): `To'rtinchi qator uchinchisini takrorlaydi, ya'ni u xatoni faqat ko'chirib yozgan. Bizga BIRINCHI xato kerak, oxirgisi emas.`
- wrongText: `Har qatorni oldingisidan chiqarib ko'ring. Iks kvadrat o'n oltiga teng emas degan yozuvdan iks to'rtga teng emas degan yozuv chiqadimi? Kvadrati o'n oltiga teng bo'ladigan sonlarni sanang.`

**RU.**
- eyebrow: `Ошибочная строка`
- setup: `Решение готово, но ответ неверный. Каждая строка выглядит правильной.`
- ask: `Нажми первую ошибочную строку.`
- r1: `Знаменатель не должен обращаться в нуль:`
- r4: `Ответ:`
- correctText: `Верно, ошибка в третьей строке. Чисел, квадрат которых равен шестнадцати, не одно, а ДВА: четыре и минус четыре. В третьей строке записано только одно из них, второе потерялось. Подставь минус четыре в знаменатель: квадрат минус четырёх — шестнадцать, шестнадцать минус шестнадцать равно нулю, значит при минус четырёх значения тоже нет и его тоже нужно было исключить. Четвёртая строка просто повторяет третью, поэтому первая ошибка именно в третьей.`
- wrong (r1): `Эта строка верна: знаменатель действительно не должен обращаться в нуль. Ищи ошибку ниже.`
- wrong (r2): `Эта тоже верна: перенести шестнадцать вправо — не ошибка. Посмотри на следующий шаг: как избавились от квадрата и сколько чисел при этом должно было получиться?`
- wrong (r4): `Четвёртая строка повторяет третью, то есть она лишь переписала ошибку. Нам нужна ПЕРВАЯ ошибка, а не последняя.`
- wrongText: `Выведи каждую строку из предыдущей. Следует ли из записи «икс в квадрате не равен шестнадцати» запись «икс не равен четырём»? Перечисли числа, квадрат которых равен шестнадцати.`

**EN.**
- eyebrow: `Wrong line`
- setup: `The solution is finished, but the answer is wrong. Every line looks right.`
- ask: `Tap the first wrong line.`
- r1: `The denominator must not become zero:`
- r4: `Answer:`
- correctText: `Correct, the error is in the third line. There is not one but TWO numbers whose square is sixteen: four and minus four. The third line writes down only one of them, the other was lost. Put minus four into the denominator: minus four squared is sixteen, sixteen minus sixteen is zero, so at minus four there is no value either and it had to be excluded as well. The fourth line simply repeats the third, so the first error is exactly in the third.`
- wrong (r1): `This line is right: the denominator really must not become zero. Look for the error below it.`
- wrong (r2): `This one is right too: moving sixteen to the other side is not an error. Look at the next step — how was the square removed, and how many numbers should have appeared?`
- wrong (r4): `The fourth line repeats the third, so it merely copied the error. We need the FIRST error, not the last one.`
- wrongText: `Derive each line from the one above it. Does "x squared is not sixteen" give "x is not four"? Count the numbers whose square is sixteen.`

---

# 10 · `ClozeBank` · 🔴 · teg `rule_words`

**Nima tekshiriladi.** Darsning nazariy qoidasi, undan uchta so'z tushib qolgan.

**Metodist qarori 2026-08-26 (ikkinchi):** moslashtirish o'rniga qoidadagi bo'sh joyni
to'ldirish qo'yiladi. Mexanika 8-sinf amaliyotidan olinadi (`ClozeBank`), nusxa
yozilmaydi.

Qoida darsning UCHALA tasdig'ini o'z ichiga oladi (T1, T2, T3), ya'ni oxirgi topshiriq
butun darsni bir gapga yig'adi. Bankda uchta tuzoq, har biri aniq bir adashishga tegadi.

**MA'LUMOT.**

```
parts:  matn, uya 0, matn, uya 1, matn, uya 2, matn   (uch tilda BIR XIL shaklda)
answer: w1 w2 w3
cards:  w1 bitta      w2 argument    w3 ma'noga       ← to'g'ri
        w4 ikkita     w5 qiymat      w6 nolga         ← tuzoqlar
tuzoqning tegishi:
  w4 → T1 buziladi: bitta x dan ikkita strelka
  w5 → soha argumentniki emas, qiymatlarniki deb o'ylanadi
  w6 → formula nolga teng bo'lgan joyda aniqlangan deb o'ylanadi
```

Bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA — matematika emas.

**UZ.**
- eyebrow: `So'zlar`
- setup: `Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.`
- ask: `Kartani bosing, keyin bo'sh kartochkani bosing.`
- bank: `Kartalar`
- qoida: `Argumentning har bir qiymatiga funksiyaning aynan [bitta] qiymati mos keladi. Aniqlanish sohasi — [argument] qabul qilishi mumkin bo'lgan barcha qiymatlar. Formula bilan berilgan funksiya formula [ma'noga] ega bo'lgan joyda aniqlangan.`
- kartalar: `bitta · argument · ma'noga · ikkita · qiymat · nolga`
- correctText: `To'g'ri, uchala so'z ham joyida. Qoidaning uchta gapi darsning uchta ishini yopadi: birinchisi funksiyani mosliklardan ajratadi, ikkinchisi sohaning argumentniki ekanini aytadi, uchinchisi esa sohani qayerdan izlashni ko'rsatadi — formula hisoblanadigan joydan.`
- wrong (0 = ikkita): `Ikkita qiymat bo'lsa, bu funksiya bo'lmasdi. Bitta x dan ikkita strelka chiqadigan taxtani eslang: u ta'rifni buzardi.`
- wrong (1 = qiymat): `Aniqlanish sohasi qiymatlar to'plami emas. U argument qabul qilishi mumkin bo'lgan sonlar haqida: grafikda bu gorizontal o'q.`
- wrong (2 = nolga): `Formula nolga teng bo'lgan joyda emas, hisoblanadigan joyda aniqlangan. Nol — bu ham qiymat, u sohani kesmaydi; sohani nolga BO'LISH kesadi.`
- wrong (0 va 1 almashdi): `Ikki so'z joyini almashtirdi. Birinchi bo'shliqda NECHTA qiymat borligi, ikkinchisida esa soha KIMNIKI ekani aytiladi.`
- wrongText: `Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nechta qiymat borligini, ikkinchisi soha kimniki ekanini, uchinchisi esa funksiya qayerda aniqlanganini aytadi.`

**RU.**
- eyebrow: `Слова`
- setup: `Правило урока записано, но три слова выпали. Поставь их из карточек снизу.`
- ask: `Нажми карточку, потом пустую клетку.`
- bank: `Карточки`
- правило: `Каждому значению аргумента отвечает ровно [одно] значение функции. Область определения — это все значения, которые может принимать [аргумент]. Функция, заданная формулой, определена там, где формула [имеет смысл].`
- карточки: `одно · аргумент · имеет смысл · два · значение · равна нулю`
- correctText: `Верно, все три слова на месте. Три предложения правила закрывают три дела урока: первое отделяет функцию от прочих соответствий, второе говорит, что область определения — про аргумент, а третье показывает, где её искать: там, где формула считается.`
- wrong (0 = два): `Если бы значений было два, это не была бы функция. Вспомни доску, где из одного x выходили две стрелки: она нарушала определение.`
- wrong (1 = значение): `Область определения — не множество значений. Она про числа, которые может принимать аргумент: на графике это горизонтальная ось.`
- wrong (2 = равна нулю): `Функция определена не там, где формула равна нулю, а там, где формула вообще считается. Нуль — это тоже значение, он область не вырезает; вырезает деление на нуль.`
- wrong (0 и 1 перепутаны): `Два слова поменялись местами. В первой клетке говорится, СКОЛЬКО значений, во второй — ЧЬЯ это область.`
- wrongText: `Проверяй каждую клетку самим предложением: первое говорит, сколько значений, второе — чья это область, третье — где функция определена.`

**EN.**
- eyebrow: `Words`
- setup: `The rule of the lesson is written down, but three words fell out. Put them back from the cards below.`
- ask: `Tap a card, then tap an empty cell.`
- bank: `Cards`
- rule: `Each value of the argument gets exactly [one] value of the function. The domain is every value that the [argument] may take. A function given by a formula is defined where the formula [makes sense].`
- cards: `one · argument · makes sense · two · value · equals zero`
- correctText: `Correct, all three words are in place. The three sentences of the rule cover the three jobs of the lesson: the first separates a function from other correspondences, the second says the domain is about the argument, and the third shows where to look for it — where the formula computes.`
- wrong (0 = two): `If there were two values, it would not be a function. Remember the board where two arrows left one x: it broke the definition.`
- wrong (1 = value): `The domain is not the set of values. It is about the numbers the argument may take: on a graph that is the horizontal axis.`
- wrong (2 = equals zero): `The function is defined not where the formula equals zero but where the formula computes at all. Zero is a value too, it does not cut the domain; division by zero does.`
- wrong (0 and 1 swapped): `Two words swapped places. The first blank says HOW MANY values there are, the second says WHOSE domain it is.`
- wrongText: `Check each blank against the sentence itself: the first says how many values, the second whose domain it is, the third where the function is defined.`

---

## 11. TEKSHIRUV RO'YXATI (3-bosqichga o'tishdan oldin)

- [ ] O'nta topshiriqda ham matematika `L()` dan tashqarida.
- [ ] Har noto'g'ri yo'lga razbor bor va u uch tilda ham bo'sh emas.
- [ ] Birorta razbor javobni to'g'ridan-to'g'ri aytmaydi.
- [ ] UZ da kirillcha yo'q, apostrof ASCII `'`, murojaat `siz`.
- [ ] RU da murojaat `ты`, jinssiz shakl.
- [ ] Sonli misollar amaliyot ichida takrorlanmaydi; 10-topshiriqdagi bir soni — atayin.
- [ ] Darsning misollari (`1/(x−3)`, `√x/(x−4)`, `1/(x²−9)`, `√(4−x)`, `√(2−x)`,
      `1/(x²+1)`) amaliyotda yo'q.
- [ ] Ovoz yo'q.
