# Урок 45 — Параллелепипед · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS44_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, стр. 45 — параллелепипед,
прямой параллелепипед, прямоугольный параллелепипед, три измерения, куб. Определения взяты
дословно.

**Главное решение урока.** Ошибка года здесь про две диагонали. Из одной вершины выходят
диагональ грани и диагональ тела, на чертеже они почти сливаются, и ученик считает диагональ
по двум измерениям вместо трёх. Свидетель: поворот разводит их, и видно, что одна лежит в
грани, а вторая уходит внутрь тела.

**Формулу диагонали выводим, а не даём.** Два раза теорема Пифагора, и второй раз опирается на
перпендикулярность бокового ребра — то есть на урок 40. Это и есть проверка, что блок 6 работает.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`parallelepiped`, `to'g'ri parallelepiped`, `to'g'ri burchakli parallelepiped`, `o'lchamlar`,
`kub` взяты из учебника, стр. 45.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДИАГОНАЛЬ | DIAGONAL | THE DIAGONAL |
| `title` | Два измерения или три | Ikki o'lcham yoki uch | Two dimensions or three |
| `row.a.name` | два | ikki | two |
| `row.b.name` | три | uch | three |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём тело. | Javobingiz yozib olindi. Endi jismni buramiz. | Your answer is recorded. Now we rotate the body. |
| `audio.mount` | Прямоугольный параллелепипед. Из одной вершины проведена диагональ в противоположную вершину. | To'g'ri burchakli parallelepiped. Bir uchdan qarama-qarshi uchga diagonal o'tkazilgan. | A rectangular box. From one vertex a diagonal is drawn to the opposite vertex. |
| `audio.r1` | Первая запись берёт два измерения. | Birinchi yozuv ikki o'lchamni oladi. | The first reading takes two dimensions. |
| `audio.r2` | Вторая берёт три. | Ikkinchisi uchtasini oladi. | The second takes three. |
| `audio.ask` | На чертеже диагональ похожа на диагональ грани. Как думаешь, какая запись верная? | Chizmada diagonal yoq diagonaliga o'xshaydi. Sizningcha qaysi yozuv to'g'ri? | On the drawing the diagonal looks like a face diagonal. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AC₁` |
| `row.a.value` | `d² = a² + b²` |
| `row.b.value` | `d² = a² + b² + c²` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из прошлого урока | O'tgan darsdan uch savol | Three questions from the last lesson |
| `q1.prompt` | Что такое основания призмы? | Prizmaning asoslari nima? | What are the bases of a prism? |
| `q1.a` [верно] | две равные грани | ikki teng yoq | two equal faces |
| `q1.b` | две нижние грани | ikki pastdagi yoq | the two lower faces |
| `q1.b.hint` | Низ зависит от чертежа, а основания нет. | Past chizmaga bog'liq, asoslar esa yo'q. | The bottom depends on the drawing, the bases do not. |
| `q1.c` | все параллелограммы | barcha parallelogrammlar | all the parallelograms |
| `q1.c.hint` | Параллелограммы это боковые грани. | Parallelogrammlar yon yoqlar. | The parallelograms are the lateral faces. |
| `q1.d` | самые большие грани | eng katta yoqlar | the biggest faces |
| `q1.d.hint` | Размер тут ничего не решает. | O'lcham bu yerda hech narsani hal qilmaydi. | Size decides nothing here. |
| `q2.prompt` | Сколько граней сходится в одном ребре? | Bitta qirrada nechta yoq tutashadi? | How many faces meet at one edge? |
| `q2.a` [верно] | две | ikkita | two |
| `q2.b` | одна | bitta | one |
| `q2.b.hint` | Одна грань дала бы просто сторону. | Bitta yoq shunchaki tomon berardi. | One face would give just a side. |
| `q2.c` | три | uchta | three |
| `q2.c.hint` | Три сходятся в вершине. | Uchtasi uchda tutashadi. | Three meet at a vertex. |
| `q2.d` | четыре | to'rtta | four |
| `q2.d.hint` | Четыре не сходятся ни в ребре, ни в вершине куба. | To'rtta na qirrada, na kubning uchida tutashadi. | Four meet neither at an edge nor at a vertex of a cube. |
| `q3.prompt` | Когда призма прямая? | Prizma qachon to'g'ri? | When is a prism right? |
| `q3.a` [верно] | боковое ребро перпендикулярно основанию | yon qirra asosga perpendikulyar | the lateral edge is perpendicular to the base |
| `q3.b` | основание правильное | asos muntazam | the base is regular |
| `q3.b.hint` | Это условие правильной призмы. | Bu muntazam prizmaning sharti. | That is the condition of a regular prism. |
| `q3.c` | все рёбра равны | barcha qirralar teng | all edges are equal |
| `q3.c.hint` | Это даже у куба не всегда так. | Bu kubda ham doim shunday emas. | Even for a box that is not always so. |
| `q3.d` | стоит на основании | asosda turadi | it stands on its base |
| `q3.d.hint` | Как стоит на чертеже, к делу не относится. | Chizmada qanday turgani ishga aloqasi yo'q. | How it stands on the drawing is irrelevant. |
| `audio.mount` | Три вопроса про призму. Параллелепипед это её частный случай. | Prizma haqida uch savol. Parallelepiped uning xususiy holi. | Three questions about the prism. A parallelepiped is its special case. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `ABC = A₁B₁C₁` |
| `q2.done` | `2` |
| `q3.done` | `AA₁ ⊥ ABCD` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Параллелепипед: призма с параллелограммом в основании.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Все шесть граней параллелограммы | Barcha olti yoq parallelogramm | All six faces are parallelograms |
| `show.1.1` | в основании параллелограмм | asosda parallelogramm | there is a parallelogram in the base |
| `show.1.2` | это призма, значит боковые тоже | bu prizma, demak yonlari ham | this is a prism, so the lateral ones too |
| `show.2.1` | поверни и посмотри на грани | buring va yoqlarga qarang | rotate it and look at the faces |
| `show.2.2` | параллелограмм в каждой | har birida parallelogramm | a parallelogram in each of them |
| `audio.mount` | Возьмём призму, у которой основание не любой многоугольник, а параллелограмм. | Asosi istalgan ko'pburchak emas, parallelogramm bo'lgan prizmani olamiz. | Take a prism whose base is not any polygon but a parallelogram. |
| `audio.move*` | Такая призма называется параллелепипедом. Так на странице сорок пять. Смотри, что из этого следует. Основания параллелограммы по условию, боковые грани параллелограммы потому что это призма. Значит все шесть граней параллелограммы, и особых граней у параллелепипеда нет. Поверни тело и проверь. Любая пара противоположных граней годится на роль основания, и тело от этого не меняется. У обычной призмы так не выходило, потому что основания там особые. | Bunday prizma parallelepiped deb nomlanadi. Qirq beshinchi betda shunday. Bundan nima kelib chiqishiga qarang. Asoslar shartga ko'ra parallelogramm, yon yoqlar esa prizma bo'lgani uchun parallelogramm. Demak barcha olti yoq parallelogramm, va parallelepipedda alohida yoq yo'q. Jismni buring va tekshiring. Qarama-qarshi yoqlarning har juftligi asos bo'lishga yaraydi, va jism bundan o'zgarmaydi. Oddiy prizmada bunday chiqmagan edi, chunki u yerda asoslar alohida. | Such a prism is called a parallelepiped. So it is on page forty five. See what follows. The bases are parallelograms by the condition, the lateral faces are parallelograms because this is a prism. So all six faces are parallelograms and a parallelepiped has no special faces. Rotate the body and check. Any pair of opposite faces will do as the bases, and the body does not change. For an ordinary prism that did not work, because there the bases are special. |
| `audio.work` | Посчитай сам. Сколько граней у параллелепипеда? | O'zingiz hisoblang. Parallelepipedning nechta yog'i bor? | Work it out yourself. How many faces does a parallelepiped have? |
| `work.prompt` | Сколько граней? | Nechta yoq? | How many faces? |
| `work.ok` | Шесть. Основание четырёхугольник, значит граней четыре плюс два. | Oltita. Asos to'rtburchak, demak yoqlar to'rt qo'shuv ikki. | Six. The base is a quadrilateral, so the faces are four plus two. |
| `work.hint.1` | Вспомни правило из прошлого урока про n плюс два. | O'tgan darsdagi n qo'shuv ikki qoidasini eslang. | Recall the rule from the last lesson about n plus two. |
| `work.hint.2` | У основания четыре стороны. | Asosda to'rt tomon. | The base has four sides. |
| `work.hint.3` | Четыре плюс два. | To'rt qo'shuv ikki. | Four plus two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `4 + 2 = 6` |
| `work.answer` | `6` |

---

## Экран 4 · `explain2` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Прямой и прямоугольный.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Прямой и прямоугольный | To'g'ri va to'g'ri burchakli | Right and rectangular |
| `show.1.1` | боковое ребро встало перпендикулярно | yon qirra perpendikulyar bo'ldi | the lateral edge stood perpendicular |
| `show.1.2` | боковые грани стали прямоугольниками | yon yoqlar to'g'ri to'rtburchak bo'ldi | the lateral faces became rectangles |
| `show.2.1` | основание тоже стало прямоугольником | asos ham to'g'ri to'rtburchak bo'ldi | the base became a rectangle too |
| `show.2.2` | теперь все шесть прямоугольники | endi oltitasi ham to'g'ri to'rtburchak | now all six are rectangles |
| `audio.mount` | Поставим боковое ребро перпендикулярно основанию. Такой параллелепипед называется прямым. | Yon qirrani asosga perpendikulyar qo'yamiz. Bunday parallelepiped to'g'ri deb ataladi. | Let us set the lateral edge perpendicular to the base. Such a parallelepiped is called right. |
| `audio.move*` | У прямого параллелепипеда боковые грани прямоугольники, а вот основание остаётся каким было, то есть параллелограммом. Теперь сделаем прямоугольником и основание. Такой параллелепипед называется прямоугольным, и у него прямоугольники все шесть граней. Разница между прямым и прямоугольным ровно в основании, и это то же различение, что было у призмы между прямой и правильной. Условие про ребро и условие про основание независимы, и проверять надо оба. | To'g'ri parallelepipedning yon yoqlari to'g'ri to'rtburchak, asos esa qanday bo'lsa shunday qoladi, ya'ni parallelogramm. Endi asosni ham to'g'ri to'rtburchak qilamiz. Bunday parallelepiped to'g'ri burchakli deb ataladi, va unda oltita yoqning hammasi to'g'ri to'rtburchak. To'g'ri va to'g'ri burchakli orasidagi farq aynan asosda, va bu prizmadagi to'g'ri va muntazam farqining o'zi. Qirra haqidagi shart va asos haqidagi shart mustaqil, va ikkalasini ham tekshirish kerak. | In a right parallelepiped the lateral faces are rectangles, while the base stays what it was, a parallelogram. Now let us make the base a rectangle as well. Such a parallelepiped is called rectangular, and all six of its faces are rectangles. The difference between right and rectangular is exactly in the base, and that is the same distinction the prism had between right and regular. The condition about the edge and the condition about the base are independent and both have to be checked. |
| `audio.work` | Посчитай сам. Сколько прямоугольников среди граней прямоугольного параллелепипеда? | O'zingiz hisoblang. To'g'ri burchakli parallelepiped yoqlari orasida nechta to'g'ri to'rtburchak bor? | Work it out yourself. How many rectangles are among the faces of a rectangular box? |
| `work.prompt` | Сколько прямоугольников? | Nechta to'g'ri to'rtburchak? | How many rectangles? |
| `work.ok` | Шесть. И основания, и боковые грани. | Oltita. Asoslar ham, yon yoqlar ham. | Six. Both the bases and the lateral faces. |
| `work.hint.1` | Посчитай отдельно основания и боковые. | Asoslarni va yonlarni alohida sanang. | Count the bases and the lateral faces separately. |
| `work.hint.2` | Оснований два, боковых четыре. | Asoslar ikkita, yonlari to'rtta. | Two bases, four lateral faces. |
| `work.hint.3` | Два плюс четыре. | Ikki qo'shuv to'rt. | Two plus four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AA₁ ⊥ ABCD,   ABCD = ▭` |
| `work.answer` | `6` |

---

## Экран 5 · `explain3` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Куб как частный случай.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Три измерения и куб | Uch o'lcham va kub | Three dimensions and the cube |
| `show.1.1` | из одной вершины выходят три ребра | bir uchdan uch qirra chiqadi | three edges leave one vertex |
| `show.1.2` | их длины это измерения | ularning uzunliklari o'lchamlar | their lengths are the dimensions |
| `show.2.1` | измерения сделали равными | o'lchamlar teng qilindi | the dimensions were made equal |
| `show.2.2` | получился куб | kub chiqdi | a cube came out |
| `audio.mount` | В прямоугольном параллелепипеде из каждой вершины выходят три ребра. Их длины называются измерениями. | To'g'ri burchakli parallelepipedda har uchdan uch qirra chiqadi. Ularning uzunliklari o'lchamlar deb ataladi. | In a rectangular box three edges leave each vertex. Their lengths are called the dimensions. |
| `audio.move*` | Измерений ровно три, и они задают тело целиком. Так на странице сорок пять. Сделаем все три равными. Получится тело, у которого все рёбра равны и все грани квадраты, и оно называется кубом. Куб это прямоугольный параллелепипед с равными измерениями, то есть частный случай, а не отдельная фигура. Поверни куб и убедись, что из любой вершины картина одна и та же. Именно поэтому куб такой удобный пример, и мы им пользовались весь блок про плоскости. | O'lchamlar roppa-rosa uchta, va ular jismni butunlay belgilaydi. Qirq beshinchi betda shunday. Uchalasini teng qilamiz. Barcha qirralari teng va barcha yoqlari kvadrat bo'lgan jism chiqadi, va u kub deb nomlanadi. Kub o'lchamlari teng bo'lgan to'g'ri burchakli parallelepiped, ya'ni xususiy hol, alohida shakl emas. Kubni buring va har qanday uchdan manzara bir xil ekaniga ishonch hosil qiling. Aynan shuning uchun kub bunday qulay misol, va biz undan tekisliklar bloki bo'ylab foydalandik. | There are exactly three dimensions and they fix the whole body. So it is on page forty five. Let us make all three equal. We get a body with all edges equal and all faces squares, and it is called a cube. A cube is a rectangular box with equal dimensions, that is a special case rather than a separate figure. Rotate the cube and see that the picture is the same from any vertex. That is exactly why a cube is such a convenient example, and we used it throughout the block about planes. |
| `audio.work` | Посчитай сам. Сколько разных измерений у куба? | O'zingiz hisoblang. Kubning nechta xil o'lchami bor? | Work it out yourself. How many different dimensions does a cube have? |
| `work.prompt` | Сколько разных измерений? | Nechta xil o'lcham? | How many different dimensions? |
| `work.ok` | Одно. Все три измерения равны между собой. | Bitta. Uchala o'lcham o'zaro teng. | One. All three dimensions are equal to each other. |
| `work.hint.1` | Посмотри на три ребра из одной вершины. | Bir uchdan chiqqan uch qirraga qarang. | Look at the three edges from one vertex. |
| `work.hint.2` | У куба они равны. | Kubda ular teng. | In a cube they are equal. |
| `work.hint.3` | Одно. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a = b = c` |
| `work.answer` | `1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `diagonal-grani-i-tela`

Сам: диагональ через три измерения.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Диагональ по трём измерениям | Diagonal uch o'lcham bo'yicha | The diagonal from three dimensions |
| `show.1.1` | сначала диагональ основания | avval asos diagonali | first the base diagonal |
| `show.1.2` | это Пифагор по двум измерениям | bu ikki o'lcham bo'yicha Pifagor | that is Pythagoras on two dimensions |
| `show.2.1` | потом диагональ тела | keyin jism diagonali | then the body diagonal |
| `show.2.2` | это Пифагор ещё раз | bu yana Pifagor | that is Pythagoras once more |
| `audio.mount` | Измерения три, четыре и двенадцать. Найдём диагональ тела. | O'lchamlar uch, to'rt va o'n ikki. Jism diagonalini topamiz. | The dimensions are three, four and twelve. Let us find the body diagonal. |
| `audio.move*` | Сначала диагональ основания. В основании прямоугольник с измерениями три и четыре, значит его диагональ пять. Теперь смотри на треугольник, у которого один катет это диагональ основания, а второй боковое ребро. Угол между ними прямой, потому что боковое ребро перпендикулярно плоскости основания, а диагональ лежит в этой плоскости. Значит снова Пифагор. Пять и двенадцать дают тринадцать. Поверни тело и посмотри, где лежит этот треугольник, он проходит внутри параллелепипеда. | Avval asos diagonali. Asosda o'lchamlari uch va to'rt bo'lgan to'g'ri to'rtburchak, demak uning diagonali besh. Endi bir kateti asos diagonali, ikkinchisi yon qirra bo'lgan uchburchakka qarang. Ular orasidagi burchak to'g'ri, chunki yon qirra asos tekisligiga perpendikulyar, diagonal esa shu tekislikda yotadi. Demak yana Pifagor. Besh va o'n ikki o'n uchni beradi. Jismni buring va bu uchburchak qayerda yotganini ko'ring, u parallelepipedning ichidan o'tadi. | First the base diagonal. The base is a rectangle with dimensions three and four, so its diagonal is five. Now look at the triangle whose one leg is the base diagonal and the other is the lateral edge. The angle between them is right, because the lateral edge is perpendicular to the plane of the base while the diagonal lies in that plane. So Pythagoras again. Five and twelve give thirteen. Rotate the body and see where that triangle lies, it goes inside the parallelepiped. |
| `audio.work` | Посчитай сам. Измерения три, четыре и двенадцать. Какова диагональ тела? | O'zingiz hisoblang. O'lchamlar uch, to'rt va o'n ikki. Jism diagonali qancha? | Work it out yourself. The dimensions are three, four and twelve. What is the body diagonal? |
| `work.prompt` | Найди диагональ тела | Jism diagonalini toping | Find the body diagonal |
| `work.ok` | Тринадцать. Пять в основании, потом пять и двенадцать. | O'n uch. Asosda besh, keyin besh va o'n ikki. | Thirteen. Five in the base, then five and twelve. |
| `work.hint.1` | Сначала найди диагональ основания. | Avval asos diagonalini toping. | First find the base diagonal. |
| `work.hint.2` | Три и четыре дают пять. | Uch va to'rt beshni beradi. | Three and four give five. |
| `work.hint.3` | Пять и двенадцать дают тринадцать. | Besh va o'n ikki o'n uchni beradi. | Five and twelve give thirteen. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `3, 4, 12   →   d = ?` |
| `work.answer` | `13` |

---

## Экран 7 · `explain5` · ответ `number` · тег `diagonal-grani-i-tela`

Граница: диагональ грани и диагональ тела.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Две диагонали из одной вершины | Bir uchdan ikki diagonal | Two diagonals from one vertex |
| `show.1.1` | одна диагональ лежит в грани | bir diagonal yoqda yotadi | one diagonal lies in a face |
| `show.1.2` | другая уходит внутрь тела | ikkinchisi jism ichiga ketadi | the other goes inside the body |
| `show.2.1` | поверни и следи за ними | buring va ularga qarang | rotate and watch them |
| `show.2.2` | они разошлись, это разные отрезки | ular ajraldi, bu boshqa kesmalar | they came apart, these are different segments |
| `audio.mount` | Из одной вершины проведены два отрезка. Один в противоположную вершину грани, второй в противоположную вершину тела. | Bir uchdan ikki kesma o'tkazilgan. Biri yoqning qarama-qarshi uchiga, ikkinchisi jismning qarama-qarshi uchiga. | Two segments are drawn from one vertex. One to the opposite vertex of a face, the other to the opposite vertex of the body. |
| `audio.move*` | На неподвижном чертеже они идут почти рядом, и именно поэтому их путают. Поверни тело. Диагональ грани остаётся в грани при любом повороте, а диагональ тела нигде в грани не лежит, она идёт внутри. Отсюда и разница в счёте. В диагональ грани входят два измерения, в диагональ тела три. Если взять два вместо трёх, ответ получится меньше настоящего, и ошибку эту заметить трудно, потому что число выглядит правдоподобно. | Qimirlamas chizmada ular deyarli yonma-yon boradi, va aynan shuning uchun ularni aralashtirib yuboradilar. Jismni buring. Yoq diagonali har qanday burilishda yoqda qoladi, jism diagonali esa hech qayerda yoqda yotmaydi, u ichdan boradi. Sanoqdagi farq ham shundan. Yoq diagonaliga ikki o'lcham kiradi, jism diagonaliga uchta. Uchta o'rniga ikkitasini olsangiz, javob haqiqiysidan kichik chiqadi, va bu xatoni sezish qiyin, chunki son ishonarli ko'rinadi. | On a still drawing they run almost side by side, and that is exactly why they get confused. Rotate the body. The face diagonal stays in its face at any rotation, while the body diagonal lies in no face at all, it goes inside. Hence the difference in counting. Two dimensions go into a face diagonal, three into a body diagonal. If you take two instead of three, the answer comes out smaller than the true one, and that mistake is hard to notice because the number looks plausible. |
| `audio.work` | Посчитай сам. Сколько измерений входит в диагональ грани? | O'zingiz hisoblang. Yoq diagonaliga nechta o'lcham kiradi? | Work it out yourself. How many dimensions go into a face diagonal? |
| `work.prompt` | Сколько измерений в диагонали грани? | Yoq diagonalida nechta o'lcham? | How many dimensions are in a face diagonal? |
| `work.ok` | Два. Грань плоская, третье измерение в неё не попадает. | Ikkita. Yoq yassi, uchinchi o'lcham unga tushmaydi. | Two. A face is flat, the third dimension does not enter it. |
| `work.hint.1` | Посмотри, в какой грани лежит эта диагональ. | Bu diagonal qaysi yoqda yotganini ko'ring. | See which face this diagonal lies in. |
| `work.hint.2` | У грани есть длина и ширина, и всё. | Yoqning uzunligi va kengligi bor, tamom. | A face has a length and a width, and that is all. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AC² = a² + b²` |
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `diagonal-grani-i-tela`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Три измерения в диагонали | Diagonalda uch o'lcham | Three dimensions in the diagonal |
| `probe.question` | Сколько измерений входит в диагональ тела? | Jism diagonaliga nechta o'lcham kiradi? | How many dimensions go into a body diagonal? |
| `probe.a` [верно] | три | uchta | three |
| `probe.b` | два | ikkita | two |
| `probe.b.hint` | Два дают диагональ грани, а не тела. | Ikkitasi yoq diagonalini beradi, jismning emas. | Two give a face diagonal, not a body one. |
| `rule.lawLabel` | Диагональ тела | Jism diagonali | The body diagonal |
| `rule.lines.1` | параллелепипед это призма с параллелограммом в основании | parallelepiped asosi parallelogramm bo'lgan prizma | a parallelepiped is a prism with a parallelogram base |
| `rule.lines.2` | прямоугольный параллелепипед задан тремя измерениями | to'g'ri burchakli parallelepiped uch o'lcham bilan berilgan | a rectangular box is given by three dimensions |
| `rule.lines.3` | квадрат диагонали это сумма квадратов трёх измерений | diagonal kvadrati uch o'lcham kvadratlari yig'indisi | the square of the diagonal is the sum of the squares of the three dimensions |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Формула выводится двумя шагами, и второй шаг опирается на перпендикулярность бокового ребра. Поэтому её нельзя применять к наклонному параллелепипеду. Проверь себя простым способом. В кубе с ребром один диагональ грани это корень из двух, а диагональ тела корень из трёх. Числа разные, и разница ровно в третьем измерении. | Formula ikki qadamda chiqariladi, va ikkinchi qadam yon qirraning perpendikulyarligiga tayanadi. Shuning uchun uni og'ma parallelepipedga qo'llash mumkin emas. O'zingizni oddiy usulda tekshiring. Qirrasi bir bo'lgan kubda yoq diagonali ikkidan ildiz, jism diagonali esa uchdan ildiz. Sonlar boshqa, va farq aynan uchinchi o'lchamda. | The formula is derived in two steps, and the second step rests on the perpendicularity of the lateral edge. That is why it cannot be applied to a slanted parallelepiped. Check yourself in a simple way. In a cube with edge one the face diagonal is the root of two and the body diagonal is the root of three. The numbers differ, and the difference is exactly the third dimension. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `d² = a² + b² + c²` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `diagonal-grani-i-tela`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Назови каждый отрезок | Har bir kesmani nomlang | Name each segment |
| `match.prompt` | Соедини запись с названием | Yozuvni nomi bilan birlashtiring | Match the reading with the name |
| `match.ok` | Все четыре на месте. Диагонали больше не путаются. | To'rttasi ham joyida. Diagonallar endi aralashmaydi. | All four in place. The diagonals no longer get mixed up. |
| `audio.mount` | Четыре записи и четыре названия. Соедини их. | To'rt yozuv va to'rt nom. Ularni birlashtiring. | Four readings and four names. Match them. |
| `match.a` | ребро основания | asos qirrasi | a base edge |
| `match.b` | боковое ребро | yon qirra | a lateral edge |
| `match.c` | диагональ основания | asos diagonali | a base diagonal |
| `match.d` | диагональ тела | jism diagonali | the body diagonal |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `AB` · `AA₁` · `AC` · `AC₁` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `diagonal-grani-i-tela`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Выведи формулу диагонали | Diagonal formulasini chiqaring | Derive the diagonal formula |
| `proof.given` | прямоугольный параллелепипед | to'g'ri burchakli parallelepiped | a rectangular box |
| `proof.goal` | диагональ через три измерения | diagonal uch o'lcham bo'yicha | the diagonal from three dimensions |
| `proof.r1` | диагональ основания по двум измерениям | asos diagonali ikki o'lcham bo'yicha | the base diagonal from two dimensions |
| `proof.r2` | ребро перпендикулярно этой диагонали | qirra shu diagonalga perpendikulyar | the edge is perpendicular to that diagonal |
| `proof.r3` | значит снова работает Пифагор | demak yana Pifagor ishlaydi | so Pythagoras works again |
| `proof.ok` | Доказано. Два шага Пифагора дают три измерения. | Isbotlandi. Ikki qadam Pifagor uch o'lcham beradi. | Proved. Two steps of Pythagoras give three dimensions. |
| `proof.e1` | Перпендикулярность идёт дальше. Сначала про основание. | Perpendikulyarlik keyin keladi. Avval asos haqida. | Perpendicularity comes later. First about the base. |
| `proof.e2` | В основании уже посчитано. Откуда прямой угол во втором треугольнике. | Asosda hisoblandi. Ikkinchi uchburchakda to'g'ri burchak qayerdan. | The base is done. Where does the right angle in the second triangle come from. |
| `proof.e3` | Прямой угол есть. Теперь считай гипотенузу. | To'g'ri burchak bor. Endi gipotenuzani hisoblang. | The right angle is there. Now compute the hypotenuse. |
| `reason.s1` | теорема Пифагора | Pifagor teoremasi | the Pythagorean theorem |
| `reason.s2` | перпендикуляр даёт прямой угол со всеми прямыми плоскости | perpendikulyar tekislikning barcha chiziqlari bilan to'g'ri burchak beradi | a perpendicular gives a right angle with all lines of the plane |
| `reason.s3` | свойство параллелограмма | parallelogramm xossasi | a property of a parallelogram |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AC₁² = AC² + CC₁²` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Двадцать шесть. Тридцать шесть плюс шестьдесят четыре плюс пятьсот семьдесят шесть. | Yigirma olti. O'ttiz olti qo'shuv oltmish to'rt qo'shuv besh yuz yetmish olti. | Twenty six. Thirty six plus sixty four plus five hundred seventy six. |
| `task.hint.1` | Возведи в квадрат каждое измерение. | Har o'lchamni kvadratga ko'taring. | Square each dimension. |
| `task.hint.2` | Сложи три квадрата и извлеки корень. | Uch kvadratni qo'shing va ildiz chiqaring. | Add the three squares and take the root. |
| `task.hint.3` | Шестьсот семьдесят шесть это двадцать шесть в квадрате. | Olti yuz yetmish olti yigirma oltining kvadrati. | Six hundred seventy six is twenty six squared. |
| `order.prompt` | Расставь записи в том порядке, в каком считают | Yozuvlarni hisoblash tartibida joylashtiring | Arrange the readings in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Сначала основание, потом тело. | Tartib to'g'ri. Avval asos, keyin jism. | The order is right. First the base, then the body. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как считают. | Endi yozuvlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the readings. Arrange them the way they are computed. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `6, 8, 24   →   d = ?` |
| `task.answer` | `26` |
| `order.items` | `AC₁` · `a, b, c` · `AC` · `AC₁²` |
| `order.answer` | `a, b, c  AC  AC₁²  AC₁` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Измерения выписаны верно. | O'lchamlar to'g'ri yozilgan. | The dimensions are written correctly. |
| `hint.r2` | Диагональ основания посчитана верно. | Asos diagonali to'g'ri hisoblangan. | The base diagonal is computed correctly. |
| `hint.r4` | Ответ получен из неверной строки выше. | Javob yuqoridagi xato qatordan olingan. | The answer comes from the wrong line above. |
| `proof` | Поверни тело: этот отрезок остался в грани, значит он не диагональ тела. | Jismni buring: bu kesma yoqda qoldi, demak u jism diagonali emas. | Rotate the body: this segment stayed in a face, so it is not the body diagonal. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Диагональю тела назвали диагональ основания. | Uchinchi. Jism diagonali deb asos diagonali aytilgan. | The third. The base diagonal was called the body diagonal. |
| `entry.hint.1` | Проверь, какой отрезок назван в каждой строке. | Har qatorda qaysi kesma aytilganini tekshiring. | Check which segment is named in each line. |
| `entry.hint.2` | Третье измерение в решении не появилось ни разу. | Uchinchi o'lcham yechimda biror marta ham paydo bo'lmadi. | The third dimension never appeared in the solution. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них подменяет диагональ. | To'rt qator, va ulardan biri diagonalni almashtiradi. | Four lines, and one of them substitutes the diagonal. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a = 3,   b = 4,   c = 12` |
| `row.r2` | `AC² = 9 + 16` |
| `row.r3` | `AC₁ = AC = 5` |
| `row.r4` | `d = 5` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Измерения два, три и шесть. Найди диагональ тела. | O'lchamlar ikki, uch va olti. Jism diagonalini toping. | The dimensions are two, three and six. Find the body diagonal. |
| `place.ok` | Семь. Четыре плюс девять плюс тридцать шесть это сорок девять. | Yetti. To'rt qo'shuv to'qqiz qo'shuv o'ttiz olti bu qirq to'qqiz. | Seven. Four plus nine plus thirty six is forty nine. |
| `place.wrong` | Сложи квадраты всех трёх измерений. | Uchala o'lcham kvadratlarini qo'shing. | Add the squares of all three dimensions. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно всегда | Nima doim to'g'ri | What is always true |
| `multi.d.hint` | Это диагональ грани, а не тела. | Bu yoq diagonali, jismning emas. | That is a face diagonal, not a body one. |
| `multi.e.hint` | Диагональ это не сумма измерений, а корень из суммы квадратов. | Diagonal o'lchamlar yig'indisi emas, kvadratlar yig'indisidan ildiz. | A diagonal is not the sum of the dimensions but the root of the sum of squares. |
| `multi.ok` | Три записи из пяти. Одна берёт два измерения, другая складывает вместо квадратов. | Beshtadan uch yozuv. Biri ikki o'lchamni oladi, ikkinchisi kvadratlar o'rniga qo'shadi. | Three readings out of five. One takes two dimensions, the other adds instead of squaring. |
| `audio.mount` | Прочитаем формулу справа налево. По измерениям назовём диагональ. | Formulani o'ngdan chapga o'qiymiz. O'lchamlar bo'yicha diagonalni aytamiz. | Let us read the formula from right to left. From the dimensions we name the diagonal. |
| `audio.work` | Отметь все записи, которые верны всегда. Их больше одной. | Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are always true. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `7` |
| `place.step` | `4 + 9 + 36 = 49` |
| `multi.a` [верно] | `d² = a² + b² + c²` |
| `multi.b` [верно] | `AC² = a² + b²` |
| `multi.c` [верно] | `a = b = c` |
| `multi.d` | `d² = a² + b²` |
| `multi.e` | `d = a + b + c` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `diagonal-grani-i-tela`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что в основании параллелепипеда? | Parallelepipedning asosida nima? | What is in the base of a parallelepiped? |
| `q1.a` [верно] | параллелограмм | parallelogramm | a parallelogram |
| `q1.b` | любой многоугольник | istalgan ko'pburchak | any polygon |
| `q1.b.hint` | Любой многоугольник это призма вообще. | Istalgan ko'pburchak umuman prizma. | Any polygon is a prism in general. |
| `q1.c` | прямоугольник | to'g'ri to'rtburchak | a rectangle |
| `q1.c.hint` | Прямоугольник только у прямоугольного. | To'g'ri to'rtburchak faqat to'g'ri burchaklida. | A rectangle only in the rectangular one. |
| `q1.d` | квадрат | kvadrat | a square |
| `q1.d.hint` | Квадрат бывает у куба. | Kvadrat kubda bo'ladi. | A square happens in a cube. |
| `q2.prompt` | Сколько измерений у прямоугольного параллелепипеда? | To'g'ri burchakli parallelepipedning nechta o'lchami bor? | How many dimensions does a rectangular box have? |
| `q2.a` [верно] | три | uchta | three |
| `q2.b` | два | ikkita | two |
| `q2.b.hint` | Два измерения у плоской фигуры. | Ikki o'lcham yassi shaklda. | Two dimensions belong to a flat figure. |
| `q2.c` | шесть | oltita | six |
| `q2.c.hint` | Шесть это число граней. | Olti yoqlar soni. | Six is the number of faces. |
| `q2.d` | двенадцать | o'n ikkita | twelve |
| `q2.d.hint` | Двенадцать это число рёбер. | O'n ikki qirralar soni. | Twelve is the number of edges. |
| `q3.prompt` | В кубе с ребром один диагональ тела? | Qirrasi bir bo'lgan kubda jism diagonali? | In a cube with edge one, the body diagonal? |
| `q3.a` [верно] | корень из трёх | uchdan ildiz | the root of three |
| `q3.b` | корень из двух | ikkidan ildiz | the root of two |
| `q3.b.hint` | Корень из двух это диагональ грани. | Ikkidan ildiz yoq diagonali. | The root of two is the face diagonal. |
| `q3.c` | один | bir | one |
| `q3.c.hint` | Один это ребро. | Bir qirra. | One is the edge. |
| `q3.d` | три | uch | three |
| `q3.d.hint` | Три это сумма квадратов, а не диагональ. | Uch kvadratlar yig'indisi, diagonal emas. | Three is the sum of squares, not the diagonal. |
| `q4.prompt` | Куб это что? | Kub nima? | What is a cube? |
| `q4.a` [верно] | прямоугольный параллелепипед с равными измерениями | o'lchamlari teng to'g'ri burchakli parallelepiped | a rectangular box with equal dimensions |
| `q4.b` | отдельная фигура | alohida shakl | a separate figure |
| `q4.b.hint` | Куб частный случай, а не новая фигура. | Kub xususiy hol, yangi shakl emas. | A cube is a special case, not a new figure. |
| `q4.c` | любой параллелепипед | istalgan parallelepiped | any parallelepiped |
| `q4.c.hint` | У любого нет ни прямых углов, ни равных рёбер. | Istalganida na to'g'ri burchak, na teng qirra bor. | Any one has neither right angles nor equal edges. |
| `q4.d` | правильная призма | muntazam prizma | a regular prism |
| `q4.d.hint` | Правильная призма может быть и шестиугольной. | Muntazam prizma oltiburchakli ham bo'ladi. | A regular prism can be hexagonal too. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `ABCD = ▱` |
| `q2.done` | `a, b, c` |
| `q3.done` | `d = √3` |
| `q4.done` | `a = b = c` |
| `angles` | `AB` · `AA₁` · `AC` · `AC₁` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Знаю, что параллелепипед это призма с параллелограммом в основании | Parallelepiped asosi parallelogramm bo'lgan prizma ekanini bilaman | I know a parallelepiped is a prism with a parallelogram base |
| `can.2` | Отличаю прямой от прямоугольного | To'g'rini to'g'ri burchaklidan ajrataman | I tell a right one from a rectangular one |
| `can.3` | Отличаю диагональ грани от диагонали тела | Yoq diagonalini jism diagonalidan ajrataman | I tell a face diagonal from a body diagonal |
| `can.4` | Считаю диагональ по трём измерениям | Diagonalni uch o'lcham bo'yicha hisoblayman | I compute the diagonal from three dimensions |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше пирамида — тело, у которого все боковые грани сходятся в одной вершине | Bundan keyin piramida, barcha yon yoqlari bitta uchda tutashadigan jism | Next comes the pyramid, a body whose lateral faces all meet at one vertex |
| `lifehack` | Считаешь диагональ — сначала спроси, в грани она или внутри тела | Diagonalni hisoblayotgan bo'lsangiz, avval u yoqdami yoki jism ichida ekanini so'rang | Computing a diagonal, first ask whether it is in a face or inside the body |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страница сорок пять | Geometriya, qirq beshinchi bet | Geometry, page forty five |
| `audio.mount` | Урок начался с двух записей про диагональ. В первой было два измерения. | Dars diagonal haqida ikki yozuv bilan boshlandi. Birinchisida ikki o'lcham bor edi. | The lesson began with two readings about the diagonal. The first had two dimensions. |
| `audio.next` | Два измерения дают диагональ грани, и она действительно есть на чертеже, просто это другой отрезок. Диагональ тела не лежит ни в одной грани, поэтому в неё входят все три измерения. Формула выведена двумя шагами Пифагора, и второй шаг работает только потому, что боковое ребро перпендикулярно основанию. Дальше пирамида, и там боковые грани сходятся в одной вершине. | Ikki o'lcham yoq diagonalini beradi, va u chizmada haqiqatan bor, shunchaki bu boshqa kesma. Jism diagonali birorta yoqda yotmaydi, shuning uchun unga uchala o'lcham kiradi. Formula ikki qadam Pifagor bilan chiqarilgan, va ikkinchi qadam faqat yon qirra asosga perpendikulyar bo'lgani uchun ishlaydi. Keyin piramida, va u yerda yon yoqlar bitta uchda tutashadi. | Two dimensions give a face diagonal, and it really is on the drawing, it is just a different segment. The body diagonal lies in no face, so all three dimensions enter it. The formula is derived in two steps of Pythagoras, and the second step works only because the lateral edge is perpendicular to the base. Next comes the pyramid, where the lateral faces meet at one vertex. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `d² = a² + b²` |
| `hook.b` | `d² = a² + b² + c²` |
| `proved` | `d² = a² + b² + c²` |
| `law` | `AA₁ ⊥ ABCD` |
| `sheet.1` | `ABCD = ▱` |
| `sheet.2` | `AA₁ ⊥ ABCD` |
| `sheet.3` | `AC² = a² + b²` |
| `sheet.4` | `d² = a² + b² + c²` |
| `sheet.5` | `a = b = c` |
