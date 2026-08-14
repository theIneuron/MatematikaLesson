# Урок 4 — Знаки и значения · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Это последняя точка, где правка формулировки стоит минуту.
После сборки та же правка стоит сборки, прогона вёрстки и снимка.

Скелет: `DARS04_06_SKELET.md` §6. Опора в учебнике: алгебра 2022, стр. 14–15 (знаки по четвертям
и формулы приведения — глава тождеств, как повторение девятого класса).

---

## Как читать этот файл

Каждый экран — две таблицы. **Текст** (четыре колонки: ключ, RU, UZ, EN) и **Формулы** (две
колонки: ключ и значение, одинаковое во всех языках). Ключи в точечной записи, по ним же
собирается урок скриптом `grade10-kontent-build.mjs`.

| Ключ | Что это |
|---|---|
| `eyebrow`, `title` | бровка и заголовок экрана |
| `audio.<имя>` | реплика озвучки; **звёздочка** после имени — во время неё на экране движется |
| `show.<кадр>.<строка>` | строка в колонке записи для этого кадра показа |
| `probe.question` | вопрос выбора |
| `probe.<id>` | вариант ответа; `[верно]` в колонке RU — правильный |
| `probe.<id>.hint` | разбор неверного варианта. **Произносится**, поэтому словами, без символов |
| `probe.<id>.ok` | похвала за верный вариант, если нужна |
| `work.prompt`, `work.ok` | задание и вывод рабочей части |
| `work.hint.<n>` | разбор попытки, по порядку |
| `rule.*` | карточка правила |
| `sheet.*` | шпаргалка итога |

**Правила текста, которые проверяет машина.** В озвучке и в разборах нет символов
`% $ / × ÷ = < > ✗ π √ ²` и длинных тире — всё словами. В UZ апостроф только ASCII `'`, кириллицы
нет. У каждого неверного варианта свой разбор, двух одинаковых быть не может.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

Точка стоит на 200°, координаты не подписаны — прогноз до действия. Две записи различаются только
знаком: ученик с мнемоникой из девятого класса выбирает по памяти, и именно это надо поймать.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЗНАКИ | ISHORALAR | THE SIGNS |
| `title` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `row.a.name` | синус положителен | sinus musbat | the sine is positive |
| `row.b.name` | синус отрицателен | sinus manfiy | the sine is negative |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим его самим прибором. | Javobingiz yozib olindi. Endi asbobning o'zi bilan tekshiramiz. | Your answer is saved. Now the instrument itself will check it. |
| `audio.mount*` | Точка едет на двести градусов. | Nuqta ikki yuz gradusga suriladi. | The point moves to two hundred degrees. |
| `audio.r1` | Первая запись говорит, что синус положителен. | Birinchi yozuv sinus musbat deydi. | The first reading says the sine is positive. |
| `audio.r2` | Вторая говорит, что он отрицателен. | Ikkinchisi esa manfiy deydi. | The second says it is negative. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `sin 200° = ?` |
| `row.a.value` | `sin 200° = 0,34` |
| `row.b.value` | `sin 200° = −0,34` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

Три вопроса, и чертёж отвечает на каждый — по образцу урока 2. Третий вопрос про направление
поворота нужен здесь, потому что без него «двести градусов» некуда отложить.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса про точку | Nuqta haqida uch savol | Three questions about the point |
| `q1.prompt` | Что означает первое число пары? | Juftlikning birinchi soni nimani anglatadi? | What does the first number of the pair mean? |
| `q1.a` [верно] | сдвиг | siljish | the shift |
| `q1.b` | высоту | balandlik | the height |
| `q1.b.hint` | Высота это второе число, ордината. | Balandlik ikkinchi son, ya'ni ordinata. | The height is the second number, the ordinate. |
| `q1.c` | радиус | radius | the radius |
| `q1.c.hint` | Радиус у единичной окружности всегда один, он не меняется. | Birlik aylanada radius doim bir, u o'zgarmaydi. | On the unit circle the radius is always one, it does not change. |
| `q1.d` | угол | burchak | the angle |
| `q1.d.hint` | Угол это то, чем задана точка, а не её координата. | Burchak nuqta beriladigan narsa, uning koordinatasi emas. | The angle is what fixes the point, not its coordinate. |
| `q2.prompt` | Каким может быть синус по величине? | Sinus kattaligi bo'yicha qanday bo'la oladi? | How large can the sine be? |
| `q2.a` [верно] | не больше единицы | birdan katta emas | no more than one |
| `q2.b` | любым | har qanday | anything |
| `q2.b.hint` | Точка лежит на окружности радиуса один и дальше неё уйти не может. | Nuqta radiusi bir bo'lgan aylanada, undan uzoqroqqa chiqa olmaydi. | The point lies on the circle of radius one and cannot go further. |
| `q2.c` | только положительным | faqat musbat | only positive |
| `q2.c.hint` | Ниже оси высота отрицательна, и это сегодняшняя тема. | O'qdan pastda balandlik manfiy, va bugungi tema shu. | Below the axis the height is negative, and that is today's topic. |
| `q2.d` | не больше двух | ikkidan katta emas | no more than two |
| `q2.d.hint` | Граница это радиус, а он равен единице. | Chegara bu radius, u esa birga teng. | The bound is the radius, and it equals one. |
| `q3.prompt` | В какую сторону отсчитывается положительный угол? | Musbat burchak qaysi tomonga sanaladi? | Which way is a positive angle counted? |
| `q3.a` [верно] | против часовой | soat miliga qarshi | counterclockwise |
| `q3.b` | по часовой | soat mili bo'ylab | clockwise |
| `q3.b.hint` | По часовой отсчитывается отрицательный поворот, он будет на следующем уроке. | Soat mili bo'ylab manfiy burish sanaladi, u keyingi darsda bo'ladi. | Clockwise counts a negative turn, that comes in the next lesson. |
| `q3.c` | от верха | tepadan | from the top |
| `q3.c.hint` | Счёт начинается справа, от положительного направления оси. | Sanoq o'ngdan, o'qning musbat yo'nalishidan boshlanadi. | The count starts on the right, from the positive direction of the axis. |
| `q3.d` | как удобно | qulay tomondan | whichever way suits |
| `q3.d.hint` | Направление задано договором, иначе один угол давал бы две точки. | Yo'nalish kelishuv bilan berilgan, aks holda bitta burchak ikki nuqta berardi. | The direction is fixed by agreement, otherwise one angle would give two points. |
| `audio.mount` | Три коротких вопроса. На чертеже рядом подписано, где сдвиг и где высота. | Uch qisqa savol. Yonidagi chizmada siljish qayerda, balandlik qayerda yozilgan. | Three short questions. The drawing beside them labels the shift and the height. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `(x;  y)  →  x` |
| `q2.done` | `−1 ≤ sin α ≤ 1` |
| `q3.done` | `+` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `znak-po-mnemonike`

Свидетель урока. Точка едет по кругу, под чертежом две шкалы — сдвиг и высота. Знак на шкале
меняется **в тот момент**, когда точка переходит ось. После этого мнемоника не нужна.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Знак — это направление | Ishora bu yo'nalish | The sign is the direction |
| `show.1.1` | две шкалы: сдвиг и высота | ikki shkala: siljish va balandlik | two scales: the shift and the height |
| `show.1.2` | обе положительны | ikkisi ham musbat | both are positive |
| `show.2.1` | точка перешла верх | nuqta tepadan o'tdi | the point crossed the top |
| `show.2.2` | сдвиг стал отрицательным | siljish manfiy bo'ldi | the shift became negative |
| `show.3.1` | точка перешла левую сторону | nuqta chap tomondan o'tdi | the point crossed the left side |
| `show.3.2` | высота тоже стала отрицательной | balandlik ham manfiy bo'ldi | the height became negative too |
| `audio.mount` | Точка на тридцати градусах. Под чертежом две шкалы, сдвиг и высота, и обе положительны. | Nuqta o'ttiz gradusda. Chizma tagida ikki shkala, siljish va balandlik, ikkisi ham musbat. | The point is at thirty degrees. Below the drawing two scales, the shift and the height, and both are positive. |
| `audio.up*` | Теперь точка едет дальше. Смотри на шкалу сдвига в тот момент, когда точка переходит верх. Знак меняется ровно там. | Endi nuqta oldinga suriladi. Nuqta tepadan o'tayotgan paytda siljish shkalasiga qarang. Ishora aynan o'sha yerda almashadi. | Now the point moves on. Watch the shift scale at the moment the point crosses the top. The sign changes exactly there. |
| `audio.down*` | Точка едет ниже. Теперь высота переходит ось, и её знак тоже меняется. Ничего запоминать не надо, знак видно. | Nuqta pastga suriladi. Endi balandlik o'qdan o'tadi va uning ishorasi ham almashadi. Yodlashning hojati yo'q, ishora ko'rinadi. | The point moves lower. Now the height crosses the axis and its sign changes too. Nothing to memorise, the sign is visible. |
| `audio.work` | Теперь сам. Поставь точку так, чтобы сдвиг был отрицательным, а высота положительной. | Endi o'zingiz. Siljishi manfiy, balandligi musbat bo'lgan nuqtani qo'ying. | Now you. Place the point so that the shift is negative and the height positive. |
| `work.prompt` | Поставь точку: сдвиг отрицательный, высота положительная. | Nuqtani qo'ying: siljish manfiy, balandlik musbat. | Place the point: the shift negative, the height positive. |
| `work.ok` | Сдвиг влево, высота вверх. Знак каждого числа виден по направлению, и запоминать нечего. | Siljish chapga, balandlik yuqoriga. Har sonning ishorasi yo'nalishdan ko'rinadi, yodlashga narsa yo'q. | The shift goes left, the height up. The sign of each number shows in its direction, nothing to memorise. |
| `work.hint.1` | Оба числа пока положительны. Веди точку за самый верх. | Ikki son hozircha musbat. Nuqtani eng tepadan o'tkazing. | Both numbers are still positive. Drive the point past the very top. |
| `work.hint.2` | Высота ушла ниже оси. Нужна точка выше оси, но левее. | Balandlik o'qdan pastga tushdi. O'qdan yuqorida, lekin chaproqda nuqta kerak. | The height went below the axis. You need a point above the axis but to the left. |
| `work.hint.3` | Смотри на шкалы: у сдвига должен быть минус, у высоты плюс. | Shkalalarga qarang: siljishda minus, balandlikda plyus bo'lishi kerak. | Watch the scales: the shift needs a minus, the height a plus. |

---

## Экран 4 · `explain2` · ответ `lead` · тег `znak-po-mnemonike`

Здесь вводится слово **«четверть»** — впервые в классе. В уроках 2 и 3 его нет намеренно.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Четыре части получают имена | To'rt qism nom oladi | The four parts get names |
| `show.1.1` | оси делят круг на четыре части | o'qlar aylanani to'rt qismga bo'ladi | the axes cut the circle into four parts |
| `show.1.2` | их называют четвертями | ularni choraklar deb ataydi | they are called quadrants |
| `show.2.1` | в каждой своя пара знаков | har birida o'z ishoralar juftligi | each has its own pair of signs |
| `show.2.2` | счёт четвертей идёт против часовой | choraklar sanog'i soat miliga qarshi ketadi | the quadrants are counted counterclockwise |
| `audio.mount` | Две оси делят круг на четыре части. Их называют четвертями и считают против часовой, от правой верхней. | Ikki o'q aylanani to'rt qismga bo'ladi. Ularni choraklar deb ataydi va soat miliga qarshi, o'ng yuqoridan sanaydi. | Two axes cut the circle into four parts. They are called quadrants and counted counterclockwise from the upper right. |
| `audio.signs*` | В каждой четверти своя пара знаков, и она не выучена, а видна: куда смотрит сдвиг, куда смотрит высота. | Har chorakda o'z ishoralar juftligi bor, va u yodlangan emas, ko'rinadi: siljish qayoqqa, balandlik qayoqqa qaraydi. | Each quadrant has its own pair of signs, and it is not memorised but visible: which way the shift points, which way the height. |
| `audio.work` | Теперь сам. Поставь точку в третьей четверти. | Endi o'zingiz. Nuqtani uchinchi chorakka qo'ying. | Now you. Place the point in the third quadrant. |
| `work.prompt` | Поставь точку в третьей четверти. | Nuqtani uchinchi chorakka qo'ying. | Place the point in the third quadrant. |
| `work.ok` | Третья четверть: оба числа отрицательны. Сдвиг влево, высота вниз. | Uchinchi chorak: ikki son ham manfiy. Siljish chapga, balandlik pastga. | The third quadrant: both numbers are negative. The shift goes left, the height down. |
| `work.hint.1` | Это первая четверть, там оба числа положительны. Считай против часовой. | Bu birinchi chorak, u yerda ikki son ham musbat. Soat miliga qarshi sanang. | That is the first quadrant, both numbers are positive there. Count counterclockwise. |
| `work.hint.2` | Это вторая четверть: сдвиг уже отрицателен, а высота ещё нет. | Bu ikkinchi chorak: siljish manfiy bo'ldi, balandlik esa hali emas. | That is the second quadrant: the shift is negative already, the height not yet. |
| `work.hint.3` | Это четвёртая четверть: высота отрицательна, а сдвиг положителен. | Bu to'rtinchi chorak: balandlik manfiy, siljish esa musbat. | That is the fourth quadrant: the height is negative, the shift positive. |
| `work.hint.4` | Нужна часть, где отрицательны оба: левее и ниже центра. | Ikkisi ham manfiy bo'lgan qism kerak: markazdan chapda va pastda. | You need the part where both are negative: left of and below the centre. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.2.3` | `(+; +)   (−; +)   (−; −)   (+; −)` |

---

## Экран 5 · `explain3` · ответ `lead` · тег `znak-po-mnemonike`

Знак тангенса не отдельное правило: это отношение двух знаков. Одинаковые направления дают плюс,
разные — минус. Поэтому в первой и третьей четвертях тангенс положителен.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Знак тангенса — из двух знаков | Tangens ishorasi ikki ishoradan | The tangent sign comes from two signs |
| `show.1.1` | тангенс это отношение | tangens bu nisbat | the tangent is a ratio |
| `show.1.2` | знаки одинаковы, значит плюс | ishoralar bir xil, demak plyus | the signs match, so plus |
| `show.2.1` | во второй четверти знаки разные | ikkinchi chorakda ishoralar har xil | in the second quadrant the signs differ |
| `show.2.2` | значит тангенс отрицателен | demak tangens manfiy | so the tangent is negative |
| `audio.mount` | Тангенс это отношение высоты к сдвигу. Значит его знак получается из двух знаков, а не из третьего правила. | Tangens balandlikning siljishga nisbati. Demak uning ishorasi ikki ishoradan chiqadi, uchinchi qoidadan emas. | The tangent is the height over the shift. So its sign comes from those two signs, not from a third rule. |
| `audio.same*` | В первой четверти оба числа положительны, отношение положительно. Точка едет в третью: оба стали отрицательными, а отношение снова положительно. | Birinchi chorakda ikki son musbat, nisbat musbat. Nuqta uchinchi chorakka suriladi: ikkisi manfiy bo'ldi, nisbat esa yana musbat. | In the first quadrant both numbers are positive, the ratio is positive. The point moves to the third: both became negative, and the ratio is positive again. |
| `audio.diff*` | А во второй и четвёртой знаки разные, и отношение отрицательно. | Ikkinchi va to'rtinchi chorakda esa ishoralar har xil, va nisbat manfiy. | In the second and fourth the signs differ, and the ratio is negative. |
| `audio.work` | Теперь сам. Поставь точку так, чтобы тангенс был отрицательным. | Endi o'zingiz. Tangensi manfiy bo'ladigan nuqtani qo'ying. | Now you. Place the point so that the tangent is negative. |
| `work.prompt` | Поставь точку так, чтобы тангенс был отрицательным. | Tangensi manfiy bo'ladigan nuqtani qo'ying. | Place the point so that the tangent is negative. |
| `work.ok` | Знаки разные, значит отношение отрицательно. Так во второй и в четвёртой четверти. | Ishoralar har xil, demak nisbat manfiy. Ikkinchi va to'rtinchi chorakda shunday. | The signs differ, so the ratio is negative. That happens in the second and the fourth quadrant. |
| `work.hint.1` | Здесь оба числа положительны, и отношение положительно. | Bu yerda ikki son musbat, nisbat ham musbat. | Here both numbers are positive, and the ratio is positive. |
| `work.hint.2` | Здесь оба отрицательны. Минус на минус даёт плюс. | Bu yerda ikkisi ham manfiy. Minusga minus plyus beradi. | Here both are negative. Minus over minus gives plus. |
| `work.hint.3` | Нужна четверть, где одно число положительно, а другое отрицательно. | Bir son musbat, ikkinchisi manfiy bo'lgan chorak kerak. | You need the quadrant where one number is positive and the other negative. |

---

## Экран 6 · `explain4` · ответ `lead` · тег `oba-rastut`

Приведение к острому углу. Угол вырос в десять раз, а высота по величине **та же**: меняется
только знак. Это и опровержение «оба значения растут вместе с углом», на новом случае.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Длина та же, знак другой | Uzunlik o'sha, ishora boshqa | The same length, a different sign |
| `show.1.1` | двадцать градусов | yigirma gradus | twenty degrees |
| `show.1.2` | высота вверх | balandlik yuqoriga | the height points up |
| `show.2.1` | двести градусов | ikki yuz gradus | two hundred degrees |
| `show.2.2` | та же длина, но вниз | o'sha uzunlik, lekin pastga | the same length, but down |
| `audio.mount` | Точка на двадцати градусах. Высота небольшая и направлена вверх. | Nuqta yigirma gradusda. Balandlik kichik va yuqoriga qaragan. | The point is at twenty degrees. The height is small and points up. |
| `audio.ride*` | Теперь точка едет на двести градусов, то есть на сто восемьдесят дальше. Смотри на высоту: длина у неё та же, а направление стало вниз. | Endi nuqta ikki yuz gradusga suriladi, ya'ni yuz saksonga uzoqroq. Balandlikka qarang: uzunligi o'sha, yo'nalishi esa pastga aylandi. | Now the point moves to two hundred degrees, that is one hundred eighty further. Watch the height: its length is the same, its direction became down. |
| `audio.compare*` | Угол стал в десять раз больше, а высота по величине не изменилась. Значит достаточно знать острый угол и знак. | Burchak o'n baravar kattalashdi, balandlik esa kattaligi bo'yicha o'zgarmadi. Demak o'tkir burchakni va ishorani bilish yetarli. | The angle grew ten times, and the height did not change in size. So knowing the acute angle and the sign is enough. |
| `audio.work` | Теперь сам. Поставь точку на двести градусов. | Endi o'zingiz. Nuqtani ikki yuz gradusga qo'ying. | Now you. Place the point at two hundred degrees. |
| `work.prompt` | Поставь точку на двести градусов. | Nuqtani ikki yuz gradusga qo'ying. | Place the point at two hundred degrees. |
| `work.ok` | Двести это сто восемьдесят и ещё двадцать. Высота такая же, как у двадцати, только вниз. | Ikki yuz bu yuz sakson va yana yigirma. Balandlik yigirma gradusdagidek, faqat pastga. | Two hundred is one hundred eighty plus twenty. The height matches twenty degrees, only downward. |
| `work.hint.1` | Это ещё во второй четверти. Веди дальше, за левую сторону. | Bu hali ikkinchi chorakda. Chap tomondan o'tkazib, oldinga boring. | That is still in the second quadrant. Go further, past the left side. |
| `work.hint.2` | Ты прошёл слишком далеко: здесь высота уже близко к самому низу. | Juda uzoqqa ketdingiz: bu yerda balandlik eng pastga yaqin. | You went too far: here the height is close to the very bottom. |
| `work.hint.3` | Нужен угол чуть больше ста восьмидесяти: высота маленькая и направлена вниз. | Yuz saksondan bir oz katta burchak kerak: balandlik kichik va pastga qaragan. | You need an angle just past one hundred eighty: the height small and pointing down. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.2.3` | `sin 200° = −sin 20°` |

---

## Экран 7 · `explain5` · ответ `number` · тег `osevoy-po-sosedu`

Граница. На осях знака нет: там либо ноль, либо значения не существует. Ученик пишет число.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | На оси знака нет | O'qda ishora yo'q | On the axis there is no sign |
| `show.1.1` | на осях кончается одна четверть и начинается другая | o'qlarda bir chorak tugab, ikkinchisi boshlanadi | on the axes one quadrant ends and another begins |
| `show.1.2` | там одно из чисел равно нулю | u yerda sonlardan biri nolga teng | there one of the numbers equals zero |
| `audio.mount` | Оси это граница четвертей. На границе знака нет: там одно из двух чисел равно нулю. | O'qlar choraklar chegarasi. Chegarada ishora yo'q: u yerda ikki sondan biri nolga teng. | The axes are the border of the quadrants. On the border there is no sign: one of the two numbers is zero. |
| `audio.zero*` | Точка едет на девяносто градусов, и сдвиг уходит в ноль. Потом на сто восемьдесят, и в ноль уходит высота. Ноль не положителен и не отрицателен. | Nuqta to'qson gradusga suriladi va siljish nolga tushadi. Keyin yuz saksonga, va balandlik nolga tushadi. Nol na musbat, na manfiy. | The point moves to ninety degrees and the shift goes to zero. Then to one hundred eighty, and the height goes to zero. Zero is neither positive nor negative. |
| `audio.work` | Посчитай сам. Чему равна высота на двухсот семидесяти градусах? | O'zingiz hisoblang. Ikki yuz yetmish gradusda balandlik qancha? | Compute it yourself. What is the height at two hundred seventy degrees? |
| `work.prompt` | Чему равна высота на 270 градусах? | 270 gradusda balandlik qancha? | What is the height at 270 degrees? |
| `work.ok` | Минус один. Это самый низ: высота по величине наибольшая, а направление вниз. | Minus bir. Bu eng past joy: balandlik kattaligi bo'yicha eng katta, yo'nalishi esa pastga. | Minus one. This is the very bottom: the height is largest in size and points down. |
| `work.hint.1` | Двести семьдесят градусов это самый низ окружности. | Ikki yuz yetmish gradus bu aylananing eng pastki nuqtasi. | Two hundred seventy degrees is the lowest point of the circle. |
| `work.hint.2` | Высота там наибольшая по величине, а направлена вниз. | Balandlik u yerda kattaligi bo'yicha eng katta, va pastga qaragan. | The height there is the largest in size and points down. |
| `work.hint.3` | Минус один. | Minus bir. | Minus one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `−1` |
| `show.1.3` | `cos 90° = 0,   sin 180° = 0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `znak-po-mnemonike`

Чек различения, потом карточка. Определения даны словами учебника (стр. 14): знак определяется
четвертью, а четверть видна по чертежу.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Знак по четверти | Chorak bo'yicha ishora | The sign by quadrant |
| `probe.question` | Как надёжнее узнать знак? | Ishorani qanday qilib ishonchli bilib olamiz? | What is the reliable way to find the sign? |
| `probe.a` [верно] | посмотреть направление на чертеже | chizmada yo'nalishga qarash | look at the direction on the drawing |
| `probe.b` | вспомнить правило наизусть | qoidani yoddan eslash | recall the rule by heart |
| `probe.b.hint` | Заученное правило подводит там, где четверть определена на память. Направление видно всегда. | Yodlangan qoida chorak yoddan aniqlangan joyda adashtiradi. Yo'nalish esa doim ko'rinadi. | A memorised rule fails where the quadrant is guessed from memory. The direction is always visible. |
| `rule.lawLabel` | Знак | Ishora | The sign |
| `rule.lines.1` | Знак значения определяется тем, какой четверти принадлежит угол, и каков в этой четверти знак нужной координаты. | Qiymatning ishorasi burchak qaysi chorakka tegishli ekani va shu chorakda kerakli koordinataning ishorasi qandayligi bilan aniqlanadi. | The sign of a value is determined by which quadrant the angle belongs to and what the sign of that coordinate is in that quadrant. |
| `rule.lines.2` | Первая координата положительна справа от вертикальной оси, вторая — выше горизонтальной. | Birinchi koordinata tik o'qning o'ng tomonida musbat, ikkinchisi esa gorizontal o'qdan yuqorida. | The first coordinate is positive to the right of the vertical axis, the second above the horizontal one. |
| `rule.lines.3` | Знак тангенса это знак отношения: одинаковые знаки дают плюс, разные — минус. | Tangens ishorasi nisbatning ishorasi: bir xil ishoralar plyus, har xil ishoralar minus beradi. | The tangent sign is the sign of the ratio: matching signs give plus, differing signs minus. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Точка обходит четверти, и в каждой видна своя пара знаков. Правило записано словами учебника. | Nuqta choraklarni aylanib chiqadi, va har birida o'z ishoralar juftligi ko'rinadi. Qoida darslik so'zlari bilan yozilgan. | The point goes round the quadrants, and each shows its own pair of signs. The rule is written in the textbook's words. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `I (+; +)   II (−; +)   III (−; −)   IV (+; −)` |
| `probe.done` | `+  −` |

---

## Экран 9 · `drill` · ответ `build` · формат `table` · тег `znak-po-mnemonike`

Таблица знаков по четырём углам, по одному из каждой четверти. Значения не нужны — только знаки.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Знаки четырёх углов | To'rt burchakning ishoralari | The signs of four angles |
| `table.wrong` | Смотри на чертёж: точка отмечена. Сдвиг вправо это плюс, влево минус. | Chizmaga qarang: nuqta belgilangan. Siljish o'ngga bo'lsa plyus, chapga bo'lsa minus. | Look at the drawing: the point is marked. A shift right is plus, left is minus. |
| `table.swap` | Знаки перепутаны местами. Первый это сдвиг, второй высота. | Ishoralar joy almashgan. Birinchisi siljish, ikkinchisi balandlik. | The signs are swapped. The first is the shift, the second the height. |
| `table.ok` | Четыре четверти закрыты. В каждой пара знаков своя, и её видно по направлению. | To'rt chorak yopildi. Har birida ishoralar juftligi o'ziga xos, va u yo'nalishdan ko'rinadi. | Four quadrants are closed. Each has its own pair of signs, visible from the direction. |
| `audio.mount` | Четыре угла, по одному из каждой четверти. Расставь знаки. | To'rt burchak, har chorakdan bittasi. Ishoralarni joylashtiring. | Four angles, one from each quadrant. Place the signs. |

**Формулы**

| Ключ | Значение |
|---|---|
| `table.rows` | `40°  →  (+; +)` · `130°  →  (−; +)` · `200°  →  (−; −)` · `320°  →  (+; −)` |
| `table.chips` | `+` · `−` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `oba-rastut`

`tg 210°` по шагам. Порядок жёсткий: четверть, знак, приведение, значение.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Найди tg 210° по шагам | tg 210° ni qadamlar bilan toping | Find tg 210° step by step |
| `order.prompt` | Расставь шаги решения по порядку. | Yechim qadamlarini tartib bilan joylashtiring. | Put the steps of the solution in order. |
| `order.s2` | третья четверть | uchinchi chorak | the third quadrant |
| `order.s3` | знаки одинаковы, тангенс положителен | ishoralar bir xil, tangens musbat | the signs match, the tangent is positive |
| `order.ok` | Корень из трёх на три. Знак положителен, потому что в третьей четверти оба числа отрицательны. | Uch ildizining uchdan biri. Ishora musbat, chunki uchinchi chorakda ikki son ham manfiy. | Root three over three. The sign is positive, because in the third quadrant both numbers are negative. |
| `order.bad` | Сначала определяется четверть, потом знак, потом приведение к острому углу, потом значение. | Avval chorak aniqlanadi, keyin ishora, keyin o'tkir burchakka keltirish, keyin qiymat. | First the quadrant, then the sign, then the reduction to the acute angle, then the value. |
| `audio.mount` | Двести десять градусов. Шаги названы, порядок ставишь ты. Первый шаг это четверть: без неё знак не узнать. | Ikki yuz o'n gradus. Qadamlar nomlangan, tartibini o'zingiz qo'yasiz. Birinchi qadam bu chorak: usiz ishorani bilib bo'lmaydi. | Two hundred ten degrees. The steps are named, you put them in order. The first step is the quadrant: without it the sign cannot be found. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.s1` | `210° = 180° + 30°` |
| `order.s4` | `tg 30° = √3/3` |
| `order.answer` | `s1 s2 s3 s4` |
| `order.mark` | `210°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

На ДТМ чертежа не будет. Сначала число, потом порядок — и порядок именно по знакам, а не по
величине: это то, что урок и ставит.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Ноль. Сто восемьдесят градусов это левая точка: высота там равна нулю. | Nol. Yuz sakson gradus bu chap nuqta: u yerda balandlik nolga teng. | Zero. One hundred eighty degrees is the left point: the height there is zero. |
| `task.hint.1` | Сто восемьдесят градусов это левая точка окружности. | Yuz sakson gradus bu aylananing chap nuqtasi. | One hundred eighty degrees is the left point of the circle. |
| `task.hint.2` | Высота у этой точки равна нулю, а сдвиг минус один. | Bu nuqtaning balandligi nolga teng, siljishi esa minus bir. | The height of that point is zero, and the shift is minus one. |
| `task.hint.3` | Ноль. | Nol. | Zero. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой синус меньше? | Qaysi sinus kichikroq? | Which sine is smaller? |
| `order.ok` | Ты сравнил не величины, а числа со знаком: минус один меньше минус нуля целых тридцати четырёх. | Siz kattaliklarni emas, ishorali sonlarni solishtirdingiz: minus bir minus nol butun o'ttiz to'rtdan kichik. | You compared signed numbers, not sizes: minus one is less than minus zero point three four. |
| `order.bad` | Сравнивай со знаком, а не по величине. Отрицательное меньше нуля, каким бы большим оно ни казалось. | Ishora bilan solishtiring, kattaligi bo'yicha emas. Manfiy son noldan kichik, qanchalik katta ko'rinsa ham. | Compare with the sign, not by size. A negative number is less than zero, however large it looks. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `sin 180°  =  ?` |
| `task.answer` | `0` |
| `order.items` | `sin 270°` · `sin 200°` · `sin 0` · `sin 30°` |
| `order.answer` | `sin 270°  sin 200°  sin 0  sin 30°` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

Первая, третья и четвёртая строки верны. Неверна вторая: при переходе через сто восемьдесят
высота уходит вниз, и минус обязан появиться. Контрчисло вводит ученик.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob noto'g'ri. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка верна: сто восемьдесят плюс двадцать даёт двести. | Bu qator to'g'ri: yuz sakson qo'shuv yigirma ikki yuzni beradi. | This line is right: one hundred eighty plus twenty gives two hundred. |
| `hint.r3` | Это верное значение для двадцати градусов. Ищи ошибку выше. | Bu yigirma gradus uchun to'g'ri qiymat. Xatoni yuqoridan qidiring. | That is the correct value for twenty degrees. Look higher. |
| `hint.r4` | Эта строка следует из предыдущей верно. Первая неверная строка выше. | Bu qator oldingisidan to'g'ri kelib chiqadi. Birinchi xato qator yuqorida. | This line follows correctly. The first wrong line is above. |
| `proof` | Через 180 градусов высота уходит вниз. | 180 gradusdan keyin balandlik pastga tushadi. | Past 180 degrees the height goes down. |
| `entry.prompt` | Чему равен sin 200°? До сотых. | sin 200° qancha? Yuzdan birgacha. | What is sin 200°? To two decimals. |
| `entry.ok` | Минус ноль целых тридцать четыре. Величина как у двадцати градусов, а знак минус: точка ниже оси. | Minus nol butun o'ttiz to'rt. Kattaligi yigirma gradusdagidek, ishora esa minus: nuqta o'qdan pastda. | Minus zero point three four. The size matches twenty degrees, the sign is minus: the point is below the axis. |
| `entry.hint.1` | Двести градусов чуть дальше ста восьмидесяти, значит точка ниже оси. | Ikki yuz gradus yuz saksondan bir oz uzoqroq, demak nuqta o'qdan pastda. | Two hundred degrees is just past one hundred eighty, so the point is below the axis. |
| `entry.hint.2` | Величина та же, что у двадцати градусов, а знак минус. | Kattaligi yigirma gradusdagidek, ishora esa minus. | The size matches twenty degrees, and the sign is minus. |
| `entry.hint.3` | Минус ноль целых тридцать четыре. | Minus nol butun o'ttiz to'rt. | Minus zero point three four. |
| `audio.mount` | Задача. Надо найти синус двухсот градусов. | Masala. Ikki yuz gradusning sinusini topish kerak. | A task. We need to find the sine of two hundred degrees. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `200° = 180° + 20°` |
| `row.r2` | `sin(180° + α) = sin α` |
| `row.r3` | `sin 20° ≈ 0,34` |
| `row.r4` | `sin 200° ≈ 0,34` |
| `answerId` | `r2` |
| `entry.answer` | `−0,34` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

Обратная задача: не «какой знак у этого угла», а «какой угол при таких знаках». Потом отметить все
верные записи.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Знаки даны, угол нужен | Ishoralar berilgan, burchak kerak | The signs are given, the angle is needed |
| `place.prompt` | Оба числа отрицательны. Поставь точку на такой угол. | Ikki son ham manfiy. Shunday burchakka nuqta qo'ying. | Both numbers are negative. Place the point at such an angle. |
| `place.ok` | Третья четверть. Сдвиг влево, высота вниз, других вариантов нет. | Uchinchi chorak. Siljish chapga, balandlik pastga, boshqa variant yo'q. | The third quadrant. The shift left, the height down, there is no other option. |
| `place.wrong` | Нужна часть круга, где сдвиг влево и высота вниз одновременно. | Siljish chapga, balandlik esa pastga bo'lgan qism kerak. | You need the part where the shift goes left and the height down at once. |
| `multi.prompt` | Отметь все записи, верные для третьей четверти. | Uchinchi chorak uchun to'g'ri bo'lgan hamma yozuvni belgilang. | Mark every reading that is true in the third quadrant. |
| `multi.title` | Какие записи верны в третьей четверти? | Uchinchi chorakda qaysi yozuvlar to'g'ri? | Which readings are true in the third quadrant? |
| `multi.d.hint` | Тангенс там положителен: минус на минус даёт плюс. | Tangens u yerda musbat: minusga minus plyus beradi. | The tangent is positive there: minus over minus gives plus. |
| `multi.e.hint` | Сдвиг там отрицателен, точка левее центра. | Siljish u yerda manfiy, nuqta markazdan chapda. | The shift is negative there, the point is left of the centre. |
| `multi.ok` | Три записи из пяти. Знак тангенса пришёл не из памяти, а из двух других знаков. | Beshtadan uchtasi. Tangens ishorasi yoddan emas, boshqa ikki ishoradan keldi. | Three out of five. The tangent sign came not from memory but from the other two signs. |
| `audio.mount` | Теперь обратная задача. Угол не дан, даны знаки. | Endi teskari masala. Burchak berilmagan, ishoralar berilgan. | Now the inverse task. The angle is not given, the signs are. |
| `audio.work` | Поставь точку, потом отметишь все верные записи. | Nuqtani qo'ying, keyin hamma to'g'ri yozuvni belgilaysiz. | Place the point, then you will mark every true reading. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `210°` |
| `place.step` | `(−; −)  →  III` |
| `multi.a` [верно] | `cos α < 0` |
| `multi.b` [верно] | `sin α < 0` |
| `multi.c` [верно] | `tg α > 0` |
| `multi.d` | `tg α < 0` |
| `multi.e` | `cos α > 0` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `znak-po-mnemonike`

Четыре вопроса, единственный оцениваемый экран. Третий вопрос — выбор пути, два варианта: квота на
выбор из четырёх не расходуется.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Синус двухсот градусов положителен или отрицателен? | Ikki yuz gradusning sinusi musbat yoki manfiy? | Is the sine of two hundred degrees positive or negative? |
| `q1.a` [верно] | отрицателен | manfiy | negative |
| `q1.b` | положителен | musbat | positive |
| `q1.b.hint` | Точка на двухсот градусах ниже оси, а ниже оси высота отрицательна. | Ikki yuz gradusdagi nuqta o'qdan pastda, o'qdan pastda esa balandlik manfiy. | The point at two hundred degrees is below the axis, and below the axis the height is negative. |
| `q1.c` | равен нулю | nolga teng | zero |
| `q1.c.hint` | Ноль был бы ровно на оси, то есть на ста восьмидесяти. | Nol aynan o'qda, ya'ni yuz saksonda bo'lardi. | Zero would be exactly on the axis, that is at one hundred eighty. |
| `q1.d` | нельзя сказать | aniqlash mumkin emas | cannot be said |
| `q1.d.hint` | Можно: достаточно посмотреть, выше оси точка или ниже. | Mumkin: nuqta o'qdan yuqorida yoki pastda ekaniga qarash yetarli. | You can: just look whether the point is above or below the axis. |
| `q2.prompt` | В какой четверти лежит двести градусов? | Ikki yuz gradus qaysi chorakda yotadi? | Which quadrant does two hundred degrees lie in? |
| `q2.a` [верно] | в третьей | uchinchida | the third |
| `q2.b` | во второй | ikkinchida | the second |
| `q2.b.hint` | Вторая четверть кончается на ста восьмидесяти. | Ikkinchi chorak yuz saksonda tugaydi. | The second quadrant ends at one hundred eighty. |
| `q2.c` | в четвёртой | to'rtinchida | the fourth |
| `q2.c.hint` | Четвёртая начинается после двухсот семидесяти. | To'rtinchi chorak ikki yuz yetmishdan keyin boshlanadi. | The fourth begins after two hundred seventy. |
| `q2.d` | в первой | birinchida | the first |
| `q2.d.hint` | Первая это от нуля до девяноста. | Birinchisi noldan to'qsongacha. | The first runs from zero to ninety. |
| `q3.prompt` | Как узнать знак тангенса? | Tangens ishorasini qanday bilib olamiz? | How do you find the sign of the tangent? |
| `q3.a` [верно] | сравнить два знака | ikki ishorani solishtirish | compare the two signs |
| `q3.a.ok` | Да. Одинаковые дают плюс, разные минус. | Ha. Bir xil ishoralar plyus, har xil ishoralar minus beradi. | Yes. Matching signs give plus, differing signs minus. |
| `q3.b` | выучить третье правило | uchinchi qoidani yodlash | memorise a third rule |
| `q3.b.hint` | Третьего правила нет: знак отношения получается из двух знаков. | Uchinchi qoida yo'q: nisbatning ishorasi ikki ishoradan chiqadi. | There is no third rule: the sign of a ratio comes from the two signs. |
| `q4.prompt` | Тангенс двухсот градусов положителен или отрицателен? | Ikki yuz gradusning tangensi musbat yoki manfiy? | Is the tangent of two hundred degrees positive or negative? |
| `q4.a` [верно] | положителен | musbat | positive |
| `q4.b` | отрицателен | manfiy | negative |
| `q4.b.hint` | Оба числа там отрицательны, а минус на минус даёт плюс. | U yerda ikki son ham manfiy, minusga minus esa plyus beradi. | Both numbers are negative there, and minus over minus gives plus. |
| `q4.c` | равен нулю | nolga teng | zero |
| `q4.c.hint` | Ноль был бы там, где высота равна нулю, то есть на оси. | Nol balandlik nolga teng joyda, ya'ni o'qda bo'lardi. | Zero would be where the height is zero, that is on the axis. |
| `q4.d` | не существует | mavjud emas | does not exist |
| `q4.d.hint` | Тангенса нет только там, где сдвиг равен нулю: на девяноста и двухсот семидесяти. | Tangens faqat siljish nolga teng joyda yo'q: to'qsonda va ikki yuz yetmishda. | The tangent is missing only where the shift is zero: at ninety and at two hundred seventy. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `sin 200° < 0` |
| `q2.done` | `200°  →  III` |
| `q3.done` | `(−) : (−) = (+)` |
| `q4.done` | `tg 200° > 0` |
| `angles` | `200° · 200° · 200° · 200°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

Прогноз против результата. Новой математики нет.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Определяю знак по направлению, а не по памяти | Ishorani yo'nalish bo'yicha aniqlayman, yoddan emas | I find the sign by direction, not from memory |
| `can.2` | Называю четверть любого угла | Har qanday burchakning chorakini ayta olaman | I name the quadrant of any angle |
| `can.3` | Знак тангенса вывожу из двух знаков | Tangens ishorasini ikki ishoradan chiqaraman | I derive the tangent sign from the two signs |
| `can.4` | Привожу значение к острому углу | Qiymatni o'tkir burchakka keltiraman | I reduce a value to the acute angle |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: номер четверти. | Bitta joy takrorlashni talab qiladi: chorak raqami. | One place needs review: the number of the quadrant. |
| `levels.back` | Вернись к правилу и к экрану 3. | Qoidaga va 3-ekranga qayting. | Go back to the rule and to screen 3. |
| `bridge` | Урок 5: тот же круг, но поворот в обратную сторону — и оттуда чётность и период. | 5-dars: o'sha aylana, lekin teskari tomonga burish, va shundan juftlik va davr. | Lesson 5: the same circle, but turning the other way, and from that parity and period. |
| `lifehack` | Не помни таблицу. Посмотри, куда смотрит сдвиг и куда высота. | Jadvalni yodlamang. Siljish qayoqqa, balandlik qayoqqa qaraganiga qarang. | Do not memorise the table. Look where the shift points and where the height points. |
| `sheetTitle` | Знаки · шпаргалка | Ishoralar · shpargalka | The signs · cheat sheet |
| `sheetSrc` | 10 класс · урок 4 | 10-sinf · 4-dars | Grade 10 · lesson 4 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Синус двухсот градусов отрицателен, и это видно по чертежу, а не по памяти. | Ikki yuz gradusning sinusi manfiy, va bu chizmadan ko'rinadi, yoddan emas. | The sine of two hundred degrees is negative, and that shows on the drawing, not in memory. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `sin 200° > 0` |
| `hook.b` | `sin 200° < 0` |
| `proved` | `sin 200° = −0,34` |
| `law` | `I (+; +)   II (−; +)   III (−; −)   IV (+; −)` |
| `sheet.1` | `cos α > 0  ↔  x > 0` |
| `sheet.2` | `tg α > 0  ↔  I, III` |
| `sheet.3` | `sin(180° + α) = −sin α` |
| `sheet.4` | `cos 90° = 0,   sin 180° = 0` |
| `sheet.5` | `tg 90°  —,   tg 270°  —` |
