# Урок 8 — Аркфункции · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS06_KONTENT.md`: на экран две
таблицы — «Текст» (ключ, RU, UZ, EN) и «Формулы» (ключ, значение). Звёздочка после имени реплики
означает, что во время неё на экране движется.

Скелет: `DARS07_10_SKELET.md` §6. Опора в учебнике: алгебра 2022, стр. 139 («y = arcsinx funksiya
y = sinx funksiyaga teskari funksiya bo'ladi»).

**Что этот урок вводит первым в классе:** «обратная функция» и «окно однозначности». Уравнений
здесь ещё нет ни одного — они начинаются уроком 9.

**Главное решение урока.** Горизонталь даёт **две** точки, и обе настоящие. Арксинус не
«выбирает правильную», а берёт ответ из закреплённого окна: иначе обратное действие давало бы
не число, а список. Поэтому вторая точка на экране не гаснет, а тускнеет — она есть, просто в
ответ не идёт.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

Обе записи выглядят разумно: у второй за спиной честная вторая точка. Прогноз до объяснения.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | АРКСИНУС | ARKSINUS | ARCSINE |
| `title` | Сколько ответов у арксинуса? | Arksinusning nechta javobi bor? | How many answers does the arcsine have? |
| `row.a.name` | ответ один | javob bitta | one answer |
| `row.b.name` | ответов два | javob ikkita | two answers |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` [верно] | первая | birinchi | the first |
| `probe.b` | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас опустим прямую и посмотрим. | Javobingiz yozib olindi. Endi to'g'ri chiziqni tushirib ko'ramiz. | Your answer is saved. Now we will drop the line and see. |
| `audio.mount*` | Прямая опускается на высоту одна вторая и задевает окружность в двух местах. | To'g'ri chiziq bir ikkidan balandlikka tushadi va aylanani ikki joyda kesadi. | The line drops to the height one half and meets the circle in two places. |
| `audio.r1` | Первая запись говорит, что ответ один. | Birinchi yozuv javob bitta deydi. | The first reading says there is one answer. |
| `audio.r2` | Вторая говорит, что их два, и точки на экране за неё. | Ikkinchisi ikkita deydi, va ekrandagi nuqtalar uning tomonida. | The second says there are two, and the points on the screen back it. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `arcsin 1/2 = ?` |
| `row.a.value` | `arcsin 1/2 = 30°` |
| `row.b.value` | `arcsin 1/2 = 30°,  150°` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед обратной задачей | Teskari masaladan oldin uch savol | Three questions before the inverse task |
| `q1.prompt` | Какая координата точки называется синусом? | Nuqtaning qaysi koordinatasi sinus deyiladi? | Which coordinate of the point is the sine? |
| `q1.a` [верно] | высота, второе число | balandlik, ikkinchi son | the height, the second number |
| `q1.b` | сдвиг, первое число | siljish, birinchi son | the shift, the first number |
| `q1.b.hint` | Сдвиг это косинус, он идёт первым. | Siljish bu kosinus, u birinchi turadi. | The shift is the cosine, it comes first. |
| `q1.c` | радиус | radius | the radius |
| `q1.c.hint` | Радиус всегда равен единице и координатой не является. | Radius doim birga teng va koordinata emas. | The radius is always one and is not a coordinate. |
| `q1.d` | сам угол | burchakning o'zi | the angle itself |
| `q1.d.hint` | Угол задаёт точку, а синус это её координата. | Burchak nuqtani beradi, sinus esa uning koordinatasi. | The angle fixes the point, the sine is its coordinate. |
| `q2.prompt` | Что делает обратное действие? | Teskari amal nima qiladi? | What does an inverse action do? |
| `q2.a` [верно] | по результату находит то, из чего он получен | natijadan uni bergan narsani topadi | it finds what the result came from |
| `q2.b` | повторяет действие ещё раз | amalni yana bir marta takrorlaydi | it repeats the action once more |
| `q2.b.hint` | Повтор ничего не возвращает назад, а обратное действие возвращает. | Takror hech narsani qaytarmaydi, teskari amal esa qaytaradi. | Repeating returns nothing, an inverse action does. |
| `q2.c` | меняет знак | ishorani almashtiradi | it flips the sign |
| `q2.c.hint` | Знак меняет зеркало, это был прошлый урок. | Ishorani ko'zgu almashtiradi, bu o'tgan darsda edi. | The mirror flips the sign, that was the previous lesson. |
| `q2.d` | увеличивает в два раза | ikki barobar orttiradi | it doubles |
| `q2.d.hint` | Обратное действие связано не с размером, а с направлением счёта. | Teskari amal o'lchamga emas, sanoq yo'nalishiga bog'liq. | An inverse action is about direction, not about size. |
| `q3.prompt` | Какие значения принимает синус? | Sinus qanday qiymatlarni oladi? | Which values does the sine take? |
| `q3.a` [верно] | от минус единицы до единицы | minus birdan birgacha | from minus one to one |
| `q3.b` | любые | har qanday | any values |
| `q3.b.hint` | Точка лежит на окружности радиуса один и дальше не уходит. | Nuqta radiusi bir bo'lgan aylanada yotadi va uzoqroqqa ketmaydi. | The point lies on the circle of radius one and goes no further. |
| `q3.c` | только положительные | faqat musbat | only positive ones |
| `q3.c.hint` | Ниже оси высота отрицательна, это было на четвёртом уроке. | O'qdan pastda balandlik manfiy, bu to'rtinchi darsda edi. | Below the axis the height is negative, that was in lesson four. |
| `q3.d` | от нуля до единицы | noldan birgacha | from zero to one |
| `q3.d.hint` | Нижняя половина окружности даёт отрицательные значения. | Aylananing pastki yarmi manfiy qiymatlar beradi. | The lower half of the circle gives negative values. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `y = sin α` |
| `q2.done` | `sin α = a   →   α = ?` |
| `q3.done` | `−1 ≤ sin α ≤ 1` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `odin-koren`

Свидетель урока. Прямая опускается и остаётся на экране, обе точки горят одновременно.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Прямая задевает круг дважды | To'g'ri chiziq aylanani ikki marta kesadi | The line meets the circle twice |
| `show.1.1` | высота одна вторая | balandlik bir ikkidan | the height is one half |
| `show.1.2` | прямая идёт вниз | to'g'ri chiziq pastga tushadi | the line comes down |
| `show.2.1` | точек стало две | nuqta ikkita bo'ldi | there are two points now |
| `show.2.2` | обе высотой одна вторая | ikkalasining balandligi bir ikkidan | both at height one half |
| `audio.mount` | Сверху прямая. Её высота одна вторая. | Yuqorida to'g'ri chiziq. Uning balandligi bir ikkidan. | A line at the top. Its height is one half. |
| `audio.drop*` | Прямая села на место и задела окружность в двух точках. Обе высотой одна вторая, обе настоящие. Тридцать градусов и сто пятьдесят. | To'g'ri chiziq joyiga tushdi va aylanani ikki nuqtada kesdi. Ikkalasining balandligi bir ikkidan, ikkalasi ham haqiqiy. O'ttiz gradus va yuz ellik. | The line settled and met the circle at two points. Both at height one half, both real. Thirty degrees and one hundred fifty. |
| `audio.work` | Теперь сам. Поставь точку во вторую из них, ту, что слева. | Endi o'zingiz. Ulardan ikkinchisiga, chapdagisiga nuqta qo'ying. | Now you. Place the point at the second of them, the one on the left. |
| `work.prompt` | Поставь точку туда, где высота тоже равна одной второй, но точка слева. | Balandligi ham bir ikkidan, lekin chapda turgan joyga nuqta qo'ying. | Place the point where the height is also one half but the point is on the left. |
| `work.ok` | Сто пятьдесят градусов. Высота та же, а точка другая: одному числу отвечают два угла. | Yuz ellik gradus. Balandlik o'sha, nuqta esa boshqa: bitta songa ikkita burchak mos keladi. | One hundred fifty degrees. The same height, a different point: one number matches two angles. |
| `work.hint.1` | Нужна точка на той же высоте, но по другую сторону от вертикальной оси. | O'sha balandlikdagi, lekin vertikal o'qning boshqa tomonidagi nuqta kerak. | You need a point at the same height on the other side of the vertical axis. |
| `work.hint.2` | Слева от вертикальной оси сдвиг отрицательный, а высота остаётся положительной. | Vertikal o'qdan chapda siljish manfiy, balandlik esa musbat qoladi. | Left of the vertical axis the shift is negative and the height stays positive. |
| `work.hint.3` | Сто пятьдесят градусов. | Yuz ellik gradus. | One hundred fifty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 4 · `explain2` · ответ `lead` · тег `arcsin-bez-promezhutka`

Окно. Внутри него точка одна — и это не «правило», а способ получить число вместо списка.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Окно, где точка одна | Nuqta bitta bo'ladigan oyna | The window where the point is alone |
| `show.1.1` | закрашена правая половина | o'ng yarmi bo'yaldi | the right half is painted |
| `show.1.2` | от минус девяноста до девяноста | minus to'qsondan to'qsongacha | from minus ninety to ninety |
| `show.2.1` | в окне точка одна | oynada nuqta bitta | inside the window the point is alone |
| `show.2.2` | вторая осталась, но не в ответе | ikkinchisi qoldi, lekin javobda emas | the second stayed but is not the answer |
| `audio.mount` | Две точки это неудобно: обратное действие обязано давать одно число. | Ikkita nuqta noqulay: teskari amal bitta son berishi shart. | Two points are awkward: an inverse action must give one number. |
| `audio.win*` | Поэтому договорились: берём только правую половину окружности, от минус девяноста до девяноста. В этом окне точка с такой высотой ровно одна. Вторая никуда не делась, она просто не идёт в ответ. | Shuning uchun kelishildi: aylananing faqat o'ng yarmini, minus to'qsondan to'qsongacha olamiz. Bu oynada shunday balandlikdagi nuqta aynan bitta. Ikkinchisi yo'qolgani yo'q, u shunchaki javobga kirmaydi. | So it was agreed: we take only the right half of the circle, from minus ninety to ninety. In that window there is exactly one point with such a height. The second one is still there, it just does not go into the answer. |
| `audio.work` | Теперь сам. Поставь точку в ту, что попала в окно. | Endi o'zingiz. Oynaga tushganiga nuqta qo'ying. | Now you. Place the point at the one inside the window. |
| `work.prompt` | Поставь точку в ту, что лежит в окне. | Oynada yotganiga nuqta qo'ying. | Place the point at the one lying inside the window. |
| `work.ok` | Тридцать градусов. Оно в окне, поэтому его и берут ответом. | O'ttiz gradus. U oynada, shuning uchun javob sifatida olinadi. | Thirty degrees. It is inside the window, and that is why it is taken as the answer. |
| `work.hint.1` | Окно это правая половина окружности. | Oyna bu aylananing o'ng yarmi. | The window is the right half of the circle. |
| `work.hint.2` | Слева точка тоже есть, но она вне окна. | Chapda ham nuqta bor, lekin u oynadan tashqarida. | There is a point on the left too, but it is outside the window. |
| `work.hint.3` | Тридцать градусов. | O'ttiz gradus. | Thirty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 5 · `explain3` · ответ `number` · тег `arcsin-bez-promezhutka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Арксинус это угол из окна | Arksinus bu oynadagi burchak | The arcsine is the angle from the window |
| `show.1.1` | высота дана | balandlik berilgan | the height is given |
| `show.1.2` | угол ищется в окне | burchak oynada qidiriladi | the angle is looked for in the window |
| `show.2.1` | точка в окне подсвечена | oynadagi nuqta yoritilgan | the point in the window is lit |
| `show.2.2` | вторая потускнела, но осталась | ikkinchisi so'ndi, lekin qoldi | the other faded but stayed |
| `audio.mount` | Запись арксинус одна вторая читается так: угол из окна, у которого высота равна одной второй. | Arksinus bir ikkidan yozuvi shunday o'qiladi: balandligi bir ikkidan bo'lgan, oynadagi burchak. | The reading arcsine of one half means: the angle from the window whose height is one half. |
| `audio.pick*` | Точка в окне подсвечена, вторая потускнела. Ответ читается с подсвеченной. | Oynadagi nuqta yoritilgan, ikkinchisi so'ndi. Javob yoritilganidan o'qiladi. | The point inside the window is lit, the other one has faded. The answer is read off the lit one. |
| `audio.work` | Посчитай сам. Чему равен арксинус одной второй в градусах? | O'zingiz hisoblang. Bir ikkidanning arksinusi gradusda qancha? | Compute it yourself. What is the arcsine of one half in degrees? |
| `work.prompt` | Чему равен arcsin 1/2 в градусах? | arcsin 1/2 gradusda qancha? | What is arcsin 1/2 in degrees? |
| `work.ok` | Тридцать. Это тот самый угол из окна, у которого высота равна одной второй. | O'ttiz. Bu oynadagi, balandligi bir ikkidan bo'lgan o'sha burchak. | Thirty. That is the very angle from the window whose height is one half. |
| `work.hint.1` | Ищи угол, у которого высота равна одной второй. | Balandligi bir ikkidan bo'lgan burchakni qidiring. | Look for the angle whose height is one half. |
| `work.hint.2` | Из двух таких углов бери тот, что в окне, то есть справа. | Shunday ikki burchakdan oynadagisini, ya'ni o'ngdagisini oling. | Of the two such angles take the one in the window, that is on the right. |
| `work.hint.3` | Тридцать. | O'ttiz. | Thirty. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `30` |

---

## Экран 6 · `explain4` · ответ `lead` · тег `arcsin-bez-promezhutka`

У арккосинуса окно другое, и прямая другая: не горизонталь, а вертикаль. С горизонталью окно
`0…180` не разделило бы точки — у обеих одинаковая высота.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | У арккосинуса своё окно | Arkkosinusning o'z oynasi bor | The arccosine has its own window |
| `show.1.1` | косинус это сдвиг | kosinus bu siljish | the cosine is the shift |
| `show.1.2` | прямая теперь вертикальная | to'g'ri chiziq endi vertikal | the line is vertical now |
| `show.2.1` | окно от нуля до ста восьмидесяти | oyna noldan yuz saksongacha | the window from zero to one hundred eighty |
| `show.2.2` | в нём снова одна точка | unda yana bitta nuqta | one point again inside it |
| `audio.mount` | У косинуса задан сдвиг, а не высота, поэтому прямая идёт вертикально. Она тоже задевает окружность дважды. | Kosinusda balandlik emas, siljish berilgan, shuning uchun to'g'ri chiziq vertikal ketadi. U ham aylanani ikki marta kesadi. | For the cosine the shift is given, not the height, so the line runs vertically. It also meets the circle twice. |
| `audio.win*` | Окно арккосинуса это верхняя половина, от нуля до ста восьмидесяти. Верхняя точка в нём, нижняя нет. | Arkkosinusning oynasi bu yuqori yarim, noldan yuz saksongacha. Yuqoridagi nuqta unda, pastdagisi yo'q. | The arccosine window is the upper half, from zero to one hundred eighty. The upper point is in it, the lower one is not. |
| `audio.work` | Теперь сам. Поставь точку в ту, что попала в окно арккосинуса. | Endi o'zingiz. Arkkosinus oynasiga tushgan nuqtaga qo'ying. | Now you. Place the point at the one inside the arccosine window. |
| `work.prompt` | Поставь точку в ту, что лежит в окне арккосинуса. | Arkkosinus oynasida yotgan nuqtaga qo'ying. | Place the point at the one inside the arccosine window. |
| `work.ok` | Шестьдесят градусов. Сдвиг равен одной второй, и точка сверху, значит она в окне. | Oltmish gradus. Siljish bir ikkidan, nuqta yuqorida, demak u oynada. | Sixty degrees. The shift is one half and the point is on top, so it is in the window. |
| `work.hint.1` | Окно арккосинуса это верхняя половина окружности. | Arkkosinusning oynasi bu aylananing yuqori yarmi. | The arccosine window is the upper half of the circle. |
| `work.hint.2` | Нижняя точка имеет тот же сдвиг, но в окно не попадает. | Pastki nuqtaning siljishi o'sha, lekin u oynaga tushmaydi. | The lower point has the same shift but is not inside the window. |
| `work.hint.3` | Шестьдесят градусов. | Oltmish gradus. | Sixty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 7 · `explain5` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Прямая может пройти мимо | To'g'ri chiziq yonidan o'tib ketishi mumkin | The line can miss the circle |
| `show.1.1` | высота два | balandlik ikki | the height is two |
| `show.1.2` | прямая выше окружности | to'g'ri chiziq aylanadan yuqorida | the line is above the circle |
| `show.2.1` | точек пересечения нет | kesishish nuqtasi yo'q | there are no intersection points |
| `show.2.2` | значит нет и угла | demak burchak ham yo'q | so there is no angle either |
| `audio.mount` | Возьмём высоту два. Прямая стоит выше окружности. | Balandlik ikkini olaylik. To'g'ri chiziq aylanadan yuqorida turadi. | Take the height two. The line stands above the circle. |
| `audio.miss*` | Она прошла мимо и не задела круг ни разу. Точки нет, значит нет и угла с такой высотой. Арксинус двух не существует. | U yonidan o'tdi va aylanaga bir marta ham tegmadi. Nuqta yo'q, demak shunday balandlikdagi burchak ham yo'q. Ikkining arksinusi mavjud emas. | It passed by and never touched the circle. There is no point, so there is no angle with such a height. The arcsine of two does not exist. |
| `audio.work` | Посчитай сам. Сколько углов даёт арксинус двух? | O'zingiz hisoblang. Ikkining arksinusi nechta burchak beradi? | Compute it yourself. How many angles does the arcsine of two give? |
| `work.prompt` | Сколько углов даёт arcsin 2? | arcsin 2 nechta burchak beradi? | How many angles does arcsin 2 give? |
| `work.ok` | Ноль. Высота больше единицы на окружности не встречается, поэтому арксинус двух не определён. | Nol. Birdan katta balandlik aylanada uchramaydi, shuning uchun ikkining arksinusi aniqlanmagan. | Zero. A height above one never occurs on the circle, so the arcsine of two is undefined. |
| `work.hint.1` | Посмотри, задела ли прямая окружность. | To'g'ri chiziq aylanaga tegdimi, qarang. | Look whether the line touched the circle. |
| `work.hint.2` | Она прошла выше, значит общих точек нет. | U yuqoridan o'tdi, demak umumiy nuqta yo'q. | It passed above, so there are no common points. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `arcsin-bez-promezhutka`

Чек различения, потом карточка. Определение дано словами учебника (стр. 139).

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Арксинус и арккосинус | Arksinus va arkkosinus | Arcsine and arccosine |
| `probe.question` | Почему у арксинуса ответ один? | Nega arksinusning javobi bitta? | Why does the arcsine have one answer? |
| `probe.a` [верно] | ответ берут из окна | javob oynadan olinadi | the answer is taken from the window |
| `probe.b` | вторая точка не является решением | ikkinchi nuqta yechim emas | the second point is not a solution |
| `probe.b.hint` | Вторая точка настоящая, у неё та же высота. Просто в ответ арксинуса она не идёт. | Ikkinchi nuqta haqiqiy, balandligi o'sha. Shunchaki arksinus javobiga kirmaydi. | The second point is real and has the same height. It just does not go into the arcsine answer. |
| `rule.lawLabel` | Окна | Oynalar | The windows |
| `rule.lines.1` | `y = arcsin x` — функция, обратная `y = sin x`: она возвращает угол по его высоте. | `y = arcsin x` — `y = sin x` ga teskari funksiya: u balandlikdan burchakni qaytaradi. | `y = arcsin x` is the inverse of `y = sin x`: it returns the angle from its height. |
| `rule.lines.2` | Ответ берут из окна, поэтому он один, а не список. | Javob oynadan olinadi, shuning uchun u ro'yxat emas, bitta. | The answer is taken from the window, so it is one number, not a list. |
| `rule.lines.3` | Арксинус и арккосинус определены только при `−1 ≤ x ≤ 1`. | Arksinus va arkkosinus faqat `−1 ≤ x ≤ 1` da aniqlangan. | The arcsine and arccosine are defined only for `−1 ≤ x ≤ 1`. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Окно закрашивается ещё раз, и правило открывается рядом. Обратная функция даёт число, а не список, ровно потому, что окно закреплено договором. | Oyna yana bir bor bo'yaladi, va qoida yonida ochiladi. Teskari funksiya ro'yxat emas, son berishi aynan oyna kelishuv bilan qotirilganidan. | The window is painted once more, and the rule opens beside it. The inverse function gives a number, not a list, exactly because the window is fixed by agreement. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `arcsin x ∈ [−90°; 90°],   arccos x ∈ [0°; 180°]` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `arcsin-bez-promezhutka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Четыре записи, четыре угла | To'rt yozuv, to'rt burchak | Four readings, four angles |
| `match.prompt` | Соедини каждую запись с её углом. | Har yozuvni o'z burchagi bilan birlashtiring. | Match each reading with its angle. |
| `match.ok` | У арксинуса знак уводит вниз, а у арккосинуса влево. Окна разные, поэтому и ответы разные. | Arksinusda ishora pastga, arkkosinusda chapga olib boradi. Oynalar boshqa, javoblar ham boshqa. | The sign sends the arcsine down and the arccosine left. The windows differ, so the answers differ. |
| `audio.mount` | Четыре записи и четыре угла. Соедини их. | To'rt yozuv va to'rt burchak. Ularni birlashtiring. | Four readings and four angles. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `arcsin 1/2` · `arcsin(−1/2)` · `arccos 1/2` · `arccos(−1/2)` |
| `match.a` | `30°` |
| `match.b` | `−30°` |
| `match.c` | `60°` |
| `match.d` | `120°` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `arcsin-bez-promezhutka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Посчитай арксинус по шагам | Arksinusni qadam bilan hisoblang | Compute an arcsine step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | высота равна минус одной второй | balandlik minus bir ikkidan | the height is minus one half |
| `order.s2` | отмечаем обе точки | ikkala nuqtani belgilaymiz | we mark both points |
| `order.s3` | берём ту, что в окне | oynadagisini olamiz | we take the one in the window |
| `order.s4` | ответ минус тридцать | javob minus o'ttiz | the answer is minus thirty |
| `order.ok` | Порядок такой всегда: сначала обе точки, потом окно. Если начать с окна, вторая точка исчезнет незамеченной. | Tartib doim shunday: avval ikkala nuqta, keyin oyna. Oynadan boshlansa, ikkinchi nuqta sezilmay yo'qoladi. | The order is always this: both points first, then the window. Starting with the window makes the second point vanish unnoticed. |
| `order.bad` | Сначала находим обе точки, потом выбираем ту, что в окне, и только потом пишем ответ. | Avval ikkala nuqtani topamiz, keyin oynadagisini tanlaymiz, keyingina javobni yozamiz. | First we find both points, then choose the one in the window, and only then write the answer. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `−30°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Сто двадцать. Сдвиг минус одна вторая бывает слева, а окно арккосинуса как раз верхняя половина. | Yuz yigirma. Minus bir ikkidan siljish chapda bo'ladi, arkkosinus oynasi esa aynan yuqori yarim. | One hundred twenty. The shift minus one half happens on the left, and the arccosine window is the upper half. |
| `task.hint.1` | Сдвиг отрицательный, значит точка слева. | Siljish manfiy, demak nuqta chapda. | The shift is negative, so the point is on the left. |
| `task.hint.2` | Из двух левых точек бери верхнюю: окно арккосинуса сверху. | Ikki chap nuqtadan yuqoridagisini oling: arkkosinus oynasi tepada. | Of the two left points take the upper one: the arccosine window is on top. |
| `task.hint.3` | Сто двадцать. | Yuz yigirma. | One hundred twenty. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой угол меньше? | Qaysi burchak kichikroq? | Which angle is smaller? |
| `order.ok` | Ты сравнил углы, а не записи: арксинус даёт от минус девяноста до девяноста, арккосинус от нуля до ста восьмидесяти. | Siz yozuvlarni emas, burchaklarni solishtirdingiz: arksinus minus to'qsondan to'qsongacha, arkkosinus noldan yuz saksongacha beradi. | You compared angles, not readings: the arcsine gives from minus ninety to ninety, the arccosine from zero to one hundred eighty. |
| `order.bad` | Сначала переведи каждую запись в градусы, потом сравнивай. | Avval har yozuvni gradusga o'tkazing, keyin solishtiring. | First turn each reading into degrees, then compare. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `arccos(−1/2)  =  ?` |
| `task.answer` | `120` |
| `order.items` | `arcsin(−1/2)` · `arcsin 0` · `arcsin 1/2` · `arccos 0` |
| `order.answer` | `arcsin(−1/2)  arcsin 0  arcsin 1/2  arccos 0` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

Первая строка верна: у двухсот десяти высота действительно минус одна вторая. Вторая строка
делает из этого арксинус — и промахивается мимо окна.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob noto'g'ri. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка верна: у двухсот десяти высота действительно минус одна вторая. | Bu qator to'g'ri: ikki yuz o'nning balandligi haqiqatan minus bir ikkidan. | This line is right: at two hundred ten the height really is minus one half. |
| `hint.r3` | Это просто сравнение чисел, и оно верное. | Bu shunchaki sonlarni solishtirish, va u to'g'ri. | This is just a comparison of numbers, and it is right. |
| `hint.r4` | Эта строка выросла из неверной. Первая неверная строка выше. | Bu qator xato qatordan o'sib chiqqan. Birinchi xato qator yuqorida. | This line grew out of a wrong one. The first wrong line is above. |
| `proof` | Двести десять в окно не попадает. | Ikki yuz o'n oynaga tushmaydi. | Two hundred ten is not inside the window. |
| `entry.prompt` | Чему равен arcsin(−1/2)? | arcsin(−1/2) qancha? | What is arcsin(−1/2)? |
| `entry.ok` | Минус тридцать. Точек с такой высотой две, но в окно попадает только эта. | Minus o'ttiz. Shunday balandlikdagi nuqta ikkita, lekin oynaga faqat shu tushadi. | Minus thirty. There are two points with such a height, but only this one falls inside the window. |
| `entry.hint.1` | Высота минус одна вторая бывает у двух углов. | Minus bir ikkidan balandlik ikki burchakda bo'ladi. | The height minus one half happens at two angles. |
| `entry.hint.2` | Из них в окно от минус девяноста до девяноста попадает один. | Ulardan minus to'qsondan to'qsongacha oynaga bittasi tushadi. | Of them one falls into the window from minus ninety to ninety. |
| `entry.hint.3` | Минус тридцать. | Minus o'ttiz. | Minus thirty. |
| `audio.mount` | Задача. Найти арксинус минус одной второй. | Masala. Minus bir ikkidanning arksinusini topish. | A task. Find the arcsine of minus one half. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `sin 210° = −1/2` |
| `row.r2` | `arcsin(−1/2) = 210°` |
| `row.r3` | `210° > 90°` |
| `row.r4` | `arcsin(−1/2) > 90°` |
| `answerId` | `r2` |
| `entry.answer` | `−30` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

Обратная задача: не «чему равен арксинус», а «может ли этот угол вообще быть ответом
арксинуса». Окно проверяется, а не пересказывается.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Какой угол может быть ответом | Qaysi burchak javob bo'la oladi | Which angle can be an answer |
| `place.prompt` | Поставь точку на 150 градусов. | Nuqtani 150 gradusga qo'ying. | Place the point at 150 degrees. |
| `place.ok` | Высота здесь одна вторая, как и у тридцати. Но ответом арксинуса это число не станет. | Bu yerda balandlik bir ikkidan, o'ttizdagidek. Lekin bu son arksinus javobi bo'lmaydi. | The height here is one half, as at thirty. But this number will not be an arcsine answer. |
| `place.wrong` | Сто пятьдесят это выше горизонтальной оси и левее вертикальной. | Yuz ellik gorizontal o'qdan yuqorida va vertikal o'qdan chapda. | One hundred fifty is above the horizontal axis and left of the vertical one. |
| `multi.prompt` | Отметь все углы, которые могут быть ответом арксинуса. | Arksinus javobi bo'la oladigan hamma burchakni belgilang. | Mark every angle that can be an arcsine answer. |
| `multi.title` | Какие углы могут быть ответом арксинуса? | Qaysi burchaklar arksinus javobi bo'la oladi? | Which angles can be an arcsine answer? |
| `multi.d.hint` | Сто пятьдесят вне окна: оно больше девяноста. | Yuz ellik oynadan tashqarida: u to'qsondan katta. | One hundred fifty is outside the window: it is more than ninety. |
| `multi.e.hint` | Двести это тоже больше девяноста, значит вне окна. | Ikki yuz ham to'qsondan katta, demak oynadan tashqarida. | Two hundred is also more than ninety, so it is outside the window. |
| `multi.ok` | Три из пяти. Ответ арксинуса всегда лежит между минус девяноста и девяноста, какое бы число ни дали. | Beshtadan uchtasi. Qanday son berilmasin, arksinus javobi doim minus to'qson bilan to'qson orasida yotadi. | Three out of five. Whatever number is given, the arcsine answer always lies between minus ninety and ninety. |
| `audio.mount` | Теперь обратная задача. Дан угол, а спрашивается, годится ли он в ответ. | Endi teskari masala. Burchak berilgan, savol esa u javobga yaraydimi. | Now the inverse task. An angle is given, and the question is whether it fits as an answer. |
| `audio.work` | Поставь точку, потом отметишь все углы, которые годятся. | Nuqtani qo'ying, keyin yaraydigan hamma burchakni belgilaysiz. | Place the point, then you will mark every angle that fits. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `150°` |
| `place.step` | `sin 150° = 1/2` |
| `multi.a` [верно] | `30°` |
| `multi.b` [верно] | `−30°` |
| `multi.c` [верно] | `90°` |
| `multi.d` | `150°` |
| `multi.e` | `200°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `arcsin-bez-promezhutka`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Чему равен arcsin 1/2? | arcsin 1/2 qancha? | What is arcsin 1/2? |
| `q1.a` [верно] | тридцать градусов | o'ttiz gradus | thirty degrees |
| `q1.b` | сто пятьдесят градусов | yuz ellik gradus | one hundred fifty degrees |
| `q1.b.hint` | Высота там та же, но сто пятьдесят вне окна. | U yerda balandlik o'sha, lekin yuz ellik oynadan tashqarida. | The height there is the same, but one hundred fifty is outside the window. |
| `q1.c` | минус тридцать градусов | minus o'ttiz gradus | minus thirty degrees |
| `q1.c.hint` | Это ответ для минус одной второй, там высота уходит вниз. | Bu minus bir ikkidanning javobi, u yerda balandlik pastga ketadi. | That is the answer for minus one half, where the height goes down. |
| `q1.d` | шестьдесят градусов | oltmish gradus | sixty degrees |
| `q1.d.hint` | У шестидесяти высота больше, это корень из трёх на два. | Oltmishning balandligi kattaroq, u uch ildizining yarmi. | At sixty the height is larger, it is root three over two. |
| `q2.prompt` | Чему равен arccos 0? | arccos 0 qancha? | What is arccos 0? |
| `q2.a` [верно] | девяносто градусов | to'qson gradus | ninety degrees |
| `q2.b` | ноль градусов | nol gradus | zero degrees |
| `q2.b.hint` | При нуле градусов сдвиг равен единице, а не нулю. | Nol gradusda siljish birga teng, nolga emas. | At zero degrees the shift equals one, not zero. |
| `q2.c` | сто восемьдесят градусов | yuz sakson gradus | one hundred eighty degrees |
| `q2.c.hint` | Там сдвиг равен минус единице. | U yerda siljish minus birga teng. | There the shift equals minus one. |
| `q2.d` | минус девяносто градусов | minus to'qson gradus | minus ninety degrees |
| `q2.d.hint` | Сдвиг там тоже ноль, но окно арккосинуса начинается с нуля. | U yerda ham siljish nol, lekin arkkosinus oynasi noldan boshlanadi. | The shift there is zero too, but the arccosine window starts at zero. |
| `q3.prompt` | Почему у арксинуса ответ один? | Nega arksinusning javobi bitta? | Why does the arcsine have one answer? |
| `q3.a` [верно] | ответ берут из окна | javob oynadan olinadi | the answer is taken from the window |
| `q3.a.ok` | Да. Вторая точка есть, но она вне окна. | Ha. Ikkinchi nuqta bor, lekin u oynadan tashqarida. | Yes. The second point exists but lies outside the window. |
| `q3.b` | вторая точка не существует | ikkinchi nuqta mavjud emas | the second point does not exist |
| `q3.b.hint` | Существует: прямая задевает окружность дважды. | Mavjud: to'g'ri chiziq aylanani ikki marta kesadi. | It does exist: the line meets the circle twice. |
| `q4.prompt` | Существует ли arcsin 2? | arcsin 2 mavjudmi? | Does arcsin 2 exist? |
| `q4.a` [верно] | нет | yo'q | no |
| `q4.b` | да, большой угол | ha, katta burchak | yes, a large angle |
| `q4.b.hint` | Высота два на окружности не встречается ни при каком угле. | Ikki balandlik aylanada hech qanday burchakda uchramaydi. | The height two never occurs on the circle at any angle. |
| `q4.c` | да, два радиана | ha, ikki radian | yes, two radians |
| `q4.c.hint` | Двойка здесь высота, а не угол. | Bu yerda ikki balandlik, burchak emas. | Here the two is a height, not an angle. |
| `q4.d` | только в радианах | faqat radianda | only in radians |
| `q4.d.hint` | Единицы измерения угла тут ни при чём: прямая просто не задела круг. | Burchak o'lchov birligi bu yerda hech nima qilmaydi: to'g'ri chiziq aylanaga tegmadi. | The unit of the angle changes nothing here: the line simply missed the circle. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `arcsin 1/2 = 30°` |
| `q2.done` | `arccos 0 = 90°` |
| `q3.done` | `arcsin x ∈ [−90°; 90°]` |
| `q4.done` | `−1 ≤ x ≤ 1` |
| `angles` | `30°` · `90°` · `210°` · `150°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Вижу обе точки, а не одну | Bitta emas, ikkala nuqtani ko'raman | I see both points, not one |
| `can.2` | Беру ответ из окна | Javobni oynadan olaman | I take the answer from the window |
| `can.3` | Помню, что у арккосинуса окно другое | Arkkosinusning oynasi boshqa ekanini eslayman | I remember the arccosine has a different window |
| `can.4` | Знаю, когда арксинуса нет | Arksinus qachon yo'qligini bilaman | I know when the arcsine does not exist |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: какое окно у арккосинуса. | Bitta joy takrorlashni talab qiladi: arkkosinusning oynasi qanday. | One place needs review: what the arccosine window is. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Урок 9: те же две точки, но теперь нужны обе — начинаются уравнения. | 9-dars: o'sha ikki nuqta, lekin endi ikkalasi kerak — tenglamalar boshlanadi. | Lesson 9: the same two points, but now both are needed — equations begin. |
| `lifehack` | Сначала найди обе точки, и только потом выбирай ту, что в окне. | Avval ikkala nuqtani toping, keyingina oynadagisini tanlang. | Find both points first, and only then choose the one in the window. |
| `sheetTitle` | Аркфункции · шпаргалка | Arkfunksiyalar · shpargalka | Arc functions · cheat sheet |
| `sheetSrc` | 10 класс · урок 8 | 10-sinf · 8-dars | Grade 10 · lesson 8 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Ответ у арксинуса один, потому что его берут из окна, а не потому, что вторая точка неправильная. | Arksinusning javobi bitta, chunki u oynadan olinadi, ikkinchi nuqta noto'g'ri bo'lgani uchun emas. | The arcsine has one answer because it is taken from the window, not because the second point is wrong. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `arcsin 1/2 = 30°` |
| `hook.b` | `arcsin 1/2 = 30°,  150°` |
| `proved` | `arcsin 1/2 = 30°` |
| `law` | `arcsin x ∈ [−90°; 90°],   arccos x ∈ [0°; 180°]` |
| `sheet.1` | `arcsin x ∈ [−90°; 90°]` |
| `sheet.2` | `arccos x ∈ [0°; 180°]` |
| `sheet.3` | `arcsin(−x) = −arcsin x` |
| `sheet.4` | `−1 ≤ x ≤ 1` |
| `sheet.5` | `arcsin 1/2 = 30°` · `arccos 1/2 = 60°` |
