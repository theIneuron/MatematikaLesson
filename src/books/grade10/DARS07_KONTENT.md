# Урок 7 — Функции · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS08_KONTENT.md`.

Скелет: `DARS07_10_SKELET.md` §9. Опора в учебнике: алгебра 2022, стр. 24 (`FUNKSIYA. FUNKSIYANING
BERILISH USULLARI`) и стр. 27 (`D(f)`, `E(f)`).

**Что этот урок вводит первым в классе:** «функция как правило», «область определения» и
«множество значений» как термины. Урок 6 уже сказал про синус: определён при любом `x`, значения
лежат в отрезке от минус единицы до единицы. Здесь это становится общим.

**Главное решение урока.** `D` читается **по горизонтали**, `E` — **по вертикали**, и обе полосы
подсвечиваются на одном чертеже. Свидетель урока — вертикальная прямая: она пересекает график
функции ровно один раз, а окружность дважды, и потому окружность функцией не является.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ФУНКЦИЯ | FUNKSIYA | THE FUNCTION |
| `title` | Всякая ли кривая — график функции? | Har qanday egri chiziq funksiya grafigimi? | Is every curve the graph of a function? |
| `row.a.name` | график это любая кривая | grafik bu har qanday egri chiziq | a graph is any curve |
| `row.b.name` | у одного входа один выход | bitta kirishga bitta chiqish | one input, one output |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас проверим прямой. | Javobingiz yozib olindi. Endi to'g'ri chiziq bilan tekshiramiz. | Your answer is saved. Now a line will check it. |
| `audio.mount*` | Точка идёт по кривой, и от неё падают два следа: один на горизонтальную ось, другой на вертикальную. | Nuqta egri chiziq bo'ylab yuradi, undan ikkita iz tushadi: biri gorizontal o'qqa, ikkinchisi vertikalga. | The point walks along the curve, dropping two traces: one on the horizontal axis, one on the vertical. |
| `audio.r1` | Первая запись говорит, что график это любая нарисованная кривая. | Birinchi yozuv grafik bu chizilgan har qanday egri chiziq deydi. | The first reading says a graph is any drawn curve. |
| `audio.r2` | Вторая говорит, что у одного входа должен быть ровно один выход. | Ikkinchisi bitta kirishga aynan bitta chiqish bo'lishi kerak deydi. | The second says one input must have exactly one output. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `x   →   y` |
| `row.a.value` | `x   →   y,  y` |
| `row.b.value` | `x   →   y` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса перед определением | Ta'rifdan oldin uch savol | Three questions before the definition |
| `q1.prompt` | Что показывает первое число пары координат? | Koordinatalar juftligining birinchi soni nimani ko'rsatadi? | What does the first number of a coordinate pair show? |
| `q1.a` [верно] | сдвиг по горизонтали | gorizontal bo'yicha siljish | the shift along the horizontal |
| `q1.b` | высоту | balandlikni | the height |
| `q1.b.hint` | Высота это второе число пары. | Balandlik juftlikning ikkinchi soni. | The height is the second number of the pair. |
| `q1.c` | расстояние до начала | boshgacha bo'lgan masofa | the distance to the origin |
| `q1.c.hint` | Расстояние считается из обоих чисел сразу, а не из первого. | Masofa ikkala sondan birga hisoblanadi, birinchisidan emas. | The distance is computed from both numbers, not from the first. |
| `q1.d` | номер точки | nuqtaning raqami | the number of the point |
| `q1.d.hint` | Координата это положение, а не номер. | Koordinata bu joylashuv, raqam emas. | A coordinate is a position, not a number in a list. |
| `q2.prompt` | Какие значения принимает синус? | Sinus qanday qiymatlarni oladi? | Which values does the sine take? |
| `q2.a` [верно] | от минус единицы до единицы | minus birdan birgacha | from minus one to one |
| `q2.b` | любые | har qanday | any values |
| `q2.b.hint` | Волна не выходит из полосы, это был прошлый урок. | To'lqin polosadan chiqmaydi, bu o'tgan darsda edi. | The wave stays inside the band, that was the previous lesson. |
| `q2.c` | только положительные | faqat musbat | only positive ones |
| `q2.c.hint` | Ниже оси значения отрицательны. | O'qdan pastda qiymatlar manfiy. | Below the axis the values are negative. |
| `q2.d` | от нуля до единицы | noldan birgacha | from zero to one |
| `q2.d.hint` | Нижняя половина волны уходит под ноль. | To'lqinning pastki yarmi nol ostiga ketadi. | The lower half of the wave goes below zero. |
| `q3.prompt` | При каких `x` определён синус? | Sinus qaysi `x` larda aniqlangan? | For which `x` is the sine defined? |
| `q3.a` [верно] | при любых | har qandayida | for all of them |
| `q3.b` | только при положительных | faqat musbatlarida | only for positive ones |
| `q3.b.hint` | Отрицательный поворот тоже даёт точку, это был пятый урок. | Manfiy burish ham nuqta beradi, bu beshinchi darsda edi. | A negative turn also gives a point, that was lesson five. |
| `q3.c` | только от нуля до трёхсот шестидесяти | faqat noldan uch yuz oltmishgacha | only from zero to three hundred sixty |
| `q3.c.hint` | За полным оборотом счёт продолжается, точка идёт дальше. | To'liq aylanadan keyin sanoq davom etadi, nuqta yuraveradi. | Past a full turn the count continues, the point goes on. |
| `q3.d` | только при целых | faqat butun sonlarda | only for whole numbers |
| `q3.d.hint` | Угол бывает и дробным, точка встанет между делениями. | Burchak kasr ham bo'ladi, nuqta bo'linmalar orasiga turadi. | An angle can be fractional, the point stands between the marks. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `(x; y)` |
| `q2.done` | `E(y) = [−1; 1]` |
| `q3.done` | `D(y) = (−∞; +∞)` |

---

## Экран 3 · `explain1` · ответ `lead` · тег `dva-y-na-odin-x`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Функция это правило | Funksiya bu qoida | A function is a rule |
| `show.1.1` | вход по горизонтали | kirish gorizontal bo'yicha | the input along the horizontal |
| `show.1.2` | выход по вертикали | chiqish vertikal bo'yicha | the output along the vertical |
| `show.2.1` | точка идёт, следы падают | nuqta yuradi, izlar tushadi | the point goes, the traces fall |
| `show.2.2` | у каждого входа один выход | har kirishga bitta chiqish | each input has one output |
| `audio.mount` | На горизонтальной оси вход, на вертикальной выход. | Gorizontal o'qda kirish, vertikalda chiqish. | The horizontal axis carries the input, the vertical one the output. |
| `audio.walk*` | Точка идёт по кривой, и от неё падают два следа. Левый след это вход, нижний это выход. Каждому входу отвечает ровно один выход, и в этом всё правило. | Nuqta egri chiziq bo'ylab yuradi, undan ikkita iz tushadi. Chapdagisi kirish, pastdagisi chiqish. Har kirishga aynan bitta chiqish mos keladi, qoida shundan iborat. | The point walks along the curve, dropping two traces. One is the input, the other the output. Each input matches exactly one output, and that is the whole rule. |
| `audio.work` | Посчитай сам. Сколько выходов у одного входа? | O'zingiz hisoblang. Bitta kirishda nechta chiqish bor? | Compute it yourself. How many outputs does one input have? |
| `work.prompt` | Сколько выходов даёт один вход? | Bitta kirish nechta chiqish beradi? | How many outputs does one input give? |
| `work.ok` | Один. Если бы их было два, правило не говорило бы, какой из них брать. | Bitta. Ikkita bo'lganda qoida qaysi birini olishni aytmagan bo'lardi. | One. If there were two, the rule would not say which one to take. |
| `work.hint.1` | Посмотри, сколько следов падает на вертикальную ось. | Vertikal o'qqa nechta iz tushishiga qarang. | Look how many traces fall on the vertical axis. |
| `work.hint.2` | След один, и он один для каждого положения точки. | Iz bitta, va u nuqtaning har holati uchun bitta. | There is one trace, and one for every position of the point. |
| `work.hint.3` | Один. | Bitta. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 4 · `explain2` · ответ `lead` · тег `dva-y-na-odin-x`

Свидетель урока: вертикальная прямая. У окружности она встречает кривую дважды, и потому
окружность не задаёт функцию.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Прямая проверяет кривую | To'g'ri chiziq egri chiziqni tekshiradi | A line checks the curve |
| `show.1.1` | вертикальная прямая едет | vertikal to'g'ri chiziq suriladi | a vertical line moves across |
| `show.1.2` | у графика одна встреча | grafikda bitta uchrashuv | the graph meets it once |
| `show.2.1` | у окружности их две | aylanada ikkita | the circle meets it twice |
| `show.2.2` | значит это не функция | demak bu funksiya emas | so this is not a function |
| `audio.mount` | Возьмём окружность. Она нарисована, но правило ли это. | Aylanani olaylik. U chizilgan, lekin qoidami. | Take a circle. It is drawn, but is it a rule. |
| `audio.test*` | Ведём вертикальную прямую. У графика функции она встречает кривую один раз, а здесь сразу два: одному входу отвечают два выхода. Правило не говорит, какой брать, значит правила нет. | Vertikal to'g'ri chiziq o'tkazamiz. Funksiya grafigida u egri chiziqni bir marta uchratadi, bu yerda esa birdan ikkita: bitta kirishga ikkita chiqish mos keladi. Qoida qaysi birini olishni aytmaydi, demak qoida yo'q. | We draw a vertical line. On the graph of a function it meets the curve once, here it meets it twice at once: one input matches two outputs. The rule does not say which to take, so there is no rule. |
| `audio.work` | Посчитай сам. Сколько раз прямая встретила окружность? | O'zingiz hisoblang. To'g'ri chiziq aylanani necha marta uchratdi? | Compute it yourself. How many times did the line meet the circle? |
| `work.prompt` | Сколько раз вертикальная прямая встретила окружность? | Vertikal to'g'ri chiziq aylanani necha marta uchratdi? | How many times did the vertical line meet the circle? |
| `work.ok` | Два. Одному входу отвечают два выхода, и правила не получается. | Ikkita. Bitta kirishga ikkita chiqish mos keladi, va qoida chiqmaydi. | Two. One input matches two outputs, and no rule comes out. |
| `work.hint.1` | Посчитай точки, где прямая пересекла кривую. | To'g'ri chiziq egri chiziqni kesgan nuqtalarni sanang. | Count the points where the line crossed the curve. |
| `work.hint.2` | Сверху одна и снизу одна. | Yuqorida bitta va pastda bitta. | One above and one below. |
| `work.hint.3` | Два. | Ikkita. | Two. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `2` |

---

## Экран 5 · `explain3` · ответ `number` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Область определения лежит по горизонтали | Aniqlanish sohasi gorizontal bo'yicha yotadi | The domain lies along the horizontal |
| `show.1.1` | какие входы вообще берутся | qanday kirishlar umuman olinadi | which inputs are taken at all |
| `show.1.2` | это и есть область определения | bu aniqlanish sohasi | that is the domain |
| `show.2.1` | полоса легла на горизонтальную ось | polosa gorizontal o'qqa yotdi | the band lies on the horizontal axis |
| `show.2.2` | у синуса она без края | sinusda u chekkasiz | for the sine it has no edge |
| `audio.mount` | Первый вопрос к любой функции: какие входы она принимает. | Har funksiyaga birinchi savol: u qanday kirishlarni qabul qiladi. | The first question about any function: which inputs it accepts. |
| `audio.dom*` | Полоса ложится на горизонтальную ось и показывает все входы сразу. У синуса она тянется без края в обе стороны: подходит любое число. Это и называют областью определения. | Polosa gorizontal o'qqa yotadi va hamma kirishni birdan ko'rsatadi. Sinusda u ikki tomonga chekkasiz cho'ziladi: har qanday son to'g'ri keladi. Buni aniqlanish sohasi deb ataydilar. | The band lies on the horizontal axis and shows every input at once. For the sine it stretches without end both ways: any number fits. That is called the domain. |
| `audio.work` | Посчитай сам. Сколько чисел не подходит синусу в качестве входа? | O'zingiz hisoblang. Sinusga kirish sifatida nechta son to'g'ri kelmaydi? | Compute it yourself. How many numbers do not fit the sine as an input? |
| `work.prompt` | Сколько чисел НЕ подходит синусу как вход? | Sinusga kirish sifatida nechta son to'g'ri KELMAYDI? | How many numbers do NOT fit the sine as an input? |
| `work.ok` | Ноль. Подходит любое число, поэтому полоса тянется без края. | Nol. Har qanday son to'g'ri keladi, shuning uchun polosa chekkasiz cho'ziladi. | Zero. Every number fits, and that is why the band has no end. |
| `work.hint.1` | Посмотри, где полоса обрывается. | Polosa qayerda uzilishiga qarang. | Look where the band breaks off. |
| `work.hint.2` | Она не обрывается ни слева, ни справа. | U na chapda, na o'ngda uziladi. | It breaks off neither on the left nor on the right. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Множество значений лежит по вертикали | Qiymatlar to'plami vertikal bo'yicha yotadi | The range lies along the vertical |
| `show.1.1` | какие выходы получаются | qanday chiqishlar chiqadi | which outputs come out |
| `show.1.2` | это множество значений | bu qiymatlar to'plami | that is the range |
| `show.2.1` | полоса встала на вертикальную ось | polosa vertikal o'qqa turdi | the band stands on the vertical axis |
| `show.2.2` | у синуса она с краями | sinusda u chekkali | for the sine it has edges |
| `audio.mount` | Второй вопрос: какие выходы у функции получаются. | Ikkinchi savol: funksiyada qanday chiqishlar chiqadi. | The second question: which outputs the function produces. |
| `audio.rng*` | Теперь полоса встаёт на вертикальную ось. У синуса она короткая: от минус единицы до единицы, и края у неё есть. Это множество значений, и путать его с областью определения нельзя: одно лежит по горизонтали, другое по вертикали. | Endi polosa vertikal o'qqa turadi. Sinusda u qisqa: minus birdan birgacha, va chekkalari bor. Bu qiymatlar to'plami, va uni aniqlanish sohasi bilan chalkashtirib bo'lmaydi: biri gorizontal, ikkinchisi vertikal bo'yicha yotadi. | Now the band stands on the vertical axis. For the sine it is short: from minus one to one, and it has edges. That is the range, and it must not be confused with the domain: one lies along the horizontal, the other along the vertical. |
| `audio.work` | Посчитай сам. Чему равно самое большое значение синуса? | O'zingiz hisoblang. Sinusning eng katta qiymati qancha? | Compute it yourself. What is the largest value of the sine? |
| `work.prompt` | Чему равно самое большое значение синуса? | Sinusning eng katta qiymati qancha? | What is the largest value of the sine? |
| `work.ok` | Единица. Верхний край полосы и есть наибольшее значение. | Bir. Polosaning yuqori cheti eng katta qiymat. | One. The upper edge of the band is the largest value. |
| `work.hint.1` | Посмотри на верхний край вертикальной полосы. | Vertikal polosaning yuqori chetiga qarang. | Look at the upper edge of the vertical band. |
| `work.hint.2` | Волна касается его на вершине. | To'lqin unga cho'qqida tegadi. | The wave touches it at the peak. |
| `work.hint.3` | Единица. | Bir. | One. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `1` |

---

## Экран 7 · `explain5` · ответ `number` · тег `funksiya-tolko-formula`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Формула, таблица и график — одно и то же | Formula, jadval va grafik — bir narsa | Formula, table and graph are the same thing |
| `show.1.1` | правило можно записать формулой | qoidani formula bilan yozish mumkin | the rule can be written as a formula |
| `show.1.2` | можно таблицей | jadval bilan ham | or as a table |
| `show.2.1` | можно графиком | grafik bilan ham | or as a graph |
| `show.2.2` | значение в точке одно и то же | nuqtadagi qiymat bir xil | the value at a point is the same |
| `audio.mount` | Одно и то же правило записывают тремя способами: формулой, таблицей и графиком. | Bitta qoida uch xil yoziladi: formula, jadval va grafik bilan. | The same rule is written in three ways: as a formula, a table and a graph. |
| `audio.same*` | Проверить просто: возьмём один и тот же вход и посмотрим выход в каждом способе. Формула даёт число, таблица даёт то же число, и точка на графике стоит на той же высоте. Значит это не три разные вещи, а три записи одного правила. | Tekshirish oson: bitta kirishni olamiz va har usulda chiqishga qaraymiz. Formula son beradi, jadval o'sha sonni beradi, va grafikdagi nuqta o'sha balandlikda turadi. Demak bu uch xil narsa emas, bitta qoidaning uch yozuvi. | Checking is easy: take the same input and look at the output in each way. The formula gives a number, the table gives the same number, and the point on the graph stands at the same height. So these are not three different things but three readings of one rule. |
| `audio.work` | Посчитай сам. Чему равен синус нуля? | O'zingiz hisoblang. Nolning sinusi qancha? | Compute it yourself. What is the sine of zero? |
| `work.prompt` | Чему равен sin 0? | sin 0 qancha? | What is sin 0? |
| `work.ok` | Ноль. И формула, и таблица, и график дают здесь одно и то же число. | Nol. Formula ham, jadval ham, grafik ham bu yerda bir xil son beradi. | Zero. The formula, the table and the graph all give the same number here. |
| `work.hint.1` | При нуле точка стоит на правом краю окружности. | Nolda nuqta aylananing o'ng chetida turadi. | At zero the point stands at the right edge of the circle. |
| `work.hint.2` | Высота у неё равна нулю. | Uning balandligi nolga teng. | Its height equals zero. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `work.answer` | `0` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Функция, `D` и `E` | Funksiya, `D` va `E` | The function, `D` and `E` |
| `probe.question` | Где читается область определения? | Aniqlanish sohasi qayerdan o'qiladi? | Where is the domain read? |
| `probe.a` [верно] | по горизонтальной оси | gorizontal o'q bo'yicha | along the horizontal axis |
| `probe.b` | по вертикальной оси | vertikal o'q bo'yicha | along the vertical axis |
| `probe.b.hint` | По вертикали читается множество значений, а не область определения. | Vertikal bo'yicha qiymatlar to'plami o'qiladi, aniqlanish sohasi emas. | Along the vertical the range is read, not the domain. |
| `rule.lawLabel` | Две оси | Ikki o'q | Two axes |
| `rule.lines.1` | Функция это правило: каждому входу отвечает ровно один выход. | Funksiya bu qoida: har kirishga aynan bitta chiqish mos keladi. | A function is a rule: each input matches exactly one output. |
| `rule.lines.2` | Область определения читается по горизонтали, множество значений по вертикали. | Aniqlanish sohasi gorizontal, qiymatlar to'plami vertikal bo'yicha o'qiladi. | The domain is read along the horizontal, the range along the vertical. |
| `rule.lines.3` | Правило можно задать формулой, таблицей или графиком: это три записи одного и того же. | Qoidani formula, jadval yoki grafik bilan berish mumkin: bu bir narsaning uch yozuvi. | The rule can be given by a formula, a table or a graph: three readings of one thing. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Полоса ложится ещё раз, и правило открывается рядом. Горизонталь это входы, вертикаль это выходы, и перепутать их значит перепутать вопрос. | Polosa yana bir bor yotadi, va qoida yonida ochiladi. Gorizontal bu kirishlar, vertikal bu chiqishlar, va ularni chalkashtirish savolni chalkashtirish demakdir. | The band lies down once more, and the rule opens beside it. The horizontal is the inputs, the vertical the outputs, and mixing them up means mixing up the question. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `D(y) = (−∞; +∞),   E(y) = [−1; 1]` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Функция и её значения | Funksiya va uning qiymatlari | The function and its values |
| `match.prompt` | Соедини функцию с её множеством значений. | Funksiyani o'z qiymatlar to'plami bilan birlashtiring. | Match the function with its range. |
| `match.ok` | Множество значений читается по вертикали: множитель растягивает полосу, а прибавленное число поднимает её целиком. | Qiymatlar to'plami vertikal bo'yicha o'qiladi: ko'paytuvchi polosani cho'zadi, qo'shilgan son esa uni butunlay ko'taradi. | The range is read along the vertical: the factor stretches the band, and an added number lifts the whole of it. |
| `audio.mount` | Четыре функции и четыре множества. Соедини их. | To'rt funksiya va to'rt to'plam. Ularni birlashtiring. | Four functions and four sets. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `y = sin x` · `y = 2 sin x` · `y = x` · `y = sin x + 3` |
| `match.a` | `[−1; 1]` |
| `match.b` | `[−2; 2]` |
| `match.c` | `(−∞; +∞)` |
| `match.d` | `[2; 4]` |

---

## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Прочитай график по шагам | Grafikni qadam bilan o'qing | Read the graph step by step |
| `order.prompt` | Расставь шаги по порядку. | Qadamlarni tartib bilan joylashtiring. | Put the steps in order. |
| `order.s1` | горизонтальная ось | gorizontal o'q | the horizontal axis |
| `order.s2` | область определения | aniqlanish sohasi | the domain |
| `order.s3` | вертикальная ось | vertikal o'q | the vertical axis |
| `order.s4` | множество значений | qiymatlar to'plami | the range |
| `order.ok` | Порядок такой всегда: сначала ось, потом запись. Если начать с записи, легко перепутать, какая ось за что отвечает. | Tartib doim shunday: avval o'q, keyin yozuv. Yozuvdan boshlansa, qaysi o'q nima uchunligini chalkashtirish oson. | The order is always this: the axis first, the reading second. Starting with the reading makes it easy to mix up which axis is which. |
| `order.bad` | Сначала горизонталь и её запись, потом вертикаль и её запись. | Avval gorizontal va uning yozuvi, keyin vertikal va uning yozuvi. | First the horizontal and its reading, then the vertical and its reading. |
| `audio.mount` | Четыре шага. Порядок ставишь ты. | To'rtta qadam. Tartibini o'zingiz qo'yasiz. | Four steps. You put them in order. |

**Формулы**

| Ключ | Значение |
|---|---|
| `order.mark` | `D → E` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Посчитай без чертежа | Chizmasiz hisoblang | Compute without a drawing |
| `task.ok` | Два. Множитель растягивает волну по вертикали, и верхний край полосы уходит до двойки. | Ikki. Ko'paytuvchi to'lqinni vertikal bo'yicha cho'zadi, va polosaning yuqori cheti ikkigacha ketadi. | Two. The factor stretches the wave vertically, and the upper edge of the band reaches two. |
| `task.hint.1` | Синус не бывает больше единицы. | Sinus birdan katta bo'lmaydi. | The sine is never more than one. |
| `task.hint.2` | Умножь наибольшее значение на два. | Eng katta qiymatni ikkiga ko'paytiring. | Multiply the largest value by two. |
| `task.hint.3` | Два. | Ikki. | Two. |
| `order.prompt` | Расставь по возрастанию верхние края. | Yuqori chetlarni o'sish tartibida joylashtiring. | Arrange the upper edges in increasing order. |
| `order.title` | У какой функции верхний край ниже? | Qaysi funksiyaning yuqori cheti pastroq? | Which function has the lower upper edge? |
| `order.ok` | Ты сравнил множители, а они и растягивают полосу значений. | Siz ko'paytuvchilarni solishtirdingiz, ular esa qiymatlar polosasini cho'zadi. | You compared the factors, and it is they that stretch the band of values. |
| `order.bad` | Посмотри на множитель перед синусом: он и задаёт верхний край. | Sinus oldidagi ko'paytuvchiga qarang: u yuqori chetni beradi. | Look at the factor before the sine: it sets the upper edge. |
| `audio.mount` | На этом экране чертежа нет. На экзамене его тоже не будет. | Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi. | There is no drawing on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `y = 2 sin x,   max y = ?` |
| `task.answer` | `2` |
| `order.items` | `0,5 sin x` · `sin x` · `2 sin x` · `3 sin x` |
| `order.answer` | `0,5 sin x  sin x  2 sin x  3 sin x` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ неверный. Где? | Javob noto'g'ri. Qayerda? | The answer is wrong. Where? |
| `hint.r1` | Эта строка верна: синус определён при любом входе. | Bu qator to'g'ri: sinus har qanday kirishda aniqlangan. | This line is right: the sine is defined for every input. |
| `hint.r2` | Эта строка тоже верна: значения лежат между минус единицей и единицей. | Bu qator ham to'g'ri: qiymatlar minus bir bilan bir orasida yotadi. | This line is right too: the values lie between minus one and one. |
| `hint.r4` | Эта строка повторяет ошибку предыдущей. Первая неверная строка выше. | Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida. | This line repeats the error of the previous one. The first wrong line is above. |
| `proof` | Оси перепутаны местами. | O'qlar joyi almashib ketgan. | The axes were swapped. |
| `entry.prompt` | Чему равен верхний край множества значений синуса? | Sinus qiymatlar to'plamining yuqori cheti qancha? | What is the upper edge of the range of the sine? |
| `entry.ok` | Единица. Множество значений читается по вертикали, и волна доходит до единицы. | Bir. Qiymatlar to'plami vertikal bo'yicha o'qiladi, va to'lqin birgacha yetadi. | One. The range is read along the vertical, and the wave reaches one. |
| `entry.hint.1` | Множество значений это выходы, а не входы. | Qiymatlar to'plami bu chiqishlar, kirishlar emas. | The range is the outputs, not the inputs. |
| `entry.hint.2` | Выходы читаются по вертикальной оси. | Chiqishlar vertikal o'q bo'yicha o'qiladi. | The outputs are read along the vertical axis. |
| `entry.hint.3` | Единица. | Bir. | One. |
| `audio.mount` | Задача. Записать область определения и множество значений синуса. | Masala. Sinusning aniqlanish sohasi va qiymatlar to'plamini yozish. | A task. Write the domain and the range of the sine. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `y = sin x` |
| `row.r2` | `−1 ≤ y ≤ 1` |
| `row.r3` | `D(y) = [−1; 1]` |
| `row.r4` | `E(y) = (−∞; +∞)` |
| `answerId` | `r3` |
| `entry.answer` | `1` |

---

## Экран 13 · `transfer` · ответ `lead` · формат `multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По записи выбрать функцию | Yozuvdan funksiyani tanlash | From the reading back to the function |
| `multi.prompt` | Отметь все функции, у которых множество значений это отрезок. | Qiymatlar to'plami kesma bo'lgan hamma funksiyani belgilang. | Mark every function whose range is a segment. |
| `multi.title` | У каких функций значения лежат в отрезке? | Qaysi funksiyalarda qiymatlar kesmada yotadi? | Which functions have their values in a segment? |
| `multi.d.hint` | У прямой значения уходят без края в обе стороны. | To'g'ri chiziqda qiymatlar ikki tomonga chekkasiz ketadi. | For the line the values run without end both ways. |
| `multi.e.hint` | Прямая со сдвигом всё равно уходит без края в обе стороны. | Siljigan to'g'ri chiziq ham ikki tomonga chekkasiz ketadi. | A shifted line still runs without end both ways. |
| `multi.ok` | Три из пяти. Отрезок это когда края есть с обеих сторон. | Beshtadan uchtasi. Kesma bu ikki tomondan ham chet bo'lgani. | Three out of five. A segment is when there are edges on both sides. |
| `audio.mount` | Теперь обратная задача. Дана запись, а выбрать надо функции. | Endi teskari masala. Yozuv berilgan, funksiyalarni tanlash kerak. | Now the inverse task. A reading is given, and the functions must be chosen. |
| `audio.next` | Отметь все, у которых значения лежат в отрезке. | Qiymatlari kesmada yotgan hammasini belgilang. | Mark all whose values lie in a segment. |

**Формулы**

| Ключ | Значение |
|---|---|
| `multi.a` [верно] | `y = sin x` |
| `multi.b` [верно] | `y = 2 sin x` |
| `multi.c` [верно] | `y = cos x` |
| `multi.d` | `y = x` |
| `multi.e` | `y = x + 1` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Где читается область определения? | Aniqlanish sohasi qayerdan o'qiladi? | Where is the domain read? |
| `q1.a` [верно] | по горизонтали | gorizontal bo'yicha | along the horizontal |
| `q1.b` | по вертикали | vertikal bo'yicha | along the vertical |
| `q1.b.hint` | По вертикали читаются выходы, то есть множество значений. | Vertikal bo'yicha chiqishlar, ya'ni qiymatlar to'plami o'qiladi. | Along the vertical the outputs are read, that is the range. |
| `q1.c` | по обеим осям | ikkala o'q bo'yicha | along both axes |
| `q1.c.hint` | Каждая ось отвечает за своё: одна за входы, другая за выходы. | Har o'q o'zi uchun javob beradi: biri kirishlar, ikkinchisi chiqishlar. | Each axis has its own job: one for inputs, the other for outputs. |
| `q1.d` | по формуле | formula bo'yicha | from the formula |
| `q1.d.hint` | По формуле тоже можно, но на графике это просто полоса. | Formuladan ham bo'ladi, lekin grafikda bu oddiy polosa. | The formula works too, but on the graph it is simply a band. |
| `q2.prompt` | Сколько выходов у одного входа у функции? | Funksiyada bitta kirishda nechta chiqish bor? | How many outputs does one input have in a function? |
| `q2.a` [верно] | ровно один | aynan bitta | exactly one |
| `q2.b` | два | ikkita | two |
| `q2.b.hint` | Два выхода бывают у окружности, и она функцией не является. | Ikkita chiqish aylanada bo'ladi, va u funksiya emas. | Two outputs happen for a circle, and it is not a function. |
| `q2.c` | сколько угодно | qancha bo'lsa ham | any number |
| `q2.c.hint` | Тогда правило не говорило бы, какой выход брать. | Unda qoida qaysi chiqishni olishni aytmagan bo'lardi. | Then the rule would not say which output to take. |
| `q2.d` | ни одного | hech qaysi | none |
| `q2.d.hint` | Без выхода правила бы не было вовсе. | Chiqishsiz qoida umuman bo'lmasdi. | Without an output there would be no rule at all. |
| `q3.prompt` | Чему равно множество значений синуса? | Sinusning qiymatlar to'plami nimaga teng? | What is the range of the sine? |
| `q3.a` [верно] | отрезок от минус единицы до единицы | minus birdan birgacha kesma | the segment from minus one to one |
| `q3.a.ok` | Да. Волна не выходит из полосы. | Ha. To'lqin polosadan chiqmaydi. | Yes. The wave stays inside the band. |
| `q3.b` | все числа | barcha sonlar | all numbers |
| `q3.b.hint` | Все числа это область определения, а не множество значений. | Barcha sonlar bu aniqlanish sohasi, qiymatlar to'plami emas. | All numbers is the domain, not the range. |
| `q4.prompt` | Является ли окружность графиком функции? | Aylana funksiya grafigimi? | Is a circle the graph of a function? |
| `q4.a` [верно] | нет | yo'q | no |
| `q4.b` | да | ha | yes |
| `q4.b.hint` | Вертикальная прямая пересекает её дважды. | Vertikal to'g'ri chiziq uni ikki marta kesadi. | A vertical line crosses it twice. |
| `q4.c` | только верхняя половина | faqat yuqori yarmi | only the upper half |
| `q4.c.hint` | Половина уже функция, но вопрос был про всю окружность. | Yarmi funksiya, lekin savol butun aylana haqida edi. | The half is a function, but the question was about the whole circle. |
| `q4.d` | зависит от радиуса | radiusga bog'liq | it depends on the radius | 
| `q4.d.hint` | Радиус ничего не меняет: прямая всё равно встретит кривую дважды. | Radius hech narsani o'zgartirmaydi: to'g'ri chiziq baribir ikki marta uchratadi. | The radius changes nothing: the line still meets the curve twice. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `D(y)` |
| `q2.done` | `x   →   y` |
| `q3.done` | `E(y) = [−1; 1]` |
| `q4.done` | `x = 1` |
| `angles` | `0°` · `90°` · `180°` · `270°` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Проверяю кривую вертикальной прямой | Egri chiziqni vertikal to'g'ri chiziq bilan tekshiraman | I check a curve with a vertical line |
| `can.2` | Читаю область определения по горизонтали | Aniqlanish sohasini gorizontal bo'yicha o'qiyman | I read the domain along the horizontal |
| `can.3` | Читаю множество значений по вертикали | Qiymatlar to'plamini vertikal bo'yicha o'qiyman | I read the range along the vertical |
| `can.4` | Знаю, что формула, таблица и график — одно правило | Formula, jadval va grafik bitta qoida ekanini bilaman | I know a formula, a table and a graph are one rule |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: какая ось за что отвечает. | Bitta joy takrorlashni talab qiladi: qaysi o'q nima uchun javob beradi. | One place needs review: which axis does what. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va 5-ekranga qayting. | Go back to the rule and to screen 5. |
| `bridge` | Блок 1 закрыт. Дальше уравнения: там та же окружность, но искать будут углы. | Birinchi blok yopildi. Keyin tenglamalar: u yerda o'sha aylana, lekin burchaklar qidiriladi. | Block one is closed. Next come equations: the same circle, but angles will be sought. |
| `lifehack` | Забыл, какая ось за что: вход идёт слева направо, как чтение. Выход поднимается вверх. | Qaysi o'q nima uchunligini unutdingizmi: kirish chapdan o'ngga, o'qishdek boradi. Chiqish yuqoriga ko'tariladi. | Forgot which axis is which: the input runs left to right, like reading. The output rises upwards. |
| `sheetTitle` | Функция · шпаргалка | Funksiya · shpargalka | The function · cheat sheet |
| `sheetSrc` | 10 класс · урок 7 | 10-sinf · 7-dars | Grade 10 · lesson 7 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija. | At the start you chose one of the two readings. Here is the result. |
| `audio.next` | Не всякая кривая задаёт функцию: у одного входа должен быть ровно один выход. | Har qanday egri chiziq funksiya bermaydi: bitta kirishga aynan bitta chiqish bo'lishi kerak. | Not every curve gives a function: one input must have exactly one output. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `y,  y` |
| `hook.b` | `x   →   y` |
| `proved` | `x   →   y` |
| `law` | `D(y) = (−∞; +∞),   E(y) = [−1; 1]` |
| `sheet.1` | `x   →   y` |
| `sheet.2` | `D(y)` |
| `sheet.3` | `E(y)` |
| `sheet.4` | `E(sin x) = [−1; 1]` |
| `sheet.5` | `E(2 sin x) = [−2; 2]` |
