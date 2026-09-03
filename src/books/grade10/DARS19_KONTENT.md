# Урок 30 — Логарифм. функция · КОНТЕНТ (этап 2)

**Читается и правится методистом.** Формат тот же, что в `DARS26_KONTENT.md`.

Скелет: `DARS29_31_SKELET.md` §8. Опора в учебнике: алгебра 2022, стр. 105–107, параграф
`LOGARIFM TUSHUNCHASI. LOGARIFMIK FUNKSIYA`.

**Главное решение урока.** Новых свойств здесь нет. Логарифмическая и показательная — одна пара,
отражённая относительно прямой `y = x`. Вход и выход меняются местами, и вместе с ними меняются
местами `D` и `E`; горизонтальная асимптота становится вертикальной. Урок читает известное с
другой стороны, и это показано отражением, а не списком.

**Обе кривые стоят в одном окне с одинаковым масштабом по обеим осям.** Иначе прямая `y = x`
пойдёт под другим углом и точки `(0; 1)` и `(1; 0)` не окажутся симметричными — то есть свидетель
солжёт. Масштаб задан в каркасе фигур (`pair`), урок его не переопределяет.

---

## Экран 1 · `hook` · ответ `pick4` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ФУНКЦИЯ | FUNKSIYA | THE FUNCTION |
| `title` | Дойдёт ли кривая до оси | Egri chiziq o'qqa yetadimi | Will the curve reach the axis |
| `row.a.name` | где-то пересечёт ось | qayerdadir o'qni kesadi | somewhere it crosses the axis |
| `row.b.name` | подойдёт и не коснётся | yaqinlashadi va tegmaydi | it comes close and never touches |
| `probe.question` | Какая запись верна? | Qaysi yozuv to'g'ri? | Which reading is correct? |
| `probe.a` | первая | birinchi | the first |
| `probe.b` [верно] | вторая | ikkinchi | the second |
| `probe.both` | обе | ikkisi ham | both |
| `probe.none` | ни одна | hech qaysi | neither |
| `probe.after` | Твой ответ записан. Сейчас пройдём по кривой влево и посмотрим. | Javobingiz yozib olindi. Endi egri chiziq bo'ylab chapga yuramiz va ko'ramiz. | Your answer is saved. Now we will walk left along the curve and see. |
| `audio.mount` | Кривая идёт вниз и прижимается к вертикальной оси. На глаз не различить, коснулась она оси или нет. | Egri chiziq pastga ketadi va vertikal o'qqa yopishadi. Ko'z bilan u o'qqa tegdimi yoki yo'qmi, ajratib bo'lmaydi. | The curve goes down and hugs the vertical axis. By eye you cannot tell whether it touched the axis or not. |
| `audio.r1` | Первая запись говорит, что где-то внизу кривая доходит до оси, и логарифм нуля существует. | Birinchi yozuv pastda qayerdadir egri chiziq o'qqa yetadi va nolning logarifmi mavjud deydi. | The first reading says that somewhere below the curve reaches the axis and the logarithm of zero exists. |
| `audio.r2` | Вторая говорит, что она подходит сколь угодно близко и всё равно не касается. | Ikkinchisi u qanchalik yaqin kelsa ham tegmaydi deydi. | The second says it comes as close as you like and still does not touch. |
| `audio.ask` | Как думаешь, какая верная? Пока просто предположи. | Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling. | Which one do you think is right? Just make a guess for now. |

**Формулы**

| Ключ | Значение |
|---|---|
| `expr` | `y = log₂ x` |
| `row.a.value` | `log₂ 0 = 0` |
| `row.b.value` | `x > 0` |

---

## Экран 2 · `support` · ответ `pick4` · тег `support`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОПОРА | TAYANCH | WHAT YOU KNOW |
| `title` | Три вопроса из прошлого урока | O'tgan darsdan uch savol | Three questions from the previous lesson |
| `q1.prompt` | Чему равен логарифм восьми по основанию два? | Sakkizning ikki asosga ko'ra logarifmi nechaga teng? | What is the logarithm of eight to base two? |
| `q1.a` [верно] | три | uch | three |
| `q1.b` | четыре | to'rt | four |
| `q1.b.hint` | Четыре вышло бы делением, а логарифм это показатель. | To'rt bo'lish bilan chiqardi, logarifm esa ko'rsatkich. | Four would come from dividing, and a logarithm is an exponent. |
| `q1.c` | одна треть | bir uchdan | one third |
| `q1.c.hint` | Одна треть выходит, когда основание и число меняют местами. | Bir uchdan asos va son joy almashganda chiqadi. | One third comes when the base and the number are swapped. |
| `q1.d` | восемь | sakkiz | eight |
| `q1.d.hint` | Восемь стоит под знаком, а спросили про показатель. | Sakkiz belgi ostida turadi, savol esa ko'rsatkich haqida. | Eight stands under the sign, and the question was about the exponent. |
| `q2.prompt` | Чему равен логарифм единицы? | Birning logarifmi nechaga teng? | What is the logarithm of one? |
| `q2.a` [верно] | нулю | nolga | zero |
| `q2.b` | единице | birga | one |
| `q2.b.hint` | Единице равен логарифм самого основания. | Birga asosning o'zining logarifmi teng. | One is the logarithm of the base itself. |
| `q2.c` | основанию | asosga | the base |
| `q2.c.hint` | Логарифм это показатель, а не основание. | Logarifm bu ko'rsatkich, asos emas. | A logarithm is an exponent, not a base. |
| `q2.d` | его не существует | u mavjud emas | it does not exist |
| `q2.d.hint` | Единица положительна, значит логарифм есть. | Bir musbat, demak logarifm bor. | One is positive, so the logarithm exists. |
| `q3.prompt` | Какое число может стоять под знаком логарифма? | Logarifm belgisi ostida qanday son turishi mumkin? | Which number can stand under a logarithm sign? |
| `q3.a` [верно] | только положительное | faqat musbat | only a positive one |
| `q3.b` | любое | har qanday | any |
| `q3.b.hint` | Тогда нашлась бы степень двойки, равная минус четырём, а её нет. | Unda minus to'rtga teng ikkining darajasi topilardi, u esa yo'q. | Then there would be a power of two equal to minus four, and there is none. |
| `q3.c` | только целое | faqat butun | only a whole number |
| `q3.c.hint` | Дробное тоже годится, лишь бы положительное. | Kasr ham yaraydi, faqat musbat bo'lsa. | A fractional one works too, as long as it is positive. |
| `q3.d` | только больше единицы | faqat birdan katta | only greater than one |
| `q3.d.hint` | Между нулём и единицей логарифм тоже есть, он просто отрицательный. | Nol va bir orasida ham logarifm bor, u shunchaki manfiy. | Between zero and one the logarithm exists too, it is just negative. |
| `audio.mount` | Три коротких вопроса. Все три понадобятся через минуту. | Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi. | Three short questions. All three will be needed in a minute. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `log₂ 8 = 3` |
| `q2.done` | `logₐ 1 = 0` |
| `q3.done` | `x > 0` |

---

## Экран 3 · `explain1` · ответ `number` · тег `d-vs-e`

Свидетель урока: отражение относительно прямой `y = x`.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Одна пара, отражённая | Bitta juftlik, aks etgan | One pair, reflected |
| `show.1.1` | знакомая кривая и прямая | tanish egri chiziq va to'g'ri chiziq | the familiar curve and a line |
| `show.1.2` | у прямой вход равен выходу | to'g'ri chiziqda kirish chiqishga teng | on the line the input equals the output |
| `show.2.1` | вторая кривая прорисовывается | ikkinchi egri chiziq chizilib boradi | the second curve draws itself |
| `show.2.2` | точка ноль и один стала один и ноль | nol va bir nuqtasi bir va nol bo'ldi | the point zero and one became one and zero |
| `audio.mount` | В окне знакомая кривая с урока про показательную функцию. Через неё проходит прямая, у которой вход равен выходу. | Oynada ko'rsatkichli funksiya darsidan tanish egri chiziq. Uning yonidan kirishi chiqishiga teng to'g'ri chiziq o'tadi. | In the window is the curve familiar from the lesson on the exponential function. A line runs through it where the input equals the output. |
| `audio.mirror*` | Теперь отразим её относительно этой прямой. Вторая кривая прорисовывается на глазах, и это логарифмическая. Она не новая фигура, а та же самая, у которой вход и выход поменялись местами. Посмотри на отмеченные точки. У показательной вход ноль давал выход один. У логарифмической вход один даёт выход ноль. Числа те же, только переставлены, и это верно для каждой точки. | Endi uni shu to'g'ri chiziqqa nisbatan aks ettiramiz. Ikkinchi egri chiziq ko'z oldida chizilib boradi, va bu logarifmik. U yangi figura emas, kirishi va chiqishi joy almashgan o'sha egri chiziq. Belgilangan nuqtalarga qarang. Ko'rsatkichlida kirish nol chiqish bir berardi. Logarifmikda kirish bir chiqish nol beradi. Sonlar o'sha, faqat joy almashgan, va bu har nuqta uchun to'g'ri. | Now let us reflect it in that line. The second curve draws itself before your eyes, and that is the logarithmic one. It is not a new shape but the same curve with the input and the output swapped. Look at the marked points. For the exponential, input zero gave output one. For the logarithmic, input one gives output zero. The same numbers, only rearranged, and this holds for every point. |
| `audio.work` | Посчитай сам. Чему равен выход логарифмической кривой при входе, равном единице? | O'zingiz hisoblang. Kirish birga teng bo'lganda logarifmik egri chiziqning chiqishi nechaga teng? | Work it out yourself. What is the output of the logarithmic curve at input one? |
| `work.prompt` | Чему равен выход при входе, равном единице? | Kirish birga teng bo'lganda chiqish nechaga teng? | What is the output at input one? |
| `work.ok` | Ноль. У показательной было наоборот: вход ноль давал выход один. | Nol. Ko'rsatkichlida teskari edi: kirish nol chiqish bir berardi. | Zero. For the exponential it was the other way: input zero gave output one. |
| `work.hint.1` | Посмотри на нижнюю кривую в точке, где вход равен единице. | Pastki egri chiziqqa kirish birga teng joyda qarang. | Look at the lower curve where the input equals one. |
| `work.hint.2` | Логарифм единицы разобран на прошлом уроке. | Birning logarifmi o'tgan darsda ko'rilgan. | The logarithm of one was covered last lesson. |
| `work.hint.3` | Ноль. | Nol. | Zero. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `y = 2^x` |
| `show.2.3` | `y = log₂ x` |
| `work.answer` | `0` |

---

## Экран 4 · `explain2` · ответ `number` · тег `d-vs-e`

Разграничение: то же отражение меняет местами `D` и `E`.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Область и значения поменялись местами | Soha va qiymatlar joy almashdi | The domain and the range swapped |
| `show.1.1` | у показательной вход любой | ko'rsatkichlida kirish har qanday | for the exponential any input |
| `show.1.2` | выход только положительный | chiqish faqat musbat | the output only positive |
| `show.2.1` | у логарифмической наоборот | logarifmikda teskari | for the logarithmic it is the other way |
| `show.2.2` | вход положительный, выход любой | kirish musbat, chiqish har qanday | positive input, any output |
| `audio.mount` | Отражение меняет местами не только точки, но и целые полосы. | Aks nafaqat nuqtalarni, butun polosalarni ham joy almashtiradi. | The reflection swaps not only points but whole bands. |
| `audio.swap*` | У показательной функции вход брали любой, а выход выходил только положительный. У логарифмической ровно наоборот: вход обязан быть положительным, а выход бывает любым, и вверх, и вниз без предела. Это не два разных факта, а один, прочитанный с двух сторон. Заучивать две таблицы не надо, достаточно помнить, что оси поменялись ролями. | Ko'rsatkichli funksiyada kirish har qanday olinardi, chiqish esa faqat musbat chiqardi. Logarifmikda aynan teskari: kirish musbat bo'lishi shart, chiqish esa har qanday, yuqoriga ham pastga ham cheksiz. Bu ikki har xil fakt emas, ikki tomondan o'qilgan bitta fakt. Ikki jadvalni yodlash shart emas, o'qlar rol almashganini eslash yetadi. | For the exponential any input was allowed and only a positive output came out. For the logarithmic it is exactly the other way: the input must be positive, and the output can be anything, up or down without limit. These are not two separate facts but one, read from two sides. There is no need to memorise two tables, it is enough to remember the axes swapped roles. |
| `audio.work` | Посчитай сам. Сколько значений икс приходится пропустить у логарифмической функции слева от нуля? | O'zingiz hisoblang. Logarifmik funksiyada noldan chapda iksning nechta qiymati tashlab ketiladi? | Work it out yourself. How many values of x to the left of zero does the logarithmic function skip? |
| `work.prompt` | Сколько значений икс годится слева от нуля? | Noldan chapda iksning nechta qiymati yaraydi? | How many values of x on the left of zero are allowed? |
| `work.ok` | Ни одного. Под знаком логарифма стоит только положительное число, и вся левая половина выпадает. | Birortasi ham. Logarifm belgisi ostida faqat musbat son turadi, va butun chap yarim tushib qoladi. | None. Only a positive number stands under the logarithm sign, and the whole left half drops out. |
| `work.hint.1` | Вспомни, что стоит под знаком логарифма. | Logarifm belgisi ostida nima turishini eslang. | Recall what stands under the logarithm sign. |
| `work.hint.2` | Отрицательное число степенью положительного основания не бывает. | Manfiy son musbat asosning darajasi bo'lmaydi. | A negative number is never a power of a positive base. |
| `work.hint.3` | Ни одного. | Birortasi ham. | None. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `D(2^x) = (−∞; +∞)` |
| `show.2.3` | `D(log₂ x) = (0; +∞)` |
| `work.answer` | `0` |

---

## Экран 5 · `explain3` · ответ `number` · тег `nol-v-oblasti-opredeleniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Ноль остаётся границей | Nol chegara bo'lib qoladi | Zero stays a boundary |
| `show.1.1` | идём по кривой к нулю | egri chiziq bo'ylab nolga yuramiz | we walk along the curve towards zero |
| `show.1.2` | значения уходят вниз без предела | qiymatlar pastga cheksiz ketadi | the values go down without limit |
| `show.2.1` | вертикальной оси кривая не достигает | egri chiziq vertikal o'qqa yetmaydi | the curve never reaches the vertical axis |
| `show.2.2` | значит ноль не входит | demak nol kirmaydi | so zero is not included |
| `audio.mount` | Пойдём по кривой влево, к нулю. Значения уходят вниз и становятся сколь угодно маленькими. | Egri chiziq bo'ylab chapga, nolga yuramiz. Qiymatlar pastga ketadi va istagancha kichik bo'lib qoladi. | Let us walk left along the curve, towards zero. The values go down and become as small as you like. |
| `audio.near*` | Вертикальная ось подписана как асимптота. Кривая подходит к ней сколь угодно близко, но не достигает. Причина уже известна с прошлого урока: логарифм это показатель, а степень двойки нулём не бывает. Значит нуля в области определения нет, и он остаётся только границей. Это то же самое, что было у показательной функции, только повёрнутое на четверть. | Vertikal o'q asimptota deb belgilangan. Egri chiziq unga qanchalik yaqin kelsa ham yetmaydi. Sabab o'tgan darsdan ma'lum: logarifm bu ko'rsatkich, ikkining darajasi esa nol bo'lmaydi. Demak nol aniqlanish sohasida yo'q, u faqat chegara bo'lib qoladi. Bu ko'rsatkichli funksiyadagining o'zi, faqat chorak burilgan. | The vertical axis is labelled as an asymptote. The curve comes as close to it as you like but never reaches it. The reason is known from last lesson: a logarithm is an exponent, and a power of two is never zero. So zero is not in the domain and stays only a boundary. This is the same as for the exponential function, only turned by a quarter. |
| `audio.work` | Посчитай сам. Сколько раз кривая пересекает вертикальную ось? | O'zingiz hisoblang. Egri chiziq vertikal o'qni necha marta kesadi? | Work it out yourself. How many times does the curve cross the vertical axis? |
| `work.prompt` | Сколько раз кривая пересекает вертикальную ось? | Egri chiziq vertikal o'qni necha marta kesadi? | How many times does the curve cross the vertical axis? |
| `work.ok` | Ни разу. Степень двойки нулём не бывает, поэтому ноль остаётся только границей. | Bir marta ham. Ikkining darajasi nol bo'lmaydi, shuning uchun nol faqat chegara bo'lib qoladi. | Never. A power of two is never zero, so zero stays only a boundary. |
| `work.hint.1` | Посмотри, где кривая ближе всего к оси, и проверь, коснулась ли она. | Egri chiziq o'qqa eng yaqin joyga qarang va tegdimi yoki yo'qmi tekshiring. | Look where the curve is closest to the axis and check whether it touched. |
| `work.hint.2` | Логарифм нуля означал бы степень двойки, равную нулю. | Nolning logarifmi ikkining nolga teng darajasini bildirardi. | The logarithm of zero would mean a power of two equal to zero. |
| `work.hint.3` | Ни разу. | Bir marta ham. | Never. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `log₂ 0,001 ≈ −10` |
| `show.2.3` | `D(y) = (0; +∞)` |
| `work.answer` | `0` |

---

## Экран 6 · `explain4` · ответ `number` · тег `vsegda-rastet`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Направление задаёт основание | Yo'nalishni asos beradi | The base sets the direction |
| `show.1.1` | основание меньше единицы | asos birdan kichik | the base is less than one |
| `show.1.2` | кривая пошла вниз | egri chiziq pastga ketdi | the curve went down |
| `show.2.1` | асимптота осталась той же | asimptota o'sha bo'lib qoldi | the asymptote stayed the same |
| `show.2.2` | точка один и ноль тоже | bir va nol nuqtasi ham | so did the point one and zero |
| `audio.mount` | Возьмём основание меньше единицы. Ноль целых пять десятых. | Birdan kichik asos olamiz. Nol butun besh o'ndan. | Let us take a base less than one. Zero point five. |
| `audio.flip*` | Кривая перевернулась и пошла вниз. Причина та же, что у показательной функции: при основании меньше единицы шаг вправо не умножает, а делит. Вид кривой не изменился, вертикальная асимптота осталась на месте, точка один и ноль тоже. Поменялось только направление. Значит логарифмическая функция, как и показательная, не всегда растёт. | Egri chiziq teskari bo'lib pastga ketdi. Sabab ko'rsatkichli funksiyadagining o'zi: asos birdan kichik bo'lganda o'ngga qadam ko'paytirmaydi, bo'ladi. Egri chiziqning ko'rinishi o'zgarmadi, vertikal asimptota joyida qoldi, bir va nol nuqtasi ham. Faqat yo'nalish o'zgardi. Demak logarifmik funksiya ham ko'rsatkichli kabi doim o'smaydi. | The curve flipped and went down. The reason is the same as for the exponential: with a base less than one a step right divides instead of multiplying. The shape did not change, the vertical asymptote stayed, so did the point one and zero. Only the direction changed. So a logarithmic function, like an exponential one, does not always grow. |
| `audio.work` | Посчитай сам. Чему равен логарифм восьми по основанию ноль целых пять десятых? | O'zingiz hisoblang. Sakkizning nol butun besh o'ndan asosga ko'ra logarifmi nechaga teng? | Work it out yourself. What is the logarithm of eight to base zero point five? |
| `work.prompt` | Чему равен логарифм восьми по основанию ноль целых пять десятых? | Sakkizning nol butun besh o'ndan asosga ko'ra logarifmi nechaga teng? | What is the logarithm of eight to base zero point five? |
| `work.ok` | Минус три. Ноль целых пять десятых в минус третьей степени это восемь, и логарифм это как раз минус три. | Minus uch. Nol butun besh o'ndan minus uchinchi darajada bu sakkiz, logarifm esa aynan minus uch. | Minus three. Zero point five to the minus third power is eight, and the logarithm is exactly minus three. |
| `work.hint.1` | Спроси, в какую степень возвести ноль целых пять десятых, чтобы вышло восемь. | So'rang: sakkiz chiqishi uchun nol butun besh o'ndanni qaysi darajaga ko'tarish kerak. | Ask which power of zero point five gives eight. |
| `work.hint.2` | Минус в показателе переворачивает дробь. | Ko'rsatkichdagi minus kasrni teskari qiladi. | The minus in the exponent turns the fraction over. |
| `work.hint.3` | Минус три. | Minus uch. | Minus three. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `y = log₀,₅ x` |
| `show.2.3` | `0 < a < 1` |
| `work.answer` | `−3` |

---

## Экран 7 · `explain5` · ответ `number` · тег `vsegda-rastet`

Задание взято из учебника, стр. 106, 6-misol.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ОБЪЯСНЕНИЕ | TUSHUNTIRISH | EXPLANATION |
| `title` | Сравнить, не вычисляя | Hisoblamasdan solishtirish | Compare without computing |
| `show.1.1` | основание меньше единицы | asos birdan kichik | the base is less than one |
| `show.1.2` | значит кривая убывает | demak egri chiziq kamayadi | so the curve decreases |
| `show.2.1` | больший аргумент даёт меньший логарифм | katta argument kichik logarifm beradi | a bigger argument gives a smaller logarithm |
| `show.2.2` | считать ничего не надо | hech narsani hisoblash shart emas | nothing needs computing |
| `audio.mount` | Два логарифма с одинаковым основанием ноль целых три десятых. Под знаком семь и восемь. | Asosi bir xil, nol butun uch o'ndan bo'lgan ikki logarifm. Belgi ostida yetti va sakkiz. | Two logarithms with the same base zero point three. Under the sign seven and eight. |
| `audio.cmp*` | Основание меньше единицы, значит кривая убывает. У убывающей кривой чем больше вход, тем меньше выход. Восемь больше семи, значит логарифм восьми меньше. Ни одного вычисления мы не сделали, хватило направления. Проверь по чертежу: обе точки лежат на одной кривой, и правая ниже левой. | Asos birdan kichik, demak egri chiziq kamayadi. Kamayuvchi egri chiziqda kirish qancha katta bo'lsa, chiqish shuncha kichik. Sakkiz yettidan katta, demak sakkizning logarifmi kichikroq. Birorta hisob qilmadik, yo'nalish yetdi. Chizmada tekshiring: ikkala nuqta bitta egri chiziqda yotadi, o'ngdagisi chapdagidan pastda. | The base is less than one, so the curve decreases. On a decreasing curve the bigger the input the smaller the output. Eight is greater than seven, so the logarithm of eight is smaller. We did no computation at all, the direction was enough. Check on the drawing: both points lie on one curve, and the right one is below the left. |
| `audio.work` | Посчитай сам. Какой из двух логарифмов больше, первый или второй? | O'zingiz hisoblang. Ikki logarifmning qaysi biri katta, birinchisimi yoki ikkinchisi? | Work it out yourself. Which of the two logarithms is bigger, the first or the second? |
| `work.prompt` | Какой логарифм больше, первый или второй? | Qaysi logarifm katta, birinchisimi yoki ikkinchisi? | Which logarithm is bigger, the first or the second? |
| `work.ok` | Первый. Основание меньше единицы, поэтому меньший аргумент даёт больший логарифм. | Birinchisi. Asos birdan kichik, shuning uchun kichik argument katta logarifm beradi. | The first. The base is less than one, so a smaller argument gives a bigger logarithm. |
| `work.hint.1` | Посмотри на основание: оно меньше единицы. | Asosga qarang: u birdan kichik. | Look at the base: it is less than one. |
| `work.hint.2` | При таком основании кривая убывает. | Bunday asosda egri chiziq kamayadi. | With such a base the curve decreases. |
| `work.hint.3` | Первый. | Birinchisi. | The first. |

**Формулы**

| Ключ | Значение |
|---|---|
| `show.1.3` | `1)  log₀,₃ 7     2)  log₀,₃ 8` |
| `show.2.3` | `log₀,₃ 7 > log₀,₃ 8` |
| `work.answer` | `1` |

---

## Экран 8 · `rule` · ответ `pick2` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | RULE |
| `title` | Логарифмическая функция | Logarifmik funksiya | The logarithmic function |
| `probe.question` | Чем логарифмическая функция отличается от показательной? | Logarifmik funksiya ko'rsatkichlidan nimasi bilan farq qiladi? | How does a logarithmic function differ from an exponential one? |
| `probe.a` [верно] | вход и выход поменялись местами | kirish va chiqish joy almashdi | the input and the output swapped |
| `probe.b` | у неё другая форма кривой | uning egri chizig'i boshqacha | its curve has a different shape |
| `probe.b.hint` | Форма та же: это одна кривая, отражённая относительно прямой. | Shakl o'sha: bu to'g'ri chiziqqa nisbatan aks etgan bitta egri chiziq. | The shape is the same: it is one curve reflected in a line. |
| `rule.lawLabel` | Определение | Ta'rif | The definition |
| `rule.lines.1` | Функцию вида игрек равен логарифму икс по основанию а называют логарифмической. | Ushbu y = logₐ x ko'rinishdagi funksiya logarifmik funksiya deyiladi. | A function of the form y equals log x to base a is called logarithmic. |
| `rule.lines.2` | Область определения все положительные числа, множество значений все действительные. | Aniqlanish sohasi barcha musbat sonlar, qiymatlar to'plami barcha haqiqiy sonlar. | The domain is all positive numbers, the range all real numbers. |
| `rule.lines.3` | При основании больше единицы функция возрастает, при основании между нулём и единицей убывает. | Asos birdan katta bo'lganda funksiya o'suvchi, nol va bir orasida bo'lganda kamayuvchi. | With a base above one the function grows, with a base between zero and one it decays. |
| `audio.mount` | Объяснение закончилось. Перед правилом один вопрос. | Tushuntirish tugadi. Qoidadan oldin bitta savol. | The explanation is over. One question before the rule. |
| `audio.rule*` | Кривая с асимптотой остаётся на экране, и правило открывается рядом. Определение взято у учебника слово в слово, а свойства в нём те же, которые мы получили отражением. | Asimptotali egri chiziq ekranda qoladi, va qoida yonida ochiladi. Ta'rif darslikdan so'zma-so'z olingan, undagi xossalar esa biz aks bilan olganlarning o'zi. | The curve with its asymptote stays on the screen, and the rule opens beside it. The definition is taken from the textbook word for word, and its properties are the ones we got by reflection. |

**Формулы**

| Ключ | Значение |
|---|---|
| `rule.law` | `y = logₐ x,   a > 0,  a ≠ 1` |

---

## Экран 9 · `drill` · ответ `match` · формат `match` · тег `vsegda-rastet`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Значение при аргументе четыре | Argument to'rt bo'lgandagi qiymat | The value at argument four |
| `match.prompt` | Соедини функцию со значением при аргументе, равном четырём. | Funksiyani argument to'rtga teng bo'lgandagi qiymati bilan birlashtiring. | Match each function with its value at argument four. |
| `match.ok` | При основании больше единицы значение положительно, при меньшем отрицательно. Направление видно сразу по основанию. | Asos birdan katta bo'lsa qiymat musbat, kichik bo'lsa manfiy. Yo'nalish asosdan darrov ko'rinadi. | With a base above one the value is positive, below one negative. The direction shows from the base at once. |
| `audio.mount` | Четыре функции и четыре значения. Соедини их. | To'rt funksiya va to'rt qiymat. Ularni birlashtiring. | Four functions and four values. Match them. |

**Формулы**

| Ключ | Значение |
|---|---|
| `match.left` | `y = log₂ x` · `y = log₄ x` · `y = log₀,₅ x` · `y = log₀,₂₅ x` |
| `match.a` | `2` |
| `match.b` | `1` |
| `match.c` | `−2` |
| `match.d` | `−1` |

---

## Экран 10 · `guided` · ответ `build` · формат `table` · тег `d-vs-e`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПРАКТИКА | MASHQ | PRACTICE |
| `title` | Четыре свойства по чертежу | Chizma bo'yicha to'rt xossa | Four properties from the drawing |
| `table.ok` | Четыре свойства закрыты. Все четыре получены отражением, а не заучены. | To'rt xossa yopildi. To'rttasi ham aks bilan olingan, yodlanmagan. | Four properties are closed. All four came from the reflection, not from memorising. |
| `table.wrong` | Смотри на чертёж: вход по горизонтали, выход по вертикали. | Chizmaga qarang: kirish gorizontal bo'yicha, chiqish vertikal bo'yicha. | Look at the drawing: the input along the horizontal, the output along the vertical. |
| `table.swap` | Записи перепутаны местами. У логарифмической функции ограничен вход, а не выход. | Yozuvlar joy almashgan. Logarifmik funksiyada chiqish emas, kirish cheklangan. | The readings are swapped. For a logarithmic function the input is limited, not the output. |
| `audio.mount` | Четыре свойства функции. Каждой строке поставь свою запись. | Funksiyaning to'rt xossasi. Har qatorga o'z yozuvini qo'ying. | Four properties of the function. Give each row its own reading. |

**Формулы**

| Ключ | Значение |
|---|---|
| `table.rows` | `D(y)  →  (0; +∞)` · `E(y)  →  (−∞; +∞)` · `Ox  →  (1; 0)` · `Oy  →  ∅` |
| `table.chips` | `(0; +∞)` · `(−∞; +∞)` · `(1; 0)` · `∅` |

---

## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`

Задание взято из учебника, стр. 106, 9-misol.

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЕЗ ПРИБОРА | ASBOBSIZ | NO INSTRUMENT |
| `title` | Область определения без чертежа | Chizmasiz aniqlanish sohasi | The domain without a drawing |
| `task.ok` | Единица. Под знаком стоит икс минус один, и это выражение должно быть положительным, значит икс больше единицы. | Bir. Belgi ostida iks minus bir turadi, va bu ifoda musbat bo'lishi kerak, demak iks birdan katta. | One. Under the sign stands x minus one, and that expression must be positive, so x is greater than one. |
| `task.hint.1` | Под знаком логарифма должно стоять положительное число. | Logarifm belgisi ostida musbat son turishi kerak. | A positive number must stand under the logarithm sign. |
| `task.hint.2` | Реши неравенство икс минус один больше нуля. | Iks minus bir noldan katta tengsizligini yeching. | Solve the inequality x minus one greater than zero. |
| `task.hint.3` | Единица. | Bir. | One. |
| `order.prompt` | Расставь по возрастанию. | O'sish tartibida joylashtiring. | Arrange in increasing order. |
| `order.title` | Какая запись меньше? | Qaysi yozuv kichikroq? | Which reading is smaller? |
| `order.ok` | Основание больше единицы, поэтому порядок аргументов и порядок логарифмов совпадают. | Asos birdan katta, shuning uchun argumentlar tartibi va logarifmlar tartibi bir xil. | The base is above one, so the order of the arguments and of the logarithms agree. |
| `order.bad` | Посчитай каждое значение, потом сравнивай. | Har qiymatni hisoblang, keyin solishtiring. | Compute each value, then compare. |
| `audio.mount` | На этом экране чертежа нет. На экзамене его тоже не будет. | Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi. | There is no drawing on this screen. There will be none at the exam either. |
| `audio.next` | Ответ запиши сам. | Javobni o'zingiz yozing. | Type the answer yourself. |

**Формулы**

| Ключ | Значение |
|---|---|
| `task.prompt` | `y = log₀,₅ (x − 1),   x > ?` |
| `task.answer` | `1` |
| `order.items` | `log₂ 1` · `log₂ 4` · `log₂ 8` · `log₂ 16` |
| `order.answer` | `log₂ 1  log₂ 4  log₂ 8  log₂ 16` |

---

## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ЛОВУШКА | TUZOQ | THE TRAP |
| `title` | Ответ почти верный. Где? | Javob deyarli to'g'ri. Qayerda? | The answer is almost right. Where? |
| `hint.r1` | Эта строка просто переписывает условие. | Bu qator shartni shunchaki qaytadan yozadi. | This line just rewrites the task. |
| `hint.r2` | Это верно: под знаком должно стоять положительное. | Bu to'g'ri: belgi ostida musbat turishi kerak. | This is right: a positive number must stand under the sign. |
| `hint.r4` | Это верное следствие предыдущей строки. | Bu oldingi qatorning to'g'ri natijasi. | This is a correct consequence of the previous line. |
| `proof` | Здесь ноль включили в область определения, а кривая до оси не доходит. | Bu yerda nol aniqlanish sohasiga kiritilgan, egri chiziq esa o'qqa yetmaydi. | Here zero was included in the domain, and the curve does not reach the axis. |
| `entry.prompt` | Какое число попало в ответ лишним? | Javobga qaysi son ortiqcha tushdi? | Which number got into the answer as an extra? |
| `entry.ok` | Ноль. Он остаётся границей, а в область определения не входит. | Nol. U chegara bo'lib qoladi, aniqlanish sohasiga kirmaydi. | Zero. It stays a boundary and is not in the domain. |
| `entry.hint.1` | Посмотри на вертикальную асимптоту. | Vertikal asimptotaga qarang. | Look at the vertical asymptote. |
| `entry.hint.2` | Кривая подходит к оси, но не касается. | Egri chiziq o'qqa yaqinlashadi, lekin tegmaydi. | The curve comes close to the axis but does not touch. |
| `entry.hint.3` | Ноль. | Nol. | Zero. |
| `audio.mount` | Задача. Найти область определения логарифмической функции. | Masala. Logarifmik funksiyaning aniqlanish sohasini topish. | A task. Find the domain of a logarithmic function. |
| `audio.next` | Четыре строки, все выглядят верными. Ищи первую неверную. | To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring. | Four lines, all look right. Look for the first wrong one. |

**Формулы**

| Ключ | Значение |
|---|---|
| `row.r1` | `y = log₂ x` |
| `row.r2` | `x > 0` |
| `row.r3` | `x ≥ 0` |
| `row.r4` | `D(y) = [0; +∞)` |
| `answerId` | `r3` |
| `entry.answer` | `0` |

---

## Экран 13 · `transfer` · ответ `number` · формат `number+multi` · тег `obratnoe`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ПЕРЕНОС | KO'CHIRISH | TRANSFER |
| `title` | По точке найди основание | Nuqta bo'yicha asosni toping | From a point back to the base |
| `entry.prompt` | Кривая проходит через точку с абсциссой девять и ординатой два. Какое у неё основание? | Egri chiziq abssissasi to'qqiz, ordinatasi ikki bo'lgan nuqtadan o'tadi. Uning asosi qanday? | The curve passes through the point with abscissa nine and ordinate two. What is its base? |
| `entry.ok` | Три. Логарифм девяти равен двум, значит основание в квадрате даёт девять. | Uch. To'qqizning logarifmi ikkiga teng, demak asos kvadratda to'qqiz beradi. | Three. The logarithm of nine is two, so the base squared gives nine. |
| `entry.hint.1` | Логарифм равен двум, значит основание берут в квадрате. | Logarifm ikkiga teng, demak asos kvadratga ko'tariladi. | The logarithm is two, so the base is squared. |
| `entry.hint.2` | Какое число в квадрате даёт девять. | Qaysi son kvadratda to'qqiz beradi. | Which number squared gives nine. |
| `entry.hint.3` | Три. | Uch. | Three. |
| `multi.prompt` | Отметь все функции, которые убывают. | Kamayuvchi hamma funksiyani belgilang. | Mark every function that decreases. |
| `multi.title` | Какие функции убывают? | Qaysi funksiyalar kamayadi? | Which functions decrease? |
| `multi.c.hint` | Основание больше единицы, кривая растёт. | Asos birdan katta, egri chiziq o'sadi. | The base is above one, the curve grows. |
| `multi.d.hint` | Десятка больше единицы, значит функция растёт. | O'n birdan katta, demak funksiya o'sadi. | Ten is above one, so the function grows. |
| `multi.ok` | Две из четырёх. Убывает та, у которой основание меньше единицы. | To'rttadan ikkitasi. Asosi birdan kichik bo'lgani kamayadi. | Two out of four. The one with a base below one decreases. |
| `audio.mount` | Теперь обратная задача. Дана точка, а найти надо основание. | Endi teskari masala. Nuqta berilgan, asosni topish kerak. | Now the inverse task. A point is given, and the base must be found. |
| `audio.work` | Сначала запиши основание, потом отметишь все убывающие функции. | Avval asosni yozing, keyin hamma kamayuvchi funksiyani belgilaysiz. | First type the base, then you will mark every decreasing function. |

**Формулы**

| Ключ | Значение |
|---|---|
| `entry.answer` | `3` |
| `multi.a` [верно] | `y = log₀,₅ x` |
| `multi.b` [верно] | `y = log₀,₃ x` |
| `multi.c` | `y = log₂ x` |
| `multi.d` | `y = log₁₀ x` |

---

## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `nol-v-oblasti-opredeleniya`

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | BLITZ |
| `title` | Четыре вопроса · идут в результат | To'rt savol · natijaga kiradi | Four questions · they count |
| `q1.prompt` | Какая область определения у логарифмической функции? | Logarifmik funksiyaning aniqlanish sohasi qanday? | What is the domain of a logarithmic function? |
| `q1.a` [верно] | положительные числа | musbat sonlar | the positive numbers |
| `q1.b` | все числа | hamma son | all numbers |
| `q1.b.hint` | Слева от нуля кривой нет вовсе. | Noldan chapda egri chiziq umuman yo'q. | To the left of zero there is no curve at all. |
| `q1.c` | от нуля до единицы | noldan birgacha | from zero to one |
| `q1.c.hint` | Правее единицы кривая продолжается без предела. | Birdan o'ngda egri chiziq cheksiz davom etadi. | To the right of one the curve continues without limit. |
| `q1.d` | целые числа | butun sonlar | the whole numbers |
| `q1.d.hint` | Между целыми кривая тоже проходит. | Butun sonlar orasidan ham egri chiziq o'tadi. | The curve passes between the whole numbers too. |
| `q2.prompt` | Какое множество значений у логарифмической функции? | Logarifmik funksiyaning qiymatlar to'plami qanday? | What is the range of a logarithmic function? |
| `q2.a` [верно] | все числа | hamma son | all numbers |
| `q2.b` | положительные числа | musbat sonlar | the positive numbers |
| `q2.b.hint` | Положительные значения были у показательной, здесь оси поменялись ролями. | Musbat qiymatlar ko'rsatkichlida edi, bu yerda o'qlar rol almashgan. | Positive values belonged to the exponential, here the axes swapped roles. |
| `q2.c` | от нуля до единицы | noldan birgacha | from zero to one |
| `q2.c.hint` | Кривая уходит и вверх, и вниз без предела. | Egri chiziq yuqoriga ham pastga ham cheksiz ketadi. | The curve goes both up and down without limit. |
| `q2.d` | только целые | faqat butun | only whole numbers |
| `q2.d.hint` | Между целыми значения тоже есть. | Butun sonlar orasida ham qiymatlar bor. | There are values between the whole numbers too. |
| `q3.prompt` | Через какую точку проходит любая логарифмическая кривая? | Har qanday logarifmik egri chiziq qaysi nuqtadan o'tadi? | Which point does every logarithmic curve pass through? |
| `q3.a` [верно] | абсцисса один, ордината ноль | abssissasi bir, ordinatasi nol | abscissa one, ordinate zero |
| `q3.a.ok` | Да. Логарифм единицы равен нулю при любом основании. | Ha. Birning logarifmi har qanday asosda nolga teng. | Yes. The logarithm of one is zero for any base. |
| `q3.b` | начало координат | koordinatalar boshi | the origin |
| `q3.b.hint` | В начале координат абсцисса ноль, а нуля в области определения нет. | Koordinatalar boshida abssissa nol, nol esa aniqlanish sohasida yo'q. | At the origin the abscissa is zero, and zero is not in the domain. |
| `q3.c` | абсцисса ноль, ордината один | abssissasi nol, ordinatasi bir | abscissa zero, ordinate one |
| `q3.c.hint` | Это точка показательной кривой, у логарифмической она отражённая. | Bu ko'rsatkichli egri chiziqning nuqtasi, logarifmikda u aks etgan. | That is a point of the exponential curve, for the logarithmic it is reflected. |
| `q3.d` | ни через какую общую | birorta umumiy nuqtadan ham | through no common point |
| `q3.d.hint` | Логарифм единицы равен нулю всегда, значит точка общая. | Birning logarifmi doim nolga teng, demak nuqta umumiy. | The logarithm of one is always zero, so the point is common. |
| `q4.prompt` | При каком основании функция убывает? | Qaysi asosda funksiya kamayadi? | With which base does the function decrease? |
| `q4.a` [верно] | меньше единицы | birdan kichik | less than one |
| `q4.b` | больше единицы | birdan katta | greater than one |
| `q4.b.hint` | При таком основании кривая растёт. | Bunday asosda egri chiziq o'sadi. | With such a base the curve grows. |
| `q4.c` | любом | har qanday | any |
| `q4.c.hint` | Две кривые на экране шли в разные стороны, значит основание решает. | Ekrandagi ikki egri chiziq har xil tomonga ketdi, demak asos hal qiladi. | The two curves on the screen went opposite ways, so the base decides. |
| `q4.d` | отрицательном | manfiy | negative |
| `q4.d.hint` | Отрицательное основание не берут вовсе. | Manfiy asos umuman olinmaydi. | A negative base is not taken at all. |
| `audio.mount` | Четыре коротких вопроса. Только этот экран идёт в результат. | To'rtta qisqa savol. Faqat shu ekran natijaga kiradi. | Four short questions. Only this screen counts. |

**Формулы**

| Ключ | Значение |
|---|---|
| `q1.done` | `D(y) = (0; +∞)` |
| `q2.done` | `E(y) = (−∞; +∞)` |
| `q3.done` | `(1; 0)` |
| `q4.done` | `0 < a < 1` |

---

## Экран 15 · `summary` · ответ `none` · тега нет

**Текст**

| Ключ | RU | UZ | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что осталось | Nima qoldi | What you take away |
| `can.1` | Вижу логарифмическую как отражение показательной | Logarifmikni ko'rsatkichlining aksi deb ko'raman | I see the logarithmic as a reflection of the exponential |
| `can.2` | Знаю, что вход положительный, а выход любой | Kirish musbat, chiqish har qanday ekanini bilaman | I know the input is positive and the output is anything |
| `can.3` | Направление читаю по основанию | Yo'nalishni asos bo'yicha o'qiyman | I read the direction from the base |
| `can.4` | Сравниваю логарифмы, не вычисляя | Logarifmlarni hisoblamasdan solishtiraman | I compare logarithms without computing |
| `levels.full` | Этот тип задач закрыт. | Bu turdagi masalalar yopildi. | This type of task is closed. |
| `levels.gap` | Одно место требует повтора: область определения. | Bitta joy takrorlashni talab qiladi: aniqlanish sohasi. | One place needs review: the domain. |
| `levels.back` | Вернись к правилу и к экрану 5. | Qoidaga va 5-ekranga qayting. | Go back to the rule and to screen 5. |
| `bridge` | Дальше под знаком окажется выражение с неизвестным, и понадобится полоса допустимых значений. | Keyin belgi ostida noma'lumli ifoda bo'ladi, va joiz qiymatlar polosasi kerak bo'ladi. | Next an expression with the unknown will stand under the sign, and the band of admissible values will be needed. |
| `lifehack` | Забыл, куда идёт кривая, посмотри на основание. Больше единицы вверх, меньше единицы вниз. | Egri chiziq qayoqqa ketishini esdan chiqardingizmi, asosga qarang. Birdan katta bo'lsa yuqoriga, kichik bo'lsa pastga. | Forgot which way the curve goes, look at the base. Above one it rises, below one it falls. |
| `sheetTitle` | Логарифмическая функция · шпаргалка | Logarifmik funksiya · shpargalka | The logarithmic function · cheat sheet |
| `sheetSrc` | 10 класс · урок 30 | 10-sinf · 30-dars | Grade 10 · lesson 30 |
| `audio.mount` | В начале урока нужно было выбрать одну из двух записей. Вот результат. | Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija. | At the start you had to choose one of two readings. Here is the result. |
| `audio.next` | Кривая подходит к вертикальной оси сколь угодно близко и не касается её. Ноль остаётся границей области определения, а её значением не становится. | Egri chiziq vertikal o'qqa qanchalik yaqin kelsa ham tegmaydi. Nol aniqlanish sohasining chegarasi bo'lib qoladi, uning qiymati bo'lmaydi. | The curve comes as close to the vertical axis as you like and never touches it. Zero stays the boundary of the domain and never becomes a value of it. |

**Формулы**

| Ключ | Значение |
|---|---|
| `hook.a` | `log₂ 0 = 0` |
| `hook.b` | `x > 0` |
| `proved` | `x > 0` |
| `law` | `y = logₐ x,   a > 0,  a ≠ 1` |
| `sheet.1` | `D(y) = (0; +∞)` |
| `sheet.2` | `E(y) = (−∞; +∞)` |
| `sheet.3` | `(1; 0)` |
| `sheet.4` | `a > 1   →   ↑` |
| `sheet.5` | `0 < a < 1   →   ↓` |
