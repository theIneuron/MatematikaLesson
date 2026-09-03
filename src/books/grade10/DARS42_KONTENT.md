# Урок 49 — Построение сечений многогранников · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS48_KONTENT.md`.

Скелет: в переписке 2026-08-21. Опора: учебник геометрии 2022, §8 стр. 64–69. Определение
сечения — стр. 64 дословно: «сечением многогранника называется геометрическая фигура из точек
многогранника, принадлежащих секущей плоскости». Правила метода следов — стр. 68 дословно:
вершины сечения лежат только на рёбрах; стороны сечения лежат только в гранях; если секущая
плоскость и грань пересекаются, линия их пересечения — единственная прямая. Метод параллельного
переноса — стр. 68, задача 5. Граница «число сторон сечения не больше числа граней» — стр. 64,
там же вопрос «почему восьмиугольник невозможен» для пятиугольной призмы.

**Главное решение урока.** Ошибка года из эталона: «сечение», вершины которого не в одной
плоскости. Ученик отмечает точки и соединяет их в многоугольник, не проверяя ни принадлежность
одной грани, ни компланарность. Свидетель эталона — поворот разваливает многоугольник.

**Вся геометрия урока посчитана, а не нарисована на глаз.** Куб `ABCDA₁B₁C₁D₁`, точки
`M` — середина `A₁B₁`, `N` — середина `B₁C₁`, `K` на `DD₁` на четверти от `D`. Секущая плоскость
режет ровно пять рёбер, и два оставшихся пересечения приходятся на `AA₁` и `CC₁` на три четверти
от `A` и от `C`. Сечение `KPMNH` — пятиугольник, отклонение всех пяти точек от одной плоскости
равно нулю, пар параллельных сторон ровно две. Обманка экрана 3: четвёртая точка `G` берётся на
ребре `AB`, которого секущая плоскость не касается вовсе; её отклонение от плоскости `MNK` — семь
десятых ребра, и при начальном ракурсе это невидимо. Ракурс и шаг поворота подобраны счётом:
четырёхугольник `MNGK` цел при повороте ноль целых семь десятых и пересекает сам себя при
повороте на одну целую две десятых в ЛЮБУЮ сторону, причём ни одно из трёх положений не
вырождает куб в плоскую картинку. Пирамида экрана 5: `K` — середина `AB`,
`L` на `AS` на восьми десятых, `M` на `CS` на пятидесяти пяти сотых; при этих долях точка `X`
попадает на продолжение `AC` в одной целой сорока четырёх сотых от `A`, то есть за `C` и внутри
кадра, точка `N` — на ребре `BC` в семидесяти семи сотых, а ни одна пара подписей на чертеже не
ближе шестнадцати сотых. Наибольшие сечения экрана 7 тоже посчитаны: у куба это правильный
шестиугольник через середины шести рёбер, у правильной пятиугольной призмы — семиугольник,
и азимут наклона плоскости выбран так, чтобы при камере класса она не встала к нам ребром.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины `kesim`,
`kesuvchi tekislik`, `iz`, `izlar usuli`, `parallel ko'chirish usuli` взяты из учебника, стр. 64–68.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | СЕЧЕНИЕ | KESIM | THE SECTION |
| `title` | Три точки, сколько сторон | Uch nuqta, nechta tomon | Three points, how many sides |
| `row.a.name` | треугольник | uchburchak | a triangle |
| `row.b.name` | пятиугольник | beshburchak | a pentagon |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас построим сечение. | Javobingiz yozib olindi. Endi kesimni yasaymiz. | Your answer is recorded. Now we build the section. |
| `audio.mount` | Куб, и на трёх его рёбрах отмечены точки. Через них проходит секущая плоскость. | Kub, va uning uch qirrasida nuqtalar belgilangan. Ular orqali kesuvchi tekislik o'tadi. | A cube, and points are marked on three of its edges. A cutting plane passes through them. |
| `audio.r1` | Первая запись говорит, что сторон три: точки соединили между собой и получили треугольник. | Birinchi yozuv tomonlar uchta deydi: nuqtalar bir biriga ulanib uchburchak chiqdi. | The first reading says there are three sides: the points were joined to each other and a triangle came out. |
| `audio.r2` | Вторая говорит, что сторон пять. | Ikkinchisi tomonlar beshta deydi. | The second says there are five sides. |
| `audio.ask` | Точек три, значит и сторон три, так кажется. Как думаешь, какая запись верная? | Nuqta uchta, demak tomon ham uchta, shunday ko'rinadi. Sizningcha qaysi yozuv to'g'ri? | There are three points, so three sides, it seems. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCDA₁B₁C₁D₁` |
| `row.a.value` | `3` |
| `row.b.value` | `5` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из блока | Blokdan uch savol | Three questions from the block |
| `q1.prompt` | Что такое сечение тела? | Jismning kesimi nima? | What is a section of a body? |
| `q1.a` [верно] | фигура из точек тела, лежащих в секущей плоскости | kesuvchi tekislikda yotgan jism nuqtalaridan iborat shakl | the figure of the points of the body lying in the cutting plane |
| `q1.b` | плоскость, которая режет тело | jismni kesadigan tekislik | the plane that cuts the body |
| `q1.b.hint` | Плоскость режет, а сечение это то, что получилось. | Tekislik kesadi, kesim esa chiqqan narsa. | The plane cuts, and the section is what came out. |
| `q1.c` | линия пересечения двух граней | ikki yoqning kesishish chizig'i | the line where two faces meet |
| `q1.c.hint` | Линия пересечения двух граней это ребро. | Ikki yoqning kesishish chizig'i qirra. | The line where two faces meet is an edge. |
| `q1.d` | площадь разреза | kesim yuzasi | the area of the cut |
| `q1.d.hint` | Площадь считают после того, как фигура найдена. | Yuza shakl topilgandan keyin hisoblanadi. | The area is computed after the figure is found. |
| `q2.prompt` | Где лежат вершины сечения? | Kesim uchlari qayerda yotadi? | Where do the vertices of a section lie? |
| `q2.a` [верно] | только на рёбрах | faqat qirralarda | only on the edges |
| `q2.b` | внутри граней | yoqlarning ichida | inside the faces |
| `q2.b.hint` | Внутри грани лежат стороны, а не вершины. | Yoq ichida tomonlar yotadi, uchlar emas. | The sides lie inside a face, not the vertices. |
| `q2.c` | в вершинах тела | jism uchlarida | at the vertices of the body |
| `q2.c.hint` | Иногда совпадают, но по правилу не обязаны. | Ba'zan mos tushadi, lekin qoida bo'yicha shart emas. | Sometimes they coincide, but the rule does not require it. |
| `q2.d` | в любом месте секущей плоскости | kesuvchi tekislikning har qanday joyida | anywhere in the cutting plane |
| `q2.d.hint` | Точка вне тела в сечение не входит. | Jismdan tashqaridagi nuqta kesimga kirmaydi. | A point outside the body is not in the section. |
| `q3.prompt` | Сколько граней у куба? | Kubning nechta yog'i bor? | How many faces does a cube have? |
| `q3.a` [верно] | шесть | oltita | six |
| `q3.b` | восемь | sakkizta | eight |
| `q3.b.hint` | Восемь это число вершин. | Sakkiz uchlar soni. | Eight is the number of vertices. |
| `q3.c` | двенадцать | o'n ikkita | twelve |
| `q3.c.hint` | Двенадцать это число рёбер. | O'n ikki qirralar soni. | Twelve is the number of edges. |
| `q3.d` | четыре | to'rtta | four |
| `q3.d.hint` | Четыре грани у треугольной пирамиды. | To'rt yoq uchburchakli piramidada. | Four faces belong to a triangular pyramid. |
| `audio.mount` | Три вопроса. Правило урока соберётся из первых двух. | Uchta savol. Darsning qoidasi birinchi ikkitasidan yig'iladi. | Three questions. The rule of the lesson will be assembled from the first two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `KPMNH` |
| `q2.done` | `M ∈ A₁B₁` |
| `q3.done` | `6` |

---

## Экран 3 · `explain1` · ответ `number` · тег `secheniye-ne-ploskoe`

Свидетель урока: четвёртая точка не свободна.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Четвёртая точка не свободна | To'rtinchi nuqta erkin emas | The fourth point is not free |
| `show.1.1` | четыре точки на рёбрах | qirralarda to'rt nuqta | four points on the edges |
| `show.1.2` | и всё выглядит плоским | va hammasi yassi ko'rinadi | and everything looks flat |
| `show.2.1` | один поворот | bitta burilish | one turn |
| `show.2.2` | и четырёхугольник сломался | va to'rtburchak buzildi | and the quadrilateral broke |
| `audio.mount` | На трёх рёбрах точки, и к ним добавлена четвёртая. Соединим все четыре по кругу. | Uch qirrada nuqtalar, va ularga to'rtinchisi qo'shildi. To'rttasini aylana bo'ylab ulaymiz. | There are points on three edges, and a fourth is added to them. Let us join all four in a cycle. |
| `audio.move*` | С этого ракурса четырёхугольник выглядит совершенно обычным, плоским. Поворачиваю сцену в любую сторону, и он пересекает сам себя. Так плоская фигура вести себя не может, значит фигура не плоская. Причина простая и она из первого блока: плоскость задают три точки. Первые три точки её уже задали, а дальше выбор кончился: плоскость сама решает, какие рёбра она режет. Четвёртая точка взята на ребре, которого эта плоскость вообще не касается, и от плоскости она отстоит на семь десятых ребра. На первом ракурсе такая ошибка не видна совсем. | Bu rakursdan to'rtburchak butunlay oddiy, yassi ko'rinadi. Sahnani ixtiyoriy tomonga buraman, va u o'zini o'zi kesadi. Yassi shakl bunday tutolmaydi, demak shakl yassi emas. Sabab oddiy va u birinchi blokdan: tekislikni uch nuqta aniqlaydi. Birinchi uch nuqta uni allaqachon aniqlagan, keyin esa tanlov tugadi: qaysi qirralarni kesishini tekislikning o'zi hal qiladi. To'rtinchi nuqta bu tekislik umuman tegmaydigan qirrada olingan, va tekislikdan u qirraning yetti o'ndan qismi masofada turadi. Birinchi rakursda bunday xato umuman ko'rinmaydi. | From this view the quadrilateral looks perfectly ordinary and flat. I rotate the scene either way and it crosses itself. A flat figure cannot behave like that, so the figure is not flat. The reason is simple and it comes from the first block: three points determine a plane. The first three points have already determined it, and after that the choosing is over: the plane itself decides which edges it cuts. The fourth point is taken on an edge that this plane does not touch at all, and it stands seven tenths of an edge away from the plane. At the first view such an error cannot be seen at all. |
| `audio.work` | Посчитай сам. Сколько точек задают плоскость? | O'zingiz hisoblang. Nechta nuqta tekislikni aniqlaydi? | Work it out yourself. How many points determine a plane? |
| `work.prompt` | Сколько точек задают плоскость? | Nechta nuqta tekislikni aniqlaydi? | How many points determine a plane? |
| `work.ok` | Три. Четвёртая уже вычисляется, а не выбирается. | Uchta. To'rtinchisi tanlanmaydi, hisoblanadi. | Three. The fourth one is computed, not chosen. |
| `work.hint.1` | Вспомни первый блок про плоскость. | Tekislik haqidagi birinchi blokni eslang. | Recall the first block about the plane. |
| `work.hint.2` | Двух точек мало, они дают прямую. | Ikki nuqta kam, ular to'g'ri chiziq beradi. | Two points are not enough, they give a line. |
| `work.hint.3` | Три. | Uchta. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `MNGK` |
| `work.answer` | `3` |

---

## Экран 4 · `explain2` · ответ `number` · тег `gran-ne-storona`

Сторона сечения лежит в грани.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Сторона лежит в грани | Tomon yoqda yotadi | A side lies in a face |
| `show.1.1` | точки M и N на рёбрах верхней грани | M va N nuqtalari ustki yoqning qirralarida | the points M and N are on the edges of the top face |
| `show.1.2` | отрезок между ними лежит в ней | ular orasidagi kesma unda yotadi | the segment between them lies in it |
| `show.2.1` | у M и K общей грани нет | M va K da umumiy yoq yo'q | M and K have no common face |
| `show.2.2` | отрезок пошёл сквозь тело | kesma jism ichidan o'tdi | the segment went through the body |
| `audio.mount` | Верхняя грань закрашена. Обе точки, M и N, лежат на её рёбрах. | Ustki yoq bo'yalgan. Ikki nuqta ham, M va N, uning qirralarida yotadi. | The top face is filled. Both points, M and N, lie on its edges. |
| `audio.move*` | Отрезок между ними целиком в закрашенной грани, и поворот его оттуда не выпускает. Это и есть сторона сечения: секущая плоскость встречается с гранью по прямой, и внутри грани от этой прямой остаётся отрезок. Теперь попробую соединить M и K. Ищу грань, в которой лежат обе. Точка M лежит в верхней грани и в передней, точка K в левой и в задней. Общей грани нет ни одной, и отрезок уходит внутрь тела. Стороной сечения он быть не может, потому что сечение состоит из точек поверхности, а не из точек внутри. | Ular orasidagi kesma butunlay bo'yalgan yoqda, va burilish uni undan chiqarmaydi. Bu kesimning tomoni: kesuvchi tekislik yoq bilan to'g'ri chiziq bo'ylab uchrashadi, va yoq ichida shu chiziqdan kesma qoladi. Endi M va K ni ulashga harakat qilaman. Ikkisi yotgan yoqni qidiraman. M nuqta ustki va oldingi yoqda yotadi, K nuqta chap va orqa yoqda. Umumiy yoq bitta ham yo'q, va kesma jism ichiga ketadi. U kesimning tomoni bo'lolmaydi, chunki kesim sirt nuqtalaridan iborat, ichki nuqtalardan emas. | The segment between them lies entirely in the filled face, and rotation never lets it out. That is what a side of a section is: the cutting plane meets a face along a line, and inside the face a segment of that line remains. Now let me try to join M and K. I look for a face in which both of them lie. The point M lies in the top face and in the front one, the point K in the left and in the back one. There is no common face at all, and the segment goes inside the body. It cannot be a side of the section, because a section consists of points of the surface, not of points inside. |
| `audio.work` | Посчитай сам. Сколько сторон можно провести сразу по трём отмеченным точкам? | O'zingiz hisoblang. Uch belgilangan nuqta bo'yicha darrov nechta tomon o'tkazish mumkin? | Work it out yourself. How many sides can be drawn straight away through the three marked points? |
| `work.prompt` | Сколько сторон сразу? | Darrov nechta tomon? | How many sides straight away? |
| `work.ok` | Одна. Общая грань есть только у M и N. | Bitta. Umumiy yoq faqat M va N da bor. | One. Only M and N have a common face. |
| `work.hint.1` | Проверь все три пары точек. | Uch juft nuqtani tekshiring. | Check all three pairs of points. |
| `work.hint.2` | Для каждой пары ищи грань, где лежат обе. | Har juft uchun ikkisi yotgan yoqni qidiring. | For each pair look for a face where both lie. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `MN ⊂ A₁B₁C₁D₁` |
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `secheniye-ne-ploskoe`

Метод следов: выход за тело даёт точку на ребре.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | След выводит за тело | Iz jismdan tashqariga olib chiqadi | The trace leads outside the body |
| `show.1.1` | K и L в одной грани, это сторона | K va L bir yoqda, bu tomon | K and L are in one face, this is a side |
| `show.1.2` | L и M в другой, это вторая | L va M boshqasida, bu ikkinchisi | L and M are in another, this is the second |
| `show.2.1` | продлили LM и AC до точки X | LM va AC ni X nuqtaga qadar davom ettirdik | LM and AC were extended to the point X |
| `show.2.2` | прямая KX дала точку N на ребре | KX to'g'ri chizig'i qirrada N nuqtani berdi | the line KX gave the point N on an edge |
| `audio.mount` | Пирамида, и на трёх её рёбрах отмечены точки K, L и M. Две стороны находятся сразу. | Piramida, va uning uch qirrasida K, L va M nuqtalari belgilangan. Ikki tomon darrov topiladi. | A pyramid, and points K, L and M are marked on three of its edges. Two sides are found straight away. |
| `audio.move*` | Дальше пары с общей гранью кончились, и метод следов делает шаг за тело. Точки L и M лежат в одной боковой грани, а эта грань бесконечно продолжается плоскостью. Продлеваю прямую через L и M, продлеваю сторону основания, и они встречаются в точке X. Эта точка принадлежит и секущей плоскости, и плоскости основания сразу. Значит через неё проходит след, то есть линия пересечения секущей плоскости с плоскостью основания. Точка K тоже лежит в основании, поэтому след это прямая через K и X. Там, где она пересекает ребро основания, стоит четвёртая вершина сечения. | Keyin umumiy yoqli juftlar tugadi, va izlar usuli jismdan tashqariga qadam tashlaydi. L va M nuqtalari bir yon yoqda yotadi, va bu yoq tekislik bilan cheksiz davom etadi. L va M orqali to'g'ri chiziqni davom ettiraman, asos tomonini davom ettiraman, va ular X nuqtada uchrashadi. Bu nuqta kesuvchi tekislikka ham, asos tekisligiga ham tegishli. Demak u orqali iz o'tadi, ya'ni kesuvchi tekislikning asos tekisligi bilan kesishish chizig'i. K nuqta ham asosda yotadi, shuning uchun iz K va X orqali o'tgan to'g'ri chiziq. U asos qirrasini kesgan joyda kesimning to'rtinchi uchi turadi. | Then the pairs with a common face ran out, and the trace method takes a step outside the body. The points L and M lie in one lateral face, and that face continues without end as a plane. I extend the line through L and M, I extend the side of the base, and they meet at the point X. This point belongs both to the cutting plane and to the plane of the base. So the trace passes through it, that is the line where the cutting plane meets the plane of the base. The point K lies in the base too, so the trace is the line through K and X. Where it crosses an edge of the base stands the fourth vertex of the section. |
| `audio.work` | Посчитай сам. Сколько сторон у полученного сечения? | O'zingiz hisoblang. Chiqqan kesimning nechta tomoni bor? | Work it out yourself. How many sides does the section we got have? |
| `work.prompt` | Сколько сторон у сечения? | Kesimning nechta tomoni? | How many sides does the section have? |
| `work.ok` | Четыре. Каждая сторона в своей грани, и грани все четыре. | To'rtta. Har tomon o'z yog'ida, va yoqlar to'rttasi ham. | Four. Each side in its own face, and all four faces are used. |
| `work.hint.1` | Посчитай вершины: их столько же, сколько сторон. | Uchlarni sanang: ular tomonlar soniga teng. | Count the vertices: there are as many as sides. |
| `work.hint.2` | Точка X вершиной не является, она вне тела. | X nuqta uch emas, u jismdan tashqarida. | The point X is not a vertex, it is outside the body. |
| `work.hint.3` | Четыре. | To'rtta. | Four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `X = LM ∩ AC` |
| `work.answer` | `4` |

---

## Экран 6 · `explain4` · ответ `number` · тег `secheniye-ne-ploskoe`

Параллельные грани дают параллельные стороны.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Параллельные грани, параллельные стороны | Parallel yoqlar, parallel tomonlar | Parallel faces, parallel sides |
| `show.1.1` | пятиугольник, пять сторон в пяти гранях | beshburchak, besh yoqda besh tomon | a pentagon, five sides in five faces |
| `show.1.2` | передняя и задняя грани параллельны | oldingi va orqa yoqlar parallel | the front and back faces are parallel |
| `show.2.1` | значит и стороны в них параллельны | demak ulardagi tomonlar ham parallel | so the sides in them are parallel too |
| `show.2.2` | вторая пара работает так же | ikkinchi juft ham shunday ishlaydi | the second pair works the same way |
| `audio.mount` | Вот то самое сечение из начала урока. Сторон в нём пять, и каждая лежит в своей грани. | Mana darsning boshidagi o'sha kesim. Unda tomonlar beshta, va har biri o'z yog'ida yotadi. | Here is that very section from the start of the lesson. It has five sides, and each lies in its own face. |
| `audio.move*` | Передняя и задняя грани куба параллельны, а секущая плоскость одна. Плоскость режет две параллельные плоскости по параллельным прямым, это теорема из блока про параллельность. Значит сторона в передней грани параллельна стороне в задней, и проверять тут нечего, это следствие. Вторая пара граней даёт вторую пару сторон. Отсюда второй способ построения, он в учебнике называется методом параллельного переноса: если сторона в одной грани уже есть, в параллельной грани её направление известно заранее. Пятая сторона осталась без пары, потому что нижнее основание плоскость не задела. | Kubning oldingi va orqa yoqlari parallel, kesuvchi tekislik esa bitta. Tekislik ikki parallel tekislikni parallel to'g'ri chiziqlar bo'ylab kesadi, bu parallellik blokidagi teorema. Demak oldingi yoqdagi tomon orqa yoqdagi tomonga parallel, va bu yerda tekshirishga hech narsa yo'q, bu natija. Ikkinchi yoqlar jufti ikkinchi tomonlar juftini beradi. Shundan ikkinchi yasash usuli, u darslikda parallel ko'chirish usuli deb ataladi: agar bir yoqda tomon allaqachon bo'lsa, parallel yoqda uning yo'nalishi oldindan ma'lum. Beshinchi tomon juftsiz qoldi, chunki tekislik pastki asosga tegmadi. | The front and the back faces of the cube are parallel, and the cutting plane is one. A plane cuts two parallel planes along parallel lines, that is a theorem from the block on parallelism. So the side in the front face is parallel to the side in the back one, and there is nothing to check here, it is a consequence. The second pair of faces gives the second pair of sides. Hence the second way of building, called in the textbook the method of parallel transfer: if a side in one face is already there, in the parallel face its direction is known in advance. The fifth side was left without a pair, because the plane did not touch the lower base. |
| `audio.work` | Посчитай сам. Сколько пар параллельных сторон в этом пятиугольнике? | O'zingiz hisoblang. Bu beshburchakda nechta juft parallel tomon bor? | Work it out yourself. How many pairs of parallel sides are in this pentagon? |
| `work.prompt` | Сколько пар параллельных сторон? | Nechta juft parallel tomon? | How many pairs of parallel sides? |
| `work.ok` | Две. Столько же, сколько пар параллельных граней задето. | Ikkita. Tegilgan parallel yoq juftlari soni qancha bo'lsa, shuncha. | Two. As many as the pairs of parallel faces the plane touched. |
| `work.hint.1` | Считай пары параллельных граней, которые плоскость задела. | Tekislik tegilgan parallel yoq juftlarini sanang. | Count the pairs of parallel faces that the plane touched. |
| `work.hint.2` | Основания не задеты, там пары нет. | Asoslarga tegilmagan, u yerda juft yo'q. | The bases are not touched, there is no pair there. |
| `work.hint.3` | Две. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `PM ∥ KH` |
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `secheniye-ne-ploskoe`

ГРАНИЦА: сторон не больше, чем граней.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE CASE |
| `title` | Больше, чем граней, не бывает | Yoqlardan ko'p bo'lmaydi | There cannot be more than faces |
| `show.1.1` | у куба граней шесть | kubda yoqlar oltita | a cube has six faces |
| `show.1.2` | и наибольшее сечение шестиугольник | va eng katta kesim oltiburchak | and the largest section is a hexagon |
| `show.2.1` | у пятиугольной призмы граней семь | beshburchakli prizmada yoqlar yettita | a pentagonal prism has seven faces |
| `show.2.2` | и сечение бывает семиугольником | va kesim yettiburchak bo'ladi | and the section can be a heptagon |
| `audio.mount` | У куба шесть граней, и вот сечение через середины шести рёбер. Сторон в нём шесть. | Kubda olti yoq, va mana olti qirraning o'rtalari orqali kesim. Unda tomonlar oltita. | A cube has six faces, and here is the section through the midpoints of six edges. It has six sides. |
| `audio.move*` | Больше шести у куба не получится ни при каком наклоне плоскости, и причина не в переборе. Каждая сторона сечения лежит в своей грани, а в одной грани секущая плоскость даёт только одну прямую. Значит сторон не больше, чем граней, и это готовая проверка ответа. У пятиугольной призмы граней семь: пять боковых и два основания. Плоскость можно наклонить так, чтобы она задела все семь, и тогда в сечении семиугольник. А восьмиугольника у неё нет, и искать его бессмысленно: восьмой грани просто нет. | Kubda oltidan ko'pi tekislikning hech qanday og'ishida chiqmaydi, va sabab sanab ko'rishda emas. Kesimning har tomoni o'z yog'ida yotadi, bitta yoqda esa kesuvchi tekislik faqat bitta to'g'ri chiziq beradi. Demak tomonlar yoqlardan ko'p emas, va bu javobning tayyor tekshiruvi. Beshburchakli prizmada yoqlar yettita: besh yon va ikki asos. Tekislikni yettitasiga ham tegadigan qilib og'dirish mumkin, va u holda kesimda yettiburchak. Sakkizburchak esa unda yo'q, va uni qidirish ma'nosizdir: sakkizinchi yoq shunchaki yo'q. | More than six will not come out of a cube at any tilt of the plane, and the reason is not a search through cases. Every side of a section lies in its own face, and in one face the cutting plane gives only one line. So there are no more sides than faces, and that is a ready check of an answer. A pentagonal prism has seven faces: five lateral and two bases. The plane can be tilted so that it touches all seven, and then the section is a heptagon. But it has no octagon, and looking for one is pointless: there simply is no eighth face. |
| `audio.work` | Посчитай сам. Сколько сторон самое большее у сечения пятиугольной призмы? | O'zingiz hisoblang. Beshburchakli prizma kesimida eng ko'pi bilan nechta tomon bo'ladi? | Work it out yourself. What is the largest number of sides for a section of a pentagonal prism? |
| `work.prompt` | Сколько сторон самое большее? | Eng ko'pi bilan nechta tomon? | The largest number of sides? |
| `work.ok` | Семь. Столько же, сколько граней. | Yettita. Yoqlar soni qancha bo'lsa, shuncha. | Seven. As many as there are faces. |
| `work.hint.1` | Посчитай грани: боковые и основания. | Yoqlarni sanang: yon yoqlar va asoslar. | Count the faces: the lateral ones and the bases. |
| `work.hint.2` | Пять боковых и два основания. | Besh yon va ikki asos. | Five lateral and two bases. |
| `work.hint.3` | Семь. | Yettita. | Seven. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCDEA₁B₁C₁D₁E₁` |
| `work.answer` | `7` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `gran-ne-storona`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Правила метода следов | Izlar usulining qoidalari | The rules of the trace method |
| `probe.question` | Когда две отмеченные точки можно соединить? | Ikki belgilangan nuqtani qachon ulash mumkin? | When may two marked points be joined? |
| `probe.a` [верно] | когда они лежат в одной грани | ular bir yoqda yotganda | when they lie in one face |
| `probe.b` | когда они рядом на чертеже | chizmada yonma-yon bo'lganda | when they are next to each other on the drawing |
| `probe.b.hint` | Соседство на чертеже зависит от ракурса, а не от тела. | Chizmadagi yonma-yonlik rakursga bog'liq, jismga emas. | Being next to each other on the drawing depends on the view, not on the body. |
| `rule.lawLabel` | Метод следов | Izlar usuli | The trace method |
| `rule.lines.1` | вершины сечения лежат только на рёбрах | kesim uchlari faqat qirralarda yotadi | the vertices of a section lie only on the edges |
| `rule.lines.2` | стороны сечения лежат только в гранях | kesim tomonlari faqat yoqlarda yotadi | the sides of a section lie only in the faces |
| `rule.lines.3` | плоскость и грань пересекаются по одной прямой | tekislik va yoq bitta to'g'ri chiziq bo'ylab kesishadi | a plane and a face meet along a single line |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Все три строки со страницы шестьдесят восемь, и все три про одно: сечение живёт на поверхности тела. Первая строка говорит, где брать вершины. Вторая говорит, что соединять можно не любые две. Третья запрещает вторую прямую в той же грани, и именно она делает построение однозначным. Из этих строк выходит и порядок работы: находим пары с общей гранью, проводим их стороны, а когда пары кончились, идём за тело через след и получаем новую точку на ребре. И там же лежит проверка: сторон не больше, чем граней. | Uchta satr ham oltmish sakkizinchi betdan, va uchtasi ham bir narsa haqida: kesim jism sirtida yashaydi. Birinchi satr uchlarni qayerdan olishni aytadi. Ikkinchisi har qanday ikkitasini ulash mumkin emasligini aytadi. Uchinchisi o'sha yoqda ikkinchi to'g'ri chiziqni taqiqlaydi, va aynan u yasashni yakkaqiymatli qiladi. Bu satrlardan ish tartibi ham chiqadi: umumiy yoqli juftlarni topamiz, ularning tomonlarini o'tkazamiz, juftlar tugagach esa iz orqali jismdan tashqariga chiqib qirrada yangi nuqta olamiz. Va shu yerda tekshiruv ham bor: tomonlar yoqlardan ko'p emas. | All three lines come from page sixty eight, and all three are about one thing: a section lives on the surface of the body. The first line says where to take the vertices. The second says that not any two may be joined. The third forbids a second line in the same face, and it is exactly what makes the construction unique. The order of work follows from these lines as well: we find the pairs with a common face, we draw their sides, and when the pairs run out we go outside the body through the trace and get a new point on an edge. And the check lives there too: no more sides than faces. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `MN ⊂ A₁B₁C₁D₁` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `secheniye-ne-ploskoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Наибольшее число сторон | Eng katta tomonlar soni | The largest number of sides |
| `match.prompt` | Соедини число с телом | Sonni jism bilan birlashtiring | Match the number with the body |
| `match.ok` | Все четыре на месте. Число сторон не больше числа граней. | To'rttasi ham joyida. Tomonlar soni yoqlar sonidan ko'p emas. | All four in place. The number of sides is not more than the number of faces. |
| `audio.mount` | Четыре числа и четыре тела. Соедини их по числу граней. | To'rt son va to'rt jism. Ularni yoqlar soni bo'yicha birlashtiring. | Four numbers and four bodies. Match them by the number of faces. |
| `match.a` | треугольная пирамида | uchburchakli piramida | triangular pyramid |
| `match.b` | четырёхугольная пирамида | to'rtburchakli piramida | quadrilateral pyramid |
| `match.c` | куб | kub | cube |
| `match.d` | пятиугольная призма | beshburchakli prizma | pentagonal prism |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `4` · `5` · `6` · `7` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `gran-ne-storona`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи, что MN сторона сечения | MN kesim tomoni ekanini isbotlang | Prove that MN is a side of the section |
| `proof.given` | M и N на рёбрах верхней грани | M va N ustki yoq qirralarida | M and N are on the edges of the top face |
| `proof.goal` | MN сторона сечения | MN kesimning tomoni | MN is a side of the section |
| `proof.r1` | обе точки лежат в секущей плоскости | ikki nuqta ham kesuvchi tekislikda yotadi | both points lie in the cutting plane |
| `proof.r2` | обе точки лежат в плоскости верхней грани | ikki nuqta ham ustki yoq tekisligida yotadi | both points lie in the plane of the top face |
| `proof.r3` | две плоскости пересекаются по прямой, и это MN | ikki tekislik to'g'ri chiziq bo'ylab kesishadi, va bu MN | two planes meet along a line, and that is MN |
| `proof.ok` | Доказано. Сторона это линия пересечения плоскости с гранью. | Isbotlandi. Tomon tekislikning yoq bilan kesishish chizig'i. | Proved. A side is the line where the plane meets a face. |
| `proof.e1` | Про грань дальше. Сначала про секущую плоскость. | Yoq haqida keyin. Avval kesuvchi tekislik haqida. | The face comes later. First about the cutting plane. |
| `proof.e2` | Плоскость разобрана. Теперь вторая плоскость. | Tekislik ko'rildi. Endi ikkinchi tekislik. | The plane is done. Now the second plane. |
| `proof.e3` | Обе плоскости названы. Теперь вывод. | Ikki tekislik ham aytildi. Endi xulosa. | Both planes are named. Now the conclusion. |
| `reason.s1` | точки взяты в секущей плоскости | nuqtalar kesuvchi tekislikda olingan | the points are taken in the cutting plane |
| `reason.s2` | оба ребра принадлежат верхней грани | ikki qirra ham ustki yoqqa tegishli | both edges belong to the top face |
| `reason.s3` | аксиома о пересечении двух плоскостей | ikki tekislikning kesishishi haqidagi aksioma | the axiom on the meeting of two planes |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `MN ⊂ A₁B₁C₁D₁` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок построения | Hisob va yasash tartibi | Counting and the order of building |
| `task.ok` | Пятьдесят. Диагональ основания десять, высота пять. | Ellik. Asos diagonali o'n, balandlik besh. | Fifty. The base diagonal is ten, the height is five. |
| `task.hint.1` | Сечение через два боковых ребра это прямоугольник. | Ikki yon qirra orqali kesim to'g'ri to'rtburchak. | A section through two lateral edges is a rectangle. |
| `task.hint.2` | Одна его сторона диагональ основания, шесть и восемь. | Uning bir tomoni asos diagonali, olti va sakkiz. | One of its sides is the base diagonal, six and eight. |
| `task.hint.3` | Десять умножить на пять. | O'nni beshga ko'paytiring. | Ten times five. |
| `order.prompt` | Расставь шаги метода следов в нужном порядке | Izlar usuli qadamlarini kerakli tartibda joylashtiring | Arrange the steps of the trace method in the right order |
| `order.title` | Порядок построения | Yasash tartibi | The order of building |
| `order.ok` | Порядок верный. Сначала сторона в грани, потом след, потом новая точка. | Tartib to'g'ri. Avval yoqdagi tomon, keyin iz, keyin yangi nuqta. | The order is right. First a side in a face, then the trace, then the new point. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как строят. | Endi qadamlar tartibi. Ularni qanday yasalsa, shunday joylashtiring. | Now the order of the steps. Arrange them the way the building goes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `a = 6,   b = 8,   h = 5,   S = ?` |
| `task.answer` | `50` |
| `order.items` | `N` · `KL` · `KX` · `X` |
| `order.answer` | `KL  X  KX  N` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Обе точки на рёбрах верхней грани, это верно. | Ikki nuqta ham ustki yoq qirralarida, bu to'g'ri. | Both points are on the edges of the top face, that is right. |
| `hint.r4` | Периметр посчитан по неверной строке выше. | Perimetr yuqoridagi xato qator bo'yicha hisoblangan. | The perimeter is computed from the wrong line above. |
| `proof` | Поверни куб: точка K лежит на дальнем боковом ребре, а эта грань его не содержит. | Kubni buring: K nuqta uzoq yon qirrada yotadi, bu yoq esa uni o'z ichiga olmaydi. | Rotate the cube: the point K lies on the far lateral edge, and this face does not contain it. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. У M и K общей грани нет. | Uchinchi. M va K da umumiy yoq yo'q. | The third. M and K have no common face. |
| `entry.hint.1` | Проверь каждую строку по правилу о грани. | Har qatorni yoq haqidagi qoida bo'yicha tekshiring. | Check each line against the rule about a face. |
| `entry.hint.2` | Ищи сторону, которая ушла в грань без одной из точек. | Nuqtalardan biri yo'q yoqqa ketgan tomonni qidiring. | Look for the side that went into a face without one of the points. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них кладёт сторону в чужую грань. | To'rt qator, va ulardan biri tomonni begona yoqqa qo'yadi. | Four lines, and one of them puts a side into a face that is not its own. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `M ∈ A₁B₁,   N ∈ B₁C₁` |
| `row.r2` | `MN ⊂ A₁B₁C₁D₁` |
| `row.r3` | `MK ⊂ ABB₁A₁` |
| `row.r4` | `P = MN + NK + KM` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Прямоугольный параллелепипед, измерения девять, двенадцать и четыре. Сечение проходит через два противоположных боковых ребра. Какова его площадь? | To'g'ri burchakli parallelepiped, o'lchovlari to'qqiz, o'n ikki va to'rt. Kesim ikki qarama-qarshi yon qirra orqali o'tadi. Uning yuzasi qancha? | A rectangular box with dimensions nine, twelve and four. A section goes through two opposite lateral edges. What is its area? |
| `place.ok` | Шестьдесят. Диагональ пятнадцать, высота четыре. | Oltmish. Diagonal o'n besh, balandlik to'rt. | Sixty. The diagonal is fifteen, the height is four. |
| `place.wrong` | Диагональ основания считают по двум измерениям, а не по одному. | Asos diagonali bir o'lchov bo'yicha emas, ikki o'lchov bo'yicha hisoblanadi. | The base diagonal is computed from two dimensions, not from one. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для этого сечения | Bu kesim uchun nima to'g'ri | What is true for this section |
| `multi.d.hint` | Эта грань точку K не содержит. | Bu yoq K nuqtani o'z ichiga olmaydi. | This face does not contain the point K. |
| `multi.e.hint` | Точка K лежит на другом боковом ребре. | K nuqta boshqa yon qirrada yotadi. | The point K lies on another lateral edge. |
| `multi.ok` | Три записи из пяти. Две оставшиеся кладут точку в грань, которая её не содержит. | Beshtadan uch yozuv. Qolgan ikkitasi nuqtani uni o'z ichiga olmaydigan yoqqa qo'yadi. | Three readings out of five. The other two put a point into a face that does not contain it. |
| `audio.mount` | Прочитаем урок справа налево. Сначала счёт по телу, потом проверка записей. | Darsni o'ngdan chapga o'qiymiz. Avval jism bo'yicha hisob, keyin yozuvlarni tekshirish. | Let us read the lesson from right to left. First the count from the body, then the check of the readings. |
| `audio.work` | Отметь все записи, которые верны. Их больше одной. | To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are correct. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `60` |
| `place.step` | `15·4` |
| `multi.a` [верно] | `M ∈ A₁B₁` |
| `multi.b` [верно] | `MN ⊂ A₁B₁C₁D₁` |
| `multi.c` [верно] | `PM ∥ KH` |
| `multi.d` | `MK ⊂ ABB₁A₁` |
| `multi.e` | `K ∈ ABB₁A₁` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `secheniye-ne-ploskoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Где лежат вершины сечения? | Kesim uchlari qayerda yotadi? | Where do the vertices of a section lie? |
| `q1.a` [верно] | только на рёбрах | faqat qirralarda | only on the edges |
| `q1.b` | внутри граней | yoqlar ichida | inside the faces |
| `q1.b.hint` | Внутри грани лежат стороны. | Yoq ichida tomonlar yotadi. | The sides lie inside a face. |
| `q1.c` | в вершинах тела | jism uchlarida | at the vertices of the body |
| `q1.c.hint` | Это частный случай, а не правило. | Bu xususiy hol, qoida emas. | That is a special case, not the rule. |
| `q1.d` | в любом месте плоскости | tekislikning har qanday joyida | anywhere in the plane |
| `q1.d.hint` | Вне тела точек сечения нет. | Jismdan tashqarida kesim nuqtalari yo'q. | Outside the body there are no points of the section. |
| `q2.prompt` | Сколько сторон самое большее у сечения куба? | Kub kesimida eng ko'pi bilan nechta tomon? | The largest number of sides for a section of a cube? |
| `q2.a` [верно] | шесть | oltita | six |
| `q2.b` | четыре | to'rtta | four |
| `q2.b.hint` | Четыре бывает, но это не наибольшее. | To'rt bo'ladi, lekin bu eng katta emas. | Four happens, but it is not the largest. |
| `q2.c` | восемь | sakkizta | eight |
| `q2.c.hint` | Восемь это вершины, а не грани. | Sakkiz uchlar, yoqlar emas. | Eight is the vertices, not the faces. |
| `q2.d` | двенадцать | o'n ikkita | twelve |
| `q2.d.hint` | Двенадцать это рёбра. | O'n ikki qirralar. | Twelve is the edges. |
| `q3.prompt` | Когда две точки соединяют стороной? | Ikki nuqta qachon tomon bilan ulanadi? | When are two points joined by a side? |
| `q3.a` [верно] | когда лежат в одной грани | bir yoqda yotganda | when they lie in one face |
| `q3.b` | когда лежат близко | yaqin yotganda | when they lie close |
| `q3.b.hint` | Близость на чертеже зависит от ракурса. | Chizmadagi yaqinlik rakursga bog'liq. | Closeness on the drawing depends on the view. |
| `q3.c` | всегда | har doim | always |
| `q3.c.hint` | Тогда отрезок пройдёт внутри тела. | U holda kesma jism ichidan o'tadi. | Then the segment would go inside the body. |
| `q3.d` | когда лежат на одном ребре | bir qirrada yotganda | when they lie on one edge |
| `q3.d.hint` | Тогда сторона совпала бы с ребром. | U holda tomon qirra bilan mos tushardi. | Then the side would coincide with the edge. |
| `q4.prompt` | Что такое след секущей плоскости? | Kesuvchi tekislikning izi nima? | What is the trace of a cutting plane? |
| `q4.a` [верно] | линия её пересечения с плоскостью основания | uning asos tekisligi bilan kesishish chizig'i | the line where it meets the plane of the base |
| `q4.b` | ребро тела | jism qirrasi | an edge of the body |
| `q4.b.hint` | Ребро есть у тела, а след у плоскости. | Qirra jismda bor, iz esa tekislikda. | An edge belongs to the body, a trace to the plane. |
| `q4.c` | диагональ основания | asos diagonali | a diagonal of the base |
| `q4.c.hint` | Диагональ задана телом, а след секущей плоскостью. | Diagonal jism bilan berilgan, iz esa kesuvchi tekislik bilan. | A diagonal is given by the body, a trace by the cutting plane. |
| `q4.d` | высота тела | jism balandligi | the height of the body |
| `q4.d.hint` | Высота это отрезок, а след прямая в основании. | Balandlik kesma, iz esa asosdagi to'g'ri chiziq. | A height is a segment, a trace is a line in the base. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `M ∈ A₁B₁` |
| `q2.done` | `6` |
| `q3.done` | `MN ⊂ A₁B₁C₁D₁` |
| `q4.done` | `X = LM ∩ AC` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Строю сечение по правилам, а не на глаз | Kesimni ko'z bilan emas, qoida bo'yicha yasayman | I build a section by the rules, not by eye |
| `can.2` | Проверяю, лежат ли две точки в одной грани | Ikki nuqta bir yoqda yotganini tekshiraman | I check whether two points lie in one face |
| `can.3` | Нахожу след и по нему новую точку на ребре | Izni topaman va u bo'yicha qirrada yangi nuqtani | I find the trace and a new point on an edge by it |
| `can.4` | Проверяю ответ по числу граней | Javobni yoqlar soni bo'yicha tekshiraman | I check the answer against the number of faces |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше координаты и векторы в пространстве — тело будет задаваться числами | Bundan keyin fazoda koordinatalar va vektorlar, jism sonlar bilan beriladi | Next come coordinates and vectors in space, where a body is given by numbers |
| `lifehack` | Прежде чем соединить две точки, найди грань, в которой лежат обе | Ikki nuqtani ulashdan oldin ikkisi yotgan yoqni toping | Before joining two points, find the face in which both of them lie |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страницы шестьдесят четыре и шестьдесят восемь | Geometriya, oltmish to'rtinchi va oltmish sakkizinchi betlar | Geometry, pages sixty four and sixty eight |
| `audio.mount` | Урок начался с вопроса про три точки на рёбрах куба. | Dars kub qirralaridagi uch nuqta haqidagi savol bilan boshlandi. | The lesson began with a question about three points on the edges of a cube. |
| `audio.next` | Сторон в сечении оказалось пять, а не три, и это не хитрость чертежа. Три точки задали плоскость, а плоскость сама решила, какие рёбра она режет, и их оказалось пять. Соединять между собой можно только те точки, у которых есть общая грань, потому что сторона сечения лежит в грани. Когда такие пары кончаются, работает след: выходим за тело, находим точку в плоскости основания и через неё получаем новую вершину на ребре. И готова проверка на весь урок: сторон не больше, чем граней. Дальше тело будет задаваться не чертежом, а числами. | Kesimda tomonlar beshta chiqdi, uchta emas, va bu chizmaning hiylasi emas. Uch nuqta tekislikni aniqladi, tekislik esa qaysi qirralarni kesishini o'zi hal qildi, va ular beshta bo'ldi. Bir biriga faqat umumiy yog'i bor nuqtalarni ulash mumkin, chunki kesim tomoni yoqda yotadi. Bunday juftlar tugaganda iz ishlaydi: jismdan tashqariga chiqamiz, asos tekisligida nuqta topamiz va u orqali qirrada yangi uch olamiz. Va butun darsga tekshiruv tayyor: tomonlar yoqlardan ko'p emas. Bundan keyin jism chizma bilan emas, sonlar bilan beriladi. | The section turned out to have five sides, not three, and that is not a trick of the drawing. Three points determined a plane, and the plane itself decided which edges it cuts, and there were five of them. Only points that have a common face may be joined to each other, because a side of a section lies in a face. When such pairs run out, the trace works: we go outside the body, find a point in the plane of the base and through it get a new vertex on an edge. And the check for the whole lesson is ready: no more sides than faces. Next the body will be given not by a drawing but by numbers. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `3` |
| `hook.b` | `5` |
| `proved` | `5` |
| `law` | `MN ⊂ A₁B₁C₁D₁` |
| `sheet.1` | `M ∈ A₁B₁` |
| `sheet.2` | `MN ⊂ A₁B₁C₁D₁` |
| `sheet.3` | `X = LM ∩ AC` |
| `sheet.4` | `N = KX ∩ BC` |
| `sheet.5` | `PM ∥ KH` |
