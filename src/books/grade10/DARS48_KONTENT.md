# Урок 48 — Правильные призмы и пирамиды · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS47_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, стр. 45 — «правильной призмой
называется прямая призма, основание которой правильный многоугольник» и «правильной пирамидой
называется пирамида, у которой основание правильный многоугольник, а боковые грани равны между
собой». Определения взяты дословно.

**Чтение строки плана.** Строка плана называется «Правильные». В учебнике 10 класса правильные
многогранники в смысле Платоновых тел не встречаются: там правильная **призма** и правильная
**пирамида**, стр. 45. Урок читает строку так. Если методист имел в виду Платоновы тела, урок
переписывается, и тогда нужен источник вне учебника 10 класса.

**Главное решение урока.** Ошибка года: «правильная» понимается как «все рёбра равны». У
правильной призмы сторона основания и боковое ребро независимы, и разных длин две, а не одна.
Все рёбра равны только у куба, и это частный случай, а не определение.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`muntazam prizma`, `muntazam piramida`, `muntazam ko'pburchak` взяты из учебника, стр. 45.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛЬНАЯ | MUNTAZAM | REGULAR |
| `title` | Одна длина или две | Bitta uzunlik yoki ikki | One length or two |
| `row.a.name` | одна | bitta | one |
| `row.b.name` | две | ikkita | two |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посмотрим на рёбра. | Javobingiz yozib olindi. Endi qirralarga qaraymiz. | Your answer is recorded. Now we look at the edges. |
| `audio.mount` | Правильная шестиугольная призма. Вопрос про её рёбра: сколько среди них разных длин. | Muntazam oltiburchakli prizma. Savol uning qirralari haqida: ular orasida nechta xil uzunlik bor. | A regular hexagonal prism. The question is about its edges: how many different lengths are among them. |
| `audio.r1` | Первая запись говорит, что длина одна, то есть все рёбра равны. | Birinchi yozuv uzunlik bitta, ya'ni barcha qirralar teng deydi. | The first reading says there is one length, that is all the edges are equal. |
| `audio.r2` | Вторая говорит, что длин две. | Ikkinchisi ikki uzunlik deydi. | The second says there are two lengths. |
| `audio.ask` | Слово правильная звучит так, будто равно всё. Как думаешь, какая запись верная? | Muntazam so'zi hammasi teng degandek eshitiladi. Sizningcha qaysi yozuv to'g'ri? | The word regular sounds as if everything is equal. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCDEFA₁B₁C₁D₁E₁F₁` |
| `row.a.value` | `1` |
| `row.b.value` | `2` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из блока | Blokdan uch savol | Three questions from the block |
| `q1.prompt` | Когда призма прямая? | Prizma qachon to'g'ri? | When is a prism right? |
| `q1.a` [верно] | боковое ребро перпендикулярно основанию | yon qirra asosga perpendikulyar | the lateral edge is perpendicular to the base |
| `q1.b` | основание правильное | asos muntazam | the base is regular |
| `q1.b.hint` | Это про основание, а прямая про ребро. | Bu asos haqida, to'g'ri esa qirra haqida. | That is about the base, right is about the edge. |
| `q1.c` | все рёбра равны | barcha qirralar teng | all edges are equal |
| `q1.c.hint` | Равные рёбра бывают только у куба. | Teng qirralar faqat kubda bo'ladi. | Equal edges happen only in a cube. |
| `q1.d` | стоит на основании | asosda turadi | it stands on its base |
| `q1.d.hint` | Как стоит на чертеже, к делу не относится. | Chizmada qanday turgani ishga aloqasi yo'q. | How it stands on the drawing is irrelevant. |
| `q2.prompt` | Что такое апофема? | Apofema nima? | What is the apothem? |
| `q2.a` [верно] | высота боковой грани из вершины | uchdan yon yoqning balandligi | the height of a lateral face from the apex |
| `q2.b` | боковое ребро | yon qirra | the lateral edge |
| `q2.b.hint` | Ребро приходит в вершину основания. | Qirra asos uchiga keladi. | The edge arrives at a base vertex. |
| `q2.c` | высота пирамиды | piramida balandligi | the height of the pyramid |
| `q2.c.hint` | Высота идёт в центр основания. | Balandlik asos markaziga boradi. | The height goes to the centre of the base. |
| `q2.d` | половина стороны | tomonning yarmi | half the side |
| `q2.d.hint` | Половина стороны это катет, а не апофема. | Tomonning yarmi katet, apofema emas. | Half the side is a leg, not the apothem. |
| `q3.prompt` | Боковая поверхность прямой призмы? | To'g'ri prizmaning yon sirti? | The lateral area of a right prism? |
| `q3.a` [верно] | периметр на высоту | perimetr karra balandlik | the perimeter times the height |
| `q3.b` | сторона на высоту | tomon karra balandlik | a side times the height |
| `q3.b.hint` | Сторона даёт одну грань, а не всю ленту. | Tomon bitta yoq beradi, butun tasmani emas. | A side gives one face, not the whole strip. |
| `q3.c` | половина периметра на высоту | perimetrning yarmi karra balandlik | half the perimeter times the height |
| `q3.c.hint` | Половина появляется у пирамиды. | Yarim piramidada paydo bo'ladi. | The half appears for a pyramid. |
| `q3.d` | площадь основания на высоту | asos yuzasi karra balandlik | the base area times the height |
| `q3.d.hint` | Это уже не площадь поверхности. | Bu endi sirt yuzasi emas. | That is no longer a surface area. |
| `audio.mount` | Три вопроса. Слово правильная соберётся из первых двух. | Uchta savol. Muntazam so'zi birinchi ikkitasidan yig'iladi. | Three questions. The word regular will be assembled from the first two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `AA₁ ⊥ ABCD` |
| `q2.done` | `SM ⊥ AB` |
| `q3.done` | `P·h` |

---

## Экран 3 · `explain1` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Правильная призма: два условия.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Прямая плюс правильное основание | To'g'ri qo'shuv muntazam asos | Right plus a regular base |
| `show.1.1` | основание правильный многоугольник | asos muntazam ko'pburchak | the base is a regular polygon |
| `show.1.2` | но боковое ребро наклонено | lekin yon qirra og'gan | but the lateral edge is slanted |
| `show.2.1` | ребро встало перпендикулярно | qirra perpendikulyar bo'ldi | the edge stood perpendicular |
| `show.2.2` | теперь призма правильная | endi prizma muntazam | now the prism is regular |
| `audio.mount` | Возьмём призму с правильным шестиугольником в основании, но с наклонным боковым ребром. | Asosida muntazam oltiburchak bo'lgan, lekin yon qirrasi og'ma prizmani olamiz. | Take a prism with a regular hexagon in the base but with a slanted lateral edge. |
| `audio.move*` | Основание правильное, а призма правильной не является: она наклонная. Правильной призмой называется прямая призма, основание которой правильный многоугольник. Так на странице сорок пять. Условий два, и они независимы. Поставим ребро перпендикулярно основанию, и призма станет правильной. Заметь, что про равенство рёбер в определении нет ни слова, и это не случайно: сторона основания и высота задаются отдельно. | Asos muntazam, prizma esa muntazam emas: u og'ma. Asosi muntazam ko'pburchakdan iborat to'g'ri prizma muntazam prizma deb ataladi. Qirq beshinchi betda shunday. Shartlar ikkita, va ular mustaqil. Qirrani asosga perpendikulyar qo'yamiz, va prizma muntazam bo'ladi. E'tibor bering, ta'rifda qirralarning tengligi haqida bir so'z ham yo'q, va bu bejiz emas: asos tomoni va balandlik alohida beriladi. | The base is regular but the prism is not: it is slanted. A regular prism is a right prism whose base is a regular polygon. So it is on page forty five. There are two conditions and they are independent. Let us set the edge perpendicular to the base and the prism becomes regular. Note that the definition says nothing about the edges being equal, and that is no accident: the base side and the height are given separately. |
| `audio.work` | Посчитай сам. Сколько условий в определении правильной призмы? | O'zingiz hisoblang. Muntazam prizma ta'rifida nechta shart bor? | Work it out yourself. How many conditions are in the definition of a regular prism? |
| `work.prompt` | Сколько условий? | Nechta shart? | How many conditions? |
| `work.ok` | Два. Прямая и правильное основание. | Ikkita. To'g'ri va muntazam asos. | Two. Right, and a regular base. |
| `work.hint.1` | Посмотри, что изменилось между кадрами. | Kadrlar orasida nima o'zgarganini ko'ring. | See what changed between the frames. |
| `work.hint.2` | Правильного основания одного не хватило. | Muntazam asos bitta o'zi yetmadi. | A regular base alone was not enough. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AA₁ ⊥ ABCDEF,   AB = BC = … = FA` |
| `work.answer` | `2` |

---

## Экран 4 · `explain2` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Все боковые грани равны.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Боковые грани равные прямоугольники | Yon yoqlar teng to'g'ri to'rtburchaklar | The lateral faces are equal rectangles |
| `show.1.1` | все стороны основания равны | asosning barcha tomonlari teng | all the base sides are equal |
| `show.1.2` | высота у всех граней одна | barcha yoqlarning balandligi bir | all the faces share one height |
| `show.2.1` | значит грани равны между собой | demak yoqlar o'zaro teng | so the faces are equal to each other |
| `show.2.2` | в развёртке это одинаковые куски | yoyilmada bu bir xil bo'laklar | in the net these are identical pieces |
| `audio.mount` | Развернём боковую поверхность правильной призмы. | Muntazam prizmaning yon sirtini yoyamiz. | Let us unfold the lateral surface of a regular prism. |
| `audio.move*` | В развёртке боковые грани легли в ленту, и все куски получились одинаковыми. Причина в двух условиях определения. Основание правильное, значит все его стороны равны, а это основания прямоугольников. Призма прямая, значит высота у всех прямоугольников одна и равна высоте призмы. Прямоугольники с равными сторонами равны, поэтому и боковые грани равны. Отсюда формула становится короче: периметр это n умножить на сторону, и боковая поверхность это n умножить на сторону и на высоту. | Yoyilmada yon yoqlar tasmaga yotdi, va barcha bo'laklar bir xil chiqdi. Sabab ta'rifning ikki shartida. Asos muntazam, demak uning barcha tomonlari teng, bu esa to'g'ri to'rtburchaklarning asoslari. Prizma to'g'ri, demak barcha to'g'ri to'rtburchaklarning balandligi bir xil va prizma balandligiga teng. Tomonlari teng to'g'ri to'rtburchaklar teng, shuning uchun yon yoqlar ham teng. Formula ham shundan qisqaradi: perimetr n karra tomon, yon sirt esa n karra tomon karra balandlik. | In the net the lateral faces lay down in a strip and all the pieces came out identical. The reason is in the two conditions of the definition. The base is regular, so all its sides are equal, and those are the bases of the rectangles. The prism is right, so all the rectangles share one height equal to the height of the prism. Rectangles with equal sides are equal, so the lateral faces are equal too. Hence the formula gets shorter: the perimeter is n times the side, and the lateral area is n times the side times the height. |
| `audio.work` | Посчитай сам. Сколько равных боковых граней у правильной шестиугольной призмы? | O'zingiz hisoblang. Muntazam oltiburchakli prizmaning nechta teng yon yog'i bor? | Work it out yourself. How many equal lateral faces does a regular hexagonal prism have? |
| `work.prompt` | Сколько равных боковых граней? | Nechta teng yon yoq? | How many equal lateral faces? |
| `work.ok` | Шесть. Столько же, сколько сторон у основания. | Oltita. Asos tomonlari qanchaligicha. | Six. As many as the base has sides. |
| `work.hint.1` | Посчитай куски в ленте развёртки. | Yoyilma tasmasidagi bo'laklarni sanang. | Count the pieces in the strip of the net. |
| `work.hint.2` | Каждая сторона основания даёт одну грань. | Asosning har tomoni bitta yoq beradi. | Each base side gives one face. |
| `work.hint.3` | Шесть. | Oltita. | Six. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = n·a·h` |
| `work.answer` | `6` |

---

## Экран 5 · `explain3` · ответ `number` · тег `apofema-ne-rebro`

Правильная пирамида: равные грани и равные апофемы.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Апофемы правильной пирамиды равны | Muntazam piramida apofemalari teng | The apothems of a regular pyramid are equal |
| `show.1.1` | основание правильное | asos muntazam | the base is regular |
| `show.1.2` | боковые грани равны между собой | yon yoqlar o'zaro teng | the lateral faces are equal to each other |
| `show.2.1` | в каждой грани своя апофема | har yoqda o'z apofemasi | each face has its own apothem |
| `show.2.2` | и все апофемы равны | va barcha apofemalar teng | and all the apothems are equal |
| `audio.mount` | Правильная шестиугольная пирамида. Развернём её боковую поверхность. | Muntazam oltiburchakli piramida. Uning yon sirtini yoyamiz. | A regular hexagonal pyramid. Let us unfold its lateral surface. |
| `audio.move*` | Боковые грани по определению равны между собой, и в развёртке это шесть одинаковых треугольников. У каждого основание это сторона основания пирамиды, а высота это апофема. Раз треугольники равны, то и апофемы равны, и это позволяет считать боковую поверхность одной формулой: половина периметра умножить на апофему. Обрати внимание, что апофема одна для всей пирамиды только потому, что пирамида правильная. У произвольной пирамиды апофем в этом смысле нет вовсе. | Yon yoqlar ta'rifga ko'ra o'zaro teng, va yoyilmada bu oltita bir xil uchburchak. Har birining asosi piramida asosining tomoni, balandligi esa apofema. Uchburchaklar teng bo'lsa, apofemalar ham teng, va bu yon sirtni bitta formula bilan hisoblashga imkon beradi: perimetrning yarmi karra apofema. E'tibor bering, apofema butun piramida uchun bitta bo'lishi faqat piramida muntazam bo'lgani uchun. Ixtiyoriy piramidada bu ma'noda apofema umuman yo'q. | The lateral faces are equal to each other by definition, and in the net that is six identical triangles. For each of them the base is a side of the pyramid base and the height is the apothem. Since the triangles are equal, the apothems are equal too, and that lets us compute the lateral area with one formula: half the perimeter times the apothem. Note that there is a single apothem for the whole pyramid only because the pyramid is regular. An arbitrary pyramid has no apothem in this sense at all. |
| `audio.work` | Посчитай сам. Сколько равных апофем у правильной шестиугольной пирамиды? | O'zingiz hisoblang. Muntazam oltiburchakli piramidaning nechta teng apofemasi bor? | Work it out yourself. How many equal apothems does a regular hexagonal pyramid have? |
| `work.prompt` | Сколько равных апофем? | Nechta teng apofema? | How many equal apothems? |
| `work.ok` | Шесть. По одной в каждой боковой грани. | Oltita. Har yon yoqda bittadan. | Six. One in each lateral face. |
| `work.hint.1` | Посчитай треугольники в развёртке. | Yoyilmadagi uchburchaklarni sanang. | Count the triangles in the net. |
| `work.hint.2` | В каждом треугольнике своя высота. | Har uchburchakda o'z balandligi. | Each triangle has its own height. |
| `work.hint.3` | Шесть. | Oltita. | Six. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = ½·n·a·m` |
| `work.answer` | `6` |

---

## Экран 6 · `explain4` · ответ `number` · тег `ploshchad-po-kartinke`

Сам: боковая поверхность правильной призмы.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Считаем короткой формулой | Qisqa formula bilan hisoblaymiz | Counting with the short formula |
| `show.1.1` | сторона основания три | asos tomoni uch | the base side is three |
| `show.1.2` | сторон шесть, периметр восемнадцать | tomonlar olti, perimetr o'n sakkiz | six sides, the perimeter is eighteen |
| `show.2.1` | высота десять | balandlik o'n | the height is ten |
| `show.2.2` | лента восемнадцать на десять | tasma o'n sakkiz karra o'n | the strip is eighteen by ten |
| `audio.mount` | Правильная шестиугольная призма. Сторона основания три, высота десять. | Muntazam oltiburchakli prizma. Asos tomoni uch, balandlik o'n. | A regular hexagonal prism. The base side is three, the height is ten. |
| `audio.move*` | Периметр правильного многоугольника считается коротко: число сторон умножить на сторону. Шесть на три это восемнадцать. Дальше развёртка: лента высотой десять и длиной восемнадцать, значит её площадь сто восемьдесят. Заметь, что мы нигде не считали площадь основания и она в боковую поверхность не входит. Если понадобится полная поверхность, придётся отдельно посчитать площадь правильного шестиугольника и прибавить её дважды. | Muntazam ko'pburchakning perimetri qisqa hisoblanadi: tomonlar soni karra tomon. Olti karra uch o'n sakkiz. Keyin yoyilma: balandligi o'n va uzunligi o'n sakkiz bo'lgan tasma, demak yuzasi bir yuz sakson. E'tibor bering, biz hech qayerda asos yuzasini hisoblamadik va u yon sirtga kirmaydi. To'liq sirt kerak bo'lsa, muntazam oltiburchak yuzasini alohida hisoblab, ikki marta qo'shish kerak. | The perimeter of a regular polygon is computed briefly: the number of sides times the side. Six times three is eighteen. Then the net: a strip ten high and eighteen long, so its area is one hundred eighty. Note that we never computed the base area and it does not enter the lateral surface. If the full surface is needed, the area of the regular hexagon has to be computed separately and added twice. |
| `audio.work` | Посчитай сам. Какова боковая поверхность? | O'zingiz hisoblang. Yon sirt qancha? | Work it out yourself. What is the lateral area? |
| `work.prompt` | Найди боковую поверхность | Yon sirtni toping | Find the lateral area |
| `work.ok` | Сто восемьдесят. Восемнадцать умножить на десять. | Bir yuz sakson. O'n sakkiz karra o'n. | One hundred eighty. Eighteen times ten. |
| `work.hint.1` | Сначала периметр основания. | Avval asos perimetri. | First the base perimeter. |
| `work.hint.2` | Шесть сторон по три. | Olti tomon uchtadan. | Six sides of three. |
| `work.hint.3` | Восемнадцать умножить на десять. | O'n sakkiz karra o'n. | Eighteen times ten. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `n = 6,   a = 3,   h = 10` |
| `work.answer` | `180` |

---

## Экран 7 · `explain5` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Граница: правильная не значит все рёбра равны.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Правильная и куб это разное | Muntazam va kub boshqa-boshqa | Regular and a cube are different |
| `show.1.1` | сторона основания четыре | asos tomoni to'rt | the base side is four |
| `show.1.2` | боковое ребро семь | yon qirra yetti | the lateral edge is seven |
| `show.2.1` | призма правильная | prizma muntazam | the prism is regular |
| `show.2.2` | но рёбра не все равны | lekin qirralar hammasi teng emas | but not all edges are equal |
| `audio.mount` | Правильная четырёхугольная призма. Сторона основания четыре, боковое ребро семь. | Muntazam to'rtburchakli prizma. Asos tomoni to'rt, yon qirra yetti. | A regular quadrilateral prism. The base side is four, the lateral edge is seven. |
| `audio.move*` | Основание квадрат, ребро перпендикулярно основанию, значит все условия правильной призмы выполнены. При этом рёбра основания по четыре, а боковые по семь, и разных длин две. Слово правильная говорит про форму основания и про наклон ребра, но не про равенство всех рёбер. Все рёбра равны только тогда, когда боковое ребро совпало со стороной основания, и такое тело называется кубом. Куб это частный случай правильной призмы, а не её определение. | Asos kvadrat, qirra asosga perpendikulyar, demak muntazam prizmaning barcha shartlari bajarilgan. Shu bilan birga asos qirralari to'rttadan, yon qirralar yettitadan, va xil uzunliklar ikkita. Muntazam so'zi asosning shakli va qirraning og'ishi haqida gapiradi, barcha qirralarning tengligi haqida emas. Barcha qirralar faqat yon qirra asos tomoni bilan ustma-ust tushganda teng bo'ladi, va bunday jism kub deb ataladi. Kub muntazam prizmaning xususiy holi, uning ta'rifi emas. | The base is a square, the edge is perpendicular to the base, so all the conditions of a regular prism hold. At the same time the base edges are four each and the lateral ones seven each, and there are two different lengths. The word regular speaks about the shape of the base and the slant of the edge, not about all the edges being equal. All the edges are equal only when the lateral edge coincides with the base side, and such a body is called a cube. A cube is a special case of a regular prism, not its definition. |
| `audio.work` | Посчитай сам. Сколько разных длин среди рёбер этой призмы? | O'zingiz hisoblang. Bu prizma qirralari orasida nechta xil uzunlik bor? | Work it out yourself. How many different lengths are among the edges of this prism? |
| `work.prompt` | Сколько разных длин? | Nechta xil uzunlik? | How many different lengths? |
| `work.ok` | Две. Сторона основания и боковое ребро задаются независимо. | Ikkita. Asos tomoni va yon qirra mustaqil beriladi. | Two. The base side and the lateral edge are given independently. |
| `work.hint.1` | Сравни рёбра основания и боковые. | Asos qirralarini va yon qirralarni solishtiring. | Compare the base edges with the lateral ones. |
| `work.hint.2` | Четыре и семь это разные числа. | To'rt va yetti boshqa sonlar. | Four and seven are different numbers. |
| `work.hint.3` | Две. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a = 4,   h = 7` |
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Что значит правильная | Muntazam nimani bildiradi | What regular means |
| `probe.question` | Что требует правильная призма? | Muntazam prizma nimani talab qiladi? | What does a regular prism require? |
| `probe.a` [верно] | прямая и правильное основание | to'g'ri va muntazam asos | right, and a regular base |
| `probe.b` | все рёбра равны | barcha qirralar teng | all edges are equal |
| `probe.b.hint` | Это условие куба, а не правильной призмы. | Bu kubning sharti, muntazam prizmaning emas. | That is the condition of a cube, not of a regular prism. |
| `rule.lawLabel` | Правильные тела | Muntazam jismlar | Regular bodies |
| `rule.lines.1` | правильная призма это прямая призма с правильным основанием | muntazam prizma muntazam asosli to'g'ri prizma | a regular prism is a right prism with a regular base |
| `rule.lines.2` | правильная пирамида это правильное основание и равные боковые грани | muntazam piramida muntazam asos va teng yon yoqlar | a regular pyramid means a regular base and equal lateral faces |
| `rule.lines.3` | у правильной призмы разных длин рёбер две, у куба одна | muntazam prizmada xil qirra uzunligi ikkita, kubda bitta | a regular prism has two different edge lengths, a cube has one |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | В обоих определениях по два условия, и в обоих одно про основание, другое про боковую часть. У призмы это перпендикулярность ребра, у пирамиды равенство боковых граней. Правильность даёт короткие формулы, потому что все стороны основания равны и периметр считается умножением. Но она не делает тело кубом: сторона основания и высота остаются независимыми. | Ikkala ta'rifda ham ikki shart, va ikkalasida biri asos haqida, ikkinchisi yon qism haqida. Prizmada bu qirraning perpendikulyarligi, piramidada yon yoqlarning tengligi. Muntazamlik qisqa formulalar beradi, chunki asosning barcha tomonlari teng va perimetr ko'paytirish bilan hisoblanadi. Lekin u jismni kub qilmaydi: asos tomoni va balandlik mustaqil qoladi. | Both definitions have two conditions, and in both one is about the base and the other about the lateral part. For a prism it is the perpendicularity of the edge, for a pyramid the equality of the lateral faces. Being regular gives short formulas, because all the base sides are equal and the perimeter is computed by multiplication. But it does not make the body a cube: the base side and the height stay independent. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `P = n·a` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Число равных боковых граней | Teng yon yoqlar soni | The number of equal lateral faces |
| `match.prompt` | Соедини число с правильным телом | Sonni muntazam jism bilan birlashtiring | Match the number with the regular body |
| `match.ok` | Все четыре на месте. Число граней это число сторон основания. | To'rttasi ham joyida. Yoqlar soni asos tomonlari soni. | All four in place. The number of faces is the number of base sides. |
| `audio.mount` | Четыре числа и четыре правильных тела. Соедини их. | To'rt son va to'rt muntazam jism. Ularni birlashtiring. | Four numbers and four regular bodies. Match them. |
| `match.a` | треугольная призма | uchburchakli prizma | triangular prism |
| `match.b` | четырёхугольная пирамида | to'rtburchakli piramida | quadrilateral pyramid |
| `match.c` | шестиугольная призма | oltiburchakli prizma | hexagonal prism |
| `match.d` | двенадцатиугольная пирамида | o'n ikki burchakli piramida | twelve-sided pyramid |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `3` · `4` · `6` · `12` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи равенство боковых граней | Yon yoqlar tengligini isbotlang | Prove the lateral faces are equal |
| `proof.given` | правильная призма | muntazam prizma | a regular prism |
| `proof.goal` | её боковые грани равны | uning yon yoqlari teng | its lateral faces are equal |
| `proof.r1` | все стороны основания равны | asosning barcha tomonlari teng | all the base sides are equal |
| `proof.r2` | боковые грани прямоугольники одной высоты | yon yoqlar bir balandlikdagi to'g'ri to'rtburchaklar | the lateral faces are rectangles of one height |
| `proof.r3` | прямоугольники с равными сторонами равны | tomonlari teng to'g'ri to'rtburchaklar teng | rectangles with equal sides are equal |
| `proof.ok` | Доказано. Оба условия определения понадобились по разу. | Isbotlandi. Ta'rifning ikkala sharti ham bir marta kerak bo'ldi. | Proved. Each of the two conditions of the definition was used once. |
| `proof.e1` | Про прямую призму дальше. Сначала про основание. | To'g'ri prizma haqida keyin. Avval asos haqida. | The right prism comes later. First about the base. |
| `proof.e2` | Основание разобрано. Откуда прямоугольники. | Asos ko'rildi. To'g'ri to'rtburchaklar qayerdan. | The base is done. Where do the rectangles come from. |
| `proof.e3` | Фигуры известны. Теперь вывод про равенство. | Shakllar ma'lum. Endi tenglik haqida xulosa. | The figures are known. Now the conclusion about equality. |
| `reason.s1` | правильный многоугольник в основании | asosda muntazam ko'pburchak | a regular polygon in the base |
| `reason.s2` | призма прямая | prizma to'g'ri | the prism is right |
| `reason.s3` | признак равенства прямоугольников | to'g'ri to'rtburchaklar tengligi alomati | the criterion of equality of rectangles |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABB₁A₁ = BCC₁B₁` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Девяносто шесть. Тридцать шесть основание и шестьдесят боковая. | To'qson olti. O'ttiz olti asos va oltmish yon. | Ninety six. Thirty six for the base and sixty for the lateral part. |
| `task.hint.1` | Основание квадрат со стороной шесть. | Asos tomoni olti bo'lgan kvadrat. | The base is a square with side six. |
| `task.hint.2` | Боковая это половина периметра на апофему. | Yon sirt perimetrning yarmi karra apofema. | The lateral part is half the perimeter times the apothem. |
| `task.hint.3` | Тридцать шесть плюс шестьдесят. | O'ttiz olti qo'shuv oltmish. | Thirty six plus sixty. |
| `order.prompt` | Расставь записи в том порядке, в каком считают | Yozuvlarni hisoblash tartibida joylashtiring | Arrange the readings in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Сначала основание и периметр, потом боковая и полная. | Tartib to'g'ri. Avval asos va perimetr, keyin yon va to'liq. | The order is right. First the base and the perimeter, then the lateral and the full area. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как считают. | Endi yozuvlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the readings. Arrange them the way they are computed. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `a = 6,   m = 5,   S = ?` |
| `task.answer` | `96` |
| `order.items` | `S` · `S₀` · `P` · `S₁` |
| `order.answer` | `S₀  P  S₁  S` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Стороны основания равны, это верно. | Asos tomonlari teng, bu to'g'ri. | The base sides are equal, that is right. |
| `hint.r4` | Ответ получен из неверной строки выше. | Javob yuqoridagi xato qatordan olingan. | The answer comes from the wrong line above. |
| `proof` | Поверни призму: боковое ребро семь, а сторона основания четыре. | Prizmani buring: yon qirra yetti, asos tomoni esa to'rt. | Rotate the prism: the lateral edge is seven while the base side is four. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Правильную призму назвали кубом. | Uchinchi. Muntazam prizma kub deb aytilgan. | The third. A regular prism was called a cube. |
| `entry.hint.1` | Проверь, где появилось равенство всех рёбер. | Barcha qirralar tengligi qayerda paydo bo'lganini tekshiring. | Check where the equality of all edges appeared. |
| `entry.hint.2` | Правильная призма кубом быть не обязана. | Muntazam prizma kub bo'lishi shart emas. | A regular prism does not have to be a cube. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них подменяет тело. | To'rt qator, va ulardan biri jismni almashtiradi. | Four lines, and one of them substitutes the body. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a = 4,   h = 7` |
| `row.r2` | `AB = BC = CD = DA` |
| `row.r3` | `a = h` |
| `row.r4` | `S = 6·16` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Правильная четырёхугольная призма, сторона четыре, высота пять. Какова полная поверхность? | Muntazam to'rtburchakli prizma, tomoni to'rt, balandligi besh. To'liq sirt qancha? | A regular quadrilateral prism, side four, height five. What is the full surface? |
| `place.ok` | Сто двенадцать. Тридцать два основания и восемьдесят боковая. | Bir yuz o'n ikki. O'ttiz ikki asoslar va sakson yon. | One hundred twelve. Thirty two for the bases and eighty for the lateral part. |
| `place.wrong` | Основания два, и оба квадраты. | Asoslar ikkita, va ikkalasi kvadrat. | There are two bases and both are squares. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для правильной призмы | Muntazam prizma uchun nima to'g'ri | What is true for a regular prism |
| `multi.d.hint` | Это верно только у куба. | Bu faqat kubda to'g'ri. | That is true only for a cube. |
| `multi.e.hint` | Половина появляется у пирамиды, не у призмы. | Yarim piramidada paydo bo'ladi, prizmada emas. | The half appears for a pyramid, not for a prism. |
| `multi.ok` | Три записи из пяти. Две оставшиеся путают правильную призму с другими телами. | Beshtadan uch yozuv. Qolgan ikkitasi muntazam prizmani boshqa jismlar bilan aralashtiradi. | Three readings out of five. The other two confuse a regular prism with other bodies. |
| `audio.mount` | Прочитаем правило справа налево. По телу назовём формулу. | Qoidani o'ngdan chapga o'qiymiz. Jism bo'yicha formulani aytamiz. | Let us read the rule from right to left. From the body we name the formula. |
| `audio.work` | Отметь все записи, которые верны для правильной призмы. Их больше одной. | Muntazam prizma uchun to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are true for a regular prism. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `112` |
| `place.step` | `2·16 + 16·5` |
| `multi.a` [верно] | `P = n·a` |
| `multi.b` [верно] | `S₁ = n·a·h` |
| `multi.c` [верно] | `AA₁ ⊥ ABCD` |
| `multi.d` | `a = h` |
| `multi.e` | `S₁ = ½·n·a·h` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что требует правильная призма? | Muntazam prizma nimani talab qiladi? | What does a regular prism require? |
| `q1.a` [верно] | прямая и правильное основание | to'g'ri va muntazam asos | right, and a regular base |
| `q1.b` | только правильное основание | faqat muntazam asos | only a regular base |
| `q1.b.hint` | При наклонном ребре призма правильной не будет. | Qirra og'ma bo'lsa, prizma muntazam bo'lmaydi. | With a slanted edge the prism will not be regular. |
| `q1.c` | только перпендикулярное ребро | faqat perpendikulyar qirra | only a perpendicular edge |
| `q1.c.hint` | Это условие прямой призмы. | Bu to'g'ri prizmaning sharti. | That is the condition of a right prism. |
| `q1.d` | равные рёбра | teng qirralar | equal edges |
| `q1.d.hint` | Равные рёбра это куб. | Teng qirralar bu kub. | Equal edges mean a cube. |
| `q2.prompt` | Периметр правильного n-угольника? | Muntazam n burchakning perimetri? | The perimeter of a regular n-gon? |
| `q2.a` [верно] | число сторон на сторону | tomonlar soni karra tomon | the number of sides times the side |
| `q2.b` | сторона в квадрате | tomonning kvadrati | the side squared |
| `q2.b.hint` | Квадрат стороны это площадь, а не периметр. | Tomon kvadrati yuza, perimetr emas. | The side squared is an area, not a perimeter. |
| `q2.c` | сумма двух сторон | ikki tomon yig'indisi | the sum of two sides |
| `q2.c.hint` | Периметр это все стороны, а не две. | Perimetr barcha tomonlar, ikkitasi emas. | A perimeter is all the sides, not two. |
| `q2.d` | сторона на высоту | tomon karra balandlik | the side times the height |
| `q2.d.hint` | Это площадь одной боковой грани. | Bu bitta yon yoqning yuzasi. | That is the area of one lateral face. |
| `q3.prompt` | Сколько равных боковых граней у правильной пятиугольной пирамиды? | Muntazam beshburchakli piramidaning nechta teng yon yog'i bor? | How many equal lateral faces does a regular pentagonal pyramid have? |
| `q3.a` [верно] | пять | beshta | five |
| `q3.b` | шесть | oltita | six |
| `q3.b.hint` | Шесть было бы вместе с основанием. | Olti asos bilan birga bo'lardi. | Six would be together with the base. |
| `q3.c` | десять | o'nta | ten |
| `q3.c.hint` | Десять это число рёбер. | O'n qirralar soni. | Ten is the number of edges. |
| `q3.d` | одна | bitta | one |
| `q3.d.hint` | Грани равны, но их всё равно пять. | Yoqlar teng, lekin ular baribir beshta. | The faces are equal, but there are still five of them. |
| `q4.prompt` | Правильная призма с равными рёбрами это? | Qirralari teng muntazam prizma bu? | A regular prism with equal edges is? |
| `q4.a` [верно] | куб | kub | a cube |
| `q4.b` | параллелепипед | parallelepiped | a parallelepiped |
| `q4.b.hint` | Параллелепипед бывает и с разными рёбрами. | Parallelepiped qirralari boshqa bo'lgan holda ham bo'ladi. | A parallelepiped can have different edges too. |
| `q4.c` | пирамида | piramida | a pyramid |
| `q4.c.hint` | У пирамиды нет второго основания. | Piramidada ikkinchi asos yo'q. | A pyramid has no second base. |
| `q4.d` | правильная пирамида | muntazam piramida | a regular pyramid |
| `q4.d.hint` | Речь о призме, а не о пирамиде. | Gap prizma haqida, piramida haqida emas. | This is about a prism, not a pyramid. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `AA₁ ⊥ ABCD` |
| `q2.done` | `P = n·a` |
| `q3.done` | `5` |
| `q4.done` | `a = h` |
| `angles` | `3` · `4` · `6` · `12` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Проверяю у правильной призмы два условия | Muntazam prizmada ikki shartni tekshiraman | I check two conditions for a regular prism |
| `can.2` | Знаю, что правильная не значит все рёбра равны | Muntazam barcha qirralar teng degani emasligini bilaman | I know regular does not mean all edges are equal |
| `can.3` | Считаю периметр правильного основания умножением | Muntazam asos perimetrini ko'paytirish bilan hisoblayman | I compute the perimeter of a regular base by multiplication |
| `can.4` | Пользуюсь короткими формулами поверхности | Sirtning qisqa formulalaridan foydalanaman | I use the short surface formulas |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше сечения — плоскость режет тело, и в сечении получается многоугольник | Bundan keyin kesimlar, tekislik jismni kesadi va kesimda ko'pburchak chiqadi | Next come sections, where a plane cuts the body and a polygon appears in the section |
| `lifehack` | Слово правильная проверяй по двум условиям, а не по виду | Muntazam so'zini ko'rinishi bo'yicha emas, ikki shart bo'yicha tekshiring | Check the word regular against two conditions, not against the look |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страница сорок пять | Geometriya, qirq beshinchi bet | Geometry, page forty five |
| `audio.mount` | Урок начался с вопроса про рёбра правильной призмы. | Dars muntazam prizmaning qirralari haqidagi savol bilan boshlandi. | The lesson began with a question about the edges of a regular prism. |
| `audio.next` | Разных длин две, а не одна, и слово правильная тут ни при чём. Оно говорит только о том, что основание правильный многоугольник, а боковое ребро перпендикулярно основанию. Все рёбра равны лишь у куба, и он частный случай. Зато правильность даёт короткие формулы: периметр это число сторон на сторону. Дальше плоскость начнёт резать тело, и в сечении будет получаться многоугольник. | Xil uzunliklar ikkita, bitta emas, va muntazam so'zining bunga aloqasi yo'q. U faqat asos muntazam ko'pburchak, yon qirra esa asosga perpendikulyar ekanini aytadi. Barcha qirralar faqat kubda teng, va u xususiy hol. Muntazamlik esa qisqa formulalar beradi: perimetr tomonlar soni karra tomon. Keyin tekislik jismni kesa boshlaydi, va kesimda ko'pburchak chiqadi. | There are two different lengths, not one, and the word regular has nothing to do with it. It only says that the base is a regular polygon and the lateral edge is perpendicular to the base. All the edges are equal only in a cube, and that is a special case. What being regular does give is short formulas: the perimeter is the number of sides times the side. Next a plane will start cutting the body, and a polygon will appear in the section. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `1` |
| `hook.b` | `2` |
| `proved` | `a ≠ h` |
| `law` | `P = n·a` |
| `sheet.1` | `AA₁ ⊥ ABCD` |
| `sheet.2` | `AB = BC = … = FA` |
| `sheet.3` | `P = n·a` |
| `sheet.4` | `S₁ = n·a·h` |
| `sheet.5` | `S₁ = ½·n·a·m` |
