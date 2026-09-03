# Урок 50 — Координаты в пространстве · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS49_KONTENT.md`.

Скелет: в переписке 2026-08-21. **Опоры в учебнике 10 класса нет** — координат в пространстве нет
ни в одном из двух томов 2017 года. Источник истины — план (`PODXOD_10SINF.md` §1, «спор закрыт:
источник истины — план»). Это тот же случай, что в 11 классе на уроках 38–39: когда тема нужна для
ДТМ, план сильнее отсутствующего учебника.

**Чтение блока.** Строки 50–54 повторяют названия блока Б5 одиннадцатого класса. Блок 10 класса
читается как ПЕРВЫЙ проход: вводятся объекты. Углы между плоскостями, расстояния в пространстве и
преобразования сюда не входят — они остаются 11 классу. Допущение записано методисту 2026-08-21,
он открыл блок в производство.

**Главное решение урока.** Ошибка года `nuqta-proyeksiyasiz`: точку в пространстве строят на глаз
и третью координату приписывают не к той оси. Свидетель: у точки рисуется проекция на нижнюю
плоскость, и при повороте каркаса проекция едет под точкой, не отрываясь. Если бы число попало не
к своей оси, проекция стояла бы в другом узле, и поворот это показывает.

**Прибор 6C** — `Space3D` (`src/components/grade10/space.jsx`), переходник к `SpaceFrame`
11 класса. Проекция включается флагом `proj`, расстояние — режимом `drop` с честной линейкой:
неперпендикулярный отрезок прибор подписывает словом «наклонная» и в ответ не берёт.

**Числа урока целые намеренно.** Расстояние от точки до оси считается по двум координатам, и
шестёрка с восьмёркой дают ровно десять — ученик проверяет мысль, а не тренирует корни.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`koordinatalar`, `proyeksiya`, `koordinata tekisligi`, `abssissa`, `ordinata`, `applikata`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | КООРДИНАТЫ | KOORDINATALAR | COORDINATES |
| `title` | Сколько чисел нужно точке | Nuqtaga nechta son kerak | How many numbers a point needs |
| `row.a.name` | два | ikkita | two |
| `row.b.name` | три | uchta | three |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас поставим точку. | Javobingiz yozib olindi. Endi nuqtani qo'yamiz. | Your answer is recorded. Now we place the point. |
| `audio.mount` | Точка в пространстве и её запись из трёх чисел. | Fazodagi nuqta va uning uch sondan iborat yozuvi. | A point in space and its reading of three numbers. |
| `audio.r1` | Первая запись говорит, что точке хватает двух чисел, как на плоскости. | Birinchi yozuv nuqtaga tekislikdagidek ikki son yetadi deydi. | The first reading says two numbers are enough for a point, as on a plane. |
| `audio.r2` | Вторая говорит, что нужно три. | Ikkinchisi uchta kerak deydi. | The second says three are needed. |
| `audio.ask` | На чертеже видна плоскость, и по ней кажется, что двух хватит. Как думаешь, какая запись верная? | Chizmada tekislik ko'rinadi, va unga qarab ikkitasi yetadigandek tuyuladi. Sizningcha qaysi yozuv to'g'ri? | The drawing shows a plane, and by it two seem enough. Which reading do you think is right? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A (2; 3; 4)` |
| `row.a.value` | `2` |
| `row.b.value` | `3` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из курса | Kursdan uch savol | Three questions from the course |
| `q1.prompt` | Сколько чисел задаёт точку на плоскости? | Tekislikdagi nuqtani nechta son aniqlaydi? | How many numbers determine a point on a plane? |
| `q1.a` [верно] | два | ikkita | two |
| `q1.b` | одно | bitta | one |
| `q1.b.hint` | Одно число задаёт точку на прямой. | Bitta son to'g'ri chiziqdagi nuqtani aniqlaydi. | One number determines a point on a line. |
| `q1.c` | три | uchta | three |
| `q1.c.hint` | Три числа появятся в пространстве. | Uchta son fazoda paydo bo'ladi. | Three numbers will appear in space. |
| `q1.d` | четыре | to'rtta | four |
| `q1.d.hint` | Четвёртого числа в геометрии курса нет. | Kursning geometriyasida to'rtinchi son yo'q. | There is no fourth number in the geometry of this course. |
| `q2.prompt` | Что такое проекция точки на плоскость? | Nuqtaning tekislikka proyeksiyasi nima? | What is the projection of a point onto a plane? |
| `q2.a` [верно] | основание перпендикуляра из точки | nuqtadan tushirilgan perpendikulyarning asosi | the foot of the perpendicular from the point |
| `q2.b` | ближайшая точка на краю плоскости | tekislik chekkasidagi eng yaqin nuqta | the nearest point on the edge of the plane |
| `q2.b.hint` | У плоскости края нет, она бесконечна. | Tekislikning chekkasi yo'q, u cheksiz. | A plane has no edge, it is endless. |
| `q2.c` | точка под ней на глаз | ko'z bilan uning ostidagi nuqta | the point below it by eye |
| `q2.c.hint` | На глаз это не строится: нужен перпендикуляр. | Bu ko'z bilan yasalmaydi: perpendikulyar kerak. | It is not built by eye: a perpendicular is needed. |
| `q2.d` | середина отрезка до плоскости | tekislikkacha kesmaning o'rtasi | the midpoint of the segment to the plane |
| `q2.d.hint` | Середина лежит между, а проекция на плоскости. | O'rta orasida yotadi, proyeksiya esa tekislikda. | The midpoint lies between, the projection lies in the plane. |
| `q3.prompt` | Порядок чисел в записи произволен? | Yozuvdagi sonlar tartibi ixtiyoriymi? | Is the order of the numbers in the reading arbitrary? |
| `q3.a` [верно] | нет, у каждого места своя ось | yo'q, har o'rinning o'z o'qi bor | no, each place has its own axis |
| `q3.b` | да, лишь бы числа те же | ha, sonlar o'sha bo'lsa bo'ldi | yes, as long as the numbers are the same |
| `q3.b.hint` | Те же числа в другом порядке дают другую точку. | O'sha sonlar boshqa tartibda boshqa nuqta beradi. | The same numbers in another order give another point. |
| `q3.c` | да, если числа положительные | ha, agar sonlar musbat bo'lsa | yes, if the numbers are positive |
| `q3.c.hint` | Знак тут ничего не решает. | Ishora bu yerda hech narsani hal qilmaydi. | The sign decides nothing here. |
| `q3.d` | только для нуля | faqat nol uchun | only for zero |
| `q3.d.hint` | Ноль тоже стоит на своём месте. | Nol ham o'z o'rnida turadi. | Zero also stands in its own place. |
| `audio.mount` | Три вопроса. Правило урока соберётся из первого и третьего. | Uchta savol. Darsning qoidasi birinchi va uchinchidan yig'iladi. | Three questions. The rule of the lesson will be assembled from the first and the third. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `M (x; y)` |
| `q2.done` | `A₁ ∈ Oxy` |
| `q3.done` | `(2; 3; 4) ≠ (4; 3; 2)` |

---

## Экран 3 · `explain1` · ответ `number` · тег `nuqta-proyeksiyasiz`

Третья координата: подъём над плоскостью.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Третье число это подъём | Uchinchi son ko'tarilish | The third number is the rise |
| `show.1.1` | сначала точка в нижней плоскости | avval nuqta pastki tekislikda | first the point in the lower plane |
| `show.1.2` | два числа, как на плоскости | ikki son, tekislikdagidek | two numbers, as on a plane |
| `show.2.1` | теперь подъём на четыре | endi to'rtga ko'tarilish | now a rise of four |
| `show.2.2` | и проекция осталась внизу | va proyeksiya pastda qoldi | and the projection stayed below |
| `audio.mount` | В нижней плоскости стоит точка с двумя числами. Она пока не в пространстве. | Pastki tekislikda ikki sonli nuqta turadi. U hozircha fazoda emas. | A point with two numbers stands in the lower plane. It is not yet in space. |
| `audio.move*` | Поднимаю точку на четыре, и внизу остаётся её проекция. Проекция это основание перпендикуляра, и она никуда не уходит: сколько бы я ни поворачивал каркас, она стоит ровно под точкой. Первые два числа адресуют проекцию, третье говорит, на сколько точка поднята над плоскостью. Поэтому точке в пространстве нужны три числа, а не два: двух хватило бы, если бы весь мир лежал в одной плоскости. И заметь порядок: третье число закреплено за вертикальной осью, переставить его нельзя. | Nuqtani to'rtga ko'taraman, va pastda uning proyeksiyasi qoladi. Proyeksiya perpendikulyarning asosi, va u hech qayerga ketmaydi: karkasni qancha bursam ham, u nuqtaning tagida turadi. Birinchi ikki son proyeksiyaning manzili, uchinchisi nuqta tekislikdan qancha ko'tarilganini aytadi. Shuning uchun fazodagi nuqtaga ikki emas, uch son kerak: ikkitasi butun dunyo bitta tekislikda yotganda yetardi. Tartibga ham e'tibor bering: uchinchi son tik o'qqa biriktirilgan, uni almashtirib bo'lmaydi. | I raise the point by four, and its projection stays below. The projection is the foot of the perpendicular, and it does not move anywhere: however much I turn the frame, it stands exactly under the point. The first two numbers address the projection, the third says how far the point is raised above the plane. That is why a point in space needs three numbers and not two: two would be enough if the whole world lay in one plane. And note the order: the third number is tied to the vertical axis and cannot be moved. |
| `audio.work` | Посчитай сам. Сколько чисел нужно точке в пространстве? | O'zingiz hisoblang. Fazodagi nuqtaga nechta son kerak? | Work it out yourself. How many numbers does a point in space need? |
| `work.prompt` | Сколько чисел нужно точке? | Nuqtaga nechta son kerak? | How many numbers does a point need? |
| `work.ok` | Три. Два на проекцию и одно на подъём. | Uchta. Ikkitasi proyeksiyaga, bittasi ko'tarilishga. | Three. Two for the projection and one for the rise. |
| `work.hint.1` | Посчитай, сколько чисел ушло на проекцию. | Proyeksiyaga nechta son ketganini sanang. | Count how many numbers went to the projection. |
| `work.hint.2` | И добавь то, что говорит про подъём. | Va ko'tarilish haqida aytadiganini qo'shing. | And add the one that speaks of the rise. |
| `work.hint.3` | Три. | Uchta. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A (2; 3; 4)` |
| `work.answer` | `3` |

---

## Экран 4 · `explain2` · ответ `number` · тег `nuqta-proyeksiyasiz`

Проекция как адрес: у неё третье число ноль.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | У проекции третье число ноль | Proyeksiyada uchinchi son nol | The projection has zero as its third number |
| `show.1.1` | точка и её проекция | nuqta va uning proyeksiyasi | the point and its projection |
| `show.1.2` | первые два числа у них общие | birinchi ikki son ularda umumiy | their first two numbers are the same |
| `show.2.1` | поворот, и проекция под точкой | burilish, va proyeksiya nuqta tagida | a turn, and the projection is under the point |
| `show.2.2` | подъём у неё нулевой | uning ko'tarilishi nol | its rise is zero |
| `audio.mount` | Точка и её проекция стоят одна над другой. Сравним их записи. | Nuqta va uning proyeksiyasi bir-birining ustida turadi. Yozuvlarini taqqoslaymiz. | The point and its projection stand one above the other. Let us compare their readings. |
| `audio.move*` | Первые два числа у них одинаковые, и это не совпадение: проекция и есть адрес точки в нижней плоскости. Различие только в третьем числе. У точки оно четыре, у проекции ноль, потому что проекция лежит в самой плоскости и подниматься ей некуда. Поворачиваю каркас: проекция едет вместе с точкой и остаётся под ней. Вот эта связка и есть проверка чертежа. Если бы я приписал четвёрку не к вертикальной оси, проекция встала бы в другой узел сетки, и поворот сразу бы это показал. | Birinchi ikki son ularda bir xil, va bu tasodif emas: proyeksiya nuqtaning pastki tekislikdagi manzilining o'zi. Farq faqat uchinchi sonda. Nuqtada u to'rt, proyeksiyada nol, chunki proyeksiya tekislikning o'zida yotadi va ko'tariladigan joyi yo'q. Karkasni buraman: proyeksiya nuqta bilan birga yuradi va uning tagida qoladi. Ana shu bog'lanish chizmaning tekshiruvi. Agar to'rtni tik o'qqa emas, boshqasiga bergan bo'lsam, proyeksiya to'rning boshqa tuguniga tushardi, va burilish buni darrov ko'rsatardi. | Their first two numbers are the same, and that is no coincidence: the projection is exactly the address of the point in the lower plane. The only difference is in the third number. For the point it is four, for the projection zero, because the projection lies in the plane itself and has nowhere to rise. I turn the frame: the projection travels with the point and stays under it. That link is the check of the drawing. Had I given the four to another axis, the projection would stand at another node of the grid, and the turn would show it at once. |
| `audio.work` | Посчитай сам. Какое третье число у проекции? | O'zingiz hisoblang. Proyeksiyaning uchinchi soni qanday? | Work it out yourself. What is the third number of the projection? |
| `work.prompt` | Третье число проекции? | Proyeksiyaning uchinchi soni? | The third number of the projection? |
| `work.ok` | Ноль. Проекция лежит в самой плоскости. | Nol. Proyeksiya tekislikning o'zida yotadi. | Zero. The projection lies in the plane itself. |
| `work.hint.1` | Спроси, на сколько поднята сама проекция. | Proyeksiyaning o'zi qancha ko'tarilgan deb so'rang. | Ask how far the projection itself is raised. |
| `work.hint.2` | Она в плоскости, подниматься ей некуда. | U tekislikda, ko'tariladigan joyi yo'q. | It is in the plane, it has nowhere to rise. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A₁ (2; 3; 0)` |
| `work.answer` | `0` |

---

## Экран 5 · `explain3` · ответ `number` · тег `nuqta-proyeksiyasiz`

Порядок закреплён: те же числа в другом порядке дают другую точку.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Те же числа, другая точка | O'sha sonlar, boshqa nuqta | The same numbers, another point |
| `show.1.1` | точка с записью два три четыре | ikki uch to'rt yozuvli nuqta | the point read two three four |
| `show.1.2` | и точка с записью четыре три два | va to'rt uch ikki yozuvli nuqta | and the point read four three two |
| `show.2.1` | числа одни и те же | sonlar bir xil | the numbers are the same |
| `show.2.2` | а точки разные | nuqtalar esa boshqa | but the points are different |
| `audio.mount` | Две точки, и в записях у них одни и те же три числа. | Ikki nuqta, va yozuvlarida bir xil uchta son. | Two points, and their readings hold the same three numbers. |
| `audio.move*` | Стоят они в разных местах, и разошлись далеко. Причина в порядке: место в записи закреплено за осью, а не за числом. У первой точки четвёрка отвечает за подъём, и она высоко. У второй четвёрка ушла на первую ось, а подъём стал двойкой, и точка опустилась. Отсюда важное следствие для экзамена: запись читается по местам, а не по набору чисел. Проверка та же, что и раньше, это проекция. У обеих точек проекции разные, и это видно сразу, до всякого счёта. | Ular boshqa-boshqa joyda turadi va uzoqqa ketdi. Sabab tartibda: yozuvdagi o'rin o'qqa biriktirilgan, songa emas. Birinchi nuqtada to'rt ko'tarilishga javob beradi, va u balandda. Ikkinchisida to'rt birinchi o'qqa ketdi, ko'tarilish esa ikki bo'ldi, va nuqta pastga tushdi. Bundan imtihon uchun muhim natija chiqadi: yozuv sonlar to'plami bo'yicha emas, o'rinlar bo'yicha o'qiladi. Tekshiruv esa o'sha -- proyeksiya. Ikki nuqtaning proyeksiyalari boshqa, va bu hisobsiz, darrov ko'rinadi. | They stand in different places and have parted far. The reason is the order: a place in the reading is tied to an axis, not to a number. In the first point the four answers for the rise, and it is high. In the second the four went to the first axis and the rise became two, so the point came down. Hence an important consequence for the exam: a reading is read by places, not by the set of numbers. And the check is the same one, it is the projection. The two points have different projections, and that is visible at once, before any counting. |
| `audio.work` | Посчитай сам. У скольких из двух точек подъём равен четырём? | O'zingiz hisoblang. Ikki nuqtadan nechtasining ko'tarilishi to'rtga teng? | Work it out yourself. How many of the two points have a rise of four? |
| `work.prompt` | У скольких подъём равен четырём? | Nechtasining ko'tarilishi to'rt? | How many have a rise of four? |
| `work.ok` | У одной. Подъём это третье место, а не любое. | Bittasining. Ko'tarilish uchinchi o'rin, har qanday emas. | One. The rise is the third place, not any place. |
| `work.hint.1` | Смотри только на третье место в записи. | Yozuvdagi faqat uchinchi o'ringa qarang. | Look only at the third place in the reading. |
| `work.hint.2` | У второй точки там двойка. | Ikkinchi nuqtada u yerda ikki. | For the second point there is a two there. |
| `work.hint.3` | Одна. | Bittasi. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `(2; 3; 4) ≠ (4; 3; 2)` |
| `work.answer` | `1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `nuqta-proyeksiyasiz`

Расстояние до нижней плоскости и честная линейка.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Расстояние это перпендикуляр | Masofa perpendikulyar | A distance is a perpendicular |
| `show.1.1` | наклонный отрезок до плоскости | tekislikkacha qiya kesma | a slanted segment to the plane |
| `show.1.2` | прибор называет его наклонной | asbob uni qiya deb ataydi | the tool calls it a slant |
| `show.2.1` | перпендикуляр из точки | nuqtadan perpendikulyar | the perpendicular from the point |
| `show.2.2` | и это уже расстояние | va bu endi masofa | and this is a distance now |
| `audio.mount` | Проведу от точки до нижней плоскости наклонный отрезок и попробую взять его за расстояние. | Nuqtadan pastki tekislikkacha qiya kesma o'tkazaman va uni masofa deb olishga harakat qilaman. | Let me draw a slanted segment from the point to the lower plane and try to take it as the distance. |
| `audio.move*` | Прибор подписывает его словом наклонная и в ответ не берёт. Это правило блока шесть, и здесь оно работает так же: расстояние от точки до плоскости меряется только по перпендикуляру, всё остальное длиннее. Ставлю перпендикуляр, и его основание оказывается ровно в проекции точки. А длина перпендикуляра равна третьему числу записи, потому что третье число и есть подъём над плоскостью. Вот и связка: расстояние до нижней плоскости читается прямо из записи, считать ничего не надо. | Asbob uni qiya deb belgilaydi va javobga olmaydi. Bu oltinchi blokning qoidasi, va bu yerda ham xuddi shunday ishlaydi: nuqtadan tekislikkacha masofa faqat perpendikulyar bo'ylab o'lchanadi, qolgani uzunroq. Perpendikulyar qo'yaman, va uning asosi aynan nuqtaning proyeksiyasida chiqadi. Perpendikulyarning uzunligi esa yozuvning uchinchi soniga teng, chunki uchinchi son tekislikdan ko'tarilishning o'zi. Ana bog'lanish: pastki tekislikkacha masofa yozuvdan to'g'ridan to'g'ri o'qiladi, hisoblash kerak emas. | The tool labels it with the word slant and does not take it as the answer. That is the rule of block six, and here it works the same way: the distance from a point to a plane is measured only along the perpendicular, everything else is longer. I set the perpendicular, and its foot turns out to be exactly at the projection of the point. And the length of the perpendicular equals the third number of the reading, because the third number is the rise above the plane itself. There is the link: the distance to the lower plane is read straight from the reading, nothing to compute. |
| `audio.work` | Посчитай сам. Каково расстояние от точки до нижней плоскости? | O'zingiz hisoblang. Nuqtadan pastki tekislikkacha masofa qancha? | Work it out yourself. What is the distance from the point to the lower plane? |
| `work.prompt` | Расстояние до нижней плоскости? | Pastki tekislikkacha masofa? | The distance to the lower plane? |
| `work.ok` | Четыре. Это третье число записи. | To'rt. Bu yozuvning uchinchi soni. | Four. That is the third number of the reading. |
| `work.hint.1` | Расстояние меряется по перпендикуляру. | Masofa perpendikulyar bo'ylab o'lchanadi. | The distance is measured along the perpendicular. |
| `work.hint.2` | Его длина это подъём точки. | Uning uzunligi nuqtaning ko'tarilishi. | Its length is the rise of the point. |
| `work.hint.3` | Четыре. | To'rt. | Four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A (2; 3; 4)` |
| `work.answer` | `4` |

---

## Экран 7 · `explain5` · ответ `number` · тег `nuqta-proyeksiyasiz`

ГРАНИЦА: нули в записи говорят, где лежит точка.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE CASE |
| `title` | Нули говорят, где точка | Nollar nuqta qayerda ekanini aytadi | The zeros say where the point is |
| `show.1.1` | точка два три нуль | ikki uch nol nuqta | the point two three zero |
| `show.1.2` | один нуль, и она в плоскости | bitta nol, va u tekislikda | one zero, and it is in the plane |
| `show.2.1` | точка нуль три нуль | nol uch nol nuqta | the point zero three zero |
| `show.2.2` | два нуля, и она на оси | ikki nol, va u o'qda | two zeros, and it is on an axis |
| `audio.mount` | Возьмём точку, у которой третье число ноль. Она совпала со своей проекцией. | Uchinchi soni nol bo'lgan nuqtani olamiz. U o'z proyeksiyasi bilan mos tushdi. | Take a point whose third number is zero. It has merged with its own projection. |
| `audio.move*` | Значит она лежит в нижней плоскости, и перпендикуляр к этой плоскости у неё нулевой. Теперь обнулю ещё одно число. Точка ушла на ось, и это уже не случай плоскости, а случай прямой: два нуля оставляют ей только одну свободу. Отсюда правило чтения, которое на экзамене экономит время. Ни одного нуля значит точка внутри, вне плоскостей. Один нуль значит точка в координатной плоскости. Два нуля значит точка на оси. Три нуля дают начало координат, и оно одно. | Demak u pastki tekislikda yotadi, va bu tekislikka perpendikulyari nol. Endi yana bitta sonni nolga aylantiraman. Nuqta o'qqa ketdi, va bu endi tekislik holi emas, to'g'ri chiziq holi: ikki nol unga faqat bitta erkinlik qoldiradi. Bundan imtihonda vaqt tejaydigan o'qish qoidasi chiqadi. Bitta ham nol yo'q -- nuqta ichkarida, tekisliklardan tashqarida. Bitta nol -- nuqta koordinata tekisligida. Ikki nol -- nuqta o'qda. Uch nol -- bu koordinatalar boshi, va u bitta. | So it lies in the lower plane, and its perpendicular to that plane is zero. Now let me zero one more number. The point has gone to an axis, and this is no longer the case of a plane but the case of a line: two zeros leave it only one freedom. Hence a reading rule that saves time at the exam. No zeros at all means the point is inside, off the planes. One zero means the point is in a coordinate plane. Two zeros mean the point is on an axis. Three zeros give the origin, and there is only one. |
| `audio.work` | Посчитай сам. Сколько нулей в записи точки, лежащей на оси? | O'zingiz hisoblang. O'qda yotgan nuqtaning yozuvida nechta nol bor? | Work it out yourself. How many zeros are in the reading of a point lying on an axis? |
| `work.prompt` | Сколько нулей у точки на оси? | O'qdagi nuqtada nechta nol? | How many zeros for a point on an axis? |
| `work.ok` | Два. Остаётся одна свобода, вдоль оси. | Ikkita. Bitta erkinlik qoladi, o'q bo'ylab. | Two. One freedom remains, along the axis. |
| `work.hint.1` | Посчитай, сколько чисел обнулилось. | Nechta son nolga aylanganini sanang. | Count how many numbers became zero. |
| `work.hint.2` | Одного нуля хватало на плоскость. | Bitta nol tekislikka yetardi. | One zero was enough for a plane. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `(0; 3; 0) ∈ Oy` |
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `nuqta-proyeksiyasiz`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Как читается тройка | Uchlik qanday o'qiladi | How a triple is read |
| `probe.question` | Что проверяет проекция? | Proyeksiya nimani tekshiradi? | What does the projection check? |
| `probe.a` [верно] | что первые два числа на своих осях | birinchi ikki son o'z o'qlarida ekanini | that the first two numbers are on their own axes |
| `probe.b` | что точка близко к плоскости | nuqta tekislikka yaqin ekanini | that the point is close to the plane |
| `probe.b.hint` | Близость тут ни при чём, проекция есть у любой точки. | Yaqinlikning bunga aloqasi yo'q, proyeksiya har qanday nuqtada bor. | Closeness has nothing to do with it, every point has a projection. |
| `rule.lawLabel` | Точка в пространстве | Fazodagi nuqta | A point in space |
| `rule.lines.1` | место в записи закреплено за осью, а не за числом | yozuvdagi o'rin songa emas, o'qqa biriktirilgan | a place in the reading is tied to an axis, not to a number |
| `rule.lines.2` | первые два числа адресуют проекцию, третье даёт подъём | birinchi ikki son proyeksiyani manzillaydi, uchinchisi ko'tarilishni beradi | the first two numbers address the projection, the third gives the rise |
| `rule.lines.3` | число нулей говорит, где точка лежит | nollar soni nuqta qayerda yotganini aytadi | the number of zeros says where the point lies |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Все три строки про одно: тройка это не набор чисел, а три адреса по трём осям. Первая строка запрещает переставлять числа. Вторая говорит, как их проверить чертежом, и это самая полезная строка блока: проекция ловит ошибку до всякого счёта. Третья превращает нули в информацию. На экзамене она работает быстрее всего: увидел два нуля, значит точка на оси, и половина работы уже сделана. | Uchta satr ham bir narsa haqida: uchlik sonlar to'plami emas, uch o'q bo'yicha uch manzil. Birinchi satr sonlarni almashtirishni taqiqlaydi. Ikkinchisi ularni chizma bilan qanday tekshirishni aytadi, va bu blokning eng foydali satri: proyeksiya xatoni har qanday hisobdan oldin ushlaydi. Uchinchisi nollarni ma'lumotga aylantiradi. Imtihonda u eng tez ishlaydi: ikki nolni ko'rdingiz -- nuqta o'qda, va ishning yarmi bajarilgan. | All three lines are about one thing: a triple is not a set of numbers but three addresses along three axes. The first line forbids swapping the numbers. The second says how to check them with a drawing, and it is the most useful line of the block: the projection catches a mistake before any counting. The third turns zeros into information. At the exam it works fastest: you see two zeros and the point is on an axis, and half the work is already done. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `A₁ (x; y; 0)` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `nuqta-proyeksiyasiz`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Где лежит точка | Nuqta qayerda yotadi | Where the point lies |
| `match.prompt` | Соедини запись с местом | Yozuvni joy bilan birlashtiring | Match the reading with the place |
| `match.ok` | Все четыре на месте. Нули сказали, где точка. | To'rttasi ham joyida. Nollar nuqta qayerda ekanini aytdi. | All four in place. The zeros said where the point is. |
| `audio.mount` | Четыре записи и четыре места. Считай нули. | To'rt yozuv va to'rt joy. Nollarni sanang. | Four readings and four places. Count the zeros. |
| `match.a` | на вертикальной оси | tik o'qda | on the vertical axis |
| `match.b` | в нижней плоскости | pastki tekislikda | in the lower plane |
| `match.c` | в задней плоскости | orqa tekislikda | in the back plane |
| `match.d` | вне плоскостей | tekisliklardan tashqarida | off the planes |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `(0; 0; 5)` · `(2; 3; 0)` · `(0; 2; 3)` · `(1; 2; 3)` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `nuqta-proyeksiyasiz`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи, что точка в нижней плоскости | Nuqta pastki tekislikda ekanini isbotlang | Prove the point is in the lower plane |
| `proof.given` | третье число записи равно нулю | yozuvning uchinchi soni nolga teng | the third number of the reading equals zero |
| `proof.goal` | точка лежит в нижней плоскости | nuqta pastki tekislikda yotadi | the point lies in the lower plane |
| `proof.r1` | подъём точки над плоскостью равен нулю | nuqtaning tekislikdan ko'tarilishi nolga teng | the rise of the point above the plane equals zero |
| `proof.r2` | значит точка совпала со своей проекцией | demak nuqta o'z proyeksiyasi bilan mos tushdi | so the point has merged with its own projection |
| `proof.r3` | проекция лежит в плоскости, значит и точка | proyeksiya tekislikda yotadi, demak nuqta ham | the projection lies in the plane, so does the point |
| `proof.ok` | Доказано. Ноль в третьем месте это не мелочь, а условие. | Isbotlandi. Uchinchi o'rindagi nol mayda-chuyda emas, shart. | Proved. A zero in the third place is not a detail but a condition. |
| `proof.e1` | Про проекцию дальше. Сначала про подъём. | Proyeksiya haqida keyin. Avval ko'tarilish haqida. | The projection comes later. First about the rise. |
| `proof.e2` | Подъём разобран. Что из этого следует для проекции. | Ko'tarilish ko'rildi. Bundan proyeksiya uchun nima kelib chiqadi. | The rise is done. What follows from it for the projection. |
| `proof.e3` | Совпадение показано. Теперь вывод про плоскость. | Mos tushish ko'rsatildi. Endi tekislik haqida xulosa. | The merging is shown. Now the conclusion about the plane. |
| `reason.s1` | третье число закреплено за вертикальной осью | uchinchi son tik o'qqa biriktirilgan | the third number is tied to the vertical axis |
| `reason.s2` | проекция это основание перпендикуляра | proyeksiya perpendikulyarning asosi | the projection is the foot of the perpendicular |
| `reason.s3` | проекция по построению лежит в плоскости | proyeksiya yasalishi bo'yicha tekislikda yotadi | the projection lies in the plane by construction |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `(2; 3; 0) ∈ Oxy` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Десять. Шесть и восемь дают десять. | O'n. Olti va sakkiz o'n beradi. | Ten. Six and eight give ten. |
| `task.hint.1` | Расстояние до вертикальной оси не зависит от подъёма. | Tik o'qqacha masofa ko'tarilishga bog'liq emas. | The distance to the vertical axis does not depend on the rise. |
| `task.hint.2` | Работают первые два числа, как катеты. | Birinchi ikki son katetlar kabi ishlaydi. | The first two numbers work as legs. |
| `task.hint.3` | Шесть, восемь, десять. | Olti, sakkiz, o'n. | Six, eight, ten. |
| `order.prompt` | Расставь шаги в том порядке, в каком считают | Qadamlarni hisoblash tartibida joylashtiring | Arrange the steps in the order they are computed |
| `order.title` | Порядок счёта | Hisob tartibi | The order of computing |
| `order.ok` | Порядок верный. Проекция, катеты, сумма квадратов, корень. | Tartib to'g'ri. Proyeksiya, katetlar, kvadratlar yig'indisi, ildiz. | The order is right. The projection, the legs, the sum of squares, the root. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как считают. | Endi qadamlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring. | Now the order of the steps. Arrange them the way the counting goes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `A (6; 8; 5),   d(A, Oz) = ?` |
| `task.answer` | `10` |
| `order.items` | `d` · `A₁` · `x, y` · `x² + y²` |
| `order.answer` | `A₁  x, y  x² + y²  d` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Данные выписаны верно. | Berilganlar to'g'ri yozilgan. | The data are written correctly. |
| `hint.r2` | Проекция найдена верно, третье число ноль. | Proyeksiya to'g'ri topilgan, uchinchi son nol. | The projection is found correctly, the third number is zero. |
| `hint.r4` | Длина перпендикуляра взята из неверной строки выше. | Perpendikulyarning uzunligi yuqoridagi xato qatordan olingan. | The length of the perpendicular is taken from the wrong line above. |
| `proof` | Поверни каркас: проекция стоит под точкой, и подъём остаётся третьим числом. | Karkasni buring: proyeksiya nuqta tagida turadi, va ko'tarilish uchinchi son bo'lib qoladi. | Rotate the frame: the projection stands under the point and the rise stays the third number. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Подъём взяли из второго места, а не из третьего. | Uchinchi. Ko'tarilish uchinchi o'rindan emas, ikkinchisidan olingan. | The third. The rise was taken from the second place, not the third. |
| `entry.hint.1` | Проверь, из какого места взят подъём. | Ko'tarilish qaysi o'rindan olinganini tekshiring. | Check which place the rise was taken from. |
| `entry.hint.2` | Подъём это всегда третье место записи. | Ko'tarilish har doim yozuvning uchinchi o'rni. | The rise is always the third place of the reading. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них берёт число не с того места. | To'rt qator, va ulardan biri sonni boshqa o'rindan oladi. | Four lines, and one of them takes a number from the wrong place. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `A (2; 7; 4)` |
| `row.r2` | `A₁ (2; 7; 0)` |
| `row.r3` | `d(A, Oxy) = 7` |
| `row.r4` | `AA₁ = 7` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Проекция точки на нижнюю плоскость это пять и двенадцать, а расстояние до этой плоскости девять. Каково расстояние от точки до вертикальной оси? | Nuqtaning pastki tekislikka proyeksiyasi besh va o'n ikki, bu tekislikkacha masofa esa to'qqiz. Nuqtadan tik o'qqacha masofa qancha? | The projection of a point onto the lower plane is five and twelve, and the distance to that plane is nine. What is the distance from the point to the vertical axis? |
| `place.ok` | Тринадцать. Девятка тут не участвует. | O'n uch. To'qqizning bunga aloqasi yo'q. | Thirteen. The nine takes no part here. |
| `place.wrong` | Расстояние до оси считают по проекции, подъём в него не входит. | O'qqacha masofa proyeksiya bo'yicha hisoblanadi, ko'tarilish unga kirmaydi. | The distance to the axis is computed from the projection, the rise does not enter it. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно для этой точки | Bu nuqta uchun nima to'g'ri | What is true for this point |
| `multi.d.hint` | Это запись проекции, а не точки. | Bu proyeksiyaning yozuvi, nuqtaning emas. | That is the reading of the projection, not of the point. |
| `multi.e.hint` | Расстояние до оси не берёт подъём. | O'qqacha masofa ko'tarilishni olmaydi. | The distance to the axis does not take the rise. |
| `multi.ok` | Три записи из пяти. Две оставшиеся путают точку с её проекцией. | Beshtadan uch yozuv. Qolgan ikkitasi nuqtani proyeksiyasi bilan aralashtiradi. | Three readings out of five. The other two confuse the point with its projection. |
| `audio.mount` | Прочитаем урок справа налево. Дана проекция и подъём, найти надо расстояние. | Darsni o'ngdan chapga o'qiymiz. Proyeksiya va ko'tarilish berilgan, masofa topish kerak. | Let us read the lesson from right to left. The projection and the rise are given, the distance is to be found. |
| `audio.work` | Отметь все записи, которые верны. Их больше одной. | To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are correct. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `13` |
| `place.step` | `25 + 144` |
| `multi.a` [верно] | `A (5; 12; 9)` |
| `multi.b` [верно] | `A₁ (5; 12; 0)` |
| `multi.c` [верно] | `d(A, Oxy) = 9` |
| `multi.d` | `A (5; 12; 0)` |
| `multi.e` | `d(A, Oz) = 9` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `nuqta-proyeksiyasiz`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Сколько чисел задаёт точку в пространстве? | Fazodagi nuqtani nechta son aniqlaydi? | How many numbers determine a point in space? |
| `q1.a` [верно] | три | uchta | three |
| `q1.b` | два | ikkita | two |
| `q1.b.hint` | Двух хватает только в плоскости. | Ikkitasi faqat tekislikda yetadi. | Two are enough only in a plane. |
| `q1.c` | четыре | to'rtta | four |
| `q1.c.hint` | Четвёртой оси в курсе нет. | Kursda to'rtinchi o'q yo'q. | There is no fourth axis in this course. |
| `q1.d` | одно | bitta | one |
| `q1.d.hint` | Одно число задаёт точку на прямой. | Bitta son to'g'ri chiziqdagi nuqtani aniqlaydi. | One number determines a point on a line. |
| `q2.prompt` | Где лежит точка с двумя нулями? | Ikki noli bor nuqta qayerda yotadi? | Where does a point with two zeros lie? |
| `q2.a` [верно] | на оси | o'qda | on an axis |
| `q2.b` | в плоскости | tekislikda | in a plane |
| `q2.b.hint` | Для плоскости хватает одного нуля. | Tekislikka bitta nol yetadi. | One zero is enough for a plane. |
| `q2.c` | в начале координат | koordinatalar boshida | at the origin |
| `q2.c.hint` | В начале координат нулей три. | Koordinatalar boshida nollar uchta. | At the origin there are three zeros. |
| `q2.d` | вне плоскостей | tekisliklardan tashqarida | off the planes |
| `q2.d.hint` | Вне плоскостей нулей нет вовсе. | Tekisliklardan tashqarida nollar umuman yo'q. | Off the planes there are no zeros at all. |
| `q3.prompt` | Чему равно расстояние до нижней плоскости? | Pastki tekislikkacha masofa nimaga teng? | What does the distance to the lower plane equal? |
| `q3.a` [верно] | третьему числу записи | yozuvning uchinchi soniga | the third number of the reading |
| `q3.b` | первому числу | birinchi songa | the first number |
| `q3.b.hint` | Первое число адресует проекцию. | Birinchi son proyeksiyani manzillaydi. | The first number addresses the projection. |
| `q3.c` | сумме трёх чисел | uch sonning yig'indisiga | the sum of the three numbers |
| `q3.c.hint` | Сумма не имеет тут геометрического смысла. | Yig'indi bu yerda geometrik ma'no bermaydi. | The sum has no geometric meaning here. |
| `q3.d` | длине наклонной | qiyaning uzunligiga | the length of the slant |
| `q3.d.hint` | Наклонная всегда длиннее перпендикуляра. | Qiya har doim perpendikulyardan uzun. | A slant is always longer than a perpendicular. |
| `q4.prompt` | Что стоит на первых двух местах записи? | Yozuvning birinchi ikki o'rnida nima turadi? | What stands in the first two places of the reading? |
| `q4.a` [верно] | адрес проекции | proyeksiyaning manzili | the address of the projection |
| `q4.b` | подъём и наклон | ko'tarilish va og'ish | the rise and the slant |
| `q4.b.hint` | Наклона в записи точки нет вовсе. | Nuqta yozuvida og'ish umuman yo'q. | There is no slant in the reading of a point at all. |
| `q4.c` | расстояние до оси | o'qqacha masofa | the distance to the axis |
| `q4.c.hint` | Расстояние из них считается, но само в записи не стоит. | Masofa ulardan hisoblanadi, lekin o'zi yozuvda turmaydi. | The distance is computed from them but does not stand in the reading itself. |
| `q4.d` | два одинаковых числа | ikki bir xil son | two equal numbers |
| `q4.d.hint` | Они равны только в особом случае. | Ular faqat maxsus holda teng. | They are equal only in a special case. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `A (x; y; z)` |
| `q2.done` | `(0; 3; 0) ∈ Oy` |
| `q3.done` | `d(A, Oxy) = z` |
| `q4.done` | `A₁ (x; y; 0)` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Ставлю точку по тройке чисел, а не на глаз | Nuqtani ko'z bilan emas, uchlik bo'yicha qo'yaman | I place a point by a triple, not by eye |
| `can.2` | Проверяю запись проекцией | Yozuvni proyeksiya bilan tekshiraman | I check a reading with the projection |
| `can.3` | Читаю по нулям, где точка лежит | Nollar bo'yicha nuqta qayerda yotganini o'qiyman | I read from the zeros where the point lies |
| `can.4` | Считаю расстояние до плоскости и до оси | Tekislikkacha va o'qqacha masofani hisoblayman | I compute the distance to a plane and to an axis |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше вектор — у него тоже тройка, но она не адрес, а сдвиг | Bundan keyin vektor, unda ham uchlik bor, lekin u manzil emas, siljish | Next comes the vector: it also has a triple, but that triple is a shift, not an address |
| `lifehack` | Прежде чем считать, найди проекцию: она ловит ошибку в записи | Hisoblashdan oldin proyeksiyani toping: u yozuvdagi xatoni ushlaydi | Before computing, find the projection: it catches a mistake in the reading |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Программа, блок восемь | Programma, sakkizinchi blok | The programme, block eight |
| `audio.mount` | Урок начался с вопроса, сколько чисел нужно точке. | Dars nuqtaga nechta son kerakligi haqidagi savol bilan boshlandi. | The lesson began with the question how many numbers a point needs. |
| `audio.next` | Нужно три, и это не просто на одно больше. Третье число закреплено за вертикальной осью, и переставить его нельзя: те же числа в другом порядке дают другую точку. Первые два адресуют проекцию, и проекция это главная проверка блока, потому что она ловит ошибку до всякого счёта. Нули в записи не пустое место, а сведения: один нуль ставит точку в плоскость, два на ось, три в начало координат. Расстояние до нижней плоскости читается прямо из третьего числа, а до вертикальной оси считается по первым двум. Дальше появится вектор, и у него тоже будет тройка, но она будет означать не адрес, а сдвиг. | Uchta kerak, va bu shunchaki bittaga ko'p degani emas. Uchinchi son tik o'qqa biriktirilgan, va uni almashtirib bo'lmaydi: o'sha sonlar boshqa tartibda boshqa nuqta beradi. Birinchi ikkitasi proyeksiyani manzillaydi, proyeksiya esa blokning asosiy tekshiruvi, chunki u xatoni har qanday hisobdan oldin ushlaydi. Yozuvdagi nollar bo'sh joy emas, ma'lumot: bitta nol nuqtani tekislikka qo'yadi, ikkitasi o'qqa, uchtasi koordinatalar boshiga. Pastki tekislikkacha masofa to'g'ridan to'g'ri uchinchi sondan o'qiladi, tik o'qqacha esa birinchi ikkitasi bo'yicha hisoblanadi. Keyin vektor paydo bo'ladi, va unda ham uchlik bo'ladi, lekin u manzilni emas, siljishni bildiradi. | Three are needed, and that is not simply one more. The third number is tied to the vertical axis and cannot be moved: the same numbers in another order give another point. The first two address the projection, and the projection is the main check of the block, because it catches a mistake before any counting. The zeros in a reading are not empty places but information: one zero puts the point into a plane, two onto an axis, three at the origin. The distance to the lower plane is read straight from the third number, and the distance to the vertical axis is computed from the first two. Next the vector will appear, and it will also have a triple, but that triple will mean a shift, not an address. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `2` |
| `hook.b` | `3` |
| `proved` | `3` |
| `law` | `A₁ (x; y; 0)` |
| `sheet.1` | `A (x; y; z)` |
| `sheet.2` | `A₁ (x; y; 0)` |
| `sheet.3` | `d(A, Oxy) = z` |
| `sheet.4` | `(0; 3; 0) ∈ Oy` |
| `sheet.5` | `(2; 3; 4) ≠ (4; 3; 2)` |
