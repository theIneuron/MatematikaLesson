# Урок 39 — Взаимное расположение прямых. Скрещивающиеся · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS38_40_SKELET.md` §8. Опора: учебник геометрии 2022, §11 стр. 88, **§12
`Ayqash to'g'ri chiziqlar` стр. 95**, §13 стр. 98, §14 стр. 103.

**Главное решение урока.** Скрещивающиеся прямые — единственный случай, которого нет на
плоскости, и единственный, который на неподвижном чертеже неотличим от пересечения. Учебник сам
предлагает сцену: 2-rasm на стр. 95 — скрещивающиеся рёбра куба. Мы берём тот же куб и добавляем
то, чего в книге быть не может: поворот.

**Определение и признак взяты дословно** (стр. 95). Обозначение `a ∸ b` тоже книжное.

**Компрессия.** В строке плана одно слово «параллельность», в учебнике это четыре параграфа.
В урок взято ядро — скрещивающиеся; признаки параллельности прямой с плоскостью и двух
плоскостей входят карточкой правила, своего экрана-объяснения не получают. Решение методиста
ожидается, см. `DARS38_40_SKELET.md` §11 пункт 3.

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | КУБ | KUB | THE CUBE |
| `title` | Пересекаются или нет | Kesishadimi yoki yo'q | Do they meet or not |
| `row.a.name` | пересекаются | kesishadi | they meet |
| `row.b.name` | не пересекаются и не параллельны | kesishmaydi va parallel emas | they neither meet nor are parallel |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём куб. | Javobingiz yozib olindi. Endi kubni buramiz. | Your answer is saved. Now we will rotate the cube. |
| `audio.mount` | Два ребра куба подсвечены. На этом чертеже они выглядят так, будто встречаются. | Kubning ikki qirrasi yoritilgan. Bu chizmada ular uchrashayotgandek ko'rinadi. | Two edges of the cube are highlighted. On this drawing they look as if they meet. |
| `audio.r1` | Первая запись верит чертежу: рёбра сходятся, значит пересекаются. | Birinchi yozuv chizmaga ishonadi: qirralar tutashadi, demak kesishadi. | The first reading trusts the drawing: the edges come together, so they meet. |
| `audio.r2` | Вторая говорит, что общей точки нет и параллельными они тоже не являются. | Ikkinchisi umumiy nuqta yo'q va ular parallel ham emas deydi. | The second says there is no common point and they are not parallel either. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB,  B₁C₁` |
| `row.a.value` | `AB ∩ B₁C₁ = M` |
| `row.b.value` | `AB ∸ B₁C₁` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед кубом | Kubdan oldin uch savol | Three questions before the cube |
| `q1.prompt` | Сколько плоскостей проходит через две пересекающиеся прямые? | Ikki kesishuvchi to'g'ri chiziq orqali nechta tekislik o'tadi? | How many planes pass through two intersecting lines? |
| `q1.a` [верно] | одна | bitta | one |
| `q1.b` | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.b.hint` | Бесконечно много проходит через одну прямую, а тут их две. | Cheksiz ko'p bitta to'g'ri chiziq orqali o'tadi, bu yerda esa ikkita. | Infinitely many pass through one line, and here there are two. |
| `q1.c` | ни одной | bitta ham yo'q | none |
| `q1.c.hint` | Точка пересечения и по точке с каждой прямой уже задают плоскость. | Kesishish nuqtasi va har chiziqdan bittadan nuqta allaqachon tekislikni beradi. | The meeting point plus a point on each line already fix a plane. |
| `q1.d` | две | ikkita | two |
| `q1.d.hint` | Двух разных плоскостей через них не провести. | Ular orqali ikki xil tekislik o'tkazib bo'lmaydi. | Two different planes cannot be drawn through them. |
| `q2.prompt` | Где лежат две параллельные прямые? | Ikki parallel to'g'ri chiziq qayerda yotadi? | Where do two parallel lines lie? |
| `q2.a` [верно] | в одной плоскости | bitta tekislikda | in one plane |
| `q2.b` | в разных плоскостях | har xil tekisliklarda | in different planes |
| `q2.b.hint` | Тогда они не были бы параллельными: параллельность определена в плоскости. | U holda ular parallel bo'lmasdi: parallellik tekislikda aniqlangan. | Then they would not be parallel: parallelism is defined in a plane. |
| `q2.c` | это неизвестно | bu noma'lum | that is unknown |
| `q2.c.hint` | Это известно точно, и это часть определения. | Bu aniq ma'lum, va bu ta'rifning bir qismi. | It is known exactly, and it is part of the definition. |
| `q2.d` | всегда в горизонтальной | doim gorizontalda | always in a horizontal one |
| `q2.d.hint` | Плоскость может быть какой угодно, важно что она одна. | Tekislik istalgancha bo'lishi mumkin, muhimi u bitta. | The plane can be any, what matters is that it is one. |
| `q3.prompt` | Что говорит третья аксиома? | Uchinchi aksioma nima deydi? | What does the third axiom say? |
| `q3.a` [верно] | у двух плоскостей с общей точкой есть общая прямая | umumiy nuqtali ikki tekislikning umumiy to'g'ri chizig'i bor | two planes with a common point share a line |
| `q3.b` | две плоскости всегда пересекаются | ikki tekislik doim kesishadi | two planes always meet |
| `q3.b.hint` | Могут и не иметь общих точек вовсе. | Umuman umumiy nuqtasi bo'lmasligi ham mumkin. | They may have no common points at all. |
| `q3.c` | через три точки проходит плоскость | uch nuqta orqali tekislik o'tadi | a plane passes through three points |
| `q3.c.hint` | Это первая аксиома, а спросили про третью. | Bu birinchi aksioma, savol esa uchinchisi haqida. | That is the first axiom, and the question is about the third. |
| `q3.d` | прямая лежит в плоскости | to'g'ri chiziq tekislikda yotadi | a line lies in a plane |
| `q3.d.hint` | Это вторая аксиома. | Bu ikkinchi aksioma. | That is the second axiom. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a ∩ b = M   →   α` |
| `q2.done` | `a ∥ b   →   α` |
| `q3.done` | `α ∩ β = a` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Поворот разводит рёбра.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Поверни куб и посмотри на рёбра | Kubni burib qirralarga qarang | Rotate the cube and look at the edges |
| `show.1.1` | на этом чертеже рёбра пересеклись | bu chizmada qirralar kesishdi | on this drawing the edges cross |
| `show.1.2` | кажется, что у них есть общая точка | ularning umumiy nuqtasi bordek tuyuladi | it seems they have a common point |
| `show.1.3` | поверни куб и следи за ними | kubni buring va ularni kuzating | rotate the cube and watch them |
| `show.2.1` | рёбра разошлись | qirralar ajraldi | the edges came apart |
| `show.2.2` | одно идёт понизу, другое поверху | biri pastdan, ikkinchisi tepadan boradi | one runs below, the other above |
| `show.2.3` | общей точки нет ни одной | umumiy nuqta bitta ham yo'q | there is not a single common point |
| `audio.mount` | Два ребра куба. Пока чертёж неподвижен, про них можно сказать что угодно. | Kubning ikki qirrasi. Chizma qimirlamas ekan, ular haqida istalgan narsani aytish mumkin. | Two edges of the cube. While the drawing stands still, anything can be said about them. |
| `audio.spin*` | Поверни куб и следи за подсвеченными рёбрами. Первое идёт по нижней грани, второе по верхней, и как только куб развернулся, между ними стало видно расстояние. Общей точки у них нет: одно ребро проходит ниже другого. На первом чертеже они казались сошедшимися только потому, что мы смотрели вдоль удачного направления. Вот главный вывод урока, и он не про рёбра. На плоском чертеже пространства пересечение можно увидеть там, где его нет. Проверяется это поворотом, а не внимательностью. | Kubni buring va yoritilgan qirralarni kuzating. Birinchisi pastki yoq bo'ylab, ikkinchisi yuqorigi bo'ylab boradi, va kub burilishi bilan ular orasida masofa ko'rindi. Ularning umumiy nuqtasi yo'q: bir qirra ikkinchisidan pastroqdan o'tadi. Birinchi chizmada ular faqat qulay yo'nalish bo'ylab qaraganimiz uchun tutashgandek ko'ringan. Darsning asosiy xulosasi shu, va u qirralar haqida emas. Fazoning yassi chizmasida kesishishni u yo'q joyda ham ko'rish mumkin. Bu diqqat bilan emas, burilish bilan tekshiriladi. | Rotate the cube and watch the highlighted edges. The first runs along the bottom face, the second along the top, and as soon as the cube turned, a distance appeared between them. They have no common point: one edge passes below the other. On the first drawing they seemed to meet only because we were looking along a convenient direction. Here is the main conclusion of the lesson, and it is not about edges. On a flat drawing of space you can see an intersection where there is none. This is checked by rotating, not by being careful. |
| `audio.work` | Посчитай сам. Сколько общих точек у этих двух рёбер? | O'zingiz hisoblang. Bu ikki qirraning nechta umumiy nuqtasi bor? | Work it out yourself. How many common points do these two edges have? |
| `work.prompt` | Сколько у них общих точек? | Ularning nechta umumiy nuqtasi bor? | How many common points do they have? |
| `work.ok` | Ни одной. Одно ребро проходит ниже другого, и поворот это показал. | Bitta ham yo'q. Bir qirra ikkinchisidan pastroqdan o'tadi, burilish buni ko'rsatdi. | None. One edge passes below the other, and the rotation showed it. |
| `work.hint.1` | Поверни куб и посмотри, встречаются ли рёбра. | Kubni buring va qirralar uchrashadimi, qarang. | Rotate the cube and see whether the edges meet. |
| `work.hint.2` | Одно ребро на нижней грани, другое на верхней. | Bir qirra pastki yoqda, ikkinchisi yuqorigida. | One edge is on the bottom face, the other on the top. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 4 · `explain2` · ответ `lead` · тег `ayqash-kak-parallel`

Разграничение: параллельные и скрещивающиеся.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Тоже не пересекаются, но не параллельны | Bular ham kesishmaydi, lekin parallel emas | They do not meet either, but are not parallel |
| `show.1.1` | у параллельных общих точек тоже нет | parallellarning ham umumiy nuqtasi yo'q | parallel lines have no common points either |
| `show.1.2` | но они лежат в одной плоскости | lekin ular bitta tekislikda yotadi | but they lie in one plane |
| `show.1.3` | эту плоскость можно провести | bu tekislikni o'tkazish mumkin | that plane can be drawn |
| `show.2.1` | для наших рёбер такой плоскости нет | bizning qirralar uchun bunday tekislik yo'q | for our edges there is no such plane |
| `show.2.2` | ни одна плоскость не содержит оба | birorta tekislik ikkalasini ham saqlamaydi | no plane contains both of them |
| `show.2.3` | это и есть скрещивающиеся | ayqash to'g'ri chiziqlar shu | these are exactly skew lines |
| `audio.mount` | Отсутствие общих точек ещё ничего не решает. Параллельные тоже не пересекаются. | Umumiy nuqtaning yo'qligi hali hech nimani hal qilmaydi. Parallellar ham kesishmaydi. | Having no common points settles nothing yet. Parallel lines do not meet either. |
| `audio.two*` | Возьмём сначала два ребра нижней грани, которые лежат друг напротив друга. Общих точек у них нет, и вся нижняя грань это плоскость, в которой лежат оба. Это параллельные. Теперь вернёмся к нашим рёбрам. Общих точек тоже нет, но попробуй найти плоскость, в которой лежали бы оба. Поворачивай куб и смотри: одно ребро внизу, другое наверху, и никакая плоскость их не соберёт. Прямые, которые не лежат в одной плоскости, называются скрещивающимися. Это третий случай, и на плоскости его не бывает вовсе: там любые две прямые либо пересекаются, либо параллельны. | Avval pastki yoqning bir-biriga qarama-qarshi yotgan ikki qirrasini olamiz. Ularning umumiy nuqtasi yo'q, butun pastki yoq esa ikkalasi yotgan tekislik. Bular parallel. Endi o'z qirralarimizga qaytamiz. Umumiy nuqta ham yo'q, lekin ikkalasi yotadigan tekislikni topib ko'ring. Kubni buring va qarang: bir qirra pastda, ikkinchisi tepada, va hech qanday tekislik ularni yig'a olmaydi. Bitta tekislikda yotmaydigan to'g'ri chiziqlar ayqash deyiladi. Bu uchinchi hol, va tekislikda u umuman bo'lmaydi: u yerda istalgan ikki chiziq yo kesishadi, yo parallel. | First take two edges of the bottom face lying opposite each other. They have no common points, and the whole bottom face is a plane containing both. These are parallel. Now back to our edges. There are no common points either, but try to find a plane containing both. Rotate the cube and look: one edge is below, the other above, and no plane will gather them. Lines that do not lie in one plane are called skew. This is the third case, and on a plane it does not occur at all: there any two lines either meet or are parallel. |
| `audio.work` | Поверни куб и ответь: чем эти рёбра отличаются от параллельных? | Kubni buring va javob bering: bu qirralar parallellardan nimasi bilan farq qiladi? | Rotate the cube and answer: how do these edges differ from parallel ones? |
| `pick.prompt` | Чем они отличаются от параллельных? | Ular parallellardan nimasi bilan farq qiladi? | How do they differ from parallel ones? |
| `pick.a` | у них есть общая точка | ularning umumiy nuqtasi bor | they have a common point |
| `pick.a.hint` | Общей точки нет, ты сам её искал поворотом. | Umumiy nuqta yo'q, uni o'zingiz burib izladingiz. | There is no common point, you looked for it by rotating yourself. |
| `pick.b` [верно] | нет общей плоскости | umumiy tekislik yo'q | there is no common plane |
| `pick.c` | они разной длины | ular har xil uzunlikda | they have different lengths |
| `pick.c.hint` | У куба все рёбра равны, а дело не в длине. | Kubning barcha qirralari teng, gap uzunlikda emas. | All edges of a cube are equal, and length is not the point. |
| `pick.ok` | Верно. Общая плоскость есть у параллельных и у пересекающихся, а у этих её нет. | To'g'ri. Umumiy tekislik parallellarda va kesishuvchilarda bor, bularda esa yo'q. | Correct. Parallel and intersecting lines have a common plane, these do not. |

**Формулы**

| Ключ | Значение |
|---|---|
| `mark` | `AB ∸ B₁C₁` |

---

## Экран 5 · `explain3` · ответ `number` · тег `ayqash-kak-parallel`

Признак скрещивающихся, теорема 3.4.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Признак: как узнать наверняка | Alomat: qanday aniq bilish mumkin | The criterion: how to know for sure |
| `show.1.1` | одна прямая лежит в плоскости | bir to'g'ri chiziq tekislikda yotadi | one line lies in a plane |
| `show.1.2` | вторая пересекает эту плоскость | ikkinchisi bu tekislikni kesib o'tadi | the second crosses that plane |
| `show.1.3` | точка пересечения не на первой прямой | kesishish nuqtasi birinchi chiziqda emas | the crossing point is not on the first line |
| `show.2.1` | этого хватает для вывода | bu xulosa uchun yetarli | that is enough for the conclusion |
| `show.2.2` | прямые скрещиваются | to'g'ri chiziqlar ayqash | the lines are skew |
| `show.2.3` | поворот больше не нужен | burilish endi kerak emas | no rotation is needed any more |
| `audio.mount` | Поворот показал, что рёбра скрещиваются. Но крутить каждый раз нельзя: нужен признак. | Burilish qirralar ayqash ekanini ko'rsatdi. Lekin har safar burib bo'lmaydi: alomat kerak. | The rotation showed the edges are skew. But rotating every time is not an option: a criterion is needed. |
| `audio.sign*` | Признак такой. Пусть первая прямая лежит в некоторой плоскости, а вторая пересекает эту плоскость в точке, которая на первой прямой не лежит. Тогда прямые скрещиваются. Посмотри, почему. Если бы они лежали в одной плоскости, то эта плоскость содержала бы и первую прямую, и ту точку пересечения. Но такая плоскость уже есть, и она у нас взята с самого начала. Значит две плоскости совпали бы, и вторая прямая целиком легла бы в исходную. А она её пересекает, то есть в ней не лежит. Противоречие. Теперь поворот не нужен: три условия проверены, и вывод сделан рассуждением. | Alomat shunday. Birinchi to'g'ri chiziq biror tekislikda yotsin, ikkinchisi esa bu tekislikni birinchi chiziqda yotmagan nuqtada kesib o'tsin. U holda chiziqlar ayqash bo'ladi. Nega ekanini ko'ring. Agar ular bitta tekislikda yotganda, bu tekislik birinchi chiziqni ham, o'sha kesishish nuqtasini ham saqlardi. Lekin bunday tekislik allaqachon bor, va u boshidanoq olingan. Demak ikki tekislik ustma-ust tushardi, ikkinchi chiziq esa butunlay dastlabkisiga yotardi. U esa uni kesib o'tadi, ya'ni unda yotmaydi. Ziddiyat. Endi burilish kerak emas: uch shart tekshirildi va xulosa mulohaza bilan chiqarildi. | The criterion goes like this. Let the first line lie in some plane, and let the second cross that plane at a point not lying on the first line. Then the lines are skew. See why. If they lay in one plane, that plane would contain both the first line and the crossing point. But such a plane already exists, it was taken from the start. So the two planes would coincide and the second line would lie entirely in the original one. Yet it crosses it, that is, does not lie in it. A contradiction. Now no rotation is needed: three conditions were checked and the conclusion came by reasoning. |
| `audio.work` | Посчитай сам. Сколько условий надо проверить, чтобы применить признак? | O'zingiz hisoblang. Alomatni qo'llash uchun nechta shartni tekshirish kerak? | Work it out yourself. How many conditions must be checked to apply the criterion? |
| `work.prompt` | Сколько условий у признака? | Alomatning nechta sharti bor? | How many conditions does the criterion have? |
| `work.ok` | Три. Первая в плоскости, вторая пересекает её, точка пересечения не на первой. | Uchta. Birinchisi tekislikda, ikkinchisi uni kesadi, kesishish nuqtasi birinchisida emas. | Three. The first is in the plane, the second crosses it, and the crossing point is not on the first. |
| `work.hint.1` | Перечитай признак и посчитай, сколько в нём требований. | Alomatni qayta o'qing va undagi talablarni sanang. | Read the criterion again and count the requirements in it. |
| `work.hint.2` | Последнее условие про точку пересечения тоже считается. | Kesishish nuqtasi haqidagi oxirgi shart ham sanaladi. | The last condition about the crossing point counts too. |
| `work.hint.3` | Три. | Uch. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `a ⊂ α,   b ∩ α = M,   M ∉ a` |
| `work.answer` | `3` |

---

## Экран 6 · `explain4` · ответ `number` · тег `ayqash-kak-parallel`

Сам: сколько рёбер скрещивается с данным.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Посчитай на кубе | Kubda sanang | Count it on the cube |
| `show.1.1` | у куба двенадцать рёбер | kubning o'n ikki qirrasi bor | a cube has twelve edges |
| `show.1.2` | одно из них взято | ulardan bittasi olingan | one of them is taken |
| `show.1.3` | остальные одиннадцать надо разобрать | qolgan o'n bittasini ajratish kerak | the remaining eleven have to be sorted |
| `show.2.1` | три ребра ему параллельны | uchta qirra unga parallel | three edges are parallel to it |
| `show.2.2` | четыре его пересекают | to'rttasi uni kesadi | four cross it |
| `show.2.3` | остальные скрещиваются | qolganlari ayqash | the rest are skew |
| `audio.mount` | Теперь считай сам. Возьмём ребро и разберём все остальные по случаям. | Endi o'zingiz sanang. Bir qirrani olamiz va qolganlarini hollarga ajratamiz. | Now count for yourself. Take an edge and sort all the rest by case. |
| `audio.count*` | У куба двенадцать рёбер. Одно мы взяли, осталось одиннадцать, и каждое попадает ровно в один из трёх случаев. Параллельных нашему ребру три: противоположное на той же грани и два на противоположной. Пересекающих четыре: по два с каждого конца. Сложи три и четыре, вычти из одиннадцати, и получится, сколько остаётся на третий случай. Крутить куб при этом можно и нужно: пока не повернёшь, четвёртое и пятое ребро легко перепутать. | Kubning o'n ikki qirrasi bor. Bittasini oldik, o'n bittasi qoldi, va har biri uch holdan roppa-rosa bittasiga tushadi. Qirramizga parallel uchta: o'sha yoqdagi qarama-qarshisi va qarama-qarshi yoqdagi ikkitasi. Kesuvchisi to'rtta: har uchidan ikkitadan. Uch bilan to'rtni qo'shing, o'n birdan ayiring, va uchinchi holga nechta qolishi chiqadi. Bunda kubni burish mumkin va kerak: burmaguningizcha to'rtinchi va beshinchi qirrani chalkashtirish oson. | A cube has twelve edges. We took one, eleven are left, and each falls into exactly one of the three cases. Three are parallel to our edge: the opposite one on the same face and two on the opposite face. Four cross it: two at each end. Add three and four, subtract from eleven, and you get how many are left for the third case. Rotating the cube here is allowed and needed: until you turn it, the fourth and fifth edges are easy to confuse. |
| `audio.work` | Посчитай сам. Сколько рёбер скрещивается с данным? | O'zingiz hisoblang. Berilgan qirra bilan nechta qirra ayqash? | Work it out yourself. How many edges are skew to the given one? |
| `work.prompt` | Сколько рёбер скрещивается с данным? | Berilgan bilan nechta qirra ayqash? | How many edges are skew to the given one? |
| `work.ok` | Четыре. Одиннадцать минус три параллельных минус четыре пересекающих. | To'rtta. O'n bir minus uchta parallel minus to'rtta kesuvchi. | Four. Eleven minus three parallel minus four crossing. |
| `work.hint.1` | Всего рёбер двенадцать, наше не считаем. | Qirralar jami o'n ikkita, o'zimiznikini sanamaymiz. | There are twelve edges in all, ours is not counted. |
| `work.hint.2` | Параллельных три, пересекающих четыре. | Parallellari uchta, kesuvchilari to'rtta. | Three are parallel, four cross it. |
| `work.hint.3` | Четыре. | To'rt. | Four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `11 − 3 − 4` |
| `work.answer` | `4` |

---

## Экран 7 · `explain5` · ответ `number` · тег `ugol-ne-s-proekciey`

Граничный: угол между скрещивающимися.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Угол между тем, что не встречается | Uchrashmaydigan narsalar orasidagi burchak | The angle between things that never meet |
| `show.1.1` | рёбра не встречаются | qirralar uchrashmaydi | the edges do not meet |
| `show.1.2` | угла между ними будто и нет | ular orasida burchak yo'qdek | it seems there is no angle between them |
| `show.1.3` | но он есть, и его определяют | lekin u bor, va u aniqlanadi | but there is one, and it is defined |
| `show.2.1` | одну прямую переносят параллельно | bir chiziq parallel ko'chiriladi | one line is moved parallel to itself |
| `show.2.2` | теперь прямые пересекаются | endi chiziqlar kesishadi | now the lines meet |
| `show.2.3` | их угол и есть искомый | ularning burchagi izlangani | their angle is the one sought |
| `audio.mount` | Последний случай урока. У скрещивающихся прямых тоже есть угол. | Darsning oxirgi holi. Ayqash chiziqlarda ham burchak bor. | The last case of the lesson. Skew lines have an angle too. |
| `audio.angle*` | Определить угол между прямыми, которые не встречаются, напрямую нельзя: вершины у него нет. Учебник делает так. Одну из прямых переносят параллельно, пока она не пересечёт вторую, и берут угол между получившимися пересекающимися прямыми. Он и называется углом между скрещивающимися. Важно, что от выбора места переноса он не зависит: параллельные прямые дают один и тот же угол. Возьмём наши рёбра. Перенесём верхнее вниз, к нижней грани, и посмотрим, какой угол оно образует с нижним. И вот на что здесь смотреть нельзя: на угол, который они образуют на чертеже. Это угол между проекциями, а не между прямыми, и он меняется при каждом повороте. | Uchrashmaydigan chiziqlar orasidagi burchakni to'g'ridan aniqlab bo'lmaydi: uning uchi yo'q. Darslik shunday qiladi. Chiziqlardan biri ikkinchisini kesguncha parallel ko'chiriladi va hosil bo'lgan kesishuvchi chiziqlar orasidagi burchak olinadi. U ayqash chiziqlar orasidagi burchak deyiladi. Muhimi, u ko'chirish joyiga bog'liq emas: parallel chiziqlar bir xil burchak beradi. Qirralarimizni olamiz. Yuqorigisini pastga, pastki yoqqa ko'chiramiz va u pastkisi bilan qanday burchak hosil qilishiga qaraymiz. Bu yerda nimaga qarab bo'lmasligi ham muhim: ular chizmada hosil qilgan burchakka. Bu proyeksiyalar orasidagi burchak, chiziqlar orasidagi emas, va u har burilishda o'zgaradi. | The angle between lines that never meet cannot be defined directly: it has no vertex. The textbook does this. One of the lines is moved parallel to itself until it crosses the second, and the angle between the resulting intersecting lines is taken. That is called the angle between the skew lines. Importantly, it does not depend on where the shift is made: parallel lines give the same angle. Take our edges. Move the upper one down to the bottom face and see what angle it makes with the lower one. And here is what must not be looked at: the angle they make on the drawing. That is the angle between projections, not between lines, and it changes with every rotation. |
| `audio.work` | Посчитай сам. Чему равен угол между этими рёбрами в градусах? | O'zingiz hisoblang. Bu qirralar orasidagi burchak necha gradus? | Work it out yourself. What is the angle between these edges in degrees? |
| `work.prompt` | Чему равен угол между ними? | Ular orasidagi burchak nechaga teng? | What is the angle between them? |
| `work.ok` | Девяносто. После переноса рёбра сходятся под прямым углом, как соседние рёбра грани. | To'qson. Ko'chirgandan keyin qirralar to'g'ri burchak ostida tutashadi, yoqning qo'shni qirralaridek. | Ninety. After the shift the edges meet at a right angle, like neighbouring edges of a face. |
| `work.hint.1` | Перенеси верхнее ребро вниз, к нижней грани. | Yuqorigi qirrani pastga, pastki yoqqa ko'chiring. | Move the upper edge down to the bottom face. |
| `work.hint.2` | Соседние рёбра одной грани куба перпендикулярны. | Kubning bir yog'ining qo'shni qirralari perpendikulyar. | Neighbouring edges of one face of a cube are perpendicular. |
| `work.hint.3` | Девяносто. | To'qson. | Ninety. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `AB ∸ B₁C₁` |
| `work.answer` | `90` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `ayqash-kak-parallel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Три случая и признак | Uch hol va alomat | Three cases and the criterion |
| `probe.question` | Чем скрещивающиеся отличаются от параллельных? | Ayqash chiziqlar parallellardan nimasi bilan farq qiladi? | How do skew lines differ from parallel ones? |
| `probe.a` [верно] | нет плоскости, содержащей обе | ikkalasini saqlaydigan tekislik yo'q | there is no plane containing both |
| `probe.b` | нет общих точек | umumiy nuqta yo'q | there are no common points |
| `probe.b.hint` | Общих точек нет и у параллельных, этим их не различить. | Umumiy nuqta parallellarda ham yo'q, bu bilan ularni ajratib bo'lmaydi. | Parallel lines have no common points either, that does not tell them apart. |
| `rule.lawLabel` | ТРИ СЛУЧАЯ | UCH HOL | THE THREE CASES |
| `rule.lines.1` | пересекаются: общая точка и общая плоскость | kesishadi: umumiy nuqta va umumiy tekislik | they meet: a common point and a common plane |
| `rule.lines.2` | параллельны: общей точки нет, общая плоскость есть | parallel: umumiy nuqta yo'q, umumiy tekislik bor | parallel: no common point, but a common plane |
| `rule.lines.3` | скрещиваются: нет ни того, ни другого | ayqash: na unisi, na bunisi | skew: neither of the two |
| `audio.mount` | Соберём правило. Случаев три, и различает их плоскость, а не точка. | Qoidani yig'amiz. Hol uchta, ularni nuqta emas, tekislik ajratadi. | Let us put the rule together. There are three cases, and it is the plane that tells them apart, not the point. |
| `audio.rule*` | Первый случай: прямые пересекаются. У них есть общая точка, и через них проходит единственная плоскость. Второй: прямые параллельны. Общей точки нет, но общая плоскость есть, и она тоже единственная. Третий: прямые скрещиваются. Нет ни общей точки, ни общей плоскости, и этого случая на плоскости не бывает вовсе. Различать их по точкам нельзя: у второго и третьего случая точек нет одинаково. Различает плоскость. А чтобы не крутить каждый раз, есть признак: если одна прямая лежит в плоскости, а вторая пересекает эту плоскость вне первой прямой, то они скрещиваются. | Birinchi hol: chiziqlar kesishadi. Ularning umumiy nuqtasi bor va ular orqali yagona tekislik o'tadi. Ikkinchi: chiziqlar parallel. Umumiy nuqta yo'q, lekin umumiy tekislik bor, u ham yagona. Uchinchi: chiziqlar ayqash. Na umumiy nuqta, na umumiy tekislik bor, va bu hol tekislikda umuman bo'lmaydi. Ularni nuqta bo'yicha ajratib bo'lmaydi: ikkinchi va uchinchi holda nuqta bir xil yo'q. Tekislik ajratadi. Har safar burmaslik uchun esa alomat bor: agar bir chiziq tekislikda yotsa, ikkinchisi esa bu tekislikni birinchi chiziqdan tashqarida kesib o'tsa, ular ayqash bo'ladi. | First case: the lines meet. They have a common point and a unique plane passes through them. Second: the lines are parallel. There is no common point but there is a common plane, also unique. Third: the lines are skew. There is neither a common point nor a common plane, and this case does not occur on a plane at all. They cannot be told apart by points: the second and third case have no points alike. It is the plane that tells them apart. And so as not to rotate every time there is a criterion: if one line lies in a plane and the second crosses that plane outside the first line, then they are skew. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a ⊂ α,   b ∩ α = M,   M ∉ a   →   a ∸ b` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `ayqash-kak-parallel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Посчитай по кубу | Kub bo'yicha sanang | Count on the cube |
| `match.prompt` | Все четыре ответа разные | To'rt javobning hammasi har xil | All four answers are different |
| `match.ok` | Верно. Одиннадцать рёбер делятся на три группы, и ни одно не остаётся без группы. | To'g'ri. O'n bir qirra uch guruhga bo'linadi, va birortasi guruhsiz qolmaydi. | Correct. Eleven edges split into three groups, and none is left out. |
| `audio.mount` | Четыре записи про куб. Считай в уме, ребро AB держи перед глазами. | Kub haqida to'rt yozuv. Xayolda hisoblang, AB qirrasini ko'z oldingizda tuting. | Four writings about the cube. Count in your head, keep edge AB in view. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `AB ∸ ?` · `AB ∥ ?` · `AB ∩ CC₁` · `ABCDA₁B₁C₁D₁` |
| `match.a` | `4` |
| `match.b` | `3` |
| `match.c` | `0` |
| `match.d` | `12` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `ayqash-kak-parallel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи, что рёбра скрещиваются | Qirralar ayqash ekanini isbotlang | Prove the edges are skew |
| `proof.given` | ребро нижней грани и ребро верхней | pastki yoq qirrasi va yuqorigi yoq qirrasi | an edge of the bottom face and an edge of the top |
| `proof.goal` | они скрещиваются | ular ayqash | they are skew |
| `proof.r1` | нижнее ребро лежит в плоскости нижней грани | pastki qirra pastki yoq tekisligida yotadi | the bottom edge lies in the plane of the bottom face |
| `proof.r2` | верхнее ребро пересекает эту плоскость | yuqorigi qirra bu tekislikni kesib o'tadi | the top edge crosses that plane |
| `proof.r3` | точка пересечения не лежит на нижнем ребре | kesishish nuqtasi pastki qirrada yotmaydi | the crossing point is not on the bottom edge |
| `proof.e1` | Признак нужен дальше. Откуда известно, где лежит это ребро. | Alomat keyin kerak. Bu qirra qayerda yotganini qayerdan bilamiz. | The criterion comes later. How do we know where this edge lies. |
| `proof.e2` | Для признака рано. Сначала про верхнее ребро и эту плоскость. | Alomat uchun erta. Avval yuqorigi qirra va shu tekislik haqida. | Too early for the criterion. First the top edge and this plane. |
| `proof.e3` | Построение куба это не даёт. Нужно то, что отделяет скрещивающиеся. | Kub yasalishi buni bermaydi. Ayqashni ajratadigan narsa kerak. | The cube does not give this. We need what separates skew lines. |
| `proof.ok` | Доказано. Признак сработал, и поворот больше не нужен. | Isbotlandi. Alomat ishladi, burilish endi kerak emas. | Proved. The criterion worked and no rotation is needed any more. |
| `reason.s1` | по построению куба | kub yasalishiga ko'ra | by the construction of the cube |
| `reason.s2` | признак скрещивающихся | ayqashlik alomati | the criterion for skew lines |
| `reason.s3` | вторая аксиома | ikkinchi aksioma | the second axiom |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование: он показывает один ракурс из многих. | Chizma asoslash emas: u ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification: it shows one view out of many. |
| `audio.mount` | Теперь докажем без поворота. Обоснование каждой строки выбирается из списка. | Endi burilishsiz isbotlaymiz. Har qatorning asoslashi ro'yxatdan tanlanadi. | Now let us prove it without rotating. The justification of each line is chosen from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB ⊂ ABCD,   B₁C₁ ∩ ABCD = B₁` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Сколько рёбер пересекает данное | Berilganini nechta qirra kesadi | How many edges cross the given one |
| `task.ok` | Четыре. По два с каждого конца ребра. | To'rtta. Qirraning har uchidan ikkitadan. | Four. Two at each end of the edge. |
| `task.hint.1` | У ребра два конца, посмотри, что сходится в каждом. | Qirraning ikki uchi bor, har birida nima tutashishiga qarang. | The edge has two ends, look at what meets at each. |
| `task.hint.2` | В каждой вершине куба сходятся три ребра. | Kubning har uchida uchta qirra tutashadi. | Three edges meet at each vertex of a cube. |
| `task.hint.3` | Четыре. | To'rt. | Four. |
| `order.prompt` | Расставь записи по возрастанию ответа | Yozuvlarni javobi o'sishi bo'yicha joylashtiring | Put the writings in order of increasing answer |
| `order.title` | от меньшего числа к большему | kichik sondan kattasiga | from the smallest number to the largest |
| `order.ok` | Верно. Скрещивающихся больше, чем параллельных, а всего рёбер двенадцать. | To'g'ri. Ayqashlari parallellaridan ko'p, qirralar esa jami o'n ikkita. | Correct. There are more skew edges than parallel ones, and twelve edges in all. |
| `order.bad` | Считай каждую запись отдельно, а не смотри на её длину. | Har yozuvni alohida hisoblang, uzunligiga qaramang. | Compute each writing separately instead of looking at its length. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `AB ∩ ?` |
| `task.answer` | `4` |
| `order.items` | `AB ∥ ?` · `ABCDA₁B₁C₁D₁` · `AB ∩ CC₁` · `AB ∸ ?` |
| `order.answer` | `AB ∩ CC₁  AB ∥ ?  AB ∸ ?  ABCDA₁B₁C₁D₁` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Условие переписано верно. | Shart to'g'ri ko'chirilgan. | The condition is copied correctly. |
| `hint.r2` | Общих точек и правда нет. | Umumiy nuqta haqiqatan yo'q. | There really are no common points. |
| `hint.r3` | Из отсутствия точек это не следует. Чего не хватает? | Nuqta yo'qligidan bu kelib chiqmaydi. Nima yetishmayapti? | This does not follow from the absence of points. What is missing? |
| `proof` | У параллельных общая плоскость есть, а здесь её нет. | Parallellarda umumiy tekislik bor, bu yerda esa yo'q. | Parallel lines have a common plane, and here there is none. |
| `entry.prompt` | Сколько плоскостей содержит оба ребра? | Ikkala qirrani nechta tekislik saqlaydi? | How many planes contain both edges? |
| `entry.ok` | Ни одной. Поэтому рёбра скрещиваются, а не параллельны. | Bitta ham yo'q. Shuning uchun qirralar ayqash, parallel emas. | None. That is why the edges are skew, not parallel. |
| `entry.hint.1` | Параллельность требует общей плоскости. | Parallellik umumiy tekislikni talab qiladi. | Parallelism requires a common plane. |
| `entry.hint.2` | Поищи плоскость, в которой лежали бы оба. Её нет. | Ikkalasi yotadigan tekislikni izlang. U yo'q. | Look for a plane containing both. There is none. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `audio.mount` | Четыре строки. Каждая по отдельности похожа на правду. | To'rt qator. Har biri alohida haqiqatga o'xshaydi. | Four lines. Each of them alone looks like the truth. |
| `audio.next` | Дальше обратная задача: по случаю назови пару рёбер. | Keyin teskari masala: holga qarab qirralar juftini ayting. | Next comes the reverse task: name a pair of edges for the case. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `AB,  B₁C₁` |
| `row.r2` | `AB ∩ B₁C₁ = ∅` |
| `row.r3` | `AB ∥ B₁C₁` |
| `row.r4` | `AB, B₁C₁ ⊂ α` |
| `answerId` | `r3` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Две прямые лежат в одной плоскости и не пересекаются. Сколько у них общих точек? | Ikki chiziq bitta tekislikda yotadi va kesishmaydi. Ularning nechta umumiy nuqtasi bor? | Two lines lie in one plane and do not meet. How many common points do they have? |
| `entry.ok` | Ни одной. Это параллельные: общей плоскости хватает, чтобы отличить их от скрещивающихся. | Bitta ham yo'q. Bular parallel: ayqashlardan ajratish uchun umumiy tekislik yetadi. | None. These are parallel: a common plane is enough to tell them from skew ones. |
| `entry.hint.1` | Если бы точка была, прямые пересекались бы. | Nuqta bo'lganda, chiziqlar kesishardi. | If there were a point, the lines would meet. |
| `entry.hint.2` | Общая плоскость есть, а общих точек нет. | Umumiy tekislik bor, umumiy nuqta esa yo'q. | There is a common plane and no common points. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `multi.prompt` | Отметь все пары рёбер, которые скрещиваются | Ayqash bo'lgan barcha qirra juftlarini belgilang | Mark every pair of edges that is skew |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Эти два ребра лежат на одной грани и пересекаются. | Bu ikki qirra bir yoqda yotadi va kesishadi. | These two edges lie on one face and meet. |
| `multi.d.hint` | Эти два параллельны: они на противоположных сторонах одной грани. | Bu ikkitasi parallel: ular bir yoqning qarama-qarshi tomonlarida. | These two are parallel: they are on opposite sides of one face. |
| `multi.ok` | Верно. Скрещивающиеся живут на разных гранях и общей плоскости не имеют. | To'g'ri. Ayqashlar har xil yoqlarda yashaydi va umumiy tekisligi yo'q. | Correct. Skew edges live on different faces and share no plane. |
| `audio.mount` | Теперь наоборот. Сначала ответь про две прямые в одной плоскости. | Endi teskarisiga. Avval bitta tekislikdagi ikki chiziq haqida javob bering. | Now the other way round. First answer about two lines in one plane. |
| `audio.work` | Потом отметь все пары рёбер куба, которые скрещиваются. | Keyin kubning ayqash bo'lgan barcha qirra juftlarini belgilang. | Then mark every pair of cube edges that is skew. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `a, b ⊂ α,   a ∩ b = ∅` |
| `entry.answer` | `0` |
| `multi.a` [верно] | `AB, B₁C₁` |
| `multi.b` [верно] | `AB, CC₁` |
| `multi.c` | `AB, BC` |
| `multi.d` | `AB, DC` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `ayqash-kak-parallel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Сколько случаев взаимного расположения прямых в пространстве? | Fazoda to'g'ri chiziqlarning o'zaro joylashuvi necha xil? | How many cases of mutual position do lines in space have? |
| `q1.a` [верно] | три | uch | three |
| `q1.b` | два | ikki | two |
| `q1.b.hint` | Два случая на плоскости, в пространстве добавляется третий. | Ikki hol tekislikda, fazoda uchinchisi qo'shiladi. | Two cases hold on a plane, in space a third is added. |
| `q1.c` | четыре | to'rt | four |
| `q1.c.hint` | Четвёртого случая нет: любые две прямые попадают в один из трёх. | To'rtinchi hol yo'q: istalgan ikki chiziq uchtadan biriga tushadi. | There is no fourth case: any two lines fall into one of the three. |
| `q1.d` | один | bir | one |
| `q1.d.hint` | Одного мало даже на плоскости. | Bitta tekislikda ham kam. | One is too few even on a plane. |
| `q2.prompt` | Какие прямые называют скрещивающимися? | Qanday chiziqlar ayqash deyiladi? | Which lines are called skew? |
| `q2.a` [верно] | не лежащие в одной плоскости | bitta tekislikda yotmaydiganlari | those not lying in one plane |
| `q2.b` | не имеющие общих точек | umumiy nuqtasi yo'qlari | those with no common points |
| `q2.b.hint` | Это верно и для параллельных, значит различить так нельзя. | Bu parallellarga ham to'g'ri, demak bunday ajratib bo'lmaydi. | That is true for parallel lines too, so it does not tell them apart. |
| `q2.c` | пересекающиеся под прямым углом | to'g'ri burchak ostida kesishadiganlari | those meeting at a right angle |
| `q2.c.hint` | Пересекающиеся вообще не скрещиваются, у них есть общая точка. | Kesishuvchilar umuman ayqash emas, ularning umumiy nuqtasi bor. | Intersecting lines are never skew, they have a common point. |
| `q2.d` | лежащие на разных гранях | har xil yoqlarda yotadiganlari | those lying on different faces |
| `q2.d.hint` | Рёбра разных граней бывают и параллельными. | Har xil yoqlarning qirralari parallel ham bo'ladi. | Edges of different faces can be parallel too. |
| `q3.prompt` | Сколько рёбер куба скрещивается с данным? | Berilgan qirra bilan kubning nechta qirrasi ayqash? | How many edges of a cube are skew to a given one? |
| `q3.a` [верно] | четыре | to'rt | four |
| `q3.a.ok` | Четыре. Одиннадцать минус три параллельных минус четыре пересекающих. | To'rt. O'n bir minus uchta parallel minus to'rtta kesuvchi. | Four. Eleven minus three parallel minus four crossing. |
| `q3.b` | три | uch | three |
| `q3.b.hint` | Три это параллельные ему рёбра. | Uchta bu unga parallel qirralar. | Three is the number of edges parallel to it. |
| `q3.c` | шесть | olti | six |
| `q3.c.hint` | Шесть было бы, если бы пересекающих не было вовсе. | Olti kesuvchilar umuman bo'lmaganda bo'lardi. | Six would hold if there were no crossing edges at all. |
| `q3.d` | одиннадцать | o'n bir | eleven |
| `q3.d.hint` | Одиннадцать это все остальные рёбра, включая параллельные. | O'n bir bu qolgan barcha qirralar, parallellari bilan. | Eleven is all the other edges, parallel ones included. |
| `q4.prompt` | Как находят угол между скрещивающимися? | Ayqash chiziqlar orasidagi burchak qanday topiladi? | How is the angle between skew lines found? |
| `q4.a` [верно] | переносят одну параллельно до пересечения | birini kesishguncha parallel ko'chiradi | one is moved parallel until they meet |
| `q4.b` | измеряют угол на чертеже | burchakni chizmada o'lchaydi | the angle is measured on the drawing |
| `q4.b.hint` | На чертеже виден угол между проекциями, и он меняется при повороте. | Chizmada proyeksiyalar orasidagi burchak ko'rinadi, va u burilishda o'zgaradi. | The drawing shows the angle between projections, and it changes when you rotate. |
| `q4.c` | такого угла не бывает | bunday burchak bo'lmaydi | there is no such angle |
| `q4.c.hint` | Он определён, просто не напрямую. | U aniqlangan, faqat to'g'ridan emas. | It is defined, just not directly. |
| `q4.d` | берут угол между их плоскостями | ularning tekisliklari orasidagi burchakni oladi | the angle between their planes is taken |
| `q4.d.hint` | Общей плоскости у скрещивающихся нет вовсе. | Ayqashlarda umumiy tekislik umuman yo'q. | Skew lines have no common plane at all. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `∩,   ∥,   ∸` |
| `q2.done` | `a ∸ b` |
| `q3.done` | `11 − 3 − 4 = 4` |
| `q4.done` | `90°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Различаю три случая, а не два | Ikki emas, uch holni ajrataman | I tell three cases apart, not two |
| `can.2` | Проверяю не точку, а общую плоскость | Nuqtani emas, umumiy tekislikni tekshiraman | I check the common plane, not the point |
| `can.3` | Применяю признак и обхожусь без поворота | Alomatni qo'llab, burilishsiz ish tutaman | I apply the criterion and do without rotating |
| `can.4` | Нахожу угол переносом, а не по чертежу | Burchakni chizmadan emas, ko'chirish bilan topaman | I find the angle by shifting, not from the drawing |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: чем скрещивающиеся отличаются от параллельных. | Bir joy takrorlashni talab qiladi: ayqashlar parallellardan nimasi bilan farq qiladi. | One spot needs a second look: how skew differs from parallel. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va to'rtinchi ekranga qayting. | Go back to the rule and to screen four. |
| `bridge` | Дальше перпендикулярность: там одной прямой окажется мало. | Keyin perpendikulyarlik: u yerda bitta chiziq kam bo'lib chiqadi. | Next comes perpendicularity: there one line will turn out to be too few. |
| `lifehack` | Не ищи общую точку, ищи общую плоскость. Точка не различает второй и третий случай. | Umumiy nuqtani emas, umumiy tekislikni izlang. Nuqta ikkinchi va uchinchi holni ajratmaydi. | Do not look for a common point, look for a common plane. The point does not separate the second case from the third. |
| `sheetTitle` | Скрещивающиеся · шпаргалка | Ayqash chiziqlar · shpargalka | Skew lines · cheat sheet |
| `sheetSrc` | 10 класс · урок 39 | 10-sinf · 39-dars | Grade 10 · lesson 39 |
| `audio.mount` | Прогноз был про пересечение. Посмотрим, что вышло. | Taxmin kesishish haqida edi. Nima chiqqanini ko'ramiz. | The guess was about an intersection. Let us see how it turned out. |
| `audio.next` | Рёбра скрещиваются. Пересечение было на картинке, а в пространстве его нет. | Qirralar ayqash. Kesishish rasmda edi, fazoda esa u yo'q. | The edges are skew. The intersection was in the picture, and in space there is none. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `AB ∩ B₁C₁ = M` |
| `hook.b` | `AB ∸ B₁C₁` |
| `proved` | `AB ∸ B₁C₁` |
| `law` | `a ∸ b` |
| `sheet.1` | `a ∩ b = M` |
| `sheet.2` | `a ∥ b` |
| `sheet.3` | `a ∸ b` |
| `sheet.4` | `a ⊂ α,  b ∩ α = M,  M ∉ a` |
| `sheet.5` | `11 − 3 − 4 = 4` |
