# Урок 41 — Перпендикуляр, наклонная и три перпендикуляра · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS40_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, §18 `Perpendikulyar va
og'ma`, стр. 127–132, и §19 `Uch perpendikulyar haqidagi teorema`, стр. 135–137.

**Главное решение урока.** Ошибка года здесь одна и живая: теорему о трёх перпендикулярах
применяют не к проекции, а к перпендикуляру. Прямая в плоскости перпендикулярна
перпендикуляру ВСЕГДА — он перпендикулярен всей плоскости, — и ученик переносит это на
наклонную. Показать разницу можно только поворотом: на неподвижном чертеже оба угла
выглядят прямыми.

**Порядок пакета изменён относительно плана.** В плане урок 41 — угол прямой и плоскости, но
угол определяется через проекцию, а проекция и теорема стоят в учебнике раньше. Здесь идут
наклонная, проекция и теорема; угол — в уроке 42. Расхождение с xlsx записано в
`DARSLAR_REJASI_10SINF.md`.

**Расстояния забраны сюда** со стр. 128: в уроках 38–40 они не проходились ни разу, а
расстояние от точки до плоскости и есть длина перпендикуляра.

**Теорема взята со стр. 135 дословно** (4.11 и 4.12), свойства наклонных — по сводной таблице
стр. 131.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`og'ma`, `og'maning asosi`, `proyeksiya` взяты из учебника (стр. 127, 131).

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НАКЛОННАЯ | OG'MA | THE OBLIQUE |
| `title` | Две записи, разница в одном отрезке | Ikki yozuv, farq bitta kesmada | Two readings, one segment apart |
| `row.a.name` | через перпендикуляр | perpendikulyar orqali | through the perpendicular |
| `row.b.name` | через проекцию | proyeksiya orqali | through the projection |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену. | Javobingiz yozib olindi. Endi sahnani buramiz. | Your answer is recorded. Now we rotate the scene. |
| `audio.mount` | Точка стоит над плоскостью. Из неё опущен перпендикуляр и проведена наклонная. В плоскости через основание наклонной идёт третья прямая. | Nuqta tekislik ustida turadi. Undan perpendikulyar tushirilgan va og'ma o'tkazilgan. Tekislikda og'maning asosi orqali uchinchi to'g'ri chiziq o'tadi. | A point stands above the plane. A perpendicular is dropped from it and an oblique is drawn. In the plane a third line runs through the foot of the oblique. |
| `audio.r1` | Первая запись говорит так. Прямая перпендикулярна перпендикуляру, значит она перпендикулярна и наклонной. | Birinchi yozuv shunday deydi. To'g'ri chiziq perpendikulyarga perpendikulyar, demak u og'maga ham perpendikulyar. | The first reading says this. The line is perpendicular to the perpendicular, so it is perpendicular to the oblique as well. |
| `audio.r2` | Вторая говорит про проекцию. Прямая перпендикулярна проекции наклонной, значит она перпендикулярна самой наклонной. | Ikkinchisi proyeksiya haqida gapiradi. To'g'ri chiziq og'maning proyeksiyasiga perpendikulyar, demak u og'maning o'ziga ham perpendikulyar. | The second one speaks about the projection. The line is perpendicular to the projection of the oblique, so it is perpendicular to the oblique itself. |
| `audio.ask` | Записи похожи, и отличаются одним отрезком. Как думаешь, какая верная? Пока просто предположи. | Yozuvlar o'xshash, va bitta kesma bilan farq qiladi. Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | The readings look alike and differ by one segment. Which do you think is correct? Just guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB ⊥ α,   c ⊂ α` |
| `row.a.value` | `c ⊥ AB   →   c ⊥ AC` |
| `row.b.value` | `c ⊥ BC   →   c ⊥ AC` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед теоремой | Teoremadan oldin uch savol | Three questions before the theorem |
| `q1.prompt` | Когда прямая перпендикулярна плоскости? | To'g'ri chiziq qachon tekislikka perpendikulyar bo'ladi? | When is a line perpendicular to a plane? |
| `q1.a` [верно] | когда перпендикулярна двум пересекающимся | ikki kesishuvchi chiziqqa perpendikulyar bo'lganda | when perpendicular to two crossing lines |
| `q1.b` | когда перпендикулярна одной прямой | bitta chiziqqa perpendikulyar bo'lganda | when perpendicular to one line |
| `q1.b.hint` | Одной мало, и поворот это показал в прошлом уроке. | Bittasi kam, va o'tgan darsda burilish shuni ko'rsatdi. | One is not enough, and the rotation showed that last lesson. |
| `q1.c` | когда пересекает плоскость | tekislikni kesib o'tganda | when it crosses the plane |
| `q1.c.hint` | Пересечь можно и наклонно. | Kesib o'tish qiyshiq ham bo'ladi. | Crossing can also be at a slant. |
| `q1.d` | когда параллельна прямой в ней | undagi chiziqqa parallel bo'lganda | when parallel to a line in it |
| `q1.d.hint` | Параллельность прямого угла не даёт. | Parallellik to'g'ri burchak bermaydi. | Being parallel gives no right angle. |
| `q2.prompt` | Прямая перпендикулярна плоскости. Какой угол она даёт с прямыми этой плоскости? | To'g'ri chiziq tekislikka perpendikulyar. U shu tekislikning to'g'ri chiziqlari bilan qanday burchak beradi? | A line is perpendicular to a plane. What angle does it make with the lines of that plane? |
| `q2.a` [верно] | девяносто с каждой | har biri bilan to'qson | ninety with each of them |
| `q2.b` | зависит от прямой | to'g'ri chiziqqa bog'liq | it depends on the line |
| `q2.b.hint` | Перпендикулярность плоскости и означает прямой угол со всеми её прямыми. | Tekislikka perpendikulyarlik uning barcha to'g'ri chiziqlari bilan to'g'ri burchak degani. | Being perpendicular to a plane means a right angle with all its lines. |
| `q2.c` | сорок пять градусов | qirq besh daraja | forty five degrees |
| `q2.c.hint` | Это число ниоткуда не следует. | Bu son hech qayerdan chiqmaydi. | That number follows from nothing. |
| `q2.d` | ноль градусов | nol daraja | zero degrees |
| `q2.d.hint` | Ноль был бы у прямой, лежащей в плоскости. | Nol tekislikda yotgan to'g'ri chiziqda bo'lardi. | Zero would belong to a line lying in the plane. |
| `q3.prompt` | Что показывает поворот сцены? | Sahnani burish nimani ko'rsatadi? | What does rotating the scene show? |
| `q3.a` [верно] | что угол бывает не тем, каким кажется | burchak boshqa bo'lishi mumkinligini | that an angle can be other than it seems |
| `q3.b` | что фигура меняет форму | shakl o'z shaklini o'zgartirishini | that the figure changes its shape |
| `q3.b.hint` | Форма та же, меняется только взгляд. | Shakl o'sha, faqat qarash o'zgaradi. | The shape is the same, only the view changes. |
| `q3.c` | что чертёж можно измерить | chizmani o'lchash mumkinligini | that the drawing can be measured |
| `q3.c.hint` | Измерение это предположение, а не довод. | O'lchash taxmin, dalil emas. | A measurement is a guess, not an argument. |
| `q3.d` | ничего нового | yangi hech narsa emas | nothing new |
| `q3.d.hint` | В прошлом уроке именно поворот отменил ложное пересечение. | O'tgan darsda aynan burilish yolg'on kesishishni rad etdi. | Last lesson it was the rotation that refuted a false crossing. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту, когда появится теорема. | Uchta qisqa savol. Uchalasi ham bir daqiqadan keyin, teorema paydo bo'lganda kerak bo'ladi. | Three short questions. All three will be needed in a minute, when the theorem appears. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a ⊥ b,  a ⊥ c   →   a ⊥ α` |
| `q2.done` | `a ⊥ α   →   90°` |
| `q3.done` | `α ≠ 90°  ?` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Перпендикуляр, наклонная и её проекция появляются по одному.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Три отрезка, и только один в плоскости | Uch kesma, va faqat bittasi tekislikda | Three segments, and only one in the plane |
| `show.1.1` | из точки опущен перпендикуляр | nuqtadan perpendikulyar tushirilgan | a perpendicular is dropped from the point |
| `show.1.2` | из неё же проведена наклонная | o'sha nuqtadan og'ma o'tkazilgan | an oblique is drawn from the same point |
| `show.2.1` | основания соединены | asoslar tutashtirilgan | the feet are joined |
| `show.2.2` | это и есть проекция наклонной | bu og'maning proyeksiyasi | this is the projection of the oblique |
| `audio.mount` | Точка над плоскостью и два отрезка из неё. Один упал по прямому углу, второй косо. | Tekislik ustidagi nuqta va undan ikki kesma. Biri to'g'ri burchak bilan tushdi, ikkinchisi qiyshiq. | A point above the plane and two segments from it. One landed at a right angle, the other at a slant. |
| `audio.move*` | Смотри, где кончаются отрезки. Основание перпендикуляра и основание наклонной это разные точки, и отрезок между ними лежит в плоскости целиком. Он называется проекцией наклонной. Поверни сцену и следи за ним. Перпендикуляр и наклонная при повороте уходят из плоскости, а проекция остаётся в ней при любом положении сцены. Это её признак, а не свойство чертежа. | Kesmalar qayerda tugashiga qarang. Perpendikulyarning asosi va og'maning asosi boshqa nuqtalar, va ular orasidagi kesma butunlay tekislikda yotadi. U og'maning proyeksiyasi deb ataladi. Sahnani buring va unga qarang. Perpendikulyar va og'ma burilishda tekislikdan chiqadi, proyeksiya esa sahnaning har qanday holatida unda qoladi. Bu uning alomati, chizmaning xossasi emas. | Look at where the segments end. The foot of the perpendicular and the foot of the oblique are different points, and the segment between them lies wholly in the plane. It is called the projection of the oblique. Rotate the scene and watch it. Under rotation the perpendicular and the oblique leave the plane, while the projection stays in it at any position of the scene. That is its mark, not a property of the drawing. |
| `audio.work` | Посчитай сам. Сколько из трёх отрезков лежит в плоскости целиком? | O'zingiz hisoblang. Uch kesmadan nechtasi butunlay tekislikda yotadi? | Work it out yourself. How many of the three segments lie wholly in the plane? |
| `work.prompt` | Сколько отрезков лежит в плоскости? | Nechta kesma tekislikda yotadi? | How many segments lie in the plane? |
| `work.ok` | Один. Это проекция, и сколько сцену ни крути, она из плоскости не выходит. | Bitta. Bu proyeksiya, va sahnani qancha burmang, u tekislikdan chiqmaydi. | One. It is the projection, and however much you rotate the scene, it does not leave the plane. |
| `work.hint.1` | Поверни сцену и посмотри, какой отрезок не отрывается от плоскости. | Sahnani buring va qaysi kesma tekislikdan uzilmasligini ko'ring. | Rotate the scene and see which segment never comes off the plane. |
| `work.hint.2` | У наклонной в плоскости лежит только один конец. | Og'maning tekislikda faqat bitta uchi yotadi. | Only one end of the oblique lies in the plane. |
| `work.hint.3` | Один, и это отрезок между двумя основаниями. | Bitta, va bu ikki asos orasidagi kesma. | One, and it is the segment between the two feet. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |
| `expr` | `AB ⊥ α,   BC ⊂ α` |

---

## Экран 4 · `explain2` · ответ `number` · тег `izmeril-znachit-dokazal`

Перпендикуляр короче наклонной, равные наклонные дают равные проекции.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Две наклонные из одной точки | Bitta nuqtadan ikki og'ma | Two obliques from one point |
| `show.1.1` | из точки проведены две наклонные | nuqtadan ikki og'ma o'tkazilgan | two obliques are drawn from the point |
| `show.1.2` | на чертеже они кажутся равными | chizmada ular teng ko'rinadi | on the drawing they look equal |
| `show.2.1` | поверни сцену и посмотри на проекции | sahnani buring va proyeksiyalarga qarang | rotate the scene and look at the projections |
| `show.2.2` | проекции разные, значит и наклонные разные | proyeksiyalar boshqa, demak og'malar ham boshqa | the projections differ, so the obliques differ too |
| `audio.mount` | Из той же точки проведена вторая наклонная. На неподвижном чертеже две наклонные выглядят одинаково. | O'sha nuqtadan ikkinchi og'ma o'tkazilgan. Qimirlamas chizmada ikki og'ma bir xil ko'rinadi. | A second oblique is drawn from the same point. On a still drawing the two obliques look the same. |
| `audio.move*` | Поверни сцену и сравни не сами наклонные, а их проекции. Проекции оказались разной длины, и это решает дело. Чем дальше основание наклонной от основания перпендикуляра, тем длиннее сама наклонная. Правило работает и в обратную сторону. Равные наклонные дают равные проекции, а равные проекции дают равные наклонные. И ещё одно, самое короткое. Перпендикуляр короче любой наклонной из той же точки, потому что в прямоугольном треугольнике он катет, а наклонная гипотенуза. | Sahnani buring va og'malarning o'zini emas, proyeksiyalarini solishtiring. Proyeksiyalar boshqa uzunlikda chiqdi, va bu masalani hal qiladi. Og'maning asosi perpendikulyar asosidan qancha uzoq bo'lsa, og'maning o'zi shuncha uzun. Qoida teskari tomonga ham ishlaydi. Teng og'malar teng proyeksiya beradi, teng proyeksiyalar esa teng og'ma beradi. Va yana bittasi, eng qisqasi. Perpendikulyar o'sha nuqtadan chiqqan har qanday og'madan qisqa, chunki to'g'ri burchakli uchburchakda u katet, og'ma esa gipotenuza. | Rotate the scene and compare not the obliques themselves but their projections. The projections turned out to have different lengths, and that settles it. The farther the foot of an oblique is from the foot of the perpendicular, the longer the oblique. The rule works the other way too. Equal obliques give equal projections, and equal projections give equal obliques. And one more, the shortest one. The perpendicular is shorter than any oblique from the same point, because in a right triangle it is a leg and the oblique is the hypotenuse. |
| `audio.work` | Посчитай сам. Наклонные равны, и проекция первой равна девяти. Какова проекция второй? | O'zingiz hisoblang. Og'malar teng, va birinchisining proyeksiyasi to'qqizga teng. Ikkinchisining proyeksiyasi qancha? | Work it out yourself. The obliques are equal and the projection of the first one is nine. What is the projection of the second? |
| `work.prompt` | Первая проекция девять. Какова вторая? | Birinchi proyeksiya to'qqiz. Ikkinchisi qancha? | The first projection is nine. What is the second? |
| `work.ok` | Тоже девять. Прямоугольные треугольники равны по катету и гипотенузе. | Ham to'qqiz. To'g'ri burchakli uchburchaklar katet va gipotenuza bo'yicha teng. | Nine as well. The right triangles are equal by a leg and the hypotenuse. |
| `work.hint.1` | Перпендикуляр у них общий, и он катет в обоих треугольниках. | Perpendikulyar ularda umumiy, va u ikki uchburchakda ham katet. | The perpendicular is common to both, and it is a leg in both triangles. |
| `work.hint.2` | Гипотенузы равны по условию, катет общий. | Gipotenuzalar shartga ko'ra teng, katet umumiy. | The hypotenuses are equal by the condition, the leg is common. |
| `work.hint.3` | Значит равны и вторые катеты, то есть проекции. Девять. | Demak ikkinchi katetlar, ya'ni proyeksiyalar ham teng. To'qqiz. | So the second legs, that is the projections, are equal too. Nine. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `9` |
| `expr` | `AC = AD,   BC = 9   →   BD = ?` |

---

## Экран 5 · `explain3` · ответ `number` · тег `svoystvo-vmesto-priznaka`

Теорема о трёх перпендикулярах: два прямых угла держатся вместе.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Один прямой угол тянет за собой второй | Bitta to'g'ri burchak ikkinchisini tortadi | One right angle pulls a second one after it |
| `show.1.1` | в плоскости через основание наклонной проведена прямая | tekislikda og'maning asosi orqali to'g'ri chiziq o'tkazilgan | in the plane a line is drawn through the foot of the oblique |
| `show.1.2` | она перпендикулярна проекции | u proyeksiyaga perpendikulyar | it is perpendicular to the projection |
| `show.2.1` | поверни сцену и посмотри на вторую отметку | sahnani buring va ikkinchi belgiga qarang | rotate the scene and look at the second mark |
| `show.2.2` | она перпендикулярна и самой наклонной | u og'maning o'ziga ham perpendikulyar | it is perpendicular to the oblique itself |
| `audio.mount` | В плоскости проведена прямая. Она идёт через основание наклонной и перпендикулярна её проекции. | Tekislikda to'g'ri chiziq o'tkazilgan. U og'maning asosi orqali o'tadi va uning proyeksiyasiga perpendikulyar. | A line is drawn in the plane. It runs through the foot of the oblique and is perpendicular to its projection. |
| `audio.move*` | Поверни сцену и следи за отметками прямого угла. Их стало две. Первая была задана условием, а вторая появилась сама, и ни при каком повороте она не исчезает. Это и есть теорема о трёх перпендикулярах. Прямая в плоскости, проведённая через основание наклонной перпендикулярно её проекции, перпендикулярна и самой наклонной. Обратное тоже верно. Перпендикулярна наклонной, значит перпендикулярна и проекции. В теореме участвуют три перпендикуляра, отсюда и название. | Sahnani buring va to'g'ri burchak belgilariga qarang. Ular ikkita bo'ldi. Birinchisi shart bilan berilgan edi, ikkinchisi esa o'zi paydo bo'ldi, va hech qanday burilishda yo'qolmaydi. Bu uch perpendikulyar haqidagi teorema. Tekislikda og'maning asosi orqali uning proyeksiyasiga perpendikulyar o'tkazilgan to'g'ri chiziq og'maning o'ziga ham perpendikulyar bo'ladi. Teskarisi ham to'g'ri. Og'maga perpendikulyar bo'lsa, proyeksiyaga ham perpendikulyar. Teoremada uchta perpendikulyar qatnashadi, nomi ham shundan. | Rotate the scene and watch the right-angle marks. There are two of them now. The first was given by the condition, the second appeared on its own, and it does not vanish at any rotation. This is the theorem of three perpendiculars. A line in the plane drawn through the foot of the oblique perpendicular to its projection is perpendicular to the oblique itself. The converse holds too. Perpendicular to the oblique means perpendicular to the projection. Three perpendiculars take part in the theorem, and that is where the name comes from. |
| `audio.work` | Посчитай сам. Сколько перпендикуляров участвует в теореме? | O'zingiz hisoblang. Teoremada nechta perpendikulyar qatnashadi? | Work it out yourself. How many perpendiculars take part in the theorem? |
| `work.prompt` | Сколько перпендикуляров в теореме? | Teoremada nechta perpendikulyar bor? | How many perpendiculars are in the theorem? |
| `work.ok` | Три. Перпендикуляр к плоскости, прямая к проекции и она же к наклонной. | Uchta. Tekislikka perpendikulyar, proyeksiyaga to'g'ri chiziq va u og'maga. | Three. The perpendicular to the plane, the line to the projection, and the same line to the oblique. |
| `work.hint.1` | Посчитай прямые углы, которые сейчас на чертеже. | Hozir chizmada bor to'g'ri burchaklarni hisoblang. | Count the right angles now on the drawing. |
| `work.hint.2` | Один держит перпендикуляр с плоскостью, два появились у прямой. | Bittasi perpendikulyar bilan tekislikni tutadi, ikkitasi to'g'ri chiziqda paydo bo'ldi. | One holds the perpendicular with the plane, two appeared at the line. |
| `work.hint.3` | Название теоремы уже содержит это число. | Teoremaning nomi bu sonni o'zida saqlaydi. | The name of the theorem already carries this number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `3` |
| `expr` | `c ⊥ BC   →   c ⊥ AC` |

---

## Экран 6 · `explain4` · ответ `number` · тег `ttp-vmesto-proekcii`

Граница: прямая, перпендикулярная перпендикуляру, наклонной не перпендикулярна.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Не тот перпендикуляр | Bu perpendikulyar emas | The wrong perpendicular |
| `show.1.1` | взята другая прямая плоскости | tekislikning boshqa to'g'ri chizig'i olingan | another line of the plane is taken |
| `show.1.2` | она перпендикулярна перпендикуляру | u perpendikulyarga perpendikulyar | it is perpendicular to the perpendicular |
| `show.2.1` | поверни сцену и посмотри на наклонную | sahnani buring va og'maga qarang | rotate the scene and look at the oblique |
| `show.2.2` | прямого угла с ней нет | u bilan to'g'ri burchak yo'q | there is no right angle with it |
| `audio.mount` | Прямая в плоскости взята заново, и теперь она перпендикулярна не проекции, а самому перпендикуляру. | Tekislikdagi to'g'ri chiziq qaytadan olingan, va endi u proyeksiyaga emas, perpendikulyarning o'ziga perpendikulyar. | The line in the plane is taken anew, and now it is perpendicular not to the projection but to the perpendicular itself. |
| `audio.move*` | Это условие выполняется всегда и потому ничего не даёт. Перпендикуляр стоит под прямым углом ко всей плоскости, значит и к каждой её прямой, какую ни возьми. Поверни сцену и посмотри на угол с наклонной. Он не прямой, и ни одно положение сцены его прямым не сделает. Вот почему в теореме стоит слово проекция. Замени проекцию на перпендикуляр, и теорема перестанет работать, хотя запись почти та же. | Bu shart doim bajariladi va shuning uchun hech narsa bermaydi. Perpendikulyar butun tekislikka to'g'ri burchak ostida turadi, demak uning har bir to'g'ri chizig'iga ham, qaysi birini olsangiz. Sahnani buring va og'ma bilan burchakka qarang. U to'g'ri emas, va sahnaning birorta holati uni to'g'ri qilmaydi. Teoremada proyeksiya so'zi shuning uchun turadi. Proyeksiyani perpendikulyarga almashtirsangiz, teorema ishlamay qoladi, yozuv esa deyarli o'sha. | This condition always holds and therefore gives nothing. The perpendicular stands at a right angle to the whole plane, hence to every line of it, whichever you take. Rotate the scene and look at the angle with the oblique. It is not right, and no position of the scene will make it right. That is why the word projection stands in the theorem. Replace the projection by the perpendicular and the theorem stops working, although the reading is almost the same. |
| `audio.work` | Посчитай сам. Сколько прямых плоскости через основание наклонной перпендикулярны ей самой? | O'zingiz hisoblang. Og'maning asosi orqali o'tuvchi tekislik to'g'ri chiziqlaridan nechtasi unga perpendikulyar? | Work it out yourself. How many lines of the plane through the foot of the oblique are perpendicular to the oblique itself? |
| `work.prompt` | Сколько таких прямых в плоскости? | Tekislikda shunday to'g'ri chiziq nechta? | How many such lines are there in the plane? |
| `work.ok` | Одна. Та самая, что перпендикулярна проекции, и других нет. | Bitta. Aynan proyeksiyaga perpendikulyar bo'lgani, boshqasi yo'q. | One. Exactly the one perpendicular to the projection, and there are no others. |
| `work.hint.1` | Через точку в плоскости перпендикулярно данной прямой проходит одна прямая. | Tekislikdagi nuqta orqali berilgan to'g'ri chiziqqa perpendikulyar bitta to'g'ri chiziq o'tadi. | Through a point in the plane there is one line perpendicular to a given line. |
| `work.hint.2` | Теорема связывает такую прямую с наклонной в обе стороны. | Teorema bunday to'g'ri chiziqni og'ma bilan ikki tomonga bog'laydi. | The theorem ties such a line to the oblique both ways. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |
| `expr` | `d ⊥ AB,   d ⊥ AC  ?` |

---

## Экран 7 · `explain5` · ответ `number` · тег `bumaga`

Расстояния: все три через перпендикуляр.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАССТОЯНИЕ | MASOFA | DISTANCE |
| `title` | Расстояние всегда по перпендикуляру | Masofa doim perpendikulyar bo'yicha | Distance always goes along the perpendicular |
| `show.1.1` | от точки до плоскости мерят по перпендикуляру | nuqtadan tekislikkacha perpendikulyar bo'yicha o'lchanadi | from a point to a plane it is measured along the perpendicular |
| `show.1.2` | наклонная всегда длиннее | og'ma doim uzunroq | an oblique is always longer |
| `show.2.1` | от прямой до параллельной плоскости так же | to'g'ri chiziqdan parallel tekislikkacha ham shunday | from a line to a parallel plane it is the same |
| `show.2.2` | и между параллельными плоскостями тоже | parallel tekisliklar orasida ham | and between parallel planes as well |
| `audio.mount` | Теперь про длину. Расстоянием от точки до плоскости называют длину перпендикуляра, опущенного из этой точки. | Endi uzunlik haqida. Nuqtadan tekislikkacha bo'lgan masofa deb shu nuqtadan tushirilgan perpendikulyar uzunligiga aytiladi. | Now about length. The distance from a point to a plane is the length of the perpendicular dropped from that point. |
| `audio.move*` | Почему именно перпендикуляр, мы уже видели. Он короче любой наклонной из той же точки, а расстояние это всегда самый короткий путь. Когда говорят, что высота часовой башни в Ташкенте тридцать метров, имеют в виду перпендикуляр от вершины до плоскости основания. Так же мерят и остальные расстояния. От прямой до параллельной ей плоскости берут перпендикуляр из любой её точки, потому что все они дают одну длину. Между двумя параллельными плоскостями тоже берут перпендикуляр. | Nima uchun aynan perpendikulyar, biz allaqachon ko'rdik. U o'sha nuqtadan chiqqan har qanday og'madan qisqa, masofa esa doim eng qisqa yo'l. Toshkentdagi soat minorasining balandligi o'ttiz metr deyilganda, uchidan asos tekisligigacha bo'lgan perpendikulyar tushuniladi. Qolgan masofalar ham shunday o'lchanadi. To'g'ri chiziqdan unga parallel tekislikkacha uning istalgan nuqtasidan perpendikulyar olinadi, chunki ularning hammasi bir uzunlik beradi. Ikki parallel tekislik orasida ham perpendikulyar olinadi. | Why the perpendicular, we have already seen. It is shorter than any oblique from the same point, and a distance is always the shortest path. When the clock tower in Tashkent is said to be thirty metres high, what is meant is the perpendicular from its top to the plane of its base. The other distances are measured the same way. From a line to a plane parallel to it you take a perpendicular from any of its points, because all of them give one length. Between two parallel planes you take a perpendicular as well. |
| `audio.work` | Посчитай сам. Перпендикуляр к плоскости равен восьми, проекция наклонной шести. Какова наклонная? | O'zingiz hisoblang. Tekislikka perpendikulyar sakkizga, og'ma proyeksiyasi oltiga teng. Og'ma qancha? | Work it out yourself. The perpendicular to the plane is eight, the projection of the oblique is six. How long is the oblique? |
| `work.prompt` | Найди длину наклонной | Og'ma uzunligini toping | Find the length of the oblique |
| `work.ok` | Десять. Перпендикуляр и проекция это катеты, наклонная гипотенуза. | O'n. Perpendikulyar va proyeksiya katetlar, og'ma esa gipotenuza. | Ten. The perpendicular and the projection are the legs, the oblique is the hypotenuse. |
| `work.hint.1` | Перпендикуляр, проекция и наклонная дают прямоугольный треугольник. | Perpendikulyar, proyeksiya va og'ma to'g'ri burchakli uchburchak beradi. | The perpendicular, the projection and the oblique form a right triangle. |
| `work.hint.2` | Прямой угол стоит там, где перпендикуляр входит в плоскость. | To'g'ri burchak perpendikulyar tekislikka kirgan joyda turadi. | The right angle is where the perpendicular meets the plane. |
| `work.hint.3` | Шесть и восемь дают гипотенузу десять. | Olti va sakkiz o'n gipotenuza beradi. | Six and eight give a hypotenuse of ten. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `10` |
| `expr` | `AB = 8,   BC = 6,   AC = ?` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Что обязательно в теореме | Teoremada nima shart | What is required in the theorem |
| `probe.question` | Что нужно, чтобы применить теорему? | Teoremani qo'llash uchun nima kerak? | What is needed to apply the theorem? |
| `probe.a` [верно] | прямая лежит в плоскости и идёт через основание наклонной | to'g'ri chiziq tekislikda yotadi va og'maning asosi orqali o'tadi | the line lies in the plane and runs through the foot of the oblique |
| `probe.b` | прямая перпендикулярна перпендикуляру | to'g'ri chiziq perpendikulyarga perpendikulyar | the line is perpendicular to the perpendicular |
| `probe.b.hint` | Это выполняется у каждой прямой плоскости и потому ничего не даёт. | Bu tekislikning har bir to'g'ri chizig'ida bajariladi va shuning uchun hech narsa bermaydi. | That holds for every line of the plane and therefore gives nothing. |
| `rule.lawLabel` | Теорема о трёх перпендикулярах | Uch perpendikulyar haqidagi teorema | The theorem of three perpendiculars |
| `rule.lines.1` | прямая в плоскости через основание наклонной, перпендикулярная проекции, перпендикулярна и наклонной | tekislikda og'maning asosi orqali o'tuvchi va proyeksiyaga perpendikulyar to'g'ri chiziq og'maga ham perpendikulyar | a line in the plane through the foot of the oblique, perpendicular to the projection, is perpendicular to the oblique too |
| `rule.lines.2` | обратное верно: перпендикулярна наклонной, значит перпендикулярна проекции | teskarisi to'g'ri: og'maga perpendikulyar bo'lsa, proyeksiyaga ham perpendikulyar | the converse holds: perpendicular to the oblique means perpendicular to the projection |
| `rule.lines.3` | перпендикуляр короче любой наклонной, поэтому расстояние берут по нему | perpendikulyar har qanday og'madan qisqa, shuning uchun masofa u bo'yicha olinadi | the perpendicular is shorter than any oblique, so distance is taken along it |
| `audio.mount` | Проверь себя одним вопросом, а потом посмотри на карточку. | O'zingizni bitta savol bilan tekshiring, keyin kartochkaga qarang. | Check yourself with one question, then look at the card. |
| `audio.rule*` | В теореме два условия, и оба обязательны. Прямая лежит в плоскости и проходит через основание наклонной. Убери первое, и прямая может стоять как угодно. Убери второе, и она пройдёт мимо. Проверка условия про перпендикуляр ничего не стоит, потому что она выполняется всегда. Работает только проверка про проекцию. | Teoremada ikki shart bor, va ikkalasi ham majburiy. To'g'ri chiziq tekislikda yotadi va og'maning asosi orqali o'tadi. Birinchisini olib tashlasangiz, to'g'ri chiziq xohlagancha turishi mumkin. Ikkinchisini olib tashlasangiz, u yonidan o'tib ketadi. Perpendikulyar haqidagi shartni tekshirish hech narsa turmaydi, chunki u doim bajariladi. Faqat proyeksiya haqidagi tekshiruv ishlaydi. | The theorem has two conditions, and both are required. The line lies in the plane and passes through the foot of the oblique. Drop the first and the line may stand however it likes. Drop the second and it will pass by. Checking the condition about the perpendicular costs nothing, because it always holds. Only the check about the projection works. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `c ⊂ α,  C ∈ c   →   (c ⊥ BC ⇔ c ⊥ AC)` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Назови каждый отрезок | Har bir kesmani nomlang | Name each segment |
| `match.prompt` | Соедини запись с именем | Yozuvni nomi bilan birlashtiring | Match the reading with the name |
| `match.ok` | Все четыре на месте. Дальше эти имена берём как рабочие. | To'rttasi ham joyida. Bundan keyin bu nomlarni ishchi deb olamiz. | All four are in place. From here we take these names as working ones. |
| `audio.mount` | Четыре записи и четыре имени. Соедини их. | To'rt yozuv va to'rt nom. Ularni birlashtiring. | Four readings and four names. Match them. |
| `match.a` | перпендикуляр к плоскости | tekislikka perpendikulyar | the perpendicular to the plane |
| `match.b` | наклонная | og'ma | the oblique |
| `match.c` | проекция наклонной | og'maning proyeksiyasi | the projection of the oblique |
| `match.d` | основание наклонной | og'maning asosi | the foot of the oblique |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `AB` · `AC` · `BC` · `C` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `svoystvo-vmesto-priznaka`

Задача 1 со стр. 135: точка на перпендикуляре из центра вписанной окружности.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Докажи равноудалённость | Baravar uzoqlikni isbotlang | Prove the equal distances |
| `proof.given` | перпендикуляр из центра вписанной окружности | ichki chizilgan aylana markazidan perpendikulyar | a perpendicular from the incentre |
| `proof.goal` | его точки равноудалены от сторон | uning nuqtalari tomonlardan baravar uzoqlikda | its points are equidistant from the sides |
| `proof.r1` | радиус перпендикулярен стороне | radius tomonga perpendikulyar | the radius is perpendicular to the side |
| `proof.r2` | значит и наклонная перпендикулярна стороне | demak og'ma ham tomonga perpendikulyar | so the oblique is perpendicular to the side too |
| `proof.r3` | три треугольника равны по двум катетам | uchta uchburchak ikki katet bo'yicha teng | three triangles are equal by two legs |
| `proof.ok` | Доказано. Теорема сработала три раза, по одной стороне каждый раз. | Isbotlandi. Teorema uch marta ishladi, har safar bitta tomon bo'yicha. | Proved. The theorem worked three times, once for each side. |
| `proof.e1` | Аксиома тут не нужна. Это свойство окружности. | Bu yerda aksioma kerak emas. Bu aylananing xossasi. | No axiom is needed here. This is a property of the circle. |
| `proof.e2` | Радиусы уже взяты. Теперь про наклонную. | Radiuslar allaqachon olingan. Endi og'ma haqida. | The radii are already taken. Now about the oblique. |
| `proof.e3` | Перпендикулярность доказана. Речь о длинах. | Perpendikulyarlik isbotlandi. Gap uzunliklar haqida. | The perpendicularity is proved. This is about lengths. |
| `reason.s1` | теорема о трёх перпендикулярах | uch perpendikulyar haqidagi teorema | the theorem of three perpendiculars |
| `reason.s2` | радиус в точку касания | urinish nuqtasiga radius | the radius to the point of contact |
| `reason.s3` | равенство прямоугольных треугольников | to'g'ri burchakli uchburchaklar tengligi | equality of right triangles |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Задача из учебника. Обоснование каждой строки выбирается из списка. | Darslikdagi masala. Har qatorning asoslashi ro'yxatdan tanlanadi. | A problem from the textbook. The justification of each line is chosen from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `SO ⊥ α,   OA ⊥ a   →   SA ⊥ a` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Пятнадцать. Проекция девять, перпендикуляр двенадцать, наклонная пятнадцать. | O'n besh. Proyeksiya to'qqiz, perpendikulyar o'n ikki, og'ma o'n besh. | Fifteen. The projection is nine, the perpendicular is twelve, the oblique is fifteen. |
| `task.hint.1` | Нарисуй прямоугольный треугольник и подпиши катеты. | To'g'ri burchakli uchburchak chizing va katetlarni imzolang. | Draw a right triangle and label the legs. |
| `task.hint.2` | Прямой угол там, где перпендикуляр входит в плоскость. | To'g'ri burchak perpendikulyar tekislikka kirgan joyda. | The right angle is where the perpendicular meets the plane. |
| `task.hint.3` | Девять и двенадцать дают пятнадцать. | To'qqiz va o'n ikki o'n beshni beradi. | Nine and twelve give fifteen. |
| `order.prompt` | Расставь записи в том порядке, в каком их получают | Yozuvlarni olinish tartibida joylashtiring | Arrange the readings in the order they are obtained |
| `order.title` | Порядок работы | Ish tartibi | The order of work |
| `order.ok` | Порядок верный. Условие проверяется до вывода, а не после. | Tartib to'g'ri. Shart xulosadan oldin tekshiriladi, keyin emas. | The order is right. The condition is checked before the conclusion, not after. |
| `order.bad` | Не в этом порядке. Посмотри, что нужно знать раньше. | Bu tartibda emas. Avval nimani bilish kerakligini ko'ring. | Not in this order. See what has to be known first. |
| `audio.mount` | Прибор убран. Здесь считают на бумаге. | Asbob olib qo'yildi. Bu yerda qog'ozda hisoblanadi. | The tool is put away. Here you count on paper. |
| `audio.next` | Теперь порядок шагов. Расставь их так, как их делают. | Endi qadamlar tartibi. Ularni qanday bajarilsa, shunday joylashtiring. | Now the order of steps. Arrange them the way they are done. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `AB = 12,   BC = 9,   AC = ?` |
| `task.answer` | `15` |
| `order.items` | `c ⊥ AC` · `AB ⊥ α` · `c ⊥ BC` · `BC` |
| `order.answer` | `AB ⊥ α  BC  c ⊥ BC  c ⊥ AC` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Условие переписано верно. | Shart to'g'ri ko'chirilgan. | The condition is copied correctly. |
| `hint.r2` | Это верно у любой прямой плоскости. | Bu tekislikning har qanday to'g'ri chizig'ida to'g'ri. | This is true for any line of the plane. |
| `hint.r4` | Вывод сам по себе верен, но получен не отсюда. | Xulosa o'zi to'g'ri, lekin bu yerdan olinmagan. | The conclusion itself is right, but it does not come from here. |
| `proof` | Поверни сцену: угол, который считали прямым, прямым не оказался. | Sahnani buring: to'g'ri deb hisoblangan burchak to'g'ri chiqmadi. | Rotate the scene: the angle taken for a right one turned out not to be right. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Из перпендикулярности перпендикуляру про наклонную не следует ничего. | Uchinchi. Perpendikulyarga perpendikulyarlikdan og'ma haqida hech narsa kelib chiqmaydi. | The third. Being perpendicular to the perpendicular implies nothing about the oblique. |
| `entry.hint.1` | Проверь каждую строку отдельно и найди, где вывод не следует. | Har qatorni alohida tekshiring va xulosa kelib chiqmagan joyni toping. | Check each line separately and find where the conclusion does not follow. |
| `entry.hint.2` | Теорема говорит про проекцию, а не про перпендикуляр. | Teorema proyeksiya haqida gapiradi, perpendikulyar haqida emas. | The theorem speaks about the projection, not about the perpendicular. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Перед тобой доказательство из четырёх строк. Одна из них не следует из предыдущих. | Oldingizda to'rt qatorli isbot. Ulardan biri oldingilaridan kelib chiqmaydi. | In front of you is a proof of four lines. One of them does not follow from the previous ones. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `AB ⊥ α,   AC` |
| `row.r2` | `d ⊂ α   →   d ⊥ AB` |
| `row.r3` | `d ⊥ AB   →   d ⊥ AC` |
| `row.r4` | `d ⊥ AC` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Дано, что прямая перпендикулярна наклонной. Сколько прямых плоскости через основание перпендикулярны проекции? | To'g'ri chiziq og'maga perpendikulyar deb berilgan. Asos orqali o'tuvchi tekislik to'g'ri chiziqlaridan nechtasi proyeksiyaga perpendikulyar? | It is given that a line is perpendicular to the oblique. How many lines of the plane through the foot are perpendicular to the projection? |
| `place.ok` | Одна, и это та же прямая. Теорема работает в обе стороны. | Bitta, va bu o'sha to'g'ri chiziq. Teorema ikki tomonga ishlaydi. | One, and it is the same line. The theorem works both ways. |
| `place.wrong` | Посмотри на обратную теорему на карточке. | Kartochkadagi teskari teoremaga qarang. | Look at the converse theorem on the card. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно всегда | Nima doim to'g'ri | What is always true |
| `multi.d.hint` | Это условие есть у каждой прямой плоскости и вывода не даёт. | Bu shart tekislikning har bir to'g'ri chizig'ida bor va xulosa bermaydi. | Every line of the plane has this condition and it gives no conclusion. |
| `multi.e.hint` | Наклонная гипотенуза, а проекция катет. | Og'ma gipotenuza, proyeksiya esa katet. | The oblique is the hypotenuse and the projection is a leg. |
| `multi.ok` | Три записи из пяти. Две оставшиеся ломаются на слове проекция. | Beshtadan uch yozuv. Qolgan ikkitasi proyeksiya so'zida sinadi. | Three readings out of five. The other two break at the word projection. |
| `audio.mount` | Теорема читается в обе стороны, и сейчас мы прочитаем её справа налево. | Teorema ikki tomonga o'qiladi, va hozir biz uni o'ngdan chapga o'qiymiz. | The theorem reads both ways, and now we read it from right to left. |
| `audio.work` | Отметь все записи, которые верны всегда. Их больше одной. | Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are always true. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `1` |
| `place.step` | `c ⊥ AC   →   c ⊥ BC` |
| `multi.a` [верно] | `AB < AC` |
| `multi.b` [верно] | `c ⊥ BC   →   c ⊥ AC` |
| `multi.c` [верно] | `AB ⊥ BC` |
| `multi.d` | `d ⊥ AB   →   d ⊥ AC` |
| `multi.e` | `AC < BC` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `svoystvo-vmesto-priznaka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что короче из одной точки? | Bitta nuqtadan nima qisqaroq? | Which is shorter from one point? |
| `q1.a` [верно] | перпендикуляр | perpendikulyar | the perpendicular |
| `q1.b` | наклонная | og'ma | the oblique |
| `q1.b.hint` | Наклонная гипотенуза в том же треугольнике. | Og'ma o'sha uchburchakda gipotenuza. | The oblique is the hypotenuse in that same triangle. |
| `q1.c` | они равны | ular teng | they are equal |
| `q1.c.hint` | Равны они были бы только при нулевой проекции. | Ular faqat proyeksiya nol bo'lganda teng bo'lardi. | They would be equal only if the projection were zero. |
| `q1.d` | зависит от плоскости | tekislikka bog'liq | it depends on the plane |
| `q1.d.hint` | Треугольник прямоугольный при любой плоскости. | Uchburchak har qanday tekislikda to'g'ri burchakli. | The triangle is right-angled for any plane. |
| `q2.prompt` | Через какую точку должна идти прямая? | To'g'ri chiziq qaysi nuqta orqali o'tishi kerak? | Through which point must the line pass? |
| `q2.a` [верно] | через основание наклонной | og'maning asosi orqali | through the foot of the oblique |
| `q2.b` | через основание перпендикуляра | perpendikulyarning asosi orqali | through the foot of the perpendicular |
| `q2.b.hint` | Это другая точка, и теорема про неё ничего не говорит. | Bu boshqa nuqta, va teorema u haqida hech narsa demaydi. | That is a different point, and the theorem says nothing about it. |
| `q2.c` | через любую точку проекции | proyeksiyaning istalgan nuqtasi orqali | through any point of the projection |
| `q2.c.hint` | Тогда прямого угла с наклонной может и не быть. | Unda og'ma bilan to'g'ri burchak bo'lmasligi mumkin. | Then there may be no right angle with the oblique. |
| `q2.d` | место не важно | joy muhim emas | the place does not matter |
| `q2.d.hint` | Условие про основание стоит в теореме дословно. | Asos haqidagi shart teoremada so'zma-so'z turadi. | The condition about the foot stands in the theorem word for word. |
| `q3.prompt` | Наклонные равны. Что с проекциями? | Og'malar teng. Proyeksiyalar qanday? | The obliques are equal. What about the projections? |
| `q3.a` [верно] | равны | teng | equal |
| `q3.b` | одна больше | biri kattaroq | one is bigger |
| `q3.b.hint` | Большая проекция даёт и большую наклонную. | Katta proyeksiya katta og'ma ham beradi. | A bigger projection gives a bigger oblique too. |
| `q3.c` | нельзя сказать | aytib bo'lmaydi | it cannot be said |
| `q3.c.hint` | Прямоугольные треугольники здесь равны. | Bu yerda to'g'ri burchakli uchburchaklar teng. | The right triangles here are equal. |
| `q3.d` | зависит от угла наклона | og'ish burchagiga bog'liq | it depends on the angle of the slant |
| `q3.d.hint` | Угол наклона у равных наклонных один и тот же. | Teng og'malarda og'ish burchagi bir xil. | Equal obliques have one and the same angle of slant. |
| `q4.prompt` | Что называют расстоянием от точки до плоскости? | Nuqtadan tekislikkacha bo'lgan masofa deb nimaga aytiladi? | What is called the distance from a point to a plane? |
| `q4.a` [верно] | длину перпендикуляра | perpendikulyar uzunligiga | the length of the perpendicular |
| `q4.b` | длину наклонной | og'ma uzunligiga | the length of the oblique |
| `q4.b.hint` | Наклонных много, и все они длиннее. | Og'malar ko'p, va hammasi uzunroq. | There are many obliques, and all of them are longer. |
| `q4.c` | длину проекции | proyeksiya uzunligiga | the length of the projection |
| `q4.c.hint` | Проекция лежит в плоскости и от неё не удаляется. | Proyeksiya tekislikda yotadi va undan uzoqlashmaydi. | The projection lies in the plane and does not go away from it. |
| `q4.d` | среднее из замеров | o'lchovlarning o'rtasiga | the average of measurements |
| `q4.d.hint` | Расстояние это самый короткий путь, а не среднее. | Masofa eng qisqa yo'l, o'rtacha emas. | A distance is the shortest path, not an average. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `AB < AC` |
| `q2.done` | `C ∈ c` |
| `q3.done` | `AC = AD   →   BC = BD` |
| `q4.done` | `ρ = AB` |
| `angles` | `AB` · `AC` · `BC` · `C` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Отличаю перпендикуляр от наклонной и нахожу её проекцию | Perpendikulyarni og'madan ajrataman va uning proyeksiyasini topaman | I tell a perpendicular from an oblique and find its projection |
| `can.2` | Применяю теорему к проекции, а не к перпендикуляру | Teoremani proyeksiyaga qo'llayman, perpendikulyarga emas | I apply the theorem to the projection, not to the perpendicular |
| `can.3` | Читаю теорему в обе стороны | Teoremani ikki tomonga o'qiyman | I read the theorem both ways |
| `can.4` | Беру расстояние по перпендикуляру | Masofani perpendikulyar bo'yicha olaman | I take distance along the perpendicular |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше берём угол между наклонной и её проекцией — это и есть угол прямой с плоскостью | Bundan keyin og'ma va uning proyeksiyasi orasidagi burchakni olamiz, bu to'g'ri chiziqning tekislik bilan burchagi | Next we take the angle between the oblique and its projection, and that is the angle of a line with a plane |
| `lifehack` | Ищешь прямой угол в пространстве — сначала найди проекцию | Fazoda to'g'ri burchak izlayotgan bo'lsangiz, avval proyeksiyani toping | Looking for a right angle in space, find the projection first |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страницы сто тридцать один и сто тридцать пять | Geometriya, bir yuz o'ttiz birinchi va bir yuz o'ttiz beshinchi betlar | Geometry, pages one hundred thirty one and one hundred thirty five |
| `audio.mount` | Урок начался с двух похожих записей. Одна из них оказалась пустой. | Dars ikki o'xshash yozuv bilan boshlandi. Ulardan biri bo'sh bo'lib chiqdi. | The lesson began with two similar readings. One of them turned out to be empty. |
| `audio.next` | Разница была в одном слове. Проекция даёт вывод, перпендикуляр не даёт ничего, потому что он перпендикулярен всей плоскости сразу. Теперь у тебя есть проекция, и на следующем уроке мы измерим угол между наклонной и ею. | Farq bitta so'zda edi. Proyeksiya xulosa beradi, perpendikulyar esa hech narsa bermaydi, chunki u butun tekislikka birdan perpendikulyar. Endi sizda proyeksiya bor, va keyingi darsda og'ma bilan uning orasidagi burchakni o'lchaymiz. | The difference was in one word. The projection gives a conclusion, the perpendicular gives nothing, because it is perpendicular to the whole plane at once. Now you have the projection, and in the next lesson we will measure the angle between the oblique and it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `c ⊥ AB   →   c ⊥ AC` |
| `hook.b` | `c ⊥ BC   →   c ⊥ AC` |
| `proved` | `c ⊥ BC   ⇔   c ⊥ AC` |
| `law` | `AB ⊥ α,   c ⊂ α,   C ∈ c` |
| `sheet.1` | `AB ⊥ α` |
| `sheet.2` | `AB < AC` |
| `sheet.3` | `AC = AD ⇔ BC = BD` |
| `sheet.4` | `c ⊥ BC ⇔ c ⊥ AC` |
| `sheet.5` | `ρ(A; α) = AB` |
