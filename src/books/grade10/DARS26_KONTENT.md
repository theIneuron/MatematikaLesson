# Урок 26 — Степень (действ.) · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS13_KONTENT.md`.

Скелет: `DARS26_28_SKELET.md` §7. Опора в учебнике: алгебра 2022, стр. 95 — восемь свойств
степени и вывод об основании.

**Главное решение урока.** Новых правил здесь не заучивают. Показатель едет по лестнице вниз:
три, два, один, ноль, минус один — и каждый шаг делит на основание. Нулевой и отрицательный
показатель получаются сами, без отдельного соглашения. Дробный показатель проверяется обратным
действием: возводим ответ в куб и смотрим, что осталось. Иррациональный показатель зажимается
полосой. Отсюда же выходит требование к основанию: у отрицательного основания дробный показатель
числа не даёт, и полоса квадратов это показывает.

**Два решения по подаче.**

1. **У хука фигуры нет.** Единственная честная картинка для него — лестница степеней, а она и
   есть ответ экрана 5. Прогноз, которому показали ответ, перестаёт быть прогнозом.
2. **Страницы учебника нет ни на экране, ни в озвучке** (решение методиста, START §3 пункт 10).
   Источник живёт в этом документе и в скелете. Эталон §4.4 требует страницу на карточке — это
   расхождение снято решением, и правило §4.4 в классе не исполняется ни в одном уроке.

**Умножение в формулах пишется без пробелов вокруг точки** (`a^m·a^n`). Пробел с двух сторон —
разделитель списка для сборщика: он превращает формулу в массив, и на экране пропадает знак
умножения. В уроке 13 это произошло в одиннадцати местах.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | СТЕПЕНЬ | DARAJA | THE POWER |
| `title` | Минус в показателе | Ko'rsatkichdagi minus | The minus in the exponent |
| `row.a.name` | меняет знак числа | sonning ishorasini o'zgartiradi | flips the sign of the number |
| `row.b.name` | переворачивает дробь | kasrni teskari qiladi | turns the fraction over |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас спустимся по лестнице показателей и посмотрим. | Javobingiz yozib olindi. Endi ko'rsatkichlar zinapoyasidan tushamiz va ko'ramiz. | Your answer is saved. Now we will walk down the ladder of exponents and see. |
| `audio.mount` | Два числа рядом. Минус восемь и одна восьмая. Ровно одно из них равно двойке в минус третьей степени. | Yonma-yon ikki son. Minus sakkiz va bir sakkizdan. Ulardan aynan bittasi ikkining minus uchinchi darajasiga teng. | Two numbers side by side. Minus eight and one eighth. Exactly one of them equals two to the minus third power. |
| `audio.r1` | Первая запись говорит, что минус в показателе делает само число отрицательным. | Birinchi yozuv ko'rsatkichdagi minus sonning o'zini manfiy qiladi deydi. | The first reading says the minus in the exponent makes the number itself negative. |
| `audio.r2` | Вторая говорит, что минус переворачивает дробь, а знак числа не трогает. | Ikkinchisi minus kasrni teskari qiladi, sonning ishorasiga tegmaydi deydi. | The second says the minus turns the fraction over and leaves the sign alone. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `2^{−3}` |
| `row.a.value` | `−8` |
| `row.b.value` | `1/8` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед степенью | Darajadan oldin uch savol | Three questions before the power |
| `q1.prompt` | Сколько множителей в записи два в третьей степени? | Ikki uchinchi darajada yozuvida nechta ko'paytuvchi bor? | How many factors are in two to the third power? |
| `q1.a` [верно] | три | uchta | three |
| `q1.b` | два | ikkita | two |
| `q1.b.hint` | Два это основание, а множителей столько, сколько сказал показатель. | Ikki bu asos, ko'paytuvchilar soni esa ko'rsatkich aytgancha. | Two is the base, and the number of factors is what the exponent says. |
| `q1.c` | шесть | oltita | six |
| `q1.c.hint` | Шесть получилось бы, если два и три перемножить, а они здесь стоят на разных местах. | Olti ikki bilan uchni ko'paytirsak chiqardi, ular esa bu yerda har xil o'rinda turadi. | Six would come from multiplying two by three, but here they sit in different places. |
| `q1.d` | восемь | sakkizta | eight |
| `q1.d.hint` | Восемь это значение записи, а спросили про число множителей. | Sakkiz bu yozuvning qiymati, savol esa ko'paytuvchilar soni haqida. | Eight is the value of the reading, and the question was the number of factors. |
| `q2.prompt` | Чему равно два в третьей умножить на два во второй? | Ikki uchinchi darajada ikki ikkinchi darajaga ko'paytirilsa nima bo'ladi? | What is two to the third times two to the second? |
| `q2.a` [верно] | два в пятой | ikki beshinchi darajada | two to the fifth |
| `q2.b` | два в шестой | ikki oltinchi darajada | two to the sixth |
| `q2.b.hint` | Шесть вышло бы, если показатели перемножить. Выпиши множители и посчитай их. | Olti ko'rsatkichlarni ko'paytirsak chiqardi. Ko'paytuvchilarni yozib sanang. | Six would come from multiplying the exponents. Write the factors out and count them. |
| `q2.c` | четыре в пятой | to'rt beshinchi darajada | four to the fifth |
| `q2.c.hint` | Основание не меняется: множители те же двойки. | Asos o'zgarmaydi: ko'paytuvchilar o'sha ikkilar. | The base does not change: the factors are the same twos. |
| `q2.d` | два в первой | ikki birinchi darajada | two to the first |
| `q2.d.hint` | Первая степень вышла бы при делении, а здесь умножение. | Birinchi daraja bo'lishda chiqardi, bu yerda esa ko'paytirish. | The first power would come from dividing, and here we multiply. |
| `q3.prompt` | Какое число в квадрате даёт девять? | Qaysi son kvadratda to'qqiz beradi? | Which number squared gives nine? |
| `q3.a` [верно] | три | uch | three |
| `q3.b` | четыре с половиной | to'rt yarim | four and a half |
| `q3.b.hint` | Это половина девяти, а нужен множитель, взятый дважды. | Bu to'qqizning yarmi, kerak bo'lgani esa ikki marta olingan ko'paytuvchi. | That is half of nine, but we need a factor taken twice. |
| `q3.c` | восемьдесят один | sakson bir | eighty one |
| `q3.c.hint` | Восемьдесят один это девять в квадрате, то есть обратный ход. | Sakson bir bu to'qqiz kvadratda, ya'ni teskari yo'l. | Eighty one is nine squared, that is the other direction. |
| `q3.d` | шесть | olti | six |
| `q3.d.hint` | Шесть это девять плюс три, а не множитель, взятый дважды. | Olti bu to'qqiz qo'shuv uch, ikki marta olingan ko'paytuvchi emas. | Six is nine plus three, not a factor taken twice. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `2³ = 2·2·2` |
| `q2.done` | `2³·2² = 2⁵` |
| `q3.done` | `3² = 9` |

---

## Экран 3 · `explain1` · ответ `order` · тег `stepen-po-analogii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Показатель считает множители | Ko'rsatkich ko'paytuvchilarni sanaydi | The exponent counts the factors |
| `show.1.1` | показатель это число множителей | ko'rsatkich bu ko'paytuvchilar soni | the exponent is the number of factors |
| `show.1.2` | выписываем обе записи полностью | ikkala yozuvni to'liq yozamiz | we write both readings out in full |
| `show.2.1` | множители просто дописались | ko'paytuvchilar shunchaki qo'shildi | the factors simply got appended |
| `show.2.2` | поэтому показатели складываются | shuning uchun ko'rsatkichlar qo'shiladi | so the exponents add up |
| `audio.mount` | Степень это короткая запись умножения. Показатель говорит, сколько раз повторяется основание. | Daraja bu ko'paytirishning qisqa yozuvi. Ko'rsatkich asos necha marta takrorlanishini aytadi. | A power is a short way to write multiplication. The exponent says how many times the base repeats. |
| `audio.grow*` | Выпишем два в третьей полностью, потом два во второй, и поставим их рядом. Множителей стало пять, потому что три и два дописались друг к другу. Ни одного нового правила здесь нет, есть только счёт множителей. Поэтому у произведения степеней показатели складываются, а не перемножаются. | Ikki uchinchi darajani to'liq yozamiz, keyin ikki ikkinchi darajani, va ularni yonma-yon qo'yamiz. Ko'paytuvchilar beshta bo'ldi, chunki uch bilan ikki bir-biriga qo'shildi. Bu yerda birorta yangi qoida yo'q, faqat ko'paytuvchilar sanog'i bor. Shuning uchun darajalar ko'paytmasida ko'rsatkichlar qo'shiladi, ko'paytirilmaydi. | Let us write two to the third out in full, then two to the second, and place them side by side. There are five factors now, because three and two got appended to each other. There is no new rule here, only counting factors. So in a product of powers the exponents add up instead of multiplying. |
| `audio.work` | Теперь сам. Расставь шаги в том порядке, в котором эта запись получилась. | Endi o'zingiz. Bu yozuv qanday tartibda chiqqan bo'lsa, qadamlarni shunday joylashtiring. | Now you. Put the steps in the order this reading came out. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | выписываем множители | ko'paytuvchilarni yozamiz | we write out the factors |
| `order.s2` | ставим записи рядом | yozuvlarni yonma-yon qo'yamiz | we place the readings side by side |
| `order.s3` | считаем множители | ko'paytuvchilarni sanaymiz | we count the factors |
| `order.s4` | складываем показатели | ko'rsatkichlarni qo'shamiz | we add the exponents |
| `order.ok` | Порядок такой. Показатели складываются потому, что множители дописываются. | Tartib shunday. Ko'rsatkichlar qo'shiladi, chunki ko'paytuvchilar qo'shiladi. | That is the order. The exponents add up because the factors get appended. |
| `order.bad` | Сначала выписать множители, потом поставить записи рядом, потом посчитать. | Avval ko'paytuvchilarni yozish, keyin yozuvlarni yonma-yon qo'yish, keyin sanash. | First write the factors out, then place the readings side by side, then count. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2³·2² = 2·2·2·2·2` |
| `show.2.3` | `2³·2² = 2⁵` |
| `order.mark` | `2⁵` |

---

## Экран 4 · `explain2` · ответ `order` · тег `stepen-po-analogii`

Разграничение: похожая запись, другое действие.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Степень степени умножает показатели | Darajaning darajasi ko'rsatkichlarni ko'paytiradi | A power of a power multiplies the exponents |
| `show.1.1` | здесь в степень возводится степень | bu yerda daraja darajaga ko'tariladi | here a power is raised to a power |
| `show.1.2` | значит основание берут дважды | demak asos ikki marta olinadi | so the base is taken twice |
| `show.2.1` | в каждой записи по три множителя | har yozuvda uchta ko'paytuvchi | each reading has three factors |
| `show.2.2` | всего шесть, то есть три на два | jami oltita, ya'ni uch kerra ikki | six in all, that is three times two |
| `audio.mount` | Похожая запись, но действие другое. Здесь в степень возводится сама степень. | O'xshash yozuv, lekin amal boshqa. Bu yerda darajaning o'zi darajaga ko'tarilgan. | A similar reading, but a different action. Here the power itself is raised to a power. |
| `audio.same*` | Два в третьей в квадрате это два в третьей, взятое дважды. Раскроем обе записи. Множителей стало шесть, то есть три, повторённое два раза. Значит здесь показатели перемножаются. В прошлой записи они складывались, и путать эти два случая нельзя: в одном записи ставят рядом, в другом одну из них берут несколько раз. | Ikki uchinchi darajada kvadratda bu ikki uchinchi darajada, ikki marta olingan. Ikkala yozuvni ochamiz. Ko'paytuvchilar oltita bo'ldi, ya'ni uch ikki marta takrorlangan. Demak bu yerda ko'rsatkichlar ko'paytiriladi. O'tgan yozuvda ular qo'shilardi, va bu ikki holni aralashtirish mumkin emas: birida yozuvlar yonma-yon qo'yiladi, boshqasida bittasi bir necha marta olinadi. | Two to the third, squared, is two to the third taken twice. Let us open both readings. There are six factors now, that is three repeated two times. So here the exponents multiply. In the previous reading they added up, and these two cases must not be mixed: in one the readings stand side by side, in the other one of them is taken several times. |
| `audio.work` | Посчитай сам. Расставь шаги, как получилась эта запись. | O'zingiz hisoblang. Bu yozuv qanday chiqqan bo'lsa, qadamlarni joylashtiring. | Work it out yourself. Put the steps in the order this reading came out. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | основание дважды | asos ikki marta | the base twice |
| `order.s2` | раскрыть записи | yozuvlarni ochish | open the readings |
| `order.s3` | шесть множителей | oltita ko'paytuvchi | six factors |
| `order.s4` | показатели перемножены | ko'rsatkichlar ko'paytirildi | the exponents got multiplied |
| `order.ok` | Три умножить на два это шесть: показатели перемножились. | Uch kerra ikki bu olti: ko'rsatkichlar ko'paytirildi. | Three times two is six: the exponents multiplied. |
| `order.bad` | Сначала основание дважды, потом раскрыть, потом посчитать множители. | Avval asos ikki marta, keyin ochish, keyin ko'paytuvchilarni sanash. | First the base twice, then open it, then count the factors. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `(2³)² = 2³·2³` |
| `show.2.3` | `(2³)² = 2⁶` |
| `order.mark` | `2⁶` |

---

## Экран 5 · `explain3` · ответ `number` · тег `stepen-po-analogii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Лестница вниз проходит через ноль | Zinapoya pastga nol orqali o'tadi | The ladder down passes through zero |
| `show.1.1` | каждый шаг вниз делит на два | pastga har qadam ikkiga bo'ladi | each step down divides by two |
| `show.1.2` | восемь, четыре, два | sakkiz, to'rt, ikki | eight, four, two |
| `show.2.1` | шаг ниже единицы продолжает делить | birdan pastdagi qadam bo'lishni davom etadi | the step below one keeps dividing |
| `show.2.2` | нулевой и отрицательный показатель вышли сами | nol va manfiy ko'rsatkich o'zi chiqdi | the zero and negative exponents came out on their own |
| `audio.mount` | Спустимся по показателям вниз. Восемь, четыре, два. Каждый шаг вниз делит на два. | Ko'rsatkichlar bo'yicha pastga tushamiz. Sakkiz, to'rt, ikki. Pastga har qadam ikkiga bo'ladi. | Let us walk down the exponents. Eight, four, two. Each step down divides by two. |
| `audio.down*` | Следующий шаг после двойки это единица, а не ноль, потому что два разделить на два это один. Ещё шаг ниже, и получается одна вторая. Вот откуда берутся нулевой и отрицательный показатель. Отдельного соглашения для них не придумывали: они просто продолжение той же лестницы. | Ikkidan keyingi qadam nol emas, bir, chunki ikki ikkiga bo'linsa bir bo'ladi. Yana bir qadam pastga, va bir ikkidan chiqadi. Nol va manfiy ko'rsatkich shundan keladi. Ular uchun alohida kelishuv o'ylab topilmagan: bu o'sha zinapoyaning davomi. | The next step after two is one, not zero, because two divided by two is one. One more step down and we get one half. That is where the zero and the negative exponent come from. No separate agreement was invented for them: they are simply the same ladder continued. |
| `audio.work` | Посчитай сам. Чему равно два в нулевой степени? | O'zingiz hisoblang. Ikki nol darajada nechaga teng? | Work it out yourself. What is two to the zero power? |
| `work.prompt` | Чему равно два в нулевой степени? | Ikki nol darajada nechaga teng? | What is two to the zero power? |
| `work.ok` | Единица. Шаг вниз делит на два, и после двойки идёт один. | Bir. Pastga qadam ikkiga bo'ladi, va ikkidan keyin bir keladi. | One. A step down divides by two, and after two comes one. |
| `work.hint.1` | Посмотри, на что делится каждый следующий шаг. | Har keyingi qadam nimaga bo'linishini ko'ring. | Look at what each next step is divided by. |
| `work.hint.2` | Два разделить на два. | Ikki ikkiga bo'linsa. | Two divided by two. |
| `work.hint.3` | Один. | Bir. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2³ = 8    2² = 4    2¹ = 2` |
| `show.2.3` | `2⁰ = 1    2^{−1} = 1/2` |
| `work.answer` | `1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `drobnyy-kak-delenie`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Дробный показатель это корень | Kasr ko'rsatkich bu ildiz | A fractional exponent is a root |
| `show.1.1` | показатель одна третья | ko'rsatkich bir uchdan | the exponent is one third |
| `show.1.2` | возведём ответ в куб | javobni kubga ko'taramiz | let us cube the answer |
| `show.2.1` | ищем число, чей куб равен восьми | kubi sakkizga teng sonni izlaymiz | we look for the number whose cube is eight |
| `show.2.2` | деление такого числа не даёт | bo'lish bunday sonni bermaydi | division does not give such a number |
| `audio.mount` | Теперь дробный показатель. Восемь в степени одна третья. | Endi kasr ko'rsatkich. Sakkiz bir uchdan darajada. | Now a fractional exponent. Eight to the power one third. |
| `audio.root*` | Возведём ответ в куб. Показатель одна третья, взятый три раза, даёт единицу, значит слева останется восемь. Получилось так: нужно число, куб которого равен восьми, а это двойка. Теперь проверим догадку, что дробь означает деление. Восемь разделить на три это два целых шестьдесят семь сотых, и куб этого числа равен девятнадцати, а не восьми. Значит дробный показатель это корень. | Javobni kubga ko'taramiz. Bir uchdan ko'rsatkich uch marta olinsa bir beradi, demak chapda sakkiz qoladi. Shunday chiqdi: kubi sakkizga teng son kerak, u esa ikki. Endi kasr bo'lishni bildiradi degan taxminni tekshiramiz. Sakkiz uchga bo'linsa ikki butun oltmish yetti yuzdan bo'ladi, va bu sonning kubi sakkiz emas, o'n to'qqiz. Demak kasr ko'rsatkich bu ildiz. | Let us cube the answer. One third taken three times gives one, so eight is left on the left side. It came out like this: we need the number whose cube is eight, and that is two. Now let us test the guess that the fraction means division. Eight divided by three is two point six seven, and the cube of that number is nineteen, not eight. So a fractional exponent is a root. |
| `audio.work` | Посчитай сам. Чему равно восемь в степени одна третья? | O'zingiz hisoblang. Sakkiz bir uchdan darajada nechaga teng? | Work it out yourself. What is eight to the power one third? |
| `work.prompt` | Чему равно восемь в степени одна третья? | Sakkiz bir uchdan darajada nechaga teng? | What is eight to the power one third? |
| `work.ok` | Два. Куб двойки равен восьми, поэтому дробный показатель это корень, а не деление. | Ikki. Ikkining kubi sakkizga teng, shuning uchun kasr ko'rsatkich bu ildiz, bo'lish emas. | Two. The cube of two is eight, so a fractional exponent is a root, not a division. |
| `work.hint.1` | Возведи ответ в куб и посмотри, что останется слева. | Javobni kubga ko'taring va chapda nima qolishini ko'ring. | Cube the answer and see what is left on the left side. |
| `work.hint.2` | Ищи число, куб которого равен восьми. | Kubi sakkizga teng sonni izlang. | Look for the number whose cube is eight. |
| `work.hint.3` | Два. | Ikki. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `8^{1/3} = ?` |
| `show.2.3` | `2³ = 8` |
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `irracionalnyy-ne-chislo`

Свидетель урока: полоса сужается, и `2√2` остаётся снаружи.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Показатель бывает иррациональным | Ko'rsatkich irratsional ham bo'ladi | The exponent can be irrational |
| `show.1.1` | показатель между единицей и двойкой | ko'rsatkich bir va ikki orasida | the exponent is between one and two |
| `show.1.2` | значит значение между двумя и четырьмя | demak qiymat ikki va to'rt orasida | so the value is between two and four |
| `show.2.1` | уточняем показатель, полоса сужается | ko'rsatkichni aniqlaymiz, polosa torayadi | we refine the exponent, the band narrows |
| `show.2.2` | два корня из двух остались снаружи | ikki ildiz ikki tashqarida qoldi | two root two stayed outside |
| `audio.mount` | Корень из двух это один и сорок один сотых, и дальше без конца. Такой показатель тоже годится. | Ikkining ildizi bu bir butun qirq bir yuzdan, va keyin cheksiz davom etadi. Bunday ko'rsatkich ham yaraydi. | The root of two is one point four one and on without end. Such an exponent works too. |
| `audio.squeeze*` | Корень из двух лежит между единицей и двойкой, значит наше число лежит между двумя и четырьмя. Уточним показатель до десятых, и полоса сузится. Уточним до сотых, и внутри останется почти одно число. Теперь посмотри на два корня из двух. Это правый конец первой полосы, и после сужения он оказался снаружи. Значит наше число ему не равно, хотя записи похожи. | Ikkining ildizi bir va ikki orasida yotadi, demak bizning son ikki va to'rt orasida. Ko'rsatkichni o'ndan birgacha aniqlaymiz, va polosa torayadi. Yuzdan birgacha aniqlaymiz, va ichida deyarli bitta son qoladi. Endi ikki ildiz ikkiga qarang. Bu birinchi polosaning o'ng cheti, va torayishdan keyin u tashqarida qoldi. Demak bizning son unga teng emas, yozuvlari o'xshash bo'lsa ham. | The root of two lies between one and two, so our number lies between two and four. Let us refine the exponent to tenths and the band narrows. Refine to hundredths and almost one number is left inside. Now look at two root two. That is the right edge of the first band, and after the narrowing it ended up outside. So our number is not equal to it, however similar the readings look. |
| `audio.work` | Посчитай сам. Какая первая цифра после запятой у этого числа? | O'zingiz hisoblang. Bu sonning vergulidan keyingi birinchi raqami qaysi? | Work it out yourself. What is the first digit after the decimal point of this number? |
| `work.prompt` | Какая первая цифра после запятой? | Vergulidan keyingi birinchi raqam qaysi? | What is the first digit after the decimal point? |
| `work.ok` | Шесть. Оба конца полосы начинаются с двух целых шести десятых, значит и число тоже. | Olti. Polosaning ikkala cheti ikki butun olti o'ndan bilan boshlanadi, demak son ham shunday. | Six. Both edges of the band start with two point six, so the number does too. |
| `work.hint.1` | Посмотри, между какими делениями лежит узкая полоса. | Tor polosa qaysi bo'linmalar orasida yotganini ko'ring. | Look at which marks the narrow band lies between. |
| `work.hint.2` | Оба её конца начинаются одинаково. | Uning ikkala cheti bir xil boshlanadi. | Both of its edges start the same way. |
| `work.hint.3` | Шесть. | Olti. | Six. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2¹ = 2    2² = 4` |
| `show.2.3` | `2^{1,41} … 2^{1,42}` |
| `work.answer` | `6` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `osnova-lyubaya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Какое основание годится | Qanday asos yaraydi | Which base works |
| `probe.question` | Какое основание берут у степени с любым действительным показателем? | Har qanday haqiqiy ko'rsatkichli daraja uchun qanday asos olinadi? | Which base is taken for a power with any real exponent? |
| `probe.a` [верно] | положительное и не равное единице | musbat va birga teng bo'lmagan | positive and not equal to one |
| `probe.b` | любое, кроме нуля | noldan boshqa har qanday | any except zero |
| `probe.b.hint` | Проверь минус четыре и показатель одна вторая. Квадрат любого числа неотрицателен, значит числа нет. | Minus to'rt va bir ikkidan ko'rsatkichni tekshiring. Har qanday sonning kvadrati manfiy emas, demak bunday son yo'q. | Check minus four with the exponent one half. The square of any number is not negative, so no such number exists. |
| `rule.lawLabel` | Степень | Daraja | The power |
| `rule.lines.1` | Показатели складываются при умножении и перемножаются при возведении в степень. | Ko'rsatkichlar ko'paytirishda qo'shiladi, darajaga ko'tarishda ko'paytiriladi. | Exponents add when multiplying and multiply when raising to a power. |
| `rule.lines.2` | Нулевой показатель даёт единицу, отрицательный переворачивает дробь, дробный означает корень. | Nol ko'rsatkich bir beradi, manfiy kasrni teskari qiladi, kasr esa ildizni bildiradi. | A zero exponent gives one, a negative one turns the fraction over, a fractional one means a root. |
| `rule.lines.3` | Основание положительно и не равно единице: иначе дробный показатель числа не даёт. | Asos musbat va birga teng emas: aks holda kasr ko'rsatkich son bermaydi. | The base is positive and not one: otherwise a fractional exponent gives no number. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidadan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Полоса квадратов остаётся на экране, и правило открывается рядом. Основание берут положительным не по договору, а потому, что на полосе видно: слева квадратов нет, и корня из минус четырёх нет тоже. | Kvadratlar polosasi ekranda qoladi, va qoida yonida ochiladi. Asos musbat olinishi kelishuv bo'yicha emas, chunki polosada ko'rinadi: chapda kvadratlar yo'q, minus to'rtning ildizi ham yo'q. | The band of squares stays on the screen and the rule opens beside it. The base is taken positive not by agreement but because the band shows it: there are no squares on the left, and no root of minus four either. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a^{m/n} = ⁿ√(a^m),   a > 0` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `drobnyy-kak-delenie`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Запись и её значение | Yozuv va uning qiymati | A reading and its value |
| `match.prompt` | Соедини запись со значением. | Yozuvni qiymati bilan birlashtiring. | Match each reading with its value. |
| `match.ok` | Дробный показатель это корень, отрицательный переворачивает дробь, нулевой даёт единицу. Основание при этом не меняется. | Kasr ko'rsatkich bu ildiz, manfiy kasrni teskari qiladi, nol esa bir beradi. Asos bunda o'zgarmaydi. | A fractional exponent is a root, a negative one turns the fraction over, a zero one gives one. The base does not change. |
| `audio.mount` | Четыре записи и четыре значения. Соедини их. | To'rt yozuv va to'rt qiymat. Ularni birlashtiring. | Four readings and four values. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `8^{1/3}` · `2^{−3}` · `5⁰` · `9^{1/2}` |
| `match.a` | `2` |
| `match.b` | `1/8` |
| `match.c` | `1` |
| `match.d` | `3` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `stepen-po-analogii`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Перепиши по шагам | Qadam bilan qaytadan yozing | Rewrite it step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | умножить показатели | ko'rsatkichlarni ko'paytirish | multiply the exponents |
| `order.s2` | показатель стал целым | ko'rsatkich butun bo'ldi | the exponent became whole |
| `order.s3` | сложить показатели | ko'rsatkichlarni qo'shish | add the exponents |
| `order.s4` | ноль даёт единицу | nol bir beradi | zero gives one |
| `order.ok` | Показатели дали ноль, а нулевой показатель это единица. | Ko'rsatkichlar nol berdi, nol ko'rsatkich esa bir. | The exponents gave zero, and a zero exponent is one. |
| `order.bad` | Сначала степень в степень, потом умножение, потом нулевой показатель. | Avval daraja darajaga, keyin ko'paytirish, keyin nol ko'rsatkich. | First the power of a power, then the multiplication, then the zero exponent. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `(a^{2/3})⁶·a^{−4}` |
| `order.mark` | `1` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без полосы | Polosasiz hisoblang | Compute without the band |
| `task.ok` | Четыре. Минус в показателе перевернул дробь, а две третьих дали квадрат кубического корня. | To'rt. Ko'rsatkichdagi minus kasrni teskari qildi, ikki uchdan esa kub ildizning kvadratini berdi. | Four. The minus in the exponent turned the fraction over, and two thirds gave the square of the cube root. |
| `task.hint.1` | Сначала убери минус, перевернув дробь. | Avval kasrni teskari qilib minusni oling. | First remove the minus by turning the fraction over. |
| `task.hint.2` | Потом дробный показатель прочитай как корень. | Keyin kasr ko'rsatkichni ildiz deb o'qing. | Then read the fractional exponent as a root. |
| `task.hint.3` | Четыре. | To'rt. | Four. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какая запись меньше? | Qaysi yozuv kichikroq? | Which reading is smaller? |
| `order.ok` | Основание больше единицы, поэтому чем больше показатель, тем больше значение. | Asos birdan katta, shuning uchun ko'rsatkich qancha katta bo'lsa, qiymat ham shuncha katta. | The base is greater than one, so the bigger the exponent the bigger the value. |
| `order.bad` | Переведи каждую запись в число, потом сравнивай. | Har yozuvni songa o'tkazing, keyin solishtiring. | Turn each reading into a number, then compare. |
| `audio.mount` | На этом экране полосы нет. На экзамене её тоже не будет. | Bu ekranda polosa yo'q. Imtihonda ham bo'lmaydi. | There is no band on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `(1/8)^{−2/3}   →   ?` |
| `task.answer` | `4` |
| `order.items` | `2^{−2}` · `2⁰` · `2^{1/2}` · `2²` |
| `order.answer` | `2^{−2}  2⁰  2^{1/2}  2²` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob xato. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r3` | Это верное следствие предыдущей строки. | Bu oldingi qatorning to'g'ri natijasi. | This is a correct consequence of the previous line. |
| `hint.r4` | Число здесь посчитано по предыдущей строке верно. | Bu yerda son oldingi qator bo'yicha to'g'ri hisoblangan. | The number here is computed correctly from the previous line. |
| `proof` | Здесь показатели перемножили при отрицательном основании, а это правило требует положительного. | Bu yerda manfiy asosda ko'rsatkichlar ko'paytirildi, bu qoida esa musbat asosni talab qiladi. | Here the exponents were multiplied with a negative base, and that rule requires a positive one. |
| `entry.prompt` | Чему равно это выражение на самом деле? | Bu ifoda haqiqatda nechaga teng? | What does this expression actually equal? |
| `entry.ok` | Два. Сначала квадрат даёт четыре, и только потом берут корень. | Ikki. Avval kvadrat to'rt beradi, va faqat keyin ildiz olinadi. | Two. First the square gives four, and only then the root is taken. |
| `entry.hint.1` | Посчитай по действиям, начиная с внутреннего. | Ichkisidan boshlab amallar bo'yicha hisoblang. | Compute action by action, starting from the inner one. |
| `entry.hint.2` | Минус два в квадрате это четыре. | Minus ikki kvadratda bu to'rt. | Minus two squared is four. |
| `entry.hint.3` | Два. | Ikki. | Two. |
| `audio.mount` | Задача. Найти значение выражения, где отрицательное число сначала возводят в квадрат. | Masala. Manfiy son avval kvadratga ko'tarilgan ifodaning qiymatini topish. | A task. Find the value of an expression where a negative number is squared first. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `((−2)²)^{1/2}` |
| `row.r2` | `(−2)^{2·1/2}` |
| `row.r3` | `(−2)¹` |
| `row.r4` | `−2` |
| `answerId` | `r2` |
| `entry.answer` | `2` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Значение дано, найди показатель | Qiymat berilgan, ko'rsatkichni toping | The value is given, find the exponent |
| `entry.prompt` | При основании три какой показатель даёт одну девятую? | Asos uch bo'lganda qaysi ko'rsatkich bir to'qqizdan beradi? | With base three, which exponent gives one ninth? |
| `entry.ok` | Минус два. Квадрат тройки это девять, а минус переворачивает дробь. | Minus ikki. Uchning kvadrati to'qqiz, minus esa kasrni teskari qiladi. | Minus two. Three squared is nine, and the minus turns the fraction over. |
| `entry.hint.1` | Сначала подумай, какая степень тройки равна девяти. | Avval uchning qaysi darajasi to'qqizga teng ekanini o'ylang. | First think which power of three equals nine. |
| `entry.hint.2` | Потом сделай из девяти одну девятую. | Keyin to'qqizdan bir to'qqizdan yasang. | Then turn nine into one ninth. |
| `entry.hint.3` | Минус два. | Minus ikki. | Minus two. |
| `multi.prompt` | Отметь все записи, значение которых равно одной девятой. | Qiymati bir to'qqizdan bo'lgan hamma yozuvni belgilang. | Mark every reading whose value is one ninth. |
| `multi.title` | У каких записей значение равно одной девятой? | Qaysi yozuvlarning qiymati bir to'qqizdan? | Which readings have the value one ninth? |
| `multi.c.hint` | Это корень из трёх, он больше единицы. | Bu uchning ildizi, u birdan katta. | That is the root of three, it is greater than one. |
| `multi.d.hint` | Это одна восьмая: основание здесь двойка, а не тройка. | Bu bir sakkizdan: asos bu yerda ikki, uch emas. | That is one eighth: the base here is two, not three. |
| `multi.ok` | Две из четырёх. Одно и то же значение записывается разными основаниями. | To'rttadan ikkitasi. Bir xil qiymat har xil asoslar bilan yoziladi. | Two out of four. The same value is written with different bases. |
| `audio.mount` | Теперь обратная задача. Значение дано, а найти надо показатель. | Endi teskari masala. Qiymat berilgan, ko'rsatkichni topish kerak. | Now the inverse task. The value is given, and the exponent must be found. |
| `audio.work` | Сначала запиши показатель, потом отметишь все записи с этим значением. | Avval ko'rsatkichni yozing, keyin shu qiymatli hamma yozuvni belgilaysiz. | First type the exponent, then you will mark every reading with that value. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.answer` | `−2` |
| `multi.a` [верно] | `3^{−2}` |
| `multi.b` [верно] | `9^{−1}` |
| `multi.c` | `3^{1/2}` |
| `multi.d` | `2^{−3}` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `drobnyy-kak-delenie`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Что делают с показателями при умножении степеней? | Darajalarni ko'paytirishda ko'rsatkichlar nima qilinadi? | What happens to the exponents when powers are multiplied? |
| `q1.a` [верно] | складывают | qo'shiladi | they are added |
| `q1.b` | перемножают | ko'paytiriladi | they are multiplied |
| `q1.b.hint` | Перемножают при возведении степени в степень. Здесь записи ставят рядом. | Darajani darajaga ko'tarishda ko'paytiriladi. Bu yerda yozuvlar yonma-yon qo'yiladi. | They are multiplied when a power is raised to a power. Here the readings stand side by side. |
| `q1.c` | делят | bo'linadi | they are divided |
| `q1.c.hint` | Деление уменьшает показатель, а умножение множители дописывает. | Bo'lish ko'rsatkichni kamaytiradi, ko'paytirish esa ko'paytuvchilarni qo'shadi. | Division lowers the exponent, multiplication appends factors. |
| `q1.d` | ничего | hech narsa | nothing |
| `q1.d.hint` | Множителей стало больше, значит показатель изменился. | Ko'paytuvchilar ko'paydi, demak ko'rsatkich o'zgardi. | There are more factors now, so the exponent changed. |
| `q2.prompt` | Чему равно пять в нулевой степени? | Besh nol darajada nechaga teng? | What is five to the zero power? |
| `q2.a` [верно] | единица | bir | one |
| `q2.b` | ноль | nol | zero |
| `q2.b.hint` | Спустись по лестнице: после пятёрки идёт не ноль, а единица. | Zinapoyadan tushing: beshdan keyin nol emas, bir keladi. | Walk down the ladder: after five comes one, not zero. |
| `q2.c` | пять | besh | five |
| `q2.c.hint` | Пять это первая степень, а нулевая на шаг ниже. | Besh bu birinchi daraja, nol esa bir qadam pastda. | Five is the first power, and the zero one is a step below. |
| `q2.d` | такой записи нет | bunday yozuv yo'q | there is no such reading |
| `q2.d.hint` | Есть: лестница вниз проходит через нулевой показатель. | Bor: zinapoya pastga nol ko'rsatkich orqali o'tadi. | There is: the ladder down passes through the zero exponent. |
| `q3.prompt` | Что означает дробный показатель? | Kasr ko'rsatkich nimani bildiradi? | What does a fractional exponent mean? |
| `q3.a` [верно] | корень | ildiz | a root |
| `q3.a.ok` | Да. Знаменатель показателя говорит, какой корень берут. | Ha. Ko'rsatkichning maxraji qanday ildiz olinishini aytadi. | Yes. The denominator of the exponent says which root is taken. |
| `q3.b` | деление основания | asosni bo'lish | dividing the base |
| `q3.b.hint` | Восемь разделить на три в куб даёт девятнадцать, а не восемь. | Sakkiz uchga bo'linib kubga ko'tarilsa sakkiz emas, o'n to'qqiz beradi. | Eight divided by three, cubed, gives nineteen, not eight. |
| `q3.c` | умножение основания | asosni ko'paytirish | multiplying the base |
| `q3.c.hint` | Умножение увеличило бы число, а корень его уменьшает. | Ko'paytirish sonni kattalashtirardi, ildiz esa kichraytiradi. | Multiplying would make the number bigger, a root makes it smaller. |
| `q3.d` | ничего | hech narsa | nothing |
| `q3.d.hint` | Значение у записи есть, и его можно проверить обратным действием. | Yozuvning qiymati bor, va uni teskari amal bilan tekshirish mumkin. | The reading has a value, and it can be checked by the inverse action. |
| `q4.prompt` | Каким берут основание степени с любым показателем? | Har qanday ko'rsatkichli darajaning asosi qanday olinadi? | Which base is taken for a power with any exponent? |
| `q4.a` [верно] | положительным и не равным единице | musbat va birga teng bo'lmagan | positive and not equal to one |
| `q4.b` | любым | har qanday | any |
| `q4.b.hint` | У минус четырёх и показателя одна вторая числа нет. | Minus to'rt va bir ikkidan ko'rsatkichda son yo'q. | With minus four and the exponent one half there is no number. |
| `q4.c` | только целым | faqat butun | only a whole number |
| `q4.c.hint` | Основание бывает и дробным, лишь бы положительным. | Asos kasr ham bo'ladi, faqat musbat bo'lsa. | The base can be fractional too, as long as it is positive. |
| `q4.d` | отрицательным | manfiy | negative |
| `q4.d.hint` | Как раз наоборот: у отрицательного дробный показатель не работает. | Aksincha: manfiyda kasr ko'rsatkich ishlamaydi. | Just the opposite: with a negative one a fractional exponent does not work. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `a^m·a^n = a^{m+n}` |
| `q2.done` | `5⁰ = 1` |
| `q3.done` | `a^{1/n} = ⁿ√a` |
| `q4.done` | `a > 0,  a ≠ 1` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Складываю показатели при умножении и перемножаю при возведении в степень | Ko'paytirishda ko'rsatkichlarni qo'shaman, darajaga ko'tarishda ko'paytiraman | I add exponents when multiplying and multiply them when raising to a power |
| `can.2` | Получаю нулевой и отрицательный показатель по лестнице | Nol va manfiy ko'rsatkichni zinapoya bilan chiqaraman | I get the zero and negative exponents from the ladder |
| `can.3` | Дробный показатель читаю как корень и проверяю обратным действием | Kasr ko'rsatkichni ildiz deb o'qiyman va teskari amal bilan tekshiraman | I read a fractional exponent as a root and check it by the inverse action |
| `can.4` | Знаю, почему основание берут положительным | Asos nega musbat olinishini bilaman | I know why the base is taken positive |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: дробный показатель. | Bitta joy takrorlashni talab qiladi: kasr ko'rsatkich. | One place needs review: the fractional exponent. |
| `levels.back` | Вернись к правилу и к экрану 6. | Qoidaga va 6-ekranga qayting. | Go back to the rule and to screen 6. |
| `bridge` | Дальше показатель станет переменной, и та же запись превратится в функцию. | Keyin ko'rsatkich o'zgaruvchi bo'ladi, va o'sha yozuv funksiyaga aylanadi. | Next the exponent becomes a variable, and the same reading turns into a function. |
| `lifehack` | Забыл правило для нулевого показателя — спустись по лестнице, деля на основание. | Nol ko'rsatkich qoidasini esdan chiqardingizmi, asosga bo'lib zinapoyadan tushing. | Forgot the rule for the zero exponent, walk down the ladder dividing by the base. |
| `sheetTitle` | Степень · шпаргалка | Daraja · shpargalka | The power · cheat sheet |
| `sheetSrc` | 10 класс · урок 26 | 10-sinf · 26-dars | Grade 10 · lesson 26 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija. | At the start you had to choose one of two readings. Here is the result. |
| `audio.next` | Минус в показателе переворачивает дробь, а знак числа не меняет. | Ko'rsatkichdagi minus kasrni teskari qiladi, sonning ishorasini o'zgartirmaydi. | The minus in the exponent turns the fraction over and does not change the sign of the number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `−8` |
| `hook.b` | `1/8` |
| `proved` | `1/8` |
| `law` | `a^{−n} = 1/a^n` |
| `sheet.1` | `a^m·a^n = a^{m+n}` |
| `sheet.2` | `(a^m)^n = a^{m·n}` |
| `sheet.3` | `a⁰ = 1` |
| `sheet.4` | `a^{−n} = 1/a^n` |
| `sheet.5` | `a^{m/n} = ⁿ√(a^m)` |
