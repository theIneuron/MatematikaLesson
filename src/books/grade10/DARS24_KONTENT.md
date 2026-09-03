# Урок 35 — Показательные и логарифмические неравенства · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS32_36_SKELET.md` §10. Опора в учебнике: алгебра 2022, стр. 102–103 и 123–125,
параграфы `KO'RSATKICHLI TENGSIZLIKLAR` и `LOGARIFMIK TENGSIZLIKLAR`.

**Главное решение урока.** Учебник решает логарифмическое неравенство **геометрически**, стр. 123:
решение — те икс, при которых график лежит **ниже прямой**. Мы берём именно этот ход, а не правило
про переворот знака. Переворот тогда не заучивается: у растущей кривой участок «ниже прямой» лежит
слева от встречи, у убывающей — справа, и это видно на чертеже.

**Точка встречи та же, что в уроке 28.** Уравнение спрашивало, **где** горизонталь встречает
кривую; неравенство спрашивает, **с какой стороны**. Чертёж один и тот же, вопрос другой.

**Прибор 5 возвращается на экране 7**: у логарифмического неравенства к участку добавляется
полоса допустимых значений, и берут пересечение.

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НЕРАВЕНСТВО | TENGSIZLIK | THE INEQUALITY |
| `title` | Больше или меньше минус двух | Minus ikkidan kattami yoki kichikmi | Greater or less than minus two |
| `row.a.name` | знак оставили как был | ishorani avvalgidek qoldirdik | the sign was left as it was |
| `row.b.name` | знак перевернули | ishorani ag'dardik | the sign was flipped |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посмотрим на чертёж. | Javobingiz yozib olindi. Endi chizmaga qaraymiz. | Your answer is saved. Now we will look at the drawing. |
| `audio.mount` | Ноль целых пять десятых в степени икс больше четырёх. Основание меньше единицы, и это здесь главное. | Nol butun besh o'ndan iks darajada to'rtdan katta. Asos birdan kichik, va bu yerda asosiysi shu. | Zero point five to the power x is greater than four. The base is less than one, and that is what matters here. |
| `audio.r1` | Первая запись читает так же, как читали бы уравнение: раз в степени минус два выходит четыре, то икс больше минус двух. | Birinchi yozuv tenglamani o'qigandek o'qiydi: minus ikkinchi darajada to'rt chiqar ekan, demak iks minus ikkidan katta. | The first reading goes just as one would read an equation: since the power minus two gives four, then x is greater than minus two. |
| `audio.r2` | Вторая говорит, что знак надо перевернуть, и верно обратное: икс меньше минус двух. | Ikkinchisi ishorani ag'darish kerak deydi, va aksi to'g'ri: iks minus ikkidan kichik. | The second says the sign must be flipped, and the opposite holds: x is less than minus two. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `0,5^x > 4` |
| `row.a.value` | `x > −2` |
| `row.b.value` | `x < −2` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед неравенством | Tengsizlikdan oldin uch savol | Three questions before the inequality |
| `q1.prompt` | Что делает показательная кривая при основании меньше единицы? | Asos birdan kichik bo'lganda ko'rsatkichli egri chiziq nima qiladi? | What does an exponential curve do when the base is less than one? |
| `q1.a` [верно] | убывает | kamayadi | it decreases |
| `q1.b` | растёт | o'sadi | it grows |
| `q1.b.hint` | Растёт она при основании больше единицы. | U asos birdan katta bo'lganda o'sadi. | It grows when the base is greater than one. |
| `q1.c` | остаётся прямой | to'g'ri chiziq bo'lib qoladi | it stays a straight line |
| `q1.c.hint` | Прямая выходит только при основании, равном единице. | To'g'ri chiziq faqat asos birga teng bo'lganda chiqadi. | A straight line comes only when the base equals one. |
| `q1.d` | зависит от икс | iksga bog'liq | it depends on x |
| `q1.d.hint` | Направление у неё одно на всей прямой. | Uning yo'nalishi butun chiziqda bitta. | Its direction is the same along the whole line. |
| `q2.prompt` | При каком икс двойка в степени икс равна восьми? | Ikkining iks darajasi qaysi iksda sakkizga teng? | For which x does two to the power x equal eight? |
| `q2.a` [верно] | три | uch | three |
| `q2.b` | четыре | to'rt | four |
| `q2.b.hint` | Четыре вышло бы делением, а нужен показатель. | To'rt bo'lish bilan chiqardi, ko'rsatkich kerak esa. | Four would come from dividing, and an exponent is what is needed. |
| `q2.c` | восемь | sakkiz | eight |
| `q2.c.hint` | Восемь это значение, а спросили про икс. | Sakkiz qiymat, savol esa iks haqida. | Eight is the value, and the question was about x. |
| `q2.d` | два | ikki | two |
| `q2.d.hint` | Два в квадрате даёт четыре, а не восемь. | Ikkining kvadrati to'rt beradi, sakkiz emas. | Two squared gives four, not eight. |
| `q3.prompt` | Какое число может стоять под знаком логарифма? | Logarifm belgisi ostida qanday son turishi mumkin? | Which number can stand under a logarithm sign? |
| `q3.a` [верно] | только положительное | faqat musbat | only a positive one |
| `q3.b` | любое | har qanday | any |
| `q3.b.hint` | Кривая слева от нуля не проходит вовсе. | Egri chiziq noldan chapda umuman o'tmaydi. | The curve does not pass to the left of zero at all. |
| `q3.c` | любое, кроме нуля | noldan boshqa har qanday | any except zero |
| `q3.c.hint` | Отрицательные тоже выпадают, а не только ноль. | Manfiylar ham tushib qoladi, faqat nol emas. | The negatives drop out too, not only zero. |
| `q3.d` | только целое | faqat butun | only a whole number |
| `q3.d.hint` | Дробное годится, лишь бы положительное. | Kasr yaraydi, faqat musbat bo'lsa. | A fractional one works, as long as it is positive. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `0 < a < 1` |
| `q2.done` | `2^x = 8   →   x = 3` |
| `q3.done` | `x > 0` |

---

## Экран 3 · `explain1` · ответ `number` · тег `osnovanie-menshe-odnogo`

Растущая кривая: участок ниже прямой лежит слева.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Ответ это сторона, а не точка | Javob tomon, nuqta emas | The answer is a side, not a point |
| `show.1.1` | кривая растёт, прямая на уровне четыре | egri chiziq o'sadi, to'g'ri chiziq to'rt darajada | the curve grows, the line is at level four |
| `show.1.2` | встреча приходится на двойку | uchrashuv ikkiga to'g'ri keladi | the meeting falls on two |
| `show.1.3` | это ответ уравнения, но не неравенства | bu tenglamaning javobi, tengsizlikniki emas | that is the answer of the equation, not of the inequality |
| `show.2.1` | закрашено там, где кривая ниже | egri chiziq pastroq bo'lgan joy bo'yalgan | the shading is where the curve is lower |
| `show.2.2` | у растущей кривой это слева | o'suvchi egri chiziqda bu chapda | for a growing curve that is on the left |
| `show.2.3` | ответ это луч, а не число | javob nur, son emas | the answer is a ray, not a number |
| `audio.mount` | Возьмём знакомую кривую и знакомую горизонталь. Всё это уже было в уроке про показательные уравнения. | Tanish egri chiziq va tanish gorizontalni olamiz. Bularning hammasi ko'rsatkichli tenglamalar darsida bo'lgan. | Let us take the familiar curve and the familiar horizontal. All of this was in the lesson on exponential equations. |
| `audio.side*` | Кривая двойка в степени икс растёт, прямая стоит на уровне четыре. Встречаются они в одной точке, и приходится встреча на двойку. Раньше на этом мы бы остановились: у уравнения ответ два. Но у нас неравенство, и вопрос другой. Спрашивают не где встреча, а где кривая ниже прямой. Смотри: слева от двойки кривая идёт под прямой, справа над ней. Значит ответ это весь луч левее двойки. Точка встречи никуда не делась, но она стала границей ответа, а не самим ответом. | Ikkining iks darajasi egri chizig'i o'sadi, to'g'ri chiziq to'rt darajada turadi. Ular bitta nuqtada uchrashadi, uchrashuv esa ikkiga to'g'ri keladi. Ilgari biz shu yerda to'xtardik: tenglamaning javobi ikki. Lekin bizda tengsizlik, savol esa boshqa. Uchrashuv qayerda emas, egri chiziq qayerda to'g'ri chiziqdan past ekani so'ralyapti. Qarang: ikkidan chapda egri chiziq to'g'ri chiziq ostidan boradi, o'ngda esa ustidan. Demak javob ikkidan chapdagi butun nur. Uchrashuv nuqtasi hech qayerga ketgani yo'q, lekin u javobning o'zi emas, chegarasi bo'lib qoldi. | The curve two to the power x grows, the line stands at level four. They meet at a single point, and the meeting falls on two. Earlier we would have stopped there: the equation has the answer two. But we have an inequality, and the question is different. It asks not where they meet, but where the curve is below the line. Look: to the left of two the curve runs under the line, to the right above it. So the answer is the whole ray to the left of two. The meeting point has not gone anywhere, but it has become the boundary of the answer rather than the answer itself. |
| `audio.work` | Посчитай сам. При каком икс кривая встречает прямую? | O'zingiz hisoblang. Egri chiziq qaysi iksda to'g'ri chiziqni uchratadi? | Work it out yourself. At which x does the curve meet the line? |
| `work.prompt` | При каком икс встреча? | Uchrashuv qaysi iksda? | At which x is the meeting? |
| `work.ok` | При двойке. Два в квадрате равно четырём, и это граница ответа. | Ikkida. Ikkining kvadrati to'rtga teng, va bu javobning chegarasi. | At two. Two squared equals four, and that is the boundary of the answer. |
| `work.hint.1` | Найди, в какой степени двойка даёт четыре. | Ikki qaysi darajada to'rt berishini toping. | Find the power at which two gives four. |
| `work.hint.2` | Посмотри, где кривая пересекает горизонталь. | Egri chiziq gorizontalni qayerda kesib o'tishiga qarang. | See where the curve crosses the horizontal. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `2^x < 4` |
| `work.answer` | `2` |

---

## Экран 4 · `explain2` · ответ `order` · тег `osnovanie-menshe-odnogo`

Разграничение: уравнение и неравенство на одном чертеже.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Один чертёж, два вопроса | Bitta chizma, ikki savol | One drawing, two questions |
| `show.1.1` | уравнение спрашивает где встреча | tenglama uchrashuv qayerdaligini so'raydi | the equation asks where they meet |
| `show.1.2` | ответ там одно число | javob u yerda bitta son | the answer there is a single number |
| `show.1.3` | чертёж при этом тот же самый | chizma esa o'sha-o'sha | the drawing is the very same |
| `show.2.1` | неравенство спрашивает с какой стороны | tengsizlik qaysi tomondan ekanini so'raydi | the inequality asks on which side |
| `show.2.2` | ответ там целый луч | javob u yerda butun nur | the answer there is a whole ray |
| `show.2.3` | число стало границей | son chegaraga aylandi | the number became a boundary |
| `audio.mount` | Сравним два вопроса на одном и том же чертеже. | Bir xil chizmada ikki savolni solishtiramiz. | Let us compare two questions on one and the same drawing. |
| `audio.two*` | Первый вопрос: при каком икс двойка в степени икс равна четырём. Это уравнение, и ответ у него один, двойка. Второй вопрос: при каких икс двойка в степени икс меньше четырёх. Это неравенство, и ответ у него бесконечно много чисел, весь луч левее двойки. Чертёж при этом один и тот же, и точка встречи одна и та же. Меняется только то, что мы с неё читаем. Именно поэтому решать неравенство отдельно от чертежа опасно: с чертежа сторона видна, а из одной формулы её приходится угадывать. | Birinchi savol: ikkining iks darajasi qaysi iksda to'rtga teng. Bu tenglama, uning javobi bitta, ikkilik. Ikkinchi savol: ikkining iks darajasi qaysi iksda to'rtdan kichik. Bu tengsizlik, uning javobi cheksiz ko'p son, ikkidan chapdagi butun nur. Chizma esa bitta, uchrashuv nuqtasi ham bitta. Faqat undan nima o'qiyotganimiz o'zgaradi. Aynan shuning uchun tengsizlikni chizmadan ajratib yechish xavfli: chizmada tomon ko'rinadi, bitta formuladan esa uni taxmin qilishga to'g'ri keladi. | The first question: at which x does two to the power x equal four. That is an equation, and it has one answer, two. The second question: for which x is two to the power x less than four. That is an inequality, and it has infinitely many answers, the whole ray to the left of two. The drawing is the same, and the meeting point is the same. Only what we read from it changes. This is exactly why solving an inequality away from the drawing is dangerous: on the drawing the side is visible, from a formula alone it has to be guessed. |
| `audio.work` | Расставь шаги в том порядке, в котором мы читали чертёж. | Chizmani o'qigan tartibimizda qadamlarni joylashtiring. | Put the steps in the order in which we read the drawing. |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | горизонталь встречает кривую | gorizontal egri chiziqni uchratadi | the horizontal meets the curve |
| `order.s2` | встреча даёт число | uchrashuv son beradi | the meeting gives a number |
| `order.s3` | смотрим, где кривая ниже | egri chiziq qayerda pastroq ekaniga qaraymiz | we see where the curve is lower |
| `order.s4` | берём эту сторону | shu tomonni olamiz | we take that side |
| `order.ok` | Верно. Встреча первая, сторона вторая, и порядок этот не меняется. | To'g'ri. Uchrashuv birinchi, tomon ikkinchi, bu tartib o'zgarmaydi. | Correct. The meeting comes first, the side second, and this order does not change. |
| `order.bad` | Сторону нельзя выбрать, пока не найдена встреча. | Uchrashuv topilmaguncha tomonni tanlab bo'lmaydi. | You cannot choose a side until the meeting is found. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `2^x = 4   →   x = 2` |

---

## Экран 5 · `explain3` · ответ `number` · тег `osnovanie-menshe-odnogo`

Убывающая кривая: участок переезжает на другую сторону.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Кривая пошла вниз, участок переехал | Egri chiziq pastga ketdi, bo'lak ko'chdi | The curve went down, the piece moved |
| `show.1.1` | основание меньше единицы | asos birdan kichik | the base is less than one |
| `show.1.2` | кривая убывает слева направо | egri chiziq chapdan o'ngga kamayadi | the curve decreases from left to right |
| `show.1.3` | встреча приходится на минус два | uchrashuv minus ikkiga to'g'ri keladi | the meeting falls on minus two |
| `show.2.1` | выше прямой теперь слева | to'g'ri chiziqdan yuqorisi endi chapda | above the line is now on the left |
| `show.2.2` | значит ответ левее минус двух | demak javob minus ikkidan chapda | so the answer is left of minus two |
| `show.2.3` | знак перевернулся сам собой | ishora o'zidan-o'zi ag'darildi | the sign flipped by itself |
| `audio.mount` | Возвращаемся к неравенству из начала урока. Основание меньше единицы. | Dars boshidagi tengsizlikka qaytamiz. Asos birdan kichik. | Back to the inequality from the beginning of the lesson. The base is less than one. |
| `audio.flip*` | Кривая теперь убывает: чем больше икс, тем меньше значение. Горизонталь на уровне четыре встречает её при минус двух, и это легко проверить: ноль целых пять десятых в степени минус два равно четырём. А дальше внимательно. Нам нужно, где кривая ВЫШЕ прямой, потому что в неравенстве стоит знак больше. У растущей кривой выше было справа, а у этой всё наоборот: слева. Значит ответ это луч левее минус двух. Обрати внимание, знака мы не переворачивали. Он перевернулся сам, потому что кривая пошла в другую сторону. Заучивать тут нечего, надо просто смотреть на чертёж. | Egri chiziq endi kamayadi: iks qancha katta bo'lsa, qiymat shuncha kichik. To'rt darajadagi gorizontal uni minus ikkida uchratadi, buni tekshirish oson: nol butun besh o'ndanning minus ikkinchi darajasi to'rtga teng. Keyin esa diqqat bilan. Bizga egri chiziq to'g'ri chiziqdan YUQORI bo'lgan joy kerak, chunki tengsizlikda katta ishorasi turibdi. O'suvchi egri chiziqda yuqorisi o'ngda edi, bunisida esa aksincha: chapda. Demak javob minus ikkidan chapdagi nur. E'tibor bering, biz ishorani ag'darmadik. U o'zi ag'darildi, chunki egri chiziq boshqa tomonga ketdi. Bu yerda yodlaydigan narsa yo'q, shunchaki chizmaga qarash kerak. | The curve now decreases: the bigger x is, the smaller the value. The horizontal at level four meets it at minus two, and that is easy to check: zero point five to the minus two equals four. Now pay attention. We need where the curve is ABOVE the line, because the inequality has a greater-than sign. For a growing curve, above was on the right; for this one it is the opposite: on the left. So the answer is the ray to the left of minus two. Notice that we did not flip any sign. It flipped by itself, because the curve went the other way. There is nothing to memorise here, one just has to look at the drawing. |
| `audio.work` | Посчитай сам. При каком икс встреча? | O'zingiz hisoblang. Uchrashuv qaysi iksda? | Work it out yourself. At which x is the meeting? |
| `work.prompt` | При каком икс встреча? | Uchrashuv qaysi iksda? | At which x is the meeting? |
| `work.ok` | При минус двух. Ноль целых пять десятых в степени минус два равно четырём. | Minus ikkida. Nol butun besh o'ndanning minus ikkinchi darajasi to'rtga teng. | At minus two. Zero point five to the minus two equals four. |
| `work.hint.1` | Степень с отрицательным показателем переворачивает дробь. | Manfiy ko'rsatkichli daraja kasrni ag'daradi. | A negative exponent turns the fraction over. |
| `work.hint.2` | Две в квадрате это четыре, значит показатель отрицательный. | Ikkining kvadrati to'rt, demak ko'rsatkich manfiy. | Two squared is four, so the exponent is negative. |
| `work.hint.3` | Минус два. | Minus ikki. | Minus two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `0,5^x > 4` |
| `work.answer` | `−2` |

---

## Экран 6 · `explain4` · ответ `number` · тег `odz-logarifma`

Сам: та же горизонталь на логарифмической кривой.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Та же работа на другой кривой | O'sha ish boshqa egri chiziqda | The same work on another curve |
| `show.1.1` | кривая логарифмическая, растущая | egri chiziq logarifmik, o'suvchi | the curve is logarithmic and growing |
| `show.1.2` | горизонталь на уровне три | gorizontal uch darajada | the horizontal is at level three |
| `show.1.3` | ниже прямой лежит слева | to'g'ri chiziqdan pasti chapda yotadi | below the line lies on the left |
| `show.2.1` | но слева кривая обрывается | lekin chapda egri chiziq uziladi | but on the left the curve breaks off |
| `show.2.2` | до нуля она не доходит | u nolgacha yetmaydi | it does not reach zero |
| `show.2.3` | значит у ответа два конца | demak javobning ikki uchi bor | so the answer has two ends |
| `audio.mount` | Работа та же, кривая другая. Здесь появится то, чего у показательной не было. | Ish o'sha, egri chiziq boshqa. Bu yerda ko'rsatkichlida bo'lmagan narsa paydo bo'ladi. | The same work, a different curve. Here something appears that the exponential did not have. |
| `audio.log*` | Логарифмическая кривая растёт, и горизонталь на уровне три встречает её при восьми: два в кубе равно восьми. Ниже прямой кривая идёт слева от этой точки, значит икс меньше восьми. Но посмотри на левый край. Кривая не доходит до вертикальной оси и слева от нуля не существует вовсе. Значит одним неравенством ответ не описать: сверху он ограничен восьмёркой, а снизу нулём. У показательного неравенства такого не было, там кривая шла по всей прямой. Вот и разница между двумя семействами, и она не в правилах, а в том, где кривая живёт. | Logarifmik egri chiziq o'sadi, uch darajadagi gorizontal uni sakkizda uchratadi: ikkining kubi sakkizga teng. To'g'ri chiziqdan past qismda egri chiziq shu nuqtadan chapda boradi, demak iks sakkizdan kichik. Lekin chap chekkaga qarang. Egri chiziq tik o'qqa yetmaydi va noldan chapda umuman mavjud emas. Demak javobni bitta tengsizlik bilan yozib bo'lmaydi: yuqoridan u sakkiz bilan, pastdan nol bilan chegaralangan. Ko'rsatkichli tengsizlikda bunday bo'lmagan, u yerda egri chiziq butun chiziq bo'ylab borardi. Ikki oila orasidagi farq ana shu, va u qoidalarda emas, egri chiziq qayerda yashashida. | The logarithmic curve grows, and the horizontal at level three meets it at eight: two cubed equals eight. Below the line the curve runs to the left of that point, so x is less than eight. But look at the left edge. The curve does not reach the vertical axis and does not exist to the left of zero at all. So the answer cannot be written with one inequality: from above it is bounded by eight, from below by zero. The exponential inequality had nothing of the kind, there the curve ran along the whole line. That is the difference between the two families, and it lies not in the rules but in where the curve lives. |
| `audio.work` | Посчитай сам. Каким числом ответ ограничен сверху? | O'zingiz hisoblang. Javob yuqoridan qaysi son bilan chegaralangan? | Work it out yourself. Which number bounds the answer from above? |
| `work.prompt` | Чем ответ ограничен сверху? | Javob yuqoridan nima bilan chegaralangan? | What bounds the answer from above? |
| `work.ok` | Восьмёркой. Два в кубе равно восьми, и там встреча. | Sakkiz bilan. Ikkining kubi sakkizga teng, uchrashuv o'sha yerda. | By eight. Two cubed equals eight, and the meeting is there. |
| `work.hint.1` | Найди, при каком икс логарифм равен трём. | Logarifm qaysi iksda uchga tengligini toping. | Find the x at which the logarithm equals three. |
| `work.hint.2` | Два в кубе. | Ikkining kubi. | Two cubed. |
| `work.hint.3` | Восемь. | Sakkiz. | Eight. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `log₂ x < 3` |
| `work.answer` | `8` |

---

## Экран 7 · `explain5` · ответ `number` · тег `odz-logarifma`

Граничный: полоса допустимых значений и пересечение.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Ответ это пересечение двух условий | Javob ikki shartning kesishmasi | The answer is the intersection of two conditions |
| `show.1.1` | под знаком теперь икс минус один | belgi ostida endi iks minus bir | now x minus one stands under the sign |
| `show.1.2` | полоса начинается справа от единицы | polosa birdan o'ngda boshlanadi | the band starts to the right of one |
| `show.1.3` | это первое условие | bu birinchi shart | that is the first condition |
| `show.2.1` | по кривой выходит икс меньше девяти | egri chiziq bo'yicha iks to'qqizdan kichik chiqadi | from the curve x is less than nine |
| `show.2.2` | это второе условие | bu ikkinchi shart | that is the second condition |
| `show.2.3` | берут то, где верны оба | ikkalasi to'g'ri bo'lgan joy olinadi | you take where both hold |
| `audio.mount` | Последний случай урока. Под знаком логарифма стоит уже не икс, а выражение. | Darsning oxirgi holi. Logarifm belgisi ostida endi iks emas, ifoda turibdi. | The last case of the lesson. Under the logarithm sign there is no longer x but an expression. |
| `audio.band*` | Сначала полоса, как в уроке про логарифмические уравнения. Под знаком стоит икс минус один, значит икс минус один больше нуля, то есть икс больше единицы. Полоса начинается справа от единицы, и сама единица выколота. Теперь само неравенство. Логарифм меньше трёх, а три это логарифм восьми, значит икс минус один меньше восьми, отсюда икс меньше девяти. Условий получилось два, и выполняться они должны сразу. Берём пересечение: икс больше единицы и меньше девяти. Заметь, если полосу не начертить, ответом окажется всё, что меньше девяти, включая ноль и отрицательные числа, а при них логарифма просто нет. | Avval polosa, logarifmik tenglamalar darsidagi kabi. Belgi ostida iks minus bir turibdi, demak iks minus bir noldan katta, ya'ni iks birdan katta. Polosa birdan o'ngda boshlanadi, birning o'zi esa ochiq qoldiriladi. Endi tengsizlikning o'zi. Logarifm uchdan kichik, uch esa sakkizning logarifmi, demak iks minus bir sakkizdan kichik, bundan iks to'qqizdan kichik. Shart ikkita bo'ldi, ular bir vaqtda bajarilishi kerak. Kesishmani olamiz: iks birdan katta va to'qqizdan kichik. Sezing, polosa chizilmasa, javob to'qqizdan kichik hamma narsa bo'lib chiqadi, nol va manfiy sonlar bilan birga, ularda esa logarifm umuman yo'q. | First the band, as in the lesson on logarithmic equations. Under the sign stands x minus one, so x minus one is greater than zero, that is, x is greater than one. The band starts to the right of one, and one itself is punched out. Now the inequality itself. The logarithm is less than three, and three is the logarithm of eight, so x minus one is less than eight, which gives x less than nine. That makes two conditions, and both must hold at once. We take the intersection: x greater than one and less than nine. Notice that without drawing the band the answer would be everything less than nine, including zero and the negatives, and at those the logarithm simply does not exist. |
| `audio.work` | Посчитай сам. С какого числа начинается полоса? | O'zingiz hisoblang. Polosa qaysi sondan boshlanadi? | Work it out yourself. From which number does the band start? |
| `work.prompt` | С какого числа начинается полоса? | Polosa qaysi sondan boshlanadi? | From which number does the band start? |
| `work.ok` | С единицы. Икс минус один должно быть больше нуля. | Birdan. Iks minus bir noldan katta bo'lishi kerak. | From one. X minus one has to be greater than zero. |
| `work.hint.1` | Выпиши условие для того, что стоит под знаком. | Belgi ostidagi uchun shartni yozing. | Write the condition for what stands under the sign. |
| `work.hint.2` | Икс минус один больше нуля. | Iks minus bir noldan katta. | X minus one is greater than zero. |
| `work.hint.3` | Один. | Bir. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.expr` | `log₂ (x − 1) < 3` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `osnovanie-menshe-odnogo`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Сторону читают с чертежа | Tomon chizmadan o'qiladi | The side is read from the drawing |
| `probe.question` | Отчего зависит, с какой стороны лежит ответ? | Javob qaysi tomonda yotishi nimaga bog'liq? | What decides on which side the answer lies? |
| `probe.a` [верно] | от направления кривой | egri chiziqning yo'nalishiga | on the direction of the curve |
| `probe.b` | от того, какое число справа | o'ngda qanday son turganiga | on which number is on the right |
| `probe.b.hint` | Число справа задаёт высоту прямой, а не сторону. | O'ngdagi son to'g'ri chiziqning balandligini beradi, tomonni emas. | The number on the right sets the height of the line, not the side. |
| `rule.lawLabel` | КАК РЕШАТЬ | QANDAY YECHILADI | HOW TO SOLVE |
| `rule.lines.1` | у логарифмического сначала полоса допустимых значений | logarifmikda avval joiz qiymatlar polosasi | for a logarithmic one, the band of admissible values first |
| `rule.lines.2` | горизонталь встречает кривую, встреча даёт границу | gorizontal egri chiziqni uchratadi, uchrashuv chegara beradi | the horizontal meets the curve, the meeting gives the boundary |
| `rule.lines.3` | сторона берётся с чертежа, при убывающей она другая | tomon chizmadan olinadi, kamayuvchida u boshqacha | the side is taken from the drawing, for a decreasing curve it is the other one |
| `audio.mount` | Соберём правило. Оно короткое, потому что главное в нём читается с чертежа. | Qoidani yig'amiz. U qisqa, chunki undagi asosiy narsa chizmadan o'qiladi. | Let us put the rule together. It is short, because the main part of it is read from the drawing. |
| `audio.rule*` | Первое: если неравенство логарифмическое, начерти полосу допустимых значений до всякого решения. Второе: проведи горизонталь на уровне правой части и найди встречу с кривой, это граница ответа. Третье: посмотри, с какой стороны от встречи кривая удовлетворяет знаку, и возьми эту сторону. У растущей кривой и у убывающей стороны разные, и это единственное место, где ошибаются. В учебнике то же самое сказано словами: решение это те икс, при которых график лежит ниже прямой. | Birinchi: agar tengsizlik logarifmik bo'lsa, har qanday yechimdan oldin joiz qiymatlar polosasini chizing. Ikkinchi: o'ng tarafning darajasida gorizontal o'tkazing va egri chiziq bilan uchrashuvni toping, bu javobning chegarasi. Uchinchi: uchrashuvning qaysi tomonida egri chiziq ishorani qanoatlantirishiga qarang va shu tomonni oling. O'suvchi va kamayuvchi egri chiziqda tomonlar har xil, va xato qilinadigan yagona joy shu. Darslikda ham xuddi shu so'z bilan aytilgan: yechim bu grafik to'g'ri chiziqdan pastda joylashgan ikslar. | First: if the inequality is logarithmic, draw the band of admissible values before any solving. Second: draw the horizontal at the level of the right side and find its meeting with the curve, that is the boundary of the answer. Third: look at which side of the meeting the curve satisfies the sign, and take that side. For a growing and for a decreasing curve the sides differ, and that is the only place where mistakes happen. The textbook says the same in words: the solution is those x at which the graph lies below the line. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `log_a f(x) < b,   f(x) > 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `osnovanie-menshe-odnogo`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини неравенство с ответом | Tengsizlikni javobi bilan ulang | Match each inequality with its answer |
| `match.prompt` | Два основания больше единицы, одно меньше | Ikki asos birdan katta, bittasi kichik | Two bases are greater than one, one is less |
| `match.ok` | Верно. Единственное убывающее основание дало единственный перевёрнутый знак. | To'g'ri. Yagona kamayuvchi asos yagona ag'darilgan ishorani berdi. | Correct. The one decreasing base gave the one flipped sign. |
| `audio.mount` | Четыре неравенства и четыре ответа. Смотри сначала на основание. | To'rt tengsizlik va to'rt javob. Avval asosga qarang. | Four inequalities and four answers. Look at the base first. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `2^x > 8` · `0,5^x > 8` · `log₂ x < 4` · `log₂ x > 0` |
| `match.a` | `x > 3` |
| `match.b` | `x < −3` |
| `match.c` | `0 < x < 16` |
| `match.d` | `x > 1` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `odz-logarifma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Реши неравенство целиком | Tengsizlikni to'liq yeching | Solve the inequality from start to finish |
| `order.prompt` | Расставь шаги решения по порядку | Yechish qadamlarini tartib bilan joylashtiring | Put the solution steps in order |
| `order.s1` | начертить полосу | polosa chizish | draw the band |
| `order.s2` | найти встречу | uchrashuvni topish | find the meeting |
| `order.s3` | выбрать сторону | tomonni tanlash | choose the side |
| `order.s4` | взять пересечение | kesishmani olish | take the intersection |
| `order.ok` | Верно. Полоса первая, пересечение последнее. | To'g'ri. Polosa birinchi, kesishma oxirgi. | Correct. The band first, the intersection last. |
| `order.bad` | Полосу чертят до решения, иначе в ответ попадут числа, где логарифма нет. | Polosa yechimdan oldin chiziladi, aks holda javobga logarifm yo'q sonlar tushadi. | The band is drawn before solving, otherwise numbers where no logarithm exists get into the answer. |
| `audio.mount` | Теперь всё неравенство целиком. Четыре шага, порядок важен. | Endi butun tengsizlik. To'rt qadam, tartib muhim. | Now the whole inequality. Four steps, and the order matters. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `log₂ (x − 1) < 3` |
| `order.mark` | `1 < x < 9` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Система из двух неравенств | Ikki tengsizlikdan iborat sistema | A system of two inequalities |
| `task.ok` | Два. Икс между двойкой и пятёркой, целых там три и четыре. | Ikkita. Iks ikki bilan besh orasida, butunlari esa uch va to'rt. | Two. X lies between two and five, and the whole numbers there are three and four. |
| `task.hint.1` | Реши каждое неравенство отдельно. | Har bir tengsizlikni alohida yeching. | Solve each inequality separately. |
| `task.hint.2` | Икс больше двух и меньше пяти. | Iks ikkidan katta va beshdan kichik. | X is greater than two and less than five. |
| `task.hint.3` | Два. | Ikki. | Two. |
| `order.prompt` | Расставь уравнения по возрастанию корня | Tenglamalarni ildizi o'sishi bo'yicha joylashtiring | Put the equations in order of increasing root |
| `order.title` | от меньшего корня к большему | kichik ildizdan kattasiga | from the smallest root to the largest |
| `order.ok` | Верно. Число справа больше не значит корень больше. | To'g'ri. O'ngdagi son kattaroq bo'lsa, ildiz kattaroq degani emas. | Correct. A bigger number on the right does not mean a bigger root. |
| `order.bad` | Считай показатель каждого, а не смотри на число справа. | O'ngdagi songa qaramay, har birining ko'rsatkichini hisoblang. | Compute the exponent of each instead of looking at the number on the right. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `4 < 2^x < 32` |
| `task.answer` | `2` |
| `order.items` | `2^x = 16` · `3^x = 9` · `5^x = 5` · `2^x = 8` |
| `order.answer` | `5^x = 5  3^x = 9  2^x = 8  2^x = 16` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Исходное неравенство, здесь ошибки быть не может. | Dastlabki tengsizlik, bu yerda xato bo'lishi mumkin emas. | The original inequality, no mistake can live here. |
| `hint.r2` | Четвёрку записали как степень того же основания. Это верно. | To'rtni o'sha asosning darajasi qilib yozishdi. Bu to'g'ri. | Four was written as a power of the same base. That is correct. |
| `hint.r3` | Основание меньше единицы. Посмотри на знак. | Asos birdan kichik. Ishoraga qarang. | The base is less than one. Look at the sign. |
| `proof` | Подставь ноль: ноль целых пять десятых в нулевой степени это один, а один не больше четырёх. | Nolni qo'ying: nol butun besh o'ndanning nolinchi darajasi bir, bir esa to'rtdan katta emas. | Substitute zero: zero point five to the power zero is one, and one is not greater than four. |
| `entry.prompt` | Какое число из этого ответа не подходит? | Bu javobdagi qaysi son yaramaydi? | Which number from this answer does not fit? |
| `entry.ok` | Ноль. Он входит в полученный ответ, а исходному неравенству не удовлетворяет. | Nol. U olingan javobga kiradi, dastlabki tengsizlikni esa qanoatlantirmaydi. | Zero. It belongs to the answer obtained, yet it does not satisfy the original inequality. |
| `entry.hint.1` | Возьми самое удобное число из полученного ответа. | Olingan javobdan eng qulay sonni oling. | Take the most convenient number from the answer obtained. |
| `entry.hint.2` | Любое число в нулевой степени равно единице. | Har qanday sonning nolinchi darajasi birga teng. | Any number to the power zero equals one. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `audio.mount` | Четыре строки. Все действия знакомые, а ответ неверный. | To'rt qator. Barcha amallar tanish, javob esa noto'g'ri. | Four lines. Every step is familiar and the answer is wrong. |
| `audio.next` | Дальше обратная задача: по ответу восстанови условие. | Keyin teskari masala: javobga qarab shartni tiklang. | Next comes the reverse task: rebuild the condition from the answer. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `0,5^x > 4` |
| `row.r2` | `0,5^x > 0,5^{−2}` |
| `row.r3` | `x > −2` |
| `row.r4` | `x ∈ (−2; +∞)` |
| `answerId` | `r3` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | С какого числа начинается полоса допустимых значений? | Joiz qiymatlar polosasi qaysi sondan boshlanadi? | From which number does the band of admissible values start? |
| `entry.ok` | С пятёрки. Икс минус пять должно быть больше нуля. | Beshdan. Iks minus besh noldan katta bo'lishi kerak. | From five. X minus five has to be greater than zero. |
| `entry.hint.1` | Посмотри, что стоит под знаком логарифма. | Logarifm belgisi ostida nima turganiga qarang. | Look at what stands under the logarithm sign. |
| `entry.hint.2` | Икс минус пять больше нуля. | Iks minus besh noldan katta. | X minus five is greater than zero. |
| `entry.hint.3` | Пять. | Besh. | Five. |
| `multi.prompt` | Отметь все неравенства, где знак переворачивается | Ishora ag'dariladigan barcha tengsizliklarni belgilang | Mark every inequality where the sign flips |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Основание больше единицы, кривая растёт, знак остаётся. | Asos birdan katta, egri chiziq o'sadi, ishora qoladi. | The base is greater than one, the curve grows, the sign stays. |
| `multi.d.hint` | Здесь основание тоже больше единицы. | Bu yerda ham asos birdan katta. | Here the base is greater than one as well. |
| `multi.ok` | Верно. Переворот приходит от основания меньше единицы, и только от него. | To'g'ri. Ag'darilish birdan kichik asosdan keladi, faqat undan. | Correct. The flip comes from a base less than one, and only from it. |
| `audio.mount` | Теперь наоборот. Сначала назови начало полосы. | Endi teskarisiga. Avval polosaning boshini ayting. | Now the other way round. First name where the band starts. |
| `audio.work` | Потом отметь все неравенства, где знак переворачивается. | Keyin ishora ag'dariladigan barcha tengsizliklarni belgilang. | Then mark every inequality where the sign flips. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `log₂ (x − 5) < 2` |
| `entry.answer` | `5` |
| `multi.a` [верно] | `0,5^x > 4` |
| `multi.b` [верно] | `0,2^x < 5` |
| `multi.c` | `2^x > 4` |
| `multi.d` | `3^x < 9` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `osnovanie-menshe-odnogo`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Что даёт встреча горизонтали с кривой? | Gorizontalning egri chiziq bilan uchrashuvi nima beradi? | What does the meeting of the horizontal and the curve give? |
| `q1.a` [верно] | границу ответа | javobning chegarasini | the boundary of the answer |
| `q1.b` | весь ответ | butun javobni | the whole answer |
| `q1.b.hint` | Весь ответ был бы у уравнения, а у неравенства это только край. | Butun javob tenglamada bo'lardi, tengsizlikda esa bu faqat chekka. | The whole answer would belong to an equation, for an inequality this is only the edge. |
| `q1.c` | ничего | hech nima | nothing |
| `q1.c.hint` | Без встречи ответ вообще не записать. | Uchrashuvsiz javobni umuman yozib bo'lmaydi. | Without the meeting the answer cannot be written at all. |
| `q1.d` | направление кривой | egri chiziqning yo'nalishini | the direction of the curve |
| `q1.d.hint` | Направление видно и без встречи, оно у кривой своё. | Yo'nalish uchrashuvsiz ham ko'rinadi, u egri chiziqning o'ziniki. | The direction is visible without the meeting, it belongs to the curve. |
| `q2.prompt` | При каком основании знак переворачивается? | Qanday asosda ishora ag'dariladi? | For which base does the sign flip? |
| `q2.a` [верно] | меньше единицы | birdan kichik | less than one |
| `q2.b` | больше единицы | birdan katta | greater than one |
| `q2.b.hint` | При таком основании кривая растёт, и знак остаётся. | Bunday asosda egri chiziq o'sadi, ishora qoladi. | With such a base the curve grows and the sign stays. |
| `q2.c` | при любом | har qandayda | for any |
| `q2.c.hint` | Тогда переворачивать пришлось бы всегда, а это не так. | U holda doim ag'darishga to'g'ri kelardi, bu esa unday emas. | Then it would have to flip every time, and that is not so. |
| `q2.d` | при отрицательном | manfiyda | for a negative one |
| `q2.d.hint` | Отрицательное основание не бывает вовсе. | Manfiy asos umuman bo'lmaydi. | A negative base does not occur at all. |
| `q3.prompt` | Чему равно решение этого неравенства? | Bu tengsizlikning yechimi nimaga teng? | What is the solution of this inequality? |
| `q3.a` [верно] | икс больше двух | iks ikkidan katta | x greater than two |
| `q3.a.ok` | Верно. Основание больше единицы, знак остаётся. | To'g'ri. Asos birdan katta, ishora qoladi. | Correct. The base is greater than one, the sign stays. |
| `q3.b` | икс меньше двух | iks ikkidan kichik | x less than two |
| `q3.b.hint` | Переворот бывает только при основании меньше единицы. | Ag'darilish faqat birdan kichik asosda bo'ladi. | The flip happens only for a base less than one. |
| `q3.c` | икс больше четырёх | iks to'rtdan katta | x greater than four |
| `q3.c.hint` | Четыре это значение, а граница это показатель. | To'rt qiymat, chegara esa ko'rsatkich. | Four is the value, and the boundary is the exponent. |
| `q3.d` | икс равен двум | iks ikkiga teng | x equals two |
| `q3.d.hint` | Равенство было бы ответом уравнения. | Tenglik tenglamaning javobi bo'lardi. | An equality would be the answer of an equation. |
| `q4.prompt` | Что делают первым в логарифмическом неравенстве? | Logarifmik tengsizlikda birinchi nima qilinadi? | What is done first in a logarithmic inequality? |
| `q4.a` [верно] | чертят полосу допустимых значений | joiz qiymatlar polosasini chizishadi | they draw the band of admissible values |
| `q4.b` | снимают знаки логарифма | logarifm belgilarini olib tashlashadi | they remove the logarithm signs |
| `q4.b.hint` | Тогда условие исчезнет из записи, а из задачи нет. | U holda shart yozuvdan yo'qoladi, masaladan esa yo'q. | Then the condition vanishes from the writing but not from the problem. |
| `q4.c` | переворачивают знак | ishorani ag'darishadi | they flip the sign |
| `q4.c.hint` | Знак переворачивают не всегда, и уж точно не первым делом. | Ishora doim ham ag'darilmaydi, va albatta birinchi navbatda emas. | The sign is not always flipped, and certainly not first. |
| `q4.d` | подставляют число | son qo'yishadi | they substitute a number |
| `q4.d.hint` | Подстановка это проверка в конце, а не первый шаг. | Qo'yish oxiridagi tekshiruv, birinchi qadam emas. | Substitution is a check at the end, not the first step. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `2^x = 4   →   x = 2` |
| `q2.done` | `0 < a < 1` |
| `q3.done` | `2^x > 4   →   x > 2` |
| `q4.done` | `f(x) > 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Читаю решение неравенства как сторону от встречи | Tengsizlik yechimini uchrashuvdan tomon deb o'qiyman | I read the solution as a side of the meeting |
| `can.2` | Вижу переворот знака по направлению кривой | Ishora ag'darilishini egri chiziq yo'nalishidan ko'raman | I see the sign flip from the direction of the curve |
| `can.3` | Черчу полосу допустимых значений до решения | Yechimdan oldin joiz qiymatlar polosasini chizaman | I draw the band of admissible values before solving |
| `can.4` | Беру пересечение двух условий | Ikki shartning kesishmasini olaman | I take the intersection of two conditions |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: сторона при убывающей кривой. | Bir joy takrorlashni talab qiladi: kamayuvchi egri chiziqdagi tomon. | One spot needs a second look: the side for a decreasing curve. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va beshinchi ekranga qayting. | Go back to the rule and to screen five. |
| `bridge` | Дальше окружность: там участок станет дугой и будет повторяться. | Keyin aylana: u yerda bo'lak yoyga aylanadi va takrorlanadi. | Next comes the circle: there the piece becomes an arc and repeats. |
| `lifehack` | Прежде чем решать, посмотри на основание. Оно уже говорит, с какой стороны искать ответ. | Yechishdan oldin asosga qarang. U javobni qaysi tomondan izlashni aytib turibdi. | Before solving, look at the base. It already tells you which side to look on. |
| `sheetTitle` | Неравенства с логарифмом · шпаргалка | Logarifmli tengsizliklar · shpargalka | Inequalities with logarithms · cheat sheet |
| `sheetSrc` | 10 класс · урок 35 | 10-sinf · 35-dars | Grade 10 · lesson 35 |
| `audio.mount` | Прогноз был про сторону от минус двух. Посмотрим, что вышло. | Taxmin minus ikkidan tomon haqida edi. Nima chiqqanini ko'ramiz. | The guess was about the side of minus two. Let us see how it turned out. |
| `audio.next` | Икс меньше минус двух. Знак перевернулся не по правилу, а потому что кривая идёт вниз. | Iks minus ikkidan kichik. Ishora qoida bo'yicha emas, egri chiziq pastga ketgani uchun ag'darildi. | X is less than minus two. The sign flipped not by a rule but because the curve goes down. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `x > −2` |
| `hook.b` | `x < −2` |
| `proved` | `x < −2` |
| `law` | `log_a f(x) < b,   f(x) > 0` |
| `sheet.1` | `f(x) > 0` |
| `sheet.2` | `a > 1   →   x < x₀` |
| `sheet.3` | `0 < a < 1   →   x > x₀` |
| `sheet.4` | `2^x < 4   →   x < 2` |
| `sheet.5` | `0,5^x > 4   →   x < −2` |
