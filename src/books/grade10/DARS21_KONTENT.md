# Урок 32 — Иррациональные уравнения · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS32_36_SKELET.md` §7. Опора в учебнике: алгебра 2022, стр. 81–87, параграф
`IRRATSIONAL TENGLAMALAR`.

**Главное решение урока.** Посторонний корень не «не подошёл при проверке» и не «мы
поторопились». Учебник говорит прямо: рациональное уравнение — **следствие** исходного
(`oʻzining natijasi boʻlgan`), а не то же самое. Возведение в квадрат склеивает плюс и минус, и
поэтому лишнее число появляется у любого, кто решает правильно. Отсюда порядок урока: сначала
условие правой части выписывается **до** возведения (экран 3), потом на маленьком примере
показывается, что возведение делает верным неверное (экран 4), и только затем оба числа падают
на полосу (экран 5).

**Прибор 5 работает здесь в той же роли, что в уроке 31** — проверяет найденное. Роль полосы
меняется на следующем уроке, не на этом.

**Терминология UZ — draft, требует валидации узбекским методистом математики.** «Посторонний
корень» в тексте учебника отдельным термином не назван; в уроке он передаётся описательно
(`tenglamani qanoatlantirmaydigan son`).

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | УРАВНЕНИЕ | TENGLAMA | THE EQUATION |
| `title` | Оба числа или только одно | Ikkala son yoki faqat bittasi | Both numbers or only one |
| `row.a.name` | оба числа подходят | ikkala son ham yaraydi | both numbers fit |
| `row.b.name` | подходит только одно | faqat bittasi yaraydi | only one of them fits |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим оба числа подстановкой. | Javobingiz yozib olindi. Endi ikkala sonni qo'yib tekshiramiz. | Your answer is saved. Now we will substitute both numbers and check. |
| `audio.mount` | Слева корень, справа икс. Решение приводит к квадратному уравнению, и оно даёт два числа, три и минус два. | Chapda ildiz, o'ngda iks. Yechim kvadrat tenglamaga olib keladi, u esa ikki son beradi, uch va minus ikki. | On the left a square root, on the right x. Solving leads to a quadratic equation, and it gives two numbers, three and minus two. |
| `audio.r1` | Первая запись говорит, что корня два: оба числа получены верными действиями. | Birinchi yozuv ildiz ikkita deydi: ikkala son ham to'g'ri amallar bilan olingan. | The first reading says there are two roots: both numbers came from correct steps. |
| `audio.r2` | Вторая говорит, что корень один, а второе число в ответ не годится. | Ikkinchisi ildiz bitta, ikkinchi son esa javobga yaramaydi deydi. | The second says there is one root, and the second number does not belong in the answer. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `√(x + 6) = x` |
| `row.a.value` | `3;  −2` |
| `row.b.value` | `3` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед уравнением | Tenglamadan oldin uch savol | Three questions before the equation |
| `q1.prompt` | Чему равен квадрат квадратного корня из неотрицательного числа? | Manfiy bo'lmagan sonning kvadrat ildizi kvadrati nechaga teng? | What does the square of a square root of a non-negative number equal? |
| `q1.a` [верно] | самому числу | sonning o'ziga | the number itself |
| `q1.b` | удвоенному числу | ikkilangan songa | twice the number |
| `q1.b.hint` | Удвоение вышло бы при сложении корня с самим собой, а не при возведении. | Ikkilanish ildizni o'ziga qo'shganda chiqardi, kvadratga ko'targanda emas. | Doubling would come from adding the root to itself, not from squaring. |
| `q1.c` | квадрату числа | son kvadratiga | the square of the number |
| `q1.c.hint` | Корень и квадрат гасят друг друга, а не складываются. | Ildiz va kvadrat bir-birini so'ndiradi, qo'shilmaydi. | The root and the square cancel each other, they do not stack. |
| `q1.d` | половине числа | sonning yarmiga | half the number |
| `q1.d.hint` | Проверь на девятке: корень три, его квадрат снова девять. | To'qqizda tekshiring: ildiz uch, uning kvadrati yana to'qqiz. | Check on nine: the root is three, and its square is nine again. |
| `q2.prompt` | Каким может быть значение квадратного корня? | Kvadrat ildiz qiymati qanday bo'lishi mumkin? | What can the value of a square root be? |
| `q2.a` [верно] | неотрицательным | manfiy bo'lmagan | non-negative |
| `q2.b` | любым | har qanday | any |
| `q2.b.hint` | Отрицательного значения у корня не бывает никогда. | Ildizning manfiy qiymati hech qachon bo'lmaydi. | A root never takes a negative value. |
| `q2.c` | только положительным | faqat musbat | only positive |
| `q2.c.hint` | Ноль тоже годится: корень из нуля равен нулю. | Nol ham yaraydi: noldan ildiz nolga teng. | Zero works too: the root of zero is zero. |
| `q2.d` | только целым | faqat butun | only a whole number |
| `q2.d.hint` | Корень из двух не целый, но он существует. | Ikkidan ildiz butun emas, lekin u mavjud. | The root of two is not whole, yet it exists. |
| `q3.prompt` | Что значит проверить найденное число? | Topilgan sonni tekshirish nima degani? | What does it mean to check a number you found? |
| `q3.a` [верно] | подставить его в исходное уравнение | uni dastlabki tenglamaga qo'yish | substitute it into the original equation |
| `q3.b` | подставить в уравнение после возведения | kvadratga ko'targandan keyingi tenglamaga qo'yish | substitute it into the equation after squaring |
| `q3.b.hint` | Там подойдут оба числа, поэтому такая проверка ничего не различает. | U yerda ikkala son ham yaraydi, shuning uchun bunday tekshirish hech nimani ajratmaydi. | Both numbers fit there, so that check tells them apart in no way. |
| `q3.c` | повторить те же действия ещё раз | o'sha amallarni yana bir marta takrorlash | repeat the same steps once more |
| `q3.c.hint` | Те же действия дадут тот же результат, включая лишнее число. | O'sha amallar o'sha natijani beradi, ortiqcha son bilan birga. | The same steps give the same result, extra number included. |
| `q3.d` | посмотреть, целое ли оно | butunligini ko'rish | look at whether it is whole |
| `q3.d.hint` | Целым бывает и лишнее число, и настоящий корень. | Butun son ortiqcha ham, haqiqiy ildiz ham bo'lishi mumkin. | A whole number can be the extra one and can be a true root. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `(√a)² = a,  a ≥ 0` |
| `q2.done` | `√a ≥ 0` |
| `q3.done` | `√(x + 6) = x` |

---

## Экран 3 · `explain1` · ответ `number` · тег `postoronniy-koren`

Полоса чертится до возведения в квадрат.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Условие пишут до возведения | Shart kvadratga ko'tarishdan oldin yoziladi | The condition is written before squaring |
| `show.1.1` | под корнем неотрицательное: икс плюс шесть | ildiz ostida manfiy bo'lmagan: iks qo'shuv olti | under the root a non-negative value: x plus six |
| `show.1.2` | слева корень, значит справа тоже не меньше нуля | chapda ildiz, demak o'ngda ham noldan kichik emas | on the left a root, so the right side is not less than zero either |
| `show.1.3` | оба условия должны выполняться сразу | ikkala shart bir vaqtda bajarilishi kerak | both conditions must hold at once |
| `show.2.1` | закрашено там, где верно и то и другое | ikkalasi ham to'g'ri bo'lgan joy bo'yalgan | the shading is where both hold |
| `show.2.2` | полоса начинается с нуля | polosa noldan boshlanadi | the band starts at zero |
| `show.2.3` | отрицательным числам места нет | manfiy sonlarga joy yo'q | negative numbers have no place |
| `audio.mount` | Под уравнением появилась полоса. Она показывает, какие икс вообще могут оказаться корнем. | Tenglama tagida polosa paydo bo'ldi. U qaysi iks umuman ildiz bo'la olishini ko'rsatadi. | A band appeared under the equation. It shows which x can be a root at all. |
| `audio.band*` | Условий два, и оба видны прямо в записи. Под корнем стоит икс плюс шесть, значит это выражение не меньше нуля, отсюда икс не меньше минус шести. Но слева стоит корень, а корень отрицательным не бывает. Значит и справа, то есть сам икс, не меньше нуля. Второе условие строже первого, поэтому закрашивается только то, что правее нуля. Полоса начерчена до возведения в квадрат, и это главное: после возведения условие исчезнет из записи, а из задачи никуда не денется. | Shart ikkita, va ikkalasi ham yozuvda ko'rinib turibdi. Ildiz ostida iks qo'shuv olti turadi, demak bu ifoda noldan kichik emas, bundan iks minus oltidan kichik emas. Lekin chapda ildiz turadi, ildiz esa manfiy bo'lmaydi. Demak o'ngda ham, ya'ni iksning o'zi ham noldan kichik emas. Ikkinchi shart birinchisidan qattiqroq, shuning uchun faqat noldan o'ngdagi bo'yaladi. Polosa kvadratga ko'tarishdan oldin chizilgan, va asosiysi shu: ko'targandan keyin shart yozuvdan yo'qoladi, masaladan esa hech qayerga ketmaydi. | There are two conditions, and both are visible right in the equation. Under the root stands x plus six, so that expression is not less than zero, which gives x not less than minus six. But on the left stands a root, and a root is never negative. So the right side, that is x itself, is not less than zero either. The second condition is stricter than the first, so only what lies to the right of zero gets shaded. The band was drawn before squaring, and that is the point: after squaring the condition disappears from the writing, but it does not disappear from the problem. |
| `audio.work` | Посчитай сам. С какого числа начинается закрашенная полоса? | O'zingiz hisoblang. Bo'yalgan polosa qaysi sondan boshlanadi? | Work it out yourself. From which number does the shaded band start? |
| `work.prompt` | С какого числа начинается полоса? | Polosa qaysi sondan boshlanadi? | From which number does the band start? |
| `work.ok` | С нуля. Условие икс не меньше нуля строже, чем икс не меньше минус шести, поэтому побеждает оно. | Noldan. Iks noldan kichik emas sharti iks minus oltidan kichik emas shartidan qattiqroq, shuning uchun u yutadi. | From zero. The condition x not less than zero is stricter than x not less than minus six, so it wins. |
| `work.hint.1` | Выпиши условие для подкоренного выражения и отдельно для правой части. | Ildiz ostidagi ifoda uchun va alohida o'ng taraf uchun shartni yozing. | Write the condition for the expression under the root and separately for the right side. |
| `work.hint.2` | Оба условия должны выполняться сразу, значит берут более строгое. | Ikkala shart bir vaqtda bajarilishi kerak, demak qattiqrog'i olinadi. | Both must hold at once, so the stricter one is taken. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 4 · `explain2` · ответ `order` · тег `postoronniy-koren`

Разграничение: возведение в квадрат делает верным неверное.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Возведение склеивает плюс и минус | Kvadratga ko'tarish plyus va minusni yopishtiradi | Squaring glues plus and minus together |
| `show.1.1` | берём заведомо неверное равенство | ataylab noto'g'ri tenglikni olamiz | take an equality that is knowingly false |
| `show.1.2` | минус два не равно двум | minus ikki ikkiga teng emas | minus two does not equal two |
| `show.1.3` | возводим обе части в квадрат | ikkala tarafni kvadratga ko'taramiz | square both sides |
| `show.2.1` | слева четыре, справа четыре | chapda to'rt, o'ngda to'rt | four on the left, four on the right |
| `show.2.2` | равенство стало верным | tenglik to'g'ri bo'lib qoldi | the equality became true |
| `show.2.3` | обратно так вернуться нельзя | teskarisiga bunday qaytib bo'lmaydi | there is no way back |
| `audio.mount` | Отвлечёмся от уравнения на два числа. Возьмём минус два и два. | Tenglamadan chetlanib, ikki songa qaraymiz. Minus ikki va ikkini olamiz. | Let us step away from the equation and look at two numbers. Take minus two and two. |
| `audio.two*` | Минус два и два это разные числа, равенство между ними неверно. Возведём обе части в квадрат. Слева четыре, справа четыре, равенство стало верным. Вот что делает возведение: из неверного оно способно сделать верное. Значит и наоборот, у уравнения после возведения корней может оказаться больше, чем было. Лишние приходят оттуда же, откуда пришла эта четвёрка. Поэтому квадратное уравнение, которое мы получим, называют следствием исходного, а не тем же самым уравнением. | Minus ikki va ikki har xil sonlar, ular orasidagi tenglik noto'g'ri. Ikkala tarafni kvadratga ko'taramiz. Chapda to'rt, o'ngda to'rt, tenglik to'g'ri bo'lib qoldi. Kvadratga ko'tarish shuni qiladi: noto'g'ridan to'g'ri yasay oladi. Demak aksincha ham, ko'targandan keyin tenglamaning ildizlari avvalgidan ko'p bo'lib chiqishi mumkin. Ortiqchalari o'sha to'rt kelgan joydan keladi. Shuning uchun biz oladigan kvadrat tenglamani dastlabkisining natijasi deyishadi, o'sha tenglamaning o'zi emas. | Minus two and two are different numbers, and the equality between them is false. Square both sides. Four on the left, four on the right, and the equality became true. That is what squaring does: it can turn a false statement into a true one. So the other way round, an equation after squaring can end up with more roots than it had. The extra ones come from exactly where that four came from. This is why the quadratic equation we are about to get is called a consequence of the original, not the same equation. |
| `audio.work` | Расставь шаги в том порядке, в котором это произошло. | Bu sodir bo'lgan tartibda qadamlarni joylashtiring. | Put the steps in the order in which this happened. |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | равенство неверно | tenglik noto'g'ri | the equality is false |
| `order.s2` | возводим в квадрат | kvadratga ko'taramiz | square both sides |
| `order.s3` | равенство стало верным | tenglik to'g'ri bo'ldi | the equality became true |
| `order.s4` | решений стало больше | yechim ko'paydi | more solutions than before |
| `order.ok` | Верно. Возведение не отменяет разницу между плюсом и минусом, оно её прячет. | To'g'ri. Ko'tarish plyus va minus orasidagi farqni yo'qotmaydi, uni yashiradi. | Correct. Squaring does not remove the difference between plus and minus, it hides it. |
| `order.bad` | Начни с того, что было до возведения, а не после. | Ko'tarishdan oldin nima bo'lganidan boshlang, keyinidan emas. | Start with what was there before squaring, not after. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `−2 ≠ 2` |
| `frameB` | `(−2)² = 2²   →   4 = 4` |
| `order.mark` | `(−2)² = 2²` |

---

## Экран 5 · `explain3` · ответ `number` · тег `postoronniy-koren`

Оба числа падают на полосу, одно гаснет.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Куда падают три и минус два | Uch va minus ikki qayerga tushadi | Where three and minus two land |
| `show.1.1` | квадратное уравнение дало два числа | kvadrat tenglama ikki son berdi | the quadratic equation gave two numbers |
| `show.1.2` | тройка падает внутрь полосы | uchlik polosa ichiga tushadi | the three lands inside the band |
| `show.1.3` | минус два падает левее нуля | minus ikki noldan chapga tushadi | minus two lands to the left of zero |
| `show.2.1` | тройка остаётся | uchlik qoladi | the three stays |
| `show.2.2` | минус два гаснет | minus ikki so'nadi | minus two fades out |
| `show.2.3` | в ответе одно число | javobda bitta son | one number in the answer |
| `audio.mount` | Возвращаемся к уравнению. Квадратное дало три и минус два. Полоса на месте, посмотрим, куда они упадут. | Tenglamaga qaytamiz. Kvadrat tenglama uch va minus ikki berdi. Polosa joyida, ular qayerga tushishini ko'ramiz. | Back to the equation. The quadratic gave three and minus two. The band is in place, let us see where they land. |
| `audio.fall*` | Тройка падает внутрь закрашенной полосы. Подставим её в исходное уравнение: под корнем девять, корень из девяти три, справа тоже три. Равенство верное, тройка корень. Минус два падает левее нуля, снаружи полосы, и гаснет. Подставим и его: под корнем четыре, корень из четырёх два, а справа минус два. Два и минус два разные числа, равенство неверно. Обрати внимание, минус два не испортилось по дороге. Оно никогда не было допустимым: справа стоит икс, а корень отрицательным не бывает. | Uchlik bo'yalgan polosa ichiga tushadi. Uni dastlabki tenglamaga qo'yamiz: ildiz ostida to'qqiz, to'qqizdan ildiz uch, o'ngda ham uch. Tenglik to'g'ri, uchlik ildiz. Minus ikki noldan chapga, polosadan tashqariga tushadi va so'nadi. Uni ham qo'yamiz: ildiz ostida to'rt, to'rtdan ildiz ikki, o'ngda esa minus ikki. Ikki va minus ikki har xil sonlar, tenglik noto'g'ri. E'tibor bering, minus ikki yo'lda buzilgani yo'q. U hech qachon yaroqli bo'lmagan: o'ngda iks turadi, ildiz esa manfiy bo'lmaydi. | The three lands inside the shaded band. Substitute it into the original equation: nine under the root, the root of nine is three, and the right side is three too. The equality holds, so three is a root. Minus two lands to the left of zero, outside the band, and fades. Substitute it as well: four under the root, the root of four is two, and the right side is minus two. Two and minus two are different numbers, so the equality fails. Notice that minus two did not go bad along the way. It was never admissible: the right side is x, and a root is never negative. |
| `audio.work` | Посчитай сам. Сколько чисел остаётся в ответе? | O'zingiz hisoblang. Javobda nechta son qoladi? | Work it out yourself. How many numbers stay in the answer? |
| `work.prompt` | Сколько корней в ответе? | Javobda nechta ildiz? | How many roots are in the answer? |
| `work.ok` | Один. Тройка прошла проверку, минус два не прошло. | Bitta. Uchlik tekshiruvdan o'tdi, minus ikki o'tmadi. | One. The three passed the check, minus two did not. |
| `work.hint.1` | Посмотри, какое из двух чисел лежит внутри полосы. | Ikki sondan qaysi biri polosa ichida yotganiga qarang. | Look at which of the two numbers lies inside the band. |
| `work.hint.2` | Подставь минус два в исходное: слева выйдет два, справа минус два. | Minus ikkini dastlabkisiga qo'ying: chapda ikki, o'ngda minus ikki chiqadi. | Substitute minus two into the original: two on the left, minus two on the right. |
| `work.hint.3` | Один. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `koren-summy`

Сам: корень из суммы квадратов.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Корень из суммы не распадается | Yig'indidan ildiz bo'linmaydi | A root of a sum does not split |
| `show.1.1` | под корнем сумма квадратов | ildiz ostida kvadratlar yig'indisi | a sum of squares under the root |
| `show.1.2` | берём тройку и четвёрку | uch va to'rtni olamiz | take three and four |
| `show.1.3` | девять плюс шестнадцать | to'qqiz qo'shuv o'n olti | nine plus sixteen |
| `show.2.1` | под корнем двадцать пять | ildiz ostida yigirma besh | twenty five under the root |
| `show.2.2` | корень из двадцати пяти пять | yigirma beshdan ildiz besh | the root of twenty five is five |
| `show.2.3` | а сумма самих чисел семь | sonlarning o'zi yig'indisi esa yetti | while the sum of the numbers is seven |
| `audio.mount` | Ещё одно место, где корень ведут себя не так, как хочется. Под корнем сумма. | Ildiz istagandek emas, boshqacha ish tutadigan yana bir joy. Ildiz ostida yig'indi. | One more place where the root behaves not the way one would like. Under the root there is a sum. |
| `audio.sum*` | Возьмём тройку и четвёрку и посчитаем оба выражения рядом. Слева под корнем девять плюс шестнадцать, это двадцать пять, корень из двадцати пяти равен пяти. Справа три плюс четыре, это семь. Пять и семь разные числа, значит корень из суммы квадратов не равен сумме. Одного примера здесь хватает: чтобы отменить правило, достаточно одного случая, когда оно не работает. | Uch va to'rtni olamiz va ikkala ifodani yonma-yon hisoblaymiz. Chapda ildiz ostida to'qqiz qo'shuv o'n olti, bu yigirma besh, yigirma beshdan ildiz beshga teng. O'ngda uch qo'shuv to'rt, bu yetti. Besh va yetti har xil sonlar, demak kvadratlar yig'indisidan ildiz yig'indiga teng emas. Bu yerda bitta misol yetadi: qoidani bekor qilish uchun u ishlamaydigan bitta holat kifoya. | Take three and four and compute both expressions side by side. On the left, under the root, nine plus sixteen, that is twenty five, and the root of twenty five is five. On the right, three plus four, that is seven. Five and seven are different numbers, so the root of a sum of squares is not the sum. One example is enough here: to cancel a rule, a single case where it fails will do. |
| `audio.work` | Посчитай сам. Чему равен корень из суммы квадратов трёх и четырёх? | O'zingiz hisoblang. Uch va to'rt kvadratlari yig'indisidan ildiz nechaga teng? | Work it out yourself. What is the root of the sum of the squares of three and four? |
| `work.prompt` | Чему равно это выражение? | Bu ifoda nechaga teng? | What does this expression equal? |
| `work.ok` | Пять. Под корнем двадцать пять, а не семь: сначала складывают, потом извлекают. | Besh. Ildiz ostida yigirma besh, yetti emas: avval qo'shiladi, keyin ildiz chiqariladi. | Five. Under the root there is twenty five, not seven: first you add, then you take the root. |
| `work.hint.1` | Посчитай сначала то, что стоит под корнем. | Avval ildiz ostidagini hisoblang. | First compute what stands under the root. |
| `work.hint.2` | Девять плюс шестнадцать равно двадцати пяти. | To'qqiz qo'shuv o'n olti yigirma beshga teng. | Nine plus sixteen equals twenty five. |
| `work.hint.3` | Пять. | Besh. | Five. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `√(3² + 4²)` |
| `frameB` | `√25 = 5;   3 + 4 = 7` |
| `work.expr` | `√(3² + 4²)` |
| `work.answer` | `5` |

---

## Экран 7 · `explain5` · ответ `number` · тег `postoronniy-koren`

Граничный: правая часть отрицательна.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Ответ виден до всякого решения | Javob har qanday yechimdan oldin ko'rinadi | The answer is visible before any solving |
| `show.1.1` | слева корень, справа минус два | chapda ildiz, o'ngda minus ikki | on the left a root, on the right minus two |
| `show.1.2` | корень не бывает отрицательным | ildiz manfiy bo'lmaydi | a root is never negative |
| `show.1.3` | полоса не закрасится нигде | polosa hech qayerda bo'yalmaydi | the band shades nowhere |
| `show.2.1` | если всё же возвести | baribir ko'tarilsa | if one squares anyway |
| `show.2.2` | получится число пять | besh soni chiqadi | the number five comes out |
| `show.2.3` | и оно не подойдёт | va u yaramaydi | and it does not fit |
| `audio.mount` | Уравнение, которое решать не надо. Достаточно посмотреть на правую часть. | Yechish shart bo'lmagan tenglama. O'ng tarafga qarash yetarli. | An equation there is no need to solve. Looking at the right side is enough. |
| `audio.stop*` | Слева стоит корень, а он никогда не бывает отрицательным. Справа минус два. Значит равенство невозможно ни при каком икс, и полоса не закрашивается нигде. Решений нет, и это уже ответ. Но посмотри, что будет, если правило забыть и всё же возвести обе части. Слева икс минус один, справа четыре, отсюда икс равен пяти. Число получено, выглядит убедительно. Подставим: под корнем четыре, корень из четырёх два, а справа минус два. Не сходится. Пятёрка целиком порождена возведением. | Chapda ildiz turadi, u esa hech qachon manfiy bo'lmaydi. O'ngda minus ikki. Demak tenglik hech qanday iksda ham bo'lmaydi, polosa esa hech qayerda bo'yalmaydi. Yechim yo'q, va bu allaqachon javob. Lekin qoida unutilsa va ikkala taraf baribir ko'tarilsa nima bo'lishiga qarang. Chapda iks minus bir, o'ngda to'rt, bundan iks beshga teng. Son olindi, ishonarli ko'rinadi. Qo'yib ko'ramiz: ildiz ostida to'rt, to'rtdan ildiz ikki, o'ngda esa minus ikki. To'g'ri kelmadi. Beshlik butunlay ko'tarishdan tug'ilgan. | On the left stands a root, and it is never negative. On the right stands minus two. So the equality is impossible for any x, and the band shades nowhere. There are no solutions, and that is already the answer. But look what happens if the rule is forgotten and both sides are squared anyway. On the left x minus one, on the right four, which gives x equal to five. A number has been obtained and it looks convincing. Substitute it: four under the root, the root of four is two, and the right side is minus two. It does not match. The five was born entirely from the squaring. |
| `audio.work` | Посчитай сам. Сколько корней у этого уравнения? | O'zingiz hisoblang. Bu tenglamaning nechta ildizi bor? | Work it out yourself. How many roots does this equation have? |
| `work.prompt` | Сколько корней у уравнения? | Tenglamaning nechta ildizi bor? | How many roots does the equation have? |
| `work.ok` | Ни одного. Слева неотрицательное, справа отрицательное, равенства не будет никогда. | Bitta ham yo'q. Chapda manfiy bo'lmagan, o'ngda manfiy, tenglik hech qachon bo'lmaydi. | None. The left side is non-negative, the right side is negative, so equality never happens. |
| `work.hint.1` | Посмотри на знак правой части, не решая. | Yechmasdan o'ng taraf ishorasiga qarang. | Look at the sign of the right side without solving. |
| `work.hint.2` | Корень не может равняться отрицательному числу. | Ildiz manfiy songa teng bo'la olmaydi. | A root cannot equal a negative number. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `√(x − 1) = −2` |
| `frameB` | `x − 1 = 4   →   x = 5` |
| `work.expr` | `√(x − 1) = −2` |
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `postoronniy-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Проверка — часть решения | Tekshirish yechimning bir qismi | The check is part of the solution |
| `probe.question` | Что делает проверка подстановкой? | Qo'yib tekshirish nima qiladi? | What does substitution checking do? |
| `probe.a` [верно] | отсеивает числа, которые породило возведение | ko'tarish tug'dirgan sonlarni ajratib tashlaydi | it filters out numbers that squaring produced |
| `probe.b` | исправляет ошибку в вычислениях | hisobdagi xatoni to'g'rilaydi | it fixes a mistake in the calculation |
| `probe.b.hint` | Вычисления были верными. Лишнее число появилось из самого действия, а не из ошибки. | Hisoblar to'g'ri edi. Ortiqcha son xatodan emas, amalning o'zidan paydo bo'ldi. | The calculation was correct. The extra number came from the operation itself, not from a mistake. |
| `rule.lawLabel` | ШАГИ РЕШЕНИЯ | YECHISH QADAMLARI | THE STEPS |
| `rule.lines.1` | обе части возводят в степень, чтобы уйти от корня | ildizdan qutulish uchun ikkala taraf darajaga ko'tariladi | both sides are raised to a power to get rid of the root |
| `rule.lines.2` | полученное уравнение это следствие, а не то же самое | olingan tenglama natija, o'sha tenglamaning o'zi emas | the equation obtained is a consequence, not the same equation |
| `rule.lines.3` | каждое найденное число подставляют в исходное | topilgan har bir son dastlabkisiga qo'yiladi | every number found is substituted into the original |
| `audio.mount` | Соберём правило. Оно короткое, и в нём три шага. | Qoidani yig'amiz. U qisqa, ichida uch qadam bor. | Let us put the rule together. It is short and has three steps. |
| `audio.rule*` | Первый шаг: обе части возводят в степень, чтобы уйти от знака корня. Второй: помнить, что получилось не то же уравнение, а его следствие, и корней у следствия может быть больше. Третий: каждое найденное число подставить в исходное уравнение и оставить только те, при которых равенство верное. Проверка здесь не аккуратность, а часть решения. Без неё задача не решена. | Birinchi qadam: ildiz belgisidan qutulish uchun ikkala taraf darajaga ko'tariladi. Ikkinchisi: o'sha tenglamaning o'zi emas, uning natijasi chiqqanini eslash, natijaning ildizlari esa ko'proq bo'lishi mumkin. Uchinchisi: topilgan har bir sonni dastlabki tenglamaga qo'yish va faqat tenglik to'g'ri bo'lganlarini qoldirish. Tekshirish bu yerda ozodalik emas, yechimning bir qismi. Usiz masala yechilmagan. | First step: both sides are raised to a power to get rid of the root sign. Second: remember that what came out is not the same equation but its consequence, and a consequence can have more roots. Third: substitute every number found into the original equation and keep only those for which the equality holds. Checking here is not tidiness, it is part of the solution. Without it the problem is not solved. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `√f(x) = g(x)   →   f(x) = g(x)²,   g(x) ≥ 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `postoronniy-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини уравнение с его корнем | Tenglamani ildizi bilan ulang | Match each equation with its root |
| `match.prompt` | У каждого уравнения ровно один корень | Har bir tenglamaning aynan bitta ildizi bor | Each equation has exactly one root |
| `match.ok` | Верно. Первое уравнение даёт при решении и минус два, но оно не проходит проверку. | To'g'ri. Birinchi tenglama yechilganda minus ikkini ham beradi, lekin u tekshiruvdan o'tmaydi. | Correct. The first equation also yields minus two when solved, but that one fails the check. |
| `audio.mount` | Четыре уравнения и четыре числа. Считай в уме, проверяй подстановкой. | To'rt tenglama va to'rt son. Xayolda hisoblang, qo'yib tekshiring. | Four equations and four numbers. Compute in your head, check by substituting. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `√(x + 6) = x` · `√(x + 3) = 2` · `√(2x − 1) = 3` · `√(x − 4) = 0` |
| `match.a` | `3` |
| `match.b` | `1` |
| `match.c` | `5` |
| `match.d` | `4` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `postoronniy-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Реши уравнение целиком | Tenglamani to'liq yeching | Solve the equation from start to finish |
| `order.prompt` | Расставь шаги решения по порядку | Yechish qadamlarini tartib bilan joylashtiring | Put the solution steps in order |
| `order.s1` | выписать условие | shartni yozish | write the condition |
| `order.s2` | возвести в квадрат | kvadratga ko'tarish | square both sides |
| `order.s3` | решить квадратное | kvadrat tenglamani yechish | solve the quadratic |
| `order.s4` | проверить оба числа | ikkala sonni tekshirish | check both numbers |
| `order.ok` | Верно. Условие первым, проверка последней, и между ними всё остальное. | To'g'ri. Shart birinchi, tekshirish oxirgi, orasida qolgani. | Correct. The condition first, the check last, and everything else in between. |
| `order.bad` | Условие пишут до возведения, иначе оно исчезнет вместе со знаком корня. | Shart ko'tarishdan oldin yoziladi, aks holda u ildiz belgisi bilan birga yo'qoladi. | The condition is written before squaring, otherwise it vanishes along with the root sign. |
| `audio.mount` | Теперь всё уравнение целиком. Четыре шага, порядок важен. | Endi butun tenglama. To'rt qadam, tartib muhim. | Now the whole equation. Four steps, and the order matters. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `√(x + 6) = x` |
| `order.mark` | `x = 3` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Без чертежа | Chizmasiz | Without a drawing |
| `task.ok` | Двадцать семь. Возвели, получили две икс минус пять равно сорока девяти. | Yigirma yetti. Ko'tardik, ikki iks minus besh qirq to'qqizga teng bo'ldi. | Twenty seven. Squaring gives two x minus five equals forty nine. |
| `task.hint.1` | Возведи обе части в квадрат. | Ikkala tarafni kvadratga ko'taring. | Square both sides. |
| `task.hint.2` | Справа получится сорок девять. | O'ngda qirq to'qqiz chiqadi. | On the right you get forty nine. |
| `task.hint.3` | Двадцать семь. | Yigirma yetti. | Twenty seven. |
| `order.prompt` | Расставь уравнения по возрастанию корня | Tenglamalarni ildizi o'sishi bo'yicha joylashtiring | Put the equations in order of increasing root |
| `order.title` | от меньшего корня к большему | kichik ildizdan kattasiga | from the smallest root to the largest |
| `order.ok` | Верно. Правая часть больше не значит корень больше. | To'g'ri. O'ng taraf kattaroq bo'lsa, ildiz kattaroq degani emas. | Correct. A bigger right side does not mean a bigger root. |
| `order.bad` | Считай корень каждого уравнения, а не смотри на число справа. | O'ngdagi songa qaramay, har bir tenglamaning ildizini hisoblang. | Compute the root of each equation instead of looking at the number on the right. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `√(2x − 5) = 7   →   x = ?` |
| `task.answer` | `27` |
| `order.items` | `√(x + 1) = 2` · `√(x − 2) = 3` · `√(2x) = 4` · `√(x + 7) = 1` |
| `order.answer` | `√(x + 7) = 1  √(x + 1) = 2  √(2x) = 4  √(x − 2) = 3` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Исходное уравнение, здесь ошибки быть не может. | Dastlabki tenglama, bu yerda xato bo'lishi mumkin emas. | The original equation, no mistake can live here. |
| `hint.r2` | Возведение выполнено верно. | Ko'tarish to'g'ri bajarilgan. | The squaring was done correctly. |
| `hint.r3` | Квадратное уравнение составлено верно, корни посчитаны верно. | Kvadrat tenglama to'g'ri tuzilgan, ildizlar to'g'ri hisoblangan. | The quadratic is set up correctly and its roots are computed correctly. |
| `proof` | Подставь минус два в первую строку: слева выйдет два, справа минус два. | Minus ikkini birinchi qatorga qo'ying: chapda ikki, o'ngda minus ikki chiqadi. | Substitute minus two into the first line: two on the left, minus two on the right. |
| `entry.prompt` | Какое число попало в ответ зря? | Qaysi son javobga behuda tushgan? | Which number ended up in the answer for nothing? |
| `entry.ok` | Минус два. Все действия верные, а ответ неверный: не хватает последнего шага. | Minus ikki. Barcha amallar to'g'ri, javob esa noto'g'ri: oxirgi qadam yetishmayapti. | Minus two. Every step is correct and the answer is wrong: the last step is missing. |
| `entry.hint.1` | Ошибка не в вычислениях, посмотри на последнюю строку. | Xato hisobda emas, oxirgi qatorga qarang. | The mistake is not in the arithmetic, look at the last line. |
| `entry.hint.2` | Одно из двух чисел не проходит подстановку. | Ikki sondan biri qo'yib tekshirishdan o'tmaydi. | One of the two numbers fails the substitution. |
| `entry.hint.3` | Минус два. | Minus ikki. | Minus two. |
| `audio.mount` | Четыре строки. Все действия верные, а ответ неверный. Найди, где это произошло. | To'rt qator. Barcha amallar to'g'ri, javob esa noto'g'ri. Bu qayerda sodir bo'lganini toping. | Four lines. Every step is correct and the answer is wrong. Find where that happened. |
| `audio.next` | Дальше обратная задача: по ответу восстанови уравнение. | Keyin teskari masala: javobga qarab tenglamani tiklang. | Next comes the reverse task: rebuild the equation from its answer. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `√(x + 6) = x` |
| `row.r2` | `x + 6 = x²` |
| `row.r3` | `x² − x − 6 = 0` |
| `row.r4` | `x = 3;  x = −2` |
| `answerId` | `r4` |
| `entry.answer` | `−2` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Корень уравнения равен двенадцати. Чему равно число под минусом? | Tenglamaning ildizi o'n ikkiga teng. Minus ostidagi son nechaga teng? | The root of the equation is twelve. What is the number after the minus? |
| `entry.ok` | Три. Под корнем должно выйти девять, а двенадцать минус три это девять. | Uch. Ildiz ostida to'qqiz chiqishi kerak, o'n ikki minus uch esa to'qqiz. | Three. Under the root there must be nine, and twelve minus three is nine. |
| `entry.hint.1` | Что должно стоять под корнем, чтобы получилось три? | Uch chiqishi uchun ildiz ostida nima turishi kerak? | What must stand under the root for the value to be three? |
| `entry.hint.2` | Под корнем девять, а икс равен двенадцати. | Ildiz ostida to'qqiz, iks esa o'n ikkiga teng. | Nine under the root, and x equals twelve. |
| `entry.hint.3` | Три. | Uch. | Three. |
| `multi.prompt` | Отметь все уравнения без корней | Ildizsiz barcha tenglamalarni belgilang | Mark every equation that has no roots |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Здесь справа положительное число, корень найдётся. | Bu yerda o'ngda musbat son, ildiz topiladi. | Here the right side is positive, so a root exists. |
| `multi.d.hint` | Ноль корню доступен: корень из нуля равен нулю. | Nol ildizga yetarli: noldan ildiz nolga teng. | Zero is available to a root: the root of zero is zero. |
| `multi.ok` | Верно. Отрицательное число справа закрывает уравнение сразу. | To'g'ri. O'ngdagi manfiy son tenglamani darrov yopadi. | Correct. A negative number on the right closes the equation at once. |
| `audio.mount` | Теперь наоборот. Сначала восстанови уравнение по его корню. | Endi teskarisiga. Avval ildiziga qarab tenglamani tiklang. | Now the other way round. First rebuild the equation from its root. |
| `audio.work` | Потом отметь все уравнения, у которых корней нет вовсе. | Keyin umuman ildizi yo'q barcha tenglamalarni belgilang. | Then mark every equation that has no roots at all. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `√(x − a) = 3,   x = 12` |
| `entry.answer` | `3` |
| `multi.a` [верно] | `√(x + 1) = −3` |
| `multi.b` [верно] | `√(x − 2) = −1` |
| `multi.c` | `√(x + 1) = 3` |
| `multi.d` | `√(x − 2) = 0` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `postoronniy-koren`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | Чему равен квадрат корня из семи? | Yettidan ildiz kvadrati nechaga teng? | What is the square of the root of seven? |
| `q1.a` [верно] | семь | yetti | seven |
| `q1.b` | сорок девять | qirq to'qqiz | forty nine |
| `q1.b.hint` | Сорок девять вышло бы, если возвести само семь. | Qirq to'qqiz yettining o'zini ko'targanda chiqardi. | Forty nine would come from squaring seven itself. |
| `q1.c` | четырнадцать | o'n to'rt | fourteen |
| `q1.c.hint` | Четырнадцать это удвоение, а не возведение. | O'n to'rt ikkilantirish, ko'tarish emas. | Fourteen is doubling, not squaring. |
| `q1.d` | корень из семи | yettidan ildiz | the root of seven |
| `q1.d.hint` | Возведение убирает знак корня, а не оставляет его. | Ko'tarish ildiz belgisini olib tashlaydi, qoldirmaydi. | Squaring removes the root sign, it does not keep it. |
| `q2.prompt` | Может ли корень равняться минус двум? | Ildiz minus ikkiga teng bo'la oladimi? | Can a root equal minus two? |
| `q2.a` [верно] | нет, никогда | yo'q, hech qachon | no, never |
| `q2.b` | да, если под корнем отрицательное | ha, agar ildiz ostida manfiy bo'lsa | yes, if the value under the root is negative |
| `q2.b.hint` | Под корнем отрицательного и не бывает, а значение корня всё равно неотрицательно. | Ildiz ostida manfiy ham bo'lmaydi, ildiz qiymati esa baribir manfiy emas. | A negative value cannot be under the root either, and the root value is non-negative regardless. |
| `q2.c` | да, если возвести в квадрат | ha, kvadratga ko'tarilsa | yes, if you square it |
| `q2.c.hint` | Возведение меняет запись, а не знак самого корня. | Ko'tarish yozuvni o'zgartiradi, ildizning ishorasini emas. | Squaring changes the writing, not the sign of the root itself. |
| `q2.d` | да, при отрицательном икс | ha, manfiy iksda | yes, for a negative x |
| `q2.d.hint` | Икс бывает отрицательным, а значение корня нет. | Iks manfiy bo'lishi mumkin, ildiz qiymati esa yo'q. | X can be negative, the value of the root cannot. |
| `q3.prompt` | Чему равен корень уравнения? | Tenglamaning ildizi nechaga teng? | What is the root of the equation? |
| `q3.a` [верно] | семь | yetti | seven |
| `q3.a.ok` | Семь. Возвели, получили икс плюс два равно девяти. | Yetti. Ko'tardik, iks qo'shuv ikki to'qqizga teng bo'ldi. | Seven. Squaring gives x plus two equals nine. |
| `q3.b` | одиннадцать | o'n bir | eleven |
| `q3.b.hint` | Одиннадцать вышло бы, если справа стояло не три, а больше. | O'n bir o'ngda uch emas, kattaroq son turganda chiqardi. | Eleven would come from a larger number on the right. |
| `q3.c` | один | bir | one |
| `q3.c.hint` | Проверь: под корнем выйдет три, а корень из трёх не равен трём. | Tekshiring: ildiz ostida uch chiqadi, uchdan ildiz esa uchga teng emas. | Check it: three under the root, and the root of three is not three. |
| `q3.d` | девять | to'qqiz | nine |
| `q3.d.hint` | Девять это то, что под корнем, а спросили про икс. | To'qqiz ildiz ostidagi son, savol esa iks haqida. | Nine is what stands under the root, and the question was about x. |
| `q4.prompt` | Что обязательно делают после возведения? | Ko'targandan keyin nima albatta qilinadi? | What must always be done after squaring? |
| `q4.a` [верно] | подставляют найденные числа в исходное | topilgan sonlarni dastlabkisiga qo'yishadi | the numbers found are substituted into the original |
| `q4.b` | записывают все найденные числа в ответ | topilgan barcha sonlarni javobga yozishadi | all numbers found are written into the answer |
| `q4.b.hint` | Именно так лишнее число и попадает в ответ. | Ortiqcha son javobga aynan shunday tushadi. | That is exactly how the extra number gets into the answer. |
| `q4.c` | возводят ещё раз | yana bir marta ko'tarishadi | they square once more |
| `q4.c.hint` | Второе возведение добавит ещё лишних чисел, а не уберёт. | Ikkinchi ko'tarish yana ortiqcha sonlar qo'shadi, olib tashlamaydi. | A second squaring adds more extra numbers, it does not remove any. |
| `q4.d` | округляют ответ | javobni yaxlitlashadi | they round the answer |
| `q4.d.hint` | Округление к посторонним корням отношения не имеет. | Yaxlitlashning ortiqcha ildizlarga aloqasi yo'q. | Rounding has nothing to do with extra roots. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `(√7)² = 7` |
| `q2.done` | `√a ≥ 0` |
| `q3.done` | `√(x + 2) = 3   →   x = 7` |
| `q4.done` | `√f = g   →   f = g²,  g ≥ 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Выписываю условие до возведения в квадрат | Kvadratga ko'tarishdan oldin shartni yozaman | I write the condition before squaring |
| `can.2` | Знаю, что возведение добавляет решения | Ko'tarish yechim qo'shishini bilaman | I know that squaring adds solutions |
| `can.3` | Проверяю каждое число подстановкой в исходное | Har bir sonni dastlabkisiga qo'yib tekshiraman | I check every number by substituting into the original |
| `can.4` | Вижу уравнение без решений по правой части | O'ng tarafiga qarab yechimsiz tenglamani ko'raman | I spot an equation with no solutions from its right side |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: проверка подстановкой. | Bir joy takrorlashni talab qiladi: qo'yib tekshirish. | One spot needs a second look: checking by substitution. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va beshinchi ekranga qayting. | Go back to the rule and to screen five. |
| `bridge` | Дальше неравенства: ответом станет не число, а участок оси. | Keyin tengsizliklar: javob son emas, o'q bo'lagi bo'ladi. | Next come inequalities: the answer becomes a piece of the axis, not a number. |
| `lifehack` | Увидел корень с неизвестным, сразу посмотри на правую часть. Иногда решать уже не надо. | Noma'lumli ildizni ko'rsangiz, darrov o'ng tarafga qarang. Ba'zan yechish shart ham emas. | When you see a root with an unknown, look at the right side first. Sometimes there is nothing left to solve. |
| `sheetTitle` | Иррациональные уравнения · шпаргалка | Irratsional tenglamalar · shpargalka | Irrational equations · cheat sheet |
| `sheetSrc` | 10 класс · урок 32 | 10-sinf · 32-dars | Grade 10 · lesson 32 |
| `audio.mount` | Прогноз был про два числа. Посмотрим, что вышло. | Taxmin ikki son haqida edi. Nima chiqqanini ko'ramiz. | The guess was about two numbers. Let us see how it turned out. |
| `audio.next` | Корень один. Минус два не испортилось при решении, оно никогда и не было допустимым. | Ildiz bitta. Minus ikki yechish paytida buzilgani yo'q, u hech qachon yaroqli bo'lmagan. | There is one root. Minus two did not go bad while solving, it was never admissible in the first place. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `3;  −2` |
| `hook.b` | `3` |
| `proved` | `3` |
| `law` | `√f(x) = g(x)   →   f(x) = g(x)²,   g(x) ≥ 0` |
| `sheet.1` | `g(x) ≥ 0` |
| `sheet.2` | `(√a)² = a,  a ≥ 0` |
| `sheet.3` | `√f = g   →   f = g²` |
| `sheet.4` | `√(a² + b²) ≠ a + b` |
| `sheet.5` | `3 → 3 = 3;   −2 → 2 ≠ −2` |
