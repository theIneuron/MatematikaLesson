# Урок 30 — Параллельность прямой и плоскости · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS29_KONTENT.md`.

Скелет: в чате 27.08.2026. Опора в учебнике: геометрия 2022, §13, стр. 98–102
(`FAZODA TO'G'RI CHIZIQ VA TEKISLIKLARNING O'ZARO JOYLASHUVI`).

**Зачем урок.** В уроке 29 признак параллельности прямой и плоскости шёл карточкой правила,
своего экрана-объяснения не имел. Тема спрашивается на ДТМ, а в планах 7–9 и 11 классов её
нет.

**Главное решение урока.** Признак состоит из ДВУХ условий, и второе теряют: прямая не
только параллельна прямой в плоскости, но и **не лежит** в этой плоскости. Поэтому
разграничение (экран 4) построено на прямой основания: `AB` параллельна `CD`, `CD` лежит в
плоскости — а вывод «`AB` параллельна плоскости `ABCD`» ложен.

**Сцена одна — куб учебника.** Меняется подсветка и плоскость. Прибор 6A, поворот делает
ученик: пока сцена не повернулась, «пересекает грань» и «проходит над гранью» на экране
неотличимы.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины из
учебника дословно: `parallel`, `alomat`, `kesishmaydi`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРЯМАЯ И ПЛОСКОСТЬ | TO'G'RI CHIZIQ VA TEKISLIK | A LINE AND A PLANE |
| `title` | Пересечёт или пройдёт мимо | Kesib o'tadi yoki yonidan o'tadi | It will cross, or it will pass by |
| `row.a.name` | пересечёт, если продолжить | davom ettirilsa kesib o'tadi | it crosses if extended |
| `row.b.name` | не пересечёт никогда | hech qachon kesmaydi | it never crosses |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену. | Javobingiz yozib olindi. Endi sahnani buramiz. | Your answer is saved. Now we will turn the scene. |
| `audio.mount` | Куб, и в нём одна грань закрашена. Это плоскость нашего вопроса. | Kub, va unda bitta yoq bo'yalgan. Bu bizning savolimizning tekisligi. | A cube, and one face in it is shaded. This is the plane of our question. |
| `audio.r1` | Первая запись говорит, что прямая рано или поздно войдёт в плоскость: на чертеже она идёт прямо по закрашенной грани. | Birinchi yozuv chiziq ertami-kechmi tekislikka kiradi deydi: chizmada u bo'yalgan yoqning ustidan o'tadi. | The first reading says the line sooner or later enters the plane: on the drawing it runs right across the shaded face. |
| `audio.r2` | Вторая говорит, что общих точек нет вовсе, и продолжение ничего не изменит. | Ikkinchisi umumiy nuqta umuman yo'q deydi, va davom ettirish hech narsani o'zgartirmaydi. | The second says there are no common points at all, and extending changes nothing. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A₁B₁` · `ABCD` |
| `row.a.value` | `1` |
| `row.b.value` | `0` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | THE BASICS |
| `title` | Три коротких перед началом | Boshlashdan oldin uchta qisqa savol | Three short ones before we start |
| `q1.prompt` | Сколько общих точек у прямой и плоскости, если прямая пересекает плоскость? | Chiziq tekislikni kesib o'tsa, ularning nechta umumiy nuqtasi bor? | How many common points has a line with a plane it crosses? |
| `q1.a` [верно] | одна | bitta | one |
| `q1.b` | две | ikkita | two |
| `q1.b.hint` | Через две точки прямая уже легла бы в плоскость целиком. | Ikki nuqta orqali chiziq tekislikka butunlay yotib qolardi. | Through two points the line would already lie in the plane entirely. |
| `q1.c` | ни одной | birorta ham yo'q | none |
| `q1.c.hint` | Ни одной бывает у параллельных, а здесь сказано «пересекает». | Birorta ham yo'q parallellarda bo'ladi, bu yerda esa «kesib o'tadi» deyilgan. | None happens for parallel ones, and here it says it crosses. |
| `q1.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.d.hint` | Бесконечно много у прямой, которая лежит в плоскости. | Cheksiz ko'p tekislikda yotgan chiziqda bo'ladi. | Infinitely many belongs to a line lying in the plane. |
| `q2.prompt` | Прямая AB и грань ABCD: прямая лежит в этой плоскости? | AB chizig'i va ABCD yog'i: chiziq shu tekislikda yotadimi? | The line AB and the face ABCD: does the line lie in that plane? |
| `q2.a` [верно] | да, обе её точки в грани | ha, ikkala nuqtasi ham yoqda | yes, both of its points are in the face |
| `q2.b` | нет, она только касается | yo'q, u faqat tegib turadi | no, it only touches it |
| `q2.b.hint` | Касание это одна точка, а тут в грани лежит весь отрезок. | Tegish bu bitta nuqta, bu yerda esa butun kesma yoqda yotadi. | Touching is one point, and here the whole segment lies in the face. |
| `q2.c` | нет, она параллельна | yo'q, u parallel | no, it is parallel |
| `q2.c.hint` | Параллельная не имеет с плоскостью ни одной общей точки. | Parallel chiziqning tekislik bilan birorta umumiy nuqtasi yo'q. | A parallel line has no common point with the plane at all. |
| `q2.d` | нет, она пересекает | yo'q, u kesib o'tadi | no, it crosses it |
| `q2.d.hint` | Пересечение это одна точка, а не целый отрезок. | Kesishish bu bitta nuqta, butun kesma emas. | An intersection is one point, not a whole segment. |
| `q3.prompt` | Две прямые не лежат в одной плоскости. Как они называются? | Ikki chiziq bir tekislikda yotmaydi. Ular qanday ataladi? | Two lines do not lie in one plane. What are they called? |
| `q3.a` [верно] | скрещивающиеся | ayqash | skew |
| `q3.b` | параллельные | parallel | parallel |
| `q3.b.hint` | У параллельных общая плоскость есть, и через них она одна. | Parallellarning umumiy tekisligi bor, va u bitta. | Parallel lines do have a common plane, and exactly one. |
| `q3.c` | перпендикулярные | perpendikulyar | perpendicular |
| `q3.c.hint` | Перпендикулярность про угол, а не про общую плоскость. | Perpendikulyarlik burchak haqida, umumiy tekislik haqida emas. | Perpendicularity is about the angle, not about a common plane. |
| `q3.d` | совпадающие | ustma-ust tushuvchi | coinciding |
| `q3.d.hint` | Совпадающие лежат в одной плоскости, и не в одной, а во многих. | Ustma-ust tushuvchilar bir tekislikda yotadi, va bittada emas, ko'pida. | Coinciding lines lie in one plane, and not in one but in many. |
| `audio.mount` | Три вопроса на то, что уже было. Все три понадобятся в признаке. | Bo'lib o'tgan narsalar uchun uchta savol. Uchalasi alomatda kerak bo'ladi. | Three questions on what has already been. All three are needed in the criterion. |
| `q1.done` | Ноль, одна, бесконечно много — три случая, и других нет. | Nol, bitta, cheksiz ko'p -- uchta hol, boshqasi yo'q. | Zero, one, infinitely many: three cases, and no others. |
| `q2.done` | Лежит в плоскости — это третий случай, не параллельность. | Tekislikda yotadi -- bu uchinchi hol, parallellik emas. | Lying in the plane is the third case, not parallelism. |
| `q3.done` | Скрещивающиеся понадобятся на экране пять. | Ayqash chiziqlar beshinchi ekranda kerak bo'ladi. | Skew lines will be needed on screen five. |

---

## Экран 3 · `explain1` · ответ `number` · тег `parallel-na-chertezhe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПОВЕРНИ СЦЕНУ | SAHNANI BURING | TURN THE SCENE |
| `title` | Чертёж говорит одно, поворот другое | Chizma bir narsa deydi, burilish boshqa | The drawing says one thing, the turn another |
| `show.1.1` | На этом ракурсе прямая идёт по грани | Bu rakursda chiziq yoq ustidan o'tadi | At this angle the line runs across the face |
| `show.1.2` | кажется, что они встречаются | ular uchrashadi deb ko'rinadi | it looks as if they meet |
| `show.1.3` | но это только проекция на экран | lekin bu faqat ekranga proyeksiya | but this is only the projection onto the screen |
| `show.2.1` | Сцена повернулась | Sahna burildi | The scene has turned |
| `show.2.2` | прямая идёт выше грани и не касается её | chiziq yoqdan baland boradi va unga tegmaydi | the line runs above the face and does not touch it |
| `show.2.3` | зазор виден с любой стороны | oraliq har tomondan ko'rinadi | the gap is visible from every side |
| `audio.mount` | Прямая верхней грани и плоскость нижней. Поверни сцену кнопками ниже. | Yuqori yoqning chizig'i va pastki yoqning tekisligi. Sahnani pastdagi tugmalar bilan buring. | The line of the top face and the plane of the bottom one. Turn the scene with the buttons below. |
| `audio.spin*` | Смотри на зазор между прямой и гранью. Он не исчезает ни при каком повороте. | Chiziq va yoq orasidagi oraliqni kuzatib turing. U hech qanday burilishda yo'qolmaydi. | Watch the gap between the line and the face. It does not vanish at any turn. |
| `audio.work` | Учебник говорит просто: если прямая и плоскость не пересекаются, они параллельны. | Darslik oddiy aytadi: chiziq va tekislik kesishmasa, ular parallel. | The textbook puts it simply: if a line and a plane do not intersect, they are parallel. |
| `work.prompt` | Сколько общих точек у прямой и этой плоскости? | Chiziq va shu tekislikning nechta umumiy nuqtasi bor? | How many common points has the line with this plane? |
| `work.ok` | Верно. Ни одной, и это определение параллельности. | To'g'ri. Birorta ham yo'q, va bu parallellikning ta'rifi. | Correct. None, and that is the definition of parallelism. |
| `work.hint.1` | Поверни сцену и посмотри, есть ли касание. | Sahnani buring va tegish bor-yo'qligini ko'ring. | Turn the scene and see whether there is any contact. |
| `work.hint.2` | Прямая идёт по верхней грани, плоскость это нижняя. | Chiziq yuqori yoq bo'ylab boradi, tekislik esa pastki. | The line runs along the top face, the plane is the bottom one. |
| `work.hint.3` | Между ними высота куба, и она нигде не пропадает. | Ular orasida kubning balandligi, va u hech qayerda yo'qolmaydi. | Between them stands the height of the cube, and it never disappears. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 4 · `explain2` · ответ `number` · тег `priznak-bez-vne`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДВА УСЛОВИЯ | IKKI SHART | TWO CONDITIONS |
| `title` | Второе условие теряют | Ikkinchi shart yo'qoladi | The second condition gets lost |
| `show.1.1` | Признак учебника: прямая параллельна прямой в плоскости | Darslik alomati: chiziq tekislikdagi chiziqqa parallel | The criterion: the line is parallel to a line in the plane |
| `show.1.2` | и при этом сама в плоскости не лежит | va o'zi tekislikda yotmaydi | and it does not lie in the plane itself |
| `show.1.3` | оба условия обязательны | ikkala shart ham shart | both conditions are required |
| `show.2.1` | Возьмём прямую основания и проверим признак | Asos chizig'ini olib alomatni tekshiramiz | Take a line of the base and check the criterion |
| `show.2.2` | она параллельна другой прямой той же плоскости | u o'sha tekislikning boshqa chizig'iga parallel | it is parallel to another line of the same plane |
| `show.2.3` | но параллельной плоскости она не является: она в ней лежит | lekin u tekislikka parallel emas: u unda yotadi | but it is not parallel to the plane: it lies in it |
| `audio.mount` | Признак состоит из двух условий, и одно из них забывают чаще другого. | Alomat ikki shartdan iborat, va biri ikkinchisidan ko'proq esdan chiqadi. | The criterion has two conditions, and one is forgotten more often than the other. |
| `audio.base*` | Смотри: та же логика, но прямая взята из самой плоскости. Вывод получается ложным. | Qarang: o'sha mantiq, lekin chiziq tekislikning o'zidan olingan. Xulosa yolg'on chiqadi. | Look: the same logic, but the line is taken from the plane itself. The conclusion comes out false. |
| `audio.work` | Общих точек у неё с плоскостью не ноль, а бесконечно много. | Uning tekislik bilan umumiy nuqtalari nol emas, cheksiz ko'p. | Its common points with the plane are not zero but infinitely many. |
| `work.prompt` | Сколько граней куба содержат прямую AB? | Kubning nechta yog'i AB chizig'ini o'z ichiga oladi? | How many faces of the cube contain the line AB? |
| `work.ok` | Верно. Две грани. Прямая, лежащая в плоскости, параллельной ей не бывает. | To'g'ri. Ikki yoq. Tekislikda yotgan chiziq unga parallel bo'lmaydi. | Correct. Two faces. A line lying in a plane is never parallel to it. |
| `work.hint.1` | Найди грани, в которых обе точки A и B лежат целиком. | A va B nuqtalari butunlay yotgan yoqlarni toping. | Find the faces where both A and B lie entirely. |
| `work.hint.2` | Одна из них основание, вторая боковая. | Biri asos, ikkinchisi yon yoq. | One of them is the base, the other is a side face. |
| `work.hint.3` | Значит таких граней две. | Demak bunday yoq ikkita. | So there are two such faces. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 5 · `explain3` · ответ `number` · тег `parallel-vsem-pryamym`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НЕ ВСЯКОЙ ПРЯМОЙ | HAR CHIZIQQA EMAS | NOT TO EVERY LINE |
| `title` | Параллельна плоскости — но не всему в ней | Tekislikka parallel, lekin undagi hammasiga emas | Parallel to the plane, but not to all of it |
| `show.1.1` | Прямая параллельна плоскости основания | Chiziq asos tekisligiga parallel | The line is parallel to the plane of the base |
| `show.1.2` | в основании четыре прямых по рёбрам | asosda qirralar bo'ylab to'rt chiziq bor | in the base there are four lines along the edges |
| `show.1.3` | параллельны ей не все четыре | to'rttasi ham parallel emas | not all four are parallel to it |
| `show.2.1` | Подсвечена прямая, скрещивающаяся с нашей | Bizningi bilan ayqash chiziq bo'yalgan | A line skew to ours is highlighted |
| `show.2.2` | общей плоскости у этой пары нет ни одной | bu juftlikning umumiy tekisligi bitta ham yo'q | this pair has no common plane at all |
| `show.2.3` | значит параллельными их назвать нельзя | demak ularni parallel deb bo'lmaydi | so they cannot be called parallel |
| `audio.mount` | Прямая параллельна плоскости. Это не значит, что она параллельна каждой прямой этой плоскости. | Chiziq tekislikka parallel. Bu undagi har bir chiziqqa parallel degani emas. | The line is parallel to the plane. That does not mean it is parallel to every line of that plane. |
| `audio.pick*` | Смотри, какая прямая подсвечена в основании. С нашей она скрещивается. | Asosda qaysi chiziq bo'yalganini kuzatib turing. Bizningi bilan u ayqash. | Watch which line is highlighted in the base. It is skew to ours. |
| `audio.work` | Посчитай, сколько прямых основания действительно ей параллельны. | Asosning nechta chizig'i unga haqiqatan parallel ekanini hisoblang. | Count how many lines of the base are really parallel to it. |
| `work.prompt` | Сколько рёбер основания параллельны прямой A₁B₁? | Asosning nechta qirrasi A₁B₁ chizig'iga parallel? | How many edges of the base are parallel to the line A₁B₁? |
| `work.ok` | Верно. Два: AB и CD. Другие два с ней скрещиваются. | To'g'ri. Ikkita: AB va CD. Qolgan ikkitasi u bilan ayqash. | Correct. Two: AB and CD. The other two are skew to it. |
| `work.hint.1` | Найди рёбра основания, идущие в том же направлении. | Asosning o'sha yo'nalishdagi qirralarini toping. | Find the base edges running in the same direction. |
| `work.hint.2` | Два ребра идут вдоль, два поперёк. | Ikki qirra bo'ylab, ikkitasi ko'ndalang boradi. | Two edges run along, two across. |
| `work.hint.3` | Вдоль идут AB и CD. | Bo'ylab AB va CD boradi. | Along run AB and CD. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 6 · `explain4` · ответ `number` · тег `priznak-bez-vne`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Признак на новом случае | Yangi holatda alomat | The criterion on a new case |
| `show.1.1` | У куба шесть граней | Kubning oltita yog'i bor | A cube has six faces |
| `show.1.2` | две из них содержат нашу прямую | ikkitasi bizning chizig'imizni o'z ichiga oladi | two of them contain our line |
| `show.1.3` | две другие её пересекают | boshqa ikkitasi uni kesib o'tadi | two others cross it |
| `show.2.1` | Остаются те, где нет ни точки | Birorta nuqtasi yo'q yoqlar qoladi | The ones with no point at all remain |
| `show.2.2` | в каждой из них есть прямая, параллельная нашей | ularning har birida bizga parallel chiziq bor | each of them has a line parallel to ours |
| `show.2.3` | и сама прямая в них не лежит | va chiziqning o'zi ularda yotmaydi | and the line itself does not lie in them |
| `audio.mount` | Теперь сам. Признак тот же, случай новый. | Endi o'zingiz. Alomat o'sha, hol yangi. | Now on your own. The same criterion, a new case. |
| `audio.faces*` | Грани перебираются по очереди. Смотри, где прямая лежит, а где пересекает. | Yoqlar navbat bilan ko'rib chiqiladi. Chiziq qayerda yotadi, qayerda kesib o'tadi -- kuzatib turing. | The faces are gone through one by one. Watch where the line lies and where it crosses. |
| `audio.work` | Считай только те грани, где выполнены оба условия признака. | Faqat alomatning ikkala sharti bajarilgan yoqlarni sanang. | Count only the faces where both conditions of the criterion hold. |
| `work.prompt` | Скольким плоскостям граней куба параллельна прямая A₁B₁? | A₁B₁ chizig'i kubning nechta yoq tekisligiga parallel? | To how many face planes of the cube is the line A₁B₁ parallel? |
| `work.ok` | Верно. Двум: основанию и задней грани. В остальных она либо лежит, либо пересекает. | To'g'ri. Ikkitasiga: asos va orqa yoqqa. Qolganlarida u yo yotadi, yo kesib o'tadi. | Correct. Two: the base and the back face. In the rest it either lies or crosses. |
| `work.hint.1` | Отбрось грани, которые содержат саму прямую. | Chiziqning o'zini o'z ichiga olgan yoqlarni chiqarib tashlang. | Discard the faces that contain the line itself. |
| `work.hint.2` | Отбрось те, что проходят через её концы. | Uning uchlaridan o'tadiganlarni chiqarib tashlang. | Discard those passing through its ends. |
| `work.hint.3` | Из шести граней остаются две. | Oltita yoqdan ikkitasi qoladi. | Of the six faces two remain. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `lezhit-znachit-parallel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE |
| `title` | Три случая, и только один параллельность | Uch hol, va faqat biri parallellik | Three cases, and only one is parallelism |
| `show.1.1` | Прямая пересекает плоскость: одна общая точка | Chiziq tekislikni kesadi: bitta umumiy nuqta | The line crosses the plane: one common point |
| `show.1.2` | прямая лежит в плоскости: бесконечно много | chiziq tekislikda yotadi: cheksiz ko'p | the line lies in the plane: infinitely many |
| `show.1.3` | прямая параллельна плоскости: ни одной | chiziq tekislikka parallel: birorta ham yo'q | the line is parallel to the plane: none |
| `show.2.1` | Средний случай и путают с параллельностью | O'rtadagi hol parallellik bilan chalkashtiriladi | The middle case is the one confused with parallelism |
| `show.2.2` | лежащая прямая тоже никуда не выходит из плоскости | yotgan chiziq ham tekislikdan chiqib ketmaydi | a lying line also never leaves the plane |
| `show.2.3` | но общих точек у неё не ноль | lekin uning umumiy nuqtalari nol emas | but its common points are not zero |
| `audio.mount` | Всего три случая, и различает их одно число: количество общих точек. | Hammasi uch hol, va ularni bitta son ajratadi: umumiy nuqtalar soni. | There are three cases in all, and one number tells them apart: the count of common points. |
| `audio.three*` | Три прямые по очереди. Смотри, сколько точек у каждой в закрашенной грани. | Uchta chiziq navbat bilan. Har birining bo'yalgan yoqda nechta nuqtasi bor -- kuzatib turing. | Three lines one by one. Watch how many points each has in the shaded face. |
| `audio.work` | У параллельной ни одной. Это и есть определение из учебника. | Parallelda birorta ham yo'q. Bu darslikdagi ta'rifning o'zi. | The parallel one has none. That is exactly the textbook definition. |
| `work.prompt` | Сколько рёбер куба параллельны плоскости ABCD? | Kubning nechta qirrasi ABCD tekisligiga parallel? | How many edges of the cube are parallel to the plane ABCD? |
| `work.ok` | Верно. Четыре ребра верхней грани. Рёбра основания лежат, вертикальные пересекают. | To'g'ri. Yuqori yoqning to'rt qirrasi. Asos qirralari yotadi, tikkalari kesib o'tadi. | Correct. The four edges of the top face. The base edges lie in it, the vertical ones cross it. |
| `work.hint.1` | Рёбра основания сразу отбрось: они лежат в плоскости. | Asos qirralarini darrov chiqarib tashlang: ular tekislikda yotadi. | Discard the base edges at once: they lie in the plane. |
| `work.hint.2` | Вертикальные рёбра втыкаются в основание. | Tik qirralar asosga sanchiladi. | The vertical edges stick into the base. |
| `work.hint.3` | Остаются только рёбра верхней грани, их четыре. | Faqat yuqori yoqning qirralari qoladi, ular to'rtta. | Only the top face edges remain, and there are four of them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `4` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `priznak-bez-vne`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `title` | Определение и признак | Ta'rif va alomat | The definition and the criterion |
| `probe.question` | Чего не хватает в признаке? | Alomatda nima yetishmaydi? | What is missing from the criterion? |
| `probe.a` [верно] | условия, что прямая не лежит в плоскости | chiziq tekislikda yotmasligi sharti | the condition that the line does not lie in the plane |
| `probe.b` | условия, что прямых в плоскости две | tekislikda ikki chiziq borligi sharti | the condition that there are two lines in the plane |
| `probe.b.hint` | Достаточно одной прямой. Проблема не в их числе, а в том, где сама прямая. | Bitta chiziq kifoya. Muammo ularning sonida emas, chiziqning o'zi qayerda ekanida. | One line is enough. The problem is not their number but where the line itself is. |
| `rule.lawLabel` | Прямая и плоскость | Chiziq va tekislik | A line and a plane |
| `rule.lines.1` | Стр. 98. Если прямая и плоскость не пересекаются, они параллельны. | 98-bet. To'g'ri chiziq bilan tekislik kesishmasa, ular parallel deyiladi. | Page 98. If a line and a plane do not intersect, they are parallel. |
| `rule.lines.2` | Стр. 98, теорема 3.5. Не в плоскости и параллельна прямой в ней — параллельна плоскости. | 98-bet, 3.5-teorema. Tekislikda yotmasa va undagi chiziqqa parallel bo'lsa, tekislikka parallel. | Page 98, theorem 3.5. Not in the plane and parallel to a line in it means parallel to the plane. |
| `rule.lines.3` | Стр. 98, теорема 3.6. Линия пересечения параллельна той прямой. | 98-bet, 3.6-teorema. Kesishish chizig'i o'sha chiziqqa parallel. | Page 98, theorem 3.6. The intersection line is parallel to that line. |
| `audio.mount` | Прежде чем открыть карточку, ответь на один вопрос. | Kartochkani ochishdan oldin bitta savolga javob bering. | Before the card opens, answer one question. |
| `audio.rule*` | Карточка говорит словами учебника. В признаке два условия, и второе стоит первым по важности. | Kartochka darslik so'zlari bilan gapiradi. Alomatda ikki shart bor, va ikkinchisi muhimlik bo'yicha birinchi. | The card speaks in the words of the textbook. The criterion has two conditions, and the second is first in importance. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a ⊄ α,   a ∥ b,   b ⊂ α   ⇒   a ∥ α` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `lezhit-znachit-parallel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЕТЫРЕ ПРЯМЫЕ | TO'RT CHIZIQ | FOUR LINES |
| `title` | Соедини прямую с её случаем | Chiziqni o'z holi bilan biriktiring | Match each line with its case |
| `match.prompt` | Плоскость одна и та же: ABCD | Tekislik bir xil: ABCD | The plane is the same: ABCD |
| `match.a` | параллельна, признак по AB | parallel, AB bo'yicha alomat | parallel, criterion by AB |
| `match.b` | лежит в плоскости | tekislikda yotadi | lies in the plane |
| `match.c` | пересекает в точке A | A nuqtada kesib o'tadi | crosses at the point A |
| `match.d` | параллельна, признак по AC | parallel, AC bo'yicha alomat | parallel, criterion by AC |
| `match.ok` | Все четыре верно. Три случая, и лежащая прямая в параллельные не попадает. | To'rttasi ham to'g'ri. Uch hol, va yotgan chiziq parallellarga kirmaydi. | All four correct. Three cases, and the lying line does not join the parallel ones. |
| `audio.mount` | Четыре прямые куба и одна плоскость. У каждой прямой свой случай. | Kubning to'rt chizig'i va bitta tekislik. Har chiziqning o'z holi bor. | Four lines of the cube and one plane. Each line has its own case. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `A₁B₁` · `CD` · `AA₁` · `A₁C₁` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `priznak-bez-vne`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMLAB | STEP BY STEP |
| `title` | Докажи по признаку | Alomat bo'yicha isbotlang | Prove it by the criterion |
| `order.prompt` | Расставь по порядку | Tartib bilan joylashtiring | Put them in order |
| `order.s1` | прямая в плоскости не лежит | chiziq tekislikda yotmaydi | the line does not lie in the plane |
| `order.s2` | в плоскости есть параллельная ей прямая | tekislikda unga parallel chiziq bor | the plane has a line parallel to it |
| `order.s3` | по признаку прямая параллельна плоскости | alomat bo'yicha chiziq tekislikka parallel | by the criterion the line is parallel to the plane |
| `order.ok` | Верно. Сначала проверяется, где прямая, и только потом ищется параллельная. | To'g'ri. Avval chiziq qayerda ekani tekshiriladi, keyin parallel izlanadi. | Correct. First we check where the line is, and only then look for a parallel one. |
| `order.bad` | Порядок другой. Вывод не может стоять раньше условий. | Tartib boshqacha. Xulosa shartlardan oldin turolmaydi. | The order is different. The conclusion cannot stand before the conditions. |
| `audio.mount` | Докажем, что ребро D₁C₁ параллельно основанию. Признак называет два условия. | D₁C₁ qirrasi asosga parallel ekanini isbotlaymiz. Alomat ikki shartni ataydi. | Let us prove that the edge D₁C₁ is parallel to the base. The criterion names two conditions. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `D₁C₁` · `ABCD` |
| `order.mark` | `D₁C₁ ∥ ABCD` |

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
| `task.prompt` | Сколько рёбер куба параллельны плоскости BCC₁B₁? | Kubning nechta qirrasi BCC₁B₁ tekisligiga parallel? | How many edges of the cube are parallel to the plane BCC₁B₁? |
| `task.ok` | Верно. Четыре: AD, A₁D₁, AA₁ и DD₁. | To'g'ri. To'rtta: AD, A₁D₁, AA₁ va DD₁. | Correct. Four: AD, A₁D₁, AA₁ and DD₁. |
| `task.hint.1` | Четыре ребра лежат в самой этой грани, их не считаем. | To'rt qirra shu yoqning o'zida yotadi, ularni sanamaymiz. | Four edges lie in that face itself; we do not count them. |
| `task.hint.2` | Рёбра, идущие поперёк, втыкаются в эту плоскость. | Ko'ndalang ketadigan qirralar bu tekislikka sanchiladi. | The edges running across stick into that plane. |
| `task.hint.3` | Остаются рёбра противоположной грани, их четыре. | Qarshi yoqning qirralari qoladi, ular to'rtta. | The edges of the opposite face remain, and there are four. |
| `audio.mount` | Прибора здесь нет. Сначала порядок записей, потом ответ. | Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob. | There is no instrument here. First the order of the lines, then the answer. |
| `audio.next` | Теперь сама задача. Пиши число. | Endi masalaning o'zi. Sonni yozing. | Now the task itself. Write the number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.answer` | `4` |
| `order.items` | `A₁D₁ ⊄ BCC₁B₁` · `A₁D₁ ∥ AD` · `AD ⊂ ABCD` · `A₁D₁ ∥ BCC₁B₁` |
| `order.answer` | `A₁D₁ ⊄ BCC₁B₁  A₁D₁ ∥ AD  AD ⊂ ABCD  A₁D₁ ∥ BCC₁B₁` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Все шаги верны, вывод неверен | Hamma qadam to'g'ri, xulosa noto'g'ri | Every step is right, the conclusion is wrong |
| `hint.r1` | Это дано и проверено на экране три. | Bu berilgan va uchinchi ekranda tekshirilgan. | This is given and was checked on screen three. |
| `hint.r2` | Верно: это ребро действительно лежит в основании. | To'g'ri: bu qirra haqiqatan asosda yotadi. | Correct: that edge really lies in the base. |
| `hint.r3` | Тоже верно, эти две прямые лежат в основании обе. | Bu ham to'g'ri, bu ikki chiziq ham asosda yotadi. | Also correct, both of these lines lie in the base. |
| `proof` | Ошибка в последней строке. Прямая параллельна плоскости, но не каждой прямой в ней: с AD она скрещивается. | Xato oxirgi satrda. Chiziq tekislikka parallel, lekin undagi har chiziqqa emas: AD bilan u ayqash. | The mistake is in the last line. The line is parallel to the plane but not to every line in it: with AD it is skew. |
| `entry.prompt` | Сколько плоскостей проходит через прямые A₁B₁ и AD? | A₁B₁ va AD chiziqlari orqali nechta tekislik o'tadi? | How many planes pass through the lines A₁B₁ and AD? |
| `entry.ok` | Верно. Ни одной: они скрещиваются, а через скрещивающиеся прямые плоскость не проходит. | To'g'ri. Birorta ham yo'q: ular ayqash, ayqash chiziqlar orqali esa tekislik o'tmaydi. | Correct. None: they are skew, and no plane passes through skew lines. |
| `entry.hint.1` | Попробуй найти плоскость, в которой лежат обе прямые. | Ikkala chiziq yotgan tekislikni topishga urinib ko'ring. | Try to find a plane in which both lines lie. |
| `entry.hint.2` | Одна идёт по верхней грани, другая по нижней и поперёк. | Biri yuqori yoq bo'ylab, ikkinchisi pastda va ko'ndalang boradi. | One runs along the top face, the other below and across. |
| `entry.hint.3` | Такой плоскости нет: это скрещивающиеся прямые. | Bunday tekislik yo'q: bular ayqash chiziqlar. | There is no such plane: these are skew lines. |
| `audio.mount` | Доказательство выписано в четыре строки. Найди ту, где появилась ошибка. | Isbot to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping. | The proof is written in four lines. Find the one where the mistake appeared. |
| `audio.next` | Теперь покажи это числом. | Endi buni son bilan ko'rsating. | Now show it with a number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `A₁B₁ ∥ ABCD` |
| `row.r2` | `AD ⊂ ABCD` |
| `row.r3` | `A₁B₁, AD — ?` |
| `row.r4` | `A₁B₁ ∥ AD` |
| `answerId` | `r4` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБРАТНАЯ ЗАДАЧА | TESKARI MASALA | THE REVERSE TASK |
| `title` | Теперь ищешь ты | Endi siz izlaysiz | Now you do the searching |
| `entry.prompt` | Сколько рёбер куба пересекают плоскость ABCD? | Kubning nechta qirrasi ABCD tekisligini kesib o'tadi? | How many edges of the cube cross the plane ABCD? |
| `entry.ok` | Верно. Четыре вертикальных ребра, каждое в своей вершине. | To'g'ri. To'rt tik qirra, har biri o'z uchida. | Correct. The four vertical edges, each at its own vertex. |
| `entry.hint.1` | Пересекает значит имеет ровно одну общую точку. | Kesib o'tadi degani aynan bitta umumiy nuqtasi bor. | Crossing means having exactly one common point. |
| `entry.hint.2` | Рёбра основания лежат, рёбра верхней грани параллельны. | Asos qirralari yotadi, yuqori yoq qirralari parallel. | The base edges lie in it, the top edges are parallel. |
| `entry.hint.3` | Остаются вертикальные, их четыре. | Tik qirralar qoladi, ular to'rtta. | The vertical ones remain, and there are four. |
| `multi.prompt` | Отметь все прямые, параллельные плоскости ABCD | ABCD tekisligiga parallel hamma chiziqni belgilang | Mark every line parallel to the plane ABCD |
| `multi.title` | Две из четырёх | To'rttadan ikkitasi | Two out of four |
| `multi.c.hint` | Это ребро лежит в самой плоскости, а лежащая прямая параллельной не бывает. | Bu qirra tekislikning o'zida yotadi, yotgan chiziq esa parallel bo'lmaydi. | That edge lies in the plane itself, and a lying line is never parallel. |
| `multi.d.hint` | Это ребро втыкается в плоскость в вершине A. | Bu qirra A uchida tekislikka sanchiladi. | That edge sticks into the plane at the vertex A. |
| `multi.ok` | Верно. Параллельны те, у которых с плоскостью нет ни одной общей точки. | To'g'ri. Tekislik bilan birorta umumiy nuqtasi yo'qlari parallel. | Correct. Parallel are those with no common point with the plane at all. |
| `audio.mount` | До этого прямую давали тебе. Теперь перебираешь рёбра сам. | Bungacha chiziqni sizga berardilar. Endi qirralarni o'zingiz ko'rib chiqasiz. | Until now the line was given to you. Now you go through the edges yourself. |
| `audio.work` | Обрати внимание: три случая делят все двенадцать рёбер без остатка. | E'tibor bering: uch hol o'n ikki qirrani qoldiqsiz bo'lib chiqadi. | Notice: the three cases divide all twelve edges with nothing left over. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `ABCD` |
| `entry.answer` | `4` |
| `multi.a` [верно] | `A₁B₁` |
| `multi.b` [верно] | `C₁D₁` |
| `multi.c` | `AB` |
| `multi.d` | `AA₁` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `parallel-vsem-pryamym`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | THE BLITZ |
| `title` | Четыре вопроса подряд | Ketma-ket to'rtta savol | Four questions in a row |
| `q1.prompt` | Прямая параллельна плоскости. Сколько у них общих точек? | Chiziq tekislikka parallel. Ularning nechta umumiy nuqtasi bor? | A line is parallel to a plane. How many common points have they? |
| `q1.a` [верно] | ни одной | birorta ham yo'q | none |
| `q1.b` | одна | bitta | one |
| `q1.b.hint` | Одна общая точка это пересечение, а не параллельность. | Bitta umumiy nuqta bu kesishish, parallellik emas. | One common point is an intersection, not parallelism. |
| `q1.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.c.hint` | Бесконечно много у прямой, лежащей в плоскости. | Cheksiz ko'p tekislikda yotgan chiziqda. | Infinitely many belongs to a line lying in the plane. |
| `q1.d` | зависит от ракурса | rakursga bog'liq | it depends on the angle |
| `q1.d.hint` | Ракурс меняет чертёж, а не сцену. | Rakurs chizmani o'zgartiradi, sahnani emas. | The angle changes the drawing, not the scene. |
| `q2.prompt` | В признаке параллельности прямой и плоскости условий… | Chiziq va tekislik parallelligi alomatida shart... | In the criterion for a line and a plane the conditions number... |
| `q2.a` [верно] | два | ikkita | two |
| `q2.b` | одно | bitta | one |
| `q2.b.hint` | Одного мало: прямая основания тоже параллельна прямой в плоскости. | Bittasi kam: asos chizig'i ham tekislikdagi chiziqqa parallel. | One is not enough: a base line is also parallel to a line in the plane. |
| `q2.c` | три | uchta | three |
| `q2.c.hint` | Третьего условия учебник не называет. | Uchinchi shartni darslik atamaydi. | The textbook names no third condition. |
| `q2.d` | ни одного, это определение | birorta ham yo'q, bu ta'rif | none, it is a definition |
| `q2.d.hint` | Определение и признак это разные вещи: определение про общие точки. | Ta'rif va alomat boshqa narsa: ta'rif umumiy nuqtalar haqida. | A definition and a criterion differ: the definition is about common points. |
| `q3.prompt` | Прямая параллельна плоскости. Значит она параллельна… | Chiziq tekislikka parallel. Demak u parallel... | A line is parallel to a plane. So it is parallel to... |
| `q3.a` [верно] | не каждой прямой этой плоскости | bu tekislikning har chizig'iga emas | not to every line of that plane |
| `q3.a.ok` | Да: с частью прямых плоскости она скрещивается. | Ha: tekislikning bir qism chiziqlari bilan u ayqash. | Yes: with some of the plane's lines it is skew. |
| `q3.b` | каждой прямой этой плоскости | bu tekislikning har chizig'iga | to every line of that plane |
| `q3.b.hint` | Проверь на кубе: с поперечным ребром основания она скрещивается. | Kubda tekshiring: asosning ko'ndalang qirrasi bilan u ayqash. | Check on the cube: with the crosswise base edge it is skew. |
| `q3.c` | ровно одной прямой | aynan bitta chiziqqa | to exactly one line |
| `q3.c.hint` | Их две в кубе, а в плоскости вообще бесконечно много. | Kubda ikkita, tekislikda esa umuman cheksiz ko'p. | There are two in the cube, and infinitely many in the plane. |
| `q3.d` | ни одной прямой | birorta chiziqqa ham emas | to no line at all |
| `q3.d.hint` | Хотя бы одна есть всегда: она и даёт признак. | Hech bo'lmasa bittasi doim bor: u alomat beradi. | At least one always exists: that is what gives the criterion. |
| `q4.prompt` | Прямая лежит в плоскости. Она параллельна плоскости? | Chiziq tekislikda yotadi. U tekislikka parallelmi? | A line lies in a plane. Is it parallel to the plane? |
| `q4.a` [верно] | нет, это третий случай | yo'q, bu uchinchi hol | no, this is the third case |
| `q4.b` | да, ведь она не выходит | ha, chunki u chiqib ketmaydi | yes, since it never leaves |
| `q4.b.hint` | Не выходит, но общих точек бесконечно много, а у параллельной ни одной. | Chiqib ketmaydi, lekin umumiy nuqtalari cheksiz ko'p, parallelda esa birorta ham yo'q. | It never leaves, but it has infinitely many common points, and a parallel one has none. |
| `q4.c` | да, по признаку | ha, alomat bo'yicha | yes, by the criterion |
| `q4.c.hint` | Признак требует, чтобы прямая в плоскости не лежала. | Alomat chiziq tekislikda yotmasligini talab qiladi. | The criterion requires the line not to lie in the plane. |
| `q4.d` | зависит от плоскости | tekislikka bog'liq | it depends on the plane |
| `q4.d.hint` | Не зависит: лежащая прямая параллельной не бывает никогда. | Bog'liq emas: yotgan chiziq hech qachon parallel bo'lmaydi. | It does not depend: a lying line is never parallel. |
| `audio.mount` | Четыре вопроса, и они идут в оценку. | To'rtta savol, va ular baholanadi. | Four questions, and they count towards the score. |
| `q1.done` | Ни одной. Это определение. | Birorta ham yo'q. Bu ta'rif. | None. That is the definition. |
| `q2.done` | Два условия, и второе про то, где сама прямая. | Ikki shart, va ikkinchisi chiziqning o'zi qayerda ekani haqida. | Two conditions, and the second is about where the line itself is. |
| `q3.done` | Не каждой: часть прямых плоскости с ней скрещивается. | Har chiziqqa emas: tekislikning bir qismi u bilan ayqash. | Not to every one: some of the plane's lines are skew to it. |
| `q4.done` | Лежит — значит не параллельна. Случаи не пересекаются. | Yotadi -- demak parallel emas. Hollar kesishmaydi. | Lying means not parallel. The cases do not overlap. |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | XULOSA | THE SUMMARY |
| `title` | Три случая и признак из двух условий | Uch hol va ikki shartli alomat | Three cases and a two-condition criterion |
| `can.1` | Различаю три случая по числу общих точек | Uch holni umumiy nuqtalar soniga qarab ajrataman | I tell the three cases apart by the count of common points |
| `can.2` | Применяю признак и проверяю оба условия | Alomatni qo'llaman va ikkala shartni tekshiraman | I apply the criterion and check both conditions |
| `can.3` | Знаю, что параллельность плоскости не даёт параллельности каждой прямой | Tekislikka parallellik har chiziqqa parallellik bermasligini bilaman | I know parallelism to a plane gives no parallelism to every line |
| `can.4` | Не путаю лежащую прямую с параллельной | Yotgan chiziqni parallel bilan chalkashtirmayman | I do not confuse a lying line with a parallel one |
| `levels.full` | Прошёл всё и разобрал ловушку | Hammasidan o'tdingiz va tuzoqni ochdingiz | Everything done, the trap taken apart |
| `levels.gap` | Признак работает, скрещивающиеся ещё путаются | Alomat ishlaydi, ayqash chiziqlar hali chalkashadi | The criterion works, skew lines still get mixed up |
| `levels.back` | Стоит вернуться к экрану четыре: второе условие признака | To'rtinchi ekranga qaytish kerak: alomatning ikkinchi sharti | Worth going back to screen four: the second condition |
| `bridge` | Дальше параллельность двух плоскостей: там признак снова из двух условий, и снова теряют второе. | Keyingisi ikki tekislikning parallelligi: unda alomat yana ikki shartdan, va yana ikkinchisi yo'qoladi. | Next comes parallelism of two planes: there the criterion again has two conditions, and again the second gets lost. |
| `lifehack` | Считать удобно по случаям: у куба двенадцать рёбер, и относительно любой грани четыре лежат в ней, четыре пересекают, четыре параллельны. Проверка суммой. | Hollar bo'yicha sanash qulay: kubning o'n ikki qirrasi bor, va har yoqqa nisbatan to'rttasi unda yotadi, to'rttasi kesadi, to'rttasi parallel. Tekshiruv yig'indi bilan. | Counting by cases is handy: a cube has twelve edges, and for any face four lie in it, four cross it, four are parallel. Check by the sum. |
| `sheetTitle` | Шпаргалка урока | Dars shpargalkasi | The lesson sheet |
| `sheetSrc` | геометрия 2022, стр. 98 | geometriya 2022, 98-bet | geometry 2022, page 98 |
| `audio.mount` | Прогноз с первого экрана и результат стоят рядом. | Birinchi ekrandagi taxmin va natija yonma-yon turadi. | The guess from screen one and the result stand side by side. |
| `audio.next` | Шпаргалка собрана по учебнику. Ниже видно, что умеешь. | Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi. | The sheet is put together from the textbook. Below you can see what you can do. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `1` |
| `hook.b` | `0` |
| `proved` | `0` |
| `law` | `a ⊄ α,   a ∥ b,   b ⊂ α   ⇒   a ∥ α` |
| `sheet.1` | `a ∩ α = ∅   ⇒   a ∥ α` |
| `sheet.2` | `A₁B₁ ∥ AB,   AB ⊂ ABCD   ⇒   A₁B₁ ∥ ABCD` |
| `sheet.3` | `AB ⊂ ABCD   ⇒   AB ∦ ABCD` |
| `sheet.4` | `A₁B₁ ∦ AD,   A₁B₁ ∩ AD = ∅` |
| `sheet.5` | `12 = 4 + 4 + 4` |
