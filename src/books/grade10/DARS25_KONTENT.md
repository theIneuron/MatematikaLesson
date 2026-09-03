# Урок 25 — Системы уравнений · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS24_KONTENT.md`.

Скелет: в чате 27.08.2026. Опора в учебнике: алгебра 2022, стр. 70–73
(`RATSIONAL TENGLAMALAR SISTEMASI`), стр. 87–94 (`IRRATSIONAL TENGLAMALAR SISTEMASI`),
стр. 119–122 (`KO'RSATKICHLI VA LOGARIFMIK TENGLAMALAR SISTEMASI`).

**Зачем урок.** Строки плана 37 и 38 называют системы, но в уроках 21, 22 и 24 слово
«система» стоит только в заголовке: разбора не было. Тема одна — **пара чисел обращает в
верное равенство обе строки** — а примеры четырёх видов: рациональные, иррациональные,
показательные, логарифмические.

**Главное решение урока.** Запись на экране идёт **книжной формой**: фигурная скобка,
строки одна под другой, каждый шаг своей строкой как в тетради, ответ парой в скобках
(`Ответ: (−3; −2)`). Условие допустимых значений выписывается **над** решением, как в
учебнике. Прибор 2 именно так и работает — кнопки «сразу ответ» у него нет.

**Порядок экранов держит одну мысль.** Сначала пара проверяется в двух строках (3, 4),
потом то же показывается прямыми (5), потом два метода — подстановка и сложение (3, 6), и
только затем допустимые значения (7). Ловушка (12) стоит после всего: там все шаги верны, а
ответ неверен.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Названия
методов взяты из учебника дословно: `o'rniga qo'yish usuli`, `algebraik qo'shish`,
`o'zgaruvchini almashtirish`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | СИСТЕМА | SISTEMA | THE SYSTEM |
| `title` | Пара найдётся или не найдётся | Juftlik topiladi yoki topilmaydi | A pair will be found, or none exists |
| `row.a.name` | пара есть, и она одна | juftlik bor, u bitta | there is one pair |
| `row.b.name` | подходящей пары нет | mos juftlik yo'q | no pair fits |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим обе строки. | Javobingiz yozib olindi. Endi ikkala satrni tekshiramiz. | Your answer is saved. Now we will check both rows. |
| `audio.mount` | Две строки, и в каждой те же две буквы, икс и игрек. | Ikki satr, va har birida o'sha ikki harf, iks va igrek. | Two rows, and each has the same two letters, x and y. |
| `audio.r1` | Первая запись говорит, что подходящая пара одна. Четыре и минус один обращает первую строку в верное равенство. | Birinchi yozuv mos juftlik bitta deydi. To'rt va minus bir birinchi satrni to'g'ri tenglikka aylantiradi. | The first reading says there is exactly one pair. Four and minus one turns the first row into a true equality. |
| `audio.r2` | Вторая говорит, что подходящей пары нет вовсе, хотя каждая строка по отдельности решений имеет сколько угодно. | Ikkinchisi mos juftlik umuman yo'q deydi, holbuki har bir satr alohida qancha xohlasangiz yechim beradi. | The second says no pair fits at all, even though each row on its own has as many solutions as you like. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `x − 2y = 6;   2x − 4y = −8` |
| `row.a.value` | `(4; −1)` |
| `row.b.value` | `∅` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | THE BASICS |
| `title` | Три коротких перед началом | Boshlashdan oldin uchta qisqa savol | Three short ones before we start |
| `q1.prompt` | Подставь минус три и минус два в сумму икс плюс игрек. Что получится? | Minus uch va minus ikkini iks qo'shuv igrek yig'indisiga qo'ying. Nima chiqadi? | Substitute minus three and minus two into the sum x plus y. What comes out? |
| `q1.a` [верно] | −5 | −5 | −5 |
| `q1.b` | 5 | 5 | 5 |
| `q1.b.hint` | Оба числа отрицательные, значит и сумма отрицательная. | Ikkala son ham manfiy, demak yig'indi ham manfiy. | Both numbers are negative, so the sum is negative too. |
| `q1.c` | −1 | −1 | −1 |
| `q1.c.hint` | Минус один вышло бы при вычитании, а здесь стоит плюс. | Minus bir ayirishda chiqardi, bu yerda esa qo'shuv turadi. | Minus one would come from subtraction, but there is a plus here. |
| `q1.d` | 1 | 1 | 1 |
| `q1.d.hint` | Знак потерян: сумма двух отрицательных положительной не бывает. | Ishora yo'qolgan: ikki manfiy sonning yig'indisi musbat bo'lmaydi. | A sign is lost: the sum of two negatives is never positive. |
| `q2.prompt` | В равенстве икс равно восемь игрек минус один: при каком игрек выйдет икс равно пятнадцати? | Iks teng sakkiz igrek minus bir tenglikda: qanday igrekda iks o'n beshga teng bo'ladi? | In x equals eight y minus one: for which y does x come out fifteen? |
| `q2.a` [верно] | 2 | 2 | 2 |
| `q2.b` | 1 | 1 | 1 |
| `q2.b.hint` | При единице выйдет семь, а нужно пятнадцать. | Birda yetti chiqadi, kerak bo'lgani esa o'n besh. | With one it gives seven, but fifteen is needed. |
| `q2.c` | 14 | 14 | 14 |
| `q2.c.hint` | Четырнадцать это уже почти сам икс, а множителя восемь никто не убирал. | O'n to'rt bu deyarli iksning o'zi, sakkiz ko'paytuvchini esa hech kim olib tashlamadi. | Fourteen is nearly x itself, and nobody removed the factor eight. |
| `q2.d` | 16 | 16 | 16 |
| `q2.d.hint` | Единицу надо прибавить к пятнадцати, а потом делить на восемь. | Birni o'n beshga qo'shish, keyin sakkizga bo'lish kerak. | Add one to fifteen first, and only then divide by eight. |
| `q3.prompt` | При каких икс определён корень из икс? | Iksning qanday qiymatlarida iksdan ildiz aniqlangan? | For which x is the square root of x defined? |
| `q3.a` [верно] | икс больше или равен нулю | iks noldan katta yoki teng | x is greater than or equal to zero |
| `q3.b` | икс больше нуля | iks noldan katta | x is greater than zero |
| `q3.b.hint` | Корень из нуля есть, и он равен нулю. | Noldan ildiz bor, va u nolga teng. | The root of zero exists, and it equals zero. |
| `q3.c` | любой икс | har qanday iks | any x |
| `q3.c.hint` | Под корнем отрицательного числа быть не может. | Ildiz ostida manfiy son bo'lishi mumkin emas. | A negative number cannot stand under the root. |
| `q3.d` | икс меньше нуля | iks noldan kichik | x is less than zero |
| `q3.d.hint` | Условие перевёрнуто: закрашена правая половина прямой, не левая. | Shart teskari: o'qning o'ng yarmi bo'yalgan, chapi emas. | The condition is upside down: the right half of the line is shaded, not the left. |
| `audio.mount` | Три вопроса на то, что уже знаешь. Они понадобятся через минуту. | Siz allaqachon bilgan narsalar uchun uchta savol. Ular bir daqiqadan keyin kerak bo'ladi. | Three questions on what you already know. They will be needed in a minute. |
| `q1.done` | Пара из двух чисел подставляется целиком, оба числа сразу. | Ikki sondan iborat juftlik butunlay, ikkala son birdan qo'yiladi. | A pair of two numbers is substituted whole, both numbers at once. |
| `q2.done` | Это и есть подстановка: одна буква выражена через другую. | Bu o'rniga qo'yishning o'zi: bir harf boshqasi orqali ifodalangan. | This is substitution itself: one letter expressed through the other. |
| `q3.done` | Условие допустимых значений понадобится на седьмом экране. | Ruxsat etilgan qiymatlar sharti yettinchi ekranda kerak bo'ladi. | The condition on allowed values will be needed on screen seven. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `x − 2y = 6 · 2x − 4y = −8` |

---

## Экран 3 · `explain1` · ответ `number` · тег `podstanovka-bez-vozvrata`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПОДСТАНОВКА | O'RNIGA QO'YISH | SUBSTITUTION |
| `title` | Одна буква через другую | Bir harf boshqasi orqali | One letter through the other |
| `show.1.1` | Шаг 1. Из первой строки выражаем игрек | 1-qadam. Birinchi satrdan igrekni ifodalaymiz | Step 1. Express y from the first row |
| `show.1.2` | одна буква записана через другую | bir harf boshqasi orqali yozildi | one letter is written through the other |
| `show.1.3` | пара ещё не найдена, найдена связь | juftlik hali topilgani yo'q, bog'lanish topildi | the pair is not found yet, the link is |
| `show.2.1` | Шаг 2. Подставляем во вторую строку | 2-qadam. Ikkinchi satrga qo'yamiz | Step 2. Substitute into the second row |
| `show.2.2` | буква осталась одна, и это обычное уравнение | harf bitta qoldi, va bu oddiy tenglama | one letter is left, and this is an ordinary equation |
| `show.2.3` | икс равен минус трём | iks minus uchga teng | x equals minus three |
| `audio.mount` | Слева система, справа запись решения. Каждый шаг занимает свою строку, как в тетради. | Chapda sistema, o'ngda yechim yozuvi. Har bir qadam daftardagidek o'z satrini oladi. | On the left the system, on the right the record of the solution. Each step takes its own line, as in a notebook. |
| `audio.side*` | Смотри, что делает подстановка. Вторая строка была с двумя буквами, а стала с одной. | O'rniga qo'yish nima qilishini kuzatib turing. Ikkinchi satr ikki harfli edi, bir harfli bo'ldi. | Watch what substitution does. The second row had two letters, and now it has one. |
| `audio.work` | Икс уже найден. Но ответ системы это пара, а не одно число. | Iks topildi. Lekin sistemaning javobi juftlik, bitta son emas. | x is found. But the answer of a system is a pair, not a single number. |
| `work.prompt` | Икс равен минус трём. Запиши игрек. | Iks minus uchga teng. Igrekni yozing. | x equals minus three. Write down y. |
| `work.ok` | Верно. Ответ записывается парой в скобках, минус три и минус два. | To'g'ri. Javob qavs ichida juftlik bo'lib yoziladi, minus uch va minus ikki. | Correct. The answer is written as a pair in brackets, minus three and minus two. |
| `work.hint.1` | Вернись к строке, где игрек выражен через икс. | Igrek iks orqali ifodalangan satrga qaytib qarang. | Go back to the row where y is expressed through x. |
| `work.hint.2` | Подставь минус три вместо икс в это выражение. | Bu ifodada iks o'rniga minus uchni qo'ying. | Substitute minus three for x in that expression. |
| `work.hint.3` | Минус пять минус минус три это минус пять плюс три. | Minus besh ayirish minus uch bu minus besh qo'shuv uch. | Minus five minus minus three is minus five plus three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `x + y = −5 · 3x − y = −7` |
| `frame.1` | `y = −5 − x` |
| `frame.2` | `3x + 5 + x = −7   ⇒   4x = −12` |
| `expr` | `x + y = −5;   3x − y = −7` |
| `work.expr` | `y = −5 − x,   x = −3` |
| `work.answer` | `−2` |

---

## Экран 4 · `explain2` · ответ `order` · тег `sistema-ne-para`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРКА | TEKSHIRUV | THE CHECK |
| `title` | Пара, а не число, и порядок не свободен | Juftlik, son emas, va tartib erkin emas | A pair, not a number, and the order is not free |
| `show.1.1` | Пара минус три и минус два | Minus uch va minus ikki juftligi | The pair minus three and minus two |
| `show.1.2` | первая строка обращается в верное равенство | birinchi satr to'g'ri tenglikka aylanadi | the first row turns into a true equality |
| `show.1.3` | вторая тоже, значит это ответ | ikkinchisi ham, demak bu javob | the second one too, so this is the answer |
| `show.2.1` | Та же пара, числа местами | O'sha juftlik, sonlar joyi almashgan | The same pair, numbers swapped |
| `show.2.2` | первая строка ещё верна, а вторая даёт минус три вместо минус семи | birinchi satr hali to'g'ri, ikkinchisi esa minus yetti o'rniga minus uch beradi | the first row still holds, but the second gives minus three instead of minus seven |
| `show.2.3` | значит порядок в паре не свободен | demak juftlikdagi tartib erkin emas | so the order inside a pair is not free |
| `order.prompt` | Расставь шаги проверки пары по порядку | Juftlikni tekshirish qadamlarini tartib bilan joylashtiring | Put the steps of checking a pair in order |
| `order.s1` | подставить пару в первую строку | juftlikni birinchi satrga qo'yish | put the pair into the first row |
| `order.s2` | сравнить с правой частью | o'ng tomoni bilan solishtirish | compare with the right side |
| `order.s3` | повторить со второй строкой | ikkinchi satr bilan takrorlash | repeat with the second row |
| `order.ok` | Верно. Пара годится, только если верны обе строки. | To'g'ri. Juftlik faqat ikkala satr to'g'ri bo'lganda yaraydi. | Correct. A pair fits only when both rows come out true. |
| `order.bad` | Порядок другой. Пара подставляется целиком в каждую строку по очереди. | Tartib boshqacha. Juftlik har bir satrga navbat bilan butunlay qo'yiladi. | The order is different. The pair is substituted whole into each row in turn. |
| `audio.mount` | Ответ системы это пара чисел. Первое число всегда стоит за икс, второе за игрек. | Sistemaning javobi sonlar juftligi. Birinchi son doim iks uchun, ikkinchisi igrek uchun turadi. | The answer of a system is a pair of numbers. The first number always stands for x, the second for y. |
| `audio.two*` | Одна и та же пара, а числа местами. Первая строка это выдержала, потому что в ней сумма. Смотри на вторую. | Bitta juftlik, sonlar esa joyi almashgan. Birinchi satr buni ko'tardi, chunki unda yig'indi. Ikkinchisiga qarang. | The same pair, numbers swapped. The first row survived it, because it is a sum. Watch the second one. |
| `audio.work` | Проверка пары идёт в четыре шага, и порядок здесь важен. | Juftlikni tekshirish to'rt qadamda boradi, va tartib bu yerda muhim. | Checking a pair takes four steps, and the order matters here. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `x + y = −5 · 3x − y = −7` |
| `frame.1` | `(−3; −2):   −5 = −5;   −7 = −7` |
| `frame.2` | `(−2; −3):   −5 = −5;   −3 ≠ −7` |
| `expr` | `x + y = −5;   3x − y = −7` |
| `order.mark` | `(−3; −2)` |

---

## Экран 5 · `explain3` · ответ `number` · тег `sistema-bez-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДВЕ ПРЯМЫЕ | IKKI TO'G'RI CHIZIQ | TWO LINES |
| `title` | Та же система, только чертежом | O'sha sistema, faqat chizma bilan | The same system, drawn |
| `show.1.1` | Каждая строка это прямая на плоскости | Har bir satr tekislikdagi to'g'ri chiziq | Each row is a line on the plane |
| `show.1.2` | решение системы это общая точка прямых | sistemaning yechimi chiziqlarning umumiy nuqtasi | a solution of the system is a common point of the lines |
| `show.1.3` | первая прямая опускается на три вниз | birinchi chiziq uch pastga tushadi | the first line sits three lower |
| `show.2.1` | Наклон у обеих одинаковый | Ikkalasining og'ishi bir xil | The slope of both is the same |
| `show.2.2` | вторая прямая поднята на два вверх | ikkinchi chiziq ikki tepaga ko'tarilgan | the second line is lifted two higher |
| `show.2.3` | прямые идут рядом и не встречаются | chiziqlar yonma-yon boradi va uchrashmaydi | the lines run alongside and never meet |
| `audio.mount` | Одна и та же система теперь стоит чертежом. Каждая строка это прямая. | O'sha sistema endi chizma bo'lib turadi. Har bir satr to'g'ri chiziq. | The same system now stands as a drawing. Each row is a line. |
| `audio.flip*` | Наклон у прямых одинаковый, а высота разная. Смотри, что происходит при движении. | Chiziqlarning og'ishi bir xil, balandligi esa boshqa. Harakat vaqtida nima bo'lishini kuzatib turing. | The slopes are equal and the heights differ. Watch what happens as it moves. |
| `audio.work` | Общая точка это и есть пара, которая годится обеим строкам. | Umumiy nuqta bu ikkala satrga yaraydigan juftlikning o'zi. | A common point is exactly the pair that fits both rows. |
| `work.prompt` | Сколько общих точек у этих двух прямых? Запиши число. | Bu ikki chiziqning nechta umumiy nuqtasi bor? Sonni yozing. | How many common points do these two lines have? Write the number. |
| `work.ok` | Верно. Ни одной, поэтому и пары нет. Прогноз с первого экрана проверен. | To'g'ri. Birorta ham yo'q, shuning uchun juftlik ham yo'q. Birinchi ekrandagi taxmin tekshirildi. | Correct. None, and so there is no pair either. The guess from screen one is checked. |
| `work.hint.1` | Сравни наклоны: у обеих прямых он один и тот же. | Og'ishlarni solishtiring: ikkala chiziqda u bir xil. | Compare the slopes: both lines have the same one. |
| `work.hint.2` | Сравни высоты: минус три и плюс два, это разные уровни. | Balandliklarni solishtiring: minus uch va qo'shuv ikki, bular boshqa sathlar. | Compare the heights: minus three and plus two, different levels. |
| `work.hint.3` | Прямые с одним наклоном и разной высотой не встречаются нигде. | Og'ishi bir xil, balandligi boshqa chiziqlar hech qayerda uchrashmaydi. | Lines with equal slopes and different heights meet nowhere. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `y = 0,5x − 3;   y = 0,5x + 2` |
| `work.expr` | `x − 2y = 6;   2x − 4y = −8` |
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `slozhenie-bez-uravnivaniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | СЛОЖЕНИЕ | QO'SHISH | ADDITION |
| `title` | Сложить можно, но не сразу | Qo'shish mumkin, lekin darrov emas | Adding works, but not right away |
| `show.1.1` | Сложили строки как есть | Satrlarni borligicha qo'shdik | The rows were added as they are |
| `show.1.2` | обе буквы остались на месте | ikkala harf ham joyida qoldi | both letters stayed in place |
| `show.1.3` | работы стало не меньше, а больше | ish kamaymadi, ko'paydi | there is more work now, not less |
| `show.2.1` | Вторую строку умножили на два | Ikkinchi satrni ikkiga ko'paytirdik | The second row was multiplied by two |
| `show.2.2` | у игрек стали противоположные множители | igrekning ko'paytuvchilari qarama-qarshi bo'ldi | y got opposite factors |
| `show.2.3` | после сложения игрек ушёл сам | qo'shishdan keyin igrek o'zi ketdi | after adding, y left on its own |
| `audio.mount` | Второй метод из учебника это алгебраическое сложение. Строки складываются целиком. | Darslikdagi ikkinchi usul algebraik qo'shish. Satrlar butunlay qo'shiladi. | The second method from the textbook is algebraic addition. Whole rows are added. |
| `audio.plus*` | Сначала сложим как есть и посмотрим, что выйдет. | Avval borligicha qo'shamiz va nima chiqishini ko'ramiz. | First we add them as they are and see what comes out. |
| `audio.work` | Чтобы буква ушла, множители при ней должны быть противоположными. | Harf ketishi uchun uning oldidagi ko'paytuvchilar qarama-qarshi bo'lishi kerak. | For a letter to leave, its factors must be opposite. |
| `work.prompt` | Игрек ушёл, осталось семь икс равно четырнадцати. Запиши икс. | Igrek ketdi, yetti iks teng o'n to'rt qoldi. Iksni yozing. | y is gone, seven x equals fourteen is left. Write down x. |
| `work.ok` | Верно. Икс равен двум, а игрек тогда равен трём. Ответ два и три. | To'g'ri. Iks ikkiga teng, igrek esa uchga teng bo'ladi. Javob ikki va uch. | Correct. x equals two, and then y equals three. The answer is two and three. |
| `work.hint.1` | Четырнадцать надо разделить на семь. | O'n to'rtni yettiga bo'lish kerak. | Fourteen has to be divided by seven. |
| `work.hint.2` | Семь икс это семь множителей икс, а не икс с семёркой рядом. | Yetti iks bu iksning yetti ko'paytuvchisi, yonida yettisi bor iks emas. | Seven x means seven times x, not x with a seven beside it. |
| `work.hint.3` | Два умножить на семь даёт четырнадцать, значит икс равен двум. | Ikkini yettiga ko'paytirsa o'n to'rt chiqadi, demak iks ikkiga teng. | Two times seven gives fourteen, so x equals two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `x + 2y = 8 · 3x − y = 3` |
| `frame.1` | `4x + y = 11` |
| `frame.2` | `7x = 14` |
| `expr` | `x + 2y = 8;   3x − y = 3` |
| `work.expr` | `6x − 2y = 6   ⇒   7x = 14` |
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `sistema-odz`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДОПУСТИМЫЕ ЗНАЧЕНИЯ | RUXSAT ETILGAN QIYMATLAR | ALLOWED VALUES |
| `title` | Сначала полоса, потом решение | Avval polosa, keyin yechim | The band first, the solution after |
| `show.1.1` | Под корнем отрицательного быть не может | Ildiz ostida manfiy son bo'lolmaydi | A negative cannot stand under a root |
| `show.1.2` | значит икс и игрек неотрицательны | demak iks va igrek nomanfiy | so x and y are non-negative |
| `show.1.3` | полоса закрашена до решения, а не после | polosa yechimdan oldin bo'yaladi, keyin emas | the band is shaded before solving, not after |
| `show.2.1` | Замена: а это корень из икс, бе это корень из игрек | Almashtirish: a bu iksdan ildiz, b bu igrekdan ildiz | Substitution: a is the root of x, b is the root of y |
| `show.2.2` | вторая строка распадается на произведение | ikkinchi satr ko'paytmaga ajraladi | the second row splits into a product |
| `show.2.3` | а равно трём, бе равно двум | a uchga teng, b ikkiga teng | a equals three, b equals two |
| `audio.mount` | Третий вид из учебника это иррациональная система. Здесь порядок работы меняется. | Darslikdagi uchinchi tur irratsional sistema. Bu yerda ish tartibi o'zgaradi. | The third kind from the textbook is an irrational system. Here the order of work changes. |
| `audio.band*` | Полоса допустимых значений появляется первой, ещё до всякого преобразования. | Ruxsat etilgan qiymatlar polosasi birinchi paydo bo'ladi, har qanday almashtirishdan oldin. | The band of allowed values appears first, before any transformation. |
| `audio.work` | Замена превращает корни в буквы, и система становится знакомой. | Almashtirish ildizlarni harflarga aylantiradi, va sistema tanish bo'lib qoladi. | The substitution turns roots into letters, and the system becomes familiar. |
| `work.prompt` | Бе равно двум, а бе это корень из игрек. Запиши игрек. | b ikkiga teng, b esa igrekdan ildiz. Igrekni yozing. | b equals two, and b is the root of y. Write down y. |
| `work.ok` | Верно. Девять и четыре, и оба числа лежат в закрашенной полосе. | To'g'ri. To'qqiz va to'rt, ikkala son ham bo'yalgan polosada yotadi. | Correct. Nine and four, and both numbers lie inside the shaded band. |
| `work.hint.1` | Корень из игрек равен двум. Что тогда сам игрек? | Igrekdan ildiz ikkiga teng. Unda igrekning o'zi nima? | The root of y equals two. What is y itself then? |
| `work.hint.2` | Возведи обе части в квадрат. | Ikkala tomonni kvadratga ko'taring. | Square both sides. |
| `work.hint.3` | Два в квадрате это четыре. | Ikkining kvadrati to'rt. | Two squared is four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `√x + √y = 5 · x − y = 5` |
| `frame.1` | `x ≥ 0,   y ≥ 0` |
| `frame.2` | `a + b = 5,   (a − b)(a + b) = 5` |
| `expr` | `√x + √y = 5;   x − y = 5` |
| `work.expr` | `a + b = 5,   a − b = 1,   b = 2` |
| `work.answer` | `4` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `sistema-ne-para`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `title` | Решение системы | Sistemaning yechimi | A solution of a system |
| `probe.question` | Что такое решение системы? | Sistemaning yechimi nima? | What is a solution of a system? |
| `probe.a` [верно] | пара чисел, при которой верны обе строки | ikkala satr to'g'ri bo'ladigan sonlar juftligi | a pair of numbers making both rows true |
| `probe.b` | любое число, подходящее хотя бы одной строке | hech bo'lmasa bitta satrga mos har qanday son | any number fitting at least one row |
| `probe.b.hint` | Так решений было бы сколько угодно у любой системы, в том числе у той, где их нет. | Unda har qanday sistemada, yechimi yo'q sistemada ham, qancha xohlasangiz yechim bo'lardi. | Then every system would have any number of solutions, including one that has none. |
| `rule.lawLabel` | Множество решений системы | Sistema yechimlari to'plami | The solution set of a system |
| `rule.lines.1` | Стр. 70. Способы: алгебраическое сложение, подстановка, замена переменной. | 70-bet. Usullar: algebraik qo'shish, o'rniga qo'yish, o'zgaruvchini almashtirish. | Page 70. The methods: algebraic addition, substitution, change of variable. |
| `rule.lines.2` | Стр. 119. Система с показательным выражением называется показательной. | 119-bet. Ko'rsatkichli ifoda qatnashgan sistema ko'rsatkichli deyiladi. | Page 119. A system with an exponential expression is called exponential. |
| `rule.lines.3` | Стр. 87. В иррациональных те же плюс обозначение и множители. | 87-bet. Irratsionalda o'shalar va belgilash, ko'paytuvchilar. | Page 87. In irrational ones the same, plus denoting and factoring. |
| `audio.mount` | Прежде чем открыть карточку, ответь на один вопрос. | Kartochkani ochishdan oldin bitta savolga javob bering. | Before the card opens, answer one question. |
| `audio.rule*` | Карточка говорит словами учебника. Методов три, и все три уже были на экранах. | Kartochka darslik so'zlari bilan gapiradi. Usul uchta, va uchalasi ekranlarda bo'lib o'tdi. | The card speaks in the words of the textbook. There are three methods, and all three have already appeared on the screens. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `(x₀; y₀) ∈ S₁ ∩ S₂` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `sistema-bez-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЕТЫРЕ СИСТЕМЫ | TO'RTTA SISTEMA | FOUR SYSTEMS |
| `title` | Соедини систему с её ответом | Sistemani javobi bilan biriktiring | Match each system with its answer |
| `match.prompt` | Каждой системе свой ответ | Har bir sistemaga o'z javobi | Each system gets its own answer |
| `match.a` | (3; 1) | (3; 1) | (3; 1) |
| `match.b` | бесконечно много пар | cheksiz ko'p juftlik | infinitely many pairs |
| `match.c` | ни одной пары | birorta juftlik yo'q | no pairs at all |
| `match.d` | (4; 0) | (4; 0) | (4; 0) |
| `match.ok` | Все четыре верно. Вторая строка решает всё: она либо новая, либо та же, либо противоречит. | To'rttasi ham to'g'ri. Hammasini ikkinchi satr hal qiladi: u yo yangi, yo o'sha, yo qarama-qarshi. | All four correct. The second row decides everything: it is either new, or the same, or contradictory. |
| `audio.mount` | Четыре системы, и у всех первая строка одна и та же. Различает их только вторая. | To'rtta sistema, va hammasining birinchi satri bir xil. Ularni faqat ikkinchisi ajratadi. | Four systems, and the first row is the same in all of them. Only the second one tells them apart. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `x+y=4;  x−y=2` · `x+y=4;  2x+2y=8` · `x+y=4;  2x+2y=6` · `x+y=4;  x−y=4` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `podstanovka-bez-vozvrata`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПОКАЗАТЕЛЬНАЯ СИСТЕМА | KO'RSATKICHLI SISTEMA | AN EXPONENTIAL SYSTEM |
| `title` | Шаги названы, порядок за тобой | Qadamlar atalgan, tartib sizdan | The steps are named, the order is yours |
| `order.prompt` | Расставь по порядку | Tartib bilan joylashtiring | Put them in order |
| `order.s1` | показатели складываются | ko'rsatkichlar qo'shiladi | the exponents add |
| `order.s2` | x + y = 5 | x + y = 5 | x + y = 5 |
| `order.s3` | показатели вычитаются | ko'rsatkichlar ayiriladi | the exponents subtract |
| `order.s4` | x = 3, y = 2 | x = 3, y = 2 | x = 3, y = 2 |
| `order.ok` | Верно. Показательная система свелась к обычной, а дальше знакомое сложение. | To'g'ri. Ko'rsatkichli sistema oddiysiga keldi, keyin esa tanish qo'shish. | Correct. The exponential system came down to an ordinary one, and then the familiar addition. |
| `order.bad` | Порядок другой. Сначала обе строки переводятся в показатели, и только потом складываются. | Tartib boshqacha. Avval ikkala satr ko'rsatkichlarga o'tadi, keyin esa qo'shiladi. | The order is different. Both rows go over to exponents first, and only then get added. |
| `audio.mount` | Основание у всех степеней одно и то же, и это ключ ко всей системе. Тридцать два это два в пятой, поэтому первая строка превращается в сумму показателей, а вторая в их разность. | Hamma darajaning asosi bir xil, va bu butun sistemaning kaliti. O'ttiz ikki bu ikkining beshinchi darajasi, shuning uchun birinchi satr ko'rsatkichlar yig'indisiga, ikkinchisi esa ularning ayirmasiga aylanadi. | The base of all the powers is the same, and that is the key to the whole system. Thirty two is two to the fifth, so the first row turns into a sum of exponents and the second into their difference. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `2ˣ·2ʸ = 32 · 2ˣ : 2ʸ = 2` |
| `expr` | `2ˣ·2ʸ = 32;   2ˣ : 2ʸ = 2` |
| `order.mark` | `(3; 2)` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Логарифмическая система, без прибора | Logarifmik sistema, asbobsiz | A logarithmic system, no instrument |
| `order.prompt` | Расставь записи в том порядке, в каком они появляются в решении | Yozuvlarni yechimda paydo bo'lish tartibida joylashtiring | Put the lines in the order they appear in the solution |
| `order.title` | Порядок записей | Yozuvlar tartibi | The order of the lines |
| `order.ok` | Верно. Сумма логарифмов свернулась в логарифм произведения, дальше обычная подстановка. | To'g'ri. Logarifmlar yig'indisi ko'paytma logarifmiga yig'ildi, keyin oddiy o'rniga qo'yish. | Correct. The sum of logarithms folded into the logarithm of a product, then ordinary substitution. |
| `order.bad` | Не тот порядок. Логарифмы убираются первыми, буква выражается после. | Tartib to'g'ri emas. Logarifmlar birinchi olib tashlanadi, harf keyin ifodalanadi. | Wrong order. The logarithms go first, the letter is expressed after that. |
| `task.prompt` | Реши систему и запиши икс | Sistemani yeching va iksni yozing | Solve the system and write down x |
| `task.ok` | Верно. Икс равен четырём, игрек равен двум, и оба больше нуля. | To'g'ri. Iks to'rtga teng, igrek ikkiga teng, va ikkalasi noldan katta. | Correct. x equals four, y equals two, and both are greater than zero. |
| `task.hint.1` | Сумма логарифмов с одним основанием это логарифм произведения. | Bir xil asosli logarifmlar yig'indisi ko'paytma logarifmi. | A sum of logarithms with the same base is the logarithm of the product. |
| `task.hint.2` | Произведение равно восьми, а разность равна двум. | Ko'paytma sakkizga teng, ayirma esa ikkiga teng. | The product equals eight, and the difference equals two. |
| `task.hint.3` | Из квадратного уравнения выходят два числа, но одно из них меньше нуля и в ответ не идёт. | Kvadrat tenglamadan ikki son chiqadi, lekin biri noldan kichik va javobga bormaydi. | The quadratic gives two numbers, but one of them is below zero and does not go into the answer. |
| `audio.mount` | Прибора здесь нет. Сначала порядок записей, потом ответ. | Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob. | There is no instrument here. First the order of the lines, then the answer. |
| `audio.next` | Теперь сама система. Пиши икс. | Endi sistemaning o'zi. Iksni yozing. | Now the system itself. Write down x. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `log₂x + log₂y = 3 · x − y = 2` |
| `task.prompt` | `log₂x + log₂y = 3;   x − y = 2` |
| `task.answer` | `4` |
| `order.items` | `xy = 8` · `x = y + 2` · `y² + 2y − 8 = 0` · `y = 2` |
| `order.answer` | `xy = 8  x = y + 2  y² + 2y − 8 = 0  y = 2` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Все шаги верны, ответ неверен | Hamma qadam to'g'ri, javob noto'g'ri | Every step is right, the answer is wrong |
| `hint.r1` | Возведение сделано верно: слева корень исчез, справа квадрат разности. | Kvadratga ko'tarish to'g'ri bajarilgan: chapda ildiz ketdi, o'ngda ayirmaning kvadrati. | The squaring is done correctly: on the left the root is gone, on the right the square of a difference. |
| `hint.r2` | Приведение верное: единицы сократились, осталось икс в квадрате минус три икс. | Keltirish to'g'ri: birlar qisqardi, iks kvadrat ayirish uch iks qoldi. | The reduction is correct: the ones cancelled, x squared minus three x is left. |
| `hint.r3` | Оба числа получены верными действиями, ошибка не здесь. | Ikkala son ham to'g'ri amallar bilan olingan, xato bu yerda emas. | Both numbers came from correct steps, the mistake is not here. |
| `proof` | Ошибка в последней строке. Возведение в квадрат даёт следствие, поэтому найденное надо вернуть в исходную строку. | Xato oxirgi satrda. Kvadratga ko'tarish natija beradi, shuning uchun topilganni dastlabki satrga qaytarish kerak. | The mistake is in the last line. Squaring gives a consequence, so what was found must go back into the original row. |
| `entry.prompt` | Подставь икс равно нулю в правую часть первой строки. Что она даёт? | Iks teng nolni birinchi satrning o'ng tomoniga qo'ying. U nima beradi? | Substitute x equals zero into the right side of the first row. What does it give? |
| `entry.ok` | Верно. Слева единица, справа минус единица. Пара с нулём в ответ не идёт. | To'g'ri. Chapda bir, o'ngda minus bir. Nolli juftlik javobga bormaydi. | Correct. One on the left, minus one on the right. The pair with zero does not go into the answer. |
| `entry.hint.1` | Правая часть первой строки это икс минус один. | Birinchi satrning o'ng tomoni bu iks ayirish bir. | The right side of the first row is x minus one. |
| `entry.hint.2` | Подставь ноль вместо икс в это выражение. | Bu ifodada iks o'rniga nolni qo'ying. | Substitute zero for x in that expression. |
| `entry.hint.3` | Ноль минус один это минус один, а корень отрицательным не бывает. | Nol ayirish bir bu minus bir, ildiz esa manfiy bo'lmaydi. | Zero minus one is minus one, and a root is never negative. |
| `audio.mount` | Решение выписано в четыре строки. Найди ту, где появилась ошибка. | Yechim to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping. | The solution is written in four lines. Find the one where the mistake appeared. |
| `audio.next` | Теперь покажи это числом. Одна подстановка всё решает. | Endi buni son bilan ko'rsating. Bitta o'rniga qo'yish hammasini hal qiladi. | Now show it with a number. A single substitution settles it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `√(x + 1) = x − 1 · y = 2x` |
| `expr` | `√(x + 1) = x − 1;   y = 2x` |
| `row.r1` | `x + 1 = x² − 2x + 1` |
| `row.r2` | `x² − 3x = 0` |
| `row.r3` | `x = 0;   x = 3` |
| `row.r4` | `(0; 0),   (3; 6)` |
| `answerId` | `r4` |
| `entry.answer` | `−1` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБРАТНАЯ ЗАДАЧА | TESKARI MASALA | THE REVERSE TASK |
| `title` | Теперь ты ставишь число | Endi sonni siz qo'yasiz | Now you place the number |
| `entry.prompt` | Какое число вместо звёздочки даст бесконечно много решений? | Yulduzcha o'rniga qanday son cheksiz ko'p yechim beradi? | Which number in place of the star gives infinitely many solutions? |
| `entry.ok` | Верно. При двенадцати вторая строка это первая, умноженная на два, целиком. | To'g'ri. O'n ikkida ikkinchi satr birinchining ikkiga ko'paytirilgani, butunlay. | Correct. At twelve the second row is the first one multiplied by two, entirely. |
| `entry.hint.1` | Умножь первую строку на два и посмотри на правую часть. | Birinchi satrni ikkiga ko'paytiring va o'ng tomonga qarang. | Multiply the first row by two and look at the right side. |
| `entry.hint.2` | Слева выйдет ровно два икс минус четыре игрек. | Chapda aynan ikki iks ayirish to'rt igrek chiqadi. | On the left you get exactly two x minus four y. |
| `entry.hint.3` | Шесть умножить на два даёт двенадцать. | Oltini ikkiga ko'paytirsa o'n ikki chiqadi. | Six times two gives twelve. |
| `multi.prompt` | Отметь все системы, у которых решений нет | Yechimi yo'q hamma sistemani belgilang | Mark every system that has no solutions |
| `multi.title` | Две из четырёх | To'rttadan ikkitasi | Two out of four |
| `multi.c.hint` | Здесь вторая строка это первая, умноженная на два, вместе с правой частью. Подходит любая пара с первой прямой. | Bu yerda ikkinchi satr birinchining ikkiga ko'paytirilgani, o'ng tomoni bilan. Birinchi chiziqdagi har qanday juftlik yaraydi. | Here the second row is the first multiplied by two, right side included. Any pair from the first line fits. |
| `multi.d.hint` | Сложи строки: два икс равно двум. Пара находится сразу. | Satrlarni qo'shing: ikki iks teng ikki. Juftlik darrov topiladi. | Add the rows: two x equals two. The pair is found at once. |
| `multi.ok` | Верно. Решений нет, когда левые части пропорциональны, а правые этой пропорции не держат. | To'g'ri. Chap tomonlar proporsional, o'ng tomonlar esa bu proporsiyani ushlamasa, yechim yo'q. | Correct. There are no solutions when the left sides are proportional and the right sides do not keep that proportion. |
| `audio.mount` | До этого систему давали тебе. Теперь ты сам ставишь число и решаешь, сколько будет решений. | Bungacha sistemani sizga berardilar. Endi sonni o'zingiz qo'yasiz va yechim nechta bo'lishini hal qilasiz. | Until now the system was given to you. Now you place the number and decide how many solutions there will be. |
| `audio.work` | Обрати внимание, каким одиноким оказалось число двенадцать. Все остальные числа дают пустой ответ. | O'n ikki soni qanchalik yakka bo'lib chiqqaniga e'tibor bering. Boshqa hamma son bo'sh javob beradi. | Notice how lonely the number twelve turned out to be. Every other number gives an empty answer. |

**Формулы**

| Ключ | Значение |
|---|---|
| `sys` | `x − 2y = 6 · 2x − 4y = ✱` |
| `entry.expr` | `x − 2y = 6;   2x − 4y = ✱` |
| `entry.answer` | `12` |
| `multi.a` [верно] | `x − 2y = 6;  2x − 4y = 0` |
| `multi.b` [верно] | `x + y = 1;  x + y = 5` |
| `multi.c` | `x − 2y = 6;  2x − 4y = 12` |
| `multi.d` | `x + y = 1;  x − y = 1` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `sistema-ne-para`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | THE BLITZ |
| `title` | Четыре вопроса подряд | Ketma-ket to'rtta savol | Four questions in a row |
| `q1.prompt` | Решение системы двух уравнений с двумя буквами это… | Ikki harfli ikkita tenglama sistemasining yechimi bu... | A solution of a system of two equations in two letters is... |
| `q1.a` [верно] | пара чисел | sonlar juftligi | a pair of numbers |
| `q1.b` | одно число | bitta son | a single number |
| `q1.b.hint` | Одно число вторую строку не обращает ни во что: там две буквы. | Bitta son ikkinchi satrni hech narsaga aylantirmaydi: unda ikki harf bor. | A single number turns the second row into nothing: it has two letters. |
| `q1.c` | любое число из первой строки | birinchi satrdagi har qanday son | any number from the first row |
| `q1.c.hint` | Тогда вторая строка вообще не участвует, а она половина условия. | Unda ikkinchi satr umuman qatnashmaydi, u esa shartning yarmi. | Then the second row takes no part at all, and it is half the condition. |
| `q1.d` | точка на одной из прямых | chiziqlardan biridagi nuqta | a point on one of the lines |
| `q1.d.hint` | Нужна точка сразу на двух прямых, то есть общая. | Bir vaqtda ikki chiziqdagi nuqta, ya'ni umumiy nuqta kerak. | A point on both lines at once is needed, that is, a common one. |
| `q2.prompt` | Прямые параллельны и не совпадают. Сколько решений у системы? | Chiziqlar parallel va ustma-ust tushmaydi. Sistemaning nechta yechimi bor? | The lines are parallel and do not coincide. How many solutions has the system? |
| `q2.a` [верно] | ни одного | birorta ham yo'q | none |
| `q2.b` | одно | bitta | one |
| `q2.b.hint` | Одно решение это пересечение, а параллельные не пересекаются. | Bitta yechim bu kesishish, parallellar esa kesishmaydi. | One solution means an intersection, and parallel lines do not intersect. |
| `q2.c` | бесконечно много | cheksiz ko'p | infinitely many |
| `q2.c.hint` | Бесконечно много бывает, когда прямые совпали, а здесь сказано, что нет. | Cheksiz ko'p chiziqlar ustma-ust tushganda bo'ladi, bu yerda esa tushmaydi deyilgan. | Infinitely many happens when the lines coincide, and here it says they do not. |
| `q2.d` | два | ikkita | two |
| `q2.d.hint` | Ровно двух общих точек у двух прямых не бывает никогда. | Ikki chiziqning aynan ikkita umumiy nuqtasi hech qachon bo'lmaydi. | Two lines never have exactly two common points. |
| `q3.prompt` | Два икс плюс игрек равно семи, три икс минус игрек равно восьми. Какой способ короче? | Ikki iks qo'shuv igrek teng yetti, uch iks ayirish igrek teng sakkiz. Qaysi usul qisqaroq? | Two x plus y equals seven, three x minus y equals eight. Which way is shorter? |
| `q3.a` [верно] | сложить строки | satrlarni qo'shish | add the rows |
| `q3.a.ok` | Да: множители при игрек уже противоположны, буква уходит без всякой подготовки. | Ha: igrekning ko'paytuvchilari allaqachon qarama-qarshi, harf hech qanday tayyorgarliksiz ketadi. | Yes: the factors of y are already opposite, so the letter leaves with no preparation. |
| `q3.b` | выразить икс из первой | birinchisidan iksni ifodalash | express x from the first |
| `q3.b.hint` | Так тоже выйдет, но появится дробь там, где её могло не быть. | Bu ham chiqadi, lekin bo'lmasligi mumkin bo'lgan joyda kasr paydo bo'ladi. | That works too, but it brings a fraction where none was needed. |
| `q3.c` | возвести в квадрат | kvadratga ko'tarish | square both sides |
| `q3.c.hint` | Корней здесь нет, возводить нечего. | Bu yerda ildiz yo'q, ko'taradigan narsa yo'q. | There are no roots here, nothing to square. |
| `q3.d` | заменить переменную | o'zgaruvchini almashtirish | change the variable |
| `q3.d.hint` | Замена нужна, когда буква стоит внутри корня или логарифма. | Almashtirish harf ildiz yoki logarifm ichida turganda kerak. | A change of variable is for when the letter sits inside a root or a logarithm. |
| `q4.prompt` | Пара найдена в иррациональной системе. Что обязательно? | Irratsional sistemada juftlik topildi. Nima shart? | A pair is found in an irrational system. What is required? |
| `q4.a` [верно] | подставить её в исходные строки | uni dastlabki satrlarga qo'yish | substitute it into the original rows |
| `q4.b` | округлить | yaxlitlash | round it off |
| `q4.b.hint` | Округление меняет число, а проверку не заменяет. | Yaxlitlash sonni o'zgartiradi, tekshiruvni esa almashtirmaydi. | Rounding changes the number and does not replace the check. |
| `q4.c` | сразу записать в ответ | darrov javobga yozish | write it into the answer at once |
| `q4.c.hint` | Возведение в квадрат даёт следствие, и лишнее число появляется само. | Kvadratga ko'tarish natija beradi, va ortiqcha son o'zi paydo bo'ladi. | Squaring gives a consequence, and a spare number appears by itself. |
| `q4.d` | поменять числа местами | sonlarni joyini almashtirish | swap the numbers |
| `q4.d.hint` | Порядок в паре задан буквами, менять его нельзя. | Juftlikdagi tartib harflar bilan berilgan, uni o'zgartirib bo'lmaydi. | The order in a pair is set by the letters, it cannot be changed. |
| `audio.mount` | Четыре вопроса, и они идут в оценку. | To'rtta savol, va ular baholanadi. | Four questions, and they count towards the score. |
| `q1.done` | Пара, и всегда в порядке икс, игрек. | Juftlik, va doim iks, igrek tartibida. | A pair, and always in the order x, y. |
| `q2.done` | Пустой ответ это тоже ответ, и его надо уметь получить. | Bo'sh javob ham javob, va uni olishni bilish kerak. | An empty answer is an answer too, and one has to know how to get it. |
| `q3.done` | Короче тот способ, где буква уходит без подготовки. | Harf tayyorgarliksiz ketadigan usul qisqaroq. | The shorter way is the one where the letter leaves with no preparation. |
| `q4.done` | Проверка это часть решения, а не вежливость. | Tekshiruv yechimning qismi, xushmuomalalik emas. | The check is part of the solution, not a courtesy. |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | XULOSA | THE SUMMARY |
| `title` | Пара, две строки, три способа | Juftlik, ikki satr, uch usul | A pair, two rows, three methods |
| `can.1` | Проверяю пару подстановкой в обе строки | Juftlikni ikkala satrga qo'yib tekshiraman | I check a pair by substituting into both rows |
| `can.2` | Решаю подстановкой и алгебраическим сложением | O'rniga qo'yish va algebraik qo'shish bilan yechaman | I solve by substitution and by algebraic addition |
| `can.3` | Вижу, когда решений нет и когда их бесконечно много | Yechim yo'q va cheksiz ko'p bo'lgan holatni ko'raman | I see when there are no solutions and when there are infinitely many |
| `can.4` | Проверяю найденное по допустимым значениям | Topilganni ruxsat etilgan qiymatlar bo'yicha tekshiraman | I check what I found against the allowed values |
| `levels.full` | Прошёл всё и разобрал ловушку | Hammasidan o'tdingiz va tuzoqni ochdingiz | Everything done, the trap taken apart |
| `levels.gap` | Способы работают, проверка допустимых значений ещё нет | Usullar ishlaydi, ruxsat etilgan qiymatlar tekshiruvi hali yo'q | The methods work, the check of allowed values not yet |
| `levels.back` | Стоит вернуться к экрану четыре: пара проверяется в двух строках | To'rtinchi ekranga qaytish kerak: juftlik ikki satrda tekshiriladi | Worth going back to screen four: a pair is checked in two rows |
| `bridge` | Дальше тригонометрические неравенства: там ответ снова не число, а множество. | Keyingisi trigonometrik tengsizliklar: unda javob yana son emas, to'plam. | Next come trigonometric inequalities: there the answer is again not a number but a set. |
| `lifehack` | Если левые части одной строки повторяют другую с множителем, ответ решается до всякого счёта: правая часть либо повторяет тот же множитель, либо решений нет. | Agar bir satrning chap tomoni boshqasini ko'paytuvchi bilan takrorlasa, javob har qanday hisobdan oldin hal bo'ladi: o'ng tomon ham o'sha ko'paytuvchini takrorlaydi yoki yechim yo'q. | If one row's left side repeats the other with a factor, the answer is settled before any arithmetic: either the right side repeats that same factor, or there are no solutions. |
| `sheetTitle` | Шпаргалка урока | Dars shpargalkasi | The lesson sheet |
| `sheetSrc` | алгебра 2022, стр. 70, 87, 119 | algebra 2022, 70, 87, 119-betlar | algebra 2022, pages 70, 87, 119 |
| `audio.mount` | Прогноз с первого экрана и результат стоят рядом. | Birinchi ekrandagi taxmin va natija yonma-yon turadi. | The guess from screen one and the result stand side by side. |
| `audio.next` | Шпаргалка собрана по учебнику. Ниже видно, что умеешь. | Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi. | The sheet is put together from the textbook. Below you can see what you can do. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `(4; −1)` |
| `hook.b` | `∅` |
| `proved` | `∅` |
| `law` | `(x₀; y₀) ∈ S₁ ∩ S₂` |
| `sheet.1` | `y = −5 − x   ⇒   3x − (−5 − x) = −7` |
| `sheet.2` | `x + 2y = 8;  6x − 2y = 6   ⇒   7x = 14` |
| `sheet.3` | `a = √x, b = √y   ⇒   a + b = 5, a² − b² = 5` |
| `sheet.4` | `log₂x + log₂y = 3   ⇒   xy = 8` |
| `sheet.5` | `2x − 4y = 12 ⇒ ∞;   2x − 4y ≠ 12 ⇒ ∅` |
