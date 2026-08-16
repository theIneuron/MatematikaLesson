# Урок 34 — Преобразование логарифмических выражений · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS32_36_SKELET.md` §9. Опора в учебнике: алгебра 2022, стр. 109–112, параграф
`LOGARIFMIK IFODALARNI AYNIY ALMASHTIRISH`.

**Главное решение урока.** Чертежа здесь нет, и это осознанно. Тема — преобразование записи, а
свидетель темы — счёт одного и того же числа двумя путями: `log₂ 8³` считается напрямую и по
свойству, оба раза выходит девять, а `(log₂ 8)³` даёт двадцать семь и не совпадает ни с чем.
Такой свидетель живёт в записи. Логарифмическая кривая на этих экранах была бы иллюстрацией без
дидактической роли — `DINAMIKA_VA_ILLUSTRATSIYA.md` §1 такие кадры велит убирать.

**Работают приборы 2 и 3** — переписывание по шагам и числовой свидетель.

**Задания экранов 5 и 6 взяты из учебника** — стр. 109, 1-misol и стр. 110, 2-misol.

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ВЫРАЖЕНИЕ | IFODA | THE EXPRESSION |
| `title` | Девять или двадцать семь | To'qqizmi yoki yigirma yetti | Nine or twenty seven |
| `row.a.name` | возвели сам логарифм | logarifmning o'zini ko'tardik | raised the logarithm itself |
| `row.b.name` | показатель вышел множителем | ko'rsatkich ko'paytuvchi bo'lib chiqdi | the exponent came out as a factor |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посчитаем напрямую и сверим. | Javobingiz yozib olindi. Endi to'g'ridan hisoblab solishtiramiz. | Your answer is saved. Now we will compute it directly and compare. |
| `audio.mount` | Логарифм восьми в кубе по основанию два. Показатель стоит под знаком логарифма, и с ним надо что-то сделать. | Sakkiz kubning ikki asosga ko'ra logarifmi. Ko'rsatkich logarifm belgisi ostida turibdi, va u bilan biror ish qilish kerak. | The logarithm of eight cubed to base two. The exponent stands under the logarithm sign, and something has to be done with it. |
| `audio.r1` | Первая запись возводит в куб сам логарифм: логарифм восьми это три, три в кубе двадцать семь. | Birinchi yozuv logarifmning o'zini kubga ko'taradi: sakkizning logarifmi uch, uch kubi yigirma yetti. | The first reading cubes the logarithm itself: the logarithm of eight is three, and three cubed is twenty seven. |
| `audio.r2` | Вторая выносит показатель множителем вперёд: три умножить на логарифм восьми, это три на три, девять. | Ikkinchisi ko'rsatkichni oldinga ko'paytuvchi qilib chiqaradi: uch kerra sakkizning logarifmi, bu uch kerra uch, to'qqiz. | The second brings the exponent out in front as a factor: three times the logarithm of eight, that is three times three, nine. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `log₂ 8³` |
| `row.a.value` | `27` |
| `row.b.value` | `9` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед выражением | Ifodadan oldin uch savol | Three questions before the expression |
| `q1.prompt` | Чему равен логарифм восьми по основанию два? | Sakkizning ikki asosga ko'ra logarifmi nechaga teng? | What is the logarithm of eight to base two? |
| `q1.a` [верно] | три | uch | three |
| `q1.b` | четыре | to'rt | four |
| `q1.b.hint` | Четыре вышло бы делением, а логарифм это показатель. | To'rt bo'lish bilan chiqardi, logarifm esa ko'rsatkich. | Four would come from dividing, and a logarithm is an exponent. |
| `q1.c` | восемь | sakkiz | eight |
| `q1.c.hint` | Восемь стоит под знаком, а спросили про показатель. | Sakkiz belgi ostida turadi, savol esa ko'rsatkich haqida. | Eight stands under the sign, and the question was about the exponent. |
| `q1.d` | одна треть | bir uchdan | one third |
| `q1.d.hint` | Одна треть выходит при обратном порядке основания и числа. | Bir uchdan asos va son teskari tartibda bo'lganda chiqadi. | One third comes when the base and the number are in the other order. |
| `q2.prompt` | Чему равна сумма логарифмов с одним основанием? | Bir asosli logarifmlar yig'indisi nechaga teng? | What does a sum of logarithms with the same base equal? |
| `q2.a` [верно] | логарифму произведения | ko'paytmaning logarifmiga | the logarithm of the product |
| `q2.b` | логарифму суммы | yig'indining logarifmiga | the logarithm of the sum |
| `q2.b.hint` | Логарифм суммы не раскрывается вовсе. | Yig'indining logarifmi umuman ochilmaydi. | The logarithm of a sum does not open at all. |
| `q2.c` | произведению логарифмов | logarifmlar ko'paytmasiga | the product of the logarithms |
| `q2.c.hint` | Проверь на четырёх и восьми: выйдет шесть вместо пяти. | To'rt va sakkizda tekshiring: besh o'rniga olti chiqadi. | Check on four and eight: you get six instead of five. |
| `q2.d` | ничему из этого | bularning hech biriga | none of these |
| `q2.d.hint` | Правило есть, и оно выводится из свойства степени. | Qoida bor, va u daraja xossasidan chiqariladi. | The rule exists and comes from a property of powers. |
| `q3.prompt` | Чему равен логарифм единицы? | Birning logarifmi nechaga teng? | What is the logarithm of one? |
| `q3.a` [верно] | нулю при любом основании | har qanday asosda nolga | zero for any base |
| `q3.b` | единице | birga | one |
| `q3.b.hint` | Единице равен логарифм самого основания, а не единицы. | Birga asosning o'z logarifmi teng, birniki emas. | One is the logarithm of the base itself, not of one. |
| `q3.c` | самому основанию | asosning o'ziga | the base itself |
| `q3.c.hint` | Логарифм это показатель, а не основание. | Logarifm ko'rsatkich, asos emas. | A logarithm is an exponent, not a base. |
| `q3.d` | не существует | mavjud emas | it does not exist |
| `q3.d.hint` | Не существует логарифм нуля, а не единицы. | Nolning logarifmi mavjud emas, birniki emas. | It is the logarithm of zero that does not exist, not of one. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `log₂ 8 = 3` |
| `q2.done` | `logₐ b + logₐ c = logₐ (b·c)` |
| `q3.done` | `logₐ 1 = 0` |

---

## Экран 3 · `explain1` · ответ `number` · тег `stepen-vnutri-logarifma`

Считаем напрямую, без всяких свойств.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Посчитаем без правил | Qoidalarsiz hisoblaymiz | Let us compute without any rules |
| `show.1.1` | под знаком стоит восемь в кубе | belgi ostida sakkiz kubi turibdi | eight cubed stands under the sign |
| `show.1.2` | восемь в кубе это пятьсот двенадцать | sakkiz kubi bu besh yuz o'n ikki | eight cubed is five hundred twelve |
| `show.1.3` | значит это логарифм пятисот двенадцати | demak bu besh yuz o'n ikkining logarifmi | so this is the logarithm of five hundred twelve |
| `show.2.1` | ищем показатель двойки | ikkining ko'rsatkichini izlaymiz | we look for the exponent of two |
| `show.2.2` | два в девятой это пятьсот двенадцать | ikkining to'qqizinchi darajasi besh yuz o'n ikki | two to the ninth is five hundred twelve |
| `show.2.3` | ответ девять, и он получен счётом | javob to'qqiz, va u hisob bilan olingan | the answer is nine, and it came from counting |
| `audio.mount` | Никаких свойств пока не берём. Посчитаем это выражение прямо, как считали бы в шестом классе. | Hozircha hech qanday xossa olmaymiz. Bu ifodani oltinchi sinfda hisoblagandek to'g'ridan hisoblaymiz. | We will not use any properties yet. Let us compute this expression directly. |
| `audio.plain*` | Под знаком логарифма стоит восемь в кубе. Восемь в кубе это восемь на восемь на восемь, то есть пятьсот двенадцать. Значит перед нами логарифм пятисот двенадцати по основанию два, и вопрос простой: в какой степени надо взять двойку, чтобы вышло пятьсот двенадцать. Идём по степеням двойки: два, четыре, восемь, шестнадцать, тридцать два, шестьдесят четыре, сто двадцать восемь, двести пятьдесят шесть, пятьсот двенадцать. Это девятая степень. Ответ девять. Мы не применили ни одного свойства, мы просто посчитали. | Logarifm belgisi ostida sakkiz kubi turibdi. Sakkiz kubi bu sakkiz kerra sakkiz kerra sakkiz, ya'ni besh yuz o'n ikki. Demak oldimizda besh yuz o'n ikkining ikki asosga ko'ra logarifmi, savol esa oddiy: besh yuz o'n ikki chiqishi uchun ikkini qaysi darajaga ko'tarish kerak. Ikkining darajalari bo'ylab yuramiz: ikki, to'rt, sakkiz, o'n olti, o'ttiz ikki, oltmish to'rt, bir yuz yigirma sakkiz, ikki yuz ellik olti, besh yuz o'n ikki. Bu to'qqizinchi daraja. Javob to'qqiz. Biz birorta xossa qo'llamadik, shunchaki hisobladik. | Eight cubed stands under the logarithm sign. Eight cubed is eight times eight times eight, that is five hundred twelve. So what we have is the logarithm of five hundred twelve to base two, and the question is simple: to what power must two be raised to give five hundred twelve. Let us walk the powers of two: two, four, eight, sixteen, thirty two, sixty four, one hundred twenty eight, two hundred fifty six, five hundred twelve. That is the ninth power. The answer is nine. We applied no property at all, we just counted. |
| `audio.work` | Посчитай сам. Чему равно это выражение? | O'zingiz hisoblang. Bu ifoda nechaga teng? | Work it out yourself. What does this expression equal? |
| `work.prompt` | Чему равно выражение? | Ifoda nechaga teng? | What does the expression equal? |
| `work.ok` | Девять. Двойка в девятой степени даёт пятьсот двенадцать. | To'qqiz. Ikkining to'qqizinchi darajasi besh yuz o'n ikki beradi. | Nine. Two to the ninth gives five hundred twelve. |
| `work.hint.1` | Сначала посчитай восемь в кубе. | Avval sakkiz kubini hisoblang. | First compute eight cubed. |
| `work.hint.2` | Пятьсот двенадцать это степень двойки. Какая? | Besh yuz o'n ikki ikkining darajasi. Qaysi biri? | Five hundred twelve is a power of two. Which one? |
| `work.hint.3` | Девять. | To'qqiz. | Nine. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `log₂ 8³ = log₂ 512` |
| `frameB` | `2⁹ = 512` |
| `work.expr` | `log₂ 8³` |
| `work.answer` | `9` |

---

## Экран 4 · `explain2` · ответ `order` · тег `stepen-vnutri-logarifma`

Разграничение: показатель под знаком и показатель у логарифма.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Две записи, которые легко спутать | Chalkashtirish oson bo'lgan ikki yozuv | Two writings easy to confuse |
| `show.1.1` | слева куб стоит под знаком | chapda kub belgi ostida turadi | on the left the cube is under the sign |
| `show.1.2` | справа в куб возведён сам логарифм | o'ngda logarifmning o'zi kubga ko'tarilgan | on the right the logarithm itself is cubed |
| `show.1.3` | скобки стоят в разных местах | qavslar har xil joyda turibdi | the brackets stand in different places |
| `show.2.1` | слева выходит девять | chapda to'qqiz chiqadi | the left gives nine |
| `show.2.2` | справа выходит двадцать семь | o'ngda yigirma yetti chiqadi | the right gives twenty seven |
| `show.2.3` | значит это разные выражения | demak bular har xil ifodalar | so these are different expressions |
| `audio.mount` | Две записи стоят рядом. Отличаются они только местом скобок. | Ikki yozuv yonma-yon turibdi. Ular faqat qavs joyi bilan farq qiladi. | Two writings stand side by side. They differ only in where the brackets are. |
| `audio.two*` | Слева куб стоит под знаком логарифма: сначала восемь возводят в куб, потом берут логарифм. Мы уже посчитали это, вышло девять. Справа в куб возводят сам логарифм: сначала берут логарифм восьми, это три, и уже три возводят в куб, выходит двадцать семь. Девять и двадцать семь разные числа, значит и записи разные. Отсюда и правило: показатель из-под знака выходит наружу множителем, а не остаётся показателем. Три умножить на логарифм восьми, это три на три, снова девять. Счёт напрямую и правило сошлись, и это проверка правила, а не его повторение. | Chapda kub logarifm belgisi ostida turadi: avval sakkiz kubga ko'tariladi, keyin logarifm olinadi. Buni biz hisoblab bo'ldik, to'qqiz chiqdi. O'ngda logarifmning o'zi kubga ko'tariladi: avval sakkizning logarifmi olinadi, bu uch, va uchning o'zi kubga ko'tariladi, yigirma yetti chiqadi. To'qqiz va yigirma yetti har xil sonlar, demak yozuvlar ham har xil. Qoida shundan: belgi ostidagi ko'rsatkich tashqariga ko'paytuvchi bo'lib chiqadi, ko'rsatkich bo'lib qolmaydi. Uch kerra sakkizning logarifmi, bu uch kerra uch, yana to'qqiz. To'g'ridan hisob va qoida to'g'ri keldi, va bu qoidaning tekshiruvi, uni takrorlash emas. | On the left the cube is under the logarithm sign: first eight is cubed, then the logarithm is taken. We have already computed that, it gave nine. On the right the logarithm itself is cubed: first the logarithm of eight is taken, that is three, and then three is cubed, giving twenty seven. Nine and twenty seven are different numbers, so the writings are different too. Hence the rule: the exponent from under the sign comes out as a factor, it does not stay an exponent. Three times the logarithm of eight is three times three, nine again. The direct count and the rule agree, and that is a test of the rule, not a repetition of it. |
| `audio.work` | Расставь шаги в том порядке, в котором мы считали левую запись. | Chap yozuvni hisoblagan tartibimizda qadamlarni joylashtiring. | Put the steps in the order in which we computed the left writing. |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | восемь в кубе | sakkiz kubi | eight cubed |
| `order.s2` | это пятьсот двенадцать | bu besh yuz o'n ikki | that is five hundred twelve |
| `order.s3` | это два в девятой | bu ikkining to'qqizinchisi | that is two to the ninth |
| `order.s4` | логарифм равен девяти | logarifm to'qqizga teng | the logarithm equals nine |
| `order.ok` | Верно. Показатель вышел множителем, и счёт это подтвердил. | To'g'ri. Ko'rsatkich ko'paytuvchi bo'lib chiqdi, hisob buni tasdiqladi. | Correct. The exponent came out as a factor, and the count confirmed it. |
| `order.bad` | Начни с того, что стоит под знаком, а не с логарифма. | Logarifmdan emas, belgi ostidagidan boshlang. | Start with what is under the sign, not with the logarithm. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `log₂ 8³ = 9` |
| `frameB` | `(log₂ 8)³ = 27` |
| `order.mark` | `log₂ b^p = p·log₂ b` |

---

## Экран 5 · `explain3` · ответ `number` · тег `log-summy`

Задание учебника: свернуть сумму в один логарифм.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Сумма сворачивается в один знак | Yig'indi bitta belgiga yig'iladi | A sum folds into a single sign |
| `show.1.1` | два логарифма с одним основанием | bir asosli ikki logarifm | two logarithms with the same base |
| `show.1.2` | по отдельности они не считаются | alohida ular hisoblanmaydi | separately neither of them computes |
| `show.1.3` | сумма это логарифм произведения | yig'indi ko'paytmaning logarifmi | a sum is the logarithm of the product |
| `show.2.1` | восемнадцать умножить на одну пятьдесят четвёртую | o'n sakkizni bir ellik to'rtdanga ko'paytirish | eighteen times one fifty fourth |
| `show.2.2` | под знаком остаётся одна третья | belgi ostida bir uchdan qoladi | one third remains under the sign |
| `show.2.3` | значит ответ минус один | demak javob minus bir | so the answer is minus one |
| `audio.mount` | Задание из учебника. Ни один из двух логарифмов по отдельности не считается. | Darslikdagi topshiriq. Ikki logarifmning bittasi ham alohida hisoblanmaydi. | A task from the textbook. Neither of the two logarithms computes on its own. |
| `audio.fold*` | Логарифм восемнадцати по основанию три не целое число, и логарифм одной пятьдесят четвёртой тоже. Но основания у них одинаковые, а значит сумму можно свернуть в один логарифм произведения. Восемнадцать умножить на одну пятьдесят четвёртую это восемнадцать делить на пятьдесят четыре, то есть одна третья. Остаётся логарифм одной третьей по основанию три. В какой степени надо взять тройку, чтобы вышла одна третья? В минус первой. Ответ минус один. Обрати внимание, каждый кусок по отдельности был неудобным, а вместе они дали целое число. Так бывает часто, и именно поэтому сначала сворачивают, а потом считают. | O'n sakkizning uch asosga ko'ra logarifmi butun son emas, bir ellik to'rtdanniki ham. Lekin ularning asoslari bir xil, demak yig'indini ko'paytmaning bitta logarifmiga yig'ish mumkin. O'n sakkizni bir ellik to'rtdanga ko'paytirish bu o'n sakkizni ellik to'rtga bo'lish, ya'ni bir uchdan. Bir uchdanning uch asosga ko'ra logarifmi qoladi. Bir uchdan chiqishi uchun uchni qaysi darajaga ko'tarish kerak? Minus birinchiga. Javob minus bir. E'tibor bering, har bir bo'lak alohida noqulay edi, birga esa ular butun son berdi. Bu tez-tez uchraydi, aynan shuning uchun avval yig'iladi, keyin hisoblanadi. | The logarithm of eighteen to base three is not a whole number, and neither is the logarithm of one fifty fourth. But their bases are the same, so the sum can be folded into a single logarithm of the product. Eighteen times one fifty fourth is eighteen divided by fifty four, that is one third. What remains is the logarithm of one third to base three. To what power must three be raised to give one third? To minus one. The answer is minus one. Notice that each piece on its own was awkward, while together they gave a whole number. That happens often, and it is exactly why you fold first and compute afterwards. |
| `audio.work` | Посчитай сам. Чему равна эта сумма? | O'zingiz hisoblang. Bu yig'indi nechaga teng? | Work it out yourself. What does this sum equal? |
| `work.prompt` | Чему равна сумма? | Yig'indi nechaga teng? | What does the sum equal? |
| `work.ok` | Минус один. Под знаком осталась одна третья, а это тройка в минус первой. | Minus bir. Belgi ostida bir uchdan qoldi, bu esa uchning minus birinchi darajasi. | Minus one. One third is left under the sign, and that is three to the minus one. |
| `work.hint.1` | Сверни сумму в один логарифм произведения. | Yig'indini ko'paytmaning bitta logarifmiga yig'ing. | Fold the sum into a single logarithm of a product. |
| `work.hint.2` | Восемнадцать делить на пятьдесят четыре это одна третья. | O'n sakkizni ellik to'rtga bo'lish bir uchdan. | Eighteen divided by fifty four is one third. |
| `work.hint.3` | Минус один. | Minus bir. | Minus one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `log₃ 18 + log₃ (1/54)` |
| `frameB` | `log₃ (1/3) = −1` |
| `work.expr` | `log₃ 18 + log₃ (1/54)` |
| `work.answer` | `−1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `stepen-vnutri-logarifma`

Сам: задание учебника с двумя множителями.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Два логарифма и два множителя | Ikki logarifm va ikki ko'paytuvchi | Two logarithms and two factors |
| `show.1.1` | основания разные, свернуть нельзя | asoslar har xil, yig'ib bo'lmaydi | the bases differ, folding is impossible |
| `show.1.2` | зато каждый считается отдельно | buning evaziga har biri alohida hisoblanadi | but each of them computes separately |
| `show.1.3` | логарифм восьми равен трём | sakkizning logarifmi uchga teng | the logarithm of eight equals three |
| `show.2.1` | логарифм девяти равен двум | to'qqizning logarifmi ikkiga teng | the logarithm of nine equals two |
| `show.2.2` | три на три минус два на два | uch kerra uch minus ikki kerra ikki | three times three minus two times two |
| `show.2.3` | девять минус четыре | to'qqiz minus to'rt | nine minus four |
| `audio.mount` | Ещё одно задание из учебника. Здесь основания разные, и это меняет ход. | Darslikdagi yana bir topshiriq. Bu yerda asoslar har xil, va bu yo'lni o'zgartiradi. | One more task from the textbook. Here the bases differ, and that changes the route. |
| `audio.calc*` | Основания разные, два и три, поэтому сворачивать нечего: правило суммы работает только при одинаковых основаниях. Зато каждый логарифм считается сам по себе. Логарифм восьми по основанию два равен трём, значит первое слагаемое это три умножить на три. Логарифм девяти по основанию три равен двум, значит второе это два умножить на два. Остаётся вычесть. Смотри, что здесь важно: множитель впереди не убирают и не заносят обратно под знак, его просто применяют в конце. | Asoslar har xil, ikki va uch, shuning uchun yig'adigan narsa yo'q: yig'indi qoidasi faqat bir xil asoslarda ishlaydi. Buning evaziga har bir logarifm o'zicha hisoblanadi. Sakkizning ikki asosga ko'ra logarifmi uchga teng, demak birinchi qo'shiluvchi uch kerra uch. To'qqizning uch asosga ko'ra logarifmi ikkiga teng, demak ikkinchisi ikki kerra ikki. Ayirish qoladi. Qarang, bu yerda nima muhim: oldindagi ko'paytuvchi olib tashlanmaydi va qaytadan belgi ostiga kiritilmaydi, u oxirida qo'llaniladi xolos. | The bases differ, two and three, so there is nothing to fold: the sum rule works only for equal bases. But each logarithm computes on its own. The logarithm of eight to base two equals three, so the first term is three times three. The logarithm of nine to base three equals two, so the second is two times two. Subtraction is what remains. Notice what matters here: the factor in front is not removed and not pushed back under the sign, it is simply applied at the end. |
| `audio.work` | Посчитай сам. Чему равно это выражение? | O'zingiz hisoblang. Bu ifoda nechaga teng? | Work it out yourself. What does this expression equal? |
| `work.prompt` | Чему равно выражение? | Ifoda nechaga teng? | What does the expression equal? |
| `work.ok` | Пять. Девять минус четыре. | Besh. To'qqiz minus to'rt. | Five. Nine minus four. |
| `work.hint.1` | Посчитай каждый логарифм отдельно. | Har bir logarifmni alohida hisoblang. | Compute each logarithm separately. |
| `work.hint.2` | Три на три это девять, два на два это четыре. | Uch kerra uch to'qqiz, ikki kerra ikki to'rt. | Three times three is nine, two times two is four. |
| `work.hint.3` | Пять. | Besh. | Five. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `3log₂ 8 − 2log₃ 9` |
| `frameB` | `3·3 − 2·2` |
| `work.expr` | `3log₂ 8 − 2log₃ 9` |
| `work.answer` | `5` |

---

## Экран 7 · `explain5` · ответ `number` · тег `perehod-perevernuli`

Граничный: основания не совпадают и не считаются.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Когда основание неудобное | Asos noqulay bo'lganda | When the base is inconvenient |
| `show.1.1` | основание девять, число восемьдесят один | asos to'qqiz, son sakson bir | the base is nine, the number is eighty one |
| `show.1.2` | оба они степени тройки | ikkalasi ham uchning darajasi | both are powers of three |
| `show.1.3` | переходим к основанию три | uch asosga o'tamiz | we move to base three |
| `show.2.1` | сверху логарифм числа | yuqorida sonning logarifmi | the logarithm of the number goes on top |
| `show.2.2` | снизу логарифм основания | pastda asosning logarifmi | the logarithm of the base goes below |
| `show.2.3` | четыре делить на два | to'rtni ikkiga bo'lish | four divided by two |
| `audio.mount` | Последний инструмент урока. Он нужен, когда основания разные, а свести их надо. | Darsning oxirgi asbobi. U asoslar har xil bo'lgan va ularni birlashtirish kerak bo'lganda kerak. | The last tool of the lesson. It is needed when the bases differ and have to be brought together. |
| `audio.base*` | Логарифм восемьдесят одного по основанию девять. Обе цифры это степени тройки, поэтому удобно перейти к основанию три. Формула перехода такая: сверху логарифм числа, снизу логарифм основания, оба по новому основанию. Сверху логарифм восемьдесят одного по основанию три, это четыре. Снизу логарифм девяти по основанию три, это два. Четыре делить на два, ответ два. Проверим: девять в квадрате равно восемьдесят одному, всё сходится. А теперь посмотри, что бывает при перевёрнутой дроби. Два делить на четыре это одна вторая. Проверим: девять в степени одна вторая это три, а не восемьдесят один. Не сходится. Запомнить порядок помогает то же слово, что и в самом логарифме: сверху всегда число, снизу всегда основание. | Sakson birning to'qqiz asosga ko'ra logarifmi. Ikkala raqam ham uchning darajasi, shuning uchun uch asosga o'tish qulay. O'tish formulasi shunday: yuqorida sonning logarifmi, pastda asosning logarifmi, ikkalasi ham yangi asosda. Yuqorida sakson birning uch asosga ko'ra logarifmi, bu to'rt. Pastda to'qqizning uch asosga ko'ra logarifmi, bu ikki. To'rtni ikkiga bo'lish, javob ikki. Tekshiramiz: to'qqiz kvadrati sakson birga teng, hammasi to'g'ri keladi. Endi kasr ag'darilsa nima bo'lishiga qarang. Ikkini to'rtga bo'lish bir ikkidan. Tekshiramiz: to'qqizning bir ikkidan darajasi uch, sakson bir emas. To'g'ri kelmadi. Tartibni eslashga logarifmning o'zidagi so'z yordam beradi: yuqorida doim son, pastda doim asos. | The logarithm of eighty one to base nine. Both figures are powers of three, so it is convenient to move to base three. The change of base formula goes like this: the logarithm of the number on top, the logarithm of the base below, both to the new base. On top, the logarithm of eighty one to base three, that is four. Below, the logarithm of nine to base three, that is two. Four divided by two, the answer is two. Let us check: nine squared equals eighty one, everything agrees. Now look at what happens with the fraction upside down. Two divided by four is one half. Let us check: nine to the power one half is three, not eighty one. It does not agree. What helps to remember the order is the same word as in the logarithm itself: the number is always on top, the base always below. |
| `audio.work` | Посчитай сам. Чему равен этот логарифм? | O'zingiz hisoblang. Bu logarifm nechaga teng? | Work it out yourself. What does this logarithm equal? |
| `work.prompt` | Чему равен логарифм? | Logarifm nechaga teng? | What does the logarithm equal? |
| `work.ok` | Два. Четыре делить на два. Проверка: девять в квадрате равно восемьдесят одному. | Ikki. To'rtni ikkiga bo'lish. Tekshiruv: to'qqiz kvadrati sakson birga teng. | Two. Four divided by two. Check: nine squared equals eighty one. |
| `work.hint.1` | Перейди к основанию три: и девять, и восемьдесят один это степени тройки. | Uch asosga o'ting: to'qqiz ham, sakson bir ham uchning darajasi. | Move to base three: both nine and eighty one are powers of three. |
| `work.hint.2` | Сверху четыре, снизу два. | Yuqorida to'rt, pastda ikki. | Four on top, two below. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `log₉ 81 = log₃ 81 / log₃ 9` |
| `frameB` | `4/2 = 2` |
| `work.expr` | `log₉ 81` |
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Четыре свойства | To'rt xossa | Four properties |
| `probe.question` | Куда уходит показатель из-под знака логарифма? | Logarifm belgisi ostidagi ko'rsatkich qayerga ketadi? | Where does the exponent from under the logarithm sign go? |
| `probe.a` [верно] | вперёд множителем | oldinga ko'paytuvchi bo'lib | out in front as a factor |
| `probe.b` | остаётся показателем у логарифма | logarifmning ko'rsatkichi bo'lib qoladi | it stays as an exponent on the logarithm |
| `probe.b.hint` | Тогда вышло бы двадцать семь, а счётом получилось девять. | U holda yigirma yetti chiqardi, hisob bilan esa to'qqiz chiqdi. | Then it would give twenty seven, while counting gave nine. |
| `rule.lawLabel` | ЧЕТЫРЕ СВОЙСТВА | TO'RT XOSSA | THE FOUR PROPERTIES |
| `rule.lines.1` | логарифм произведения это сумма логарифмов | ko'paytmaning logarifmi logarifmlar yig'indisi | the logarithm of a product is the sum of the logarithms |
| `rule.lines.2` | логарифм частного это разность | bo'linmaning logarifmi ayirma | the logarithm of a quotient is the difference |
| `rule.lines.3` | показатель выходит множителем, основание меняют дробью | ko'rsatkich ko'paytuvchi bo'lib chiqadi, asos kasr bilan almashtiriladi | the exponent comes out as a factor, the base is changed with a fraction |
| `audio.mount` | Соберём правило. Свойств четыре, и все четыре мы уже проверили счётом. | Qoidani yig'amiz. Xossa to'rtta, va to'rtalasini ham hisob bilan tekshirdik. | Let us put the rule together. There are four properties, and all four we have already checked by counting. |
| `audio.rule*` | Первое: логарифм произведения равен сумме логарифмов множителей. Второе: логарифм частного равен разности логарифмов делимого и делителя. Третье: логарифм степени равен произведению показателя на логарифм основания степени, то есть показатель выходит вперёд множителем. Четвёртое: перейти к новому основанию можно дробью, где сверху логарифм числа, а снизу логарифм старого основания, оба по новому. Все четыре работают только тогда, когда логарифмы вообще существуют, то есть под знаком стоит положительное число. И ни одно из них не раскрывает логарифм суммы: для суммы правила нет вовсе. | Birinchi: ko'paytmaning logarifmi ko'paytuvchilar logarifmlari yig'indisiga teng. Ikkinchi: bo'linmaning logarifmi bo'linuvchi va bo'luvchi logarifmlari ayirmasiga teng. Uchinchi: darajaning logarifmi ko'rsatkich bilan daraja asosi logarifmi ko'paytmasiga teng, ya'ni ko'rsatkich oldinga ko'paytuvchi bo'lib chiqadi. To'rtinchi: yangi asosga kasr bilan o'tish mumkin, unda yuqorida sonning logarifmi, pastda eski asosning logarifmi, ikkalasi ham yangisida. To'rtalasi ham faqat logarifmlar umuman mavjud bo'lganda, ya'ni belgi ostida musbat son turganda ishlaydi. Va ularning hech biri yig'indining logarifmini ochmaydi: yig'indi uchun qoida umuman yo'q. | First: the logarithm of a product equals the sum of the logarithms of the factors. Second: the logarithm of a quotient equals the difference of the logarithms of the dividend and the divisor. Third: the logarithm of a power equals the exponent times the logarithm of the base of that power, that is, the exponent comes out in front as a factor. Fourth: you may move to a new base with a fraction where the logarithm of the number is on top and the logarithm of the old base is below, both to the new base. All four work only when the logarithms exist at all, that is, when a positive number stands under the sign. And none of them opens the logarithm of a sum: for a sum there is no rule whatsoever. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `logₐ b^p = p·logₐ b,   logₐ b = log_c b / log_c a` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `stepen-vnutri-logarifma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини выражение со значением | Ifodani qiymati bilan ulang | Match each expression with its value |
| `match.prompt` | Все четыре считаются в уме | To'rtalasi ham xayolda hisoblanadi | All four compute in your head |
| `match.ok` | Верно. Свойства нужны не для красоты: без них половина этих выражений не считается. | To'g'ri. Xossalar chiroy uchun emas: ularsiz bu ifodalarning yarmi hisoblanmaydi. | Correct. The properties are not decoration: without them half of these do not compute. |
| `audio.mount` | Четыре выражения и четыре числа. Сначала сворачивай, потом считай. | To'rt ifoda va to'rt son. Avval yig'ing, keyin hisoblang. | Four expressions and four numbers. Fold first, compute afterwards. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `log₂ 32` · `log₃ 9 + log₃ 3` · `log₅ 125 − log₅ 25` · `log₂ 4³` |
| `match.a` | `5` |
| `match.b` | `3` |
| `match.c` | `1` |
| `match.d` | `6` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Сверни выражение целиком | Ifodani to'liq yig'ing | Fold the whole expression |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | сумма в произведение | yig'indi ko'paytmaga | sum into a product |
| `order.s2` | разность в частное | ayirma bo'linmaga | difference into a quotient |
| `order.s3` | считаем под знаком | belgi ostini hisoblash | compute under the sign |
| `order.s4` | логарифм восьми | sakkizning logarifmi | the logarithm of eight |
| `order.ok` | Верно. Три логарифма стали одним, и он посчитался в уме. | To'g'ri. Uch logarifm bittaga aylandi, va u xayolda hisoblandi. | Correct. Three logarithms became one, and it computed in the head. |
| `order.bad` | Сначала сворачивают запись, и только потом считают число. | Avval yozuv yig'iladi, faqat keyin son hisoblanadi. | You fold the writing first, and only then compute the number. |
| `audio.mount` | Теперь всё выражение целиком. Три логарифма, четыре шага. | Endi butun ifoda. Uch logarifm, to'rt qadam. | Now the whole expression. Three logarithms, four steps. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `log₂ 12 + log₂ 6 − log₂ 9` |
| `order.mark` | `log₂ 8 = 3` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Посчитай разность | Ayirmani hisoblang | Compute the difference |
| `task.ok` | Один. Сто двадцать пять делить на двадцать пять это пять, а логарифм пяти по основанию пять равен единице. | Bir. Bir yuz yigirma beshni yigirma beshga bo'lish besh, beshning besh asosga ko'ra logarifmi esa birga teng. | One. One hundred twenty five divided by twenty five is five, and the logarithm of five to base five equals one. |
| `task.hint.1` | Разность логарифмов это логарифм частного. | Logarifmlar ayirmasi bo'linmaning logarifmi. | A difference of logarithms is the logarithm of a quotient. |
| `task.hint.2` | Под знаком останется пятёрка. | Belgi ostida beshlik qoladi. | A five will be left under the sign. |
| `task.hint.3` | Один. | Bir. | One. |
| `order.prompt` | Расставь выражения по возрастанию значения | Ifodalarni qiymati o'sishi bo'yicha joylashtiring | Put the expressions in order of increasing value |
| `order.title` | от меньшего значения к большему | kichik qiymatdan kattasiga | from the smallest value to the largest |
| `order.ok` | Верно. Основание и число сами по себе ничего не говорят о величине логарифма. | To'g'ri. Asos va sonning o'zi logarifm kattaligi haqida hech nima demaydi. | Correct. The base and the number by themselves say nothing about the size of the logarithm. |
| `order.bad` | Считай каждый логарифм, а не смотри, где число под знаком больше. | Belgi ostidagi son qayerda kattaroq ekaniga qaramay, har bir logarifmni hisoblang. | Compute each logarithm instead of looking at which number under the sign is bigger. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `log₅ 125 − log₅ 25` |
| `task.answer` | `1` |
| `order.items` | `log₂ 8` · `log₃ 81` · `log₅ 25` · `log₇ 7` |
| `order.answer` | `log₇ 7  log₅ 25  log₂ 8  log₃ 81` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Исходное выражение, здесь ошибки быть не может. | Dastlabki ifoda, bu yerda xato bo'lishi mumkin emas. | The original expression, no mistake can live here. |
| `hint.r2` | Под знаком стояла сумма. Спроси себя, есть ли для суммы правило. | Belgi ostida yig'indi turgan edi. O'zingizdan so'rang: yig'indi uchun qoida bormi? | A sum stood under the sign. Ask yourself whether there is a rule for a sum. |
| `hint.r3` | Из предыдущей строки это следует верно, но сама она уже неверна. | Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri. | This follows correctly from the previous line, but that line is already wrong. |
| `proof` | Посчитай первую строку прямо: восемь плюс восемь это шестнадцать. | Birinchi qatorni to'g'ridan hisoblang: sakkiz qo'shuv sakkiz o'n olti. | Compute the first line directly: eight plus eight is sixteen. |
| `entry.prompt` | Чему равно первое выражение на самом деле? | Birinchi ifoda haqiqatda nechaga teng? | What does the first expression really equal? |
| `entry.ok` | Четыре. Под знаком шестнадцать, а два в четвёртой степени это шестнадцать. | To'rt. Belgi ostida o'n olti, ikkining to'rtinchi darajasi esa o'n olti. | Four. Sixteen under the sign, and two to the fourth is sixteen. |
| `entry.hint.1` | Сначала посчитай, что стоит под знаком. | Avval belgi ostidagini hisoblang. | First compute what stands under the sign. |
| `entry.hint.2` | Шестнадцать это степень двойки. Какая? | O'n olti ikkining darajasi. Qaysi biri? | Sixteen is a power of two. Which one? |
| `entry.hint.3` | Четыре. | To'rt. | Four. |
| `audio.mount` | Четыре строки. Ошибка появилась во второй, и дальше её никто не заметил. | To'rt qator. Xato ikkinchisida paydo bo'ldi, keyin uni hech kim sezmadi. | Four lines. The mistake appeared in the second one, and after that nobody noticed it. |
| `audio.next` | Дальше обратная задача: по ответу восстанови число под знаком. | Keyin teskari masala: javobga qarab belgi ostidagi sonni tiklang. | Next comes the reverse task: rebuild the number under the sign from the answer. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `log₂ (8 + 8)` |
| `row.r2` | `log₂ 8 + log₂ 8` |
| `row.r3` | `3 + 3` |
| `row.r4` | `6` |
| `answerId` | `r2` |
| `entry.answer` | `4` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Сумма справа свёрнута в один логарифм. Какое число стоит под знаком? | O'ngdagi yig'indi bitta logarifmga yig'ilgan. Belgi ostida qaysi son turadi? | The sum on the right is folded into one logarithm. Which number stands under the sign? |
| `entry.ok` | Двадцать. Четыре умножить на пять: сумма логарифмов даёт логарифм произведения. | Yigirma. To'rtni beshga ko'paytirish: logarifmlar yig'indisi ko'paytmaning logarifmini beradi. | Twenty. Four times five: a sum of logarithms gives the logarithm of the product. |
| `entry.hint.1` | Сумма логарифмов это логарифм произведения. | Logarifmlar yig'indisi ko'paytmaning logarifmi. | A sum of logarithms is the logarithm of a product. |
| `entry.hint.2` | Перемножь четыре и пять. | To'rt bilan beshni ko'paytiring. | Multiply four and five. |
| `entry.hint.3` | Двадцать. | Yigirma. | Twenty. |
| `multi.prompt` | Отметь все верные равенства | Barcha to'g'ri tengliklarni belgilang | Mark every correct identity |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Для логарифма суммы правила нет вовсе. | Yig'indining logarifmi uchun qoida umuman yo'q. | For the logarithm of a sum there is no rule at all. |
| `multi.d.hint` | Логарифм частного это разность, а не частное логарифмов. | Bo'linmaning logarifmi ayirma, logarifmlar bo'linmasi emas. | The logarithm of a quotient is a difference, not a quotient of logarithms. |
| `multi.ok` | Верно. Работают произведение, частное и степень, а сумма и деление логарифмов не работают. | To'g'ri. Ko'paytma, bo'linma va daraja ishlaydi, yig'indi va logarifmlarni bo'lish esa ishlamaydi. | Correct. Product, quotient and power work, a sum and a division of logarithms do not. |
| `audio.mount` | Теперь наоборот. По готовой сумме назови число под знаком. | Endi teskarisiga. Tayyor yig'indiga qarab belgi ostidagi sonni ayting. | Now the other way round. From the given sum, name the number under the sign. |
| `audio.work` | Потом отметь все равенства, которые верны. | Keyin to'g'ri bo'lgan barcha tengliklarni belgilang. | Then mark every identity that is correct. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `log₃ x = log₃ 4 + log₃ 5` |
| `entry.answer` | `20` |
| `multi.a` [верно] | `logₐ (b·c) = logₐ b + logₐ c` |
| `multi.b` [верно] | `logₐ b^p = p·logₐ b` |
| `multi.c` | `logₐ (b + c) = logₐ b + logₐ c` |
| `multi.d` | `logₐ (b/c) = logₐ b / logₐ c` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `perehod-perevernuli`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Чему равен логарифм пяти по основанию пять? | Beshning besh asosga ko'ra logarifmi nechaga teng? | What is the logarithm of five to base five? |
| `q1.a` [верно] | единице | birga | one |
| `q1.b` | нулю | nolga | zero |
| `q1.b.hint` | Нулю равен логарифм единицы, а не самого основания. | Nolga birning logarifmi teng, asosning o'zi emas. | Zero is the logarithm of one, not of the base itself. |
| `q1.c` | пяти | beshga | five |
| `q1.c.hint` | Логарифм это показатель, а показатель здесь первый. | Logarifm ko'rsatkich, ko'rsatkich esa bu yerda birinchi. | A logarithm is an exponent, and the exponent here is one. |
| `q1.d` | двадцати пяти | yigirma beshga | twenty five |
| `q1.d.hint` | Двадцать пять вышло бы из квадрата, а не из первой степени. | Yigirma besh kvadratdan chiqardi, birinchi darajadan emas. | Twenty five would come from a square, not from the first power. |
| `q2.prompt` | Куда уходит показатель из-под знака? | Belgi ostidagi ko'rsatkich qayerga ketadi? | Where does the exponent from under the sign go? |
| `q2.a` [верно] | вперёд множителем | oldinga ko'paytuvchi bo'lib | out in front as a factor |
| `q2.b` | в основание | asosga | into the base |
| `q2.b.hint` | Основание при этом не трогают вовсе. | Bunda asosga umuman tegilmaydi. | The base is not touched at all here. |
| `q2.c` | остаётся показателем у логарифма | logarifmning ko'rsatkichi bo'lib qoladi | it stays as an exponent on the logarithm |
| `q2.c.hint` | Тогда вышло бы двадцать семь вместо девяти. | U holda to'qqiz o'rniga yigirma yetti chiqardi. | Then it would give twenty seven instead of nine. |
| `q2.d` | исчезает | yo'qoladi | it disappears |
| `q2.d.hint` | Исчезнуть он не может, от него зависит значение. | U yo'qola olmaydi, qiymat unga bog'liq. | It cannot disappear, the value depends on it. |
| `q3.prompt` | Чему равна эта сумма? | Bu yig'indi nechaga teng? | What does this sum equal? |
| `q3.a` [верно] | четыре | to'rt | four |
| `q3.a.ok` | Четыре. Под знаком осталось шестнадцать. | To'rt. Belgi ostida o'n olti qoldi. | Four. Sixteen was left under the sign. |
| `q3.b` | шесть | olti | six |
| `q3.b.hint` | Шесть вышло бы, если перемножить сами логарифмы. | Olti logarifmlarning o'zini ko'paytirganda chiqardi. | Six would come from multiplying the logarithms themselves. |
| `q3.c` | десять | o'n | ten |
| `q3.c.hint` | Десять это сумма чисел под знаками, а не ответ. | O'n belgilar ostidagi sonlar yig'indisi, javob emas. | Ten is the sum of the numbers under the signs, not the answer. |
| `q3.d` | три | uch | three |
| `q3.d.hint` | Три это только первое слагаемое. | Uch faqat birinchi qo'shiluvchi. | Three is only the first term. |
| `q4.prompt` | Что стоит сверху в формуле перехода? | O'tish formulasida yuqorida nima turadi? | What stands on top in the change of base formula? |
| `q4.a` [верно] | логарифм числа | sonning logarifmi | the logarithm of the number |
| `q4.b` | логарифм основания | asosning logarifmi | the logarithm of the base |
| `q4.b.hint` | Тогда логарифм восемьдесят одного по основанию девять дал бы одну вторую. | U holda sakson birning to'qqiz asosga ko'ra logarifmi bir ikkidan berardi. | Then the logarithm of eighty one to base nine would give one half. |
| `q4.c` | новое основание | yangi asos | the new base |
| `q4.c.hint` | Новое основание стоит у обоих логарифмов, а не отдельно. | Yangi asos ikkala logarifmda ham turadi, alohida emas. | The new base sits on both logarithms, not on its own. |
| `q4.d` | единица | bir | one |
| `q4.d.hint` | Единица сверху бывает в другой формуле, где меняют местами число и основание. | Yuqoridagi bir boshqa formulada bo'ladi, unda son va asos o'rin almashadi. | A one on top appears in a different formula, where the number and the base swap places. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `log₅ 5 = 1` |
| `q2.done` | `logₐ b^p = p·logₐ b` |
| `q3.done` | `log₂ 8 + log₂ 2 = 4` |
| `q4.done` | `logₐ b = log_c b / log_c a` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Вывожу показатель из-под знака множителем | Ko'rsatkichni belgi ostidan ko'paytuvchi qilib chiqaraman | I bring the exponent out as a factor |
| `can.2` | Сворачиваю сумму и разность в один логарифм | Yig'indi va ayirmani bitta logarifmga yig'aman | I fold a sum and a difference into one logarithm |
| `can.3` | Перехожу к новому основанию и не путаю дробь | Yangi asosga o'taman va kasrni chalkashtirmayman | I change the base and do not flip the fraction |
| `can.4` | Знаю, что логарифм суммы не раскрывается | Yig'indining logarifmi ochilmasligini bilaman | I know the logarithm of a sum does not open |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: переход к новому основанию. | Bir joy takrorlashni talab qiladi: yangi asosga o'tish. | One spot needs a second look: the change of base. |
| `levels.back` | Вернись к правилу и к экрану 7. | Qoidaga va yettinchi ekranga qayting. | Go back to the rule and to screen seven. |
| `bridge` | Дальше неравенства с логарифмами: сворачивать придётся до того, как искать ответ. | Keyin logarifmli tengsizliklar: javobni izlashdan oldin yig'ishga to'g'ri keladi. | Next come inequalities with logarithms: folding will have to happen before looking for the answer. |
| `lifehack` | Прежде чем считать, посмотри на основания. Одинаковые сворачиваются, разные требуют перехода. | Hisoblashdan oldin asoslarga qarang. Bir xillari yig'iladi, har xillari o'tishni talab qiladi. | Before computing, look at the bases. Equal ones fold, different ones call for a change of base. |
| `sheetTitle` | Преобразование логарифмов · шпаргалка | Logarifmlarni almashtirish · shpargalka | Transforming logarithms · cheat sheet |
| `sheetSrc` | 10 класс · урок 34 | 10-sinf · 34-dars | Grade 10 · lesson 34 |
| `audio.mount` | Прогноз был про девять и двадцать семь. Посмотрим, что вышло. | Taxmin to'qqiz va yigirma yetti haqida edi. Nima chiqqanini ko'ramiz. | The guess was about nine and twenty seven. Let us see how it turned out. |
| `audio.next` | Девять. Показатель вышел множителем, и прямой счёт это подтвердил. | To'qqiz. Ko'rsatkich ko'paytuvchi bo'lib chiqdi, to'g'ridan hisob buni tasdiqladi. | Nine. The exponent came out as a factor, and the direct count confirmed it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `27` |
| `hook.b` | `9` |
| `proved` | `9` |
| `law` | `logₐ b^p = p·logₐ b` |
| `sheet.1` | `logₐ (b·c) = logₐ b + logₐ c` |
| `sheet.2` | `logₐ (b/c) = logₐ b − logₐ c` |
| `sheet.3` | `logₐ b^p = p·logₐ b` |
| `sheet.4` | `logₐ b = log_c b / log_c a` |
| `sheet.5` | `log₂ 8³ = 9;   (log₂ 8)³ = 27` |
