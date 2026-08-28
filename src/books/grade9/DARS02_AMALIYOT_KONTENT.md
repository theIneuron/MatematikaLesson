# DARS02_AMALIYOT_KONTENT — 9-sinf, 2-dars amaliyoti, o'nta topshiriqning to'liq matni

> **2-bosqich (KONTENT).** Kirish: `DARS02_04_AMALIYOT_SKELET.md` (metodist tasdiqlagan,
> 2026-08-27), `TIPLAR_AMALIYOT_9SINF.md`, `src/components/grade9/Dars02.jsx`.
> Chiqish: `src/components/grade9/practice/dars02/D02_01…10.jsx`.
>
> Qoidalar `DARS01_AMALIYOT_KONTENT.md` §0 bilan bir xil: matematika til blokidan
> tashqarida, har noto'g'ri yo'lga o'z razbori, razbor javobni bermaydi, razbor matnida
> matematika so'z bilan, javob bir marta tekshiriladi, UZ `siz` / RU `ты`, ovoz yo'q.

---

## 0a. TEXNIKA: `PlacePoint` VA `DomainAxis` GA UCH QO'SHIMCHA

Bu darsda tekislik jadvalsiz kerak bo'ladi, o'q esa grafik bilan. Uchala qo'shimcha ham
BUZMAYDIGAN: 1-dars ularni bermaydi, demak uning xatti-harakati o'zgarmaydi.

| Qayerda | Nima | Kim ishlatadi |
|---|---|---|
| `PlacePoint` | `data.table` ixtiyoriy bo'ldi | 02-05, 03-06, 04-07 |
| `PlacePoint` | `data.marks` — javobga kirmaydigan, OLDINDAN chizilgan nuqtalar | 02-05, 04-07 |
| `PlacePoint` | `data.curve` — tekislikka chiziladigan grafik (`FuncGraph` bilan bir xil usul) | 03-06, 04-07 |
| `DomainAxis` | `Given` chaqiriladi, ya'ni `fig` va `given` ishlaydi | 02-06 |

Yangi mexanika YO'Q. Bularsiz 02-05 da «toq funksiyaning nuqtasi» degan topshiriqni
umuman qo'yib bo'lmaydi: berilgan nuqta ko'rinmasa, o'quvchi nimaga nisbatan simmetrik
qo'yishini bilmaydi.

## 0b. SARLAVHA VA CHIP QATORI

```
HEAD = {
  uz: "Dars 2 amaliyoti — 10 topshiriq (funksiyaning xossalari)",
  ru: "Практика урока 2 — 10 заданий (свойства функции)",
  en: "Lesson 2 practice — 10 tasks (properties of a function)",
}
```

| № | Mexanika | uz | ru | en |
|---:|---|---|---|---|
| 01 | RowTable | Jadval | Таблица | Table |
| 02 | Choice | Xulosa | Вывод | Conclusion |
| 03 | TrueFalse | Ha yoki yo'q | Да или нет | Yes or no |
| 04 | Zones | Guruhlar | Группы | Groups |
| 05 | PlacePoint | Nuqta | Точка | Point |
| 06 | DomainAxis | O'q | Ось | Axis |
| 07 | TypeSet | Qiymat | Значение | Value |
| 08 | AuditLines | Xato qator | Ошибочная строка | Wrong line |
| 09 | OrderLines | Isbot | Доказательство | Proof |
| 10 | ClozeBank | So'zlar | Слова | Words |

---

# 01 · `RowTable` · 🟢 · teg `oyna-vs-burilish`

**Nima tekshiriladi.** Toq funksiyada argumentning ishorasi almashsa, qiymatning ham
ishorasi almashadi. Jadval buni sonlarda ko'rsatadi, hali so'z aytilmasdan oldin.

**MA'LUMOT.**

```
expr: y = 5x
cols:  x : −2   −1    1    ?
       y :  ?   −5    5   10
javob: y(−2) = −10 ;  x = 2      (ikkinchi bo'sh katak TESKARI yo'nalishda)
hints: 10 | 50 | −10 boshqa katakda
```

**UZ.**
- eyebrow: `Jadval`
- setup: `Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.`
- ask: `Ikkita bo'sh katakni to'ldiring.`
- correctText: `To'g'ri. Minus ikkida qiymat minus o'nga teng, ikkida esa o'nga. Ikkala qiymat faqat ishora bilan farq qiladi. Butun jadval shu naqshda: chap tomondagi sonlar o'ng tomondagilarning qarama-qarshisi.`
- wrong (`y(−2)` = 10): `Ishora tushib qoldi. Minus ikkini beshga ko'paytiring: ko'paytuvchilardan bittasi manfiy bo'lsa, ko'paytma qanday bo'ladi?`
- wrong (bo'sh `x` katagida 10): `Bu katak yuqori qatorda, u yerga argument yoziladi. O'n — bu qiymat; undan argumentga o'tish uchun besh iks o'nga teng degan tenglamani yeching.`
- wrong (bo'sh `x` katagida 50): `O'nni beshga ko'paytirdingiz. Bu katakda esa aksincha amal kerak: qiymatdan argumentga qaytish uchun beshga bo'linadi.`
- wrongText: `To'ldirgan har bir katagingizni formulaga qo'yib tekshiring: shu sonni beshga ko'paytirsangiz nima chiqadi?`

**RU.**
- eyebrow: `Таблица`
- setup: `Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.`
- ask: `Заполни две пустые клетки.`
- correctText: `Верно. При минус двух значение равно минус десяти, а при двух — десяти. Оба значения отличаются только знаком. Вся таблица устроена так: числа слева противоположны числам справа.`
- wrong (`y(−2)` = 10): `Знак потерялся. Умножь минус два на пять: каким будет произведение, если один из множителей отрицательный?`
- wrong (в пустой `x` стоит 10): `Эта клетка в верхней строке, туда пишут аргумент. Десять — это значение; чтобы перейти к аргументу, реши уравнение пять икс равно десяти.`
- wrong (в пустой `x` стоит 50): `Ты умножил десять на пять. А в этой клетке нужно обратное действие: чтобы вернуться от значения к аргументу, делят на пять.`
- wrongText: `Проверь каждую заполненную клетку подстановкой: что получится, если это число умножить на пять?`

**EN.**
- eyebrow: `Table`
- setup: `The top row is the argument, the bottom row is the value. The table is filled from the formula.`
- ask: `Fill in the two empty cells.`
- correctText: `Correct. At minus two the value is minus ten, at two it is ten. The two values differ only in sign. The whole table works that way: the numbers on the left are the opposites of those on the right.`
- wrong (`y(−2)` = 10): `The sign was lost. Multiply minus two by five: what is a product when one factor is negative?`
- wrong (10 in the empty `x`): `This cell is in the top row, and the argument goes there. Ten is a value; to get to the argument, solve five x equals ten.`
- wrong (50 in the empty `x`): `You multiplied ten by five. This cell needs the opposite operation: to get back from the value to the argument you divide by five.`
- wrongText: `Check every cell you filled by substitution: what do you get if you multiply that number by five?`

---

# 02 · `Choice` · 🟢 · teg `bitta-nuqtada-xulosa`

**Nima tekshiriladi.** Juftlik va toqlik shartida «har qanday `x` uchun» degan so'z
turibdi. Bitta juftlikda qiymatlar mos tushgani hech nimani isbotlamaydi — bu darsning
eng qimmat gapi, va u faqat shu yerda to'g'ridan-to'g'ri so'raladi.

**MA'LUMOT.**

```
given:  y(1) = 3   va   y(−1) = 3
correct: 3
optCols: 1
```

Variantlar SO'Z (`L()` ichida), berilgan ikkita tenglik esa matematika.

**Qarshi misol razborda:** `y = x³ − x + 3`. Unda `y(1) = 3` va `y(−1) = 3`, lekin
`y(2) = 9`, `y(−2) = −3` — demak funksiya juft emas. Sonlar shu topshiriqning
berilganiga aynan tushadi.

**UZ.**
- eyebrow: `Xulosa`
- setup: `Biror funksiya haqida ikkita qiymat ma'lum.`
- ask: `Bundan qanday xulosa chiqadi?`
- opt 0: `Funksiya juft.`
- opt 1: `Funksiya toq.`
- opt 2: `Funksiya na juft, na toq.`
- opt 3: `Bitta sonda tekshirish yetarli emas.`
- correctText: `To'g'ri. Juftlik shartida «har qanday iks uchun» degan so'z turibdi. Masalan iks kub minus iks qo'shuv uch funksiyasida ham birda va minus birda qiymat uchga teng, lekin ikkida to'qqiz, minus ikkida esa minus uch chiqadi — demak u juft emas. Bitta juftlik hech qanday xulosaga yetmaydi.`
- wrong (0): `Ikki qiymat mos tushdi, lekin shart bitta juftlik uchun emas, har qanday iks uchun qo'yiladi. Iks kub minus iks qo'shuv uch funksiyasini sinab ko'ring: birda ham, minus birda ham uch chiqadi, ikki va minus ikkida esa sonlar boshqa.`
- wrong (1): `Toqlik uchun qiymatlar teng emas, QARAMA-QARSHI bo'lishi kerak edi: minus uch va uch. Bu yerda ikkalasi ham uch.`
- wrong (2): `Bu ham xulosa, va uni ham bitta juftlikdan chiqarib bo'lmaydi. Berilgan ma'lumot uchala xulosaning hech biriga yetmaydi.`
- wrongText: `Juftlik va toqlik shartida «har qanday iks uchun» degan so'z turibdi. Bitta juftlik nimani isbotlaydi?`

**RU.**
- eyebrow: `Вывод`
- setup: `Про некоторую функцию известны два значения.`
- ask: `Какой вывод из этого следует?`
- opt 0: `Функция чётная.`
- opt 1: `Функция нечётная.`
- opt 2: `Функция ни чётная, ни нечётная.`
- opt 3: `Проверки в одном числе недостаточно.`
- correctText: `Верно. В условии чётности стоят слова «при любом икс». Например, у функции икс в кубе минус икс плюс три при единице и при минус единице значение равно трём, а при двух — девять, при минус двух — минус три, значит она не чётная. Одной пары не хватает ни для какого вывода.`
- wrong (0): `Два значения совпали, но условие ставится не на одну пару, а на любой икс. Проверь функцию икс в кубе минус икс плюс три: и при единице, и при минус единице выходит три, а при двух и минус двух числа разные.`
- wrong (1): `Для нечётности значения должны быть не равными, а ПРОТИВОПОЛОЖНЫМИ: минус три и три. Здесь оба равны трём.`
- wrong (2): `Это тоже вывод, и его тоже нельзя сделать по одной паре. Данных не хватает ни для одного из трёх выводов.`
- wrongText: `В условии чётности и нечётности стоят слова «при любом икс». Что доказывает одна пара?`

**EN.**
- eyebrow: `Conclusion`
- setup: `Two values of some function are known.`
- ask: `What follows from this?`
- opt 0: `The function is even.`
- opt 1: `The function is odd.`
- opt 2: `The function is neither even nor odd.`
- opt 3: `Checking at one number is not enough.`
- correctText: `Correct. The condition for evenness says "for every x". For instance, x cubed minus x plus three gives three both at one and at minus one, but nine at two and minus three at minus two — so it is not even. One pair is not enough for any conclusion.`
- wrong (0): `Two values matched, but the condition is placed on every x, not on one pair. Try x cubed minus x plus three: it gives three at one and at minus one, but different numbers at two and minus two.`
- wrong (1): `For oddness the values must be not equal but OPPOSITE: minus three and three. Here both are three.`
- wrong (2): `That is a conclusion too, and it also cannot be drawn from one pair. The data is not enough for any of the three.`
- wrongText: `The conditions for even and odd both say "for every x". What does one pair prove?`

---

# 03 · `TrueFalse` + grafik · 🟢 · teg `bitta-tarmoq`

**Nima tekshiriladi.** «O'suvchi» so'zi har doim ORALIQ bilan aytiladi. Grafikda burilish
nuqtasi bor, shuning uchun «butun sohada o'suvchi» degan gap buziladi. Uchinchi hukm
simmetriyani qo'shadi: bu boshqa xossa, u yo'nalish haqida hech nima demaydi.

**MA'LUMOT.**

```
fig:  y = f(x), aniqlanish sohasi [−4; 4]
      (−4; 2) dan pasayib (0; −2) ga tushadi, so'ng (4; 2) ga ko'tariladi
      formulasi: f(x) = x²/4 − 2   (chizish uchun, ekranda ko'rsatilmaydi)
items:  s1 yes: true   — belgilar: [0; 4]
        s2 yes: false  — belgilar: [−4; 4]
        s3 yes: true   — belgilar: Oy
```

**UZ.**
- eyebrow: `Ha yoki yo'q`
- setup: `Grafikda y = f(x) chizilgan, aniqlanish sohasi minus to'rtdan to'rtgacha.`
- ask: `Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.`
- s1: `oralig'ida funksiya o'suvchi.`
- s2: `oralig'ining hammasida funksiya o'suvchi.`
- s3: `o'qiga nisbatan grafik simmetrik.`
- correctText: `To'g'ri, uchtasi ham. Grafikda burilish nuqtasi bor: undan chapda chiziq pastga ketadi, o'ngda ko'tariladi. Shuning uchun «o'suvchi» so'zi har doim oraliq bilan aytiladi. Simmetriya esa boshqa xossa — u ikki tarmoq bir xil ekanini bildiradi, yo'nalish haqida hech nima demaydi.`
- wrong (s2): `Grafikning chap yarmiga qarang: u yerda chiziq pastga ketyapti. Bitta oraliqda o'sishi butun sohada o'sishini bildirmaydi.`
- wrong (s1): `Noldan o'ngga qarab yuring va chiziqni kuzating: u ko'tarilyaptimi yoki tushyaptimi?`
- wrong (s3): `Grafikni tik o'q bo'ylab bukib ko'ring: ikki yarim ustma-ust tushadimi?`
- wrongText: `Grafikni burilish nuqtasidan ikkiga bo'ling. Har qismda yo'nalish alohida qaraladi.`

**RU.**
- eyebrow: `Да или нет`
- setup: `На графике построена y = f(x), область определения от минус четырёх до четырёх.`
- ask: `Для каждого суждения выбери «Да» или «Нет».`
- s1: `на этом промежутке функция возрастает.`
- s2: `на всём этом промежутке функция возрастает.`
- s3: `относительно этой оси график симметричен.`
- correctText: `Верно, все три. На графике есть точка поворота: слева от неё линия идёт вниз, справа поднимается. Поэтому слово «возрастает» всегда говорят про промежуток. А симметрия — другое свойство: она говорит, что две ветви одинаковы, и ничего не говорит про направление.`
- wrong (s2): `Посмотри на левую половину графика: там линия идёт вниз. Возрастание на одном промежутке не означает возрастания на всей области.`
- wrong (s1): `Иди от нуля вправо и следи за линией: она поднимается или опускается?`
- wrong (s3): `Согни график по вертикальной оси: совпадут ли две половины?`
- wrongText: `Раздели график точкой поворота на две части. В каждой части направление смотрят отдельно.`

**EN.**
- eyebrow: `Yes or no`
- setup: `The graph shows y = f(x), the domain runs from minus four to four.`
- ask: `Choose "Yes" or "No" for each claim.`
- s1: `on this interval the function is increasing.`
- s2: `on the whole of this interval the function is increasing.`
- s3: `the graph is symmetric about this axis.`
- correctText: `Correct, all three. The graph has a turning point: to the left of it the line goes down, to the right it rises. That is why the word "increasing" is always said about an interval. Symmetry is a different property — it says the two branches are alike and says nothing about direction.`
- wrong (s2): `Look at the left half of the graph: the line goes down there. Increasing on one interval does not mean increasing on the whole domain.`
- wrong (s1): `Walk from zero to the right and watch the line: does it rise or fall?`
- wrong (s3): `Fold the graph along the vertical axis: do the two halves match?`
- wrongText: `Split the graph at the turning point. Direction is judged separately in each part.`

---

# 04 · `Zones` · 🟡 · teg `oyna-vs-burilish`

**Nima tekshiriladi.** Juft daraja ishorani yutadi, toq daraja uni o'tkazadi. Qo'shilgan
son toqlikni buzadi, juftlikni esa buzmaydi — ikkita tuzoq shu yerdan chiqadi.

**MA'LUMOT.**

```
zones: A juft | B toq | C na juft, na toq
items:  i1  y = x⁴        → A
        i2  y = x² − 6    → A
        i3  y = −2x       → B
        i4  y = x⁵        → B
        i5  y = 2x + 7    → C
        i6  y = x³ + 1    → C
```

**UZ.**
- eyebrow: `Guruhlar`
- zona A: `Juft` · zona B: `Toq` · zona C: `Na juft, na toq`
- setup: `Guruhni nom emas, xossa hal qiladi: minus iks da qiymat qanday o'zgaradi.`
- ask: `Har bir yozuvni o'z guruhiga qo'ying.`
- correctText: `To'g'ri. Juft daraja ishorani yutadi, toq daraja esa uni o'tkazadi. Qo'shilgan son bu naqshni buzishi mumkin: toq funksiyaga son qo'shilsa, u toq bo'lmay qoladi. Juft funksiyada esa son qo'shish yoki ayirish hech nimani buzmaydi.`
- wrong (i6 → B): `Iks kub qo'shuv birga minus birni qo'ying: nol chiqadi. Birda esa ikki. Toqlik uchun bu ikki son qarama-qarshi bo'lishi kerak edi.`
- wrong (i5 → A yoki B): `Birda to'qqiz, minus birda besh. Bu sonlar na teng, na qarama-qarshi.`
- wrong (i2 → B yoki C): `Kvadrat ishorani yutadi, ayrilgan olti esa ikkala tomonda ham bir xil qoladi.`
- wrong (i4 → A): `Toq daraja ishorani saqlaydi: minus ikkining beshinchi darajasi manfiy, ikkiniki esa musbat.`
- wrong (i1 → B yoki C): `Juft daraja: minus uchning to'rtinchi darajasi ham, uchning to'rtinchi darajasi ham bir xil son.`
- wrong (i3 → A yoki C): `Iks ning ishorasi almashsa, minus ikki iks ham ishorasini almashtiradi.`
- wrongText: `Har yozuvga birni va minus birni qo'ying. Qiymatlar teng bo'lsa — juft, qarama-qarshi bo'lsa — toq, boshqa holda — na juft, na toq.`

**RU.**
- eyebrow: `Группы`
- зона A: `Чётная` · зона B: `Нечётная` · зона C: `Ни чётная, ни нечётная`
- setup: `Группу решает не название, а свойство: что происходит со значением при минус икс.`
- ask: `Разложи каждую запись в свою группу.`
- correctText: `Верно. Чётная степень поглощает знак, нечётная его пропускает. Прибавленное число может сломать эту картину: если к нечётной функции прибавить число, она перестаёт быть нечётной. А у чётной функции прибавление или вычитание числа ничего не ломает.`
- wrong (i6 → B): `Подставь минус единицу в икс в кубе плюс один: получится нуль. А при единице — два. Для нечётности эти два числа должны были быть противоположными.`
- wrong (i5 → A или B): `При единице девять, при минус единице пять. Эти числа ни равны, ни противоположны.`
- wrong (i2 → B или C): `Квадрат поглощает знак, а вычитаемая шестёрка остаётся одинаковой с обеих сторон.`
- wrong (i4 → A): `Нечётная степень сохраняет знак: минус два в пятой отрицательно, а два в пятой положительно.`
- wrong (i1 → B или C): `Чётная степень: и минус три в четвёртой, и три в четвёртой дают одно и то же число.`
- wrong (i3 → A или C): `Если знак икс меняется, минус два икс тоже меняет знак.`
- wrongText: `Подставь в каждую запись единицу и минус единицу. Значения равны — чётная, противоположны — нечётная, иначе — ни та, ни другая.`

**EN.**
- eyebrow: `Groups`
- zone A: `Even` · zone B: `Odd` · zone C: `Neither even nor odd`
- setup: `The group is decided not by a name but by a property: what happens to the value at minus x.`
- ask: `Put each record into its own group.`
- correctText: `Correct. An even power swallows the sign, an odd power passes it through. An added number can break that picture: add a number to an odd function and it stops being odd. For an even function, adding or subtracting a number breaks nothing.`
- wrong (i6 → B): `Put minus one into x cubed plus one: you get zero. At one you get two. For oddness those two numbers had to be opposite.`
- wrong (i5 → A or B): `At one it is nine, at minus one it is five. These numbers are neither equal nor opposite.`
- wrong (i2 → B or C): `The square swallows the sign, and the subtracted six stays the same on both sides.`
- wrong (i4 → A): `An odd power keeps the sign: minus two to the fifth is negative, two to the fifth is positive.`
- wrong (i1 → B or C): `An even power: minus three to the fourth and three to the fourth give the same number.`
- wrong (i3 → A or C): `If the sign of x changes, minus two x changes sign as well.`
- wrongText: `Put one and minus one into every record. Equal values mean even, opposite values mean odd, anything else means neither.`

---

# 05 · `PlacePoint` · 🟡 · teg `oyna-vs-burilish`

**Nima tekshiriladi.** Toq funksiyaning simmetriyasi — burilish, oyna emas. Ikkala son
ham ishorasini almashtiradi. Asosiy tuzoq `(−2; 3)` — bu juft funksiyaning simmetriyasi.

**MA'LUMOT.**

```
setup:  funksiya TOQ (shartda aytiladi, formulasi berilmaydi)
marks:  (2; 3)  — oldindan chizilgan, javobga kirmaydi
plane:  x ∈ [−4; 4], y ∈ [−4; 4]
answer: (−2; −3)
table:  YO'Q
```

**UZ.**
- eyebrow: `Nuqta`
- setup: `Funksiya toq. Uning grafigidagi bitta nuqta tekislikda belgilangan.`
- ask: `Toqlik bo'yicha unga mos nuqtani qo'ying.`
- correctText: `To'g'ri. Toq funksiyada ikkala son ham ishorasini almashtiradi: argument minus ikki bo'ladi, qiymat esa minus uch. Bu koordinatalar boshiga nisbatan burilish — nuqtani nol atrofida yarim aylantirgandek.`
- wrong (−2; 3): `Faqat birinchi son ishorasini almashtirdi. Bu oyna simmetriyasi, ya'ni JUFT funksiyaniki. Toq funksiyada qiymat ham ishorasini almashtiradi.`
- wrong (2; −3): `Faqat qiymat ishorasini almashtirdi, argument joyida qoldi. Toqlik sharti minus iks dan boshlanadi.`
- wrong (3; −2) yoki (−3; 2): `Sonlar o'rin almashdi. Birinchi son gorizontal o'qda, ikkinchisi tik o'qda o'lchanadi.`
- wrongText: `Toqlik sharti: minus iks da qiymat ham qarama-qarshi bo'ladi. Demak nuqtaning ikkala soni ham ishorasini almashtiradi.`

**RU.**
- eyebrow: `Точка`
- setup: `Функция нечётная. Одна точка её графика отмечена на плоскости.`
- ask: `Поставь точку, отвечающую ей по нечётности.`
- correctText: `Верно. У нечётной функции знак меняют оба числа: аргумент становится минус два, а значение — минус три. Это симметрия относительно начала координат, как поворот точки на пол-оборота вокруг нуля.`
- wrong (−2; 3): `Знак поменяло только первое число. Это зеркальная симметрия, то есть свойство ЧЁТНОЙ функции. У нечётной знак меняет и значение.`
- wrong (2; −3): `Знак поменяло только значение, а аргумент остался на месте. Условие нечётности начинается с минус икс.`
- wrong (3; −2) или (−3; 2): `Числа поменялись местами. Первое откладывают по горизонтальной оси, второе — по вертикальной.`
- wrongText: `Условие нечётности: при минус икс значение становится противоположным. Значит знак меняют оба числа точки.`

**EN.**
- eyebrow: `Point`
- setup: `The function is odd. One point of its graph is marked on the plane.`
- ask: `Place the point that matches it by oddness.`
- correctText: `Correct. For an odd function both numbers change sign: the argument becomes minus two and the value minus three. This is symmetry about the origin, like turning the point half a turn around zero.`
- wrong (−2; 3): `Only the first number changed sign. That is mirror symmetry, the property of an EVEN function. For an odd one the value changes sign too.`
- wrong (2; −3): `Only the value changed sign, the argument stayed put. The condition for oddness starts from minus x.`
- wrong (3; −2) or (−3; 2): `The numbers changed places. The first goes along the horizontal axis, the second along the vertical one.`
- wrongText: `The condition for oddness: at minus x the value becomes the opposite. So both numbers of the point change sign.`

---

# 06 · `DomainAxis` + grafik · 🟡 · teg `bitta-tarmoq`

**Nima tekshiriladi.** O'sish oralig'i burilish nuqtasidan boshlanadi va o'ngga ketadi.
Burilish nuqtasining o'zi oraliqqa kiradi — nuqta bo'yalgan.

**MA'LUMOT.**

```
fig:   grafik [−3; 5] da, burilish nuqtasi x = 1, chapda pasayadi, o'ngda ko'tariladi
       formulasi: f(x) = (x − 1)² − 2   (chizish uchun)
axis:  [−4; 6]
answer: { at: 1, closed: true, dir: right }
```

**UZ.**
- eyebrow: `O'q`
- setup: `O'qda uchta narsa ko'rsatiladi: chegara qayerda, u oraliqqa kiradimi va oraliq qaysi tomonga ketadi.`
- ask: `Funksiya o'suvchi bo'lgan oraliqni o'qda ko'rsating.`
- correctText: `To'g'ri. Burilish nuqtasi birda, undan o'ngda grafik ko'tariladi. Burilish nuqtasining o'zi ham oraliqqa kiradi, shuning uchun nuqta bo'yalgan: undan boshlab funksiya o'sadi.`
- wrong (chegara to'g'ri, yo'nalish chapga): `Chapda grafik pastga ketyapti — bu kamayish oralig'i. Burilish nuqtasidan o'ngga qarab yuring va chiziqni kuzating.`
- wrong (chegara to'g'ri, nuqta bo'sh): `Chegara topildi. Burilish nuqtasining o'zi ham o'sish oralig'iga kiradi: undan boshlab qiymatlar ortadi.`
- wrong (chegara boshqa sonda): `Chegara grafikning BURILISH nuqtasi. Chiziq qaysi sonda pastga ketishdan to'xtab, ko'tarila boshlaydi?`
- wrongText: `Grafikni burilish nuqtasidan ikkiga bo'ling. Qaysi qismda chiziq ko'tariladi — o'sish oralig'i o'sha yerda.`

**RU.**
- eyebrow: `Ось`
- setup: `На оси показывают три вещи: где граница, входит ли она в промежуток и в какую сторону промежуток идёт.`
- ask: `Отметь на оси промежуток, на котором функция возрастает.`
- correctText: `Верно. Точка поворота — единица, правее её график поднимается. Сама точка поворота тоже входит в промежуток, поэтому точка закрашена: начиная с неё функция возрастает.`
- wrong (граница верна, направление влево): `Слева график идёт вниз — это промежуток убывания. Иди от точки поворота вправо и следи за линией.`
- wrong (граница верна, точка пустая): `Граница найдена. Сама точка поворота тоже входит в промежуток возрастания: начиная с неё значения растут.`
- wrong (граница в другом числе): `Граница — это точка ПОВОРОТА графика. При каком числе линия перестаёт опускаться и начинает подниматься?`
- wrongText: `Раздели график точкой поворота. В какой части линия поднимается — там и промежуток возрастания.`

**EN.**
- eyebrow: `Axis`
- setup: `The axis shows three things: where the boundary is, whether it belongs to the interval, and which way the interval runs.`
- ask: `Mark on the axis the interval where the function is increasing.`
- correctText: `Correct. The turning point is at one, and to the right of it the graph rises. The turning point itself belongs to the interval, so the point is filled: from it on the function increases.`
- wrong (boundary right, direction left): `To the left the graph goes down — that is the decreasing interval. Walk right from the turning point and watch the line.`
- wrong (boundary right, point hollow): `The boundary is found. The turning point itself also belongs to the increasing interval: from it on the values grow.`
- wrong (boundary elsewhere): `The boundary is the TURNING point of the graph. At which number does the line stop falling and start rising?`
- wrongText: `Split the graph at the turning point. Where the line rises is the increasing interval.`

---

# 07 · `TypeSet` · 🟡 · teg `bitta-nuqtada-xulosa`

**Nima tekshiriladi.** Toqlik xossasi HISOBLASHNI almashtiradi: `y(3)` ma'lum bo'lsa,
`y(−3)` ni qayta hisoblash shart emas.

**MA'LUMOT.**

```
given:  y = x³ − x  toq funksiya,  y(3) = 24
answer: −24
allowNeg: true
hints: 24 | 0 | −8
```

**UZ.**
- eyebrow: `Qiymat`
- setup: `Funksiya toq ekani ma'lum, va bitta qiymati berilgan.`
- ask: `y(−3) ni yozing.`
- correctText: `To'g'ri, minus yigirma to'rt. Buni hisoblash shart emas edi: toq funksiyada minus uch dagi qiymat uch dagi qiymatning qarama-qarshisi. Xossa hisobning o'rnini bosdi.`
- wrong (24): `Bu juft funksiyaning javobi: u yerda qiymatlar teng bo'lardi. Toq funksiyada esa qarama-qarshi.`
- wrong (0): `Nol faqat bitta nuqtada, iks nolga teng bo'lganda chiqadi. Bu yerda esa savol minus uch haqida.`
- wrong (−8 yoki boshqa son): `Formulani qayta hisoblashning hojati yo'q. Toqlik sharti tayyor javobni beradi: minus uch dagi qiymat uch dagi qiymatga qarama-qarshi.`
- wrongText: `Toqlik sharti: minus iks dagi qiymat iks dagi qiymatning qarama-qarshisi. Yigirma to'rtning qarama-qarshisi qaysi son?`

**RU.**
- eyebrow: `Значение`
- setup: `Известно, что функция нечётная, и дано одно её значение.`
- ask: `Напиши y(−3).`
- correctText: `Верно, минус двадцать четыре. Считать было не нужно: у нечётной функции значение при минус трёх противоположно значению при трёх. Свойство заменило вычисление.`
- wrong (24): `Это ответ для чётной функции: там значения были бы равны. У нечётной они противоположны.`
- wrong (0): `Нуль получается только в одной точке, при икс равном нулю. А вопрос про минус три.`
- wrong (−8 или другое число): `Пересчитывать по формуле не нужно. Условие нечётности даёт готовый ответ: значение при минус трёх противоположно значению при трёх.`
- wrongText: `Условие нечётности: значение при минус икс противоположно значению при икс. Какое число противоположно двадцати четырём?`

**EN.**
- eyebrow: `Value`
- setup: `The function is known to be odd, and one of its values is given.`
- ask: `Write y(−3).`
- correctText: `Correct, minus twenty-four. There was no need to compute: for an odd function the value at minus three is the opposite of the value at three. The property replaced the arithmetic.`
- wrong (24): `That is the answer for an even function, where the values would be equal. For an odd one they are opposite.`
- wrong (0): `Zero appears at one point only, when x equals zero. The question is about minus three.`
- wrong (−8 or another number): `There is no need to recompute from the formula. The oddness condition gives the answer straight away: the value at minus three is the opposite of the value at three.`
- wrongText: `The oddness condition: the value at minus x is the opposite of the value at x. Which number is the opposite of twenty-four?`

---

# 08 · `AuditLines` · 🔴 · teg `bitta-nuqtada-xulosa`

**Nima tekshiriladi.** «Juft emas» degan xulosadan «toq» degan xulosa CHIQMAYDI. Uchinchi
imkoniyat bor: na juft, na toq.

**MA'LUMOT.**

```
given: y = x² + x  juftmi yoki toqmi?
rows:
  r1  y(1) = 1 + 1 = 2
  r2  y(−1) = 1 − 1 = 0
  r3  [so'z] y(−1) ≠ y(1), demak funksiya toq     ← birinchi xato
  r4  [so'z] Javob: funksiya toq
answerId: r3
```

**UZ.**
- eyebrow: `Xato qator`
- setup: `Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.`
- ask: `Birinchi xato qatorni bosing.`
- r3: `demak funksiya toq`
- r4: `Javob: funksiya toq`
- correctText: `To'g'ri, xato uchinchi qatorda. Ikkinchi qatorgacha hammasi to'g'ri hisoblangan: qiymatlar teng emas, demak funksiya juft emas. Lekin bundan toqlik chiqmaydi — toqlik uchun qiymatlar qarama-qarshi bo'lishi kerak, ya'ni nol emas, minus ikki chiqishi kerak edi. Uchinchi imkoniyat esa unutilgan: funksiya na juft, na toq.`
- wrong (r1): `Bu qator to'g'ri hisoblangan: birning kvadrati bir, ustiga bir qo'shiladi. Xatoni undan pastda qidiring.`
- wrong (r2): `Bu ham to'g'ri: minus birning kvadrati bir, ustiga minus bir qo'shiladi. Keyingi qadamga qarang — qiymatlardan qanday xulosa chiqarilgan?`
- wrong (r4): `To'rtinchi qator uchinchisini takrorlaydi, ya'ni u xatoni faqat ko'chirib yozgan. Bizga BIRINCHI xato kerak, oxirgisi emas.`
- wrongText: `Ikkinchi qatordan keyin nima ma'lum bo'ldi? Faqat shuki, funksiya juft emas. Bundan darrov toqlik chiqadimi?`

**RU.**
- eyebrow: `Ошибочная строка`
- setup: `Решение готово, но ответ неверный. Каждая строка выглядит правильной.`
- ask: `Нажми первую ошибочную строку.`
- r3: `значит функция нечётная`
- r4: `Ответ: функция нечётная`
- correctText: `Верно, ошибка в третьей строке. До второй строки всё посчитано правильно: значения не равны, значит функция не чётная. Но отсюда не следует нечётность — для неё значения должны быть противоположными, то есть должно было получиться минус два, а не нуль. А третья возможность забыта: функция ни чётная, ни нечётная.`
- wrong (r1): `Эта строка посчитана верно: единица в квадрате — единица, к ней прибавляется единица. Ищи ошибку ниже.`
- wrong (r2): `Эта тоже верна: минус единица в квадрате — единица, к ней прибавляется минус единица. Посмотри на следующий шаг: какой вывод сделан из значений?`
- wrong (r4): `Четвёртая строка повторяет третью, то есть она лишь переписала ошибку. Нам нужна ПЕРВАЯ ошибка, а не последняя.`
- wrongText: `Что стало известно после второй строки? Только то, что функция не чётная. Следует ли отсюда сразу нечётность?`

**EN.**
- eyebrow: `Wrong line`
- setup: `The solution is finished, but the answer is wrong. Every line looks right.`
- ask: `Tap the first wrong line.`
- r3: `so the function is odd`
- r4: `Answer: the function is odd`
- correctText: `Correct, the error is in the third line. Everything up to the second line is computed right: the values are not equal, so the function is not even. But oddness does not follow from that — for oddness the values must be opposite, that is, minus two should have appeared, not zero. And a third possibility was forgotten: the function is neither even nor odd.`
- wrong (r1): `This line is computed correctly: one squared is one, and one is added to it. Look for the error below.`
- wrong (r2): `This one is right too: minus one squared is one, and minus one is added. Look at the next step — what conclusion was drawn from the values?`
- wrong (r4): `The fourth line repeats the third, so it merely copied the error. We need the FIRST error, not the last one.`
- wrongText: `What was known after the second line? Only that the function is not even. Does oddness follow from that at once?`

---

# 09 · `OrderLines` · 🔴 · teg `bitta-nuqtada-xulosa`

**Nima tekshiriladi.** Isbot bitta songa qo'yishdan boshlanmaydi. Birinchi qadam —
aniqlanish sohasi, chunki `y(−x)` umuman mavjud bo'lishi kerak.

**MA'LUMOT.**

```
given: y = 4 − x²
lines (to'g'ri tartibda, ekranda ARALASHTIRILADI):
  c1  [so'z] Aniqlanish sohasi butun sonlar o'qi, u nolga nisbatan simmetrik
  c2  y(−x) = 4 − (−x)²
  c3  (−x)² = x² , demak y(−x) = 4 − x²
  c4  y(−x) = y(x)
  c5  [so'z] Javob: funksiya juft
answer: c1 c2 c3 c4 c5
```

**UZ.**
- eyebrow: `Isbot`
- setup: `Beshta qadam aralashtirilgan. Ular bitta isbot zanjirini hosil qiladi.`
- ask: `Qadamlarni to'g'ri tartibga soling.`
- c1: `Aniqlanish sohasi butun sonlar o'qi, u nolga nisbatan simmetrik`
- c5: `Javob: funksiya juft`
- correctText: `To'g'ri. Isbot sohadan boshlanadi: minus iks umuman sohaga tushishi kerak, aks holda igrek minus iks ni yozib ham bo'lmaydi. Keyin minus iks formulaga qo'yiladi, soddalashtiriladi, natija asl formula bilan solishtiriladi va shundan keyingina xulosa yoziladi. Bironta joyda aniq son ishlatilmadi — shuning uchun bu isbot, tekshiruv emas.`
- wrong (c1 birinchi emas): `Isbot nimadan boshlanadi? Minus iks sohaga tushmasa, igrek minus iks degan yozuvning o'zi ma'nosiz bo'lardi.`
- wrong (c4 c3 dan oldin): `Ikki yozuvni solishtirish uchun avval ikkinchisini soddalashtirish kerak. Qavs ichidagi minusdan qanday qutulindi?`
- wrong (c5 oxirgi emas): `Xulosa zanjirning oxirida turadi. Undan keyin isbotlanadigan narsa qolmaydi.`
- wrong (c2 c1 dan oldin): `Avval soha, keyin almashtirish. Tartib teskari bo'lsa, hali mavjudligi tekshirilmagan yozuv bilan ishlashga to'g'ri keladi.`
- wrongText: `Zanjirni yuqoridan pastga o'qing. Har qator o'zidan oldingisidan kelib chiqadimi?`

**RU.**
- eyebrow: `Доказательство`
- setup: `Пять шагов перемешаны. Вместе они составляют одну цепочку доказательства.`
- ask: `Расставь шаги по порядку.`
- c1: `Область определения — вся числовая ось, она симметрична относительно нуля`
- c5: `Ответ: функция чётная`
- correctText: `Верно. Доказательство начинается с области: минус икс вообще должен попадать в неё, иначе запись игрек от минус икс не имеет смысла. Потом минус икс подставляют в формулу, упрощают, сравнивают с исходной и только затем пишут вывод. Ни в одном месте не понадобилось конкретное число — поэтому это доказательство, а не проверка.`
- wrong (c1 не первый): `С чего начинается доказательство? Если минус икс не попадает в область, сама запись игрек от минус икс была бы бессмысленной.`
- wrong (c4 раньше c3): `Чтобы сравнить две записи, вторую сначала надо упростить. Как избавились от минуса в скобке?`
- wrong (c5 не последний): `Вывод стоит в конце цепочки. После него доказывать уже нечего.`
- wrong (c2 раньше c1): `Сначала область, потом подстановка. При обратном порядке пришлось бы работать с записью, существование которой ещё не проверено.`
- wrongText: `Прочитай цепочку сверху вниз. Следует ли каждая строка из предыдущей?`

**EN.**
- eyebrow: `Proof`
- setup: `Five steps are shuffled. Together they make one chain of proof.`
- ask: `Put the steps in the right order.`
- c1: `The domain is the whole number line, and it is symmetric about zero`
- c5: `Answer: the function is even`
- correctText: `Correct. The proof starts from the domain: minus x must belong to it at all, otherwise writing y of minus x makes no sense. Then minus x goes into the formula, it is simplified, compared with the original, and only after that the conclusion is written. No particular number was needed anywhere — that is what makes this a proof and not a check.`
- wrong (c1 not first): `Where does a proof start? If minus x is not in the domain, the very expression y of minus x would be meaningless.`
- wrong (c4 before c3): `To compare two records, the second one must first be simplified. How was the minus inside the brackets dealt with?`
- wrong (c5 not last): `The conclusion stands at the end of the chain. After it there is nothing left to prove.`
- wrong (c2 before c1): `Domain first, substitution second. In the other order you would work with a record whose existence has not been checked.`
- wrongText: `Read the chain from top to bottom. Does every line follow from the one above it?`

---

# 10 · `ClozeBank` · 🔴 · teg `oyna-vs-burilish`

**Nima tekshiriladi.** Darsning uchala tasdig'i bir gapda. Bankdagi uchta tuzoq uchta
adashishga tegadi: yo'nalish teskari, oyna o'rniga `Ox`, burilish o'rniga uchi.

**MA'LUMOT.**

```
parts:  matn, uya 0, matn, uya 1, matn, uya 2, matn   (uch tilda BIR XIL shaklda)
answer: w1 w2 w3
cards:  w1 o'suvchi   w2 Oy   w3 boshiga      ← to'g'ri
        w4 kamayuvchi w5 Ox   w6 uchiga       ← tuzoqlar
```

Kartalar SO'Z, ya'ni `L()` ichida.

**UZ.**
- eyebrow: `So'zlar`
- setup: `Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.`
- ask: `Kartani bosing, keyin bo'sh kartochkani bosing.`
- bank: `Kartalar`
- qoida: `Agar oraliqda kattaroq x ga kattaroq y mos kelsa, funksiya shu oraliqda [o'suvchi]. Juft funksiyaning grafigi [Oy] o'qiga nisbatan simmetrik, toq funksiyaning grafigi esa koordinatalar [boshiga] nisbatan simmetrik.`
- kartalar: `o'suvchi · Oy · boshiga · kamayuvchi · Ox · uchiga`
- correctText: `To'g'ri, uchala so'z ham joyida. Qoidada darsning uchta ishi turibdi: birinchisi yo'nalishni oraliq bilan bog'laydi, ikkinchisi juft funksiyaning oyna simmetriyasini beradi, uchinchisi esa toq funksiyaning burilish simmetriyasini. Ikki simmetriya bir xil emas: birida grafik bukiladi, ikkinchisida buriladi.`
- wrong (0 = kamayuvchi): `Kattaroq iks ga kattaroq igrek mos kelyapti, ya'ni qiymat ortyapti. Kamayish bunga qarama-qarshi.`
- wrong (1 = Ox): `Juft funksiyaning grafigini gorizontal o'q bo'ylab emas, TIK o'q bo'ylab buksangiz, ikki yarim ustma-ust tushadi.`
- wrong (2 = uchiga): `Toq funksiyada simmetriya markazi — koordinatalar boshi, ya'ni nol nuqtasi. Uchi esa parabolaning so'zi, bu darsda emas.`
- wrong (1 va 2 almashdi): `Ikki so'z joyini almashtirdi. Oyna simmetriyasi o'qqa nisbatan, burilish simmetriyasi esa NUQTAGA nisbatan bo'ladi.`
- wrongText: `Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi yo'nalishni, ikkinchisi juft funksiyaning oynasini, uchinchisi toq funksiyaning burilishini aytadi.`

**RU.**
- eyebrow: `Слова`
- setup: `Правило урока записано, но три слова выпали. Поставь их из карточек снизу.`
- ask: `Нажми карточку, потом пустую клетку.`
- bank: `Карточки`
- правило: `Если на промежутке большему x соответствует большее y, функция на нём [возрастающая]. График чётной функции симметричен относительно оси [Oy], а график нечётной — относительно [начала] координат.`
- карточки: `возрастающая · Oy · начала · убывающая · Ox · вершины`
- correctText: `Верно, все три слова на месте. В правиле стоят три дела урока: первое связывает направление с промежутком, второе даёт зеркальную симметрию чётной функции, третье — поворотную симметрию нечётной. Две симметрии не одно и то же: в одной график сгибают, в другой поворачивают.`
- wrong (0 = убывающая): `Большему икс отвечает большее игрек, то есть значение растёт. Убывание — это противоположное.`
- wrong (1 = Ox): `График чётной функции совпадает сам с собой, если согнуть его не по горизонтальной, а по ВЕРТИКАЛЬНОЙ оси.`
- wrong (2 = вершины): `У нечётной функции центр симметрии — начало координат, то есть точка нуль. Вершина — слово про параболу, оно не из этого урока.`
- wrong (1 и 2 перепутаны): `Два слова поменялись местами. Зеркальная симметрия бывает относительно оси, а поворотная — относительно ТОЧКИ.`
- wrongText: `Проверяй каждую клетку самим предложением: первое про направление, второе про зеркало чётной функции, третье про поворот нечётной.`

**EN.**
- eyebrow: `Words`
- setup: `The rule of the lesson is written down, but three words fell out. Put them back from the cards below.`
- ask: `Tap a card, then tap an empty cell.`
- bank: `Cards`
- rule: `If a larger x gives a larger y on an interval, the function is [increasing] there. The graph of an even function is symmetric about the [Oy] axis, and the graph of an odd one about the [origin] of coordinates.`
- cards: `increasing · Oy · origin · decreasing · Ox · vertex`
- correctText: `Correct, all three words are in place. The rule holds the three jobs of the lesson: the first ties direction to an interval, the second gives the mirror symmetry of an even function, the third the half-turn symmetry of an odd one. The two symmetries are not the same: in one the graph is folded, in the other it is turned.`
- wrong (0 = decreasing): `A larger x gives a larger y, so the value grows. Decreasing is the opposite.`
- wrong (1 = Ox): `The graph of an even function matches itself when folded along the VERTICAL axis, not the horizontal one.`
- wrong (2 = vertex): `For an odd function the centre of symmetry is the origin, the point zero. "Vertex" is a word about a parabola, not from this lesson.`
- wrong (1 and 2 swapped): `Two words swapped places. Mirror symmetry is about an axis, half-turn symmetry is about a POINT.`
- wrongText: `Check each blank against the sentence itself: the first is about direction, the second about the mirror of an even function, the third about the turn of an odd one.`
