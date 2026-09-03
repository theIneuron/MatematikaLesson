# Урок 8 — Сложная, обратная и периодическая функция · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS25_KONTENT.md`.

Скелет: в чате 27.08.2026. Опора в учебнике: алгебра 2022, стр. 35–41, параграф
`MURAKKAB, TESKARI, DAVRIY FUNKSIYALAR`.

**Зачем урок.** Строка плана 7 несёт шесть тем, в урок 7 взято три. Сложная и обратная
функция выпали, а аркфункции урока 9 — частный случай обратной: частное шло раньше общего.
В планах 7, 8, 9 и 11 классов этих тем нет вовсе.

**Три темы, одна мысль: порядок.** Сложная функция — порядок применения (внутренняя первой).
Обратная — порядок обратный (вход и выход меняются местами). Период — порядок повторения
(шаг `T`, и наименьший из них основной). Поэтому все три живут в одном уроке, а не в трёх.

**Запись идёт книжной формой:** каждый шаг своей строкой, как в тетради. Прибор 2 — запись,
прибор 5 — полоса допустимых значений, фигура `TwoLines` с зеркалом `y = x` — график
обратной (учебник, рис. 4, стр. 39).

**Терминология UZ — draft, требует валидации узбекским методистом математики.** Термины из
учебника дословно: `murakkab funksiya`, `teskari funksiya`, `davriy funksiya`, `asosiy davr`.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПОРЯДОК | TARTIB | THE ORDER |
| `title` | Меняем порядок — меняется ответ? | Tartib o'zgarsa, javob o'zgaradimi? | Change the order, does the answer change? |
| `row.a.name` | оба порядка дают одно число | ikkala tartib bir xil son beradi | both orders give the same number |
| `row.b.name` | порядки дают разные числа | tartiblar boshqa son beradi | the orders give different numbers |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас посчитаем оба порядка. | Javobingiz yozib olindi. Endi ikkala tartibni hisoblaymiz. | Your answer is saved. Now we will compute both orders. |
| `audio.mount` | Две функции. Первая возводит в квадрат, вторая отнимает три. | Ikki funksiya. Birinchisi kvadratga ko'taradi, ikkinchisi uchni ayiradi. | Two functions. The first squares, the second subtracts three. |
| `audio.r1` | Первая запись говорит, что порядок неважен: сначала квадрат или сначала минус три, разницы нет. | Birinchi yozuv tartib muhim emas deydi: avval kvadrat yoki avval minus uch, farqi yo'q. | The first reading says the order does not matter: square first or subtract three first, no difference. |
| `audio.r2` | Вторая говорит, что порядок меняет число, и тогда одна запись из двух лишняя. | Ikkinchisi tartib sonni o'zgartiradi deydi, unda ikkitadan bittasi ortiqcha. | The second says the order changes the number, and then one of the two readings is wrong. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `f(x) = x²` · `g(x) = x − 3` |
| `row.a.value` | `f(g(5)) = g(f(5))` |
| `row.b.value` | `f(g(5)) ≠ g(f(5))` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | THE BASICS |
| `title` | Три коротких перед началом | Boshlashdan oldin uchta qisqa savol | Three short ones before we start |
| `q1.prompt` | Функция возводит в квадрат. Что она даёт на двойке? | Funksiya kvadratga ko'taradi. U ikkida nima beradi? | The function squares. What does it give at two? |
| `q1.a` [верно] | 4 | 4 | 4 |
| `q1.b` | 2 | 2 | 2 |
| `q1.b.hint` | Двойка это вход, а не выход. | Ikki bu kirish, chiqish emas. | Two is the input, not the output. |
| `q1.c` | 8 | 8 | 8 |
| `q1.c.hint` | Восемь это куб, а квадрат это два множителя. | Sakkiz bu kub, kvadrat esa ikki ko'paytuvchi. | Eight is the cube; a square is two factors. |
| `q1.d` | 1 | 1 | 1 |
| `q1.d.hint` | Единицу даёт квадрат единицы, а не двойки. | Birni birning kvadrati beradi, ikkining emas. | One comes from the square of one, not of two. |
| `q2.prompt` | Функция отнимает три. Что она даёт на пятёрке? | Funksiya uchni ayiradi. U beshda nima beradi? | The function subtracts three. What does it give at five? |
| `q2.a` [верно] | 2 | 2 | 2 |
| `q2.b` | 8 | 8 | 8 |
| `q2.b.hint` | Восемь вышло бы при сложении, а здесь стоит минус. | Sakkiz qo'shishda chiqardi, bu yerda esa minus. | Eight would come from addition, but here it is a minus. |
| `q2.c` | 15 | 15 | 15 |
| `q2.c.hint` | Пятнадцать это умножение на три, а не вычитание трёх. | O'n besh bu uchga ko'paytirish, uchni ayirish emas. | Fifteen is multiplication by three, not subtracting three. |
| `q2.d` | −2 | −2 | −2 |
| `q2.d.hint` | Знак перевёрнут: от пяти отняли три, а не наоборот. | Ishora teskari: beshdan uch ayirildi, teskarisi emas. | The sign is flipped: three from five, not the other way. |
| `q3.prompt` | При каком икс выражение икс минус три равно нулю? | Iks ayirish uch ifodasi qanday iksda nolga teng? | For which x does x minus three equal zero? |
| `q3.a` [верно] | 3 | 3 | 3 |
| `q3.b` | 0 | 0 | 0 |
| `q3.b.hint` | При нуле выйдет минус три, а не ноль. | Nolda minus uch chiqadi, nol emas. | At zero it gives minus three, not zero. |
| `q3.c` | −3 | −3 | −3 |
| `q3.c.hint` | При минус трёх выйдет минус шесть. | Minus uchda minus olti chiqadi. | At minus three it gives minus six. |
| `q3.d` | 1 | 1 | 1 |
| `q3.d.hint` | При единице выйдет минус два. | Birda minus ikki chiqadi. | At one it gives minus two. |
| `audio.mount` | Три вопроса на то, что уже знаешь. Обе функции урока встретятся в них по отдельности. | Siz bilgan narsalar uchun uchta savol. Darsning ikkala funksiyasi ularda alohida uchraydi. | Three questions on what you already know. Both functions of the lesson appear in them separately. |
| `q1.done` | Это внешняя функция урока. | Bu darsning tashqi funksiyasi. | This is the outer function of the lesson. |
| `q2.done` | А это внутренняя. | Bu esa ichkisi. | And this is the inner one. |
| `q3.done` | Это же число понадобится, когда будем искать обратную. | Xuddi shu son teskarisini izlaganda kerak bo'ladi. | The same number will be needed when we look for the inverse. |

---

## Экран 3 · `explain1` · ответ `number` · тег `slozhnaya-poryadok`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | СЛОЖНАЯ ФУНКЦИЯ | MURAKKAB FUNKSIYA | A COMPOSITE FUNCTION |
| `title` | Внутренняя работает первой | Ichki funksiya birinchi ishlaydi | The inner one works first |
| `show.1.1` | Шаг 1. Внутренняя функция берёт число | 1-qadam. Ichki funksiya sonni oladi | Step 1. The inner function takes the number |
| `show.1.2` | вместо икс подставлено икс минус три | iks o'rniga iks ayirish uch qo'yildi | x minus three is put in place of x |
| `show.1.3` | её результат идёт дальше, во внешнюю | uning natijasi tashqisiga boradi | its result goes on, into the outer one |
| `show.2.1` | Шаг 2. Внешняя возводит в квадрат | 2-qadam. Tashqisi kvadratga ko'taradi | Step 2. The outer one squares |
| `show.2.2` | в скобках стоит уже готовое число | qavs ichida tayyor son turadi | inside the brackets a ready number stands |
| `show.2.3` | на пятёрке внутренняя даёт два | beshda ichkisi ikkini beradi | at five the inner one gives two |
| `audio.mount` | Слева обе функции, справа запись. Каждый шаг занимает свою строку, как в тетради. | Chapda ikkala funksiya, o'ngda yozuv. Har bir qadam daftardagidek o'z satrini oladi. | On the left both functions, on the right the record. Each step takes its own line, as in a notebook. |
| `audio.side*` | Смотри, куда подставляется внутренняя функция. Она входит целиком, вместе со своим минусом. | Ichki funksiya qayerga qo'yilishini kuzatib turing. U butunlay, minusi bilan kiradi. | Watch where the inner function goes. It enters whole, together with its minus. |
| `audio.work` | Учебник называет это сложной функцией: одна функция стоит внутри другой. | Darslik bunga murakkab funksiya deydi: bir funksiya boshqasining ichida turadi. | The textbook calls this a composite function: one function stands inside another. |
| `work.prompt` | Посчитай значение сложной функции на пятёрке | Murakkab funksiyaning beshdagi qiymatini hisoblang | Compute the value of the composite at five |
| `work.ok` | Верно. Внутренняя дала два, внешняя возвела в квадрат: четыре. | To'g'ri. Ichkisi ikkini berdi, tashqisi kvadratga ko'tardi: to'rt. | Correct. The inner gave two, the outer squared it: four. |
| `work.hint.1` | Сначала посчитай икс минус три при икс равном пяти. | Avval iks besh bo'lganda iks ayirish uchni hisoblang. | First compute x minus three at x equal to five. |
| `work.hint.2` | Внутренняя дала два. Теперь работает внешняя. | Ichkisi ikkini berdi. Endi tashqisi ishlaydi. | The inner gave two. Now the outer works. |
| `work.hint.3` | Квадрат двойки это четыре. | Ikkining kvadrati to'rt. | Two squared is four. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `f(x) = x²` · `g(x) = x − 3` |
| `frame.1` | `f(g(x)) = f(x − 3)` |
| `frame.2` | `f(g(x)) = (x − 3)²` |
| `work.expr` | `f(g(5)) = (5 − 3)²` |
| `work.answer` | `4` |

---

## Экран 4 · `explain2` · ответ `order` · тег `slozhnaya-poryadok`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ДРУГОЙ ПОРЯДОК | BOSHQA TARTIB | THE OTHER ORDER |
| `title` | Те же две функции, порядок обратный | O'sha ikki funksiya, tartib teskari | The same two functions, the order reversed |
| `show.1.1` | Теперь первой работает квадрат | Endi birinchi bo'lib kvadrat ishlaydi | Now the square works first |
| `show.1.2` | и только потом отнимается три | va faqat keyin uch ayiriladi | and only then three is subtracted |
| `show.1.3` | на пятёрке выходит двадцать два | beshda yigirma ikki chiqadi | at five it comes out twenty two |
| `show.2.1` | Четыре против двадцати двух | To'rt va yigirma ikki | Four against twenty two |
| `show.2.2` | те же функции, тот же вход, разный порядок | o'sha funksiyalar, o'sha kirish, boshqa tartib | same functions, same input, different order |
| `show.2.3` | значит запись порядка обязательна | demak tartibni yozish shart | so writing the order down is mandatory |
| `order.prompt` | Расставь по порядку | Tartib bilan joylashtiring | Put them in order |
| `order.s1` | вход идёт во внутреннюю | kirish ichkisiga boradi | the input goes into the inner one |
| `order.s2` | её результат идёт во внешнюю | uning natijasi tashqisiga boradi | its result goes into the outer one |
| `order.s3` | внешняя даёт ответ | tashqisi javob beradi | the outer one gives the answer |
| `order.ok` | Верно. Внутренняя всегда первой, и это видно по скобкам. | To'g'ri. Ichkisi doim birinchi, va bu qavslardan ko'rinadi. | Correct. The inner one always goes first, and the brackets show it. |
| `order.bad` | Порядок другой. Смотри, какая функция стоит в скобках. | Tartib boshqacha. Qavs ichida qaysi funksiya turganiga qarang. | The order is different. Look at which function stands inside the brackets. |
| `audio.mount` | Теперь наоборот: квадрат первым, минус три вторым. | Endi teskarisi: kvadrat birinchi, minus uch ikkinchi. | Now the other way round: the square first, minus three second. |
| `audio.two*` | Одни и те же функции, а числа разные. Смотри, где стоят скобки. | Bir xil funksiyalar, sonlar esa boshqa. Qavslar qayerda turganiga qarang. | The same functions, different numbers. Watch where the brackets are. |
| `audio.work` | Внутренняя это та, что в скобках. Она и работает первой. | Ichkisi bu qavs ichidagisi. U birinchi ishlaydi. | The inner one is the one inside the brackets. It works first. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `f(x) = x²` · `g(x) = x − 3` |
| `frame.1` | `g(f(x)) = x² − 3` |
| `frame.2` | `f(g(5)) = 4,   g(f(5)) = 22` |
| `order.mark` | `f(g(x))` |

---

## Экран 5 · `explain3` · ответ `number` · тег `slozhnaya-oblast`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГДЕ ОПРЕДЕЛЕНА | QAYERDA ANIQLANGAN | WHERE IT IS DEFINED |
| `title` | Условие приходит от внутренней | Shart ichkisidan keladi | The condition comes from the inner one |
| `show.1.1` | Внешняя определена на всей прямой | Tashqisi butun o'qda aniqlangan | The outer one is defined on the whole line |
| `show.1.2` | а внутренняя это корень | ichkisi esa ildiz | but the inner one is a root |
| `show.1.3` | под корнем отрицательного быть не может | ildiz ostida manfiy bo'lolmaydi | a negative cannot stand under a root |
| `show.2.1` | Полоса закрашена от нуля вправо | Polosa noldan o'ngga bo'yalgan | The band is shaded from zero rightwards |
| `show.2.2` | это область определения сложной функции | bu murakkab funksiyaning aniqlanish sohasi | this is the domain of the composite |
| `show.2.3` | учебник берёт её у внутренней, а не у внешней | darslik uni ichkisidan oladi, tashqisidan emas | the textbook takes it from the inner one, not the outer |
| `audio.mount` | Пример из учебника, страница тридцать пять. Внешняя функция обычная, а внутренняя корень. | Darslikdagi misol, o'ttiz beshinchi bet. Tashqi funksiya oddiy, ichkisi esa ildiz. | The example from the textbook, page thirty five. The outer function is ordinary, the inner one is a root. |
| `audio.band*` | Полоса допустимых значений появляется первой, ещё до подстановки. | Ruxsat etilgan qiymatlar polosasi birinchi paydo bo'ladi, qo'yishdan oldin. | The band of allowed values appears first, before any substitution. |
| `audio.work` | Условие пришло от внутренней функции, хотя вопрос был про сложную. | Shart ichki funksiyadan keldi, savol esa murakkab funksiya haqida edi. | The condition came from the inner function, though the question was about the composite. |
| `work.prompt` | Запиши наименьшее допустимое значение те | t ning eng kichik ruxsat etilgan qiymatini yozing | Write the smallest allowed value of t |
| `work.ok` | Верно. Ноль входит: корень из нуля есть и равен нулю. | To'g'ri. Nol kiradi: noldan ildiz bor va u nolga teng. | Correct. Zero is included: the root of zero exists and equals zero. |
| `work.hint.1` | Смотри, что стоит под корнем. | Ildiz ostida nima turganiga qarang. | Look at what stands under the root. |
| `work.hint.2` | Корень определён, когда под ним не отрицательное. | Ildiz uning ostidagi manfiy bo'lmaganda aniqlangan. | A root is defined when what is under it is not negative. |
| `work.hint.3` | Граница входит в область: это ноль. | Chegara sohaga kiradi: bu nol. | The boundary belongs to the domain: it is zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `y = 2x² − 3x` · `x = √t` |
| `frame.1` | `y = 2t − 3√t` |
| `frame.2` | `t ≥ 0` |
| `work.expr` | `x = √t` |
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `obratnaya-kak-stepen`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБРАТНАЯ ФУНКЦИЯ | TESKARI FUNKSIYA | THE INVERSE FUNCTION |
| `title` | Вход и выход меняются местами | Kirish va chiqish joyini almashadi | The input and the output swap places |
| `show.1.1` | Прямая функция ведёт от икс к игрек | To'g'ri funksiya iksdan igrekka olib boradi | The direct function leads from x to y |
| `show.1.2` | обратная возвращает от игрек к икс | teskarisi igrekdan iksga qaytaradi | the inverse leads back from y to x |
| `show.1.3` | точка минус один и четыре становится четыре и минус один | minus bir va to'rt nuqtasi to'rt va minus bir bo'ladi | the point minus one and four becomes four and minus one |
| `show.2.1` | Пунктир это прямая игрек равно икс | Punktir bu igrek teng iks to'g'ri chizig'i | The dashed line is y equals x |
| `show.2.2` | графики симметричны относительно неё | grafiklar unga nisbatan simmetrik | the graphs are symmetric about it |
| `show.2.3` | учебник рисует это же на странице тридцать девять | darslik xuddi shuni o'ttiz to'qqizinchi betda chizadi | the textbook draws the same on page thirty nine |
| `audio.mount` | Прямая функция удваивает и добавляет шесть. Обратная должна вернуть всё назад. | To'g'ri funksiya ikkilantiradi va olti qo'shadi. Teskarisi hammasini qaytarishi kerak. | The direct function doubles and adds six. The inverse has to bring everything back. |
| `audio.mirror*` | Смотри, что делает зеркало. Точка переходит через пунктир и меняет координаты местами. | Ko'zgu nima qilishini kuzatib turing. Nuqta punktirdan o'tadi va koordinatalari joyini almashadi. | Watch what the mirror does. The point crosses the dashed line and swaps its coordinates. |
| `audio.work` | Запись минус один сверху означает обратную функцию, а не дробь и не степень. | Yuqoridagi minus bir teskari funksiyani bildiradi, kasr yoki daraja emas. | The minus one above means the inverse function, not a fraction and not a power. |
| `work.prompt` | Посчитай значение обратной функции на десятке | Teskari funksiyaning o'ndagi qiymatini hisoblang | Compute the value of the inverse at ten |
| `work.ok` | Верно. Два. Проверка: прямая функция на двойке даёт десять, значит вернулись ровно туда. | To'g'ri. Ikki. Tekshiruv: to'g'ri funksiya ikkida o'n beradi, demak aynan o'sha yerga qaytdik. | Correct. Two. Check: the direct function at two gives ten, so we came back exactly there. |
| `work.hint.1` | Из равенства игрек равно два икс плюс шесть вырази икс. | Igrek teng ikki iks qo'shuv olti tenglikdan iksni ifodalang. | From y equals two x plus six express x. |
| `work.hint.2` | Отними шесть, потом раздели на два. | Oltini ayiring, keyin ikkiga bo'ling. | Subtract six, then divide by two. |
| `work.hint.3` | Десять минус шесть это четыре, четыре на два это два. | O'n ayirish olti bu to'rt, to'rtni ikkiga bo'lsa ikki. | Ten minus six is four, four divided by two is two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `f(x) = 2x + 6` · `f⁻¹(x) = 0,5x − 3` |
| `frame.1` | `y = 2x + 6   ⇒   x = 0,5y − 3` |
| `frame.2` | `f(2) = 10,   f⁻¹(10) = 2` |
| `work.expr` | `f⁻¹(x) = 0,5x − 3` |
| `work.answer` | `2` |

---

## Экран 7 · `explain5` · ответ `number` · тег `obratnaya-bez-odnoznachnosti`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ГРАНИЦА | CHEGARA | THE EDGE |
| `title` | Обратная есть не у всякой функции | Har funksiyaning teskarisi yo'q | Not every function has an inverse |
| `show.1.1` | Квадрат на всей прямой обратной не имеет | Butun o'qdagi kvadratning teskarisi yo'q | The square on the whole line has no inverse |
| `show.1.2` | одному игрек отвечают два разных икс | bitta igrekka ikki xil iks to'g'ri keladi | one y corresponds to two different x |
| `show.1.3` | значит вернуться однозначно нельзя | demak bir qiymatli qaytish mumkin emas | so there is no single way back |
| `show.2.1` | На правой половине прямой обратная есть | O'qning o'ng yarmida teskarisi bor | On the right half of the line the inverse exists |
| `show.2.2` | там каждому игрек отвечает один икс | unda har igrekka bitta iks to'g'ri keladi | there each y has exactly one x |
| `show.2.3` | учебник и требует единственности корня | darslik ildizning yagonaligini talab qiladi | the textbook requires exactly this uniqueness |
| `audio.mount` | Учебник требует, чтобы уравнение имело единственный корень. Проверим это числом. | Darslik tenglama yagona ildizga ega bo'lishini talab qiladi. Buni son bilan tekshiramiz. | The textbook requires the equation to have a unique root. Let us check it with a number. |
| `audio.count*` | Смотри на запись. Два числа дают один и тот же квадрат. | Yozuvga qarang. Ikki son bir xil kvadrat beradi. | Look at the record. Two numbers give one and the same square. |
| `audio.work` | Вот из-за этого обратной у квадрата на всей прямой и нет. | Aynan shu sababli butun o'qdagi kvadratning teskarisi yo'q. | This is exactly why the square has no inverse on the whole line. |
| `work.prompt` | Сколько чисел дают квадрат, равный девяти? | Kvadrati to'qqizga teng bo'lgan nechta son bor? | How many numbers give a square equal to nine? |
| `work.ok` | Верно. Два: три и минус три. Один игрек, два икс, обратной нет. | To'g'ri. Ikkita: uch va minus uch. Bitta igrek, ikki iks, teskarisi yo'q. | Correct. Two: three and minus three. One y, two x, no inverse. |
| `work.hint.1` | Какое число в квадрате даёт девять? | Qaysi sonning kvadrati to'qqiz beradi? | Which number squared gives nine? |
| `work.hint.2` | Минус три в квадрате тоже даёт девять. | Minus uchning kvadrati ham to'qqiz beradi. | Minus three squared also gives nine. |
| `work.hint.3` | Значит таких чисел два, а не одно. | Demak bunday son ikkita, bitta emas. | So there are two such numbers, not one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `y = x²` · `y = 9` |
| `frame.1` | `x² = 9   ⇒   x = 3;   x = −3` |
| `frame.2` | `x ≥ 0   ⇒   x = 3` |
| `work.expr` | `x² = 9` |
| `work.answer` | `2` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `period-lyuboy`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `title` | Три определения учебника | Darslikning uchta ta'rifi | Three definitions from the textbook |
| `probe.question` | Что такое основной период? | Asosiy davr nima? | What is the fundamental period? |
| `probe.a` [верно] | наименьший положительный период | eng kichik musbat davr | the smallest positive period |
| `probe.b` | любой период, который подошёл | mos kelgan har qanday davr | any period that happened to fit |
| `probe.b.hint` | Тогда основных периодов было бы бесконечно много: за каждым идут его удвоение и утроение. | Unda asosiy davr cheksiz ko'p bo'lardi: har birining ortidan ikkilangani va uchlangani keladi. | Then there would be infinitely many fundamental periods: each one is followed by its double and triple. |
| `rule.lawLabel` | Периодическая функция | Davriy funksiya | A periodic function |
| `rule.lines.1` | Стр. 35. Функция внутри функции — сложная функция. | 35-bet. Funksiya ichidagi funksiya — murakkab funksiya. | Page 35. A function inside a function is a composite. |
| `rule.lines.2` | Стр. 37. Корень единственный — есть обратная; минус один сверху её и означает. | 37-bet. Ildiz yagona bo'lsa teskarisi bor; yuqoridagi minus bir uni bildiradi. | Page 37. A unique root means an inverse; the minus one above denotes it. |
| `rule.lines.3` | Стр. 39. Основной период — наименьший положительный. | 39-bet. Asosiy davr — eng kichik musbat davr. | Page 39. The fundamental period is the smallest positive one. |
| `audio.mount` | Прежде чем открыть карточку, ответь на один вопрос. | Kartochkani ochishdan oldin bitta savolga javob bering. | Before the card opens, answer one question. |
| `audio.rule*` | Карточка говорит словами учебника. Три определения, и все три про порядок. | Kartochka darslik so'zlari bilan gapiradi. Uchta ta'rif, va uchalasi tartib haqida. | The card speaks in the words of the textbook. Three definitions, and all three are about order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `f(x + nT) = f(x),   n ∈ Z` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `obratnaya-kak-stepen`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЧЕТЫРЕ ПАРЫ | TO'RT JUFTLIK | FOUR PAIRS |
| `title` | Соедини функцию с её обратной | Funksiyani teskarisi bilan biriktiring | Match each function with its inverse |
| `match.prompt` | Каждой функции своя обратная | Har funksiyaga o'z teskarisi | Each function gets its own inverse |
| `match.a` | x − 5 | x − 5 | x − 5 |
| `match.b` | x : 3 | x : 3 | x : 3 |
| `match.c` | x + 2 | x + 2 | x + 2 |
| `match.d` | 4x | 4x | 4x |
| `match.ok` | Все четыре верно. Обратная отменяет действие, а не делит на функцию. | To'rttasi ham to'g'ri. Teskarisi amalni bekor qiladi, funksiyaga bo'lmaydi. | All four correct. The inverse undoes the action; it does not divide by the function. |
| `audio.mount` | Четыре функции, и у каждой своя обратная. Обратная отменяет то, что сделала прямая. | To'rtta funksiya, har birining o'z teskarisi bor. Teskarisi to'g'risi qilgan ishni bekor qiladi. | Four functions, each with its own inverse. The inverse undoes what the direct one did. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `f(x) = x + 5` · `f(x) = 3x` · `f(x) = x − 2` · `f(x) = x : 4` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `obratnaya-kak-stepen`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПО ШАГАМ | QADAMLAB | STEP BY STEP |
| `title` | Шаги названы, порядок за тобой | Qadamlar atalgan, tartib sizdan | The steps are named, the order is yours |
| `order.prompt` | Расставь по порядку | Tartib bilan joylashtiring | Put them in order |
| `order.s1` | записать игрек вместо эф от икс | f(x) o'rniga igrekni yozish | write y in place of f(x) |
| `order.s2` | выразить икс через игрек | iksni igrek orqali ifodalash | express x through y |
| `order.s3` | поменять буквы и записать обратную | harflarni almashtirib teskarisini yozish | swap the letters and write the inverse |
| `order.ok` | Верно. Выходит два икс плюс один. Проверка: прямая на пяти даёт два, обратная на двух даёт пять. | To'g'ri. Ikki iks qo'shuv bir chiqadi. Tekshiruv: to'g'risi beshda ikki, teskarisi ikkida besh. | Correct. It gives two x plus one. Check: the direct at five gives two, the inverse at two gives five. |
| `order.bad` | Порядок другой. Буквы меняются местами в самом конце, а не в начале. | Tartib boshqacha. Harflar oxirida almashadi, boshida emas. | The order is different. The letters swap at the very end, not at the start. |
| `audio.mount` | Учебник ищет обратную в четыре шага, и последний шаг легко забыть. | Darslik teskarisini to'rt qadamda izlaydi, oxirgi qadamni esa yodda tutish qiyin. | The textbook finds the inverse in four steps, and the last step is easy to forget. |

**Формулы**

| Ключ | Значение |
|---|---|
| `defs` | `f(x) = (x − 1) : 2` |
| `order.mark` | `f⁻¹(x) = 2x + 1` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | НА БУМАГЕ | QOG'OZDA | ON PAPER |
| `title` | Период, без прибора | Davr, asbobsiz | The period, no instrument |
| `order.prompt` | Расставь записи в том порядке, в каком они появляются | Yozuvlarni paydo bo'lish tartibida joylashtiring | Put the lines in the order they appear |
| `order.title` | Порядок записей | Yozuvlar tartibi | The order of the lines |
| `order.ok` | Верно. Девятка это единица плюс два периода, поэтому значение то же. | To'g'ri. To'qqiz bu bir qo'shuv ikki davr, shuning uchun qiymat o'sha. | Correct. Nine is one plus two periods, so the value is the same. |
| `order.bad` | Не тот порядок. Сначала девятку раскладывают через период, потом берут значение. | Tartib to'g'ri emas. Avval to'qqizni davr orqali yozadilar, keyin qiymatni oladilar. | Wrong order. First nine is written through the period, then the value is taken. |
| `task.prompt` | Период равен четырём, значение в единице равно семи. Чему равно значение в девятке? | Davr to'rtga teng, birdagi qiymat yettiga teng. To'qqizdagi qiymat nimaga teng? | The period is four, the value at one is seven. What is the value at nine? |
| `task.ok` | Верно. Семь. Значение повторяется через каждые четыре шага. | To'g'ri. Yetti. Qiymat har to'rt qadamda takrorlanadi. | Correct. Seven. The value repeats every four steps. |
| `task.hint.1` | Сколько периодов от единицы до девятки? | Birdan to'qqizgacha nechta davr bor? | How many periods from one to nine? |
| `task.hint.2` | Восемь это два периода по четыре. | Sakkiz bu to'rtlik ikki davr. | Eight is two periods of four. |
| `task.hint.3` | Через целое число периодов значение то же самое. | Butun son davrdan keyin qiymat o'sha bo'ladi. | After a whole number of periods the value is the same. |
| `audio.mount` | Прибора здесь нет. Сначала порядок записей, потом ответ. | Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob. | There is no instrument here. First the order of the lines, then the answer. |
| `audio.next` | Теперь само значение. Пиши число. | Endi qiymatning o'zi. Sonni yozing. | Now the value itself. Write the number. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.answer` | `7` |
| `order.items` | `f(x + 4) = f(x)` · `f(9) = f(1 + 2·4)` · `f(9) = f(1)` · `f(9) = 7` |
| `order.answer` | `f(x + 4) = f(x)  f(9) = f(1 + 2·4)  f(9) = f(1)  f(9) = 7` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Все шаги верны, вывод неверен | Hamma qadam to'g'ri, xulosa noto'g'ri | Every step is right, the conclusion is wrong |
| `hint.r1` | Это дано: период равен четырём. | Bu berilgan: davr to'rtga teng. | This is given: the period equals four. |
| `hint.r2` | Верно: если четыре период, то и восемь период. | To'g'ri: to'rt davr bo'lsa, sakkiz ham davr. | Correct: if four is a period, so is eight. |
| `hint.r3` | Тоже верно, восемь действительно период. | Bu ham to'g'ri, sakkiz haqiqatan davr. | Also correct, eight really is a period. |
| `proof` | Ошибка в последней строке. Основной период это наименьший положительный, а не любой найденный. | Xato oxirgi satrda. Asosiy davr eng kichik musbat davr, topilgan har qanday davr emas. | The mistake is in the last line. The fundamental period is the smallest positive one, not any found. |
| `entry.prompt` | Запиши основной период этой функции | Bu funksiyaning asosiy davrini yozing | Write the fundamental period of this function |
| `entry.ok` | Верно. Четыре: это наименьший положительный период. | To'g'ri. To'rt: bu eng kichik musbat davr. | Correct. Four: this is the smallest positive period. |
| `entry.hint.1` | Из четвёрки следуют восемь, двенадцать и так далее. | To'rtdan sakkiz, o'n ikki va shu kabilar kelib chiqadi. | From four follow eight, twelve and so on. |
| `entry.hint.2` | Наоборот не выходит: из восьмёрки четвёрка не следует. | Teskarisi chiqmaydi: sakkizdan to'rt kelib chiqmaydi. | The other way round fails: four does not follow from eight. |
| `entry.hint.3` | Значит наименьший из них четыре. | Demak ularning eng kichigi to'rt. | So the smallest of them is four. |
| `audio.mount` | Решение выписано в четыре строки. Найди ту, где появилась ошибка. | Yechim to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping. | The solution is written in four lines. Find the one where the mistake appeared. |
| `audio.next` | Теперь запиши число, которое там должно стоять. | Endi u yerda turishi kerak bo'lgan sonni yozing. | Now write the number that belongs there. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `f(x + 4) = f(x)` |
| `row.r2` | `f(x + 8) = f(x + 4) = f(x)` |
| `row.r3` | `T = 8` |
| `row.r4` | `T₀ = 8` |
| `answerId` | `r4` |
| `entry.answer` | `4` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБРАТНАЯ ЗАДАЧА | TESKARI MASALA | THE REVERSE TASK |
| `title` | Теперь считаешь ты | Endi siz hisoblaysiz | Now you do the counting |
| `entry.prompt` | Функция добавляет пять. Чему равно значение обратной от значения прямой в тройке? | Funksiya besh qo'shadi. Uchdagi to'g'ri qiymatning teskarisi nimaga teng? | The function adds five. What is the inverse of the direct value at three? |
| `entry.ok` | Верно. Три. Обратная возвращает ровно то, что было на входе. | To'g'ri. Uch. Teskarisi kirishda nima bo'lsa, aynan shuni qaytaradi. | Correct. Three. The inverse returns exactly what was on the input. |
| `entry.hint.1` | Сначала посчитай прямую в тройке. | Avval uchdagi to'g'risini hisoblang. | First compute the direct one at three. |
| `entry.hint.2` | Прямая дала восемь. Теперь работает обратная. | To'g'risi sakkizni berdi. Endi teskarisi ishlaydi. | The direct gave eight. Now the inverse works. |
| `entry.hint.3` | Обратная отнимает пять: восемь минус пять. | Teskarisi beshni ayiradi: sakkiz ayirish besh. | The inverse subtracts five: eight minus five. |
| `multi.prompt` | Отметь все функции, у которых обратная есть на всей прямой | Butun o'qda teskarisi bor hamma funksiyani belgilang | Mark every function that has an inverse on the whole line |
| `multi.title` | Две из четырёх | To'rttadan ikkitasi | Two out of four |
| `multi.c.hint` | Квадрат даёт одно значение двум разным числам, вернуться однозначно нельзя. | Kvadrat bir qiymatni ikki xil songa beradi, bir qiymatli qaytish mumkin emas. | The square gives one value to two different numbers; there is no single way back. |
| `multi.d.hint` | Модуль тоже склеивает плюс и минус: у двух и минус двух он одинаковый. | Modul ham plyus va minusni yopishtiradi: ikki va minus ikkida u bir xil. | The absolute value also glues plus and minus: at two and minus two it is the same. |
| `multi.ok` | Верно. Обратная есть там, где каждому значению отвечает ровно один вход. | To'g'ri. Teskarisi har qiymatga aynan bitta kirish to'g'ri kelganda bor. | Correct. An inverse exists where each value has exactly one input. |
| `audio.mount` | До этого обратную давали тебе готовой. Теперь проверишь её действие сам. | Bungacha teskarisini sizga tayyor berardilar. Endi uning ishini o'zingiz tekshirasiz. | Until now the inverse was given to you ready-made. Now you check its action yourself. |
| `audio.work` | Обрати внимание: обратная и прямая друг друга отменяют, и это их главное свойство. | E'tibor bering: teskarisi va to'g'risi bir-birini bekor qiladi, va bu ularning asosiy xossasi. | Notice: the inverse and the direct cancel each other, and that is their main property. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.expr` | `f(x) = x + 5,   f⁻¹(f(3)) = ?` |
| `entry.answer` | `3` |
| `multi.a` [верно] | `f(x) = x + 1` |
| `multi.b` [верно] | `f(x) = 2x` |
| `multi.c` | `f(x) = x²` |
| `multi.d` | `f(x) = \|x\|` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `slozhnaya-poryadok`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | THE BLITZ |
| `title` | Четыре вопроса подряд | Ketma-ket to'rtta savol | Four questions in a row |
| `q1.prompt` | В сложной функции первой работает… | Murakkab funksiyada birinchi ishlaydigan... | In a composite function the first to work is... |
| `q1.a` [верно] | та, что в скобках | qavs ichidagisi | the one inside the brackets |
| `q1.b` | та, что снаружи | tashqaridagisi | the one outside |
| `q1.b.hint` | Внешняя получает уже готовое число, значит работает второй. | Tashqisi tayyor sonni oladi, demak ikkinchi ishlaydi. | The outer one receives a ready number, so it works second. |
| `q1.c` | любая, порядок неважен | har qanday, tartib muhim emas | either one, the order does not matter |
| `q1.c.hint` | Четыре против двадцати двух: порядок важен. | To'rt va yigirma ikki: tartib muhim. | Four against twenty two: the order matters. |
| `q1.d` | та, у которой область шире | sohasi kengrog'i | the one with the wider domain |
| `q1.d.hint` | Область определения решает другое: где сложная функция определена. | Aniqlanish sohasi boshqa narsani hal qiladi: murakkab funksiya qayerda aniqlangan. | The domain settles a different thing: where the composite is defined. |
| `q2.prompt` | Запись минус один сверху означает… | Yuqoridagi minus bir bildiradi... | The minus one above means... |
| `q2.a` [верно] | обратную функцию | teskari funksiyani | the inverse function |
| `q2.b` | дробь один делить на функцию | bir bo'lingan funksiya kasrini | the fraction one over the function |
| `q2.b.hint` | Проверка числом: обратная в десятке даёт два, а дробь одну двадцать шестую. | Son bilan tekshiruv: teskarisi o'nda ikki beradi, kasr esa bir yigirma oltidan. | Check with a number: the inverse at ten gives two, the fraction gives one twenty sixth. |
| `q2.c` | минус саму функцию | funksiyaning o'zini minus bilan | minus the function itself |
| `q2.c.hint` | Минус перед функцией пишут иначе, без единицы сверху. | Funksiya oldidagi minus boshqacha yoziladi, yuqorida biri bo'lmaydi. | A minus in front of a function is written differently, with no one above. |
| `q2.d` | первую производную | birinchi hosilani | the first derivative |
| `q2.d.hint` | Производная это другая тема и другая запись. | Hosila boshqa mavzu va boshqa yozuv. | The derivative is another topic and another notation. |
| `q3.prompt` | График обратной функции… | Teskari funksiyaning grafigi... | The graph of the inverse... |
| `q3.a` [верно] | симметричен относительно прямой игрек равно икс | igrek teng iks to'g'ri chizig'iga nisbatan simmetrik | is symmetric about the line y equals x |
| `q3.a.ok` | Да: точка меняет координаты местами, и это и есть отражение в пунктире. | Ha: nuqta koordinatalarini almashtiradi, va bu punktirdagi aks etishning o'zi. | Yes: the point swaps its coordinates, and that is the reflection in the dashed line. |
| `q3.b` | симметричен относительно оси икс | iks o'qiga nisbatan simmetrik | is symmetric about the x axis |
| `q3.b.hint` | Отражение в оси икс меняет знак игрек, а не меняет буквы местами. | Iks o'qidagi aks etish igrek ishorasini o'zgartiradi, harflarni almashtirmaydi. | Reflection in the x axis flips the sign of y; it does not swap the letters. |
| `q3.c` | совпадает с графиком прямой | to'g'risining grafigi bilan ustma-ust | coincides with the graph of the direct one |
| `q3.c.hint` | Совпадение бывает, но только в особых случаях, а не всегда. | Ustma-ust tushish bo'ladi, lekin faqat maxsus hollarda, doim emas. | Coinciding happens, but only in special cases, not always. |
| `q3.d` | симметричен относительно оси игрек | igrek o'qiga nisbatan simmetrik | is symmetric about the y axis |
| `q3.d.hint` | Это симметрия чётной функции, тема другая. | Bu juft funksiyaning simmetriyasi, mavzu boshqa. | That is the symmetry of an even function, a different topic. |
| `q4.prompt` | Основной период это… | Asosiy davr bu... | The fundamental period is... |
| `q4.a` [верно] | наименьший положительный период | eng kichik musbat davr | the smallest positive period |
| `q4.b` | самый удобный из периодов | davrlarning eng qulayi | the most convenient of the periods |
| `q4.b.hint` | Удобство не определение: учебник называет наименьший положительный. | Qulaylik ta'rif emas: darslik eng kichik musbatni ataydi. | Convenience is not a definition: the textbook names the smallest positive. |
| `q4.c` | любое число, при котором значения совпали | qiymatlar mos kelgan har qanday son | any number where the values happened to match |
| `q4.c.hint` | Совпадение в одной точке периодом не делает: равенство нужно при всех икс. | Bitta nuqtadagi moslik davr qilmaydi: tenglik hamma iksda kerak. | A match at one point makes no period: the equality must hold for all x. |
| `q4.d` | удвоенный период | ikkilangan davr | the doubled period |
| `q4.d.hint` | Удвоенный тоже период, но он больше, а нужен наименьший. | Ikkilangani ham davr, lekin u kattaroq, kerak bo'lgani esa eng kichigi. | The doubled one is a period too, but it is larger, and the smallest is wanted. |
| `audio.mount` | Четыре вопроса, и они идут в оценку. | To'rtta savol, va ular baholanadi. | Four questions, and they count towards the score. |
| `q1.done` | Скобки задают порядок, и читаются они изнутри. | Qavslar tartibni beradi, va ular ichdan o'qiladi. | The brackets set the order, and they are read from inside out. |
| `q2.done` | Обратная функция, а не дробь. Это запись, а не степень. | Teskari funksiya, kasr emas. Bu yozuv, daraja emas. | The inverse function, not a fraction. It is a notation, not a power. |
| `q3.done` | Зеркало это прямая игрек равно икс. | Ko'zgu bu igrek teng iks to'g'ri chizig'i. | The mirror is the line y equals x. |
| `q4.done` | Наименьший положительный, так говорит учебник. | Eng kichik musbat, darslik shunday deydi. | The smallest positive, that is what the textbook says. |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | XULOSA | THE SUMMARY |
| `title` | Три темы, одна мысль: порядок | Uch mavzu, bitta fikr: tartib | Three topics, one idea: order |
| `can.1` | Считаю сложную функцию в правильном порядке | Murakkab funksiyani to'g'ri tartibda hisoblayman | I compute a composite in the right order |
| `can.2` | Нахожу обратную и проверяю её подстановкой | Teskarisini topaman va qo'yib tekshiraman | I find the inverse and check it by substitution |
| `can.3` | Вижу, когда обратной нет | Teskarisi yo'q holatni ko'raman | I see when there is no inverse |
| `can.4` | Отличаю период от основного периода | Davrni asosiy davrdan ajrataman | I tell a period from the fundamental period |
| `levels.full` | Прошёл всё и разобрал ловушку | Hammasidan o'tdingiz va tuzoqni ochdingiz | Everything done, the trap taken apart |
| `levels.gap` | Сложная и обратная работают, период ещё нет | Murakkab va teskari ishlaydi, davr hali yo'q | Composite and inverse work, the period not yet |
| `levels.back` | Стоит вернуться к экрану три: внутренняя работает первой | Uchinchi ekranga qaytish kerak: ichkisi birinchi ishlaydi | Worth going back to screen three: the inner one works first |
| `bridge` | Дальше аркфункции: это обратные к синусу, косинусу и тангенсу, и там же появится условие единственности. | Keyingisi arkfunksiyalar: bular sinus, kosinus va tangensga teskari, va yagonalik sharti ham shu yerda chiqadi. | Next come the arc functions: inverses of sine, cosine and tangent, and the uniqueness condition shows up there. |
| `lifehack` | Обратную удобно проверять не формулой, а числом: прогони вход через прямую, потом через обратную. Если вернулся ровно тот же вход, обратная найдена верно. | Teskarisini formula bilan emas, son bilan tekshirish qulay: kirishni to'g'risidan, keyin teskarisidan o'tkazing. Aynan o'sha kirish qaytsa, teskarisi to'g'ri topilgan. | It is handy to check an inverse with a number rather than a formula: run an input through the direct one, then through the inverse. If exactly the same input comes back, the inverse is right. |
| `sheetTitle` | Шпаргалка урока | Dars shpargalkasi | The lesson sheet |
| `sheetSrc` | алгебра 2022, стр. 35, 37, 39 | algebra 2022, 35, 37, 39-betlar | algebra 2022, pages 35, 37, 39 |
| `audio.mount` | Прогноз с первого экрана и результат стоят рядом. | Birinchi ekrandagi taxmin va natija yonma-yon turadi. | The guess from screen one and the result stand side by side. |
| `audio.next` | Шпаргалка собрана по учебнику. Ниже видно, что умеешь. | Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi. | The sheet is put together from the textbook. Below you can see what you can do. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `f(g(5)) = g(f(5))` |
| `hook.b` | `f(g(5)) ≠ g(f(5))` |
| `proved` | `4 ≠ 22` |
| `law` | `f(x + nT) = f(x),   n ∈ Z` |
| `sheet.1` | `f(g(x)) = f(x − 3) = (x − 3)²` |
| `sheet.2` | `g(f(x)) = x² − 3` |
| `sheet.3` | `y = 2x + 6   ⇒   f⁻¹(x) = 0,5x − 3` |
| `sheet.4` | `x² = 9   ⇒   x = 3;  x = −3` |
| `sheet.5` | `T₀ = 4   ⇒   4, 8, 12, …` |
