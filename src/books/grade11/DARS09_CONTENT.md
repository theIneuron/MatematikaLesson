# Урок 9. Показательные уравнения — контент

Этап 2 по `CLAUDE.md` §3. Вход — `DARS09_SKELET.md` редакция 2. Выход — вход для сборки.

Три языка равнозначны: одинаковые числа, формулы и верные ответы. Русский — «ты», прошедшее
время без привязки к полу. Узбекский — латиница, апостроф только ASCII `'`, обращение `siz`.
Английский — нейтральный, без сокращений.

**Узбекская математическая терминология — draft, требует валидации узбекским методистом
математики.** Сводка терминов в конце файла.

Голос мужской. Озвучка: один кусок — одна мысль, символов нет. Знаки `= < > ⁻` в звук не
попадают: движок переводит их словами, но и сам текст пишется словами.

**Выдержка кадров (`holds`) в этом файле не задаётся.** Она ставится при сборке и
подгоняется скриптом `grade11-audio-lang-check`: кадр не должен быть длиннее реплики больше
чем на 1,2 секунды ни в одном из трёх языков.

---

## Общие строки интерфейса

Берутся из `screens.jsx` (общие на класс) — в уроке не дублируются: «Продолжить», «Назад»,
«Завершить урок», «Подставить», «Проверить», «Подсказка», «Идёт в результат», «Готовность
к ДТМ» и другие.

**Своё у урока:**

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `title` | Показательные уравнения | Ko'rsatkichli tenglamalar | Exponential equations |
| `sheetTitle` | Показательные уравнения · шпаргалка | Ko'rsatkichli tenglamalar · shpargalka | Exponential equations · cheat sheet |
| `sheetSrc` | 11 класс · урок 9 | 11-sinf · 9-dars | Grade 11 · lesson 9 |
| `lifehack` | Проверка за 10 секунд: подставь свой корень в исходное уравнение. Обе части обязаны стать равными. | 10 sekundlik tekshiruv: ildizingizni boshlang'ich tenglamaga qo'ying. Ikki tomon teng bo'lishi shart. | A 10-second check: substitute your root into the original equation. Both sides must become equal. |

---

# Слайд 1. Хук: один корень или два

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПОКАЗАТЕЛЬНЫЕ УРАВНЕНИЯ | KO'RSATKICHLI TENGLAMALAR | EXPONENTIAL EQUATIONS |
| `title` | Один корень или два? | Bitta ildizmi yoki ikkita? | One root or two? |
| `expr` | `9ˣ − 6·3ˣ − 27 = 0` | то же | то же |
| `labelA` | первое решение | birinchi yechim | first solution |
| `valueA` | один корень: `x = 2` | bitta ildiz: `x = 2` | one root: `x = 2` |
| `labelB` | второе решение | ikkinchi yechim | second solution |
| `valueB` | два корня: `x = 2` и `x = −1` | ikkita ildiz: `x = 2` va `x = −1` | two roots: `x = 2` and `x = −1` |
| `question` | Какой ответ верный? | Qaysi javob to'g'ri? | Which answer is correct? |
| `afterPredict` | Твой ответ записан. Сейчас проверим его подстановкой. | Javobingiz yozib olindi. Endi uni qo'yib tekshiramiz. | Your answer is saved. Now we will check it by substitution. |

### Варианты (прогноз, оценки нет)

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `a` | первое | birinchi | the first |
| `b` | второе | ikkinchi | the second |
| `both` | оба | ikkisi ham | both |
| `none` | ни один | hech qaysi | neither |

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Двое решили одно и то же уравнение и получили разные ответы. | Ikki kishi bitta tenglamani yechdi va turli javob oldi. | Two students solved the same equation and got different answers. |
| 2 | Вот первый ответ: корень один, это двойка. | Mana birinchi javob: ildiz bitta, u ikki. | Here is the first answer: one root, and it is two. |
| 3 | А вот второй. Двойка есть и здесь, но рядом с ней стоит минус единица. Расходятся ответы только в ней. | Mana ikkinchisi. Ikki bu yerda ham bor, lekin yonida minus bir turibdi. Javoblar faqat shunda farq qiladi. | And here is the second one. Two is here as well, but next to it stands minus one. The answers differ only in that. | 
| 4 | Как думаешь, какой ответ верный? Пока просто предположи. | Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling. | Which answer do you think is correct? Just make a guess for now. |

---

# Слайд 2. Три опоры

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРКА ОПОРЫ | TAYANCHNI TEKSHIRISH | CHECKING THE BASICS |
| `title` | Три опоры | Uch tayanch | Three basics |
| `lead` | Прежде чем решать спор, вспомним три вещи. Без них корень не проверить. Это не оценивается. | Bahsni hal qilishdan oldin uch narsani eslab olamiz. Ularsiz ildizni tekshirib bo'lmaydi. Bu baholanmaydi. | Before settling the argument, let us recall three things. Without them the root cannot be checked. This is not graded. |

### Карточки опор

| # | Заголовок RU | Заголовок UZ (draft) | Заголовок EN | Примеры |
|---:|---|---|---|---|
| 1 | Одно число — разные основания | Bitta son — turli asoslar | One number, different bases | `36 = 6²` · `27 = 3³` |
| 2 | Степень всегда положительна | Daraja doim musbat | A power is always positive | `2³ = 8` · `2⁰ = 1` · `2⁻³ = 1/8` |
| 3 | Степень раскладывается на множители | Daraja ko'paytuvchilarga ajraladi | A power splits into factors | `2^(x+2) = 2ˣ · 4` |

Пояснения под примерами: `потому что 6·6 = 36` / `chunki 6·6 = 36` / `because 6·6 = 36`;
`ни разу не ноль и не минус` / `hech qachon nol ham, minus ham emas` / `never zero, never
negative`; `2² = 4 вынесли отдельно` / `2² = 4 alohida chiqarildi` / `2² = 4 taken out`.

### Задание 1

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `2` | ✓ | — | — | — |
| `b` | `3` | | Три в квадрате это девять, а нам нужно тридцать шесть. | Uch kvadrat bu to'qqiz, bizga esa o'ttiz olti kerak. | Three squared is nine, but we need thirty six. |
| `c` | `6` | | Шесть в первой степени это сама шестёрка. | Olti birinchi darajada bu oltining o'zi. | Six to the first power is six itself. |
| `d` | `36` | | Показатель это сколько раз умножаем, а не результат. | Ko'rsatkich bu necha marta ko'paytirish, natija emas. | The exponent is how many times we multiply, not the result. |

Вопрос: `36 = 6` в какой степени? / `36 = 6` ning qaysi darajasi? / `36 = 6` to what power?

### Задание 2

Вопрос: Какое значение **не может** принимать `2ˣ`? / `2ˣ` qaysi qiymatni **qabul qila
olmaydi**? / Which value can `2ˣ` **never** take?

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `−4` | ✓ | — | — | — |
| `b` | `0,5` | | Может: при иксе минус один получается одна вторая. | Bo'lishi mumkin: iks minus bir bo'lganda bir ikkidan chiqadi. | It can: at x equal to minus one you get one half. |
| `c` | `1` | | Может: любое число в нулевой степени даёт единицу. | Bo'lishi mumkin: har qanday son nolinchi darajada birga teng. | It can: any number to the power zero gives one. |
| `d` | `8` | | Может: при иксе три получается восемь. | Bo'lishi mumkin: iks uch bo'lganda sakkiz chiqadi. | It can: at x equal to three you get eight. |

### Задание 3

Вопрос: `2^(x+2) =`

| id | Ответ | Верно | Разбор RU | Разбор UZ (draft) | Разбор EN |
|---|---|---|---|---|---|
| `a` | `2ˣ · 4` | ✓ | — | — | — |
| `b` | `2ˣ + 4` | | Подставь икс равный одному: слева восемь, справа шесть. Не сходится. | Iks birga teng deb qo'ying: chapda sakkiz, o'ngda olti. Mos kelmadi. | Substitute x equal to one: eight on the left, six on the right. It does not match. |
| `c` | `2^(2x)` | | Показатели складываются, а не удваиваются. | Ko'rsatkichlar qo'shiladi, ikkilanmaydi. | Exponents add up, they do not double. |
| `d` | `4ˣ` | | Подставь икс равный одному: слева восемь, справа четыре. | Iks birga teng deb qo'ying: chapda sakkiz, o'ngda to'rt. | Substitute x equal to one: eight on the left, four on the right. |

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Прежде чем решать спор, восстановим три вещи. Это не оценка. | Bahsni hal qilishdan oldin uch narsani tiklaymiz. Bu baho emas. | Before we settle the argument, let us restore three things. This is not graded. |
| 2 | Первая опора. Одно и то же число можно записать разными основаниями. Тридцать шесть это шесть в квадрате, двадцать семь это три в кубе. Сегодня это понадобится. | Birinchi tayanch. Bitta sonni turli asoslar bilan yozish mumkin. O'ttiz olti bu olti kvadrat, yigirma yetti bu uch kub. Bugun bu kerak bo'ladi. | First basic. The same number can be written with different bases. Thirty six is six squared, twenty seven is three cubed. We will need this today. |
| 3 | Вторая опора, и сегодня она главная. Степень всегда положительна. Два в кубе это восемь, два в нулевой это один, два в минус третьей это одна восьмая. Ни разу не ноль и ни разу не минус. | Ikkinchi tayanch, va bugun u asosiy. Daraja doim musbat. Ikki kub bu sakkiz, ikki nolinchi darajada bir, ikki minus uchinchi darajada bir sakkizdan. Hech qachon nol ham, minus ham chiqmaydi. | Second basic, and today it is the main one. A power is always positive. Two cubed is eight, two to the power zero is one, two to the power minus three is one eighth. Never zero and never negative. |
| 4 | Третья опора. Степень раскладывается на множители: два в степени икс плюс два это два в степени икс, умноженное на четыре. | Uchinchi tayanch. Daraja ko'paytuvchilarga ajraladi: ikkining iks plyus ikki darajasi bu ikkining iks darajasi karra to'rt. | Third basic. A power splits into factors: two to the power x plus two is two to the power x times four. | 
| 5 | Повторим коротко. Первое: одно число — разные основания. Второе, и сегодня главное: степень всегда положительна. Третье: степень раскладывается на множители. | Qisqacha takrorlaymiz. Birinchi: bitta son, turli asoslar. Ikkinchi, va bugun asosiy: daraja doim musbat. Uchinchi: daraja ko'paytuvchilarga ajraladi. | Let us repeat briefly. First: one number, different bases. Second, and today the main one: a power is always positive. Third: a power splits into factors. |
| 6 | Теперь я сворачиваю опоры в одну кнопку. Понадобятся, нажмёшь и откроешь. Теперь три коротких задания. | Endi tayanchlarni bitta tugmaga yig'aman. Kerak bo'lsa, bosib ochasiz. Endi uchta qisqa topshiriq. | Now I am folding the basics into one button. If you need them, press it and they open. Now three short tasks. |

---

# Слайд 3. Спор решает подстановка

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРИМ ПОДСТАНОВКОЙ | QO'YIB TEKSHIRAMIZ | LET US CHECK BY SUBSTITUTION |
| `title` | Спор решает подстановка | Bahsni qo'yish hal qiladi | Substitution settles it |
| `goal` | слева должен получиться НОЛЬ | chapda NOL chiqishi kerak | the left side must give ZERO |
| `rule` | Число — корень, если после подстановки обе части стали равны. Ищем число, которое разводит эти два ответа. | Son ildiz bo'ladi, agar qo'yilgandan keyin ikki tomon teng bo'lsa. Bu ikki javobni ajratadigan sonni izlaymiz. | A number is a root if after substitution both sides become equal. We are looking for a number that separates these two answers. |
| `pick` | Какое число подставим? | Qaysi sonni qo'yamiz? | Which number shall we substitute? |

### Три точки

| id | Метка | Роль RU / UZ / EN | Счёт | Вывод |
|---|---|---|---|---|
| `p2` | `x = 2` | есть в обоих ответах / ikki javobda ham bor / in both answers | `81 − 54 − 27 = 0` | корень |
| `pm1` | `x = −1` | только во втором / faqat ikkinchisida / only in the second | `1/9 − 2 − 27 ≠ 0` | не корень |
| `p0` | `x = 0` | нет ни в одном / hech qaysisida yo'q / in neither | `1 − 6 − 27 ≠ 0` | не корень |

Метки вывода: `корень` / `ildiz` / `a root`; `не корень` / `ildiz EMAS` / `NOT a root`.

### Вопрос

Какой ответ верный? / Qaysi javob to'g'ri? / Which answer is correct?

| id | Ответ | Верно | Разбор |
|---|---|---|---|
| `a` | один корень | ✓ | **RU** Верно. Ты нашёл число, которое проходит по одному ответу и не проходит по другому. Это и есть способ проверки. · **UZ** To'g'ri. Siz bir javobga mos, ikkinchisiga mos kelmaydigan sonni topdingiz. Tekshirish usuli aynan shu. · **EN** Correct. You found a number that fits one answer and fails the other. That is the way to check. |
| `b` | два корня | | **RU** Подставь минус единицу. Слева получается одна девятая минус два минус двадцать семь, и это не ноль. Значит минус единица корнем быть не может, а во второй ответ она входит. · **UZ** Minus birni qo'ying. Chapda bir to'qqizdan minus ikki minus yigirma yetti chiqadi, bu esa nol emas. Demak minus bir ildiz bo'lolmaydi, ikkinchi javobga esa u kiradi. · **EN** Substitute minus one. On the left you get one ninth minus two minus twenty seven, and that is not zero. So minus one cannot be a root, yet the second answer contains it. |

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Опора восстановлена. Вернёмся к спору. | Tayanch tiklandi. Bahsga qaytamiz. | The basics are back. Let us return to the argument. |
| 2 | Спор решается не спором, а числом. Правило простое: если число корень, то после подстановки обе части станут равны. | Bahs bahs bilan emas, son bilan hal qilinadi. Qoida oddiy: agar son ildiz bo'lsa, qo'yilgandan keyin ikki tomon teng bo'ladi. | An argument is settled by a number, not by arguing. The rule is simple: if a number is a root, both sides become equal after substitution. |
| 3 | Выбери число. Мы подставим его в исходное уравнение и посмотрим, получится ли слева ноль. | Sonni tanlang. Uni boshlang'ich tenglamaga qo'yamiz va chapda nol chiqadimi, ko'ramiz. | Pick a number. We will substitute it into the original equation and see whether the left side gives zero. |
| 4 | Считаем и сравниваем с нулём. | Hisoblaymiz va nol bilan solishtiramiz. | We compute and compare with zero. |
| 5 | Три числа проверены. Двойка даёт ноль, значит она корень. Минус единица ноль не даёт, значит корнем она быть не может. А ноль не даёт ноль, и это тоже проверка: она отсекает, а не подтверждает всё подряд. | Uch son tekshirildi. Ikki nol beradi, demak u ildiz. Minus bir nol bermaydi, demak u ildiz bo'lolmaydi. Nol ham nol bermaydi, va bu ham tekshiruv: u kesadi, hammasini tasdiqlamaydi. | Three numbers checked. Two gives zero, so it is a root. Minus one does not give zero, so it cannot be a root. And zero does not give zero either, which is also a check: it cuts off, it does not confirm everything. |
| 6 | Одно число развело два ответа. Какой из них верный? | Bitta son ikki javobni ajratdi. Qaysi biri to'g'ri? | One number separated the two answers. Which of them is correct? |

---

# Слайд 4. Кривая никогда не касается оси

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ОТКУДА ВЗЯЛСЯ ЛИШНИЙ КОРЕНЬ | ORTIQCHA ILDIZ QAYERDAN KELDI | WHERE THE EXTRA ROOT CAME FROM |
| `title` | Кривая не опускается до оси | Chiziq o'qqacha tushmaydi | The curve never reaches the axis |
| `chip` | `y = 3ˣ` | то же | то же |

> **Правка при сборке.** В первой редакции экран нёс две кривые: `y = 3ˣ` с прямой
> `y = −3` и отдельно `y = 2ˣ` с прямой `y = 8`. Собрано иначе — **одна кривая `y = 3ˣ`
> и две прямые**: `y = 9` (пересечение в точке `x = 2`) и `y = −3` (не встречает кривую).
> Так экран отвечает на оба вопроса урока, но привязан к уравнению из хука: двойка — это
> его корень, а минус три — то, чего не бывает. Две кривые в бюджет высоты не влезали, и
> вторая уводила от хука.
| `bonus` | Радиоактивный распад, охлаждение чая, проценты по вкладу — всё это показательные модели: за равное время величина меняется в равное ЧИСЛО РАЗ, а не на равную величину. | Radioaktiv yemirilish, choyning sovishi, omonat foizi — hammasi ko'rsatkichli modellar: teng vaqtda kattalik teng MARTA o'zgaradi, teng miqdorga emas. | Radioactive decay, cooling tea, interest on a deposit are all exponential models: over equal time the quantity changes by an equal NUMBER OF TIMES, not by an equal amount. |

### Вопрос

Сколько решений у `3ˣ = −3`? / `3ˣ = −3` ning nechta yechimi bor? / How many solutions does
`3ˣ = −3` have?

| id | Ответ RU / UZ / EN | Верно | Разбор |
|---|---|---|---|
| `a` | ни одного / bitta ham yo'q / none | ✓ | — |
| `b` | одно / bitta / one | | **RU** Покажи точку, где кривая опускается до минус трёх. Её нет: кривая целиком выше оси. · **UZ** Chiziq minus uchgacha tushadigan nuqtani ko'rsating. Unday nuqta yo'q: chiziq butunlay o'qdan yuqorida. · **EN** Show a point where the curve reaches minus three. There is none: the curve lies entirely above the axis. |
| `c` | два / ikkita / two | | **RU** Кривая монотонна: она не может пройти через одно значение дважды. · **UZ** Chiziq monoton: u bitta qiymatdan ikki marta o'tolmaydi. · **EN** The curve is monotone: it cannot pass through one value twice. |
| `d` | бесконечно много / cheksiz ko'p / infinitely many | | **RU** Бесконечно много решений было бы, если бы прямая совпала с кривой. Она с ней даже не встречается. · **UZ** Cheksiz ko'p yechim to'g'ri chiziq egri chiziq bilan ustma-ust tushganda bo'lardi. U undan hatto o'tmaydi ham. · **EN** Infinitely many solutions would mean the line coincides with the curve. It does not even meet it. |

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Подстановка показала, какой ответ верный. Теперь посмотрим, откуда вообще взялась минус единица. | Qo'yish qaysi javob to'g'ri ekanini ko'rsatdi. Endi minus bir umuman qayerdan kelganini ko'ramiz. | The substitution showed which answer is correct. Now let us see where minus one came from at all. |
| 2 | Вот кривая, три в степени икс. Смотри: она целиком выше оси. | Mana chiziq, uchning iks darajasi. Qarang: u butunlay o'qdan yuqorida. | Here is the curve, three to the power x. Look: it lies entirely above the axis. |
| 3 | Теперь проведём прямую на высоте девять. Пересечение есть, и оно ровно одно. | Endi to'qqiz balandlikda to'g'ri chiziq o'tkazamiz. Kesishish bor, va u aynan bitta. | Now let us draw a line at height nine. There is an intersection, and exactly one. |
| 4 | Смотри на его тень на оси: это и есть корень, двойка. Кривая идёт только вверх, поэтому второй раз эту высоту она не пройдёт. | Uning o'qdagi soyasiga qarang: ildiz aynan shu, ikki. Chiziq faqat yuqoriga boradi, shuning uchun bu balandlikdan ikkinchi marta o'tmaydi. | Look at its shadow on the axis: that is the root, two. The curve only goes up, so it will not cross that height a second time. |
| 5 | А теперь прямая на высоте минус три. Кривая не встречает её ни в одной точке. Значит три в степени икс не может равняться минус трём, отсюда и лишний корень. | Endi minus uch balandlikda to'g'ri chiziq. Chiziq u bilan birorta nuqtada uchrashmaydi. Demak uchning iks darajasi minus uchga teng bo'lolmaydi, va ortiqcha ildiz ham shundan. | And now a line at height minus three. The curve does not meet it at any point. So three to the power x cannot equal minus three, and that is where the extra root came from. |

---

# Слайд 5. Первый инструмент и правило 1

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Одно основание | Bitta asos | One base |
| строка 1 | `6^(x+7) = 36^(3x)` | то же | то же |
| строка 2 | `36 = 6²` | то же | то же |
| строка 3 | `6^(x+7) = 6^(6x)` | то же | то же |

### Вопрос

Основания стали одинаковыми. Что тогда верно для показателей? / Asoslar bir xil bo'ldi.
Unda ko'rsatkichlar uchun nima to'g'ri? / The bases are now the same. What is then true for
the exponents?

| id | Ответ RU / UZ / EN | Верно | Разбор |
|---|---|---|---|
| `a` | показатели равны / ko'rsatkichlar teng / the exponents are equal | ✓ | — |
| `b` | показатели тоже надо сравнить как основания / ko'rsatkichlarni ham asoslar kabi solishtirish kerak / the exponents must be compared like bases | | **RU** Основания уже одинаковы, сравнивать нечего. Осталось сравнить показатели. · **UZ** Asoslar allaqachon bir xil, solishtiradigan narsa yo'q. Ko'rsatkichlarni solishtirish qoldi. · **EN** The bases are already the same, there is nothing to compare. Only the exponents are left. |
| `c` | нужно взять логарифм / logarifm olish kerak / you must take a logarithm | | **RU** Можно, но это длиннее. Показатели уже видны, брать логарифм не от чего. · **UZ** Mumkin, lekin bu uzunroq. Ko'rsatkichlar allaqachon ko'rinib turibdi. · **EN** You can, but that is longer. The exponents are already visible. |
| `d` | равенство невозможно / tenglik mumkin emas / equality is impossible | | **RU** Возможно. Подставь одну целую четыре десятых и проверь. · **UZ** Mumkin. Bir butun to'rt o'ndan sonini qo'yib tekshiring. · **EN** It is possible. Substitute one point four and check. |

### Карточка правила 1

| Строка | RU | UZ (draft) | EN |
|---|---|---|---|
| закон | `aᶠ = aᵍ ⟺ f = g` при `a > 0`, `a ≠ 1` | `aᶠ = aᵍ ⟺ f = g`, `a > 0`, `a ≠ 1` da | `aᶠ = aᵍ ⟺ f = g` for `a > 0`, `a ≠ 1` |
| 1 | приведи обе части к одному основанию | ikki tomonni bitta asosga keltir | bring both sides to one base |
| 2 | основания равны — приравняй показатели | asoslar teng — ko'rsatkichlarni tenglashtir | bases equal — set the exponents equal |
| 3 | при `a = 1` правило не работает: `1ᶠ = 1ᵍ` всегда | `a = 1` da qoida ishlamaydi: `1ᶠ = 1ᵍ` doim | at `a = 1` the rule fails: `1ᶠ = 1ᵍ` always |
| пример | `6^(x+7) = 36^(3x) → x = 1,4` | то же | то же |

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Картинку мы увидели. Теперь получим то же самое записью. | Rasmni ko'rdik. Endi shuni yozuv bilan olamiz. | We have seen the picture. Now let us get the same in writing. |
| 2 | Слева основание шесть, справа тридцать шесть. Основания разные, и приравнивать показатели пока нельзя. Но тридцать шесть это шесть в квадрате. | Chapda asos olti, o'ngda o'ttiz olti. Asoslar turlicha, ko'rsatkichlarni tenglashtirib bo'lmaydi. Lekin o'ttiz olti bu olti kvadrat. | On the left the base is six, on the right thirty six. The bases differ, so the exponents cannot be equated yet. But thirty six is six squared. |
| 3 | Теперь основания одинаковые, и слева, и справа шесть. | Endi asoslar bir xil, chapda ham, o'ngda ham olti. | Now the bases are the same, six on both sides. |
| 4 | Именно так. Основания одинаковые, значит равны показатели. Икс плюс семь равно шести икс, отсюда икс равен одной целой четырём десятым. | Aynan shunday. Asoslar bir xil, demak ko'rsatkichlar teng. Iks plyus yetti teng olti iks, demak iks bir butun to'rt o'ndan. | Exactly. The bases are the same, so the exponents are equal. x plus seven equals six x, so x is one point four. |

---

# Слайд 6. Новый случай: степень встречается дважды

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | НОВЫЙ СЛУЧАЙ | YANGI HOLAT | A NEW CASE |
| `title` | Степень встречается дважды | Daraja ikki marta uchraydi | The power appears twice |
| `was` | было | edi | before |
| `now` | стало | bo'ldi | now |
| `wasExpr` | `6^(x+7) = 36^(3x)` | то же | то же |
| `nowExpr` | `4ˣ − 2ˣ − 2 = 0` | то же | то же |

### Первый вопрос

Чем вторая запись отличается от первой? / Ikkinchi yozuv birinchisidan nimasi bilan farq
qiladi? / How does the second record differ from the first?

| id | Ответ RU / UZ / EN | Верно | Разбор |
|---|---|---|---|
| `a` | одна и та же степень встречается дважды / bitta daraja ikki marta uchraydi / the same power appears twice | ✓ | — |
| `b` | основание другое / asos boshqa / the base is different | | **RU** Четыре это два в квадрате, значит основание то же самое. Смотри, сколько раз встречается два в степени икс. · **UZ** To'rt bu ikki kvadrat, demak asos o'sha. Ikkining iks darajasi necha marta uchrashiga qarang. · **EN** Four is two squared, so the base is the same. Look at how many times two to the power x appears. |
| `c` | есть свободный член / ozod had bor / there is a constant term | | **RU** Свободный член был и раньше, справа. Он ничего не меняет. · **UZ** Ozod had ilgari ham bor edi, o'ngda. U hech narsani o'zgartirmaydi. · **EN** There was a constant term before, on the right. It changes nothing. |
| `d` | справа ноль / o'ngda nol / the right side is zero | | **RU** Ноль справа это удобно, а не трудно. Трудность левее. · **UZ** O'ngdagi nol qulay, qiyin emas. Qiyinchilik chaproqda. · **EN** Zero on the right is convenient, not hard. The difficulty is further left. |

### Прогноз (оценки нет)

Чему равен корень? / Ildiz nechaga teng? / What does the root equal?

`1` (верно) · `2` · `0` · `корней нет` / `ildiz yo'q` / `no roots`

`afterPredict`: Твоя догадка записана. / Taxminingiz yozib olindi. / Your guess is saved.

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Первое правило готово. Но оно работает не всегда. Смотри, что изменилось. | Birinchi qoida tayyor. Lekin u har doim ishlamaydi. Nima o'zganiga qarang. | The first rule is ready. But it does not always work. Look at what changed. |
| 2 | В прошлом примере основания были разные, и мы свели их к одному. А здесь одно и то же основание встречается дважды, и свести их не к чему. | Oldingi misolda asoslar turlicha edi, biz ularni bittaga keltirdik. Bu yerda esa bitta asos ikki marta uchraydi, keltiradigan joy yo'q. | In the previous example the bases were different and we brought them to one. Here the same base appears twice, and there is nothing to bring together. |
| 3 | Чем эта запись отличается от прежней? | Bu yozuv oldingisidan nimasi bilan farq qiladi? | How does this record differ from the previous one? |
| 4 | Как думаешь, чему равен корень? Просто предположи. | Sizningcha ildiz nechaga teng? Shunchaki taxmin qiling. | What do you think the root is? Just make a guess. |

---

# Слайд 7. Два кандидата, один выживает

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРОВЕРИМ ОБА | IKKISINI HAM TEKSHIRAMIZ | LET US CHECK BOTH |
| `title` | Два кандидата, один выживает | Ikki nomzod, biri qoladi | Two candidates, one survives |
| `expr` | `4ˣ − 2ˣ − 2 = 0`, замена `t = 2ˣ` | `4ˣ − 2ˣ − 2 = 0`, almashtirish `t = 2ˣ` | `4ˣ − 2ˣ − 2 = 0`, substitution `t = 2ˣ` |
| `cardA` | кандидат A: `t = 2` | A nomzod: `t = 2` | candidate A: `t = 2` |
| `cardB` | кандидат B: `t = −1` | B nomzod: `t = −1` | candidate B: `t = −1` |
| `needed` | нужно `t > 0` | `t > 0` kerak | we need `t > 0` |
| `calcA` | `2ˣ = 2`, отсюда `x = 1`; проверка `4 − 2 − 2 = 0` | то же | то же |
| `calcB` | `2ˣ = −1` — степень отрицательной не бывает | `2ˣ = −1` — daraja manfiy bo'lmaydi | `2ˣ = −1` — a power is never negative |
| `answerPrompt` | Запиши корень | Ildizni yozing | Write the root |

Метки итога: `подходит` / `mos keladi` / `fits`; `отпадает` / `tushib qoladi` / `is
discarded`.

### Разбор при неверной записи ответа

**RU** Кандидат B отпал: два в степени икс никогда не равно минус единице. Остался один
корень. · **UZ** B nomzod tushib qoldi: ikkining iks darajasi hech qachon minus birga teng
emas. Bitta ildiz qoldi. · **EN** Candidate B is out: two to the power x is never minus one.
One root remains.

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Ты предположил корень. Проверим оба кандидата. | Siz ildizni taxmin qildingiz. Ikkala nomzodni tekshiramiz. | You guessed the root. Let us check both candidates. |
| 2 | Первый кандидат: тэ равно двум. Значит два в степени икс равно двум, и икс равен единице. Подставим в исходное: четыре минус два минус два, это ноль. Подходит. | Birinchi nomzod: te ikkiga teng. Demak ikkining iks darajasi ikkiga teng, iks birga teng. Boshlang'ich tenglamaga qo'yamiz: to'rt minus ikki minus ikki, bu nol. Mos keladi. | First candidate: t equals two. So two to the power x equals two, and x equals one. Substitute into the original: four minus two minus two, that is zero. It fits. |
| 3 | Второй кандидат: тэ равно минус единице. Значит два в степени икс должно равняться минус единице. Но степень никогда не бывает отрицательной — мы видели это на кривой. Кандидат отпадает. | Ikkinchi nomzod: te minus birga teng. Demak ikkining iks darajasi minus birga teng bo'lishi kerak. Lekin daraja hech qachon manfiy bo'lmaydi, buni chiziqda ko'rdik. Nomzod tushib qoladi. | Second candidate: t equals minus one. So two to the power x would equal minus one. But a power is never negative, we saw that on the curve. The candidate is discarded. |
| 4 | Один кандидат подошёл, другой отпал. Запиши корень сам. | Bir nomzod mos keldi, ikkinchisi tushib qoldi. Ildizni o'zingiz yozing. | One candidate fits, the other is out. Write the root yourself. |

---

# Слайд 8. Правило 2 и одна сводка

### Экранный текст

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПРАВИЛО | QOIDA | THE RULE |
| `title` | Одно правило | Bitta qoida | One rule |
| случай 1 | основания разные — приведи к одному | asoslar turlicha — bittaga keltir | bases differ — bring to one |
| случай 2 | степень дважды — замена `t = aˣ` | daraja ikki marta — almashtirish `t = aˣ` | power twice — substitute `t = aˣ` |
| строка 1 | `4ˣ = (2ˣ)²` | то же | то же |
| строка 2 | `t² − t − 2 = 0`, `t > 0` | то же | то же |

### Вопрос

Зачем сразу писать `t > 0`? / Nega darrov `t > 0` deb yoziladi? / Why write `t > 0` right
away?

| id | Ответ RU / UZ / EN | Верно | Разбор |
|---|---|---|---|
| `a` | степень положительна, и отрицательный корень сразу отпадает / daraja musbat, manfiy ildiz darrov tushib qoladi / a power is positive, so a negative root drops at once | ✓ | — |
| `b` | так принято записывать / shunday yozish qabul qilingan / it is the accepted way | | **RU** Это не оформление. Без этого условия в ответ попадёт лишний корень. · **UZ** Bu rasmiyatchilik emas. Bu shartsiz javobga ortiqcha ildiz kiradi. · **EN** This is not formatting. Without the condition an extra root enters the answer. |
| `c` | чтобы уравнение стало квадратным / tenglama kvadrat bo'lishi uchun / to make the equation quadratic | | **RU** Квадратным его делает замена, а не условие. Условие отсекает лишний корень. · **UZ** Uni kvadrat qiladigan almashtirish, shart emas. Shart ortiqcha ildizni kesadi. · **EN** The substitution makes it quadratic, not the condition. The condition cuts off the extra root. |
| `d` | чтобы икс был положительным / iks musbat bo'lishi uchun / so that x is positive | | **RU** Икс может быть любым, в том числе отрицательным. Положительна степень, а не показатель. · **UZ** Iks har qanday bo'lishi mumkin, manfiy ham. Musbat bo'lgani daraja, ko'rsatkich emas. · **EN** x can be anything, including negative. It is the power that is positive, not the exponent. |

### Карточка правила 2

| Строка | RU | UZ (draft) | EN |
|---|---|---|---|
| 1 | увидь квадрат: `4ˣ = (2ˣ)²` | kvadratni ko'r: `4ˣ = (2ˣ)²` | see the square: `4ˣ = (2ˣ)²` |
| 2 | замена `t = 2ˣ` и сразу условие `t > 0` | almashtirish `t = 2ˣ` va darrov `t > 0` sharti | substitute `t = 2ˣ` and at once the condition `t > 0` |
| 3 | реши квадратное, отбрось `t ≤ 0` | kvadratni yech, `t ≤ 0` ni tashlab yubor | solve the quadratic, discard `t ≤ 0` |
| 4 | вернись к иксу: `2ˣ = t` | iksga qayt: `2ˣ = t` | go back to x: `2ˣ = t` |
| пример | `4ˣ − 2ˣ − 2 = 0 → x = 1` | то же | то же |

### Сводка урока (заменяет карточку)

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | приведи к одному основанию | bitta asosga keltir | bring to one base |
| 2 | основания равны — приравняй показатели | asoslar teng — ko'rsatkichlarni tenglashtir | bases equal — set the exponents equal |
| 3 | степень дважды — замена `t = aˣ`, и `t > 0` | daraja ikki marta — almashtirish `t = aˣ`, va `t > 0` | power twice — substitute `t = aˣ`, and `t > 0` |
| 4 | проверь корень подстановкой в исходное | ildizni boshlang'ich tenglamaga qo'yib tekshir | check the root by substituting into the original |

Кнопка: Собрать одно правило / Bitta qoidaga yig'ish / Combine into one rule

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Кандидаты показали ответ. Теперь запишем способ целиком. | Nomzodlar javobni ko'rsatdi. Endi usulni to'liq yozamiz. | The candidates showed the answer. Now let us write the method in full. |
| 2 | Четыре в степени икс это два в степени икс, возведённое в квадрат. Вот почему замена вообще возможна. | To'rtning iks darajasi bu ikkining iks darajasining kvadrati. Almashtirish shuning uchun mumkin. | Four to the power x is two to the power x squared. That is why the substitution is possible at all. |
| 3 | Делаем замену и сразу пишем условие: тэ больше нуля. Зачем это условие? | Almashtirishni qilamiz va darrov shartni yozamiz: te noldan katta. Bu shart nega kerak? | We substitute and write the condition at once: t is greater than zero. Why this condition? |
| 4 | Верно. Степень положительна, значит отрицательный корень отпадает сразу, а не после проверки. | To'g'ri. Daraja musbat, demak manfiy ildiz tekshiruvdan keyin emas, darrov tushib qoladi. | Correct. A power is positive, so a negative root drops immediately, not after checking. |
| 5 | А теперь собери оба случая в одно правило. | Endi ikkala holatni bitta qoidaga yig'ing. | Now combine both cases into one rule. |

---

# Слайд 9. Поставь основание сам

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ПОСТАВЬ САМ | O'ZINGIZ QO'YING | PLACE IT YOURSELF |
| `title` | Общее основание | Umumiy asos | The common base |
| `left` | `8^(x+1) = 32^(x−1)` | то же | то же |
| `template` | `⬚^(3x+3) = ⬚^(5x−5)` | то же | то же |
| `checkNote` | Проверка: слева `8⁵`, справа `32³` — и то и другое `2¹⁵` | Tekshiruv: chapda `8⁵`, o'ngda `32³` — ikkisi ham `2¹⁵` | Check: `8⁵` on the left, `32³` on the right — both are `2¹⁵` |

Палитра оснований: `2` (верно) · `4` · `8`.

Разборы: `4` — **RU** Тридцать два через четвёрку целой степенью не выражается. · **UZ**
O'ttiz ikki to'rt orqali butun daraja bilan ifodalanmaydi. · **EN** Thirty two is not a
whole power of four. `8` — **RU** Восьмёрка годится слева, а справа тридцать два в целую
степень восьмёрки не превращается. · **UZ** Sakkiz chapda mos keladi, o'ngda esa o'ttiz ikki
sakkizning butun darajasiga aylanmaydi. · **EN** Eight works on the left, but on the right
thirty two is not a whole power of eight.

### Вопрос-формулировка

Почему можно приравнять показатели? / Nega ko'rsatkichlarni tenglashtirish mumkin? / Why may
the exponents be equated?

`функция монотонна: одному значению отвечает один показатель` (верно) · `так удобнее` ·
`потому что основания положительны` · `потому что справа тоже степень`

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Правило собрано. Теперь работаешь ты. | Qoida yig'ildi. Endi siz ishlaysiz. | The rule is assembled. Now it is your turn. |
| 2 | Выбери основание, к которому приводятся обе части. | Ikki tomon keltiriladigan asosni tanlang. | Choose the base to which both sides can be brought. |
| 3 | Получилось. Теперь сформулируй: почему показатели вообще можно приравнивать? | Bo'ldi. Endi ta'riflang: ko'rsatkichlarni umuman nega tenglashtirish mumkin? | Done. Now put it into words: why may the exponents be equated at all? |

---

# Слайд 10. Совместный разбор

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | РАЗБОР | TAHLIL | WORKED SOLUTION |
| `title` | Шаг за шагом | Qadamba-qadam | Step by step |
| `start` | `2^(x+2) + 2ˣ = 5` | то же | то же |

### Действия

| id | RU | UZ (draft) | EN |
|---|---|---|---|
| `factor` | вынести общий множитель | umumiy ko'paytuvchini chiqarish | take out the common factor |
| `addPow` | сложить показатели | ko'rsatkichlarni qo'shish | add the exponents |
| `divide` | разделить обе части | ikki tomonni bo'lish | divide both sides |
| `sameBase` | привести к одному основанию | bitta asosga keltirish | bring to one base |

### Шаги

| # | Верное действие | Строка |
|---:|---|---|
| 1 | `factor` | `2ˣ(4 + 1) = 5` |
| 2 | `divide` | `2ˣ = 1` |
| 3 | `sameBase` | `2ˣ = 2⁰`, `x = 0` |

### Разборы неверных действий

| Действие | RU | UZ (draft) | EN |
|---|---|---|---|
| `addPow` | Подставь ноль. Слева четыре плюс один, это пять — верно. А два в степени два икс плюс два при нуле даёт четыре, и это не пять. Значит записи не равносильны. | Nolni qo'ying. Chapda to'rt plyus bir, bu besh — to'g'ri. Ikkining ikki iks plyus ikki darajasi esa nolda to'rt beradi, bu besh emas. Demak yozuvlar teng kuchli emas. | Substitute zero. On the left four plus one, that is five — correct. But two to the power two x plus two gives four at zero, and that is not five. So the records are not equivalent. |
| `divide` (шаг 1) | Делить пока не на что: слева сумма, а не произведение. | Hozircha bo'ladigan narsa yo'q: chapda yig'indi, ko'paytma emas. | There is nothing to divide by yet: the left side is a sum, not a product. |
| `sameBase` (шаг 1) | Основание уже одно и то же. Трудность в том, что слагаемых два. | Asos allaqachon bir xil. Qiyinchilik shundaki, qo'shiluvchi ikkita. | The base is already the same. The difficulty is that there are two terms. |

Ответ пишет ученик: `x = 0`.

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Ты сформулировал правило. Пройдём пример целиком. | Siz qoidani ta'rifladingiz. Misolni to'liq o'tamiz. | You put the rule into words. Let us go through an example completely. |
| 2 | Здесь основание одно, но слагаемых два. Выбери, с чего начать. | Bu yerda asos bitta, lekin qo'shiluvchi ikkita. Nimadan boshlashni tanlang. | Here the base is one, but there are two terms. Choose where to start. |
| 3 | Теперь запиши корень так, как записал бы на экзамене. | Endi ildizni imtihonda yozganingizdek yozing. | Now write the root the way you would on the exam. |

---

# Слайд 11. Самостоятельно, без прямой

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | САМОСТОЯТЕЛЬНО | MUSTAQIL | ON YOUR OWN |
| `title` | Реши уравнение | Tenglamani yeching | Solve the equation |
| `start` | `9ˣ − 10·3ˣ + 9 = 0` | то же | то же |
| `hint` | Оба корня замены положительны. Значит ни один не отбрасывается. | Almashtirishning ikkala ildizi ham musbat. Demak biri ham tashlanmaydi. | Both roots of the substitution are positive. So neither is discarded. |
| `answerPrompt` | Запиши оба корня | Ikkala ildizni yozing | Write both roots |

Шаги: замена `t = 3ˣ` → `t² − 10t + 9 = 0` → `t = 1` и `t = 9` → `x = 0` и `x = 2`.

### Разборы неверного ответа

| Ответ | RU | UZ (draft) | EN |
|---|---|---|---|
| только `2` | Проверь ноль: единица минус десять плюс девять, это ноль. Значит ноль тоже корень. | Nolni tekshiring: bir minus o'n plyus to'qqiz, bu nol. Demak nol ham ildiz. | Check zero: one minus ten plus nine, that is zero. So zero is a root as well. |
| только `0` | Проверь двойку: восемьдесят один минус девяносто плюс девять, это ноль. Значит двойка тоже корень. | Ikkini tekshiring: sakson bir minus to'qson plyus to'qqiz, bu nol. Demak ikki ham ildiz. | Check two: eighty one minus ninety plus nine, that is zero. So two is a root as well. |
| прочее | Оба корня замены положительны, значит оба дают икс. | Almashtirishning ikkala ildizi musbat, demak ikkisi ham iks beradi. | Both roots of the substitution are positive, so both give an x. |

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Теперь полностью сам, как на экзамене. | Endi to'liq mustaqil, xuddi imtihondagidek. | Now completely on your own, as on the exam. |
| 2 | Смотри на основание и помни про условие для тэ. | Asosga qarang va te uchun shartni yodda tuting. | Look at the base and remember the condition for t. |
| 3 | Запиши ответ. Если корней два — оба. | Javobni yozing. Ildiz ikkita bo'lsa — ikkisini ham. | Write the answer. If there are two roots, write both. |

---

# Слайд 12. Блиц: шесть вопросов

`eyebrow` БЛИЦ / BLITS / QUICK ROUND · `title` Шесть вопросов / Olti savol / Six questions

| № | Вопрос | Варианты | Верно | Тег |
|---:|---|---|---|---|
| 1 | Сколько корней у `7ˣ = −49`? | `ни одного` · `один` · `два` · `бесконечно много` | `ни одного` | `positive_power` |
| 2 | `2^(x+1) = 8` | `2` · `3` · `4` · `1` | `2` | `same_base` |
| 3 | В каком уравнении нужна замена `t = aˣ`? | `25ˣ − 6·5ˣ + 5 = 0` · `5ˣ = 25` · `5^(x+1) = 5^(2x)` · `5x² − 6x + 5 = 0` | `25ˣ − 6·5ˣ + 5 = 0` | `substitution` |
| 4 | Ты получил `x = 1` для `4ˣ − 2ˣ − 2 = 0`. Как быстрее всего убедиться? | `подставить в исходное` · `решить второй раз тем же способом` · `посмотреть в ответы` · `посчитать, сколько корней` | `подставить в исходное` | `check_by_point` |
| 5 | `3ˣ · 3^(x+1) = 81` | `1,5` · `3` · `4` · `2` | `1,5` | `same_base` |
| 6 | `(1/2)ˣ = 8` | `−3` · `3` · `1/3` · `−1/3` | `−3` | `neg_exponent` |

### Разборы

| № | Неверный | RU | UZ (draft) | EN |
|---:|---|---|---|---|
| 1 | `один` | Степень семёрки положительна при любом иксе, а справа минус сорок девять. | Yettining darajasi har qanday iksda musbat, o'ngda esa minus qirq to'qqiz. | A power of seven is positive for any x, while the right side is minus forty nine. |
| 1 | `два` | Кривая не встречает эту прямую ни разу, а не дважды. | Chiziq bu to'g'ri chiziqni ikki marta emas, umuman uchratmaydi. | The curve does not meet that line twice, it does not meet it at all. |
| 2 | `3` | Восемь это два в кубе, значит икс плюс один равно трём. | Sakkiz bu ikki kub, demak iks plyus bir uchga teng. | Eight is two cubed, so x plus one equals three. |
| 3 | `5ˣ = 25` | Здесь степень одна, замена не нужна: двадцать пять это пять в квадрате. | Bu yerda daraja bitta, almashtirish kerak emas: yigirma besh bu besh kvadrat. | Here there is only one power, no substitution is needed: twenty five is five squared. |
| 4 | `решить второй раз тем же способом` | Тем же способом повторишь ту же ошибку. Нужна независимая проверка. | O'sha usul bilan o'sha xatoni takrorlaysiz. Mustaqil tekshiruv kerak. | The same way will repeat the same mistake. You need an independent check. |
| 5 | `3` | Слева степени перемножаются, значит показатели складываются: два икс плюс один. | Chapda darajalar ko'paytiriladi, demak ko'rsatkichlar qo'shiladi: ikki iks plyus bir. | On the left the powers multiply, so the exponents add: two x plus one. |
| 6 | `3` | Одна вторая это два в минус первой степени. Минус не потеряй. | Bir ikkidan bu ikkining minus birinchi darajasi. Minusni yo'qotmang. | One half is two to the power minus one. Do not lose the minus. |

Первая реплика: Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат. /
Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi. / Let us check what
stuck. Six quick questions, they count towards the result.

---

# Слайд 13. Все шаги выглядят верными

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | НАЙДИ ОШИБКУ | XATONI TOPING | FIND THE ERROR |
| `title` | Шаги верны, ответ нет | Qadamlar to'g'ri, javob xato | Steps right, answer wrong |
| строки | `6^(x+7) = 36^(3x)` · `x + 7 = 3x` · `2x = 7` · `x = 3,5` | то же | то же |
| `proofPoint` | `x = 3,5` | то же | то же |
| `proof` | Слева `6^10,5`, справа `36^10,5`. Основание справа больше, значит и всё выражение больше. Равенства нет. Верно: `36 = 6²`, тогда `x + 7 = 6x` и `x = 1,4`. | Chapda `6^10,5`, o'ngda `36^10,5`. O'ngdagi asos katta, demak butun ifoda ham katta. Tenglik yo'q. To'g'risi: `36 = 6²`, unda `x + 7 = 6x` va `x = 1,4`. | On the left `6^10,5`, on the right `36^10,5`. The base on the right is larger, so the whole expression is larger. There is no equality. Correct: `36 = 6²`, then `x + 7 = 6x` and `x = 1,4`. |

Разборы на неверные строки: строка 1 — Это исходное уравнение, ошибки в нём быть не может. ·
строка 3 — Из строки 2 это следует верно. Ошибка пришла раньше. · строка 4 — Ответ
действительно неверный. Но неверным он стал раньше, найди, где именно.

### Второй вопрос

Какое правило нарушено? / Qaysi qoida buzilgan? / Which rule was broken?

`основания разные, сначала привести к одному` (верно) · `показатели нельзя приравнивать` ·
`перенос слагаемого` · `порядок действий`

---

# Слайд 14. Собери сам

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | СОБЕРИ САМ | O'ZINGIZ YIG'ING | BUILD IT YOURSELF |
| `title` | Собери обратно | Teskari yig'ing | Build it back |
| `target` | Целевой корень | Maqsad ildizi | Target root |
| задание 1 | Пусть основание будет 2 | Asosi 2 bo'lsin | Let the base be 2 |
| задание 2 | А теперь основание 3, а корень тот же | Endi asosi 3, ildiz esa o'sha | Now base 3, with the same root |

Части: `2ˣ` · `3ˣ` · `=` · `8` · `9` · `27`. Верно: `2ˣ = 8`, затем `3ˣ = 27`.

Разборы: `2ˣ = 9` — Девять это не степень двойки. · `3ˣ = 9` — Это верно, но корень
получается два, а нужен три. · `2ˣ = 27` — Двадцать семь это не степень двойки.

---

# Слайд 15. Итог

| Ключ | RU | UZ (draft) | EN |
|---|---|---|---|
| `eyebrow` | ИТОГ | YAKUN | SUMMARY |
| `title` | Что нового на уроке | Nimani o'rgandingiz | What you learned |
| `backToHook` | То, с чего начали | Boshlagan narsamiz | Where we started |

Три шага правила — те же, что в сводке слайда 8 (строки 1, 3, 4).

Возврат к хуку: `9ˣ − 6·3ˣ − 27 = 0` → `t = 3ˣ, t > 0` → `t = 9` или `t = −3`, минус три
отбрасываем → `3ˣ = 9`, `x = 2`, корень один.

### Финальный вопрос

Как проверить свой корень? / Ildizingizni qanday tekshirasiz? / How do you check your root?

`подставить его в исходное уравнение` (верно) · `решить второй раз тем же способом` ·
`посмотреть в ответы` · `никак`

### Уровень готовности

6 из 6 — Этот тип задач на ДТМ у тебя закрыт. · 4–5 — Одно место требует повтора. · 3 и
меньше — Вернись к правилу и к экрану с двумя кандидатами.

### Озвучка

| # | RU | UZ (draft) | EN |
|---:|---|---|---|
| 1 | Урок закончен. Вернёмся к началу. | Dars tugadi. Boshiga qaytamiz. | The lesson is over. Let us go back to the start. |
| 2 | Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли. | Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik. | Here is your guess and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked. |
| 3 | А вот уравнение, с которого урок начался. Теперь оно решается за три шага, и лишний корень отпадает сам. | Mana dars boshlangan tenglama. Endi u uch qadamda yechiladi, ortiqcha ildiz esa o'zi tushib qoladi. | And here is the equation the lesson began with. Now it takes three steps, and the extra root drops by itself. |
| 4 | И главное: если сомневаешься в корне, есть способ проверить самому. | Va eng muhimi: ildizga ishonchingiz bo'lmasa, o'zingiz tekshirish usuli bor. | And the main thing: if you are unsure of your root, there is a way to check it yourself. |

---

## Узбекские термины — DRAFT

| RU | UZ (draft) | Комментарий |
|---|---|---|
| показательное уравнение | ko'rsatkichli tenglama | нужна проверка предметника |
| основание | asos | устоялось |
| показатель степени | daraja ko'rsatkichi | устоялось |
| замена переменной | almashtirish · o'zgaruvchini almashtirish | проверить, какой вариант принят в школе |
| корень уравнения | ildiz | устоялось |
| отбросить корень | tashlab yubormoq | проверить |
| монотонная функция | monoton funksiya | проверить |
| свободный член | ozod had | проверить |
| вынести общий множитель | umumiy ko'paytuvchini chiqarish | проверить |

**Отдельно на проверку три:** `almashtirish` (замена), `ozod had` (свободный член),
`tashlab yubormoq` (отбросить).
