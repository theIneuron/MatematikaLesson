# Урок 42 — Угол между прямой и плоскостью · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS41_KONTENT.md`.

Скелет: в переписке 2026-08-20. Опора: учебник геометрии 2022, §19, стр. 138 — определение
проекции прямой и определение угла между прямой и плоскостью, оба дословно.

**Главное решение урока.** Угол между прямой и плоскостью — это угол с **проекцией**, и ни с
какой другой прямой плоскости. Ошибка живая: ученик берёт ту прямую, которая удобно лежит на
чертеже, и получает угол меньше настоящего. Показать это можно только поворотом: на неподвижном
чертеже удобная прямая выглядит убедительнее проекции.

**Дуга угла показывает, ГДЕ угол, а не его величину.** Проекция искажает углы, поэтому все
числа в уроке считаются, а не читаются с картинки. Это то же правило, что «измерил не значит
доказал» из урока 38.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины
`proyeksiya`, `og'ma`, `to'g'ri chiziq va tekislik orasidagi burchak` взяты из учебника, стр. 138.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | УГОЛ | BURCHAK | THE ANGLE |
| `title` | С чем берут угол | Burchak nima bilan olinadi | What the angle is taken with |
| `row.a.name` | с прямой плоскости | tekislik chizig'i bilan | with a line of the plane |
| `row.b.name` | с проекцией | proyeksiya bilan | with the projection |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём сцену. | Javobingiz yozib olindi. Endi sahnani buramiz. | Your answer is recorded. Now we rotate the scene. |
| `audio.mount` | Прямая пересекает плоскость и не перпендикулярна ей. Угол между ними ещё не отмечен. | To'g'ri chiziq tekislikni kesib o'tadi va unga perpendikulyar emas. Ular orasidagi burchak hali belgilanmagan. | A line crosses the plane and is not perpendicular to it. The angle between them is not marked yet. |
| `audio.r1` | Первая запись говорит так. Берём в плоскости любую прямую через точку пересечения и мерим угол с ней. | Birinchi yozuv shunday deydi. Tekislikda kesishish nuqtasi orqali istalgan to'g'ri chiziqni olamiz va u bilan burchakni o'lchaymiz. | The first reading says this. Take any line of the plane through the crossing point and measure the angle with it. |
| `audio.r2` | Вторая берёт не любую прямую, а проекцию. | Ikkinchisi istalgan chiziqni emas, proyeksiyani oladi. | The second takes not any line but the projection. |
| `audio.ask` | Прямых в плоскости бесконечно много, и углы с ними разные. Как думаешь, какая запись верная? | Tekislikda to'g'ri chiziqlar cheksiz ko'p, va ular bilan burchaklar boshqa-boshqa. Sizningcha qaysi yozuv to'g'ri? | There are infinitely many lines in the plane and the angles with them differ. Which reading do you think is correct? |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a ∩ α = A` |
| `row.a.value` | `∠(a; α) = ∠(a; b),   b ⊂ α` |
| `row.b.value` | `∠(a; α) = ∠(a; a₁)` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из прошлого урока | O'tgan darsdan uch savol | Three questions from the last lesson |
| `q1.prompt` | Что такое проекция наклонной? | Og'maning proyeksiyasi nima? | What is the projection of an oblique? |
| `q1.a` [верно] | отрезок между основаниями | asoslar orasidagi kesma | the segment between the feet |
| `q1.b` | сама наклонная | og'maning o'zi | the oblique itself |
| `q1.b.hint` | Наклонная в плоскости не лежит, а проекция лежит. | Og'ma tekislikda yotmaydi, proyeksiya esa yotadi. | An oblique does not lie in the plane, a projection does. |
| `q1.c` | перпендикуляр | perpendikulyar | the perpendicular |
| `q1.c.hint` | Перпендикуляр только приходит в плоскость, а не идёт по ней. | Perpendikulyar tekislikka faqat keladi, unda bormaydi. | A perpendicular only arrives at the plane, it does not run along it. |
| `q1.d` | вся плоскость | butun tekislik | the whole plane |
| `q1.d.hint` | Проекция отрезка это отрезок. | Kesmaning proyeksiyasi kesma bo'ladi. | The projection of a segment is a segment. |
| `q2.prompt` | Что короче из одной точки? | Bitta nuqtadan nima qisqaroq? | Which is shorter from one point? |
| `q2.a` [верно] | перпендикуляр | perpendikulyar | the perpendicular |
| `q2.b` | наклонная | og'ma | the oblique |
| `q2.b.hint` | Наклонная гипотенуза в том же треугольнике. | Og'ma o'sha uchburchakda gipotenuza. | The oblique is the hypotenuse in that triangle. |
| `q2.c` | они равны | ular teng | they are equal |
| `q2.c.hint` | Равны они были бы только при нулевой проекции. | Ular faqat proyeksiya nol bo'lganda teng bo'lardi. | They would be equal only with a zero projection. |
| `q2.d` | зависит от плоскости | tekislikka bog'liq | it depends on the plane |
| `q2.d.hint` | Треугольник прямоугольный при любой плоскости. | Uchburchak har qanday tekislikda to'g'ri burchakli. | The triangle is right-angled for any plane. |
| `q3.prompt` | Что даёт теорема о трёх перпендикулярах? | Uch perpendikulyar haqidagi teorema nima beradi? | What does the theorem of three perpendiculars give? |
| `q3.a` [верно] | переносит перпендикулярность с проекции на наклонную | perpendikulyarlikni proyeksiyadan og'maga o'tkazadi | it carries perpendicularity from the projection to the oblique |
| `q3.b` | сравнивает длины | uzunliklarni solishtiradi | it compares lengths |
| `q3.b.hint` | Про длины там речи нет вовсе. | Unda uzunliklar haqida gap yo'q. | It says nothing about lengths at all. |
| `q3.c` | строит перпендикуляр | perpendikulyar quradi | it builds a perpendicular |
| `q3.c.hint` | Перпендикуляр в ней уже дан. | Perpendikulyar unda allaqachon berilgan. | The perpendicular is already given in it. |
| `q3.d` | измеряет угол | burchakni o'lchaydi | it measures the angle |
| `q3.d.hint` | Углы она не считает, она их переносит. | U burchaklarni hisoblamaydi, ularni o'tkazadi. | It does not compute angles, it carries them over. |
| `audio.mount` | Три вопроса про прошлый урок. Проекция понадобится сразу. | O'tgan dars haqida uch savol. Proyeksiya darhol kerak bo'ladi. | Three questions about the last lesson. The projection will be needed at once. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `BC ⊂ α` |
| `q2.done` | `AB < AC` |
| `q3.done` | `c ⊥ BC ⇔ c ⊥ AC` |

---

## Экран 3 · `explain1` · ответ `number` · тег `kartinka-kak-dokazatelstvo`

Проекция прямой строится на глазах.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Основания перпендикуляров дают прямую | Perpendikulyar asoslari to'g'ri chiziq beradi | The feet of the perpendiculars give a line |
| `show.1.1` | из точек прямой падают перпендикуляры | to'g'ri chiziq nuqtalaridan perpendikulyarlar tushadi | perpendiculars drop from the points of the line |
| `show.1.2` | их основания ложатся в плоскость | ularning asoslari tekislikka tushadi | their feet land in the plane |
| `show.2.1` | основания легли на одну прямую | asoslar bitta to'g'ri chiziqqa tushdi | the feet fell on one line |
| `show.2.2` | это проекция прямой на плоскость | bu to'g'ri chiziqning tekislikdagi proyeksiyasi | this is the projection of the line on the plane |
| `audio.mount` | Возьмём на прямой несколько точек и из каждой опустим перпендикуляр на плоскость. | To'g'ri chiziqda bir necha nuqta olamiz va har biridan tekislikka perpendikulyar tushiramiz. | Take several points on the line and drop a perpendicular from each onto the plane. |
| `audio.move*` | Смотри, куда попадают основания. Они не разбросаны, они выстроились в одну прямую, и эта прямая называется проекцией нашей прямой на плоскость. Так и написано в учебнике на странице сто тридцать восемь. Поверни сцену и следи за проекцией. Она остаётся в плоскости при любом положении сцены, потому что построена из точек плоскости. Наклонная прямая при повороте уходит из плоскости, а её проекция нет. | Asoslar qayerga tushishiga qarang. Ular sochilib ketmadi, bitta to'g'ri chiziqqa tizildi, va bu chiziq bizning to'g'ri chizig'imizning tekislikdagi proyeksiyasi deb ataladi. Darslikda bir yuz o'ttiz sakkizinchi betda ham shunday yozilgan. Sahnani buring va proyeksiyaga qarang. U sahnaning har qanday holatida tekislikda qoladi, chunki tekislik nuqtalaridan qurilgan. Og'ma chiziq burilishda tekislikdan chiqadi, uning proyeksiyasi esa yo'q. | Look at where the feet land. They are not scattered, they line up on one line, and that line is called the projection of our line on the plane. That is exactly what the textbook says on page one hundred thirty eight. Rotate the scene and watch the projection. It stays in the plane at any position of the scene, because it is built from points of the plane. Under rotation the slanted line leaves the plane, its projection does not. |
| `audio.work` | Посчитай сам. Сколько прямых получается из оснований этих перпендикуляров? | O'zingiz hisoblang. Bu perpendikulyarlarning asoslaridan nechta to'g'ri chiziq chiqadi? | Work it out yourself. How many lines come out of the feet of these perpendiculars? |
| `work.prompt` | Сколько прямых дают основания? | Asoslar nechta to'g'ri chiziq beradi? | How many lines do the feet give? |
| `work.ok` | Одна. Основания всех перпендикуляров лежат на одной прямой, и это проекция. | Bitta. Barcha perpendikulyarlarning asoslari bitta to'g'ri chiziqda yotadi, va bu proyeksiya. | One. The feet of all the perpendiculars lie on one line, and that is the projection. |
| `work.hint.1` | Посмотри, разбросаны основания или выстроены. | Asoslar sochilganmi yoki tizilganmi, qarang. | See whether the feet are scattered or lined up. |
| `work.hint.2` | Через две точки проходит ровно одна прямая. | Ikki nuqta orqali roppa-rosa bitta to'g'ri chiziq o'tadi. | Exactly one line passes through two points. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a₁ ⊂ α` |
| `work.answer` | `1` |

---

## Экран 4 · `explain2` · ответ `number` · тег `ugol-ne-s-proekciey`

Разграничение: проекция даёт наименьший угол.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Две дуги, и они разные | Ikki duga, va ular boshqa-boshqa | Two arcs, and they differ |
| `show.1.1` | одна дуга между прямой и проекцией | biri to'g'ri chiziq va proyeksiya orasida | one arc between the line and the projection |
| `show.1.2` | другая между прямой и второй прямой плоскости | ikkinchisi to'g'ri chiziq va tekislikning boshqa chizig'i orasida | the other between the line and a second line of the plane |
| `show.2.1` | поверни сцену и сравни дуги | sahnani buring va dugalarni solishtiring | rotate the scene and compare the arcs |
| `show.2.2` | с проекцией угол наименьший | proyeksiya bilan burchak eng kichik | with the projection the angle is the smallest |
| `audio.mount` | В плоскости взята вторая прямая через ту же точку, и угол с ней тоже отмечен дугой. | Tekislikda o'sha nuqta orqali ikkinchi to'g'ri chiziq olingan, va u bilan burchak ham duga bilan belgilangan. | A second line of the plane is taken through the same point, and the angle with it is also marked by an arc. |
| `audio.move*` | На неподвижном чертеже вторая дуга кажется меньше, и рука сама тянется взять её. Поверни сцену и посмотри снова. Дуга с проекцией остаётся самой узкой при любом положении, а вторая то растёт, то сжимается, потому что мы видим её под разными ракурсами. Углом между прямой и плоскостью считают именно наименьший, и он достигается на проекции. Все остальные прямые плоскости дают углы больше. | Qimirlamas chizmada ikkinchi duga kichikroq ko'rinadi, va qo'l o'zi uni olishga cho'ziladi. Sahnani buring va yana qarang. Proyeksiya bilan duga har qanday holatda eng tor qoladi, ikkinchisi esa goh o'sadi, goh qisqaradi, chunki biz uni turli rakursdan ko'ramiz. To'g'ri chiziq va tekislik orasidagi burchak deb aynan eng kichigi olinadi, va u proyeksiyada erishiladi. Tekislikning qolgan barcha chiziqlari kattaroq burchak beradi. | On a still drawing the second arc seems smaller, and the hand reaches for it by itself. Rotate the scene and look again. The arc with the projection stays the narrowest at any position, while the second one grows and shrinks, because we see it from different views. The angle between a line and a plane is taken to be the smallest one, and it is reached on the projection. All the other lines of the plane give bigger angles. |
| `audio.work` | Посчитай сам. Сколько прямых плоскости дают наименьший угол с нашей прямой? | O'zingiz hisoblang. Tekislikning nechta chizig'i bizning chizig'imiz bilan eng kichik burchak beradi? | Work it out yourself. How many lines of the plane give the smallest angle with our line? |
| `work.prompt` | Сколько таких прямых? | Shunday chiziq nechta? | How many such lines? |
| `work.ok` | Одна, и это проекция. Остальные дают углы больше. | Bitta, va bu proyeksiya. Qolganlari kattaroq burchak beradi. | One, and it is the projection. The rest give bigger angles. |
| `work.hint.1` | Поверни сцену и посмотри, какая дуга остаётся узкой всегда. | Sahnani buring va qaysi duga doim tor qolishini ko'ring. | Rotate the scene and see which arc always stays narrow. |
| `work.hint.2` | Проекция у прямой одна. | To'g'ri chiziqning proyeksiyasi bitta. | A line has one projection. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `∠(a; a₁) < ∠(a; b)` |
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `ugol-ne-s-proekciey`

Крайние случаи со стр. 138.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | КРАЙНИЕ СЛУЧАИ | CHEGARA HOLLAR | THE EXTREME CASES |
| `title` | Девяносто и ноль | To'qson va nol | Ninety and zero |
| `show.1.1` | прямая встала перпендикулярно плоскости | to'g'ri chiziq tekislikka perpendikulyar bo'ldi | the line stood perpendicular to the plane |
| `show.1.2` | её проекция сжалась в точку | uning proyeksiyasi nuqtaga siqildi | its projection shrank to a point |
| `show.2.1` | теперь прямая параллельна плоскости | endi to'g'ri chiziq tekislikka parallel | now the line is parallel to the plane |
| `show.2.2` | проекция идёт рядом с ней | proyeksiya uning yonidan boradi | the projection runs beside it |
| `audio.mount` | Два случая, которые определением не покрываются, и учебник задаёт их отдельно. | Ta'rif qamramaydigan ikki hol, va darslik ularni alohida beradi. | Two cases the definition does not cover, and the textbook sets them separately. |
| `audio.move*` | Сначала прямая перпендикулярна плоскости. Её проекция сжалась в точку, и угол с проекцией уже не построить. Для этого случая угол считают равным девяноста градусам. Теперь прямая параллельна плоскости. Проекция идёт рядом с ней и никогда её не встретит, и угол в этом случае считают равным нулю. Оба соглашения записаны в учебнике на странице сто тридцать восемь, и оба согласованы с остальными углами. | Avval to'g'ri chiziq tekislikka perpendikulyar. Uning proyeksiyasi nuqtaga siqildi, va proyeksiya bilan burchakni qurib bo'lmaydi. Bu hol uchun burchak to'qson darajaga teng deb olinadi. Endi to'g'ri chiziq tekislikka parallel. Proyeksiya uning yonidan boradi va uni hech qachon uchratmaydi, va bu holda burchak nolga teng deb olinadi. Ikkala kelishuv ham darslikning bir yuz o'ttiz sakkizinchi betida yozilgan, va ikkalasi ham qolgan burchaklar bilan mos. | First the line is perpendicular to the plane. Its projection shrank to a point and the angle with the projection can no longer be built. For that case the angle is taken to be ninety degrees. Now the line is parallel to the plane. The projection runs beside it and will never meet it, and in that case the angle is taken to be zero. Both conventions are written in the textbook on page one hundred thirty eight, and both agree with the other angles. |
| `audio.work` | Посчитай сам. Сколько градусов в угле между плоскостью и перпендикулярной ей прямой? | O'zingiz hisoblang. Tekislik va unga perpendikulyar to'g'ri chiziq orasidagi burchak necha daraja? | Work it out yourself. How many degrees are in the angle between a plane and a line perpendicular to it? |
| `work.prompt` | Сколько градусов? | Necha daraja? | How many degrees? |
| `work.ok` | Девяносто. Проекция сжалась в точку, и это соглашение из учебника. | To'qson. Proyeksiya nuqtaga siqildi, va bu darslikdagi kelishuv. | Ninety. The projection shrank to a point, and this is the convention from the textbook. |
| `work.hint.1` | Посмотри, во что превратилась проекция. | Proyeksiya nimaga aylanganini ko'ring. | See what the projection has turned into. |
| `work.hint.2` | Перпендикуляр даёт прямой угол с каждой прямой плоскости. | Perpendikulyar tekislikning har bir chizig'i bilan to'g'ri burchak beradi. | A perpendicular gives a right angle with every line of the plane. |
| `work.hint.3` | Девяносто. | To'qson. | Ninety. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a ⊥ α   →   ∠(a; α) = 90°` |
| `work.answer` | `90` |

---

## Экран 6 · `explain4` · ответ `number` · тег `ugol-ne-s-proekciey`

Сам: диагональ грани куба и плоскость основания.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Диагональ грани и основание | Yoq diagonali va asos | A face diagonal and the base |
| `show.1.1` | в кубе взята диагональ боковой грани | kubda yon yoqning diagonali olingan | a diagonal of a side face is taken in the cube |
| `show.1.2` | её проекция это ребро основания | uning proyeksiyasi asos qirrasi | its projection is an edge of the base |
| `show.2.1` | поверни куб и посмотри на треугольник | kubni buring va uchburchakka qarang | rotate the cube and look at the triangle |
| `show.2.2` | два его катета равны | uning ikki kateti teng | its two legs are equal |
| `audio.mount` | Куб, и в нём диагональ боковой грани. Её проекция на плоскость основания это ребро. | Kub, va unda yon yoqning diagonali. Uning asos tekisligidagi proyeksiyasi qirra. | A cube, and in it a diagonal of a side face. Its projection on the plane of the base is an edge. |
| `audio.move*` | Диагональ, её проекция и боковое ребро дают прямоугольный треугольник. Прямой угол стоит там, где боковое ребро приходит в основание, и мы уже знаем почему. У куба все рёбра равны, значит два катета этого треугольника равны, а такой прямоугольный треугольник равнобедренный. Углы при его гипотенузе по сорок пять градусов. Поверни куб и убедись, что треугольник не разваливается ни при каком повороте. Угол посчитан, а не измерен с картинки. | Diagonal, uning proyeksiyasi va yon qirra to'g'ri burchakli uchburchak beradi. To'g'ri burchak yon qirra asosga kelgan joyda turadi, va nima uchun ekanini biz allaqachon bilamiz. Kubning barcha qirralari teng, demak bu uchburchakning ikki kateti teng, bunday to'g'ri burchakli uchburchak esa teng yonli. Uning gipotenuzasidagi burchaklar qirq besh daraja. Kubni buring va uchburchak hech qanday burilishda buzilmasligiga ishonch hosil qiling. Burchak hisoblangan, rasmdan o'lchanmagan. | The diagonal, its projection and the side edge give a right triangle. The right angle stands where the side edge arrives at the base, and we already know why. All edges of a cube are equal, so the two legs of that triangle are equal, and such a right triangle is isosceles. The angles at its hypotenuse are forty five degrees each. Rotate the cube and make sure the triangle does not fall apart at any rotation. The angle is computed, not measured off the picture. |
| `audio.work` | Посчитай сам. Сколько градусов между диагональю грани и плоскостью основания? | O'zingiz hisoblang. Yoq diagonali va asos tekisligi orasida necha daraja? | Work it out yourself. How many degrees are between the face diagonal and the plane of the base? |
| `work.prompt` | Сколько градусов? | Necha daraja? | How many degrees? |
| `work.ok` | Сорок пять. Катеты равны, треугольник равнобедренный. | Qirq besh. Katetlar teng, uchburchak teng yonli. | Forty five. The legs are equal, the triangle is isosceles. |
| `work.hint.1` | Найди прямоугольный треугольник с этой диагональю в гипотенузе. | Gipotenuzasida shu diagonal bo'lgan to'g'ri burchakli uchburchakni toping. | Find the right triangle with this diagonal as the hypotenuse. |
| `work.hint.2` | Боковое ребро и ребро основания у куба равны. | Kubning yon qirrasi va asos qirrasi teng. | The side edge and the base edge of a cube are equal. |
| `work.hint.3` | В равнобедренном прямоугольном треугольнике острые углы по сорок пять. | Teng yonli to'g'ri burchakli uchburchakda o'tkir burchaklar qirq beshtadan. | In an isosceles right triangle the acute angles are forty five each. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AB₁ ⊥̸ ABCD,   AB = BB₁` |
| `work.answer` | `45` |

---

## Экран 7 · `explain5` · ответ `number` · тег `odnoy-pryamoy-hvatit`

Граница: проекция сжалась в точку.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE BOUNDARY |
| `title` | Когда проекция это точка | Proyeksiya nuqta bo'lganda | When the projection is a point |
| `show.1.1` | прямая наклонена, проекция это отрезок | chiziq og'gan, proyeksiya kesma | the line is slanted, the projection is a segment |
| `show.1.2` | наклон уменьшается, проекция короче | og'ish kamayadi, proyeksiya qisqaradi | the slant decreases, the projection gets shorter |
| `show.2.1` | прямая встала вертикально | chiziq tik turdi | the line stood upright |
| `show.2.2` | проекция стала точкой | proyeksiya nuqtaga aylandi | the projection became a point |
| `audio.mount` | Прямая наклонена, и её проекция это отрезок в плоскости. | Chiziq og'gan, va uning proyeksiyasi tekislikdagi kesma. | The line is slanted, and its projection is a segment in the plane. |
| `audio.move*` | Проекция становится всё короче, и в момент, когда прямая перпендикулярна плоскости, она стягивается в одну точку. Это удобная проверка, и она работает в обе стороны. Если проекция прямой это точка, то прямая перпендикулярна плоскости. Если проекция это отрезок, то прямая наклонена, и угол с плоскостью меньше девяноста градусов. Заметь, что проверять углы со всеми прямыми плоскости не нужно, достаточно посмотреть на проекцию. | Proyeksiya tobora qisqaradi, va chiziq tekislikka perpendikulyar bo'lgan paytda u bitta nuqtaga yig'iladi. Bu qulay tekshiruv, va u ikki tomonga ishlaydi. Agar chiziqning proyeksiyasi nuqta bo'lsa, chiziq tekislikka perpendikulyar. Agar proyeksiya kesma bo'lsa, chiziq og'gan, va tekislik bilan burchak to'qson darajadan kichik. E'tibor bering, tekislikning barcha chiziqlari bilan burchakni tekshirish kerak emas, proyeksiyaga qarash yetarli. | The projection gets shorter and shorter, and at the moment the line is perpendicular to the plane it collapses into a single point. This is a handy check and it works both ways. If the projection of a line is a point, the line is perpendicular to the plane. If the projection is a segment, the line is slanted and the angle with the plane is less than ninety degrees. Note that there is no need to check the angles with all the lines of the plane, it is enough to look at the projection. |
| `audio.work` | Посчитай сам. Сколько точек в проекции прямой, перпендикулярной плоскости? | O'zingiz hisoblang. Tekislikka perpendikulyar to'g'ri chiziqning proyeksiyasida nechta nuqta bor? | Work it out yourself. How many points are in the projection of a line perpendicular to the plane? |
| `work.prompt` | Сколько точек в проекции? | Proyeksiyada nechta nuqta? | How many points are in the projection? |
| `work.ok` | Одна. Все перпендикуляры из точек прямой приходят в одну точку. | Bitta. Chiziq nuqtalaridan chiqqan barcha perpendikulyarlar bitta nuqtaga keladi. | One. All the perpendiculars from the points of the line arrive at one point. |
| `work.hint.1` | Посмотри, куда падают перпендикуляры из разных точек прямой. | Chiziqning turli nuqtalaridan perpendikulyarlar qayerga tushishini ko'ring. | See where the perpendiculars from different points of the line land. |
| `work.hint.2` | Сама прямая и есть перпендикуляр для каждой своей точки. | Chiziqning o'zi har bir nuqtasi uchun perpendikulyar. | The line itself is the perpendicular for each of its points. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `a ⊥ α   →   a₁ = A` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `ugol-ne-s-proekciey`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Определение и два соглашения | Ta'rif va ikki kelishuv | The definition and two conventions |
| `probe.question` | С какой прямой плоскости берут угол? | Tekislikning qaysi chizig'i bilan burchak olinadi? | With which line of the plane is the angle taken? |
| `probe.a` [верно] | с проекцией | proyeksiya bilan | with the projection |
| `probe.b` | с любой прямой через точку пересечения | kesishish nuqtasi orqali o'tuvchi istalgan chiziq bilan | with any line through the crossing point |
| `probe.b.hint` | Таких прямых бесконечно много, и углы у них разные. | Bunday chiziqlar cheksiz ko'p, va ularning burchaklari boshqa-boshqa. | There are infinitely many such lines and their angles differ. |
| `rule.lawLabel` | Угол прямой и плоскости | Chiziq va tekislik burchagi | The angle of a line and a plane |
| `rule.lines.1` | это угол между прямой и её проекцией на эту плоскость | bu chiziq va uning shu tekislikdagi proyeksiyasi orasidagi burchak | it is the angle between the line and its projection on that plane |
| `rule.lines.2` | если прямая перпендикулярна плоскости, угол считают равным девяноста градусам | agar chiziq tekislikka perpendikulyar bo'lsa, burchak to'qson daraja deb olinadi | if the line is perpendicular to the plane, the angle is taken as ninety degrees |
| `rule.lines.3` | если прямая параллельна плоскости, угол считают равным нулю | agar chiziq tekislikka parallel bo'lsa, burchak nol deb olinadi | if the line is parallel to the plane, the angle is taken as zero |
| `audio.mount` | Один вопрос на различение, потом карточка. | Farqlashga bitta savol, keyin kartochka. | One question to tell them apart, then the card. |
| `audio.rule*` | Определение короткое, и вся его сила в слове проекция. Проекция у прямой одна, поэтому и угол один. Возьми любую другую прямую плоскости, и угол получится больше, а значит это будет угол с прямой, а не с плоскостью. Два крайних случая дописаны отдельно, потому что в них проекции в обычном смысле нет. Перпендикулярная прямая даёт девяносто, параллельная ноль. | Ta'rif qisqa, va uning butun kuchi proyeksiya so'zida. Chiziqning proyeksiyasi bitta, shuning uchun burchak ham bitta. Tekislikning boshqa istalgan chizig'ini olsangiz, burchak kattaroq chiqadi, ya'ni bu chiziq bilan burchak bo'ladi, tekislik bilan emas. Ikki chegara hol alohida yozilgan, chunki ularda oddiy ma'nodagi proyeksiya yo'q. Perpendikulyar chiziq to'qson beradi, parallel esa nol. | The definition is short and all its force is in the word projection. A line has one projection, so the angle is one too. Take any other line of the plane and the angle comes out bigger, which means it is an angle with a line and not with the plane. The two extreme cases are written separately, because in them there is no projection in the usual sense. A perpendicular line gives ninety, a parallel one gives zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `∠(a; α) = ∠(a; a₁)` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `ugol-ne-s-proekciey`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | AMALIYOT | PRACTICE |
| `title` | Прямые куба и основание | Kub chiziqlari va asos | Lines of the cube and the base |
| `match.prompt` | Соедини прямую с её углом к основанию | Chiziqni asosga burchagi bilan birlashtiring | Match the line with its angle to the base |
| `match.ok` | Все четыре на месте. Углы посчитаны, а не измерены. | To'rttasi ham joyida. Burchaklar hisoblangan, o'lchanmagan. | All four in place. The angles are computed, not measured. |
| `audio.mount` | Четыре прямые куба и четыре угла. Соедини их. | Kubning to'rt chizig'i va to'rt burchak. Ularni birlashtiring. | Four lines of the cube and four angles. Match them. |
| `match.a` | ноль градусов | nol daraja | zero degrees |
| `match.b` | девяносто градусов | to'qson daraja | ninety degrees |
| `match.c` | сорок пять градусов | qirq besh daraja | forty five degrees |
| `match.d` | меньше сорока пяти | qirq beshdan kichik | less than forty five |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `AB` · `AA₁` · `AB₁` · `AC₁` |

---

## Экран 10 · `guided` · ответ `order` · формат `proof` · тег `ugol-ne-s-proekciey`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Найди проекцию диагонали | Diagonalning proyeksiyasini toping | Find the projection of the diagonal |
| `proof.given` | диагональ куба и плоскость основания | kub diagonali va asos tekisligi | a diagonal of a cube and the plane of the base |
| `proof.goal` | её проекция это диагональ основания | uning proyeksiyasi asos diagonali | its projection is a diagonal of the base |
| `proof.r1` | боковое ребро перпендикулярно основанию | yon qirra asosga perpendikulyar | the side edge is perpendicular to the base |
| `proof.r2` | значит основание перпендикуляра это вершина основания | demak perpendikulyarning asosi asos uchi | so the foot of the perpendicular is a vertex of the base |
| `proof.r3` | проекция отрезка это отрезок между проекциями концов | kesmaning proyeksiyasi uchlari proyeksiyalari orasidagi kesma | the projection of a segment is the segment between the projections of its ends |
| `proof.ok` | Доказано. Проекция диагонали куба это диагональ основания. | Isbotlandi. Kub diagonalining proyeksiyasi asos diagonali. | Proved. The projection of the cube diagonal is a diagonal of the base. |
| `proof.e1` | Определение проекции идёт дальше. Откуда взят прямой угол. | Proyeksiya ta'rifi keyin keladi. To'g'ri burchak qayerdan olingan. | The definition of projection comes later. Where does the right angle come from. |
| `proof.e2` | Прямой угол уже есть. Речь о точке, куда он приходит. | To'g'ri burchak bor. Gap u kelgan nuqta haqida. | The right angle is already there. This is about the point it arrives at. |
| `proof.e3` | Про концы сказано. Теперь про весь отрезок. | Uchlari haqida aytildi. Endi butun kesma haqida. | The ends are done. Now about the whole segment. |
| `reason.s1` | по построению куба | kub yasalishiga ko'ra | by the construction of the cube |
| `reason.s2` | определение проекции | proyeksiya ta'rifi | the definition of projection |
| `reason.s3` | проекция отрезка | kesmaning proyeksiyasi | the projection of a segment |
| `reason.pic` | видно на чертеже | chizmada ko'rinadi | it is visible on the drawing |
| `reason.pic.missing` | Чертёж не обоснование. Он показывает один ракурс из многих. | Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi. | A drawing is not a justification. It shows one view out of many. |
| `audio.mount` | Три строки, и у каждой своё обоснование из списка. | Uch qator, va har birining ro'yxatdan o'z asoslashi bor. | Three lines, and each has its own justification from the list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `AC₁ → AC` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO TOOL |
| `title` | Счёт и порядок | Hisob va tartib | Counting and order |
| `task.ok` | Сорок пять. Перпендикуляр и проекция равны, треугольник равнобедренный. | Qirq besh. Perpendikulyar va proyeksiya teng, uchburchak teng yonli. | Forty five. The perpendicular and the projection are equal, the triangle is isosceles. |
| `task.hint.1` | Нарисуй прямоугольный треугольник и подпиши катеты. | To'g'ri burchakli uchburchak chizing va katetlarni imzolang. | Draw a right triangle and label the legs. |
| `task.hint.2` | Тангенс угла это перпендикуляр, делённый на проекцию. | Burchak tangensi perpendikulyarning proyeksiyaga bo'lingani. | The tangent of the angle is the perpendicular divided by the projection. |
| `task.hint.3` | Тангенс равен единице, значит угол сорок пять. | Tangens birga teng, demak burchak qirq besh. | The tangent is one, so the angle is forty five. |
| `order.prompt` | Расставь записи в том порядке, в каком их получают | Yozuvlarni olinish tartibida joylashtiring | Arrange the readings in the order they are obtained |
| `order.title` | Порядок работы | Ish tartibi | The order of work |
| `order.ok` | Порядок верный. Проекция строится до угла, а не после. | Tartib to'g'ri. Proyeksiya burchakdan oldin quriladi, keyin emas. | The order is right. The projection is built before the angle, not after. |
| `order.bad` | Не в этом порядке. Что нужно знать раньше. | Bu tartibda emas. Avval nimani bilish kerak. | Not in this order. What has to be known first. |
| `audio.mount` | Прибор убран. Здесь считают на бумаге. | Asbob olib qo'yildi. Bu yerda qog'ozda hisoblanadi. | The tool is put away. Here you count on paper. |
| `audio.next` | Теперь порядок записей. Расставь их так, как их получают. | Endi yozuvlar tartibi. Ularni qanday olinsa, shunday joylashtiring. | Now the order of the readings. Arrange them the way they are obtained. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `AB = 7,   BC = 7,   ∠(AC; α) = ?` |
| `task.answer` | `45` |
| `order.items` | `∠(a; α)` · `a ∩ α = A` · `a₁ ⊂ α` · `∠(a; a₁)` |
| `order.answer` | `a ∩ α = A  a₁ ⊂ α  ∠(a; a₁)  ∠(a; α)` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xato qatorni toping | Find the line with the mistake |
| `hint.r1` | Условие переписано верно. | Shart to'g'ri ko'chirilgan. | The condition is copied correctly. |
| `hint.r2` | Прямая в плоскости взята, и это пока не ошибка. | Tekislikda chiziq olingan, va bu hozircha xato emas. | A line in the plane is taken, and that is not a mistake yet. |
| `hint.r4` | Вывод получен из неверной строки выше. | Xulosa yuqoridagi xato qatordan olingan. | The conclusion comes from the wrong line above. |
| `proof` | Поверни сцену: дуга с этой прямой то растёт, то сжимается, а с проекцией нет. | Sahnani buring: bu chiziq bilan duga goh o'sadi, goh qisqaradi, proyeksiya bilan esa yo'q. | Rotate the scene: the arc with this line grows and shrinks, the one with the projection does not. |
| `entry.prompt` | Номер строки с ошибкой | Xato qator raqami | The number of the line with the mistake |
| `entry.ok` | Третья. Углом с плоскостью назвали угол с прямой этой плоскости. | Uchinchi. Tekislik bilan burchak deb shu tekislik chizig'i bilan burchak aytilgan. | The third. The angle with a line of the plane was called the angle with the plane. |
| `entry.hint.1` | Проверь, с чем берут угол в каждой строке. | Har qatorda burchak nima bilan olinayotganini tekshiring. | Check what the angle is taken with in each line. |
| `entry.hint.2` | Проекция в этом доказательстве не появилась ни разу. | Bu isbotda proyeksiya biror marta ham paydo bo'lmadi. | The projection never appeared in this proof. |
| `entry.hint.3` | Ошибка в третьей строке. | Xato uchinchi qatorda. | The mistake is in the third line. |
| `audio.mount` | Четыре строки, и одна из них подменяет угол. | To'rt qator, va ulardan biri burchakni almashtiradi. | Four lines, and one of them substitutes the angle. |
| `audio.next` | Теперь напиши номер строки, в которой ошибка. | Endi xato bo'lgan qator raqamini yozing. | Now write the number of the line with the mistake. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `a ∩ α = A` |
| `row.r2` | `b ⊂ α,   A ∈ b` |
| `row.r3` | `∠(a; α) = ∠(a; b)` |
| `row.r4` | `∠(a; α) = 30°` |
| `answerId` | `r3` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | В обратную сторону | Teskari tomonga | The other way round |
| `place.prompt` | Угол между прямой и плоскостью равен нулю. Сколько общих точек у них? | To'g'ri chiziq va tekislik orasidagi burchak nolga teng. Ularning nechta umumiy nuqtasi bor? | The angle between a line and a plane is zero. How many common points do they have? |
| `place.ok` | Ни одной. Нулевой угол это параллельность, а параллельная прямая плоскость не встречает. | Bitta ham yo'q. Nol burchak parallellik, parallel chiziq esa tekislikni uchratmaydi. | None. A zero angle means parallel, and a parallel line does not meet the plane. |
| `place.wrong` | Посмотри на второе соглашение в карточке. | Kartochkadagi ikkinchi kelishuvga qarang. | Look at the second convention on the card. |
| `multi.prompt` | Отметь все верные записи | Barcha to'g'ri yozuvlarni belgilang | Mark all the correct readings |
| `multi.title` | Что верно всегда | Nima doim to'g'ri | What is always true |
| `multi.d.hint` | Это угол с прямой плоскости, а не с плоскостью. | Bu tekislik chizig'i bilan burchak, tekislik bilan emas. | That is an angle with a line of the plane, not with the plane. |
| `multi.e.hint` | Угол с плоскостью не бывает больше девяноста градусов. | Tekislik bilan burchak to'qson darajadan katta bo'lmaydi. | An angle with a plane is never more than ninety degrees. |
| `multi.ok` | Три записи из пяти. Две оставшиеся ломаются на слове проекция. | Beshtadan uch yozuv. Qolgan ikkitasi proyeksiya so'zida sinadi. | Three readings out of five. The other two break at the word projection. |
| `audio.mount` | Прочитаем определение справа налево. По углу назовём положение прямой. | Ta'rifni o'ngdan chapga o'qiymiz. Burchak bo'yicha chiziqning holatini aytamiz. | Let us read the definition from right to left. From the angle we name the position of the line. |
| `audio.work` | Отметь все записи, которые верны всегда. Их больше одной. | Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p. | Mark all the readings that are always true. There is more than one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `0` |
| `place.step` | `∠(a; α) = 0°   →   a ∥ α` |
| `multi.a` [верно] | `∠(a; α) ≤ 90°` |
| `multi.b` [верно] | `∠(a; α) = ∠(a; a₁)` |
| `multi.c` [верно] | `a ⊥ α   →   ∠(a; α) = 90°` |
| `multi.d` | `∠(a; α) = ∠(a; b)` |
| `multi.e` | `∠(a; α) = 120°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `ugol-ne-s-proekciey`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | С чем берут угол? | Burchak nima bilan olinadi? | What is the angle taken with? |
| `q1.a` [верно] | с проекцией | proyeksiya bilan | with the projection |
| `q1.b` | с перпендикуляром | perpendikulyar bilan | with the perpendicular |
| `q1.b.hint` | С перпендикуляром угол всегда прямой, и он ничего не различает. | Perpendikulyar bilan burchak doim to'g'ri, va u hech narsani ajratmaydi. | With the perpendicular the angle is always right and tells nothing apart. |
| `q1.c` | с любой прямой плоскости | tekislikning istalgan chizig'i bilan | with any line of the plane |
| `q1.c.hint` | Таких прямых бесконечно много, и углы разные. | Bunday chiziqlar cheksiz ko'p, va burchaklar boshqa-boshqa. | There are infinitely many such lines and the angles differ. |
| `q1.d` | с ребром основания | asos qirrasi bilan | with the edge of the base |
| `q1.d.hint` | Ребро это одна из прямых плоскости, не более. | Qirra tekislik chiziqlaridan biri, boshqa emas. | An edge is one of the lines of the plane, no more. |
| `q2.prompt` | Прямая перпендикулярна плоскости. Угол? | Chiziq tekislikka perpendikulyar. Burchak? | The line is perpendicular to the plane. The angle? |
| `q2.a` [верно] | девяносто | to'qson | ninety |
| `q2.b` | ноль | nol | zero |
| `q2.b.hint` | Ноль у параллельной. | Nol parallelda. | Zero belongs to a parallel line. |
| `q2.c` | сорок пять | qirq besh | forty five |
| `q2.c.hint` | Это число ниоткуда не следует. | Bu son hech qayerdan chiqmaydi. | That number follows from nothing. |
| `q2.d` | угол не определён | burchak aniqlanmagan | the angle is undefined |
| `q2.d.hint` | Для этого случая учебник даёт отдельное соглашение. | Bu hol uchun darslik alohida kelishuv beradi. | For this case the textbook gives a separate convention. |
| `q3.prompt` | Проекция прямой это точка. Что с прямой? | Chiziqning proyeksiyasi nuqta. Chiziq qanday? | The projection of a line is a point. What about the line? |
| `q3.a` [верно] | перпендикулярна плоскости | tekislikka perpendikulyar | perpendicular to the plane |
| `q3.b` | параллельна плоскости | tekislikka parallel | parallel to the plane |
| `q3.b.hint` | У параллельной проекция это прямая, а не точка. | Parallelda proyeksiya chiziq, nuqta emas. | For a parallel line the projection is a line, not a point. |
| `q3.c` | лежит в плоскости | tekislikda yotadi | lies in the plane |
| `q3.c.hint` | Тогда проекция совпала бы с самой прямой. | Unda proyeksiya chiziqning o'zi bilan ustma-ust tushardi. | Then the projection would coincide with the line itself. |
| `q3.d` | наклонена под сорок пять | qirq besh ostida og'gan | slanted at forty five |
| `q3.d.hint` | У наклонной проекция это отрезок. | Og'mada proyeksiya kesma. | For a slanted line the projection is a segment. |
| `q4.prompt` | Диагональ грани куба и основание. Угол? | Kub yoqining diagonali va asos. Burchak? | A face diagonal of a cube and the base. The angle? |
| `q4.a` [верно] | сорок пять | qirq besh | forty five |
| `q4.b` | тридцать | o'ttiz | thirty |
| `q4.b.hint` | Тридцать вышло бы при катетах один и два. | O'ttiz katetlar bir va ikki bo'lganda chiqardi. | Thirty would come from legs one and two. |
| `q4.c` | шестьдесят | oltmish | sixty |
| `q4.c.hint` | Шестьдесят это угол при другом отношении катетов. | Oltmish katetlarning boshqa nisbatidagi burchak. | Sixty belongs to a different ratio of legs. |
| `q4.d` | девяносто | to'qson | ninety |
| `q4.d.hint` | Девяносто было бы у бокового ребра. | To'qson yon qirrada bo'lardi. | Ninety would belong to the side edge. |
| `audio.mount` | Четыре вопроса подряд. Отвечай без остановки. | Ketma-ket to'rt savol. To'xtamasdan javob bering. | Four questions in a row. Answer without stopping. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `∠(a; a₁)` |
| `q2.done` | `90°` |
| `q3.done` | `a₁ = A` |
| `q4.done` | `45°` |
| `angles` | `AB` · `AA₁` · `AB₁` · `AC₁` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nimani bilasiz | What you can do now |
| `can.1` | Строю проекцию прямой на плоскость | Chiziqning tekislikdagi proyeksiyasini quraman | I build the projection of a line on a plane |
| `can.2` | Беру угол с проекцией, а не с удобной прямой | Burchakni proyeksiya bilan olaman, qulay chiziq bilan emas | I take the angle with the projection, not with a convenient line |
| `can.3` | Знаю два крайних случая | Ikki chegara holni bilaman | I know the two extreme cases |
| `can.4` | Считаю угол, а не измеряю с картинки | Burchakni hisoblayman, rasmdan o'lchamayman | I compute the angle instead of measuring it off the picture |
| `levels.full` | Все четыре | To'rttasi ham | All four |
| `levels.gap` | Три из четырёх | To'rttadan uchtasi | Three out of four |
| `levels.back` | Меньше трёх | Uchtadan kam | Fewer than three |
| `bridge` | Дальше два угла между плоскостями — двугранный угол и его линейный угол | Bundan keyin tekisliklar orasidagi burchak, ikki yoqli burchak va uning chiziqli burchagi | Next comes the angle between planes, the dihedral angle and its linear angle |
| `lifehack` | Не знаешь, с чем мерить угол — строй проекцию | Burchakni nima bilan o'lchashni bilmasangiz, proyeksiya quring | If you do not know what to measure the angle with, build the projection |
| `sheetTitle` | Шпаргалка | Shpargalka | Cheat sheet |
| `sheetSrc` | Геометрия, страница сто тридцать восемь | Geometriya, bir yuz o'ttiz sakkizinchi bet | Geometry, page one hundred thirty eight |
| `audio.mount` | Урок начался с двух записей. В первой угол брали с любой прямой плоскости. | Dars ikki yozuv bilan boshlandi. Birinchisida burchak tekislikning istalgan chizig'i bilan olingan edi. | The lesson began with two readings. In the first the angle was taken with any line of the plane. |
| `audio.next` | Таких прямых бесконечно много, и каждая давала бы свой угол, значит определение было бы пустым. Проекция у прямой одна, и угол с ней наименьший. Поэтому именно она стоит в определении. Дальше нам понадобится угол между двумя плоскостями, и там мерить будем не прямые, а полуплоскости. | Bunday chiziqlar cheksiz ko'p, va har biri o'z burchagini berardi, ya'ni ta'rif bo'sh bo'lardi. Chiziqning proyeksiyasi bitta, va u bilan burchak eng kichik. Shuning uchun ta'rifda aynan u turadi. Keyin bizga ikki tekislik orasidagi burchak kerak bo'ladi, va u yerda chiziqlarni emas, yarimtekisliklarni o'lchaymiz. | There are infinitely many such lines and each would give its own angle, which means the definition would be empty. A line has one projection and the angle with it is the smallest. That is why it stands in the definition. Next we will need the angle between two planes, and there we will measure half-planes instead of lines. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `∠(a; b),   b ⊂ α` |
| `hook.b` | `∠(a; a₁)` |
| `proved` | `∠(a; α) = ∠(a; a₁)` |
| `law` | `a ∩ α = A,   a₁ ⊂ α` |
| `sheet.1` | `a₁ ⊂ α` |
| `sheet.2` | `∠(a; α) = ∠(a; a₁)` |
| `sheet.3` | `∠(a; a₁) < ∠(a; b)` |
| `sheet.4` | `a ⊥ α   →   90°` |
| `sheet.5` | `a ∥ α   →   0°` |
