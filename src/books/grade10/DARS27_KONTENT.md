# Урок 27 — Показат. функция · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS26_28_SKELET.md` §8. Опора в учебнике: алгебра 2022, стр. 95–98, параграф
`KO'RSATKICHLI FUNKSIYA`.

**Главное решение урока.** Показатель перестаёт быть числом и становится переменной — этим урок
отличается от 26-го. Дальше всё читается с чертежа: вход берут любой, выход всегда положителен,
направление задаёт основание. Асимптота — свидетель урока: кривая подходит к оси сколь угодно
близко и не касается её, поэтому множество значений начинается с нуля и нуля не содержит.

**Хук показывает кривую, но ответа не выдаёт.** На чертеже слева кривая идёт в одном-двух
пикселях от оси, и на глаз коснулась она или нет — не различить. Прогноз остаётся прогнозом, а
асимптота появляется только на экране 5.

**Действие рукой на плоскости — ввод числа**, как в уроке 7: `BuildPoint` привязан к единичной
окружности, тянуть точку по кривой нечем, и переписывать прибор пакету не требуется.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ФУНКЦИЯ | FUNKSIYA | THE FUNCTION |
| `title` | Дойдёт ли кривая до оси | Egri chiziq o'qqa yetadimi | Will the curve reach the axis |
| `row.a.name` | где-то пересечёт ось | qayerdadir o'qni kesadi | somewhere it crosses the axis |
| `row.b.name` | подойдёт и не коснётся | yaqinlashadi va tegmaydi | it comes close and never touches |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас пройдём по кривой влево и посмотрим. | Javobingiz yozib olindi. Endi egri chiziq bo'ylab chapga yuramiz va ko'ramiz. | Your answer is saved. Now we will walk left along the curve and see. |
| `audio.mount` | Кривая идёт слева направо и прижимается к оси. На глаз не различить, коснулась она оси или нет. | Egri chiziq chapdan o'ngga boradi va o'qqa yopishadi. Ko'z bilan u o'qqa tegdimi yoki yo'qmi, ajratib bo'lmaydi. | The curve runs left to right and hugs the axis. By eye you cannot tell whether it touched the axis or not. |
| `audio.r1` | Первая запись говорит, что где-то слева кривая доходит до нуля. | Birinchi yozuv chapda qayerdadir egri chiziq nolga yetadi deydi. | The first reading says that somewhere on the left the curve reaches zero. |
| `audio.r2` | Вторая говорит, что она подходит сколь угодно близко и всё равно не касается. | Ikkinchisi u qanchalik yaqin kelsa ham tegmaydi deydi. | The second says it comes as close as you like and still does not touch. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `y = 2^x` |
| `row.a.value` | `2^x = 0` |
| `row.b.value` | `2^x > 0` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из прошлого урока | O'tgan darsdan uch savol | Three questions from the previous lesson |
| `q1.prompt` | Чему равно два в минус третьей степени? | Ikki minus uchinchi darajada nechaga teng? | What is two to the minus third power? |
| `q1.a` [верно] | одна восьмая | bir sakkizdan | one eighth |
| `q1.b` | минус восемь | minus sakkiz | minus eight |
| `q1.b.hint` | Минус в показателе переворачивает дробь, а знак числа не трогает. | Ko'rsatkichdagi minus kasrni teskari qiladi, sonning ishorasiga tegmaydi. | The minus in the exponent turns the fraction over and leaves the sign alone. |
| `q1.c` | минус одна восьмая | minus bir sakkizdan | minus one eighth |
| `q1.c.hint` | Дробь верная, а минус лишний: он уже отработал в показателе. | Kasr to'g'ri, minus esa ortiqcha: u ko'rsatkichda ishlab bo'ldi. | The fraction is right, the minus is extra: it already did its work in the exponent. |
| `q1.d` | шесть | olti | six |
| `q1.d.hint` | Шесть вышло бы, если два и три перемножить. | Olti ikki bilan uchni ko'paytirsak chiqardi. | Six would come from multiplying two by three. |
| `q2.prompt` | Чему равно два в нулевой степени? | Ikki nol darajada nechaga teng? | What is two to the zero power? |
| `q2.a` [верно] | единица | bir | one |
| `q2.b` | ноль | nol | zero |
| `q2.b.hint` | Спустись по лестнице: после двойки идёт единица, а не ноль. | Zinapoyadan tushing: ikkidan keyin nol emas, bir keladi. | Walk down the ladder: after two comes one, not zero. |
| `q2.c` | два | ikki | two |
| `q2.c.hint` | Два это первая степень, нулевая на шаг ниже. | Ikki bu birinchi daraja, nol esa bir qadam pastda. | Two is the first power, the zero one is a step below. |
| `q2.d` | такой записи нет | bunday yozuv yo'q | there is no such reading |
| `q2.d.hint` | Есть: лестница вниз проходит через нулевой показатель. | Bor: zinapoya pastga nol ko'rsatkich orqali o'tadi. | There is: the ladder down passes through the zero exponent. |
| `q3.prompt` | Что означает дробный показатель? | Kasr ko'rsatkich nimani bildiradi? | What does a fractional exponent mean? |
| `q3.a` [верно] | корень | ildiz | a root |
| `q3.b` | деление основания | asosni bo'lish | dividing the base |
| `q3.b.hint` | Восемь разделить на три в куб даёт девятнадцать, а не восемь. | Sakkiz uchga bo'linib kubga ko'tarilsa sakkiz emas, o'n to'qqiz beradi. | Eight divided by three, cubed, gives nineteen, not eight. |
| `q3.c` | умножение основания | asosni ko'paytirish | multiplying the base |
| `q3.c.hint` | Корень число уменьшает, а умножение увеличило бы. | Ildiz sonni kichraytiradi, ko'paytirish esa kattalashtirardi. | A root makes the number smaller, multiplying would make it bigger. |
| `q3.d` | ничего | hech narsa | nothing |
| `q3.d.hint` | Значение есть, и его проверяют обратным действием. | Qiymat bor, va u teskari amal bilan tekshiriladi. | The value exists, and it is checked by the inverse action. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `2^{−3} = 1/8` |
| `q2.done` | `2⁰ = 1` |
| `q3.done` | `a^{1/n} = ⁿ√a` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Показатель стал переменной | Ko'rsatkich o'zgaruvchi bo'ldi | The exponent became a variable |
| `show.1.1` | в показателе теперь икс | ko'rsatkichda endi iks | the exponent now holds x |
| `show.1.2` | точка идёт, следы падают | nuqta yuradi, izlar tushadi | the point walks, the traces fall |
| `show.2.1` | вход по горизонтали | kirish gorizontal bo'yicha | the input along the horizontal |
| `show.2.2` | выход по вертикали | chiqish vertikal bo'yicha | the output along the vertical |
| `audio.mount` | В прошлом уроке показатель был числом. Теперь на его месте икс, и запись стала функцией. | O'tgan darsda ko'rsatkich son edi. Endi uning o'rnida iks turadi, va yozuv funksiyaga aylandi. | In the previous lesson the exponent was a number. Now x stands in its place, and the reading became a function. |
| `audio.walk*` | Точка идёт по кривой, и от неё падают два следа. Нижний след это вход, левый это выход. Вход берут любой: целый, дробный, отрицательный, иррациональный. Прошлый урок показал, что степень есть при любом действительном показателе, если основание положительно. Значит область определения это вся числовая прямая, без пропусков и без запретов. | Nuqta egri chiziq bo'ylab yuradi, undan ikkita iz tushadi. Pastdagisi kirish, chapdagisi chiqish. Kirish har qanday bo'lishi mumkin: butun, kasr, manfiy, irratsional. O'tgan dars ko'rsatdi: asos musbat bo'lsa, har qanday haqiqiy ko'rsatkichli daraja bor. Demak aniqlanish sohasi butun son o'qi, uzilishsiz va taqiqsiz. | The point walks along the curve, dropping two traces. The lower one is the input, the left one the output. Any input is allowed: whole, fractional, negative, irrational. The previous lesson showed that a power exists for any real exponent when the base is positive. So the domain is the whole number line, with no gaps and no bans. |
| `audio.work` | Посчитай сам. Сколько значений икс приходится пропустить? | O'zingiz hisoblang. Iksning nechta qiymatini tashlab ketish kerak? | Work it out yourself. How many values of x have to be skipped? |
| `work.prompt` | Сколько значений икс приходится пропустить? | Iksning nechta qiymatini tashlab ketish kerak? | How many values of x have to be skipped? |
| `work.ok` | Ни одного. Степень с любым действительным показателем есть, если основание положительно. | Birortasi ham. Asos musbat bo'lsa, har qanday haqiqiy ko'rsatkichli daraja bor. | None. A power with any real exponent exists when the base is positive. |
| `work.hint.1` | Попробуй найти икс, при котором записи не существует. | Yozuv mavjud bo'lmaydigan iksni topishga urinib ko'ring. | Try to find an x for which the reading does not exist. |
| `work.hint.2` | Дробный и отрицательный показатель уже разобраны в прошлом уроке. | Kasr va manfiy ko'rsatkich o'tgan darsda ko'rilgan. | The fractional and the negative exponent were covered last lesson. |
| `work.hint.3` | Ни одного. | Birortasi ham. | None. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `y = 2^x` |
| `show.2.3` | `D(y) = (−∞; +∞)` |
| `work.answer` | `0` |

---

## Экран 4 · `explain2` · ответ `number` · тег `stepennaya-vmesto-pokazatelnoy`

Разграничение: похожая запись, другая функция.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Где стоит переменная | O'zgaruvchi qayerda turadi | Where the variable stands |
| `show.1.1` | у одной записи икс в основании | bir yozuvda iks asosda | in one reading x is the base |
| `show.1.2` | у другой в показателе | boshqasida ko'rsatkichda | in the other it is the exponent |
| `show.2.1` | в нуле ноль против единицы | nolda nol va bir | at zero, zero against one |
| `show.2.2` | значения расходятся сразу | qiymatlar darrov ajraladi | the values part company at once |
| `audio.mount` | Две похожие записи, и их часто путают. Вся разница в том, где стоит икс. | Ikki o'xshash yozuv, va ular ko'p aralashtiriladi. Butun farq iks qayerda turganida. | Two similar readings, often mixed up. The whole difference is where x stands. |
| `audio.split*` | Подставим ноль. Икс в квадрате даёт ноль, а два в степени икс даёт единицу. Уже здесь они разошлись. Подставим минус два. Икс в квадрате даёт четыре, а два в степени икс одну четвёртую. Значит это разные функции, а не одна запись с переставленными буквами. И проверять надо не по виду записи, а подстановкой. | Nolni qo'yamiz. Iks kvadratda nol beradi, ikki iks darajada esa bir beradi. Shu yerda ular ajralib ketdi. Minus ikkini qo'yamiz. Iks kvadratda to'rt beradi, ikki iks darajada esa bir choraklik. Demak bular har xil funksiya, harflari joy almashgan bitta yozuv emas. Va tekshirish yozuvning ko'rinishi bilan emas, qiymat qo'yish bilan bo'ladi. | Substitute zero. x squared gives zero, and two to the x gives one. They already parted here. Substitute minus two. x squared gives four, and two to the x gives one quarter. So these are different functions, not one reading with the letters swapped. And the check is by substitution, not by the look of the reading. |
| `audio.work` | Посчитай сам. Чему равно два в степени икс при икс, равном нулю? | O'zingiz hisoblang. Iks nolga teng bo'lganda ikki iks darajada nechaga teng? | Work it out yourself. What is two to the x when x equals zero? |
| `work.prompt` | Чему равно два в степени икс при икс, равном нулю? | Iks nolga teng bo'lganda ikki iks darajada nechaga teng? | What is two to the x when x equals zero? |
| `work.ok` | Единица. У степенной функции в нуле был бы ноль, и это первая точка, где они расходятся. | Bir. Darajali funksiyada nolda nol bo'lardi, va bu ular ajraladigan birinchi nuqta. | One. The power function would give zero at zero, and that is the first point where they part. |
| `work.hint.1` | Нулевой показатель разобран в прошлом уроке. | Nol ko'rsatkich o'tgan darsda ko'rilgan. | The zero exponent was covered last lesson. |
| `work.hint.2` | Любое положительное основание в нулевой степени даёт одно и то же. | Har qanday musbat asos nol darajada bir xil natija beradi. | Any positive base to the zero power gives the same thing. |
| `work.hint.3` | Один. | Bir. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `y = x²` |
| `show.2.3` | `y = 2^x` |
| `work.answer` | `1` |

---

## Экран 5 · `explain3` · ответ `number` · тег `nol-vhodit-v-e`

Свидетель урока: асимптота. Кривая подходит к оси и не касается.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Ноль остаётся границей | Nol chegara bo'lib qoladi | Zero stays a boundary |
| `show.1.1` | идём по кривой влево | egri chiziq bo'ylab chapga yuramiz | we walk left along the curve |
| `show.1.2` | расстояние до оси уменьшается | o'qqa masofa kamayadi | the distance to the axis shrinks |
| `show.2.1` | касания нет ни в одной точке | birorta nuqtada ham tegish yo'q | there is no touching at any point |
| `show.2.2` | значения положительны | qiymatlar musbat | the values are positive |
| `audio.mount` | Пойдём по кривой влево. Значения уменьшаются и становятся совсем маленькими. | Egri chiziq bo'ylab chapga yuramiz. Qiymatlar kamayadi va juda kichik bo'lib qoladi. | Let us walk left along the curve. The values shrink and become very small. |
| `audio.near*` | Ось подписана как асимптота. Кривая подходит к ней сколь угодно близко, но не касается. Причина простая: значение это произведение двоек, а произведение обращается в ноль только тогда, когда один из множителей ноль. Двойка нулём не бывает никогда. Поэтому множество значений начинается с нуля и самого нуля не содержит. | O'q asimptota deb belgilangan. Egri chiziq unga qanchalik yaqin kelsa ham tegmaydi. Sababi oddiy: qiymat bu ikkilar ko'paytmasi, ko'paytma esa faqat ko'paytuvchilardan biri nol bo'lganda nolga aylanadi. Ikki esa hech qachon nol bo'lmaydi. Shuning uchun qiymatlar to'plami noldan boshlanadi va nolning o'zini o'z ichiga olmaydi. | The axis is labelled as an asymptote. The curve comes as close to it as you like but never touches. The reason is simple: the value is a product of twos, and a product becomes zero only when one of the factors is zero. A two is never zero. So the range starts at zero and does not contain zero itself. |
| `audio.work` | Посчитай сам. Сколько раз кривая пересекает горизонтальную ось? | O'zingiz hisoblang. Egri chiziq gorizontal o'qni necha marta kesadi? | Work it out yourself. How many times does the curve cross the horizontal axis? |
| `work.prompt` | Сколько раз кривая пересекает горизонтальную ось? | Egri chiziq gorizontal o'qni necha marta kesadi? | How many times does the curve cross the horizontal axis? |
| `work.ok` | Ни разу. Произведение двоек нулём не становится, поэтому ноль остаётся только границей. | Bir marta ham. Ikkilar ko'paytmasi nol bo'lmaydi, shuning uchun nol faqat chegara bo'lib qoladi. | Never. A product of twos never becomes zero, so zero stays only a boundary. |
| `work.hint.1` | Посмотри, где кривая ближе всего к оси, и проверь, коснулась ли она. | Egri chiziq o'qqa eng yaqin joyga qarang va tegdimi yoki yo'qmi tekshiring. | Look where the curve is closest to the axis and check whether it touched. |
| `work.hint.2` | Значение обратится в ноль, только если один из множителей ноль. | Qiymat faqat ko'paytuvchilardan biri nol bo'lganda nolga aylanadi. | The value becomes zero only if one of the factors is zero. |
| `work.hint.3` | Ни разу. | Bir marta ham. | Never. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2^{−10} = 1/1024` |
| `show.2.3` | `E(y) = (0; +∞)` |
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `vsegda-rastet`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Направление задаёт основание | Yo'nalishni asos beradi | The base sets the direction |
| `show.1.1` | основание меньше единицы | asos birdan kichik | the base is less than one |
| `show.1.2` | шаг вправо делит, а не удваивает | o'ngga qadam bo'ladi, ikkilantirmaydi | a step right divides instead of doubling |
| `show.2.1` | кривая пошла вниз | egri chiziq pastga ketdi | the curve went down |
| `show.2.2` | асимптота осталась той же | asimptota o'sha bo'lib qoldi | the asymptote stayed the same |
| `audio.mount` | Возьмём другое основание. Одна вторая, то есть ноль целых пять десятых. | Boshqa asos olamiz. Bir ikkidan, ya'ni nol butun besh o'ndan. | Let us take another base. One half, that is zero point five. |
| `audio.flip*` | Кривая перевернулась и пошла вниз. Причина простая: каждый шаг вправо теперь не удваивает значение, а делит его на два. Вид кривой не изменился, асимптота осталась той же, поменялось только направление. Значит показательная функция не всегда растёт, и направление надо смотреть по основанию, а не по виду записи. | Egri chiziq teskari bo'lib pastga ketdi. Sababi oddiy: o'ngga har qadam endi qiymatni ikkilantirmaydi, uni ikkiga bo'ladi. Egri chiziqning ko'rinishi o'zgarmadi, asimptota o'sha qoldi, faqat yo'nalish o'zgardi. Demak ko'rsatkichli funksiya doim o'smaydi, va yo'nalishni yozuvning ko'rinishi bilan emas, asos bilan ko'rish kerak. | The curve flipped and went down. The reason is simple: a step right now divides the value by two instead of doubling it. The shape of the curve did not change, the asymptote stayed the same, only the direction changed. So an exponential function does not always grow, and the direction is read from the base, not from the look of the reading. |
| `audio.work` | Посчитай сам. Чему равна одна вторая в минус первой степени? | O'zingiz hisoblang. Bir ikkidan minus birinchi darajada nechaga teng? | Work it out yourself. What is one half to the minus first power? |
| `work.prompt` | Чему равна одна вторая в минус первой степени? | Bir ikkidan minus birinchi darajada nechaga teng? | What is one half to the minus first power? |
| `work.ok` | Два. Минус в показателе переворачивает дробь, поэтому убывающая кривая слева поднимается высоко. | Ikki. Ko'rsatkichdagi minus kasrni teskari qiladi, shuning uchun kamayuvchi egri chiziq chapda yuqori ko'tariladi. | Two. The minus in the exponent turns the fraction over, so the decreasing curve rises high on the left. |
| `work.hint.1` | Минус в показателе разобран в прошлом уроке. | Ko'rsatkichdagi minus o'tgan darsda ko'rilgan. | The minus in the exponent was covered last lesson. |
| `work.hint.2` | Переверни дробь и посчитай. | Kasrni teskari qilib hisoblang. | Turn the fraction over and compute. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `y = 0,5^x` |
| `show.2.3` | `0 < a < 1` |
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `osnova-lyubaya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Почему единица и минус не годятся | Nega bir va minus yaramaydi | Why one and a minus do not work |
| `show.1.1` | основание равно единице | asos birga teng | the base equals one |
| `show.1.2` | получилась прямая | to'g'ri chiziq chiqdi | we got a straight line |
| `show.2.1` | основание отрицательное | asos manfiy | the base is negative |
| `show.2.2` | при дробном показателе числа нет | kasr ko'rsatkichda son yo'q | with a fractional exponent there is no number |
| `audio.mount` | Осталось проверить два основания, которые в определении запрещены. | Ta'rifda taqiqlangan ikki asosni tekshirish qoldi. | Two bases forbidden by the definition are left to check. |
| `audio.ban*` | Возьмём единицу. Единица в любой степени это единица, и кривая становится прямой: ни роста, ни убывания, ни новых значений. Теперь возьмём минус два. При показателе одна вторая нужно число, квадрат которого равен минус двум, а квадрат отрицательным не бывает. Поэтому основание берут положительным и не равным единице, и это то же требование, что в прошлом уроке. | Birni olamiz. Bir har qanday darajada bir bo'ladi, va egri chiziq to'g'ri chiziqqa aylanadi: na o'sish, na kamayish, na yangi qiymat. Endi minus ikkini olamiz. Bir ikkidan ko'rsatkichda kvadrati minus ikkiga teng son kerak, kvadrat esa manfiy bo'lmaydi. Shuning uchun asos musbat va birga teng bo'lmagan qilib olinadi, va bu o'tgan darsdagi o'sha talab. | Take one. One to any power is one, and the curve becomes a straight line: no growth, no decay, no new values. Now take minus two. With the exponent one half we need a number whose square is minus two, and a square is never negative. So the base is taken positive and not equal to one, the same requirement as last lesson. |
| `audio.work` | Посчитай сам. Сколько разных значений даёт единица в степени икс? | O'zingiz hisoblang. Bir iks darajada nechta har xil qiymat beradi? | Work it out yourself. How many different values does one to the x give? |
| `work.prompt` | Сколько разных значений даёт единица в степени икс? | Bir iks darajada nechta har xil qiymat beradi? | How many different values does one to the x give? |
| `work.ok` | Одно. Поэтому единицу в основание не берут: новой функции из неё не получается. | Bitta. Shuning uchun bir asos qilib olinmaydi: undan yangi funksiya chiqmaydi. | One. That is why one is not taken as a base: no new function comes out of it. |
| `work.hint.1` | Подставь несколько разных показателей и сравни результаты. | Bir necha har xil ko'rsatkich qo'yib natijalarni solishtiring. | Substitute several different exponents and compare the results. |
| `work.hint.2` | Единица, умноженная на единицу, снова единица. | Bir birga ko'paytirilsa yana bir. | One times one is one again. |
| `work.hint.3` | Одно. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `1^x = 1` |
| `show.2.3` | `a > 0,  a ≠ 1` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Показательная функция | Ko'rsatkichli funksiya | The exponential function |
| `probe.question` | Чем показательная функция отличается от степенной? | Ko'rsatkichli funksiya darajali funksiyadan nimasi bilan farq qiladi? | How does an exponential function differ from a power function? |
| `probe.a` [верно] | переменная стоит в показателе | o'zgaruvchi ko'rsatkichda turadi | the variable stands in the exponent |
| `probe.b` | переменная стоит в основании | o'zgaruvchi asosda turadi | the variable stands in the base |
| `probe.b.hint` | В основании переменная у степенной. Подставь ноль: там выйдет ноль, а не единица. | Asosda o'zgaruvchi darajali funksiyada bo'ladi. Nolni qo'ying: u yerda bir emas, nol chiqadi. | The variable is in the base for a power function. Substitute zero: there you get zero, not one. |
| `rule.lawLabel` | Определение | Ta'rif | The definition |
| `rule.lines.1` | Показательная функция это игрек равен а в степени икс. | Ko'rsatkichli funksiya bu igrek a ning iks darajasiga teng. | An exponential function is y equals a to the x. |
| `rule.lines.2` | Область определения вся прямая, значения только положительные: ноль не входит. | Aniqlanish sohasi butun o'q, qiymatlar faqat musbat: nol kirmaydi. | The domain is the whole line, the values are positive only: zero is out. |
| `rule.lines.3` | Основание больше единицы даёт рост, меньше единицы убывание. | Asos birdan katta bo'lsa o'sish, kichik bo'lsa kamayish beradi. | A base above one gives growth, below one gives decay. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidadan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Кривая с асимптотой остаётся на экране, и правило открывается рядом. Определение взято у учебника слово в слово, а свойства в нём те же, которые мы получили с чертежа. | Asimptotali egri chiziq ekranda qoladi, va qoida yonida ochiladi. Ta'rif darslikdan so'zma-so'z olingan, undagi xossalar esa biz chizmadan olganlarning o'zi. | The curve with its asymptote stays on the screen, and the rule opens beside it. The definition is taken from the textbook word for word, and its properties are the ones we got from the drawing. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `y = a^x,   a > 0,  a ≠ 1` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `vsegda-rastet`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Значение при минус единице | Minus birdagi qiymat | The value at minus one |
| `match.prompt` | Соедини функцию со значением при икс, равном минус единице. | Funksiyani iks minus birga teng bo'lgandagi qiymati bilan birlashtiring. | Match each function with its value at x equal to minus one. |
| `match.ok` | При отрицательном показателе основание переворачивается. Поэтому у растущих кривых слева значения меньше единицы, а у убывающих больше. | Manfiy ko'rsatkichda asos teskari bo'ladi. Shuning uchun o'suvchi egri chiziqlarda chapda qiymatlar birdan kichik, kamayuvchilarda esa katta. | With a negative exponent the base turns over. So on the left the growing curves have values below one and the decreasing ones above. |
| `audio.mount` | Четыре функции и четыре значения. Соедини их. | To'rt funksiya va to'rt qiymat. Ularni birlashtiring. | Four functions and four values. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `y = 2^x` · `y = 4^x` · `y = 0,5^x` · `y = 0,25^x` |
| `match.a` | `1/2` |
| `match.b` | `1/4` |
| `match.c` | `2` |
| `match.d` | `4` |

---

## Экран 10 · `guided` · ответ `build` · формат `table` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Четыре свойства по чертежу | Chizma bo'yicha to'rt xossa | Four properties from the drawing |
| `table.ok` | Четыре свойства закрыты. Все четыре видны на чертеже, а не заучены. | To'rt xossa yopildi. To'rttasi ham chizmada ko'rinadi, yodlanmagan. | Four properties are closed. All four are visible on the drawing, not memorised. |
| `table.wrong` | Смотри на чертёж: вход по горизонтали, выход по вертикали. | Chizmaga qarang: kirish gorizontal bo'yicha, chiqish vertikal bo'yicha. | Look at the drawing: the input along the horizontal, the output along the vertical. |
| `table.swap` | Записи перепутаны местами. Область определения по горизонтали, множество значений по вертикали. | Yozuvlar joy almashgan. Aniqlanish sohasi gorizontal bo'yicha, qiymatlar to'plami vertikal bo'yicha. | The readings are swapped. The domain along the horizontal, the range along the vertical. |
| `audio.mount` | Четыре свойства функции. Каждой строке поставь свою запись. | Funksiyaning to'rt xossasi. Har qatorga o'z yozuvini qo'ying. | Four properties of the function. Give each row its own reading. |

**Формулы**

| Ключ | Значение |
|---|---|
| `table.rows` | `D(y)  →  (−∞; +∞)` · `E(y)  →  (0; +∞)` · `Oy  →  (0; 1)` · `Ox  →  ∅` |
| `table.chips` | `(−∞; +∞)` · `(0; +∞)` · `(0; 1)` · `∅` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Сравни без чертежа | Chizmasiz solishtiring | Compare without a drawing |
| `task.ok` | Вторая. Основание меньше единицы, поэтому больший показатель даёт меньшее значение. | Ikkinchisi. Asos birdan kichik, shuning uchun katta ko'rsatkich kichik qiymat beradi. | The second. The base is less than one, so a bigger exponent gives a smaller value. |
| `task.hint.1` | Посмотри на основание: оно меньше единицы. | Asosga qarang: u birdan kichik. | Look at the base: it is less than one. |
| `task.hint.2` | При таком основании кривая убывает. | Bunday asosda egri chiziq kamayadi. | With such a base the curve decreases. |
| `task.hint.3` | Вторая. | Ikkinchisi. | The second. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какая запись меньше? | Qaysi yozuv kichikroq? | Which reading is smaller? |
| `order.ok` | Основание меньше единицы, поэтому порядок показателей и порядок значений противоположны. | Asos birdan kichik, shuning uchun ko'rsatkichlar tartibi va qiymatlar tartibi qarama-qarshi. | The base is less than one, so the order of the exponents and the order of the values are opposite. |
| `order.bad` | Переведи каждую запись в число, потом сравнивай. | Har yozuvni songa o'tkazing, keyin solishtiring. | Turn each reading into a number, then compare. |
| `audio.mount` | На этом экране чертежа нет. На экзамене его тоже не будет. | Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi. | There is no drawing on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `1)  0,3^{2,1}     2)  0,3^{1,3}` |
| `task.answer` | `2` |
| `order.items` | `0,5²` · `0,5¹` · `0,5⁰` · `0,5^{−1}` |
| `order.answer` | `0,5²  0,5¹  0,5⁰  0,5^{−1}` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ почти верный. Где? | Javob deyarli to'g'ri. Qayerda? | The answer is almost right. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r2` | Это верно: вход берут любой. | Bu to'g'ri: kirish har qanday bo'lishi mumkin. | This is right: any input is allowed. |
| `hint.r4` | Это верное следствие предыдущей строки. | Bu oldingi qatorning to'g'ri natijasi. | This is a correct consequence of the previous line. |
| `proof` | Здесь ноль включили в значения, а кривая до оси не доходит. | Bu yerda nol qiymatlarga kiritilgan, egri chiziq esa o'qqa yetmaydi. | Here zero was included in the values, and the curve does not reach the axis. |
| `entry.prompt` | Какое число попало в ответ лишним? | Javobga qaysi son ortiqcha tushdi? | Which number got into the answer as an extra? |
| `entry.ok` | Ноль. Он остаётся границей, а значением не становится. | Nol. U chegara bo'lib qoladi, qiymat bo'lmaydi. | Zero. It stays a boundary and never becomes a value. |
| `entry.hint.1` | Посмотри на асимптоту. | Asimptotaga qarang. | Look at the asymptote. |
| `entry.hint.2` | Кривая подходит к оси, но не касается. | Egri chiziq o'qqa yaqinlashadi, lekin tegmaydi. | The curve comes close to the axis but does not touch. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `audio.mount` | Задача. Найти множество значений показательной функции. | Masala. Ko'rsatkichli funksiyaning qiymatlar to'plamini topish. | A task. Find the range of an exponential function. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `y = 2^x` |
| `row.r2` | `x ∈ (−∞; +∞)` |
| `row.r3` | `y ≥ 0` |
| `row.r4` | `E(y) = [0; +∞)` |
| `answerId` | `r3` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По точке найди основание | Nuqta bo'yicha asosni toping | From a point back to the base |
| `entry.prompt` | Кривая проходит через точку с абсциссой один и ординатой три. Какое у неё основание? | Egri chiziq abssissasi bir, ordinatasi uch bo'lgan nuqtadan o'tadi. Uning asosi qanday? | The curve passes through the point with abscissa one and ordinate three. What is its base? |
| `entry.ok` | Три. При икс, равном единице, значение равно самому основанию. | Uch. Iks birga teng bo'lganda qiymat asosning o'ziga teng. | Three. At x equal to one the value equals the base itself. |
| `entry.hint.1` | Подставь единицу в показатель. | Ko'rsatkichga birni qo'ying. | Substitute one into the exponent. |
| `entry.hint.2` | Основание в первой степени это оно само. | Asos birinchi darajada bu uning o'zi. | A base to the first power is the base itself. |
| `entry.hint.3` | Три. | Uch. | Three. |
| `multi.prompt` | Отметь все функции, которые возрастают на всей прямой. | Butun o'qda o'suvchi hamma funksiyani belgilang. | Mark every function that grows on the whole line. |
| `multi.title` | Какие функции возрастают на всей прямой? | Qaysi funksiyalar butun o'qda o'sadi? | Which functions grow on the whole line? |
| `multi.c.hint` | Основание меньше единицы, кривая идёт вниз. | Asos birdan kichik, egri chiziq pastga ketadi. | The base is less than one, the curve goes down. |
| `multi.d.hint` | Одна третья меньше единицы, значит функция убывает. | Bir uchdan birdan kichik, demak funksiya kamayadi. | One third is less than one, so the function decreases. |
| `multi.ok` | Две из четырёх. Возрастает та, у которой основание больше единицы. | To'rttadan ikkitasi. Asosi birdan katta bo'lgani o'sadi. | Two out of four. The one with a base greater than one grows. |
| `audio.mount` | Теперь обратная задача. Дана точка, а найти надо основание. | Endi teskari masala. Nuqta berilgan, asosni topish kerak. | Now the inverse task. A point is given, and the base must be found. |
| `audio.work` | Сначала запиши основание, потом отметишь все возрастающие функции. | Avval asosni yozing, keyin hamma o'suvchi funksiyani belgilaysiz. | First type the base, then you will mark every growing function. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.answer` | `3` |
| `multi.a` [верно] | `y = 2^x` |
| `multi.b` [верно] | `y = 1,5^x` |
| `multi.c` | `y = 0,5^x` |
| `multi.d` | `y = (1/3)^x` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `vsegda-rastet`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Где стоит переменная у показательной функции? | Ko'rsatkichli funksiyada o'zgaruvchi qayerda turadi? | Where does the variable stand in an exponential function? |
| `q1.a` [верно] | в показателе | ko'rsatkichda | in the exponent |
| `q1.b` | в основании | asosda | in the base |
| `q1.b.hint` | В основании переменная у степенной функции. | Asosda o'zgaruvchi darajali funksiyada bo'ladi. | The variable is in the base for a power function. |
| `q1.c` | и там и там | ikkalasida ham | in both |
| `q1.c.hint` | Тогда это была бы третья функция, а не показательная. | Unda bu uchinchi funksiya bo'lardi, ko'rsatkichli emas. | Then it would be a third function, not an exponential one. |
| `q1.d` | нигде | hech qayerda | nowhere |
| `q1.d.hint` | Без переменной это просто число, а не функция. | O'zgaruvchisiz bu shunchaki son, funksiya emas. | Without a variable it is just a number, not a function. |
| `q2.prompt` | Какое множество значений у показательной функции? | Ko'rsatkichli funksiyaning qiymatlar to'plami qanday? | What is the range of an exponential function? |
| `q2.a` [верно] | положительные числа | musbat sonlar | the positive numbers |
| `q2.b` | все числа | hamma son | all numbers |
| `q2.b.hint` | Отрицательное значение кривая не даёт: она вся выше оси. | Egri chiziq manfiy qiymat bermaydi: u butunlay o'qdan yuqorida. | The curve gives no negative value: it lies entirely above the axis. |
| `q2.c` | от нуля до единицы | noldan birgacha | from zero to one |
| `q2.c.hint` | Справа кривая уходит выше единицы без предела. | O'ngda egri chiziq birdan yuqoriga cheksiz ketadi. | On the right the curve goes above one without limit. |
| `q2.d` | целые числа | butun sonlar | the whole numbers |
| `q2.d.hint` | Между целыми кривая тоже проходит, значений там сколько угодно. | Butun sonlar orasidan ham egri chiziq o'tadi, u yerda qiymatlar qancha bo'lsa ham bor. | The curve passes between the whole numbers too, with any number of values there. |
| `q3.prompt` | При каком основании функция убывает? | Qaysi asosda funksiya kamayadi? | With which base does the function decrease? |
| `q3.a` [верно] | меньше единицы | birdan kichik | less than one |
| `q3.a.ok` | Да. Шаг вправо делит значение, а не умножает. | Ha. O'ngga qadam qiymatni bo'ladi, ko'paytirmaydi. | Yes. A step right divides the value instead of multiplying it. |
| `q3.b` | больше единицы | birdan katta | greater than one |
| `q3.b.hint` | При таком основании шаг вправо умножает, и кривая растёт. | Bunday asosda o'ngga qadam ko'paytiradi, va egri chiziq o'sadi. | With such a base a step right multiplies, and the curve grows. |
| `q3.c` | любом | har qanday | any |
| `q3.c.hint` | Две кривые на экране шли в разные стороны, значит основание решает. | Ekrandagi ikki egri chiziq har xil tomonga ketdi, demak asos hal qiladi. | The two curves on the screen went opposite ways, so the base decides. |
| `q3.d` | отрицательном | manfiy | negative |
| `q3.d.hint` | Отрицательное основание в показательной функции не берут вовсе. | Manfiy asos ko'rsatkichli funksiyada umuman olinmaydi. | A negative base is not taken in an exponential function at all. |
| `q4.prompt` | Через какую точку проходит любая показательная кривая? | Har qanday ko'rsatkichli egri chiziq qaysi nuqtadan o'tadi? | Which point does every exponential curve pass through? |
| `q4.a` [верно] | абсцисса ноль, ордината один | abssissasi nol, ordinatasi bir | abscissa zero, ordinate one |
| `q4.b` | начало координат | koordinatalar boshi | the origin |
| `q4.b.hint` | В начале координат ордината ноль, а кривая нуля не даёт. | Koordinatalar boshida ordinata nol, egri chiziq esa nol bermaydi. | At the origin the ordinate is zero, and the curve never gives zero. |
| `q4.c` | абсцисса один, ордината ноль | abssissasi bir, ordinatasi nol | abscissa one, ordinate zero |
| `q4.c.hint` | При икс, равном единице, значение равно основанию, а не нулю. | Iks birga teng bo'lganda qiymat asosga teng, nolga emas. | At x equal to one the value equals the base, not zero. |
| `q4.d` | ни через какую общую | birorta umumiy nuqtadan ham | through no common point |
| `q4.d.hint` | Нулевой показатель даёт единицу при любом основании, значит точка общая. | Nol ko'rsatkich har qanday asosda bir beradi, demak nuqta umumiy. | The zero exponent gives one for any base, so the point is common. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `y = a^x` |
| `q2.done` | `E(y) = (0; +∞)` |
| `q3.done` | `0 < a < 1` |
| `q4.done` | `(0; 1)` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Отличаю показательную функцию от степенной подстановкой | Ko'rsatkichli funksiyani darajalidan qiymat qo'yib ajrataman | I tell an exponential function from a power one by substitution |
| `can.2` | Знаю область определения и множество значений | Aniqlanish sohasini va qiymatlar to'plamini bilaman | I know the domain and the range |
| `can.3` | Направление читаю по основанию | Yo'nalishni asos bo'yicha o'qiyman | I read the direction from the base |
| `can.4` | Знаю, почему ноль в значения не входит | Nol nega qiymatlarga kirmasligini bilaman | I know why zero is not in the range |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: множество значений. | Bitta joy takrorlashni talab qiladi: qiymatlar to'plami. | One place needs review: the range. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va 5-ekranga qayting. | Go back to the rule and to screen 5. |
| `bridge` | Дальше кривую встретит горизонталь, и получится показательное уравнение. | Keyin egri chiziqni gorizontal uchratadi, va ko'rsatkichli tenglama chiqadi. | Next a horizontal will meet the curve, and an exponential equation appears. |
| `lifehack` | Забыл, куда идёт кривая, подставь ноль и единицу. Двух точек хватает, чтобы увидеть направление. | Egri chiziq qayoqqa ketishini esdan chiqardingizmi, nol va birni qo'ying. Yo'nalishni ko'rish uchun ikki nuqta yetadi. | Forgot which way the curve goes, substitute zero and one. Two points are enough to see the direction. |
| `sheetTitle` | Показательная функция · шпаргалка | Ko'rsatkichli funksiya · shpargalka | The exponential function · cheat sheet |
| `sheetSrc` | 10 класс · урок 27 | 10-sinf · 27-dars | Grade 10 · lesson 27 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija. | At the start you had to choose one of two readings. Here is the result. |
| `audio.next` | Кривая подходит к оси сколь угодно близко и не касается её. Ноль остаётся границей значений, а значением не становится. | Egri chiziq o'qqa qanchalik yaqin kelsa ham tegmaydi. Nol qiymatlarning chegarasi bo'lib qoladi, qiymat bo'lmaydi. | The curve comes as close to the axis as you like and never touches it. Zero stays the boundary of the values and never becomes one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `2^x = 0` |
| `hook.b` | `2^x > 0` |
| `proved` | `2^x > 0` |
| `law` | `y = a^x,   a > 0,  a ≠ 1` |
| `sheet.1` | `D(y) = (−∞; +∞)` |
| `sheet.2` | `E(y) = (0; +∞)` |
| `sheet.3` | `(0; 1)` |
| `sheet.4` | `a > 1   →   ↑` |
| `sheet.5` | `0 < a < 1   →   ↓` |
