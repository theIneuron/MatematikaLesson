# Урок 40 — Перпендикулярность прямой и плоскости · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS38_40_SKELET.md` §9. Опора: учебник геометрии 2022, §17
`Fazoda perpendikulyar to'g'ri chiziq va tekisliklar`, стр. 120–126.

**Главное решение урока.** Признак требует **двух пересекающихся** прямых, и весь урок стоит на
том, что одной мало. Показать это можно только поворотом: прямая, перпендикулярная одной прямой
плоскости, на неподвижном чертеже выглядит как честный перпендикуляр, а при повороте видно, что
она наклонена.

**Определение и признак взяты со стр. 120–121 дословно.** Признак — теорема 4.2.

**После этого урока производство останавливается**: план ставит гейт «проверка прибора 6 до
массового производства».

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРПЕНДИКУЛЯР | PERPENDIKULYAR | THE PERPENDICULAR |
| `title` | Одной прямой хватит или нет | Bitta chiziq yetadimi yoki yo'q | Is one line enough or not |
| `row.a.name` | хватит одной | bittasi yetadi | one is enough |
| `row.b.name` | одной мало | bittasi kam | one is not enough |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену. | Javobingiz yozib olindi. Endi sahnani buramiz. | Your answer is saved. Now we will rotate the scene. |
| `audio.mount` | В плоскости одна прямая, и наша прямая ей перпендикулярна. Угол в точке отмечен. | Tekislikda bitta chiziq, bizning chiziq unga perpendikulyar. Nuqtadagi burchak belgilangan. | One line in the plane, and our line is perpendicular to it. The angle at the point is marked. |
| `audio.r1` | Первая запись говорит: угол прямой, значит прямая перпендикулярна и всей плоскости. | Birinchi yozuv shunday deydi: burchak to'g'ri, demak chiziq butun tekislikka ham perpendikulyar. | The first reading says: the angle is right, so the line is perpendicular to the whole plane. |
| `audio.r2` | Вторая говорит, что одной прямой для такого вывода мало. | Ikkinchisi bunday xulosa uchun bitta chiziq kam deydi. | The second says one line is not enough for such a conclusion. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a ⊥ b,   b ⊂ α` |
| `row.a.value` | `a ⊥ α` |
| `row.b.value` | `a ⊥ α  ?` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед признаком | Alomatdan oldin uch savol | Three questions before the criterion |
| `q1.prompt` | Когда две прямые в пространстве перпендикулярны? | Fazoda ikki to'g'ri chiziq qachon perpendikulyar? | When are two lines in space perpendicular? |
| `q1.a` [верно] | когда угол между ними девяносто градусов | ular orasidagi burchak to'qson gradus bo'lganda | when the angle between them is ninety degrees |
| `q1.b` | когда они пересекаются | ular kesishganda | when they meet |
| `q1.b.hint` | Пересекаться можно под любым углом. | Istalgan burchak ostida kesishish mumkin. | Lines can meet at any angle. |
| `q1.c` | когда они лежат в одной плоскости | ular bitta tekislikda yotganda | when they lie in one plane |
| `q1.c.hint` | В одной плоскости лежат и параллельные. | Bitta tekislikda parallellar ham yotadi. | Parallel lines lie in one plane too. |
| `q1.d` | когда они равны | ular teng bo'lganda | when they are equal |
| `q1.d.hint` | У прямых длины нет вовсе. | To'g'ri chiziqlarning uzunligi umuman yo'q. | Lines have no length at all. |
| `q2.prompt` | Могут ли перпендикулярные прямые быть скрещивающимися? | Perpendikulyar chiziqlar ayqash bo'lishi mumkinmi? | Can perpendicular lines be skew? |
| `q2.a` [верно] | да, могут | ha, mumkin | yes, they can |
| `q2.b` | нет, они всегда пересекаются | yo'q, ular doim kesishadi | no, they always meet |
| `q2.b.hint` | Угол между скрещивающимися определён переносом, и он бывает прямым. | Ayqashlar orasidagi burchak ko'chirish bilan aniqlanadi, va u to'g'ri ham bo'ladi. | The angle between skew lines is defined by shifting, and it can be right. |
| `q2.c` | нет, они всегда параллельны | yo'q, ular doim parallel | no, they are always parallel |
| `q2.c.hint` | Параллельные образуют угол ноль, а не девяносто. | Parallellar nol burchak hosil qiladi, to'qson emas. | Parallel lines make an angle of zero, not ninety. |
| `q2.d` | только в кубе | faqat kubda | only in a cube |
| `q2.d.hint` | Куб это пример, а не условие. | Kub bu misol, shart emas. | A cube is an example, not a condition. |
| `q3.prompt` | Сколько прямых плоскости проходит через одну её точку? | Tekislikning bir nuqtasi orqali uning nechta chizig'i o'tadi? | How many lines of a plane pass through one of its points? |
| `q3.a` [верно] | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.b` | одна | bitta | one |
| `q3.b.hint` | Через точку в плоскости можно провести прямую в любом направлении. | Tekislikdagi nuqta orqali istalgan yo'nalishda chiziq o'tkazish mumkin. | Through a point in a plane a line can go in any direction. |
| `q3.c` | две | ikkita | two |
| `q3.c.hint` | Двумя дело не ограничивается, направлений сколько угодно. | Ish ikkita bilan cheklanmaydi, yo'nalish istalgancha. | It does not stop at two, there are any number of directions. |
| `q3.d` | ни одной | bitta ham yo'q | none |
| `q3.d.hint` | Хотя бы одна есть всегда. | Hech bo'lmaganda bittasi doim bor. | At least one always exists. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a ⊥ b   →   90°` |
| `q2.done` | `a ⊥ b,   a ∸ b` |
| `q3.done` | `∞` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `odnoy-pryamoy-hvatit`

Одна прямая: поворот показывает наклон.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Поверни и посмотри, стоит ли прямая | Buring va chiziq tik turganini ko'ring | Rotate and see whether the line stands up |
| `show.1.1` | в плоскости взята одна прямая | tekislikda bitta chiziq olingan | one line is taken in the plane |
| `show.1.2` | наша прямая ей перпендикулярна | bizning chiziq unga perpendikulyar | our line is perpendicular to it |
| `show.1.3` | угол отмечен, и он прямой | burchak belgilangan, va u to'g'ri | the angle is marked and it is right |
| `show.2.1` | поверни сцену | sahnani buring | rotate the scene |
| `show.2.2` | прямая наклонилась | chiziq og'ib qoldi | the line turned out slanted |
| `show.2.3` | к плоскости она стоит косо | u tekislikka nisbatan qiyshiq turadi | it stands askew to the plane |
| `audio.mount` | В плоскости одна прямая, и наша прямая ей перпендикулярна. Больше ничего не проверено. | Tekislikda bitta chiziq, bizning chiziq unga perpendikulyar. Boshqa hech nima tekshirilmagan. | One line in the plane, and our line is perpendicular to it. Nothing else has been checked. |
| `audio.spin*` | На первом ракурсе всё выглядит убедительно: угол прямой, прямая как будто стоит на плоскости. Поверни сцену и посмотри сбоку. Прямая наклонена: она уходит в сторону, а не поднимается вертикально. При этом угол с той единственной прямой остался прямым, никто его не портил. Значит перпендикулярность одной прямой плоскости ещё ничего не говорит о перпендикулярности самой плоскости. Заметь, из чего мы это узнали. Не из рассуждения и не из измерения, а из поворота: на первом ракурсе увидеть наклон было нельзя. | Birinchi rakursda hammasi ishonarli ko'rinadi: burchak to'g'ri, chiziq tekislikda tik turgandek. Sahnani buring va yondan qarang. Chiziq og'gan: u tikka ko'tarilmay, chetga ketadi. Shu bilan birga o'sha yagona chiziq bilan burchak to'g'ri qoldi, uni hech kim buzmadi. Demak tekislikning bitta chizig'iga perpendikulyarlik tekislikning o'ziga perpendikulyarlik haqida hali hech nima demaydi. Buni nimadan bilganimizga e'tibor bering. Mulohazadan yoki o'lchashdan emas, burilishdan: birinchi rakursda og'ishni ko'rish mumkin emas edi. | From the first view everything looks convincing: the angle is right, the line seems to stand on the plane. Rotate the scene and look from the side. The line is slanted: it goes off sideways instead of rising vertically. Meanwhile the angle with that single line stayed right, nobody spoiled it. So being perpendicular to one line of a plane says nothing yet about being perpendicular to the plane itself. Notice how we learned this. Not from reasoning and not from measuring, but from rotating: on the first view the slant could not be seen. |
| `audio.work` | Поверни сцену и ответь: как прямая стоит к плоскости? | Sahnani buring va javob bering: chiziq tekislikka qanday turadi? | Rotate the scene and answer: how does the line stand to the plane? |
| `pick.prompt` | Как прямая стоит к плоскости? | Chiziq tekislikka qanday turadi? | How does the line stand to the plane? |
| `pick.a` | перпендикулярно | perpendikulyar | perpendicular to it |
| `pick.a.hint` | Поверни ещё раз: она уходит в сторону, а не вверх. | Yana buring: u yuqoriga emas, chetga ketadi. | Rotate again: it goes sideways, not upwards. |
| `pick.b` [верно] | наклонно | qiyshiq | at a slant |
| `pick.c` | лежит в плоскости | tekislikda yotadi | it lies in the plane |
| `pick.c.hint` | Тогда угол с прямой плоскости не был бы отмечен как прямой. | U holda tekislik chizig'i bilan burchak to'g'ri deb belgilanmasdi. | Then the angle with the line of the plane would not be marked as right. |
| `pick.ok` | Наклонно. Угол с одной прямой прямой, а к плоскости прямая стоит косо. | Qiyshiq. Bitta chiziq bilan burchak to'g'ri, tekislikka esa chiziq qiyshiq turadi. | At a slant. The angle with one line is right, yet the line stands askew to the plane. |

**Формулы**

| Ключ | Значение |
|---|---|
| `mark` | `a ⊥ b,   b ⊂ α` |

---

## Экран 4 · `explain2` · ответ `lead` · тег `odnoy-pryamoy-hvatit`

Разграничение: добавили вторую пересекающуюся.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Вторая прямая меняет всё | Ikkinchi chiziq hammasini o'zgartiradi | The second line changes everything |
| `show.1.1` | в плоскости взята вторая прямая | tekislikda ikkinchi chiziq olingan | a second line is taken in the plane |
| `show.1.2` | она пересекает первую | u birinchisini kesib o'tadi | it crosses the first one |
| `show.1.3` | наша прямая перпендикулярна и ей | bizning chiziq unga ham perpendikulyar | our line is perpendicular to it as well |
| `show.2.1` | поверни сцену | sahnani buring | rotate the scene |
| `show.2.2` | наклона больше нет | og'ish endi yo'q | there is no slant any more |
| `show.2.3` | ни при каком повороте | hech qanday burilishda | at no rotation at all |
| `audio.mount` | Добавим в плоскость вторую прямую, которая пересекает первую. | Tekislikka birinchisini kesib o'tadigan ikkinchi chiziqni qo'shamiz. | Let us add a second line to the plane, one that crosses the first. |
| `audio.two*` | Теперь наша прямая перпендикулярна двум прямым плоскости, и эти две пересекаются. Поверни сцену со всех сторон. Наклона нет ни при каком ракурсе: прямая стоит вертикально, как столб. Больше того, теперь она перпендикулярна любой прямой плоскости, а не только этим двум. Вот почему в признаке стоит слово пересекающиеся. Две пересекающиеся прямые задают в плоскости два разных направления, а этого хватает, чтобы закрепить прямую. Одна прямая задаёт одно направление, и вокруг него ещё есть куда наклониться. | Endi bizning chiziq tekislikning ikki chizig'iga perpendikulyar, va bu ikkitasi kesishadi. Sahnani har tomondan buring. Hech qanday rakursda og'ish yo'q: chiziq ustundek tikka turadi. Bundan tashqari, endi u faqat shu ikkitasiga emas, tekislikning istalgan chizig'iga perpendikulyar. Alomatda kesishuvchi so'zi shuning uchun turadi. Ikki kesishuvchi chiziq tekislikda ikki xil yo'nalishni beradi, va bu chiziqni mahkamlash uchun yetadi. Bitta chiziq bitta yo'nalishni beradi, uning atrofida esa og'ishga joy bor. | Now our line is perpendicular to two lines of the plane, and those two cross each other. Rotate the scene from every side. There is no slant at any view: the line stands vertical like a post. What is more, it is now perpendicular to any line of the plane, not only to these two. That is why the criterion carries the word crossing. Two crossing lines give two different directions in the plane, and that is enough to fix the line. One line gives one direction, and around it there is still room to lean. |
| `audio.work` | Поверни сцену и ответь: как прямая стоит теперь? | Sahnani buring va javob bering: chiziq endi qanday turadi? | Rotate the scene and answer: how does the line stand now? |
| `pick.prompt` | Как прямая стоит к плоскости теперь? | Chiziq endi tekislikka qanday turadi? | How does the line stand to the plane now? |
| `pick.a` | всё ещё наклонно | hali ham qiyshiq | still at a slant |
| `pick.a.hint` | Поверни ещё: наклона нет ни на одном ракурсе. | Yana buring: hech bir rakursda og'ish yo'q. | Rotate again: there is no slant at any view. |
| `pick.b` [верно] | перпендикулярно плоскости | tekislikka perpendikulyar | perpendicular to the plane |
| `pick.c` | это зависит от ракурса | bu rakursga bog'liq | it depends on the view |
| `pick.c.hint` | От ракурса зависит картинка, а не сама фигура. | Rakursga rasm bog'liq, shaklning o'zi emas. | The picture depends on the view, the figure itself does not. |
| `pick.ok` | Перпендикулярно. Двух пересекающихся прямых хватило, и это признак. | Perpendikulyar. Ikki kesishuvchi chiziq yetdi, va bu alomat. | Perpendicular. Two crossing lines were enough, and that is the criterion. |

**Формулы**

| Ключ | Значение |
|---|---|
| `mark` | `a ⊥ b,   a ⊥ c,   b ∩ c = O   →   a ⊥ α` |

---

## Экран 5 · `explain3` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Признак 4.2 и почему слово «пересекающиеся» обязательно.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Что именно требует признак | Alomat aynan nimani talab qiladi | What exactly the criterion demands |
| `show.1.1` | признак требует двух прямых | alomat ikki chiziqni talab qiladi | the criterion demands two lines |
| `show.1.2` | обе лежат в плоскости | ikkalasi tekislikda yotadi | both lie in the plane |
| `show.1.3` | и они пересекаются | va ular kesishadi | and they cross |
| `show.2.1` | тогда прямая перпендикулярна плоскости | u holda chiziq tekislikka perpendikulyar | then the line is perpendicular to the plane |
| `show.2.2` | и любой прямой в ней | va undagi istalgan chiziqqa | and to any line in it |
| `show.2.3` | это уже свойство, а не признак | bu allaqachon xossa, alomat emas | that is already a property, not the criterion |
| `audio.mount` | Соберём условия признака и посчитаем их. | Alomat shartlarini yig'amiz va sanaymiz. | Let us gather the conditions of the criterion and count them. |
| `audio.count*` | Признак звучит так: если прямая перпендикулярна двум пересекающимся прямым, лежащим в плоскости, то она перпендикулярна и плоскости. Требований здесь два: прямых должно быть две, и они должны пересекаться. Теперь важное различение, на котором ошибаются чаще всего. Признак и свойство говорят в разные стороны. Признак идёт от двух прямых к плоскости: проверил две, получил вывод про всю плоскость. Свойство идёт обратно: если прямая уже перпендикулярна плоскости, то она перпендикулярна любой прямой в ней, и проверять ничего не надо. Подставить свойство вместо признака значит взять то, что надо доказать, за готовое. | Alomat shunday: agar chiziq tekislikda yotgan ikki kesishuvchi chiziqqa perpendikulyar bo'lsa, u tekislikka ham perpendikulyar. Talab bu yerda ikkita: chiziq ikkita bo'lishi kerak, va ular kesishishi kerak. Endi eng ko'p xato qilinadigan muhim farq. Alomat va xossa qarama-qarshi tomonga gapiradi. Alomat ikki chiziqdan tekislikka boradi: ikkitasini tekshirdim, butun tekislik haqida xulosa oldim. Xossa teskariga boradi: agar chiziq tekislikka allaqachon perpendikulyar bo'lsa, u undagi istalgan chiziqqa perpendikulyar, va hech nimani tekshirish kerak emas. Alomat o'rniga xossani qo'yish isbotlanishi kerak narsani tayyor deb olish degani. | The criterion says: if a line is perpendicular to two crossing lines lying in a plane, then it is perpendicular to the plane as well. There are two requirements here: there must be two lines, and they must cross. Now the important distinction where mistakes happen most. A criterion and a property speak in opposite directions. The criterion goes from two lines to the plane: I checked two, I got a conclusion about the whole plane. The property goes back: if a line is already perpendicular to the plane, then it is perpendicular to any line in it, and nothing needs checking. Putting the property in place of the criterion means taking what has to be proved as given. |
| `audio.work` | Посчитай сам. Сколько прямых плоскости требует признак? | O'zingiz hisoblang. Alomat tekislikning nechta chizig'ini talab qiladi? | Work it out yourself. How many lines of the plane does the criterion require? |
| `work.prompt` | Сколько прямых требует признак? | Alomat nechta chiziqni talab qiladi? | How many lines does the criterion require? |
| `work.ok` | Две. И обязательно пересекающиеся, иначе признак не работает. | Ikkita. Va albatta kesishuvchi, aks holda alomat ishlamaydi. | Two. And necessarily crossing, otherwise the criterion does not work. |
| `work.hint.1` | Перечитай признак и посчитай прямые в нём. | Alomatni qayta o'qing va undagi chiziqlarni sanang. | Read the criterion again and count the lines in it. |
| `work.hint.2` | Одной не хватило, ты видел это поворотом. | Bittasi yetmadi, buni burilish bilan ko'rdingiz. | One was not enough, you saw that by rotating. |
| `work.hint.3` | Две. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `a ⊥ b,   a ⊥ c,   b ∩ c = O` |
| `work.answer` | `2` |

---

## Экран 6 · `explain4` · ответ `number` · тег `odnoy-pryamoy-hvatit`

Сам: две параллельные признака не дают.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Две прямые, но параллельные | Ikki chiziq, lekin parallel | Two lines, but parallel |
| `show.1.1` | в плоскости две прямые | tekislikda ikki chiziq | two lines in the plane |
| `show.1.2` | наша прямая перпендикулярна обеим | bizning chiziq ikkalasiga perpendikulyar | our line is perpendicular to both |
| `show.1.3` | но эти две параллельны | lekin bu ikkitasi parallel | but these two are parallel |
| `show.2.1` | поверни сцену | sahnani buring | rotate the scene |
| `show.2.2` | наклон остался | og'ish qoldi | the slant is still there |
| `show.2.3` | двух прямых оказалось мало | ikki chiziq kam bo'lib chiqdi | two lines turned out not to be enough |
| `audio.mount` | Возьмём в плоскости две прямые и снова проверим. Только теперь они параллельны. | Tekislikda ikki chiziq olib, yana tekshiramiz. Faqat endi ular parallel. | Let us take two lines in the plane and check again. Only now they are parallel. |
| `audio.para*` | Наша прямая перпендикулярна обеим, прямых две, а вывода нет: поверни сцену и увидишь тот же наклон. Дело в направлениях. Две параллельные прямые задают в плоскости одно и то же направление, второго они не добавляют. Поэтому прямая может наклоняться вдоль этого направления, оставаясь перпендикулярной обеим. Признак требует не просто двух прямых, а двух РАЗНЫХ направлений, и потому в нём стоит слово пересекающиеся. Посчитай сам, сколько направлений задают две параллельные прямые. | Bizning chiziq ikkalasiga perpendikulyar, chiziq ikkita, xulosa esa yo'q: sahnani buring va o'sha og'ishni ko'rasiz. Gap yo'nalishlarda. Ikki parallel chiziq tekislikda bir xil yo'nalishni beradi, ikkinchisini qo'shmaydi. Shuning uchun chiziq shu yo'nalish bo'ylab og'ishi mumkin, ikkalasiga perpendikulyar qolgan holda. Alomat shunchaki ikki chiziqni emas, ikki XIL yo'nalishni talab qiladi, va shuning uchun unda kesishuvchi so'zi turadi. Ikki parallel chiziq nechta yo'nalish berishini o'zingiz sanang. | Our line is perpendicular to both, there are two lines, and yet there is no conclusion: rotate the scene and you will see the same slant. It is about directions. Two parallel lines give one and the same direction in the plane, they add no second one. So the line can lean along that direction while staying perpendicular to both. The criterion requires not simply two lines but two DIFFERENT directions, and that is why it carries the word crossing. Count for yourself how many directions two parallel lines give. |
| `audio.work` | Посчитай сам. Сколько разных направлений задают две параллельные прямые? | O'zingiz hisoblang. Ikki parallel chiziq nechta har xil yo'nalish beradi? | Work it out yourself. How many different directions do two parallel lines give? |
| `work.prompt` | Сколько разных направлений они задают? | Ular nechta har xil yo'nalish beradi? | How many different directions do they give? |
| `work.ok` | Одно. Параллельные идут в одну сторону, второго направления они не дают. | Bitta. Parallellar bir tomonga boradi, ikkinchi yo'nalishni bermaydi. | One. Parallel lines go the same way, they give no second direction. |
| `work.hint.1` | Посмотри, куда идёт каждая из них. | Ularning har biri qayerga borishiga qarang. | Look at where each of them goes. |
| `work.hint.2` | У параллельных направление одно и то же. | Parallellarning yo'nalishi bir xil. | Parallel lines have one and the same direction. |
| `work.hint.3` | Одно. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `b ∥ c   →   b ∩ c = ∅` |
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `izmeril-znachit-dokazal`

Граничный: перпендикуляр пересекает плоскость.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Перпендикуляр не может пройти мимо | Perpendikulyar yonlab o'tolmaydi | A perpendicular cannot pass by |
| `show.1.1` | прямая перпендикулярна плоскости | chiziq tekislikka perpendikulyar | the line is perpendicular to the plane |
| `show.1.2` | значит она её пересекает | demak u uni kesib o'tadi | so it crosses it |
| `show.1.3` | пройти мимо она не может | yonlab o'tolmaydi | it cannot pass by |
| `show.2.1` | поверни и посчитай общие точки | buring va umumiy nuqtalarni sanang | rotate and count the common points |
| `show.2.2` | их ровно столько, сколько у прямой с плоскостью | ular chiziq va tekislikda qanchaligicha | as many as a crossing line has |
| `show.2.3` | и мерить тут нечего | va bu yerda o'lchaydigan narsa yo'q | and there is nothing to measure here |
| `audio.mount` | Ещё одно утверждение учебника, короткое и полезное. | Darslikning yana bir tasdig'i, qisqa va foydali. | One more statement from the textbook, short and useful. |
| `audio.cross*` | Учебник говорит: прямая, перпендикулярная плоскости, обязательно её пересекает. Понятно почему: если бы она плоскости не касалась, то была бы ей параллельна, а параллельная прямая никакого прямого угла с прямыми плоскости не образует. Значит общая точка есть, и она одна: двух быть не может, иначе по второй аксиоме вся прямая легла бы в плоскость. Посчитай эти точки сам. И держи в голове главное правило года: числа с чертежа не берут. Здесь ответ получен рассуждением, а не измерением, и потому он годится в доказательство. | Darslik shunday deydi: tekislikka perpendikulyar chiziq albatta uni kesib o'tadi. Nega ekani tushunarli: agar u tekislikka tegmasa, unga parallel bo'lardi, parallel chiziq esa tekislik chiziqlari bilan hech qanday to'g'ri burchak hosil qilmaydi. Demak umumiy nuqta bor, va u bitta: ikkita bo'lishi mumkin emas, aks holda ikkinchi aksioma bo'yicha butun chiziq tekislikka yotardi. Bu nuqtalarni o'zingiz sanang. Va yilning asosiy qoidasini eslab turing: sonlar chizmadan olinmaydi. Bu yerda javob o'lchash bilan emas, mulohaza bilan olindi, shuning uchun u isbotga yaraydi. | The textbook says: a line perpendicular to a plane necessarily crosses it. It is clear why: if it did not touch the plane it would be parallel to it, and a parallel line makes no right angle with the lines of the plane at all. So a common point exists, and there is one: there cannot be two, otherwise by the second axiom the whole line would lie in the plane. Count these points yourself. And keep the main rule of the year in mind: numbers are not taken from the drawing. Here the answer came from reasoning, not from measuring, and that is why it can go into a proof. |
| `audio.work` | Посчитай сам. Сколько общих точек у перпендикуляра и плоскости? | O'zingiz hisoblang. Perpendikulyar va tekislikning nechta umumiy nuqtasi bor? | Work it out yourself. How many common points do the perpendicular and the plane have? |
| `work.prompt` | Сколько у них общих точек? | Ularning nechta umumiy nuqtasi bor? | How many common points do they have? |
| `work.ok` | Одна. Ноль означал бы параллельность, две означали бы, что прямая лежит в плоскости. | Bitta. Nol parallellikni, ikkita esa chiziq tekislikda yotishini bildirardi. | One. Zero would mean parallel, two would mean the line lies in the plane. |
| `work.hint.1` | Может ли перпендикуляр быть параллелен плоскости? | Perpendikulyar tekislikka parallel bo'lishi mumkinmi? | Can a perpendicular be parallel to the plane? |
| `work.hint.2` | Две общие точки затянули бы всю прямую в плоскость. | Ikki umumiy nuqta butun chiziqni tekislikka tortardi. | Two common points would pull the whole line into the plane. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `a ⊥ α   →   a ∩ α = O` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Признак и свойство | Alomat va xossa | The criterion and the property |
| `probe.question` | Чем признак отличается от свойства? | Alomat xossadan nimasi bilan farq qiladi? | How does a criterion differ from a property? |
| `probe.a` [верно] | признак ведёт к выводу, свойство следует из него | alomat xulosaga olib boradi, xossa undan kelib chiqadi | a criterion leads to the conclusion, a property follows from it |
| `probe.b` | это одно и то же, сказанное по-разному | bu bir xil narsa, boshqacha aytilgan | they are the same thing said differently |
| `probe.b.hint` | Тогда доказательство ходило бы по кругу: вывод брался бы за условие. | U holda isbot doira bo'ylab yurardi: xulosa shart o'rniga olinardi. | Then the proof would go in a circle: the conclusion would serve as the condition. |
| `rule.lawLabel` | ПРИЗНАК | ALOMAT | THE CRITERION |
| `rule.lines.1` | прямая перпендикулярна двум прямым плоскости | chiziq tekislikning ikki chizig'iga perpendikulyar | the line is perpendicular to two lines of the plane |
| `rule.lines.2` | эти две прямые пересекаются | bu ikki chiziq kesishadi | those two lines cross each other |
| `rule.lines.3` | тогда прямая перпендикулярна плоскости | u holda chiziq tekislikka perpendikulyar | then the line is perpendicular to the plane |
| `audio.mount` | Соберём правило. Признак короткий, но каждое слово в нём работает. | Qoidani yig'amiz. Alomat qisqa, lekin undagi har so'z ishlaydi. | Let us put the rule together. The criterion is short, but every word in it works. |
| `audio.rule*` | Признак: если прямая перпендикулярна двум пересекающимся прямым, лежащим в плоскости, то она перпендикулярна этой плоскости. Слово двум нужно потому, что одной мало: прямая наклонится вокруг единственного направления. Слово пересекающимся нужно потому, что параллельные дают одно направление, а не два. Дальше работает свойство, и оно смотрит в другую сторону: перпендикулярная плоскости прямая перпендикулярна любой прямой в этой плоскости. Признак доказывает, свойство пользуется доказанным. Поставить свойство на место признака нельзя: это то же самое, что взять вывод за условие. | Alomat: agar chiziq tekislikda yotgan ikki kesishuvchi chiziqqa perpendikulyar bo'lsa, u shu tekislikka perpendikulyar. Ikki so'zi shuning uchun kerak, chunki bittasi kam: chiziq yagona yo'nalish atrofida og'adi. Kesishuvchi so'zi shuning uchun kerak, chunki parallellar bitta yo'nalish beradi, ikkitasini emas. Keyin xossa ishlaydi, va u boshqa tomonga qaraydi: tekislikka perpendikulyar chiziq shu tekislikdagi istalgan chiziqqa perpendikulyar. Alomat isbotlaydi, xossa isbotlanganidan foydalanadi. Xossani alomat o'rniga qo'yib bo'lmaydi: bu xulosani shart o'rniga olish bilan bir xil. | The criterion: if a line is perpendicular to two crossing lines lying in a plane, then it is perpendicular to that plane. The word two is needed because one is not enough: the line will lean around the single direction. The word crossing is needed because parallel lines give one direction, not two. Then the property works, and it looks the other way: a line perpendicular to a plane is perpendicular to any line in that plane. The criterion proves, the property uses what was proved. The property cannot be put in place of the criterion: that is the same as taking the conclusion for the condition. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a ⊥ b,   a ⊥ c,   b ∩ c = O   →   a ⊥ α` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Посчитай по кубу | Kub bo'yicha sanang | Count on the cube |
| `match.prompt` | Все четыре ответа разные | To'rt javobning hammasi har xil | All four answers are different |
| `match.ok` | Верно. Перпендикулярных ребру больше всего: их восемь из одиннадцати. | To'g'ri. Qirraga perpendikulyarlari eng ko'p: o'n birdan sakkiztasi. | Correct. Perpendicular edges are the most: eight out of eleven. |
| `audio.mount` | Четыре записи про куб. Последняя это число его граней. | Kub haqida to'rt yozuv. Oxirgisi uning yoqlari soni. | Four writings about the cube. The last one is the number of its faces. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `AB ⊥ ?` · `AB ∥ ?` · `AB ∸ ?` · `ABCDA₁B₁C₁D₁` |
| `match.a` | `8` |
| `match.b` | `3` |
| `match.c` | `4` |
| `match.d` | `6` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи перпендикулярность | Perpendikulyarlikni isbotlang | Prove the perpendicularity |
| `proof.given` | боковое ребро куба и плоскость основания | kubning yon qirrasi va asos tekisligi | a side edge of a cube and the plane of its base |
| `proof.goal` | ребро перпендикулярно плоскости основания | qirra asos tekisligiga perpendikulyar | the edge is perpendicular to the plane of the base |
| `proof.r1` | ребро перпендикулярно первому ребру основания | qirra asosning birinchi qirrasiga perpendikulyar | the edge is perpendicular to the first edge of the base |
| `proof.r2` | оно перпендикулярно и второму | u ikkinchisiga ham perpendikulyar | it is perpendicular to the second as well |
| `proof.r3` | эти два ребра основания пересекаются | asosning bu ikki qirrasi kesishadi | those two edges of the base cross |
| `proof.e1` | Признак идёт в конце. Здесь проверяется его условие. | Alomat oxirida qo'llanadi. Hozir uning sharti tekshirilyapti. | The criterion comes at the end. Here its condition is checked. |
| `proof.e2` | Эта строка как первая, только со вторым ребром. | Bu qator birinchisidek, faqat ikkinchi qirra bilan. | This line is like the first, only with the second edge. |
| `proof.e3` | Речь не о перпендикулярности. Встречаются ли эти рёбра. | Gap perpendikulyarlik haqida emas. Bu ikki qirra uchrashadimi. | This is not about perpendicularity. Do these edges meet. |
| `proof.ok` | Доказано. Оба условия признака проверены, и только теперь вывод законный. | Isbotlandi. Alomatning ikkala sharti tekshirildi, va faqat endi xulosa qonuniy. | Proved. Both conditions of the criterion are checked, and only now is the conclusion lawful. |
| `reason.s1` | по построению куба | kub yasalishiga ko'ra | by the construction of the cube |
| `reason.s2` | признак перпендикулярности | perpendikulyarlik alomati | the criterion of perpendicularity |
| `reason.s3` | вершина основания общая | asos uchi umumiy | the vertex of the base is common |
| `reason.pic` | свойство перпендикулярной прямой | perpendikulyar chiziq xossasi | the property of a perpendicular line |
| `reason.pic.missing` | Это свойство, а не признак: оно следует из вывода, который ещё не получен. | Bu xossa, alomat emas: u hali olinmagan xulosadan kelib chiqadi. | That is a property, not the criterion: it follows from a conclusion not yet obtained. |
| `audio.mount` | Докажем на кубе. Обоснование каждой строки выбирается из списка. | Kubda isbotlaymiz. Har qatorning asoslashi ro'yxatdan tanlanadi. | Let us prove it on the cube. The justification of each line is chosen from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AA₁ ⊥ AB,   AA₁ ⊥ AD,   AB ∩ AD = A` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Сколько рёбер перпендикулярно данному | Berilganiga nechta qirra perpendikulyar | How many edges are perpendicular to the given one |
| `task.ok` | Восемь. Четыре пересекают его, четыре скрещиваются с ним под прямым углом. | Sakkizta. To'rttasi uni kesadi, to'rttasi to'g'ri burchak ostida ayqash. | Eight. Four cross it and four are skew to it at a right angle. |
| `task.hint.1` | Перпендикулярными бывают и скрещивающиеся рёбра. | Ayqash qirralar ham perpendikulyar bo'ladi. | Skew edges can be perpendicular too. |
| `task.hint.2` | Всего рёбер одиннадцать, параллельных три. | Qirralar jami o'n bitta, parallellari uchta. | Eleven edges in all, three of them parallel. |
| `task.hint.3` | Восемь. | Sakkiz. | Eight. |
| `order.prompt` | Расставь записи по возрастанию ответа | Yozuvlarni javobi o'sishi bo'yicha joylashtiring | Put the writings in order of increasing answer |
| `order.title` | от меньшего числа к большему | kichik sondan kattasiga | from the smallest number to the largest |
| `order.ok` | Верно. Перпендикулярных рёбер больше, чем всех остальных вместе. | To'g'ri. Perpendikulyar qirralar qolganlarining hammasidan ko'p. | Correct. There are more perpendicular edges than all the rest together. |
| `order.bad` | Считай каждую запись отдельно. | Har yozuvni alohida hisoblang. | Compute each writing separately. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `AB ⊥ ?` |
| `task.answer` | `8` |
| `order.items` | `ABCDA₁B₁C₁D₁` · `AB ⊥ ?` · `AB ∥ ?` · `AB ∸ ?` |
| `order.answer` | `AB ∥ ?  AB ∸ ?  ABCDA₁B₁C₁D₁  AB ⊥ ?` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Условие переписано верно. | Shart to'g'ri ko'chirilgan. | The condition is copied correctly. |
| `hint.r2` | Этот прямой угол действительно есть. | Bu to'g'ri burchak haqiqatan bor. | This right angle does exist. |
| `hint.r3` | Спроси себя, сколько прямых проверено к этому моменту. | O'zingizdan so'rang: shu paytgacha nechta chiziq tekshirilgan? | Ask yourself how many lines have been checked by this point. |
| `proof` | Поверни сцену: при одной проверенной прямой наклон остаётся. | Sahnani buring: bitta tekshirilgan chiziqda og'ish qoladi. | Rotate the scene: with one line checked the slant remains. |
| `entry.prompt` | Сколько прямых плоскости не хватило? | Tekislikning nechta chizig'i yetmadi? | How many lines of the plane were missing? |
| `entry.ok` | Одной. Проверена была одна, а признак требует двух пересекающихся. | Bittasi. Bittasi tekshirilgan edi, alomat esa ikki kesishuvchini talab qiladi. | One. One was checked, and the criterion requires two crossing ones. |
| `entry.hint.1` | Посчитай, сколько прямых упомянуто в записи. | Yozuvda nechta chiziq eslatilganini sanang. | Count how many lines are mentioned in the writing. |
| `entry.hint.2` | Признак требует двух, а в записи одна. | Alomat ikkitasini talab qiladi, yozuvda esa bittasi. | The criterion requires two, and the writing has one. |
| `entry.hint.3` | Одной. | Bittasi. | One. |
| `audio.mount` | Четыре строки. Все углы в записи верные, а вывод нет. | To'rt qator. Yozuvdagi barcha burchaklar to'g'ri, xulosa esa yo'q. | Four lines. Every angle in the writing is right, and the conclusion is not. |
| `audio.next` | Дальше обратная задача: по выводу назови недостающее условие. | Keyin teskari masala: xulosaga qarab yetishmayotgan shartni ayting. | Next comes the reverse task: name the missing condition from the conclusion. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `b ⊂ α,   a ⊥ b` |
| `row.r2` | `∠(a, b) = 90°` |
| `row.r3` | `a ⊥ α` |
| `row.r4` | `a ⊥ c   ∀c ⊂ α` |
| `answerId` | `r3` |
| `entry.answer` | `1` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Прямая перпендикулярна плоскости. Скольким прямым в этой плоскости она НЕ перпендикулярна? | Chiziq tekislikka perpendikulyar. U bu tekislikdagi nechta chiziqqa perpendikulyar EMAS? | A line is perpendicular to a plane. To how many lines in that plane is it NOT perpendicular? |
| `entry.ok` | Ни одной. Это уже свойство: перпендикулярна всем без исключения, и проверять нечего. | Bitta ham yo'q. Bu allaqachon xossa: istisnosiz hammasiga perpendikulyar, tekshiradigan narsa yo'q. | None. That is already the property: it is perpendicular to all of them without exception, and nothing is left to check. |
| `entry.hint.1` | Признак работал в одну сторону, а свойство в другую. | Alomat bir tomonga, xossa esa boshqa tomonga ishlardi. | The criterion worked one way, the property works the other. |
| `entry.hint.2` | Свойство говорит: перпендикулярна любой прямой плоскости. | Xossa shunday deydi: tekislikning istalgan chizig'iga perpendikulyar. | The property says: perpendicular to any line of the plane. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `multi.prompt` | Отметь все записи, из которых следует перпендикулярность плоскости | Tekislikka perpendikulyarlik kelib chiqadigan barcha yozuvlarni belgilang | Mark every writing from which perpendicularity to the plane follows |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Здесь прямая одна: одного направления мало. | Bu yerda chiziq bitta: bitta yo'nalish kam. | Here there is one line: one direction is not enough. |
| `multi.d.hint` | Здесь две прямые, но параллельные: направление снова одно. | Bu yerda ikki chiziq, lekin parallel: yo'nalish yana bitta. | Here there are two lines but parallel: again one direction. |
| `multi.ok` | Верно. Нужны две прямые и обязательно пересекающиеся. | To'g'ri. Ikki chiziq kerak va albatta kesishuvchi. | Correct. Two lines are needed, and they must cross. |
| `audio.mount` | Теперь наоборот. Сначала ответь про свойство. | Endi teskarisiga. Avval xossa haqida javob bering. | Now the other way round. First answer about the property. |
| `audio.work` | Потом отметь все записи, из которых вывод следует. | Keyin xulosa kelib chiqadigan barcha yozuvlarni belgilang. | Then mark every writing from which the conclusion follows. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `a ⊥ α   →   a ⊥ c` |
| `entry.answer` | `0` |
| `multi.a` [верно] | `a ⊥ b,  a ⊥ c,  b ∩ c = O` |
| `multi.b` [верно] | `AA₁ ⊥ AB,  AA₁ ⊥ AD` |
| `multi.c` | `a ⊥ b,  b ⊂ α` |
| `multi.d` | `a ⊥ b,  a ⊥ c,  b ∥ c` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `odnoy-pryamoy-hvatit`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Сколько прямых плоскости требует признак? | Alomat tekislikning nechta chizig'ini talab qiladi? | How many lines of the plane does the criterion require? |
| `q1.a` [верно] | две пересекающиеся | ikki kesishuvchi | two crossing ones |
| `q1.b` | одну | bittasini | one |
| `q1.b.hint` | При одной прямая наклоняется, ты видел это поворотом. | Bittasida chiziq og'adi, buni burilish bilan ko'rdingiz. | With one the line leans, you saw that by rotating. |
| `q1.c` | две любые | istalgan ikkitasini | any two |
| `q1.c.hint` | Две параллельные дают одно направление, и этого мало. | Ikki parallel bitta yo'nalish beradi, va bu kam. | Two parallel ones give one direction, and that is not enough. |
| `q1.d` | все прямые плоскости | tekislikning barcha chiziqlarini | all lines of the plane |
| `q1.d.hint` | Все проверять не надо, в этом и смысл признака. | Hammasini tekshirish kerak emas, alomatning ma'nosi shunda. | Checking all is not needed, that is the point of the criterion. |
| `q2.prompt` | Двух параллельных прямых хватает для вывода? | Ikki parallel chiziq xulosa uchun yetadimi? | Are two parallel lines enough for the conclusion? |
| `q2.a` [верно] | нет, направление у них одно | yo'q, ularning yo'nalishi bitta | no, they have one direction |
| `q2.b` | да, прямых же две | ha, chiziq ikkita-ku | yes, there are two lines after all |
| `q2.b.hint` | Считаются направления, а не прямые. | Chiziqlar emas, yo'nalishlar hisoblanadi. | Directions are counted, not lines. |
| `q2.c` | да, если они далеко друг от друга | ha, agar ular bir-biridan uzoq bo'lsa | yes, if they are far apart |
| `q2.c.hint` | Расстояние между ними ничего не меняет. | Ular orasidagi masofa hech nimani o'zgartirmaydi. | The distance between them changes nothing. |
| `q2.d` | это зависит от плоскости | bu tekislikka bog'liq | it depends on the plane |
| `q2.d.hint` | Плоскость тут ни при чём, дело в направлениях. | Tekislikning bunga aloqasi yo'q, gap yo'nalishlarda. | The plane is not involved, it is about directions. |
| `q3.prompt` | Сколько общих точек у перпендикуляра и плоскости? | Perpendikulyar va tekislikning nechta umumiy nuqtasi bor? | How many common points do a perpendicular and a plane have? |
| `q3.a` [верно] | одна | bitta | one |
| `q3.a.ok` | Одна. Перпендикуляр обязательно пересекает плоскость, и ровно один раз. | Bitta. Perpendikulyar albatta tekislikni kesib o'tadi, va roppa-rosa bir marta. | One. A perpendicular necessarily crosses the plane, exactly once. |
| `q3.b` | ни одной | bitta ham yo'q | none |
| `q3.b.hint` | Ни одной было бы у параллельной прямой. | Bitta ham yo'q parallel chiziqda bo'lardi. | None would belong to a parallel line. |
| `q3.c` | две | ikkita | two |
| `q3.c.hint` | Две точки затянули бы всю прямую в плоскость. | Ikki nuqta butun chiziqni tekislikka tortardi. | Two points would pull the whole line into the plane. |
| `q3.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.d.hint` | Бесконечно много было бы, если прямая лежит в плоскости. | Cheksiz ko'p chiziq tekislikda yotganda bo'lardi. | Infinitely many would happen if the line lay in the plane. |
| `q4.prompt` | Что нельзя брать вместо признака? | Alomat o'rniga nimani olib bo'lmaydi? | What must not be taken in place of the criterion? |
| `q4.a` [верно] | свойство перпендикулярной прямой | perpendikulyar chiziq xossasini | the property of a perpendicular line |
| `q4.b` | вторую пересекающую прямую | ikkinchi kesuvchi chiziqni | a second crossing line |
| `q4.b.hint` | Как раз её и надо взять: это условие признака. | Aynan uni olish kerak: bu alomatning sharti. | That is exactly what has to be taken: it is a condition of the criterion. |
| `q4.c` | вторую аксиому | ikkinchi aksiomani | the second axiom |
| `q4.c.hint` | Аксиома законна всегда, ею пользоваться можно. | Aksioma doim qonuniy, undan foydalanish mumkin. | An axiom is always lawful, it may be used. |
| `q4.d` | условие задачи | masalaning shartini | the condition of the problem |
| `q4.d.hint` | С условия доказательство и начинается. | Isbot shartdan boshlanadi. | A proof begins with the condition. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `b ∩ c = O` |
| `q2.done` | `b ∥ c` |
| `q3.done` | `a ∩ α = O` |
| `q4.done` | `a ⊥ α   →   a ⊥ c` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Проверяю две прямые, а не одну | Bitta emas, ikki chiziqni tekshiraman | I check two lines, not one |
| `can.2` | Смотрю, пересекаются ли они | Ular kesishadimi, qarayman | I look at whether they cross |
| `can.3` | Различаю признак и свойство | Alomat va xossani ajrataman | I tell the criterion from the property |
| `can.4` | Не подставляю вывод в условие | Xulosani shart o'rniga qo'ymayman | I do not put the conclusion into the condition |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: почему параллельных недостаточно. | Bir joy takrorlashni talab qiladi: nega parallellar yetarli emas. | One spot needs a second look: why parallel lines are not enough. |
| `levels.back` | Вернись к правилу и к экрану 6. | Qoidaga va oltinchi ekranga qayting. | Go back to the rule and to screen six. |
| `bridge` | Дальше угол прямой с плоскостью: там понадобится проекция. | Keyin chiziq va tekislik orasidagi burchak: u yerda proyeksiya kerak bo'ladi. | Next comes the angle between a line and a plane: there a projection will be needed. |
| `lifehack` | Считай не прямые, а направления. Две параллельные это одно направление. | Chiziqlarni emas, yo'nalishlarni sanang. Ikki parallel bu bitta yo'nalish. | Count directions, not lines. Two parallel lines are one direction. |
| `sheetTitle` | Перпендикулярность · шпаргалка | Perpendikulyarlik · shpargalka | Perpendicularity · cheat sheet |
| `sheetSrc` | 10 класс · урок 40 | 10-sinf · 40-dars | Grade 10 · lesson 40 |
| `audio.mount` | Прогноз был про одну прямую. Посмотрим, что вышло. | Taxmin bitta chiziq haqida edi. Nima chiqqanini ko'ramiz. | The guess was about one line. Let us see how it turned out. |
| `audio.next` | Одной мало. Нужны две, и обязательно пересекающиеся: два направления вместо одного. | Bittasi kam. Ikkita kerak, va albatta kesishuvchi: bitta o'rniga ikki yo'nalish. | One is not enough. Two are needed, and they must cross: two directions instead of one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `a ⊥ α` |
| `hook.b` | `a ⊥ α  ?` |
| `proved` | `b ∩ c = O` |
| `law` | `a ⊥ b,  a ⊥ c,  b ∩ c = O   →   a ⊥ α` |
| `sheet.1` | `a ⊥ b,   b ⊂ α` |
| `sheet.2` | `a ⊥ c,   c ⊂ α` |
| `sheet.3` | `b ∩ c = O` |
| `sheet.4` | `a ⊥ α` |
| `sheet.5` | `a ∩ α = O` |
