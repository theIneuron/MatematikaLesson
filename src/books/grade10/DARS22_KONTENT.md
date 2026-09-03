# Урок 33 — Рациональные неравенства и системы · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS32_36_SKELET.md` §8. Опора в учебнике: алгебра 2022, стр. 75–80, параграфы
`RATSIONAL TENGSIZLIKLAR` и `RATSIONAL TENGSIZLIKLAR SISTEMASI`.

**Главное решение урока.** Здесь полоса меняет роль. В уроках 31 и 32 она проверяла найденное
число; теперь она сама и есть ответ. Поэтому прибор работает в другом режиме: ось режется
нулями, на каждом участке появляется знак, и только потом закрашивается ответ. Знаки —
нейтрального цвета, ответ — цветом решения: иначе ученик читает знак как часть ответа.

**Пять шагов карточки взяты из учебника дословно** (стр. 75): нули числителя, нули знаменателя,
отметить на оси, найти знаки на промежутках, выбрать промежутки.

**Задание экрана 6 взято из учебника** — стр. 75, 3-misol: `x − 4/x ≥ 0`.

**Терминология UZ — draft, требует валидации узбекским методистом математики.**

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НЕРАВЕНСТВО | TENGSIZLIK | THE INEQUALITY |
| `title` | Один кусок или два | Bir bo'lakmi yoki ikkitami | One piece or two |
| `row.a.name` | умножили на знаменатель | maxrajga ko'paytirdik | multiplied by the denominator |
| `row.b.name` | разметили ось | o'qni belgiladik | marked up the axis |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим числом. | Javobingiz yozib olindi. Endi son bilan tekshiramiz. | Your answer is saved. Now we will check with a number. |
| `audio.mount` | Дробь больше нуля. Слева и справа два разных ответа, и оба выглядят убедительно. | Kasr noldan katta. Chapda va o'ngda ikki xil javob, ikkalasi ham ishonarli ko'rinadi. | A fraction greater than zero. On the left and on the right two different answers, and both look convincing. |
| `audio.r1` | Первый получен умножением обеих частей на знаменатель: остаётся икс плюс один больше нуля. | Birinchisi ikkala tarafni maxrajga ko'paytirish bilan olingan: iks qo'shuv bir noldan katta bo'lib qoladi. | The first came from multiplying both sides by the denominator: x plus one greater than zero remains. |
| `audio.r2` | Второй получен разметкой оси и состоит из двух кусков, а не из одного. | Ikkinchisi o'qni belgilash bilan olingan va bitta emas, ikki bo'lakdan iborat. | The second came from marking up the axis and consists of two pieces, not one. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `(x + 1)/(x − 2) > 0` |
| `row.a.value` | `x > −1` |
| `row.b.value` | `x < −1;  x > 2` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед неравенством | Tengsizlikdan oldin uch savol | Three questions before the inequality |
| `q1.prompt` | При каком икс дробь не определена? | Kasr qaysi iksda aniqlanmagan? | For which x is a fraction undefined? |
| `q1.a` [верно] | когда знаменатель ноль | maxraj nol bo'lganda | when the denominator is zero |
| `q1.b` | когда числитель ноль | surat nol bo'lganda | when the numerator is zero |
| `q1.b.hint` | Ноль в числителе даёт ноль, и это обычное число. | Suratdagi nol nol beradi, va bu oddiy son. | Zero in the numerator gives zero, and that is an ordinary number. |
| `q1.c` | когда икс отрицателен | iks manfiy bo'lganda | when x is negative |
| `q1.c.hint` | Отрицательный икс дробь не ломает. | Manfiy iks kasrni buzmaydi. | A negative x does not break a fraction. |
| `q1.d` | никогда | hech qachon | never |
| `q1.d.hint` | Одна точка всё же выпадает, и её надо найти. | Bitta nuqta baribir tushib qoladi, va uni topish kerak. | One point does drop out, and it has to be found. |
| `q2.prompt` | Какой знак у частного двух отрицательных чисел? | Ikki manfiy sonning bo'linmasi qanday ishorali? | What sign does a quotient of two negative numbers have? |
| `q2.a` [верно] | плюс | plyus | plus |
| `q2.b` | минус | minus | minus |
| `q2.b.hint` | Минус на минус даёт плюс и при делении тоже. | Minusga minus bo'lishda ham plyus beradi. | Minus by minus gives plus in division too. |
| `q2.c` | зависит от того, что больше | qaysi biri kattaligiga bog'liq | it depends on which one is bigger |
| `q2.c.hint` | Величина не меняет знак, его определяют только знаки. | Kattalik ishorani o'zgartirmaydi, uni faqat ishoralar belgilaydi. | Size does not change the sign, only the signs decide it. |
| `q2.d` | ноль | nol | zero |
| `q2.d.hint` | Ноль вышел бы, будь числитель нулём. | Surat nol bo'lganda nol chiqardi. | Zero would come only from a zero numerator. |
| `q3.prompt` | Что такое решение неравенства? | Tengsizlikning yechimi nima? | What is the solution of an inequality? |
| `q3.a` [верно] | все числа, при которых оно верно | u to'g'ri bo'ladigan barcha sonlar | all numbers for which it holds |
| `q3.b` | одно число | bitta son | one number |
| `q3.b.hint` | Одно число это ответ уравнения, а не неравенства. | Bitta son tenglamaning javobi, tengsizlikniki emas. | One number is the answer of an equation, not of an inequality. |
| `q3.c` | граница между кусками | bo'laklar orasidagi chegara | the boundary between pieces |
| `q3.c.hint` | Граница помогает найти ответ, но сама им не является. | Chegara javobni topishga yordam beradi, lekin o'zi javob emas. | The boundary helps find the answer but is not the answer itself. |
| `q3.d` | любое положительное число | har qanday musbat son | any positive number |
| `q3.d.hint` | Иногда решения отрицательные, а положительные не годятся. | Ba'zan yechimlar manfiy, musbatlari esa yaramaydi. | Sometimes the solutions are negative and the positive ones do not fit. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `x − 2 ≠ 0` |
| `q2.done` | `(−)/(−) = (+)` |
| `q3.done` | `(x + 1)/(x − 2) > 0` |

---

## Экран 3 · `explain1` · ответ `number` · тег `umnozhayut-na-znamenatel`

Ось режется нулями. Прибор 5 в режиме ленты знаков.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Ось режут два числа | O'qni ikki son kesadi | Two numbers cut the axis |
| `show.1.1` | числитель равен нулю при минус единице | surat minus birda nolga teng | the numerator is zero at minus one |
| `show.1.2` | знаменатель равен нулю при двойке | maxraj ikkida nolga teng | the denominator is zero at two |
| `show.1.3` | оба числа падают на ось | ikkala son o'qqa tushadi | both numbers land on the axis |
| `show.2.1` | ось разрезана на участки | o'q bo'laklarga bo'lingan | the axis is cut into pieces |
| `show.2.2` | внутри участка знак не меняется | bo'lak ichida ishora o'zgarmaydi | inside a piece the sign does not change |
| `show.2.3` | значит хватит одного числа на участок | demak har bo'lakka bitta son yetadi | so one number per piece is enough |
| `audio.mount` | Ось под неравенством. Всё решение уместится на ней. | Tengsizlik tagida o'q. Butun yechim unga sig'adi. | An axis under the inequality. The whole solution will fit on it. |
| `audio.cut*` | Числитель обращается в ноль при минус единице, знаменатель при двойке. Оба числа падают на ось и режут её на три участка. Дальше работает простая вещь: пока мы идём по одному участку, ни числитель, ни знаменатель знак не меняют, а значит и вся дробь его не меняет. Поменяться он может только в тех точках, где что-то обращается в ноль, то есть на границах. Поэтому проверять весь участок не надо, хватит одного числа из него. | Surat minus birda nolga aylanadi, maxraj esa ikkida. Ikkala son o'qqa tushadi va uni uch bo'lakka bo'ladi. Keyin oddiy narsa ishlaydi: biz bitta bo'lak bo'ylab yurganimizda na surat, na maxraj ishorasini o'zgartiradi, demak butun kasr ham uni o'zgartirmaydi. U faqat biror narsa nolga aylanadigan nuqtalarda, ya'ni chegaralarda o'zgarishi mumkin. Shuning uchun butun bo'lakni tekshirish shart emas, undan bitta son yetadi. | The numerator turns to zero at minus one, the denominator at two. Both numbers land on the axis and cut it into three pieces. Then a simple thing does the work: while we walk along one piece, neither the numerator nor the denominator changes sign, so the whole fraction does not change sign either. It can only change at the points where something turns to zero, that is, at the boundaries. So there is no need to test a whole piece, one number from it is enough. |
| `audio.work` | Посчитай сам. На сколько участков два числа разрезали ось? | O'zingiz hisoblang. Ikki son o'qni necha bo'lakka bo'ldi? | Work it out yourself. Into how many pieces did the two numbers cut the axis? |
| `work.prompt` | Сколько участков получилось? | Nechta bo'lak hosil bo'ldi? | How many pieces are there? |
| `work.ok` | Три. Слева от минус единицы, между ней и двойкой, и правее двойки. | Uchta. Minus birdan chapda, u bilan ikki orasida, va ikkidan o'ngda. | Three. To the left of minus one, between it and two, and to the right of two. |
| `work.hint.1` | Посчитай куски, а не сами точки. | Nuqtalarni emas, bo'laklarni sanang. | Count the pieces, not the points themselves. |
| `work.hint.2` | Две точки режут прямую на три части. | Ikki nuqta to'g'ri chiziqni uch qismga bo'ladi. | Two points cut a line into three parts. |
| `work.hint.3` | Три. | Uch. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `3` |

---

## Экран 4 · `explain2` · ответ `order` · тег `umnozhayut-na-znamenatel`

Разграничение: умножение на знаменатель.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | РАЗГРАНИЧЕНИЕ | FARQLASH | TELLING THEM APART |
| `title` | Почему нельзя умножить на знаменатель | Nega maxrajga ko'paytirib bo'lmaydi | Why you cannot multiply by the denominator |
| `show.1.1` | умножаем обе части на знаменатель | ikkala tarafni maxrajga ko'paytiramiz | multiply both sides by the denominator |
| `show.1.2` | остаётся икс плюс один больше нуля | iks qo'shuv bir noldan katta bo'lib qoladi | x plus one greater than zero remains |
| `show.1.3` | ответ выходит одним куском | javob bitta bo'lak bo'lib chiqadi | the answer comes out as one piece |
| `show.2.1` | берём ноль из этого ответа | shu javobdan nolni olamiz | take zero from that answer |
| `show.2.2` | сверху один, снизу минус два | yuqorida bir, pastda minus ikki | one on top, minus two below |
| `show.2.3` | выходит минус, а нужен плюс | minus chiqadi, plyus kerak esa | a minus comes out, and a plus was needed |
| `audio.mount` | Разберём первый ответ. Он получен коротким и знакомым действием. | Birinchi javobni ko'rib chiqamiz. U qisqa va tanish amal bilan olingan. | Let us look at the first answer. It came from a short and familiar step. |
| `audio.mul*` | Обе части умножили на знаменатель, дробь исчезла, осталось икс плюс один больше нуля, отсюда икс больше минус единицы. Проверим этот ответ числом. Ноль в него входит. Подставим ноль в исходное: сверху единица, снизу минус два, дробь равна минус ноль целых пять десятых. Это меньше нуля, а требовалось больше. Значит ответ неверный. Причина в том, что знаменатель бывает отрицательным, а при умножении на отрицательное знак неравенства переворачивается. У уравнения такой беды нет, там знака нет вовсе. Это и есть разница между уравнением и неравенством. | Ikkala tarafni maxrajga ko'paytirdik, kasr yo'qoldi, iks qo'shuv bir noldan katta bo'lib qoldi, bundan iks minus birdan katta. Bu javobni son bilan tekshiramiz. Nol unga kiradi. Nolni dastlabkisiga qo'yamiz: yuqorida bir, pastda minus ikki, kasr minus nol butun besh o'ndan ga teng. Bu noldan kichik, katta bo'lishi kerak edi. Demak javob noto'g'ri. Sababi shuki, maxraj manfiy ham bo'ladi, manfiyga ko'paytirilganda esa tengsizlik ishorasi ag'dariladi. Tenglamada bunday balo yo'q, u yerda ishora umuman yo'q. Tenglama bilan tengsizlik orasidagi farq ana shu. | Both sides were multiplied by the denominator, the fraction vanished, x plus one greater than zero remained, which gives x greater than minus one. Let us test this answer with a number. Zero belongs to it. Substitute zero into the original: one on top, minus two below, and the fraction equals minus zero point five. That is less than zero, while greater was required. So the answer is wrong. The reason is that the denominator can be negative, and multiplying by a negative flips the inequality sign. An equation has no such trouble, there is no sign there at all. That is exactly the difference between an equation and an inequality. |
| `audio.work` | Расставь шаги в том порядке, в котором это произошло. | Bu sodir bo'lgan tartibda qadamlarni joylashtiring. | Put the steps in the order in which this happened. |
| `order.prompt` | Расставь шаги по порядку | Qadamlarni tartib bilan joylashtiring | Put the steps in order |
| `order.s1` | умножили на знаменатель | maxrajga ko'paytirdik | multiplied by the denominator |
| `order.s2` | получили один кусок | bitta bo'lak oldik | got one piece |
| `order.s3` | взяли ноль из ответа | javobdan nolni oldik | took zero from the answer |
| `order.s4` | вышел минус | minus chiqdi | a minus came out |
| `order.ok` | Верно. Проверка одним числом ломает неверный ответ за один шаг. | To'g'ri. Bitta son bilan tekshirish noto'g'ri javobni bir qadamda buzadi. | Correct. A check with one number breaks a wrong answer in a single step. |
| `order.bad` | Начни с действия, а не с проверки. | Tekshirishdan emas, amaldan boshlang. | Start with the step, not with the check. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `x + 1 > 0   →   x > −1` |
| `frameB` | `(0 + 1)/(0 − 2) = −0,5` |
| `order.mark` | `−0,5 < 0` |

---

## Экран 5 · `explain3` · ответ `number` · тег `umnozhayut-na-znamenatel`

Знаки встают по одному.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Знак каждого участка | Har bo'lakning ishorasi | The sign of each piece |
| `show.1.1` | слева берём минус два | chapda minus ikkini olamiz | on the left we take minus two |
| `show.1.2` | сверху минус, снизу минус | yuqorida minus, pastda minus | minus on top, minus below |
| `show.1.3` | на первом участке плюс | birinchi bo'lakda plyus | plus on the first piece |
| `show.2.1` | в середине берём ноль | o'rtada nolni olamiz | in the middle we take zero |
| `show.2.2` | справа берём тройку | o'ngda uchni olamiz | on the right we take three |
| `show.2.3` | знаки чередуются | ishoralar navbatlashadi | the signs alternate |
| `audio.mount` | Три участка, три числа. Возьмём по одному из каждого. | Uch bo'lak, uch son. Har biridan bittadan olamiz. | Three pieces, three numbers. Let us take one from each. |
| `audio.signs*` | Слева от минус единицы берём минус два. Сверху минус один, снизу минус четыре, минус на минус даёт плюс. На первом участке плюс. В середине берём ноль. Сверху один, снизу минус два, выходит минус. На втором участке минус. Справа от двойки берём тройку. Сверху четыре, снизу один, выходит плюс. На третьем участке плюс. Обрати внимание, знаки пошли плюс, минус, плюс, они чередуются. Так бывает не всегда, поэтому каждый участок мы всё же проверили числом, а не угадали по узору. | Minus birdan chapda minus ikkini olamiz. Yuqorida minus bir, pastda minus to'rt, minusga minus plyus beradi. Birinchi bo'lakda plyus. O'rtada nolni olamiz. Yuqorida bir, pastda minus ikki, minus chiqadi. Ikkinchi bo'lakda minus. Ikkidan o'ngda uchni olamiz. Yuqorida to'rt, pastda bir, plyus chiqadi. Uchinchi bo'lakda plyus. E'tibor bering, ishoralar plyus, minus, plyus bo'lib ketdi, ular navbatlashadi. Bu doim ham shunday bo'lavermaydi, shuning uchun biz har bo'lakni naqshga qarab taxmin qilmay, son bilan tekshirdik. | To the left of minus one we take minus two. Minus one on top, minus four below, and minus by minus gives plus. The first piece is plus. In the middle we take zero. One on top, minus two below, so a minus comes out. The second piece is minus. To the right of two we take three. Four on top, one below, so a plus comes out. The third piece is plus. Notice that the signs came out plus, minus, plus, they alternate. That is not always so, which is why we still tested every piece with a number instead of guessing from the pattern. |
| `audio.work` | Посчитай сам. На скольких участках стоит плюс? | O'zingiz hisoblang. Nechta bo'lakda plyus turibdi? | Work it out yourself. How many pieces carry a plus? |
| `work.prompt` | Сколько участков со знаком плюс? | Plyus ishorali nechta bo'lak bor? | How many pieces have a plus sign? |
| `work.ok` | Два. Первый и третий, и они и составят ответ. | Ikkita. Birinchi va uchinchi, javobni ular tashkil qiladi. | Two. The first and the third, and they will make the answer. |
| `work.hint.1` | Посмотри на знаки над осью. | O'q ustidagi ishoralarga qarang. | Look at the signs above the axis. |
| `work.hint.2` | Плюс стоит слева и справа, минус в середине. | Plyus chapda va o'ngda, minus o'rtada. | Plus stands on the left and on the right, minus in the middle. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 6 · `explain4` · ответ `number` · тег `umnozhayut-na-znamenatel`

Сам: задание учебника, дробь приводится к общему знаменателю.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | САМ | O'ZINGIZ | ON YOUR OWN |
| `title` | Сначала одна дробь, потом ось | Avval bitta kasr, keyin o'q | First one fraction, then the axis |
| `show.1.1` | слева не дробь, а разность | chapda kasr emas, ayirma | on the left there is a difference, not a fraction |
| `show.1.2` | приводим к общему знаменателю | umumiy maxrajga keltiramiz | bring it to a common denominator |
| `show.1.3` | сверху икс в квадрате минус четыре | yuqorida iks kvadrat minus to'rt | x squared minus four on top |
| `show.2.1` | числитель равен нулю при двойке и минус двойке | surat ikkida va minus ikkida nolga teng | the numerator is zero at two and at minus two |
| `show.2.2` | знаменатель равен нулю при нуле | maxraj nolda nolga teng | the denominator is zero at zero |
| `show.2.3` | на оси окажется три числа | o'qda uch son bo'ladi | three numbers will be on the axis |
| `audio.mount` | Это задание из учебника. Оно начинается с шага, которого у нас ещё не было. | Bu darslikdagi topshiriq. U bizda hali bo'lmagan qadamdan boshlanadi. | This task comes from the textbook. It starts with a step we have not had yet. |
| `audio.one*` | Слева стоит не дробь, а разность, и метод к ней пока не применить. Сначала приводим всё к общему знаменателю. Икс минус четыре делить на икс превращается в дробь, у которой сверху икс в квадрате минус четыре, а снизу икс. Теперь можно искать нули. Сверху ноль выходит при двойке и при минус двойке, снизу при нуле. Значит на оси окажется три числа, и участков будет четыре. Это правило работает всегда: сначала одна дробь, и только потом разметка. | Chapda kasr emas, ayirma turibdi, va usulni unga hozircha qo'llab bo'lmaydi. Avval hammasini umumiy maxrajga keltiramiz. Iks minus to'rtni iksga bo'lish yuqorisida iks kvadrat minus to'rt, pastida iks turgan kasrga aylanadi. Endi nollarni izlash mumkin. Yuqorida nol ikkida va minus ikkida chiqadi, pastda nolda. Demak o'qda uch son bo'ladi, bo'laklar esa to'rtta. Bu qoida doim ishlaydi: avval bitta kasr, faqat keyin belgilash. | On the left there is a difference, not a fraction, and the method does not apply to it yet. First we bring everything to a common denominator. X minus four over x turns into a fraction with x squared minus four on top and x below. Now the zeros can be found. On top the zero comes at two and at minus two, below it comes at zero. So three numbers will be on the axis, and there will be four pieces. This rule always holds: one fraction first, marking up only after that. |
| `audio.work` | Посчитай сам. Сколько чисел попадёт на ось? | O'zingiz hisoblang. O'qqa nechta son tushadi? | Work it out yourself. How many numbers will land on the axis? |
| `work.prompt` | Сколько чисел попадёт на ось? | O'qqa nechta son tushadi? | How many numbers land on the axis? |
| `work.ok` | Три. Два нуля числителя и один ноль знаменателя. | Uchta. Suratning ikki noli va maxrajning bir noli. | Three. Two zeros of the numerator and one zero of the denominator. |
| `work.hint.1` | Найди нули числителя и нули знаменателя отдельно. | Surat nollarini va maxraj nollarini alohida toping. | Find the zeros of the numerator and of the denominator separately. |
| `work.hint.2` | Икс в квадрате минус четыре обращается в ноль дважды. | Iks kvadrat minus to'rt ikki marta nolga aylanadi. | X squared minus four turns to zero twice. |
| `work.hint.3` | Три. | Uch. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `x − 4/x ≥ 0` |
| `frameB` | `(x² − 4)/x ≥ 0` |
| `work.expr` | `(x² − 4)/x ≥ 0` |
| `work.answer` | `3` |

---

## Экран 7 · `explain5` · ответ `number` · тег `tochku-ne-vykololi`

Граничный: знак «не меньше» и выколотая точка.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЧНЫЙ СЛУЧАЙ | CHEGARAVIY HOL | THE EDGE CASE |
| `title` | Одна точка входит, другая нет | Bir nuqta kiradi, boshqasi yo'q | One point is in, the other is not |
| `show.1.1` | тот же пример, но знак нестрогий | o'sha misol, lekin ishora qat'iy emas | the same example, but the sign is not strict |
| `show.1.2` | минус единица делает дробь нулём | minus bir kasrni nolga aylantiradi | minus one makes the fraction zero |
| `show.1.3` | ноль в ответ входит | nol javobga kiradi | zero belongs to the answer |
| `show.2.1` | двойка делает знаменатель нулём | ikki maxrajni nolga aylantiradi | two makes the denominator zero |
| `show.2.2` | такой дроби не существует | bunday kasr mavjud emas | such a fraction does not exist |
| `show.2.3` | точка выколота изнутри ответа | nuqta javob ichidan o'yib olingan | the point is punched out from inside the answer |
| `audio.mount` | То же неравенство, но знак поменяли на нестрогий. Ответ изменится не весь, а в двух точках. | O'sha tengsizlik, lekin ishora qat'iy emasga o'zgartirildi. Javob butunlay emas, ikki nuqtada o'zgaradi. | The same inequality, but the sign is now not strict. The answer changes not everywhere, but at two points. |
| `audio.edge*` | При минус единице числитель равен нулю, значит и вся дробь равна нулю. Нестрогий знак ноль допускает, поэтому минус единица входит в ответ, и точка закрашивается. При двойке в ноль обращается знаменатель, а делить на ноль нельзя ни при каком знаке неравенства. Значит двойка не входит никогда, и точка остаётся выколотой. Посмотри, как это выглядит на оси: закрашенный участок идёт до двойки и обрывается, а сама двойка остаётся пустой. Она вырезана изнутри ответа, а не с края. | Minus birda surat nolga teng, demak butun kasr ham nolga teng. Qat'iy bo'lmagan ishora nolni yo'l qo'yadi, shuning uchun minus bir javobga kiradi, nuqta esa bo'yaladi. Ikkida maxraj nolga aylanadi, nolga bo'lish esa tengsizlikning hech qanday ishorasida mumkin emas. Demak ikki hech qachon kirmaydi, nuqta ochiq qoladi. O'qda bu qanday ko'rinishiga qarang: bo'yalgan bo'lak ikkigacha boradi va uziladi, ikkining o'zi esa bo'sh qoladi. U javob chetidan emas, ichidan o'yib olingan. | At minus one the numerator is zero, so the whole fraction is zero. A non-strict sign allows zero, so minus one belongs to the answer and the point is filled in. At two the denominator turns to zero, and dividing by zero is not allowed under any inequality sign. So two never belongs, and the point stays hollow. Look at how this shows on the axis: the shaded piece runs up to two and breaks off, while two itself stays empty. It is cut out from inside the answer, not from its edge. |
| `audio.work` | Посчитай сам. Сколько точек в ответе выколото? | O'zingiz hisoblang. Javobda nechta nuqta ochiq qoldirilgan? | Work it out yourself. How many points in the answer are punched out? |
| `work.prompt` | Сколько точек выколото? | Nechta nuqta ochiq? | How many points are punched out? |
| `work.ok` | Одна. Двойка, где знаменатель ноль. Минус единица закрашена. | Bitta. Maxraj nol bo'lgan ikki. Minus bir esa bo'yalgan. | One. The two, where the denominator is zero. Minus one is filled in. |
| `work.hint.1` | Посмотри отдельно на ноль числителя и на ноль знаменателя. | Surat noliga va maxraj noliga alohida qarang. | Look separately at the zero of the numerator and of the denominator. |
| `work.hint.2` | Ноль числителя при нестрогом знаке входит в ответ. | Qat'iy bo'lmagan ishorada surat noli javobga kiradi. | With a non-strict sign the zero of the numerator belongs to the answer. |
| `work.hint.3` | Одна. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `frameA` | `(x + 1)/(x − 2) ≥ 0` |
| `frameB` | `x ≤ −1;  x > 2` |
| `work.expr` | `(x + 1)/(x − 2) ≥ 0` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `umnozhayut-na-znamenatel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Пять шагов | Besh qadam | Five steps |
| `probe.question` | Почему нельзя умножить обе части на знаменатель? | Nega ikkala tarafni maxrajga ko'paytirib bo'lmaydi? | Why can you not multiply both sides by the denominator? |
| `probe.a` [верно] | знаменатель бывает отрицательным, и знак перевернётся | maxraj manfiy ham bo'ladi, ishora ag'dariladi | the denominator can be negative, and the sign will flip |
| `probe.b` | потому что дробь исчезнет | chunki kasr yo'qoladi | because the fraction will vanish |
| `probe.b.hint` | Дробь исчезает и в уравнении, и там это разрешено. Дело в знаке. | Kasr tenglamada ham yo'qoladi, va u yerda bu mumkin. Gap ishorada. | The fraction vanishes in an equation too, and there it is allowed. The point is the sign. |
| `rule.lawLabel` | ПЯТЬ ШАГОВ | BESH QADAM | THE FIVE STEPS |
| `rule.lines.1` | найти нули числителя и нули знаменателя | surat va maxraj nollarini topish | find the zeros of the numerator and of the denominator |
| `rule.lines.2` | отметить их на числовой оси | ularni son o'qida belgilash | mark them on the number axis |
| `rule.lines.3` | на каждом участке найти знак и выбрать нужные | har bo'lakda ishorani topib, keraklilarini tanlash | find the sign on every piece and pick the ones you need |
| `audio.mount` | Соберём правило. В учебнике оно записано пятью шагами. | Qoidani yig'amiz. Darslikda u besh qadam bilan yozilgan. | Let us put the rule together. It is written as five steps. |
| `audio.rule*` | Первое: найти нули числителя. Второе: найти нули знаменателя. Третье: отметить и те и другие на числовой оси. Четвёртое: на каждом получившемся участке определить знак дроби, подставив одно число. Пятое: выбрать те участки, которые удовлетворяют неравенству, и это и есть ответ. Отдельно держи в голове разницу между нулём сверху и нулём снизу. Ноль числителя при нестрогом знаке входит в ответ, ноль знаменателя не входит никогда. | Birinchi: surat nollarini topish. Ikkinchi: maxraj nollarini topish. Uchinchi: ikkalasini ham son o'qida belgilash. To'rtinchi: hosil bo'lgan har bir bo'lakda bitta son qo'yib kasr ishorasini aniqlash. Beshinchi: tengsizlikni qanoatlantiradigan bo'laklarni tanlash, javob ana shu. Alohida esda tuting: yuqoridagi nol bilan pastdagi nol boshqacha. Qat'iy bo'lmagan ishorada surat noli javobga kiradi, maxraj noli esa hech qachon kirmaydi. | First: find the zeros of the numerator. Second: find the zeros of the denominator. Third: mark both kinds on the number axis. Fourth: on every piece that appears, determine the sign of the fraction by substituting one number. Fifth: pick the pieces that satisfy the inequality, and that is the answer. Keep the difference between a zero on top and a zero below in mind separately. With a non-strict sign the zero of the numerator belongs to the answer, the zero of the denominator never does. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `f(x)/g(x) > 0,   g(x) ≠ 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `tochku-ne-vykololi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ТРЕНИРОВКА | MASHQ | PRACTICE |
| `title` | Соедини неравенство с ответом | Tengsizlikni javobi bilan ulang | Match each inequality with its answer |
| `match.prompt` | Нули у всех разные, знаки тоже | Hammaning nollari har xil, ishoralari ham | The zeros differ everywhere, and so do the signs |
| `match.ok` | Верно. Знак неравенства решает, какие участки берут, а не где нули. | To'g'ri. Qaysi bo'laklar olinishini nollar emas, tengsizlik ishorasi hal qiladi. | Correct. The inequality sign decides which pieces are taken, not where the zeros are. |
| `audio.mount` | Четыре неравенства и четыре ответа. Размечай ось в уме. | To'rt tengsizlik va to'rt javob. O'qni xayolda belgilang. | Four inequalities and four answers. Mark up the axis in your head. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `(x − 1)/(x − 3) > 0` · `(x + 2)/(x − 1) < 0` · `1/(x − 4) > 0` · `(x + 3)/x < 0` |
| `match.a` | `x < 1;  x > 3` |
| `match.b` | `−2 < x < 1` |
| `match.c` | `x > 4` |
| `match.d` | `−3 < x < 0` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `umnozhayut-na-znamenatel`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMMA-QADAM | STEP BY STEP |
| `title` | Реши неравенство целиком | Tengsizlikni to'liq yeching | Solve the inequality from start to finish |
| `order.prompt` | Расставь шаги решения по порядку | Yechish qadamlarini tartib bilan joylashtiring | Put the solution steps in order |
| `order.s1` | найти нули | nollarni topish | find the zeros |
| `order.s2` | отметить на оси | o'qda belgilash | mark them on the axis |
| `order.s3` | расставить знаки | ishoralarni qo'yish | place the signs |
| `order.s4` | выбрать участки | bo'laklarni tanlash | pick the pieces |
| `order.ok` | Верно. Знаки ставят после разметки, а выбирают в самом конце. | To'g'ri. Ishoralar belgilashdan keyin qo'yiladi, tanlash esa eng oxirida. | Correct. Signs go after the marking, and the picking comes last. |
| `order.bad` | Знак участка нельзя найти, пока участка ещё нет. | Bo'lak yo'q ekan, uning ishorasini topib bo'lmaydi. | You cannot find the sign of a piece while the piece does not exist yet. |
| `audio.mount` | Теперь всё неравенство целиком. Четыре шага, порядок важен. | Endi butun tengsizlik. To'rt qadam, tartib muhim. | Now the whole inequality. Four steps, and the order matters. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `(x + 1)/(x − 2) > 0` |
| `order.mark` | `x < −1;  x > 2` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Сколько целых чисел внутри | Ichida nechta butun son bor | How many whole numbers are inside |
| `task.ok` | Три. Это два, три и четыре: границы сами не входят. | Uchta. Bular ikki, uch va to'rt: chegaralarning o'zi kirmaydi. | Three. They are two, three and four: the boundaries themselves are out. |
| `task.hint.1` | Выпиши числа, которые больше одного и меньше пяти. | Birdan katta va beshdan kichik sonlarni yozing. | Write out the numbers greater than one and less than five. |
| `task.hint.2` | Единица и пятёрка не входят: знаки строгие. | Bir va besh kirmaydi: ishoralar qat'iy. | One and five are out: the signs are strict. |
| `task.hint.3` | Три. | Uch. | Three. |
| `order.prompt` | Расставь промежутки по возрастанию длины | Oraliqlarni uzunligi o'sishi bo'yicha joylashtiring | Put the intervals in order of increasing length |
| `order.title` | от короткого к длинному | qisqasidan uzuniga | from the shortest to the longest |
| `order.ok` | Верно. Длина это разность концов, а не то, где промежуток стоит. | To'g'ri. Uzunlik chekkalar ayirmasi, oraliq qayerda turgani emas. | Correct. Length is the difference of the ends, not where the interval sits. |
| `order.bad` | Длину считают вычитанием, а не смотрят, какой промежуток левее. | Uzunlik ayirish bilan hisoblanadi, qaysi oraliq chaproq ekaniga qaralmaydi. | Length is computed by subtracting, not by seeing which interval is further left. |
| `audio.mount` | Прибора нет. Считай на бумаге, потом сверься. | Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring. | No instrument here. Work it out on paper, then compare. |
| `audio.next` | Дальше запись с ошибкой. Найди строку, где она появилась. | Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping. | Next comes a written solution with a mistake. Find the line where it appeared. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `1 < x < 5` |
| `task.answer` | `3` |
| `order.items` | `(1; 5)` · `(−1; 7)` · `(2; 4)` · `(0; 3)` |
| `order.answer` | `(2; 4)  (0; 3)  (1; 5)  (−1; 7)` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Найди строку с ошибкой | Xatoli qatorni toping | Find the line with the mistake |
| `hint.r1` | Исходное неравенство, здесь ошибки быть не может. | Dastlabki tengsizlik, bu yerda xato bo'lishi mumkin emas. | The original inequality, no mistake can live here. |
| `hint.r2` | Дробь исчезла. Спроси себя, что с ней сделали. | Kasr yo'qoldi. O'zingizdan so'rang: unga nima qilishdi? | The fraction vanished. Ask yourself what was done to it. |
| `hint.r3` | Из предыдущей строки это следует верно, но сама она уже неверна. | Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri. | This follows correctly from the previous line, but that line is already wrong. |
| `proof` | Подставь ноль в первую строку: выйдет минус ноль целых пять десятых. | Nolni birinchi qatorga qo'ying: minus nol butun besh o'ndan chiqadi. | Substitute zero into the first line: minus zero point five comes out. |
| `entry.prompt` | Какое число из этого ответа не подходит? | Bu javobdagi qaysi son yaramaydi? | Which number from this answer does not fit? |
| `entry.ok` | Ноль. Он входит в полученный ответ, а исходному неравенству не удовлетворяет. | Nol. U olingan javobga kiradi, dastlabki tengsizlikni esa qanoatlantirmaydi. | Zero. It belongs to the answer obtained, yet it does not satisfy the original inequality. |
| `entry.hint.1` | Возьми любое число между минус единицей и двойкой. | Minus bir bilan ikki orasidagi istalgan sonni oling. | Take any number between minus one and two. |
| `entry.hint.2` | Самое удобное для счёта число как раз там и лежит. | Hisoblash uchun eng qulay son aynan o'sha yerda yotadi. | The most convenient number to compute with lies right there. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `audio.mount` | Четыре строки. Ошибка появилась рано, и дальше её никто не заметил. | To'rt qator. Xato erta paydo bo'ldi, keyin uni hech kim sezmadi. | Four lines. The mistake appeared early, and after that nobody noticed it. |
| `audio.next` | Дальше обратная задача: по ответу восстанови неравенство. | Keyin teskari masala: javobga qarab tengsizlikni tiklang. | Next comes the reverse task: rebuild the inequality from its answer. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `(x + 1)/(x − 2) > 0` |
| `row.r2` | `x + 1 > 0` |
| `row.r3` | `x > −1` |
| `row.r4` | `x ∈ (−1; +∞)` |
| `answerId` | `r2` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Обратный ход | Teskari yo'l | The other direction |
| `entry.prompt` | Вот ответ неравенства. При каком икс знаменатель равен нулю? | Mana tengsizlikning javobi. Maxraj qaysi iksda nolga teng? | Here is the answer of an inequality. For which x is the denominator zero? |
| `entry.ok` | Два. Эта точка выколота, значит именно там знаменатель обращается в ноль. | Ikki. Bu nuqta ochiq, demak aynan o'sha yerda maxraj nolga aylanadi. | Two. That point is punched out, so the denominator turns to zero exactly there. |
| `entry.hint.1` | Посмотри, какая граница выколота, а какая закрашена. | Qaysi chegara ochiq, qaysi biri bo'yalganiga qarang. | Look at which boundary is hollow and which is filled. |
| `entry.hint.2` | Выколотая граница всегда приходит от знаменателя. | Ochiq chegara doim maxrajdan keladi. | A hollow boundary always comes from the denominator. |
| `entry.hint.3` | Два. | Ikki. | Two. |
| `multi.prompt` | Отметь все числа, которые являются решениями | Yechim bo'lgan barcha sonlarni belgilang | Mark every number that is a solution |
| `multi.title` | их ровно два | ular aynan ikkita | there are exactly two |
| `multi.c.hint` | Ноль лежит в среднем участке, а там знак минус. | Nol o'rtadagi bo'lakda yotadi, u yerda esa minus. | Zero lies in the middle piece, and the sign there is minus. |
| `multi.d.hint` | В этой точке знаменатель равен нулю, дроби просто нет. | Bu nuqtada maxraj nolga teng, kasr umuman yo'q. | At this point the denominator is zero, so there is no fraction at all. |
| `multi.ok` | Верно. Годятся числа из крайних участков, средний участок отпадает. | To'g'ri. Chekka bo'laklardagi sonlar yaraydi, o'rtadagi bo'lak tushib qoladi. | Correct. Numbers from the outer pieces fit, the middle piece drops out. |
| `audio.mount` | Теперь наоборот. Сначала по ответу назови ноль знаменателя. | Endi teskarisiga. Avval javobga qarab maxraj nolini ayting. | Now the other way round. First name the zero of the denominator from the answer. |
| `audio.work` | Потом отметь все числа, при которых неравенство верно. | Keyin tengsizlik to'g'ri bo'ladigan barcha sonlarni belgilang. | Then mark every number for which the inequality holds. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `x < −1;  x > 2` |
| `entry.answer` | `2` |
| `multi.a` [верно] | `−5` |
| `multi.b` [верно] | `3` |
| `multi.c` | `0` |
| `multi.d` | `2` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `tochku-ne-vykololi`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `title` | Четыре вопроса подряд | Ketma-ket to'rt savol | Four questions in a row |
| `q1.prompt` | На сколько участков делят ось два разных числа? | Ikki har xil son o'qni necha bo'lakka bo'ladi? | Into how many pieces do two different numbers cut the axis? |
| `q1.a` [верно] | на три | uchga | into three |
| `q1.b` | на два | ikkiga | into two |
| `q1.b.hint` | Два куска дало бы одно число, а их два. | Ikki bo'lakni bitta son berardi, ular esa ikkita. | Two pieces would come from one number, and there are two. |
| `q1.c` | на четыре | to'rtga | into four |
| `q1.c.hint` | Четыре куска дают три числа. | To'rt bo'lakni uch son beradi. | Four pieces come from three numbers. |
| `q1.d` | на пять | beshga | into five |
| `q1.d.hint` | Кусков всегда на один больше, чем чисел. | Bo'laklar doim sonlardan bittaga ko'p. | There is always one piece more than there are numbers. |
| `q2.prompt` | Что делают с точкой, где знаменатель ноль? | Maxraj nol bo'lgan nuqta bilan nima qilinadi? | What is done with the point where the denominator is zero? |
| `q2.a` [верно] | выкалывают всегда | doim ochiq qoldiriladi | it is always punched out |
| `q2.b` | включают при нестрогом знаке | qat'iy bo'lmagan ishorada kiritiladi | it is included when the sign is not strict |
| `q2.b.hint` | Нестрогий знак меняет судьбу нуля числителя, а не знаменателя. | Qat'iy bo'lmagan ishora surat nolining taqdirini o'zgartiradi, maxrajnikini emas. | A non-strict sign changes the fate of the numerator zero, not the denominator one. |
| `q2.c` | включают всегда | doim kiritiladi | it is always included |
| `q2.c.hint` | Тогда пришлось бы делить на ноль. | U holda nolga bo'lishga to'g'ri kelardi. | Then you would have to divide by zero. |
| `q2.d` | зависит от знака числителя | surat ishorasiga bog'liq | it depends on the sign of the numerator |
| `q2.d.hint` | Числитель на это не влияет вовсе. | Surat bunga umuman ta'sir qilmaydi. | The numerator has no bearing on this at all. |
| `q3.prompt` | Сколько целых чисел удовлетворяет записи? | Yozuvni nechta butun son qanoatlantiradi? | How many whole numbers satisfy this? |
| `q3.a` [верно] | четыре | to'rt | four |
| `q3.a.ok` | Четыре. Это минус один, ноль, один и два. | To'rtta. Bular minus bir, nol, bir va ikki. | Four. They are minus one, zero, one and two. |
| `q3.b` | пять | besh | five |
| `q3.b.hint` | Границы не входят, знаки строгие. | Chegaralar kirmaydi, ishoralar qat'iy. | The boundaries are out, the signs are strict. |
| `q3.c` | три | uch | three |
| `q3.c.hint` | Не забудь про ноль, он тоже целое число. | Nolni unutmang, u ham butun son. | Do not forget zero, it is a whole number too. |
| `q3.d` | шесть | olti | six |
| `q3.d.hint` | Шесть вышло бы, если бы вошли обе границы. | Olti ikkala chegara ham kirganda chiqardi. | Six would come if both boundaries were included. |
| `q4.prompt` | Можно ли умножить обе части на знаменатель? | Ikkala tarafni maxrajga ko'paytirish mumkinmi? | Can both sides be multiplied by the denominator? |
| `q4.a` [верно] | нет, знак может перевернуться | yo'q, ishora ag'darilishi mumkin | no, the sign may flip |
| `q4.b` | да, всегда | ha, doim | yes, always |
| `q4.b.hint` | Это верно для уравнения, но не для неравенства. | Bu tenglama uchun to'g'ri, tengsizlik uchun emas. | That holds for an equation, not for an inequality. |
| `q4.c` | да, если знаменатель не ноль | ha, agar maxraj nol bo'lmasa | yes, if the denominator is not zero |
| `q4.c.hint` | Не ноль, но может быть отрицательным, и этого достаточно. | Nol emas, lekin manfiy bo'lishi mumkin, va bu yetarli. | Not zero, but it can be negative, and that is enough. |
| `q4.d` | да, если числитель положителен | ha, agar surat musbat bo'lsa | yes, if the numerator is positive |
| `q4.d.hint` | Числитель тут ни при чём, знак берут у знаменателя. | Suratning bunga aloqasi yo'q, ishora maxrajdan olinadi. | The numerator is not involved, the sign comes from the denominator. |
| `audio.mount` | Четыре вопроса подряд. Считается первая попытка. | Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi. | Four questions in a row. The first attempt counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `3` |
| `q2.done` | `g(x) ≠ 0` |
| `q3.done` | `−2 < x < 3` |
| `q4.done` | `f(x)/g(x) > 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что теперь умеешь | Endi nima qila olasiz | What you can do now |
| `can.1` | Нахожу нули числителя и знаменателя | Surat va maxraj nollarini topaman | I find the zeros of the numerator and denominator |
| `can.2` | Размечаю ось и ставлю знак на каждом участке | O'qni belgilab, har bo'lakka ishora qo'yaman | I mark up the axis and put a sign on every piece |
| `can.3` | Знаю, что на знаменатель умножать нельзя | Maxrajga ko'paytirib bo'lmasligini bilaman | I know you cannot multiply by the denominator |
| `can.4` | Выкалываю точку, где знаменатель ноль | Maxraj nol bo'lgan nuqtani ochiq qoldiraman | I punch out the point where the denominator is zero |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of problem is closed. |
| `levels.gap` | Одно место требует повтора: знаки на участках. | Bir joy takrorlashni talab qiladi: bo'laklardagi ishoralar. | One spot needs a second look: the signs on the pieces. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va beshinchi ekranga qayting. | Go back to the rule and to screen five. |
| `bridge` | Дальше логарифмы: выражение надо будет свернуть, прежде чем решать. | Keyin logarifmlar: yechishdan oldin ifodani yig'ish kerak bo'ladi. | Next come logarithms: an expression will have to be folded up before solving. |
| `lifehack` | Увидел дробь и знак неравенства, сразу ищи нули. Умножать нечего. | Kasr va tengsizlik ishorasini ko'rsangiz, darrov nollarni izlang. Ko'paytiradigan narsa yo'q. | When you see a fraction and an inequality sign, look for the zeros right away. There is nothing to multiply. |
| `sheetTitle` | Рациональные неравенства · шпаргалка | Ratsional tengsizliklar · shpargalka | Rational inequalities · cheat sheet |
| `sheetSrc` | 10 класс · урок 33 | 10-sinf · 33-dars | Grade 10 · lesson 33 |
| `audio.mount` | Прогноз был про один кусок и два. Посмотрим, что вышло. | Taxmin bitta va ikki bo'lak haqida edi. Nima chiqqanini ko'ramiz. | The guess was about one piece and two. Let us see how it turned out. |
| `audio.next` | Ответ из двух кусков. Умножение на знаменатель склеило их в один и потеряло половину. | Javob ikki bo'lakdan. Maxrajga ko'paytirish ularni bittaga yopishtirib, yarmini yo'qotgan. | The answer has two pieces. Multiplying by the denominator glued them into one and lost half of it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `x > −1` |
| `hook.b` | `x < −1;  x > 2` |
| `proved` | `x < −1;  x > 2` |
| `law` | `f(x)/g(x) > 0,   g(x) ≠ 0` |
| `sheet.1` | `f(x) = 0` |
| `sheet.2` | `g(x) = 0` |
| `sheet.3` | `(−)/(−) = (+)` |
| `sheet.4` | `(+)/(−) = (−)` |
| `sheet.5` | `x < −1;  x > 2` |
