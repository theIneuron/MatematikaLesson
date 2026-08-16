# Урок 28 — Показат. уравнения · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS26_28_SKELET.md` §9. Опора в учебнике: алгебра 2022, стр. 99–101, параграф
`KO'RSATKICHLI TENGLAMALAR`.

**Главное решение урока.** Приведение к одному основанию — это переписывание из урока 26, но у
него появилась цель: сделать показатели сравнимыми. Право сравнить их даёт монотонность из урока
27, а не «основание сократилось». Поэтому свидетель урока — горизонталь: сколько встреч с кривой,
столько корней. У положительного уровня встреча одна, у нулевого и отрицательного встреч нет
вовсе, и это видно до вычислений.

**Связка с блоком 2 названа прямо.** У тригонометрического уравнения корней бесконечно много,
потому что функция периодическая. Здесь корень один, потому что функция монотонная. Одна и та же
причина, прочитанная в двух направлениях, и на экране 2 она произносится.

**Прибор ОДЗ не нужен.** План ставит уроку «прибор 2 плюс прибор 5», но у показательного
уравнения области допустимых значений нет: степень определена при любом показателе. Полоса ОДЗ
появляется с урока 31.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | УРАВНЕНИЕ | TENGLAMA | THE EQUATION |
| `title` | Как найти показатель | Ko'rsatkichni qanday topish | How to find the exponent |
| `row.a.name` | делим восемь на два | sakkizni ikkiga bo'lamiz | we divide eight by two |
| `row.b.name` | пишем восемь степенью двойки | sakkizni ikkining darajasi qilib yozamiz | we write eight as a power of two |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проведём горизонталь и посмотрим, где она встретит кривую. | Javobingiz yozib olindi. Endi gorizontal o'tkazamiz va uni egri chiziqni qayerda uchratishini ko'ramiz. | Your answer is saved. Now we will draw a horizontal and see where it meets the curve. |
| `audio.mount` | Кривая знакомая, с прошлого урока. Теперь у неё спрашивают: при каком икс значение равно восьми. | Egri chiziq tanish, o'tgan darsdan. Endi undan so'raladi: qaysi iksda qiymat sakkizga teng. | The curve is familiar from the previous lesson. Now it is asked: at which x is the value eight. |
| `audio.r1` | Первая запись говорит, что показатель находят делением правой части на основание. | Birinchi yozuv ko'rsatkich o'ng qismni asosga bo'lish bilan topiladi deydi. | The first reading says the exponent is found by dividing the right side by the base. |
| `audio.r2` | Вторая говорит, что правую часть надо записать степенью того же основания. | Ikkinchisi o'ng qismni o'sha asosning darajasi qilib yozish kerak deydi. | The second says the right side must be written as a power of the same base. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `2^x = 8` |
| `row.a.value` | `x = 4` |
| `row.b.value` | `x = 3` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед уравнением | Tenglamadan oldin uch savol | Three questions before the equation |
| `q1.prompt` | Как записать восемь степенью двойки? | Sakkizni ikkining darajasi qilib qanday yozish kerak? | How is eight written as a power of two? |
| `q1.a` [верно] | два в третьей | ikki uchinchi darajada | two to the third |
| `q1.b` | два в четвёртой | ikki to'rtinchi darajada | two to the fourth |
| `q1.b.hint` | Два в четвёртой это шестнадцать. Посчитай множители. | Ikki to'rtinchi darajada bu o'n olti. Ko'paytuvchilarni sanang. | Two to the fourth is sixteen. Count the factors. |
| `q1.c` | три во второй | uch ikkinchi darajada | three to the second |
| `q1.c.hint` | Три во второй это девять, и основание здесь другое. | Uch ikkinchi darajada bu to'qqiz, va asos bu yerda boshqa. | Three to the second is nine, and the base here is different. |
| `q1.d` | четыре во второй | to'rt ikkinchi darajada | four to the second |
| `q1.d.hint` | Четыре во второй это шестнадцать, и основание не двойка. | To'rt ikkinchi darajada bu o'n olti, va asos ikki emas. | Four to the second is sixteen, and the base is not two. |
| `q2.prompt` | Может ли два в степени икс быть отрицательным? | Ikki iks darajada manfiy bo'lishi mumkinmi? | Can two to the x be negative? |
| `q2.a` [верно] | нет, никогда | yo'q, hech qachon | no, never |
| `q2.b` | да, при отрицательном показателе | ha, manfiy ko'rsatkichda | yes, with a negative exponent |
| `q2.b.hint` | Отрицательный показатель даёт маленькое положительное число, а не отрицательное. | Manfiy ko'rsatkich manfiy emas, kichik musbat son beradi. | A negative exponent gives a small positive number, not a negative one. |
| `q2.c` | да, при дробном | ha, kasr ko'rsatkichda | yes, with a fractional one |
| `q2.c.hint` | Дробный показатель это корень, и он тоже положителен. | Kasr ko'rsatkich bu ildiz, u ham musbat. | A fractional exponent is a root, and it is positive too. |
| `q2.d` | да, при нулевом | ha, nol ko'rsatkichda | yes, with a zero one |
| `q2.d.hint` | Нулевой показатель даёт единицу. | Nol ko'rsatkich bir beradi. | A zero exponent gives one. |
| `q3.prompt` | Куда идёт кривая при основании два? | Asos ikki bo'lganda egri chiziq qayoqqa ketadi? | Which way does the curve go with base two? |
| `q3.a` [верно] | вверх и не возвращается | yuqoriga va qaytmaydi | up, and it does not come back |
| `q3.b` | вверх, потом вниз | yuqoriga, keyin pastga | up, then down |
| `q3.b.hint` | Это была бы волна. У показательной кривой поворота нет. | Bu to'lqin bo'lardi. Ko'rsatkichli egri chiziqda burilish yo'q. | That would be a wave. An exponential curve has no turn. |
| `q3.c` | вниз | pastga | down |
| `q3.c.hint` | Вниз идёт кривая при основании меньше единицы. | Asos birdan kichik bo'lganda egri chiziq pastga ketadi. | The curve goes down when the base is less than one. |
| `q3.d` | по прямой | to'g'ri chiziq bo'yicha | along a straight line |
| `q3.d.hint` | Прямая получается только при основании, равном единице. | To'g'ri chiziq faqat asos birga teng bo'lganda chiqadi. | A straight line comes only from a base equal to one. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |
| `audio.link` | И одно наблюдение. В блоке про тригонометрию корней было бесконечно много, потому что функция периодическая. Здесь корень будет один, потому что функция монотонная. Причина одна и та же, прочитанная в разные стороны. | Va bitta kuzatish. Trigonometriya blokida ildizlar cheksiz ko'p edi, chunki funksiya davriy. Bu yerda ildiz bitta bo'ladi, chunki funksiya monoton. Sabab bir xil, faqat har xil tomondan o'qilgan. | And one observation. In the trigonometry block there were infinitely many roots because the function is periodic. Here there will be one root because the function is monotone. The same reason read in opposite directions. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `8 = 2³` |
| `q2.done` | `2^x > 0` |
| `q3.done` | `a > 1   →   ↑` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `delyat-vmesto-osnovaniya`

Свидетель урока: горизонталь встречает кривую ровно один раз.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Корней столько, сколько встреч | Ildizlar soni uchrashuvlar soniga teng | As many roots as meetings |
| `show.1.1` | проводим горизонталь на уровне восьми | sakkiz darajasida gorizontal o'tkazamiz | we draw a horizontal at the level eight |
| `show.1.2` | она встречает кривую один раз | u egri chiziqni bir marta uchratadi | it meets the curve once |
| `show.2.1` | кривая идёт вверх и не возвращается | egri chiziq yuqoriga ketadi va qaytmaydi | the curve goes up and does not come back |
| `show.2.2` | значит корень один | demak ildiz bitta | so there is one root |
| `audio.mount` | Решить уравнение значит найти икс, при котором значение равно восьми. | Tenglamani yechish bu qiymati sakkizga teng bo'lgan iksni topish. | To solve the equation means to find the x at which the value is eight. |
| `audio.meet*` | Проведём горизонталь на уровне восьми. Она встречает кривую ровно один раз, и встреча приходится на икс, равный трём. Один раз, а не два, потому что кривая монотонна: она идёт вверх и не возвращается ни разу. Значит у показательного уравнения корень один, и это следствие прошлого урока, а не новое правило. | Sakkiz darajasida gorizontal o'tkazamiz. U egri chiziqni aynan bir marta uchratadi, va uchrashuv iks uchga teng joyga tushadi. Bir marta, ikki emas, chunki egri chiziq monoton: u yuqoriga ketadi va bir marta ham qaytmaydi. Demak ko'rsatkichli tenglamada ildiz bitta, va bu yangi qoida emas, o'tgan darsning natijasi. | Let us draw a horizontal at the level eight. It meets the curve exactly once, and the meeting falls at x equal to three. Once, not twice, because the curve is monotone: it goes up and never comes back. So an exponential equation has one root, and that follows from the previous lesson rather than being a new rule. |
| `audio.work` | Посчитай сам. Сколько раз горизонталь встретила кривую? | O'zingiz hisoblang. Gorizontal egri chiziqni necha marta uchratdi? | Work it out yourself. How many times did the horizontal meet the curve? |
| `work.prompt` | Сколько раз горизонталь встретила кривую? | Gorizontal egri chiziqni necha marta uchratdi? | How many times did the horizontal meet the curve? |
| `work.ok` | Один. Кривая идёт вверх и не возвращается, поэтому второй встречи быть не может. | Bir. Egri chiziq yuqoriga ketadi va qaytmaydi, shuning uchun ikkinchi uchrashuv bo'lishi mumkin emas. | Once. The curve goes up and does not come back, so a second meeting is impossible. |
| `work.hint.1` | Посчитай точки, где горизонталь пересекла кривую. | Gorizontal egri chiziqni kesgan nuqtalarni sanang. | Count the points where the horizontal crossed the curve. |
| `work.hint.2` | Кривая ни разу не поворачивает назад. | Egri chiziq bir marta ham orqaga burilmaydi. | The curve never turns back. |
| `work.hint.3` | Один. | Bir. | Once. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2^x = 8` |
| `show.2.3` | `x = 3` |
| `work.answer` | `1` |

---

## Экран 4 · `explain2` · ответ `order` · тег `delyat-vmesto-osnovaniya`

Разграничение: делить нельзя, приводить можно.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Делить нельзя, приводить можно | Bo'lish mumkin emas, keltirish mumkin | Dividing is out, reducing is in |
| `show.1.1` | делением получилось бы четыре | bo'lish bilan to'rt chiqardi | dividing would give four |
| `show.1.2` | подставим четвёрку и проверим | to'rtni qo'yib tekshiramiz | let us substitute four and check |
| `show.2.1` | вышло шестнадцать, а нужно восемь | o'n olti chiqdi, sakkiz kerak edi | sixteen came out, and eight was needed |
| `show.2.2` | значит правую часть переписывают | demak o'ng qism qaytadan yoziladi | so the right side gets rewritten |
| `audio.mount` | Проверим первую запись с начала урока. Восемь разделить на два это четыре. | Dars boshidagi birinchi yozuvni tekshiramiz. Sakkiz ikkiga bo'linsa to'rt bo'ladi. | Let us check the first reading from the start of the lesson. Eight divided by two is four. |
| `audio.check*` | Подставим четвёрку в показатель. Два в четвёртой степени это шестнадцать, а нужно было восемь. Значит деление тут не работает совсем: показатель это не множитель, и делением его не получают. Работает другое. Восемь само записывается степенью двойки, и тогда слева и справа стоит одно основание. | To'rtni ko'rsatkichga qo'yamiz. Ikki to'rtinchi darajada bu o'n olti, sakkiz kerak edi. Demak bo'lish bu yerda umuman ishlamaydi: ko'rsatkich ko'paytuvchi emas, va u bo'lish bilan olinmaydi. Boshqa narsa ishlaydi. Sakkizning o'zi ikkining darajasi qilib yoziladi, va shunda chapda ham o'ngda ham bitta asos turadi. | Let us substitute four into the exponent. Two to the fourth is sixteen, and eight was needed. So dividing does not work here at all: the exponent is not a factor and is not obtained by division. Something else works. Eight itself can be written as a power of two, and then the same base stands on both sides. |
| `audio.work` | Расставь шаги, как решается такое уравнение. | Bunday tenglama qanday yechilsa, qadamlarni shunday joylashtiring. | Put the steps in the order such an equation is solved. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | правую часть пишем степенью того же основания | o'ng qismni o'sha asosning darajasi qilib yozamiz | write the right side as a power of the same base |
| `order.s2` | слева и справа одно основание | chapda va o'ngda bitta asos | the same base on both sides |
| `order.s3` | сравниваем показатели | ko'rsatkichlarni solishtiramiz | compare the exponents |
| `order.s4` | получаем корень | ildizni olamiz | get the root |
| `order.ok` | Порядок такой всегда. Деления в нём нет ни на одном шаге. | Tartib doim shunday. Unda bo'lish birorta qadamda ham yo'q. | The order is always this. There is no division at any step. |
| `order.bad` | Сначала переписать правую часть, потом сравнить показатели. | Avval o'ng qismni qaytadan yozish, keyin ko'rsatkichlarni solishtirish. | First rewrite the right side, then compare the exponents. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `8 : 2 = 4` |
| `show.2.3` | `2⁴ = 16` |
| `order.mark` | `x = 3` |

---

## Экран 5 · `explain3` · ответ `order` · тег `delyat-vmesto-osnovaniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Одно основание, потом показатели | Bitta asos, keyin ko'rsatkichlar | One base first, then the exponents |
| `show.1.1` | основания разные, но связаны | asoslar har xil, lekin bog'liq | the bases differ but are related |
| `show.1.2` | четвёрка это два в квадрате | to'rt bu ikki kvadratda | four is two squared |
| `show.2.1` | основания стали одинаковыми | asoslar bir xil bo'ldi | the bases became the same |
| `show.2.2` | остаётся сравнить показатели | ko'rsatkichlarni solishtirish qoladi | comparing the exponents is what is left |
| `audio.mount` | Теперь основания разные. Слева четыре, справа два. | Endi asoslar har xil. Chapda to'rt, o'ngda ikki. | Now the bases differ. Four on the left, two on the right. |
| `audio.same*` | Четвёрка это два в квадрате, значит слева получается два в степени два икс. Основания стали одинаковыми, и остаётся сравнить показатели. Право сравнить их даёт монотонность: у одного значения только один показатель, потому что кривая проходит через каждый уровень ровно один раз. Два икс равно икс плюс один, отсюда икс равен единице. | To'rt bu ikki kvadratda, demak chapda ikki ikki iks darajada chiqadi. Asoslar bir xil bo'ldi, va ko'rsatkichlarni solishtirish qoladi. Solishtirish huquqini monotonlik beradi: bitta qiymatga faqat bitta ko'rsatkich mos, chunki egri chiziq har darajadan aynan bir marta o'tadi. Ikki iks iks qo'shuv birga teng, shundan iks birga teng. | Four is two squared, so on the left we get two to the two x. The bases became the same, and comparing the exponents is what is left. The right to compare them comes from monotonicity: one value has only one exponent, because the curve passes each level exactly once. Two x equals x plus one, so x equals one. |
| `audio.work` | Расставь шаги, как решается уравнение с разными основаниями. | Har xil asosli tenglama qanday yechilsa, qadamlarni shunday joylashtiring. | Put the steps in the order an equation with different bases is solved. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | оба основания сводим к двойке | ikkala asosni ikkiga keltiramiz | reduce both bases to two |
| `order.s2` | показатели приравниваем | ko'rsatkichlarni tenglashtiramiz | set the exponents equal |
| `order.s3` | решаем обычное уравнение | oddiy tenglamani yechamiz | solve the ordinary equation |
| `order.s4` | корень один | ildiz bitta | one root |
| `order.ok` | Основания приводят к одному, и дальше уравнение обычное. Монотонность разрешает сравнить показатели. | Asoslar bittaga keltiriladi, keyin tenglama oddiy bo'ladi. Monotonlik ko'rsatkichlarni solishtirishga ruxsat beradi. | The bases are reduced to one, and then the equation is an ordinary one. Monotonicity allows comparing the exponents. |
| `order.bad` | Сначала одно основание, потом показатели, потом решение. | Avval bitta asos, keyin ko'rsatkichlar, keyin yechim. | First one base, then the exponents, then the solution. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `4^x = 2^{x+1}` |
| `show.2.3` | `2^{2x} = 2^{x+1}` |
| `order.mark` | `x = 1` |

---

## Экран 6 · `explain4` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Замена сводит к квадратному | Almashtirish kvadratga keltiradi | A substitution reduces it to a quadratic |
| `show.1.1` | в уравнении две степени | tenglamada ikki daraja | the equation has two powers |
| `show.1.2` | одна из них квадрат другой | biri ikkinchisining kvadrati | one of them is the square of the other |
| `show.2.1` | замена даёт квадратное уравнение | almashtirish kvadrat tenglama beradi | the substitution gives a quadratic |
| `show.2.2` | отрицательное значение отбрасывают | manfiy qiymat tashlanadi | the negative value is dropped |
| `audio.mount` | Возьмём уравнение, где степеней две. Четыре в степени икс и два в степени икс. | Ikki daraja bo'lgan tenglamani olamiz. To'rt iks darajada va ikki iks darajada. | Take an equation with two powers. Four to the x and two to the x. |
| `audio.sub*` | Четыре в степени икс это квадрат двух в степени икс. Обозначим два в степени икс буквой тэ, и получится обычное квадратное уравнение. Его корни четыре и минус один. Минус один отбрасываем: два в степени икс положительно при любом икс, отрицательным оно не бывает никогда. Остаётся четвёрка, и из неё икс равен двум. | To'rt iks darajada bu ikki iks darajaning kvadrati. Ikki iks darajani te harfi bilan belgilaymiz, va oddiy kvadrat tenglama chiqadi. Uning ildizlari to'rt va minus bir. Minus birni tashlaymiz: ikki iks darajada har qanday iksda musbat, u hech qachon manfiy bo'lmaydi. To'rt qoladi, va undan iks ikkiga teng. | Four to the x is the square of two to the x. Let us call two to the x by the letter t, and an ordinary quadratic appears. Its roots are four and minus one. We drop minus one: two to the x is positive for every x and is never negative. Four is left, and from it x equals two. |
| `audio.work` | Посчитай сам. Сколько корней замены годится? | O'zingiz hisoblang. Almashtirishning nechta ildizi yaraydi? | Work it out yourself. How many roots of the substitution fit? |
| `work.prompt` | Сколько корней замены годится? | Almashtirishning nechta ildizi yaraydi? | How many roots of the substitution fit? |
| `work.ok` | Один. Минус единица не годится: степень двойки отрицательной не бывает. | Bitta. Minus bir yaramaydi: ikkining darajasi manfiy bo'lmaydi. | One. Minus one does not fit: a power of two is never negative. |
| `work.hint.1` | Проверь каждый корень замены на знак. | Almashtirishning har ildizini ishorasi bo'yicha tekshiring. | Check the sign of each root of the substitution. |
| `work.hint.2` | Значение замены это степень двойки, а она положительна. | Almashtirish qiymati bu ikkining darajasi, u esa musbat. | The substituted value is a power of two, and that is positive. |
| `work.hint.3` | Один. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `4^x − 3·2^x − 4 = 0` |
| `show.2.3` | `t² − 3t − 4 = 0` |
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `net-resheniy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Когда встреч не бывает | Uchrashuv bo'lmaydigan hol | When there are no meetings |
| `show.1.1` | опускаем горизонталь под ось | gorizontalni o'q ostiga tushiramiz | we lower the horizontal below the axis |
| `show.1.2` | она проходит ниже кривой | u egri chiziqdan pastda o'tadi | it passes below the curve |
| `show.2.1` | встреч нет ни одной | birorta uchrashuv yo'q | there is not a single meeting |
| `show.2.2` | значит корней нет | demak ildiz yo'q | so there are no roots |
| `audio.mount` | Опустим горизонталь под ось, на уровень минус четыре. | Gorizontalni o'q ostiga, minus to'rt darajasiga tushiramiz. | Let us lower the horizontal below the axis, to the level minus four. |
| `audio.none*` | Она проходит ниже кривой и не встречает её нигде. Значит корней нет, и это видно до всяких вычислений. Поднимем горизонталь ровно на ноль. Она совпадает с асимптотой и тоже не встречает кривую. Поэтому уравнения, где справа ноль или отрицательное число, решений не имеют, и правая часть проверяется первой. | U egri chiziqdan pastda o'tadi va uni hech qayerda uchratmaydi. Demak ildiz yo'q, va bu har qanday hisobdan oldin ko'rinadi. Gorizontalni aynan nolga ko'taramiz. U asimptota bilan ustma-ust tushadi va u ham egri chiziqni uchratmaydi. Shuning uchun o'ng qismida nol yoki manfiy son bo'lgan tenglamalarning yechimi yo'q, va o'ng qism birinchi tekshiriladi. | It passes below the curve and meets it nowhere. So there are no roots, and this is visible before any computation. Let us raise the horizontal to exactly zero. It coincides with the asymptote and does not meet the curve either. So equations with zero or a negative number on the right have no solutions, and the right side is what gets checked first. |
| `audio.work` | Посчитай сам. Сколько корней у этого уравнения? | O'zingiz hisoblang. Bu tenglamada nechta ildiz bor? | Work it out yourself. How many roots does this equation have? |
| `work.prompt` | Сколько корней у этого уравнения? | Bu tenglamada nechta ildiz bor? | How many roots does this equation have? |
| `work.ok` | Ни одного. Множество значений это положительные числа, а справа стоит отрицательное. | Birortasi ham. Qiymatlar to'plami musbat sonlar, o'ngda esa manfiy son turadi. | None. The range is the positive numbers, and a negative one stands on the right. |
| `work.hint.1` | Посмотри, встречает ли горизонталь кривую хоть где-нибудь. | Gorizontal egri chiziqni biror joyda uchratadimi, qarang. | Look whether the horizontal meets the curve anywhere at all. |
| `work.hint.2` | Кривая целиком выше оси, а горизонталь ниже. | Egri chiziq butunlay o'qdan yuqorida, gorizontal esa pastda. | The curve lies entirely above the axis, and the horizontal below. |
| `work.hint.3` | Ни одного. | Birortasi ham. | None. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2^x = −4` |
| `show.2.3` | `∅` |
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `delyat-vmesto-osnovaniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Показательное уравнение | Ko'rsatkichli tenglama | The exponential equation |
| `probe.question` | Почему из равенства степеней можно приравнять показатели? | Nega darajalarning tengligidan ko'rsatkichlarni tenglashtirish mumkin? | Why may the exponents be set equal when the powers are equal? |
| `probe.a` [верно] | функция монотонна: одному значению один показатель | funksiya monoton: bitta qiymatga bitta ko'rsatkich | the function is monotone: one value, one exponent |
| `probe.b` | основание сокращается | asos qisqaradi | the base cancels out |
| `probe.b.hint` | Основание не сокращают: это не множитель. Право сравнить даёт монотонность кривой. | Asos qisqartirilmaydi: u ko'paytuvchi emas. Solishtirish huquqini egri chiziqning monotonligi beradi. | The base is not cancelled: it is not a factor. The right to compare comes from the monotonicity of the curve. |
| `rule.lawLabel` | Правило | Qoida | The rule |
| `rule.lines.1` | Уравнение, в показателе которого стоит неизвестное, называют показательным. | Ko'rsatkichida noma'lum turgan tenglama ko'rsatkichli tenglama deyiladi. | An equation whose exponent holds the unknown is called exponential. |
| `rule.lines.2` | Если основание положительно и не равно единице, показатели равны. | Asos musbat va birga teng bo'lmasa, ko'rsatkichlar teng bo'ladi. | If the base is positive and not one, the exponents are equal. |
| `rule.lines.3` | Если справа ноль или отрицательное число, корней нет. | O'ngda nol yoki manfiy son bo'lsa, ildiz yo'q. | If the right side is zero or negative, there are no roots. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidadan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Горизонталь остаётся на экране, и правило открывается рядом. Показатели приравнивают не потому, что основание куда-то ушло, а потому, что кривая проходит через каждое значение ровно один раз. | Gorizontal ekranda qoladi, va qoida yonida ochiladi. Ko'rsatkichlar asos qayoqqadir ketgani uchun emas, egri chiziq har qiymatdan aynan bir marta o'tgani uchun tenglashtiriladi. | The horizontal stays on the screen and the rule opens beside it. The exponents are set equal not because the base went away but because the curve passes each value exactly once. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `a^{f(x)} = a^{g(x)}   →   f(x) = g(x)` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `delyat-vmesto-osnovaniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Уравнение и его корень | Tenglama va uning ildizi | An equation and its root |
| `match.prompt` | Соедини уравнение с его корнем. | Tenglamani ildizi bilan birlashtiring. | Match each equation with its root. |
| `match.ok` | Каждое уравнение сводится к одному основанию, и дальше сравниваются показатели. Корень бывает и дробным, и отрицательным, и нулём. | Har tenglama bitta asosga keltiriladi, keyin ko'rsatkichlar solishtiriladi. Ildiz kasr ham, manfiy ham, nol ham bo'ladi. | Every equation reduces to one base, and then the exponents are compared. A root can be fractional, negative, or zero. |
| `audio.mount` | Четыре уравнения и четыре корня. Соедини их. | To'rt tenglama va to'rt ildiz. Ularni birlashtiring. | Four equations and four roots. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `2^x = 32` · `3^x = 1/3` · `5^x = 1` · `4^x = 2` |
| `match.a` | `5` |
| `match.b` | `−1` |
| `match.c` | `0` |
| `match.d` | `1/2` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `delyat-vmesto-osnovaniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Реши по шагам | Qadam bilan yeching | Solve it step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | девять это три в квадрате | to'qqiz bu uch kvadratda | nine is three squared |
| `order.s2` | раскрыть показатель | ko'rsatkichni ochish | expand the exponent |
| `order.s3` | приравнять показатели | ko'rsatkichlarni tenglashtirish | set the exponents equal |
| `order.s4` | получить корень | ildizni olish | get the root |
| `order.ok` | Оба основания сведены к тройке, и дальше уравнение обычное. Корень равен трём. | Ikkala asos uchga keltirildi, keyin tenglama oddiy. Ildiz uchga teng. | Both bases are reduced to three, and then the equation is an ordinary one. The root is three. |
| `order.bad` | Сначала одно основание, потом раскрыть показатель, потом приравнять. | Avval bitta asos, keyin ko'rsatkichni ochish, keyin tenglashtirish. | First one base, then expand the exponent, then set them equal. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `9^{x−1} = 3^{x+1}` |
| `order.mark` | `x = 3` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Реши без чертежа | Chizmasiz yeching | Solve it without a drawing |
| `task.ok` | Минус три. Одна вторая это два в минус первой, значит слева стоит два в степени минус икс. | Minus uch. Bir ikkidan bu ikki minus birinchi darajada, demak chapda ikki minus iks darajada turadi. | Minus three. One half is two to the minus first, so on the left stands two to the minus x. |
| `task.hint.1` | Запиши одну вторую степенью двойки. | Bir ikkidanni ikkining darajasi qilib yozing. | Write one half as a power of two. |
| `task.hint.2` | Слева получится два в степени минус икс. | Chapda ikki minus iks darajada chiqadi. | On the left you get two to the minus x. |
| `task.hint.3` | Минус три. | Minus uch. | Minus three. |
| `order.prompt` | Расставь уравнения по возрастанию корня. | Tenglamalarni ildizining o'sishi bo'yicha joylashtiring. | Arrange the equations by increasing root. |
| `order.title` | У какого уравнения корень меньше? | Qaysi tenglamaning ildizi kichikroq? | Which equation has the smaller root? |
| `order.ok` | Основание больше единицы, поэтому чем больше правая часть, тем больше корень. | Asos birdan katta, shuning uchun o'ng qism qancha katta bo'lsa, ildiz ham shuncha katta. | The base is greater than one, so the bigger the right side the bigger the root. |
| `order.bad` | Найди корень каждого уравнения, потом сравнивай. | Har tenglamaning ildizini toping, keyin solishtiring. | Find the root of each equation, then compare. |
| `audio.mount` | На этом экране чертежа нет. На экзамене его тоже не будет. | Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi. | There is no drawing on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `(1/2)^x = 8   →   x = ?` |
| `task.answer` | `−3` |
| `order.items` | `2^x = 1/4` · `2^x = 1` · `2^x = 2` · `2^x = 8` |
| `order.answer` | `2^x = 1/4  2^x = 1  2^x = 2  2^x = 8` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неполный. Где? | Javob to'liq emas. Qayerda? | The answer is incomplete. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r2` | Четыре это два в квадрате, строка верна. | To'rt bu ikki kvadratda, qator to'g'ri. | Four is two squared, the line is right. |
| `hint.r3` | Показатели приравнены верно. | Ko'rsatkichlar to'g'ri tenglashtirilgan. | The exponents are set equal correctly. |
| `proof` | Здесь обе части поделили на икс, и корень ноль исчез. | Bu yerda ikkala qism iksga bo'lindi, va nol ildiz yo'qoldi. | Here both sides were divided by x, and the root zero vanished. |
| `entry.prompt` | Какой корень потерян? | Qaysi ildiz yo'qolgan? | Which root is lost? |
| `entry.ok` | Ноль. При нуле обе части равны единице, значит это тоже корень. | Nol. Nolda ikkala qism birga teng, demak bu ham ildiz. | Zero. At zero both sides equal one, so it is a root too. |
| `entry.hint.1` | Реши последнее уравнение, не деля на икс. | Oxirgi tenglamani iksga bo'lmasdan yeching. | Solve the last equation without dividing by x. |
| `entry.hint.2` | Вынеси икс за скобку и приравняй каждый множитель нулю. | Iksni qavsdan chiqaring va har ko'paytuvchini nolga tenglashtiring. | Factor x out and set each factor to zero. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `audio.mount` | Задача. Решить уравнение, где показатель слева это икс в квадрате. | Masala. Chapda ko'rsatkich iks kvadratda bo'lgan tenglamani yechish. | A task. Solve an equation where the exponent on the left is x squared. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `2^{x²} = 4^x` |
| `row.r2` | `2^{x²} = 2^{2x}` |
| `row.r3` | `x² = 2x` |
| `row.r4` | `x = 2` |
| `answerId` | `r4` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По корню собери уравнение | Ildiz bo'yicha tenglama yasang | From a root back to the equation |
| `entry.prompt` | Основание пять, корень три. Чему равна правая часть? | Asos besh, ildiz uch. O'ng qism nechaga teng? | The base is five, the root is three. What is the right side? |
| `entry.ok` | Сто двадцать пять. Это пять в кубе, и другого корня у такого уравнения нет. | Bir yuz yigirma besh. Bu besh kubda, va bunday tenglamada boshqa ildiz yo'q. | One hundred twenty five. That is five cubed, and such an equation has no other root. |
| `entry.hint.1` | Подставь тройку в показатель. | Ko'rsatkichga uchni qo'ying. | Substitute three into the exponent. |
| `entry.hint.2` | Пять в кубе. | Besh kubda. | Five cubed. |
| `entry.hint.3` | Сто двадцать пять. | Bir yuz yigirma besh. | One hundred twenty five. |
| `multi.prompt` | Отметь все уравнения, у которых корень равен двум. | Ildizi ikkiga teng hamma tenglamani belgilang. | Mark every equation whose root is two. |
| `multi.title` | У каких уравнений корень равен двум? | Qaysi tenglamalarning ildizi ikkiga teng? | Which equations have the root two? |
| `multi.c.hint` | Восемь это два в кубе, значит корень равен трём. | Sakkiz bu ikki kubda, demak ildiz uchga teng. | Eight is two cubed, so the root is three. |
| `multi.d.hint` | Основание меньше единицы, и корень получается отрицательным. | Asos birdan kichik, va ildiz manfiy chiqadi. | The base is less than one, and the root comes out negative. |
| `multi.ok` | Две из четырёх. Одно и то же число бывает корнем разных уравнений. | To'rttadan ikkitasi. Bir xil son har xil tenglamalarning ildizi bo'ladi. | Two out of four. The same number can be the root of different equations. |
| `audio.mount` | Теперь обратная задача. Корень известен, собрать надо уравнение. | Endi teskari masala. Ildiz ma'lum, tenglamani yasash kerak. | Now the inverse task. The root is known, and the equation must be built. |
| `audio.work` | Сначала запиши правую часть, потом отметишь все уравнения с корнем два. | Avval o'ng qismni yozing, keyin ildizi ikki bo'lgan hamma tenglamani belgilaysiz. | First type the right side, then you will mark every equation with root two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.answer` | `125` |
| `multi.a` [верно] | `2^x = 4` |
| `multi.b` [верно] | `9^x = 81` |
| `multi.c` | `2^x = 8` |
| `multi.d` | `(1/2)^x = 4` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `delyat-vmesto-osnovaniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Как решают уравнение, где слева и справа одно основание? | Chapda va o'ngda bitta asos bo'lgan tenglama qanday yechiladi? | How is an equation with the same base on both sides solved? |
| `q1.a` [верно] | приравнивают показатели | ko'rsatkichlarni tenglashtiradilar | the exponents are set equal |
| `q1.b` | делят правую часть на основание | o'ng qismni asosga bo'ladilar | the right side is divided by the base |
| `q1.b.hint` | Проверь подстановкой: восемь на два это четыре, а два в четвёртой шестнадцать. | Qo'yib tekshiring: sakkiz ikkiga bo'linsa to'rt, ikki to'rtinchi darajada esa o'n olti. | Check by substitution: eight over two is four, and two to the fourth is sixteen. |
| `q1.c` | вычитают основания | asoslarni ayiradilar | the bases are subtracted |
| `q1.c.hint` | Основания одинаковые, вычитать нечего. | Asoslar bir xil, ayiradigan narsa yo'q. | The bases are the same, there is nothing to subtract. |
| `q1.d` | возводят обе части в квадрат | ikkala qismni kvadratga ko'taradilar | both sides are squared |
| `q1.d.hint` | Квадрат ничего не упростит: показатели просто удвоятся. | Kvadrat hech narsani soddalashtirmaydi: ko'rsatkichlar shunchaki ikkilanadi. | Squaring simplifies nothing: the exponents just double. |
| `q2.prompt` | Сколько корней у уравнения два в степени икс равно восьми? | Ikki iks darajada sakkizga teng tenglamada nechta ildiz bor? | How many roots does two to the x equals eight have? |
| `q2.a` [верно] | один | bitta | one |
| `q2.b` | два | ikkita | two |
| `q2.b.hint` | Два было бы у волны. Показательная кривая назад не поворачивает. | Ikkita to'lqinda bo'lardi. Ko'rsatkichli egri chiziq orqaga burilmaydi. | Two would happen for a wave. An exponential curve never turns back. |
| `q2.c` | ни одного | birortasi ham | none |
| `q2.c.hint` | Восемь положительно, значит горизонталь кривую встречает. | Sakkiz musbat, demak gorizontal egri chiziqni uchratadi. | Eight is positive, so the horizontal does meet the curve. |
| `q2.d` | бесконечно много | cheksiz ko'p | infinitely many |
| `q2.d.hint` | Бесконечно много бывает у периодической функции, а эта монотонна. | Cheksiz ko'p davriy funksiyada bo'ladi, bu esa monoton. | Infinitely many happens for a periodic function, and this one is monotone. |
| `q3.prompt` | Сколько корней у уравнения два в степени икс равно минус четырём? | Ikki iks darajada minus to'rtga teng tenglamada nechta ildiz bor? | How many roots does two to the x equals minus four have? |
| `q3.a` [верно] | ни одного | birortasi ham | none |
| `q3.a.ok` | Да. Горизонталь ниже кривой, и встреч у них нет. | Ha. Gorizontal egri chiziqdan pastda, va uchrashuvlari yo'q. | Yes. The horizontal is below the curve, and they have no meetings. |
| `q3.b` | один | bitta | one |
| `q3.b.hint` | Для одного корня правая часть должна быть положительной. | Bitta ildiz uchun o'ng qism musbat bo'lishi kerak. | For one root the right side must be positive. |
| `q3.c` | два | ikkita | two |
| `q3.c.hint` | Кривая целиком выше оси, а горизонталь ниже. | Egri chiziq butunlay o'qdan yuqorida, gorizontal esa pastda. | The curve lies entirely above the axis, and the horizontal below. |
| `q3.d` | минус два | minus ikki | minus two |
| `q3.d.hint` | Спросили число корней, а не их значение. | Savol ildizlar soni haqida, qiymati haqida emas. | The question was the number of roots, not their value. |
| `q4.prompt` | Что проверяют после замены? | Almashtirishdan keyin nima tekshiriladi? | What is checked after a substitution? |
| `q4.a` [верно] | что значение замены положительно | almashtirish qiymati musbatligini | that the substituted value is positive |
| `q4.b` | ничего | hech narsa | nothing |
| `q4.b.hint` | Тогда в ответ попадёт значение, которого степень не даёт. | Unda javobga daraja bermaydigan qiymat tushadi. | Then a value that no power gives will get into the answer. |
| `q4.c` | что оно целое | butunligini | that it is a whole number |
| `q4.c.hint` | Дробное значение замены годится, лишь бы положительное. | Almashtirishning kasr qiymati ham yaraydi, faqat musbat bo'lsa. | A fractional substituted value is fine, as long as it is positive. |
| `q4.d` | что оно меньше единицы | birdan kichikligini | that it is less than one |
| `q4.d.hint` | Значение бывает и больше единицы: четвёрка на экране подошла. | Qiymat birdan katta ham bo'ladi: ekrandagi to'rt yaradi. | The value can exceed one: the four on the screen fitted. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `f(x) = g(x)` |
| `q2.done` | `x = 3` |
| `q3.done` | `∅` |
| `q4.done` | `t > 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Привожу уравнение к одному основанию | Tenglamani bitta asosga keltiraman | I reduce an equation to one base |
| `can.2` | Знаю, почему можно приравнять показатели | Ko'rsatkichlarni nega tenglashtirish mumkinligini bilaman | I know why the exponents may be set equal |
| `can.3` | Вижу по горизонтали, сколько будет корней | Gorizontal bo'yicha nechta ildiz bo'lishini ko'raman | I see from the horizontal how many roots there will be |
| `can.4` | Проверяю значение замены на положительность | Almashtirish qiymatini musbatligiga tekshiraman | I check the substituted value for positivity |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: замена и её проверка. | Bitta joy takrorlashni talab qiladi: almashtirish va uni tekshirish. | One place needs review: the substitution and its check. |
| `levels.back` | Вернись к правилу и к экрану 6. | Qoidaga va 6-ekranga qayting. | Go back to the rule and to screen 6. |
| `bridge` | Дальше неизвестным станет само основание, и появится логарифм. | Keyin noma'lum asosning o'zi bo'ladi, va logarifm paydo bo'ladi. | Next the base itself becomes the unknown, and the logarithm appears. |
| `lifehack` | Прежде чем решать, посмотри на правую часть. Ноль или отрицательное число означает, что корней нет. | Yechishdan oldin o'ng qismga qarang. Nol yoki manfiy son ildiz yo'qligini bildiradi. | Before solving, look at the right side. Zero or a negative number means there are no roots. |
| `sheetTitle` | Показательные уравнения · шпаргалка | Ko'rsatkichli tenglamalar · shpargalka | Exponential equations · cheat sheet |
| `sheetSrc` | 10 класс · урок 28 | 10-sinf · 28-dars | Grade 10 · lesson 28 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija. | At the start you had to choose one of two readings. Here is the result. |
| `audio.next` | Показатель делением не находят. Правую часть записывают степенью того же основания, и тогда показатели сравнивают напрямую. | Ko'rsatkich bo'lish bilan topilmaydi. O'ng qism o'sha asosning darajasi qilib yoziladi, va shunda ko'rsatkichlar to'g'ridan to'g'ri solishtiriladi. | The exponent is not found by dividing. The right side is written as a power of the same base, and then the exponents are compared directly. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `x = 4` |
| `hook.b` | `x = 3` |
| `proved` | `x = 3` |
| `law` | `a^{f(x)} = a^{g(x)}   →   f(x) = g(x)` |
| `sheet.1` | `2^x = 8   →   2^x = 2³` |
| `sheet.2` | `f(x) = g(x)` |
| `sheet.3` | `t = a^x,   t > 0` |
| `sheet.4` | `a^x = 0   →   ∅` |
| `sheet.5` | `a^x < 0   →   ∅` |
