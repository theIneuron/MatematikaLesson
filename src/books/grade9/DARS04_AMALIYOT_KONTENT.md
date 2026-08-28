# DARS04_AMALIYOT_KONTENT — 9-sinf, 4-dars amaliyoti, o'nta topshiriqning to'liq matni

> **2-bosqich (KONTENT).** Kirish: `DARS02_04_AMALIYOT_SKELET.md` (metodist tasdiqlagan,
> 2026-08-27), `TIPLAR_AMALIYOT_9SINF.md`, `src/components/grade9/Dars04.jsx`.
> Chiqish: `src/components/grade9/practice/dars04/D04_01…10.jsx`.
>
> Qoidalar `DARS01_AMALIYOT_KONTENT.md` §0 bilan bir xil.

## 0. SARLAVHA VA CHIP QATORI

```
HEAD = {
  uz: "Dars 4 amaliyoti — 10 topshiriq (parabola)",
  ru: "Практика урока 4 — 10 заданий (парабола)",
  en: "Lesson 4 practice — 10 tasks (the parabola)",
}
```

| № | Mexanika | uz | ru | en |
|---:|---|---|---|---|
| 01 | Choice | Ikki parabola | Две параболы | Two parabolas |
| 02 | TrueFalse | Ha yoki yo'q | Да или нет | Yes or no |
| 03 | RowTable | Jadval | Таблица | Table |
| 04 | DomainAxis | O'q | Ось | Axis |
| 05 | Zones | Guruhlar | Группы | Groups |
| 06 | TypeSet | Uchi | Вершина | Vertex |
| 07 | PlacePoint | Simmetriya | Симметрия | Symmetry |
| 08 | OrderLines | Yasash | Построение | Construction |
| 09 | ClozeBank | So'zlar | Слова | Words |
| 10 | AuditLines | Xato qator | Ошибочная строка | Wrong line |

---

# 01 · `Choice` · 🟢 · teg `x0-formula-belgisi`

**Nima tekshiriladi.** `x₀ = −b/(2a)` formulasida `c` UMUMAN qatnashmaydi. Savol
mantiqiy: javob to'rtta tayyor sondan emas, formulaning tuzilishidan chiqadi
(`TIPLAR §2.1` p. 1).

**MA'LUMOT.**

```
given: y = 2x² − 8x + 1   va   y = 2x² − 8x + 9
correct: 0 ; optCols: 1
```

Variantlar SO'Z, berilgan ikki formula esa matematika.

**UZ.**
- eyebrow: `Ikki parabola`
- setup: `Ikki formulada faqat oxirgi son farq qiladi.`
- ask: `Bu ikki parabolaning uchlari haqida nima deyish mumkin?`
- opt 0: `Uchlarining abssissalari bir xil.`
- opt 1: `Uchlarining ordinatalari bir xil.`
- opt 2: `Ikkalasining ham uchi Oy o'qida.`
- opt 3: `Uchlari bir-biriga umuman bog'liq emas.`
- correctText: `To'g'ri. Uchining abssissasi faqat a va b dan hisoblanadi, ozod had formulaga umuman kirmaydi. Shuning uchun oxirgi sonni o'zgartirsangiz, parabola yuqoriga yoki pastga siljiydi, lekin uchi o'sha tik chiziqda qoladi. Ordinata esa o'zgaradi — u formulaga qo'yib topiladi.`
- wrong (1): `Ordinata uchining abssissasini formulaga qo'yib topiladi, formulada esa oxirgi son bor. Ikki formulaga bir xil abssissani qo'ying va natijalarni solishtiring.`
- wrong (2): `Uchi Oy o'qida faqat b nolga teng bo'lganda turadi. Bu yerda b minus sakkizga teng, ya'ni nol emas.`
- wrong (3): `Ikki formulada a ham, b ham bir xil. Uchining abssissasi esa aynan shu ikki sondan hisoblanadi.`
- wrongText: `Uchining abssissasi formulasini yozing va unda qaysi harflar borligiga qarang. Ozod had u yerda bormi?`

**RU.**
- eyebrow: `Две параболы`
- setup: `В двух формулах различается только последнее число.`
- ask: `Что можно сказать о вершинах этих двух парабол?`
- opt 0: `Абсциссы вершин одинаковы.`
- opt 1: `Ординаты вершин одинаковы.`
- opt 2: `У обеих вершина лежит на оси Oy.`
- opt 3: `Вершины никак не связаны между собой.`
- correctText: `Верно. Абсцисса вершины считается только по a и b, свободный член в формулу вообще не входит. Поэтому если поменять последнее число, парабола сдвинется вверх или вниз, а вершина останется на той же вертикальной прямой. Ордината при этом меняется — её находят подстановкой в формулу.`
- wrong (1): `Ординату находят подстановкой абсциссы вершины в формулу, а в формуле последнее число есть. Подставь одну и ту же абсциссу в обе формулы и сравни.`
- wrong (2): `Вершина лежит на оси Oy только когда b равно нулю. Здесь b равно минус восьми, то есть не нуль.`
- wrong (3): `В обеих формулах и a, и b одинаковы. А абсцисса вершины считается как раз по этим двум числам.`
- wrongText: `Выпиши формулу абсциссы вершины и посмотри, какие буквы в ней стоят. Есть ли там свободный член?`

**EN.**
- eyebrow: `Two parabolas`
- setup: `The two formulas differ only in the last number.`
- ask: `What can be said about the vertices of these two parabolas?`
- opt 0: `Their abscissas are the same.`
- opt 1: `Their ordinates are the same.`
- opt 2: `Both vertices lie on the Oy axis.`
- opt 3: `The vertices are not related at all.`
- correctText: `Correct. The abscissa of the vertex is computed from a and b only; the constant term does not enter the formula at all. So changing the last number shifts the parabola up or down while the vertex stays on the same vertical line. The ordinate does change — it is found by substituting into the formula.`
- wrong (1): `The ordinate is found by putting the vertex abscissa into the formula, and the formula does contain the last number. Put the same abscissa into both formulas and compare.`
- wrong (2): `The vertex lies on the Oy axis only when b is zero. Here b is minus eight, which is not zero.`
- wrong (3): `Both formulas have the same a and the same b. And the abscissa of the vertex is computed from exactly those two numbers.`
- wrongText: `Write out the formula for the abscissa of the vertex and see which letters appear in it. Is the constant term there?`

---

# 02 · `TrueFalse` · 🟢 · teg `simmetriya-oqi-vertikal`

**MA'LUMOT.**

```
given: y = x² − 6x + 8 ,  uchi (3; −1)
items: s1 yes: true   — belgilar: x = 3
       s2 yes: false  — belgilar: y = −1
       s3 yes: true   — belgilar: (3; −1)
```

**UZ.**
- eyebrow: `Ha yoki yo'q`
- setup: `Parabola va uning uchi berilgan.`
- ask: `Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.`
- s1: `tik chizig'i — simmetriya o'qi.`
- s2: `gorizontal chizig'i — simmetriya o'qi.`
- s3: `nuqtadan o'tuvchi o'qqa nisbatan ikki tarmoq simmetrik.`
- correctText: `To'g'ri, uchtasi ham. Simmetriya o'qi TIK chiziq: u uchidan o'tadi va parabolani ikki teng tarmoqqa bo'ladi. Gorizontal chiziq esa parabolani ikkiga bo'lmaydi — uning ikki tomonida tarmoqlar bir xil emas.`
- wrong (s2): `Gorizontal chiziqni tasavvur qiling va parabolani unga nisbatan aks ettiring: pastga qaragan parabola chiqadi, ya'ni boshqa shakl.`
- wrong (s1): `Uchining abssissasi uch. Shu son orqali o'tuvchi tik chiziq parabolani ikki teng qismga bo'ladi.`
- wrong (s3): `Uchidan tik chiziq o'tkazing va parabolani shu chiziq bo'ylab buking: chap tarmoq o'ng tarmoq ustiga tushadimi?`
- wrongText: `Parabolani qaysi chiziq bo'ylab bukish mumkin, shunda ikki yarim ustma-ust tushadi? Shu chiziq — simmetriya o'qi.`

**RU.**
- eyebrow: `Да или нет`
- setup: `Даны парабола и её вершина.`
- ask: `Для каждого суждения выбери «Да» или «Нет».`
- s1: `эта вертикальная прямая — ось симметрии.`
- s2: `эта горизонтальная прямая — ось симметрии.`
- s3: `относительно оси через эту точку две ветви симметричны.`
- correctText: `Верно, все три. Ось симметрии — ВЕРТИКАЛЬНАЯ прямая: она проходит через вершину и делит параболу на две равные ветви. Горизонтальная прямая параболу пополам не делит — по её сторонам ветви разные.`
- wrong (s2): `Представь горизонтальную прямую и отрази параболу относительно неё: получится парабола, направленная вниз, то есть другая фигура.`
- wrong (s1): `Абсцисса вершины — три. Вертикальная прямая через это число делит параболу на две равные части.`
- wrong (s3): `Проведи через вершину вертикальную прямую и согни параболу по ней: ляжет ли левая ветвь на правую?`
- wrongText: `По какой прямой можно согнуть параболу, чтобы половины совпали? Эта прямая и есть ось симметрии.`

**EN.**
- eyebrow: `Yes or no`
- setup: `A parabola and its vertex are given.`
- ask: `Choose "Yes" or "No" for each claim.`
- s1: `this vertical line is the axis of symmetry.`
- s2: `this horizontal line is the axis of symmetry.`
- s3: `about the axis through this point the two branches are symmetric.`
- correctText: `Correct, all three. The axis of symmetry is a VERTICAL line: it passes through the vertex and splits the parabola into two equal branches. A horizontal line does not halve the parabola — the branches on its two sides are different.`
- wrong (s2): `Picture the horizontal line and reflect the parabola in it: you get a downward parabola, a different figure.`
- wrong (s1): `The abscissa of the vertex is three. The vertical line through that number splits the parabola into two equal parts.`
- wrong (s3): `Draw a vertical line through the vertex and fold the parabola along it: does the left branch land on the right one?`
- wrongText: `Along which line can the parabola be folded so the halves match? That line is the axis of symmetry.`

---

# 03 · `RowTable` · 🟢 · teg `nosimmetrik-nuqtalar`

**Nima tekshiriladi.** Jadval simmetriyani ko'rsatib turadi: chetlarda qiymat bir xil,
nollar uchidan teng uzoqlikda. Teskari katak ATAYIN uchiga qo'yilgan — u yagona.

**MA'LUMOT.**

```
expr: y = x² + 4x + 3
cols:  x : −4  −3   ?  −1   0
       y :  3   0  −1   0   ?
javob: x = −2 ; y(0) = 3
hints: −1 x katagida | −2 vs 2 | 0 | 7
```

**UZ.**
- eyebrow: `Jadval`
- setup: `Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi.`
- ask: `Ikkita bo'sh katakni to'ldiring.`
- correctText: `To'g'ri. Minus bir qiymati faqat bitta joyda, minus ikkida chiqadi — bu uchi. Jadvalning o'zi simmetriyani ko'rsatib turibdi: chetlarda ikkala qiymat ham uchga teng, nollar esa uchidan teng uzoqlikda, bittasi chapda, bittasi o'ngda.`
- wrong (bo'sh `x` katagida −1): `Bu katak yuqori qatorda, u yerga argument yoziladi. Minus bir — qiymat; savol esa u qaysi iks da chiqishi haqida.`
- wrong (bo'sh `x` katagida 2): `Ishora tushib qoldi. Jadvalning yuqori qatoriga qarang: qolgan sonlar qaysi tomonda turibdi?`
- wrong (`y(0)` = 0): `Nolni formulaga qo'ying: birinchi ikki had yo'qoladi, oxirgi son esa qoladi.`
- wrong (`y(0)` = 7): `To'rtni ham qo'shib yubordingiz. Nolni to'rtga ko'paytirsangiz nima chiqadi?`
- wrongText: `To'ldirgan katagingizni formulaga qo'ying va tekshiring. Jadvalning chap va o'ng chetidagi sonlar bir xil ekaniga ham e'tibor bering.`

**RU.**
- eyebrow: `Таблица`
- setup: `Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле.`
- ask: `Заполни две пустые клетки.`
- correctText: `Верно. Значение минус один получается только в одном месте, при минус двух — это вершина. Сама таблица показывает симметрию: по краям оба значения равны трём, а нули стоят на равном расстоянии от вершины, один слева, другой справа.`
- wrong (в пустой `x` стоит −1): `Эта клетка в верхней строке, туда пишут аргумент. Минус один — это значение; вопрос в том, при каком икс оно получается.`
- wrong (в пустой `x` стоит 2): `Знак потерялся. Посмотри на верхнюю строку таблицы: с какой стороны стоят остальные числа?`
- wrong (`y(0)` = 0): `Подставь нуль в формулу: первые два слагаемых исчезнут, а последнее число останется.`
- wrong (`y(0)` = 7): `Ты прибавил ещё и четвёрку. Что получится, если умножить нуль на четыре?`
- wrongText: `Подставь заполненную клетку в формулу и проверь. Обрати внимание и на то, что числа по краям таблицы одинаковы.`

**EN.**
- eyebrow: `Table`
- setup: `The top row is the argument, the bottom row is the value. The table is filled from the formula.`
- ask: `Fill in the two empty cells.`
- correctText: `Correct. The value minus one appears in one place only, at minus two — that is the vertex. The table itself shows the symmetry: at both ends the value is three, and the zeros stand at equal distance from the vertex, one on the left and one on the right.`
- wrong (−1 in the empty `x`): `This cell is in the top row, and the argument goes there. Minus one is a value; the question is at which x it appears.`
- wrong (2 in the empty `x`): `The sign was lost. Look at the top row of the table: on which side do the other numbers stand?`
- wrong (`y(0)` = 0): `Put zero into the formula: the first two terms vanish, but the last number stays.`
- wrong (`y(0)` = 7): `You added the four as well. What do you get when you multiply zero by four?`
- wrongText: `Put the cell you filled into the formula and check. Notice too that the numbers at the two ends of the table are the same.`

---

# 04 · `DomainAxis` · 🟡 · teg `x0-formula-belgisi`

**MA'LUMOT.**

```
expr: y = x² − 8x + 12
axis: [−2; 9]
answer: { at: 4, closed: true, dir: right }
```

**UZ.**
- eyebrow: `O'q`
- setup: `Parabola uchidan chapda kamayadi, o'ngda o'sadi. Uchi formuladan topiladi.`
- ask: `Funksiya qaysi x lardan boshlab o'sadi? O'qda ko'rsating.`
- correctText: `To'g'ri. Uchining abssissasi to'rt: minus sakkizning qarama-qarshisi sakkiz, uni ikki marta bir ga bo'lsak to'rt chiqadi. Undan o'ngda parabola ko'tariladi, va uchining o'zi ham oraliqqa kiradi.`
- wrong (chegara −4 da): `Formulada b ning oldida minus turibdi, b ning o'zi esa allaqachon manfiy. Ikki minus birga aylanadi.`
- wrong (chegara 8 da): `Maxrajda a emas, ikki a turadi. Bu yerda a birga teng, demak maxraj ikkiga teng.`
- wrong (chegara to'g'ri, yo'nalish chapga): `Beshni formulaga qo'ying, keyin oltini: qiymat ortyaptimi yoki kamayyaptimi? Uchidan o'ngda parabola ko'tariladi.`
- wrong (chegara to'g'ri, nuqta bo'sh): `Uchining o'zi ham o'sish oralig'iga kiradi: aynan undan boshlab qiymatlar ortadi.`
- wrongText: `Avval uchining abssissasini formuladan toping, keyin uchining qaysi tomonida parabola ko'tarilishini aniqlang.`

**RU.**
- eyebrow: `Ось`
- setup: `Слева от вершины парабола убывает, справа возрастает. Вершину находят по формуле.`
- ask: `Начиная с каких x функция возрастает? Отметь на оси.`
- correctText: `Верно. Абсцисса вершины — четыре: противоположное к минус восьми есть восемь, а делённое на два умножить на один даёт четыре. Правее парабола поднимается, и сама вершина тоже входит в промежуток.`
- wrong (граница в −4): `В формуле перед b стоит минус, а само b уже отрицательно. Два минуса дают плюс.`
- wrong (граница в 8): `В знаменателе стоит не a, а два a. Здесь a равно единице, значит знаменатель равен двум.`
- wrong (граница верна, направление влево): `Подставь пять, потом шесть: значение растёт или убывает? Правее вершины парабола поднимается.`
- wrong (граница верна, точка пустая): `Сама вершина тоже входит в промежуток возрастания: именно с неё значения начинают расти.`
- wrongText: `Сначала найди абсциссу вершины по формуле, потом определи, с какой стороны от вершины парабола поднимается.`

**EN.**
- eyebrow: `Axis`
- setup: `To the left of the vertex the parabola decreases, to the right it increases. The vertex comes from the formula.`
- ask: `From which x on does the function increase? Mark it on the axis.`
- correctText: `Correct. The abscissa of the vertex is four: the opposite of minus eight is eight, and divided by two times one it gives four. To the right the parabola rises, and the vertex itself belongs to the interval.`
- wrong (boundary at −4): `The formula has a minus in front of b, and b itself is already negative. Two minuses make a plus.`
- wrong (boundary at 8): `The denominator is not a but two a. Here a is one, so the denominator is two.`
- wrong (boundary right, direction left): `Put in five, then six: does the value grow or fall? To the right of the vertex the parabola rises.`
- wrong (boundary right, point hollow): `The vertex itself belongs to the increasing interval: the values start growing exactly from it.`
- wrongText: `First find the abscissa of the vertex from the formula, then work out on which side of the vertex the parabola rises.`

---

# 05 · `Zones` · 🟡 · teg `x0-formula-belgisi`

**Nima tekshiriladi.** Butun topshiriq `−b/(2a)` ning ISHORASIGA qurilgan — aniq son
hisoblash shart emas, lekin ishorani chalkashtirish darrov ko'rinadi.

**MA'LUMOT.**

```
zones: A «Oy dan chapda» | B «Oy o'qida» | C «Oy dan o'ngda»
items:  i1 y = x² + 6x      → A  (x₀ = −3)
        i2 y = x² + 2x + 5  → A  (x₀ = −1)
        i3 y = x² − 7       → B  (x₀ = 0)
        i4 y = 3x² + 1      → B  (x₀ = 0)
        i5 y = x² − 10x     → C  (x₀ = 5)
        i6 y = 2x² − 4x     → C  (x₀ = 1)
```

**UZ.**
- eyebrow: `Guruhlar`
- zona A: `Uchi Oy dan chapda` · zona B: `Uchi Oy o'qida` · zona C: `Uchi Oy dan o'ngda`
- setup: `Uchining aniq o'rnini hisoblash shart emas: guruhni uning ishorasi hal qiladi.`
- ask: `Har bir yozuvni o'z guruhiga qo'ying.`
- correctText: `To'g'ri. Uchining abssissasi b ning QARAMA-QARSHISIDAN chiqadi, shuning uchun musbat b chap tomonni, manfiy b esa o'ng tomonni beradi. b umuman bo'lmasa, uchi Oy o'qida turadi. a ning kattaligi bu yerda hech nimani hal qilmaydi — u faqat sonning kattaligini o'zgartiradi, ishorasini emas.`
- wrong (i1 yoki i2 → C): `b musbat, formulada esa uning oldida minus turibdi. Musbat sonning qarama-qarshisi qaysi tomonda?`
- wrong (i5 yoki i6 → A): `b manfiy, uning qarama-qarshisi musbat. Ikki minus birga aylanadi.`
- wrong (i3 yoki i4 → A yoki C): `Bu yozuvlarda iks li had umuman yo'q, ya'ni b nolga teng. Nolning qarama-qarshisi ham nol.`
- wrong (i6 → boshqa zona): `a ikkiga teng bo'lgani sonni ikki barobar kichraytiradi, lekin ishorani o'zgartirmaydi. Ishorani faqat b hal qiladi.`
- wrongText: `Har yozuvda b ni toping va uning qarama-qarshisiga qarang. Musbat bo'lsa — o'ngda, manfiy bo'lsa — chapda, nol bo'lsa — o'qning o'zida.`

**RU.**
- eyebrow: `Группы`
- зона A: `Вершина левее Oy` · зона B: `Вершина на оси Oy` · зона C: `Вершина правее Oy`
- setup: `Точное место вершины считать не нужно: группу решает её знак.`
- ask: `Разложи каждую запись в свою группу.`
- correctText: `Верно. Абсцисса вершины получается из ПРОТИВОПОЛОЖНОГО к b, поэтому положительное b даёт левую сторону, а отрицательное — правую. Если члена с икс нет вовсе, вершина стоит на оси Oy. Величина a здесь ничего не решает — она меняет размер числа, но не знак.`
- wrong (i1 или i2 → C): `b положительно, а в формуле перед ним стоит минус. С какой стороны находится число, противоположное положительному?`
- wrong (i5 или i6 → A): `b отрицательно, противоположное к нему положительно. Два минуса дают плюс.`
- wrong (i3 или i4 → A или C): `В этих записях члена с икс нет вовсе, то есть b равно нулю. Противоположное к нулю — тоже нуль.`
- wrong (i6 → другая зона): `То, что a равно двум, уменьшает число вдвое, но знак не меняет. Знак решает только b.`
- wrongText: `Найди в каждой записи b и посмотри на противоположное к нему. Положительное — справа, отрицательное — слева, нуль — на самой оси.`

**EN.**
- eyebrow: `Groups`
- zone A: `Vertex left of Oy` · zone B: `Vertex on the Oy axis` · zone C: `Vertex right of Oy`
- setup: `There is no need to compute the exact place of the vertex: the group is decided by its sign.`
- ask: `Put each record into its own group.`
- correctText: `Correct. The abscissa of the vertex comes from the OPPOSITE of b, so a positive b gives the left side and a negative b the right. If there is no x term at all, the vertex sits on the Oy axis. The size of a decides nothing here — it changes the size of the number, not its sign.`
- wrong (i1 or i2 → C): `b is positive, and the formula has a minus in front of it. On which side does the opposite of a positive number lie?`
- wrong (i5 or i6 → A): `b is negative, and its opposite is positive. Two minuses make a plus.`
- wrong (i3 or i4 → A or C): `These records have no x term at all, so b is zero. The opposite of zero is zero.`
- wrong (i6 → another zone): `That a equals two halves the number but does not change its sign. Only b decides the sign.`
- wrongText: `Find b in every record and look at its opposite. Positive means right, negative means left, zero means on the axis itself.`

---

# 06 · `TypeSet` · 🟡 · teg `x0-formula-belgisi`

**MA'LUMOT.**

```
expr: y = −x² + 6x − 5
answer: 4          (x₀ = 3 , y₀ = −9 + 18 − 5 = 4)
allowNeg: true
hints: 3 | −4 | 14 | −3
```

**UZ.**
- eyebrow: `Uchi`
- setup: `Uchining ordinatasi abssissani formulaga qo'yib topiladi.`
- ask: `Uchining ordinatasi y₀ ni yozing.`
- correctText: `To'g'ri, to'rt. Avval abssissa topildi: minus oltining qarama-qarshisi olti, uni ikki marta minus bir ga bo'lsak uch chiqadi. Keyin uchni formulaga qo'ydingiz: minus to'qqiz qo'shuv o'n sakkiz minus besh, ya'ni to'rt.`
- wrong (3): `Bu abssissa, ya'ni uchining birinchi soni. Ordinata esa shu abssissani formulaga qo'yib topiladi.`
- wrong (14): `Uchni formulaga qo'yayotganda kvadratning ishorasi tushib qolgan: iks kvadrat oldida minus turibdi, demak uchning kvadrati manfiy bo'lib kiradi.`
- wrong (−4): `Ishora teskari chiqdi. Uchta hadni tartib bilan hisoblang: minus to'qqiz, keyin o'n sakkiz, keyin minus besh.`
- wrong (−3): `Bu abssissaning qarama-qarshisi. Abssissani hisoblashda maxrajdagi a manfiy ekanini eslang.`
- wrongText: `Ikki qadam: avval abssissani formuladan toping, keyin uni ASL formulaga qo'yib qiymatni hisoblang.`

**RU.**
- eyebrow: `Вершина`
- setup: `Ординату вершины находят подстановкой абсциссы в формулу.`
- ask: `Напиши ординату вершины y₀.`
- correctText: `Верно, четыре. Сначала нашлась абсцисса: противоположное к минус шести есть шесть, делённое на два умножить на минус один даёт три. Потом ты подставил тройку в формулу: минус девять плюс восемнадцать минус пять, то есть четыре.`
- wrong (3): `Это абсцисса, то есть первое число вершины. А ординату находят подстановкой этой абсциссы в формулу.`
- wrong (14): `При подстановке тройки потерялся знак перед квадратом: перед икс в квадрате стоит минус, значит квадрат тройки входит со знаком минус.`
- wrong (−4): `Знак вышел наоборот. Посчитай три слагаемых по порядку: минус девять, потом восемнадцать, потом минус пять.`
- wrong (−3): `Это противоположное к абсциссе. При счёте абсциссы помни, что a в знаменателе отрицательно.`
- wrongText: `Два шага: сначала найди абсциссу по формуле, потом подставь её в ИСХОДНУЮ формулу и посчитай значение.`

**EN.**
- eyebrow: `Vertex`
- setup: `The ordinate of the vertex is found by substituting the abscissa into the formula.`
- ask: `Write the ordinate of the vertex y₀.`
- correctText: `Correct, four. First the abscissa was found: the opposite of minus six is six, and divided by two times minus one it gives three. Then you put three into the formula: minus nine plus eighteen minus five, that is four.`
- wrong (3): `That is the abscissa, the first number of the vertex. The ordinate is found by substituting that abscissa into the formula.`
- wrong (14): `While substituting three, the sign in front of the square was lost: x squared has a minus in front of it, so three squared enters as a negative.`
- wrong (−4): `The sign came out the other way. Compute the three terms in order: minus nine, then eighteen, then minus five.`
- wrong (−3): `That is the opposite of the abscissa. When computing the abscissa, remember that a in the denominator is negative.`
- wrongText: `Two steps: first find the abscissa from the formula, then put it into the ORIGINAL formula and compute the value.`

---

# 07 · `PlacePoint` + parabola · 🟡 · teg `nosimmetrik-nuqtalar`

**MA'LUMOT.**

```
curve:  y = x² + 6x + 5   (nollari −5 va −1, uchi (−3; −4))
marks:  (−1; 0)  — oldindan belgilangan
plane:  x ∈ [−7; 2], y ∈ [−5; 4]
answer: (−5; 0)
table:  YO'Q
zonalar: (1; 0) — Oy ga nisbatan aks ettirildi ; (−3; 0) — uchining abssissasi olindi
```

**UZ.**
- eyebrow: `Simmetriya`
- setup: `Parabola chizilgan, uning bitta nuqtasi belgilangan. Simmetriya o'qi uchidan tik o'tadi.`
- ask: `Belgilangan nuqtaga simmetrik nuqtani qo'ying.`
- correctText: `To'g'ri. Simmetriya o'qi minus uchda turibdi. Belgilangan nuqta undan ikki birlik o'ngda, demak juftlik ikki birlik chapda: minus besh. Balandligi esa o'zgarmaydi — simmetriya faqat gorizontal bo'ylab ishlaydi.`
- wrong (1; 0): `Nuqta Oy o'qiga nisbatan aks ettirildi. Simmetriya o'qi esa Oy emas, u uchidan o'tadi va minus uchda turibdi.`
- wrong (−3; 0): `Bu simmetriya o'qining o'zida turgan nuqta. Sizdan esa juftlik so'ralyapti: o'qning IKKINCHI tomonidagi nuqta.`
- wrong (balandligi boshqa): `Simmetrik nuqtaning balandligi o'zgarmaydi: u ham grafikda, ham bir xil qiymatda turadi.`
- wrongText: `Belgilangan nuqta simmetriya o'qidan necha birlik uzoqda? Xuddi shuncha masofani o'qning ikkinchi tomoniga o'lchang.`

**RU.**
- eyebrow: `Симметрия`
- setup: `Парабола построена, одна её точка отмечена. Ось симметрии проходит вертикально через вершину.`
- ask: `Поставь точку, симметричную отмеченной.`
- correctText: `Верно. Ось симметрии стоит в минус трёх. Отмеченная точка на две единицы правее, значит пара — на две единицы левее: минус пять. Высота при этом не меняется — симметрия работает только по горизонтали.`
- wrong (1; 0): `Точка отражена относительно оси Oy. А ось симметрии — не Oy: она проходит через вершину и стоит в минус трёх.`
- wrong (−3; 0): `Это точка на самой оси симметрии. А спрашивают пару: точку по ДРУГУЮ сторону от оси.`
- wrong (другая высота): `Высота симметричной точки не меняется: она лежит и на графике, и на том же значении.`
- wrongText: `На сколько единиц отмеченная точка удалена от оси симметрии? Отложи ровно столько же по другую сторону оси.`

**EN.**
- eyebrow: `Symmetry`
- setup: `A parabola is drawn and one of its points is marked. The axis of symmetry runs vertically through the vertex.`
- ask: `Place the point symmetric to the marked one.`
- correctText: `Correct. The axis of symmetry stands at minus three. The marked point is two units to its right, so its partner is two units to the left: minus five. The height does not change — symmetry works along the horizontal only.`
- wrong (1; 0): `The point was reflected in the Oy axis. But the axis of symmetry is not Oy: it runs through the vertex and stands at minus three.`
- wrong (−3; 0): `That point lies on the axis of symmetry itself. What is asked for is the partner: the point on the OTHER side of the axis.`
- wrong (a different height): `The height of a symmetric point does not change: it lies on the graph at the same value.`
- wrongText: `How many units is the marked point from the axis of symmetry? Lay off the same distance on the other side of the axis.`

---

# 08 · `OrderLines` · 🔴 · teg `nollarsiz-grafik`

**MA'LUMOT.**

```
given: y = x² − 4x
lines (to'g'ri tartibda):
  c1  [so'z] Uchini topamiz: + x₀ = −b/(2a)
  c2  x₀ = 2 , y₀ = −4
  c3  [so'z] Nollarni topamiz: + x² − 4x = 0 , x = 0 va x = 4
  c4  [so'z] Uchiga simmetrik ikki nuqta: + (1; −3) va (3; −3)
  c5  [so'z] Besh nuqtadan parabolani o'tkazamiz
answer: c1 c2 c3 c4 c5
```

**UZ.**
- eyebrow: `Yasash`
- setup: `Beshta qadam aralashtirilgan. Ular grafikni yasash tartibini hosil qiladi.`
- ask: `Qadamlarni to'g'ri tartibga soling.`
- correctText: `To'g'ri. Uchi birinchi topiladi, chunki qolgan hamma narsa unga tayanadi: qo'shimcha nuqtalar aynan uchiga nisbatan simmetrik olinadi. Nollar grafikning gorizontal o'q bilan kesishgan joyini beradi. Faqat uchi bilan chizilgan grafik — bu grafik emas, taxmin.`
- wrong (c4 c2 dan oldin): `Qo'shimcha nuqtalar uchiga NISBATAN olinadi. Uchi hali topilmagan bo'lsa, nimaga nisbatan simmetrik olasiz?`
- wrong (c5 oxirgi emas): `Chiziq oxirida o'tkaziladi, hamma nuqta joyiga qo'yilgandan keyin.`
- wrong (c3 c1 dan oldin): `Yasash uchidan boshlanadi: u parabolaning o'rnini belgilaydi, nollar esa uning kengligini.`
- wrong (c2 c1 dan oldin): `Bu qator formulani QO'LLASH natijasi. Formulaning o'zi undan oldin yozilishi kerak.`
- wrongText: `Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?`

**RU.**
- eyebrow: `Построение`
- setup: `Пять шагов перемешаны. Вместе они составляют порядок построения графика.`
- ask: `Расставь шаги по порядку.`
- correctText: `Верно. Вершина находится первой, потому что на неё опирается всё остальное: дополнительные точки берут симметрично именно относительно вершины. Нули дают места пересечения графика с горизонтальной осью. График, построенный по одной вершине, — это не график, а догадка.`
- wrong (c4 раньше c2): `Дополнительные точки берут ОТНОСИТЕЛЬНО вершины. Если вершина ещё не найдена, относительно чего брать симметрию?`
- wrong (c5 не последний): `Линию проводят в конце, когда все точки уже расставлены.`
- wrong (c3 раньше c1): `Построение начинается с вершины: она задаёт место параболы, а нули — её ширину.`
- wrong (c2 раньше c1): `Эта строка — результат ПРИМЕНЕНИЯ формулы. Сама формула должна стоять раньше.`
- wrongText: `Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?`

**EN.**
- eyebrow: `Construction`
- setup: `Five steps are shuffled. Together they make the order of building the graph.`
- ask: `Put the steps in the right order.`
- correctText: `Correct. The vertex is found first because everything else rests on it: the extra points are taken symmetric about the vertex. The zeros give the places where the graph crosses the horizontal axis. A graph drawn from the vertex alone is not a graph but a guess.`
- wrong (c4 before c2): `The extra points are taken RELATIVE to the vertex. If the vertex is not found yet, relative to what will you take the symmetry?`
- wrong (c5 not last): `The line is drawn at the end, once all the points are in place.`
- wrong (c3 before c1): `Building starts from the vertex: it sets where the parabola is, while the zeros set how wide it is.`
- wrong (c2 before c1): `This line is the result of APPLYING the formula. The formula itself must come first.`
- wrongText: `Read the chain from top to bottom: does every step use the result of the one before it?`

---

# 09 · `ClozeBank` · 🔴 · teg `simmetriya-oqi-vertikal`

**MA'LUMOT.**

```
answer: w1 w2 w3
cards:  w1 «formulaga qo'yib»  w2 «tik»        w3 «nol»    ← to'g'ri
        w4 «jadvaldan»         w5 «gorizontal» w6 «uchi»   ← tuzoqlar
```

**UZ.**
- eyebrow: `So'zlar`
- setup: `Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.`
- ask: `Kartani bosing, keyin bo'sh kartochkani bosing.`
- bank: `Kartalar`
- qoida: `Uchining abssissasi topilgach, ordinatasi uni [formulaga qo'yib] hisoblanadi. Simmetriya o'qi — uchidan o'tuvchi [tik] chiziq. Grafik uchi, ikki [nol] va uchiga nisbatan simmetrik ikki qo'shimcha nuqtadan yig'iladi.`
- kartalar: `formulaga qo'yib · tik · nol · jadvaldan · gorizontal · uchi`
- correctText: `To'g'ri, uchala so'z ham joyida. Qoida darsning uchta ishini yopadi: ordinata hisoblanadi, o'q tik, grafik esa besh nuqtadan yig'iladi. Uchtasi ham bitta zanjir: uchi topiladi, o'q undan o'tadi, qolgan nuqtalar o'qqa nisbatan joylashadi.`
- wrong (0 = jadvaldan): `Jadval qiymatlarni ko'rsatishi mumkin, lekin uchining ordinatasi undan olinmaydi: uchi jadvalda umuman bo'lmasligi mumkin. U formuladan hisoblanadi.`
- wrong (1 = gorizontal): `Gorizontal chiziq parabolani ikki teng qismga bo'lmaydi. Grafikni bukib ko'ring: qaysi yo'nalishda ikki yarim ustma-ust tushadi?`
- wrong (2 = uchi): `Uchi allaqachon gapning boshida sanab o'tilgan. Ikkinchi marta sanashning hojati yo'q — bu yerda grafik gorizontal o'q bilan kesishgan nuqtalar so'ralyapti.`
- wrongText: `Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ordinata qanday topilishini, ikkinchisi o'qning yo'nalishini, uchinchisi qanday nuqtalar kerakligini aytadi.`

**RU.**
- eyebrow: `Слова`
- setup: `Правило урока записано, но три слова выпали. Поставь их из карточек снизу.`
- ask: `Нажми карточку, потом пустую клетку.`
- bank: `Карточки`
- правило: `Когда абсцисса вершины найдена, ординату получают [подстановкой в формулу]. Ось симметрии — [вертикальная] прямая через вершину. График собирают из вершины, двух [нулей] и двух дополнительных точек, симметричных относительно вершины.`
- карточки: `подстановкой в формулу · вертикальная · нулей · из таблицы · горизонтальная · вершин`
- correctText: `Верно, все три слова на месте. Правило закрывает три дела урока: ординату вычисляют, ось вертикальна, график собирают из пяти точек. Все три — одна цепочка: находят вершину, через неё проходит ось, остальные точки становятся относительно оси.`
- wrong (0 = из таблицы): `Таблица может показать значения, но ординату вершины из неё не берут: вершины в таблице может не оказаться вовсе. Её вычисляют по формуле.`
- wrong (1 = горизонтальная): `Горизонтальная прямая не делит параболу на две равные части. Согни график: в каком направлении половины совпадут?`
- wrong (2 = вершин): `Вершина уже названа в начале предложения. Считать её второй раз незачем — здесь спрашивают точки пересечения графика с горизонтальной осью.`
- wrongText: `Проверяй каждую клетку самим предложением: первое про то, как находят ординату, второе про направление оси, третье про то, какие точки нужны.`

**EN.**
- eyebrow: `Words`
- setup: `The rule of the lesson is written down, but three words fell out. Put them back from the cards below.`
- ask: `Tap a card, then tap an empty cell.`
- bank: `Cards`
- rule: `Once the abscissa of the vertex is found, the ordinate is obtained by [substituting into the formula]. The axis of symmetry is the [vertical] line through the vertex. The graph is assembled from the vertex, two [zeros] and two extra points symmetric about the vertex.`
- cards: `substituting into the formula · vertical · zeros · from the table · horizontal · vertices`
- correctText: `Correct, all three words are in place. The rule covers the three jobs of the lesson: the ordinate is computed, the axis is vertical, the graph is assembled from five points. All three form one chain: the vertex is found, the axis passes through it, the remaining points are placed relative to the axis.`
- wrong (0 = from the table): `A table can show values, but the ordinate of the vertex is not taken from it: the vertex may not appear in the table at all. It is computed from the formula.`
- wrong (1 = horizontal): `A horizontal line does not split the parabola into two equal parts. Fold the graph: in which direction do the halves match?`
- wrong (2 = vertices): `The vertex is already named at the start of the sentence. There is no point counting it twice — what is asked for here are the points where the graph crosses the horizontal axis.`
- wrongText: `Check each blank against the sentence itself: the first is about how the ordinate is found, the second about the direction of the axis, the third about which points are needed.`

---

# 10 · `AuditLines` · 🔴 · teg `x0-formula-belgisi`

**MA'LUMOT.**

```
given: y = x² + 10x + 7  parabolasi uchining abssissasini toping
rows:
  r1  x₀ = −b/(2a)
  r2  a = 1 , b = 10
  r3  x₀ = 10/2 = 5        ← birinchi xato
  r4  [so'z] Javob: + x₀ = 5
answerId: r3
```

**UZ.**
- eyebrow: `Xato qator`
- setup: `Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.`
- ask: `Birinchi xato qatorni bosing.`
- r4: `Javob:`
- correctText: `To'g'ri, xato uchinchi qatorda. Formulada b ning oldida minus turibdi, uchinchi qatorda esa u tushib qolgan. b o'nga teng, uning qarama-qarshisi minus o'n, ikkiga bo'lsak minus besh chiqadi. Tekshirish oson: parabola tarmoqlari yuqoriga qaragan va ozod had musbat, lekin b katta — uchi Oy dan CHAPDA bo'lishi kerak edi.`
- wrong (r1): `Bu qator to'g'ri: formula aynan shunday yoziladi, b ning oldida minus bilan. Xatoni undan pastda qidiring.`
- wrong (r2): `Bu ham to'g'ri: iks kvadrat oldida bir, iks oldida o'n turibdi. Keyingi qadamga qarang — formuladagi minus qayerga ketdi?`
- wrong (r4): `To'rtinchi qator uchinchisining natijasini takrorlaydi. Bizga BIRINCHI xato kerak, oxirgisi emas.`
- wrongText: `Birinchi qatordagi formulani uchinchi qator bilan yonma-yon qo'ying. Formulada bor bo'lgan qaysi belgi hisobda yo'q?`

**RU.**
- eyebrow: `Ошибочная строка`
- setup: `Решение готово, но ответ неверный. Каждая строка выглядит правильной.`
- ask: `Нажми первую ошибочную строку.`
- r4: `Ответ:`
- correctText: `Верно, ошибка в третьей строке. В формуле перед b стоит минус, а в третьей строке он потерялся. b равно десяти, противоположное к нему минус десять, делённое на два даёт минус пять. Проверить легко: ветви параболы вверх, свободный член положителен, но b большое — вершина должна была оказаться ЛЕВЕЕ оси Oy.`
- wrong (r1): `Эта строка верна: формула так и записывается, с минусом перед b. Ищи ошибку ниже.`
- wrong (r2): `Эта тоже верна: перед икс в квадрате стоит единица, перед икс — десятка. Посмотри на следующий шаг: куда делся минус из формулы?`
- wrong (r4): `Четвёртая строка повторяет результат третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя.`
- wrongText: `Положи рядом формулу из первой строки и вычисление из третьей. Какого знака, который есть в формуле, нет в вычислении?`

**EN.**
- eyebrow: `Wrong line`
- setup: `The solution is finished, but the answer is wrong. Every line looks right.`
- ask: `Tap the first wrong line.`
- r4: `Answer:`
- correctText: `Correct, the error is in the third line. The formula has a minus in front of b, and in the third line it was lost. b is ten, its opposite is minus ten, and divided by two it gives minus five. The check is easy: the branches point up and the constant term is positive, but b is large — the vertex should have ended up to the LEFT of the Oy axis.`
- wrong (r1): `This line is right: the formula is written exactly like that, with a minus in front of b. Look for the error below.`
- wrong (r2): `This one is right too: one stands in front of x squared and ten in front of x. Look at the next step — where did the minus from the formula go?`
- wrong (r4): `The fourth line repeats the result of the third. We need the FIRST error, not the last one.`
- wrongText: `Put the formula from the first line next to the computation in the third. Which sign present in the formula is missing from the computation?`
