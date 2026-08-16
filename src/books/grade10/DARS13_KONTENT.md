# Урок 13 — Методы · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS12_KONTENT.md`.

Скелет: `DARS11_13_SKELET.md` §8. Опора в учебнике: алгебра 2022, стр. 147–150.

**Главное решение урока.** Новых простейших уравнений здесь нет. Урок про то, **как не потерять
корни**, приводя уравнение к простейшему. Деление на `cos x` выглядит удобным сокращением, но
серия, где косинус равен нулю, была решением — и после деления её на экране не остаётся. Поэтому
обе серии сначала зажигаются, а потом одна гаснет: видно, что именно потеряли.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | МЕТОДЫ | USULLAR | THE METHODS |
| `title` | Можно ли делить на косинус? | Kosinusga bo'lish mumkinmi? | May we divide by the cosine? |
| `row.a.name` | можно, ответ тот же | mumkin, javob o'sha | yes, the answer stays |
| `row.b.name` | нельзя, корни потеряются | mumkin emas, ildizlar yo'qoladi | no, roots get lost |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас поделим и посмотрим, что останется. | Javobingiz yozib olindi. Endi bo'lib, nima qolishini ko'ramiz. | Your answer is saved. Now we will divide and see what is left. |
| `audio.mount*` | На окружности горят четыре корня. Сейчас мы поделим обе части на косинус, и два из них погаснут. | Aylanada to'rt ildiz yonib turadi. Endi ikkala qismni kosinusga bo'lamiz, va ulardan ikkitasi so'nadi. | Four roots are lit on the circle. Now we will divide both sides by the cosine, and two of them will fade. |
| `audio.r1` | Первая запись говорит, что делить можно и ответ не изменится. | Birinchi yozuv bo'lish mumkin va javob o'zgarmaydi deydi. | The first reading says dividing is fine and the answer stays. |
| `audio.r2` | Вторая говорит, что часть корней в ответ не попадёт. | Ikkinchisi ildizlarning bir qismi javobga tushmaydi deydi. | The second says some roots will not be in the answer. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `2 sin x·cos x = cos x` |
| `row.a.value` | `2 sin x = 1` |
| `row.b.value` | `cos x·(2 sin x − 1) = 0` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед методами | Usullardan oldin uch savol | Three questions before the methods |
| `q1.prompt` | Когда произведение равно нулю? | Ko'paytma qachon nolga teng? | When is a product equal to zero? |
| `q1.a` [верно] | хотя бы один множитель ноль | bitta ko'paytuvchi nol | at least one factor is zero |
| `q1.b` | все множители нули | hamma ko'paytuvchi nol | all factors are zero |
| `q1.b.hint` | Достаточно одного: остальные могут быть любыми. | Bittasi yetadi: qolganlari har qanday bo'lishi mumkin. | One is enough: the others may be anything. |
| `q1.c` | множители равны | ko'paytuvchilar teng | the factors are equal |
| `q1.c.hint` | Равные множители дают квадрат, а не обязательно ноль. | Teng ko'paytuvchilar kvadrat beradi, nol emas. | Equal factors give a square, not necessarily zero. |
| `q1.d` | никогда | hech qachon | never |
| `q1.d.hint` | Ноль в произведении обнуляет всё. | Ko'paytmadagi nol hammasini nollaydi. | A zero in a product zeroes everything. |
| `q2.prompt` | При каких углах косинус равен нулю? | Qaysi burchaklarda kosinus nolga teng? | At which angles is the cosine zero? |
| `q2.a` [верно] | девяносто и двести семьдесят | to'qson va ikki yuz yetmish | ninety and two hundred seventy |
| `q2.b` | ноль и сто восемьдесят | nol va yuz sakson | zero and one hundred eighty |
| `q2.b.hint` | Там ноль у высоты, то есть у синуса. | U yerda nol balandlikda, ya'ni sinusda. | There the zero is in the height, that is the sine. |
| `q2.c` | ни при каких | hech qaysida | at none of them |
| `q2.c.hint` | На вертикальной оси сдвиг равен нулю. | Vertikal o'qda siljish nolga teng. | On the vertical axis the shift is zero. |
| `q2.d` | сорок пять | qirq besh | forty five |
| `q2.d.hint` | Там сдвиг и высота равны и не равны нулю. | U yerda siljish va balandlik teng va nolga teng emas. | There the shift and the height are equal and not zero. |
| `q3.prompt` | Какие значения может принимать синус? | Sinus qanday qiymatlarni olishi mumkin? | Which values can the sine take? |
| `q3.a` [верно] | от минус единицы до единицы | minus birdan birgacha | from minus one to one |
| `q3.b` | любые | har qanday | any values |
| `q3.b.hint` | Точка лежит на окружности радиуса один. | Nuqta radiusi bir bo'lgan aylanada yotadi. | The point lies on the circle of radius one. |
| `q3.c` | только целые | faqat butun sonlar | only whole numbers |
| `q3.c.hint` | Между нулём и единицей значений сколько угодно. | Nol va bir orasida qiymatlar qancha bo'lsa ham bor. | Between zero and one there are any number of values. |
| `q3.d` | только положительные | faqat musbat | only positive ones |
| `q3.d.hint` | Ниже оси высота отрицательна. | O'qdan pastda balandlik manfiy. | Below the axis the height is negative. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a·b = 0` |
| `q2.done` | `cos x = 0   →   90°,  270°` |
| `q3.done` | `−1 ≤ sin x ≤ 1` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `koren-poteryan-pri-delenii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Общий множитель выносится | Umumiy ko'paytuvchi chiqariladi | The common factor comes out |
| `show.1.1` | косинус есть в обеих частях | kosinus ikkala qismda ham bor | the cosine is in both sides |
| `show.1.2` | переносим и выносим | ko'chiramiz va chiqaramiz | we move it over and factor it out |
| `show.2.1` | произведение равно нулю | ko'paytma nolga teng | the product equals zero |
| `show.2.2` | значит два простейших уравнения | demak ikkita sodda tenglama | so two simplest equations |
| `audio.mount` | В уравнении косинус стоит в обеих частях. Его можно вынести. | Tenglamada kosinus ikkala qismda turadi. Uni chiqarish mumkin. | In the equation the cosine stands in both sides. It can be factored out. |
| `audio.split*` | Переносим всё в одну часть и выносим косинус. Получается произведение, равное нулю, а такое произведение распадается на два простейших уравнения. На окружности зажигаются все четыре корня: два от косинуса и два от синуса. | Hammasini bir qismga ko'chiramiz va kosinusni chiqaramiz. Nolga teng ko'paytma chiqadi, bunday ko'paytma esa ikkita sodda tenglamaga ajraladi. Aylanada to'rt ildiz yonadi: ikkitasi kosinusdan, ikkitasi sinusdan. | We move everything to one side and factor out the cosine. A product equal to zero appears, and such a product splits into two simplest equations. All four roots light up on the circle: two from the cosine and two from the sine. |
| `audio.work` | Теперь сам. Поставь точку в тот корень, который даёт косинус. | Endi o'zingiz. Kosinus beradigan ildizga nuqta qo'ying. | Now you. Place the point at the root that comes from the cosine. |
| `work.prompt` | Поставь точку в корень, где косинус равен нулю. | Kosinus nolga teng bo'lgan ildizga nuqta qo'ying. | Place the point at the root where the cosine is zero. |
| `work.ok` | Девяносто градусов. Сдвиг там равен нулю, значит первый множитель обнуляется. | To'qson gradus. U yerda siljish nolga teng, demak birinchi ko'paytuvchi nollanadi. | Ninety degrees. The shift there is zero, so the first factor becomes zero. |
| `work.hint.1` | Косинус это сдвиг, ищи, где он равен нулю. | Kosinus bu siljish, u nolga teng joyni qidiring. | The cosine is the shift, look where it is zero. |
| `work.hint.2` | Это верхняя или нижняя точка окружности. | Bu aylananing yuqori yoki pastki nuqtasi. | That is the top or the bottom point of the circle. |
| `work.hint.3` | Девяносто градусов. | To'qson gradus. | Ninety degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 4 · `explain2` · ответ `lead` · тег `koren-poteryan-pri-delenii`

Свидетель урока: серия гаснет на глазах.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Деление гасит серию | Bo'lish seriyani so'ndiradi | Dividing puts a series out |
| `show.1.1` | делим обе части на косинус | ikkala qismni kosinusga bo'lamiz | we divide both sides by the cosine |
| `show.1.2` | запись стала короче | yozuv qisqardi | the reading got shorter |
| `show.2.1` | два корня погасли | ikki ildiz so'ndi | two roots faded |
| `show.2.2` | а они были решением | ular esa yechim edi | and they were solutions |
| `audio.mount` | Теперь попробуем сделать иначе: поделим обе части на косинус. | Endi boshqacha qilib ko'ramiz: ikkala qismni kosinusga bo'lamiz. | Now let us try it differently: divide both sides by the cosine. |
| `audio.lose*` | Запись стала короче, но смотри на окружность: два корня погасли. Это те, где косинус равен нулю. Делить на них было нельзя, и они выпали из ответа. Поэтому уравнение не делят, а разлагают на множители. | Yozuv qisqardi, lekin aylanaga qarang: ikki ildiz so'ndi. Bu kosinus nolga teng bo'lganlar. Ularga bo'lish mumkin emas edi, va ular javobdan tushib qoldi. Shuning uchun tenglama bo'linmaydi, ko'paytuvchilarga ajratiladi. | The reading got shorter, but look at the circle: two roots faded. Those are the ones where the cosine is zero. Dividing by them was not allowed, and they dropped out of the answer. That is why an equation is factored, not divided. |
| `audio.work` | Теперь сам. Поставь точку в тот корень, который потерялся. | Endi o'zingiz. Yo'qolgan ildizga nuqta qo'ying. | Now you. Place the point at the root that got lost. |
| `work.prompt` | Поставь точку в потерянный корень. | Yo'qolgan ildizga nuqta qo'ying. | Place the point at the lost root. |
| `work.ok` | Двести семьдесят. Там косинус равен нулю, и деление именно эти корни и уничтожает. | Ikki yuz yetmish. U yerda kosinus nolga teng, va bo'lish aynan shu ildizlarni yo'q qiladi. | Two hundred seventy. There the cosine is zero, and division destroys exactly those roots. |
| `work.hint.1` | Потерялись те корни, где косинус равен нулю. | Kosinus nolga teng ildizlar yo'qoldi. | The lost roots are the ones where the cosine is zero. |
| `work.hint.2` | Один из них наверху, другой внизу. | Biri yuqorida, ikkinchisi pastda. | One of them is at the top, the other at the bottom. |
| `work.hint.3` | Двести семьдесят градусов. | Ikki yuz yetmish gradus. | Two hundred seventy degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 5 · `explain3` · ответ `lead` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Замена делает уравнение обычным | Almashtirish tenglamani oddiy qiladi | A substitution makes it an ordinary equation |
| `show.1.1` | синус встречается дважды | sinus ikki marta uchraydi | the sine occurs twice |
| `show.1.2` | обозначим его буквой | uni harf bilan belgilaymiz | let us name it with a letter |
| `show.2.1` | получилось обычное уравнение | oddiy tenglama chiqdi | an ordinary equation came out |
| `show.2.2` | решаем как в восьмом классе | sakkizinchi sinfdagidek yechamiz | we solve it as in grade eight |
| `audio.mount` | Здесь синус встречается дважды, и в квадрате, и просто. | Bu yerda sinus ikki marta uchraydi: kvadratda va oddiy. | Here the sine occurs twice, squared and plain. |
| `audio.swap*` | Обозначим синус буквой тэ. Уравнение становится обычным квадратным, и оно решается тем же способом, что в восьмом классе. Получаются два значения: единица и одна вторая. | Sinusni te harfi bilan belgilaymiz. Tenglama oddiy kvadrat tenglamaga aylanadi, va u sakkizinchi sinfdagi usul bilan yechiladi. Ikki qiymat chiqadi: bir va bir ikkidan. | Let us name the sine t. The equation becomes an ordinary quadratic one, and it is solved the same way as in grade eight. Two values come out: one and one half. |
| `audio.work` | Теперь сам. Поставь точку в тот корень, который даёт значение единица. | Endi o'zingiz. Bir qiymatini beradigan ildizga nuqta qo'ying. | Now you. Place the point at the root giving the value one. |
| `work.prompt` | Поставь точку, где синус равен единице. | Sinus birga teng joyga nuqta qo'ying. | Place the point where the sine equals one. |
| `work.ok` | Девяносто градусов. Высота там равна единице, это и есть первое значение замены. | To'qson gradus. U yerda balandlik birga teng, bu almashtirishning birinchi qiymati. | Ninety degrees. The height there is one, and that is the first value of the substitution. |
| `work.hint.1` | Синус это высота, ищи наибольшую. | Sinus bu balandlik, eng kattasini qidiring. | The sine is the height, look for the largest. |
| `work.hint.2` | Она бывает на самом верху окружности. | U aylananing eng tepasida bo'ladi. | It happens at the very top of the circle. |
| `work.hint.3` | Девяносто градусов. | To'qson gradus. | Ninety degrees. |

**Формулы**

| Ключ | Значение |
|---|---|

---

## Экран 6 · `explain4` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Не всякое значение замены годится | Almashtirishning har qiymati yaramaydi | Not every substituted value fits |
| `show.1.1` | замена дала два значения | almashtirish ikki qiymat berdi | the substitution gave two values |
| `show.1.2` | одно равно двум | biri ikkiga teng | one of them equals two |
| `show.2.1` | синус двойки не даёт | sinus ikkini bermaydi | the sine never gives two |
| `show.2.2` | значит это значение отбрасывается | demak bu qiymat tashlanadi | so that value is dropped |
| `audio.mount` | Возьмём другое уравнение. После замены получились двойка и минус одна вторая. | Boshqa tenglamani olaylik. Almashtirishdan keyin ikki va minus bir ikkidan chiqdi. | Take another equation. After the substitution we got two and minus one half. |
| `audio.check*` | Двойка не годится: высота точки на окружности больше единицы не бывает. Прямая на такой высоте прошла бы мимо круга. Значит это значение отбрасывается, а решать надо только со вторым. | Ikki yaramaydi: aylanadagi nuqtaning balandligi birdan katta bo'lmaydi. Shunday balandlikdagi to'g'ri chiziq aylananing yonidan o'tardi. Demak bu qiymat tashlanadi, faqat ikkinchisi bilan yechish kerak. | Two does not fit: the height of a point on the circle is never above one. A line at such a height would miss the circle. So that value is dropped, and only the second one is solved. |
| `audio.work` | Посчитай сам. Сколько значений замены годится? | O'zingiz hisoblang. Almashtirishning nechta qiymati yaraydi? | Compute it yourself. How many substituted values fit? |
| `work.prompt` | Сколько значений замены годится? | Almashtirishning nechta qiymati yaraydi? | How many substituted values fit? |
| `work.ok` | Одно. Двойка выходит за пределы, а минус одна вторая помещается. | Bitta. Ikki chegaradan chiqadi, minus bir ikkidan esa sig'adi. | One. Two is out of range, and minus one half fits. |
| `work.hint.1` | Проверь каждое значение по границам синуса. | Har qiymatni sinus chegaralari bilan tekshiring. | Check each value against the bounds of the sine. |
| `work.hint.2` | Границы это от минус единицы до единицы. | Chegaralar minus birdan birgacha. | The bounds are from minus one to one. |
| `work.hint.3` | Одно. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `seriya-bez-n`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Возврат к переменной | O'zgaruvchiga qaytish | Back to the variable |
| `show.1.1` | значение замены найдено | almashtirish qiymati topildi | the substituted value is found |
| `show.1.2` | но это ещё не ответ | lekin bu hali javob emas | but that is not the answer yet |
| `show.2.1` | подставляем обратно | orqaga qo'yamiz | we put it back |
| `show.2.2` | и решаем простейшее | va soddani yechamiz | and solve the simplest equation |
| `audio.mount` | Значение замены найдено, но ответ пишется углами, а не буквой. | Almashtirish qiymati topildi, lekin javob harf bilan emas, burchaklar bilan yoziladi. | The substituted value is found, but the answer is written in angles, not in a letter. |
| `audio.back*` | Подставляем найденное значение обратно и решаем простейшее уравнение. Одно значение замены даёт целых две серии корней, потому что прямая на этой высоте задевает окружность дважды. | Topilgan qiymatni orqaga qo'yamiz va sodda tenglamani yechamiz. Almashtirishning bitta qiymati ikkita seriya beradi, chunki shu balandlikdagi to'g'ri chiziq aylanani ikki marta kesadi. | We put the found value back and solve the simplest equation. One substituted value gives two whole series of roots, because a line at that height meets the circle twice. |
| `audio.work` | Посчитай сам. Сколько серий даёт одно значение замены? | O'zingiz hisoblang. Almashtirishning bitta qiymati nechta seriya beradi? | Compute it yourself. How many series does one substituted value give? |
| `work.prompt` | Сколько серий даёт одно значение замены? | Almashtirishning bitta qiymati nechta seriya beradi? | How many series does one substituted value give? |
| `work.ok` | Две. Прямая на этой высоте задевает окружность в двух точках, и у каждой своя серия. | Ikkita. Shu balandlikdagi to'g'ri chiziq aylanani ikki nuqtada kesadi, va har birining o'z seriyasi bor. | Two. A line at that height meets the circle at two points, and each has its own series. |
| `work.hint.1` | Проведи прямую на найденной высоте. | Topilgan balandlikda to'g'ri chiziq o'tkazing. | Draw a line at the found height. |
| `work.hint.2` | Она задевает окружность в двух точках. | U aylanani ikki nuqtada kesadi. | It meets the circle at two points. |
| `work.hint.3` | Две. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `koren-poteryan-pri-delenii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Как приводить к простейшему | Soddaga qanday keltirish | How to reduce to the simplest |
| `probe.question` | Почему нельзя делить на косинус? | Nega kosinusga bo'lish mumkin emas? | Why is dividing by the cosine not allowed? |
| `probe.a` [верно] | там, где он ноль, были корни | u nol bo'lgan joyda ildizlar bor edi | where it is zero there were roots |
| `probe.b` | деление усложняет запись | bo'lish yozuvni murakkablashtiradi | division makes the reading harder |
| `probe.b.hint` | Запись как раз упрощается. Дело в потерянных корнях, а не в удобстве. | Yozuv aksincha soddalashadi. Gap yo'qolgan ildizlarda, qulaylikda emas. | The reading actually gets simpler. The issue is the lost roots, not convenience. |
| `rule.lawLabel` | Приведение | Keltirish | The reduction |
| `rule.lines.1` | Общий множитель выносят, а произведение, равное нулю, распадается на простейшие уравнения. | Umumiy ko'paytuvchi chiqariladi, nolga teng ko'paytma esa sodda tenglamalarga ajraladi. | The common factor is taken out, and a product equal to zero splits into simplest equations. |
| `rule.lines.2` | Делить обе части на выражение с неизвестным нельзя: корни, где оно равно нулю, теряются. | Ikkala qismni noma'lumli ifodaga bo'lish mumkin emas: u nolga teng bo'lgan ildizlar yo'qoladi. | Both sides must not be divided by an expression with the unknown: the roots where it is zero get lost. |
| `rule.lines.3` | После замены проверяют границы, а в конце возвращаются к переменной. | Almashtirishdan keyin chegaralar tekshiriladi, oxirida esa o'zgaruvchiga qaytiladi. | After a substitution the bounds are checked, and at the end we return to the variable. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Погасшие корни зажигаются обратно, и правило открывается рядом. Делить на выражение с неизвестным нельзя не по договору, а потому, что на экране видно, что при этом теряется. | So'ngan ildizlar qaytadan yonadi, va qoida yonida ochiladi. Noma'lumli ifodaga bo'lish kelishuv bo'yicha emas, ekranda nima yo'qolganini ko'rish mumkin bo'lgani uchun mumkin emas. | The faded roots light up again, and the rule opens beside it. Dividing by an expression with the unknown is forbidden not by agreement but because the screen shows what gets lost. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a·b = 0   →   a = 0,  b = 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `koren-poteryan-pri-delenii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Сколько серий в полном ответе | To'liq javobda nechta seriya | How many series in the full answer |
| `match.prompt` | Соедини уравнение с числом серий в полном ответе. | Tenglamani to'liq javobdagi seriyalar soni bilan birlashtiring. | Match the equation with the number of series in its full answer. |
| `match.ok` | Считаются серии, а не корни. У косинуса две точки складываются в одну серию, у синуса нет, а прямая мимо круга не даёт ни одной. | Ildizlar emas, seriyalar sanaladi. Kosinusda ikki nuqta bitta seriyaga yig'iladi, sinusda esa yo'q, aylananing yonidan o'tgan chiziq esa birortasini bermaydi. | Series are counted, not roots. For the cosine two points fold into one series, for the sine they do not, and a line that misses the circle gives none. |
| `audio.mount` | Четыре уравнения и четыре числа. Соедини их. | To'rt tenglama va to'rt son. Ularni birlashtiring. | Four equations and four numbers. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `sin x cos x = 0` · `2 sin x cos x = cos x` · `sin x = −1` · `sin x = 2` |
| `match.a` | `2` |
| `match.b` | `3` |
| `match.c` | `1` |
| `match.d` | `0` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `koren-poteryan-pri-delenii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Реши по шагам | Qadam bilan yeching | Solve it step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | всё в одну часть | hammasi bir qismga | everything to one side |
| `order.s2` | выносим множитель | ko'paytuvchini chiqaramiz | we factor it out |
| `order.s3` | два простейших | ikkita sodda | two simplest equations |
| `order.s4` | обе серии в ответ | ikkala seriya javobga | both series into the answer |
| `order.ok` | Порядок такой всегда. Деления в нём нет ни на одном шаге, поэтому и терять нечего. | Tartib doim shunday. Unda bo'lish bir qadamda ham yo'q, shuning uchun yo'qotadigan narsa yo'q. | The order is always this. There is no division at any step, so there is nothing to lose. |
| `order.bad` | Сначала всё в одну часть, потом множитель, потом два уравнения, потом ответ. | Avval hammasi bir qismga, keyin ko'paytuvchi, keyin ikki tenglama, keyin javob. | First everything to one side, then the factor, then two equations, then the answer. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `90°` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Три. Косинус даёт одну серию с шагом сто восемьдесят, а синус две. | Uchta. Kosinus yuz sakson qadamli bitta seriya beradi, sinus esa ikkita. | Three. The cosine gives one series with a step of one hundred eighty, and the sine two. |
| `task.hint.1` | Посчитай серии у каждого множителя отдельно. | Har ko'paytuvchining seriyalarini alohida sanang. | Count the series of each factor separately. |
| `task.hint.2` | У косинуса точки противоположны, и серия у них общая. | Kosinusda nuqtalar qarama-qarshi, seriyasi umumiy. | For the cosine the points are opposite and share one series. |
| `task.hint.3` | Три. | Uchta. | Three. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какой корень меньше? | Qaysi ildiz kichikroq? | Which root is smaller? |
| `order.ok` | Ты сравнил углы, а не множители, из которых они получились. | Siz ular chiqqan ko'paytuvchilarni emas, burchaklarni solishtirdingiz. | You compared angles, not the factors they came from. |
| `order.bad` | Переведи каждую запись в число, потом сравнивай. | Har yozuvni songa o'tkazing, keyin solishtiring. | Turn each reading into a number, then compare. |
| `audio.mount` | На этом экране окружности нет. На экзамене чертежа тоже не будет. | Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi. | There is no circle on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `cos x·(2 sin x − 1) = 0   →   ?` |
| `task.answer` | `3` |
| `order.items` | `30°` · `90°` · `150°` · `270°` |
| `order.answer` | `30°  90°  150°  270°` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неполный. Где? | Javob to'liq emas. Qayerda? | The answer is incomplete. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r3` | Это верное следствие предыдущей строки. | Bu oldingi qatorning to'g'ri natijasi. | This is a correct consequence of the previous line. |
| `hint.r4` | Эти серии посчитаны верно, но их не все. | Bu seriyalar to'g'ri hisoblangan, lekin hammasi emas. | These series are computed correctly, but they are not all of them. |
| `proof` | Здесь поделили на косинус, и его корни исчезли. | Bu yerda kosinusga bo'lindi, va uning ildizlari yo'qoldi. | Here they divided by the cosine, and its roots vanished. |
| `entry.prompt` | Сколько серий в полном ответе? | To'liq javobda nechta seriya bor? | How many series are in the full answer? |
| `entry.ok` | Три. Две от синуса и одна от косинуса, с шагом сто восемьдесят. | Uchta. Ikkitasi sinusdan, bittasi kosinusdan, yuz sakson qadam bilan. | Three. Two from the sine and one from the cosine, with a step of one hundred eighty. |
| `entry.hint.1` | Посчитай серии у каждого множителя. | Har ko'paytuvchining seriyalarini sanang. | Count the series of each factor. |
| `entry.hint.2` | У косинуса точки противоположны, серия у них одна. | Kosinusda nuqtalar qarama-qarshi, seriyasi bitta. | For the cosine the points are opposite, they share one series. |
| `entry.hint.3` | Три. | Uchta. | Three. |
| `audio.mount` | Задача. Решить уравнение с косинусом в обеих частях. | Masala. Ikkala qismda kosinus bo'lgan tenglamani yechish. | A task. Solve an equation with the cosine in both sides. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `2 sin x·cos x = cos x` |
| `row.r2` | `2 sin x = 1` |
| `row.r3` | `sin x = 1/2` |
| `row.r4` | `30° + 360°n,  150° + 360°n` |
| `answerId` | `r2` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Какие корни потеряны | Qaysi ildizlar yo'qolgan | Which roots are lost |
| `place.prompt` | Поставь точку на 90 градусов. | Nuqtani 90 gradusga qo'ying. | Place the point at 90 degrees. |
| `place.ok` | Это один из потерянных корней: там косинус равен нулю. | Bu yo'qolgan ildizlardan biri: u yerda kosinus nolga teng. | This is one of the lost roots: the cosine is zero there. |
| `place.wrong` | Девяносто это самый верх окружности. | To'qson bu aylananing eng tepasi. | Ninety is the very top of the circle. |
| `multi.prompt` | Отметь все углы, которые теряются при делении на косинус. | Kosinusga bo'lishda yo'qoladigan hamma burchakni belgilang. | Mark every angle lost when dividing by the cosine. |
| `multi.title` | Какие углы теряются при делении на косинус? | Kosinusga bo'lishda qaysi burchaklar yo'qoladi? | Which angles are lost when dividing by the cosine? |
| `multi.d.hint` | У тридцати косинус не равен нулю, этот корень остаётся. | O'ttizda kosinus nolga teng emas, bu ildiz qoladi. | At thirty the cosine is not zero, this root stays. |
| `multi.e.hint` | У ста пятидесяти косинус тоже не ноль. | Yuz elliknikida ham kosinus nol emas. | At one hundred fifty the cosine is not zero either. |
| `multi.ok` | Три из пяти. Теряются ровно те углы, где косинус равен нулю. | Beshtadan uchtasi. Aynan kosinus nolga teng burchaklar yo'qoladi. | Three out of five. Exactly the angles where the cosine is zero get lost. |
| `audio.mount` | Теперь обратная задача. Надо назвать, какие именно корни теряются. | Endi teskari masala. Qaysi ildizlar yo'qolishini aytish kerak. | Now the inverse task. You must name exactly which roots get lost. |
| `audio.work` | Поставь точку, потом отметишь все потерянные углы. | Nuqtani qo'ying, keyin hamma yo'qolgan burchakni belgilaysiz. | Place the point, then you will mark every lost angle. |

**Формулы**

| Ключ | Значение |
|---|---|
| `place.target` | `90°` |
| `place.step` | `cos x = 0` |
| `multi.a` [верно] | `90°` |
| `multi.b` [верно] | `270°` |
| `multi.c` [верно] | `450°` |
| `multi.d` | `30°` |
| `multi.e` | `150°` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `koren-poteryan-pri-delenii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Что делают с общим множителем? | Umumiy ko'paytuvchini nima qiladilar? | What is done with a common factor? |
| `q1.a` [верно] | выносят | chiqaradilar | it is factored out |
| `q1.b` | сокращают | qisqartiradilar | it is cancelled |
| `q1.b.hint` | Сокращение это то же деление, и корни теряются. | Qisqartirish bu o'sha bo'lish, va ildizlar yo'qoladi. | Cancelling is the same division, and roots get lost. |
| `q1.c` | возводят в квадрат | kvadratga ko'taradilar | it is squared |
| `q1.c.hint` | Возведение добавит посторонние корни, а не поможет. | Kvadratga ko'tarish begona ildizlar qo'shadi, yordam bermaydi. | Squaring adds extraneous roots instead of helping. |
| `q1.d` | ничего | hech narsa | nothing |
| `q1.d.hint` | Тогда уравнение не приведётся к простейшему. | Unda tenglama soddaga keltirilmaydi. | Then the equation will not reduce to the simplest one. |
| `q2.prompt` | Что теряется при делении на косинус? | Kosinusga bo'lishda nima yo'qoladi? | What is lost when dividing by the cosine? |
| `q2.a` [верно] | корни, где косинус равен нулю | kosinus nolga teng ildizlar | the roots where the cosine is zero |
| `q2.b` | корни, где синус равен нулю | sinus nolga teng ildizlar | the roots where the sine is zero |
| `q2.b.hint` | Теряется то, на что делили, а делили на косинус. | Nimaga bo'lingan bo'lsa, u yo'qoladi, bo'lingani esa kosinus. | What is lost is what was divided by, and that was the cosine. |
| `q2.c` | ничего | hech narsa | nothing |
| `q2.c.hint` | На экране два корня погасли, значит теряется. | Ekranda ikki ildiz so'ndi, demak yo'qoladi. | Two roots faded on the screen, so something is lost. |
| `q2.d` | все корни | hamma ildiz | all the roots |
| `q2.d.hint` | Часть остаётся: те, где косинус не ноль. | Bir qismi qoladi: kosinus nol bo'lmaganlari. | Some remain: those where the cosine is not zero. |
| `q3.prompt` | Что делают после замены? | Almashtirishdan keyin nima qiladilar? | What is done after a substitution? |
| `q3.a` [верно] | проверяют границы | chegaralarni tekshiradilar | the bounds are checked |
| `q3.a.ok` | Да. Значение больше единицы синус не даёт. | Ha. Birdan katta qiymatni sinus bermaydi. | Yes. The sine never gives a value above one. |
| `q3.b` | сразу пишут ответ | darrov javob yozadilar | the answer is written at once |
| `q3.b.hint` | Тогда в ответ попадёт невозможное значение. | Unda javobga imkonsiz qiymat tushadi. | Then an impossible value gets into the answer. |
| `q4.prompt` | Сколько серий даёт одно значение синуса? | Sinusning bitta qiymati nechta seriya beradi? | How many series does one value of the sine give? |
| `q4.a` [верно] | две | ikkita | two |
| `q4.b` | одна | bitta | one |
| `q4.b.hint` | Одна бывает только у края, при единице и минус единице. | Bitta faqat chetda, bir va minus birda bo'ladi. | One happens only at the edge, at one and minus one. |
| `q4.c` | четыре | to'rtta | four |
| `q4.c.hint` | Точек пересечения две, значит и серий две. | Kesishish nuqtasi ikkita, demak seriya ham ikkita. | There are two intersection points, so two series. |
| `q4.d` | ни одной | hech qaysi | none |
| `q4.d.hint` | Если значение помещается в границы, серии есть. | Qiymat chegaraga sig'sa, seriyalar bor. | If the value fits the bounds, there are series. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a·b = 0` |
| `q2.done` | `cos x = 0` |
| `q3.done` | `−1 ≤ t ≤ 1` |
| `q4.done` | `2` |
| `angles` | `90°` · `270°` · `30°` · `150°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Выношу множитель вместо деления | Bo'lish o'rniga ko'paytuvchini chiqaraman | I factor out instead of dividing |
| `can.2` | Знаю, какие корни теряет деление | Bo'lish qaysi ildizlarni yo'qotishini bilaman | I know which roots division loses |
| `can.3` | Проверяю границы после замены | Almashtirishdan keyin chegaralarni tekshiraman | I check the bounds after a substitution |
| `can.4` | Возвращаюсь к переменной в конце | Oxirida o'zgaruvchiga qaytaman | I return to the variable at the end |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: что теряется при делении. | Bitta joy takrorlashni talab qiladi: bo'lishda nima yo'qoladi. | One place needs review: what division loses. |
| `levels.back` | Вернись к правилу и к экрану 4. | Qoidaga va 4-ekranga qayting. | Go back to the rule and to screen 4. |
| `bridge` | Блок 2 закрыт: все тригонометрические уравнения курса решаются этими четырьмя приёмами. | Ikkinchi blok yopildi: kursdagi hamma trigonometrik tenglama shu to'rt usul bilan yechiladi. | Block two is closed: every trigonometric equation of the course is solved with these four moves. |
| `lifehack` | Увидел общий множитель — выноси. Деление всегда что-нибудь съедает. | Umumiy ko'paytuvchini ko'rdingizmi, chiqaring. Bo'lish doim biror narsani yeb qo'yadi. | Spotted a common factor, factor it out. Division always eats something. |
| `sheetTitle` | Методы · шпаргалка | Usullar · shpargalka | The methods · cheat sheet |
| `sheetSrc` | 10 класс · урок 13 | 10-sinf · 13-dars | Grade 10 · lesson 13 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Делить на выражение с неизвестным нельзя: корни, где оно равно нулю, исчезают из ответа. | Noma'lumli ifodaga bo'lish mumkin emas: u nolga teng bo'lgan ildizlar javobdan yo'qoladi. | Dividing by an expression with the unknown is not allowed: the roots where it is zero vanish from the answer. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `2 sin x = 1` |
| `hook.b` | `a·b = 0` |
| `proved` | `a·b = 0` |
| `law` | `a·b = 0   →   a = 0,  b = 0` |
| `sheet.1` | `a·b = 0` |
| `sheet.2` | `cos x = 0   →   90° + 180°n` |
| `sheet.3` | `sin x = 1/2   →   30°,  150°` |
| `sheet.4` | `−1 ≤ t ≤ 1` |
| `sheet.5` | `t   →   x` |
