# Урок 9 — Простейшие тригонометрические уравнения · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS08_KONTENT.md`.

Скелет: `DARS07_10_SKELET.md` §7. Опора в учебнике: алгебра 2022, стр. 140–142.

**Что этот урок вводит первым в классе:** «серия корней» и буква `n`. Окно однозначности введено
уроком 8, отрицательный поворот — уроком 5.

**Главное решение урока.** Урок 8 брал из двух точек одну. Здесь нужны **обе** — и все их
повторения. Серия записывается **от одной точки**: `x = 30° + 360°n`. Общая формула с `(−1)ⁿ`
появится уроком 10, и появится она как склейка двух записей, а не как новое правило.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | УРАВНЕНИЕ | TENGLAMA | THE EQUATION |
| `title` | Сколько корней у уравнения? | Tenglamaning nechta ildizi bor? | How many roots does the equation have? |
| `row.a.name` | корней два | ildiz ikkita | two roots |
| `row.b.name` | корней бесконечно много | ildiz cheksiz ko'p | infinitely many roots |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим оборотом. | Javobingiz yozib olindi. Endi aylana bilan tekshiramiz. | Your answer is saved. Now a turn will check it. |
| `audio.mount*` | Точка возвращается на своё место после полного оборота, и высота у неё та же. | Nuqta to'liq aylanadan keyin o'z joyiga qaytadi, balandligi ham o'sha. | The point returns to its place after a full turn, with the same height. |
| `audio.r1` | Первая запись говорит, что корней два. | Birinchi yozuv ildiz ikkita deydi. | The first reading says there are two roots. |
| `audio.r2` | Вторая говорит, что их бесконечно много. | Ikkinchisi cheksiz ko'p deydi. | The second says there are infinitely many. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `sin x = 1/2` |
| `row.a.value` | `x = 30°,  150°` |
| `row.b.value` | `x = 30° + 360°n` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед уравнениями | Tenglamalardan oldin uch savol | Three questions before equations |
| `q1.prompt` | Сколько точек даёт горизонтальная прямая внутри круга? | Gorizontal to'g'ri chiziq aylana ichida nechta nuqta beradi? | How many points does a horizontal line give inside the circle? |
| `q1.a` [верно] | две | ikkita | two |
| `q1.b` | одну | bitta | one |
| `q1.b.hint` | Одну она даёт только когда касается края, на самом верху или внизу. | Bitta faqat chetiga tekkanda, eng tepada yoki pastda beradi. | One only when it touches the edge, at the very top or bottom. |
| `q1.c` | ни одной | hech qaysi | none |
| `q1.c.hint` | Ни одной бывает, если прямая прошла выше окружности. | To'g'ri chiziq aylanadan yuqoridan o'tsa, hech qaysi bo'ladi. | None happens if the line passed above the circle. |
| `q1.d` | четыре | to'rtta | four |
| `q1.d.hint` | Прямая и окружность пересекаются не больше чем в двух точках. | To'g'ri chiziq va aylana ikkitadan ko'p nuqtada kesishmaydi. | A line and a circle meet in at most two points. |
| `q2.prompt` | Что возвращает точку на прежнее место? | Nuqtani avvalgi joyiga nima qaytaradi? | What returns the point to its former place? |
| `q2.a` [верно] | целое число оборотов | butun sondagi aylana | a whole number of turns |
| `q2.b` | половина оборота | yarim aylana | half a turn |
| `q2.b.hint` | Половина уводит точку напротив, это был пятый урок. | Yarim aylana nuqtani qarshi tomonga olib ketadi, bu beshinchi darsda edi. | Half a turn sends the point opposite, that was lesson five. |
| `q2.c` | любое число градусов | har qanday gradus soni | any number of degrees |
| `q2.c.hint` | Тогда точка сдвинулась бы, а нужна та же самая. | Unda nuqta qimirlagan bo'lardi, bizga esa aynan o'sha kerak. | Then the point would move, and we need the very same one. |
| `q2.d` | ничто | hech narsa | nothing |
| `q2.d.hint` | Возвращает: полный оборот приводит точку туда же. | Qaytaradi: to'liq aylana nuqtani o'sha yerga olib keladi. | It does: a full turn brings the point to the same place. |
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
| `q2.done` | `α + 360°n` |
| `q3.done` | `arcsin 1/2 = 30°` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Решить уравнение значит найти все углы | Tenglamani yechish barcha burchaklarni topish | Solving means finding every angle |
| `show.1.1` | высота задана | balandlik berilgan | the height is given |
| `show.1.2` | прямая на этой высоте | shu balandlikdagi to'g'ri chiziq | the line at that height |
| `show.2.1` | подходят обе точки | ikkala nuqta ham to'g'ri keladi | both points fit |
| `show.2.2` | тридцать и сто пятьдесят | o'ttiz va yuz ellik | thirty and one hundred fifty |
| `audio.mount` | Уравнение просит: найди углы, у которых высота равна одной второй. | Tenglama so'raydi: balandligi bir ikkidan bo'lgan burchaklarni toping. | The equation asks: find the angles whose height is one half. |
| `audio.drop*` | Прямая садится на эту высоту и задевает окружность в двух точках. На прошлом уроке из них брали одну, а здесь нужны обе: обе дают верное равенство. | To'g'ri chiziq shu balandlikka tushadi va aylanani ikki nuqtada kesadi. O'tgan darsda ulardan bittasi olinardi, bu yerda esa ikkalasi kerak: ikkalasi ham to'g'ri tenglik beradi. | The line settles at that height and meets the circle at two points. Last lesson one of them was taken, here both are needed: both give a true equality. |
| `audio.work` | Теперь сам. Поставь точку во второй корень, тот, что слева. | Endi o'zingiz. Ikkinchi ildizga, chapdagisiga nuqta qo'ying. | Now you. Place the point at the second root, the one on the left. |
| `work.prompt` | Поставь точку во второй корень уравнения. | Tenglamaning ikkinchi ildiziga nuqta qo'ying. | Place the point at the second root of the equation. |
| `work.ok` | Сто пятьдесят градусов. Высота та же, значит равенство верное, и это тоже корень. | Yuz ellik gradus. Balandlik o'sha, demak tenglik to'g'ri, va bu ham ildiz. | One hundred fifty degrees. The same height, so the equality holds, and this is a root too. |
| `work.hint.1` | Нужна вторая точка на той же прямой. | O'sha to'g'ri chiziqdagi ikkinchi nuqta kerak. | You need the second point on the same line. |
| `work.hint.2` | Она слева от вертикальной оси, высота у неё положительная. | U vertikal o'qdan chapda, balandligi musbat. | It is left of the vertical axis, with a positive height. |
| `work.hint.3` | Сто пятьдесят градусов. | Yuz ellik gradus. | One hundred fifty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 4 · `explain2` · ответ `lead` · тег `seriya-bez-n`

Свидетель урока: из одной точки уходит серия. Записи растут одна за другой, буква `n` появляется
из этого списка, а не из определения.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Из каждой точки уходит серия | Har nuqtadan seriya ketadi | A series leaves each point |
| `show.1.1` | точка вернулась на место | nuqta joyiga qaytdi | the point returned to its place |
| `show.1.2` | прибавилось триста шестьдесят | uch yuz oltmish qo'shildi | three hundred sixty was added |
| `show.2.1` | ещё оборот | yana bir aylana | one more turn |
| `show.2.2` | записей уже три | yozuv allaqachon uchta | three readings already |
| `audio.mount` | Вернёмся к первому корню, к тридцати градусам. | Birinchi ildizga, o'ttiz gradusga qaytamiz. | Back to the first root, to thirty degrees. |
| `audio.turn*` | Полный оборот приводит точку туда же, значит триста девяносто градусов тоже корень. Ещё оборот, и семьсот пятьдесят тоже. Список не кончается. | To'liq aylana nuqtani o'sha yerga olib keladi, demak uch yuz to'qson gradus ham ildiz. Yana bir aylana, va yetti yuz ellik ham. Ro'yxat tugamaydi. | A full turn brings the point to the same place, so three hundred ninety degrees is a root too. One more turn, and seven hundred fifty as well. The list does not end. |
| `audio.work` | Теперь сам. Поставь точку туда, куда придёт угол в семьсот пятьдесят градусов. | Endi o'zingiz. Yetti yuz ellik graduslik burchak keladigan joyga nuqta qo'ying. | Now you. Place the point where the angle of seven hundred fifty degrees arrives. |
| `work.prompt` | Куда придёт угол 750 градусов? | 750 graduslik burchak qayerga keladi? | Where does the angle of 750 degrees arrive? |
| `work.ok` | Туда же, куда и тридцать. Два полных оборота ничего не меняют. | O'ttiz kelgan joyga. Ikki to'liq aylana hech narsani o'zgartirmaydi. | The same place as thirty. Two full turns change nothing. |
| `work.hint.1` | Отбрось от семисот пятидесяти полные обороты. | Yetti yuz ellikdan to'liq aylanalarni tashlang. | Drop the whole turns from seven hundred fifty. |
| `work.hint.2` | Семьсот пятьдесят это тридцать плюс два оборота. | Yetti yuz ellik bu o'ttiz qo'shilgan ikki aylana. | Seven hundred fifty is thirty plus two turns. |
| `work.hint.3` | Тридцать градусов. | O'ttiz gradus. | Thirty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 5 · `explain3` · ответ `lead` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Как записать бесконечный список | Cheksiz ro'yxatni qanday yozish | How to write an endless list |
| `show.1.1` | тридцать, триста девяносто, семьсот пятьдесят | o'ttiz, uch yuz to'qson, yetti yuz ellik | thirty, three hundred ninety, seven hundred fifty |
| `show.1.2` | шаг всегда один оборот | qadam doim bitta aylana | the step is always one turn |
| `show.2.1` | вместо списка одна строка | ro'yxat o'rniga bitta qator | one line instead of a list |
| `show.2.2` | буква `n` это номер оборота | `n` harfi aylana raqami | the letter `n` is the number of the turn |
| `audio.mount` | Список бесконечный, а записать его надо в одну строку. | Ro'yxat cheksiz, uni esa bitta qatorga yozish kerak. | The list is endless, and it has to be written in one line. |
| `audio.write*` | Все записи отличаются целым числом оборотов. Значит пишем: тридцать градусов плюс триста шестьдесят умножить на эн, где эн любое целое число. Ноль даёт тридцать, единица триста девяносто, минус единица минус триста тридцать. | Hamma yozuv butun sondagi aylanaga farq qiladi. Demak yozamiz: o'ttiz gradus qo'shilgan uch yuz oltmish karra en, bu yerda en har qanday butun son. Nol o'ttizni beradi, bir uch yuz to'qsonni, minus bir minus uch yuz o'ttizni. | All the readings differ by a whole number of turns. So we write: thirty degrees plus three hundred sixty times n, where n is any whole number. Zero gives thirty, one gives three hundred ninety, minus one gives minus three hundred thirty. | 
| `audio.work` | Теперь сам. Поставь точку туда, куда приведёт эн, равное минус единице. | Endi o'zingiz. En minus birga teng bo'lganda keladigan joyga nuqta qo'ying. | Now you. Place the point where n equal to minus one leads. |
| `work.prompt` | Куда приведёт n = −1? | n = −1 qayerga olib keladi? | Where does n = −1 lead? |
| `work.ok` | Туда же. Минус триста тридцать это тридцать минус полный оборот, точка та же самая. | O'sha yerga. Minus uch yuz o'ttiz bu o'ttizdan to'liq aylana ayirilgani, nuqta o'sha. | The same place. Minus three hundred thirty is thirty minus a full turn, the same point. |
| `work.hint.1` | Отними от тридцати один полный оборот. | O'ttizdan bitta to'liq aylanani ayiring. | Subtract one full turn from thirty. |
| `work.hint.2` | Получится минус триста тридцать, а точка не сдвинется. | Minus uch yuz o'ttiz chiqadi, nuqta esa qimirlamaydi. | You get minus three hundred thirty, and the point does not move. |
| `work.hint.3` | Тридцать градусов. | O'ttiz gradus. | Thirty degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 6 · `explain4` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Когда корней нет совсем | Ildiz umuman bo'lmaganda | When there are no roots at all |
| `show.1.1` | высота два | balandlik ikki | the height is two |
| `show.1.2` | прямая выше окружности | to'g'ri chiziq aylanadan yuqorida | the line is above the circle |
| `show.2.1` | общих точек нет | umumiy nuqta yo'q | no common points |
| `show.2.2` | значит нет и корней | demak ildiz ham yo'q | so there are no roots |
| `audio.mount` | Возьмём уравнение синус икс равен двум. Прямая стоит выше окружности. | Sinus iks ikkiga teng tenglamani olaylik. To'g'ri chiziq aylanadan yuqorida turadi. | Take the equation sine x equals two. The line stands above the circle. |
| `audio.miss*` | Она проходит мимо и ни разу не задевает круг. Общей точки нет, значит нет и угла, а значит уравнение решений не имеет. Это видно прямой, а не выучено словами. | U yonidan o'tadi va aylanaga bir marta ham tegmaydi. Umumiy nuqta yo'q, demak burchak ham yo'q, ya'ni tenglamaning yechimi yo'q. Buni to'g'ri chiziq ko'rsatadi, yodlab olinmaydi. | It passes by and never touches the circle. There is no common point, so there is no angle, and the equation has no solutions. The line shows it, it is not memorised. |
| `audio.work` | Посчитай сам. Сколько корней у уравнения синус икс равен двум? | O'zingiz hisoblang. Sinus iks ikkiga teng tenglamaning nechta ildizi bor? | Compute it yourself. How many roots does the equation sine x equals two have? |
| `work.prompt` | Сколько корней у sin x = 2? | sin x = 2 ning nechta ildizi bor? | How many roots does sin x = 2 have? |
| `work.ok` | Ноль. Высота больше единицы на окружности не встречается ни при каком угле. | Nol. Birdan katta balandlik aylanada hech qanday burchakda uchramaydi. | Zero. A height greater than one never occurs on the circle at any angle. |
| `work.hint.1` | Посмотри, задела ли прямая окружность. | To'g'ri chiziq aylanaga tegdimi, qarang. | Look whether the line touched the circle. |
| `work.hint.2` | Она прошла выше, общих точек нет. | U yuqoridan o'tdi, umumiy nuqta yo'q. | It passed above, there are no common points. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 7 · `explain5` · ответ `number` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | У косинуса прямая вертикальная | Kosinusda to'g'ri chiziq vertikal | For the cosine the line is vertical |
| `show.1.1` | задан сдвиг, а не высота | balandlik emas, siljish berilgan | the shift is given, not the height |
| `show.1.2` | прямая идёт вертикально | to'g'ri chiziq vertikal ketadi | the line runs vertically |
| `show.2.1` | точек снова две | nuqta yana ikkita | two points again |
| `show.2.2` | они одна над другой | ular bir-birining ustida | one above the other |
| `audio.mount` | В уравнении с косинусом задан сдвиг, поэтому прямая вертикальная. | Kosinusli tenglamada siljish berilgan, shuning uchun to'g'ri chiziq vertikal. | In an equation with the cosine the shift is given, so the line is vertical. |
| `audio.cut*` | Она тоже задевает окружность дважды, только точки теперь одна над другой. Верхняя и нижняя, шестьдесят и триста градусов. | U ham aylanani ikki marta kesadi, faqat nuqtalar endi bir-birining ustida. Yuqoridagi va pastdagi, oltmish va uch yuz gradus. | It also meets the circle twice, only now the points are one above the other. The upper and the lower, sixty and three hundred degrees. |
| `audio.work` | Посчитай сам. Сколько корней у уравнения косинус икс равен одной второй на промежутке от нуля до трёхсот шестидесяти? | O'zingiz hisoblang. Kosinus iks bir ikkidanga teng tenglamaning noldan uch yuz oltmishgacha oraliqda nechta ildizi bor? | Compute it yourself. How many roots does cosine x equals one half have between zero and three hundred sixty? |
| `work.prompt` | Сколько корней у cos x = 1/2 от 0 до 360°? | cos x = 1/2 ning 0 dan 360° gacha nechta ildizi bor? | How many roots does cos x = 1/2 have from 0 to 360°? |
| `work.ok` | Два. Один оборот, две точки: шестьдесят и триста градусов. | Ikkita. Bitta aylana, ikkita nuqta: oltmish va uch yuz gradus. | Two. One turn, two points: sixty and three hundred degrees. |
| `work.hint.1` | Посчитай точки пересечения на одном обороте. | Bitta aylanadagi kesishish nuqtalarini sanang. | Count the intersection points on one turn. |
| `work.hint.2` | Вертикальная прямая задевает окружность сверху и снизу. | Vertikal to'g'ri chiziq aylanani yuqoridan va pastdan kesadi. | The vertical line meets the circle above and below. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Корни идут сериями | Ildizlar seriya bilan ketadi | Roots come in series |
| `probe.question` | Зачем в ответе буква `n`? | Javobda `n` harfi nima uchun? | Why is there a letter `n` in the answer? |
| `probe.a` [верно] | она перечисляет все обороты сразу | u hamma aylanani birdan sanaydi | it lists every turn at once |
| `probe.b` | она обозначает номер корня | u ildizning raqamini bildiradi | it marks the number of the root |
| `probe.b.hint` | Корней бесконечно много, и `n` считает не их по порядку, а обороты. | Ildiz cheksiz ko'p, `n` esa ularni emas, aylanalarni sanaydi. | There are infinitely many roots, and `n` counts turns, not roots in order. |
| `rule.lawLabel` | Серия | Seriya | The series |
| `rule.lines.1` | Каждая точка на окружности даёт не один корень, а серию: к углу можно прибавить любое целое число оборотов. | Aylanadagi har nuqta bitta ildiz emas, seriya beradi: burchakka istalgan butun sondagi aylanani qo'shish mumkin. | Each point on the circle gives not one root but a series: any whole number of turns may be added to the angle. |
| `rule.lines.2` | Точек две, значит и серий две, и в ответ идут обе. | Nuqta ikkita, demak seriya ham ikkita, va javobga ikkalasi kiradi. | There are two points, so two series, and both go into the answer. |
| `rule.lines.3` | Если прямая прошла мимо окружности, корней нет вовсе. | To'g'ri chiziq aylananing yonidan o'tsa, ildiz umuman yo'q. | If the line missed the circle, there are no roots at all. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Серия строится ещё раз, и правило открывается рядом. Буква эн это номер оборота, и она нужна, чтобы одна строка заменила бесконечный список. | Seriya yana bir bor quriladi, va qoida yonida ochiladi. En harfi aylana raqami, va u bitta qator cheksiz ro'yxatni almashtirishi uchun kerak. | The series is built once more, and the rule opens beside it. The letter n is the number of the turn, and it is needed so that one line replaces an endless list. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `x = 30° + 360°n,   x = 150° + 360°n` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `odin-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Уравнение и его серия | Tenglama va uning seriyasi | The equation and its series |
| `match.prompt` | Соедини уравнение с его серией. | Tenglamani o'z seriyasi bilan birlashtiring. | Match the equation with its series. |
| `match.ok` | В этих четырёх серия одна: прямая либо касается края, либо две точки складываются в один шаг. | Bu to'rttasida seriya bitta: to'g'ri chiziq yo chetiga tegadi, yo ikki nuqta bitta qadamga yig'iladi. | In these four the series is single: the line either touches the edge or the two points fold into one step. |
| `audio.mount` | Четыре уравнения и четыре серии. Соедини их. | To'rt tenglama va to'rt seriya. Ularni birlashtiring. | Four equations and four series. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `sin x = 1` · `sin x = 0` · `cos x = 1` · `cos x = −1` |
| `match.a` | `90° + 360°n` |
| `match.b` | `180°n` |
| `match.c` | `360°n` |
| `match.d` | `180° + 360°n` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Собери ответ по шагам | Javobni qadam bilan yig'ing | Assemble the answer step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | проводим прямую по высоте | balandlik bo'ylab to'g'ri chiziq o'tkazamiz | we draw the line at the height |
| `order.s2` | отмечаем обе точки | ikkala nuqtani belgilaymiz | we mark both points |
| `order.s3` | к каждой прибавляем обороты | har biriga aylanalarni qo'shamiz | we add turns to each |
| `order.s4` | пишем две серии | ikkita seriya yozamiz | we write two series |
| `order.ok` | Порядок такой всегда. Если пропустить второй шаг, половина корней исчезнет из ответа незамеченной. | Tartib doim shunday. Ikkinchi qadam tashlab ketilsa, ildizlarning yarmi javobdan sezilmay yo'qoladi. | The order is always this. Skipping the second step makes half the roots vanish unnoticed. |
| `order.bad` | Сначала прямая, потом обе точки, потом обороты, и только потом ответ. | Avval to'g'ri chiziq, keyin ikkala nuqta, keyin aylanalar, keyingina javob. | First the line, then both points, then the turns, and only then the answer. |
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
| `task.ok` | Триста девяносто. Единица в серии означает один полный оборот сверх тридцати. | Uch yuz to'qson. Seriyadagi bir o'ttiz ustiga bitta to'liq aylana degani. | Three hundred ninety. A one in the series means one full turn on top of thirty. |
| `task.hint.1` | Подставь единицу вместо буквы. | Harf o'rniga birni qo'ying. | Put one in place of the letter. |
| `task.hint.2` | Тридцать плюс триста шестьдесят. | O'ttiz qo'shilgan uch yuz oltmish. | Thirty plus three hundred sixty. |
| `task.hint.3` | Триста девяносто. | Uch yuz to'qson. | Three hundred ninety. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой корень меньше? | Qaysi ildiz kichikroq? | Which root is smaller? |
| `order.ok` | Ты подставил номера оборотов и сравнил числа, а не записи. | Siz aylana raqamlarini qo'ydingiz va yozuvlarni emas, sonlarni solishtirdingiz. | You substituted the turn numbers and compared numbers, not readings. |
| `order.bad` | Подставь в каждую запись её номер оборота и сравни то, что получилось. | Har yozuvga aylana raqamini qo'ying va chiqqanini solishtiring. | Put the turn number into each reading and compare the results. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `x = 30° + 360°n,   n = 1   →   x = ?` |
| `task.answer` | `390` |
| `order.items` | `n = −1` · `n = 0` · `n = 1` · `n = 2` |
| `order.answer` | `n = −1  n = 0  n = 1  n = 2` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

Первая точка найдена верно. Ответ обрывается на ней: вторая серия потеряна.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неполный. Где? | Javob to'liq emas. Qayerda? | The answer is incomplete. Where? |
| `hint.r1` | Эта строка верна: высота действительно одна вторая. | Bu qator to'g'ri: balandlik haqiqatan bir ikkidan. | This line is right: the height really is one half. |
| `hint.r2` | Эта строка тоже верна: тридцать градусов настоящий корень. | Bu qator ham to'g'ri: o'ttiz gradus haqiqiy ildiz. | This line is right too: thirty degrees is a real root. |
| `hint.r4` | Эта строка повторяет ошибку предыдущей. Первая неверная строка выше. | Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida. | This line repeats the error of the previous one. The first wrong line is above. |
| `proof` | Вторая точка потерялась. | Ikkinchi nuqta yo'qoldi. | The second point was lost. |
| `entry.prompt` | Сколько серий в полном ответе? | To'liq javobda nechta seriya bor? | How many series are in the full answer? |
| `entry.ok` | Две. Точек пересечения две, и каждая даёт свою серию. | Ikkita. Kesishish nuqtasi ikkita, va har biri o'z seriyasini beradi. | Two. There are two intersection points, and each gives its own series. |
| `entry.hint.1` | Посчитай точки, которые даёт прямая. | To'g'ri chiziq beradigan nuqtalarni sanang. | Count the points the line gives. |
| `entry.hint.2` | Каждая точка даёт свою серию. | Har nuqta o'z seriyasini beradi. | Each point gives its own series. |
| `entry.hint.3` | Две. | Ikkita. | Two. |
| `audio.mount` | Задача. Решить уравнение синус икс равен одной второй. | Masala. Sinus iks bir ikkidanga teng tenglamani yechish. | A task. Solve the equation sine x equals one half. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `sin x = 1/2` |
| `row.r2` | `x = 30°` |
| `row.r3` | `x = 30° + 360°n` |
| `row.r4` | `x = 30°,  390°,  750°` |
| `answerId` | `r3` |
| `entry.answer` | `2` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По корню назвать серию | Ildizdan seriyani aytish | From a root back to its series |
| `place.prompt` | Поставь точку на 150 градусов. | Nuqtani 150 gradusga qo'ying. | Place the point at 150 degrees. |
| `place.ok` | Это вторая точка. Теперь посмотрим, какие ещё углы приводят сюда же. | Bu ikkinchi nuqta. Endi bu yerga yana qaysi burchaklar olib kelishini ko'ramiz. | This is the second point. Now let us see which other angles lead here. |
| `place.wrong` | Сто пятьдесят это выше горизонтальной оси и левее вертикальной. | Yuz ellik gorizontal o'qdan yuqorida va vertikal o'qdan chapda. | One hundred fifty is above the horizontal axis and left of the vertical one. |
| `multi.prompt` | Отметь все записи из серии этой точки. | Shu nuqtaning seriyasidagi hamma yozuvni belgilang. | Mark every reading from the series of this point. |
| `multi.title` | Какие записи дают эту же точку? | Qaysi yozuvlar aynan shu nuqtani beradi? | Which readings give this same point? |
| `multi.d.hint` | Тридцать это первая точка, а не эта. | O'ttiz bu birinchi nuqta, bu emas. | Thirty is the first point, not this one. |
| `multi.e.hint` | Здесь прибавлена половина оборота, точка окажется напротив. | Bu yerda yarim aylana qo'shilgan, nuqta qarshi tomonda bo'ladi. | Here half a turn was added, the point ends up opposite. |
| `multi.ok` | Три из пяти. Серия это одна точка и все обороты вокруг неё. | Beshtadan uchtasi. Seriya bu bitta nuqta va uning atrofidagi hamma aylana. | Three out of five. A series is one point and all the turns around it. |
| `audio.mount` | Теперь обратная задача. Дана точка, а нужны все записи её серии. | Endi teskari masala. Nuqta berilgan, seriyasining hamma yozuvi kerak. | Now the inverse task. A point is given, and all the readings of its series are needed. |
| `audio.work` | Поставь точку, потом отметишь все записи, которые ведут сюда же. | Nuqtani qo'ying, keyin shu yerga olib keladigan hamma yozuvni belgilaysiz. | Place the point, then you will mark every reading that leads here. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `150°` |
| `place.step` | `150° + 360°n` |
| `multi.a` [верно] | `510°` |
| `multi.b` [верно] | `−210°` |
| `multi.c` [верно] | `870°` |
| `multi.d` | `30°` |
| `multi.e` | `330°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Сколько корней у sin x = 1/2 на одном обороте? | Bitta aylanada sin x = 1/2 ning nechta ildizi bor? | How many roots does sin x = 1/2 have on one turn? |
| `q1.a` [верно] | два | ikkita | two |
| `q1.b` | один | bitta | one |
| `q1.b.hint` | Прямая задевает окружность дважды, значит корней два. | To'g'ri chiziq aylanani ikki marta kesadi, demak ildiz ikkita. | The line meets the circle twice, so there are two roots. |
| `q1.c` | ни одного | hech qaysi | none |
| `q1.c.hint` | Ни одного бывает, только если прямая прошла мимо. | Hech qaysi faqat to'g'ri chiziq yonidan o'tganda bo'ladi. | None happens only if the line missed the circle. |
| `q1.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q1.d.hint` | На одном обороте их два, а бесконечно много на всей прямой. | Bitta aylanada ikkita, cheksiz ko'p esa butun sonlar o'qida. | On one turn there are two, infinitely many over all numbers. |
| `q2.prompt` | Что означает буква `n` в ответе? | Javobdagi `n` harfi nimani bildiradi? | What does the letter `n` mean in the answer? |
| `q2.a` [верно] | любое целое число оборотов | istalgan butun sondagi aylana | any whole number of turns |
| `q2.b` | номер корня по порядку | ildizning tartib raqami | the position number of the root |
| `q2.b.hint` | По порядку их не пронумеровать: корней бесконечно много. | Ularni tartib bilan raqamlab bo'lmaydi: ildiz cheksiz ko'p. | They cannot be numbered in order: there are infinitely many roots. |
| `q2.c` | любое число градусов | har qanday gradus soni | any number of degrees |
| `q2.c.hint` | Прибавлять можно только целые обороты, иначе точка сдвинется. | Faqat butun aylanalarni qo'shish mumkin, aks holda nuqta qimirlaydi. | Only whole turns may be added, otherwise the point moves. |
| `q2.d` | всегда единицу | doim birni | always one |
| `q2.d.hint` | Единица это только один из случаев. | Bir bu holatlardan faqat bittasi. | One is just a single case. |
| `q3.prompt` | Сколько корней у sin x = 2? | sin x = 2 ning nechta ildizi bor? | How many roots does sin x = 2 have? |
| `q3.a` [верно] | ни одного | hech qaysi | none |
| `q3.a.ok` | Да. Прямая прошла выше окружности. | Ha. To'g'ri chiziq aylanadan yuqoridan o'tdi. | Yes. The line passed above the circle. |
| `q3.b` | бесконечно много | cheksiz ko'p | infinitely many |
| `q3.b.hint` | Общей точки нет ни одной, значит и корня ни одного. | Umumiy nuqta bitta ham yo'q, demak ildiz ham yo'q. | There is not a single common point, so not a single root. |
| `q4.prompt` | Сколько серий в полном ответе уравнения с синусом? | Sinusli tenglamaning to'liq javobida nechta seriya bor? | How many series are in the full answer of a sine equation? |
| `q4.a` [верно] | две | ikkita | two |
| `q4.b` | одна | bitta | one |
| `q4.b.hint` | Одна серия покрывает только одну из двух точек. | Bitta seriya ikki nuqtadan faqat bittasini qoplaydi. | One series covers only one of the two points. |
| `q4.c` | четыре | to'rtta | four |
| `q4.c.hint` | Точек пересечения две, значит и серий две. | Kesishish nuqtasi ikkita, demak seriya ham ikkita. | There are two intersection points, so two series. |
| `q4.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q4.d.hint` | Корней бесконечно много, а серий, которые их описывают, две. | Ildiz cheksiz ko'p, ularni tavsiflaydigan seriya esa ikkita. | There are infinitely many roots, but two series describing them. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `2` |
| `q2.done` | `+ 360°n` |
| `q3.done` | `0` |
| `q4.done` | `2` |
| `angles` | `30°` · `150°` · `390°` · `210°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Нахожу обе точки, а не одну | Bitta emas, ikkala nuqtani topaman | I find both points, not one |
| `can.2` | Записываю серию с буквой | Seriyani harf bilan yozaman | I write the series with a letter |
| `can.3` | Вижу, когда корней нет | Ildiz yo'qligini ko'raman | I see when there are no roots |
| `can.4` | Помню, что у косинуса прямая вертикальная | Kosinusda to'g'ri chiziq vertikal ekanini eslayman | I remember the cosine line is vertical |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: сколько серий в полном ответе. | Bitta joy takrorlashni talab qiladi: to'liq javobda nechta seriya. | One place needs review: how many series are in the full answer. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Урок 10: две серии сворачиваются в одну запись, и оттуда берётся знак минус в степени. | 10-dars: ikki seriya bitta yozuvga yig'iladi, va darajadagi minus o'sha yerdan chiqadi. | Lesson 10: the two series fold into one reading, and that is where the minus in the power comes from. |
| `lifehack` | Нашёл один корень — ищи второй. Он всегда есть, кроме случая, когда прямая касается края. | Bitta ildizni topdingizmi, ikkinchisini qidiring. U doim bor, faqat to'g'ri chiziq chetiga tekkan holdan tashqari. | Found one root, look for the second. It is always there, except when the line touches the edge. |
| `sheetTitle` | Простейшие уравнения · шпаргалка | Sodda tenglamalar · shpargalka | Simplest equations · cheat sheet |
| `sheetSrc` | 10 класс · урок 9 | 10-sinf · 9-dars | Grade 10 · lesson 9 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Корней бесконечно много, и записываются они двумя сериями, по одной на каждую точку. | Ildiz cheksiz ko'p, va ular ikkita seriya bilan yoziladi, har nuqtaga bittadan. | There are infinitely many roots, and they are written as two series, one for each point. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `x = 30°,  150°` |
| `hook.b` | `x = 30° + 360°n` |
| `proved` | `x = 30° + 360°n` |
| `law` | `x = 30° + 360°n,   x = 150° + 360°n` |
| `sheet.1` | `sin x = 1/2` |
| `sheet.2` | `x = 30° + 360°n` |
| `sheet.3` | `x = 150° + 360°n` |
| `sheet.4` | `−1 ≤ a ≤ 1` |
| `sheet.5` | `x = ± arccos a + 360°n` |
