# Урок 11 — `cos x = a` · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS10_KONTENT.md`.

Скелет: `DARS11_13_SKELET.md` §6. Опора в учебнике: алгебра 2022, стр. 143–144.

**Главное решение урока.** Знак плюс-минус не даётся правилом: он **получается** из того, где
стоят точки. У косинуса вертикаль отсекает две точки, симметричные относительно горизонтальной
оси, а такие точки отличаются только знаком угла. Поэтому склейка короче, чем у синуса, и шаг
остаётся полным оборотом.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | КОСИНУС | KOSINUS | THE COSINE |
| `title` | Какая запись верна для косинуса? | Kosinus uchun qaysi yozuv to'g'ri? | Which reading is right for the cosine? |
| `row.a.name` | знак плюс-минус | plyus-minus ishora | a plus-minus sign |
| `row.b.name` | множитель со степенью | darajali ko'paytuvchi | a factor with a power |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` [верно] | первая | birinchi | the first |
| `probe.b` | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посмотрим, где стоят точки. | Javobingiz yozib olindi. Endi nuqtalar qayerda turishini ko'ramiz. | Your answer is saved. Now we will look at where the points stand. |
| `audio.mount*` | Вертикальная прямая опускается на сдвиг одна вторая и задевает окружность в двух точках. | Vertikal to'g'ri chiziq bir ikkidan siljishga tushadi va aylanani ikki nuqtada kesadi. | The vertical line moves to the shift one half and meets the circle at two points. |
| `audio.r1` | Первая запись ставит перед углом знак плюс-минус. | Birinchi yozuv burchak oldiga plyus-minus ishorasini qo'yadi. | The first reading puts a plus-minus sign before the angle. |
| `audio.r2` | Вторая берёт множитель со степенью, как у синуса. | Ikkinchisi sinusdagidek darajali ko'paytuvchini oladi. | The second takes a factor with a power, as for the sine. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `cos x = 1/2` |
| `row.a.value` | `x = ± 60° + 360°n` |
| `row.b.value` | `x = (−1)ⁿ·60° + 180°n` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед косинусом | Kosinusdan oldin uch savol | Three questions before the cosine |
| `q1.prompt` | Какая прямая нужна для уравнения с косинусом? | Kosinusli tenglama uchun qanday to'g'ri chiziq kerak? | Which line is needed for an equation with the cosine? |
| `q1.a` [верно] | вертикальная | vertikal | a vertical one |
| `q1.b` | горизонтальная | gorizontal | a horizontal one |
| `q1.b.hint` | Горизонтальная задаёт высоту, то есть синус. | Gorizontal balandlikni, ya'ni sinusni beradi. | A horizontal line sets the height, that is the sine. |
| `q1.c` | наклонная | qiya | a slanted one |
| `q1.c.hint` | Наклонная не отвечает ни одной координате. | Qiya chiziq hech qaysi koordinataga mos kelmaydi. | A slanted line matches no coordinate. |
| `q1.d` | никакая | hech qanday | none at all |
| `q1.d.hint` | Прямая нужна: без неё точки не найти. | To'g'ri chiziq kerak: usiz nuqtalarni topib bo'lmaydi. | A line is needed: without it the points cannot be found. |
| `q2.prompt` | Какое окно у арккосинуса? | Arkkosinusning oynasi qanday? | What is the window of the arccosine? |
| `q2.a` [верно] | от нуля до ста восьмидесяти | noldan yuz saksongacha | from zero to one hundred eighty |
| `q2.b` | от минус девяноста до девяноста | minus to'qsondan to'qsongacha | from minus ninety to ninety |
| `q2.b.hint` | Это окно арксинуса, у арккосинуса оно другое. | Bu arksinusning oynasi, arkkosinusniki boshqa. | That is the arcsine window, the arccosine has a different one. |
| `q2.c` | от нуля до девяноста | noldan to'qsongacha | from zero to ninety |
| `q2.c.hint` | Тогда отрицательные значения косинуса остались бы без ответа. | Unda kosinusning manfiy qiymatlari javobsiz qolardi. | Then negative values of the cosine would have no answer. |
| `q2.d` | вся окружность | butun aylana | the whole circle |
| `q2.d.hint` | Тогда ответом был бы список, а нужен один угол. | Unda javob ro'yxat bo'lardi, bizga esa bitta burchak kerak. | Then the answer would be a list, and one angle is needed. |
| `q3.prompt` | Что возвращает точку на прежнее место? | Nuqtani avvalgi joyiga nima qaytaradi? | What returns the point to its former place? |
| `q3.a` [верно] | целое число оборотов | butun sondagi aylana | a whole number of turns |
| `q3.b` | половина оборота | yarim aylana | half a turn |
| `q3.b.hint` | Половина уводит точку напротив. | Yarim aylana nuqtani qarshi tomonga olib ketadi. | Half a turn sends the point opposite. |
| `q3.c` | четверть оборота | chorak aylana | a quarter turn |
| `q3.c.hint` | Четверть переводит точку на соседнюю ось. | Chorak nuqtani qo'shni o'qqa olib o'tadi. | A quarter moves the point to the neighbouring axis. |
| `q3.d` | ничто | hech narsa | nothing |
| `q3.d.hint` | Возвращает: полный оборот приводит точку туда же. | Qaytaradi: to'liq aylana nuqtani o'sha yerga olib keladi. | It does: a full turn brings the point to the same place. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `x = a` |
| `q2.done` | `arccos a ∈ [0°; 180°]` |
| `q3.done` | `α + 360°n` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Вертикаль даёт две точки | Vertikal chiziq ikkita nuqta beradi | The vertical gives two points |
| `show.1.1` | сдвиг задан | siljish berilgan | the shift is given |
| `show.1.2` | прямая идёт вертикально | to'g'ri chiziq vertikal ketadi | the line runs vertically |
| `show.2.1` | точек две | nuqta ikkita | there are two points |
| `show.2.2` | одна сверху, другая снизу | biri yuqorida, ikkinchisi pastda | one above, one below |
| `audio.mount` | В уравнении с косинусом задан сдвиг, поэтому прямая вертикальная. | Kosinusli tenglamada siljish berilgan, shuning uchun to'g'ri chiziq vertikal. | In an equation with the cosine the shift is given, so the line is vertical. |
| `audio.cut*` | Прямая садится на место и задевает окружность в двух точках. Одна сверху, другая снизу, и сдвиг у них одинаковый: шестьдесят градусов и минус шестьдесят. | To'g'ri chiziq joyiga tushadi va aylanani ikki nuqtada kesadi. Biri yuqorida, ikkinchisi pastda, siljishlari esa bir xil: oltmish gradus va minus oltmish. | The line settles and meets the circle at two points. One above, one below, with the same shift: sixty degrees and minus sixty. |
| `audio.work` | Теперь сам. Поставь точку во вторую из них, ту, что снизу. | Endi o'zingiz. Ulardan ikkinchisiga, pastdagisiga nuqta qo'ying. | Now you. Place the point at the second of them, the one below. |
| `work.prompt` | Поставь точку во второй корень, тот, что снизу. | Ikkinchi ildizga, pastdagisiga nuqta qo'ying. | Place the point at the second root, the one below. |
| `work.ok` | Минус шестьдесят градусов, то есть триста. Сдвиг тот же, значит равенство верное. | Minus oltmish gradus, ya'ni uch yuz. Siljish o'sha, demak tenglik to'g'ri. | Minus sixty degrees, that is three hundred. The same shift, so the equality holds. |
| `work.hint.1` | Нужна вторая точка на той же вертикали. | O'sha vertikaldagi ikkinchi nuqta kerak. | You need the second point on the same vertical. |
| `work.hint.2` | Она ниже горизонтальной оси, справа. | U gorizontal o'qdan pastda, o'ngda. | It is below the horizontal axis, on the right. |
| `work.hint.3` | Триста градусов. | Uch yuz gradus. | Three hundred degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 4 · `explain2` · ответ `lead` · тег `odin-koren`

Свидетель урока: зеркало по горизонтальной оси. Углы у точек противоположны, а не чередуются.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Углы у точек противоположны | Nuqtalarning burchaklari qarama-qarshi | The angles of the points are opposite |
| `show.1.1` | зеркало по горизонтальной оси | gorizontal o'q bo'yicha ko'zgu | a mirror along the horizontal axis |
| `show.1.2` | сдвиг у обеих одинаковый | ikkalasining siljishi bir xil | both have the same shift |
| `show.2.1` | углы отличаются знаком | burchaklar ishora bilan farq qiladi | the angles differ by a sign |
| `show.2.2` | шестьдесят и минус шестьдесят | oltmish va minus oltmish | sixty and minus sixty |
| `audio.mount` | Посмотрим на эти две точки внимательнее. | Bu ikki nuqtaga diqqat bilan qaraymiz. | Let us look at these two points more closely. |
| `audio.mirror*` | Нижняя точка это отражение верхней по горизонтальной оси. Это было на пятом уроке: зеркало меняет знак высоты, а сдвиг оставляет. Значит угол у неё тот же, но со знаком минус. | Pastki nuqta yuqoridagisining gorizontal o'q bo'yicha aksi. Bu beshinchi darsda edi: ko'zgu balandlik ishorasini almashtiradi, siljishni esa qoldiradi. Demak uning burchagi o'sha, lekin minus ishora bilan. | The lower point is the reflection of the upper one across the horizontal axis. That was in lesson five: the mirror flips the sign of the height and leaves the shift. So its angle is the same but with a minus. |
| `audio.work` | Теперь сам. Поставь точку туда, куда приведёт минус шестьдесят градусов. | Endi o'zingiz. Minus oltmish gradus olib keladigan joyga nuqta qo'ying. | Now you. Place the point where minus sixty degrees leads. |
| `work.prompt` | Куда приведёт угол −60°? | −60° burchak qayerga olib keladi? | Where does the angle −60° lead? |
| `work.ok` | В нижнюю точку. Это тот же корень, просто записанный отрицательным поворотом. | Pastki nuqtaga. Bu o'sha ildiz, faqat manfiy burish bilan yozilgan. | To the lower point. It is the same root, just written as a negative turn. |
| `work.hint.1` | Отрицательный поворот идёт по часовой стрелке. | Manfiy burish soat mili bo'ylab boradi. | A negative turn goes clockwise. |
| `work.hint.2` | Шестьдесят градусов по часовой это правая нижняя часть. | Soat mili bo'ylab oltmish gradus bu o'ng past qism. | Sixty degrees clockwise is the lower right part. |
| `work.hint.3` | Триста градусов. | Uch yuz gradus. | Three hundred degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 5 · `explain3` · ответ `lead` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Одна запись со знаком плюс-минус | Plyus-minus ishorali bitta yozuv | One reading with a plus-minus sign |
| `show.1.1` | два угла отличаются знаком | ikki burchak ishora bilan farq qiladi | the two angles differ by a sign |
| `show.1.2` | значит хватает знака плюс-минус | demak plyus-minus ishora yetadi | so a plus-minus sign is enough |
| `show.2.1` | к каждому прибавляются обороты | har biriga aylanalar qo'shiladi | turns are added to each |
| `show.2.2` | шаг остался полным оборотом | qadam to'liq aylana bo'lib qoldi | the step stayed a full turn |
| `audio.mount` | Углы у точек отличаются только знаком, и это позволяет записать их вместе. | Nuqtalarning burchaklari faqat ishora bilan farq qiladi, va bu ularni birga yozishga imkon beradi. | The angles differ only by a sign, and that lets us write them together. |
| `audio.join*` | Пишем плюс-минус шестьдесят градусов плюс триста шестьдесят умножить на эн. Плюс даёт верхнюю точку, минус нижнюю, а обороты добавляются к каждой. У синуса склейка была длиннее, потому что там углы знаком не связаны. | Plyus-minus oltmish gradus qo'shilgan uch yuz oltmish karra en deb yozamiz. Plyus yuqoridagi nuqtani, minus pastdagisini beradi, aylanalar esa har biriga qo'shiladi. Sinusda yig'ish uzunroq edi, chunki u yerda burchaklar ishora bilan bog'lanmagan. | We write plus-minus sixty degrees plus three hundred sixty times n. The plus gives the upper point, the minus the lower, and the turns add to each. For the sine the folding was longer because there the angles are not related by a sign. |
| `audio.work` | Теперь сам. Поставь точку туда, куда приведёт запись с плюсом и номером один. | Endi o'zingiz. Plyus va bir raqamli yozuv olib keladigan joyga nuqta qo'ying. | Now you. Place the point where the reading with a plus and the number one leads. |
| `work.prompt` | Куда приведёт `+60° + 360°`? | `+60° + 360°` qayerga olib keladi? | Where does `+60° + 360°` lead? |
| `work.ok` | В верхнюю точку. Полный оборот ничего не меняет. | Yuqoridagi nuqtaga. To'liq aylana hech narsani o'zgartirmaydi. | To the upper point. A full turn changes nothing. |
| `work.hint.1` | Отбрось полный оборот. | To'liq aylanani tashlang. | Drop the full turn. |
| `work.hint.2` | Останется шестьдесят градусов. | Oltmish gradus qoladi. | Sixty degrees is left. |
| `work.hint.3` | Шестьдесят градусов. | Oltmish gradus. | Sixty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 6 · `explain4` · ответ `number` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Когда точка одна | Nuqta bitta bo'lganda | When there is only one point |
| `show.1.1` | сдвиг равен единице | siljish birga teng | the shift equals one |
| `show.1.2` | вертикаль касается края | vertikal chiziq chetiga tegadi | the vertical touches the edge |
| `show.2.1` | точка всего одна | nuqta jami bitta | there is only one point |
| `show.2.2` | знак плюс-минус не нужен | plyus-minus ishora kerak emas | the plus-minus sign is not needed |
| `audio.mount` | Возьмём сдвиг, равный единице. Вертикаль стоит у правого края. | Birga teng siljishni olaylik. Vertikal chiziq o'ng chetda turadi. | Take the shift equal to one. The vertical stands at the right edge. |
| `audio.touch*` | Она касается окружности в одной точке, а не пересекает её. Верх и низ совпали, и знак плюс-минус здесь ничего не добавляет. | U aylanaga bir nuqtada tegadi, kesib o'tmaydi. Yuqori va past ustma-ust tushdi, va plyus-minus ishora bu yerda hech narsa qo'shmaydi. | It touches the circle at one point instead of crossing it. The top and the bottom coincided, and the plus-minus sign adds nothing here. |
| `audio.work` | Посчитай сам. Сколько серий в ответе уравнения косинус икс равен единице? | O'zingiz hisoblang. Kosinus iks birga teng tenglamaning javobida nechta seriya bor? | Compute it yourself. How many series are in the answer of cosine x equals one? |
| `work.prompt` | Сколько серий у cos x = 1? | cos x = 1 da nechta seriya bor? | How many series does cos x = 1 have? |
| `work.ok` | Одна. Точка всего одна, и повторяется она через полный оборот. | Bitta. Nuqta jami bitta, va u to'liq aylanadan keyin takrorlanadi. | One. There is a single point, and it repeats after a full turn. |
| `work.hint.1` | Посчитай точки, где вертикаль встретила окружность. | Vertikal chiziq aylanani uchratgan nuqtalarni sanang. | Count the points where the vertical met the circle. |
| `work.hint.2` | Она коснулась, а не пересекла. | U tegdi, kesmadi. | It touched instead of crossing. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Вертикаль тоже может пройти мимо | Vertikal chiziq ham yonidan o'tishi mumkin | The vertical can also miss |
| `show.1.1` | сдвиг два | siljish ikki | the shift is two |
| `show.1.2` | вертикаль правее окружности | vertikal chiziq aylanadan o'ngda | the vertical is right of the circle |
| `show.2.1` | общих точек нет | umumiy nuqta yo'q | there are no common points |
| `show.2.2` | значит нет и корней | demak ildiz ham yo'q | so there are no roots |
| `audio.mount` | Возьмём уравнение косинус икс равен двум. Вертикаль стоит правее окружности. | Kosinus iks ikkiga teng tenglamani olaylik. Vertikal chiziq aylanadan o'ngda turadi. | Take the equation cosine x equals two. The vertical stands to the right of the circle. |
| `audio.miss*` | Она проходит мимо и ни разу не задевает круг. Сдвиг больше единицы на окружности не встречается, значит корней нет. | U yonidan o'tadi va aylanaga bir marta ham tegmaydi. Birdan katta siljish aylanada uchramaydi, demak ildiz yo'q. | It passes by and never touches the circle. A shift greater than one never occurs on the circle, so there are no roots. |
| `audio.work` | Посчитай сам. Сколько корней у уравнения косинус икс равен двум? | O'zingiz hisoblang. Kosinus iks ikkiga teng tenglamaning nechta ildizi bor? | Compute it yourself. How many roots does cosine x equals two have? |
| `work.prompt` | Сколько корней у cos x = 2? | cos x = 2 ning nechta ildizi bor? | How many roots does cos x = 2 have? |
| `work.ok` | Ноль. Сдвиг больше единицы на окружности не бывает ни при каком угле. | Nol. Birdan katta siljish aylanada hech qanday burchakda bo'lmaydi. | Zero. A shift greater than one never happens on the circle at any angle. |
| `work.hint.1` | Посмотри, задела ли вертикаль окружность. | Vertikal chiziq aylanaga tegdimi, qarang. | Look whether the vertical touched the circle. |
| `work.hint.2` | Она прошла правее, общих точек нет. | U o'ngdan o'tdi, umumiy nuqta yo'q. | It passed to the right, there are no common points. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Общая запись для косинуса | Kosinus uchun umumiy yozuv | The joint reading for the cosine |
| `probe.question` | Почему у косинуса знак плюс-минус, а не множитель? | Nega kosinusda ko'paytuvchi emas, plyus-minus ishora? | Why does the cosine take a plus-minus sign and not a factor? |
| `probe.a` [верно] | точки симметричны по горизонтальной оси | nuqtalar gorizontal o'q bo'yicha simmetrik | the points are symmetric across the horizontal axis |
| `probe.b` | так короче записывать | shunday yozish qisqaroq | it is shorter to write |
| `probe.b.hint` | Короче это следствие, а причина в том, где стоят точки. | Qisqaligi natija, sabab esa nuqtalar qayerda turishida. | Shortness is the consequence, the cause is where the points stand. |
| `rule.lawLabel` | Склейка | Yig'ish | The folding |
| `rule.lines.1` | У косинуса точки симметричны относительно горизонтальной оси, поэтому их углы отличаются только знаком. | Kosinusda nuqtalar gorizontal o'qqa nisbatan simmetrik, shuning uchun burchaklari faqat ishora bilan farq qiladi. | For the cosine the points are symmetric across the horizontal axis, so their angles differ only by a sign. |
| `rule.lines.2` | Поэтому хватает знака плюс-минус, а шаг остаётся полным оборотом. | Shuning uchun plyus-minus ishora yetadi, qadam esa to'liq aylana bo'lib qoladi. | So a plus-minus sign is enough, and the step stays a full turn. |
| `rule.lines.3` | Уравнение решается только при `−1 ≤ a ≤ 1`. | Tenglama faqat `−1 ≤ a ≤ 1` da yechiladi. | The equation is solvable only for `−1 ≤ a ≤ 1`. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Зеркало срабатывает ещё раз, и правило открывается рядом. Знак плюс-минус это не сокращение записи, а то, что точки стоят одна под другой. | Ko'zgu yana bir bor ishlaydi, va qoida yonida ochiladi. Plyus-minus ishora yozuvning qisqartmasi emas, nuqtalar bir-birining ostida turgani. | The mirror works once more, and the rule opens beside it. The plus-minus sign is not shorthand but the fact that the points stand one below the other. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `x = ± arccos a + 360°n` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Уравнение и его серия | Tenglama va uning seriyasi | The equation and its series |
| `match.prompt` | Соедини уравнение с его записью. | Tenglamani o'z yozuvi bilan birlashtiring. | Match the equation with its reading. |
| `match.ok` | У края знак плюс-минус ничего не добавляет: там точка одна. В середине точек две, и знак нужен. | Chetda plyus-minus ishora hech narsa qo'shmaydi: u yerda nuqta bitta. O'rtada nuqta ikkita, va ishora kerak. | At the edge the plus-minus sign adds nothing: there is one point there. In the middle there are two points, and the sign is needed. |
| `audio.mount` | Четыре уравнения и четыре записи. Соедини их. | To'rt tenglama va to'rt yozuv. Ularni birlashtiring. | Four equations and four readings. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `cos x = 1/2` · `cos x = 1` · `cos x = −1` · `cos x = 0` |
| `match.a` | `± 60° + 360°n` |
| `match.b` | `360°n` |
| `match.c` | `180° + 360°n` |
| `match.d` | `± 90° + 360°n` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Собери ответ по шагам | Javobni qadam bilan yig'ing | Assemble the answer step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | проводим вертикаль | vertikal chiziq o'tkazamiz | we draw the vertical |
| `order.s2` | находим угол в окне | oynadagi burchakni topamiz | we find the angle in the window |
| `order.s3` | ставим знак плюс-минус | plyus-minus ishorani qo'yamiz | we put the plus-minus sign |
| `order.s4` | прибавляем обороты | aylanalarni qo'shamiz | we add the turns |
| `order.ok` | Порядок такой всегда. Если поставить знак раньше, чем найден угол, знак будет некуда ставить. | Tartib doim shunday. Ishorani burchak topilmasdan qo'ysak, uni qo'yadigan joy bo'lmaydi. | The order is always this. Putting the sign before the angle is found leaves the sign nowhere to go. |
| `order.bad` | Сначала вертикаль, потом угол из окна, потом знак, и только потом обороты. | Avval vertikal chiziq, keyin oynadagi burchak, keyin ishora, keyingina aylanalar. | First the vertical, then the angle from the window, then the sign, and only then the turns. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `60°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Четыреста двадцать. Знак плюс и один полный оборот сверх шестидесяти. | To'rt yuz yigirma. Plyus ishora va oltmish ustiga bitta to'liq aylana. | Four hundred twenty. A plus sign and one full turn on top of sixty. |
| `task.hint.1` | Возьми знак плюс и подставь единицу. | Plyus ishorani oling va birni qo'ying. | Take the plus sign and substitute one. |
| `task.hint.2` | Шестьдесят плюс триста шестьдесят. | Oltmish qo'shilgan uch yuz oltmish. | Sixty plus three hundred sixty. |
| `task.hint.3` | Четыреста двадцать. | To'rt yuz yigirma. | Four hundred twenty. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой корень меньше? | Qaysi ildiz kichikroq? | Which root is smaller? |
| `order.ok` | Ты подставил знак и номер и сравнил числа, а не записи. | Siz ishora va raqamni qo'ydingiz va yozuvlarni emas, sonlarni solishtirdingiz. | You substituted the sign and the number and compared numbers, not readings. |
| `order.bad` | Подставь в каждую запись её знак и номер, потом сравни. | Har yozuvga ishora va raqamini qo'ying, keyin solishtiring. | Put the sign and the number into each reading, then compare. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `+60° + 360°n,   n = 1   →   ?` |
| `task.answer` | `420` |
| `order.items` | `−60°` · `60°` · `300°` · `420°` |
| `order.answer` | `−60°  60°  300°  420°` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неполный. Где? | Javob to'liq emas. Qayerda? | The answer is incomplete. Where? |
| `hint.r1` | Эта строка верна: арккосинус одной второй действительно равен шестидесяти. | Bu qator to'g'ri: bir ikkidanning arkkosinusi haqiqatan oltmishga teng. | This line is right: the arccosine of one half really is sixty. |
| `hint.r2` | Эта строка тоже верна: у минус шестидесяти сдвиг такой же. | Bu qator ham to'g'ri: minus oltmishning siljishi ham o'sha. | This line is right too: at minus sixty the shift is the same. |
| `hint.r4` | Эта строка повторяет ошибку предыдущей. Первая неверная строка выше. | Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida. | This line repeats the error of the previous one. The first wrong line is above. |
| `proof` | Нижняя точка потерялась вместе со знаком. | Pastki nuqta ishora bilan birga yo'qoldi. | The lower point was lost together with the sign. |
| `entry.prompt` | Сколько корней у cos x = 1/2 на одном обороте? | Bitta aylanada cos x = 1/2 ning nechta ildizi bor? | How many roots does cos x = 1/2 have on one turn? |
| `entry.ok` | Два. Вертикаль задевает окружность сверху и снизу. | Ikkita. Vertikal chiziq aylanani yuqoridan va pastdan kesadi. | Two. The vertical meets the circle above and below. |
| `entry.hint.1` | Посчитай точки на одном обороте. | Bitta aylanadagi nuqtalarni sanang. | Count the points on one turn. |
| `entry.hint.2` | Одна сверху и одна снизу. | Biri yuqorida, biri pastda. | One above and one below. |
| `entry.hint.3` | Два. | Ikkita. | Two. |
| `audio.mount` | Задача. Решить уравнение косинус икс равен одной второй. | Masala. Kosinus iks bir ikkidanga teng tenglamani yechish. | A task. Solve the equation cosine x equals one half. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `arccos 1/2 = 60°` |
| `row.r2` | `cos(−60°) = 1/2` |
| `row.r3` | `x = 60° + 360°n` |
| `row.r4` | `n = 1   →   420°` |
| `answerId` | `r3` |
| `entry.answer` | `2` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По корню назвать серию | Ildizdan seriyani aytish | From a root back to its series |
| `place.prompt` | Поставь точку на 300 градусов. | Nuqtani 300 gradusga qo'ying. | Place the point at 300 degrees. |
| `place.ok` | Это нижняя точка. В неё ведёт запись со знаком минус. | Bu pastki nuqta. Unga minus ishorali yozuv olib boradi. | This is the lower point. The reading with a minus leads to it. |
| `place.wrong` | Триста градусов это ниже горизонтальной оси и правее вертикальной. | Uch yuz gradus gorizontal o'qdan pastda va vertikal o'qdan o'ngda. | Three hundred degrees is below the horizontal axis and right of the vertical one. |
| `multi.prompt` | Отметь все записи, которые дают ЭТУ ЖЕ точку. | AYNAN shu nuqtani beradigan hamma yozuvni belgilang. | Mark every reading that gives THIS SAME point. |
| `multi.title` | Какие записи дают эту же точку? | Qaysi yozuvlar aynan shu nuqtani beradi? | Which readings give this same point? |
| `multi.d.hint` | Шестьдесят это верхняя точка, а не эта. | Oltmish bu yuqoridagi nuqta, bu emas. | Sixty is the upper point, not this one. |
| `multi.e.hint` | Здесь прибавлена половина оборота, точка окажется слева. | Bu yerda yarim aylana qo'shilgan, nuqta chapda bo'ladi. | Here half a turn was added, the point ends up on the left. |
| `multi.ok` | Три из пяти. Все они это минус шестьдесят плюс целое число оборотов. | Beshtadan uchtasi. Ularning hammasi minus oltmish qo'shilgan butun sondagi aylana. | Three out of five. All of them are minus sixty plus a whole number of turns. |
| `audio.mount` | Теперь обратная задача. Дана точка, а нужны записи, которые в неё ведут. | Endi teskari masala. Nuqta berilgan, unga olib keladigan yozuvlar kerak. | Now the inverse task. A point is given, and the readings leading to it are needed. |
| `audio.work` | Поставь точку, потом отметишь все записи, которые ведут сюда же. | Nuqtani qo'ying, keyin shu yerga olib keladigan hamma yozuvni belgilaysiz. | Place the point, then you will mark every reading that leads here. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `300°` |
| `place.step` | `−60° + 360°n` |
| `multi.a` [верно] | `−60°` |
| `multi.b` [верно] | `660°` |
| `multi.c` [верно] | `−420°` |
| `multi.d` | `60°` |
| `multi.e` | `120°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Какой знак стоит в записи для косинуса? | Kosinus yozuvida qanday ishora turadi? | Which sign stands in the cosine reading? |
| `q1.a` [верно] | плюс-минус | plyus-minus | plus-minus |
| `q1.b` | минус единица в степени | darajali minus bir | minus one in a power |
| `q1.b.hint` | Это запись для синуса: там углы знаком не связаны. | Bu sinusning yozuvi: u yerda burchaklar ishora bilan bog'lanmagan. | That is the sine reading: there the angles are not related by a sign. |
| `q1.c` | только плюс | faqat plyus | only a plus |
| `q1.c.hint` | Тогда нижняя точка выпадет из ответа. | Unda pastki nuqta javobdan tushib qoladi. | Then the lower point drops out of the answer. |
| `q1.d` | только минус | faqat minus | only a minus |
| `q1.d.hint` | Тогда выпадет верхняя. | Unda yuqoridagisi tushib qoladi. | Then the upper one drops out. |
| `q2.prompt` | Чему равен шаг в записи для косинуса? | Kosinus yozuvida qadam qanchaga teng? | What is the step in the cosine reading? |
| `q2.a` [верно] | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q2.b` | сто восемьдесят | yuz sakson | one hundred eighty |
| `q2.b.hint` | Сто восемьдесят это шаг у синуса, где записи чередуются. | Yuz sakson bu sinusdagi qadam, u yerda yozuvlar almashadi. | One hundred eighty is the sine step, where the readings alternate. |
| `q2.c` | девяносто | to'qson | ninety |
| `q2.c.hint` | Четверть оборота точку не возвращает. | Chorak aylana nuqtani qaytarmaydi. | A quarter turn does not return the point. |
| `q2.d` | зависит от угла | burchakka bog'liq | it depends on the angle |
| `q2.d.hint` | Шаг всегда один и тот же. | Qadam doim bir xil. | The step is always the same. |
| `q3.prompt` | Сколько серий у cos x = −1? | cos x = −1 da nechta seriya bor? | How many series does cos x = −1 have? |
| `q3.a` [верно] | одна | bitta | one |
| `q3.a.ok` | Да. Вертикаль коснулась левого края, точка одна. | Ha. Vertikal chiziq chap chetiga tegdi, nuqta bitta. | Yes. The vertical touched the left edge, there is one point. |
| `q3.b` | две | ikkita | two |
| `q3.b.hint` | Верх и низ там совпали в одну точку. | U yerda yuqori va past bitta nuqtaga birlashdi. | The top and the bottom merged into one point there. |
| `q4.prompt` | Сколько корней у cos x = 2? | cos x = 2 ning nechta ildizi bor? | How many roots does cos x = 2 have? |
| `q4.a` [верно] | ни одного | hech qaysi | none |
| `q4.b` | бесконечно много | cheksiz ko'p | infinitely many |
| `q4.b.hint` | Вертикаль прошла правее окружности. | Vertikal chiziq aylanadan o'ngdan o'tdi. | The vertical passed to the right of the circle. |
| `q4.c` | два | ikkita | two |
| `q4.c.hint` | Общей точки нет ни одной. | Umumiy nuqta bitta ham yo'q. | There is not a single common point. |
| `q4.d` | один | bitta | one |
| `q4.d.hint` | Один был бы при касании, а тут прямая прошла мимо. | Bitta tekkanda bo'lardi, bu yerda esa chiziq yonidan o'tdi. | One would happen at a touch, here the line missed. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `±` |
| `q2.done` | `360°n` |
| `q3.done` | `1` |
| `q4.done` | `0` |
| `angles` | `60°` · `300°` · `180°` · `90°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Провожу вертикаль и вижу обе точки | Vertikal chiziq o'tkazaman va ikkala nuqtani ko'raman | I draw the vertical and see both points |
| `can.2` | Знаю, откуда берётся знак плюс-минус | Plyus-minus ishora qayerdan kelishini bilaman | I know where the plus-minus sign comes from |
| `can.3` | Помню, что шаг остаётся полным оборотом | Qadam to'liq aylana bo'lib qolishini eslayman | I remember the step stays a full turn |
| `can.4` | Вижу случаи, когда точка одна или её нет | Nuqta bitta yoki yo'q bo'lgan holatlarni ko'raman | I see the cases with one point or none |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: чему равен шаг. | Bitta joy takrorlashni talab qiladi: qadam qanchaga teng. | One place needs review: what the step equals. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Урок 12: тангенс. Там точек тоже две, но обе дают одно и то же значение. | 12-dars: tangens. U yerda ham nuqta ikkita, lekin ikkalasi bir xil qiymat beradi. | Lesson 12: the tangent. There are two points there too, but both give the same value. |
| `lifehack` | Знак плюс-минус это не сокращение, а две точки одна под другой. | Plyus-minus ishora qisqartma emas, bir-birining ostidagi ikki nuqta. | The plus-minus sign is not shorthand but two points one below the other. |
| `sheetTitle` | Косинус · шпаргалка | Kosinus · shpargalka | The cosine · cheat sheet |
| `sheetSrc` | 10 класс · урок 11 | 10-sinf · 11-dars | Grade 10 · lesson 11 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | У косинуса точки стоят одна под другой, и поэтому хватает знака плюс-минус. | Kosinusda nuqtalar bir-birining ostida turadi, shuning uchun plyus-minus ishora yetadi. | For the cosine the points stand one below the other, and that is why a plus-minus sign is enough. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `±` |
| `hook.b` | `(−1)ⁿ` |
| `proved` | `± 60° + 360°n` |
| `law` | `x = ± arccos a + 360°n` |
| `sheet.1` | `x = ± arccos a + 360°n` |
| `sheet.2` | `cos x = 1   →   360°n` |
| `sheet.3` | `cos x = −1   →   180° + 360°n` |
| `sheet.4` | `−1 ≤ a ≤ 1` |
| `sheet.5` | `arccos a ∈ [0°; 180°]` |
