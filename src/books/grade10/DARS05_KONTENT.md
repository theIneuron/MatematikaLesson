# Урок 5 — Чётность и период · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS04_KONTENT.md`: на экран две
таблицы — «Текст» (ключ, RU, UZ, EN) и «Формулы» (ключ, значение). Звёздочка после имени реплики
означает, что во время неё на экране движется.

Скелет: `DARS04_06_SKELET.md` §7. Опора в учебнике: алгебра 2022, стр. 134–135 (положительный и
отрицательный поворот, периодичность, основной период `2π` и `π`, чётность и нечётность).

**Что этот урок вводит первым в классе:** отрицательный поворот. Слово «четверть» уже введено
уроком 4, «функция от числа» будет в уроке 6, котангенса нет нигде в блоке.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

Две записи различаются одним знаком. Ученик, помнящий «синус нечётный», выберет вторую; ученик,
переносящий чётность косинуса на синус, — первую. Прогноз до действия.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЁТНОСТЬ | JUFTLIK | PARITY |
| `title` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `row.a.name` | знак сохранился | ishora saqlandi | the sign stayed |
| `row.b.name` | знак сменился | ishora almashdi | the sign flipped |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим его зеркалом. | Javobingiz yozib olindi. Endi uni ko'zgu bilan tekshiramiz. | Your answer is saved. Now the mirror will check it. |
| `audio.mount*` | Точка едет вниз, под ось. Такой поворот называют отрицательным. | Nuqta pastga, o'q ostiga suriladi. Bunday burish manfiy deyiladi. | The point moves down, below the axis. Such a turn is called negative. |
| `audio.r1` | Первая запись говорит, что знак сохранился. | Birinchi yozuv ishora saqlandi deydi. | The first reading says the sign stayed. |
| `audio.r2` | Вторая говорит, что он сменился. | Ikkinchisi esa almashdi deydi. | The second says it flipped. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `sin(−30°) = ?` |
| `row.a.value` | `sin(−30°) = 1/2` |
| `row.b.value` | `sin(−30°) = −1/2` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед зеркалом | Ko'zgu oldidan uch savol | Three questions before the mirror |
| `q1.prompt` | Куда идёт положительный поворот? | Musbat burish qayoqqa boradi? | Which way does a positive turn go? |
| `q1.a` [верно] | против часовой | soat miliga qarshi | counterclockwise |
| `q1.b` | по часовой | soat mili bo'ylab | clockwise |
| `q1.b.hint` | По часовой пойдёт отрицательный поворот, и он появится сегодня. | Soat mili bo'ylab manfiy burish boradi, u bugun paydo bo'ladi. | Clockwise is the negative turn, and it appears today. |
| `q1.c` | сверху вниз | tepadan pastga | from top to bottom |
| `q1.c.hint` | Счёт идёт по кругу, а не сверху вниз. | Sanoq aylana bo'ylab boradi, tepadan pastga emas. | The count goes round the circle, not top to bottom. |
| `q1.d` | как удобно | qulay tomondan | whichever way suits |
| `q1.d.hint` | Направление задано договором, иначе один угол дал бы две точки. | Yo'nalish kelishuv bilan berilgan, aks holda bitta burchak ikki nuqta berardi. | The direction is fixed by agreement, otherwise one angle would give two points. |
| `q2.prompt` | Чему равен синус тридцати градусов? | O'ttiz gradusning sinusi qancha? | What is the sine of thirty degrees? |
| `q2.a` [верно] | одна вторая | bir ikkidan | one half |
| `q2.b` | корень из трёх на два | uch ildizining yarmi | root three over two |
| `q2.b.hint` | Это высота шестидесяти градусов, а не тридцати. | Bu oltmish gradusning balandligi, o'ttizniki emas. | That is the height at sixty degrees, not thirty. |
| `q2.c` | корень из двух на два | ikki ildizining yarmi | root two over two |
| `q2.c.hint` | Это сорок пять градусов, там оба числа равны. | Bu qirq besh gradus, u yerda ikki son teng. | That is forty five degrees, where both numbers are equal. |
| `q2.d` | единица | bir | one |
| `q2.d.hint` | Единица бывает только на самом верху, на девяноста градусах. | Bir faqat eng tepada, to'qson gradusda bo'ladi. | One happens only at the very top, at ninety degrees. |
| `q3.prompt` | Сколько градусов в полном обороте? | To'liq aylanada necha gradus bor? | How many degrees are in a full turn? |
| `q3.a` [верно] | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q3.b` | сто восемьдесят | yuz sakson | one hundred eighty |
| `q3.b.hint` | Сто восемьдесят это половина оборота. | Yuz sakson bu yarim aylana. | One hundred eighty is half a turn. |
| `q3.c` | девяносто | to'qson | ninety |
| `q3.c.hint` | Девяносто это четверть оборота. | To'qson bu chorak aylana. | Ninety is a quarter turn. |
| `q3.d` | двести семьдесят | ikki yuz yetmish | two hundred seventy |
| `q3.d.hint` | Это три четверти, до полного оборота не хватает ещё одной. | Bu uch chorak, to'liq aylanaga yana bittasi yetmaydi. | That is three quarters, one more is missing for a full turn. |
| `audio.mount` | Три коротких вопроса. Сегодня понадобятся все три. | Uch qisqa savol. Bugun uchalasi ham kerak bo'ladi. | Three short questions. All three will be needed today. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `+` |
| `q2.done` | `sin 30° = 1/2` |
| `q3.done` | `360°` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `sinus-chetnyy`

Отрицательный поворот вводится здесь. Пока без формул: просто вторая сторона счёта.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Счёт идёт в обе стороны | Sanoq ikki tomonga boradi | The count goes both ways |
| `show.1.1` | плюс шестьдесят: вверх | plyus oltmish: yuqoriga | plus sixty: upward |
| `show.1.2` | это привычный поворот | bu odatdagi burish | this is the usual turn |
| `show.2.1` | минус шестьдесят: вниз | minus oltmish: pastga | minus sixty: downward |
| `show.2.2` | тот же угол, другая сторона | o'sha burchak, boshqa tomon | the same angle, the other way |
| `audio.mount` | Точка на шестидесяти градусах. Счёт шёл против часовой, и это положительный поворот. | Nuqta oltmish gradusda. Sanoq soat miliga qarshi ketdi, bu musbat burish. | The point is at sixty degrees. The count went counterclockwise, and that is a positive turn. |
| `audio.down*` | А теперь точка едет в другую сторону, по часовой. Такой поворот записывают со знаком минус. Угол тот же, сторона другая. | Endi esa nuqta boshqa tomonga, soat mili bo'ylab suriladi. Bunday burish minus ishorasi bilan yoziladi. Burchak o'sha, tomon boshqa. | Now the point moves the other way, clockwise. Such a turn is written with a minus sign. The same angle, the other way. |
| `audio.work` | Теперь сам. Поставь точку на минус шестьдесят градусов. | Endi o'zingiz. Nuqtani minus oltmish gradusga qo'ying. | Now you. Place the point at minus sixty degrees. |
| `work.prompt` | Поставь точку на минус шестьдесят градусов. | Nuqtani minus oltmish gradusga qo'ying. | Place the point at minus sixty degrees. |
| `work.ok` | Это тот же угол, но отложенный по часовой. Высота ушла вниз, а сдвиг остался прежним. | Bu o'sha burchak, lekin soat mili bo'ylab qo'yilgan. Balandlik pastga tushdi, siljish esa o'sha bo'lib qoldi. | The same angle, laid clockwise. The height went down, the shift stayed as it was. |
| `work.hint.1` | Минус означает по часовой, то есть вниз от правой точки. | Minus soat mili bo'ylab degani, ya'ni o'ng nuqtadan pastga. | Minus means clockwise, that is downward from the right point. |
| `work.hint.2` | Это слишком далеко. Нужно ровно столько же, сколько было вверх. | Bu juda uzoq. Yuqoriga qancha bo'lsa, shuncha kerak. | That is too far. You need exactly as much as it was upward. |
| `work.hint.3` | Отложи вниз такой же угол, как был отложен вверх. | Yuqoriga qo'yilgan burchakning o'zini pastga qo'ying. | Lay downward the same angle that was laid upward. |

---

## Экран 4 · `explain2` · ответ `lead` · тег `sinus-chetnyy`

Свидетель урока. Зеркало: сдвиг не двинулся, высота перевернулась. Две формулы получаются из
одного движения, а не заучиваются по отдельности.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Сдвиг остался, высота перевернулась | Siljish qoldi, balandlik ag'darildi | The shift stayed, the height flipped |
| `show.1.1` | точка выше оси | nuqta o'qdan yuqorida | the point is above the axis |
| `show.1.2` | оба числа положительны | ikki son ham musbat | both numbers are positive |
| `show.2.1` | зеркало по горизонтальной оси | gorizontal o'q bo'ylab ko'zgu | a mirror along the horizontal axis |
| `show.2.2` | сдвиг не двинулся | siljish qimirlamadi | the shift did not move |
| `show.3.1` | высота стала противоположной | balandlik qarama-qarshi bo'ldi | the height became the opposite |
| `audio.mount` | Точка на шестидесяти градусах, оба числа положительны. | Nuqta oltmish gradusda, ikki son ham musbat. | The point is at sixty degrees, both numbers are positive. |
| `audio.mirror*` | Смотри внимательно на горизонтальный отрезок. Точка отражается вниз, а он не двигается совсем. | Gorizontal kesmaga diqqat bilan qarang. Nuqta pastga aks etadi, u esa umuman qimirlamaydi. | Watch the horizontal segment closely. The point reflects downward, and it does not move at all. |
| `audio.both*` | Теперь обе точки рядом. Сдвиг у них общий, а высоты противоположны. Отсюда сразу два правила, и запоминать их по отдельности не нужно. | Endi ikki nuqta yonma-yon. Siljishi umumiy, balandliklari esa qarama-qarshi. Shundan ikkita qoida chiqadi, va ularni alohida yodlash shart emas. | Now both points side by side. They share the shift, their heights are opposite. Two rules come from this at once, and you need not memorise them separately. |
| `audio.work` | Теперь сам. Поставь точку так, чтобы её сдвиг был как у тридцати градусов, а высота ушла вниз. | Endi o'zingiz. Siljishi o'ttiz gradusdagidek, balandligi esa pastga ketgan nuqtani qo'ying. | Now you. Place the point so its shift matches thirty degrees and its height goes down. |
| `work.prompt` | Поставь точку: сдвиг как у тридцати градусов, высота вниз. | Nuqtani qo'ying: siljish o'ttiz gradusdagidek, balandlik pastga. | Place the point: the shift as at thirty degrees, the height down. |
| `work.ok` | Это минус тридцать градусов, тот самый угол с первого экрана. Косинус тот же, синус противоположный. | Bu minus o'ttiz gradus, birinchi ekrandagi o'sha burchak. Kosinus o'sha, sinus esa qarama-qarshi. | That is minus thirty degrees, the very angle from the first screen. The cosine is the same, the sine is the opposite. |
| `work.hint.1` | Сдвиг должен остаться прежним, то есть точка правее середины. | Siljish o'sha bo'lib qolishi kerak, ya'ni nuqta o'rtadan o'ngda. | The shift must stay the same, so the point is right of the middle. |
| `work.hint.2` | Высота должна уйти ниже оси. | Balandlik o'qdan pastga tushishi kerak. | The height must go below the axis. |
| `work.hint.3` | Нужна точка ровно под той, что была: сдвиг тот же, высота вниз. | Avvalgi nuqtaning aynan tagida nuqta kerak: siljish o'sha, balandlik pastga. | You need the point directly below the previous one: the same shift, the height down. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.3.2` | `cos(−α) = cos α,   sin(−α) = −sin α` |

---

## Экран 5 · `explain3` · ответ `lead` · тег `period-bez-vozvrata`

Второй свидетель. Полный оборот возвращает точку **в ту же самую**, а не в похожую: она садится
ровно в кольцо, откуда вышла.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Полный оборот возвращает в ту же точку | To'liq aylana o'sha nuqtaga qaytaradi | A full turn returns to the same point |
| `show.1.1` | точка на тридцати градусах | nuqta o'ttiz gradusda | the point is at thirty degrees |
| `show.1.2` | место отмечено кольцом | joy halqa bilan belgilangan | the spot is marked with a ring |
| `show.2.1` | оборот пройден | aylana bosib o'tildi | the turn is complete |
| `show.2.2` | точка села ровно в кольцо | nuqta aynan halqaga tushdi | the point landed exactly in the ring |
| `audio.mount` | Точка на тридцати градусах. Её место отмечено кольцом, чтобы было видно, куда она вернётся. | Nuqta o'ttiz gradusda. Uning joyi halqa bilan belgilangan, qayerga qaytishi ko'rinsin. | The point is at thirty degrees. Its spot is marked with a ring so you can see where it returns. |
| `audio.turn*` | Теперь точка идёт по кругу и проходит полный оборот. Смотри, куда она придёт. | Endi nuqta aylana bo'ylab yuradi va to'liq aylanani bosib o'tadi. Qayerga kelishiga qarang. | Now the point goes round and completes a full turn. Watch where it arrives. |
| `audio.same` | Она села ровно в кольцо. Это не похожая точка, а та же самая, значит и все три значения у неё те же. | U aynan halqaga tushdi. Bu o'xshash nuqta emas, aynan o'sha, demak uning uchala qiymati ham o'sha. | It landed exactly in the ring. Not a similar point but the very same one, so all three of its values are the same too. |
| `audio.work` | Теперь сам. Поставь точку на триста девяносто градусов. | Endi o'zingiz. Nuqtani uch yuz to'qson gradusga qo'ying. | Now you. Place the point at three hundred ninety degrees. |
| `work.prompt` | Поставь точку на 390 градусов. | Nuqtani 390 gradusga qo'ying. | Place the point at 390 degrees. |
| `work.ok` | Триста девяносто это оборот и ещё тридцать. Точка там же, где у тридцати градусов. | Uch yuz to'qson bu aylana va yana o'ttiz. Nuqta o'ttiz gradusdagi joyda. | Three hundred ninety is a turn plus thirty. The point sits where thirty degrees sits. |
| `work.hint.1` | Отбрось полный оборот и посмотри, что осталось. | To'liq aylanani tashlab, nima qolganiga qarang. | Drop the full turn and see what is left. |
| `work.hint.2` | Триста девяносто минус триста шестьдесят даёт тридцать. | Uch yuz to'qsondan uch yuz oltmishni ayirsak, o'ttiz bo'ladi. | Three hundred ninety minus three hundred sixty gives thirty. |
| `work.hint.3` | Нужна точка на тридцати градусах. | O'ttiz gradusdagi nuqta kerak. | You need the point at thirty degrees. |

---

## Экран 6 · `explain4` · ответ `lead` · тег `period-bez-vozvrata`

Два оборота, а не один. С одним ученик запоминает частный случай «прибавили триста шестьдесят»;
со вторым видно правило.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Сколько оборотов ни делай | Necha aylana qilsangiz ham | However many turns you make |
| `show.1.1` | два оборота подряд | ketma-ket ikki aylana | two turns in a row |
| `show.1.2` | точка снова в кольце | nuqta yana halqada | the point is in the ring again |
| `show.2.1` | оборотов может быть сколько угодно | aylanalar soni har qancha bo'lishi mumkin | there can be any number of turns |
| `audio.mount` | Одного оборота мало, чтобы поверить. Сделаем два. | Ishonish uchun bitta aylana kam. Ikkitasini qilamiz. | One turn is not enough to be sure. Let us make two. |
| `audio.two*` | Точка идёт дальше и проходит второй оборот. И снова садится в то же кольцо. | Nuqta oldinga yuradi va ikkinchi aylanani bosib o'tadi. Va yana o'sha halqaga tushadi. | The point goes on and completes a second turn. And lands in the same ring again. |
| `audio.rule` | Значит дело не в числе триста шестьдесят, а в целом числе оборотов. Прибавь их сколько угодно, точка не сдвинется. | Demak gap uch yuz oltmish sonida emas, butun sondagi aylanalarda. Ularni istagancha qo'shing, nuqta qimirlamaydi. | So it is not about the number three hundred sixty but about a whole number of turns. Add as many as you like, the point will not move. |
| `audio.work` | Теперь сам. Поставь точку на семьсот восемьдесят градусов. | Endi o'zingiz. Nuqtani yetti yuz sakson gradusga qo'ying. | Now you. Place the point at seven hundred eighty degrees. |
| `work.prompt` | Поставь точку на 780 градусов. | Nuqtani 780 gradusga qo'ying. | Place the point at 780 degrees. |
| `work.ok` | Семьсот восемьдесят это два оборота и ещё шестьдесят. Обороты ушли, остался угол. | Yetti yuz sakson bu ikki aylana va yana oltmish. Aylanalar ketdi, burchak qoldi. | Seven hundred eighty is two turns plus sixty. The turns are gone, the angle is left. |
| `work.hint.1` | Отбрасывай по триста шестьдесят, пока останется меньше оборота. | Aylanadan kam qolguncha uch yuz oltmishdan tashlab boring. | Keep dropping three hundred sixty until less than a turn is left. |
| `work.hint.2` | Семьсот восемьдесят минус семьсот двадцать даёт шестьдесят. | Yetti yuz saksondan yetti yuz yigirmani ayirsak, oltmish bo'ladi. | Seven hundred eighty minus seven hundred twenty gives sixty. |
| `work.hint.3` | Нужна точка на шестидесяти градусах. | Oltmish gradusdagi nuqta kerak. | You need the point at sixty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.2.2` | `sin(α + 360°k) = sin α` |

---

## Экран 7 · `explain5` · ответ `number` · тег `period-bez-vozvrata`

Граничный случай: у тангенса период меньше. Половина оборота меняет знаки у обоих чисел, а их
отношение не меняется. Ученик пишет число.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | У тангенса период короче | Tangensning davri qisqaroq | The tangent has a shorter period |
| `show.1.1` | половина оборота | yarim aylana | half a turn |
| `show.1.2` | оба числа сменили знак | ikki son ham ishorasini almashtirdi | both numbers changed sign |
| `audio.mount` | Синус и косинус повторяются через полный оборот. А тангенс это отношение, и у отношения счёт другой. | Sinus va kosinus to'liq aylanadan keyin takrorlanadi. Tangens esa nisbat, va nisbatning hisobi boshqa. | Sine and cosine repeat after a full turn. But the tangent is a ratio, and a ratio counts differently. |
| `audio.half*` | Точка идёт дальше и проходит половину оборота. Оба числа стали противоположными, а минус на минус даёт плюс, и отношение осталось тем же. | Yarim aylanani bosib o'tamiz. Ikki son ham qarama-qarshi bo'ldi, minusga minus esa plyus beradi, va nisbat o'sha bo'lib qoldi. | Let us go half a turn. Both numbers became opposite, and minus over minus gives plus, so the ratio stayed the same. |
| `audio.work` | Посчитай сам. Через сколько градусов повторяется тангенс? | O'zingiz hisoblang. Tangens necha gradusdan keyin takrorlanadi? | Compute it yourself. After how many degrees does the tangent repeat? |
| `work.prompt` | Через сколько градусов повторяется тангенс? | Tangens necha gradusdan keyin takrorlanadi? | After how many degrees does the tangent repeat? |
| `work.ok` | Сто восемьдесят. Это вдвое меньше, чем у синуса и косинуса, потому что отношение не замечает, что оба знака сменились. | Yuz sakson. Bu sinus va kosinusnikidan ikki baravar kam, chunki nisbat ikkala ishora almashganini sezmaydi. | One hundred eighty. That is half of the sine and cosine period, because the ratio does not notice that both signs flipped. |
| `work.hint.1` | Синус и косинус повторяются через триста шестьдесят. У тангенса это происходит раньше. | Sinus va kosinus uch yuz oltmishdan keyin takrorlanadi. Tangensda bu ertaroq bo'ladi. | Sine and cosine repeat after three hundred sixty. For the tangent it happens sooner. |
| `work.hint.2` | Половина оборота меняет оба знака, а отношение оставляет прежним. | Yarim aylana ikkala ishorani almashtiradi, nisbatni esa o'sha holda qoldiradi. | Half a turn flips both signs and leaves the ratio as it was. |
| `work.hint.3` | Сто восемьдесят. | Yuz sakson. | One hundred eighty. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `180` |
| `show.1.3` | `tg(α + 180°) = tg α` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `sinus-chetnyy`

Чек различения, потом карточка словами учебника (стр. 134–135).

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Чётность и период | Juftlik va davr | Parity and period |
| `probe.question` | Какая функция чётная? | Qaysi funksiya juft? | Which function is even? |
| `probe.a` [верно] | косинус | kosinus | the cosine |
| `probe.b` | синус | sinus | the sine |
| `probe.b.hint` | У синуса зеркало переворачивает высоту, значит знак меняется. Чётный тот, у кого ничего не изменилось. | Sinusda ko'zgu balandlikni ag'daradi, demak ishora almashadi. Juft deb hech narsasi o'zgarmaganini aytadi. | For the sine the mirror flips the height, so the sign changes. Even is the one where nothing changed. |
| `rule.lawLabel` | Зеркало | Ko'zgu | The mirror |
| `rule.lines.1` | Функция `y = cos x` чётная: `cos(−x) = cos x`. | `y = cos x` funksiya juft: `cos(−x) = cos x`. | The function `y = cos x` is even: `cos(−x) = cos x`. |
| `rule.lines.2` | Функции `y = sin x` и `y = tg x` нечётные: `sin(−x) = −sin x`, `tg(−x) = −tg x`. | `y = sin x` va `y = tg x` funksiyalar toq: `sin(−x) = −sin x`, `tg(−x) = −tg x`. | The functions `y = sin x` and `y = tg x` are odd: `sin(−x) = −sin x`, `tg(−x) = −tg x`. |
| `rule.lines.3` | Основной период синуса и косинуса равен `2π`, у тангенса он равен `π`. | Sinus va kosinusning asosiy davri `2π`, tangensniki esa `π`. | The main period of sine and cosine is `2π`, of the tangent it is `π`. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Точка отражается ещё раз, и правило открывается рядом. Чётный тот, у кого зеркало ничего не изменило. | Nuqta yana bir bor aks etadi, va qoida yonida ochiladi. Juft deb ko'zgu hech narsasini o'zgartirmaganini aytadi. | The point reflects once more, and the rule opens beside it. Even is the one the mirror left unchanged. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `cos(−x) = cos x,   sin(−x) = −sin x` |
| `probe.done` | `cos` |

---

## Экран 9 · `drill` · ответ `build` · формат `table` · тег `sinus-chetnyy`

Три угла. Первые два отличаются только знаком угла, и в таблице видно, что различие пришло только
во второе число.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Три угла, одно зеркало | Uch burchak, bitta ko'zgu | Three angles, one mirror |
| `table.wrong` | Смотри на чертёж: точка отмечена. Первое число это сдвиг, второе высота. | Chizmaga qarang: nuqta belgilangan. Birinchi son siljish, ikkinchisi balandlik. | Look at the drawing: the point is marked. The first number is the shift, the second the height. |
| `table.swap` | Числа перепутаны местами. Первое это сдвиг, второе высота. | Sonlar joy almashgan. Birinchisi siljish, ikkinchisi balandlik. | The numbers are swapped. The first is the shift, the second the height. |
| `table.ok` | Первое число одно и то же, второе противоположное. Это и есть чётность и нечётность. | Birinchi son bir xil, ikkinchisi qarama-qarshi. Juftlik va toqlik shu. | The first number is the same, the second opposite. That is evenness and oddness. |
| `audio.mount` | Три угла. Заполни пары и посмотри, чем отличаются первые два. | Uch burchak. Juftliklarni to'ldiring va birinchi ikkitasining farqini ko'ring. | Three angles. Fill in the pairs and see how the first two differ. |

**Формулы**

| Ключ | Значение |
|---|---|
| `table.rows` | `30°  →  (√3/2; 1/2)` · `−30°  →  (√3/2; −1/2)` · `210°  →  (−√3/2; −1/2)` |
| `table.chips` | `√3/2` · `−√3/2` · `1/2` · `−1/2` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `sinus-chetnyy`

Четыре шага: сначала убирается оборот, потом нечётность, потом значение.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Найди sin(−390°) по шагам | sin(−390°) ni qadamlar bilan toping | Find sin(−390°) step by step |
| `order.prompt` | Расставь шаги решения по порядку. | Yechim qadamlarini tartib bilan joylashtiring. | Put the steps of the solution in order. |
| `order.s2` | отбросить полный оборот | to'liq aylanani tashlash | drop the full turn |
| `order.s3` | синус нечётный | sinus toq | the sine is odd |
| `order.ok` | Минус одна вторая. Сначала убрали оборот, потом сняли минус с угла и поставили его перед значением. | Minus bir ikkidan. Avval aylanani olib tashladik, keyin burchakdagi minusni qiymat oldiga ko'chirdik. | Minus one half. First we removed the turn, then moved the minus from the angle in front of the value. |
| `order.bad` | Сначала убирается полный оборот, потом применяется нечётность, потом берётся значение. | Avval to'liq aylana olib tashlanadi, keyin toqlik qo'llanadi, keyin qiymat olinadi. | First the full turn is removed, then oddness is applied, then the value is taken. |
| `audio.mount` | Минус триста девяносто градусов. Шаги названы, порядок ставишь ты. | Minus uch yuz to'qson gradus. Qadamlar nomlangan, tartibini o'zingiz qo'yasiz. | Minus three hundred ninety degrees. The steps are named, you put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.s1` | `−390° = −(360° + 30°)` |
| `order.s4` | `sin(−30°) = −1/2` |
| `order.mark` | `−30°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Минус один. Косинус чётный, значит минус у угла ничего не меняет, а у ста восьмидесяти сдвиг равен минус одному. | Minus bir. Kosinus juft, demak burchakdagi minus hech narsani o'zgartirmaydi, yuz saksonda esa siljish minus birga teng. | Minus one. The cosine is even, so the minus on the angle changes nothing, and at one hundred eighty the shift is minus one. |
| `task.hint.1` | Косинус чётный: минус у угла можно убрать. | Kosinus juft: burchakdagi minusni olib tashlash mumkin. | The cosine is even: the minus on the angle can be dropped. |
| `task.hint.2` | Остаётся косинус ста восьмидесяти, а это левая точка окружности. | Yuz saksonning kosinusi qoladi, bu esa aylananing chap nuqtasi. | The cosine of one hundred eighty is left, and that is the left point of the circle. |
| `task.hint.3` | Минус один. | Minus bir. | Minus one. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой синус меньше? | Qaysi sinus kichikroq? | Which sine is smaller? |
| `order.ok` | Ты сравнил со знаком: минус один меньше минус одной второй, а ноль меньше одной второй. | Siz ishora bilan solishtirdingiz: minus bir minus bir ikkidandan kichik, nol esa bir ikkidandan kichik. | You compared with the sign: minus one is less than minus one half, and zero is less than one half. |
| `order.bad` | Сначала переведи каждую запись в число, помня, что синус нечётный. | Avval har yozuvni songa o'tkazing, sinus toq ekanini esda tutib. | First turn each reading into a number, remembering the sine is odd. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `cos(−180°)  =  ?` |
| `task.answer` | `−1` |
| `order.items` | `sin(−90°)` · `sin(−30°)` · `sin 0` · `sin 30°` |
| `order.answer` | `sin(−90°)  sin(−30°)  sin 0  sin 30°` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

Вторая строка верна и написана правильно. Третья ей же и противоречит: чётность записали, а
применили нечётность.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob noto'g'ri. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r2` | Эта строка верна: косинус действительно чётный. | Bu qator to'g'ri: kosinus haqiqatan ham juft. | This line is right: the cosine really is even. |
| `hint.r4` | Значение ста двадцати градусов посчитано верно. Первая неверная строка выше. | Yuz yigirma gradusning qiymati to'g'ri hisoblangan. Birinchi xato qator yuqorida. | The value at one hundred twenty degrees is computed correctly. The first wrong line is above. |
| `proof` | Чётность записали, а применили нечётность. | Juftlikni yozdi, toqlikni qo'lladi. | Evenness was written, oddness was applied. |
| `entry.prompt` | Чему равен cos(−120°)? | cos(−120°) qancha? | What is cos(−120°)? |
| `entry.ok` | Минус ноль целых пять. Косинус чётный, значит минус у угла ничего не меняет, и ответ такой же, как у ста двадцати. | Minus nol butun besh. Kosinus juft, demak burchakdagi minus hech narsani o'zgartirmaydi, javob yuz yigirmanikidek. | Minus zero point five. The cosine is even, so the minus on the angle changes nothing, and the answer matches one hundred twenty. |
| `entry.hint.1` | Косинус чётный: у минус ста двадцати и у ста двадцати он одинаковый. | Kosinus juft: minus yuz yigirmada va yuz yigirmada u bir xil. | The cosine is even: it is the same at minus one hundred twenty and at one hundred twenty. |
| `entry.hint.2` | У ста двадцати градусов сдвиг равен минус одной второй. | Yuz yigirma gradusda siljish minus bir ikkidanga teng. | At one hundred twenty degrees the shift is minus one half. |
| `entry.hint.3` | Минус ноль целых пять. | Minus nol butun besh. | Minus zero point five. |
| `audio.mount` | Задача. Надо найти косинус минус ста двадцати градусов. | Masala. Minus yuz yigirma gradusning kosinusini topish kerak. | A task. We need to find the cosine of minus one hundred twenty degrees. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `cos(−120°) = ?` |
| `row.r2` | `cos(−x) = cos x` |
| `row.r3` | `cos(−120°) = −cos 120°` |
| `row.r4` | `cos 120° = −1/2` |
| `answerId` | `r3` |
| `entry.answer` | `−0,5` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

Обратная задача: не «где точка для этого угла», а «какие углы дают эту точку». Ответ уже пишется
целым числом оборотов — блок Б2 возьмёт эту запись готовой.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Одна точка, много записей | Bitta nuqta, ko'p yozuv | One point, many readings |
| `place.prompt` | Поставь точку на 30 градусов. | Nuqtani 30 gradusga qo'ying. | Place the point at 30 degrees. |
| `place.ok` | Точка на месте. Теперь посмотрим, какие ещё записи приводят сюда же. | Nuqta joyida. Endi bu yerga yana qaysi yozuvlar olib kelishini ko'ramiz. | The point is in place. Now let us see which other readings lead here. |
| `place.wrong` | Тридцать градусов это треть прямого угла, чуть выше правой точки. | O'ttiz gradus bu to'g'ri burchakning uchdan biri, o'ng nuqtadan bir oz yuqorida. | Thirty degrees is a third of a right angle, just above the right point. |
| `multi.prompt` | Отметь все записи, которые дают ЭТУ ЖЕ точку. | AYNAN shu nuqtani beradigan hamma yozuvni belgilang. | Mark every reading that gives THIS SAME point. |
| `multi.title` | Какие записи дают эту же точку? | Qaysi yozuvlar aynan shu nuqtani beradi? | Which readings give this same point? |
| `multi.d.hint` | Минус тридцать это отражение, там высота уходит вниз. | Minus o'ttiz bu aks etish, u yerda balandlik pastga ketadi. | Minus thirty is the reflection, there the height goes down. |
| `multi.e.hint` | Здесь прибавлена половина оборота, а не целый. Точка окажется напротив. | Bu yerda yarim aylana qo'shilgan, butun emas. Nuqta qarshi tomonda bo'ladi. | Here half a turn was added, not a whole one. The point ends up opposite. |
| `multi.ok` | Три записи из пяти. Прибавлять и отнимать можно только целое число оборотов. | Beshtadan uchtasi. Faqat butun sondagi aylanani qo'shish va ayirish mumkin. | Three out of five. Only a whole number of turns may be added or subtracted. |
| `audio.mount` | Теперь обратная задача. Точка одна, а записей для неё много. | Endi teskari masala. Nuqta bitta, unga yozuv esa ko'p. | Now the inverse task. There is one point, but many readings for it. |
| `audio.work` | Поставь точку, потом отметишь все записи, которые ведут сюда же. | Nuqtani qo'ying, keyin shu yerga olib keladigan hamma yozuvni belgilaysiz. | Place the point, then you will mark every reading that leads here. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `30°` |
| `place.step` | `30°  +  360°k` |
| `multi.a` [верно] | `390°` |
| `multi.b` [верно] | `−330°` |
| `multi.c` [верно] | `750°` |
| `multi.d` | `−30°` |
| `multi.e` | `210°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `sinus-chetnyy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Чему равен sin(−30°)? | sin(−30°) qancha? | What is sin(−30°)? |
| `q1.a` [верно] | минус одна вторая | minus bir ikkidan | minus one half |
| `q1.b` | одна вторая | bir ikkidan | one half |
| `q1.b.hint` | Зеркало переворачивает высоту, значит знак меняется. | Ko'zgu balandlikni ag'daradi, demak ishora almashadi. | The mirror flips the height, so the sign changes. |
| `q1.c` | корень из трёх на два | uch ildizining yarmi | root three over two |
| `q1.c.hint` | Это высота шестидесяти градусов, а не тридцати. | Bu oltmish gradusning balandligi, o'ttizniki emas. | That is the height at sixty degrees, not thirty. |
| `q1.d` | ноль | nol | zero |
| `q1.d.hint` | Ноль бывает только на оси, а тридцать градусов не на оси. | Nol faqat o'qda bo'ladi, o'ttiz gradus esa o'qda emas. | Zero happens only on the axis, and thirty degrees is not on the axis. |
| `q2.prompt` | Чему равен cos(−60°)? | cos(−60°) qancha? | What is cos(−60°)? |
| `q2.a` [верно] | одна вторая | bir ikkidan | one half |
| `q2.b` | минус одна вторая | minus bir ikkidan | minus one half |
| `q2.b.hint` | Косинус чётный: зеркало не трогает сдвиг. | Kosinus juft: ko'zgu siljishga tegmaydi. | The cosine is even: the mirror does not touch the shift. |
| `q2.c` | корень из трёх на два | uch ildizining yarmi | root three over two |
| `q2.c.hint` | Это сдвиг тридцати градусов, а не шестидесяти. | Bu o'ttiz gradusning siljishi, oltmishniki emas. | That is the shift at thirty degrees, not sixty. |
| `q2.d` | минус один | minus bir | minus one |
| `q2.d.hint` | Минус один бывает только у левой точки, у ста восьмидесяти. | Minus bir faqat chap nuqtada, yuz saksonda bo'ladi. | Minus one happens only at the left point, at one hundred eighty. |
| `q3.prompt` | Что можно прибавить к углу, не сдвинув точку? | Nuqtani qimirlatmasdan burchakka nimani qo'shish mumkin? | What can be added to the angle without moving the point? |
| `q3.a` [верно] | целое число оборотов | butun sondagi aylana | a whole number of turns |
| `q3.a.ok` | Да. Половина оборота уже уводит точку напротив. | Ha. Yarim aylana esa nuqtani qarshi tomonga olib ketadi. | Yes. Half a turn already sends the point to the opposite side. |
| `q3.b` | любое число градусов | har qanday gradus soni | any number of degrees |
| `q3.b.hint` | Тогда точка сдвинулась бы, а нам нужна та же самая. | Unda nuqta qimirlagan bo'lardi, bizga esa aynan o'sha kerak. | Then the point would move, and we need the very same one. |
| `q4.prompt` | Через сколько градусов повторяется тангенс? | Tangens necha gradusdan keyin takrorlanadi? | After how many degrees does the tangent repeat? |
| `q4.a` [верно] | сто восемьдесят | yuz sakson | one hundred eighty |
| `q4.b` | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q4.b.hint` | Через триста шестьдесят повторяются синус и косинус, а тангенс раньше. | Uch yuz oltmishdan keyin sinus va kosinus takrorlanadi, tangens esa ertaroq. | After three hundred sixty the sine and cosine repeat, the tangent sooner. |
| `q4.c` | девяносто | to'qson | ninety |
| `q4.c.hint` | Через девяносто градусов отношение меняется, а не повторяется. | To'qson gradusdan keyin nisbat o'zgaradi, takrorlanmaydi. | After ninety degrees the ratio changes, it does not repeat. |
| `q4.d` | не повторяется | takrorlanmaydi | it does not repeat |
| `q4.d.hint` | Повторяется: половина оборота меняет оба знака, а отношение оставляет прежним. | Takrorlanadi: yarim aylana ikkala ishorani almashtiradi, nisbatni esa o'sha holda qoldiradi. | It does repeat: half a turn flips both signs and leaves the ratio as it was. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `sin(−30°) = −1/2` |
| `q2.done` | `cos(−60°) = 1/2` |
| `q3.done` | `α + 360°k` |
| `q4.done` | `tg(α + 180°) = tg α` |
| `angles` | `−30°` · `−60°` · `30°` · `210°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Откладываю угол в обе стороны | Burchakni ikki tomonga ham qo'yaman | I lay an angle both ways |
| `can.2` | Знаю, что косинус чётный, а синус нечётный | Kosinus juft, sinus toq ekanini bilaman | I know the cosine is even and the sine odd |
| `can.3` | Отбрасываю целые обороты | Butun aylanalarni tashlab yuboraman | I drop whole turns |
| `can.4` | Помню, что у тангенса период короче | Tangensning davri qisqaroq ekanini eslayman | I remember the tangent has a shorter period |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: у какой функции знак меняется. | Bitta joy takrorlashni talab qiladi: qaysi funksiyada ishora almashadi. | One place needs review: which function changes sign. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Урок 6: та же точка, но её высота записывается во времени — и получается график. | 6-dars: o'sha nuqta, lekin uning balandligi vaqt bo'ylab yoziladi, va grafik chiqadi. | Lesson 6: the same point, but its height written along time, and that gives the graph. |
| `lifehack` | Зеркало трогает только высоту. Сдвиг оно не трогает никогда. | Ko'zgu faqat balandlikka tegadi. Siljishga esa hech qachon tegmaydi. | The mirror touches only the height. It never touches the shift. |
| `sheetTitle` | Чётность и период · шпаргалка | Juftlik va davr · shpargalka | Parity and period · cheat sheet |
| `sheetSrc` | 10 класс · урок 5 | 10-sinf · 5-dars | Grade 10 · lesson 5 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Синус минус тридцати равен минус одной второй, и это видно по зеркалу, а не по памяти. | Minus o'ttizning sinusi minus bir ikkidan, va bu ko'zgudan ko'rinadi, yoddan emas. | The sine of minus thirty is minus one half, and that shows in the mirror, not in memory. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `sin(−30°) = 1/2` |
| `hook.b` | `sin(−30°) = −1/2` |
| `proved` | `sin(−30°) = −1/2` |
| `law` | `cos(−x) = cos x,   sin(−x) = −sin x` |
| `sheet.1` | `cos(−x) = cos x` |
| `sheet.2` | `sin(−x) = −sin x,   tg(−x) = −tg x` |
| `sheet.3` | `sin(x + 360°k) = sin x` |
| `sheet.4` | `tg(x + 180°) = tg x` |
| `sheet.5` | `T = 2π   ·   tg: T = π` |
