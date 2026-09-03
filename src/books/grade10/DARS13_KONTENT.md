# Урок 12 — `tg x = a` · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS11_KONTENT.md`.

Скелет: `DARS11_13_SKELET.md` §7. Опора в учебнике: алгебра 2022, стр. 145–146.

**Главное решение урока.** Период `180°` не заучивается. Прямая через центр пересекает окружность
в двух диаметрально противоположных точках, и обе дают **одну и ту же** отсечку на линии
тангенсов. Значит серия одна, а шаг у неё пол-оборота. Это видно на чертеже: точка уезжает,
отсечка стоит.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТАНГЕНС | TANGENS | THE TANGENT |
| `title` | Через сколько повторяется тангенс? | Tangens necha gradusdan keyin takrorlanadi? | After how much does the tangent repeat? |
| `row.a.name` | через полный оборот | to'liq aylanadan keyin | after a full turn |
| `row.b.name` | через половину | yarim aylanadan keyin | after half a turn |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас повернём прямую и посмотрим. | Javobingiz yozib olindi. Endi chiziqni burib ko'ramiz. | Your answer is saved. Now we will turn the line and see. |
| `audio.mount*` | Прямая через центр поворачивается на половину оборота, и отсечка справа остаётся на месте. | Markazdan o'tgan chiziq yarim aylanaga buriladi, o'ngdagi kesish esa joyida qoladi. | The line through the centre turns half a turn, and the mark on the right stays in place. |
| `audio.r1` | Первая запись говорит, что повторяется через полный оборот. | Birinchi yozuv to'liq aylanadan keyin takrorlanadi deydi. | The first reading says it repeats after a full turn. |
| `audio.r2` | Вторая говорит, что достаточно половины. | Ikkinchisi yarmi yetadi deydi. | The second says half is enough. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `tg x = a` |
| `row.a.value` | `x = arctg a + 360°n` |
| `row.b.value` | `x = arctg a + 180°n` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед тангенсом | Tangensdan oldin uch savol | Three questions before the tangent |
| `q1.prompt` | Что такое тангенс угла? | Burchak tangensi nima? | What is the tangent of an angle? |
| `q1.a` [верно] | высота, делённая на сдвиг | balandlikning siljishga nisbati | the height divided by the shift |
| `q1.b` | сдвиг, делённый на высоту | siljishning balandlikka nisbati | the shift divided by the height |
| `q1.b.hint` | Это перевёрнутое отношение, у него другое имя. | Bu ag'darilgan nisbat, uning nomi boshqa. | That is the reversed ratio, it has a different name. |
| `q1.c` | сумма координат | koordinatalar yig'indisi | the sum of the coordinates |
| `q1.c.hint` | Тангенс это отношение, а не сумма. | Tangens nisbat, yig'indi emas. | The tangent is a ratio, not a sum. |
| `q1.d` | длина радиуса | radius uzunligi | the length of the radius |
| `q1.d.hint` | Радиус всегда равен единице и от угла не зависит. | Radius doim birga teng va burchakka bog'liq emas. | The radius is always one and does not depend on the angle. |
| `q2.prompt` | При каком угле тангенса нет? | Qaysi burchakda tangens yo'q? | At which angle does the tangent not exist? |
| `q2.a` [верно] | при девяноста градусах | to'qson gradusda | at ninety degrees |
| `q2.b` | при нуле | nolda | at zero |
| `q2.b.hint` | При нуле высота равна нулю, и отношение тоже ноль. | Nolda balandlik nolga teng, nisbat ham nol. | At zero the height is zero, and the ratio is zero too. |
| `q2.c` | при ста восьмидесяти | yuz saksonda | at one hundred eighty |
| `q2.c.hint` | Там сдвиг равен минус единице, делить можно. | U yerda siljish minus birga teng, bo'lish mumkin. | There the shift is minus one, division works. |
| `q2.d` | тангенс есть всегда | tangens doim bor | it always exists |
| `q2.d.hint` | На девяноста сдвиг равен нулю, а на ноль делить нельзя. | To'qsonda siljish nolga teng, nolga esa bo'lib bo'lmaydi. | At ninety the shift is zero, and division by zero is not allowed. |
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
| `q1.done` | `tg α = y / x` |
| `q2.done` | `x = 0` |
| `q3.done` | `α + 360°n` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `tg-period-2pi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Линия тангенсов | Tangenslar chizig'i | The line of tangents |
| `show.1.1` | справа стоит вертикальная линия | o'ngda vertikal chiziq turadi | a vertical line stands on the right |
| `show.1.2` | прямая через центр продолжается до неё | markazdan o'tgan chiziq unga qadar davom etadi | the line through the centre reaches it |
| `show.2.1` | отсечка и есть тангенс | kesish tangensning o'zi | the mark is the tangent |
| `show.2.2` | её высота равна отношению | uning balandligi nisbatga teng | its height equals the ratio |
| `audio.mount` | Справа от окружности стоит вертикальная линия. Она и есть прибор для тангенса. | Aylananing o'ng tomonida vertikal chiziq turadi. U tangens uchun asbob. | A vertical line stands to the right of the circle. That is the instrument for the tangent. |
| `audio.cut*` | Прямая, проведённая через центр, продолжается до этой линии и отсекает на ней кусок. Высота этого куска и есть тангенс угла: отношение высоты к сдвигу. | Markazdan o'tkazilgan chiziq shu chiziqqacha davom etadi va unda bir bo'lak kesadi. Shu bo'lakning balandligi burchak tangensi: balandlikning siljishga nisbati. | The line drawn through the centre continues to that line and cuts off a piece. The height of that piece is the tangent of the angle: the height divided by the shift. |
| `audio.work` | Теперь сам. Поставь точку на сорок пять градусов и посмотри на отсечку. | Endi o'zingiz. Nuqtani qirq besh gradusga qo'ying va kesishga qarang. | Now you. Place the point at forty five degrees and look at the mark. |
| `work.prompt` | Поставь точку на 45 градусов. | Nuqtani 45 gradusga qo'ying. | Place the point at 45 degrees. |
| `work.ok` | Здесь высота и сдвиг равны, поэтому отношение равно единице, и отсечка стоит на высоте один. | Bu yerda balandlik va siljish teng, shuning uchun nisbat birga teng, kesish esa bir balandlikda turadi. | Here the height and the shift are equal, so the ratio is one, and the mark stands at height one. |
| `work.hint.1` | Сорок пять это середина между осями. | Qirq besh bu o'qlar orasidagi o'rta. | Forty five is midway between the axes. |
| `work.hint.2` | Там высота и сдвиг одинаковые. | U yerda balandlik va siljish bir xil. | There the height and the shift are the same. |
| `work.hint.3` | Сорок пять градусов. | Qirq besh gradus. | Forty five degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 4 · `explain2` · ответ `lead` · тег `tg-period-2pi`

Свидетель урока: точка уезжает на пол-оборота, отсечка остаётся на месте.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Точка уехала, отсечка осталась | Nuqta ketdi, kesish qoldi | The point left, the mark stayed |
| `show.1.1` | поворот на половину оборота | yarim aylanaga burish | a turn of half a circle |
| `show.1.2` | точка стала другой | nuqta boshqa bo'ldi | the point became a different one |
| `show.2.1` | отсечка не сдвинулась | kesish qimirlamadi | the mark did not move |
| `show.2.2` | значит тангенс тот же | demak tangens o'sha | so the tangent is the same |
| `audio.mount` | Повернём прямую на половину оборота и посмотрим, что изменится. | Chiziqni yarim aylanaga buramiz va nima o'zgarishini ko'ramiz. | Let us turn the line half a circle and see what changes. |
| `audio.half*` | Точка на окружности ушла на противоположную сторону, а отсечка осталась ровно там же. У противоположных точек обе координаты сменили знак, а отношение от этого не изменилось: минус на минус даёт плюс. | Aylanadagi nuqta qarama-qarshi tomonga ketdi, kesish esa aynan o'sha yerda qoldi. Qarama-qarshi nuqtalarda ikkala koordinata ham ishorani almashtirdi, nisbat esa o'zgarmadi: minusga minus plyus beradi. | The point on the circle moved to the opposite side, and the mark stayed exactly where it was. At opposite points both coordinates flipped sign, and the ratio did not change: minus times minus gives plus. |
| `audio.work` | Теперь сам. Поставь точку в противоположную, на двести двадцать пять градусов. | Endi o'zingiz. Qarama-qarshisiga, ikki yuz yigirma besh gradusga nuqta qo'ying. | Now you. Place the point at the opposite one, at two hundred twenty five degrees. |
| `work.prompt` | Поставь точку на 225 градусов. | Nuqtani 225 gradusga qo'ying. | Place the point at 225 degrees. |
| `work.ok` | Отсечка та же. Тангенс у двухсот двадцати пяти такой же, как у сорока пяти. | Kesish o'sha. Ikki yuz yigirma beshning tangensi qirq beshnikidek. | The same mark. The tangent at two hundred twenty five equals the one at forty five. |
| `work.hint.1` | Противоположная точка стоит по другую сторону от центра. | Qarama-qarshi nuqta markazning boshqa tomonida turadi. | The opposite point stands on the other side of the centre. |
| `work.hint.2` | Это левая нижняя часть окружности. | Bu aylananing chap past qismi. | That is the lower left part of the circle. |
| `work.hint.3` | Двести двадцать пять градусов. | Ikki yuz yigirma besh gradus. | Two hundred twenty five degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 5 · `explain3` · ответ `lead` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Серия одна, шаг половина оборота | Seriya bitta, qadam yarim aylana | One series, the step is half a turn |
| `show.1.1` | обе точки дают одно значение | ikkala nuqta bir qiymat beradi | both points give one value |
| `show.1.2` | значит серия одна | demak seriya bitta | so the series is single |
| `show.2.1` | шаг равен ста восьмидесяти | qadam yuz saksonga teng | the step equals one hundred eighty |
| `show.2.2` | а не тремстам шестидесяти | uch yuz oltmishga emas | not three hundred sixty |
| `audio.mount` | У синуса и косинуса серий было две. Здесь другое. | Sinus va kosinusda seriya ikkita edi. Bu yerda boshqacha. | For the sine and the cosine there were two series. Here it is different. |
| `audio.one*` | Обе точки дают одну и ту же отсечку, значит различать их незачем: серия одна. А идут они через половину оборота, поэтому и шаг в записи сто восемьдесят. | Ikkala nuqta ham bir xil kesish beradi, demak ularni ajratishning keragi yo'q: seriya bitta. Ular esa yarim aylanadan keyin keladi, shuning uchun yozuvdagi qadam yuz sakson. | Both points give the same mark, so there is no need to tell them apart: the series is single. And they come half a turn apart, so the step in the reading is one hundred eighty. |
| `audio.work` | Теперь сам. Поставь точку туда, куда приведёт номер два. | Endi o'zingiz. Ikki raqami olib keladigan joyga nuqta qo'ying. | Now you. Place the point where the number two leads. |
| `work.prompt` | Куда приведёт `45° + 180° · 2`? | `45° + 180° · 2` qayerga olib keladi? | Where does `45° + 180° · 2` lead? |
| `work.ok` | Туда же, где начали. Два шага по половине оборота это полный оборот. | Boshlangan joyga. Yarim aylanadan ikki qadam bu to'liq aylana. | Back where we started. Two half-turn steps make a full turn. |
| `work.hint.1` | Сложи сто восемьдесят два раза. | Yuz saksonni ikki marta qo'shing. | Add one hundred eighty twice. |
| `work.hint.2` | Получится триста шестьдесят, то есть полный оборот. | Uch yuz oltmish chiqadi, ya'ni to'liq aylana. | You get three hundred sixty, a full turn. |
| `work.hint.3` | Сорок пять градусов. | Qirq besh gradus. | Forty five degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 6 · `explain4` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | У тангенса запретов на значение нет | Tangensda qiymat uchun taqiq yo'q | The tangent has no forbidden values |
| `show.1.1` | линия тангенсов уходит вверх и вниз | tangenslar chizig'i yuqoriga va pastga ketadi | the line of tangents runs up and down |
| `show.1.2` | у неё нет краёв | uning chetlari yo'q | it has no edges |
| `show.2.1` | любое число на ней встречается | unda har qanday son uchraydi | every number occurs on it |
| `show.2.2` | значит уравнение решается всегда | demak tenglama doim yechiladi | so the equation always has a solution |
| `audio.mount` | Посмотрим на саму линию тангенсов. | Tangenslar chizig'ining o'ziga qaraymiz. | Let us look at the line of tangents itself. |
| `audio.free*` | Она уходит вверх и вниз без края, и любое число на ней найдётся. Поэтому у синуса значение больше единицы было невозможно, а у тангенса запретов нет: уравнение решается при любом числе. | U yuqoriga va pastga chekkasiz ketadi, va unda har qanday son topiladi. Shuning uchun sinusda birdan katta qiymat mumkin emas edi, tangensda esa taqiq yo'q: tenglama har qanday sonda yechiladi. | It runs up and down without an edge, and any number can be found on it. That is why a value above one was impossible for the sine, while the tangent has no restrictions: the equation is solvable for any number. |
| `audio.work` | Посчитай сам. Сколько серий у уравнения тангенс икс равен двум? | O'zingiz hisoblang. Tangens iks ikkiga teng tenglamada nechta seriya bor? | Compute it yourself. How many series does tangent x equals two have? |
| `work.prompt` | Сколько серий у tg x = 2? | tg x = 2 da nechta seriya bor? | How many series does tg x = 2 have? |
| `work.ok` | Одна. Значение два на линии тангенсов есть, а серия у тангенса всегда одна. | Bitta. Ikki qiymati tangenslar chizig'ida bor, tangensda esa seriya doim bitta. | One. The value two exists on the line of tangents, and the tangent always has a single series. |
| `work.hint.1` | Посмотри, есть ли двойка на линии тангенсов. | Tangenslar chizig'ida ikki bormi, qarang. | Look whether two exists on the line of tangents. |
| `work.hint.2` | Линия без краёв, значит есть. | Chiziq chekkasiz, demak bor. | The line has no edges, so it does. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `tangens-bez-nulya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Но сам тангенс есть не везде | Lekin tangensning o'zi hamma joyda yo'q | But the tangent itself is not everywhere |
| `show.1.1` | точка едет к верху окружности | nuqta aylananing tepasiga ketadi | the point moves to the top of the circle |
| `show.1.2` | сдвиг уходит в ноль | siljish nolga ketadi | the shift goes to zero |
| `show.2.1` | прямая становится параллельной | chiziq parallel bo'lib qoladi | the line becomes parallel |
| `show.2.2` | отсечки нет | kesish yo'q | there is no mark |
| `audio.mount` | Точка стоит почти у самого верха окружности. | Nuqta aylananing deyarli eng tepasida turadi. | The point stands almost at the very top of the circle. |
| `audio.gone*` | Сдвиг уменьшается и уходит в ноль, а делить на ноль нельзя. На чертеже это видно так: прямая становится параллельной линии тангенсов и уже нигде её не пересекает. Отсечки нет, значит нет и значения. | Siljish kichrayadi va nolga ketadi, nolga esa bo'lib bo'lmaydi. Chizmada bu shunday ko'rinadi: chiziq tangenslar chizig'iga parallel bo'lib qoladi va uni endi kesmaydi. Kesish yo'q, demak qiymat ham yo'q. | The shift shrinks to zero, and division by zero is not allowed. On the drawing it looks like this: the line becomes parallel to the line of tangents and no longer meets it. There is no mark, so there is no value. |
| `audio.work` | Посчитай сам. Сколько корней у уравнения тангенс икс равен двум на промежутке от нуля до ста восьмидесяти? | O'zingiz hisoblang. Tangens iks ikkiga teng tenglamaning noldan yuz saksongacha oraliqda nechta ildizi bor? | Compute it yourself. How many roots does tangent x equals two have between zero and one hundred eighty? |
| `work.prompt` | Сколько корней у tg x = 2 от 0 до 180°? | tg x = 2 ning 0 dan 180° gacha nechta ildizi bor? | How many roots does tg x = 2 have from 0 to 180°? |
| `work.ok` | Один. На половине оборота серия даёт ровно один корень. | Bitta. Yarim aylanada seriya aynan bitta ildiz beradi. | One. On half a turn the series gives exactly one root. |
| `work.hint.1` | Шаг серии равен ста восьмидесяти. | Seriyaning qadami yuz saksonga teng. | The step of the series is one hundred eighty. |
| `work.hint.2` | Значит на таком промежутке помещается один корень. | Demak bunday oraliqqa bitta ildiz sig'adi. | So one root fits into such an interval. |
| `work.hint.3` | Один. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `tg-period-2pi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Запись корней тангенса | Tangens ildizlarining yozuvi | The reading of tangent roots |
| `probe.question` | Почему у тангенса шаг сто восемьдесят? | Nega tangensda qadam yuz sakson? | Why is the tangent step one hundred eighty? |
| `probe.a` [верно] | противоположные точки дают одно значение | qarama-qarshi nuqtalar bir qiymat beradi | opposite points give the same value |
| `probe.b` | так короче писать | shunday yozish qisqaroq | it is shorter to write |
| `probe.b.hint` | Короче это следствие. Причина в том, что отсечка у обеих точек одна. | Qisqaligi natija. Sabab ikkala nuqtaning kesishi bitta bo'lgani. | Shortness is the consequence. The cause is that both points share one mark. |
| `rule.lawLabel` | Серия тангенса | Tangens seriyasi | The tangent series |
| `rule.lines.1` | Прямая через центр даёт две противоположные точки, и обе имеют один и тот же тангенс. | Markazdan o'tgan chiziq ikkita qarama-qarshi nuqta beradi, ikkalasining tangensi bir xil. | A line through the centre gives two opposite points, and both have the same tangent. |
| `rule.lines.2` | Поэтому серия одна, а шаг у неё `180°`, то есть `π`. | Shuning uchun seriya bitta, qadami esa `180°`, ya'ni `π`. | So the series is single, and its step is `180°`, that is `π`. |
| `rule.lines.3` | Значение может быть любым, но самого тангенса нет при `x = 90° + 180°n`. | Qiymat har qanday bo'lishi mumkin, lekin `x = 90° + 180°n` da tangensning o'zi yo'q. | The value may be any number, but the tangent itself does not exist at `x = 90° + 180°n`. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Прямая поворачивается ещё раз, и правило открывается рядом. Шаг сто восемьдесят это не сокращение записи, а то, что обе точки дают одну отсечку. | Chiziq yana bir bor buriladi, va qoida yonida ochiladi. Yuz sakson qadam yozuvning qisqartmasi emas, ikkala nuqta bitta kesish bergani. | The line turns once more, and the rule opens beside it. The step of one hundred eighty is not shorthand but the fact that both points give one mark. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `x = arctg a + 180°n` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `tg-period-2pi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Уравнение и его серия | Tenglama va uning seriyasi | The equation and its series |
| `match.prompt` | Соедини уравнение с его записью. | Tenglamani o'z yozuvi bilan birlashtiring. | Match the equation with its reading. |
| `match.ok` | У тангенса шаг всегда сто восемьдесят, меняется только начало серии. | Tangensda qadam doim yuz sakson, faqat seriyaning boshi o'zgaradi. | For the tangent the step is always one hundred eighty, only the start of the series changes. |
| `audio.mount` | Четыре уравнения и четыре записи. Соедини их. | To'rt tenglama va to'rt yozuv. Ularni birlashtiring. | Four equations and four readings. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `tg x = 1` · `tg x = 0` · `tg x = −1` · `tg x = √3` |
| `match.a` | `45° + 180°n` |
| `match.b` | `180°n` |
| `match.c` | `−45° + 180°n` |
| `match.d` | `60° + 180°n` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Собери ответ по шагам | Javobni qadam bilan yig'ing | Assemble the answer step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | значение на линии | chiziqdagi qiymat | the value on the line |
| `order.s2` | прямая через центр | markazdan chiziq | the line through the centre |
| `order.s3` | угол из окна | oynadagi burchak | the angle from the window |
| `order.s4` | шаг сто восемьдесят | qadam yuz sakson | the step one hundred eighty |
| `order.ok` | Порядок такой всегда: сначала значение на линии, потом прямая, потом угол, потом шаг. | Tartib doim shunday: avval chiziqdagi qiymat, keyin chiziq, keyin burchak, keyin qadam. | The order is always this: the value on the line, then the line, then the angle, then the step. |
| `order.bad` | Начинают с отметки значения, а шаг ставят последним. | Qiymatni belgilashdan boshlanadi, qadam esa oxirida qo'yiladi. | It starts with marking the value, and the step comes last. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `45°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Четыреста пять. Два шага по сто восемьдесят сверх сорока пяти. | To'rt yuz besh. Qirq besh ustiga yuz saksondan ikki qadam. | Four hundred five. Two steps of one hundred eighty on top of forty five. |
| `task.hint.1` | Подставь двойку вместо буквы. | Harf o'rniga ikkini qo'ying. | Put two in place of the letter. |
| `task.hint.2` | Сорок пять плюс триста шестьдесят. | Qirq besh qo'shilgan uch yuz oltmish. | Forty five plus three hundred sixty. |
| `task.hint.3` | Четыреста пять. | To'rt yuz besh. | Four hundred five. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой корень меньше? | Qaysi ildiz kichikroq? | Which root is smaller? |
| `order.ok` | Ты подставил номера и сравнил углы, а не записи. | Siz raqamlarni qo'ydingiz va yozuvlarni emas, burchaklarni solishtirdingiz. | You substituted the numbers and compared angles, not readings. |
| `order.bad` | Подставь в каждую запись её номер и сравни то, что получилось. | Har yozuvga raqamini qo'ying va chiqqanini solishtiring. | Put the number into each reading and compare the results. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `45° + 180°n,   n = 2   →   ?` |
| `task.answer` | `405` |
| `order.items` | `n = −1` · `n = 0` · `n = 1` · `n = 2` |
| `order.answer` | `n = −1  n = 0  n = 1  n = 2` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неполный. Где? | Javob to'liq emas. Qayerda? | The answer is incomplete. Where? |
| `hint.r1` | Эта строка верна: арктангенс единицы действительно равен сорока пяти. | Bu qator to'g'ri: birning arktangensi haqiqatan qirq beshga teng. | This line is right: the arctangent of one really is forty five. |
| `hint.r2` | Эта строка тоже верна: у двухсот двадцати пяти тангенс тот же. | Bu qator ham to'g'ri: ikki yuz yigirma beshning tangensi o'sha. | This line is right too: at two hundred twenty five the tangent is the same. |
| `hint.r4` | Эта строка повторяет ошибку предыдущей. Первая неверная строка выше. | Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida. | This line repeats the error of the previous one. The first wrong line is above. |
| `proof` | С шагом в полный оборот вторая точка выпадает. | To'liq aylana qadami bilan ikkinchi nuqta tushib qoladi. | With a full-turn step the second point drops out. |
| `entry.prompt` | Чему равен шаг серии у тангенса? | Tangens seriyasining qadami qancha? | What is the step of the tangent series? |
| `entry.ok` | Сто восемьдесят. Противоположные точки дают одно значение, и между ними половина оборота. | Yuz sakson. Qarama-qarshi nuqtalar bir qiymat beradi, ular orasida yarim aylana. | One hundred eighty. Opposite points give the same value, half a turn apart. |
| `entry.hint.1` | Посмотри, через сколько повторяется отсечка. | Kesish necha gradusdan keyin takrorlanishiga qarang. | Look after how much the mark repeats. |
| `entry.hint.2` | Точки стоят по разные стороны от центра. | Nuqtalar markazning ikki tomonida turadi. | The points stand on opposite sides of the centre. |
| `entry.hint.3` | Сто восемьдесят. | Yuz sakson. | One hundred eighty. |
| `audio.mount` | Задача. Решить уравнение тангенс икс равен единице. | Masala. Tangens iks birga teng tenglamani yechish. | A task. Solve the equation tangent x equals one. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `arctg 1 = 45°` |
| `row.r2` | `tg 225° = 1` |
| `row.r3` | `x = 45° + 360°n` |
| `row.r4` | `n = 1   →   405°` |
| `answerId` | `r3` |
| `entry.answer` | `180` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По корню назвать серию | Ildizdan seriyani aytish | From a root back to its series |
| `place.prompt` | Поставь точку на 225 градусов. | Nuqtani 225 gradusga qo'ying. | Place the point at 225 degrees. |
| `place.ok` | Это противоположная точка. Тангенс у неё тот же, и серия у них общая. | Bu qarama-qarshi nuqta. Uning tangensi o'sha, seriyasi ham umumiy. | This is the opposite point. Its tangent is the same, and they share one series. |
| `place.wrong` | Двести двадцать пять это левая нижняя часть окружности. | Ikki yuz yigirma besh bu aylananing chap past qismi. | Two hundred twenty five is the lower left part of the circle. |
| `multi.prompt` | Отметь все записи с тем же тангенсом. | O'sha tangensli hamma yozuvni belgilang. | Mark every reading with the same tangent. |
| `multi.title` | У каких углов тангенс такой же? | Qaysi burchaklarda tangens o'sha? | Which angles have the same tangent? |
| `multi.d.hint` | У ста тридцати пяти тангенс минус единица: знаки координат разные. | Yuz o'ttiz beshda tangens minus bir: koordinatalar ishorasi har xil. | At one hundred thirty five the tangent is minus one: the signs of the coordinates differ. |
| `multi.e.hint` | У девяноста тангенса нет вовсе. | To'qsonda tangens umuman yo'q. | At ninety the tangent does not exist at all. |
| `multi.ok` | Три из пяти. Все они отличаются целым числом половин оборота. | Beshtadan uchtasi. Ularning hammasi butun sondagi yarim aylanaga farq qiladi. | Three out of five. All of them differ by a whole number of half-turns. |
| `audio.mount` | Теперь обратная задача. Дана точка, а нужны все углы с тем же тангенсом. | Endi teskari masala. Nuqta berilgan, o'sha tangensli hamma burchak kerak. | Now the inverse task. A point is given, and all angles with the same tangent are needed. |
| `audio.work` | Поставь точку, потом отметишь все записи с тем же тангенсом. | Nuqtani qo'ying, keyin o'sha tangensli hamma yozuvni belgilaysiz. | Place the point, then you will mark every reading with the same tangent. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `225°` |
| `place.step` | `45° + 180°n` |
| `multi.a` [верно] | `45°` |
| `multi.b` [верно] | `405°` |
| `multi.c` [верно] | `−135°` |
| `multi.d` | `135°` |
| `multi.e` | `90°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `tg-period-2pi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Чему равен шаг серии у тангенса? | Tangens seriyasining qadami qancha? | What is the step of the tangent series? |
| `q1.a` [верно] | сто восемьдесят | yuz sakson | one hundred eighty |
| `q1.b` | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q1.b.hint` | Триста шестьдесят это шаг у синуса и косинуса. | Uch yuz oltmish bu sinus va kosinusdagi qadam. | Three hundred sixty is the step of the sine and the cosine. |
| `q1.c` | девяносто | to'qson | ninety |
| `q1.c.hint` | Через девяносто отношение меняется, а не повторяется. | To'qsondan keyin nisbat o'zgaradi, takrorlanmaydi. | After ninety the ratio changes, it does not repeat. |
| `q1.d` | зависит от значения | qiymatga bog'liq | it depends on the value |
| `q1.d.hint` | Шаг всегда один и тот же, каким бы ни было значение. | Qiymat qanday bo'lishidan qat'i nazar qadam doim bir xil. | The step is always the same whatever the value. |
| `q2.prompt` | Сколько серий у уравнения с тангенсом? | Tangensli tenglamada nechta seriya bor? | How many series does a tangent equation have? |
| `q2.a` [верно] | одна | bitta | one |
| `q2.b` | две | ikkita | two |
| `q2.b.hint` | Две были у синуса, там точки давали разные значения. | Ikkita sinusda edi, u yerda nuqtalar har xil qiymat berardi. | Two happened for the sine, where the points gave different values. |
| `q2.c` | четыре | to'rtta | four |
| `q2.c.hint` | Точек пересечения всего две, и обе дают одно значение. | Kesishish nuqtasi jami ikkita, va ikkalasi bir qiymat beradi. | There are only two points, and both give one value. |
| `q2.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q2.d.hint` | Корней бесконечно много, а серия одна. | Ildiz cheksiz ko'p, seriya esa bitta. | There are infinitely many roots, but one series. |
| `q3.prompt` | При каком угле тангенса нет? | Qaysi burchakda tangens yo'q? | At which angle does the tangent not exist? |
| `q3.a` [верно] | при девяноста | to'qsonda | at ninety |
| `q3.a.ok` | Да. Там сдвиг равен нулю, и делить нельзя. | Ha. U yerda siljish nolga teng, bo'lib bo'lmaydi. | Yes. There the shift is zero, and division is impossible. |
| `q3.b` | при нуле | nolda | at zero |
| `q3.b.hint` | При нуле тангенс есть и равен нулю. | Nolda tangens bor va nolga teng. | At zero the tangent exists and equals zero. |
| `q4.prompt` | Сколько корней у tg x = 5? | tg x = 5 ning nechta ildizi bor? | How many roots does tg x = 5 have? |
| `q4.a` [верно] | бесконечно много | cheksiz ko'p | infinitely many |
| `q4.b` | ни одного | hech qaysi | none |
| `q4.b.hint` | Линия тангенсов без краёв, пятёрка на ней есть. | Tangenslar chizig'i chekkasiz, besh unda bor. | The line of tangents has no edges, five is on it. |
| `q4.c` | один | bitta | one |
| `q4.c.hint` | Один на промежутке в половину оборота, а всего бесконечно много. | Yarim aylana oraliqda bitta, jami esa cheksiz ko'p. | One on a half-turn interval, but infinitely many in total. |
| `q4.d` | два | ikkita | two |
| `q4.d.hint` | Два было бы у синуса, там серий две. | Ikkita sinusda bo'lardi, u yerda seriya ikkita. | Two would happen for the sine, where there are two series. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `180°n` |
| `q2.done` | `1` |
| `q3.done` | `x = 90° + 180°n` |
| `q4.done` | `∞` |
| `angles` | `45°` · `225°` · `90°` · `60°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Читаю тангенс по линии тангенсов | Tangensni tangenslar chizig'idan o'qiyman | I read the tangent off the line of tangents |
| `can.2` | Знаю, почему серия одна | Nega seriya bitta ekanini bilaman | I know why the series is single |
| `can.3` | Помню, что шаг равен половине оборота | Qadam yarim aylanaga tengligini eslayman | I remember the step is half a turn |
| `can.4` | Знаю, где тангенса нет | Tangens qayerda yo'qligini bilaman | I know where the tangent does not exist |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: чему равен шаг. | Bitta joy takrorlashni talab qiladi: qadam qanchaga teng. | One place needs review: what the step equals. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Урок 13: уравнения посложнее, которые сначала приводят к простейшим. | 13-dars: avval soddaga keltiriladigan murakkabroq tenglamalar. | Lesson 13: harder equations, first reduced to the simplest ones. |
| `lifehack` | Если точки противоположны, значения у них совпадают только у тангенса. | Nuqtalar qarama-qarshi bo'lsa, qiymatlari faqat tangensda mos keladi. | When the points are opposite, their values coincide only for the tangent. |
| `sheetTitle` | Тангенс · шпаргалка | Tangens · shpargalka | The tangent · cheat sheet |
| `sheetSrc` | 10 класс · урок 12 | 10-sinf · 12-dars | Grade 10 · lesson 12 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Тангенс повторяется через половину оборота, потому что противоположные точки дают одну отсечку. | Tangens yarim aylanadan keyin takrorlanadi, chunki qarama-qarshi nuqtalar bitta kesish beradi. | The tangent repeats after half a turn because opposite points give one mark. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `360°n` |
| `hook.b` | `180°n` |
| `proved` | `45° + 180°n` |
| `law` | `x = arctg a + 180°n` |
| `sheet.1` | `x = arctg a + 180°n` |
| `sheet.2` | `tg x = 1   →   45° + 180°n` |
| `sheet.3` | `tg x = 0   →   180°n` |
| `sheet.4` | `x ≠ 90° + 180°n` |
| `sheet.5` | `arctg a ∈ (−90°; 90°)` |
