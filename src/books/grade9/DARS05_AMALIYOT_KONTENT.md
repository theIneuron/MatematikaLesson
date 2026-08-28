# DARS05_AMALIYOT_KONTENT — 9-sinf, 5-dars amaliyoti

> **HOSIL QILINGAN HUJJAT.** Uni qo'lda tahrirlamang: manba —
> `src/components/grade9/practice/dars05/D05_01…10.jsx`, hujjat esa
> `node scripts/grade9-practice-kontent.mjs` bilan yig'iladi. Matnni
> o'zgartirish kerak bo'lsa, topshiriq faylida o'zgartiring va skriptni
> qayta ishga tushiring — shunda hujjat bilan ekran hech qachon ajralmaydi.

> Matematika (yozuvlar, jadval sonlari, javoblar) bu yerga tushmaydi: u
> tarjima emas va uni kodda ko'rish kerak. Bu yerda faqat SO'ZLAR.

---

## 01 · `RowTable` · 🟢 · teg `uchi-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Jadval | Таблица | Table |
| `setup` | Yuqori qator — argument, pastki qator — qiymat. Jadval formuladan to'ldiriladi. | Верхняя строка — аргумент, нижняя — значение. Таблица заполняется по формуле. | The top row is the argument, the bottom row is the value. The table is filled from the formula. |
| `ask` | Ikkita bo'sh katakni to'ldiring. | Заполни две пустые клетки. | Fill in the two empty cells. |
| `correctText` | To'g'ri. Minus to'rt qiymati faqat bitta joyda, birda chiqadi — bu uchi. Nol esa ikki joyda: minus birda va uchda. Qavs ichida minus bir turgani uchun uchi o'ngga, birga siljigan. | Верно. Значение минус четыре получается только в одном месте, при единице — это вершина. А нуль в двух: при минус единице и при трёх. В скобке стоит минус один, поэтому вершина сдвинута вправо, в единицу. | Correct. The value minus four appears in one place only, at one — that is the vertex. Zero appears at two: at minus one and at three. The bracket holds x minus one, so the vertex is shifted to the right, to one. |
| `text` | Bu katak yuqori qatorda, u yerga argument yoziladi. Minus to'rt — qiymat; savol esa u qaysi iks da chiqishi haqida. | Эта клетка в верхней строке, туда пишут аргумент. Минус четыре — это значение; вопрос в том, при каком икс оно получается. | This cell is in the top row, and the argument goes there. Minus four is a value; the question is at which x it appears. |
| `text` | Ishora teskari olindi. Qavsda iks minus bir turibdi, demak qavs nolga aylanadigan son musbat. | Знак взят наоборот. В скобке стоит икс минус один, значит число, при котором скобка обращается в нуль, положительное. | The sign was taken the other way. The bracket holds x minus one, so the number that makes the bracket zero is positive. |
| `text` | Nolni formulaga qo'ying: qavs ichida minus bir chiqadi, uning kvadrati bir, undan to'rt ayiriladi. | Подставь нуль в формулу: в скобке получится минус один, его квадрат — единица, из неё вычитают четыре. | Put zero into the formula: the bracket gives minus one, its square is one, and four is subtracted from it. |
| `text` | Qavsning kvadratini oling: minus birning kvadrati manfiy emas. | Возведи скобку в квадрат: квадрат минус единицы не отрицателен. | Square the bracket: the square of minus one is not negative. |
| `wrongText` | To'ldirgan katagingizni formulaga qo'ying: qavs ichidagi ifodani hisoblang, kvadratga oshiring, keyin to'rt ayiring. | Подставь заполненную клетку в формулу: посчитай скобку, возведи в квадрат, потом вычти четыре. | Put the cell you filled into the formula: compute the bracket, square it, then subtract four. |

---

## 02 · `TrueFalse` · 🟢 · teg `ishora-teskari-siljish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Ha yoki yo'q | Да или нет | Yes or no |
| `setup` | Bitta yozuv berilgan, uch mulohaza esa uning haqida. | Дана одна запись, а три суждения — про неё. | One record is given, and three claims are about it. |
| `ask` | Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang. | Для каждого суждения выбери «Да» или «Нет». | Choose "Yes" or "No" for each claim. |
| `givenLabel` | Berilgan | Дано | Given |
| `claim` | dan chapga 3 ga siljigan. | сдвинута на 3 влево от этой параболы. | it is shifted 3 to the left of this parabola. |
| `claim` | uchi shu nuqtada. | вершина в этой точке. | the vertex is at this point. |
| `claim` | koeffitsienti parabolani yon tomonga siljitadi. | этот коэффициент сдвигает параболу вбок. | this coefficient shifts the parabola sideways. |
| `yesLabel` | Ha | Да | Yes |
| `noLabel` | Yo'q | Нет | No |
| `correctText` | To'g'ri, uchtasi ham. Qavs ichidagi son ishorasi teskari ishlaydi: qo'shuv uch chapga siljitadi. Uchi minus uchda, uchda emas. Ikki koeffitsienti esa faqat parabolani toraytiradi — u joyni hech qachon o'zgartirmaydi, buni qavsdagi son hal qiladi. | Верно, все три. Знак числа в скобке работает наоборот: плюс три сдвигает влево. Вершина в минус трёх, а не в трёх. А коэффициент два лишь сужает параболу — место он не меняет никогда, место решает число в скобке. | Correct, all three. The sign of the number inside the bracket works the other way round: plus three shifts left. The vertex is at minus three, not at three. And the coefficient two only narrows the parabola — it never changes its place; the place is decided by the number in the bracket. |
| `text` | Qavs nolga aylanadigan sonni toping: iks qo'shuv uch nolga teng bo'lsa, iks minus uchga teng. Uchi shu yerda, ya'ni noldan chapda. | Найди число, при котором скобка обращается в нуль: если икс плюс три равно нулю, то икс равен минус трём. Вершина там, то есть левее нуля. | Find the number that makes the bracket zero: if x plus three is zero, then x is minus three. The vertex is there, to the left of zero. |
| `text` | Qavsda qo'shuv turibdi, demak uchi manfiy tomonda. Uchni emas, minus uchni qo'yib ko'ring: qavs nolga aylanadi. | В скобке стоит плюс, значит вершина в отрицательной стороне. Подставь не три, а минус три: скобка обратится в нуль. | The bracket has a plus, so the vertex is on the negative side. Put in minus three, not three: the bracket becomes zero. |
| `text` | Ikkiga ko'paytirish har bir qiymatni ikki barobar kattalashtiradi, ya'ni parabola torayadi. Lekin uning qaysi iks da eng past bo'lishi o'zgarmaydi. | Умножение на два увеличивает каждое значение вдвое, то есть парабола сужается. Но то, при каком икс она самая низкая, не меняется. | Multiplying by two doubles every value, so the parabola narrows. But the x at which it is lowest does not change. |
| `wrongText` | Ikkita savolni ajrating: parabola QAYERDA turadi va u QANDAY ko'rinishda. Birinchisini qavsdagi son hal qiladi, ikkinchisini a koeffitsienti. | Раздели два вопроса: ГДЕ стоит парабола и КАК она выглядит. Первое решает число в скобке, второе — коэффициент a. | Separate two questions: WHERE the parabola stands and HOW it looks. The first is decided by the number in the bracket, the second by the coefficient a. |

---

## 03 · `Choice` · 🟢 · teg `gorizontal-vertikal-almashinish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | O'zgarish | Изменение | Change |
| `setup` | Parabolaning yozuvida to'rt joyni o'zgartirish mumkin. | В записи параболы можно менять четыре места. | Four places in the record of a parabola can be changed. |
| `ask` | Qaysi o'zgarish parabolani FAQAT yuqoriga ko'taradi? | Какое изменение поднимает параболу ТОЛЬКО вверх? | Which change lifts the parabola straight UP only? |
| `label` | Qavs ichidagi sonni o'zgartirish. | Изменить число в скобке. | Change the number inside the bracket. |
| `label` | Qavsdan tashqaridagi songa qo'shish. | Прибавить к числу за скобкой. | Add to the number outside the bracket. |
| `label` | a koeffitsientini kattalashtirish. | Увеличить коэффициент a. | Make the coefficient a bigger. |
| `label` | a ning ishorasini almashtirish. | Поменять знак a. | Flip the sign of a. |
| `correctText` | To'g'ri. Qavsdan tashqaridagi son butun grafikni tik yo'nalishda ko'chiradi: har bir qiymatga bir xil son qo'shiladi, shakl esa tegilmaydi. Qavs ichidagi son gorizontal ko'chiradi, a esa umuman ko'chirmaydi. | Верно. Число за скобкой переносит весь график по вертикали: к каждому значению прибавляется одно и то же число, а форма не трогается. Число в скобке переносит по горизонтали, а a не переносит вовсе. | Correct. The number outside the bracket moves the whole graph vertically: the same number is added to every value and the shape is untouched. The number inside the bracket moves it horizontally, and a does not move it at all. |
| `text` | Qavs ichidagi son parabolani yon tomonga suradi, yuqoriga emas. Uni o'zgartirsangiz uchining balandligi o'sha-o'sha qoladi. | Число в скобке двигает параболу вбок, а не вверх. Если его менять, высота вершины останется прежней. | The number in the bracket moves the parabola sideways, not up. Change it and the height of the vertex stays the same. |
| `text` | a ni kattalashtirsangiz parabola torayadi, lekin uchi joyidan qimirlamaydi. Bir nechta iks da qiymatni hisoblab solishtiring. | Если увеличить a, парабола сузится, но вершина с места не сдвинется. Посчитай значения при нескольких икс и сравни. | Making a bigger narrows the parabola, but the vertex does not move. Compute values at a few x and compare. |
| `text` | a ning ishorasi tarmoqlarni pastga buradi, ya'ni shaklni ag'daradi. Bu ko'chirish emas. | Знак a разворачивает ветви вниз, то есть переворачивает форму. Это не перенос. | The sign of a turns the branches downward, that is, it flips the shape. That is not a shift. |
| `wrongText` | Ikkita savolni ajrating: parabola qayerda turadi va qanday ko'rinishda. Tik ko'chirish uchun qaysi son javobgar? | Раздели два вопроса: где стоит парабола и как она выглядит. Какое число отвечает за перенос по вертикали? | Separate two questions: where the parabola stands and how it looks. Which number is responsible for the vertical shift? |

---

## 04 · `PlacePoint` · 🟡 · teg `uchi-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Uchi | Вершина | Vertex |
| `setup` | Parabola formula bilan berilgan. Uchi — grafikning burilish nuqtasi. | Парабола задана формулой. Вершина — точка поворота графика. | The parabola is given by a formula. The vertex is the turning point of the graph. |
| `ask` | Parabolaning uchini tekislikka qo'ying. | Поставь вершину параболы на плоскости. | Place the vertex of the parabola on the plane. |
| `correctText` | To'g'ri. Qavs nolga aylanadigan son minus ikki — bu uchining abssissasi. Qavsdan tashqaridagi minus uch esa uni pastga tushiradi. Ikki son ikki xil yo'nalishni beradi: biri yon tomonga, ikkinchisi tikka. | Верно. Число, при котором скобка обращается в нуль, — минус два, это абсцисса вершины. А минус три за скобкой опускает её вниз. Два числа задают два разных направления: одно вбок, другое вверх-вниз. | Correct. The number that makes the bracket zero is minus two — that is the abscissa of the vertex. The minus three outside the bracket lowers it. The two numbers give two different directions: one sideways, one up and down. |
| `text` | Abssissaning ishorasi teskari olindi. Qavsda qo'shuv ikki turibdi: qavs nolga aylanishi uchun iks qanday bo'lishi kerak? | Знак абсциссы взят наоборот. В скобке стоит плюс два: каким должен быть икс, чтобы скобка обратилась в нуль? | The sign of the abscissa was taken the other way. The bracket holds plus two: what must x be for the bracket to become zero? |
| `text` | Ordinataning ishorasi teskari olindi. Qavsdan tashqarida minus uch turibdi, demak parabola pastga tushgan. | Знак ординаты взят наоборот. За скобкой стоит минус три, значит парабола опущена вниз. | The sign of the ordinate was taken the other way. Outside the bracket stands minus three, so the parabola is lowered. |
| `text` | Ikkala sonning ham ishorasi teskari. Qavs ichidagi son ishorasi ALMASHADI, qavsdan tashqaridagisi esa qanday yozilgan bo'lsa, shunday qoladi. | У обоих чисел знак наоборот. Знак числа в скобке МЕНЯЕТСЯ, а число за скобкой остаётся таким, как записано. | Both signs are the other way round. The sign of the number inside the bracket FLIPS, while the number outside stays as written. |
| `wrongText` | Ikki savol: qavs qaysi sonda nolga aylanadi, va qavsdan tashqaridagi son parabolani qayoqqa suradi? | Два вопроса: при каком числе скобка обращается в нуль и куда сдвигает параболу число за скобкой? | Two questions: at which number does the bracket become zero, and where does the number outside the bracket move the parabola? |

---

## 05 · `DomainAxis` · 🟡 · teg `uchi-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | O'q | Ось | Axis |
| `setup` | Parabola uchidan chapda kamayadi, o'ngda o'sadi. | Слева от вершины парабола убывает, справа возрастает. | To the left of the vertex the parabola decreases, to the right it increases. |
| `ask` | Funksiya o'suvchi bo'lgan oraliqni o'qda ko'rsating. | Отметь на оси промежуток, на котором функция возрастает. | Mark on the axis the interval where the function is increasing. |
| `closedLabel` | Bo'yalgan | Закрашенная | Filled |
| `openLabel` | Bo'sh | Пустая | Hollow |
| `correctText` | To'g'ri. Qavs uchda nolga aylanadi, demak uchi shu yerda. Undan o'ngda parabola ko'tariladi, va uchining o'zi ham oraliqqa kiradi. | Верно. Скобка обращается в нуль при трёх, значит вершина там. Правее парабола поднимается, и сама вершина тоже входит в промежуток. | Correct. The bracket becomes zero at three, so the vertex is there. To the right the parabola rises, and the vertex itself belongs to the interval. |
| `text` | Qavsda minus turibdi, demak qavs nolga aylanadigan son musbat. Iks minus uch nolga teng bo'lsa, iks nimaga teng? | В скобке стоит минус, значит число, при котором она обращается в нуль, положительное. Если икс минус три равно нулю, чему равен икс? | The bracket has a minus, so the number that makes it zero is positive. If x minus three is zero, what does x equal? |
| `text` | Bir — qavsdan tashqaridagi son, u parabolani tikka ko'taradi. Uchining abssissasi qavs ichidan chiqadi. | Единица — это число за скобкой, оно поднимает параболу по вертикали. Абсцисса вершины берётся из скобки. | One is the number outside the bracket; it lifts the parabola vertically. The abscissa of the vertex comes from inside the bracket. |
| `text` | Uchidan chapda parabola pastga tushadi — bu kamayish oralig'i. To'rt va beshni formulaga qo'yib solishtiring. | Левее вершины парабола опускается — это промежуток убывания. Подставь четыре и пять и сравни. | To the left of the vertex the parabola falls — that is the decreasing interval. Put in four and five and compare. |
| `text` | Uchining o'zi ham o'sish oralig'iga kiradi: aynan undan boshlab qiymatlar ortadi. | Сама вершина тоже входит в промежуток возрастания: именно с неё значения начинают расти. | The vertex itself belongs to the increasing interval: the values start growing exactly from it. |
| `wrongText` | Avval qavs nolga aylanadigan sonni toping, keyin uchining qaysi tomonida parabola ko'tarilishini aniqlang. | Сначала найди число, при котором скобка обращается в нуль, потом определи, с какой стороны от вершины парабола поднимается. | First find the number that makes the bracket zero, then work out on which side of the vertex the parabola rises. |

---

## 06 · `Zones` · 🟡 · teg `gorizontal-vertikal-almashinish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Guruhlar | Группы | Groups |
| `setup` | Hamma yozuv y = x² bilan solishtiriladi. Guruhni qavs ichidagi son hal qiladi. | Все записи сравниваются с y = x². Группу решает число в скобке. | Every record is compared with y = x². The group is decided by the number in the bracket. |
| `ask` | Har bir yozuvni o'z guruhiga qo'ying. | Разложи каждую запись в свою группу. | Put each record into its own group. |
| `bank` | Yozuvlar | Записи | Records |
| `label` | O'ngga siljigan | Сдвинута вправо | Shifted right |
| `label` | Chapga siljigan | Сдвинута влево | Shifted left |
| `label` | Faqat yuqoriga yoki pastga | Только вверх или вниз | Only up or down |
| `correctText` | To'g'ri. Qavsda minus tursa — o'ngga, qo'shuv tursa — chapga. Qavs umuman bo'lmasa, gorizontal siljish yo'q: bunday parabola faqat yuqoriga yoki pastga ko'chadi. Qavsdan tashqaridagi son bu guruhni hal qilmaydi, u faqat balandlikni o'zgartiradi. | Верно. Минус в скобке — сдвиг вправо, плюс — влево. Если скобки нет вовсе, горизонтального сдвига нет: такая парабола двигается только вверх или вниз. Число за скобкой эту группу не решает, оно меняет лишь высоту. | Correct. A minus in the bracket means a shift to the right, a plus means to the left. With no bracket at all there is no horizontal shift: such a parabola only moves up or down. The number outside the bracket does not decide this group; it only changes the height. |
| `text` | Qavsda minus turibdi. Uni nolga tenglashtiring: hosil bo'lgan son musbat, ya'ni uchi noldan o'ngda. | В скобке стоит минус. Приравняй её к нулю: получится положительное число, значит вершина правее нуля. | The bracket holds a minus. Set it to zero: the result is positive, so the vertex is to the right of zero. |
| `text` | Qavsda qo'shuv turibdi, demak qavs manfiy sonda nolga aylanadi va uchi chapda. | В скобке стоит плюс, значит скобка обращается в нуль при отрицательном числе и вершина слева. | The bracket holds a plus, so it becomes zero at a negative number and the vertex is on the left. |
| `text` | Bu yozuvlarda qavs umuman yo'q, ya'ni iks toza turibdi. Gorizontal siljish qavsdan chiqadi, undan boshqa joydan emas. | В этих записях скобки нет вовсе, икс стоит чистым. Горизонтальный сдвиг берётся из скобки и ниоткуда больше. | These records have no bracket at all, x stands bare. A horizontal shift comes from the bracket and nowhere else. |
| `text` | Qavsdan tashqaridagi son bu guruhni hal qilmaydi. Avval qavsga qarang: u yerda son bormi? | Число за скобкой эту группу не решает. Сначала посмотри в скобку: есть ли там число? | The number outside the bracket does not decide this group. Look inside the bracket first: is there a number there? |
| `wrongText` | Har yozuvda faqat QAVSGA qarang. Qavs yo'q — vertikal; qavsda minus — o'ngga; qavsda qo'shuv — chapga. | Смотри в каждой записи только на СКОБКУ. Скобки нет — вертикаль; минус в скобке — вправо; плюс — влево. | Look only at the BRACKET in each record. No bracket means vertical; a minus means right; a plus means left. |

---

## 07 · `TypeSet` · 🟡 · teg `ishora-teskari-siljish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Abssissa | Абсцисса | Abscissa |
| `setup` | Uchining abssissasi qavs nolga aylanadigan sondan chiqadi. | Абсцисса вершины берётся из числа, при котором скобка обращается в нуль. | The abscissa of the vertex comes from the number that makes the bracket zero. |
| `ask` | Uchining abssissasini yozing. | Напиши абсциссу вершины. | Write the abscissa of the vertex. |
| `hint` | Javob bitta son. | Ответ — одно число. | The answer is a single number. |
| `correctText` | To'g'ri, minus yetti. Qavsda qo'shuv yetti turibdi, u nolga aylanishi uchun iks minus yettiga teng bo'lishi kerak. Qavsdagi son ishorasi shu tarzda TESKARI ishlaydi. | Верно, минус семь. В скобке стоит плюс семь, и чтобы она обратилась в нуль, икс должен равняться минус семи. Именно так знак числа в скобке работает НАОБОРОТ. | Correct, minus seven. The bracket holds plus seven, and for it to become zero x must equal minus seven. That is exactly how the sign inside the bracket works the OTHER way round. |
| `text` | Ishora teskari olindi. Qavsni nolga tenglashtiring: iks qo'shuv yetti nolga teng bo'lsa, iks nimaga teng? | Знак взят наоборот. Приравняй скобку к нулю: если икс плюс семь равно нулю, чему равен икс? | The sign was taken the other way. Set the bracket to zero: if x plus seven is zero, what does x equal? |
| `text` | Minus besh — qavsdan tashqaridagi son, u uchining balandligini beradi. Savol esa abssissa haqida. | Минус пять — число за скобкой, оно даёт высоту вершины. А спрашивают абсциссу. | Minus five is the number outside the bracket; it gives the height of the vertex. The question is about the abscissa. |
| `text` | Bu qavsdan tashqaridagi sonning qarama-qarshisi. Abssissa qavs ICHIDAN chiqadi. | Это противоположное к числу за скобкой. Абсцисса берётся ИЗ скобки. | That is the opposite of the number outside the bracket. The abscissa comes from INSIDE the bracket. |
| `wrongText` | Qavsni nolga tenglashtiring va iksni toping. Qavsdan tashqaridagi songa tegmang — u boshqa savolga javob beradi. | Приравняй скобку к нулю и найди икс. Число за скобкой не трогай — оно отвечает на другой вопрос. | Set the bracket to zero and find x. Leave the number outside the bracket alone — it answers a different question. |

---

## 08 · `AuditLines` · 🔴 · teg `ishora-teskari-siljish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Xato qator | Ошибочная строка | Wrong line |
| `setup` | Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi. | Решение готово, но ответ неверный. Каждая строка выглядит правильной. | The solution is finished, but the answer is wrong. Every line looks right. |
| `ask` | Birinchi xato qatorni bosing. | Нажми первую ошибочную строку. | Tap the first wrong line. |
| `givenLabel` | Toping | Найти | Find |
| `text` | Uchi formulasi: | Формула вершины: | The vertex formula: |
| `text` | Solishtiramiz: | Сравниваем: | Compare: |
| `text` | Uchi: | Вершина: | Vertex: |
| `text` | Javob: | Ответ: | Answer: |
| `correctText` | To'g'ri, xato ikkinchi qatorda. Formulada qavs ichida iks MINUS iks nol turibdi, yozuvda esa iks QO'SHUV to'rt. Ikkalasini solishtirsak, minus iks nol qo'shuv to'rtga teng, ya'ni iks nol minus to'rtga teng. Uchi minus to'rtda, to'rtda emas — parabola chapga siljigan. | Верно, ошибка во второй строке. В формуле в скобке стоит икс МИНУС икс нулевое, а в записи икс ПЛЮС четыре. Сравнив их, получаем: минус икс нулевое равно плюс четырём, то есть икс нулевое равно минус четырём. Вершина в минус четырёх, а не в четырёх — парабола сдвинута влево. | Correct, the error is in the second line. The formula has x MINUS x-nought inside the bracket, while the record has x PLUS four. Comparing them: minus x-nought equals plus four, so x-nought equals minus four. The vertex is at minus four, not at four — the parabola is shifted left. |
| `text` | Bu qator to'g'ri: uchi formulasi aynan shunday yoziladi, qavs ichida ayirish bilan. Xatoni undan pastda qidiring. | Эта строка верна: формула вершины так и записывается, со знаком минус в скобке. Ищи ошибку ниже. | This line is right: the vertex formula is written exactly like that, with a minus inside the bracket. Look for the error below. |
| `text` | Uchinchi qator ikkinchisining natijasi: agar iks nol haqiqatan to'rt bo'lganida, uchi shu yerda bo'lardi. Xato undan yuqorida. | Третья строка — результат второй: если бы икс нулевое и правда равнялось четырём, вершина была бы там. Ошибка выше. | The third line is the result of the second: if x-nought really were four, the vertex would be there. The error is above. |
| `text` | To'rtinchi qator uchinchisini takrorlaydi. Bizga BIRINCHI xato kerak, oxirgisi emas. | Четвёртая строка повторяет третью. Нам нужна ПЕРВАЯ ошибка, а не последняя. | The fourth line repeats the third. We need the FIRST error, not the last one. |
| `wrongText` | Formuladagi qavs bilan yozuvdagi qavsni yonma-yon qo'ying. Formulada ayirish, yozuvda esa qo'shish — iks nol qanday chiqadi? | Положи рядом скобку из формулы и скобку из записи. В формуле вычитание, в записи сложение — каким тогда получается икс нулевое? | Put the bracket from the formula next to the bracket from the record. The formula subtracts, the record adds — what does x-nought come out as? |

---

## 09 · `ClozeBank` · 🔴 · teg `a-joyni-ozgartirmaydi`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | So'zlar | Слова | Words |
| `setup` | Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying. | Правило урока записано, но три слова выпали. Поставь их из карточек снизу. | The rule of the lesson is written down, but three words fell out. Put them back from the cards below. |
| `ask` | Kartani bosing, keyin bo'sh kartochkani bosing. | Нажми карточку, потом пустую клетку. | Tap a card, then tap an empty cell. |
| `bank` | Kartalar | Карточки | Cards |
| `text` | Qavs ichidagi son ishorasi | Знак числа в скобке работает | The sign of the number in the bracket works |
| `text` | ishlaydi: qavsda minus tursa, parabola | : если в скобке минус, парабола сдвигается | : a minus in the bracket shifts the parabola |
| `text` | siljiydi. a koeffitsienti esa parabolaning | . А коэффициент a меняет | . The coefficient a changes the |
| `text` | o'zgartiradi, o'rnini emas. | параболы, а не её место. | of the parabola, not its place. |
| `label` | teskari | наоборот | the other way |
| `label` | o'ngga | вправо | to the right |
| `label` | shaklini | форму | shape |
| `label` | to'g'ri | так же | the same way |
| `label` | chapga | влево | to the left |
| `label` | o'rnini | место | place |
| `correctText` | To'g'ri, uchala so'z ham joyida. Qoidada darsning uchta ishi turibdi: qavsdagi ishoraning teskari ishlashi, siljish yo'nalishi va a ning ta'siri. Uchtasi bitta gapga yig'ilganda ko'rinadi: qayerda turishini qavs hal qiladi, qanday ko'rinishini esa a. | Верно, все три слова на месте. В правиле стоят три дела урока: обратная работа знака в скобке, направление сдвига и влияние a. Все три видны вместе: где парабола стоит, решает скобка, а как она выглядит — a. | Correct, all three words are in place. The rule holds the three jobs of the lesson: the reversed sign in the bracket, the direction of the shift, and what a affects. Together they show it: the bracket decides where the parabola stands, a decides how it looks. |
| `text` | Qavsni nolga tenglashtiring: iks minus uch nolga teng bo'lsa, iks musbat uchga teng. Qavsda minus, natijada esa musbat son — demak ishora teskari ishlaydi. | Приравняй скобку к нулю: если икс минус три равно нулю, икс равен плюс трём. В скобке минус, а в результате положительное число — значит знак работает наоборот. | Set the bracket to zero: if x minus three is zero, x is plus three. A minus in the bracket and a positive result — so the sign works the other way. |
| `text` | Qavsda minus turgan holni oling: uchi musbat sonda chiqadi, ya'ni noldan o'ngda. Chapga siljish esa qavsda qo'shuv turganda bo'ladi. | Возьми случай с минусом в скобке: вершина получается при положительном числе, то есть правее нуля. А влево сдвигает плюс в скобке. | Take the case with a minus in the bracket: the vertex lands at a positive number, to the right of zero. A plus in the bracket is what shifts left. |
| `text` | Gapning oxiri «o'rnini emas» deb turibdi — bitta so'z ikki marta ishlatilmaydi. a ni ikki barobar kattalashtiring va uchining o'rnini tekshiring: u qimirlaydimi? | В конце предложения уже стоит «а не её место» — одно слово дважды не используют. Увеличь a вдвое и проверь место вершины: сдвинется ли оно? | The end of the sentence already says "not its place" — one word is not used twice. Double a and check the place of the vertex: does it move? |
| `wrongText` | Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ishora haqida, ikkinchisi yo'nalish haqida, uchinchisi esa a nimani o'zgartirishi haqida. | Проверяй каждую клетку самим предложением: первое про знак, второе про направление, третье про то, что меняет a. | Check each blank against the sentence itself: the first is about the sign, the second about direction, the third about what a changes. |

---

## 10 · `OrderLines` · 🔴 · teg `uchi-notogri-oqish`

| Kalit | UZ | RU | EN |
|---|---|---|---|
| `eyebrow` | Yasash | Построение | Construction |
| `setup` | Beshta qadam aralashtirilgan. Ular yasash tartibini hosil qiladi. | Пять шагов перемешаны. Вместе они составляют порядок построения. | Five steps are shuffled. Together they make the order of building. |
| `ask` | Qadamlarni to'g'ri tartibga soling. | Расставь шаги по порядку. | Put the steps in the right order. |
| `empty` | Kartochkalarni tartib bilan bosing | Нажимай карточки по порядку | Tap the cards in order |
| `givenLabel` | Yasang | Построить | Build |
| `label` | Yozuvni solishtiramiz: | Сравниваем запись с видом: | Compare the record with the form: |
| `label` | Uchini qo'yamiz: | Ставим вершину: | Place the vertex: |
| `label` | y = x² parabolasini shu uchidan chizamiz | Строим параболу y = x² от этой вершины | Draw the parabola y = x² from that vertex |
| `label` | Tekshirish: | Проверка: | Check: |
| `correctText` | To'g'ri. Yasash solishtirishdan boshlanadi: yozuv qaysi ko'rinishda ekanini bilmasdan, undan son olib bo'lmaydi. Keyin ikkita son chiqadi, ular uchini beradi, uchidan esa parabolaning o'zi chiziladi. Oxirida bitta nuqta bilan tekshiriladi — bu ham qadam. | Верно. Построение начинается со сравнения: не зная, в каком виде записана формула, из неё не взять чисел. Потом получаются два числа, они дают вершину, а от вершины уже строится сама парабола. В конце проверка одной точкой — это тоже шаг. | Correct. Building starts from the comparison: without knowing which form the record is in, no numbers can be taken from it. Then two numbers appear, they give the vertex, and the parabola itself is drawn from the vertex. At the end it is checked with one point — that is a step too. |
| `text` | Bu qator solishtirishning natijasi. Nima bilan solishtirilganini aytmasdan, iks nol qayerdan chiqadi? | Эта строка — результат сравнения. Если не сказано, с чем сравнивали, откуда возьмётся икс нулевое? | This line is the result of the comparison. If it is not said what was compared with what, where would x-nought come from? |
| `text` | Parabola uchidan chiziladi. Uchi hali qo'yilmagan bo'lsa, chiziqni qayerdan boshlaysiz? | Параболу строят от вершины. Если вершина ещё не поставлена, откуда начинать линию? | A parabola is drawn from the vertex. If the vertex is not placed yet, where do you start the line? |
| `text` | Tekshirish tayyor grafikni tekshiradi. Undan oldin tekshiradigan narsa yo'q. | Проверка проверяет готовый график. До него проверять нечего. | The check tests a finished graph. Before it there is nothing to check. |
| `text` | Yasash nimadan boshlanadi? Avval yozuvning ko'rinishi aniqlanadi, keyin undan sonlar olinadi. | С чего начинается построение? Сначала определяют вид записи, и только потом берут из неё числа. | Where does building start? First the form of the record is settled, and only then numbers are taken from it. |
| `wrongText` | Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? | Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? | Read the chain from top to bottom: does every step use the result of the one before it? |

