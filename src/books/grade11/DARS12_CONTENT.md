# Урок 12. Логарифмические неравенства — контент

Этап 2 по `CLAUDE.md` §3. Вход — `DARS12_SKELET.md`. Выход — вход для сборки.

> **Этот файл — состояние контента на момент сборки, 2026-08-06.** Урок собран и принят;
> с тех пор часть текстов правилась прямо в уроке по замечаниям методиста (слайды 2, 3, 6
> и блиц). **Источник истины по текстам — `src/components/grade11/Dars12.jsx`**, контракт —
> `ETALON_11SINF.md`. Расхождения этого файла с уроком специально не вычищались: как
> образец формы этапа 2 он годен, как справочник по текстам — нет.
>
> Для нового урока контент пишется в свой файл `DARSNN_CONTENT.md` **до** сборки, и после
> сборки правки возвращаются в него — иначе следующий урок наследует устаревшее.

Три языка равнозначны: одинаковые числа, формулы и верные ответы. Русский — «ты», прошедшее
время без привязки к полу. Узбекский — латиница, апостроф только ASCII `'`, обращение `siz`.
Английский — нейтральный, без сокращений.

**Узбекская математическая терминология — draft, требует валидации узбекским методистом
математики.** Сводка терминов в конце файла. Я предлагаю варианты, но не подтверждаю их.

Голос мужской (`g=m`). Озвучка: один кусок — одна мысль, куски привязаны к шагам открытия.
В озвучке нет символов `< > = ⟺ ( ; )` — всё словами. Формулы читаются целиком.

---

## Общие строки интерфейса

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `next` | Продолжить | Davom etish | Continue |
| `back` | Назад | Orqaga | Back |
| `finish` | Завершить урок | Darsni yakunlash | Finish the lesson |
| `saved` | Результат сохранён | Natija saqlandi | Result saved |
| `check` | Проверить | Tekshirish | Check |
| `reset` | Заново | Qaytadan | Reset |
| `hintBtn` | Подсказка | Maslahat | Hint |
| `testPoint` | Проверить точкой | Nuqta bilan tekshirish | Check with a point |
| `answerIs` | Ответ | Javob | Answer |
| `isIn` | входит | kiradi | is a solution |
| `isNotIn` | не входит | kirmaydi | is not a solution |
| `undefined` | логарифм не определён | logarifm aniqlanmagan | the logarithm is undefined |
| `lessonTitle` | Логарифмические неравенства | Logarifmik tengsizliklar | Logarithmic inequalities |

`LESSON_ID = alg_11_12`

---

# Слайд 1. Два ответа, у которых нет общих чисел

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ЛОГАРИФМИЧЕСКИЕ НЕРАВЕНСТВА | LOGARIFMIK TENGSIZLIKLAR | LOGARITHMIC INEQUALITIES |
| `title` | На пробном ДТМ двое решили одно неравенство | Sinov DTM da ikki kishi bitta tengsizlikni yechdi | Two students solved the same inequality on a mock exam |
| `expr` | `log₅(x − 3) < 2` | то же | то же |
| `labelA` | первое решение | birinchi yechim | first solution |
| `labelB` | второе решение | ikkinchi yechim | second solution |
| `btnA` | Показать первое решение | Birinchi yechimni ko'rsatish | Show the first solution |
| `btnB` | Показать второе решение | Ikkinchi yechimni ko'rsatish | Show the second solution |
| `question` | Какой ответ верный? | Qaysi javob to'g'ri? | Which answer is correct? |
| `afterPredict` | Твой ответ записан. Сейчас проверим его точкой. | Javobingiz yozib olindi. Endi uni nuqta bilan tekshiramiz. | Your answer is saved. Now we will check it with a point. |

### Варианты, прогноз, оценки нет

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `a` | первое | birinchi | the first |
| `b` | второе | ikkinchi | the second |
| `both` | оба | ikkisi ham | both |
| `none` | ни один | hech qaysi | neither |

Верного ответа программа не сообщает. Ответ хранится до слайда 15.

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | На пробном экзамене двое решили одно и то же неравенство и получили разные ответы. | Sinov imtihonida ikki kishi bitta tengsizlikni yechdi va turli javob oldi. | On a mock exam two students solved the same inequality and got different answers. |
| 2 | `a` | Вот первый ответ. | Birinchi javob mana shu. | Here is the first answer. |
| 3 | `b` | А вот второй. Посмотри: во втором ответе есть числа левее тройки, а в первом их нет. | Ikkinchisi esa mana shu. Qarang: ikkinchi javobda uchdan chapda sonlar bor, birinchisida ular yo'q. | And here is the second one. Look: the second answer has numbers to the left of three, the first one does not. |
| 4 | `ask` | Как думаешь, какой ответ верный? Пока просто предположи. | Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling. | Which answer do you think is correct? Just make a guess for now. |

---

# Слайд 2. Восстановим то, что понадобится

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРКА ОПОРЫ | TAYANCHNI TEKSHIRISH | CHECKING THE BASICS |
| `title` | Вспомним три вещи | Uch narsani eslaymiz | Let us recall three things |
| `toTasks` | Теперь три коротких задания | Endi uchta qisqa topshiriq | Now three short tasks |

### Фаза А. Три карточки опоры

| # | RU | UZ (draft) | EN |
|---|---|---|---|
| 1 | Логарифм — это показатель степени | Logarifm — daraja ko'rsatkichi | A logarithm is an exponent |
| | `log₅ 25 = 2`, потому что `5² = 25` | `log₅ 25 = 2`, chunki `5² = 25` | `log₅ 25 = 2`, because `5² = 25` |
| 2 | Отрицательный показатель переворачивает дробь | Manfiy ko'rsatkich kasrni teskari aylantiradi | A negative exponent flips the fraction |
| | `(0,5)⁻¹ = 2`, знак числа не меняется | `(0,5)⁻¹ = 2`, sonning ishorasi o'zgarmaydi | `(0,5)⁻¹ = 2`, the sign of the number does not change |
| 3 | Логарифм возрастает или убывает | Logarifm o'sadi yoki kamayadi | A logarithm either increases or decreases |
| | у `log₂ x` точка едет вправо и вверх, у `log₀,₅ x` — вправо и вниз | `log₂ x` da nuqta o'ngga va yuqoriga boradi, `log₀,₅ x` da o'ngga va pastga | for `log₂ x` the point moves right and up, for `log₀,₅ x` right and down |

### Фаза Б. Три задания

**Задание 1.** `log₅ 25 =`

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `2` | ✓ | — | — | — |
| `b` | `5` | | Логарифм — это показатель степени, а не само число. | Logarifm — daraja ko'rsatkichi, sonning o'zi emas. | A logarithm is an exponent, not the number itself. |
| `c` | `10` | | Пять умножить на два — не то же самое, что пять в степени. | Beshni ikkiga ko'paytirish — beshning darajasi bilan bir xil emas. | Five times two is not the same as five raised to a power. |
| `d` | `0,5` | | Двадцать пять больше пяти, значит показатель больше единицы. | Yigirma besh beshdan katta, demak ko'rsatkich birdan katta. | Twenty five is greater than five, so the exponent is greater than one. |

**Задание 2.** `(0,5)⁻¹ =`

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `2` | ✓ | — | — | — |
| `b` | `−2` | **З3** | Отрицательный показатель переворачивает дробь, а не знак числа. | Manfiy ko'rsatkich kasrni teskari aylantiradi, sonning ishorasini emas. | A negative exponent flips the fraction, not the sign of the number. |
| `c` | `0,5` | | Показатель минус один, значит дробь переворачивается. | Ko'rsatkich minus bir, demak kasr teskari aylanadi. | The exponent is minus one, so the fraction flips. |
| `d` | `−0,5` | | Ни переворота, ни знака. Посчитай ещё раз. | Na teskari aylanish, na ishora. Yana bir hisoblang. | Neither a flip nor a sign change. Compute it again. |

**Задание 3.** Что больше: `log₀,₅ 4` или `log₀,₅ 8` ?
UZ: `log₀,₅ 4` va `log₀,₅ 8` dan qaysi biri katta?
EN: Which is greater, `log₀,₅ 4` or `log₀,₅ 8` ?

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `log₀,₅ 4` | ✓ | — | — | — |
| `b` | `log₀,₅ 8` | | Посмотри на график: у этой кривой точка едет вправо и вниз. Аргумент больше — логарифм меньше. | Grafikka qarang: bu chiziqda nuqta o'ngga va pastga boradi. Argument katta — logarifm kichik. | Look at the graph: on this curve the point moves right and down. Bigger argument, smaller logarithm. |
| `c` | равны · teng · they are equal | | Аргументы разные, значит и логарифмы разные. | Argumentlar turlicha, demak logarifmlar ham turlicha. | The arguments differ, so the logarithms differ too. |
| `d` | нельзя сравнить · solishtirib bo'lmaydi · cannot be compared | | Можно: посчитай оба или посмотри на график. | Mumkin: ikkisini hisoblang yoki grafikka qarang. | You can: compute both, or look at the graph. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Прежде чем решать спор, восстановим три вещи. Это не оценка. | Bahsni hal qilishdan oldin uch narsani eslaymiz. Bu baho emas. | Before we settle the argument, let us recall three things. This is not graded. |
| 2 | `c1` | Первое: логарифм — это показатель степени. | Birinchi: logarifm — daraja ko'rsatkichi. | First: a logarithm is an exponent. |
| 3 | `c2` | Второе: отрицательный показатель переворачивает дробь. | Ikkinchi: manfiy ko'rsatkich kasrni teskari aylantiradi. | Second: a negative exponent flips the fraction. |
| 4 | `c3` | Третье, и оно нам сегодня понадобится больше всего. Смотри на две кривые: у одной точка едет вправо и вверх, у другой вправо и вниз. | Uchinchi, va bugun bu eng ko'p kerak bo'ladi. Ikki chiziqqa qarang: birida nuqta o'ngga va yuqoriga, ikkinchisida o'ngga va pastga boradi. | Third, and today we will need this most of all. Look at the two curves: on one the point moves right and up, on the other right and down. |
| 5 | `tasks` | Теперь три коротких задания. | Endi uchta qisqa topshiriq. | Now three short tasks. |

---

# Слайд 3. Спор решает точка

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРИМ ТОЧКОЙ | NUQTA BILAN TEKSHIRAMIZ | LET US CHECK WITH A POINT |
| `title` | Подставим число в исходное неравенство | Sonni boshlang'ich tengsizlikka qo'yamiz | Substitute a number into the original inequality |
| `pickPoint` | Какую точку взять? | Qaysi nuqtani olamiz? | Which point shall we take? |
| `question` | Какой ответ верный? | Qaysi javob to'g'ri? | Which answer is correct? |

### Три точки

| Точка | Вычисление | Вывод RU | Вывод UZ (draft) | Вывод EN |
|---|---|---|---|---|
| `x = 0` | `log₅(0 − 3)` | под логарифмом −3, логарифм не определён | logarifm ostida −3, logarifm aniqlanmagan | −3 under the logarithm, it is undefined |
| `x = 4` | `log₅ 1 = 0` | 0 меньше 2, входит | 0 ikkidan kichik, kiradi | 0 is less than 2, it is a solution |
| `x = 128` | `log₅ 125 = 3` | 3 не меньше 2, не входит | 3 ikkidan kichik emas, kirmaydi | 3 is not less than 2, it is not a solution |

### Варианты

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `(3; 28)` | ✓ | Верно. Ты нашёл число, которое проходит по одному ответу и не проходит по другому. Это и есть способ проверки. | To'g'ri. Siz bir javobga mos, ikkinchisiga mos kelmaydigan sonni topdingiz. Tekshirish usuli aynan shu. | Correct. You found a number that fits one answer and fails the other. That is the way to check. |
| `b` | `(−∞; 28)` | **З1** | Возьми ноль. Под логарифмом получается минус три, а логарифма отрицательного числа не существует. Значит ноль решением быть не может — а в этот ответ он входит. | Nolni oling. Logarifm ostida minus uch chiqadi, manfiy sonning logarifmi esa yo'q. Demak nol yechim bo'lolmaydi — bu javobga esa u kiradi. | Take zero. Under the logarithm you get minus three, and there is no logarithm of a negative number. So zero cannot be a solution, yet this answer contains it. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Опора восстановлена. Вернёмся к спору. | Tayanch tiklandi. Bahsga qaytamiz. | The basics are back. Let us return to the argument. |
| 2 | `ask` | Спор решается не спором, а числом. Выбери точку и подставь её в исходное неравенство. | Bahs bahs bilan emas, son bilan hal qilinadi. Nuqtani tanlang va uni boshlang'ich tengsizlikka qo'ying. | An argument is settled by a number, not by arguing. Pick a point and substitute it into the original inequality. |
| 3 | `calc` | Считаем. | Hisoblaymiz. | Let us compute. |
| 4 | `mark` | Смотри, где эта точка на прямой. Она попала внутрь второго ответа и осталась вне первого. | Bu nuqta o'qda qayerda ekaniga qarang. U ikkinchi javob ichiga tushdi, birinchisidan tashqarida qoldi. | Look where this point sits on the line. It landed inside the second answer and outside the first. |
| 5 | `q` | Значит один из ответов набрал лишнего. Какой из них верный? | Demak javoblardan biri ortiqchasini oldi. Qaysi biri to'g'ri? | So one of the answers took in something extra. Which one is correct? |

---

# Слайд 4. График и его тень на оси

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ГДЕ ЖИВЁТ ЭТО НЕРАВЕНСТВО | BU TENGSIZLIK QAYERDA YASHAYDI | WHERE THIS INEQUALITY LIVES |
| `title` | Кривая начинается только там, где под логарифмом положительное | Chiziq faqat logarifm ostida musbat son bo'lgan joyda boshlanadi | The curve starts only where the expression under the logarithm is positive |
| `btnCurve` | Нарисовать кривую | Chiziqni chizish | Draw the curve |
| `btnLine` | Провести прямую `y = 2` | `y = 2` to'g'ri chizig'ini o'tkazish | Draw the line `y = 2` |
| `btnShade` | Показать тень на оси | O'qdagi soyani ko'rsatish | Show the shadow on the axis |
| `shadowLabel` | тень: `(3; 28)` | soya: `(3; 28)` | shadow: `(3; 28)` |
| `question` | Почему решения не могут быть левее тройки? | Nega yechimlar uchdan chapda bo'lolmaydi? | Why can there be no solutions to the left of three? |

### Варианты

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | там кривой не существует | u yerda chiziq mavjud emas | the curve does not exist there | ✓ |
| `b` | там кривая ниже прямой | u yerda chiziq to'g'ri chiziqdan pastda | the curve is below the line there | |
| `c` | там основание меняется | u yerda asos o'zgaradi | the base changes there | |
| `d` | там нет точки 28 | u yerda 28 nuqtasi yo'q | the point 28 is not there | |

### Разборы

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `b` | Ниже прямой она как раз там, где решения есть. Левее тройки её вообще нет. | To'g'ri chiziqdan pastda u aynan yechimlar bor joyda. Uchdan chapda esa u umuman yo'q. | Below the line is exactly where the solutions are. To the left of three the curve is not there at all. |
| `c` | Основание пять и слева, и справа. Смотри, где кривая начинается. | Asos chapda ham, o'ngda ham besh. Chiziq qayerda boshlanishiga qarang. | The base is five on both sides. Look at where the curve begins. |
| `d` | Точка двадцать восемь — правая граница. Вопрос про левую. | Yigirma sakkiz nuqtasi — o'ng chegara. Savol chap chegara haqida. | Twenty eight is the right boundary. The question is about the left one. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Точка показала, какой ответ верный. Теперь посмотрим, откуда берутся обе границы. | Nuqta qaysi javob to'g'ri ekanini ko'rsatdi. Endi ikkala chegara qayerdan kelishini ko'ramiz. | The point showed which answer is correct. Now let us see where both boundaries come from. |
| 2 | `curve` | Смотри, где начинается кривая. Левее тройки её нет совсем: под логарифмом там отрицательное число. | Chiziq qayerda boshlanishiga qarang. Uchdan chapda u umuman yo'q: logarifm ostida u yerda manfiy son. | Look at where the curve begins. To the left of three it does not exist at all: the expression under the logarithm is negative there. |
| 3 | `line` | Теперь проведём прямую на высоте двух. | Endi ikki balandlikda to'g'ri chiziq o'tkazamiz. | Now let us draw a line at height two. |
| 4 | `shade` | Нам нужно, где логарифм меньше двух — то есть где кривая ниже прямой. Вот эта часть. | Bizga logarifm ikkidan kichik joy kerak — ya'ni chiziq to'g'ri chiziqdan pastda bo'lgan joy. Mana shu qism. | We need where the logarithm is less than two, that is where the curve is below the line. This part. |
| 5 | `shadow` | А теперь главное: посмотри на её тень на горизонтальной оси. Это и есть ответ, от трёх до двадцати восьми. | Endi eng muhimi: uning gorizontal o'qdagi soyasiga qarang. Javob aynan shu, uchdan yigirma sakkizgacha. | And now the main thing: look at its shadow on the horizontal axis. That is the answer, from three to twenty eight. |

---

# Слайд 5. Приём и ПРАВИЛО 1

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Справа не логарифм. Сделаем его логарифмом | O'ngda logarifm emas. Uni logarifmga aylantiramiz | The right side is not a logarithm. Let us make it one |
| `row1` | `log₅(x − 3) < 2` | то же | то же |
| `row2` | `2 = log₅ 25` | то же | то же |
| `row3` | `log₅(x − 3) < log₅ 25` | то же | то же |
| `prompt` | Основание 5 больше единицы, функция возрастает. Что тогда верно для аргументов? | Asos 5 birdan katta, funksiya o'sadi. Unda argumentlar uchun nima to'g'ri? | The base 5 is greater than one, the function increases. What is then true for the arguments? |

### Варианты

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | больший логарифм — больший аргумент, знак тот же | katta logarifm — katta argument, ishora o'sha | bigger logarithm means bigger argument, the sign stays | ✓ |
| `b` | больший логарифм — меньший аргумент | katta logarifm — kichik argument | bigger logarithm means smaller argument | |
| `c` | аргументы сравнить нельзя | argumentlarni solishtirib bo'lmaydi | the arguments cannot be compared | |
| `d` | аргументы равны | argumentlar teng | the arguments are equal | |

### Разборы

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `b` | Это верно для убывающей функции. Основание пять больше единицы, кривая идёт вверх — вернись к графику на прошлом экране. | Bu kamayuvchi funksiya uchun to'g'ri. Asos besh birdan katta, chiziq yuqoriga ketadi — oldingi ekrandagi grafikka qaytib qarang. | That is true for a decreasing function. The base five is greater than one, the curve goes up — go back to the graph on the previous screen. |
| `c` | Можно. Функция монотонна: каждому значению отвечает ровно один аргумент. | Mumkin. Funksiya monoton: har bir qiymatga aynan bitta argument to'g'ri keladi. | You can. The function is monotone: each value corresponds to exactly one argument. |
| `d` | Равенства нет, есть неравенство. | Tenglik yo'q, tengsizlik bor. | There is no equality here, there is an inequality. |

### Карточка ПРАВИЛО 1

| Строка | RU | UZ (draft) | EN |
|---|---|---|---|
| badge | ПРАВИЛО 1. ОСНОВАНИЕ БОЛЬШЕ ЕДИНИЦЫ | 1-QOIDA. ASOS BIRDAN KATTA | RULE 1. BASE GREATER THAN ONE |
| 1 | `c = log_a aᶜ` — справа тоже логарифм, и `aᶜ > 0` | `c = log_a aᶜ` — o'ngda ham logarifm, va `aᶜ > 0` | `c = log_a aᶜ` — the right side is a logarithm too, and `aᶜ > 0` |
| 2 | `a > 1`: возрастает — большему логарифму больший аргумент | `a > 1`: o'sadi — katta logarifmga katta argument | `a > 1`: increasing — a bigger logarithm has a bigger argument |
| 3 | `log_a f(x) < c ⟺ 0 < f(x) < aᶜ` — ноль нужен: `f` зажат сверху | `log_a f(x) < c ⟺ 0 < f(x) < aᶜ` — nol kerak: `f` yuqoridan qisilgan | `log_a f(x) < c ⟺ 0 < f(x) < aᶜ` — the zero is needed: `f` is bounded above |
| 4 | `log_a f(x) > c ⟺ f(x) > aᶜ` — ноль не нужен: `aᶜ` уже положительно | `log_a f(x) > c ⟺ f(x) > aᶜ` — nol kerak emas: `aᶜ` allaqachon musbat | `log_a f(x) > c ⟺ f(x) > aᶜ` — no zero needed: `aᶜ` is already positive |
| example | образец: задачник, часть 2, стр. 100, № 32(3) | namuna: masalalar to'plami, 2-qism, 100-bet, № 32(3) | source: exercise book, part 2, p. 100, no. 32(3) |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Картинку мы увидели. Теперь получим то же самое записью. | Rasmni ko'rdik. Endi shuning o'zini yozuv bilan olamiz. | We have seen the picture. Now let us get the same thing in writing. |
| 2 | `toLog` | Слева логарифм, справа обычное число. Сделаем из числа логарифм: два — это логарифм двадцати пяти по основанию пять. | Chapda logarifm, o'ngda oddiy son. Sondan logarifm yasaymiz: ikki — asosi besh bo'lgan yigirma beshning logarifmi. | On the left a logarithm, on the right an ordinary number. Let us turn the number into a logarithm: two is the logarithm of twenty five to the base five. |
| 3 | `same` | Теперь слева и справа логарифмы по одному основанию. Основание больше единицы, кривая идёт вверх. | Endi chapda ham, o'ngda ham bir xil asosli logarifmlar. Asos birdan katta, chiziq yuqoriga ketadi. | Now both sides are logarithms with the same base. The base is greater than one, the curve goes up. |
| 4 | `q` | Что тогда верно для аргументов? | Unda argumentlar uchun nima to'g'ri? | What is then true for the arguments? |
| 5 | `rule` | Именно так. У большего логарифма больший аргумент, значит знак между аргументами тот же. И если аргумент оказался меньше числа, дописываем, что он больше нуля. | Aynan shunday. Katta logarifmning argumenti katta, demak argumentlar orasidagi ishora o'sha. Va agar argument sondan kichik chiqsa, uning noldan katta ekanini yozib qo'yamiz. | Exactly. A bigger logarithm has a bigger argument, so the sign between the arguments stays. And if the argument turned out smaller than the number, we add that it is greater than zero. |

---

# Слайд 6. Новый случай: основание меньше единицы

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | НОВЫЙ СЛУЧАЙ | YANGI HOLAT | A NEW CASE |
| `title` | Основание меньше единицы | Asos birdan kichik | The base is less than one |
| `wasLabel` | было | edi | before |
| `nowLabel` | стало | bo'ldi | now |
| `q1` | Чем вторая запись отличается от первой? | Ikkinchi yozuv birinchisidan nimasi bilan farq qiladi? | How does the second record differ from the first? |
| `q2` | Что получится? | Nima chiqadi? | What will come out? |

### Первый вопрос, оценивается

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | основание меньше единицы | asos birdan kichik | the base is less than one | ✓ |
| `b` | знак неравенства другой | tengsizlik ishorasi boshqa | the inequality sign is different | |
| `c` | в аргументе двойка | argumentda ikki bor | there is a two in the argument | |
| `d` | справа отрицательное | o'ngda manfiy son | the right side is negative | |

### Разборы первого вопроса

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `b` | Знак действительно другой. Но он мог быть любым и в первом случае. Смотри левее. | Ishora haqiqatan boshqa. Lekin u birinchi holatda ham har qanday bo'lishi mumkin edi. Chaproqqa qarang. | The sign is indeed different. But it could have been anything in the first case too. Look further left. |
| `c` | Двойка в аргументе ничего не меняет: это такой же линейный аргумент. | Argumentdagi ikki hech narsani o'zgartirmaydi: bu ham shunday chiziqli argument. | The two in the argument changes nothing: it is the same kind of linear argument. |
| `d` | Минус справа считать умеем, мы это проверили на опоре. Смотри на основание. | O'ngdagi minusni hisoblashni bilamiz, buni tayanchda tekshirdik. Asosga qarang. | We know how to handle the minus on the right, we checked that in the basics. Look at the base. |

### Прогноз, не оценивается

| id | Ответ | Что за ошибка |
|---|---|---|
| `a` | `(2; 3)` | верно, раскроется на слайде 7 |
| `b` | `(3; +∞)` | **З2**, знак между аргументами не поменян |
| `c` | `(2; +∞)` | знак поменян, условие потеряно |
| `d` | `(−∞; 3)` | условие есть, знак не поменян |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Первое правило готово. Но оно работает не всегда — смотри, что изменилось. | Birinchi qoida tayyor. Lekin u har doim ishlamaydi — nima o'zgarganiga qarang. | The first rule is ready. But it does not always work — look at what has changed. |
| 2 | `now` | В прошлом примере основание было больше единицы. А теперь ноль целых пять десятых. | Oldingi misolda asos birdan katta edi. Endi esa nol butun besh o'ndan. | In the previous example the base was greater than one. Now it is zero point five. |
| 3 | `q1` | Чем эта запись отличается от прежней? | Bu yozuv oldingisidan nimasi bilan farq qiladi? | How does this record differ from the previous one? |
| 4 | `q2` | Как думаешь, что получится? Просто предположи. | Sizningcha nima chiqadi? Shunchaki taxmin qiling. | What do you think will come out? Just make a guess. |

---

# Слайд 7. Две точки и два множества

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРИМ ТОЧКАМИ | NUQTALAR BILAN TEKSHIRAMIZ | LET US CHECK WITH POINTS |
| `title` | Два ответа, у которых нет ни одного общего числа | Ikki javob, ularda birorta ham umumiy son yo'q | Two answers with not a single number in common |
| `varA` | вариант A | A varianti | option A |
| `varB` | вариант B | B varianti | option B |
| `btn1` | Подставить `x = 2,5` | `x = 2,5` ni qo'yish | Substitute `x = 2,5` |
| `btn2` | Подставить `x = 4` | `x = 4` ni qo'yish | Substitute `x = 4` |
| `onlyA` | 2,5 только в A | 2,5 faqat A da | 2,5 is only in A |
| `onlyB` | 4 только в B | 4 faqat B da | 4 is only in B |
| `writeAnswer` | Запиши ответ | Javobni yozing | Write the answer |

### Две точки

| Точка | Вычисление | Вывод RU | Вывод UZ (draft) | Вывод EN |
|---|---|---|---|---|
| `x = 2,5` | `log₀,₅ 1 = 0` | 0 больше −1, входит | 0 minus birdan katta, kiradi | 0 is greater than −1, it is a solution |
| `x = 4` | `log₀,₅ 4 = −2` | −2 меньше −1, не входит | −2 minus birdan kichik, kirmaydi | −2 is less than −1, it is not a solution |

### Ответ записывает ученик

Верно `(2; 3)`.

| Записал | RU | UZ (draft) | EN |
|---|---|---|---|
| `(2; 3)` | Верно. Основание меньше единицы, поэтому знак между аргументами перевернулся — и ответ оказался между двойкой и тройкой, а не правее. | To'g'ri. Asos birdan kichik, shuning uchun argumentlar orasidagi ishora ag'darildi — va javob o'ngda emas, ikki bilan uch orasida chiqdi. | Correct. The base is less than one, so the sign between the arguments flipped — and the answer turned out to be between two and three, not further right. |
| `(3; +∞)` | Подставь `x = 4`. Слева получается минус два, а нужно больше минус единицы. Минус два меньше минус единицы. | `x = 4` ni qo'ying. Chapda minus ikki chiqadi, kerak esa minus birdan katta. Minus ikki minus birdan kichik. | Substitute `x = 4`. The left side gives minus two, but we need greater than minus one. Minus two is less than minus one. |
| прочее | Проверь двумя точками: два с половиной должно входить, четыре — нет. | Ikki nuqta bilan tekshiring: ikki yarim kirishi kerak, to'rt esa yo'q. | Check with two points: two and a half must be in, four must not. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Ты предположил ответ. Проверим его точками. | Siz javobni taxmin qildingiz. Uni nuqtalar bilan tekshiramiz. | You made a guess. Let us check it with points. |
| 2 | `p1` | Берём точку из первого ответа. Слева получился ноль. Ноль больше минус единицы, значит два с половиной входит. | Birinchi javobdan nuqta olamiz. Chapda nol chiqdi. Nol minus birdan katta, demak ikki yarim kiradi. | Take a point from the first answer. The left side gives zero. Zero is greater than minus one, so two and a half is a solution. |
| 3 | `p2` | Теперь точку из второго ответа. Слева минус два. Минус два не больше минус единицы, значит четвёрка не входит. | Endi ikkinchi javobdan nuqta. Chapda minus ikki. Minus ikki minus birdan katta emas, demak to'rt kirmaydi. | Now a point from the second answer. The left side is minus two. Minus two is not greater than minus one, so four is not a solution. |
| 4 | `write` | Два с половиной есть только в первом ответе, четвёрка — только во втором. Запиши ответ сам. | Ikki yarim faqat birinchi javobda, to'rt esa faqat ikkinchisida. Javobni o'zingiz yozing. | Two and a half is only in the first answer, four only in the second. Write the answer yourself. |

---

# Слайд 8. ПРАВИЛО 2 и одна сводка

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Основание меньше единицы. Что верно для аргументов? | Asos birdan kichik. Argumentlar uchun nima to'g'ri? | The base is less than one. What is true for the arguments? |
| `row1` | `−1 = log₀,₅ 2` | то же | то же |
| `row2` | `log₀,₅(2x − 4) > log₀,₅ 2` | то же | то же |
| `btnCombine` | Собрать одно правило | Bitta qoidaga yig'ish | Combine into one rule |

### Варианты

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | больший логарифм — меньший аргумент, знак меняется | katta logarifm — kichik argument, ishora o'zgaradi | bigger logarithm means smaller argument, the sign changes | ✓ |
| `b` | больший логарифм — больший аргумент | katta logarifm — katta argument | bigger logarithm means bigger argument | |
| `c` | зависит от числа справа | o'ngdagi songa bog'liq | it depends on the number on the right | |
| `d` | логарифм не определён | logarifm aniqlanmagan | the logarithm is undefined | |

### Разборы

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `b` | Это для возрастающей функции. Здесь основание меньше единицы, кривая идёт вниз — вспомни опору. | Bu o'suvchi funksiya uchun. Bu yerda asos birdan kichik, chiziq pastga ketadi — tayanchni eslang. | That is for an increasing function. Here the base is less than one, the curve goes down — recall the basics. |
| `c` | Не зависит. Поменяй минус один на плюс один — направление останется тем же. | Bog'liq emas. Minus birni plyus birga o'zgartiring — yo'nalish o'sha qoladi. | It does not. Change minus one to plus one — the direction stays the same. |
| `d` | Определён. Ноль целых пять десятых — допустимое основание: положительное и не равно единице. | Aniqlangan. Nol butun besh o'ndan — mumkin bo'lgan asos: musbat va birga teng emas. | It is defined. Zero point five is a valid base: positive and not equal to one. |

### Карточка ПРАВИЛО 2

| Строка | RU | UZ (draft) | EN |
|---|---|---|---|
| badge | ПРАВИЛО 2. ОСНОВАНИЕ МЕНЬШЕ ЕДИНИЦЫ | 2-QOIDA. ASOS BIRDAN KICHIK | RULE 2. BASE LESS THAN ONE |
| 1 | приём тот же: `c = log_a aᶜ` | usul o'sha: `c = log_a aᶜ` | the same device: `c = log_a aᶜ` |
| 2 | `0 < a < 1`: убывает — большему логарифму МЕНЬШИЙ аргумент | `0 < a < 1`: kamayadi — katta logarifmga KICHIK argument | `0 < a < 1`: decreasing — a bigger logarithm has a SMALLER argument |
| 3 | `log_a f(x) > c ⟺ 0 < f(x) < aᶜ` — ноль нужен: `f` зажат сверху | `log_a f(x) > c ⟺ 0 < f(x) < aᶜ` — nol kerak: `f` yuqoridan qisilgan | `log_a f(x) > c ⟺ 0 < f(x) < aᶜ` — the zero is needed: `f` is bounded above |
| 4 | `log_a f(x) < c ⟺ f(x) > aᶜ` — ноль не нужен: `aᶜ` уже положительно | `log_a f(x) < c ⟺ f(x) > aᶜ` — nol kerak emas: `aᶜ` allaqachon musbat | `log_a f(x) < c ⟺ f(x) > aᶜ` — no zero needed: `aᶜ` is already positive |
| example | образец: задачник, часть 2, стр. 100, № 32(4) | namuna: masalalar to'plami, 2-qism, 100-bet, № 32(4) | source: exercise book, part 2, p. 100, no. 32(4) |

### Сводка: ОДНО ПРАВИЛО УРОКА

| Строка | RU | UZ (draft) | EN |
|---|---|---|---|
| badge | ОДНО ПРАВИЛО УРОКА | DARSNING BITTA QOIDASI | THE ONE RULE OF THIS LESSON |
| 1 | справа сделай логарифм: `c = log_a aᶜ`, `aᶜ > 0` | o'ngni logarifmga aylantir: `c = log_a aᶜ`, `aᶜ > 0` | make the right side a logarithm: `c = log_a aᶜ`, `aᶜ > 0` |
| 2 | отбрось логарифмы: возрастает — знак тот же, убывает — знак другой | logarifmlarni tashla: o'sadi — ishora o'sha, kamayadi — ishora boshqa | drop the logarithms: increasing — same sign, decreasing — opposite sign |
| 3 | аргумент зажат сверху — пиши `0 < f(x) < aᶜ`; аргумент больше числа — ноль не нужен | argument yuqoridan qisilgan — `0 < f(x) < aᶜ` deb yoz; argument sondan katta — nol kerak emas | argument bounded above — write `0 < f(x) < aᶜ`; argument greater than the number — no zero needed |
| 4 | проверь ответ точкой внутри и точкой снаружи | javobni ichkaridagi va tashqaridagi nuqta bilan tekshir | check the answer with a point inside and a point outside |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Точки показали ответ. Получим его записью, тем же приёмом. | Nuqtalar javobni ko'rsatdi. Uni o'sha usul bilan, yozuv orqali olamiz. | The points showed the answer. Let us get it in writing, with the same device. |
| 2 | `toLog` | Минус единица — это логарифм двойки по основанию ноль целых пять десятых. | Minus bir — asosi nol butun besh o'ndan bo'lgan ikkining logarifmi. | Minus one is the logarithm of two to the base zero point five. |
| 3 | `q` | Теперь обе части логарифмы. Основание меньше единицы, кривая идёт вниз. Что верно для аргументов? | Endi ikki tomon ham logarifm. Asos birdan kichik, chiziq pastga ketadi. Argumentlar uchun nima to'g'ri? | Now both sides are logarithms. The base is less than one, the curve goes down. What is true for the arguments? |
| 4 | `rule` | Верно. У большего логарифма меньший аргумент, поэтому знак между аргументами меняется. | To'g'ri. Katta logarifmning argumenti kichik, shuning uchun argumentlar orasidagi ishora o'zgaradi. | Correct. A bigger logarithm has a smaller argument, so the sign between the arguments changes. |
| 5 | `both` | А теперь собери оба случая в одно правило. | Endi ikkala holatni bitta qoidaga yig'ing. | Now combine both cases into one rule. |

---

# Слайд 9. Поставь знак сам

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПОСТАВЬ САМ | O'ZINGIZ QO'YING | PLACE IT YOURSELF |
| `title` | Поставь знак так, чтобы записи были равносильны | Yozuvlar teng kuchli bo'lishi uchun ishorani qo'ying | Place the sign so that the two records are equivalent |
| `template` | `log₀,₅(2x − 4) > log₀,₅ 2 ⟺ 0 < 2x − 4 ⬚ 2` | то же | то же |
| `signsLabel` | Знаки | Ishoralar | Signs |
| `checkNote` | Проверка: `x = 2,5` → слева входит, справа 1 меньше 2 | Tekshiruv: `x = 2,5` → chapda kiradi, o'ngda 1 ikkidan kichik | Check: `x = 2,5` → on the left it is a solution, on the right 1 is less than 2 |
| `question` | От чего зависит направление знака между аргументами? | Argumentlar orasidagi ishora yo'nalishi nimaga bog'liq? | What does the direction of the sign between the arguments depend on? |

Верно `<`.

### Неверный знак

| Поставил | RU | UZ (draft) | EN |
|---|---|---|---|
| `>` | Подставь два с половиной. Слева это решение, а справа получается один больше двух — ложь. Значит записи не равносильны. | Ikki yarimni qo'ying. Chapda bu yechim, o'ngda esa bir ikkidan katta chiqadi — yolg'on. Demak yozuvlar teng kuchli emas. | Substitute two and a half. On the left it is a solution, on the right you get one greater than two, which is false. So the records are not equivalent. |

### Вопрос-формулировка

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | возрастает функция или убывает | funksiya o'sadimi yoki kamayadimi | whether the function increases or decreases | ✓ |
| `b` | от знака справа | o'ngdagi ishoraga | on the sign on the right | |
| `c` | от знака аргумента | argumentning ishorasiga | on the sign of the argument | |
| `d` | от исходного знака | boshlang'ich ishoraga | on the original sign | |

### Разборы

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `b` | Справа было минус один. Но направление осталось бы тем же и при плюс один. | O'ngda minus bir edi. Lekin plyus bir bo'lganda ham yo'nalish o'sha qolardi. | On the right it was minus one. But the direction would stay the same with plus one too. |
| `c` | Аргумент положителен по условию, которое мы ставим сами. Он ничего не решает. | Argument o'zimiz qo'yayotgan shart bo'yicha musbat. U hech narsani hal qilmaydi. | The argument is positive by the condition we impose ourselves. It decides nothing. |
| `d` | Исходный знак мы как раз и меняем. Вопрос в том, почему нам можно. | Boshlang'ich ishorani aynan o'zimiz o'zgartiramiz. Savol — nega bunga haqlimiz. | The original sign is exactly what we change. The question is why we are allowed to. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Правило собрано. Теперь работаешь ты. | Qoida yig'ildi. Endi siz ishlaysiz. | The rule is assembled. Now it is your turn. |
| 2 | `place` | Поставь знак так, чтобы правая запись была равносильна левой. | O'ng yozuv chapiga teng kuchli bo'lishi uchun ishorani qo'ying. | Place the sign so that the right record is equivalent to the left one. |
| 3 | `check` | Проверить можно точкой. | Nuqta bilan tekshirish mumkin. | You can check with a point. |
| 4 | `q` | Получилось. Теперь сформулируй: от чего зависит направление? | Bo'ldi. Endi ta'riflang: yo'nalish nimaga bog'liq? | Done. Now put it into words: what does the direction depend on? |

---

# Слайд 10. Совместная практика: полный разбор

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | РАЗБОР | TAHLIL | WORKED SOLUTION |
| `title` | Выбирай следующий шаг | Keyingi qadamni tanlang | Choose the next step |
| `writeAnswer` | Запиши ответ так, как записал бы на экзамене | Javobni imtihonda yozganingizdek yozing | Write the answer the way you would on the exam |

### Строки решения

```
log₀,₅(2x − 4) > −1
log₀,₅(2x − 4) > log₀,₅ 2
0 < 2x − 4 < 2
2 < x < 3
```

Ответ, который записывает ученик: `(2; 3)`.

### Действия

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `toLog` | справа сделать логарифм | o'ngni logarifmga aylantirish | make the right side a logarithm |
| `drop` | отбросить логарифмы | logarifmlarni tashlash | drop the logarithms |
| `solve` | решить неравенство | tengsizlikni yechish | solve the inequality |
| `point` | проверить точкой | nuqta bilan tekshirish | check with a point |

### Неверные шаги

| Что сделал | RU | UZ (draft) | EN |
|---|---|---|---|
| `2x − 4 > 2` (**З2**) | Смотри на прямую: множество уехало вправо от тройки. Подставь `x = 4` в исходное — не входит. | O'qqa qarang: to'plam uchdan o'ngga ketdi. `x = 4` ni boshlang'ich tengsizlikka qo'ying — kirmaydi. | Look at the line: the set moved to the right of three. Substitute `x = 4` into the original — it is not a solution. |
| `0 < 2x − 4` без верхней границы | Верхняя граница тоже есть. Смотри на правую часть. | Yuqori chegara ham bor. O'ng tomonga qarang. | There is an upper boundary too. Look at the right side. |
| `drop` до `toLog` | Справа пока обычное число. Сравнивать аргументы ещё не с чем. | O'ngda hozircha oddiy son. Argumentlarni solishtirish uchun hali hech narsa yo'q. | The right side is still an ordinary number. There is nothing to compare arguments with yet. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Ты сформулировал правило. Пройдём этот пример целиком. | Siz qoidani ta'rifladingiz. Bu misolni to'liq o'tamiz. | You put the rule into words. Let us go through this example completely. |
| 2 | `start` | Основание меньше единицы. Выбери, с чего начать. | Asos birdan kichik. Nimadan boshlashni tanlang. | The base is less than one. Choose where to start. |
| 3 | `write` | Теперь запиши ответ так, как записал бы на экзамене. | Endi javobni imtihonda yozganingizdek yozing. | Now write the answer the way you would on the exam. |

---

# Слайд 11. Самостоятельное применение, без прямой

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | САМОСТОЯТЕЛЬНО | MUSTAQIL | ON YOUR OWN |
| `title` | Реши неравенство | Tengsizlikni yeching | Solve the inequality |
| `answerLabel` | Ответ | Javob | Answer |
| `hint` | Основание ноль целых пять десятых. Кривая идёт вверх или вниз? | Asos nol butun besh o'ndan. Chiziq yuqoriga ketadimi yoki pastga? | The base is zero point five. Does the curve go up or down? |

### Строки решения

```
log₀,₅ x² > log₀,₅ 3x
0 < x² < 3x
x(x − 3) < 0
```

Ответ ученика: `(0; 3)`. Совпадает с ключом учебника, стр. 109.

### Неверные шаги, разбор только числом

| Что сделал | RU | UZ (draft) | EN |
|---|---|---|---|
| `x² > 3x` (**З2**) | Возьми `x = 4`. Аргументы шестнадцать и двенадцать. Основание меньше единицы, значит логарифм шестнадцати меньше логарифма двенадцати. Неравенство ложно, четвёрка не решение. | `x = 4` ni oling. Argumentlar o'n olti va o'n ikki. Asos birdan kichik, demak o'n oltining logarifmi o'n ikkining logarifmidan kichik. Tengsizlik yolg'on, to'rt yechim emas. | Take `x = 4`. The arguments are sixteen and twelve. The base is less than one, so the logarithm of sixteen is smaller than the logarithm of twelve. The inequality is false, four is not a solution. |
| потерял `3x > 0` (**З1**) | Возьми `x = −1`. Под вторым логарифмом минус три, логарифма нет. | `x = −1` ni oling. Ikkinchi logarifm ostida minus uch, logarifm yo'q. | Take `x = −1`. Under the second logarithm you get minus three, there is no logarithm. |
| `(−∞; 0) ∪ (3; +∞)` (**З5 и З2**) | Возьми `x = 1`. Слева логарифм единицы, это ноль. Справа логарифм трёх, он отрицательный. Ноль больше — значит единица решение, а в твой ответ она не входит. | `x = 1` ni oling. Chapda birning logarifmi, u nol. O'ngda uchning logarifmi, u manfiy. Nol katta — demak bir yechim, sizning javobingizga esa u kirmaydi. | Take `x = 1`. On the left the logarithm of one, which is zero. On the right the logarithm of three, which is negative. Zero is greater, so one is a solution, yet your answer does not contain it. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Теперь полностью сам, и без прямой — как на экзамене. | Endi to'liq mustaqil, o'qsiz — imtihondagidek. | Now completely on your own, and without the line — as on the exam. |
| 2 | `go` | Смотри на основание. И помни: под логарифмом обе части должны быть положительны. | Asosga qarang. Va yodda tuting: logarifm ostida ikki tomon ham musbat bo'lishi kerak. | Look at the base. And remember: both expressions under the logarithms must be positive. |
| 3 | `write` | Ответ запиши промежутком. | Javobni oraliq bilan yozing. | Write the answer as an interval. |

---

# Слайд 12. Блиц-панель: четыре вопроса

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | БЛИЦ | BLITS | QUICK ROUND |
| `counter` | `N` из 4 | 4 dan `N` | `N` of 4 |
| `goesToResult` | Идёт в результат | Natijaga kiradi | Counts towards the result |

### Вопрос 1. `log₃(x − 1) < 1`

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `(1; 4)` | ✓ | — | — | — |
| `b` | `(−∞; 4)` | **З1** | Аргумент оказался меньше числа — значит нужно дописать, что он больше нуля. Проверь `x = 0`. | Argument sondan kichik chiqdi — demak uning noldan katta ekanini yozib qo'yish kerak. `x = 0` ni tekshiring. | The argument turned out smaller than the number, so you must add that it is greater than zero. Check `x = 0`. |
| `c` | `(1; 3)` | | Три в первой степени — это три, но сравнивается с ним `x` минус один. | Uchning birinchi darajasi — uch, lekin u bilan `x` minus bir solishtiriladi. | Three to the first power is three, but what is compared with it is `x` minus one. |
| `d` | `(0; 4)` | | Под логарифмом стоит `x` минус один, а не `x`. | Logarifm ostida `x` minus bir turadi, `x` emas. | Under the logarithm there is `x` minus one, not `x`. |

### Вопрос 2. `log₄(x + 1) + log₄ x < log₄ 2`

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `(0; 1)` | ✓ | — | — | — |
| `b` | `(−2; 1)` | **З4** | Под вторым логарифмом стоит сам `x`, значит `x` больше нуля. Проверь `x = −1`. | Ikkinchi logarifm ostida `x` ning o'zi turadi, demak `x` noldan katta. `x = −1` ni tekshiring. | Under the second logarithm there is `x` itself, so `x` is greater than zero. Check `x = −1`. |
| `c` | `(0; 2)` | | Реши квадратное неравенство ещё раз: корни минус два и один. | Kvadrat tengsizlikni yana yeching: ildizlar minus ikki va bir. | Solve the quadratic inequality again: the roots are minus two and one. |
| `d` | `(−2; 0)` | | Проверь `x = −1`: под логарифмом отрицательное число. | `x = −1` ni tekshiring: logarifm ostida manfiy son. | Check `x = −1`: the expression under the logarithm is negative. |

Ответ сверен с ключом учебника, стр. 109: `32.2) (0; 1)`.

### Вопрос 3

RU: В каком неравенстве знак между аргументами поменяется?
UZ (draft): Qaysi tengsizlikda argumentlar orasidagi ishora o'zgaradi?
EN: In which inequality will the sign between the arguments change?

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `b` | `log₀,₃(x − 1) < 3` | ✓ | — | — | — |
| `a` | `log₂(x − 1) < 3` | | Основание два больше единицы, кривая идёт вверх. Знак останется. | Asos ikki birdan katta, chiziq yuqoriga ketadi. Ishora o'sha qoladi. | The base two is greater than one, the curve goes up. The sign stays. |
| `c` | `log₅(x − 1) > 2` | | Основание пять больше единицы. Направление исходного знака тут ни при чём. | Asos besh birdan katta. Boshlang'ich ishoraning yo'nalishi bu yerda ahamiyatsiz. | The base five is greater than one. The direction of the original sign is irrelevant here. |
| `d` | `log₇(x − 1) > 2` | | Семь больше единицы. Ищи основание меньше единицы. | Yetti birdan katta. Birdan kichik asosni izlang. | Seven is greater than one. Look for a base less than one. |

### Вопрос 4

RU: У тебя вышел ответ `(2; 3)` для `log₀,₅(2x − 4) > −1`. Как быстрее всего убедиться, что он верный?
UZ (draft): `log₀,₅(2x − 4) > −1` uchun sizda `(2; 3)` javobi chiqdi. Uning to'g'riligiga eng tez qanday ishonch hosil qilasiz?
EN: You got the answer `(2; 3)` for `log₀,₅(2x − 4) > −1`. What is the fastest way to make sure it is correct?

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | подставить точку внутри и точку снаружи | ichkaridagi va tashqaridagi nuqtani qo'yish | substitute a point inside and a point outside | ✓ |
| `b` | решить второй раз тем же способом | o'sha usul bilan ikkinchi marta yechish | solve it a second time the same way | |
| `c` | проверить только границы | faqat chegaralarni tekshirish | check only the boundaries | |
| `d` | посчитать, сколько целых чисел вошло | nechta butun son kirganini hisoblash | count how many whole numbers are included | |

| id | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|
| `b` | Тем же способом повторишь ту же ошибку. Нужна независимая проверка. | O'sha usul bilan o'sha xatoni takrorlaysiz. Mustaqil tekshiruv kerak. | The same way will repeat the same mistake. You need an independent check. |
| `c` | Границы в ответ не входят. Проверять надо число внутри и число снаружи. | Chegaralar javobga kirmaydi. Ichkaridagi va tashqaridagi sonni tekshirish kerak. | The boundaries are not part of the answer. You must check a number inside and a number outside. |
| `d` | Это не проверка: количество целых чисел ничего не доказывает. | Bu tekshiruv emas: butun sonlar soni hech narsani isbotlamaydi. | That is not a check: the count of whole numbers proves nothing. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Проверим, что закрепилось. Четыре быстрых вопроса, они идут в результат. | Nima o'zlashganini tekshiramiz. To'rtta tez savol, ular natijaga kiradi. | Let us check what stuck. Four quick questions, they count towards the result. |
| 2 | `q1` | Реши неравенство. | Tengsizlikni yeching. | Solve the inequality. |
| 3 | `q2` | Здесь два логарифма слева. | Bu yerda chapda ikki logarifm. | Here there are two logarithms on the left. |
| 4 | `q3` | Смотри на основания. | Asoslarga qarang. | Look at the bases. |
| 5 | `q4` | Последний вопрос: про проверку. | Oxirgi savol: tekshiruv haqida. | Last question: about checking. |

---

# Слайд 13. Типичная ошибка

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | НАЙДИ ОШИБКУ | XATONI TOPING | FIND THE ERROR |
| `title` | Все шаги выглядят верными. Но ответ неверный | Hamma qadam to'g'ri ko'rinadi. Lekin javob xato | Every step looks correct. But the answer is wrong |
| `q1` | В какой строке ошибка появилась впервые? | Xato birinchi marta qaysi satrda paydo bo'ldi? | In which line did the error first appear? |
| `proof` | Проверка: `x = 0` → под логарифмом −3, решением быть не может | Tekshiruv: `x = 0` → logarifm ostida −3, yechim bo'lolmaydi | Check: `x = 0` → −3 under the logarithm, it cannot be a solution |
| `q2` | Какое правило нарушено? | Qaysi qoida buzilgan? | Which rule was broken? |

### Строки чужого решения

```
1)  log₂(x − 3) < 2
2)  x − 3 < 4          ← ошибка
3)  x < 7
4)  ответ: (−∞; 7)
```

Верное решение: `0 < x − 3 < 4`, ответ `(3; 7)`.

### Разборы первого вопроса

| Выбрал | RU | UZ (draft) | EN |
|---|---|---|---|
| строка 1 | Это исходное неравенство, ошибки в нём быть не может. | Bu boshlang'ich tengsizlik, unda xato bo'lishi mumkin emas. | This is the original inequality, there can be no error in it. |
| строка 3 | Из строки 2 это следует верно. Ошибка пришла раньше. | 2-satrdan bu to'g'ri kelib chiqadi. Xato oldin kelgan. | This follows correctly from line 2. The error came earlier. |
| строка 4 | Ответ действительно неверный. Но неверным он стал раньше — найди, где именно. | Javob haqiqatan xato. Lekin u oldin xato bo'lgan — qayerda ekanini toping. | The answer is indeed wrong. But it became wrong earlier — find exactly where. |

### Второй вопрос

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | аргумент меньше числа — надо дописать «больше нуля» | argument sondan kichik — «noldan katta» deb yozib qo'yish kerak | the argument is smaller than the number — you must add «greater than zero» | ✓ |
| `b` | основание меньше единицы | asos birdan kichik | the base is less than one | |
| `c` | перенос числа | sonni ko'chirish | moving the number | |
| `d` | порядок действий | amallar tartibi | order of operations | |

| id | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|
| `b` | Основание два, оно больше единицы. Знак между аргументами менять не нужно было. | Asos ikki, u birdan katta. Argumentlar orasidagi ishorani o'zgartirish kerak emas edi. | The base is two, greater than one. The sign between the arguments did not need changing. |
| `c` | Тройка перенесена верно, это видно в строке 3. | Uch to'g'ri ko'chirilgan, bu 3-satrda ko'rinadi. | The three was moved correctly, you can see it in line 3. |
| `d` | Порядок был правильный: сначала логарифм, потом линейное неравенство. | Tartib to'g'ri edi: avval logarifm, keyin chiziqli tengsizlik. | The order was right: the logarithm first, then the linear inequality. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Блиц закрыт. Теперь посмотрим на чужое решение. | Blits yopildi. Endi boshqaning yechimiga qaraymiz. | The quick round is done. Now let us look at someone else's solution. |
| 2 | `q1` | Все шаги здесь выглядят верными. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые. | Bu yerda hamma qadam to'g'ri ko'rinadi. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping. | Every step here looks correct. And still the answer is wrong. Find the line where the error first appeared. |
| 3 | `proof` | Проверим точкой. Вот число, которое попало в ответ и не может быть решением. | Nuqta bilan tekshiramiz. Mana javobga tushgan va yechim bo'lolmaydigan son. | Let us check with a point. Here is a number that got into the answer and cannot be a solution. |
| 4 | `q2` | Какое правило нарушено? | Qaysi qoida buzilgan? | Which rule was broken? |

---

# Слайд 14. Обратная задача: собери сам

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | СОБЕРИ САМ | O'ZINGIZ YIG'ING | BUILD IT YOURSELF |
| `counter` | `N` из 2 | 2 dan `N` | `N` of 2 |
| `task1` | Собери неравенство с основанием 2, у которого ответ `(3; 7)` | Javobi `(3; 7)` bo'lgan, asosi 2 bo'lgan tengsizlikni yig'ing | Build an inequality with base 2 whose answer is `(3; 7)` |
| `task2` | А теперь с основанием 0,5 и тем же ответом | Endi asosi 0,5 bo'lgan va javobi o'sha bo'lgan tengsizlikni | And now with base 0,5 and the same answer |
| `partsLabel` | Части | Bo'laklar | Pieces |
| `matched` | совпало с целью | maqsad bilan mos keldi | matches the target |
| `done1` | первый способ: `log₂(x − 3) < 2` | birinchi usul: `log₂(x − 3) < 2` | first way: `log₂(x − 3) < 2` |

Верно: `log₂(x − 3) < 2` и `log₀,₅(x − 3) > −2`.

### Неверные сборки

| Собрал | RU | UZ (draft) | EN |
|---|---|---|---|
| `log₀,₅(x − 3) < −2` | Основание меньше единицы. Проверь `x = 4`: слева ноль, а ноль меньше минус двух — нет. Но четвёрка входить должна. | Asos birdan kichik. `x = 4` ni tekshiring: chapda nol, nol minus ikkidan kichikmi — yo'q. Lekin to'rt kirishi kerak. | The base is less than one. Check `x = 4`: the left side is zero, and zero is not less than minus two. But four must be included. |
| `log₂(x − 3) > 2` | Это множество правее семёрки, а нужно между тройкой и семёркой. | Bu to'plam yettidan o'ngda, kerak esa uch bilan yetti orasida. | This set is to the right of seven, but we need between three and seven. |
| `log₂(x − 3) < −2` | Проверь `x = 4`: слева ноль, ноль меньше минус двух — нет. | `x = 4` ni tekshiring: chapda nol, nol minus ikkidan kichikmi — yo'q. | Check `x = 4`: the left side is zero, zero is not less than minus two. |
| `log₀,₅(x − 3) > 2` | Проверь `x = 4`: ноль больше двух — нет. | `x = 4` ni tekshiring: nol ikkidan kattami — yo'q. | Check `x = 4`: zero is not greater than two. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Ошибку нашёл. Последнее задание — обратное. | Xatoni topdingiz. Oxirgi topshiriq — teskari. | You found the error. The last task is the reverse one. |
| 2 | `t1` | Дан ответ, собери неравенство, которое к нему приводит. | Javob berilgan, unga olib keladigan tengsizlikni yig'ing. | The answer is given, build an inequality that leads to it. |
| 3 | `t2` | А теперь то же самое множество, но основание должно быть ноль целых пять десятых. | Endi o'sha to'plam, lekin asos nol butun besh o'ndan bo'lishi kerak. | And now the same set, but the base must be zero point five. |

---

# Слайд 15. Итог

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что ты предполагал в начале | Boshida nima deb taxmin qilgan edingiz | What you guessed at the start |
| `youPicked` | ты выбрал | siz tanladingiz | you picked |
| `correctIs` | верно | to'g'ri javob | correct |
| `levelLabel` | Уровень по блицу | Blits bo'yicha daraja | Level from the quick round |
| `question` | Как проверить свой ответ, если сомневаешься? | Ishonchingiz bo'lmasa, javobingizni qanday tekshirasiz? | How do you check your answer when you are unsure? |

### Три шага правила

| # | RU | UZ (draft) | EN |
|---|---|---|---|
| 1 | справа сделай логарифм | o'ngni logarifmga aylantir | make the right side a logarithm |
| 2 | возрастает — знак тот же, убывает — другой | o'sadi — ishora o'sha, kamayadi — boshqa | increasing — same sign, decreasing — opposite |
| 3 | аргумент меньше числа — допиши «больше нуля» | argument sondan kichik — «noldan katta» deb yoz | argument smaller than the number — add «greater than zero» |

### Уровень готовности

| Результат | RU | UZ (draft) | EN |
|---|---|---|---|
| 4 из 4 | Этот тип задач на ДТМ у тебя закрыт | Bu turdagi masalalar DTM da siz uchun yopildi | This task type is covered for the exam |
| 3 из 4 | Одно место требует повтора | Bitta joy takrorlashni talab qiladi | One spot needs review |
| 2 и меньше | Вернись к правилу и к экрану с двумя точками | Qoidaga va ikki nuqtali ekranga qayting | Go back to the rule and to the two-points screen |

Названия тегов для строки «одно место требует повтора»:

| Тег | RU | UZ (draft) | EN |
|---|---|---|---|
| `log_domain` | условие на аргумент | argumentga shart | the condition on the argument |
| `base_direction` | направление знака по основанию | asosga qarab ishora yo'nalishi | the sign direction from the base |
| `check_by_point` | проверка точкой | nuqta bilan tekshirish | checking with a point |

### Финальный вопрос

| id | RU | UZ (draft) | EN | Верно |
|---|---|---|---|---|
| `a` | точка внутри и точка снаружи | ichkaridagi va tashqaridagi nuqta | a point inside and a point outside | ✓ |
| `b` | спросить учителя | o'qituvchidan so'rash | ask the teacher | |
| `c` | посмотреть в учебник | darslikka qarash | look in the textbook | |
| `d` | никак | hech qanday | there is no way | |

| id | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|
| `b` | На экзамене учителя рядом нет. А точка всегда есть. | Imtihonda o'qituvchi yonda bo'lmaydi. Nuqta esa har doim bor. | On the exam the teacher is not next to you. A point always is. |
| `c` | В учебнике не будет именно твоего неравенства. | Darslikda aynan sizning tengsizligingiz bo'lmaydi. | The textbook will not contain your exact inequality. |
| `d` | Мы весь урок проверяли. Вспомни, чем. | Butun dars tekshirdik. Nima bilan ekanini eslang. | We were checking all lesson. Recall with what. |

### Озвучка

| # | trigger | RU | UZ (draft) | EN |
|---|---|---|---|---|
| 1 | `mount` | Урок закончен. Вернёмся к началу. | Dars tugadi. Boshiga qaytamiz. | The lesson is over. Let us go back to the start. |
| 2 | `p1` | Вот что ты предполагал и вот как оказалось. Ошибиться в догадке было нормально — именно поэтому мы проверяли. | Mana siz nima deb taxmin qilgansiz va mana qanday chiqdi. Taxminda xato qilish normal edi — biz shuning uchun tekshirdik. | Here is what you guessed and here is how it turned out. Being wrong in a guess was fine — that is exactly why we checked. |
| 3 | `rule` | Вот всё правило урока, три шага. | Mana darsning butun qoidasi, uch qadam. | Here is the whole rule of the lesson, three steps. |
| 4 | `q` | И главное: если сомневаешься в ответе, есть способ проверить самому. | Va eng muhimi: javobga ishonchingiz bo'lmasa, o'zingiz tekshirish usuli bor. | And the main thing: if you are unsure of the answer, there is a way to check it yourself. |

---

## Сводка узбекских терминов — draft

**Требует валидации узбекским методистом математики.** Я предлагаю варианты и не подтверждаю
их. До валидации сборку можно делать, но перед сдачей термины должны быть подписаны.

| RU | UZ (draft) | Примечание |
|---|---|---|
| логарифм | logarifm | |
| логарифмическое неравенство | logarifmik tengsizlik | |
| основание логарифма | logarifm asosi | |
| аргумент | argument | иногда встречается `logarifm ostidagi ifoda` |
| показатель степени | daraja ko'rsatkichi | |
| степень | daraja | |
| дробь | kasr | |
| знак неравенства | tengsizlik ishorasi | встречается и `belgi` |
| множество решений | yechimlar to'plami | |
| промежуток | oraliq | |
| возрастает | o'sadi | функция — `o'suvchi funksiya` |
| убывает | kamayadi | функция — `kamayuvchi funksiya` |
| монотонная функция | monoton funksiya | |
| кривая | chiziq | в контексте графика; `egri chiziq` тоже встречается |
| ось | o'q | |
| тень, проекция | soya | для `проекция` возможен `proyeksiya` |
| подставить | qo'yish | |
| условие | shart | |
| положительное число | musbat son | |
| отрицательное число | manfiy son | |
| равносильно | teng kuchli | |
| пересечение | kesishma | |
| правило | qoida | |
| задачник | masalalar to'plami | |

Три термина, где я меньше всего уверен и прошу отдельно проверить: `soya` для тени графика,
`teng kuchli` для равносильности, `argument` против `logarifm ostidagi ifoda`.

---

## Проверка контента перед сборкой

- RU и UZ и EN заполнены, плейсхолдеров нет;
- кириллицы в UZ-строках нет;
- UZ-апостроф только ASCII `'`;
- обращение: RU `ты`, UZ `siz`, прошедшее время в RU без привязки к полу;
- числа, формулы и верные ответы во всех трёх языках совпадают;
- в озвучке нет символов `< > = ⟺ ( ; )`, дробей цифрами и длинных тире;
- на каждый неверный вариант есть свой разбор, он указывает на признак и не даёт ответ;
- аудио шире экранного текста, а не его копия;
- ответы четырёх задач учебника совпадают с ключом на стр. 109.

## Что осталось решить

1. **Контент** — принимается, или что переписать.
2. **Узбекские термины** — три спорных названы выше, нужна подпись предметника.
3. После приёмки контента иду на этап 3: `core.jsx`, `tools.jsx` и `Dars12.jsx` движка
   11 класса.
