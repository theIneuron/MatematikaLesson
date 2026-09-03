# Урок 36 — Тригонометрические неравенства · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS32_36_SKELET.md` §11. Опора в учебнике: алгебра 2022, стр. 157–164, параграф
`TRIGONOMETRIK TENGSIZLIKLAR`.

**Главное решение урока.** Это урок 35, перенесённый с прямой на окружность. Там ответом был луч
от точки встречи, здесь — **дуга** между двумя точками встречи. И к ней добавляется то, чего у
прямой не было: дуга повторяется каждый оборот, то есть у ответа появляется серия из блока 2.

**Учебник разбирает вырожденные случаи до общего** (стр. 157): `a` больше единицы и `a` меньше
минус единицы, то есть горизонталь проходит мимо круга. Мы берём этот порядок на экран 7.

**Экраны 3 и 4 — постановка точки** (`PlaceAngle`, прибор 1). Ученик ставит обе границы дуги сам,
а не выбирает из списка: границу надо найти на окружности, а не узнать.

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НЕРАВЕНСТВО | TENGSIZLIK | THE INEQUALITY |
| `title` | Точка или дуга | Nuqtami yoki yoy | A point or an arc |
| `row.a.name` | записали одну точку | bitta nuqta yozdik | one point was written down |
| `row.b.name` | записали целую дугу | butun yoy yozdik | a whole arc was written down |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проведём горизонталь и посмотрим. | Javobingiz yozib olindi. Endi gorizontal o'tkazib ko'ramiz. | Your answer is saved. Now we will draw the horizontal and look. |
| `audio.mount` | Синус икс больше одной второй. Слева и справа два разных ответа. | Sinus iks bir ikkidan katta. Chapda va o'ngda ikki xil javob. | Sine of x is greater than one half. On the left and on the right two different answers. |
| `audio.r1` | Первая запись говорит, что ответ это тридцать градусов: именно там синус равен одной второй. | Birinchi yozuv javob o'ttiz gradus deydi: sinus aynan o'sha yerda bir ikkidanga teng. | The first reading says the answer is thirty degrees: that is where the sine equals one half. |
| `audio.r2` | Вторая говорит, что ответ это целый кусок от тридцати до ста пятидесяти градусов, и он повторяется каждый оборот. | Ikkinchisi javob o'ttizdan bir yuz ellik gradusgacha bo'lgan butun bo'lak deydi, va u har aylanishda takrorlanadi. | The second says the answer is a whole piece from thirty to one hundred fifty degrees, and it repeats every turn. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `sin x > 1/2` |
| `row.a.value` | `x = 30°` |
| `row.b.value` | `30° < x < 150°` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед неравенством | Tengsizlikdan oldin uch savol | Three questions before the inequality |
| `q1.prompt` | Где на окружности читают синус? | Aylanada sinus qayerdan o'qiladi? | Where on the circle is the sine read? |
| `q1.a` [верно] | по вертикальной оси | tik o'q bo'yicha | along the vertical axis |
| `q1.b` | по горизонтальной оси | yotiq o'q bo'yicha | along the horizontal axis |
| `q1.b.hint` | По горизонтальной читают косинус. | Yotiq o'q bo'yicha kosinus o'qiladi. | The horizontal axis is where the cosine is read. |
| `q1.c` | по длине дуги | yoy uzunligi bo'yicha | along the length of the arc |
| `q1.c.hint` | Длина дуги это сам угол в радианах, а не синус. | Yoy uzunligi bu radiandagi burchakning o'zi, sinus emas. | The arc length is the angle in radians, not the sine. |
| `q1.d` | по радиусу | radius bo'yicha | along the radius |
| `q1.d.hint` | Радиус здесь всегда единица, он ничего не различает. | Radius bu yerda doim bir, u hech nimani ajratmaydi. | The radius is always one here, it tells nothing apart. |
| `q2.prompt` | Между какими числами лежит синус? | Sinus qaysi sonlar orasida yotadi? | Between which numbers does the sine lie? |
| `q2.a` [верно] | между минус одним и одним | minus bir va bir orasida | between minus one and one |
| `q2.b` | между нулём и одним | nol va bir orasida | between zero and one |
| `q2.b.hint` | Внизу окружности синус отрицательный. | Aylananing pastida sinus manfiy. | At the bottom of the circle the sine is negative. |
| `q2.c` | любое число | har qanday son | any number |
| `q2.c.hint` | Больше единицы синус не бывает: выше круга точек нет. | Sinus birdan katta bo'lmaydi: doiradan yuqorida nuqta yo'q. | The sine is never greater than one: there are no points above the circle. |
| `q2.d` | между минус двумя и двумя | minus ikki va ikki orasida | between minus two and two |
| `q2.d.hint` | Радиус равен единице, значит и высота не больше единицы. | Radius birga teng, demak balandlik ham birdan katta emas. | The radius equals one, so the height is no greater than one. |
| `q3.prompt` | Что добавляют к ответу, чтобы учесть все обороты? | Barcha aylanishlarni hisobga olish uchun javobga nima qo'shiladi? | What is added to the answer to account for all the turns? |
| `q3.a` [верно] | триста шестьдесят градусов, умноженные на целое число | butun songa ko'paytirilgan uch yuz oltmish gradus | three hundred sixty degrees times a whole number |
| `q3.b` | сто восемьдесят градусов | bir yuz sakson gradus | one hundred eighty degrees |
| `q3.b.hint` | Сто восемьдесят это половина оборота, точка окажется не там. | Bir yuz sakson yarim aylanish, nuqta boshqa joyga tushadi. | One hundred eighty is half a turn, the point would land elsewhere. |
| `q3.c` | ничего не добавляют | hech nima qo'shilmaydi | nothing is added |
| `q3.c.hint` | Тогда потеряются все обороты, кроме первого. | U holda birinchisidan boshqa barcha aylanishlar yo'qoladi. | Then every turn except the first would be lost. |
| `q3.d` | девяносто градусов | to'qson gradus | ninety degrees |
| `q3.d.hint` | Девяносто это четверть оборота. | To'qson chorak aylanish. | Ninety is a quarter of a turn. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `sin x = y` |
| `q2.done` | `−1 ≤ sin x ≤ 1` |
| `q3.done` | `+ 360°n` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `odin-koren`

Ученик ставит первую границу дуги.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Горизонталь режет круг дважды | Gorizontal doirani ikki marta kesadi | The horizontal cuts the circle twice |
| `show.1.1` | прямая идёт на высоте одна вторая | to'g'ri chiziq bir ikkidan balandlikda boradi | the line runs at height one half |
| `show.1.2` | она пересекает окружность в двух точках | u aylanani ikki nuqtada kesadi | it crosses the circle at two points |
| `show.1.3` | первая точка справа | birinchi nuqta o'ngda | the first point is on the right |
| `show.2.1` | это тридцать градусов | bu o'ttiz gradus | that is thirty degrees |
| `show.2.2` | там синус ровно одна вторая | u yerda sinus roppa-rosa bir ikkidan | there the sine is exactly one half |
| `show.2.3` | поставь эту точку сам | shu nuqtani o'zingiz qo'ying | place that point yourself |
| `audio.mount` | Прямая на высоте одна вторая. Всё как в уроке про синус икс равно а. | Bir ikkidan balandlikda to'g'ri chiziq. Hammasi sinus iks a ga teng darsidagidek. | A line at height one half. Everything as in the lesson on sine x equals a. |
| `audio.cut*` | Прямая на высоте одна вторая пересекает окружность в двух точках, и это уже знакомо: ровно так решалось уравнение. Первая точка лежит справа сверху, ей отвечает угол тридцать градусов. Проверить легко: синус тридцати градусов равен одной второй, это значение из таблицы. Поставь эту точку на окружности сам. Дальше мы найдём вторую и посмотрим, что лежит между ними. | Bir ikkidan balandlikdagi to'g'ri chiziq aylanani ikki nuqtada kesadi, va bu allaqachon tanish: tenglama aynan shunday yechilardi. Birinchi nuqta o'ng yuqorida yotadi, unga o'ttiz gradus burchak mos keladi. Tekshirish oson: o'ttiz gradusning sinusi bir ikkidanga teng, bu jadvaldagi qiymat. Shu nuqtani aylanaga o'zingiz qo'ying. Keyin ikkinchisini topamiz va ular orasida nima yotganiga qaraymiz. | The line at height one half crosses the circle at two points, and that is already familiar: this is exactly how the equation was solved. The first point lies at the upper right, and the angle thirty degrees belongs to it. It is easy to check: the sine of thirty degrees equals one half, a value from the table. Place that point on the circle yourself. Then we will find the second one and look at what lies between them. |
| `audio.work` | Поставь точку там, где синус равен одной второй, справа. | Sinus bir ikkidanga teng bo'lgan joyga, o'ngga nuqta qo'ying. | Place the point where the sine equals one half, on the right. |
| `place.prompt` | Поставь точку, где синус равен одной второй | Sinus bir ikkidanga teng nuqtani qo'ying | Place the point where the sine equals one half |
| `place.ok` | Тридцать градусов. Это первая граница дуги. | O'ttiz gradus. Bu yoyning birinchi chegarasi. | Thirty degrees. That is the first boundary of the arc. |
| `place.bad` | Смотри на высоту точки, а не на её положение слева или справа. | Nuqtaning chapda yoki o'ngdaligiga emas, balandligiga qarang. | Look at the height of the point, not at whether it is left or right. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `30` |
| `place.step` | `30` |

---

## Экран 4 · `explain2` · ответ `lead` · тег `odin-koren`

Вторая граница, и разграничение с уравнением.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | У уравнения точки, у неравенства то, что между | Tenglamada nuqtalar, tengsizlikda ular orasidagi | An equation has points, an inequality has what lies between |
| `show.1.1` | вторая точка лежит слева сверху | ikkinchi nuqta chap yuqorida yotadi | the second point lies at the upper left |
| `show.1.2` | это сто пятьдесят градусов | bu bir yuz ellik gradus | that is one hundred fifty degrees |
| `show.1.3` | синус там тоже одна вторая | u yerda ham sinus bir ikkidan | the sine there is one half as well |
| `show.2.1` | у уравнения ответ это две точки | tenglamada javob ikki nuqta | for an equation the answer is two points |
| `show.2.2` | у неравенства ответ это дуга между ними | tengsizlikda javob ular orasidagi yoy | for an inequality the answer is the arc between them |
| `show.2.3` | точки стали границами | nuqtalar chegaraga aylandi | the points became boundaries |
| `audio.mount` | Вторая точка слева сверху. Она понадобится сразу. | Ikkinchi nuqta chap yuqorida. U darrov kerak bo'ladi. | The second point is at the upper left. It will be needed right away. |
| `audio.arc*` | Вторая точка это сто пятьдесят градусов, и синус там тоже равен одной второй. Если бы у нас было уравнение, на этом всё и закончилось бы: две точки, две серии, ответ записан. Но у нас неравенство, и синус должен быть больше одной второй. Посмотри, где точка окружности поднимается выше прямой. Это вся верхняя дуга между тридцатью и ста пятьюдесятью градусами. Каждая её точка решение, а не только концы. Сами концы, наоборот, в ответ не входят: там синус равен одной второй, а нужно больше. | Ikkinchi nuqta bir yuz ellik gradus, u yerda ham sinus bir ikkidanga teng. Agar bizda tenglama bo'lganida, hammasi shu bilan tugardi: ikki nuqta, ikki seriya, javob yozildi. Lekin bizda tengsizlik, sinus esa bir ikkidandan katta bo'lishi kerak. Aylananing nuqtasi to'g'ri chiziqdan qayerda balandroq ko'tarilishiga qarang. Bu o'ttiz va bir yuz ellik gradus orasidagi butun yuqori yoy. Uning har bir nuqtasi yechim, faqat chekkalari emas. Chekkalarning o'zi esa aksincha, javobga kirmaydi: u yerda sinus bir ikkidanga teng, kerak esa kattaroq. | The second point is one hundred fifty degrees, and the sine there also equals one half. If we had an equation, that would be the end of it: two points, two series, the answer written. But we have an inequality, and the sine has to be greater than one half. Look at where a point of the circle rises above the line. That is the whole upper arc between thirty and one hundred fifty degrees. Every point of it is a solution, not only the ends. The ends themselves, on the contrary, do not belong to the answer: there the sine equals one half, while greater is required. |
| `audio.work` | Поставь вторую точку, слева сверху. | Ikkinchi nuqtani chap yuqoriga qo'ying. | Place the second point, at the upper left. |
| `place.prompt` | Поставь вторую точку | Ikkinchi nuqtani qo'ying | Place the second point |
| `place.ok` | Сто пятьдесят градусов. Дуга между двумя точками и есть ответ. | Bir yuz ellik gradus. Ikki nuqta orasidagi yoy javobning o'zi. | One hundred fifty degrees. The arc between the two points is the answer. |
| `place.bad` | Вторая точка на той же высоте, но с другой стороны. | Ikkinchi nuqta o'sha balandlikda, lekin boshqa tomonda. | The second point is at the same height but on the other side. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `150` |
| `place.step` | `30` |

---

## Экран 5 · `explain3` · ответ `number` · тег `seriya-bez-n`

Дуга повторяется каждый оборот.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Дуга повторяется каждый оборот | Yoy har aylanishda takrorlanadi | The arc repeats every turn |
| `show.1.1` | одна дуга это ещё не весь ответ | bitta yoy hali butun javob emas | one arc is not yet the whole answer |
| `show.1.2` | после полного оборота точка возвращается | to'liq aylanishdan keyin nuqta qaytadi | after a full turn the point comes back |
| `show.1.3` | синус у неё тот же | uning sinusi o'sha | its sine is the same |
| `show.2.1` | значит дуга повторяется | demak yoy takrorlanadi | so the arc repeats |
| `show.2.2` | к обоим концам добавляют оборот | ikkala chekkaga aylanish qo'shiladi | a turn is added to both ends |
| `show.2.3` | оборот берут любое число раз | aylanish istalgancha marta olinadi | the turn is taken any number of times |
| `audio.mount` | Дуга найдена, но ответ ещё не записан. Осталось учесть обороты. | Yoy topildi, lekin javob hali yozilmagan. Aylanishlarni hisobga olish qoldi. | The arc is found, but the answer is not written yet. The turns still have to be counted in. |
| `audio.turn*` | Возьмём любой угол из нашей дуги, скажем девяносто градусов. Прибавим к нему полный оборот, выйдет четыреста пятьдесят. Точка на окружности при этом вернулась ровно туда же, значит синус у неё тот же, значит и неравенство выполняется. То же будет при двух оборотах, при трёх и при любом их числе, в том числе в обратную сторону. Поэтому к обеим границам дуги дописывают триста шестьдесят градусов, умноженные на целое число. Одна дуга превращается в бесконечную цепочку одинаковых дуг. | Yoyimizdan istalgan burchakni olamiz, aytaylik to'qson gradus. Unga to'liq aylanishni qo'shamiz, to'rt yuz ellik chiqadi. Aylanadagi nuqta esa aynan o'sha joyga qaytdi, demak sinusi o'sha, demak tengsizlik ham bajariladi. Ikki aylanishda, uchtada va ularning istalgan sonida ham shunday bo'ladi, teskari tomonda ham. Shuning uchun yoyning ikkala chegarasiga butun songa ko'paytirilgan uch yuz oltmish gradus yoziladi. Bitta yoy bir xil yoylarning cheksiz zanjiriga aylanadi. | Take any angle from our arc, say ninety degrees. Add a full turn to it, and four hundred fifty comes out. The point on the circle has returned to exactly the same place, so its sine is the same, so the inequality holds. The same happens for two turns, for three and for any number of them, in the reverse direction as well. That is why three hundred sixty degrees times a whole number is written at both boundaries of the arc. One arc turns into an endless chain of identical arcs. |
| `audio.work` | Посчитай сам. Через сколько градусов дуга повторяется? | O'zingiz hisoblang. Yoy necha gradusdan keyin takrorlanadi? | Work it out yourself. After how many degrees does the arc repeat? |
| `work.prompt` | Через сколько градусов повторяется дуга? | Yoy necha gradusdan keyin takrorlanadi? | After how many degrees does the arc repeat? |
| `work.ok` | Через триста шестьдесят. Это полный оборот, после него точка на прежнем месте. | Uch yuz oltmishdan keyin. Bu to'liq aylanish, undan keyin nuqta avvalgi joyida. | After three hundred sixty. That is a full turn, after which the point is back in place. |
| `work.hint.1` | Сколько градусов в полном обороте? | To'liq aylanishda necha gradus bor? | How many degrees are in a full turn? |
| `work.hint.2` | После полного оборота точка возвращается на прежнее место. | To'liq aylanishdan keyin nuqta avvalgi joyiga qaytadi. | After a full turn the point returns to its former place. |
| `work.hint.3` | Триста шестьдесят. | Uch yuz oltmish. | Three hundred sixty. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `30°+360°n < x < 150°+360°n` |
| `work.answer` | `360` |

---

## Экран 6 · `explain4` · ответ `number` · тег `odin-koren`

Сам: обратный знак даёт дополнение.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Другой знак, другая дуга | Boshqa ishora, boshqa yoy | Another sign, another arc |
| `show.1.1` | те же две точки на окружности | aylanadagi o'sha ikki nuqta | the same two points on the circle |
| `show.1.2` | прямая на той же высоте | to'g'ri chiziq o'sha balandlikda | the line at the same height |
| `show.1.3` | но знак теперь меньше | lekin ishora endi kichik | but the sign is now less |
| `show.2.1` | берут дугу ниже прямой | to'g'ri chiziqdan pastdagi yoy olinadi | the arc below the line is taken |
| `show.2.2` | она дополняет первую до полного круга | u birinchisini to'liq doiragacha to'ldiradi | it completes the first one to the full circle |
| `show.2.3` | значит в ней двести сорок градусов | demak unda ikki yuz qirq gradus | so it holds two hundred forty degrees |
| `audio.mount` | Знак поменяли на обратный. Точки те же, дуга другая. | Ishora teskarisiga o'zgartirildi. Nuqtalar o'sha, yoy boshqa. | The sign was reversed. The points are the same, the arc is different. |
| `audio.other*` | Прямая осталась на той же высоте, и точки пересечения те же: тридцать и сто пятьдесят градусов. Но теперь синус должен быть меньше одной второй, значит нужна та часть окружности, которая лежит ниже прямой. Это вся оставшаяся дуга, и вместе с первой она составляет полный круг. В полном круге триста шестьдесят градусов, в первой дуге сто двадцать, значит в этой двести сорок. Обрати внимание, считать заново ничего не пришлось: точки те же, поменялась только выбранная сторона. Ровно как на прошлом уроке с кривой. | To'g'ri chiziq o'sha balandlikda qoldi, kesishish nuqtalari ham o'sha: o'ttiz va bir yuz ellik gradus. Lekin endi sinus bir ikkidandan kichik bo'lishi kerak, demak aylananing to'g'ri chiziqdan pastda yotgan qismi kerak. Bu qolgan butun yoy, va birinchisi bilan birga u to'liq doirani tashkil qiladi. To'liq doirada uch yuz oltmish gradus, birinchi yoyda bir yuz yigirma, demak bunda ikki yuz qirq. E'tibor bering, qaytadan hech nima hisoblashga to'g'ri kelmadi: nuqtalar o'sha, faqat tanlangan tomon o'zgardi. Xuddi o'tgan darsdagi egri chiziqdagidek. | The line stayed at the same height, and the crossing points are the same: thirty and one hundred fifty degrees. But now the sine has to be less than one half, so we need the part of the circle lying below the line. That is the whole remaining arc, and together with the first one it makes the full circle. A full circle holds three hundred sixty degrees, the first arc holds one hundred twenty, so this one holds two hundred forty. Notice that nothing had to be computed again: the points are the same, only the chosen side changed. Exactly as with the curve in the previous lesson. |
| `audio.work` | Посчитай сам. Сколько градусов в этой дуге? | O'zingiz hisoblang. Bu yoyda necha gradus bor? | Work it out yourself. How many degrees are in this arc? |
| `work.prompt` | Сколько градусов в дуге? | Yoyda necha gradus bor? | How many degrees are in the arc? |
| `work.ok` | Двести сорок. Полный круг минус сто двадцать градусов первой дуги. | Ikki yuz qirq. To'liq doira minus birinchi yoyning bir yuz yigirma gradusi. | Two hundred forty. The full circle minus the one hundred twenty degrees of the first arc. |
| `work.hint.1` | Первая дуга шла от тридцати до ста пятидесяти. | Birinchi yoy o'ttizdan bir yuz ellikkacha borardi. | The first arc ran from thirty to one hundred fifty. |
| `work.hint.2` | Вычти её из полного круга. | Uni to'liq doiradan ayiring. | Subtract it from the full circle. |
| `work.hint.3` | Двести сорок. | Ikki yuz qirq. | Two hundred forty. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `sin x < 1/2` |
| `work.answer` | `240` |

---

## Экран 7 · `explain5` · ответ `number` · тег `net-resheniy`

Граничный: прямая проходит мимо круга.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Прямая прошла мимо круга | To'g'ri chiziq doiradan yonlab o'tdi | The line went past the circle |
| `show.1.1` | справа стоит двойка | o'ngda ikki turibdi | there is a two on the right |
| `show.1.2` | прямая поднялась выше круга | to'g'ri chiziq doiradan yuqori ko'tarildi | the line rose above the circle |
| `show.1.3` | пересечений нет ни одного | kesishish umuman yo'q | there is not a single crossing |
| `show.2.1` | значит и дуги нет | demak yoy ham yo'q | so there is no arc either |
| `show.2.2` | синус больше двух не бывает | sinus ikkidan katta bo'lmaydi | the sine is never greater than two |
| `show.2.3` | решений нет ни при каком икс | hech qanday iksda yechim yo'q | there are no solutions for any x |
| `audio.mount` | Последний случай урока. Справа стоит число больше единицы. | Darsning oxirgi holi. O'ngda birdan katta son turibdi. | The last case of the lesson. On the right there is a number greater than one. |
| `audio.miss*` | Проведём прямую на высоте два. Она проходит выше круга и окружности не касается вовсе. Пересечений нет, значит нет и точек, значит нет и дуги между ними. Ответ такой: решений нет ни при каком икс. Это видно сразу, решать ничего не надо. Причина простая: синус это высота точки на окружности радиуса один, и выше единицы она не поднимается. А если бы справа стояло минус два, вышло бы наоборот: прямая прошла бы ниже круга, и любая точка окружности оказалась бы выше неё. Тогда решением была бы вся прямая, все икс без исключения. | Ikki balandlikda to'g'ri chiziq o'tkazamiz. U doiradan yuqoridan o'tadi va aylanaga umuman tegmaydi. Kesishish yo'q, demak nuqtalar ham yo'q, demak ular orasidagi yoy ham yo'q. Javob shunday: hech qanday iksda yechim yo'q. Bu darrov ko'rinadi, hech nima yechish shart emas. Sababi oddiy: sinus radiusi bir bo'lgan aylanadagi nuqtaning balandligi, u birdan yuqoriga ko'tarilmaydi. Agar o'ngda minus ikki turganida, aksincha bo'lardi: to'g'ri chiziq doiradan pastdan o'tardi, aylananing har qanday nuqtasi undan yuqori bo'lardi. U holda yechim butun chiziq, istisnosiz barcha ikslar bo'lardi. | Let us draw the line at height two. It passes above the circle and does not touch it at all. There are no crossings, so there are no points, so there is no arc between them. The answer is this: there are no solutions for any x. It is visible at once, nothing needs to be solved. The reason is simple: the sine is the height of a point on a circle of radius one, and it does not rise above one. And if minus two stood on the right, the opposite would happen: the line would pass below the circle, and every point of the circle would be above it. Then the solution would be the whole line, every x without exception. |
| `audio.work` | Посчитай сам. Сколько решений у этого неравенства? | O'zingiz hisoblang. Bu tengsizlikning nechta yechimi bor? | Work it out yourself. How many solutions does this inequality have? |
| `work.prompt` | Сколько решений у неравенства? | Tengsizlikning nechta yechimi bor? | How many solutions does the inequality have? |
| `work.ok` | Ни одного. Прямая прошла выше круга, пересечений нет. | Bitta ham yo'q. To'g'ri chiziq doiradan yuqoridan o'tdi, kesishish yo'q. | None. The line passed above the circle, there are no crossings. |
| `work.hint.1` | Посмотри, пересекает ли прямая окружность. | To'g'ri chiziq aylanani kesib o'tadimi, qarang. | See whether the line crosses the circle. |
| `work.hint.2` | Синус больше единицы не бывает. | Sinus birdan katta bo'lmaydi. | The sine is never greater than one. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `sin x > 2` |
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Ответ это дуга и её обороты | Javob yoy va uning aylanishlari | The answer is an arc and its turns |
| `probe.question` | Что даёт пересечение прямой с окружностью? | To'g'ri chiziqning aylana bilan kesishuvi nima beradi? | What do the crossings of the line and the circle give? |
| `probe.a` [верно] | границы дуги | yoyning chegaralarini | the boundaries of the arc |
| `probe.b` | сам ответ | javobning o'zini | the answer itself |
| `probe.b.hint` | Сам ответ был бы у уравнения. У неравенства это только концы. | Javobning o'zi tenglamada bo'lardi. Tengsizlikda bu faqat chekkalar. | The answer itself would belong to an equation. For an inequality these are only the ends. |
| `rule.lawLabel` | КАК РЕШАТЬ | QANDAY YECHILADI | HOW TO SOLVE |
| `rule.lines.1` | провести прямую на высоте правой части | o'ng taraf balandligida to'g'ri chiziq o'tkazish | draw the line at the height of the right side |
| `rule.lines.2` | взять дугу, где знак выполняется | ishora bajariladigan yoyni olish | take the arc where the sign holds |
| `rule.lines.3` | к обоим концам добавить обороты | ikkala chekkaga aylanishlarni qo'shish | add the turns to both ends |
| `audio.mount` | Соберём правило. Оно из трёх шагов, и все три уже сделаны. | Qoidani yig'amiz. U uch qadamdan iborat, uchalasi ham bajarilgan. | Let us put the rule together. It has three steps, and all three are already done. |
| `audio.rule*` | Первое: провести прямую на высоте того числа, что стоит справа. Если она прошла мимо круга, ответ виден сразу: либо решений нет, либо годятся все икс. Второе: найти точки пересечения и взять ту дугу, на которой знак неравенства выполняется. При знаке больше это дуга выше прямой, при знаке меньше ниже. Третье: к обоим концам дуги добавить триста шестьдесят градусов, умноженные на целое число. И помни про концы: при строгом знаке они в ответ не входят, при нестрогом входят. | Birinchi: o'ngda turgan sonning balandligida to'g'ri chiziq o'tkazish. Agar u doiradan yonlab o'tgan bo'lsa, javob darrov ko'rinadi: yo yechim yo'q, yo barcha ikslar yaraydi. Ikkinchi: kesishish nuqtalarini topib, tengsizlik ishorasi bajariladigan yoyni olish. Katta ishorasida bu to'g'ri chiziqdan yuqoridagi yoy, kichik ishorasida pastdagisi. Uchinchi: yoyning ikkala chekkasiga butun songa ko'paytirilgan uch yuz oltmish gradus qo'shish. Chekkalarni ham eslang: qat'iy ishorada ular javobga kirmaydi, qat'iy bo'lmaganda kiradi. | First: draw the line at the height of the number on the right. If it went past the circle, the answer is visible at once: either there are no solutions, or every x works. Second: find the crossing points and take the arc on which the inequality sign holds. For a greater-than sign that is the arc above the line, for a less-than sign the one below. Third: add three hundred sixty degrees times a whole number to both ends of the arc. And remember the ends: with a strict sign they do not belong to the answer, with a non-strict one they do. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `30°+360°n < x < 150°+360°n` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини неравенство с границами дуги | Tengsizlikni yoy chegaralari bilan ulang | Match each inequality with the boundaries of its arc |
| `match.prompt` | Границы даны за один оборот | Chegaralar bir aylanish uchun berilgan | The boundaries are given for one turn |
| `match.ok` | Верно. Высота прямой меняется, работа остаётся той же. | To'g'ri. To'g'ri chiziqning balandligi o'zgaradi, ish esa o'sha bo'lib qoladi. | Correct. The height of the line changes, the work stays the same. |
| `audio.mount` | Четыре неравенства и четыре пары границ. Значения из таблицы. | To'rt tengsizlik va to'rt juft chegara. Qiymatlar jadvaldan. | Four inequalities and four pairs of boundaries. The values come from the table. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `sin x > 1/2` · `sin x > 0` · `sin x < −1/2` · `sin x > √2/2` |
| `match.a` | `30°;  150°` |
| `match.b` | `0°;  180°` |
| `match.c` | `210°;  330°` |
| `match.d` | `45°;  135°` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Собери ответ целиком | Javobni to'liq yig'ing | Put the answer together |
| `order.prompt` | Расставь шаги решения по порядку | Yechish qadamlarini tartib bilan joylashtiring | Put the solution steps in order |
| `order.s1` | провести прямую | to'g'ri chiziq o'tkazish | draw the line |
| `order.s2` | найти две точки | ikki nuqtani topish | find the two points |
| `order.s3` | взять дугу между ними | orasidagi yoyni olish | take the arc between them |
| `order.s4` | добавить обороты | aylanishlarni qo'shish | add the turns |
| `order.ok` | Верно. Обороты добавляют последними, когда дуга уже найдена. | To'g'ri. Aylanishlar oxirida, yoy topilgandan keyin qo'shiladi. | Correct. The turns are added last, once the arc is found. |
| `order.bad` | Обороты добавляют к готовой дуге, а не к отдельной точке. | Aylanishlar tayyor yoyga qo'shiladi, alohida nuqtaga emas. | The turns are added to a finished arc, not to a single point. |
| `audio.mount` | Теперь всё неравенство целиком. Четыре шага, порядок важен. | Endi butun tengsizlik. To'rt qadam, tartib muhim. | Now the whole inequality. Four steps, and the order matters. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `sin x > 1/2` |
| `order.mark` | `30°+360°n < x < 150°+360°n` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Сколько градусов в дуге | Yoyda necha gradus bor | How many degrees are in the arc |
| `task.ok` | Шестьдесят. Дуга идёт от шестидесяти до ста двадцати градусов. | Oltmish. Yoy oltmishdan bir yuz yigirma gradusgacha boradi. | Sixty. The arc runs from sixty to one hundred twenty degrees. |
| `task.hint.1` | Найди углы, где синус равен корню из трёх на два. | Sinus uchdan ildizni ikkiga bo'lganga teng burchaklarni toping. | Find the angles where the sine equals root three over two. |
| `task.hint.2` | Это шестьдесят и сто двадцать градусов. | Bular oltmish va bir yuz yigirma gradus. | Those are sixty and one hundred twenty degrees. |
| `task.hint.3` | Шестьдесят. | Oltmish. | Sixty. |
| `order.prompt` | Расставь неравенства по возрастанию длины дуги | Tengsizliklarni yoy uzunligi o'sishi bo'yicha joylashtiring | Put the inequalities in order of increasing arc length |
| `order.title` | от короткой дуги к длинной | qisqa yoydan uzuniga | from the shortest arc to the longest |
| `order.ok` | Верно. Чем ниже прямая, тем длиннее дуга над ней. | To'g'ri. To'g'ri chiziq qancha past bo'lsa, ustidagi yoy shuncha uzun. | Correct. The lower the line, the longer the arc above it. |
| `order.bad` | Сравнивай дуги, а не числа справа. | O'ngdagi sonlarni emas, yoylarni solishtiring. | Compare the arcs, not the numbers on the right. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `sin x > √3/2` |
| `task.answer` | `60` |
| `order.items` | `sin x > 0` · `sin x > √3/2` · `sin x > −1/2` · `sin x > 1/2` |
| `order.answer` | `sin x > √3/2  sin x > 1/2  sin x > 0  sin x > −1/2` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Исходное неравенство, здесь ошибки быть не может. | Dastlabki tengsizlik, bu yerda xato bo'lishi mumkin emas. | The original inequality, no mistake can live here. |
| `hint.r2` | Посмотри на знак. Он остался тем же? | Ishoraga qarang. U o'sha bo'lib qoldimi? | Look at the sign. Did it stay the same? |
| `hint.r3` | Из предыдущей строки это следует верно, но сама она уже неверна. | Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri. | This follows correctly from the previous line, but that line is already wrong. |
| `proof` | Возьми девяносто градусов: синус равен единице, а это больше одной второй. | To'qson gradusni oling: sinus birga teng, bu esa bir ikkidandan katta. | Take ninety degrees: the sine equals one, and that is greater than one half. |
| `entry.prompt` | Сколько градусов дуги потерялось? | Yoyning necha gradusi yo'qoldi? | How many degrees of the arc were lost? |
| `entry.ok` | Сто двадцать. Вся дуга от тридцати до ста пятидесяти свелась к одной точке. | Bir yuz yigirma. O'ttizdan bir yuz ellikkacha bo'lgan butun yoy bitta nuqtaga aylanib qoldi. | One hundred twenty. The whole arc from thirty to one hundred fifty shrank to a single point. |
| `entry.hint.1` | Правильный ответ был дугой. Между какими углами? | To'g'ri javob yoy edi. Qaysi burchaklar orasida? | The correct answer was an arc. Between which angles? |
| `entry.hint.2` | От тридцати до ста пятидесяти градусов. | O'ttizdan bir yuz ellik gradusgacha. | From thirty to one hundred fifty degrees. |
| `entry.hint.3` | Сто двадцать. | Bir yuz yigirma. | One hundred twenty. |
| `audio.mount` | Четыре строки. Знак неравенства потерялся в самом начале. | To'rt qator. Tengsizlik ishorasi eng boshida yo'qoldi. | Four lines. The inequality sign got lost at the very beginning. |
| `audio.next` | Дальше обратная задача: по дуге восстанови ответ. | Keyin teskari masala: yoyga qarab javobni tiklang. | Next comes the reverse task: rebuild the answer from the arc. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `sin x > 1/2` |
| `row.r2` | `sin x = 1/2` |
| `row.r3` | `x = 30° + 360°n` |
| `row.r4` | `x = 30°` |
| `answerId` | `r2` |
| `entry.answer` | `120` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Дуга решений идёт от сорока пяти до ста тридцати пяти градусов. Сколько в ней градусов? | Yechimlar yoyi qirq beshdan bir yuz o'ttiz besh gradusgacha boradi. Unda necha gradus bor? | The arc of solutions runs from forty five to one hundred thirty five degrees. How many degrees are in it? |
| `entry.ok` | Девяносто. Сто тридцать пять минус сорок пять. | To'qson. Bir yuz o'ttiz besh minus qirq besh. | Ninety. One hundred thirty five minus forty five. |
| `entry.hint.1` | Вычти меньший угол из большего. | Kichik burchakni kattasidan ayiring. | Subtract the smaller angle from the larger one. |
| `entry.hint.2` | Сто тридцать пять минус сорок пять. | Bir yuz o'ttiz besh minus qirq besh. | One hundred thirty five minus forty five. |
| `entry.hint.3` | Девяносто. | To'qson. | Ninety. |
| `multi.prompt` | Отметь все углы, при которых неравенство верно | Tengsizlik to'g'ri bo'ladigan barcha burchaklarni belgilang | Mark every angle for which the inequality holds |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Этот угол лежит ниже прямой: синус там отрицательный. | Bu burchak to'g'ri chiziqdan pastda: u yerda sinus manfiy. | This angle lies below the line: the sine there is negative. |
| `multi.d.hint` | Этот угол до тридцати градусов, синус там меньше одной второй. | Bu burchak o'ttiz gradusgacha, u yerda sinus bir ikkidandan kichik. | This angle is before thirty degrees, the sine there is less than one half. |
| `multi.ok` | Верно. Годятся углы внутри дуги, и только они. | To'g'ri. Yoy ichidagi burchaklar yaraydi, faqat ular. | Correct. The angles inside the arc work, and only they. |
| `audio.mount` | Теперь наоборот. Сначала посчитай длину дуги по её концам. | Endi teskarisiga. Avval chekkalariga qarab yoy uzunligini hisoblang. | Now the other way round. First compute the length of the arc from its ends. |
| `audio.work` | Потом отметь все углы, при которых синус больше одной второй. | Keyin sinus bir ikkidandan katta bo'ladigan barcha burchaklarni belgilang. | Then mark every angle at which the sine is greater than one half. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `45° < x < 135°` |
| `entry.answer` | `90` |
| `multi.a` [верно] | `90°` |
| `multi.b` [верно] | `140°` |
| `multi.c` | `200°` |
| `multi.d` | `20°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Чем является ответ тригонометрического неравенства? | Trigonometrik tengsizlikning javobi nima bo'ladi? | What is the answer of a trigonometric inequality? |
| `q1.a` [верно] | дугой и её оборотами | yoy va uning aylanishlari | an arc and its turns |
| `q1.b` | одной точкой | bitta nuqta | a single point |
| `q1.b.hint` | Одна точка была бы ответом уравнения. | Bitta nuqta tenglamaning javobi bo'lardi. | A single point would be the answer of an equation. |
| `q1.c` | двумя точками | ikki nuqta | two points |
| `q1.c.hint` | Две точки это границы дуги, а не сама дуга. | Ikki nuqta yoyning chegarasi, yoyning o'zi emas. | Two points are the boundaries of the arc, not the arc itself. |
| `q1.d` | всей окружностью | butun aylana | the whole circle |
| `q1.d.hint` | Вся окружность бывает только в вырожденном случае. | Butun aylana faqat aynigan holda bo'ladi. | The whole circle happens only in the degenerate case. |
| `q2.prompt` | Сколько решений у синуса больше двух? | Sinus ikkidan katta bo'lganda nechta yechim bor? | How many solutions does sine greater than two have? |
| `q2.a` [верно] | ни одного | bitta ham yo'q | none |
| `q2.b` | одно | bitta | one |
| `q2.b.hint` | Прямая прошла выше круга, пересечений нет вовсе. | To'g'ri chiziq doiradan yuqoridan o'tdi, kesishish umuman yo'q. | The line passed above the circle, there are no crossings at all. |
| `q2.c` | бесконечно много | cheksiz ko'p | infinitely many | 
| `q2.c.hint` | Бесконечно много было бы при минус двух справа. | Cheksiz ko'p o'ngda minus ikki bo'lganda bo'lardi. | Infinitely many would happen with minus two on the right. |
| `q2.d` | два | ikki | two |
| `q2.d.hint` | Два было бы, если бы прямая пересекла окружность. | Ikki to'g'ri chiziq aylanani kesib o'tganda bo'lardi. | Two would happen if the line crossed the circle. |
| `q3.prompt` | Сколько градусов в дуге решений? | Yechimlar yoyida necha gradus bor? | How many degrees are in the arc of solutions? |
| `q3.a` [верно] | сто восемьдесят | bir yuz sakson | one hundred eighty |
| `q3.a.ok` | Сто восемьдесят. Синус положителен на всей верхней половине круга. | Bir yuz sakson. Sinus doiraning butun yuqori yarmida musbat. | One hundred eighty. The sine is positive on the whole upper half of the circle. |
| `q3.b` | девяносто | to'qson | ninety |
| `q3.b.hint` | Девяносто это четверть круга, а положительна половина. | To'qson doiraning choragi, musbat qismi esa yarmi. | Ninety is a quarter of the circle, while the positive part is a half. |
| `q3.c` | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q3.c.hint` | Это весь круг, но внизу синус отрицателен. | Bu butun doira, pastda esa sinus manfiy. | That is the whole circle, but at the bottom the sine is negative. |
| `q3.d` | сто двадцать | bir yuz yigirma | one hundred twenty |
| `q3.d.hint` | Сто двадцать выходит при одной второй, а здесь ноль. | Bir yuz yigirma bir ikkidanda chiqadi, bu yerda esa nol. | One hundred twenty comes with one half, and here it is zero. |
| `q4.prompt` | Что добавляют к концам дуги? | Yoyning chekkalariga nima qo'shiladi? | What is added to the ends of the arc? |
| `q4.a` [верно] | триста шестьдесят градусов, умноженные на целое число | butun songa ko'paytirilgan uch yuz oltmish gradus | three hundred sixty degrees times a whole number |
| `q4.b` | сто восемьдесят градусов | bir yuz sakson gradus | one hundred eighty degrees |
| `q4.b.hint` | Половина оборота уводит точку в другое место круга. | Yarim aylanish nuqtani doiraning boshqa joyiga olib ketadi. | Half a turn takes the point to another place on the circle. |
| `q4.c` | ничего | hech nima | nothing |
| `q4.c.hint` | Тогда останется одна дуга из бесконечного числа. | U holda cheksiz sondan bitta yoy qoladi. | Then one arc out of infinitely many would remain. |
| `q4.d` | девяносто градусов | to'qson gradus | ninety degrees |
| `q4.d.hint` | Четверть оборота точку на место не возвращает. | Chorak aylanish nuqtani joyiga qaytarmaydi. | A quarter turn does not bring the point back. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `30° < x < 150°` |
| `q2.done` | `sin x > 2` |
| `q3.done` | `sin x > 0` |
| `q4.done` | `+ 360°n` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Нахожу обе границы дуги на окружности | Aylanada yoyning ikkala chegarasini topaman | I find both boundaries of the arc on the circle |
| `can.2` | Беру дугу, а не точку | Nuqta emas, yoy olaman | I take the arc, not the point |
| `can.3` | Добавляю обороты к обоим концам | Ikkala chekkaga aylanishlarni qo'shaman | I add the turns to both ends |
| `can.4` | Вижу случай, когда решений нет вовсе | Umuman yechim yo'q holni ko'raman | I spot the case where there are no solutions at all |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: обороты у обоих концов. | Bir joy takrorlashni talab qiladi: ikkala chekkadagi aylanishlar. | One spot needs a second look: the turns at both ends. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va beshinchi ekranga qayting. | Go back to the rule and to screen five. |
| `bridge` | Блок закрыт: степень, показательная, логарифм, неравенства. Дальше практикум повторения. | Blok yopildi: daraja, ko'rsatkichli, logarifm, tengsizliklar. Keyin takrorlash amaliyoti. | The block is closed: powers, the exponential, the logarithm, inequalities. Next comes the review practicum. |
| `lifehack` | Сначала посмотри на число справа. Если оно больше единицы или меньше минус единицы, решать нечего. | Avval o'ngdagi songa qarang. Agar u birdan katta yoki minus birdan kichik bo'lsa, yechadigan narsa yo'q. | Look at the number on the right first. If it is greater than one or less than minus one, there is nothing to solve. |
| `sheetTitle` | Тригон. неравенства · шпаргалка | Trig. tengsizliklar · shpargalka | Trig. inequalities · cheat sheet |
| `sheetSrc` | 10 класс · урок 36 | 10-sinf · 36-dars | Grade 10 · lesson 36 |
| `audio.mount` | Прогноз был про точку и дугу. Посмотрим, что вышло. | Taxmin nuqta va yoy haqida edi. Nima chiqqanini ko'ramiz. | The guess was about a point and an arc. Let us see how it turned out. |
| `audio.next` | Дуга. Точки оказались её границами, а не ответом, и к ним добавились обороты. | Yoy. Nuqtalar javob emas, uning chegarasi bo'lib chiqdi, va ularga aylanishlar qo'shildi. | An arc. The points turned out to be its boundaries rather than the answer, and the turns were added to them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `x = 30°` |
| `hook.b` | `30° < x < 150°` |
| `proved` | `30° < x < 150°` |
| `law` | `30° < x < 150°` |
| `sheet.1` | `−1 ≤ sin x ≤ 1` |
| `sheet.2` | `sin 30° = 1/2` |
| `sheet.3` | `sin 150° = 1/2` |
| `sheet.4` | `+ 360°n` |
| `sheet.5` | `sin x > 2   →   ∅` |
