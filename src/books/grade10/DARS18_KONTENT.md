# Урок 29 — Логарифм · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS29_31_SKELET.md` §7. Опора в учебнике: алгебра 2022, стр. 104–105 и 108–110.

**Главное решение урока.** Логарифм не вводится определением. Уравнение `2^x = 8` решено на
прошлом уроке: горизонталь встретила кривую один раз, встреча пришлась на тройку. Логарифм —
**имя для этой тройки**. Поэтому первый экран показывает тот же чертёж и ту же встречу, только
читают её теперь снизу вверх.

Свойства тоже не заучиваются: при умножении степеней показатели складываются (урок 26), значит
логарифм произведения это сумма логарифмов. Отсюда же видно, почему `log(a + b)` не раскрывается —
для суммы степеней правила нет вовсе.

**Полоса допустимых значений появляется здесь впервые**, на экране 7, и в мягком виде: она просто
показывает, где логарифм существует. Полную работу она получает на уроке 31.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОГАРИФМ | LOGARIFM | THE LOGARITHM |
| `title` | Логарифм произведения | Ko'paytmaning logarifmi | The logarithm of a product |
| `row.a.name` | логарифмы перемножаются | logarifmlar ko'paytiriladi | the logarithms multiply |
| `row.b.name` | логарифмы складываются | logarifmlar qo'shiladi | the logarithms add up |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посмотрим, откуда логарифм берётся, и правило выйдет само. | Javobingiz yozib olindi. Endi logarifm qayerdan kelishini ko'ramiz, va qoida o'zi chiqadi. | Your answer is saved. Now we will see where the logarithm comes from, and the rule will come out on its own. |
| `audio.mount` | Слева произведение под знаком логарифма. Справа два ответа, пять и шесть. Верен ровно один. | Chapda logarifm belgisi ostida ko'paytma. O'ngda ikki javob, besh va olti. Aynan bittasi to'g'ri. | On the left a product under the logarithm sign. On the right two answers, five and six. Exactly one is correct. |
| `audio.r1` | Первая запись говорит, что логарифм произведения это произведение логарифмов. | Birinchi yozuv ko'paytmaning logarifmi logarifmlarning ko'paytmasi deydi. | The first reading says the logarithm of a product is the product of the logarithms. |
| `audio.r2` | Вторая говорит, что это их сумма. | Ikkinchisi bu ularning yig'indisi deydi. | The second says it is their sum. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `log₂ (4·8)` |
| `row.a.value` | `6` |
| `row.b.value` | `5` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из прошлых уроков | O'tgan darslardan uch savol | Three questions from the previous lessons |
| `q1.prompt` | Как записать восемь степенью двойки? | Sakkizni ikkining darajasi qilib qanday yozish kerak? | How is eight written as a power of two? |
| `q1.a` [верно] | два в третьей | ikki uchinchi darajada | two to the third |
| `q1.b` | два в четвёртой | ikki to'rtinchi darajada | two to the fourth |
| `q1.b.hint` | Два в четвёртой это шестнадцать. Посчитай множители. | Ikki to'rtinchi darajada bu o'n olti. Ko'paytuvchilarni sanang. | Two to the fourth is sixteen. Count the factors. |
| `q1.c` | четыре во второй | to'rt ikkinchi darajada | four to the second |
| `q1.c.hint` | Значение верное, но основание здесь четвёрка, а спросили про двойку. | Qiymat to'g'ri, lekin asos bu yerda to'rt, savol esa ikki haqida. | The value is right, but the base here is four, and the question was about two. |
| `q1.d` | три во второй | uch ikkinchi darajada | three to the second |
| `q1.d.hint` | Три во второй это девять. | Uch ikkinchi darajada bu to'qqiz. | Three to the second is nine. |
| `q2.prompt` | Чему равен корень уравнения два в степени икс равно восьми? | Ikki iks darajada sakkizga teng tenglamaning ildizi nechaga teng? | What is the root of two to the x equals eight? |
| `q2.a` [верно] | три | uch | three |
| `q2.b` | четыре | to'rt | four |
| `q2.b.hint` | Четыре вышло бы делением, а показатель делением не находят. | To'rt bo'lish bilan chiqardi, ko'rsatkich esa bo'lish bilan topilmaydi. | Four would come from dividing, and the exponent is not found by dividing. |
| `q2.c` | шестнадцать | o'n olti | sixteen |
| `q2.c.hint` | Шестнадцать это значение, а спросили про показатель. | O'n olti bu qiymat, savol esa ko'rsatkich haqida. | Sixteen is a value, and the question was about the exponent. |
| `q2.d` | корней нет | ildiz yo'q | there are no roots |
| `q2.d.hint` | Восемь положительно, значит горизонталь кривую встречает. | Sakkiz musbat, demak gorizontal egri chiziqni uchratadi. | Eight is positive, so the horizontal does meet the curve. |
| `q3.prompt` | Что делают с показателями при умножении степеней? | Darajalarni ko'paytirishda ko'rsatkichlar nima qilinadi? | What happens to the exponents when powers are multiplied? |
| `q3.a` [верно] | складывают | qo'shiladi | they are added |
| `q3.b` | перемножают | ko'paytiriladi | they are multiplied |
| `q3.b.hint` | Перемножают при возведении степени в степень. | Darajani darajaga ko'tarishda ko'paytiriladi. | They are multiplied when a power is raised to a power. |
| `q3.c` | делят | bo'linadi | they are divided |
| `q3.c.hint` | Деление уменьшает показатель, а умножение множители дописывает. | Bo'lish ko'rsatkichni kamaytiradi, ko'paytirish esa ko'paytuvchilarni qo'shadi. | Division lowers the exponent, multiplication appends factors. |
| `q3.d` | ничего | hech narsa | nothing |
| `q3.d.hint` | Множителей стало больше, значит показатель изменился. | Ko'paytuvchilar ko'paydi, demak ko'rsatkich o'zgardi. | There are more factors now, so the exponent changed. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `8 = 2³` |
| `q2.done` | `x = 3` |
| `q3.done` | `a^m·a^n = a^{m+n}` |

---

## Экран 3 · `explain1` · ответ `number` · тег `delyat-vmesto-osnovaniya`

Свидетель урока: та же встреча, что на уроке 28, прочитанная снизу.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Логарифм это показатель | Logarifm bu ko'rsatkich | A logarithm is an exponent |
| `show.1.1` | горизонталь на уровне восьми | sakkiz darajasida gorizontal | a horizontal at the level eight |
| `show.1.2` | встреча пришлась на тройку | uchrashuv uchga to'g'ri keldi | the meeting fell at three |
| `show.2.1` | у этой тройки есть имя | bu uchning nomi bor | that three has a name |
| `show.2.2` | новой операции здесь нет | bu yerda yangi amal yo'q | there is no new operation here |
| `audio.mount` | Этот чертёж уже был. На прошлом уроке горизонталь на уровне восьми встретила кривую, и встреча пришлась на тройку. | Bu chizma allaqachon bor edi. O'tgan darsda sakkiz darajasidagi gorizontal egri chiziqni uchratdi, va uchrashuv uchga to'g'ri keldi. | This drawing has been here before. Last lesson a horizontal at the level eight met the curve, and the meeting fell at three. |
| `audio.read*` | Тогда мы спрашивали, при каком икс значение равно восьми, и отвечали тройкой. Сейчас вопрос тот же, но у ответа появилось имя. Тройка это логарифм восьми по основанию два. Логарифм не новая операция, а короткая запись для показателя, который уже нашли. | O'shanda qaysi iksda qiymat sakkizga teng deb so'ragan va uch deb javob bergan edik. Hozir savol o'sha, lekin javobning nomi paydo bo'ldi. Uch bu sakkizning ikki asosga ko'ra logarifmi. Logarifm yangi amal emas, allaqachon topilgan ko'rsatkich uchun qisqa yozuv. | Back then we asked at which x the value is eight and answered three. The question is the same now, but the answer has a name. Three is the logarithm of eight to base two. A logarithm is not a new operation but a short way to write an exponent we already found. |
| `audio.work` | Посчитай сам. Чему равен логарифм тридцати двух по основанию два? | O'zingiz hisoblang. O'ttiz ikkining ikki asosga ko'ra logarifmi nechaga teng? | Work it out yourself. What is the logarithm of thirty two to base two? |
| `work.prompt` | Чему равен логарифм тридцати двух по основанию два? | O'ttiz ikkining ikki asosga ko'ra logarifmi nechaga teng? | What is the logarithm of thirty two to base two? |
| `work.ok` | Пять. Двойка в пятой степени это тридцать два, и логарифм это как раз пятёрка. | Besh. Ikki beshinchi darajada bu o'ttiz ikki, logarifm esa aynan besh. | Five. Two to the fifth is thirty two, and the logarithm is exactly that five. |
| `work.hint.1` | Спроси себя, в какую степень возвести двойку, чтобы вышло тридцать два. | O'zingizdan so'rang: o'ttiz ikki chiqishi uchun ikkini qaysi darajaga ko'tarish kerak. | Ask yourself which power of two gives thirty two. |
| `work.hint.2` | Считай множители: два, четыре, восемь, шестнадцать, тридцать два. | Ko'paytuvchilarni sanang: ikki, to'rt, sakkiz, o'n olti, o'ttiz ikki. | Count the factors: two, four, eight, sixteen, thirty two. |
| `work.hint.3` | Пять. | Besh. | Five. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `2^x = 8   →   x = 3` |
| `show.2.3` | `log₂ 8 = 3` |
| `work.answer` | `5` |

---

## Экран 4 · `explain2` · ответ `number` · тег `osnovanie-i-argument-mestami`

Разграничение: основание внизу, и местами его менять нельзя.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Основание стоит внизу | Asos pastda turadi | The base stands below |
| `show.1.1` | внизу основание, рядом аргумент | pastda asos, yonida argument | the base below, the argument beside it |
| `show.1.2` | поменяем их местами | ularni joy almashtiramiz | let us swap them |
| `show.2.1` | значения получились разные | qiymatlar har xil chiqdi | the values came out different |
| `show.2.2` | три и одна треть | uch va bir uchdan | three and one third |
| `audio.mount` | В записи логарифма два числа. Внизу основание, рядом с ним аргумент. Их часто путают. | Logarifm yozuvida ikki son bor. Pastda asos, uning yonida argument. Ularni ko'p aralashtiriladi. | There are two numbers in a logarithm. The base below, the argument beside it. They are often mixed up. |
| `audio.swap*` | Посчитаем оба. В какую степень возвести двойку, чтобы вышло восемь. В третью, значит первое равно трём. Теперь наоборот: в какую степень возвести восьмёрку, чтобы вышла двойка. В одну третью, потому что кубический корень из восьми это два. Три и одна треть это разные числа, значит местами их менять нельзя. | Ikkalasini hisoblaymiz. Sakkiz chiqishi uchun ikkini qaysi darajaga ko'tarish kerak. Uchinchiga, demak birinchisi uchga teng. Endi teskarisi: ikki chiqishi uchun sakkizni qaysi darajaga ko'tarish kerak. Bir uchdanga, chunki sakkizning kub ildizi ikki. Uch va bir uchdan har xil sonlar, demak ularni joy almashtirish mumkin emas. | Let us compute both. Which power of two gives eight. The third, so the first equals three. Now the other way: which power of eight gives two. One third, because the cube root of eight is two. Three and one third are different numbers, so they must not be swapped. |
| `audio.work` | Посчитай сам. Чему равен логарифм двойки по основанию восемь? | O'zingiz hisoblang. Ikkining sakkiz asosga ko'ra logarifmi nechaga teng? | Work it out yourself. What is the logarithm of two to base eight? |
| `work.prompt` | Чему равен логарифм двойки по основанию восемь? | Ikkining sakkiz asosga ko'ra logarifmi nechaga teng? | What is the logarithm of two to base eight? |
| `work.ok` | Одна треть. Восемь в степени одна треть это кубический корень, а он равен двум. | Bir uchdan. Sakkiz bir uchdan darajada bu kub ildiz, u esa ikkiga teng. | One third. Eight to the power one third is the cube root, and that equals two. |
| `work.hint.1` | Основание здесь восьмёрка, а получить надо двойку. | Asos bu yerda sakkiz, olish kerak bo'lgani esa ikki. | The base here is eight, and two is what must come out. |
| `work.hint.2` | Дробный показатель разобран на уроке про степень. | Kasr ko'rsatkich daraja haqidagi darsda ko'rilgan. | The fractional exponent was covered in the lesson on powers. |
| `work.hint.3` | Одна треть. | Bir uchdan. | One third. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `log₂ 8 = 3` |
| `show.2.3` | `log₈ 2 = 1/3` |
| `work.answer` | `1/3` |

---

## Экран 5 · `explain3` · ответ `order` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Логарифм произведения | Ko'paytmaning logarifmi | The logarithm of a product |
| `show.1.1` | оба множителя это степени двойки | ikkala ko'paytuvchi ikkining darajasi | both factors are powers of two |
| `show.1.2` | при умножении показатели складываются | ko'paytirishda ko'rsatkichlar qo'shiladi | multiplying adds the exponents |
| `show.2.1` | а логарифм и есть показатель | logarifm esa ko'rsatkichning o'zi | and the logarithm is that exponent |
| `show.2.2` | значит логарифмы тоже складываются | demak logarifmlar ham qo'shiladi | so the logarithms add up too |
| `audio.mount` | Вернёмся к записи с начала урока. Четыре и восемь это степени двойки. | Dars boshidagi yozuvga qaytamiz. To'rt va sakkiz ikkining darajalari. | Back to the reading from the start of the lesson. Four and eight are powers of two. |
| `audio.sum*` | Перепишем оба множителя степенями. Четыре это два в квадрате, восемь это два в кубе. При умножении степеней показатели складываются, значит вместе получается два в пятой. Логарифм это и есть показатель, поэтому логарифм произведения равен сумме логарифмов. Заметь, что для суммы такого правила нет вовсе: сумму степеней в одну степень не собрать. | Ikkala ko'paytuvchini darajalar bilan qaytadan yozamiz. To'rt bu ikki kvadratda, sakkiz bu ikki kubda. Darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi, demak birgalikda ikki beshinchi darajada chiqadi. Logarifm ko'rsatkichning o'zi, shuning uchun ko'paytmaning logarifmi logarifmlar yig'indisiga teng. E'tibor bering: yig'indi uchun bunday qoida umuman yo'q, darajalar yig'indisini bitta darajaga yig'ib bo'lmaydi. | Let us rewrite both factors as powers. Four is two squared, eight is two cubed. Multiplying powers adds the exponents, so together we get two to the fifth. The logarithm is that exponent, so the logarithm of a product equals the sum of the logarithms. Notice there is no such rule for a sum: a sum of powers does not collapse into one power. |
| `audio.work` | Расставь шаги, как это правило получилось. | Bu qoida qanday chiqqan bo'lsa, qadamlarni joylashtiring. | Put the steps in the order this rule came out. |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | множители как степени | ko'paytuvchilar daraja bo'lib | the factors as powers |
| `order.s2` | показатели сложить | ko'rsatkichlarni qo'shish | add the exponents |
| `order.s3` | показатель это логарифм | ko'rsatkich bu logarifm | the exponent is the logarithm |
| `order.s4` | логарифмы сложить | logarifmlarni qo'shish | add the logarithms |
| `order.ok` | Правило вышло из свойства степени, а не из отдельного соглашения. | Qoida daraja xossasidan chiqdi, alohida kelishuvdan emas. | The rule came out of a property of powers, not from a separate agreement. |
| `order.bad` | Сначала множители степенями, потом показатели, потом логарифмы. | Avval ko'paytuvchilar daraja bo'lib, keyin ko'rsatkichlar, keyin logarifmlar. | First the factors as powers, then the exponents, then the logarithms. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `4·8 = 2²·2³` |
| `show.2.3` | `log₂ (4·8) = 2 + 3` |
| `order.mark` | `5` |

---

## Экран 6 · `explain4` · ответ `number` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Логарифм частного | Bo'linmaning logarifmi | The logarithm of a quotient |
| `show.1.1` | при делении степеней показатели вычитаются | darajalarni bo'lishda ko'rsatkichlar ayiriladi | dividing powers subtracts the exponents |
| `show.1.2` | значит логарифмы тоже | demak logarifmlar ham | so the logarithms do too |
| `show.2.1` | сам ход тот же | yo'l o'sha | the path is the same |
| `show.2.2` | новых правил не появилось | yangi qoida paydo bo'lmadi | no new rule appeared |
| `audio.mount` | Теперь деление. Тридцать два разделить на четыре. | Endi bo'lish. O'ttiz ikki to'rtga bo'linadi. | Now division. Thirty two divided by four. |
| `audio.dif*` | Тридцать два это два в пятой, четыре это два в квадрате. При делении степеней показатели вычитаются, значит остаётся два в третьей. Логарифм частного равен разности логарифмов, и вывод тот же самый, что минуту назад. Заучивать нечего: правило каждый раз выходит из свойства степени. | O'ttiz ikki bu ikki beshinchi darajada, to'rt bu ikki kvadratda. Darajalarni bo'lishda ko'rsatkichlar ayiriladi, demak ikki uchinchi darajada qoladi. Bo'linmaning logarifmi logarifmlar ayirmasiga teng, va xulosa bir daqiqa oldingining o'zi. Yodlaydigan narsa yo'q: qoida har safar daraja xossasidan chiqadi. | Thirty two is two to the fifth, four is two squared. Dividing powers subtracts the exponents, so two to the third is left. The logarithm of a quotient equals the difference of the logarithms, and the derivation is the same as a minute ago. There is nothing to memorise: the rule comes out of a property of powers every time. |
| `audio.work` | Посчитай сам. Чему равна разность логарифмов тридцати двух и четырёх по основанию два? | O'zingiz hisoblang. O'ttiz ikki va to'rtning ikki asosga ko'ra logarifmlari ayirmasi nechaga teng? | Work it out yourself. What is the difference of the logarithms of thirty two and four to base two? |
| `work.prompt` | Чему равна эта разность? | Bu ayirma nechaga teng? | What is this difference? |
| `work.ok` | Три. Пять минус два, и это логарифм восьми, потому что тридцать два делить на четыре это восемь. | Uch. Beshdan ikki ayirilgan, va bu sakkizning logarifmi, chunki o'ttiz ikki to'rtga bo'linsa sakkiz bo'ladi. | Three. Five minus two, and that is the logarithm of eight, because thirty two over four is eight. |
| `work.hint.1` | Посчитай каждый логарифм отдельно. | Har logarifmni alohida hisoblang. | Compute each logarithm separately. |
| `work.hint.2` | Тридцать два это два в пятой, четыре это два в квадрате. | O'ttiz ikki bu ikki beshinchi darajada, to'rt bu ikki kvadratda. | Thirty two is two to the fifth, four is two squared. |
| `work.hint.3` | Три. | Uch. | Three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `32 : 4 = 2⁵ : 2²` |
| `show.2.3` | `log₂ 32 − log₂ 4 = 3` |
| `work.answer` | `3` |

---

## Экран 7 · `explain5` · ответ `number` · тег `odz-logarifma`

Полоса допустимых значений появляется впервые.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Где логарифм существует | Logarifm qayerda mavjud | Where a logarithm exists |
| `show.1.1` | полоса под записью | yozuv tagida polosa | a band under the reading |
| `show.1.2` | закрашено, где логарифм есть | logarifm bor joy bo'yalgan | shaded where the logarithm exists |
| `show.2.1` | ноль и минус остались снаружи | nol va minus tashqarida qoldi | zero and the negatives stayed outside |
| `show.2.2` | степень двойки отрицательной не бывает | ikkining darajasi manfiy bo'lmaydi | a power of two is never negative |
| `audio.mount` | Под записью появилась полоса. На ней закрашено, где логарифм вообще существует. | Yozuv tagida polosa paydo bo'ldi. Unda logarifm umuman mavjud bo'lgan joy bo'yalgan. | A band appeared under the reading. It shows where the logarithm exists at all. |
| `audio.band*` | Логарифм это показатель степени, а степень двойки всегда положительна. Значит под знаком логарифма может стоять только положительное число. Ноль и отрицательные остаются вне закрашенного, и это не запрет, а следствие прошлого урока. Проверь границы: логарифм единицы равен нулю, потому что двойка в нулевой степени это единица. Логарифм самой двойки равен единице. | Logarifm bu darajaning ko'rsatkichi, ikkining darajasi esa doim musbat. Demak logarifm belgisi ostida faqat musbat son turishi mumkin. Nol va manfiylar bo'yalgan joydan tashqarida qoladi, va bu taqiq emas, o'tgan darsning natijasi. Chegaralarni tekshiring: birning logarifmi nolga teng, chunki ikki nol darajada bir bo'ladi. Ikkining o'zining logarifmi birga teng. | A logarithm is an exponent, and a power of two is always positive. So only a positive number can stand under the logarithm sign. Zero and the negatives stay outside the shading, and that is not a ban but a consequence of the previous lesson. Check the edges: the logarithm of one is zero, because two to the zero is one. The logarithm of two itself is one. |
| `audio.work` | Посчитай сам. Чему равен логарифм единицы по основанию два? | O'zingiz hisoblang. Birning ikki asosga ko'ra logarifmi nechaga teng? | Work it out yourself. What is the logarithm of one to base two? |
| `work.prompt` | Чему равен логарифм единицы по основанию два? | Birning ikki asosga ko'ra logarifmi nechaga teng? | What is the logarithm of one to base two? |
| `work.ok` | Ноль. Двойка в нулевой степени это единица, и логарифм это как раз тот нулевой показатель. | Nol. Ikki nol darajada bu bir, logarifm esa aynan o'sha nol ko'rsatkich. | Zero. Two to the zero power is one, and the logarithm is exactly that zero exponent. |
| `work.hint.1` | Спроси, в какую степень возвести двойку, чтобы вышла единица. | So'rang: bir chiqishi uchun ikkini qaysi darajaga ko'tarish kerak. | Ask which power of two gives one. |
| `work.hint.2` | Нулевой показатель разобран на уроке про степень. | Nol ko'rsatkich daraja haqidagi darsda ko'rilgan. | The zero exponent was covered in the lesson on powers. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `log₂ x,   x > 0` |
| `show.2.3` | `log₂ 1 = 0` |
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Логарифм | Logarifm | The logarithm |
| `probe.question` | Почему логарифм произведения это сумма? | Nega ko'paytmaning logarifmi yig'indi bo'ladi? | Why is the logarithm of a product a sum? |
| `probe.a` [верно] | при умножении степеней показатели складываются | darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi | multiplying powers adds the exponents |
| `probe.b` | так договорились | shunday kelishilgan | it was agreed so |
| `probe.b.hint` | Договора нет: правило вышло из свойства степени, и его можно вывести заново. | Kelishuv yo'q: qoida daraja xossasidan chiqdi, uni qaytadan chiqarish mumkin. | There is no agreement: the rule came out of a property of powers and can be derived again. |
| `rule.lawLabel` | Логарифм | Logarifm | The logarithm |
| `rule.lines.1` | Логарифмом числа бэ по основанию а называют показатель степени, в которую надо возвести а, чтобы получить бэ. | b sonning a asosga ko'ra logarifmi deb b ni hosil qilish uchun a ni ko'tarish kerak bo'lgan daraja ko'rsatkichiga aytiladi. | The logarithm of b to base a is the exponent a must be raised to in order to get b. |
| `rule.lines.2` | Логарифм произведения равен сумме логарифмов, частного их разности. | Ko'paytmaning logarifmi logarifmlar yig'indisiga, bo'linmaniki ayirmasiga teng. | The logarithm of a product is the sum of the logarithms, of a quotient their difference. |
| `rule.lines.3` | Под знаком логарифма стоит положительное число, а основание не равно единице. | Logarifm belgisi ostida musbat son turadi, asos esa birga teng emas. | A positive number stands under the sign, and the base is not one. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidadan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Чертёж остаётся на экране, и правило открывается рядом. Логарифм это показатель, и все его свойства получаются из свойств степени. Ни одно из них заучивать не надо: каждое выводится за две строки. | Chizma ekranda qoladi, va qoida yonida ochiladi. Logarifm bu ko'rsatkich, va uning hamma xossalari daraja xossalaridan chiqadi. Ularning birortasini yodlash shart emas: har biri ikki qatorda chiqariladi. | The drawing stays on the screen and the rule opens beside it. A logarithm is an exponent, and all its properties come from the properties of powers. None of them needs memorising: each is derived in two lines. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `logₐ (b·c) = logₐ b + logₐ c` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `osnovanie-i-argument-mestami`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Запись и её значение | Yozuv va uning qiymati | A reading and its value |
| `match.prompt` | Соедини запись со значением. | Yozuvni qiymati bilan birlashtiring. | Match each reading with its value. |
| `match.ok` | Основание внизу, и от него зависит всё. Одно и то же число при разных основаниях даёт разные логарифмы. | Asos pastda, va hammasi unga bog'liq. Bir xil son har xil asoslarda har xil logarifm beradi. | The base is below, and everything depends on it. The same number gives different logarithms with different bases. |
| `audio.mount` | Четыре записи и четыре значения. Соедини их. | To'rt yozuv va to'rt qiymat. Ularni birlashtiring. | Four readings and four values. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `log₂ 32` · `log₃ 9` · `log₈ 2` · `log₂ 1` |
| `match.a` | `5` |
| `match.b` | `2` |
| `match.c` | `1/3` |
| `match.d` | `0` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Перепиши по шагам | Qadam bilan qaytadan yozing | Rewrite it step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | разность в частное | ayirmani bo'linmaga | the difference into a quotient |
| `order.s2` | посчитать частное | bo'linmani hisoblash | compute the quotient |
| `order.s3` | восемь это два в кубе | sakkiz bu ikki kubda | eight is two cubed |
| `order.s4` | ответ три | javob uch | the answer is three |
| `order.ok` | Разность логарифмов свернулась в один логарифм, и дальше осталась арифметика. | Logarifmlar ayirmasi bitta logarifmga yig'ildi, keyin arifmetika qoldi. | The difference of logarithms folded into one, and arithmetic was all that remained. |
| `order.bad` | Сначала свернуть в частное, потом посчитать, потом узнать степень. | Avval bo'linmaga yig'ish, keyin hisoblash, keyin darajani bilish. | First fold into a quotient, then compute, then find the power. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `log₂ 24 − log₂ 3` |
| `order.mark` | `3` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Пять. Сумма логарифмов это логарифм произведения, а восемь на четыре это тридцать два. | Besh. Logarifmlar yig'indisi ko'paytmaning logarifmi, sakkiz kerra to'rt esa o'ttiz ikki. | Five. A sum of logarithms is the logarithm of the product, and eight times four is thirty two. |
| `task.hint.1` | Сверни сумму в один логарифм. | Yig'indini bitta logarifmga yig'ing. | Fold the sum into one logarithm. |
| `task.hint.2` | Под знаком окажется произведение восьми и четырёх. | Belgi ostida sakkiz va to'rtning ko'paytmasi qoladi. | Under the sign you get the product of eight and four. |
| `task.hint.3` | Пять. | Besh. | Five. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какая запись меньше? | Qaysi yozuv kichikroq? | Which reading is smaller? |
| `order.ok` | Основание одно, значит порядок аргументов и порядок логарифмов совпадают. | Asos bitta, demak argumentlar tartibi va logarifmlar tartibi bir xil. | The base is the same, so the order of the arguments and of the logarithms agree. |
| `order.bad` | Посчитай каждое значение, потом сравнивай. | Har qiymatni hisoblang, keyin solishtiring. | Compute each value, then compare. |
| `audio.mount` | На этом экране чертежа нет. На экзамене его тоже не будет. | Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi. | There is no drawing on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `log₂ 8 + log₂ 4   →   ?` |
| `task.answer` | `5` |
| `order.items` | `log₂ 1` · `log₂ 2` · `log₂ 8` · `log₂ 32` |
| `order.answer` | `log₂ 1  log₂ 2  log₂ 8  log₂ 32` |

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
| `proof` | Здесь сумму под знаком раскрыли как сумму логарифмов, а такого правила нет. | Bu yerda belgi ostidagi yig'indi logarifmlar yig'indisi qilib ochildi, bunday qoida esa yo'q. | Here the sum under the sign was opened as a sum of logarithms, and there is no such rule. |
| `entry.prompt` | Чему равно это выражение на самом деле? | Bu ifoda haqiqatda nechaga teng? | What does this expression actually equal? |
| `entry.ok` | Три. Сначала складывают числа под знаком, и только потом берут логарифм восьмёрки. | Uch. Avval belgi ostidagi sonlar qo'shiladi, va faqat keyin sakkizning logarifmi olinadi. | Three. First the numbers under the sign are added, and only then the logarithm of eight is taken. |
| `entry.hint.1` | Посчитай сначала то, что стоит под знаком. | Avval belgi ostida turganini hisoblang. | First compute what stands under the sign. |
| `entry.hint.2` | Четыре плюс четыре это восемь. | To'rt qo'shuv to'rt bu sakkiz. | Four plus four is eight. |
| `entry.hint.3` | Три. | Uch. | Three. |
| `audio.mount` | Задача. Найти значение логарифма от суммы. | Masala. Yig'indining logarifmi qiymatini topish. | A task. Find the value of the logarithm of a sum. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `log₂ (4 + 4)` |
| `row.r2` | `log₂ 4 + log₂ 4` |
| `row.r3` | `2 + 2` |
| `row.r4` | `4` |
| `answerId` | `r2` |
| `entry.answer` | `3` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | Значение дано, найди число | Qiymat berilgan, sonni toping | The value is given, find the number |
| `entry.prompt` | При основании пять логарифм равен трём. Какое число стоит под знаком? | Asos besh, logarifm uchga teng. Belgi ostida qaysi son turadi? | With base five the logarithm is three. Which number is under the sign? |
| `entry.ok` | Сто двадцать пять. Логарифм это показатель, значит пять в кубе. | Bir yuz yigirma besh. Logarifm bu ko'rsatkich, demak besh kubda. | One hundred twenty five. The logarithm is an exponent, so five cubed. |
| `entry.hint.1` | Логарифм равен трём, значит основание берут в третьей степени. | Logarifm uchga teng, demak asos uchinchi darajaga ko'tariladi. | The logarithm is three, so the base is taken to the third power. |
| `entry.hint.2` | Пять в кубе. | Besh kubda. | Five cubed. |
| `entry.hint.3` | Сто двадцать пять. | Bir yuz yigirma besh. | One hundred twenty five. |
| `multi.prompt` | Отметь все записи, значение которых равно двум. | Qiymati ikkiga teng hamma yozuvni belgilang. | Mark every reading whose value is two. |
| `multi.title` | У каких записей значение равно двум? | Qaysi yozuvlarning qiymati ikkiga teng? | Which readings have the value two? |
| `multi.c.hint` | Здесь основание и число совпадают, значит значение равно единице. | Bu yerda asos va son bir xil, demak qiymat birga teng. | Here the base and the number coincide, so the value is one. |
| `multi.d.hint` | Это логарифм единицы, а он всегда ноль. | Bu birning logarifmi, u esa doim nol. | That is the logarithm of one, and it is always zero. |
| `multi.ok` | Две из четырёх. Одно и то же значение получается при разных основаниях. | To'rttadan ikkitasi. Bir xil qiymat har xil asoslarda chiqadi. | Two out of four. The same value comes from different bases. |
| `audio.mount` | Теперь обратная задача. Логарифм известен, найти надо само число. | Endi teskari masala. Logarifm ma'lum, sonning o'zini topish kerak. | Now the inverse task. The logarithm is known, and the number must be found. |
| `audio.work` | Сначала запиши число, потом отметишь все записи со значением два. | Avval sonni yozing, keyin qiymati ikki bo'lgan hamma yozuvni belgilaysiz. | First type the number, then you will mark every reading with the value two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.answer` | `125` |
| `multi.a` [верно] | `log₃ 9` |
| `multi.b` [верно] | `log₅ 25` |
| `multi.c` | `log₇ 7` |
| `multi.d` | `log₄ 1` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `log-summy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Что такое логарифм? | Logarifm nima? | What is a logarithm? |
| `q1.a` [верно] | показатель степени | darajaning ko'rsatkichi | an exponent |
| `q1.b` | результат деления | bo'lish natijasi | the result of a division |
| `q1.b.hint` | Делением показатель не находят, это проверено на прошлом уроке. | Ko'rsatkich bo'lish bilan topilmaydi, bu o'tgan darsda tekshirilgan. | The exponent is not found by dividing, that was checked last lesson. |
| `q1.c` | основание степени | darajaning asosi | the base of a power |
| `q1.c.hint` | Основание стоит внизу, а логарифм это то, что получается. | Asos pastda turadi, logarifm esa chiqadigan narsa. | The base stands below, and the logarithm is what comes out. |
| `q1.d` | новая операция | yangi amal | a new operation |
| `q1.d.hint` | Новой операции нет: это имя для уже найденного показателя. | Yangi amal yo'q: bu allaqachon topilgan ko'rsatkichning nomi. | There is no new operation: it is a name for an exponent already found. |
| `q2.prompt` | Чему равен логарифм произведения? | Ko'paytmaning logarifmi nechaga teng? | What is the logarithm of a product? |
| `q2.a` [верно] | сумме логарифмов | logarifmlar yig'indisiga | the sum of the logarithms |
| `q2.b` | произведению логарифмов | logarifmlar ko'paytmasiga | the product of the logarithms |
| `q2.b.hint` | Проверь на четырёх и восьми: выйдет шесть вместо пяти. | To'rt va sakkizda tekshiring: besh o'rniga olti chiqadi. | Check on four and eight: you get six instead of five. |
| `q2.c` | разности логарифмов | logarifmlar ayirmasiga | the difference of the logarithms |
| `q2.c.hint` | Разность отвечает делению, а не умножению. | Ayirma bo'lishga mos keladi, ko'paytirishga emas. | A difference matches division, not multiplication. |
| `q2.d` | ничему из этого | bularning hech biriga | none of these |
| `q2.d.hint` | Правило есть, и оно выводится из свойства степени. | Qoida bor, va u daraja xossasidan chiqariladi. | The rule exists and comes from a property of powers. |
| `q3.prompt` | Какое число может стоять под знаком логарифма? | Logarifm belgisi ostida qanday son turishi mumkin? | Which number can stand under a logarithm sign? |
| `q3.a` [верно] | только положительное | faqat musbat | only a positive one |
| `q3.a.ok` | Да. Степень положительного основания отрицательной не бывает. | Ha. Musbat asosning darajasi manfiy bo'lmaydi. | Yes. A power of a positive base is never negative. |
| `q3.b` | любое | har qanday | any |
| `q3.b.hint` | Тогда нашлась бы степень двойки, равная минус четырём, а её нет. | Unda minus to'rtga teng ikkining darajasi topilardi, u esa yo'q. | Then there would be a power of two equal to minus four, and there is none. |
| `q3.c` | только целое | faqat butun | only a whole number |
| `q3.c.hint` | Дробное тоже годится, лишь бы положительное. | Kasr ham yaraydi, faqat musbat bo'lsa. | A fractional one works too, as long as it is positive. |
| `q3.d` | только больше единицы | faqat birdan katta | only greater than one |
| `q3.d.hint` | Между нулём и единицей логарифм тоже есть, он просто отрицательный. | Nol va bir orasida ham logarifm bor, u shunchaki manfiy. | Between zero and one the logarithm exists too, it is just negative. |
| `q4.prompt` | Чему равен логарифм единицы? | Birning logarifmi nechaga teng? | What is the logarithm of one? |
| `q4.a` [верно] | нулю | nolga | zero |
| `q4.b` | единице | birga | one |
| `q4.b.hint` | Единице равен логарифм самого основания. | Birga asosning o'zining logarifmi teng. | One is the logarithm of the base itself. |
| `q4.c` | основанию | asosga | the base |
| `q4.c.hint` | Логарифм это показатель, а не основание. | Logarifm bu ko'rsatkich, asos emas. | A logarithm is an exponent, not a base. |
| `q4.d` | его не существует | u mavjud emas | it does not exist |
| `q4.d.hint` | Единица положительна, значит логарифм есть. | Bir musbat, demak logarifm bor. | One is positive, so the logarithm exists. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `log₂ 8 = 3` |
| `q2.done` | `logₐ (b·c) = logₐ b + logₐ c` |
| `q3.done` | `x > 0` |
| `q4.done` | `logₐ 1 = 0` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Читаю логарифм как показатель степени | Logarifmni darajaning ko'rsatkichi deb o'qiyman | I read a logarithm as an exponent |
| `can.2` | Не путаю основание с числом под знаком | Asosni belgi ostidagi son bilan aralashtirmayman | I do not mix the base with the number under the sign |
| `can.3` | Вывожу свойства из свойств степени | Xossalarni daraja xossalaridan chiqaraman | I derive the properties from those of powers |
| `can.4` | Знаю, что под знаком стоит положительное число | Belgi ostida musbat son turishini bilaman | I know a positive number stands under the sign |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: логарифм произведения. | Bitta joy takrorlashni talab qiladi: ko'paytmaning logarifmi. | One place needs review: the logarithm of a product. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va 5-ekranga qayting. | Go back to the rule and to screen 5. |
| `bridge` | Дальше число под знаком станет переменной, и получится логарифмическая функция. | Keyin belgi ostidagi son o'zgaruvchi bo'ladi, va logarifmik funksiya chiqadi. | Next the number under the sign becomes a variable, and a logarithmic function appears. |
| `lifehack` | Забыл свойство, перепиши числа степенями. Правило выйдет само за две строки. | Xossani esdan chiqardingizmi, sonlarni darajalar bilan yozing. Qoida ikki qatorda o'zi chiqadi. | Forgot a property, rewrite the numbers as powers. The rule comes out on its own in two lines. |
| `sheetTitle` | Логарифм · шпаргалка | Logarifm · shpargalka | The logarithm · cheat sheet |
| `sheetSrc` | 10 класс · урок 29 | 10-sinf · 29-dars | Grade 10 · lesson 29 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija. | At the start you had to choose one of two readings. Here is the result. |
| `audio.next` | Логарифм произведения равен сумме логарифмов, потому что при умножении степеней показатели складываются. | Ko'paytmaning logarifmi logarifmlar yig'indisiga teng, chunki darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi. | The logarithm of a product is the sum of the logarithms, because multiplying powers adds the exponents. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `6` |
| `hook.b` | `5` |
| `proved` | `5` |
| `law` | `logₐ (b·c) = logₐ b + logₐ c` |
| `sheet.1` | `logₐ b = c   ⇄   a^c = b` |
| `sheet.2` | `logₐ (b·c) = logₐ b + logₐ c` |
| `sheet.3` | `logₐ (b/c) = logₐ b − logₐ c` |
| `sheet.4` | `logₐ 1 = 0,   logₐ a = 1` |
| `sheet.5` | `b > 0,   a > 0,   a ≠ 1` |
