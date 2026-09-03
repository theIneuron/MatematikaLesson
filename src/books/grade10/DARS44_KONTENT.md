# Урок 51 — Векторы в пространстве · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS50_KONTENT.md`.

Скелет: в переписке 2026-08-21. **Опоры в учебнике 10 класса нет** — векторов в пространстве нет
ни в одном из двух томов 2017 года. Источник истины — план. Блок читается как ПЕРВЫЙ проход:
вводятся объекты, а углы между плоскостями, расстояния в пространстве и преобразования остаются
11 классу.

**Главное решение урока.** Ошибка года `vektor-oxiri-emas`: координаты вектора считают
координатами его конца, то есть `AB` берут равным `B`. Свидетель: один и тот же вектор строится из
двух разных начал. Тройка координат у них одна, а концы разные, и поворот это совпадение держит.

**ЗАМЕР ПРИ СБОРКЕ.** У двух равных векторов вырождается не сам вектор, а СМЕЩЕНИЕ между ними:
стрелки могут лечь одна на другую. Второе начало подбирается так, чтобы на кадре они были
разведены, и это проверяется снимком стенда, а не на глаз — грабля уже была в 11 классе.

**Числа урока целые намеренно.** Длины: `(2; 1; 2)` даёт три, `(3; 4; 0)` даёт пять, `(2; 3; 6)`
даёт семь, `(1; 2; 2)` даёт три, `(6; 6; 7)` даёт одиннадцать, `(9; 12; 20)` даёт двадцать пять.
Ученик проверяет мысль, а не тренирует корни.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины `vektor`,
`vektorning koordinatalari`, `teng vektorlar`, `qarama-qarshi vektor`, `nol vektor`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ВЕКТОР | VEKTOR | THE VECTOR |
| `title` | Какая тройка у вектора | Vektorda qaysi uchlik | Which triple belongs to the vector |
| `row.a.name` | тройка конца | oxirning uchligi | the triple of the end |
| `row.b.name` | конец минус начало | oxir minus boshi | the end minus the start |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас построим вектор. | Javobingiz yozib olindi. Endi vektorni yasaymiz. | Your answer is recorded. Now we build the vector. |
| `audio.mount` | Вектор идёт из точки один один нуль в точку три два два. | Vektor bir bir nol nuqtadan uch ikki ikki nuqtaga boradi. | The vector goes from the point one one zero to the point three two two. |
| `audio.r1` | Первая запись берёт тройку конца, то есть три два два. | Birinchi yozuv oxirning uchligini oladi, ya'ni uch ikki ikki. | The first reading takes the triple of the end, that is three two two. |
| `audio.r2` | Вторая вычитает начало из конца. | Ikkinchisi oxirdan boshni ayiradi. | The second subtracts the start from the end. |
| `audio.ask` | Конец у вектора виден, и его тройка сразу под рукой. Как думаешь, какая запись верная? | Vektorning oxiri ko'rinadi, va uning uchligi darrov qo'l ostida. Sizningcha qaysi yozuv to'g'ri? | The end of the vector is visible and its triple is right at hand. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A (1; 1; 0),   B (3; 2; 2)` |
| `row.a.value` | `(3; 2; 2)` |
| `row.b.value` | `(2; 1; 2)` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из курса | Kursdan uch savol | Three questions from the course |
| `q1.prompt` | Что задаёт вектор на плоскости? | Tekislikda vektorni nima aniqlaydi? | What determines a vector on a plane? |
| `q1.a` [верно] | длина и направление | uzunlik va yo'nalish | the length and the direction |
| `q1.b` | только длина | faqat uzunlik | only the length |
| `q1.b.hint` | Одной длины мало: направлений много. | Bitta uzunlik kam: yo'nalishlar ko'p. | A length alone is not enough: there are many directions. |
| `q1.c` | точка приложения | qo'yilish nuqtasi | the point of application |
| `q1.c.hint` | От переноса вектор не меняется. | Ko'chirishdan vektor o'zgarmaydi. | A shift does not change a vector. |
| `q1.d` | угол с осью | o'q bilan burchak | the angle with an axis |
| `q1.d.hint` | Угол задаёт направление, но длины не даёт. | Burchak yo'nalishni beradi, uzunlikni bermaydi. | An angle gives the direction but not the length. |
| `q2.prompt` | Когда два вектора равны? | Ikki vektor qachon teng? | When are two vectors equal? |
| `q2.a` [верно] | когда совпадают их тройки | uchliklari mos tushganda | when their triples coincide |
| `q2.b` | когда совпадают их концы | oxirlari mos tushganda | when their ends coincide |
| `q2.b.hint` | Концы разные, а вектор может быть тот же. | Oxirlari boshqa, vektor esa o'sha bo'lishi mumkin. | The ends differ, and the vector may still be the same. |
| `q2.c` | когда равны их длины | uzunliklari teng bo'lganda | when their lengths are equal |
| `q2.c.hint` | Длины равны и у противоположных векторов. | Uzunliklar qarama-qarshi vektorlarda ham teng. | Opposite vectors also have equal lengths. |
| `q2.d` | когда они лежат на одной прямой | bir to'g'ri chiziqda yotganda | when they lie on one line |
| `q2.d.hint` | На одной прямой они могут смотреть в разные стороны. | Bir to'g'ri chiziqda ular boshqa tomonga qarashi mumkin. | On one line they may point in opposite directions. |
| `q3.prompt` | Как считается длина по тройке? | Uzunlik uchlik bo'yicha qanday hisoblanadi? | How is a length computed from a triple? |
| `q3.a` [верно] | корень из суммы квадратов | kvadratlar yig'indisidan ildiz | the root of the sum of squares |
| `q3.b` | сумма трёх чисел | uch sonning yig'indisi | the sum of the three numbers |
| `q3.b.hint` | Сумма даёт не длину, а другое число. | Yig'indi uzunlikni emas, boshqa sonni beradi. | The sum gives not a length but another number. |
| `q3.c` | наибольшее из чисел | sonlarning eng kattasi | the largest of the numbers |
| `q3.c.hint` | Наибольшее это только одно измерение. | Eng kattasi faqat bitta o'lchov. | The largest is only one dimension. |
| `q3.d` | произведение трёх чисел | uch sonning ko'paytmasi | the product of the three numbers |
| `q3.d.hint` | Произведение обнулится, если есть ноль. | Nol bo'lsa, ko'paytma nolga aylanadi. | The product becomes zero if there is a zero. |
| `audio.mount` | Три вопроса. Правило урока соберётся из первого и второго. | Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi. | Three questions. The rule of the lesson will be assembled from the first and the second. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `AB` |
| `q2.done` | `AB = CD` |
| `q3.done` | `\|AB\|` |

---

## Экран 3 · `explain1` · ответ `number` · тег `vektor-oxiri-emas`

Координаты вектора: конец минус начало.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Конец минус начало | Oxir minus boshi | The end minus the start |
| `show.1.1` | начало в точке один один нуль | boshi bir bir nol nuqtada | the start at the point one one zero |
| `show.1.2` | конец в точке три два два | oxiri uch ikki ikki nuqtada | the end at the point three two two |
| `show.2.1` | вычитаем по каждой оси | har o'q bo'yicha ayiramiz | we subtract along each axis |
| `show.2.2` | тройка вектора два один два | vektorning uchligi ikki bir ikki | the triple of the vector is two one two |
| `audio.mount` | Вектор нарисован, и рядом стоят тройки его начала и конца. | Vektor chizilgan, va yonida uning boshi va oxirining uchliklari turadi. | The vector is drawn, and the triples of its start and end stand beside it. |
| `audio.move*` | Тройка вектора это не адрес точки, а сдвиг: на сколько надо пройти по каждой оси, чтобы попасть из начала в конец. Поэтому она получается вычитанием, и вычитать надо в одну сторону, из конца начало. По первой оси три минус один даёт два. По второй два минус один даёт один. По третьей два минус нуль даёт два. Тройка вектора два один два, и она не совпала с тройкой конца ни в одном месте, кроме третьего, где начало было нулём. Именно этот ноль и создаёт обман: когда начало в самом начале координат, тройки вектора и конца совпадают, и кажется, что так всегда. | Vektorning uchligi nuqtaning manzili emas, siljish: boshdan oxirga borish uchun har o'q bo'yicha qancha yurish kerak. Shuning uchun u ayirish bilan chiqadi, va ayirish bir tomonga, oxirdan boshni. Birinchi o'q bo'yicha uch minus bir ikki beradi. Ikkinchisi bo'yicha ikki minus bir bir beradi. Uchinchisi bo'yicha ikki minus nol ikki beradi. Vektorning uchligi ikki bir ikki, va u oxirning uchligi bilan uchinchi o'rindan boshqa hech qayerda mos tushmadi, u yerda boshi nol edi. Ayni shu nol obmanni yaratadi: boshi koordinatalar boshida bo'lganda vektor va oxirning uchliklari mos tushadi, va har doim shunday deb tuyuladi. | The triple of a vector is not the address of a point but a shift: how far you must go along each axis to get from the start to the end. That is why it comes out by subtraction, and the subtraction goes one way, the start out of the end. Along the first axis three minus one gives two. Along the second two minus one gives one. Along the third two minus zero gives two. The triple of the vector is two one two, and it did not coincide with the triple of the end anywhere except the third place, where the start was zero. It is exactly that zero that creates the illusion: when the start is at the origin, the triples of the vector and of the end do coincide, and it seems that it is always so. |
| `audio.work` | Посчитай сам. Какое первое число у тройки вектора? | O'zingiz hisoblang. Vektor uchligining birinchi soni qanday? | Work it out yourself. What is the first number of the vector triple? |
| `work.prompt` | Первое число тройки вектора? | Vektor uchligining birinchi soni? | The first number of the vector triple? |
| `work.ok` | Два. Три минус один. | Ikki. Uch minus bir. | Two. Three minus one. |
| `work.hint.1` | Вычитай по первой оси. | Birinchi o'q bo'yicha ayiring. | Subtract along the first axis. |
| `work.hint.2` | У конца там три, у начала один. | Oxirda u yerda uch, boshida bir. | The end has three there, the start has one. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB = B − A` |
| `work.answer` | `2` |

---

## Экран 4 · `explain2` · ответ `number` · тег `vektor-oxiri-emas`

Свидетель: один вектор из двух начал.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Два начала, одна тройка | Ikki bosh, bitta uchlik | Two starts, one triple |
| `show.1.1` | тот же вектор из другого начала | o'sha vektor boshqa boshdan | the same vector from another start |
| `show.1.2` | стрелки разведены и не совпадают | strelkalar ajralgan va mos tushmaydi | the arrows are apart and do not coincide |
| `show.2.1` | концы у них разные | oxirlari ularda boshqa | their ends are different |
| `show.2.2` | а тройка одна и та же | uchlik esa bir xil | and the triple is one and the same |
| `audio.mount` | Тот же вектор я поставил из другого начала. Стрелки две, и они не совпадают. | O'sha vektorni boshqa boshdan qo'ydim. Strelkalar ikkita, va ular mos tushmaydi. | I have placed the same vector from another start. There are two arrows and they do not coincide. |
| `audio.move*` | Концы у них разные, это видно сразу. А тройки одинаковые, и это тоже написано на кадре. Поворачиваю сцену: стрелки едут, ракурс меняется, а совпадение троек держится. Значит тройка принадлежит вектору, а не его концу: она говорит только про сдвиг, и от места, откуда мы начали, не зависит. Отсюда и определение равных векторов: равны те, у которых совпали тройки. Не концы, не место на чертеже, а именно тройки. | Oxirlari boshqa, bu darrov ko'rinadi. Uchliklari esa bir xil, va bu ham kadrda yozilgan. Sahnani buraman: strelkalar yuradi, rakurs o'zgaradi, uchliklarning mos tushishi esa turadi. Demak uchlik vektorga tegishli, uning oxiriga emas: u faqat siljish haqida aytadi va qayerdan boshlaganimizga bog'liq emas. Shundan teng vektorlarning ta'rifi ham chiqadi: uchliklari mos tushganlari teng. Oxirlari emas, chizmadagi joyi emas, aynan uchliklari. | Their ends are different, that is visible at once. But their triples are the same, and that is written on the frame too. I turn the scene: the arrows travel, the view changes, and the coincidence of the triples holds. So the triple belongs to the vector and not to its end: it speaks only of the shift and does not depend on where we started. Hence the definition of equal vectors: equal are those whose triples coincide. Not the ends, not the place on the drawing, but exactly the triples. |
| `audio.work` | Посчитай сам. Сколько разных троек у этих двух векторов? | O'zingiz hisoblang. Bu ikki vektorda nechta xil uchlik bor? | Work it out yourself. How many different triples do these two vectors have? |
| `work.prompt` | Сколько разных троек? | Nechta xil uchlik? | How many different triples? |
| `work.ok` | Одна. Это один и тот же вектор. | Bitta. Bu bir xil vektor. | One. It is one and the same vector. |
| `work.hint.1` | Сравни тройки, а не концы. | Uchliklarni taqqoslang, oxirlarni emas. | Compare the triples, not the ends. |
| `work.hint.2` | Обе тройки два один два. | Ikki uchlik ham ikki bir ikki. | Both triples are two one two. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB = CD = (2; 1; 2)` |
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `vektor-oxiri-emas`

Длина: корень из суммы квадратов.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Длина считается по тройке | Uzunlik uchlik bo'yicha hisoblanadi | A length is computed from the triple |
| `show.1.1` | вектор два три шесть | ikki uch olti vektori | the vector two three six |
| `show.1.2` | сумма квадратов сорок девять | kvadratlar yig'indisi qirq to'qqiz | the sum of squares is forty nine |
| `show.2.1` | корень из сорока девяти | qirq to'qqizdan ildiz | the root of forty nine |
| `show.2.2` | длина равна семи | uzunlik yettiga teng | the length equals seven |
| `audio.mount` | Возьмём вектор с тройкой два три шесть и найдём его длину. | Uchligi ikki uch olti bo'lgan vektorni olib, uzunligini topamiz. | Take a vector with the triple two three six and find its length. |
| `audio.move*` | Правило то же, что на плоскости, только слагаемых стало три. Причина в двух прямоугольных треугольниках, поставленных друг за другом: сначала по нижней плоскости, потом вверх. Проекция вектора на нижнюю плоскость даёт первые два числа, и её длина по Пифагору корень из четырёх плюс девять, то есть корень из тринадцати. Дальше сама проекция и подъём образуют второй прямоугольный треугольник, где гипотенуза уже сам вектор. Тринадцать плюс тридцать шесть даёт сорок девять, и длина равна семи. Заметь, что квадраты не дают отрицательных слагаемых, поэтому знаки чисел на длину не влияют. | Qoida tekislikdagi bilan bir xil, faqat qo'shiluvchilar uchta bo'ldi. Sabab ketma-ket qo'yilgan ikki to'g'ri burchakli uchburchakda: avval pastki tekislik bo'ylab, keyin tepaga. Vektorning pastki tekislikka proyeksiyasi birinchi ikki sonni beradi, va uning uzunligi Pifagor bo'yicha to'rt qo'shuv to'qqizdan ildiz, ya'ni o'n uchdan ildiz. Keyin proyeksiyaning o'zi va ko'tarilish ikkinchi to'g'ri burchakli uchburchakni tashkil qiladi, unda gipotenuza vektorning o'zi. O'n uch qo'shuv o'ttiz olti qirq to'qqiz beradi, va uzunlik yettiga teng. E'tibor bering, kvadratlar manfiy qo'shiluvchi bermaydi, shuning uchun sonlarning ishorasi uzunlikka ta'sir qilmaydi. | The rule is the same as on a plane, only the number of terms became three. The reason is two right triangles placed one after another: first along the lower plane, then upwards. The projection of the vector onto the lower plane gives the first two numbers, and its length by Pythagoras is the root of four plus nine, that is the root of thirteen. Then the projection itself and the rise form the second right triangle, whose hypotenuse is the vector itself. Thirteen plus thirty six gives forty nine, and the length equals seven. Note that squares give no negative terms, so the signs of the numbers do not affect the length. |
| `audio.work` | Посчитай сам. Какова длина этого вектора? | O'zingiz hisoblang. Bu vektorning uzunligi qancha? | Work it out yourself. What is the length of this vector? |
| `work.prompt` | Длина вектора? | Vektorning uzunligi? | The length of the vector? |
| `work.ok` | Семь. Сорок девять под корнем. | Yetti. Ildiz ostida qirq to'qqiz. | Seven. Forty nine under the root. |
| `work.hint.1` | Сложи квадраты трёх чисел. | Uch sonning kvadratlarini qo'shing. | Add the squares of the three numbers. |
| `work.hint.2` | Четыре плюс девять плюс тридцать шесть. | To'rt qo'shuv to'qqiz qo'shuv o'ttiz olti. | Four plus nine plus thirty six. |
| `work.hint.3` | Семь. | Yetti. | Seven. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `\|AB\|² = 4 + 9 + 36` |
| `work.answer` | `7` |

---

## Экран 6 · `explain4` · ответ `number` · тег `vektor-oxiri-emas`

Противоположный вектор: длина та же.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Знаки сменились, длина нет | Ishoralar o'zgardi, uzunlik yo'q | The signs changed, the length did not |
| `show.1.1` | вектор два три шесть | ikki uch olti vektori | the vector two three six |
| `show.1.2` | и противоположный к нему | va unga qarama-qarshi | and its opposite |
| `show.2.1` | все три числа сменили знак | uch son ham ishorani o'zgartirdi | all three numbers changed sign |
| `show.2.2` | а длина осталась семь | uzunlik esa yetti bo'lib qoldi | and the length stayed seven |
| `audio.mount` | Рядом с вектором поставлю противоположный: та же длина, обратное направление. | Vektor yoniga qarama-qarshisini qo'yaman: o'sha uzunlik, teskari yo'nalish. | Beside the vector let me place its opposite: the same length, the reverse direction. |
| `audio.move*` | В тройке сменили знак все три числа сразу, и это не выбор, а следствие: поменялись местами начало и конец, значит каждое вычитание перевернулось. Длина при этом не изменилась, потому что в неё числа входят квадратами, а квадрат знака не помнит. Отсюда полезное следствие для проверки: если у тебя вышли две разные длины у вектора и у противоположного, значит ошибка не в знаках, а в самом счёте. И ещё один особый случай. Если начало и конец совпали, все три числа обнулятся, и получится нулевой вектор: у него нет направления, и длина нуль. | Uchlikda uch son ham birdan ishorani o'zgartirdi, va bu tanlov emas, natija: boshi va oxiri o'rin almashdi, demak har ayirish teskari bo'ldi. Uzunlik esa o'zgarmadi, chunki unga sonlar kvadrat bo'lib kiradi, kvadrat esa ishorani eslamaydi. Bundan tekshiruv uchun foydali natija chiqadi: agar vektor va qarama-qarshisining uzunligi boshqa-boshqa chiqsa, xato ishorada emas, hisobning o'zida. Va yana bitta maxsus hol. Boshi va oxiri mos tushsa, uch son ham nolga aylanadi, va nol vektor chiqadi: unda yo'nalish yo'q, uzunlik esa nol. | In the triple all three numbers changed sign at once, and that is not a choice but a consequence: the start and the end swapped places, so every subtraction was reversed. The length did not change, because the numbers enter it as squares, and a square does not remember a sign. Hence a useful consequence for checking: if you got two different lengths for a vector and its opposite, the mistake is not in the signs but in the counting itself. And one more special case. If the start and the end coincide, all three numbers become zero and the zero vector appears: it has no direction and its length is zero. |
| `audio.work` | Посчитай сам. Какова длина противоположного вектора? | O'zingiz hisoblang. Qarama-qarshi vektorning uzunligi qancha? | Work it out yourself. What is the length of the opposite vector? |
| `work.prompt` | Длина противоположного? | Qarama-qarshining uzunligi? | The length of the opposite? |
| `work.ok` | Семь. Квадрат знака не помнит. | Yetti. Kvadrat ishorani eslamaydi. | Seven. A square does not remember a sign. |
| `work.hint.1` | Посмотри, что стоит под корнем. | Ildiz ostida nima turganiga qarang. | Look at what stands under the root. |
| `work.hint.2` | Квадраты у обоих одинаковые. | Ikkisida ham kvadratlar bir xil. | Both have the same squares. |
| `work.hint.3` | Семь. | Yetti. | Seven. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `BA = (−2; −3; −6)` |
| `work.answer` | `7` |

---

## Экран 7 · `explain5` · ответ `number` · тег `ayirma-tartibi`

ГРАНИЦА: `AB` и `BA` это разные векторы.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE CASE |
| `title` | Порядок букв не украшение | Harflar tartibi bezak emas | The order of the letters is no ornament |
| `show.1.1` | запись A B и запись B A | A B yozuvi va B A yozuvi | the reading A B and the reading B A |
| `show.1.2` | отрезок у них один | kesmasi ularda bitta | they have one and the same segment |
| `show.2.1` | а стрелки смотрят врозь | strelkalar esa turlicha qaraydi | but the arrows point apart |
| `show.2.2` | тройки отличаются знаком | uchliklar ishora bilan farq qiladi | the triples differ by sign |
| `audio.mount` | Отрезок между двумя точками один, а векторов на нём два. | Ikki nuqta orasidagi kesma bitta, undagi vektorlar esa ikkita. | The segment between two points is one, but there are two vectors on it. |
| `audio.move*` | Запись A B значит из A в B, запись B A значит наоборот. Это не мелочь оформления, а другой объект: тройки у них отличаются знаком у каждого числа, и в задачах, где тройки складывают, порядок букв решает ответ. Проверка простая и работает всегда: первая буква это начало, из неё вычитают. Если получилась тройка конца, значит вычитание пропустили. А чтобы не путаться в задачах, читай запись вслух как маршрут: из первой буквы во вторую. Длины у обеих записей одинаковые, и потому по длине ошибку в порядке не поймать. | A B yozuvi A dan B ga degani, B A yozuvi esa teskarisi. Bu bezakdagi mayda-chuyda emas, boshqa obyekt: uchliklari har sonda ishora bilan farq qiladi, va uchliklar qo'shiladigan masalalarda harflar tartibi javobni hal qiladi. Tekshiruv oddiy va har doim ishlaydi: birinchi harf boshi, undan ayiriladi. Agar oxirning uchligi chiqsa, demak ayirish o'tkazib yuborilgan. Masalalarda chalkashmaslik uchun esa yozuvni marshrut kabi ovoz chiqarib o'qing: birinchi harfdan ikkinchisiga. Ikki yozuvning uzunligi bir xil, shuning uchun tartibdagi xatoni uzunlik bilan ushlab bo'lmaydi. | The reading A B means from A to B, the reading B A means the other way. That is not a detail of style but a different object: their triples differ in the sign of every number, and in problems where triples are added the order of the letters decides the answer. The check is simple and always works: the first letter is the start, it is what you subtract. If you got the triple of the end, the subtraction was skipped. And to avoid confusion in problems, read the notation aloud as a route: from the first letter to the second. The lengths of both readings are the same, and that is why a mistake in the order cannot be caught by the length. |
| `audio.work` | Посчитай сам. Сколько из двух записей дают тройку два один два? | O'zingiz hisoblang. Ikki yozuvdan nechtasi ikki bir ikki uchligini beradi? | Work it out yourself. How many of the two readings give the triple two one two? |
| `work.prompt` | Сколько записей дают два один два? | Nechta yozuv ikki bir ikki beradi? | How many readings give two one two? |
| `work.ok` | Одна. У второй все знаки обратные. | Bittasi. Ikkinchisida barcha ishoralar teskari. | One. The second has all the signs reversed. |
| `work.hint.1` | Проверь, какая буква стоит первой. | Qaysi harf birinchi turganini tekshiring. | Check which letter stands first. |
| `work.hint.2` | Из первой буквы вычитают. | Birinchi harfdan ayiriladi. | The first letter is what you subtract. |
| `work.hint.3` | Одна. | Bittasi. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB = −BA` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `vektor-oxiri-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Тройка вектора | Vektorning uchligi | The triple of a vector |
| `probe.question` | Чему принадлежит тройка? | Uchlik nimaga tegishli? | What does the triple belong to? |
| `probe.a` [верно] | вектору, а не его концу | vektorga, oxiriga emas | to the vector, not to its end |
| `probe.b` | концу вектора | vektorning oxiriga | to the end of the vector |
| `probe.b.hint` | Тогда перенос вектора менял бы тройку, а он не меняет. | U holda vektorni ko'chirish uchlikni o'zgartirardi, lekin o'zgartirmaydi. | Then shifting the vector would change the triple, and it does not. |
| `rule.lawLabel` | Вектор по тройке | Uchlik bo'yicha vektor | A vector by its triple |
| `rule.lines.1` | тройка вектора это конец минус начало | vektorning uchligi oxir minus boshi | the triple of a vector is the end minus the start |
| `rule.lines.2` | равные векторы это векторы с одной тройкой | teng vektorlar bitta uchlikli vektorlar | equal vectors are vectors with one triple |
| `rule.lines.3` | длина это корень из суммы квадратов | uzunlik kvadratlar yig'indisidan ildiz | the length is the root of the sum of squares |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Первая строка отвечает на весь урок: тройка это сдвиг, и берётся она вычитанием. Вторая строка объясняет, почему вектор можно переносить: если тройка та же, это тот же вектор, и место на чертеже ничего не значит. Третья даёт длину, и в ней знаки исчезают под квадратами. Полезная привычка на экзамене: прежде чем считать, проверь порядок букв. Тройка конца и тройка вектора совпадают только тогда, когда начало стоит в начале координат, а это редкий случай, а не правило. | Birinchi satr butun darsga javob beradi: uchlik siljish, va u ayirish bilan olinadi. Ikkinchi satr vektorni nega ko'chirish mumkinligini tushuntiradi: uchlik o'sha bo'lsa, bu o'sha vektor, va chizmadagi joyning ahamiyati yo'q. Uchinchisi uzunlikni beradi, va unda ishoralar kvadratlar ostida yo'qoladi. Imtihonda foydali odat: hisoblashdan oldin harflar tartibini tekshiring. Oxirning uchligi va vektorning uchligi faqat boshi koordinatalar boshida turganda mos tushadi, va bu kamdan-kam hol, qoida emas. | The first line answers the whole lesson: the triple is a shift, and it is taken by subtraction. The second line explains why a vector may be moved: if the triple is the same, it is the same vector, and the place on the drawing means nothing. The third gives the length, and in it the signs disappear under the squares. A useful habit at the exam: before computing, check the order of the letters. The triple of the end and the triple of the vector coincide only when the start stands at the origin, and that is a rare case, not a rule. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `AB = B − A` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `vektor-oxiri-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Тройка и длина | Uchlik va uzunlik | The triple and the length |
| `match.prompt` | Соедини тройку с длиной | Uchlikni uzunlik bilan birlashtiring | Match the triple with the length |
| `match.ok` | Все четыре на месте. Знаки в длину не входят. | To'rttasi ham joyida. Ishoralar uzunlikka kirmaydi. | All four in place. The signs do not enter the length. |
| `audio.mount` | Четыре тройки и четыре длины. Складывай квадраты. | To'rt uchlik va to'rt uzunlik. Kvadratlarni qo'shing. | Four triples and four lengths. Add the squares. |
| `match.a` | три | uch | three |
| `match.b` | пять | besh | five |
| `match.c` | семь | yetti | seven |
| `match.d` | одиннадцать | o'n bir | eleven |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `(1; 2; 2)` · `(3; 4; 0)` · `(2; 3; 6)` · `(6; 6; 7)` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `vektor-oxiri-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи, что векторы равны | Vektorlar teng ekanini isbotlang | Prove the vectors are equal |
| `proof.given` | четыре точки, две пары | to'rt nuqta, ikki juft | four points, two pairs |
| `proof.goal` | векторы AB и CD равны | AB va CD vektorlari teng | the vectors AB and CD are equal |
| `proof.r1` | тройка первого вектора два один два | birinchi vektorning uchligi ikki bir ikki | the triple of the first vector is two one two |
| `proof.r2` | тройка второго вектора два один два | ikkinchi vektorning uchligi ikki bir ikki | the triple of the second vector is two one two |
| `proof.r3` | тройки совпали, значит векторы равны | uchliklar mos tushdi, demak vektorlar teng | the triples coincide, so the vectors are equal |
| `proof.ok` | Доказано. Разные места на чертеже равенству не мешают. | Isbotlandi. Chizmadagi boshqa joylar tenglikka to'sqinlik qilmaydi. | Proved. Different places on the drawing do not prevent equality. |
| `proof.e1` | Про второй вектор дальше. Сначала первый. | Ikkinchi vektor haqida keyin. Avval birinchisi. | The second vector comes later. First the first one. |
| `proof.e2` | Первый посчитан. Теперь второй. | Birinchisi hisoblandi. Endi ikkinchisi. | The first is computed. Now the second. |
| `proof.e3` | Обе тройки есть. Теперь вывод. | Ikki uchlik ham bor. Endi xulosa. | Both triples are there. Now the conclusion. |
| `reason.s1` | вычитание конец минус начало | ayirish oxir minus boshi | the subtraction end minus start |
| `reason.s2` | то же вычитание для второй пары | ikkinchi juft uchun o'sha ayirish | the same subtraction for the second pair |
| `reason.s3` | определение равных векторов | teng vektorlar ta'rifi | the definition of equal vectors |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB = CD = (2; 1; 2)` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Двадцать пять. Шестьсот двадцать пять под корнем. | Yigirma besh. Ildiz ostida olti yuz yigirma besh. | Twenty five. Six hundred twenty five under the root. |
| `task.hint.1` | Сложи квадраты трёх чисел. | Uch sonning kvadratlarini qo'shing. | Add the squares of the three numbers. |
| `task.hint.2` | Восемьдесят один, сто сорок четыре, четыреста. | Sakson bir, bir yuz qirq to'rt, to'rt yuz. | Eighty one, one hundred forty four, four hundred. |
| `task.hint.3` | Двадцать пять. | Yigirma besh. | Twenty five. |
| `order.prompt` | Расставь шаги в том порядке, в каком считают | Qadamlarni hisoblash tartibida joylashtiring | Arrange the steps in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Вычитание, тройка, квадраты, корень. | Tartib to'g'ri. Ayirish, uchlik, kvadratlar, ildiz. | The order is right. The subtraction, the triple, the squares, the root. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как считают. | Endi qadamlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the steps. Arrange them the way the counting goes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `AB = (9; 12; 20),   \|AB\| = ?` |
| `task.answer` | `25` |
| `order.items` | `\|AB\|` · `B − A` · `AB` · `x² + y² + z²` |
| `order.answer` | `B − A  AB  x² + y² + z²  \|AB\|` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Правило записано верно. | Qoida to'g'ri yozilgan. | The rule is written correctly. |
| `hint.r4` | Квадраты посчитаны по неверной строке выше. | Kvadratlar yuqoridagi xato qator bo'yicha hisoblangan. | The squares are computed from the wrong line above. |
| `proof` | Поверни сцену: тройка вектора не меняется при переносе, а тройка конца меняется. | Sahnani buring: vektorning uchligi ko'chirishda o'zgarmaydi, oxirning uchligi esa o'zgaradi. | Rotate the scene: the triple of the vector does not change under a shift, the triple of the end does. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Взяли тройку конца вместо вычитания. | Uchinchi. Ayirish o'rniga oxirning uchligi olingan. | The third. The triple of the end was taken instead of the subtraction. |
| `entry.hint.1` | Проверь, где применено правило второй строки. | Ikkinchi qatorning qoidasi qayerda qo'llanganini tekshiring. | Check where the rule of the second line was applied. |
| `entry.hint.2` | Сравни результат с тройкой конца. | Natijani oxirning uchligi bilan taqqoslang. | Compare the result with the triple of the end. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них пропускает вычитание. | To'rt qator, va ulardan biri ayirishni o'tkazib yuboradi. | Four lines, and one of them skips the subtraction. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `A (1; 1; 0),   B (3; 2; 2)` |
| `row.r2` | `AB = B − A` |
| `row.r3` | `AB = (3; 2; 2)` |
| `row.r4` | `\|AB\|² = 17` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Начало вектора в точке один два три, а тройка вектора два два один. Каково третье число конца? | Vektorning boshi bir ikki uch nuqtada, uchligi esa ikki ikki bir. Oxirining uchinchi soni qanday? | The start of a vector is at the point one two three, and the triple of the vector is two two one. What is the third number of the end? |
| `place.ok` | Четыре. Три плюс один. | To'rt. Uch qo'shuv bir. | Four. Three plus one. |
| `place.wrong` | Тройку прибавляют к началу, а не берут вместо конца. | Uchlik boshga qo'shiladi, oxir o'rniga olinmaydi. | The triple is added to the start, not taken instead of the end. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для этого вектора | Bu vektor uchun nima to'g'ri | What is true for this vector |
| `multi.d.hint` | Это тройка вектора, а не конца. | Bu vektorning uchligi, oxirning emas. | That is the triple of the vector, not of the end. |
| `multi.e.hint` | Под корнем девять, значит длина три. | Ildiz ostida to'qqiz, demak uzunlik uch. | Under the root there is nine, so the length is three. |
| `multi.ok` | Три записи из пяти. Две оставшиеся путают вектор с его концом. | Beshtadan uch yozuv. Qolgan ikkitasi vektorni oxiri bilan aralashtiradi. | Three readings out of five. The other two confuse the vector with its end. |
| `audio.mount` | Прочитаем урок справа налево. Дано начало и тройка, найти надо конец. | Darsni o'ngdan chapga o'qiymiz. Boshi va uchligi berilgan, oxirini topish kerak. | Let us read the lesson from right to left. The start and the triple are given, the end is to be found. |
| `audio.work` | Отметь все записи, которые верны. Их больше одной. | To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are correct. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `4` |
| `place.step` | `3 + 1` |
| `multi.a` [верно] | `AB = (2; 2; 1)` |
| `multi.b` [верно] | `B (3; 4; 4)` |
| `multi.c` [верно] | `\|AB\| = 3` |
| `multi.d` | `B (2; 2; 1)` |
| `multi.e` | `\|AB\| = 9` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `vektor-oxiri-emas`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Как берётся тройка вектора? | Vektorning uchligi qanday olinadi? | How is the triple of a vector taken? |
| `q1.a` [верно] | конец минус начало | oxir minus boshi | the end minus the start |
| `q1.b` | начало минус конец | boshi minus oxir | the start minus the end |
| `q1.b.hint` | Это даст противоположный вектор. | Bu qarama-qarshi vektorni beradi. | That will give the opposite vector. |
| `q1.c` | тройка конца | oxirning uchligi | the triple of the end |
| `q1.c.hint` | Так выходит только при начале в начале координат. | Bu faqat boshi koordinatalar boshida bo'lganda chiqadi. | That comes out only when the start is at the origin. |
| `q1.d` | сумма троек | uchliklar yig'indisi | the sum of the triples |
| `q1.d.hint` | Сумма относится к другому действию. | Yig'indi boshqa amalga tegishli. | The sum belongs to another operation. |
| `q2.prompt` | Когда векторы равны? | Vektorlar qachon teng? | When are vectors equal? |
| `q2.a` [верно] | когда совпадают тройки | uchliklari mos tushganda | when their triples coincide |
| `q2.b` | когда совпадают концы | oxirlari mos tushganda | when their ends coincide |
| `q2.b.hint` | Концы разные, а вектор тот же. | Oxirlari boshqa, vektor esa o'sha. | The ends differ and the vector is the same. |
| `q2.c` | когда равны длины | uzunliklari teng bo'lganda | when their lengths are equal |
| `q2.c.hint` | Длины равны и у противоположных. | Uzunliklar qarama-qarshilarda ham teng. | Opposites have equal lengths too. |
| `q2.d` | когда они рядом | yonma-yon bo'lganda | when they are side by side |
| `q2.d.hint` | Место на чертеже к делу не относится. | Chizmadagi joyning ishga aloqasi yo'q. | The place on the drawing is irrelevant. |
| `q3.prompt` | Чему равна длина вектора один два два? | Bir ikki ikki vektorining uzunligi nimaga teng? | What is the length of the vector one two two? |
| `q3.a` [верно] | три | uch | three |
| `q3.b` | пять | besh | five |
| `q3.b.hint` | Пять это сумма трёх чисел, а не длина. | Besh uch sonning yig'indisi, uzunlik emas. | Five is the sum of the three numbers, not the length. |
| `q3.c` | девять | to'qqiz | nine |
| `q3.c.hint` | Девять стоит под корнем. | To'qqiz ildiz ostida turadi. | Nine stands under the root. |
| `q3.d` | два | ikki | two |
| `q3.d.hint` | Два это наибольшее из чисел. | Ikki sonlarning eng kattasi. | Two is the largest of the numbers. |
| `q4.prompt` | Чем отличается B A от A B? | B A dan A B nimasi bilan farq qiladi? | How does B A differ from A B? |
| `q4.a` [верно] | знаком всех трёх чисел | uch sonning ishorasi bilan | by the sign of all three numbers |
| `q4.b` | длиной | uzunligi bilan | by the length |
| `q4.b.hint` | Длины у них одинаковые. | Ularning uzunligi bir xil. | Their lengths are the same. |
| `q4.c` | ничем | hech nimasi bilan | by nothing |
| `q4.c.hint` | Тогда сложение троек давало бы другой ответ. | U holda uchliklarni qo'shish boshqa javob berardi. | Then adding the triples would give another answer. |
| `q4.d` | только первым числом | faqat birinchi soni bilan | only by the first number |
| `q4.d.hint` | Знак меняется у каждого числа. | Ishora har sonda o'zgaradi. | The sign changes for every number. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `AB = B − A` |
| `q2.done` | `AB = CD` |
| `q3.done` | `3` |
| `q4.done` | `AB = −BA` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Беру тройку вектора вычитанием | Vektorning uchligini ayirish bilan olaman | I take the triple of a vector by subtraction |
| `can.2` | Различаю тройку вектора и тройку точки | Vektorning uchligini nuqtaning uchligidan ajrataman | I tell the triple of a vector from the triple of a point |
| `can.3` | Считаю длину по трём числам | Uzunlikni uch son bo'yicha hisoblayman | I compute a length from three numbers |
| `can.4` | Читаю порядок букв как маршрут | Harflar tartibini marshrut kabi o'qiyman | I read the order of the letters as a route |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше действия — тройки начнут складывать и умножать на число | Bundan keyin amallar, uchliklar qo'shila va songa ko'paytirila boshlaydi | Next come the operations: the triples will be added and multiplied by a number |
| `lifehack` | Прежде чем считать, прочитай запись как маршрут: из первой буквы во вторую | Hisoblashdan oldin yozuvni marshrut kabi o'qing: birinchi harfdan ikkinchisiga | Before computing, read the notation as a route: from the first letter to the second |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Программа, блок восемь | Programma, sakkizinchi blok | The programme, block eight |
| `audio.mount` | Урок начался с вопроса, какая тройка принадлежит вектору. | Dars qaysi uchlik vektorga tegishli degan savol bilan boshlandi. | The lesson began with the question which triple belongs to the vector. |
| `audio.next` | Тройка конца оказалась не той, и причина не в невнимательности. Тройка вектора это сдвиг, а не адрес: она говорит, на сколько пройти по каждой оси, и потому берётся вычитанием, из конца начало. Отсюда всё остальное. Один и тот же вектор можно поставить из любого начала, и тройка не изменится, а концы будут разные, и значит равные векторы это те, у которых совпали тройки. Длина считается корнем из суммы квадратов, и знаки в неё не проходят, поэтому у вектора и противоположного длина одна. А порядок букв решает: A B и B A отличаются знаком у каждого числа. Дальше тройки начнут складывать. | Oxirning uchligi o'sha bo'lmadi, va sabab e'tiborsizlikda emas. Vektorning uchligi manzil emas, siljish: u har o'q bo'yicha qancha yurish kerakligini aytadi, va shuning uchun ayirish bilan, oxirdan boshni olib chiqadi. Qolgani shundan. Bir xil vektorni ixtiyoriy boshdan qo'yish mumkin, uchlik o'zgarmaydi, oxirlari esa boshqa bo'ladi -- demak teng vektorlar uchliklari mos tushganlari. Uzunlik kvadratlar yig'indisidan ildiz bilan hisoblanadi, va ishoralar unga o'tmaydi, shuning uchun vektor va qarama-qarshisining uzunligi bitta. Harflar tartibi esa hal qiladi: A B va B A har sonning ishorasi bilan farq qiladi. Keyin uchliklar qo'shila boshlaydi. | The triple of the end turned out to be the wrong one, and the reason is not carelessness. The triple of a vector is a shift and not an address: it says how far to go along each axis, and that is why it is taken by subtraction, the start out of the end. Everything else follows. One and the same vector can be placed from any start, and the triple will not change while the ends will differ, so equal vectors are those whose triples coincide. The length is computed as the root of the sum of squares, and the signs do not pass into it, so a vector and its opposite have one length. And the order of the letters decides: A B and B A differ in the sign of every number. Next the triples will start being added. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `(3; 2; 2)` |
| `hook.b` | `(2; 1; 2)` |
| `proved` | `(2; 1; 2)` |
| `law` | `AB = B − A` |
| `sheet.1` | `AB = B − A` |
| `sheet.2` | `AB = CD` |
| `sheet.3` | `\|AB\|² = x² + y² + z²` |
| `sheet.4` | `AB = −BA` |
| `sheet.5` | `\|AB\| = \|BA\|` |
