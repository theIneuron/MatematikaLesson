# Урок 54 — Уравнение плоскости · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS53_KONTENT.md`.

Скелет: в переписке 2026-08-21. **Опоры в учебнике 10 класса нет.** Источник истины — план. Блок
читается как ПЕРВЫЙ проход: угол между плоскостями и расстояния в пространстве остаются 11 классу,
поэтому здесь их нет.

**Главное решение урока.** Ошибка года `koeffitsiyent-nuqta-emas`: тройку коэффициентов уравнения
принимают за точку плоскости. Свидетель: нормаль рисуется стрелкой и при любом повороте остаётся
перпендикулярной плоскости, а точка с теми же координатами в плоскость не попадает — подстановка
даёт не ноль.

**Числа урока целые намеренно.** Плоскость `x + 2y + 2z − 6 = 0`. Нормаль один два два, её длина
три. Плоскость пересекает оси в шести, трёх и трёх, и все три точки проверяются подстановкой в
одну строку. Подстановка точки один два два даёт три, то есть точка от плоскости отстоит.
Плоскость через точку один один один с той же нормалью даёт свободный член пять. На бумаге:
нормаль два один два, точка два два два, сумма произведений десять.

**Второй результат урока, кроме тега.** Одна и та же плоскость имеет много уравнений: умножь все
коэффициенты на любое число, кроме нуля, и плоскость не изменится. Это же снимает вопрос
единственности нормали.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`tekislik tenglamasi`, `normal`, `koeffitsiyent`, `ozod had`, `almashtirib qo'yish`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЛОСКОСТЬ | TEKISLIK | THE PLANE |
| `title` | Что за тройка в уравнении | Tenglamadagi uchlik nima | What the triple in the equation is |
| `row.a.name` | точка плоскости | tekislikning nuqtasi | a point of the plane |
| `row.b.name` | нормаль плоскости | tekislikning normali | a normal of the plane |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим подстановкой. | Javobingiz yozib olindi. Endi almashtirib qo'yib tekshiramiz. | Your answer is recorded. Now we check by substitution. |
| `audio.mount` | Уравнение плоскости, и в нём три коэффициента: один, два и два. | Tekislik tenglamasi, va unda uch koeffitsiyent: bir, ikki va ikki. | The equation of a plane, and in it three coefficients: one, two and two. |
| `audio.r1` | Первая запись говорит, что это точка плоскости. | Birinchi yozuv bu tekislikning nuqtasi deydi. | The first reading says it is a point of the plane. |
| `audio.r2` | Вторая говорит, что это нормаль. | Ikkinchisi bu normal deydi. | The second says it is a normal. |
| `audio.ask` | Тройка чисел выглядит как адрес точки, и это сбивает. Как думаешь, какая запись верная? | Uch son nuqtaning manzili kabi ko'rinadi, va bu chalkashtiradi. Sizningcha qaysi yozuv to'g'ri? | The triple of numbers looks like the address of a point, and that misleads. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `x + 2y + 2z − 6 = 0` |
| `row.a.value` | `M (1; 2; 2)` |
| `row.b.value` | `n (1; 2; 2)` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из блока | Blokdan uch savol | Three questions from the block |
| `q1.prompt` | Как проверить, лежит ли точка на линии или плоскости? | Nuqta chiziqda yoki tekislikda yotganini qanday tekshiriladi? | How do you check whether a point lies on a line or a plane? |
| `q1.a` [верно] | подставить её числа в уравнение | uning sonlarini tenglamaga qo'yib ko'rish | substitute its numbers into the equation |
| `q1.b` | посмотреть на чертёж | chizmaga qarash | look at the drawing |
| `q1.b.hint` | Чертёж показывает один ракурс из многих. | Chizma ko'p rakursdan bittasini ko'rsatadi. | A drawing shows one view out of many. |
| `q1.c` | сравнить длины | uzunliklarni taqqoslash | compare the lengths |
| `q1.c.hint` | Длина про принадлежность ничего не говорит. | Uzunlik tegishlilik haqida hech narsa aytmaydi. | A length says nothing about belonging. |
| `q1.d` | проверить знак чисел | sonlarning ishorasini tekshirish | check the sign of the numbers |
| `q1.d.hint` | Знак сам по себе ничего не решает. | Ishora o'zi hech narsani hal qilmaydi. | A sign by itself decides nothing. |
| `q2.prompt` | Что означает нулевое скалярное произведение? | Nol skalyar ko'paytma nimani bildiradi? | What does a zero dot product mean? |
| `q2.a` [верно] | перпендикулярность ненулевых векторов | nolmas vektorlarning perpendikulyarligi | the perpendicularity of non zero vectors |
| `q2.b` | равенство векторов | vektorlarning tengligi | the equality of the vectors |
| `q2.b.hint` | У равных произведение это квадрат длины. | Tenglarda ko'paytma uzunlik kvadrati. | For equal vectors the product is the square of the length. |
| `q2.c` | что оба вектора нулевые | ikki vektor ham nol ekanini | that both vectors are zero |
| `q2.c.hint` | Ноль выходит и у ненулевых. | Nol nolmaslarda ham chiqadi. | Zero comes out for non zero vectors too. |
| `q2.d` | тупой угол | o'tmas burchak | an obtuse angle |
| `q2.d.hint` | У тупого произведение отрицательное. | O'tmasda ko'paytma manfiy. | For an obtuse angle the product is negative. |
| `q3.prompt` | Чему равна длина тройки один два два? | Bir ikki ikki uchligining uzunligi qancha? | What is the length of the triple one two two? |
| `q3.a` [верно] | трём | uchga | three |
| `q3.b` | пяти | beshga | five |
| `q3.b.hint` | Пять это сумма трёх чисел. | Besh uch sonning yig'indisi. | Five is the sum of the three numbers. |
| `q3.c` | девяти | to'qqizga | nine |
| `q3.c.hint` | Девять стоит под корнем. | To'qqiz ildiz ostida turadi. | Nine stands under the root. |
| `q3.d` | двум | ikkiga | two |
| `q3.d.hint` | Два это наибольшее из чисел. | Ikki sonlarning eng kattasi. | Two is the largest of the numbers. |
| `audio.mount` | Три вопроса. Правило урока соберётся из первого и второго. | Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi. | Three questions. The rule of the lesson will be assembled from the first and the second. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `x + 2y + 2z − 6 = 0` |
| `q2.done` | `n·v = 0` |
| `q3.done` | `\|n\| = 3` |

---

## Экран 3 · `explain1` · ответ `number` · тег `koeffitsiyent-nuqta-emas`

Подстановка: одна строка вместо чертежа.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Проверка идёт подстановкой | Tekshiruv almashtirib qo'yish bilan boradi | The check goes by substitution |
| `show.1.1` | плоскость пересекает оси | tekislik o'qlarni kesadi | the plane cuts the axes |
| `show.1.2` | в шести, трёх и трёх | oltida, uchda va uchda | at six, three and three |
| `show.2.1` | подставляем каждую точку | har nuqtani qo'yib ko'ramiz | we substitute each point |
| `show.2.2` | и получаем ноль | va nol olamiz | and get zero |
| `audio.mount` | Плоскость задана уравнением. Найдём точки, где она пересекает оси. | Tekislik tenglama bilan berilgan. U o'qlarni kesadigan nuqtalarni topamiz. | The plane is given by an equation. Let us find the points where it cuts the axes. |
| `audio.move*` | На первой оси два других числа нули, остаётся икс минус шесть равно нулю, то есть шесть. На второй оси два игрек минус шесть равно нулю, то есть три. На третьей так же три. Вот и три точки плоскости, и все три найдены без чертежа. Проверка принадлежности всегда одна и та же: подставить три числа точки в левую часть и посмотреть, вышел ли ноль. Если ноль, точка лежит в плоскости. Если не ноль, не лежит, и величина отклонения тем больше, чем дальше точка. Обрати внимание, что уравнение при этом ничего не говорит про порядок обхода или про форму: плоскость бесконечна, и уравнение описывает её целиком. | Birinchi o'qda boshqa ikki son nol, iks minus olti nolga teng bo'lib qoladi, ya'ni olti. Ikkinchi o'qda ikki igrek minus olti nolga teng, ya'ni uch. Uchinchisida ham xuddi shunday uch. Ana tekislikning uch nuqtasi, va uchtasi ham chizmasiz topildi. Tegishlilik tekshiruvi har doim bir xil: nuqtaning uch sonini chap tomonga qo'yib, nol chiqdimi deb qarash. Nol bo'lsa, nuqta tekislikda yotadi. Nol bo'lmasa, yotmaydi, va nuqta uzoqroq bo'lgani sari chetlanish kattaroq. E'tibor bering, tenglama bunda aylanib o'tish tartibi yoki shakl haqida hech narsa aytmaydi: tekislik cheksiz, va tenglama uni butunligicha tasvirlaydi. | On the first axis the other two numbers are zero, x minus six equals zero remains, that is six. On the second axis two y minus six equals zero, that is three. On the third the same three. There are three points of the plane, and all three were found without a drawing. The check of belonging is always the same: substitute the three numbers of the point into the left side and see whether zero came out. If it is zero, the point lies in the plane. If not zero, it does not lie there, and the deviation is larger the farther the point is. Note that the equation says nothing about the order of traversal or about a shape: a plane is endless, and the equation describes it entirely. |
| `audio.work` | Посчитай сам. Сколько из трёх точек на осях лежат в плоскости? | O'zingiz hisoblang. O'qlardagi uch nuqtadan nechtasi tekislikda yotadi? | Work it out yourself. How many of the three points on the axes lie in the plane? |
| `work.prompt` | Сколько точек лежат в плоскости? | Nechta nuqta tekislikda yotadi? | How many points lie in the plane? |
| `work.ok` | Три. Подстановка у всех дала ноль. | Uchta. Almashtirib qo'yish uchtasida ham nol berdi. | Three. The substitution gave zero for all of them. |
| `work.hint.1` | Подставь каждую точку в левую часть. | Har nuqtani chap tomonga qo'yib ko'ring. | Substitute each point into the left side. |
| `work.hint.2` | Шесть минус шесть, шесть минус шесть, шесть минус шесть. | Olti minus olti, olti minus olti, olti minus olti. | Six minus six, six minus six, six minus six. |
| `work.hint.3` | Три. | Uchta. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `x + 2y + 2z − 6 = 0` |
| `work.answer` | `3` |

---

## Экран 4 · `explain2` · ответ `number` · тег `koeffitsiyent-nuqta-emas`

Свидетель: нормаль это стрелка, а не точка плоскости.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Тройка коэффициентов это стрелка | Koeffitsiyentlar uchligi strelka | The triple of coefficients is an arrow |
| `show.1.1` | нормаль нарисована стрелкой | normal strelka bilan chizilgan | the normal is drawn as an arrow |
| `show.1.2` | она перпендикулярна плоскости | u tekislikka perpendikulyar | it is perpendicular to the plane |
| `show.2.1` | поворот, и она держит прямой угол | burilish, va u to'g'ri burchakni saqlaydi | a turn, and it keeps the right angle |
| `show.2.2` | а точка один два два вне плоскости | bir ikki ikki nuqta esa tekislikdan tashqarida | and the point one two two is off the plane |
| `audio.mount` | Нарисую тройку коэффициентов двумя способами: как стрелку и как точку. | Koeffitsiyentlar uchligini ikki usulda chizaman: strelka va nuqta sifatida. | Let me draw the triple of coefficients in two ways: as an arrow and as a point. |
| `audio.move*` | Как стрелка она ведёт себя правильно: перпендикулярна плоскости, и поворот сцены этого не меняет ни в одном положении. А как точка она в плоскость не попадает. Проверим подстановкой: один плюс два умножить на два плюс два умножить на два минус шесть даёт три, а не ноль. Значит точка с этими координатами лежит вне плоскости, и никакой она точкой плоскости не является. Причина проста. В уравнении коэффициенты стоят множителями при иксе, игреке и зете, а не значениями этих букв. Множитель и значение это разные роли, и путать их нельзя, хотя на письме и то и другое выглядит как тройка чисел. | Strelka sifatida u to'g'ri tutadi: tekislikka perpendikulyar, va sahnaning burilishi buni birorta holatda ham o'zgartirmaydi. Nuqta sifatida esa u tekislikka tushmaydi. Almashtirib qo'yib tekshiramiz: bir qo'shuv ikki karra ikki qo'shuv ikki karra ikki minus olti uch beradi, nol emas. Demak bu koordinatalarga ega nuqta tekislikdan tashqarida yotadi, va u hech qanday tekislik nuqtasi emas. Sabab oddiy. Tenglamada koeffitsiyentlar iks, igrek va zet oldida ko'paytuvchi bo'lib turadi, bu harflarning qiymati bo'lib emas. Ko'paytuvchi va qiymat boshqa-boshqa rol, va ularni aralashtirish mumkin emas, garchi yozuvda ikkisi ham uch son kabi ko'rinsa. | As an arrow it behaves correctly: perpendicular to the plane, and turning the scene does not change that in any position. As a point it does not land in the plane. Let us check by substitution: one plus two times two plus two times two minus six gives three, not zero. So the point with these coordinates lies off the plane, and it is no point of the plane at all. The reason is simple. In the equation the coefficients stand as factors at x, y and z, not as the values of those letters. A factor and a value are different roles, and they must not be confused, even though in writing both look like a triple of numbers. |
| `audio.work` | Посчитай сам. Что даёт подстановка точки один два два? | O'zingiz hisoblang. Bir ikki ikki nuqtasini qo'yish nima beradi? | Work it out yourself. What does substituting the point one two two give? |
| `work.prompt` | Что даёт подстановка? | Almashtirib qo'yish nima beradi? | What does the substitution give? |
| `work.ok` | Три. Не ноль, значит точка вне плоскости. | Uch. Nol emas, demak nuqta tekislikdan tashqarida. | Three. Not zero, so the point is off the plane. |
| `work.hint.1` | Подставь один, два и два по местам. | Bir, ikki va ikkini o'z o'rniga qo'ying. | Substitute one, two and two in their places. |
| `work.hint.2` | Один плюс четыре плюс четыре минус шесть. | Bir qo'shuv to'rt qo'shuv to'rt minus olti. | One plus four plus four minus six. |
| `work.hint.3` | Три. | Uch. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `1 + 4 + 4 − 6 = 3` |
| `work.answer` | `3` |

---

## Экран 5 · `explain3` · ответ `number` · тег `koeffitsiyent-nuqta-emas`

Почему это нормаль: скалярное произведение с любым вектором плоскости.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Почему стрелка перпендикулярна | Strelka nega perpendikulyar | Why the arrow is perpendicular |
| `show.1.1` | две точки плоскости | tekislikning ikki nuqtasi | two points of the plane |
| `show.1.2` | вектор между ними лежит в плоскости | ular orasidagi vektor tekislikda yotadi | the vector between them lies in the plane |
| `show.2.1` | считаем произведение с нормалью | normal bilan ko'paytmani hisoblaymiz | we compute the product with the normal |
| `show.2.2` | выходит ноль при любой паре | ixtiyoriy juftda nol chiqadi | zero comes out for any pair |
| `audio.mount` | Возьму две точки плоскости и построю вектор между ними. Он лежит в плоскости. | Tekislikning ikki nuqtasini olib, ular orasida vektor yasayman. U tekislikda yotadi. | Let me take two points of the plane and build the vector between them. It lies in the plane. |
| `audio.move*` | Первая точка шесть нуль нуль, вторая нуль три нуль, вектор между ними минус шесть три нуль. Считаю скалярное произведение с тройкой коэффициентов: минус шесть на один даёт минус шесть, три на два даёт шесть, нуль на два даёт нуль. Сумма ноль. А ноль при ненулевых векторах означает прямой угол, это правило прошлого урока. Возьми любую другую пару точек плоскости, и произведение снова будет нулём: у обеих подстановка даёт ноль, и при вычитании свободный член сокращается. Значит тройка коэффициентов перпендикулярна каждому вектору плоскости, то есть перпендикулярна самой плоскости. Такой вектор и называется нормалью. | Birinchi nuqta olti nol nol, ikkinchisi nol uch nol, ular orasidagi vektor minus olti uch nol. Koeffitsiyentlar uchligi bilan skalyar ko'paytmani hisoblayman: minus olti karra bir minus olti beradi, uch karra ikki olti beradi, nol karra ikki nol beradi. Yig'indi nol. Nolmas vektorlarda nol esa to'g'ri burchakni bildiradi, bu o'tgan darsning qoidasi. Tekislikning ixtiyoriy boshqa juft nuqtasini oling, va ko'paytma yana nol bo'ladi: ikkisida ham almashtirib qo'yish nol beradi, va ayirishda ozod had qisqaradi. Demak koeffitsiyentlar uchligi tekislikning har vektoriga perpendikulyar, ya'ni tekislikning o'ziga perpendikulyar. Bunday vektor normal deb ataladi. | The first point is six zero zero, the second is zero three zero, the vector between them is minus six three zero. I compute the dot product with the triple of coefficients: minus six times one gives minus six, three times two gives six, zero times two gives zero. The sum is zero. And zero for non zero vectors means a right angle, that is the rule of the previous lesson. Take any other pair of points of the plane and the product will be zero again: the substitution gives zero for both, and in the subtraction the free term cancels. So the triple of coefficients is perpendicular to every vector of the plane, that is perpendicular to the plane itself. Such a vector is called a normal. |
| `audio.work` | Посчитай сам. Чему равно произведение нормали и вектора плоскости? | O'zingiz hisoblang. Normal va tekislik vektorining ko'paytmasi nimaga teng? | Work it out yourself. What does the product of the normal and a vector of the plane equal? |
| `work.prompt` | Произведение нормали и вектора плоскости? | Normal va tekislik vektorining ko'paytmasi? | The product of the normal and a vector of the plane? |
| `work.ok` | Ноль. Потому и перпендикулярна. | Nol. Shuning uchun perpendikulyar. | Zero. That is why it is perpendicular. |
| `work.hint.1` | Считай по осям, знаки учитывай. | O'qlar bo'yicha hisoblang, ishoralarni hisobga oling. | Compute along the axes, take the signs into account. |
| `work.hint.2` | Минус шесть плюс шесть плюс нуль. | Minus olti qo'shuv olti qo'shuv nol. | Minus six plus six plus zero. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `n·v = 0` |
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `koeffitsiyent-nuqta-emas`

Обратная задача: уравнение по точке и нормали.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Уравнение по точке и нормали | Nuqta va normal bo'yicha tenglama | An equation from a point and a normal |
| `show.1.1` | та же нормаль один два два | o'sha normal bir ikki ikki | the same normal one two two |
| `show.1.2` | но плоскость через точку один один один | lekin tekislik bir bir bir nuqta orqali | but the plane through the point one one one |
| `show.2.1` | коэффициенты берём из нормали | koeffitsiyentlarni normaldan olamiz | we take the coefficients from the normal |
| `show.2.2` | свободный член из подстановки | ozod hadni almashtirib qo'yishdan | the free term from the substitution |
| `audio.mount` | Нормаль оставлю ту же, а плоскость проведу через другую точку. | Normalni o'sha qoldiraman, tekislikni esa boshqa nuqta orqali o'tkazaman. | Let me keep the same normal and pass the plane through another point. |
| `audio.move*` | Новая плоскость параллельна старой, и это видно: нормаль у них одна, значит наклон одинаковый. Коэффициенты в уравнении берутся прямо из нормали, тут думать не о чем. Осталось найти свободный член, и он находится из условия, что данная точка лежит в плоскости. Подставляю один, один и один: один плюс два плюс два даёт пять. Значит левая часть без свободного члена даёт пять, и чтобы получился ноль, свободный член равен минус пяти. Уравнение готово. Отсюда общий приём: коэффициенты из нормали, свободный член из точки. И заметь, что нормаль задаёт только направление плоскости, а точка выбирает, какая именно из параллельных плоскостей нам нужна. | Yangi tekislik eskisiga parallel, va bu ko'rinadi: normali bitta, demak og'ishi bir xil. Tenglamadagi koeffitsiyentlar to'g'ridan to'g'ri normaldan olinadi, bu yerda o'ylaydigan narsa yo'q. Ozod hadni topish qoldi, va u berilgan nuqta tekislikda yotadi degan shartdan topiladi. Bir, bir va birni qo'yaman: bir qo'shuv ikki qo'shuv ikki besh beradi. Demak ozod hadsiz chap tomon besh beradi, va nol chiqishi uchun ozod had minus beshga teng. Tenglama tayyor. Shundan umumiy usul: koeffitsiyentlar normaldan, ozod had nuqtadan. Va e'tibor bering, normal faqat tekislikning yo'nalishini beradi, nuqta esa parallel tekisliklardan qaysi biri kerakligini tanlaydi. | The new plane is parallel to the old one, and that is visible: they have one normal, so the same tilt. The coefficients in the equation are taken straight from the normal, there is nothing to think about there. What remains is the free term, and it is found from the condition that the given point lies in the plane. I substitute one, one and one: one plus two plus two gives five. So the left side without the free term gives five, and for zero to come out the free term equals minus five. The equation is ready. Hence the general trick: the coefficients from the normal, the free term from the point. And note that the normal gives only the direction of the plane, while the point chooses which of the parallel planes we need. |
| `audio.work` | Посчитай сам. Что даёт подстановка точки один один один без свободного члена? | O'zingiz hisoblang. Bir bir bir nuqtasini ozod hadsiz qo'yish nima beradi? | Work it out yourself. What does substituting the point one one one give without the free term? |
| `work.prompt` | Что даёт подстановка? | Almashtirib qo'yish nima beradi? | What does the substitution give? |
| `work.ok` | Пять. Значит свободный член минус пять. | Besh. Demak ozod had minus besh. | Five. So the free term is minus five. |
| `work.hint.1` | Умножь каждое число нормали на единицу. | Normalning har sonini birga ko'paytiring. | Multiply each number of the normal by one. |
| `work.hint.2` | Один плюс два плюс два. | Bir qo'shuv ikki qo'shuv ikki. | One plus two plus two. |
| `work.hint.3` | Пять. | Besh. | Five. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `x + 2y + 2z − 5 = 0` |
| `work.answer` | `5` |

---

## Экран 7 · `explain5` · ответ `number` · тег `koeffitsiyent-nuqta-emas`

ГРАНИЦА: одна плоскость, много уравнений.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE CASE |
| `title` | Одна плоскость, много уравнений | Bitta tekislik, ko'p tenglama | One plane, many equations |
| `show.1.1` | первое уравнение | birinchi tenglama | the first equation |
| `show.1.2` | второе получено умножением на два | ikkinchisi ikkiga ko'paytirib olindi | the second was obtained by multiplying by two |
| `show.2.1` | плоскость на чертеже одна | chizmada tekislik bitta | on the drawing the plane is one |
| `show.2.2` | а нормаль стала вдвое длиннее | normal esa ikki barobar uzaydi | and the normal became twice as long |
| `audio.mount` | Умножу все коэффициенты уравнения на два и посмотрю, что станет с плоскостью. | Tenglamaning barcha koeffitsiyentlarini ikkiga ko'paytirib, tekislikka nima bo'lishini ko'raman. | Let me multiply all the coefficients of the equation by two and see what happens to the plane. |
| `audio.move*` | На чертеже не изменилось ничего. И правильно: если левая часть равнялась нулю, то удвоенная левая часть тоже равна нулю, а значит все точки остались на месте. Проверить можно подстановкой любой точки: шесть нуль нуль по-прежнему даёт ноль. Что изменилось, так это длина нормали, она стала вдвое больше. Но направление у неё то же, а плоскости важно только направление. Отсюда важное следствие для задач: нормаль не единственная, их бесконечно много, и все они коллинеарны. И обратное следствие тоже полезно: если два уравнения отличаются только общим множителем, это одна и та же плоскость, а не две параллельные. | Chizmada hech narsa o'zgarmadi. To'g'ri ham: chap tomon nolga teng bo'lgan bo'lsa, ikkilangan chap tomon ham nolga teng, demak barcha nuqtalar joyida qoldi. Ixtiyoriy nuqtani qo'yib tekshirish mumkin: olti nol nol avvalgidek nol beradi. O'zgargan narsa normalning uzunligi, u ikki barobar kattalashdi. Lekin yo'nalishi o'sha, tekislikka esa faqat yo'nalish muhim. Shundan masalalar uchun muhim natija: normal yakka emas, ular cheksiz ko'p, va hammasi kollinear. Teskari natija ham foydali: agar ikki tenglama faqat umumiy ko'paytuvchi bilan farq qilsa, bu bitta va o'sha tekislik, ikki parallel emas. | Nothing changed on the drawing. And rightly so: if the left side equalled zero, then twice the left side also equals zero, so all the points stayed where they were. It can be checked by substituting any point: six zero zero still gives zero. What did change is the length of the normal, it became twice as large. But its direction is the same, and only the direction matters to a plane. Hence an important consequence for problems: the normal is not unique, there are infinitely many of them, and all are collinear. And the converse consequence is useful too: if two equations differ only by a common factor, it is one and the same plane and not two parallel ones. |
| `audio.work` | Посчитай сам. Сколько разных плоскостей задают эти два уравнения? | O'zingiz hisoblang. Bu ikki tenglama nechta xil tekislikni aniqlaydi? | Work it out yourself. How many different planes do these two equations define? |
| `work.prompt` | Сколько разных плоскостей? | Nechta xil tekislik? | How many different planes? |
| `work.ok` | Одна. Общий множитель плоскость не меняет. | Bitta. Umumiy ko'paytuvchi tekislikni o'zgartirmaydi. | One. A common factor does not change the plane. |
| `work.hint.1` | Подставь точку в оба уравнения. | Nuqtani ikki tenglamaga ham qo'ying. | Substitute a point into both equations. |
| `work.hint.2` | Оба дали ноль. | Ikkisi ham nol berdi. | Both gave zero. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `2x + 4y + 4z − 12 = 0` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `koeffitsiyent-nuqta-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Что читается из уравнения | Tenglamadan nima o'qiladi | What is read from the equation |
| `probe.question` | Чем является тройка коэффициентов? | Koeffitsiyentlar uchligi nima? | What is the triple of coefficients? |
| `probe.a` [верно] | нормалью плоскости | tekislikning normali | a normal of the plane |
| `probe.b` | точкой плоскости | tekislikning nuqtasi | a point of the plane |
| `probe.b.hint` | Подстановка этой тройки нуля не даёт. | Bu uchlikni qo'yish nol bermaydi. | Substituting that triple does not give zero. |
| `rule.lawLabel` | Уравнение плоскости | Tekislik tenglamasi | The equation of a plane |
| `rule.lines.1` | тройка коэффициентов это нормаль, а не точка | koeffitsiyentlar uchligi normal, nuqta emas | the triple of coefficients is a normal, not a point |
| `rule.lines.2` | точка лежит в плоскости, если подстановка даёт ноль | almashtirib qo'yish nol bersa, nuqta tekislikda yotadi | a point lies in the plane if the substitution gives zero |
| `rule.lines.3` | общий множитель плоскость не меняет | umumiy ko'paytuvchi tekislikni o'zgartirmaydi | a common factor does not change the plane |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Первая строка это ошибка года, и она стоит первой не случайно: тройка чисел в уравнении и тройка чисел точки выглядят одинаково, а роли у них разные. Коэффициент это множитель при букве, а координата это значение буквы. Вторая строка даёт единственный способ проверки, и он не требует чертежа: подставил, посмотрел на ноль. Третья строка снимает вопрос, который иначе мешает: уравнений у плоскости много, и нормалей тоже много, но направление у всех нормалей одно. Полезный порядок работы: сначала выпиши нормаль, потом найди свободный член по точке. | Birinchi satr yilning xatosi, va u bejiz birinchi turmagan: tenglamadagi uch son va nuqtaning uch soni bir xil ko'rinadi, rollari esa boshqa. Koeffitsiyent harf oldidagi ko'paytuvchi, koordinata esa harfning qiymati. Ikkinchi satr tekshirishning yagona usulini beradi, va u chizma talab qilmaydi: qo'ydingiz, nolga qaradingiz. Uchinchi satr aks holda xalaqit beradigan savolni oladi: tekislikning tenglamalari ko'p, normallari ham ko'p, lekin barcha normallarning yo'nalishi bitta. Foydali ish tartibi: avval normalni yozib oling, keyin nuqta bo'yicha ozod hadni toping. | The first line is the year's mistake, and it stands first for a reason: the triple of numbers in the equation and the triple of numbers of a point look the same, while their roles differ. A coefficient is a factor at a letter, a coordinate is the value of a letter. The second line gives the only way to check, and it needs no drawing: you substituted, you looked for zero. The third line removes a question that otherwise gets in the way: a plane has many equations and many normals, but all the normals have one direction. A useful order of work: first write out the normal, then find the free term from the point. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `ax + by + cz + d = 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `koeffitsiyent-nuqta-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Где эта точка | Bu nuqta qayerda | Where this point is |
| `match.prompt` | Соедини точку с местом | Nuqtani joy bilan birlashtiring | Match the point with the place |
| `match.ok` | Все четыре на месте. Проверка одна: подстановка. | To'rttasi ham joyida. Tekshiruv bitta: almashtirib qo'yish. | All four in place. The check is one: substitution. |
| `audio.mount` | Четыре точки и четыре места. Подставляй в уравнение. | To'rt nuqta va to'rt joy. Tenglamaga qo'yib ko'ring. | Four points and four places. Substitute into the equation. |
| `match.a` | на первой оси | birinchi o'qda | on the first axis |
| `match.b` | на второй оси | ikkinchi o'qda | on the second axis |
| `match.c` | на третьей оси | uchinchi o'qda | on the third axis |
| `match.d` | вне плоскости | tekislikdan tashqarida | off the plane |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `(6; 0; 0)` · `(0; 3; 0)` · `(0; 0; 3)` · `(1; 2; 2)` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `koeffitsiyent-nuqta-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи, что тройка это нормаль | Uchlik normal ekanini isbotlang | Prove the triple is a normal |
| `proof.given` | две точки плоскости и тройка коэффициентов | tekislikning ikki nuqtasi va koeffitsiyentlar uchligi | two points of the plane and the triple of coefficients |
| `proof.goal` | тройка перпендикулярна плоскости | uchlik tekislikka perpendikulyar | the triple is perpendicular to the plane |
| `proof.r1` | у обеих точек подстановка даёт ноль | ikki nuqtada ham almashtirib qo'yish nol beradi | for both points the substitution gives zero |
| `proof.r2` | при вычитании свободный член сократился | ayirishda ozod had qisqardi | in the subtraction the free term cancelled |
| `proof.r3` | значит произведение с вектором плоскости ноль | demak tekislik vektori bilan ko'paytma nol | so the product with a vector of the plane is zero |
| `proof.ok` | Доказано. Ноль означает прямой угол, значит это нормаль. | Isbotlandi. Nol to'g'ri burchakni bildiradi, demak bu normal. | Proved. Zero means a right angle, so it is a normal. |
| `proof.e1` | Про вычитание дальше. Сначала про сами точки. | Ayirish haqida keyin. Avval nuqtalarning o'zi haqida. | The subtraction comes later. First about the points themselves. |
| `proof.e2` | Точки разобраны. Что даёт вычитание. | Nuqtalar ko'rildi. Ayirish nima beradi. | The points are done. What the subtraction gives. |
| `proof.e3` | Свободный член ушёл. Теперь вывод. | Ozod had ketdi. Endi xulosa. | The free term is gone. Now the conclusion. |
| `reason.s1` | точка лежит в плоскости по условию | nuqta shart bo'yicha tekislikda yotadi | the point lies in the plane by the condition |
| `reason.s2` | вектор плоскости это разность точек | tekislik vektori nuqtalar ayirmasi | a vector of the plane is the difference of the points |
| `reason.s3` | признак перпендикулярности через ноль | nol orqali perpendikulyarlik alomati | the criterion of perpendicularity through zero |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `n·v = 0` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Десять. Четыре плюс два плюс четыре. | O'n. To'rt qo'shuv ikki qo'shuv to'rt. | Ten. Four plus two plus four. |
| `task.hint.1` | Коэффициенты возьми из нормали. | Koeffitsiyentlarni normaldan oling. | Take the coefficients from the normal. |
| `task.hint.2` | Подставь два, два и два. | Ikki, ikki va ikkini qo'ying. | Substitute two, two and two. |
| `task.hint.3` | Четыре плюс два плюс четыре. | To'rt qo'shuv ikki qo'shuv to'rt. | Four plus two plus four. |
| `order.prompt` | Расставь шаги в том порядке, в каком составляют уравнение | Qadamlarni tenglama tuzish tartibida joylashtiring | Arrange the steps in the order the equation is composed |
| `order.title` | Порядок составления | Tuzish tartibi | The order of composing |
| `order.ok` | Порядок верный. Нормаль, коэффициенты, подстановка, свободный член. | Tartib to'g'ri. Normal, koeffitsiyentlar, almashtirib qo'yish, ozod had. | The order is right. The normal, the coefficients, the substitution, the free term. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Составляем уравнение на бумаге. | Asbob olib qo'yildi. Tenglamani qog'ozda tuzamiz. | The tool is put away. We compose the equation on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как составляют. | Endi qadamlar tartibi. Ularni qanday tuzilsa, shunday joylashtiring. | Now the order of the steps. Arrange them the way the composing goes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `n (2; 1; 2),   M (2; 2; 2),   n·M = ?` |
| `task.answer` | `10` |
| `order.items` | `d` · `n` · `a, b, c` · `n·M` |
| `order.answer` | `n  a, b, c  n·M  d` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Уравнение выписано верно. | Tenglama to'g'ri yozilgan. | The equation is written correctly. |
| `hint.r2` | Нормаль прочитана верно. | Normal to'g'ri o'qilgan. | The normal is read correctly. |
| `hint.r4` | Строка получена из неверной строки выше. | Qator yuqoridagi xato qatordan olingan. | The line comes from the wrong line above. |
| `proof` | Поверни сцену: стрелка держит прямой угол, а точка с теми же числами в плоскость не попадает. | Sahnani buring: strelka to'g'ri burchakni saqlaydi, o'sha sonlarga ega nuqta esa tekislikka tushmaydi. | Rotate the scene: the arrow keeps the right angle, and the point with the same numbers does not land in the plane. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Нормаль объявили точкой плоскости. | Uchinchi. Normal tekislikning nuqtasi deb aytilgan. | The third. The normal was declared a point of the plane. |
| `entry.hint.1` | Проверь третью строку подстановкой. | Uchinchi qatorni almashtirib qo'yib tekshiring. | Check the third line by substitution. |
| `entry.hint.2` | Подстановка даёт три, а не ноль. | Almashtirib qo'yish uch beradi, nol emas. | The substitution gives three, not zero. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них меняет роль тройки. | To'rt qator, va ulardan biri uchlikning rolini o'zgartiradi. | Four lines, and one of them changes the role of the triple. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `x + 2y + 2z − 6 = 0` |
| `row.r2` | `n (1; 2; 2)` |
| `row.r3` | `M (1; 2; 2) ∈ α` |
| `row.r4` | `1 + 4 + 4 − 6 = 0` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Дано уравнение плоскости два икс плюс игрек плюс два зет минус десять равно нулю. Каково третье число её нормали? | Ikki iks qo'shuv igrek qo'shuv ikki zet minus o'n nolga teng degan tekislik tenglamasi berilgan. Uning normalining uchinchi soni qanday? | The equation two x plus y plus two z minus ten equals zero is given. What is the third number of its normal? |
| `place.ok` | Два. Коэффициент при третьей букве. | Ikki. Uchinchi harf oldidagi koeffitsiyent. | Two. The coefficient at the third letter. |
| `place.wrong` | Нормаль это коэффициенты, свободный член в неё не входит. | Normal koeffitsiyentlar, ozod had unga kirmaydi. | A normal is the coefficients, the free term is not part of it. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для этой плоскости | Bu tekislik uchun nima to'g'ri | What is true for this plane |
| `multi.d.hint` | Подстановка этой точки нуля не даёт. | Bu nuqtani qo'yish nol bermaydi. | Substituting that point does not give zero. |
| `multi.e.hint` | Свободный член в нормаль не входит. | Ozod had normalga kirmaydi. | The free term is not part of the normal. |
| `multi.ok` | Три записи из пяти. Две оставшиеся путают роли чисел. | Beshtadan uch yozuv. Qolgan ikkitasi sonlarning rolini aralashtiradi. | Three readings out of five. The other two confuse the roles of the numbers. |
| `audio.mount` | Прочитаем урок справа налево. Дано уравнение, найти надо нормаль. | Darsni o'ngdan chapga o'qiymiz. Tenglama berilgan, normalni topish kerak. | Let us read the lesson from right to left. The equation is given, the normal is to be found. |
| `audio.work` | Отметь все записи, которые верны. Их больше одной. | To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are correct. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `2` |
| `place.step` | `2x + y + 2z − 10 = 0` |
| `multi.a` [верно] | `n (1; 2; 2)` |
| `multi.b` [верно] | `M (6; 0; 0) ∈ α` |
| `multi.c` [верно] | `\|n\| = 3` |
| `multi.d` | `M (1; 2; 2) ∈ α` |
| `multi.e` | `n (1; 2; 2; −6)` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `koeffitsiyent-nuqta-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Чем является тройка коэффициентов? | Koeffitsiyentlar uchligi nima? | What is the triple of coefficients? |
| `q1.a` [верно] | нормалью | normal | a normal |
| `q1.b` | точкой плоскости | tekislikning nuqtasi | a point of the plane |
| `q1.b.hint` | Подстановка этой тройки нуля не даёт. | Bu uchlikni qo'yish nol bermaydi. | Substituting that triple does not give zero. |
| `q1.c` | вектором в плоскости | tekislikdagi vektor | a vector in the plane |
| `q1.c.hint` | С векторами плоскости она даёт ноль. | Tekislik vektorlari bilan u nol beradi. | With vectors of the plane it gives zero. |
| `q1.d` | свободным членом | ozod had | the free term |
| `q1.d.hint` | Свободный член стоит отдельно, без буквы. | Ozod had alohida, harfsiz turadi. | The free term stands separately, without a letter. |
| `q2.prompt` | Как проверить, лежит ли точка в плоскости? | Nuqta tekislikda yotganini qanday tekshiriladi? | How do you check whether a point lies in the plane? |
| `q2.a` [верно] | подставить и получить ноль | qo'yib ko'rib, nol olish | substitute and get zero |
| `q2.b` | сравнить с нормалью | normal bilan taqqoslash | compare with the normal |
| `q2.b.hint` | Нормаль это направление, а не место. | Normal yo'nalish, joy emas. | A normal is a direction, not a place. |
| `q2.c` | посмотреть на чертёж | chizmaga qarash | look at the drawing |
| `q2.c.hint` | Чертёж показывает один ракурс. | Chizma bitta rakursni ko'rsatadi. | A drawing shows one view. |
| `q2.d` | посчитать длину | uzunlikni hisoblash | compute the length |
| `q2.d.hint` | Длина про принадлежность не говорит. | Uzunlik tegishlilik haqida aytmaydi. | A length says nothing about belonging. |
| `q3.prompt` | Что будет, если умножить всё уравнение на три? | Butun tenglamani uchga ko'paytirsak nima bo'ladi? | What happens if the whole equation is multiplied by three? |
| `q3.a` [верно] | плоскость останется той же | tekislik o'sha bo'lib qoladi | the plane will stay the same |
| `q3.b` | плоскость сдвинется | tekislik siljiydi | the plane will shift |
| `q3.b.hint` | Все точки по-прежнему дают ноль. | Barcha nuqtalar avvalgidek nol beradi. | All the points still give zero. |
| `q3.c` | плоскость наклонится | tekislik og'adi | the plane will tilt |
| `q3.c.hint` | Направление нормали не изменилось. | Normalning yo'nalishi o'zgarmadi. | The direction of the normal did not change. |
| `q3.d` | плоскость исчезнет | tekislik yo'qoladi | the plane will disappear |
| `q3.d.hint` | Исчезла бы при умножении на нуль. | Nolga ko'paytirilganda yo'qolardi. | It would disappear when multiplied by zero. |
| `q4.prompt` | Откуда берётся свободный член? | Ozod had qayerdan olinadi? | Where does the free term come from? |
| `q4.a` [верно] | из подстановки данной точки | berilgan nuqtani qo'yishdan | from substituting the given point |
| `q4.b` | из длины нормали | normalning uzunligidan | from the length of the normal |
| `q4.b.hint` | Длина нормали в уравнение не входит. | Normalning uzunligi tenglamaga kirmaydi. | The length of the normal is not in the equation. |
| `q4.c` | из первого коэффициента | birinchi koeffitsiyentdan | from the first coefficient |
| `q4.c.hint` | Коэффициенты дают только направление. | Koeffitsiyentlar faqat yo'nalishni beradi. | The coefficients give only the direction. |
| `q4.d` | он всегда нуль | u har doim nol | it is always zero |
| `q4.d.hint` | Нуль означает плоскость через начало координат. | Nol koordinatalar boshi orqali o'tgan tekislikni bildiradi. | Zero means a plane through the origin. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `n (1; 2; 2)` |
| `q2.done` | `1 + 4 + 4 − 6 = 3` |
| `q3.done` | `2x + 4y + 4z − 12 = 0` |
| `q4.done` | `x + 2y + 2z − 5 = 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Читаю нормаль прямо из уравнения | Normalni tenglamadan to'g'ridan to'g'ri o'qiyman | I read the normal straight from the equation |
| `can.2` | Проверяю точку подстановкой | Nuqtani almashtirib qo'yib tekshiraman | I check a point by substitution |
| `can.3` | Составляю уравнение по точке и нормали | Nuqta va normal bo'yicha tenglama tuzaman | I compose an equation from a point and a normal |
| `can.4` | Узнаю одну плоскость в разных уравнениях | Bitta tekislikni turli tenglamalarda tanib olaman | I recognise one plane in different equations |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше задачи ДТМ — тот же год, но задача даётся сразу и без разбора | Bundan keyin DTM topshiriqlari, o'sha yil, lekin topshiriq darrov va razborsiz beriladi | Next come the DTM tasks: the same year, but a task is given at once and without a walkthrough |
| `lifehack` | Сначала выпиши нормаль, потом ищи свободный член | Avval normalni yozib oling, keyin ozod hadni qidiring | First write out the normal, then look for the free term |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Программа, блок восемь | Programma, sakkizinchi blok | The programme, block eight |
| `audio.mount` | Урок начался с вопроса, что за тройка стоит в уравнении. | Dars tenglamada qanday uchlik turgani haqidagi savol bilan boshlandi. | The lesson began with the question what triple stands in the equation. |
| `audio.next` | Это нормаль, а не точка, и различить их можно одной подстановкой: у точки плоскости выходит ноль, а у этой тройки вышло три. Роли разные: коэффициент это множитель при букве, координата это значение буквы, и на письме они выглядят одинаково. Почему тройка перпендикулярна плоскости, тоже видно из счёта: у любых двух точек плоскости подстановка даёт ноль, при вычитании свободный член сокращается, и произведение с вектором плоскости оказывается нулём. Обратная задача решается в два шага: коэффициенты берём из нормали, свободный член из точки. И последнее: у одной плоскости уравнений много, потому что общий множитель ничего не меняет. Дальше начнутся задачи ДТМ по всему году. | Bu normal, nuqta emas, va ularni bitta almashtirib qo'yish bilan ajratish mumkin: tekislik nuqtasida nol chiqadi, bu uchlikda esa uch chiqdi. Rollari boshqa: koeffitsiyent harf oldidagi ko'paytuvchi, koordinata harfning qiymati, va yozuvda ular bir xil ko'rinadi. Uchlik tekislikka nega perpendikulyar, bu ham hisobdan ko'rinadi: tekislikning ixtiyoriy ikki nuqtasida almashtirib qo'yish nol beradi, ayirishda ozod had qisqaradi, va tekislik vektori bilan ko'paytma nol bo'lib chiqadi. Teskari masala ikki qadamda yechiladi: koeffitsiyentlarni normaldan, ozod hadni nuqtadan olamiz. Va oxirgisi: bitta tekislikning tenglamalari ko'p, chunki umumiy ko'paytuvchi hech narsani o'zgartirmaydi. Keyin butun yil bo'yicha DTM topshiriqlari boshlanadi. | It is a normal and not a point, and they can be told apart by a single substitution: for a point of the plane zero comes out, and for this triple three came out. The roles differ: a coefficient is a factor at a letter, a coordinate is the value of a letter, and in writing they look the same. Why the triple is perpendicular to the plane is also visible from the counting: for any two points of the plane the substitution gives zero, in the subtraction the free term cancels, and the product with a vector of the plane turns out to be zero. The inverse problem is solved in two steps: the coefficients from the normal, the free term from the point. And the last thing: a plane has many equations, because a common factor changes nothing. Next the DTM tasks over the whole year will begin. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `M (1; 2; 2)` |
| `hook.b` | `n (1; 2; 2)` |
| `proved` | `n (1; 2; 2)` |
| `law` | `ax + by + cz + d = 0` |
| `sheet.1` | `x + 2y + 2z − 6 = 0` |
| `sheet.2` | `n (1; 2; 2)` |
| `sheet.3` | `n·v = 0` |
| `sheet.4` | `1 + 4 + 4 − 6 = 3` |
| `sheet.5` | `2x + 4y + 4z − 12 = 0` |
