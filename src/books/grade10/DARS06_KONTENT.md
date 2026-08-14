# Урок 6 — Графики · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS04_KONTENT.md` и `DARS05_KONTENT.md`.

Скелет: `DARS04_06_SKELET.md` §8. Опора в учебнике: алгебра 2022, стр. 135–137 (`D(y)`, `E(y)`,
рисунки 2 и 3, выводы о промежутках возрастания и убывания).

**Что этот урок вводит первым в классе:** «функция от числа» и «график функции». Слово «четверть»
введено уроком 4, «отрицательный поворот» — уроком 5.

**Главное решение урока.** График не рисуется по точкам из таблицы: он **разворачивается** из
окружности. Высота точки переносится вправо по оси времени и чертит кривую. Поэтому амплитуда
графика на экране ровно равна радиусу окружности — иначе «волна не выходит из полосы» нечем
проверить.

**Косинус строится тем же построением, только счёт начат на четверть оборота раньше**
(`from = 90`). Никакого второго построения и никакого поворота чертежа: переносится всегда высота.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАФИК | GRAFIK | THE GRAPH |
| `title` | Что общего у круга и волны? | Aylana bilan to'lqinda nima umumiy? | What do a circle and a wave share? |
| `row.a.name` | это разные темы | bular boshqa-boshqa temalar | these are separate topics |
| `row.b.name` | это одна и та же точка | bu aynan bitta nuqta | this is one and the same point |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас развернём круг и посмотрим. | Javobingiz yozib olindi. Endi aylanani yoyib ko'ramiz. | Your answer is saved. Now we will unroll the circle and see. |
| `audio.mount*` | Слева круг, справа пустая ось времени. Точка идёт по кругу, и её высота уезжает вправо. | Chapda aylana, o'ngda bo'sh vaqt o'qi. Nuqta aylana bo'ylab yuradi, balandligi esa o'ngga suriladi. | On the left a circle, on the right an empty time axis. The point goes round, and its height moves to the right. |
| `audio.r1` | Первая запись говорит, что круг и волна это разные темы. | Birinchi yozuv aylana va to'lqin boshqa-boshqa temalar deydi. | The first reading says the circle and the wave are separate topics. |
| `audio.r2` | Вторая говорит, что это одна и та же точка. | Ikkinchisi bu aynan bitta nuqta deydi. | The second says it is one and the same point. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `y = sin α` |
| `row.a.value` | `(x; y)  ≠  y = sin α` |
| `row.b.value` | `(x; y)  →  y = sin α` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед развёрткой | Yoyishdan oldin uch savol | Three questions before unrolling |
| `q1.prompt` | Что такое высота точки? | Nuqtaning balandligi nima? | What is the height of a point? |
| `q1.a` [верно] | синус угла | burchakning sinusi | the sine of the angle |
| `q1.b` | косинус угла | burchakning kosinusi | the cosine of the angle |
| `q1.b.hint` | Косинус это сдвиг, первое число пары. | Kosinus bu siljish, juftlikning birinchi soni. | The cosine is the shift, the first number of the pair. |
| `q1.c` | радиус | radius | the radius |
| `q1.c.hint` | Радиус всегда равен единице и не меняется. | Radius doim birga teng va o'zgarmaydi. | The radius is always one and does not change. |
| `q1.d` | угол | burchak | the angle |
| `q1.d.hint` | Угол задаёт точку, а высота это её координата. | Burchak nuqtani beradi, balandlik esa uning koordinatasi. | The angle fixes the point, the height is its coordinate. |
| `q2.prompt` | Через сколько градусов точка возвращается на место? | Nuqta necha gradusdan keyin joyiga qaytadi? | After how many degrees does the point return to its place? |
| `q2.a` [верно] | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q2.b` | сто восемьдесят | yuz sakson | one hundred eighty |
| `q2.b.hint` | Через сто восемьдесят точка окажется напротив, а не на месте. | Yuz saksondan keyin nuqta qarshi tomonda bo'ladi, joyida emas. | After one hundred eighty the point ends up opposite, not in place. |
| `q2.c` | девяносто | to'qson | ninety |
| `q2.c.hint` | Девяносто это четверть пути. | To'qson bu yo'lning choragi. | Ninety is a quarter of the way. |
| `q2.d` | не возвращается | qaytmaydi | it does not return |
| `q2.d.hint` | Возвращается: это и был прошлый урок. | Qaytadi: o'tgan dars aynan shu haqda edi. | It does return: that was the previous lesson. |
| `q3.prompt` | Каким может быть синус по величине? | Sinus kattaligi bo'yicha qanday bo'la oladi? | How large can the sine be? |
| `q3.a` [верно] | не больше единицы | birdan katta emas | no more than one |
| `q3.b` | любым | har qanday | anything |
| `q3.b.hint` | Точка лежит на окружности радиуса один и дальше уйти не может. | Nuqta radiusi bir bo'lgan aylanada va uzoqroqqa chiqa olmaydi. | The point lies on the circle of radius one and cannot go further. |
| `q3.c` | не больше двух | ikkidan katta emas | no more than two |
| `q3.c.hint` | Граница это радиус, а он равен единице. | Chegara bu radius, u esa birga teng. | The bound is the radius, and it equals one. |
| `q3.d` | только положительным | faqat musbat | only positive |
| `q3.d.hint` | Ниже оси высота отрицательна, это было на четвёртом уроке. | O'qdan pastda balandlik manfiy, bu to'rtinchi darsda edi. | Below the axis the height is negative, that was in lesson four. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `y = sin α` |
| `q2.done` | `360°` |
| `q3.done` | `−1 ≤ sin α ≤ 1` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `grafik-bez-kruga`

Свидетель урока. Кривая не берётся из таблицы: её **чертит сама точка**.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Круг разворачивается в волну | Aylana to'lqinga yoyiladi | The circle unrolls into a wave |
| `show.1.1` | слева круг, справа ось времени | chapda aylana, o'ngda vaqt o'qi | a circle on the left, a time axis on the right |
| `show.1.2` | переносится высота точки | nuqtaning balandligi ko'chiriladi | the height of the point is carried over |
| `show.2.1` | точка идёт, кривая растёт за ней | nuqta yuradi, egri chiziq ortidan o'sadi | the point goes, the curve grows behind it |
| `show.2.2` | это и есть график | grafik shu | that is the graph |
| `audio.mount` | Слева круг, справа ось времени. Пока на ней ничего нет. | Chapda aylana, o'ngda vaqt o'qi. Unda hozircha hech narsa yo'q. | On the left a circle, on the right a time axis. Nothing on it yet. |
| `audio.roll*` | Точка идёт по кругу, а её высота переносится вправо. Смотри: кривую чертит не рука, а сама точка. | Nuqta aylana bo'ylab yuradi, balandligi esa o'ngga ko'chiriladi. Qarang: egri chiziqni qo'l emas, nuqtaning o'zi chizadi. | The point goes round, and its height is carried to the right. Watch: the curve is drawn not by a hand but by the point itself. |
| `audio.work` | Теперь сам. Поставь точку туда, где кривая поднимается выше всего. | Endi o'zingiz. Egri chiziq eng baland ko'tariladigan joyga nuqta qo'ying. | Now you. Place the point where the curve rises highest. |
| `work.prompt` | Поставь точку туда, где кривая выше всего. | Egri chiziq eng baland joyga nuqta qo'ying. | Place the point where the curve is highest. |
| `work.ok` | Это самый верх круга, девяносто градусов. Там высота наибольшая, и у волны там вершина. | Bu aylananing eng tepasi, to'qson gradus. U yerda balandlik eng katta, to'lqinda esa cho'qqi. | That is the very top of the circle, ninety degrees. The height is largest there, and the wave has its peak. |
| `work.hint.1` | Кривая повторяет высоту точки. Где высота больше всего? | Egri chiziq nuqtaning balandligini takrorlaydi. Balandlik qayerda eng katta? | The curve repeats the height of the point. Where is the height largest? |
| `work.hint.2` | Справа и слева высота равна нулю, значит вершина не там. | O'ngda va chapda balandlik nolga teng, demak cho'qqi u yerda emas. | On the right and left the height is zero, so the peak is not there. |
| `work.hint.3` | Нужен самый верх круга. | Aylananing eng tepasi kerak. | You need the very top of the circle. |

---

## Экран 4 · `explain2` · ответ `lead` · тег `grafik-bez-kruga`

Соответствие участков: где точка выше оси — там кривая выше нуля. Читается в обе стороны.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Верх круга — верх волны | Aylananing tepasi to'lqinning tepasi | The top of the circle is the top of the wave |
| `show.1.1` | точка выше оси | nuqta o'qdan yuqorida | the point is above the axis |
| `show.1.2` | кривая выше нуля | egri chiziq noldan yuqorida | the curve is above zero |
| `show.2.1` | точка ушла ниже оси | nuqta o'qdan pastga tushdi | the point went below the axis |
| `show.2.2` | кривая ушла под ноль | egri chiziq nol ostiga tushdi | the curve went below zero |
| `audio.mount` | Первую половину пути точка идёт выше оси, и кривая всё это время выше нуля. | Yo'lning birinchi yarmida nuqta o'qdan yuqorida yuradi, va egri chiziq shu vaqt davomida noldan yuqorida. | For the first half of the way the point goes above the axis, and the curve stays above zero all that time. |
| `audio.under*` | Теперь точка уходит ниже оси, и кривая идёт под ноль. Знак высоты и знак кривой это одно и то же. | Endi nuqta o'qdan pastga ketadi, va egri chiziq nol ostiga tushadi. Balandlikning ishorasi va egri chiziqning ishorasi bir narsa. | Now the point goes below the axis, and the curve goes below zero. The sign of the height and the sign of the curve are one and the same. |
| `audio.work` | Теперь сам. Поставь точку туда, где кривая опускается ниже всего. | Endi o'zingiz. Egri chiziq eng past tushadigan joyga nuqta qo'ying. | Now you. Place the point where the curve dips lowest. |
| `work.prompt` | Поставь точку туда, где кривая ниже всего. | Egri chiziq eng past joyga nuqta qo'ying. | Place the point where the curve is lowest. |
| `work.ok` | Это самый низ круга. Высота там наибольшая по величине и направлена вниз, у волны там впадина. | Bu aylananing eng pasti. Balandlik u yerda kattaligi bo'yicha eng katta va pastga qaragan, to'lqinda esa chuqurlik. | That is the very bottom of the circle. The height there is largest in size and points down, and the wave has its trough. |
| `work.hint.1` | Ниже всего кривая там, где высота точки самая отрицательная. | Egri chiziq nuqtaning balandligi eng manfiy joyda eng past bo'ladi. | The curve is lowest where the height of the point is most negative. |
| `work.hint.2` | Это не сбоку: сбоку высота равна нулю. | Bu yon tomonda emas: yon tomonda balandlik nolga teng. | Not on the side: on the side the height is zero. |
| `work.hint.3` | Нужен самый низ круга. | Aylananing eng pasti kerak. | You need the very bottom of the circle. |

---

## Экран 5 · `explain3` · ответ `lead` · тег `grafik-bez-kruga`

Косинус получается **тем же построением**, только счёт начат на четверть оборота раньше. Второго
построения нет, и поворачивать чертёж не надо.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Косинус — та же волна | Kosinus o'sha to'lqin | The cosine is the same wave |
| `show.1.1` | счёт начат на четверть оборота раньше | sanoq chorak aylana oldin boshlangan | the count starts a quarter turn earlier |
| `show.1.2` | построение то же самое | qurilish o'sha-o'sha | the construction is the same |
| `show.2.1` | волна вышла сдвинутой | to'lqin surilgan chiqdi | the wave came out shifted |
| `show.2.2` | форма у неё та же | shakli esa o'sha | its shape is the same |
| `audio.mount` | Начало счёта теперь наверху. Всё остальное как было. | Sanoqning boshi endi tepada. Qolgani o'sha. | The start of the count is now at the top. Everything else stays as it was. |
| `audio.roll*` | Точка идёт по тому же кругу, и высота так же уезжает вправо. Кривая получается сдвинутой, но форма у неё та же. | Nuqta o'sha aylana bo'ylab yuradi, balandlik ham xuddi shunday o'ngga suriladi. Egri chiziq surilgan chiqadi, lekin shakli o'sha. | The point goes round the same circle, and the height moves right the same way. The curve comes out shifted, but its shape is the same. |
| `audio.work` | Теперь сам. Поставь точку туда, откуда начинается счёт у косинуса. | Endi o'zingiz. Kosinusda sanoq boshlanadigan joyga nuqta qo'ying. | Now you. Place the point where the cosine starts its count. |
| `work.prompt` | Поставь точку туда, откуда начинается счёт у косинуса. | Kosinusda sanoq boshlanadigan joyga nuqta qo'ying. | Place the point where the cosine starts its count. |
| `work.ok` | Наверху. Оттуда высота равна единице, и волна косинуса начинается с единицы, а не с нуля. | Tepada. U yerdan balandlik birga teng, va kosinus to'lqini noldan emas, birdan boshlanadi. | At the top. From there the height equals one, and the cosine wave starts at one, not at zero. |
| `work.hint.1` | Волна косинуса начинается с наибольшего значения. | Kosinus to'lqini eng katta qiymatdan boshlanadi. | The cosine wave starts at the largest value. |
| `work.hint.2` | Значит и точка должна стоять там, где высота наибольшая. | Demak nuqta ham balandlik eng katta bo'lgan joyda turishi kerak. | So the point must stand where the height is largest. |
| `work.hint.3` | Нужен самый верх круга. | Aylananing eng tepasi kerak. | You need the very top of the circle. |

---

## Экран 6 · `explain4` · ответ `lead` · тег `period-bez-vozvrata`

Период на графике — это длина одной волны. То же самое возвращение, только записанное во времени.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Период — длина одной волны | Davr bitta to'lqinning uzunligi | The period is the length of one wave |
| `show.1.1` | точка вернулась на место | nuqta joyiga qaytdi | the point returned to its place |
| `show.1.2` | волна замкнулась | to'lqin yopildi | the wave closed |
| `show.2.1` | дальше всё повторится | keyin hammasi takrorlanadi | from here on it all repeats |
| `audio.mount` | Точка прошла полный оборот и вернулась на место. На графике этому отвечает одна законченная волна. | Nuqta to'liq aylanani bosib o'tdi va joyiga qaytdi. Grafikda bunga bitta tugagan to'lqin mos keladi. | The point completed a full turn and returned to its place. On the graph that matches one finished wave. |
| `audio.mark*` | Длина этой волны и есть период. Дальше точка пойдёт по тому же кругу, и волна повторится точь-в-точь. | Shu to'lqinning uzunligi davr bo'ladi. Keyin nuqta o'sha aylana bo'ylab yuradi, va to'lqin aynan takrorlanadi. | The length of that wave is the period. Next the point will go round the same circle, and the wave will repeat exactly. |
| `audio.work` | Теперь сам. Поставь точку туда, где волна замыкается. | Endi o'zingiz. To'lqin yopiladigan joyga nuqta qo'ying. | Now you. Place the point where the wave closes. |
| `work.prompt` | Поставь точку туда, где волна замыкается. | To'lqin yopiladigan joyga nuqta qo'ying. | Place the point where the wave closes. |
| `work.ok` | Это начало круга. Полный оборот пройден, и следующая волна будет такой же. | Bu aylananing boshi. To'liq aylana bosib o'tildi, va keyingi to'lqin ham shunday bo'ladi. | That is the start of the circle. A full turn is complete, and the next wave will be the same. |
| `work.hint.1` | Волна замыкается там, где точка вернулась на своё место. | To'lqin nuqta o'z joyiga qaytgan joyda yopiladi. | The wave closes where the point returned to its place. |
| `work.hint.2` | Начало счёта было справа, на нуле градусов. | Sanoqning boshi o'ngda, nol gradusda edi. | The count started on the right, at zero degrees. |
| `work.hint.3` | Нужна правая точка круга. | Aylananing o'ng nuqtasi kerak. | You need the right point of the circle. |

---

## Экран 7 · `explain5` · ответ `number` · тег `bolshe-odnogo`

Полоса. Волна не выходит из промежутка от минус единицы до единицы, и это видно, потому что
высота волны на экране ровно равна радиусу круга.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Волна не выходит из полосы | To'lqin polosadan chiqmaydi | The wave does not leave the band |
| `show.1.1` | волна построена | to'lqin yasaldi | the wave is built |
| `show.1.2` | высота волны равна радиусу | to'lqinning balandligi radiusga teng | the wave height equals the radius |
| `show.2.1` | полоса от минус единицы до единицы | minus birdan birgacha polosa | a band from minus one to one |
| `show.2.2` | волна упирается в края | to'lqin chetlarga tegadi | the wave touches the edges |
| `audio.mount` | Волна построена, и её высота ровно такая же, как радиус круга. Сейчас отметим полосу. | To'lqin yasaldi, va uning balandligi aylananing radiusidek. Hozir polosani belgilaymiz. | The wave is built, and its height is exactly the radius of the circle. Now we will mark the band. |
| `audio.band*` | Полоса от минус единицы до единицы. Волна упирается в её края и наружу не выходит. Иначе точка сошла бы с окружности, а она на ней лежит. | Minus birdan birgacha polosa. To'lqin uning chetlariga tegadi va tashqariga chiqmaydi. Aks holda nuqta aylanadan chiqib ketardi, u esa aylanada yotadi. | A band from minus one to one. The wave touches its edges and never leaves it. Otherwise the point would leave the circle, and it lies on it. |
| `audio.work` | Посчитай сам. Какое самое большое значение принимает синус? | O'zingiz hisoblang. Sinus eng katta qanday qiymat oladi? | Compute it yourself. What is the largest value the sine takes? |
| `work.prompt` | Какое самое большое значение принимает синус? | Sinus eng katta qanday qiymat oladi? | What is the largest value the sine takes? |
| `work.ok` | Единица. Больше высота быть не может: точка лежит на окружности радиуса один. | Bir. Balandlik bundan katta bo'la olmaydi: nuqta radiusi bir bo'lgan aylanada yotadi. | One. The height cannot exceed that: the point lies on the circle of radius one. |
| `work.hint.1` | Наибольшая высота бывает на самом верху круга. | Eng katta balandlik aylananing eng tepasida bo'ladi. | The largest height happens at the very top of the circle. |
| `work.hint.2` | На самом верху высота равна радиусу. | Eng tepada balandlik radiusga teng. | At the very top the height equals the radius. |
| `work.hint.3` | Единица. | Bir. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |
| `show.1.3` | `−1 ≤ sin α ≤ 1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `grafik-bez-kruga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | График синуса | Sinus grafigi | The graph of the sine |
| `probe.question` | Откуда берётся график? | Grafik qayerdan olinadi? | Where does the graph come from? |
| `probe.a` [верно] | из высоты точки на круге | aylanadagi nuqtaning balandligidan | from the height of the point on the circle |
| `probe.b` | из таблицы значений | qiymatlar jadvalidan | from a table of values |
| `probe.b.hint` | По таблице можно поставить несколько точек, но откуда между ними волна, таблица не объясняет. | Jadval bo'yicha bir nechta nuqta qo'yish mumkin, lekin ular orasida to'lqin qayerdan kelganini jadval tushuntirmaydi. | A table lets you plot a few points, but it does not explain where the wave between them comes from. |
| `rule.lawLabel` | Развёртка | Yoyilma | The unrolling |
| `rule.lines.1` | Каждому числу `x` отвечает точка единичной окружности, а её высота даёт `sin x`. | Har bir `x` songa birlik aylanadagi nuqta mos keladi, uning balandligi esa `sin x` beradi. | Each number `x` gives a point of the unit circle, and its height gives `sin x`. |
| `rule.lines.2` | Оба графика определены при любом `x`, а значения лежат в отрезке `[−1; 1]`. | Ikkala grafik ham har qanday `x` da aniqlangan, qiymatlar esa `[−1; 1]` kesmada. | Both graphs are defined for every `x`, and the values lie in `[−1; 1]`. |
| `rule.lines.3` | График повторяется через период: у синуса и косинуса он равен `2π`. | Grafik davrdan keyin takrorlanadi: sinus va kosinusda u `2π` ga teng. | The graph repeats after a period: for sine and cosine it equals `2π`. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Круг разворачивается ещё раз, и правило открывается рядом. График это не отдельная тема, а та же точка, записанная во времени. | Aylana yana bir bor yoyiladi, va qoida yonida ochiladi. Grafik alohida tema emas, bu vaqt bo'ylab yozilgan o'sha nuqta. | The circle unrolls once more, and the rule opens beside it. The graph is not a separate topic but the same point written along time. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `D(y) = (−∞; +∞),   E(y) = [−1; 1]` |
| `probe.done` | `y = sin α` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `grafik-bez-kruga`

Соединить положение точки на круге с местом на волне. Подписи справа названы словами, а не
числами: два разных угла дают одно и то же число, и числами их не различить.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Где точка — там и волна | Nuqta qayerda, to'lqin ham o'sha yerda | Where the point is, the wave is too |
| `match.prompt` | Соедини каждый угол с местом на волне. | Har bir burchakni to'lqindagi joy bilan birlashtiring. | Match each angle with its place on the wave. |
| `match.a` | на оси, идёт вверх | o'qda, yuqoriga ketyapti | on the axis, going up |
| `match.b` | вершина | cho'qqi | the peak |
| `match.c` | на оси, идёт вниз | o'qda, pastga ketyapti | on the axis, going down |
| `match.d` | впадина | chuqurlik | the trough |
| `match.d.hint` | Впадина там, где высота самая отрицательная, то есть внизу круга. | Chuqurlik balandlik eng manfiy joyda, ya'ni aylananing pastida. | The trough is where the height is most negative, that is at the bottom of the circle. |
| `match.ok` | Четыре узла волны это четыре положения точки. Между ними точка идёт по кругу, а кривая между узлами. | To'lqinning to'rt tuguni bu nuqtaning to'rt holati. Ular orasida nuqta aylana bo'ylab, egri chiziq esa tugunlar orasida yuradi. | The four nodes of the wave are the four positions of the point. Between them the point goes round and the curve runs between the nodes. |
| `audio.mount` | Четыре угла и четыре места на волне. Соедини их. | To'rt burchak va to'lqindagi to'rt joy. Ularni birlashtiring. | Four angles and four places on the wave. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `0°` · `90°` · `180°` · `270°` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `grafik-bez-kruga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Построй одну волну по шагам | Bitta to'lqinni qadamlar bilan yasang | Build one wave step by step |
| `order.prompt` | Расставь шаги построения по порядку. | Yasash qadamlarini tartib bilan joylashtiring. | Put the construction steps in order. |
| `order.s1` | точка идёт по кругу | nuqta aylana bo'ylab yuradi | the point goes round the circle |
| `order.s2` | высота едет вправо | balandlik o'ngga ketadi | the height moves right |
| `order.s3` | отмечены четыре узла | to'rt tugun belgilanadi | four nodes are marked |
| `order.s4` | узлы соединены кривой | tugunlar egri chiziq bilan tutashadi | the nodes are joined by a curve |
| `order.ok` | Волна построена. Ни одной точки из таблицы не понадобилось: всё пришло из круга. | To'lqin yasaldi. Jadvaldan birorta nuqta kerak bo'lmadi: hammasi aylanadan keldi. | The wave is built. Not a single table value was needed: it all came from the circle. |
| `order.bad` | Сначала идёт точка, потом переносится высота, потом отмечаются узлы, потом они соединяются. | Avval nuqta yuradi, keyin balandlik ko'chiriladi, keyin tugunlar belgilanadi, keyin ular tutashtiriladi. | First the point moves, then the height is carried, then the nodes are marked, then they are joined. |
| `audio.mount` | Четыре шага построения. Порядок ставишь ты. | To'rtta yasash qadami. Tartibini o'zingiz qo'yasiz. | Four construction steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `90°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Девяносто. Вершина волны отвечает самому верху круга. | To'qson. To'lqinning cho'qqisi aylananing eng tepasiga mos keladi. | Ninety. The peak of the wave matches the very top of the circle. |
| `task.hint.1` | Вершина волны там, где высота точки наибольшая. | To'lqin cho'qqisi nuqtaning balandligi eng katta joyda. | The peak of the wave is where the height of the point is largest. |
| `task.hint.2` | Наибольшая высота бывает на самом верху круга. | Eng katta balandlik aylananing eng tepasida bo'ladi. | The largest height happens at the very top of the circle. |
| `task.hint.3` | Девяносто. | To'qson. | Ninety. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какое значение меньше? | Qaysi qiymat kichikroq? | Which value is smaller? |
| `order.ok` | Ты прочитал волну слева направо по высоте, а не по порядку углов. | Siz to'lqinni chapdan o'ngga balandlik bo'yicha o'qidingiz, burchaklar tartibi bo'yicha emas. | You read the wave by height, not by the order of the angles. |
| `order.bad` | Сравнивай высоты, а не углы. У двухсот семидесяти высота самая маленькая. | Balandliklarni solishtiring, burchaklarni emas. Ikki yuz yetmishda balandlik eng kichik. | Compare heights, not angles. At two hundred seventy the height is smallest. |
| `audio.mount` | На этом экране круга нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `sin α = 1   →   α = ?` |
| `task.answer` | `90` |
| `order.items` | `sin 270°` · `sin 210°` · `sin 0` · `sin 90°` |
| `order.answer` | `sin 270°  sin 210°  sin 0  sin 90°` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

Первые две строки верны. Неверна третья: из «первое число равно единице» никак не следует «график
начинается с нуля».

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob noto'g'ri. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка верна: косинус это первое число пары. | Bu qator to'g'ri: kosinus juftlikning birinchi soni. | This line is right: the cosine is the first number of the pair. |
| `hint.r2` | Эта строка тоже верна: справа сдвиг равен единице. | Bu qator ham to'g'ri: o'ngda siljish birga teng. | This line is right too: on the right the shift equals one. |
| `hint.r4` | Эта строка повторяет ошибку предыдущей. Первая неверная строка выше. | Bu qator oldingisidan kelib chiqadi. Birinchi xato qator yuqorida. | This line repeats the error of the previous one. The first wrong line is above. |
| `proof` | Из единицы не следует ноль. | Birdan nol kelib chiqmaydi. | Zero does not follow from one. |
| `entry.prompt` | С какого значения начинается график косинуса? | Kosinus grafigi qanday qiymatdan boshlanadi? | At what value does the cosine graph start? |
| `entry.ok` | С единицы. При нуле градусов точка стоит справа, и её сдвиг равен единице. | Birdan. Nol gradusda nuqta o'ngda turadi, uning siljishi birga teng. | At one. At zero degrees the point stands on the right, and its shift equals one. |
| `entry.hint.1` | Посмотри, где стоит точка при нуле градусов. | Nol gradusda nuqta qayerda turishiga qarang. | Look where the point stands at zero degrees. |
| `entry.hint.2` | Она справа, и её первое число равно единице. | U o'ngda, uning birinchi soni birga teng. | It is on the right, and its first number equals one. |
| `entry.hint.3` | Единица. | Bir. | One. |
| `audio.mount` | Задача. С какого значения начинается график косинуса. | Masala. Kosinus grafigi qanday qiymatdan boshlanadi. | A task. At what value does the cosine graph start. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `cos α = x` |
| `row.r2` | `α = 0   →   x = 1` |
| `row.r3` | `cos 0 = 0` |
| `row.r4` | `cos α = sin α` |
| `answerId` | `r3` |
| `entry.answer` | `1` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

По месту на волне назвать угол, потом отметить все углы, дающие ту же высоту.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | С волны обратно на круг | To'lqindan yana aylanaga | From the wave back to the circle |
| `place.prompt` | На волне отмечена вершина. Поставь точку на круге, которая её даёт. | To'lqinda cho'qqi belgilangan. Uni beradigan nuqtani aylanaga qo'ying. | The peak is marked on the wave. Place the point on the circle that gives it. |
| `place.ok` | Девяносто градусов. Вершина волны это самый верх круга. | To'qson gradus. To'lqinning cho'qqisi bu aylananing eng tepasi. | Ninety degrees. The peak of the wave is the very top of the circle. |
| `place.wrong` | Вершина это наибольшая высота, а наибольшая высота бывает наверху. | Cho'qqi bu eng katta balandlik, eng katta balandlik esa tepada bo'ladi. | The peak is the largest height, and the largest height happens at the top. |
| `multi.prompt` | Отметь все углы, у которых высота такая же. | Balandligi xuddi shunday bo'lgan hamma burchakni belgilang. | Mark every angle whose height is the same. |
| `multi.title` | У каких углов высота такая же? | Qaysi burchaklarda balandlik xuddi shunday? | Which angles have the same height? |
| `multi.d.hint` | У двухсот семидесяти высота наибольшая по величине, но направлена вниз. | Ikki yuz yetmishda balandlik kattaligi bo'yicha eng katta, lekin pastga qaragan. | At two hundred seventy the height is largest in size but points down. |
| `multi.e.hint` | У ста восьмидесяти высота равна нулю: это узел волны, а не вершина. | Yuz saksonda balandlik nolga teng: bu to'lqinning tuguni, cho'qqi emas. | At one hundred eighty the height is zero: that is a node of the wave, not a peak. |
| `multi.ok` | Три записи из пяти. Вершина повторяется через целое число оборотов, и волна повторяется вместе с ней. | Beshtadan uchtasi. Cho'qqi butun sondagi aylanadan keyin takrorlanadi, to'lqin ham u bilan birga. | Three out of five. The peak repeats after a whole number of turns, and the wave repeats with it. |
| `audio.mount` | Теперь обратная задача. Дано место на волне, нужен угол. | Endi teskari masala. To'lqindagi joy berilgan, burchak kerak. | Now the inverse task. A place on the wave is given, the angle is needed. |
| `audio.work` | Поставь точку, потом отметишь все углы с такой же высотой. | Nuqtani qo'ying, keyin xuddi shunday balandlikdagi hamma burchakni belgilaysiz. | Place the point, then you will mark every angle with the same height. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `90°` |
| `place.step` | `sin α = 1   →   90°` |
| `multi.a` [верно] | `90°` |
| `multi.b` [верно] | `450°` |
| `multi.c` [верно] | `−270°` |
| `multi.d` | `270°` |
| `multi.e` | `180°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `grafik-bez-kruga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Что рисует график синуса? | Sinus grafigini nima chizadi? | What draws the graph of the sine? |
| `q1.a` [верно] | высота точки | nuqtaning balandligi | the height of the point |
| `q1.b` | сдвиг точки | nuqtaning siljishi | the shift of the point |
| `q1.b.hint` | Сдвиг рисует график косинуса. | Siljish kosinus grafigini chizadi. | The shift draws the cosine graph. |
| `q1.c` | радиус | radius | the radius |
| `q1.c.hint` | Радиус всегда равен единице, он ничего не рисует. | Radius doim birga teng, u hech narsa chizmaydi. | The radius is always one, it draws nothing. |
| `q1.d` | угол | burchak | the angle |
| `q1.d.hint` | Угол это время по горизонтали, а рисует высота. | Burchak bu gorizontal bo'yicha vaqt, chizadigani esa balandlik. | The angle is the time along the horizontal, and the height does the drawing. |
| `q2.prompt` | С какого значения начинается график косинуса? | Kosinus grafigi qanday qiymatdan boshlanadi? | At what value does the cosine graph start? |
| `q2.a` [верно] | с единицы | birdan | at one |
| `q2.b` | с нуля | noldan | at zero |
| `q2.b.hint` | С нуля начинается синус: справа высота равна нулю, а сдвиг единице. | Noldan sinus boshlanadi: o'ngda balandlik nolga, siljish esa birga teng. | The sine starts at zero: on the right the height is zero and the shift is one. |
| `q2.c` | с минус единицы | minus birdan | at minus one |
| `q2.c.hint` | Минус единица бывает слева, а счёт начинается справа. | Minus bir chapda bo'ladi, sanoq esa o'ngdan boshlanadi. | Minus one happens on the left, and the count starts on the right. |
| `q2.d` | с любого | har qanday qiymatdan | at any value |
| `q2.d.hint` | Начало счёта закреплено договором, значит и значение одно. | Sanoqning boshi kelishuv bilan qotirilgan, demak qiymat ham bitta. | The start of the count is fixed by agreement, so the value is one specific number. |
| `q3.prompt` | Как узнать, где волна выше нуля? | To'lqin qayerda noldan yuqori ekanini qanday bilamiz? | How do you tell where the wave is above zero? |
| `q3.a` [верно] | посмотреть, где точка выше оси | nuqta qayerda o'qdan yuqori ekaniga qarash | look where the point is above the axis |
| `q3.a.ok` | Да. Знак высоты и знак кривой это одно и то же. | Ha. Balandlikning ishorasi va egri chiziqning ishorasi bir narsa. | Yes. The sign of the height and the sign of the curve are the same. |
| `q3.b` | выучить участки наизусть | qismlarni yoddan bilib olish | memorise the intervals |
| `q3.b.hint` | Заучивать нечего: участок видно по кругу. | Yodlashga narsa yo'q: qism aylanadan ko'rinadi. | There is nothing to memorise: the interval shows on the circle. |
| `q4.prompt` | Чему равна длина одной волны синуса? | Sinusning bitta to'lqin uzunligi qancha? | What is the length of one sine wave? |
| `q4.a` [верно] | полный оборот | to'liq aylana | a full turn |
| `q4.b` | половина оборота | yarim aylana | half a turn |
| `q4.b.hint` | За половину оборота точка окажется напротив, а волна ещё не замкнётся. | Yarim aylanada nuqta qarshi tomonda bo'ladi, to'lqin esa hali yopilmaydi. | In half a turn the point ends up opposite and the wave has not closed yet. |
| `q4.c` | четверть оборота | chorak aylana | a quarter turn |
| `q4.c.hint` | Четверть это только до вершины. | Chorak faqat cho'qqigacha. | A quarter reaches only the peak. |
| `q4.d` | два оборота | ikki aylana | two turns |
| `q4.d.hint` | За два оборота волна повторится дважды. | Ikki aylanada to'lqin ikki marta takrorlanadi. | In two turns the wave repeats twice. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `y = sin α` |
| `q2.done` | `cos 0 = 1` |
| `q3.done` | `sin α > 0` |
| `q4.done` | `T = 360°` |
| `angles` | `90°` · `0°` · `120°` · `360°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Вижу график как развёртку круга | Grafikni aylananing yoyilmasi sifatida ko'raman | I see the graph as the unrolled circle |
| `can.2` | Читаю по графику знак и вершину | Grafikdan ishorani va cho'qqini o'qiyman | I read the sign and the peak off the graph |
| `can.3` | Знаю, что волна не выходит из полосы | To'lqin polosadan chiqmasligini bilaman | I know the wave stays inside the band |
| `can.4` | Нахожу период как длину одной волны | Davrni bitta to'lqin uzunligi sifatida topaman | I find the period as the length of one wave |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: с чего начинается косинус. | Bitta joy takrorlashni talab qiladi: kosinus nimadan boshlanadi. | One place needs review: where the cosine starts. |
| `levels.back` | Вернись к правилу и к экрану 3. | Qoidaga va 3-ekranga qayting. | Go back to the rule and to screen 3. |
| `bridge` | Урок 7: те же графики, но разговор пойдёт про область определения и множество значений. | 7-dars: o'sha grafiklar, lekin gap aniqlanish sohasi va qiymatlar to'plami haqida boradi. | Lesson 7: the same graphs, but the talk will be about the domain and the range. |
| `lifehack` | Не рисуй по точкам. Спроси, где сейчас точка на круге, и высота сама скажет, где кривая. | Nuqtalar bo'yicha chizmang. Nuqta aylanada qayerda ekanini so'rang, balandlik o'zi aytadi. | Do not plot point by point. Ask where the point is on the circle, and the height will tell you where the curve is. |
| `sheetTitle` | График · шпаргалка | Grafik · shpargalka | The graph · cheat sheet |
| `sheetSrc` | 10 класс · урок 6 | 10-sinf · 6-dars | Grade 10 · lesson 6 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | График это та же точка, только её высота записана во времени. | Grafik bu o'sha nuqta, faqat balandligi vaqt bo'ylab yozilgan. | The graph is the same point, only its height written along time. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `(x; y)  ≠  y = sin α` |
| `hook.b` | `(x; y)  →  y = sin α` |
| `proved` | `(x; y)  →  y = sin α` |
| `law` | `D(y) = (−∞; +∞),   E(y) = [−1; 1]` |
| `sheet.1` | `y = sin α:   0  →  1  →  0  →  −1  →  0` |
| `sheet.2` | `y = cos α:   1  →  0  →  −1  →  0  →  1` |
| `sheet.3` | `T = 360°  =  2π` |
| `sheet.4` | `E(y) = [−1; 1]` |
| `sheet.5` | `sin α = 1  →  90°` · `cos α = 1  →  0°` |
