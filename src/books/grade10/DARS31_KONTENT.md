# Урок 31 — Параллельность двух плоскостей · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS30_KONTENT.md`.

Скелет: в чате 27.08.2026. Опора в учебнике: геометрия 2022, §14, стр. 103–108
(`FAZODA TEKISLIKLARNING O'ZARO JOYLASHUVI`).

**Зачем урок.** В уроке 29 признак параллельности плоскостей шёл карточкой правила, своего
экрана-объяснения не имел. В планах 7–9 и 11 классов темы нет.

**Главное решение урока.** В признаке два требования к прямым, и оба теряют: прямых должно
быть **две** и они должны **пересекаться**. Поэтому разграничение (экран 4) построено на
гранях `ABCD` и `BCC₁B₁`: пара параллельных прямых там честно есть, `AD ∥ B₁C₁` (проверено
счётом: оба ребра идут в одном направлении) — а плоскости всё равно пересекаются по ребру
`BC`. Одной пары мало, и это же ловушка экрана 12.

**Сцена одна — куб.** Плоскости берутся гранями: два основания параллельны, основание и
боковая грань пересекаются по ребру. Прибор 6A, поворот делает ученик.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины из
учебника дословно: `parallel tekisliklar`, `alomat`, `kesishuvchi to'g'ri chiziqlar`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДВЕ ПЛОСКОСТИ | IKKI TEKISLIK | TWO PLANES |
| `title` | Пересекутся или нет | Kesishadi yoki yo'q | They will meet, or they will not |
| `row.a.name` | пересекутся по прямой | to'g'ri chiziq bo'ylab kesishadi | they meet along a line |
| `row.b.name` | не пересекутся никогда | hech qachon kesishmaydi | they never meet |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену. | Javobingiz yozib olindi. Endi sahnani buramiz. | Your answer is saved. Now we will turn the scene. |
| `audio.mount` | Две закрашенные грани куба. Это две плоскости нашего вопроса. | Kubning ikki bo'yalgan yog'i. Bu bizning savolimizning ikki tekisligi. | Two shaded faces of the cube. These are the two planes of our question. |
| `audio.r1` | Первая запись говорит, что общая прямая у них есть: на чертеже края граней сходятся. | Birinchi yozuv ularning umumiy chizig'i bor deydi: chizmada yoqlarning chetlari birlashadi. | The first reading says they do have a common line: on the drawing the edges of the faces come together. |
| `audio.r2` | Вторая говорит, что общих точек нет вовсе, и никакое продолжение их не даст. | Ikkinchisi umumiy nuqta umuman yo'q deydi, va hech qanday davom ettirish bermaydi. | The second says there are no common points at all, and no extension will give any. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCD` · `A₁B₁C₁D₁` |
| `row.a.value` | `1` |
| `row.b.value` | `0` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | THE BASICS |
| `title` | Три коротких перед началом | Boshlashdan oldin uchta qisqa savol | Three short ones before we start |
| `q1.prompt` | Две плоскости имеют общую точку. Что у них есть ещё по аксиоме? | Ikki tekislikning umumiy nuqtasi bor. Aksioma bo'yicha ularda yana nima bor? | Two planes have a common point. What else do they have by the axiom? |
| `q1.a` [верно] | общая прямая | umumiy to'g'ri chiziq | a common line |
| `q1.b` | только эта точка | faqat shu nuqta | only that point |
| `q1.b.hint` | Аксиома даёт целую прямую: у плоскостей одна общая точка не бывает. | Aksioma butun chiziq beradi: tekisliklarning bitta umumiy nuqtasi bo'lmaydi. | The axiom gives a whole line: planes never share just one point. |
| `q1.c` | общая плоскость | umumiy tekislik | a common plane |
| `q1.c.hint` | Общая плоскость означала бы, что они совпали. | Umumiy tekislik ular ustma-ust tushgani bo'lardi. | A common plane would mean they coincide. |
| `q1.d` | ничего | hech narsa | nothing |
| `q1.d.hint` | Точка уже есть, значит «ничего» отпадает. | Nuqta bor, demak «hech narsa» chiqib ketadi. | A point is already there, so nothing is not an option. |
| `q2.prompt` | Прямые AB и AD куба: они пересекаются? | Kubning AB va AD chiziqlari: ular kesishadimi? | The lines AB and AD of the cube: do they meet? |
| `q2.a` [верно] | да, в вершине A | ha, A uchida | yes, at the vertex A |
| `q2.b` | нет, они параллельны | yo'q, ular parallel | no, they are parallel |
| `q2.b.hint` | Параллельные не имеют общих точек, а у этих общая вершина. | Parallellarning umumiy nuqtasi yo'q, bularning umumiy uchi bor. | Parallel lines share no point, and these share a vertex. |
| `q2.c` | нет, они скрещиваются | yo'q, ular ayqash | no, they are skew |
| `q2.c.hint` | Скрещивающиеся не лежат в одной плоскости, а эти две в основании. | Ayqashlar bir tekislikda yotmaydi, bu ikkisi esa asosda. | Skew lines lie in no common plane, and these two are in the base. |
| `q2.d` | зависит от чертежа | chizmaga bog'liq | it depends on the drawing |
| `q2.d.hint` | Общая вершина есть на любом чертеже. | Umumiy uch har qanday chizmada bor. | The common vertex is there on any drawing. |
| `q3.prompt` | Прямая параллельна плоскости. Сколько у них общих точек? | Chiziq tekislikka parallel. Ularning nechta umumiy nuqtasi bor? | A line is parallel to a plane. How many common points have they? |
| `q3.a` [верно] | ни одной | birorta ham yo'q | none |
| `q3.b` | одна | bitta | one |
| `q3.b.hint` | Одна общая точка это пересечение. | Bitta umumiy nuqta bu kesishish. | One common point is an intersection. |
| `q3.c` | две | ikkita | two |
| `q3.c.hint` | Через две точки прямая легла бы в плоскость. | Ikki nuqta orqali chiziq tekislikka yotib qolardi. | Through two points the line would lie in the plane. |
| `q3.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.d.hint` | Бесконечно много у лежащей прямой, это прошлый урок. | Cheksiz ko'p yotgan chiziqda, bu o'tgan dars. | Infinitely many belongs to a lying line, that was the last lesson. |
| `audio.mount` | Три вопроса на то, что уже было. Все три работают в признаке. | Bo'lib o'tgan narsalar uchun uchta savol. Uchalasi alomatda ishlaydi. | Three questions on what has already been. All three work in the criterion. |
| `q1.done` | Общая точка тянет за собой целую прямую. | Umumiy nuqta butun chiziqni ergashtiradi. | A common point drags a whole line behind it. |
| `q2.done` | Пересекающиеся прямые понадобятся в признаке. | Kesishuvchi chiziqlar alomatda kerak bo'ladi. | Intersecting lines will be needed in the criterion. |
| `q3.done` | А это прошлый урок, и он тоже пойдёт в дело. | Bu esa o'tgan dars, u ham ishga tushadi. | And that was the last lesson, it will also come into play. |

---

## Экран 3 · `explain1` · ответ `number` · тег `ploskost-po-chertezhu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПОВЕРНИ СЦЕНУ | SAHNANI BURING | TURN THE SCENE |
| `title` | Края граней на чертеже сходятся | Chizmada yoqlarning chetlari birlashadi | On the drawing the edges of the faces come together |
| `show.1.1` | На этом ракурсе края двух граней почти совпали | Bu rakursda ikki yoqning chetlari deyarli mos tushdi | At this angle the edges of the two faces nearly coincide |
| `show.1.2` | кажется, что у плоскостей есть общая прямая | tekisliklarning umumiy chizig'i bordek ko'rinadi | it looks as if the planes have a common line |
| `show.1.3` | но это снова проекция на экран | lekin bu yana ekranga proyeksiya | but this is again the projection onto the screen |
| `show.2.1` | Сцена повернулась | Sahna burildi | The scene has turned |
| `show.2.2` | между гранями видна высота куба | yoqlar orasida kubning balandligi ko'rinadi | between the faces the height of the cube is visible |
| `show.2.3` | и она не пропадает ни при каком повороте | va u hech qanday burilishda yo'qolmaydi | and it does not vanish at any turn |
| `audio.mount` | Два основания куба. Поверни сцену кнопками ниже. | Kubning ikki asosi. Sahnani pastdagi tugmalar bilan buring. | The two bases of the cube. Turn the scene with the buttons below. |
| `audio.spin*` | Смотри на просвет между гранями. Общей прямой у них нет ни на одном ракурсе. | Yoqlar orasidagi oraliqni kuzatib turing. Ularning umumiy chizig'i birorta rakursda yo'q. | Watch the gap between the faces. They have no common line at any angle. |
| `audio.work` | Учебник говорит коротко: не пересекающиеся плоскости называются параллельными. | Darslik qisqa aytadi: kesishmaydigan tekisliklar parallel deb ataladi. | The textbook puts it briefly: planes that do not intersect are called parallel. |
| `work.prompt` | Сколько общих точек у двух основаниий куба? | Kubning ikki asosining nechta umumiy nuqtasi bor? | How many common points have the two bases of the cube? |
| `work.ok` | Верно. Ни одной, и это определение параллельности плоскостей. | To'g'ri. Birorta ham yo'q, va bu tekisliklar parallelligining ta'rifi. | Correct. None, and that is the definition of parallel planes. |
| `work.hint.1` | Поверни сцену и поищи общую точку. | Sahnani buring va umumiy nuqtani izlang. | Turn the scene and look for a common point. |
| `work.hint.2` | Между гранями всё время стоит высота куба. | Yoqlar orasida doim kubning balandligi turadi. | The height of the cube stands between the faces all the time. |
| `work.hint.3` | Значит общих точек ноль. | Demak umumiy nuqta nol. | So the common points are zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 4 · `explain2` · ответ `number` · тег `odna-para-dostatochno`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОДНОЙ ПАРЫ МАЛО | BIR JUFTLIK KAM | ONE PAIR IS NOT ENOUGH |
| `title` | Пара есть, а плоскости пересекаются | Juftlik bor, tekisliklar esa kesishadi | The pair is there, and the planes still meet |
| `show.1.1` | Основание и боковая грань | Asos va yon yoq | The base and a side face |
| `show.1.2` | в них есть пара параллельных прямых: AD и B₁C₁ параллельны | ularda parallel juftlik bor: AD va B₁C₁ parallel | they do have a parallel pair: AD and B₁C₁ are parallel |
| `show.1.3` | одной пары признаку не хватает | alomatga bir juftlik yetmaydi | one pair is not enough for the criterion |
| `show.2.1` | Эти две грани пересекаются по ребру BC | Bu ikki yoq BC qirrasi bo'ylab kesishadi | These two faces meet along the edge BC |
| `show.2.2` | значит параллельными они не являются | demak ular parallel emas | so they are not parallel |
| `show.2.3` | признак требует ДВЕ пересекающиеся прямые | alomat IKKI kesishuvchi chiziqni talab qiladi | the criterion requires TWO intersecting lines |
| `audio.mount` | Возьмём основание и боковую грань. Одна пара параллельных прямых в них найдётся. | Asos va yon yoqni olamiz. Ularda bir juft parallel chiziq topiladi. | Take the base and a side face. One pair of parallel lines will be found in them. |
| `audio.edge*` | Смотри на ребро, по которому эти грани сходятся. Общая прямая у них есть. | Bu yoqlar birlashadigan qirraga qarang. Ularning umumiy chizig'i bor. | Look at the edge where these faces come together. They do have a common line. |
| `audio.work` | Одной пары мало. Признак называет две прямые, и они должны пересекаться. | Bir juftlik kam. Alomat ikki chiziqni ataydi, va ular kesishishi kerak. | One pair is not enough. The criterion names two lines, and they must intersect. |
| `work.prompt` | Сколько общих рёбер у граней ABCD и BCC₁B₁? | ABCD va BCC₁B₁ yoqlarining nechta umumiy qirrasi bor? | How many edges do the faces ABCD and BCC₁B₁ share? |
| `work.ok` | Верно. Одно, это ребро BC. Общее ребро значит общая прямая, а параллельные плоскости общих точек не имеют. | To'g'ri. Bitta -- BC qirrasi. Umumiy qirra umumiy chiziq degani, parallel tekisliklarning esa umumiy nuqtasi yo'q. | Correct. One: the edge BC. A shared edge means a shared line, and parallel planes have no common points. |
| `work.hint.1` | Найди ребро, которое принадлежит обеим граням. | Ikkala yoqqa ham tegishli qirrani toping. | Find the edge belonging to both faces. |
| `work.hint.2` | Обе грани содержат вершины B и C. | Ikkala yoq ham B va C uchlarini o'z ichiga oladi. | Both faces contain the vertices B and C. |
| `work.hint.3` | Значит общее ребро одно, это BC. | Demak umumiy qirra bitta, bu BC. | So there is one shared edge, and it is BC. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `pryamye-ne-peresekayutsya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДВЕ ПЕРЕСЕКАЮЩИЕСЯ | IKKI KESISHUVCHI | TWO INTERSECTING |
| `title` | Прямые должны пересекаться | Chiziqlar kesishishi kerak | The lines have to intersect |
| `show.1.1` | В основании берём AB и AD | Asosda AB va AD ni olamiz | In the base we take AB and AD |
| `show.1.2` | они пересекаются в вершине A | ular A uchida kesishadi | they intersect at the vertex A |
| `show.1.3` | и задают два разных направления | va ikki xil yo'nalish beradi | and they set two different directions |
| `show.2.1` | В верхней грани им отвечают A₁B₁ и A₁D₁ | Yuqori yoqda ularga A₁B₁ va A₁D₁ mos keladi | in the top face A₁B₁ and A₁D₁ answer to them |
| `show.2.2` | каждая параллельна своей | har biri o'ziga mos bo'lganiga parallel | each is parallel to its own |
| `show.2.3` | по признаку плоскости параллельны | alomat bo'yicha tekisliklar parallel | by the criterion the planes are parallel |
| `audio.mount` | Теперь признак целиком. В одной плоскости две пересекающиеся прямые. | Endi alomat butunlay. Bir tekislikda ikki kesishuvchi chiziq. | Now the whole criterion. Two intersecting lines in one plane. |
| `audio.pair*` | Смотри, как подсвечиваются пары. Каждой прямой снизу отвечает своя сверху. | Juftliklar qanday bo'yalishini kuzatib turing. Pastdagi har chiziqqa tepada o'zining mosi bor. | Watch how the pairs light up. Each line below has its own counterpart above. |
| `audio.work` | Двух параллельных прямых было бы мало: они задают одно направление. | Ikki parallel chiziq kam bo'lardi: ular bitta yo'nalish beradi. | Two parallel lines would not be enough: they set only one direction. |
| `work.prompt` | Сколько пар параллельных прямых нужно признаку? | Alomatga nechta juft parallel chiziq kerak? | How many pairs of parallel lines does the criterion need? |
| `work.ok` | Верно. Две, и прямые внутри плоскости должны пересекаться. | To'g'ri. Ikkita, va tekislik ichidagi chiziqlar kesishishi kerak. | Correct. Two, and the lines inside the plane must intersect. |
| `work.hint.1` | Посмотри на подсветку: сколько пар подсвечено? | Bo'yalishga qarang: nechta juftlik bo'yalgan? | Look at the highlighting: how many pairs are lit? |
| `work.hint.2` | Одна пара уже была на прошлом экране и не помогла. | Bir juftlik o'tgan ekranda bo'ldi va yordam bermadi. | One pair was on the previous screen and did not help. |
| `work.hint.3` | Признак называет две пары. | Alomat ikki juftlikni ataydi. | The criterion names two pairs. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 6 · `explain4` · ответ `number` · тег `odna-para-dostatochno`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Признак на новом случае | Yangi holatda alomat | The criterion on a new case |
| `show.1.1` | У куба шесть граней | Kubning oltita yog'i bor | A cube has six faces |
| `show.1.2` | грани разбиваются на три пары противоположных | yoqlar uchta qarama-qarshi juftlikka bo'linadi | the faces split into three pairs of opposite ones |
| `show.1.3` | внутри пары плоскости параллельны | juftlik ichida tekisliklar parallel | inside a pair the planes are parallel |
| `show.2.1` | Любые две грани из разных пар | Turli juftlikdagi har qanday ikki yoq | any two faces from different pairs |
| `show.2.2` | имеют общее ребро и пересекаются | umumiy qirraga ega va kesishadi | share an edge and intersect |
| `show.2.3` | так работает признак на параллелепипеде из учебника | darslikdagi parallelepipedda alomat shunday ishlaydi | that is how the criterion works on the textbook parallelepiped |
| `audio.mount` | Теперь сам. Признак тот же, случай новый. | Endi o'zingiz. Alomat o'sha, hol yangi. | Now on your own. The same criterion, a new case. |
| `audio.faces*` | Грани перебираются парами. Смотри, где есть общее ребро. | Yoqlar juftlab ko'rib chiqiladi. Umumiy qirra qayerda borligini kuzatib turing. | The faces are gone through in pairs. Watch where a common edge appears. |
| `audio.work` | Считай пары граней, у которых общих точек нет вовсе. | Umumiy nuqtasi umuman yo'q yoq juftliklarini sanang. | Count the pairs of faces with no common point at all. |
| `work.prompt` | Сколько пар параллельных граней у куба? | Kubning nechta juft parallel yog'i bor? | How many pairs of parallel faces has a cube? |
| `work.ok` | Верно. Три пары: пол и потолок, и две пары противоположных стен. | To'g'ri. Uch juftlik: pol va shift, va ikki juft qarama-qarshi devor. | Correct. Three pairs: the floor and the ceiling, and two pairs of opposite walls. |
| `work.hint.1` | Возьми грань и найди ту, что не имеет с ней общего ребра. | Bir yoqni oling va u bilan umumiy qirrasi yo'q yoqni toping. | Take a face and find the one with no common edge with it. |
| `work.hint.2` | У каждой грани такая ровно одна. | Har yoqda bunday yoq aynan bitta. | Each face has exactly one such face. |
| `work.hint.3` | Шесть граней делятся на пары: их три. | Oltita yoq juftlikka bo'linadi: ular uchta. | Six faces split into pairs: there are three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `3` |

---

## Экран 7 · `explain5` · ответ `number` · тег `ploskosti-parallelny-vsem`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE |
| `title` | Плоскости параллельны — прямые не обязательно | Tekisliklar parallel, chiziqlar shart emas | The planes are parallel, the lines need not be |
| `show.1.1` | Основания параллельны, это уже доказано | Asoslar parallel, bu isbotlangan | The bases are parallel, that is already proved |
| `show.1.2` | в них взяты две прямые: AB снизу и A₁D₁ сверху | ularda ikki chiziq olingan: pastda AB, tepada A₁D₁ | two lines are taken in them: AB below and A₁D₁ above |
| `show.1.3` | параллельны ли они друг другу | ular bir-biriga parallelmi | are they parallel to each other |
| `show.2.1` | Общей плоскости у этой пары нет | Bu juftlikning umumiy tekisligi yo'q | this pair has no common plane |
| `show.2.2` | значит они скрещиваются, а не параллельны | demak ular ayqash, parallel emas | so they are skew, not parallel |
| `show.2.3` | параллельность плоскостей этого не запрещает | tekisliklar parallelligi buni taqiqlamaydi | the parallelism of the planes does not forbid it |
| `audio.mount` | Плоскости параллельны. Это не значит, что любая прямая одной параллельна любой прямой другой. | Tekisliklar parallel. Bu birining har chizig'i ikkinchisining har chizig'iga parallel degani emas. | The planes are parallel. That does not mean any line of one is parallel to any line of the other. |
| `audio.skew*` | Смотри на подсвеченную пару. Общая плоскость для них не проводится. | Bo'yalgan juftlikka qarang. Ular uchun umumiy tekislik o'tkazilmaydi. | Look at the highlighted pair. No common plane can be drawn for them. |
| `audio.work` | Посчитай, сколько прямых верхней грани параллельны нижнему ребру AB. | Yuqori yoqning nechta chizig'i pastdagi AB qirrasiga parallel ekanini hisoblang. | Count how many lines of the top face are parallel to the bottom edge AB. |
| `work.prompt` | Сколько рёбер верхней грани параллельны ребру AB? | Yuqori yoqning nechta qirrasi AB qirrasiga parallel? | How many edges of the top face are parallel to the edge AB? |
| `work.ok` | Верно. Два: A₁B₁ и D₁C₁. Другие два с ним скрещиваются. | To'g'ri. Ikkita: A₁B₁ va D₁C₁. Qolgan ikkitasi u bilan ayqash. | Correct. Two: A₁B₁ and D₁C₁. The other two are skew to it. |
| `work.hint.1` | Найди рёбра верхней грани того же направления. | Yuqori yoqning o'sha yo'nalishdagi qirralarini toping. | Find the top edges of the same direction. |
| `work.hint.2` | Два ребра идут вдоль, два поперёк. | Ikki qirra bo'ylab, ikkitasi ko'ndalang. | Two edges run along, two across. |
| `work.hint.3` | Вдоль идут A₁B₁ и D₁C₁. | Bo'ylab A₁B₁ va D₁C₁ boradi. | Along run A₁B₁ and D₁C₁. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `pryamye-ne-peresekayutsya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `title` | Определение и признак | Ta'rif va alomat | The definition and the criterion |
| `probe.question` | Какими должны быть две прямые в плоскости? | Tekislikdagi ikki chiziq qanday bo'lishi kerak? | What must the two lines in the plane be? |
| `probe.a` [верно] | пересекающимися | kesishuvchi | intersecting |
| `probe.b` | параллельными | parallel | parallel |
| `probe.b.hint` | Две параллельные задают одно направление, и плоскость вокруг него ещё поворачивается. | Ikki parallel bitta yo'nalish beradi, va tekislik uning atrofida hali buriladi. | Two parallel lines set one direction, and the plane still turns around it. |
| `rule.lawLabel` | Две плоскости | Ikki tekislik | Two planes |
| `rule.lines.1` | Стр. 103. Не пересекающиеся плоскости называются параллельными. | 103-bet. Kesishmaydigan tekisliklar parallel tekisliklar deb ataladi. | Page 103. Planes that do not intersect are called parallel. |
| `rule.lines.2` | Стр. 103, теорема 3.7. Две пересекающиеся прямые одной плоскости параллельны двум прямым другой — плоскости параллельны. | 103-bet, 3.7-teorema. Bir tekislikdagi kesishuvchi ikki chiziq ikkinchisidagi ikki chiziqqa parallel bo'lsa, tekisliklar parallel. | Page 103, theorem 3.7. Two intersecting lines of one plane parallel to two lines of the other make the planes parallel. |
| `rule.lines.3` | Стр. 103. Пол и потолок комнаты, противоположные стены — примеры учебника. | 103-bet. Xonaning poli va shifti, qarama-qarshi devorlar -- darslik misollari. | Page 103. The floor and ceiling of a room, opposite walls: the textbook examples. |
| `audio.mount` | Прежде чем открыть карточку, ответь на один вопрос. | Kartochkani ochishdan oldin bitta savolga javob bering. | Before the card opens, answer one question. |
| `audio.rule*` | Карточка говорит словами учебника. В признаке два требования, и второе про пересечение. | Kartochka darslik so'zlari bilan gapiradi. Alomatda ikki talab bor, ikkinchisi kesishish haqida. | The card speaks in the words of the textbook. The criterion has two demands, and the second is about intersecting. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a ∩ b = A,   a ∥ a₁,   b ∥ b₁   ⇒   α ∥ β` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `ploskost-po-chertezhu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЕТЫРЕ ПАРЫ | TO'RT JUFTLIK | FOUR PAIRS |
| `title` | Соедини пару граней с её случаем | Yoq juftligini o'z holi bilan biriktiring | Match each pair of faces with its case |
| `match.prompt` | Пары граней одного куба | Bitta kubning yoq juftliklari | Pairs of faces of one cube |
| `match.a` | параллельны | parallel | parallel |
| `match.b` | пересекаются по BC | BC bo'ylab kesishadi | meet along BC |
| `match.c` | пересекаются по AA₁ | AA₁ bo'ylab kesishadi | meet along AA₁ |
| `match.d` | это одна и та же плоскость | bu bir xil tekislik | this is one and the same plane |
| `match.ok` | Все четыре верно. Общее ребро сразу отвечает на вопрос. | To'rttasi ham to'g'ri. Umumiy qirra savolga darrov javob beradi. | All four correct. A shared edge answers the question at once. |
| `audio.mount` | Четыре пары граней одного куба. Ищи общее ребро. | Bitta kubning to'rt juft yog'i. Umumiy qirrani izlang. | Four pairs of faces of one cube. Look for a common edge. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `ABCD, A₁B₁C₁D₁` · `ABCD, BCC₁B₁` · `ABB₁A₁, ADD₁A₁` · `ABCD, ABC` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `pryamye-ne-peresekayutsya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMLAB | STEP BY STEP |
| `title` | Докажи по признаку | Alomat bo'yicha isbotlang | Prove it by the criterion |
| `order.prompt` | Расставь по порядку | Tartib bilan joylashtiring | Put them in order |
| `order.s1` | в основании берём две пересекающиеся прямые | asosda ikki kesishuvchi chiziq olamiz | in the base we take two intersecting lines |
| `order.s2` | каждой находим параллельную в верхней грани | har biriga yuqori yoqda parallel topamiz | for each we find a parallel one in the top face |
| `order.s3` | по признаку плоскости параллельны | alomat bo'yicha tekisliklar parallel | by the criterion the planes are parallel |
| `order.ok` | Верно. Сначала пересекающиеся прямые, потом их пары, и только потом вывод. | To'g'ri. Avval kesishuvchi chiziqlar, keyin juftliklari, keyin xulosa. | Correct. First the intersecting lines, then their pairs, and only then the conclusion. |
| `order.bad` | Порядок другой. Пары ищутся уже после того, как выбраны прямые. | Tartib boshqacha. Juftliklar chiziqlar tanlangandan keyin izlanadi. | The order is different. The pairs are looked for after the lines are chosen. |
| `audio.mount` | Докажем, что основания куба параллельны. Признак называет две пересекающиеся прямые. | Kubning asoslari parallel ekanini isbotlaymiz. Alomat ikki kesishuvchi chiziqni ataydi. | Let us prove the bases of the cube are parallel. The criterion names two intersecting lines. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `ABCD` · `A₁B₁C₁D₁` |
| `order.mark` | `ABCD ∥ A₁B₁C₁D₁` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Без прибора | Asbobsiz | No instrument |
| `order.prompt` | Расставь записи в том порядке, в каком они появляются в доказательстве | Yozuvlarni isbotda paydo bo'lish tartibida joylashtiring | Put the lines in the order they appear in the proof |
| `order.title` | Порядок записей | Yozuvlar tartibi | The order of the lines |
| `order.ok` | Верно. Условия сверху, вывод внизу. | To'g'ri. Shartlar tepada, xulosa pastda. | Correct. The conditions on top, the conclusion below. |
| `order.bad` | Не тот порядок. Вывод пишется последним. | Tartib to'g'ri emas. Xulosa oxirida yoziladi. | Wrong order. The conclusion is written last. |
| `task.prompt` | Сколько граней куба пересекают плоскость ABCD? | Kubning nechta yog'i ABCD tekisligini kesib o'tadi? | How many faces of the cube meet the plane ABCD? |
| `task.ok` | Верно. Четыре боковых грани, каждая по своему ребру основания. | To'g'ri. To'rt yon yoq, har biri asosning o'z qirrasi bo'ylab. | Correct. The four side faces, each along its own base edge. |
| `task.hint.1` | Само основание не считаем: это та же плоскость. | Asosning o'zini sanamaymiz: bu o'sha tekislik. | We do not count the base itself: it is the same plane. |
| `task.hint.2` | Верхняя грань основанию параллельна. | Yuqori yoq asosga parallel. | The top face is parallel to the base. |
| `task.hint.3` | Остаются боковые, их четыре. | Yon yoqlar qoladi, ular to'rtta. | The side faces remain, and there are four. |
| `audio.mount` | Прибора здесь нет. Сначала порядок записей, потом ответ. | Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob. | There is no instrument here. First the order of the lines, then the answer. |
| `audio.next` | Теперь сама задача. Пиши число. | Endi masalaning o'zi. Sonni yozing. | Now the task itself. Write the number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.answer` | `4` |
| `order.items` | `AB ∩ AD = A` · `AB ∥ A₁B₁` · `AD ∥ A₁D₁` · `ABCD ∥ A₁B₁C₁D₁` |
| `order.answer` | `AB ∩ AD = A  AB ∥ A₁B₁  AD ∥ A₁D₁  ABCD ∥ A₁B₁C₁D₁` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Все шаги верны, вывод неверен | Hamma qadam to'g'ri, xulosa noto'g'ri | Every step is right, the conclusion is wrong |
| `hint.r1` | Верно: эти два ребра действительно параллельны. | To'g'ri: bu ikki qirra haqiqatan parallel. | Correct: these two edges really are parallel. |
| `hint.r2` | Верно: каждое лежит в своей грани. | To'g'ri: har biri o'z yog'ida yotadi. | Correct: each lies in its own face. |
| `hint.r3` | Тоже верно, пара найдена честно. | Bu ham to'g'ri, juftlik halol topilgan. | Also correct, the pair was found honestly. |
| `proof` | Ошибка в последней строке. Признаку нужны ДВЕ пересекающиеся прямые, а найдена одна пара. | Xato oxirgi satrda. Alomatga IKKI kesishuvchi chiziq kerak, topilgani esa bir juftlik. | The mistake is in the last line. The criterion needs TWO intersecting lines, and only one pair was found. |
| `entry.prompt` | Сколько пар параллельных прямых требует признак? | Alomat nechta juft parallel chiziqni talab qiladi? | How many pairs of parallel lines does the criterion require? |
| `entry.ok` | Верно. Две, и прямые внутри плоскости должны пересекаться. | To'g'ri. Ikkita, va tekislik ichidagi chiziqlar kesishishi kerak. | Correct. Two, and the lines inside the plane must intersect. |
| `entry.hint.1` | Посмотри на карточку правила. | Qoida kartochkasiga qarang. | Look at the rule card. |
| `entry.hint.2` | Одной пары мало: это было на экране четыре. | Bir juftlik kam: bu to'rtinchi ekranda bo'ldi. | One pair is not enough: that was on screen four. |
| `entry.hint.3` | Признак называет две прямые в каждой плоскости. | Alomat har tekislikda ikki chiziqni ataydi. | The criterion names two lines in each plane. |
| `audio.mount` | Доказательство выписано в четыре строки. Найди ту, где появилась ошибка. | Isbot to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping. | The proof is written in four lines. Find the one where the mistake appeared. |
| `audio.next` | Теперь запиши число, которое требует признак. | Endi alomat talab qilgan sonni yozing. | Now write the number the criterion requires. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `AD ∥ B₁C₁` |
| `row.r2` | `AD ⊂ ABCD,   B₁C₁ ⊂ BCC₁B₁` |
| `row.r3` | `AD ∥ B₁C₁ — ✔` |
| `row.r4` | `ABCD ∥ BCC₁B₁` |
| `answerId` | `r4` |
| `entry.answer` | `2` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБРАТНАЯ ЗАДАЧА | TESKARI MASALA | THE REVERSE TASK |
| `title` | Теперь ищешь ты | Endi siz izlaysiz | Now you do the searching |
| `entry.prompt` | Сколько граней куба параллельны грани ABCD? | Kubning nechta yog'i ABCD yog'iga parallel? | How many faces of the cube are parallel to the face ABCD? |
| `entry.ok` | Верно. Одна: у каждой грани параллельная ровно одна. | To'g'ri. Bitta: har yoqda parallel yoq aynan bitta. | Correct. One: each face has exactly one parallel face. |
| `entry.hint.1` | Параллельная грань не имеет с данной общего ребра. | Parallel yoqning berilgani bilan umumiy qirrasi yo'q. | A parallel face has no common edge with the given one. |
| `entry.hint.2` | Четыре боковых грани общее ребро имеют. | To'rt yon yoqning umumiy qirrasi bor. | The four side faces do have a common edge. |
| `entry.hint.3` | Остаётся верхняя грань, она одна. | Yuqori yoq qoladi, u bitta. | The top face remains, and it is the only one. |
| `multi.prompt` | Отметь все пары граней, которые параллельны | Parallel bo'lgan hamma yoq juftligini belgilang | Mark every pair of faces that are parallel |
| `multi.title` | Две из четырёх | To'rttadan ikkitasi | Two out of four |
| `multi.c.hint` | У этих граней общее ребро BC, значит они пересекаются. | Bu yoqlarning umumiy BC qirrasi bor, demak ular kesishadi. | These faces share the edge BC, so they intersect. |
| `multi.d.hint` | У этих общее ребро AA₁. | Bularning umumiy AA₁ qirrasi bor. | These share the edge AA₁. |
| `multi.ok` | Верно. Параллельны те пары, у которых общего ребра нет. | To'g'ri. Umumiy qirrasi yo'q juftliklar parallel. | Correct. Parallel are the pairs with no common edge. |
| `audio.mount` | До этого пары давали тебе. Теперь перебираешь грани сам. | Bungacha juftliklarni sizga berardilar. Endi yoqlarni o'zingiz ko'rib chiqasiz. | Until now the pairs were given to you. Now you go through the faces yourself. |
| `audio.work` | Обрати внимание: у шести граней ровно три параллельных пары, и это проверка суммой. | E'tibor bering: oltita yoqda aynan uch parallel juftlik bor, va bu yig'indi bilan tekshiruv. | Notice: six faces give exactly three parallel pairs, and that is a check by the sum. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `ABCD` |
| `entry.answer` | `1` |
| `multi.a` [верно] | `ABCD, A₁B₁C₁D₁` |
| `multi.b` [верно] | `ABB₁A₁, DCC₁D₁` |
| `multi.c` | `ABCD, BCC₁B₁` |
| `multi.d` | `ABB₁A₁, ADD₁A₁` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `odna-para-dostatochno`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | THE BLITZ |
| `title` | Четыре вопроса подряд | Ketma-ket to'rtta savol | Four questions in a row |
| `q1.prompt` | Две плоскости параллельны. Сколько у них общих точек? | Ikki tekislik parallel. Ularning nechta umumiy nuqtasi bor? | Two planes are parallel. How many common points have they? |
| `q1.a` [верно] | ни одной | birorta ham yo'q | none |
| `q1.b` | одна | bitta | one |
| `q1.b.hint` | Одна общая точка тянет за собой целую прямую, это аксиома. | Bitta umumiy nuqta butun chiziqni ergashtiradi, bu aksioma. | One common point drags a whole line behind it; that is the axiom. |
| `q1.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.c.hint` | Бесконечно много у пересекающихся: у них общая прямая. | Cheksiz ko'p kesishuvchilarda: ularning umumiy chizig'i bor. | Infinitely many belongs to intersecting ones: they share a line. |
| `q1.d` | зависит от ракурса | rakursga bog'liq | it depends on the angle |
| `q1.d.hint` | Ракурс меняет чертёж, а не сцену. | Rakurs chizmani o'zgartiradi, sahnani emas. | The angle changes the drawing, not the scene. |
| `q2.prompt` | Признаку нужны прямые… | Alomatga kerak bo'lgan chiziqlar... | The criterion needs lines that are... |
| `q2.a` [верно] | две пересекающиеся в каждой плоскости | har tekislikda ikki kesishuvchi | two intersecting in each plane |
| `q2.b` | одна в каждой плоскости | har tekislikda bitta | one in each plane |
| `q2.b.hint` | Одной пары мало: на экране четыре плоскости пересекались. | Bir juftlik kam: to'rtinchi ekranda tekisliklar kesishardi. | One pair is not enough: on screen four the planes did intersect. |
| `q2.c` | две параллельные в каждой | har birida ikki parallel | two parallel in each |
| `q2.c.hint` | Две параллельные дают одно направление, второго нет. | Ikki parallel bitta yo'nalish beradi, ikkinchisi yo'q. | Two parallel lines give one direction, the second is missing. |
| `q2.d` | все прямые плоскости | tekislikning hamma chizig'i | all lines of the plane |
| `q2.d.hint` | Столько проверять не надо: двух пересекающихся достаточно. | Bunchasini tekshirish shart emas: ikki kesishuvchi yetadi. | There is no need to check that many: two intersecting ones suffice. |
| `q3.prompt` | Плоскости параллельны. Прямая одной и прямая другой… | Tekisliklar parallel. Birining chizig'i va ikkinchisining chizig'i... | The planes are parallel. A line of one and a line of the other... |
| `q3.a` [верно] | могут скрещиваться | ayqash bo'lishi mumkin | may be skew |
| `q3.a.ok` | Да: параллельность плоскостей про плоскости, а не про каждую пару прямых. | Ha: tekisliklar parallelligi tekisliklar haqida, har juft chiziq haqida emas. | Yes: parallel planes are about the planes, not about every pair of lines. |
| `q3.b` | всегда параллельны | doim parallel | are always parallel |
| `q3.b.hint` | Проверь на кубе: AB и A₁D₁ скрещиваются. | Kubda tekshiring: AB va A₁D₁ ayqash. | Check on the cube: AB and A₁D₁ are skew. |
| `q3.c` | всегда пересекаются | doim kesishadi | always intersect |
| `q3.c.hint` | Пересечься они не могут: плоскости общих точек не имеют. | Ular kesishishi mumkin emas: tekisliklarning umumiy nuqtasi yo'q. | They cannot intersect: the planes share no point. |
| `q3.d` | всегда перпендикулярны | doim perpendikulyar | are always perpendicular |
| `q3.d.hint` | Перпендикулярность тут ни при чём. | Perpendikulyarlikning bunga aloqasi yo'q. | Perpendicularity has nothing to do with it. |
| `q4.prompt` | Сколько пар параллельных граней у куба? | Kubning nechta juft parallel yog'i bor? | How many pairs of parallel faces has a cube? |
| `q4.a` [верно] | три | uchta | three |
| `q4.b` | шесть | oltita | six |
| `q4.b.hint` | Шесть это число граней, а пар вдвое меньше. | Olti bu yoqlar soni, juftliklar esa ikki barobar kam. | Six is the number of faces, and pairs are half that. |
| `q4.c` | две | ikkita | two |
| `q4.c.hint` | Пол с потолком и две пары стен: уже три. | Pol bilan shift va ikki juft devor: allaqachon uchta. | The floor with the ceiling and two pairs of walls: already three. |
| `q4.d` | двенадцать | o'n ikkita | twelve |
| `q4.d.hint` | Двенадцать это рёбра, а не пары граней. | O'n ikki bu qirralar, yoq juftliklari emas. | Twelve is the edges, not the pairs of faces. |
| `audio.mount` | Четыре вопроса, и они идут в оценку. | To'rtta savol, va ular baholanadi. | Four questions, and they count towards the score. |
| `q1.done` | Ни одной. Это определение. | Birorta ham yo'q. Bu ta'rif. | None. That is the definition. |
| `q2.done` | Две пересекающиеся, и это главное слово признака. | Ikki kesishuvchi, va bu alomatning asosiy so'zi. | Two intersecting, and that is the key word of the criterion. |
| `q3.done` | Могут скрещиваться. Плоскости параллельны, прямые нет. | Ayqash bo'lishi mumkin. Tekisliklar parallel, chiziqlar emas. | They may be skew. The planes are parallel, the lines are not. |
| `q4.done` | Три пары: шесть граней делятся пополам. | Uch juftlik: oltita yoq teng bo'linadi. | Three pairs: six faces split in half. |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | XULOSA | THE SUMMARY |
| `title` | Две пересекающиеся прямые — и плоскости параллельны | Ikki kesishuvchi chiziq -- va tekisliklar parallel | Two intersecting lines, and the planes are parallel |
| `can.1` | Различаю пересекающиеся и параллельные плоскости | Kesishuvchi va parallel tekisliklarni ajrataman | I tell intersecting planes from parallel ones |
| `can.2` | Применяю признак и беру именно пересекающиеся прямые | Alomatni qo'llaman va aynan kesishuvchi chiziqlarni olaman | I apply the criterion and take intersecting lines |
| `can.3` | Знаю, что одной пары параллельных прямых мало | Bir juft parallel chiziq kam ekanini bilaman | I know one pair of parallel lines is not enough |
| `can.4` | Не путаю параллельность плоскостей с параллельностью их прямых | Tekisliklar parallelligini ularning chiziqlari parallelligi bilan chalkashtirmayman | I do not confuse parallel planes with parallel lines in them |
| `levels.full` | Прошёл всё и разобрал ловушку | Hammasidan o'tdingiz va tuzoqni ochdingiz | Everything done, the trap taken apart |
| `levels.gap` | Признак работает, скрещивающиеся пары ещё путаются | Alomat ishlaydi, ayqash juftliklar hali chalkashadi | The criterion works, skew pairs still get mixed up |
| `levels.back` | Стоит вернуться к экрану четыре: одной пары мало | To'rtinchi ekranga qaytish kerak: bir juftlik kam | Worth going back to screen four: one pair is not enough |
| `bridge` | Дальше параллельное проецирование: там видно, почему на чертеже параллельные остаются параллельными, а прямой угол нет. | Keyingisi parallel proyeksiyalash: unda chizmada parallellar nega parallel qolib, to'g'ri burchak nega qolmasligini ko'rasiz. | Next comes parallel projection: there you see why parallel lines stay parallel on a drawing and a right angle does not. |
| `lifehack` | Проверять пары граней удобно по общему ребру: есть общее ребро — пересекаются, нет — параллельны. У шести граней куба ровно три параллельных пары. | Yoq juftliklarini umumiy qirra bo'yicha tekshirish qulay: umumiy qirra bor -- kesishadi, yo'q -- parallel. Kubning olti yog'ida aynan uch parallel juftlik bor. | Checking pairs of faces by the shared edge is handy: a shared edge means they intersect, no edge means parallel. Six faces of a cube give exactly three parallel pairs. |
| `sheetTitle` | Шпаргалка урока | Dars shpargalkasi | The lesson sheet |
| `sheetSrc` | геометрия 2022, стр. 103 | geometriya 2022, 103-bet | geometry 2022, page 103 |
| `audio.mount` | Прогноз с первого экрана и результат стоят рядом. | Birinchi ekrandagi taxmin va natija yonma-yon turadi. | The guess from screen one and the result stand side by side. |
| `audio.next` | Шпаргалка собрана по учебнику. Ниже видно, что умеешь. | Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi. | The sheet is put together from the textbook. Below you can see what you can do. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `1` |
| `hook.b` | `0` |
| `proved` | `0` |
| `law` | `a ∩ b = A,   a ∥ a₁,   b ∥ b₁   ⇒   α ∥ β` |
| `sheet.1` | `α ∩ β = ∅   ⇒   α ∥ β` |
| `sheet.2` | `AB ∩ AD = A` |
| `sheet.3` | `AB ∥ A₁B₁,   AD ∥ A₁D₁` |
| `sheet.4` | `ABCD ∥ A₁B₁C₁D₁` |
| `sheet.5` | `6 = 3 + 3` |
