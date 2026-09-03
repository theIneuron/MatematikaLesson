# Урок 32 — Параллельное проецирование · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS31_KONTENT.md`.

Скелет: в чате 27.08.2026. Опора в учебнике: геометрия 2022, §15, стр. 109–112
(`FAZODA PARALLEL PROYEKSIYALASH`).

**Зачем урок.** В плане строки нет, в 7–9 и 11 классах темы нет. На параллельном
проецировании держится всё изображение пространственных фигур: без него ученик принимает
чертежи приборов 6A и 6B на веру.

**Главное решение урока.** Прибор здесь не нужен новый: **чертёж куба и есть параллельная
проекция**. Ученик пять уроков смотрел на него — теперь он узнаёт, что на этом чертеже
сохраняется, а что нет. Все двенадцать рёбер куба равны, а на экране они разной длины; все
углы основания прямые, а на экране ни один прямым не выглядит; и при этом параллельные рёбра
остаются параллельными.

**Порядок экранов.** Сначала что НЕ сохраняется (длина, угол), потом что сохраняется
(отрезок, параллельность), потом два условия из учебника: направление обязано пересекать
плоскость, а отрезок вдоль направления переходит в точку.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины из
учебника дословно: `parallel proyeksiyalash`, `proyeksiyalash yo'nalishi`,
`proyeksiya tekisligi`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЕРТЁЖ | CHIZMA | THE DRAWING |
| `title` | Что чертёж сохраняет, а что теряет | Chizma nimani saqlaydi, nimani yo'qotadi | What the drawing keeps and what it loses |
| `row.a.name` | равные рёбра равны и на чертеже | teng qirralar chizmada ham teng | equal edges stay equal on the drawing |
| `row.b.name` | на чертеже их длины разные | chizmada ularning uzunligi boshqa | on the drawing their lengths differ |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас сравним рёбра на экране. | Javobingiz yozib olindi. Endi ekrandagi qirralarni solishtiramiz. | Your answer is saved. Now we will compare the edges on the screen. |
| `audio.mount` | Куб, который ты видел пять уроков. Все двенадцать его рёбер в пространстве равны. | Siz besh dars ko'rgan kub. Uning o'n ikki qirrasi fazoda teng. | The cube you have seen for five lessons. All twelve of its edges are equal in space. |
| `audio.r1` | Первая запись говорит, что и на чертеже они равны: раз куб, значит всё одинаково. | Birinchi yozuv chizmada ham ular teng deydi: kub bo'lsa, hammasi bir xil. | The first reading says they are equal on the drawing too: it is a cube, so everything is the same. |
| `audio.r2` | Вторая говорит, что чертёж их длины меняет, хотя в пространстве они равны. | Ikkinchisi chizma ularning uzunligini o'zgartiradi deydi, fazoda esa ular teng. | The second says the drawing changes their lengths, though in space they are equal. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB = AD = AA₁` |
| `row.a.value` | `=` |
| `row.b.value` | `≠` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | THE BASICS |
| `title` | Три коротких перед началом | Boshlashdan oldin uchta qisqa savol | Three short ones before we start |
| `q1.prompt` | Сколько рёбер у куба? | Kubning nechta qirrasi bor? | How many edges has a cube? |
| `q1.a` [верно] | 12 | 12 | 12 |
| `q1.b` | 8 | 8 | 8 |
| `q1.b.hint` | Восемь это вершины, а не рёбра. | Sakkiz bu uchlar, qirralar emas. | Eight is the vertices, not the edges. |
| `q1.c` | 6 | 6 | 6 |
| `q1.c.hint` | Шесть это грани. | Olti bu yoqlar. | Six is the faces. |
| `q1.d` | 4 | 4 | 4 |
| `q1.d.hint` | Четыре это рёбра одной грани. | To'rt bu bitta yoqning qirralari. | Four is the edges of one face. |
| `q2.prompt` | Угол DAB в основании куба. Сколько в нём градусов? | Kub asosidagi DAB burchagi. Unda necha daraja bor? | The angle DAB in the base of a cube. How many degrees has it? |
| `q2.a` [верно] | 90 | 90 | 90 |
| `q2.b` | 60 | 60 | 60 |
| `q2.b.hint` | Шестьдесят это угол правильного треугольника, а в основании квадрат. | Oltmish bu muntazam uchburchak burchagi, asosda esa kvadrat. | Sixty is the angle of an equilateral triangle, and the base is a square. |
| `q2.c` | 120 | 120 | 120 |
| `q2.c.hint` | Сто двадцать это то, что видно на чертеже, а не то, что в пространстве. | Yuz yigirma bu chizmada ko'rinadigani, fazodagisi emas. | A hundred and twenty is what shows on the drawing, not what is in space. |
| `q2.d` | 45 | 45 | 45 |
| `q2.d.hint` | Сорок пять это половина прямого. | Qirq besh bu to'g'ri burchakning yarmi. | Forty five is half a right angle. |
| `q3.prompt` | Две прямые параллельны. Сколько у них общих точек? | Ikki chiziq parallel. Ularning nechta umumiy nuqtasi bor? | Two lines are parallel. How many common points have they? |
| `q3.a` [верно] | ни одной | birorta ham yo'q | none |
| `q3.b` | одна | bitta | one |
| `q3.b.hint` | Одна общая точка это пересечение. | Bitta umumiy nuqta bu kesishish. | One common point is an intersection. |
| `q3.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.c.hint` | Бесконечно много у совпавших прямых. | Cheksiz ko'p ustma-ust tushgan chiziqlarda. | Infinitely many belongs to coinciding lines. |
| `q3.d` | зависит от чертежа | chizmaga bog'liq | it depends on the drawing |
| `q3.d.hint` | Как раз параллельность чертёж и сохраняет. | Aynan parallellikni chizma saqlaydi. | Parallelism is precisely what the drawing keeps. |
| `audio.mount` | Три вопроса про сам куб. Ответы будем сравнивать с тем, что видно на экране. | Kubning o'zi haqida uchta savol. Javoblarni ekranda ko'rinadigani bilan solishtiramiz. | Three questions about the cube itself. We will compare the answers with what shows on the screen. |
| `q1.done` | Двенадцать рёбер, и в пространстве все они равны. | O'n ikki qirra, va fazoda ularning hammasi teng. | Twelve edges, and in space all of them are equal. |
| `q2.done` | Девяносто градусов в пространстве. Держи это в голове. | Fazoda to'qson daraja. Buni yodda tuting. | Ninety degrees in space. Keep that in mind. |
| `q3.done` | А это то единственное, что чертёж не портит. | Bu esa chizma buzmaydigan yagona narsa. | And this is the one thing the drawing does not spoil. |

---

## Экран 3 · `explain1` · ответ `number` · тег `proyekciya-sohranyaet-dlinu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДЛИНА | UZUNLIK | LENGTH |
| `title` | В пространстве равны, на экране нет | Fazoda teng, ekranda emas | Equal in space, not on the screen |
| `show.1.1` | Все рёбра куба равны по определению | Kubning hamma qirrasi ta'rif bo'yicha teng | All edges of a cube are equal by definition |
| `show.1.2` | подсвечены два ребра из одной вершины | bir uchdan chiqqan ikki qirra bo'yalgan | two edges from one vertex are highlighted |
| `show.1.3` | на экране они разной длины | ekranda ularning uzunligi boshqa | on the screen they have different lengths |
| `show.2.1` | Поворот сцены длины меняет | Sahnaning burilishi uzunlikni o'zgartiradi | Turning the scene changes the lengths |
| `show.2.2` | значит длина на чертеже не свойство фигуры | demak chizmadagi uzunlik shaklning xossasi emas | so a length on the drawing is not a property of the figure |
| `show.2.3` | это свойство чертежа | bu chizmaning xossasi | it is a property of the drawing |
| `audio.mount` | Чертёж куба это и есть параллельная проекция, о которой говорит учебник. | Kubning chizmasi darslik aytayotgan parallel proyeksiyaning o'zi. | The drawing of the cube is exactly the parallel projection the textbook speaks about. |
| `audio.spin*` | Поверни сцену и смотри на подсвеченные рёбра. На экране их длины всё время меняются. | Sahnani buring va bo'yalgan qirralarni kuzatib turing. Ekranda ularning uzunligi doim o'zgaradi. | Turn the scene and watch the highlighted edges. On the screen their lengths keep changing. |
| `audio.work` | В пространстве при этом не меняется ничего: куб остаётся кубом. | Fazoda esa hech narsa o'zgarmaydi: kub kub bo'lib qoladi. | In space nothing changes: the cube stays a cube. |
| `work.prompt` | Сколько рёбер куба равны ребру AB по длине в пространстве? | Fazoda kubning nechta qirrasi AB qirrasiga uzunligi bo'yicha teng? | In space, how many edges of the cube are equal in length to AB? |
| `work.ok` | Верно. Одиннадцать: все остальные. На чертеже равными выглядят далеко не все. | To'g'ri. O'n bir: qolganlarining hammasi. Chizmada esa hammasi teng ko'rinmaydi. | Correct. Eleven: all the others. On the drawing far from all of them look equal. |
| `work.hint.1` | Все рёбра куба равны между собой. | Kubning hamma qirrasi o'zaro teng. | All edges of a cube are equal to each other. |
| `work.hint.2` | Всего рёбер двенадцать, само AB не считаем. | Qirralar o'n ikkita, AB ning o'zini sanamaymiz. | There are twelve edges in all, and we do not count AB itself. |
| `work.hint.3` | Двенадцать без одного. | O'n ikkidan bitta kam. | Twelve minus one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `11` |

---

## Экран 4 · `explain2` · ответ `number` · тег `proyekciya-sohranyaet-dlinu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | УГОЛ | BURCHAK | ANGLE |
| `title` | Прямой угол на чертеже не прямой | Chizmada to'g'ri burchak to'g'ri emas | A right angle is not right on the drawing |
| `show.1.1` | Основание куба это квадрат | Kubning asosi kvadrat | The base of a cube is a square |
| `show.1.2` | все четыре его угла прямые | uning to'rt burchagi ham to'g'ri | all four of its angles are right |
| `show.1.3` | на экране ни один прямым не выглядит | ekranda birortasi ham to'g'ri ko'rinmaydi | on the screen not one of them looks right |
| `show.2.1` | Поворот меняет и углы | Burilish burchaklarni ham o'zgartiradi | Turning changes the angles too |
| `show.2.2` | один и тот же угол бывает то острым, то тупым | bitta burchak ba'zan o'tkir, ba'zan o'tmas bo'ladi | one and the same angle looks now acute, now obtuse |
| `show.2.3` | значит величину угла чертёж не сохраняет | demak burchak kattaligini chizma saqlamaydi | so the drawing does not keep the size of an angle |
| `audio.mount` | Второе, что теряет проекция, это углы. | Proyeksiya yo'qotadigan ikkinchi narsa bu burchaklar. | The second thing the projection loses is angles. |
| `audio.angle*` | Смотри на угол в вершине A. На экране он меняется, в пространстве он всё время прямой. | A uchidagi burchakni kuzatib turing. Ekranda u o'zgaradi, fazoda esa doim to'g'ri. | Watch the angle at the vertex A. On the screen it changes, in space it stays right. |
| `audio.work` | Поэтому отметку прямого угла на чертеже ставят особым знаком: глазом её не проверить. | Shuning uchun chizmada to'g'ri burchak maxsus belgi bilan qo'yiladi: uni ko'z bilan tekshirib bo'lmaydi. | That is why a right angle on a drawing is marked with a special sign: the eye cannot check it. |
| `work.prompt` | Сколько прямых углов у основания куба в пространстве? | Fazoda kub asosining nechta to'g'ri burchagi bor? | In space, how many right angles has the base of a cube? |
| `work.ok` | Верно. Четыре, и ни один из них на чертеже прямым не выглядит. | To'g'ri. To'rtta, va ularning birortasi chizmada to'g'ri ko'rinmaydi. | Correct. Four, and not one of them looks right on the drawing. |
| `work.hint.1` | Основание это квадрат. | Asos bu kvadrat. | The base is a square. |
| `work.hint.2` | У квадрата все углы прямые. | Kvadratning hamma burchagi to'g'ri. | All angles of a square are right. |
| `work.hint.3` | Углов у квадрата четыре. | Kvadratning burchagi to'rtta. | A square has four angles. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `4` |

---

## Экран 5 · `explain3` · ответ `number` · тег `proyekciya-sohranyaet-dlinu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧТО СОХРАНЯЕТСЯ | NIMA SAQLANADI | WHAT IS KEPT |
| `title` | Параллельность остаётся | Parallellik qoladi | Parallelism stays |
| `show.1.1` | Подсвечены рёбра одного направления | Bir yo'nalishdagi qirralar bo'yalgan | The edges of one direction are highlighted |
| `show.1.2` | в пространстве они параллельны | fazoda ular parallel | in space they are parallel |
| `show.1.3` | на экране они тоже параллельны | ekranda ham ular parallel | on the screen they are parallel too |
| `show.2.1` | Поворот этого не ломает | Burilish buni buzmaydi | Turning does not break this |
| `show.2.2` | длины и углы меняются, параллельность нет | uzunlik va burchaklar o'zgaradi, parallellik yo'q | lengths and angles change, parallelism does not |
| `show.2.3` | это первое и второе свойства учебника | bu darslikning birinchi va ikkinchi xossasi | these are the first and second properties in the textbook |
| `audio.mount` | Теперь о том, что проекция сохраняет. Учебник называет два свойства. | Endi proyeksiya saqlaydigan narsa haqida. Darslik ikki xossani ataydi. | Now about what the projection keeps. The textbook names two properties. |
| `audio.keep*` | Смотри на подсвеченные рёбра при повороте. Они остаются параллельными на любом ракурсе. | Burilishda bo'yalgan qirralarni kuzatib turing. Ular har rakursda parallel qoladi. | Watch the highlighted edges as it turns. They stay parallel at any angle. |
| `audio.work` | Отрезок остаётся отрезком, а параллельные остаются параллельными. Остальное чертёж меняет. | Kesma kesma bo'lib qoladi, parallellar parallel bo'lib qoladi. Qolganini chizma o'zgartiradi. | A segment stays a segment, and parallel lines stay parallel. The rest the drawing changes. |
| `work.prompt` | Сколько рёбер куба параллельны ребру AB? | Kubning nechta qirrasi AB qirrasiga parallel? | How many edges of the cube are parallel to the edge AB? |
| `work.ok` | Верно. Три, и на чертеже они тоже параллельны: это свойство проекции. | To'g'ri. Uchta, va chizmada ham ular parallel: bu proyeksiyaning xossasi. | Correct. Three, and on the drawing they are parallel too: that is a property of the projection. |
| `work.hint.1` | Найди рёбра того же направления. | O'sha yo'nalishdagi qirralarni toping. | Find the edges of the same direction. |
| `work.hint.2` | Одно в основании, два в верхней грани. | Biri asosda, ikkitasi yuqori yoqda. | One in the base, two in the top face. |
| `work.hint.3` | Всего таких три. | Bunday qirra jami uchta. | There are three such edges in all. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `3` |

---

## Экран 6 · `explain4` · ответ `number` · тег `napravlenie-vdol-ploskosti`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НАПРАВЛЕНИЕ | YO'NALISH | THE DIRECTION |
| `title` | Направление обязано пересекать плоскость | Yo'nalish tekislikni kesishi shart | The direction must cross the plane |
| `show.1.1` | Проецирование задаётся направлением | Proyeksiyalash yo'nalish bilan beriladi | A projection is set by a direction |
| `show.1.2` | через каждую точку проводится прямая этого направления | har nuqta orqali shu yo'nalishdagi chiziq o'tkaziladi | through each point a line of that direction is drawn |
| `show.1.3` | и отмечается её пересечение с плоскостью | va uning tekislik bilan kesishishi belgilanadi | and its intersection with the plane is marked |
| `show.2.1` | Возьмём направление вдоль плоскости | Tekislik bo'ylab yo'nalishni olamiz | Take a direction along the plane |
| `show.2.2` | такая прямая до плоскости не доходит | bunday chiziq tekislikka yetib bormaydi | such a line never reaches the plane |
| `show.2.3` | пересечения нет, и проекции тоже | kesishish yo'q, proyeksiya ham yo'q | there is no intersection, and no projection either |
| `audio.mount` | Учебник ставит условие на само направление проецирования. | Darslik proyeksiyalash yo'nalishining o'ziga shart qo'yadi. | The textbook puts a condition on the direction of projection itself. |
| `audio.dir*` | Смотри, куда идёт прямая направления. Пока она пересекает плоскость, проекция есть. | Yo'nalish chizig'i qayerga borishini kuzatib turing. U tekislikni kesib turganda proyeksiya bor. | Watch where the line of the direction goes. As long as it crosses the plane, there is a projection. |
| `audio.work` | Направление вдоль плоскости проекции не даёт вовсе. | Tekislik bo'ylab yo'nalish proyeksiyani umuman bermaydi. | A direction along the plane gives no projection at all. |
| `work.prompt` | Сколько точек оставит на плоскости прямая, параллельная этой плоскости? | Tekislikka parallel chiziq tekislikda nechta nuqta qoldiradi? | How many points will a line parallel to the plane leave on it? |
| `work.ok` | Верно. Ни одной, поэтому такое направление учебник запрещает. | To'g'ri. Birorta ham yo'q, shuning uchun darslik bunday yo'nalishni taqiqlaydi. | Correct. None, which is why the textbook forbids such a direction. |
| `work.hint.1` | Это прошлый урок: параллельная прямая и плоскость. | Bu o'tgan dars: parallel chiziq va tekislik. | This is the last lesson: a line parallel to a plane. |
| `work.hint.2` | У параллельных прямой и плоскости общих точек нет. | Parallel chiziq va tekislikning umumiy nuqtasi yo'q. | A parallel line and plane share no points. |
| `work.hint.3` | Значит ноль. | Demak nol. | So zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 7 · `explain5` · ответ `number` · тег `otrezok-vdol-napravleniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE |
| `title` | Отрезок вдоль направления | Yo'nalish bo'ylab kesma | A segment along the direction |
| `show.1.1` | Свойства верны не для всех отрезков | Xossalar hamma kesma uchun to'g'ri emas | The properties do not hold for every segment |
| `show.1.2` | учебник делает оговорку про направление | darslik yo'nalish haqida izoh beradi | the textbook adds a remark about the direction |
| `show.1.3` | отрезок вдоль направления идёт по своей проецирующей прямой | yo'nalish bo'ylab kesma o'zining proyeksiyalovchi chizig'i bo'ylab boradi | a segment along the direction lies on its own projecting line |
| `show.2.1` | Все его точки уходят в одну и ту же точку | Uning hamma nuqtasi bitta nuqtaga ketadi | All its points go into one and the same point |
| `show.2.2` | отрезком его проекция уже не является | uning proyeksiyasi endi kesma emas | its projection is no longer a segment |
| `show.2.3` | поэтому оговорка стоит в самом учебнике | shuning uchun izoh darslikning o'zida turadi | that is why the remark stands in the textbook itself |
| `audio.mount` | Последнее условие учебника: свойства верны для отрезков, не параллельных направлению. | Darslikning oxirgi sharti: xossalar yo'nalishga parallel bo'lmagan kesmalar uchun to'g'ri. | The last condition of the textbook: the properties hold for segments not parallel to the direction. |
| `audio.point*` | Смотри, что происходит с отрезком, который идёт вдоль направления. | Yo'nalish bo'ylab ketadigan kesmaga nima bo'lishini kuzatib turing. | Watch what happens to a segment running along the direction. |
| `audio.work` | Он превращается в точку, и говорить о его длине больше нельзя. | U nuqtaga aylanadi, va uning uzunligi haqida gapirib bo'lmaydi. | It turns into a point, and one can no longer speak of its length. |
| `work.prompt` | Во сколько точек перейдёт отрезок, идущий вдоль направления? | Yo'nalish bo'ylab ketadigan kesma nechta nuqtaga o'tadi? | Into how many points does a segment along the direction go? |
| `work.ok` | Верно. В одну. Проекция отрезком быть перестала, поэтому свойства к нему не применяют. | To'g'ri. Bittaga. Proyeksiya kesma bo'lishdan to'xtadi, shuning uchun xossalar unga qo'llanmaydi. | Correct. Into one. The projection stopped being a segment, so the properties do not apply to it. |
| `work.hint.1` | Все точки отрезка лежат на одной проецирующей прямой. | Kesmaning hamma nuqtasi bitta proyeksiyalovchi chiziqda yotadi. | All points of the segment lie on one projecting line. |
| `work.hint.2` | Эта прямая пересекает плоскость один раз. | Bu chiziq tekislikni bir marta kesadi. | That line crosses the plane once. |
| `work.hint.3` | Значит и точка получится одна. | Demak nuqta ham bitta chiqadi. | So the point comes out one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `proyekciya-sohranyaet-dlinu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `title` | Определение и два свойства | Ta'rif va ikki xossa | The definition and two properties |
| `probe.question` | Что проекция сохраняет? | Proyeksiya nimani saqlaydi? | What does the projection keep? |
| `probe.a` [верно] | параллельность и то, что отрезок остаётся отрезком | parallellikni va kesmaning kesma qolishini | parallelism and that a segment stays a segment |
| `probe.b` | длины и величины углов | uzunlik va burchak kattaligini | lengths and angle sizes |
| `probe.b.hint` | Рёбра куба равны, а на экране разные; углы основания прямые, а на экране нет. | Kub qirralari teng, ekranda esa boshqa; asos burchaklari to'g'ri, ekranda esa emas. | The cube edges are equal, on the screen they differ; the base angles are right, on the screen they are not. |
| `rule.lawLabel` | Параллельное проецирование | Parallel proyeksiyalash | Parallel projection |
| `rule.lines.1` | Стр. 109. Каждая точка переносится на плоскость по прямым, параллельным направлению проецирования. | 109-bet. Har bir nuqta proyeksiyalash yo'nalishiga parallel chiziqlar bo'ylab tekislikka ko'chiriladi. | Page 109. Each point is carried onto the plane along lines parallel to the direction of projection. |
| `rule.lines.2` | Стр. 110, свойство 1. Отрезок переходит в отрезок, прямая в прямую. | 110-bet, 1-xossa. Kesma kesmaga, to'g'ri chiziq to'g'ri chiziqqa o'tadi. | Page 110, property 1. A segment goes to a segment, a line to a line. |
| `rule.lines.3` | Стр. 110, свойство 2. Параллельные отрезки переходят в параллельные или совпадают. | 110-bet, 2-xossa. Parallel kesmalar parallel kesmalarga o'tadi yoki ustma-ust tushadi. | Page 110, property 2. Parallel segments go to parallel ones or coincide. |
| `audio.mount` | Прежде чем открыть карточку, ответь на один вопрос. | Kartochkani ochishdan oldin bitta savolga javob bering. | Before the card opens, answer one question. |
| `audio.rule*` | Карточка говорит словами учебника. Два свойства, и оба про то, что остаётся. | Kartochka darslik so'zlari bilan gapiradi. Ikki xossa, va ikkalasi qoladigan narsa haqida. | The card speaks in the words of the textbook. Two properties, and both about what remains. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `proyekciya-sohranyaet-dlinu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЕТЫРЕ СВОЙСТВА | TO'RT XOSSA | FOUR PROPERTIES |
| `title` | Соедини свойство с его судьбой | Xossani o'z taqdiri bilan biriktiring | Match each property with its fate |
| `match.prompt` | Что проекция делает с каждым из них | Proyeksiya har biri bilan nima qiladi | What the projection does with each |
| `match.a` | длина меняется | uzunlik o'zgaradi | length changes |
| `match.b` | угол меняется | burchak o'zgaradi | the angle changes |
| `match.c` | параллельность сохраняется | parallellik saqlanadi | parallelism is kept |
| `match.d` | остаётся отрезком | kesma bo'lib qoladi | stays a segment |
| `match.ok` | Все четыре верно. Два свойства учебника это ровно то, что уцелело. | To'rttasi ham to'g'ri. Darslikning ikki xossasi aynan omon qolgan narsa. | All four correct. The two textbook properties are exactly what survived. |
| `audio.mount` | Четыре величины и одна проекция. Две из них она меняет, две оставляет. | To'rt kattalik va bitta proyeksiya. Ikkitasini u o'zgartiradi, ikkitasini qoldiradi. | Four quantities and one projection. Two of them it changes, two it leaves. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `AB = AD` · `∠DAB = 90°` · `AB ∥ CD` · `AB → A₀B₀` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `napravlenie-vdol-ploskosti`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMLAB | STEP BY STEP |
| `title` | Построй проекцию точки | Nuqtaning proyeksiyasini yasang | Build the projection of a point |
| `order.prompt` | Расставь по порядку | Tartib bilan joylashtiring | Put them in order |
| `order.s1` | выбрать направление, пересекающее плоскость | tekislikni kesuvchi yo'nalishni tanlash | choose a direction crossing the plane |
| `order.s2` | провести через точку прямую этого направления | nuqta orqali shu yo'nalishdagi chiziqni o'tkazish | draw through the point a line of that direction |
| `order.s3` | отметить пересечение прямой с плоскостью | chiziqning tekislik bilan kesishishini belgilash | mark where the line meets the plane |
| `order.ok` | Верно. Именно так учебник строит точку A нулевое. | To'g'ri. Darslik A nol nuqtasini aynan shunday yasaydi. | Correct. This is exactly how the textbook builds the point A zero. |
| `order.bad` | Порядок другой. Направление выбирается до всякого построения. | Tartib boshqacha. Yo'nalish har qanday yasashdan oldin tanlanadi. | The order is different. The direction is chosen before any construction. |
| `audio.mount` | Построение проекции точки идёт в три шага, и первый шаг про направление. | Nuqta proyeksiyasini yasash uch qadamda boradi, birinchi qadam yo'nalish haqida. | Building the projection of a point takes three steps, and the first is about the direction. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A → A₀` |
| `order.mark` | `A₀ ∈ α` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Без прибора | Asbobsiz | No instrument |
| `order.prompt` | Расставь записи в том порядке, в каком они появляются | Yozuvlarni paydo bo'lish tartibida joylashtiring | Put the lines in the order they appear |
| `order.title` | Порядок записей | Yozuvlar tartibi | The order of the lines |
| `order.ok` | Верно. Сначала свойство, потом вывод о фигуре. | To'g'ri. Avval xossa, keyin shakl haqida xulosa. | Correct. First the property, then the conclusion about the figure. |
| `order.bad` | Не тот порядок. Вывод о фигуре пишется последним. | Tartib to'g'ri emas. Shakl haqidagi xulosa oxirida yoziladi. | Wrong order. The conclusion about the figure is written last. |
| `task.prompt` | Проецируем куб вдоль вертикальных рёбер. Сколько рёбер перейдёт в точки? | Kubni tik qirralar bo'ylab proyeksiyalaymiz. Nechta qirra nuqtaga o'tadi? | We project the cube along its vertical edges. How many edges go into points? |
| `task.ok` | Верно. Четыре вертикальных: они идут вдоль направления. | To'g'ri. To'rt tik qirra: ular yo'nalish bo'ylab boradi. | Correct. The four vertical ones: they run along the direction. |
| `task.hint.1` | В точку переходит то, что идёт вдоль направления. | Yo'nalish bo'ylab ketadigan narsa nuqtaga o'tadi. | What runs along the direction goes into a point. |
| `task.hint.2` | Направление задано вертикальными рёбрами. | Yo'nalish tik qirralar bilan berilgan. | The direction is set by the vertical edges. |
| `task.hint.3` | Вертикальных рёбер у куба четыре. | Kubning tik qirralari to'rtta. | A cube has four vertical edges. |
| `audio.mount` | Прибора здесь нет. Сначала порядок записей, потом ответ. | Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob. | There is no instrument here. First the order of the lines, then the answer. |
| `audio.next` | Теперь сама задача. Пиши число. | Endi masalaning o'zi. Sonni yozing. | Now the task itself. Write the number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.answer` | `4` |
| `order.items` | `AB ∥ CD` · `A₀B₀ ∥ C₀D₀` · `AB = CD` · `A₀B₀ = C₀D₀ — ?` |
| `order.answer` | `AB ∥ CD  A₀B₀ ∥ C₀D₀  AB = CD  A₀B₀ = C₀D₀ — ?` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Все шаги верны, вывод неверен | Hamma qadam to'g'ri, xulosa noto'g'ri | Every step is right, the conclusion is wrong |
| `hint.r1` | Верно: это первое свойство учебника. | To'g'ri: bu darslikning birinchi xossasi. | Correct: this is the first textbook property. |
| `hint.r2` | Верно: это второе свойство. | To'g'ri: bu ikkinchi xossa. | Correct: this is the second property. |
| `hint.r3` | Тоже верно: из двух свойств параллелограмм и получается. | Bu ham to'g'ri: ikki xossadan parallelogramm chiqadi. | Also correct: the two properties do give a parallelogram. |
| `proof` | Ошибка в последней строке. Проекция не сохраняет ни длины, ни углы, поэтому квадрат гарантировать нельзя. | Xato oxirgi satrda. Proyeksiya na uzunlikni, na burchakni saqlaydi, shuning uchun kvadratni kafolatlab bo'lmaydi. | The mistake is in the last line. The projection keeps neither lengths nor angles, so a square cannot be guaranteed. |
| `entry.prompt` | Сколько прямых углов гарантирует проекция? | Proyeksiya nechta to'g'ri burchakni kafolatlaydi? | How many right angles does the projection guarantee? |
| `entry.ok` | Верно. Ни одного: величину угла проекция не сохраняет. | To'g'ri. Birorta ham yo'q: proyeksiya burchak kattaligini saqlamaydi. | Correct. None: the projection does not keep the size of an angle. |
| `entry.hint.1` | Посмотри на экран четыре: что там стало с прямым углом. | To'rtinchi ekranga qarang: unda to'g'ri burchakka nima bo'ldi. | Look at screen four: what happened to the right angle there. |
| `entry.hint.2` | Учебник называет только два свойства, и угла среди них нет. | Darslik faqat ikki xossani ataydi, burchak ular orasida yo'q. | The textbook names only two properties, and the angle is not among them. |
| `entry.hint.3` | Значит гарантированных прямых углов ноль. | Demak kafolatlangan to'g'ri burchak nol. | So the guaranteed right angles are zero. |
| `audio.mount` | Доказательство выписано в четыре строки. Найди ту, где появилась ошибка. | Isbot to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping. | The proof is written in four lines. Find the one where the mistake appeared. |
| `audio.next` | Теперь запиши число. | Endi sonni yozing. | Now write the number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `AB → A₀B₀` |
| `row.r2` | `AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀` |
| `row.r3` | `A₀B₀ ∥ C₀D₀,   A₀D₀ ∥ B₀C₀` |
| `row.r4` | `∠A₀ = 90°` |
| `answerId` | `r4` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБРАТНАЯ ЗАДАЧА | TESKARI MASALA | THE REVERSE TASK |
| `title` | Теперь решаешь ты | Endi siz hal qilasiz | Now you decide |
| `entry.prompt` | Сколько точек даёт проекция отрезка, идущего вдоль направления? | Yo'nalish bo'ylab ketadigan kesmaning proyeksiyasi nechta nuqta beradi? | How many points does the projection of a segment along the direction give? |
| `entry.ok` | Верно. Одну. Это единственный случай, когда отрезок отрезком не остаётся. | To'g'ri. Bitta. Bu kesma kesma bo'lib qolmaydigan yagona hol. | Correct. One. This is the only case where a segment does not stay a segment. |
| `entry.hint.1` | Все точки отрезка лежат на одной проецирующей прямой. | Kesmaning hamma nuqtasi bitta proyeksiyalovchi chiziqda yotadi. | All points of the segment lie on one projecting line. |
| `entry.hint.2` | Прямая пересекает плоскость один раз. | Chiziq tekislikni bir marta kesadi. | The line crosses the plane once. |
| `entry.hint.3` | Значит точка одна. | Demak nuqta bitta. | So the point is one. |
| `multi.prompt` | Отметь всё, что проекция сохраняет | Proyeksiya saqlaydigan hamma narsani belgilang | Mark everything the projection keeps |
| `multi.title` | Две из четырёх | To'rttadan ikkitasi | Two out of four |
| `multi.c.hint` | Длину проекция меняет: равные рёбра куба на экране разные. | Uzunlikni proyeksiya o'zgartiradi: kubning teng qirralari ekranda boshqa. | The projection changes length: the equal cube edges differ on the screen. |
| `multi.d.hint` | Величину угла тоже: прямой угол выглядит тупым. | Burchak kattaligini ham: to'g'ri burchak o'tmas ko'rinadi. | The angle size too: a right angle looks obtuse. |
| `multi.ok` | Верно. Сохраняются ровно два свойства из учебника. | To'g'ri. Darslikdagi aynan ikki xossa saqlanadi. | Correct. Exactly the two textbook properties are kept. |
| `audio.mount` | До этого свойства называл учебник. Теперь выбираешь ты. | Bungacha xossalarni darslik atardi. Endi siz tanlaysiz. | Until now the textbook named the properties. Now you choose. |
| `audio.work` | Обрати внимание: сохраняется то, что не измеряется числом. | E'tibor bering: son bilan o'lchanmaydigan narsa saqlanadi. | Notice: what is kept is what is not measured by a number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `AA₁ → A₀` |
| `entry.answer` | `1` |
| `multi.a` [верно] | `AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀` |
| `multi.b` [верно] | `AB → A₀B₀` |
| `multi.c` | `AB = CD   ⇒   A₀B₀ = C₀D₀` |
| `multi.d` | `∠DAB = 90°   ⇒   ∠D₀A₀B₀ = 90°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `proyekciya-sohranyaet-dlinu`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | THE BLITZ |
| `title` | Четыре вопроса подряд | Ketma-ket to'rtta savol | Four questions in a row |
| `q1.prompt` | Проекция отрезка это… | Kesmaning proyeksiyasi bu... | The projection of a segment is... |
| `q1.a` [верно] | отрезок или точка | kesma yoki nuqta | a segment or a point |
| `q1.b` | всегда отрезок | doim kesma | always a segment |
| `q1.b.hint` | Отрезок вдоль направления переходит в точку. | Yo'nalish bo'ylab kesma nuqtaga o'tadi. | A segment along the direction goes into a point. |
| `q1.c` | всегда точка | doim nuqta | always a point |
| `q1.c.hint` | В точку переходит только отрезок вдоль направления. | Nuqtaga faqat yo'nalish bo'ylab kesma o'tadi. | Only a segment along the direction goes into a point. |
| `q1.d` | кривая | egri chiziq | a curve |
| `q1.d.hint` | Кривой проекция отрезка не бывает: первое свойство учебника. | Kesmaning proyeksiyasi egri chiziq bo'lmaydi: darslikning birinchi xossasi. | The projection of a segment is never a curve: the first textbook property. |
| `q2.prompt` | Равные отрезки после проецирования… | Teng kesmalar proyeksiyalashdan keyin... | Equal segments after projecting... |
| `q2.a` [верно] | могут стать разными | boshqa bo'lib qolishi mumkin | may become different |
| `q2.b` | остаются равными | teng qoladi | stay equal |
| `q2.b.hint` | Рёбра куба равны, а на чертеже разной длины. | Kub qirralari teng, chizmada esa uzunligi boshqa. | The cube edges are equal, and different in length on the drawing. |
| `q2.c` | становятся параллельными | parallel bo'lib qoladi | become parallel |
| `q2.c.hint` | Параллельность сохраняется, а не появляется. | Parallellik saqlanadi, paydo bo'lmaydi. | Parallelism is kept, not created. |
| `q2.d` | исчезают | yo'qoladi | disappear |
| `q2.d.hint` | Исчезнуть отрезок не может: он переходит в отрезок или точку. | Kesma yo'qololmaydi: u kesmaga yoki nuqtaga o'tadi. | A segment cannot disappear: it goes to a segment or a point. |
| `q3.prompt` | Направление проецирования обязано… | Proyeksiyalash yo'nalishi shart... | The direction of projection must... |
| `q3.a` [верно] | пересекать плоскость проекции | proyeksiya tekisligini kesishi | cross the plane of projection |
| `q3.a.ok` | Да: иначе прямые до плоскости не доходят и проекции нет. | Ha: aks holda chiziqlar tekislikka yetmaydi va proyeksiya yo'q. | Yes: otherwise the lines never reach the plane and there is no projection. |
| `q3.b` | быть параллельным плоскости | tekislikka parallel bo'lishi | be parallel to the plane |
| `q3.b.hint` | Параллельное направление не даёт ни одной точки на плоскости. | Parallel yo'nalish tekislikda birorta nuqta bermaydi. | A parallel direction gives no point on the plane at all. |
| `q3.c` | быть перпендикулярным плоскости | tekislikka perpendikulyar bo'lishi | be perpendicular to the plane |
| `q3.c.hint` | Перпендикулярное годится, но это лишь частный случай. | Perpendikulyari yaraydi, lekin bu xususiy hol. | A perpendicular one works, but that is only a special case. |
| `q3.d` | лежать в плоскости | tekislikda yotishi | lie in the plane |
| `q3.d.hint` | Тогда все точки уже в плоскости, и проецировать нечего. | Unda hamma nuqta tekislikda, proyeksiyalaydigan narsa yo'q. | Then all points are already in the plane and there is nothing to project. |
| `q4.prompt` | Прямой угол на чертеже куба… | Kub chizmasida to'g'ri burchak... | A right angle on the drawing of a cube... |
| `q4.a` [верно] | прямым выглядеть не обязан | to'g'ri ko'rinishi shart emas | need not look right |
| `q4.b` | всегда выглядит прямым | doim to'g'ri ko'rinadi | always looks right |
| `q4.b.hint` | Углы основания прямые, а на экране тупые. | Asos burchaklari to'g'ri, ekranda esa o'tmas. | The base angles are right, and obtuse on the screen. |
| `q4.c` | на чертеже исчезает | chizmada yo'qoladi | disappears on the drawing |
| `q4.c.hint` | Угол остаётся, меняется только его величина на экране. | Burchak qoladi, faqat ekranda kattaligi o'zgaradi. | The angle remains, only its size on the screen changes. |
| `q4.d` | становится развёрнутым | yoyilgan bo'lib qoladi | becomes straight |
| `q4.d.hint` | Развёрнутым он стал бы, только если смотреть вдоль плоскости грани. | Yoyilgan bo'lishi uchun yoq tekisligi bo'ylab qarash kerak. | It would become straight only when looking along the plane of the face. |
| `audio.mount` | Четыре вопроса, и они идут в оценку. | To'rtta savol, va ular baholanadi. | Four questions, and they count towards the score. |
| `q1.done` | Отрезок или точка. Точка только вдоль направления. | Kesma yoki nuqta. Nuqta faqat yo'nalish bo'ylab. | A segment or a point. A point only along the direction. |
| `q2.done` | Длина не свойство чертежа: она меняется. | Uzunlik chizmaning xossasi emas: u o'zgaradi. | Length is not a property of the drawing: it changes. |
| `q3.done` | Должно пересекать плоскость. Иначе проекции нет. | Tekislikni kesishi kerak. Aks holda proyeksiya yo'q. | It must cross the plane. Otherwise there is no projection. |
| `q4.done` | Не обязан. Поэтому прямой угол помечают знаком. | Shart emas. Shuning uchun to'g'ri burchak belgi bilan ko'rsatiladi. | It need not. That is why a right angle is marked with a sign. |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | XULOSA | THE SUMMARY |
| `title` | Чертёж сохраняет два свойства из четырёх | Chizma to'rt xossadan ikkitasini saqlaydi | The drawing keeps two properties out of four |
| `can.1` | Знаю, что чертёж пространственной фигуры это проекция | Fazoviy shakl chizmasi proyeksiya ekanini bilaman | I know a drawing of a spatial figure is a projection |
| `can.2` | Не читаю с чертежа длины и углы | Chizmadan uzunlik va burchakni o'qimayman | I do not read lengths and angles off a drawing |
| `can.3` | Пользуюсь тем, что параллельность сохраняется | Parallellik saqlanishidan foydalanaman | I use the fact that parallelism is kept |
| `can.4` | Помню про отрезок вдоль направления | Yo'nalish bo'ylab kesmani yodda tutaman | I remember the segment along the direction |
| `levels.full` | Прошёл всё и разобрал ловушку | Hammasidan o'tdingiz va tuzoqni ochdingiz | Everything done, the trap taken apart |
| `levels.gap` | Свойства помнишь, оговорка про направление ещё путается | Xossalarni bilasiz, yo'nalish haqidagi izoh hali chalkashadi | The properties are there, the remark on the direction still slips |
| `levels.back` | Стоит вернуться к экрану три: длина на чертеже не свойство фигуры | Uchinchi ekranga qaytish kerak: chizmadagi uzunlik shaklning xossasi emas | Worth going back to screen three: a length on a drawing is not a property of the figure |
| `bridge` | Дальше перпендикулярность в пространстве: там прямой угол придётся доказывать, а не смотреть на чертёж. | Keyingisi fazoda perpendikulyarlik: unda to'g'ri burchakni isbotlash kerak, chizmaga qarash emas. | Next comes perpendicularity in space: there a right angle has to be proved, not looked at on a drawing. |
| `lifehack` | На чертеже верить можно только двум вещам: отрезок остался отрезком и параллельные остались параллельными. Всё остальное берётся из условия, а не с картинки. | Chizmada faqat ikki narsaga ishonish mumkin: kesma kesma qoldi va parallellar parallel qoldi. Qolgani shartdan olinadi, rasmdan emas. | On a drawing only two things can be trusted: a segment stayed a segment and parallel lines stayed parallel. Everything else comes from the statement, not from the picture. |
| `sheetTitle` | Шпаргалка урока | Dars shpargalkasi | The lesson sheet |
| `sheetSrc` | геометрия 2022, стр. 109, 110 | geometriya 2022, 109, 110-betlar | geometry 2022, pages 109, 110 |
| `audio.mount` | Прогноз с первого экрана и результат стоят рядом. | Birinchi ekrandagi taxmin va natija yonma-yon turadi. | The guess from screen one and the result stand side by side. |
| `audio.next` | Шпаргалка собрана по учебнику. Ниже видно, что умеешь. | Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi. | The sheet is put together from the textbook. Below you can see what you can do. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `=` |
| `hook.b` | `≠` |
| `proved` | `≠` |
| `law` | `AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀` |
| `sheet.1` | `AB = AD,   A₀B₀ ≠ A₀D₀` |
| `sheet.2` | `∠DAB = 90°,   ∠D₀A₀B₀ ≠ 90°` |
| `sheet.3` | `AB ∥ CD   ⇒   A₀B₀ ∥ C₀D₀` |
| `sheet.4` | `AB → A₀B₀` |
| `sheet.5` | `AA₁ ∥ l   ⇒   AA₁ → A₀` |
