# Урок 47 — Площадь поверхности · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS46_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, стр. 59–61 — развёртка, модель
тела из развёртки, задания на узнавание развёртки куба.

**Главное решение урока. Формул площади поверхности в учебнике 10 класса нет, и мы их не даём
готовыми.** Есть развёртка: тело разворачивается в плоскую фигуру, и площадь поверхности
становится суммой площадей знакомых плоских кусков. Все формулы урока выводятся из развёртки, а
не запоминаются.

**Ошибка года — считать по картинке.** На чертеже видно три грани из шести, и ученик складывает
то, что видит. Свидетель: развёртка показывает все куски сразу, и их шесть.

**Развёртка в приборе плоская.** Ни камеры, ни поворота: её смысл в том, что она лежит на бумаге
и измеряется. Куски открываются по одному и подсвечиваются тем же цветом, что грань на теле.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`yoyilma`, `sirt`, `yon sirt`, `to'liq sirt` взяты из учебника, стр. 59–61.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПОВЕРХНОСТЬ | SIRT | THE SURFACE |
| `title` | Три грани или шесть | Uch yoq yoki olti | Three faces or six |
| `row.a.name` | три | uch | three |
| `row.b.name` | шесть | olti | six |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас развернём тело. | Javobingiz yozib olindi. Endi jismni yoyamiz. | Your answer is recorded. Now we unfold the body. |
| `audio.mount` | Прямоугольный параллелепипед. Нужно найти площадь его поверхности, то есть сложить площади граней. | To'g'ri burchakli parallelepiped. Uning sirt yuzasini topish kerak, ya'ni yoqlar yuzalarini qo'shish kerak. | A rectangular box. We need the area of its surface, that is the sum of the areas of its faces. |
| `audio.r1` | Первая запись предлагает сложить три грани. Ровно столько видно на чертеже. | Birinchi yozuv uch yoqni qo'shishni taklif qiladi. Chizmada aynan shuncha ko'rinadi. | The first reading offers to add three faces. That is exactly how many show on the drawing. |
| `audio.r2` | Вторая предлагает шесть. | Ikkinchisi oltini taklif qiladi. | The second offers six. |
| `audio.ask` | Как думаешь, какая запись верная? Пока просто предположи. | Sizningcha qaysi yozuv to'g'ri? Hozircha shunchaki taxmin qiling. | Which reading do you think is right? Just guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = ?` |
| `row.a.value` | `S = ab + bc + ac` |
| `row.b.value` | `S = 2(ab+bc+ac)` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из блока | Blokdan uch savol | Three questions from the block |
| `q1.prompt` | Сколько граней у параллелепипеда? | Parallelepipedning nechta yog'i bor? | How many faces does a parallelepiped have? |
| `q1.a` [верно] | шесть | oltita | six |
| `q1.b` | четыре | to'rtta | four |
| `q1.b.hint` | Четыре это только боковые. | To'rtta faqat yonlari. | Four are only the lateral ones. |
| `q1.c` | три | uchta | three |
| `q1.c.hint` | Три это сколько видно с одного взгляда. | Uchta bir qarashda nechta ko'rinishi. | Three is how many you see at a glance. |
| `q1.d` | восемь | sakkizta | eight |
| `q1.d.hint` | Восемь это число вершин. | Sakkiz uchlar soni. | Eight is the number of vertices. |
| `q2.prompt` | Что такое апофема? | Apofema nima? | What is the apothem? |
| `q2.a` [верно] | высота боковой грани из вершины | uchdan yon yoqning balandligi | the height of a lateral face from the apex |
| `q2.b` | боковое ребро | yon qirra | the lateral edge |
| `q2.b.hint` | Ребро приходит в вершину основания, апофема в середину стороны. | Qirra asos uchiga keladi, apofema tomon o'rtasiga. | The edge arrives at a base vertex, the apothem at the middle of a side. |
| `q2.c` | высота пирамиды | piramida balandligi | the height of the pyramid |
| `q2.c.hint` | Высота идёт в центр основания. | Balandlik asos markaziga boradi. | The height goes to the centre of the base. |
| `q2.d` | сторона основания | asos tomoni | a base side |
| `q2.d.hint` | Сторона лежит в основании, а апофема в боковой грани. | Tomon asosda yotadi, apofema esa yon yoqda. | The side lies in the base, the apothem in a lateral face. |
| `q3.prompt` | Сколько граней сходится в одном ребре? | Bitta qirrada nechta yoq tutashadi? | How many faces meet at one edge? |
| `q3.a` [верно] | две | ikkita | two |
| `q3.b` | одна | bitta | one |
| `q3.b.hint` | Одна грань дала бы просто сторону. | Bitta yoq shunchaki tomon berardi. | One face would give just a side. |
| `q3.c` | три | uchta | three |
| `q3.c.hint` | Три сходятся в вершине. | Uchtasi uchda tutashadi. | Three meet at a vertex. |
| `q3.d` | зависит от тела | jismga bog'liq | it depends on the body |
| `q3.d.hint` | Это верно у любого многогранника. | Bu har qanday ko'pyoqda to'g'ri. | This is true for any polyhedron. |
| `audio.mount` | Три вопроса. Все три понадобятся, когда тело развернётся. | Uchta savol. Jism yoyilganda uchalasi ham kerak bo'ladi. | Three questions. All three will be needed when the body unfolds. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `4 + 2 = 6` |
| `q2.done` | `SM ⊥ AB` |
| `q3.done` | `2` |

---

## Экран 3 · `explain1` · ответ `number` · тег `ploshchad-po-kartinke`

Развёртка: тело становится плоской фигурой.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Тело разворачивается на бумагу | Jism qog'ozga yoyiladi | The body unfolds onto paper |
| `show.1.1` | сначала легли основания | avval asoslar yotdi | first the bases lay down |
| `show.1.2` | это два знакомых многоугольника | bu ikki tanish ko'pburchak | these are two familiar polygons |
| `show.2.1` | потом легла боковая поверхность | keyin yon sirt yotdi | then the lateral surface lay down |
| `show.2.2` | вся поверхность на бумаге | butun sirt qog'ozda | the whole surface is on paper |
| `audio.mount` | Возьмём призму и разрежем её поверхность по рёбрам, а потом разложим на бумаге. | Prizmani olamiz va uning sirtini qirralar bo'ylab kesib, keyin qog'ozda yozamiz. | Take a prism, cut its surface along the edges and lay it out on paper. |
| `audio.move*` | Получилась плоская фигура, и она называется развёрткой. Так на странице пятьдесят девять. Смотри, что изменилось. У тела площадь поверхности была непонятной величиной, а у развёртки это просто сумма площадей плоских кусков, и каждый кусок мы умеем считать с седьмого класса. Ни одна грань при развёртке не потерялась и не появилась, поэтому площади равны. Именно поэтому развёртка это не картинка для красоты, а способ считать. | Yassi shakl chiqdi, va u yoyilma deb ataladi. Ellik to'qqizinchi betda shunday. Nima o'zgarganiga qarang. Jismda sirt yuzasi tushunarsiz kattalik edi, yoyilmada esa u shunchaki yassi bo'laklar yuzalarining yig'indisi, va har bir bo'lakni biz yettinchi sinfdan hisoblay olamiz. Yoyilishda birorta yoq yo'qolmadi va paydo bo'lmadi, shuning uchun yuzalar teng. Aynan shuning uchun yoyilma chiroylik uchun rasm emas, hisoblash usuli. | We got a flat figure, and it is called a net. So it is on page fifty nine. See what changed. For the body the surface area was an unclear quantity, while for the net it is simply the sum of the areas of flat pieces, and each piece we can compute since grade seven. No face is lost or added in the unfolding, so the areas are equal. That is exactly why a net is not a decorative picture but a way to count. |
| `audio.work` | Посчитай сам. Сколько плоских кусков в развёртке четырёхугольной призмы? | O'zingiz hisoblang. To'rtburchakli prizma yoyilmasida nechta yassi bo'lak bor? | Work it out yourself. How many flat pieces are in the net of a quadrilateral prism? |
| `work.prompt` | Сколько кусков в развёртке? | Yoyilmada nechta bo'lak? | How many pieces are in the net? |
| `work.ok` | Шесть. Четыре боковых и два основания, столько же, сколько граней. | Oltita. To'rt yon va ikki asos, yoqlar qanchaligicha. | Six. Four lateral and two bases, as many as there are faces. |
| `work.hint.1` | Посчитай куски на бумаге, а не грани на теле. | Jismdagi yoqlarni emas, qog'ozdagi bo'laklarni sanang. | Count the pieces on the paper, not the faces on the body. |
| `work.hint.2` | Каждая грань даёт ровно один кусок. | Har yoq roppa-rosa bitta bo'lak beradi. | Each face gives exactly one piece. |
| `work.hint.3` | Четыре плюс два. | To'rt qo'shuv ikki. | Four plus two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `4 + 2 = 6` |
| `work.answer` | `6` |

---

## Экран 4 · `explain2` · ответ `number` · тег `ploshchad-po-kartinke`

Полная поверхность параллелепипеда.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Видно три, а сложить надо шесть | Uch ko'rinadi, oltini qo'shish kerak | Three show, six must be added |
| `show.1.1` | на чертеже видно три грани | chizmada uch yoq ko'rinadi | three faces show on the drawing |
| `show.1.2` | остальные три с другой стороны | qolgan uchtasi boshqa tomonda | the other three are on the far side |
| `show.2.1` | в развёртке все шесть сразу | yoyilmada oltitasi birdan | in the net all six at once |
| `show.2.2` | и они попарно равны | va ular juft-juft teng | and they are equal in pairs |
| `audio.mount` | Измерения два, три и четыре. Посчитаем площадь поверхности. | O'lchamlar ikki, uch va to'rt. Sirt yuzasini hisoblaymiz. | The dimensions are two, three and four. Let us find the surface area. |
| `audio.move*` | На чертеже видно три грани, и складывать хочется именно их. Но грани у параллелепипеда попарно равны, и каждая видимая грань имеет невидимого близнеца с той же площадью. В развёртке это сразу видно. Значит сумма трёх разных произведений умножается на два. Два умножить на три это шесть, три на четыре двенадцать, два на четыре восемь. Шесть плюс двенадцать плюс восемь это двадцать шесть, а вся поверхность пятьдесят два. Обрати внимание, что число видимых граней зависит от ракурса, а площадь поверхности нет. | Chizmada uch yoq ko'rinadi, va aynan ularni qo'shgi keladi. Lekin parallelepipedning yoqlari juft-juft teng, va har bir ko'rinadigan yoqning o'sha yuzali ko'rinmas egizagi bor. Yoyilmada bu darhol ko'rinadi. Demak uch xil ko'paytmaning yig'indisi ikkiga ko'paytiriladi. Ikki karra uch olti, uch karra to'rt o'n ikki, ikki karra to'rt sakkiz. Olti qo'shuv o'n ikki qo'shuv sakkiz bu yigirma olti, butun sirt esa ellik ikki. E'tibor bering, ko'rinadigan yoqlar soni rakursga bog'liq, sirt yuzasi esa yo'q. | Three faces show on the drawing and those are the ones you want to add. But the faces of a box are equal in pairs, and every visible face has an invisible twin of the same area. In the net that is immediately visible. So the sum of the three different products is multiplied by two. Two times three is six, three times four is twelve, two times four is eight. Six plus twelve plus eight is twenty six, and the whole surface is fifty two. Note that the number of visible faces depends on the view while the surface area does not. |
| `audio.work` | Посчитай сам. Измерения два, три и четыре. Какова площадь поверхности? | O'zingiz hisoblang. O'lchamlar ikki, uch va to'rt. Sirt yuzasi qancha? | Work it out yourself. The dimensions are two, three and four. What is the surface area? |
| `work.prompt` | Найди площадь поверхности | Sirt yuzasini toping | Find the surface area |
| `work.ok` | Пятьдесят два. Двадцать шесть умножить на два. | Ellik ikki. Yigirma olti karra ikki. | Fifty two. Twenty six times two. |
| `work.hint.1` | Сложи три разных произведения измерений. | O'lchamlarning uch xil ko'paytmasini qo'shing. | Add the three different products of the dimensions. |
| `work.hint.2` | Шесть плюс двенадцать плюс восемь. | Olti qo'shuv o'n ikki qo'shuv sakkiz. | Six plus twelve plus eight. |
| `work.hint.3` | Двадцать шесть умножить на два. | Yigirma olti karra ikki. | Twenty six times two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = 2(ab+bc+ac)` |
| `work.answer` | `52` |

---

## Экран 5 · `explain3` · ответ `number` · тег `ploshchad-po-kartinke`

Боковая поверхность призмы: периметр на высоту.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Боковая поверхность это лента | Yon sirt bu tasma | The lateral surface is a strip |
| `show.1.1` | боковые грани легли в одну ленту | yon yoqlar bitta tasmaga yotdi | the lateral faces lay down in one strip |
| `show.1.2` | высота ленты это высота призмы | tasmaning balandligi prizma balandligi | the height of the strip is the height of the prism |
| `show.2.1` | длина ленты это периметр основания | tasmaning uzunligi asos perimetri | the length of the strip is the base perimeter |
| `show.2.2` | площадь ленты это произведение | tasma yuzasi ko'paytma | the area of the strip is the product |
| `audio.mount` | Развернём только боковую поверхность прямой призмы, без оснований. | To'g'ri prizmaning faqat yon sirtini, asoslarsiz yoyamiz. | Let us unfold only the lateral surface of a right prism, without the bases. |
| `audio.move*` | Боковые грани прямой призмы это прямоугольники, и в развёртке они складываются в одну длинную ленту. Высота у всех прямоугольников одна, это высота призмы. А их основания идут одно за другим, и вместе дают периметр основания. Значит площадь ленты это периметр основания, умноженный на высоту, и никакой новой формулы запоминать не надо, это площадь прямоугольника. Проверим на треугольной призме со сторонами три, четыре, пять и высотой десять. Периметр двенадцать, площадь боковой поверхности сто двадцать. | To'g'ri prizmaning yon yoqlari to'g'ri to'rtburchak, va yoyilmada ular bitta uzun tasmaga qo'shiladi. Barcha to'g'ri to'rtburchaklarning balandligi bir xil, bu prizma balandligi. Asoslari esa ketma-ket boradi va birgalikda asos perimetrini beradi. Demak tasma yuzasi asos perimetrini balandlikka ko'paytirgani, va yangi formulani yodlash kerak emas, bu to'g'ri to'rtburchak yuzasi. Tomonlari uch, to'rt, besh va balandligi o'n bo'lgan uchburchakli prizmada tekshiramiz. Perimetr o'n ikki, yon sirt yuzasi bir yuz yigirma. | The lateral faces of a right prism are rectangles, and in the net they add up into one long strip. All the rectangles have the same height, the height of the prism. Their bases go one after another and together give the perimeter of the base. So the area of the strip is the base perimeter times the height, and there is no new formula to memorise, it is the area of a rectangle. Let us check on a triangular prism with sides three, four, five and height ten. The perimeter is twelve, the lateral area is one hundred twenty. |
| `audio.work` | Посчитай сам. Периметр основания двенадцать, высота десять. Какова боковая поверхность? | O'zingiz hisoblang. Asos perimetri o'n ikki, balandlik o'n. Yon sirt qancha? | Work it out yourself. The base perimeter is twelve, the height is ten. What is the lateral area? |
| `work.prompt` | Найди боковую поверхность | Yon sirtni toping | Find the lateral area |
| `work.ok` | Сто двадцать. Периметр на высоту. | Bir yuz yigirma. Perimetr karra balandlik. | One hundred twenty. The perimeter times the height. |
| `work.hint.1` | Лента это прямоугольник. | Tasma to'g'ri to'rtburchak. | The strip is a rectangle. |
| `work.hint.2` | Его стороны это периметр и высота. | Uning tomonlari perimetr va balandlik. | Its sides are the perimeter and the height. |
| `work.hint.3` | Двенадцать умножить на десять. | O'n ikki karra o'n. | Twelve times ten. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = P·h` |
| `work.answer` | `120` |

---

## Экран 6 · `explain4` · ответ `number` · тег `apofema-ne-rebro`

Сам: боковая поверхность правильной пирамиды.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Развёртка пирамиды это треугольники | Piramida yoyilmasi uchburchaklar | The net of a pyramid is triangles |
| `show.1.1` | в центре основание | markazda asos | the base in the centre |
| `show.1.2` | вокруг четыре треугольника | atrofida to'rt uchburchak | four triangles around it |
| `show.2.1` | высота каждого это апофема | har birining balandligi apofema | the height of each is the apothem |
| `show.2.2` | основание каждого это сторона | har birining asosi tomon | the base of each is a side |
| `audio.mount` | Развернём правильную пирамиду. Сторона основания шесть, апофема пять. | Muntazam piramidani yoyamiz. Asos tomoni olti, apofema besh. | Let us unfold a regular pyramid. The base side is six, the apothem is five. |
| `audio.move*` | В развёртке пирамиды основание лежит в центре, а боковые грани раскладываются вокруг него треугольниками. У каждого треугольника основание это сторона основания пирамиды, а высота это апофема. Вот почему апофема так важна, и вот почему её нельзя подменять боковым ребром: ребро высотой треугольника не является. Площадь одного треугольника это половина произведения шесть на пять, то есть пятнадцать. Треугольников четыре, значит боковая поверхность шестьдесят. | Piramida yoyilmasida asos markazda yotadi, yon yoqlar esa uning atrofida uchburchak bo'lib yoziladi. Har uchburchakning asosi piramida asosining tomoni, balandligi esa apofema. Apofema shuning uchun muhim, va uni yon qirra bilan almashtirib bo'lmasligi ham shundan: qirra uchburchakning balandligi emas. Bitta uchburchak yuzasi olti karra beshning yarmi, ya'ni o'n besh. Uchburchaklar to'rtta, demak yon sirt oltmish. | In the net of a pyramid the base lies in the centre and the lateral faces spread around it as triangles. For each triangle the base is a side of the pyramid base and the height is the apothem. That is why the apothem matters so much, and why it cannot be replaced by the lateral edge: the edge is not the height of the triangle. The area of one triangle is half of six times five, that is fifteen. There are four triangles, so the lateral area is sixty. |
| `audio.work` | Посчитай сам. Сторона основания шесть, апофема пять. Какова боковая поверхность? | O'zingiz hisoblang. Asos tomoni olti, apofema besh. Yon sirt qancha? | Work it out yourself. The base side is six, the apothem is five. What is the lateral area? |
| `work.prompt` | Найди боковую поверхность | Yon sirtni toping | Find the lateral area |
| `work.ok` | Шестьдесят. Четыре треугольника по пятнадцать. | Oltmish. To'rt uchburchak o'n beshtadan. | Sixty. Four triangles of fifteen each. |
| `work.hint.1` | Посчитай площадь одного треугольника. | Bitta uchburchak yuzasini hisoblang. | Compute the area of one triangle. |
| `work.hint.2` | Половина произведения стороны на апофему. | Tomonni apofemaga ko'paytirganning yarmi. | Half the product of the side and the apothem. |
| `work.hint.3` | Пятнадцать умножить на четыре. | O'n besh karra to'rt. | Fifteen times four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = ½·P·m` |
| `work.answer` | `60` |

---

## Экран 7 · `explain5` · ответ `number` · тег `ploshchad-po-kartinke`

Граница: видимые грани зависят от ракурса, площадь нет.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Ракурс меняет вид, не площадь | Rakurs ko'rinishni o'zgartiradi, yuzani emas | The view changes what you see, not the area |
| `show.1.1` | с одного ракурса видно три грани | bir rakursdan uch yoq ko'rinadi | from one view three faces show |
| `show.1.2` | поверни и видно другие три | buring va boshqa uchtasi ko'rinadi | rotate and another three show |
| `show.2.1` | больше трёх сразу не видно | birdan uchtadan ko'p ko'rinmaydi | more than three never show at once |
| `show.2.2` | а поверхность всё та же | sirt esa o'sha | while the surface is the same |
| `audio.mount` | Посмотрим на куб с разных сторон и посчитаем, сколько граней видно сразу. | Kubga turli tomondan qaraymiz va birdan nechta yoq ko'rinishini sanaymiz. | Let us look at a cube from different sides and count how many faces show at once. |
| `audio.move*` | Сколько куб ни крути, больше трёх граней одновременно увидеть нельзя. Три видно, три скрыто, и какие именно, зависит от ракурса. А площадь поверхности при повороте не меняется, потому что она про тело, а не про взгляд. Отсюда правило работы. Площадь считают по развёртке или по формуле, а не по числу видимых кусков. Если сложить только видимое, ответ окажется ровно вдвое меньше настоящего, и ошибку легко не заметить. | Kubni qancha burmang, birdan uchtadan ko'p yoqni ko'rish mumkin emas. Uchtasi ko'rinadi, uchtasi yashiringan, va qaysi biri ekani rakursga bog'liq. Sirt yuzasi esa burilishda o'zgarmaydi, chunki u jism haqida, qarash haqida emas. Ish qoidasi shundan. Yuza yoyilma yoki formula bo'yicha hisoblanadi, ko'rinadigan bo'laklar soni bo'yicha emas. Faqat ko'rinadiganini qo'shsangiz, javob haqiqiysidan roppa-rosa ikki baravar kichik chiqadi, va xatoni sezmaslik oson. | However much you rotate the cube, more than three faces can never be seen at once. Three show, three are hidden, and which ones depends on the view. The surface area does not change under rotation, because it is about the body and not about the look. Hence the working rule. The area is computed from the net or from a formula, not from the number of visible pieces. If you add only what you see, the answer comes out exactly half of the true one, and the mistake is easy to miss. |
| `audio.work` | Посчитай сам. Сколько граней куба видно одновременно? | O'zingiz hisoblang. Kubning nechta yog'i birdan ko'rinadi? | Work it out yourself. How many faces of a cube show at once? |
| `work.prompt` | Сколько граней видно сразу? | Birdan nechta yoq ko'rinadi? | How many faces show at once? |
| `work.ok` | Три. Остальные три скрыты, но в площадь входят все шесть. | Uchta. Qolgan uchtasi yashiringan, lekin yuzaga oltitasi kiradi. | Three. The other three are hidden, but all six enter the area. |
| `work.hint.1` | Поверни куб и посчитай видимые грани. | Kubni buring va ko'rinadigan yoqlarni sanang. | Rotate the cube and count the visible faces. |
| `work.hint.2` | Сколько бы ты ни крутил, число не меняется. | Qancha burmang, son o'zgarmaydi. | However much you rotate, the number does not change. |
| `work.hint.3` | Три. | Uchta. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `3 + 3 = 6` |
| `work.answer` | `3` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `ploshchad-po-kartinke`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Поверхность считают по развёртке | Sirt yoyilma bo'yicha hisoblanadi | The surface is counted from the net |
| `probe.question` | Что складывают, считая площадь поверхности? | Sirt yuzasini hisoblaganda nima qo'shiladi? | What is added when computing the surface area? |
| `probe.a` [верно] | площади всех граней | barcha yoqlar yuzalari | the areas of all the faces |
| `probe.b` | площади видимых граней | ko'rinadigan yoqlar yuzalari | the areas of the visible faces |
| `probe.b.hint` | Видимость зависит от ракурса, а площадь нет. | Ko'rinish rakursga bog'liq, yuza esa yo'q. | Visibility depends on the view, the area does not. |
| `rule.lawLabel` | Площадь поверхности | Sirt yuzasi | The surface area |
| `rule.lines.1` | полная поверхность это боковая плюс основания, у призмы их два | to'liq sirt yon sirt qo'shuv asoslar, prizmada ular ikkita | the full surface is the lateral one plus the bases, a prism has two |
| `rule.lines.2` | боковая поверхность прямой призмы это периметр на высоту | to'g'ri prizmaning yon sirti perimetr karra balandlik | the lateral area of a right prism is the perimeter times the height |
| `rule.lines.3` | боковая поверхность правильной пирамиды это половина периметра на апофему | muntazam piramidaning yon sirti perimetrning yarmi karra apofema | the lateral area of a regular pyramid is half the perimeter times the apothem |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Обе формулы в карточке не новые. Первая это площадь прямоугольника, вторая площадь треугольника, взятая столько раз, сколько сторон у основания. Поэтому запоминать их не обязательно, достаточно помнить, как выглядит развёртка. И полная поверхность это всегда боковая плюс основания, у призмы два основания, у пирамиды одно. | Kartochkadagi ikkala formula ham yangi emas. Birinchisi to'g'ri to'rtburchak yuzasi, ikkinchisi uchburchak yuzasi, asos tomonlari qancha bo'lsa shuncha marta olingani. Shuning uchun ularni yodlash shart emas, yoyilma qanday ko'rinishini eslash yetarli. To'liq sirt esa doim yon sirt qo'shuv asoslar, prizmada ikki asos, piramidada bitta. | Neither formula on the card is new. The first is the area of a rectangle, the second the area of a triangle taken as many times as the base has sides. So there is no need to memorise them, it is enough to remember what the net looks like. And the full surface is always the lateral one plus the bases, two bases for a prism and one for a pyramid. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `S = S₁ + 2S₀` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `ploshchad-po-kartinke`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Формула и тело | Formula va jism | The formula and the body |
| `match.prompt` | Соедини запись с телом | Yozuvni jism bilan birlashtiring | Match the reading with the body |
| `match.ok` | Все четыре на месте. Каждая формула это площадь плоской фигуры. | To'rttasi ham joyida. Har formula yassi shakl yuzasi. | All four in place. Every formula is the area of a flat figure. |
| `audio.mount` | Четыре записи и четыре названия. Соедини их. | To'rt yozuv va to'rt nom. Ularni birlashtiring. | Four readings and four names. Match them. |
| `match.a` | боковая призмы | prizma yon sirti | lateral, prism |
| `match.b` | полная параллелепипеда | parallelepiped to'liq sirti | full, box |
| `match.c` | боковая пирамиды | piramida yon sirti | lateral, pyramid |
| `match.d` | полная куба | kub to'liq sirti | full, cube |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `P·h` · `2(ab+bc+ac)` · `½·P·m` · `6a²` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `ploshchad-po-kartinke`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Выведи формулу ленты | Tasma formulasini chiqaring | Derive the strip formula |
| `proof.given` | прямая призма | to'g'ri prizma | a right prism |
| `proof.goal` | боковая поверхность это периметр на высоту | yon sirt perimetr karra balandlik | the lateral area is the perimeter times the height |
| `proof.r1` | боковая поверхность разворачивается в прямоугольник | yon sirt to'g'ri to'rtburchakka yoyiladi | the lateral surface unfolds into a rectangle |
| `proof.r2` | его высота это высота призмы | uning balandligi prizma balandligi | its height is the height of the prism |
| `proof.r3` | его основание это периметр основания | uning asosi asos perimetri | its base is the perimeter of the base |
| `proof.ok` | Доказано. Площадь прямоугольника это произведение его сторон. | Isbotlandi. To'g'ri to'rtburchak yuzasi tomonlarining ko'paytmasi. | Proved. The area of a rectangle is the product of its sides. |
| `proof.e1` | Про высоту дальше. Сначала какая фигура получилась. | Balandlik haqida keyin. Avval qanday shakl chiqdi. | The height comes later. First what figure appeared. |
| `proof.e2` | Фигура известна. Откуда её высота. | Shakl ma'lum. Balandligi qayerdan. | The figure is known. Where does its height come from. |
| `proof.e3` | Высота есть. Теперь про вторую сторону. | Balandlik bor. Endi ikkinchi tomon haqida. | The height is there. Now about the other side. |
| `reason.s1` | развёртка боковой поверхности | yon sirtning yoyilmasi | the net of the lateral surface |
| `reason.s2` | боковые рёбра прямой призмы равны и перпендикулярны основанию | to'g'ri prizmaning yon qirralari teng va asosga perpendikulyar | the lateral edges of a right prism are equal and perpendicular to the base |
| `reason.s3` | рёбра основания идут одно за другим | asos qirralari ketma-ket boradi | the base edges go one after another |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `S = P·h` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Сто пятьдесят. Двадцать пять умножить на шесть. | Bir yuz ellik. Yigirma besh karra olti. | One hundred fifty. Twenty five times six. |
| `task.hint.1` | У куба все грани квадраты. | Kubning barcha yoqlari kvadrat. | All faces of a cube are squares. |
| `task.hint.2` | Площадь одной грани это ребро в квадрате. | Bitta yoq yuzasi qirraning kvadrati. | The area of one face is the edge squared. |
| `task.hint.3` | Двадцать пять умножить на шесть. | Yigirma besh karra olti. | Twenty five times six. |
| `order.prompt` | Расставь записи в том порядке, в каком считают | Yozuvlarni hisoblash tartibida joylashtiring | Arrange the readings in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Сначала одна грань, потом все. | Tartib to'g'ri. Avval bitta yoq, keyin hammasi. | The order is right. First one face, then all of them. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как считают. | Endi yozuvlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the readings. Arrange them the way they are computed. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `a = 5,   S = ?` |
| `task.answer` | `150` |
| `order.items` | `6a²` · `a` · `a²` · `S` |
| `order.answer` | `a  a²  6a²  S` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Измерения выписаны верно. | O'lchamlar to'g'ri yozilgan. | The dimensions are written correctly. |
| `hint.r2` | Три произведения найдены верно. | Uch ko'paytma to'g'ri topilgan. | The three products are found correctly. |
| `hint.r4` | Ответ получен из неверной строки выше. | Javob yuqoridagi xato qatordan olingan. | The answer comes from the wrong line above. |
| `proof` | Разверни тело: кусков шесть, а сложены только три. | Jismni yoying: bo'laklar oltita, qo'shilgani esa uchta. | Unfold the body: there are six pieces and only three were added. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Забыли умножить на два, то есть невидимые грани. | Uchinchi. Ikkiga ko'paytirish, ya'ni ko'rinmas yoqlar esdan chiqdi. | The third. They forgot to multiply by two, that is the invisible faces. |
| `entry.hint.1` | Посчитай, сколько граней вошло в сумму. | Yig'indiga nechta yoq kirganini hisoblang. | Count how many faces went into the sum. |
| `entry.hint.2` | Грани параллелепипеда попарно равны. | Parallelepipedning yoqlari juft-juft teng. | The faces of a box are equal in pairs. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и в одной из них потерялись грани. | To'rt qator, va ulardan birida yoqlar yo'qolgan. | Four lines, and in one of them faces got lost. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a = 2,   b = 3,   c = 4` |
| `row.r2` | `6 + 12 + 8 = 26` |
| `row.r3` | `S = 26` |
| `row.r4` | `S = 26` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Площадь поверхности куба пятьдесят четыре. Каково ребро? | Kubning sirt yuzasi ellik to'rt. Qirra qancha? | The surface area of a cube is fifty four. What is the edge? |
| `place.ok` | Три. Пятьдесят четыре делить на шесть это девять, корень из девяти три. | Uch. Ellik to'rtni oltiga bo'lsak to'qqiz, to'qqizdan ildiz uch. | Three. Fifty four divided by six is nine, the root of nine is three. |
| `place.wrong` | Сначала найди площадь одной грани. | Avval bitta yoq yuzasini toping. | First find the area of one face. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно всегда | Nima doim to'g'ri | What is always true |
| `multi.d.hint` | Это сумма только видимых граней. | Bu faqat ko'rinadigan yoqlar yig'indisi. | That is the sum of the visible faces only. |
| `multi.e.hint` | У пирамиды основание одно, а не два. | Piramidada asos bitta, ikkita emas. | A pyramid has one base, not two. |
| `multi.ok` | Три записи из пяти. Две оставшиеся теряют грани. | Beshtadan uch yozuv. Qolgan ikkitasi yoqlarni yo'qotadi. | Three readings out of five. The other two lose faces. |
| `audio.mount` | Прочитаем формулу справа налево. По площади найдём ребро. | Formulani o'ngdan chapga o'qiymiz. Yuza bo'yicha qirrani topamiz. | Let us read the formula from right to left. From the area we find the edge. |
| `audio.work` | Отметь все записи, которые верны всегда. Их больше одной. | Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are always true. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `3` |
| `place.step` | `54 : 6 = 9` |
| `multi.a` [верно] | `6a²` |
| `multi.b` [верно] | `2(ab+bc+ac)` |
| `multi.c` [верно] | `P·h` |
| `multi.d` | `ab + bc + ac` |
| `multi.e` | `½·P·m + 2S₀` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `ploshchad-po-kartinke`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что такое развёртка? | Yoyilma nima? | What is a net? |
| `q1.a` [верно] | плоская фигура из всех граней | barcha yoqlardan yassi shakl | a flat figure of all the faces |
| `q1.b` | вид тела сбоку | jismning yon ko'rinishi | a side view of the body |
| `q1.b.hint` | Вид сбоку показывает не все грани. | Yon ko'rinish barcha yoqlarni ko'rsatmaydi. | A side view does not show all the faces. |
| `q1.c` | сечение тела | jismning kesimi | a section of the body |
| `q1.c.hint` | Сечение это разрез, а не разворот. | Kesim kesish, yoyish emas. | A section is a cut, not an unfolding. |
| `q1.d` | тень тела | jismning soyasi | the shadow of the body |
| `q1.d.hint` | Тень это проекция, площади она не сохраняет. | Soya proyeksiya, u yuzani saqlamaydi. | A shadow is a projection, it does not preserve areas. |
| `q2.prompt` | Боковая поверхность прямой призмы? | To'g'ri prizmaning yon sirti? | The lateral area of a right prism? |
| `q2.a` [верно] | периметр на высоту | perimetr karra balandlik | the perimeter times the height |
| `q2.b` | площадь основания на высоту | asos yuzasi karra balandlik | the base area times the height |
| `q2.b.hint` | Это была бы не площадь, а другая величина. | Bu yuza emas, boshqa kattalik bo'lardi. | That would not be an area but a different quantity. |
| `q2.c` | сторона на высоту | tomon karra balandlik | a side times the height |
| `q2.c.hint` | Сторона даёт одну грань, а не всю ленту. | Tomon bitta yoq beradi, butun tasmani emas. | A side gives one face, not the whole strip. |
| `q2.d` | половина периметра на высоту | perimetrning yarmi karra balandlik | half the perimeter times the height |
| `q2.d.hint` | Половина появляется у пирамиды, из площади треугольника. | Yarim piramidada, uchburchak yuzasidan paydo bo'ladi. | The half appears for a pyramid, from the triangle area. |
| `q3.prompt` | Что является высотой боковой грани пирамиды? | Piramida yon yog'ining balandligi nima? | What is the height of a lateral face of a pyramid? |
| `q3.a` [верно] | апофема | apofema | the apothem |
| `q3.b` | боковое ребро | yon qirra | the lateral edge |
| `q3.b.hint` | Ребро приходит в вершину основания. | Qirra asos uchiga keladi. | The edge arrives at a base vertex. |
| `q3.c` | высота пирамиды | piramida balandligi | the height of the pyramid |
| `q3.c.hint` | Высота пирамиды в боковой грани не лежит. | Piramida balandligi yon yoqda yotmaydi. | The height of the pyramid does not lie in a lateral face. |
| `q3.d` | сторона основания | asos tomoni | a base side |
| `q3.d.hint` | Сторона это основание треугольника, а не высота. | Tomon uchburchakning asosi, balandligi emas. | The side is the base of the triangle, not its height. |
| `q4.prompt` | Сколько граней куба видно сразу? | Kubning nechta yog'i birdan ko'rinadi? | How many faces of a cube show at once? |
| `q4.a` [верно] | три | uchta | three |
| `q4.b` | шесть | oltita | six |
| `q4.b.hint` | Шесть это все грани, но половина скрыта. | Olti barcha yoqlar, lekin yarmi yashiringan. | Six is all the faces, but half are hidden. |
| `q4.c` | четыре | to'rtta | four |
| `q4.c.hint` | Четвёртая грань всегда уходит за тело. | To'rtinchi yoq doim jism orqasiga ketadi. | The fourth face always goes behind the body. |
| `q4.d` | одна | bitta | one |
| `q4.d.hint` | Одна видна только строго напротив грани. | Bitta faqat yoqqa tik qaraganda ko'rinadi. | One shows only when looking straight at a face. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `4 + 2 = 6` |
| `q2.done` | `P·h` |
| `q3.done` | `m` |
| `q4.done` | `3 + 3 = 6` |
| `angles` | `P·h` · `2(ab+bc+ac)` · `½·P·m` · `6a²` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Разворачиваю тело в плоскую фигуру | Jismni yassi shaklga yoyaman | I unfold a body into a flat figure |
| `can.2` | Складываю площади всех граней, а не видимых | Ko'rinadiganlarini emas, barcha yoqlar yuzasini qo'shaman | I add the areas of all the faces, not the visible ones |
| `can.3` | Считаю боковую поверхность призмы как прямоугольник | Prizmaning yon sirtini to'g'ri to'rtburchak kabi hisoblayman | I compute the lateral area of a prism as a rectangle |
| `can.4` | Считаю боковую поверхность пирамиды через апофему | Piramidaning yon sirtini apofema orqali hisoblayman | I compute the lateral area of a pyramid through the apothem |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше правильные призмы и пирамиды, где все эти формулы становятся короче | Bundan keyin muntazam prizma va piramidalar, u yerda bu formulalar qisqaradi | Next come regular prisms and pyramids, where all these formulas get shorter |
| `lifehack` | Не помнишь формулу — разверни тело в голове | Formulani eslamasangiz, jismni xayolda yoying | If you forget a formula, unfold the body in your head |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страницы пятьдесят девять и шестьдесят | Geometriya, ellik to'qqizinchi va oltmishinchi betlar | Geometry, pages fifty nine and sixty |
| `audio.mount` | Урок начался с вопроса, сколько граней складывать. | Dars nechta yoqni qo'shish kerak degan savol bilan boshlandi. | The lesson began with the question how many faces to add. |
| `audio.next` | Три это то, что видно, а шесть это то, что есть. Развёртка показала все куски сразу, и площадь поверхности стала суммой площадей плоских фигур, которые мы умеем считать давно. Ни одной новой формулы в уроке не появилось: лента это прямоугольник, боковая грань пирамиды это треугольник. Дальше правильные призмы и пирамиды, там эти же формулы станут короче, потому что все стороны основания равны. | Uch bu ko'rinadigani, olti bu bori. Yoyilma barcha bo'laklarni birdan ko'rsatdi, va sirt yuzasi biz allaqachon hisoblay oladigan yassi shakllar yuzalarining yig'indisiga aylandi. Darsda birorta yangi formula paydo bo'lmadi: tasma to'g'ri to'rtburchak, piramidaning yon yog'i uchburchak. Keyin muntazam prizma va piramidalar, u yerda shu formulalar qisqaradi, chunki asosning barcha tomonlari teng. | Three is what shows, six is what there is. The net showed all the pieces at once, and the surface area became a sum of areas of flat figures we have been able to compute for a long time. Not a single new formula appeared in the lesson: the strip is a rectangle, a lateral face of a pyramid is a triangle. Next come regular prisms and pyramids, where these same formulas get shorter, because all sides of the base are equal. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `S = ab + bc + ac` |
| `hook.b` | `S = 2(ab+bc+ac)` |
| `proved` | `S = 2(ab+bc+ac)` |
| `law` | `S = S₁ + 2S₀` |
| `sheet.1` | `P·h` |
| `sheet.2` | `2(ab+bc+ac)` |
| `sheet.3` | `½·P·m` |
| `sheet.4` | `6a²` |
| `sheet.5` | `3 + 3 = 6` |
