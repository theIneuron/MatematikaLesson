# Урок 44 — Призма · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS43_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, стр. 44 — многогранник, его
грани, вершины, рёбра и диагональ, выпуклость, определение призмы; стр. 45 — прямая призма.
Определения взяты дословно.

**Главное решение урока.** Ошибка года здесь про имена: грань, сторона и ребро сливаются в
одно. У многогранника грань это многоугольник, ребро это сторона грани, и каждое ребро
принадлежит **двум** граням сразу. Отсюда и счёт: у треугольной призмы не шесть рёбер, а девять.
Показать это можно поворотом: грань видна плоской, а тело нет, и ребро видно как общее.

**Начало блока 7 и первый урок прибора 6B.** `Space` получил генератор многогранника (`poly`)
и закрашенные грани (`faces`). Снято на стенде до сборки.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`ko'pyoq`, `yoq`, `qirra`, `uch`, `prizma`, `asos`, `yon yoq`, `to'g'ri prizma` взяты из
учебника, стр. 44–45.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРИЗМА | PRIZMA | THE PRISM |
| `title` | Шесть рёбер или девять | Olti qirra yoki to'qqiz | Six edges or nine |
| `row.a.name` | шесть | olti | six |
| `row.b.name` | девять | to'qqiz | nine |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём призму. | Javobingiz yozib olindi. Endi prizmani buramiz. | Your answer is recorded. Now we rotate the prism. |
| `audio.mount` | Треугольная призма. Два треугольника сверху и снизу, между ними боковая поверхность. | Uchburchakli prizma. Tepada va pastda ikki uchburchak, ular orasida yon sirt. | A triangular prism. Two triangles above and below, and the lateral surface between them. |
| `audio.r1` | Первая запись говорит шесть. Три стороны внизу и три сверху. | Birinchi yozuv oltini aytadi. Pastda uchta tomon va tepada uchta. | The first reading says six. Three sides below and three above. |
| `audio.r2` | Вторая говорит девять. | Ikkinchisi to'qqizni aytadi. | The second says nine. |
| `audio.ask` | Посмотри на чертёж и реши, какая запись верная. Пока просто предположи. | Chizmaga qarang va qaysi yozuv to'g'ri ekanini hal qiling. Hozircha shunchaki taxmin qiling. | Look at the drawing and decide which reading is right. Just guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCA₁B₁C₁` |
| `row.a.value` | `6` |
| `row.b.value` | `9` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из блока про плоскости | Tekisliklar bloki dan uch savol | Three questions from the block about planes |
| `q1.prompt` | Когда прямая перпендикулярна плоскости? | To'g'ri chiziq qachon tekislikka perpendikulyar? | When is a line perpendicular to a plane? |
| `q1.a` [верно] | когда перпендикулярна двум пересекающимся | ikki kesishuvchi chiziqqa perpendikulyar bo'lganda | when perpendicular to two crossing lines |
| `q1.b` | когда перпендикулярна одной прямой | bitta chiziqqa perpendikulyar bo'lganda | when perpendicular to one line |
| `q1.b.hint` | Одной мало, поворот это показывал. | Bittasi kam, burilish shuni ko'rsatgan. | One is not enough, the rotation showed that. |
| `q1.c` | когда пересекает плоскость | tekislikni kesib o'tganda | when it crosses the plane |
| `q1.c.hint` | Пересечь можно и наклонно. | Kesib o'tish qiyshiq ham bo'ladi. | Crossing can be at a slant too. |
| `q1.d` | когда лежит в плоскости | tekislikda yotganda | when it lies in the plane |
| `q1.d.hint` | Лежащая в плоскости прямая ей не перпендикулярна. | Tekislikda yotgan chiziq unga perpendikulyar emas. | A line lying in the plane is not perpendicular to it. |
| `q2.prompt` | Что такое двугранный угол? | Ikki yoqli burchak nima? | What is a dihedral angle? |
| `q2.a` [верно] | две полуплоскости с общим ребром | umumiy qirrali ikki yarimtekislik | two half-planes with a common edge |
| `q2.b` | две пересекающиеся прямые | ikki kesishuvchi chiziq | two crossing lines |
| `q2.b.hint` | Это плоский угол, а не двугранный. | Bu yassi burchak, ikki yoqli emas. | That is a plane angle, not a dihedral one. |
| `q2.c` | две параллельные плоскости | ikki parallel tekislik | two parallel planes |
| `q2.c.hint` | У параллельных общего ребра нет. | Parallellarning umumiy qirrasi yo'q. | Parallel planes have no common edge. |
| `q2.d` | угол между прямой и плоскостью | chiziq va tekislik orasidagi burchak | the angle between a line and a plane |
| `q2.d.hint` | Тот угол был про прямую, а этот про две грани. | O'sha burchak chiziq haqida edi, bu esa ikki yoq haqida. | That angle was about a line, this one about two faces. |
| `q3.prompt` | Сколько плоскостей проходит через две параллельные прямые? | Ikki parallel to'g'ri chiziq orqali nechta tekislik o'tadi? | How many planes pass through two parallel lines? |
| `q3.a` [верно] | одна | bitta | one |
| `q3.b` | две | ikkita | two |
| `q3.b.hint` | Две плоскости пересеклись бы по прямой. | Ikki tekislik chiziq bo'ylab kesishardi. | Two planes would cross along a line. |
| `q3.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.c.hint` | Бесконечно много бывает через ОДНУ прямую. | Cheksiz ko'p BITTA chiziq orqali bo'ladi. | Infinitely many happens through ONE line. |
| `q3.d` | ни одной | bitta ham yo'q | none |
| `q3.d.hint` | Параллельные прямые всегда лежат в одной плоскости. | Parallel chiziqlar doim bitta tekislikda yotadi. | Parallel lines always lie in one plane. |
| `audio.mount` | Три вопроса. Все три понадобятся, когда призма встанет на плоскость. | Uchta savol. Prizma tekislikka turganda uchalasi ham kerak bo'ladi. | Three questions. All three will be needed when the prism stands on a plane. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a ⊥ b,  a ⊥ c   →   a ⊥ α` |
| `q2.done` | `a = α ∩ β` |
| `q3.done` | `1` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Многогранник: грани, вершины, рёбра.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Тело из плоских многоугольников | Yassi ko'pburchaklardan jism | A body of flat polygons |
| `show.1.1` | нижний многоугольник это грань | pastdagi ko'pburchak yoq | the lower polygon is a face |
| `show.1.2` | таких многоугольников несколько | bunday ko'pburchaklar bir nechta | there are several such polygons |
| `show.2.1` | вместе они ограничивают тело | birgalikda ular jismni chegaralaydi | together they bound a body |
| `show.2.2` | каждая грань плоская, тело нет | har yoq yassi, jism esa yo'q | each face is flat, the body is not |
| `audio.mount` | Перед нами тело, ограниченное плоскими многоугольниками. Такое тело называется многогранником. | Oldimizda yassi ko'pburchaklar bilan chegaralangan jism. Bunday jism ko'pyoq deb ataladi. | Before us is a body bounded by flat polygons. Such a body is called a polyhedron. |
| `audio.move*` | Многоугольники это грани многогранника, их вершины это вершины многогранника, а стороны это рёбра. Так на странице сорок четыре. Поверни тело и следи за одной гранью. Она остаётся плоской при любом повороте, потому что она многоугольник, а вот само тело плоским не бывает никогда. Разница между гранью и телом это разница между двумерным и трёхмерным, и на чертеже она видна только в повороте. | Ko'pburchaklar ko'pyoqning yoqlari, ularning uchlari ko'pyoqning uchlari, tomonlari esa qirralari. Qirq to'rtinchi betda shunday. Jismni buring va bitta yoqqa qarang. U har qanday burilishda yassi qoladi, chunki u ko'pburchak, jismning o'zi esa hech qachon yassi bo'lmaydi. Yoq va jism orasidagi farq ikki o'lchov va uch o'lchov orasidagi farq, va chizmada u faqat burilishda ko'rinadi. | The polygons are the faces of the polyhedron, their vertices are its vertices, and their sides are its edges. So it is on page forty four. Rotate the body and watch one face. It stays flat at any rotation, because it is a polygon, while the body itself is never flat. The difference between a face and the body is the difference between two dimensions and three, and on a drawing it shows only under rotation. |
| `audio.work` | Посчитай сам. Сколько граней у треугольной призмы? | O'zingiz hisoblang. Uchburchakli prizmaning nechta yog'i bor? | Work it out yourself. How many faces does a triangular prism have? |
| `work.prompt` | Сколько граней? | Nechta yoq? | How many faces? |
| `work.ok` | Пять. Два треугольника и три четырёхугольника. | Beshta. Ikki uchburchak va uch to'rtburchak. | Five. Two triangles and three quadrilaterals. |
| `work.hint.1` | Считай отдельно те, что сверху и снизу, и те, что по бокам. | Tepa va pastdagilarini hamda yonlaridagilarini alohida sanang. | Count the ones above and below separately from the side ones. |
| `work.hint.2` | Сверху и снизу по одному треугольнику. | Tepada va pastda bittadan uchburchak. | One triangle above and one below. |
| `work.hint.3` | Два плюс три. | Ikki qo'shuv uch. | Two plus three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `2 + 3 = 5` |
| `work.answer` | `5` |

---

## Экран 4 · `explain2` · ответ `number` · тег `gran-ne-storona`

Разграничение: грань, сторона, ребро.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Ребро принадлежит двум граням | Qirra ikki yoqqa tegishli | An edge belongs to two faces |
| `show.1.1` | одна грань подсвечена | bitta yoq yoritilgan | one face is highlighted |
| `show.1.2` | у неё есть стороны | uning tomonlari bor | it has sides |
| `show.2.1` | подсвечена вторая грань | ikkinchi yoq yoritilgan | the second face is highlighted |
| `show.2.2` | сторона у них общая, это ребро | tomoni umumiy, bu qirra | the side is common, that is the edge |
| `audio.mount` | Подсветим одну грань. У неё, как у любого многоугольника, есть стороны. | Bitta yoqni yoritamiz. Unda, har qanday ko'pburchakda bo'lgani kabi, tomonlar bor. | Let us highlight one face. Like any polygon it has sides. |
| `audio.move*` | Теперь подсветим вторую грань, у которой с первой есть общая сторона. Эта общая сторона и называется ребром многогранника. Отсюда правило счёта. Каждое ребро принадлежит ровно двум граням, поэтому считать стороны всех граней подряд нельзя, каждое ребро попадётся дважды. У треугольной призмы сторон у граней восемнадцать, а рёбер девять. Поверни тело и убедись, что общее ребро остаётся общим при любом ракурсе. | Endi birinchisi bilan umumiy tomoni bor ikkinchi yoqni yoritamiz. Bu umumiy tomon ko'pyoqning qirrasi deb ataladi. Sanoq qoidasi ham shundan. Har qirra roppa-rosa ikki yoqqa tegishli, shuning uchun barcha yoqlarning tomonlarini ketma-ket sanash mumkin emas, har qirra ikki marta tushadi. Uchburchakli prizmada yoqlarning tomonlari o'n sakkizta, qirralar esa to'qqizta. Jismni buring va umumiy qirra har qanday rakursda umumiy qolishiga ishonch hosil qiling. | Now let us highlight a second face that shares a side with the first. That common side is called an edge of the polyhedron. Hence the counting rule. Every edge belongs to exactly two faces, so you cannot count the sides of all faces one after another, each edge would come up twice. A triangular prism has eighteen face sides and nine edges. Rotate the body and make sure the common edge stays common at any view. |
| `audio.work` | Посчитай сам. Сколько граней сходится в одном ребре? | O'zingiz hisoblang. Bitta qirrada nechta yoq tutashadi? | Work it out yourself. How many faces meet at one edge? |
| `work.prompt` | Сколько граней в одном ребре? | Bitta qirrada nechta yoq? | How many faces at one edge? |
| `work.ok` | Две. Поэтому рёбер вдвое меньше, чем сторон у всех граней. | Ikkita. Shuning uchun qirralar barcha yoqlar tomonlaridan ikki baravar kam. | Two. That is why there are half as many edges as sides of all the faces. |
| `work.hint.1` | Посмотри на подсвеченную сторону и посчитай грани при ней. | Yoritilgan tomonga qarang va undagi yoqlarni sanang. | Look at the highlighted side and count the faces at it. |
| `work.hint.2` | Ребро это линия сгиба между двумя гранями. | Qirra ikki yoq orasidagi buklanish chizig'i. | An edge is the fold line between two faces. |
| `work.hint.3` | Две. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `18 : 2 = 9` |
| `work.answer` | `2` |

---

## Экран 5 · `explain3` · ответ `number` · тег `gran-ne-storona`

Основания и боковые грани.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Основания и боковые грани | Asoslar va yon yoqlar | The bases and the lateral faces |
| `show.1.1` | две грани равны и параллельны | ikki yoq teng va parallel | two faces are equal and parallel |
| `show.1.2` | это основания призмы | bu prizmaning asoslari | these are the bases of the prism |
| `show.2.1` | остальные грани параллелограммы | qolgan yoqlar parallelogrammlar | the other faces are parallelograms |
| `show.2.2` | это боковые грани | bu yon yoqlar | these are the lateral faces |
| `audio.mount` | В призме грани не равноправны. Две из них особые. | Prizmada yoqlar teng huquqli emas. Ulardan ikkitasi alohida. | In a prism the faces are not equal in role. Two of them are special. |
| `audio.move*` | Призмой называется многогранник, у которого две грани равные многоугольники, а остальные параллелограммы. Равные грани это основания, параллелограммы это боковые грани. Так на странице сорок четыре. Поверни призму. Ближняя грань меняется, дальняя меняется, а основания остаются основаниями. Кто основание, определяется формой и параллельностью, а не тем, что оказалось внизу чертежа. Поэтому призму можно поставить на боковую грань, и она не перестанет быть призмой. | Prizma deb ikki yog'i teng ko'pburchakdan, qolganlari esa parallelogrammlardan iborat ko'pyoqqa aytiladi. Teng yoqlar asoslar, parallelogrammlar yon yoqlar. Qirq to'rtinchi betda shunday. Prizmani buring. Yaqin yoq o'zgaradi, uzoq yoq o'zgaradi, asoslar esa asos bo'lib qoladi. Kim asos ekanini shakl va parallellik belgilaydi, chizmaning pastida nima qolgani emas. Shuning uchun prizmani yon yog'iga qo'yish mumkin, va u prizma bo'lishdan to'xtamaydi. | A prism is a polyhedron in which two faces are equal polygons and the rest are parallelograms. The equal faces are the bases, the parallelograms are the lateral faces. So it is on page forty four. Rotate the prism. The near face changes, the far face changes, but the bases stay bases. What counts as a base is decided by shape and parallelism, not by what happened to be at the bottom of the drawing. That is why a prism can be stood on a lateral face and it does not stop being a prism. |
| `audio.work` | Посчитай сам. Сколько боковых граней у четырёхугольной призмы? | O'zingiz hisoblang. To'rtburchakli prizmaning nechta yon yog'i bor? | Work it out yourself. How many lateral faces does a quadrilateral prism have? |
| `work.prompt` | Сколько боковых граней? | Nechta yon yoq? | How many lateral faces? |
| `work.ok` | Четыре. Столько же, сколько сторон у основания. | To'rtta. Asos tomonlari qanchaligicha. | Four. As many as the sides of the base. |
| `work.hint.1` | Посмотри, сколько сторон у основания. | Asosning nechta tomoni borligiga qarang. | See how many sides the base has. |
| `work.hint.2` | Каждая сторона основания даёт одну боковую грань. | Asosning har tomoni bitta yon yoq beradi. | Each side of the base gives one lateral face. |
| `work.hint.3` | Четыре. | To'rtta. | Four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCD ∥ A₁B₁C₁D₁` |
| `work.answer` | `4` |

---

## Экран 6 · `explain4` · ответ `number` · тег `gran-ne-storona`

Сам: n-угольная призма.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Считаем по числу сторон основания | Asos tomonlari soni bo'yicha sanaymiz | Counting by the number of base sides |
| `show.1.1` | у основания шесть сторон | asosda olti tomon | the base has six sides |
| `show.1.2` | значит боковых рёбер тоже шесть | demak yon qirralar ham olti | so there are six lateral edges as well |
| `show.2.1` | рёбер основания шесть внизу | asos qirralari pastda olti | six base edges below |
| `show.2.2` | и шесть сверху | va tepada olti | and six above |
| `audio.mount` | Шестиугольная призма. Считать её рёбра по чертежу трудно, поэтому будем считать по правилу. | Oltiburchakli prizma. Uning qirralarini chizma bo'yicha sanash qiyin, shuning uchun qoida bo'yicha sanaymiz. | A hexagonal prism. Counting its edges from the drawing is hard, so we will count by the rule. |
| `audio.move*` | У призмы с n сторонами в основании рёбер основания n внизу и n сверху, а боковых рёбер столько же, сколько вершин у основания, то есть тоже n. Всего получается три n. Вершин у такой призмы два n, а граней n плюс два. Проверь на треугольной призме. Три умножить на три это девять рёбер, и это ровно тот ответ, который мы искали в начале урока. Поверни призму и посчитай боковые рёбра сама, они хорошо видны с бокового ракурса. | Asosida n tomoni bo'lgan prizmada asos qirralari pastda n va tepada n, yon qirralar esa asos uchlari qanchaligicha, ya'ni yana n. Jami uch n chiqadi. Bunday prizmaning uchlari ikki n, yoqlari esa n qo'shuv ikki. Uchburchakli prizmada tekshiring. Uch karra uch bu to'qqiz qirra, va bu dars boshida izlagan javobimiz. Prizmani buring va yon qirralarni o'zingiz sanang, ular yon rakursdan yaxshi ko'rinadi. | In a prism with n sides in the base there are n base edges below and n above, and the lateral edges are as many as the vertices of the base, that is n again. In total that gives three n. Such a prism has two n vertices and n plus two faces. Check it on a triangular prism. Three times three is nine edges, and that is exactly the answer we were looking for at the start of the lesson. Rotate the prism and count the lateral edges yourself, they show well from a side view. |
| `audio.work` | Посчитай сам. Сколько рёбер у шестиугольной призмы? | O'zingiz hisoblang. Oltiburchakli prizmaning nechta qirrasi bor? | Work it out yourself. How many edges does a hexagonal prism have? |
| `work.prompt` | Сколько рёбер? | Nechta qirra? | How many edges? |
| `work.ok` | Восемнадцать. Три умножить на шесть. | O'n sakkiz. Uch karra olti. | Eighteen. Three times six. |
| `work.hint.1` | Считай тремя группами: низ, верх и бок. | Uch guruh bilan sanang: past, tepa va yon. | Count in three groups: bottom, top and side. |
| `work.hint.2` | В каждой группе по шесть. | Har guruhda oltitadan. | Six in each group. |
| `work.hint.3` | Три умножить на шесть. | Uch karra olti. | Three times six. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `3n,   2n,   n + 2` |
| `work.answer` | `18` |

---

## Экран 7 · `explain5` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Граница: прямая призма и наклонная.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Прямая призма и наклонная | To'g'ri prizma va og'ma | A right prism and a slanted one |
| `show.1.1` | боковое ребро наклонено к основанию | yon qirra asosga og'gan | the lateral edge is slanted to the base |
| `show.1.2` | боковые грани не прямоугольники | yon yoqlar to'g'ri to'rtburchak emas | the lateral faces are not rectangles |
| `show.2.1` | ребро встало перпендикулярно | qirra perpendikulyar bo'ldi | the edge stood perpendicular |
| `show.2.2` | теперь призма прямая | endi prizma to'g'ri | now the prism is right |
| `audio.mount` | Две призмы с одинаковыми основаниями. Разница в том, как стоят боковые рёбра. | Bir xil asosli ikki prizma. Farq yon qirralarning qanday turishida. | Two prisms with the same bases. The difference is how the lateral edges stand. |
| `audio.move*` | Призма называется прямой, если её боковые рёбра перпендикулярны основанию. Тогда каждая боковая грань это параллелограмм с прямым углом, то есть прямоугольник. У наклонной призмы боковые грани остаются параллелограммами, но прямых углов в них нет. Обрати внимание, что на неподвижном чертеже наклон бывает почти не виден, и мы это уже знали из урока про перпендикулярность. Проверять надо не глазом, а условием про перпендикулярность ребра. | Prizma yon qirralari asosga perpendikulyar bo'lsa, to'g'ri prizma deb ataladi. Unda har yon yoq to'g'ri burchakli parallelogramm, ya'ni to'g'ri to'rtburchak bo'ladi. Og'ma prizmada yon yoqlar parallelogramm bo'lib qoladi, lekin ularda to'g'ri burchak yo'q. E'tibor bering, qimirlamas chizmada og'ish deyarli ko'rinmasligi mumkin, va buni biz perpendikulyarlik darsidan bilamiz. Ko'z bilan emas, qirraning perpendikulyarligi sharti bilan tekshirish kerak. | A prism is called right if its lateral edges are perpendicular to the base. Then every lateral face is a parallelogram with a right angle, that is a rectangle. In a slanted prism the lateral faces stay parallelograms but have no right angles. Note that on a still drawing the slant can be almost invisible, and we knew that from the lesson about perpendicularity. It has to be checked by the condition about the edge, not by eye. |
| `audio.work` | Посчитай сам. Сколько боковых граней прямой четырёхугольной призмы прямоугольники? | O'zingiz hisoblang. To'g'ri to'rtburchakli prizmaning nechta yon yog'i to'g'ri to'rtburchak? | Work it out yourself. How many lateral faces of a right quadrilateral prism are rectangles? |
| `work.prompt` | Сколько боковых граней прямоугольники? | Nechta yon yoq to'g'ri to'rtburchak? | How many lateral faces are rectangles? |
| `work.ok` | Все четыре. Перпендикулярное ребро даёт прямой угол в каждой боковой грани. | To'rttasi ham. Perpendikulyar qirra har yon yoqda to'g'ri burchak beradi. | All four. A perpendicular edge gives a right angle in every lateral face. |
| `work.hint.1` | Посмотри, сколько боковых граней всего. | Jami nechta yon yoq borligiga qarang. | See how many lateral faces there are in total. |
| `work.hint.2` | Перпендикуляр к плоскости даёт прямой угол со всеми её прямыми. | Tekislikka perpendikulyar uning barcha chiziqlari bilan to'g'ri burchak beradi. | A perpendicular to a plane gives a right angle with all its lines. |
| `work.hint.3` | Все четыре. | To'rttasi ham. | All four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AA₁ ⊥ ABCD` |
| `work.answer` | `4` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Что делает призму призмой | Prizmani prizma qiladigan narsa | What makes a prism a prism |
| `probe.question` | Какое условие обязательно? | Qaysi shart majburiy? | Which condition is required? |
| `probe.a` [верно] | два основания равные, остальные параллелограммы | ikki asos teng, qolganlari parallelogramm | two bases equal, the rest parallelograms |
| `probe.b` | все грани параллелограммы | barcha yoqlar parallelogramm | all faces are parallelograms |
| `probe.b.hint` | Тогда треугольная призма призмой не была бы. | Unda uchburchakli prizma prizma bo'lmasdi. | Then a triangular prism would not be a prism. |
| `rule.lawLabel` | Призма | Prizma | The prism |
| `rule.lines.1` | две грани равные многоугольники, это основания | ikki yoq teng ko'pburchak, bu asoslar | two faces are equal polygons, these are the bases |
| `rule.lines.2` | остальные грани параллелограммы, это боковые грани | qolgan yoqlar parallelogramm, bu yon yoqlar | the other faces are parallelograms, these are the lateral faces |
| `rule.lines.3` | если боковое ребро перпендикулярно основанию, призма прямая | yon qirra asosga perpendikulyar bo'lsa, prizma to'g'ri | if the lateral edge is perpendicular to the base, the prism is right |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | В определении два условия, и оба про грани. Два основания равны, и они многоугольники любой формы. Остальные грани параллелограммы, и это следует из того, что основания равны и параллельны. Если сказать, что все грани параллелограммы, получится другое тело, у которого и основания параллелограммы, то есть параллелепипед. Прямая призма это добавочное условие сверху, и оно про перпендикулярность бокового ребра. | Ta'rifda ikki shart bor, va ikkalasi ham yoqlar haqida. Ikki asos teng, va ular istalgan shakldagi ko'pburchak. Qolgan yoqlar parallelogramm, va bu asoslarning teng va parallel bo'lishidan kelib chiqadi. Barcha yoqlar parallelogramm deyilsa, boshqa jism chiqadi, uning asoslari ham parallelogramm, ya'ni parallelepiped. To'g'ri prizma ustiga qo'shimcha shart, va u yon qirraning perpendikulyarligi haqida. | The definition has two conditions and both are about faces. The two bases are equal and they are polygons of any shape. The other faces are parallelograms, and that follows from the bases being equal and parallel. If you say all faces are parallelograms you get a different body whose bases are parallelograms too, that is a parallelepiped. A right prism is an extra condition on top, and it is about the perpendicularity of the lateral edge. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `ABC = A₁B₁C₁,   ABB₁A₁ = ▱` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `gran-ne-storona`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Назови каждую часть | Har bir qismni nomlang | Name each part |
| `match.prompt` | Соедини запись с названием | Yozuvni nomi bilan birlashtiring | Match the reading with the name |
| `match.ok` | Все четыре на месте. Дальше эти имена берём как рабочие. | To'rttasi ham joyida. Bundan keyin bu nomlarni ishchi deb olamiz. | All four in place. From here these names are the working ones. |
| `audio.mount` | Четыре записи и четыре названия. Соедини их. | To'rt yozuv va to'rt nom. Ularni birlashtiring. | Four readings and four names. Match them. |
| `match.a` | основание | asos | the base |
| `match.b` | боковая грань | yon yoq | a lateral face |
| `match.c` | боковое ребро | yon qirra | a lateral edge |
| `match.d` | ребро основания | asos qirrasi | a base edge |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `ABC` · `ABB₁A₁` · `AA₁` · `AB` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи про боковые грани | Yon yoqlar haqida isbotlang | Prove it about the lateral faces |
| `proof.given` | прямая призма | to'g'ri prizma | a right prism |
| `proof.goal` | её боковые грани прямоугольники | uning yon yoqlari to'g'ri to'rtburchak | its lateral faces are rectangles |
| `proof.r1` | боковое ребро перпендикулярно основанию | yon qirra asosga perpendikulyar | the lateral edge is perpendicular to the base |
| `proof.r2` | значит оно перпендикулярно ребру основания | demak u asos qirrasiga perpendikulyar | so it is perpendicular to the base edge |
| `proof.r3` | боковая грань параллелограмм с прямым углом | yon yoq to'g'ri burchakli parallelogramm | the lateral face is a parallelogram with a right angle |
| `proof.ok` | Доказано. Параллелограмм с прямым углом это прямоугольник. | Isbotlandi. To'g'ri burchakli parallelogramm to'g'ri to'rtburchak. | Proved. A parallelogram with a right angle is a rectangle. |
| `proof.e1` | Определение призмы идёт дальше. Сначала про слово прямая. | Prizma ta'rifi keyin keladi. Avval to'g'ri so'zi haqida. | The definition of a prism comes later. First about the word right. |
| `proof.e2` | Перпендикулярность к плоскости уже есть. Что она даёт прямым в ней. | Tekislikka perpendikulyarlik bor. U undagi chiziqlarga nima beradi. | Perpendicularity to the plane is there. What does it give to the lines in it. |
| `proof.e3` | Прямой угол получен. Теперь про форму грани. | To'g'ri burchak olindi. Endi yoqning shakli haqida. | The right angle is obtained. Now about the shape of the face. |
| `reason.s1` | определение прямой призмы | to'g'ri prizma ta'rifi | the definition of a right prism |
| `reason.s2` | перпендикуляр даёт прямой угол со всеми прямыми плоскости | perpendikulyar tekislikning barcha chiziqlari bilan to'g'ri burchak beradi | a perpendicular gives a right angle with all lines of the plane |
| `reason.s3` | определение призмы | prizma ta'rifi | the definition of a prism |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AA₁ ⊥ ABCD   →   ABB₁A₁ = ▭` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Тридцать. Три умножить на десять. | O'ttiz. Uch karra o'n. | Thirty. Three times ten. |
| `task.hint.1` | Считай тремя группами: низ, верх и бок. | Uch guruh bilan sanang: past, tepa va yon. | Count in three groups: bottom, top and side. |
| `task.hint.2` | В каждой группе по десять. | Har guruhda o'ntadan. | Ten in each group. |
| `task.hint.3` | Три умножить на десять. | Uch karra o'n. | Three times ten. |
| `order.prompt` | Расставь записи в том порядке, в каком строится призма | Yozuvlarni prizma qurilish tartibida joylashtiring | Arrange the readings in the order a prism is built |
| `order.title` | Порядок построения | Qurish tartibi | The order of construction |
| `order.ok` | Порядок верный. Сначала основание, потом второе, потом боковое ребро и грань. | Tartib to'g'ri. Avval asos, keyin ikkinchisi, keyin yon qirra va yoq. | The order is right. First the base, then the second one, then the lateral edge and face. |
| `order.bad` | Не в этом порядке. Что появляется раньше. | Bu tartibda emas. Nima avval paydo bo'ladi. | Not in this order. What appears first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как строится призма. | Endi yozuvlar tartibi. Prizma qanday qurilsa, shunday joylashtiring. | Now the order of the readings. Arrange them the way a prism is built. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `n = 10,   3n = ?` |
| `task.answer` | `30` |
| `order.items` | `ABB₁A₁` · `ABC` · `A₁B₁C₁` · `AA₁` |
| `order.answer` | `ABC  A₁B₁C₁  AA₁  ABB₁A₁` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Условие переписано верно. | Shart to'g'ri ko'chirilgan. | The condition is copied correctly. |
| `hint.r2` | Боковые грани прямой призмы действительно прямоугольники. | To'g'ri prizmaning yon yoqlari haqiqatan to'g'ri to'rtburchak. | The lateral faces of a right prism really are rectangles. |
| `hint.r4` | Вывод получен из неверной строки выше. | Xulosa yuqoridagi xato qatordan olingan. | The conclusion comes from the wrong line above. |
| `proof` | Поверни призму: основание правильным не стало, а прямой она была с самого начала. | Prizmani buring: asos muntazam bo'lmadi, to'g'ri esa u boshidan edi. | Rotate the prism: the base did not become regular, while right it was from the start. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Прямая призма и правильная это разные условия. | Uchinchi. To'g'ri prizma va muntazam prizma boshqa-boshqa shart. | The third. A right prism and a regular prism are different conditions. |
| `entry.hint.1` | Проверь, что в каждой строке сказано про основание. | Har qatorda asos haqida nima aytilganini tekshiring. | Check what each line says about the base. |
| `entry.hint.2` | Правильная призма требует правильного основания, а не только прямых рёбер. | Muntazam prizma faqat to'g'ri qirra emas, muntazam asos ham talab qiladi. | A regular prism needs a regular base, not just perpendicular edges. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них подменяет условие. | To'rt qator, va ulardan biri shartni almashtiradi. | Four lines, and one of them substitutes the condition. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `AA₁ ⊥ ABCD` |
| `row.r2` | `ABB₁A₁ = ▭` |
| `row.r3` | `AB = BC = CD = DA` |
| `row.r4` | `P = 4·AB` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | У призмы двадцать одно ребро. Сколько сторон у её основания? | Prizmaning yigirma bir qirrasi bor. Asosining nechta tomoni bor? | A prism has twenty one edges. How many sides does its base have? |
| `place.ok` | Семь. Рёбер три n, значит n это двадцать один делить на три. | Yetti. Qirralar uch n, demak n yigirma birni uchga bo'lgani. | Seven. The edges are three n, so n is twenty one divided by three. |
| `place.wrong` | Вспомни, сколько групп рёбер у призмы. | Prizmada qirralar nechta guruh ekanini eslang. | Recall how many groups of edges a prism has. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для любой призмы | Har qanday prizma uchun nima to'g'ri | What is true for any prism |
| `multi.d.hint` | Это верно только у прямой призмы. | Bu faqat to'g'ri prizmada to'g'ri. | That is true only for a right prism. |
| `multi.e.hint` | Граней n плюс два, а не два n. | Yoqlar n qo'shuv ikki, ikki n emas. | The faces are n plus two, not two n. |
| `multi.ok` | Три записи из пяти. Две оставшиеся верны не для любой призмы. | Beshtadan uch yozuv. Qolgan ikkitasi har qanday prizmada to'g'ri emas. | Three readings out of five. The other two are not true for every prism. |
| `audio.mount` | Прочитаем правило справа налево. По числу рёбер назовём основание. | Qoidani o'ngdan chapga o'qiymiz. Qirralar soni bo'yicha asosni aytamiz. | Let us read the rule from right to left. From the number of edges we name the base. |
| `audio.work` | Отметь все записи, которые верны для любой призмы. Их больше одной. | Har qanday prizma uchun to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are true for any prism. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `7` |
| `place.step` | `3n = 21` |
| `multi.a` [верно] | `3n` |
| `multi.b` [верно] | `2n` |
| `multi.c` [верно] | `n + 2` |
| `multi.d` | `ABB₁A₁ = ▭` |
| `multi.e` | `2n = n + 2` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `gran-ne-storona`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Сколько граней сходится в ребре? | Qirrada nechta yoq tutashadi? | How many faces meet at an edge? |
| `q1.a` [верно] | две | ikkita | two |
| `q1.b` | одна | bitta | one |
| `q1.b.hint` | Одна грань дала бы не ребро, а просто сторону. | Bitta yoq qirra emas, shunchaki tomon berardi. | One face would give not an edge but just a side. |
| `q1.c` | три | uchta | three |
| `q1.c.hint` | Три грани сходятся в вершине, а не в ребре. | Uch yoq uchda tutashadi, qirrada emas. | Three faces meet at a vertex, not at an edge. |
| `q1.d` | зависит от призмы | prizmaga bog'liq | it depends on the prism |
| `q1.d.hint` | Это верно у любого многогранника. | Bu har qanday ko'pyoqda to'g'ri. | This is true for any polyhedron. |
| `q2.prompt` | Что такое основания призмы? | Prizmaning asoslari nima? | What are the bases of a prism? |
| `q2.a` [верно] | две равные грани | ikki teng yoq | two equal faces |
| `q2.b` | две нижние грани | ikki pastdagi yoq | the two lower faces |
| `q2.b.hint` | Низ и верх зависят от чертежа, а основания нет. | Past va tepa chizmaga bog'liq, asoslar esa yo'q. | Bottom and top depend on the drawing, the bases do not. |
| `q2.c` | все параллелограммы | barcha parallelogrammlar | all the parallelograms |
| `q2.c.hint` | Параллелограммы это боковые грани. | Parallelogrammlar yon yoqlar. | The parallelograms are the lateral faces. |
| `q2.d` | самая большая грань | eng katta yoq | the biggest face |
| `q2.d.hint` | Размер тут ничего не решает. | O'lcham bu yerda hech narsani hal qilmaydi. | Size decides nothing here. |
| `q3.prompt` | Сколько вершин у пятиугольной призмы? | Beshburchakli prizmaning nechta uchi bor? | How many vertices does a pentagonal prism have? |
| `q3.a` [верно] | десять | o'nta | ten |
| `q3.b` | пять | beshta | five |
| `q3.b.hint` | Пять только в одном основании. | Beshta faqat bitta asosda. | Five is only in one base. |
| `q3.c` | пятнадцать | o'n beshta | fifteen |
| `q3.c.hint` | Пятнадцать это число рёбер. | O'n besh qirralar soni. | Fifteen is the number of edges. |
| `q3.d` | семь | yettita | seven |
| `q3.d.hint` | Семь это число граней. | Yetti yoqlar soni. | Seven is the number of faces. |
| `q4.prompt` | Когда призма прямая? | Prizma qachon to'g'ri? | When is a prism right? |
| `q4.a` [верно] | боковое ребро перпендикулярно основанию | yon qirra asosga perpendikulyar | the lateral edge is perpendicular to the base |
| `q4.b` | основание правильное | asos muntazam | the base is regular |
| `q4.b.hint` | Это условие правильной призмы. | Bu muntazam prizmaning sharti. | That is the condition of a regular prism. |
| `q4.c` | все грани равны | barcha yoqlar teng | all faces are equal |
| `q4.c.hint` | Такого не бывает даже у куба со стороной основания больше высоты. | Bunday hol asos tomoni balandlikdan katta kubda ham bo'lmaydi. | That does not happen even for a box whose base side differs from its height. |
| `q4.d` | стоит на основании | asosda turadi | it stands on its base |
| `q4.d.hint` | Как стоит на чертеже, к делу не относится. | Chizmada qanday turgani ishga aloqasi yo'q. | How it stands on the drawing is irrelevant. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `2` |
| `q2.done` | `ABC = A₁B₁C₁` |
| `q3.done` | `2n = 10` |
| `q4.done` | `AA₁ ⊥ ABCD` |
| `angles` | `ABC` · `ABB₁A₁` · `AA₁` · `AB` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Различаю грань, ребро и вершину | Yoq, qirra va uchni ajrataman | I tell a face, an edge and a vertex apart |
| `can.2` | Знаю, что ребро принадлежит двум граням | Qirra ikki yoqqa tegishli ekanini bilaman | I know an edge belongs to two faces |
| `can.3` | Считаю рёбра, вершины и грани по числу сторон основания | Qirra, uch va yoqlarni asos tomonlari soni bo'yicha sanayman | I count edges, vertices and faces by the number of base sides |
| `can.4` | Отличаю прямую призму от наклонной | To'g'ri prizmani og'madan ajrataman | I tell a right prism from a slanted one |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше параллелепипед — призма, у которой и основание параллелограмм | Bundan keyin parallelepiped, asosi ham parallelogramm bo'lgan prizma | Next comes the parallelepiped, a prism whose base is a parallelogram too |
| `lifehack` | Считаешь рёбра — считай тремя группами, не подряд | Qirralarni sanayotgan bo'lsangiz, ketma-ket emas, uch guruh bilan sanang | Counting edges, count in three groups rather than one by one |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страницы сорок четыре и сорок пять | Geometriya, qirq to'rtinchi va qirq beshinchi betlar | Geometry, pages forty four and forty five |
| `audio.mount` | Урок начался с вопроса, сколько рёбер у треугольной призмы. | Dars uchburchakli prizmaning nechta qirrasi bor degan savol bilan boshlandi. | The lesson began with the question how many edges a triangular prism has. |
| `audio.next` | Шесть получается, если считать только основания и забыть боковые рёбра. Правильный ответ девять, и он выводится не из чертежа, а из правила. У призмы с n сторонами в основании рёбер три n, вершин два n, граней n плюс два. Дальше мы возьмём призму, у которой и основание параллелограмм, и посмотрим, что нового это даёт. | Olti faqat asoslarni sanab, yon qirralarni esdan chiqarganda chiqadi. To'g'ri javob to'qqiz, va u chizmadan emas, qoidadan kelib chiqadi. Asosida n tomoni bo'lgan prizmada qirralar uch n, uchlar ikki n, yoqlar n qo'shuv ikki. Keyin asosi ham parallelogramm bo'lgan prizmani olamiz va bu nima yangilik berishini ko'ramiz. | Six comes out if you count only the bases and forget the lateral edges. The right answer is nine, and it follows from the rule rather than from the drawing. In a prism with n sides in the base there are three n edges, two n vertices and n plus two faces. Next we will take a prism whose base is a parallelogram too and see what that adds. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `6` |
| `hook.b` | `9` |
| `proved` | `3n = 9` |
| `law` | `3n,   2n,   n + 2` |
| `sheet.1` | `ABC = A₁B₁C₁` |
| `sheet.2` | `ABB₁A₁ = ▱` |
| `sheet.3` | `3n` |
| `sheet.4` | `2n` |
| `sheet.5` | `n + 2` |
