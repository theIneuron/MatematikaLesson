# Урок 10 — `sin x = a` · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS09_KONTENT.md`.

Скелет: `DARS07_10_SKELET.md` §8. Опора в учебнике: алгебра 2022, стр. 141–143.

**Главное решение урока.** `(−1)ⁿ` не вводится как правило — она **получается** из того, что две
серии записали вместе. Ученик подставляет `n = 0, 1, 2, 3`, видит, как точка ходит между двумя
местами, и только потом читает формулу. Отсюда же и шаг `180°` вместо `360°`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОДНА ЗАПИСЬ | BITTA YOZUV | ONE READING |
| `title` | Откуда в ответе минус единица в степени? | Javobda darajadagi minus bir qayerdan? | Where does the minus one in the power come from? |
| `row.a.name` | это новая формула | bu yangi formula | this is a new formula |
| `row.b.name` | это две серии вместе | bu ikki seriya birga | these are two series together |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас подставим номера и посмотрим. | Javobingiz yozib olindi. Endi raqamlarni qo'yib ko'ramiz. | Your answer is saved. Now we will substitute the numbers and see. |
| `audio.mount*` | Точка ходит между двумя местами и с каждым шагом уходит на половину оборота дальше. | Nuqta ikki joy orasida yuradi va har qadamda yarim aylana uzoqroqqa ketadi. | The point walks between two places and each step goes half a turn further. |
| `audio.r1` | Первая запись говорит, что это новая формула, которую надо выучить. | Birinchi yozuv bu yodlash kerak bo'lgan yangi formula deydi. | The first reading says it is a new formula to memorise. |
| `audio.r2` | Вторая говорит, что это две вчерашние серии, записанные вместе. | Ikkinchisi bu kechagi ikki seriya birga yozilgani deydi. | The second says these are yesterday's two series written together. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `sin x = 1/2` |
| `row.a.value` | `(−1)ⁿ · 30° + 180°n` |
| `row.b.value` | `30° + 360°n,  150° + 360°n` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед склейкой | Yig'ishdan oldin uch savol | Three questions before folding |
| `q1.prompt` | Сколько серий в полном ответе уравнения с синусом? | Sinusli tenglamaning to'liq javobida nechta seriya bor? | How many series are in the full answer of a sine equation? |
| `q1.a` [верно] | две | ikkita | two |
| `q1.b` | одна | bitta | one |
| `q1.b.hint` | Одна покрывает только одну из двух точек. | Bittasi ikki nuqtadan faqat bittasini qoplaydi. | One covers only one of the two points. |
| `q1.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.c.hint` | Бесконечно много корней, а серий, которые их описывают, две. | Ildiz cheksiz ko'p, ularni tavsiflaydigan seriya esa ikkita. | There are infinitely many roots, but two series describing them. |
| `q1.d` | четыре | to'rtta | four |
| `q1.d.hint` | Точек пересечения две, значит и серий две. | Kesishish nuqtasi ikkita, demak seriya ham ikkita. | There are two intersection points, so two series. |
| `q2.prompt` | Чему равен минус один в квадрате? | Minus birning kvadrati nimaga teng? | What is minus one squared? |
| `q2.a` [верно] | единице | birga | one |
| `q2.b` | минус единице | minus birga | minus one |
| `q2.b.hint` | Минус на минус даёт плюс, значит вторая степень положительна. | Minusga minus plyus beradi, demak ikkinchi daraja musbat. | Minus times minus gives plus, so the second power is positive. |
| `q2.c` | нулю | nolga | zero |
| `q2.c.hint` | Ноль получается только из нуля. | Nol faqat noldan chiqadi. | Zero comes only from zero. |
| `q2.d` | двум | ikkiga | two |
| `q2.d.hint` | Степень это умножение, а не сложение. | Daraja bu ko'paytirish, qo'shish emas. | A power is multiplication, not addition. |
| `q3.prompt` | Что такое арксинус одной второй? | Bir ikkidanning arksinusi nima? | What is the arcsine of one half? |
| `q3.a` [верно] | угол из окна с такой высотой | oynadagi, shunday balandlikdagi burchak | the angle from the window with that height |
| `q3.b` | любой угол с такой высотой | shunday balandlikdagi har qanday burchak | any angle with that height |
| `q3.b.hint` | Тогда ответом был бы список, а нужен один угол. | Unda javob ro'yxat bo'lardi, bizga esa bitta burchak kerak. | Then the answer would be a list, and one angle is needed. |
| `q3.c` | высота угла | burchakning balandligi | the height of the angle |
| `q3.c.hint` | Наоборот: высота дана, а ищется угол. | Aksincha: balandlik berilgan, burchak qidiriladi. | The other way round: the height is given, the angle is sought. |
| `q3.d` | половина угла | burchakning yarmi | half the angle |
| `q3.d.hint` | Арксинус связан с высотой, а не с делением угла. | Arksinus balandlikka bog'liq, burchakni bo'lishga emas. | The arcsine is about the height, not about halving the angle. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `2` |
| `q2.done` | `(−1)² = 1` |
| `q3.done` | `arcsin 1/2 = 30°` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Две записи, обе верные | Ikki yozuv, ikkalasi to'g'ri | Two readings, both true |
| `show.1.1` | прямая на высоте одна вторая | bir ikkidan balandlikdagi to'g'ri chiziq | the line at height one half |
| `show.1.2` | точки тридцать и сто пятьдесят | o'ttiz va yuz ellik nuqtalar | the points thirty and one hundred fifty |
| `show.2.1` | у каждой своя серия | har birining o'z seriyasi | each has its own series |
| `show.2.2` | в ответе две строки | javobda ikkita qator | two lines in the answer |
| `audio.mount` | Вчерашний ответ: две точки, и у каждой своя серия. | Kechagi javob: ikkita nuqta, va har birining o'z seriyasi. | Yesterday's answer: two points, each with its own series. |
| `audio.two*` | Обе строки верны, и вместе они дают все корни. Неудобно другое: строк две, а в учебнике и на экзамене ответ пишут одной. | Ikkala qator ham to'g'ri, va birga ular hamma ildizni beradi. Noqulayligi boshqa: qator ikkita, darslikda va imtihonda esa javob bitta qator bilan yoziladi. | Both lines are true, and together they give every root. The awkward part is different: there are two lines, while the textbook and the exam write the answer as one. |
| `audio.work` | Теперь сам. Поставь точку во вторую из них. | Endi o'zingiz. Ulardan ikkinchisiga nuqta qo'ying. | Now you. Place the point at the second of them. |
| `work.prompt` | Поставь точку во второй корень. | Ikkinchi ildizga nuqta qo'ying. | Place the point at the second root. |
| `work.ok` | Сто пятьдесят градусов. Эта точка даёт вторую серию. | Yuz ellik gradus. Bu nuqta ikkinchi seriyani beradi. | One hundred fifty degrees. This point gives the second series. |
| `work.hint.1` | Нужна вторая точка на той же прямой. | O'sha to'g'ri chiziqdagi ikkinchi nuqta kerak. | You need the second point on the same line. |
| `work.hint.2` | Она слева от вертикальной оси. | U vertikal o'qdan chapda. | It is left of the vertical axis. |
| `work.hint.3` | Сто пятьдесят градусов. | Yuz ellik gradus. | One hundred fifty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 4 · `explain2` · ответ `lead` · тег `seriya-bez-n`

Свидетель урока: точка ходит между двумя местами. Список растёт, и по нему видно чередование.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Подставим номера по очереди | Raqamlarni navbat bilan qo'yamiz | Substitute the numbers one by one |
| `show.1.1` | при нуле точка справа | nolda nuqta o'ngda | at zero the point is on the right |
| `show.1.2` | при единице слева | birda chapda | at one on the left |
| `show.2.1` | при двойке снова справа | ikkida yana o'ngda | at two on the right again |
| `show.2.2` | места всего два | joy jami ikkita | there are only two places |
| `audio.mount` | Подставим в одну строку номера по очереди и посмотрим, куда попадает точка. | Bitta qatorga raqamlarni navbat bilan qo'yamiz va nuqta qayerga tushishini ko'ramiz. | Substitute the numbers one by one into a single line and watch where the point lands. |
| `audio.alt*` | Ноль даёт тридцать, единица сто пятьдесят, двойка триста девяносто, тройка пятьсот десять. Точка ходит между двумя местами и каждый раз уходит на половину оборота дальше. | Nol o'ttizni beradi, bir yuz ellikni, ikki uch yuz to'qsonni, uch besh yuz o'nni. Nuqta ikki joy orasida yuradi va har safar yarim aylana uzoqroqqa ketadi. | Zero gives thirty, one gives one hundred fifty, two gives three hundred ninety, three gives five hundred ten. The point walks between two places and each time goes half a turn further. |
| `audio.work` | Теперь сам. Поставь точку туда, куда приведёт номер один. | Endi o'zingiz. Bir raqami olib keladigan joyga nuqta qo'ying. | Now you. Place the point where the number one leads. |
| `work.prompt` | Куда приведёт n = 1? | n = 1 qayerga olib keladi? | Where does n = 1 lead? |
| `work.ok` | В сто пятьдесят. Нечётный номер отправляет точку во вторую позицию. | Yuz ellikka. Toq raqam nuqtani ikkinchi joyga yuboradi. | To one hundred fifty. An odd number sends the point to the second place. |
| `work.hint.1` | Подставь единицу и посчитай. | Birni qo'ying va hisoblang. | Substitute one and compute. |
| `work.hint.2` | Минус тридцать плюс сто восемьдесят. | Minus o'ttiz qo'shilgan yuz sakson. | Minus thirty plus one hundred eighty. |
| `work.hint.3` | Сто пятьдесят градусов. | Yuz ellik gradus. | One hundred fifty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 5 · `explain3` · ответ `lead` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Чётные направо, нечётные налево | Juftlar o'ngga, toqlar chapga | Even to the right, odd to the left |
| `show.1.1` | чётный номер оставляет знак | juft raqam ishorani qoldiradi | an even number keeps the sign |
| `show.1.2` | нечётный меняет | toq esa almashtiradi | an odd one flips it |
| `show.2.1` | это и делает множитель | buni ko'paytuvchi qiladi | that is what the factor does |
| `show.2.2` | минус единица в степени | darajadagi minus bir | minus one in the power |
| `audio.mount` | Посмотрим, что отличает чётные номера от нечётных. | Juft raqamlarni toqlaridan nima farqlashiga qaraymiz. | Let us see what tells even numbers from odd ones. |
| `audio.sign*` | При чётном номере угол берётся со знаком плюс, при нечётном со знаком минус. Именно это и делает множитель минус единица в степени эн: он ничего не считает, он только переключает знак. | Juft raqamda burchak plyus ishora bilan, toqda minus ishora bilan olinadi. Aynan shuni minus bir daraja en ko'paytuvchisi qiladi: u hech narsa hisoblamaydi, faqat ishorani almashtiradi. | With an even number the angle is taken with a plus, with an odd one with a minus. That is exactly what the factor minus one to the power n does: it computes nothing, it only switches the sign. |
| `audio.work` | Теперь сам. Поставь точку туда, куда приведёт номер два. | Endi o'zingiz. Ikki raqami olib keladigan joyga nuqta qo'ying. | Now you. Place the point where the number two leads. |
| `work.prompt` | Куда приведёт n = 2? | n = 2 qayerga olib keladi? | Where does n = 2 lead? |
| `work.ok` | Туда же, куда и ноль. Чётный номер возвращает точку в первую позицию, только на оборот дальше. | Nol kelgan joyga. Juft raqam nuqtani birinchi joyga qaytaradi, faqat bir aylana uzoqroqqa. | The same place as zero. An even number returns the point to the first place, just one turn further. |
| `work.hint.1` | Двойка чётная, значит знак у угла плюс. | Ikki juft, demak burchak ishorasi plyus. | Two is even, so the angle keeps its plus. |
| `work.hint.2` | Тридцать плюс триста шестьдесят это триста девяносто. | O'ttiz qo'shilgan uch yuz oltmish uch yuz to'qson bo'ladi. | Thirty plus three hundred sixty is three hundred ninety. |
| `work.hint.3` | Тридцать градусов. | O'ttiz gradus. | Thirty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 6 · `explain4` · ответ `number` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Шаг стал вдвое короче | Qadam ikki barobar qisqardi | The step became twice as short |
| `show.1.1` | в каждой серии шаг был оборот | har seriyada qadam aylana edi | in each series the step was a turn |
| `show.1.2` | записей было две | yozuv ikkita edi | there were two readings |
| `show.2.1` | в общей записи шаг половина | umumiy yozuvda qadam yarim | in the joint reading the step is half |
| `show.2.2` | потому что записи чередуются | chunki yozuvlar almashadi | because the readings alternate |
| `audio.mount` | В каждой отдельной серии шаг был полный оборот. | Har alohida seriyada qadam to'liq aylana edi. | In each separate series the step was a full turn. |
| `audio.half*` | А в общей записи соседние номера дают разные точки, и между ними половина оборота. Поэтому в формуле стоит сто восемьдесят, а не триста шестьдесят. Это не опечатка, это следствие склейки. | Umumiy yozuvda esa qo'shni raqamlar boshqa nuqtalarni beradi, va ular orasida yarim aylana. Shuning uchun formulada uch yuz oltmish emas, yuz sakson turadi. Bu xato emas, bu yig'ishning natijasi. | In the joint reading neighbouring numbers give different points, half a turn apart. That is why the formula has one hundred eighty, not three hundred sixty. It is not a typo, it follows from the folding. |
| `audio.work` | Посчитай сам. Чему равен шаг в общей записи? | O'zingiz hisoblang. Umumiy yozuvda qadam qanchaga teng? | Compute it yourself. What is the step in the joint reading? |
| `work.prompt` | Чему равен шаг в общей записи, в градусах? | Umumiy yozuvda qadam necha gradus? | What is the step of the joint reading, in degrees? |
| `work.ok` | Сто восемьдесят. Соседние номера дают соседние точки, а между ними половина оборота. | Yuz sakson. Qo'shni raqamlar qo'shni nuqtalarni beradi, ular orasida esa yarim aylana. | One hundred eighty. Neighbouring numbers give neighbouring points, half a turn apart. |
| `work.hint.1` | Посчитай разность между сто пятьдесят и тридцать. | Yuz ellik bilan o'ttiz orasidagi farqni hisoblang. | Compute the difference between one hundred fifty and thirty. |
| `work.hint.2` | Это половина полного оборота. | Bu to'liq aylananing yarmi. | That is half a full turn. |
| `work.hint.3` | Сто восемьдесят. | Yuz sakson. | One hundred eighty. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `180` |

---

## Экран 7 · `explain5` · ответ `number` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Когда точка всего одна | Nuqta bitta bo'lganda | When there is only one point |
| `show.1.1` | высота равна единице | balandlik birga teng | the height equals one |
| `show.1.2` | прямая касается края | to'g'ri chiziq chetiga tegadi | the line touches the edge |
| `show.2.1` | точка всего одна | nuqta jami bitta | there is only one point |
| `show.2.2` | и серия тоже одна | seriya ham bitta | and the series is single too |
| `audio.mount` | Возьмём высоту, равную единице. Прямая стоит у самого верха. | Birga teng balandlikni olaylik. To'g'ri chiziq eng tepada turadi. | Take the height equal to one. The line stands at the very top. |
| `audio.touch*` | Она касается окружности в одной точке, а не пересекает её. Точка одна, значит и серия одна, и общая формула здесь не нужна. | U aylanaga bir nuqtada tegadi, kesib o'tmaydi. Nuqta bitta, demak seriya ham bitta, va umumiy formula bu yerda kerak emas. | It touches the circle at one point instead of crossing it. There is one point, so one series, and the joint formula is not needed here. |
| `audio.work` | Посчитай сам. Сколько серий в ответе уравнения синус икс равен единице? | O'zingiz hisoblang. Sinus iks birga teng tenglamaning javobida nechta seriya bor? | Compute it yourself. How many series are in the answer of sine x equals one? |
| `work.prompt` | Сколько серий у sin x = 1? | sin x = 1 da nechta seriya bor? | How many series does sin x = 1 have? |
| `work.ok` | Одна. Точка всего одна, и повторяется она через полный оборот. | Bitta. Nuqta jami bitta, va u to'liq aylanadan keyin takrorlanadi. | One. There is a single point, and it repeats after a full turn. |
| `work.hint.1` | Посчитай точки, где прямая встретила окружность. | To'g'ri chiziq aylanani uchratgan nuqtalarni sanang. | Count the points where the line met the circle. |
| `work.hint.2` | Она коснулась, а не пересекла, значит точка одна. | U tegdi, kesmadi, demak nuqta bitta. | It touched instead of crossing, so there is one point. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Общая запись корней | Ildizlarning umumiy yozuvi | The joint reading of the roots |
| `probe.question` | Что делает множитель `(−1)ⁿ`? | `(−1)ⁿ` ko'paytuvchi nima qiladi? | What does the factor `(−1)ⁿ` do? |
| `probe.a` [верно] | переключает знак угла | burchak ishorasini almashtiradi | it switches the sign of the angle |
| `probe.b` | увеличивает угол | burchakni orttiradi | it enlarges the angle |
| `probe.b.hint` | Множитель равен единице или минус единице, размер он не меняет. | Ko'paytuvchi birga yoki minus birga teng, o'lchamni o'zgartirmaydi. | The factor equals one or minus one, it does not change the size. |
| `rule.lawLabel` | Склейка | Yig'ish | The folding |
| `rule.lines.1` | Две серии записываются одной строкой: чётные номера дают первую точку, нечётные вторую. | Ikki seriya bitta qator bilan yoziladi: juft raqamlar birinchi nuqtani, toqlar ikkinchisini beradi. | Two series are written as one line: even numbers give the first point, odd ones the second. |
| `rule.lines.2` | Множитель `(−1)ⁿ` только переключает знак угла, ничего не считая. | `(−1)ⁿ` ko'paytuvchi faqat burchak ishorasini almashtiradi, hech narsa hisoblamaydi. | The factor `(−1)ⁿ` only switches the sign of the angle, computing nothing. |
| `rule.lines.3` | Шаг в общей записи равен `180°`, то есть `π`: соседние номера дают соседние точки. | Umumiy yozuvda qadam `180°` ga teng, chunki qo'shni raqamlar qo'shni nuqtalarni beradi. | The step in the joint reading is `180°` because neighbouring numbers give neighbouring points. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Точка ещё раз проходит по номерам, и правило открывается рядом. Формула не новая: это две серии, записанные вместе. | Nuqta yana bir bor raqamlar bo'ylab o'tadi, va qoida yonida ochiladi. Formula yangi emas: bu birga yozilgan ikki seriya. | The point walks through the numbers once more, and the rule opens beside it. The formula is not new: it is two series written together. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `x = (−1)ⁿ arcsin a + πn` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Номер и его точка | Raqam va uning nuqtasi | The number and its point |
| `match.prompt` | Соедини номер с углом, который он даёт. | Raqamni u beradigan burchak bilan birlashtiring. | Match the number with the angle it gives. |
| `match.ok` | Чётные номера ведут в первую точку, нечётные во вторую, и каждый следующий на половину оборота дальше. | Juft raqamlar birinchi nuqtaga, toqlar ikkinchisiga olib boradi, va har keyingisi yarim aylana uzoqroqqa. | Even numbers lead to the first point, odd ones to the second, each next half a turn further. |
| `audio.mount` | Четыре номера и четыре угла. Соедини их. | To'rt raqam va to'rt burchak. Ularni birlashtiring. | Four numbers and four angles. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `n = 0` · `n = 1` · `n = 2` · `n = 3` |
| `match.a` | `30°` |
| `match.b` | `150°` |
| `match.c` | `390°` |
| `match.d` | `510°` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Собери формулу по шагам | Formulani qadam bilan yig'ing | Assemble the formula step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | находим угол в окне | oynadagi burchakni topamiz | we find the angle in the window |
| `order.s2` | берём вторую точку | ikkinchi nuqtani olamiz | we take the second point |
| `order.s3` | склеиваем через знак | ishora orqali yig'amiz | we fold them through the sign |
| `order.s4` | шаг ставим сто восемьдесят | qadamni yuz sakson qo'yamiz | we set the step to one hundred eighty |
| `order.ok` | Формула собрана из того, что уже было: угол из окна, вторая точка, чередование знака и половина оборота. | Formula avvalgi narsalardan yig'ildi: oynadagi burchak, ikkinchi nuqta, ishora almashinuvi va yarim aylana. | The formula is assembled from what was already there: the angle from the window, the second point, the sign alternation and half a turn. |
| `order.bad` | Сначала угол из окна, потом вторая точка, потом знак, и только потом шаг. | Avval oynadagi burchak, keyin ikkinchi nuqta, keyin ishora, keyingina qadam. | First the angle from the window, then the second point, then the sign, and only then the step. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `150°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Сто пятьдесят. Номер нечётный, значит угол берётся с минусом, и прибавляется сто восемьдесят. | Yuz ellik. Raqam toq, demak burchak minus bilan olinadi, va yuz sakson qo'shiladi. | One hundred fifty. The number is odd, so the angle takes a minus, and one hundred eighty is added. |
| `task.hint.1` | Единица нечётная, значит множитель равен минус единице. | Bir toq, demak ko'paytuvchi minus birga teng. | One is odd, so the factor equals minus one. |
| `task.hint.2` | Минус тридцать плюс сто восемьдесят. | Minus o'ttiz qo'shilgan yuz sakson. | Minus thirty plus one hundred eighty. |
| `task.hint.3` | Сто пятьдесят. | Yuz ellik. | One hundred fifty. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой корень меньше? | Qaysi ildiz kichikroq? | Which root is smaller? |
| `order.ok` | Ты подставил номера и сравнил углы, а не записи. | Siz raqamlarni qo'ydingiz va yozuvlarni emas, burchaklarni solishtirdingiz. | You substituted the numbers and compared angles, not readings. |
| `order.bad` | Подставь каждый номер в формулу и сравни то, что получилось. | Har raqamni formulaga qo'ying va chiqqanini solishtiring. | Put each number into the formula and compare the results. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `(−1)ⁿ·30° + 180°n,   n = 1   →   ?` |
| `task.answer` | `150` |
| `order.items` | `n = 0` · `n = 1` · `n = 2` · `n = 3` |
| `order.answer` | `n = 0  n = 1  n = 2  n = 3` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob noto'g'ri. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка верна: арксинус одной второй действительно равен тридцати. | Bu qator to'g'ri: bir ikkidanning arksinusi haqiqatan o'ttizga teng. | This line is right: the arcsine of one half really is thirty. |
| `hint.r2` | Эта строка тоже верна: множитель переключает знак. | Bu qator ham to'g'ri: ko'paytuvchi ishorani almashtiradi. | This line is right too: the factor switches the sign. |
| `hint.r4` | Эта строка выросла из неверной. Первая неверная строка выше. | Bu qator xato qatordan o'sib chiqqan. Birinchi xato qator yuqorida. | This line grew out of a wrong one. The first wrong line is above. |
| `proof` | При номере один получается триста тридцать, а нужен сто пятьдесят. | Bir raqamida uch yuz o'ttiz chiqadi, kerakli esa yuz ellik. | With the number one it gives three hundred thirty, and one hundred fifty is needed. |
| `entry.prompt` | Чему равен шаг в общей записи? | Umumiy yozuvda qadam qanchaga teng? | What is the step in the joint reading? |
| `entry.ok` | Сто восемьдесят. Соседние номера дают соседние точки, а между ними половина оборота. | Yuz sakson. Qo'shni raqamlar qo'shni nuqtalarni beradi, ular orasida esa yarim aylana. | One hundred eighty. Neighbouring numbers give neighbouring points, half a turn apart. |
| `entry.hint.1` | Подставь ноль и единицу и сравни ответы. | Nol va birni qo'ying va javoblarni solishtiring. | Substitute zero and one and compare the answers. |
| `entry.hint.2` | Между тридцатью и ста пятьюдесятью половина оборота. | O'ttiz bilan yuz ellik orasida yarim aylana. | Between thirty and one hundred fifty there is half a turn. |
| `entry.hint.3` | Сто восемьдесят. | Yuz sakson. | One hundred eighty. |
| `audio.mount` | Задача. Записать все корни уравнения синус икс равен одной второй одной строкой. | Masala. Sinus iks bir ikkidanga teng tenglamaning hamma ildizini bitta qator bilan yozish. | A task. Write every root of sine x equals one half in a single line. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `arcsin 1/2 = 30°` |
| `row.r2` | `x = (−1)ⁿ · 30° + ...` |
| `row.r3` | `x = (−1)ⁿ · 30° + 360°n` |
| `row.r4` | `n = 1   →   x = 330°` |
| `answerId` | `r3` |
| `entry.answer` | `180` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По точке назвать номера | Nuqtadan raqamlarni aytish | From the point back to the numbers |
| `place.prompt` | Поставь точку на 150 градусов. | Nuqtani 150 gradusga qo'ying. | Place the point at 150 degrees. |
| `place.ok` | Это вторая позиция. В неё ведут нечётные номера. | Bu ikkinchi joy. Unga toq raqamlar olib boradi. | This is the second place. Odd numbers lead to it. |
| `place.wrong` | Сто пятьдесят это выше горизонтальной оси и левее вертикальной. | Yuz ellik gorizontal o'qdan yuqorida va vertikal o'qdan chapda. | One hundred fifty is above the horizontal axis and left of the vertical one. |
| `multi.prompt` | Отметь все номера, которые дают эту точку. | Shu nuqtani beradigan hamma raqamni belgilang. | Mark every number that gives this point. |
| `multi.title` | Какие номера дают эту точку? | Qaysi raqamlar shu nuqtani beradi? | Which numbers give this point? |
| `multi.d.hint` | Ноль чётный, он ведёт в первую точку. | Nol juft, u birinchi nuqtaga olib boradi. | Zero is even, it leads to the first point. |
| `multi.e.hint` | Двойка тоже чётная, значит и она в первую. | Ikki ham juft, demak u ham birinchisiga. | Two is even as well, so it also leads to the first. |
| `multi.ok` | Три из пяти. В эту точку ведут ровно нечётные номера, и никакие другие. | Beshtadan uchtasi. Bu nuqtaga aynan toq raqamlar olib boradi, boshqasi yo'q. | Three out of five. Exactly the odd numbers lead to this point, and no others. |
| `audio.mount` | Теперь обратная задача. Дана точка, а нужны номера, которые в неё ведут. | Endi teskari masala. Nuqta berilgan, unga olib keladigan raqamlar kerak. | Now the inverse task. A point is given, and the numbers leading to it are needed. |
| `audio.work` | Поставь точку, потом отметишь все номера, которые в неё ведут. | Nuqtani qo'ying, keyin unga olib keladigan hamma raqamni belgilaysiz. | Place the point, then you will mark every number leading to it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `150°` |
| `place.step` | `n = 1   →   150°` |
| `multi.a` [верно] | `n = 1` |
| `multi.b` [верно] | `n = 3` |
| `multi.c` [верно] | `n = −1` |
| `multi.d` | `n = 0` |
| `multi.e` | `n = 2` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Что делает множитель `(−1)ⁿ`? | `(−1)ⁿ` ko'paytuvchi nima qiladi? | What does the factor `(−1)ⁿ` do? |
| `q1.a` [верно] | переключает знак | ishorani almashtiradi | it switches the sign |
| `q1.b` | увеличивает угол | burchakni orttiradi | it enlarges the angle |
| `q1.b.hint` | Он равен единице или минус единице, размер не меняет. | U birga yoki minus birga teng, o'lchamni o'zgartirmaydi. | It equals one or minus one and does not change the size. |
| `q1.c` | обнуляет угол | burchakni nollaydi | it zeroes the angle |
| `q1.c.hint` | Ноль получился бы только при умножении на ноль. | Nol faqat nolga ko'paytirilganda chiqardi. | Zero would come only from multiplying by zero. |
| `q1.d` | ничего не делает | hech narsa qilmaydi | it does nothing |
| `q1.d.hint` | При нечётном номере он меняет знак, и точка уходит в другое место. | Toq raqamda u ishorani almashtiradi, va nuqta boshqa joyga ketadi. | With an odd number it flips the sign, and the point goes elsewhere. |
| `q2.prompt` | Чему равен шаг в общей записи? | Umumiy yozuvda qadam qanchaga teng? | What is the step in the joint reading? |
| `q2.a` [верно] | сто восемьдесят | yuz sakson | one hundred eighty |
| `q2.b` | триста шестьдесят | uch yuz oltmish | three hundred sixty |
| `q2.b.hint` | Триста шестьдесят это шаг каждой отдельной серии, а не общей записи. | Uch yuz oltmish har alohida seriyaning qadami, umumiy yozuvniki emas. | Three hundred sixty is the step of each separate series, not of the joint reading. |
| `q2.c` | девяносто | to'qson | ninety |
| `q2.c.hint` | Между соседними точками половина оборота, а не четверть. | Qo'shni nuqtalar orasida yarim aylana, chorak emas. | Between neighbouring points there is half a turn, not a quarter. |
| `q2.d` | зависит от угла | burchakka bog'liq | it depends on the angle |
| `q2.d.hint` | Шаг всегда один и тот же, каким бы ни был угол. | Qadam burchak qanday bo'lishidan qat'i nazar doim bir xil. | The step is always the same whatever the angle. |
| `q3.prompt` | Куда ведут чётные номера? | Juft raqamlar qayerga olib boradi? | Where do even numbers lead? |
| `q3.a` [верно] | в первую точку | birinchi nuqtaga | to the first point |
| `q3.a.ok` | Да. Чётный номер оставляет угол с плюсом. | Ha. Juft raqam burchakni plyus bilan qoldiradi. | Yes. An even number leaves the angle with a plus. |
| `q3.b` | во вторую точку | ikkinchi nuqtaga | to the second point |
| `q3.b.hint` | Во вторую ведут нечётные: там множитель равен минус единице. | Ikkinchisiga toqlar olib boradi: u yerda ko'paytuvchi minus birga teng. | Odd ones lead to the second: there the factor equals minus one. |
| `q4.prompt` | Сколько серий у sin x = 1? | sin x = 1 da nechta seriya bor? | How many series does sin x = 1 have? |
| `q4.a` [верно] | одна | bitta | one |
| `q4.b` | две | ikkita | two |
| `q4.b.hint` | Прямая коснулась края, точка всего одна. | To'g'ri chiziq chetiga tegdi, nuqta jami bitta. | The line touched the edge, there is only one point. |
| `q4.c` | ни одной | hech qaysi | none |
| `q4.c.hint` | Одна точка есть, значит и серия есть. | Bitta nuqta bor, demak seriya ham bor. | There is one point, so there is a series. |
| `q4.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q4.d.hint` | Корней бесконечно много, а серия одна. | Ildiz cheksiz ko'p, seriya esa bitta. | There are infinitely many roots, but one series. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `(−1)ⁿ = ± 1` |
| `q2.done` | `180°n` |
| `q3.done` | `n = 0, 2, 4` |
| `q4.done` | `1` |
| `angles` | `30°` · `150°` · `390°` · `90°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Записываю все корни одной строкой | Hamma ildizni bitta qator bilan yozaman | I write every root in one line |
| `can.2` | Знаю, что делает множитель со знаком | Ko'paytuvchi ishora bilan nima qilishini bilaman | I know what the factor does to the sign |
| `can.3` | Помню, что шаг равен половине оборота | Qadam yarim aylanaga tengligini eslayman | I remember the step is half a turn |
| `can.4` | Разворачиваю формулу обратно | Formulani orqaga yozaman | I unfold the formula back |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: чему равен шаг. | Bitta joy takrorlashni talab qiladi: qadam qanchaga teng. | One place needs review: what the step equals. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Урок 11: то же самое для косинуса, и там склейка выйдет короче. | 11-dars: kosinus uchun o'shanisi, va u yerda yig'ish qisqaroq chiqadi. | Lesson 11: the same for the cosine, and there the folding comes out shorter. |
| `lifehack` | Забыл формулу — подставь ноль и единицу. Если получились обе точки, формула записана верно. | Formulani unutdingizmi, nol va birni qo'ying. Ikkala nuqta chiqsa, formula to'g'ri yozilgan. | Forgot the formula, substitute zero and one. If both points come out, the formula is written right. |
| `sheetTitle` | Общая запись · шпаргалка | Umumiy yozuv · shpargalka | The joint reading · cheat sheet |
| `sheetSrc` | 10 класс · урок 10 | 10-sinf · 10-dars | Grade 10 · lesson 10 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Это не новая формула, а две вчерашние серии, записанные вместе. | Bu yangi formula emas, kechagi ikki seriya birga yozilgani. | It is not a new formula but yesterday's two series written together. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `(−1)ⁿ` |
| `hook.b` | `360°n` |
| `proved` | `(−1)ⁿ·30° + 180°n` |
| `law` | `x = (−1)ⁿ arcsin a + πn` |
| `sheet.1` | `(−1)ⁿ arcsin a + πn` |
| `sheet.2` | `n = 0  →  30°` |
| `sheet.3` | `n = 1  →  150°` |
| `sheet.4` | `n = 2  →  390°` |
| `sheet.5` | `90° + 360°n` |
