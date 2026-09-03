# Урок 31 — Логарифм. уравнения · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS29_31_SKELET.md` §9. Опора в учебнике: алгебра 2022, стр. 116–118, параграф
`LOGARIFMIK TENGLAMALAR`.

**Главное решение урока.** Посторонний корень здесь не «не подошёл при проверке». Он **изначально
не был допустимым**, и полоса это показывает до того, как решение началось. Поэтому прибор 5
появляется на экране 3, а не в конце: сначала закрашивается, где обе записи имеют смысл, и только
потом делается первое преобразование.

**Уравнение экрана 10 взято из учебника дословно** — стр. 116, `lg(2x − 2) = lg(x + 2)`.

**После этого урока по плану идёт практикум повторения блока 5** (строка 36 плана).

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | УРАВНЕНИЕ | TENGLAMA | THE EQUATION |
| `title` | Сколько корней на самом деле | Haqiqatda nechta ildiz | How many roots there really are |
| `row.a.name` | оба числа подходят | ikkala son ham yaraydi | both numbers fit |
| `row.b.name` | подходит только одно | faqat bittasi yaraydi | only one of them fits |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проведём полосу и посмотрим, куда падают эти числа. | Javobingiz yozib olindi. Endi polosa o'tkazamiz va bu sonlar qayerga tushishini ko'ramiz. | Your answer is saved. Now we will draw the band and see where these numbers land. |
| `audio.mount` | Уравнение с двумя логарифмами. Решение даёт два числа, четыре и минус два. | Ikki logarifmli tenglama. Yechim ikki son beradi, to'rt va minus ikki. | An equation with two logarithms. Solving it gives two numbers, four and minus two. |
| `audio.r1` | Первая запись говорит, что оба числа корни, ведь оба получены верными преобразованиями. | Birinchi yozuv ikkala son ham ildiz deydi, chunki ikkalasi ham to'g'ri almashtirishlar bilan olingan. | The first reading says both numbers are roots, since both came from correct steps. |
| `audio.r2` | Вторая говорит, что корень только один, а второе число в ответ не годится. | Ikkinchisi ildiz faqat bitta, ikkinchi son esa javobga yaramaydi deydi. | The second says there is only one root, and the second number does not belong in the answer. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `log₂ x + log₂ (x − 2) = 3` |
| `row.a.value` | `4;  −2` |
| `row.b.value` | `4` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед уравнением | Tenglamadan oldin uch savol | Three questions before the equation |
| `q1.prompt` | Чему равна сумма логарифмов с одним основанием? | Bir asosli logarifmlar yig'indisi nechaga teng? | What does a sum of logarithms with the same base equal? |
| `q1.a` [верно] | логарифму произведения | ko'paytmaning logarifmiga | the logarithm of the product |
| `q1.b` | логарифму суммы | yig'indining logarifmiga | the logarithm of the sum |
| `q1.b.hint` | Логарифм суммы не раскрывается вовсе, это проверено на уроке про логарифм. | Yig'indining logarifmi umuman ochilmaydi, bu logarifm haqidagi darsda tekshirilgan. | The logarithm of a sum does not open at all, that was checked in the lesson on logarithms. |
| `q1.c` | произведению логарифмов | logarifmlar ko'paytmasiga | the product of the logarithms |
| `q1.c.hint` | Проверь на четырёх и восьми: выйдет шесть вместо пяти. | To'rt va sakkizda tekshiring: besh o'rniga olti chiqadi. | Check on four and eight: you get six instead of five. |
| `q1.d` | ничему из этого | bularning hech biriga | none of these |
| `q1.d.hint` | Правило есть, и оно выводится из свойства степени. | Qoida bor, va u daraja xossasidan chiqariladi. | The rule exists and comes from a property of powers. |
| `q2.prompt` | Какое число может стоять под знаком логарифма? | Logarifm belgisi ostida qanday son turishi mumkin? | Which number can stand under a logarithm sign? |
| `q2.a` [верно] | только положительное | faqat musbat | only a positive one |
| `q2.b` | любое | har qanday | any |
| `q2.b.hint` | Кривая слева от нуля не проходит вовсе. | Egri chiziq noldan chapda umuman o'tmaydi. | The curve does not pass to the left of zero at all. |
| `q2.c` | любое, кроме нуля | noldan boshqa har qanday | any except zero |
| `q2.c.hint` | Отрицательные тоже выпадают, а не только ноль. | Manfiylar ham tushib qoladi, faqat nol emas. | The negatives drop out too, not only zero. |
| `q2.d` | только целое | faqat butun | only a whole number |
| `q2.d.hint` | Дробное годится, лишь бы положительное. | Kasr yaraydi, faqat musbat bo'lsa. | A fractional one works, as long as it is positive. |
| `q3.prompt` | Чему равен логарифм восьми по основанию два? | Sakkizning ikki asosga ko'ra logarifmi nechaga teng? | What is the logarithm of eight to base two? |
| `q3.a` [верно] | три | uch | three |
| `q3.b` | четыре | to'rt | four |
| `q3.b.hint` | Четыре вышло бы делением, а логарифм это показатель. | To'rt bo'lish bilan chiqardi, logarifm esa ko'rsatkich. | Four would come from dividing, and a logarithm is an exponent. |
| `q3.c` | восемь | sakkiz | eight |
| `q3.c.hint` | Восемь стоит под знаком, а спросили про показатель. | Sakkiz belgi ostida turadi, savol esa ko'rsatkich haqida. | Eight stands under the sign, and the question was about the exponent. |
| `q3.d` | одна треть | bir uchdan | one third |
| `q3.d.hint` | Одна треть выходит при обратном порядке основания и числа. | Bir uchdan asos va son teskari tartibda bo'lganda chiqadi. | One third comes when the base and the number are in the other order. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `logₐ b + logₐ c = logₐ (b·c)` |
| `q2.done` | `x > 0` |
| `q3.done` | `log₂ 8 = 3` |

---

## Экран 3 · `explain1` · ответ `number` · тег `odz-logarifma`

Прибор 5 появляется до первого преобразования.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Полоса чертится до решения | Polosa yechimdan oldin chiziladi | The band is drawn before solving |
| `show.1.1` | первый логарифм требует икс больше нуля | birinchi logarifm iks noldan katta bo'lishini talab qiladi | the first logarithm needs x greater than zero |
| `show.1.2` | второй требует икс больше двух | ikkinchisi iks ikkidan katta bo'lishini talab qiladi | the second needs x greater than two |
| `show.2.1` | закрашено там, где верно и то и другое | ikkalasi ham to'g'ri bo'lgan joy bo'yalgan | the shading is where both hold |
| `show.2.2` | полоса начинается справа от двойки | polosa ikkidan o'ngda boshlanadi | the band starts to the right of two |
| `audio.mount` | Под уравнением появилась полоса. Она показывает, при каких икс обе записи вообще имеют смысл. | Tenglama tagida polosa paydo bo'ldi. U qaysi iksda ikkala yozuv umuman ma'noga ega ekanini ko'rsatadi. | A band appeared under the equation. It shows for which x both readings make sense at all. |
| `audio.band*` | Под первым логарифмом стоит икс, значит икс больше нуля. Под вторым икс минус два, значит икс больше двух. Оба условия должны выполняться сразу, поэтому закрашивается только то, что правее двойки. Сама двойка выколота: при ней второй логарифм превращается в логарифм нуля, а такого числа нет. Полоса начерчена до первого преобразования, и это важно: потом будет поздно. | Birinchi logarifm ostida iks turadi, demak iks noldan katta. Ikkinchisida iks minus ikki, demak iks ikkidan katta. Ikkala shart bir vaqtda bajarilishi kerak, shuning uchun faqat ikkidan o'ngdagi bo'yaladi. Ikkining o'zi ochiq qoldirilgan: unda ikkinchi logarifm nolning logarifmiga aylanadi, bunday son esa yo'q. Polosa birinchi almashtirishdan oldin chizilgan, va bu muhim: keyin kech bo'ladi. | Under the first logarithm stands x, so x is greater than zero. Under the second stands x minus two, so x is greater than two. Both conditions must hold at once, so only what is to the right of two gets shaded. Two itself is punched out: there the second logarithm becomes the logarithm of zero, and no such number exists. The band was drawn before the first step, and that matters: afterwards it is too late. |
| `audio.work` | Посчитай сам. С какого числа начинается закрашенная полоса? | O'zingiz hisoblang. Bo'yalgan polosa qaysi sondan boshlanadi? | Work it out yourself. From which number does the shaded band start? |
| `work.prompt` | С какого числа начинается полоса? | Polosa qaysi sondan boshlanadi? | From which number does the band start? |
| `work.ok` | С двойки. Условие икс больше двух строже, чем икс больше нуля, поэтому побеждает оно. | Ikkidan. Iks ikkidan katta sharti iks noldan katta shartidan qattiqroq, shuning uchun u yutadi. | From two. The condition x greater than two is stricter than x greater than zero, so it wins. |
| `work.hint.1` | Выпиши условие для каждого логарифма отдельно. | Har logarifm uchun shartni alohida yozing. | Write the condition for each logarithm separately. |
| `work.hint.2` | Оба условия должны выполняться сразу, значит берут более строгое. | Ikkala shart bir vaqtda bajarilishi kerak, demak qattiqrog'i olinadi. | Both must hold at once, so the stricter one is taken. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `x > 0,   x − 2 > 0` |
| `show.2.3` | `x > 2` |
| `work.answer` | `2` |

---

## Экран 4 · `explain2` · ответ `order` · тег `odz-logarifma`

Разграничение: одно уравнение полосу почти не сужает, другое сужает вдвое.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Не всякое уравнение сужает полосу | Har tenglama polosani toraytirmaydi | Not every equation narrows the band |
| `show.1.1` | у простого уравнения одно условие | sodda tenglamada bitta shart | a simple equation has one condition |
| `show.1.2` | полоса начинается от нуля | polosa noldan boshlanadi | the band starts from zero |
| `show.2.1` | у суммы условий два | yig'indida shartlar ikkita | a sum has two conditions |
| `show.2.2` | и полоса становится короче | va polosa qisqaradi | and the band gets shorter |
| `audio.mount` | Сравним два уравнения. В первом один логарифм, во втором два. | Ikki tenglamani solishtiramiz. Birinchisida bitta logarifm, ikkinchisida ikkita. | Let us compare two equations. The first has one logarithm, the second two. |
| `audio.two*` | У первого уравнения под знаком стоит просто икс, значит условие одно и полоса начинается сразу от нуля. У второго под вторым знаком стоит икс минус два, и это добавляет второе условие. Полоса сдвигается вправо и становится короче. Чем больше логарифмов, тем короче полоса, и проверять надо каждый. | Birinchi tenglamada belgi ostida oddiy iks turadi, demak shart bitta va polosa darrov noldan boshlanadi. Ikkinchisida ikkinchi belgi ostida iks minus ikki turadi, va bu ikkinchi shartni qo'shadi. Polosa o'ngga suriladi va qisqaradi. Logarifm qancha ko'p bo'lsa, polosa shuncha qisqa, va har birini tekshirish kerak. | In the first equation plain x stands under the sign, so there is one condition and the band starts right at zero. In the second, x minus two stands under the second sign, and that adds a second condition. The band shifts right and gets shorter. The more logarithms, the shorter the band, and each one must be checked. |
| `audio.work` | Расставь шаги, в каком порядке чертят полосу. | Polosa qanday tartibda chizilsa, qadamlarni shunday joylashtiring. | Put the steps in the order the band is drawn. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | условие для каждого | har biri uchun shart | a condition for each |
| `order.s2` | взять более строгое | qattiqrog'ini olish | take the stricter one |
| `order.s3` | закрасить полосу | polosani bo'yash | shade the band |
| `order.s4` | потом решать | keyin yechish | then solve |
| `order.ok` | Полоса чертится первой. Если начать с решения, проверять корни будет нечем. | Polosa birinchi chiziladi. Yechimdan boshlansa, ildizlarni tekshiradigan narsa qolmaydi. | The band is drawn first. Starting with the solution leaves nothing to check the roots against. |
| `order.bad` | Сначала условия, потом полоса, и только потом решение. | Avval shartlar, keyin polosa, va faqat keyin yechim. | First the conditions, then the band, and only then the solution. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `log₂ x = 3   →   x > 0` |
| `show.2.3` | `log₂ x + log₂ (x − 2) = 3   →   x > 2` |
| `order.mark` | `x > 2` |

---

## Экран 5 · `explain3` · ответ `order` · тег `postoronniy-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Знаки логарифма снимаются | Logarifm belgilari olinadi | The logarithm signs come off |
| `show.1.1` | сумма сворачивается в один логарифм | yig'indi bitta logarifmga yig'iladi | the sum folds into one logarithm |
| `show.1.2` | справа тройка это тоже логарифм | o'ngdagi uch ham logarifm | the three on the right is a logarithm too |
| `show.2.1` | основания одинаковы, знаки снимаются | asoslar bir xil, belgilar olinadi | the bases match, the signs come off |
| `show.2.2` | остаётся обычное уравнение | oddiy tenglama qoladi | an ordinary equation is left |
| `audio.mount` | Свернём левую часть. Сумма логарифмов это логарифм произведения. | Chap qismni yig'amiz. Logarifmlar yig'indisi ko'paytmaning logarifmi. | Let us fold the left side. A sum of logarithms is the logarithm of the product. |
| `audio.drop*` | Слева получился один логарифм. Справа тройка, и её тоже можно записать логарифмом восьми по тому же основанию. Теперь слева и справа стоит логарифм с одинаковым основанием, а логарифмическая функция монотонна, значит одному значению отвечает один аргумент. Поэтому знаки снимаются и остаётся обычное уравнение. Но снимать их можно только внутри полосы: за её пределами логарифмов просто нет. | Chapda bitta logarifm chiqdi. O'ngda uch, va uni ham o'sha asosga ko'ra sakkizning logarifmi qilib yozish mumkin. Endi chapda ham o'ngda ham asosi bir xil logarifm turadi, logarifmik funksiya esa monoton, demak bitta qiymatga bitta argument mos keladi. Shuning uchun belgilar olinadi va oddiy tenglama qoladi. Lekin ularni faqat polosa ichida olish mumkin: undan tashqarida logarifmlar umuman yo'q. | On the left one logarithm came out. On the right is three, and it can be written as the logarithm of eight to the same base. Now a logarithm with the same base stands on both sides, and the logarithmic function is monotone, so one value matches one argument. That is why the signs come off and an ordinary equation is left. But they may come off only inside the band: outside it there are no logarithms at all. |
| `audio.work` | Расставь шаги, как снимаются знаки. | Belgilar qanday olinsa, qadamlarni shunday joylashtiring. | Put the steps in the order the signs come off. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | свернуть сумму | yig'indini yig'ish | fold the sum |
| `order.s2` | справа тоже логарифм | o'ngda ham logarifm | a logarithm on the right too |
| `order.s3` | снять знаки | belgilarni olish | take the signs off |
| `order.s4` | решить обычное | oddiyni yechish | solve the ordinary one |
| `order.ok` | Знаки снимаются, потому что основания совпали, а функция монотонна. | Belgilar olinadi, chunki asoslar bir xil bo'ldi, funksiya esa monoton. | The signs come off because the bases matched and the function is monotone. |
| `order.bad` | Сначала свернуть, потом привести правую часть, потом снять знаки. | Avval yig'ish, keyin o'ng qismni keltirish, keyin belgilarni olish. | First fold, then bring the right side, then take the signs off. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `log₂ (x·(x − 2)) = 3` |
| `show.2.3` | `x·(x − 2) = 8` |
| `order.mark` | `x² − 2x − 8 = 0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Замена сводит к квадратному | Almashtirish kvadratga keltiradi | A substitution reduces it to a quadratic |
| `show.1.1` | в уравнении логарифм и его квадрат | tenglamada logarifm va uning kvadrati | the equation has a logarithm and its square |
| `show.1.2` | обозначим логарифм буквой | logarifmni harf bilan belgilaymiz | let us name the logarithm by a letter |
| `show.2.1` | получилось квадратное уравнение | kvadrat tenglama chiqdi | a quadratic equation came out |
| `show.2.2` | оба значения годятся | ikkala qiymat ham yaraydi | both values fit |
| `audio.mount` | Другое уравнение. В нём логарифм стоит и в первой степени, и в квадрате. | Boshqa tenglama. Unda logarifm birinchi darajada ham, kvadratda ham turadi. | Another equation. In it the logarithm stands both in the first power and squared. |
| `audio.sub*` | Обозначим логарифм икс буквой тэ. Получилось обычное квадратное уравнение, его корни один и два. Здесь важное отличие от показательного уравнения: там значение замены было степенью и обязано было быть положительным, а логарифм принимает любые значения. Поэтому оба корня годятся, и каждый возвращается к переменной отдельно. | Iksning logarifmini te harfi bilan belgilaymiz. Oddiy kvadrat tenglama chiqdi, uning ildizlari bir va ikki. Bu yerda ko'rsatkichli tenglamadan muhim farq bor: u yerda almashtirish qiymati daraja edi va musbat bo'lishi shart edi, logarifm esa har qanday qiymatni oladi. Shuning uchun ikkala ildiz ham yaraydi, va har biri o'zgaruvchiga alohida qaytadi. | Let us call the logarithm of x by the letter t. An ordinary quadratic came out, its roots are one and two. Here is an important difference from the exponential equation: there the substituted value was a power and had to be positive, while a logarithm takes any value. So both roots fit, and each returns to the variable separately. |
| `audio.work` | Посчитай сам. Сколько корней замены годится? | O'zingiz hisoblang. Almashtirishning nechta ildizi yaraydi? | Work it out yourself. How many roots of the substitution fit? |
| `work.prompt` | Сколько корней замены годится? | Almashtirishning nechta ildizi yaraydi? | How many roots of the substitution fit? |
| `work.ok` | Два. Логарифм принимает любые значения, поэтому отбрасывать нечего, в отличие от показательного уравнения. | Ikkita. Logarifm har qanday qiymatni oladi, shuning uchun tashlaydigan narsa yo'q, ko'rsatkichli tenglamadan farqli. | Two. A logarithm takes any value, so there is nothing to drop, unlike in an exponential equation. |
| `work.hint.1` | Проверь, есть ли у логарифма запретные значения. | Logarifmda taqiqlangan qiymatlar bormi, tekshiring. | Check whether a logarithm has forbidden values. |
| `work.hint.2` | Множество значений логарифмической функции это все числа. | Logarifmik funksiyaning qiymatlar to'plami hamma son. | The range of a logarithmic function is all numbers. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `log₂² x − 3 log₂ x + 2 = 0` |
| `show.2.3` | `t² − 3t + 2 = 0` |
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `postoronniy-koren`

Свидетель урока: корень падает на полосу и гаснет.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Корень падает на полосу | Ildiz polosaga tushadi | The root lands on the band |
| `show.1.1` | квадратное дало два числа | kvadrat ikki son berdi | the quadratic gave two numbers |
| `show.1.2` | четыре и минус два | to'rt va minus ikki | four and minus two |
| `show.2.1` | четвёрка попала в закрашенное | to'rt bo'yalganga tushdi | four landed in the shading |
| `show.2.2` | минус два остался снаружи и погас | minus ikki tashqarida qoldi va so'ndi | minus two stayed outside and faded |
| `audio.mount` | Вернёмся к уравнению с начала урока. Квадратное дало два числа, четыре и минус два. | Dars boshidagi tenglamaga qaytamiz. Kvadrat ikki son berdi, to'rt va minus ikki. | Back to the equation from the start of the lesson. The quadratic gave two numbers, four and minus two. |
| `audio.fall*` | Опустим оба числа на полосу. Четвёрка попадает в закрашенное, значит это корень. Минус два падает далеко слева, вне полосы, и гаснет. Обрати внимание: он не перестал быть решением квадратного уравнения. Он никогда и не был решением исходного, потому что при нём логарифма просто нет. Вот почему полосу чертят до решения, а не после. | Ikkala sonni polosaga tushiramiz. To'rt bo'yalganga tushadi, demak bu ildiz. Minus ikki chapda uzoqda, polosadan tashqarida tushadi va so'nadi. E'tibor bering: u kvadrat tenglamaning yechimi bo'lishdan to'xtamadi. U dastlabki tenglamaning yechimi hech qachon bo'lmagan, chunki unda logarifm umuman yo'q. Polosa nega yechimdan oldin chizilishi shundan. | Let us drop both numbers onto the band. Four lands in the shading, so it is a root. Minus two lands far to the left, outside the band, and fades. Note: it did not stop being a solution of the quadratic. It never was a solution of the original equation, because there the logarithm does not exist at all. That is why the band is drawn before solving, not after. |
| `audio.work` | Посчитай сам. Сколько чисел из двух попало в полосу? | O'zingiz hisoblang. Ikki sondan nechtasi polosaga tushdi? | Work it out yourself. How many of the two numbers landed in the band? |
| `work.prompt` | Сколько чисел попало в полосу? | Nechta son polosaga tushdi? | How many numbers landed in the band? |
| `work.ok` | Одно. Минус два лежит левее двойки, а там логарифма нет, значит корнем он быть не мог. | Bitta. Minus ikki ikkidan chapda yotadi, u yerda logarifm yo'q, demak u ildiz bo'la olmasdi. | One. Minus two lies to the left of two, and there is no logarithm there, so it could not be a root. |
| `work.hint.1` | Посмотри, где начинается закрашенное. | Bo'yalgan joy qayerdan boshlanishini ko'ring. | Look where the shading begins. |
| `work.hint.2` | Полоса начинается справа от двойки. | Polosa ikkidan o'ngda boshlanadi. | The band starts to the right of two. |
| `work.hint.3` | Одно. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `x² − 2x − 8 = 0   →   4;  −2` |
| `show.2.3` | `x = 4` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `odz-logarifma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Логарифмическое уравнение | Logarifmik tenglama | The logarithmic equation |
| `probe.question` | Почему посторонний корень появляется? | Begona ildiz nega paydo bo'ladi? | Why does an extraneous root appear? |
| `probe.a` [верно] | он не был допустимым с самого начала | u boshidanoq joiz emas edi | it was not admissible from the start |
| `probe.b` | при решении сделали ошибку | yechishda xato qilingan | a mistake was made while solving |
| `probe.b.hint` | Ошибки нет: все шаги верны. Число просто не входит в полосу. | Xato yo'q: hamma qadam to'g'ri. Son shunchaki polosaga kirmaydi. | There is no mistake: every step is correct. The number simply is not in the band. |
| `rule.lawLabel` | Правило | Qoida | The rule |
| `rule.lines.1` | Уравнение, где неизвестное стоит под знаком логарифма или в его основании, называют логарифмическим. | Noma'lum logarifmosti ifodada yoki logarifm asosida qatnashgan tenglama logarifmik tenglama deyiladi. | An equation with the unknown under the logarithm sign or in its base is called logarithmic. |
| `rule.lines.2` | Полосу допустимых значений чертят до первого преобразования. | Joiz qiymatlar polosasi birinchi almashtirishdan oldin chiziladi. | The band of admissible values is drawn before the first step. |
| `rule.lines.3` | Найденный корень принимают, только если он попал в полосу. | Topilgan ildiz faqat polosaga tushsa qabul qilinadi. | A found root is accepted only if it landed in the band. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidadan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Полоса остаётся на экране, и правило открывается рядом. Посторонний корень это не ошибка вычислений, а число, которого не было в области допустимых значений с самого начала. | Polosa ekranda qoladi, va qoida yonida ochiladi. Begona ildiz hisob xatosi emas, boshidanoq joiz qiymatlar sohasida bo'lmagan son. | The band stays on the screen and the rule opens beside it. An extraneous root is not a computation error but a number that was not in the admissible set from the very start. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `logₐ f(x) = logₐ g(x)   →   f(x) = g(x),   f(x) > 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `postoronniy-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Уравнение и его корень | Tenglama va uning ildizi | An equation and its root |
| `match.prompt` | Соедини уравнение с его корнем. | Tenglamani ildizi bilan birlashtiring. | Match each equation with its root. |
| `match.ok` | Каждый корень лежит внутри своей полосы. Границы у полос разные, и смотреть надо на то, что стоит под знаком. | Har ildiz o'z polosasi ichida yotadi. Polosalarning chegaralari har xil, va belgi ostida turganiga qarash kerak. | Every root lies inside its own band. The bands have different edges, and what matters is what stands under the sign. |
| `audio.mount` | Четыре уравнения и четыре корня. Соедини их. | To'rt tenglama va to'rt ildiz. Ularni birlashtiring. | Four equations and four roots. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `log₂ x = 3` · `log₂ (x − 5) = 1` · `lg (2x − 2) = lg (x + 2)` · `log₃ x = 0` |
| `match.a` | `8` |
| `match.b` | `7` |
| `match.c` | `4` |
| `match.d` | `1` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `odz-logarifma`

Уравнение взято из учебника, стр. 116.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Реши по шагам | Qadam bilan yeching | Solve it step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | начертить полосу | polosani chizish | draw the band |
| `order.s2` | снять знаки | belgilarni olish | take the signs off |
| `order.s3` | решить обычное | oddiyni yechish | solve the ordinary one |
| `order.s4` | проверить по полосе | polosa bo'yicha tekshirish | check against the band |
| `order.ok` | Полоса начинается с единицы, а корень равен четырём, значит он подходит. | Polosa birdan boshlanadi, ildiz esa to'rtga teng, demak u yaraydi. | The band starts at one, and the root is four, so it fits. |
| `order.bad` | Сначала полоса, потом знаки, потом решение, и проверка в конце. | Avval polosa, keyin belgilar, keyin yechim, oxirida tekshirish. | First the band, then the signs, then the solution, and the check at the end. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `lg (2x − 2) = lg (x + 2)` |
| `order.mark` | `x = 4` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Реши без полосы | Polosasiz yeching | Solve it without the band |
| `task.ok` | Девять. Логарифм равен трём, значит икс минус один равно восьми. | To'qqiz. Logarifm uchga teng, demak iks minus bir sakkizga teng. | Nine. The logarithm is three, so x minus one equals eight. |
| `task.hint.1` | Логарифм равен трём, значит под знаком стоит два в кубе. | Logarifm uchga teng, demak belgi ostida ikki kubda turadi. | The logarithm is three, so two cubed stands under the sign. |
| `task.hint.2` | Икс минус один равно восьми. | Iks minus bir sakkizga teng. | X minus one equals eight. |
| `task.hint.3` | Девять. | To'qqiz. | Nine. |
| `order.prompt` | Расставь по возрастанию левой границы полосы. | Polosaning chap chegarasi o'sishi bo'yicha joylashtiring. | Arrange by increasing left edge of the band. |
| `order.title` | У какого уравнения полоса начинается раньше? | Qaysi tenglamaning polosasi oldinroq boshlanadi? | Which equation has the band starting earlier? |
| `order.ok` | Чем больше вычитают под знаком, тем правее начинается полоса. | Belgi ostida qancha ko'p ayirilsa, polosa shuncha o'ngroqda boshlanadi. | The more is subtracted under the sign, the further right the band starts. |
| `order.bad` | Выпиши условие для каждого и сравни границы. | Har biri uchun shartni yozing va chegaralarni solishtiring. | Write the condition for each and compare the edges. |
| `audio.mount` | На этом экране полосы нет. На экзамене её тоже не будет. | Bu ekranda polosa yo'q. Imtihonda ham bo'lmaydi. | There is no band on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `log₂ (x − 1) = 3   →   x = ?` |
| `task.answer` | `9` |
| `order.items` | `log₂ x` · `log₂ (x − 1)` · `log₂ (x − 5)` · `log₂ (x − 9)` |
| `order.answer` | `log₂ x  log₂ (x − 1)  log₂ (x − 5)  log₂ (x − 9)` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ лишний. Где? | Javobda ortiqchasi bor. Qayerda? | The answer has an extra. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r2` | Свёртка суммы сделана верно. | Yig'indini yig'ish to'g'ri bajarilgan. | The sum was folded correctly. |
| `hint.r3` | Квадратное уравнение решено верно. | Kvadrat tenglama to'g'ri yechilgan. | The quadratic was solved correctly. |
| `proof` | Здесь в ответ записали оба числа, а одно из них лежит вне полосы. | Bu yerda javobga ikkala son yozilgan, ulardan biri esa polosadan tashqarida. | Here both numbers went into the answer, and one of them lies outside the band. |
| `entry.prompt` | Какое число в ответе лишнее? | Javobdagi qaysi son ortiqcha? | Which number in the answer is the extra one? |
| `entry.ok` | Минус три. При нём под знаком логарифма стоит отрицательное число, а такого логарифма нет. | Minus uch. Unda logarifm belgisi ostida manfiy son turadi, bunday logarifm esa yo'q. | Minus three. There a negative number stands under the logarithm sign, and no such logarithm exists. |
| `entry.hint.1` | Подставь каждое число под знак логарифма. | Har sonni logarifm belgisi ostiga qo'ying. | Substitute each number under the logarithm sign. |
| `entry.hint.2` | Одно из них даёт отрицательное выражение. | Ulardan biri manfiy ifoda beradi. | One of them gives a negative expression. |
| `entry.hint.3` | Минус три. | Minus uch. | Minus three. |
| `audio.mount` | Задача. Решить уравнение с двумя логарифмами. | Masala. Ikki logarifmli tenglamani yechish. | A task. Solve an equation with two logarithms. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `log₃ x + log₃ (x + 2) = 1` |
| `row.r2` | `log₃ (x·(x + 2)) = 1` |
| `row.r3` | `x² + 2x − 3 = 0` |
| `row.r4` | `x = 1;  x = −3` |
| `answerId` | `r4` |
| `entry.answer` | `−3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По записи найди границу | Yozuv bo'yicha chegarani toping | From the reading back to the edge |
| `entry.prompt` | С какого числа начинается полоса у логарифма от икс минус пять? | Iks minus beshning logarifmida polosa qaysi sondan boshlanadi? | From which number does the band start for the logarithm of x minus five? |
| `entry.ok` | С пятёрки. Под знаком должно стоять положительное, значит икс больше пяти. | Beshdan. Belgi ostida musbat turishi kerak, demak iks beshdan katta. | From five. A positive number must stand under the sign, so x is greater than five. |
| `entry.hint.1` | Приравняй выражение под знаком нулю. | Belgi ostidagi ifodani nolga tenglashtiring. | Set the expression under the sign to zero. |
| `entry.hint.2` | Икс минус пять равно нулю. | Iks minus besh nolga teng. | X minus five equals zero. |
| `entry.hint.3` | Пять. | Besh. | Five. |
| `multi.prompt` | Отметь все числа, которые в эту полосу не попадают. | Bu polosaga tushmaydigan hamma sonni belgilang. | Mark every number that does not land in this band. |
| `multi.title` | Какие числа в полосу не попадают? | Qaysi sonlar polosaga tushmaydi? | Which numbers do not land in the band? |
| `multi.c.hint` | Шесть больше пяти, значит попадает. | Olti beshdan katta, demak tushadi. | Six is greater than five, so it lands inside. |
| `multi.d.hint` | Десять больше пяти, значит попадает. | O'n beshdan katta, demak tushadi. | Ten is greater than five, so it lands inside. |
| `multi.ok` | Две из четырёх. Граница выколота, поэтому сама пятёрка тоже не годится. | To'rttadan ikkitasi. Chegara ochiq, shuning uchun beshning o'zi ham yaramaydi. | Two out of four. The edge is punched out, so five itself does not fit either. |
| `audio.mount` | Теперь обратная задача. Дана запись, найти надо границу полосы. | Endi teskari masala. Yozuv berilgan, polosaning chegarasini topish kerak. | Now the inverse task. A reading is given, and the edge of the band must be found. |
| `audio.work` | Сначала запиши границу, потом отметишь числа вне полосы. | Avval chegarani yozing, keyin polosadan tashqaridagi sonlarni belgilaysiz. | First type the edge, then you will mark the numbers outside the band. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.answer` | `5` |
| `multi.a` [верно] | `5` |
| `multi.b` [верно] | `0` |
| `multi.c` | `6` |
| `multi.d` | `10` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `odz-logarifma`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Когда чертят полосу допустимых значений? | Joiz qiymatlar polosasi qachon chiziladi? | When is the band of admissible values drawn? |
| `q1.a` [верно] | до первого преобразования | birinchi almashtirishdan oldin | before the first step |
| `q1.b` | после того, как нашли корни | ildizlar topilgandan keyin | after the roots are found |
| `q1.b.hint` | Тогда проверка превращается в обряд. Полоса нужна как условие, а не как проверка. | Unda tekshirish marosimga aylanadi. Polosa tekshirish emas, shart sifatida kerak. | Then the check becomes a ritual. The band is needed as a condition, not as a check. |
| `q1.c` | только если ответ странный | faqat javob g'alati bo'lsa | only if the answer looks odd |
| `q1.c.hint` | Странный ответ заметить нельзя, если не с чем сравнивать. | Solishtiradigan narsa bo'lmasa, g'alati javobni sezib bo'lmaydi. | An odd answer cannot be spotted with nothing to compare it to. |
| `q1.d` | никогда | hech qachon | never |
| `q1.d.hint` | Без неё посторонний корень попадает в ответ. | Usiz begona ildiz javobga tushadi. | Without it an extraneous root gets into the answer. |
| `q2.prompt` | Почему появляется посторонний корень? | Begona ildiz nega paydo bo'ladi? | Why does an extraneous root appear? |
| `q2.a` [верно] | он не был допустимым с самого начала | u boshidanoq joiz emas edi | it was not admissible from the start |
| `q2.b` | из-за ошибки в вычислениях | hisobdagi xato tufayli | because of a computation error |
| `q2.b.hint` | Все шаги были верны, и это видно по строкам. | Hamma qadam to'g'ri edi, va bu qatorlardan ko'rinadi. | Every step was correct, and the lines show it. |
| `q2.c` | логарифм так устроен | logarifm shunday tuzilgan | that is how a logarithm works |
| `q2.c.hint` | Дело не в логарифме, а в том, что число вне полосы. | Gap logarifmda emas, sonning polosadan tashqarida ekanida. | It is not about the logarithm but about the number being outside the band. |
| `q2.d` | корней всегда два | ildiz doim ikkita | there are always two roots |
| `q2.d.hint` | Их бывает и один, и ни одного. | Ular bitta ham, birorta ham bo'lmasligi mumkin. | There can be one, or none. |
| `q3.prompt` | Что даёт логарифм от икс минус два? | Iks minus ikkining logarifmi nima beradi? | What does the logarithm of x minus two give? |
| `q3.a` [верно] | условие икс больше двух | iks ikkidan katta shartini | the condition x greater than two |
| `q3.a.ok` | Да. Под знаком должно стоять положительное число. | Ha. Belgi ostida musbat son turishi kerak. | Yes. A positive number must stand under the sign. |
| `q3.b` | условие икс больше нуля | iks noldan katta shartini | the condition x greater than zero |
| `q3.b.hint` | Ноль подошёл бы, если бы под знаком стоял просто икс. | Belgi ostida oddiy iks tursa nol yarardi. | Zero would fit if plain x stood under the sign. |
| `q3.c` | условие икс меньше двух | iks ikkidan kichik shartini | the condition x less than two |
| `q3.c.hint` | Тогда выражение под знаком было бы отрицательным. | Unda belgi ostidagi ifoda manfiy bo'lardi. | Then the expression under the sign would be negative. |
| `q3.d` | никакого условия | hech qanday shart | no condition at all |
| `q3.d.hint` | Условие есть у каждого логарифма. | Har logarifmning sharti bor. | Every logarithm has a condition. |
| `q4.prompt` | Можно ли снимать знаки логарифма? | Logarifm belgilarini olish mumkinmi? | May the logarithm signs be taken off? |
| `q4.a` [верно] | да, если основания совпали и мы внутри полосы | ha, asoslar bir xil bo'lsa va polosa ichida bo'lsak | yes, if the bases match and we are inside the band |
| `q4.b` | да, всегда | ha, doim | yes, always |
| `q4.b.hint` | Вне полосы логарифмов просто нет, снимать нечего. | Polosadan tashqarida logarifmlar umuman yo'q, oladigan narsa yo'q. | Outside the band there are no logarithms at all, nothing to take off. |
| `q4.c` | нет, никогда | yo'q, hech qachon | no, never |
| `q4.c.hint` | Можно: функция монотонна, и одному значению отвечает один аргумент. | Mumkin: funksiya monoton, va bitta qiymatga bitta argument mos keladi. | It is allowed: the function is monotone, and one value matches one argument. |
| `q4.d` | только если основание равно десяти | faqat asos o'nga teng bo'lsa | only if the base is ten |
| `q4.d.hint` | Основание может быть любым, лишь бы одинаковым слева и справа. | Asos har qanday bo'lishi mumkin, faqat chapda va o'ngda bir xil bo'lsa. | The base can be anything, as long as it is the same on both sides. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `x > 0` |
| `q2.done` | `x = −2` |
| `q3.done` | `x > 2` |
| `q4.done` | `f(x) = g(x)` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Черчу полосу допустимых значений до решения | Joiz qiymatlar polosasini yechimdan oldin chizaman | I draw the band of admissible values before solving |
| `can.2` | Свожу сумму логарифмов к одному | Logarifmlar yig'indisini bittaga keltiraman | I fold a sum of logarithms into one |
| `can.3` | Снимаю знаки, когда основания совпали | Asoslar bir xil bo'lganda belgilarni olaman | I take the signs off when the bases match |
| `can.4` | Проверяю корни по полосе, а не на удачу | Ildizlarni omadga emas, polosa bo'yicha tekshiraman | I check roots against the band, not by luck |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: полоса допустимых значений. | Bitta joy takrorlashni talab qiladi: joiz qiymatlar polosasi. | One place needs review: the band of admissible values. |
| `levels.back` | Вернись к правилу и к экрану 3. | Qoidaga va 3-ekranga qayting. | Go back to the rule and to screen 3. |
| `bridge` | Дальше практикум повторения блока: степень, показательная и логарифмическая вместе. | Keyin blokni takrorlash praktikumi: daraja, ko'rsatkichli va logarifmik birga. | Next comes the block review practicum: powers, exponentials and logarithms together. |
| `lifehack` | Увидел логарифм с неизвестным, сразу черти полосу. Потом будет некогда и незачем. | Noma'lumli logarifmni ko'rdingizmi, darrov polosa chizing. Keyin vaqt ham, ma'no ham qolmaydi. | Spotted a logarithm with the unknown, draw the band at once. Later there will be neither time nor point. |
| `sheetTitle` | Логарифмические уравнения · шпаргалка | Logarifmik tenglamalar · shpargalka | Logarithmic equations · cheat sheet |
| `sheetSrc` | 10 класс · урок 31 | 10-sinf · 31-dars | Grade 10 · lesson 31 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija. | At the start you had to choose one of two readings. Here is the result. |
| `audio.next` | Корень один. Второе число не стало посторонним после решения, оно никогда и не было допустимым. | Ildiz bitta. Ikkinchi son yechimdan keyin begona bo'lib qolgani yo'q, u hech qachon joiz bo'lmagan. | There is one root. The second number did not become extraneous after solving, it never was admissible. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `4;  −2` |
| `hook.b` | `4` |
| `proved` | `4` |
| `law` | `logₐ f(x) = logₐ g(x)   →   f(x) = g(x),   f(x) > 0` |
| `sheet.1` | `f(x) > 0` |
| `sheet.2` | `logₐ b + logₐ c = logₐ (b·c)` |
| `sheet.3` | `logₐ f = logₐ g   →   f = g` |
| `sheet.4` | `t = logₐ x,   t ∈ R` |
| `sheet.5` | `4 ∈ (2; +∞),   −2 ∉ (2; +∞)` |
