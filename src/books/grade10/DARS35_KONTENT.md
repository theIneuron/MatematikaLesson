# Урок 43 — Двугранный угол. Перпендикулярные плоскости · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS42_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, §20
`Fazoda tekisliklarning perpendikulyarligi`, стр. 142–143. Определения двугранного угла,
его граней, ребра и линейного угла взяты дословно.

**Главное решение урока.** Линейный угол строится **в плоскости, перпендикулярной ребру**, и
его величина от точки на ребре не зависит (стр. 142). Ошибка живая: ученик берёт в гранях любые
два луча из точки ребра и называет полученный угол линейным. Показать разницу можно только
поворотом: на неподвижном чертеже кривой луч выглядит не хуже перпендикулярного.

**Свидетель урока — точка, которая едет по ребру.** В каждой её позиции линейный угол один и
тот же, и это видно, а не сказано.

**Закрывает блок 6.** После урока идёт ПК6.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`ikki yoqli burchak`, `yoq`, `qirra`, `chiziqli burchak` взяты из учебника, стр. 142.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДВУГРАННЫЙ УГОЛ | IKKI YOQLI BURCHAK | THE DIHEDRAL ANGLE |
| `title` | Зависит от места или нет | Joyga bog'liqmi yoki yo'q | Does it depend on the place or not |
| `row.a.name` | зависит | bog'liq | it depends |
| `row.b.name` | не зависит | bog'liq emas | it does not depend |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену. | Javobingiz yozib olindi. Endi sahnani buramiz. | Your answer is recorded. Now we rotate the scene. |
| `audio.mount` | Открытая книга даёт двугранный угол. Две половины плоскости и общая линия сгиба. | Ochiq kitob ikki yoqli burchak beradi. Tekislikning ikki yarmi va umumiy buklanish chizig'i. | An open book gives a dihedral angle. Two halves of a plane and a common fold line. |
| `audio.r1` | Первая запись говорит, что величина угла зависит от того, в каком месте линии сгиба мы его мерим. | Birinchi yozuv burchak kattaligi buklanish chizig'ining qaysi joyida o'lchashimizga bog'liq deydi. | The first reading says the size of the angle depends on where along the fold line we measure it. |
| `audio.r2` | Вторая говорит, что не зависит, и в любом месте получится одно и то же. | Ikkinchisi bog'liq emas deydi, va istalgan joyda bir xil chiqadi. | The second says it does not depend, and any place gives the same. |
| `audio.ask` | Книга ближе к краю кажется раскрытой шире. Как думаешь, какая запись верная? | Kitob chekkaga yaqin joyda kengroq ochilgandek ko'rinadi. Sizningcha qaysi yozuv to'g'ri? | Near the edge the book seems opened wider. Which reading do you think is correct? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A, B ∈ a` |
| `row.a.value` | `∠A ≠ ∠B` |
| `row.b.value` | `∠A = ∠B` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед углом | Burchakdan oldin uch savol | Three questions before the angle |
| `q1.prompt` | С чем берут угол прямой и плоскости? | To'g'ri chiziq va tekislik burchagi nima bilan olinadi? | What is the angle of a line and a plane taken with? |
| `q1.a` [верно] | с проекцией | proyeksiya bilan | with the projection |
| `q1.b` | с любой прямой плоскости | tekislikning istalgan chizig'i bilan | with any line of the plane |
| `q1.b.hint` | Таких прямых бесконечно много, и углы у них разные. | Bunday chiziqlar cheksiz ko'p, va burchaklari boshqa-boshqa. | There are infinitely many such lines with different angles. |
| `q1.c` | с перпендикуляром | perpendikulyar bilan | with the perpendicular |
| `q1.c.hint` | С перпендикуляром угол всегда прямой. | Perpendikulyar bilan burchak doim to'g'ri. | With the perpendicular the angle is always right. |
| `q1.d` | с ребром | qirra bilan | with the edge |
| `q1.d.hint` | Ребро это одна из прямых плоскости, не более. | Qirra tekislik chiziqlaridan biri, boshqa emas. | An edge is just one of the lines of the plane. |
| `q2.prompt` | Сколько прямых в плоскости перпендикулярно данной прямой через данную точку? | Berilgan nuqta orqali tekislikda berilgan chiziqqa perpendikulyar nechta chiziq bor? | How many lines of the plane through a given point are perpendicular to a given line? |
| `q2.a` [верно] | одна | bitta | one |
| `q2.b` | две | ikkita | two |
| `q2.b.hint` | Две такие прямые совпали бы. | Bunday ikki chiziq ustma-ust tushardi. | Two such lines would coincide. |
| `q2.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q2.c.hint` | Бесконечно много их было бы в пространстве, а не в плоскости. | Cheksiz ko'p ular fazoda bo'lardi, tekislikda emas. | There would be infinitely many in space, not in a plane. |
| `q2.d` | ни одной | bitta ham yo'q | none |
| `q2.d.hint` | Хотя бы одна есть всегда. | Hech bo'lmaganda bittasi doim bor. | At least one always exists. |
| `q3.prompt` | Что даёт прямая, перпендикулярная плоскости? | Tekislikka perpendikulyar chiziq nima beradi? | What does a line perpendicular to a plane give? |
| `q3.a` [верно] | прямой угол с каждой прямой этой плоскости | shu tekislikning har bir chizig'i bilan to'g'ri burchak | a right angle with every line of that plane |
| `q3.b` | прямой угол только с одной прямой | faqat bitta chiziq bilan to'g'ri burchak | a right angle with one line only |
| `q3.b.hint` | Одной прямой мало даже для признака. | Bitta chiziq alomat uchun ham kam. | One line is not even enough for the criterion. |
| `q3.c` | равные отрезки | teng kesmalar | equal segments |
| `q3.c.hint` | Речь об углах, а не о длинах. | Gap burchaklar haqida, uzunliklar haqida emas. | This is about angles, not lengths. |
| `q3.d` | параллельность | parallellik | parallelism |
| `q3.d.hint` | Параллельность даёт угол ноль, а не девяносто. | Parallellik nol burchak beradi, to'qson emas. | Parallelism gives a zero angle, not ninety. |
| `audio.mount` | Три вопроса. Второй понадобится дословно через минуту. | Uchta savol. Ikkinchisi bir daqiqadan keyin so'zma-so'z kerak bo'ladi. | Three questions. The second will be needed word for word in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `∠(a; α) = ∠(a; a₁)` |
| `q2.done` | `1` |
| `q3.done` | `a ⊥ α   →   90°` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Двугранный угол: две полуплоскости и ребро.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Две грани и одно ребро | Ikki yoq va bitta qirra | Two faces and one edge |
| `show.1.1` | одна полуплоскость легла | bir yarimtekislik yotdi | one half-plane lay down |
| `show.1.2` | вторая поднялась от той же прямой | ikkinchisi o'sha chiziqdan ko'tarildi | the second rose from the same line |
| `show.2.1` | общая прямая называется ребром | umumiy chiziq qirra deb ataladi | the common line is called the edge |
| `show.2.2` | полуплоскости называются гранями | yarimtekisliklar yoqlar deb ataladi | the half-planes are called the faces |
| `audio.mount` | Возьмём прямую и две полуплоскости, которые от неё начинаются. | Bitta chiziqni va undan boshlanadigan ikki yarimtekislikni olamiz. | Take a line and two half-planes that start from it. |
| `audio.move*` | Такая фигура называется двугранным углом. Полуплоскости это его грани, а прямая, которая их ограничивает, это ребро. Так написано в учебнике на странице сто сорок два. Двугранные углы вокруг нас повсюду. Открытая книга, крышка ноутбука, открытая дверь и скат крыши. Поверни сцену и посмотри на фигуру с разных сторон. Ребро остаётся общим для двух граней при любом положении, потому что это не свойство чертежа, а условие фигуры. | Bunday shakl ikki yoqli burchak deb ataladi. Yarimtekisliklar uning yoqlari, ularni chegaralovchi chiziq esa qirra. Darslikda bir yuz qirq ikkinchi betda shunday yozilgan. Ikki yoqli burchaklar atrofimizda hamma joyda. Ochiq kitob, noutbuk qopqog'i, ochiq eshik va tom qiyaligi. Sahnani buring va shaklga turli tomondan qarang. Qirra har qanday holatda ikki yoq uchun umumiy qoladi, chunki bu chizmaning xossasi emas, shaklning sharti. | Such a figure is called a dihedral angle. The half-planes are its faces, and the line that bounds them is the edge. That is what the textbook says on page one hundred forty two. Dihedral angles are everywhere around us. An open book, a laptop lid, an open door and a roof slope. Rotate the scene and look at the figure from different sides. The edge stays common to both faces at any position, because this is not a property of the drawing but a condition of the figure. |
| `audio.work` | Посчитай сам. Сколько полуплоскостей образуют двугранный угол? | O'zingiz hisoblang. Ikki yoqli burchakni nechta yarimtekislik hosil qiladi? | Work it out yourself. How many half-planes form a dihedral angle? |
| `work.prompt` | Сколько полуплоскостей? | Nechta yarimtekislik? | How many half-planes? |
| `work.ok` | Две. И одно общее ребро, которое их ограничивает. | Ikkita. Va ularni chegaralovchi bitta umumiy qirra. | Two. And one common edge that bounds them. |
| `work.hint.1` | Посмотри, сколько частей плоскости на чертеже. | Chizmada tekislikning nechta bo'lagi borligini ko'ring. | See how many parts of a plane are on the drawing. |
| `work.hint.2` | Название фигуры содержит это число. | Shaklning nomi bu sonni o'zida saqlaydi. | The name of the figure carries this number. |
| `work.hint.3` | Две. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `α, β;   a = α ∩ β` |
| `work.answer` | `2` |

---

## Экран 4 · `explain2` · ответ `number` · тег `lineynyy-ne-tot`

Свидетель: точка едет по ребру, линейный угол тот же.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | СВИДЕТЕЛЬ | SHOHID | THE WITNESS |
| `title` | Точка едет по ребру | Nuqta qirra bo'ylab yuradi | The point travels along the edge |
| `show.1.1` | из точки ребра в каждой грани идёт луч | qirra nuqtasidan har yoqda nur chiqadi | from a point of the edge a ray runs in each face |
| `show.1.2` | оба луча перпендикулярны ребру | ikkala nur ham qirraga perpendikulyar | both rays are perpendicular to the edge |
| `show.2.1` | точка переехала в другое место ребра | nuqta qirraning boshqa joyiga o'tdi | the point moved to another place on the edge |
| `show.2.2` | угол остался тем же | burchak o'sha qoldi | the angle stayed the same |
| `audio.mount` | На ребре есть точка, и из неё в каждой грани идёт луч, перпендикулярный ребру. Такой угол называется линейным. | Qirrada nuqta bor, va undan har yoqda qirraga perpendikulyar nur boradi. Bunday burchak chiziqli burchak deb ataladi. | There is a point on the edge, and from it a ray perpendicular to the edge runs in each face. Such an angle is called the linear angle. |
| `audio.move*` | Теперь смотри на само число. Точка едет по ребру, лучи едут вместе с ней, а угол между ними не меняется ни на градус. Линейных углов бесконечно много, потому что точек на ребре бесконечно много, но величина у всех одна. Именно она и считается величиной двугранного угла. Поверни сцену и проверь, что при повороте одинаковыми остаются оба угла, а не только тот, который ближе. | Endi sonning o'ziga qarang. Nuqta qirra bo'ylab yuradi, nurlar u bilan birga yuradi, ular orasidagi burchak esa bir daraja ham o'zgarmaydi. Chiziqli burchaklar cheksiz ko'p, chunki qirrada nuqtalar cheksiz ko'p, lekin kattaligi hammasida bir xil. Aynan u ikki yoqli burchakning kattaligi deb hisoblanadi. Sahnani buring va burilishda faqat yaqinrog'i emas, ikkala burchak ham bir xil qolishini tekshiring. | Now look at the number itself. The point travels along the edge, the rays travel with it, and the angle between them does not change by a single degree. There are infinitely many linear angles, because there are infinitely many points on the edge, but all of them have one size. That size is taken to be the size of the dihedral angle. Rotate the scene and check that under rotation both angles stay equal, not only the nearer one. |
| `audio.work` | Посчитай сам. Сколько разных величин у линейных углов одного двугранного угла? | O'zingiz hisoblang. Bitta ikki yoqli burchakning chiziqli burchaklari nechta xil kattalikka ega? | Work it out yourself. How many different sizes do the linear angles of one dihedral angle have? |
| `work.prompt` | Сколько разных величин? | Nechta xil kattalik? | How many different sizes? |
| `work.ok` | Одна. Линейных углов бесконечно много, а величина у них одна. | Bitta. Chiziqli burchaklar cheksiz ko'p, kattaligi esa bitta. | One. There are infinitely many linear angles, and they have one size. |
| `work.hint.1` | Подвинь точку и сравни две дуги. | Nuqtani suring va ikki dugani solishtiring. | Move the point and compare the two arcs. |
| `work.hint.2` | Лучи в одной грани при разных точках параллельны. | Bir yoqdagi nurlar turli nuqtalarda parallel. | The rays in one face at different points are parallel. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `∠A = ∠B = ∠C` |
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `lineynyy-ne-tot`

Граница: луч не перпендикулярен ребру.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Кривой луч даёт другой угол | Qiyshiq nur boshqa burchak beradi | A skewed ray gives a different angle |
| `show.1.1` | второй луч отклонили от перпендикуляра | ikkinchi nur perpendikulyardan og'dirildi | the second ray was tilted off the perpendicular |
| `show.1.2` | на чертеже он выглядит не хуже | chizmada u yomon ko'rinmaydi | on the drawing it looks no worse |
| `show.2.1` | поверни сцену и сравни дуги | sahnani buring va dugalarni solishtiring | rotate the scene and compare the arcs |
| `show.2.2` | этот угол не линейный | bu burchak chiziqli emas | this angle is not the linear one |
| `audio.mount` | Оставим первый луч на месте, а второй отклоним от перпендикуляра к ребру. | Birinchi nurni joyida qoldiramiz, ikkinchisini esa qirraga perpendikulyardan og'diramiz. | Leave the first ray in place and tilt the second one off the perpendicular to the edge. |
| `audio.move*` | На неподвижном чертеже отклонение почти не видно, и угол выглядит таким же законным. Поверни сцену и сравни дуги. Они разные, и та, что построена на кривом луче, меняется вместе с поворотом. Линейный угол требует двух условий, и оба обязательны. Лучи лежат в гранях, и оба перпендикулярны ребру. Убери второе условие, и величина перестанет быть определённой, потому что каждый кривой луч даст своё число. | Qimirlamas chizmada og'ish deyarli ko'rinmaydi, va burchak xuddi shunday qonuniy ko'rinadi. Sahnani buring va dugalarni solishtiring. Ular boshqa-boshqa, va qiyshiq nurda qurilgani burilish bilan birga o'zgaradi. Chiziqli burchak ikki shartni talab qiladi, va ikkalasi ham majburiy. Nurlar yoqlarda yotadi, va ikkalasi ham qirraga perpendikulyar. Ikkinchi shartni olib tashlasangiz, kattalik aniq bo'lmay qoladi, chunki har bir qiyshiq nur o'z sonini beradi. | On a still drawing the tilt is almost invisible and the angle looks just as legitimate. Rotate the scene and compare the arcs. They differ, and the one built on the skewed ray changes together with the rotation. The linear angle needs two conditions and both are required. The rays lie in the faces, and both are perpendicular to the edge. Drop the second condition and the size stops being definite, because every skewed ray gives its own number. |
| `audio.work` | Посчитай сам. Сколько из двух углов на чертеже линейный? | O'zingiz hisoblang. Chizmadagi ikki burchakdan nechtasi chiziqli? | Work it out yourself. How many of the two angles on the drawing are linear? |
| `work.prompt` | Сколько линейных углов на чертеже? | Chizmada nechta chiziqli burchak bor? | How many linear angles are on the drawing? |
| `work.ok` | Один. У второго луч не перпендикулярен ребру. | Bitta. Ikkinchisining nuri qirraga perpendikulyar emas. | One. The ray of the second one is not perpendicular to the edge. |
| `work.hint.1` | Проверь у каждого угла оба условия. | Har burchakda ikki shartni tekshiring. | Check both conditions for each angle. |
| `work.hint.2` | Лучи должны быть перпендикулярны ребру, а не просто лежать в гранях. | Nurlar qirraga perpendikulyar bo'lishi kerak, shunchaki yoqlarda yotishi emas. | The rays must be perpendicular to the edge, not merely lie in the faces. |
| `work.hint.3` | Один. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB ⊥ a,   AD ⊥̸ a` |
| `work.answer` | `1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `lineynyy-ne-tot`

Сам: четыре двугранных угла при пересечении плоскостей.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Четыре угла вокруг ребра | Qirra atrofida to'rt burchak | Four angles around the edge |
| `show.1.1` | две плоскости пересеклись | ikki tekislik kesishdi | two planes crossed |
| `show.1.2` | вокруг ребра получилось четыре угла | qirra atrofida to'rt burchak chiqdi | four angles came out around the edge |
| `show.2.1` | один из них пятьдесят градусов | ulardan biri ellik daraja | one of them is fifty degrees |
| `show.2.2` | противоположный ему такой же | unga qarama-qarshisi ham shunday | the one opposite to it is the same |
| `audio.mount` | Две пересекающиеся плоскости делят всё пространство на четыре двугранных угла с общим ребром. Так на странице сто сорок три. | Ikki kesishuvchi tekislik butun fazoni umumiy qirrali to'rt ikki yoqli burchakka ajratadi. Bir yuz qirq uchinchi betda shunday. | Two crossing planes divide the whole of space into four dihedral angles with a common edge. So it is on page one hundred forty three. |
| `audio.move*` | Посмотри на линейные углы этих четырёх. Они устроены как обычные углы при пересечении двух прямых. Противоположные равны между собой, а соседние дополняют друг друга до ста восьмидесяти градусов. Значит если один угол пятьдесят градусов, то противоположный ему тоже пятьдесят, а два соседних по сто тридцать. Углом между пересекающимися плоскостями называют наименьший из четырёх, то есть тот, который не больше девяноста градусов. | Bu to'rttasining chiziqli burchaklariga qarang. Ular ikki chiziq kesishganda hosil bo'ladigan oddiy burchaklar kabi tuzilgan. Qarama-qarshilari o'zaro teng, qo'shnilari esa bir yuz sakson darajaga to'ldiradi. Demak agar bir burchak ellik daraja bo'lsa, unga qarama-qarshisi ham ellik, ikki qo'shnisi esa bir yuz o'ttiztadan. Kesishuvchi tekisliklar orasidagi burchak deb to'rttadan eng kichigi olinadi, ya'ni to'qson darajadan katta bo'lmagani. | Look at the linear angles of these four. They are arranged like ordinary angles at the crossing of two lines. Opposite ones are equal to each other, and neighbouring ones add up to one hundred eighty degrees. So if one angle is fifty degrees, the one opposite is also fifty, and the two neighbours are one hundred thirty each. The angle between crossing planes is taken to be the smallest of the four, the one not greater than ninety degrees. |
| `audio.work` | Посчитай сам. Один угол пятьдесят градусов. Сколько градусов в соседнем? | O'zingiz hisoblang. Bir burchak ellik daraja. Qo'shnisida necha daraja? | Work it out yourself. One angle is fifty degrees. How many degrees are in the neighbouring one? |
| `work.prompt` | Сколько градусов в соседнем? | Qo'shnisida necha daraja? | How many degrees in the neighbouring one? |
| `work.ok` | Сто тридцать. Соседние дополняют друг друга до ста восьмидесяти. | Bir yuz o'ttiz. Qo'shnilar bir-birini bir yuz sakson darajaga to'ldiradi. | One hundred thirty. Neighbours add up to one hundred eighty. |
| `work.hint.1` | Соседние линейные углы вместе дают развёрнутый. | Qo'shni chiziqli burchaklar birgalikda yoyiq burchak beradi. | Neighbouring linear angles together give a straight angle. |
| `work.hint.2` | Отними пятьдесят от ста восьмидесяти. | Bir yuz sakson dan ellikni ayiring. | Subtract fifty from one hundred eighty. |
| `work.hint.3` | Сто тридцать. | Bir yuz o'ttiz. | One hundred thirty. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `50° + x = 180°` |
| `work.answer` | `130` |

---

## Экран 7 · `explain5` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Перпендикулярные плоскости.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРПЕНДИКУЛЯРНЫЕ | PERPENDIKULYAR | PERPENDICULAR |
| `title` | Один прямой значит все четыре | Biri to'g'ri bo'lsa, to'rttasi ham | One right means all four |
| `show.1.1` | линейный угол стал прямым | chiziqli burchak to'g'ri bo'ldi | the linear angle became right |
| `show.1.2` | соседний тоже стал прямым | qo'shnisi ham to'g'ri bo'ldi | the neighbouring one also became right |
| `show.2.1` | такие плоскости называют перпендикулярными | bunday tekisliklar perpendikulyar deb ataladi | such planes are called perpendicular |
| `show.2.2` | пол и стена комнаты пример | xona poli va devori misol | the floor and a wall of a room are an example |
| `audio.mount` | Здесь линейный угол прямой. Вокруг ребра всё те же четыре угла. | Bu yerda chiziqli burchak to'g'ri. Qirra atrofida o'sha to'rt burchak. | Here the linear angle is right. Around the edge there are the same four angles. |
| `audio.move*` | Как только один из четырёх углов стал прямым, прямыми стали и остальные три. Соседний дополняет его до ста восьмидесяти, а сто восемьдесят минус девяносто это опять девяносто. Плоскости, пересекающиеся под прямым углом, называют перпендикулярными. Их вокруг нас много. Пол и стена комнаты, две стены с общим углом, грани кубика Рубика с общим ребром, земля и стена дома. | To'rt burchakdan biri to'g'ri bo'lishi bilanoq qolgan uchtasi ham to'g'ri bo'ldi. Qo'shnisi uni bir yuz sakson darajaga to'ldiradi, bir yuz sakson minus to'qson esa yana to'qson. To'g'ri burchak ostida kesishuvchi tekisliklar perpendikulyar deb ataladi. Ular atrofimizda ko'p. Xona poli va devori, umumiy qirrali ikki devor, umumiy qirrali rubik kubi yoqlari, yer va uy devori. | As soon as one of the four angles became right, the other three became right too. The neighbour completes it to one hundred eighty, and one hundred eighty minus ninety is ninety again. Planes crossing at a right angle are called perpendicular. There are many of them around us. The floor and a wall of a room, two walls with a common corner, faces of a Rubik cube with a common edge, the ground and the wall of a house. |
| `audio.work` | Посчитай сам. Один из четырёх углов прямой. Сколько из четырёх прямые? | O'zingiz hisoblang. To'rt burchakdan biri to'g'ri. To'rttadan nechtasi to'g'ri? | Work it out yourself. One of the four angles is right. How many of the four are right? |
| `work.prompt` | Сколько прямых углов из четырёх? | To'rttadan nechta to'g'ri burchak? | How many right angles out of four? |
| `work.ok` | Все четыре. Сто восемьдесят минус девяносто снова девяносто. | To'rttasi ham. Bir yuz sakson minus to'qson yana to'qson. | All four. One hundred eighty minus ninety is ninety again. |
| `work.hint.1` | Посчитай соседний угол. | Qo'shni burchakni hisoblang. | Compute the neighbouring angle. |
| `work.hint.2` | Противоположные углы равны, соседние дают развёрнутый. | Qarama-qarshi burchaklar teng, qo'shnilar yoyiq beradi. | Opposite angles are equal, neighbours give a straight angle. |
| `work.hint.3` | Все четыре. | To'rttasi ham. | All four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `α ⊥ β` |
| `work.answer` | `4` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `lineynyy-ne-tot`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Два условия линейного угла | Chiziqli burchakning ikki sharti | Two conditions of the linear angle |
| `probe.question` | Какой угол называют линейным? | Qaysi burchak chiziqli deb ataladi? | Which angle is called the linear one? |
| `probe.a` [верно] | лучи в гранях и оба перпендикулярны ребру | nurlar yoqlarda va ikkalasi qirraga perpendikulyar | the rays are in the faces and both perpendicular to the edge |
| `probe.b` | любые два луча из точки ребра | qirra nuqtasidan chiqqan istalgan ikki nur | any two rays from a point of the edge |
| `probe.b.hint` | Тогда у одного двугранного угла было бы много разных величин. | Unda bitta ikki yoqli burchakning ko'p xil kattaligi bo'lardi. | Then one dihedral angle would have many different sizes. |
| `rule.lawLabel` | Линейный угол | Chiziqli burchak | The linear angle |
| `rule.lines.1` | лучи выходят из одной точки ребра и лежат в гранях | nurlar qirraning bir nuqtasidan chiqadi va yoqlarda yotadi | the rays leave one point of the edge and lie in the faces |
| `rule.lines.2` | оба луча перпендикулярны ребру | ikkala nur ham qirraga perpendikulyar | both rays are perpendicular to the edge |
| `rule.lines.3` | величина двугранного угла это величина его линейного угла | ikki yoqli burchakning kattaligi uning chiziqli burchagi kattaligi | the size of a dihedral angle is the size of its linear angle |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | В определении два условия, и второе делает всю работу. Лучи в гранях бывают любые, но перпендикулярных ребру ровно по одному в каждой грани. Поэтому линейный угол в данной точке один, а не много, и величина двугранного угла определена однозначно. Отсюда и удобство. Чтобы измерить двугранный угол, не надо мерить плоскости, достаточно построить один линейный угол в любом месте ребра. | Ta'rifda ikki shart bor, va ikkinchisi butun ishni qiladi. Yoqlardagi nurlar istalgancha bo'ladi, lekin qirraga perpendikulyarlari har yoqda roppa-rosa bittadan. Shuning uchun berilgan nuqtada chiziqli burchak bitta, ko'p emas, va ikki yoqli burchakning kattaligi yagona aniqlanadi. Qulaylik ham shundan. Ikki yoqli burchakni o'lchash uchun tekisliklarni o'lchash kerak emas, qirraning istalgan joyida bitta chiziqli burchak qurish yetarli. | The definition has two conditions and the second one does all the work. Rays in the faces can be any, but there is exactly one perpendicular to the edge in each face. That is why the linear angle at a given point is one and not many, and the size of the dihedral angle is uniquely defined. Hence the convenience. To measure a dihedral angle there is no need to measure the planes, it is enough to build one linear angle anywhere on the edge. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `AB ⊥ a,   AC ⊥ a   →   ∠BAC` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `lineynyy-ne-tot`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Величина и вид | Kattalik va turi | The size and the kind |
| `match.prompt` | Соедини величину линейного угла с видом двугранного | Chiziqli burchak kattaligini ikki yoqli burchak turi bilan birlashtiring | Match the size of the linear angle with the kind of dihedral angle |
| `match.ok` | Все четыре на месте. Вид двугранного читается по линейному. | To'rttasi ham joyida. Ikki yoqli burchakning turi chiziqli bo'yicha o'qiladi. | All four in place. The kind of the dihedral angle is read from the linear one. |
| `audio.mount` | Четыре величины и четыре названия. Соедини их. | To'rt kattalik va to'rt nom. Ularni birlashtiring. | Four sizes and four names. Match them. |
| `match.a` | острый | o'tkir | acute |
| `match.b` | прямой | to'g'ri | right |
| `match.c` | тупой | o'tmas | obtuse |
| `match.d` | развёрнутый | yoyiq | straight |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `40°` · `90°` · `120°` · `180°` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `lineynyy-ne-tot`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи независимость от точки | Nuqtaga bog'liq emasligini isbotlang | Prove it does not depend on the point |
| `proof.given` | два линейных угла в разных точках ребра | qirraning turli nuqtalarida ikki chiziqli burchak | two linear angles at different points of the edge |
| `proof.goal` | они равны | ular teng | they are equal |
| `proof.r1` | в каждой грани лучи параллельны | har yoqda nurlar parallel | in each face the rays are parallel |
| `proof.r2` | стороны углов сонаправлены | burchak tomonlari bir yo'nalgan | the sides of the angles point the same way |
| `proof.r3` | значит углы равны | demak burchaklar teng | so the angles are equal |
| `proof.ok` | Доказано. Величина двугранного угла от точки на ребре не зависит. | Isbotlandi. Ikki yoqli burchakning kattaligi qirradagi nuqtaga bog'liq emas. | Proved. The size of a dihedral angle does not depend on the point on the edge. |
| `proof.e1` | Сонаправленность идёт дальше. Сначала про параллельность. | Bir yo'nalganlik keyin keladi. Avval parallellik haqida. | Codirection comes later. First about being parallel. |
| `proof.e2` | Параллельность уже есть. Речь о направлении лучей. | Parallellik bor. Gap nurlarning yo'nalishi haqida. | Being parallel is done. This is about the direction of the rays. |
| `proof.e3` | Стороны разобраны. Теперь вывод про углы. | Tomonlar ko'rildi. Endi burchaklar haqida xulosa. | The sides are done. Now the conclusion about the angles. |
| `reason.s1` | в плоскости два перпендикуляра к одной прямой параллельны | tekislikda bir chiziqqa ikki perpendikulyar parallel | in a plane two perpendiculars to one line are parallel |
| `reason.s2` | лучи идут в одну сторону от ребра | nurlar qirradan bir tomonga boradi | the rays go to one side of the edge |
| `reason.s3` | углы с сонаправленными сторонами равны | bir yo'nalgan tomonli burchaklar teng | angles with codirected sides are equal |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, each with its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `∠A = ∠B` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Сто десять. Соседний дополняет семьдесят до ста восьмидесяти. | Bir yuz o'n. Qo'shnisi yetmishni bir yuz sakson darajaga to'ldiradi. | One hundred ten. The neighbour completes seventy to one hundred eighty. |
| `task.hint.1` | Нарисуй четыре угла вокруг одной точки. | Bitta nuqta atrofida to'rt burchak chizing. | Draw four angles around one point. |
| `task.hint.2` | Соседние вместе дают развёрнутый угол. | Qo'shnilar birgalikda yoyiq burchak beradi. | Neighbours together give a straight angle. |
| `task.hint.3` | Сто восемьдесят минус семьдесят. | Bir yuz sakson minus yetmish. | One hundred eighty minus seventy. |
| `order.prompt` | Расставь записи в том порядке, в каком их получают | Yozuvlarni olinish tartibida joylashtiring | Arrange the readings in the order they are obtained |
| `order.title` | Порядок построения | Qurish tartibi | The order of construction |
| `order.ok` | Порядок верный. Точка берётся первой, вывод последним. | Tartib to'g'ri. Nuqta birinchi olinadi, xulosa oxirgi. | The order is right. The point is taken first, the conclusion last. |
| `order.bad` | Не в этом порядке. Что нужно раньше. | Bu tartibda emas. Avval nima kerak. | Not in this order. What is needed first. |
| `audio.mount` | Прибор убран. Считаем на бумаге. | Asbob olib qo'yildi. Qog'ozda hisoblaymiz. | The tool is put away. We count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как их получают. | Endi yozuvlar tartibi. Ularni qanday olinsa, shunday joylashtiring. | Now the order of the readings. Arrange them the way they are obtained. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `∠1 = 70°,   ∠2 = ?` |
| `task.answer` | `110` |
| `order.items` | `∠BAC` · `A ∈ a` · `AB ⊥ a` · `AC ⊥ a` |
| `order.answer` | `A ∈ a  AB ⊥ a  AC ⊥ a  ∠BAC` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Точка на ребре взята верно. | Qirradagi nuqta to'g'ri olingan. | The point on the edge is taken correctly. |
| `hint.r2` | Первый луч перпендикулярен ребру, это верно. | Birinchi nur qirraga perpendikulyar, bu to'g'ri. | The first ray is perpendicular to the edge, that is right. |
| `hint.r4` | Вывод получен из неверной строки выше. | Xulosa yuqoridagi xato qatordan olingan. | The conclusion comes from the wrong line above. |
| `proof` | Поверни сцену: дуга на этом луче меняется, а на перпендикулярном нет. | Sahnani buring: bu nurdagi duga o'zgaradi, perpendikulyardagisi esa yo'q. | Rotate the scene: the arc on this ray changes, the one on the perpendicular does not. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Второй луч ребру не перпендикулярен, и угол не линейный. | Uchinchi. Ikkinchi nur qirraga perpendikulyar emas, va burchak chiziqli emas. | The third. The second ray is not perpendicular to the edge and the angle is not linear. |
| `entry.hint.1` | Проверь у каждого луча перпендикулярность ребру. | Har nurning qirraga perpendikulyarligini tekshiring. | Check each ray for perpendicularity to the edge. |
| `entry.hint.2` | Условие про второй луч в доказательстве не проверено. | Isbotda ikkinchi nur haqidagi shart tekshirilmagan. | The condition about the second ray is not checked in the proof. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них называет линейным не тот угол. | To'rt qator, va ulardan biri chiziqli deb boshqa burchakni aytadi. | Four lines, and one of them calls the wrong angle linear. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `A ∈ a` |
| `row.r2` | `AB ⊥ a,   B ∈ α` |
| `row.r3` | `AD ⊂ β   →   ∠BAD` |
| `row.r4` | `∠BAD = 60°` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Двугранный угол прямой. Сколько градусов в его линейном угле? | Ikki yoqli burchak to'g'ri. Uning chiziqli burchagida necha daraja? | The dihedral angle is right. How many degrees are in its linear angle? |
| `place.ok` | Девяносто. Величина двугранного это величина линейного. | To'qson. Ikki yoqli burchakning kattaligi chiziqli burchak kattaligi. | Ninety. The size of the dihedral is the size of the linear one. |
| `place.wrong` | Посмотри на третью строку карточки. | Kartochkaning uchinchi qatoriga qarang. | Look at the third line of the card. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно всегда | Nima doim to'g'ri | What is always true |
| `multi.d.hint` | Лучи в гранях бывают любые, а линейный угол один. | Yoqlardagi nurlar istalgancha, chiziqli burchak esa bitta. | Rays in the faces can be any, the linear angle is one. |
| `multi.e.hint` | Соседние углы дополняют друг друга, а не равны. | Qo'shni burchaklar bir-birini to'ldiradi, teng emas. | Neighbouring angles complete each other, they are not equal. |
| `multi.ok` | Три записи из пяти. Две оставшиеся ломаются на условии про ребро. | Beshtadan uch yozuv. Qolgan ikkitasi qirra haqidagi shartda sinadi. | Three readings out of five. The other two break on the condition about the edge. |
| `audio.mount` | Прочитаем правило справа налево. По двугранному углу назовём линейный. | Qoidani o'ngdan chapga o'qiymiz. Ikki yoqli burchak bo'yicha chiziqlini aytamiz. | Let us read the rule from right to left. From the dihedral angle we name the linear one. |
| `audio.work` | Отметь все записи, которые верны всегда. Их больше одной. | Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are always true. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `90` |
| `place.step` | `α ⊥ β   →   ∠BAC = 90°` |
| `multi.a` [верно] | `AB ⊥ a,   AC ⊥ a` |
| `multi.b` [верно] | `∠A = ∠B` |
| `multi.c` [верно] | `∠1 + ∠2 = 180°` |
| `multi.d` | `AD ⊂ β   →   ∠BAD` |
| `multi.e` | `∠1 = ∠2 = 180°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `lineynyy-ne-tot`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что ограничивает грани двугранного угла? | Ikki yoqli burchakning yoqlarini nima chegaralaydi? | What bounds the faces of a dihedral angle? |
| `q1.a` [верно] | ребро | qirra | the edge |
| `q1.b` | линейный угол | chiziqli burchak | the linear angle |
| `q1.b.hint` | Линейный угол это мера, а не граница. | Chiziqli burchak o'lchov, chegara emas. | The linear angle is a measure, not a boundary. |
| `q1.c` | вершина | uch | a vertex |
| `q1.c.hint` | У двугранного угла вершины нет, у него ребро. | Ikki yoqli burchakning uchi yo'q, qirrasi bor. | A dihedral angle has no vertex, it has an edge. |
| `q1.d` | плоскость | tekislik | a plane |
| `q1.d.hint` | Плоскость это то, из чего сделаны грани. | Tekislik yoqlar yasalgan narsa. | A plane is what the faces are made of. |
| `q2.prompt` | Куда должны смотреть лучи линейного угла? | Chiziqli burchak nurlari qayerga qarashi kerak? | Where must the rays of the linear angle point? |
| `q2.a` [верно] | перпендикулярно ребру | qirraga perpendikulyar | perpendicular to the edge |
| `q2.b` | вдоль ребра | qirra bo'ylab | along the edge |
| `q2.b.hint` | Вдоль ребра луч дал бы нулевой угол. | Qirra bo'ylab nur nol burchak berardi. | Along the edge a ray would give a zero angle. |
| `q2.c` | в любую сторону | istalgan tomonga | in any direction |
| `q2.c.hint` | Тогда величина двугранного была бы не одна. | Unda ikki yoqli burchakning kattaligi bitta bo'lmasdi. | Then the size of the dihedral would not be single. |
| `q2.d` | к вершине | uchga | towards the vertex |
| `q2.d.hint` | Вершины у двугранного угла нет. | Ikki yoqli burchakda uch yo'q. | A dihedral angle has no vertex. |
| `q3.prompt` | Один из четырёх углов сто двадцать. Соседний? | To'rt burchakdan biri bir yuz yigirma. Qo'shnisi? | One of the four angles is one hundred twenty. The neighbour? |
| `q3.a` [верно] | шестьдесят | oltmish | sixty |
| `q3.b` | сто двадцать | bir yuz yigirma | one hundred twenty |
| `q3.b.hint` | Сто двадцать у противоположного, а не у соседнего. | Bir yuz yigirma qarama-qarshisida, qo'shnisida emas. | One hundred twenty belongs to the opposite one. |
| `q3.c` | девяносто | to'qson | ninety |
| `q3.c.hint` | Девяносто было бы у перпендикулярных плоскостей. | To'qson perpendikulyar tekisliklarda bo'lardi. | Ninety would belong to perpendicular planes. |
| `q3.d` | сорок | qirq | forty |
| `q3.d.hint` | Проверь сумму со ста восьмьюдесятью. | Bir yuz sakson bilan yig'indini tekshiring. | Check the sum with one hundred eighty. |
| `q4.prompt` | Какой угол называют углом между плоскостями? | Tekisliklar orasidagi burchak deb qaysi burchak aytiladi? | Which angle is called the angle between planes? |
| `q4.a` [верно] | наименьший из четырёх | to'rttadan eng kichigi | the smallest of the four |
| `q4.b` | наибольший из четырёх | to'rttadan eng kattasi | the biggest of the four |
| `q4.b.hint` | Наибольший бывает тупым, и он не годится в меру. | Eng kattasi o'tmas bo'ladi, va u o'lchov uchun yaramaydi. | The biggest can be obtuse and does not serve as a measure. |
| `q4.c` | любой из четырёх | to'rttadan istalgani | any of the four |
| `q4.c.hint` | Тогда мера была бы не одна. | Unda o'lchov bitta bo'lmasdi. | Then the measure would not be single. |
| `q4.d` | сумма всех четырёх | to'rttasining yig'indisi | the sum of all four |
| `q4.d.hint` | Сумма всегда триста шестьдесят и ничего не различает. | Yig'indi doim uch yuz oltmish va hech narsani ajratmaydi. | The sum is always three hundred sixty and tells nothing apart. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a = α ∩ β` |
| `q2.done` | `AB ⊥ a` |
| `q3.done` | `120° + 60° = 180°` |
| `q4.done` | `∠(α; β) ≤ 90°` |
| `angles` | `40°` · `90°` · `120°` · `180°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Различаю грани и ребро двугранного угла | Ikki yoqli burchakning yoqlari va qirrasini ajrataman | I tell the faces and the edge of a dihedral angle apart |
| `can.2` | Строю линейный угол перпендикулярно ребру | Chiziqli burchakni qirraga perpendikulyar quraman | I build the linear angle perpendicular to the edge |
| `can.3` | Знаю, что от точки на ребре величина не зависит | Kattalik qirradagi nuqtaga bog'liq emasligini bilaman | I know the size does not depend on the point on the edge |
| `can.4` | Нахожу все четыре угла по одному | Bittasi bo'yicha to'rttasini topaman | I find all four angles from one |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Блок закончен. Дальше многогранники, и там двугранные углы будут в каждой задаче | Blok tugadi. Bundan keyin ko'pyoqliklar, va u yerda ikki yoqli burchaklar har masalada bo'ladi | The block is over. Next come polyhedra, where dihedral angles appear in every problem |
| `lifehack` | Ищешь угол между плоскостями — строй линейный угол на ребре | Tekisliklar orasidagi burchakni izlayotgan bo'lsangiz, qirrada chiziqli burchak quring | Looking for the angle between planes, build the linear angle on the edge |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страницы сто сорок два и сто сорок три | Geometriya, bir yuz qirq ikkinchi va bir yuz qirq uchinchi betlar | Geometry, pages one hundred forty two and one hundred forty three |
| `audio.mount` | Урок начался с вопроса, зависит ли величина от места на ребре. | Dars kattalik qirradagi joyga bog'liqmi degan savol bilan boshlandi. | The lesson began with the question whether the size depends on the place on the edge. |
| `audio.next` | Не зависит, и мы это увидели, а не просто услышали. Точка ехала по ребру, а угол не менялся. Причина в том, что перпендикуляр к ребру в каждой грани один, и лучи при разных точках параллельны. Дальше начинаются многогранники, и двугранные углы будут появляться в каждой задаче. | Bog'liq emas, va biz buni shunchaki eshitmadik, ko'rdik. Nuqta qirra bo'ylab yurdi, burchak esa o'zgarmadi. Sababi shuki, har yoqda qirraga perpendikulyar bitta, va turli nuqtalardagi nurlar parallel. Bundan keyin ko'pyoqliklar boshlanadi, va ikki yoqli burchaklar har masalada paydo bo'ladi. | It does not depend, and we saw that rather than merely heard it. The point travelled along the edge and the angle did not change. The reason is that there is one perpendicular to the edge in each face, and the rays at different points are parallel. Next polyhedra begin, and dihedral angles will appear in every problem. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `∠A ≠ ∠B` |
| `hook.b` | `∠A = ∠B` |
| `proved` | `∠A = ∠B` |
| `law` | `AB ⊥ a,   AC ⊥ a` |
| `sheet.1` | `a = α ∩ β` |
| `sheet.2` | `AB ⊥ a,   AC ⊥ a` |
| `sheet.3` | `∠(α; β) = ∠BAC` |
| `sheet.4` | `∠1 + ∠2 = 180°` |
| `sheet.5` | `α ⊥ β   →   90°` |
