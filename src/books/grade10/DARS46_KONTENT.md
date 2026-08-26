# Урок 46 — Пирамида · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS45_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, стр. 45 — определение пирамиды и
правильной пирамиды; стр. 46 — апофема. Определения взяты дословно.

**Главное решение урока.** Ошибка года: в правильной пирамиде берут боковое ребро вместо апофемы.
Оба отрезка идут из вершины вниз, на чертеже почти сливаются, но апофема попадает в середину
стороны основания, а ребро в её конец. Апофема короче, и это видно поворотом.

**Апофема опирается на урок 41.** Она перпендикулярна стороне основания не «по построению», а по
теореме о трёх перпендикулярах: проекция апофемы это отрезок от центра к середине стороны, и он
перпендикулярен стороне. Это второй раз, когда блок 6 работает внутри блока 7.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`piramida`, `muntazam piramida`, `apofema`, `balandlik` взяты из учебника, стр. 45–46.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПИРАМИДА | PIRAMIDA | THE PYRAMID |
| `title` | Апофема или боковое ребро | Apofema yoki yon qirra | The apothem or the lateral edge |
| `row.a.name` | апофема длиннее | apofema uzunroq | the apothem is longer |
| `row.b.name` | апофема короче | apofema qisqaroq | the apothem is shorter |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём пирамиду. | Javobingiz yozib olindi. Endi piramidani buramiz. | Your answer is recorded. Now we rotate the pyramid. |
| `audio.mount` | Правильная пирамида. Из вершины проведены два отрезка: один в конец стороны основания, другой в её середину. | Muntazam piramida. Uchdan ikki kesma o'tkazilgan: biri asos tomonining uchiga, ikkinchisi o'rtasiga. | A regular pyramid. Two segments are drawn from the apex: one to the end of a base side, the other to its middle. |
| `audio.r1` | Первая запись говорит, что отрезок в середину длиннее. | Birinchi yozuv o'rtaga boradigan kesma uzunroq deydi. | The first reading says the segment to the middle is longer. |
| `audio.r2` | Вторая говорит, что он короче. | Ikkinchisi u qisqaroq deydi. | The second says it is shorter. |
| `audio.ask` | На чертеже они почти совпадают. Как думаешь, какая запись верная? | Chizmada ular deyarli ustma-ust tushadi. Sizningcha qaysi yozuv to'g'ri? | On the drawing they almost coincide. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `SM,   SA` |
| `row.a.value` | `SM > SA` |
| `row.b.value` | `SM < SA` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед пирамидой | Piramidadan oldin uch savol | Three questions before the pyramid |
| `q1.prompt` | Сколько граней у параллелепипеда? | Parallelepipedning nechta yog'i bor? | How many faces does a parallelepiped have? |
| `q1.a` [верно] | шесть | oltita | six |
| `q1.b` | четыре | to'rtta | four |
| `q1.b.hint` | Четыре это боковые грани, без оснований. | To'rtta yon yoqlar, asoslarsiz. | Four are the lateral faces, without the bases. |
| `q1.c` | восемь | sakkizta | eight |
| `q1.c.hint` | Восемь это число вершин. | Sakkiz uchlar soni. | Eight is the number of vertices. |
| `q1.d` | двенадцать | o'n ikkita | twelve |
| `q1.d.hint` | Двенадцать это число рёбер. | O'n ikki qirralar soni. | Twelve is the number of edges. |
| `q2.prompt` | Что даёт теорема о трёх перпендикулярах? | Uch perpendikulyar haqidagi teorema nima beradi? | What does the theorem of three perpendiculars give? |
| `q2.a` [верно] | переносит перпендикулярность с проекции на наклонную | perpendikulyarlikni proyeksiyadan og'maga o'tkazadi | it carries perpendicularity from the projection to the oblique |
| `q2.b` | сравнивает длины | uzunliklarni solishtiradi | it compares lengths |
| `q2.b.hint` | Про длины в ней речи нет. | Unda uzunliklar haqida gap yo'q. | It says nothing about lengths. |
| `q2.c` | строит высоту | balandlik quradi | it builds the height |
| `q2.c.hint` | Перпендикуляр в ней уже дан. | Perpendikulyar unda allaqachon berilgan. | The perpendicular is already given in it. |
| `q2.d` | считает углы | burchaklarni hisoblaydi | it computes angles |
| `q2.d.hint` | Она переносит прямой угол, а не считает. | U to'g'ri burchakni o'tkazadi, hisoblamaydi. | It carries a right angle over, it does not compute. |
| `q3.prompt` | Что такое расстояние от точки до плоскости? | Nuqtadan tekislikkacha bo'lgan masofa nima? | What is the distance from a point to a plane? |
| `q3.a` [верно] | длина перпендикуляра | perpendikulyar uzunligi | the length of the perpendicular |
| `q3.b` | длина наклонной | og'ma uzunligi | the length of an oblique |
| `q3.b.hint` | Наклонных много, и все они длиннее. | Og'malar ko'p, va hammasi uzunroq. | There are many obliques and all are longer. |
| `q3.c` | длина проекции | proyeksiya uzunligi | the length of the projection |
| `q3.c.hint` | Проекция лежит в плоскости. | Proyeksiya tekislikda yotadi. | The projection lies in the plane. |
| `q3.d` | среднее из замеров | o'lchovlarning o'rtachasi | the average of measurements |
| `q3.d.hint` | Расстояние это самый короткий путь. | Masofa eng qisqa yo'l. | A distance is the shortest path. |
| `audio.mount` | Три вопроса. Второй и третий понадобятся, когда появится апофема. | Uchta savol. Apofema paydo bo'lganda ikkinchisi va uchinchisi kerak bo'ladi. | Three questions. The second and third will be needed when the apothem appears. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `4 + 2 = 6` |
| `q2.done` | `c ⊥ BC ⇔ c ⊥ AC` |
| `q3.done` | `ρ = AB` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Пирамида: одна грань многоугольник, остальные треугольники.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Все боковые грани в одной вершине | Barcha yon yoqlar bitta uchda | All lateral faces at one vertex |
| `show.1.1` | внизу многоугольник, это основание | pastda ko'pburchak, bu asos | a polygon below, that is the base |
| `show.1.2` | сверху одна точка | tepada bitta nuqta | one point above |
| `show.2.1` | каждая сторона основания даёт треугольник | asosning har tomoni uchburchak beradi | each side of the base gives a triangle |
| `show.2.2` | все треугольники сходятся в вершине | barcha uchburchaklar uchda tutashadi | all the triangles meet at the apex |
| `audio.mount` | Внизу многоугольник, сверху одна точка. Соединим точку с каждой вершиной основания. | Pastda ko'pburchak, tepada bitta nuqta. Nuqtani asosning har uchi bilan tutashtiramiz. | A polygon below, one point above. Let us join the point to every vertex of the base. |
| `audio.move*` | Получилось тело, у которого одна грань многоугольник, а остальные треугольники с общей вершиной. Это и есть пирамида, определение на странице сорок пять. Многоугольник называется основанием, треугольники боковыми гранями, а общая точка вершиной пирамиды. Заметь разницу с призмой. У призмы боковые грани параллелограммы и общей вершины нет, а здесь треугольники и вершина одна. Поверни пирамиду и убедись, что все боковые грани приходят в одну и ту же точку при любом ракурсе. | Bir yog'i ko'pburchak, qolganlari umumiy uchli uchburchaklardan iborat jism chiqdi. Bu piramida, ta'rifi qirq beshinchi betda. Ko'pburchak asos, uchburchaklar yon yoqlar, umumiy nuqta esa piramidaning uchi deb ataladi. Prizmadan farqini sezing. Prizmada yon yoqlar parallelogramm va umumiy uch yo'q, bu yerda esa uchburchaklar va uch bitta. Piramidani buring va barcha yon yoqlar har qanday rakursda bir xil nuqtaga kelishiga ishonch hosil qiling. | We got a body with one face a polygon and the rest triangles with a common vertex. That is a pyramid, the definition is on page forty five. The polygon is called the base, the triangles the lateral faces, and the common point the apex. Note the difference from a prism. A prism has parallelograms as lateral faces and no common vertex, here we have triangles and a single apex. Rotate the pyramid and see that all lateral faces arrive at the same point at any view. |
| `audio.work` | Посчитай сам. Сколько граней у четырёхугольной пирамиды? | O'zingiz hisoblang. To'rtburchakli piramidaning nechta yog'i bor? | Work it out yourself. How many faces does a quadrilateral pyramid have? |
| `work.prompt` | Сколько граней? | Nechta yoq? | How many faces? |
| `work.ok` | Пять. Основание и четыре треугольника. | Beshta. Asos va to'rt uchburchak. | Five. The base and four triangles. |
| `work.hint.1` | Считай основание отдельно от боковых. | Asosni yonlaridan alohida sanang. | Count the base separately from the lateral faces. |
| `work.hint.2` | Боковых столько же, сколько сторон у основания. | Yonlari asos tomonlari qanchaligicha. | There are as many lateral faces as base sides. |
| `work.hint.3` | Один плюс четыре. | Bir qo'shuv to'rt. | One plus four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `1 + 4 = 5` |
| `work.answer` | `5` |

---

## Экран 4 · `explain2` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Правильная пирамида: два условия.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Правильная требует двух условий | Muntazam ikki shart talab qiladi | A regular one needs two conditions |
| `show.1.1` | основание стало правильным | asos muntazam bo'ldi | the base became regular |
| `show.1.2` | но вершина сдвинута в сторону | lekin uch chetga surilgan | but the apex is shifted aside |
| `show.2.1` | вершина встала над центром | uch markaz ustiga keldi | the apex stood above the centre |
| `show.2.2` | теперь боковые грани равны | endi yon yoqlar teng | now the lateral faces are equal |
| `audio.mount` | Сделаем основание правильным многоугольником, а вершину пока оставим сдвинутой. | Asosni muntazam ko'pburchak qilamiz, uchni esa hozircha surilgan qoldiramiz. | Let us make the base a regular polygon and leave the apex shifted for now. |
| `audio.move*` | Основание правильное, а боковые грани разные, потому что вершина стоит не над центром. Значит одного условия мало. Правильной называется пирамида, у которой основание правильный многоугольник и боковые грани равны между собой. Так на странице сорок пять. Передвинем вершину над центр основания. Теперь все боковые рёбра равны, все боковые грани равны, и пирамида стала правильной. Поверни её и убедись, что симметрия видна с любой стороны. | Asos muntazam, yon yoqlar esa boshqa-boshqa, chunki uch markaz ustida turmagan. Demak bitta shart kam. Asosi muntazam ko'pburchak va yon yoqlari o'zaro teng bo'lgan piramida muntazam deb ataladi. Qirq beshinchi betda shunday. Uchni asos markazi ustiga suramiz. Endi barcha yon qirralar teng, barcha yon yoqlar teng, va piramida muntazam bo'ldi. Uni buring va simmetriya har tomondan ko'rinishiga ishonch hosil qiling. | The base is regular but the lateral faces differ, because the apex does not stand above the centre. So one condition is not enough. A pyramid is called regular if its base is a regular polygon and its lateral faces are equal to each other. So it is on page forty five. Let us move the apex above the centre of the base. Now all lateral edges are equal, all lateral faces are equal, and the pyramid has become regular. Rotate it and see that the symmetry shows from any side. |
| `audio.work` | Посчитай сам. Сколько условий в определении правильной пирамиды? | O'zingiz hisoblang. Muntazam piramida ta'rifida nechta shart bor? | Work it out yourself. How many conditions are in the definition of a regular pyramid? |
| `work.prompt` | Сколько условий? | Nechta shart? | How many conditions? |
| `work.ok` | Два. Правильное основание и равные боковые грани. | Ikkita. Muntazam asos va teng yon yoqlar. | Two. A regular base and equal lateral faces. |
| `work.hint.1` | Посмотри, что изменилось между двумя кадрами. | Ikki kadr orasida nima o'zgarganini ko'ring. | See what changed between the two frames. |
| `work.hint.2` | Одного правильного основания не хватило. | Bitta muntazam asos yetmadi. | A regular base alone was not enough. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCD = muntazam,   SA = SB = SC = SD` |
| `work.answer` | `2` |

---

## Экран 5 · `explain3` · ответ `number` · тег `apofema-ne-rebro`

Апофема: высота боковой грани.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Апофема идёт в середину стороны | Apofema tomon o'rtasiga boradi | The apothem goes to the middle of the side |
| `show.1.1` | из вершины проведён отрезок в конец стороны | uchdan tomon uchiga kesma o'tkazilgan | a segment is drawn from the apex to the end of a side |
| `show.1.2` | это боковое ребро | bu yon qirra | that is the lateral edge |
| `show.2.1` | и отрезок в середину стороны | va tomon o'rtasiga kesma | and a segment to the middle of the side |
| `show.2.2` | это апофема, и она короче | bu apofema, va u qisqaroq | that is the apothem, and it is shorter |
| `audio.mount` | В правильной пирамиде из вершины можно провести много отрезков к стороне основания. Два из них особые. | Muntazam piramidada uchdan asos tomoniga ko'p kesma o'tkazish mumkin. Ulardan ikkitasi alohida. | In a regular pyramid many segments can be drawn from the apex to a base side. Two of them are special. |
| `audio.move*` | Первый идёт в конец стороны, это боковое ребро. Второй в её середину, и он называется апофемой. Апофема это высота боковой грани, проведённая из вершины пирамиды, так на странице сорок шесть. Почему она перпендикулярна стороне основания, мы уже умеем объяснять. Её проекция это отрезок от центра основания к середине стороны, а он перпендикулярен стороне, потому что в правильном многоугольнике так устроена середина. Дальше работает теорема о трёх перпендикулярах, и прямой угол переносится на саму апофему. Поверни пирамиду и посмотри, что апофема лежит в боковой грани, а ребро на её краю. | Birinchisi tomon uchiga boradi, bu yon qirra. Ikkinchisi o'rtasiga, va u apofema deb ataladi. Apofema piramida uchidan o'tkazilgan yon yoqning balandligi, qirq oltinchi betda shunday. U nima uchun asos tomoniga perpendikulyar ekanini biz allaqachon tushuntira olamiz. Uning proyeksiyasi asos markazidan tomon o'rtasigacha kesma, va u tomonga perpendikulyar, chunki muntazam ko'pburchakda o'rta shunday joylashgan. Keyin uch perpendikulyar haqidagi teorema ishlaydi, va to'g'ri burchak apofemaning o'ziga o'tadi. Piramidani buring va apofema yon yoqda, qirra esa uning chekkasida yotganini ko'ring. | The first goes to the end of the side, that is the lateral edge. The second goes to its middle, and it is called the apothem. The apothem is the height of a lateral face drawn from the apex of the pyramid, so it is on page forty six. Why it is perpendicular to the base side we can already explain. Its projection is the segment from the centre of the base to the middle of the side, and that is perpendicular to the side, because that is how the middle works in a regular polygon. Then the theorem of three perpendiculars takes over and the right angle carries onto the apothem itself. Rotate the pyramid and see that the apothem lies inside the lateral face while the edge is on its border. |
| `audio.work` | Посчитай сам. Сколько апофем у правильной четырёхугольной пирамиды? | O'zingiz hisoblang. Muntazam to'rtburchakli piramidaning nechta apofemasi bor? | Work it out yourself. How many apothems does a regular quadrilateral pyramid have? |
| `work.prompt` | Сколько апофем? | Nechta apofema? | How many apothems? |
| `work.ok` | Четыре. По одной в каждой боковой грани, и все они равны. | To'rtta. Har yon yoqda bittadan, va hammasi teng. | Four. One in each lateral face, and all of them are equal. |
| `work.hint.1` | Посчитай боковые грани. | Yon yoqlarni sanang. | Count the lateral faces. |
| `work.hint.2` | В каждой боковой грани своя высота из вершины. | Har yon yoqda uchdan o'z balandligi bor. | Each lateral face has its own height from the apex. |
| `work.hint.3` | Четыре. | To'rtta. | Four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `SM ⊥ AB` |
| `work.answer` | `4` |

---

## Экран 6 · `explain4` · ответ `number` · тег `apofema-ne-rebro`

Сам: апофема по высоте и половине стороны.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Апофема через высоту | Balandlik orqali apofema | The apothem through the height |
| `show.1.1` | высота пирамиды стоит в центре | piramida balandligi markazda turadi | the height of the pyramid stands at the centre |
| `show.1.2` | от центра до середины стороны три | markazdan tomon o'rtasigacha uch | from the centre to the middle of the side is three |
| `show.2.1` | высота четыре | balandlik to'rt | the height is four |
| `show.2.2` | треугольник прямоугольный | uchburchak to'g'ri burchakli | the triangle is right-angled |
| `audio.mount` | Высота правильной пирамиды стоит в центре основания. От центра до середины стороны три, высота четыре. | Muntazam piramidaning balandligi asos markazida turadi. Markazdan tomon o'rtasigacha uch, balandlik to'rt. | The height of a regular pyramid stands at the centre of the base. From the centre to the middle of a side is three, the height is four. |
| `audio.move*` | Посмотри на треугольник, у которого один катет это высота пирамиды, второй отрезок от центра до середины стороны, а гипотенуза это апофема. Прямой угол там, где высота приходит в основание, потому что высота перпендикулярна плоскости основания, а отрезок лежит в этой плоскости. Значит работает Пифагор. Три и четыре дают пять. Обрати внимание, что боковое ребро в этом треугольнике не участвует, у него свой треугольник и своя длина. | Bir kateti piramida balandligi, ikkinchisi markazdan tomon o'rtasigacha kesma, gipotenuzasi esa apofema bo'lgan uchburchakka qarang. To'g'ri burchak balandlik asosga kelgan joyda, chunki balandlik asos tekisligiga perpendikulyar, kesma esa shu tekislikda yotadi. Demak Pifagor ishlaydi. Uch va to'rt beshni beradi. E'tibor bering, yon qirra bu uchburchakda qatnashmaydi, uning o'z uchburchagi va o'z uzunligi bor. | Look at the triangle whose one leg is the height of the pyramid, the other is the segment from the centre to the middle of the side, and the hypotenuse is the apothem. The right angle is where the height arrives at the base, because the height is perpendicular to the plane of the base while the segment lies in that plane. So Pythagoras works. Three and four give five. Note that the lateral edge does not take part in this triangle, it has its own triangle and its own length. |
| `audio.work` | Посчитай сам. Какова апофема? | O'zingiz hisoblang. Apofema qancha? | Work it out yourself. What is the apothem? |
| `work.prompt` | Найди апофему | Apofemani toping | Find the apothem |
| `work.ok` | Пять. Три и четыре дают пять. | Besh. Uch va to'rt beshni beradi. | Five. Three and four give five. |
| `work.hint.1` | Найди прямоугольный треугольник с апофемой в гипотенузе. | Gipotenuzasida apofema bo'lgan to'g'ri burchakli uchburchakni toping. | Find the right triangle with the apothem as the hypotenuse. |
| `work.hint.2` | Катеты это высота и отрезок от центра. | Katetlar balandlik va markazdan chiqqan kesma. | The legs are the height and the segment from the centre. |
| `work.hint.3` | Три и четыре дают пять. | Uch va to'rt beshni beradi. | Three and four give five. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `SO = 4,   OM = 3,   SM = ?` |
| `work.answer` | `5` |

---

## Экран 7 · `explain5` · ответ `number` · тег `apofema-ne-rebro`

Граница: высота падает в центр только у правильной.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Куда падает высота | Balandlik qayerga tushadi | Where the height lands |
| `show.1.1` | у правильной пирамиды высота в центре | muntazam piramidada balandlik markazda | in a regular pyramid the height is at the centre |
| `show.1.2` | все боковые рёбра равны | barcha yon qirralar teng | all lateral edges are equal |
| `show.2.1` | вершину сдвинули в сторону | uch chetga surildi | the apex was shifted aside |
| `show.2.2` | рёбра стали разными | qirralar boshqa bo'ldi | the edges became different |
| `audio.mount` | У правильной пирамиды высота приходит точно в центр основания. Посмотрим, что будет, если вершину сдвинуть. | Muntazam piramidada balandlik aynan asos markaziga keladi. Uchni surganda nima bo'lishini ko'ramiz. | In a regular pyramid the height arrives exactly at the centre of the base. Let us see what happens if the apex is shifted. |
| `audio.move*` | Как только вершина ушла в сторону, боковые рёбра стали разной длины, а боковые грани разными треугольниками. Апофем в обычном смысле больше нет, потому что высоты боковых граней теперь тоже разные. Отсюда правило. Считать апофему через центр можно только у правильной пирамиды, и проверять надо не глазом, а условием про равные рёбра. На неподвижном чертеже сдвиг вершины почти не заметен, и это ровно та ошибка, которую мы ловили в уроке про перпендикулярность. | Uch chetga ketishi bilanoq yon qirralar boshqa uzunlikda, yon yoqlar esa boshqa uchburchak bo'ldi. Oddiy ma'nodagi apofema endi yo'q, chunki yon yoqlarning balandliklari ham boshqa. Qoida shundan. Apofemani markaz orqali hisoblash faqat muntazam piramidada mumkin, va ko'z bilan emas, teng qirralar sharti bilan tekshirish kerak. Qimirlamas chizmada uchning surilishi deyarli sezilmaydi, va bu aynan perpendikulyarlik darsida tutgan xatomiz. | As soon as the apex moved aside, the lateral edges got different lengths and the lateral faces became different triangles. There are no apothems in the usual sense any more, because the heights of the lateral faces now differ too. Hence the rule. The apothem can be computed through the centre only for a regular pyramid, and it has to be checked by the condition about equal edges rather than by eye. On a still drawing the shift of the apex is almost invisible, and that is exactly the mistake we caught in the lesson about perpendicularity. |
| `audio.work` | Посчитай сам. Сколько боковых рёбер равны между собой у правильной четырёхугольной пирамиды? | O'zingiz hisoblang. Muntazam to'rtburchakli piramidada nechta yon qirra o'zaro teng? | Work it out yourself. How many lateral edges are equal to each other in a regular quadrilateral pyramid? |
| `work.prompt` | Сколько равных боковых рёбер? | Nechta teng yon qirra? | How many equal lateral edges? |
| `work.ok` | Все четыре. Вершина над центром, значит расстояния до вершин основания равны. | To'rttasi ham. Uch markaz ustida, demak asos uchlarigacha masofalar teng. | All four. The apex is above the centre, so the distances to the base vertices are equal. |
| `work.hint.1` | Посчитай боковые рёбра. | Yon qirralarni sanang. | Count the lateral edges. |
| `work.hint.2` | Вершины правильного многоугольника равноудалены от центра. | Muntazam ko'pburchakning uchlari markazdan baravar uzoqlikda. | The vertices of a regular polygon are equidistant from the centre. |
| `work.hint.3` | Все четыре. | To'rttasi ham. | All four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `SO ⊥ ABCD,   OA = OB = OC = OD` |
| `work.answer` | `4` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `apofema-ne-rebro`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Апофема и ребро | Apofema va qirra | The apothem and the edge |
| `probe.question` | Куда приходит апофема? | Apofema qayerga keladi? | Where does the apothem arrive? |
| `probe.a` [верно] | в середину стороны основания | asos tomonining o'rtasiga | at the middle of a base side |
| `probe.b` | в вершину основания | asosning uchiga | at a vertex of the base |
| `probe.b.hint` | В вершину приходит боковое ребро. | Uchga yon qirra keladi. | It is the lateral edge that arrives at a vertex. |
| `rule.lawLabel` | Апофема | Apofema | The apothem |
| `rule.lines.1` | пирамида это многоугольник и треугольники с общей вершиной | piramida ko'pburchak va umumiy uchli uchburchaklar | a pyramid is a polygon and triangles with a common vertex |
| `rule.lines.2` | правильная пирамида это правильное основание и равные боковые грани | muntazam piramida muntazam asos va teng yon yoqlar | a regular pyramid means a regular base and equal lateral faces |
| `rule.lines.3` | апофема это высота боковой грани из вершины пирамиды | apofema piramida uchidan yon yoq balandligi | the apothem is the height of a lateral face from the apex |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Апофема и боковое ребро выходят из одной точки и идут к одной стороне основания, но приходят в разные её точки. Ребро в конец, апофема в середину. Апофема короче, потому что в боковой грани она катет, а ребро гипотенуза того же прямоугольного треугольника. Поэтому в задачах их нельзя подставлять одну вместо другой, даже когда на чертеже они почти совпали. | Apofema va yon qirra bir nuqtadan chiqadi va asosning bir tomoniga boradi, lekin uning boshqa nuqtalariga keladi. Qirra uchiga, apofema o'rtasiga. Apofema qisqaroq, chunki yon yoqda u katet, qirra esa o'sha to'g'ri burchakli uchburchakning gipotenuzasi. Shuning uchun masalalarda ularni bir-birining o'rniga qo'yish mumkin emas, chizmada deyarli ustma-ust tushgan bo'lsa ham. | The apothem and the lateral edge leave the same point and go to the same base side, but arrive at different points of it. The edge at the end, the apothem at the middle. The apothem is shorter, because inside the lateral face it is a leg while the edge is the hypotenuse of the same right triangle. That is why they cannot be substituted for one another in problems, even when they almost coincide on the drawing. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `SM < SA` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `apofema-ne-rebro`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Назови каждый отрезок | Har bir kesmani nomlang | Name each segment |
| `match.prompt` | Соедини запись с названием | Yozuvni nomi bilan birlashtiring | Match the reading with the name |
| `match.ok` | Все четыре на месте. Апофема и ребро больше не путаются. | To'rttasi ham joyida. Apofema va qirra endi aralashmaydi. | All four in place. The apothem and the edge no longer get mixed up. |
| `audio.mount` | Четыре записи и четыре названия. Соедини их. | To'rt yozuv va to'rt nom. Ularni birlashtiring. | Four readings and four names. Match them. |
| `match.a` | боковое ребро | yon qirra | a lateral edge |
| `match.b` | апофема | apofema | the apothem |
| `match.c` | высота пирамиды | piramida balandligi | the height of the pyramid |
| `match.d` | сторона основания | asos tomoni | a base side |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `SA` · `SM` · `SO` · `AB` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `apofema-ne-rebro`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи про боковые рёбра | Yon qirralar haqida isbotlang | Prove it about the lateral edges |
| `proof.given` | правильная пирамида | muntazam piramida | a regular pyramid |
| `proof.goal` | её боковые рёбра равны | uning yon qirralari teng | its lateral edges are equal |
| `proof.r1` | вершины основания равноудалены от центра | asos uchlari markazdan baravar uzoqlikda | the base vertices are equidistant from the centre |
| `proof.r2` | высота перпендикулярна основанию | balandlik asosga perpendikulyar | the height is perpendicular to the base |
| `proof.r3` | прямоугольные треугольники равны по двум катетам | to'g'ri burchakli uchburchaklar ikki katet bo'yicha teng | the right triangles are equal by two legs |
| `proof.ok` | Доказано. Равные катеты дают равные гипотенузы, то есть равные рёбра. | Isbotlandi. Teng katetlar teng gipotenuza beradi, ya'ni teng qirra. | Proved. Equal legs give equal hypotenuses, that is equal edges. |
| `proof.e1` | Высота идёт дальше. Сначала про основание. | Balandlik keyin keladi. Avval asos haqida. | The height comes later. First about the base. |
| `proof.e2` | Про основание сказано. Откуда прямые углы. | Asos haqida aytildi. To'g'ri burchaklar qayerdan. | The base is done. Where do the right angles come from. |
| `proof.e3` | Углы и катеты есть. Теперь вывод про треугольники. | Burchaklar va katetlar bor. Endi uchburchaklar haqida xulosa. | The angles and legs are there. Now the conclusion about the triangles. |
| `reason.s1` | свойство правильного многоугольника | muntazam ko'pburchak xossasi | a property of a regular polygon |
| `reason.s2` | перпендикуляр даёт прямой угол со всеми прямыми плоскости | perpendikulyar tekislikning barcha chiziqlari bilan to'g'ri burchak beradi | a perpendicular gives a right angle with all lines of the plane |
| `reason.s3` | признак равенства прямоугольных треугольников | to'g'ri burchakli uchburchaklar tengligi alomati | the criterion of equality of right triangles |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `OA = OB   →   SA = SB` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Тринадцать. Пять и двенадцать дают тринадцать. | O'n uch. Besh va o'n ikki o'n uchni beradi. | Thirteen. Five and twelve give thirteen. |
| `task.hint.1` | Нарисуй треугольник с высотой и отрезком от центра. | Balandlik va markazdan kesma bilan uchburchak chizing. | Draw the triangle with the height and the segment from the centre. |
| `task.hint.2` | Апофема это гипотенуза. | Apofema gipotenuza. | The apothem is the hypotenuse. |
| `task.hint.3` | Пять и двенадцать дают тринадцать. | Besh va o'n ikki o'n uchni beradi. | Five and twelve give thirteen. |
| `order.prompt` | Расставь записи в том порядке, в каком считают | Yozuvlarni hisoblash tartibida joylashtiring | Arrange the readings in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Сначала половина стороны, потом апофема. | Tartib to'g'ri. Avval tomonning yarmi, keyin apofema. | The order is right. First half the side, then the apothem. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как считают. | Endi yozuvlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the readings. Arrange them the way they are computed. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `SO = 12,   OM = 5,   SM = ?` |
| `task.answer` | `13` |
| `order.items` | `SM` · `AB` · `OM` · `SO` |
| `order.answer` | `AB  OM  SO  SM` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Половина стороны найдена верно. | Tomonning yarmi to'g'ri topilgan. | Half the side is found correctly. |
| `hint.r4` | Ответ получен из неверной строки выше. | Javob yuqoridagi xato qatordan olingan. | The answer comes from the wrong line above. |
| `proof` | Поверни пирамиду: этот отрезок приходит в вершину, а не в середину стороны. | Piramidani buring: bu kesma tomon o'rtasiga emas, uchiga keladi. | Rotate the pyramid: this segment arrives at a vertex, not at the middle of the side. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Апофемой назвали боковое ребро. | Uchinchi. Apofema deb yon qirra aytilgan. | The third. The lateral edge was called the apothem. |
| `entry.hint.1` | Проверь, куда приходит каждый отрезок. | Har kesma qayerga kelishini tekshiring. | Check where each segment arrives. |
| `entry.hint.2` | Апофема приходит в середину стороны. | Apofema tomon o'rtasiga keladi. | The apothem arrives at the middle of the side. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них подменяет отрезок. | To'rt qator, va ulardan biri kesmani almashtiradi. | Four lines, and one of them substitutes the segment. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `AB = 6,   SO = 4` |
| `row.r2` | `OM = 3` |
| `row.r3` | `SM = SA` |
| `row.r4` | `SM = 5` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Апофема десять, от центра до середины стороны шесть. Какова высота? | Apofema o'n, markazdan tomon o'rtasigacha olti. Balandlik qancha? | The apothem is ten, from the centre to the middle of the side is six. What is the height? |
| `place.ok` | Восемь. Сто минус тридцать шесть это шестьдесят четыре. | Sakkiz. Yuz minus o'ttiz olti bu oltmish to'rt. | Eight. One hundred minus thirty six is sixty four. |
| `place.wrong` | Апофема гипотенуза, значит из её квадрата вычитают. | Apofema gipotenuza, demak uning kvadratidan ayiriladi. | The apothem is the hypotenuse, so you subtract from its square. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для правильной пирамиды | Muntazam piramida uchun nima to'g'ri | What is true for a regular pyramid |
| `multi.d.hint` | Апофема короче ребра, а не равна ему. | Apofema qirradan qisqaroq, unga teng emas. | The apothem is shorter than the edge, not equal to it. |
| `multi.e.hint` | Высота падает в центр, а не в вершину основания. | Balandlik markazga tushadi, asos uchiga emas. | The height lands at the centre, not at a base vertex. |
| `multi.ok` | Три записи из пяти. Две оставшиеся путают отрезки. | Beshtadan uch yozuv. Qolgan ikkitasi kesmalarni aralashtiradi. | Three readings out of five. The other two confuse the segments. |
| `audio.mount` | Прочитаем формулу справа налево. По апофеме найдём высоту. | Formulani o'ngdan chapga o'qiymiz. Apofema bo'yicha balandlikni topamiz. | Let us read the formula from right to left. From the apothem we find the height. |
| `audio.work` | Отметь все записи, которые верны для правильной пирамиды. Их больше одной. | Muntazam piramida uchun to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are true for a regular pyramid. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `8` |
| `place.step` | `100 − 36 = 64` |
| `multi.a` [верно] | `SM < SA` |
| `multi.b` [верно] | `SM² = SO² + OM²` |
| `multi.c` [верно] | `SA = SB = SC = SD` |
| `multi.d` | `SM = SA` |
| `multi.e` | `SO ⊥ ABCD,   O = A` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `apofema-ne-rebro`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Какие грани у пирамиды боковые? | Piramidaning qaysi yoqlari yon? | Which faces of a pyramid are lateral? |
| `q1.a` [верно] | треугольники с общей вершиной | umumiy uchli uchburchaklar | triangles with a common vertex |
| `q1.b` | параллелограммы | parallelogrammlar | parallelograms |
| `q1.b.hint` | Параллелограммы у призмы. | Parallelogrammlar prizmada. | Parallelograms belong to a prism. |
| `q1.c` | два равных многоугольника | ikki teng ko'pburchak | two equal polygons |
| `q1.c.hint` | Это основания призмы. | Bu prizmaning asoslari. | Those are the bases of a prism. |
| `q1.d` | все грани | barcha yoqlar | all the faces |
| `q1.d.hint` | Основание боковой гранью не бывает. | Asos yon yoq bo'lmaydi. | The base is never a lateral face. |
| `q2.prompt` | Куда приходит апофема? | Apofema qayerga keladi? | Where does the apothem arrive? |
| `q2.a` [верно] | в середину стороны | tomon o'rtasiga | at the middle of a side |
| `q2.b` | в вершину основания | asos uchiga | at a base vertex |
| `q2.b.hint` | Туда приходит боковое ребро. | U yerga yon qirra keladi. | The lateral edge arrives there. |
| `q2.c` | в центр основания | asos markaziga | at the centre of the base |
| `q2.c.hint` | В центр приходит высота. | Markazga balandlik keladi. | The height arrives at the centre. |
| `q2.d` | в любую точку стороны | tomonning istalgan nuqtasiga | at any point of a side |
| `q2.d.hint` | Тогда её длина не была бы определена. | Unda uning uzunligi aniq bo'lmasdi. | Then its length would not be defined. |
| `q3.prompt` | Что короче в правильной пирамиде? | Muntazam piramidada nima qisqaroq? | Which is shorter in a regular pyramid? |
| `q3.a` [верно] | апофема | apofema | the apothem |
| `q3.b` | боковое ребро | yon qirra | the lateral edge |
| `q3.b.hint` | Ребро гипотенуза того же треугольника. | Qirra o'sha uchburchakning gipotenuzasi. | The edge is the hypotenuse of that triangle. |
| `q3.c` | они равны | ular teng | they are equal |
| `q3.c.hint` | Равны они были бы при нулевой половине стороны. | Ular tomonning yarmi nol bo'lganda teng bo'lardi. | They would be equal if half the side were zero. |
| `q3.d` | зависит от пирамиды | piramidaga bog'liq | it depends on the pyramid |
| `q3.d.hint` | В любой правильной пирамиде апофема короче. | Har qanday muntazam piramidada apofema qisqaroq. | In any regular pyramid the apothem is shorter. |
| `q4.prompt` | Сколько граней у шестиугольной пирамиды? | Oltiburchakli piramidaning nechta yog'i bor? | How many faces does a hexagonal pyramid have? |
| `q4.a` [верно] | семь | yettita | seven |
| `q4.b` | шесть | oltita | six |
| `q4.b.hint` | Шесть это только боковые. | Olti faqat yonlari. | Six are only the lateral ones. |
| `q4.c` | восемь | sakkizta | eight |
| `q4.c.hint` | Восемь было бы у шестиугольной призмы. | Sakkiz oltiburchakli prizmada bo'lardi. | Eight would belong to a hexagonal prism. |
| `q4.d` | двенадцать | o'n ikkita | twelve |
| `q4.d.hint` | Двенадцать это число рёбер. | O'n ikki qirralar soni. | Twelve is the number of edges. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `SAB,   SBC` |
| `q2.done` | `AM = MB` |
| `q3.done` | `SM < SA` |
| `q4.done` | `6 + 1 = 7` |
| `angles` | `SA` · `SM` · `SO` · `AB` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Знаю, что боковые грани пирамиды треугольники с общей вершиной | Piramidaning yon yoqlari umumiy uchli uchburchak ekanini bilaman | I know the lateral faces of a pyramid are triangles with a common vertex |
| `can.2` | Проверяю у правильной пирамиды два условия | Muntazam piramidada ikki shartni tekshiraman | I check two conditions for a regular pyramid |
| `can.3` | Отличаю апофему от бокового ребра | Apofemani yon qirradan ajrataman | I tell the apothem from the lateral edge |
| `can.4` | Считаю апофему через высоту и половину стороны | Apofemani balandlik va tomonning yarmi bo'yicha hisoblayman | I compute the apothem from the height and half the side |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше площадь поверхности — тело разворачивается в плоскую фигуру | Bundan keyin sirt yuzasi, jism yassi shaklga yoyiladi | Next comes the surface area, where the body unfolds into a flat figure |
| `lifehack` | Взял отрезок из вершины — сначала спроси, куда он приходит | Uchdan kesma olsangiz, avval u qayerga kelishini so'rang | Taking a segment from the apex, first ask where it arrives |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страницы сорок пять и сорок шесть | Geometriya, qirq beshinchi va qirq oltinchi betlar | Geometry, pages forty five and forty six |
| `audio.mount` | Урок начался с двух отрезков из вершины. Один шёл в конец стороны, другой в середину. | Dars uchdan chiqqan ikki kesma bilan boshlandi. Biri tomon uchiga, ikkinchisi o'rtasiga borardi. | The lesson began with two segments from the apex. One went to the end of a side, the other to the middle. |
| `audio.next` | Тот, что в середину, называется апофемой, и он короче. Причина проста. В боковой грани апофема катет, а ребро гипотенуза того же прямоугольного треугольника. И ещё одно важное. Апофема перпендикулярна стороне основания не по чертежу, а по теореме о трёх перпендикулярах, которую мы доказали в блоке про плоскости. Дальше пирамида и призма развернутся в плоскую фигуру, и мы посчитаем площадь поверхности. | O'rtasiga boradigani apofema deb ataladi, va u qisqaroq. Sabab oddiy. Yon yoqda apofema katet, qirra esa o'sha to'g'ri burchakli uchburchakning gipotenuzasi. Va yana bir muhim narsa. Apofema asos tomoniga chizma bo'yicha emas, tekisliklar bloki da isbotlagan uch perpendikulyar haqidagi teorema bo'yicha perpendikulyar. Keyin piramida va prizma yassi shaklga yoyiladi, va biz sirt yuzasini hisoblaymiz. | The one to the middle is called the apothem and it is shorter. The reason is simple. Inside the lateral face the apothem is a leg and the edge is the hypotenuse of the same right triangle. And one more important thing. The apothem is perpendicular to the base side not by the drawing but by the theorem of three perpendiculars, which we proved in the block about planes. Next the pyramid and the prism will unfold into a flat figure and we will compute the surface area. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `SM > SA` |
| `hook.b` | `SM < SA` |
| `proved` | `SM < SA` |
| `law` | `SM ⊥ AB` |
| `sheet.1` | `SAB,   SBC` |
| `sheet.2` | `SA = SB = SC = SD` |
| `sheet.3` | `SM ⊥ AB` |
| `sheet.4` | `SM² = SO² + OM²` |
| `sheet.5` | `SM < SA` |
