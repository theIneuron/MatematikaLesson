# Урок 38 — Аксиомы стереометрии · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS38_40_SKELET.md` §7. Опора: учебник геометрии 2022, §4
`Stereometriyaning asosiy tushunchalari`, стр. 32–38.

**Главное решение урока.** Свидетелем становится **поворот**. Три точки, не лежащие на одной
прямой, задают плоскость однозначно: сколько сцену ни крути, плоскость стоит на месте. Три
точки на одной прямой не задают ничего: плоскость крутится вокруг этой прямой, и каждое её
положение годится. Это видно только в движении, и потому это первый урок прибора 6A.

**Три аксиомы взяты со стр. 34 дословно.** Следствие экрана 10 — тоже книжное (1-natija).

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРОСТРАНСТВО | FAZO | SPACE |
| `title` | Одна плоскость или сколько угодно | Bitta tekislikmi yoki istalgancha | One plane or any number |
| `row.a.name` | через любые три точки одна | istalgan uch nuqta orqali bitta | one through any three points |
| `row.b.name` | одна не всегда | bitta har doim ham emas | not always one |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену и посмотрим. | Javobingiz yozib olindi. Endi sahnani burib ko'ramiz. | Your answer is saved. Now we will rotate the scene and look. |
| `audio.mount` | В пространстве плоскостей бесконечно много. Вопрос в том, чем плоскость задаётся однозначно. | Fazoda tekisliklar cheksiz ko'p. Savol shundaki, tekislik nima bilan yagona qilib beriladi. | In space there are infinitely many planes. The question is what fixes a plane uniquely. |
| `audio.r1` | Первая запись говорит: возьми три точки, и плоскость через них ровно одна, всегда. | Birinchi yozuv shunday deydi: uch nuqta oling, ular orqali tekislik roppa-rosa bitta, doim. | The first reading says: take three points and there is exactly one plane through them, always. |
| `audio.r2` | Вторая говорит, что так бывает не всегда, и есть случай, когда плоскостей бесконечно много. | Ikkinchisi bunday har doim ham bo'lmasligini va tekisliklar cheksiz ko'p bo'ladigan hol borligini aytadi. | The second says this does not always hold and there is a case with infinitely many planes. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `A, B, C   →   α` |
| `row.a.value` | `1` |
| `row.b.value` | `∞` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед пространством | Fazodan oldin uch savol | Three questions before space |
| `q1.prompt` | Чем стереометрия отличается от планиметрии? | Stereometriya planimetriyadan nimasi bilan farq qiladi? | How does stereometry differ from planimetry? |
| `q1.a` [верно] | изучает пространственные фигуры | fazoviy shakllarni o'rganadi | it studies spatial figures |
| `q1.b` | изучает только многогранники | faqat ko'pyoqlarni o'rganadi | it studies only polyhedra |
| `q1.b.hint` | Многогранники это часть предмета, а не весь предмет. | Ko'pyoqlar fanning bir qismi, butun fani emas. | Polyhedra are a part of the subject, not the whole of it. |
| `q1.c` | это другое название планиметрии | bu planimetriyaning boshqa nomi | it is another name for planimetry |
| `q1.c.hint` | Планиметрия живёт на одной плоскости, стереометрия во всём пространстве. | Planimetriya bitta tekislikda yashaydi, stereometriya butun fazoda. | Planimetry lives on one plane, stereometry in the whole of space. |
| `q1.d` | в ней нет аксиом | unda aksiomalar yo'q | it has no axioms |
| `q1.d.hint` | Аксиомы есть, и с них начинают. | Aksiomalar bor, va ulardan boshlanadi. | There are axioms and they come first. |
| `q2.prompt` | Что такое основные понятия? | Asosiy tushunchalar nima? | What are the basic notions? |
| `q2.a` [верно] | те, которым не дают определения | ta'rif berilmaydiganlari | the ones that are not defined |
| `q2.b` | самые важные теоремы | eng muhim teoremalar | the most important theorems |
| `q2.b.hint` | Теорема это утверждение, а понятие это предмет разговора. | Teorema bu tasdiq, tushuncha esa suhbat mavzusi. | A theorem is a statement, a notion is what you speak about. |
| `q2.c` | те, которые проходят первыми | birinchi o'tiladiganlari | the ones taught first |
| `q2.c.hint` | Порядок тут ни при чём, дело в определении. | Tartibning bunga aloqasi yo'q, gap ta'rifda. | Order is not the point, definition is. |
| `q2.d` | те, которые доказывают | isbotlanadiganlari | the ones that are proved |
| `q2.d.hint` | Доказывают утверждения, а не понятия. | Tasdiqlar isbotlanadi, tushunchalar emas. | Statements are proved, not notions. |
| `q3.prompt` | Как обозначают плоскость? | Tekislik qanday belgilanadi? | How is a plane denoted? |
| `q3.a` [верно] | греческой буквой | yunon harfi bilan | by a Greek letter |
| `q3.b` | большой латинской | katta lotin harfi bilan | by a capital Latin letter |
| `q3.b.hint` | Большими латинскими обозначают точки. | Katta lotin harflari bilan nuqtalar belgilanadi. | Capital Latin letters denote points. |
| `q3.c` | маленькой латинской | kichik lotin harfi bilan | by a small Latin letter |
| `q3.c.hint` | Маленькими латинскими обозначают прямые. | Kichik lotin harflari bilan to'g'ri chiziqlar belgilanadi. | Small Latin letters denote lines. |
| `q3.d` | цифрой | raqam bilan | by a digit |
| `q3.d.hint` | Цифрами в геометрии обозначают величины, а не фигуры. | Geometriyada raqamlar bilan kattaliklar belgilanadi, shakllar emas. | Digits denote magnitudes in geometry, not figures. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `A ∈ α,   a ⊂ α` |
| `q2.done` | `A,   a,   α` |
| `q3.done` | `α,  β,  γ` |

---

## Экран 3 · `explain1` · ответ `number` · тег `tri-tochki-na-pryamoy`

Три точки не на прямой. Ученик крутит сцену сам.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Поверни сцену и посмотри | Sahnani burib ko'ring | Rotate the scene and look |
| `show.1.1` | три точки не лежат на одной прямой | uch nuqta bir to'g'ri chiziqda yotmaydi | the three points are not on one line |
| `show.1.2` | через них проведена плоскость | ular orqali tekislik o'tkazilgan | a plane is drawn through them |
| `show.1.3` | поверни сцену и следи за ней | sahnani buring va unga qarang | rotate the scene and watch it |
| `show.2.1` | плоскость осталась на месте | tekislik joyida qoldi | the plane stayed where it was |
| `show.2.2` | другого положения для неё нет | uning uchun boshqa holat yo'q | there is no other position for it |
| `show.2.3` | значит она единственная | demak u yagona | so it is unique |
| `audio.mount` | Три точки в пространстве и плоскость через них. Дальше работает не картинка, а поворот. | Fazoda uch nuqta va ular orqali tekislik. Keyin rasm emas, burilish ishlaydi. | Three points in space and a plane through them. From here it is the rotation that works, not the picture. |
| `audio.spin*` | Возьми сцену и поверни её. Точки поехали, плоскость поехала вместе с ними, но относительно точек она не сдвинулась ни на сколько. Другого положения у неё нет. Третья точка не лежит на прямой через первые две, и она держит плоскость. Именно это говорит первая аксиома. Обрати внимание на слово в ней: точки не должны лежать на одной прямой. Если условие убрать, аксиома перестанет быть верной, и на следующем экране мы это увидим. | Sahnani olib buring. Nuqtalar siljidi, tekislik ular bilan birga siljidi, lekin nuqtalarga nisbatan u zarracha ham qimirlamadi. Uning uchun boshqa holat yo'q. Uchinchi nuqta birinchi ikkitasi orqali o'tgan to'g'ri chiziqda yotmaydi, va u tekislikni ushlab turadi. Birinchi aksioma aynan shuni aytadi. Undagi so'zga e'tibor bering: nuqtalar bir to'g'ri chiziqda yotmasligi kerak. Shart olib tashlansa, aksioma to'g'ri bo'lmay qoladi, va buni keyingi ekranda ko'ramiz. | Take the scene and rotate it. The points moved, the plane moved with them, but relative to the points it did not shift at all. It has no other position. The third point does not lie on the line through the first two, and it holds the plane. That is exactly what the first axiom says. Notice the words in it: the points must not lie on one line. Remove that condition and the axiom stops being true, and we will see that on the next screen. |
| `audio.work` | Посчитай сам. Сколько плоскостей проходит через эти три точки? | O'zingiz hisoblang. Bu uch nuqta orqali nechta tekislik o'tadi? | Work it out yourself. How many planes pass through these three points? |
| `work.prompt` | Сколько плоскостей проходит через них? | Ular orqali nechta tekislik o'tadi? | How many planes pass through them? |
| `work.ok` | Одна. Сколько сцену ни крути, другого положения не находится. | Bitta. Sahnani qancha burmang, boshqa holat topilmaydi. | One. However much you rotate the scene, no other position turns up. |
| `work.hint.1` | Поверни сцену и посмотри, меняется ли положение плоскости. | Sahnani buring va tekislik holati o'zgaradimi, qarang. | Rotate the scene and see whether the plane changes position. |
| `work.hint.2` | Третья точка не на прямой, и она держит плоскость. | Uchinchi nuqta to'g'ri chiziqda emas, va u tekislikni ushlab turadi. | The third point is off the line and it holds the plane. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 4 · `explain2` · ответ `lead` · тег `tri-tochki-na-pryamoy`

Разграничение: те же три точки на одной прямой.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Точки сдвинули на одну прямую | Nuqtalar bir to'g'ri chiziqqa surildi | The points were moved onto one line |
| `show.1.1` | теперь все три на одной прямой | endi uchalasi ham bir to'g'ri chiziqda | now all three are on one line |
| `show.1.2` | плоскость через них по-прежнему проходит | tekislik ular orqali baribir o'tadi | a plane still passes through them |
| `show.1.3` | но она больше не одна | lekin u endi yagona emas | but it is no longer alone |
| `show.2.1` | плоскость крутится вокруг прямой | tekislik to'g'ri chiziq atrofida aylanadi | the plane spins around the line |
| `show.2.2` | каждое её положение годится | uning har bir holati yaraydi | every position of it works |
| `show.2.3` | ни одно не выделено | birortasi ajratilmagan | none of them is singled out |
| `audio.mount` | Те же три точки, и все они на одной прямой. | O'sha uch nuqta, va ularning hammasi bir to'g'ri chiziqda. | The same three points, and all of them on one line. |
| `audio.turn*` | Смотри, что стало с плоскостью. Она проходит через все три точки, как и раньше, но теперь её можно крутить вокруг прямой, и она всё равно будет проходить через них. Одно положение, второе, третье, годятся все. Плоскостей через три такие точки бесконечно много, и ни одна не лучше остальных. Вот почему в аксиоме стоит условие про прямую. Без него утверждение неверно, и убедились мы в этом не рассуждением, а поворотом. | Tekislikka nima bo'lganiga qarang. U avvalgidek uchala nuqta orqali o'tadi, lekin endi uni to'g'ri chiziq atrofida burish mumkin, va u baribir ular orqali o'tadi. Bir holat, ikkinchi, uchinchi, hammasi yaraydi. Bunday uch nuqta orqali tekisliklar cheksiz ko'p, va birortasi qolganidan yaxshi emas. Aksiomada to'g'ri chiziq haqidagi shart shuning uchun turadi. Usiz tasdiq noto'g'ri, va bunga biz mulohaza bilan emas, burilish bilan ishonch hosil qildik. | Look at what happened to the plane. It passes through all three points as before, but now it can be spun around the line and it will still pass through them. One position, a second, a third, all of them work. There are infinitely many planes through three such points, and none is better than the others. That is why the axiom carries the condition about the line. Without it the statement is false, and we became sure of that not by reasoning but by rotating. |
| `audio.work` | Поверни сцену и ответь: сколько таких плоскостей? | Sahnani buring va javob bering: bunday tekisliklar nechta? | Rotate the scene and answer: how many such planes are there? |
| `pick.prompt` | Сколько плоскостей проходит через три точки одной прямой? | Bir to'g'ri chiziqdagi uch nuqta orqali nechta tekislik o'tadi? | How many planes pass through three points of one line? |
| `pick.a` | ровно одна | roppa-rosa bitta | exactly one |
| `pick.a.hint` | Ты только что покрутил её и нашёл другие положения. | Siz uni hozirgina burib, boshqa holatlarni topdingiz. | You have just rotated it and found other positions. |
| `pick.b` [верно] | бесконечно много | cheksiz ko'p | infinitely many |
| `pick.c` | ни одной | bitta ham yo'q | none |
| `pick.c.hint` | Хотя бы одна есть: ты её видишь на экране. | Hech bo'lmaganda bittasi bor: siz uni ekranda ko'rib turibsiz. | At least one exists: you can see it on the screen. |
| `pick.ok` | Бесконечно много. Три точки на одной прямой плоскость не задают. | Cheksiz ko'p. Bir to'g'ri chiziqdagi uch nuqta tekislikni belgilamaydi. | Infinitely many. Three points on one line do not fix a plane. |

**Формулы**

| Ключ | Значение |
|---|---|
| `mark` | `A, B, C ∈ a   →   α ⊃ a` |

---

## Экран 5 · `explain3` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Вторая аксиома: две точки прямой в плоскости.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Две точки тянут за собой всю прямую | Ikki nuqta butun to'g'ri chiziqni ergashtiradi | Two points drag the whole line along |
| `show.1.1` | две точки прямой лежат в плоскости | to'g'ri chiziqning ikki nuqtasi tekislikda yotadi | two points of the line lie in the plane |
| `show.1.2` | про остальные пока ничего не сказано | qolganlari haqida hozircha hech nima aytilmagan | nothing is said about the rest yet |
| `show.1.3` | поверни и посмотри на прямую | buring va to'g'ri chiziqqa qarang | rotate and look at the line |
| `show.2.1` | прямая целиком лежит в плоскости | to'g'ri chiziq butunlay tekislikda yotadi | the whole line lies in the plane |
| `show.2.2` | она не выходит из неё ни в одной точке | u undan birorta nuqtada ham chiqmaydi | it does not leave it at any point |
| `show.2.3` | это вторая аксиома | bu ikkinchi aksioma | this is the second axiom |
| `audio.mount` | Вторая аксиома. Она короткая, а работать будет весь курс. | Ikkinchi aksioma. U qisqa, lekin butun kurs davomida ishlaydi. | The second axiom. It is short, and it will work for the whole course. |
| `audio.lie*` | Возьмём прямую и отметим на ней две точки, которые лежат в плоскости. Больше про эту прямую ничего не известно. Кажется, что она могла бы проткнуть плоскость и уйти в сторону, но нет. Аксиома говорит: если две точки прямой лежат в плоскости, то все её точки лежат в этой плоскости. Поверни сцену и убедись, что прямая не выходит из плоскости нигде. Отсюда, кстати, следует привычный приём: чтобы проверить, лежит ли прямая в плоскости, хватит двух точек. Не всей прямой, а двух точек. | To'g'ri chiziqni olamiz va unda tekislikda yotgan ikki nuqtani belgilaymiz. Bu to'g'ri chiziq haqida boshqa hech nima ma'lum emas. U tekislikni teshib chetga ketishi mumkindek tuyuladi, lekin yo'q. Aksioma shunday deydi: agar to'g'ri chiziqning ikki nuqtasi tekislikda yotsa, uning barcha nuqtalari shu tekislikda yotadi. Sahnani buring va to'g'ri chiziq tekislikdan hech qayerda chiqmasligiga ishonch hosil qiling. Aytgancha, bundan tanish usul kelib chiqadi: to'g'ri chiziq tekislikda yotganini tekshirish uchun ikki nuqta yetadi. Butun to'g'ri chiziq emas, ikki nuqta. | Take a line and mark two of its points that lie in the plane. Nothing else is known about this line. It seems it could pierce the plane and go off to the side, but no. The axiom says: if two points of a line lie in a plane, then all its points lie in that plane. Rotate the scene and see that the line does not leave the plane anywhere. From this, by the way, follows the familiar move: to check whether a line lies in a plane, two points are enough. Not the whole line, two points. |
| `audio.work` | Посчитай сам. Сколько точек прямой надо проверить? | O'zingiz hisoblang. To'g'ri chiziqning nechta nuqtasini tekshirish kerak? | Work it out yourself. How many points of the line must be checked? |
| `work.prompt` | Сколько точек прямой надо проверить? | To'g'ri chiziqning nechta nuqtasini tekshirish kerak? | How many points of the line must be checked? |
| `work.ok` | Две. Остальные придут сами по второй аксиоме. | Ikkita. Qolganlari ikkinchi aksioma bo'yicha o'zi keladi. | Two. The rest follow by the second axiom. |
| `work.hint.1` | Прочитай вторую аксиому ещё раз. | Ikkinchi aksiomani yana bir bor o'qing. | Read the second axiom once more. |
| `work.hint.2` | В ней сказано про две точки. | Unda ikki nuqta haqida aytilgan. | It speaks about two points. |
| `work.hint.3` | Две. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `A, B ∈ α,  A, B ∈ a   →   a ⊂ α` |
| `work.answer` | `2` |

---

## Экран 6 · `explain4` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Сам: третья аксиома.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Две плоскости с общей точкой | Umumiy nuqtali ikki tekislik | Two planes with a common point |
| `show.1.1` | две плоскости, у них есть общая точка | ikki tekislik, ularning umumiy nuqtasi bor | two planes with a common point |
| `show.1.2` | одной точкой дело не кончается | ish bitta nuqta bilan tugamaydi | one point is not the end of it |
| `show.1.3` | поверни сцену и посмотри | sahnani buring va qarang | rotate the scene and look |
| `show.2.1` | у них есть общая прямая | ularning umumiy to'g'ri chizig'i bor | they have a common line |
| `show.2.2` | она проходит через эту точку | u shu nuqtadan o'tadi | it passes through that point |
| `show.2.3` | и такая прямая одна | va bunday to'g'ri chiziq bitta | and there is one such line |
| `audio.mount` | Третья аксиома. Здесь считать придётся самому. | Uchinchi aksioma. Bu yerda o'zingiz hisoblashingizga to'g'ri keladi. | The third axiom. Here you will have to count for yourself. |
| `audio.cut*` | Две плоскости имеют общую точку. Аксиома утверждает, что тогда у них есть и общая прямая, проходящая через эту точку. То есть двух плоскостей, которые касались бы друг друга ровно в одной точке, в пространстве не бывает: либо у них нет общих точек вовсе, либо есть целая прямая. Поверни сцену и найди эту прямую. Она видна как линия, по которой одна плоскость входит в другую. Посчитай, сколько таких общих прямых у двух пересекающихся плоскостей. | Ikki tekislikning umumiy nuqtasi bor. Aksioma shuni tasdiqlaydiki, u holda ularning shu nuqtadan o'tuvchi umumiy to'g'ri chizig'i ham bor. Ya'ni bir-biriga roppa-rosa bitta nuqtada tegadigan ikki tekislik fazoda bo'lmaydi: yo ularning umumiy nuqtasi umuman yo'q, yo butun bir to'g'ri chiziq bor. Sahnani buring va shu to'g'ri chiziqni toping. U bir tekislik ikkinchisiga kiradigan chiziq ko'rinishida ko'rinadi. Kesishuvchi ikki tekislikning bunday umumiy to'g'ri chizig'i nechta ekanini sanang. | Two planes have a common point. The axiom claims that then they also have a common line through that point. That is, two planes that touch each other at exactly one point do not exist in space: either they have no common points at all, or they have a whole line. Rotate the scene and find that line. It shows as the line along which one plane enters the other. Count how many such common lines two intersecting planes have. |
| `audio.work` | Посчитай сам. Сколько общих прямых у двух пересекающихся плоскостей? | O'zingiz hisoblang. Kesishuvchi ikki tekislikning nechta umumiy to'g'ri chizig'i bor? | Work it out yourself. How many common lines do two intersecting planes have? |
| `work.prompt` | Сколько у них общих прямых? | Ularning nechta umumiy to'g'ri chizig'i bor? | How many common lines do they have? |
| `work.ok` | Одна. Две плоскости пересекаются по одной прямой, и по одной точке не пересекаются никогда. | Bitta. Ikki tekislik bitta to'g'ri chiziq bo'ylab kesishadi, bitta nuqta bo'yicha esa hech qachon kesishmaydi. | One. Two planes meet along one line, and never at a single point. |
| `work.hint.1` | Поверни сцену и найди линию, по которой они входят друг в друга. | Sahnani buring va ular bir-biriga kiradigan chiziqni toping. | Rotate the scene and find the line along which they enter each other. |
| `work.hint.2` | Если бы таких прямых было две, плоскости совпали бы. | Bunday to'g'ri chiziq ikkita bo'lganda, tekisliklar ustma-ust tushardi. | If there were two such lines, the planes would coincide. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `α ∩ β = a` |
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `izmeril-znachit-dokazal`

Граничный: измерение не доказательство.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Измерил — ещё не доказал | O'lchadi — hali isbotlamadi | Measured is not proved |
| `show.1.1` | на чертеже два отрезка кажутся равными | chizmada ikki kesma teng ko'rinadi | on the drawing two segments look equal |
| `show.1.2` | линейка показывает одно и то же число | chizg'ich bir xil sonni ko'rsatadi | the ruler shows the same number |
| `show.1.3` | это результат измерения | bu o'lchash natijasi | this is the result of a measurement |
| `show.2.1` | поверни сцену | sahnani buring | rotate the scene |
| `show.2.2` | числа разошлись | sonlar farq qildi | the numbers came apart |
| `show.2.3` | значит мерили не длину, а проекцию | demak uzunlikni emas, proyeksiyani o'lchadik | so it was the projection that was measured, not the length |
| `audio.mount` | Один приём из седьмого класса переносится сюда и становится строже. | Yettinchi sinfdagi bir usul bu yerga ko'chadi va qattiqroq bo'ladi. | One move from grade seven carries over here and gets stricter. |
| `audio.rule*` | В планиметрии мы уже договаривались: результат измерения линейкой подписывается словом предположение и в доказательство не берётся. В пространстве это правило становится жёстче. На плоском чертеже мы видим не сам отрезок, а его проекцию, а проекция искажает и длины, и углы. Поверни сцену: два отрезка, которые казались равными, разъехались. Ни один из этих замеров ничего не доказывает, оба они только повод присмотреться. Доказывают по аксиомам и по уже доказанным утверждениям, а не по картинке. | Planimetriyada biz allaqachon kelishgan edik: chizg'ich bilan o'lchash natijasi taxmin so'zi bilan imzolanadi va isbotga olinmaydi. Fazoda bu qoida qattiqroq bo'ladi. Yassi chizmada biz kesmaning o'zini emas, uning proyeksiyasini ko'ramiz, proyeksiya esa uzunlikni ham, burchakni ham buzadi. Sahnani buring: teng ko'ringan ikki kesma ajralib ketdi. Bu o'lchovlarning birortasi hech nimani isbotlamaydi, ikkalasi ham faqat diqqat bilan qarashga sabab. Isbot aksiomalar va allaqachon isbotlangan tasdiqlar bo'yicha qilinadi, rasm bo'yicha emas. | In planimetry we already agreed: the result of measuring with a ruler is labelled a guess and is not taken into a proof. In space this rule gets harder. On a flat drawing we do not see the segment itself but its projection, and a projection distorts both lengths and angles. Rotate the scene: two segments that looked equal have come apart. Neither of these measurements proves anything, both are only a reason to look closer. Proofs go by axioms and by statements already proved, not by the picture. |
| `audio.work` | Посчитай сам. Сколько из двух замеров годится в доказательство? | O'zingiz hisoblang. Ikki o'lchovdan nechtasi isbotga yaraydi? | Work it out yourself. How many of the two measurements can go into a proof? |
| `work.prompt` | Сколько замеров годится в доказательство? | Nechta o'lchov isbotga yaraydi? | How many measurements can go into a proof? |
| `work.ok` | Ни одного. Измерение по проекции не доказывает ничего. | Bitta ham yo'q. Proyeksiya bo'yicha o'lchash hech nimani isbotlamaydi. | None. A measurement taken from a projection proves nothing. |
| `work.hint.1` | Вспомни, чем подписывался результат линейки в седьмом классе. | Yettinchi sinfda chizg'ich natijasi nima bilan imzolanganini eslang. | Recall how a ruler result was labelled in grade seven. |
| `work.hint.2` | На чертеже видна проекция, а не сам отрезок. | Chizmada proyeksiya ko'rinadi, kesmaning o'zi emas. | The drawing shows the projection, not the segment itself. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `tri-tochki-na-pryamoy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Три аксиомы | Uch aksioma | Three axioms |
| `probe.question` | Какое условие в первой аксиоме отбрасывать нельзя? | Birinchi aksiomadagi qaysi shartni tashlab bo'lmaydi? | Which condition in the first axiom cannot be dropped? |
| `probe.a` [верно] | точки не лежат на одной прямой | nuqtalar bir to'g'ri chiziqda yotmaydi | the points do not lie on one line |
| `probe.b` | точек ровно три | nuqtalar roppa-rosa uchta | there are exactly three points |
| `probe.b.hint` | Три их и есть. Дело не в числе, а в том, как они расположены. | Ular uchta ham. Gap sonda emas, joylashuvida. | There are three of them indeed. The point is not their number but their arrangement. |
| `rule.lawLabel` | ТРИ АКСИОМЫ | UCH AKSIOMA | THE THREE AXIOMS |
| `rule.lines.1` | через три точки не на одной прямой проходит единственная плоскость | bir to'g'ri chiziqda yotmagan uch nuqta orqali yagona tekislik o'tadi | through three points not on one line passes a unique plane |
| `rule.lines.2` | если две точки прямой в плоскости, то вся прямая в ней | to'g'ri chiziqning ikki nuqtasi tekislikda bo'lsa, butun chiziq unda | if two points of a line are in a plane, the whole line is in it |
| `rule.lines.3` | если у двух плоскостей есть общая точка, есть и общая прямая | ikki tekislikning umumiy nuqtasi bo'lsa, umumiy to'g'ri chizig'i ham bor | if two planes share a point, they share a line |
| `audio.mount` | Соберём правило. Аксиом три, и все три мы уже видели в движении. | Qoidani yig'amiz. Aksioma uchta, uchalasini ham harakatda ko'rdik. | Let us put the rule together. There are three axioms and we have seen all three in motion. |
| `audio.rule*` | Первая: если три точки не лежат на одной прямой, через них можно провести единственную плоскость. Слова про прямую здесь главные, без них утверждение неверно. Вторая: если две точки прямой лежат в плоскости, то все её точки лежат в этой плоскости. Отсюда правило проверки: хватает двух точек. Третья: если у двух плоскостей есть общая точка, то есть и общая прямая, проходящая через неё. Значит по одной точке плоскости не пересекаются никогда. Вместе с аксиомами планиметрии эти три составляют основу стереометрии, и дальше всё доказывается из них. | Birinchi: agar uch nuqta bir to'g'ri chiziqda yotmasa, ular orqali yagona tekislik o'tkazish mumkin. To'g'ri chiziq haqidagi so'zlar bu yerda asosiy, ularsiz tasdiq noto'g'ri. Ikkinchi: agar to'g'ri chiziqning ikki nuqtasi tekislikda yotsa, uning barcha nuqtalari shu tekislikda yotadi. Bundan tekshirish qoidasi: ikki nuqta yetadi. Uchinchi: agar ikki tekislikning umumiy nuqtasi bo'lsa, undan o'tuvchi umumiy to'g'ri chiziq ham bor. Demak tekisliklar bitta nuqta bo'yicha hech qachon kesishmaydi. Planimetriya aksiomalari bilan birga bu uchtasi stereometriyaning asosini tashkil qiladi, va keyin hammasi ulardan isbotlanadi. | First: if three points do not lie on one line, a unique plane can be drawn through them. The words about the line are the main part here, without them the statement is false. Second: if two points of a line lie in a plane, then all its points lie in that plane. Hence the checking rule: two points are enough. Third: if two planes have a common point, they also have a common line through it. So planes never meet at a single point. Together with the axioms of planimetry these three form the basis of stereometry, and everything further is proved from them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `S₁: A, B, C ∉ a   →   α` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `tri-tochki-na-pryamoy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини условие с числом плоскостей | Shartni tekisliklar soni bilan ulang | Match each condition with the number of planes |
| `match.prompt` | Сколько разных плоскостей отвечает записи | Yozuvga nechta har xil tekislik mos keladi | How many distinct planes each writing gives |
| `match.ok` | Верно. Из четырёх точек тройку выбирают четырьмя способами, а грани куба лежат в шести плоскостях. | To'g'ri. To'rt nuqtadan uchlik to'rt xil tanlanadi, kubning yoqlari esa olti tekislikda yotadi. | Correct. A triple is chosen from four points in four ways, and the faces of a cube lie in six planes. |
| `audio.mount` | Четыре записи и четыре ответа. Считай, не рисуя. Последняя запись это куб: считай плоскости его граней. | To'rt yozuv va to'rt javob. Chizmasdan hisoblang. Oxirgi yozuv bu kub: uning yoqlari tekisliklarini sanang. | Four writings and four answers. Count without drawing. The last writing is a cube: count the planes of its faces. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `A, B, C ∉ a` · `A, B, C ∈ a` · `A, B, C, D` · `ABCDA₁B₁C₁D₁` |
| `match.a` | `1` |
| `match.b` | `∞` |
| `match.c` | `4` |
| `match.d` | `6` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `kartinka-kak-dokazatelstvo`

Доказательство 1-natija из учебника, стр. 34.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи следствие | Natijani isbotlang | Prove the corollary |
| `proof.given` | прямая и точка вне её | to'g'ri chiziq va undan tashqaridagi nuqta | a line and a point outside it |
| `proof.goal` | через них проходит ровно одна плоскость | ular orqali roppa-rosa bitta tekislik o'tadi | exactly one plane passes through them |
| `proof.r1` | берём на прямой две точки | to'g'ri chiziqda ikki nuqta olamiz | take two points on the line |
| `proof.r2` | три точки не на одной прямой, проводим плоскость | uch nuqta bir chiziqda emas, tekislik o'tkazamiz | three points not on one line, draw the plane |
| `proof.r3` | две точки прямой в плоскости, значит вся прямая в ней | chiziqning ikki nuqtasi tekislikda, demak butun chiziq unda | two points of the line are in the plane, so the whole line is |
| `proof.e1` | Аксиома тут ещё не работает. Этот шаг мы делаем сами. | Aksioma bu yerda hali ishlamaydi. Bu qadamni o'zimiz qilamiz. | No axiom works here yet. We make this step ourselves. |
| `proof.e2` | Плоскости пока нет. Её ещё надо получить. | Tekislik hali yo'q. Uni olish kerak. | There is no plane yet. It still has to be obtained. |
| `proof.e3` | Плоскость уже есть. Речь о том, что в неё попадает целая прямая. | Tekislik bor. Gap unga tushadigan to'g'ri chiziq haqida. | The plane is there. This is about the line that falls into it. |
| `proof.ok` | Доказано. Обе аксиомы понадобились: первая дала плоскость, вторая втянула в неё прямую. | Isbotlandi. Ikkala aksioma ham kerak bo'ldi: birinchisi tekislik berdi, ikkinchisi unga chiziqni tortdi. | Proved. Both axioms were needed: the first gave the plane, the second pulled the line into it. |
| `reason.s1` | первая аксиома | birinchi aksioma | the first axiom |
| `reason.s2` | вторая аксиома | ikkinchi aksioma | the second axiom |
| `reason.s3` | по построению | yasashga ko'ra | by construction |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование: он показывает одно положение из многих. | Chizma asoslash emas: u ko'p holatdan bittasini ko'rsatadi. | A drawing is not a justification: it shows one position out of many. |
| `reason.measure` | измерено линейкой | chizg'ich bilan o'lchangan | measured with a ruler |
| `reason.measure.missing` | Измерение это предположение, а не довод. | O'lchash taxmin, dalil emas. | A measurement is a guess, not an argument. |
| `audio.mount` | Теперь докажем следствие из аксиом. Обоснование каждой строки выбирается из списка. | Endi aksiomalardan chiqadigan natijani isbotlaymiz. Har qatorning asoslashi ro'yxatdan tanlanadi. | Now let us prove a corollary of the axioms. The justification of each line is chosen from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a, C ∉ a   →   α` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Четыре точки, никакие три не на прямой | To'rt nuqta, hech qaysi uchtasi bir chiziqda emas | Four points, no three on one line |
| `task.ok` | Четыре. Каждая тройка задаёт свою плоскость, а троек из четырёх точек четыре. | To'rtta. Har uchlik o'z tekisligini belgilaydi, to'rt nuqtadan uchliklar esa to'rtta. | Four. Each triple fixes its own plane, and there are four triples of four points. |
| `task.hint.1` | Считай тройки точек, а не сами точки. | Nuqtalarni emas, uchliklarni sanang. | Count the triples of points, not the points. |
| `task.hint.2` | Из четырёх точек тройку можно выбрать четырьмя способами. | To'rt nuqtadan uchlikni to'rt xil tanlash mumkin. | A triple can be chosen from four points in four ways. |
| `task.hint.3` | Четыре. | To'rt. | Four. |
| `order.prompt` | Расставь условия по возрастанию числа плоскостей | Shartlarni tekisliklar soni o'sishi bo'yicha joylashtiring | Put the conditions in order of increasing number of planes |
| `order.title` | от меньшего числа к большему | kichik sondan kattasiga | from fewer planes to more |
| `order.ok` | Верно. Три точки не на прямой дают одну плоскость, четыре точки четыре, куб шесть, а три точки на прямой бесконечно много. | To'g'ri. Chiziqda yotmagan uch nuqta bitta tekislik beradi, to'rt nuqta to'rtta, kub oltita, chiziqdagi uch nuqta esa cheksiz ko'p. | Correct. Three points off a line give one plane, four points give four, a cube six, and three points on a line infinitely many. |
| `order.bad` | Смотри, что известно о расположении точек, а не сколько их. | Nuqtalar nechtaligiga emas, joylashuvi haqida nima ma'lumligiga qarang. | Look at what is known about the arrangement, not at how many points there are. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `A, B, C, D   →   ?` |
| `task.answer` | `4` |
| `order.items` | `A, B, C ∈ a` · `A, B, C ∉ a` · `ABCDA₁B₁C₁D₁` · `A, B, C, D` |
| `order.answer` | `A, B, C ∉ a  A, B, C, D  ABCDA₁B₁C₁D₁  A, B, C ∈ a` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Условие переписано верно. | Shart to'g'ri ko'chirilgan. | The condition is copied correctly. |
| `hint.r2` | Такая плоскость и правда есть. | Bunday tekislik haqiqatan ham bor. | Such a plane does exist. |
| `hint.r3` | Спроси себя, откуда это взято: из аксиомы или с рисунка. | O'zingizdan so'rang: bu qayerdan olingan, aksiomadanmi yoki rasmdanmi? | Ask yourself where this comes from: an axiom or the picture. |
| `proof` | Поверни сцену: точка, которая казалась на плоскости, оказалась над ней. | Sahnani buring: tekislikda ko'ringan nuqta uning ustida chiqdi. | Rotate the scene: the point that seemed to be on the plane turned out to be above it. |
| `entry.prompt` | Сколько точек прямой надо было проверить? | To'g'ri chiziqning nechta nuqtasini tekshirish kerak edi? | How many points of the line had to be checked? |
| `entry.ok` | Две. Одной точки для второй аксиомы мало, а картинка вместо второй точки не годится. | Ikkita. Ikkinchi aksioma uchun bitta nuqta kam, rasm esa ikkinchi nuqta o'rniga yaramaydi. | Two. One point is not enough for the second axiom, and a picture is no substitute for the second one. |
| `entry.hint.1` | Перечитай вторую аксиому. | Ikkinchi aksiomani qayta o'qing. | Read the second axiom again. |
| `entry.hint.2` | В ней сказано про две точки, а в записи взята одна. | Unda ikki nuqta haqida aytilgan, yozuvda esa bittasi olingan. | It speaks of two points, and the writing takes one. |
| `entry.hint.3` | Две. | Ikki. | Two. |
| `audio.mount` | Четыре строки. Ошибка не в счёте: одна строка опирается на рисунок. | To'rt qator. Xato hisobda emas: bir qator rasmga tayanadi. | Four lines. The mistake is not in the counting: one line leans on the picture. |
| `audio.next` | Дальше обратная задача: по числу плоскостей восстанови условие. | Keyin teskari masala: tekisliklar soniga qarab shartni tiklang. | Next comes the reverse task: rebuild the condition from the number of planes. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a,  B ∉ a` |
| `row.r2` | `α ⊃ a,  B ∈ α` |
| `row.r3` | `C ∈ a,  C ∈ α` |
| `row.r4` | `a ⊂ α` |
| `answerId` | `r3` |
| `entry.answer` | `2` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Точек три, плоскость через них одна. Сколько из них лежит на одной прямой? | Nuqta uchta, ular orqali tekislik bitta. Ulardan nechtasi bir to'g'ri chiziqda yotadi? | Three points, one plane through them. How many of them lie on one line? |
| `entry.ok` | Две. Три на одной прямой дали бы бесконечно много плоскостей. | Ikkita. Uchtasi bir chiziqda bo'lsa, cheksiz ko'p tekislik chiqardi. | Two. Three on one line would give infinitely many planes. |
| `entry.hint.1` | Если бы все три лежали на прямой, плоскость была бы не одна. | Uchalasi ham chiziqda yotganda, tekislik yagona bo'lmasdi. | If all three were on a line, the plane would not be unique. |
| `entry.hint.2` | Через любые две точки прямая проходит всегда. | Istalgan ikki nuqta orqali to'g'ri chiziq doim o'tadi. | A line always passes through any two points. |
| `entry.hint.3` | Две. | Ikki. | Two. |
| `multi.prompt` | Отметь все записи, которые задают плоскость однозначно | Tekislikni yagona qilib beradigan barcha yozuvlarni belgilang | Mark every writing that fixes a plane uniquely |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Две точки задают прямую, а плоскостей через неё бесконечно много. | Ikki nuqta to'g'ri chiziqni beradi, u orqali tekisliklar esa cheksiz ko'p. | Two points fix a line, and there are infinitely many planes through it. |
| `multi.d.hint` | Три точки на одной прямой ведут себя как одна прямая. | Bir chiziqdagi uch nuqta bitta to'g'ri chiziqdek ish tutadi. | Three points on one line behave like a single line. |
| `multi.ok` | Верно. Нужна точка вне прямой: она и держит плоскость. | To'g'ri. Chiziqdan tashqaridagi nuqta kerak: tekislikni u ushlab turadi. | Correct. A point off the line is needed: it is what holds the plane. |
| `audio.mount` | Теперь наоборот. По числу плоскостей назови, как расположены точки. | Endi teskarisiga. Tekisliklar soniga qarab nuqtalar qanday joylashganini ayting. | Now the other way round. From the number of planes, say how the points are arranged. |
| `audio.work` | Потом отметь все записи, которые задают плоскость однозначно. | Keyin tekislikni yagona qilib beradigan barcha yozuvlarni belgilang. | Then mark every writing that fixes a plane uniquely. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `A, B, C   →   α` |
| `entry.answer` | `2` |
| `multi.a` [верно] | `A, B, C ∉ a` |
| `multi.b` [верно] | `a, C ∉ a` |
| `multi.c` | `A, B` |
| `multi.d` | `A, B, C ∈ a` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `tri-tochki-na-pryamoy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Сколько плоскостей проходит через три точки одной прямой? | Bir to'g'ri chiziqdagi uch nuqta orqali nechta tekislik o'tadi? | How many planes pass through three points of one line? |
| `q1.a` [верно] | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.b` | одна | bitta | one |
| `q1.b.hint` | Одна выходит, когда третья точка сходит с прямой. | Bitta uchinchi nuqta chiziqdan chiqqanda bo'ladi. | One comes when the third point leaves the line. |
| `q1.c` | ни одной | bitta ham yo'q | none |
| `q1.c.hint` | Хотя бы одна есть всегда. | Hech bo'lmaganda bittasi doim bor. | At least one always exists. |
| `q1.d` | три | uchta | three |
| `q1.d.hint` | Число плоскостей не связано с числом точек напрямую. | Tekisliklar soni nuqtalar soniga to'g'ridan bog'liq emas. | The number of planes is not tied to the number of points directly. |
| `q2.prompt` | Две точки прямой лежат в плоскости. Где остальные? | To'g'ri chiziqning ikki nuqtasi tekislikda yotadi. Qolganlari qayerda? | Two points of a line lie in a plane. Where are the rest? |
| `q2.a` [верно] | тоже в этой плоскости | ular ham shu tekislikda | in that plane too |
| `q2.b` | часть в ней, часть вне | bir qismi unda, bir qismi tashqarida | some in it, some outside |
| `q2.b.hint` | Тогда прямая ломалась бы, а она прямая. | U holda chiziq siniq bo'lardi, u esa to'g'ri. | Then the line would bend, and it is straight. |
| `q2.c` | этого узнать нельзя | buni bilib bo'lmaydi | it cannot be known |
| `q2.c.hint` | Вторая аксиома отвечает на этот вопрос точно. | Ikkinchi aksioma bu savolga aniq javob beradi. | The second axiom answers this exactly. |
| `q2.d` | вне плоскости | tekislikdan tashqarida | outside the plane |
| `q2.d.hint` | Тогда две отмеченные точки оказались бы особенными. | U holda belgilangan ikki nuqta alohida bo'lib qolardi. | Then the two marked points would be special. |
| `q3.prompt` | Сколько общих прямых у двух пересекающихся плоскостей? | Kesishuvchi ikki tekislikning nechta umumiy to'g'ri chizig'i bor? | How many common lines do two intersecting planes have? |
| `q3.a` [верно] | одна | bitta | one |
| `q3.a.ok` | Одна. По одной точке плоскости не пересекаются никогда. | Bitta. Tekisliklar bitta nuqta bo'yicha hech qachon kesishmaydi. | One. Planes never meet at a single point. |
| `q3.b` | ни одной | bitta ham yo'q | none |
| `q3.b.hint` | Ни одной у плоскостей, которые не пересекаются вовсе. | Kesishmaydigan tekisliklarda bitta ham yo'q. | None belongs to planes that do not meet at all. |
| `q3.c` | две | ikkita | two |
| `q3.c.hint` | Две общие прямые означали бы, что плоскости совпали. | Ikki umumiy chiziq tekisliklar ustma-ust tushganini bildirardi. | Two common lines would mean the planes coincide. |
| `q3.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.d.hint` | Бесконечно много было бы у совпавших плоскостей. | Cheksiz ko'p ustma-ust tushgan tekisliklarda bo'lardi. | Infinitely many would belong to coinciding planes. |
| `q4.prompt` | Что нельзя брать в доказательство? | Isbotga nimani olib bo'lmaydi? | What must not go into a proof? |
| `q4.a` [верно] | то, что видно на чертеже | chizmada ko'ringanini | what is visible on the drawing |
| `q4.b` | аксиому | aksiomani | an axiom |
| `q4.b.hint` | Аксиома как раз и есть законное основание. | Aksioma aynan qonuniy asos. | An axiom is exactly a lawful ground. |
| `q4.c` | доказанное раньше утверждение | oldin isbotlangan tasdiqni | a statement proved earlier |
| `q4.c.hint` | Раз доказано, брать можно. | Isbotlangan ekan, olish mumkin. | Once proved, it may be used. |
| `q4.d` | условие задачи | masalaning shartini | the condition of the problem |
| `q4.d.hint` | С условия доказательство и начинается. | Isbot shartdan boshlanadi. | A proof begins with the condition. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `A, B, C ∈ a` |
| `q2.done` | `a ⊂ α` |
| `q3.done` | `α ∩ β = a` |
| `q4.done` | `S₁,  S₂,  S₃` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Знаю, чем плоскость задаётся однозначно | Tekislik nima bilan yagona berilishini bilaman | I know what fixes a plane uniquely |
| `can.2` | Проверяю прямую в плоскости по двум точкам | Chiziq tekislikda ekanini ikki nuqta bo'yicha tekshiraman | I check a line in a plane by two points |
| `can.3` | Знаю, что две плоскости пересекаются по прямой | Ikki tekislik chiziq bo'ylab kesishishini bilaman | I know two planes meet along a line |
| `can.4` | Не беру в доказательство то, что видно на картинке | Rasmda ko'ringanini isbotga olmayman | I do not take what the picture shows into a proof |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: условие первой аксиомы. | Bir joy takrorlashni talab qiladi: birinchi aksioma sharti. | One spot needs a second look: the condition of the first axiom. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va to'rtinchi ekranga qayting. | Go back to the rule and to screen four. |
| `bridge` | Дальше прямые в пространстве: там картинка соврёт ещё сильнее. | Keyin fazodagi to'g'ri chiziqlar: u yerda rasm yanada ko'proq aldaydi. | Next come lines in space: there the picture lies even harder. |
| `lifehack` | Не уверен в чертеже — поверни сцену. Всё, что от поворота меняется, доказательством не было. | Chizmaga ishonchingiz komil bo'lmasa, sahnani buring. Burilishdan o'zgargan hamma narsa isbot bo'lmagan. | If you are unsure of the drawing, rotate the scene. Whatever changes with the rotation was never a proof. |
| `sheetTitle` | Аксиомы · шпаргалка | Aksiomalar · shpargalka | Axioms · cheat sheet |
| `sheetSrc` | 10 класс · урок 38 | 10-sinf · 38-dars | Grade 10 · lesson 38 |
| `audio.mount` | Прогноз был про одну плоскость и про сколько угодно. Посмотрим, что вышло. | Taxmin bitta tekislik va istalgancha haqida edi. Nima chiqqanini ko'ramiz. | The guess was about one plane and about any number. Let us see how it turned out. |
| `audio.next` | Одна не всегда. Всё решает условие: лежат ли три точки на одной прямой. | Bitta har doim ham emas. Hammasini shart hal qiladi: uch nuqta bir chiziqda yotadimi. | Not always one. Everything is decided by the condition: whether the three points lie on one line. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `1` |
| `hook.b` | `∞` |
| `proved` | `∞` |
| `law` | `S₁: A, B, C ∉ a   →   α` |
| `sheet.1` | `A, B, C ∉ a   →   α` |
| `sheet.2` | `A, B ∈ α   →   a ⊂ α` |
| `sheet.3` | `α ∩ β = a` |
| `sheet.4` | `a, C ∉ a   →   α` |
| `sheet.5` | `A, B, C ∈ a   →   ∞` |
